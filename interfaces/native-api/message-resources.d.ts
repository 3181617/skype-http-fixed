import { MessageResource } from "./resources";
export interface Control extends MessageResource {
    messagetype: "Control/LiveState" | "Control/ClearTyping" | "Control/Typing";
}
export interface ControlClearTyping extends Control {
    messagetype: "Control/ClearTyping";
    counterpartymessageid: string;
}
export interface ControlTyping extends Control {
    messagetype: "Control/Typing";
    counterpartymessageid: string;
}
export interface ControlLiveState extends Control {
    messagetype: "Control/LiveState";
    content: string;
}
export interface ControlLiveStateParticipant {
    Identity: string;
    LiveIdentity: string;
    VoiceStatus: number;
    LiveStartTimestamp: number;
}
export interface ControlLiveStateStatistic {
    Id: string;
    LiveId: string;
    CumTime: number;
}
export interface ControlLiveStateContent {
    AccessToken: "NgAccessToken" | string;
    GUID: string;
    MaxLiveParticipants: number;
    NodeInfo: string;
    Participants: ControlLiveStateParticipant[];
    Statistics: ControlLiveStateStatistic[];
    Part: {
        Identity: string;
        LiveIdentity: string;
        VoiceStatus: number;
        LiveStartTimestamp: number;
    };
    Stats: {
        Id: string;
        LiveId: string;
        CumTime: number;
    };
}
export interface EventCall extends MessageResource {
    messagetype: "Event/Call";
    clientmessageid: string;
    content: string;
    skypeguid: string;
}
export interface SignalFlamingo extends MessageResource {
    messagetype: "Signal/Flamingo";
    content: string;
    skypeguid: string;
}
export interface Text extends MessageResource {
    messagetype: "Text";
    clientmessageid: string;
    content: string;
}
export interface RichText extends MessageResource {
    messagetype: "RichText";
    clientmessageid: string;
    content: string;
}
export interface UriObject extends MessageResource {
    messagetype: "RichText/UriObject";
    clientmessageid: string;
    content: string;
}
export interface LocationObject extends MessageResource {
    messagetype: "RichText/Location";
    clientmessageid: string;
    content: string;
}
export interface MediaGenericFile extends MessageResource {
    messagetype: "RichText/Media_GenericFile";
    clientmessageid: string;
    content: string;
}
export interface MediaVideo extends MessageResource {
    messagetype: "RichText/Media_Video";
    clientmessageid: string;
    content: string;
}
