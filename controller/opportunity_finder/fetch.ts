/**
 * Controller for Opportunity Finder chat requests
 */

import {BaseMessage} from "@langchain/core/messages"

import {LegacyAgentType} from "../../components/AgentChat/common"
import {sendLlmRequest} from "../llm/llm_chat"

export async function sendOpportunityFinderRequest(
    userQuery: string,
    requestType: LegacyAgentType,
    callback: (token: string) => void,
    signal: AbortSignal,
    chatHistory: BaseMessage[]
) {
    await sendLlmRequest(callback, signal, "/api/gpt/opportunityFinder", {requestType}, userQuery, chatHistory)
}
