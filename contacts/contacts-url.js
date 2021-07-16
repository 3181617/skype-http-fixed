"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const url_1 = __importDefault(require("url"));
const CONTACTS_HOST = "contacts.skype.com";
function formatInvites(userId) {
    return url_1.default.format({
        protocol: "https",
        host: CONTACTS_HOST,
        pathname: path_1.default.posix.join("contacts", "v2", "users", userId, "invites"),
    });
}
exports.formatInvites = formatInvites;
function formatUser(userId) {
    return url_1.default.format({
        protocol: "https",
        host: CONTACTS_HOST,
        pathname: path_1.default.posix.join("contacts", "v2", "users", userId),
    });
}
exports.formatUser = formatUser;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvY29udGFjdHMvY29udGFjdHMtdXJsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBRUEsZ0RBQXdCO0FBQ3hCLDhDQUFzQjtBQUV0QixNQUFNLGFBQWEsR0FBVyxvQkFBb0IsQ0FBQztBQUVuRCx1QkFBOEIsTUFBYztJQUMxQyxNQUFNLENBQUMsYUFBRyxDQUFDLE1BQU0sQ0FBQztRQUNoQixRQUFRLEVBQUUsT0FBTztRQUNqQixJQUFJLEVBQUUsYUFBYTtRQUNuQixRQUFRLEVBQUUsY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQztLQUN4RSxDQUFDLENBQUM7QUFDTCxDQUFDO0FBTkQsc0NBTUM7QUFFRCxvQkFBMkIsTUFBYztJQUN2QyxNQUFNLENBQUMsYUFBRyxDQUFDLE1BQU0sQ0FBQztRQUNoQixRQUFRLEVBQUUsT0FBTztRQUNqQixJQUFJLEVBQUUsYUFBYTtRQUNuQixRQUFRLEVBQUUsY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDO0tBQzdELENBQUMsQ0FBQztBQUNMLENBQUM7QUFORCxnQ0FNQyIsImZpbGUiOiJjb250YWN0cy9jb250YWN0cy11cmwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBVcmwgfSBmcm9tIFwiLi4vdHlwZXMvdXJsXCI7XG5cbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgdXJsIGZyb20gXCJ1cmxcIjtcblxuY29uc3QgQ09OVEFDVFNfSE9TVDogc3RyaW5nID0gXCJjb250YWN0cy5za3lwZS5jb21cIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdEludml0ZXModXNlcklkOiBzdHJpbmcpOiBVcmwge1xuICByZXR1cm4gdXJsLmZvcm1hdCh7XG4gICAgcHJvdG9jb2w6IFwiaHR0cHNcIixcbiAgICBob3N0OiBDT05UQUNUU19IT1NULFxuICAgIHBhdGhuYW1lOiBwYXRoLnBvc2l4LmpvaW4oXCJjb250YWN0c1wiLCBcInYyXCIsIFwidXNlcnNcIiwgdXNlcklkLCBcImludml0ZXNcIiksXG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VXNlcih1c2VySWQ6IHN0cmluZyk6IFVybCB7XG4gIHJldHVybiB1cmwuZm9ybWF0KHtcbiAgICBwcm90b2NvbDogXCJodHRwc1wiLFxuICAgIGhvc3Q6IENPTlRBQ1RTX0hPU1QsXG4gICAgcGF0aG5hbWU6IHBhdGgucG9zaXguam9pbihcImNvbnRhY3RzXCIsIFwidjJcIiwgXCJ1c2Vyc1wiLCB1c2VySWQpLFxuICB9KTtcbn1cbiJdLCJzb3VyY2VSb290IjoiLi4ifQ==
