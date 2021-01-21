"use strict";
let inlineIcon = "<img src=\"Assets/Gui/Icons/goldIcon.png\"";

// Select Background image
ClickyDrive.background='Assets/Background.png';

// set ui
ClickyDrive.ui='UI.html';

// enable Saving
//ClickyDrive.gameID="Test";

// let's attempt to add a new resource, gold
let gold = new ClickyDrive.resource("gold", 5000, true);

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



function updateUnlocked()
{
	for( let i in unlockIDs )
	{
		if(!isUnlocked(unlockIDs[i]))
		{
			
			switch(unlockIDs[i])
			{
				
				case unlockIDs.PickUp:
					if(gold.amount>=/*pickup.cost*/10){unlock(unlockIDs[i]);}
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
}


//let pickUp = new ClickyDrive.item('prospect', {'gold':10}, 3, {"gold":0});
//pickUp.onPurchase= function() { gold.perClick*=2;}


//let miner = new ClickyDrive.item('miner', {'gold':10}, 1.1, {"gold":10});

ClickyDrive.hookins.update = function()
{
	ClickyDrive.ui.getChildByID("gold").innerHTML="Gold: "+prettyPrint(gold.amount)+inlineIcon;
	ClickyDrive.ui.getChildByID("gps").innerHTML=gold.perSecond+" GPS";
	
	 updateUnlocked();
	

}

// start the game	
ClickyDrive.game = new Phaser.Game(config);