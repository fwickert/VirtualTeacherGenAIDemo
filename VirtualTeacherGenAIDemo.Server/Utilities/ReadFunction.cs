namespace VirtualTeacherGenAIDemo.Server.Utilities
{

    public enum FunctionFileType
    {
        Prompt,
        Config
    }
    public class ReadFunction
    {
        public async static Task<string?> Read(string path, FunctionFileType skillFileType)
        {
            switch (skillFileType)
            {
                case FunctionFileType.Prompt:
                    return await File.ReadAllTextAsync(System.IO.Path.Combine(path, "skprompt.txt"));

                case FunctionFileType.Config:
                    return await File.ReadAllTextAsync(System.IO.Path.Combine(path, "config.json"));

                default:
                    break;
            }
            return default;

        }
    }
}
