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

    describe('Reverted Logic: Block at 15', () => {
        it('should NOT allow clicking on a cell that is >= 15', () => {
            let grid = [[14, 0, 0], [0, 0, 0], [0, 0, 0]];
            // Click to 15
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(15);
            expect(isLocked(grid[0][0])).toBe(true);

            // Click again (should NOT increment to 16)
            const lockedGrid = updateGrid(grid, 0, 0);
            expect(lockedGrid).toBe(grid); // Should return same reference
            expect(lockedGrid[0][0]).toBe(15);
        });
    });

    describe('Modified Logic: Negative Numbers', () => {
        it('should INCREMENT (not decrement) if value is negative', () => {
            // Setup: -1 at (0,0)
            let grid = [[-1, 0, 0], [0, 0, 0], [0, 0, 0]];
            // Click (should go to 0, not -2)
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(0);
        });

        it('should increment if value is 0 or positive', () => {
            let grid = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
            // Click (should go to 1)
            grid = updateGrid(grid, 0, 0);
            expect(grid[0][0]).toBe(1);
        });
    });

    describe('Reverted Logic: Divisible by 5 Ripple', () => {
        it('should increment ONLY BELOW neighbor by 2 when divisible by 5', () => {
            // Setup: Center (1,1) -> 4. Neighbors 0.
            let grid = [
                [0, 0, 0],
                [0, 4, 0],
                [0, 0, 0]
            ];

            // Click (1,1) -> 5
            grid = updateGrid(grid, 1, 1);

            expect(grid[1][1]).toBe(5);
            // Only DOWN neighbor should be +2
            expect(grid[2][1]).toBe(2); // Down

            // Others should correspond to original state (0)
            expect(grid[0][1]).toBe(0); // Up
            expect(grid[1][0]).toBe(0); // Left
            expect(grid[1][2]).toBe(0); // Right
        });

        it('should handle boundary conditions for ripple', () => {
            // Setup: Bottom-Left (2,0) -> 4.
            let grid = [
                [0, 0, 0],
                [0, 0, 0],
                [4, 0, 0]
            ];

            // Click (2,0) -> 5
            grid = updateGrid(grid, 2, 0);

            expect(grid[2][0]).toBe(5);
            // Below neighbor doesn't exist. Should not crash.
        });
    });

    describe('Combined Rules', () => {
        it('should apply both Div 3 (Right -1) and Div 5 (Below +2) for 15', () => {
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
            expect(grid[0][1]).toBe(-1);

            // Div 5 Ripple: Below becomes +2
            expect(grid[1][0]).toBe(2);
        });
    });
});
