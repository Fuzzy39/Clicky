"use strict";
// Style Watermark
ClickyDrive.versionAppend="Running Test v33";
ClickyDrive.vWatermarkStyle.strokeThickness=.5;
ClickyDrive.vWatermarkStyle.fontSize=20;
// Select Background.ui
ClickyDrive.background='Assets/Background.png';

// set ui
ClickyDrive.ui='testui.html';


// let's attempt to add a new resource, gold
new ClickyDrive.resource("gold",0,0,null,true, null, Infinity)
// start the game	
ClickyDrive.game = new Phaser.Game(config);

var game = 
{
	click:function()
	{
		console.log("you clicked me!");
	}
}