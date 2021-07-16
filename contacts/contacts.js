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
const http_1 = require("../errors/http");
const get_contacts_1 = require("./api/get-contacts");
const get_invites_1 = require("./api/get-invites");
const contactsUrl = __importStar(require("./contacts-url"));
/**
 * @internal
 */
class ContactsService {
    constructor(httpIo) {
        this.httpIo = httpIo;
    }
    async getInvites(apiContext) {
        const url = contactsUrl.formatInvites(apiContext.username);
        const request = {
            uri: url,
            cookies: apiContext.cookies,
            headers: {
                "X-Skypetoken": apiContext.skypeToken.value,
            },
        };
        const response = await this.httpIo.get(request);
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
            result = get_invites_1.$GetInvitesResult.readJson(parsed);
        }
        catch (err) {
            throw new incident_1.Incident(err, "UnexpectedResult", { body: parsed });
        }
        return result.inviteList;
    }
    async getContacts(apiContext) {
        return get_contacts_1.getContacts(this.httpIo, apiContext);
    }
}
exports.ContactsService = ContactsService;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvY29udGFjdHMvY29udGFjdHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUNBQW9DO0FBQ3BDLHlDQUEyRDtBQU0zRCxxREFBaUQ7QUFDakQsbURBQXdFO0FBQ3hFLDREQUE4QztBQW9COUM7O0dBRUc7QUFDSDtJQUdFLFlBQVksTUFBaUI7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVLENBQUMsVUFBbUI7UUFDbEMsTUFBTSxHQUFHLEdBQVEsV0FBVyxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDaEUsTUFBTSxPQUFPLEdBQWtCO1lBQzdCLEdBQUcsRUFBRSxHQUFHO1lBQ1IsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPO1lBQzNCLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLO2FBQzVDO1NBQ0YsQ0FBQztRQUNGLE1BQU0sUUFBUSxHQUFnQixNQUFNLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdELEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNoQyxnQ0FBeUIsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLElBQUksR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RSxDQUFDO1FBQ0QsSUFBSSxNQUFXLENBQUM7UUFDaEIsSUFBSSxDQUFDO1lBQ0gsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3JDLENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxJQUFJLG1CQUFRLENBQUMsR0FBRyxFQUFFLHdCQUF3QixFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzNFLENBQUM7UUFFRCxJQUFJLE1BQXdCLENBQUM7UUFDN0IsSUFBSSxDQUFDO1lBQ0gsTUFBTSxHQUFHLCtCQUFpQixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM5QyxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNiLE1BQU0sSUFBSSxtQkFBUSxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRSxFQUFDLElBQUksRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQzlELENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztJQUMzQixDQUFDO0lBRUQsS0FBSyxDQUFDLFdBQVcsQ0FBQyxVQUFtQjtRQUNuQyxNQUFNLENBQUMsMEJBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQzlDLENBQUM7Q0FDRjtBQXZDRCwwQ0F1Q0MiLCJmaWxlIjoiY29udGFjdHMvY29udGFjdHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmNpZGVudCB9IGZyb20gXCJpbmNpZGVudFwiO1xuaW1wb3J0IHsgVW5leHBlY3RlZEh0dHBTdGF0dXNFcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvaHR0cFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2FwaS9jb250ZXh0XCI7XG5pbXBvcnQgKiBhcyBpbyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9odHRwLWlvXCI7XG5pbXBvcnQgeyBDb250YWN0IH0gZnJvbSBcIi4uL3R5cGVzL2NvbnRhY3RcIjtcbmltcG9ydCB7IEludml0ZSB9IGZyb20gXCIuLi90eXBlcy9pbnZpdGVcIjtcbmltcG9ydCB7IFVybCB9IGZyb20gXCIuLi90eXBlcy91cmxcIjtcbmltcG9ydCB7IGdldENvbnRhY3RzIH0gZnJvbSBcIi4vYXBpL2dldC1jb250YWN0c1wiO1xuaW1wb3J0IHsgJEdldEludml0ZXNSZXN1bHQsIEdldEludml0ZXNSZXN1bHQgfSBmcm9tIFwiLi9hcGkvZ2V0LWludml0ZXNcIjtcbmltcG9ydCAqIGFzIGNvbnRhY3RzVXJsIGZyb20gXCIuL2NvbnRhY3RzLXVybFwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRhY3RzSW50ZXJmYWNlIHtcbiAgLyoqXG4gICAqIEdldCB0aGUgcGVuZGluZyBpbmNvbWluZyBjb250YWN0IGludml0YXRpb25zLlxuICAgKlxuICAgKiBAcGFyYW0gYXBpQ29udGV4dCBDdXJyZW50IEFQSSBjb250ZXh0OiB3aXRoIHRoZSBza3lwZSB0b2tlbiwgY29va2llcyBhbmQgdXNlcm5hbWVcbiAgICogQHJldHVybiBUaGUgbGlzdCBvZiBjdXJyZW50bHkgcGVuZGluZyBpbmNvbWluZyBjb250YWN0IGludml0YXRpb25zLlxuICAgKi9cbiAgZ2V0SW52aXRlcyhhcGlDb250ZXh0OiBDb250ZXh0KTogUHJvbWlzZTxJbnZpdGVbXT47XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY29udGFjdHMgb2YgdGhlIGN1cnJlbnQgdXNlci5cbiAgICpcbiAgICogQHBhcmFtIGFwaUNvbnRleHQgQ3VycmVudCBBUEkgY29udGV4dDogd2l0aCB0aGUgc2t5cGUgdG9rZW4sIGNvb2tpZXMgYW5kIHVzZXJuYW1lXG4gICAqIEByZXR1cm4gVGhlIGxpc3Qgb2YgY29udGFjdHMuXG4gICAqL1xuICBnZXRDb250YWN0cyhhcGlDb250ZXh0OiBDb250ZXh0KTogUHJvbWlzZTxDb250YWN0W10+O1xufVxuXG4vKipcbiAqIEBpbnRlcm5hbFxuICovXG5leHBvcnQgY2xhc3MgQ29udGFjdHNTZXJ2aWNlIHtcbiAgcHJpdmF0ZSByZWFkb25seSBodHRwSW86IGlvLkh0dHBJbztcblxuICBjb25zdHJ1Y3RvcihodHRwSW86IGlvLkh0dHBJbykge1xuICAgIHRoaXMuaHR0cElvID0gaHR0cElvO1xuICB9XG5cbiAgYXN5bmMgZ2V0SW52aXRlcyhhcGlDb250ZXh0OiBDb250ZXh0KTogUHJvbWlzZTxJbnZpdGVbXT4ge1xuICAgIGNvbnN0IHVybDogVXJsID0gY29udGFjdHNVcmwuZm9ybWF0SW52aXRlcyhhcGlDb250ZXh0LnVzZXJuYW1lKTtcbiAgICBjb25zdCByZXF1ZXN0OiBpby5HZXRPcHRpb25zID0ge1xuICAgICAgdXJpOiB1cmwsXG4gICAgICBjb29raWVzOiBhcGlDb250ZXh0LmNvb2tpZXMsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiWC1Ta3lwZXRva2VuXCI6IGFwaUNvbnRleHQuc2t5cGVUb2tlbi52YWx1ZSxcbiAgICAgIH0sXG4gICAgfTtcbiAgICBjb25zdCByZXNwb25zZTogaW8uUmVzcG9uc2UgPSBhd2FpdCB0aGlzLmh0dHBJby5nZXQocmVxdWVzdCk7XG4gICAgaWYgKHJlc3BvbnNlLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgICAgVW5leHBlY3RlZEh0dHBTdGF0dXNFcnJvci5jcmVhdGUocmVzcG9uc2UsIG5ldyBTZXQoWzIwMF0pLCByZXF1ZXN0KTtcbiAgICB9XG4gICAgbGV0IHBhcnNlZDogYW55O1xuICAgIHRyeSB7XG4gICAgICBwYXJzZWQgPSBKU09OLnBhcnNlKHJlc3BvbnNlLmJvZHkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhyb3cgbmV3IEluY2lkZW50KGVyciwgXCJVbmV4cGVjdGVkUmVzcG9uc2VCb2R5XCIsIHtib2R5OiByZXNwb25zZS5ib2R5fSk7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdDogR2V0SW52aXRlc1Jlc3VsdDtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gJEdldEludml0ZXNSZXN1bHQucmVhZEpzb24ocGFyc2VkKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IG5ldyBJbmNpZGVudChlcnIsIFwiVW5leHBlY3RlZFJlc3VsdFwiLCB7Ym9keTogcGFyc2VkfSk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQuaW52aXRlTGlzdDtcbiAgfVxuXG4gIGFzeW5jIGdldENvbnRhY3RzKGFwaUNvbnRleHQ6IENvbnRleHQpOiBQcm9taXNlPENvbnRhY3RbXT4ge1xuICAgIHJldHVybiBnZXRDb250YWN0cyh0aGlzLmh0dHBJbywgYXBpQ29udGV4dCk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLi4ifQ==
