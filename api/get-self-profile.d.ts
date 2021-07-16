import toughCookie from "tough-cookie";
import { SkypeToken } from "../interfaces/api/context";
import * as io from "../interfaces/http-io";
import { ApiProfile } from "../types/api-profile";
export declare function getSelfProfile(httpIo: io.HttpIo, cookies: toughCookie.Store, skypeToken: SkypeToken): Promise<ApiProfile>;
