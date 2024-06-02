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
    preload() {
        this.load.setPath("./assets/");
        this.load.image("tilemap_tiles", "Tilemap/tilemap_packed.png");                         // Packed tilemap
        this.load.tilemapTiledJSON("Background-Map", "Background-Map.tmj");   // Tilemap in JSON
        this.load.image("player", "Tiles/tile_0084.png"); // Load player sprite
        this.playerHealth = 10;
        this.playerScore = 10;
        //load background
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
    }
    update() {
        if (this.playerHealth === 0) {
            this.gameOver(this.playerScore);
        }
        if(cursors.left.isDown){
            this.my.sprite.player.x -= this.playerSpeed;
            if (this.my.sprite.player.x<this.my.sprite.player.width) {
                this.my.sprite.player.x = this.my.sprite.player.width;
            }
        }
        if(cursors.right.isDown){
            this.my.sprite.player.x += this.playerSpeed;
            if (this.my.sprite.player.x>this.mapWidth - this.my.sprite.player.width) {
                this.my.sprite.player.x = this.mapWidth - this.my.sprite.player.width;
            }
        }
        if(cursors.up.isDown){
            this.my.sprite.player.y -= this.playerSpeed;
            if (this.my.sprite.player.y<this.my.sprite.player.height) {
                this.my.sprite.player.y = this.my.sprite.player.height;
            }
        }
        if(cursors.down.isDown){
            this.my.sprite.player.y += this.playerSpeed;
            if (this.my.sprite.player.y>this.mapHeight - this.my.sprite.player.height) {
                this.my.sprite.player.y = this.mapHeight - this.my.sprite.player.height;
            }
        }
    }
}