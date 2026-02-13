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

    // Logic Change: Negative number click -> Decrement
    if (newGrid[row][col] < 0) {
        newGrid[row][col] -= 1;
    } else {
        newGrid[row][col] += 1;
    }

    const newValue = newGrid[row][col];

    // Ripple Rules

    // Divisible by 3 -> Decrement RIGHT neighbor
    if (newValue !== 0 && newValue % 3 === 0) {
        const rightCol = col + 1;
        if (isValidPosition(row, rightCol)) {
            // Ripple shouldn't affect locked cells (though dependent on design, commonly it doesn't)
            if (!isLocked(newGrid[row][rightCol])) {
                newGrid[row][rightCol] -= 1;
            }
        }
    }

    // Logic Change: Divisible by 5 -> Increment ONLY BELOW by 2
    if (newValue !== 0 && newValue % 5 === 0) {
        const belowRow = row + 1;
        if (isValidPosition(belowRow, col)) {
            if (!isLocked(newGrid[belowRow][col])) {
                newGrid[belowRow][col] += 2;
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
