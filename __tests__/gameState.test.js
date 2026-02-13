import { updateGrid, isLocked, isCellLocked, createInitialState } from '../app/gameState';

describe('updateGrid', () => {
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

    describe('Modified Logic: Unlock at 15', () => {
        it('should allow clicking on a cell that is >= 15', () => {
            let grid = [[14, 0, 0], [0, 0, 0], [0, 0, 0]];
            // Click to 15
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(15);
            expect(isLocked(grid[0][0])).toBe(true);

            // Click again (should increment to 16)
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(16);
            expect(isLocked(grid[0][0])).toBe(true);
        });
    });

    describe('Modified Logic: Negative Numbers', () => {
        it('should decrement if value is negative', () => {
            // Setup: -1 at (0,0)
            let grid = [[-1, 0, 0], [0, 0, 0], [0, 0, 0]];
            // Click (should go to -2)
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(-2);
        });

        it('should increment if value is 0 or positive', () => {
            let grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
            // Click (should go to 1)
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(1);
        });
    });

    describe('Modified Logic: Divisible by 5 Ripple', () => {
        it('should increment ALL neighbors by 2 when divisible by 5', () => {
            // Setup: Center (1,1) -> 4. Neighbors 0.
            let grid = [
                [0, 0, 0],
                [0, 4, 0],
                [0, 0, 0]
            ];

            // Click (1,1) -> 5
            grid = updateGrid(grid, 1, 1);

            expect(grid[1][1]).toBe(5);
            // Neighbors should be +2
            expect(grid[0][1]).toBe(2); // Up
            expect(grid[2][1]).toBe(2); // Down
            expect(grid[1][0]).toBe(2); // Left
            expect(grid[1][2]).toBe(2); // Right
        });

        it('should handle boundary conditions for ripple', () => {
            // Setup: Top-Left (0,0) -> 4.
            let grid = [
                [4, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];

            // Click (0,0) -> 5
            grid = updateGrid(grid, 0, 0);

            expect(grid[0][0]).toBe(5);
            // Neighbors
            expect(grid[0][1]).toBe(2); // Right
            expect(grid[1][0]).toBe(2); // Down
            // Should not crash or modify invalid indices
        });
    });

    describe('Combined Rules', () => {
        it('should apply both Div 3 (Right -1) and Div 5 (All +2) for 15', () => {
            // Setup: (0,0) -> 14. Right (0,1) -> 0. Below (1,0) -> 0.
            let grid = [
                [14, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ];

            // Click -> 15
            grid = updateGrid(grid, 0, 0);

            expect(grid[0][0]).toBe(15);

            // Div 3 Ripple: Right becomes -1
            // Div 5 Ripple: Right becomes +2
            // Net effect on Right: -1 + 2 = 1?
            // Or application order matters?
            // Code:
            // if (div 3) right -= 1
            // if (div 5) neighbors += 2
            // So: 0 -> -1 -> 1.
            expect(grid[0][1]).toBe(1);

            // Other neighbors (Down) just get +2
            expect(grid[1][0]).toBe(2);
        });
    });
});
