using Microsoft.Graph;

namespace Herbal.Stock.API.Models
{
    public class GraphApiToken
    {
        public string AccessToken { get; set; }
    }
    public class MailRequest : GraphApiToken
    {
        public string Content { get; set; }
        public BodyType? ContentType { get; set; }
        public string Subject { get; set; }
        public IEnumerable<Recipient> ToRecipients { get; set; }
        public IEnumerable<Recipient> CcRecipients { get; set; }
    }    
}
