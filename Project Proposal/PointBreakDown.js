d3.csv("NBA_Player_Stats.csv").then(
    function(dataset){
        console.log(dataset)

        var dimensions = {
            width: 500,
            height: 600,
            margin: {
                top: 10,
                bottom: 50,
                right: 10,
                left: 50
            }
        }

        var svg = d3.select("#stackedbarchart")
            .style("width", dimensions.width)
            .style("height", dimensions.height)

        var selectedPlayers = ["Luka Dončić", "Donovan Mitchell", "Stephen Curry", "Jayson Tatum", "Joel Embiid"];
        
         //static for now but can be changed to intereacted with to have different seasons
         var targetSeason = "2021-22";

         var filteredData = dataset.filter(function(d) {
            return d.Season === targetSeason && selectedPlayers.includes(d.Player);
        });

        filteredData.forEach(function (d) {
            d['2P'] = parseInt(d['2P']) * 2;
            d['3P'] = parseInt(d['3P']) * 3;
        });
        console.log(filteredData)

        var xScale = d3.scaleBand()
            .domain(selectedPlayers)
            .range([dimensions.margin.left, dimensions.width - dimensions.margin.right])
            .padding(0.1);

        //max points scored in a season
        var maxPoints = d3.max(dataset, function(d) {
            return parseInt(d['PTS']);
        })
  
        // Define the yScale based on the maximum points
        var yScale = d3.scaleLinear()
            .domain([0, maxPoints])
            .range([dimensions.height - dimensions.margin.bottom, dimensions.margin.top]);

        //values that contribute to points
        var keys = ['2P', '3P', 'FT'];

        var stack = d3.stack()
            .keys(keys)
            .order(d3.stackOrderNone) //default stacking order
            (filteredData);

        var colorScale = d3.scaleOrdinal()
            .domain(keys)
            .range(["blue", "green","red"])


        var bars = svg.append("g")
            .selectAll("g")
            .data(stack)
            .enter()
            .append("g")
            .attr("fill", function(d, i) {
                return colorScale(keys[i]);
            });

        // Create and position the stacked bars
        bars.selectAll("rect")
            .data(function(d) {
                return d;
            })
            .enter()
            .append("rect")
            .attr("x", function(d) {
                return xScale(d.data.Player);
            })
            .attr("y", function(d) {
                return yScale(d[1]);
            })
            .attr("height", function(d) {
                return yScale(d[0]) - yScale(d[1]);
            })
            .attr("width", xScale.bandwidth());

        // Create X and Y axes
        var xAxis = d3.axisBottom(xScale);
        var yAxis = d3.axisLeft(yScale);

        // Create a group for the X-axis
        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(0," + (dimensions.height - dimensions.margin.bottom) + ")")
            .call(xAxis);

        // Create a group for the Y-axis
        svg.append("g")
            .attr("class", "y-axis")
            .attr("transform", "translate(" + dimensions.margin.left + ",0)")
            .call(yAxis);

    }
    )
