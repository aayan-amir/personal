using Portfolio.Models;
using System.Collections.Generic;

namespace Portfolio.Services
{
    public class PortfolioDataService
    {
        public Profile GetProfile()
        {
            return new Profile
            {
                Name = "Aayan Amir",
                Role = ".NET Developer Intern / Junior .NET Developer",
                Summary = "Computer Science undergraduate (3.62 CGPA) with hands-on experience building production ASP.NET Core, Windows Forms, and Avalonia UI applications end-to-end. Skilled in relational schema design, Entity Framework Core, LINQ, REST APIs, authentication/RBAC, and cloud integrations. Currently shipping and maintaining a live inventory system actively used in business operations. Seeking a .NET Developer Internship to leverage C# and backend development expertise.",
                Location = "Karachi, Pakistan",
                Email = "aayanwork1@gmail.com",
                GitHub = "https://github.com/aayan-amir",
                CGPA = 3.62,
                University = "Sir Syed University of Engineering & Technology"
            };
        }

        public List<SkillCategory> GetSkills()
        {
            return new List<SkillCategory>
            {
                new SkillCategory 
                { 
                    CategoryName = "Languages & Frameworks", 
                    Skills = new List<string> { "C#", ".NET 8 / .NET 9", "ASP.NET Core MVC", "ASP.NET Core Web API", "Entity Framework Core", "Avalonia UI", "Windows Forms" }
                },
                new SkillCategory 
                { 
                    CategoryName = "Databases & ORM", 
                    Skills = new List<string> { "PostgreSQL (Supabase)", "MySQL", "SQL Server", "Relational Schema Design", "EF Core Migrations" }
                },
                new SkillCategory 
                { 
                    CategoryName = "APIs & Security", 
                    Skills = new List<string> { "REST API Design", "Role-Based Access Control (RBAC)", "Cloudinary API", "Secret Management" }
                },
                new SkillCategory 
                { 
                    CategoryName = "DevOps & Tools", 
                    Skills = new List<string> { "Git", "GitHub", "Visual Studio 2022", "dotnet CLI", "SSMS", "Capacitor (Android Shell)" }
                }
            };
        }

        public List<Experience> GetExperience()
        {
            return new List<Experience>
            {
                new Experience
                {
                    Role = ".NET Developer",
                    Company = "KOGO Metal",
                    Dates = "Jan 2026 – Present",
                    Location = "Karachi, Pakistan",
                    Responsibilities = new List<string>
                    {
                        "Architected & Shipped Live Inventory System: Designed and deployed a full-stack inventory web application using ASP.NET Core and PostgreSQL. Implemented per-item QR code generation and real-time scanning for stock intake/removal, replacing manual tracking (~100 live items).",
                        "Internal Desktop Utilities: Developed and maintained custom in-house C# desktop tools to automate internal business workflows and reporting."
                    }
                },
                new Experience
                {
                    Role = ".NET Developer",
                    Company = "Precision Multiproducts Ltd.",
                    Dates = "June 2025 – November 2025",
                    Location = "Karachi, Pakistan",
                    Responsibilities = new List<string>
                    {
                        "Internal Support Ticketing System: Engineered a full-featured internal ticketing system using C# and ASP.NET Core to streamline support request tracking and issue resolution.",
                        "Customer & Inventory Management Portals: Built responsive ASP.NET web pages with full CRUD functionality, integrated with PostgreSQL backends to maintain customer records and stock workflows.",
                        "Database & Software Maintenance: Gathered requirements, designed relational schemas, wrote optimized SQL queries, and maintained C# codebases through routine testing and debugging."
                    }
                }
            };
        }

        public List<Project> GetProjects()
        {
            return new List<Project>
            {
                new Project
                {
                    Title = "Student Portal",
                    TechStackSummary = "ASP.NET Core MVC (.NET 8) · PostgreSQL · Cloudinary · Capacitor",
                    RepoUrl = "https://github.com/aayan-amir/StudentPortal",
                    Description = "A full-stack classroom content-sharing portal where students submit notes, images, and PDFs into moderated subject rooms with an admin approval queue.",
                    Tags = new List<string> { "ASP.NET Core", "MVC", "PostgreSQL", "Security" },
                    BulletPoints = new List<string>
                    {
                        "Engineered a custom FilesController leveraging Cloudinary API for secure file uploads, inline PDF viewing, and gated secure downloads.",
                        "Implemented admin authentication with startup-validated secrets enforcement and shipped a Capacitor Android native wrapper."
                    }
                },
                new Project
                {
                    Title = "NoTerm Command Center",
                    TechStackSummary = "Avalonia UI · .NET 8 · C# · Security-First",
                    RepoUrl = "https://github.com/aayan-amir/NOtoTERMINAL",
                    Description = "A cross-platform Linux desktop GUI offering 66 predefined system administration actions for non-terminal users.",
                    Tags = new List<string> { "Avalonia UI", "C#", "Linux", "Security" },
                    BulletPoints = new List<string>
                    {
                        "Applied security-first design: zero free-form shell input, execution via ProcessStartInfo.ArgumentList to eliminate command injection, type-validated parameters, and destructive action prompts."
                    }
                }
            };
        }
    }
}
