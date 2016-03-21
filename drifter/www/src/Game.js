/* jshint browser:true */
///////////////////////////////////////////////////////////////////////////////
///////                             BULLET                              ///////
///////////////////////////////////////////////////////////////////////////////

Bullet = function(game, pngId)
{
    Phaser.Sprite.call(this, game, 0, 0, pngId);
    
    this.game = game;
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.update = function()
{

};

Bullet.prototype.fire = function(x, y, angle, speed, gx, gy)
{
    gx = gx || 0;
    gy = gy || 0;
    this.reset(x, y);
    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    this.angle = angle;

    this.body.gravity.set(gx, gy);
};


///////////////////////////////////////////////////////////////////////////////
///////                        WEAPON BASE                              ///////
///////////////////////////////////////////////////////////////////////////////


Weapon = {};

Weapon.SingleBullet = function(game, owner)
{
        this.owner = owner;
        this.game = game;
        Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 100;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet5'), true);
        }

        this.currentAperture = 270;
        this.apertureIncrease = 5;
        console.log("HOLTY");
        return this;

};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x - 10;
    var y = source.y + 10;
    var minAperture = -this.owner.currentAperture + 270;
    var maxAperture = this.owner.currentAperture + 270;

    this.currentAperture = this.owner.currentAperture;
    //var aperture = this.game.rnd.integerInRange(minAperture, maxAperture);
    this.getFirstExists(false).fire(x, y, this.currentAperture , this.bulletSpeed, 0, 0);
    this.nextFire = this.game.time.time + this.fireRate;
};

///////////////////////////////////////////////////////////////////////////////
///////                        WEAPON LASER                             ///////
///////////////////////////////////////////////////////////////////////////////


Weapon.Laser = function(game, owner)
{
    this.owner = owner;
    this.game = game;
    Phaser.Group.call(this, game, game.world, 'Laser', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.fireRate = 45;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    this.currentAperture = owner.currentAperture;
    
    return this;
};


Weapon.Laser.prototype = Object.create(Phaser.Group.prototype);
Weapon.Laser.prototype.constructor = Weapon.Laser;

Weapon.Laser.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x - 10;
    var y = source.y + 10;
    

    this.currentAperture = this.owner.currentAperture;
    this.fireRate = 1600;
    b = this.getFirstExists(false);
    b.scale.setTo(5, 5);//.fire(x, y, this.currentAperture , this.bulletSpeed, 0, 0);
    b.fire(x - b.width * .45, y, this.currentAperture , this.bulletSpeed, 0, 0);
    console.log("PHAT BITCHES");
    this.nextFire = this.game.time.time + this.fireRate;  

};

// GH: ship Class
Ship = function(game, x, y, pngId)
{
    this.game = game;
    Phaser.Sprite.call(this, game, x, y, pngId);
    
    game.add.existing(this);
    game.physics.arcade.enable(this);
     // GH: Set the aperture.
    this.maxAperture = 45;
    this.currentAperture = 0 ;
    this.weapons = [];
    this.weapons.push( new Weapon.SingleBullet(game, this) );
    this.weapons.push( new Weapon.Laser(game, this));
    this.currentWeapon = 0;
    
    // GH: switch weapon
    this.aKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.dKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    
    this.aKey.onDown.add(this.prevWeapon, this);
    this.dKey.onDown.add(this.nextWeapon, this);
    
};

Ship.prototype = Object.create(Phaser.Sprite.prototype);
Ship.prototype.constructor = Ship; 

// GH: Override update function
Ship.prototype.update = function()
{
    this.checkAngleInput();
    // GH: Firing mah lazors
  
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.Q))
    {
        this.weapons[this.currentWeapon].fire(this);
    }
    this.checkStrafe();
    
};

Ship.prototype.checkAngleInput = function()
{
    this.rotation = this.game.math.angleBetween(this.x, this.y, this.game.input.activePointer.x, this.game.input.activePointer.y);
    this.currentAperture = this.rotation;
    this.currentAperture = 0;//this.rightWing.angle;  
};
// GH: Strafe.
Ship.prototype.checkStrafe = function ()
{
    
   
};


Ship.prototype.changeWeapon = function(direction)
{   
    this.weapons[this.currentWeapon].visible = false;
    this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
    this.weapons[this.currentWeapon].setAll('exists', false);
    this.currentWeapon += direction;
    this.checkWeaponCycle();
    this.weapons[this.currentWeapon].visible = true;
};

Ship.prototype.prevWeapon = function()
{
   this.changeWeapon(-1);
};

Ship.prototype.nextWeapon = function()
{
    this.changeWeapon(1);
};

Ship.prototype.getCurrentWeapon = function()
{
    return this.weapons[this.currentWeapon];
};
Ship.prototype.checkWeaponCycle = function()
{
    if(this.currentWeapon < 0)
    {
        this.currentWeapon = this.weapons.length - 1;
    }
   
    else if (this.currentWeapon > this.weapons.length - 1)
    {
        this.currentWeapon = 0;
    }
};


// create BasicGame Class
BasicGame = 
{

};

// create Game function in BasicGame
BasicGame.Game = function (game)
{
};

// set Game function prototype
BasicGame.Game.prototype = {

    init: function () {
        // set up input max pointers
        this.input.maxPointers = 1;
        // set up stage disable visibility change
        this.stage.disableVisibilityChange = true;
        // Set up the scaling method used by the ScaleManager
        // Valid values for scaleMode are:
        // * EXACT_FIT
        // * NO_SCALE
        // * SHOW_ALL
        // * RESIZE
        // See http://docs.phaser.io/Phaser.ScaleManager.html for full document
        this.scale.scaleMode = Phaser.ScaleManager.RESIZE;
        // If you wish to align your game in the middle of the page then you can
        // set this value to true. It will place a re-calculated margin-left
        // pixel value onto the canvas element which is updated on orientation /
        // resizing events. It doesn't care about any other DOM element that may
        // be on the page, it literally just sets the margin.
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        // Force the orientation in landscape or portrait.
        // * Set first to true to force landscape. 
        // * Set second to true to force portrait.
        this.scale.forceOrientation(false, true);
        // Sets the callback that will be called when the window resize event
        // occurs, or if set the parent container changes dimensions. Use this 
        // to handle responsive game layout options. Note that the callback will
        // only be called if the ScaleManager.scaleMode is set to RESIZE.
        this.scale.setResizeCallback(this.gameResized, this);
        // Set screen size automatically based on the scaleMode. This is only
        // needed if ScaleMode is not set to RESIZE.
        this.scale.updateLayout(true);
        // Re-calculate scale mode and update screen size. This only applies if
        // ScaleMode is not set to RESIZE.
        this.scale.refresh();

    },

    preload: function () {

        // Here we load the assets required for our preloader (in this case a 
        // background and a loading bar)
        this.load.image('logo', 'asset/phaser.png');
    },

    create: function () {
        // GH: Create ship
        
    },

    gameResized: function (width, height) {

        // This could be handy if you need to do any extra processing if the 
        // game resizes. A resize could happen if for example swapping 
        // orientation on a device or resizing the browser window. Note that 
        // this callback is only really useful if you use a ScaleMode of RESIZE 
        // and place it inside your main game state.

    }

};