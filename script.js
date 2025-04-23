const board = document.getElementById("board");
const message = document.getElementById("message");

const words = ["apple", "grape", "prank"];
const targetWord = words[Math.floor(Math.random() * words.length)];
let attempts = 6;
let currentRow = 0;
const virtualKeyboard = document.querySelectorAll(".key");

function updateKeyboardColor(letter, colorClass) {
  // Find the key in the virtual keyboard using the data-letter attribute
  const key = Array.from(virtualKeyboard).find(
    (key) => key.dataset.letter.toUpperCase() === letter.toUpperCase()
  );
  if (key) {
    // Add the appropriate class to the key (green, yellow, or gray)
    key.classList.add(colorClass);
  }
}
function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < attempts; i++) {
    for (let j = 0; j < 5; j++) {
      const tile = document.createElement("input");
      tile.type = "text";
      tile.maxLength = 1;
      tile.classList.add("tile");
      tile.dataset.row = i;
      tile.dataset.col = j;

      // Handle input and movement
      tile.addEventListener("input", handleInput);
      tile.addEventListener("keydown", handleBackspace);

      board.appendChild(tile);
    }
  }

  focusTile(0, 0); // Start at the first tile
}
document.querySelectorAll(".key").forEach((key) => {
  key.addEventListener("click", (e) => {
    const keyValue = e.target.textContent;

    if (keyValue === "Enter") {
      checkRow(currentRow); // Check the current row when "Enter" is clicked
    } else if (keyValue === "Backspace") {
      handleBackspaceVirtual(); // Handle backspace logic
    } else {
      handleVirtualKeyInput(keyValue); // Handle letter input
    }
  });
});
function handleVirtualKeyInput(letter) {
  const tiles = document.querySelectorAll(".tile");
  const activeTile = Array.from(tiles).find(
    (tile) => parseInt(tile.dataset.row) === currentRow && !tile.value
  );

  if (activeTile) {
    activeTile.value = letter.toLowerCase();
    const col = parseInt(activeTile.dataset.col);

    if (col < 4) {
      focusTile(currentRow, col + 1); // Move to the next tile
    }
  }
}
function handleBackspaceVirtual() {
  const tiles = document.querySelectorAll(".tile");
  const filledTiles = Array.from(tiles).filter(
    (tile) => parseInt(tile.dataset.row) === currentRow && tile.value
  );

  if (filledTiles.length > 0) {
    const lastTile = filledTiles[filledTiles.length - 1];
    lastTile.value = ""; // Clear the tile
    focusTile(currentRow, parseInt(lastTile.dataset.col)); // Move focus to this tile
  }
}
function focusTile(row, col) {
  const tiles = document.querySelectorAll(".tile");
  const nextTile = Array.from(tiles).find(
    (t) => parseInt(t.dataset.row) === row && parseInt(t.dataset.col) === col
  );

  if (nextTile) {
    nextTile.focus();
  }
}

function handleInput(e) {
  const tile = e.target;
  const row = parseInt(tile.dataset.row);
  const col = parseInt(tile.dataset.col);

  if (row !== currentRow) {
    return; // Prevent input if it's not the current row
  }

  const value = tile.value.toLowerCase();
  if (value.match(/[a-z]/i)) {
    tile.value = value;
    if (col < 4) {
      focusTile(row, col + 1); // Move to the next tile
    } else {
      checkRow(row); // Check the row when it's full
    }
  }
}

function handleBackspace(e) {
  const tile = e.target;
  const row = parseInt(tile.dataset.row);
  const col = parseInt(tile.dataset.col);

  if (row !== currentRow) {
    return; // Prevent backspace actions in rows other than the current
  }

  if (e.key === "Backspace" && !tile.value && col > 0) {
    focusTile(row, col - 1); // Move back if the tile is empty
  }
}
function checkRow(row) {
  let guess = "";
  const tiles = document.querySelectorAll(`.tile[data-row="${row}"]`);

  tiles.forEach((tile) => (guess += tile.value));

  if (guess.length === 5) {
    // Reset virtual keyboard colors first
    virtualKeyboard.forEach((key) =>
      key.classList.remove("green", "yellow", "gray")
    );

    for (let i = 0; i < 5; i++) {
      const tile = tiles[i];
      const letter = tile.value;

      if (letter === targetWord[i]) {
        tile.classList.add("green");
        updateKeyboardColor(letter, "green");
      } else if (targetWord.includes(letter)) {
        tile.classList.add("yellow");
        updateKeyboardColor(letter, "yellow");
      } else {
        tile.classList.add("gray");
        updateKeyboardColor(letter, "gray");
      }
    }

    if (guess === targetWord) {
      setMessage("Congratulations! You guessed the word!");
      disableBoard();
    } else {
      currentRow++;
      if (currentRow === attempts) {
        setMessage(`Game over! The word was "${targetWord}".`);
        disableBoard();
      } else {
        focusTile(currentRow, 0); // Move to the next row
      }
    }
  }
}
function flipTile(tile) {
  // Add the flipped class to trigger the flip animation
  tile.classList.add("flipped");
}

function focusTile(row, col) {
  const tiles = document.querySelectorAll(".tile");
  tiles.forEach((tile) => tile.classList.remove("active-row")); // Clear active class

  const nextTile = Array.from(tiles).find(
    (t) => parseInt(t.dataset.row) === row && parseInt(t.dataset.col) === col
  );

  const activeRowTiles = document.querySelectorAll(`.tile[data-row="${row}"]`);
  activeRowTiles.forEach((tile) => tile.classList.add("active-row")); // Add active class to the row

  if (nextTile) nextTile.focus();
}

function checkRow(row) {
  const tiles = document.querySelectorAll(`.tile[data-row="${row}"]`);
  let guess = "";
  let allFilled = true;

  tiles.forEach((tile) => {
    if (!tile.value) {
      allFilled = false;
    }
    guess += tile.value;
  });

  if (!allFilled) {
    setMessage("Please fill all tiles in the row.");
    return;
  }

  // Proceed with validation if all tiles are filled
  for (let i = 0; i < 5; i++) {
    const tile = tiles[i];
    const letter = tile.value;

    if (letter === targetWord[i]) {
      tile.classList.add("green");
    } else if (targetWord.includes(letter)) {
      tile.classList.add("yellow");
    } else {
      tile.classList.add("gray");
    }
  }

  if (guess === targetWord) {
    setMessage("Congratulations! You guessed the word!");
    disableBoard();
  } else {
    currentRow++;
    if (currentRow === attempts) {
      setMessage(`Game over! The word was "${targetWord}".`);
      disableBoard();
    } else {
      focusTile(currentRow, 0);
    }
  }
}

function setMessage(text) {
  message.textContent = text;
}

function disableBoard() {
  document.querySelectorAll(".tile").forEach((tile) => (tile.disabled = true));
}

createBoard();
