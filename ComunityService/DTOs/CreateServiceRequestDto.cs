public class CreateServiceRequestDto
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int? CategoryId { get; set; }
}

public class UpdateServiceRequestStatusDto
{
    public ServiceStatus Status { get; set; }
    public string? CancelReason { get; set; }
}