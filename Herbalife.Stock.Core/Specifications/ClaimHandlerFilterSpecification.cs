using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Herbalife.Stock.Core.Models.Enumeration;

namespace Herbalife.Stock.Core.Specifications
{
    public class ClaimHandlerFilterSpecification : BaseSpecification<ClaimHandler>
    {
        public ClaimHandlerFilterSpecification(int skip, int take, SortOrder sortOrder, string name)
         : base(i => (string.IsNullOrEmpty(name) || i.UserName.Contains(name)) && (!i.IsDelete))
        {
            ApplyPaging(skip, take);
            if (SortOrder.Asc.Value == sortOrder.Value)
            {
                ApplyOrderBy(r => r.UserName);
            }
            else if (SortOrder.Desc.Value == sortOrder.Value)
            {
                ApplyOrderByDescending(r => r.UserName);
            }
        }

        public ClaimHandlerFilterSpecification(string name, string email = "")
         : base(i => (string.IsNullOrEmpty(name) || i.UserName.Contains(name))
                  && (string.IsNullOrEmpty(email) || i.Email.ToLower() == email.ToLower()) && (!i.IsDelete)) 
        { 
        
        }
    }

}
