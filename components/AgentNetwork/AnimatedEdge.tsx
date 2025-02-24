import {CSSProperties, FC} from "react"
import {BaseEdge, EdgeProps, getBezierPath} from "reactflow"

interface AnimatedEdgeProps {
    style: CSSProperties
    markerEnd: object
}

export const AnimatedEdge: FC<EdgeProps<AnimatedEdgeProps>> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style,
    markerEnd,
}) => {
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    return (
        <>
            <BaseEdge
                id={id}
                path={edgePath}
                style={style}
                markerEnd={markerEnd}
            />
            <circle
                id={`${id}-circle`}
                r="6"
                fill="var(--bs-red)"
            >
                <animateMotion
                    id={`${id}-circle-animation`}
                    dur="1s"
                    repeatCount="indefinite"
                    path={edgePath}
                />
            </circle>
        </>
    )
}
