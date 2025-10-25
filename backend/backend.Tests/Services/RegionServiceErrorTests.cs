using backend.Data;
using backend.Services;
using backend.Models;
using backend.DTOs;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace backend.Tests.Services
{
    public class RegionServiceErrorTests
    {
        private ApplicationDbContext GetDbContext()
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            return new ApplicationDbContext(options);
        }

        [Fact]
        public async Task GetRegionByIdAsync_NonExistentId_ReturnsNull()
        {
            // Arrange
            var context = GetDbContext();
            var service = new RegionService(context);

            // Act
            var result = await service.GetRegionByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateRegionAsync_NonExistentId_ReturnsNull()
        {
            // Arrange
            var context = GetDbContext();
            var service = new RegionService(context);
            var updateDto = new RegionDto
            {
                Name = "Test Region",
                State = "CA"
            };

            // Act
            var result = await service.UpdateRegionAsync(999, updateDto);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task ToggleRegionStatusAsync_NonExistentId_ReturnsFalse()
        {
            // Arrange
            var context = GetDbContext();
            var service = new RegionService(context);

            // Act
            var result = await service.ToggleRegionStatusAsync(999);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task RegionExistsAsync_ExcludeCurrentId_ReturnsFalse()
        {
            // Arrange
            var context = GetDbContext();
            var service = new RegionService(context);
            var region = new Region
            {
                Name = "Test Region",
                State = "CA",
                IsActive = true
            };
            context.Regions.Add(region);
            await context.SaveChangesAsync();

            // Act
            var exists = await service.RegionExistsAsync("Test Region", "CA", region.Id);

            // Assert
            Assert.False(exists);
        }
    }
}