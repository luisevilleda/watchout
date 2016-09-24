// start slingin' some d3 here.


//create asteroids
  //asteroids will be an array of sub-arry x, y coords within the board
    //every time we want to move the asteroids, loop through the asteroids array
      //generate a random x, y within the bounds of the board

//track your mouse pointer
  //store the mouse coords in an array [x, y]
    // coordinates = d3.mouse(this);
  //access x, y
    //var x = coordinates[0];
    //var y = coordinates[1];

//##########################################################################################################
var randomNumber = function randomNumber(startIndex, endIndex) {
  return Math.floor( Math.random() * (endIndex - startIndex + 1) ) + startIndex;
};
//start clock
var startClock = false;

//Mouse radius
var mouseR = 10;



//create an svg append to board
var boardHeight = 500;
var boardWidth = 700;
var boardBackground = 'lightblue';
d3.select('.board').append('svg').style({'height': boardHeight + 'px', 'width': boardWidth + 'px', 'background': boardBackground });

//create the asteroids
//decide how many we want
var baseAsteroidCount = 5;
var asteroidCount = baseAsteroidCount;
var asteroidData = [];
var asteroidR = 10;
//create an asteroids array data set
var createAsteroidData = function createAsteroidData(n) {
  var newAsteroids = [];
  for (var i = 0; i < n; i++) {
    var x = randomNumber(0, boardWidth);
    var y = randomNumber(0, boardHeight);
    var newAsteroid = {cx: x, cy: y, r: asteroidR, class: 'asteroid', fill: 'black'};
    newAsteroids.push(newAsteroid);
  }
  return newAsteroids;
};
asteroidData = createAsteroidData(asteroidCount);
    //assign x and y to each
      //based on svg size



//make an update function
var asteroidUpdate = true;
var animationDuration = 1000;
var update = function update(asteroidData) {
  if (asteroidUpdate) {
    var selection = d3.select('.board').select('svg').selectAll('.asteroid').data(asteroidData);
    

    selection.transition().duration(animationDuration)
    .attr('cx', function(d) { return d.cx; } )
    .attr('cy', function(d) { return d.cy; } )
    .attr('r', function(d) { return d.r; } )
    .attr('class', function(d) { return d.class; } )
    .attr('fill', function(d) { return d.fill; } );

    selection.enter().append('circle')
    .attr('cx', function(d) { return d.cx; } )
    .attr('cy', function(d) { return d.cy; } )
    .attr('r', function(d) { return d.r; } )
    .attr('class', function(d) { return d.class; } )
    .attr('fill', function(d) { return d.fill; } );

    selection.exit().remove();
  }
};

var updateMouse = function updateMouse(mouseData) {
  var selection = d3.select('.board').select('svg').selectAll('.mouse').data(mouseData);

  selection
  .attr('cx', function(d) { return d.mouseX; })
  .attr('cy', function(d) { return d.mouseY; })
  .attr('r', function(d) { return d.r; })
  .attr('class', function(d) { return d.class; })
  .attr('fill', function(d) { return d.fill; });

  selection.enter().append('circle')
  .attr('cx', function(d) { return d.mouseX; })
  .attr('cy', function(d) { return d.mouseY; })
  .attr('r', function(d) { return d.r; })
  .attr('class', function(d) { return d.class; })
  .attr('fill', function(d) { return d.fill; });

  selection.exit().remove();

};


var moveAsteroids = function(asteroidData) {
  asteroidData = asteroidData.map(function(asteroid) {
    asteroid.cx = randomNumber(0, boardWidth);
    asteroid.cy = randomNumber(0, boardHeight);

    return asteroid;
  });

  return asteroidData;
};

var asteroidTimeout;
var asteroidTick = 1000;
var asteroidClock = function() {

  //do some work with asteroidData
  asteroidData = moveAsteroids(asteroidData);

  //update Asteroids
  update(asteroidData);


  //setup setTimeout to run again
  asteroidTimeout = setTimeout( asteroidClock, asteroidTick);
};

var collisionTimeout;
var collisionTick = 20;
var collisionClock = function() {
  var asteroidsArr = d3.select('.board').select('svg').selectAll('.asteroid');
  var currentScore = d3.select('.currentScoreSpan');
  collisionTick = 20;
  asteroidUpdate = true;
  for (var i = 0; i < asteroidsArr[0].length; i++) {
    var thisAsteroid = d3.select(asteroidsArr[0][i]);
    var cx = thisAsteroid.attr('cx');
    var cy = thisAsteroid.attr('cy');
    var asteroidRadius = +thisAsteroid.attr('r');
    // console.log(Math.sqrt( Math.pow(mouseX - cx, 2) + Math.pow( mouseY - cy, 2)), (mouseR + asteroidRadius));
    if ( Math.sqrt( Math.pow( mouseX - cx, 2) + Math.pow( mouseY - cy, 2)) < (mouseR + asteroidRadius) ) {
      // console.log('collision');
      collisionTick = 3000;
      asteroidUpdate = false;
      //this resets the asteroid count and asteriods back to the base number
      asteroidCount = baseAsteroidCount;
      asteroidData = createAsteroidData(asteroidCount);
      var highScore = d3.select('.highScoreSpan');
      var collisionsSpan = d3.select('.collisionsSpan');

      //update the highscore
      if ( +highScore.text() < +currentScore.text() ) {
        highScore.text(currentScore.text());
      }
      //resets your score
      currentScore.text('-1');
      collisionsSpan.text( Number(collisionsSpan.text()) + 2 );
    }
  }
  currentScore.text(Number(currentScore.text()) + 1);
  if (Number(currentScore.text()) % 200 === 0) {
    asteroidCount = asteroidCount + 5;
    var newAsteroids = createAsteroidData(asteroidCount);
    asteroidData.concat(newAsteroids);
  }

  collisionTimeout = setTimeout(collisionClock, collisionTick);
};



//EVENT HANDLERS
var mouseX;
var mouseY;
d3.select('.board').select('svg').on('mousemove', function(d, i) {
  if (startClock === false) {
    asteroidClock();
    collisionClock();
    startClock = true;
  }
  // console.log('THIS:',this);
  mouse = d3.mouse(this);
  mouseX = mouse[0];
  mouseY = mouse[1];
  updateMouse([{mouseX: mouseX, mouseY: mouseY, class: 'mouse', fill: 'red', r: mouseR}]);
});

d3.select('.board').select('svg').on('mouseover', function(d, i) {
  d3.select(this).style('cursor', 'none');
});

d3.select('.board').select('svg').on('mouseout', function(d, i) {
  d3.select(this).style('cursor', 'default');
});
