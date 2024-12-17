using System.ComponentModel.DataAnnotations;

namespace VirtualTeacherGenAIDemo.Server.Options;

/// <summary>
/// Configuration settings for connecting to Azure CosmosDB.
/// </summary>
public class CosmosOptions
{
    public const string PropertyName = "Cosmos";

    /// <summary>
    /// Gets or sets the authentication method for CosmosDB.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string AuthMethod { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cosmos database name.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string Database { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cosmos connection string.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string ConnectionString { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cosmos container for chat sessions.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string MessageContainer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the partition key for the message container.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string MessagePartitionKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cosmos container for dashboard.
    /// </summary>  
    [Required, NotEmptyOrWhitespace]
    public string DashboardContainer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the partition key for the dashboard container.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string DashboardPartitionKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cosmos container for agents.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string AgentContainer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the partition key for the agent container.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string AgentPartitionKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cosmos container for scenarios.
    /// </summary>  
    [Required, NotEmptyOrWhitespace]
    public string ScenarioContainer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the partition key for the scenario container.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string ScenarioPartitionKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cosmos container for sessions.
    /// </summary>  
    [Required, NotEmptyOrWhitespace]
    public string SessionContainer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the partition key for the session container.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string SessionPartitionKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cosmos container for users.
    /// </summary>  
    [Required, NotEmptyOrWhitespace]
    public string UserContainer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the partition key for the user container.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string UserPartitionKey { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cosmos container for locales.
    /// </summary>  
    [Required, NotEmptyOrWhitespace]
    public string LocaleContainer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the partition key for the Locales container.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string LocalePartitionKey { get; set; } = string.Empty;


    /// <summary>
    /// Gets or sets the Cosmos endpoint.
    /// </summary>  
    [Required, NotEmptyOrWhitespace]
    public string EndPoint { get; set; } = string.Empty;
}
