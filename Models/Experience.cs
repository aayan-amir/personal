using System.Collections.Generic;

namespace Portfolio.Models
{
    public class Experience
    {
        public string Role { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public string Dates { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public List<string> Responsibilities { get; set; } = new();
    }
}
