<script>
    export let data;
    export let length;
    export let unitDimension;
    export let colorScale;
</script>

{#each data as d}
      <rect
        class="unit"
        x={(d.x * length) / unitDimension}
        y={(d.y * length) / unitDimension}
        width={length / unitDimension}
        height={length / unitDimension}
        fill={colorScale(d.category)}
        stroke="white"
        stroke-width="2"
      />
{/each}