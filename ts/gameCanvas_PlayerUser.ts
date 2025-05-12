/// <reference path="./mytypes.d.ts"/>
import PlayerType from "./gameCanvas_Player.js";
import AnimationType from "./gameCanvas_Animation.js";
import Keyboard from "./gameCanvas_Keyboard.js";
import isSegmentsIntersect from "./isSegmentsIntersect.js"
import areBoundingBoxesIntersect from "./areBoundingBoxesIntersect.js"
import getSegmentsIntersection from "./getSegmentsIntersection.js"
import type TilesType from "./gameCanvas_Tiles.js"
import type { MyPlayerOptions} from "./gameCanvas_Player.js"
import ManagerAudio from "./gameCanvas_ManagerAudio.js";
import WebSocketPlayerUser from "./gameCanvas_WebSocket.js";
export{PlayerUserType as default}

type MyPlayerUserOptions = MyPlayerOptions & {
    context: CanvasRenderingContext2D
};
const STAND = Symbol("stand"),
    WALK_LEFT = Symbol("walk left"),
    WALK_RIGHT = Symbol("walk right"),
    HIGH_KICK = Symbol("high kick"),
    JUMP = Symbol("jump"),
    UNDEFINED = Symbol("undefined"),
    vIndex2Symbol: symbol[] = [STAND,WALK_LEFT,WALK_RIGHT,HIGH_KICK,JUMP];
class PlayerUserType extends PlayerType
{
    static jumpaudio = 0;
    static kickaudio = 0;
    declare kvOptions: MyPlayerUserOptions;
    ePlayerState: symbol = UNDEFINED;
    dWalkSpeed: number = 200.0;
    dJumpSpeed: number=  340.0
    dAccelY: number = 220.0
    dSpeedX: number = 0
    dSpeedY: number = 0
    kvPlayerStateToAnim: {
        [key: symbol]: AnimationType
    };

    constructor(akvOptionsIn: OnlyRequired<MyPlayerUserOptions,"context">){
        const akvDefaults: OnlyOptional<MyPlayerUserOptions,"context">={
            x: 280,
            y: 500,
            nWidth: 114,
            nHeight: 114,
            bFlipH: false
        },akvOptions = {...akvDefaults,...akvOptionsIn};
        super(akvOptions);
        if(!this.kvOptions.context){
            throw "Missing context"
        }
        const aAnimStand = new AnimationType({
            strURL: "images/Ldle.png",
            context: this.kvOptions.context,
            nRate:100,
        }),aAnimWalk = new AnimationType({
            strURL: "images/Run.png",
            context: this.kvOptions.context,
            nRate: 100,
        }), aAnimHighKick = new AnimationType({
            strURL: "images/Attack_1.png",
            context: this.kvOptions.context,
            nRate: 350,
        }), aAnimJump = new AnimationType({
            strURL:"images/Run.png",
            context: this.kvOptions.context,
            nRate:350,
            bloop:false
        })
        
        aAnimStand.appendFrame(15, 30);
       /*
        aAnimStand.appendFrame(143,30);
        aAnimStand.appendFrame(271,30);
        aAnimStand.appendFrame(399, 30);
        aAnimStand.appendFrame(527, 30);
        */
        aAnimStand.appendFrame(128, 30);

        aAnimWalk.appendFrame(0, 30);
        /*
        aAnimWalk.appendFrame(128,30);
        aAnimWalk.appendFrame(256,30);
        aAnimWalk.appendFrame(384, 30);
        aAnimWalk.appendFrame(512, 30);
        aAnimWalk.appendFrame(640, 30);
        aAnimWalk.appendFrame(768, 30);
        */
        aAnimWalk.appendFrame(896, 30);
    
        aAnimHighKick.appendFrame(100, 30);
        /*
        aAnimHighKick.appendFrame(128, 30);
        aAnimHighKick.appendFrame(256, 30);
        aAnimHighKick.appendFrame(430, 30);
        */
        aAnimHighKick.appendFrame(550, 30);

        aAnimJump.appendFrame(15, 30);
        /*
         aAnimStand.appendFrame(143,30);
         aAnimStand.appendFrame(271,30);
         aAnimStand.appendFrame(399, 30);
         aAnimStand.appendFrame(527, 30);
         */
         aAnimJump.appendFrame(655, 30);
      
        this.kvPlayerStateToAnim={
        [STAND]: aAnimStand,
        [WALK_LEFT]: aAnimWalk,
        [WALK_RIGHT]: aAnimWalk,
        [HIGH_KICK]: aAnimHighKick,
        [JUMP]:aAnimJump
        }
        WebSocketPlayerUser.attachOnReceivedXY(this.onReceivedXY.bind(this))
        WebSocketPlayerUser.attachOnReceivedPlayerState(this.onReceivedPlayerState.bind(this))

    }
    
    update(adElapsedTime: number,aTiles: TilesType){
        
        if(WebSocketPlayerUser.isConnected()&&(!WebSocketPlayerUser.canControlUser())){
            return;
        }
        let aePlayerState: symbol = STAND;
        this.dSpeedX = 0
        if(Keyboard.isJump() && PlayerUserType.jumpaudio == 0){PlayerUserType.jumpaudio = 1; ManagerAudio.play("footstepsed")}
        else if(!Keyboard.isJump() && PlayerUserType.jumpaudio == 1){PlayerUserType.jumpaudio = 0}
        if(Keyboard.isKick() && PlayerUserType.kickaudio == 0){PlayerUserType.kickaudio = 1; ManagerAudio.play("punch-kick")}
        else if(!Keyboard.isKick() && PlayerUserType.kickaudio == 1){PlayerUserType.kickaudio = 0}
        if(Keyboard.isJump()){
            aePlayerState = JUMP
        }
        else if (Keyboard.isLeft()) {
            aePlayerState = WALK_LEFT
        } else if (Keyboard.isRight()) {
            aePlayerState = WALK_RIGHT
        } else if (Keyboard.isKick()) {
            aePlayerState = HIGH_KICK
        }
    
        if (aePlayerState !== this.ePlayerState) {
            // Update the player's state
            this.ePlayerState = aePlayerState;
    
            // Change animation based on the new state
            this.setAnimation(this.kvPlayerStateToAnim[aePlayerState]);
            this.sendPlayerState()
            // Handle flipping for directional states
            switch (aePlayerState) {
                case WALK_LEFT:
                    this.setFlipH(true);
                    break;
                case WALK_RIGHT:
                    this.setFlipH(false);
                    break;
                case JUMP:
                    if(0 === this.dSpeedY){
                    this.dSpeedY = -this.dJumpSpeed
                    }
                    break;
                default:
                    break;
            }
        } else {
            // Continue the current animation and update the player's position
            switch (aePlayerState) {
                case WALK_LEFT:
                this.dSpeedX =-this.dWalkSpeed
                break;
                case WALK_RIGHT:
                this.dSpeedX = this.dWalkSpeed
                break;
                case JUMP:
                    if(0 === this.dSpeedY){
                    this.dSpeedY = -this.dJumpSpeed
                    }
                    break;
                default:
                    break;
            }
        }
        const adOrigY = this.getY(), adOrigX = this.getX();
        this.dSpeedY = Math.min(450, Math.max(-450, this.dSpeedY + this.dAccelY * adElapsedTime));

        let adX_new = adOrigX + this.dSpeedX * adElapsedTime,
            adY_new = adOrigY + this.dSpeedY * adElapsedTime;

        let akvBoundingBox: BoundingBox = this.getBoundingBox(),
            akvBoundingBox_new: BoundingBox = {
                xLeft: adX_new,
                xRight: adX_new + this.getWidth(),
                yTop: adY_new,
                yBottom: adY_new + this.getHeight()
            };

        const avTilesColliding = aTiles.getCollidingTiles(akvBoundingBox_new),
            anTiles = avTilesColliding.length;

        if (0 >= anTiles) {
            this.setXY(adX_new,adY_new)
            return;
        }

        const adDeltaX = adX_new - adOrigX, adDeltaY = adY_new - adOrigY;
        let aTile: PlayerType;
        if (0 < Math.abs(adDeltaY)) {
            for (let i = 0; i < anTiles; ++i) {
                aTile = avTilesColliding[i];
                const akvBoundingBox_Tile: BoundingBox = aTile.getBoundingBox();
        
                // Nie przecinał w kierunku Y i będzie przecinał
                if (!areBoundingBoxesIntersect(akvBoundingBox_new, akvBoundingBox_Tile))
                    continue;
        
                // Poprzednia pozycja OY
                if (!isSegmentsIntersect(
                    akvBoundingBox_Tile.yTop, akvBoundingBox_Tile.yBottom,
                    akvBoundingBox.yTop, akvBoundingBox.yBottom
                ))
                    continue;
        
                const avSegmentY = getSegmentsIntersection(
                    akvBoundingBox_Tile.yTop, akvBoundingBox_Tile.yBottom,
                    akvBoundingBox_new.yTop, akvBoundingBox_new.yBottom
                );
        
                let adCorrY: number;
        
                // Którym końcem jest kontakt z kafelkiem?
                if (Math.abs(avSegmentY[0] - adY_new) < 0.1) {
                    adCorrY = avSegmentY[1] - avSegmentY[0]; // przesuw w dół
                } else {
                    adCorrY = avSegmentY[0] - avSegmentY[1]; // przesuw w górę
                }
        
                adY_new += adCorrY;
                akvBoundingBox_new.yTop += adCorrY;
                akvBoundingBox_new.yBottom += adCorrY;
                this.dSpeedY = 0;
                break;
            }
        }
        if (0 < Math.abs(adDeltaX)) {
            for (let i = 0; i < anTiles; ++i) {
                aTile = avTilesColliding[i];
                const akvBoundingBox_Tile: BoundingBox = aTile.getBoundingBox();
        
                // Nie przecina w kierunku X i będzie przecinać
                if (!areBoundingBoxesIntersect(akvBoundingBox_new, akvBoundingBox_Tile)) {
                    continue;
                }
        
                // Poprzednia pozycja OX
                if (isSegmentsIntersect(
                    akvBoundingBox_Tile.xLeft, akvBoundingBox_Tile.xRight,
                    akvBoundingBox.xLeft, akvBoundingBox.xRight
                )) {
                    continue;
                }
        
                const avSegmentX: Segment = getSegmentsIntersection(
                    akvBoundingBox_Tile.xLeft, akvBoundingBox_Tile.xRight,
                    akvBoundingBox_new.xLeft, akvBoundingBox_new.xRight
                );
        
                let adCorrX: number;
        
                // Którym końcem jest kontakt z kafelkiem?
                if (Math.abs(avSegmentX[0] - adX_new) < 0.1) { 
                    adCorrX = avSegmentX[1] - avSegmentX[0]; // Przesuń w prawo
                } else {
                    adCorrX = avSegmentX[0] - avSegmentX[1]; // Przesuń w lewo
                }
        
                adX_new += adCorrX;
        
                this.dSpeedX = 0;
                break;
            }
        
        
        }
        this.setXY(adX_new,adY_new)

    }
    setXY(x: number,y: number){
        super.setXY(x,y)
        WebSocketPlayerUser.sendXY(x,y)
    }
    sendPlayerState(){
        WebSocketPlayerUser.sendPlayerState(vIndex2Symbol.indexOf(this.ePlayerState))
    }
    onReceivedXY(x: number, y:number){
        if(WebSocketPlayerUser.canControlUser()){
            return
        }
        super.setXY(x,y)
    }
    onReceivedPlayerState(anPlayerState: number){
        if(WebSocketPlayerUser.canControlUser()){
            return
        }
        const aePlayerState: symbol = vIndex2Symbol[anPlayerState]
        this.ePlayerState = aePlayerState
        this.setAnimation(this.kvPlayerStateToAnim[aePlayerState])
        switch(aePlayerState){
            case WALK_LEFT:
                this.setFlipH(true)
                break
            case WALK_RIGHT:
                this.setFlipH(false)
                break
            default:
                break
        }
    }
}
