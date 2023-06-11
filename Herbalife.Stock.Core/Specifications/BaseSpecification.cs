using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Utility;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static Herbalife.Stock.Core.Models.Enumeration;

namespace Herbalife.Stock.Core.Specifications
{
    public abstract class BaseSpecification<T> : ISpecification<T>
    {
        protected BaseSpecification()
        {

        }
        protected BaseSpecification(Expression<Func<T, bool>> criteria)
        {
            Criteria = criteria;
        }

        public Expression<Func<T, bool>> Criteria { get; }
        public List<Expression<Func<T, object>>> Includes { get; } = new List<Expression<Func<T, object>>>();
        public Expression<Func<T, object>> GroupBy { get; private set; }
        public List<Expression<Func<T, object>>> OrderBy { get; private set; }
        public List<Expression<Func<T, object>>> OrderByDescending { get; private set; }
        public List<string> IncludeStrings { get; } = new List<string>();
        public string OrderByString { get; private set; }
        public string OrderByDescendingString { get; private set; }
        public int Take { get; private set; }
        public int Skip { get; private set; }
        public bool IsPagingEnabled { get; private set; } = false;

        protected virtual void AddInclude(Expression<Func<T, object>> includeExpression)
        {
            Includes.Add(includeExpression);
        }
        protected virtual void AddInclude(string includeString)
        {
            IncludeStrings.Add(includeString);
        }
        protected virtual void ApplyPaging(int skip, int take)
        {
            Skip = skip;
            Take = take;
            IsPagingEnabled = true;
        }
        protected virtual void ApplySortingByString(string sortBy, SortOrder sortOrder)
        {
            sortBy = Helper.FirstCharToUpper(sortBy);
            if (!string.IsNullOrEmpty(sortBy))
            {
                if (SortOrder.Asc.Value == sortOrder.Value)
                {
                    ApplyOrderByString(sortBy);
                }
                else if (SortOrder.Desc.Value == sortOrder.Value)
                {
                    ApplyOrderByDescendingString(sortBy);
                }
            }
        }
        protected virtual void ApplyOrderBy(Expression<Func<T, object>> orderByExpression)
        {
            OrderBy = new List<Expression<Func<T, object>>>();
            OrderBy.Add(orderByExpression);
        }
        protected virtual void ApplyOrderByDescending(Expression<Func<T, object>> orderByDescendingExpression)
        {
            OrderByDescending = new List<Expression<Func<T, object>>>();
            OrderByDescending.Add(orderByDescendingExpression);
        }

        protected virtual void ApplyOrderBy(List<Expression<Func<T, object>>> orderByExpression)
        {
            OrderBy = new List<Expression<Func<T, object>>>();
            OrderBy.AddRange(orderByExpression);
        }
        protected virtual void ApplyOrderByDescending(List<Expression<Func<T, object>>> orderByDescendingExpression)
        {
            OrderByDescending = new List<Expression<Func<T, object>>>();
            OrderByDescending.AddRange(orderByDescendingExpression);
        }
        protected virtual void ApplyOrderByString(string columnName)
        {
            OrderByString = columnName;
        }
        protected virtual void ApplyOrderByDescendingString(string columnName)
        {
            OrderByDescendingString = columnName;
        }
        protected virtual void ApplyGroupBy(Expression<Func<T, object>> groupByExpression)
        {
            GroupBy = groupByExpression;
        }
    }
}
