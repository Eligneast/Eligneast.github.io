const selectElement = document.getElementById("deg_freedom");
const probability = document.getElementById('probability');
const calculateButton = document.getElementById('calculate-button');
const dataTextarea = document.getElementById('input_data');
const infDOF = document.getElementById('DF_inf');

let sStdErr;
let mean;

function calculate() {
    const raw_data = dataTextarea.value.trim().split(/[,\s，]/);
    
    let n = 0;
    let sum = 0.0;
    let data = [];
    for (let datum of raw_data) {
        let value = parseFloat(datum);
        if (!isNaN(value)) {
            sum += value;
            n++;
            data.push(value);
        }
    }

    if (n > 0) {
        mean = sum / n;
        let squaredTotalDev = 0.0;
        let absTotalDev = 0.0;
        for (let datum of data) {
            squaredTotalDev += Math.pow(datum - mean, 2);
            absTotalDev += Math.abs(datum - mean);
        }
        let pVariance = squaredTotalDev / n;
        let sVariance = squaredTotalDev / (n - 1);
        let pStdDev = Math.sqrt(pVariance);
        let sStdDev = Math.sqrt(squaredTotalDev / (n - 1));
        let pStdErr = pStdDev / Math.sqrt(n);
        sStdErr = sStdDev / Math.sqrt(n);
        let absDev = absTotalDev / n;
        let absErr = absDev / Math.sqrt(n);

        document.getElementById("summation").textContent = sum.toFixed(7);
        document.getElementById("mean").textContent = mean;
        document.getElementById("sstddev").textContent = sStdDev;
        document.getElementById("sstderr").textContent = sStdErr;
        document.getElementById("absdev").textContent = absDev;
        document.getElementById("abserr").textContent = absErr;

        let std = match(mean, sStdErr);

        document.getElementById("mean1").textContent = "" + std[0];
        document.getElementById("s1").textContent = "" + (isNaN(std[1]) ? 0 : std[1]);
        document.getElementById("p1").textContent = "" + std[2];
    }

    uncertainty();
}

function uncertainty() {
    let tp;
    if (infDOF.checked) {
    tp = phiInv((1 + parseFloat(probability.value)) / 2);
    } else {
    tp = tInv((1 + parseFloat(probability.value)) / 2, n);
    }
    
    let exps = match(mean, tp * sStdErr);
    
    document.getElementById("mean2").textContent = "" + exps[0];
    document.getElementById("s2").textContent = "" + (isNaN(exps[1]) ? 0 : exps[1]);
    document.getElementById("p2").textContent = "" + exps[2];
}

const tableFormulas = document.getElementsByClassName('formula');
const tableValues = document.getElementsByClassName('value');

function toggleF() {
    for (var i = 0; i < tableValues.length; i++) {
        tableValues[i].style.display = 'none';
    }
    for (var i = 0; i < tableFormulas.length; i++) {
        tableFormulas[i].style.display = 'table-cell';
    }
}

function toggleV() {
    for (var i = 0; i < tableValues.length; i++) {
        tableValues[i].style.display = 'table-cell';
    }
    for (var i = 0; i < tableFormulas.length; i++) {
        tableFormulas[i].style.display = 'none';
    }
}
