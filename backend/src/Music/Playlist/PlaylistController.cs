using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;


namespace ProjectMana;

[ApiController]
[Route("api/playlists")]
public class PlaylistController(AppDbContext repo) : Controller<Playlist>(repo)
{
	/// <summary>
	/// Get all Playlists
	/// </summary>
	/// <returns>
	/// All Playlists
	/// </returns>
	[HttpGet]
	public async Task<List<Playlist>> GetAll() =>
		await repository.Playlists.Include(p => p.Songs).ToListAsync();

	/// <summary>
	/// Get playlists by their author's id
	/// </summary>
	/// <param name="id">The id of the playlist author</param>
	/// <returns>
	/// The playlists with the given author id
	/// </returns>
	[HttpGet("byAuthor/{id}")]
	public async Task<ActionResult<List<Song>>> GetByAuthorId(uint id) =>
		repository.Playlists.Include(p => p.Songs)
			.Where(s => s.AuthorId == id) switch
		{
			IQueryable<Playlist> songQuery => Ok(await songQuery.ToListAsync()),
			null => NotFound(),
		};

	/// <summary>
	/// Get all Songs
	/// </summary>
	/// <returns>
	/// All Songs
	/// </returns>
	[HttpGet("withSong/{songId}")]
	public async Task<List<Playlist>> GetAllWithSong(uint songId) =>
		await repository.Playlists.Include(p => p.Songs)
			.Where(p => p.Songs.Any(s => s.Id == songId)).ToListAsync();

	/// <summary>
	/// Get a song by id
	/// </summary>
	/// <param name="id">The id of the song</param>
	/// <returns>
	/// The song with the given id
	/// </returns>
	[HttpGet("{id}")]
	public async Task<ActionResult<Playlist>> GetById(uint id) =>
		await repository.Playlists.Include(p => p.Songs).FirstOrDefaultAsync(s => s.Id == id) switch
		{
			Playlist song => Ok(song),
			null => NotFound(),
		};

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
	public async Task<ActionResult<Playlist>> AddPlaylist([FromForm] string name)
	{
		if ( ! VerifyAuthZ(ProjectMana.User.Authorizations.CreatePlaylists, out uint authorId, out ActionResult<Playlist> error) )
		{
			return error;
		}

		EntityEntry<Playlist> result = await repository.Playlists.AddAsync(
			new()
			{
				AuthorId = authorId,
				Name = name,
			}
		);

		repository.SaveChanges();
		return Ok(result.Entity);
	}

	/// <summary>
	/// Add a song to a playlist
	/// </summary>
	/// <param name="playlistId"></param>
	/// <param name="songId"></param>
	/// <returns></returns>
	[HttpPost("{playlistId}/addSong/{songId}")]
	[Authorize]
	public async Task<ActionResult<Playlist>> AddSongToPlaylist(uint playlistId, uint songId)
	{

		Playlist? current = await repository.Playlists.Include(p => p.Songs).FirstOrDefaultAsync(p => p.Id == playlistId);
		if ( current is null )
		{
			return NotFound(playlistId);
		}

		Song? song = await repository.Songs.FindAsync(songId);
		if ( song is null )
		{
			return NotFound(songId);
		}

		if ( ! VerifyOwnershipOrAuthZ(current.AuthorId, ProjectMana.User.Authorizations.EditAnyPlaylist, out ActionResult<Playlist> error) )
		{
			return error;
		}

		if ( current.Songs.Any(s => s.Id == songId) )
		{
			return BadRequest("Song already exists in the playlist");
		}


		current.Songs.Add(song);

		repository.SaveChanges();
		return Ok(current);
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
	[HttpPost("{playlistId}/removeSong/{songId}")]
	[Authorize]
	public async Task<ActionResult<Playlist>> RemoveSongFromPlaylist(uint playlistId, uint songId)
	{
		Playlist? current = await repository.Playlists.Include(p => p.Songs).FirstOrDefaultAsync(p => p.Id == playlistId);
		if ( current is null )
		{
			return NotFound(playlistId);
		}
		
		Song? song = await repository.Songs.FindAsync(songId);
		if ( song is null )
		{
			return NotFound(songId);
		}

		if ( ! VerifyOwnershipOrAuthZ(current.AuthorId, ProjectMana.User.Authorizations.EditAnyPlaylist, out ActionResult<Playlist> error) )
		{
			return error;
		}

		current.Songs.Remove(song);

		repository.SaveChanges();
		return Ok(current);
	}

	/// <summary>
	/// Update a playlist
	/// </summary>
	/// <param name="id">The id of the playlist</param>
	/// <param name="playlist">The updates to apply</param>
	/// <returns>
	/// The updated playlist
	/// </returns>
	[HttpPatch("{id}")]
	[Authorize]
	public async Task<ActionResult<Playlist>> UpdatePlaylist(uint id, [FromForm] string? name, [FromForm] uint? authorId)
	{
		if (name is null && authorId is null)
		{
			return BadRequest();
		}

		Playlist? playlist = await repository.Playlists.Include(p => p.Songs).FirstOrDefaultAsync(p => p.Id == id);
		if ( playlist is null )
		{
			return NotFound();
		}

		if ( ! VerifyOwnershipOrAuthZ(playlist.AuthorId, ProjectMana.User.Authorizations.EditAnyPlaylist, out ActionResult<Playlist> error) )
		{
			return error;
		}

		playlist.Name = name ?? playlist.Name;
		playlist.AuthorId = authorId ?? playlist.AuthorId;

		repository.SaveChanges();
		return Ok(playlist);
	}

	/// <summary>
	/// Delete a playlist
	/// </summary>
	/// <param name="id">The id of the playlist</param>
	/// <returns>
	/// The deleted playlist
	/// </returns>
	[HttpDelete("{id}")]
	[Authorize]
	public async Task<ActionResult<Playlist>> DeletePlaylist(uint id)
	{
		Playlist? current = await repository.Playlists.Include(p => p.Songs).FirstOrDefaultAsync(p => p.Id == id);
		if ( current is null )
		{
			return NotFound();
		}

		if ( ! VerifyOwnershipOrAuthZ(current.AuthorId, ProjectMana.User.Authorizations.DeleteAnyPlaylist, out ActionResult<Playlist> error) )
		{
			return error;
		}

		repository.Playlists.Remove(current);

		repository.SaveChanges();
		return Ok(current);
	}
}