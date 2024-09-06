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
    public string HistoryContainer { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Cosmos container for dashboard.
    /// </summary>  
    [Required , NotEmptyOrWhitespace]
    public string DashboardContainer { get; set; } = string.Empty;
        

}
