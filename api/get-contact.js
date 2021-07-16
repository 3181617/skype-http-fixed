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
const formatters_1 = require("../utils/formatters");
exports.VIRTUAL_CONTACTS = new Set(["concierge", "echo123"]);
async function getContact(io, apiContext, contactId) {
    if (exports.VIRTUAL_CONTACTS.has(contactId)) {
        // tslint:disable-next-line:max-line-length
        throw new Error(`${JSON.stringify(contactId)} is not a real contact, you cannot get data for ${JSON.stringify(contactId)}`);
    }
    const requestOptions = {
        uri: apiUri.userProfiles(),
        cookies: apiContext.cookies,
        form: { usernames: [contactId] },
        headers: {
            "X-Skypetoken": apiContext.skypeToken.value,
        },
    };
    const res = await io.post(requestOptions);
    if (res.statusCode !== 200) {
        return Promise.reject(new incident_1.Incident("net", "Unable to fetch contact"));
    }
    const body = formatters_1.formatSearchContact(JSON.parse(res.body)[0]);
    return body;
}
exports.getContact = getContact;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL2dldC1jb250YWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLHVDQUFvQztBQUNwQyxtREFBcUM7QUFJckMsb0RBQTBEO0FBRTdDLFFBQUEsZ0JBQWdCLEdBQWdCLElBQUksR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFFeEUsS0FBSyxxQkFBcUIsRUFBYSxFQUFFLFVBQW1CLEVBQUUsU0FBaUI7SUFDcEYsRUFBRSxDQUFDLENBQUMsd0JBQWdCLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwQywyQ0FBMkM7UUFDM0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLG1EQUFtRCxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM5SCxDQUFDO0lBQ0QsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLEdBQUcsRUFBRSxNQUFNLENBQUMsWUFBWSxFQUFFO1FBQzFCLE9BQU8sRUFBRSxVQUFVLENBQUMsT0FBTztRQUMzQixJQUFJLEVBQUUsRUFBQyxTQUFTLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBQztRQUM5QixPQUFPLEVBQUU7WUFDUCxjQUFjLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxLQUFLO1NBQzVDO0tBQ0YsQ0FBQztJQUNGLE1BQU0sR0FBRyxHQUFnQixNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdkQsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLFVBQVUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksbUJBQVEsQ0FBQyxLQUFLLEVBQUUseUJBQXlCLENBQUMsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFDRCxNQUFNLElBQUksR0FBWSxnQ0FBbUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25FLE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBbkJELGdDQW1CQyIsImZpbGUiOiJhcGkvZ2V0LWNvbnRhY3QuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmNpZGVudCB9IGZyb20gXCJpbmNpZGVudFwiO1xuaW1wb3J0ICogYXMgYXBpVXJpIGZyb20gXCIuLi9hcGktdXJpXCI7XG5pbXBvcnQgeyBDb250YWN0IH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL2NvbnRhY3RcIjtcbmltcG9ydCB7IENvbnRleHQgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9hcGkvY29udGV4dFwiO1xuaW1wb3J0ICogYXMgaW8gZnJvbSBcIi4uL2ludGVyZmFjZXMvaHR0cC1pb1wiO1xuaW1wb3J0IHsgZm9ybWF0U2VhcmNoQ29udGFjdCB9IGZyb20gXCIuLi91dGlscy9mb3JtYXR0ZXJzXCI7XG5cbmV4cG9ydCBjb25zdCBWSVJUVUFMX0NPTlRBQ1RTOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoW1wiY29uY2llcmdlXCIsIFwiZWNobzEyM1wiXSk7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRDb250YWN0KGlvOiBpby5IdHRwSW8sIGFwaUNvbnRleHQ6IENvbnRleHQsIGNvbnRhY3RJZDogc3RyaW5nKTogUHJvbWlzZTxDb250YWN0PiB7XG4gIGlmIChWSVJUVUFMX0NPTlRBQ1RTLmhhcyhjb250YWN0SWQpKSB7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgIHRocm93IG5ldyBFcnJvcihgJHtKU09OLnN0cmluZ2lmeShjb250YWN0SWQpfSBpcyBub3QgYSByZWFsIGNvbnRhY3QsIHlvdSBjYW5ub3QgZ2V0IGRhdGEgZm9yICR7SlNPTi5zdHJpbmdpZnkoY29udGFjdElkKX1gKTtcbiAgfVxuICBjb25zdCByZXF1ZXN0T3B0aW9uczogaW8uUG9zdE9wdGlvbnMgPSB7XG4gICAgdXJpOiBhcGlVcmkudXNlclByb2ZpbGVzKCksXG4gICAgY29va2llczogYXBpQ29udGV4dC5jb29raWVzLFxuICAgIGZvcm06IHt1c2VybmFtZXM6IFtjb250YWN0SWRdfSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIlgtU2t5cGV0b2tlblwiOiBhcGlDb250ZXh0LnNreXBlVG9rZW4udmFsdWUsXG4gICAgfSxcbiAgfTtcbiAgY29uc3QgcmVzOiBpby5SZXNwb25zZSA9IGF3YWl0IGlvLnBvc3QocmVxdWVzdE9wdGlvbnMpO1xuICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgSW5jaWRlbnQoXCJuZXRcIiwgXCJVbmFibGUgdG8gZmV0Y2ggY29udGFjdFwiKSk7XG4gIH1cbiAgY29uc3QgYm9keTogQ29udGFjdCA9IGZvcm1hdFNlYXJjaENvbnRhY3QoSlNPTi5wYXJzZShyZXMuYm9keSlbMF0pO1xuICByZXR1cm4gYm9keTtcbn1cbiJdLCJzb3VyY2VSb290IjoiLi4ifQ==
