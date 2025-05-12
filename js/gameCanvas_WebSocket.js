var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class WebSocketType {
    constructor() {
        this.bOnline = false;
        this.bControlUser = false;
        const aWebSocket = new WebSocket("ws://127.0.0.1:8080");
        this.WebSocket = aWebSocket;
        aWebSocket.onopen = () => this.onOpen();
        aWebSocket.onclose = () => this.onClose();
        aWebSocket.onmessage = (e) => this.onMessage(e);
    }
    onOpen() {
        console.log("Connection established");
        this.bOnline = true;
    }
    onClose() {
        this.bOnline = false;
        this.bControlUser = false;
        this.sentX = (void 0);
        this.sentY = (void 0);
    }
    onMessage(event) {
        return __awaiter(this, void 0, void 0, function* () {
            let astrData;
            if (typeof event.data === "string") {
                astrData = event.data;
            }
            else if (event.data instanceof Blob) {
                let blob = event.data;
                astrData = yield blob.text();
            }
            else {
                return;
            }
            let akvData;
            try {
                akvData = JSON.parse(astrData);
            }
            catch (e) {
                console.log(e);
            }
            if (!akvData) {
                return;
            }
            switch (akvData.id) {
                case 1:
                    this.bControlUser = true;
                    break;
                case 2:
                    if (this.onReceivedXY) {
                        this.onReceivedXY(akvData.x, akvData.y);
                    }
                    break;
                case 3:
                    if (this.onReceivedPlayerState) {
                        this.onReceivedPlayerState(akvData.PlayerState);
                    }
                    break;
                default:
                    break;
            }
        });
    }
    attachOnReceivedXY(onReceivedXY) {
        this.onReceivedXY = onReceivedXY;
    }
    attachOnReceivedPlayerState(onReceivedPlayerState) {
        this.onReceivedPlayerState = onReceivedPlayerState;
    }
    isConnected() {
        return this.bOnline;
    }
    canControlUser() {
        return this.bControlUser;
    }
    sendXY(x, y) {
        if (this.isConnected() && this.canControlUser()) {
            // If not sent or any change from previous
            if (("number" !== typeof this.sentX) ||
                ("number" !== typeof this.sentY) ||
                (1e-5 < Math.abs(x - this.sentX)) ||
                (1e-5 < Math.abs(y - this.sentY))) {
                const akvData = {
                    id: 2,
                    x,
                    y
                };
                this.WebSocket.send(JSON.stringify(akvData));
                this.sentX = x;
                this.sentY = y;
            }
        }
    }
    sendPlayerState(anPlayerState) {
        if (this.isConnected() && this.canControlUser()) {
            const akvData = {
                id: 3,
                PlayerState: anPlayerState
            };
            this.WebSocket.send(JSON.stringify(akvData));
        }
    }
}
const WebSocketPlayerUser = new WebSocketType();
export { WebSocketPlayerUser as default };
