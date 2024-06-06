export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(options, scene) {
        super(scene, options.x, options.y, options.key, 130);
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        
        this.speed = options.speed || 100
        this.maxHealth = options.maxHealth || 100;
        this.minHealth = options.minHealth || 0;
        this.health = options.health || 50;
        this.damageToEnemy = options.damageToEnemy || 0;
        this.timeBettwenEachAttack = options.timeBettwenEachAttack || 600;
        this.selectedItem = 0
        
        this.isFirstAttack = true;
        this.isOnAttack = false;
        
        this.scene.cameras.main.startFollow(this);
        this.holding = playerItems[this.selectedItem].name;
        PhaserHealth.AddTo(this, this.health, this.minHealth, this.maxHealth);
        
        
        this.setScale(options.scale)
        .setDepth(4)
        .setCollideWorldBounds(true)
        .setSize(24, 12)
        .setOffset(20,46)
        .setPushable(false)
        .setMass(10)
        
        this.setData("facing", "Front");
        this.setData("onAttack", false);
        
        this.setInteractive();
        
        this.on("pointerdown", (pointer) => {
            console.log(Math.floor(this.x), Math.floor(this.y))
        });
        
        this.animations();
        
        this.movement()
        
        this.createAttackBtn();
        
        this.on('die', (spr) =>  {
            
            this.scene.cameras.main.fadeOut(350, 0, 0, 0);
            
            this.scene.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                
                this.scene.scene.start('SceneLost');
                
            });
        });
        
        this.arrows = this.scene.physics.add.group();
        
    }
    
    movement() {
        let btnY = 600;
        let btnX = 140;
        let scale = 5.9
        
        // left
        let left = this.scene.add.sprite(btnX - 80, btnY, "movemontsBtn", 1);
        left
          .setOrigin(0.5, 0.5)
          .setScale(scale)
          .setInteractive()
          .setScrollFactor(0)
          .setDepth(100);
        
        left.on("pointerdown", (pointer) => {
            this.setVelocityX(-this.speed);
            this.setData("facing", "Left");
            this.play(`dude${this.holding}Wolk${this.getData("facing")}`);
            
        });
        
        left.on("pointerup", (pointer) => {
            this.setVelocityX(0);
            this.play(`dude${this.holding}Idle${this.getData("facing")}`);
          
        });
        
        // right
        
        let right = this.scene.add.image(btnX + 80, btnY, "movemontsBtn", 2);
        right
          .setOrigin(0.5, 0.5)
          .setScale(scale)
          .setInteractive()
          .setDepth(100)
          .setScrollFactor(0);
    
        right.on("pointerdown", (pointer) => {
            this.setVelocityX(this.speed);
            this.setData("facing", "Right");
            this.play(`dude${this.holding}Wolk${this.getData("facing")}`);
        });
        
        right.on("pointerup", (pointer) => {
            this.setVelocityX(0);
            this.play(`dude${this.holding}Idle${this.getData("facing")}`);
            
        });
        
        // top
        let top = this.scene.add.sprite(btnX, btnY - 80, "movemontsBtn", 3); // 73.5
        top
          .setOrigin(0.5, 0.5)
          .setScale(scale)
          .setInteractive()
          .setScrollFactor(0)
          .setDepth(100);
    
        top.on("pointerdown", (pointer) => {
            this.setVelocityY(-this.speed);
            this.setData("facing", "Back");
            this.play(`dude${this.holding}Wolk${this.getData("facing")}`);

        });
        
        top.on("pointerup", (pointer) => {
            this.setVelocityY(0);
            this.play(`dude${this.holding}Idle${this.getData("facing")}`);
            
        });
    
        let bottom = this.scene.add.sprite(btnX, btnY + 80, "movemontsBtn", 0); //. 73.5
        bottom
          .setOrigin(0.5, 0.5)
          .setScale(scale)
          .setDepth(100)
          .setScrollFactor(0)
          .setInteractive();
    
        bottom.on("pointerdown", (pointer) => {
            this.setVelocityY(this.speed);
            this.setData("facing", "Front");
            this.play(`dude${this.holding}Wolk${this.getData("facing")}`);
            
        });
        
        bottom.on("pointerup", (pointer) => {
            this.setVelocityY(0);
            this.play(`dude${this.holding}Idle${this.getData("facing")}`);
        });
    }

    animations() { //animation
        let data = this.scene.cache.json.get("animation");
        const frameRate =10
        
        data.player.forEach((anims) => {
            this.scene.anims.create({ 
                key: anims.key,
                frames: this.scene.anims.generateFrameNumbers(anims.spriteKey, {
                    start: anims.start,
                    end: anims.end
                }),
                frameRate: frameRate,
                repeat: anims.repeat,
            });
            
        });
        
    }
    
    createAttackBtn() {
        let btnY = 610;
        let btnX = 1220
        let scale = 6;
        
        let attackBtn = this.scene.add.image(btnX, btnY, "AttackBtn");
        attackBtn
        .setOrigin(1, 1)
        .setScale(scale)
        .setInteractive()
        .setScrollFactor(0)
        .setDepth(100);
        
        attackBtn.on("pointerdown", (pointer) => {
            
            this.holdTimer = this.scene.time.delayedCall(1000, () => {
                this.throwBomb();
                return
            });
            
            if(!this.isFirstAttack) return;
            
            this.attack(pointer);
            
        },this);
        
        attackBtn.on("pointerup", (pointer) => {
            
            if (this.holdTimer && this.holdTimer.getElapsed() < 1000) {
                this.holdTimer.remove(); 
            }
          
        });
        
    }
    
    attack() {
        if(this.scene.isPlayerNearChest) {
            this.scene.nearsetChest.openChest();
            return;
        }
        
        playerItems[this.selectedItem].action(this);
        
    }
    
    throwBomb() {
        console.log("Throwing Bomb");
    }
    
    update() {
    }
    
    
    
}


export const playerItems = [
    {
        name: "Sowrd",
        action: (player) => {
            player.setData("onAttack", true);
            player.play(`dudeSowrdAttack${player.getData("facing")}`);
            
            let swosh = player.scene.sound.add("swosh");
            
            swosh.play({
                mute: false,
                volume: 0.05,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: false,
                delay: 0,
            });
            
            player.isFirstAttack = false
            
            // run this function after 0.6s
            player.scene.time.delayedCall(900, () => {
                player.isFirstAttack = true
            });
            
            
        }
    },
    {
        name: "Bow",
        action: (player) => {
            player.setData("onAttack", true);
            
            let swosh = player.scene.sound.add("swosh");
            
            swosh.play({
                mute: false,
                volume: 0.05,
                rate: 1,
                detune: 0,
                seek: 0,
                loop: false,
                delay: 0,
            });
            
            
            
            player.play(`dudeBowAttack${player.getData("facing")}`);
            
            player.on(`animationcomplete-dudeBowAttack${player.getData("facing")}`, () => {
                
                console.log("attack")
                    
                let arrow = player.scene.physics.add.image(player.x, player.y, "arrow");
                arrow.setScale(1.5)
                player.arrows.add(arrow);
                
                
                
                
                if(player.getData("facing") == "Right") {
                    arrow.setVelocityX(500)
                } else if(player.getData("facing") == "Left") {
                    
                    arrow.setVelocityX(-500)
                    arrow.flipX = true
                    
                } else if (player.getData("facing") == "Back") {
                    
                    arrow.setVelocityY(-500)
                    arrow.setAngle(-90)
                    
                } else if (player.getData("facing") == "Front") {
                    
                    arrow.setVelocityY(500)
                    arrow.setAngle(90);
                    
                }
                
                player.isFirstAttack = false
                
                player.scene.time.delayedCall(900, () => {
                    player.isFirstAttack = true
                });
                
                player.scene.time.delayedCall(600, () => {
                    arrow.destroy()
                    player.setData("onAttack", false);
                });
            
            });
            
        }
    }
    
    
]