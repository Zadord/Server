function isSegmentsIntersect(a0: number,a1: number, b0: number, b1:number):boolean{
    if((a0<b0)&&(b0<a1)){
        return true
    }
    if((a0<b1)&&(b1<a1)){
        return true
    }
    if((a0>b0)&&(b1>a0)){
        return true
    }
    if((a1>b0)&&(b1>a1)){
        return true
    }
    if((a0===b0)&&(b1===a1)){
        return true
    }
    return false
}
export {isSegmentsIntersect as default}