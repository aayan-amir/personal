using System.Collections.Generic;

namespace Portfolio.Models
{
    public class Project
    {
        public string Title { get; set; } = string.Empty;
        public string TechStackSummary { get; set; } = string.Empty;
        public string RepoUrl { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public List<string> BulletPoints { get; set; } = new();
        public List<string> Tags { get; set; } = new();
    }
}
