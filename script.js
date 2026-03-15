const ticTacToeGame = (() => {
  // A 2D array that represents a 3x3 board
  const _board = new Array(3).fill(null).map(() => new Array(3).fill("empty"))

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

  function _cellPositionIsValid(row, col) {
    if (isNaN(row) || isNaN(col)) return false;
    if (row <= 0 || row > 3) return false;
    if (col <= 0 || col > 3) return false;
    return true;
  };

  function _setCell(row, col, value) {
    if (!_cellPositionIsValid(row, col)) throw new Error(`(${row}, ${col}) isn't a valid cell.`);
    
    if (typeof value !== "string") throw new Error("Cells can only contain strings");
    const valueToUpperCase = value.toUpperCase();
    if (valueToUpperCase !== "X" && valueToUpperCase !== "O") throw new Error(`A cell can't be set to ${value}, just X or O.`)

    --row
    --col  // Convert cell's values to array indexes.
    let cell = _board[row][col];

    function _cellIsOccupied(cell) {
      if (cell === "empty") return false;
      return true;
    }
    if (_cellIsOccupied(cell)) return false;  // If cell wasn't set, return false
    _board[row][col] = value;
    return true;                              // If cell was set, return true
  };

  let _computer = playerFactory("Computer");
  let _userPlayer = playerFactory("Player");

  let _playerMark = "x";
  let _computerMark = "o";

  function _checkWinner() {

  };

  function playRound(playerRowChoice, playerColChoice) {
    try {
      _playPlayerTurn(playerRowChoice, playerColChoice);
    } catch {return};

    let winner = _checkWinner();
    if (winner) {
      _endGame(winner);
      return;
    }

    _playComputerTurn();

    winner = _checkWinner();
    if (winner) {
      _endGame(winner);
      return;
    }
  };

  function _playPlayerTurn(row, col) {
    _playTurn(row, col, _playerMark);
  };

  function _getCellsWith(str) {
    const cellPositions = _board.reduce((acc, row, rowI) => {
      acc.push(row
                .reduce((acc, item, colI) => {
                  if (item === str) acc.push(colI);
                  return acc;
                }, [])
                .map((colI) => [rowI+1, colI+1])
              );
      return acc;
      }, []).flat();
    return cellPositions;
  };

  function _getEmptyCells() {
    return _getCellsWith("empty");
  };

  function _playComputerTurn() {
    const emptyCells = _getEmptyCells();
    if (emptyCells.length === 0) throw new Error("Computer couldn't find an empty cell.");
    
    const randomEmptyCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const computerChoice = randomEmptyCell;

    const [row, col] = computerChoice;
    _playTurn(row, col, _computerMark);
  };

  function setPlayerName(newName) {
    _userPlayer.setName(newName);
  };

  function _playTurn(row, col, mark) {
    let movementIsDone = null;
    try {
      movementIsDone = _setCell(row, col, mark);
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
    return _board.map(row => [...row]);
  };

  return {
    setPlayerName,
    playTurn : playRound,
    resetGame,
    getScore,
    getBoard
  };
})();