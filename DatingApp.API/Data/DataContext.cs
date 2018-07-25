using DatingApp.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingApp.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<Value> Values { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }
        public DbSet<Message> Messages { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            //Many to many Likes relationship
            builder.Entity<Like>()
            .HasKey(k => new { k.LikerId, k.LikeeId });

            builder.Entity<Like>()
            .HasOne(u => u.Likee)
            .WithMany(u => u.Liker)
            .HasForeignKey(u => u.LikerId)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Like>()
           .HasOne(u => u.Liker)
           .WithMany(u => u.Likee)
           .HasForeignKey(u => u.LikeeId)
           .OnDelete(DeleteBehavior.Restrict);

            //Many to many Messages relationship
            builder.Entity<Message>()
            .HasKey(k => new { k.SenderId, k.RecipientId });

            builder.Entity<Message>()
            .HasOne(u => u.Sender)
            .WithMany(u => u.MessagesSent)
            .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<Message>()
             .HasOne(u => u.Recipient)
             .WithMany(u => u.MessagesReceived)
             .OnDelete(DeleteBehavior.Restrict);
        }
    }
}