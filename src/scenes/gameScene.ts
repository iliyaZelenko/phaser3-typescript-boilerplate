import { Apple } from '~/objects/apple'
import { Snake } from '~/objects/snake'
import { CONST } from '~/const/const'
import { ceilsXCount, ceilsYCount, ceil, gameWidth, gameHeight, dephs } from '~/config'

export class GameScene extends Phaser.Scene {
  // TODO on resize менять
  public readonly snakeStartX = this.getCeilXPos(ceilsXCount / 2)
  public readonly snakeStartY = this.getCeilYPos(ceilsYCount / 2)
  public readonly gameWidth = gameWidth // this.sys.canvas.height
  public readonly gameHeight = gameHeight // this.sys.canvas.width

  // private worldIntervalFrequency = 60 // 30
  // private worldInterval = null
  private worldIterations = 0
  private bonusesPositions: any[] = []
  // private bonusesPositionsSprites: Phaser.GameObjects.Sprite[] = []

  // objects
  private snake!: Snake
  // private apple: Apple
  // private gameBorder: Phaser.GameObjects.Graphics[] = []

  // texts
  private fpsText!: Phaser.GameObjects.BitmapText
  private cursors!: Phaser.Input.Keyboard.CursorKeys

  constructor () {
    super({
      key: 'GameScene'
    })

    // this.snake = new Snake(this)
    // this.apple = new Apple(this, {
    //   xPos: this.rndXPos(),
    //   yPos: this.rndYPos(),
    //   fSize: this.ceil
    // })
  }

  public init (): void {
    this.snake = new Snake(this)

    // input
    this.cursors = this.input.keyboard.createCursorKeys()

    // text
    // this.scoreText =
    this.add.bitmapText(
      this.gameWidth / 2,
      1,
      'main-font',
      CONST.SCORE.toString(),
      8
    )

    this.fpsText = this.add.bitmapText(
      2,
      2,
      'main-font',
      this.getFPS(),
      8
    )
    this.fpsText.setDepth(dephs.text)

    this.input.keyboard.on('keydown', ({ key }) => {
      this.snake.setDir(
        this.getDirByInput(key)
      )
    })
    this.events.on('swipe', (dir) => {
      this.snake.setDir(dir)
    })
  }

  public create (): void {
    const sprite = this.add.tileSprite(0, 0, this.gameWidth * 2, this.gameHeight * 2, 'background')

    sprite.setDepth(dephs.background)

    // objects
    // let i = 0
    // for (let x = 0; x < this.ceilsXCount; x++) {
    //   for (let y = 0; y < this.ceilsYCount; y++) {
    //     if (
    //       y === 0 ||
    //       y === this.gameHeight / this.ceil - 1 ||
    //       x === 0 ||
    //       x === this.gameWidth / this.ceil - 1
    //     ) {
    //       this.gameBorder[i] = this.add
    //         .graphics({
    //           x: -this.ceil + x * this.ceil,
    //           y: -this.ceil + y * this.ceil,
    //           fillStyle: { color: 0x61e85b, alpha: 0.3 }
    //         })
    //         .fillRect(
    //           this.ceil,
    //           this.ceil,
    //           this.ceil,
    //           this.ceil
    //         )
    //       i++
    //     }
    //   }
    // }
  }

  // TODO addBonus камера
  // плавное движение
  // столкновения
  // генерация препядствий
  // как ест яблоко

  // time - прошедшее время в милисекундах (пауза не влияет!!! TODO TODO)
  public update (time): void {
    const snakeMoveIterationsRange = 25
    const bonusIterationsRange = 50

    this.worldIterations += 1

    if (this.worldIterations % bonusIterationsRange === 0) {
      this.addBonus()
    }
    if (this.worldIterations % snakeMoveIterationsRange === 0) {
      this.handleInput()
      this.snake.move()

      this.checkCollision()
    }

    // if (time % 1000 === 0) {
    const el = document.querySelector('#overlay__time')
    if (el) {
      el.textContent = Math.round(time / 1000).toString()
    }

    this.fpsText.setText(this.getFPS())
    // }

    if (this.snake.isDead()) {
      this.scene.start('MainMenuScene')
    }
  }

  public handleInput (): void {
    const wantMoveDir = this.getDirByInput()

    this.snake.setDir(wantMoveDir)
  }

  public getDirByInput (presedKey?) {
    const input = {
      // Format: [button]: key
      [this.snake.DIRECTIONS.UP]: ['w', 'ArrowUp'],
      [this.snake.DIRECTIONS.RIGHT]: ['d', 'ArrowRight'],
      [this.snake.DIRECTIONS.DOWN]: ['s', 'ArrowDown'],
      [this.snake.DIRECTIONS.LEFT]: ['a', 'ArrowLeft']
    }

    // Same as below:
    for (const [button, keys] of Object.entries(input)) {
      if ((this.cursors[button] && this.cursors[button].isDown) || keys.includes(presedKey)) {
        return button
      }
    }
    // Same as above:
    // switch (true) {
    //   case (this.cursors.up && this.cursors.up.isDown) || presedKey === 'w':
    //     return this.snake.DIRECTIONS.UP
    //   case (this.cursors.right && this.cursors.right.isDown) || presedKey === 'd':
    //     return this.snake.DIRECTIONS.RIGHT
    //   case (this.cursors.down && this.cursors.down.isDown) || presedKey === 's':
    //     return this.snake.DIRECTIONS.DOWN
    //   case (this.cursors.left && this.cursors.left.isDown) || presedKey === 'a':
    //     return this.snake.DIRECTIONS.LEFT
    // }
  }

  public getRandomCeil () {
    return this.getCeilFullPos(
      this.getRandomInt(1, ceilsXCount), this.getRandomInt(1, ceilsYCount)
    )
  }

  /**
   * Get ceil x coordinate by index
   * @param index (from 1, not 0)
   */
  public getCeilXPos (index: number): number {
    return index * ceil - (ceil / 2)
  }

  /**
   * Get ceil y coordinate by index
   * @param index (from 1, not 0)
   */
  public getCeilYPos (index: number): number {
    return index * ceil - (ceil / 2)
  }

  public getCeilFullPos (xIndex, yIndex) {
    return {
      x: this.getCeilXPos(xIndex),
      y: this.getCeilYPos(yIndex)
    }
  }

  private checkTaran () {
    const taran = this.snake.bodyPartsPositions
      .slice(0, -1)
      .find(i =>
        i.x === this.snake.snakeHeadX && i.y === this.snake.snakeHeadY
      )

    this.snake.setDead(taran)
  }

  private checkTakeBonus () {
    const snakeHalfSize = this.snake.size / 2

    const bonusPos = this.bonusesPositions.find(({ x: bonusX, y: bonusY }) =>
      this.snake.bodyPartsPositions.some(({ x: bodyX, y: bodyY }: any) =>
        bonusX >= bodyX - snakeHalfSize &&
        bonusY >= bodyY - snakeHalfSize &&
        bonusX <= bodyX + snakeHalfSize &&
        bonusY <= bodyY + snakeHalfSize
      )
    )

    if (bonusPos) {
      this.bonusesPositions = this.bonusesPositions.filter(i => i !== bonusPos)
      const bonus = bonusPos.bonus

      bonus.onCollisionWithSnake()
      this.snake.onTakenBonus(bonus)
    }
  }

  // TODO bonus does not appear on the snake
  private addBonus () {
    const ceilPos = this.getRandomCeil()

    const apple = new Apple(this, ceilPos)

    this.bonusesPositions.push({ ...ceilPos, bonus: apple })
  }

  private checkCollision (): void {
    this.checkTakeBonus()
    this.checkTaran()
  }

  private getFPS () {
    return 'FPS: ' + window.game.loop.actualFps.toFixed(0).toString()
  }

  private getRandomInt (min: number, max: number): number {
    // let rand = min - 0.5 + Math.random() * (max - min + 1)
    //
    // rand = Math.round(rand)
    //
    // return rand

    return Phaser.Math.RND.between(min, max)
  }
}
