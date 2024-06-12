export default class HealthBar {
    
    constructor(scene) {
        this.scene = scene;
    }
    
    create(x = 100,y = 60) {
        let healthContainer = this.scene.add.image(x, y, 'HealthContainer');
        healthContainer.setScale(3.5)
        .setScrollFactor(0)
        .setDepth(100);
        
        
        this.healthLine = [];
        
        this.x = x;
        this.y = y;
        
        this.updateHealth();
    }
    
    updateHealth() {
        this?.healthBar?.destroy();
        this?.healthBarMask?.destroy()
        
        this.healthBar = this.scene.add.image(this.x, this.y, 'HealthBar')
        
        this.healthBar.setScale(3.5)
        .setScrollFactor(0)
        .setDepth(100);
        
        this.healthBarMask = this.scene.add.image(this.x, this.y, 'HealthBar')
        
        this.healthBarMask.setScale(3.5)
        .setScrollFactor(0)
        .setDepth(100)
        
        this.healthBarMask.visible = false;
        
        
        
        let health = this.scene.Dude.getData("health");
        let pashgr = this.x > 100 ? this.x - 100 : 0
        
        this.healthBar.mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.healthBarMask);
        this.healthBarMask.x = health + pashgr
        
    }
    
}