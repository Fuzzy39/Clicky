
var background;






var ClickyDrive =
{
	
	game:undefined,
        versionString:"Clicky Drive v0.1.0.94 ",
	versionAppend:"",
	versionWatermark:undefined,
	vWatermarkX:0, // with 1 being the edge of the screen.
	vWatermarkY:0,
	vWatermarkStyle:{ fontFamily: '"Arial"', fontSize:'12pt', color:'white', strokeThickness:0 },
     	aspectRatio:16/9,
	background:undefined,
	

	preload: function()
	{ 
		 console.log(ClickyDrive.versionString);
		 this.load.image('bg',ClickyDrive.background );
		 this.load.image('node', 'assets/gold0.png');
		 
	
	},
		

	create:function()
	{
		
		ClickyDrive.background = this.add.image(0,0, 'bg'); // must be in 16:9 aspect ratio.
		
		if (ClickyDrive.aspectRatio != ClickyDrive.background.width/ClickyDrive.background.height)
		{
		   throw "Background Aspect Ratio MUST be " + ClickyDive.aspectRatio +" width/height!"
		}
		
		//  this figures whether that is true.
		ClickyDrive.versionWatermark = this.add.text(ClickyDrive.vWatermarkX, ClickyDrive.vWatermarkY, ClickyDrive.versionString+ClickyDrive.versionAppend, ClickyDrive.vWatermarkStyle);
    		ClickyDrive.versionWatermark.originX=-.5; // make it easier to deal with
		ClickyDrive.versionWatermark.originY=-.5;
		
		ClickyDrive.scaleAll();
	


		//resize listener
		window.addEventListener('resize', () => {ClickyDrive.scaleAll();});
	},
	
	update:function()
	{
		// let's try to only resize after resizing is done, to prevent lag. Don't do it every frame during user resizing.
	
	
	},

	scaleAll:function ()
	{
		// not only resize, but maintain aspect ratio, which is 16 by 9.
		ClickyDrive.game.resize(window.innerWidth, window.innerHeight);
		background=ClickyDrive.background;

	    	background.x=window.innerWidth/2;
                background.y=window.innerHeight/2;
	

	
	
		// dyamically set the scale to the shorter of the two diminsions.
	
		windowAspectRatio = window.innerWidth/window.innerHeight;
		// if it is higher it is too wide, if it is lower it is too high.
		if(windowAspectRatio>ClickyDrive.aspectRatio)
		{
			// set to height.
			background.setScale(window.innerHeight/background.height);
			
		}
		else
		{
			background.setScale(window.innerWidth/background.width);
		
		}
	
		// needs to be at end to prevent death
		ClickyDrive.versionWatermark.y = (ClickyDrive.vWatermarkY*background.displayHeight) + background.y -(background.displayHeight/2);
		ClickyDrive.versionWatermark.x = (ClickyDrive.vWatermarkX*background.displayWidth) +background.x -(background.displayWidth/2);
		// tidy it back up
		ClickyDrive.background=background;
	
	}
}

config =
{
   type: Phaser.AUTO,
	
   // an exeptionally shit fix to a problem.
   // The 3 is arbitrary, but should not be larger than 5.
   width: window.innerWidth*3,
   height: window.innerHeight*3,
		
   scene: 
   {
	preload: ClickyDrive.preload,
        create: ClickyDrive.create,
        update: ClickyDrive.update
   }
	
	
}

