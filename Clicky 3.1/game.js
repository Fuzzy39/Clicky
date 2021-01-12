"use strict";


ClickyDrive.versionAppend="| Clicky 3.1";

// Select Background image
ClickyDrive.background='Assets/Background.png';

// set ui
ClickyDrive.ui='UI.html';

// enable Saving
//ClickyDrive.gameID="Test";

// let's attempt to add a new resource, gold
let gold = new ClickyDrive.resource("gold", 30, true);

// define a node to go along with it.
let goldNode =new ClickyDrive.node("gold",800,450, ["Assets/gold0.png","Assets/gold1.png","Assets/gold2.png","Assets/gold3.png"]);
goldNode.size=320;

// set up fragments.
goldNode.fragment="Assets/goldFrag.png";
goldNode.depletedFragment="Assets/stoneFrag.png";
goldNode.fragmentScale=.2;

// set up glow
goldNode.glow.texture="Assets/Glow.png";
goldNode.glow.scale=3;

let prospect = new ClickyDrive.item('prospect', {'gold':5}, 1, {"gold":0});
//prospect.onPurchase= function() { gold.add(1000); }

let miner = new ClickyDrive.item('miner', {'gold':10}, 1.1, {"gold":10});

/*ClickyDrive.hookins.update = function()
{
	ClickyDrive.ui.getChildByID("gold").innerHTML="Gold: "+prettyPrint(gold.amount)+" | GPS: "+ gold.perSecond;
	ClickyDrive.ui.getChildByID("miner").innerHTML="Miner ("+miner.costs.gold+"g)";
	ClickyDrive.ui.getChildByID("amount").innerHTML="Owned: "+miner.amount;
}*/

// start the game	
ClickyDrive.game = new Phaser.Game(config);