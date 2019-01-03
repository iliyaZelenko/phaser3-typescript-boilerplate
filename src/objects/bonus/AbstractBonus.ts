import GameScene from '~/scenes/gameScene'

export default class AbstractBonus {
  protected readonly scene: GameScene

  constructor (scene) {
    this.scene = scene
  }

  protected onCollisionWithSnake () {
    this.scene.overlay.incrementApplesCounter()
    this.scene.overlay.updateSnakeLength()
  }
}
