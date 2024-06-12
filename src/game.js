import Main from "./mainScene.js";

eruda.init()

let config = {
    type: Phaser.AUTO,
    width: 1280, 
    height: 720,
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
    }
  
};

let game = new Phaser.Game(config);
