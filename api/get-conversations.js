"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const incident_1 = require("incident");
const lodash_1 = __importDefault(require("lodash"));
const messagesUri = __importStar(require("../messages-uri"));
const formatters_1 = require("../utils/formatters");
async function getConversations(io, apiContext) {
    const query = {
        startTime: "0",
        view: "msnp24Equivalent",
        targetType: "Passport|Skype|Lync|Thread",
    };
    const requestOptions = {
        uri: messagesUri.conversations(apiContext.registrationToken.host, messagesUri.DEFAULT_USER),
        cookies: apiContext.cookies,
        queryString: query,
        headers: {
            RegistrationToken: apiContext.registrationToken.raw,
        },
    };
    const res = await io.get(requestOptions);
    if (res.statusCode !== 200) {
        return Promise.reject(new incident_1.Incident("net", "Unable to fetch conversations"));
    }
    const body = JSON.parse(res.body);
    return lodash_1.default.map(body.conversations, formatters_1.formatConversation);
}
exports.getConversations = getConversations;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL2dldC1jb252ZXJzYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFvQztBQUNwQyxvREFBdUI7QUFLdkIsNkRBQStDO0FBQy9DLG9EQUF5RDtBQWtCbEQsS0FBSywyQkFBMkIsRUFBYSxFQUFFLFVBQW1CO0lBQ3ZFLE1BQU0sS0FBSyxHQUEwQjtRQUNuQyxTQUFTLEVBQUUsR0FBRztRQUNkLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsVUFBVSxFQUFFLDRCQUE0QjtLQUN6QyxDQUFDO0lBRUYsTUFBTSxjQUFjLEdBQWtCO1FBQ3BDLEdBQUcsRUFBRSxXQUFXLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLFlBQVksQ0FBQztRQUMzRixPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU87UUFDM0IsV0FBVyxFQUFFLEtBQUs7UUFDbEIsT0FBTyxFQUFFO1lBQ1AsaUJBQWlCLEVBQUUsVUFBVSxDQUFDLGlCQUFpQixDQUFDLEdBQUc7U0FDcEQ7S0FDRixDQUFDO0lBQ0YsTUFBTSxHQUFHLEdBQWdCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV0RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxtQkFBUSxDQUFDLEtBQUssRUFBRSwrQkFBK0IsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUNELE1BQU0sSUFBSSxHQUFzQixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyRCxNQUFNLENBQUMsZ0JBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSwrQkFBa0IsQ0FBQyxDQUFDO0FBQ3ZELENBQUM7QUF0QkQsNENBc0JDIiwiZmlsZSI6ImFwaS9nZXQtY29udmVyc2F0aW9ucy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluY2lkZW50IH0gZnJvbSBcImluY2lkZW50XCI7XG5pbXBvcnQgXyBmcm9tIFwibG9kYXNoXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL2NvbnRleHRcIjtcbmltcG9ydCB7IENvbnZlcnNhdGlvbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2FwaS9jb252ZXJzYXRpb25cIjtcbmltcG9ydCAqIGFzIGlvIGZyb20gXCIuLi9pbnRlcmZhY2VzL2h0dHAtaW9cIjtcbmltcG9ydCB7Q29udmVyc2F0aW9uIGFzIE5hdGl2ZUNvbnZlcnNhdGlvbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL25hdGl2ZS1hcGkvY29udmVyc2F0aW9uXCI7XG5pbXBvcnQgKiBhcyBtZXNzYWdlc1VyaSBmcm9tIFwiLi4vbWVzc2FnZXMtdXJpXCI7XG5pbXBvcnQgeyBmb3JtYXRDb252ZXJzYXRpb24gfSBmcm9tIFwiLi4vdXRpbHMvZm9ybWF0dGVyc1wiO1xuXG5pbnRlcmZhY2UgQ29udmVyc2F0aW9uc0JvZHkge1xuICBjb252ZXJzYXRpb25zOiBOYXRpdmVDb252ZXJzYXRpb25bXTtcbiAgX21ldGFkYXRhOiB7XG4gICAgdG90YWxDb3VudDogbnVtYmVyO1xuICAgIGZvcndhcmRMaW5rOiBzdHJpbmc7IC8vIHVybFxuICAgIGJhY2t3YXJkTGluazogc3RyaW5nOyAvLyB1cmxcbiAgICBzeW5jU3RhdGU6IHN0cmluZzsgLy8gdXJsXG4gIH07XG59XG5cbmludGVyZmFjZSBHZXRDb252ZXJzYXRpb25zUXVlcnkge1xuICBzdGFydFRpbWU6IHN0cmluZzsgLy8gYSB0aW1lc3RhbXAgP1xuICB2aWV3OiBcIm1zbnAyNEVxdWl2YWxlbnRcIiB8IHN0cmluZztcbiAgdGFyZ2V0VHlwZTogc3RyaW5nOyAvLyBzZWVuOiBQYXNzcG9ydHxTa3lwZXxMeW5jfFRocmVhZFxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29udmVyc2F0aW9ucyhpbzogaW8uSHR0cElvLCBhcGlDb250ZXh0OiBDb250ZXh0KTogUHJvbWlzZTxDb252ZXJzYXRpb25bXT4ge1xuICBjb25zdCBxdWVyeTogR2V0Q29udmVyc2F0aW9uc1F1ZXJ5ID0ge1xuICAgIHN0YXJ0VGltZTogXCIwXCIsXG4gICAgdmlldzogXCJtc25wMjRFcXVpdmFsZW50XCIsXG4gICAgdGFyZ2V0VHlwZTogXCJQYXNzcG9ydHxTa3lwZXxMeW5jfFRocmVhZFwiLFxuICB9O1xuXG4gIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBpby5HZXRPcHRpb25zID0ge1xuICAgIHVyaTogbWVzc2FnZXNVcmkuY29udmVyc2F0aW9ucyhhcGlDb250ZXh0LnJlZ2lzdHJhdGlvblRva2VuLmhvc3QsIG1lc3NhZ2VzVXJpLkRFRkFVTFRfVVNFUiksXG4gICAgY29va2llczogYXBpQ29udGV4dC5jb29raWVzLFxuICAgIHF1ZXJ5U3RyaW5nOiBxdWVyeSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBSZWdpc3RyYXRpb25Ub2tlbjogYXBpQ29udGV4dC5yZWdpc3RyYXRpb25Ub2tlbi5yYXcsXG4gICAgfSxcbiAgfTtcbiAgY29uc3QgcmVzOiBpby5SZXNwb25zZSA9IGF3YWl0IGlvLmdldChyZXF1ZXN0T3B0aW9ucyk7XG5cbiAgaWYgKHJlcy5zdGF0dXNDb2RlICE9PSAyMDApIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEluY2lkZW50KFwibmV0XCIsIFwiVW5hYmxlIHRvIGZldGNoIGNvbnZlcnNhdGlvbnNcIikpO1xuICB9XG4gIGNvbnN0IGJvZHk6IENvbnZlcnNhdGlvbnNCb2R5ID0gSlNPTi5wYXJzZShyZXMuYm9keSk7XG4gIHJldHVybiBfLm1hcChib2R5LmNvbnZlcnNhdGlvbnMsIGZvcm1hdENvbnZlcnNhdGlvbik7XG59XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
