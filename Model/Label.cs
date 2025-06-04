using System.ComponentModel.DataAnnotations;

namespace GmailLikeLabel_TestApp.Model
{
    public class Label
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Name { get; set; }


        [Required]
        [MaxLength(7)]
        public string ColorHex { get; set; }

        public string? Description { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<EmailLabel>? EmailLabels { get; set; }
    }

}

