# Focuspond 💧

_A calm productivity and wellness app that helps you plan your day, tackle your most important task, and stay mindful, one Pomodoro at a time._

---

## 📖 About the Project

**Focuspond** is designed for people who want to get meaningful work done, without burning out.

whether you are a student managing coursework, a remote worker juggling tasks, or a creative navigating daily chaos, Focuspond helps you plan with intention, focus on what matters, and stay grounded along the way.

It combines structured productivity tools, like a daily planner, Pomodoro timer, and Frog-first task system, with gentle wellness features like mindful break prompts, mood check-ins, and end-of-day reflections.

No pressure. No hustle. Just small, consistent wins, one Pomodoro at a time.

## 🔗 Live Demo

https://focuspond.vercel.app/

---

<!-- ## 📸 Screenshots -->

<!-- Add screenshots here when you have UI ready -->
<!-- Example:
![Homepage](./screenshots/homepage.png)
![Task View](./screenshots/tasks.png) -->

<!-- ---

## ✨ Features

- [x] Landing page with app overview
- [ ] User authentication (sign up, login)
- [ ] Task creation and editing
- [ ] Focus mode (distraction-free timer)
- [ ] Task categories and priorities
- [ ] Dark mode
- [ ] Mobile responsiveness

--- -->

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router) · React 19
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 4 · CVA + clsx + tailwind-merge
- **Data:** Dexie / IndexedDB — local-first, and the source of truth
- **State:** `useLiveQuery` for anything stored; one Zustand store, for the
  clock the timer surfaces share
- **i18n:** next-intl, six locales, English as the source
- **PWA:** Serwist (service worker, offline fallback, installable)
- **Testing:** Vitest + Testing Library + fake-indexeddb
- **Animation:** Framer Motion, lottie-react · **Icons:** Lucide React
- **Backend:** Supabase, for the waitlist and contact forms only — the app
  itself has no server
- **Deployment:** Vercel

---

## 🚀 Getting Started

Follow these steps to run Focuspond locally:

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Focuspond.git
cd focuspond
```

### 2. Install Dependencies

> This project uses **pnpm** (see `packageManager` in `package.json`).

```bash
pnpm install
```

### 3. Set up environment variables

```bash
cp .env.example .env.local
```

Two Supabase values and a service-role key, validated by `src/lib/env.ts` at
startup. **The placeholders in `.env.example` are enough** to run and build the
app — they only need to be real if you are working on the waitlist or contact
form, the only two things that talk to Supabase.

### 4. Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Before you commit

```bash
pnpm typecheck && pnpm lint && pnpm test
```

A pre-commit hook runs Prettier and ESLint on staged files; these three are the
rest of the gate CI runs.

> **A note on your data.** FocusPond is local-first: tasks, moods, focus
> sessions and reflections live in IndexedDB **in the browser that created
> them**. They do not follow you to another machine, another browser, or a
> private window, and clearing site data clears them. A fresh laptop opens an
> empty app that works perfectly — that is expected, not a bug. See
> [docs/features/sync.md](docs/features/sync.md) for why, and what would have
> to be true before sync is built.

> **Testing the PWA.** The service worker is disabled in development
> (`next.config.ts`), so offline behaviour needs `pnpm build && pnpm start`. On
> a phone it needs HTTPS — a service worker refuses `http://192.168.x.x`, so use
> a Vercel preview or a tunnel rather than your LAN address.

<!-- 🧭 Roadmap
 Finish core task management

 Add Pomodoro/focus timer

 Notifications/reminders

 Custom dashboard for productivity stats

 Full mobile experience

 Polish and deploy MVP

 Collect feedback and iterate -->

---

## 🧭 Where things are written down

| Document                                         | What it answers                                                                                                 |
| ------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| [docs/roadmap.md](docs/roadmap.md)               | **The plan of record.** What is built, what is deliberately cut, and what is left. Read the status block first. |
| [CLAUDE.md](CLAUDE.md)                           | Conventions and gotchas for anyone — human or agent — writing code here.                                        |
| [docs/features/focus.md](docs/features/focus.md) | The session clock, breaks, and the shared tick. Read before touching the timer.                                 |
| [docs/features/i18n.md](docs/features/i18n.md)   | Six locales, how to add copy or a namespace.                                                                    |
| [docs/features/sync.md](docs/features/sync.md)   | Why there is no sync yet, and what has to be true first.                                                        |

---

## 📬 Contact

Got feedback, ideas, or questions about Focuspond?

feel free to reach out via:

- **Twitter/X:** [Chiamaka | Dev.chemist](https://twitter.com/filix_lillyann)
- **Email:** [ogbuolilian@gmail.com](mailto:ogbuolilian@gmail.com)
- **LinkedIn:** [ogbuo-chiamaka](https://www.linkedin.com/in/ogbuo-chiamaka)

📄 License
&copy; 2025 FocusPond – All rights reserved.
