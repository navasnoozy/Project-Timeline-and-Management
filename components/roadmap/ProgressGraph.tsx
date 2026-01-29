"use client";

import { Box, Flex, Text } from "@chakra-ui/react";
import { Deliverable, TaskStatus, getStatusCounts, TASK_STATUSES } from "./data";

interface ProgressGraphProps {
  deliverables: Deliverable[];
  status: TaskStatus;
}

// Premium status colors
const STATUS_COLORS: Record<TaskStatus, { main: string; bg: string }> = {
  Completed: { main: "#10b981", bg: "#d1fae5" },
  Implementing: { main: "#3b82f6", bg: "#dbeafe" },
  "Planning & Research": { main: "#8b5cf6", bg: "#ede9fe" },
  "On Hold": { main: "#f59e0b", bg: "#fef3c7" },
  "Not Started": { main: "#6b7280", bg: "#f3f4f6" },
};

// Polar to Cartesian conversion
const polarToCartesian = (cx: number, cy: number, radius: number, angleInDegrees: number) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy + radius * Math.sin(angleInRadians),
  };
};

// Create SVG arc path (filled wedge)
const createArcPath = (cx: number, cy: number, innerR: number, outerR: number, startAngle: number, endAngle: number): string => {
  const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);
  const outerStart = polarToCartesian(cx, cy, outerR, endAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outerR} ${outerR} 0 ${largeArc} 0 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${innerR} ${innerR} 0 ${largeArc} 1 ${innerStart.x} ${innerStart.y}`,
    "Z",
  ].join(" ");
};

export const ProgressGraph = ({ deliverables }: ProgressGraphProps) => {
  const totalTasks = deliverables.length;
  const statusCounts = getStatusCounts(deliverables);
  const completedCount = statusCounts["Completed"];
  const completionPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  // Build segments data
  const segments: { status: TaskStatus; count: number; percent: number }[] = [];
  TASK_STATUSES.forEach((s) => {
    const count = statusCounts[s];
    if (count > 0) {
      segments.push({
        status: s,
        count,
        percent: Math.round((count / totalTasks) * 100),
      });
    }
  });

  // Empty state
  if (segments.length === 0) {
    return (
      <Flex direction="column" align="center" justify="center" h="150px">
        <Text fontSize="sm" color="gray.400">
          No deliverables
        </Text>
      </Flex>
    );
  }

  // Larger chart dimensions
  const size = 160;
  const cx = size / 2;
  const cy = size / 2;
  const outerRadius = 72;
  const innerRadius = 44;
  const gapAngle = 3;

  // Calculate arc data
  let currentAngle = 0;
  const arcs = segments.map((seg) => {
    const segmentAngle = (seg.percent / 100) * 360;
    const adjustedAngle = Math.max(segmentAngle - gapAngle, 2);
    const startAngle = currentAngle + gapAngle / 2;
    const endAngle = startAngle + adjustedAngle;
    currentAngle += segmentAngle;

    const midAngle = (startAngle + endAngle) / 2;
    const labelRadius = (innerRadius + outerRadius) / 2;
    const labelPos = polarToCartesian(cx, cy, labelRadius, midAngle);

    return {
      ...seg,
      startAngle,
      endAngle,
      path: createArcPath(cx, cy, innerRadius, outerRadius, startAngle, endAngle),
      labelPos,
    };
  });

  return (
    <Flex direction="column" align="center" gap={3}>
      {/* Donut Chart - Free floating, no card */}
      <Box position="relative" width={`${size}px`} height={`${size}px`}>
        <svg
          width={size}
          height={size}
          style={{
            overflow: "visible",
            filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.15))",
          }}
        >
          {arcs.map((arc) => (
            <path key={arc.status} d={arc.path} fill={STATUS_COLORS[arc.status].main} style={{ transition: "opacity 0.2s" }} />
          ))}
        </svg>

        {/* Center - Completion % */}
        <Flex
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          direction="column"
          align="center"
          justify="center"
          w={`${innerRadius * 2 - 6}px`}
          h={`${innerRadius * 2 - 6}px`}
          borderRadius="full"
          bg="white"
          boxShadow="inset 0 2px 8px rgba(0,0,0,0.06)"
        >
          <Text fontSize="2xl" fontWeight="bold" color="gray.800" lineHeight="1">
            {completionPercent}%
          </Text>
          <Text fontSize="xs" color="gray.500" mt={0.5}>
            complete
          </Text>
        </Flex>

        {/* Percentage labels on segments */}
        {arcs.map((arc) => {
          if (arc.percent < 12) return null;
          return (
            <Text
              key={`lbl-${arc.status}`}
              position="absolute"
              left={`${arc.labelPos.x}px`}
              top={`${arc.labelPos.y}px`}
              transform="translate(-50%, -50%)"
              fontSize="xs"
              fontWeight="bold"
              color="white"
              textShadow="0 1px 4px rgba(0,0,0,0.5)"
              pointerEvents="none"
            >
              {arc.percent}%
            </Text>
          );
        })}
      </Box>

      {/* Horizontal Legend */}
      <Flex gap={3} flexWrap="wrap" justify="center">
        {arcs.map((arc) => (
          <Flex key={arc.status} align="center" gap={1.5} fontSize="xs">
            <Box w="10px" h="10px" borderRadius="sm" bg={STATUS_COLORS[arc.status].main} flexShrink={0} />
            <Text color="gray.600">{arc.status.replace("Planning & Research", "Planning")}</Text>
            <Text fontWeight="bold" color="gray.800">
              ({arc.count})
            </Text>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
