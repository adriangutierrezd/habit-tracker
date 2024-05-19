import { useState } from "react";
import { Renderer } from "./Renderer";
import { Tooltip } from "./Tooltip";

type HeatmapProps = {
  width: number;
  height: number;
  color: string;
  maxValue: number;
  data: { x: string; y: string; value: number }[];
};

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number;
};

export const Heatmap = ({ width, height, data, color, maxValue }: HeatmapProps) => {

  return (
    <div style={{ position: "relative" }}>
      <Renderer
        width={width}
        height={height}
        data={data}
        color={color}
        maxValue={maxValue}
      />
    </div>
  );
};
