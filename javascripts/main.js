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
var numPlayers = 0;
var playerNum = 0;
var hasTwoPlayers = false;
var p1Wins = 0;
var p1Losses = 0;
var p2Wins = 0;
var p2Losses = 0;
var players = [];
var turn = 1;
var playerRef;

//starts the game for each player
$("#start").on('click', function() {

  //checks if two users are already playing
  if (numPlayers < 2) {
    playerNum = numPlayers + 1;
    player = database.ref('/players').child(playerNum);
    players.push(player);

    //displays the correct player's buttons
    $("#p" + playerNum + "Buttons").show();
    player.set({ 
      name: $("#userName").val().trim(),
      wins: '0',
      losses: '0'
    });
    var setTurn = database.ref().child('turn');
    setTurn.set(turn);

    playerRef = database.ref('/players/' + playerNum);
  }
  else {
    alert("Two players are already playing!");
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
connectionsRef.on("child_removed", function(snap) {
  playerRef.remove();
});

//runs anytime the database is updated
database.ref().on("value", function(snapshot) {
  numPlayers = snapshot.child("players").numChildren();

  var pick1Snap = snapshot.child("players").child('1').child('pick');
  var pick2Snap = snapshot.child("players").child('2').child('pick');

  //once the player's picks are in the database, store them locally
  if (pick1Snap.exists()) {
    p1Pick = snapshot.child("players").child('1').val().pick;
  }

  if (pick2Snap.exists()) {
    p2Pick = snapshot.child("players").child('2').val().pick;
  }

  //once both players have picked, compare the picks and determine the winner
  if (pick1Snap.exists() && pick2Snap.exists()) {
    comparePicks();
  }

  }, function (errorObject) {
    // 
      console.log("The read failed: " + errorObject.code);
});

//when any of the player 1 buttons get clicked
$(".optionsP1").on('click', function() {
  p1Pick = $(this).data('pick');
  var pick = database.ref('/players').child('1');
  pick.update({pick: p1Pick});
  turn = 2;
  var setTurn = database.ref().child('turn');
    setTurn.set(turn);
});

//when any of the player 2 buttons get clicked
$(".optionsP2").on('click', function() {
  p2Pick = $(this).data('pick');
  var pick = database.ref('/players').child('2');
  pick.update({pick: p2Pick});
  turn = 1;
  var setTurn = database.ref().child('turn');
    setTurn.set(turn);
});

//determine a winner
function comparePicks() {
  if (p1Pick == p2Pick) {
    $("#playerWin").html('Tie');
  }
  else if (p1Pick == 'paper' && p2Pick == 'scissors') {
    $("#playerWin").html('Tie');
  }
  else if (p1Pick == 'scissors' && p2Pick == 'paper') {
    $("#playerWin").html('Tie');
  }
  else if (p1Pick == 'paper' && p2Pick == 'rock') {
    $("#playerWin").html('Tie');
  }
  else if (p1Pick == 'rock' && p2Pick == 'paper') {
    $("#playerWin").html('Tie');
  }
  else if (p1Pick == 'rock' && p2Pick == 'scissors') {
    $("#playerWin").html('Tie');
  }
  else if (p1Pick == 'scissors' && p2Pick == 'rock') {
    $("#playerWin").html('Tie');
  }

  clearPicks();
}

//after the picks have been compared, they get cleared both locally and on the database
function clearPicks() {
  p1Pick = "";
  p2Pick = "";
  var pick1Rem = database.ref('/players').child('1').child('pick');
  pick1Rem.remove();
  var pick2Rem = database.ref('/players').child('2').child('pick');
  pick2Rem.remove();
}