using Herbalife.Stock.Core.Entities;
using Herbalife.Stock.Infrastructure.Data.Auditing;
using Herbalife.Stock.Infrastructure.Factory;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.Extensions.Configuration;

namespace Herbalife.Stock.Infrastructure.Data
{
    public class RSTSDbContext : DbContext
    {
        private IHttpContextAccessor _httpContextAccessor;
        public bool IsSeeding { get; set; }
        public bool updateUserActivity { get; set; }
        private readonly IConfiguration _config;
        private readonly IAzureTokenConfiguration _azureConfig;

        public RSTSDbContext(DbContextOptions<RSTSDbContext> options, IHttpContextAccessor httpContextAccessor,
            IConfiguration config, IAzureTokenConfiguration azureConfig) : base(options)
        {
            _config = config;
            _httpContextAccessor = httpContextAccessor;

            var conn = (Microsoft.Data.SqlClient.SqlConnection)Database.GetDbConnection();
            _azureConfig = azureConfig;

            //conn.AccessToken = _azureConfig.getAccessToken();
            //Database.SetCommandTimeout((int)TimeSpan.FromMinutes(5).TotalSeconds);

            this.IsSeeding = false;
            this.updateUserActivity = true;
        }

        public DbSet<Audit> Audits { get; set; }
        public DbSet<Country> Country { get; set; }
        public DbSet<Location> Location { get; set; }
        public DbSet<Locator> Locator { get; set; }
        public DbSet<EntityMaster> EntityMaster { get; set; }
        public DbSet<ErrorLog> ErrorLog { get; set; }
        public DbSet<GroupMaster> GroupMaster { get; set; }
        public DbSet<Logger> Logger { get; set; }
        public DbSet<UserGroup> UsersGroup { get; set; }
        public DbSet<UserPermission> UserPermissions { get; set; }
        public DbSet<UserGroupPermission> UserGroupPermission { get; set; }
        public DbSet<ClaimHandler> ClaimHandler { get; set; }
        public DbSet<WMSInventory> WMSInventory { get; set; }
        public DbSet<StockAllotment> StockAllotment { get; set; }
        public DbSet<StockOnHandOracle> StockOnHandOracle { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ClaimHandler>(ConfigureClaimHandler);
            modelBuilder.Entity<UserGroup>(ConfigureUserGroup);
            modelBuilder.Entity<GroupMaster>();
            modelBuilder.Entity<UserPermission>();
            modelBuilder.Entity<UserGroupPermission>(ConfigureUserGroupPermission);
            modelBuilder.Entity<Country>();
            modelBuilder.Entity<Location>();
            modelBuilder.Entity<Locator>();
            modelBuilder.Entity<EntityMaster>();            
            modelBuilder.Entity<Logger>();
            modelBuilder.Entity<StockAllotment>(ConfigureStockAllotment);            
            modelBuilder.Entity<WMSInventory>(ConfigureWMSInventory);
        }

        private void ConfigureClaimHandler(EntityTypeBuilder<ClaimHandler> obj)
        {
            obj.Property(b => b.IsAdmin)
           .HasDefaultValue(0);
            obj.Property(b => b.IsDelete)
            .HasDefaultValue(0);
        }
        public void ConfigureUserGroup(EntityTypeBuilder<UserGroup> obj)
        {
            obj.HasOne(x => x.ClaimHandler).WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            obj.HasOne(x => x.GroupMaster).WithMany()
            .HasForeignKey(ad => ad.GroupId)
            .OnDelete(DeleteBehavior.NoAction);
        }
        public void ConfigureUserGroupPermission(EntityTypeBuilder<UserGroupPermission> obj)
        {
            obj.HasOne(x => x.UserGroup).WithMany()
            .HasForeignKey(ad => ad.UserGroupId)
            .OnDelete(DeleteBehavior.NoAction);

            obj.HasOne(x => x.EntityMaster).WithMany()
           .HasForeignKey(ad => ad.EntityMasterId)
           .OnDelete(DeleteBehavior.NoAction);
        }
        private void ConfigureStockAllotment(EntityTypeBuilder<StockAllotment> obj)
        {
            obj.Property(b => b.IsOper1Start).HasDefaultValue(0);
            obj.Property(b => b.IsOper2Start).HasDefaultValue(0);
            obj.Property(b => b.IsOper1Complete).HasDefaultValue(0);
            obj.Property(b => b.IsOper2Complete).HasDefaultValue(0);
            obj.Property(b => b.IsSupervisorSubmit).HasDefaultValue(0);
            obj.Property(b => b.IsManagerFinalize).HasDefaultValue(0);
        }

        private void ConfigureWMSInventory(EntityTypeBuilder<WMSInventory> obj)
        {
            obj.Property(b => b.ActualAUpdated).HasDefaultValue(0);
            obj.Property(b => b.ActualBUpdated).HasDefaultValue(0);            
        }        

        public override async Task<int> SaveChangesAsync(bool acceptAllChangesOnSuccess, CancellationToken cancellationToken = default(CancellationToken))
        {
            if (!IsSeeding && updateUserActivity)
            {
                AutSetUserActivity();
            }
            var auditEntries = OnBeforeSaveChanges();
            var result = await base.SaveChangesAsync(acceptAllChangesOnSuccess, cancellationToken);
            await OnAfterSaveChanges(auditEntries);
            return result;
        }
        private List<AuditEntry> OnBeforeSaveChanges()
        {
            ChangeTracker.DetectChanges();
            var auditEntries = new List<AuditEntry>();
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is Audit || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                    continue;

                var auditEntry = new AuditEntry(entry);
                auditEntry.TableName = entry.Metadata.GetTableName();//.Relational().TableName;
                auditEntries.Add(auditEntry);

                foreach (var property in entry.Properties)
                {
                    if (property.IsTemporary)
                    {
                        // value will be generated by the database, get the value after saving
                        auditEntry.TemporaryProperties.Add(property);
                        continue;
                    }

                    string propertyName = property.Metadata.Name;
                    if (property.Metadata.IsPrimaryKey())
                    {
                        auditEntry.KeyValues[propertyName] = property.CurrentValue;
                        continue;
                    }

                    switch (entry.State)
                    {
                        case EntityState.Added:
                            auditEntry.NewValues[propertyName] = property.CurrentValue;
                            break;

                        case EntityState.Deleted:
                            auditEntry.OldValues[propertyName] = property.OriginalValue;
                            break;

                        case EntityState.Modified:
                            if (property.IsModified)
                            {
                                auditEntry.OldValues[propertyName] = property.OriginalValue;
                                auditEntry.NewValues[propertyName] = property.CurrentValue;
                            }
                            break;
                    }
                }
            }

            // Save audit entities that have all the modifications
            foreach (var auditEntry in auditEntries.Where(_ => !_.HasTemporaryProperties))
            {
                var audit = auditEntry.ToAudit();
                // Save the Audit entry
                if (audit.NewValues != audit.OldValues)
                {
                    Audits.Add(audit);
                }
            }

            // keep a list of entries where the value of some properties are unknown at this step
            return auditEntries.Where(_ => _.HasTemporaryProperties).ToList();
        }
        private Task OnAfterSaveChanges(List<AuditEntry> auditEntries)
        {
            if (auditEntries == null || auditEntries.Count == 0)
                return Task.CompletedTask;

            foreach (var auditEntry in auditEntries)
            {
                // Get the final value of the temporary properties
                foreach (var prop in auditEntry.TemporaryProperties)
                {
                    if (prop.Metadata.IsPrimaryKey())
                    {
                        auditEntry.KeyValues[prop.Metadata.Name] = prop.CurrentValue;
                    }
                    else
                    {
                        auditEntry.NewValues[prop.Metadata.Name] = prop.CurrentValue;
                    }
                }

                var audit = auditEntry.ToAudit();
                // Save the Audit entry
                if (audit.NewValues != audit.OldValues)
                {
                    Audits.Add(audit);
                }
            }

            return SaveChangesAsync();
        }
        private void AutSetUserActivity()
        {
            var userEmail = _httpContextAccessor.HttpContext.User?.FindFirst("upn")?.Value;
            var user = this.ClaimHandler.Where(c => userEmail != null && c.Email.ToLower() == userEmail.ToLower()).FirstOrDefault();

            var entries = ChangeTracker.Entries()
                    .Where(e => e.Entity is EntityBase && (
                            e.State == EntityState.Added
                            || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                ((EntityBase)entityEntry.Entity).UpdatedDate = DateTime.Now;
                if (user != null)
                {
                    ((EntityBase)entityEntry.Entity).UpdatedBy = user.ID;
                }
                else
                {
                    entityEntry.Property("UpdatedBy").IsModified = false;
                }
                if (entityEntry.State == EntityState.Added)
                {
                    ((EntityBase)entityEntry.Entity).CreatedDate = DateTime.Now;
                    if (user != null)
                        ((EntityBase)entityEntry.Entity).CreatedBy = user.ID;
                    else
                        ((EntityBase)entityEntry.Entity).CreatedBy = 1;
                }
                else
                {
                    entityEntry.Property("CreatedDate").IsModified = false;
                    entityEntry.Property("CreatedBy").IsModified = false;
                }
            }
        }

    }
}
