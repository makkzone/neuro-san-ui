// Import Flow Renderer
import {
  EdgeProps,
  Node,
  getBezierPath
} from 'react-flow-renderer';

type PredictorEdgeData = null;

export type PredictorEdge = Node<PredictorEdgeData>;

const PredictorEdgeComponent: React.FC<EdgeProps<PredictorEdgeData>> = ({ id, sourceX, sourceY,
                                        targetX, targetY,
                                        sourcePosition, targetPosition,
                                        style = {}, markerEnd
                                        }) => {
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    })

    return <path
                id={id}
                style={style}
                className="react-flow__edge-path"
                d={edgePath}
                markerEnd={markerEnd}
            />
}

export default PredictorEdgeComponent;