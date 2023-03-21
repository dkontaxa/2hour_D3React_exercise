import React, { useState, useEffect } from "react";
import * as d3 from "d3";
import AreaChart from "../src/Components/AreaChart";
import lakePowellData from "../src/Data/LakePowellStorageVolume.json";
import MultiLineChart from "../src/Components/MultiLineChart";

const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(lakePowellData.data);
  }, []);
  console.log(data);
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };
  const width = 600 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  const formatTime = d3.timeFormat("%Y-%m-%d");
  const formatMonth = d3.timeFormat("%B %Y");
  const formatYear = d3.timeFormat("%Y");

  const handleTimeFormatChange = (format) => {
    setFormat(format);
  };

  const [format, setFormat] = React.useState("raw");

  let dataAggregated;
  if (format === "year") {
    dataAggregated = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d[1]),
      (d) => new Date(d[0]).getFullYear()
    );
  } else if (format === "month") {
    dataAggregated = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => d[1]),
      (d) => formatMonth(new Date(d[0]))
    );
  } else {
    dataAggregated = data;
  }

  const transformedData = Array.from(dataAggregated, ([datetime, storage]) => ({
    datetime: new Date(datetime),
    storage,
  }));

  return (
    <div>
      <h1>Area Chart Example</h1>
      <div>
        <label>
          <input
            type="radio"
            value="raw"
            checked={format === "raw"}
            onChange={() => handleTimeFormatChange("raw")}
          />
          Raw
        </label>
        <label>
          <input
            type="radio"
            value="year"
            checked={format === "year"}
            onChange={() => handleTimeFormatChange("year")}
          />
          Yearly
        </label>
        <label>
          <input
            type="radio"
            value="month"
            checked={format === "month"}
            onChange={() => handleTimeFormatChange("month")}
          />
          Monthly
        </label>
      </div>
      <AreaChart
        data={transformedData}
        width={width}
        height={height}
        margin={margin}
        xAccessor={(d) => d.datetime}
        yAccessor={(d) => d.storage}
      />
      <MultiLineChart
        data={transformedData}
        width={width}
        height={height}
        margin={margin}
        timeFormat="%Y-%m-%d"
      />
    </div>
  );
};

export default App;
