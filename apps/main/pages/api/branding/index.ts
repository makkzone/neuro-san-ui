/**
 * Next.js API route to provide branding colors using LangChain and OpenAI.
 */

import {SUGGEST_BRANDING_COLORS_PROMPT} from "./prompts"
import {createLLMHandler} from "../utils/llmHandler"

export default createLLMHandler({
    allowedMethod: "GET",
    promptTemplate: SUGGEST_BRANDING_COLORS_PROMPT,
    extractVariables: (req) => ({
        company: req.query["company"] as string,
    }),
})
