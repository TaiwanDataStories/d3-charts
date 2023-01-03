<script>
  import * as d3 from 'd3';
  export let data;
  export let xScale;
  export let yScale;
  export let interpolation;
  export let colorScale;
  export let region;

  $: lineGenerator = d3
    .line()
    .x(d => xScale(new Date(d.year, 0, 1)))
    .y(d => yScale(d.population))
    .curve(interpolation);

  $: line = lineGenerator(data);
</script>

<path class="line" d={line} stroke={colorScale(region)} />

<style>
  .line {
    fill: none;
    stroke-width: 2px;
    stroke-linecap: round;
  }
</style>
