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
const messagesUri = __importStar(require("../messages-uri"));
async function setStatus(io, apiContext, status) {
    const requestBody = {
        status,
    };
    const requestOptions = {
        uri: messagesUri.userMessagingService(apiContext.registrationToken.host),
        cookies: apiContext.cookies,
        body: JSON.stringify(requestBody),
        headers: {
            RegistrationToken: apiContext.registrationToken.raw,
        },
    };
    const res = await io.put(requestOptions);
    if (res.statusCode !== 200) {
        return Promise.reject(new incident_1.Incident("send-message", "Received wrong return code"));
    }
}
exports.setStatus = setStatus;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL3NldC1zdGF0dXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUNBQW9DO0FBSXBDLDZEQUErQztBQU14QyxLQUFLLG9CQUFvQixFQUFhLEVBQUUsVUFBbUIsRUFBRSxNQUFrQjtJQUNwRixNQUFNLFdBQVcsR0FBZ0I7UUFDL0IsTUFBTTtLQUNQLENBQUM7SUFDRixNQUFNLGNBQWMsR0FBbUI7UUFDckMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDO1FBQ3hFLE9BQU8sRUFBRSxVQUFVLENBQUMsT0FBTztRQUMzQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDakMsT0FBTyxFQUFFO1lBQ1AsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUc7U0FDcEQ7S0FDRixDQUFDO0lBQ0YsTUFBTSxHQUFHLEdBQWdCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV0RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxtQkFBUSxDQUFDLGNBQWMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztBQUNILENBQUM7QUFqQkQsOEJBaUJDIiwiZmlsZSI6ImFwaS9zZXQtc3RhdHVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5jaWRlbnQgfSBmcm9tIFwiaW5jaWRlbnRcIjtcbmltcG9ydCAqIGFzIGFwaSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9hcGkvYXBpXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL2NvbnRleHRcIjtcbmltcG9ydCAqIGFzIGlvIGZyb20gXCIuLi9pbnRlcmZhY2VzL2h0dHAtaW9cIjtcbmltcG9ydCAqIGFzIG1lc3NhZ2VzVXJpIGZyb20gXCIuLi9tZXNzYWdlcy11cmlcIjtcblxuaW50ZXJmYWNlIFJlcXVlc3RCb2R5IHtcbiAgc3RhdHVzOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRTdGF0dXMoaW86IGlvLkh0dHBJbywgYXBpQ29udGV4dDogQ29udGV4dCwgc3RhdHVzOiBhcGkuU3RhdHVzKTogUHJvbWlzZTx2b2lkPiB7XG4gIGNvbnN0IHJlcXVlc3RCb2R5OiBSZXF1ZXN0Qm9keSA9IHtcbiAgICBzdGF0dXMsXG4gIH07XG4gIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBpby5Qb3N0T3B0aW9ucyA9IHtcbiAgICB1cmk6IG1lc3NhZ2VzVXJpLnVzZXJNZXNzYWdpbmdTZXJ2aWNlKGFwaUNvbnRleHQucmVnaXN0cmF0aW9uVG9rZW4uaG9zdCksXG4gICAgY29va2llczogYXBpQ29udGV4dC5jb29raWVzLFxuICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHJlcXVlc3RCb2R5KSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBSZWdpc3RyYXRpb25Ub2tlbjogYXBpQ29udGV4dC5yZWdpc3RyYXRpb25Ub2tlbi5yYXcsXG4gICAgfSxcbiAgfTtcbiAgY29uc3QgcmVzOiBpby5SZXNwb25zZSA9IGF3YWl0IGlvLnB1dChyZXF1ZXN0T3B0aW9ucyk7XG5cbiAgaWYgKHJlcy5zdGF0dXNDb2RlICE9PSAyMDApIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEluY2lkZW50KFwic2VuZC1tZXNzYWdlXCIsIFwiUmVjZWl2ZWQgd3JvbmcgcmV0dXJuIGNvZGVcIikpO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
