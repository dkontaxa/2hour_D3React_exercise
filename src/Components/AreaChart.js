import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const AreaChart = ({
  data,
  width,
  height,
  margin,
  timeAggregation = "month",
  timeFormat = "%Y-%m-%d",
  xLabel,
  yLabel,
}) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    // Time parsing
    const parseDate = d3.timeParse(timeFormat);
    const formatDate = d3.timeFormat(timeFormat);

    const timeAggregator =
      timeAggregation === "year"
        ? d3.timeYear
        : timeAggregation === "raw"
        ? null
        : d3.timeMonth;

    const xScale = timeAggregator
      ? d3
          .scaleTime()
          .domain(d3.extent(data, (d) => parseDate(d[0])))
          .range([margin.left, width - margin.right])
          .nice(timeAggregator)
      : d3
          .scaleBand()
          .domain(data.map((d) => d[0]))
          .range([margin.left, width - margin.right])
          .paddingInner(0.1)
          .paddingOuter(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d[1])])
      .range([height - margin.bottom, margin.top]);

    // Define axes
    const xAxis = d3.axisBottom(xScale).tickFormat(formatDate);
    const yAxis = d3.axisLeft(yScale);

    // Draw axes
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(xAxis);

    svg
      .select(".y-axis")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(yAxis);

    //  Area drawing
    const area = d3
      .area()
      .x((d) => xScale(parseDate(d[0])))
      .y0(yScale(0))
      .y1((d) => yScale(d[1]));

    svg
      .select(".area")
      .datum(data)
      .attr("d", area)
      .attr("fill", "steelblue")
      .attr("opacity", 0.5);
  }, [data, width, height, margin, timeAggregation, timeFormat]);

  return (
    <svg ref={svgRef} width={width} height={height}>
      <g className="x-axis" />
      <g className="y-axis" />
      <path className="area" />
      {xLabel && (
        <text
          className="x-label"
          x={width / 2}
          y={height - margin.bottom / 2}
          textAnchor="middle"
        >
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text
          className="y-label"
          x={-height / 2}
          y={margin.left / 2}
          textAnchor="middle"
          transform={`rotate(-90)`}
        >
          {yLabel}
        </text>
      )}
    </svg>
  );
};

export default AreaChart;
