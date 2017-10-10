if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    var choices = {
        Rock: {
            defeates: ["Scissors", "Lizard"],
            message: ["Rock crushes scissors", "Rock crushes lizard"]
        },
        Paper: {
            defeates: ["Rock", "Spock"],
            message: ["Paper covers rock", "Paper disproves Spock"]
        },
        Scissors: {
            defeates: ["Paper", "Lizard"],
            message: ["Scissors cuts paper", "Scissors decapitates lizard"]
        },
        Lizard: {
            defeates: ["Spock", "Paper"],
            message: ["Lizard poisons Spock", "Lizard eats paper"]
        },
        Spock: {
            defeates: ["Scissors", "Rock"],
            message: ["Spock smashes scissors", "Spock vaporizes rock"]
        }
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
            try {
                if (snapshot.val().players.one === undefined || snapshot.val().players.two === undefined) {
                    database.ref("/turn").remove();
                }
                else game.twoPlayers = true;
            }
            catch (e) {}
            if (game.playerName != "") {
                database.ref("chat").onDisconnect().update({
                    latest: "- - - " + game.playerName + " has disconnected - - -"
                })
            }
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
                        game.playerTwoMoveChoice.innerHTML = snapshot.val().two.choice;
                        game.playerTwoMoveChoice.style.display = "block";
                        game.wins = snapshot.val().one.wins;
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.playerTwoMoveChoice.style.display = "none";
                            game.displayChoices(1);
                        }, 2000);
                    }
                    else if (parseInt(snapshot.val().one.losses) > game.losses) {
                        game.playerTwoMoveChoice.innerHTML = snapshot.val().two.choice;
                        game.playerTwoMoveChoice.style.display = "block";
                        game.losses = snapshot.val().one.losses;
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.playerTwoMoveChoice.style.display = "none";
                            game.displayChoices(1);
                        }, 2000);
                    }
                    else if (parseInt(snapshot.val().one.ties) > game.ties) {
                        game.playerTwoMoveChoice.innerHTML = snapshot.val().two.choice;
                        game.playerTwoMoveChoice.style.display = "block";
                        game.ties = snapshot.val().one.ties;
                        game.victoryMessage.innerHTML = "TIE!";
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.playerTwoMoveChoice.style.display = "none";
                            game.displayChoices(1)
                        }, 2000);
                    }
                }
                else {
                    game.opponentName = snapshot.val().one.name;
                    if (parseInt(snapshot.val().two.wins) > game.wins) {
                        game.playerOneMoveChoice.innerHTML = snapshot.val().one.choice;
                        game.playerOneMoveChoice.style.display = "block";
                        game.wins = snapshot.val().two.wins;
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.playerOneMoveChoice.style.display = "none";
                            game.displayChoices(2);
                        }, 2000);
                    }
                    else if (parseInt(snapshot.val().two.losses) > game.losses) {
                        game.playerOneMoveChoice.innerHTML = snapshot.val().one.choice;
                        game.playerOneMoveChoice.style.display = "block";
                        game.losses = snapshot.val().two.losses;
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.playerOneMoveChoice.style.display = "none";
                            game.displayChoices(2);
                        }, 2000);
                    }
                    else if (parseInt(snapshot.val().two.ties) > game.ties) {
                        game.playerOneMoveChoice.innerHTML = snapshot.val().one.choice;
                        game.playerOneMoveChoice.style.display = "block";
                        game.ties = snapshot.val().two.ties;
                        game.victoryMessage.innerHTML = "TIE!";
                        game.victoryMessage.style.display = "block";
                        setTimeout(function() {
                            game.victoryMessage.style.display = "none";
                            game.playerOneMoveChoice.style.display = "none";
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
            $(playerOneBox).addClass("highlight");
            $(playerTwoBox).removeClass("highlight");
            if (game.playerNumber === 1) {
                game.infoMessage.innerHTML = "It's Your Turn!";
            }
            else {
                game.infoMessage.innerHTML = "Waiting for " + game.opponentName;
            }
        }
        if (snapshot.val() === 2) {
            $(playerTwoBox).addClass("highlight");
            $(playerOneBox).removeClass("highlight");
            if (game.playerNumber === 1) {
                game.infoMessage.innerHTML = "Waiting for " + game.opponentName;
            }
            else game.infoMessage.innerHTML = "It's Your Turn!";
        }
    })

    database.ref("chat").on("value", function(snapshot) {
        try {
            if(game.playerName != "") {
                game.messages.value += snapshot.val().latest + "\n";
                game.messages.scrollTop = game.messages.scrollHeight;
            }
        }
        catch (e) {}
        setTimeout(function() {
            database.ref("chat").remove();
        }, 100);
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
        playerOneBox: document.getElementById("playerOneBox"),
        playerOneName: document.getElementById("playerOneName"),
        playerOneRock: document.getElementById("playerOneRock"),
        playerOnePaper: document.getElementById("playerOnePaper"),
        playerOneScissors: document.getElementById("playerOneScissors"),
        playerOneLizard: document.getElementById("playerOneLizard"),
        playerOneSpock: document.getElementById("playerOneSpock"),
        playerOneMoveChoice: document.getElementById("playerOneMoveChoice"),
        playerOneWinLoss: document.getElementById("playerOneWinLoss"),
        playerOneWins: document.getElementById("playerOneWins"),
        playerOneLosses: document.getElementById("playerOneLosses"),
        playerTwoBox: document.getElementById("playerTwoBox"),
        playerTwoName: document.getElementById("playerTwoName"),
        playerTwoRock: document.getElementById("playerTwoRock"),
        playerTwoPaper: document.getElementById("playerTwoPaper"),
        playerTwoScissors: document.getElementById("playerTwoScissors"),
        playerTwoLizard: document.getElementById("playerTwoLizard"),
        playerTwoSpock: document.getElementById("playerTwoSpock"),
        playerTwoMoveChoice: document.getElementById("playerTwoMoveChoice"),
        playerTwoWinLoss: document.getElementById("playerTwoWinLoss"),
        playerTwoWins: document.getElementById("playerTwoWins"),
        playerTwoLosses: document.getElementById("playerTwoLosses"),
        messages: document.getElementById("messages"),
        messageInput: document.getElementById("messageInput"),
        sendMessageSubmitButton: document.getElementById("sendMessageSubmitButton"),
        addPlayer: function(playerName) {
            // game.playerName = playerName;
            database.ref().once("value").then(function(snapshot) {
                try {
                    if (snapshot.val().players.one === undefined) {
                        game.playerName = playerName;
                        setPlayerNumber(1);
                    }
                    else if(snapshot.val().players.two === undefined) {
                        game.playerName = playerName;
                        setPlayerNumber(2);
                    }
                }
                catch (e) {
                    game.playerName = playerName;
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
                game.playerOneRock.style.display = "inline-block";
                game.playerOnePaper.style.display = "inline-block";
                game.playerOneScissors.style.display = "inline-block";
                game.playerOneLizard.style.display = "inline-block";
                game.playerOneSpock.style.display = "inline-block";
                game.playerOneMoveChoice.style.display = "none";
            }
            else {
                game.playerTwoRock.style.display = "inline-block";
                game.playerTwoPaper.style.display = "inline-block";
                game.playerTwoScissors.style.display = "inline-block";
                game.playerTwoLizard.style.display = "inline-block";
                game.playerTwoSpock.style.display = "inline-block";
                game.playerTwoMoveChoice.style.display = "none";
            }
        },
        displayMove: function(player, choice) {
            if (player === 1) {
                game.playerOneRock.style.display = "none";
                game.playerOnePaper.style.display = "none";
                game.playerOneScissors.style.display = "none";
                game.playerOneLizard.style.display = "none";
                game.playerOneSpock.style.display = "none";
                game.playerOneMoveChoice.style.display = "block";
                game.playerOneMoveChoice.innerHTML = choice;
            }
            else {
                game.playerTwoRock.style.display = "none";
                game.playerTwoPaper.style.display = "none";
                game.playerTwoScissors.style.display = "none";
                game.playerTwoLizard.style.display = "none";
                game.playerTwoSpock.style.display = "none";
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
                    if (choices[p1Choice].defeates.indexOf(p2Choice) > -1) {
                        game.victoryMessage.innerHTML = choices[p1Choice].message[choices[p1Choice].defeates.indexOf(p2Choice)];
                        game.changeScore(1);
                    }
                    else if (choices[p2Choice].defeates.indexOf(p1Choice) > -1) {
                        game.victoryMessage.innerHTML = choices[p2Choice].message[choices[p2Choice].defeates.indexOf(p1Choice)];
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
        },
        addMessage: function(message) {
            game.messageInput.value = "";
            var userMessage = game.playerName + ": " + message;
            database.ref("chat").update({
                latest: userMessage
            })
        }
    }
    
    game.newPlayerSubmitButton.addEventListener("click", function(e) {
        e.preventDefault();
        game.addPlayer(game.newPlayerInput.value.trim());
    });

    $(".moveSelection").on("click", function(e) {
        game.makeSelection(e.currentTarget.innerHTML);
    });

    game.sendMessageSubmitButton.addEventListener("click", function(e) {
        e.preventDefault();
        if (game.playerName != "") game.addMessage(game.messageInput.value);
    });

    document.getElementById("introScreen").addEventListener("animationend", function() {
        document.getElementById("introScreen").style.display = "none";
        document.getElementById("gameScreen").style.display = "block";
    }, false);
}