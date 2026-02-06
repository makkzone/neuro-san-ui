/**
 * Utility to create Next.js API route handlers that use LangChain and OpenAI.
 */

import type {ChatPromptTemplate} from "@langchain/core/prompts"
import {ChatOpenAI} from "@langchain/openai"
import httpStatus from "http-status"
import type {NextApiRequest, NextApiResponse} from "next"

interface LLMHandlerOptions {
    readonly allowedMethod: "GET" | "POST"
    readonly promptTemplate: ChatPromptTemplate
    readonly extractVariables: (req: NextApiRequest) => Record<string, unknown>
}

/**
 * Creates a Next.js API route handler that uses LangChain and OpenAI.
 *
 * @param options - Configuration for the handler
 * @returns A Next.js API route handler function
 */
export const createLLMHandler =
    ({allowedMethod, promptTemplate, extractVariables}: LLMHandlerOptions) =>
    async (req: NextApiRequest, res: NextApiResponse) => {
        if (req.method !== allowedMethod) {
            return res.status(httpStatus.METHOD_NOT_ALLOWED).json({error: "Method not allowed"})
        }

        const openAIApiKey = process.env["OPENAI_API_KEY"]
        if (!openAIApiKey) {
            console.error("Could not find OpenAI Key. Set the OPENAI_API_KEY environment variable.")
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Could not find OpenAI Key"})
        }

        try {
            const variables = extractVariables(req)
            const formattedPrompt = await promptTemplate.formatMessages(variables)
            const response = await new ChatOpenAI({
                model: "gpt-4o",
                temperature: 0.7,
                openAIApiKey,
            }).invoke(formattedPrompt)

            const parsedContent = JSON.parse(response.content as string)
            return res.json(parsedContent)
        } catch (error) {
            console.error("Error:", error)
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({error: "Failed to get LLM response"})
        }
    }
