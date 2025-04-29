import {render, screen} from "@testing-library/react"
import {SnackbarProvider} from "notistack"

import AgentNetworkPage from "../../pages/agentNetwork"
import useEnvironmentStore from "../../state/environment"
import {mockFetch} from "../testUtils"

const MOCK_USER = "mock-user"

// Backend neuro-san API server to use
const NEURO_SAN_SERVER_URL = "https://neuro-san-dev.decisionai.ml"

const TEST_AGENT_MATH_GUY = "Math Guy"
const TEST_AGENT_MUSIC_NERD = "Music Nerd"

// Mock dependencies
jest.mock("next-auth/react", () => {
    return {
        useSession: jest.fn(() => ({data: {user: {name: MOCK_USER}}})),
    }
})

// Mock fetchRuns
jest.mock("../../controller/agent/agent", () => ({
    getAgentNetworks: jest.fn(() => Promise.resolve([TEST_AGENT_MATH_GUY, TEST_AGENT_MUSIC_NERD])),
    getConnectivity: jest.fn(() =>
        Promise.resolve({
            connectivity_info: [
                {
                    origin: "date_time_provider",
                    tools: ["current_date_time"],
                },
                {
                    origin: "current_date_time",
                },
            ],
        })
    ),
}))

window.fetch = mockFetch({})

const renderAgentNetworkPage = () =>
    render(
        <SnackbarProvider>
            <AgentNetworkPage />
        </SnackbarProvider>
    )

describe("Agent Network Page", () => {
    beforeEach(() => {
        jest.clearAllMocks()

        process.env.NEURO_SAN_SERVER_URL = NEURO_SAN_SERVER_URL
        useEnvironmentStore.getState().setBackendNeuroSanApiUrl(NEURO_SAN_SERVER_URL)
    })

    it("should render elements on the page and change the page on click of sidebar item", async () => {
        renderAgentNetworkPage()

        // UI displays the elements.
        const sidebarTitle = await screen.findByText("Agent Networks")
        const mathGuySidebarItem = await screen.findByText(TEST_AGENT_MATH_GUY)
        const musicNerdSidebarItem = await screen.findByText(TEST_AGENT_MUSIC_NERD)

        expect(sidebarTitle).toBeInTheDocument()
        expect(mathGuySidebarItem).toBeInTheDocument()
        expect(musicNerdSidebarItem).toBeInTheDocument()
    })
})
