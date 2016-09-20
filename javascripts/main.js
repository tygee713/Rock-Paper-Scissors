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
  var hasTwoPlayers = false;
  var p1Wins = 0;
  var p1Losses = 0;

  // $(document).ready(function() {
  //   numPlayers++;
  //   database.child('players').set({ numPlayers: numPlayers});
  // }


  $("#start").on('click', function() {
    if (numPlayers < 2) {
      var postsRef = database.ref().child("players").child(numPlayers);
      postsRef.set({ 
        name: $("#userName").val().trim(),
        wins: p1Wins,
        losses: p1Losses
      });
      // postsRef.push().set({
      //   name: $("#userName").val().trim(),
      //   wins: p1Wins,
      //   losses: p1Losses
      // });
    }
    else {
      alert("Two players are already playing!");
    }
    
  });


  database.ref().on("value", function(snapshot) {
    console.log("database updated");
    numPlayers = snapshot.child("players").numChildren();
    console.log(numPlayers);
  }, function (errorObject) {
    // 
      console.log("The read failed: " + errorObject.code);
  });


  $(".optionsP1").on('click', function() {
    p1Pick = $(this).data('pick');
    console.log(p1Pick);
    if (p1Pick != "" && p2Pick != "") {
      comparePicks();
    }
  });


  $(".optionsP2").on('click', function() {
    p2Pick = $(this).data('pick');
    console.log(p2Pick);
    if (p1Pick != "" && p2Pick != "") {
      comparePicks();
    }
  });


function comparePicks() {
  database.ref().set({p1Pick: p1Pick, p2Pick: p2Pick});
    if (p1Pick == p2Pick) {
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
}