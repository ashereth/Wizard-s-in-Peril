class pauseScene extends Phaser.Scene {
    constructor() {
        super("pauseScene");
        this.my = {sprite: {}};
    }

    init(data) {
        this.level = data.level;
    }

    preload() {
        this.load.setPath("./assets/");
        //load background
        this.load.image("tilemap_tiles", "Tilemap/tilemap_packed.png");// Packed tilemap
    }

    create(data) {
        let my = this.my;   // create an alias to this.my for readability

        // Access data passed from the wizard scene
        const {
            playerHealth,
            maxHealth,
            level,
            bulletSpeed,
            bulletScale,
            numBullets,
            maxBullets,
            playerSpeed,
            playerDamage,
            scoreGainPerCollectable,
            collectableSpeed
        } = data;


        // Create a semi-transparent background rectangle
        this.pauseMenuBg = this.add.rectangle(this.cameras.main.centerX, this.cameras.main.centerY, 700, 700, 0x000000, 0.8);
        this.pauseMenuBg.setOrigin(0.5);

        // Add text displaying the player's stats
        this.pauseMenuText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, `Health: ${playerHealth}\n\nMax Health: ${maxHealth}\n\nLevel: ${level}\n\nBullet Speed: ${bulletSpeed}\n\nBullet Size: ${bulletScale}\n\nBullets Per Shot: ${numBullets}\n\nMax Bullets: ${maxBullets}\n\nPlayer Speed: ${playerSpeed}\n\nPlayer Damage: ${playerDamage}\n\nXP per Collectable: ${scoreGainPerCollectable}\n\nCollectable Speed: ${collectableSpeed}`, {
            fontSize: '20px',
            fill: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 480, useAdvancedWrap: true }
        }).setOrigin(0.5);

        this.pauseMenuText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 300, 'Paused', {
            fontSize: '50px',
            fill: '#FFFFFF',
            align: 'center',
            wordWrap: { width: 480, useAdvancedWrap: true }
        }).setOrigin(0.5);

        // Add a resume button
        this.playButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 300, 'Click to Resume', {
            fontSize: '50px',
            fill: '#00FFFF',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setInteractive();
        
        this.input.once('pointerdown', function ()
        {
            this.closePopup();
        }, this);
    }

    closePopup() {
        this.scene.resume('wizardScene');
        this.scene.stop();
    }

    update() {
        let my = this.my;
    }
}