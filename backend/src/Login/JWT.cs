using System.Security.Cryptography;
using System.Text;
using System.Text.Json;

namespace PulsePlay;

public record JWT {

    public static readonly string Secret = "Nawmn47obf1NiJD/+/BNDKD55iOY8ct695aa8J1smZgADdLurcGnSoWhbEjejG0tWvgtGCyJpyebTwI6EA1u8A==";


    public string header { get; set; }
    public string payload { get; set; }
    public string signature { get; set; }


    public JWT(string header, string payload, string signature)
    {
        this.header = header;
        this.payload = payload;
        this.signature = signature;
    }


    private static string Base64UrlEncode(string input)
    {
        return Convert.ToBase64String(Encoding.UTF8.GetBytes(input))
            .Replace('+', '-')
            .Replace('/', '_')
            .Replace("=", "");
    }

    private static string Base64UrlDecode(string input)
    {
        input = input.Replace('-', '+').Replace('_', '/');
        switch (input.Length % 4)
        {
            case 0:
                break;
            case 2:
                input += "==";
                break;
            case 3:
                input += "=";
                break;
            default:
                throw new Exception("Illegal base64url string!");
        }

        return Encoding.UTF8.GetString(Convert.FromBase64String(input));
    }


    public JWTHeader GetDecodedHeader() => 
        JsonSerializer.Deserialize<JWTHeader>(Base64UrlDecode(header)) ?? throw new Exception("Invalid JWT header");

    public JWTPayload GetDecodedPayload() => 
        JsonSerializer.Deserialize<JWTPayload>(Base64UrlDecode(payload)) ?? throw new Exception("Invalid JWT payload");

    public string GetDecodedSignature() => 
        Base64UrlDecode(signature);


    public static JWT? Parse(string? jwt)
    {
        if (jwt is null)
        {
            return null;
        }

        string[] parts = jwt.Split('.');
        if (parts.Length != 3)
        {
            return null;
        }

        return new JWT(parts[0], parts[1], parts[2]);
    }

    public bool Verify()
    {
        if (GetDecodedPayload().exp < DateTimeOffset.UtcNow.ToUnixTimeSeconds())
        {
            return false;
        }

        return Base64UrlEncode(GenerateSignature()) == signature;
    }

    public static JWT Generate(User user)
    {
        uint iat = (uint)DateTimeOffset.UtcNow.ToUnixTimeSeconds();
        uint exp = (uint)DateTimeOffset.UtcNow.AddDays(7).ToUnixTimeSeconds();

        string header = Base64UrlEncode(JsonSerializer.Serialize(new JWTHeader()));
        string payload = Base64UrlEncode(JsonSerializer.Serialize(new JWTPayload()
            {
                id = user.id,
                email = user.email,
                password = user.password,
                iat = iat,
                exp = exp,
            })
        );
        string signature = Base64UrlEncode( GenerateSignature(header, payload) );

        return new JWT(header, payload, signature);
    }

    private static string GenerateSignature(string header, string payload)
    {
        byte[] secretBytes = Encoding.UTF8.GetBytes(Secret);
        using HMACSHA256? hmac = new(secretBytes);
        byte[] signatureBytes = hmac.ComputeHash(Encoding.UTF8.GetBytes(header + "." + payload));
        return Base64UrlDecode(Convert.ToBase64String(signatureBytes));
    }

    public static string HashPassword(string password)
    {
        byte[] secretBytes = Encoding.UTF8.GetBytes(Secret);
        using HMACSHA256? hmac = new(secretBytes);
        byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
        byte[] passwordHash = hmac.ComputeHash(passwordBytes);
        return Convert.ToBase64String(passwordHash);
    }

    public string GenerateSignature() =>
        GenerateSignature(header, payload);

    public override string ToString() =>
        header + "." + payload + "." + signature;



    public record class JWTHeader
    {
        public string alg { get; set; } = "HS256";
        public string typ { get; set; } = "JWT";
    }

    public record class JWTPayload
    {
        public uint id { get; set; } = 1;
        public string? email { get; set; } = null;
        public string? password { get; set; } = null;
        public uint iat { get; set; } = 0;
        public uint exp { get; set; } = 0;
    }

    
}