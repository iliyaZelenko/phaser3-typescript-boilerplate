export const gameContainer: HTMLElement | null = document.querySelector('#game__canvas-wrap')
export const contW = window.innerWidth
export const contH = window.innerHeight
export const ceil = 24
// todo подумать
export const snakeSize = ceil // * window.snakeCeilsSize
export const ceilsXCount = Math.floor(contW / ceil) / 2 // - 1
export const ceilsYCount = Math.floor(contH / ceil) / 2
export const gameWidth = ceilsXCount * ceil
export const gameHeight = ceilsYCount * ceil
export const dephs = {
  background: -2,
  apple: -1,
  text: 1
}
