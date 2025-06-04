namespace GmailLikeLabel_TestApp.Model
{
    public class EmailLabel
    {
        public int EmailId { get; set; }

        public Email Email { get; set; }

        public int LabelId { get; set; }
        public Label Label { get; set; }
    }
}
