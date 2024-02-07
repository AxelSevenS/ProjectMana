using Microsoft.EntityFrameworkCore;

namespace ProjectMana;

public class AppDbContext(DbContextOptions options, JwtOptions jwtOptions) : DbContext(options)
{
	public DbSet<User> Users { get; set; }
	public DbSet<Song> Songs { get; set; }
	public DbSet<Playlist> Playlists { get; set; }


	protected override void OnModelCreating(ModelBuilder modelBuilder)
	{
		base.OnModelCreating(modelBuilder);

		modelBuilder.Entity<User>().HasData(
			new User {
				Id = 1,
				Username = "AdminUser",
				Password = jwtOptions.HashPassword("p4&nY7]S<m'l3H£59?:^^WG*p&6YPN0wt$L9]gr8\"UcjcvE):7"),
				Auth = (User.Authorizations) User.Roles.Admin
			}
		);
	}
}