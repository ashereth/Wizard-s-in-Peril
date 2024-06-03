class Wizard extends Phaser.Scene {
    constructor() {
        super("wizardScene");
        this.gameOver = this.gameOver.bind(this);
        this.my = { sprite: {} };
    }
    //send player to game over scene
    gameOver(score) {
        this.scene.start('GameOverScene', { score: score });

    }
    //code for emitting a bullet
    shootBullet(pointer) {
        for (let i = 0; i < this.numBullets; i++) {
            // Calculate delay for each bullet
            let delay = i * 100; // Delay each bullet by 100ms incrementally

            this.time.delayedCall(delay, () => {
                let player = this.my.sprite.player;
                let bullet = this.bullets.get(player.x, player.y);
                if (bullet) {
                    bullet.displayWidth = bullet.width * this.bulletScale;
                    bullet.displayHeight = bullet.height * this.bulletScale;

                    bullet.setActive(true);
                    bullet.setVisible(true);

                    // Calculate direction vector from player to pointer
                    let direction = new Phaser.Math.Vector2(pointer.worldX - player.x, pointer.worldY - player.y);
                    direction.normalize();

                    // Set bullet velocity based on direction
                    let bulletSpeed = this.bulletSpeed;
                    bullet.body.velocity.x = direction.x * bulletSpeed;
                    bullet.body.velocity.y = direction.y * bulletSpeed;
                }
            }, [], this);
        }
    }

    preload() {
        this.load.setPath("./assets/");
        //load background
        this.load.image("tilemap_tiles", "Tilemap/tilemap_packed.png");// Packed tilemap
        this.load.image("bullet", 'Tiles/dotGreen.png');
        this.load.tilemapTiledJSON("Background-Map", "Background-Map.tmj");   // Tilemap in JSON
        this.load.image("player", "Tiles/tile_0084.png"); // Load player sprite
        //set initial player values
        this.playerHealth = 10;
        this.playerScore = 10;
        //how fast the bullets travel
        this.bulletSpeed = 200;
        //how large the bullets ares
        this.bulletScale = .2;
        //how many bullets get shot each click
        this.numBullets = 10;

    }

    init() {
        this.mapWidth = 16 * 30;
        this.mapHeight = 16 * 30;
        this.playerSpeed = 1.5;
        this.SCALE = .75;
    }
    create() {
        let my = this.my;

        this.map = this.add.tilemap("Background-Map", 16, 16, 30, 30);
        this.tileset = this.map.addTilesetImage("rogue like tiles", "tilemap_tiles");
        //create background
        this.backgroundLayer = this.map.createLayer("background", this.tileset, 0, 0);
        //create player
        my.sprite.player = this.physics.add.sprite(200, 200, "player");
        my.sprite.player.setScale(this.SCALE)

        //create camera and zoom in
        // Set world bounds to match the scaled tilemap size
        this.physics.world.setBounds(0, 0, this.mapWidth, this.mapHeight);
        this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
        this.cameras.main.startFollow(my.sprite.player, true, .1, .1);
        this.cameras.main.setZoom(4.0);

        // set up Phaser-provided cursor key input
        cursors = this.input.keyboard.createCursorKeys();
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        // Create a group for bullets
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: 50,
        });

        // Handle mouse click to shoot
        this.input.on('pointerdown', this.shootBullet, this);
    }
    update() {

        //make sure player isnt dead
        if (this.playerHealth === 0) {
            this.gameOver(this.playerScore);
        }
        //movement controls
        if (cursors.left.isDown || this.cursors.left.isDown) {
            this.my.sprite.player.x -= this.playerSpeed;
            if (this.my.sprite.player.x < this.my.sprite.player.width) {
                this.my.sprite.player.x = this.my.sprite.player.width;
            }
        }
        if (cursors.right.isDown || this.cursors.right.isDown) {
            this.my.sprite.player.x += this.playerSpeed;
            if (this.my.sprite.player.x > this.mapWidth - this.my.sprite.player.width) {
                this.my.sprite.player.x = this.mapWidth - this.my.sprite.player.width;
            }
        }
        if (cursors.up.isDown || this.cursors.up.isDown) {
            this.my.sprite.player.y -= this.playerSpeed;
            if (this.my.sprite.player.y < this.my.sprite.player.height) {
                this.my.sprite.player.y = this.my.sprite.player.height;
            }
        }
        if (cursors.down.isDown || this.cursors.down.isDown) {
            this.my.sprite.player.y += this.playerSpeed;
            if (this.my.sprite.player.y > this.mapHeight - this.my.sprite.player.height) {
                this.my.sprite.player.y = this.mapHeight - this.my.sprite.player.height;
            }
        }
        // Update bullets position
        this.bullets.children.each(bullet => {
            //delete bullets that are offscreen
            if (bullet.active && (bullet.y < 0 || bullet.y > this.mapHeight || bullet.x < 0 || bullet.x > this.mapWidth)) {
                bullet.setActive(false);
                bullet.setVisible(false);
                bullet.destroy();
            }
        }, this);
    }
}