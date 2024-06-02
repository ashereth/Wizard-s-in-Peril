class GameOverScene extends Phaser.Scene {
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        this.score = data.score;
    }

    create() {
        // Display "Game Over" text
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, `Game Over. Score = ${this.score}`, {
            fontSize: '64px',
            fill: '#FFFFFF'
        }).setOrigin(0.5);

        // Add a button or text to restart the game
        const restartButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Restart', {
            fontSize: '32px',
            fill: '#FF0000'
        }).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.start('wizardScene');
        });
    }
}
