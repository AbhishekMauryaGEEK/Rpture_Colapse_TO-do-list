# Rapture Collapse — Priority Chaos Terminal

Rapture Collapse is a gamified productivity application built with React and Vite that introduces controlled unpredictability into task management. Instead of static task lists, priorities continuously reshuffle over time, forcing users to adapt under pressure.

The application combines a terminal-inspired interface with time-based chaos mechanics, mathematical interruption systems, and progressive difficulty escalation to create an unconventional productivity experience.

---

# Overview

Traditional productivity tools optimize for stability and predictability. Rapture Collapse intentionally challenges that model by introducing dynamic task prioritization.

Users must manage tasks while the system periodically reorders priorities. The only way to temporarily pause the chaos cycle is by solving timed mathematical challenges. Repeated failures accelerate the system toward collapse.

---

# Core Features

## Dynamic Priority Shuffling

Tasks automatically reshuffle at timed intervals depending on the selected difficulty mode.

## Math-Based Pause System

Users can temporarily stop the chaos cycle by solving generated mathematical problems within a limited time window.

## Progressive Difficulty Scaling

Each failed challenge reduces the interval timer, increasing system intensity over time.

## Collapse State

At critical intervals, incorrect answers trigger a complete system collapse:

* Task deletion
* Terminal distortion effects
* UI glitch animations
* Forced restart state

## Persistent Task Storage

Tasks are stored using localStorage so progress survives page refreshes.

## Terminal-Inspired UI

The interface uses a brutalist terminal aesthetic with animated transitions, status indicators, and system-style feedback.

---

# Difficulty Modes

| Mode      | Shuffle Interval | Complexity               |
| --------- | ---------------- | ------------------------ |
| Normal    | 45 seconds       | Basic arithmetic         |
| Adventure | 30 seconds       | Intermediate expressions |
| Hell      | 10 seconds       | Multi-step calculations  |

Every failed math challenge decreases the interval speed by 5 seconds.

---

# Gameplay Flow

1. Select a difficulty mode.
2. Create tasks with different priority levels.
3. Survive periodic priority reshuffling.
4. Trigger pause mode when necessary.
5. Solve the generated mathematical challenge before timeout.
6. Continue managing the system as difficulty escalates.

Failure at the minimum interval threshold results in a full system collapse.

---

# Technology Stack

## Frontend

* React 18
* Vite
* JavaScript
* Vanilla CSS

## React Features Used

* useState
* useEffect
* useMemo
* useRef

## Browser APIs

* localStorage
* Web Audio API

## Animations

* CSS keyframes
* Transform-based motion effects
* Glitch and shake transitions

---

# Project Structure

```bash
src/
├── components/
├── hooks/
├── styles/
├── utils/
└── App.jsx
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/AbhishekMauryaGEEK/Rpture_Colapse_TO-do-list.git
cd Rpture_Colapse_TO-do-list
```

## Install Dependencies

```bash
npm install
```

## Start Development Server

```bash
npm run dev
```

Application runs at:

```bash
http://localhost:5173
```

---

# Live Demo

[https://rapture-collapse.netlify.app/](https://rapture-collapse.netlify.app/)

---

# Technical Highlights

* Real-time interval management
* Stateful gameplay progression
* Persistent browser storage
* Interactive terminal-style interface
* Dynamic UI feedback systems
* Performance-focused React rendering
* Minimal dependency architecture

---

# Future Improvements

Potential expansion areas:

* Multiplayer challenge mode
* Leaderboard system
* Custom chaos algorithms
* Audio themes and sound packs
* Additional mathematical challenge generators
* Adaptive AI-based difficulty balancing
* Mobile responsive optimization

---

# Contributing

Contributions are welcome.

## Workflow

```bash
git checkout -b feature/feature-name
```

Commit changes with clear commit messages:

```bash
git commit -m "Add feature description"
```

Push branch:

```bash
git push origin feature/feature-name
```

Open a pull request with:

* Feature overview
* Technical implementation notes
* Screenshots or recordings
* Testing details

---

# License

This project is licensed under the MIT License.

---

# Author

Abhishek Maurya

Computer Science Student and Frontend Developer focused on experimental UI systems, interactive applications, and creative web experiences.
