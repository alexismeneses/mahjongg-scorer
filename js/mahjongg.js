mahjongg = {};

mahjongg.Player = function()
{
};

mahjongg.round = 0;
mahjongg.east = 0;
mahjongg.Player.prototype.name = "Player";
mahjongg.Player.prototype.score = 1000;

mahjongg.init = function()
{
  mahjongg.players = [ new mahjongg.Player(), new mahjongg.Player(), new mahjongg.Player(), new mahjongg.Player()];
  mahjongg.players[0].name = localStorage.getItem("name0") || 'Player 1';
  mahjongg.players[1].name = localStorage.getItem("name1") || 'Player 2';
  mahjongg.players[2].name = localStorage.getItem("name2") || 'Player 3';
  mahjongg.players[3].name = localStorage.getItem("name3") || 'Player 4';

  mahjongg.players[0].score = localStorage.getItem("score0") || 1000;
  mahjongg.players[1].score = localStorage.getItem("score1") || 1000;
  mahjongg.players[2].score = localStorage.getItem("score2") || 1000;
  mahjongg.players[3].score = localStorage.getItem("score3") || 1000;
  
  for(var i = 0; i < 4; i++)
  {
    mahjongg.players[i].score = parseInt(mahjongg.players[i].score);
  }

  window.setInterval(function()
      {
        mahjongg.update();
      }, 1000);
};

mahjongg.update = function()
{
  for (var i = 0 ; i < 4 ; i++)
  {
    var name = mahjongg.players[i].name;
    if (i == mahjongg.east)
    {
      name += "*";
    }
    $('.auto-name' + i).html(name);
    $('#score' + i).html(mahjongg.players[i].score);
  }
};

mahjongg.endRound = function(winner, scores)
{
  $("#log").append("<div>Round " + mahjongg.round + ", winner is " + mahjongg.players[winner].name + "</div>");
  var east = mahjongg.east;
  for (var i = 0 ; i < 4 ; i++)
  {
    var name1 = mahjongg.players[i].name;
    for (var j = 0 ; j < 4 ; j++)
    {
      var name2 = mahjongg.players[j].name;
      if (i == j)
      {
        continue;
      }
      if (j == winner)
      {
        continue;
      }
      var payment = parseInt(scores[i]);
      if (i == east || j == east)
      {
        payment *= 2;
      }
      $("#log").append("<div>" + name2 + " pays " + payment + " to " + name1 + " </div>");
      mahjongg.players[i].score = parseInt(mahjongg.players[i].score) + payment;
      mahjongg.players[j].score = parseInt(mahjongg.players[j].score) - payment;
    }
  }
  mahjongg.round++;
  if (east != winner)
  {
    mahjongg.east = (mahjongg.east + 1) % 4;
  }
  mahjongg.store();
};

mahjongg.reset = function()
{
  for (var i = 0 ; i < 4 ; i++)
  {
    mahjongg.players[i].score = 1000;
  }
  mahjongg.store();
};

mahjongg.store = function()
{
  for (var i = 0 ; i < 4 ; i++)
  {
    localStorage.setItem("name" + i, mahjongg.players[i].name);
    localStorage.setItem("score" + i, mahjongg.players[i].score);
  }
};

mahjongg.submit = function()
{
  mahjongg.endRound(parseInt($("#inputWinner").val()),
      [
        parseInt($("#inputScore0").val()),
        parseInt($("#inputScore1").val()),
        parseInt($("#inputScore2").val()),
        parseInt($("#inputScore3").val()),
      ]);
};

mahjongg.init();