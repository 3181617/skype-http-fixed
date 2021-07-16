"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const case_style_1 = require("kryo/case-style");
const array_1 = require("kryo/types/array");
const boolean_1 = require("kryo/types/boolean");
const date_1 = require("kryo/types/date");
const document_1 = require("kryo/types/document");
const json_1 = require("kryo/types/json");
const ucs2_string_1 = require("kryo/types/ucs2-string");
const agent_1 = require("./agent");
const contact_profile_1 = require("./contact-profile");
const display_name_1 = require("./display-name");
const display_name_source_1 = require("./display-name-source");
const mri_key_1 = require("./mri-key");
const phone_1 = require("./phone");
const relationship_history_1 = require("./relationship-history");
exports.$Contact = new document_1.DocumentType({
    properties: {
        personId: { type: mri_key_1.$MriKey },
        mri: { type: mri_key_1.$MriKey },
        displayName: { type: display_name_1.$DisplayName },
        displayNameSource: { type: display_name_source_1.$DisplayNameSource },
        phones: { type: new array_1.ArrayType({ itemType: phone_1.$Phone, maxLength: Infinity }), optional: true },
        profile: { type: contact_profile_1.$ContactProfile },
        agent: { type: agent_1.$Agent, optional: true },
        authorized: { type: new boolean_1.BooleanType() },
        authCertificate: { type: new ucs2_string_1.Ucs2StringType({ maxLength: Infinity }), optional: true },
        blocked: { type: new boolean_1.BooleanType() },
        creationTime: { type: new date_1.DateType() },
        relationshipHistory: { type: relationship_history_1.$RelationshipHistory, optional: true },
        suggested: { type: new boolean_1.BooleanType(), optional: true },
        phoneHashes: { type: new array_1.ArrayType({ itemType: new json_1.JsonType(), maxLength: Infinity }), optional: true },
    },
    rename: case_style_1.CaseStyle.SnakeCase,
    ignoreExtraKeys: true,
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvdHlwZXMvY29udGFjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUE0QztBQUM1Qyw0Q0FBNkM7QUFDN0MsZ0RBQWlEO0FBQ2pELDBDQUEyQztBQUMzQyxrREFBbUQ7QUFDbkQsMENBQTJDO0FBQzNDLHdEQUF3RDtBQUN4RCxtQ0FBd0M7QUFDeEMsdURBQW9FO0FBQ3BFLGlEQUEyRDtBQUMzRCwrREFBOEU7QUFDOUUsdUNBQTRDO0FBQzVDLG1DQUF3QztBQUN4QyxpRUFBbUY7QUF5Q3RFLFFBQUEsUUFBUSxHQUEwQixJQUFJLHVCQUFZLENBQVU7SUFDdkUsVUFBVSxFQUFFO1FBQ1YsUUFBUSxFQUFFLEVBQUMsSUFBSSxFQUFFLGlCQUFPLEVBQUM7UUFDekIsR0FBRyxFQUFFLEVBQUMsSUFBSSxFQUFFLGlCQUFPLEVBQUM7UUFDcEIsV0FBVyxFQUFFLEVBQUMsSUFBSSxFQUFFLDJCQUFZLEVBQUM7UUFDakMsaUJBQWlCLEVBQUUsRUFBQyxJQUFJLEVBQUUsd0NBQWtCLEVBQUM7UUFDN0MsTUFBTSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUksaUJBQVMsQ0FBQyxFQUFDLFFBQVEsRUFBRSxjQUFNLEVBQUUsU0FBUyxFQUFFLFFBQVEsRUFBQyxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBQztRQUN0RixPQUFPLEVBQUUsRUFBQyxJQUFJLEVBQUUsaUNBQWUsRUFBQztRQUNoQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsY0FBTSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUM7UUFDckMsVUFBVSxFQUFFLEVBQUMsSUFBSSxFQUFFLElBQUkscUJBQVcsRUFBRSxFQUFDO1FBQ3JDLGVBQWUsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLDRCQUFjLENBQUMsRUFBQyxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1FBQ2xGLE9BQU8sRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLHFCQUFXLEVBQUUsRUFBQztRQUNsQyxZQUFZLEVBQUUsRUFBQyxJQUFJLEVBQUUsSUFBSSxlQUFRLEVBQUUsRUFBQztRQUNwQyxtQkFBbUIsRUFBRSxFQUFDLElBQUksRUFBRSwyQ0FBb0IsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1FBQ2pFLFNBQVMsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLHFCQUFXLEVBQUUsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO1FBQ3BELFdBQVcsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLGlCQUFTLENBQUMsRUFBQyxRQUFRLEVBQUUsSUFBSSxlQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFDO0tBQ3BHO0lBQ0QsTUFBTSxFQUFFLHNCQUFTLENBQUMsU0FBUztJQUMzQixlQUFlLEVBQUUsSUFBSTtDQUN0QixDQUFDLENBQUMiLCJmaWxlIjoidHlwZXMvY29udGFjdC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENhc2VTdHlsZSB9IGZyb20gXCJrcnlvL2Nhc2Utc3R5bGVcIjtcbmltcG9ydCB7IEFycmF5VHlwZSB9IGZyb20gXCJrcnlvL3R5cGVzL2FycmF5XCI7XG5pbXBvcnQgeyBCb29sZWFuVHlwZSB9IGZyb20gXCJrcnlvL3R5cGVzL2Jvb2xlYW5cIjtcbmltcG9ydCB7IERhdGVUeXBlIH0gZnJvbSBcImtyeW8vdHlwZXMvZGF0ZVwiO1xuaW1wb3J0IHsgRG9jdW1lbnRUeXBlIH0gZnJvbSBcImtyeW8vdHlwZXMvZG9jdW1lbnRcIjtcbmltcG9ydCB7IEpzb25UeXBlIH0gZnJvbSBcImtyeW8vdHlwZXMvanNvblwiO1xuaW1wb3J0IHsgVWNzMlN0cmluZ1R5cGUgfSBmcm9tIFwia3J5by90eXBlcy91Y3MyLXN0cmluZ1wiO1xuaW1wb3J0IHsgJEFnZW50LCBBZ2VudCB9IGZyb20gXCIuL2FnZW50XCI7XG5pbXBvcnQgeyAkQ29udGFjdFByb2ZpbGUsIENvbnRhY3RQcm9maWxlIH0gZnJvbSBcIi4vY29udGFjdC1wcm9maWxlXCI7XG5pbXBvcnQgeyAkRGlzcGxheU5hbWUsIERpc3BsYXlOYW1lIH0gZnJvbSBcIi4vZGlzcGxheS1uYW1lXCI7XG5pbXBvcnQgeyAkRGlzcGxheU5hbWVTb3VyY2UsIERpc3BsYXlOYW1lU291cmNlIH0gZnJvbSBcIi4vZGlzcGxheS1uYW1lLXNvdXJjZVwiO1xuaW1wb3J0IHsgJE1yaUtleSwgTXJpS2V5IH0gZnJvbSBcIi4vbXJpLWtleVwiO1xuaW1wb3J0IHsgJFBob25lLCBQaG9uZSB9IGZyb20gXCIuL3Bob25lXCI7XG5pbXBvcnQgeyAkUmVsYXRpb25zaGlwSGlzdG9yeSwgUmVsYXRpb25zaGlwSGlzdG9yeSB9IGZyb20gXCIuL3JlbGF0aW9uc2hpcC1oaXN0b3J5XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29udGFjdCB7XG4gIC8qKlxuICAgKiBUaGlzIHNlZW1zIHRvIGFsd2F5cyBoYXZlIHRoZSBzYW1lIHZhbHVlIGFzIGBtcmlgLCBwcmVmZXIgdG8gdXNlIGBtcmlgIHRvIGlkZW50aWZ5XG4gICAqIHRoZSB1c2VyLlxuICAgKi9cbiAgcGVyc29uSWQ6IE1yaUtleTtcbiAgLyoqXG4gICAqIE1SSSBrZXkgb2YgdGhpcyBjb250YWN0LCB0aGlzIHNlcnZlcyBhcyB0aGUgdW5pcXVlIGlkIGZvciB0aGlzIGNvbnRhY3QuXG4gICAqL1xuICBtcmk6IE1yaUtleTtcbiAgZGlzcGxheU5hbWU6IERpc3BsYXlOYW1lO1xuICBkaXNwbGF5TmFtZVNvdXJjZTogRGlzcGxheU5hbWVTb3VyY2U7XG4gIC8qKlxuICAgKiBQaG9uZXMgYXJlIG5vcm1hbGx5IGRlZmluZWQgaW4gYHByb2ZpbGUucGhvbmVgIGJ1dCBJIGhhZCBvbmUgY2FzZSB3aGVyZSBpdCB3YXMgZGVmaW5lZFxuICAgKiBoZXJlIGluc3RlYWQgKG9sZCBpbmFjdGl2ZSBjb250YWN0KTpcbiAgICogYGBgXG4gICAqIFtcbiAgICogICB7XG4gICAqICAgICBcIm51bWJlclwiOiBcIiszMzY2NjY2NjY2NlwiLFxuICAgKiAgICAgXCJ0eXBlXCI6IFwibW9iaWxlXCJcbiAgICogICB9XG4gICAqIF1cbiAgICogYGBgXG4gICAqL1xuICBwaG9uZXM/OiBQaG9uZVtdO1xuICBwcm9maWxlOiBDb250YWN0UHJvZmlsZTtcbiAgYWdlbnQ/OiBBZ2VudDtcbiAgYXV0aG9yaXplZDogYm9vbGVhbjtcbiAgLyoqXG4gICAqIEJhc2U2NCBzdHJpbmcsIHNlZW1zIHRvIGRlcGVuZCBvbiB0aGUgdmFsdWUgb2YgYGF1dGhvcml6ZWRgIChhYnNlbnQgd2hlbiBgZmFsc2VgKVxuICAgKi9cbiAgYXV0aENlcnRpZmljYXRlPzogc3RyaW5nO1xuICBibG9ja2VkOiBib29sZWFuO1xuICBjcmVhdGlvblRpbWU6IERhdGU7XG4gIHJlbGF0aW9uc2hpcEhpc3Rvcnk/OiBSZWxhdGlvbnNoaXBIaXN0b3J5O1xuICBzdWdnZXN0ZWQ/OiBib29sZWFuO1xuICBwaG9uZUhhc2hlcz86IGFueVtdO1xufVxuXG5leHBvcnQgY29uc3QgJENvbnRhY3Q6IERvY3VtZW50VHlwZTxDb250YWN0PiA9IG5ldyBEb2N1bWVudFR5cGU8Q29udGFjdD4oe1xuICBwcm9wZXJ0aWVzOiB7XG4gICAgcGVyc29uSWQ6IHt0eXBlOiAkTXJpS2V5fSxcbiAgICBtcmk6IHt0eXBlOiAkTXJpS2V5fSxcbiAgICBkaXNwbGF5TmFtZToge3R5cGU6ICREaXNwbGF5TmFtZX0sXG4gICAgZGlzcGxheU5hbWVTb3VyY2U6IHt0eXBlOiAkRGlzcGxheU5hbWVTb3VyY2V9LFxuICAgIHBob25lczoge3R5cGU6IG5ldyBBcnJheVR5cGUoe2l0ZW1UeXBlOiAkUGhvbmUsIG1heExlbmd0aDogSW5maW5pdHl9KSwgb3B0aW9uYWw6IHRydWV9LFxuICAgIHByb2ZpbGU6IHt0eXBlOiAkQ29udGFjdFByb2ZpbGV9LFxuICAgIGFnZW50OiB7dHlwZTogJEFnZW50LCBvcHRpb25hbDogdHJ1ZX0sXG4gICAgYXV0aG9yaXplZDoge3R5cGU6IG5ldyBCb29sZWFuVHlwZSgpfSxcbiAgICBhdXRoQ2VydGlmaWNhdGU6IHt0eXBlOiBuZXcgVWNzMlN0cmluZ1R5cGUoe21heExlbmd0aDogSW5maW5pdHl9KSwgb3B0aW9uYWw6IHRydWV9LFxuICAgIGJsb2NrZWQ6IHt0eXBlOiBuZXcgQm9vbGVhblR5cGUoKX0sXG4gICAgY3JlYXRpb25UaW1lOiB7dHlwZTogbmV3IERhdGVUeXBlKCl9LFxuICAgIHJlbGF0aW9uc2hpcEhpc3Rvcnk6IHt0eXBlOiAkUmVsYXRpb25zaGlwSGlzdG9yeSwgb3B0aW9uYWw6IHRydWV9LFxuICAgIHN1Z2dlc3RlZDoge3R5cGU6IG5ldyBCb29sZWFuVHlwZSgpLCBvcHRpb25hbDogdHJ1ZX0sXG4gICAgcGhvbmVIYXNoZXM6IHt0eXBlOiBuZXcgQXJyYXlUeXBlKHtpdGVtVHlwZTogbmV3IEpzb25UeXBlKCksIG1heExlbmd0aDogSW5maW5pdHl9KSwgb3B0aW9uYWw6IHRydWV9LFxuICB9LFxuICByZW5hbWU6IENhc2VTdHlsZS5TbmFrZUNhc2UsXG4gIGlnbm9yZUV4dHJhS2V5czogdHJ1ZSxcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIuLiJ9
