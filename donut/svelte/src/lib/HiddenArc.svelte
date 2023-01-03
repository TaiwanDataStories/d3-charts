<script>
    export let data;

    const calculatePath = (d) =>{
        const firstArcSection = /(^.+?)L/;
        let hiddenArc = firstArcSection.exec(d)[1];
        return  hiddenArc.replace(/,/g, " ");
    }
</script>

{#each data as d,i}
      <path
        class="hiddenArcs"
        id={`hiddenArc${i}`}
        d={calculatePath(d.path)}
        fill="none"
      />
{/each}