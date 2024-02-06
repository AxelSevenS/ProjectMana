using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.IdentityModel.Tokens;

namespace ProjectMana;

[Table("users")]
public record User
{
	[Key] [Column("id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	[JsonPropertyName("id")]
    public uint Id { get; set; }

	[Required] [Column("username")]
	[JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

	[Required] [Column("password")]
	[JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;

	[Required] [Column("authorizations")]
	[JsonPropertyName("authorizations")]
    public Authorizations Auth { get; set; } = Authorizations.User;

	public User WithUpdatesFrom(User other) {
		return this with 
		{
			Username = other.Username.IsNullOrEmpty() ? Username : other.Username,
			Password = other.Password.IsNullOrEmpty() ? Password : other.Password
		};
	}

	public enum Authorizations : ushort
	{
		User = 0,
		Creator = User | AddSongs,
		Editor = Creator | EditAnySong | DeleteAnySong,
		Admin = Editor | DeleteAnyUser | EditAnyUser | EditUserAuths,

		EditAnyUser = 1 << 0,    // 0b0000_0000_0000_0001
		EditUserAuths = 1 << 1,  // 0b0000_0000_0000_0010
		DeleteAnyUser = 1 << 2,  // 0b0000_0000_0000_0100
		AddSongs = 1 << 3,       // 0b0000_0000_0000_1000
		EditAnySong = 1 << 4,    // 0b0000_0000_0001_0000
		DeleteAnySong = 1 << 5,  // 0b0000_0000_0010_0000
	}
}