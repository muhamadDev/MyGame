export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    constructor(options, scene) {
        super(scene, options.x, options.y, options.key);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.damageToEnemy = options.damageToEnemy || 5;
        this.scene = scene;
        this.options = options;
        this.dude = options.dude;
        this.speed = options.speed ||  100;
        this.isAlive = false; 
        this.firstCollide = true
        
        this.setSize(20,20)
        this.setScale(options.scale);
        
        PhaserHealth.AddTo(this, options.health || 100, 0, options.maxHealth || 100);
        
        this.setCollideWorldBounds(true);
        this.isFollowingPlayer = false;
        
        if (!this.scene.anims.exists(options.key)) {
            this.scene.anims.create({ 
                key: options.key,
                frames: this.scene.anims.generateFrameNumbers(options.key, {
                    start: 5,
                    end: 0
                }),
                frameRate: 6,
                repeat: -1,
            });
        }
        
        this.play(options.key)
        
        this.bullets = this.scene.physics.add.group();
        
        this.scene.time.addEvent({
            delay: 600,
            callback: () => {
                if (!this.isAlive) return;
                this.attack(); 
            },
            callbackScope: this,
            loop: true,
        });
        
        this?.scene.time.addEvent({
            delay: 600,
            callback: () => {
                if (!this.isAlive) return;
                this.removeBullets(this);
            },
            callbackScope: this,
            loop: true,
        });
        
        this.on('die', (spr) => {
            this?.scene.tweens.add({
                targets: this,
                alpha: 0,
                duration: 500,
                ease: 'Power2',
                onComplete: (item) => {
                    
                    this.isAlive = false
                    this.dude.heal(5);
                    this?.scene.healthBar.updateHealth();
                    this.raycaster.destroy();
                    this.debugGraphics.clear();
                    this.destroy();
                    
                },
                onCompleteScope: this
            });
        });
        
        this?.scene.time.addEvent({
            delay: 300,
            callback: () => {
                this.firstCollide = true
            },
            callbackScope: this,
            loop: true,
        });
        
        this?.scene.physics.add.collider(this, options.dude, (enemy, dude) => {
            if (!this.firstCollide) return;
            if(!dude.getData("onAttack")) return;
            
            enemy.damage(dude.damageToEnemy);
            this.firstCollide = false
            
        });
        
        
        this?.scene.physics.add.collider(this.bullets, options.dude, (dude, bullet) => {
            dude.damage(this.damageToEnemy);
            this?.scene.healthBar.updateHealth();
            
            scene.tweens.add({
                targets: bullet,
                alpha: 0,
                duration: 170,
                ease: 'Power2',
                onComplete: (item) => {
                    bullet?.destroy();
                },
                onCompleteScope: this
            });
            
        });
        
        this?.scene.physics.add.collider(options.dude.arrows, this, (enemy, arrow) => {
            enemy.damage(options.dude.damageToEnemy);
            arrow.destroy();
        });
        
        
        this.raycaster = this?.scene.plugins.get('rexraycasterplugin').add()
        .addObstacle(this?.scene.barrels.getChildren())
        .addObstacle(this?.scene.houseWall.getChildren())
        
        this.raycaster.maxRayLength = this.x - this?.scene.Dude.x;
        
        this?.scene.physics.add.collider(this, this?.scene.barrels);
        this?.scene.physics.add.collider(this.raycaster.ray, this?.scene.barrels);
        
        this.followPlayer = true;
        
        // debug
        this.debugGraphics = this?.scene.add.graphics();
        
    }
    
    move() {
        const distance = Phaser.Math.Distance.BetweenPoints(this.scene.Dude, this);
        if (!this.followPlayer) {
            this.setVelocity(0);
            return
        };
        
        if (distance > 360 ) {
            this.setVelocity(0);
            
            this.isFollowingPlayer = false;
            return
        }
        
        this.raycaster.maxRayLength = distance;
        
        if (distance < 40) {
            this.setVelocity(0);
            this.isFollowingPlayer = false;
            return
        }
        
        if (this.health < 35) {
            const angle = Phaser.Math.Angle.Between(
                this.scene.Dude.x,this.scene.Dude.y,
                this.x, this.y,
            );
            
            this.setVelocity(Math.cos(angle) * this.speed, Math.sin(angle) * this.speed);
            
            this.isFollowingPlayer = false;
            
            return
        }
        
        const  angle = Phaser.Math.Angle.Between(
            this.x, this.y, 
            this.scene.Dude.x, this.scene.Dude.y
        );
        
        this.setVelocity(
            Math.cos(angle) * this.speed, 
            Math.sin(angle) * this.speed
        );
        
        
        this.setRotation(angle)
        
        this.isFollowingPlayer = true
        
        
    }
    
    update(time, delta) {
        if (!this.isAlive) return;
        this.move();
        
        const angle = Phaser.Math.Angle.Between(
            this.x, this.y,
            this.scene.Dude.x, this.scene.Dude.y,
        );
        
        // debug
        this.debugGraphics
        .clear()
        .lineStyle(1, 0x47FF35)
        .strokeLineShape(this.raycaster.ray)
        
        var result = this.raycaster.rayToward(this.x, this.y, angle)
        
        if (result) {
            this.followPlayer = false;
        } else {
            this.followPlayer = true;
        }
        
        if(this.firstFloadNumber) return;
        if (!this.scene.physics.world.collide(this, this.dude)) {
            this.firstFloadNumber = true
        }
        
    }
    
    attack() {
        if (!this.isFollowingPlayer) return;
        if (!this.followPlayer) return;
        
        const distance = Phaser.Math.Distance.BetweenPoints(this.scene.Dude, this);
        if(distance > 360 || distance < 30) return;
        
        let bullet = this.bullets.create(this.x, this.y, "bullet")
        .setScale(1.6)
        bullet.body.mass = 35;
        
        const angle = Phaser.Math.Angle.Between(
            bullet.x, bullet.y, 
            this.scene.Dude.x,this.scene.Dude.y
        );
        
        bullet.rotation = angle
        bullet.setVelocity(Math.cos(angle) * 300, Math.sin(angle) * 300);
        
        
        
    }
    
    removeBullets(scene) {
        let bullets = scene.bullets.getChildren();
        
        if(bullets.length === 0) return;
        
        scene.scene.tweens.add({
            targets: bullets[0],
            alpha: 0,
            duration: 2000,
            ease: 'Power2', 
            onComplete: (item) => {
                bullets[0]?.destroy();
            },
            onCompleteScope: this
        });
        
        
        
    }
    
}

