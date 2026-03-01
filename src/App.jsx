import { useState, useEffect } from "react";
import { polyfill } from "mobile-drag-drop";
import suImage from "./assets/su.png";

polyfill({
  dragImageCenterOnTouch: true,
});

function App() {
  const [page, setPage] = useState("home");
  const [size, setSize] = useState(4);
  const [solution, setSolution] = useState([]);
  const [board, setBoard] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [draggedAnimal, setDraggedAnimal] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);

  useEffect(() => {
    const handleTouchMove = (e) => {};
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    return () => window.removeEventListener("touchmove", handleTouchMove);
  }, []);

  const successMessages = [
    "Harikasin Su!",
    "Bravo Su!",
    "Supersin!",
    "Muhtesemsin!",
    "Cok zekisin!",
    "Tebrikler!",
    "Harika is!",
    "Aferin Su!",
    "Cok basarilisin!",
    "Mukemmelsin!",
  ];

  const allAnimals = Object.entries(
    import.meta.glob("./assets/*.png", { eager: true })
  )
    .filter(([path]) => !path.includes("su.png"))
    .map(([, mod]) => mod.default);

  const shuffle = (arr) => [...arr].sort(() => 0.5 - Math.random());

  const generateSolution = (n, selected) => {
    return Array.from({ length: n }, (_, r) =>
      Array.from({ length: n }, (_, c) => selected[(r + c) % n])
    );
  };

  const createPuzzle = (full) =>
    full.map((row) => row.map((cell) => (Math.random() < 0.5 ? cell : null)));

  const startGame = (n) => {
    const selected = shuffle(allAnimals).slice(0, n);
    const sol = generateSolution(n, selected);
    const puzzle = createPuzzle(sol);

    setSize(n);
    setAnimals(selected);
    setSolution(sol);
    setBoard(puzzle);
    setModalMessage(null);
    setPage("game");
  };

  const handleDrop = (e, r, c) => {
    e.preventDefault();
    if (!draggedAnimal) return;
    if (board[r][c] !== null) return;

    if (solution[r][c] === draggedAnimal) {
      const newBoard = board.map((row) => [...row]);
      newBoard[r][c] = draggedAnimal;
      setBoard(newBoard);

      const win = newBoard.every((row, ri) =>
        row.every((cell, ci) => cell === solution[ri][ci])
      );

      if (win) {
        const random =
          successMessages[Math.floor(Math.random() * successMessages.length)];
        setModalMessage(random);
      }
    }

    setDraggedAnimal(null);
  };

  if (page === "home") {
    return (
      <>
        <div className="home">
          <div className="card">
            <img src={suImage} className="profileImage" alt="Su" />
            <h1 className="mainTitle">Su'nun Ozel Oyunu</h1>
            <p className="subtitle">Bir boyut sec ve baslayalim!</p>

            <div className="sizeButtons">
              <button onClick={() => startGame(3)}>3x3</button>
              <button onClick={() => startGame(4)}>4x4</button>
              <button onClick={() => startGame(5)}>5x5</button>
            </div>
          </div>
        </div>
        <Styles />
      </>
    );
  }

  return (
    <>
      <div className="gameContainer">
        <button className="backBtn" onClick={() => setPage("home")}>
          Ana Sayfa
        </button>

        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${size}, 1fr)`,
            gridTemplateRows: `repeat(${size}, 1fr)`,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className="cell"
                onDragEnter={(e) => e.preventDefault()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, r, c)}
              >
                {cell && (
                  <img
                    src={cell}
                    style={{
                      width: "75%",
                      height: "75%",
                      objectFit: "contain",
                    }}
                    draggable={false}
                    alt="hayvan"
                  />
                )}
              </div>
            ))
          )}
        </div>

        <div className="animalBar">
          {animals.map((animal, i) => (
            <img
              key={i}
              src={animal}
              width="55"
              draggable
              onDragStart={(e) => {
                setDraggedAnimal(animal);
                e.dataTransfer.setData("text/plain", animal);
              }}
              alt="secenek"
            />
          ))}
        </div>
      </div>

      {modalMessage && (
        <div className="modalOverlay">
          <div className="modal">
            <h2>{modalMessage}</h2>
            <div className="modalButtons">
              <button onClick={() => startGame(size)}>Tekrar Oyna</button>
              <button onClick={() => setPage("home")}>Ana Sayfa</button>
            </div>
          </div>
        </div>
      )}

      <Styles />
    </>
  );
}

function Styles() {
  return (
    <style>{`
      body {
        margin:0;
        font-family: 'Comic Sans MS', cursive, sans-serif;
        touch-action: pan-y;
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        user-select: none;
      }

      .home {
        height:100vh;
        display:flex;
        justify-content:center;
        align-items:center;
        background: linear-gradient(135deg,#ffdde1,#cce7ff);
      }

      .card {
        background:white;
        padding:45px 35px;
        border-radius:30px;
        text-align:center;
        box-shadow:0 20px 50px rgba(0,0,0,0.15);
        width:85%;
        max-width:340px;
        box-sizing: border-box;
      }

      .mainTitle {
        font-size:28px;
        color:#ff2e63;
        margin-bottom:10px;
      }

      .subtitle {
        font-size:16px;
        color:#333;
        margin-bottom:20px;
      }

      .sizeButtons {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;
      }

      .sizeButtons button {
        padding:12px 24px;
        border:none;
        border-radius:25px;
        font-size:18px;
        background: linear-gradient(90deg,#ffafcc,#bde0fe);
        cursor:pointer;
        font-weight:bold;
      }

      .profileImage {
        width:130px;
        height:130px;
        border-radius:50%;
        object-fit:cover;
        margin-bottom:20px;
        border:6px solid #ffb3d9;
      }

      .gameContainer {
        min-height:100vh;
        background: linear-gradient(135deg,#fff1f9,#e6f4ff);
        display:flex;
        flex-direction:column;
        align-items:center;
        padding-top:20px;
        box-sizing: border-box;
      }

      .backBtn {
        margin-bottom:20px;
        padding:10px 25px;
        border:none;
        border-radius:20px;
        background:#ffafcc;
        cursor:pointer;
        font-weight:bold;
      }

      .grid {
        display:grid;
        gap:8px;
        width: 90vw;
        max-width: 450px;
        aspect-ratio: 1 / 1;
        margin: 0 auto;
      }

      .cell {
        background:white;
        border-radius:15px;
        display:flex;
        justify-content:center;
        align-items:center;
        box-shadow:0 4px 12px rgba(0,0,0,0.1);
      }

      .animalBar {
        margin-top:20px;
        display:flex;
        gap:12px;
        flex-wrap:wrap;
        justify-content:center;
        padding: 10px;
        background: rgba(255,255,255,0.5);
        border-radius: 20px;
        width: 90%;
        max-width: 450px;
      }

      .animalBar img {
        cursor:grab;
        touch-action: none;
      }

      .modalOverlay {
        position:fixed;
        top:0; left:0;
        width:100%;
        height:100%;
        background:rgba(0,0,0,0.5);
        display:flex;
        justify-content:center;
        align-items:center;
        z-index: 10;
      }

      .modal {
        background:white;
        padding:35px;
        border-radius:25px;
        text-align:center;
        box-shadow:0 15px 40px rgba(0,0,0,0.25);
        width:80%;
        max-width:280px;
      }

      .modal h2 {
        color:#ff2e63;
        margin-bottom:20px;
      }

      .modalButtons {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }

      .modalButtons button {
        padding:12px 20px;
        border:none;
        border-radius:15px;
        background:#ffafcc;
        font-weight:bold;
        cursor:pointer;
      }
    `}</style>
  );
}

export default App;
