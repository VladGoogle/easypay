variable "subscription_id" {
  description = "Subscription id in Azure"
}

variable "resource_group_name_prefix" {
  description = "Resource group prefix"
}

variable "location" {
  description = "Resource group location"
}

variable "vnet_address_space" {
  description = "Virtual network address space"
}

variable "vnet_name" {
  description = "Virtual network name"
}

variable "service_principal" {
  description = "Service principal"
}

variable "aks_subnet_name" {
  description = "AKS subnet name"
}

variable "db_subnet_name" {
  description = "DB subnet name"
}

variable "aks_subnet_address_prefix" {
  description = "AKS subnet address prefix"
}

variable "aks_name" {
  description = "AKS name"
}

variable "aks_dns_prefix" {
  description = "AKS dns prefix"
}

variable "private_cluster" {
  description = "AKS private cluster"
}

variable "vm_user_name" {
  description = "VM user name"
}

variable "public_ssh_key_path" {
  description = "VM user name"
}

variable "aks_agent_count" {
  description = "AKS agent count"
}

variable "aks_agent_vm_size" {
  description = "AKS agent vm size"
}

variable "aks_sku_tier" {
  description = "AKS sku tier"
}

variable "aks_agent_os_disk_size" {
  description = "AKS agent vm size"
}

variable "client_id" {
  description = "Azure Kubernetes Service Cluster service principal client id"
}

variable "client_secret" {
  description = "Azure Kubernetes Service Cluster service principal client secret"
}

variable "aks_dns_service_ip" {
  description = "Azure Kubernetes Service Cluster service principal client secret"
}

variable "aks_docker_bridge_cidr" {
  description = "Azure Kubernetes Service Cluster service principal client secret"
}

variable "aks_service_cidr" {
  description = "Azure Kubernetes Service Cluster service principal client secret"
}

variable "db_subnet_address_prefix" {
  description = "DB subnet address prefix"
}

variable "pg_sku_name" {
  description = "Postgres sku instance"
}

variable "pg_version" {
  description = "Postgres version"
}

variable "pg_storage" {
  description = "Postgres storage volume"
}

variable "pg_login" {
  description = "Postgres storage volume"
}

variable "pg_password" {
  description = "Postgres storage volume"
}

variable "db_name" {
  description = "DB name"
}

variable "redis_subnet_name" {
  description = "Redis subnet name"
}

variable "redis_subnet_address_prefixes" {
  description = "Redis subnet address prefixes"
}

variable "redis_capacity" {
  description = "Redis cache capacity"
}

variable "redis_sku_family" {
  description = "Redis sku family"
}

variable "redis_sku_name" {
  description = "Redis sku name"
}

variable "app_gateway_subnet_name" {
  description = "App gateway subnet name"
}

variable "app_gateway_subnet_address_prefixes" {
  description = "App gateway subnet name"
}

variable "app_gateway_sku_name" {
  description = "App gateway sku name"
}

variable "app_gateway_sku_capacity" {
  description = "App gateway sku capacity"
}

variable "internal_lb_ip" {
  description = "Internal lb ip"
}

variable "internal_lb_port" {
  description = "Internal lb port"
}

variable "dns_zone_name" {
  description = "DNS zone name"
}

variable "external_be_lb_pip_name" {
  description = "External BE LB pip name"
}

variable "external_fe_lb_pip_name" {
  description = "Internal FE LB pip name"
}