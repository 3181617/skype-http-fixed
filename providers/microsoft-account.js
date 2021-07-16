"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
}
Object.defineProperty(exports, "__esModule", { value: true });
const cheerio_1 = __importDefault(require("cheerio"));
const path_1 = __importDefault(require("path"));
const tough_cookie_1 = __importDefault(require("tough-cookie"));
const url_1 = __importDefault(require("url"));
const httpErrors = __importStar(require("../errors/http"));
const getLiveKeysErrors = __importStar(require("../errors/microsoft-account/get-live-keys"));
const getLiveTokenErrors = __importStar(require("../errors/microsoft-account/get-live-token"));
const getSkypeTokenErrors = __importStar(require("../errors/microsoft-account/get-skype-token"));
const login_1 = require("../errors/microsoft-account/login");
const wrong_credentials_1 = require("../errors/wrong-credentials");
const wrong_credentials_limit_1 = require("../errors/wrong-credentials-limit");
exports.skypeWebUri = "https://web.skype.com/";
exports.skypeLoginUri = "https://login.skype.com/login/";
exports.liveLoginUri = "https://login.live.com/";
exports.webClientLiveLoginId = "578134";
async function login(options) {
    try {
        const liveKeys = await getLiveKeys(options);
        const liveToken = await getLiveToken({
            username: options.credentials.login,
            password: options.credentials.password,
            httpIo: options.httpIo,
            cookies: options.cookies,
            liveKeys,
        });
        return getSkypeToken({
            liveToken,
            cookies: options.cookies,
            httpIo: options.httpIo,
        });
    }
    catch (_err) {
        const err = _err;
        switch (err.name) {
            case getLiveKeysErrors.GetLiveKeysError.name:
            case getLiveTokenErrors.GetLiveTokenError.name:
            case getSkypeTokenErrors.GetSkypeTokenError.name:
            case wrong_credentials_1.WrongCredentialsError.name:
            case wrong_credentials_limit_1.WrongCredentialsLimitError.name:
                throw login_1.MicrosoftAccountLoginError.create(err);
            default:
                throw _err;
        }
    }
}
exports.login = login;
async function getLiveKeys(options) {
    try {
        const uri = url_1.default.resolve(exports.skypeLoginUri, path_1.default.posix.join("oauth", "microsoft"));
        const queryString = {
            client_id: exports.webClientLiveLoginId,
            redirect_uri: exports.skypeWebUri,
        };
        const getOptions = { uri, queryString, cookies: options.cookies };
        let response;
        try {
            response = await options.httpIo.get(getOptions);
        }
        catch (err) {
            throw httpErrors.RequestError.create(err, getOptions);
        }
        let mspRequ;
        let mspOk;
        // Retrieve values for the cookies "MSPRequ" and "MSPOK"
        const cookies = new tough_cookie_1.default.CookieJar(options.cookies)
            .getCookiesSync("https://login.live.com/");
        for (const cookie of cookies) {
            switch (cookie.key) {
                case "MSPRequ":
                    mspRequ = cookie.value;
                    break;
                case "MSPOK":
                    mspOk = cookie.value;
                    break;
                default:
                    // Ignore other cookies
                    break;
            }
        }
        if (typeof mspOk !== "string") {
            throw getLiveKeysErrors.MspokCookieNotFoundError.create(getOptions, response);
        }
        if (typeof mspRequ !== "string") {
            throw getLiveKeysErrors.MsprequCookieNotFoundError.create(getOptions, response);
        }
        const ppftKey = scrapLivePpftKey(response.body);
        return {
            MSPRequ: mspRequ,
            MSPOK: mspOk,
            PPFT: ppftKey,
        };
    }
    catch (_err) {
        const err = _err;
        switch (err.name) {
            case httpErrors.RequestError.name:
            case getLiveKeysErrors.MspokCookieNotFoundError.name:
            case getLiveKeysErrors.MsprequCookieNotFoundError.name:
            case getLiveKeysErrors.PpftKeyNotFoundError.name:
                throw getLiveKeysErrors.GetLiveKeysError.create(err);
            default:
                throw _err;
        }
    }
}
exports.getLiveKeys = getLiveKeys;
/**
 * Retrieves the PPFT key from the HTML response from login.live.com to get the Live keys.
 *
 * @param html The html body to scrap
 * @returns The PPFT key
 */
function scrapLivePpftKey(html) {
    /* tslint:disable-next-line:max-line-length */
    const ppftRegExp = /<input\s+type="hidden"\s+name="PPFT"\s+id="i0327"\s+value="([*!0-9a-zA-Z]+\${1,2})"\s*\/>/;
    const regExpResult = ppftRegExp.exec(html);
    if (regExpResult === null) {
        throw getLiveKeysErrors.PpftKeyNotFoundError.create(html);
    }
    return regExpResult[1];
}
exports.scrapLivePpftKey = scrapLivePpftKey;
async function getLiveToken(options) {
    try {
        const response = await requestLiveToken(options);
        return scrapLiveToken(response.body);
    }
    catch (_err) {
        const err = _err;
        switch (err.name) {
            case httpErrors.RequestError.name:
            case getLiveTokenErrors.LiveTokenNotFoundError.name:
                throw getLiveTokenErrors.GetLiveTokenError.create(err);
            case wrong_credentials_1.WrongCredentialsError.name:
                if (typeof err.data.username !== "string") {
                    throw wrong_credentials_1.WrongCredentialsError.create(options.username);
                }
                else {
                    throw err;
                }
            case wrong_credentials_limit_1.WrongCredentialsLimitError.name:
            default:
                throw _err;
        }
    }
}
exports.getLiveToken = getLiveToken;
// Get live token from live keys and credentials
async function requestLiveToken(options) {
    const uri = url_1.default.resolve(exports.liveLoginUri, path_1.default.posix.join("ppsecure", "post.srf"));
    const queryString = {
        wa: "wsignin1.0",
        wp: "MBI_SSL",
        // tslint:disable-next-line:max-line-length
        wreply: "https://lw.skype.com/login/oauth/proxy?client_id=578134&site_name=lw.skype.com&redirect_uri=https%3A%2F%2Fweb.skype.com%2F",
    };
    // MSPRequ should already be set
    // MSPOK should already be set
    const millisecondsSinceEpoch = Date.now(); // Milliseconds since epoch
    const ckTstCookie = new tough_cookie_1.default.Cookie({
        key: "CkTst",
        value: millisecondsSinceEpoch.toString(10),
    });
    new tough_cookie_1.default.CookieJar(options.cookies).setCookieSync(ckTstCookie, "https://login.live.com/");
    const formData = {
        login: options.username,
        passwd: options.password,
        PPFT: options.liveKeys.PPFT,
    };
    const postOptions = {
        uri,
        queryString,
        cookies: options.cookies,
        form: formData,
    };
    try {
        return options.httpIo.post(postOptions);
    }
    catch (err) {
        throw httpErrors.RequestError.create(err, postOptions);
    }
}
exports.requestLiveToken = requestLiveToken;
/**
 * Scrap the result of a sendCredentials requests to retrieve the value of the `t` parameter
 * @param html
 * @returns The token provided by Live for Skype
 */
function scrapLiveToken(html) {
    // TODO(demurgos): Handle the possible failure of .load (invalid HTML)
    const $ = cheerio_1.default.load(html);
    const tokenNode = $("#t");
    const tokenValue = tokenNode.val();
    if (tokenValue === undefined || tokenValue === "") {
        if (html.indexOf("sErrTxt:'Your account or password is incorrect.") >= 0) {
            throw wrong_credentials_1.WrongCredentialsError.create();
            /* tslint:disable-next-line:max-line-length */
        }
        else if (html.indexOf("sErrTxt:\"You\\'ve tried to sign in too many times with an incorrect account or password.\"") >= 0) {
            throw wrong_credentials_limit_1.WrongCredentialsLimitError.create();
        }
        else {
            // TODO(demurgos): Check if there is a PPFT token (redirected to the getLiveKeys response)
            throw getLiveTokenErrors.LiveTokenNotFoundError.create(html);
        }
    }
    return tokenValue;
}
exports.scrapLiveToken = scrapLiveToken;
/**
 * Complete the OAuth workflow and get the Skype token
 *
 * @param options
 */
async function getSkypeToken(options) {
    try {
        const startTime = Date.now();
        const res = await requestSkypeToken(options);
        const scrapped = scrapSkypeTokenResponse(res.body);
        // Expires in (seconds) (default: 1 day)
        const expiresIn = typeof scrapped.expires_in === "number" ? scrapped.expires_in : 864000;
        return {
            value: scrapped.skypetoken,
            expirationDate: new Date(startTime + expiresIn * 1000),
        };
    }
    catch (_err) {
        const err = _err;
        switch (err.name) {
            case httpErrors.RequestError.name:
            case getSkypeTokenErrors.SkypeTokenNotFoundError.name:
                throw getSkypeTokenErrors.GetSkypeTokenError.create(err);
            default:
                throw _err;
        }
    }
}
exports.getSkypeToken = getSkypeToken;
async function requestSkypeToken(options) {
    const uri = url_1.default.resolve(exports.skypeLoginUri, "microsoft");
    const queryString = {
        client_id: "578134",
        redirect_uri: "https://web.skype.com",
    };
    const formData = {
        t: options.liveToken,
        client_id: "578134",
        oauthPartner: "999",
        site_name: "lw.skype.com",
        redirect_uri: "https://web.skype.com",
    };
    const postOptions = {
        uri,
        queryString,
        form: formData,
    };
    try {
        return options.httpIo.post(postOptions);
    }
    catch (err) {
        throw httpErrors.RequestError.create(err, postOptions);
    }
}
exports.requestSkypeToken = requestSkypeToken;
/**
 * Scrap to get the Skype OAuth token
 *
 * @param html
 * @returns {string}
 */
function scrapSkypeTokenResponse(html) {
    // TODO(demurgos): Handle .load errors (invalid HTML)
    const $ = cheerio_1.default.load(html);
    const skypeTokenNode = $("input[name=skypetoken]");
    // In seconds
    const expiresInNode = $("input[name=expires_in]");
    const skypeToken = skypeTokenNode.val();
    const expiresIn = parseInt(expiresInNode.val(), 10);
    if (typeof skypeToken !== "string") {
        getSkypeTokenErrors.SkypeTokenNotFoundError.create(html);
    }
    // if (!skypetoken || !expires_in) {
    //   const skypeErrorMessage = $(".message_error").text();
    //   const errorName = "authentication-failed";
    //   const errorMessage = "Failed to get skypetoken. Username or password is incorrect OR you've hit a CAPTCHA wall.";
    //   if (skypeErrorMessage) {
    //     const skypeError = new Incident("skype-error", skypeErrorMessage);
    //     throw new Incident(skypeError, errorName, errorMessage);
    //   } else {
    //     throw new Incident(errorName, errorMessage);
    //   }
    // }
    // return result;
    return {
        skypetoken: skypeToken,
        expires_in: expiresIn,
    };
}
exports.scrapSkypeTokenResponse = scrapSkypeTokenResponse;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9zcmMvcHJvdmlkZXJzL21pY3Jvc29mdC1hY2NvdW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHNEQUE4QjtBQUM5QixnREFBd0I7QUFDeEIsZ0VBQXVDO0FBQ3ZDLDhDQUFzQjtBQUN0QiwyREFBNkM7QUFDN0MsNkZBQStFO0FBQy9FLCtGQUFpRjtBQUNqRixpR0FBbUY7QUFDbkYsNkRBQStFO0FBQy9FLG1FQUFvRTtBQUNwRSwrRUFBK0U7QUFJbEUsUUFBQSxXQUFXLEdBQVcsd0JBQXdCLENBQUM7QUFDL0MsUUFBQSxhQUFhLEdBQVcsZ0NBQWdDLENBQUM7QUFDekQsUUFBQSxZQUFZLEdBQVcseUJBQXlCLENBQUM7QUFDakQsUUFBQSxvQkFBb0IsR0FBVyxRQUFRLENBQUM7QUFrQzlDLEtBQUssZ0JBQWdCLE9BQXFCO0lBQy9DLElBQUksQ0FBQztRQUNILE1BQU0sUUFBUSxHQUFhLE1BQU0sV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXRELE1BQU0sU0FBUyxHQUFXLE1BQU0sWUFBWSxDQUFDO1lBQzNDLFFBQVEsRUFBRSxPQUFPLENBQUMsV0FBVyxDQUFDLEtBQUs7WUFDbkMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxXQUFXLENBQUMsUUFBUTtZQUN0QyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU07WUFDdEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxPQUFPO1lBQ3hCLFFBQVE7U0FDVCxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsYUFBYSxDQUFDO1lBQ25CLFNBQVM7WUFDVCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87WUFDeEIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1NBQ3ZCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxHQUFHLEdBQXFDLElBQUksQ0FBQztRQUNuRCxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqQixLQUFLLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQztZQUM3QyxLQUFLLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQztZQUMvQyxLQUFLLG1CQUFtQixDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQztZQUNqRCxLQUFLLHlDQUFxQixDQUFDLElBQUksQ0FBQztZQUNoQyxLQUFLLG9EQUEwQixDQUFDLElBQUk7Z0JBQ2xDLE1BQU0sa0NBQTBCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQy9DO2dCQUNFLE1BQU0sSUFBSSxDQUFDO1FBQ2YsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBOUJELHNCQThCQztBQWdDTSxLQUFLLHNCQUFzQixPQUE0QjtJQUM1RCxJQUFJLENBQUM7UUFDSCxNQUFNLEdBQUcsR0FBVyxhQUFHLENBQUMsT0FBTyxDQUFDLHFCQUFhLEVBQUUsY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDdEYsTUFBTSxXQUFXLEdBQTRCO1lBQzNDLFNBQVMsRUFBRSw0QkFBb0I7WUFDL0IsWUFBWSxFQUFFLG1CQUFXO1NBQzFCLENBQUM7UUFDRixNQUFNLFVBQVUsR0FBa0IsRUFBQyxHQUFHLEVBQUUsV0FBVyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFDLENBQUM7UUFFL0UsSUFBSSxRQUFxQixDQUFDO1FBQzFCLElBQUksQ0FBQztZQUNILFFBQVEsR0FBRyxNQUFNLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2IsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDeEQsQ0FBQztRQUVELElBQUksT0FBMkIsQ0FBQztRQUNoQyxJQUFJLEtBQXlCLENBQUM7UUFFOUIsd0RBQXdEO1FBQ3hELE1BQU0sT0FBTyxHQUF5QixJQUFJLHNCQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7YUFDN0UsY0FBYyxDQUFDLHlCQUF5QixDQUFDLENBQUM7UUFDN0MsR0FBRyxDQUFDLENBQUMsTUFBTSxNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztZQUM3QixNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDbkIsS0FBSyxTQUFTO29CQUNaLE9BQU8sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO29CQUN2QixLQUFLLENBQUM7Z0JBQ1IsS0FBSyxPQUFPO29CQUNWLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO29CQUNyQixLQUFLLENBQUM7Z0JBQ1I7b0JBQ0UsdUJBQXVCO29CQUN2QixLQUFLLENBQUM7WUFDVixDQUFDO1FBQ0gsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDOUIsTUFBTSxpQkFBaUIsQ0FBQyx3QkFBd0IsQ0FBQyxNQUFNLENBQUMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQ2hGLENBQUM7UUFDRCxFQUFFLENBQUMsQ0FBQyxPQUFPLE9BQU8sS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2hDLE1BQU0saUJBQWlCLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNsRixDQUFDO1FBRUQsTUFBTSxPQUFPLEdBQVcsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3hELE1BQU0sQ0FBQztZQUNMLE9BQU8sRUFBRSxPQUFPO1lBQ2hCLEtBQUssRUFBRSxLQUFLO1lBQ1osSUFBSSxFQUFFLE9BQU87U0FDZCxDQUFDO0lBQ0osQ0FBQztJQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDZCxNQUFNLEdBQUcsR0FBNkMsSUFBSSxDQUFDO1FBQzNELE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLEtBQUssVUFBVSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUM7WUFDbEMsS0FBSyxpQkFBaUIsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUM7WUFDckQsS0FBSyxpQkFBaUIsQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUM7WUFDdkQsS0FBSyxpQkFBaUIsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJO2dCQUM5QyxNQUFNLGlCQUFpQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2RDtnQkFDRSxNQUFNLElBQUksQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQTdERCxrQ0E2REM7QUFFRDs7Ozs7R0FLRztBQUNILDBCQUFpQyxJQUFZO0lBQzNDLDhDQUE4QztJQUM5QyxNQUFNLFVBQVUsR0FBVywyRkFBMkYsQ0FBQztJQUN2SCxNQUFNLFlBQVksR0FBMkIsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVuRSxFQUFFLENBQUMsQ0FBQyxZQUFZLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztRQUMxQixNQUFNLGlCQUFpQixDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1RCxDQUFDO0lBRUQsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6QixDQUFDO0FBVkQsNENBVUM7QUFVTSxLQUFLLHVCQUF1QixPQUE0QjtJQUM3RCxJQUFJLENBQUM7UUFDSCxNQUFNLFFBQVEsR0FBZ0IsTUFBTSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUNkLE1BQU0sR0FBRyxHQUFvRyxJQUFJLENBQUM7UUFDbEgsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDakIsS0FBSyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQztZQUNsQyxLQUFLLGtCQUFrQixDQUFDLHNCQUFzQixDQUFDLElBQUk7Z0JBQ2pELE1BQU0sa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pELEtBQUsseUNBQXFCLENBQUMsSUFBSTtnQkFDN0IsRUFBRSxDQUFDLENBQUMsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxNQUFNLHlDQUFxQixDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7Z0JBQ3ZELENBQUM7Z0JBQUMsSUFBSSxDQUFDLENBQUM7b0JBQ04sTUFBTSxHQUFHLENBQUM7Z0JBQ1osQ0FBQztZQUNILEtBQUssb0RBQTBCLENBQUMsSUFBSSxDQUFDO1lBQ3JDO2dCQUNFLE1BQU0sSUFBSSxDQUFDO1FBQ2YsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDO0FBckJELG9DQXFCQztBQUVELGdEQUFnRDtBQUN6QyxLQUFLLDJCQUEyQixPQUE0QjtJQUNqRSxNQUFNLEdBQUcsR0FBVyxhQUFHLENBQUMsT0FBTyxDQUFDLG9CQUFZLEVBQUUsY0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDdkYsTUFBTSxXQUFXLEdBQTRCO1FBQzNDLEVBQUUsRUFBRSxZQUFZO1FBQ2hCLEVBQUUsRUFBRSxTQUFTO1FBQ2IsMkNBQTJDO1FBQzNDLE1BQU0sRUFBRSw0SEFBNEg7S0FDckksQ0FBQztJQUNGLGdDQUFnQztJQUNoQyw4QkFBOEI7SUFDOUIsTUFBTSxzQkFBc0IsR0FBVyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQywyQkFBMkI7SUFDOUUsTUFBTSxXQUFXLEdBQXVCLElBQVcsc0JBQVcsQ0FBQyxNQUFPLENBQUM7UUFDckUsR0FBRyxFQUFFLE9BQU87UUFDWixLQUFLLEVBQUUsc0JBQXNCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztLQUMzQyxDQUFDLENBQUM7SUFFSCxJQUFJLHNCQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLHlCQUF5QixDQUFDLENBQUM7SUFFakcsTUFBTSxRQUFRLEdBQVE7UUFDcEIsS0FBSyxFQUFFLE9BQU8sQ0FBQyxRQUFRO1FBQ3ZCLE1BQU0sRUFBRSxPQUFPLENBQUMsUUFBUTtRQUN4QixJQUFJLEVBQUUsT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJO0tBQzVCLENBQUM7SUFFRixNQUFNLFdBQVcsR0FBbUI7UUFDbEMsR0FBRztRQUNILFdBQVc7UUFDWCxPQUFPLEVBQUUsT0FBTyxDQUFDLE9BQU87UUFDeEIsSUFBSSxFQUFFLFFBQVE7S0FDZixDQUFDO0lBRUYsSUFBSSxDQUFDO1FBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQzFDLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2IsTUFBTSxVQUFVLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDekQsQ0FBQztBQUNILENBQUM7QUFwQ0QsNENBb0NDO0FBRUQ7Ozs7R0FJRztBQUNILHdCQUErQixJQUFZO0lBQ3pDLHNFQUFzRTtJQUN0RSxNQUFNLENBQUMsR0FBa0IsaUJBQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsTUFBTSxTQUFTLEdBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLE1BQU0sVUFBVSxHQUF1QixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDdkQsRUFBRSxDQUFDLENBQUMsVUFBVSxLQUFLLFNBQVMsSUFBSSxVQUFVLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGlEQUFpRCxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6RSxNQUFNLHlDQUFxQixDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ3JDLDhDQUE4QztRQUNoRCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsNkZBQTZGLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVILE1BQU0sb0RBQTBCLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDNUMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sMEZBQTBGO1lBQzFGLE1BQU0sa0JBQWtCLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9ELENBQUM7SUFDSCxDQUFDO0lBQ0QsTUFBTSxDQUFDLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBakJELHdDQWlCQztBQVFEOzs7O0dBSUc7QUFDSSxLQUFLLHdCQUF3QixPQUE2QjtJQUMvRCxJQUFJLENBQUM7UUFDSCxNQUFNLFNBQVMsR0FBVyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDckMsTUFBTSxHQUFHLEdBQWdCLE1BQU0saUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDMUQsTUFBTSxRQUFRLEdBQXVCLHVCQUF1QixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2RSx3Q0FBd0M7UUFDeEMsTUFBTSxTQUFTLEdBQVcsT0FBTyxRQUFRLENBQUMsVUFBVSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ2pHLE1BQU0sQ0FBQztZQUNMLEtBQUssRUFBRSxRQUFRLENBQUMsVUFBVTtZQUMxQixjQUFjLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDdkQsQ0FBQztJQUNKLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2QsTUFBTSxHQUFHLEdBQWlELElBQUksQ0FBQztRQUMvRCxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqQixLQUFLLFVBQVUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO1lBQ2xDLEtBQUssbUJBQW1CLENBQUMsdUJBQXVCLENBQUMsSUFBSTtnQkFDbkQsTUFBTSxtQkFBbUIsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDM0Q7Z0JBQ0UsTUFBTSxJQUFJLENBQUM7UUFDZixDQUFDO0lBQ0gsQ0FBQztBQUNILENBQUM7QUFyQkQsc0NBcUJDO0FBRU0sS0FBSyw0QkFBNEIsT0FBNkI7SUFDbkUsTUFBTSxHQUFHLEdBQVcsYUFBRyxDQUFDLE9BQU8sQ0FBQyxxQkFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBRTVELE1BQU0sV0FBVyxHQUE0QjtRQUMzQyxTQUFTLEVBQUUsUUFBUTtRQUNuQixZQUFZLEVBQUUsdUJBQXVCO0tBQ3RDLENBQUM7SUFFRixNQUFNLFFBQVEsR0FBNEI7UUFDeEMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxTQUFTO1FBQ3BCLFNBQVMsRUFBRSxRQUFRO1FBQ25CLFlBQVksRUFBRSxLQUFLO1FBQ25CLFNBQVMsRUFBRSxjQUFjO1FBQ3pCLFlBQVksRUFBRSx1QkFBdUI7S0FDdEMsQ0FBQztJQUVGLE1BQU0sV0FBVyxHQUFtQjtRQUNsQyxHQUFHO1FBQ0gsV0FBVztRQUNYLElBQUksRUFBRSxRQUFRO0tBQ2YsQ0FBQztJQUVGLElBQUksQ0FBQztRQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNiLE1BQU0sVUFBVSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQ3pELENBQUM7QUFDSCxDQUFDO0FBM0JELDhDQTJCQztBQU9EOzs7OztHQUtHO0FBQ0gsaUNBQXdDLElBQVk7SUFDbEQscURBQXFEO0lBQ3JELE1BQU0sQ0FBQyxHQUFrQixpQkFBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1QyxNQUFNLGNBQWMsR0FBWSxDQUFDLENBQUMsd0JBQXdCLENBQUMsQ0FBQztJQUM1RCxhQUFhO0lBQ2IsTUFBTSxhQUFhLEdBQVksQ0FBQyxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFFM0QsTUFBTSxVQUFVLEdBQXVCLGNBQWMsQ0FBQyxHQUFHLEVBQUUsQ0FBQztJQUM1RCxNQUFNLFNBQVMsR0FBdUIsUUFBUSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUV4RSxFQUFFLENBQUMsQ0FBQyxPQUFPLFVBQVUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ25DLG1CQUFtQixDQUFDLHVCQUF1QixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsb0NBQW9DO0lBQ3BDLDBEQUEwRDtJQUMxRCwrQ0FBK0M7SUFDL0Msc0hBQXNIO0lBQ3RILDZCQUE2QjtJQUM3Qix5RUFBeUU7SUFDekUsK0RBQStEO0lBQy9ELGFBQWE7SUFDYixtREFBbUQ7SUFDbkQsTUFBTTtJQUNOLElBQUk7SUFDSixpQkFBaUI7SUFFakIsTUFBTSxDQUFDO1FBQ0wsVUFBVSxFQUFFLFVBQVU7UUFDdEIsVUFBVSxFQUFFLFNBQVM7S0FDdEIsQ0FBQztBQUNKLENBQUM7QUEvQkQsMERBK0JDIiwiZmlsZSI6InByb3ZpZGVycy9taWNyb3NvZnQtYWNjb3VudC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjaGVlcmlvIGZyb20gXCJjaGVlcmlvXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHRvdWdoQ29va2llIGZyb20gXCJ0b3VnaC1jb29raWVcIjtcbmltcG9ydCB1cmwgZnJvbSBcInVybFwiO1xuaW1wb3J0ICogYXMgaHR0cEVycm9ycyBmcm9tIFwiLi4vZXJyb3JzL2h0dHBcIjtcbmltcG9ydCAqIGFzIGdldExpdmVLZXlzRXJyb3JzIGZyb20gXCIuLi9lcnJvcnMvbWljcm9zb2Z0LWFjY291bnQvZ2V0LWxpdmUta2V5c1wiO1xuaW1wb3J0ICogYXMgZ2V0TGl2ZVRva2VuRXJyb3JzIGZyb20gXCIuLi9lcnJvcnMvbWljcm9zb2Z0LWFjY291bnQvZ2V0LWxpdmUtdG9rZW5cIjtcbmltcG9ydCAqIGFzIGdldFNreXBlVG9rZW5FcnJvcnMgZnJvbSBcIi4uL2Vycm9ycy9taWNyb3NvZnQtYWNjb3VudC9nZXQtc2t5cGUtdG9rZW5cIjtcbmltcG9ydCB7IE1pY3Jvc29mdEFjY291bnRMb2dpbkVycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy9taWNyb3NvZnQtYWNjb3VudC9sb2dpblwiO1xuaW1wb3J0IHsgV3JvbmdDcmVkZW50aWFsc0Vycm9yIH0gZnJvbSBcIi4uL2Vycm9ycy93cm9uZy1jcmVkZW50aWFsc1wiO1xuaW1wb3J0IHsgV3JvbmdDcmVkZW50aWFsc0xpbWl0RXJyb3IgfSBmcm9tIFwiLi4vZXJyb3JzL3dyb25nLWNyZWRlbnRpYWxzLWxpbWl0XCI7XG5pbXBvcnQgeyBTa3lwZVRva2VuIH0gZnJvbSBcIi4uL2ludGVyZmFjZXMvYXBpL2NvbnRleHRcIjtcbmltcG9ydCAqIGFzIGlvIGZyb20gXCIuLi9pbnRlcmZhY2VzL2h0dHAtaW9cIjtcblxuZXhwb3J0IGNvbnN0IHNreXBlV2ViVXJpOiBzdHJpbmcgPSBcImh0dHBzOi8vd2ViLnNreXBlLmNvbS9cIjtcbmV4cG9ydCBjb25zdCBza3lwZUxvZ2luVXJpOiBzdHJpbmcgPSBcImh0dHBzOi8vbG9naW4uc2t5cGUuY29tL2xvZ2luL1wiO1xuZXhwb3J0IGNvbnN0IGxpdmVMb2dpblVyaTogc3RyaW5nID0gXCJodHRwczovL2xvZ2luLmxpdmUuY29tL1wiO1xuZXhwb3J0IGNvbnN0IHdlYkNsaWVudExpdmVMb2dpbklkOiBzdHJpbmcgPSBcIjU3ODEzNFwiO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgdXNlciBgdXNlcm5hbWVgIGV4aXN0c1xuICovXG4vLyBleHBvcnQgYXN5bmMgZnVuY3Rpb24gdXNlckV4aXN0cyh1c2VybmFtZTogc3RyaW5nLCBodHRwSW86IGlvLkh0dHBJbyA9IHJlcXVlc3RJbyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuLy8gICBjb25zdCBtaWNyb3NvZnRBY2NvdW50cyA9IFwiZmpvc2lcIjtcbi8vICAgY29uc3QgdXJpID0gYCR7bWljcm9zb2Z0QWNjb3VudHN9L0dldENyZWRlbnRpYWxUeXBlLnNyZmA7XG4vL1xuLy8gICBjb25zdCByZXM6IGlvLlJlc3BvbnNlID0gYXdhaXQgaHR0cElvLnBvc3Qoe1xuLy8gICAgIHVyaTogdXJpLFxuLy8gICAgIGZvcm06IHtcbi8vICAgICAgIHVzZXJuYW1lOiB1c2VybmFtZVxuLy8gICAgIH1cbi8vICAgfSk7XG4vL1xuLy8gICBjb25zdCBkYXRhID0gSlNPTi5wYXJzZShyZXMuYm9keSk7XG4vLyAgIHJldHVybiBkYXRhW1wiSWZFeGlzdHNSZXN1bHRcIl07XG4vLyB9XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ3JlZGVudGlhbHMge1xuICAvKipcbiAgICogU2t5cGUgdXNlcm5hbWUgb3IgZW1haWwgYWRkcmVzc1xuICAgKi9cbiAgbG9naW46IHN0cmluZztcbiAgcGFzc3dvcmQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMb2dpbk9wdGlvbnMge1xuICBjcmVkZW50aWFsczogQ3JlZGVudGlhbHM7XG4gIGh0dHBJbzogaW8uSHR0cElvO1xuICBjb29raWVzOiB0b3VnaENvb2tpZS5TdG9yZTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ2luKG9wdGlvbnM6IExvZ2luT3B0aW9ucyk6IFByb21pc2U8U2t5cGVUb2tlbj4ge1xuICB0cnkge1xuICAgIGNvbnN0IGxpdmVLZXlzOiBMaXZlS2V5cyA9IGF3YWl0IGdldExpdmVLZXlzKG9wdGlvbnMpO1xuXG4gICAgY29uc3QgbGl2ZVRva2VuOiBzdHJpbmcgPSBhd2FpdCBnZXRMaXZlVG9rZW4oe1xuICAgICAgdXNlcm5hbWU6IG9wdGlvbnMuY3JlZGVudGlhbHMubG9naW4sXG4gICAgICBwYXNzd29yZDogb3B0aW9ucy5jcmVkZW50aWFscy5wYXNzd29yZCxcbiAgICAgIGh0dHBJbzogb3B0aW9ucy5odHRwSW8sXG4gICAgICBjb29raWVzOiBvcHRpb25zLmNvb2tpZXMsXG4gICAgICBsaXZlS2V5cyxcbiAgICB9KTtcblxuICAgIHJldHVybiBnZXRTa3lwZVRva2VuKHtcbiAgICAgIGxpdmVUb2tlbixcbiAgICAgIGNvb2tpZXM6IG9wdGlvbnMuY29va2llcyxcbiAgICAgIGh0dHBJbzogb3B0aW9ucy5odHRwSW8sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICBjb25zdCBlcnI6IE1pY3Jvc29mdEFjY291bnRMb2dpbkVycm9yLkNhdXNlID0gX2VycjtcbiAgICBzd2l0Y2ggKGVyci5uYW1lKSB7XG4gICAgICBjYXNlIGdldExpdmVLZXlzRXJyb3JzLkdldExpdmVLZXlzRXJyb3IubmFtZTpcbiAgICAgIGNhc2UgZ2V0TGl2ZVRva2VuRXJyb3JzLkdldExpdmVUb2tlbkVycm9yLm5hbWU6XG4gICAgICBjYXNlIGdldFNreXBlVG9rZW5FcnJvcnMuR2V0U2t5cGVUb2tlbkVycm9yLm5hbWU6XG4gICAgICBjYXNlIFdyb25nQ3JlZGVudGlhbHNFcnJvci5uYW1lOlxuICAgICAgY2FzZSBXcm9uZ0NyZWRlbnRpYWxzTGltaXRFcnJvci5uYW1lOlxuICAgICAgICB0aHJvdyBNaWNyb3NvZnRBY2NvdW50TG9naW5FcnJvci5jcmVhdGUoZXJyKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IF9lcnI7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTG9hZExpdmVLZXlzT3B0aW9ucyB7XG4gIGh0dHBJbzogaW8uSHR0cElvO1xuICBjb29raWVzOiB0b3VnaENvb2tpZS5TdG9yZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBMaXZlS2V5cyB7XG4gIC8qKlxuICAgKiBNaWNyb1NvZnQgUCBSZXF1ID9cbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqIC0gYFwiJHV1aWQtNDZmNmQyYjItZmY5OC00NDQ2LWFhZmItMmJhOTljMGMwNjM4XCJgXG4gICAqL1xuICBNU1BSZXF1OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE1pY3JvU29mdCBQIE9LID9cbiAgICpcbiAgICogRXhhbXBsZXM6XG4gICAqIC0gYFwibHQ9MTQ4MzgyNjYzNSZjbz0xJmlkPTI5MzI5MFwiYFxuICAgKi9cbiAgTVNQT0s6IHN0cmluZztcblxuICAvKipcbiAgICogUFBGIFRva2VuID9cbiAgICpcbiAgICogRXhhbXBsZXM6IChzZWUgc3BlYylcbiAgICovXG4gIFBQRlQ6IHN0cmluZztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldExpdmVLZXlzKG9wdGlvbnM6IExvYWRMaXZlS2V5c09wdGlvbnMpOiBQcm9taXNlPExpdmVLZXlzPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgdXJpOiBzdHJpbmcgPSB1cmwucmVzb2x2ZShza3lwZUxvZ2luVXJpLCBwYXRoLnBvc2l4LmpvaW4oXCJvYXV0aFwiLCBcIm1pY3Jvc29mdFwiKSk7XG4gICAgY29uc3QgcXVlcnlTdHJpbmc6IHtba2V5OiBzdHJpbmddOiBzdHJpbmd9ID0ge1xuICAgICAgY2xpZW50X2lkOiB3ZWJDbGllbnRMaXZlTG9naW5JZCxcbiAgICAgIHJlZGlyZWN0X3VyaTogc2t5cGVXZWJVcmksXG4gICAgfTtcbiAgICBjb25zdCBnZXRPcHRpb25zOiBpby5HZXRPcHRpb25zID0ge3VyaSwgcXVlcnlTdHJpbmcsIGNvb2tpZXM6IG9wdGlvbnMuY29va2llc307XG5cbiAgICBsZXQgcmVzcG9uc2U6IGlvLlJlc3BvbnNlO1xuICAgIHRyeSB7XG4gICAgICByZXNwb25zZSA9IGF3YWl0IG9wdGlvbnMuaHR0cElvLmdldChnZXRPcHRpb25zKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRocm93IGh0dHBFcnJvcnMuUmVxdWVzdEVycm9yLmNyZWF0ZShlcnIsIGdldE9wdGlvbnMpO1xuICAgIH1cblxuICAgIGxldCBtc3BSZXF1OiBzdHJpbmcgfCB1bmRlZmluZWQ7XG4gICAgbGV0IG1zcE9rOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICAvLyBSZXRyaWV2ZSB2YWx1ZXMgZm9yIHRoZSBjb29raWVzIFwiTVNQUmVxdVwiIGFuZCBcIk1TUE9LXCJcbiAgICBjb25zdCBjb29raWVzOiB0b3VnaENvb2tpZS5Db29raWVbXSA9IG5ldyB0b3VnaENvb2tpZS5Db29raWVKYXIob3B0aW9ucy5jb29raWVzKVxuICAgICAgLmdldENvb2tpZXNTeW5jKFwiaHR0cHM6Ly9sb2dpbi5saXZlLmNvbS9cIik7XG4gICAgZm9yIChjb25zdCBjb29raWUgb2YgY29va2llcykge1xuICAgICAgc3dpdGNoIChjb29raWUua2V5KSB7XG4gICAgICAgIGNhc2UgXCJNU1BSZXF1XCI6XG4gICAgICAgICAgbXNwUmVxdSA9IGNvb2tpZS52YWx1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIk1TUE9LXCI6XG4gICAgICAgICAgbXNwT2sgPSBjb29raWUudmFsdWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgLy8gSWdub3JlIG90aGVyIGNvb2tpZXNcbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodHlwZW9mIG1zcE9rICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aHJvdyBnZXRMaXZlS2V5c0Vycm9ycy5Nc3Bva0Nvb2tpZU5vdEZvdW5kRXJyb3IuY3JlYXRlKGdldE9wdGlvbnMsIHJlc3BvbnNlKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBtc3BSZXF1ICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICB0aHJvdyBnZXRMaXZlS2V5c0Vycm9ycy5Nc3ByZXF1Q29va2llTm90Rm91bmRFcnJvci5jcmVhdGUoZ2V0T3B0aW9ucywgcmVzcG9uc2UpO1xuICAgIH1cblxuICAgIGNvbnN0IHBwZnRLZXk6IHN0cmluZyA9IHNjcmFwTGl2ZVBwZnRLZXkocmVzcG9uc2UuYm9keSk7XG4gICAgcmV0dXJuIHtcbiAgICAgIE1TUFJlcXU6IG1zcFJlcXUsXG4gICAgICBNU1BPSzogbXNwT2ssXG4gICAgICBQUEZUOiBwcGZ0S2V5LFxuICAgIH07XG4gIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICBjb25zdCBlcnI6IGdldExpdmVLZXlzRXJyb3JzLkdldExpdmVLZXlzRXJyb3IuQ2F1c2UgPSBfZXJyO1xuICAgIHN3aXRjaCAoZXJyLm5hbWUpIHtcbiAgICAgIGNhc2UgaHR0cEVycm9ycy5SZXF1ZXN0RXJyb3IubmFtZTpcbiAgICAgIGNhc2UgZ2V0TGl2ZUtleXNFcnJvcnMuTXNwb2tDb29raWVOb3RGb3VuZEVycm9yLm5hbWU6XG4gICAgICBjYXNlIGdldExpdmVLZXlzRXJyb3JzLk1zcHJlcXVDb29raWVOb3RGb3VuZEVycm9yLm5hbWU6XG4gICAgICBjYXNlIGdldExpdmVLZXlzRXJyb3JzLlBwZnRLZXlOb3RGb3VuZEVycm9yLm5hbWU6XG4gICAgICAgIHRocm93IGdldExpdmVLZXlzRXJyb3JzLkdldExpdmVLZXlzRXJyb3IuY3JlYXRlKGVycik7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBfZXJyO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgUFBGVCBrZXkgZnJvbSB0aGUgSFRNTCByZXNwb25zZSBmcm9tIGxvZ2luLmxpdmUuY29tIHRvIGdldCB0aGUgTGl2ZSBrZXlzLlxuICpcbiAqIEBwYXJhbSBodG1sIFRoZSBodG1sIGJvZHkgdG8gc2NyYXBcbiAqIEByZXR1cm5zIFRoZSBQUEZUIGtleVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2NyYXBMaXZlUHBmdEtleShodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoICovXG4gIGNvbnN0IHBwZnRSZWdFeHA6IFJlZ0V4cCA9IC88aW5wdXRcXHMrdHlwZT1cImhpZGRlblwiXFxzK25hbWU9XCJQUEZUXCJcXHMraWQ9XCJpMDMyN1wiXFxzK3ZhbHVlPVwiKFsqITAtOWEtekEtWl0rXFwkezEsMn0pXCJcXHMqXFwvPi87XG4gIGNvbnN0IHJlZ0V4cFJlc3VsdDogUmVnRXhwRXhlY0FycmF5IHwgbnVsbCA9IHBwZnRSZWdFeHAuZXhlYyhodG1sKTtcblxuICBpZiAocmVnRXhwUmVzdWx0ID09PSBudWxsKSB7XG4gICAgdGhyb3cgZ2V0TGl2ZUtleXNFcnJvcnMuUHBmdEtleU5vdEZvdW5kRXJyb3IuY3JlYXRlKGh0bWwpO1xuICB9XG5cbiAgcmV0dXJuIHJlZ0V4cFJlc3VsdFsxXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBHZXRMaXZlVG9rZW5PcHRpb25zIHtcbiAgdXNlcm5hbWU6IHN0cmluZztcbiAgcGFzc3dvcmQ6IHN0cmluZztcbiAgbGl2ZUtleXM6IExpdmVLZXlzO1xuICBodHRwSW86IGlvLkh0dHBJbztcbiAgY29va2llczogdG91Z2hDb29raWUuU3RvcmU7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMaXZlVG9rZW4ob3B0aW9uczogR2V0TGl2ZVRva2VuT3B0aW9ucyk6IFByb21pc2U8c3RyaW5nPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcmVzcG9uc2U6IGlvLlJlc3BvbnNlID0gYXdhaXQgcmVxdWVzdExpdmVUb2tlbihvcHRpb25zKTtcbiAgICByZXR1cm4gc2NyYXBMaXZlVG9rZW4ocmVzcG9uc2UuYm9keSk7XG4gIH0gY2F0Y2ggKF9lcnIpIHtcbiAgICBjb25zdCBlcnI6IGdldExpdmVUb2tlbkVycm9ycy5HZXRMaXZlVG9rZW5FcnJvci5DYXVzZSB8IFdyb25nQ3JlZGVudGlhbHNFcnJvciB8IFdyb25nQ3JlZGVudGlhbHNMaW1pdEVycm9yID0gX2VycjtcbiAgICBzd2l0Y2ggKGVyci5uYW1lKSB7XG4gICAgICBjYXNlIGh0dHBFcnJvcnMuUmVxdWVzdEVycm9yLm5hbWU6XG4gICAgICBjYXNlIGdldExpdmVUb2tlbkVycm9ycy5MaXZlVG9rZW5Ob3RGb3VuZEVycm9yLm5hbWU6XG4gICAgICAgIHRocm93IGdldExpdmVUb2tlbkVycm9ycy5HZXRMaXZlVG9rZW5FcnJvci5jcmVhdGUoZXJyKTtcbiAgICAgIGNhc2UgV3JvbmdDcmVkZW50aWFsc0Vycm9yLm5hbWU6XG4gICAgICAgIGlmICh0eXBlb2YgZXJyLmRhdGEudXNlcm5hbWUgIT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICB0aHJvdyBXcm9uZ0NyZWRlbnRpYWxzRXJyb3IuY3JlYXRlKG9wdGlvbnMudXNlcm5hbWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgICAgY2FzZSBXcm9uZ0NyZWRlbnRpYWxzTGltaXRFcnJvci5uYW1lOlxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgX2VycjtcbiAgICB9XG4gIH1cbn1cblxuLy8gR2V0IGxpdmUgdG9rZW4gZnJvbSBsaXZlIGtleXMgYW5kIGNyZWRlbnRpYWxzXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcmVxdWVzdExpdmVUb2tlbihvcHRpb25zOiBHZXRMaXZlVG9rZW5PcHRpb25zKTogUHJvbWlzZTxpby5SZXNwb25zZT4ge1xuICBjb25zdCB1cmk6IHN0cmluZyA9IHVybC5yZXNvbHZlKGxpdmVMb2dpblVyaSwgcGF0aC5wb3NpeC5qb2luKFwicHBzZWN1cmVcIiwgXCJwb3N0LnNyZlwiKSk7XG4gIGNvbnN0IHF1ZXJ5U3RyaW5nOiB7W2tleTogc3RyaW5nXTogc3RyaW5nfSA9IHtcbiAgICB3YTogXCJ3c2lnbmluMS4wXCIsXG4gICAgd3A6IFwiTUJJX1NTTFwiLFxuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTptYXgtbGluZS1sZW5ndGhcbiAgICB3cmVwbHk6IFwiaHR0cHM6Ly9sdy5za3lwZS5jb20vbG9naW4vb2F1dGgvcHJveHk/Y2xpZW50X2lkPTU3ODEzNCZzaXRlX25hbWU9bHcuc2t5cGUuY29tJnJlZGlyZWN0X3VyaT1odHRwcyUzQSUyRiUyRndlYi5za3lwZS5jb20lMkZcIixcbiAgfTtcbiAgLy8gTVNQUmVxdSBzaG91bGQgYWxyZWFkeSBiZSBzZXRcbiAgLy8gTVNQT0sgc2hvdWxkIGFscmVhZHkgYmUgc2V0XG4gIGNvbnN0IG1pbGxpc2Vjb25kc1NpbmNlRXBvY2g6IG51bWJlciA9IERhdGUubm93KCk7IC8vIE1pbGxpc2Vjb25kcyBzaW5jZSBlcG9jaFxuICBjb25zdCBja1RzdENvb2tpZTogdG91Z2hDb29raWUuQ29va2llID0gbmV3ICg8YW55PiB0b3VnaENvb2tpZS5Db29raWUpKHtcbiAgICBrZXk6IFwiQ2tUc3RcIixcbiAgICB2YWx1ZTogbWlsbGlzZWNvbmRzU2luY2VFcG9jaC50b1N0cmluZygxMCksXG4gIH0pO1xuXG4gIG5ldyB0b3VnaENvb2tpZS5Db29raWVKYXIob3B0aW9ucy5jb29raWVzKS5zZXRDb29raWVTeW5jKGNrVHN0Q29va2llLCBcImh0dHBzOi8vbG9naW4ubGl2ZS5jb20vXCIpO1xuXG4gIGNvbnN0IGZvcm1EYXRhOiBhbnkgPSB7XG4gICAgbG9naW46IG9wdGlvbnMudXNlcm5hbWUsXG4gICAgcGFzc3dkOiBvcHRpb25zLnBhc3N3b3JkLFxuICAgIFBQRlQ6IG9wdGlvbnMubGl2ZUtleXMuUFBGVCxcbiAgfTtcblxuICBjb25zdCBwb3N0T3B0aW9uczogaW8uUG9zdE9wdGlvbnMgPSB7XG4gICAgdXJpLFxuICAgIHF1ZXJ5U3RyaW5nLFxuICAgIGNvb2tpZXM6IG9wdGlvbnMuY29va2llcyxcbiAgICBmb3JtOiBmb3JtRGF0YSxcbiAgfTtcblxuICB0cnkge1xuICAgIHJldHVybiBvcHRpb25zLmh0dHBJby5wb3N0KHBvc3RPcHRpb25zKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgdGhyb3cgaHR0cEVycm9ycy5SZXF1ZXN0RXJyb3IuY3JlYXRlKGVyciwgcG9zdE9wdGlvbnMpO1xuICB9XG59XG5cbi8qKlxuICogU2NyYXAgdGhlIHJlc3VsdCBvZiBhIHNlbmRDcmVkZW50aWFscyByZXF1ZXN0cyB0byByZXRyaWV2ZSB0aGUgdmFsdWUgb2YgdGhlIGB0YCBwYXJhbWV0ZXJcbiAqIEBwYXJhbSBodG1sXG4gKiBAcmV0dXJucyBUaGUgdG9rZW4gcHJvdmlkZWQgYnkgTGl2ZSBmb3IgU2t5cGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcmFwTGl2ZVRva2VuKGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XG4gIC8vIFRPRE8oZGVtdXJnb3MpOiBIYW5kbGUgdGhlIHBvc3NpYmxlIGZhaWx1cmUgb2YgLmxvYWQgKGludmFsaWQgSFRNTClcbiAgY29uc3QgJDogQ2hlZXJpb1N0YXRpYyA9IGNoZWVyaW8ubG9hZChodG1sKTtcbiAgY29uc3QgdG9rZW5Ob2RlOiBDaGVlcmlvID0gJChcIiN0XCIpO1xuICBjb25zdCB0b2tlblZhbHVlOiBzdHJpbmcgfCB1bmRlZmluZWQgPSB0b2tlbk5vZGUudmFsKCk7XG4gIGlmICh0b2tlblZhbHVlID09PSB1bmRlZmluZWQgfHwgdG9rZW5WYWx1ZSA9PT0gXCJcIikge1xuICAgIGlmIChodG1sLmluZGV4T2YoXCJzRXJyVHh0OidZb3VyIGFjY291bnQgb3IgcGFzc3dvcmQgaXMgaW5jb3JyZWN0LlwiKSA+PSAwKSB7XG4gICAgICB0aHJvdyBXcm9uZ0NyZWRlbnRpYWxzRXJyb3IuY3JlYXRlKCk7XG4gICAgICAvKiB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bWF4LWxpbmUtbGVuZ3RoICovXG4gICAgfSBlbHNlIGlmIChodG1sLmluZGV4T2YoXCJzRXJyVHh0OlxcXCJZb3VcXFxcJ3ZlIHRyaWVkIHRvIHNpZ24gaW4gdG9vIG1hbnkgdGltZXMgd2l0aCBhbiBpbmNvcnJlY3QgYWNjb3VudCBvciBwYXNzd29yZC5cXFwiXCIpID49IDApIHtcbiAgICAgIHRocm93IFdyb25nQ3JlZGVudGlhbHNMaW1pdEVycm9yLmNyZWF0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBUT0RPKGRlbXVyZ29zKTogQ2hlY2sgaWYgdGhlcmUgaXMgYSBQUEZUIHRva2VuIChyZWRpcmVjdGVkIHRvIHRoZSBnZXRMaXZlS2V5cyByZXNwb25zZSlcbiAgICAgIHRocm93IGdldExpdmVUb2tlbkVycm9ycy5MaXZlVG9rZW5Ob3RGb3VuZEVycm9yLmNyZWF0ZShodG1sKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRva2VuVmFsdWU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2V0U2t5cGVUb2tlbk9wdGlvbnMge1xuICBsaXZlVG9rZW46IHN0cmluZztcbiAgaHR0cElvOiBpby5IdHRwSW87XG4gIGNvb2tpZXM6IHRvdWdoQ29va2llLlN0b3JlO1xufVxuXG4vKipcbiAqIENvbXBsZXRlIHRoZSBPQXV0aCB3b3JrZmxvdyBhbmQgZ2V0IHRoZSBTa3lwZSB0b2tlblxuICpcbiAqIEBwYXJhbSBvcHRpb25zXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTa3lwZVRva2VuKG9wdGlvbnM6IEdldFNreXBlVG9rZW5PcHRpb25zKTogUHJvbWlzZTxTa3lwZVRva2VuPiB7XG4gIHRyeSB7XG4gICAgY29uc3Qgc3RhcnRUaW1lOiBudW1iZXIgPSBEYXRlLm5vdygpO1xuICAgIGNvbnN0IHJlczogaW8uUmVzcG9uc2UgPSBhd2FpdCByZXF1ZXN0U2t5cGVUb2tlbihvcHRpb25zKTtcbiAgICBjb25zdCBzY3JhcHBlZDogU2t5cGVUb2tlblJlc3BvbnNlID0gc2NyYXBTa3lwZVRva2VuUmVzcG9uc2UocmVzLmJvZHkpO1xuICAgIC8vIEV4cGlyZXMgaW4gKHNlY29uZHMpIChkZWZhdWx0OiAxIGRheSlcbiAgICBjb25zdCBleHBpcmVzSW46IG51bWJlciA9IHR5cGVvZiBzY3JhcHBlZC5leHBpcmVzX2luID09PSBcIm51bWJlclwiID8gc2NyYXBwZWQuZXhwaXJlc19pbiA6IDg2NDAwMDtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsdWU6IHNjcmFwcGVkLnNreXBldG9rZW4sXG4gICAgICBleHBpcmF0aW9uRGF0ZTogbmV3IERhdGUoc3RhcnRUaW1lICsgZXhwaXJlc0luICogMTAwMCksXG4gICAgfTtcbiAgfSBjYXRjaCAoX2Vycikge1xuICAgIGNvbnN0IGVycjogZ2V0U2t5cGVUb2tlbkVycm9ycy5HZXRTa3lwZVRva2VuRXJyb3IuQ2F1c2UgPSBfZXJyO1xuICAgIHN3aXRjaCAoZXJyLm5hbWUpIHtcbiAgICAgIGNhc2UgaHR0cEVycm9ycy5SZXF1ZXN0RXJyb3IubmFtZTpcbiAgICAgIGNhc2UgZ2V0U2t5cGVUb2tlbkVycm9ycy5Ta3lwZVRva2VuTm90Rm91bmRFcnJvci5uYW1lOlxuICAgICAgICB0aHJvdyBnZXRTa3lwZVRva2VuRXJyb3JzLkdldFNreXBlVG9rZW5FcnJvci5jcmVhdGUoZXJyKTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHRocm93IF9lcnI7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiByZXF1ZXN0U2t5cGVUb2tlbihvcHRpb25zOiBHZXRTa3lwZVRva2VuT3B0aW9ucyk6IFByb21pc2U8aW8uUmVzcG9uc2U+IHtcbiAgY29uc3QgdXJpOiBzdHJpbmcgPSB1cmwucmVzb2x2ZShza3lwZUxvZ2luVXJpLCBcIm1pY3Jvc29mdFwiKTtcblxuICBjb25zdCBxdWVyeVN0cmluZzoge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgY2xpZW50X2lkOiBcIjU3ODEzNFwiLFxuICAgIHJlZGlyZWN0X3VyaTogXCJodHRwczovL3dlYi5za3lwZS5jb21cIixcbiAgfTtcblxuICBjb25zdCBmb3JtRGF0YToge1trZXk6IHN0cmluZ106IHN0cmluZ30gPSB7XG4gICAgdDogb3B0aW9ucy5saXZlVG9rZW4sXG4gICAgY2xpZW50X2lkOiBcIjU3ODEzNFwiLFxuICAgIG9hdXRoUGFydG5lcjogXCI5OTlcIixcbiAgICBzaXRlX25hbWU6IFwibHcuc2t5cGUuY29tXCIsXG4gICAgcmVkaXJlY3RfdXJpOiBcImh0dHBzOi8vd2ViLnNreXBlLmNvbVwiLFxuICB9O1xuXG4gIGNvbnN0IHBvc3RPcHRpb25zOiBpby5Qb3N0T3B0aW9ucyA9IHtcbiAgICB1cmksXG4gICAgcXVlcnlTdHJpbmcsXG4gICAgZm9ybTogZm9ybURhdGEsXG4gIH07XG5cbiAgdHJ5IHtcbiAgICByZXR1cm4gb3B0aW9ucy5odHRwSW8ucG9zdChwb3N0T3B0aW9ucyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHRocm93IGh0dHBFcnJvcnMuUmVxdWVzdEVycm9yLmNyZWF0ZShlcnIsIHBvc3RPcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNreXBlVG9rZW5SZXNwb25zZSB7XG4gIHNreXBldG9rZW46IHN0cmluZztcbiAgZXhwaXJlc19pbjogbnVtYmVyIHwgdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIFNjcmFwIHRvIGdldCB0aGUgU2t5cGUgT0F1dGggdG9rZW5cbiAqXG4gKiBAcGFyYW0gaHRtbFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjcmFwU2t5cGVUb2tlblJlc3BvbnNlKGh0bWw6IHN0cmluZyk6IFNreXBlVG9rZW5SZXNwb25zZSB7XG4gIC8vIFRPRE8oZGVtdXJnb3MpOiBIYW5kbGUgLmxvYWQgZXJyb3JzIChpbnZhbGlkIEhUTUwpXG4gIGNvbnN0ICQ6IENoZWVyaW9TdGF0aWMgPSBjaGVlcmlvLmxvYWQoaHRtbCk7XG4gIGNvbnN0IHNreXBlVG9rZW5Ob2RlOiBDaGVlcmlvID0gJChcImlucHV0W25hbWU9c2t5cGV0b2tlbl1cIik7XG4gIC8vIEluIHNlY29uZHNcbiAgY29uc3QgZXhwaXJlc0luTm9kZTogQ2hlZXJpbyA9ICQoXCJpbnB1dFtuYW1lPWV4cGlyZXNfaW5dXCIpO1xuXG4gIGNvbnN0IHNreXBlVG9rZW46IHN0cmluZyB8IHVuZGVmaW5lZCA9IHNreXBlVG9rZW5Ob2RlLnZhbCgpO1xuICBjb25zdCBleHBpcmVzSW46IG51bWJlciB8IHVuZGVmaW5lZCA9IHBhcnNlSW50KGV4cGlyZXNJbk5vZGUudmFsKCksIDEwKTtcblxuICBpZiAodHlwZW9mIHNreXBlVG9rZW4gIT09IFwic3RyaW5nXCIpIHtcbiAgICBnZXRTa3lwZVRva2VuRXJyb3JzLlNreXBlVG9rZW5Ob3RGb3VuZEVycm9yLmNyZWF0ZShodG1sKTtcbiAgfVxuXG4gIC8vIGlmICghc2t5cGV0b2tlbiB8fCAhZXhwaXJlc19pbikge1xuICAvLyAgIGNvbnN0IHNreXBlRXJyb3JNZXNzYWdlID0gJChcIi5tZXNzYWdlX2Vycm9yXCIpLnRleHQoKTtcbiAgLy8gICBjb25zdCBlcnJvck5hbWUgPSBcImF1dGhlbnRpY2F0aW9uLWZhaWxlZFwiO1xuICAvLyAgIGNvbnN0IGVycm9yTWVzc2FnZSA9IFwiRmFpbGVkIHRvIGdldCBza3lwZXRva2VuLiBVc2VybmFtZSBvciBwYXNzd29yZCBpcyBpbmNvcnJlY3QgT1IgeW91J3ZlIGhpdCBhIENBUFRDSEEgd2FsbC5cIjtcbiAgLy8gICBpZiAoc2t5cGVFcnJvck1lc3NhZ2UpIHtcbiAgLy8gICAgIGNvbnN0IHNreXBlRXJyb3IgPSBuZXcgSW5jaWRlbnQoXCJza3lwZS1lcnJvclwiLCBza3lwZUVycm9yTWVzc2FnZSk7XG4gIC8vICAgICB0aHJvdyBuZXcgSW5jaWRlbnQoc2t5cGVFcnJvciwgZXJyb3JOYW1lLCBlcnJvck1lc3NhZ2UpO1xuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICB0aHJvdyBuZXcgSW5jaWRlbnQoZXJyb3JOYW1lLCBlcnJvck1lc3NhZ2UpO1xuICAvLyAgIH1cbiAgLy8gfVxuICAvLyByZXR1cm4gcmVzdWx0O1xuXG4gIHJldHVybiB7XG4gICAgc2t5cGV0b2tlbjogc2t5cGVUb2tlbixcbiAgICBleHBpcmVzX2luOiBleHBpcmVzSW4sXG4gIH07XG59XG4iXSwic291cmNlUm9vdCI6Ii4uIn0=
