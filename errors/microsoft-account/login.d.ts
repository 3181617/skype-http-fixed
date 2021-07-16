import { Incident } from "incident";
import { WrongCredentialsError } from "../wrong-credentials";
import { WrongCredentialsLimitError } from "../wrong-credentials-limit";
import { GetLiveKeysError } from "./get-live-keys";
import { GetLiveTokenError } from "./get-live-token";
import { GetSkypeTokenError } from "./get-skype-token";
export declare namespace MicrosoftAccountLoginError {
    type Name = "MicrosoftAccountLogin";
    const name: Name;
    interface Data {
    }
    type Cause = GetLiveKeysError | GetLiveTokenError | GetSkypeTokenError | WrongCredentialsError | WrongCredentialsLimitError;
}
export declare type MicrosoftAccountLoginError = Incident<MicrosoftAccountLoginError.Data, MicrosoftAccountLoginError.Name, MicrosoftAccountLoginError.Cause>;
export declare namespace MicrosoftAccountLoginError {
    type Type = MicrosoftAccountLoginError;
    function format(): string;
    function create(cause: Cause): MicrosoftAccountLoginError;
}
