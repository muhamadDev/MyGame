export default class Npc extends Phaser.Physics.Arcade.Sprite {
    constructor(options, scene) {
        super(scene, options.x, options.y, options.key, 130);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        this.key = options.key;
        this.speed = options.speed || 100;
        this.dialog = options.dialog;
        this.npcName = options.npcName;
        this.sale = options.sale || false;
        this.animations = options.animations;
        
        this.scene = scene;
        
        this.secondTime = false;
        this.shouldTalk = true;
        this.isSecondClick = false;
        
        this.dialogNumber = 0;
        
        this.setSize(15, 30)
        .setScale(options.scale || 1)
        .setCollideWorldBounds(true)
        .setPushable(true)
        .setMass(900)
        .setDepth(3)
        
        
        if (!this.animations) return;
        
        this.animations.forEach((item) => {
            
            this.scene.anims.create({
                key: `${this.key}${item.name}`,
                frames: this.scene.anims.generateFrameNumbers(this.key, {
                    start: item.start,
                    end: item.end
                }),
                frameRate: 6,
                repeat: -1,
            });
            
        });
        
        this.play(`${this.key}${this.animations[0].name}`);
    }
    
    update() {
        const distance = Phaser.Math.Distance.BetweenPoints(this.scene.Dude, this);
        
        if (this.shouldTalk && distance < 60 && this.dialog) {
            this.scene.physics.pause();
            
            this.scene.Dude.setVelocity(0)
            createTextBox(this.scene, 215, 480, 800, this, this.npcName)
            .start(this.dialog[this.dialogNumber].talk, 40);
            this.shouldTalk = false
            
        }
        
        
    }
    
}



const COLOR_MAIN = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const COLOR_PRIMARY = 0x4e342e;


export function createTextBox(scene, x, y, wrapWidth, npc, npcName = "npc-LK-On") {
    let textBox = scene.rexUI.add.textBox({
        x: x,
        y: y,
        width: 0,
        height: 0,
        innerBackground: scene.rexUI.add.roundRectangle({
            radius: 20,
            color: COLOR_DARK,
            strokeColor: COLOR_LIGHT, strokeWidth: 2,
        }),
        
        
        text: scene.rexUI.add.BBCodeText(0, 0, '', {
            wrapWidth: wrapWidth,
            fixedHeight: 120,
            fontSize: 35,
            maxLines: 3,
            wrap: {
                mode: 'word',
                width: wrapWidth 
            } 
        }),
        
        title: scene.rexUI.add.label({
            width: 200,
            background: scene.rexUI.add.roundRectangle({
                radius: 10,
                color: COLOR_PRIMARY,
                strokeColor: COLOR_LIGHT, strokeWidth: 2,
            }),
            
            text: scene.add.text(0, 0, npcName, { fontSize: 28 }),
            align: 'center',
            space: {
                left: 14, right: 14, top: 14, bottom: 14,
                icon: 14,
                text: 14 
            } 
        }),
        
        action: scene.add.image(0, 0, 'nextPage').setTint(COLOR_LIGHT).setVisible(false),
        
        space: {
            innerLeft: 20,
            innerRight: 20,
            innerTop: 30,
            innerBottom: 20,
            title: -20,
            titleLeft: 30,
            
            text: 10,
            left: 20, right: 20, top: 20, bottom: 20,
            separator: 6,
            
        }
    }).setOrigin(0).layout().setDepth(350).setScrollFactor(0)
    
    textBox.setInteractive();
      
    textBox.on('pointerdown', function()  {
        var icon = this.getElement('action').setVisible(false);
        this.resetChildVisibleState(icon);
        
        if (this.isTyping) {
            this.stop(true);
        } else if (!this.isLastPage) {
            this.typeNextPage();
        } else {
            // last Page
            textBox.destroy();
            scene.physics.resume();
            
            if(npc.dialogNumber == npc.dialog.length) return;
            npc.dialogNumber++
            
            if (!npc.dialog[npc.dialogNumber]) return;
            
            npc.scene.time.delayedCall(npc.dialog[npc.dialogNumber].time * 10000, () => {
                npc.shouldTalk = true
            });
            
        }
        
      }, textBox);
      
      textBox.on('pageend', function () {
        if (this.isLastPage) {
            return;
        }
    
        var icon = this.getElement('action').setVisible(true);
        this.resetChildVisibleState(icon);
        icon.y -= 30;
        scene.tweens.add({
            targets: icon,
            y: '+=30', 
            ease: 'bounce', 
            duration: 500,
            repeat: 0,
        });
    
      }, textBox);
      
      textBox.on('complete',  () => {
        console.log('all pages typing complete');
      });
      return textBox;
};
