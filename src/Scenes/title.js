class Title extends Phaser.Scene {
    constructor() {
        super("Title");
        this.my = {sprite: {}};
    }

    preload() {
        this.load.setPath("./assets/");
        //load background
        this.load.image("tilemap_tiles", "Tilemap/tilemap_packed.png");// Packed tilemap
        this.load.image("background", "Tiles/fantasyBackground.png");
        this.load.image("bullet", 'Tiles/dotGreen.png');
        this.load.image("player", "Tiles/tile_0084.png"); // Load player sprite
    }

    create() {
        let my = this.my;   // create an alias to this.my for readability

        this.background = this.add.sprite(this.cameras.main.centerX, this.cameras.main.centerY, "background");
        this.background.setScale(1.6);
        this.background.displayHeight = 900;

        // makes character go in path behind words
        const points = [
            50, 0,
            200, 500,
            143, 230,
            700, 100,
            1000, 0,
            350, 423
        ];
        this.path = new Phaser.Curves.Spline(points);
        
        my.sprite.player = this.add.follower(this.path, 200, 200, "player");
        my.sprite.player.setScale(3.5);
        my.sprite.player.startFollow({
            duration: 4500,
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut',
            rotationOffset: 180,
        });

        this.bullet = [];
        this.enemyMaxBullets = 3;

        this.cKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        const titleText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, "Wizard's in Peril", {
            fontFamily: "Arial Black",
            fontSize: 64
        }).setOrigin(0.5);
        titleText.setStroke('#BCD1FB', 4);

        //  Apply the gradient fill.
        const gradient = titleText.context.createLinearGradient(0, 0, 0, titleText.height);
        gradient.addColorStop(0, '#0A0908');
        gradient.addColorStop(0.5, '#49111C');
        gradient.addColorStop(0.5, '#5E503F');
        gradient.addColorStop(1, '#A9927D');

        titleText.setFill(gradient);
        const newScene = this.add.text(this.cameras.main.centerX - 160, this.cameras.main.centerY - 20, "CLICK TO START GAME", {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#55FF55"
        });
        newScene.setStroke("#000000", 4);
        const controlsScene = this.add.text(this.cameras.main.centerX - 185, this.cameras.main.centerY + 20, "PRESS 'c' FOR CONTROLS", {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#E9EB87"
        });
        controlsScene.setStroke("#000000", 4);
        const creditsScene = this.add.text(this.cameras.main.centerX - 165, this.cameras.main.centerY + 55, "PRESS 'a' FOR CREDITS", {
            fontFamily: "Arial",
            fontSize: 32,
            color: "#E9EB87"
        });
        creditsScene.setStroke("#000000", 4);

        this.input.once("pointerdown", function () {
            this.scene.start("wizardScene");
        }, this);
    }

    update() {
        let my = this.my;
        const shouldShoot = Phaser.Math.Between(0, 100) < 5;
        if (shouldShoot && this.bullet.length < this.enemyMaxBullets) {
            const playerBullet = this.add.sprite(
                my.sprite.player.x,
                my.sprite.player.y + (my.sprite.player.displayHeight/2),
                "bullet"
            );
            playerBullet.setScale(2.5);
            
            const directions = [
                { x: 0, y: 8 },   // down
                { x: 0, y: -8 },  // up
                { x: 8, y: 0 },   // right
                { x: -8, y: 0 }   // left
            ];

            // Get a random direction
            const randomDirection = Phaser.Utils.Array.GetRandom(directions);

            // Set the velocity of the bullet
            playerBullet.setData('velocity', randomDirection);

            this.bullet.push(playerBullet);
        }
        for (let i = 0; i < this.bullet.length; i++) {
            const playerBullet = this.bullet[i];
            const velocity = playerBullet.getData('velocity');
            playerBullet.x += velocity.x;
            playerBullet.y += velocity.y;

            // Check if the bullet is out of bounds
            if (playerBullet.y > this.game.config.height || playerBullet.y < 0 || playerBullet.x > this.game.config.width || playerBullet.x < 0) {
                playerBullet.destroy();
                this.bullet.splice(i, 1);
                i--;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(this.cKey)) {
            this.scene.start("Controls");
        }
        if (Phaser.Input.Keyboard.JustDown(this.aKey)) {
            this.scene.start("Credits");
        }
    }
}