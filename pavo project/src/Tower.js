

/* Class File for Tower*/
Tower = function (game, x, y, key, bulletkey) {
  // Define null variables for tower class
  Phaser.Sprite.call(this, game, x, y, key);
  this.anchor.x = 0.5;
  this.anchor.y = 0.5;
  this.weapon = game.add.weapon(30, bulletkey);

  // kills bullet if left world
  this.weapon.bulletKillDistance = 200;
  this.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
  this.weapon.bulletSpeed = 300;
  this.weapon.fireRate = 500;
  this.damage = 1;
  // tracks the pos of the tower
  this.weapon.trackSprite(this,0,0,true);

  // circle for range
  this.towerRange = new Phaser.Circle(x, y, (this.weapon.bulletKillDistance*2));
  this.target = null;
  this.game.physics.enable(this, Phaser.Physics.ARCADE);

  this.shootsfx = game.add.audio('shootsfx');
  };

Tower.prototype = Object.create(Phaser.Sprite.prototype);
Tower.prototype.constructor = Tower;

/* Fires at this.target */
Tower.prototype.updateRange = function() {
    this.towerRange = new Phaser.Circle(this.x,this.y, (this.weapon.bulletKillDistance*2));
};

Tower.prototype.fireAt = function () {
    this.shootsfx.play();
    this.weapon.fireAtSprite(this.target);
    game.physics.arcade.overlap(this.target, this.weapon.bullets, collisionHandler, null, this);
};

/* Finds a target for the tower
 * Pass in a Phaser.group of sprites */
Tower.prototype.selectTarget = function(targets) {
  var inRange;
  if(this.target != null) {
      inRange = (this.towerRange.contains(this.target.x, this.target.y));  // check if current is inrange
  } else inRange = false;
  if(this.target == null || !inRange  || this.target.alive == false ) { // if target is not valid then find new
    this.target = null;
    targets.forEachAlive(distanceFormula, this);
  }
  if(this.target != null && inRange) {
      
    this.fireAt(); // call the fire function
  }
};

Tower.prototype.update = function () {

};

/****************Static functions************************/
Tower.myload = function (game) {
  game.load.image('tower', 'img/tower.png');
  game.load.image('bullet', 'img/explosion.png');
}

/*creates a group that towers can be added to*/
Tower.createGroup = function (game) {
  var t = game.add.group();  // create a new group in the phaser game object
  t.classType = Tower;  // set the classType to be our extended sprite class 'Tower'
  return t;             // returns a refernce to this group
}

//  Called if the bullet hits one of the veg sprites
collisionHandler = function (sprite, bullet) {
    bullet.kill();
    sprite.hp -= this.damage;
    if(sprite.hp <= 0){
        sprite.kill();
    }
}

// Checks teh distance between Alive targets and the tower object
distanceFormula = function (target) {
var contained = this.towerRange.contains(target.x, target.y); // set variable to if current target from group is in range
if(contained) {
  if(this.target == null) {  // if our current target is null make the first target in group the new target
    this.target = target;
  } else {
    var current = game.physics.arcade.distanceBetween(target, this, true);  // check distance between current target and target of the group
    var old = game.physics.arcade.distanceBetween(this.target, this, true);
    if(current < old) {                                                    // set the current target if its closer than the old
      this.target = target;
    }
  }
 }
}


