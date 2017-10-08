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
            // console.log(snapshot.val());
            if (snapshot.val().players.one === undefined || snapshot.val().players.two === undefined) {
                database.ref("/turn").remove();
            }
            else game.twoPlayers = true;
        }
    });
    
    database.ref("players").on("value", function(snapshot) {
        if(game.playerNumber === 1) {
            database.ref("players/one").onDisconnect().remove();
        }
        else if (game.playerNumber === 2) {
            database.ref("players/two").onDisconnect().remove();
        }
        try {
            if (snapshot.numChildren() === 2) {
                if (game.playerNumber === 1) {
                    game.opponentName = snapshot.val().two.name;
                    if (parseInt(snapshot.val().one.wins) > game.wins) {
                        console.log("Player 1 wins!");
                        game.wins = snapshot.val().one.wins;
                        game.victoryMessage.innerHTML = "You Won!";
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.displayChoices(1);
                        }, 2000);
                    }
                    else if (parseInt(snapshot.val().one.losses) > game.losses) {
                        console.log("Player 1 looses");
                        game.losses = snapshot.val().one.losses;
                        game.victoryMessage.innerHTML = snapshot.val().two.name + " won!";
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.displayChoices(1);
                        }, 2000);
                    }
                    else if (parseInt(snapshot.val().one.ties) > game.ties) {
                        game.ties = snapshot.val().one.ties;
                        game.victoryMessage.innerHTML = "TIE!";
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.displayChoices(1)
                        }, 2000);
                    }
                }
                else {
                    game.opponentName = snapshot.val().one.name;
                    if (parseInt(snapshot.val().two.wins) > game.wins) {
                        console.log("Player 2 wins!");
                        game.wins = snapshot.val().two.wins;
                        game.victoryMessage.innerHTML = "You Won!";
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.displayChoices(2);
                        }, 2000);
                    }
                    else if (parseInt(snapshot.val().two.losses) > game.losses) {
                        console.log("Player 2 looses");
                        game.losses = snapshot.val().two.losses;
                        game.victoryMessage.innerHTML = snapshot.val().one.name + " won!";
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.displayChoices(2);
                        }, 2000);
                    }
                    else if (parseInt(snapshot.val().two.ties) > game.ties) {
                        game.ties = snapshot.val().two.ties;
                        game.victoryMessage.innerHTML = "TIE!";
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.displayChoices(2);
                        }, 2000);
                    }
                }
            }
            else if (snapshot.numChildren() === 1 && game.playerNumber != 0) {
                game.infoMessage.innerHTML = "Waiting for another player to join";
            }
            if (snapshot.val().one != undefined) {
                game.playerOneName.innerHTML = snapshot.val().one.name;
                game.playerOneWins.innerHTML = snapshot.val().one.wins;
                game.playerOneLosses.innerHTML = snapshot.val().one.losses;
            }
            else if (snapshot.val().one === undefined) {
                game.resetPlayerSlot(1);
            }
            if (snapshot.val().two != undefined) {
                game.playerTwoName.innerHTML = snapshot.val().two.name;
                game.playerTwoWins.innerHTML = snapshot.val().two.wins;
                game.playerTwoLosses.innerHTML = snapshot.val().two.losses;
            }
            else if (snapshot.val().two === undefined) {
                game.resetPlayerSlot(2);
            }
        }
        catch (e) {}
    });

    database.ref("turn").on("value", function(snapshot) {
        if (snapshot.val() === 1) {
            if (game.playerNumber === 1) {
                game.infoMessage.innerHTML = "It's Your Turn!";
            }
            else game.infoMessage.innerHTML = "Waiting for " + game.opponentName;
        }
        if (snapshot.val() === 2) {
            if (game.playerNumber === 1) {
                game.infoMessage.innerHTML = "Waiting for " + game.opponentName;
            }
            else game.infoMessage.innerHTML = "It's Your Turn!";
        }
    })
    
    var game = {
        playerNumber: 0,
        playerName: "",
        opponentName: "",
        twoPlayers: false,
        wins: 0,
        losses: 0,
        ties: 0,
        victoryMessage: document.getElementById("victoryMessage"),
        infoMessage: document.getElementById("infoMessage"),
        newPlayerInput: document.getElementById("newPlayerInput"),
        newPlayerSubmitButton: document.getElementById("newPlayerSubmitButton"),
        playerOneName: document.getElementById("playerOneName"),
        playerOneRock: document.getElementById("playerOneRock"),
        playerOnePaper: document.getElementById("playerOnePaper"),
        playerOneScissors: document.getElementById("playerOneScissors"),
        playerOneMoveChoice: document.getElementById("playerOneMoveChoice"),
        playerOneWinLoss: document.getElementById("playerOneWinLoss"),
        playerOneWins: document.getElementById("playerOneWins"),
        playerOneLosses: document.getElementById("playerOneLosses"),
        playerTwoName: document.getElementById("playerTwoName"),
        playerTwoRock: document.getElementById("playerTwoRock"),
        playerTwoPaper: document.getElementById("playerTwoPaper"),
        playerTwoScissors: document.getElementById("playerTwoScissors"),
        playerTwoMoveChoice: document.getElementById("playerTwoMoveChoice"),
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
                        losses: 0,
                        ties: 0
                    });
                }
                else {
                    game.playerNumber = 2;
                    database.ref("players/two").set({
                        name: playerName,
                        wins: 0,
                        losses: 0,
                        ties: 0
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
                    game.displayChoices(slot);
                }
            }
            else {
                game.playerTwoName.innerHTML = name;
                if (slot === game.playerNumber) {
                    game.displayChoices(slot);
                }
            }
            game.playerOneWinLoss.style.display = "block";
            game.playerTwoWinLoss.style.display = "block";
        },
        resetPlayerSlot: function(slot) {
            if (slot === 1) {
                game.playerOneName.innerHTML = "Waiting for player 1";
            }
            else {
                game.playerTwoName.innerHTML = "Waiting for player 2";
            }
        },
        checkPlayers: function() {
            if (game.twoPlayers) {
                game.setTurn(1);
            }
        },
        setTurn: function(turn) {
            database.ref("turn").set(turn);
        },
        displayChoices: function(player) {
            if (player === 1) {
                game.playerOneRock.style.display = "block";
                game.playerOnePaper.style.display = "block";
                game.playerOneScissors.style.display = "block";
                game.playerOneMoveChoice.style.display = "none";
            }
            else {
                game.playerTwoRock.style.display = "block";
                game.playerTwoPaper.style.display = "block";
                game.playerTwoScissors.style.display = "block";
                game.playerTwoMoveChoice.style.display = "none";
            }
        },
        displayMove: function(player, choice) {
            if (player === 1) {
                game.playerOneRock.style.display = "none";
                game.playerOnePaper.style.display = "none";
                game.playerOneScissors.style.display = "none";
                game.playerOneMoveChoice.style.display = "block";
                game.playerOneMoveChoice.innerHTML = choice;
            }
            else {
                game.playerTwoRock.style.display = "none";
                game.playerTwoPaper.style.display = "none";
                game.playerTwoScissors.style.display = "none";
                game.playerTwoMoveChoice.style.display = "block";
                game.playerTwoMoveChoice.innerHTML = choice;
            }
        },
        makeSelection: function(choice) {
            database.ref().once("value").then(function(snapshot) {
                if (snapshot.val().turn === game.playerNumber) {
                    if (game.playerNumber === 1) {
                        database.ref("players/one").update({
                            choice: choice
                        });
                        game.setTurn(2);
                    }
                    else {
                        database.ref("players/two").update({
                            choice: choice
                        });
                    }
                    if (game.playerNumber === 2) {
                        game.checkVictory();
                    }
                    game.displayMove(game.playerNumber, choice);
                }
            })
        },
        checkVictory: function() {
            database.ref("/players").once("value").then(function(snapshot) {
                var p1Choice = snapshot.val().one.choice;
                var p2Choice = snapshot.val().two.choice;
                if (p1Choice === p2Choice) game.changeScore(-1);
                else {
                    var userChoice = choices[p1Choice];
                    if (userChoice.defeates.indexOf(p2Choice) > -1) {
                        game.changeScore(1);
                    }
                    else {
                        game.changeScore(2);
                    }
                }
            });
            game.setTurn(1);
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
                else if (winner === 2) {
                    var newWins = snapshot.val().two.wins;
                    var newLosses = snapshot.val().one.losses;
                    database.ref("players/one").update({
                        losses: ++newLosses
                    })
                    database.ref("players/two").update({
                        wins: ++newWins
                    })
                }
                else if (winner === -1) {
                    var p1NewTies = snapshot.val().one.ties;
                    var p2NewTies = snapshot.val().two.ties;
                    database.ref("players/one").update({
                        ties: ++p1NewTies
                    })
                    database.ref("players/two").update({
                        ties: ++p2NewTies
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
        game.makeSelection(e.currentTarget.innerHTML);
    })
}