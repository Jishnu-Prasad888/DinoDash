import React, { useEffect, useRef, useState, useCallback } from "react";
import dinoImg from "./assets/dino.png";
import cake from "./assets/cake.png";
import cometImg from "./assets/comet.png";

export default function App() {
  const [dinoX, setDinoX] = useState(200);
  const [apples, setApples] = useState([]);
  const [comets, setComets] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [playing, setPlaying] = useState(false);

  const gameRef = useRef();
  const keysPressed = useRef({});
  const animationFrameRef = useRef();
  const lastUpdateTime = useRef(0);

  // Use refs for values that need to be accessed in the game loop
  const dinoXRef = useRef(dinoX);
  const playingRef = useRef(playing);

  // Sync refs with state
  useEffect(() => {
    dinoXRef.current = dinoX;
  }, [dinoX]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  // Handle key events without blocking
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        keysPressed.current[e.key] = true;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
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

  // Smooth movement using requestAnimationFrame
  useEffect(() => {
    if (!playing) return;

    const moveDino = (timestamp) => {
      if (!lastUpdateTime.current) lastUpdateTime.current = timestamp;
      const deltaTime = timestamp - lastUpdateTime.current;

      // Update movement at consistent intervals (60fps equivalent)
      if (deltaTime > 16) {
        setDinoX((x) => {
          let newX = x;
          if (keysPressed.current["ArrowLeft"]) {
            newX = Math.max(0, x - 20);
          }
          if (keysPressed.current["ArrowRight"]) {
            newX = Math.min(window.innerWidth - 80, x + 20);
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

  // Improved collision detection function
  const checkCollisions = useCallback(() => {
    if (!playingRef.current) return;

    const dinoRect = {
      x: dinoXRef.current,
      y: window.innerHeight - 100,
      width: 60,
      height: 60
    };

    // Check apple collisions
    setApples((currentApples) => {
      const remainingApples = [];
      const collidedAppleIds = [];

      currentApples.forEach((apple) => {
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
          collidedAppleIds.push(apple.id);
          setScore(prev => prev + 1);
        } else {
          remainingApples.push(apple);
        }
      });

      return remainingApples;
    });

    // Check comet collisions
    setComets((currentComets) => {
      const remainingComets = [];
      const collidedCometIds = [];

      currentComets.forEach((comet) => {
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
          collidedCometIds.push(comet.id);
          setLives((prevLives) => {
            const newLives = prevLives - 1;
            if (newLives <= 0) {
              setTimeout(() => setPlaying(false), 0);
            }
            return newLives;
          });
        } else {
          remainingComets.push(comet);
        }
      });

      return remainingComets;
    });
  }, []);

  // Game loop using requestAnimationFrame for smooth updates
  useEffect(() => {
    if (!playing) return;

    let lastGameUpdate = 0;
    const gameLoop = (timestamp) => {
      if (!lastGameUpdate) lastGameUpdate = timestamp;
      const deltaTime = timestamp - lastGameUpdate;

      // Update game state at 50ms intervals (20fps for game logic)
      if (deltaTime > 50) {
        setApples((aps) =>
          aps
            .map((a) => ({ ...a, y: a.y + 5 }))
            .filter((a) => a.y < window.innerHeight)
        );
        setComets((cs) =>
          cs
            .map((c) => ({ ...c, y: c.y + 7 }))
            .filter((c) => c.y < window.innerHeight)
        );

        checkCollisions();
        lastGameUpdate = timestamp;
      }

      if (playingRef.current) {
        requestAnimationFrame(gameLoop);
      }
    };

    const loopId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(loopId);
  }, [playing, checkCollisions]);

  // Spawn apples & comets with cleanup
  useEffect(() => {
    if (!playing) return;

    const appleSpawner = setInterval(() => {
      setApples((a) => [
        ...a,
        {
          id: Math.random(),
          x: Math.random() * (window.innerWidth - 50),
          y: 0
        },
      ]);
    }, 1000);

    const cometSpawner = setInterval(() => {
      setComets((c) => [
        ...c,
        {
          id: Math.random(),
          x: Math.random() * (window.innerWidth - 50),
          y: 0
        },
      ]);
    }, 3000);

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
    setPlaying(true);
    keysPressed.current = {};
    lastUpdateTime.current = 0;
  };

  const endGame = () => {
    setPlaying(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return (
    <div
      ref={gameRef}
      className="relative w-full h-screen bg-gradient-to-b from-sky-200 to-green-200 overflow-hidden"
    >
      {/* Score + Lives */}
      <div className="absolute top-4 left-4 font-bold text-xl">Score: {score}</div>
      <div className="absolute top-4 right-4 font-bold text-xl">Lives: {lives}</div>

      {/* Dino */}
      <img
        src={dinoImg}
        alt="dino"
        className="absolute bottom-0 w-16 select-none transition-transform duration-100"
        style={{ left: dinoX }}
      />

      {/* Apples */}
      {apples.map((a) => (
        <img
          key={a.id}
          src={cake}
          alt="apple"
          className="absolute w-8 select-none transition-transform duration-100"
          style={{ top: a.y, left: a.x }}
        />
      ))}

      {/* Comets */}
      {comets.map((c) => (
        <img
          key={c.id}
          src={cometImg}
          alt="comet"
          className="absolute w-10 select-none transition-transform duration-100"
          style={{ top: c.y, left: c.x }}
        />
      ))}

      {!playing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white">
          <h1 className="text-4xl font-bold mb-4">
            {lives <= 0 ? "Game Over" : "Dino Apple Catch"}
          </h1>
          {lives <= 0 && <p className="mb-4 text-lg">Final Score: {score}</p>}
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            {lives <= 0 ? "Restart" : "Start Game"}
          </button>
        </div>
      )}
    </div>
  );
}