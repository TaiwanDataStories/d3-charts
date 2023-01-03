<script>
    export let data;
    export let colorScale;
</script>

{#each data as d,i}
      <path
        class="slice"
        id={`slice_${i}`}
        d={d.path}
        fill={colorScale(d.fill)}
        stroke="white"
        stroke-width="1"
      />
{/each}