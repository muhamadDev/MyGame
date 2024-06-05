export default class HealthBar {
    
    constructor(scene) {
        this.scene = scene;
    }
    
    create(x = 100,y = 60) {
        let status = this.scene.add.image(x,y, 'dudeStatus');
        status.setScale(3)
        .setScrollFactor(0)
        .setDepth(100);
        
        
        this.healthLine = [];
        
        this.updateHealth();
    }
    
    updateHealth() {
        let health = this.scene.Dude.getData("health");
        let newHealth = Math.floor(health / 6);
        
        this.healthLine.forEach(line => {
            line.destroy();
        });
        this.healthLine = []
             
        for (var i = 0; i < newHealth; i++) {
            let x = 76;
            let line = this.scene.add.image(x + (i * 8), 33, 'health')
            .setScale(3.8)
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(140); 
            this.healthLine.push(line)
        }
        
    }
    
}