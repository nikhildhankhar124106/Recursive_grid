'use client';
import { useState } from 'react';
import { createInitialState, updateGrid, isCellLocked, resetGame } from './gameState';

export default function Home() {
    const [gameState, setGameState] = useState(createInitialState());

    const handleCellClick = (row, col) => {
        setGameState({
            grid: updateGrid(gameState.grid, row, col)
        });
    };

    const handleReset = () => {
        setGameState(resetGame());
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-6 font-sans">
            <h1 className="text-3xl font-bold mb-4">Recursive Grid</h1>

            <div className="grid grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm">
                {gameState.grid.map((row, rowIndex) =>
                    row.map((value, colIndex) => {
                        const locked = isCellLocked(gameState, rowIndex, colIndex);

                        // Logic Change: Even if locked (red), it's still clickable
                        return (
                            <div
                                key={`${rowIndex}-${colIndex}`}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                className={`
                  w-24 h-24 flex items-center justify-center 
                  text-2xl font-bold select-none cursor-pointer transition-transform active:scale-95
                  ${locked ? 'bg-red-500 text-white' :
                                        value % 2 === 0 ? 'bg-gray-200 text-black' : 'bg-indigo-900 text-white'}
                `}
                                style={{
                                    borderRadius: '4px',
                                    boxShadow: '2px 2px 0px black',
                                    border: '1px solid black'
                                }}
                            >
                                {value}
                            </div>
                        );
                    })
                )}
            </div>

            <button
                onClick={handleReset}
                className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors font-bold shadow-[2px_2px_0px_black] active:translate-y-[2px] active:shadow-none"
            >
                Reset Game
            </button>
        </div>
    );
}
