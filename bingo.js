const readline = require("readline");
const { submitAnswer } = require("./api.js");

function findLastWinningBoard(drawNumbers, boards) {
  let scores = new Array(boards.length).fill(0);
  let markedBoards = boards.map((board) => board.map((row) => row.slice())); // Deep copy of boards to mark numbers.

  let lastWinningBoardIndex = -1;
  let lastWinningDrawNumber = -1;

  for (let draw of drawNumbers) {
    let allBoardsWon = true;

    for (let boardIndex = 0; boardIndex < boards.length; boardIndex++) {
      let board = markedBoards[boardIndex];

      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (board[i][j] === draw) {
            board[i][j] = -1; // Mark the number as found.
          }
        }
      }

      if (scores[boardIndex] === 0 && hasBingo(board)) {
        scores[boardIndex] = getScore(board, draw);
        lastWinningBoardIndex = boardIndex;
        lastWinningDrawNumber = draw;
      }

      // Check if this board hasn't won yet
      if (scores[boardIndex] === 0) {
        allBoardsWon = false;
      }
    }

    // Break the loop if all boards have won
    if (allBoardsWon) break;
  }

  return scores[lastWinningBoardIndex];
}

function hasBingo(board) {
  for (let i = 0; i < 5; i++) {
    if (
      board[i].every((n) => n === -1) ||
      board.map((row) => row[i]).every((n) => n === -1)
    ) {
      return true;
    }
  }
  return false;
}

function getScore(board, draw) {
  let unmarkedSum = 0;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      if (board[i][j] !== -1) {
        unmarkedSum += board[i][j];
      }
    }
  }
  return unmarkedSum * draw;
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const promptUserForDrawNumbers = () => {
  return new Promise((resolve) => {
    console.log("Enter drawNumbers: ");
    rl.on("line", (input) => {
      const drawNumbers = input.split(",").map(Number);
      if (drawNumbers.some(isNaN)) {
        console.log("Invalid drawNumbers. Try again.");
        return;
      }
      resolve(drawNumbers);
      rl.removeAllListeners("line");
    });
  });
};

const promptUserForBoards = () => {
  return new Promise((resolve) => {
    console.log("Enter boards (type 'END' on a new line to finish): ");

    let boardsInput = [];
    rl.on("line", (line) => {
      if (line.trim().toUpperCase() === "END") {
        const boards = boardsInput
          .join("\n")
          .split("\n\n")
          .map((board) =>
            board.split("\n").map((row) =>
              row
                .split(" ")
                .filter((item) => item)
                .map(Number)
            )
          );

        if (
          boards.some((board) =>
            board.some((row) => row.some(isNaN) || row.length !== 5)
          )
        ) {
          console.log("Invalid board input. Try again.");
          return;
        }

        resolve(boards);
        rl.removeAllListeners("line");
      } else {
        boardsInput.push(line);
      }
    });
  });
};

const main = async () => {
  const drawNumbers = await promptUserForDrawNumbers();
  const boards = await promptUserForBoards();

  rl.close();
  const answer = findLastWinningBoard(drawNumbers, boards);
  const name = "Jimmy Hwang";

  console.log(answer, name);

  const response = await submitAnswer(answer, name);

  console.log("Response from server:", response);

  return findLastWinningBoard(drawNumbers, boards);
};

main();
