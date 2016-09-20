// $(document).ready(function() {
//   playerNum = 0;

// });

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
    var players = [];
    var turn = 1;

  $("#start").on('click', function() {
    if (numPlayers < 2) {
      playerNum = numPlayers + 1;
      var player = database.ref('/players').child(playerNum);
      players.push(player);
      console.log("player " + playerNum + " is currently playing");
      $("#p" + playerNum + "Buttons").show();
      player.set({ 
        name: $("#userName").val().trim(),
        wins: p1Wins,
        losses: p1Losses
      });
      var setTurn = database.ref().child('turn');
      setTurn.set(turn);
    }
    else {
      alert("Two players are already playing!");
    }
    
    return false;
  });

var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if( snap.val() ) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();

  };

});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#connectedViewers").html(snap.numChildren());

});


database.ref().on("value", function(snapshot) {
      console.log("database updated");
      numPlayers = snapshot.child("players").numChildren();
      console.log("currently playing: " + numPlayers);
      var pick1Snap = snapshot.child("players").child('1').child('pick');
      var pick2Snap = snapshot.child("players").child('2').child('pick');

    if (pick1Snap.exists()) {
            p1Pick = snapshot.child("players").child('1').val().pick;
            console.log("player 1 picked: " + p1Pick);
         }
    if (pick2Snap.exists()) {
            p2Pick = snapshot.child("players").child('2').val().pick;
            console.log("player 2 picked: " + p2Pick);
         }
    if (pick1Snap.exists() && pick2Snap.exists()) {
        comparePicks();
    }

    }, function (errorObject) {
      // 
        console.log("The read failed: " + errorObject.code);
  });

// database.ref('/players').on("value", function(snapshot) {
  
//   });

  $(".optionsP1").on('click', function() {
    p1Pick = $(this).data('pick');
    var pick = database.ref('/players').child('1');
    pick.update({pick: p1Pick});
    console.log(p1Pick);
    // if (p1Pick != "" && p2Pick != "") {
    //   comparePicks();
    // }
    turn++;
    var setTurn = database.ref().child('turn');
      setTurn.set(turn);
  });


  $(".optionsP2").on('click', function() {
    p2Pick = $(this).data('pick');
    var pick = database.ref('/players').child('2');
    pick.update({pick: p2Pick});
    console.log(p2Pick);
    // if (p1Pick != "" && p2Pick != "") {
    //   comparePicks();
    // }
    turn = 1;
    var setTurn = database.ref().child('turn');
      setTurn.set(turn);
  });


function comparePicks() {
    if (p1Pick == p2Pick) {
      $("#playerWin").html('Tie');
    }
      else if (p1Pick == 'paper' && p2Pick == 'scissors') {

    }
      else if (p1Pick == 'scissors' && p2Pick == 'paper') {

    }
      else if (p1Pick == 'paper' && p2Pick == 'rock') {

    }
      else if (p1Pick == 'rock' && p2Pick == 'paper') {

    }
      else if (p1Pick == 'rock' && p2Pick == 'scissors') {

    }
      else if (p1Pick == 'scissors' && p2Pick == 'rock') {

    }

    clearPicks();
}


function clearPicks() {
  p1Pick = "";
  p2Pick = "";
  var pick1Rem = database.ref('/players').child('1').child('pick');
  pick1Rem.remove();
  var pick2Rem = database.ref('/players').child('2').child('pick');
  pick2Rem.remove();
}