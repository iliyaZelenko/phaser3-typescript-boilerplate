import AbstractStorage from '~/storage/AbstractStorage'
import LocalStorage from '~/storage/LocalStorage'

export default class MainMenuScene extends Phaser.Scene {
  public storage!: AbstractStorage
  private startKey?: Phaser.Input.Keyboard.Key
  private bitmapTexts: Phaser.GameObjects.BitmapText[] = []
  private highscore: string | number = 2

  constructor () {
    super({
      key: 'MainMenuScene'
    })
  }

  public init (): void {
    this.storage = new LocalStorage()
  }

  public create (): void {
    this.startKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.S
    )

    this.highscore = this.storage.get('max-score') // || 'You have no record'

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 105,
        this.sys.canvas.height / 2 - 90,
        'main-font',
        'S N A K E',
        24
      )
    )

    this.bitmapTexts.push(
      this.add.bitmapText(
        this.sys.canvas.width / 2 - 28,
        this.sys.canvas.height / 2 + 10,
        'main-font',
        'S: PLAY',
        8
      )
    )

    if (this.highscore !== null) {
      this.bitmapTexts.push(
        this.add.bitmapText(
          this.sys.canvas.width / 2 - 45,
          this.sys.canvas.height / 2 + 50,
          'main-font',
          'HIGHSCORE: ' + this.highscore,
          8
        )
      )
    }
  }

  public update (): void {
    if (this.startKey && this.startKey.isDown) {
      this.scene.start('GameScene')
    }
  }
}
