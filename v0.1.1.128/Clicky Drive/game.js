
// Style Watermark
ClickyDrive.versionAppend="Running Test v31";
ClickyDrive.vWatermarkStyle.strokeThickness=.5;
ClickyDrive.vWatermarkStyle.fontSize=20;
// Select Background.ui
ClickyDrive.background='Assets/Background.png';

// set ui
ClickyDrive.ui='testui.html';
// start the game	
ClickyDrive.game = new Phaser.Game(config);

var game = 
{
	click:function()
	{
		console.log("you clicked me!");
	}
}