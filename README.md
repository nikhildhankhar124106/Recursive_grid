# The Recursive Grid

A 3x3 grid-based logic game built with Next.js 14 and Tailwind CSS, featuring complex ripple mechanics and cascading effects.

![Game Preview](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Tests](https://img.shields.io/badge/tests-29%2F29-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## 🎮 Game Rules

### Basic Mechanics
- **Click any cell** to increment its value by +1
- **Locked cells** (value ≥ 15) turn red and cannot be clicked
- **Negative numbers** also increment when clicked (e.g., -5 → -4)

### Ripple Effects

#### Divisible by 3 Rule
When a cell becomes divisible by 3 (e.g., 3, 6, 9, -3, -6...):
- **Effect:** Right neighbor decreases by 1
- **Exception:** 0 does NOT trigger this rule

#### Divisible by 5 Rule
When a cell becomes divisible by 5 (e.g., 5, 10, 15, -5, -10...):
- **Effect:** Bottom neighbor increases by 2
- **Exception:** 0 does NOT trigger this rule

### 🔗 Ripple Chaining
Ripples can trigger other ripples, creating cascading effects:

**Example Cascade:**
```
Click cell to 3 → Right neighbor -1 → Continue clicking...
Right neighbor becomes -5 → Its bottom neighbor +2
Bottom neighbor becomes -3 → Its right neighbor -1
```

## 🚀 Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

### Testing
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
```

### Build
```bash
npm run build
npm start
```

## 📁 Project Structure

```
Rec Grid/
├── app/
│   ├── gameState.js    # Core game logic (pure functions)
│   ├── page.js         # Main UI component
│   ├── layout.js       # Root layout
│   └── globals.css     # Tailwind styles
├── __tests__/
│   └── gameState.test.js  # Comprehensive test suite (29 tests)
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── jest.config.js
```

## 🧪 Test Coverage

**29/29 tests passing** ✅

- Initialization & Immutability (3 tests)
- Locking Behavior (2 tests)
- Negative Number Clicks (3 tests)
- Divisible by 3 Rule (4 tests)
- Divisible by 5 Rule (4 tests)
- Combined Rules (1 test)
- Ripple Chaining (6 tests)
- Complex Cascading (2 tests)
- Boundary & Edge Cases (4 tests)

## 🎯 Strategy Tips

1. **Avoid hitting 15 early** - Cells become permanently locked
2. **Use multiples of 3** to reduce neighbors strategically
3. **Use multiples of 5** to boost cells below
4. **Watch for chain reactions** when creating -5, -10, -3, -6, etc.
5. **Plan ahead** - Ripples can create unexpected cascades

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Testing:** Jest
- **Language:** JavaScript (ES6+)

## 📝 Game State Architecture

### Immutability
- All state updates return new objects
- No mutations of existing state
- Locked state is derived from value (≥ 15)

### Pure Functions
- `updateGrid(grid, row, col)` - Main game logic
- `isLocked(value)` - Check if value is locked
- `isValidPosition(row, col)` - Validate grid position

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- **Repository:** [https://github.com/nikhildhankhar124106/Recursive_grid](https://github.com/nikhildhankhar124106/Recursive_grid)
- **Live Demo:** [Deploy to Vercel](https://vercel.com)

---

Made with ❤️ by Nikhil Dhankhar
