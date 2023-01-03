<script>
  import * as d3 from 'd3';
  import regions from '../../public/data/regions.js';
  import XAxis from './XAxis.svelte';
  import YAxis from './YAxis.svelte';
  import Line from './Line.svelte';
  import LineLabel from './LineLabel.svelte';

  const regionsE = regions.filter(d => d.year <= 2022);
  const regionsP = regions.filter(d => d.year > 2021);

  const regionsArray = [...new Set(regions.map(item => item.area))];

  const regionEColorScale = d3
    .scaleOrdinal()
    .domain(regionsArray)
    .range(['#66c2a4', '#8c96c6', '#fc8d59', '#7bccc4', '#c994c7', '#fe9929']);

  const regionPColorScale = d3
    .scaleOrdinal()
    .domain(regionsArray)
    .range(['#006d2c', '#810f7c', '#b30000', '#0868ac', '#dd1c77', '#d95f0e']);

  let width = 800;
  let height = 650;

  const margin = {
    top: 40,
    left: 90,
    bottom: 50,
    right: 70,
  };

  let innerHeight = height - margin.top - margin.bottom;
  $: innerWidth = width - margin.left - margin.right;

  const minDate = new Date(Math.min(...regions.map(item => item.year)), 0, 1);
  const maxDate = new Date(Math.max(...regions.map(item => item.year)), 0, 1);

  const minPopulation = 0;
  const maxPopulation = Math.max(...regions.map(item => item.population));

  $: xScale = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .rangeRound([0, innerWidth]);

  let yScale = d3
    .scaleLinear()
    .domain([minPopulation, maxPopulation])
    .nice()
    .range([innerHeight, 0]);

  const populationFormat = d3.format(',');
  const yearFormat = d3.timeFormat('%Y');

  const interpolation = d3.curveCardinal;
</script>

<div id="chart1" bind:clientWidth={width}>
  <svg {width} {height}>
    <g transform={`translate(${margin.left}, ${margin.top})`}>
      <YAxis {yScale} {populationFormat} />
      <XAxis {xScale} height={innerHeight} />
      {#each regionsArray as region, i}
        <Line
          data={regionsE.filter(d => d.area === region)}
          {xScale}
          {yScale}
          {interpolation}
          colorScale={regionEColorScale}
          {region}
        />
        <Line
          data={regionsP.filter(d => d.area === region)}
          {xScale}
          {yScale}
          {interpolation}
          colorScale={regionPColorScale}
          {region}
        />
        <LineLabel
          data={regionsP.filter(d => d.area === region)}
          {xScale}
          {yScale}
          {region}
          {maxDate}
          maxYear={yearFormat(maxDate)}
        />
      {/each}
      <text
        x={xScale(minDate)}
        y={yScale(maxPopulation)}
        dx={-5}
        dy={-20}
        text-anchor="middle"
        font-size="14px"
        fill="#000000"
      >
        (unit: thousand people)
      </text>
      <text
        x={xScale(minDate)}
        y={yScale(minPopulation)}
        dx={-15}
        dy={40}
        text-anchor="start"
        font-size="14px"
        fill="#000000"
      >
        Source: UN World Population Prospects 2022
      </text>
    </g>
  </svg>
</div>

<style>
  #chart1 {
    position: relative;
  }
</style>
