using Microsoft.AspNetCore.Http.Features;
using VirtualTeacherGenAIDemo.Server.Extensions;
using VirtualTeacherGenAIDemo.Server.Hubs;

var builder = WebApplication.CreateBuilder(args);




// Add services to the container.
builder.Services
    .AddSingleton<ILogger>(sp => sp.GetRequiredService<ILogger<Program>>()) // some services require an un-templated ILogger
    .AddOptions(builder.Configuration)
    .AddStorageContext()
    .AddAIResponses()
    .AddServices()
    .AddSemanticKernelServices()
.AddChatCompletionService();



builder.AddKernelMemoryService();

builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 100 * 1024 * 1024; // 100 MB
});


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

app.MapFallbackToFile("/index.html");

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.MapGet("/api/auth-config", (IConfiguration config) => new
{
    TenantId = config["AzureAd:TenantId"],
    ClientId = config["AzureAd:ClientId"],
    Authority = $"{config["AzureAd:Instance"]}{config["AzureAd:TenantId"]}",
    RedirectUri = config["AzureAd:RedirectUri"]
});

app.MapControllers();

app.Run();
