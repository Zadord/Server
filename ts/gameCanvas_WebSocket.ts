type MyOnReceivedXY = (x: number, y: number) => void;
type MyOnReceivedPlayerState = (anPlayerState: number) => void;

class WebSocketType {
    bOnline: boolean = false;
    bControlUser: boolean = false;
    sentX?: number;
    sentY?: number;
    onReceivedXY?: MyOnReceivedXY;
    onReceivedPlayerState?: MyOnReceivedPlayerState;
    WebSocket: WebSocket;

    constructor() {
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
    async onMessage(event: MessageEvent) {
        let astrData;
        if (typeof event.data === "string") {
            astrData = event.data;
        } else if (event.data instanceof Blob) {
            let blob = event.data;
            astrData = await blob.text();
        } else {
            return;
        }
    
        let akvData;
        try {
            akvData = JSON.parse(astrData);
        } catch (e) {
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
    }

    attachOnReceivedXY(onReceivedXY: MyOnReceivedXY) {
        this.onReceivedXY = onReceivedXY;
    }
    
    attachOnReceivedPlayerState(onReceivedPlayerState: MyOnReceivedPlayerState) {
        this.onReceivedPlayerState = onReceivedPlayerState;
    }
    
    isConnected() {
        return this.bOnline;
    }
    
    canControlUser() {
        return this.bControlUser;
    }
    
    sendXY(x: number, y: number) {
        if (this.isConnected() && this.canControlUser()) {
            // If not sent or any change from previous
            if (
                ("number" !== typeof this.sentX) || 
                ("number" !== typeof this.sentY) || 
                (1e-5 < Math.abs(x - this.sentX)) || 
                (1e-5 < Math.abs(y - this.sentY))
            ) {
                const akvData = {
                    id: 2,
                    x,
                    y
                };
                this.WebSocket.send(JSON.stringify(akvData))
                this.sentX = x
                this.sentY = y
            }
        }
    } 
    sendPlayerState(anPlayerState: number) {
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

export { WebSocketPlayerUser as default }