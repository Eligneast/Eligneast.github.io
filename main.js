const selectElement = document.getElementById("deg_freedom");
const probability = document.getElementById('probability');
const calculateButton = document.getElementById('calculate-button');
const dataTextarea = document.getElementById('input_data');
const infDOF = document.getElementById('DF_inf');

var sStdErr;
var mean;

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

        document.getElementById("summation").textContent = sum;
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

// 获取查看公式按钮和侧边栏元素
const showFormulaButton = document.getElementById('show_fomula');
const formulaSidebar = document.getElementById('formula-sidebar');

// 添加点击事件监听器
showFormulaButton.addEventListener('click', (event) => {
    // 阻止事件冒泡
    event.stopPropagation();

    // 判断侧边栏的当前状态，如果是隐藏的，则显示它；否则，隐藏它
    const isVisible = formulaSidebar.classList.contains('show');
    if (isVisible) {
        showFormulaButton.classList.remove('show');
        formulaSidebar.classList.remove('show');
    } else {
        showFormulaButton.classList.add('show');
        formulaSidebar.classList.add('show');
    }
});

// 添加全局点击事件监听器
document.addEventListener('click', (event) => {
    // 如果用户点击了 formulaSidebar 以内的元素，则不隐藏它
    if (event.target.closest('#formula-sidebar')) {
        return;
    }

    // 隐藏 formulaSidebar
    showFormulaButton.classList.remove('show');
    formulaSidebar.classList.remove('show');
});