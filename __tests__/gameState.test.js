import { updateGrid, isLocked, isCellLocked, createInitialState, isValidPosition } from '../app/gameState';

describe('Game State Tests', () => {
    describe('Initialization', () => {
        it('should initialize with a 3x3 grid of zeros', () => {
            const state = createInitialState();
            expect(state.grid).toEqual([
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ]);
        });
    });

    describe('Immutability', () => {
        it('should not mutate the original grid', () => {
            const original = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
            const snapshot = JSON.parse(JSON.stringify(original));
            updateGrid(original, 0, 0);
            expect(original).toEqual(snapshot);
        });

        it('should return a new grid reference when modified', () => {
            const grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result).not.toBe(grid);
        });

        it('should return same reference when clicking locked cell', () => {
            const grid = [[15, 0, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result).toBe(grid);
        });
    });

    describe('Locking Behavior', () => {
        it('should block clicking on cells >= 15', () => {
            let grid = [[14, 0, 0], [0, 0, 0], [0, 0, 0]];
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(15);
            expect(isLocked(grid[0][0])).toBe(true);

            const lockedGrid = updateGrid(grid, 0, 0);
            expect(lockedGrid).toBe(grid);
            expect(lockedGrid[0][0]).toBe(15);
        });

        it('should not allow ripples to affect locked cells', () => {
            const grid = [[2, 15, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(3);
            expect(result[0][1]).toBe(15); // Locked cell unchanged
        });
    });

    describe('Click Behavior: Negative Numbers', () => {
        it('should increment negative numbers when clicked', () => {
            let grid = [[-5, 0, 0], [0, 0, 0], [0, 0, 0]];
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(-4);
        });

        it('should increment from -1 to 0', () => {
            let grid = [[-1, 0, 0], [0, 0, 0], [0, 0, 0]];
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(0);
        });

        it('should increment positive numbers normally', () => {
            let grid = [[5, 0, 0], [0, 0, 0], [0, 0, 0]];
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(6);
        });
    });

    describe('Divisible by 3 Rule', () => {
        it('should decrement right neighbor when cell becomes divisible by 3', () => {
            const grid = [[2, 0, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(3);
            expect(result[0][1]).toBe(-1);
        });

        it('should work for negative multiples of 3', () => {
            const grid = [[-4, 0, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(-3);
            expect(result[0][1]).toBe(-1);
        });

        it('should NOT trigger when value becomes 0', () => {
            const grid = [[-1, 5, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(0);
            expect(result[0][1]).toBe(5); // Unchanged
        });

        it('should handle boundary (no right neighbor)', () => {
            const grid = [[0, 0, 2], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 2);
            expect(result[0][2]).toBe(3);
            // No crash, no error
        });
    });

    describe('Divisible by 5 Rule', () => {
        it('should increment bottom neighbor by 2 when cell becomes divisible by 5', () => {
            const grid = [[4, 0, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(5);
            expect(result[1][0]).toBe(2);
        });

        it('should work for negative multiples of 5', () => {
            const grid = [[-6, 0, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(-5);
            expect(result[1][0]).toBe(2);
        });

        it('should NOT trigger when value becomes 0', () => {
            const grid = [[-1, 0, 0], [5, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(0);
            expect(result[1][0]).toBe(5); // Unchanged
        });

        it('should handle boundary (no bottom neighbor)', () => {
            const grid = [[0, 0, 0], [0, 0, 0], [4, 0, 0]];
            const result = updateGrid(grid, 2, 0);
            expect(result[2][0]).toBe(5);
            // No crash, no error
        });
    });

    describe('Combined Rules: 15', () => {
        it('should apply both div-by-3 and div-by-5 rules for 15', () => {
            const grid = [[14, 0, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(15);
            expect(result[0][1]).toBe(-1); // Div by 3
            expect(result[1][0]).toBe(2);  // Div by 5
        });
    });

    describe('Ripple Chaining: Div-by-3 creates Div-by-5', () => {
        it('should trigger div-by-5 when div-by-3 creates -5', () => {
            const grid = [[2, -4, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(3);
            expect(result[0][1]).toBe(-5); // Created by div-by-3
            expect(result[1][1]).toBe(2);  // Triggered by -5
        });

        it('should trigger div-by-5 when div-by-3 creates 5', () => {
            const grid = [[2, 4, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(3);
            expect(result[0][1]).toBe(3); // 4 - 1 = 3 (NOT 5, no div-by-5 ripple)
        });
    });

    describe('Ripple Chaining: Div-by-3 creates Div-by-3', () => {
        it('should trigger div-by-3 when div-by-3 creates -3', () => {
            const grid = [[2, -2, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(3);
            expect(result[0][1]).toBe(-3); // Created by div-by-3
            expect(result[0][2]).toBe(-1); // Triggered by -3
        });

        it('should trigger div-by-3 when div-by-3 creates 3', () => {
            const grid = [[2, 2, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(3);
            expect(result[0][1]).toBe(1); // 2 - 1 = 1 (NOT divisible by 3, no further chain)
        });
    });

    describe('Ripple Chaining: Div-by-5 creates Div-by-3', () => {
        it('should trigger div-by-3 when div-by-5 creates -3 below', () => {
            const grid = [[4, 0, 0], [-5, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(5);
            expect(result[1][0]).toBe(-3); // -5 + 2 = -3
            expect(result[1][1]).toBe(-1); // Triggered by -3
        });

        it('should trigger deeper div-by-3 chaining', () => {
            const grid = [[4, 0, 0], [-5, -2, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(5);
            expect(result[1][0]).toBe(-3); // -5 + 2 = -3
            expect(result[1][1]).toBe(-3); // -2 - 1 = -3
            expect(result[1][2]).toBe(-1); // Triggered by second -3
        });
    });

    describe('Complex Cascading Scenarios', () => {
        it('should handle multiple clicks creating cascading ripples', () => {
            let grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

            // Click to 1
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(1);

            // Click to 2
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(2);

            // Click to 3
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(3);
            expect(grid[0][1]).toBe(-1);

            // Click to 4
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(4);
            expect(grid[0][1]).toBe(-1); // Unchanged

            // Click to 5
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(5);
            expect(grid[1][0]).toBe(2); // Div by 5 triggered

            // Click to 6
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(6);
            expect(grid[0][1]).toBe(-2); // Div by 3 again
        });

        it('should handle 15 with cascading effects', () => {
            const grid = [[14, -4, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, 0, 0);
            expect(result[0][0]).toBe(15);
            expect(result[0][1]).toBe(-5); // -4 - 1 = -5
            expect(result[1][0]).toBe(2);  // Div by 5
            expect(result[1][1]).toBe(2);  // -5 triggers div-by-5
        });
    });

    describe('Boundary and Edge Cases', () => {
        it('should handle invalid positions gracefully', () => {
            const grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
            const result = updateGrid(grid, -1, 0);
            expect(result).toBe(grid);
        });

        it('should validate position correctly', () => {
            expect(isValidPosition(0, 0)).toBe(true);
            expect(isValidPosition(2, 2)).toBe(true);
            expect(isValidPosition(-1, 0)).toBe(false);
            expect(isValidPosition(0, 3)).toBe(false);
            expect(isValidPosition(3, 0)).toBe(false);
        });

        it('should handle corner cells (bottom-right)', () => {
            const grid = [[0, 0, 0], [0, 0, 0], [0, 0, 4]];
            const result = updateGrid(grid, 2, 2);
            expect(result[2][2]).toBe(5);
            // No crash for out-of-bounds ripples
        });
    });
});
