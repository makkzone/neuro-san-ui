/**
 * Next.js API route to suggest icons for networks using LangChain and OpenAI.
 */

import {ChatOpenAI} from "@langchain/openai"
import type {NextApiRequest, NextApiResponse} from "next"

import {SUGGEST_NETWORK_ICONS_PROMPT} from "./prompts"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({error: "Method not allowed"})
    }

    try {
        console.debug("Received suggestIconsForNetworks request", req.body)

        const variables = {
            network_list: typeof req.body === "object" ? JSON.stringify(req.body, null, 2) : req.body,
        }

        const formattedPrompt = await SUGGEST_NETWORK_ICONS_PROMPT.formatMessages(variables)
        const response = await new ChatOpenAI({
            model: "gpt-4o",
            temperature: 0.7,
            openAIApiKey: process.env["OPENAI_API_KEY"],
        }).invoke(formattedPrompt)

        return res.json(response.content)
    } catch (error) {
        console.error("Error:", error)
        return res.status(500).json({error: "Failed to get LLM response"})
    }
}
