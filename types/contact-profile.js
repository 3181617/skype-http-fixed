"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const case_style_1 = require("kryo/case-style");
const array_1 = require("kryo/types/array");
const document_1 = require("kryo/types/document");
const ucs2_string_1 = require("kryo/types/ucs2-string");
const iso_date_1 = require("./iso-date");
const location_1 = require("./location");
const name_1 = require("./name");
const phone_1 = require("./phone");
const url_1 = require("./url");
exports.$ContactProfile = new document_1.DocumentType({
    properties: {
        avatarUrl: { type: url_1.$Url, optional: true },
        birthday: { type: iso_date_1.$IsoDate, optional: true },
        gender: { type: new ucs2_string_1.Ucs2StringType({ maxLength: Infinity }), optional: true },
        locations: { type: new array_1.ArrayType({ itemType: location_1.$Location, maxLength: Infinity }), optional: true },
        phones: { type: new array_1.ArrayType({ itemType: phone_1.$Phone, maxLength: Infinity }), optional: true },
        mood: { type: new ucs2_string_1.Ucs2StringType({ maxLength: Infinity }), optional: true },
        name: { type: name_1.$Name, optional: true },
        about: { type: new ucs2_string_1.Ucs2StringType({ maxLength: Infinity }), optional: true },
        website: { type: new ucs2_string_1.Ucs2StringType({ maxLength: Infinity }), optional: true },
        language: { type: new ucs2_string_1.Ucs2StringType({ maxLength: Infinity }), optional: true },
    },
    rename: case_style_1.CaseStyle.SnakeCase,
    ignoreExtraKeys: true,
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvdHlwZXMvY29udGFjdC1wcm9maWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0RBQTRDO0FBQzVDLDRDQUE2QztBQUM3QyxrREFBbUQ7QUFDbkQsd0RBQXdEO0FBQ3hELHlDQUErQztBQUMvQyx5Q0FBaUQ7QUFDakQsaUNBQXFDO0FBQ3JDLG1DQUF3QztBQUN4QywrQkFBa0M7QUEyQ3JCLFFBQUEsZUFBZSxHQUFpQyxJQUFJLHVCQUFZLENBQWlCO0lBQzVGLFVBQVUsRUFBRTtRQUNWLFNBQVMsRUFBRSxFQUFDLElBQUksRUFBRSxVQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztRQUN2QyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsbUJBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1FBQzFDLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLDRCQUFjLENBQUMsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1FBQ3pFLFNBQVMsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLGlCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsb0JBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1FBQzVGLE1BQU0sRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLGlCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsY0FBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7UUFDdEYsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksNEJBQWMsQ0FBQyxFQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7UUFDdkUsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLFlBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1FBQ25DLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLDRCQUFjLENBQUMsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1FBQ3hFLE9BQU8sRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLDRCQUFjLENBQUMsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1FBQzFFLFFBQVEsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLDRCQUFjLENBQUMsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO0tBQzVFO0lBQ0QsTUFBTSxFQUFFLHNCQUFTLENBQUMsU0FBUztJQUMzQixlQUFlLEVBQUUsSUFBSTtDQUN0QixDQUFDLENBQUMiLCJmaWxlIjoidHlwZXMvY29udGFjdC1wcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2FzZVN0eWxlIH0gZnJvbSBcImtyeW8vY2FzZS1zdHlsZVwiO1xuaW1wb3J0IHsgQXJyYXlUeXBlIH0gZnJvbSBcImtyeW8vdHlwZXMvYXJyYXlcIjtcbmltcG9ydCB7IERvY3VtZW50VHlwZSB9IGZyb20gXCJrcnlvL3R5cGVzL2RvY3VtZW50XCI7XG5pbXBvcnQgeyBVY3MyU3RyaW5nVHlwZSB9IGZyb20gXCJrcnlvL3R5cGVzL3VjczItc3RyaW5nXCI7XG5pbXBvcnQgeyAkSXNvRGF0ZSwgSXNvRGF0ZSB9IGZyb20gXCIuL2lzby1kYXRlXCI7XG5pbXBvcnQgeyAkTG9jYXRpb24sIExvY2F0aW9uIH0gZnJvbSBcIi4vbG9jYXRpb25cIjtcbmltcG9ydCB7ICROYW1lLCBOYW1lIH0gZnJvbSBcIi4vbmFtZVwiO1xuaW1wb3J0IHsgJFBob25lLCBQaG9uZSB9IGZyb20gXCIuL3Bob25lXCI7XG5pbXBvcnQgeyAkVXJsLCBVcmwgfSBmcm9tIFwiLi91cmxcIjtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcHJvZmlsZSByZXR1cm5lZCBieSB0aGUgY29udGFjdCBBUEkgdjIgKGNvbnRhY3RzLnNreXBlLmNvbS9jb250YWN0cy92MikuXG4gKiBJdCBpcyBwb3NzaWJsZSBmb3IgYSBwcm9maWxlIHRvIG9ubHkgY29udGFpbiB0aGUgbmFtZSAoYDI4OmNvbmNpZXJnZWAgZm9yIGEgbmV3bHkgY3JlYXRlIHVzZXIpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGFjdFByb2ZpbGUge1xuICAvKipcbiAgICogRXhhbXBsZXM6XG4gICAqIC0gYGh0dHBzOi8vYXZhdGFyLnNreXBlLmNvbS92MS9hdmF0YXJzLzp1c2VySWQ/YXV0aF9rZXk9MTYwMTYzMzI3M2AgKHRoZSBhdXRoS2V5IGNhbiBiZSBuZWdhdGl2ZSlcbiAgICogLSBgaHR0cHM6Ly9hdmF0YXIuc2t5cGUuY29tL3YxL2F2YXRhcnMvOnVzZXJJZC9wdWJsaWNgXG4gICAqIC0gYGh0dHBzOi8vYXo3MDUxODMudm8ubXNlY25kLm5ldC9kYW0vc2t5cGUvbWVkaWEvY29uY2llcmdlLWFzc2V0cy9hdmF0YXIvYXZhdGFyY25zcmctMTQ0LnBuZ2BcbiAgICovXG4gIGF2YXRhclVybD86IFVybDtcbiAgYmlydGhkYXk/OiBJc29EYXRlO1xuICAvKipcbiAgICogYFwibWFsZVwiIHwgXCJmZW1hbGVcImBcbiAgICovXG4gIGdlbmRlcj86IHN0cmluZztcbiAgbG9jYXRpb25zPzogTG9jYXRpb25bXTtcbiAgcGhvbmVzPzogUGhvbmVbXTtcbiAgLyoqXG4gICAqIENhbiBjb250YWluIHRhZ3MuXG4gICAqIEV4YW1wbGVzOlxuICAgKiAtIGBcIjxzcyB0eXBlPVxcXCJtdXNpY1xcXCI+KG11c2ljKTwvc3M+IFJpY2sgQXN0bGV5IC0gTmV2ZXIgR29ubmEgR2l2ZSBZb3UgVXBcImBcbiAgICogLSBgXCJGb28gJmFtcDsgYmFyXCJgXG4gICAqL1xuICBtb29kPzogc3RyaW5nO1xuICBuYW1lPzogTmFtZTtcbiAgYWJvdXQ/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIFByb2JhYmx5IGFsd2F5cyBhbiBVUkxcbiAgICogRXhhbXBsZTogYFwiaHR0cHM6Ly9nby5za3lwZS5jb20vZmFxLnNreXBlLmJvdFwiYFxuICAgKi9cbiAgd2Vic2l0ZT86IHN0cmluZztcblxuICAvKipcbiAgICogYFwiZW5cIiB8IFwiZnJcImBcbiAgICovXG4gIGxhbmd1YWdlPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY29uc3QgJENvbnRhY3RQcm9maWxlOiBEb2N1bWVudFR5cGU8Q29udGFjdFByb2ZpbGU+ID0gbmV3IERvY3VtZW50VHlwZTxDb250YWN0UHJvZmlsZT4oe1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgYXZhdGFyVXJsOiB7dHlwZTogJFVybCwgb3B0aW9uYWw6IHRydWV9LFxuICAgIGJpcnRoZGF5OiB7dHlwZTogJElzb0RhdGUsIG9wdGlvbmFsOiB0cnVlfSxcbiAgICBnZW5kZXI6IHt0eXBlOiBuZXcgVWNzMlN0cmluZ1R5cGUoe21heExlbmd0aDogSW5maW5pdHl9KSwgb3B0aW9uYWw6IHRydWV9LFxuICAgIGxvY2F0aW9uczoge3R5cGU6IG5ldyBBcnJheVR5cGUoe2l0ZW1UeXBlOiAkTG9jYXRpb24sIG1heExlbmd0aDogSW5maW5pdHl9KSwgb3B0aW9uYWw6IHRydWV9LFxuICAgIHBob25lczoge3R5cGU6IG5ldyBBcnJheVR5cGUoe2l0ZW1UeXBlOiAkUGhvbmUsIG1heExlbmd0aDogSW5maW5pdHl9KSwgb3B0aW9uYWw6IHRydWV9LFxuICAgIG1vb2Q6IHt0eXBlOiBuZXcgVWNzMlN0cmluZ1R5cGUoe21heExlbmd0aDogSW5maW5pdHl9KSwgb3B0aW9uYWw6IHRydWV9LFxuICAgIG5hbWU6IHt0eXBlOiAkTmFtZSwgb3B0aW9uYWw6IHRydWV9LFxuICAgIGFib3V0OiB7dHlwZTogbmV3IFVjczJTdHJpbmdUeXBlKHttYXhMZW5ndGg6IEluZmluaXR5fSksIG9wdGlvbmFsOiB0cnVlfSxcbiAgICB3ZWJzaXRlOiB7dHlwZTogbmV3IFVjczJTdHJpbmdUeXBlKHttYXhMZW5ndGg6IEluZmluaXR5fSksIG9wdGlvbmFsOiB0cnVlfSxcbiAgICBsYW5ndWFnZToge3R5cGU6IG5ldyBVY3MyU3RyaW5nVHlwZSh7bWF4TGVuZ3RoOiBJbmZpbml0eX0pLCBvcHRpb25hbDogdHJ1ZX0sXG4gIH0sXG4gIHJlbmFtZTogQ2FzZVN0eWxlLlNuYWtlQ2FzZSxcbiAgaWdub3JlRXh0cmFLZXlzOiB0cnVlLFxufSk7XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
