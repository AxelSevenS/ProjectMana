using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ProjectMana;

[Table("songs")]
public record Song
{
	[Key] [Column("id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	[JsonPropertyName("id")]
    public uint Id { get; set; }

	[Column("author_id")]
	[JsonPropertyName("author-id")]
    public uint AuthorId { get; set; } = 1;

	[ForeignKey(nameof(AuthorId))]
	[JsonIgnore]
    public User? Author { get; set; } = null;

	[Required] [Column("name")]
	[JsonPropertyName("name")]
    public string? Name { get; set; } = null;


	[Required] [Column("file_name")]
	[JsonPropertyName("file-name")]
    public string? FileName { get; set; } = null;

	[Required] [Column("mime")]
	[JsonPropertyName("mime")]
    public string? MimeType { get; set; } = null;

	[Required] [Column("file_bytes")]
	[JsonPropertyName("file-bytes")]
    public byte[]? FileBytes { get; set; } = [];


	public Song WithUpdatesFrom(Song other) {
		bool isFileWhole = other.FileBytes is not null && other.FileName is not null && other.MimeType is not null;
		return this with
		{
			Name = other.Name ?? Name,
			FileName = isFileWhole ? other.FileName : FileName,
			MimeType = isFileWhole ? other.MimeType : MimeType,
			FileBytes = isFileWhole ? other.FileBytes : FileBytes,
		};
	}
}