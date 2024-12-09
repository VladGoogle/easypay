resource "random_pet" "rg-name" {
  prefix = var.resource_group_name_prefix
}

resource "random_string" "db_random" {
  length  = 6
  special = false
  upper   = false
}

resource "random_string" "redis_random" {
  length  = 6
  special = false
  upper   = false
}

resource "random_string" "pip_random" {
  length  = 6
  special = false
  upper   = false
}

resource "random_string" "app_gateway_random" {
  length  = 6
  special = false
  upper   = false
}

resource "azurerm_resource_group" "rg" {
  name     = random_pet.rg-name.id
  location = var.location
}

resource "azurerm_role_assignment" "rg_network_contributor" {
  scope                = azurerm_resource_group.rg.id
  role_definition_name = "Network Contributor"
  principal_id         = var.service_principal

  depends_on = [
    azurerm_resource_group.rg
  ]
}

resource "azurerm_virtual_network" "vnet" {
  name                = var.vnet_name
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  address_space       = var.vnet_address_space

  subnet {
    name             = var.aks_subnet_name
    address_prefixes = var.aks_subnet_address_prefix
  }
}

resource "azurerm_role_assignment" "vnet_network_contributor" {
  scope                = azurerm_virtual_network.vnet.id
  role_definition_name = "Network Contributor"
  principal_id         = var.service_principal

  depends_on = [
    azurerm_virtual_network.vnet
  ]
}

data "azurerm_subnet" "kubesubnet" {
  name                 = var.aks_subnet_name
  virtual_network_name = azurerm_virtual_network.vnet.name
  resource_group_name  = azurerm_resource_group.rg.name
  depends_on           = [azurerm_virtual_network.vnet]
}

resource "azurerm_public_ip" "external_be_lb_public_ip" {
  name                = var.external_be_lb_pip_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  allocation_method   = "Static"
}

resource "azurerm_public_ip" "external_fe_lb_public_ip" {
  name                = var.external_fe_lb_pip_name
  resource_group_name = azurerm_resource_group.rg.name
  location            = azurerm_resource_group.rg.location
  allocation_method   = "Static"
}

resource "azurerm_kubernetes_cluster" "k8s" {
  name                    = var.aks_name
  location                = azurerm_resource_group.rg.location
  dns_prefix              = var.aks_dns_prefix
  private_cluster_enabled = var.private_cluster
  resource_group_name     = azurerm_resource_group.rg.name
  sku_tier                = var.aks_sku_tier

  linux_profile {
    admin_username = var.vm_user_name

    ssh_key {
      key_data = file(var.public_ssh_key_path)
    }
  }

  default_node_pool {
    name            = "agentpool"
    node_count      = var.aks_agent_count
    vm_size         = var.aks_agent_vm_size
    os_disk_size_gb = var.aks_agent_os_disk_size
    vnet_subnet_id  = data.azurerm_subnet.kubesubnet.id
  }

  network_profile {
    network_plugin    = "kubenet"
    dns_service_ip    = var.aks_dns_service_ip
    service_cidr      = var.aks_service_cidr
    load_balancer_sku = "standard"
  }

  service_principal {
    client_id     = var.client_id
    client_secret = var.client_secret
  }

  role_based_access_control_enabled = true

  depends_on = [data.azurerm_subnet.kubesubnet]

  tags = {
    environment = "test"
  }
}

resource "azurerm_subnet" "db_subnet" {
  name                 = var.db_subnet_name
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = var.db_subnet_address_prefix
}

resource "azurerm_postgresql_flexible_server" "db_server" {
  name                = "${random_string.db_random.result}-postgresql"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  sku_name   = var.pg_sku_name
  version    = var.pg_version
  storage_mb = var.pg_storage

  administrator_login    = var.pg_login
  administrator_password = var.pg_password
}

resource "azurerm_postgresql_flexible_server_configuration" "require_secure_transport" {
  name      = "require_secure_transport"
  value     = "OFF"
  server_id = azurerm_postgresql_flexible_server.db_server.id

  depends_on = [
    azurerm_postgresql_flexible_server.db_server
  ]
}

resource "azurerm_postgresql_flexible_server_firewall_rule" "psql_firewall_rule" {
  name             = "psql-fw"
  server_id        = azurerm_postgresql_flexible_server.db_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"

  depends_on = [
    azurerm_postgresql_flexible_server.db_server
  ]
}

resource "azurerm_postgresql_flexible_server_database" "db" {
  name      = var.db_name
  server_id = azurerm_postgresql_flexible_server.db_server.id
  collation = "en_US.utf8"
  charset   = "utf8"

  lifecycle {
    prevent_destroy = false
  }

  depends_on = [
    azurerm_postgresql_flexible_server.db_server
  ]
}

resource "azurerm_private_endpoint" "db_endpoint" {
  name                = "${random_string.db_random.result}-endpoint"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = azurerm_subnet.db_subnet.id

  depends_on = [
    azurerm_postgresql_flexible_server_database.db
  ]

  private_service_connection {
    name                           = "${random_string.db_random.result}-privateserviceconnection"
    private_connection_resource_id = azurerm_postgresql_flexible_server.db_server.id
    subresource_names              = ["postgresqlServer"]
    is_manual_connection           = false
  }
}

resource "azurerm_network_security_group" "db_endpoint_nsg" {
  name                = "${random_string.db_random.result}-nsg"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  depends_on = [
    azurerm_private_endpoint.db_endpoint
  ]
}

resource "azurerm_subnet_network_security_group_association" "db_subnet_nsg_assoc" {
  subnet_id                 = azurerm_subnet.db_subnet.id
  network_security_group_id = azurerm_network_security_group.db_endpoint_nsg.id
}

resource "azurerm_network_security_rule" "allow_aks_to_private_db_endpoint" {
  resource_group_name         = azurerm_resource_group.rg.name
  name                        = "AllowAKSToPrivateDBEndpoint"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "*"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = join(",", data.azurerm_subnet.kubesubnet.address_prefixes)
  destination_address_prefix  = join(",", azurerm_subnet.db_subnet.address_prefixes)
  network_security_group_name = azurerm_network_security_group.db_endpoint_nsg.name
}

resource "azurerm_subnet" "redis_subnet" {
  name                 = var.redis_subnet_name
  resource_group_name  = azurerm_resource_group.rg.name
  virtual_network_name = azurerm_virtual_network.vnet.name
  address_prefixes     = var.redis_subnet_address_prefixes
}

resource "azurerm_redis_cache" "redis_cache" {
  name                = "${random_string.redis_random.result}-redis"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  capacity            = var.redis_capacity
  family              = var.redis_sku_family
  sku_name            = var.redis_sku_name
}

resource "azurerm_private_endpoint" "redis_endpoint" {
  name                = "${random_string.redis_random.result}-endpoint"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name
  subnet_id           = azurerm_subnet.redis_subnet.id

  depends_on = [
    azurerm_subnet.redis_subnet
  ]

  private_service_connection {
    name                           = "${random_string.redis_random.result}-privateserviceconnection"
    private_connection_resource_id = azurerm_redis_cache.redis_cache.id
    subresource_names              = ["redisCache"]
    is_manual_connection           = false
  }
}

resource "azurerm_network_security_group" "redis_endpoint_nsg" {
  name                = "${random_string.redis_random.result}-nsg"
  location            = var.location
  resource_group_name = azurerm_resource_group.rg.name

  depends_on = [
    azurerm_private_endpoint.redis_endpoint
  ]
}

resource "azurerm_subnet_network_security_group_association" "redis_subnet_nsg_assoc" {
  subnet_id                 = azurerm_subnet.redis_subnet.id
  network_security_group_id = azurerm_network_security_group.redis_endpoint_nsg.id
}

resource "azurerm_network_security_rule" "allow_aks_to_private_redis_endpoint" {
  resource_group_name         = azurerm_resource_group.rg.name
  name                        = "AllowAKSToPrivateRedisEndpoint"
  priority                    = 100
  direction                   = "Inbound"
  access                      = "Allow"
  protocol                    = "*"
  source_port_range           = "*"
  destination_port_range      = "*"
  source_address_prefix       = join(",", data.azurerm_subnet.kubesubnet.address_prefixes)
  destination_address_prefix  = join(",", azurerm_subnet.redis_subnet.address_prefixes)
  network_security_group_name = azurerm_network_security_group.redis_endpoint_nsg.name
}

resource "azurerm_dns_zone" "dns_zone" {
  name                = var.dns_zone_name
  resource_group_name = azurerm_resource_group.rg.name
}


resource "azurerm_dns_a_record" "app_record" {
  name                = "app"
  zone_name           = azurerm_dns_zone.dns_zone.name
  resource_group_name = azurerm_resource_group.rg.name
  ttl                 = 300
  records             = [azurerm_public_ip.external_fe_lb_public_ip.ip_address]
}


resource "azurerm_dns_a_record" "api_record" {
  name                = "api"
  zone_name           = azurerm_dns_zone.dns_zone.name
  resource_group_name = azurerm_resource_group.rg.name
  ttl                 = 300
  records             = [azurerm_public_ip.external_be_lb_public_ip.ip_address]
}

