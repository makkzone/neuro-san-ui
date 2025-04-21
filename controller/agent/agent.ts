/**
 * Controller module for interacting with the Agent LLM API.
 */
import {ConnectivityResponse} from "../../components/AgentChat/Types"
import type {components} from "../../generated/neuro-san/NeuroSanClient"

import {AgentConnectivityRequest, AgentFunctionRequest, AgentType} from "../../generated/metadata"
import useEnvironmentStore from "../../state/environment"
import {sendLlmRequest} from "../llm/llm_chat"

type ChatContext = components["schemas"]["ChatContext"]
type ChatRequest = components["schemas"]["ChatRequest"]
type ChatResponse = components["schemas"]["ChatResponse"]
type ChatMessage = components["schemas"]["ChatMessage"]
type ConciergeResponse = components["schemas"]["ConciergeResponse"]

export async function getAgentNetworks(): Promise<string[]> {
    const path = "https://neuro-san.decisionai.ml/api/v1/list"

    const response = await fetch(path)
    const conciergeResponse: ConciergeResponse = (await response.json()) as ConciergeResponse
    return conciergeResponse.agents.map((network) => network.agent_name)
}

/**
 * Send a chat query to the Agent LLM API. This opens a session with the agent network.
 * @param signal The AbortSignal to use for the request. Used to cancel the request on user demand
 * @param userInput The user input to send to the agent.
 * In practice this "input" will actually be the output from one of the previous agents such as the data generator
 * or scoping agent.
 * @param requestUser The user making the request
 * @param targetAgent The target agent to send the request to. See CombinedAgentType for the list of available agents.
 * @param callback The callback function to be called when a chunk of data is received from the server.
 * @param chatContext "Opaque" conversation context for maintaining conversation state with the server. Neuro-san
 * agents do not use ChatHistory directly, but rather, ChatContext, which is a collection of ChatHistory objects.
 * @returns The response from the agent network.
 */
export async function sendChatQuery(
    signal: AbortSignal,
    userInput: string,
    requestUser: string,
    targetAgent: AgentType,
    callback: (chunk: string) => void,
    chatContext: ChatContext
): Promise<ChatResponse> {
    // Create request
    const userMessage: ChatMessage = {
        type: 2,
        text: userInput,
    }

    const agentChatRequest: ChatRequest = {
        sly_data: {login: requestUser},
        user_message: userMessage,
        chat_filter: {chat_filter_type: 2},
        chat_context: chatContext,
    }

    // https://neuro-san.decisionai.ml/api/v1/telco_network_support/streaming_chat
    const fetchUrl = `https://neuro-san.decisionai.ml/api/v1/${targetAgent.toLocaleLowerCase()}/streaming_chat`
    const requestRecord: Record<string, unknown> = Object.entries(agentChatRequest).reduce(
        (acc, [key, value]) => (value ? {...acc, [key]: value} : acc),
        {}
    )

    // decode from base64
    return sendLlmRequest(callback, signal, fetchUrl, requestRecord, null)
}

/**
 * Gets information on what a specified agent is connected to (other agents and tools)
 * @param requestUser The user making the request
 * @param targetAgent The agent to get connectivity information for
 * @returns The connectivity info as a <code>ConnectivityResponse</code> object
 * @throws Various exceptions if anything goes wrong such as network issues or invalid agent type.
 * Caller is responsible for try-catch.
 */
export async function getConnectivity(requestUser: string, targetAgent: AgentType): Promise<ConnectivityResponse> {
    const fetchUrl = `https://neuro-san.decisionai.ml/api/v1/${targetAgent.toLocaleLowerCase()}/connectivity`

    const connectivityRequest: AgentConnectivityRequest = {
        targetAgent: targetAgent,
        user: {login: requestUser},
        request: undefined,
    }

    console.debug(`connectivityRequest: ${JSON.stringify(connectivityRequest)}`)

    const response = await fetch(fetchUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
        // body: JSON.stringify(connectivityRequest),
    })

    if (!response.ok) {
        console.debug(`response: ${JSON.stringify(response)}`)
        throw new Error(`Failed to send connectivity request: ${response.statusText}`)
    }

    const result = await response.json()
    return result
}

/**
 * Get the function of a specified agent meaning its brief description
 * @param requestUser The user making the request
 * @param targetAgent The agent to get the function for
 * @returns The function info as a <code>FunctionResponse</code> object
 * @throws Various exceptions if anything goes wrong such as network issues or invalid agent type.
 */
export async function getAgentFunction(requestUser: string, targetAgent: AgentType): Promise<FunctionResponse> {
    const baseUrl = useEnvironmentStore.getState().backendApiUrl
    const fetchUrl = `${baseUrl}/${AGENT_FUNCTION_PATH}`

    const request: AgentFunctionRequest = {
        targetAgent: targetAgent,
        user: {login: requestUser},
        request: undefined,
    }

    // Convert to JSON (wire) format
    const requestJSON = AgentFunctionRequest.toJSON(request)

    const response = await fetch(fetchUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(requestJSON),
    })

    if (!response.ok) {
        throw new Error(`Failed to send agent function request: ${response.statusText}`)
    }

    const result = await response.json()
    return FunctionResponse.fromJSON(result)
}
