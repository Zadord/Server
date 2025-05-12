/// <reference path="./mytypes.d.ts"/>
export { AnimationType as default };
// Partial => Optional
class AnimationType {
    constructor(aKvOptionsIn) {
        this.vFrames = [];
        const aKvDefaults = {
            nCurrentFrame: 0,
            nRate: 60,
            bloop: true
        };
        this.kvOptions = Object.assign(Object.assign({}, aKvDefaults), aKvOptionsIn);
        this.Image = new Image();
        this.Image.src = this.kvOptions.strURL;
    }
    appendFrame(x, y) {
        this.vFrames.push({ x, y });
    }
    getFrameCount() {
        return this.vFrames.length;
    }
    getInterval() {
        return this.kvOptions.nRate;
    }
    setCurrentFrameIndex(anIndex) {
        this.kvOptions.nCurrentFrame = anIndex;
    }
    getCurrentFrameIndex() {
        return this.kvOptions.nCurrentFrame;
    }
    isLoop() {
        return this.kvOptions.bloop;
    }
    draw(x, y, nWidth, nHeight, bFlipH) {
        const { kvOptions: { context: aContext, nCurrentFrame: anCurrentFrame } } = this, aFrame = this.vFrames[anCurrentFrame];
        if (bFlipH) {
            aContext.save();
            aContext.scale(-1, 1);
            aContext.translate(-nWidth + 1, 0);
            aContext.drawImage(this.Image, aFrame.x, aFrame.y, nWidth, nHeight, -x, y, nWidth, nHeight);
            aContext.restore();
        }
        else {
            aContext.drawImage(this.Image, aFrame.x, aFrame.y, nWidth, nHeight, x, y, nWidth, nHeight);
        }
    }
}
