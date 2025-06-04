using System.ComponentModel.DataAnnotations;

namespace GmailLikeLabel_TestApp.Model
{
    public class Email
    {

        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(255)]
        public string Subject { get; set; }

        [Required]
        [MaxLength(255)]
        public string Sender { get; set; }

        [Required]
        public DateTime Date { get; set; }

        public ICollection<EmailLabel>? EmailLabels { get; set; }
    }

}

