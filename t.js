function tInv(p, deg_freedom) {
    if (p > 1 || p < 0) {
        return NaN;
    } else if (p < 0.5) {
        return -tInv(1 - p, deg_freedom);
    } else {
        let arr = Array.from(new Array(deg_freedom), () => new Array(deg_freedom).fill(0.0));
        let l = 0.0;
        let r = 1.0;
        while (t(r, deg_freedom, arr) < p) {
            l = r;
            r *= 2;
        }
        while (true) {
            let mid = l + (r - l) / 2;
            let tm = t(mid, deg_freedom, Array.from(new Array(deg_freedom), () => new Array(deg_freedom).fill(0.0)));
            if (Math.abs(tm - p) < 1e-11) {
                return mid;
            } else if (tm > p) {
                r = mid;
            } else {
                l = mid;
            }
        }
    }
}

function phiInv(p) {
    let b = [1.570796288, 0.03706987906, -0.8364353589e-3, -0.2250947176e-3,
        0.6841218299e-5, 0.5824238515e-5, -0.1045274970e-5, 0.8360937017e-7,
        -0.3231081277e-8, 0.3657763036e-10, 0.6936233982e-12];
    let y = -Math.log(4 * p * (1 - p));
    let sum = 0.0;
    for (let i = 0; i < 11; i++) {
        sum += b[i] * Math.pow(y, i);
    }
    return Math.sqrt(y * sum);
}

function t(t, n, arr) {
    let x = n / (n + t * t);
    if (t > 0) {
        return 1 - 0.5 * ix(x, n / 2.0, 0.5, arr);
    } else {
        return 0.5 * ix(x, n / 2.0, 0.5, arr);
    }
}

function ix(x, a, b, arr) {
    if ((a > b && b > 1) || (b > 0 && b <= 1 && a > 1)) {
        return ix(x, a - 1, b, arr) - 1 / (a - 1) * u(x, a - 1, b, arr);
    } else if ((b > a && a > 1) || (a > 0 && a <= 1 && b > 1)) {
        return ix(x, a, b - 1, arr) + 1 / (b - 1) * u(x, a, b - 1, arr);
    }
    if (a === 0.5 && b === 0.5) {
        let k = Math.sqrt((1 - x) / x);
        let d = 1 - 2 / Math.PI * Math.atan(k);
        return 1 - 2 / Math.PI * Math.atan(k);
    } else if (a === 0.5 && b === 1) {
        return Math.sqrt(x);
    } else if (a === 1 && b === 0.5) {
        return 1 - Math.sqrt(1 - x);
    } else if (a === 1 && b === 1) {
        return x;
    }
    return 0.0;
}

function u(x, a, b, arr) {
    return 1 / partOfBeta(a, b, arr) * Math.pow(x, a) * Math.pow(1 - x, b);
}

function partOfBeta(a, b, arr) {
    let a2 = a * 2 - 1;
    let b2 = b * 2 - 1;
    if (arr[a2][b2] === 0.0) {
        if (a > 1 && b > 1) {
            arr[a2][b2] = partOfBeta(a - 1, b - 1, arr) * (a - 1) * (b - 1) / ((a + b - 1) * (a + b - 2));
        } else if (a > 1 && b <= 1 && b > 0) {
            arr[a2][b2] = partOfBeta(a - 1, b, arr) * (a - 1) / (a + b - 1);
        } else if (a <= 1 && b > 1 && a > 0) {
            arr[a2][b2] = partOfBeta(a, b - 1, arr) * (b - 1) / (a + b - 1);
        }
        if (a === 0.5 && b === 0.5) {
            arr[a2][b2] = Math.PI;
        } else if ((a === 0.5 && b === 1.0) || (a === 1.0 && b === 0.5)) {
            arr[a2][b2] = 2;
        } else if (a === 1.0 && b === 1.0) {
            arr[a2][b2] = 1;
        }
    }
    return arr[a2][b2];
}

// 输入1+左尾*2