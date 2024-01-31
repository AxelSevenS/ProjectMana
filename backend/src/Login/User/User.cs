using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

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
    public string? Username { get; set; } = null;

	[Required] [Column("password")]
	[JsonPropertyName("password")]
    public string? Password { get; set; } = null;

	[Required] [Column("authorizations")]
	[JsonPropertyName("authorizations")]
    public Authorizations Auth { get; set; } = Authorizations.User;

	public User WithUpdatesFrom(User other) {
		return this with 
		{
			Username = other.Username ?? Username,
			Password = other.Password ?? Password
		};
	}

	public enum Authorizations : byte
	{
		User = 0,
		Editor = CreateSongs | EditSongs,
		Admin = Editor | RemoveUsers | EditUserAuths,

		RemoveUsers = 1 << 0,    // 0b0000_0001
		EditUserAuths = 1 << 1,  // 0b0000_0010
		CreateSongs = 1 << 2,    // 0b0000_0100
		EditSongs = 1 << 3,      // 0b0000_1000
	}
}