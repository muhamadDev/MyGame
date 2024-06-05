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
            console.log(Math.floor(this.x), Math.floor(this.y))
        });
        
        
        this.scene.cameras.main.startFollow(this);
        
        if (this.animation) {
            let anim = this.animations();
            this.play(anim);
            
        }
        
        this.createJoyStick();
        
        this.createAttackBtn();
        
        this.on('die', (spr) =>  {
            
            this.scene.cameras.main.fadeOut(350, 0, 0, 0);
            
            this.scene.cameras.main.on(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
                
                this.scene.scene.start('SceneLost');
                
            });
        });
        
        this.arrows = this.scene.physics.add.group();
        
    }
    
    createJoyStick() {
        const base = this.scene.add.circle(0, 0, 100, 0x888888)
        .setDepth(100)
        
        const thumb = this.scene.add.circle(0, 0, 50, 0xcccccc).setDepth(100)
        
        this.joyStick = this.scene.plugins.get('rexvirtualjoystickplugin').add(this, {
            x: 140,
            y: 610,
            radius: 100,
            base: base,
            thumb: thumb,
            dir: '4dir', // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true
        }).on('update', () => {
            this.movePlayer();
        });
        
    }
    
    movePlayer() {
        let cursorKeys = this.joyStick.createCursorKeys();
        
        if (cursorKeys.left.isDown) {
            this.setVelocityX(-this.speed)
        }
        if (cursorKeys.right.isDown) {
            this.setVelocityX(this.speed)
        }
        
        if (cursorKeys.down.isDown) {
            this.setVelocityY(this.speed)
        }
        
        if (cursorKeys.up.isDown) {
            this.setVelocityY(-this.speed)
        }
        
        
        if (!this.joyStick.left && !this.joyStick.right) {
            this.setVelocityX(0)
        }
        
        if (!this.joyStick.up && !this.joyStick.down) {
            this.setVelocityY(0)
        }
        
          
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
        
        return data.player[data.player.length - 1]
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