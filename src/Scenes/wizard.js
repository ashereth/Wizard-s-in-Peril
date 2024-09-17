class Wizard extends Phaser.Scene {
    constructor() {
        super("wizardScene");
        this.gameOver = this.gameOver.bind(this);
        this.cyclopsGroup = null;
        this.isInvincible = false;
        this.isBossMusicPlayer = false;
        this.backgroundMusic = false;

        // define the possible upgrades
        this.upgrades = [
            { name: 'Damage Potion', description: "+1 Damage", apply: () => this.damage += 1, tile: "damage_potion_tile" },
            { name: 'Speed Potion', description: "+0.25 Speed", apply: () => this.playerSpeed += 0.25, tile: "speed_potion_tile" },
            { name: 'Hasty Projectiles Potion', description: "+50 Projectile Speed", apply: () => this.bulletSpeed += 50, tile: "hasty_tile" },
            { name: 'Projectile Magnification Potion', description: "+0.4 Projectile Size", apply: () => this.bulletScale += 0.4, tile: "project_tile" },
            { name: 'Tome of Burst Shot', description: "+1 Projectile Per Shot", apply: () => this.numBullets += 1, tile: "burst_tile" },
            {
                name: 'Tome of Mana Fortification', description: "+3 Max Projectiles", apply: () => {
                    this.maxBullets += 3; //increase max bullets that can be spawned
                    this.bullets.maxSize = this.maxBullets; //change the maxsize of the bullets group
                }, tile: "mana_tile"
            },
            { name: "Fountain of Life Amplification", description: "+2 Max Health", apply: () => this.maxHealth += 2, tile: "health_refill_tile" },
            { name: "Magnetism Charm", description: "+1 Collectible Magnet", apply: () => this.collectableSpeed += 10, tile: "magnet" },
            {
                name: 'Ghostly Gratitude', description: "+20% XP Gain", apply: () => {
                    let increasePercentage = this.scoreGainPerCollectable * 0.2;
                    this.scoreGainPerCollectable += increasePercentage;
                }, tile: "greenXP"
            },
            {
                name: 'Magical Spread', description: "3 Projectile Spread", apply: () => {
                    // activate shootSpread() and deactivate shootBullet()
                    this.input.off('pointerdown', this.shootBullet, this);
                    this.input.on('pointerdown', this.shootSpread, this);
                    this.spreadActive = true;
                }, tile: "spreadShot"
            }
        ];
    }
    //send player to game over scene
    gameOver(level) {
        // make sure background music doesn't loop when player restarts game
        if (this.backgroundMusic) {
            this.irishBayMusic.stop();
            this.backgroundMusic = false; // Optional: Clear the reference if needed
        }
        
        //reset text on side of game
        document.getElementById('description').innerHTML = `<p></p>`
        this.scene.start('GameOverScene', { level: level });
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
        this.load.image("collectable", 'Tiles/laserBlue08.png'); // xp collectable
        this.load.image("instakill", 'Tiles/tile_0127.png');    // instant kill powerup
        this.load.image("doublexp", 'Tiles/tile_0089.png');    // double xp powerup
        this.load.image("damage_potion_tile", "Tiles/tile_0115.png");
        this.load.image("speed_potion_tile", "Tiles/tile_0113.png");
        this.load.image("hasty_tile", "Tiles/tile_0130.png");
        this.load.image("project_tile", "Tiles/tile_0118.png");
        this.load.image("burst_tile", "Tiles/tile_0062.png");
        this.load.image("healthCollectable", "Tiles/tile_0114.png");
        this.load.image("mana_tile", "Tiles/tile_0116.png");
        this.load.image("health_refill_tile", "Tiles/tile_0020.png");
        this.load.audio("shoot", "Audio/laserLarge_000.ogg");
        this.load.audio("levelUp", "Audio/powerUp11.ogg");
        this.load.audio("boss", "Audio/spaceEngineLarge_000.ogg");
        this.load.audio("hit", "Audio/lowDown.ogg");
        this.load.audio("die", "Audio/slime_001.ogg");
        this.load.audio("collect", "Audio/powerUp7.ogg");
        this.load.image('magnet', "Tiles/tile_0092.png");
        this.load.image("armored enemy", 'Tiles/tile_0087.png');
        this.load.image("knight enemy", 'Tiles/tile_0096.png');
        this.load.image("iFrameTile", 'Tiles/tile_0102.png');
        this.load.image("greenXP", 'Tiles/tile_0108.png');
        this.load.image("spreadShot", 'Tiles/tile_0041.png');
        this.load.image("rats", "Tiles/tile_0123.png");
        this.load.audio("irishBay", "Audio/irish-bay-213621.mp3");
        this.load.image("haunt", "Tiles/tile_0121.png");
        this.init();
        this.setPlayerInfoText();
    }

    init() {
        //chance to drop a health pack
        this.healthDropChance = 15;
        //chance to drop instant kill powerup
        this.instaKill = 5;
        //chance to drop double xp powerup
        this.doubleXP = 5;
        //set initial player values
        this.playerHealth = 10;
        this.maxHealth = 10;
        this.playerScore = 0;
        //how may points to level up
        this.scoreToLevel = 50;
        this.level = 1;
        //how fast the bullets travel
        this.bulletSpeed = 200;
        //how large the bullets areas
        this.bulletScale = .2;
        //how many bullets get shot each click
        this.numBullets = 1;
        //maximum number of bullets that can be on screen at a time
        this.maxBullets = 6;
        //amount of score gained per collectable pickup
        this.scoreGainPerCollectable = 10;
        this.doubleXPActive = false;
        this.originalXP = this.scoreGainPerCollectable;
        this.collectableSpeed = 0;

        this.mapWidth = 16 * 30;
        this.mapHeight = 16 * 30;
        this.playerSpeed = 1.25;
        this.SCALE = .75;

        this.cyclopsSCALE = 1.25;
        this.cyclopsSpawnRate = 2500;
        this.cyclopsHitsToDestroy = 3;
        this.cyclopsSpeed = 40;

        this.armoredEnemyScale = 1.25;
        this.armoredEnemySpawnRate = 5500;
        this.armoredEnemyHitsToDestroy = 15;
        this.armoredEnemySpeed = 20;

        this.knightScale = 1.75;
        this.knightHitsToDestroy = 200;
        this.knightSpeed = 10;

        this.damage = 1;
        this.originalDamage = this.damage;
        this.instaKillActive = false;
        this.enemyDamage = 1;

        this.invincibilityDuration = 200;

        this.darkWizardHitsToDestroy = 50;
        this.wizardSpeed = 20;

        this.spiderSpeed = 60;
        this.spiderHitsToDestory = 1;
        this.spiderSpawnRate = 2000;
        this.spiderSCALE = .50;

        this.ratSpeed = 40;
        this.ratHitsToDestroy = 1;
        this.ratSCALE = .7;

        this.hauntHitsToDestroy = 15;
        this.hauntHitsToDestroy = 12;
        this.hauntScale = 1.0;
        this.hauntSpeed = 0;

        this.spreadActive = false;
        // Create a group for bullets
        this.bullets = this.physics.add.group({
            defaultKey: 'bullet',
            maxSize: this.maxBullets,
            createCallback: (bullet) => {
                bullet.setAlpha(1); // Set transparency to 10%
            }
        });
        //group for wizard bullets
        this.darkWizardBullets = this.physics.add.group({
            defaultKey: "dark wizard bullet",
            maxSize: 1000
        });

    }
    create() {
        this.bossMusic = this.sound.add('boss', { loop: true, volume: 0.3 });
        
        // make sure background music doesn't loop everytime player dies
        if (!this.backgroundMusic) {
            this.irishBayMusic = this.sound.add('irishBay', { loop: true, volume: 0.1 })
            this.irishBayMusic.play();
            this.backgroundMusic = true;
        }
        

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
        this.cameras.main.setZoom(3.5);

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

        this.armoredEnemyGroup = this.physics.add.group();

        this.knightGroup = this.physics.add.group();

        this.ratGroup = this.physics.add.group();
        this.hauntGroup = this.physics.add.group();

        //new group for spider enemies
        this.spiderGroup = this.physics.add.group();

        //create a group for collectable stuff to be dropped when an enemy dies
        this.collectableGroup = this.physics.add.group();

        // makes group for health pickups
        this.healthGroup = this.physics.add.group();

        // makes group for instant kill powerup
        this.instaGroup = this.physics.add.group();

        // makes group for double xp powerup
        this.doubleGroup = this.physics.add.group();

        // Handle mouse click to shoot
        this.input.on('pointerdown', this.shootBullet, this);

        // Spawn an enemy cyclops 
        this.cyclopsSpawner = this.time.addEvent({
            delay: this.cyclopsSpawnRate,
            callback: () => this.spawnEnemy(this.cyclopsHitsToDestroy, this.cyclopsSCALE, this.cyclopsGroup, 'cyclops'),
            callbackScope: this,
            loop: true
        });
        this.spiderSpawner = this.time.addEvent({
            delay: this.spiderSpawnRate,
            callback: () => this.spawnEnemy(this.spiderHitsToDestory, this.spiderSCALE, this.spiderGroup, 'spider'),
            callbackScope: this,
            loop: true
        })
        //make dark wizards shoot
        this.time.addEvent({
            delay: 1000,
            callback: this.darkWizardShoot,
            callbackScope: this,
            loop: true
        })

        // Add collision detection between bullets and cyclops
        this.physics.add.overlap(this.bullets, this.cyclopsGroup, this.hitEnemy, null, this);
        //haunt enemy bullet collision
        this.physics.add.overlap(this.bullets, this.hauntGroup, this.hitEnemy, null, this);
        //add collision between bullets and wizards
        this.physics.add.overlap(this.bullets, this.darkWizardGroup, this.hitEnemy, null, this);
        //add collision between bullets and spider
        this.physics.add.overlap(this.bullets, this.spiderGroup, this.hitEnemy, null, this);
        //add collision between bullets and armored enemy
        this.physics.add.overlap(this.bullets, this.armoredEnemyGroup, this.hitEnemy, null, this);
        //add collision between bullets and knights
        this.physics.add.overlap(this.bullets, this.knightGroup, this.hitEnemy, null, this);
        //add collision between bullets and rats
        this.physics.add.overlap(this.bullets, this.ratGroup, this.hitEnemy, null, this);

        // Add collision detection between cyclops and player
        this.physics.add.overlap(my.sprite.player, this.cyclopsGroup, this.playerHitEnemy, null, this);
        //haunt enemy player collision
        this.physics.add.overlap(my.sprite.player, this.hauntGroup, this.playerHitEnemy, null, this);
        // Add collision detection between knight and player
        this.physics.add.overlap(my.sprite.player, this.knightGroup, this.playerHitEnemy, null, this);
        //add collision between armored enemies and player
        this.physics.add.overlap(my.sprite.player, this.armoredEnemyGroup, this.playerHitEnemy, null, this);
        // Add collision detection between rats and player
        this.physics.add.overlap(my.sprite.player, this.ratGroup, this.playerHitEnemy, null, this);
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

        this.physics.add.overlap(my.sprite.player, this.healthGroup, (player, healthCollectable) => {
            healthCollectable.destroy();
            if (this.playerHealth < this.maxHealth) {
                this.playerHealth += 1;
                this.sound.play('collect', {
                    volume: .1
                });
            }
        });

        this.physics.add.overlap(my.sprite.player, this.instaGroup, (player, instakill) => {
            instakill.destroy();
            
            if (!this.instaKillActive) {
                this.instaKillActive = true;
                this.originalDamage = this.damage;  // store current damage to go back to
                this.damage *= 10;

                console.log("Instant kill activated!");

                // Set a timer for 10 seconds for the duration of the instant kill power up
                this.time.delayedCall(10000, () => {
                    this.damage = this.originalDamage;   //reset to original damage
                    this.instaKillActive = false;
                    console.log("Instant kill deactivated.");
                }, [], this);
                
                this.sound.play('collect', {
                    volume: .1
                });
            }
        });

        this.physics.add.overlap(my.sprite.player, this.doubleGroup, (player, doublexp) => {
            doublexp.destroy();
            
            if (!this.doubleXPActive) {
                this.doubleXPActive = true;
                this.originalXP = this.scoreGainPerCollectable;  // store current xp gain to go back to
                this.scoreGainPerCollectable *= 2;

                console.log("Double XP activated!");

                // Set a timer for 10 seconds for the duration of the double xp power up
                this.time.delayedCall(10000, () => {
                    this.scoreGainPerCollectable = this.originalXP;   //reset to original xp gain
                    this.doubleXPActive = false;
                    console.log("Double XP deactivated.");
                }, [], this);
                
                this.sound.play('collect', {
                    volume: .1
                });
            }
        });

        this.pKey = this.input.keyboard.addKey('P');

        // debug key listener (assigned to F key)
        // this.input.keyboard.on('keydown-F', function () {
        //     this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
        //     this.physics.world.debugGraphic.clear()
        // }, this)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.pKey)) {
            this.scene.pause();
            this.scene.launch('pauseScene', {
                playerHealth: this.playerHealth,
                maxHealth: this.maxHealth,
                level: this.level,
                bulletSpeed: this.bulletSpeed,
                bulletScale: this.bulletScale,
                numBullets: this.numBullets,
                maxBullets: this.maxBullets,
                playerSpeed: this.playerSpeed,
                playerDamage: this.damage,
                scoreGainPerCollectable: this.scoreGainPerCollectable,
                collectableSpeed: this.collectableSpeed
            });
        }
        
        //update the score and level text
        this.setPlayerInfoText()
        if (this.playerScore >= this.scoreToLevel) {
            this.levelUp()
        }

        //make sure player isnt dead
        if (this.playerHealth === 0) {
            document.getElementById('description').innerHTML = `<h1>Player Health = 0<h1><h1>Player Score = ${this.playerScore}<h1>`
            this.bossMusic.stop();
            if (this.isBossMusicPlaying) {
                this.isBossMusicPlayer = false;
            }
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
        this.moveEnemyTowardsPlayer(this.cyclopsGroup, this.cyclopsSpeed);

        //make wizards move toward player
        this.moveEnemyTowardsPlayer(this.darkWizardGroup, this.wizardSpeed);

        //make spider move toward player
        this.moveEnemyTowardsPlayer(this.spiderGroup, this.spiderSpeed);

        //move knights toward player
        this.moveEnemyTowardsPlayer(this.knightGroup, this.knightSpeed);

        //move armored enemies toward player
        this.moveEnemyTowardsPlayer(this.armoredEnemyGroup, this.armoredEnemySpeed);
        this.moveEnemyTowardsPlayer(this.hauntGroup, this.hauntSpeed);

        //move rats towards player
        this.moveEnemyTowardsPlayer(this.ratGroup, this.ratSpeed);

        //play or stop the boss music based on dark wizard presence
        if (this.darkWizardGroup.countActive(true) > 0) {
            if (!this.isBossMusicPlaying) {
                this.irishBayMusic.stop();
                this.bossMusic.play();
                this.isBossMusicPlaying = true;
            }
        } else {
            if (this.isBossMusicPlaying) {
                
                this.bossMusic.stop();
                this.isBossMusicPlaying = false;
                this.irishBayMusic.play(); 
            }
        }
        this.collectableGroup.children.each(collectable => {
            if (collectable.active) {
                let direction = new Phaser.Math.Vector2(my.sprite.player.x - collectable.x, my.sprite.player.y - collectable.y);
                direction.normalize();
                collectable.setVelocity(direction.x * this.collectableSpeed, direction.y * this.collectableSpeed);
            }
        }, this);

        // this makes it so the magnet upgrade works on the health pickups
        // comment this out to make it stop working with the magnet upgrade
        // this.healthGroup.children.each(healthCollectable => {
        //     if (healthCollectable.active) {
        //         let direction = new Phaser.Math.Vector2(my.sprite.player.x - healthCollectable.x, my.sprite.player.y - healthCollectable.y);
        //         direction.normalize();
        //         healthCollectable.setVelocity(direction.x * this.collectableSpeed, direction.y * this.collectableSpeed);
        //     }
        // }, this);    
    }


    moveEnemyTowardsPlayer(enemyGroup, enemySpeed) {
        enemyGroup.children.each(enemy => {
            if (enemy.active) {
                let direction = new Phaser.Math.Vector2(my.sprite.player.x - enemy.x, my.sprite.player.y - enemy.y);
                direction.normalize();
                enemy.setVelocity(direction.x * enemySpeed, direction.y * enemySpeed);
            }
        }, this);
    }

    setPlayerInfoText() {
        document.getElementById('description').innerHTML = `
            <h1>Health = ${this.playerHealth}/${this.maxHealth}<h1>
            <h1>Your Level = ${this.level}<h1>
            <h1>%${parseInt((this.playerScore / this.scoreToLevel) * 100)} to level ${this.level + 1}<h1>
            <h1>Mana = ${this.maxBullets - this.bullets.getLength()}/${this.maxBullets}</h1>
            ${this.instaKillActive ? '<h1>Ultimate Damage Activated!</h1>' : ''}
            ${this.doubleXPActive ? '<h1>Double XP Activated!</h1>' : ''}`;
            
    }

    //function called whenever player levels up
    levelUp() {
        this.level += 1;
        // rat wave every 7 rounds
        if (this.level % 7 === 0) {
            this.spawnRatsInCircle();
        }
        //add a new enemy spawner at level 10
        if (this.level === 10) {
            //decrease health drop chance
            this.healthDropChance -= 5;
            //spawner for armored enemy
            this.armoredEnemySpawner = this.time.addEvent({
                delay: this.armoredEnemySpawnRate,
                callback: () => this.spawnEnemy(this.armoredEnemyHitsToDestroy, this.armoredEnemyScale, this.armoredEnemyGroup, "armored enemy"),
                callbackScope: this,
                loop: true
            })
        }
        //if level is above 5 have a chance to spawn a knight enemy 
        //if above level 12 always spawn a knight
        if (this.level > 5 && (Phaser.Math.Between(0, 100)) > 66) {
            if (this.level > 12) {//above level 12 spawn 1-3 knights
                for (let _ = 0; _ < (Phaser.Math.Between(2, 5)); _++) {
                    this.spawnEnemy(this.knightHitsToDestroy, this.knightScale, this.knightGroup, 'knight enemy')
                }
            } else {
                this.spawnEnemy(this.knightHitsToDestroy, this.knightScale, this.knightGroup, 'knight enemy')
            }
            this.knightHitsToDestroy *= 1.5;//increase knight health every level
        }

        //1/3 chance to spawn a haunt every level in a corner of the map
        if ((Phaser.Math.Between(0, 100)) > 66) {
            //whenever a haunt spawns cut player damage in half
            this.damage /= 2;
            this.spawnEnemy(this.hauntHitsToDestroy, this.hauntScale, this.hauntGroup, 'haunt');
            this.hauntHitsToDestroy*=1.5;
        }

        //for scaling for levels over 12
        if(this.level>=12){
           this.cyclopsSpawner.delay *= .90;
           this.spiderSpawner.delay *= .95;
           this.spiderHitsToDestory*=1.2
           this.cyclopsHitsToDestroy*=1.2
           this.armoredEnemySpawnRate*=.95
           this.armoredEnemyHitsToDestroy*=1.3
           this.hauntHitsToDestroy*=1.5;
        }

        //reset player score
        this.playerScore = 0;
        //increase time to level up to level 16
        if (this.level < 16) {
            this.scoreToLevel *= 1.25;
        }

        this.sound.play('levelUp', {
            volume: .3
        });
        //every 5 levels spawn that many dark wizards
        if (this.level % 5 === 0) {
            this.cyclopsSpeed *= 1.1;
            this.spiderSpeed *= 1.1;
            for (let i = 0; i < Math.floor(this.level / 5); i++) {
                this.spawnEnemy(this.darkWizardHitsToDestroy, this.cyclopsSCALE * 1.5, this.darkWizardGroup, 'dark wizard')
            }
            this.darkWizardHitsToDestroy *= 2;
        }

        // Select two distinct random upgrades
        let selectedUpgrades = [];
        while (selectedUpgrades.length < 2) {
            let randomUpgrade = Phaser.Utils.Array.GetRandom(this.upgrades);
            //stop showing bullet scale upgrade after getting it twice
            if (this.bulletScale >= .6 && randomUpgrade.name === 'Projectile Magnification Potion') {
                continue;
            }
            // stop showing spread upgrade if already chosen
            if (this.spreadActive === true && randomUpgrade.name === 'Magical Spread') {
                continue;
            }
            /* stop showing extra bullet if already have 5
            if (this.numBullets >= 5 && randomUpgrade.name === 'Tome of Burst Shot') {
                continue;
            }
                */
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

    spawnEnemy(hitsToDestroy, scale, enemyGroup, imageKey) {
        let positions;
        //if the enemy is a haunt spawn it in a corner
        if (imageKey === 'haunt') {
            positions = [
                { x: this.mapWidth - 100, y: this.mapHeight - 80 },
                { x: 100, y: 100 },
                { x: this.mapWidth - 100, y: 80 },
                { x: 100, y: this.mapHeight - 80 }
            ]
            //change bullet image to show that its weaker
            this.bullets.createCallback = (bullet) => {
                bullet.setAlpha(.4);
            }
        } else {
            positions = [
                { x: Phaser.Math.Between(-50, 0), y: Phaser.Math.Between(0, this.mapHeight) },
                { x: Phaser.Math.Between(this.mapWidth, this.mapWidth + 50), y: Phaser.Math.Between(0, this.mapHeight) },
                { x: Phaser.Math.Between(0, this.mapWidth), y: Phaser.Math.Between(-50, 0) },
                { x: Phaser.Math.Between(0, this.mapWidth), y: Phaser.Math.Between(this.mapHeight, this.mapHeight + 50) }
            ];
        }

        let pos = Phaser.Utils.Array.GetRandom(positions);
        let enemy = enemyGroup.create(pos.x, pos.y, imageKey);
        enemy.setScale(scale);
        enemy.setActive(true);
        enemy.setVisible(true);
        enemy.body.setAllowGravity(false);
        enemy.hitsLeft = hitsToDestroy
    }

    enemyDeath(enemy) {
        //console.log(enemy.texture.key);
        // determine drop type based on random chance
        let dropType = Phaser.Math.Between(0, 105);
        if (enemy.texture.key === 'haunt') {
            console.log(this.hauntGroup.getLength())
            //if haunt was killed increase the damage
            
            //reset bullet image if no more haunts
            if (this.hauntGroup.getLength() === 1) {
                this.bullets.defaultKey = 'bullet';
                this.bullets.createCallback = (bullet) => {
                    bullet.setAlpha(1);
                }
            }
        }
        // 80%-90% droprate for upgrade collectable, 10%-15% droprate for health
        if (!(enemy.texture.key === 'rats')){
            if (dropType < 100 - this.healthDropChance) {
                let collectable = this.collectableGroup.create(enemy.x, enemy.y, 'collectable');
                collectable.setActive(true);
                collectable.setVisible(true);
                collectable.body.setAllowGravity(false);
                collectable.setScale(.2);
            }
            else if (dropType >= 100 && dropType < 102) {
                let instaCollectable = this.instaGroup.create(enemy.x, enemy.y, 'instakill');
                instaCollectable.setActive(true);
                instaCollectable.setVisible(true);
                instaCollectable.body.setAllowGravity(false);
                instaCollectable.setScale(0.75);

                // Create a delayed call to start the blinking effect after 3 seconds
                this.time.delayedCall(3000, () => {
                    this.tweens.add({
                        targets: instaCollectable,
                        alpha: 0, // Fade out to completely transparent
                        ease: 'Linear', // Use a linear easing function for a constant fade rate
                        duration: 500, // Duration of one fade in/out cycle
                        repeat: 6, // Number of times the tween repeats
                        yoyo: true, // Fade back in after fading out
                        onComplete: () => {
                            instaCollectable.destroy(); // Destroy the object once the tween is complete
                        }
                    });
                }, [], this);

                // Set a timer to destroy the health collectable after 7 seconds
                this.time.delayedCall(7000, () => {
                    if (instaCollectable.active) {
                        instaCollectable.destroy();
                    }
                }, [], this);
            }
            else if (dropType >= 103) {
                let doubleCollectable = this.doubleGroup.create(enemy.x, enemy.y, 'doublexp');
                doubleCollectable.setActive(true);
                doubleCollectable.setVisible(true);
                doubleCollectable.body.setAllowGravity(false);
                doubleCollectable.setScale(0.75);

                // Create a delayed call to start the blinking effect after 3 seconds
                this.time.delayedCall(3000, () => {
                    this.tweens.add({
                        targets: doubleCollectable,
                        alpha: 0, // Fade out to completely transparent
                        ease: 'Linear', // Use a linear easing function for a constant fade rate
                        duration: 500, // Duration of one fade in/out cycle
                        repeat: 6, // Number of times the tween repeats
                        yoyo: true, // Fade back in after fading out
                        onComplete: () => {
                            doubleCollectable.destroy(); // Destroy the object once the tween is complete
                        }
                    });
                }, [], this);

                // Set a timer to destroy the health collectable after 7 seconds
                this.time.delayedCall(7000, () => {
                    if (doubleCollectable.active) {
                        doubleCollectable.destroy();
                    }
                }, [], this);
            }
            else {
                let healthCollectable = this.healthGroup.create(enemy.x, enemy.y, 'healthCollectable');
                healthCollectable.setActive(true);
                healthCollectable.setVisible(true);
                healthCollectable.body.setAllowGravity(false);
                healthCollectable.setScale(0.75);

                // Create a delayed call to start the blinking effect after 3 seconds
                this.time.delayedCall(3000, () => {
                    this.tweens.add({
                        targets: healthCollectable,
                        alpha: 0, // Fade out to completely transparent
                        ease: 'Linear', // Use a linear easing function for a constant fade rate
                        duration: 500, // Duration of one fade in/out cycle
                        repeat: 6, // Number of times the tween repeats
                        yoyo: true, // Fade back in after fading out
                        onComplete: () => {
                            healthCollectable.destroy(); // Destroy the object once the tween is complete
                        }
                    });
                }, [], this);

                // Set a timer to destroy the health collectable after 7 seconds
                this.time.delayedCall(7000, () => {
                    if (healthCollectable.active) {
                        healthCollectable.destroy();
                    }
                }, [], this);
            }
        }
        if (enemy.texture.key === 'haunt') {
            console.log(this.hauntGroup.getLength())
            //if haunt was killed increase the damage
            this.damage *= 2
            //reset bullet image if no more haunts
            if (this.hauntGroup.getLength() === 1) {
                this.bullets.defaultKey = 'bullet';
                this.bullets.createCallback = (bullet) => {
                    bullet.setAlpha(1);
                }
            }
        }

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
        this.scene.stop('wizardScene');
        this.scene.start('GameOverScene', { level: level });

    }
    
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

    shootSpread(pointer) {
        const spreadAngle = 30;
        let player = my.sprite.player;

        let baseAngle = Phaser.Math.Angle.Between(player.x, player.y, pointer.worldX, pointer.worldY);

        for (let i = 0; i < this.numBullets; i++) {
            // Calculate delay for each bullet
            //let delay = i * 100; // Delay each bullet by 100ms incrementally
            
            let bullet = this.bullets.get(player.x, player.y);
            if (bullet) {
                bullet.displayWidth = bullet.width * this.bulletScale;
                bullet.displayHeight = bullet.height * this.bulletScale;

                bullet.setActive(true);
                bullet.setVisible(true);
                
                // find offset for each bullet
                let angleOffset = (i - Math.floor(this.numBullets / 2)) * Phaser.Math.DegToRad(spreadAngle);
                let finalAngle = baseAngle + angleOffset;
                let direction = new Phaser.Math.Vector2(Math.cos(finalAngle), Math.sin(finalAngle));

                // Set bullet velocity based on direction
                let bulletSpeed = this.bulletSpeed;
                bullet.body.velocity.x = direction.x * bulletSpeed;
                bullet.body.velocity.y = direction.y * bulletSpeed;
                this.sound.play('shoot', {
                    volume: 0.1
                });
            }
        }
    }

    spawnRatsInCircle() {
        const numRats = 100 * (this.level/7); // Number of rats to spawn
        const radius = 400; // Radius of the circle
        const centerX = my.sprite.player.x;
        const centerY = my.sprite.player.y;
    
        for (let i = 0; i < numRats; i++) {
            const angle = (2 * Math.PI / numRats) * i;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
    
            let rat = this.ratGroup.create(x, y, 'rats');
            rat.setScale(this.ratSCALE);
            rat.hitsLeft = this.ratHitsToDestroy;
            rat.setCollideWorldBounds(true);
            
            // Make rats move towards the player
            const direction = new Phaser.Math.Vector2(centerX - x, centerY - y).normalize();
            rat.setVelocity(direction.x * this.ratSpeedSpeed, direction.y * this.ratSpeedSpeed); // Adjust speed if necessary
        }
    }
    
}