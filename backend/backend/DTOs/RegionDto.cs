using System.ComponentModel.DataAnnotations;

namespace backend.DTOs
{
    public class RegionDto
    {
        [Required(ErrorMessage = "Region name is required")]
        [StringLength(100, ErrorMessage = "Region name cannot exceed 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "State is required")]
        [StringLength(2, MinimumLength = 2, ErrorMessage = "State must be 2 characters")]
        public string State { get; set; } = string.Empty;
    }
}