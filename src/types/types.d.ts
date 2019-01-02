import { Game } from '~/game'

declare global {
  interface Window {
    game: Game
    gameContainer: HTMLElement | null
    contW: number
    contH: number
    ceil: number
    snakeCeilsSize: number
    ceilsXCount: number
    ceilsYCount: number
    gameWidth: number
    gameHeight: number
    snakeSize: number
  }
}
