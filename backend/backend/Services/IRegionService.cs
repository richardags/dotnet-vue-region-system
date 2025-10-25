using backend.Models;
using backend.DTOs;

namespace backend.Services
{
    public interface IRegionService
    {
        Task<IEnumerable<Region>> GetAllRegionsAsync();
        Task<Region?> GetRegionByIdAsync(int id);
        Task<Region> CreateRegionAsync(RegionDto regionDto);
        Task<Region?> UpdateRegionAsync(int id, RegionDto regionDto);
        Task<bool> ToggleRegionStatusAsync(int id);
        Task<bool> RegionExistsAsync(string name, string state, int? excludeId = null);
        Task<bool> DeleteRegionAsync(int id);
    }
}