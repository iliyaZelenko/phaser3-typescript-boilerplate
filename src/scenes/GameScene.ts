import AppleBonus from '~/objects/bonus/AppleBonus'
import Snake from '~/objects/snake'
import { ceilsXCount, ceilsYCount, ceil, gameWidth, gameHeight, dephs } from '~/config'
import Overlay from '~/overlay/Overlay'
import Timer from '~/overlay/Timer'
import LocalStorage from '~/storage/LocalStorage'
import AbstractStorage from '~/storage/AbstractStorage'

// TODO генерация препядствий
export default class GameScene extends Phaser.Scene {
  // TODO on resize менять
  public readonly snakeStartX = this.getCeilXPos(ceilsXCount / 2)
  public readonly snakeStartY = this.getCeilYPos(ceilsYCount / 2)

  public snake!: Snake
  public overlay!: Overlay
  public timer!: Timer
  public storage!: AbstractStorage

  private worldIterations = 0
  // TODO хранить в массиве сами бонусы, потом проходится по ним для получения позиций
  private bonusesPositions: any[] = []

  // texts
  private fpsText!: Phaser.GameObjects.BitmapText
  private cursors!: Phaser.Input.Keyboard.CursorKeys

  constructor () {
    super({
      key: 'GameScene'
    })
  }

  // TODO походу из init перенести в create (init каждый раз при появлении сцены) Хотя create тоже вроде 2 раза
  public init (): void {
    this.snake = new Snake(this)
    this.overlay = new Overlay(this)
    this.timer = new Timer(() => {
      this.overlay.updateTimer()
    })
    this.storage = new LocalStorage()

    // input
    this.cursors = this.input.keyboard.createCursorKeys()

    this.addFPSText()
    this.addEventsListeners()
  }

  public create (): void {
    const sprite = this.add.tileSprite(0, 0, gameWidth * 2, gameHeight * 2, 'background')

    sprite.setDepth(dephs.background)
  }

  // time - elapsed time in milliseconds (pause does not affect!)
  public update (time): void {
    // TODO с уровнем сложности (наверное зависит от таймера) значения меняются
    const snakeMoveIterationsRange = 10
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

    this.fpsText.setText(this.getFPS())

    if (this.snake.isDead()) {
      this.onDead()
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

    const apple = new AppleBonus(this, ceilPos)

    this.bonusesPositions.push({ ...ceilPos, bonus: apple })
  }

  private checkCollision (): void {
    this.checkTakeBonus()
    this.checkTaran()
  }

  private getRandomInt (min: number, max: number): number {
    // let rand = min - 0.5 + Math.random() * (max - min + 1)
    //
    // rand = Math.round(rand)
    //
    // return rand

    return Phaser.Math.RND.between(min, max)
  }

  private addEventsListeners () {
    this.input.keyboard.on('keydown', ({ key }) => {
      this.snake.setDir(
        this.getDirByInput(key)
      )
    })
    this.events.on('pause', () => {
      this.timer.pause()
    })
    this.events.on('resume', () => {
      this.timer.resume()
    })
    this.events.on('swipe', (dir) => {
      this.snake.setDir(dir)
    })
  }

  private onDead () {
    const score = this.overlay.getApplesCounter()
    const maxScore = this.storage.get('max-score')

    if (score > maxScore || maxScore === undefined) {
      this.storage.set('max-score', score)
    }

    this.scene.start('MainMenuScene')
  }

  private getFPS () {
    return 'FPS: ' + window.game.loop.actualFps.toFixed(0).toString()
  }

  private addFPSText () {
    this.fpsText = this.add.bitmapText(
      2,
      2,
      'main-font',
      this.getFPS(),
      8
    )
    .setDepth(dephs.text)
    .setVisible(false) // change if necessary
  }
}
