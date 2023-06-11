using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Herbalife.Stock.Infrastructure.Data
{
    public class EfRepository<T> : IAsyncRepository<T> where T : EntityBase, IAggregateRoot
    {
        protected readonly RSTSDbContext _dbContext;

        public EfRepository(RSTSDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public virtual async Task<T> GetByIdAsync(long id)
        {
            return await _dbContext.Set<T>().FindAsync(id);
        }

        public virtual async Task<T> GetByIdAsync(long id, string[] paths = null)
        {
            var model = await _dbContext.Set<T>().FindAsync(id);
            if (model != null)
            {
                var references = _dbContext.Entry(model).References.Select(r => r.Metadata.Name);
                var collections = _dbContext.Entry(model).Collections.Select(r => r.Metadata.Name);
                foreach (var path in paths)
                {
                    if (references.Contains(path))
                    {
                        _dbContext.Entry(model).Reference(path).Load();
                    }
                    else if (collections.Contains(path))
                    {
                        _dbContext.Entry(model).Collection(path).Load();
                    }

                }
            }
            return model;
        }

        public IEnumerable<T> GetAll()
        {
            return _dbContext.Set<T>().ToList();
        }

        public async Task<IReadOnlyList<T>> ListAllAsync()
        {
            return await _dbContext.Set<T>().ToListAsync();
        }

        public IQueryable<T> ListAllQuerable()
        {
            return _dbContext.Set<T>().AsQueryable();
        }

        public async Task<IReadOnlyList<T>> ListAsync(ISpecification<T> spec, bool noTracking = false)
        {
            try
            {
                return await ApplySpecification(spec, noTracking).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<int> CountAsync(ISpecification<T> spec)
        {
            return await ApplySpecification(spec).CountAsync();
        }

        public async Task<T> AddAsync(T entity)
        {
            try
            {
                _dbContext.Set<T>().Add(entity);
                await _dbContext.SaveChangesAsync();
                return entity;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<T>> AddRangeAsync(IEnumerable<T> entities)
        {
            _dbContext.Set<T>().AddRange(entities);
            await _dbContext.SaveChangesAsync();

            return entities;
        }

        public async Task UpdateAsync(T entity, bool updateUserActivity = true)
        {
            _dbContext.updateUserActivity = updateUserActivity;
            _dbContext.Entry(entity).State = EntityState.Modified;
            await _dbContext.SaveChangesAsync();
            _dbContext.updateUserActivity = true;
        }

        public async Task DeleteAsync(T entity)
        {
            _dbContext.Set<T>().Remove(entity);
            await _dbContext.SaveChangesAsync();
        }

        public void DetachEntity(T entity)
        {
            _dbContext.Entry(entity).State = EntityState.Detached;
        }
        private IQueryable<T> ApplySpecification(ISpecification<T> spec, bool noTracking = false)
        {
            try
            {
                if (noTracking)
                    return SpecificationEvaluator<T>.GetQuery(_dbContext.Set<T>().AsNoTracking().AsQueryable(), spec);
                return SpecificationEvaluator<T>.GetQuery(_dbContext.Set<T>().AsQueryable(), spec);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IReadOnlyList<T>> FindByPredicate(Expression<Func<T, bool>> predicate)
        {
            return await _dbContext.Set<T>().AsNoTracking()
              .Where(predicate).ToListAsync();
        }
        public async Task RemoveRangeAsync(IEnumerable<T> entities)
        {
            _dbContext.RemoveRange(entities);
            await _dbContext.SaveChangesAsync();
        }

        public async Task ClearTracking()
        {
            _dbContext.ChangeTracker.Clear();
        }

        public void executeScript()
        {
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('EntityReport','Entity','/reports/entityreport',	1, 19,15,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('SummaryReport','Summary Report','/reports/summaryreport',1, 19,16,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");

            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'Reports','lblReports',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'EntityReport','lblEntityReport',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'SummaryReport','lblSummaryReport',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");

            // 22
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('Dashboard','Dashboard','/dashboard',0,NULL,16,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");


            // New Changes
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set ParentId=19 where ParentId=22");
            //_dbContext.Database.ExecuteSqlRaw("delete from EntityMaster where ID=22");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('KoreaBIHomepage','Korea BI Homepage','/reports/koreabihomepage',	1, 19,18,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('DeepDiveNote','Deep Dive Note','/reports/deepdivenote',	1, 19,18,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('MyReports','My Reports','/reports/myreports',	1, 19,18,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'KoreaBIHomepage','lblKoreaBIHomepage',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'DeepDiveNote','lblDeepDiveNote',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'My Reports','lblMyReports',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");

            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set IsDelete=1 where EntityName='VpPopulation'");

            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=15,RouterLink='/reports/summaryreport' where EntityName='SummaryReport'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=16,RouterLink='/reports/koreabihomepage' where EntityName='KoreaBIHomepage'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=17,RouterLink='/reports/deepdivenote' where EntityName='DeepDiveNote'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=18,RouterLink='/reports/myreports' where EntityName='MyReports'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=19,RouterLink='/reports/keymetric' where EntityName='KeyMetric'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=20,RouterLink='/reports/tabteam' where EntityName='TabTeam'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=21,RouterLink='/reports/topleaders' where EntityName='TopLeaders'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=22,RouterLink='/reports/toproyalityperformer' where EntityName='TopRoyalityPerformer'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=23,RouterLink='/reports/qualifyingtabteam' where EntityName='QualifyingTabTeam'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=24,RouterLink='/reports/qualifyingawt' where EntityName='QualifyingAwt'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=25,RouterLink='/reports/productpenetration' where EntityName='ProductPenetration'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=26,RouterLink='/reports/nutritionclubreport' where EntityName='NutritionClub'");
            //_dbContext.Database.ExecuteSqlRaw("update EntityMaster set DisplayOrder=27,RouterLink='/reports/entityreport' where EntityName='EntityReport'");


            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='Entity Report' where LabelId='lblEntityReport'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='Summary' where LabelId='lblSummaryReport'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='Key Metric' where LabelId='lblKeyMetric'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='Top Royalty Performers' where LabelId='lblTopRoyalityPerformer'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='New & Qualifying TAB Team' where LabelId='lblQualifyingTabTeam'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='AWT Tracker' where LabelId='lblQualifyingAwt'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='Product Penetration' where LabelId='lblProductPenetration'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='Nutrition Club' where LabelId='lblNutritionClubReport'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='Top 20 Leaders' where LabelId='lblTopLeaders'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='Korea BI Hompage' where LabelId='lblKoreaBIHomepage'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='Deep Dive Note' where LabelId='lblDeepDiveNote'");
            //_dbContext.Database.ExecuteSqlRaw("update Multilingual set TranslatedText='TAB Team' where LabelId='lblTabTeam'");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from EntityMaster where EntityName='Reports'),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=1),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=2),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=3),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=4),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=5),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=6),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=7),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=8),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=9),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=10),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=11),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=12),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=13),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=14),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from (select ROW_NUMBER() Over(order by id asc) rowno,id from EntityMaster where ParentId=(select id from EntityMaster where EntityName='Reports')) kl where rowno=15),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");


            //_dbContext.Database.ExecuteSqlRaw("insert into CountryEntityMaster values((select id from EntityMaster where EntityName='MyReports'),1,NULL,NULL,1,'2021-10-19 12:01:10.6659991',1,'2021-11-08 11:37:15.2274892',0)");


            // END
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('KeyMetric','Key Metric','/dashboard/keymetric',	1, 22,18,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('TabTeam','TAB Team','/dashboard/tabteam',	1, 22,19,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('TopLeaders','Top 20% Leaders','/dashboard/topleaders',	1, 22,20,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('TopRoyalityPerformer','Top Royality Performers','/dashboard/toproyalityperformer',	1, 22,21,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('QualifyingTabTeam','Qualifying TAB Team','/dashboard/qualifyingtabteam',	1, 22,22,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('QualifyingAwt','Qualifying AWT','/dashboard/qualifyingawt',	1, 22,23,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('VpPopulation','VP / Population','/dashboard/vppopulation',	1, 22,24,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('ProductPenetration','Product Penetration','/dashboard/productpenetration',	1, 22,19,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into EntityMaster values('NutritionClub','Nutrition Club','/dashboard/nutritionclubreport',	1, 22,19,'adminicon',0,1,'2021-11-08 12:26:34.0887738',NULL,'2021-11-08 12:26:34.0887738',0)");

            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'Dashboard','lblDashboard',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'KeyMetric','lblKeyMetric',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'TabTeam','lblTabTeam',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'TopLeaders','lblTopLeaders',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'TopRoyalityPerformer','lblTopRoyalityPerformer',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'QualifyingTabTeam','lblQualifyingTabTeam',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'QualifyingAwt','lblQualifyingAwt',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'VpPopulation','lblVpPopulation',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'ProductPenetration','lblProductPenetration',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
            //_dbContext.Database.ExecuteSqlRaw("insert into Multilingual values(1,2,'NutritionClubReport','lblNutritionClubReport',1,'2021-10-13 12:53:25.2014971',NULL,'2021-10-13 12:53:25.2014764',0)");
        }
    }
}
