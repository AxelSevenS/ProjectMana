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
	/// Get all Songs
	/// </summary>
	/// <returns>
	/// All Songs
	/// </returns>
	[HttpGet("withSong/{songId}")]
    public async Task<List<Playlist>> GetAllWithSong(uint songId) =>
		await repository.Playlists.Include(p => p.Songs).Where(p => p.Songs.Any(s => s.Id == songId)).ToListAsync();

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
    public async Task<ActionResult<Playlist>> AddPlaylist([FromForm]string name)
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
    [HttpPut("{playlistId}/addSong/{songId}")]
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
    [HttpDelete("{playlistId}/removeSong/{songId}")]
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
    [HttpPut("{id}")]
	[Authorize]
    public async Task<ActionResult<Playlist>> UpdatePlaylist(uint id, [FromForm] Playlist playlist)
    {
        if (playlist is null)
        {
            return BadRequest();
        }

		Playlist? current = await repository.Playlists.Include(p => p.Songs).FirstOrDefaultAsync(p => p.Id == id);
        if ( current is null )
        {
            return NotFound();
        }

		if ( ! VerifyOwnershipOrAuthZ(current.AuthorId, ProjectMana.User.Authorizations.EditAnyPlaylist, out ActionResult<Playlist> error) )
		{
			return error;
		}

		EntityEntry<Playlist> updated = repository.Playlists.Update( current.WithUpdatesFrom(playlist) );

        repository.SaveChanges();
        return Ok(updated);
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