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
const tough_cookie_1 = __importDefault(require("tough-cookie"));
const get_self_profile_1 = require("./api/get-self-profile");
const Consts = __importStar(require("./consts"));
const register_endpoint_1 = require("./helpers/register-endpoint");
const messagesUri = __importStar(require("./messages-uri"));
const microsoftAccount = __importStar(require("./providers/microsoft-account"));
/**
 * Builds an Api context trough a new authentication.
 * This involves the requests:
 * GET <loginUrl> to scrap the LoginKeys (pie & etm)
 * POST <loginUrl> to get the SkypeToken from the credentials and LoginKeys
 * GET <selfProfileUrl> to get the userId
 * POST <registrationUrl> to get RegistrationToken from the SkypeToken
 *   Eventually, follow a redirection to use the assigned host
 * POST <subscription> to gain access to resources with the RegistrationToken
 *
 * @param options
 * @returns A new API context with the tokens for the provided user
 */
async function login(options) {
    const cookies = new tough_cookie_1.default.MemoryCookieStore();
    const ioOptions = { io: options.io, cookies };
    const skypeToken = await microsoftAccount.login({
        credentials: {
            login: options.credentials.username,
            password: options.credentials.password,
        },
        httpIo: options.io,
        cookies,
    });
    if (options.verbose) {
        console.log("Acquired SkypeToken");
    }
    const profile = await get_self_profile_1.getSelfProfile(options.io, cookies, skypeToken);
    const username = profile.username;
    if (options.verbose) {
        console.log("Acquired username");
    }
    const registrationToken = await register_endpoint_1.registerEndpoint(ioOptions.io, ioOptions.cookies, skypeToken, Consts.SKYPEWEB_DEFAULT_MESSAGES_HOST);
    if (options.verbose) {
        console.log("Acquired RegistrationToken");
    }
    await subscribeToResources(ioOptions, registrationToken);
    if (options.verbose) {
        console.log("Subscribed to resources");
    }
    await createPresenceDocs(ioOptions, registrationToken);
    if (options.verbose) {
        console.log("Created presence docs");
    }
    return {
        username,
        skypeToken,
        cookies,
        registrationToken,
    };
}
exports.login = login;
async function subscribeToResources(ioOptions, registrationToken) {
    // TODO(demurgos): typedef
    // tslint:disable-next-line:typedef
    const requestDocument = {
        interestedResources: [
            "/v1/threads/ALL",
            "/v1/users/ME/contacts/ALL",
            "/v1/users/ME/conversations/ALL/messages",
            "/v1/users/ME/conversations/ALL/properties",
        ],
        template: "raw",
        channelType: "httpLongPoll",
    };
    const requestOptions = {
        uri: messagesUri.subscriptions(registrationToken.host),
        cookies: ioOptions.cookies,
        body: JSON.stringify(requestDocument),
        headers: {
            RegistrationToken: registrationToken.raw,
        },
    };
    const res = await ioOptions.io.post(requestOptions);
    if (res.statusCode !== 201) {
        return Promise.reject(new incident_1.Incident("net", `Unable to subscribe to resources: statusCode: ${res.statusCode} body: ${res.body}`));
    }
    // Example response:
    // {
    //   "statusCode": 201,
    //   "body": "{}",
    //   "headers": {
    //     "cache-control": "no-store, must-revalidate, no-cache",
    //       "pragma": "no-cache",
    //       "content-length": "2",
    //       "content-type": "application/json; charset=utf-8",
    //       "location": "https://db5-client-s.gateway.messenger.live.com/v1/users/ME/endpoints/SELF/subscriptions/0",
    //       "x-content-type-options": "nosniff",
    //       "contextid": "tcid=3434983151221922702,server=DB5SCH101121535",
    //       "date": "Sat, 14 May 2016 16:41:17 GMT",
    //       "connection": "close"
    //   }
    // }
}
async function createPresenceDocs(ioOptions, registrationToken) {
    // this is the exact json that is needed to register endpoint for setting of status.
    // demurgos: If I remember well enough, it's order dependant.
    // TODO: typedef
    // tslint:disable-next-line:typedef
    const requestBody = {
        id: "endpointMessagingService",
        type: "EndpointPresenceDoc",
        selfLink: "uri",
        privateInfo: {
            epname: "skype",
        },
        publicInfo: {
            capabilities: "video|audio",
            type: 1,
            skypeNameVersion: Consts.SKYPEWEB_CLIENTINFO_NAME,
            nodeInfo: "xx",
            version: `${Consts.SKYPEWEB_CLIENTINFO_VERSION}//${Consts.SKYPEWEB_CLIENTINFO_NAME}`,
        },
    };
    const uri = messagesUri.endpointMessagingService(registrationToken.host, messagesUri.DEFAULT_USER, registrationToken.endpointId);
    const requestOptions = {
        uri,
        cookies: ioOptions.cookies,
        body: JSON.stringify(requestBody),
        headers: {
            RegistrationToken: registrationToken.raw,
        },
    };
    const res = await ioOptions.io.put(requestOptions);
    if (res.statusCode !== 200) {
        return Promise.reject(new incident_1.Incident("net", "Unable to create presence endpoint"));
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,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Q0FBQyx3QkFBd0I7WUFDakQsUUFBUSxFQUFFLElBQUk7WUFDZCxPQUFPLEVBQUUsR0FBRyxNQUFNLENBQUMsMkJBQTJCLEtBQUssTUFBTSxDQUFDLHdCQUF3QixFQUFFO1NBQ3JGO0tBQ0YsQ0FBQztJQUVGLE1BQU0sR0FBRyxHQUFXLFdBQVcsQ0FBQyx3QkFBd0IsQ0FDdEQsaUJBQWlCLENBQUMsSUFBSSxFQUN0QixXQUFXLENBQUMsWUFBWSxFQUN4QixpQkFBaUIsQ0FBQyxVQUFVLENBQzdCLENBQUM7SUFFRixNQUFNLGNBQWMsR0FBa0I7UUFDcEMsR0FBRztRQUNILE9BQU8sRUFBRSxTQUFTLENBQUMsT0FBTztRQUMxQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUM7UUFDakMsT0FBTyxFQUFFO1lBQ1AsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsR0FBRztTQUN6QztLQUNGLENBQUM7SUFFRixNQUFNLEdBQUcsR0FBZ0IsTUFBTSxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUVoRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDM0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxtQkFBUSxDQUFDLEtBQUssRUFBRSxvQ0FBb0MsQ0FBQyxDQUFDLENBQUM7SUFDbkYsQ0FBQztBQUNILENBQUMiLCJmaWxlIjoibG9naW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmNpZGVudCB9IGZyb20gXCJpbmNpZGVudFwiO1xuaW1wb3J0IHRvdWdoQ29va2llIGZyb20gXCJ0b3VnaC1jb29raWVcIjtcbmltcG9ydCB7IGdldFNlbGZQcm9maWxlIH0gZnJvbSBcIi4vYXBpL2dldC1zZWxmLXByb2ZpbGVcIjtcbmltcG9ydCAqIGFzIENvbnN0cyBmcm9tIFwiLi9jb25zdHNcIjtcbmltcG9ydCB7IHJlZ2lzdGVyRW5kcG9pbnQgfSBmcm9tIFwiLi9oZWxwZXJzL3JlZ2lzdGVyLWVuZHBvaW50XCI7XG5pbXBvcnQgeyBDcmVkZW50aWFscyB9IGZyb20gXCIuL2ludGVyZmFjZXMvYXBpL2FwaVwiO1xuaW1wb3J0IHsgQ29udGV4dCBhcyBBcGlDb250ZXh0LCBSZWdpc3RyYXRpb25Ub2tlbiwgU2t5cGVUb2tlbiB9IGZyb20gXCIuL2ludGVyZmFjZXMvYXBpL2NvbnRleHRcIjtcbmltcG9ydCAqIGFzIGlvIGZyb20gXCIuL2ludGVyZmFjZXMvaHR0cC1pb1wiO1xuaW1wb3J0ICogYXMgbWVzc2FnZXNVcmkgZnJvbSBcIi4vbWVzc2FnZXMtdXJpXCI7XG5pbXBvcnQgKiBhcyBtaWNyb3NvZnRBY2NvdW50IGZyb20gXCIuL3Byb3ZpZGVycy9taWNyb3NvZnQtYWNjb3VudFwiO1xuaW1wb3J0IHsgQXBpUHJvZmlsZSB9IGZyb20gXCIuL3R5cGVzL2FwaS1wcm9maWxlXCI7XG5cbmludGVyZmFjZSBJb09wdGlvbnMge1xuICBpbzogaW8uSHR0cElvO1xuICBjb29raWVzOiB0b3VnaENvb2tpZS5TdG9yZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMb2dpbk9wdGlvbnMge1xuICBpbzogaW8uSHR0cElvO1xuICBjcmVkZW50aWFsczogQ3JlZGVudGlhbHM7XG4gIHZlcmJvc2U/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIEJ1aWxkcyBhbiBBcGkgY29udGV4dCB0cm91Z2ggYSBuZXcgYXV0aGVudGljYXRpb24uXG4gKiBUaGlzIGludm9sdmVzIHRoZSByZXF1ZXN0czpcbiAqIEdFVCA8bG9naW5Vcmw+IHRvIHNjcmFwIHRoZSBMb2dpbktleXMgKHBpZSAmIGV0bSlcbiAqIFBPU1QgPGxvZ2luVXJsPiB0byBnZXQgdGhlIFNreXBlVG9rZW4gZnJvbSB0aGUgY3JlZGVudGlhbHMgYW5kIExvZ2luS2V5c1xuICogR0VUIDxzZWxmUHJvZmlsZVVybD4gdG8gZ2V0IHRoZSB1c2VySWRcbiAqIFBPU1QgPHJlZ2lzdHJhdGlvblVybD4gdG8gZ2V0IFJlZ2lzdHJhdGlvblRva2VuIGZyb20gdGhlIFNreXBlVG9rZW5cbiAqICAgRXZlbnR1YWxseSwgZm9sbG93IGEgcmVkaXJlY3Rpb24gdG8gdXNlIHRoZSBhc3NpZ25lZCBob3N0XG4gKiBQT1NUIDxzdWJzY3JpcHRpb24+IHRvIGdhaW4gYWNjZXNzIHRvIHJlc291cmNlcyB3aXRoIHRoZSBSZWdpc3RyYXRpb25Ub2tlblxuICpcbiAqIEBwYXJhbSBvcHRpb25zXG4gKiBAcmV0dXJucyBBIG5ldyBBUEkgY29udGV4dCB3aXRoIHRoZSB0b2tlbnMgZm9yIHRoZSBwcm92aWRlZCB1c2VyXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbihvcHRpb25zOiBMb2dpbk9wdGlvbnMpOiBQcm9taXNlPEFwaUNvbnRleHQ+IHtcbiAgY29uc3QgY29va2llczogdG91Z2hDb29raWUuTWVtb3J5Q29va2llU3RvcmUgPSBuZXcgdG91Z2hDb29raWUuTWVtb3J5Q29va2llU3RvcmUoKTtcbiAgY29uc3QgaW9PcHRpb25zOiBJb09wdGlvbnMgPSB7aW86IG9wdGlvbnMuaW8sIGNvb2tpZXN9O1xuXG4gIGNvbnN0IHNreXBlVG9rZW46IFNreXBlVG9rZW4gPSBhd2FpdCBtaWNyb3NvZnRBY2NvdW50LmxvZ2luKHtcbiAgICBjcmVkZW50aWFsczoge1xuICAgICAgbG9naW46IG9wdGlvbnMuY3JlZGVudGlhbHMudXNlcm5hbWUsXG4gICAgICBwYXNzd29yZDogb3B0aW9ucy5jcmVkZW50aWFscy5wYXNzd29yZCxcbiAgICB9LFxuICAgIGh0dHBJbzogb3B0aW9ucy5pbyxcbiAgICBjb29raWVzLFxuICB9KTtcbiAgaWYgKG9wdGlvbnMudmVyYm9zZSkge1xuICAgIGNvbnNvbGUubG9nKFwiQWNxdWlyZWQgU2t5cGVUb2tlblwiKTtcbiAgfVxuXG4gIGNvbnN0IHByb2ZpbGU6IEFwaVByb2ZpbGUgPSBhd2FpdCBnZXRTZWxmUHJvZmlsZShvcHRpb25zLmlvLCBjb29raWVzLCBza3lwZVRva2VuKTtcbiAgY29uc3QgdXNlcm5hbWU6IHN0cmluZyA9IHByb2ZpbGUudXNlcm5hbWU7XG5cbiAgaWYgKG9wdGlvbnMudmVyYm9zZSkge1xuICAgIGNvbnNvbGUubG9nKFwiQWNxdWlyZWQgdXNlcm5hbWVcIik7XG4gIH1cblxuICBjb25zdCByZWdpc3RyYXRpb25Ub2tlbjogUmVnaXN0cmF0aW9uVG9rZW4gPSBhd2FpdCByZWdpc3RlckVuZHBvaW50KFxuICAgIGlvT3B0aW9ucy5pbyxcbiAgICBpb09wdGlvbnMuY29va2llcyxcbiAgICBza3lwZVRva2VuLFxuICAgIENvbnN0cy5TS1lQRVdFQl9ERUZBVUxUX01FU1NBR0VTX0hPU1QsXG4gICk7XG4gIGlmIChvcHRpb25zLnZlcmJvc2UpIHtcbiAgICBjb25zb2xlLmxvZyhcIkFjcXVpcmVkIFJlZ2lzdHJhdGlvblRva2VuXCIpO1xuICB9XG5cbiAgYXdhaXQgc3Vic2NyaWJlVG9SZXNvdXJjZXMoaW9PcHRpb25zLCByZWdpc3RyYXRpb25Ub2tlbik7XG4gIGlmIChvcHRpb25zLnZlcmJvc2UpIHtcbiAgICBjb25zb2xlLmxvZyhcIlN1YnNjcmliZWQgdG8gcmVzb3VyY2VzXCIpO1xuICB9XG5cbiAgYXdhaXQgY3JlYXRlUHJlc2VuY2VEb2NzKGlvT3B0aW9ucywgcmVnaXN0cmF0aW9uVG9rZW4pO1xuICBpZiAob3B0aW9ucy52ZXJib3NlKSB7XG4gICAgY29uc29sZS5sb2coXCJDcmVhdGVkIHByZXNlbmNlIGRvY3NcIik7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHVzZXJuYW1lLFxuICAgIHNreXBlVG9rZW4sXG4gICAgY29va2llcyxcbiAgICByZWdpc3RyYXRpb25Ub2tlbixcbiAgfTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gc3Vic2NyaWJlVG9SZXNvdXJjZXMoaW9PcHRpb25zOiBJb09wdGlvbnMsIHJlZ2lzdHJhdGlvblRva2VuOiBSZWdpc3RyYXRpb25Ub2tlbik6IFByb21pc2U8dm9pZD4ge1xuICAvLyBUT0RPKGRlbXVyZ29zKTogdHlwZWRlZlxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6dHlwZWRlZlxuICBjb25zdCByZXF1ZXN0RG9jdW1lbnQgPSB7XG4gICAgaW50ZXJlc3RlZFJlc291cmNlczogW1xuICAgICAgXCIvdjEvdGhyZWFkcy9BTExcIixcbiAgICAgIFwiL3YxL3VzZXJzL01FL2NvbnRhY3RzL0FMTFwiLFxuICAgICAgXCIvdjEvdXNlcnMvTUUvY29udmVyc2F0aW9ucy9BTEwvbWVzc2FnZXNcIixcbiAgICAgIFwiL3YxL3VzZXJzL01FL2NvbnZlcnNhdGlvbnMvQUxML3Byb3BlcnRpZXNcIixcbiAgICBdLFxuICAgIHRlbXBsYXRlOiBcInJhd1wiLFxuICAgIGNoYW5uZWxUeXBlOiBcImh0dHBMb25nUG9sbFwiLCAvLyBUT0RPOiB1c2Ugd2Vic29ja2V0cyA/XG4gIH07XG5cbiAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IGlvLlBvc3RPcHRpb25zID0ge1xuICAgIHVyaTogbWVzc2FnZXNVcmkuc3Vic2NyaXB0aW9ucyhyZWdpc3RyYXRpb25Ub2tlbi5ob3N0KSxcbiAgICBjb29raWVzOiBpb09wdGlvbnMuY29va2llcyxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShyZXF1ZXN0RG9jdW1lbnQpLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFJlZ2lzdHJhdGlvblRva2VuOiByZWdpc3RyYXRpb25Ub2tlbi5yYXcsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCByZXM6IGlvLlJlc3BvbnNlID0gYXdhaXQgaW9PcHRpb25zLmlvLnBvc3QocmVxdWVzdE9wdGlvbnMpO1xuICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwMSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgSW5jaWRlbnQoXCJuZXRcIixcbiAgICAgIGBVbmFibGUgdG8gc3Vic2NyaWJlIHRvIHJlc291cmNlczogc3RhdHVzQ29kZTogJHtyZXMuc3RhdHVzQ29kZX0gYm9keTogJHtyZXMuYm9keX1gKSk7XG4gIH1cblxuICAvLyBFeGFtcGxlIHJlc3BvbnNlOlxuICAvLyB7XG4gIC8vICAgXCJzdGF0dXNDb2RlXCI6IDIwMSxcbiAgLy8gICBcImJvZHlcIjogXCJ7fVwiLFxuICAvLyAgIFwiaGVhZGVyc1wiOiB7XG4gIC8vICAgICBcImNhY2hlLWNvbnRyb2xcIjogXCJuby1zdG9yZSwgbXVzdC1yZXZhbGlkYXRlLCBuby1jYWNoZVwiLFxuICAvLyAgICAgICBcInByYWdtYVwiOiBcIm5vLWNhY2hlXCIsXG4gIC8vICAgICAgIFwiY29udGVudC1sZW5ndGhcIjogXCIyXCIsXG4gIC8vICAgICAgIFwiY29udGVudC10eXBlXCI6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAvLyAgICAgICBcImxvY2F0aW9uXCI6IFwiaHR0cHM6Ly9kYjUtY2xpZW50LXMuZ2F0ZXdheS5tZXNzZW5nZXIubGl2ZS5jb20vdjEvdXNlcnMvTUUvZW5kcG9pbnRzL1NFTEYvc3Vic2NyaXB0aW9ucy8wXCIsXG4gIC8vICAgICAgIFwieC1jb250ZW50LXR5cGUtb3B0aW9uc1wiOiBcIm5vc25pZmZcIixcbiAgLy8gICAgICAgXCJjb250ZXh0aWRcIjogXCJ0Y2lkPTM0MzQ5ODMxNTEyMjE5MjI3MDIsc2VydmVyPURCNVNDSDEwMTEyMTUzNVwiLFxuICAvLyAgICAgICBcImRhdGVcIjogXCJTYXQsIDE0IE1heSAyMDE2IDE2OjQxOjE3IEdNVFwiLFxuICAvLyAgICAgICBcImNvbm5lY3Rpb25cIjogXCJjbG9zZVwiXG4gIC8vICAgfVxuICAvLyB9XG5cbn1cblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlUHJlc2VuY2VEb2NzKGlvT3B0aW9uczogSW9PcHRpb25zLCByZWdpc3RyYXRpb25Ub2tlbjogUmVnaXN0cmF0aW9uVG9rZW4pOiBQcm9taXNlPGFueT4ge1xuICAvLyB0aGlzIGlzIHRoZSBleGFjdCBqc29uIHRoYXQgaXMgbmVlZGVkIHRvIHJlZ2lzdGVyIGVuZHBvaW50IGZvciBzZXR0aW5nIG9mIHN0YXR1cy5cbiAgLy8gZGVtdXJnb3M6IElmIEkgcmVtZW1iZXIgd2VsbCBlbm91Z2gsIGl0J3Mgb3JkZXIgZGVwZW5kYW50LlxuICAvLyBUT0RPOiB0eXBlZGVmXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp0eXBlZGVmXG4gIGNvbnN0IHJlcXVlc3RCb2R5ID0ge1xuICAgIGlkOiBcImVuZHBvaW50TWVzc2FnaW5nU2VydmljZVwiLFxuICAgIHR5cGU6IFwiRW5kcG9pbnRQcmVzZW5jZURvY1wiLFxuICAgIHNlbGZMaW5rOiBcInVyaVwiLFxuICAgIHByaXZhdGVJbmZvOiB7XG4gICAgICBlcG5hbWU6IFwic2t5cGVcIiwgLy8gTmFtZSBvZiB0aGUgZW5kcG9pbnQgKG5vcm1hbGx5IHRoZSBuYW1lIG9mIHRoZSBob3N0KVxuICAgIH0sXG4gICAgcHVibGljSW5mbzoge1xuICAgICAgY2FwYWJpbGl0aWVzOiBcInZpZGVvfGF1ZGlvXCIsXG4gICAgICB0eXBlOiAxLFxuICAgICAgc2t5cGVOYW1lVmVyc2lvbjogQ29uc3RzLlNLWVBFV0VCX0NMSUVOVElORk9fTkFNRSxcbiAgICAgIG5vZGVJbmZvOiBcInh4XCIsXG4gICAgICB2ZXJzaW9uOiBgJHtDb25zdHMuU0tZUEVXRUJfQ0xJRU5USU5GT19WRVJTSU9OfS8vJHtDb25zdHMuU0tZUEVXRUJfQ0xJRU5USU5GT19OQU1FfWAsXG4gICAgfSxcbiAgfTtcblxuICBjb25zdCB1cmk6IHN0cmluZyA9IG1lc3NhZ2VzVXJpLmVuZHBvaW50TWVzc2FnaW5nU2VydmljZShcbiAgICByZWdpc3RyYXRpb25Ub2tlbi5ob3N0LFxuICAgIG1lc3NhZ2VzVXJpLkRFRkFVTFRfVVNFUixcbiAgICByZWdpc3RyYXRpb25Ub2tlbi5lbmRwb2ludElkLFxuICApO1xuXG4gIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBpby5QdXRPcHRpb25zID0ge1xuICAgIHVyaSxcbiAgICBjb29raWVzOiBpb09wdGlvbnMuY29va2llcyxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShyZXF1ZXN0Qm9keSksXG4gICAgaGVhZGVyczoge1xuICAgICAgUmVnaXN0cmF0aW9uVG9rZW46IHJlZ2lzdHJhdGlvblRva2VuLnJhdyxcbiAgICB9LFxuICB9O1xuXG4gIGNvbnN0IHJlczogaW8uUmVzcG9uc2UgPSBhd2FpdCBpb09wdGlvbnMuaW8ucHV0KHJlcXVlc3RPcHRpb25zKTtcblxuICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgSW5jaWRlbnQoXCJuZXRcIiwgXCJVbmFibGUgdG8gY3JlYXRlIHByZXNlbmNlIGVuZHBvaW50XCIpKTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==
