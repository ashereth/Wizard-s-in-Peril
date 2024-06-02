class Wizard extends Phaser.Scene {
    constructor() {
        super("wizardScene");
        this.gameOver = this.gameOver.bind(this);
        this.my = {sprite: {}};
    }
    //send player to game over scene
    gameOver() {
        this.scene.start('GameOverScene');
    }
    preload(){
        this.load.setPath("./assets/");
        //load background
    }
    create(){
        let my = this.my;
        
    }
    update() {

    }
}