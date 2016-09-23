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

//create an svg append to board
var boardHeight = 500;
var boardWidth = 700;
var boardBackground = 'lightblue';
d3.select('.board').append('svg').style({'height': boardHeight + 'px', 'width': boardWidth + 'px', 'background': boardBackground });

//create the asteroids
//decide how many we want
var asteroidCount = 100;
var asteroidData = [];
//create an asteroids array data set
for (var i = 0; i < asteroidCount; i++) {
  var x = randomNumber(0, boardWidth);
  var y = randomNumber(0, boardHeight);
  var circleSize = 10;
  var newAsteroid = {cx: x, cy: y, r: circleSize, class: 'asteroid', fill: 'black'};
  asteroidData.push(newAsteroid);
}
    //assign x and y to each
      //based on svg size



//make an update function
var animationDuration = 1000;
var update = function update(asteroidData) {
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
};


var moveAsteroids = function(asteroidData) {
  asteroidData = asteroidData.map(function(asteroid) {
    asteroid.cx = randomNumber(0, boardWidth);
    asteroid.cy = randomNumber(0, boardHeight);

    return asteroid;
  });
  console.log('HEY', asteroidData.length)

  return asteroidData;
};

var clockTimeout;
var tick = 1000;
var clock = function() {
  //do some work with asteroidData
  asteroidData = moveAsteroids(asteroidData);

  //update Asteroids
  update(asteroidData);

  //setup setTimeout to run again
  clockTimeout = setTimeout( clock, tick);
};
clock();

d3.select('.board').select('svg').on('mousemove', function(d, i) {
  mouse = d3.mouse(this);
  mouseX = mouse[0];
  mouseY = mouse[1];
  console.log('mouseX =' + mouseX + ' and mouseY =' + mouseY + '.');
});
