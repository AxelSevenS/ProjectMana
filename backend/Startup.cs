using Microsoft.EntityFrameworkCore;

namespace ProjectMana;

public class Startup(IConfiguration configuration)
{
	public IConfiguration Configuration { get; } = configuration;

	public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllers();
		services.AddDbContext<AppDbContext>(
			opt => 
			{
				opt.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
			}
		);
    }

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            
            app.UseCors(builder => builder
                .AllowAnyOrigin()
                .AllowAnyMethod()
                .AllowAnyHeader()
            );
        }

        app.UseHttpsRedirection();
        // app.UseStaticFiles(
        //     new StaticFileOptions
        //     {
        //         FileProvider = new PhysicalFileProvider( Path.Combine(Directory.GetCurrentDirectory(), "Resources") ),
        //         RequestPath = "/Resources"
        //     }
        // );


        app.UseRouting();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}