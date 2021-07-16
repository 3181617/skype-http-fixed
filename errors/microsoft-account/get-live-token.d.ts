import { Incident } from "incident";
import { RequestError } from "../http";
export declare namespace LiveTokenNotFoundError {
    type Name = "LiveTokenNotFound";
    const name: Name;
    interface Data {
        html: string;
    }
    type Cause = undefined;
}
export declare type LiveTokenNotFoundError = Incident<LiveTokenNotFoundError.Data, LiveTokenNotFoundError.Name, LiveTokenNotFoundError.Cause>;
export declare namespace LiveTokenNotFoundError {
    type Type = LiveTokenNotFoundError;
    function format({html}: Data): string;
    function create(html: string): LiveTokenNotFoundError;
}
export declare namespace GetLiveTokenError {
    type Name = "GetLiveToken";
    const name: Name;
    interface Data {
    }
    type Cause = RequestError | LiveTokenNotFoundError;
}
export declare type GetLiveTokenError = Incident<GetLiveTokenError.Data, GetLiveTokenError.Name, GetLiveTokenError.Cause>;
export declare namespace GetLiveTokenError {
    type Type = GetLiveTokenError;
    function format(): string;
    function create(cause: Cause): GetLiveTokenError;
}
