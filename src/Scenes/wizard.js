class Wizard extends Phaser.Scene {
    constructor() {
        super("wizardScene");
        this.gameOver = this.gameOver.bind(this);
        this.cyclopsGroup = null;
        this.isInvincible = false;
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
                let player = my.sprite.player;
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
        this.load.image("cyclops", "Tiles/tile_0109.png");// Load cyclops sprite
        this.init();
        document.getElementById('description').innerHTML = `<h1>Player Health = 10<h1><h1>Player Level = 0<h1>`


    }

    init() {
        //set initial player values
        this.playerHealth = 10;
        this.playerScore = 0;
        //how may points to level up
        this.scoreToLevel = 10;
        this.level = 1;
        //how fast the bullets travel
        this.bulletSpeed = 200;
        //how large the bullets ares
        this.bulletScale = .2;
        //how many bullets get shot each click
        this.numBullets = 1;

        this.mapWidth = 16 * 30;
        this.mapHeight = 16 * 30;
        this.playerSpeed = 1.5;
        this.SCALE = .75;
        this.cyclopsSCALE = 1.25;
        this.cyclopsSpawnRate = 1000;
        this.cyclopsHitsToDestroy = 3;
        this.cyclopsSpeed = 50;
        this.damage = 1;
        this.cyclopsDamage = 1;
        this.invincibilityDuration = 300;
    }
    create() {

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
        // Create a group for cyclops enemies
        this.cyclopsGroup = this.physics.add.group();

        // Handle mouse click to shoot
        this.input.on('pointerdown', this.shootBullet, this);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Spawn an enemy cyclops 
        this.time.addEvent({
            delay: this.cyclopsSpawnRate,
            callback: this.spawnCyclops,
            callbackScope: this,
            loop: true
        });

        // Add collision detection between bullets and cyclops
        this.physics.add.overlap(this.bullets, this.cyclopsGroup, this.hitCyclops, null, this);

        // Add collision detection between cyclops and player
        this.physics.add.overlap(my.sprite.player, this.cyclopsGroup, this.playerHitCyclops, null, this);

    }
    update() {
        //update the score and level text
        document.getElementById('description').innerHTML = `<h1>Health = ${this.playerHealth}<h1><h1>Your Level = ${this.level}<h1><h1>%${parseInt((this.playerScore/this.scoreToLevel)*100)} to level ${this.level+1}<h1>`

        if (this.playerScore>=this.scoreToLevel) {
            this.levelUp()
        }

        //make sure player isnt dead
        if (this.playerHealth === 0) {
            document.getElementById('description').innerHTML = `<h1>Player Health = 0<h1><h1>Player Score = ${this.playerScore}<h1>`

            this.gameOver(this.playerScore);
        }
        //movement controls
        if (cursors.left.isDown || this.cursors.left.isDown) {
            my.sprite.player.x -= this.playerSpeed;
            my.sprite.player.scaleX = -1;
            my.sprite.player.body.offset.x = my.sprite.player.width;
            if (my.sprite.player.x < my.sprite.player.width) {
                my.sprite.player.x = my.sprite.player.width;
            }
        }
        if (cursors.right.isDown || this.cursors.right.isDown) {
            my.sprite.player.x += this.playerSpeed;
            my.sprite.player.scaleX = 1;
            my.sprite.player.body.offset.x = 0;
            if (my.sprite.player.x > this.mapWidth - my.sprite.player.width) {
                my.sprite.player.x = this.mapWidth - my.sprite.player.width;
            }
        }
        if (cursors.up.isDown || this.cursors.up.isDown) {
            my.sprite.player.y -= this.playerSpeed;
            if (my.sprite.player.y < my.sprite.player.height) {
                my.sprite.player.y = my.sprite.player.height;
            }
        }
        if (cursors.down.isDown || this.cursors.down.isDown) {
            my.sprite.player.y += this.playerSpeed;
            if (my.sprite.player.y > this.mapHeight - my.sprite.player.height) {
                my.sprite.player.y = this.mapHeight - my.sprite.player.height;
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

        // Makes cyclops move towards player
        this.cyclopsGroup.children.each(cyclops => {
            if (cyclops.active) {
                let direction = new Phaser.Math.Vector2(my.sprite.player.x - cyclops.x, my.sprite.player.y - cyclops.y);
                direction.normalize();
                cyclops.setVelocity(direction.x * this.cyclopsSpeed, direction.y * this.cyclopsSpeed);
            }
        }, this);

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.scene.launch('PopupScene', { playerSpeed: this.playerSpeed });
            this.scene.pause();
        }
    }

    //function called whenever player levels up
    levelUp(){
        this.level += 1
        this.playerScore = 0;
        this.scoreToLevel*=1.5;
    }

    updatePlayerSpeed(newSpeed) {
        this.playerSpeed = newSpeed;
    }

    spawnCyclops() {
        let positions = [
            { x: Phaser.Math.Between(-50, 0), y: Phaser.Math.Between(0, this.mapHeight) },
            { x: Phaser.Math.Between(this.mapWidth, this.mapWidth + 50), y: Phaser.Math.Between(0, this.mapHeight) },
            { x: Phaser.Math.Between(0, this.mapWidth), y: Phaser.Math.Between(-50, 0) },
            { x: Phaser.Math.Between(0, this.mapWidth), y: Phaser.Math.Between(this.mapHeight, this.mapHeight + 50) }
        ];
        let pos = Phaser.Utils.Array.GetRandom(positions);
        let cyclops = this.cyclopsGroup.create(pos.x, pos.y, 'cyclops');
        cyclops.setScale(this.cyclopsSCALE);
        cyclops.setActive(true);
        cyclops.setVisible(true);
        cyclops.body.setAllowGravity(false);
        cyclops.hitsLeft = this.cyclopsHitsToDestroy;
    }

    hitCyclops(bullet, cyclops) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.destroy();

        cyclops.hitsLeft -= this.damage;
        if (cyclops.hitsLeft <= 0) {
            cyclops.setActive(false);
            cyclops.setVisible(false);
            cyclops.destroy();
            this.playerScore += 10; // Increase player score when cyclops is destroyed
        }
    }

    playerHitCyclops(player, cyclops) {
        if (!this.isInvincible) {
            this.playerHealth -= this.cyclopsDamage;
            if (this.playerHealth <= 0) {
                this.gameOver(this.playerScore);
            } else {
                this.isInvincible = true;
                my.sprite.player.setTint(0xffffff); // Change color for invincibility. This does not work so we can just change this to audio later
                this.time.delayedCall(this.invincibilityDuration, () => {
                    this.isInvincible = false;
                    my.sprite.player.clearTint(); // Reset player color. This wouldn't be needed later
                }, [], this);
            }
        }
    }
}