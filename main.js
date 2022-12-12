/*
Learn how to use Hexi to build a simple game prototype
*/

//Create a new Hexi instance, and start it
let g = hexi(512, 512, setup, ["sounds/chimes.wav"]);

//Set the background color and scale the canvas
g.backgroundColor = "#5883c4";
g.scaleToWindow();

//Start Hexi
g.start();

//Declare your global variables (global to this game, which means you
//want to use them in more than one function)
let player, enemy, gameScene, hud, cannonBalls;


function makeSailsBar() {
  let padding = 4,
    oneBarWidth = 32,
    oneBarHeight = 16,
    numBars = 3,
    sailsBarBackground = g.rectangle((oneBarWidth + padding) * numBars + padding, oneBarHeight + 2 * padding, "black"),
    individualBars = [];

  for (i = 0; i < numBars; ++i) {
    let thisBar = g.rectangle(oneBarWidth, oneBarHeight, "white");
    thisBar.x = (padding + oneBarWidth) * i + padding;
    thisBar.y = padding;
    individualBars.push(thisBar);
  }

  sailsBar = g.group();
  sailsBar.addChild(sailsBarBackground)
  individualBars.forEach(bar => { sailsBar.addChild(bar) })
  sailsBar.bars = individualBars;
  return sailsBar;
}

//The `setup` function runs once and is used to initializes your game
function setup() {

  //Create the `gameScene` group
  gameScene = g.group();


  //The player sprite
  player = g.rectangle(48, 32, "brown");
  player.x = g.canvas.width / 2 - player.halfWidth;
  player.y = g.canvas.height / 2 - player.halfHeight;
  gameScene.addChild(player);

  //Supply the ASCII key code value as the single argument
  let aKey = g.keyboard(65),
    dKey = g.keyboard(68),
    wKey = g.keyboard(87),
    sKey = g.keyboard(83),
    spaceBar = g.keyboard(32);

  player.pivotX = 0.5;
  player.pivotY = 0.5;
  player.rotation = 0;
  player.drotation = 0;
  player.sails = 0;


  let kDeltaRotation = 0.01;
  aKey.press = () => {
    if (dKey.isDown) {
      player.drotation = 0;
    } else {
      player.drotation = -kDeltaRotation;
    }
  };
  aKey.release = () => {
    if (dKey.isDown) {
      player.drotation = kDeltaRotation;
    } else {
      player.drotation = 0;
    }
  };

  dKey.press = () => {
    if (aKey.isDown) {
      player.drotation = 0;
    } else {
      player.drotation = kDeltaRotation;
    }
  };
  dKey.release = () => {
    if (aKey.isDown) {
      player.drotation = -kDeltaRotation;
    } else {
      player.drotation = 0;
    }
  };

  wKey.press = () => {
    player.sails = Math.min(player.sails + 1, 3);
  };
  sKey.press = () => {
    player.sails = Math.max(player.sails - 1, 0);
  };

  cannonBalls = [];
  spaceBar.press = () => {

    /*
    let ballSize = 16, ballSpeed = 7, ball = g.circle(ballSize, "black");
    ball.anchor.set(0.5, 0.5);
    // Temporary add the cannonball as a child to get relative position.
    player.addChild(ball);
    ball.x = -16;
    ball.y = 0;

    // Store the relative offset in the gameScene.
    var mapPos = ball.toLocal(ball.position, gameScene);
    // Move the ball into the gameScene and update its position.
    gameScene.addChild(ball);
    ball.position = mapPos;
    
    // Send the ball on its way.
    ball.vx = Math.cos(player.rotation) * ballSpeed;
    ball.vy = Math.sin(player.rotation) * ballSpeed;

    cannonBalls.push(ball);
    */
    //Shoot the bullet.
    g.shoot(
      player, //The shooter
      player.rotation, //The angle at which to shoot (4.71 is up)
      32, //Bullet's x position on the cannon
      0, //Bullet's y position on the canon
      gameScene, //The container to which the bullet should be added
      0.5, //The bullet's speed (pixels per frame)
      cannonBalls, //The array used to store the bullets

      //A function that returns the sprite that should
      //be used to make each bullet
      () => g.circle(16, "black")
    );

  };


  hud = {};
  hud.sailsBar = makeSailsBar();
  hud.sailsBar.x = g.canvas.width - (sailsBar.width + 16);
  hud.sailsBar.y = 16;

  enemy = g.rectangle(48, 32, "brown");
  enemy.x = 256;
  enemy.y = 128;
  gameScene.addChild(enemy);

  //set the game state to `play`
  g.state = play;
}

function sailsToVelocity(sails) {
  return [0, 0.3, 1, 2][sails]
}

function updateSailsBar(sails) {
  let sailsBar = hud.sailsBar;
  for (i = 0; i < sailsBar.bars.length; ++i) {
    let bar = sailsBar.bars[i];
    if (sails > i) {
      bar.alpha = 1.0;
    } else {
      bar.alpha = 0.25;
    }
  }
}


//The `play` function contains all the game logic and runs in a loop
function play() {

  g.move(cannonBalls);

  player.rotation += player.drotation;
  //Move the player
  updateSailsBar(player.sails)
  let playerVelocity = sailsToVelocity(player.sails),
    dx = Math.cos(player.rotation) * playerVelocity,
    dy = Math.sin(player.rotation) * playerVelocity;

  player.x += dx;
  player.y += dy;
  gameScene.x -= dx;
  gameScene.y -= dy;
}

function end() {

}


