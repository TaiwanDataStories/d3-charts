<script>
  import { timeFormat } from 'd3-time-format';
  export let height;
  export let xScale;

  const dateFormat = timeFormat('%Y');

  const numberOfTicks = (pixelsAvailable, pixelsPerTick = 120) =>
    Math.floor(Math.abs(pixelsAvailable) / pixelsPerTick);

  $: [xMin, xMax] = xScale.range();

  $: ticks = xScale.ticks(numberOfTicks(xMax - xMin));
</script>

<g transform={`translate(0 ${height})`}>
  {#each ticks as tick}
    <g transform={`translate(${xScale(tick)} 0)`}>
      <line y1={0} y2={6} stroke="#000000" />

      <text y={10} dy="0.8em" text-anchor="middle" fill="#000000">
        {dateFormat(tick)}
      </text>
    </g>
  {/each}
</g>
