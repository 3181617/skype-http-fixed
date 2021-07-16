import { Incident } from "incident";
import * as httpIo from "../interfaces/http-io";
export declare namespace UnexpectedHttpStatusError {
    type Name = "UnexpectedHttpStatus";
    const name: Name;
    interface Data {
        response: httpIo.Response;
        expected: Set<number>;
        request?: httpIo.GetOptions | httpIo.PostOptions | httpIo.PutOptions;
    }
    type Cause = undefined;
}
export declare type UnexpectedHttpStatusError = Incident<UnexpectedHttpStatusError.Data, UnexpectedHttpStatusError.Name, UnexpectedHttpStatusError.Cause>;
export declare namespace UnexpectedHttpStatusError {
    type Type = UnexpectedHttpStatusError;
    function format({expected, response, request}: Data): string;
    function create(response: httpIo.Response, expected: Set<number>, request?: httpIo.GetOptions | httpIo.PostOptions | httpIo.PutOptions): UnexpectedHttpStatusError;
}
export declare namespace MissingHeaderError {
    type Name = "MissingHeader";
    const name: Name;
    interface Data {
        response: httpIo.Response;
        headerName: string;
        request?: httpIo.GetOptions | httpIo.PostOptions | httpIo.PutOptions;
    }
    type Cause = undefined;
}
export declare type MissingHeaderError = Incident<MissingHeaderError.Data, MissingHeaderError.Name, MissingHeaderError.Cause>;
export declare namespace MissingHeaderError {
    type Type = MissingHeaderError;
    function format({headerName, response, request}: Data): string;
    function create(response: httpIo.Response, headerName: string, request?: httpIo.GetOptions | httpIo.PostOptions | httpIo.PutOptions): MissingHeaderError;
}
export declare namespace RequestError {
    type Name = "Request";
    const name: Name;
    interface Data {
        request: httpIo.GetOptions | httpIo.PostOptions | httpIo.PutOptions;
    }
    type Cause = Error;
}
export declare type RequestError = Incident<RequestError.Data, RequestError.Name, RequestError.Cause>;
export declare namespace RequestError {
    type Type = RequestError;
    function format({request}: Data): string;
    function create(cause: Error, request: httpIo.GetOptions | httpIo.PostOptions | httpIo.PutOptions): RequestError;
}
