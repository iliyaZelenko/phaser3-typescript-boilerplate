import { ceil, dephs } from '~/config'
import { GameScene } from '~/scenes/gameScene'

// extends Phaser.GameObjects.Graphics
export class Apple {
  private readonly scene: GameScene
  private readonly x: number
  private readonly y: number
  private readonly sprite: Phaser.GameObjects.Sprite

  constructor (scene, { x, y }) {
    this.scene = scene

    this.x = x
    this.y = y

    this.sprite = this.scene.add.sprite(this.x, this.y, 'snake', 15)

    // setSize это другое
    this.sprite.setDisplaySize(ceil, ceil)
    this.sprite.setDepth(dephs.apple)
  }

  public getSprite (): Phaser.GameObjects.Sprite {
    return this.sprite
  }

  // TODO возможно сделать через паттерн события
  public onCollisionWithSnake () {
    const sprite = this.getSprite()

    sprite.destroy()
  }
}
