document.addEventListener('DOMContentLoaded', function () {
    let pointsChart, asttovChart, perChart, fgChart, pointsPERChart; // Declare chart variables

    // Function to load data based on the selected season
    function loadData(csvFile) {
        fetch(csvFile)
            .then(response => response.text())
            .then(data => {
                const playerData = data.split('\n').slice(1).map(entry => entry.trim());

                const playerNames = playerData.map(entry => entry.split(',')[0]);
                const playerPoints = playerData.map(entry => parseFloat(entry.split(',')[3]));
                const playerASTTOV = playerData.map(entry => parseFloat(entry.split(',')[22]));
                const playerPER = playerData.map(entry => parseFloat(entry.split(',')[21])).filter(val => !isNaN(val));
                const playerFGPercentage = playerData.map(entry => parseFloat(entry.split(',')[5]));

                // Clear existing charts
                clearCharts();

                // Call functions to update charts based on loaded data
                updatePointsChart(playerNames, playerPoints);
                updateASTTOVChart(playerNames, playerASTTOV);
                updatePerChart(playerNames, playerPER);
                updateFGChart(playerNames, playerFGPercentage);
                updatePointsPERChart(playerNames, playerPoints, playerPER);
            })
            .catch(error => console.error('Error fetching data:', error));
    }

    // Load default data for the initial season (e.g., 2021-2022)
    loadData('21-22.csv');

    // Dynamically set up event listeners for season buttons
    const seasonButtons = document.querySelectorAll('button[data-csv]');
    seasonButtons.forEach(button => {
        button.addEventListener('click', function () {
            const csvFile = this.getAttribute('data-csv');
            loadData(csvFile);
        });
    });

    // Function to clear existing charts
    function clearCharts() {
        if (pointsChart) {
            pointsChart.destroy();
        }
        if (asttovChart) {
            asttovChart.destroy();
        }
        if (perChart) {
            perChart.destroy();
        }
        if (fgChart) {
            fgChart.destroy();
        }
        if (pointsPERChart) {
            pointsPERChart.destroy();
        }
    }

    // Function to update Bar Chart for Points
    function updatePointsChart(labels, data) {
        const pointsCtx = document.getElementById('points-chart').getContext('2d');
        pointsChart = new Chart(pointsCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Points',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            autoSkip: false,
                        }
                    },
                    x: {
                        ticks: {
                            autoSkip: false,
                        }
                    }
                },
            },
        });
    }


    // Function to update Scatter Plot for AST/TOV Ratio
    function updateASTTOVChart(labels, data) {
        const astTovCtx = document.getElementById('AST/TOV-chart').getContext('2d');
        asttovChart = new Chart(astTovCtx, {
            type: 'scatter',
            data: {
                labels: labels,
                datasets: [{
                    label: 'AST/TOV',
                    data: data.map((asttov, index) => ({ x: index, y: asttov })),
                    backgroundColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Function to update Bar Chart for Player Efficiency Rating Overall
    function updatePerChart(labels, data) {
        const perCtx = document.getElementById('overall-chart').getContext('2d');
        perChart = new Chart(perCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Player Efficiency Rating Overall',
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            autoSkip: false,
                        }
                    },
                    x: {
                        ticks: {
                            autoSkip: false,
                        }
                    }
                },
            },
        });
    }

    // Function to update Scatter Plot for Field Goals Made
    function updateFGChart(labels, data) {
    const fgCtx = document.getElementById('fg-chart').getContext('2d');
    fgChart = new Chart(fgCtx, {
        type: 'scatter',
        data: {
            labels: labels,
            datasets: [{
                label: 'Field Goals Made',
                data: data.map((fg, index) => ({ x: index, y: fg })),
                backgroundColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


    // Function to update Scatter Plot for Points vs. Player Efficiency Rating (PER)
    function updatePointsPERChart(labels, pointsData, perData) {
        const pointsPERCtx = document.getElementById('points-per-chart').getContext('2d');
        pointsPERChart = new Chart(pointsPERCtx, {
            type: 'scatter',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Points vs. Overall EFF',
                    data: pointsData.map((points, index) => ({ x: points, y: perData[index] })),
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: true
                    },
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
});
