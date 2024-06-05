import Inventory from "../plugins/inventory.js";

export default class Chest extends Phaser.Physics.Arcade.Sprite {
    
    constructor(options, scene) {
        super(scene, options.x, options.y, options.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        this.scene = scene;
        this.items = options.items;
        this.key = options.key;
        this.space = options.space || 3;
        this.isPlayerNearChest = true;
        this.firstTime = true;
        
        this.setScale(options.scale || 1)
        
        // this.x - (this.space * (70 /2) )
        // this.y -60
        
        this.inv = new Inventory({
            x: options.x - (options.space * (70 / 2)),
            y: options.y - 60,
            key: "inventoryContainer",
            id: 1,
            orientationY: false,
            tooltitOffset: { x: 0, y: 230},
            space: options.space, 
            width: 70,
            height: 70, 
            padding: 10, 
            scrollFactor: 1, 
            onClickCallback: (item, pointer) => {},
            onDbClick: (item, pointer) => {} ,
            inventorys: [this.scene.inv]
        }, this.scene);
            
        this.items.forEach((item) => {
            
            this.inv.addItem(item.key, {
                qountity: item.qountity,
                text: item.text
            });
                
        });
        
        this.inv.containerGroup.getChildren().forEach(container => {
            container.hide();
        });
        
        
        let animation = scene.anims.get(this.key);

        let reversedFrames = animation.frames.slice().reverse();
    
        this.scene.anims.create({
            key: `${this.key}Reverse`,
            frames: this.anims.generateFrameNumbers(this.key, {
                start: this.scene.textures.get(this.key).getFrameNames().length - 1,
                end: 0
            }),
            frameRate: 16,
            repeat: 0,
        });

    }
    
    update(time, delta) {
        const distance = Phaser.Math.Distance.BetweenPoints(this.scene.Dude, this);
        if (distance < 100) {
            this.scene.isPlayerNearChest = true;
            this.scene.nearsetChest = this;
        } else {
            this.scene.isPlayerNearChest = false;
            this.scene.nearsetChest = null;
        }
        this.inv?.update();
                
    }
    
    openChest() {
        
        if (this.firstTime) {
            this.play(this.key);
            this.inv.containerGroup.getChildren().forEach(container => {
                container.show();
            });
            
            this.firstTime = false;
            return;
        }
        
        this.inv.containerGroup.getChildren().forEach(container => {
            this.play(`${this.key}Reverse`)
            container.hide();
        });
        
        this.firstTime = true;
        
        
    }
    
    
}