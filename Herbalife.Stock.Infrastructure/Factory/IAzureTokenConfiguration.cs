using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Infrastructure.Factory
{
    public interface IAzureTokenConfiguration
    {
        X509Certificate2 getCertificateByFriendlyName(string friendlyName);
        string getAccessToken();
        string getGraphAccessToken();
        string getPowerBiAccessToken();

    }
}
