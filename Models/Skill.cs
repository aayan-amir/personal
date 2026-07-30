using System.Collections.Generic;

namespace Portfolio.Models
{
    public class SkillCategory
    {
        public string CategoryName { get; set; } = string.Empty;
        public List<string> Skills { get; set; } = new();
    }
}
