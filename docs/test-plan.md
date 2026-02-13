# Logic Verification Test Plan

The goal of this plan is to ensure strict adherence to the game's mathematical rules and recursive logic.

## Logic Overview

| Condition | Target | Action |
| :--- | :--- | :--- |
| Click (Value < 15) | Self | `+1` |
| Value % 3 == 0 (and != 0) | Right Neighbor | `-1` |
| Value % 5 == 0 (and != 0) | Below Neighbor | `+2` |
| Value >= 15 | Self | **LOCKED** (Ignore clicks/ripples) |

## Chaining Strategy

The system must support ripple chaining up to a reasonable depth (currently implemented in `gameState.js`) to handle scenarios where a ripple creates a value that itself satisfies a ripple condition.

### Verified Chains:
1.  **Div 3 -> Div 5:** Right neighbor hitting a multiple of 5.
2.  **Div 3 -> Div 3:** Right neighbor hitting a multiple of 3.
3.  **Div 5 -> Div 3:** Bottom neighbor hitting a multiple of 3.

## Automated Verification

We use **Jest** for logic validation. The test suite `__tests__/gameState.test.js` covers:
- Boundary conditions (corners and edges).
- Multi-step ripples.
- Immutability of state.
- Lockdown enforcement.

## UI/UX Requirements
- **Rounded corners:** 4px.
- **Shadow:** 2px solid black.
- **Colors:** 
    - Even: Gray-200.
    - Odd: Indigo-900.
    - Locked: Red-500.
