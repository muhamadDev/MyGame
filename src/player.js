export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(options, scene) {
        super(scene, options.x, options.y, options.key);
        this.scene = scene;
        
        this.animation = options.animation || true;
        this.speed = options.speed || 100
        this.maxHealth = options.maxHealth || 100;
        this.minHealth = options.minHealth || 0;
        this.health = options.health || 50;
        this.damageToEnemy = options.damageToEnemy || 0;
        this.timeBettwenEachAttack = options.timeBettwenEachAttack || 600;
        this.selectedItem = 0
        
        this.isFirstAttack = true;
        this.isOnAttack = false;
        
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.scene.cameras.main.startFollow(this);
        
        this.setScale(2.1)
        .setDepth(4)
        .setCollideWorldBounds(true)
        .setSize(12, 10)
        .setOffset(58,70)
        .setOrigin(0.5, 0.5)
        .setPushable(false)
        this.setMass(10)
        
        PhaserHealth.AddTo(this, this.health, this.minHealth, this.maxHealth);
        
        this.setData("energy", 0);
        this.setData("facing", "bottom");
        this.setData("onAttack", "false");
    
        this.setInteractive();
        
        this.on("pointerdown", (pointer) => {
            const col = Math.floor(this.x / 200);
            const row = Math.floor(this.y / 200);
            
            console.log(Math.floor(this.x), Math.floor(this.y))
        });
        
        
        this.scene.cameras.main.startFollow(this);
        
        if (this.animation) {
            this.animations();
            this.play("dudeIdleFront");
        }
        
        this.movement();
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
        let left = this.scene.add.sprite(btnX - 80, btnY, "mevementBtns", 1);
        left
          .setOrigin(0.5, 0.5)
          .setScale(scale)
          .setInteractive()
          .setScrollFactor(0)
          .setDepth(100);
        
        left.on("pointerdown", (pointer) => {
            this.setVelocityX(-this.speed);
            this.play("dudeWalkLeft");
            this.data.values.facing = "Left";
            
        });
        
        left.on("pointerup", (pointer) => {
            this.setVelocityX(0);
            this.play("dudeIdleLeft");
          
        });
        
        // right
        
        let right = this.scene.add.image(btnX + 80, btnY, "mevementBtns", 2);
        right
          .setOrigin(0.5, 0.5)
          .setScale(scale)
          .setInteractive()
          .setDepth(100)
          .setScrollFactor(0);
    
        right.on("pointerdown", (pointer) => {
            this.setVelocityX(this.speed);
            this.play("dudeWalkRight");
            this.data.values.facing = "Right";
            
        });
        
        right.on("pointerup", (pointer) => {
            this.setVelocityX(0);
            this.play("dudeIdleRight");
            
        });
        
        // top
        let top = this.scene.add.sprite(btnX, btnY - 80, "mevementBtns", 3); // 73.5
        top
          .setOrigin(0.5, 0.5)
          .setScale(scale)
          .setInteractive()
          .setScrollFactor(0)
          .setDepth(100);
    
        top.on("pointerdown", (pointer) => {
            this.setVelocityY(-this.speed);
            this.play("dudeWalkBack");
            this.data.values.facing = "Back";
            
        });
        
        top.on("pointerup", (pointer) => {
            this.setVelocityY(0);
            this.play("dudeIdleBack");
            
        });
    
        let bottom = this.scene.add.sprite(btnX, btnY + 80, "mevementBtns", 0); //. 73.5
        bottom
          .setOrigin(0.5, 0.5)
          .setScale(scale)
          .setDepth(100)
          .setScrollFactor(0)
          .setInteractive();
    
        bottom.on("pointerdown", (pointer) => {
            this.setVelocityY(this.speed);
            this.play("dudeWalkFront");
            this.data.values.facing = "Front";
            
        });
        
        bottom.on("pointerup", (pointer) => {
            this.setVelocityY(0);
            this.play("dudeIdleFront");
        });
    }
    
    animations() {
        this.scene.anims.create({ //
            key: "dudeIdleFront",
            frames: this.scene.anims.generateFrameNumbers("dudeIdle", {
                start: 0,
                end: 3
            }),
            frameRate: 6,
            repeat: -1,
        });
    
        this.scene.anims.create({ // 
            key: "dudeWalkFront",
            frames: this.scene.anims.generateFrameNumbers("dudeMove", {
                start: 0,
                end: 5
            }),
            frameRate: 8,
            repeat: -1,
        });
    
        this.scene.anims.create({ // 
            key: "dudeAttackFront",
            frames: this.scene.anims.generateFrameNumbers("dudeAttack", {
                start: 0,
                end: 5
            }),
            frameRate: 8,
            repeat: 0,
        });
    
        // right
    
        this.scene.anims.create({ //
            key: "dudeIdleRight",
            frames: this.scene.anims.generateFrameNumbers("dudeIdle", {
                start: 8,
                end: 11
            }),
            frameRate: 6,
            repeat: -1,
        });
    
        this.scene.anims.create({
            key: "dudeWalkRight",
            frames: this.scene.anims.generateFrameNumbers("dudeMove", {
                start:12,
                end: 17
            }),
            frameRate: 8,
            repeat: -1,
        });
    
        this.scene.anims.create({ //
            key: "dudeAttackRight",
            frames: this.scene.anims.generateFrameNames("dudeAttack", {
                start: 12,
                end: 17
            }),
            frameRate: 8,
            repeat: 0,
        });
    
        // back
        this.scene.anims.create({ //
            key: "dudeIdleBack",
            frames: this.scene.anims.generateFrameNumbers("dudeIdle", {
                start: 12,
                end: 15
            }),
            frameRate: 6,
            repeat: -1,
        });
    
        this.scene.anims.create({ //
            key: "dudeWalkBack",
            frames: this.scene.anims.generateFrameNumbers("dudeMove", {
                start: 18,
                end: 23
            }),
            frameRate: 8,
            repeat: -1,
        });
        
        this.scene.anims.create({ //
            key: "dudeAttackBack",
            frames: this.scene.anims.generateFrameNumbers("dudeAttack", {
                start: 18,
                end: 23
            }),
            frameRate: 8,
            repeat: 0,
        });
    
        // left
        this.scene.anims.create({ //
          key: "dudeIdleLeft",
          frames: this.scene.anims.generateFrameNumbers("dudeIdle", {
              start: 4,
              end: 7
          }),
          frameRate: 6,
          repeat: -1,
        });
    
        this.scene.anims.create({ //
          key: "dudeWalkLeft",
          frames: this.scene.anims.generateFrameNumbers("dudeMove", {
              start: 6,
              end: 11
          }),
          frameRate: 8,
          repeat: -1,
        });
    
        this.scene.anims.create({ //
          key: "dudeAttackLeft",
          frames: this.scene.anims.generateFrameNumbers("dudeAttack", {
              start: 6,
              end: 11
          }),
          frameRate: 8,
          repeat: 0,
        });
        
        // bow
        
        this.scene.anims.create({ //
            key: "dudeAttackBowFront",
            frames: this.scene.anims.generateFrameNumbers("dudeAttackBow", {
                start: 0,
                end: 5
            }),
            frameRate: 8,
            repeat: 0,
        });
        
        this.scene.anims.create({ //
            key: "dudeAttackBowLeft",
            frames: this.scene.anims.generateFrameNumbers("dudeAttackBow", {
                start: 6,
                end: 11
            }),
            frameRate: 8,
            repeat: 0,
        });
        
        this.scene.anims.create({ //
            key: "dudeAttackBowRight",
            frames: this.scene.anims.generateFrameNumbers("dudeAttackBow", {
                start: 12,
                end: 17
            }),
            frameRate: 8,
            repeat: 0,
        });
        this.scene.anims.create({ //
            key: "dudeAttackBowBack",
            frames: this.scene.anims.generateFrameNumbers("dudeAttackBow", {
                start: 18,
                end: 23
            }),
            frameRate: 8,
            repeat: 0,
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
            this.isOnAttack = true;
            this.attack(pointer);
        },this);
        
        attackBtn.on("pointerup", (pointer) => {
            this.isOnAttack = true;
            
            if (this.holdTimer && this.holdTimer.getElapsed() < 1000) {
                this.holdTimer.remove(); 
            }
                
            this.scene.time.addEvent({
                delay: 1500,
                callback: () => {
                  this.data.values.onAttack = false;
                },
                callbackScope: this,
                loop: false,
            });
          
        });
        
        
        
    }
    
    attack() {
        if(this.scene.isPlayerNearChest) {
            this.scene.nearsetChest.openChest();
            return;
        }
        console.log(playerItems[this.selectedItem])
        playerItems[this.selectedItem].action(this);
        
    }
    
    throwBomb() {
        console.log("Throwing Bomb");
    }
    
    
    
}


export const playerItems = [
    {
        action: (player) => {
            player.data.values.onAttack = true;
            
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
            
            player.play(`dudeAttack${player.data.values.facing}`);
            
            // run this function after 0.6s
            player.scene.time.delayedCall(player.timeBettwenEachAttack, () => {
                player.isFirstAttack = true
            });
            
        }
    },
    {
        action: (player) => {
            player.data.values.onAttack = true;
            
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
            
            player.play(`dudeAttackBow${player.data.values.facing}`);
            
            player.scene.time.delayedCall(player.timeBettwenEachAttack, () => {
                player.isFirstAttack = true
            });
            
            player.scene.time.delayedCall(600, () => {
                arrow.destroy()
            });
            
            
        }
    }
    
    
]