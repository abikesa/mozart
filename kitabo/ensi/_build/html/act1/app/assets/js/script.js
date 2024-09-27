'use strict';

var scenarioVector = []; // Scenario vector from CSV
let betaCoefficients = [];
let s0 = [];
let timePoints = [];
let recognition;
let mortalityChart;
let lastCalculationTime = 0;
const CALCULATION_COOLDOWN = 1000; // 1 second cooldown

async function fetchCSV(url) {
    const response = await fetch(url);
    const text = await response.text();
    return text.split('\n').map(row => row.trim()).filter(row => row);
}

async function loadData() {
    try {
        // Load beta coefficients and variable names
        const betaData = await fetchCSV('../../data/beta_coefficients_58.csv');
        const [betaHeader, ...betaRows] = betaData;
        const variableNames = betaRows.map(row => row.split(',')[0]);  // Extract variable names
        betaCoefficients = betaRows.map(row => parseFloat(row.split(',')[1])); // Extract coefficients
        console.log('Beta Coefficients:', betaCoefficients);

        // Dynamically populate the UI with variable inputs
        populateVariableOptions(variableNames);

        // Load scenario vector
        const svData = await fetchCSV('../../data/SV_nondonor.csv');
        scenarioVector = svData[0].split(',').map(value => parseFloat(value)); // Initialize scenario vector
        console.log('Scenario Vector:', scenarioVector);

        // Load survival data
        const s0Data = await fetchCSV('../../data/s0_nondonor.csv');
        const s0Headers = s0Data[0].split(',');
        const timeIndex = s0Headers.indexOf('_t');
        const survivalIndex = s0Headers.indexOf('s0_nondonor');
        timePoints = [];
        s0 = [];
        s0Data.slice(1).forEach(row => {
            const rowData = row.split(',');
            timePoints.push(parseFloat(rowData[timeIndex]));
            s0.push(parseFloat(rowData[survivalIndex]));
        });
        console.log('Survival data loaded:', { timePoints, s0 });

        // Enable the calculate button after data is loaded
        document.getElementById('calculate-risk-button').disabled = false;
    } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please check the console for details.');
    }
}

function populateVariableOptions(variableNames) {
    const variableContainer = document.getElementById('variable-options');
    
    // Define all continuous variables
    const continuousVars = ['age_c', 'bpxsar_c', 'bpxdar_c', 'bmi_c', 'egfr_c', 'uacr_c', 'ghb_c'];

    variableNames.forEach((variable, index) => {
        if (continuousVars.includes(variable)) {
            // Create number input for continuous variables
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `var-${index}`;
            input.value = scenarioVector[index];  // Initialize with default scenarioVector value
            input.addEventListener('input', () => updateScenarioVector(index, parseFloat(input.value)));

            const label = document.createElement('label');
            label.htmlFor = `var-${index}`;
            label.textContent = variable;

            variableContainer.appendChild(label);
            variableContainer.appendChild(input);
            variableContainer.appendChild(document.createElement('br'));
        } else {
            // Create checkbox for binary variables
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `var-${index}`;
            checkbox.checked = !!scenarioVector[index];  // Initialize with default scenarioVector value
            checkbox.addEventListener('change', () => updateScenarioVector(index, checkbox.checked ? 1 : 0));

            const label = document.createElement('label');
            label.htmlFor = `var-${index}`;
            label.textContent = variable;

            variableContainer.appendChild(checkbox);
            variableContainer.appendChild(label);
            variableContainer.appendChild(document.createElement('br'));
        }
    });
}


function updateScenarioVector(index, value) {
    scenarioVector[index] = value;  // Update scenario vector with new value
    console.log('Updated Scenario Vector:', scenarioVector);
    throttledCalculateRisk();  // Recalculate risk after scenario update
}

function throttledCalculateRisk() {
    const now = Date.now();
    if (now - lastCalculationTime > CALCULATION_COOLDOWN) {
        lastCalculationTime = now;
        calculateMortalityRisk();
    }
}

function calculateMortalityRisk() {
    console.log('Calculating Mortality Risk...');

    // Log the beta coefficients and scenario vector for debugging
    console.log('Beta Coefficients:', betaCoefficients);
    console.log('Scenario Vector:', scenarioVector);

    if (betaCoefficients.length === 0 || s0.length === 0 || timePoints.length === 0) {
        alert('Data is not yet loaded. Please wait.');
        return;
    }

    // Ensure all undefined or non-numeric values in scenarioVector are treated as 0
    scenarioVector = scenarioVector.map(val => isNaN(val) ? 0 : val);
    console.log('Sanitized Scenario Vector:', scenarioVector);

    // Ensure the same for betaCoefficients
    betaCoefficients = betaCoefficients.map(val => isNaN(val) ? 0 : val);
    console.log('Sanitized Beta Coefficients:', betaCoefficients);

    // Check if all values in both arrays are valid before calculation
    const invalidScenarioValues = scenarioVector.filter(val => isNaN(val));
    const invalidBetaValues = betaCoefficients.filter(val => isNaN(val));

    if (invalidScenarioValues.length > 0 || invalidBetaValues.length > 0) {
        console.error('Invalid values found in scenarioVector or betaCoefficients:', { invalidScenarioValues, invalidBetaValues });
        return;
    }

    // Calculate log hazard ratio (logHR) as dot product of betaCoefficients and scenarioVector
    const logHR = betaCoefficients.reduce((acc, beta, index) => acc + (beta * scenarioVector[index]), 0);
    
    if (isNaN(logHR)) {
        console.error('Error: logHR is NaN. Check scenarioVector and betaCoefficients.');
        return;
    }

    console.log('Log Hazard Ratio:', logHR);

    // Calculate survival function and risk
    const f0 = s0.map(s => (1 - s) * 100);  // Convert survival probability to mortality risk
    const f1 = f0.map(f => f * Math.exp(logHR));  // Adjust risk based on scenario

    // Ensure timePoints and f1 are sorted
    const sortedData = timePoints.map((time, index) => ({ time, risk: f1[index] }))
        .sort((a, b) => a.time - b.time);  // Sort by time

    const sortedTimePoints = sortedData.map(item => item.time);
    const sortedF1 = sortedData.map(item => item.risk);

    console.log('Sorted Time Points:', sortedTimePoints);
    console.log('Sorted Adjusted Risk (f1):', sortedF1);

    if (sortedF1.length === 0) {
        console.error('No data for the graph');
        return;
    }

    // Define color schemes for the chart
    const ctx = document.getElementById('mortality-risk-graph').getContext('2d');
    if (!ctx) {
        console.error('Canvas for the graph not found.');
        return;
    }

    const color = 'rgba(106, 168, 79, 1)';  // Change color as needed

    if (!mortalityChart) {
        mortalityChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sortedTimePoints.map(t => t.toFixed(2)),
                datasets: [{
                    label: 'Mortality Risk',
                    data: sortedF1,
                    stepped: true,
                    borderColor: color,
                    backgroundColor: color.replace('1)', '0.2)'),
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Timepoints (years)'
                        },
                        ticks: {
                            autoSkip: true,
                            maxTicksLimit: 10  // Limit the number of ticks for clarity
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Mortality Risk (%)'
                        },
                        min: 0,
                        max: 100,
                        ticks: {
                            stepSize: 20
                        }
                    }
                },
                animation: {
                    duration: 0 // Disable animation for fast updates
                }
            }
        });
    } else {
        mortalityChart.data.labels = sortedTimePoints.map(t => t.toFixed(2));
        mortalityChart.data.datasets[0].data = sortedF1;
        mortalityChart.update();
    }

    // Handle displaying the textual results
    const resultElement = document.getElementById('mortality-risk-results');
    if (resultElement) {
        resultElement.innerText = sortedTimePoints.map((time, index) => `Risk at ${time.toFixed(2)} years: ${sortedF1[index].toFixed(2)}%`).join('\n');
    } else {
        console.warn('Element "mortality-risk-results" not found.');
    }
}



// Event listeners
window.addEventListener('load', function() {
    loadData();
});

document.getElementById("calculate-risk-button").addEventListener("click", function() {
    throttledCalculateRisk(); // Trigger calculation manually if needed
});
