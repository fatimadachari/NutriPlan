namespace NutriPlan.Application.Common;

public class Result<T>
{
    public bool Success { get; private set; }
    public T? Data { get; private set; }
    public string? Error { get; private set; }
    public Dictionary<string, string[]>? Errors { get; private set; }

    private Result(bool success, T? data, string? error, Dictionary<string, string[]>? errors = null)
    {
        Success = success;
        Data = data;
        Error = error;
        Errors = errors;
    }

    public static Result<T> Ok(T data) => new(true, data, null);
    public static Result<T> Fail(string error) => new(false, default, error);
    public static Result<T> Fail(Dictionary<string, string[]> errors) => new(false, default, null, errors);
}