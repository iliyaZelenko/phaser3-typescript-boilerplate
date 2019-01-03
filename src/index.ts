import 'phaser'
import '~/styles/main.sass'
import gameConfig from '~/config'
import Game from '~/Game'

window.addEventListener('load', () => {
  window.game = new Game(gameConfig)
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
