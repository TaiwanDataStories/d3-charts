const scaleFactor = 1.4;

let width = 1920 / scaleFactor;
let height = 1080 / scaleFactor;


const margin = {
    "top": (0 + 84) / scaleFactor,
    "left": (70 + 84) / scaleFactor,
    "bottom": (85 + 84) / scaleFactor,
    "right": (0 + 84) / scaleFactor
}


//svg
const svg = d3.select("#chart1").append("svg").attr("width", width).attr("height", height);
const bg = svg.append('rect')
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0)
    .attr("fill", "none")
    .attr("opacity", 0.3)


//regions
const regionsE = regions.filter(d => d.year <= 2022); //Estimates
const regionsP = regions.filter(d => d.year > 2021); //Projections

const regionsProjectedE = d3.group(
    regionsE,
    d => d.area
)

const regionsProjectedP = d3.group(
    regionsP,
    d => d.area
)

const regionLabelData = []; //create label data for each region

regionsProjectedP.forEach((value, key) => {
    const newObj = {};
    newObj.key = key;
    newObj.value2100 = value.filter(d => d.year === 2100)[0].population
    regionLabelData.push(newObj);
})


let regionsList = regionLabelData.map(obj => obj.key);
// map each entry to its area... now it's a json with strings that are the area

const regionEColorScale = d3.scaleOrdinal().domain(regionsList).range(["#66c2a4", "#8c96c6", "#fc8d59", "#7bccc4", "#c994c7", "#fe9929"]);
const regionPColorScale = d3.scaleOrdinal().domain(regionsList).range(["#006d2c", "#810f7c", "#b30000", "#0868ac", "#dd1c77", "#d95f0e"]);


const xScale = d3.scaleTime()
    .domain([1950, 2021])
    .rangeRound([0, width - margin.left - margin.right])

const yScale = d3.scaleLinear()
    .domain([0, 8000000])
    .range([height - margin.bottom, 0]);


let xAxis = d3.axisBottom(xScale).tickFormat(d => +d);
let yAxis = d3.axisLeft(yScale).ticks(5);


const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

g.append("g")
    .attr("class", "y-axis")
    .call(yAxis);

g.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);


//for animations that change scales, it's better to place inside a clipping mask so nothing will show outside the main viz rectangle    
const mask = g.append("defs")
    .append("clipPath")
    .attr("id", "mask")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width - margin.right - margin.left)
    .attr("height", height - margin.bottom)


const masked = g.append("g")
    .attr("clip-path", "url(#mask)")

//the text are not part of the animation so can be appended to g instead of mask
g.append("text")
    .attr("id", "unit")
    .attr("x", xScale(1950))
    .attr("y", yScale(8000000))
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .attr("font-size", 14)
    .attr("dx", -5)
    .attr("dy", -20)
    .text("(unit: thousand people)")

g.append("text")
    .attr("id", "source")
    .attr("x", xScale(1950))
    .attr("y", yScale(0))
    .attr("fill", "black")
    .attr("text-anchor", "start")
    .attr("font-size", 14)
    .attr("dx", -15)
    .attr("dy", 40)
    .text("Source: UN World Population Prospects 2022")


function transition(path, callback, duration = 3500) {
    path.transition()
        .duration(duration)
        .attrTween("stroke-dasharray", tweenDash)
        .on("end", callback);
}

function tweenDash() {
    const l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function (t) {
        return i(t)
    };
}


yScale.domain([0, 5500000]);
svg.select(".y-axis")
    .transition().duration(1000)
    .call(d3.axisLeft(yScale));

xScale.domain([1950, 2100]);
svg.select(".x-axis")
    .transition().duration(1000)
    .call(d3.axisBottom(xScale).tickFormat(d => +d));

g.selectAll("text.textRegions")
    .data(regionLabelData)
    .join("text")
    .attr("class","textRegions")
    .attr("x",d=>xScale(2100))
    .attr("y",d=>yScale(d.value2100))
    .attr("dy",d=>d.key==="LATIN AMERICA AND THE CARIBBEAN"?-10:0) //to move it higher so it doesn't overlap with Europe
    .attr("fill","black")
    .attr("opacity",0)
    .attr("text-anchor", "end")
    .text(d=>d.key)


masked.selectAll("path.lineRegionsE")
    .data(regionsProjectedE)
    .join("path")
    .attr("class", "lineRegionsE lineRegions")
    .attr("id", d => d[0].replaceAll(" ", "-") + "E")
    .attr("opacity", 1)
    .attr("fill", "none")
    .attr("stroke", d => regionEColorScale(d[0]))
    .attr("stroke-width", 2)
    .attr("d", d => {
        return d3.line()
            .curve(d3.curveCardinal)
            .x(d => xScale(d.year))
            .y(d => yScale(d.population) || 0)
            .defined((d => d.population))
            (d[1])
    })
    .call(transition);

//wait til estimate line animation ends to draw projection line animation
setTimeout(function () {
    masked.selectAll("path.lineRegionsP")
        .data(regionsProjectedP)
        .join("path")
        .attr("class", "lineRegionsP lineRegions")
        .attr("id", d => d[0].replaceAll(" ", "-") + "P")
        .attr("opacity", 1)
        .attr("fill", "none")
        .attr("stroke", d => regionPColorScale(d[0]))
        .attr("stroke-width", 2)
        .attr("d", d => {
            return d3.line()
                .curve(d3.curveCardinal)
                .x(d => xScale(d.year))
                .y(d => yScale(d.population) || 0)
                .defined((d => d.population))
                (d[1])
        })
        .call(transition);

}, 2500);

//wait til line animation ends to show labels
setTimeout(function () {
    svg.selectAll(".textRegions")
        .attr("opacity", 1);
}, 6000);