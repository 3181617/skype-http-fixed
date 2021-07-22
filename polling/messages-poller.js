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
const cheerio_1 = __importDefault(require("cheerio"));
const events_1 = __importDefault(require("events"));
const incident_1 = require("incident");
const http_1 = require("../errors/http");
const messagesUri = __importStar(require("../messages-uri"));
// Perform one request every 1000 ms
const POLLING_DELAY = 1000;
// Match a contact id:
// TODO: handle the "guest" prefix
const CONTACT_ID_PATTERN = /^(\d+):(.+)$/;
// TODO(demurgos): Looks like there is a problem with the return type
function parseContactId(contactId) {
    const match = CONTACT_ID_PATTERN.exec(contactId);
    if (match === null) {
        throw new incident_1.Incident("parse-error", "Unable to parse userId");
    }
    return {
        raw: contactId,
        prefix: parseInt(match[1], 10),
        username: match[2],
    };
}
exports.parseContactId = parseContactId;
function formatRichTextResource(retObj, nativeResource) {
    const ret = retObj;
    ret.content = nativeResource.content;
    ret.clientId = nativeResource.clientmessageid;
    return ret;
}
exports.formatRichTextResource = formatRichTextResource;
function formatTextResource(retObj, nativeResource) {
    const ret = retObj;
    ret.content = nativeResource.content;
    ret.clientId = nativeResource.clientmessageid;
    return ret;
}
exports.formatTextResource = formatTextResource;
function formatControlClearTypingResource(retObj, nativeResource) {
    return retObj;
}
exports.formatControlClearTypingResource = formatControlClearTypingResource;
// Export for testing
function formatGenericMessageResource(nativeResource, type) {
    const parsedConversationUri = messagesUri
        .parseConversation(nativeResource.conversationLink);
    const parsedContactUri = messagesUri.parseContact(nativeResource.from);
    const parsedContactId = parseContactId(parsedContactUri.contact);
    return {
        type,
        id: nativeResource.id,
        composeTime: new Date(nativeResource.composetime),
        arrivalTime: new Date(nativeResource.originalarrivaltime),
        from: parsedContactId,
        conversation: parsedConversationUri.conversation,
        native: nativeResource,
    };
}
exports.formatGenericMessageResource = formatGenericMessageResource;
// tslint:disable-next-line:max-line-length
function formatConversationUpdateResource(nativeResource) {
    const parsedConversationUri = messagesUri
        .parseConversation(nativeResource.lastMessage.conversationLink);
    const parsedContactUri = messagesUri.parseContact(nativeResource.lastMessage.from);
    const parsedContactId = parseContactId(parsedContactUri.contact);
    return {
        type: "ConversationUpdate",
        id: nativeResource.id,
        clientId: nativeResource.lastMessage.clientmessageid,
        composeTime: new Date(nativeResource.lastMessage.composetime),
        arrivalTime: new Date(nativeResource.lastMessage.originalarrivaltime),
        from: parsedContactId,
        conversation: parsedConversationUri.conversation,
        native: nativeResource,
        content: nativeResource.lastMessage.content,
    };
}
exports.formatConversationUpdateResource = formatConversationUpdateResource;
// tslint:disable-next-line:max-line-length
function formatControlTypingResource(retObj, nativeResource) {
    const ret = retObj;
    return ret;
}
exports.formatControlTypingResource = formatControlTypingResource;
// tslint:disable-next-line:max-line-length
function formatSignalFlamingoResource(retObj, nativeResource) {
    const ret = retObj;
    ret.skypeguid = nativeResource.skypeguid;
    return ret;
}
exports.formatSignalFlamingoResource = formatSignalFlamingoResource;
function formatMessageResource(nativeResource) {
    switch (nativeResource.messagetype) {
        case "RichText/UriObject":
            // tslint:disable-next-line:max-line-length
            return formatUriObjectResource(formatFileResource(formatGenericMessageResource(nativeResource, nativeResource.messagetype), nativeResource), nativeResource);
        case "RichText/Media_Video":
            // tslint:disable-next-line:max-line-length
            return formatMediaVideoResource(formatFileResource(formatGenericMessageResource(nativeResource, nativeResource.messagetype), nativeResource), nativeResource);
        case "RichText/Media_GenericFile":
            // tslint:disable-next-line:max-line-length
            return formatMediaGenericFileResource(formatFileResource(formatGenericMessageResource(nativeResource, nativeResource.messagetype), nativeResource), nativeResource);
        case "RichText/Location":
            // tslint:disable-next-line:max-line-length
            return formatLocationResource(formatGenericMessageResource(nativeResource, nativeResource.messagetype), nativeResource);
        case "Event/Call":
            // tslint:disable-next-line:max-line-length
            return formatEventCallResource(formatGenericMessageResource(nativeResource, nativeResource.messagetype), nativeResource);
        case "RichText":
            // tslint:disable-next-line:max-line-length
            return formatRichTextResource(formatGenericMessageResource(nativeResource, nativeResource.messagetype), nativeResource);
        case "Text":
            // tslint:disable-next-line:max-line-length
            return formatTextResource(formatGenericMessageResource(nativeResource, nativeResource.messagetype), nativeResource);
        case "Control/ClearTyping":
            // tslint:disable-next-line:max-line-length
            return formatControlClearTypingResource(formatGenericMessageResource(nativeResource, nativeResource.messagetype), nativeResource);
        case "Control/Typing":
            // tslint:disable-next-line:max-line-length
            return formatControlTypingResource(formatGenericMessageResource(nativeResource, nativeResource.messagetype), nativeResource);
        case "Signal/Flamingo":// incoming call request
            // tslint:disable-next-line:max-line-length
            return formatSignalFlamingoResource(formatGenericMessageResource(nativeResource, nativeResource.messagetype), nativeResource);
		case "ThreadActivity/DeleteMember":
		case "ThreadActivity/AddMember":
		case "ThreadActivity/TopicUpdate":
		case "ThreadActivity/JoiningEnabledUpdate":
			return nativeResource;	  			
        default:
			return nativeResource;
            // tslint:disable-next-line:max-line-length
            // throw new Error(`Unknown ressource.messageType (${JSON.stringify(nativeResource.messagetype)}) for resource:\n${JSON.stringify(nativeResource, null, "\t")}`);
    }
}
function formatFileResource(retObj, native) {
    const ret = retObj;
    const $ = cheerio_1.default.load(native.content);
    const obj = $("URIObject");
    ret.uri_type = obj.attr("type");
    ret.uri = obj.attr("uri");
    ret.uri_thumbnail = obj.attr("url_thumbnail");
    ret.uri_w_login = $(obj.find("a")).attr("href");
    const sizeString = $(obj.find("FileSize")).attr("v");
    if (sizeString !== undefined) {
        ret.file_size = parseInt(sizeString, 10);
    }
    ret.original_file_name = $(obj.find("OriginalName")).attr("v");
    return ret;
}
// tslint:disable-next-line:max-line-length
function formatMediaGenericFileResource(retObj, native) {
    const ret = retObj;
    return ret;
}
// tslint:disable-next-line:max-line-length
function formatMediaVideoResource(retObj, native) {
    const ret = retObj;
    return ret;
}
// tslint:disable-next-line:max-line-length
function formatUriObjectResource(retObj, native) {
    const ret = retObj;
    return ret;
}
// tslint:disable-next-line:max-line-length
function formatLocationResource(retObj, native) {
    const ret = retObj;
    const $ = cheerio_1.default.load(native.content);
    const obj = $("location");
    ret.latitude = parseInt(obj.attr("latitude"), 10);
    ret.longitude = parseInt(obj.attr("longitude"), 10);
    ret.altitude = parseInt(obj.attr("altitude"), 10);
    ret.speed = parseInt(obj.attr("speed"), 10);
    ret.course = parseInt(obj.attr("course"), 10);
    ret.address = obj.attr("address");
    ret.pointOfInterest = obj.attr("pointOfInterest");
    ret.map_url = $(obj.find("a")).attr("href");
    return ret;
}
// tslint:disable-next-line:max-line-length
function formatEventCallResource(retObj, native) {
    const ret = retObj;
    const $ = cheerio_1.default.load(native.content);
    const type = $("partlist").attr("type");
    if (type === "started") {
        ret.event_type = type;
    }
    else if (type === "ended") {
        ret.event_type = type;
    }
    else {
        throw new Error(`Unknown call state of: ${type}`);
    }
    let shortest = null;
    let connected = false;
    const participants = [];
    const parts = $("part").toArray();
    for (const part of parts) {
        const pjs = $(part);
        const add = { displayName: pjs.find("name").text(), username: pjs.attr("identity") };
        const duration = pjs.find("duration").text();
        if (duration !== undefined && duration !== "") {
            add.duration = parseInt(duration, 10);
            if (add.duration > 0) {
                connected = true;
                if (shortest === null || add.duration < shortest) {
                    shortest = add.duration;
                }
            }
        }
        participants.push(add);
    }
    ret.participants = participants;
    ret.call_connected = connected || participants.length > 1;
    if (shortest !== null) {
        ret.duration = shortest;
    }
    return ret;
}
function formatEventMessage(native) {
    let resource;
    switch (native.resourceType) {
        case "UserPresence":
            resource = null;
            break;
        case "EndpointPresence":
            resource = null;
            break;
        case "ConversationUpdate":
            resource = formatConversationUpdateResource(native.resource);
            break;
        case "NewMessage":
            resource = formatMessageResource(native.resource);
            break;
		case "ThreadUpdate":
		  return native;
		  break;	  			
        default:
            // tslint:disable-next-line:max-line-length
            throw new Error(`Unknown EventMessage.resourceType (${JSON.stringify(native.resourceType)}) for Event:\n${JSON.stringify(native)}`);
    }
    return {
        id: native.id,
        type: native.type,
        resourceType: native.resourceType,
        time: new Date(native.time),
        resourceLink: native.resourceLink,
        resource,
    };
}
class MessagesPoller extends events_1.default.EventEmitter {
    constructor(io, apiContext) {
        super();
        this.io = io;
        this.apiContext = apiContext;
        this.intervalId = null;
    }
    isActive() {
        return this.intervalId !== null;
    }
    run() {
        if (this.isActive()) {
            return this;
        }
        this.intervalId = setInterval(this.getMessages.bind(this), POLLING_DELAY);
        return this;
    }
    stop() {
        if (!this.isActive()) {
            return this;
        }
        clearInterval(this.intervalId);
        this.intervalId = null;
        return this;
    }
    /**
     * Get the new messages / events from the server.
     * This function always returns a successful promise once the messages are retrieved or an error happens.
     *
     * If any error happens, the message-poller will emit an `error` event with the error.
     */
    async getMessages() {
        try {
            const requestOptions = {
                // TODO: explicitly define user, endpoint and subscription
                uri: messagesUri.poll(this.apiContext.registrationToken.host),
                cookies: this.apiContext.cookies,
                headers: {
                    RegistrationToken: this.apiContext.registrationToken.raw,
                },
            };
            const res = await this.io.post(requestOptions);
            if (res.statusCode !== 200) {
                // const cause = http_1.UnexpectedHttpStatusError.create(res, new Set([200]), requestOptions);
                //this.emit("error", incident_1.Incident(cause, "poll", "Unable to poll the messages"));
                this.emit("error", res);
                return;
            }			
            const body = JSON.parse(res.body);
            if (body.eventMessages !== undefined) {
                for (const msg of body.eventMessages) {
                    // tslint:disable-next-line:max-line-length
                    // if (msg.resourceType != "UserPresence" && msg.resourceType != "EndpointPresence" && msg.resourceType != "ConversationUpdate")
                    //  console.log("EVT: " + JSON.stringify(msg, null, "\t"));
                    const formatted = formatEventMessage(msg);
                    if (formatted.resource !== null) {
                        this.emit("event-message", formatted);
                    }
                }
            }
        }
        catch (err) {
            this.emit("error", incident_1.Incident(err, "poll", "An error happened while processing the polled messages"));
        }
    }
}
exports.MessagesPoller = MessagesPoller;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvcG9sbGluZy9tZXNzYWdlcy1wb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsc0RBQThCO0FBQzlCLG9EQUE2QjtBQUM3Qix1Q0FBb0M7QUFDcEMseUNBQTJEO0FBUzNELDZEQUErQztBQUUvQyxvQ0FBb0M7QUFDcEMsTUFBTSxhQUFhLEdBQVcsSUFBSSxDQUFDO0FBRW5DLHNCQUFzQjtBQUN0QixrQ0FBa0M7QUFDbEMsTUFBTSxrQkFBa0IsR0FBVyxjQUFjLENBQUM7QUFFbEQscUVBQXFFO0FBQ3JFLHdCQUErQixTQUFpQjtJQUM5QyxNQUFNLEtBQUssR0FBMkIsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pFLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ25CLE1BQU0sSUFBSSxtQkFBUSxDQUFDLGFBQWEsRUFBRSx3QkFBd0IsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDRCxNQUFNLENBQUM7UUFDTCxHQUFHLEVBQUUsU0FBUztRQUNkLE1BQU0sRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUM5QixRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUNuQixDQUFDO0FBQ0osQ0FBQztBQVZELHdDQVVDO0FBRUQsZ0NBQ0UsTUFBMEIsRUFDMUIsY0FBK0M7SUFFL0MsTUFBTSxHQUFHLEdBQStCLE1BQW9DLENBQUM7SUFDN0UsR0FBRyxDQUFDLE9BQU8sR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDO0lBQ3JDLEdBQUcsQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLGVBQWUsQ0FBQztJQUM5QyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQVJELHdEQVFDO0FBRUQsNEJBQ0UsTUFBMEIsRUFDMUIsY0FBMkM7SUFFM0MsTUFBTSxHQUFHLEdBQTJCLE1BQWdDLENBQUM7SUFDckUs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SSxHQUFrRCxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUVqRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO29CQUNyQywyQ0FBMkM7b0JBQzNDLGdJQUFnSTtvQkFDaEksMkRBQTJEO29CQUUzRCxNQUFNLFNBQVMsR0FBd0Isa0JBQWtCLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQy9ELEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQ3hDLENBQUM7Z0JBQ0gsQ0FBQztZQUNILENBQUM7UUFDSCxDQUFDO1FBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNiLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLG1CQUFRLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRSx3REFBd0QsQ0FBQyxDQUFDLENBQUM7UUFDdEcsQ0FBQztJQUNILENBQUM7Q0FDRjtBQTVFRCx3Q0E0RUMiLCJmaWxlIjoicG9sbGluZy9tZXNzYWdlcy1wb2xsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2hlZXJpbyBmcm9tIFwiY2hlZXJpb1wiO1xuaW1wb3J0IF9ldmVudHMgZnJvbSBcImV2ZW50c1wiO1xuaW1wb3J0IHsgSW5jaWRlbnQgfSBmcm9tIFwiaW5jaWRlbnRcIjtcbmltcG9ydCB7IFVuZXhwZWN0ZWRIdHRwU3RhdHVzRXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL2h0dHBcIjtcbmltcG9ydCB7IFBhcnNlZENvbnZlcnNhdGlvbklkIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL2FwaVwiO1xuaW1wb3J0IHsgQ29udGV4dCBhcyBBcGlDb250ZXh0IH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL2NvbnRleHRcIjtcbmltcG9ydCAqIGFzIGV2ZW50cyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9hcGkvZXZlbnRzXCI7XG5pbXBvcnQgKiBhcyByZXNvdXJjZXMgZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL3Jlc291cmNlc1wiO1xuaW1wb3J0ICogYXMgaHR0cElvIGZyb20gXCIuLi9pbnRlcmZhY2VzL2h0dHAtaW9cIjtcbmltcG9ydCAqIGFzIG5hdGl2ZUV2ZW50cyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9uYXRpdmUtYXBpL2V2ZW50c1wiO1xuaW1wb3J0ICogYXMgbmF0aXZlTWVzc2FnZVJlc291cmNlcyBmcm9tIFwiLi4vaW50ZXJmYWNlcy9uYXRpdmUtYXBpL21lc3NhZ2UtcmVzb3VyY2VzXCI7XG5pbXBvcnQgKiBhcyBuYXRpdmVSZXNvdXJjZXMgZnJvbSBcIi4uL2ludGVyZmFjZXMvbmF0aXZlLWFwaS9yZXNvdXJjZXNcIjtcbmltcG9ydCAqIGFzIG1lc3NhZ2VzVXJpIGZyb20gXCIuLi9tZXNzYWdlcy11cmlcIjtcblxuLy8gUGVyZm9ybSBvbmUgcmVxdWVzdCBldmVyeSAxMDAwIG1zXG5jb25zdCBQT0xMSU5HX0RFTEFZOiBudW1iZXIgPSAxMDAwO1xuXG4vLyBNYXRjaCBhIGNvbnRhY3QgaWQ6XG4vLyBUT0RPOiBoYW5kbGUgdGhlIFwiZ3Vlc3RcIiBwcmVmaXhcbmNvbnN0IENPTlRBQ1RfSURfUEFUVEVSTjogUmVnRXhwID0gL14oXFxkKyk6KC4rKSQvO1xuXG4vLyBUT0RPKGRlbXVyZ29zKTogTG9va3MgbGlrZSB0aGVyZSBpcyBhIHByb2JsZW0gd2l0aCB0aGUgcmV0dXJuIHR5cGVcbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUNvbnRhY3RJZChjb250YWN0SWQ6IHN0cmluZyk6IFBhcnNlZENvbnZlcnNhdGlvbklkIHtcbiAgY29uc3QgbWF0Y2g6IFJlZ0V4cEV4ZWNBcnJheSB8IG51bGwgPSBDT05UQUNUX0lEX1BBVFRFUk4uZXhlYyhjb250YWN0SWQpO1xuICBpZiAobWF0Y2ggPT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgSW5jaWRlbnQoXCJwYXJzZS1lcnJvclwiLCBcIlVuYWJsZSB0byBwYXJzZSB1c2VySWRcIik7XG4gIH1cbiAgcmV0dXJuIHtcbiAgICByYXc6IGNvbnRhY3RJZCxcbiAgICBwcmVmaXg6IHBhcnNlSW50KG1hdGNoWzFdLCAxMCksXG4gICAgdXNlcm5hbWU6IG1hdGNoWzJdLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0UmljaFRleHRSZXNvdXJjZShcbiAgcmV0T2JqOiByZXNvdXJjZXMuUmVzb3VyY2UsXG4gIG5hdGl2ZVJlc291cmNlOiBuYXRpdmVNZXNzYWdlUmVzb3VyY2VzLlJpY2hUZXh0LFxuKTogcmVzb3VyY2VzLlJpY2hUZXh0UmVzb3VyY2Uge1xuICBjb25zdCByZXQ6IHJlc291cmNlcy5SaWNoVGV4dFJlc291cmNlID0gcmV0T2JqIGFzIHJlc291cmNlcy5SaWNoVGV4dFJlc291cmNlO1xuICByZXQuY29udGVudCA9IG5hdGl2ZVJlc291cmNlLmNvbnRlbnQ7XG4gIHJldC5jbGllbnRJZCA9IG5hdGl2ZVJlc291cmNlLmNsaWVudG1lc3NhZ2VpZDtcbiAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFRleHRSZXNvdXJjZShcbiAgcmV0T2JqOiByZXNvdXJjZXMuUmVzb3VyY2UsXG4gIG5hdGl2ZVJlc291cmNlOiBuYXRpdmVNZXNzYWdlUmVzb3VyY2VzLlRleHQsXG4pOiByZXNvdXJjZXMuVGV4dFJlc291cmNlIHtcbiAgY29uc3QgcmV0OiByZXNvdXJjZXMuVGV4dFJlc291cmNlID0gcmV0T2JqIGFzIHJlc291cmNlcy5UZXh0UmVzb3VyY2U7XG4gIHJldC5jb250ZW50ID0gbmF0aXZlUmVzb3VyY2UuY29udGVudDtcbiAgcmV0LmNsaWVudElkID0gbmF0aXZlUmVzb3VyY2UuY2xpZW50bWVzc2FnZWlkO1xuICByZXR1cm4gcmV0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Q29udHJvbENsZWFyVHlwaW5nUmVzb3VyY2UoXG4gIHJldE9iajogcmVzb3VyY2VzLlJlc291cmNlLFxuICBuYXRpdmVSZXNvdXJjZTogbmF0aXZlTWVzc2FnZVJlc291cmNlcy5Db250cm9sQ2xlYXJUeXBpbmcsXG4pOiByZXNvdXJjZXMuQ29udHJvbENsZWFyVHlwaW5nUmVzb3VyY2Uge1xuICByZXR1cm4gcmV0T2JqIGFzIHJlc291cmNlcy5Db250cm9sQ2xlYXJUeXBpbmdSZXNvdXJjZTtcbn1cblxuLy8gRXhwb3J0IGZvciB0ZXN0aW5nXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0R2VuZXJpY01lc3NhZ2VSZXNvdXJjZShcbiAgbmF0aXZlUmVzb3VyY2U6IG5hdGl2ZVJlc291cmNlcy5NZXNzYWdlUmVzb3VyY2UsXG4gIHR5cGU6IHJlc291cmNlcy5SZXNvdXJjZVR5cGUsXG4pIHtcbiAgY29uc3QgcGFyc2VkQ29udmVyc2F0aW9uVXJpOiBtZXNzYWdlc1VyaS5Db252ZXJzYXRpb25VcmkgPSBtZXNzYWdlc1VyaVxuICAgIC5wYXJzZUNvbnZlcnNhdGlvbihuYXRpdmVSZXNvdXJjZS5jb252ZXJzYXRpb25MaW5rKTtcbiAgY29uc3QgcGFyc2VkQ29udGFjdFVyaTogbWVzc2FnZXNVcmkuQ29udGFjdFVyaSA9IG1lc3NhZ2VzVXJpLnBhcnNlQ29udGFjdChuYXRpdmVSZXNvdXJjZS5mcm9tKTtcbiAgY29uc3QgcGFyc2VkQ29udGFjdElkOiBQYXJzZWRDb252ZXJzYXRpb25JZCA9IHBhcnNlQ29udGFjdElkKHBhcnNlZENvbnRhY3RVcmkuY29udGFjdCk7XG4gIHJldHVybiB7XG4gICAgdHlwZSxcbiAgICBpZDogbmF0aXZlUmVzb3VyY2UuaWQsXG4gICAgY29tcG9zZVRpbWU6IG5ldyBEYXRlKG5hdGl2ZVJlc291cmNlLmNvbXBvc2V0aW1lKSxcbiAgICBhcnJpdmFsVGltZTogbmV3IERhdGUobmF0aXZlUmVzb3VyY2Uub3JpZ2luYWxhcnJpdmFsdGltZSksXG4gICAgZnJvbTogcGFyc2VkQ29udGFjdElkLFxuICAgIGNvbnZlcnNhdGlvbjogcGFyc2VkQ29udmVyc2F0aW9uVXJpLmNvbnZlcnNhdGlvbixcbiAgICBuYXRpdmU6IG5hdGl2ZVJlc291cmNlLFxuICB9O1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Q29udmVyc2F0aW9uVXBkYXRlUmVzb3VyY2UobmF0aXZlUmVzb3VyY2U6IG5hdGl2ZVJlc291cmNlcy5Db252ZXJzYXRpb25VcGRhdGUpOiByZXNvdXJjZXMuQ29udmVyc2F0aW9uVXBkYXRlUmVzb3VyY2Uge1xuICBjb25zdCBwYXJzZWRDb252ZXJzYXRpb25Vcmk6IG1lc3NhZ2VzVXJpLkNvbnZlcnNhdGlvblVyaSA9IG1lc3NhZ2VzVXJpXG4gICAgLnBhcnNlQ29udmVyc2F0aW9uKG5hdGl2ZVJlc291cmNlLmxhc3RNZXNzYWdlLmNvbnZlcnNhdGlvbkxpbmspO1xuICBjb25zdCBwYXJzZWRDb250YWN0VXJpOiBtZXNzYWdlc1VyaS5Db250YWN0VXJpID0gbWVzc2FnZXNVcmkucGFyc2VDb250YWN0KG5hdGl2ZVJlc291cmNlLmxhc3RNZXNzYWdlLmZyb20pO1xuICBjb25zdCBwYXJzZWRDb250YWN0SWQ6IFBhcnNlZENvbnZlcnNhdGlvbklkID0gcGFyc2VDb250YWN0SWQocGFyc2VkQ29udGFjdFVyaS5jb250YWN0KTtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiBcIkNvbnZlcnNhdGlvblVwZGF0ZVwiLFxuICAgIGlkOiBuYXRpdmVSZXNvdXJjZS5pZCxcbiAgICBjbGllbnRJZDogbmF0aXZlUmVzb3VyY2UubGFzdE1lc3NhZ2UuY2xpZW50bWVzc2FnZWlkLFxuICAgIGNvbXBvc2VUaW1lOiBuZXcgRGF0ZShuYXRpdmVSZXNvdXJjZS5sYXN0TWVzc2FnZS5jb21wb3NldGltZSksXG4gICAgYXJyaXZhbFRpbWU6IG5ldyBEYXRlKG5hdGl2ZVJlc291cmNlLmxhc3RNZXNzYWdlLm9yaWdpbmFsYXJyaXZhbHRpbWUpLFxuICAgIGZyb206IHBhcnNlZENvbnRhY3RJZCxcbiAgICBjb252ZXJzYXRpb246IHBhcnNlZENvbnZlcnNhdGlvblVyaS5jb252ZXJzYXRpb24sXG4gICAgbmF0aXZlOiBuYXRpdmVSZXNvdXJjZSxcbiAgICBjb250ZW50OiBuYXRpdmVSZXNvdXJjZS5sYXN0TWVzc2FnZS5jb250ZW50LFxuICB9O1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Q29udHJvbFR5cGluZ1Jlc291cmNlKFxuICByZXRPYmo6IHJlc291cmNlcy5SZXNvdXJjZSxcbiAgbmF0aXZlUmVzb3VyY2U6IG5hdGl2ZU1lc3NhZ2VSZXNvdXJjZXMuQ29udHJvbFR5cGluZyxcbik6IHJlc291cmNlcy5Db250cm9sVHlwaW5nUmVzb3VyY2Uge1xuICBjb25zdCByZXQ6IHJlc291cmNlcy5Db250cm9sVHlwaW5nUmVzb3VyY2UgPSByZXRPYmogYXMgcmVzb3VyY2VzLkNvbnRyb2xUeXBpbmdSZXNvdXJjZTtcbiAgcmV0dXJuIHJldDtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFNpZ25hbEZsYW1pbmdvUmVzb3VyY2UoXG4gIHJldE9iajogcmVzb3VyY2VzLlJlc291cmNlLFxuICBuYXRpdmVSZXNvdXJjZTogbmF0aXZlTWVzc2FnZVJlc291cmNlcy5TaWduYWxGbGFtaW5nbyxcbik6IHJlc291cmNlcy5TaWduYWxGbGFtaW5nb1Jlc291cmNlIHtcbiAgY29uc3QgcmV0OiByZXNvdXJjZXMuU2lnbmFsRmxhbWluZ29SZXNvdXJjZSA9IHJldE9iaiBhcyByZXNvdXJjZXMuU2lnbmFsRmxhbWluZ29SZXNvdXJjZTtcbiAgcmV0LnNreXBlZ3VpZCA9IG5hdGl2ZVJlc291cmNlLnNreXBlZ3VpZDtcbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gZm9ybWF0TWVzc2FnZVJlc291cmNlKG5hdGl2ZVJlc291cmNlOiBuYXRpdmVSZXNvdXJjZXMuTWVzc2FnZVJlc291cmNlKTogcmVzb3VyY2VzLlJlc291cmNlIHtcbiAgc3dpdGNoIChuYXRpdmVSZXNvdXJjZS5tZXNzYWdldHlwZSkge1xuICAgIGNhc2UgXCJSaWNoVGV4dC9VcmlPYmplY3RcIjpcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIHJldHVybiBmb3JtYXRVcmlPYmplY3RSZXNvdXJjZShmb3JtYXRGaWxlUmVzb3VyY2UoZm9ybWF0R2VuZXJpY01lc3NhZ2VSZXNvdXJjZShuYXRpdmVSZXNvdXJjZSwgbmF0aXZlUmVzb3VyY2UubWVzc2FnZXR5cGUpLCA8bmF0aXZlTWVzc2FnZVJlc291cmNlcy5VcmlPYmplY3Q+IG5hdGl2ZVJlc291cmNlKSwgPG5hdGl2ZU1lc3NhZ2VSZXNvdXJjZXMuVXJpT2JqZWN0PiBuYXRpdmVSZXNvdXJjZSk7XG4gICAgY2FzZSBcIlJpY2hUZXh0L01lZGlhX1ZpZGVvXCI6XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICByZXR1cm4gZm9ybWF0TWVkaWFWaWRlb1Jlc291cmNlKGZvcm1hdEZpbGVSZXNvdXJjZShmb3JtYXRHZW5lcmljTWVzc2FnZVJlc291cmNlKG5hdGl2ZVJlc291cmNlLCBuYXRpdmVSZXNvdXJjZS5tZXNzYWdldHlwZSksIDxuYXRpdmVNZXNzYWdlUmVzb3VyY2VzLk1lZGlhVmlkZW8+IG5hdGl2ZVJlc291cmNlKSwgPG5hdGl2ZU1lc3NhZ2VSZXNvdXJjZXMuTWVkaWFWaWRlbz4gbmF0aXZlUmVzb3VyY2UpO1xuICAgIGNhc2UgXCJSaWNoVGV4dC9NZWRpYV9HZW5lcmljRmlsZVwiOlxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgcmV0dXJuIGZvcm1hdE1lZGlhR2VuZXJpY0ZpbGVSZXNvdXJjZShmb3JtYXRGaWxlUmVzb3VyY2UoZm9ybWF0R2VuZXJpY01lc3NhZ2VSZXNvdXJjZShuYXRpdmVSZXNvdXJjZSwgbmF0aXZlUmVzb3VyY2UubWVzc2FnZXR5cGUpLCA8bmF0aXZlTWVzc2FnZVJlc291cmNlcy5NZWRpYUdlbmVyaWNGaWxlPiBuYXRpdmVSZXNvdXJjZSksIDxuYXRpdmVNZXNzYWdlUmVzb3VyY2VzLk1lZGlhR2VuZXJpY0ZpbGU+IG5hdGl2ZVJlc291cmNlKTtcbiAgICBjYXNlIFwiUmljaFRleHQvTG9jYXRpb25cIjpcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIHJldHVybiBmb3JtYXRMb2NhdGlvblJlc291cmNlKGZvcm1hdEdlbmVyaWNNZXNzYWdlUmVzb3VyY2UobmF0aXZlUmVzb3VyY2UsIG5hdGl2ZVJlc291cmNlLm1lc3NhZ2V0eXBlKSwgPG5hdGl2ZU1lc3NhZ2VSZXNvdXJjZXMuTG9jYXRpb25PYmplY3Q+IG5hdGl2ZVJlc291cmNlKTtcbiAgICBjYXNlIFwiRXZlbnQvQ2FsbFwiOlxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgcmV0dXJuIGZvcm1hdEV2ZW50Q2FsbFJlc291cmNlKGZvcm1hdEdlbmVyaWNNZXNzYWdlUmVzb3VyY2UobmF0aXZlUmVzb3VyY2UsIG5hdGl2ZVJlc291cmNlLm1lc3NhZ2V0eXBlKSwgPG5hdGl2ZU1lc3NhZ2VSZXNvdXJjZXMuRXZlbnRDYWxsPiBuYXRpdmVSZXNvdXJjZSk7XG4gICAgY2FzZSBcIlJpY2hUZXh0XCI6XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICByZXR1cm4gZm9ybWF0UmljaFRleHRSZXNvdXJjZShmb3JtYXRHZW5lcmljTWVzc2FnZVJlc291cmNlKG5hdGl2ZVJlc291cmNlLCBuYXRpdmVSZXNvdXJjZS5tZXNzYWdldHlwZSksIDxuYXRpdmVNZXNzYWdlUmVzb3VyY2VzLlJpY2hUZXh0PiBuYXRpdmVSZXNvdXJjZSk7XG4gICAgY2FzZSBcIlRleHRcIjpcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIHJldHVybiBmb3JtYXRUZXh0UmVzb3VyY2UoZm9ybWF0R2VuZXJpY01lc3NhZ2VSZXNvdXJjZShuYXRpdmVSZXNvdXJjZSwgbmF0aXZlUmVzb3VyY2UubWVzc2FnZXR5cGUpLCA8bmF0aXZlTWVzc2FnZVJlc291cmNlcy5UZXh0PiBuYXRpdmVSZXNvdXJjZSk7XG4gICAgY2FzZSBcIkNvbnRyb2wvQ2xlYXJUeXBpbmdcIjpcbiAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgIHJldHVybiBmb3JtYXRDb250cm9sQ2xlYXJUeXBpbmdSZXNvdXJjZShmb3JtYXRHZW5lcmljTWVzc2FnZVJlc291cmNlKG5hdGl2ZVJlc291cmNlLCBuYXRpdmVSZXNvdXJjZS5tZXNzYWdldHlwZSksIDxuYXRpdmVNZXNzYWdlUmVzb3VyY2VzLkNvbnRyb2xDbGVhclR5cGluZz4gbmF0aXZlUmVzb3VyY2UpO1xuICAgIGNhc2UgXCJDb250cm9sL1R5cGluZ1wiOlxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgcmV0dXJuIGZvcm1hdENvbnRyb2xUeXBpbmdSZXNvdXJjZShmb3JtYXRHZW5lcmljTWVzc2FnZVJlc291cmNlKG5hdGl2ZVJlc291cmNlLCBuYXRpdmVSZXNvdXJjZS5tZXNzYWdldHlwZSksIDxuYXRpdmVNZXNzYWdlUmVzb3VyY2VzLkNvbnRyb2xUeXBpbmc+IG5hdGl2ZVJlc291cmNlKTtcbiAgICBjYXNlIFwiU2lnbmFsL0ZsYW1pbmdvXCI6IC8vIGluY29taW5nIGNhbGwgcmVxdWVzdFxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgcmV0dXJuIGZvcm1hdFNpZ25hbEZsYW1pbmdvUmVzb3VyY2UoZm9ybWF0R2VuZXJpY01lc3NhZ2VSZXNvdXJjZShuYXRpdmVSZXNvdXJjZSwgbmF0aXZlUmVzb3VyY2UubWVzc2FnZXR5cGUpLCA8bmF0aXZlTWVzc2FnZVJlc291cmNlcy5TaWduYWxGbGFtaW5nbz4gbmF0aXZlUmVzb3VyY2UpO1xuICAgIGRlZmF1bHQ6XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcmVzc291cmNlLm1lc3NhZ2VUeXBlICgke0pTT04uc3RyaW5naWZ5KG5hdGl2ZVJlc291cmNlLm1lc3NhZ2V0eXBlKX0pIGZvciByZXNvdXJjZTpcXG4ke0pTT04uc3RyaW5naWZ5KG5hdGl2ZVJlc291cmNlLCBudWxsLCBcIlxcdFwiKX1gKTtcbiAgfVxufVxuXG50eXBlIE5hdGl2ZUZpbGVSZXNvdWNlID1cbiAgbmF0aXZlTWVzc2FnZVJlc291cmNlcy5NZWRpYUdlbmVyaWNGaWxlXG4gIHwgbmF0aXZlTWVzc2FnZVJlc291cmNlcy5VcmlPYmplY3RcbiAgfCBuYXRpdmVNZXNzYWdlUmVzb3VyY2VzLk1lZGlhVmlkZW87XG5cbmZ1bmN0aW9uIGZvcm1hdEZpbGVSZXNvdXJjZShyZXRPYmo6IHJlc291cmNlcy5SZXNvdXJjZSwgbmF0aXZlOiBOYXRpdmVGaWxlUmVzb3VjZSk6IHJlc291cmNlcy5GaWxlUmVzb3VyY2Uge1xuICBjb25zdCByZXQ6IHJlc291cmNlcy5GaWxlUmVzb3VyY2UgPSByZXRPYmogYXMgcmVzb3VyY2VzLkZpbGVSZXNvdXJjZTtcbiAgY29uc3QgJDogQ2hlZXJpb1N0YXRpYyA9IGNoZWVyaW8ubG9hZChuYXRpdmUuY29udGVudCk7XG4gIGNvbnN0IG9iajogQ2hlZXJpbyA9ICQoXCJVUklPYmplY3RcIik7XG4gIHJldC51cmlfdHlwZSA9IG9iai5hdHRyKFwidHlwZVwiKTtcbiAgcmV0LnVyaSA9IG9iai5hdHRyKFwidXJpXCIpO1xuICByZXQudXJpX3RodW1ibmFpbCA9IG9iai5hdHRyKFwidXJsX3RodW1ibmFpbFwiKTtcbiAgcmV0LnVyaV93X2xvZ2luID0gJChvYmouZmluZChcImFcIikpLmF0dHIoXCJocmVmXCIpO1xuICBjb25zdCBzaXplU3RyaW5nOiBzdHJpbmcgfCB1bmRlZmluZWQgPSAkKG9iai5maW5kKFwiRmlsZVNpemVcIikpLmF0dHIoXCJ2XCIpO1xuICBpZiAoc2l6ZVN0cmluZyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0LmZpbGVfc2l6ZSA9IHBhcnNlSW50KHNpemVTdHJpbmcsIDEwKTtcbiAgfVxuICByZXQub3JpZ2luYWxfZmlsZV9uYW1lID0gJChvYmouZmluZChcIk9yaWdpbmFsTmFtZVwiKSkuYXR0cihcInZcIik7XG4gIHJldHVybiByZXQ7XG59XG5cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbmZ1bmN0aW9uIGZvcm1hdE1lZGlhR2VuZXJpY0ZpbGVSZXNvdXJjZShcbiAgcmV0T2JqOiByZXNvdXJjZXMuRmlsZVJlc291cmNlLFxuICBuYXRpdmU6IG5hdGl2ZU1lc3NhZ2VSZXNvdXJjZXMuTWVkaWFHZW5lcmljRmlsZSxcbik6IHJlc291cmNlcy5SaWNoVGV4dE1lZGlhR2VuZXJpY0ZpbGVSZXNvdXJjZSB7XG4gIGNvbnN0IHJldDogcmVzb3VyY2VzLlJpY2hUZXh0TWVkaWFHZW5lcmljRmlsZVJlc291cmNlID0gcmV0T2JqIGFzIHJlc291cmNlcy5SaWNoVGV4dE1lZGlhR2VuZXJpY0ZpbGVSZXNvdXJjZTtcbiAgcmV0dXJuIHJldDtcbn1cblxuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuZnVuY3Rpb24gZm9ybWF0TWVkaWFWaWRlb1Jlc291cmNlKFxuICByZXRPYmo6IHJlc291cmNlcy5GaWxlUmVzb3VyY2UsXG4gIG5hdGl2ZTogbmF0aXZlTWVzc2FnZVJlc291cmNlcy5NZWRpYVZpZGVvLFxuKTogcmVzb3VyY2VzLlJpY2hUZXh0TWVkaWFHZW5lcmljRmlsZVJlc291cmNlIHtcbiAgY29uc3QgcmV0OiByZXNvdXJjZXMuUmljaFRleHRNZWRpYUdlbmVyaWNGaWxlUmVzb3VyY2UgPSByZXRPYmogYXMgcmVzb3VyY2VzLlJpY2hUZXh0TWVkaWFHZW5lcmljRmlsZVJlc291cmNlO1xuICByZXR1cm4gcmV0O1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG5mdW5jdGlvbiBmb3JtYXRVcmlPYmplY3RSZXNvdXJjZShcbiAgcmV0T2JqOiByZXNvdXJjZXMuRmlsZVJlc291cmNlLFxuICBuYXRpdmU6IG5hdGl2ZU1lc3NhZ2VSZXNvdXJjZXMuVXJpT2JqZWN0LFxuKTogcmVzb3VyY2VzLlJpY2hUZXh0VXJpT2JqZWN0UmVzb3VyY2Uge1xuICBjb25zdCByZXQ6IHJlc291cmNlcy5SaWNoVGV4dFVyaU9iamVjdFJlc291cmNlID0gcmV0T2JqIGFzIHJlc291cmNlcy5SaWNoVGV4dFVyaU9iamVjdFJlc291cmNlO1xuICByZXR1cm4gcmV0O1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG5mdW5jdGlvbiBmb3JtYXRMb2NhdGlvblJlc291cmNlKFxuICByZXRPYmo6IHJlc291cmNlcy5SZXNvdXJjZSxcbiAgbmF0aXZlOiBuYXRpdmVNZXNzYWdlUmVzb3VyY2VzLkxvY2F0aW9uT2JqZWN0LFxuKTogcmVzb3VyY2VzLlJpY2hUZXh0TG9jYXRpb25SZXNvdXJjZSB7XG4gIGNvbnN0IHJldDogcmVzb3VyY2VzLlJpY2hUZXh0TG9jYXRpb25SZXNvdXJjZSA9IHJldE9iaiBhcyByZXNvdXJjZXMuUmljaFRleHRMb2NhdGlvblJlc291cmNlO1xuICBjb25zdCAkOiBDaGVlcmlvU3RhdGljID0gY2hlZXJpby5sb2FkKG5hdGl2ZS5jb250ZW50KTtcbiAgY29uc3Qgb2JqOiBDaGVlcmlvID0gJChcImxvY2F0aW9uXCIpO1xuICByZXQubGF0aXR1ZGUgPSBwYXJzZUludChvYmouYXR0cihcImxhdGl0dWRlXCIpLCAxMCk7XG4gIHJldC5sb25naXR1ZGUgPSBwYXJzZUludChvYmouYXR0cihcImxvbmdpdHVkZVwiKSwgMTApO1xuICByZXQuYWx0aXR1ZGUgPSBwYXJzZUludChvYmouYXR0cihcImFsdGl0dWRlXCIpLCAxMCk7XG4gIHJldC5zcGVlZCA9IHBhcnNlSW50KG9iai5hdHRyKFwic3BlZWRcIiksIDEwKTtcbiAgcmV0LmNvdXJzZSA9IHBhcnNlSW50KG9iai5hdHRyKFwiY291cnNlXCIpLCAxMCk7XG4gIHJldC5hZGRyZXNzID0gb2JqLmF0dHIoXCJhZGRyZXNzXCIpO1xuICByZXQucG9pbnRPZkludGVyZXN0ID0gb2JqLmF0dHIoXCJwb2ludE9mSW50ZXJlc3RcIik7XG4gIHJldC5tYXBfdXJsID0gJChvYmouZmluZChcImFcIikpLmF0dHIoXCJocmVmXCIpO1xuICByZXR1cm4gcmV0O1xufVxuXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoXG5mdW5jdGlvbiBmb3JtYXRFdmVudENhbGxSZXNvdXJjZShcbiAgcmV0T2JqOiByZXNvdXJjZXMuUmVzb3VyY2UsXG4gIG5hdGl2ZTogbmF0aXZlTWVzc2FnZVJlc291cmNlcy5FdmVudENhbGwsXG4pOiByZXNvdXJjZXMuRXZlbnRDYWxsUmVzb3VyY2Uge1xuICBjb25zdCByZXQ6IHJlc291cmNlcy5FdmVudENhbGxSZXNvdXJjZSA9IHJldE9iaiBhcyByZXNvdXJjZXMuRXZlbnRDYWxsUmVzb3VyY2U7XG4gIGNvbnN0ICQ6IENoZWVyaW9TdGF0aWMgPSBjaGVlcmlvLmxvYWQobmF0aXZlLmNvbnRlbnQpO1xuICBjb25zdCB0eXBlOiBzdHJpbmcgPSAkKFwicGFydGxpc3RcIikuYXR0cihcInR5cGVcIik7XG4gIGlmICh0eXBlID09PSBcInN0YXJ0ZWRcIikge1xuICAgIHJldC5ldmVudF90eXBlID0gdHlwZTtcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcImVuZGVkXCIpIHtcbiAgICByZXQuZXZlbnRfdHlwZSA9IHR5cGU7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIGNhbGwgc3RhdGUgb2Y6ICR7dHlwZX1gKTtcbiAgfVxuXG4gIGxldCBzaG9ydGVzdDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIGxldCBjb25uZWN0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgY29uc3QgcGFydGljaXBhbnRzOiByZXNvdXJjZXMuQ2FsbFBhcnRpY2lwYW50W10gPSBbXTtcbiAgY29uc3QgcGFydHM6IENoZWVyaW9FbGVtZW50W10gPSAkKFwicGFydFwiKS50b0FycmF5KCk7XG4gIGZvciAoY29uc3QgcGFydCBvZiBwYXJ0cykge1xuICAgIGNvbnN0IHBqczogQ2hlZXJpbyA9ICQocGFydCk7XG4gICAgY29uc3QgYWRkOiByZXNvdXJjZXMuQ2FsbFBhcnRpY2lwYW50ID0ge2Rpc3BsYXlOYW1lOiBwanMuZmluZChcIm5hbWVcIikudGV4dCgpLCB1c2VybmFtZTogcGpzLmF0dHIoXCJpZGVudGl0eVwiKX07XG4gICAgY29uc3QgZHVyYXRpb246IHN0cmluZyB8IHVuZGVmaW5lZCA9IHBqcy5maW5kKFwiZHVyYXRpb25cIikudGV4dCgpO1xuICAgIGlmIChkdXJhdGlvbiAhPT0gdW5kZWZpbmVkICYmIGR1cmF0aW9uICE9PSBcIlwiKSB7XG4gICAgICBhZGQuZHVyYXRpb24gPSBwYXJzZUludChkdXJhdGlvbiwgMTApO1xuICAgICAgaWYgKGFkZC5kdXJhdGlvbiA+IDApIHtcbiAgICAgICAgY29ubmVjdGVkID0gdHJ1ZTtcbiAgICAgICAgaWYgKHNob3J0ZXN0ID09PSBudWxsIHx8IGFkZC5kdXJhdGlvbiA8IHNob3J0ZXN0KSB7XG4gICAgICAgICAgc2hvcnRlc3QgPSBhZGQuZHVyYXRpb247XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcGFydGljaXBhbnRzLnB1c2goYWRkKTtcbiAgfVxuICByZXQucGFydGljaXBhbnRzID0gcGFydGljaXBhbnRzO1xuICByZXQuY2FsbF9jb25uZWN0ZWQgPSBjb25uZWN0ZWQgfHwgcGFydGljaXBhbnRzLmxlbmd0aCA+IDE7XG4gIGlmIChzaG9ydGVzdCAhPT0gbnVsbCkge1xuICAgIHJldC5kdXJhdGlvbiA9IHNob3J0ZXN0O1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGZvcm1hdEV2ZW50TWVzc2FnZShuYXRpdmU6IG5hdGl2ZUV2ZW50cy5FdmVudE1lc3NhZ2UpOiBldmVudHMuRXZlbnRNZXNzYWdlIHtcbiAgbGV0IHJlc291cmNlOiByZXNvdXJjZXMuUmVzb3VyY2UgfCBudWxsO1xuICBzd2l0Y2ggKG5hdGl2ZS5yZXNvdXJjZVR5cGUpIHtcbiAgICBjYXNlIFwiVXNlclByZXNlbmNlXCI6XG4gICAgICByZXNvdXJjZSA9IG51bGw7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiRW5kcG9pbnRQcmVzZW5jZVwiOlxuICAgICAgcmVzb3VyY2UgPSBudWxsO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSBcIkNvbnZlcnNhdGlvblVwZGF0ZVwiOlxuICAgICAgcmVzb3VyY2UgPSBmb3JtYXRDb252ZXJzYXRpb25VcGRhdGVSZXNvdXJjZShuYXRpdmUucmVzb3VyY2UgYXMgbmF0aXZlUmVzb3VyY2VzLkNvbnZlcnNhdGlvblVwZGF0ZSk7XG4gICAgICBicmVhaztcbiAgICBjYXNlIFwiTmV3TWVzc2FnZVwiOlxuICAgICAgcmVzb3VyY2UgPSBmb3JtYXRNZXNzYWdlUmVzb3VyY2UoPG5hdGl2ZVJlc291cmNlcy5NZXNzYWdlUmVzb3VyY2U+IG5hdGl2ZS5yZXNvdXJjZSk7XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm1heC1saW5lLWxlbmd0aFxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIEV2ZW50TWVzc2FnZS5yZXNvdXJjZVR5cGUgKCR7SlNPTi5zdHJpbmdpZnkobmF0aXZlLnJlc291cmNlVHlwZSl9KSBmb3IgRXZlbnQ6XFxuJHtKU09OLnN0cmluZ2lmeShuYXRpdmUpfWApO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpZDogbmF0aXZlLmlkLFxuICAgIHR5cGU6IG5hdGl2ZS50eXBlLFxuICAgIHJlc291cmNlVHlwZTogbmF0aXZlLnJlc291cmNlVHlwZSxcbiAgICB0aW1lOiBuZXcgRGF0ZShuYXRpdmUudGltZSksXG4gICAgcmVzb3VyY2VMaW5rOiBuYXRpdmUucmVzb3VyY2VMaW5rLFxuICAgIHJlc291cmNlLFxuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgTWVzc2FnZXNQb2xsZXIgZXh0ZW5kcyBfZXZlbnRzLkV2ZW50RW1pdHRlciB7XG4gIGlvOiBodHRwSW8uSHR0cElvO1xuICBhcGlDb250ZXh0OiBBcGlDb250ZXh0O1xuICBpbnRlcnZhbElkOiBudW1iZXIgfCBOb2RlSlMuVGltZXIgfCBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGlvOiBodHRwSW8uSHR0cElvLCBhcGlDb250ZXh0OiBBcGlDb250ZXh0KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuaW8gPSBpbztcbiAgICB0aGlzLmFwaUNvbnRleHQgPSBhcGlDb250ZXh0O1xuICAgIHRoaXMuaW50ZXJ2YWxJZCA9IG51bGw7XG4gIH1cblxuICBpc0FjdGl2ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5pbnRlcnZhbElkICE9PSBudWxsO1xuICB9XG5cbiAgcnVuKCk6IHRoaXMge1xuICAgIGlmICh0aGlzLmlzQWN0aXZlKCkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB0aGlzLmludGVydmFsSWQgPSBzZXRJbnRlcnZhbCh0aGlzLmdldE1lc3NhZ2VzLmJpbmQodGhpcyksIFBPTExJTkdfREVMQVkpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgc3RvcCgpOiB0aGlzIHtcbiAgICBpZiAoIXRoaXMuaXNBY3RpdmUoKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNsZWFySW50ZXJ2YWwoPGFueT4gdGhpcy5pbnRlcnZhbElkKTtcbiAgICB0aGlzLmludGVydmFsSWQgPSBudWxsO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgbmV3IG1lc3NhZ2VzIC8gZXZlbnRzIGZyb20gdGhlIHNlcnZlci5cbiAgICogVGhpcyBmdW5jdGlvbiBhbHdheXMgcmV0dXJucyBhIHN1Y2Nlc3NmdWwgcHJvbWlzZSBvbmNlIHRoZSBtZXNzYWdlcyBhcmUgcmV0cmlldmVkIG9yIGFuIGVycm9yIGhhcHBlbnMuXG4gICAqXG4gICAqIElmIGFueSBlcnJvciBoYXBwZW5zLCB0aGUgbWVzc2FnZS1wb2xsZXIgd2lsbCBlbWl0IGFuIGBlcnJvcmAgZXZlbnQgd2l0aCB0aGUgZXJyb3IuXG4gICAqL1xuICBwcm90ZWN0ZWQgYXN5bmMgZ2V0TWVzc2FnZXMoKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlcXVlc3RPcHRpb25zOiBodHRwSW8uUG9zdE9wdGlvbnMgPSB7XG4gICAgICAgIC8vIFRPRE86IGV4cGxpY2l0bHkgZGVmaW5lIHVzZXIsIGVuZHBvaW50IGFuZCBzdWJzY3JpcHRpb25cbiAgICAgICAgdXJpOiBtZXNzYWdlc1VyaS5wb2xsKHRoaXMuYXBpQ29udGV4dC5yZWdpc3RyYXRpb25Ub2tlbi5ob3N0KSxcbiAgICAgICAgY29va2llczogdGhpcy5hcGlDb250ZXh0LmNvb2tpZXMsXG4gICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICBSZWdpc3RyYXRpb25Ub2tlbjogdGhpcy5hcGlDb250ZXh0LnJlZ2lzdHJhdGlvblRva2VuLnJhdyxcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgICBjb25zdCByZXM6IGh0dHBJby5SZXNwb25zZSA9IGF3YWl0IHRoaXMuaW8ucG9zdChyZXF1ZXN0T3B0aW9ucyk7XG5cbiAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICAgIGNvbnN0IGNhdXNlOiBVbmV4cGVjdGVkSHR0cFN0YXR1c0Vycm9yID0gVW5leHBlY3RlZEh0dHBTdGF0dXNFcnJvci5jcmVhdGUocmVzLCBuZXcgU2V0KFsyMDBdKSwgcmVxdWVzdE9wdGlvbnMpO1xuICAgICAgICB0aGlzLmVtaXQoXCJlcnJvclwiLCBJbmNpZGVudChjYXVzZSwgXCJwb2xsXCIsIFwiVW5hYmxlIHRvIHBvbGwgdGhlIG1lc3NhZ2VzXCIpKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBib2R5OiB7ZXZlbnRNZXNzYWdlcz86IG5hdGl2ZUV2ZW50cy5FdmVudE1lc3NhZ2VbXX0gPSBKU09OLnBhcnNlKHJlcy5ib2R5KTtcblxuICAgICAgaWYgKGJvZHkuZXZlbnRNZXNzYWdlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGZvciAoY29uc3QgbXNnIG9mIGJvZHkuZXZlbnRNZXNzYWdlcykge1xuICAgICAgICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICAgICAgICAvLyBpZiAobXNnLnJlc291cmNlVHlwZSAhPSBcIlVzZXJQcmVzZW5jZVwiICYmIG1zZy5yZXNvdXJjZVR5cGUgIT0gXCJFbmRwb2ludFByZXNlbmNlXCIgJiYgbXNnLnJlc291cmNlVHlwZSAhPSBcIkNvbnZlcnNhdGlvblVwZGF0ZVwiKVxuICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcIkVWVDogXCIgKyBKU09OLnN0cmluZ2lmeShtc2csIG51bGwsIFwiXFx0XCIpKTtcblxuICAgICAgICAgIGNvbnN0IGZvcm1hdHRlZDogZXZlbnRzLkV2ZW50TWVzc2FnZSA9IGZvcm1hdEV2ZW50TWVzc2FnZShtc2cpO1xuICAgICAgICAgIGlmIChmb3JtYXR0ZWQucmVzb3VyY2UgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuZW1pdChcImV2ZW50LW1lc3NhZ2VcIiwgZm9ybWF0dGVkKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZW1pdChcImVycm9yXCIsIEluY2lkZW50KGVyciwgXCJwb2xsXCIsIFwiQW4gZXJyb3IgaGFwcGVuZWQgd2hpbGUgcHJvY2Vzc2luZyB0aGUgcG9sbGVkIG1lc3NhZ2VzXCIpKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiLi4ifQ==
