/// <reference path="./mytypes.d.ts"/>
import AnimationType from "./gameCanvas_Animation.js";
export { PlayerType as default }

export type MyPlayerOptions = {
    x: number,
    y: number,
    nWidth: number,
    nHeight: number,
    bFlipH: boolean
}

class PlayerType {
    kvOptions: MyPlayerOptions;
    hAnimation?: number;
    AnimationCurrent?: AnimationType;

    constructor(aKvOptionsIn?: Partial<MyPlayerOptions>) {
        const aKvDefaults: MyPlayerOptions = {
            x: 0,
            y: 0,
            nWidth: 0,
            nHeight: 0,
            bFlipH: false
        };
        this.kvOptions = { ...aKvDefaults, ...aKvOptionsIn };
    }

    setAnimation(aAnimation: AnimationType) {
        if (this.hAnimation) {
            clearInterval(this.hAnimation);
            this.hAnimation = (void 0);
        }
        this.AnimationCurrent = aAnimation;

        const anNumFrames = aAnimation.getFrameCount();
        aAnimation.setCurrentFrameIndex(0)
        if (1 < anNumFrames) {
            this.hAnimation = setInterval(() => {
                let anCurrentFrameIndex = aAnimation.getCurrentFrameIndex()+1;
                if((!aAnimation.isLoop()) && (anCurrentFrameIndex >= anNumFrames)){
                    clearInterval(this.hAnimation)
                    this.hAnimation = (void 0)
                }else{
                    aAnimation.setCurrentFrameIndex(anCurrentFrameIndex % anNumFrames)
                }
            }, aAnimation.getInterval());
        }
    }

    draw(adOffsetX:number) {
        if (!this.AnimationCurrent) {
            return
        }
        const { x, y, nWidth, nHeight, bFlipH } = this.kvOptions;
        this.AnimationCurrent.draw(x - adOffsetX, y, nWidth, nHeight, bFlipH);
    }
    setFlipH(abFlip: boolean){
        this.kvOptions.bFlipH = abFlip
    }
    setX(x: number){
        this.kvOptions.x =x
    }
    setY(y: number){
        this.kvOptions.y = y
    }
    getX(): number{
        return this.kvOptions.x
    }
    getY(): number{
        return this.kvOptions.y
    }
    getWidth(): number{
        return this.kvOptions.nWidth
    }
    getHeight(): number{
        return this.kvOptions.nHeight
    }
    getBoundingBox():BoundingBox{
        return {
            xLeft:this.kvOptions.x,
            xRight:this.kvOptions.x + this.kvOptions.nWidth,
            yTop:this.kvOptions.y,
            yBottom:this.kvOptions.y + this.kvOptions.nHeight
        }
    }
    setXY(x:number, y:number){
        this.kvOptions.x = x
        this.kvOptions.y = y
    }
}
