/**
 * Controller module for interacting with the Agent LLM API.
 */

import {ChatRequest, ChatResponse, LogsRequest, LogsResponse} from "../../generated/agent"
import {AgentChatRequest, AgentLogsRequest, AgentType} from "../../generated/metadata"
import useEnvironmentStore from "../../state/environment"
import {sendLlmRequest} from "../llm/llm_chat"

const CHAT_PATH = "api/v1/agent/chat"
const LOGS_PATH = "api/v1/agent/logs"

export async function getLogs(sessionId: string, signal: AbortSignal, requestUser: string): Promise<LogsResponse> {
    const baseUrl = useEnvironmentStore.getState().backendApiUrl
    const fetchUrl = `${baseUrl}/${LOGS_PATH}`
    const agentLogsRequest: AgentLogsRequest = AgentLogsRequest.fromPartial({
        user: {login: requestUser},
        request: LogsRequest.fromPartial({sessionId: sessionId}),
        targetAgent: AgentType.OPPORTUNITY_FINDER_PIPELINE,
    })

    console.debug("logs request: ", agentLogsRequest)

    const requestJSON = AgentLogsRequest.toJSON(agentLogsRequest)

    const requestRecord = Object.entries(requestJSON).reduce(
        (acc, [key, value]) => (value ? {...acc, [key]: value} : acc),
        {}
    )

    const result = await sendLlmRequest(null, signal, fetchUrl, requestRecord, null)
    console.debug("result: ", result)

    return LogsResponse.fromJSON(result)
}

export async function sendChatQuery(
    signal: AbortSignal,
    userInput: string,
    requestUser: string
): Promise<ChatResponse> {
    const baseUrl = useEnvironmentStore.getState().backendApiUrl
    const fetchUrl = `${baseUrl}/${CHAT_PATH}`
    const agentChatRequest: AgentChatRequest = {
        user: {login: requestUser},
        request: ChatRequest.fromPartial({userInput: userInput}),
        targetAgent: AgentType.OPPORTUNITY_FINDER_PIPELINE,
    }

    const requestJSON = AgentChatRequest.toJSON(agentChatRequest)

    const requestRecord = Object.entries(requestJSON).reduce(
        (acc, [key, value]) => (value ? {...acc, [key]: value} : acc),
        {}
    )

    const result = await sendLlmRequest(null, signal, fetchUrl, requestRecord, null)
    console.debug("result: ", result)
    return ChatResponse.fromJSON(result)
}
