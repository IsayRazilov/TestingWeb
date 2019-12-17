
async function getDataset() {
    return await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
                        .then(response => response.json())
                        .then(data => data.data);
}

async function main() {

    //var data = await getDataset();
    
    console.log(cyclist_data);
    const width = 920; 
    const height = 630;
    const padding = 50; 


    var yearsDate = cyclist_data.map(item => new Date(item.Year.toString()));
    yearsDate.push(new Date("1993"))
    yearsDate.push(new Date("2016"))
    var timeData = cyclist_data.map(item => d3.timeParse("%M:%S")(item.Time));
    console.log(timeData);
    var xScale = d3.scaleTime()
        .domain([d3.min(yearsDate),d3.max(yearsDate)])
        .range([padding, width - padding]);
    
    var yScale = d3.scaleTime()
        .domain(d3.extent(timeData))
        .range([padding,height-padding])
    
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "1px solid black")

    console.log(yearsDate)
    
    svg.selectAll("circle")
        .data(cyclist_data)
        .enter()
        .append("circle")
        .attr("r", 6)
        .attr("cx", d => xScale(new Date(d.Year.toString())))
        .attr("cy", d => yScale(d3.timeParse("%M:%S")(d.Time)))
        .attr("fill", d => d["Doping"] === "" ? "rgb(255, 127, 14" : "rgb(31, 119, 180" )
        .attr("stroke", "black")
        .attr("stroke-width","1")
    
        
    const xAxis = d3.axisBottom().scale(xScale) ;
    svg.append("g")
        .attr("id","x-axis")
        .attr("transform", `translate(0, ${height-padding})`)
        .call(xAxis);
    
    const yAxis = d3.axisLeft().scale(yScale).tickFormat( d => d3.timeFormat("%M:%S")(d))
    svg.append("g")
    .attr("id","y-axis")
    .attr("transform", `translate(${padding}, 0)`)
    .call(yAxis);
}

main(); 
