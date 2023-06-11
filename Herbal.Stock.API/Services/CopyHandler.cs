using Herbal.Stock.API.Models;

namespace Herbal.Stock.API.Services
{
    public class CopyHandler
    {
        public static User UserProperty(Microsoft.Graph.User graphUser)
        {
            User user = new User();
            user.id = graphUser.Id;
            user.givenName = graphUser.GivenName;
            user.surname = graphUser.Surname;
            user.userPrincipalName = graphUser.UserPrincipalName;
            user.email = graphUser.Mail;
            return user;
        }
    }
}
