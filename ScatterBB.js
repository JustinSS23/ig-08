// script.js

// Wait for the DOM to be ready before executing the script
document.addEventListener('DOMContentLoaded', function () {
    const players = [];

    d3.csv('NBA_Player_Stats.csv').then((data) => {
        // Convert CSV data to the desired format
        data.forEach((row) => {
            const playerName = row.Player;
            const position = row.Pos; // Add position data
            const seasonStats = {
                GP: +row.G,
                points: +row.PTS,
                REB: +row.TRB,
                AST: +row.AST,
                STL: +row.STL,
                BLK: +row.BLK,
                FGM: +row.FG,
                FTM: +row.FT,
                TOV: +row.TOV,
            };

            const playerIndex = players.findIndex(player => player.name === playerName);

            if (playerIndex !== -1) {
                players[playerIndex].seasons.push(seasonStats);
            } else {
                players.push({
                    name: playerName,
                    position: position, // Add position data
                    seasons: [seasonStats],
                });
            }
        });

        const svg = d3.select('#playerStats');
        const circleRadius = 6;

        function createScatterPlot() {
            svg.selectAll('*').remove();

            const xScale = d3.scaleLinear()
                .domain([0, d3.max(players, d => d3.max(d.seasons, s => s.points))])
                .range([60, 500]);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(players, d => d3.max(d.seasons, s => s.GP))])
                .range([350, 60]);

            svg.selectAll('circle')
                .data(players)
                .enter()
                .append('circle')
                .attr('cx', d => xScale(d3.max(d.seasons, s => s.points)))
                .attr('cy', d => yScale(d3.max(d.seasons, s => s.GP)))
                .attr('r', circleRadius)
                .attr('fill', 'black')
                .attr('stroke', 'white')
                .on('mouseover', function (event, d) {
                    d3.select(this).attr('fill', 'orange');
                    showTooltip(event, d);
                })
                .on('mouseout', function () {
                    d3.select(this).attr('fill', 'black');
                    hideTooltip();
                });

            function showTooltip(event, player) {
                const tooltip = d3.select('body').append('div')
                    .attr('class', 'tooltip')
                    .style('top', event.clientY - 30 + 'px')  // Adjust tooltip position
                    .style('left', event.clientX + 10 + 'px');
                tooltip.append('div')
                    .attr('class', 'tooltiptext')
                    .html(`${player.name}: ${d3.max(player.seasons, s => s.points)} points`);
            }

            function hideTooltip() {
                svg.selectAll('.tooltip').remove();
            }
        }

        createScatterPlot();
    });
});
