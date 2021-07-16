"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const tough_cookie_1 = __importDefault(require("tough-cookie"));
var SkypeToken;
(function (SkypeToken) {
    /**
     * Export a SkypeToken to a JSON-safe object.
     */
    function toJson(token) {
        return {
            value: token.value,
            expirationDate: token.expirationDate.toISOString(),
        };
    }
    SkypeToken.toJson = toJson;
    /**
     * Import a SkypeToken from a JSON-safe object.
     */
    function fromJson(token) {
        return {
            value: token.value,
            expirationDate: new Date(token.expirationDate),
        };
    }
    SkypeToken.fromJson = fromJson;
})(SkypeToken = exports.SkypeToken || (exports.SkypeToken = {}));
var RegistrationToken;
(function (RegistrationToken) {
    /**
     * Export a RegistrationToken to a JSON-safe object.
     */
    function toJson(token) {
        return {
            value: token.value,
            expirationDate: token.expirationDate.toISOString(),
            endpointId: token.endpointId,
            host: token.host,
            raw: token.raw,
        };
    }
    RegistrationToken.toJson = toJson;
    /**
     * Import a RegistrationToken from a JSON-safe object.
     */
    function fromJson(token) {
        return {
            value: token.value,
            expirationDate: new Date(token.expirationDate),
            endpointId: token.endpointId,
            host: token.host,
            raw: token.raw,
        };
    }
    RegistrationToken.fromJson = fromJson;
})(RegistrationToken = exports.RegistrationToken || (exports.RegistrationToken = {}));
var Context;
(function (Context) {
    function toJson(context) {
        return {
            username: context.username,
            cookies: new tough_cookie_1.default.CookieJar(context.cookies).serializeSync(),
            skypeToken: SkypeToken.toJson(context.skypeToken),
            registrationToken: RegistrationToken.toJson(context.registrationToken),
        };
    }
    Context.toJson = toJson;
    function fromJson(context) {
        const cookies = new tough_cookie_1.default.MemoryCookieStore();
        tough_cookie_1.default.CookieJar.deserializeSync(context.cookies, cookies);
        return {
            username: context.username,
            cookies,
            skypeToken: SkypeToken.fromJson(context.skypeToken),
            registrationToken: RegistrationToken.fromJson(context.registrationToken),
        };
    }
    Context.fromJson = fromJson;
})(Context = exports.Context || (exports.Context = {}));

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvaW50ZXJmYWNlcy9hcGkvY29udGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLGdFQUF1QztBQVV2QyxJQUFpQixVQUFVLENBNEIxQjtBQTVCRCxXQUFpQixVQUFVO0lBU3pCOztPQUVHO0lBQ0gsZ0JBQXVCLEtBQWlCO1FBQ3RDLE1BQU0sQ0FBQztZQUNMLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztZQUNsQixjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUU7U0FDbkQsQ0FBQztJQUNKLENBQUM7SUFMZSxpQkFBTSxTQUtyQixDQUFBO0lBRUQ7O09BRUc7SUFDSCxrQkFBeUIsS0FBVztRQUNsQyxNQUFNLENBQUM7WUFDTCxLQUFLLEVBQUUsS0FBSyxDQUFDLEtBQUs7WUFDbEIsY0FBYyxFQUFFLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUM7U0FDL0MsQ0FBQztJQUNKLENBQUM7SUFMZSxtQkFBUSxXQUt2QixDQUFBO0FBQ0gsQ0FBQyxFQTVCZ0IsVUFBVSxHQUFWLGtCQUFVLEtBQVYsa0JBQVUsUUE0QjFCO0FBaUJELElBQWlCLGlCQUFpQixDQXFDakM7QUFyQ0QsV0FBaUIsaUJBQWlCO0lBWWhDOztPQUVHO0lBQ0gsZ0JBQXVCLEtBQXdCO1FBQzdDLE1BQU0sQ0FBQztZQUNMLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztZQUNsQixjQUFjLEVBQUUsS0FBSyxDQUFDLGNBQWMsQ0FBQyxXQUFXLEVBQUU7WUFDbEQsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO1lBQzVCLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtZQUNoQixHQUFHLEVBQUUsS0FBSyxDQUFDLEdBQUc7U0FDZixDQUFDO0lBQ0osQ0FBQztJQVJlLHdCQUFNLFNBUXJCLENBQUE7SUFFRDs7T0FFRztJQUNILGtCQUF5QixLQUFXO1FBQ2xDLE1BQU0sQ0FBQztZQUNMLEtBQUssRUFBRSxLQUFLLENBQUMsS0FBSztZQUNsQixjQUFjLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGNBQWMsQ0FBQztZQUM5QyxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQVU7WUFDNUIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1lBQ2hCLEdBQUcsRUFBRSxLQUFLLENBQUMsR0FBRztTQUNmLENBQUM7SUFDSixDQUFDO0lBUmUsMEJBQVEsV0FRdkIsQ0FBQTtBQUNILENBQUMsRUFyQ2dCLGlCQUFpQixHQUFqQix5QkFBaUIsS0FBakIseUJBQWlCLFFBcUNqQztBQWFELElBQWlCLE9BQU8sQ0FpQ3ZCO0FBakNELFdBQWlCLE9BQU87SUFXdEIsZ0JBQXVCLE9BQWdCO1FBQ3JDLE1BQU0sQ0FBQztZQUNMLFFBQVEsRUFBRSxPQUFPLENBQUMsUUFBUTtZQUMxQixPQUFPLEVBQUUsSUFBSSxzQkFBVyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFO1lBQ25FLFVBQVUsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7WUFDakQsaUJBQWlCLEVBQUUsaUJBQWlCLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQztTQUN2RSxDQUFDO0lBQ0osQ0FBQztJQVBlLGNBQU0sU0FPckIsQ0FBQTtJQUVELGtCQUF5QixPQUFhO1FBQ3BDLE1BQU0sT0FBTyxHQUFrQyxJQUFJLHNCQUFXLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUdsRixzQkFBVyxDQUFDLFNBQVMsQ0FBQyxlQUFtQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFFckYsTUFBTSxDQUFDO1lBQ0wsUUFBUSxFQUFFLE9BQU8sQ0FBQyxRQUFRO1lBQzFCLE9BQU87WUFDUCxVQUFVLEVBQUUsVUFBVSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1lBQ25ELGlCQUFpQixFQUFFLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsaUJBQWlCLENBQUM7U0FDekUsQ0FBQztJQUNKLENBQUM7SUFaZSxnQkFBUSxXQVl2QixDQUFBO0FBQ0gsQ0FBQyxFQWpDZ0IsT0FBTyxHQUFQLGVBQU8sS0FBUCxlQUFPLFFBaUN2QiIsImZpbGUiOiJpbnRlcmZhY2VzL2FwaS9jb250ZXh0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHRvdWdoQ29va2llIGZyb20gXCJ0b3VnaC1jb29raWVcIjtcblxuLyoqXG4gKiBSZXByZXNlbnRzIHRoZSBPQXV0aCB0b2tlbiB1c2VkIGZvciBtb3N0IGNhbGxzIHRvIHRoZSBTa3lwZSBBUEkuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgU2t5cGVUb2tlbiB7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIGV4cGlyYXRpb25EYXRlOiBEYXRlO1xufVxuXG5leHBvcnQgbmFtZXNwYWNlIFNreXBlVG9rZW4ge1xuICAvKipcbiAgICogSlNPTi1zYWZlIHJlcHJlc2VudGF0aW9uIG9mIGBTa3lwZVRva2VuYCwgdXNlZCBmb3Igc2VyaWFsaXphdGlvbi5cbiAgICovXG4gIGV4cG9ydCBpbnRlcmZhY2UgSnNvbiB7XG4gICAgdmFsdWU6IHN0cmluZztcbiAgICBleHBpcmF0aW9uRGF0ZTogc3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9ydCBhIFNreXBlVG9rZW4gdG8gYSBKU09OLXNhZmUgb2JqZWN0LlxuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIHRvSnNvbih0b2tlbjogU2t5cGVUb2tlbik6IEpzb24ge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdG9rZW4udmFsdWUsXG4gICAgICBleHBpcmF0aW9uRGF0ZTogdG9rZW4uZXhwaXJhdGlvbkRhdGUudG9JU09TdHJpbmcoKSxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhIFNreXBlVG9rZW4gZnJvbSBhIEpTT04tc2FmZSBvYmplY3QuXG4gICAqL1xuICBleHBvcnQgZnVuY3Rpb24gZnJvbUpzb24odG9rZW46IEpzb24pOiBTa3lwZVRva2VuIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHRva2VuLnZhbHVlLFxuICAgICAgZXhwaXJhdGlvbkRhdGU6IG5ldyBEYXRlKHRva2VuLmV4cGlyYXRpb25EYXRlKSxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgT0F1dGggcmVnaXN0cmF0aW9uIHRva2VuLlxuICogSGVyZSBhcmUgc29tZSBvZiB0aGUgYWN0aW9ucyByZXF1aXJpbmcgYSByZWdpc3RyYXRpb24gdG9rZW46XG4gKiAtIHNldCBzdGF0dXNcbiAqIC0gc2VuZCBtZXNzYWdlXG4gKiAtIGdldCBjb252ZXJzYXRpb25zIGxpc3RcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBSZWdpc3RyYXRpb25Ub2tlbiB7XG4gIHZhbHVlOiBzdHJpbmc7XG4gIGV4cGlyYXRpb25EYXRlOiBEYXRlO1xuICBlbmRwb2ludElkOiBzdHJpbmc7XG4gIGhvc3Q6IHN0cmluZztcbiAgcmF3OiBzdHJpbmc7XG59XG5cbmV4cG9ydCBuYW1lc3BhY2UgUmVnaXN0cmF0aW9uVG9rZW4ge1xuICAvKipcbiAgICogSlNPTi1zYWZlIHJlcHJlc2VudGF0aW9uIG9mIGBSZWdpc3RyYXRpb25Ub2tlbmAsIHVzZWQgZm9yIHNlcmlhbGl6YXRpb24uXG4gICAqL1xuICBleHBvcnQgaW50ZXJmYWNlIEpzb24ge1xuICAgIHZhbHVlOiBzdHJpbmc7XG4gICAgZXhwaXJhdGlvbkRhdGU6IHN0cmluZztcbiAgICBlbmRwb2ludElkOiBzdHJpbmc7XG4gICAgaG9zdDogc3RyaW5nO1xuICAgIHJhdzogc3RyaW5nO1xuICB9XG5cbiAgLyoqXG4gICAqIEV4cG9ydCBhIFJlZ2lzdHJhdGlvblRva2VuIHRvIGEgSlNPTi1zYWZlIG9iamVjdC5cbiAgICovXG4gIGV4cG9ydCBmdW5jdGlvbiB0b0pzb24odG9rZW46IFJlZ2lzdHJhdGlvblRva2VuKTogSnNvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbHVlOiB0b2tlbi52YWx1ZSxcbiAgICAgIGV4cGlyYXRpb25EYXRlOiB0b2tlbi5leHBpcmF0aW9uRGF0ZS50b0lTT1N0cmluZygpLFxuICAgICAgZW5kcG9pbnRJZDogdG9rZW4uZW5kcG9pbnRJZCxcbiAgICAgIGhvc3Q6IHRva2VuLmhvc3QsXG4gICAgICByYXc6IHRva2VuLnJhdyxcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEltcG9ydCBhIFJlZ2lzdHJhdGlvblRva2VuIGZyb20gYSBKU09OLXNhZmUgb2JqZWN0LlxuICAgKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIGZyb21Kc29uKHRva2VuOiBKc29uKTogUmVnaXN0cmF0aW9uVG9rZW4ge1xuICAgIHJldHVybiB7XG4gICAgICB2YWx1ZTogdG9rZW4udmFsdWUsXG4gICAgICBleHBpcmF0aW9uRGF0ZTogbmV3IERhdGUodG9rZW4uZXhwaXJhdGlvbkRhdGUpLFxuICAgICAgZW5kcG9pbnRJZDogdG9rZW4uZW5kcG9pbnRJZCxcbiAgICAgIGhvc3Q6IHRva2VuLmhvc3QsXG4gICAgICByYXc6IHRva2VuLnJhdyxcbiAgICB9O1xuICB9XG59XG5cbi8qKlxuICogQVBJIGNvbnRleHQgKHN0YXRlKS5cbiAqL1xuLy8gVE9ETyhkZW11cmdvcyk6IFJlbmFtZSB0byBgU3RhdGVgIG9yIGV2ZW4gYEFwaVN0YXRlYCBzbyBpdCdzIGVhc2llciB0byB1bmRlcnN0YW5kIHRoZSBwdXJwb3NlIG9mIHRoaXMgaW50ZXJmYWNlLlxuZXhwb3J0IGludGVyZmFjZSBDb250ZXh0IHtcbiAgdXNlcm5hbWU6IHN0cmluZztcbiAgY29va2llczogdG91Z2hDb29raWUuU3RvcmU7XG4gIHNreXBlVG9rZW46IFNreXBlVG9rZW47XG4gIHJlZ2lzdHJhdGlvblRva2VuOiBSZWdpc3RyYXRpb25Ub2tlbjtcbn1cblxuZXhwb3J0IG5hbWVzcGFjZSBDb250ZXh0IHtcbiAgLyoqXG4gICAqIEpTT04tc2FmZSByZXByZXNlbnRhdGlvbiBvZiBgQ29udGV4dGAuXG4gICAqL1xuICBleHBvcnQgaW50ZXJmYWNlIEpzb24ge1xuICAgIHVzZXJuYW1lOiBzdHJpbmc7XG4gICAgY29va2llczogdG91Z2hDb29raWUuQ29va2llSmFyLlNlcmlhbGl6ZWQ7XG4gICAgc2t5cGVUb2tlbjogU2t5cGVUb2tlbi5Kc29uO1xuICAgIHJlZ2lzdHJhdGlvblRva2VuOiBSZWdpc3RyYXRpb25Ub2tlbi5Kc29uO1xuICB9XG5cbiAgZXhwb3J0IGZ1bmN0aW9uIHRvSnNvbihjb250ZXh0OiBDb250ZXh0KTogSnNvbiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXJuYW1lOiBjb250ZXh0LnVzZXJuYW1lLFxuICAgICAgY29va2llczogbmV3IHRvdWdoQ29va2llLkNvb2tpZUphcihjb250ZXh0LmNvb2tpZXMpLnNlcmlhbGl6ZVN5bmMoKSxcbiAgICAgIHNreXBlVG9rZW46IFNreXBlVG9rZW4udG9Kc29uKGNvbnRleHQuc2t5cGVUb2tlbiksXG4gICAgICByZWdpc3RyYXRpb25Ub2tlbjogUmVnaXN0cmF0aW9uVG9rZW4udG9Kc29uKGNvbnRleHQucmVnaXN0cmF0aW9uVG9rZW4pLFxuICAgIH07XG4gIH1cblxuICBleHBvcnQgZnVuY3Rpb24gZnJvbUpzb24oY29udGV4dDogSnNvbik6IENvbnRleHQge1xuICAgIGNvbnN0IGNvb2tpZXM6IHRvdWdoQ29va2llLk1lbW9yeUNvb2tpZVN0b3JlID0gbmV3IHRvdWdoQ29va2llLk1lbW9yeUNvb2tpZVN0b3JlKCk7XG4gICAgLy8gVE9ETzogU2VuZCBhIFBSIHRvIERlZmluaXRlbHlUeXBlZCB0byBmaXggdGhpc1xuICAgIHR5cGUgRGVzZXJpYWxpemVTeW5jID0gKGNvb2tpZXM6IHRvdWdoQ29va2llLkNvb2tpZUphci5TZXJpYWxpemVkLCBzdG9yZTogdG91Z2hDb29raWUuU3RvcmUpID0+IHZvaWQ7XG4gICAgKHRvdWdoQ29va2llLkNvb2tpZUphci5kZXNlcmlhbGl6ZVN5bmMgYXMgRGVzZXJpYWxpemVTeW5jKShjb250ZXh0LmNvb2tpZXMsIGNvb2tpZXMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHVzZXJuYW1lOiBjb250ZXh0LnVzZXJuYW1lLFxuICAgICAgY29va2llcyxcbiAgICAgIHNreXBlVG9rZW46IFNreXBlVG9rZW4uZnJvbUpzb24oY29udGV4dC5za3lwZVRva2VuKSxcbiAgICAgIHJlZ2lzdHJhdGlvblRva2VuOiBSZWdpc3RyYXRpb25Ub2tlbi5mcm9tSnNvbihjb250ZXh0LnJlZ2lzdHJhdGlvblRva2VuKSxcbiAgICB9O1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6Ii4uLy4uIn0=
