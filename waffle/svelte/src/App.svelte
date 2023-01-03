<script>
  import Waffle from "./lib/Waffle.svelte";
  import WaffleLabel from "./lib/WaffleLabel.svelte";
  import Legend from "./lib/Legend.svelte";
  import data from "./data/data.json";
  import * as d3 from "d3";

  // or if there is a manual order can do the following
  const categoriesSorted = [
    "Critically Endangered",
    "Endangered",
    "Vulnerable",
    "Near Threatened",
    "Least Concern",
    "Data Deficient",
  ];

  const colorScale = d3
    .scaleOrdinal()
    .domain(categoriesSorted)
    .range(["#b30000", "#e34a33", "#fc8d59", "#fdbb84", "#fdd49e", "#d9d9d9"]);

  const sumSortWaffleData = (data) => {
    //summarise data & calculate ratio & raw count for each category
    const rolledData = data.map((entry) =>
      d3.map(
        d3.rollup(
          data,
          (v) => v.length,
          (d) => d.redlistCategory
        ),
        ([category, result]) => ({
          category: category,
          ratio: (result / data.length) * 100,
          quantity: result,
        })
      )
    )[0];

    // sort the data based on the order of categoriesSorted
    const order = {}; // map for efficient lookup of sortIndex
    for (let i = 0; i < categoriesSorted.length; i++) {
      order[categoriesSorted[i]] = i;
    }

    return rolledData.sort((a, b) => order[a.category] - order[b.category]);
  };

  const createWaffleData = (data) => {
    const array = [];
    const max = data.length - 1;
    let index = 0,
      curr = 1,
      accu = Math.round(data[0].ratio),
      waffle = [],
      category = "",
      ratio = "",
      labelX = 0,
      labelY = 0;

    for (let y = 0; y < 10; y++)
      for (let x = 0; x < 10; x++) {
        if (curr > accu && index < max) {
          let r = Math.round(data[++index].ratio);
          while (r === 0 && index < max) r = Math.round(data[++index].ratio);
          accu += r;
          labelX = x;
          labelY = y;
        }
        category = data[index].category;
        ratio = data[index].ratio.toFixed(0);
        waffle.push({
          x,
          y,
          index,
          ratio,
          category,
          label: [labelX, labelY],
        });
        curr++;
      }
    array.push(waffle);
    return array;
  };

  //final dataset
  const waffleDataSummed = sumSortWaffleData(data);
  const waffleData = createWaffleData(waffleDataSummed);

  // all variables related to dimensions
  const length = 400;
  const marginLength = 30;

  const categoryHeight = 20;
  const legendPadding = 20;
  const legendHeight = categoryHeight * categoriesSorted.length;

  const margin = {
    top: marginLength,
    left: marginLength,
    bottom: marginLength,
    right: marginLength,
  };

  const unitDimension = 10;
</script>

<svg
  width={length + margin.left + margin.right}
  height={length + margin.top + margin.bottom + legendHeight}
>
  <g transform="translate({margin.left},{margin.top})">
    <Waffle 
      data={waffleData[0]} 
      {length} 
      {unitDimension} 
      {colorScale} 
    />
    <WaffleLabel
      data={waffleData[0]} 
      {length} 
      {unitDimension} 
    />
  </g>
  <g transform="translate({margin.left},{margin.top + legendPadding + length})">
    <Legend 
    data={waffleDataSummed} 
    {categoryHeight}
    {colorScale}
    ></Legend>

  </g>
</svg>
