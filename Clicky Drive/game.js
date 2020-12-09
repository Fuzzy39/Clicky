"use strict";
// Style Watermark
let version = "46";
console.log("test v"+version);
ClickyDrive.versionAppend="Running Test v"+version;
ClickyDrive.vWatermarkStyle.strokeThickness=.5;
ClickyDrive.vWatermarkStyle.fontSize=20;
// Select Background.ui
ClickyDrive.background='Assets/Background.png';

// set ui
ClickyDrive.ui='testui.html';



// let's attempt to add a new resource, gold
new ClickyDrive.resource("gold", 9);

// define a node to go along with it.
new ClickyDrive.node("gold", ClickyDrive.resources.gold, 800,450, true, ["Assets/gold0.png","Assets/gold1.png","Assets/gold2.png","Assets/gold3.png"], null,null);


// start the game	
ClickyDrive.game = new Phaser.Game(config);

