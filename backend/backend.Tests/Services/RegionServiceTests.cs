using backend.Data;
using backend.Services;
using backend.Models;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace backend.Tests.Services
{
    public class RegionServiceTests
    {
        private ApplicationDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task CreateRegionAsync_ValidData_ReturnsCreatedRegion()
        {
            // Arrange
            var context = GetDbContext();
            var service = new RegionService(context);
            var regionDto = new RegionDto
            {
                Name = "New England",
                State = "MA"
            };

            // Act
            var result = await service.CreateRegionAsync(regionDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(regionDto.Name, result.Name);
            Assert.Equal(regionDto.State, result.State);
            Assert.True(result.IsActive);
        }

        [Fact]
        public async Task GetAllRegionsAsync_ReturnsOrderedRegions()
        {
            // Arrange
            var context = GetDbContext();
            var service = new RegionService(context);

            await context.Regions.AddRangeAsync(new List<Region>
            {
                new Region { Name = "Central", State = "NY", IsActive = true },
                new Region { Name = "South", State = "FL", IsActive = true },
                new Region { Name = "North", State = "NY", IsActive = true }
            });
            await context.SaveChangesAsync();

            // Act
            var results = await service.GetAllRegionsAsync();
            var regionsList = results.ToList();

            // Assert
            Assert.Equal(3, regionsList.Count);
            Assert.Equal("FL", regionsList[0].State); // First by State
            Assert.Equal(2, regionsList.Count(r => r.State == "NY")); // Two NY regions
        }

        [Fact]
        public async Task RegionExistsAsync_DuplicateRegion_ReturnsTrue()
        {
            // Arrange
            var context = GetDbContext();
            var service = new RegionService(context);
            var region = new Region
            {
                Name = "Western",
                State = "CA",
                IsActive = true
            };
            context.Regions.Add(region);
            await context.SaveChangesAsync();

            // Act
            var exists = await service.RegionExistsAsync("Western", "CA");

            // Assert
            Assert.True(exists);
        }

        [Fact]
        public async Task ToggleRegionStatusAsync_ValidId_TogglesStatus()
        {
            // Arrange
            var context = GetDbContext();
            var service = new RegionService(context);
            var region = new Region
            {
                Name = "Eastern",
                State = "NY",
                IsActive = true
            };
            context.Regions.Add(region);
            await context.SaveChangesAsync();

            // Act
            var result = await service.ToggleRegionStatusAsync(region.Id);
            var updatedRegion = await context.Regions.FindAsync(region.Id);

            // Assert
            Assert.True(result);
            Assert.False(updatedRegion.IsActive);
        }

        [Fact]
        public async Task UpdateRegionAsync_ValidData_UpdatesRegion()
        {
            // Arrange
            var context = GetDbContext();
            var service = new RegionService(context);
            var region = new Region
            {
                Name = "Old Name",
                State = "NY",
                IsActive = true
            };
            context.Regions.Add(region);
            await context.SaveChangesAsync();

            var updateDto = new RegionDto
            {
                Name = "New Name",
                State = "CA"
            };

            // Act
            var result = await service.UpdateRegionAsync(region.Id, updateDto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(updateDto.Name, result.Name);
            Assert.Equal(updateDto.State, result.State);
            Assert.NotNull(result.UpdatedAt);
        }
    }
}