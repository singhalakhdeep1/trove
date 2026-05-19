# 🎯 6-MONTH FRONTEND INTERVIEW PREPARATION ROADMAP

> **Goal:** Master 850+ critical interview points + 400+ DSA problems  
> **Timeline:** 24 weeks (Feb-July 2026) | Daily: 2-3 hours  
> **Target:** 85-95% interview success rate for SDE1/SDE2

---

## 🌟 WHY 6 MONTHS

| Metric          | 4-Month       | 6-Month (This Plan) |
| --------------- | ------------- | ------------------- |
| Daily Pressure  | High (rushed) | Sustainable         |
| DSA Problems    | 255           | **400+**            |
| Projects        | 10            | **15**              |
| Mock Interviews | 20            | **35+**             |
| Retention Rate  | 60-70%        | **80-90%**          |
| Burnout Risk    | Medium-High   | **Low**             |

**Bottom Line:** Triple practice, double retention, zero stress.

---

## 📊 PREPARATION STRATEGY

### Daily Schedule (2-3 hours)

- **30 min:** Theory revision + Anki flashcards
- **30 min:** 1 DSA problem
- **60-90 min:** Deep dive study + hands-on coding
- **Weekend:** Projects (4-6 hours) + Mock interviews

### Weekly Structure

- **Mon-Tue:** New concepts (deep understanding)
- **Wed:** Hands-on practice (polyfills/implementations)
- **Thu:** Practice + output questions
- **Fri:** DSA problems (2-3 medium/hard)
- **Sat:** Machine coding / Project work (4 hours)
- **Sun:** Revision + Mock interview / rest

### Monthly Milestones

- **Month 1:** JavaScript Core Mastery (150 pts)
- **Month 2:** React Fundamentals + Basic DSA (150 pts)
- **Month 3:** HTML/CSS/TypeScript + Intermediate DSA (150 pts)
- **Month 4:** Performance + State Management + Advanced DSA (150 pts)
- **Month 5:** System Design + Senior Topics + Projects (120 pts)
- **Month 6:** Interview Ready - Mocks + Company prep (130 pts)

---

# 🗓️ MONTH 1: JAVASCRIPT MASTERY

**Goal:** JavaScript Core + Async Programming (150 points)  
**DSA:** Arrays, Strings, HashMap basics (40 Easy + 20 Medium)

---

## WEEK 1: JavaScript Fundamentals (Feb 10-16)

### Day 1 (Mon, Feb 10): Variables & Hoisting

**Topics to Master:**

- var, let, const differences
- Hoisting behavior (variables & functions)
- Temporal Dead Zone (TDZ)
- Data types (primitive vs reference)
- Type coercion

**Practice:**

- [ ] **DSA:** Two Sum (LC #1) ⭐⭐⭐
- [ ] Write 10 hoisting output questions
- [ ] Create blog post explaining hoisting (300-500 words)
- [ ] Test TDZ with let/const examples
- [ ] Create 5 Anki flashcards for hoisting rules

---

### Day 2 (Tue, Feb 11): Scope & Closures ⭐⭐⭐

**Topics to Master:**

- Lexical scope and scope chain
- What is a closure?
- Closures in loops (var vs let)
- IIFE (Immediately Invoked Function Expression)
- Module pattern using closures
- Function factories
- Private variables with closures

**Practice:**

- [ ] **DSA:** Contains Duplicate (LC #217)
- [ ] Implement closure-based `once()` function
- [ ] Create counter with reset functionality
- [ ] Build simple cache using closures
- [ ] Solve "var in loop" problem (3 different approaches)
- [ ] Create 8 Anki flashcards

**Can you explain closures clearly?** _(Must be YES before moving on)_

---

### Day 3 (Wed, Feb 12): this, call, apply, bind ⭐⭐⭐

**Topics to Master:**

- **4 Binding Rules for `this`:**
  1. Default Binding
  2. Implicit Binding
  3. Explicit Binding (call, apply, bind)
  4. new Binding
- Arrow functions and lexical `this`
- Lost context problem
- call() vs apply() vs bind()

**Polyfills to Implement:**

1. Function.prototype.myCall()
2. Function.prototype.myApply()
3. Function.prototype.myBind() ⭐⭐⭐

**Practice:**

- [ ] **DSA:** Valid Anagram (LC #242)
- [ ] Solve 10 `this` binding output questions
- [ ] Implement all 3 polyfills from scratch
- [ ] Fix `this` issues in callback functions
- [ ] Create comparison table: call vs apply vs bind
- [ ] Create 10 Anki flashcards

---

### Day 4 (Thu, Feb 13): Array Methods Deep Dive ⭐⭐⭐

**Topics to Master:**

- map() - Transform elements
- filter() - Select elements
- reduce() - Aggregate values ⭐⭐⭐
- forEach() - Side effects
- find() vs findIndex()
- some() vs every()
- Method Chaining

**Polyfills to Implement:**

1. Array.prototype.myMap()
2. Array.prototype.myFilter()
3. Array.prototype.myReduce() ⭐⭐⭐
4. Array.prototype.myForEach()

**Practice:**

- [ ] **DSA:** Best Time to Buy and Sell Stock (LC #121)
- [ ] Implement all 4 polyfills from scratch
- [ ] Chain 5 array methods for data transformation
- [ ] Use reduce for: sum, count occurrences, group by property, flatten array
- [ ] Solve 5 Codewars katas
- [ ] Create array methods cheat sheet
- [ ] Create 8 Anki flashcards

---

### Day 5 (Fri, Feb 14): Objects & Prototypes ⭐⭐⭐

**Topics to Master:**

- **Object Creation Patterns:**
  1. Object literals
  2. Constructor functions
  3. Object.create()
  4. ES6 Classes (syntactic sugar)
- **Prototype Chain** ⭐⭐⭐
- **Prototypal Inheritance**
- Object.keys(), values(), entries()
- Object.assign(), fromEntries()
- Destructuring & Spread
- Deep vs Shallow Copy

**Implementation:**

- Deep clone function (handle circular references)

**Practice:**

- [ ] **DSA:** Product of Array Except Self (LC #238)
- [ ] Draw prototype chain diagram (3-level inheritance)
- [ ] Implement deep clone from scratch
- [ ] Create class using prototype pattern (no `class` keyword)
- [ ] Solve 5 object manipulation problems
- [ ] Explain prototype chain in interview format
- [ ] Create 8 Anki flashcards

---

### Day 6-7 (Weekend, Feb 15-16): PROJECT + REVISION

#### Saturday: Vanilla JS Todo App (4 hours)

**Features to Implement:**

1. Add todo (input + button)
2. Mark as complete (checkbox)
3. Delete todo (button)
4. Filter: All / Active / Completed
5. LocalStorage persistence
6. Edit todo (double-click)
7. Clear completed button
8. Todo count display

**Technical Requirements:**

- Use closures for state management (IIFE module pattern)
- Use array methods (map, filter, reduce)
- Proper event delegation
- No global variables
- Clean, modular code

**Bonus Challenges:**

- Implement undo/redo with closures
- Add drag-and-drop reordering

**Checklist:**

- [ ] All 8 features working
- [ ] Module pattern used correctly
- [ ] Event delegation implemented
- [ ] LocalStorage persisting data
- [ ] Code is clean and readable
- [ ] Tested thoroughly

---

#### Sunday: WEEK 1 REVISION & ASSESSMENT

**Revision (2 hours):**

- [ ] Review all flashcards (60 cards total)
- [ ] Re-solve 3 DSA problems from this week (no hints)
- [ ] Re-implement 2 polyfills from memory (call/bind or map/filter)

**Assessment Test (2 hours):**

**Theory (30 min):**

1. Explain hoisting with code example
2. What is closure? Give 3 real-world use cases
3. Explain prototype chain with diagram
4. Differences: call vs apply vs bind
5. What happens when you use 'var' in a loop with setTimeout?
6. Deep vs shallow copy - implementation difference
7. Event loop phases - explain with example
8. Why can't arrow functions be used as constructors?

**Coding (60 min):**

1. Implement debounce function (10 min)
2. Implement throttle function (10 min)
3. Flatten nested array (10 min)
4. Group array of objects by key (15 min)
5. Implement Function.prototype.bind (15 min)

**DSA (30 min):**

- [ ] Solve 2 medium problems (new ones, not from this week)
- [ ] Must solve in < 30 min combined
- [ ] Solutions should be optimal

**Scoring:**

- Theory: 8/8 questions = 100%
- Coding: 5/5 challenges = 100%
- DSA: 2/2 problems = 100%
- **Passing: 80% overall (24/30 points)**

**If you score < 80%:**

- [ ] Review weak areas for 2 hours
- [ ] Re-attempt failed questions
- [ ] DO NOT proceed to Week 2 until 80%+ achieved

---

### WEEK 1 FINAL CHECKLIST

**Concepts Mastered:**

- [ ] Hoisting (var, let, const, function)
- [ ] Closures (5+ examples, can teach to others)
- [ ] `this` keyword (4 binding rules)
- [ ] call, apply, bind (polyfills implemented)
- [ ] Array methods (map, filter, reduce - polyfills done)
- [ ] Prototype chain (can draw diagram)
- [ ] Objects (deep clone implementation)

**Polyfills Implemented (8 total):**

- [ ] Function.prototype.call
- [ ] Function.prototype.apply
- [ ] Function.prototype.bind
- [ ] Array.prototype.map
- [ ] Array.prototype.filter
- [ ] Array.prototype.reduce
- [ ] Array.prototype.forEach
- [ ] Deep clone function

**DSA Progress:**

- [ ] 7 problems solved
- [ ] HashMap pattern understood
- [ ] Array manipulation mastered

**Projects:**

- [ ] Todo app with vanilla JS (fully functional)

**Flashcards:**

- [ ] 60+ Anki flashcards created
- [ ] Review daily going forward

---

## WEEK 2: Async JavaScript & Browser APIs (Feb 17-23)

### Day 8 (Mon, Feb 17): Callbacks & Promises

**Topics to Master:**

- **Callbacks:**
  - Callback hell (pyramid of doom)
  - Error-first callbacks (Node.js convention)
- **Promises:** ⭐⭐⭐
  - Promise states: pending, fulfilled, rejected
  - Promise chaining
  - Error handling (.catch, .finally)
  - Converting callbacks to promises
- Why promises are better than callbacks

**Practice:**

- [ ] **DSA:** Merge Two Sorted Lists (LC #21)
- [ ] Convert 3 callback-based functions to promises
- [ ] Chain 5 promises sequentially
- [ ] Handle errors at different points in promise chain
- [ ] Create 10 promise output prediction questions
- [ ] Draw promise state diagram (pending → fulfilled/rejected)
- [ ] Create 8 Anki flashcards

---

### Day 9 (Tue, Feb 18): async/await & Promise Methods ⭐⭐⭐

**Topics to Master:**

- **async/await:**
  - Syntactic sugar for promises
  - Error handling with try/catch
  - Multiple awaits (sequential vs parallel)
- **Promise Static Methods:** ⭐⭐⭐
  - Promise.all() - Wait for all (fail fast)
  - Promise.race() - First to settle wins
  - Promise.allSettled() - Wait for all (no fail fast)
  - Promise.any() - First fulfillment wins

**Polyfills to Implement:**

1. Promise.all() ⭐⭐⭐
2. Promise.race()
3. Promise.allSettled()

**Practice:**

- [ ] **DSA:** 3Sum (LC #15)
- [ ] Implement all 3 promise method polyfills from scratch
- [ ] Convert 5 async operations from sequential to parallel
- [ ] Implement timeout wrapper using Promise.race
- [ ] Solve 10 async/await output questions
- [ ] Create comparison table: all vs race vs allSettled vs any
- [ ] Create 10 Anki flashcards

---

### Day 10 (Wed, Feb 19): Event Loop ⭐⭐⭐ (MOST IMPORTANT!)

**Topics to Master:**

- Event Loop components: Call Stack, Web APIs, Task Queue, Microtask Queue
- Execution order: Sync → Microtasks → Macrotasks
- Microtasks vs Macrotasks
- Priority order: Sync code → process.nextTick → Promises → requestAnimationFrame → setTimeout/setInterval
- Why promises run before setTimeout (even with 0ms delay)
- Nested timers and promises execution order

**Visualizations to Draw:**

- Event loop diagram (call stack, web APIs, queues)
- Flow chart: sync → microtasks → macrotask → repeat
- Example execution trace (step-by-step)

**Practice:**

- [ ] **DSA:** Container With Most Water (LC #11)
- [ ] Solve 20 event loop output questions ⭐⭐⭐
- [ ] Draw event loop diagram from memory
- [ ] Explain event loop to a non-technical person
- [ ] Answer: "What is the difference between setTimeout and Promise?"
- [ ] Watch Philip Roberts JSConf talk (MUST WATCH!)
- [ ] Create 12 Anki flashcards

**Before moving on:** _Can you explain the event loop perfectly?_

---

### Day 11 (Thu, Feb 20): debounce, throttle & Browser APIs

**Topics to Master:**

- **debounce:** Wait for pause in events (use case: search input)
- **throttle:** Limit execution rate (use case: scroll events)
- Differences between debounce and throttle
- Advanced debounce with immediate execution option
- Advanced throttle with trailing call option

**Polyfills to Implement:**

- debounce(func, delay)
- debounce(func, delay, immediate)
- throttle(func, limit)
- throttle(func, limit) with trailing call

**Browser APIs:**

- setTimeout & setInterval (and their cleanup)
- requestAnimationFrame (~60 FPS for animations)
- Fetch API (GET and POST requests)
- AbortController (cancel fetch requests)
- Error handling with fetch

**Practice:**

- [ ] **DSA:** Longest Substring Without Repeating Characters (LC #3)
- [ ] Implement debounce and throttle from memory (both versions)
- [ ] Build search input with debounced API call
- [ ] Implement infinite scroll with throttled scroll handler
- [ ] Practice fetch with error handling and timeouts
- [ ] Explain debounce vs throttle in interview setting
- [ ] Create visual comparison: debounce vs throttle timelines
- [ ] Create 8 Anki flashcards

---

### Day 12 (Fri, Feb 21): Advanced Functions (Currying, Memoization)

**Topics to Master:**

- **Currying:** Transform function(a, b, c) into function(a)(b)(c)
- Generic curry implementation
- **Function Composition:** compose (right to left) vs pipe (left to right)
- **Memoization:** Cache function results for performance
- Memoization use cases: Fibonacci, expensive calculations, API calls
- Advanced memoization with WeakMap

**Polyfills to Implement:**

- curry(fn) - generic curry function
- compose(...fns) - right to left composition
- pipe(...fns) - left to right composition
- memoize(fn) - basic memoization
- memoize with WeakMap for object keys

**Practice:**

- [ ] **DSA:** Minimum Window Substring (LC #76)
- [ ] Implement curry function from scratch
- [ ] Implement compose and pipe
- [ ] Implement memoize function
- [ ] Memoize fibonacci and compare performance
- [ ] Explain use cases for each pattern
- [ ] List 3 real-world use cases for each pattern
- [ ] Create 8 Anki flashcards

---

### Day 13-14 (Weekend, Feb 22-23): PROJECT + REVISION

#### Saturday: Weather App with API (4 hours)

**Features:**

- Search for city weather
- Display current weather (temp, conditions, humidity, wind)
- 5-day forecast
- Debounced search input
- Loading states
- Error handling (no city found, network error)
- LocalStorage: recent searches (max 5)
- Geolocation: get current location weather
- Background changes based on weather condition

**Technical Requirements:**

- Use Fetch API with OpenWeatherMap API (free tier)
- Implement debounce for search
- Proper error boundaries
- Loading spinners
- Clean, responsive UI

**Checklist:**

- [ ] API integration working
- [ ] Debounced search implemented
- [ ] Loading states visible
- [ ] Error handling for all cases
- [ ] LocalStorage for recent searches
- [ ] Geolocation feature working
- [ ] Responsive design
- [ ] Background changes with weather

---

#### Sunday: WEEK 2 REVISION & ASSESSMENT

**Revision (2 hours):**

- [ ] Review all Week 2 flashcards (50+ cards)
- [ ] Re-implement Promise.all from memory
- [ ] Re-implement debounce and throttle from memory
- [ ] Draw event loop diagram from memory
- [ ] Solve 3 event loop output questions (no hints)

**Assessment (2 hours):**

**Theory (30 min):**

- Explain the event loop with diagram
- Differences: Promise.all vs Promise.race vs Promise.allSettled
- How does async/await work under the hood?
- Explain debounce vs throttle with use cases
- What is memoization? When to use it?
- Explain promise chaining and error handling
- What are microtasks vs macrotasks?
- How does closure help in debounce/throttle?

**Coding (60 min):**

- Implement Promise.all() (15 min)
- Implement debounce with immediate option (10 min)
- Implement memoize (10 min)
- Fix async code to run in parallel instead of sequential (10 min)
- Solve event loop output question and explain each line (15 min)

**DSA (30 min):**

- [ ] Solve 2 new medium problems in < 30 min total

**Scoring:** Pass: 24/30 (80%)

**If < 80%:** Review weak areas for 2 hours, DO NOT proceed

---

### WEEK 2 FINAL CHECKLIST

**Concepts Mastered:**

- [ ] Promises (states, chaining, error handling)
- [ ] async/await (syntactic sugar, try/catch)
- [ ] Event loop ⭐⭐⭐ (can draw diagram and explain)
- [ ] Promise methods (all, race, allSettled, any)
- [ ] debounce & throttle (from memory)
- [ ] Currying, composition, memoization
- [ ] Fetch API, AbortController
- [ ] Browser timing functions

**Polyfills Implemented (6):**

- [ ] Promise.all()
- [ ] Promise.race()
- [ ] Promise.allSettled()
- [ ] debounce()
- [ ] throttle()
- [ ] memoize()

**DSA Progress:**

- [ ] 14 total problems (7 from Week 2)
- [ ] Sliding window pattern understood
- [ ] Two pointers mastered

**Projects:**

- [ ] Weather app with API integration

**Total Flashcards:** 110+ cards

---

## WEEK 3: React Fundamentals (Feb 24 - Mar 2)

### Day 15 (Mon, Feb 24): React Basics & Virtual DOM

**Topics to Master:**

- **Virtual DOM:** Why it exists, how it works
- DOM manipulation is slow (reflow + repaint)
- Virtual DOM = in-memory representation (plain JS objects)
- **Reconciliation Algorithm:** Diff old vs new virtual DOM trees
- React updates only changed real DOM nodes (efficient!)
- **Keys in Lists:** Why important, stable unique keys vs index keys
- Common mistake: Using array index as key
- **JSX:** JavaScript XML, compiles to React.createElement calls
- **Components:** Functional vs Class components
- **Props:** Immutable, parent to child data flow
- Props drilling and callback props

**Practice:**

- [ ] **DSA:** Reverse Linked List (LC #206)
- [ ] Explain virtual DOM to non-technical person
- [ ] Draw reconciliation process diagram
- [ ] Build 5 simple React components (Button, Card, List, etc.)
- [ ] Explain why keys are important in lists
- [ ] Convert JSX to React.createElement manually (3 examples)
- [ ] Create 10 Anki flashcards

---

### Day 16 (Tue, Feb 25): useState Hook ⭐⭐⭐

**Topics to Master:**

- **useState Hook:** const [state, setState] = useState(initialValue)
- State updates are asynchronous!
- **Functional Updates:** Correct way to handle multiple state updates
- Use previous state: setState(prev => prev + 1)
- **Lazy Initialization:** Use function for expensive initial state
- **State with Objects:** Immutability, spread operator for updates
- **State with Arrays:** Add, remove, update without mutation
- Multiple state variables vs single object state
- Common mistakes: Direct mutation, batching issues

**Practice Projects:**

- Counter with increment/decrement/reset
- Form with multiple inputs (name, email, message)
- Todo list (add, remove, toggle complete)
- Shopping cart (add item, remove item, update quantity)

**Interview Questions:**

- Why do multiple setState calls only increment by 1?
- Why is state immutable?
- When would you use lazy initialization?
- Functional updates vs direct updates

**Practice:**

- [ ] **DSA:** Linked List Cycle (LC #141)
- [ ] Build all 4 practice projects
- [ ] Understand functional updates
- [ ] Master immutability concept
- [ ] List 3 common useState mistakes and fixes
- [ ] Create 12 Anki flashcards

---

### Day 17 (Wed, Feb 26): useEffect Hook ⭐⭐⭐

**Topics to Master:**

- **useEffect Hook:** useEffect(() => { /\* effect \*/ return () => { /\* cleanup \*/ }}, [deps])
- Side effects: Data fetching, subscriptions, manual DOM changes
- **Dependency array behaviors:**
  - No array: Runs on every render
  - Empty array []: Runs once on mount
  - With deps [count]: Runs when deps change
- Cleanup function: Runs before next effect or on unmount

**Common Use Cases:**

- Data fetching from API (with loading states)
- Event listeners (with cleanup!)
- Timers/intervals (with cleanup!)
- LocalStorage sync
- Document title updates

**Common Pitfalls:**

- **Infinite Loop:** Setting state of dependency inside useEffect
- **Missing Dependencies:** ESLint warnings, use functional updates
- **Cleanup Not Done:** Memory leaks from event listeners, timers
- Execution order: Render → Cleanup from previous → Effect runs

**Practice Projects:**

- Fetch user data from JSONPlaceholder API
- Build live clock with setInterval
- Implement dark mode toggle (localStorage persistence)
- Build window resize listener (display width/height)
- Auto-save form to localStorage

**Practice:**

- [ ] **DSA:** Maximum Subarray (LC #53) - Kadane's algorithm
- [ ] Build all 5 useEffect practice projects
- [ ] Understand cleanup (critical!)
- [ ] Master dependency array rules
- [ ] List 5 common useEffect use cases
- [ ] Create 12 Anki flashcards

---

### Day 18 (Thu, Feb 27): useRef, useMemo, useCallback

**Topics to Master:**

- **useRef:** Persist values across renders without causing re-render
- Common uses: DOM access, storing previous values, timers
- useRef vs useState
- **useMemo:** Memoize expensive calculations
- Only recomputes when dependencies change
- Use cases: Filtering large lists, complex computations
- **useCallback:** Memoize function references
- Prevents unnecessary child re-renders
- Use with React.memo for optimization
- When NOT to use: Premature optimization

**Practice:**

- [ ] **DSA:** Best Time to Buy/Sell Stock II (LC #122)
- [ ] Build: Focus input on mount using useRef
- [ ] Build: Previous value tracker with useRef
- [ ] Build: Expensive filter with useMemo
- [ ] Build: Parent-child with useCallback and React.memo
- [ ] Explain when to use each hook
- [ ] Create 10 Anki flashcards

---

### Day 19 (Fri, Feb 28): Custom Hooks & Forms

**Topics to Master:**

- **Custom Hooks:** Extract reusable logic
- Rules: Must start with "use", can call other hooks
- Common custom hooks: useLocalStorage, useFetch, useDebounce
- **Forms in React:**
- Controlled components (state manages input)
- Uncontrolled components (refs for input)
- Form validation
- Handling multiple inputs

**Custom Hooks to Build:**

- useLocalStorage (persist state to localStorage)
- useFetch (data fetching with loading/error states)
- useDebounce (debounce any value)
- useToggle (boolean state toggle)

**Practice:**

- [ ] **DSA:** Valid Palindrome (LC #125)
- [ ] Build all 4 custom hooks
- [ ] Build: Multi-input form with validation
- [ ] Build: Search with debounced API call (useDebounce)
- [ ] Build: Dark mode toggle (useLocalStorage)
- [ ] Create 8 Anki flashcards

---

### Day 20-21 (Weekend, Mar 1-2): PROJECT + REVISION

#### Saturday: E-commerce Cart Page (4 hours)

**Features:**

- Product list with images, name, price
- Add to cart (with quantity selector)
- Cart sidebar/page
- Update quantity in cart
- Remove from cart
- Calculate total price
- LocalStorage persistence (cart survives reload)
- Empty cart state
- Responsive design

**Technical Requirements:**

- Use useState for cart state
- Use useEffect for localStorage sync
- Create custom useLocalStorage hook
- Use useMemo for total price calculation
- Component composition (ProductCard, CartItem, etc.)

**Checklist:**

- [ ] All 9 features working
- [ ] Custom hooks implemented
- [ ] LocalStorage persistence
- [ ] Optimized with useMemo
- [ ] Clean component structure
- [ ] Responsive design

---

#### Sunday: WEEK 3 REVISION & ASSESSMENT

**Revision (2 hours):**

- [ ] Review all Week 3 flashcards (40+ cards)
- [ ] Draw Virtual DOM reconciliation diagram
- [ ] Explain useState functional updates
- [ ] Explain useEffect dependency array
- [ ] Re-build e-commerce cart from memory (simplified)

**Assessment (2 hours):**

**Theory (30 min):**

- Explain virtual DOM and reconciliation
- Why are keys important in lists?
- useState: Why use functional updates?
- useEffect: Explain dependency array behaviors
- useRef vs useState differences
- When to use useMemo vs useCallback?
- What are custom hooks? Why use them?
- Controlled vs uncontrolled components

**Coding (60 min):**

- Build counter with useState (5 min)
- Build clock with useEffect + cleanup (10 min)
- Create custom useLocalStorage hook (15 min)
- Optimize component with useMemo/useCallback (15 min)
- Build form with validation (15 min)

**DSA (30 min):**

- [ ] Solve 2 medium problems

**Scoring:** Pass: 24/30 (80%)

---

### WEEK 3 FINAL CHECKLIST

**Concepts Mastered:**

- [ ] Virtual DOM & reconciliation
- [ ] useState (functional updates, immutability)
- [ ] useEffect (dependency array, cleanup)
- [ ] useRef (DOM access, persistent values)
- [ ] useMemo (expensive calculations)
- [ ] useCallback (function memoization)
- [ ] Custom hooks (extract reusable logic)
- [ ] Forms (controlled components)

**Hooks Implemented:**

- [ ] useLocalStorage
- [ ] useFetch
- [ ] useDebounce
- [ ] useToggle

**DSA Progress:**

- [ ] 21 total problems (7 from Week 3)
- [ ] Linked list patterns understood

**Projects:**

- [ ] E-commerce cart page

**Total Flashcards:** 150+ cards

---

## WEEK 4: React Advanced & Context API (Mar 3-9)

### Day 22 (Mon, Mar 3): Component Patterns

**Topics to Master:**

- **Composition:** Build complex UIs from simple components
- Children prop
- Render props pattern
- Compound components pattern
- **Higher-Order Components (HOC):** Reuse component logic
- HOC examples: withAuth, withLoading, withLogger
- **React.memo:** Prevent unnecessary re-renders
- Shallow comparison
- Custom comparison function

**Practice:**

- [ ] **DSA:** Intersection of Two Arrays (LC #349)
- [ ] Build: Card component with composition (header, body, footer)
- [ ] Build: withLoading HOC
- [ ] Build: withAuth HOC
- [ ] Build: Render props example (Mouse tracker)
- [ ] Optimize list with React.memo
- [ ] Create 10 Anki flashcards

---

### Day 23 (Tue, Mar 4): Context API ⭐⭐⭐

**Topics to Master:**

- **Context API:** Share state without prop drilling
- React.createContext()
- Context.Provider
- useContext() hook
- When to use Context vs Redux
- Context best practices
- Performance considerations with Context
- Multiple contexts in one app

**Practice:**

- [ ] **DSA:** Group Anagrams (LC #49)
- [ ] Build: Theme context (light/dark mode)
- [ ] Build: Auth context (user login state)
- [ ] Build: Cart context (shopping cart)
- [ ] Refactor prop drilling to use Context
- [ ] Create 10 Anki flashcards

---

### Day 24 (Wed, Mar 5): useReducer Hook

**Topics to Master:**

- **useReducer:** Alternative to useState for complex state
- Reducer function: (state, action) => newState
- dispatch(action)
- When to use useReducer vs useState
- useReducer + Context (Redux-like state management)
- Action types and action creators
- Immutable reducer updates

**Practice:**

- [ ] **DSA:** Valid Parentheses (LC #20)
- [ ] Build: Counter with useReducer
- [ ] Build: Todo app with useReducer
- [ ] Build: Form with complex state (useReducer)
- [ ] Build: useReducer + Context for global state
- [ ] Create 8 Anki flashcards

---

### Day 25 (Thu, Mar 6): React Router

**Topics to Master:**

- React Router v6 basics
- BrowserRouter, Routes, Route
- Link and NavLink components
- useNavigate hook (programmatic navigation)
- useParams (access URL parameters)
- useSearchParams (query strings)
- Nested routes
- Protected routes (with auth)
- 404 Not Found page

**Practice:**

- [ ] **DSA:** Implement Queue using Stacks (LC #232)
- [ ] Build: Multi-page app with React Router
- [ ] Implement nested routes
- [ ] Build protected route with auth check
- [ ] Build 404 page
- [ ] Dynamic routing with useParams
- [ ] Create 8 Anki flashcards

---

### Day 26 (Fri, Mar 7): Error Boundaries & Performance

**Topics to Master:**

- **Error Boundaries:** Catch errors in component tree
- componentDidCatch (class component method)
- getDerivedStateFromError
- Fallback UI for errors
- **React Performance:**
- Code splitting with React.lazy and Suspense
- Dynamic imports
- Bundle size optimization
- React DevTools Profiler
- Identifying performance bottlenecks

**Practice:**

- [ ] **DSA:** Min Stack (LC #155)
- [ ] Build: Error boundary component
- [ ] Implement code splitting with lazy loading
- [ ] Build: Route-based code splitting
- [ ] Use React DevTools to profile app
- [ ] Create 8 Anki flashcards

---

### Day 27-28 (Weekend, Mar 8-9): PROJECT + MONTHLY ASSESSMENT

#### Saturday: Blog App with Routing (5 hours)

**Features:**

- Home page (list of blog posts)
- Blog post detail page (dynamic routing)
- About page
- 404 Not Found page
- Navigation menu with active links
- Dark mode toggle (Context API)
- LocalStorage for theme persistence
- Code splitting for routes
- Error boundary
- Loading states

**Technical Requirements:**

- React Router v6
- Context API for theme
- Custom hooks (useLocalStorage, useFetch)
- Code splitting with lazy/Suspense
- Error boundary for error handling

**Checklist:**

- [ ] All routes working
- [ ] Context API for theme
- [ ] Code splitting implemented
- [ ] Error boundary working
- [ ] Responsive design
- [ ] Clean code structure

---

#### Sunday: MONTH 1 COMPLETE ASSESSMENT (3 hours)

**Part 1: JavaScript Core (45 min)**

**Theory:**

- Explain closures with 2 real-world examples
- Explain event loop with diagram
- Differences: call vs apply vs bind
- What is prototypal inheritance?
- Promise.all vs Promise.race with examples

**Coding:**

- Implement Function.prototype.bind (10 min)
- Implement Array.prototype.reduce (10 min)
- Implement Promise.all (10 min)
- Implement debounce (10 min)
- Solve 2 event loop output questions (5 min)

---

**Part 2: React Fundamentals (45 min)**

**Theory:**

- Explain virtual DOM and reconciliation
- useState: Why use functional updates?
- useEffect: Explain cleanup and dependency array
- When to use Context API vs prop drilling?
- useReducer vs useState - when to use each?

**Coding:**

- Build todo app with useState (15 min)
- Build timer with useEffect cleanup (10 min)
- Create custom useLocalStorage hook (10 min)
- Build component with Context API (10 min)

---

**Part 3: DSA (60 min)**

- [ ] Solve 3 medium problems (20 min each)
- Must cover: Arrays, Strings, Stack/Queue

---

**Part 4: Project Review (30 min)**

- Review all 4 projects from Month 1
- Ensure clean code, no bugs, good structure
- Refactor if needed

---

**Scoring:**

- JavaScript: 40 points
- React: 40 points
- DSA: 30 points
- Projects: 30 points
- **Total: 140 points**
- **Passing: 112/140 (80%)**

**If < 80%:** Take 2-3 days to review weak areas before Month 2

---

### MONTH 1 FINAL CHECKLIST

**JavaScript Mastery:**

- [ ] Closures, scope, hoisting
- [ ] this, call, apply, bind
- [ ] Promises, async/await, event loop ⭐⭐⭐
- [ ] Array/object methods
- [ ] debounce, throttle, currying, memoization
- [ ] 15+ polyfills implemented

**React Fundamentals:**

- [ ] Virtual DOM, reconciliation
- [ ] useState, useEffect, useRef
- [ ] useMemo, useCallback
- [ ] Custom hooks
- [ ] Context API
- [ ] useReducer
- [ ] React Router
- [ ] Error boundaries, code splitting

**DSA Progress:**

- [ ] 60 problems solved (40 Easy, 20 Medium)
- [ ] Arrays, strings, HashMap
- [ ] Two pointers, sliding window
- [ ] Stack, queue basics

**Projects (4):**

- [ ] Todo app (vanilla JS)
- [ ] Weather app (API + debounce)
- [ ] E-commerce cart (React)
- [ ] Blog app (React Router)

**Flashcards:** 200+ cards

**Ready for Month 2?** All checkboxes must be ✅

---

# 🗓️ MONTH 2: HTML/CSS/TYPESCRIPT + INTERMEDIATE DSA

**Goal:** HTML/CSS mastery + TypeScript basics + React Query (150 pts)  
**DSA:** Trees, Binary Search, Hash Tables (40 Medium + 30 Hard)

---

## WEEK 5: HTML & Accessibility (Mar 10-16)

### Day 29 (Mon, Mar 10): Semantic HTML & SEO

**Topics to Master:**

- Semantic HTML5 elements: header, nav, main, article, section, aside, footer
- Why semantic HTML matters
- SEO basics (meta tags, Open Graph, structured data)
- Document outline
- HTML forms (input types, validation attributes)
- Accessibility basics (ARIA roles, labels)

**Practice:**

- [ ] **DSA:** Binary Tree Inorder Traversal (LC #94)
- [ ] Build semantic HTML page (blog post)
- [ ] Add proper meta tags for SEO
- [ ] Build accessible form with validation
- [ ] Create 8 Anki flashcards

---

### Day 30 (Tue, Mar 11): CSS Flexbox & Grid ⭐⭐⭐

**Topics to Master:**

- **Flexbox:**
  - flex-direction, justify-content, align-items
  - flex-grow, flex-shrink, flex-basis
  - Common layouts: navbar, card layout, centering
- **Grid:**
  - grid-template-columns, grid-template-rows
  - grid-gap, grid-area
  - fr unit, minmax()
  - Common layouts: dashboard, gallery

**Practice:**

- [ ] **DSA:** Validate Binary Search Tree (LC #98)
- [ ] Build 5 layouts with Flexbox
- [ ] Build 5 layouts with Grid
- [ ] Build responsive navbar (Flexbox)
- [ ] Build photo gallery (Grid)
- [ ] Create 10 Anki flashcards

---

### Day 31 (Wed, Mar 12): CSS Animations & Transitions

**Topics to Master:**

- CSS transitions (property, duration, timing-function, delay)
- CSS animations (@keyframes)
- Transform (translate, rotate, scale, skew)
- Animation timing functions (ease, linear, cubic-bezier)
- Will-change for performance
- Common animations: fade, slide, bounce, shake

**Practice:**

- [ ] **DSA:** Lowest Common Ancestor of BST (LC #235)
- [ ] Build 10 common animations
- [ ] Animate button on hover
- [ ] Build loading spinner
- [ ] Build modal with slide-in animation
- [ ] Create 8 Anki flashcards

---

### Day 32 (Thu, Mar 13): Responsive Design

**Topics to Master:**

- Mobile-first approach
- Media queries (min-width, max-width)
- Responsive units (rem, em, %, vw, vh)
- Responsive images (srcset, picture element)
- CSS variables for theming
- Common breakpoints (mobile, tablet, desktop)

**Practice:**

- [ ] **DSA:** Kth Smallest Element in BST (LC #230)
- [ ] Build mobile-first responsive page
- [ ] Implement 3 breakpoints (mobile, tablet, desktop)
- [ ] Make previous projects responsive
- [ ] Create 8 Anki flashcards

---

### Day 33 (Fri, Mar 14): CSS-in-JS & Tailwind

**Topics to Master:**

- **Styled Components:** CSS-in-JS library
- Props-based styling
- Theme provider
- **Tailwind CSS:**
- Utility-first CSS
- Common classes
- Responsive utilities
- Custom configuration

**Practice:**

- [ ] **DSA:** Binary Tree Level Order Traversal (LC #102)
- [ ] Build component with Styled Components
- [ ] Build same component with Tailwind
- [ ] Compare approaches
- [ ] Create 6 Anki flashcards

---

### Day 34-35 (Weekend, Mar 15-16): PROJECT + REVISION

#### Saturday: Portfolio Website (6 hours)

**Features:**

- Hero section with animation
- About section
- Projects section (grid layout)
- Skills section
- Contact form
- Responsive (mobile, tablet, desktop)
- Dark mode toggle
- Smooth scroll navigation
- Animations on scroll

**Technical Requirements:**

- Semantic HTML5
- Flexbox + Grid layouts
- CSS animations
- Mobile-first responsive
- Accessibility (ARIA, semantic elements)

**Checklist:**

- [ ] All sections complete
- [ ] Fully responsive (3 breakpoints)
- [ ] Animations implemented
- [ ] Accessible (test with screen reader)
- [ ] Dark mode working
- [ ] Deployed online

---

#### Sunday: WEEK 5 REVISION & ASSESSMENT

**Revision:**

- [ ] Review Week 5 flashcards (40+ cards)
- [ ] Re-build responsive layout from memory
- [ ] Review all DSA tree problems

**Assessment (2 hours):**

**Theory:**

- What is semantic HTML? Give 5 examples
- Flexbox vs Grid - when to use each?
- Explain mobile-first approach
- What are media queries?
- CSS animations vs transitions
- Accessibility best practices

**Coding:**

- Build navbar with Flexbox (10 min)
- Build gallery with Grid (10 min)
- Implement fade-in animation (5 min)
- Make page responsive (15 min)

**DSA:**

- [ ] Solve 2 tree problems (30 min)

**Scoring:** Pass: 24/30 (80%)

---

### WEEK 5 FINAL CHECKLIST

**HTML/CSS Mastered:**

- [ ] Semantic HTML5
- [ ] SEO basics
- [ ] Flexbox ⭐⭐⭐
- [ ] Grid ⭐⭐⭐
- [ ] Animations & transitions
- [ ] Responsive design
- [ ] CSS-in-JS / Tailwind

**DSA Progress:**

- [ ] 67 total problems (7 from Week 5)
- [ ] Binary trees understood
- [ ] BST operations mastered

**Projects:**

- [ ] Portfolio website (responsive, animated)

**Flashcards:** 240+ cards

---

## WEEK 6: TypeScript Basics (Mar 17-23)

### Day 36 (Mon, Mar 17): TypeScript Fundamentals

**Topics to Master:**

- Why TypeScript?
- Type annotations (string, number, boolean, etc.)
- Type inference
- any, unknown, never, void
- Arrays and tuples
- Union types (string | number)
- Type aliases

**Practice:**

- [ ] **DSA:** Search in Rotated Sorted Array (LC #33)
- [ ] Set up TypeScript project
- [ ] Convert 5 JS functions to TypeScript
- [ ] Practice type annotations
- [ ] Create 8 Anki flashcards

---

### Day 37 (Tue, Mar 18): Interfaces & Type Aliases

**Topics to Master:**

- Interface vs Type alias
- Object types
- Optional properties (?)
- Readonly properties
- Index signatures
- Extending interfaces
- Type composition

**Practice:**

- [ ] **DSA:** Find Minimum in Rotated Sorted Array (LC #153)
- [ ] Define interfaces for User, Product, Order
- [ ] Practice extending interfaces
- [ ] Type aliases for union types
- [ ] Create 8 Anki flashcards

---

### Day 38 (Wed, Mar 19): Functions & Generics

**Topics to Master:**

- Function types
- Optional and default parameters
- Rest parameters with types
- Function overloads
- **Generics:** Type variables
- Generic functions
- Generic interfaces
- Constraints on generics

**Practice:**

- [ ] **DSA:** Binary Search (LC #704)
- [ ] Type 10 common functions
- [ ] Create generic Stack<T> class
- [ ] Create generic fetch wrapper
- [ ] Create 10 Anki flashcards

---

### Day 39 (Thu, Mar 20): TypeScript with React

**Topics to Master:**

- Typing React components (FC, ReactNode)
- Props interfaces
- useState with TypeScript
- useRef with TypeScript
- Event types (ChangeEvent, MouseEvent, etc.)
- Children prop typing
- Custom hooks in TypeScript

**Practice:**

- [ ] **DSA:** First Bad Version (LC #278)
- [ ] Convert React components to TypeScript
- [ ] Type all props and state
- [ ] Type custom hooks
- [ ] Create 8 Anki flashcards

---

### Day 40 (Fri, Mar 21): Advanced TypeScript

**Topics to Master:**

- Utility types: Partial, Required, Pick, Omit, Record
- Conditional types
- Mapped types
- Type guards (typeof, instanceof, in)
- Type assertions (as keyword)
- Discriminated unions

**Practice:**

- [ ] **DSA:** Search Insert Position (LC #35)
- [ ] Use utility types in real scenarios
- [ ] Implement type guards
- [ ] Practice discriminated unions
- [ ] Create 8 Anki flashcards

---

### Day 41-42 (Weekend, Mar 22-23): PROJECT + REVISION

#### Saturday: TypeScript React App (5 hours)

**Project: Task Manager with TypeScript**

**Features:**

- Add/edit/delete tasks
- Filter by status (all, pending, completed)
- Search tasks
- LocalStorage persistence
- Full TypeScript typing

**Technical Requirements:**

- All components typed
- Interfaces for Task, Filter, etc.
- Custom hooks typed
- Context API with TypeScript
- No 'any' types allowed

**Checklist:**

- [ ] All features working
- [ ] 100% TypeScript coverage
- [ ] No type errors
- [ ] Clean interfaces
- [ ] Custom hooks typed

---

#### Sunday: WEEK 6 REVISION & ASSESSMENT

**Assessment (2 hours):**

**Theory:**

- Why use TypeScript?
- Interface vs Type alias
- Explain generics with examples
- What are utility types? Name 5
- How to type React components?

**Coding:**

- Type 5 JavaScript functions (10 min)
- Create generic interface (10 min)
- Type React component with props (10 min)
- Use utility types (10 min)

**DSA:**

- [ ] Solve 2 binary search problems (30 min)

**Scoring:** Pass: 24/30 (80%)

---

### WEEK 6 FINAL CHECKLIST

**TypeScript Mastered:**

- [ ] Basic types, type inference
- [ ] Interfaces & type aliases
- [ ] Generics
- [ ] Utility types
- [ ] TypeScript with React
- [ ] Type guards

**DSA Progress:**

- [ ] 74 total problems (7 from Week 6)
- [ ] Binary search mastered
- [ ] Rotated array patterns

**Projects:**

- [ ] Task manager (full TypeScript)

**Flashcards:** 290+ cards

---

## WEEK 7: State Management & Data Fetching (Mar 24-30)

### Day 43 (Mon, Mar 24): Redux Basics

**Topics to Master:**

- Why Redux? When to use it?
- Redux core concepts: Store, Actions, Reducers
- Store creation (configureStore)
- Dispatch actions
- useSelector hook
- useDispatch hook
- Redux DevTools

**Practice:**

- [ ] **DSA:** Implement Trie (LC #208)
- [ ] Build counter with Redux
- [ ] Build todo app with Redux
- [ ] Use Redux DevTools
- [ ] Create 10 Anki flashcards

---

### Day 44 (Tue, Mar 25): Redux Toolkit ⭐⭐⭐

**Topics to Master:**

- **Redux Toolkit:** Modern Redux
- createSlice (combines actions + reducer)
- configureStore
- createAsyncThunk (async actions)
- RTK best practices
- Redux vs Context API

**Practice:**

- [ ] **DSA:** Word Search (LC #79)
- [ ] Refactor Redux code to Redux Toolkit
- [ ] Implement async thunk for API call
- [ ] Build shopping cart with RTK
- [ ] Create 10 Anki flashcards

---

### Day 45 (Wed, Mar 26): React Query / TanStack Query ⭐⭐⭐

**Topics to Master:**

- Why React Query?
- useQuery hook (data fetching)
- Query keys
- Caching, background refetching
- useMutation hook (POST/PUT/DELETE)
- Optimistic updates
- Query invalidation
- Loading and error states

**Practice:**

- [ ] **DSA:** Course Schedule (LC #207)
- [ ] Fetch data with useQuery
- [ ] Implement CRUD with useMutation
- [ ] Implement optimistic update
- [ ] Create 10 Anki flashcards

---

### Day 46 (Thu, Mar 27): API Integration Patterns

**Topics to Master:**

- RESTful API basics
- Axios vs fetch
- Request/response interceptors
- Error handling strategies
- Retry logic
- Request cancellation (AbortController)
- Authentication (JWT, tokens)
- Protected API calls

**Practice:**

- [ ] **DSA:** Clone Graph (LC #133)
- [ ] Set up Axios instance with interceptors
- [ ] Implement auth token refresh
- [ ] Build API wrapper with error handling
- [ ] Create 8 Anki flashcards

---

### Day 47 (Fri, Mar 28): Performance Optimization

**Topics to Master:**

- React.memo (prevent re-renders)
- useMemo (expensive calculations)
- useCallback (stable function references)
- Code splitting (React.lazy, Suspense)
- Virtualization (react-window, react-virtualized)
- Bundle analysis
- Tree shaking

**Practice:**

- [ ] **DSA:** Number of Islands (LC #200)
- [ ] Optimize slow component with React.memo
- [ ] Implement virtualized list
- [ ] Code split routes
- [ ] Analyze bundle size
- [ ] Create 8 Anki flashcards

---

### Day 48-49 (Weekend, Mar 29-30): PROJECT + REVISION

#### Saturday: Real-time Dashboard (6 hours)

**Project: Analytics Dashboard with React Query**

**Features:**

- Fetch analytics data (users, revenue, traffic)
- Charts (use Chart.js or Recharts)
- Real-time updates (polling)
- Filters (date range, category)
- Redux Toolkit for filter state
- React Query for data fetching
- Loading skeletons
- Error boundaries

**Technical Requirements:**

- React Query for all API calls
- Redux Toolkit for UI state
- Optimistic updates
- Caching strategy

**Checklist:**

- [ ] All data fetching with React Query
- [ ] Redux Toolkit for filters
- [ ] Real-time updates working
- [ ] Charts displaying correctly
- [ ] Loading states
- [ ] Error handling

---

#### Sunday: WEEK 7 REVISION & ASSESSMENT

**Assessment (2 hours):**

**Theory:**

- Redux vs Context API - when to use each?
- Explain Redux Toolkit advantages
- What is React Query? Why use it?
- Explain caching in React Query
- Performance optimization techniques in React

**Coding:**

- Build slice with Redux Toolkit (15 min)
- Implement useQuery for data fetch (10 min)
- Implement useMutation with optimistic update (15 min)
- Optimize component with memo (10 min)

**DSA:**

- [ ] Solve 2 graph/backtracking problems (30 min)

**Scoring:** Pass: 24/30 (80%)

---

### WEEK 7 FINAL CHECKLIST

**State Management:**

- [ ] Redux core concepts
- [ ] Redux Toolkit ⭐⭐⭐
- [ ] React Query ⭐⭐⭐
- [ ] API integration patterns
- [ ] Performance optimization

**DSA Progress:**

- [ ] 81 total problems (7 from Week 7)
- [ ] Graphs, Trie, backtracking

**Projects:**

- [ ] Real-time dashboard

**Flashcards:** 340+ cards

---

## WEEK 8: Testing (Mar 31 - Apr 6)

### Day 50 (Mon, Mar 31): Jest Basics

**Topics to Master:**

- Why testing?
- Jest setup
- describe, test/it blocks
- Assertions (expect)
- Matchers (toBe, toEqual, toMatch, etc.)
- Test coverage
- Mocking functions (jest.fn, jest.mock)

**Practice:**

- [ ] **DSA:** Rotate Array (LC #189)
- [ ] Write tests for 10 utility functions
- [ ] Practice all common matchers
- [ ] Mock API calls
- [ ] Create 8 Anki flashcards

---

### Day 51 (Tue, Apr 1): React Testing Library ⭐⭐⭐

**Topics to Master:**

- React Testing Library philosophy
- render, screen, fireEvent
- Queries: getBy, queryBy, findBy
- Testing user interactions
- Async testing (waitFor, findBy)
- Testing custom hooks
- Mocking components

**Practice:**

- [ ] **DSA:** Product of Array Except Self (LC #238)
- [ ] Test 5 React components
- [ ] Test user interactions (click, type)
- [ ] Test async data fetching
- [ ] Test custom hook
- [ ] Create 10 Anki flashcards

---

### Day 52 (Wed, Apr 2): Integration & E2E Testing

**Topics to Master:**

- Integration testing
- E2E testing with Cypress/Playwright
- Selectors best practices
- Page Object Model pattern
- Testing flows (login, checkout, etc.)
- CI/CD integration

**Practice:**

- [ ] **DSA:** Subarray Sum Equals K (LC #560)
- [ ] Write integration test for form submission
- [ ] Write E2E test for user flow
- [ ] Create 6 Anki flashcards

---

### Day 53 (Thu, Apr 3): TDD & Best Practices

**Topics to Master:**

- Test-Driven Development (TDD)
- Red-Green-Refactor cycle
- AAA pattern (Arrange, Act, Assert)
- Testing pyramid (unit > integration > E2E)
- What to test, what not to test
- Test maintainability

**Practice:**

- [ ] **DSA:** Longest Consecutive Sequence (LC #128)
- [ ] Practice TDD: Write test first, then implement
- [ ] Refactor tests for readability
- [ ] Create 6 Anki flashcards

---

### Day 54 (Fri, Apr 4): MONTH 2 PREP

**Monthly Assessment Prep:**

- [ ] **DSA:** Top K Frequent Elements (LC #347)
- [ ] Review all Month 2 flashcards (140+ cards)
- [ ] Review all projects from Month 2
- [ ] Practice weak areas
- [ ] Create study guide for assessment

---

### Day 55-56 (Weekend, Apr 5-6): PROJECT + MONTHLY ASSESSMENT

#### Saturday: PROJECT with Tests (5 hours)

**Project: Form Builder with Full Testing**

**Features:**

- Add form fields (text, email, textarea, checkbox, etc.)
- Drag and drop to reorder
- Delete fields
- Form preview
- Export form as JSON
- Import form from JSON

**Testing Requirements:**

- Unit tests for all utility functions
- Component tests (React Testing Library)
- Integration tests for full flows
- 80%+ code coverage

**Checklist:**

- [ ] All features implemented
- [ ] Full test coverage (80%+)
- [ ] All tests passing
- [ ] Clean code

---

#### Sunday: MONTH 2 COMPLETE ASSESSMENT (3 hours)

**Part 1: HTML/CSS/TypeScript (45 min)**

**Theory:**

- Semantic HTML importance
- Flexbox vs Grid use cases
- TypeScript benefits
- Generics explanation
- Utility types examples

**Coding:**

- Build responsive layout (15 min)
- Type complex interface (10 min)
- Implement generic function (10 min)

---

**Part 2: State Management & Testing (45 min)**

**Theory:**

- Redux vs Context API
- React Query benefits
- Testing pyramid
- What to test in React?

**Coding:**

- Create Redux Toolkit slice (10 min)
- Implement React Query hook (10 min)
- Write component test (15 min)

---

**Part 3: DSA (60 min)**

- [ ] Solve 3 medium/hard problems
- Focus: Trees, Graphs, Hash Tables

---

**Part 4: Project Review (30 min)**

- Review all Month 2 projects
- Ensure quality, tests, accessibility

---

**Scoring:**

- HTML/CSS/TS: 40 points
- State/Testing: 40 points
- DSA: 30 points
- Projects: 30 points
- **Total: 140 points**
- **Passing: 112/140 (80%)**

---

### MONTH 2 FINAL CHECKLIST

**Skills Mastered:**

- [ ] HTML5 semantic elements
- [ ] CSS Flexbox & Grid ⭐⭐⭐
- [ ] Responsive design
- [ ] TypeScript fundamentals
- [ ] TypeScript with React
- [ ] Redux Toolkit ⭐⭐⭐
- [ ] React Query ⭐⭐⭐
- [ ] Testing (Jest, RTL)

**DSA Progress:**

- [ ] 130+ problems total
- [ ] Trees, BST, binary search
- [ ] Graphs, backtracking
- [ ] Hash tables, tries

**Projects (6):**

- [ ] Portfolio website
- [ ] Task manager (TypeScript)
- [ ] Real-time dashboard
- [ ] Form builder with tests

**Flashcards:** 380+ cards

**Ready for Month 3?** All checkboxes must be ✅

---

# 🗓️ MONTH 3-6: ADVANCED TOPICS

_(Due to length constraints, providing streamlined structure for remaining months)_

---

## MONTH 3: PERFORMANCE & SECURITY (Week 9-12)

**Topics:**

- Core Web Vitals (LCP, FID, CLS)
- Performance optimization techniques
- Lazy loading, code splitting
- Security (XSS, CSRF, CSP)
- Next.js basics (SSR, SSG, ISR)

**DSA:** 70 Medium/Hard (DP, Advanced Trees, Heaps)

**Projects:** Next.js blog, Security demo, Performance dashboard

---

## MONTH 4: SYSTEM DESIGN & ADVANCED REACT (Week 13-16)

**Topics:**

- Frontend system design (10 cases)
- Advanced React patterns
- Micro-frontends
- Advanced TypeScript
- Real-time features (WebSockets)

**DSA:** 70 Hard (Advanced DP, Graphs, Backtracking)

**Projects:** Real-time chat, Design system, SSR app

---

## MONTH 5: SENIOR TOPICS & MASTERY (Week 17-20)

**Topics:**

- Architecture patterns
- Advanced performance
- DevOps basics (Docker, CI/CD)
- Leadership & mentoring
- Open source contributions

**DSA:** 70 Hard (Complex problems, company-specific)

**Projects:** Full-stack clone (Netflix/Notion), Open source contribution

---

## MONTH 6: INTERVIEW READY (Week 21-24)

**Focus:**

- Machine coding rounds (15 full problems)
- Mock interviews (15+ this month)
- Company-specific prep (FAANG, Startups)
- Resume polish
- Negotiation prep

**DSA:** 70 Mixed review + company patterns

**Projects:** 2 advanced clones

---

## 🏆 SUCCESS METRICS

### Weekly Goals

- [ ] 15-20 DSA problems solved
- [ ] Theory concepts: 80%+ quiz score
- [ ] 1-2 polyfills implemented
- [ ] Daily flashcard review
- [ ] Project progress

### Monthly Goals

- [ ] Pass assessment (80%+)
- [ ] 2-3 projects completed
- [ ] 2 mock interviews passed
- [ ] Tier concepts mastered
- [ ] DSA on track

### Final Readiness (Month 6, Week 24)

- [ ] 400+ DSA problems solved
- [ ] 15 portfolio projects deployed
- [ ] Can explain any concept in 3 min
- [ ] 30+ mock interviews passed
- [ ] Resume updated
- [ ] Confident in interviews

---

## 📚 RESOURCES

**Platforms:**

- LeetCode (DSA)
- JavaScript.info
- React docs
- Pramp/Interviewing.io (mocks)
- Frontend Mentor

**YouTube:**

- Akshay Saini (Namaste JavaScript)
- Web Dev Simplified
- Ben Awad
- Fireship

**Books:**

- "You Don't Know JS" - Kyle Simpson
- "Eloquent JavaScript"
- "Learning React"

---

## ✅ COMMITMENT

**Daily:** 2-3 hours study  
**Max skip:** 1 day per week  
**Weekly assessment:** 80%+ required  
**Projects:** All must be complete  
**Flashcards:** Daily review  
**Mocks:** 1/week (M1-4), 2-3/week (M5-6)

**If falling behind:** Use Sunday to catch up, DO NOT skip ahead

---

## 🚀 START NOW

**Your Formula:**

```
Consistency (2-3 hrs/day)
+ Mastery (80%+ assessments)
+ Practice (400+ DSA)
+ Projects (15 apps)
= Interview Success (85-95%)
```

**Start Date:** ****\_\_\_\_****  
**Target Role:** SDE 1 / SDE 2  
**Dream Companies:** ****\_\_\_\_****

**Week 1, Day 1 begins NOW! ✅**
