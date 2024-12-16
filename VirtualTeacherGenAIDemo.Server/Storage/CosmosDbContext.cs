using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Azure.Identity;
using Microsoft.Azure.Cosmos;
using Microsoft.Extensions.Options;
using VirtualTeacherGenAIDemo.Server.Options;

namespace VirtualTeacherGenAIDemo.Server.Storage;

/// <summary>
/// A storage context that stores entities in a CosmosDB container.
/// </summary>
public class CosmosDbContext<T> : IStorageContext<T>, IDisposable where T : IStorageEntity
{
    /// <summary>
    /// The CosmosDB client.
    /// </summary>
    private readonly CosmosClient _client;

    /// <summary>
    /// CosmosDB container.
    /// </summary>
    private readonly Container _container;

    /// <summary>
    /// Initializes a new instance of the CosmosDbContext class.
    /// </summary>
    /// <param name="cosmosOptions">The CosmosDB options.</param>
    /// <param name="containerName">The CosmosDB container name.</param>
    public CosmosDbContext(CosmosOptions cosmosOptions, string containerName, string partitionKey)
    {
        

        // Configure JsonSerializerOptions
        var clientOptions = new CosmosClientOptions
        {
            SerializerOptions = new CosmosSerializationOptions
            {
                PropertyNamingPolicy = CosmosPropertyNamingPolicy.CamelCase
            },
        };

        if (cosmosOptions.AuthMethod == "Key")
        {
            this._client = new CosmosClient(cosmosOptions.ConnectionString, clientOptions);
        }
        else if (cosmosOptions.AuthMethod == "ManagedIdentity")
        {
            this._client = new CosmosClient(cosmosOptions.EndPoint, new DefaultAzureCredential(), clientOptions);
        }
        else
        {
            throw new InvalidOperationException("Invalid CosmosDB authentication method specified.");
        }

        // Create database if it does not exist
        var databaseResponse = this._client.CreateDatabaseIfNotExistsAsync(cosmosOptions.Database).GetAwaiter().GetResult();
        var databaseInstance = databaseResponse.Database;

        // Create container if it does not exist
        var containerResponse = databaseInstance.CreateContainerIfNotExistsAsync(containerName, $"/{partitionKey}").GetAwaiter().GetResult();
        this._container = containerResponse.Container;
    }

    /// <inheritdoc/>
    public async Task<IEnumerable<T>> QueryEntitiesAsync(Func<T, bool> predicate)
    {
        return await Task.Run<IEnumerable<T>>(
            () => this._container.GetItemLinqQueryable<T>(true).Where(predicate).AsEnumerable());
    }

    /// <inheritdoc/>
    public async Task CreateAsync(T entity)
    {
        if (string.IsNullOrWhiteSpace(entity.Id))
        {
            throw new ArgumentOutOfRangeException(nameof(entity.Id), "Entity Id cannot be null or empty.");
        }

        await this._container.CreateItemAsync(entity, new PartitionKey(entity.Partition));
    }

    /// <inheritdoc/>
    public async Task DeleteAsync(T entity)
    {
        if (string.IsNullOrWhiteSpace(entity.Id))
        {
            throw new ArgumentOutOfRangeException(nameof(entity.Id), "Entity Id cannot be null or empty.");
        }

        await this._container.DeleteItemAsync<T>(entity.Id, new PartitionKey(entity.Partition));
    }

    /// <inheritdoc/>
    public async Task<T> ReadAsync(string entityId, string partitionKey)
    {
        if (string.IsNullOrWhiteSpace(entityId))
        {
            throw new ArgumentOutOfRangeException(nameof(entityId), "Entity Id cannot be null or empty.");
        }

        try
        {
            var response = await this._container.ReadItemAsync<T>(entityId, new PartitionKey(partitionKey));
            return response.Resource;
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            throw new KeyNotFoundException($"Entity with id {entityId} not found.");
        }
    }

    /// <inheritdoc/>
    public async Task UpsertAsync(T entity)
    {
        if (string.IsNullOrWhiteSpace(entity.Id))
        {
            throw new ArgumentOutOfRangeException(nameof(entity.Id), "Entity Id cannot be null or empty.");
        }

        await this._container.UpsertItemAsync(entity, new PartitionKey(entity.Partition));
    }

    public void Dispose()
    {
        this.Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            this._client.Dispose();
        }
    }
}
