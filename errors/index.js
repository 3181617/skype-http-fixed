"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
exports.RequestError = http_1.RequestError;
exports.UnexpectedHttpStatusError = http_1.UnexpectedHttpStatusError;
var wrong_credentials_1 = require("./wrong-credentials");
exports.WrongCredentialsError = wrong_credentials_1.WrongCredentialsError;
var wrong_credentials_limit_1 = require("./wrong-credentials-limit");
exports.WrongCredentialsLimitError = wrong_credentials_limit_1.WrongCredentialsLimitError;
const endpointRegistrationError = __importStar(require("./endpoint-registration"));
exports.endpointRegistrationError = endpointRegistrationError;
const LoginRateLimitExceeded = __importStar(require("./login-rate-limit-exceeded"));
exports.LoginRateLimitExceeded = LoginRateLimitExceeded;
const microsoftAccount = __importStar(require("./microsoft-account"));
exports.microsoftAccount = microsoftAccount;
const RedirectionLimit = __importStar(require("./redirection-limit"));
exports.RedirectionLimit = RedirectionLimit;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvZXJyb3JzL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLCtCQUFpRTtBQUF4RCw4QkFBQSxZQUFZLENBQUE7QUFBRSwyQ0FBQSx5QkFBeUIsQ0FBQTtBQUNoRCx5REFBNEQ7QUFBbkQsb0RBQUEscUJBQXFCLENBQUE7QUFDOUIscUVBQXVFO0FBQTlELCtEQUFBLDBCQUEwQixDQUFBO0FBRW5DLG1GQUFxRTtBQUsxQyw4REFBeUI7QUFKcEQsb0ZBQXNFO0FBSWhCLHdEQUFzQjtBQUg1RSxzRUFBd0Q7QUFHL0MsNENBQWdCO0FBRnpCLHNFQUF3RDtBQUVzQiw0Q0FBZ0IiLCJmaWxlIjoiZXJyb3JzL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IHsgUmVxdWVzdEVycm9yLCBVbmV4cGVjdGVkSHR0cFN0YXR1c0Vycm9yIH0gZnJvbSBcIi4vaHR0cFwiO1xuZXhwb3J0IHsgV3JvbmdDcmVkZW50aWFsc0Vycm9yIH0gZnJvbSBcIi4vd3JvbmctY3JlZGVudGlhbHNcIjtcbmV4cG9ydCB7IFdyb25nQ3JlZGVudGlhbHNMaW1pdEVycm9yIH0gZnJvbSBcIi4vd3JvbmctY3JlZGVudGlhbHMtbGltaXRcIjtcblxuaW1wb3J0ICogYXMgZW5kcG9pbnRSZWdpc3RyYXRpb25FcnJvciBmcm9tIFwiLi9lbmRwb2ludC1yZWdpc3RyYXRpb25cIjtcbmltcG9ydCAqIGFzIExvZ2luUmF0ZUxpbWl0RXhjZWVkZWQgZnJvbSBcIi4vbG9naW4tcmF0ZS1saW1pdC1leGNlZWRlZFwiO1xuaW1wb3J0ICogYXMgbWljcm9zb2Z0QWNjb3VudCBmcm9tIFwiLi9taWNyb3NvZnQtYWNjb3VudFwiO1xuaW1wb3J0ICogYXMgUmVkaXJlY3Rpb25MaW1pdCBmcm9tIFwiLi9yZWRpcmVjdGlvbi1saW1pdFwiO1xuXG5leHBvcnQgeyBtaWNyb3NvZnRBY2NvdW50LCBlbmRwb2ludFJlZ2lzdHJhdGlvbkVycm9yLCBMb2dpblJhdGVMaW1pdEV4Y2VlZGVkLCBSZWRpcmVjdGlvbkxpbWl0IH07XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
