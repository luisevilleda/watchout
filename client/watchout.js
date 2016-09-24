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

//create a new board
var newBoard = new Board();

d3.select('.board').append('svg').style({'height': newBoard.boardHeight + 'px', 'width': newBoard.boardWidth + 'px', 'background': newBoard.background });


newBoard.enemyData = newBoard.makeEnemyData(newBoard.baseEnemyCount);
var newBoardData = newBoard.enemyData;
console.log();


//EVENT HANDLERS

d3.select('.board').select('svg').on('mousemove', function(d, i) {
  // console.log('THIS:',this);
  var mouse = d3.mouse(this);
  var mouseX = mouse[0];
  var mouseY = mouse[1];
  newBoard.updateMouse([{mouseX: mouseX, mouseY: mouseY, class: 'mouse', fill: 'red', r: newBoard.mouseR}]);

  if (newBoard.startClock === false) {
    newBoard.update();
    newBoard.enemyClock();
    newBoard.collisionClock();
    newBoard.startClock = true;
  }
});

d3.select('.board').select('svg').on('mouseover', function(d, i) {
  d3.select(this).style('cursor', 'none');
});

d3.select('.board').select('svg').on('mouseout', function(d, i) {
  d3.select(this).style('cursor', 'default');
});
