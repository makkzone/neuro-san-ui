/**
 * Controller module for interacting with the DMS CHAT LLM API.
 */

/**
 * Access the API for DMS chat.
 *
 */
export async function sendDmsChatQuery(userQuery: string, context: object, prescriptorUrl: string,
                                       predictorUrls: string[], callback: (string) => void) {
    const res = await  fetch("/api/gpt/dmschat", {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userQuery: userQuery,
            context: context,
            prescriptorUrl: prescriptorUrl,
            predictorUrls: predictorUrls
        })
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
