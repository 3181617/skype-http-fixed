import { DocumentType } from "kryo/types/document";
/**
 * Example (concierge bot):
 * ```
 * {
 *   "capabilities": [],
 *   "trusted": true,
 *   "type": "Participant"
 * }
 * ```
 *
 * Example (concierge bot, from a new user):
 * ```
 * {
 *   "trusted": "True",
 *   "type": "Participant"
 * }
 * ```
 */
export interface AgentInfo {
    capabilities?: any[];
    trusted: boolean | "True";
    /**
     * `"Participant" | ...`
     */
    type: string;
}
export declare const $AgentInfo: DocumentType<AgentInfo>;
