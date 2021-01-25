"use strict";
let inlineIcon = " <img class=\"inline\" src=\"Assets/Gui/Icons/goldIcon.png\">";

// Select Background image
ClickyDrive.background='Assets/Background.png';

// set ui
ClickyDrive.ui='UI.html';

// enable Saving
//ClickyDrive.gameID="Test";

// let's attempt to add a new resource, gold
let gold = new ClickyDrive.resource("gold", Infinity, true);

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


// Set enums for all of the buttons
// ""Enums""
// Whatever.
let unlockIDs =
{ 
    	// So this only counts for the buttons that need unlocked, 
	//and has only the button IDs, not the children, there will be an update one, okay?
	PickUp:0,
	MinerUp:1,
	DrillUp:2,
	LazerUp:3,
	Prospect:4,
	Prospector:5,
	Miner:6,
	Drill:7,
	Lazer:8
}


// All items:

let upgradeLevels=["Base","Stone","Tin","Copper","Bronze","Iron","Cast Iron","Steel","Stainless Steel","Tungsten","Tungsten Alloy","Titanium","Titanium Alloy","Composite","Composite Alloy","Carbon Fiber","Carbon Nanotube","Nanotube Alloy","Electrum","Gold Alloy","Devine Gold"];

let upgrades =
{
	PickUp:new ClickyDrive.item('PickUp', {'gold':10}, 3,{"gold":0})
	//MinerUp:new ClickyDrive.item('MinerUp', {'gold':500}, 1.5, {"gold":0}),
	//DrillUp:2,
	//LazerUp:3,
	 
}

// Define upgrade properties
upgrades.PickUp.onPurchase=function(){ gold.perClick*=2; }

// updates upgrade buttons
function updateUpgrades()
{
	for( let i in upgrades)
	{
		//get the cost Element
		//console.log(upgrades[i].costs.gold+inlineIcon);
		document.getElementById(i+"Cost").innerHTML= "Cost: "+upgrades[i].costs.gold+inlineIcon;
		let owned="Level: ("+upgrades[i].amount+"/"+(upgradeLevels.length-1)+") "+upgradeLevels[upgrades[i].amount]+" | ";
		// for now
		switch(i)
		{
			case "PickUp":
				owned+=gold.perClick+" GPC"
				break;
		}
		document.getElementById(i+"Owned").innerHTML=owned;
	}
	
}

// now for miners

let miners =
{
	Miner:new ClickyDrive.item('Miner', {'gold':25}, 1.1,{"gold":1}),
	//Min:new ClickyDrive.item('Miner', {'gold':25}, 1.1,{"gold":1})
}



function updateUnlocked()
{
	for( let i in unlockIDs )
	{
		if(!isUnlocked(unlockIDs[i]))
		{
			
			switch(unlockIDs[i])
			{
				
				case unlockIDs.PickUp:
					console.log("WTF");
					if(gold.amount>=upgrades.PickUp.costs.gold){unlock(unlockIDs[i]);}
					break;
				case unlockIDs.Miner:
					if(gold.amount>=miners.Miner.costs.gold){unlock(unlockIDs[i]);}
					break;
					
			}
			
			
				
		}

	}
}

// returns boolean.
function isUnlocked( unlockID )
{
	for( let i in unlockIDs )
	{
		if(unlockID==i)
		{	
			// nonsense.
			if(document.getElementById(Object.keys(unlockIDs)[i])==null)
			{
				// seems bizare, but whatever
				return true;
			}

			if(!document.getElementById(Object.keys(unlockIDs)[i]).classList.contains('hidden'))
			{
				return true;
			}
			else
			{
				return false;
			}
				
		}
	}
	return false;
}


function unlock(unlockID)
{
	let element = document.getElementById(Object.keys(unlockIDs)[unlockID]);
	
	element.classList.remove('hidden');
	
	setTimeout(() => { element.classList.add('unlocked'); }, 50);
}

function unlockAll()
{
	for( let i in unlockIDs )
	{
		unlock(unlockIDs[i]);
	}
}




ClickyDrive.hookins.update = function()
{
	ClickyDrive.ui.getChildByID("gold").innerHTML="Gold: "+prettyPrint(gold.amount);
	ClickyDrive.ui.getChildByID("gps").innerHTML=gold.perSecond+" GPS";
	
	updateUnlocked();
	updateUpgrades();

}

// start the game	
ClickyDrive.game = new Phaser.Game(config);