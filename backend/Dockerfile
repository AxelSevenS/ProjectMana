# Stage 1: Compile and Build C# codebase

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

COPY *.sln ./
COPY *.csproj ./
RUN dotnet restore

COPY . ./
RUN dotnet publish -c Release -o out


# Stage 2: Build backend with ASP .NET

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out ./

# Set the ASP.NET Core environment variable
ENV ASPNETCORE_URLS=http://+:5000

# Expose the desired port
EXPOSE 5000

ENTRYPOINT ["dotnet", "ProjectMana.dll"]