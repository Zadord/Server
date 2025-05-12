///<reference path ="./mytypes.d.ts"/>
function getSegmentsIntersection(a0: number, a1: number, b0: number, b1:number):Segment{
    const
        i1= Math.min(Math.max(a0,b0),a1),
        i2 = Math.max(Math.min(a1,b1),a0);
    return [i1,i2]
}
export {getSegmentsIntersection as default}