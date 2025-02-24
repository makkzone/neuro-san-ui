import {Tooltip} from "@mui/material"
import Typography from "@mui/material/Typography"
import {FC} from "react"
import {Handle, NodeProps, Position} from "reactflow"

export interface AgentNodeProps {
    agentName: string
    getSelectedAgentId: () => string
    getSourceAgentId: () => string
    isFrontman: boolean
    depth: number
}

// Orange palette for progressive coloring of nodes based on depth
// TODO: these are arbitrary and not related to the theme or global CSS. But they are a nice palette.
const BACKGROUND_COLORS = ["#FFDDC1", "#FED7AA", "#FDBA74", "#FB923C", "#F97316", "#EA580C"]

/**
 * A node representing an agent in the network for use in react-flow.
 * @param props See AgentNodeProps
 */
export const AgentNode: FC<NodeProps<AgentNodeProps>> = (props: NodeProps<AgentNodeProps>) => {
    // Unpack the node-specific data
    const data: AgentNodeProps = props.data
    const {agentName, getSelectedAgentId, getSourceAgentId, isFrontman, depth} = data

    // Unpack the node-specific id
    const agentId = props.id

    // "Active" agents are those at either end of the current communication from the incoming chat messages.
    // We highlight them with a red background.
    /* eslint-disable newline-per-chained-call */

    const isActiveAgent =
        getSelectedAgentId()?.toLowerCase().trim() === agentId.toLowerCase().trim() ||
        getSourceAgentId()?.toLowerCase().trim() === agentId.toLowerCase().trim()

    /* eslint-enable newline-per-chained-call */

    let bgColor
    if (isFrontman) {
        bgColor = "var(--bs-secondary)"
    } else if (isActiveAgent) {
        bgColor = "var(--bs-red)"
    } else {
        bgColor = BACKGROUND_COLORS[depth % BACKGROUND_COLORS.length]
    }

    const textColor = isFrontman || isActiveAgent || depth >= 4 ? "var(--bs-white)" : "var(--bs-primary)"

    // Animation style for making active agent glow and pulse
    // TODO: more idiomatic MUI/style= way of doing this?
    const glowAnimation = isActiveAgent
        ? `@keyframes glow {
                0% { box-shadow: 0 0 5px var(--bs-primary) ; opacity: 0.50; }
                50% { box-shadow: 0 0 20px var(--bs-primary); opacity: 0.75 }
                100% { box-shadow: 0 0 5px var(--bs-primary); opacity: 1.0 }
            }`
        : "none"

    return (
        <div
            id={agentId}
            style={{
                alignItems: "center",
                backgroundColor: bgColor,
                borderRadius: "50%",
                borderColor: "var(--bs-primary)",
                borderWidth: !isFrontman && isActiveAgent ? 4 : 1,
                color: textColor,
                display: "flex",
                height: 70,
                justifyContent: "center",
                textAlign: "center",
                width: 70,
                animation: isActiveAgent ? "glow 2.0s infinite" : "none",
                shapeOutside: "circle(50%)",
            }}
        >
            <style id={`${agentId}-glow-animation`}>{glowAnimation}</style>
            <Tooltip
                id={`${agentId}-tooltip`}
                title={agentName}
                placement="top"
            >
                <Typography
                    id={`${agentId}-name`}
                    sx={{
                        fontSize: "12px",
                        overflowWrap: "break-word",
                        textAlign: "center",
                        width: "90%",
                        whiteSpace: "normal",
                        wordBreak: "break-word",
                    }}
                >
                    {agentName}
                </Typography>
            </Tooltip>
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
    )
}
