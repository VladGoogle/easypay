subscription_id            = "00000000-0000-0000-0000-000000000000"
resource_group_name_prefix = "rg-example"
location                   = "westus"
service_principal          = "11111111-1111-1111-1111-111111111111"

client_id     = "22222222-2222-2222-2222-222222222222"
client_secret = "example-client-secret"

vnet_name          = "example-vnet"
vnet_address_space = ["10.1.0.0/16"]

aks_subnet_name           = "example-aks-subnet"
aks_subnet_address_prefix = ["10.1.1.0/24"]
aks_name                  = "example-aks-cluster"
aks_dns_prefix            = "exampleaksdns"
aks_agent_count           = 3
aks_agent_os_disk_size    = 50
aks_agent_vm_size         = "Standard_B2ms"
private_cluster           = true
vm_user_name              = "exampleuser"
public_ssh_key_path       = "~/.ssh/example_id_rsa.pub"
aks_dns_service_ip        = "10.2.0.10"
aks_docker_bridge_cidr    = "172.18.0.1/16"
aks_service_cidr          = "10.2.0.0/16"
aks_sku_tier              = "Paid"

db_subnet_name           = "example-db-subnet"
db_subnet_address_prefix = ["10.1.2.0/24"]
db_name                  = "example_db"
pg_sku_name              = "GP_Standard_B4ms"
pg_version               = 14
pg_storage               = 51200
pg_login                 = "examplepgadmin"
pg_password              = "ExamplePassword123!"

redis_subnet_name             = "example-redis-subnet"
redis_subnet_address_prefixes = ["10.1.3.0/24"]
redis_capacity                = 1
redis_sku_family              = "C"
redis_sku_name                = "Premium"

app_gateway_subnet_name             = "example-app-gateway-subnet"
app_gateway_subnet_address_prefixes = ["10.1.4.0/24"]
app_gateway_sku_name                = "Standard_v2"
app_gateway_sku_capacity            = 3
internal_lb_ip                      = "10.2.0.20"
internal_lb_port                    = 8080

external_be_lb_pip_name = "example-external-be-lb-pip"
external_fe_lb_pip_name = "example-internal-fe-lb-pip"
dns_zone_name           = "example.com"
