"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const incident_1 = require("incident");
const lodash_1 = __importDefault(require("lodash"));
const mri_1 = require("../mri");
const user_data_processor_1 = require("./user-data-processor");
function formatConversation(native) {
    // TODO: parse id
    if (native.id.indexOf("19:") === 0) {
        return native;
    }
    else {
        const contact = native.id;
        const result = native;
        result.members = [contact];
        return result;
    }
}
exports.formatConversation = formatConversation;
function formatThread(native) {
    const memberIds = lodash_1.default.map(native.members, ((member) => member.id));
    const properties = {};
    if ("properties" in native) {
        if ("topic" in native.properties) {
            properties.topic = native.properties.topic;
        }
        if ("lastjoinat" in native.properties) {
            properties.topic = native.properties.lastjoinat;
        }
        if ("version" in native.properties) {
            properties.topic = native.properties.version;
        }
    }
    return {
        threadProperties: properties,
        id: native.id,
        type: native.type,
        version: native.version,
        members: memberIds,
    };
}
exports.formatThread = formatThread;
function formatSearchContact(native) {
    return searchContactToPerson(native);
}
exports.formatSearchContact = formatSearchContact;
function formatContact(native) {
    return contactToPerson(native);
}
exports.formatContact = formatContact;
// github:demurgos/skype-web-reversed -> jSkype/modelHelpers/contacts/dataMappers/agentToPerson.js
function agentToPerson(native) {
}
// TODO: check that the uri uses the HTTPS protocol
function ensureHttps(uri) {
    return uri;
}
function define(...args) {
    return null;
}
function searchContactToPerson(native) {
    let avatarUrl;
    if (typeof native.avatarUrl === "string") {
        avatarUrl = ensureHttps(native.avatarUrl);
        // TODO: ensure that the "cacheHeaders=1" queryString is there
    }
    else {
        avatarUrl = null;
    }
    const displayName = user_data_processor_1.sanitizeXml(native.displayname);
    const firstName = (native.firstname !== undefined) ? user_data_processor_1.sanitizeXml(native.firstname) : null;
    const lastName = (native.lastname !== undefined) ? user_data_processor_1.sanitizeXml(native.lastname) : null;
    const phoneNumbers = [];
    const locations = [];
    const type = mri_1.MriType.Skype;
    const typeKey = mri_1.mriTypeToTypeCode(type);
    let result;
    result = {
        id: {
            id: native.username,
            typeKey,
            typeName: mri_1.mriTypeToTypeName(type),
            raw: `${typeKey}:${native.username}`,
        },
        emails: native.emails,
        avatarUrl,
        phones: phoneNumbers,
        name: {
            first: firstName,
            surname: lastName,
            nickname: native.username,
            displayName,
        },
        activityMessage: native.mood,
        locations,
    };
    return result;
}
// github:demurgos/skype-web-reversed -> jSkype/modelHelpers/contacts/dataMappers/contactToPerson.js
function contactToPerson(native) {
    const SUGGESTED_CONTACT_ACTIVITY_MESSAGE = "Skype";
    // TODO(demurgos): typedef
    // tslint:disable-next-line:typedef
    const authorizationStates = {
        UNKNOWN: "UNKNOWN",
        UNAUTHORIZED: "UNAUTHORIZED",
        PENDING_OUTGOING: "PENDING_OUTGOING",
        PENDING_INCOMING: "PENDING_INCOMING",
        AUTHORIZED: "AUTHORIZED",
        SUGGESTED: "SUGGESTED",
    };
    // TODO(demurgos): typedef
    // tslint:disable-next-line:typedef
    const showStrategies = {
        ALL: "ALL",
        AVAILABLE_ONLY: "AVAILABLE_ONLY",
        AGENTS_ONLY: "AGENTS_ONLY",
    };
    let activityMessage;
    if (native.suggested) {
        activityMessage = SUGGESTED_CONTACT_ACTIVITY_MESSAGE;
    }
    else {
        activityMessage = native.mood === undefined ? null : native.mood;
    }
    let capabilities;
    if (native.type === "agent") {
        capabilities = native.agent.capabilities;
    }
    else if (native.type === "pstn") {
        capabilities = ["audio.receive", "group.add"];
    }
    else {
        capabilities = [];
    }
    let authorizationState;
    if (native.authorized) {
        authorizationState = authorizationStates.AUTHORIZED;
    }
    else if (native.suggested) {
        authorizationState = authorizationStates.SUGGESTED;
    }
    else {
        authorizationState = authorizationStates.PENDING_OUTGOING;
    }
    // We can safely cast here because `mriTypeFromTypeName` tests the validity of the name.
    const type = mri_1.mriTypeFromTypeName(native.type);
    const typeKey = mri_1.mriTypeToTypeCode(type);
    const isAgent = native.type === "agent";
    let avatarUrl;
    if (typeof native.avatar_url === "string") {
        avatarUrl = ensureHttps(native.avatar_url);
        // TODO: ensure that the "cacheHeaders=1" queryString is there
    }
    else {
        avatarUrl = null;
    }
    const displayName = user_data_processor_1.sanitizeXml(native.display_name);
    let firstName = null;
    let lastName = null;
    if (native.name !== undefined && native.name.first !== undefined) {
        firstName = user_data_processor_1.sanitizeXml(native.name.first);
    }
    if (native.name !== undefined && native.name.surname !== undefined) {
        lastName = user_data_processor_1.sanitizeXml(native.name.surname);
    }
    const phoneNumbers = [];
    const locations = [];
    let result;
    result = {
        id: {
            id: native.id,
            typeKey,
            typeName: native.type,
            raw: `${typeKey}:${native.id}`,
        },
        avatarUrl,
        phones: phoneNumbers,
        name: {
            first: firstName,
            surname: lastName,
            nickname: native.id,
            displayName,
        },
        activityMessage,
        locations,
    };
    return result;
}
// github:demurgos/skype-web-reversed -> jSkype/modelHelpers/contacts/dataMappers/dataMaps.js
function phoneTypeNameToPhoneTypeKey(typeName) {
    switch (typeName) {
        case "Home":
            return "0";
        case "Work":
            return "1";
        case "Cell":
            return "2";
        case "Other":
            return "3";
        default:
            throw new incident_1.Incident("unknown-phone-type-name", { typeName }, `Unknwon phone type name ${typeName}`);
    }
}
// github:demurgos/skype-web-reversed -> jSkype/modelHelpers/contacts/dataMappers/dataMaps.js
function phoneTypeKeyToPhoneTypeName(typeKey) {
    switch (typeKey) {
        case "0":
            return "Home";
        case "1":
            return "Work";
        case "2":
            return "Cell";
        case "3":
            return "Other";
        default:
            throw new incident_1.Incident("unknown-phone-type-key", { typeCode: typeKey }, `Unknwon phone type key ${typeKey}`);
    }
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,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LENBQUM7UUFDYixLQUFLLE1BQU07WUFDVCxNQUFNLENBQUMsR0FBRyxDQUFDO1FBQ2IsS0FBSyxNQUFNO1lBQ1QsTUFBTSxDQUFDLEdBQUcsQ0FBQztRQUNiLEtBQUssT0FBTztZQUNWLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDYjtZQUNFLE1BQU0sSUFBSSxtQkFBUSxDQUNoQix5QkFBeUIsRUFDekIsRUFBQyxRQUFRLEVBQUMsRUFDViwyQkFBMkIsUUFBUSxFQUFFLENBQ3RDLENBQUM7SUFDTixDQUFDO0FBQ0gsQ0FBQztBQUVELDZGQUE2RjtBQUM3RixxQ0FBcUMsT0FBZTtJQUNsRCxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ2hCLEtBQUssR0FBRztZQUNOLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsS0FBSyxHQUFHO1lBQ04sTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixLQUFLLEdBQUc7WUFDTixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLEtBQUssR0FBRztZQUNOLE1BQU0sQ0FBQyxPQUFPLENBQUM7UUFDakI7WUFDRSxNQUFNLElBQUksbUJBQVEsQ0FDaEIsd0JBQXdCLEVBQ3hCLEVBQUMsUUFBUSxFQUFFLE9BQU8sRUFBQyxFQUNuQiwwQkFBMEIsT0FBTyxFQUFFLENBQ3BDLENBQUM7SUFDTixDQUFDO0FBQ0gsQ0FBQyIsImZpbGUiOiJ1dGlscy9mb3JtYXR0ZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5jaWRlbnQgfSBmcm9tIFwiaW5jaWRlbnRcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IENvbnRhY3QgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9hcGkvY29udGFjdFwiO1xuaW1wb3J0IHsgQ29udmVyc2F0aW9uLCBUaHJlYWRQcm9wZXJ0aWVzIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL2NvbnZlcnNhdGlvblwiO1xuaW1wb3J0IHsgQ29udGFjdCBhcyBOYXRpdmVDb250YWN0LCBTZWFyY2hDb250YWN0IGFzIE5hdGl2ZVNlYXJjaENvbnRhY3QgfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9uYXRpdmUtYXBpL2NvbnRhY3RcIjtcbmltcG9ydCB7XG4gIENvbnZlcnNhdGlvbiBhcyBOYXRpdmVDb252ZXJzYXRpb24sIFRocmVhZCBhcyBOYXRpdmVUaHJlYWQsXG4gIFRocmVhZE1lbWJlciBhcyBOYXRpdmVUaHJlYWRNZW1iZXIsXG59IGZyb20gXCIuLi9pbnRlcmZhY2VzL25hdGl2ZS1hcGkvY29udmVyc2F0aW9uXCI7XG5pbXBvcnQgeyBNcmlUeXBlLCBNcmlUeXBlQ29kZSwgbXJpVHlwZUZyb21UeXBlTmFtZSwgTXJpVHlwZU5hbWUsIG1yaVR5cGVUb1R5cGVDb2RlLCBtcmlUeXBlVG9UeXBlTmFtZSB9IGZyb20gXCIuLi9tcmlcIjtcbmltcG9ydCB7IHNhbml0aXplWG1sIH0gZnJvbSBcIi4vdXNlci1kYXRhLXByb2Nlc3NvclwiO1xuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0Q29udmVyc2F0aW9uKG5hdGl2ZTogTmF0aXZlQ29udmVyc2F0aW9uKTogQ29udmVyc2F0aW9uIHtcbiAgLy8gVE9ETzogcGFyc2UgaWRcbiAgaWYgKG5hdGl2ZS5pZC5pbmRleE9mKFwiMTk6XCIpID09PSAwKSB7IC8vIHRocmVhZFxuICAgIHJldHVybiBuYXRpdmU7XG4gIH0gZWxzZSB7IC8vIHByaXZhdGVcbiAgICBjb25zdCBjb250YWN0OiBzdHJpbmcgPSBuYXRpdmUuaWQ7XG4gICAgY29uc3QgcmVzdWx0OiBDb252ZXJzYXRpb24gPSBuYXRpdmU7XG4gICAgcmVzdWx0Lm1lbWJlcnMgPSBbY29udGFjdF07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VGhyZWFkKG5hdGl2ZTogTmF0aXZlVGhyZWFkKTogQ29udmVyc2F0aW9uIHtcbiAgY29uc3QgbWVtYmVySWRzOiBzdHJpbmdbXSA9IF8ubWFwKG5hdGl2ZS5tZW1iZXJzLCAoKG1lbWJlcjogTmF0aXZlVGhyZWFkTWVtYmVyKTogc3RyaW5nID0+IG1lbWJlci5pZCkpO1xuICBjb25zdCBwcm9wZXJ0aWVzOiBUaHJlYWRQcm9wZXJ0aWVzID0ge307XG5cbiAgaWYgKFwicHJvcGVydGllc1wiIGluIG5hdGl2ZSkge1xuICAgIGlmIChcInRvcGljXCIgaW4gbmF0aXZlLnByb3BlcnRpZXMpIHtcbiAgICAgIHByb3BlcnRpZXMudG9waWMgPSBuYXRpdmUucHJvcGVydGllcy50b3BpYztcbiAgICB9XG4gICAgaWYgKFwibGFzdGpvaW5hdFwiIGluIG5hdGl2ZS5wcm9wZXJ0aWVzKSB7XG4gICAgICBwcm9wZXJ0aWVzLnRvcGljID0gbmF0aXZlLnByb3BlcnRpZXMubGFzdGpvaW5hdDtcbiAgICB9XG4gICAgaWYgKFwidmVyc2lvblwiIGluIG5hdGl2ZS5wcm9wZXJ0aWVzKSB7XG4gICAgICBwcm9wZXJ0aWVzLnRvcGljID0gbmF0aXZlLnByb3BlcnRpZXMudmVyc2lvbjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIHRocmVhZFByb3BlcnRpZXM6IHByb3BlcnRpZXMsXG4gICAgaWQ6IG5hdGl2ZS5pZCxcbiAgICB0eXBlOiBuYXRpdmUudHlwZSxcbiAgICB2ZXJzaW9uOiBuYXRpdmUudmVyc2lvbixcbiAgICBtZW1iZXJzOiBtZW1iZXJJZHMsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRTZWFyY2hDb250YWN0KG5hdGl2ZTogTmF0aXZlU2VhcmNoQ29udGFjdCk6IENvbnRhY3Qge1xuICByZXR1cm4gc2VhcmNoQ29udGFjdFRvUGVyc29uKG5hdGl2ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRDb250YWN0KG5hdGl2ZTogTmF0aXZlQ29udGFjdCk6IENvbnRhY3Qge1xuICByZXR1cm4gY29udGFjdFRvUGVyc29uKG5hdGl2ZSk7XG59XG5cbi8vIGdpdGh1YjpkZW11cmdvcy9za3lwZS13ZWItcmV2ZXJzZWQgLT4galNreXBlL21vZGVsSGVscGVycy9jb250YWN0cy9kYXRhTWFwcGVycy9hZ2VudFRvUGVyc29uLmpzXG5mdW5jdGlvbiBhZ2VudFRvUGVyc29uKG5hdGl2ZTogYW55KTogYW55IHtcblxufVxuXG4vLyBUT0RPOiBjaGVjayB0aGF0IHRoZSB1cmkgdXNlcyB0aGUgSFRUUFMgcHJvdG9jb2xcbmZ1bmN0aW9uIGVuc3VyZUh0dHBzKHVyaTogc3RyaW5nKSB7XG4gIHJldHVybiB1cmk7XG59XG5cbmZ1bmN0aW9uIGRlZmluZSguLi5hcmdzOiBhbnlbXSkge1xuICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gc2VhcmNoQ29udGFjdFRvUGVyc29uKG5hdGl2ZTogTmF0aXZlU2VhcmNoQ29udGFjdCk6IENvbnRhY3Qge1xuICBsZXQgYXZhdGFyVXJsOiBzdHJpbmcgfCBudWxsO1xuXG4gIGlmICh0eXBlb2YgbmF0aXZlLmF2YXRhclVybCA9PT0gXCJzdHJpbmdcIikge1xuICAgIGF2YXRhclVybCA9IGVuc3VyZUh0dHBzKG5hdGl2ZS5hdmF0YXJVcmwpO1xuICAgIC8vIFRPRE86IGVuc3VyZSB0aGF0IHRoZSBcImNhY2hlSGVhZGVycz0xXCIgcXVlcnlTdHJpbmcgaXMgdGhlcmVcbiAgfSBlbHNlIHtcbiAgICBhdmF0YXJVcmwgPSBudWxsO1xuICB9XG4gIGNvbnN0IGRpc3BsYXlOYW1lOiBzdHJpbmcgPSBzYW5pdGl6ZVhtbChuYXRpdmUuZGlzcGxheW5hbWUpO1xuICBjb25zdCBmaXJzdE5hbWU6IHN0cmluZyB8IG51bGwgPSAobmF0aXZlLmZpcnN0bmFtZSAhPT0gdW5kZWZpbmVkKSA/IHNhbml0aXplWG1sKG5hdGl2ZS5maXJzdG5hbWUpIDogbnVsbDtcbiAgY29uc3QgbGFzdE5hbWU6IHN0cmluZyB8IG51bGwgPSAobmF0aXZlLmxhc3RuYW1lICE9PSB1bmRlZmluZWQpID8gc2FuaXRpemVYbWwobmF0aXZlLmxhc3RuYW1lKSA6IG51bGw7XG5cbiAgY29uc3QgcGhvbmVOdW1iZXJzOiBhbnlbXSA9IFtdO1xuICBjb25zdCBsb2NhdGlvbnM6IGFueVtdID0gW107XG4gIGNvbnN0IHR5cGU6IE1yaVR5cGUgPSBNcmlUeXBlLlNreXBlO1xuICBjb25zdCB0eXBlS2V5OiBNcmlUeXBlQ29kZSA9IG1yaVR5cGVUb1R5cGVDb2RlKHR5cGUpO1xuICBsZXQgcmVzdWx0OiBDb250YWN0O1xuICByZXN1bHQgPSB7XG4gICAgaWQ6IHtcbiAgICAgIGlkOiBuYXRpdmUudXNlcm5hbWUsXG4gICAgICB0eXBlS2V5LFxuICAgICAgdHlwZU5hbWU6IG1yaVR5cGVUb1R5cGVOYW1lKHR5cGUpLFxuICAgICAgcmF3OiBgJHt0eXBlS2V5fToke25hdGl2ZS51c2VybmFtZX1gLFxuICAgIH0sXG4gICAgZW1haWxzOiBuYXRpdmUuZW1haWxzLFxuICAgIGF2YXRhclVybCxcbiAgICBwaG9uZXM6IHBob25lTnVtYmVycyxcbiAgICBuYW1lOiB7XG4gICAgICBmaXJzdDogZmlyc3ROYW1lLFxuICAgICAgc3VybmFtZTogbGFzdE5hbWUsXG4gICAgICBuaWNrbmFtZTogbmF0aXZlLnVzZXJuYW1lLFxuICAgICAgZGlzcGxheU5hbWUsXG4gICAgfSxcbiAgICBhY3Rpdml0eU1lc3NhZ2U6IG5hdGl2ZS5tb29kLFxuICAgIGxvY2F0aW9ucyxcbiAgfTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gZ2l0aHViOmRlbXVyZ29zL3NreXBlLXdlYi1yZXZlcnNlZCAtPiBqU2t5cGUvbW9kZWxIZWxwZXJzL2NvbnRhY3RzL2RhdGFNYXBwZXJzL2NvbnRhY3RUb1BlcnNvbi5qc1xuZnVuY3Rpb24gY29udGFjdFRvUGVyc29uKG5hdGl2ZTogTmF0aXZlQ29udGFjdCk6IENvbnRhY3Qge1xuICBjb25zdCBTVUdHRVNURURfQ09OVEFDVF9BQ1RJVklUWV9NRVNTQUdFOiBzdHJpbmcgPSBcIlNreXBlXCI7XG5cbiAgLy8gVE9ETyhkZW11cmdvcyk6IHR5cGVkZWZcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOnR5cGVkZWZcbiAgY29uc3QgYXV0aG9yaXphdGlvblN0YXRlcyA9IHtcbiAgICBVTktOT1dOOiBcIlVOS05PV05cIixcbiAgICBVTkFVVEhPUklaRUQ6IFwiVU5BVVRIT1JJWkVEXCIsXG4gICAgUEVORElOR19PVVRHT0lORzogXCJQRU5ESU5HX09VVEdPSU5HXCIsXG4gICAgUEVORElOR19JTkNPTUlORzogXCJQRU5ESU5HX0lOQ09NSU5HXCIsXG4gICAgQVVUSE9SSVpFRDogXCJBVVRIT1JJWkVEXCIsXG4gICAgU1VHR0VTVEVEOiBcIlNVR0dFU1RFRFwiLFxuICB9O1xuXG4gIC8vIFRPRE8oZGVtdXJnb3MpOiB0eXBlZGVmXG4gIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTp0eXBlZGVmXG4gIGNvbnN0IHNob3dTdHJhdGVnaWVzID0ge1xuICAgIEFMTDogXCJBTExcIixcbiAgICBBVkFJTEFCTEVfT05MWTogXCJBVkFJTEFCTEVfT05MWVwiLFxuICAgIEFHRU5UU19PTkxZOiBcIkFHRU5UU19PTkxZXCIsXG4gIH07XG5cbiAgbGV0IGFjdGl2aXR5TWVzc2FnZTogc3RyaW5nIHwgbnVsbDtcbiAgaWYgKG5hdGl2ZS5zdWdnZXN0ZWQpIHtcbiAgICBhY3Rpdml0eU1lc3NhZ2UgPSBTVUdHRVNURURfQ09OVEFDVF9BQ1RJVklUWV9NRVNTQUdFO1xuICB9IGVsc2Uge1xuICAgIGFjdGl2aXR5TWVzc2FnZSA9IG5hdGl2ZS5tb29kID09PSB1bmRlZmluZWQgPyBudWxsIDogbmF0aXZlLm1vb2Q7XG4gIH1cblxuICBsZXQgY2FwYWJpbGl0aWVzOiBzdHJpbmdbXTtcbiAgaWYgKG5hdGl2ZS50eXBlID09PSBcImFnZW50XCIpIHtcbiAgICBjYXBhYmlsaXRpZXMgPSBuYXRpdmUuYWdlbnQuY2FwYWJpbGl0aWVzO1xuICB9IGVsc2UgaWYgKG5hdGl2ZS50eXBlID09PSBcInBzdG5cIikge1xuICAgIGNhcGFiaWxpdGllcyA9IFtcImF1ZGlvLnJlY2VpdmVcIiwgXCJncm91cC5hZGRcIl07XG4gIH0gZWxzZSB7XG4gICAgY2FwYWJpbGl0aWVzID0gW107XG4gIH1cblxuICBsZXQgYXV0aG9yaXphdGlvblN0YXRlOiBzdHJpbmc7XG4gIGlmIChuYXRpdmUuYXV0aG9yaXplZCkge1xuICAgIGF1dGhvcml6YXRpb25TdGF0ZSA9IGF1dGhvcml6YXRpb25TdGF0ZXMuQVVUSE9SSVpFRDtcbiAgfSBlbHNlIGlmIChuYXRpdmUuc3VnZ2VzdGVkKSB7XG4gICAgYXV0aG9yaXphdGlvblN0YXRlID0gYXV0aG9yaXphdGlvblN0YXRlcy5TVUdHRVNURUQ7XG4gIH0gZWxzZSB7XG4gICAgYXV0aG9yaXphdGlvblN0YXRlID0gYXV0aG9yaXphdGlvblN0YXRlcy5QRU5ESU5HX09VVEdPSU5HO1xuICB9XG5cbiAgLy8gV2UgY2FuIHNhZmVseSBjYXN0IGhlcmUgYmVjYXVzZSBgbXJpVHlwZUZyb21UeXBlTmFtZWAgdGVzdHMgdGhlIHZhbGlkaXR5IG9mIHRoZSBuYW1lLlxuICBjb25zdCB0eXBlOiBNcmlUeXBlID0gbXJpVHlwZUZyb21UeXBlTmFtZShuYXRpdmUudHlwZSBhcyBNcmlUeXBlTmFtZSk7XG4gIGNvbnN0IHR5cGVLZXk6IE1yaVR5cGVDb2RlID0gbXJpVHlwZVRvVHlwZUNvZGUodHlwZSk7XG4gIGNvbnN0IGlzQWdlbnQ6IGJvb2xlYW4gPSBuYXRpdmUudHlwZSA9PT0gXCJhZ2VudFwiO1xuXG4gIGxldCBhdmF0YXJVcmw6IHN0cmluZyB8IG51bGw7XG5cbiAgaWYgKHR5cGVvZiBuYXRpdmUuYXZhdGFyX3VybCA9PT0gXCJzdHJpbmdcIikge1xuICAgIGF2YXRhclVybCA9IGVuc3VyZUh0dHBzKG5hdGl2ZS5hdmF0YXJfdXJsKTtcbiAgICAvLyBUT0RPOiBlbnN1cmUgdGhhdCB0aGUgXCJjYWNoZUhlYWRlcnM9MVwiIHF1ZXJ5U3RyaW5nIGlzIHRoZXJlXG4gIH0gZWxzZSB7XG4gICAgYXZhdGFyVXJsID0gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRpc3BsYXlOYW1lOiBzdHJpbmcgPSBzYW5pdGl6ZVhtbChuYXRpdmUuZGlzcGxheV9uYW1lKTtcbiAgbGV0IGZpcnN0TmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGxldCBsYXN0TmFtZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIGlmIChuYXRpdmUubmFtZSAhPT0gdW5kZWZpbmVkICYmIG5hdGl2ZS5uYW1lLmZpcnN0ICE9PSB1bmRlZmluZWQpIHtcbiAgICBmaXJzdE5hbWUgPSBzYW5pdGl6ZVhtbChuYXRpdmUubmFtZS5maXJzdCk7XG4gIH1cbiAgaWYgKG5hdGl2ZS5uYW1lICE9PSB1bmRlZmluZWQgJiYgbmF0aXZlLm5hbWUuc3VybmFtZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbGFzdE5hbWUgPSBzYW5pdGl6ZVhtbChuYXRpdmUubmFtZS5zdXJuYW1lKTtcbiAgfVxuXG4gIGNvbnN0IHBob25lTnVtYmVyczogYW55W10gPSBbXTtcbiAgY29uc3QgbG9jYXRpb25zOiBhbnlbXSA9IFtdO1xuXG4gIGxldCByZXN1bHQ6IENvbnRhY3Q7XG4gIHJlc3VsdCA9IHtcbiAgICBpZDoge1xuICAgICAgaWQ6IG5hdGl2ZS5pZCxcbiAgICAgIHR5cGVLZXksXG4gICAgICB0eXBlTmFtZTogbmF0aXZlLnR5cGUsXG4gICAgICByYXc6IGAke3R5cGVLZXl9OiR7bmF0aXZlLmlkfWAsXG4gICAgfSxcbiAgICBhdmF0YXJVcmwsXG4gICAgcGhvbmVzOiBwaG9uZU51bWJlcnMsXG4gICAgbmFtZToge1xuICAgICAgZmlyc3Q6IGZpcnN0TmFtZSxcbiAgICAgIHN1cm5hbWU6IGxhc3ROYW1lLFxuICAgICAgbmlja25hbWU6IG5hdGl2ZS5pZCxcbiAgICAgIGRpc3BsYXlOYW1lLFxuICAgIH0sXG4gICAgYWN0aXZpdHlNZXNzYWdlLFxuICAgIGxvY2F0aW9ucyxcbiAgfTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLy8gZ2l0aHViOmRlbXVyZ29zL3NreXBlLXdlYi1yZXZlcnNlZCAtPiBqU2t5cGUvbW9kZWxIZWxwZXJzL2NvbnRhY3RzL2RhdGFNYXBwZXJzL2RhdGFNYXBzLmpzXG5mdW5jdGlvbiBwaG9uZVR5cGVOYW1lVG9QaG9uZVR5cGVLZXkodHlwZU5hbWU6IHN0cmluZykge1xuICBzd2l0Y2ggKHR5cGVOYW1lKSB7XG4gICAgY2FzZSBcIkhvbWVcIjpcbiAgICAgIHJldHVybiBcIjBcIjtcbiAgICBjYXNlIFwiV29ya1wiOlxuICAgICAgcmV0dXJuIFwiMVwiO1xuICAgIGNhc2UgXCJDZWxsXCI6XG4gICAgICByZXR1cm4gXCIyXCI7XG4gICAgY2FzZSBcIk90aGVyXCI6XG4gICAgICByZXR1cm4gXCIzXCI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBJbmNpZGVudChcbiAgICAgICAgXCJ1bmtub3duLXBob25lLXR5cGUtbmFtZVwiLFxuICAgICAgICB7dHlwZU5hbWV9LFxuICAgICAgICBgVW5rbndvbiBwaG9uZSB0eXBlIG5hbWUgJHt0eXBlTmFtZX1gLFxuICAgICAgKTtcbiAgfVxufVxuXG4vLyBnaXRodWI6ZGVtdXJnb3Mvc2t5cGUtd2ViLXJldmVyc2VkIC0+IGpTa3lwZS9tb2RlbEhlbHBlcnMvY29udGFjdHMvZGF0YU1hcHBlcnMvZGF0YU1hcHMuanNcbmZ1bmN0aW9uIHBob25lVHlwZUtleVRvUGhvbmVUeXBlTmFtZSh0eXBlS2V5OiBzdHJpbmcpIHtcbiAgc3dpdGNoICh0eXBlS2V5KSB7XG4gICAgY2FzZSBcIjBcIjpcbiAgICAgIHJldHVybiBcIkhvbWVcIjtcbiAgICBjYXNlIFwiMVwiOlxuICAgICAgcmV0dXJuIFwiV29ya1wiO1xuICAgIGNhc2UgXCIyXCI6XG4gICAgICByZXR1cm4gXCJDZWxsXCI7XG4gICAgY2FzZSBcIjNcIjpcbiAgICAgIHJldHVybiBcIk90aGVyXCI7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBJbmNpZGVudChcbiAgICAgICAgXCJ1bmtub3duLXBob25lLXR5cGUta2V5XCIsXG4gICAgICAgIHt0eXBlQ29kZTogdHlwZUtleX0sXG4gICAgICAgIGBVbmtud29uIHBob25lIHR5cGUga2V5ICR7dHlwZUtleX1gLFxuICAgICAgKTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIuLiJ9
