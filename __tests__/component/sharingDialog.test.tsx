// eslint-disable-next-line no-shadow
import {fireEvent, render, screen, waitFor} from "@testing-library/react"

import SharingDialog from "../../components/internal/sharingDialog"
import {getShares, share} from "../../controller/authorization/share"

// Mock the share and getShares functions
jest.mock("../../controller/authorization/share", () => ({
    share: jest.fn(),
    getShares: jest.fn(),
}))

const mockProject = {id: 1, name: "Test Project"}
const mockCurrentUser = "currentUser"
const mockCurrentShares = [
    ["user1", "TOURIST"],
    ["user2", "OWNER"],
]

describe("SharingDialog Component", () => {
    beforeEach(() => {
        ;(getShares as jest.Mock).mockResolvedValue(mockCurrentShares)
    })

    test("renders the component correctly", async () => {
        render(
            <SharingDialog
                project={mockProject}
                currentUser={mockCurrentUser}
                closeModal={jest.fn()}
                title="Share Project"
                visible={true}
            />
        )

        expect(screen.getByPlaceholderText("User to share with")).toBeInTheDocument()
        expect(screen.getByText("People with access")).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText("user1 - Tourist")).toBeInTheDocument()
            expect(screen.getByText("user2 - Owner")).toBeInTheDocument()
        })
    })

    test("handles sharing a project", async () => {
        ;(share as jest.Mock).mockResolvedValue(undefined)

        render(
            <SharingDialog
                project={mockProject}
                currentUser={mockCurrentUser}
                closeModal={jest.fn()}
                title="Share Project"
                visible={true}
            />
        )

        const input = screen.getByPlaceholderText("User to share with")
        fireEvent.change(input, {target: {value: "newUser"}})

        const shareButton = screen.getByText("Share")
        fireEvent.click(shareButton)

        await waitFor(() => {
            expect(share).toHaveBeenCalledWith(mockProject.id, mockCurrentUser, "newUser", true)
            expect(screen.getByText('Project shared with "newUser"')).toBeInTheDocument()
        })
    })

    test("handles removing a share", async () => {
        render(
            <SharingDialog
                project={mockProject}
                currentUser={mockCurrentUser}
                closeModal={jest.fn()}
                title="Share Project"
                visible={true}
            />
        )

        await waitFor(() => {
            expect(screen.getByText("user1 - Tourist")).toBeInTheDocument()
        })

        const removeButton = screen.getByTestId("close-icon-0")
        fireEvent.click(removeButton)

        await waitFor(() => {
            expect(screen.queryByText("user1 - Tourist")).not.toBeInTheDocument()
        })
    })
})
