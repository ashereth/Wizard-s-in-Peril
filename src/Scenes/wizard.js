class Wizard extends Phaser.Scene {
    constructor() {
        super("wizardScene");
        this.gameOver = this.gameOver.bind(this);
        this.win = this.win.bind(this);

    }
    preload(){
        this.preload.setPath("./assets/");
        
    }
}