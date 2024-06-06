class PopupScene extends Phaser.Scene {
    constructor() {
        super("PopupScene");
    }

    preload() {
        this.load.setPath("./assets/");
        //load background
        this.load.image("tilemap_tiles", "Tilemap/tilemap_packed.png");// Packed tilemap
        this.load.image("button", "Tiles/tile_0061.png");
    }
    
    init(data) {
        if (Array.isArray(data.upgrades) && data.upgrades.length === 2) {
            this.upgrades = data.upgrades;
        } else {
            console.error("Upgrades data is invalid or not of length 2:", data.upgrades);
            this.closePopup();
        }
        console.log('PopupScene Init Data:', data);
        console.log('Upgrades:', this.upgrades);
    }

    create() {
        if (this.upgrades && this.upgrades.length === 2) {
            // Display the first upgrade option
            this.popupBg1 = this.add.rectangle(400, 450, 500, 600, 0x000000, 0.8);
            this.upgradeText1 = this.add.text(420, 450, `${this.upgrades[0].name}\n${this.upgrades[0].description}`, { fontSize: '24px', fill: '#fff', align: 'center'}).setOrigin(0.5);
            this.upgradeButton1 = this.add.sprite(400, 550, this.upgrades[0].tile).setInteractive();
            this.upgradeButton1.setScale(4);
            this.upgradeButton1.on('pointerdown', () => {
                this.selectUpgrade(this.upgrades[0]);
            });
        
            // Display the second upgrade option
            this.popupBg2 = this.add.rectangle(1000, 450, 500, 600, 0x000000, 0.8);
            this.upgradeText2 = this.add.text(1020, 450, `${this.upgrades[1].name}\n${this.upgrades[1].description}`, { fontSize: '24px', fill: '#fff', align: 'center'}).setOrigin(0.5);
            this.upgradeButton2 = this.add.sprite(1000, 550, this.upgrades[1].tile).setInteractive();
            this.upgradeButton2.setScale(4);
            this.upgradeButton2.on('pointerdown', () => {
                this.selectUpgrade(this.upgrades[1]);
            });
        }
         else {
            console.error("Upgrades data is invalid:", this.upgrades);
            this.closePopup();
        }
    }

    selectUpgrade(upgrade) {
        this.scene.get('wizardScene').applyUpgrade(upgrade);
        this.closePopup();
    }

    closePopup() {
        this.scene.resume('wizardScene');
        this.scene.stop();
    }
}