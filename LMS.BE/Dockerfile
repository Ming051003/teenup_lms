FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj files and restore dependencies
COPY LMS.API/LMS.API.csproj LMS.API/
COPY LMS.BLL/LMS.BLL.csproj LMS.BLL/
COPY LMS.DAL/LMS.DAL.csproj LMS.DAL/
COPY LMS.Model/LMS.Model.csproj LMS.Model/
RUN dotnet restore LMS.API/LMS.API.csproj

# Copy the source and publish
COPY . .
WORKDIR /src/LMS.API
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "LMS.API.dll"]

