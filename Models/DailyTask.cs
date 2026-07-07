namespace Rational.Models
{
    public class DailyTask
    {
        public string Name { get; set; } = string.Empty;
        public List<DateTimeOffset> CompletedAt { get; set; } = new();
    }
}
