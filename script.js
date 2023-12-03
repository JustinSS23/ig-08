document.addEventListener('DOMContentLoaded', function () {
    let barChart, scatterChart, perHistogram; // Declare chart variables

    // Function to load data based on the selected season
    function loadData(csvFile) {
        fetch(csvFile)
            .then(response => response.text())
            .then(data => {
                const playerData = data.split('\n').slice(1).map(entry => entry.trim());

                const playerNames = playerData.map(entry => entry.split(',')[0]);
                const playerPoints = playerData.map(entry => parseFloat(entry.split(',')[1]));
                const playerEFF = playerData.map(entry => parseFloat(entry.split(',')[3]));
                const playerPER = playerData.map(entry => parseFloat(entry.split(',')[4])).filter(val => !isNaN(val)); // Filter out invalid PER values

                // Clear existing charts
                clearCharts();

                // Call functions to update charts based on loaded data
                updateBarChart(playerNames, playerPoints);
                updateScatterChart(playerNames, playerEFF);
                updatePerHistogram(playerNames, playerPER);
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
        if (barChart) {
            barChart.destroy();
        }
        if (scatterChart) {
            scatterChart.destroy();
        }
        if (perHistogram) {
            perHistogram.destroy();
        }
    }

    // Function to update Bar Chart
    function updateBarChart(labels, data) {
        const barCtx = document.getElementById('barChart').getContext('2d');
        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Overall Points',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Function to update Scatter Chart
    function updateScatterChart(labels, data) {
        const scatterCtx = document.getElementById('scatterChart').getContext('2d');
        scatterChart = new Chart(scatterCtx, {
            type: 'scatter',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Overall Efficiency',
                    data: data.map((efficiency, index) => ({ x: index, y: efficiency })),
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

    // Function to update Player Efficiency Rating (PER) Histogram
    function updatePerHistogram(labels, data) {
        const perHistogramCtx = document.getElementById('perHistogram').getContext('2d');
        perHistogram = new Chart(perHistogramCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Player Efficiency Rating (PER)',
                    data: data,
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }
            }
        });
    }
});
