class ManagerAudioType {
    constructor() {
        this.kvSounds = {};
        this.strExtension = ManagerAudioType.getSupportedExtenstion();
    }
    static getSupportedExtenstion() {
        const avAudio = [["mp3", "audio/mpeg"]], //["mp3", "audio/mpeg"],["ogg", "audio/ogg"], ["wav", "audio/wav"]
        aAudio = new Audio(), anElems = avAudio.length;
        let astrResult, i;
        for (i = 0; i < anElems; ++i) {
            astrResult = aAudio.canPlayType(avAudio[i][1]);
            if ("probably" === astrResult) {
                return avAudio[i][0];
            }
        }
        for (i = 0; i < anElems; ++i) {
            astrResult = aAudio.canPlayType(avAudio[i][1]);
            if ("maybe" === astrResult) {
                return avAudio[i][0];
            }
        }
        return "";
    }
    play(astrName) {
        const aAudio = this.getAudioElement(astrName);
        aAudio.play();
    }
    getAudioElement(astrName) {
        if (this.kvSounds[astrName]) {
            const anElems = this.kvSounds[astrName].length;
            for (let i = 0; i < anElems; ++i) {
                if (this.kvSounds[astrName][i].ended) {
                    return this.kvSounds[astrName][i];
                }
            }
        }
        return this.createAudioElement(astrName);
    }
    createAudioElement(astrName) {
        const aAudio = new Audio("sounds/" + astrName + "." + this.strExtension);
        this.kvSounds[astrName] = this.kvSounds[astrName] || [];
        this.kvSounds[astrName].push(aAudio);
        return aAudio;
    }
    cache(acbDone, avstrNames) {
        let anCounter = avstrNames.length;
        avstrNames.forEach((astrName) => {
            const aAudio = new Audio("sounds/" + astrName + "." + this.strExtension);
            aAudio.addEventListener("canplaythrough", function () {
                if (0 >= --anCounter) {
                    if (acbDone) {
                        acbDone();
                    }
                }
            });
        });
    }
}
ManagerAudioType.changing = 1;
const ManagerAudio = new ManagerAudioType();
export { ManagerAudio as default };
