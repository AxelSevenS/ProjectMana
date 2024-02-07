using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace ProjectMana;

[Table("playlists")]
public record Playlist
{
	[Key] [Column("id")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
	[JsonPropertyName("id")]
    public uint Id { get; set; }

	[Column("author_id")]
	[JsonPropertyName("author-id")]
    public uint AuthorId { get; set; } = 0;

	[ForeignKey(nameof(AuthorId))]
	[JsonIgnore]
    public User? Author { get; set; } = null;

	[Required] [Column("name")]
	[JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

	// [JsonIgnore]
	public IList<Song> Songs { get; set; } = [];


	public Playlist WithUpdatesFrom(Playlist other) {
		return this with
		{
			Name = other.Name ?? Name,
		};
	}
}