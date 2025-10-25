using Microsoft.AspNetCore.Mvc;
using Moq;
using Xunit;
using backend.Controllers;
using backend.Services;
using backend.Models;
using backend.DTOs;

namespace backend.Tests.Controllers
{
    public class RegionsControllerTests
    {
      private readonly Mock<IRegionService> _mockRegionService;
        private readonly RegionsController _controller;

        public RegionsControllerTests()
        {
 _mockRegionService = new Mock<IRegionService>();
        _controller = new RegionsController(_mockRegionService.Object);
        }

     [Fact]
        public async Task DeleteRegion_ExistingId_ReturnsNoContent()
        {
      // Arrange
   var regionId = 1;
       _mockRegionService.Setup(service => service.DeleteRegionAsync(regionId))
       .ReturnsAsync(true);

          // Act
    var result = await _controller.DeleteRegion(regionId);

   // Assert
        Assert.IsType<NoContentResult>(result);
_mockRegionService.Verify(service => service.DeleteRegionAsync(regionId), Times.Once);
        }

        [Fact]
        public async Task DeleteRegion_NonExistentId_ReturnsNotFound()
        {
        // Arrange
            var regionId = 999;
            _mockRegionService.Setup(service => service.DeleteRegionAsync(regionId))
                .ReturnsAsync(false);

            // Act
  var result = await _controller.DeleteRegion(regionId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
    _mockRegionService.Verify(service => service.DeleteRegionAsync(regionId), Times.Once);
        }
    }
}