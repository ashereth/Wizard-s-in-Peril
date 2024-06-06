class Wizard extends Phaser.Scene {
    constructor() {
        super("wizardScene");
        this.gameOver = this.gameOver.bind(this);
        this.cyclopsGroup = null;
        this.isInvincible = false;
        this.isBossMusicPlayer = false;

        // define the possible upgrades
        this.upgrades = [
            { name: 'Damage Potion', apply: () => this.damage += 1, tile: "damage_potion_tile" },
            { name: 'Speed Potion', apply: () => this.playerSpeed += 0.5, tile: "speed_potion_tile" },
            { name: 'Hasty Projectiles Potion', apply: () => this.bulletSpeed += 50, tile: "hasty_tile" },
            { name: 'Projectile Magnification Potion', apply: () => this.bulletScale += 0.4, tile: "project_tile" },
            { name: 'Tome of Burst Shot', apply: () => this.numBullets += 1, tile: "burst_tile" },
            { name: 'Elixir of Health Restoration', apply: () => this.playerHealth = this.maxHealth, tile: "health_potion_tile"},
            {
                name: 'Tome of Mana Fortification', apply: () => {
                    this.maxBullets += 10//increase max bullets that can be spawned
                    this.bullets.maxSize = this.maxBullets;//change the maxsize of the bullets group
                }, tile: "mana_tile"
            },
            { name: "Fountain of Life Amplification", apply: () => {
                this.maxHealth += 2,
                this.playerHealth+=2
            }, tile: "health_refill_tile"}
        ];
    }
    //send player to game over scene
    gameOver(level) {
        //reset text on side of game
        document.getElementById('description').innerHTML = `<p></p>`
        this.scene.start('GameOverScene', { level: level });

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

    darkWizardShoot() {
        //make the wizards shoot
        this.darkWizardGroup.children.each(wizard => {
            for (let i = 1; i <= 4; i++) {
                let bullet = this.darkWizardBullets.get(wizard.x, wizard.y);
                if (bullet) {
                    bullet.displayWidth = bullet.width * .1;
                    bullet.displayHeight = bullet.height * .1;

                    bullet.setActive(true);
                    bullet.setVisible(true);
                    // Set bullet velocity based on direction
                    let bulletSpeed = this.bulletSpeed;
                    if (i === 1) {
                        bullet.body.velocity.x = bulletSpeed * 1;
                        bullet.body.velocity.y = bulletSpeed * 0;
                    } else if (i === 2) {
                        bullet.body.velocity.x = bulletSpeed * -1;
                        bullet.body.velocity.y = bulletSpeed * 0;
                    } else if (i === 3) {
                        bullet.body.velocity.x = bulletSpeed * 0;
                        bullet.body.velocity.y = bulletSpeed * 1;
                    } else if (i === 4) {
                        bullet.body.velocity.x = bulletSpeed * 0;
                        bullet.body.velocity.y = bulletSpeed * -1;
                    }
                }
            }
        })
    }

    preload() {
        this.load.setPath("./assets/");
        //load background
        this.load.image("tilemap_tiles", "Tilemap/tilemap_packed.png");// Packed tilemap
        this.load.image("bullet", 'Tiles/dotGreen.png');
        this.load.image("dark wizard bullet", "Tiles/tank_explosion4.png");
        this.load.tilemapTiledJSON("Background-Map", "Background-Map.tmj");   // Tilemap in JSON
        this.load.image("player", "Tiles/tile_0084.png"); // Load player sprite
        this.load.image("cyclops", "Tiles/tile_0109.png");// Load cyclops sprite
        this.load.image("dark wizard", "Tiles/tile_0111.png");//load dark wizard pricture
        this.load.image("spider", "Tiles/tile_0122.png"); //load spider
        this.load.image("collectable", 'Tiles/laserBlue08.png')
        this.load.image("collectable", 'Tiles/laserBlue08.png');
        this.load.image("damage_potion_tile", "Tiles/tile_0115.png");
        this.load.image("speed_potion_tile", "Tiles/tile_0113.png");
        this.load.image("hasty_tile", "Tiles/tile_0130.png");
        this.load.image("project_tile", "Tiles/tile_0118.png");
        this.load.image("burst_tile", "Tiles/tile_0062.png");
        this.load.image("health_potion_tile", "Tiles/tile_0114.png");
        this.load.image("mana_tile", "Tiles/tile_0116.png");
        this.load.image("health_refill_tile", "Tiles/tile_0020.png");
        this.load.image("collectable", 'Tiles/laserBlue08.png');
        this.load.audio("shoot", "Audio/laserLarge_000.ogg");
        this.load.audio("levelUp", "Audio/powerUp11.ogg");
        this.load.audio("boss", "Audio/spaceEngineLarge_000.ogg");
        this.load.audio("hit", "Audio/lowDown.ogg");
        this.load.audio("die", "Audio/slime_001.ogg");
        this.load.audio("collect", "Audio/powerUp7.ogg");

        this.init();
        this.setPlayerInfoText();
    }

    init() {
        //set initial player values
        this.playerHealth = 10;
        this.maxHealth = 10;
        this.playerScore = 0;
        //how may points to level up
        this.scoreToLevel = 50;
        this.level = 1;
        //how fast the bullets travel
        this.bulletSpeed = 200;
        //how large the bullets ares
        this.bulletScale = .2;
        //how many bullets get shot each click
        this.numBullets = 1;
        //maximum number of bullets that can be on screen at a time
        this.maxBullets = 20;
        //amount of score gained per collectable pickup
        this.scoreGainPerCollectable = 10;

        this.mapWidth = 16 * 30;
        this.mapHeight = 16 * 30;
        this.playerSpeed = 1.5;
        this.SCALE = .75;
        this.cyclopsSCALE = 1.25;
        this.cyclopsSpawnRate = 2000;
        this.cyclopsHitsToDestroy = 3;
        this.cyclopsSpeed = 40;
        this.damage = 1;
        this.enemyDamage = 1;
        this.invincibilityDuration = 300;
        this.darkWizardHitsToDestroy = 50;
        this.wizardSpeed = 20;
        this.spiderSpeed = 80;
        this.spiderHitsToDestory = 1;
        this.spiderSpawnRate = 1500;
        this.spiderSCALE = .50;


        // Create a group for bullets
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: this.maxBullets,
        });
        //group for wizard bullets
        this.darkWizardBullets = this.physics.add.group({
            defaultKey: "dark wizard bullet",
            maxSize: 1000
        });
    }
    create() { 
        this.bossMusic = this.sound.add('boss', { loop: true, volume: 0.3 });

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


        // Create a group for cyclops enemies
        this.cyclopsGroup = this.physics.add.group();
        //new group for wizard enemies
        this.darkWizardGroup = this.physics.add.group();

        //new group for spider enemies
        this.spiderGroup = this.physics.add.group();

        //create a group for collectable stuff to be dropped when an enemy dies
        this.collectableGroup = this.physics.add.group();

        // Handle mouse click to shoot
        this.input.on('pointerdown', this.shootBullet, this);
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Spawn an enemy cyclops 
        this.cyclopsSpawner = this.time.addEvent({
            delay: this.cyclopsSpawnRate,
            callback: this.spawnCyclops,
            callbackScope: this,
            loop: true
        });
        this.spiderSpawner = this.time.addEvent({
            delay: this.spiderSpawnRate,
            callback: this.spawnSpider,
            callbackScope: this,
            loop: true
        })
        this.time.addEvent({
            delay: 1000,
            callback: this.darkWizardShoot,
            callbackScope: this,
            loop: true
        })


        // Add collision detection between bullets and cyclops
        this.physics.add.overlap(this.bullets, this.cyclopsGroup, this.hitEnemy, null, this);
        //add collision between bullets and wizards
        this.physics.add.overlap(this.bullets, this.darkWizardGroup, this.hitEnemy, null, this);
        //add collision between bullets and spider
        this.physics.add.overlap(this.bullets, this.spiderGroup, this.hitEnemy, null, this);

        // Add collision detection between cyclops and player
        this.physics.add.overlap(my.sprite.player, this.cyclopsGroup, this.playerHitEnemy, null, this);

        //add collision between wizards and player
        this.physics.add.overlap(my.sprite.player, this.darkWizardGroup, this.playerHitEnemy, null, this);

        //add collision between spider and player
        this.physics.add.overlap(my.sprite.player, this.spiderGroup, this.playerHitEnemy, null, this);

        this.physics.add.overlap(my.sprite.player, this.darkWizardBullets, this.playerHitEnemy, null, this);


        //player can pick up collectables
        this.physics.add.overlap(my.sprite.player, this.collectableGroup, (player, collectable) => {
            collectable.destroy();
            this.playerScore += this.scoreGainPerCollectable;
            this.sound.play('collect', {
                volume: .1
            });
        });

        // debug key listener (assigned to F key)
        this.input.keyboard.on('keydown-F', function () {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this)
    }

    update() {
        //update the score and level text
        this.setPlayerInfoText()
        if (this.playerScore >= this.scoreToLevel) {
            this.levelUp()
        }

        //make sure player isnt dead
        if (this.playerHealth === 0) {
            document.getElementById('description').innerHTML = `<h1>Player Health = 0<h1><h1>Player Score = ${this.playerScore}<h1>`

            this.gameOver(this.level);
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

        // Update dark wizard bullets and delete them
        this.darkWizardBullets.children.each(bullet => {
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

        //make wizards move toward player
        this.darkWizardGroup.children.each(wizard => {
            if (wizard.active) {
                let direction = new Phaser.Math.Vector2(my.sprite.player.x - wizard.x, my.sprite.player.y - wizard.y);
                direction.normalize();
                wizard.setVelocity(direction.x * this.wizardSpeed, direction.y * this.wizardSpeed);
            }
        }, this);

        //make spider move toward player
        this.spiderGroup.children.each(spider => {
            if (spider.active) {
                let direction = new Phaser.Math.Vector2(my.sprite.player.x - spider.x, my.sprite.player.y - spider.y);
                direction.normalize();
                spider.setVelocity(direction.x * this.spiderSpeed, direction.y * this.spiderSpeed);
            }
        }, this);

        //play or stop the boss music based on dark wizard presence
        if (this.darkWizardGroup.countActive(true) > 0) {
            if (!this.isBossMusicPlaying) {
                this.bossMusic.play();
                this.isBossMusicPlaying = true;
            }
        } else {
            if (this.isBossMusicPlaying) {
                this.bossMusic.stop();
                this.isBossMusicPlaying = false;
            }
        }
    }

    setPlayerInfoText() {
        document.getElementById('description').innerHTML = `
            <h1>Health = ${this.playerHealth}<h1>
            <h1>Your Level = ${this.level}<h1>
            <h1>%${parseInt((this.playerScore / this.scoreToLevel) * 100)} to level ${this.level + 1}<h1>
            <h1>Mana = ${this.maxBullets - this.bullets.getLength()}/${this.maxBullets}</h1>`

    }

    //function called whenever player levels up
    levelUp() {
        this.cyclopsSpawner.delay*=.90;
        this.spiderSpawner.delay*=.95;
        this.level += 1;
        this.playerScore = 0;
        this.scoreToLevel *= 1.25;
        this.sound.play('levelUp', {
            volume: .3
        });
        //every 5 levels spawn that many dark wizards
        if (this.level % 5 === 0) {
            for (let i = 0; i < Math.floor(this.level / 5); i++) {
                this.spawnDarkWizard()
            }
        }

        // Ensure we have enough upgrades to choose from
        if (this.upgrades.length < 2) {
            return;
        }

        // Select two distinct random upgrades
        let selectedUpgrades = [];
        while (selectedUpgrades.length < 2) {
            let randomUpgrade = Phaser.Utils.Array.GetRandom(this.upgrades);
            if (!selectedUpgrades.includes(randomUpgrade)) {
                selectedUpgrades.push(randomUpgrade);
            }
        }

        // Show upgrades to the player
        this.displayUpgradeChoices(selectedUpgrades);
    }

    displayUpgradeChoices(upgrades) {
        // Pause game and go to popup upgrades
        this.scene.pause();
        this.scene.launch('PopupScene', { upgrades: upgrades, wizardScene: this });
    }

    applyUpgrade(upgrade) {
        upgrade.apply();
        this.scene.resume();
    }

    spawnDarkWizard() {
        let positions = [
            { x: Phaser.Math.Between(-50, 0), y: Phaser.Math.Between(0, this.mapHeight) },
            { x: Phaser.Math.Between(this.mapWidth, this.mapWidth + 50), y: Phaser.Math.Between(0, this.mapHeight) },
            { x: Phaser.Math.Between(0, this.mapWidth), y: Phaser.Math.Between(-50, 0) },
            { x: Phaser.Math.Between(0, this.mapWidth), y: Phaser.Math.Between(this.mapHeight, this.mapHeight + 50) }
        ];
        let pos = Phaser.Utils.Array.GetRandom(positions);
        let wizard = this.darkWizardGroup.create(pos.x, pos.y, 'dark wizard');
        wizard.setScale(this.cyclopsSCALE * 1.5);
        wizard.setActive(true)
        wizard.setVisible(true)
        wizard.body.setAllowGravity(false);
        wizard.hitsLeft = this.darkWizardHitsToDestroy*Math.floor(this.level/5);
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

    spawnSpider() {
        let positions = [
            { x: Phaser.Math.Between(-50, 0), y: Phaser.Math.Between(0, this.mapHeight) },
            { x: Phaser.Math.Between(this.mapWidth, this.mapWidth + 50), y: Phaser.Math.Between(0, this.mapHeight) },
            { x: Phaser.Math.Between(0, this.mapWidth), y: Phaser.Math.Between(-50, 0) },
            { x: Phaser.Math.Between(0, this.mapWidth), y: Phaser.Math.Between(this.mapHeight, this.mapHeight + 50) }
        ];
        let pos = Phaser.Utils.Array.GetRandom(positions);
        let spider = this.spiderGroup.create(pos.x, pos.y, 'spider');
        spider.setScale(this.spiderSCALE);
        spider.setActive(true);
        spider.setVisible(true);
        spider.body.setAllowGravity(false);
        spider.hitsLeft = this.spiderHitsToDestory;
    }

    enemyDeath(enemy) {
        let collectable = this.collectableGroup.create(enemy.x, enemy.y, 'collectable');
        collectable.setActive(true);
        collectable.setVisible(true);
        collectable.body.setAllowGravity(false);
        collectable.setScale(.2);
    }

    hitEnemy(bullet, enemy) {
        bullet.setActive(false);
        bullet.setVisible(false);
        bullet.destroy();

        enemy.hitsLeft -= this.damage;
        if (enemy.hitsLeft <= 0) {
            // Enemies spaws consumable when dead
            this.enemyDeath(enemy);
            enemy.setActive(false);
            enemy.setVisible(false);
            enemy.destroy();
        }
    }

    playerHitEnemy() {
        if (!this.isInvincible) {
            this.playerHealth -= this.enemyDamage;

            if (this.playerHealth <= 0) {
                this.sound.play('die', {
                    volume: .3
                });
                this.gameOver(this.level);
            } else {
                this.sound.play('hit', {
                    volume: .3
                });
                this.isInvincible = true;
                my.sprite.player.setTint(0xffffff); // Change color for invincibility. This does not work so we can just change this to audio later
                this.time.delayedCall(this.invincibilityDuration, () => {
                    this.isInvincible = false;
                    my.sprite.player.clearTint(); // Reset player color. This wouldn't be needed later
                }, [], this);
            }
        }
    }

    //send player to game over scene
    gameOver(level) {
        //reset text on side of game
        document.getElementById('description').innerHTML = `<p></p>`
        this.scene.start('GameOverScene', { level: level });

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
                    this.sound.play('shoot', {
                        volume: 0.1
                    });
                }
            }, [], this);
        }
    }

}