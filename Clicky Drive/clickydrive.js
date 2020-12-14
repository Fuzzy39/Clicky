"use strict";
// utils
function getRndInteger( min, max ) {  return Math.floor( Math.random( ) * ( max - min ) ) + min;  }

var ClickyDrive =
{

	game:undefined,
    versionString:"Clicky Drive v0.1.4.316 ",
	versionAppend:"",
	versionWatermark:undefined,
	vWatermarkX:0, // in 'pixels'
	vWatermarkY:0,
	vWatermarkStyle:{ fontFamily: '"Arial"', fontSize:'20pt', color:'white', strokeThickness:.5 },
    aspectRatio:16/9,
	
	
	background:undefined,
	ui:undefined,

	fragments:[],

	resources:
	{
		//user defined
	},
	
	nodes:
	{
		// user defined.
	},
	
	items:
	{
		//user defined.
	},

	preload: function()
	{ 
		
		
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
			
			if(ClickyDrive.nodes[i].fragment!=undefined)
			{
				this.load.image( ClickyDrive.nodes[i].fragment, ClickyDrive.nodes[i].fragment); 
			}
			
			if(ClickyDrive.nodes[i].depletedFragment!=undefined)
			{
				this.load.image( ClickyDrive.nodes[i].depletedFragment, ClickyDrive.nodes[i].depletedFragment);
			}
			
			if(ClickyDrive.nodes[i].glow.texture!=undefined)
			{
				// so for future reference, just use the texture's path for name, who cares.
				this.load.image( ClickyDrive.nodes[i].glow.texture,  ClickyDrive.nodes[i].glow.texture);
			}
			
		}
	},
		

	create:function()
	{
		// this needs to be cleaned up!
		
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
			
			// add glows for the nodes, first, because they are behind.
			if(ClickyDrive.nodes[i].glow.texture !=undefined)
			{
				ClickyDrive.nodes[i].glow.texture = this.add.image(ClickyDrive.nodes[i].location[0] ,ClickyDrive.nodes[i].location[1], ClickyDrive.nodes[i].glow.texture);
				ClickyDrive.nodes[i].glow.texture.setScale(ClickyDrive.nodes[i].glow.scale);
			}
			
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
				ClickyDrive.resources[ClickyDrive.nodes[i].name].mine(pointer.x,pointer.y); // simple, right?
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
	
			// Determine perSecond and add it.
			ClickyDrive.resources[i].update();
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
		 
		for (let i in ClickyDrive.items)
		{
				ClickyDrive.items[i].update();
				ClickyDrive.items[i].onUpdate();
		}
		
		for(let i in ClickyDrive.fragments)
		{
			if(ClickyDrive.fragments[i].animate!=undefined)
			{
				ClickyDrive.fragments[i].animate();
			}
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
		this.perSecondMultipler=1;
		this.perClick=1;
		
		// adds to availaible, not to current count.
		this.add=function(toAdd)
		{
			this.amountAvailable+=toAdd;
			
			this.totalAmountAvailable=this.amountAvailable;
		},

		this.mine = function(x,y)
		{
			
			// mining is just clicking a node to get a resource.
			let mined= this.make(this.perClick)
			
			for(let i = 0; i<Math.floor(Math.log(this.perClick) / Math.log(100))+1; i++)
			{
				if(mined)
				{
					//and also making a fragment.
					ClickyDrive.fragments.push(new ClickyDrive.fragment(ClickyDrive.nodes[this.name].fragment, x,y, ClickyDrive.nodes[this.name].fragmentScale));
					
				}
				
				if(mined==false)
				{
				
					ClickyDrive.fragments.push(new ClickyDrive.fragment(ClickyDrive.nodes[this.name].depletedFragment, x,y, ClickyDrive.nodes[this.name].fragmentScale));
				}
			}
			
		},
		
		// get x amount of the resource
		this.make = function(toAdd)
		{
			
			if(!this.enabled)
			{
				
				ClickyDrive.nodes[this.name].currentTexture.setTint(0xdddddd);
				return null;
			}
			
			
			if(this.amountAvailable===0)
			{ 
				
				//ClickyDrive.nodes[this.name].currentTexture.setTint(0xdddddd);
				return false; // nothing left, just leave.
				
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
			
			return true;
			
		},
		
		this.update = function()
		{
			// calculate per second.
			
			this.perSecond=0;
			for(let i in ClickyDrive.items)
			{
			
				for(let j in ClickyDrive.items[i].perSecond)
				{
					if(j==this.name)
					{
						this.perSecond+=ClickyDrive.items[i].perSecond[j];
					}
				}
			}
			this.perSecond*=this.perSecondMultipler;
			
			// per second Claculated, add to this.
			
			
		}
	},
	
	
	
	
	
	
	node:function(name, locationX, locationY, textures)
	{

		this.name = name;
		this.hovered=false;
		this.location = [locationX,locationY];
		this.size = 300; // might just never change...
		this.scale=1; // ranges between 1 and 1.1.
		this.scaleLimits=[1,1.1];
		this.scaleSpeed=.02;
		this.textures=textures;
	
		this.fragmentScale=undefined;
		this.fragment=undefined;
		this.depletedFragment=undefined;
		
		ClickyDrive.nodes[name]=this;
		this.glow =
		{
			resource:name,
			texture:undefined,
			scale:1,
			rotationSpeed:1,
			animate:function()
			{
						
				if(this.texture!= undefined)
				{
					this.texture.angle+=this.rotationSpeed;
				
				
					if(ClickyDrive.resources[this.resource].amountAvailable!=0)
					{
						this.texture.setScale(this.scale);
					}
					else
					{
						this.texture.setScale(0);
					}
				}
				
			}
		}
		
		
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
		
		
		// Controls things like hovering effecs.
		this.animate = function()
		{
			let i = this.name;
			if( !ClickyDrive.resources[i].enabled )
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
			// animate glow.
			this.glow.animate();
			
		}
	},
	
	
	
	fragment:function( fragment, positionX, positionY, scale)
	{
		if(fragment===undefined|| fragment===null)
		{
			return;
		}
		this.texture=ClickyDrive.game.scene.getAt(0).add.image(positionX,positionY,fragment);

		this.texture.setScale(scale);
		this.texture.angle = getRndInteger(-180,180);
		this.velX=getRndInteger(-10,10);
		this.velY=getRndInteger(-2,-15);
		this.velAngle=this.velX;
		this.animate = function()
		{
			let gravity = 1;
			this.texture.x+=this.velX;
			this.texture.y+=this.velY;
			this.texture.angle+=this.velAngle;
			this.velY+=gravity;
			
		}
		
		
	},
	
	item:function(name, baseCosts, costExponent, basePerSecond)
	{
		this.name = name;
		ClickyDrive.items[name]=this;
		this.maxAmount=Infinity;
		this.baseCosts=baseCosts; // formatted like  {gold:20,crab:10}
		this.costExponent=costExponent;
		this.basePerSecond=basePerSecond; // formatted like costs
		this.perSecondMultiplier = 1;
		
		this.amount=0;
		this.costs= {};
		this.perSecond= {};
		
		

		this.update=function()
		{
			
			for( let i in this.basePerSecond)
			{	
				
				this.perSecond[i] = this.basePerSecond[i]*this.amount*this.perSecondMultiplier;
				
			}
			
			for( let i in this.baseCosts)
			{
				
				this.costs[i]=Math.floor((this.costExponent**this.amount)*this.baseCosts[i]);
				
				
			}
			
			
			
		}
		
		this.onUpdate=function() //  can be user defined.
		{
			
		} 
		
		
		
		this.purchase=function()
		{
			if(this.amount===this.maxAmount)
			{
				return false;
			}
			
			for(let i in this.costs)
			{
				
				if(ClickyDrive.resources[i].amount < this.costs[i] )
				{
					return false;
				}
			}
			
			for(let i in this.costs)
			{
				
				ClickyDrive.resources[i].amount -=this.costs[i];
				
			}
			
			this.amount++;
			this.update();
			this.onPurchase();
			return true;
		}
		
		this.onPurchase=function(){}; // user defined.
		
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