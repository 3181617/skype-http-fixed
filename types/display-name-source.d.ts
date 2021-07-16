import { SimpleEnumType } from "kryo/types/simple-enum";
export declare enum DisplayNameSource {
    Identifier = 0,
    Profile = 1,
    /**
     * The display name was edited by the current user.
     */
    UserEdits = 2,
}
export declare const $DisplayNameSource: SimpleEnumType<DisplayNameSource>;
