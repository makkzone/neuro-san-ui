import {render, screen} from "@testing-library/react"
import {UserEvent, default as userEvent} from "@testing-library/user-event"

import {cleanUpAgentName} from "../../../components/AgentChat/Utils"
import Sidebar from "../../../components/AgentNetwork/Sidebar"
import {withStrictMocks} from "../../common/strictMocks"

const TEST_AGENT_MATH_GUY = "Math Guy"
const TEST_AGENT_MUSIC_NERD = "Music Nerd"

describe("SideBar", () => {
    let user: UserEvent

    withStrictMocks()

    beforeEach(() => {
        user = userEvent.setup()
    })

    it("Should render correctly", async () => {
        const selectedNetworkMock = jest.fn()
        render(
            <Sidebar
                id="test-flow-id"
                networks={[TEST_AGENT_MATH_GUY, TEST_AGENT_MUSIC_NERD]}
                selectedNetwork={TEST_AGENT_MATH_GUY}
                setSelectedNetwork={selectedNetworkMock}
                isAwaitingLlm={false}
            />
        )

        // Make sure the heading is present
        expect(screen.getByText("Agent Networks")).toBeInTheDocument()

        // Ensure the settings button is rendered
        const settingsButton = screen.getByRole("button", {name: /agent network settings/ui})
        expect(settingsButton).toBeInTheDocument()

        // Clicking on a network should call the setSelectedNetwork function
        const network = screen.getByText(cleanUpAgentName(TEST_AGENT_MATH_GUY))
        await user.click(network)
        expect(selectedNetworkMock).toHaveBeenCalledTimes(1)
        expect(selectedNetworkMock).toHaveBeenCalledWith(TEST_AGENT_MATH_GUY)
    })

    it("Should open the popover, update the custom URL input field, and save when the save button is clicked", async () => {
        const selectedNetworkMock = jest.fn()
        render(
            <Sidebar
                id="test-flow-id"
                networks={[TEST_AGENT_MATH_GUY, TEST_AGENT_MUSIC_NERD]}
                selectedNetwork={TEST_AGENT_MATH_GUY}
                setSelectedNetwork={selectedNetworkMock}
                isAwaitingLlm={false}
            />
        )

        const settingsButton = screen.getByRole("button", {name: /agent network settings/ui})
        // Open Settings popover
        await user.click(settingsButton)

        // Ensure the popover is displayed
        expect(screen.getAllByText(/custom agent network url/ui).length).toBe(2)

        const urlInput = screen.getByLabelText("Custom Agent Network URL")
        await user.type(urlInput, "https://example.com")

        // Ensure the input value is updated
        expect(urlInput).toHaveValue("https://example.com")
        
        const saveButton = screen.getByRole("button", {name: /save/i})
        await user.click(saveButton)

        // Ensure the popover is closed after saving
        expect(screen.queryByText("Custom Agent Network URL")).not.toBeInTheDocument()

        // Open the Settings popover again to check if the URL is saved
        await user.click(settingsButton)
        expect(screen.getByDisplayValue("https://example.com")).toBeInTheDocument()
    })

    it("Should reset the custom URL when the reset button is clicked", async () => {
        const selectedNetworkMock = jest.fn()
        render(
            <Sidebar
                id="test-flow-id"
                networks={[TEST_AGENT_MATH_GUY, TEST_AGENT_MUSIC_NERD]}
                selectedNetwork={TEST_AGENT_MATH_GUY}
                setSelectedNetwork={selectedNetworkMock}
                isAwaitingLlm={false}
            />
        )

        const settingsButton = screen.getByRole("button", {name: /agent network settings/ui})
        // Open Settings popover
        await user.click(settingsButton)

        const urlInput = screen.getByLabelText("Custom Agent Network URL")
        await user.type(urlInput, "https://example.com")

        const resetButton = screen.getByRole("button", {name: /reset/i})
        await user.click(resetButton)

        // Open the Settings popover again and ensure the input value is reset
        await user.click(settingsButton)
        expect(urlInput).toHaveValue("")
    })
})
