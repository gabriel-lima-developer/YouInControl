namespace YouInControl.Application.Common;

public sealed class AppResult<T>
{
    private AppResult(bool succeeded, T? value, AppErrorType errorType, string? error)
    {
        Succeeded = succeeded;
        Value = value;
        ErrorType = errorType;
        Error = error;
    }

    public bool Succeeded { get; }
    public T? Value { get; }
    public AppErrorType ErrorType { get; }
    public string? Error { get; }

    public static AppResult<T> Success(T value)
    {
        return new AppResult<T>(true, value, AppErrorType.None, null);
    }

    public static AppResult<T> Validation(string error)
    {
        return new AppResult<T>(false, default, AppErrorType.Validation, error);
    }

    public static AppResult<T> NotFound(string error)
    {
        return new AppResult<T>(false, default, AppErrorType.NotFound, error);
    }
}
