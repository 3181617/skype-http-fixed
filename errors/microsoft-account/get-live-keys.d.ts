import { Incident } from "incident";
import * as httpIo from "../../interfaces/http-io";
import { RequestError } from "../http";
export declare namespace MsprequCookieNotFoundError {
    type Name = "MsprequCookieNotFound";
    const name: Name;
    interface Data {
        request: httpIo.GetOptions;
        response: httpIo.Response;
    }
    type Cause = undefined;
}
export declare type MsprequCookieNotFoundError = Incident<MsprequCookieNotFoundError.Data, MsprequCookieNotFoundError.Name, MsprequCookieNotFoundError.Cause>;
export declare namespace MsprequCookieNotFoundError {
    type Type = MsprequCookieNotFoundError;
    function format({response, request}: Data): string;
    function create(request: httpIo.GetOptions, response: httpIo.Response): MsprequCookieNotFoundError;
}
export declare namespace MspokCookieNotFoundError {
    type Name = "MspokCookieNotFound";
    const name: Name;
    interface Data {
        request: httpIo.GetOptions;
        response: httpIo.Response;
    }
    type Cause = undefined;
}
export declare type MspokCookieNotFoundError = Incident<MspokCookieNotFoundError.Data, MspokCookieNotFoundError.Name, MspokCookieNotFoundError.Cause>;
export declare namespace MspokCookieNotFoundError {
    type Type = MspokCookieNotFoundError;
    function format({response, request}: Data): string;
    function create(request: httpIo.GetOptions, response: httpIo.Response): MspokCookieNotFoundError;
}
export declare namespace PpftKeyNotFoundError {
    type Name = "PpftKeyNotFound";
    const name: Name;
    interface Data {
        html: string;
    }
    type Cause = undefined;
}
export declare type PpftKeyNotFoundError = Incident<PpftKeyNotFoundError.Data, PpftKeyNotFoundError.Name, PpftKeyNotFoundError.Cause>;
export declare namespace PpftKeyNotFoundError {
    type Type = PpftKeyNotFoundError;
    function format({html}: Data): string;
    function create(html: string): PpftKeyNotFoundError;
}
export declare namespace GetLiveKeysError {
    type Name = "GetLiveKeys";
    const name: Name;
    interface Data {
    }
    type Cause = RequestError | MspokCookieNotFoundError | MsprequCookieNotFoundError | PpftKeyNotFoundError;
}
export declare type GetLiveKeysError = Incident<GetLiveKeysError.Data, GetLiveKeysError.Name, GetLiveKeysError.Cause>;
export declare namespace GetLiveKeysError {
    type Type = GetLiveKeysError;
    function format(): string;
    function create(cause: Cause): GetLiveKeysError;
}
