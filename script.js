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
  let _player = playerFactory("Player");

  let _playerMark = "x";
  let _computerMark = "o";

  function _getWinner() {
    if (_getEmptyCells.length >= 5) return false;

    function checkWinner(mark) {
      // board indexes:
      // 0 1 2
      // 3 4 5
      // 6 7 8
      const marksPosition = _getCellsWith(mark);
      const cells = {};
      for (position of marksPosition) {
        cells[position] = true;
      }
      if (cells[0] && cells[1] && cells[2]) return true;
      if (cells[3] && cells[4] && cells[5]) return true;
      if (cells[6] && cells[7] && cells[8]) return true;
      if (cells[0] && cells[3] && cells[6]) return true;
      if (cells[1] && cells[4] && cells[7]) return true;
      if (cells[2] && cells[5] && cells[8]) return true;
      if (cells[0] && cells[4] && cells[8]) return true;
      if (cells[6] && cells[4] && cells[2]) return true;
      return false;
    };
    if (checkWinner(_playerMark)) return "player";
    if (checkWinner(_computerMark)) return "computer";
    if (_getEmptyCells().length === 0) return "draw";
    return false;
  };

  function _resetBoard() {
    for (i in _board) {
      _board[i] = "empty";
    }
  };

  let _lastWinner = null;
  function getLastWinner() {
    return _lastWinner;
  };

  function _endGame(winner) {
    _resetBoard();
    switch (winner) {
      case "draw":
        _lastWinner = "draw";
        return;
        break;
      case "player":
        _player.addWin();
        _lastWinner = _player.getName();
        _computer.addLoss();
        return;
        break;
      case "computer":
        _computer.addWin();
        _lastWinner = "computer";
        _player.addLoss();
        return;
        break;
    }
    throw new Error(`Winner (${winner}) isn't a valid value.`);
  };

  function resetGame() {
    _resetBoard();
    _player.resetScore();
    _computer.resetScore();
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
    _player.setName(newName);
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

  function getComputerScore() {
    return {wins: _computer.getWins(), losses: _computer.getLosses()}
  };

  function getPlayerScore() {
    return {wins: _player.getWins(), losses: _player.getLosses()}
  };

  function getBoard() {
    return _board;
  };

  return {
    setPlayerName,
    playTurn : playRound,
    resetGame,
    getComputerScore,
    getPlayerScore,
    getBoard,
    getLastWinner,
  };
})();