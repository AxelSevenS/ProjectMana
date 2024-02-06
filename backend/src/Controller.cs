using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;

using UserAuth = ProjectMana.User.Authorizations;

namespace ProjectMana;

public abstract class Controller<TData>(AppDbContext repository) : ControllerBase where TData : class
{
    protected readonly AppDbContext repository = repository;

	/// <summary>
	/// Check wether the user is authenticated and if the user holds the given authorizations, <c>authorization</c>
	/// </summary>
	/// <param name="authorizations"></param>
	/// <returns>True if the user is authenticated and holds the authorization(s), False if the user is not authenticated or doesn't hold the authorization(s)</returns>
	protected bool VerifyAuthorization(UserAuth authorizations)
	{
		if (
			HttpContext.User.FindFirst(ClaimTypes.Role)?.Value is string claim && 
			Enum.TryParse(claim, out UserAuth auth)
		)
		{
			return (auth & authorizations) != 0;
		}

		return false;
	}

	/// <summary>
	/// Verifies wether the user is authenticated and if it is, set <c>id</c> to the authenticated user's Id.
	/// </summary>
	/// <param name="id"></param>
	/// <returns></returns>
	protected bool TryGetAuthenticatedUserId(out uint id)
	{
		id = 0;
		if (
			HttpContext.User.FindFirst(ClaimTypes.NameIdentifier) is Claim claim && 
			uint.TryParse(Encoding.UTF8.GetBytes(claim.Value), out id)
		)
		{
			return id != 0;
		}

		return false;
	}

	/// <summary>
	/// Verify if the current authenticated user exists and has the given Id as its own
	/// </summary>
	/// <param name="validId"></param>
	/// <returns>True if the Authenticated user exists and has the given Id, False if the user is not authenticated or doesn't fit the given Id</returns>
	protected bool VerifyAuthenticatedId(uint validId) =>
		TryGetAuthenticatedUserId(out uint authenticatedId) && authenticatedId == validId;
}