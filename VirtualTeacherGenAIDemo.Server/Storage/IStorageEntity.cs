namespace VirtualTeacherGenAIDemo.Server.Storage;

public interface IStorageEntity
{
    /// <summary>
    /// Unique ID of the entity.
    /// </summary>
    string Id { get; set; }

    /// <summary>
    /// Partition key value.
    /// </summary>
    string Partition { get; }
}
