using Herbalife.Stock.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Core.Interfaces
{
    public interface IAsyncRepository<T> where T : EntityBase, IAggregateRoot
    {
        Task<T> GetByIdAsync(long id);
        Task<T> GetByIdAsync(long id, string[] paths);
        Task<IReadOnlyList<T>> ListAllAsync();
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec, bool noTracking = false);
        Task<T> AddAsync(T entity);
        Task UpdateAsync(T entity, bool updateUserActivity = true);
        Task DeleteAsync(T entity);
        Task<int> CountAsync(ISpecification<T> spec);
        void DetachEntity(T entity);
        Task<IReadOnlyList<T>> FindByPredicate(Expression<Func<T, bool>> predicate);
        IEnumerable<T> GetAll();
        Task RemoveRangeAsync(IEnumerable<T> entities);
        Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities);
        Task ClearTracking();
        IQueryable<T> ListAllQuerable();
        void executeScript();
    }
}
