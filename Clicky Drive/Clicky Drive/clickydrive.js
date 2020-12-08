"use strict";
var ClickyDrive =
{
	
	game:undefined,
        versionString:"Clicky Drive v0.1.1.173 ",
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
			ClickyDrive.nodes[i].currentTexture = this.add.image(ClickyDrive.nodes[i].location[0] ,ClickyDrive.nodes[i].location[1], ClickyDrive.nodes[i].name+'0');
			// and set its scale.
			ClickyDrive.nodes[i].currentTexture.setScale(ClickyDrive.nodes[i].size/ClickyDrive.nodes[i].currentTexture.height);
			ClickyDrive.nodes[i].currentTexture.inputEnabled = true;
			
		}

	},
	
	update:function()
	{

		// Getting resources per second. Simple!
		for  ( let item in ClickyDrive.resources)
		{	
			let toAdd = ClickyDrive.resources[item].perSecond/60;

			if(ClickyDrive.resources[item].amountAvailible===0)
			{ 
				continue; // nothing left, just leave.
			}

			// we can get everything?
			if( toAdd >= ClickyDrive.resources[item].amountAvailible)
			{
				ClickyDrive.resources[item].amount+= toAdd; // take all that's due
				ClickyDrive.resources[item].amountAvailible-=toAdd // and remove it from the stache.
			}
			else
			{
				// exaust whatever is remaining.
				ClickyDrive.resources[item].amount+=ClickyDrive.resources[item].amountAvailible;
				ClickyDrive.resources[item].amountAvailible=0;	
			}
		}
	},

	
	
	// constructor
	resource:function( name, amountAvailible)
	{
		this.name = name;
		
		this.totalAmountAvailible=amountAvailible;
		this.amountAvailible=amountAvailible;
		ClickyDrive.resources[name]=this;
		this.amount=this.amountAvailible;
		this.perSecond=0;
		this.perClick=1;
		this.add=function(toAdd)
		{
			this.amountAvailible+=toAdd;
			
			this.totalAmountAvailible=this.amountAvailible;
		}
	},
	
	node:function(name, resource, locationX, locationY, enabled, textures, particle, depletedParticle)
	{

		this.name = name;
		this.location = [locationX,locationY];
		this.size = 300; // might just never change...
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