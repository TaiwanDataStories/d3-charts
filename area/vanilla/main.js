const scaleFactor = 1.8;

let width = 1920 / scaleFactor;
let height = 1080 / scaleFactor;

const margin = {
    "top": (0 + 84) / scaleFactor,
    "left": (70 + 84) / scaleFactor,
    "bottom": (85 + 84) / scaleFactor,
    "right": (0 + 84) / scaleFactor
}


//Data: filter for EU only

//to create a before / after area chart...
//OPTION ONE: keep one dataset for one area chart but use clip path
const EU = data.filter(d => d.country === "EU27");
//OPTION TWO: create two separate area charts by filtering the data into two sets
const EUbefore = EU.filter(d => d.date <= "2022-03")
const EUafter = EU.filter(d => d.date >= "2022-03")


const minDate = new Date(data[0].date);
const maxDate = new Date(data[data.length - 1].date);

const dateFormat = d3.timeFormat("%Y %b");

const xScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, width - margin.left - margin.right])

const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height - margin.bottom, 0]);


let xAxis = d3.axisBottom(xScale).tickFormat(d => dateFormat(d))
let yAxis = d3.axisLeft(yScale).ticks(5);

// Create an area generator
const areaGenerator = d3.area()
    .x(d=>xScale(new Date(d.date)))
    .y0(yScale(0))
    .y1(d=>yScale(d.value))

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


//OPTION ONE: use clip path
// g.append("clipPath")
//     .attr("id", "before")
//     .append("rect")
//     .attr("x", 0)
//     .attr("y", 0)
//     .attr("width", xScale(new Date("2022-03")))
//     .attr("height", yScale(0));

// g.append("clipPath")
//     .attr("id", "after")
//     .append("rect")
//     .attr("x", xScale(new Date("2022-03")))
//     .attr("y", 0)
//     .attr("width", xScale(new Date("2022-10")) - xScale(new Date("2022-03")))
//     .attr("height", yScale(0));

// g.append("path")
//     .datum(EU)
//     .attr("fill", "#bdbdbd")
//     .attr("d", areaGenerator)
//     .attr("clip-path", "url(#before)");

// g.append("path")
//     .datum(EU)
//     .attr("fill", "#e34a33")
//     .attr("d", areaGenerator)
//     .attr("clip-path", "url(#after)");


//OPTION TWO: create two separate area charts
g.append("path")
    .datum(EUbefore)
    .attr("fill", "#bdbdbd")
    .attr("d", areaGenerator)

g.append("path")
    .datum(EUafter)
    .attr("fill", "#e34a33")
    .attr("d", areaGenerator)