import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

// The function passes the following Props
// data: respectively.
// width: of the chart.
// height: of the chart.
// margin: top, right, bottom, and left margins of the chart.
const MultiLineChart = ({
  data,
  width,
  height,
  margin,
  timeFormat = "%Y-%m-%d",
}) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    const parseDate = d3.timeParse(timeFormat);

    const xScale = d3
      .scaleTime()
      .domain(d3.extent(data, (d) => parseDate(d.date)))
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([height - margin.bottom, margin.top]);

    const xAxis = d3.axisBottom(xScale).ticks(d3.timeWeek.every(1));
    const yAxis = d3.axisLeft(yScale);

    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg
      .select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    const line = d3
      .line()
      .x((d) => xScale(parseDate(d.date)))
      .y((d) => yScale(d.value));

    const lines = svg.select(".lines").selectAll("path").data(data);

    lines.exit().remove();

    lines
      .enter()
      .append("path")
      .merge(lines)
      .attr("d", (d) => line(data))
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("fill", "none");
  }, [data, width, height, margin, timeFormat]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g className="x-axis" />
      <g className="y-axis" />
      <g className="lines" />
    </svg>
  );
};

export default MultiLineChart;
