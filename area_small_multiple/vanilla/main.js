const scaleFactor = 4;

let width = 1920 / scaleFactor;
let height = 1080 / scaleFactor;


const margin = {
    "top": (0 + 84) / scaleFactor,
    "left": (70 + 84) / scaleFactor,
    "bottom": (85 + 84) / scaleFactor,
    "right": (0 + 84) / scaleFactor
}

//group data
const countries = d3.group(data, d => d.country)


const minDate = new Date(data[0].date);
const maxDate = new Date(data[data.length - 1].date);

const dateFormat = d3.timeFormat("%Y %b");

const xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, width - margin.left - margin.right])

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height - margin.bottom, 0]);

// Create an area generator
const areaGenerator = d3.area()
    .x(d => xScale(new Date(d.date)))
    .y0(yScale(0))
    .y1(d => yScale(d.value))

//Create an svg for each country
countries.forEach(function (country) {

    const before = country.filter(d => d.date <= "2022-03")
    const after = country.filter(d => d.date >= "2022-03")

    let xAxis = d3.axisBottom(xScale).tickFormat(d => dateFormat(d)).ticks(5);
    let yAxis = d3.axisLeft(yScale).ticks(5);

    //svg
    const svg = d3.select("#chart1").append("svg").attr("width", width).attr("height", height);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    g.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    g.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(xAxis);

    //create two separate area charts
    g.append("path")
        .datum(before)
        .attr("fill", "#bdbdbd")
        .attr("d", areaGenerator)

    g.append("path")
        .datum(after)
        .attr("fill", "#e34a33")
        .attr("d", areaGenerator)

    g.append("text")
        .attr("x",10)
        .attr("y",0)
        .attr("fill","black")
        .style("font-weight",700)
        .text(country[0].country)

})


