using System.ComponentModel.DataAnnotations;

namespace VirtualTeacherGenAIDemo.Server.Options;

/// <summary>
/// Configuration settings for connecting to Azure CosmosDB.
/// </summary>
public class CosmosOptions
{
    public const string PropertyName = "Cosmos";

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
    /// Gets or sets the Cosmos container for dashboard.
    /// </summary>  
    [Required , NotEmptyOrWhitespace]
    public string DashboardContainer { get; set; } = string.Empty;

    //same for AgentContainer
    /// <summary>
    ///  Gets or sets the Cosmos container for agents.
    /// </summary>
    [Required, NotEmptyOrWhitespace]
    public string AgentContainer { get; set; } = string.Empty;

    //Add new contrainer for Scenario
    /// <summary>
    /// gets or sets the Cosmos container for scenarios
    /// </summary>  
    [Required, NotEmptyOrWhitespace]
    public string ScenarioContainer { get; set; } = string.Empty;

    [Required, NotEmptyOrWhitespace]
    public string SessionContainer { get; set; } = string.Empty;

    [Required, NotEmptyOrWhitespace]
    public string EndPoint { get; set; } = string.Empty;

    

}
