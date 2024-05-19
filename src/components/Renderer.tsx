import { useMemo } from "react";
import * as d3 from "d3";
import { hexToRgba } from "../utils";

const MARGIN = { top: 10, right: 50, bottom: 30, left: 50 };

type RendererProps = {
  width: number;
  height: number;
  data: { x: string; y: string; value: number }[];
  maxValue: number;
  color: string;
};

export const Renderer = ({
  width,
  height,
  data,
  maxValue,
  color,
}: RendererProps) => {
  // The bounds (=area inside the axis) is calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const allYGroups = useMemo(() => [...new Set(data.map((d) => d.y))], [data]);
  const allXGroups = useMemo(() => [...new Set(data.map((d) => d.x))], [data]);


  const xScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(allXGroups)
      .padding(0.07);
  }, [data, width]);

  const yScale = useMemo(() => {
    return d3
      .scaleBand()
      .range([boundsHeight, 0])
      .domain(allYGroups)
      .padding(0.07);
  }, [data, height]);


  const rgbaColorScale = 1 / maxValue;

  const getColor = (value: number) => {
    if(value < 1) return 'rgba(237, 237, 237, 0.8)'
    return hexToRgba(color, value * rgbaColorScale)
  }

  // Build the rectangles
  const allShapes = data.map((d, i) => {
    const x = xScale(d.x);
    const y = yScale(d.y);

    if (d.value === null || !x || !y) {
      return;
    }

    return (
      <rect
        key={i}
        r={4}
        x={xScale(d.x)}
        y={yScale(d.y)}
        width={xScale.bandwidth()}
        height={yScale.bandwidth()}
        opacity={1}
        fill={getColor(d.value)}
        rx={5}
        stroke={""}
        cursor="pointer"
      />
    );
  });

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
        {allShapes}
      </g>
    </svg>
  );
};
