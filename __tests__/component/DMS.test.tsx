// eslint-disable-next-line no-shadow
import {render, screen} from "@testing-library/react"

import DMS from "../../pages/projects/[projectID]/experiments/[experimentID]/runs/[runID]/prescriptors/[prescriptorID]"
import {mockFetch} from "../testUtils"

// isSuperUser
jest.mock("../../controller/authorize/superuser", () => ({
    isSuperUser: jest.fn(),
}))

// fetchProjects
jest.mock("../../controller/projects/fetch", () => ({
    fetchProjects: jest.fn(),
}))

// mock next/router
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

// mock useSession
jest.mock("next-auth/react", () => {
    return {
        useSession: jest.fn(() => ({data: {user: {name: "testUser"}}})),
    }
})

window.fetch = mockFetch({})

describe("DMS", () => {
    it("should render correctly", () => {
        // eslint-disable-next-line react/jsx-pascal-case
        render(<DMS />)
        expect(screen.getByText("Context")).toBeInTheDocument()
        expect(screen.getByText("Actions")).toBeInTheDocument()
        expect(screen.getByText("Outcomes")).toBeInTheDocument()
    })
})
