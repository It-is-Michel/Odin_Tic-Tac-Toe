const ticTacToeGame = (() => {

  const _userIntefaceController = (() => {
    function setDisplay(displayContainer) {
    console.error("Not implemented");
    };

    return {setDisplay};
  })();

  // A 2D array that represents a 3x3 board
  const _emptyCell = null;
  const _board = new Array(3).fill(null).map(() => new Array(3).fill(_emptyCell))

  const playerFactory = ((_userName) => {
    const getName = () => _userName;
    const setName = (newName) => {_userName = newName};

    let _wins = 0;
    const getWins = () => _wins;
    const addWin = () => _wins++;

    let _losses = 0;
    const getLosses = () => _losses;
    const addLoss = () => _losses++;

    return {getName, setName, getWins, addWin, getLosses, addLoss};
  })();

  let _computerPlayer = playerFactory("Computer")
  let _userPlayer = playerFactory("Player")

  let _playerMark = "x";
  let _computerMark = "o";

  function playerPlayTurn() {
    console.error("Not implemented");
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
    setDisplay: _userIntefaceController.setDisplay,
    setUserPlayerName: _userPlayer.setName,
    playerPlayTurn,
    resetGame,
    getScore,
    getBoard
  };

})();