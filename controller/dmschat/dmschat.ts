/**
 * Controller module for interacting with the DMS CHAT LLM API.
 */

import {ChatMessage} from "langchain/schema";

/**
 * Access the API for DMS chat. Client is responsible for catching and handling exceptions that may be thrown.
 *
 * @param userQuery The user's query.
 * @param context The context part of the CAO.
 * @param prescriptorUrl The URL of the prescriptor for inference.
 * @param predictorUrls The URLs of the predictors for inference.
 * @param callback The callback function to be called when a chunk of data is received from the server.
 * @param signal The AbortSignal object to be used for aborting the request.
 * @param chatHistory The chat history to be sent to the server. Contains user requests and server responses.
 */
export async function sendDmsChatQuery(userQuery: string, context: object, prescriptorUrl: string,
                                       predictorUrls: string[], callback: (string) => void, signal: AbortSignal,
                                       chatHistory?: ChatMessage[]) {
    const res = await  fetch("/api/gpt/dmschat", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            chatHistory: chatHistory,
            context: context,
            predictorUrls: predictorUrls,
            prescriptorUrl: prescriptorUrl,
            userQuery: userQuery
        }),
        signal: signal
    })

    const reader = res.body.getReader()
    const utf8decoder = new TextDecoder("utf8")

    // eslint-disable-next-line no-constant-condition
    while (true) {
        const {done, value} = await reader.read()

        if (done) {
            break; // End of stream
        }

        // Decode chunk from server
        const chunk = utf8decoder.decode(value)

        // Send current chunk to callback
        callback(chunk)
    }
}
