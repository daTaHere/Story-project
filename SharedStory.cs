using Sabio.Models.Domain.Users;
using Sabio.Models.Files;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Sabio.Models.Domain.SharedStories
{
    public class SharedStory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string Story { get; set; }
        public User CreatedBy { get; set; }
        public File File { get; set; }
        public bool IsApproved { get; set; }
        public int ApprovedBy { get; set; }
        public DateTime DateCreate { get; set; }
        public DateTime DateModified { get; set; }
    }
}