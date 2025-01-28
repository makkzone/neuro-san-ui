// eslint-disable-next-line no-shadow
import {render, screen} from "@testing-library/react"
import {userEvent} from "@testing-library/user-event"

import {MUIAccordion} from "../../components/MUIAccordion";

describe("MUIAccordion", () => {
    const defaultProps = {
        id: "test-accordion",
        items: [
            { title: "Title 1", content: "Content 1", panelKey: 1 },
            { title: "Title 2", content: "Content 2", panelKey: 2, disabled: true },
            { title: "Title 3", content: "Content 3", panelKey: 3 },
        ],
        expandOnlyOnePanel: true, // TODO: Test false as well
        sx: {},
        arrowPosition: "left" as "left" | "right",
    };

    test("renders correctly with given props", () => {
        render(<MUIAccordion {...defaultProps} />)
        expect(screen.getByText("Title 1")).toBeInTheDocument()
        expect(screen.getByText("Title 2")).toBeInTheDocument()
        expect(screen.getByText("Title 3")).toBeInTheDocument()
        expect(screen.getByText("Content 1")).toBeInTheDocument()
        expect(screen.getByText("Content 2")).toBeInTheDocument()
        expect(screen.getByText("Content 3")).toBeInTheDocument()
    });

    test("expands and collapses panels correctly", async () => {
        const user = userEvent.setup()
        render(<MUIAccordion {...defaultProps} />)
        const title1 = screen.getByText("Title 1")
        const title3 = screen.getByText("Title 3")

        // Initially, no content should be visible
        expect(screen.queryByText("Content 1")).not.toBeInTheDocument()
        expect(screen.queryByText("Content 3")).not.toBeInTheDocument()

        // Click to expand the first panel
        await user.click(title1)
        expect(screen.getByText("Content 1")).toBeInTheDocument()

        // Click to expand the third panel, first panel should collapse
        await user.click(title3)
        expect(screen.getByText("Content 3")).toBeInTheDocument()
        expect(screen.queryByText("Content 1")).not.toBeInTheDocument()
    });

    test("handles disabled state correctly", async () => {
        const user = userEvent.setup()
        render(<MUIAccordion {...defaultProps} />)
        const title2 = screen.getByText("Title 2")

        // Click to expand the disabled panel
        await user.click(title2)
        expect(screen.queryByText("Content 2")).not.toBeInTheDocument()
    })
})
