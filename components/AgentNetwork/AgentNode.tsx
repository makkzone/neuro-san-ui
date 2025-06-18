import {Tooltip} from "@mui/material"
import Typography from "@mui/material/Typography"
import {FC} from "react"
import {Handle, NodeProps, Position} from "reactflow"

import {BACKGROUND_COLORS} from "./const"
import {Origin} from "../../generated/neuro-san/OpenAPITypes"

export interface AgentNodeProps {
    agentName: string
    getOriginInfo: () => Origin[]
    depth: number
}

// Node dimensions
export const NODE_HEIGHT = 80
export const NODE_WIDTH = 80

/**
 * A node representing an agent in the network for use in react-flow.
 * @param props See AgentNodeProps
 */
export const AgentNode: FC<NodeProps<AgentNodeProps>> = (props: NodeProps<AgentNodeProps>) => {
    // Unpack the node-specific data
    const data: AgentNodeProps = props.data
    const {agentName, getOriginInfo, depth} = data

    // Unpack the node-specific id
    const agentId = props.id

    // "Active" agents are those at either end of the current communication from the incoming chat messages.
    // We highlight them with a red background.
    const isActiveAgent = getOriginInfo()
        .map((originItem) => originItem.tool)
        .includes(agentId)

    let backgroundColor: string

    // There's no depth for linear layout, so we just use the first color for both layouts (radial and linear).
    if (isActiveAgent) {
        backgroundColor = "var(--bs-green)"
    } else {
        backgroundColor = BACKGROUND_COLORS[depth % BACKGROUND_COLORS.length]
    }

    // Text color varies based on if it's a layout that has depth or not (radial vs linear).
    const color = depth === undefined ? (isActiveAgent ? "var(--bs-white)" : "var(--bs-primary)") : "var(--bs-white)"

    // Animation style for making active agent glow and pulse
    // TODO: more idiomatic MUI/style= way of doing this?
    const glowAnimation = isActiveAgent
        ? `@keyframes glow {
            0% { box-shadow: 0 0 10px 4px ${backgroundColor}; opacity: 0.60; }
            50% { box-shadow: 0 0 30px 12px ${backgroundColor}; opacity: 0.90; }
            100% { box-shadow: 0 0 10px 4px ${backgroundColor}; opacity: 1.0; }
        }`
        : "none"

    const boxShadow = isActiveAgent ? "0 0 30px 12px var(--bs-primary), 0 0 60px 24px var(--bs-primary)" : undefined

    return (
        <>
            <div
                id={agentId}
                style={{
                    alignItems: "center",
                    animation: isActiveAgent ? "glow 2.0s infinite" : "none",
                    backgroundColor,
                    borderRadius: "50%",
                    boxShadow,
                    color,
                    display: "flex",
                    height: NODE_HEIGHT,
                    justifyContent: "center",
                    shapeOutside: "circle(50%)",
                    textAlign: "center",
                    width: NODE_WIDTH,
                    zIndex: 0, // Ensure node is below the text
                    position: "relative", // Add this line
                }}
            >
                <style id={`${agentId}-glow-animation`}>{glowAnimation}</style>
                <Handle
                    id={`${agentId}-left-handle`}
                    position={Position.Left}
                    type="source"
                />
                <Handle
                    id={`${agentId}-right-handle`}
                    position={Position.Right}
                    type="source"
                />
            </div>
            <Tooltip
                id={`${agentId}-tooltip`}
                title={agentName}
                placement="top"
                disableInteractive // helps ensure hover works over clipped text
            >
                <Typography
                    id={`${agentId}-name`}
                    sx={{
                        backgroundColor: "white",
                        display: "-webkit-box",
                        fontSize: "11px",
                        lineHeight: "1.2em",
                        maxHeight: "2.4em",
                        overflow: "hidden",
                        overflowWrap: "normal",
                        textAlign: "center",
                        textOverflow: "ellipsis",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                        whiteSpace: "normal",
                        width: `${NODE_WIDTH}px`,
                        wordBreak: "normal",
                        zIndex: 10, // Ensure text is above the node
                        position: "relative", // Add this line
                    }}
                >
                    {agentName}
                </Typography>
            </Tooltip>
        </>
    )
}
