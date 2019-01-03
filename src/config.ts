import BootScene from '~/Scenes/bootScene'
import MainMenuScene from '~/scenes/MainMenuScene'
import GameScene from '~/scenes/GameScene'

// TODO install my plugin here
import SwipePlugin from '../../phaser3-swipe-plugin/src'

const windowW = window.innerWidth
const windowH = window.innerHeight

export const gameContainer: HTMLElement | null = document.querySelector('#game__canvas-wrap')
// export const contW = window.innerWidth
// export const contH = window.innerHeight
export const ceil = 24
export const snakeSize = ceil
export const ceilsXCount = Math.floor(windowW / ceil) / 2 // - 1 (if scroll)
export const ceilsYCount = Math.floor(windowH / ceil) / 2
export const gameWidth = ceilsXCount * ceil
export const gameHeight = ceilsYCount * ceil
export const dephs = {
  background: -2,
  apple: -1,
  text: 10,
  overlayRectangle: 9
}

const gameConfig: GameConfig = {
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

export default gameConfig
