import { CONST } from '../const/const'

export class MainMenuScene extends Phaser.Scene {
  private startKey?: Phaser.Input.Keyboard.Key
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = []

  constructor () {
    super({
      key: 'MainMenuScene'
    })

    // this.startKey = this.input.keyboard.addKey(
    //   Phaser.Input.Keyboard.KeyCodes.S
    // )
  }

  public init (): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    )

    if (CONST.SCORE > CONST.HIGHSCORE) {
      CONST.HIGHSCORE = CONST.SCORE
    }
    CONST.SCORE = 0
  }

  public preload (): void {
    this.load.bitmapFont(
      'main-font',
      'assets/font/snakeFont.png',
      'assets/font/snakeFont.fnt'
    )

    // image
    this.load.spritesheet('snake', 'assets/sprites/snake.png', {
      frameWidth: 64
      // frameHeight: 64
    })
    // image
    this.load.image('background', 'assets/sprites/g.png')
  }

  public create (): void {
    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 28,
        this.sys.canvas.height / 2 - 10,
        'main-font',
        'S: PLAY',
        8
      )
    )

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 70,
        this.sys.canvas.height / 2 - 60,
        'main-font',
        'S N A K E',
        16
      )
    )

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 45,
        this.sys.canvas.height / 2 + 30,
        'main-font',
        'HIGHSCORE: ' + CONST.HIGHSCORE,
        8
      )
    )
  }

  public update (): void {
    if (this.startKey && this.startKey.isDown) {
      this.scene.start('GameScene')
    }
  }
}
