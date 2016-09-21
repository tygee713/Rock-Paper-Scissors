var config = {
  apiKey: "AIzaSyAfg-hWMpR6blUTSKVp-A4mxoyMGNNmpGY",
  authDomain: "rockpaperscissors-8cd70.firebaseapp.com",
  databaseURL: "https://rockpaperscissors-8cd70.firebaseio.com",
  storageBucket: "rockpaperscissors-8cd70.appspot.com",
  messagingSenderId: "979124762446"
};
firebase.initializeApp(config);

var database = firebase.database();
var p1Pick = "";
var p2Pick = "";
var p1Name = "";
var p2Name = "";
var numPlayers = 0;
var playerNum = 0;
var hasTwoPlayers = false;
var p1Wins = 0;
var p1Losses = 0;
var p2Wins = 0;
var p2Losses = 0;
var players = [];
var turn;
var playerRef;
var turnRef;
var setTurn = database.ref().child('turn');

//starts the game for each player
$("#start").on('click', function() {

  //checks if two users are already playing
  if (numPlayers < 2) {
    playerNum = numPlayers + 1;
    player = database.ref('/players').child(playerNum);
    players.push(player);

    //displays the correct player's buttons
    $('#p' + playerNum + "Buttons").show();
    player.set({ 
      name: $("#userName").val().trim(),
      wins: '0',
      losses: '0'
    });

    $('#p' + playerNum + "WL").html("Wins: 0, Losses: 0");

    playerRef = database.ref('/players/' + playerNum);
    turnRef = database.ref('/turn');
  }
  else {
    alert("Two players are already playing!");
  }

  if (numPlayers == 2) {
    turn = 1;
    setTurn.set(turn);
  }
  
  return false;
});


var connectionsRef = database.ref("/connectedData");

var connectedRef = database.ref(".info/connected");

//adds and removed connected data to a separate table, NEED TO REMOVE USER DATA
connectedRef.on("value", function(snap) {
  
  if(snap.val()) {
    var con = connectionsRef.push(true);
    // var connected = connectionsRef.child(playerNum);
    con.onDisconnect().remove();
  };

});

//attempting to remove the user data when a connected child gets removed, NOT WORKING
// connectionsRef.on("child_removed", function(snap) {
//   playerRef.remove();
//   turnRef.remove();
// });

//runs anytime the database is updated
database.ref().on("value", function(snapshot) {
  numPlayers = snapshot.child("players").numChildren();
  var p1Snap = snapshot.child("players").child('1');
  var p2Snap = snapshot.child("players").child('2');

  var player1Snap = p1Snap.child('name');
  var player2Snap = p2Snap.child('name');

  //once the player's names are in the database, store them locally
  if (player1Snap.exists()) {
    p1Name = p1Snap.val().name;
  }

  if (player2Snap.exists()) {
    p2Name = p2Snap.val().name;
  }

  var pick1Snap = p1Snap.child('pick');
  var pick2Snap = p2Snap.child('pick');

  //once the player's picks are in the database, store them locally
  if (pick1Snap.exists()) {
    p1Pick = p1Snap.val().pick;
  }

  if (pick2Snap.exists()) {
    p2Pick = p2Snap.val().pick;
  }

  //once both players have picked, compare the picks and determine the winner
  if (pick1Snap.exists() && pick2Snap.exists()) {
    comparePicks();
  }

  var turnSnap = snapshot.child("turn");

  if (turnSnap.exists()) {
    turn = snapshot.child("turn").val();
    $('#side' + turn).css("border", "1px solid yellow");
  }

  //not needed, messed up recording wins/losses
  // var wins1Snap = p1Snap.child('wins');
  // var losses1Snap = p1Snap.child('losses');
  // var wins2Snap = p2Snap.child('wins');
  // var losses2Snap = p2Snap.child('losses');

  // if (wins1Snap.exists()) {
  //   p1Wins = p1Snap.val().wins;
  // }
  // if (losses1Snap.exists()) {
  //   p1Losses = p1Snap.val().losses;
  // }
  // if (wins2Snap.exists()) {
  //   p2Wins = p2Snap.val().wins;
  // }
  // if (losses2Snap.exists()) {
  //   p2Losses = p2Snap.val().losses;
  // }

  }, function (errorObject) {
    // 
      console.log("The read failed: " + errorObject.code);
});

//when any of the player 1 buttons get clicked
$(".optionsP1").on('click', function() {
  if (turn == 1) {
    p1Pick = $(this).data('pick');
    var pick = database.ref('/players').child('1');
    pick.update({pick: p1Pick});
    turn = 2;
    setTurn.set(turn);
  }
  else {
    alert("It is not your turn!");
  }
});

//when any of the player 2 buttons get clicked
$(".optionsP2").on('click', function() {
  if (turn == 2) {
    p2Pick = $(this).data('pick');
    var pick = database.ref('/players').child('2');
    pick.update({pick: p2Pick});
    turn = 1;
    setTurn.set(turn);
  }
  else {
    alert("It is not your turn!");
  }
});

//determine a winner
function comparePicks() {
  if (p1Pick == p2Pick) {
    $("#playerWin").html('Tie');
  }
  else if (p1Pick == 'paper' && p2Pick == 'scissors') {
    $("#playerWin").html(p2Name + ' wins!');
    p2Wins++;
    p1Losses++;
  }
  else if (p1Pick == 'scissors' && p2Pick == 'paper') {
    $("#playerWin").html(p1Name + ' wins!');
    p1Wins++;
    p2Losses++;
  }
  else if (p1Pick == 'paper' && p2Pick == 'rock') {
    $("#playerWin").html(p1Name + ' wins!');
    p1Wins++;
    p2Losses++;
  }
  else if (p1Pick == 'rock' && p2Pick == 'paper') {
    $("#playerWin").html(p2Name + ' wins!');
    p2Wins++;
    p1Losses++;
  }
  else if (p1Pick == 'rock' && p2Pick == 'scissors') {
    $("#playerWin").html(p1Name + ' wins!');
    p1Wins++;
    p2Losses++;
  }
  else if (p1Pick == 'scissors' && p2Pick == 'rock') {
    $("#playerWin").html(p2Name + ' wins!');
    p2Wins++;
    p1Losses++;
  }

  updateWinsAndLosses();
  // clearPicks();
}

//after each round, update the win count of each player
function updateWinsAndLosses() {
  var p1Upd = database.ref('/players').child('1');
  p1Pick = "";
  p1Upd.child('pick').remove();

  p1Upd.update({
    wins: p1Wins, 
    losses: p1Losses
  });

  var p2Upd = database.ref('/players').child('2');
  p2Pick = "";
  p2Upd.child('pick').remove();

  p2Upd.update({
    wins: p2Wins,
    losses: p2Losses
  });

  $('#p1WL').html("Wins: " + p1Wins + ", Losses: " + p1Losses);
  $('#p2WL').html("Wins: " + p2Wins + ", Losses: " + p2Losses);
}

//after the picks have been compared, they get cleared both locally and on the database
//not needed, combined into updateWinsandLosses
// function clearPicks() {
//   p1Pick = "";
//   p2Pick = "";
//   var pick1Rem = database.ref('/players').child('1').child('pick');
//   pick1Rem.remove();
//   var pick2Rem = database.ref('/players').child('2').child('pick');
//   pick2Rem.remove();
// }

