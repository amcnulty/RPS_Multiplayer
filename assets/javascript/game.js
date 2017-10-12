// RPS Multiplayer 2017
// By: Aaron Michael McNulty
// Monkey Stomp Games 2017
//
// All rights reserved
if (window.attachEvent) {window.attachEvent('onload', load);}
else if (window.addEventListener) {window.addEventListener('load', load, false);}
else {document.addEventListener('load', load, false);}
function load() {
    /** This object holds data about the possible choices including what it defeats and what the message is based on what it defeated. */
    var choices = {
        Rock: {
            defeats: ["Scissors", "Lizard"],
            message: ["Rock crushes scissors", "Rock crushes lizard"]
        },
        Paper: {
            defeats: ["Rock", "Spock"],
            message: ["Paper covers rock", "Paper disproves Spock"]
        },
        Scissors: {
            defeats: ["Paper", "Lizard"],
            message: ["Scissors cuts paper", "Scissors decapitates lizard"]
        },
        Lizard: {
            defeats: ["Spock", "Paper"],
            message: ["Lizard poisons Spock", "Lizard eats paper"]
        },
        Spock: {
            defeats: ["Scissors", "Rock"],
            message: ["Spock smashes scissors", "Spock vaporizes rock"]
        }
    }
    /** Config variable for Firebase */
    var config = {
        apiKey: "AIzaSyCyz-OvL_NXg-Lsjnqc015ofFCcFAKcclQ",
        authDomain: "rps-multiplayer-bc526.firebaseapp.com",
        databaseURL: "https://rps-multiplayer-bc526.firebaseio.com",
        projectId: "rps-multiplayer-bc526",
        storageBucket: "",
        messagingSenderId: "932333388322"
    };
    /** Initialize Firebase */
    firebase.initializeApp(config);
    /** A handle for the Firebase Database this game is linked with. */
    var database = firebase.database();
    /**
     * Database listener for value changes for the entire database scope.
     */
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
    /**
     * Database listener for value changes to the players reference.
     */
    database.ref("players").on("value", function(snapshot) {
        /** Remove player one or player two if they disconnect. */
        if(game.playerNumber === 1) {
            database.ref("players/one").onDisconnect().remove();
        }
        else if (game.playerNumber === 2) {
            database.ref("players/two").onDisconnect().remove();
        }
        /**
         * Try statement for doing game logic based on changes to the players reference in the database. This is used to update the display and locally keep track of wins, ties, and losses.
         */
        try {
            if (snapshot.numChildren() === 2) {
                if (game.playerNumber === 1) {
                    game.opponentName = snapshot.val().two.name;
                    if (parseInt(snapshot.val().one.wins) > game.wins) {
                        game.playerTwoMoveChoice.innerHTML = snapshot.val().two.choice;
                        game.playerTwoMoveChoice.style.display = "block";
                        game.wins = snapshot.val().one.wins;
                        game.displayMessage(snapshot.val().one.choice, snapshot.val().two.choice);
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
                        game.displayMessage(snapshot.val().one.choice, snapshot.val().two.choice);
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
                        game.displayMessage(snapshot.val().one.choice, snapshot.val().two.choice);
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
                        game.displayMessage(snapshot.val().one.choice, snapshot.val().two.choice);
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
        catch (e) {
            // Do nothing
        }
    });
    /**
     * Database listener for value changes to the turn reference. Updates the display based on whose turn it is.
     */
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
    /**
     * Database listener for value changes to the chat reference. Once message is updated the display is updated and the chat reference is removed.
     */
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
    /**
     * The game object contains all of the fields and methods specific to the logic of the game.
     */
    var game = {
        /** Represents what player this user is assigned to. Either 1 or 2. Initialized at 0. */
        playerNumber: 0,
        /** The name of the player. */
        playerName: "",
        /** The name of this user's opponent. */
        opponentName: "",
        /** True once two players have logged on. False when there are less than two players. */
        twoPlayers: false,
        /** The running total of wins for this users. */
        wins: 0,
        /** The running total of losses for this user. */
        losses: 0,
        /** The running total of ties for this user. */
        ties: 0,
        /** Paragraph element for the message that is displayed in the center box after each round. */
        victoryMessage: document.getElementById("victoryMessage"),
        /** Header element for displaying information to the users. */
        infoMessage: document.getElementById("infoMessage"),
        /** The input field at the top of the page for inputting user name. */
        newPlayerInput: document.getElementById("newPlayerInput"),
        /** The submit button to join the game. */
        newPlayerSubmitButton: document.getElementById("newPlayerSubmitButton"),
        /** Div element for holding information about player one. */
        playerOneBox: document.getElementById("playerOneBox"),
        /** The name for player one. */
        playerOneName: document.getElementById("playerOneName"),
        /** The following fields are for player one's move choices. */
        playerOneRock: document.getElementById("playerOneRock"),
        playerOnePaper: document.getElementById("playerOnePaper"),
        playerOneScissors: document.getElementById("playerOneScissors"),
        playerOneLizard: document.getElementById("playerOneLizard"),
        playerOneSpock: document.getElementById("playerOneSpock"),
        /** The current selected move choice for player one in the current round. */
        playerOneMoveChoice: document.getElementById("playerOneMoveChoice"),
        /** Paragraph element for displaying player one wins and losses. */
        playerOneWinLoss: document.getElementById("playerOneWinLoss"),
        /** The running total of wins for player one. */
        playerOneWins: document.getElementById("playerOneWins"),
        /** The running total of losses for player one. */
        playerOneLosses: document.getElementById("playerOneLosses"),
        /** Div element for holding information about player two. */
        playerTwoBox: document.getElementById("playerTwoBox"),
        /** The name for player two. */
        playerTwoName: document.getElementById("playerTwoName"),
        /** The following fields are for player two's move choices. */
        playerTwoRock: document.getElementById("playerTwoRock"),
        playerTwoPaper: document.getElementById("playerTwoPaper"),
        playerTwoScissors: document.getElementById("playerTwoScissors"),
        playerTwoLizard: document.getElementById("playerTwoLizard"),
        playerTwoSpock: document.getElementById("playerTwoSpock"),
        /** The current selected move choice for player two in the current round. */
        playerTwoMoveChoice: document.getElementById("playerTwoMoveChoice"),
        /** Paragraph element for displaying play two wins and losses. */
        playerTwoWinLoss: document.getElementById("playerTwoWinLoss"),
        /** The running total of wins for player two. */
        playerTwoWins: document.getElementById("playerTwoWins"),
        /** The running total of loesses for player two. */
        playerTwoLosses: document.getElementById("playerTwoLosses"),
        /** Text area element for displaying messages between players. */
        messages: document.getElementById("messages"),
        /** Text input for typing messages to the other player. */
        messageInput: document.getElementById("messageInput"),
        /** Send button for sending message to other player. */
        sendMessageSubmitButton: document.getElementById("sendMessageSubmitButton"),
        /**
         * Adds a new player to the game by checking if there is an open slot for player one or player two. Information about the player is added to the database.
         * @param {String} playerName
         * The name of the player to be added.
         */
        addPlayer: function(playerName) {
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
            /**
             * Closed function that is called within the addPlayer method used to set information to the database based on what number is assigned to this player. This function then calls the checkPlayers and fillPlayerSlot methods.
             * @param {Number} number 
             * The number assigned to this player. Either 1 or 2
             */
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
        /**
         * This method is used to update the display based on what player slot is being populated.
         * @param {Number} slot
         * The slot this player is being added too. Either 1 or 2.
         * @param {String} name
         * The name of this player.
         */
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
        /**
         * Resets the name for a player slot back to waiting for player.
         * @param {Number} slot
         * The slot to be reset. Either 1 or 2
         */
        resetPlayerSlot: function(slot) {
            if (slot === 1) {
                game.playerOneName.innerHTML = "Waiting for player 1";
            }
            else {
                game.playerTwoName.innerHTML = "Waiting for player 2";
            }
        },
        /**
         * Checks if there are two players in the game and calls the setTurn method.
         */
        checkPlayers: function() {
            if (game.twoPlayers) {
                game.setTurn(1);
            }
        },
        /**
         * Sets the turn reference in the database.
         * @param {Number} turn
         * The turn number to be set to the database. Either 1 or 2.
         */
        setTurn: function(turn) {
            database.ref("turn").set(turn);
        },
        /**
         * Displays the move choices for the given player.
         * @param {Number} player
         * The player to display move choices for. Either 1 or 2.
         */
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
        /**
         * Hides move choices and displays the current selected move for the round.
         * @param {Number} player
         * The player to update the display.
         * @param {String} choice
         * The move the player selected.
         */
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
        /**
         * References the database when called to update the user choice in the database.
         * @param {String} choice
         * The user's move choice for this round.
         */
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
        /**
         * Called after each round to check who is the victor. Depending on the players selections the changeScore method is called with the appropriate argument.
         */
        checkVictory: function() {
            database.ref("/players").once("value").then(function(snapshot) {
                var p1Choice = snapshot.val().one.choice;
                var p2Choice = snapshot.val().two.choice;
                if (p1Choice === p2Choice) game.changeScore(-1);
                else {
                    if (choices[p1Choice].defeats.indexOf(p2Choice) > -1) {
                        game.changeScore(1);
                    }
                    else if (choices[p2Choice].defeats.indexOf(p1Choice) > -1) {
                        game.changeScore(2);
                    }
                }
            });
            game.setTurn(1);
        },
        /**
         * Updates the running total for wins losses and ties in the database for each player after each round.
         * @param {Number} winner
         * The player who one the current round. Either 1 or 2.
         */
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
        /**
         * Adds to the text area for the chat messaging feature.
         * @param {String} message
         * The message typed by the user to be displayed in the chat.
         */
        addMessage: function(message) {
            game.messageInput.value = "";
            var userMessage = game.playerName + ": " + message;
            database.ref("chat").update({
                latest: userMessage
            })
        },
        /**
         * Sets the message at the end of each round based on what move choices the players choose.
         * @param {String} p1Choice
         * The move choice for player one for the current round.
         * @param {String} p1Choice
         * The move choice for player two for the current round.
         */
        displayMessage: function(p1Choice, p2Choice) {
            if (choices[p1Choice].defeats.indexOf(p2Choice) > -1) {
                game.victoryMessage.innerHTML = choices[p1Choice].message[choices[p1Choice].defeats.indexOf(p2Choice)];
            }
            else if (choices[p2Choice].defeats.indexOf(p1Choice) > -1) {
                game.victoryMessage.innerHTML = choices[p2Choice].message[choices[p2Choice].defeats.indexOf(p1Choice)];
            }
        }
    }
    /** Listener for the join button at the top of the page. Adds new player. */
    game.newPlayerSubmitButton.addEventListener("click", function(e) {
        e.preventDefault();
        game.addPlayer(game.newPlayerInput.value.trim());
    });
    /** Listener for the move selections in the player boxes. */
    $(".moveSelection").on("click", function(e) {
        game.makeSelection(e.currentTarget.innerHTML);
    });
    /** Listener for the send button in the game chat. Sends message. */
    game.sendMessageSubmitButton.addEventListener("click", function(e) {
        e.preventDefault();
        if (game.playerName != "") game.addMessage(game.messageInput.value);
    });
    /** Listener for animation end of the intro screen to display the main game screen. */
    document.getElementById("introScreen").addEventListener("animationend", function() {
        document.getElementById("introScreen").style.display = "none";
        document.getElementById("gameScreen").style.display = "block";
    }, false);
}