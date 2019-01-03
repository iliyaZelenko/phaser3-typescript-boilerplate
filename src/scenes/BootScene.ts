export default class BootScene extends Phaser.Scene {
  constructor () {
    super({
      key: 'BootScene'
    })
  }

  public update (): void {
    this.scene.start('MainMenuScene')
  }

  public preload (): void {
    this.load.bitmapFont(
      'main-font',
      'assets/font/snakeFont.png',
      'assets/font/snakeFont.fnt'
    )
    this.load.spritesheet('snake', 'assets/sprites/snake.png', {
      frameWidth: 64
      // frameHeight: 64
    })
    this.load.image('background', 'assets/sprites/background.png')
    this.load.image('timer', 'assets/sprites/timer.png')
  }
}
