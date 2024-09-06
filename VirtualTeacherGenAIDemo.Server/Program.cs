using VirtualTeacherGenAIDemo.Server.Extensions;
using VirtualTeacherGenAIDemo.Server.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services
    .AddSingleton<ILogger>(sp => sp.GetRequiredService<ILogger<Program>>()) // some services require an un-templated ILogger
    .AddOptions(builder.Configuration)
    .AddPersistenceMessages()
    .AddAIResponses()
    .AddServices()
    .AddSemanticKernelServices()
    .AddChatCompletionService();

builder.Services.AddSignalR(options => options.MaximumParallelInvocationsPerClient = 10);

builder.Services.AddCorsPolicy();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.MapHub<MessageRelayHub>("/messageRelayHub");


app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
