const ticTacToeGame = (() => {
  // A 2D array that represents a 3x3 board
  const _board = new Array(9).fill(null).map(() => "empty");

  const playerFactory = (_userName) => {
    const getName = () => _userName;
    const setName = (newName) => {_userName = newName};

    let _wins = 0;
    const getWins = () => _wins;
    const addWin = () => _wins++;

    let _losses = 0;
    const getLosses = () => _losses;
    const addLoss = () => _losses++;

    const resetScore = () => {
      _wins = 0;
      _losses = 0;
    };

    return {getName, setName, getWins, addWin, getLosses, addLoss, resetScore};
  };

  function _cellPositionIsValid(cellNumber) {
    if (isNaN(cellNumber)) return false;
    if (cellNumber < 0 || cellNumber > 9) return false;
    return true;
  };

  function _setCell(cellNumber, value) {
    if (_gameEnded) return false;
    const cellIndex = cellNumber - 1;  // Convert cell number to cell index
    if (typeof value !== "string") throw new Error("Cells can only contain strings");
    const valueToUpperCase = value.toUpperCase();
    if (valueToUpperCase !== "X" && valueToUpperCase !== "O") throw new Error(`A cell can't be set to ${value}, just X or O.`);

    const cellIsNotEmpty = _board[cellIndex] !== "empty";
    if (cellIsNotEmpty) return false;  // If cell can't be set, return false
    _board[cellIndex] = value;
    return true;                       // If cell was set, return true
  };

  let _computer = playerFactory("Computer");
  let _player = playerFactory("Player");

  let _playerMark = "x";
  let _computerMark = "o";

  function _getWinner() {
    if (_getEmptyCells.length >= 5) return false;

    function checkWinner(mark) {
      // board indexes:
      // 1 2 3
      // 4 5 6
      // 7 8 9
      const marksPosition = _getCellsWith(mark);
      const cells = {};
      for (position of marksPosition) {
        cells[position] = true;
      }
      if (cells[1] && cells[2] && cells[3]) return true;
      if (cells[4] && cells[5] && cells[6]) return true;
      if (cells[7] && cells[8] && cells[9]) return true;
      if (cells[1] && cells[4] && cells[7]) return true;
      if (cells[2] && cells[5] && cells[8]) return true;
      if (cells[3] && cells[6] && cells[9]) return true;
      if (cells[1] && cells[5] && cells[9]) return true;
      if (cells[7] && cells[5] && cells[3]) return true;
      return false;
    };
    if (checkWinner(_playerMark)) return "player";
    if (checkWinner(_computerMark)) return "computer";
    if (_getEmptyCells().length === 0) return "draw";
    return false;
  };

  let _lastWinner = null;
  function getLastWinner() {
    return _lastWinner;
  };

  let _gameEnded = false;
  function _endGame(winner) {
    _gameEnded = true;
    switch (winner) {
      case "draw":
        _lastWinner = "draw";
        return;
      case "player":
        _player.addWin();
        _lastWinner = _player.getName();
        _computer.addLoss();
        return;
      case "computer":
        _computer.addWin();
        _lastWinner = "computer";
        _player.addLoss();
        return;
    }
    throw new Error(`Winner (${winner}) isn't a valid value.`);
  };

  function cleanBoard() {
    if (_gameEnded) {
      // Clean board
      for (i in _board) {
      _board[i] = "empty";
      }
      _gameEnded = false;
      return;
    }
    console.error("You cannot reset the board 'til the game finish.")
  };

  function playRound(playerCellNumberChoice) {
    try {
      const turnPassed = _playPlayerTurn(playerCellNumberChoice);
      if (!turnPassed) return false;
    } catch {
      return false
    };

    let winner = _getWinner();
    if (winner) {
      _endGame(winner);
      return true;
    }

    _playComputerTurn();

    winner = _getWinner();
    if (winner) {
      _endGame(winner);
      return true;
    }

    return true;
  };

  function _playPlayerTurn(cellNumber) {
    if (!_cellPositionIsValid(cellNumber)) throw new Error("Cell number is not valid.");
    return _playTurn(cellNumber, _playerMark);
  };

  function _getCellsWith(str) {
    return _board.reduce((acc, cell, index) => {
      if (cell === str) {
        const cellNumber = index + 1;
        acc.push(cellNumber);
      }
      return acc;
      }, []);
  };

  function _getEmptyCells() {
    return _getCellsWith("empty");
  };

  function _playComputerTurn() {
    const emptyCells = _getEmptyCells();
    if (emptyCells.length === 0) throw new Error("Computer couldn't find an empty cell.");
    
    const randomEmptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const computerChoice = randomEmptyCell;
    _playTurn(computerChoice, _computerMark);
  };

  function setPlayerName(newName) {
    _player.setName(newName);
  };

  function _playTurn(cellNumber, mark) {
    let movementIsDone = null;
    try {
      movementIsDone = _setCell(cellNumber, mark);
    } catch(error) {
      console.error(error);
      return;
    }
    if (movementIsDone) return true;
    console.log("Invalid movement! Try again...");
  };

  function getComputerScore() {
    return {wins: _computer.getWins(), losses: _computer.getLosses()}
  };

  function getPlayerScore() {
    return {wins: _player.getWins(), losses: _player.getLosses()}
  };

  function getBoard() {
    return _board;
  };

  function getPlayerName() {
    return _player.getName();
  };

  return {
    getPlayerName,
    setPlayerName,
    playTurn : playRound,
    cleanBoard,
    getComputerScore,
    getPlayerScore,
    getBoard,
    getLastWinner,
  };
})();

const ticTacToeGameUIController = (() => {
  const _gameUIElement = document.querySelector("#tic-tac-toe__ui");

  const _setNameButton = document.querySelector("#setNameButton");
  const _cleanBoardButton = document.querySelector("#cleanBoardButton");

  const _cellButtons = [
    document.querySelector("#cell1Button"),
    document.querySelector("#cell2Button"),
    document.querySelector("#cell3Button"),
    document.querySelector("#cell4Button"),
    document.querySelector("#cell5Button"),
    document.querySelector("#cell6Button"),
    document.querySelector("#cell7Button"),
    document.querySelector("#cell8Button"),
    document.querySelector("#cell9Button"),
  ]

  const _playerNameElement = document.querySelector("#playerName");
  const _playerWinsElement = document.querySelector("#playerWins");
  const _playerLossesElement = document.querySelector("#playerLosses");

  const _computerNameElement = document.querySelector("#computerName");
  const _computerWinsElement = document.querySelector("#computerWins");
  const _computerLossesElement = document.querySelector("#computerLosses");

  const _messagesDisplayElement = document.querySelector("#messagesDisplay");

  const _setName = function() {
    throw new Error("not implemented");
  };

  const _cleanBoard = function() {
    ticTacToeGame.cleanBoard();
    _updateDisplay();
  };

  const _playTurn = function(cellNumber) {
    if (ticTacToeGame.playTurn(cellNumber)) _updateDisplay();
  };

  const _updateDisplay = function() {
    // Update cells
    const board = ticTacToeGame.getBoard();
    for (let i = 0; i < _cellButtons.length; i++) {
      const cell = _cellButtons[i];
      switch((board[i])) {
        case "empty":
          cell.textContent = "";
          continue;
        case "x":
          cell.textContent = "x";
          continue;
        case "o":
          cell.textContent = "o";
          continue;
        default:
          throw new Error(`_updateDisplay coudn't recognize what the cell content is: ${board[i]}`);
      };
    };

    // Update player and computer scores
    const {wins: playerWins, losses: playerLosses} = ticTacToeGame.getPlayerScore();
    _playerWinsElement.textContent = `Wins: ${playerWins}`;
    _playerLossesElement.textContent = `Losses: ${playerLosses}`;

    const {wins: computerWins, losses: computerLosses} = ticTacToeGame.getComputerScore();
    _computerWinsElement.textContent = `Wins: ${computerWins}`;
    _computerLossesElement.textContent = `Losses: ${computerLosses}`;

    // Update messages display
    const lastWinner = ticTacToeGame.getLastWinner();
    switch(lastWinner) {
      case "draw":
        _messagesDisplayElement.textContent = "It's a draw!";
        return;
      case ticTacToeGame.getPlayerName():
      case "computer":
        _messagesDisplayElement.textContent = `${ticTacToeGame.getLastWinner()} won!`;
    }
  };

  const init = (function init() {
    _gameUIElement.addEventListener("click", (e) => {
      const target = e.target;
      if (target === _setNameButton) {
        _setName();
        return;
      };
      if (target === _cleanBoardButton) {
        _cleanBoard();
        return;
      };
      if (target === _cellButtons[0]) {
        _playTurn(1);
        return;
      };
      if (target === _cellButtons[1]) {
        _playTurn(2);
        return;
      };
      if (target === _cellButtons[2]) {
        _playTurn(3);
        return;
      };
      if (target === _cellButtons[3]) {
        _playTurn(4);
        return;
      };
      if (target === _cellButtons[4]) {
        _playTurn(5);
        return;
      };
      if (target === _cellButtons[5]) {
        _playTurn(6);
        return;
      };
      if (target === _cellButtons[6]) {
        _playTurn(7);
        return;
      };
      if (target === _cellButtons[7]) {
        _playTurn(8);
        return;
      };
      if (target === _cellButtons[8]) {
        _playTurn(9);
        return;
      };
    })
  })();
})();