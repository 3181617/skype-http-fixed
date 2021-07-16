import { Incident } from "incident";
import { RequestError } from "../http";
export declare namespace SkypeTokenNotFoundError {
    type Name = "SkypeTokenNotFound";
    const name: Name;
    interface Data {
        html: string;
    }
    type Cause = undefined;
}
export declare type SkypeTokenNotFoundError = Incident<SkypeTokenNotFoundError.Data, SkypeTokenNotFoundError.Name, SkypeTokenNotFoundError.Cause>;
export declare namespace SkypeTokenNotFoundError {
    type Type = SkypeTokenNotFoundError;
    function format({html}: Data): string;
    function create(html: string): SkypeTokenNotFoundError;
}
export declare namespace GetSkypeTokenError {
    type Name = "GetSkypeToken";
    const name: Name;
    interface Data {
    }
    type Cause = RequestError | SkypeTokenNotFoundError;
}
export declare type GetSkypeTokenError = Incident<GetSkypeTokenError.Data, GetSkypeTokenError.Name, GetSkypeTokenError.Cause>;
export declare namespace GetSkypeTokenError {
    type Type = GetSkypeTokenError;
    function format(): string;
    function create(cause: Cause): GetSkypeTokenError;
}
