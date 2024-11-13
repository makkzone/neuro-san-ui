import "@testing-library/jest-dom"
// eslint-disable-next-line no-shadow
import {fireEvent, render, screen, waitFor} from "@testing-library/react"

import LLMDropdownMenu from "../../components/internal/flow/LLMDropdownMenu"
import {DataTagFieldValued} from "../../generated/metadata"

describe("Node Popper", () => {
    const renderMockNodePopper = ({isLoading, readOnly, dataTagFields}) => (
        <LLMDropdownMenu
            deleteNodeById={jest.fn()}
            getPrescriptorEdge={jest.fn()}
            getGeneralEdge={jest.fn()}
            setNodes={jest.fn()}
            setEdges={jest.fn()}
            setParentState={jest.fn()}
            addElementUuid={jest.fn()}
            ParentNodeSetStateHandler={jest.fn()}
            nodes={[]}
            getElementIndex={jest.fn()}
            idExtension="mockIdExtension"
            readOnlyNode={readOnly}
            loadingDataTags={isLoading}
            edges={[]}
            dataTagfields={dataTagFields}
        />
    )

    it("should render a popper overlay when button is clicked", async () => {
        const view = renderMockNodePopper({
            isLoading: false,
            readOnly: false,
            // add categorical and has_nan field
            dataTagFields: {
                hasNanField: {
                    has_nan: true,
                },
                hasCategoricalValueField: {
                    valued: DataTagFieldValued.CATEGORICAL,
                },
            },
        })

        render(view)

        const addLLMButton = await screen.findByText("Add LLM")

        fireEvent.click(addLLMButton)
        await waitFor(() => {
            expect(screen.getByText("Activation")).toBeInTheDocument()
        })

        expect(screen.getByText("Analytics")).toBeInTheDocument()
        expect(screen.getByText("Confabulator")).toBeInTheDocument()
        expect(screen.getByText("Category reducer")).toBeInTheDocument()
    })
})
