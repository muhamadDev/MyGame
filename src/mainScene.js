import Player from "./player.js"
import Enemy from "./Enemy.js"
import Npc from "./npc.js"
import HealthBar from "./healthBar.js";
import Inventory from "../plugins/inventory.js";
import PhaserTooltip from "../plugins/PhaserTooltip.js";
import Chest from "./chest.js";



export default class Main extends Phaser.Scene {
    constructor() {
        super({ key: "scene" });
    }
    
    preload() {
        this.loadingRec = this.add.rectangle(640, 360, 1280, 720, 0x000000);
        
        this.load.pack('assetPack', '../json/load.json');
        
        this.load.scenePlugin('PhaserTooltip', PhaserTooltip, 'PhaserTooltip', 'tooltip');
    }

    create() {
        this.createMap()
        
        this.createPlayer();
        
        this.createInventory();
        
        this.createChest();
        
        this.createEnvirment();
        
        this.createEnemy();
        
        this.createNpc();
        
        this.isPlayerNearChest = false;
        this.nearsetChest = undefined;
        
        this.input.addPointer(5);
        
        this.healthBar = new HealthBar(this);
        this.healthBar.create(130, 60);
        
        this.loadingRec.destroy();
        
        
    }
    
    update(time, delta) {
        this.npc.update();
        this.inv.update();
        this.Dude.update();
        
        this.Bees.getChildren().forEach((bee) => {
            bee?.update(time, delta);
        });
        
        this.trees.getChildren().forEach((tree) => {
            if (tree.y + 40 > this.Dude.y) {
                tree.setDepth(90);
            } else {
                tree.setDepth(0)
            }
        });
        
        this.barrels.getChildren().forEach((barrel) => {
            if (barrel.y -10 > this.Dude.y) {
                barrel.setDepth(90);
            } else {
                barrel.setDepth(0)
            }
        });
        
        this.chests.getChildren().forEach(chest => {
            chest.update()
        })
        
    }
    
    createMap() {
        this.map = this.make.tilemap({ key: "map", tileWidth: 32, tileHeight: 32});
        
        const tileset = this.map.addTilesetImage("tile","Tileset");
        
        const groundLayer = this.map.createLayer("ground", tileset, 0, 0);
        const bridgeLayer = this.map.createLayer("bridge", tileset, 0, 0);
        
        groundLayer.setScale(3)
        bridgeLayer.setScale(3)
        
    }
    
    createPlayer() {
        this.Dude = new Player({
            x: 200,
            y: 200,
            key: "dudeSword",
            scale: 1.4,
            speed: 320,
            maxHealth: 100,
            minHealth: 0,
            health: 100,
            timeBettwenEachAttack: 300,
            damageToEnemy: 10
        }, this);
        
        this.physics.world.setBounds(0, 0, 1120 * 3, 1120 * 3);
        this.cameras.main.setBounds(0, 0, 1120 * 3, 1120 * 3);
        
    }
    
    createInventory() { 
        this.sizers = this.physics.add.group();
        this.inv = new Inventory({
            x: 1220,
            y: 100,
            key: "inventoryContainer",
            id: 0,
            orientationY: true,
            tooltitOffset: { x: 0, y: 0},
            space: 5, 
            width: 70,
            height: 70, 
            padding: 10, 
            scrollFactor: 0, 
            onDbClick: (item, pointer) => {} ,
            onClickCallback: (item, pointer) => {
                this.selectedItems(item);
            },
            inventorys: [],
        }, this);
        
        this.inv.addItem("sword", {
            qountity: 1,
            text: "sword"
        });
        
        this.inv.addItem("Bow", {
            qountity: 1,
            text: "Bow"
        });
        
    }
    
    createEnemy() {
        this.Bees = this.physics.add.group();
        
        for (var i = 0; i < 3; i++) {
            let bee = new Enemy({ 
                x: 821 + ( i * 30),
                y: 1154 + (i * 30),
                key: "Bee",
                scale: 2,
                speed: 120,
                dude: this.Dude,
                damageToEnemy: 10
            }, this);
            
            this.Bees.add(bee);
        }
        
        
        this.physics.add.collider(this.Bees, this.Bees);
        
    }
    
    createEnvirment() {
        let data = this.cache.json.get("envirment");
        let houseData = this.cache.json.get("house");
        
        
        this.trees = this.physics.add.group();
        this.barrels = this.physics.add.group();
        this.houseFloor = this.physics.add.group();
        
        this.houseWall = this.physics.add.staticGroup();
        this.houseDecore = this.physics.add.staticGroup();
        
        data.trees.forEach((tree) => {
            this.trees.create(tree.x, tree.y, "Trees", tree.id)
            .setScale(4.5)
            .setSize(10, 3)
            .setOffset(17, 50)
            .setPushable(false)
        });
        
        
        data.barrel.forEach((barrle) => {
            this.barrels.create(barrle.x, barrle.y, "barrel", barrle.index)
            .setScale(3.5)
            .setPushable(false)
            .setSize(10,7)
            .setOffset(2, 8)
        });
        
        let x = 700
        let y = 680
        
        houseData.layers[0].tiles.forEach((tile) => {
            this.houseFloor.create(x + tile.x * 48, y + tile.y * 48, "houseSheet", +tile.id)
            .setScale(1.5).body.debugShowBody = false;
        });
        
        houseData.layers[1].tiles.forEach((tile) => {
            this.houseWall.create(x +tile.x * 48, y + tile.y * 48, "houseSheet", +tile.id)
            .setScale(1.5)
            .setSize(44,44)
            .setOffset(-5,-5)
        });
        
        data.houseDecore.forEach(decore => {
            this.houseDecore.create(decore.x, decore.y, decore.key, +decore.index)
        });
        
        
        this.physics.add.collider(this.trees, this.Dude);
        this.physics.add.collider(this.barrels, this.Dude);
        this.physics.add.collider(this.Dude, this.houseWall)
        this.physics.add.collider(this.houseDecore, this.Dude);
    }
    
    createNpc() {
        let data = this.cache.json.get("dialogs");
        
        this.npc = new Npc({
            key: "npc1",
            x: 456,
            y: 600,
            npcName: "steven holk",
            id: 0,
            speed: 120,
            scale: 2.3,
            sale: true,
            dialog: data.lewis,
            animations: [{
                name: "Idle",
                start: 8,
                end: 11
                
            }]
        },this);
        
        this.physics.add.collider(this.npc, this.Dude, (npc, dude) => {
            
            this.time.delayedCall(300, () => {
                npc.setVelocity(0)
            });
            
        });
        
    }
    
    createChest() {
        this.chests = this.physics.add.group();
        
        this.anims.create({
            key: "smallChest",
            frames: this.anims.generateFrameNumbers("smallChest"),
            frameRate: 16,
            repeat: 0,
        });
        
        let chestItems = [
            {
                key: "Bow",
                qountity: 1,
                text: "Bow"
            }
        ]
        
        let chest1 = new Chest({
            x: 930,
            y: 759,
            key: "smallChest",
            space: 4,
            scale: 3,
            items: chestItems,
        }, this);
        
        this.inv.addInventorys(chest1.inv) 
        
        this.chests.add(chest1)
        
        this.physics.add.collider(this.chests, this.Dude);
        
    }
    
    selectedItems(item) {
        if(item.name == "Bow") {
            this.Dude.selectedItem = 1
            this.Dude.holding = "Bow"
            
            this.Dude.setSize(24, 12)
            this.Dude.setOffset(50, 80)
            
        } else if(item.name == "sword") {
            this.Dude.selectedItem = 0
            this.Dude.holding = "Sowrd"
            
            this.Dude.setSize(24, 12)
            this.Dude.setOffset(20,46)
            
        }
        
        
        if (this.Dude.body.velocity.x == 0 && this.Dude.body.velocity.y == 0) {
            this.Dude.play(`dude${this.Dude.holding}Idle${this.Dude.getData("facing")}`);
            return
        }
        
        this.Dude.play(`dude${this.Dude.holding}Wolk${this.Dude.getData("facing")}`);

        
    }
    
}
