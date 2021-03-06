(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

var Game = Asteroids.Game = function () {
  this.lives = 3;
  this.score = 0;
  this.difficulty = 0.5;
  this.NUM_ASTEROIDS = 35;
  this.asteroids = [];
  this.blocks = [];
  this.addAsteroids();
  this.addShip();
};
Game.prototype.DIM_X = 600;
Game.prototype.DIM_Y = 600;

Game.prototype.allOjbects = function () {
  if (this.ship) {
    return [].concat(this.asteroids, [this.ship]);
  } else {
    return this.asteroids;
  }
};

Game.prototype.addAsteroids = function () {
  for (var i = 0; i < this.NUM_ASTEROIDS; i++) {
    this.asteroids.push(this.generateAsteroid());
  }
};

Game.prototype.addShip = function (pos) {
  this.ship = new Asteroids.Ship({ pos: pos, game: this });
};

Game.prototype.checkCollisions = function (object) {
  var objects = this.allOjbects();
  if (objects.length > 0) {
    for (var i = 0; i < objects.length; i++) {
      if (object.isCollided(objects[i]) && object != objects[i]) {
        return true;
      }
    }
  }
  return object.hittingWall();
};

Game.prototype.draw = function (ctx) {
  ctx.clearRect(0,0, this.DIM_X, this.DIM_Y);
  this.allOjbects().forEach( function (object) {
    object.draw(ctx);
  });
  if (this.growingBlock) {
    this.growingBlock.draw(ctx);
  }
};

Game.prototype.loseLife = function () {
  this.lives --;
};

Game.prototype.generateAsteroid = function () {
  var collided = true;
  var newAsteroid = {};
  while (collided) {
    var position = this.randomPosition();
    newAsteroid = new Asteroids.Asteroid({game: this, pos: position});
    collided = this.checkCollisions(newAsteroid);
 }
  return newAsteroid;
};

Game.prototype.moveObjects = function () {
  this.scoreTick();
  this.allOjbects().forEach( function (object) {
    object.move();

    // check wall collisions
    if (object.hittingWall()) {
      object.collideWall();
    }

    // object collisions
    this.allOjbects().forEach( function (otherObject) {
      if (object !== otherObject && object.isCollided(otherObject)) {
        object.collide(otherObject);
      }
    }.bind(this));
  }.bind(this));
};

Game.prototype.outOfBounds = function (pos) {
  return !(pos[0] >= 0 && pos[0] <= this.DIM_X && pos[1] >= 0 && pos[1] <= this.DIM_Y);
};

Game.prototype.randomPosition = function () {
  var x = Math.random() * this.DIM_X;
  var y = Math.random() * this.DIM_Y;
  return [x, y];
};

Game.prototype.remove = function (obj) {
  if (obj instanceof Asteroids.Asteroid) {
    var index = this.asteroids.indexOf(obj);
    this.asertoids[index] = this.generateAsteroid();
  } else if (obj instanceof Asteroids.GrowingBlock) {
    this.growingBlock = null;
  }
};

Game.prototype.scoreTick = function () {
  this.score += this.difficulty * this.NUM_ASTEROIDS / 100;
};

})();
