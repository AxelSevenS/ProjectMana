using System.Net;
using System.Net.Http.Headers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;


namespace ProjectMana;

[ApiController]
[Route("api/songs")]
public class SongController(AppDbContext repo) : Controller<Song>(repo)
{
	/// <summary>
	/// Get all Songs
	/// </summary>
	/// <returns>
	/// All Songs
	/// </returns>
	[HttpGet]
	public async Task<List<Song>> GetAll() =>
		await repository.Songs.ToListAsync();

	/// <summary>
	/// Get all Songs
	/// </summary>
	/// <returns>
	/// All Songs
	/// </returns>
	[HttpGet("fromPlaylist/{playlistId}")]
	public async Task<List<Song>> GetAllInPlaylist(uint playlistId) =>
		[.. (await repository.Playlists.Include(p => p.Songs).FirstOrDefaultAsync(p => p.Id == playlistId))?.Songs];

	/// <summary>
	/// Get a song by id
	/// </summary>
	/// <param name="id">The id of the song</param>
	/// <returns>
	/// The song with the given id
	/// </returns>
	[HttpGet("{id}")]
	public async Task<ActionResult<Song>> GetById(uint id) =>
		await repository.Songs.FindAsync(id) switch
		{
			Song song => Ok(song),
			null => NotFound(),
		};

	/// <summary>
	/// Get a song by id
	/// </summary>
	/// <param name="id">The id of the song</param>
	/// <returns>
	/// The song with the given id
	/// </returns>
	[HttpGet("file/{id}")]
	public async Task<ActionResult> GetFileById(uint id)
	{
		Song? song = await repository.Songs.FindAsync(id);
		if (song is null)
		{
			return NotFound();
		}

		return new FileContentResult(song.FileBytes, song.MimeType);
	}

	/// <summary>
	/// Register a song
	/// </summary>
	/// <param name="songname">The songname of the song</param>
	/// <param name="password">The password of the song</param>
	/// <returns>
	/// The song,
	///    or BadRequest if the song already exists
	/// </returns>
	[HttpPut]
	[Authorize]
	public async Task<ActionResult<Song>> AddSong([FromForm]string name, [FromForm]IFormFile file)
	{
		if ( ! VerifyAuthZ(ProjectMana.User.Authorizations.CreateSongs, out uint authorId, out ActionResult<Song> error) )
		{
			return error;
		}


		if (file.Length == 0)
		{
			return BadRequest(file);
		}

		if ( ! file.ContentType.StartsWith("audio") )
		{
			return BadRequest("File is incorrect format");
		}

		Stream stream = file.OpenReadStream();

		byte[] bytes = new byte[stream.Length];
		int count = await stream.ReadAsync(bytes);

		if (count == 0)
		{
			return BadRequest("Could not read file");
		}


		EntityEntry<Song> result = await repository.Songs.AddAsync(
			new()
			{
				AuthorId = authorId,
				Name = name,
				MimeType = file.ContentType,
				FileBytes = bytes
			}
		);

		repository.SaveChanges();
		return Ok(result.Entity);
	}

	/// <summary>
	/// Update a song
	/// </summary>
	/// <param name="id">The id of the song</param>
	/// <param name="song">The updates to apply</param>
	/// <returns>
	/// The updated song
	/// </returns>
	[HttpPut("{id}")]
	[Authorize]
	public async Task<ActionResult<Song>> UpdateSong(uint id, [FromForm] Song song)
	{
		if (song is null)
		{
			return BadRequest();
		}

		Song? current = await repository.Songs.FindAsync(id);
		if ( current is null )
		{
			return NotFound();
		}

		if ( ! VerifyOwnershipOrAuthZ(current.AuthorId, ProjectMana.User.Authorizations.EditAnySong, out ActionResult<Song> result) )
		{
			return result;
		}

		EntityEntry<Song> updated = repository.Songs.Update( current.WithUpdatesFrom(song) );

		repository.SaveChanges();
		return Ok(updated);
	}

	/// <summary>
	/// Delete a song
	/// </summary>
	/// <param name="id">The id of the song</param>
	/// <returns>
	/// The deleted song
	/// </returns>
	[HttpDelete("{id}")]
	[Authorize]
	public async Task<ActionResult<Song>> DeleteSong(uint id)
	{
		Song? current = await repository.Songs.FindAsync(id);
		if ( current is null )
		{
			return NotFound();
		}

		if ( ! VerifyOwnershipOrAuthZ(current.AuthorId, ProjectMana.User.Authorizations.DeleteAnySong, out ActionResult<Song> result) )
		{
			return result;
		}

		repository.Songs.Remove(current);

		repository.SaveChanges();
		return Ok(current);
	}
}