<script>
    export let data;
</script>

{#each data as d,i}
      <text
        class="donutText"
        dy="-13"
      >
        <textPath
            startOffset="50%"
            text-anchor="middle"
            xlink:href ={`#hiddenArc${i}`}
        >
            {Math.round(d.data.ratio*10)/10+"%"}
        </textPath>
    </text>
{/each}