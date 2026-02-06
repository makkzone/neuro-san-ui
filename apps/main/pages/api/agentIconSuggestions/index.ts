/**
 * Next.js API route to suggest icons for agents using LangChain and OpenAI.
 */

import {SUGGEST_AGENT_ICONS_PROMPT} from "./prompts"
import {createLLMHandler} from "../utils/llmHandler"

export default createLLMHandler({
    allowedMethod: "POST",
    promptTemplate: SUGGEST_AGENT_ICONS_PROMPT,
    extractVariables: (req) => ({
        connectivity_info: req.body.connectivity_info,
        metadata: req.body.metadata,
    }),
})
