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
const apiUri = __importStar(require("../api-uri"));
async function declineContactRequest(io, apiContext, contactUsername) {
    const requestOptions = {
        uri: apiUri.authRequestDecline(apiContext.username, contactUsername),
        cookies: apiContext.cookies,
        headers: {
            "X-Skypetoken": apiContext.skypeToken.value,
        },
    };
    const res = await io.put(requestOptions);
    if (res.statusCode !== 201) {
        return Promise.reject(new incident_1.Incident("net", "Failed to decline contact"));
    }
}
exports.declineContactRequest = declineContactRequest;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL2RlY2xpbmUtY29udGFjdC1yZXF1ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHVDQUFvQztBQUNwQyxtREFBcUM7QUFJOUIsS0FBSyxnQ0FDVixFQUFhLEVBQ2IsVUFBbUIsRUFDbkIsZUFBdUI7SUFFdkIsTUFBTSxjQUFjLEdBQWtCO1FBQ3BDLEdBQUcsRUFBRSxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxlQUFlLENBQUM7UUFDcEUsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPO1FBQzNCLE9BQU8sRUFBRTtZQUNQLGNBQWMsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUs7U0FDNUM7S0FDRixDQUFDO0lBQ0YsTUFBTSxHQUFHLEdBQWdCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV0RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxtQkFBUSxDQUFDLEtBQUssRUFBRSwyQkFBMkIsQ0FBQyxDQUFDLENBQUM7SUFDMUUsQ0FBQztBQUNILENBQUM7QUFqQkQsc0RBaUJDIiwiZmlsZSI6ImFwaS9kZWNsaW5lLWNvbnRhY3QtcmVxdWVzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluY2lkZW50IH0gZnJvbSBcImluY2lkZW50XCI7XG5pbXBvcnQgKiBhcyBhcGlVcmkgZnJvbSBcIi4uL2FwaS11cmlcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9hcGkvY29udGV4dFwiO1xuaW1wb3J0ICogYXMgaW8gZnJvbSBcIi4uL2ludGVyZmFjZXMvaHR0cC1pb1wiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZGVjbGluZUNvbnRhY3RSZXF1ZXN0KFxuICBpbzogaW8uSHR0cElvLFxuICBhcGlDb250ZXh0OiBDb250ZXh0LFxuICBjb250YWN0VXNlcm5hbWU6IHN0cmluZyxcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXF1ZXN0T3B0aW9uczogaW8uR2V0T3B0aW9ucyA9IHtcbiAgICB1cmk6IGFwaVVyaS5hdXRoUmVxdWVzdERlY2xpbmUoYXBpQ29udGV4dC51c2VybmFtZSwgY29udGFjdFVzZXJuYW1lKSxcbiAgICBjb29raWVzOiBhcGlDb250ZXh0LmNvb2tpZXMsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJYLVNreXBldG9rZW5cIjogYXBpQ29udGV4dC5za3lwZVRva2VuLnZhbHVlLFxuICAgIH0sXG4gIH07XG4gIGNvbnN0IHJlczogaW8uUmVzcG9uc2UgPSBhd2FpdCBpby5wdXQocmVxdWVzdE9wdGlvbnMpO1xuXG4gIGlmIChyZXMuc3RhdHVzQ29kZSAhPT0gMjAxKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBJbmNpZGVudChcIm5ldFwiLCBcIkZhaWxlZCB0byBkZWNsaW5lIGNvbnRhY3RcIikpO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
