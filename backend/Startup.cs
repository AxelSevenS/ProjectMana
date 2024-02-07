using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ProjectMana;

public class Startup(IConfiguration Configuration)
{
	public void ConfigureServices(IServiceCollection services)
    {
		JwtOptions jwtOptions = Configuration.GetSection(JwtOptions.Jwt)
			.Get<JwtOptions>()!;

		services.AddSingleton(jwtOptions);

        services.AddControllers();
		services.AddDbContext<AppDbContext>(
			opt => 
			{
				opt.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
			}
		);

		services.AddAuthentication(options =>
		{
			options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
			options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
		})
			.AddJwtBearer(options => 
			{			
				#if DEBUG
					options.RequireHttpsMetadata = false;
				#else
					options.RequireHttpsMetadata = true;
				#endif
			
				options.SaveToken = true;
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ClockSkew = TimeSpan.Zero,
			
					ValidateAudience = true,
					ValidAudience = jwtOptions.Audience,
			
					ValidateIssuer = true,
					ValidIssuer = jwtOptions.Issuer,
			
					ValidateLifetime = true,
			
					ValidateIssuerSigningKey = true,
					IssuerSigningKey = jwtOptions.GetSecurityKey()
				};
			});

		services.AddAuthorizationBuilder()
			.AddDefaultPolicy("Authenticated", policy =>
			{
				// policy.RequireAssertion(context => true);
				policy.RequireAuthenticatedUser();
				policy.RequireClaim(ClaimTypes.NameIdentifier);
				policy.RequireClaim(ClaimTypes.Role);
			});
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

		app.UseAuthentication();
		app.UseAuthorization();

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}