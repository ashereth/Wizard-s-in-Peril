class PopupScene extends Phaser.Scene {
    constructor() {
        super("PopupScene");
    }

    init(data) {
        this.playerSpeed = data.playerSpeed;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.image("tilemap_tiles", "Tilemap/tilemap_packed.png");                         // Packed tilemap
        this.load.image("button", "Tiles/tile_0061.png");
        this.load.image("green", "Tiles/tile_0114.png");
    }

    create() {
        // upgrade for speed
        this.popupBg = this.add.rectangle(900, 450, 300, 400, 0x000000, 0.8);
        this.speedText = this.add.text(900, 400, 'Upgrade Your Speed!', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        this.speedButton = this.add.sprite(900, 450, 'button').setInteractive();
        this.speedButton.setScale(2);

        this.speedButton.on('pointerdown', () => {
            this.upgradeSpeed();
        });

        // downgrade for speed
        this.popupGreen = this.add.rectangle(500, 450, 300, 400, 0x000000, 0.8);
        this.slowText = this.add.text(500, 400, 'Downgrade Your Speed!', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5);

        this.slowButton = this.add.sprite(500, 450, 'green').setInteractive();
        this.slowButton.setScale(3);

        this.slowButton.on('pointerdown', () => {
            this.downgradeSpeed();
        });
    }

    upgradeSpeed() {
        this.playerSpeed += 0.5;
        this.scene.get('wizardScene').updatePlayerSpeed(this.playerSpeed);
        this.closePopup();
    }

    downgradeSpeed() {
        this.playerSpeed -= 0.5;
        this.scene.get('wizardScene').updatePlayerSpeed(this.playerSpeed);
        this.closePopup();
    }

    closePopup() {
        this.scene.resume('wizardScene');
        this.scene.stop();
    }
}