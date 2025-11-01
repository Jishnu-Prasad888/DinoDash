import React, { useEffect, useRef, useState } from "react";
import dinoImg from "./assets/dino.png";

export default function App() {
  const [dinoX, setDinoX] = useState(200);
  const [apples, setApples] = useState([]);
  const [comets, setComets] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playing, setPlaying] = useState(false);
  const [cometsRate, setcometsRate] = useState(0);
  const gameRef = useRef();
  const keysPressed = useRef({});
  const animationFrameRef = useRef();
  const lastUpdateTime = useRef(0);
  const gameLoopRef = useRef();

  // Use refs for values that need to be accessed in the game loop
  const dinoXRef = useRef(dinoX);
  const applesRef = useRef(apples);
  const cometsRef = useRef(comets);
  const playingRef = useRef(playing);
  const livesRef = useRef(lives);

  // Sync refs with state
  useEffect(() => {
    dinoXRef.current = dinoX;
  }, [dinoX]);

  useEffect(() => {
    applesRef.current = apples;
  }, [apples]);

  useEffect(() => {
    cometsRef.current = comets;
  }, [comets]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  // Handle key events
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        keysPressed.current[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        keysPressed.current[e.key] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Collision detection function using refs
  const checkCollisions = () => {
    if (!playingRef.current) return;

    const dinoRect = {
      x: dinoXRef.current,
      y: window.innerHeight - 100,
      width: 60,
      height: 60
    };

    const currentApples = applesRef.current;
    const currentComets = cometsRef.current;

    let scoreIncrease = 0;
    let livesDecrease = 0;

    // Check apple collisions
    const remainingApples = currentApples.filter((apple) => {
      const appleRect = {
        x: apple.x,
        y: apple.y,
        width: 40,
        height: 40
      };

      const isColliding =
        appleRect.x < dinoRect.x + dinoRect.width &&
        appleRect.x + appleRect.width > dinoRect.x &&
        appleRect.y < dinoRect.y + dinoRect.height &&
        appleRect.y + appleRect.height > dinoRect.y;

      if (isColliding) {
        scoreIncrease++;
        return false; // Remove apple
      }
      return true; // Keep apple
    });

    // Check comet collisions
    const remainingComets = currentComets.filter((comet) => {
      const cometRect = {
        x: comet.x,
        y: comet.y,
        width: 40,
        height: 40
      };

      const isColliding =
        cometRect.x < dinoRect.x + dinoRect.width &&
        cometRect.x + cometRect.width > dinoRect.x &&
        cometRect.y < dinoRect.y + dinoRect.height &&
        cometRect.y + cometRect.height > dinoRect.y;

      if (isColliding) {
        livesDecrease++;
        return false; // Remove comet
      }
      return true; // Keep comet
    });

    // Update state in batches
    if (scoreIncrease > 0) {
      setScore(prev => prev + scoreIncrease);
    }

    if (livesDecrease > 0) {
      setLives((prevLives) => {
        const newLives = prevLives - livesDecrease;
        if (newLives <= 0) {
          setPlaying(false);
        }
        return Math.max(0, newLives);
      });
    }

    if (remainingApples.length !== currentApples.length) {
      setApples(remainingApples);
    }

    if (remainingComets.length !== currentComets.length) {
      setComets(remainingComets);
    }
  };

  // Smooth movement using requestAnimationFrame
  useEffect(() => {
    if (!playing) return;

    const moveDino = (timestamp) => {
      if (!lastUpdateTime.current) lastUpdateTime.current = timestamp;
      const deltaTime = timestamp - lastUpdateTime.current;

      // Update movement at consistent intervals
      if (deltaTime > 16) {
        setDinoX((x) => {
          let newX = x;
          if (keysPressed.current["ArrowLeft"]) {
            newX = Math.max(0, x - 15);
          }
          if (keysPressed.current["ArrowRight"]) {
            newX = Math.min(window.innerWidth - 80, x + 15);
          }
          return newX;
        });
        lastUpdateTime.current = timestamp;
      }

      animationFrameRef.current = requestAnimationFrame(moveDino);
    };

    animationFrameRef.current = requestAnimationFrame(moveDino);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [playing]);

  // Combined game loop for object movement and collision detection
  useEffect(() => {
    if (!playing) return;

    let lastGameUpdate = 0;
    const gameLoop = (timestamp) => {
      if (!playingRef.current) return;

      if (!lastGameUpdate) lastGameUpdate = timestamp;
      const deltaTime = timestamp - lastGameUpdate;

      // Update game state at regular intervals
      if (deltaTime > 40) {
        // Move apples
        setApples((aps) =>
          aps
            .map((a) => ({ ...a, y: a.y + 5 }))
            .filter((a) => a.y < window.innerHeight)
        );

        // Move comets
        if (score >= 10) {
          setcometsRate(score * 0.1);
          setComets((cs) =>
            cs
              .map((c) => ({ ...c, y: c.y + 7 + cometsRate }))
              .filter((c) => c.y < window.innerHeight)
          );
        }
        else {
          setComets((cs) =>
            cs
              .map((c) => ({ ...c, y: c.y + 7 }))
              .filter((c) => c.y < window.innerHeight)
          );
        }

        // Check collisions after position updates
        setTimeout(() => checkCollisions(), 0);

        lastGameUpdate = timestamp;
      }

      if (playingRef.current) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
      }
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [playing]);

  // Spawn apples & comets
  useEffect(() => {
    if (!playing) return;

    const appleSpawner = setInterval(() => {
      if (playingRef.current) {
        setApples((a) => [
          ...a,
          {
            id: Math.random(),
            x: Math.random() * (window.innerWidth - 50),
            y: 0
          },
        ]);
      }
    }, 1200);

    const cometSpawner = setInterval(() => {
      if (playingRef.current) {
        setComets((c) => [
          ...c,
          {
            id: Math.random(),
            x: Math.random() * (window.innerWidth - 50),
            y: 0
          },
        ]);
      }
    }, 2500 - cometsRate * 100);

    return () => {
      clearInterval(appleSpawner);
      clearInterval(cometSpawner);
    };
  }, [playing]);

  const startGame = () => {
    setScore(0);
    setLives(3);
    setApples([]);
    setComets([]);
    setDinoX(200);
    setPlaying(true);
    keysPressed.current = {};
    lastUpdateTime.current = 0;
  };

  return (
    <div
      ref={gameRef}
      className="relative w-full h-screen bg-gradient-to-b from-sky-200 to-green-200 overflow-hidden"
    >
      {/* Score + Lives */}
      <div className="absolute top-4 left-4 font-bold text-xl bg-white/70 px-3 py-1 rounded">
        Score: {score}
      </div>
      <div className="absolute top-4 right-4 font-bold text-xl bg-white/70 px-3 py-1 rounded">
        Lives: {lives}
      </div>

      {/* Dino */}
      <img
        src={dinoImg}
        alt="dino"
        className="absolute bottom-0 w-16 h-16 select-none"
        style={{ left: dinoX }}
      />

      {/* Apples (Cakes) */}
      {apples.map((a) => (
        <div
          key={a.id}
          className="absolute w-10 h-10 text-3xl select-none"
          style={{ top: a.y, left: a.x }}
        >
          🎂
        </div>
      ))}

      {/* Comets */}
      {comets.map((c) => (
        <div
          key={c.id}
          className="absolute w-10 h-10 text-3xl select-none"
          style={{ top: c.y, left: c.x }}
        >
          ☄️
        </div>
      ))}

      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
          <h1 className="text-4xl font-bold mb-4">
            {lives <= 0 ? "Game Over!" : "Dino Apple Catch"}
          </h1>
          {lives <= 0 && <p className="mb-4 text-lg">Final Score: {score}</p>}
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-bold"
          >
            {lives <= 0 ? "Play Again" : "Start Game"}
          </button>
          <p className="mt-4 text-sm">Use Arrow Keys to move left and right</p>
        </div>
      )}
    </div>
  );
}