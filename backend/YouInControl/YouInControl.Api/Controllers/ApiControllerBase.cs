using Microsoft.AspNetCore.Mvc;
using YouInControl.Application.Common;

namespace YouInControl.Api.Controllers;

public abstract class ApiControllerBase : ControllerBase {
    protected ActionResult ToErrorResult<T>(AppResult<T> result) {
        return result.ErrorType switch {
            AppErrorType.Validation => BadRequest(new { message = result.Error }),
            AppErrorType.NotFound => NotFound(new { message = result.Error }),
            _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = "Unexpected error." })
        };
    }

    protected ActionResult ToErrorResult(AppResult result) {
        return result.ErrorType switch {
            AppErrorType.Validation => BadRequest(new { message = result.Error }),
            AppErrorType.NotFound => NotFound(new { message = result.Error }),
            _ => StatusCode(StatusCodes.Status500InternalServerError, new { message = "Unexpected error." })
        };
    }
}
