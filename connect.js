"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const incident_1 = require("incident");
const api = __importStar(require("./api"));
const context_1 = require("./interfaces/api/context");
const login_1 = require("./login");
const request_io_1 = require("./request-io");
/**
 * Authenticate the user and create a new API.
 *
 * @param options
 * @returns The Skype API for the provided user
 * @throws [[LoginError]]
 */
async function connect(options) {
    let apiContext;
    if (options.state !== undefined) {
        apiContext = context_1.Context.fromJson(options.state);
    }
    else if (options.credentials !== undefined) {
        apiContext = await login_1.login({
            io: request_io_1.requestIo,
            credentials: options.credentials,
            verbose: options.verbose,
        });
        if (options.verbose) {
            console.log("Obtained context trough authentication:");
            console.log({
                username: apiContext.username,
                skypeToken: apiContext.skypeToken,
                registrationToken: apiContext.registrationToken,
            });
        }
    }
    else {
        return Promise.reject(new incident_1.Incident("todo", "Connect must define `credentials`"));
    }
    return new api.Api(apiContext, request_io_1.requestIo);
}
exports.connect = connect;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvY29ubmVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx1Q0FBb0M7QUFDcEMsMkNBQTZCO0FBRTdCLHNEQUFtRDtBQUNuRCxtQ0FBZ0M7QUFDaEMsNkNBQXlDO0FBWXpDOzs7Ozs7R0FNRztBQUNJLEtBQUssa0JBQWtCLE9BQXVCO0lBQ25ELElBQUksVUFBbUIsQ0FBQztJQUN4QixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsVUFBVSxHQUFHLGlCQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUM3QyxVQUFVLEdBQUcsTUFBTSxhQUFLLENBQUM7WUFDdkIsRUFBRSxFQUFFLHNCQUFTO1lBQ2IsV0FBVyxFQUFFLE9BQU8sQ0FBQyxXQUFXO1lBQ2hDLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTztTQUN6QixDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwQixPQUFPLENBQUMsR0FBRyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7WUFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQztnQkFDVixRQUFRLEVBQUUsVUFBVSxDQUFDLFFBQVE7Z0JBQzdCLFVBQVUsRUFBRSxVQUFVLENBQUMsVUFBVTtnQkFDakMsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLGlCQUFpQjthQUNoRCxDQUFDLENBQUM7UUFDTCxDQUFDO0lBQ0gsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxtQkFBUSxDQUFDLE1BQU0sRUFBRSxtQ0FBbUMsQ0FBQyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsVUFBVSxFQUFFLHNCQUFTLENBQUMsQ0FBQztBQUM1QyxDQUFDO0FBdEJELDBCQXNCQyIsImZpbGUiOiJjb25uZWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5jaWRlbnQgfSBmcm9tIFwiaW5jaWRlbnRcIjtcbmltcG9ydCAqIGFzIGFwaSBmcm9tIFwiLi9hcGlcIjtcbmltcG9ydCB7IENyZWRlbnRpYWxzIH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9hcGkvYXBpXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4vaW50ZXJmYWNlcy9hcGkvY29udGV4dFwiO1xuaW1wb3J0IHsgbG9naW4gfSBmcm9tIFwiLi9sb2dpblwiO1xuaW1wb3J0IHsgcmVxdWVzdElvIH0gZnJvbSBcIi4vcmVxdWVzdC1pb1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFN0YXRlQ29udGFpbmVyIHtcbiAgc3RhdGU6IGFueTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDb25uZWN0T3B0aW9ucyB7XG4gIGNyZWRlbnRpYWxzPzogQ3JlZGVudGlhbHM7XG4gIHN0YXRlPzogQ29udGV4dC5Kc29uO1xuICB2ZXJib3NlPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBBdXRoZW50aWNhdGUgdGhlIHVzZXIgYW5kIGNyZWF0ZSBhIG5ldyBBUEkuXG4gKlxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEByZXR1cm5zIFRoZSBTa3lwZSBBUEkgZm9yIHRoZSBwcm92aWRlZCB1c2VyXG4gKiBAdGhyb3dzIFtbTG9naW5FcnJvcl1dXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25uZWN0KG9wdGlvbnM6IENvbm5lY3RPcHRpb25zKTogUHJvbWlzZTxhcGkuQXBpPiB7XG4gIGxldCBhcGlDb250ZXh0OiBDb250ZXh0O1xuICBpZiAob3B0aW9ucy5zdGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYXBpQ29udGV4dCA9IENvbnRleHQuZnJvbUpzb24ob3B0aW9ucy5zdGF0ZSk7XG4gIH0gZWxzZSBpZiAob3B0aW9ucy5jcmVkZW50aWFscyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYXBpQ29udGV4dCA9IGF3YWl0IGxvZ2luKHtcbiAgICAgIGlvOiByZXF1ZXN0SW8sXG4gICAgICBjcmVkZW50aWFsczogb3B0aW9ucy5jcmVkZW50aWFscyxcbiAgICAgIHZlcmJvc2U6IG9wdGlvbnMudmVyYm9zZSxcbiAgICB9KTtcbiAgICBpZiAob3B0aW9ucy52ZXJib3NlKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIk9idGFpbmVkIGNvbnRleHQgdHJvdWdoIGF1dGhlbnRpY2F0aW9uOlwiKTtcbiAgICAgIGNvbnNvbGUubG9nKHtcbiAgICAgICAgdXNlcm5hbWU6IGFwaUNvbnRleHQudXNlcm5hbWUsXG4gICAgICAgIHNreXBlVG9rZW46IGFwaUNvbnRleHQuc2t5cGVUb2tlbixcbiAgICAgICAgcmVnaXN0cmF0aW9uVG9rZW46IGFwaUNvbnRleHQucmVnaXN0cmF0aW9uVG9rZW4sXG4gICAgICB9KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBJbmNpZGVudChcInRvZG9cIiwgXCJDb25uZWN0IG11c3QgZGVmaW5lIGBjcmVkZW50aWFsc2BcIikpO1xuICB9XG4gIHJldHVybiBuZXcgYXBpLkFwaShhcGlDb250ZXh0LCByZXF1ZXN0SW8pO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
