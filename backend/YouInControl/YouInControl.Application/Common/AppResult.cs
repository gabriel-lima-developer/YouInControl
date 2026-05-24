namespace YouInControl.Application.Common;

public sealed class AppResult
{
    private AppResult(bool succeeded, AppErrorType errorType, string? error)
    {
        Succeeded = succeeded;
        ErrorType = errorType;
        Error = error;
    }

    public bool Succeeded { get; }
    public AppErrorType ErrorType { get; }
    public string? Error { get; }

    public static AppResult Success()
    {
        return new AppResult(true, AppErrorType.None, null);
    }

    public static AppResult Validation(string error)
    {
        return new AppResult(false, AppErrorType.Validation, error);
    }

    public static AppResult NotFound(string error)
    {
        return new AppResult(false, AppErrorType.NotFound, error);
    }
}
