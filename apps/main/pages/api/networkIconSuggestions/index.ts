/**
 * Next.js API route to suggest icons for networks using LangChain and OpenAI.
 */

import {ChatOpenAI} from "@langchain/openai"
import httpStatus from "http-status"
import type {NextApiRequest, NextApiResponse} from "next"

import {SUGGEST_NETWORK_ICONS_PROMPT} from "./prompts"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(httpStatus.METHOD_NOT_ALLOWED).json({error: "Method not allowed"})
    }

    const openAIApiKey = process.env["OPENAI_API_KEY"]
    if (!openAIApiKey) {
        console.error("Could not find OpenAI Key. Set the OPENAI_API_KEY environment variable.")
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Could not find OpenAI Key"})
    }

    try {
        const variables = {
            network_list: typeof req.body === "object" ? JSON.stringify(req.body, null, 2) : req.body,
        }

        const formattedPrompt = await SUGGEST_NETWORK_ICONS_PROMPT.formatMessages(variables)
        const response = await new ChatOpenAI({
            model: "gpt-4o",
            temperature: 0.7,
            openAIApiKey,
        }).invoke(formattedPrompt)

        return res.json(response.content)
    } catch (error) {
        console.error("Error:", error)
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Failed to get LLM response"})
    }
}
