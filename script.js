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

  function playTurn() {
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
    playTurn,
    resetGame,
    getScore,
    getBoard
  };

})();