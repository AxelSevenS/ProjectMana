using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;

namespace ProjectMana;

[Table("songs")]
public record Song
{
	[Key] [Column("id")]
	[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	[JsonPropertyName("id")]
	public uint Id { get; set; }

	[Required] [Column("author_id")]
	[JsonPropertyName("authorId")]
	public uint AuthorId { get; set; } = 1;

	[ForeignKey(nameof(AuthorId))]
	[JsonIgnore]
	public User? Author { get; set; } = null;

	[Required] [Column("name")]
	[JsonPropertyName("name")]
	public string Name { get; set; } = string.Empty;


	[Required] [Column("mime")]
	[JsonPropertyName("mimeType")]
	public string MimeType { get; set; } = string.Empty;

	[Required] [Column("file_bytes")]
	[JsonPropertyName("fileBytes")]
	public byte[] FileBytes { get; set; } = [];


	[JsonIgnore]
	public IList<Playlist> Playlists { get; set; } = [];


	public Song WithUpdatesFrom(Song other) {
		bool isFileWhole = other.FileBytes.IsNullOrEmpty() && other.MimeType.IsNullOrEmpty();
		return this with
		{
			Name = other.Name ?? Name,
			MimeType = isFileWhole ? other.MimeType : MimeType,
			FileBytes = isFileWhole ? other.FileBytes : FileBytes,
		};
	}
}