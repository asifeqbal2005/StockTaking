using Herbal.Stock.API.Models;
using System.Net;

namespace Herbal.Stock.API
{
    // You may need to install the Microsoft.AspNetCore.Http.Abstractions package into your project
    public class ExcepctionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExcepctionHandlingMiddleware> _logger;
        public ExcepctionHandlingMiddleware(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<ExcepctionHandlingMiddleware>();
        }

        public ExcepctionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (Exception ex)
            {

                await HandleError(httpContext, ex);
            }

        }

        private Task HandleError(HttpContext httpContext, Exception ex)
        {
            httpContext.Response.ContentType = "application/json";
            if (ex.Message == "Duplicate")
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            }
            else
            {
                httpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                _logger.LogError("Middleware", ex.StackTrace.ToString());
            }
            return httpContext.Response.WriteAsync(new ErrorDetails()
            {
                StatusCode = httpContext.Response.StatusCode,
                Message = ex.Message.ToString()
            }.ToString());
        }
    }

    // Extension method used to add the middleware to the HTTP request pipeline.
    public static class ExcepctionHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseExcepctionHandlingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExcepctionHandlingMiddleware>();
        }
    }
}
