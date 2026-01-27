import {ChatPromptTemplate} from "@langchain/core/prompts"
import {ChatOpenAI} from "@langchain/openai"
import cors from "cors"
import express from "express"

const app = express()
const PORT = process.env["PORT"] || 3001

app.use(cors())
app.use(express.json())

// Initialize LangChain LLM
const llm = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    openAIApiKey: process.env["OPENAI_API_KEY"],
})

// Define your prompt template on the server
const promptTemplate = ChatPromptTemplate.fromTemplate(`
You are given a list of agents and associated information for each agent including agent name, description and any
associated tags assigned by the network designer. These agents participate in an agentic AI network.
Example format:
{{
"agent_name": "industry/telco_network_orchestration",
"description": "Simulates a large-scale telecommunication network orchestration system, including monitoring,
fault detection and resource allocation, for a telco company in Australia. The network is organized into regions
(NSW: New South Wales, VIC: Victoria, QLD: Queensland), each with a site manager and a set of nodes.
The agents are NOT grounded and will simulate access to the network's systems instead.",
"tags": [
"AAOSA",
"telecommunications",
"network-orchestration",
"monitoring",
"fault-detection",
"resource-allocation",
"simulation"
]
}}

For each agent in the list, suggest a suitable icon selected from the MUI icons to represent the agent in
a visualization UI, using the context of the agent description.

Give your answer as pure JSON, no markdown, no extra formatting, no commentary. Example answer format:
{{
  "industry/telco_network_orchestration": "AccessibilityIcon",
  "agent2": "AdminPanelSettings"
}}

Agent list:
{agent_list}
`)

app.get("/api/health", (_req, res) => {
    res.json({status: "ok"})
})

app.post("/api/chat", async (req, res) => {
    console.debug("Received request body:", req.body)
    try {
        const variables = {
            agent_list: typeof req.body === "object" ? JSON.stringify(req.body, null, 2) : req.body,
        }

        const formattedPrompt = await promptTemplate.formatMessages(variables)
        const response = await llm.invoke(formattedPrompt)

        res.json(response.content)
    } catch (error) {
        console.error("Error:", error)
        res.status(500).json({error: "Failed to get LLM response"})
    }
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
