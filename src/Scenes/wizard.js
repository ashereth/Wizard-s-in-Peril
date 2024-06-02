class Wizard extends Phaser.Scene {
    constructor() {
        super("wizardScene");
        this.my = {sprite: {}};
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