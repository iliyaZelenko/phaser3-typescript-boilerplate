import 'phaser'
import { BootScene } from '~/scenes/bootScene'
import { MainMenuScene } from '~/scenes/mainMenuScene'
import { GameScene } from '~/scenes/gameScene'
// TODO install my plugin here
import SwipePlugin from '../../phaser3-swipe-plugin/src'
import { gameContainer, gameWidth, gameHeight } from '~/config'
import '~/styles/main.sass'

// window.gameContainer = document.querySelector('#game')
// window.contW = window.innerWidth // (window.gameContainer && window.gameContainer.offsetWidth) || window.innerWidth // window.gameContainer
// window.contH = window.innerHeight // (window.gameContainer && window.gameContainer.offsetHeight) || window.innerHeight // window.gameContainer
// window.ceil = 24
// // window.snakeCeilsSize = 8
// window.snakeSize = window.ceil // * window.snakeCeilsSize
// window.ceilsXCount = Math.floor(window.contW / window.ceil) // - 1
// window.ceilsYCount = Math.floor(window.contH / window.ceil)
// window.gameWidth = window.ceilsXCount * window.ceil
// window.gameHeight = window.ceilsYCount * window.ceil

// TODO сделать свою змейку на Phaser и сделать с ней boilerplate starter для гитхаба (TS + Phaser).
const config: GameConfig = {
  width: gameWidth,
  height: gameHeight,
  // zoom: 3,
  type: Phaser.AUTO,
  parent: gameContainer || undefined,
  scene: [BootScene, MainMenuScene, GameScene],
  // input: {
  //   keyboard: true,
  //   mouse: true,
  //   touch: true,
  //   gamepad: false
  // },
  fps: {
    target: 144,
    min: 60
  },
  backgroundColor: '#000000',
  plugins: {
    global: [
      {
        key: 'SwipePlugin',
        plugin: SwipePlugin,
        start: true
        // data: {
        //   offset: 123
        // }
      }
    ]
  }
}

export class Game extends Phaser.Game {
  constructor (GameConfig: GameConfig) {
    super(GameConfig)
  }
}

window.addEventListener('load', () => {
  // @ts-ignore
  window.game = new Game(config)
})
// window.addEventListener('resize', () => {
//   game.resize(window.innerWidth, window.innerHeight)
// })

const pauseBtn = document.querySelector('#pause-btn')
const debugBtn = document.querySelector('#debug-btn')
const debugGrid: HTMLElement | null = document.querySelector('#game__grid')

if (pauseBtn) {
  pauseBtn.addEventListener('click', () => {
    const scene = window.game.scene.getScene('GameScene')
    const method = scene.sys.isPaused() ? 'resume' : 'pause'

    scene.sys[method]()
  })
}
if (debugBtn) {
  debugBtn.addEventListener('click', () => {
    if (debugGrid) {
      const hidden = debugGrid.dataset.hide === '1'

      // '0' or '1'
      debugGrid.dataset.hide = (+!hidden).toString()
      debugGrid.classList.toggle('game__grid--hidden', hidden)
    }
  })
}
