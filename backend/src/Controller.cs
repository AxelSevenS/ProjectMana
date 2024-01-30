using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Primitives;

namespace ProjectMana;

public abstract class Controller<TData>(AppDbContext repository) : ControllerBase where TData : class
{
    protected readonly AppDbContext repository = repository;

	public static bool IsAuthValid(HttpRequest request, out JWT token)
	{
        StringValues authorization = request.Headers.Authorization;
        string? accessToken = authorization.FirstOrDefault(a => a is not null && a.StartsWith("Bearer "));

		if (accessToken is null) 
		{
			token = null!;
			return false;
		}

        accessToken = JsonSerializer.Deserialize<string>(accessToken[7..])!;
        token = JWT.Parse(accessToken)!;

        return token is not null && token.Verify();
    }

}