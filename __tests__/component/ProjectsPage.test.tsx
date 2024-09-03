import "@testing-library/jest-dom"
// eslint-disable-next-line no-shadow
import {cleanup, fireEvent, render, screen, waitForElementToBeRemoved} from "@testing-library/react"

import {DEMO_USER} from "../../const"
import * as listFetch from "../../controller/list/fetch"
import * as projectFetch from "../../controller/projects/fetch"
import {Projects} from "../../controller/projects/types"
import {AuthQuery} from "../../generated/auth"
import ProjectsPage from "../../pages/projects"
import {mockFetch} from "../testUtils"

// Mock dependencies
jest.mock("next/router", () => ({
    useRouter() {
        return {
            route: "/projects",
            pathname: "",
            asPath: "",
            push: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
            beforePopState: jest.fn(() => null),
            prefetch: jest.fn(() => null),
        }
    },
}))

jest.mock("next-auth/react", () => {
    return {
        useSession: jest.fn(() => ({data: {user: {name: "mock-user"}}})),
    }
})

jest.mock("../../state/features", () => ({
    ...jest.requireActual("../../state/features"),
    __esModule: true,
    default: jest.fn(() => ({enableProjectSharing: true})),
}))

jest.mock("../../controller/list/fetch", () => {
    return {
        __esModule: true,
        ...jest.requireActual("../../controller/list/fetch"),
    }
})

jest.mock("../../controller/projects/fetch", () => {
    return {
        __esModule: true,
        ...jest.requireActual("../../controller/projects/fetch"),
    }
})

jest.mock("../../controller/projects/update", () => ({
    ...jest.requireActual("../../controller/projects/update"),
    __esModule: true,
    default: jest.fn(() => []),
}))

jest.mock("../../components/internal/newproject", () => {
    return {
        __esModule: true,
        default: jest.fn(() => <div>Mock New Project</div>),
    }
})

jest.mock("../../components/notification", () => {
    return {
        __esModule: true,
        ...jest.requireActual("../../components/notification"),
    }
})

jest.mock("next/link", () => {
    return {
        __esModule: true,
        default: jest.fn(),
    }
})

window.fetch = mockFetch({})
jest.spyOn(listFetch, "fetchResourceList").mockImplementation(
    () =>
        [
            {
                role: "OWNER",
                target: {
                    resourceType: "PROJECT",
                    id: "1",
                },
            },
            {
                role: "OWNER",
                target: {
                    resourceType: "PROJECT",
                    id: "2",
                },
            },
        ] as unknown as Promise<AuthQuery[]>
)

describe("Projects Page", () => {
    beforeEach(() => {
        jest.spyOn(projectFetch, "fetchProjects").mockImplementation(
            () =>
                [
                    {
                        created_at: "2024-08-20T00:21:52.539586Z",
                        updated_at: "2024-08-20T00:24:08.301003Z",
                        id: "1",
                        name: "mock project",
                        description: "mock project description",
                        hidden: false,
                        owner: "mock-user",
                        lastEditedBy: "mock-user",
                    },
                    {
                        created_at: "2024-08-23T10:38:59.676337Z",
                        updated_at: "2024-08-26T08:12:16.627869Z",
                        id: "2",
                        name: "demo project",
                        description: "demo project description",
                        hidden: false,
                        owner: DEMO_USER,
                        lastEditedBy: DEMO_USER,
                    },
                ] as unknown as Promise<Projects>
        )
    })

    afterEach(() => {
        cleanup()
    })

    it("should display a project page with projects visible to user", async () => {
        render(<ProjectsPage />)

        const mockProject = await screen.findByText("mock project description...")
        const demoProject = await screen.findByText("demo project description...")

        expect(mockProject).toBeInTheDocument()
        expect(demoProject).toBeInTheDocument()
    })

    it("should show error page if project list returns falsy", async () => {
        jest.spyOn(projectFetch, "fetchProjects").mockReturnValue(null as unknown as Promise<Projects>)
        render(<ProjectsPage />)

        const errorText = await screen.findByText("Unable to retrieve projects")
        expect(errorText).toBeInTheDocument()
    })

    it("should be able to delete a project if user is the owner", async () => {
        render(<ProjectsPage />)
        const deleteProjectBtn = await screen.findByTestId("project-1-delete-button")
        fireEvent.click(deleteProjectBtn)

        const deleteConfirm = await screen.findByText("Delete")
        fireEvent.click(deleteConfirm)

        expect(async () => {
            await waitForElementToBeRemoved(async () => {
                await screen.findByText("Delete")
            })
        }).not.toThrow()

        expect(async () => {
            await waitForElementToBeRemoved(async () => {
                await screen.findByText("mock project description...")
            })
        }).not.toThrow()
    })

    it("should show sharing icon if they are an owner", async () => {
        render(<ProjectsPage />)
        const sharingIconFound = await screen.findByTestId("project-1-tooltip-share")
        expect(sharingIconFound).toBeInTheDocument()
    })

    it("should be able to toggle view between personal or other projects", async () => {
        render(<ProjectsPage />)
        const mockProject = await screen.findByText("mock project description...")
        const demoProject = await screen.findByText("demo project description...")

        const myProjectsToggle = await screen.findByText("My projects")
        const demoProjectsToggle = await screen.findByText("Demo projects")

        fireEvent.click(myProjectsToggle)
        expect(mockProject).toBeInTheDocument()
        expect(demoProject).not.toBeInTheDocument()

        fireEvent.click(demoProjectsToggle)
        expect(mockProject).not.toBeInTheDocument()
        expect(screen.getByText("demo project description...")).toBeInTheDocument()
    })
})
