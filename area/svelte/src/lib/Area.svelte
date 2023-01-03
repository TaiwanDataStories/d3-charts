<script>
    import * as d3 from "d3";
    export let data;
    export let xScale;
    export let yScale;
    export let color;

    // Create an area generator
    const areaGenerator = d3
        .area()
        .x((d) => xScale(new Date(d.date)))
        .y0(yScale(0))
        .y1((d) => yScale(d.value));
</script>

<path d={areaGenerator(data)} fill={color} />
