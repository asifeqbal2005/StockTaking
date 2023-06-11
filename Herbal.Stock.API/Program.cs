using Herbalife.Stock.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph.ExternalConnectors;
using Microsoft.Identity.Web;
using System.IdentityModel.Tokens.Jwt;

namespace Herbal.Stock.API
{
    public class Program
    {
        //public async static Task Main(string[] args)
        //{
        //    var host = CreateHostBuilder(args)
        //                 .Build();

        //    //using (var scope = host.Services.CreateScope())
        //    //{
        //    //    var services = scope.ServiceProvider;
        //    //    var loggerFactory = services.GetRequiredService<ILoggerFactory>();
        //    //    try
        //    //    {
        //    //        var RSFSDbContext = services.GetRequiredService<RSTSDbContext>();
        //    //        await RSFSDbContextSeed.SeedAsync(RSTSDbContext);
        //    //    }
        //    //    catch (Exception ex)
        //    //    {
        //    //        //var logger = loggerFactory.CreateLogger<Program>();
        //    //        //logger.LogError(ex, "An error occurred seeding the DB.");
        //    //    }
        //    //}

        //    host.Run();
        //}

        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}