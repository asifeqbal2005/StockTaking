using Herbal.Stock.API.Models;
using Microsoft.Graph;
using System.Net.Http.Headers;

namespace Herbal.Stock.API.Services
{
    public static class MicrosoftGraphClient
    {
        private static GraphServiceClient graphClient;
        private static IConfiguration configuration;

        private static string clientId;
        private static string tenantId;
        private static string aadInstance;
        private static string graphResource;
        private static string graphAPIEndpoint;
        private static string authority;

        static MicrosoftGraphClient()
        {
            configuration = new ConfigurationBuilder()
            .SetBasePath(System.IO.Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
            .AddEnvironmentVariables()
            .Build();
            SetAzureADOptions();
        }

        private static void SetAzureADOptions()
        {
            var azureOptions = new AzureAD();
            configuration.Bind("AzureAd", azureOptions);

            clientId = azureOptions.ClientId;
            tenantId = azureOptions.TenantId;
            aadInstance = azureOptions.Instance;
            graphResource = azureOptions.GraphResource;
            graphAPIEndpoint = $"{azureOptions.GraphResource}{azureOptions.GraphResourceEndPoint}";
            authority = $"{aadInstance}{tenantId}";
        }

        public static GraphServiceClient GetAuthProviders(string accessToken)
        {
            var delegateAuthProvider = new DelegateAuthenticationProvider((requestMessage) =>
            {
                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken.ToString());
                return Task.FromResult(0);
            });

            return new GraphServiceClient(delegateAuthProvider);
        }
    }
}
