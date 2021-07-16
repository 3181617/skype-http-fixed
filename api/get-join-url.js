"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const incident_1 = require("incident");
async function getJoinUrl(io, apiContext, conversationId) {
    const requestBody = {
        baseDomain: "https://join.skype.com/launch/",
        threadId: conversationId,
    };
    const uri = "https://api.scheduler.skype.com/threads";
    const requestOptions = {
        uri,
        cookies: apiContext.cookies,
        body: JSON.stringify(requestBody),
        headers: {
            "X-Skypetoken": apiContext.skypeToken.value,
            "Content-Type": "application/json",
        },
    };
    const res = await io.post(requestOptions);
    if (res.statusCode !== 200) {
        return Promise.reject(new incident_1.Incident("get-join-url", "Received wrong return code"));
    }
    const body = JSON.parse(res.body);
    return body.JoinUrl;
}
exports.getJoinUrl = getJoinUrl;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvYXBpL2dldC1qb2luLXVybC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUFvQztBQVc3QixLQUFLLHFCQUFxQixFQUFhLEVBQUUsVUFBbUIsRUFBRSxjQUFzQjtJQUN6RixNQUFNLFdBQVcsR0FBZ0I7UUFDL0IsVUFBVSxFQUFFLGdDQUFnQztRQUM1QyxRQUFRLEVBQUUsY0FBYztLQUN6QixDQUFDO0lBRUYsTUFBTSxHQUFHLEdBQVcseUNBQXlDLENBQUM7SUFFOUQsTUFBTSxjQUFjLEdBQW1CO1FBQ3JDLEdBQUc7UUFDSCxPQUFPLEVBQUUsVUFBVSxDQUFDLE9BQU87UUFDM0IsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1FBQ2pDLE9BQU8sRUFBRTtZQUNMLGNBQWMsRUFBRSxVQUFVLENBQUMsVUFBVSxDQUFDLEtBQUs7WUFDM0MsY0FBYyxFQUFFLGtCQUFrQjtTQUNyQztLQUNGLENBQUM7SUFFRixNQUFNLEdBQUcsR0FBZ0IsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3ZELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFVLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLG1CQUFRLENBQUMsY0FBYyxFQUFFLDRCQUE0QixDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBQ0QsTUFBTSxJQUFJLEdBQVMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFFeEMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUM7QUFDdEIsQ0FBQztBQXpCRCxnQ0F5QkMiLCJmaWxlIjoiYXBpL2dldC1qb2luLXVybC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluY2lkZW50IH0gZnJvbSBcImluY2lkZW50XCI7XG5pbXBvcnQgeyBDb250ZXh0IH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL2NvbnRleHRcIjtcbmltcG9ydCAqIGFzIGlvIGZyb20gXCIuLi9pbnRlcmZhY2VzL2h0dHAtaW9cIjtcbmltcG9ydCB7IEpvaW4gfSBmcm9tIFwiLi4vaW50ZXJmYWNlcy9uYXRpdmUtYXBpL2NvbnZlcnNhdGlvblwiO1xuaW1wb3J0ICogYXMgbWVzc2FnZXNVcmkgZnJvbSBcIi4uL21lc3NhZ2VzLXVyaVwiO1xuXG5pbnRlcmZhY2UgUmVxdWVzdEJvZHkge1xuICBiYXNlRG9tYWluOiBcImh0dHBzOi8vam9pbi5za3lwZS5jb20vbGF1bmNoL1wiIHwgc3RyaW5nO1xuICB0aHJlYWRJZDogc3RyaW5nO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0Sm9pblVybChpbzogaW8uSHR0cElvLCBhcGlDb250ZXh0OiBDb250ZXh0LCBjb252ZXJzYXRpb25JZDogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgY29uc3QgcmVxdWVzdEJvZHk6IFJlcXVlc3RCb2R5ID0ge1xuICAgIGJhc2VEb21haW46IFwiaHR0cHM6Ly9qb2luLnNreXBlLmNvbS9sYXVuY2gvXCIsXG4gICAgdGhyZWFkSWQ6IGNvbnZlcnNhdGlvbklkLFxuICB9O1xuXG4gIGNvbnN0IHVyaTogc3RyaW5nID0gXCJodHRwczovL2FwaS5zY2hlZHVsZXIuc2t5cGUuY29tL3RocmVhZHNcIjtcblxuICBjb25zdCByZXF1ZXN0T3B0aW9uczogaW8uUG9zdE9wdGlvbnMgPSB7XG4gICAgdXJpLFxuICAgIGNvb2tpZXM6IGFwaUNvbnRleHQuY29va2llcyxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShyZXF1ZXN0Qm9keSksXG4gICAgaGVhZGVyczoge1xuICAgICAgICBcIlgtU2t5cGV0b2tlblwiOiBhcGlDb250ZXh0LnNreXBlVG9rZW4udmFsdWUsXG4gICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIH0sXG4gIH07XG5cbiAgY29uc3QgcmVzOiBpby5SZXNwb25zZSA9IGF3YWl0IGlvLnBvc3QocmVxdWVzdE9wdGlvbnMpO1xuICBpZiAocmVzLnN0YXR1c0NvZGUgIT09IDIwMCkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgSW5jaWRlbnQoXCJnZXQtam9pbi11cmxcIiwgXCJSZWNlaXZlZCB3cm9uZyByZXR1cm4gY29kZVwiKSk7XG4gIH1cbiAgY29uc3QgYm9keTogSm9pbiA9IEpTT04ucGFyc2UocmVzLmJvZHkpO1xuXG4gIHJldHVybiBib2R5LkpvaW5Vcmw7XG59XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
