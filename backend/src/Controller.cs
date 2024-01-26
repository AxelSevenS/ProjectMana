using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace ProjectMana;

public abstract class Controller<T, TData>(T repository) : ControllerBase where T : Repository<TData> where TData : class
{
    protected readonly T repository = repository;

	public static bool IsAuthValid(HttpRequest request, out JWT token)
	{
        var authorization = request.Headers.Authorization;
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