# Manual Test Suite

This document outlines the manual test cases for verifying the core mechanics of The Recursive Grid.

## 1. Initial State
*   **Setup:** Start/Reset game.
*   **Action:** Observe grid.
*   **Expected:** All 9 cells display `0`. Background is gray.

## 2. Basic Increment
*   **Action:** Click cell at (1,1).
*   **Expected:** Cell value becomes `1`. Background color may change based on odd/even.

## 3. Negative Number Increment
*   **Action:** 
    1. Click (0,0) three times to trigger ripple to (0,1).
    2. Cell (0,1) should be `-1`.
    3. Click (0,1).
*   **Expected:** Cell (0,1) becomes `0`. (Previously it decreased, now it must increment).

## 4. Divisible by 3 (Right Ripple)
*   **Action:** Click cell at (0,0) until value is `3`.
*   **Expected:** 
    - (0,0) displays `3`.
    - (0,1) displays `-1`.

## 5. Divisible by 5 (Bottom Ripple)
*   **Action:** Click cell at (0,0) until value is `5`.
*   **Expected:**
    - (0,0) displays `5`.
    - (1,0) displays `2`.

## 6. Locking Mechanism (at 15)
*   **Action:** Click cell until value reaches `15`.
*   **Expected:**
    - Cell becomes `15`.
    - Cell background turns **RED**.
    - Clicking cell again has **NO EFFECT** (interaction is blocked).

## 7. Ripple Chaining
*   **Action:** 
    1. Click (0,0) enough times to ripple (0,1) down to `-5`. (You'll need (0,0) to reach `15`).
*   **Expected:**
    - When (0,1) hits `-5`, it triggers its own ripple.
    - Cell (1,1) (below -5) should increment by `+2`.

## 8. 0 Exception Guard
*   **Action:** 
    1. Click (0,0) until it is `3`.
    2. (0,1) becomes `-1`.
    3. Click (0,0) again until it is `6`.
    4. (0,1) becomes `-2`.
    5. Click (0,1).
    6. (0,1) becomes `-1`.
    7. Click (0,1) again.
*   **Expected:** 
    - (0,1) becomes `0`.
    - **No ripple** should occur from (0,1) when it becomes `0`. (Right neighbor (0,2) and bottom neighbor (1,1) remain unchanged).
