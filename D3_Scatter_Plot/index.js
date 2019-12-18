
async function getDataset() {
    return await fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json')
                        .then(response => response.json())
                        .then(data => data.data);
}

async function main() {

    //var data = await getDataset();
    const width = 920; 
    const height = 630;
    const padding = 65; 


    var yearsDate = cyclist_data.map(item => new Date(item.Year.toString()));
    yearsDate.push(new Date("1993"))
    yearsDate.push(new Date("2016"))

    var timeData = cyclist_data.map(item => d3.timeParse("%M:%S")(item.Time));

    var xScale = d3.scaleTime()
        .domain([d3.min(yearsDate),d3.max(yearsDate)])
        .range([padding, width - padding]);
    
    var yScale = d3.scaleTime()
        .domain(d3.extent(timeData))
        .range([padding,height-padding])
    
    d3.select("body").append("div")
        .attr("class", "tooltip")
        .attr("id", "tooltip")
        .style("opacity","0")
    
    var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height)
        .style("border", "3px solid black")
        .style("margin", "40px")
        .style("padding", "30px")

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -350)
        .attr("y", 20)
        .style("font-size", "18px")
        .text("Time in Minutes")
    
    svg.append("text")
        .attr("x", 300)
        .attr("y", 25)
        .text("Doping in Professional Bicycle Racing")
        .style("font-size", "22px")

    svg.append("text")
        .attr("x", 375)
        .attr("y", 55)
        .text("35 Fastest times up Alpe d'Huez")
        .style("font-size", "14px")
    
    svg.selectAll("circle")
        .data(cyclist_data)
        .enter()
        .append("circle")
        .attr("class","dot")
        .attr("r", 6)
        .attr("cx", d => xScale(new Date(d.Year.toString())))
        .attr("cy", d => yScale(d3.timeParse("%M:%S")(d.Time)))
        .attr("fill", d => d["Doping"] === "" ? "rgb(255, 127, 14" : "rgb(31, 119, 180" )
        .attr("stroke", "black")
        .attr("stroke-width", "1")
        .attr("data-xvalue", d => d.Year.toString())
        .attr("data-yvalue", d => d.Time.toString())
    
    var doping = svg.append("g")
        .attr("id", "legend")
        .attr("transform", "translate(0,250)")
        
    doping.append("rect")
        .attr("x", 822)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "rgb(31, 119, 180)")
    
    doping.append("text")
        .attr("x", 816)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("Riders with doping allegations")
    
    var noDoping = svg.append("g")
        .attr("id", "legend")
        .attr("transform", "translate(0,230)")
    
    noDoping.append("rect")
        .attr("x", 822)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", "rgb(255, 127, 14)")
    
    noDoping.append("text")
        .attr("x", 816)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text("No doping allegations")
    
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
    
    $("circle").hover(function () {
        var data_x = $(this).attr("data-xvalue")
        var data_y = $(this).attr("data-yvalue")
        console.log($(this))
        var wanted = cyclist_data.filter(item => item.Year == data_x && item.Time == data_y)[0];
        var htmlText = `${wanted["Name"]}: ${wanted["Nationality"]} <br> Year: ${data_x}, Time: ${data_y} <br><br> ${wanted["Doping"]}`;
        var offsetTop = wanted["Doping"] == "" ? 10 : -5;  
        $("#tooltip").html(htmlText)
        $("#tooltip").css("opacity", "0.9");
        $("#tooltip").css("left", 494 + xScale(new Date(data_x.toString())));
        $("#tooltip").css("top", offsetTop + yScale(d3.timeParse("%M:%S")(data_y)));
        $("#tooltip").attr("data-year", data_x)
        console.log(yScale(d3.timeParse("%M:%S")(data_y)))
        
    }, function () {
        $("#tooltip").css("opacity","0");

    });
}

main(); 
