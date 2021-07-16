"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const incident_1 = require("incident");
var WrongCredentialsError;
(function (WrongCredentialsError) {
    WrongCredentialsError.name = "WrongCredentials";
})(WrongCredentialsError = exports.WrongCredentialsError || (exports.WrongCredentialsError = {}));
(function (WrongCredentialsError) {
    function format({ username }) {
        if (typeof username === "string") {
            return `Wrong credentials for the user "${username}"`;
        }
        else {
            return "Wrong credentials";
        }
    }
    WrongCredentialsError.format = format;
    function create(username) {
        return incident_1.Incident(WrongCredentialsError.name, { username }, format);
    }
    WrongCredentialsError.create = create;
})(WrongCredentialsError = exports.WrongCredentialsError || (exports.WrongCredentialsError = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvZXJyb3JzL3dyb25nLWNyZWRlbnRpYWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQW9DO0FBRXBDLElBQWlCLHFCQUFxQixDQVNyQztBQVRELFdBQWlCLHFCQUFxQjtJQUV2QiwwQkFBSSxHQUFTLGtCQUFrQixDQUFDO0FBTy9DLENBQUMsRUFUZ0IscUJBQXFCLEdBQXJCLDZCQUFxQixLQUFyQiw2QkFBcUIsUUFTckM7QUFLRCxXQUFpQixxQkFBcUI7SUFHcEMsZ0JBQXVCLEVBQUMsUUFBUSxFQUFPO1FBQ3JDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sUUFBUSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLG1DQUFtQyxRQUFRLEdBQUcsQ0FBQztRQUN4RCxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixNQUFNLENBQUMsbUJBQW1CLENBQUM7UUFDN0IsQ0FBQztJQUNILENBQUM7SUFOZSw0QkFBTSxTQU1yQixDQUFBO0lBRUQsZ0JBQXVCLFFBQWlCO1FBQ3RDLE1BQU0sQ0FBQyxtQkFBUSxDQUFDLHNCQUFBLElBQUksRUFBRSxFQUFDLFFBQVEsRUFBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQzVDLENBQUM7SUFGZSw0QkFBTSxTQUVyQixDQUFBO0FBQ0gsQ0FBQyxFQWRnQixxQkFBcUIsR0FBckIsNkJBQXFCLEtBQXJCLDZCQUFxQixRQWNyQyIsImZpbGUiOiJlcnJvcnMvd3JvbmctY3JlZGVudGlhbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmNpZGVudCB9IGZyb20gXCJpbmNpZGVudFwiO1xuXG5leHBvcnQgbmFtZXNwYWNlIFdyb25nQ3JlZGVudGlhbHNFcnJvciB7XG4gIGV4cG9ydCB0eXBlIE5hbWUgPSBcIldyb25nQ3JlZGVudGlhbHNcIjtcbiAgZXhwb3J0IGNvbnN0IG5hbWU6IE5hbWUgPSBcIldyb25nQ3JlZGVudGlhbHNcIjtcblxuICBleHBvcnQgaW50ZXJmYWNlIERhdGEge1xuICAgIHVzZXJuYW1lPzogc3RyaW5nO1xuICB9XG5cbiAgZXhwb3J0IHR5cGUgQ2F1c2UgPSB1bmRlZmluZWQ7XG59XG5cbi8qIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCB0eXBlIFdyb25nQ3JlZGVudGlhbHNFcnJvciA9IEluY2lkZW50PFdyb25nQ3JlZGVudGlhbHNFcnJvci5EYXRhLCBXcm9uZ0NyZWRlbnRpYWxzRXJyb3IuTmFtZSwgV3JvbmdDcmVkZW50aWFsc0Vycm9yLkNhdXNlPjtcblxuZXhwb3J0IG5hbWVzcGFjZSBXcm9uZ0NyZWRlbnRpYWxzRXJyb3Ige1xuICBleHBvcnQgdHlwZSBUeXBlID0gV3JvbmdDcmVkZW50aWFsc0Vycm9yO1xuXG4gIGV4cG9ydCBmdW5jdGlvbiBmb3JtYXQoe3VzZXJuYW1lfTogRGF0YSkge1xuICAgIGlmICh0eXBlb2YgdXNlcm5hbWUgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIHJldHVybiBgV3JvbmcgY3JlZGVudGlhbHMgZm9yIHRoZSB1c2VyIFwiJHt1c2VybmFtZX1cImA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIldyb25nIGNyZWRlbnRpYWxzXCI7XG4gICAgfVxuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZSh1c2VybmFtZT86IHN0cmluZyk6IFdyb25nQ3JlZGVudGlhbHNFcnJvciB7XG4gICAgcmV0dXJuIEluY2lkZW50KG5hbWUsIHt1c2VybmFtZX0sIGZvcm1hdCk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLi4ifQ==
