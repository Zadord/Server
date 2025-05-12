import PlayerType from "./gameCanvas_Player.js";
import AnimationType from "./gameCanvas_Animation.js";
import PlayerUserType from "./gameCanvas_PlayerUser.js";
import BackgroundType from "./gameCanvas_Background.js";
import TilesType from "./gameCanvas_Tiles.js";
document.addEventListener("DOMContentLoaded", onReady);
function onReady() {
    const aBoard = document.getElementById("idGame");
    if (!aBoard) {
        return;
    }
    const aCanvas = document.createElement("canvas");
    aCanvas.setAttribute("id", "idCanvas");
    aCanvas.style.display = "none";
    aCanvas.width = 1300;
    aCanvas.height = 1150;
    aBoard.appendChild(aCanvas);
    const aContext = aCanvas.getContext("2d");
    if (!aContext) {
        return;
    }
    const aBackground = new BackgroundType({ nWorldWidth: 1920,
        nWidth: 1920, nHeight: 1150,
        strURL: "images/41524.jpg",
        context: aContext }), aBackground2 = new BackgroundType({
        nWorldWidth: 1920,
        y: 160,
        nWidth: 1024, nHeight: 1024,
        strURL: "images/game_backwood.png",
        context: aContext
    }), aPlayer = new PlayerUserType({ context: aContext }), aEnemy = new PlayerType({
        x: 310,
        y: 310,
        nWidth: 114,
        nHeight: 114,
        bFlipH: true,
    }), aAnimStandEnemy = new AnimationType({
        strURL: "images/Ldle_E.png",
        context: aContext,
        nRate: 250,
    });
    aAnimStandEnemy.appendFrame(0, 30);
    aAnimStandEnemy.appendFrame(128, 30);
    aAnimStandEnemy.appendFrame(256, 30);
    aAnimStandEnemy.appendFrame(384, 30);
    aAnimStandEnemy.appendFrame(512, 30);
    aAnimStandEnemy.appendFrame(640, 30);
    aEnemy.setAnimation(aAnimStandEnemy);
    const aMapTiles_Level0 = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 2, 2, 2, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 3, 3, 3, 3, 3, 3, 3, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
    const aAnimTile0 = new AnimationType({
        strURL: "images/tiles.png",
        context: aContext
    });
    const aAnimTile1 = new AnimationType({
        strURL: "images/tiles.png",
        context: aContext
    });
    const aAnimTile2 = new AnimationType({
        strURL: "images/game_background2.png",
        context: aContext
    });
    aAnimTile0.appendFrame(20, 400);
    aAnimTile1.appendFrame(20, 0);
    aAnimTile2.appendFrame(350, 0);
    const aTiles = new TilesType({
        nTileWidth: 200,
        nTileHeight: 200,
        vvMapTiles: aMapTiles_Level0,
        vAnimations: [aAnimTile0, aAnimTile1, aAnimTile2],
        context: aContext
    });
    function gameLoop(adTimestamp) {
        let adElapsedTime = (adTimestamp - adTime) * 0.001;
        aPlayer.update(adElapsedTime, aTiles);
        const x = aPlayer.getX();
        let adOffsetX = 0.0;
        if (200 < x) {
            adOffsetX = x - 200;
        }
        aBackground.draw(adOffsetX * 0.33);
        aBackground2.draw(adOffsetX * 0.66);
        aTiles.draw(adOffsetX);
        aEnemy.draw(adOffsetX);
        aPlayer.draw(adOffsetX);
        adTime = adTimestamp;
        requestAnimationFrame(gameLoop);
    }
    aCanvas.style.display = "block";
    let adTime = performance.now();
    requestAnimationFrame(gameLoop);
}
