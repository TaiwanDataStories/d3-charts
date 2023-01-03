<script>
    export let data;
    export let categoryHeight;
    export let colorScale;
</script>

{#each data as d,i}
    <g transform="translate(0,{i*categoryHeight})">
        <text transform="translate(15,9)">
            {d.category}
        </text>
        <rect
            fill={colorScale(d.category)}
            width="10"
            height="10"
        ></rect>
        
    </g>
{/each}