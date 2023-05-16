function match(a, s) {
    let exp = 0;
    if (s === 0 || s === NaN) {
        return [a, s, 0];
    }
    while (s >= 10) {
        s /= 10;
        exp++;
    }
    while (s < 1) {
        s *= 10;
        exp--;
    }
    let tail = s - Math.floor(s);
    let app = 0;
    if (tail >= 0.1) {
        app = 1;
    }
    let rs = Math.floor(s) + app;
    if (rs === 10) {
        rs = 1;
        exp++;
    }
    if (a === 0) {
        return [a, rs, exp]
    }
    let eExp = 0;
    let out = Math.round(a * Math.pow(10, -exp));
    if (out === 0) {
        return [a, s, 0];
    }
    while (out >= 10) {
        out /= 10;
        eExp++;
    }
    while (out < 1) {
        out *= 10;
        eExp--;
    }
    let x = Math.abs(eExp);
    let pow = 1;
    while (x > 0.99) {
        pow *= 10;
        x -= 1;
    }
    let os = eExp < 0 ? rs * pow : rs / pow;
    return [out.toFixed(eExp), os, eExp + exp]
}
