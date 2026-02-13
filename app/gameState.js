/**
 * Game State Architecture for 3x3 Grid Logic Game
 */

export function createInitialState() {
    return {
        grid: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]
    };
}

export function isLocked(value) {
    return value >= 15;
}

export function isValidPosition(row, col) {
    return (
        Number.isInteger(row) &&
        Number.isInteger(col) &&
        row >= 0 &&
        row < 3 &&
        col >= 0 &&
        col < 3
    );
}

export function updateGrid(grid, row, col) {
    if (!isValidPosition(row, col)) {
        return grid;
    }

    // Logic Change: Check locked state on ORIGINAL grid
    if (isLocked(grid[row][col])) {
        return grid; // Locked cells cannot be modified
    }

    // Clone grid
    const newGrid = grid.map(r => [...r]);

    // Logic Change: Allow interaction even if locked (>= 15)
    // Logic Change: Negative number click -> Increment (Unified)
    // Previously it was decrement, but user requested to change it to increment.
    newGrid[row][col] += 1;

    const newValue = newGrid[row][col];

    // Ripple Rules with Chaining Support

    // Divisible by 3 -> Decrement RIGHT neighbor
    // Note: 0 is excluded to prevent unintended ripples
    if (newValue !== 0 && newValue % 3 === 0) {
        const rightCol = col + 1;
        if (isValidPosition(row, rightCol)) {
            // Ripple shouldn't affect locked cells
            if (!isLocked(newGrid[row][rightCol])) {
                newGrid[row][rightCol] -= 1;

                // Ripple Chaining Level 1: Check if the modified neighbor is now divisible by 5
                const neighborValue = newGrid[row][rightCol];
                if (neighborValue !== 0 && neighborValue % 5 === 0) {
                    const belowRow = row + 1;
                    if (isValidPosition(belowRow, rightCol)) {
                        if (!isLocked(newGrid[belowRow][rightCol])) {
                            newGrid[belowRow][rightCol] += 2;
                        }
                    }
                }

                // Ripple Chaining Level 1: Check if the modified neighbor is now divisible by 3
                if (neighborValue !== 0 && neighborValue % 3 === 0) {
                    const rightCol2 = rightCol + 1;
                    if (isValidPosition(row, rightCol2)) {
                        if (!isLocked(newGrid[row][rightCol2])) {
                            newGrid[row][rightCol2] -= 1;
                        }
                    }
                }
            }
        }
    }

    // Divisible by 5 -> Increment ONLY BELOW by 2
    // Works for both positive (5, 10, 15) and negative (-5, -10, -15) multiples
    // Note: 0 is excluded to prevent unintended ripples
    if (newValue !== 0 && newValue % 5 === 0) {
        const belowRow = row + 1;
        if (isValidPosition(belowRow, col)) {
            if (!isLocked(newGrid[belowRow][col])) {
                newGrid[belowRow][col] += 2;

                // Ripple Chaining: Check if the modified neighbor is now divisible by 3
                const belowValue = newGrid[belowRow][col];
                if (belowValue !== 0 && belowValue % 3 === 0) {
                    const rightCol = col + 1;
                    if (isValidPosition(belowRow, rightCol)) {
                        if (!isLocked(newGrid[belowRow][rightCol])) {
                            newGrid[belowRow][rightCol] -= 1;

                            // Deeper chaining: Check if this creates another -3
                            const rightValue = newGrid[belowRow][rightCol];
                            if (rightValue !== 0 && rightValue % 3 === 0) {
                                const rightCol2 = rightCol + 1;
                                if (isValidPosition(belowRow, rightCol2)) {
                                    if (!isLocked(newGrid[belowRow][rightCol2])) {
                                        newGrid[belowRow][rightCol2] -= 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    return newGrid;
}

export function resetGame() {
    return createInitialState();
}

export function getGridStats(state) {
    const values = state.grid.flat();
    const lockedCount = values.filter(isLocked).length;
    return {
        lockedCount
    };
}

export function isCellLocked(state, row, col) {
    return isLocked(state.grid[row][col]);
}
