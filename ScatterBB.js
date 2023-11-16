d3.csv("NBA_Player_Stats.csv").then(function (dataset) {
    console.log(dataset);

    var dimensions = {
        width: 800,
        height: 800,
        margin: {
            top: 10,
            bottom: 50,
            right: 10,
            left: 50
        }
    };

    var targetSeason = "2021-22";

    var filteredData = dataset.filter(function (d) {
        return d.Season === targetSeason;
    });

    filteredData.forEach(function (d) {
        d['FG'] = parseInt(d['FG']);
        d['PTS'] = parseInt(d['PTS']);
    });
    console.log(filteredData);

    // Allows for dynamic reallocation
    var xAccessor = function (d) {
        return d.FG;
    };
    var yAccessor = function (d) {
        return d.PTS;
    };

    var selectedPlayers = []; // Array to store selected player names

    var svg = d3.select("#stackedbarchart")
        .style("width", dimensions.width)
        .style("height", dimensions.height);

    var xScale = d3.scaleLinear()
        .domain(d3.extent(filteredData, xAccessor))
        .range([dimensions.margin.left, dimensions.width - dimensions.margin.right]);

    var yScale = d3.scaleLinear()
        .domain(d3.extent(filteredData, yAccessor))
        .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

    var dots = svg.append("g")
        .selectAll("circle")
        .data(filteredData)
        .enter()
        .append("circle")
        .on("mouseover", function (d) {
            d3.select(this).attr("fill", "red");
        })
        .on("mouseout", function () {
            d3.select(this).attr("fill", "black");
        })
        .on("click", function (d, i) {
            // Check if the player is already selected
            var isSelected = selectedPlayers.includes(i.Player);
        
            // If not selected, add to the array
            if (!isSelected) {
                selectedPlayers.push(i.Player);
                d3.select(this).attr("stroke-width", "2").attr("stroke", "red");
            } else {
                // If already selected, remove from the array
                var index = selectedPlayers.indexOf(i.Player);
                selectedPlayers.splice(index, 1);
                d3.select(this).attr("stroke-width", null).attr("stroke", null);
            }
        
            console.log("Selected Players: ", selectedPlayers);
        })
        .attr("cx", d => xScale(xAccessor(d)))
        .attr("cy", d => yScale(yAccessor(d)))
        .attr("r", 3)
        .attr("fill", "black");

    var xAxisGen = d3.axisBottom().scale(xScale);
    var xAxis = svg.append("g")
        .call(xAxisGen)
        .style("transform", `translateY(${dimensions.height - dimensions.margin.bottom}px)`);

    var yAxisGen = d3.axisLeft().scale(yScale);
    var yAxis = svg.append("g")
        .call(yAxisGen)
        .style("transform", `translateX(${dimensions.margin.left}px)`);
});
