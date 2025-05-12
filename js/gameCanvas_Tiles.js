///<reference path="./mytypes.d.ts"/>
import PlayerType from "./gameCanvas_Player.js";
import areBoundingBoxesIntersect from "./areBoundingBoxesIntersect.js";
import getSegmentsIntersection from "./getSegmentsIntersection.js";
export { TilesType as default };
class TilesType {
    constructor(akvOptionsIn) {
        this.kvBoundingBox = { xLeft: 0, xRight: 0, yTop: 0, yBottom: 0 };
        this.nNumTilesWidth = 0;
        this.nNumTilesHeight = 0;
        const akvDefaults = {};
        this.kvOptions = Object.assign(Object.assign({}, akvDefaults), akvOptionsIn);
        if (!this.kvOptions.context) {
            throw "Missing context";
        }
        this.vvTiles = [];
        const aMapTiles = this.kvOptions.vvMapTiles;
        if (Array.isArray(aMapTiles)) {
            const { vAnimations: avAnimations, nTileWidth: anTileWidth, nTileHeight: anTileHeight } = this.kvOptions;
            let anRow, anCol, anRows, anCols, avLine, aTile, anTileIndex;
            for (anRow = 0, anRows = aMapTiles.length; anRow < anRows; ++anRow) {
                avLine = aMapTiles[anRow];
                for (anCol = 0, anCols = avLine.length; anCol < anCols; ++anCol) {
                    anTileIndex = avLine[anCol];
                    if (0 < anTileIndex) {
                        aTile = new PlayerType({
                            x: anCol * anTileWidth,
                            y: anRow * anTileHeight,
                            nWidth: anTileWidth,
                            nHeight: anTileHeight
                        });
                        aTile.setAnimation(avAnimations[anTileIndex - 1]);
                        this.vvTiles[anRow] = this.vvTiles[anRow] || [];
                        this.vvTiles[anRow][anCol] = aTile;
                        this.kvBoundingBox.xRight = Math.max(this.kvBoundingBox.xRight, aTile.getX() + anTileWidth);
                        this.kvBoundingBox.yBottom = Math.max(this.kvBoundingBox.yBottom, aTile.getY() + anTileHeight);
                    }
                }
                this.nNumTilesWidth = Math.max(this.nNumTilesWidth, anCols);
            }
            this.nNumTilesHeight = anRows;
        }
    }
    draw(adOffsetX) {
        this.vvTiles.forEach(avLine => avLine.forEach(aTile => aTile.draw(adOffsetX)));
    }
    getCollidingTiles(akvBoundingBox) {
        if (!areBoundingBoxesIntersect(akvBoundingBox, this.kvBoundingBox)) {
            return [];
        }
        const avSegmentX = getSegmentsIntersection(akvBoundingBox.xLeft, akvBoundingBox.xRight, this.kvBoundingBox.xLeft, this.kvBoundingBox.xRight);
        const avSegmentY = getSegmentsIntersection(akvBoundingBox.yTop, akvBoundingBox.yBottom, this.kvBoundingBox.yTop, this.kvBoundingBox.yBottom);
        const anTileWidth = this.kvOptions.nTileWidth, anTileHeight = this.kvOptions.nTileHeight, anNumTilesWidth = this.nNumTilesWidth, anNumTilesHeight = this.nNumTilesHeight;
        const akvIndexes = {
            ix0: Math.floor((avSegmentX[0] - this.kvBoundingBox.xLeft) / anTileWidth),
            ix1: Math.ceil((avSegmentX[1] - this.kvBoundingBox.xLeft) / anTileWidth),
            iy0: Math.floor((avSegmentY[0] - this.kvBoundingBox.yTop) / anTileHeight),
            iy1: Math.ceil((avSegmentY[1] - this.kvBoundingBox.yTop) / anTileHeight)
        };
        akvIndexes.ix0 = Math.max(0, Math.min(akvIndexes.ix0, anNumTilesWidth - 1));
        akvIndexes.ix1 = Math.max(0, Math.min(akvIndexes.ix1, anNumTilesWidth - 1));
        akvIndexes.iy0 = Math.max(0, Math.min(akvIndexes.iy0, anNumTilesHeight - 1));
        akvIndexes.iy1 = Math.max(0, Math.min(akvIndexes.iy1, anNumTilesHeight - 1));
        const avTilesColliding = [];
        const aMapTiles = this.kvOptions.vvMapTiles;
        if (Array.isArray(aMapTiles)) {
            let anRow, anCol, aTile;
            for (anRow = akvIndexes.iy0; anRow <= akvIndexes.iy1; ++anRow) {
                for (anCol = akvIndexes.ix0; anCol <= akvIndexes.ix1; ++anCol) {
                    if (0 < aMapTiles[anRow][anCol]) {
                        aTile = this.vvTiles[anRow][anCol];
                        if (aTile) {
                            avTilesColliding.push(aTile);
                        }
                    }
                }
            }
        }
        return avTilesColliding;
    }
}
