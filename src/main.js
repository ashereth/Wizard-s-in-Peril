"use strict"

// game config
let config = {
    parent: 'phaser-game',
    type: Phaser.AUTO,
    render: {
        pixelArt: true  // prevent pixel art from getting blurred when scaled
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1440,
        height: 900
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,//set to false for final product
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Title, Wizard, Controls, Credits, GameOverScene, PopupScene, pauseScene]
}

var cursors;
const SCALE = 2.0;
var my = {sprite: {}, text: {}, vfx: {}};

const game = new Phaser.Game(config);