/**
 * Controller for Opportunity Finder chat requests
 */

import {BaseMessage} from "@langchain/core/messages"

import {OpportunityFinderRequestType} from "../../pages/api/gpt/opportunityFinder/types"
import {sendLlmRequest} from "../llm/llm_chat"

const DUMMY_RESPONSE = false

/* eslint-disable max-len */
const RESPONSE = `
Here are five possible decision points within Cognizant where NeuroAI could be applied:

    * IT Operations Automation: Cognizant's Neuro® IT Operations uses AI-driven automation to enhance decision-making in IT operations. NeuroAI could optimize the decision-making process by predicting outcomes of various IT strategies and prescribing optimal actions to improve efficiency and reduce downtime.
        Source: Cognizant Neuro Intelligent Automation

    * Edge AI Applications: Cognizant's Neuro® Edge platform enables real-time decision-making at the edge. NeuroAI could be used to optimize decisions related to data processing and resource allocation in edge computing environments.
        Source: Neuro Edge—Gen AI for Industrial Edge AI

    * Business Process Optimization: Cognizant offers AI business accelerators for optimizing business processes. NeuroAI could enhance these processes by predicting the outcomes of different process configurations and recommending the most efficient setups.
        Source: Business Process Services | Cognizant

    * Inventory Optimization: Cognizant's AI-driven inventory optimization solutions could benefit from NeuroAI by predicting inventory needs and prescribing optimal inventory levels to minimize costs and meet demand.
        Source: Cognizant’s Inventory Optimization Solution

    * Customer Experience Enhancement: Cognizant's digital process orchestration helps improve customer experience. NeuroAI could be used to predict customer satisfaction outcomes and prescribe actions to enhance customer interactions.
        Source: Digital Process Orchestration - Cognizant

Financial Analysis

To identify the decision point with the highest expected value, let's perform a hypothetical financial analysis on the Inventory Optimization decision point:

    Current Inventory Costs: $10 million annually
    Expected Reduction in Costs with NeuroAI: 15%
    Implementation Cost of NeuroAI: $500,000
    Annual Maintenance Cost: $100,000

Expected Savings Calculation:

    Annual Savings = Current Inventory Costs * Expected Reduction = $10,000,000 * 0.15 = $1,500,000

    Net Savings in Year 1 = Annual Savings - Implementation Cost - Maintenance Cost = $1,500,000 - $500,000 - $100,000 = $900,000
    Net Savings in Subsequent Years = Annual Savings - Maintenance Cost = $1,500,000 - $100,000 = $1,400,000

Based on this analysis, the Inventory Optimization decision point offers significant potential savings, making it a high-value opportunity for applying NeuroAI within Cognizant
`
export async function sendOpportunityFinderRequest(
    userQuery: string,
    requestType: OpportunityFinderRequestType,
    callback: (token: string) => void,
    signal: AbortSignal,
    chatHistory: BaseMessage[]
) {
    // await sendLlmRequest(callback, signal, "/api/gpt/opportunityFinder", {requestType}, userQuery, chatHistory)
    // Feed "RESPONSE" word by word to callback()
    if (DUMMY_RESPONSE) {
        const words = RESPONSE.split(" ")
        for (const word of words) {
            callback(`${word} `)
        }
    } else {
        await sendLlmRequest(callback, signal, "/api/gpt/opportunityFinder", {requestType}, userQuery, chatHistory)
    }
}
