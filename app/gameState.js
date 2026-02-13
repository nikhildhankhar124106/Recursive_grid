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

    // Clone grid
    const newGrid = grid.map(r => [...r]);

    // Logic Change: Allow interaction even if locked (>= 15)
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
            newGrid[row][rightCol] -= 1;
        }
    }

    // Logic Change: Divisible by 5 -> Increment ALL neighbors by 2
    if (newValue !== 0 && newValue % 5 === 0) {
        const neighbors = [
            { r: row - 1, c: col }, // Up
            { r: row + 1, c: col }, // Down
            { r: row, c: col - 1 }, // Left
            { r: row, c: col + 1 }  // Right
        ];

        neighbors.forEach(({ r, c }) => {
            if (isValidPosition(r, c)) {
                newGrid[r][c] += 2;
            }
        });
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
