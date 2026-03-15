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

    return {getName, setName, getWins, addWin, getLosses, addLoss};
  };

  function _getBoardIndex(row, col) {
    function _cellPositionIsValid(row, col) {
      if (isNaN(row) || isNaN(col)) return false;
      if (row <= 0 || row > 3) return false;
      if (col <= 0 || col > 3) return false;
      return true;
    };
    if (!_cellPositionIsValid(row, col)) throw new Error("Invalid cell position.");

    return row * 3 + col - 4;
  };

  function _setCell(cellIndex, value) {
    if (typeof value !== "string") throw new Error("Cells can only contain strings");
    const valueToUpperCase = value.toUpperCase();
    if (valueToUpperCase !== "X" && valueToUpperCase !== "O") throw new Error(`A cell can't be set to ${value}, just X or O.`);

    const cellIsNotEmpty = _board[cellIndex] !== "empty";
    if (cellIsNotEmpty) return false;  // If cell can't be set, return false
    _board[cellIndex] = value;
    return true;                       // If cell was set, return true
  };

  let _computer = playerFactory("Computer");
  let _userPlayer = playerFactory("Player");

  let _playerMark = "x";
  let _computerMark = "o";

  function _getWinner() {
    throw new Error("Not implemented");
  };

  function playRound(playerRowChoice, playerColChoice) {
    try {
      const turnPassed = _playPlayerTurn(playerRowChoice, playerColChoice);
      if (!turnPassed) return;
    } catch {return};

    let winner = _getWinner();
    if (winner) {
      _endGame(winner);
      return;
    }

    _playComputerTurn();

    winner = _getWinner();
    if (winner) {
      _endGame(winner);
      return;
    }
  };

  function _playPlayerTurn(row, col) {
    let cellIndex = null;
    try {
      cellIndex = _getBoardIndex(row, col);
    } catch(error) {console.log(error)};
    return _playTurn(cellIndex, _playerMark);
  };

  function _getCellsWith(str) {
    return _board.reduce((acc, cell, index) => {
      if (cell === str) acc.push(index);
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
    _userPlayer.setName(newName);
  };

  function _playTurn(cellIndex, mark) {
    let movementIsDone = null;
    try {
      movementIsDone = _setCell(cellIndex, mark);
    } catch(error) {
      console.error(error);
      return;
    }
    if (movementIsDone) return true;
    console.log("Invalid movement! Try again...");
  };

  function resetGame() {
    console.error("Not implemented");
  };

  function getScore() {
    console.error("Not implemented");
  };

  function getBoard() {
    return _board;
  };

  return {
    setPlayerName,
    playTurn : playRound,
    resetGame,
    getScore,
    getBoard
  };
})();