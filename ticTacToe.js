// Initialize Board info and methods for evaluating board
const boardModule = (() => {
    let gameboard = [" ", " ", " ", " ", " ", " ", " ", " ", " "];
    function gameboardUpdate(){
        let spotList = document.querySelectorAll('.gameSpot');
        const spotArray = Array.from(spotList);
        for(let i = 0; i < spotArray.length; i++){
            gameboard[i] = spotArray[i].textContent;
        }
    }
    return { gameboard, gameboardUpdate};
})();

// Create players
const playerFactory = (character) => {
    let gamePiece = character;
    let theirTurn = false;
    let hasWon = false;
    return { gamePiece, theirTurn, hasWon };
};

// Handle intial display prep
const displayController = (() => {
    function display(gameboard) {
        let row0 = document.querySelector('#row0');
        let row1 = document.querySelector('#row1');
        let row2 = document.querySelector('#row2');
        for(let i = 0; i < 9; i++){
            if(i < 3){
                let elementCell = row0.insertCell(-1);
                elementCell.classList.add('gameSpot');
                elementCell.textContent = gameboard[i];
            } else {
                if (i < 6){
                    let elementCell = row1.insertCell(-1);
                    elementCell.classList.add('gameSpot');
                    elementCell.textContent = gameboard[i];
                } else {
                    let elementCell = row2.insertCell(-1);
                    elementCell.classList.add('gameSpot');
                    elementCell.textContent = gameboard[i]; 
                }
            }
        }
    }
    function clear(){
        const clearButton = document.querySelector('#clearButton');
        clearButton.addEventListener('click', (e) => {
            console.log("Clearing board");
            let spotList = document.querySelectorAll('.gameSpot');
            spotList.forEach((spot) => {
                spot.textContent = " ";
            });
            boardModule.gameboardUpdate();
            setupModule.playerX.hasWon = false;
            setupModule.playerO.hasWon = false;
            setupModule.playerX.theirTurn = true;
            setupModule.playerO.theirTurn = false;
            let resultsArea = document.querySelector('#resultsArea');
            let winStatement = document.querySelector('.winStatement');
            resultsArea.removeChild(winStatement);
        });
    }
    display(boardModule.gameboard);
    clear();
    return { display, clear };
})();

// Set up game info
const setupModule = (() => {
    const playerX = playerFactory("X");
    const playerO = playerFactory("O");
    playerX.theirTurn = true;
    return { playerX, playerO };
})();

// Turn by turn gameplay
const gameModule = (() => {
    function playerTurn(){
        let spotList = document.querySelectorAll('.gameSpot');
        spotList.forEach((spot) => {
           spot.addEventListener('click', (e) => {
               if(setupModule.playerX.hasWon === false && 
                 setupModule.playerO.hasWon === false){
                    if(spot.textContent === " "){
                        if(setupModule.playerX.theirTurn === true){
                            spot.textContent = setupModule.playerX.gamePiece;
                            setupModule.playerX.theirTurn = false;
                            setupModule.playerO.theirTurn = true;
                        } else {
                            spot.textContent = setupModule.playerO.gamePiece;
                            setupModule.playerO.theirTurn = false;
                            setupModule.playerX.theirTurn = true;
                        }
                    winCheck();
              }     
                }
           }); 
        });
    }
    function equalityCheck(x, y, z){
        if(boardModule.gameboard[x] === boardModule.gameboard[y] && 
          boardModule.gameboard[y] === boardModule.gameboard[z]){
            if(boardModule.gameboard[x] === "X"){
                setupModule.playerX.hasWon = true;
                winMessage(setupModule.playerX);
            } else {
                if(boardModule.gameboard[x] === "O"){
                    setupModule.playerO.hasWon = true;
                    winMessage(setupModule.playerO);
                }
            }
        }
    }
    function winMessage(player){
        let resultsArea = document.querySelector("#resultsArea");
        let winStatement = document.createElement('p');
        winStatement.classList.add('winStatement');
        winStatement.textContent = `Player ${player.gamePiece} wins!`;
        resultsArea.appendChild(winStatement);
    }
    function winCheck(){
        boardModule.gameboardUpdate();
        equalityCheck(0, 1, 2);
        equalityCheck(3, 4, 5);
        equalityCheck(6, 7, 8);
        equalityCheck(0, 3, 6);
        equalityCheck(1, 4, 7);
        equalityCheck(2, 5, 8);
        equalityCheck(0, 4, 8);
        equalityCheck(2, 4, 6);
        
    }
    playerTurn();
    return { playerTurn, equalityCheck, winCheck, winMessage };
})();