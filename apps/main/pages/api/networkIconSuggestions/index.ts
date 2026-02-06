/**
 * Next.js API route to suggest icons for networks using LangChain and OpenAI.
 */

import {SUGGEST_NETWORK_ICONS_PROMPT} from "./prompts"
import {createLLMHandler} from "../Common/LlmHandler"

export default createLLMHandler({
    allowedMethod: "POST",
    promptTemplate: SUGGEST_NETWORK_ICONS_PROMPT,
    extractVariables: (req) => ({
        network_list: typeof req.body === "object" ? JSON.stringify(req.body, null, 2) : req.body,
    }),
})
