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
const utils_1 = require("../utils");
async function createConversation(io, apiContext, allUsers) {
    // Each member object consists of an ``id`` (user thread identifier), and role (either ``Admin`` or ``User``).
    const members = utils_1.getMembers(allUsers);
    const requestBody = {
        members,
    };
    const uri = messagesUri.threads(apiContext.registrationToken.host);
    const requestOptions = {
        uri,
        cookies: apiContext.cookies,
        body: JSON.stringify(requestBody),
        headers: {
            RegistrationToken: apiContext.registrationToken.raw,
            Location: "/",
        },
    };
    const res = await io.post(requestOptions);
    if (res.statusCode !== 201) {
        throw new incident_1.Incident("create-conversation", "Received wrong return code");
    }
    const location = res.headers.location;
    if (location === undefined) {
        throw new incident_1.Incident("create-conversation", "Missing `Location` response header");
    }
    // TODO: Parse URL properly / more reliable checks
    const id = location.split("/").pop();
    if (id === undefined) {
        throw new incident_1.Incident("create-conversation", "Unable to read conversation ID");
    }
    // conversation ID
    return id;
}
exports.createConversation = createConversation;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL2NyZWF0ZS1jb252ZXJzYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUNBQW9DO0FBSXBDLDZEQUErQztBQUMvQyxvQ0FBc0M7QUFNL0IsS0FBSyw2QkFDVixFQUFhLEVBQ2IsVUFBbUIsRUFDbkIsUUFBa0I7SUFHbEIsOEdBQThHO0lBQzlHLE1BQU0sT0FBTyxHQUFjLGtCQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsTUFBTSxXQUFXLEdBQWdCO1FBQy9CLE9BQU87S0FDUixDQUFDO0lBRUYsTUFBTSxHQUFHLEdBQVcsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFM0UsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLEdBQUc7UUFDSCxPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU87UUFDM0IsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2pDLE9BQU8sRUFBRTtZQUNQLGlCQUFpQixFQUFFLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHO1lBQ25ELFFBQVEsRUFBRSxHQUFHO1NBQ2Q7S0FDRixDQUFDO0lBRUYsTUFBTSxHQUFHLEdBQWdCLE1BQU0sRUFBRSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV2RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxJQUFJLG1CQUFRLENBQUMscUJBQXFCLEVBQUUsNEJBQTRCLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBRUQsTUFBTSxRQUFRLEdBQXVCLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO0lBQzFELEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sSUFBSSxtQkFBUSxDQUFDLHFCQUFxQixFQUFFLG9DQUFvQyxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUNELGtEQUFrRDtJQUNsRCxNQUFNLEVBQUUsR0FBdUIsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUN6RCxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUNyQixNQUFNLElBQUksbUJBQVEsQ0FBQyxxQkFBcUIsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFDO0lBQzlFLENBQUM7SUFDRCxrQkFBa0I7SUFDbEIsTUFBTSxDQUFDLEVBQUUsQ0FBQztBQUNaLENBQUM7QUF6Q0QsZ0RBeUNDIiwiZmlsZSI6ImFwaS9jcmVhdGUtY29udmVyc2F0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5jaWRlbnQgfSBmcm9tIFwiaW5jaWRlbnRcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9hcGkvY29udGV4dFwiO1xuaW1wb3J0ICogYXMgaW8gZnJvbSBcIi4uL2ludGVyZmFjZXMvaHR0cC1pb1wiO1xuaW1wb3J0IHsgQWxsVXNlcnMsIE1lbWJlcnMgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9uYXRpdmUtYXBpL2NvbnZlcnNhdGlvblwiO1xuaW1wb3J0ICogYXMgbWVzc2FnZXNVcmkgZnJvbSBcIi4uL21lc3NhZ2VzLXVyaVwiO1xuaW1wb3J0IHsgZ2V0TWVtYmVycyB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5pbnRlcmZhY2UgUmVxdWVzdEJvZHkge1xuICBtZW1iZXJzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNyZWF0ZUNvbnZlcnNhdGlvbihcbiAgaW86IGlvLkh0dHBJbyxcbiAgYXBpQ29udGV4dDogQ29udGV4dCxcbiAgYWxsVXNlcnM6IEFsbFVzZXJzLFxuKTogUHJvbWlzZTxhbnk+IHtcblxuICAvLyBFYWNoIG1lbWJlciBvYmplY3QgY29uc2lzdHMgb2YgYW4gYGBpZGBgICh1c2VyIHRocmVhZCBpZGVudGlmaWVyKSwgYW5kIHJvbGUgKGVpdGhlciBgYEFkbWluYGAgb3IgYGBVc2VyYGApLlxuICBjb25zdCBtZW1iZXJzOiBNZW1iZXJzW10gPSBnZXRNZW1iZXJzKGFsbFVzZXJzKTtcbiAgY29uc3QgcmVxdWVzdEJvZHk6IFJlcXVlc3RCb2R5ID0ge1xuICAgIG1lbWJlcnMsXG4gIH07XG5cbiAgY29uc3QgdXJpOiBzdHJpbmcgPSBtZXNzYWdlc1VyaS50aHJlYWRzKGFwaUNvbnRleHQucmVnaXN0cmF0aW9uVG9rZW4uaG9zdCk7XG5cbiAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IGlvLlBvc3RPcHRpb25zID0ge1xuICAgIHVyaSxcbiAgICBjb29raWVzOiBhcGlDb250ZXh0LmNvb2tpZXMsXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkocmVxdWVzdEJvZHkpLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFJlZ2lzdHJhdGlvblRva2VuOiBhcGlDb250ZXh0LnJlZ2lzdHJhdGlvblRva2VuLnJhdyxcbiAgICAgIExvY2F0aW9uOiBcIi9cIixcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IHJlczogaW8uUmVzcG9uc2UgPSBhd2FpdCBpby5wb3N0KHJlcXVlc3RPcHRpb25zKTtcblxuICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwMSkge1xuICAgIHRocm93IG5ldyBJbmNpZGVudChcImNyZWF0ZS1jb252ZXJzYXRpb25cIiwgXCJSZWNlaXZlZCB3cm9uZyByZXR1cm4gY29kZVwiKTtcbiAgfVxuXG4gIGNvbnN0IGxvY2F0aW9uOiBzdHJpbmcgfCB1bmRlZmluZWQgPSByZXMuaGVhZGVycy5sb2NhdGlvbjtcbiAgaWYgKGxvY2F0aW9uID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgSW5jaWRlbnQoXCJjcmVhdGUtY29udmVyc2F0aW9uXCIsIFwiTWlzc2luZyBgTG9jYXRpb25gIHJlc3BvbnNlIGhlYWRlclwiKTtcbiAgfVxuICAvLyBUT0RPOiBQYXJzZSBVUkwgcHJvcGVybHkgLyBtb3JlIHJlbGlhYmxlIGNoZWNrc1xuICBjb25zdCBpZDogc3RyaW5nIHwgdW5kZWZpbmVkID0gbG9jYXRpb24uc3BsaXQoXCIvXCIpLnBvcCgpO1xuICBpZiAoaWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBJbmNpZGVudChcImNyZWF0ZS1jb252ZXJzYXRpb25cIiwgXCJVbmFibGUgdG8gcmVhZCBjb252ZXJzYXRpb24gSURcIik7XG4gIH1cbiAgLy8gY29udmVyc2F0aW9uIElEXG4gIHJldHVybiBpZDtcbn1cbiJdLCJzb3VyY2VSb290IjoiLi4ifQ==
