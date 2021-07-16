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
const http_1 = require("../errors/http");
const api_profile_1 = require("../types/api-profile");
async function getSelfProfile(httpIo, cookies, skypeToken) {
    const url = apiUri.userProfile(apiUri.DEFAULT_USER);
    const request = {
        uri: url,
        cookies,
        headers: {
            "X-Skypetoken": skypeToken.value,
        },
    };
    const response = await httpIo.get(request);
    if (response.statusCode !== 200) {
        http_1.UnexpectedHttpStatusError.create(response, new Set([200]), request);
    }
    let parsed;
    try {
        parsed = JSON.parse(response.body);
    }
    catch (err) {
        throw new incident_1.Incident(err, "UnexpectedResponseBody", { body: response.body });
    }
    let result;
    try {
        result = api_profile_1.$ApiProfile.readJson(parsed);
    }
    catch (err) {
        throw new incident_1.Incident(err, "UnexpectedResult", { body: parsed });
    }
    return result;
}
exports.getSelfProfile = getSelfProfile;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL2dldC1zZWxmLXByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUNBQW9DO0FBRXBDLG1EQUFxQztBQUNyQyx5Q0FBMkQ7QUFHM0Qsc0RBQStEO0FBR3hELEtBQUsseUJBQ1YsTUFBaUIsRUFDakIsT0FBMEIsRUFDMUIsVUFBc0I7SUFFdEIsTUFBTSxHQUFHLEdBQVEsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDekQsTUFBTSxPQUFPLEdBQWtCO1FBQzdCLEdBQUcsRUFBRSxHQUFHO1FBQ1IsT0FBTztRQUNQLE9BQU8sRUFBRTtZQUNQLGNBQWMsRUFBRSxVQUFVLENBQUMsS0FBSztTQUNqQztLQUNGLENBQUM7SUFDRixNQUFNLFFBQVEsR0FBZ0IsTUFBTSxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoQyxnQ0FBeUIsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBQ0QsSUFBSSxNQUFXLENBQUM7SUFDaEIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2IsTUFBTSxJQUFJLG1CQUFRLENBQUMsR0FBRyxFQUFFLHdCQUF3QixFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO0lBQzNFLENBQUM7SUFDRCxJQUFJLE1BQWtCLENBQUM7SUFDdkIsSUFBSSxDQUFDO1FBQ0gsTUFBTSxHQUFHLHlCQUFXLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2IsTUFBTSxJQUFJLG1CQUFRLENBQUMsR0FBRyxFQUFFLGtCQUFrQixFQUFFLEVBQUMsSUFBSSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDaEIsQ0FBQztBQTlCRCx3Q0E4QkMiLCJmaWxlIjoiYXBpL2dldC1zZWxmLXByb2ZpbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmNpZGVudCB9IGZyb20gXCJpbmNpZGVudFwiO1xuaW1wb3J0IHRvdWdoQ29va2llIGZyb20gXCJ0b3VnaC1jb29raWVcIjtcbmltcG9ydCAqIGFzIGFwaVVyaSBmcm9tIFwiLi4vYXBpLXVyaVwiO1xuaW1wb3J0IHsgVW5leHBlY3RlZEh0dHBTdGF0dXNFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvaHR0cFwiO1xuaW1wb3J0IHsgU2t5cGVUb2tlbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2FwaS9jb250ZXh0XCI7XG5pbXBvcnQgKiBhcyBpbyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9odHRwLWlvXCI7XG5pbXBvcnQgeyAkQXBpUHJvZmlsZSwgQXBpUHJvZmlsZSB9IGZyb20gXCIuLi90eXBlcy9hcGktcHJvZmlsZVwiO1xuaW1wb3J0IHsgVXJsIH0gZnJvbSBcIi4uL3R5cGVzL3VybFwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0U2VsZlByb2ZpbGUoXG4gIGh0dHBJbzogaW8uSHR0cElvLFxuICBjb29raWVzOiB0b3VnaENvb2tpZS5TdG9yZSxcbiAgc2t5cGVUb2tlbjogU2t5cGVUb2tlbixcbik6IFByb21pc2U8QXBpUHJvZmlsZT4ge1xuICBjb25zdCB1cmw6IFVybCA9IGFwaVVyaS51c2VyUHJvZmlsZShhcGlVcmkuREVGQVVMVF9VU0VSKTtcbiAgY29uc3QgcmVxdWVzdDogaW8uR2V0T3B0aW9ucyA9IHtcbiAgICB1cmk6IHVybCxcbiAgICBjb29raWVzLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiWC1Ta3lwZXRva2VuXCI6IHNreXBlVG9rZW4udmFsdWUsXG4gICAgfSxcbiAgfTtcbiAgY29uc3QgcmVzcG9uc2U6IGlvLlJlc3BvbnNlID0gYXdhaXQgaHR0cElvLmdldChyZXF1ZXN0KTtcbiAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgIFVuZXhwZWN0ZWRIdHRwU3RhdHVzRXJyb3IuY3JlYXRlKHJlc3BvbnNlLCBuZXcgU2V0KFsyMDBdKSwgcmVxdWVzdCk7XG4gIH1cbiAgbGV0IHBhcnNlZDogYW55O1xuICB0cnkge1xuICAgIHBhcnNlZCA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBJbmNpZGVudChlcnIsIFwiVW5leHBlY3RlZFJlc3BvbnNlQm9keVwiLCB7Ym9keTogcmVzcG9uc2UuYm9keX0pO1xuICB9XG4gIGxldCByZXN1bHQ6IEFwaVByb2ZpbGU7XG4gIHRyeSB7XG4gICAgcmVzdWx0ID0gJEFwaVByb2ZpbGUucmVhZEpzb24ocGFyc2VkKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdGhyb3cgbmV3IEluY2lkZW50KGVyciwgXCJVbmV4cGVjdGVkUmVzdWx0XCIsIHtib2R5OiBwYXJzZWR9KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuIl0sInNvdXJjZVJvb3QiOiIuLiJ9
