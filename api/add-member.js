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
async function addMemberToConversation(io, apiContext, memberId, converstionId, role = "User") {
    // `https://{host}}/v1/threads/${converstionId}/members/${memberId}`,
    const uri = messagesUri.member(apiContext.registrationToken.host, converstionId, memberId);
    const requestBody = { role };
    const requestOptions = {
        uri,
        cookies: apiContext.cookies,
        body: JSON.stringify(requestBody),
        headers: {
            "RegistrationToken": apiContext.registrationToken.raw,
            "Content-type": "application/json",
        },
    };
    const res = await io.put(requestOptions);
    if (res.statusCode !== 200) {
        return Promise.reject(new incident_1.Incident("add-member", "Received wrong return code"));
    }
}
exports.addMemberToConversation = addMemberToConversation;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL2FkZC1tZW1iZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUNBQW9DO0FBR3BDLDZEQUErQztBQU14QyxLQUFLLGtDQUNWLEVBQWEsRUFDYixVQUFtQixFQUNuQixRQUFnQixFQUNoQixhQUFxQixFQUNyQixJQUFJLEdBQUcsTUFBTTtJQUdiLHFFQUFxRTtJQUNyRSxNQUFNLEdBQUcsR0FBVyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBRW5HLE1BQU0sV0FBVyxHQUFnQixFQUFFLElBQUksRUFBRSxDQUFDO0lBQzFDLE1BQU0sY0FBYyxHQUFrQjtRQUNwQyxHQUFHO1FBQ0gsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPO1FBQzNCLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNqQyxPQUFPLEVBQUU7WUFDUCxtQkFBbUIsRUFBRSxVQUFVLENBQUMsaUJBQWlCLENBQUMsR0FBRztZQUNyRCxjQUFjLEVBQUUsa0JBQWtCO1NBQ25DO0tBQ0YsQ0FBQztJQUVGLE1BQU0sR0FBRyxHQUFnQixNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFFdEQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksbUJBQVEsQ0FBQyxZQUFZLEVBQUUsNEJBQTRCLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7QUFDSCxDQUFDO0FBM0JELDBEQTJCQyIsImZpbGUiOiJhcGkvYWRkLW1lbWJlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluY2lkZW50IH0gZnJvbSBcImluY2lkZW50XCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL2NvbnRleHRcIjtcbmltcG9ydCAqIGFzIGlvIGZyb20gXCIuLi9pbnRlcmZhY2VzL2h0dHAtaW9cIjtcbmltcG9ydCAqIGFzIG1lc3NhZ2VzVXJpIGZyb20gXCIuLi9tZXNzYWdlcy11cmlcIjtcblxuaW50ZXJmYWNlIFJlcXVlc3RCb2R5IHtcbiAgcm9sZTogXCJVc2VyXCIgfCBcIkFkbWluXCIgfCBzdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhZGRNZW1iZXJUb0NvbnZlcnNhdGlvbihcbiAgaW86IGlvLkh0dHBJbyxcbiAgYXBpQ29udGV4dDogQ29udGV4dCxcbiAgbWVtYmVySWQ6IHN0cmluZyxcbiAgY29udmVyc3Rpb25JZDogc3RyaW5nLFxuICByb2xlID0gXCJVc2VyXCIsXG4pOiBQcm9taXNlPHZvaWQ+IHtcblxuICAvLyBgaHR0cHM6Ly97aG9zdH19L3YxL3RocmVhZHMvJHtjb252ZXJzdGlvbklkfS9tZW1iZXJzLyR7bWVtYmVySWR9YCxcbiAgY29uc3QgdXJpOiBzdHJpbmcgPSBtZXNzYWdlc1VyaS5tZW1iZXIoYXBpQ29udGV4dC5yZWdpc3RyYXRpb25Ub2tlbi5ob3N0LCBjb252ZXJzdGlvbklkLCBtZW1iZXJJZCk7XG5cbiAgY29uc3QgcmVxdWVzdEJvZHk6IFJlcXVlc3RCb2R5ID0geyByb2xlIH07XG4gIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBpby5QdXRPcHRpb25zID0ge1xuICAgIHVyaSxcbiAgICBjb29raWVzOiBhcGlDb250ZXh0LmNvb2tpZXMsXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkocmVxdWVzdEJvZHkpLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiUmVnaXN0cmF0aW9uVG9rZW5cIjogYXBpQ29udGV4dC5yZWdpc3RyYXRpb25Ub2tlbi5yYXcsXG4gICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IHJlczogaW8uUmVzcG9uc2UgPSBhd2FpdCBpby5wdXQocmVxdWVzdE9wdGlvbnMpO1xuXG4gIGlmIChyZXMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBJbmNpZGVudChcImFkZC1tZW1iZXJcIiwgXCJSZWNlaXZlZCB3cm9uZyByZXR1cm4gY29kZVwiKSk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLi4ifQ==
