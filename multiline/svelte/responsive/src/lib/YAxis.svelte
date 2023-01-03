<script>
  export let yScale;
  export let populationFormat;

  const numTicks = 5;

  let ticks = yScale.ticks(numTicks);
</script>

<g>
  {#each ticks as tick}
    <g class="tick" transform="translate(0, {yScale(tick)})">
      <line x1={0} x2={-6} stroke="#000000" />
      <text dx={-10} dy="0.34em" text-anchor="end">
        {populationFormat(tick)}
      </text>
    </g>
  {/each}
</g>
