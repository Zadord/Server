import PlayerType from "./gameCanvas_Player.js";
import AnimationType from "./gameCanvas_Animation.js";
import { type MyPlayerOptions } from "./gameCanvas_Player.js";
import ManagerAudio from "./gameCanvas_ManagerAudio.js"
export { BackgroundType as default };

type MyBackgroundOptions = MyPlayerOptions & {
    context: CanvasRenderingContext2D,
    strURL: string,
    nWorldWidth: number
};

class BackgroundType extends PlayerType {
    // Does not emit JavaScript code,
    // only ensures the types are correct
    declare kvOptions: MyBackgroundOptions;

    constructor(
        akvOptionsIn: OnlyRequired<MyBackgroundOptions, "strURL" | "context">
    ) {
        const akvDefaults: Partial<MyBackgroundOptions> = {
            nWorldWidth: 1
        };
        const akvOptions = { ...akvDefaults, ...akvOptionsIn };
        ManagerAudio.play("gamestart")

        super(akvOptions);

        if (!this.kvOptions.context) {
            throw "Missing context";
        }

        const { strURL, context: aContext } = this.kvOptions;
        const aAnimBackground = new AnimationType({
            strURL: strURL,
            context: aContext
        });

        aAnimBackground.appendFrame(0, 0);

        this.setAnimation(aAnimBackground);
    }

    draw(adWorldOffsetX: number) {
        const adWorldXL = adWorldOffsetX,
            adWorldXR = adWorldXL + this.kvOptions.nWorldWidth-1,
            anWidth = this.getWidth(),
            anStart = Math.floor(adWorldXL / anWidth),
            anEnd = Math.floor(adWorldXR / anWidth);

        for (let n = anStart; n < anEnd; ++n) {
            this.setX(anWidth * n);
            super.draw(adWorldOffsetX);
        }
    }
}
