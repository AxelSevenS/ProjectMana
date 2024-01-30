using System.Net;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;

namespace ProjectMana;
public class Program
{
    public static void Main(string[] args)
    {
		IHost host = CreateHostBuilder(args).Build();

		using ( IServiceScope scope = host.Services.CreateScope() )
		{
			scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.Migrate();
		}

        host.Run();
    }

    public static IHostBuilder CreateHostBuilder(string[] args) {
        return Host.CreateDefaultBuilder(args)
            .ConfigureWebHostDefaults(webBuilder =>
            {
                webBuilder.UseStartup<Startup>();
            });
    }
}