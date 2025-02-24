import HubOutlinedIcon from "@mui/icons-material/HubOutlined"
import ScatterPlotOutlinedIcon from "@mui/icons-material/ScatterPlotOutlined"
import Box from "@mui/material/Box"
import Tooltip from "@mui/material/Tooltip"
import {FC, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {
    applyNodeChanges,
    Background,
    ConnectionMode,
    ControlButton,
    Controls,
    Edge,
    EdgeProps,
    EdgeTypes,
    MarkerType,
    NodeChange,
    ReactFlow,
    ReactFlowInstance,
    Node as RFNode,
    NodeTypes as RFNodeTypes,
} from "reactflow"

import "reactflow/dist/style.css"
import {AgentNode, AgentNodeProps} from "./AgentNode"
import {AnimatedEdge} from "./AnimatedEdge"
import {layoutLinear, layoutRadial} from "./GraphLayouts"
import {ConnectivityInfo} from "../../generated/neuro_san/api/grpc/agent"

// #region: Types
interface AgentFlowProps {
    agentsInNetwork: ConnectivityInfo[]
    id: string
    selectedAgentId?: string
}

type Layout = "radial" | "linear"
// #endregion: Types

const AgentFlow: FC<AgentFlowProps> = ({agentsInNetwork, id, selectedAgentId}) => {
    // Save this as a mutable ref so child nodes see updates
    const selectedAgentIdRef = useRef<string>(selectedAgentId)
    const selectedSourceAgentId = useRef<string | undefined>(undefined)

    useEffect(() => {
        selectedAgentIdRef.current = selectedAgentId
    }, [selectedAgentId])

    const getSelectedAgentId = useCallback<() => string>(() => selectedAgentIdRef.current, [selectedAgentIdRef.current])
    const getSelectedSourceAgentId = useCallback<() => string>(
        () => selectedSourceAgentId.current,
        [selectedSourceAgentId.current]
    )

    const [flowInstance, setFlowInstance] = useState<ReactFlowInstance>(null)

    const [nodes, setNodes] = useState<RFNode<AgentNodeProps>[]>([])
    const [edges, setEdges] = useState<Edge<EdgeProps>[]>([])

    const [layout, setLayout] = useState<Layout>("radial")

    useEffect(() => {
        flowInstance && setTimeout(flowInstance.fitView, 50)
    }, [flowInstance, nodes.length, edges.length, layout])

    // Create the flow layout depending on user preference
    useEffect(() => {
        if (agentsInNetwork?.length === 0) {
            return
        }

        switch (layout) {
            case "linear": {
                const linearLayout = layoutLinear(agentsInNetwork, getSelectedAgentId, getSelectedSourceAgentId)
                linearLayout.nodes && setNodes(linearLayout.nodes)
                linearLayout.edges && setEdges(linearLayout.edges)
                break
            }
            case "radial":
            default: {
                const radialLayout = layoutRadial(agentsInNetwork, getSelectedAgentId, getSelectedSourceAgentId)
                radialLayout.nodes && setNodes(radialLayout.nodes)
                radialLayout.edges && setEdges(radialLayout.edges)
                break
            }
        }
    }, [agentsInNetwork, layout, selectedAgentId, selectedSourceAgentId])

    const onNodesChange = useCallback((changes: NodeChange[]) => {
        setNodes((ns) =>
            applyNodeChanges<AgentNodeProps>(
                // For now we only allow dragging, no updates
                changes.filter((c) => c.type === "position"),
                ns
            )
        )
    }, [])

    const onInit = useCallback((reactFlowInstance: ReactFlowInstance) => {
        /*
        Helper function to adjust the flow when it is loaded.
        */
        reactFlowInstance.fitView()
        setFlowInstance(reactFlowInstance)
    }, [])

    // Highlight first edge we find connected to active agent. SOMETIMES THIS WILL BE WRONG if there are multiple
    // edges to the active agent but this is a start.
    // TODO: we really only want to highlight the one from the sender to the active agent, but we don't have
    // origins info yet. We don't know _who_ sent the message to the active agent so for now, we guess.
    useEffect(() => {
        let sourceAgentId: string

        /* eslint-disable newline-per-chained-call */
        const selectedAgentFirstEdge = edges.find((edge) => {
            if (edge.target.toLowerCase().trim() === getSelectedAgentId().toLowerCase().trim()) {
                sourceAgentId = edge.source // This is expected, we want the source if it's target
                return true
            }
            return false
        })
        /* eslint-enable newline-per-chained-call */

        if (sourceAgentId) {
            selectedSourceAgentId.current = sourceAgentId
        } else {
            selectedSourceAgentId.current = null
        }

        const edgesCopy = edges.map((edge: Edge<EdgeProps>) => ({
            ...edge,
            style: {
                strokeWidth: edge.id === selectedAgentFirstEdge?.id ? 3 : undefined,
                stroke: edge.id === selectedAgentFirstEdge?.id ? "var(--bs-primary)" : undefined,
            },
            markerEnd:
                edge.id === selectedAgentFirstEdge?.id
                    ? {
                          type: MarkerType.Arrow,
                          color: "darkblue", // var(--bs-primary) doesn't work here for some reason
                          width: 15,
                          height: 15,
                      }
                    : undefined,
            type: edge.id === selectedAgentFirstEdge?.id ? "animatedEdge" : undefined,
        }))

        setEdges(edgesCopy)
    }, [selectedAgentId])

    // Why not just a "const"? See: https://reactflow.dev/learn/customization/custom-nodes
    // "It’s important that the nodeTypes are memoized or defined outside of the component. Otherwise React creates
    // a new object on every render which leads to performance issues and bugs."
    const nodeTypes: RFNodeTypes = useMemo(
        () => ({
            agentNode: AgentNode,
        }),
        [AgentNode]
    )

    const edgeTypes: EdgeTypes = useMemo(
        () => ({
            animatedEdge: AnimatedEdge,
        }),
        [AnimatedEdge]
    )

    return (
        <Box
            id={`${id}-outer-box`}
            sx={{height: "100%", width: "100%"}}
            style={{}}
        >
            <ReactFlow
                id={`${id}-react-flow`}
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onInit={onInit}
                fitView={true}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionMode={ConnectionMode.Loose}
            >
                <Background id={`${id}-background`} />
                <Controls
                    id="react-flow-controls"
                    position="top-left"
                    style={{
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        height: "auto",
                        width: "auto",
                    }}
                    showInteractive={true}
                >
                    <Tooltip
                        id="radial-layout-tooltip"
                        title="Radial layout"
                        placement="right"
                    >
                        <span id="radial-layout-span">
                            <ControlButton
                                id="radial-layout-button"
                                onClick={() => setLayout("radial")}
                            >
                                <HubOutlinedIcon
                                    id="radial-layout-icon"
                                    sx={{color: "black"}}
                                />
                            </ControlButton>
                        </span>
                    </Tooltip>
                    <Tooltip
                        id="linear-layout-tooltip"
                        title="Linear layout"
                        placement="right"
                    >
                        <span id="linear-layout-span">
                            <ControlButton
                                id="linear-layout-button"
                                onClick={() => setLayout("linear")}
                            >
                                <ScatterPlotOutlinedIcon
                                    id="linear-layout-icon"
                                    sx={{color: "black"}}
                                />
                            </ControlButton>
                        </span>
                    </Tooltip>
                </Controls>
            </ReactFlow>
        </Box>
    )
}

export default AgentFlow
