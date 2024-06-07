class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        this.level = data.level;
    }

    preload() {
        this.load.setPath("./assets/");     // Set load path
        //load background
        this.load.image("tilemap_tiles", "Tilemap/tilemap_packed.png");// Packed tilemap
        this.load.image("death", "Tiles/deathScreen.png");
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability
        
        this.deathBackground = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, "death");
        this.deathBackground.setScale(1.6);
        this.deathBackground.displayHeight = 900;
        
        const commonStyle = {
            fontFamily: "Arial Black",
            fontSize: 64,
            stroke: '#000000',
            strokeThickness: 4,
            color: "#FF0000" // Optional, if you want a specific text color
        };

        // Display "Game Over" text
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 250, "Game Over.", commonStyle).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX + 10, this.cameras.main.centerY + 50, "Level Reached:\n\n", {
            fontSize: '55px',
            fill: '#000000',
            align: "center",
            stroke: '#FFFFFF',
            strokeThickness: 3.5
        }).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, `\n${this.level}`, {
            fontSize: '84px',
            fill: '#2ECC71',
            align: "center",
            stroke: '#FFFFFF',
            strokeThickness: 3
        }).setOrigin(0.5);

        // Add a button or text to restart the game
        const restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 185, 'Restart', {
            fontSize: '50px',
            fill: '#00FFFF',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('wizardScene');
        });
    }
}
