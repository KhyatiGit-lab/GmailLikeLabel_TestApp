using GmailLikeLabel_TestApp.Model;
using Microsoft.EntityFrameworkCore;

namespace GmailLikeLabel_TestApp.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Label> Labels { get; set; }

        public DbSet<Email> Emails { get; set; }
        public DbSet<EmailLabel> EmailLabels { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmailLabel>()
            .HasKey(el => new { el.EmailId, el.LabelId });

            modelBuilder.Entity<EmailLabel>()
            .HasOne(el => el.Email)
            .WithMany(e => e.EmailLabels)
            .HasForeignKey(el => el.EmailId);

            modelBuilder.Entity<EmailLabel>()
            .HasOne(el => el.Label)
            .WithMany(l => l.EmailLabels)
            .HasForeignKey(el => el.LabelId);
        }

    }
}
