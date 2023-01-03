<script>
    export let data;
    export let length;
    export let unitDimension;
</script>

{#each data as d}
      <text
        class="label"
        x={(d.label[0] * length) / unitDimension}
        y={(d.label[1] * length) / unitDimension}
        dx={d.ratio > 9 ? 5:9}
        dy={length / unitDimension/1.6}
        fill="white"
      >
      {d.ratio}%
    </text>
{/each}