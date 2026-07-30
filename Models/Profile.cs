namespace Portfolio.Models
{
    public class Profile
    {
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string Summary { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string GitHub { get; set; } = string.Empty;
        public double CGPA { get; set; }
        public string University { get; set; } = string.Empty;
    }
}
