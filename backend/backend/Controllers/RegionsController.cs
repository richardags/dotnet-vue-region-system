using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    /// <summary>
    /// Controller for managing regions
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class RegionsController : ControllerBase
    {
        private readonly IRegionService _regionService;

        public RegionsController(IRegionService regionService)
        {
            _regionService = regionService;
        }

        /// <summary>
        /// Get all regions ordered by State and Name
        /// </summary>
        /// <returns>List of all regions</returns>
        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<Region>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<Region>>> GetRegions()
        {
            var regions = await _regionService.GetAllRegionsAsync();
            return Ok(regions);
        }

        /// <summary>
        /// Get a specific region by id
        /// </summary>
        /// <param name="id">The ID of the region to retrieve</param>
        /// <returns>The requested region</returns>
        [HttpGet("{id}")]
        [ProducesResponseType(typeof(Region), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Region>> GetRegion(int id)
        {
            var region = await _regionService.GetRegionByIdAsync(id);
            if (region == null)
                return NotFound();

            return Ok(region);
        }

        /// <summary>
        /// Create a new region
        /// </summary>
        /// <param name="regionDto">The region data to create</param>
        /// <returns>The created region</returns>
        [HttpPost]
        [ProducesResponseType(typeof(Region), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<Region>> CreateRegion(RegionDto regionDto)
        {
            if (await _regionService.RegionExistsAsync(regionDto.Name, regionDto.State))
                return BadRequest($"A region with name {regionDto.Name} already exists in state {regionDto.State}");

            var region = await _regionService.CreateRegionAsync(regionDto);
            return CreatedAtAction(nameof(GetRegion), new { id = region.Id }, region);
        }

        /// <summary>
        /// Update an existing region
        /// </summary>
        /// <param name="id">The ID of the region to update</param>
        /// <param name="regionDto">The updated region data</param>
        /// <returns>The updated region</returns>
        [HttpPut("{id}")]
        [ProducesResponseType(typeof(Region), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UpdateRegion(int id, RegionDto regionDto)
        {
            if (await _regionService.RegionExistsAsync(regionDto.Name, regionDto.State, id))
                return BadRequest($"A region with name {regionDto.Name} already exists in state {regionDto.State}");

            var region = await _regionService.UpdateRegionAsync(id, regionDto);
            if (region == null)
                return NotFound();

            return Ok(region);
        }

        /// <summary>
        /// Toggle the active status of a region
        /// </summary>
        /// <param name="id">The ID of the region to toggle</param>
        /// <returns>No content</returns>
        [HttpPatch("{id}/toggle-status")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> ToggleRegionStatus(int id)
        {
            var success = await _regionService.ToggleRegionStatusAsync(id);
            if (!success)
                return NotFound();

            return Ok();
        }
    }
}