using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Infrastructure.Data
{
    public class SpecificationEvaluator<T> where T : EntityBase
    {
        public static IQueryable<T> GetQuery(IQueryable<T> inputQuery, ISpecification<T> specification)
        {
            var query = inputQuery;

            // modify the IQueryable using the specification's criteria expression
            if (specification.Criteria != null)
            {
                query = query.Where(specification.Criteria);
            }

            // Includes all expression-based includes
            query = specification.Includes.Aggregate(query,
                                    (current, include) => current.Include(include));

            // Include any string-based include statements
            query = specification.IncludeStrings.Aggregate(query,
                                    (current, include) => current.Include(include));

            // Apply ordering if expressions are set
            if (specification.OrderBy != null && specification.OrderBy.Any())
            {

                if (specification.OrderBy.Count() == 1)
                {
                    query = query.OrderBy(specification.OrderBy[0]);
                }
                else
                {
                    query = query.OrderBy(specification.OrderBy[0]).ThenBy(specification.OrderBy[1]);
                }
            }

            else if (specification.OrderByDescending != null && specification.OrderByDescending.Any())
            {
                if (specification.OrderByDescending.Count() == 1)
                {
                    query = query.OrderByDescending(specification.OrderByDescending[0]);
                }
                else
                {
                    query = query.OrderByDescending(specification.OrderByDescending[0]).ThenByDescending(specification.OrderByDescending[1]);
                }
            }

            if (!string.IsNullOrEmpty(specification.OrderByString))
            {
                query = (IQueryable<T>)query.OrderBy(typeof(T), specification.OrderByString);
            }
            else if (!string.IsNullOrEmpty(specification.OrderByDescendingString))
            {
                query = (IQueryable<T>)query.OrderByDescending(typeof(T), specification.OrderByDescendingString);
            }

            if (specification.GroupBy != null)
            {
                query = query.GroupBy(specification.GroupBy).SelectMany(x => x);
            }

            // Apply paging if enabled
            if (specification.IsPagingEnabled)
            {
                query = query.Skip(specification.Skip)
                             .Take(specification.Take);
            }
            return query;
        }
    }
}
