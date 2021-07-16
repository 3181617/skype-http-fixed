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
async function acceptContactRequest(io, apiContext, contactUsername) {
    const requestOptions = {
        uri: apiUri.authRequestAccept(apiContext.username, contactUsername),
        cookies: apiContext.cookies,
        headers: {
            "X-Skypetoken": apiContext.skypeToken.value,
        },
    };
    const res = await io.put(requestOptions);
    if (res.statusCode !== 201) {
        return Promise.reject(new incident_1.Incident("net", "Failed to accept contact"));
    }
}
exports.acceptContactRequest = acceptContactRequest;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL2FjY2VwdC1jb250YWN0LXJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUNBQW9DO0FBQ3BDLG1EQUFxQztBQUk5QixLQUFLLCtCQUErQixFQUFhLEVBQUUsVUFBbUIsRUFBRSxlQUF1QjtJQUNwRyxNQUFNLGNBQWMsR0FBa0I7UUFDcEMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLGVBQWUsQ0FBQztRQUNuRSxPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU87UUFDM0IsT0FBTyxFQUFFO1lBQ1AsY0FBYyxFQUFFLFVBQVUsQ0FBQyxVQUFVLENBQUMsS0FBSztTQUM1QztLQUNGLENBQUM7SUFDRixNQUFNLEdBQUcsR0FBZ0IsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3RELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLG1CQUFRLENBQUMsS0FBSyxFQUFFLDBCQUEwQixDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0FBQ0gsQ0FBQztBQVpELG9EQVlDIiwiZmlsZSI6ImFwaS9hY2NlcHQtY29udGFjdC1yZXF1ZXN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5jaWRlbnQgfSBmcm9tIFwiaW5jaWRlbnRcIjtcbmltcG9ydCAqIGFzIGFwaVVyaSBmcm9tIFwiLi4vYXBpLXVyaVwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2FwaS9jb250ZXh0XCI7XG5pbXBvcnQgKiBhcyBpbyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9odHRwLWlvXCI7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBhY2NlcHRDb250YWN0UmVxdWVzdChpbzogaW8uSHR0cElvLCBhcGlDb250ZXh0OiBDb250ZXh0LCBjb250YWN0VXNlcm5hbWU6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCByZXF1ZXN0T3B0aW9uczogaW8uR2V0T3B0aW9ucyA9IHtcbiAgICB1cmk6IGFwaVVyaS5hdXRoUmVxdWVzdEFjY2VwdChhcGlDb250ZXh0LnVzZXJuYW1lLCBjb250YWN0VXNlcm5hbWUpLFxuICAgIGNvb2tpZXM6IGFwaUNvbnRleHQuY29va2llcyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIlgtU2t5cGV0b2tlblwiOiBhcGlDb250ZXh0LnNreXBlVG9rZW4udmFsdWUsXG4gICAgfSxcbiAgfTtcbiAgY29uc3QgcmVzOiBpby5SZXNwb25zZSA9IGF3YWl0IGlvLnB1dChyZXF1ZXN0T3B0aW9ucyk7XG4gIGlmIChyZXMuc3RhdHVzQ29kZSAhPT0gMjAxKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBJbmNpZGVudChcIm5ldFwiLCBcIkZhaWxlZCB0byBhY2NlcHQgY29udGFjdFwiKSk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLi4ifQ==
