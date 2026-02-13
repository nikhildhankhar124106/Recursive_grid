'use client';

import React, { useState, useCallback } from 'react';
import {
    updateGrid,
    createInitialState,
    isLocked,
    resetGame,
    getGridStats
} from './gameState';

export default function Home() {
    const [state, setState] = useState(createInitialState());

    const handleCellClick = useCallback((row, col) => {
        setState(prevState => ({
            ...prevState,
            grid: updateGrid(prevState.grid, row, col)
        }));
    }, []);

    const handleReset = useCallback(() => {
        setState(resetGame());
    }, []);

    const stats = getGridStats(state);

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-4 py-12 gap-12 overflow-x-hidden">
            {/* Header Section */}
            <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-4 duration-1000">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter gold-text uppercase underline-offset-8 decoration-yellow-500/20 mb-2">
                    Recursive Grid
                </h1>

            </div>

            <div className="flex flex-col lg:flex-row items-start gap-12 w-full max-w-7xl animate-in fade-in zoom-in-95 duration-700 delay-300">
                {/* Rules Panel (Mastery Guide) - Hidden on mobile, visible side panel on desktop */}
                <section className="lg:w-1/3 w-full glass-panel p-8 space-y-8 rounded-none border-l-4 border-yellow-500/50">
                    <h2 className="text-2xl font-bold gold-text uppercase tracking-widest border-b border-white/10 pb-4">
                        Mastery Guide
                    </h2>

                    <div className="space-y-6">
                        <RuleItem
                            title="The Click"
                            desc="Click any active cell to increment its value by +1. Negative numbers also increment (e.g., -5 → -4)."
                            icon="⚡"
                        />
                        <RuleItem
                            title="Divisible by 3"
                            desc="When a cell hits a multiple of 3 (3, 6, 9..., -3, -6...), its RIGHT neighbor decreases by 1."
                            icon="→"
                            highlight="bg-indigo-500/20 text-indigo-300"
                        />
                        <RuleItem
                            title="Divisible by 5"
                            desc="When a cell hits a multiple of 5 (5, 10... -5, -10...), its BELOW neighbor increases by 2."
                            icon="↓"
                            highlight="bg-yellow-500/20 text-yellow-300"
                        />
                        <RuleItem
                            title="The Lockdown"
                            desc="Cells reach Critical Mass at 15. Locked cells turn red, pulse with energy, and cannot be modified."
                            icon="🔒"
                            highlight="bg-red-500/20 text-red-300"
                        />
                        <RuleItem
                            title="Ripple Chaining"
                            desc="Ripples can trigger further ripples. Creating a multiple of 5 via ripple will trigger the bottom neighbor!"
                            icon="🔗"
                        />
                    </div>
                </section>

                {/* Game Area */}
                <div className="flex-1 flex flex-col items-center gap-12 w-full">
                    {/* Game Stats */}
                    <div className="flex gap-8 text-sm tracking-[0.2em] font-bold">
                        <div className="px-6 py-2 glass-panel border-b-2 border-yellow-500/50">
                            LOCKED: <span className="text-yellow-400 ml-2">{stats.lockedCount} / 9</span>
                        </div>
                        <div className="px-6 py-2 glass-panel border-b-2 border-yellow-500/50">
                            STATUS: <span className={stats.lockedCount === 9 ? "text-red-500" : "text-green-500"}>
                                {stats.lockedCount === 9 ? "TERMINATED" : "OPERATIONAL"}
                            </span>
                        </div>
                    </div>

                    {/* Grid Container */}
                    <div className="relative p-8 glass-card rounded-none gold-border group">
                        {/* Decorative Corners */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-400 -translate-x-2 -translate-y-2" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-400 translate-x-2 translate-y-2" />

                        <div className="grid grid-cols-3 gap-6">
                            {state.grid.map((row, rowIndex) => (
                                row.map((value, colIndex) => {
                                    const locked = isLocked(value);
                                    const isNegative = value < 0;

                                    return (
                                        <div
                                            key={`${rowIndex}-${colIndex}`}
                                            onClick={() => !locked && handleCellClick(rowIndex, colIndex)}
                                            className={`
                        w-24 h-24 md:w-32 md:h-32 
                        flex items-center justify-center 
                        text-3xl md:text-5xl font-black 
                        rounded
                        shadow-[2px_2px_0px_black]
                        cell-transition
                        selection:bg-none select-none
                        ${locked
                                                    ? 'bg-red-600/80 text-white cursor-not-allowed locked-pulse'
                                                    : isNegative
                                                        ? 'bg-indigo-900/40 text-indigo-400 cursor-pointer border-2 border-indigo-500/30'
                                                        : value % 2 === 0
                                                            ? 'bg-[#e0e0e0] text-black cursor-pointer hover:bg-[#d0d0d0]'
                                                            : 'bg-[#1a237e] text-white cursor-pointer hover:bg-[#283593]'
                                                }
                      `}
                                        >
                                            {value}
                                        </div>
                                    );
                                })
                            ))}
                        </div>
                    </div>

                    {/* Controls */}
                    <button
                        onClick={handleReset}
                        className="premium-button"
                    >
                        Initiate Reset
                    </button>
                </div>
            </div>


        </main>
    );
}

function RuleItem({ title, desc, icon, highlight = "" }) {
    return (
        <div className={`p-4 glass-card border-none transition-all duration-300 hover:bg-white/10 ${highlight}`}>
            <div className="flex items-center gap-3 mb-1">
                <span className="text-xl">{icon}</span>
                <h3 className="font-bold text-xs uppercase tracking-widest opacity-80">{title}</h3>
            </div>
            <p className="text-[11px] leading-relaxed opacity-60 font-medium">
                {desc}
            </p>
        </div>
    );
}
