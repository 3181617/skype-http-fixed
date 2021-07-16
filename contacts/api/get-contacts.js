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
const http_1 = require("../../errors/http");
const contactsUrl = __importStar(require("../contacts-url"));
const get_user_1 = require("./get-user");
async function getContacts(httpIo, apiContext) {
    // TODO: use the user contacts instead of just the user URL
    const url = contactsUrl.formatUser(apiContext.username);
    const request = {
        uri: url,
        queryString: { page_size: "100", reason: "default" },
        cookies: apiContext.cookies,
        headers: {
            "X-Skypetoken": apiContext.skypeToken.value,
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
        result = get_user_1.$GetUserResult.readJson(parsed);
    }
    catch (err) {
        throw new incident_1.Incident(err, "UnexpectedResult", { body: parsed });
    }
    return result.contacts;
}
exports.getContacts = getContacts;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvY29udGFjdHMvYXBpL2dldC1jb250YWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSx1Q0FBb0M7QUFDcEMsNENBQThEO0FBSzlELDZEQUErQztBQUMvQyx5Q0FBMkQ7QUFFcEQsS0FBSyxzQkFBc0IsTUFBaUIsRUFBRSxVQUFtQjtJQUN0RSwyREFBMkQ7SUFDM0QsTUFBTSxHQUFHLEdBQVEsV0FBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDN0QsTUFBTSxPQUFPLEdBQWtCO1FBQzdCLEdBQUcsRUFBRSxHQUFHO1FBQ1IsV0FBVyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1FBQ2xELE9BQU8sRUFBRSxVQUFVLENBQUMsT0FBTztRQUMzQixPQUFPLEVBQUU7WUFDUCxjQUFjLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLO1NBQzVDO0tBQ0YsQ0FBQztJQUNGLE1BQU0sUUFBUSxHQUFnQixNQUFNLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDeEQsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLGdDQUF5QixDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsSUFBSSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RFLENBQUM7SUFDRCxJQUFJLE1BQVcsQ0FBQztJQUNoQixJQUFJLENBQUM7UUFDSCxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDYixNQUFNLElBQUksbUJBQVEsQ0FBQyxHQUFHLEVBQUUsd0JBQXdCLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztJQUVELElBQUksTUFBcUIsQ0FBQztJQUMxQixJQUFJLENBQUM7UUFDSCxNQUFNLEdBQUcseUJBQWMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDYixNQUFNLElBQUksbUJBQVEsQ0FBQyxHQUFHLEVBQUUsa0JBQWtCLEVBQUUsRUFBQyxJQUFJLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7QUFDekIsQ0FBQztBQTdCRCxrQ0E2QkMiLCJmaWxlIjoiY29udGFjdHMvYXBpL2dldC1jb250YWN0cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluY2lkZW50IH0gZnJvbSBcImluY2lkZW50XCI7XG5pbXBvcnQgeyBVbmV4cGVjdGVkSHR0cFN0YXR1c0Vycm9yIH0gZnJvbSBcIi4uLy4uL2Vycm9ycy9odHRwXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uLy4uL2ludGVyZmFjZXMvYXBpL2NvbnRleHRcIjtcbmltcG9ydCAqIGFzIGlvIGZyb20gXCIuLi8uLi9pbnRlcmZhY2VzL2h0dHAtaW9cIjtcbmltcG9ydCB7IENvbnRhY3QgfSBmcm9tIFwiLi4vLi4vdHlwZXMvY29udGFjdFwiO1xuaW1wb3J0IHsgVXJsIH0gZnJvbSBcIi4uLy4uL3R5cGVzL3VybFwiO1xuaW1wb3J0ICogYXMgY29udGFjdHNVcmwgZnJvbSBcIi4uL2NvbnRhY3RzLXVybFwiO1xuaW1wb3J0IHsgJEdldFVzZXJSZXN1bHQsIEdldFVzZXJSZXN1bHQgfSBmcm9tIFwiLi9nZXQtdXNlclwiO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Q29udGFjdHMoaHR0cElvOiBpby5IdHRwSW8sIGFwaUNvbnRleHQ6IENvbnRleHQpOiBQcm9taXNlPENvbnRhY3RbXT4ge1xuICAvLyBUT0RPOiB1c2UgdGhlIHVzZXIgY29udGFjdHMgaW5zdGVhZCBvZiBqdXN0IHRoZSB1c2VyIFVSTFxuICBjb25zdCB1cmw6IFVybCA9IGNvbnRhY3RzVXJsLmZvcm1hdFVzZXIoYXBpQ29udGV4dC51c2VybmFtZSk7XG4gIGNvbnN0IHJlcXVlc3Q6IGlvLkdldE9wdGlvbnMgPSB7XG4gICAgdXJpOiB1cmwsXG4gICAgcXVlcnlTdHJpbmc6IHtwYWdlX3NpemU6IFwiMTAwXCIsIHJlYXNvbjogXCJkZWZhdWx0XCJ9LFxuICAgIGNvb2tpZXM6IGFwaUNvbnRleHQuY29va2llcyxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIlgtU2t5cGV0b2tlblwiOiBhcGlDb250ZXh0LnNreXBlVG9rZW4udmFsdWUsXG4gICAgfSxcbiAgfTtcbiAgY29uc3QgcmVzcG9uc2U6IGlvLlJlc3BvbnNlID0gYXdhaXQgaHR0cElvLmdldChyZXF1ZXN0KTtcbiAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgIFVuZXhwZWN0ZWRIdHRwU3RhdHVzRXJyb3IuY3JlYXRlKHJlc3BvbnNlLCBuZXcgU2V0KFsyMDBdKSwgcmVxdWVzdCk7XG4gIH1cbiAgbGV0IHBhcnNlZDogYW55O1xuICB0cnkge1xuICAgIHBhcnNlZCA9IEpTT04ucGFyc2UocmVzcG9uc2UuYm9keSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IG5ldyBJbmNpZGVudChlcnIsIFwiVW5leHBlY3RlZFJlc3BvbnNlQm9keVwiLCB7Ym9keTogcmVzcG9uc2UuYm9keX0pO1xuICB9XG5cbiAgbGV0IHJlc3VsdDogR2V0VXNlclJlc3VsdDtcbiAgdHJ5IHtcbiAgICByZXN1bHQgPSAkR2V0VXNlclJlc3VsdC5yZWFkSnNvbihwYXJzZWQpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICB0aHJvdyBuZXcgSW5jaWRlbnQoZXJyLCBcIlVuZXhwZWN0ZWRSZXN1bHRcIiwge2JvZHk6IHBhcnNlZH0pO1xuICB9XG4gIHJldHVybiByZXN1bHQuY29udGFjdHM7XG59XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uIn0=
