"use strict";
// Style Watermark

ClickyDrive.versionAppend="| Resources and Nodes";
ClickyDrive.vWatermarkStyle.strokeThickness=.5;
ClickyDrive.vWatermarkStyle.fontSize=20;
// Select Background.ui
ClickyDrive.background='Assets/Background.png';

// set ui
ClickyDrive.ui='UI.html';



// let's attempt to add a new resource, gold
new ClickyDrive.resource("infinite", Infinity, true);
// define a node to go along with it.
new ClickyDrive.node("infinite",900,250, ["Assets/gold0.png"], null,null);

// let's attempt to add a new resource, gold
new ClickyDrive.resource("depletable", 20, true);
// define a node to go along with it.
new ClickyDrive.node("depletable",1300,250, ["Assets/gold0.png","Assets/gold1.png","Assets/gold2.png","Assets/gold3.png"], null,null);
// let's attempt to add a new resource, gold

new ClickyDrive.resource("depleted", 0, true);

// define a node to go along with it.
new ClickyDrive.node("depleted",900,650, ["Assets/gold0.png","Assets/gold1.png","Assets/gold2.png","Assets/gold3.png"], null,null);

// let's attempt to add a new resource, gold
new ClickyDrive.resource("disabled", 100, false);

// define a node to go along with it.

new ClickyDrive.node("disabled",1300,650, ["Assets/gold0.png","Assets/gold1.png","Assets/gold2.png","Assets/gold3.png"], null,null);


ClickyDrive.hookins.update = function()
{
	
	
	ClickyDrive.ui.getChildByID("infinite").innerHTML=ClickyDrive.resources.infinite.amount;
	ClickyDrive.ui.getChildByID("depletable").innerHTML=ClickyDrive.resources.depletable.amount;
	ClickyDrive.ui.getChildByID("depleted").innerHTML=ClickyDrive.resources.depleted.amount;
	ClickyDrive.ui.getChildByID("disabled").innerHTML=ClickyDrive.resources.disabled.amount;
	
	
}

// start the game	
ClickyDrive.game = new Phaser.Game(config);



