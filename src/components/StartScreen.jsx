import React from "react";

const StartScreen = ({ lives, score, startGame, isGameOver }) => {
    const handleRestart = () => {
        startGame(); // Use the prop function instead of reloading
    };

    if (!isGameOver) {
        return (
            <>
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="bg-white text-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full text-center">
                        <h2 className="text-2xl font-bold mb-3 text-green-600">🦖 DinoDash</h2>
                        <p className="mb-2">
                            Escape the falling comets and eat as many cakes as possible to increase your score!
                        </p>
                        <p className="mb-4 text-sm text-gray-600">
                            Use the <span className="font-semibold">←</span> and <span className="font-semibold">→</span> arrow keys to move your dinosaur.
                        </p>
                        <button
                            onClick={startGame}
                            className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            </>
        );
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white text-gray-800 rounded-lg shadow-2xl p-6 max-w-sm w-full text-center">
                <h2 className="text-3xl font-bold mb-3 text-red-600">💀 Game Over!</h2>

                <div className="mb-4">
                    <p className="text-lg">
                        <span className="font-semibold">Score:</span> {score}
                    </p>
                    <p className="text-lg">
                        <span className="font-semibold">Lives Left:</span> {lives}
                    </p>
                </div>

                <button
                    onClick={handleRestart}
                    className="mt-2 px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                >
                    🔁 Restart Game
                </button>
            </div>
        </div>
    );
};

export default StartScreen;
