"use strict";
// import * as Bluebird from "bluebird";
// import * as _ from "lodash";
// import {Incident} from "incident";
//
// import * as io from "../interfaces/io";
// import {Conversation} from "../interfaces/api";
// import {Conversation as NativeConversation} from "../interfaces/native-api";
// import {ApiContext} from "../interfaces/api-context";
// import * as messagesUri from "../messages-uri";
// import {formatConversation} from "../utils/formatters";
//
// interface GetMessagesQuery {
//   startTime: number, // a timestamp ?
//   view: "msnp24Equivalent" | string;
//   targetType: string; // seen: Passport|Skype|Lync|Thread
// }
//
// export function getMessages (io: io.HttpIo, apiContext: ApiContext, conversationId: string): Bluebird<Message[]> {
//   return Bluebird
//     .try(() => {
//       const query: GetMessagesQuery = {
//         startTime: 0,
//         view: "msnp24Equivalent",
//         targetType: "Passport|Skype|Lync|Thread"
//       };
//
//       const requestOptions: io.GetOptions = {
//         uri: messagesUri.conversation(apiContext.registrationToken.host, messagesUri.DEFAULT_USER, conversationId),
//         jar: apiContext.cookieJar,
//         qs: query,
//         headers: {
//           "RegistrationToken": apiContext.registrationToken.raw
//         }
//       };
//       return io.get(requestOptions);
//     })
//     .then((res: io.Response) => {
//       if (res.statusCode !== 200) {
//         return Bluebird.reject(new Incident("net", "Unable to fetch conversations"));
//       }
//       const body: ConversationsBody = JSON.parse(res.body);
//       return _.map(body.conversations, formatConversation);
//     });
// }
//
// export default getMessages;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL2dldC1tZXNzYWdlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsd0NBQXdDO0FBQ3hDLCtCQUErQjtBQUMvQixxQ0FBcUM7QUFDckMsRUFBRTtBQUNGLDBDQUEwQztBQUMxQyxrREFBa0Q7QUFDbEQsK0VBQStFO0FBQy9FLHdEQUF3RDtBQUN4RCxrREFBa0Q7QUFDbEQsMERBQTBEO0FBQzFELEVBQUU7QUFDRiwrQkFBK0I7QUFDL0Isd0NBQXdDO0FBQ3hDLHVDQUF1QztBQUN2Qyw0REFBNEQ7QUFDNUQsSUFBSTtBQUNKLEVBQUU7QUFDRixxSEFBcUg7QUFDckgsb0JBQW9CO0FBQ3BCLG1CQUFtQjtBQUNuQiwwQ0FBMEM7QUFDMUMsd0JBQXdCO0FBQ3hCLG9DQUFvQztBQUNwQyxtREFBbUQ7QUFDbkQsV0FBVztBQUNYLEVBQUU7QUFDRixnREFBZ0Q7QUFDaEQsc0hBQXNIO0FBQ3RILHFDQUFxQztBQUNyQyxxQkFBcUI7QUFDckIscUJBQXFCO0FBQ3JCLGtFQUFrRTtBQUNsRSxZQUFZO0FBQ1osV0FBVztBQUNYLHVDQUF1QztBQUN2QyxTQUFTO0FBQ1Qsb0NBQW9DO0FBQ3BDLHNDQUFzQztBQUN0Qyx3RkFBd0Y7QUFDeEYsVUFBVTtBQUNWLDhEQUE4RDtBQUM5RCw4REFBOEQ7QUFDOUQsVUFBVTtBQUNWLElBQUk7QUFDSixFQUFFO0FBQ0YsOEJBQThCIiwiZmlsZSI6ImFwaS9nZXQtbWVzc2FnZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgKiBhcyBCbHVlYmlyZCBmcm9tIFwiYmx1ZWJpcmRcIjtcbi8vIGltcG9ydCAqIGFzIF8gZnJvbSBcImxvZGFzaFwiO1xuLy8gaW1wb3J0IHtJbmNpZGVudH0gZnJvbSBcImluY2lkZW50XCI7XG4vL1xuLy8gaW1wb3J0ICogYXMgaW8gZnJvbSBcIi4uL2ludGVyZmFjZXMvaW9cIjtcbi8vIGltcG9ydCB7Q29udmVyc2F0aW9ufSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9hcGlcIjtcbi8vIGltcG9ydCB7Q29udmVyc2F0aW9uIGFzIE5hdGl2ZUNvbnZlcnNhdGlvbn0gZnJvbSBcIi4uL2ludGVyZmFjZXMvbmF0aXZlLWFwaVwiO1xuLy8gaW1wb3J0IHtBcGlDb250ZXh0fSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9hcGktY29udGV4dFwiO1xuLy8gaW1wb3J0ICogYXMgbWVzc2FnZXNVcmkgZnJvbSBcIi4uL21lc3NhZ2VzLXVyaVwiO1xuLy8gaW1wb3J0IHtmb3JtYXRDb252ZXJzYXRpb259IGZyb20gXCIuLi91dGlscy9mb3JtYXR0ZXJzXCI7XG4vL1xuLy8gaW50ZXJmYWNlIEdldE1lc3NhZ2VzUXVlcnkge1xuLy8gICBzdGFydFRpbWU6IG51bWJlciwgLy8gYSB0aW1lc3RhbXAgP1xuLy8gICB2aWV3OiBcIm1zbnAyNEVxdWl2YWxlbnRcIiB8IHN0cmluZztcbi8vICAgdGFyZ2V0VHlwZTogc3RyaW5nOyAvLyBzZWVuOiBQYXNzcG9ydHxTa3lwZXxMeW5jfFRocmVhZFxuLy8gfVxuLy9cbi8vIGV4cG9ydCBmdW5jdGlvbiBnZXRNZXNzYWdlcyAoaW86IGlvLkh0dHBJbywgYXBpQ29udGV4dDogQXBpQ29udGV4dCwgY29udmVyc2F0aW9uSWQ6IHN0cmluZyk6IEJsdWViaXJkPE1lc3NhZ2VbXT4ge1xuLy8gICByZXR1cm4gQmx1ZWJpcmRcbi8vICAgICAudHJ5KCgpID0+IHtcbi8vICAgICAgIGNvbnN0IHF1ZXJ5OiBHZXRNZXNzYWdlc1F1ZXJ5ID0ge1xuLy8gICAgICAgICBzdGFydFRpbWU6IDAsXG4vLyAgICAgICAgIHZpZXc6IFwibXNucDI0RXF1aXZhbGVudFwiLFxuLy8gICAgICAgICB0YXJnZXRUeXBlOiBcIlBhc3Nwb3J0fFNreXBlfEx5bmN8VGhyZWFkXCJcbi8vICAgICAgIH07XG4vL1xuLy8gICAgICAgY29uc3QgcmVxdWVzdE9wdGlvbnM6IGlvLkdldE9wdGlvbnMgPSB7XG4vLyAgICAgICAgIHVyaTogbWVzc2FnZXNVcmkuY29udmVyc2F0aW9uKGFwaUNvbnRleHQucmVnaXN0cmF0aW9uVG9rZW4uaG9zdCwgbWVzc2FnZXNVcmkuREVGQVVMVF9VU0VSLCBjb252ZXJzYXRpb25JZCksXG4vLyAgICAgICAgIGphcjogYXBpQ29udGV4dC5jb29raWVKYXIsXG4vLyAgICAgICAgIHFzOiBxdWVyeSxcbi8vICAgICAgICAgaGVhZGVyczoge1xuLy8gICAgICAgICAgIFwiUmVnaXN0cmF0aW9uVG9rZW5cIjogYXBpQ29udGV4dC5yZWdpc3RyYXRpb25Ub2tlbi5yYXdcbi8vICAgICAgICAgfVxuLy8gICAgICAgfTtcbi8vICAgICAgIHJldHVybiBpby5nZXQocmVxdWVzdE9wdGlvbnMpO1xuLy8gICAgIH0pXG4vLyAgICAgLnRoZW4oKHJlczogaW8uUmVzcG9uc2UpID0+IHtcbi8vICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4vLyAgICAgICAgIHJldHVybiBCbHVlYmlyZC5yZWplY3QobmV3IEluY2lkZW50KFwibmV0XCIsIFwiVW5hYmxlIHRvIGZldGNoIGNvbnZlcnNhdGlvbnNcIikpO1xuLy8gICAgICAgfVxuLy8gICAgICAgY29uc3QgYm9keTogQ29udmVyc2F0aW9uc0JvZHkgPSBKU09OLnBhcnNlKHJlcy5ib2R5KTtcbi8vICAgICAgIHJldHVybiBfLm1hcChib2R5LmNvbnZlcnNhdGlvbnMsIGZvcm1hdENvbnZlcnNhdGlvbik7XG4vLyAgICAgfSk7XG4vLyB9XG4vL1xuLy8gZXhwb3J0IGRlZmF1bHQgZ2V0TWVzc2FnZXM7XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
