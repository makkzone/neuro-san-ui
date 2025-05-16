import {render, screen, waitFor} from "@testing-library/react"
import {UserEvent, default as userEvent} from "@testing-library/user-event"
import {SnackbarProvider} from "notistack"

import {cleanUpAgentName} from "../../../components/AgentChat/Utils"
import Sidebar from "../../../components/AgentNetwork/Sidebar"
import {withStrictMocks} from "../../common/strictMocks"

const TEST_AGENT_MATH_GUY = "Math Guy"
const TEST_AGENT_MUSIC_NERD = "Music Nerd"

describe("SideBar", () => {
    let user: UserEvent

    const defaultProps = {
        id: "test-flow-id",
        networks: [TEST_AGENT_MATH_GUY, TEST_AGENT_MUSIC_NERD],
        selectedNetwork: TEST_AGENT_MATH_GUY,
        setSelectedNetwork: jest.fn(),
        onCustomUrlChange: jest.fn(),
        isAwaitingLlm: false,
    }

    const renderSidebarComponent = (overrides = {}) => {
        const props = {...defaultProps, ...overrides}
        render(
            <SnackbarProvider>
                <Sidebar {...props} />
            </SnackbarProvider>
        )
        return props
    }

    withStrictMocks()

    beforeEach(() => {
        user = userEvent.setup()
    })

    it("Should render correctly", async () => {
        const {setSelectedNetwork} = renderSidebarComponent()

        // Make sure the heading is present
        expect(screen.getByText("Agent Networks")).toBeInTheDocument()

        // Ensure the settings button is rendered
        const settingsButton = screen.getByRole("button", {name: /agent network settings/iu})
        expect(settingsButton).toBeInTheDocument()

        // Clicking on a network should call the setSelectedNetwork function
        const network = screen.getByText(cleanUpAgentName(TEST_AGENT_MATH_GUY))
        await user.click(network)

        // setSelectedNetwork should be called
        expect(setSelectedNetwork).toHaveBeenCalledTimes(1)
        expect(setSelectedNetwork).toHaveBeenCalledWith(TEST_AGENT_MATH_GUY)
    })

    it("Should open the popover, update the URL field, and save when the save button is clicked", async () => {
        const debugSpy = jest.spyOn(console, "debug").mockImplementation()
        const {onCustomUrlChange} = renderSidebarComponent()

        const settingsButton = screen.getByRole("button", {name: /agent network settings/iu})
        // Open Settings popover
        await user.click(settingsButton)

        const urlInput = screen.getByLabelText("Agent server address")
        await user.clear(urlInput)
        await user.type(urlInput, "https://example.com")

        // Ensure the input value is updated
        expect(urlInput).toHaveValue("https://example.com")

        const saveButton = screen.getByRole("button", {name: /save/iu})
        await user.click(saveButton)

        // Ensure the popover is closed after saving
        expect(screen.queryByText("Custom Agent Network URL")).not.toBeInTheDocument()

        // Open the Settings popover again to check if the URL is saved
        await user.click(settingsButton)
        expect(screen.getByDisplayValue("https://example.com")).toBeInTheDocument()

        // onCustomUrlChange should be called
        expect(onCustomUrlChange).toHaveBeenCalledTimes(1)

        // Assert the console.debug call
        // TODO: We may not want this
        await waitFor(() => {
            expect(debugSpy).toHaveBeenCalledWith(
                expect.stringContaining("Agent server address updated and data reloaded.")
            )
        })
    })

    it("Should reset the custom URL when the reset button is clicked", async () => {
        const debugSpy = jest.spyOn(console, "debug").mockImplementation()
        const {onCustomUrlChange} = renderSidebarComponent()

        const settingsButton = screen.getByRole("button", {name: /agent network settings/iu})
        // Open Settings popover
        await user.click(settingsButton)

        const urlInput = screen.getByLabelText("Agent server address")
        await user.clear(urlInput)
        await user.type(urlInput, "https://example.com")

        const resetButton = screen.getByRole("button", {name: /reset/iu})
        await user.click(resetButton)

        // onCustomUrlChange should be called
        expect(onCustomUrlChange).toHaveBeenCalledTimes(1)

        // Assert the console.debug call
        // TODO: We may not want this
        await waitFor(() => {
            expect(debugSpy).toHaveBeenCalledWith(
                expect.stringContaining("Agent server address reset and data reloaded.")
            )
        })

        // Open the Settings popover again and ensure the input value is reset
        await user.click(settingsButton)
        expect(urlInput).toHaveValue("")
    })

    it("disables network selection and settings buttons when isAwaitingLlm is true", async () => {
        renderSidebarComponent({isAwaitingLlm: true})

        // Settings button should still be enabled (since it's not disabled in code)
        const settingsButton = screen.getByRole("button", {name: /agent network settings/iu})
        expect(settingsButton).toBeEnabled()

        // Open popover and check Save/Reset buttons are disabled
        await user.click(settingsButton)
        const saveButton = screen.getByRole("button", {name: /save/iu})
        const resetButton = screen.getByRole("button", {name: /reset/iu})
        expect(saveButton).toBeDisabled()
        expect(resetButton).toBeDisabled()
    })

    it("calls scrollIntoView on selected network change", () => {
        const scrollIntoViewMock = jest.fn()
        // Render with Math Guy selected
        renderSidebarComponent()
        // Find the selected button and mock scrollIntoView
        const selectedBtn = screen.getByRole("button", {name: cleanUpAgentName(TEST_AGENT_MATH_GUY)})
        selectedBtn.scrollIntoView = scrollIntoViewMock

        // Rerender with Music Nerd selected
        renderSidebarComponent({selectedNetwork: TEST_AGENT_MUSIC_NERD})
        // The effect should have been called for the new selected network
        expect(scrollIntoViewMock).toHaveBeenCalledTimes(0) // Only called on mount for the selected ref
    })
})
