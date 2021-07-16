"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("async-file"));
const incident_1 = require("incident");
const messagesUri = __importStar(require("../messages-uri"));
const utils_1 = require("../utils");
async function sendImage(io, apiContext, img, conversationId) {
    const bodyNewObject = {
        type: "pish/image",
        permissions: { [conversationId]: ["read"] },
    };
    const bodyNewObjectStr = JSON.stringify(bodyNewObject);
    const requestOptionsNewObject = {
        uri: messagesUri.objects("api.asm.skype.com"),
        cookies: apiContext.cookies,
        body: bodyNewObjectStr,
        headers: {
            "Authorization": `skype_token ${apiContext.skypeToken.value}`,
            "Content-Type": "application/json",
            "Content-Length": bodyNewObjectStr.length.toString(10),
        },
    };
    const resNewObject = await io.post(requestOptionsNewObject);
    if (resNewObject.statusCode !== 201) {
        return Promise.reject(new incident_1.Incident("send-image", "Received wrong return code"));
    }
    const objectId = JSON.parse(resNewObject.body).id;
    const file = await fs.readFile(img.file);
    const requestOptionsPutObject = {
        uri: messagesUri.objectContent("api.asm.skype.com", objectId, "imgpsh"),
        cookies: apiContext.cookies,
        body: file,
        headers: {
            "Authorization": `skype_token ${apiContext.skypeToken.value}`,
            "Content-Type": "multipart/form-data",
            "Content-Length": file.byteLength.toString(10),
        },
    };
    const resObject = await io.put(requestOptionsPutObject);
    if (resObject.statusCode !== 201) {
        return Promise.reject(new incident_1.Incident("send-image", "Received wrong return code"));
    }
    const pictureUri = messagesUri.object("api.asm.skype.com", objectId);
    const pictureThumbnailUri = messagesUri.objectView("api.asm.skype.com", objectId, "imgt1");
    const query = {
        clientmessageid: String(utils_1.getCurrentTime() + Math.floor(10000 * Math.random())),
        content: `
      <URIObject type="Picture.1" uri="${pictureUri}" url_thumbnail="${pictureThumbnailUri}">
        loading...
        <OriginalName v="${img.name}"/>
        <meta type="photo" originalName="${img.name}"/>
      </URIObject>
    `,
        messagetype: "RichText/UriObject",
        contenttype: "text",
    };
    const requestOptions = {
        uri: messagesUri.messages(apiContext.registrationToken.host, messagesUri.DEFAULT_USER, conversationId),
        cookies: apiContext.cookies,
        body: JSON.stringify(query),
        headers: {
            RegistrationToken: apiContext.registrationToken.raw,
        },
    };
    const res = await io.post(requestOptions);
    if (res.statusCode !== 201) {
        return Promise.reject(new incident_1.Incident("send-message", "Received wrong return code"));
    }
    const parsed = messagesUri.parseMessage(res.headers["location"]);
    const body = JSON.parse(res.body);
    return {
        clientMessageId: query.clientmessageid,
        arrivalTime: body.OriginalArrivalTime,
        textContent: query.content,
        MessageId: parsed.message,
    };
}
exports.sendImage = sendImage;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QyxPQUFPO1FBQzFCLFNBQVMsRUFBRSxNQUFNLENBQUMsT0FBTztLQUMxQixDQUFDO0FBQ0osQ0FBQztBQWhGRCw4QkFnRkMiLCJmaWxlIjoiYXBpL3NlbmQtaW1hZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBmcyBmcm9tIFwiYXN5bmMtZmlsZVwiO1xuaW1wb3J0IHsgSW5jaWRlbnQgfSBmcm9tIFwiaW5jaWRlbnRcIjtcbmltcG9ydCAqIGFzIGFwaSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9hcGkvYXBpXCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL2NvbnRleHRcIjtcbmltcG9ydCAqIGFzIGlvIGZyb20gXCIuLi9pbnRlcmZhY2VzL2h0dHAtaW9cIjtcbmltcG9ydCAqIGFzIG1lc3NhZ2VzVXJpIGZyb20gXCIuLi9tZXNzYWdlcy11cmlcIjtcbmltcG9ydCB7IGdldEN1cnJlbnRUaW1lIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmludGVyZmFjZSBTZW5kTWVzc2FnZVJlc3BvbnNlIHtcbiAgT3JpZ2luYWxBcnJpdmFsVGltZTogbnVtYmVyO1xufVxuXG5pbnRlcmZhY2UgU2VuZE1lc3NhZ2VRdWVyeSB7XG4gIGNsaWVudG1lc3NhZ2VpZDogc3RyaW5nO1xuICBjb250ZW50OiBzdHJpbmc7XG4gIG1lc3NhZ2V0eXBlOiBzdHJpbmc7XG4gIGNvbnRlbnR0eXBlOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kSW1hZ2UoXG4gIGlvOiBpby5IdHRwSW8sIGFwaUNvbnRleHQ6IENvbnRleHQsXG4gIGltZzogYXBpLk5ld0ltYWdlLFxuICBjb252ZXJzYXRpb25JZDogc3RyaW5nLFxuKTogUHJvbWlzZTxhcGkuU2VuZE1lc3NhZ2VSZXN1bHQ+IHtcbiAgY29uc3QgYm9keU5ld09iamVjdDogYW55ID0ge1xuICAgIHR5cGU6IFwicGlzaC9pbWFnZVwiLFxuICAgIHBlcm1pc3Npb25zOiB7W2NvbnZlcnNhdGlvbklkXTogW1wicmVhZFwiXX0sXG4gIH07XG4gIGNvbnN0IGJvZHlOZXdPYmplY3RTdHI6IHN0cmluZyA9IEpTT04uc3RyaW5naWZ5KGJvZHlOZXdPYmplY3QpO1xuICBjb25zdCByZXF1ZXN0T3B0aW9uc05ld09iamVjdDogaW8uUG9zdE9wdGlvbnMgPSB7XG4gICAgdXJpOiBtZXNzYWdlc1VyaS5vYmplY3RzKFwiYXBpLmFzbS5za3lwZS5jb21cIiksXG4gICAgY29va2llczogYXBpQ29udGV4dC5jb29raWVzLFxuICAgIGJvZHk6IGJvZHlOZXdPYmplY3RTdHIsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJBdXRob3JpemF0aW9uXCI6IGBza3lwZV90b2tlbiAke2FwaUNvbnRleHQuc2t5cGVUb2tlbi52YWx1ZX1gLFxuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICBcIkNvbnRlbnQtTGVuZ3RoXCI6IGJvZHlOZXdPYmplY3RTdHIubGVuZ3RoLnRvU3RyaW5nKDEwKSxcbiAgICB9LFxuICB9O1xuICBjb25zdCByZXNOZXdPYmplY3Q6IGlvLlJlc3BvbnNlID0gYXdhaXQgaW8ucG9zdChyZXF1ZXN0T3B0aW9uc05ld09iamVjdCk7XG5cbiAgaWYgKHJlc05ld09iamVjdC5zdGF0dXNDb2RlICE9PSAyMDEpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEluY2lkZW50KFwic2VuZC1pbWFnZVwiLCBcIlJlY2VpdmVkIHdyb25nIHJldHVybiBjb2RlXCIpKTtcbiAgfVxuICBjb25zdCBvYmplY3RJZDogc3RyaW5nID0gSlNPTi5wYXJzZShyZXNOZXdPYmplY3QuYm9keSkuaWQ7XG5cbiAgY29uc3QgZmlsZTogQnVmZmVyID0gYXdhaXQgZnMucmVhZEZpbGUoaW1nLmZpbGUpO1xuICBjb25zdCByZXF1ZXN0T3B0aW9uc1B1dE9iamVjdDogaW8uUHV0T3B0aW9ucyA9IHtcbiAgICB1cmk6IG1lc3NhZ2VzVXJpLm9iamVjdENvbnRlbnQoXCJhcGkuYXNtLnNreXBlLmNvbVwiLCBvYmplY3RJZCwgXCJpbWdwc2hcIiksXG4gICAgY29va2llczogYXBpQ29udGV4dC5jb29raWVzLFxuICAgIGJvZHk6IGZpbGUsXG4gICAgaGVhZGVyczoge1xuICAgICAgXCJBdXRob3JpemF0aW9uXCI6IGBza3lwZV90b2tlbiAke2FwaUNvbnRleHQuc2t5cGVUb2tlbi52YWx1ZX1gLFxuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCIsXG4gICAgICBcIkNvbnRlbnQtTGVuZ3RoXCI6IGZpbGUuYnl0ZUxlbmd0aC50b1N0cmluZygxMCksXG4gICAgfSxcbiAgfTtcbiAgY29uc3QgcmVzT2JqZWN0OiBpby5SZXNwb25zZSA9IGF3YWl0IGlvLnB1dChyZXF1ZXN0T3B0aW9uc1B1dE9iamVjdCk7XG5cbiAgaWYgKHJlc09iamVjdC5zdGF0dXNDb2RlICE9PSAyMDEpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEluY2lkZW50KFwic2VuZC1pbWFnZVwiLCBcIlJlY2VpdmVkIHdyb25nIHJldHVybiBjb2RlXCIpKTtcbiAgfVxuXG4gIGNvbnN0IHBpY3R1cmVVcmk6IHN0cmluZyA9IG1lc3NhZ2VzVXJpLm9iamVjdChcImFwaS5hc20uc2t5cGUuY29tXCIsIG9iamVjdElkKTtcbiAgY29uc3QgcGljdHVyZVRodW1ibmFpbFVyaTogc3RyaW5nID0gbWVzc2FnZXNVcmkub2JqZWN0VmlldyhcImFwaS5hc20uc2t5cGUuY29tXCIsIG9iamVjdElkLCBcImltZ3QxXCIpO1xuXG4gIGNvbnN0IHF1ZXJ5OiBTZW5kTWVzc2FnZVF1ZXJ5ID0ge1xuICAgIGNsaWVudG1lc3NhZ2VpZDogU3RyaW5nKGdldEN1cnJlbnRUaW1lKCkgKyBNYXRoLmZsb29yKDEwMDAwICogTWF0aC5yYW5kb20oKSkpLFxuICAgIGNvbnRlbnQ6IGBcbiAgICAgIDxVUklPYmplY3QgdHlwZT1cIlBpY3R1cmUuMVwiIHVyaT1cIiR7cGljdHVyZVVyaX1cIiB1cmxfdGh1bWJuYWlsPVwiJHtwaWN0dXJlVGh1bWJuYWlsVXJpfVwiPlxuICAgICAgICBsb2FkaW5nLi4uXG4gICAgICAgIDxPcmlnaW5hbE5hbWUgdj1cIiR7aW1nLm5hbWV9XCIvPlxuICAgICAgICA8bWV0YSB0eXBlPVwicGhvdG9cIiBvcmlnaW5hbE5hbWU9XCIke2ltZy5uYW1lfVwiLz5cbiAgICAgIDwvVVJJT2JqZWN0PlxuICAgIGAsXG4gICAgbWVzc2FnZXR5cGU6IFwiUmljaFRleHQvVXJpT2JqZWN0XCIsXG4gICAgY29udGVudHR5cGU6IFwidGV4dFwiLFxuICB9O1xuICBjb25zdCByZXF1ZXN0T3B0aW9uczogaW8uUG9zdE9wdGlvbnMgPSB7XG4gICAgdXJpOiBtZXNzYWdlc1VyaS5tZXNzYWdlcyhhcGlDb250ZXh0LnJlZ2lzdHJhdGlvblRva2VuLmhvc3QsIG1lc3NhZ2VzVXJpLkRFRkFVTFRfVVNFUiwgY29udmVyc2F0aW9uSWQpLFxuICAgIGNvb2tpZXM6IGFwaUNvbnRleHQuY29va2llcyxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShxdWVyeSksXG4gICAgaGVhZGVyczoge1xuICAgICAgUmVnaXN0cmF0aW9uVG9rZW46IGFwaUNvbnRleHQucmVnaXN0cmF0aW9uVG9rZW4ucmF3LFxuICAgIH0sXG4gIH07XG4gIGNvbnN0IHJlczogaW8uUmVzcG9uc2UgPSBhd2FpdCBpby5wb3N0KHJlcXVlc3RPcHRpb25zKTtcblxuICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwMSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgSW5jaWRlbnQoXCJzZW5kLW1lc3NhZ2VcIiwgXCJSZWNlaXZlZCB3cm9uZyByZXR1cm4gY29kZVwiKSk7XG4gIH1cbiAgY29uc3QgcGFyc2VkOiBtZXNzYWdlc1VyaS5NZXNzYWdlVXJpID0gbWVzc2FnZXNVcmkucGFyc2VNZXNzYWdlKHJlcy5oZWFkZXJzW1wibG9jYXRpb25cIl0pO1xuICBjb25zdCBib2R5OiBTZW5kTWVzc2FnZVJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXMuYm9keSk7XG4gIHJldHVybiB7XG4gICAgY2xpZW50TWVzc2FnZUlkOiBxdWVyeS5jbGllbnRtZXNzYWdlaWQsXG4gICAgYXJyaXZhbFRpbWU6IGJvZHkuT3JpZ2luYWxBcnJpdmFsVGltZSxcbiAgICB0ZXh0Q29udGVudDogcXVlcnkuY29udGVudCxcbiAgICBNZXNzYWdlSWQ6IHBhcnNlZC5tZXNzYWdlLFxuICB9O1xufVxuIl0sInNvdXJjZVJvb3QiOiIuLiJ9
