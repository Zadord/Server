export { PlayerType as default };
class PlayerType {
    constructor(aKvOptionsIn) {
        const aKvDefaults = {
            x: 0,
            y: 0,
            nWidth: 0,
            nHeight: 0,
            bFlipH: false
        };
        this.kvOptions = Object.assign(Object.assign({}, aKvDefaults), aKvOptionsIn);
    }
    setAnimation(aAnimation) {
        if (this.hAnimation) {
            clearInterval(this.hAnimation);
            this.hAnimation = (void 0);
        }
        this.AnimationCurrent = aAnimation;
        const anNumFrames = aAnimation.getFrameCount();
        aAnimation.setCurrentFrameIndex(0);
        if (1 < anNumFrames) {
            this.hAnimation = setInterval(() => {
                let anCurrentFrameIndex = aAnimation.getCurrentFrameIndex() + 1;
                if ((!aAnimation.isLoop()) && (anCurrentFrameIndex >= anNumFrames)) {
                    clearInterval(this.hAnimation);
                    this.hAnimation = (void 0);
                }
                else {
                    aAnimation.setCurrentFrameIndex(anCurrentFrameIndex % anNumFrames);
                }
            }, aAnimation.getInterval());
        }
    }
    draw(adOffsetX) {
        if (!this.AnimationCurrent) {
            return;
        }
        const { x, y, nWidth, nHeight, bFlipH } = this.kvOptions;
        this.AnimationCurrent.draw(x - adOffsetX, y, nWidth, nHeight, bFlipH);
    }
    setFlipH(abFlip) {
        this.kvOptions.bFlipH = abFlip;
    }
    setX(x) {
        this.kvOptions.x = x;
    }
    setY(y) {
        this.kvOptions.y = y;
    }
    getX() {
        return this.kvOptions.x;
    }
    getY() {
        return this.kvOptions.y;
    }
    getWidth() {
        return this.kvOptions.nWidth;
    }
    getHeight() {
        return this.kvOptions.nHeight;
    }
    getBoundingBox() {
        return {
            xLeft: this.kvOptions.x,
            xRight: this.kvOptions.x + this.kvOptions.nWidth,
            yTop: this.kvOptions.y,
            yBottom: this.kvOptions.y + this.kvOptions.nHeight
        };
    }
    setXY(x, y) {
        this.kvOptions.x = x;
        this.kvOptions.y = y;
    }
}
