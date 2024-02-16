using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ProjectMana;

[Table("users")]
[Index(nameof(Username), IsUnique = true)]
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
	[JsonPropertyName("roles")]
	public Authorizations Auth { get; set; } = (Authorizations) Roles.User;

	public User WithUpdatesFrom(User other) {
		return this with
		{
			Username = other.Username.IsNullOrEmpty() ? Username : other.Username,
			Password = other.Password.IsNullOrEmpty() ? Password : other.Password
		};
	}

	[Flags]
	public enum Roles : ushort
	{
		User = 0,

		Creator = User |
			Authorizations.CreateSongs |
			Authorizations.CreatePlaylists,

		Editor = Creator |
			Authorizations.EditAnySong |
			Authorizations.DeleteAnySong |
			Authorizations.EditAnyPlaylist |
			Authorizations.DeleteAnyPlaylist,

		Admin = Editor |
			Authorizations.EditAnyUser |
			Authorizations.EditUserAuths |
			Authorizations.DeleteAnyUser,
	}

	[Flags]
	[JsonConverter(typeof(UserAuthorizationsJsonConverter))]
	public enum Authorizations : ushort
	{
		None = 0,
		EditAnyUser = 1 << 0,        // 0b0000_0000_0000_0001
		EditUserAuths = 1 << 1,      // 0b0000_0000_0000_0010
		DeleteAnyUser = 1 << 2,      // 0b0000_0000_0000_0100
		CreateSongs = 1 << 3,        // 0b0000_0000_0000_1000
		EditAnySong = 1 << 4,        // 0b0000_0000_0001_0000
		DeleteAnySong = 1 << 5,      // 0b0000_0000_0010_0000
		CreatePlaylists = 1 << 6,    // 0b0000_0000_0100_0000
		EditAnyPlaylist = 1 << 7,    // 0b0000_0000_1000_0000
		DeleteAnyPlaylist = 1 << 8,  // 0b0000_0001_0000_0000
	}
}

public static class AuthorizationsExtensions
{
	public static string GetRoles(this User.Authorizations authorizations)
	{
		List<string> roles = [];

		if ((authorizations & User.Authorizations.EditAnyUser) != 0) roles.Add("UserEditor");
		if ((authorizations & User.Authorizations.EditUserAuths) != 0) roles.Add("AuthEditor");
		if ((authorizations & User.Authorizations.DeleteAnyUser) != 0) roles.Add("UserDeleter");
		if ((authorizations & User.Authorizations.CreateSongs) != 0) roles.Add("SongCreator");
		if ((authorizations & User.Authorizations.EditAnySong) != 0) roles.Add("SongEditor");
		if ((authorizations & User.Authorizations.DeleteAnySong) != 0) roles.Add("SongDeleter");
		if ((authorizations & User.Authorizations.CreatePlaylists) != 0) roles.Add("PlaylistCreator");
		if ((authorizations & User.Authorizations.EditAnyPlaylist) != 0) roles.Add("PlaylistEditor");
		if ((authorizations & User.Authorizations.DeleteAnyPlaylist) != 0) roles.Add("PlaylistDeleter");

		return string.Join(',', roles);
	}

	public static User.Authorizations GetAuths(this string roles) =>
		roles.Split(',').GetAuths();

	public static User.Authorizations GetAuths(this IEnumerable<string> roles)
	{
		User.Authorizations auths = 0;

		if (roles.Contains("UserEditor")) auths |= User.Authorizations.EditAnyUser;
		if (roles.Contains("AuthEditor")) auths |= User.Authorizations.EditUserAuths;
		if (roles.Contains("UserDeleter")) auths |= User.Authorizations.DeleteAnyUser;
		if (roles.Contains("SongCreator")) auths |= User.Authorizations.CreateSongs;
		if (roles.Contains("SongEditor")) auths |= User.Authorizations.EditAnySong;
		if (roles.Contains("SongDeleter")) auths |= User.Authorizations.DeleteAnySong;
		if (roles.Contains("PlaylistCreator")) auths |= User.Authorizations.CreatePlaylists;
		if (roles.Contains("PlaylistEditor")) auths |= User.Authorizations.EditAnyPlaylist;
		if (roles.Contains("PlaylistDeleter")) auths |= User.Authorizations.DeleteAnyPlaylist;

		return auths;
	}
}

public class UserAuthorizationsJsonConverter : JsonConverter<User.Authorizations>
{
	public override User.Authorizations Read( ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) =>
		reader.GetString()?.GetAuths() ?? 0;

	public override void Write( Utf8JsonWriter writer, User.Authorizations auths, JsonSerializerOptions options) =>
		writer.WriteStringValue(auths.GetRoles());
}