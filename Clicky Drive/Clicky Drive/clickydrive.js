var ClickyDrive =
{
	
	game:undefined,
        versionString:"Clicky Drive v0.1.0.118 ",
	versionAppend:"",
	versionWatermark:undefined,
	vWatermarkX:0, // nope,  not anymore.
	vWatermarkY:0,
	vWatermarkStyle:{ fontFamily: '"Arial"', fontSize:'12pt', color:'white', strokeThickness:0 },
     	aspectRatio:16/9,
	background:undefined,
	ui:undefined,

	preload: function()
	{ 
		 console.log(ClickyDrive.versionString);
		 this.load.image('bg',ClickyDrive.background ); 
		 this.load.html('ui', ui);
	},
		

	create:function()
	{
		
		ClickyDrive.background = this.add.image(800,450, 'bg'); // must be in 16:9 aspect ratio.
		
		if (ClickyDrive.aspectRatio != ClickyDrive.background.width/ClickyDrive.background.height)
		{
		   throw "Background Aspect Ratio MUST be " + ClickyDive.aspectRatio +" width/height!"
		}
		// resize the background.
                ClickyDrive.background.setScale(config.scale.height/ClickyDrive.background.height);

		// Watermark things properly.
		ClickyDrive.versionWatermark = this.add.text(ClickyDrive.vWatermarkX, ClickyDrive.vWatermarkY, ClickyDrive.versionString+ClickyDrive.versionAppend, ClickyDrive.vWatermarkStyle);
    		ClickyDrive.versionWatermark.originX=-.5; // make it easier to deal with
		ClickyDrive.versionWatermark.originY=-.5;
		
		
		// add in a dom
		this.add.dom(0, 0, 'div', 'background-color: lime; width: 220px; height: 100px; font: 48px Arial', 'Phaser');
	


	},
	
	update:function()
	{
		// let's try to only resize after resizing is done, to prevent lag. Don't do it every frame during user resizing.
	
	
	}

	
}

config =
{
   type: Phaser.AUTO,
   autoCenter: true,
   dom:
   {
     createContainer: true
   },
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



