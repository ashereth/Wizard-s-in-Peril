class Credits extends Phaser.Scene {
    constructor() {
        super("Credits");
        this.my = {sprite: {}};
    }

    preload() {
        this.load.setPath("./assets/");     // Set load path
        //load background
        this.load.image("tilemap_tiles", "Tilemap/tilemap_packed.png");// Packed tilemap
        this.load.image("background", "Tiles/fantasyBackground.png");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability  
        
        this.background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, "background");
        this.background.setScale(1.6);
        this.background.displayHeight = 900;

        const commonStyle = {
            fontFamily: "Arial Black",
            fontSize: 32,
            stroke: '#000000',
            strokeThickness: 4,
            color: "#FFFFFF" // Optional, if you want a specific text color
        };

        this.add.text(this.cameras.main.centerX - 100, this.cameras.main.centerY - 400, "MADE BY:", commonStyle);
        this.add.text(this.cameras.main.centerX - 210, this.cameras.main.centerY - 350, "ASHER ETHERINGTON", commonStyle);
        this.add.text(this.cameras.main.centerX - 255, this.cameras.main.centerY - 300, "DAVID GUERRERO-PANTOJA", commonStyle);
        this.add.text(this.cameras.main.centerX - 130, this.cameras.main.centerY - 250, "JOSHUA HALL", commonStyle);
        this.add.text(this.cameras.main.centerX - 120, this.cameras.main.centerY - 200, "CREDITS TO:", commonStyle);
        this.add.text(this.cameras.main.centerX - 145, this.cameras.main.centerY - 150, "KENNY ASSETS", commonStyle);
        this.add.text(this.cameras.main.centerX - 85, this.cameras.main.centerY - 100, "PIXABAY", commonStyle);
        const titleScene = this.add.text(this.cameras.main.centerX - 220, this.cameras.main.centerY + 100, "CLICK TO GO BACK TO TITLE", {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#55FF55"
        });
        titleScene.setStroke("#000000", 4);

        this.input.once("pointerdown", function () {
            this.scene.start("Title");
        }, this);
    }

    update() {
        let my = this.my;
    }
}