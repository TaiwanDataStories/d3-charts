<script>
  export let data;
  export let xScale;
  export let yScale;
  export let region;
  export let maxDate;
  export let maxYear;
  $: arrayForMaxYear = data.filter(obj => {
    return obj.year == maxYear;
  });
</script>

{#if typeof arrayForMaxYear[0].population != 'undefined'}
  <text
    x={xScale(maxDate)}
    y={yScale(arrayForMaxYear[0].population)}
    dy={region === 'LATIN AMERICA AND THE CARIBBEAN' ? -10 : 0}
    text-anchor="end"
    fill="#000000"
  >
    {region}
  </text>
{/if}
