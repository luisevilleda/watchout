var Board = function Board() {
  this.mouseR = 10;
  this.enemyR = 20; 

  this.enemyTick = 5000;
  this.animationDuration = 5000;
  this.baseCollisionTick = 20;
  this.enemyUpdate = true;
  this.startClock = false;

  this.enemyTimeout;
  this.collisionTimout;

  this.boardHeight = window.innerHeight;
  this.boardWidth = window.innerWidth;
  this.background = 'lightblue';

  // this.selection = d3.select('.board').select('svg');
  this.baseEnemyCount = 5;

  this.enemyData = [];
  
};

Board.prototype.makeEnemyData = function makeEnemyData(n) {
  var newEnemies = [];
  for (var i = 0; i < n; i++) {
    var x = randomNumber(0, this.boardWidth);
    var y = randomNumber(0, this.boardHeight);
    var newEnemy = {cx: x, cy: y, r: this.enemyR, class: 'enemy', fill: 'black'};
    newEnemies.push(newEnemy);
  }
  return newEnemies;
};

Board.prototype.update = function update() {
  if (this.enemyUpdate) {
    var selection = d3.select('.board').select('svg').selectAll('.enemy').data(this.enemyData);
    
    selection.transition().duration(this.animationDuration)
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

Board.prototype.updateMouse = function updateMouse(mouseData) {
  var selection = d3.select('.board').select('svg').selectAll('.mouse').data(mouseData);

  //updates the pointer
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

Board.prototype.moveEnemies = function moveEnemies() {
  this.enemyData = this.enemyData.map((function(enemy) {
    enemy.cx = randomNumber(0, this.boardWidth);
    enemy.cy = randomNumber(0, this.boardHeight);

    return enemy;
  }).bind(this));
};

Board.prototype.enemyClock = function enemyClock() {
  //do some work with enemyData
  this.moveEnemies();

  //update enemys
  this.update();

  //setup setTimeout to run again
  this.enemyTimeout = setTimeout(this.enemyClock.bind(this), this.enemyTick);
};

Board.prototype.collisionClock = function collisionClock() {
  var enemyArr = d3.select('.board').select('svg').selectAll('.enemy');
  var collisionTick = this.baseCollisionTick;

  this.enemyUpdate = true;
  var currentScore = d3.select('.currentScoreSpan');
  //slsect the mouse object
  var mouse = d3.select('.board').select('svg').selectAll('.mouse');
  var mouseX = +mouse.attr('cx');
  var mouseY = +mouse.attr('cy');

  for (var i = 0; i < enemyArr[0].length; i++) {
    var thisEnemy = d3.select(enemyArr[0][i]);
    var cx = thisEnemy.attr('cx');
    var cy = thisEnemy.attr('cy');
    var enemyRadius = +thisEnemy.attr('r');
    // console.log(Math.sqrt( Math.pow(mouseX - cx, 2) + Math.pow( mouseY - cy, 2)), (mouseR + enemyRadius));
    if ( Math.sqrt( Math.pow(mouseX - cx, 2) + Math.pow(mouseY - cy, 2)) < (this.mouseR + enemyRadius) ) {
      // console.log('collision');
      // collisionTick = 2000;
      // this.enemyUpdate = false;

      //stop transition by sceduling another
      enemyArr.transition();


      //this resets the asteroid count and asteriods back to the base number
      this.enemyData = [];
      this.update();
      this.enemyData = this.makeEnemyData(this.baseEnemyCount);
      this.update();
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
  //gert currentScore and check for conditions
  currentScore.text(Number(currentScore.text()) + 1);

  if (Number(currentScore.text()) % 200 === 0) {
    var increaseAmount = 5;
    var newEnemies = this.makeEnemyData(increaseAmount);
    this.enemyData = this.enemyData.concat(newEnemies);
    // this.update();
  }

  this.collisionTimeout = setTimeout(this.collisionClock.bind(this), collisionTick);
};











































