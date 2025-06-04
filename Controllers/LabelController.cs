using GmailLikeLabel_TestApp.Data;
using GmailLikeLabel_TestApp.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace GmailLikeLabel_TestApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LabelController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LabelController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/label
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Label>>> GetAllLabels()
        {
            return await _context.Labels.ToListAsync();
        }

        // GET: api/label/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Label>> GetLabelById(int id)
        {
            var label = await _context.Labels.FindAsync(id);
            if (label == null)
            {
                return NotFound($"Label with ID {id} not found.");
            }
            return label;
        }

        // POST: api/label
        [HttpPost]
        public async Task<ActionResult<Label>> CreateLabel(Label label)
        {
            if (label == null)
            {
                return BadRequest("Lbael cannot be null.");
            }
            _context.Labels.Add(label);
            await _context.SaveChangesAsync();
            return Ok(label);
        }

        // PUT: api/label/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLabel(int id, Label updatedLabel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var label = await _context.Labels.FindAsync(id);
            if (label == null)
            {
                return NotFound($"Label with ID {id} not found.");
            }
            label.Name = updatedLabel.Name;
            label.ColorHex = updatedLabel.ColorHex;
            label.Description = updatedLabel.Description;
            await _context.SaveChangesAsync();
            return Ok(label);
        }

        // DELETE: api/label/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLabel(int id)
        {
            var label = await _context.Labels.FindAsync(id);
            if (label == null)
            {
                return NotFound($"Label with ID {id} not found.");
            }
            _context.Labels.Remove(label);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
