using Herbal.Stock.API.Interfaces;
using Herbal.Stock.API.Services;
using Herbalife.Stock.Core.Interfaces;
using Herbalife.Stock.Core.Services;
using Herbalife.Stock.Infrastructure.Data;
using Herbalife.Stock.Infrastructure.Factory;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.Identity.Web;
using Microsoft.OpenApi.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace Herbal.Stock.API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;

        }
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            JwtSecurityTokenHandler.DefaultMapInboundClaims = false;
            ConfigureAuthentication(services);
            ConfigureAppServices(services);
            ConfigureDatabases(services);
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen();
            //ConfigureSwagger(services);
            services.AddMemoryCache();
        }

        public void ConfigureAuthentication(IServiceCollection services)
        {
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                    .SetIsOriginAllowed((host) => true)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .WithExposedHeaders("Content-Disposition")
                    .AllowCredentials());
            });
            // Adds Microsoft Identity platform (AAD v2.0) support to protect this Api
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
              .AddMicrosoftIdentityWebApi(Configuration, "AzureAd");
            services.AddAuthorization();
        }

        public void ConfigureAppServices(IServiceCollection services)
        {
            IFileProvider physicalProvider = new PhysicalFileProvider(Directory.GetCurrentDirectory());
            services.AddSingleton<IFileProvider>(physicalProvider);
            services.AddHttpContextAccessor();

            //TODO
            //services.AddSingleton(new DbContextFactoryOptions(Configuration.GetConnectionString("RSFSConnection")));
            //services.AddSingleton(new AzureAuthenticationInterceptor(new AzureServiceTokenProvider()));


            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped(typeof(IAsyncRepository<>), typeof(EfRepository<>));
            services.AddScoped<IClaimHandlerViewModelService, ClaimHandlerViewModelService>();
            services.AddScoped<IIdentityService, IdentityService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAzureTokenConfiguration, AzureTokenConfiguration>();
            services.AddScoped<IEntityModelService, EntityModelService>();
            services.AddScoped<ICountryService, CountryService>();
            services.AddScoped<IUserGropViewModelService, UserGropViewModelService>();
            services.AddScoped<IGroupMasterService, GroupMasterService>();
            services.AddScoped<IUserGroupEntityService, UserGroupEntityService>();
            services.AddScoped<IFileService, FileService>();
            services.AddScoped<ILocationService, LocationService>();
            services.AddScoped<ILocatorService, LocatorService>();
            services.AddScoped<IStockAllotmentService, StockAllotmentService>();

            services.AddControllers();
            services.AddCors(options =>
            {
                options.AddPolicy("CorsPolicy",
                    builder => builder
                    .SetIsOriginAllowed((host) => true)
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .WithExposedHeaders("Content-Disposition")
                    .AllowCredentials());
            });
            services.AddAutoMapper(typeof(Startup));            
            ConfigureDatabases(services);            
        }

        public void ConfigureDatabases(IServiceCollection services)
        {
            // use real database
            // Add Identity DbContext
            services.AddDbContext<RSTSDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("RSTSConnection")));
        }

        public void ConfigureSwagger(IServiceCollection services)
        {
            services.AddSwaggerGen(swagger =>
            {
                //This is to generate the Default UI of Swagger Documentation    
                swagger.SwaggerDoc("v1", new OpenApiInfo
                {
                    Version = "v1",
                    Title = "Herbalife Stock Taking System Web API",
                    Description = "Authentication and Authorization with JWT and Swagger"
                });
                // To Enable authorization using Swagger (JWT)
                swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Enter 'Bearer' [space] and then your valid token in the text input below.\r\n\r\nExample: \"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\"",
                });
                swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
                        {
                    {
                          new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] {}

                    }
                        });
            });
        }

        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILoggerFactory loggerFactory)
        {
            app.UseSecurityHeaders(SecurityHeadersDefinitions.GetHeaderPolicyCollection(env.IsProduction()));
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseExcepctionHandlingMiddleware();
            
            app.UseSwagger();
            app.UseSwaggerUI();

            //app.UseSwaggerUI(c =>
            //{
            //    c.SwaggerEndpoint("/api/swagger/v1/swagger.json", "Herbalife.API v1");
            //});

            Microsoft.IdentityModel.Logging.IdentityModelEventSource.ShowPII = true;
            app.UseCors("CorsPolicy");

            app.UseHttpsRedirection();

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            var pathBase = Configuration["PATH_BASE"];
            if (!string.IsNullOrEmpty(pathBase))
            {
                loggerFactory.CreateLogger<Startup>().LogDebug("Using PATH BASE '{pathBase}'", pathBase);
                app.UsePathBase(pathBase);
            }
        }

        public static string FlattenException(Exception exception)
        {
            var stringBuilder = new StringBuilder();

            while (exception != null)
            {
                stringBuilder.AppendLine(exception.Message);
                stringBuilder.AppendLine(exception.StackTrace);

                exception = exception.InnerException;
            }
            return stringBuilder.ToString();
        }


    }
}
