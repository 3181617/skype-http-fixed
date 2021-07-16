"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = __importDefault(require("request"));
/**
 * Converts implementation-independant IO options to the concrete
 * options used by the `request` library.
 *
 * @param ioOptions Implementation independent IO options
 * @returns {request.Options} Corresponding `request` options
 */
function asRequestOptions(ioOptions) {
    const result = Object.assign({}, ioOptions);
    if (ioOptions.queryString !== undefined) {
        delete result.queryString;
        result.qs = ioOptions.queryString;
    }
    if (ioOptions.cookies !== undefined) {
        delete result.cookies;
        result.jar = request_1.default.jar(ioOptions.cookies);
    }
    return result;
}
/**
 * Send a GET request
 *
 * @param options
 */
async function get(options) {
    return new Promise((resolve, reject) => {
        request_1.default.get(asRequestOptions(options), (error, response, body) => {
            if (error) {
                return reject(error);
            }
            if (response.statusCode === undefined) {
                return reject(new Error("Missing status code"));
            }
            const ioResponse = {
                statusCode: response.statusCode,
                body,
                headers: response.headers,
            };
            resolve(ioResponse);
        });
    });
}
exports.get = get;
/**
 * Send a POST request
 *
 * @param options
 */
async function post(options) {
    return new Promise((resolve, reject) => {
        request_1.default.post(asRequestOptions(options), (error, response, body) => {
            if (error) {
                return reject(error);
            }
            if (response.statusCode === undefined) {
                return reject(new Error("Missing status code"));
            }
            const ioResponse = {
                statusCode: response.statusCode,
                body,
                headers: response.headers,
            };
            resolve(ioResponse);
        });
    });
}
exports.post = post;
/**
 * Send a PUT request
 *
 * @param options
 */
async function put(options) {
    return new Promise((resolve, reject) => {
        request_1.default.put(asRequestOptions(options), (error, response, body) => {
            if (error) {
                return reject(error);
            }
            if (response.statusCode === undefined) {
                return reject(new Error("Missing status code"));
            }
            const ioResponse = {
                statusCode: response.statusCode,
                body,
                headers: response.headers,
            };
            resolve(ioResponse);
        });
    });
}
exports.put = put;
exports.requestIo = {
    get,
    post,
    put,
};

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QUMsSUFBSSxPQUFPLENBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDbEQsaUJBQU8sQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxFQUFFO1lBQy9ELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7Z0JBQ1YsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN2QixDQUFDO1lBQ0QsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQztZQUNsRCxDQUFDO1lBRUQsTUFBTSxVQUFVLEdBQWdCO2dCQUM5QixVQUFVLEVBQUUsUUFBUSxDQUFDLFVBQVU7Z0JBQy9CLElBQUk7Z0JBQ0osT0FBTyxFQUFFLFFBQVEsQ0FBQyxPQUFPO2FBQzFCLENBQUM7WUFFRixPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFuQkQsa0JBbUJDO0FBRVksUUFBQSxTQUFTLEdBQWM7SUFDbEMsR0FBRztJQUNILElBQUk7SUFDSixHQUFHO0NBQ0osQ0FBQyIsImZpbGUiOiJyZXF1ZXN0LWlvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlcXVlc3QgZnJvbSBcInJlcXVlc3RcIjtcbmltcG9ydCAqIGFzIGlvIGZyb20gXCIuL2ludGVyZmFjZXMvaHR0cC1pb1wiO1xuXG4vKipcbiAqIENvbnZlcnRzIGltcGxlbWVudGF0aW9uLWluZGVwZW5kYW50IElPIG9wdGlvbnMgdG8gdGhlIGNvbmNyZXRlXG4gKiBvcHRpb25zIHVzZWQgYnkgdGhlIGByZXF1ZXN0YCBsaWJyYXJ5LlxuICpcbiAqIEBwYXJhbSBpb09wdGlvbnMgSW1wbGVtZW50YXRpb24gaW5kZXBlbmRlbnQgSU8gb3B0aW9uc1xuICogQHJldHVybnMge3JlcXVlc3QuT3B0aW9uc30gQ29ycmVzcG9uZGluZyBgcmVxdWVzdGAgb3B0aW9uc1xuICovXG5mdW5jdGlvbiBhc1JlcXVlc3RPcHRpb25zKGlvT3B0aW9uczogaW8uR2V0T3B0aW9ucyB8IGlvLlBvc3RPcHRpb25zIHwgaW8uUHV0T3B0aW9ucyk6IHJlcXVlc3QuT3B0aW9ucyB7XG4gIGNvbnN0IHJlc3VsdDogcmVxdWVzdC5PcHRpb25zID0gey4uLjxhbnk+IGlvT3B0aW9uc307XG4gIGlmIChpb09wdGlvbnMucXVlcnlTdHJpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGRlbGV0ZSAocmVzdWx0IGFzIGFueSkucXVlcnlTdHJpbmc7XG4gICAgcmVzdWx0LnFzID0gaW9PcHRpb25zLnF1ZXJ5U3RyaW5nO1xuICB9XG4gIGlmIChpb09wdGlvbnMuY29va2llcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgZGVsZXRlIChyZXN1bHQgYXMgYW55KS5jb29raWVzO1xuICAgIHJlc3VsdC5qYXIgPSByZXF1ZXN0Lmphcihpb09wdGlvbnMuY29va2llcyk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBTZW5kIGEgR0VUIHJlcXVlc3RcbiAqXG4gKiBAcGFyYW0gb3B0aW9uc1xuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0KG9wdGlvbnM6IGlvLkdldE9wdGlvbnMpOiBQcm9taXNlPGlvLlJlc3BvbnNlPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxpby5SZXNwb25zZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHJlcXVlc3QuZ2V0KGFzUmVxdWVzdE9wdGlvbnMob3B0aW9ucyksIChlcnJvciwgcmVzcG9uc2UsIGJvZHkpID0+IHtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKTtcbiAgICAgIH1cbiAgICAgIGlmIChyZXNwb25zZS5zdGF0dXNDb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChuZXcgRXJyb3IoXCJNaXNzaW5nIHN0YXR1cyBjb2RlXCIpKTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW9SZXNwb25zZTogaW8uUmVzcG9uc2UgPSB7XG4gICAgICAgIHN0YXR1c0NvZGU6IHJlc3BvbnNlLnN0YXR1c0NvZGUsXG4gICAgICAgIGJvZHksXG4gICAgICAgIGhlYWRlcnM6IHJlc3BvbnNlLmhlYWRlcnMsXG4gICAgICB9O1xuXG4gICAgICByZXNvbHZlKGlvUmVzcG9uc2UpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBTZW5kIGEgUE9TVCByZXF1ZXN0XG4gKlxuICogQHBhcmFtIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHBvc3Qob3B0aW9uczogaW8uUG9zdE9wdGlvbnMpOiBQcm9taXNlPGlvLlJlc3BvbnNlPiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZTxpby5SZXNwb25zZT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHJlcXVlc3QucG9zdChhc1JlcXVlc3RPcHRpb25zKG9wdGlvbnMpLCAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcik7XG4gICAgICB9XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTWlzc2luZyBzdGF0dXMgY29kZVwiKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlvUmVzcG9uc2U6IGlvLlJlc3BvbnNlID0ge1xuICAgICAgICBzdGF0dXNDb2RlOiByZXNwb25zZS5zdGF0dXNDb2RlLFxuICAgICAgICBib2R5LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgfTtcblxuICAgICAgcmVzb2x2ZShpb1Jlc3BvbnNlKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogU2VuZCBhIFBVVCByZXF1ZXN0XG4gKlxuICogQHBhcmFtIG9wdGlvbnNcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHB1dChvcHRpb25zOiBpby5QdXRPcHRpb25zKTogUHJvbWlzZTxpby5SZXNwb25zZT4ge1xuICByZXR1cm4gbmV3IFByb21pc2U8aW8uUmVzcG9uc2U+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICByZXF1ZXN0LnB1dChhc1JlcXVlc3RPcHRpb25zKG9wdGlvbnMpLCAoZXJyb3IsIHJlc3BvbnNlLCBib2R5KSA9PiB7XG4gICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcik7XG4gICAgICB9XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzQ29kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiByZWplY3QobmV3IEVycm9yKFwiTWlzc2luZyBzdGF0dXMgY29kZVwiKSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGlvUmVzcG9uc2U6IGlvLlJlc3BvbnNlID0ge1xuICAgICAgICBzdGF0dXNDb2RlOiByZXNwb25zZS5zdGF0dXNDb2RlLFxuICAgICAgICBib2R5LFxuICAgICAgICBoZWFkZXJzOiByZXNwb25zZS5oZWFkZXJzLFxuICAgICAgfTtcblxuICAgICAgcmVzb2x2ZShpb1Jlc3BvbnNlKTtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBjb25zdCByZXF1ZXN0SW86IGlvLkh0dHBJbyA9IHtcbiAgZ2V0LFxuICBwb3N0LFxuICBwdXQsXG59O1xuIl0sInNvdXJjZVJvb3QiOiIifQ==
