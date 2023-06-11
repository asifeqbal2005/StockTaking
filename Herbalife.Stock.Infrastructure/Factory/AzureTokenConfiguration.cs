using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Infrastructure.Factory
{
    public class AzureTokenConfiguration : IAzureTokenConfiguration
    {
        public IMemoryCache _memoryCache;
        private readonly IConfiguration _config;
        private readonly ILogger<AzureTokenConfiguration> _logger;

        public AzureTokenConfiguration(IMemoryCache memoryCache, IConfiguration config, ILoggerFactory loggerFactory)
        {
            _memoryCache = memoryCache;
            _config = config;
            _logger = loggerFactory.CreateLogger<AzureTokenConfiguration>();
        }

        public string getAccessToken()
        {
            var cacheKey = "access_db_token";
            var existingCache = _memoryCache.Get(cacheKey);
            if (existingCache != null)
            {
                return existingCache.ToString();
            }

            ClientAssertionCertificate clientCredential = new ClientAssertionCertificate(_config["AzureAd:ClientId"], getCertificateByFriendlyName(_config["AzureAd:CertificateFriendlyName"]));
            var context = new AuthenticationContext("https://login.windows.net/" + _config["AzureAd:TenantId"]);
            var tokenResponse = context.AcquireTokenAsync("https://database.windows.net/", clientCredential);
            var accessToken = tokenResponse.Result.AccessToken;

            CookieOptions option = new CookieOptions();
            option.Expires = DateTime.Now.AddMilliseconds(10);
            if (!_memoryCache.TryGetValue(cacheKey, out string outputToken))
            {
                var cacheExpiryOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpiration = DateTime.Now.AddMinutes(59),
                    Priority = CacheItemPriority.High,
                    SlidingExpiration = TimeSpan.FromSeconds(20)
                };
                //setting cache entries
                _memoryCache.Set(cacheKey, accessToken, cacheExpiryOptions);
            }

            return accessToken;
        }

        public X509Certificate2 getCertificateByFriendlyName(string friendlyName)
        {            
            X509Store store = new X509Store(StoreName.My, StoreLocation.LocalMachine);
            store.Open(OpenFlags.ReadOnly);
            X509Certificate2 certificate = null;

            try
            {
                X509Certificate2Collection certCollection = store.Certificates;
                foreach (X509Certificate2 x509 in certCollection)
                {
                    if (x509.FriendlyName == _config["AzureAd:CertificateFriendlyName"])
                    {
                        _logger.LogError("Certificate Error Log Matched", x509);
                        return certificate = x509;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Certificate Error P123", ex.ToString());
            }
            return certificate;
        }

        public string getGraphAccessToken()
        {
            string baseAddress = $"https://login.microsoftonline.com/{_config["AzureAd:TenantId"]}";
            ClientAssertionCertificate clientCredential = new ClientAssertionCertificate(_config["AzureAd:ClientId"], getCertificateByFriendlyName(_config["AzureAd:CertificateFriendlyName"]));
            var context = new AuthenticationContext(baseAddress);
            var tokenResponse = context.AcquireTokenAsync("https://graph.microsoft.com", clientCredential);
            return tokenResponse.Result.AccessToken;
        }

        public string getPowerBiAccessToken()
        {
            string baseAddress = $"https://login.microsoftonline.com/{_config["AzureAd:TenantId"]}";
            ClientAssertionCertificate clientCredential = new ClientAssertionCertificate(_config["AzureAd:ClientId"], getCertificateByFriendlyName(_config["AzureAd:CertificateFriendlyName"]));
            var context = new AuthenticationContext(baseAddress);
            var resourceurl = _config["PowerBI:ResourceUrl"];
            var tokenResponse = context.AcquireTokenAsync(resourceurl, clientCredential);
            return tokenResponse.Result.AccessToken;
        }
    }
}
