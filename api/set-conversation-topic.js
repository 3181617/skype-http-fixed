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
async function setConversationTopic(io, apiContext, conversationId, topic) {
    const requestBody = {
        topic,
    };
    const uri = messagesUri.properties(apiContext.registrationToken.host, conversationId);
    const requestOptions = {
        uri,
        cookies: apiContext.cookies,
        body: JSON.stringify(requestBody),
        queryString: { name: "topic" },
        headers: {
            "RegistrationToken": apiContext.registrationToken.raw,
            "Content-type": "application/json",
        },
    };
    const res = await io.put(requestOptions);
    if (res.statusCode !== 200) {
        return Promise.reject(new incident_1.Incident("set-conversation-topic", "Received wrong return code"));
    }
}
exports.setConversationTopic = setConversationTopic;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL3NldC1jb252ZXJzYXRpb24tdG9waWMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsdUNBQW9DO0FBR3BDLDZEQUErQztBQU14QyxLQUFLLCtCQUNWLEVBQWEsRUFDYixVQUFtQixFQUNuQixjQUFzQixFQUN0QixLQUFhO0lBR2IsTUFBTSxXQUFXLEdBQWdCO1FBQy9CLEtBQUs7S0FDTixDQUFDO0lBRUYsTUFBTSxHQUFHLEdBQVcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO0lBRTlGLE1BQU0sY0FBYyxHQUFrQjtRQUNwQyxHQUFHO1FBQ0gsT0FBTyxFQUFFLFVBQVUsQ0FBQyxPQUFPO1FBQzNCLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztRQUNqQyxXQUFXLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDO1FBQzVCLE9BQU8sRUFBRTtZQUNQLG1CQUFtQixFQUFFLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHO1lBQ3JELGNBQWMsRUFBRSxrQkFBa0I7U0FDbkM7S0FDRixDQUFDO0lBQ0YsTUFBTSxHQUFHLEdBQWdCLE1BQU0sRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUV0RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxtQkFBUSxDQUFDLHdCQUF3QixFQUFFLDRCQUE0QixDQUFDLENBQUMsQ0FBQztJQUM5RixDQUFDO0FBQ0gsQ0FBQztBQTVCRCxvREE0QkMiLCJmaWxlIjoiYXBpL3NldC1jb252ZXJzYXRpb24tdG9waWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmNpZGVudCB9IGZyb20gXCJpbmNpZGVudFwiO1xuaW1wb3J0IHsgQ29udGV4dCB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2FwaS9jb250ZXh0XCI7XG5pbXBvcnQgKiBhcyBpbyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9odHRwLWlvXCI7XG5pbXBvcnQgKiBhcyBtZXNzYWdlc1VyaSBmcm9tIFwiLi4vbWVzc2FnZXMtdXJpXCI7XG5cbmludGVyZmFjZSBSZXF1ZXN0Qm9keSB7XG4gIHRvcGljOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZXRDb252ZXJzYXRpb25Ub3BpYyhcbiAgaW86IGlvLkh0dHBJbyxcbiAgYXBpQ29udGV4dDogQ29udGV4dCxcbiAgY29udmVyc2F0aW9uSWQ6IHN0cmluZyxcbiAgdG9waWM6IHN0cmluZyxcbik6IFByb21pc2U8dm9pZD4ge1xuXG4gIGNvbnN0IHJlcXVlc3RCb2R5OiBSZXF1ZXN0Qm9keSA9IHtcbiAgICB0b3BpYyxcbiAgfTtcblxuICBjb25zdCB1cmk6IHN0cmluZyA9IG1lc3NhZ2VzVXJpLnByb3BlcnRpZXMoYXBpQ29udGV4dC5yZWdpc3RyYXRpb25Ub2tlbi5ob3N0LCBjb252ZXJzYXRpb25JZCk7XG5cbiAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IGlvLlB1dE9wdGlvbnMgPSB7XG4gICAgdXJpLFxuICAgIGNvb2tpZXM6IGFwaUNvbnRleHQuY29va2llcyxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShyZXF1ZXN0Qm9keSksXG4gICAgcXVlcnlTdHJpbmc6IHtuYW1lOiBcInRvcGljXCJ9LFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiUmVnaXN0cmF0aW9uVG9rZW5cIjogYXBpQ29udGV4dC5yZWdpc3RyYXRpb25Ub2tlbi5yYXcsXG4gICAgICBcIkNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIixcbiAgICB9LFxuICB9O1xuICBjb25zdCByZXM6IGlvLlJlc3BvbnNlID0gYXdhaXQgaW8ucHV0KHJlcXVlc3RPcHRpb25zKTtcblxuICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgSW5jaWRlbnQoXCJzZXQtY29udmVyc2F0aW9uLXRvcGljXCIsIFwiUmVjZWl2ZWQgd3JvbmcgcmV0dXJuIGNvZGVcIikpO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
