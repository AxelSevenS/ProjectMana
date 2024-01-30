using Microsoft.EntityFrameworkCore;

namespace ProjectMana;

public class AppDbContext(DbContextOptions options) : DbContext(options)
{
	public DbSet<User> Users { get; set; }


	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<User>().HasData(
			new User {
				Username = "AdminUser",
				Password = JWT.HashPassword("p4&nY7]S<m'l3H£59?:^^WG*p&6YPN0wt$L9]gr8\"UcjcvE):7"),
				Auth = User.Authorizations.Admin
			}
		);
	}
}