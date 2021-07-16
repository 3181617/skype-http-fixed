"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const case_style_1 = require("kryo/case-style");
const simple_enum_1 = require("kryo/types/simple-enum");
var DisplayNameSource;
(function (DisplayNameSource) {
    DisplayNameSource[DisplayNameSource["Identifier"] = 0] = "Identifier";
    DisplayNameSource[DisplayNameSource["Profile"] = 1] = "Profile";
    /**
     * The display name was edited by the current user.
     */
    DisplayNameSource[DisplayNameSource["UserEdits"] = 2] = "UserEdits";
})(DisplayNameSource = exports.DisplayNameSource || (exports.DisplayNameSource = {}));
exports.$DisplayNameSource = new simple_enum_1.SimpleEnumType({
    enum: DisplayNameSource,
    rename: case_style_1.CaseStyle.SnakeCase,
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvdHlwZXMvZGlzcGxheS1uYW1lLXNvdXJjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdEQUE0QztBQUM1Qyx3REFBd0Q7QUFFeEQsSUFBWSxpQkFPWDtBQVBELFdBQVksaUJBQWlCO0lBQzNCLHFFQUFVLENBQUE7SUFDViwrREFBTyxDQUFBO0lBQ1A7O09BRUc7SUFDSCxtRUFBUyxDQUFBO0FBQ1gsQ0FBQyxFQVBXLGlCQUFpQixHQUFqQix5QkFBaUIsS0FBakIseUJBQWlCLFFBTzVCO0FBRVksUUFBQSxrQkFBa0IsR0FBc0MsSUFBSSw0QkFBYyxDQUFvQjtJQUN6RyxJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLE1BQU0sRUFBRSxzQkFBUyxDQUFDLFNBQVM7Q0FDNUIsQ0FBQyxDQUFDIiwiZmlsZSI6InR5cGVzL2Rpc3BsYXktbmFtZS1zb3VyY2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDYXNlU3R5bGUgfSBmcm9tIFwia3J5by9jYXNlLXN0eWxlXCI7XG5pbXBvcnQgeyBTaW1wbGVFbnVtVHlwZSB9IGZyb20gXCJrcnlvL3R5cGVzL3NpbXBsZS1lbnVtXCI7XG5cbmV4cG9ydCBlbnVtIERpc3BsYXlOYW1lU291cmNlIHtcbiAgSWRlbnRpZmllcixcbiAgUHJvZmlsZSxcbiAgLyoqXG4gICAqIFRoZSBkaXNwbGF5IG5hbWUgd2FzIGVkaXRlZCBieSB0aGUgY3VycmVudCB1c2VyLlxuICAgKi9cbiAgVXNlckVkaXRzLFxufVxuXG5leHBvcnQgY29uc3QgJERpc3BsYXlOYW1lU291cmNlOiBTaW1wbGVFbnVtVHlwZTxEaXNwbGF5TmFtZVNvdXJjZT4gPSBuZXcgU2ltcGxlRW51bVR5cGU8RGlzcGxheU5hbWVTb3VyY2U+KHtcbiAgZW51bTogRGlzcGxheU5hbWVTb3VyY2UsXG4gIHJlbmFtZTogQ2FzZVN0eWxlLlNuYWtlQ2FzZSxcbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIuLiJ9
