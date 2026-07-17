import { useEffect, useRef } from 'react';
import { Background, MarkerType, Position, ReactFlow, useEdgesState, useNodesState, type Edge, type Node } from '@xyflow/react';

const miniCaseFlowNodeStyle = {
  width: 230,
  border: '1px solid rgba(17, 184, 245, 0.24)',
  borderRadius: 26,
  background: 'rgba(255, 255, 255, 0.86)',
  boxShadow: '0 22px 50px rgba(1, 20, 26, 0.12)',
  color: '#01141a',
  fontSize: 16,
  fontWeight: 800,
  padding: '22px 24px'
};

export type MiniCaseFlowLabels = {
  request: string;
  assign: string;
  review: string;
  resolve: string;
};

const miniCaseFlowNodesBase: Omit<Node, 'data'>[] = [
  {
    id: 'request',
    position: { x: 840, y: 210 },
    sourcePosition: Position.Right,
    style: miniCaseFlowNodeStyle
  },
  {
    id: 'assign',
    position: { x: 1180, y: 92 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: miniCaseFlowNodeStyle
  },
  {
    id: 'review',
    position: { x: 1180, y: 326 },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: {
      ...miniCaseFlowNodeStyle,
      border: '1px solid rgba(81, 78, 247, 0.22)',
      boxShadow: '0 16px 38px rgba(81, 78, 247, 0.1)'
    }
  },
  {
    id: 'resolve',
    position: { x: 1520, y: 210 },
    targetPosition: Position.Left,
    style: {
      ...miniCaseFlowNodeStyle,
      background: 'linear-gradient(135deg, rgba(17, 184, 245, 0.94), rgba(81, 78, 247, 0.9))',
      border: '1px solid rgba(255, 255, 255, 0.45)',
      color: '#fff',
      boxShadow: '0 18px 44px rgba(17, 184, 245, 0.22)'
    }
  }
];

function buildMiniCaseNodes(labels?: Partial<MiniCaseFlowLabels>): Node[] {
  const merged: MiniCaseFlowLabels = {
    request: labels?.request ?? 'Request received',
    assign: labels?.assign ?? 'Assign case owner',
    review: labels?.review ?? 'Review documents',
    resolve: labels?.resolve ?? 'Resolve case'
  };
  return miniCaseFlowNodesBase.map((n) => ({
    ...n,
    data: { label: merged[n.id as keyof MiniCaseFlowLabels] }
  })) as Node[];
}

const miniCaseFlowEdges: Edge[] = [
  {
    id: 'request-assign',
    source: 'request',
    target: 'assign',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#11b8f5', strokeWidth: 2.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#11b8f5' }
  },
  {
    id: 'request-review',
    source: 'request',
    target: 'review',
    type: 'smoothstep',
    style: { stroke: '#7f9bfa', strokeWidth: 2.2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#7f9bfa' }
  },
  {
    id: 'assign-resolve',
    source: 'assign',
    target: 'resolve',
    type: 'smoothstep',
    style: { stroke: '#11b8f5', strokeWidth: 2.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#11b8f5' }
  },
  {
    id: 'review-resolve',
    source: 'review',
    target: 'resolve',
    type: 'smoothstep',
    animated: true,
    style: { stroke: '#514ef7', strokeWidth: 2.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#514ef7' }
  }
];

const NODE_ORDER = ['request', 'assign', 'review', 'resolve'];

const getMiniCaseFlowFloatOffset = (nodeId: string, phase: number) => {
  const nodeIndex = NODE_ORDER.indexOf(nodeId);
  return Math.sin(phase / 900 + Math.max(nodeIndex, 0) * 1.2) * 8;
};

/** Decorative animated flow used behind Workflow Management and aligned solution pages. */
export default function MiniCaseFlow({ labels }: { labels?: Partial<MiniCaseFlowLabels> }) {
  const initialNodes = buildMiniCaseNodes(labels);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(miniCaseFlowEdges);
  const basePositionsRef = useRef(
    Object.fromEntries(initialNodes.map((node) => [node.id, { ...node.position }]))
  );
  const phaseRef = useRef(0);
  const lastFrameTimeRef = useRef<number | null>(null);
  const isDraggingNodeRef = useRef(false);

  const labelsKey = JSON.stringify(labels ?? {});

  useEffect(() => {
    const next = buildMiniCaseNodes(labels);
    setNodes(next);
    basePositionsRef.current = Object.fromEntries(next.map((node) => [node.id, { ...node.position }]));
  }, [labelsKey, setNodes]);

  useEffect(() => {
    let animationFrameId = 0;

    const animateNodes = (timestamp: number) => {
      const lastFrameTime = lastFrameTimeRef.current ?? timestamp;
      const delta = timestamp - lastFrameTime;
      lastFrameTimeRef.current = timestamp;

      if (!isDraggingNodeRef.current) {
        phaseRef.current += delta;
        setNodes((currentNodes) =>
          currentNodes.map((node) => {
            const basePosition = basePositionsRef.current[node.id] ?? node.position;

            return {
              ...node,
              position: {
                x: basePosition.x,
                y: basePosition.y + getMiniCaseFlowFloatOffset(node.id, phaseRef.current)
              }
            };
          })
        );
      }

      animationFrameId = window.requestAnimationFrame(animateNodes);
    };

    animationFrameId = window.requestAnimationFrame(animateNodes);

    return () => window.cancelAnimationFrame(animationFrameId);
  }, [setNodes]);

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStart={() => {
          isDraggingNodeRef.current = true;
        }}
        onNodeDragStop={(_, node) => {
          const floatOffset = getMiniCaseFlowFloatOffset(node.id, phaseRef.current);
          basePositionsRef.current[node.id] = {
            x: node.position.x,
            y: node.position.y - floatOffset
          };
          isDraggingNodeRef.current = false;
        }}
        nodesConnectable={false}
        panOnDrag={false}
        autoPanOnNodeDrag={false}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        preventScrolling={false}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        proOptions={{ hideAttribution: true }}
        className="mini-case-flow"
      >
        <Background color="rgba(17, 184, 245, 0.16)" gap={18} size={1.5} />
      </ReactFlow>
    </div>
  );
}
