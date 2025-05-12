///<reference path ="./mytypes.d.ts"/>
function getSegmentsIntersection(a0, a1, b0, b1) {
    const i1 = Math.min(Math.max(a0, b0), a1), i2 = Math.max(Math.min(a1, b1), a0);
    return [i1, i2];
}
export { getSegmentsIntersection as default };
