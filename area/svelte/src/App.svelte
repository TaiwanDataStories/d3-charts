<script>
  import Area from "./lib/Area.svelte";
  import Xaxis from "./lib/Xaxis.svelte";
  import Yaxis from "./lib/Yaxis.svelte";
  import data from "./data/data.json";
  import * as d3 from "d3";

  //Prep data: filter for EU only
  const EU = data.filter((d) => d.country === "EU27");
  //create two separate area charts by filtering the data into two sets
  const EUbefore = EU.filter((d) => d.date <= "2022-03");
  const EUafter = EU.filter((d) => d.date >= "2022-03");

  const scaleFactor = 1.8;

  let width = 1920 / scaleFactor;
  let height = 1080 / scaleFactor;

  const margin = {
    top: (0 + 84) / scaleFactor,
    left: (70 + 84) / scaleFactor,
    bottom: (85 + 84) / scaleFactor,
    right: (0 + 84) / scaleFactor,
  };

  const minDate = new Date(data[0].date);
  const maxDate = new Date(data[data.length - 1].date);

  const xScale = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([0, width - margin.left - margin.right]);

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.value)])
    .range([height - margin.bottom, 0]);

</script>

<svg {width} {height}>
  <g transform="translate({margin.left},{margin.top})">
    <Area data={EUbefore} {xScale} {yScale} color={"#bdbdbd"} />
    <Area data={EUafter} {xScale} {yScale} color={"#e34a33"} />
    <Xaxis {xScale} height={height - margin.bottom} />
    <Yaxis {yScale} />
  </g>
</svg>