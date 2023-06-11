using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Interfaces
{
    public interface ISpecification<T>
    {
        Expression<Func<T, bool>> Criteria { get; }
        List<Expression<Func<T, object>>> Includes { get; }
        Expression<Func<T, object>> GroupBy { get; }        
        List<Expression<Func<T, object>>> OrderBy { get; }
        List<Expression<Func<T, object>>> OrderByDescending { get; }
        List<string> IncludeStrings { get; }
        string OrderByString { get; }
        string OrderByDescendingString { get; }
        int Take { get; }
        int Skip { get; }
        bool IsPagingEnabled { get; }
    }
}
