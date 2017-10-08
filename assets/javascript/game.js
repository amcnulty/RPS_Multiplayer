if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    var choices = {
        Rock: {defeates: ["Scissors"]},
        Paper: {defeates: ["Rock"]},
        Scissors: {defeates: ["Paper"]}
    }

    var config = {
        apiKey: "AIzaSyCyz-OvL_NXg-Lsjnqc015ofFCcFAKcclQ",
        authDomain: "rps-multiplayer-bc526.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-bc526.firebaseio.com",
        projectId: "rps-multiplayer-bc526",
        storageBucket: "",
        messagingSenderId: "932333388322"
    };
    firebase.initializeApp(config);
    var database = firebase.database();
    database.ref().on("value", function(snapshot) {
        if (snapshot.val()) {
            console.log(snapshot.val());
            if (snapshot.val().players.one === undefined || snapshot.val().players.two === undefined) {
                database.ref("/turn").remove();
            }
            else game.twoPlayers = true;
        }
    });
    
    database.ref("players").on("value", function(snapshot) {
        console.log("players updating");
        if(game.playerNumber === 1) {
            database.ref("players/one").onDisconnect().remove();
        }
        else if (game.playerNumber === 2) {
            database.ref("players/two").onDisconnect().remove();
        }
        try {
            if (snapshot.val().one != undefined) {
                console.log("updating player 1 slot with: " + snapshot.val().one.name);
                game.fillPlayerSlot(1, snapshot.val().one.name);
                game.playerOneWins.innerHTML = snapshot.val().one.wins;
                game.playerOneLosses.innerHTML = snapshot.val().one.losses;
            }
            else if (snapshot.val().one === undefined) {
                console.log("Resetting player one slot");
                game.resetPlayerSlot(1);
            }
            if (snapshot.val().two != undefined) {
                console.log("updating player 2 slot with: " + snapshot.val().two.name);
                game.fillPlayerSlot(2, snapshot.val().two.name);
                game.playerTwoWins.innerHTML = snapshot.val().two.wins;
                game.playerTwoLosses.innerHTML = snapshot.val().two.losses;
            }
            else if (snapshot.val().two === undefined) {
                console.log("Restting player two slot");
                game.resetPlayerSlot(2);
            }
        }
        catch (e) {}
    });
    
    var game = {
        playerNumber: 0,
        playerName: "",
        twoPlayers: false,
        wins: 0,
        losses: 0,
        infoMessage: document.getElementById("infoMessage"),
        newPlayerInput: document.getElementById("newPlayerInput"),
        newPlayerSubmitButton: document.getElementById("newPlayerSubmitButton"),
        playerOneName: document.getElementById("playerOneName"),
        playerOneRock: document.getElementById("playerOneRock"),
        playerOnePaper: document.getElementById("playerOnePaper"),
        playerOneScissors: document.getElementById("playerOneScissors"),
        playerOneWinLoss: document.getElementById("playerOneWinLoss"),
        playerOneWins: document.getElementById("playerOneWins"),
        playerOneLosses: document.getElementById("playerOneLosses"),
        playerTwoName: document.getElementById("playerTwoName"),
        playerTwoRock: document.getElementById("playerTwoRock"),
        playerTwoPaper: document.getElementById("playerTwoPaper"),
        playerTwoScissors: document.getElementById("playerTwoScissors"),
        playerTwoWinLoss: document.getElementById("playerTwoWinLoss"),
        playerTwoWins: document.getElementById("playerTwoWins"),
        playerTwoLosses: document.getElementById("playerTwoLosses"),
        messages: document.getElementById("messages"),
        messageInput: document.getElementById("messageInput"),
        sendMessageSubmitButton: document.getElementById("sendMessageSubmitButton"),
        addPlayer: function(playerName) {
            game.playerName = playerName;
            database.ref().once("value").then(function(snapshot) {
                try {
                    if (snapshot.val().players.one === undefined) {
                        setPlayerNumber(1);
                    }
                    else {
                        setPlayerNumber(2);
                    }
                }
                catch (e) {
                    setPlayerNumber(1);
                }
            });
            function setPlayerNumber(number) {
                if (number === 1) {
                    game.playerNumber = 1;
                    database.ref("players/one").set({
                        name: playerName,
                        wins: 0,
                        losses: 0
                    });
                }
                else {
                    game.playerNumber = 2;
                    database.ref("players/two").set({
                        name: playerName,
                        wins: 0,
                        losses: 0
                    });
                }
                game.checkPlayers();
                game.fillPlayerSlot(number, playerName);
            }
        },
        fillPlayerSlot: function(slot, name) {
            if (slot === 1) {
                game.playerOneName.innerHTML = name;
                if (slot === game.playerNumber) {
                    game.playerOneRock.style.display = "block";
                    game.playerOnePaper.style.display = "block";
                    game.playerOneScissors.style.display = "block";
                }
            }
            else {
                game.playerTwoName.innerHTML = name;
                if (slot === game.playerNumber) {
                    game.playerTwoRock.style.display = "block";
                    game.playerTwoPaper.style.display = "block";
                    game.playerTwoScissors.style.display = "block";
                }
            }
            game.playerOneWinLoss.style.display = "block";
            game.playerTwoWinLoss.style.display = "block";
        },
        resetPlayerSlot: function(slot) {
            if (slot === 1) {
                game.playerOneName.innerHTML = "Player 1";
            }
            else {
                game.playerTwoName.innerHTML = "Player 2";
            }
        },
        checkPlayers: function() {
            if (game.twoPlayers) {
                game.setTurn(1);
            }
        },
        setTurn: function(turn) {
            database.ref("turn").set(1);
        },
        makeSelection: function(choice) {
            database.ref().once("value").then(function(snapshot) {
                if (snapshot.val().turn === game.playerNumber) {
                    console.log("Player " + game.playerNumber + " chose: " + choice);
                    if (game.playerNumber === 1) {
                        database.ref("players/one").update({
                            choice: choice
                        });
                        database.ref("turn").set(2);
                    }
                    else {
                        database.ref("players/two").update({
                            choice: choice
                        });
                    }
                    if (game.playerNumber === 2) {
                        game.checkVictory();
                    }
                }
            })
        },
        checkVictory: function() {
            database.ref("/players").once("value").then(function(snapshot) {
                var p1Choice = snapshot.val().one.choice;
                var p2Choice = snapshot.val().two.choice;
                if (p1Choice === p2Choice) console.log("TIE");
                else {
                    var userChoice = choices[p1Choice];
                    if (userChoice.defeates.indexOf(p2Choice) > -1) {
                        console.log("Player 1 wins with: " + p1Choice);
                        game.changeScore(1);
                    }
                    else {
                        console.log("Player 2 wins with: " + p2Choice);
                        game.changeScore(2);
                    }
                }
            });
            database.ref("turn").set(1);
        },
        changeScore: function(winner) {
            database.ref("players").once("value", function(snapshot) {
                if (winner === 1) {
                    var newWins = snapshot.val().one.wins;
                    var newLosses = snapshot.val().two.losses;
                    database.ref("players/one").update({
                        wins: ++newWins
                    })
                    database.ref("players/two").update({
                        losses: ++newLosses
                    })
                }
                else {
                    var newWins = snapshot.val().two.wins;
                    var newLosses = snapshot.val().one.losses;
                    database.ref("players/one").update({
                        losses: ++newLosses
                    })
                    database.ref("players/two").update({
                        wins: ++newWins
                    })
                }
            })
        }
    }
    
    game.newPlayerSubmitButton.addEventListener("click", function(e) {
        e.preventDefault();
        game.addPlayer(game.newPlayerInput.value.trim());
    });

    $(".moveSelection").on("click", function(e) {
        console.log(e.currentTarget.innerHTML);
        game.makeSelection(e.currentTarget.innerHTML);
    })
}