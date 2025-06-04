using GmailLikeLabel_TestApp.Data;
using GmailLikeLabel_TestApp.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GmailLikeLabel_TestApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmailController : ControllerBase
    {

        private readonly AppDbContext _context;

        public EmailController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/email
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Email>>> GetAllEmails()
        {
            return await _context.Emails
            .Include(e => e.EmailLabels)
            .ThenInclude(el => el.Label)
            .ToListAsync();
        }

        // POST: api/email
        [HttpPost]
        public async Task<ActionResult<Email>> CreateEmail(Email email)
        {
            _context.Emails.Add(email);
            await _context.SaveChangesAsync();
            return Ok(email);
        }

        // POST: api/email/{emailId}/labels
        [HttpPost("{emailId}/labels")]
        public async Task<IActionResult> AssignLabelsToEmail(int emailId, [FromBody] List<int> labelIds)
        {
            var email = await _context.Emails
            .Include(e => e.EmailLabels)
            .FirstOrDefaultAsync(e => e.Id == emailId);

            if (email == null) return NotFound("Email not found.");

            foreach (var labelId in labelIds)
            {
                if (!email.EmailLabels.Any(el => el.LabelId == labelId))
                {
                    email.EmailLabels.Add(new EmailLabel { EmailId = emailId, LabelId = labelId });
                }
            }

            await _context.SaveChangesAsync();
            return Ok();
        }

        // DELETE: api/email/{emailId}/labels/{labelId}
        [HttpDelete("{emailId}/labels/{labelId}")]
        public async Task<IActionResult> RemoveLabelFromEmail(int emailId, int labelId)
        {
            var emailLabel = await _context.EmailLabels
            .FirstOrDefaultAsync(el => el.EmailId == emailId && el.LabelId == labelId);

            if (emailLabel == null) return NotFound("Label not assigned to this email.");

            _context.EmailLabels.Remove(emailLabel);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}