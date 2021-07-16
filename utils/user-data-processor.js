"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
// github:demurgos/skype-web-reversed -> utils/people/userDataProcessor.js
function sanitizeXml(xmlString) {
    return lodash_1.default.isString(xmlString) ? lodash_1.default.escape(xmlString) : "";
}
exports.sanitizeXml = sanitizeXml;
// github:demurgos/skype-web-reversed -> utils/people/userDataProcessor.js
function sanitize(str) {
    return String(str); // TODO!
    // if (_.isString(str)) {
    //   var t = str,
    //     u = i.build(r);
    //   if (str.match(o) === null) {
    //     var a = s.escapeIncomingHTML(str);
    //     t = u.encode(a, !1);
    //   }
    //   return s.escapeIncomingHTML(u.decode(t));
    // }
    // return "";
}
exports.sanitize = sanitize;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvdXRpbHMvdXNlci1kYXRhLXByb2Nlc3Nvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUF1QjtBQUV2QiwwRUFBMEU7QUFDMUUscUJBQTRCLFNBQWlCO0lBQzNDLE1BQU0sQ0FBQyxnQkFBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsZ0JBQUMsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztBQUMxRCxDQUFDO0FBRkQsa0NBRUM7QUFFRCwwRUFBMEU7QUFDMUUsa0JBQXlCLEdBQVc7SUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFFBQVE7SUFDNUIseUJBQXlCO0lBQ3pCLGlCQUFpQjtJQUNqQixzQkFBc0I7SUFDdEIsaUNBQWlDO0lBQ2pDLHlDQUF5QztJQUN6QywyQkFBMkI7SUFDM0IsTUFBTTtJQUNOLDhDQUE4QztJQUM5QyxJQUFJO0lBQ0osYUFBYTtBQUNmLENBQUM7QUFaRCw0QkFZQyIsImZpbGUiOiJ1dGlscy91c2VyLWRhdGEtcHJvY2Vzc29yLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IF8gZnJvbSBcImxvZGFzaFwiO1xuXG4vLyBnaXRodWI6ZGVtdXJnb3Mvc2t5cGUtd2ViLXJldmVyc2VkIC0+IHV0aWxzL3Blb3BsZS91c2VyRGF0YVByb2Nlc3Nvci5qc1xuZXhwb3J0IGZ1bmN0aW9uIHNhbml0aXplWG1sKHhtbFN0cmluZzogc3RyaW5nKSB7XG4gIHJldHVybiBfLmlzU3RyaW5nKHhtbFN0cmluZykgPyBfLmVzY2FwZSh4bWxTdHJpbmcpIDogXCJcIjtcbn1cblxuLy8gZ2l0aHViOmRlbXVyZ29zL3NreXBlLXdlYi1yZXZlcnNlZCAtPiB1dGlscy9wZW9wbGUvdXNlckRhdGFQcm9jZXNzb3IuanNcbmV4cG9ydCBmdW5jdGlvbiBzYW5pdGl6ZShzdHI6IHN0cmluZykge1xuICByZXR1cm4gU3RyaW5nKHN0cik7IC8vIFRPRE8hXG4gIC8vIGlmIChfLmlzU3RyaW5nKHN0cikpIHtcbiAgLy8gICB2YXIgdCA9IHN0cixcbiAgLy8gICAgIHUgPSBpLmJ1aWxkKHIpO1xuICAvLyAgIGlmIChzdHIubWF0Y2gobykgPT09IG51bGwpIHtcbiAgLy8gICAgIHZhciBhID0gcy5lc2NhcGVJbmNvbWluZ0hUTUwoc3RyKTtcbiAgLy8gICAgIHQgPSB1LmVuY29kZShhLCAhMSk7XG4gIC8vICAgfVxuICAvLyAgIHJldHVybiBzLmVzY2FwZUluY29taW5nSFRNTCh1LmRlY29kZSh0KSk7XG4gIC8vIH1cbiAgLy8gcmV0dXJuIFwiXCI7XG59XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
