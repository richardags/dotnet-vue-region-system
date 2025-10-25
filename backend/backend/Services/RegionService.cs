using Microsoft.EntityFrameworkCore;
using backend.Data;
using backend.Models;
using backend.DTOs;

namespace backend.Services
{
    public class RegionService : IRegionService
    {
        private readonly ApplicationDbContext _context;

        public RegionService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Region>> GetAllRegionsAsync()
        {
            return await _context.Regions
                .OrderBy(r => r.State)
                .ThenBy(r => r.Name)
                .ToListAsync();
        }

        public async Task<Region?> GetRegionByIdAsync(int id)
        {
            return await _context.Regions.FindAsync(id);
        }

        public async Task<Region> CreateRegionAsync(RegionDto regionDto)
        {
            var region = new Region
            {
                Name = regionDto.Name.Trim(),
                State = regionDto.State.ToUpper().Trim(),
                IsActive = true
            };

            _context.Regions.Add(region);
            await _context.SaveChangesAsync();
            return region;
        }

        public async Task<Region?> UpdateRegionAsync(int id, RegionDto regionDto)
        {
            var region = await _context.Regions.FindAsync(id);
            if (region == null)
                return null;

            region.Name = regionDto.Name.Trim();
            region.State = regionDto.State.ToUpper().Trim();
            region.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return region;
        }

        public async Task<bool> ToggleRegionStatusAsync(int id)
        {
            var region = await _context.Regions.FindAsync(id);
            if (region == null)
                return false;

            region.IsActive = !region.IsActive;
            region.UpdatedAt = DateTime.UtcNow;
            
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RegionExistsAsync(string name, string state, int? excludeId = null)
        {
            var query = _context.Regions.Where(r =>
                r.Name.ToLower() == name.Trim().ToLower() && 
                r.State.ToUpper() == state.Trim().ToUpper()
            );

            if (excludeId.HasValue)
            {
                query = query.Where(r => r.Id != excludeId.Value);
            }

            return await query.AnyAsync();
        }

        public async Task<bool> DeleteRegionAsync(int id)
        {
            var region = await _context.Regions.FindAsync(id);
            if (region == null)
                return false;

            _context.Regions.Remove(region);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}