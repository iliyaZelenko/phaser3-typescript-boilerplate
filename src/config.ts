import BootScene from '~/Scenes/bootScene'
import MainMenuScene from '~/scenes/MainMenuScene'
import GameScene from '~/scenes/GameScene'

import SwipePlugin from 'phaser3-swipe-plugin'

export const gameContainer: HTMLElement = document.querySelector('#game') || document.body
const gameContainerW = gameContainer.getBoundingClientRect().width // window.innerWidth
const gameContainerH = gameContainer.getBoundingClientRect().height // window.innerHeight

export const canvasContainer: HTMLElement | null = document.querySelector('#game__canvas-wrap')
export const ceil = 24
export const snakeSize = ceil
export const ceilsXCount = getCeilsCountBy(gameContainerW) // - 1 (if scroll)
export const ceilsYCount = getCeilsCountBy(gameContainerH)
export const gameWidth = ceilsXCount * ceil
export const gameHeight = ceilsYCount * ceil
export const dephs = {
  background: -2,
  apple: -1,
  text: 10,
  overlayRectangle: 9
}

export const overlay: HTMLElement | null = document.querySelector('#game__overlay')
export const pauseBtn: HTMLElement | null = document.querySelector('#pause-btn')
export const restartBtn: HTMLElement | null = document.querySelector('#restart-btn')
export const debugBtn: HTMLElement | null = document.querySelector('#debug-btn')
export const debugGrid: HTMLElement | null = document.querySelector('#game__grid')

const gameConfig: GameConfig = {
  width: gameWidth,
  height: gameHeight,
  // zoom: 3,
  type: Phaser.AUTO,
  parent: canvasContainer || undefined,
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
        start: true,
        data: {
          offset: 123
        }
      }
    ]
  }
}

export default gameConfig



function getCeilsCountBy (pixelsCount) {
  const count = Math.floor(pixelsCount / ceil)

  // if (count > 30) {
  //   return Math.floor(count * .8)
  // }

  return count
}
