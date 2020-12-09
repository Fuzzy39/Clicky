"use strict";
var ClickyDrive =
{
	
	game:undefined,
    versionString:"Clicky Drive v0.1.1.225 ",
	versionAppend:"",
	versionWatermark:undefined,
	vWatermarkX:0, // in 'pixels'
	vWatermarkY:0,
	vWatermarkStyle:{ fontFamily: '"Arial"', fontSize:'12pt', color:'white', strokeThickness:0 },
    aspectRatio:16/9,
	
	
	background:undefined,
	ui:undefined,
	

	resources:
	{
		//user defined
	},
	
	nodes:
	{
		// user defined.
	},

	preload: function()
	{ 
		console.log(ClickyDrive.versionString);
		
		if(ClickyDrive.background!=undefined)
		{
			this.load.image('bg',ClickyDrive.background ); 
		}
		
		if(ClickyDrive.ui!=undefined)
		{
			this.load.html('ui', ClickyDrive.ui);
		}
		
		
		for(let i in ClickyDrive.nodes )
		{
			for( let j in ClickyDrive.nodes[i].textures)
			{
				this.load.image( ClickyDrive.nodes[i].name+''+j, ClickyDrive.nodes[i].textures[j] ); 
			}
			
		}
	},
		

	create:function()
	{
		
		//background
		if(ClickyDrive.background!=undefined)
		{
			ClickyDrive.background = this.add.image(800,450, 'bg'); // must be in 16:9 aspect ratio.
			
			if (ClickyDrive.aspectRatio != ClickyDrive.background.width/ClickyDrive.background.height)
			{
			   throw "Background Aspect Ratio MUST be " + ClickyDive.aspectRatio +" width/height!"
			}
			// resize the background.
			ClickyDrive.background.setScale(config.scale.height/ClickyDrive.background.height);
		}
		
		
		
		// add in a dom
		if(ClickyDrive.ui!=undefined)
		{
			this.add.dom(0,0).createFromHTML(this.cache.html.get('ui'));
		}
		
		// Watermark things properly.
		ClickyDrive.versionWatermark = this.add.text(ClickyDrive.vWatermarkX, ClickyDrive.vWatermarkY, ClickyDrive.versionString+ClickyDrive.versionAppend, ClickyDrive.vWatermarkStyle);
    		ClickyDrive.versionWatermark.originX=-.5; // make it easier to deal with
		ClickyDrive.versionWatermark.originY=-.5;
		
		// go through all nodes, and create them!
		for(let i in ClickyDrive.nodes )
		{
			
			
			ClickyDrive.nodes[i].currentTexture = this.add.image(ClickyDrive.nodes[i].location[0] ,ClickyDrive.nodes[i].location[1], ClickyDrive.nodes[i].name+'0').setInteractive();
			// and set its scale.
			ClickyDrive.nodes[i].currentTexture.setScale(ClickyDrive.nodes[i].size/ClickyDrive.nodes[i].currentTexture.height);
			ClickyDrive.nodes[i].currentTexture.inputEnabled = true;
			ClickyDrive.nodes[i].currentTexture.setTint(0xfafafa);
			//set input things, animation, etc.
			
			// set stuff, animations in particular.

    			ClickyDrive.nodes[i].currentTexture.on('pointerdown', function (pointer)
			{
				this.setTint(0xdddddd);
				ClickyDrive.nodes[i].scale=1;
				ClickyDrive.resources[ClickyDrive.nodes[i].name].mine(); // simple, right?
			});

			ClickyDrive.nodes[i].currentTexture.on('pointerout', function (pointer)
			{
				this.setTint(0xfafafa);
				ClickyDrive.nodes[i].hovered=false;
			});

			ClickyDrive.nodes[i].currentTexture.on('pointerup', function (pointer)
			{
				this.setTint(0xffffff);
				ClickyDrive.nodes[i].hovered=true;
			});

			ClickyDrive.nodes[i].currentTexture.on('pointerover', function (pointer)
			{
				this.setTint(0xffffff);
				ClickyDrive.nodes[i].hovered=true;
			});

		}


	},
	
	update:function()
	{

		// Getting resources per second. Simple!
		for  ( let item in ClickyDrive.resources)
		{	
			let toAdd = ClickyDrive.resources[item].perSecond/60;

			

			// we can get everything?
			if( toAdd <= ClickyDrive.resources[item].amountAvailable)
			{
				ClickyDrive.resources[item].amount+= toAdd; // take all that's due
				ClickyDrive.resources[item].amountAvailable-=toAdd // and remove it from the stache.
			}
			else
			{
				// exaust whatever is remaining.
				ClickyDrive.resources[item].amount+=ClickyDrive.resources[item].amountAvailable;
				ClickyDrive.resources[item].amountAvailable=0;	
			}

			

			
			// Graphically Deplete resources
			
			// first a small check.
			if(ClickyDrive.resources[item].amountAvailable===0)
			{
				// this line of code is so long that it's a sin of some kind.
				ClickyDrive.nodes[item].currentTexture.setTexture(ClickyDrive.game.textures.list[ClickyDrive.nodes[item].name+''+(ClickyDrive.nodes[item].textures.length-1)]).setInteractive();
			
			}
			else
			{
				// 
				//
				//
				// We need to descover the threshold size, this will determine how much to deplete. 
				// this code ought to be considered arcane
				let thresholdSize = ClickyDrive.resources[item].totalAmountAvailable/(ClickyDrive.nodes[item].textures.length-1);
				
				for(let i =0; i<ClickyDrive.nodes[item].textures.length; i++)
				{
					
					// check if it is higher than threshold, then set it
					if(ClickyDrive.resources[item].amountAvailable <= (ClickyDrive.nodes[item].textures.length-1-i)*thresholdSize)
					{
					
						ClickyDrive.nodes[item].currentTexture.setTexture(ClickyDrive.game.textures.list[ClickyDrive.nodes[item].name+''+(i)]).setInteractive();
					
					}
					else
					{
						break;
					}
					
				}
			}
			
			
			
		}

		
		// Making nodes do some animation
		// this feels like bad code, but I don't know what to do about it.
		for(let i in ClickyDrive.nodes )
		{	
			if(ClickyDrive.resources[i].amountAvailable===0)
			{
				continue;
			}
			let speed = 0.02;
			// make node larger, if needbe.
			if( ClickyDrive.nodes[i].hovered && ClickyDrive.nodes[i].scale <1.10)
			{
				ClickyDrive.nodes[i].scale+=speed;
				
			}
			if( !ClickyDrive.nodes[i].hovered && ClickyDrive.nodes[i].scale >1.0)
			{
				ClickyDrive.nodes[i].scale-=speed;
				
			}
			ClickyDrive.nodes[i].currentTexture.setScale((ClickyDrive.nodes[i].size/ClickyDrive.nodes[i].currentTexture.height)*ClickyDrive.nodes[i].scale);
					
		}
		
		
	},

	
	
	// constructor
	resource:function( name, left)
	{
		this.name = name;
		
		this.totalAmountAvailable=left;
		this.amountAvailable=left;
		ClickyDrive.resources[name]=this;
		this.amount=0;
		this.perSecond=0;
		this.perClick=1;
		this.add=function(toAdd)
		{
			this.amountAvailable+=toAdd;
			
			this.totalAmountAvailable=this.amountAvailable;
		},

		this.mine = function()
		{
			// basically a copy of per second...
			// if that bad practice?
			let toAdd = this.perClick;
			console.log(this.amountAvailable + " availiable before... Attepting to add "+toAdd);
			if(this.amountAvailable===0)
			{ 
				return; // nothing left, just leave.
			}

			// we can get everything?
			if( toAdd <= this.amountAvailable)
			{
				this.amount+= toAdd; // take all that's due
				this.amountAvailable-=toAdd // and remove it from the stache.
			}
			else
			{
				// exaust whatever is remaining.
				this.amount+=this.amountAvailable;
				this.amountAvailable=0;	
			}

			console.log(this.amountAvailable+" availiable! After...");
		}
	},
	
	node:function(name, resource, locationX, locationY, enabled, textures, particle, depletedParticle,)
	{

		this.name = name;
		this.hovered=false;
		this.location = [locationX,locationY];
		this.size = 300; // might just never change...
		this.scale=1; // ranges between 1 and 1.1.
		this.textures=textures;
		this.enabled=enabled;
		this.particle=particle;
		this.depletedParticle=depletedParticle;
		
		ClickyDrive.nodes[name]=this;
		
		
	}
}

// config is last because the functions are defined in an object
let config =
{
   type: Phaser.AUTO,
   autoCenter: true,
   dom:{createContainer: true},
   parent: 'phaser-parent',
   scale: 
   {
  	// this would have taken a lot of work to get working, but phaser did it for me!
	// How kind.
	// not like I already did most of that work.
	// nope.
   	mode: Phaser.Scale.FIT,
	parent: 'phaser-parent',
   	width: 1600,
   	height: 900,
   },
	
   scene: 
   {
	preload: ClickyDrive.preload,
        create: ClickyDrive.create,
        update: ClickyDrive.update
   }
	
	
}