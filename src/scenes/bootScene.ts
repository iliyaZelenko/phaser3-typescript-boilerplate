export class BootScene extends Phaser.Scene {
  constructor () {
    super({
      key: 'BootScene'
    })
  }

  public update (): void {
    this.scene.start('MainMenuScene')
  }
}
