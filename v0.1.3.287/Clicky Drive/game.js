"use strict";
// Style the version Watermark
let version = "106";
console.log("test #"+version);
ClickyDrive.versionAppend="Running Test #"+version;

// Select Background image
ClickyDrive.background='Assets/Background.png';

// set ui
ClickyDrive.ui='testui.html';



// let's attempt to add a new resource, gold
let gold = new ClickyDrive.resource("gold", 30, true);

// define a node to go along with it.
let goldNode =new ClickyDrive.node("gold",800,450, ["Assets/gold0.png","Assets/gold1.png","Assets/gold2.png","Assets/gold3.png"]);

// set up fragments.
goldNode.fragment="Assets/goldFrag.png";
goldNode.depletedFragment="Assets/stoneFrag.png";
goldNode.fragmentScale=.2;

// set up glow
goldNode.glow.texture="Assets/Glow.png";
goldNode.glow.scale=3;


ClickyDrive.hookins.update = function()
{
	
	
	ClickyDrive.ui.getChildByID("gold").innerHTML="Gold: "+ClickyDrive.resources.gold.amount;
	
	
	
}

// start the game	
ClickyDrive.game = new Phaser.Game(config);



