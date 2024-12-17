# Define the provider
provider "azurerm" {
  features {}
  subscription_id = var.subscription_id
}

# Reference to an existing resource group
data "azurerm_resource_group" "rg" {
  name = "rg-virtual-teacher-demo-wus"
}

# Reference to an existing App Service Plan
data "azurerm_app_service_plan" "existing_plan" {
  name                = "ASP-rgvirtualteacherdemowus-8ff3"
  resource_group_name = data.azurerm_resource_group.rg.name
}

# Reference to an existing App Service (Web App)
data "azurerm_app_service" "existing_webapp" {
  name                = "webapp-virtual-teacher"
  resource_group_name = data.azurerm_resource_group.rg.name
}

# Deploy code to the existing Web App
resource "azurerm_app_service_slot" "deployment_slot" {
  name                = "staging"
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  app_service_plan_id = data.azurerm_app_service_plan.existing_plan.id
  app_service_name    = data.azurerm_app_service.existing_webapp.name

  site_config {
    scm_type = "LocalGit"
  }
}