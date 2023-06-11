using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Models
{
    public class Enumeration
    {
        public class SortOrder
        {
            private SortOrder(string value) { Value = value; }
            public string Value { get; set; }

            public static SortOrder Asc { get { return new SortOrder("asc"); } }
            public static SortOrder Desc { get { return new SortOrder("desc"); } }
        }
    }
}
