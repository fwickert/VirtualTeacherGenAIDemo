# Define the provider
provider "azurerm" {
  features {}
}

# Reference to an existing resource group
data "azurerm_resource_group" "rg" {
  name = "rg-virtual-teacher-demo-wus"
}

# Define the App Service Plan
resource "azurerm_app_service_plan" "appserviceplan" {
  name                = "plan-virtual-teacher-demo-wus"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  sku {
    tier = "Standard"
    size = "S1"
  }
}

# Define the App Service
resource "azurerm_app_service" "appservice" {
  name                = "webapp-virtual-teacher-demo-wus"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  app_service_plan_id = azurerm_app_service_plan.appserviceplan.id

  site_config {
    dotnet_framework_version = "v4.0"
  }
}