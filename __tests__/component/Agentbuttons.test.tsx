import "@testing-library/jest-dom"
// eslint-disable-next-line no-shadow
import {render, screen, waitFor} from "@testing-library/react"
import {userEvent} from "@testing-library/user-event"

import {AgentButtons} from "../../components/internal/opportunity_finder/Agentbuttons"

describe("AgentButtons", () => {
    const setSelectedAgentMock = jest.fn()

    it("should render agent buttons", async () => {
        render(
            <AgentButtons
                id="opp-finder-agent-buttons"
                enableOrchestration={false}
                awaitingResponse={false}
                selectedAgent="OpportunityFinder"
                setSelectedAgent={setSelectedAgentMock}
            />
        )

        // For "Opportunity Finder", there's also a title with that text, but it's not returned here
        expect(screen.getByText("Opportunity Finder")).toBeInTheDocument()
        expect(screen.getByText("Scoping Agent")).toBeInTheDocument()
        expect(screen.getByText("Data Generator")).toBeInTheDocument()
        expect(screen.getByText("Orchestrator")).toBeInTheDocument()
    })

    it("should render Orchestrator tooltip", async () => {
        render(
            <AgentButtons
                id="opp-finder-agent-buttons"
                enableOrchestration={false}
                awaitingResponse={false}
                selectedAgent="OpportunityFinder"
                setSelectedAgent={setSelectedAgentMock}
            />
        )

        expect(screen.queryByText("Please complete the previous steps first")).not.toBeInTheDocument()
        await userEvent.hover(screen.getByText("Orchestrator"))
        await waitFor(() => {
            expect(screen.getByText("Please complete the previous steps first")).toBeInTheDocument()
        })
    })

    it("should not render Orchestrator tooltip", async () => {
        render(
            <AgentButtons
                id="opp-finder-agent-buttons"
                enableOrchestration={true}
                awaitingResponse={false}
                selectedAgent="OpportunityFinder"
                setSelectedAgent={setSelectedAgentMock}
            />
        )

        expect(screen.queryByText("Please complete the previous steps first")).not.toBeInTheDocument()
        await userEvent.hover(screen.getByText("Orchestrator"))
        await waitFor(() => {
            expect(screen.queryByText("Please complete the previous steps first")).not.toBeInTheDocument()
        })
    })
})
