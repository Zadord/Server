function isSegmentsIntersect(a0, a1, b0, b1) {
    if ((a0 < b0) && (b0 < a1)) {
        return true;
    }
    if ((a0 < b1) && (b1 < a1)) {
        return true;
    }
    if ((a0 > b0) && (b1 > a0)) {
        return true;
    }
    if ((a1 > b0) && (b1 > a1)) {
        return true;
    }
    if ((a0 === b0) && (b1 === a1)) {
        return true;
    }
    return false;
}
export { isSegmentsIntersect as default };
