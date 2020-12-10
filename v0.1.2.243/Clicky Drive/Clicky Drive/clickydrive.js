"use strict";
var ClickyDrive =
{
	
	game:undefined,
    versionString:"Clicky Drive v0.1.2.243 ",
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
						 
			ClickyDrive.ui=this.add.dom(0,0).createFromHTML(this.cache.html.get('ui'));
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
		for  ( let i in ClickyDrive.resources)
		{	
	
			// make some of each resource.
			ClickyDrive.resources[i].make(ClickyDrive.resources[i].perSecond/60);
	
		}

		
		// Making nodes do some animation
		// this feels like bad code, but I don't know what to do about it.
		for(let i in ClickyDrive.nodes )
		{	
	
			// figure out node depletion
			ClickyDrive.nodes[i].determineDepletionState();
			ClickyDrive.nodes[i].animate();
	
			
					
		}
		 
		ClickyDrive.hookins.update();
			 
			
		
	},

	hookins:function()
	{
		this.update = function(){};
	},
	
	// constructor
	resource:function( name, left, enabled)
	{
		this.name = name;
		
		this.totalAmountAvailable=left;
		this.amountAvailable=left;
		ClickyDrive.resources[name]=this;
		this.enabled=enabled;
		this.amount=0;
		this.perSecond=0;
		this.perClick=1;
		
		// adds to availaible, not to current count.
		this.add=function(toAdd)
		{
			this.amountAvailable+=toAdd;
			
			this.totalAmountAvailable=this.amountAvailable;
		},

		this.mine = function()
		{
			
			// mining is just clicking a node to get a resource.
			this.make(this.perClick);
			
		},
		
		// get x amount of the resource
		this.make = function(toAdd)
		{
			
			if(!this.enabled)
			{
				
				ClickyDrive.nodes[this.name].currentTexture.setTint(0xdddddd);
				return;
			}
			
			
			if(this.amountAvailable===0)
			{ 
				
				ClickyDrive.nodes[this.name].currentTexture.setTint(0xdddddd);
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
				// if a resource is disabled.
				
				ClickyDrive.nodes[this.name].currentTexture.setTint(0xdddddd);
			}
			
		}
	},
	
	
	
	
	node:function(name, locationX, locationY, textures, particle, depletedParticle)
	{

		this.name = name;
		this.hovered=false;
		this.location = [locationX,locationY];
		this.size = 300; // might just never change...
		this.scale=1; // ranges between 1 and 1.1.
		this.scaleLimits=[1,1.1];
		this.scaleSpeed=.02;
		this.textures=textures;
	
		this.particle=particle;
		this.depletedParticle=depletedParticle;
		
		ClickyDrive.nodes[name]=this;
		
		this.determineDepletionState = function()
		{
			
			if(ClickyDrive.resources[this.name].amountAvailable===0)
			{
				// this line of code is so long that it's a sin of some kind.
				this.currentTexture.setTexture(this.name+''+(this.textures.length-1));
			
			}
			else
			{
				
				// We need to descover the threshold size, this will determine how much to deplete. 
				// this code ought to be considered arcane
				let thresholdSize = ClickyDrive.resources[this.name].totalAmountAvailable/(this.textures.length-1);
				
				for(let i =0; i<this.textures.length; i++)
				{
					
					// check if it is higher than threshold, then set it
					if(ClickyDrive.resources[this.name].amountAvailable <= (this.textures.length-1-i)*thresholdSize)
					{
					
						ClickyDrive.nodes[this.name].currentTexture.setTexture(this.name+''+(i));
					
					}
					else
					{
						break;
					}
					
				}
				
			}
			
			
			
		},
		
		this.animate = function()
		{
			let i = this.name;
			if(ClickyDrive.resources[i].amountAvailable===0 ||  !ClickyDrive.resources[i].enabled )
			{
				this.scale=this.scaleLimits[0];
				
			}
			else
			{
				// make node larger, if needbe.
				if( this.hovered && this.scale < this.scaleLimits[1])
				{
					this.scale+=this.scaleSpeed;
					
				}
				if( !this.hovered && this.scale > this.scaleLimits[0])
				{
					this.scale-=this.scaleSpeed;
					
				}
			}
			this.currentTexture.setScale((this.size/this.currentTexture.height)*this.scale);
		}
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