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
const url_1 = __importDefault(require("url"));
const Consts = __importStar(require("../consts"));
const endpoint_registration_1 = require("../errors/endpoint-registration");
const http_1 = require("../errors/http");
const index_1 = require("../errors/index");
const messagesUri = __importStar(require("../messages-uri"));
const utils = __importStar(require("../utils"));
const hmac_sha256_1 = require("../utils/hmac-sha256");
function getLockAndKeyResponse(time) {
    const inputBuffer = Buffer.from(String(time), "utf8");
    const appIdBuffer = Buffer.from(Consts.SKYPEWEB_LOCKANDKEY_APPID, "utf8");
    const secretBuffer = Buffer.from(Consts.SKYPEWEB_LOCKANDKEY_SECRET, "utf8");
    return hmac_sha256_1.hmacSha256(inputBuffer, appIdBuffer, secretBuffer);
}
/**
 * Value used for the `ClientInfo` header of the request for the registration token.
 */
const CLIENT_INFO_HEADER = utils.stringifyHeaderParams({
    os: "Windows",
    osVer: "10",
    proc: "Win64",
    lcid: "en-us",
    deviceType: "1",
    country: "n/a",
    clientName: Consts.SKYPEWEB_CLIENTINFO_NAME,
    clientVer: Consts.SKYPEWEB_CLIENTINFO_VERSION,
});
/**
 * Get the value for the `LockAndKey` header of the request for the registration token.
 *
 * @param time Seconds since UNIX epoch
 */
function getLockAndKeyHeader(time) {
    const lockAndKeyResponse = getLockAndKeyResponse(time);
    return utils.stringifyHeaderParams({
        appId: Consts.SKYPEWEB_LOCKANDKEY_APPID,
        time: String(time),
        lockAndKeyResponse,
    });
}
/**
 * Get the registration token used to subscribe to resources.
 *
 * @param io Cookies and HTTP library to use.
 * @param cookies Cookie jar to use.
 * @param skypeToken The Skype to use for authentication.
 * @param messagesHostname Hostname of the messages server.
 * @param retries Number of request retries before emitting an error. Example: if `retries` is `1`, this function
 *                will send 1 or 2 requests.
 * @return Registration token
 * @throws [[EndpointRegistrationError]]
 */
async function registerEndpoint(io, cookies, skypeToken, messagesHostname, retries = 2) {
    // TODO: Use this array to report all the requests and responses in case of failure
    const tries = [];
    // Use non-strict equality to try at least once. `tryCount` counts the number of failures.
    for (let tryCount = 0; tryCount <= retries; tryCount++) {
        const req = {
            uri: messagesUri.endpoints(messagesHostname),
            headers: {
                LockAndKey: getLockAndKeyHeader(utils.getCurrentTime()),
                // TODO(demurgos, 2017-11-12): Remove the `ClientHeader` header, SkPy does not send it.
                ClientInfo: CLIENT_INFO_HEADER,
                Authentication: utils.stringifyHeaderParams({ skypetoken: skypeToken.value }),
                // See: https://github.com/OllieTerrance/SkPy/issues/54#issuecomment-295746871
                BehaviorOverride: "redirectAs404",
            },
            cookies,
            // See: https://github.com/OllieTerrance/SkPy/blob/7b6be6e41238058b9ab644d908621456764fb6d6/skpy/conn.py#L717
            body: JSON.stringify({ endpointFeatures: "Agent" }),
        };
        const res = await io.post(req);
        tries.push({ req, res });
        if (res.statusCode === 429) {
            // Expected res.body: `'{"errorCode":803,"message":"Login Rate limit exceeded"}'`
            throw new endpoint_registration_1.EndpointRegistrationError(index_1.LoginRateLimitExceeded.create(req, res), tries);
        }
        // TODO: Check eventual changes in the API. I'm not sure if 301 is still used
        // 404 was seen the 2017-01-14, with the following body:
        // '{"errorCode":752,"message":"User is in a different cloud. See \'Location\' header for users current cloud."}'
        const expectedStatusCode = new Set([201, 301, 404]);
        if (!expectedStatusCode.has(res.statusCode)) {
            throw new endpoint_registration_1.EndpointRegistrationError(http_1.UnexpectedHttpStatusError.create(res, expectedStatusCode, req), tries);
        }
        const locationHeader = res.headers["location"];
        if (locationHeader === undefined) {
            throw new endpoint_registration_1.EndpointRegistrationError(http_1.MissingHeaderError.create(res, "Location", req), tries);
        }
        // TODO: parse in messages-uri.ts
        const location = url_1.default.parse(locationHeader);
        if (location.host === undefined) {
            throw new incident_1.Incident("ParseError", { res }, "Expected `Location` header to have host");
        }
        // Handle redirections, up to `retry` times
        // Redirections happen mostly when 301, but sometimes when 201
        // TODO: It may have changed to mostly 404.
        if (location.host !== messagesHostname) {
            messagesHostname = location.host;
            continue;
        }
        // registrationTokenHeader is like "registrationToken=someString; expires=someNumber; endpointId={someString}"
        const registrationTokenHeader = res.headers["set-registrationtoken"];
        if (registrationTokenHeader === undefined) {
            throw new endpoint_registration_1.EndpointRegistrationError(http_1.MissingHeaderError.create(res, "Set-Registrationtoken", req), tries);
        }
        return readSetRegistrationTokenHeader(messagesHostname, registrationTokenHeader);
    }
    throw new endpoint_registration_1.EndpointRegistrationError(index_1.RedirectionLimit.create(retries), tries);
}
exports.registerEndpoint = registerEndpoint;
/**
 * Parse the `Set-Registrationtoken` header of an endpoint registration response.
 *
 * This header has the following shape: "registrationToken=someString; expires=someNumber; endpointId={someString}"
 *
 * @param hostname Name of the hostname for this registration token.
 * @param header String value of the `Set-Registration` header.
 * @return Parsed registration token
 */
function readSetRegistrationTokenHeader(hostname, header) {
    const parsedHeader = utils.parseHeaderParams(header);
    const expiresString = parsedHeader.get("expires");
    const registrationTokenValue = parsedHeader.get("registrationToken");
    const endpointId = parsedHeader.get("endpointId");
    if (registrationTokenValue === undefined || expiresString === undefined || endpointId === undefined) {
        throw new incident_1.Incident("InvalidSetRegistrationTokenHeader", { header, parsed: parsedHeader });
    }
    // Timestamp in seconds since UNIX epoch
    const expires = parseInt(expiresString, 10);
    return {
        value: registrationTokenValue,
        expirationDate: new Date(1000 * expires),
        endpointId,
        raw: header,
        host: hostname,
    };
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvaGVscGVycy9yZWdpc3Rlci1lbmRwb2ludC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBb0M7QUFFcEMsOENBQXNCO0FBQ3RCLGtEQUFvQztBQUNwQywyRUFBNEU7QUFDNUUseUNBQStFO0FBQy9FLDJDQUEyRTtBQUczRSw2REFBK0M7QUFDL0MsZ0RBQWtDO0FBQ2xDLHNEQUFrRDtBQUVsRCwrQkFBK0IsSUFBWTtJQUN6QyxNQUFNLFdBQVcsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUM5RCxNQUFNLFdBQVcsR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyx5QkFBeUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNsRixNQUFNLFlBQVksR0FBVyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwRixNQUFNLENBQUMsd0JBQVUsQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzVELENBQUM7QUFFRDs7R0FFRztBQUNILE1BQU0sa0JBQWtCLEdBQVcsS0FBSyxDQUFDLHFCQUFxQixDQUFDO0lBQzdELEVBQUUsRUFBRSxTQUFTO0lBQ2IsS0FBSyxFQUFFLElBQUk7SUFDWCxJQUFJLEVBQUUsT0FBTztJQUNiLElBQUksRUFBRSxPQUFPO0lBQ2IsVUFBVSxFQUFFLEdBQUc7SUFDZixPQUFPLEVBQUUsS0FBSztJQUNkLFVBQVUsRUFBRSxNQUFNLENBQUMsd0JBQXdCO0lBQzNDLFNBQVMsRUFBRSxNQUFNLENBQUMsMkJBQTJCO0NBQzlDLENBQUMsQ0FBQztBQUVIOzs7O0dBSUc7QUFDSCw2QkFBNkIsSUFBWTtJQUN2QyxNQUFNLGtCQUFrQixHQUFXLHFCQUFxQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9ELE1BQU0sQ0FBQyxLQUFLLENB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SUFBSSxhQUFhLEtBQUssU0FBUyxJQUFJLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3BHLE1BQU0sSUFBSSxtQkFBUSxDQUFDLG1DQUFtQyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUMsQ0FBQyxDQUFDO0lBQzFGLENBQUM7SUFFRCx3Q0FBd0M7SUFDeEMsTUFBTSxPQUFPLEdBQVcsUUFBUSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUVwRCxNQUFNLENBQUM7UUFDTCxLQUFLLEVBQUUsc0JBQXNCO1FBQzdCLGNBQWMsRUFBRSxJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ3hDLFVBQVU7UUFDVixHQUFHLEVBQUUsTUFBTTtRQUNYLElBQUksRUFBRSxRQUFRO0tBQ2YsQ0FBQztBQUNKLENBQUMiLCJmaWxlIjoiaGVscGVycy9yZWdpc3Rlci1lbmRwb2ludC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluY2lkZW50IH0gZnJvbSBcImluY2lkZW50XCI7XG5pbXBvcnQgdG91Z2hDb29raWUgZnJvbSBcInRvdWdoLWNvb2tpZVwiO1xuaW1wb3J0IHVybCBmcm9tIFwidXJsXCI7XG5pbXBvcnQgKiBhcyBDb25zdHMgZnJvbSBcIi4uL2NvbnN0c1wiO1xuaW1wb3J0IHsgRW5kcG9pbnRSZWdpc3RyYXRpb25FcnJvciB9IGZyb20gXCIuLi9lcnJvcnMvZW5kcG9pbnQtcmVnaXN0cmF0aW9uXCI7XG5pbXBvcnQgeyBNaXNzaW5nSGVhZGVyRXJyb3IsIFVuZXhwZWN0ZWRIdHRwU3RhdHVzRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL2h0dHBcIjtcbmltcG9ydCB7IExvZ2luUmF0ZUxpbWl0RXhjZWVkZWQsIFJlZGlyZWN0aW9uTGltaXQgfSBmcm9tIFwiLi4vZXJyb3JzL2luZGV4XCI7XG5pbXBvcnQgeyBSZWdpc3RyYXRpb25Ub2tlbiwgU2t5cGVUb2tlbiB9IGZyb20gXCIuLi9pbnRlcmZhY2VzL2FwaS9jb250ZXh0XCI7XG5pbXBvcnQgKiBhcyBpbyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9odHRwLWlvXCI7XG5pbXBvcnQgKiBhcyBtZXNzYWdlc1VyaSBmcm9tIFwiLi4vbWVzc2FnZXMtdXJpXCI7XG5pbXBvcnQgKiBhcyB1dGlscyBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCB7IGhtYWNTaGEyNTYgfSBmcm9tIFwiLi4vdXRpbHMvaG1hYy1zaGEyNTZcIjtcblxuZnVuY3Rpb24gZ2V0TG9ja0FuZEtleVJlc3BvbnNlKHRpbWU6IG51bWJlcik6IHN0cmluZyB7XG4gIGNvbnN0IGlucHV0QnVmZmVyOiBCdWZmZXIgPSBCdWZmZXIuZnJvbShTdHJpbmcodGltZSksIFwidXRmOFwiKTtcbiAgY29uc3QgYXBwSWRCdWZmZXI6IEJ1ZmZlciA9IEJ1ZmZlci5mcm9tKENvbnN0cy5TS1lQRVdFQl9MT0NLQU5ES0VZX0FQUElELCBcInV0ZjhcIik7XG4gIGNvbnN0IHNlY3JldEJ1ZmZlcjogQnVmZmVyID0gQnVmZmVyLmZyb20oQ29uc3RzLlNLWVBFV0VCX0xPQ0tBTkRLRVlfU0VDUkVULCBcInV0ZjhcIik7XG4gIHJldHVybiBobWFjU2hhMjU2KGlucHV0QnVmZmVyLCBhcHBJZEJ1ZmZlciwgc2VjcmV0QnVmZmVyKTtcbn1cblxuLyoqXG4gKiBWYWx1ZSB1c2VkIGZvciB0aGUgYENsaWVudEluZm9gIGhlYWRlciBvZiB0aGUgcmVxdWVzdCBmb3IgdGhlIHJlZ2lzdHJhdGlvbiB0b2tlbi5cbiAqL1xuY29uc3QgQ0xJRU5UX0lORk9fSEVBREVSOiBzdHJpbmcgPSB1dGlscy5zdHJpbmdpZnlIZWFkZXJQYXJhbXMoe1xuICBvczogXCJXaW5kb3dzXCIsXG4gIG9zVmVyOiBcIjEwXCIsXG4gIHByb2M6IFwiV2luNjRcIixcbiAgbGNpZDogXCJlbi11c1wiLFxuICBkZXZpY2VUeXBlOiBcIjFcIixcbiAgY291bnRyeTogXCJuL2FcIixcbiAgY2xpZW50TmFtZTogQ29uc3RzLlNLWVBFV0VCX0NMSUVOVElORk9fTkFNRSxcbiAgY2xpZW50VmVyOiBDb25zdHMuU0tZUEVXRUJfQ0xJRU5USU5GT19WRVJTSU9OLFxufSk7XG5cbi8qKlxuICogR2V0IHRoZSB2YWx1ZSBmb3IgdGhlIGBMb2NrQW5kS2V5YCBoZWFkZXIgb2YgdGhlIHJlcXVlc3QgZm9yIHRoZSByZWdpc3RyYXRpb24gdG9rZW4uXG4gKlxuICogQHBhcmFtIHRpbWUgU2Vjb25kcyBzaW5jZSBVTklYIGVwb2NoXG4gKi9cbmZ1bmN0aW9uIGdldExvY2tBbmRLZXlIZWFkZXIodGltZTogbnVtYmVyKTogc3RyaW5nIHtcbiAgY29uc3QgbG9ja0FuZEtleVJlc3BvbnNlOiBzdHJpbmcgPSBnZXRMb2NrQW5kS2V5UmVzcG9uc2UodGltZSk7XG4gIHJldHVybiB1dGlscy5zdHJpbmdpZnlIZWFkZXJQYXJhbXMoe1xuICAgIGFwcElkOiBDb25zdHMuU0tZUEVXRUJfTE9DS0FOREtFWV9BUFBJRCxcbiAgICB0aW1lOiBTdHJpbmcodGltZSksXG4gICAgbG9ja0FuZEtleVJlc3BvbnNlLFxuICB9KTtcbn1cblxuLyoqXG4gKiBHZXQgdGhlIHJlZ2lzdHJhdGlvbiB0b2tlbiB1c2VkIHRvIHN1YnNjcmliZSB0byByZXNvdXJjZXMuXG4gKlxuICogQHBhcmFtIGlvIENvb2tpZXMgYW5kIEhUVFAgbGlicmFyeSB0byB1c2UuXG4gKiBAcGFyYW0gY29va2llcyBDb29raWUgamFyIHRvIHVzZS5cbiAqIEBwYXJhbSBza3lwZVRva2VuIFRoZSBTa3lwZSB0byB1c2UgZm9yIGF1dGhlbnRpY2F0aW9uLlxuICogQHBhcmFtIG1lc3NhZ2VzSG9zdG5hbWUgSG9zdG5hbWUgb2YgdGhlIG1lc3NhZ2VzIHNlcnZlci5cbiAqIEBwYXJhbSByZXRyaWVzIE51bWJlciBvZiByZXF1ZXN0IHJldHJpZXMgYmVmb3JlIGVtaXR0aW5nIGFuIGVycm9yLiBFeGFtcGxlOiBpZiBgcmV0cmllc2AgaXMgYDFgLCB0aGlzIGZ1bmN0aW9uXG4gKiAgICAgICAgICAgICAgICB3aWxsIHNlbmQgMSBvciAyIHJlcXVlc3RzLlxuICogQHJldHVybiBSZWdpc3RyYXRpb24gdG9rZW5cbiAqIEB0aHJvd3MgW1tFbmRwb2ludFJlZ2lzdHJhdGlvbkVycm9yXV1cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHJlZ2lzdGVyRW5kcG9pbnQoXG4gIGlvOiBpby5IdHRwSW8sXG4gIGNvb2tpZXM6IHRvdWdoQ29va2llLlN0b3JlLFxuICBza3lwZVRva2VuOiBTa3lwZVRva2VuLFxuICBtZXNzYWdlc0hvc3RuYW1lOiBzdHJpbmcsXG4gIHJldHJpZXM6IG51bWJlciA9IDIsXG4pOiBQcm9taXNlPFJlZ2lzdHJhdGlvblRva2VuPiB7XG4gIC8vIFRPRE86IFVzZSB0aGlzIGFycmF5IHRvIHJlcG9ydCBhbGwgdGhlIHJlcXVlc3RzIGFuZCByZXNwb25zZXMgaW4gY2FzZSBvZiBmYWlsdXJlXG4gIGNvbnN0IHRyaWVzOiB7cmVxOiBpby5Qb3N0T3B0aW9uczsgcmVzOiBpby5SZXNwb25zZX1bXSA9IFtdO1xuXG4gIC8vIFVzZSBub24tc3RyaWN0IGVxdWFsaXR5IHRvIHRyeSBhdCBsZWFzdCBvbmNlLiBgdHJ5Q291bnRgIGNvdW50cyB0aGUgbnVtYmVyIG9mIGZhaWx1cmVzLlxuICBmb3IgKGxldCB0cnlDb3VudDogbnVtYmVyID0gMDsgdHJ5Q291bnQgPD0gcmV0cmllczsgdHJ5Q291bnQrKykge1xuICAgIGNvbnN0IHJlcTogaW8uUG9zdE9wdGlvbnMgPSB7XG4gICAgICB1cmk6IG1lc3NhZ2VzVXJpLmVuZHBvaW50cyhtZXNzYWdlc0hvc3RuYW1lKSxcbiAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgTG9ja0FuZEtleTogZ2V0TG9ja0FuZEtleUhlYWRlcih1dGlscy5nZXRDdXJyZW50VGltZSgpKSxcbiAgICAgICAgLy8gVE9ETyhkZW11cmdvcywgMjAxNy0xMS0xMik6IFJlbW92ZSB0aGUgYENsaWVudEhlYWRlcmAgaGVhZGVyLCBTa1B5IGRvZXMgbm90IHNlbmQgaXQuXG4gICAgICAgIENsaWVudEluZm86IENMSUVOVF9JTkZPX0hFQURFUixcbiAgICAgICAgQXV0aGVudGljYXRpb246IHV0aWxzLnN0cmluZ2lmeUhlYWRlclBhcmFtcyh7c2t5cGV0b2tlbjogc2t5cGVUb2tlbi52YWx1ZX0pLFxuICAgICAgICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9PbGxpZVRlcnJhbmNlL1NrUHkvaXNzdWVzLzU0I2lzc3VlY29tbWVudC0yOTU3NDY4NzFcbiAgICAgICAgQmVoYXZpb3JPdmVycmlkZTogXCJyZWRpcmVjdEFzNDA0XCIsXG4gICAgICB9LFxuICAgICAgY29va2llcyxcbiAgICAgIC8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL09sbGllVGVycmFuY2UvU2tQeS9ibG9iLzdiNmJlNmU0MTIzODA1OGI5YWI2NDRkOTA4NjIxNDU2NzY0ZmI2ZDYvc2tweS9jb25uLnB5I0w3MTdcbiAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtlbmRwb2ludEZlYXR1cmVzOiBcIkFnZW50XCJ9KSxcbiAgICB9O1xuXG4gICAgY29uc3QgcmVzOiBpby5SZXNwb25zZSA9IGF3YWl0IGlvLnBvc3QocmVxKTtcbiAgICB0cmllcy5wdXNoKHtyZXEsIHJlc30pO1xuXG4gICAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSA0MjkpIHtcbiAgICAgIC8vIEV4cGVjdGVkIHJlcy5ib2R5OiBgJ3tcImVycm9yQ29kZVwiOjgwMyxcIm1lc3NhZ2VcIjpcIkxvZ2luIFJhdGUgbGltaXQgZXhjZWVkZWRcIn0nYFxuICAgICAgdGhyb3cgbmV3IEVuZHBvaW50UmVnaXN0cmF0aW9uRXJyb3IoTG9naW5SYXRlTGltaXRFeGNlZWRlZC5jcmVhdGUocmVxLCByZXMpLCB0cmllcyk7XG4gICAgfVxuXG4gICAgLy8gVE9ETzogQ2hlY2sgZXZlbnR1YWwgY2hhbmdlcyBpbiB0aGUgQVBJLiBJJ20gbm90IHN1cmUgaWYgMzAxIGlzIHN0aWxsIHVzZWRcbiAgICAvLyA0MDQgd2FzIHNlZW4gdGhlIDIwMTctMDEtMTQsIHdpdGggdGhlIGZvbGxvd2luZyBib2R5OlxuICAgIC8vICd7XCJlcnJvckNvZGVcIjo3NTIsXCJtZXNzYWdlXCI6XCJVc2VyIGlzIGluIGEgZGlmZmVyZW50IGNsb3VkLiBTZWUgXFwnTG9jYXRpb25cXCcgaGVhZGVyIGZvciB1c2VycyBjdXJyZW50IGNsb3VkLlwifSdcbiAgICBjb25zdCBleHBlY3RlZFN0YXR1c0NvZGU6IFNldDxudW1iZXI+ID0gbmV3IFNldChbMjAxLCAzMDEsIDQwNF0pO1xuICAgIGlmICghZXhwZWN0ZWRTdGF0dXNDb2RlLmhhcyhyZXMuc3RhdHVzQ29kZSkpIHtcbiAgICAgIHRocm93IG5ldyBFbmRwb2ludFJlZ2lzdHJhdGlvbkVycm9yKFVuZXhwZWN0ZWRIdHRwU3RhdHVzRXJyb3IuY3JlYXRlKHJlcywgZXhwZWN0ZWRTdGF0dXNDb2RlLCByZXEpLCB0cmllcyk7XG4gICAgfVxuXG4gICAgY29uc3QgbG9jYXRpb25IZWFkZXI6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHJlcy5oZWFkZXJzW1wibG9jYXRpb25cIl07XG4gICAgaWYgKGxvY2F0aW9uSGVhZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFbmRwb2ludFJlZ2lzdHJhdGlvbkVycm9yKE1pc3NpbmdIZWFkZXJFcnJvci5jcmVhdGUocmVzLCBcIkxvY2F0aW9uXCIsIHJlcSksIHRyaWVzKTtcbiAgICB9XG5cbiAgICAvLyBUT0RPOiBwYXJzZSBpbiBtZXNzYWdlcy11cmkudHNcbiAgICBjb25zdCBsb2NhdGlvbjogdXJsLlVybCA9IHVybC5wYXJzZShsb2NhdGlvbkhlYWRlcik7XG4gICAgaWYgKGxvY2F0aW9uLmhvc3QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEluY2lkZW50KFwiUGFyc2VFcnJvclwiLCB7cmVzfSwgXCJFeHBlY3RlZCBgTG9jYXRpb25gIGhlYWRlciB0byBoYXZlIGhvc3RcIik7XG4gICAgfVxuICAgIC8vIEhhbmRsZSByZWRpcmVjdGlvbnMsIHVwIHRvIGByZXRyeWAgdGltZXNcbiAgICAvLyBSZWRpcmVjdGlvbnMgaGFwcGVuIG1vc3RseSB3aGVuIDMwMSwgYnV0IHNvbWV0aW1lcyB3aGVuIDIwMVxuICAgIC8vIFRPRE86IEl0IG1heSBoYXZlIGNoYW5nZWQgdG8gbW9zdGx5IDQwNC5cbiAgICBpZiAobG9jYXRpb24uaG9zdCAhPT0gbWVzc2FnZXNIb3N0bmFtZSkge1xuICAgICAgbWVzc2FnZXNIb3N0bmFtZSA9IGxvY2F0aW9uLmhvc3Q7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICAvLyByZWdpc3RyYXRpb25Ub2tlbkhlYWRlciBpcyBsaWtlIFwicmVnaXN0cmF0aW9uVG9rZW49c29tZVN0cmluZzsgZXhwaXJlcz1zb21lTnVtYmVyOyBlbmRwb2ludElkPXtzb21lU3RyaW5nfVwiXG4gICAgY29uc3QgcmVnaXN0cmF0aW9uVG9rZW5IZWFkZXI6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHJlcy5oZWFkZXJzW1wic2V0LXJlZ2lzdHJhdGlvbnRva2VuXCJdO1xuXG4gICAgaWYgKHJlZ2lzdHJhdGlvblRva2VuSGVhZGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFbmRwb2ludFJlZ2lzdHJhdGlvbkVycm9yKE1pc3NpbmdIZWFkZXJFcnJvci5jcmVhdGUocmVzLCBcIlNldC1SZWdpc3RyYXRpb250b2tlblwiLCByZXEpLCB0cmllcyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlYWRTZXRSZWdpc3RyYXRpb25Ub2tlbkhlYWRlcihtZXNzYWdlc0hvc3RuYW1lLCByZWdpc3RyYXRpb25Ub2tlbkhlYWRlcik7XG4gIH1cblxuICB0aHJvdyBuZXcgRW5kcG9pbnRSZWdpc3RyYXRpb25FcnJvcihSZWRpcmVjdGlvbkxpbWl0LmNyZWF0ZShyZXRyaWVzKSwgdHJpZXMpO1xufVxuXG4vKipcbiAqIFBhcnNlIHRoZSBgU2V0LVJlZ2lzdHJhdGlvbnRva2VuYCBoZWFkZXIgb2YgYW4gZW5kcG9pbnQgcmVnaXN0cmF0aW9uIHJlc3BvbnNlLlxuICpcbiAqIFRoaXMgaGVhZGVyIGhhcyB0aGUgZm9sbG93aW5nIHNoYXBlOiBcInJlZ2lzdHJhdGlvblRva2VuPXNvbWVTdHJpbmc7IGV4cGlyZXM9c29tZU51bWJlcjsgZW5kcG9pbnRJZD17c29tZVN0cmluZ31cIlxuICpcbiAqIEBwYXJhbSBob3N0bmFtZSBOYW1lIG9mIHRoZSBob3N0bmFtZSBmb3IgdGhpcyByZWdpc3RyYXRpb24gdG9rZW4uXG4gKiBAcGFyYW0gaGVhZGVyIFN0cmluZyB2YWx1ZSBvZiB0aGUgYFNldC1SZWdpc3RyYXRpb25gIGhlYWRlci5cbiAqIEByZXR1cm4gUGFyc2VkIHJlZ2lzdHJhdGlvbiB0b2tlblxuICovXG5mdW5jdGlvbiByZWFkU2V0UmVnaXN0cmF0aW9uVG9rZW5IZWFkZXIoaG9zdG5hbWU6IHN0cmluZywgaGVhZGVyOiBzdHJpbmcpOiBSZWdpc3RyYXRpb25Ub2tlbiB7XG4gIGNvbnN0IHBhcnNlZEhlYWRlcjogTWFwPHN0cmluZywgc3RyaW5nPiA9IHV0aWxzLnBhcnNlSGVhZGVyUGFyYW1zKGhlYWRlcik7XG4gIGNvbnN0IGV4cGlyZXNTdHJpbmc6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHBhcnNlZEhlYWRlci5nZXQoXCJleHBpcmVzXCIpO1xuICBjb25zdCByZWdpc3RyYXRpb25Ub2tlblZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSBwYXJzZWRIZWFkZXIuZ2V0KFwicmVnaXN0cmF0aW9uVG9rZW5cIik7XG4gIGNvbnN0IGVuZHBvaW50SWQ6IHN0cmluZyB8IHVuZGVmaW5lZCA9IHBhcnNlZEhlYWRlci5nZXQoXCJlbmRwb2ludElkXCIpO1xuXG4gIGlmIChyZWdpc3RyYXRpb25Ub2tlblZhbHVlID09PSB1bmRlZmluZWQgfHwgZXhwaXJlc1N0cmluZyA9PT0gdW5kZWZpbmVkIHx8IGVuZHBvaW50SWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBJbmNpZGVudChcIkludmFsaWRTZXRSZWdpc3RyYXRpb25Ub2tlbkhlYWRlclwiLCB7aGVhZGVyLCBwYXJzZWQ6IHBhcnNlZEhlYWRlcn0pO1xuICB9XG5cbiAgLy8gVGltZXN0YW1wIGluIHNlY29uZHMgc2luY2UgVU5JWCBlcG9jaFxuICBjb25zdCBleHBpcmVzOiBudW1iZXIgPSBwYXJzZUludChleHBpcmVzU3RyaW5nLCAxMCk7XG5cbiAgcmV0dXJuIHtcbiAgICB2YWx1ZTogcmVnaXN0cmF0aW9uVG9rZW5WYWx1ZSxcbiAgICBleHBpcmF0aW9uRGF0ZTogbmV3IERhdGUoMTAwMCAqIGV4cGlyZXMpLFxuICAgIGVuZHBvaW50SWQsXG4gICAgcmF3OiBoZWFkZXIsXG4gICAgaG9zdDogaG9zdG5hbWUsXG4gIH07XG59XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
