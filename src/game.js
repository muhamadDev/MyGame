import Main from "./mainScene.js";




let config = {
    type: Phaser.AUTO,
    width: 1920, 
    height: 1080,
    backgroundColor: 0x000000,
    scene: [Main],
    pixelArt: true,
    
    physics: {
        default: "arcade",
        arcade: {
            debug: false,
        },
        
    },
    
    scale: {
        mode: Phaser.Scale.FIT,
    },
};

let game = new Phaser.Game(config);

console.log(Phaser.Scenes)