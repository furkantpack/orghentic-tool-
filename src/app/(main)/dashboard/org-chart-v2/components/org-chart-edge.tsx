import { colorMap, type OrgNode, projectionStageStyles } from "../data";

export function OrgChartEdge({ from, to }: { from: OrgNode; to: OrgNode }) {
  const dashed = to.isGhost || to.isPlanned;
  const color = to.projectionStage ? projectionStageStyles[to.projectionStage].edge : colorMap[to.color].line;
  const nodeCenterX = 160;
  const nodeBottomY = 224;

  return (
    <path
      className={`${color} transition-opacity hover:opacity-100`}
      d={`M ${from.position.x + nodeCenterX} ${from.position.y + nodeBottomY} C ${from.position.x + nodeCenterX} ${from.position.y + nodeBottomY + 90}, ${to.position.x + nodeCenterX} ${to.position.y - 90}, ${to.position.x + nodeCenterX} ${to.position.y}`}
      fill="none"
      strokeDasharray={dashed ? "8 8" : undefined}
      strokeWidth="2.5"
    />
  );
}
