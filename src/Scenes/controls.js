class Controls extends Phaser.Scene {
    constructor() {
        super("Controls");
        this.my = {sprite: {}};
    }

    preload() {
        this.load.setPath("./assets/");
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

        this.add.text(this.cameras.main.centerX - 147, this.cameras.main.centerY - 200, "'W' - Move Up", commonStyle);
        this.add.text(this.cameras.main.centerX - 140, this.cameras.main.centerY - 150, "'A' - Move Left", commonStyle);
        this.add.text(this.cameras.main.centerX - 138, this.cameras.main.centerY - 100, "'S' - Move Down", commonStyle);
        this.add.text(this.cameras.main.centerX - 140, this.cameras.main.centerY - 50, "'D' - Move Right", commonStyle);
        this.add.text(this.cameras.main.centerX - 185, this.cameras.main.centerY - 0, "'Mouse Click' - Shoot", commonStyle);
        this.add.text(this.cameras.main.centerX - 207, this.cameras.main.centerY + 50, "Move the Mouse to Aim!", commonStyle);
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