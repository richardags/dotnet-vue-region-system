using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.DTOs;
using backend.Models;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RegionsController : ControllerBase
    {
        private readonly IRegionService _regionService;

        public RegionsController(IRegionService regionService)
        {
            _regionService = regionService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Region>>> GetRegions()
        {
            var regions = await _regionService.GetAllRegionsAsync();
            return Ok(regions);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Region>> GetRegion(int id)
        {
            var region = await _regionService.GetRegionByIdAsync(id);
            if (region == null)
                return NotFound();

                return Ok(region);
        }

        [HttpPost]
        public async Task<ActionResult<Region>> CreateRegion(RegionDto regionDto)
        {
            if (await _regionService.RegionExistsAsync(regionDto.Name, regionDto.State))
                return BadRequest($"A region with name {regionDto.Name} already exists in state {regionDto.State}");

            var region = await _regionService.CreateRegionAsync(regionDto);
            return CreatedAtAction(nameof(GetRegion), new { id = region.Id }, region);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRegion(int id, RegionDto regionDto)
        {
            if (await _regionService.RegionExistsAsync(regionDto.Name, regionDto.State, id))
                return BadRequest($"A region with name {regionDto.Name} already exists in state {regionDto.State}");

            var region = await _regionService.UpdateRegionAsync(id, regionDto);
            if (region == null)
                return NotFound();

            return Ok(region);
        }

        [HttpPatch("{id}/toggle-status")]
        public async Task<IActionResult> ToggleRegionStatus(int id)
        {
            var success = await _regionService.ToggleRegionStatusAsync(id);
            if (!success)
                return NotFound();

            return Ok();
        }
    }
}