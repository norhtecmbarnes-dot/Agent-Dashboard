# Star Raiders Reborn — Player's Guide

*A complete guide to the space-combat game built into Proposal Genie at the **Raiders** tab (`/star-raiders`). Inspired by the 8-bit space combat classics of 1979 — an original homage with original names, art, and code.*

---

## What Is This?

You are the last fighter-cruiser of the **Helion Fleet**. The **Veydrim** — swift Darts, dueling Lances, and the heavy Anvils — are moving across a grid of star sectors, and every Helion base you lose is gone for good.

**One ship. Clear the galaxy before the invaders take every base.**

A mission takes 8–20 minutes. Your real enemies are not just the Veydrim — they are your **energy gauge**, your **damaged systems**, and your own **map judgment**.

---

## Getting Started (90 seconds)

1. Click **Raiders** in the top navigation bar.
2. Pick a difficulty — **Novice** if this is your first flight.
3. Press any key to launch.

Your first sector is safe: a **training drone** floats nearby. Practise on it — it never shoots back.

### Your First Flight

- **Press `6`** — that's your cruise speed. The stars start moving.
- **Steer with the mouse** (click once to capture it) or the **arrow keys**.
- **Press `Space` or click** — photon fire. Kill the drone.
- **Press `G`** — the galactic chart opens. This is your war map.
- Pick a red cell (enemies) or a green cell (a base), press **`H`**, and hold it to hyperwarp.
- Fight, dock when hurt, repeat until every enemy group is gone.

---

## Controls

### Keyboard + Mouse

| Key | Action |
| --- | --- |
| Mouse / Arrow keys | Steer (pitch and yaw) |
| `0`–`9` | Speed — `0` is stop, `6` is efficient cruise, `9` is a sprint that burns energy |
| `Space` / Left click | Fire photons |
| `V` | Flip fore / aft view (the aft view inverts steering, like the 1979 original) |
| `G` | Galactic chart |
| `H` | Hold to hyperwarp |
| `L` | Long-range scan of the current sector |
| `C` | Toggle attack computer |
| `T` | Toggle tracking of the current target |
| `M` | Cycle to the next target |
| `S` | Shields up / down |
| `P` | Pause |
| `Esc` | Release the mouse |

### Gamepad

- **Right stick** — aim
- **Triggers or bumpers** — fire
- **D-pad / face buttons** — views and chart
- **Triggers/shoulders** — speed down / up
- **Hold a button + stick** — warp confirm

*Aft-view steering inversion can be switched off in Settings, but try it first — it is the authentic feel.*

---

## The Loop

```
START sector → G (chart) → pick a threat or a base → H (hyperwarp)
   → arrive (RED ALERT if hostiles) → fight until clear or flee
   → low energy or damage? warp to a base → dock → repeat
   → all enemies gone = MISSION COMPLETED → your rank
```

**You win** when every enemy group is destroyed. **You lose** when your energy hits zero, your ship is destroyed, or the last Helion base falls.

---

## The Galactic Chart (`G`)

The chart is the heart of the game — a living war map you should be able to read in two seconds:

- **Yellow dot** — you
- **Green diamonds** — Helion bases (your fuel and repair stations)
- **Red squares** — Veydrim groups. Bigger square = bigger group
- **Grey dots** — asteroid fields (hazard, not threat)
- The **highlighted cell** shows the warp energy cost and what's hiding there before you commit

Enemies **migrate** on the star-date clock — they drift toward your bases and cluster around them. A base with three or more enemy groups beside it is **SURROUNDED** (the radio will scream at you). Surrounded long enough, it is **LOST**.

> **Map judgment wins games.** A tempting fight two warps away may cost you a base next door.

---

## The Ship

### Speed (0–9)
- **0** — stop. Required for docking.
- **6** — cruise. The energy sweet spot; your default after warp.
- **9** — sprint. Doubles the burn and the thrill. Asteroid fields at 9 are a gamble.

### Photons
Dual tubes that alternate shots. With the **attack computer** on (`C`), you get a lead pip, range, and a lock box — shoot the pip, not the ship. You can also **detonate incoming enemy bolts** by shooting them (costly, occasionally lifesaving).

### Shields (`S`)
A live shield eats enemy hits and spends energy every second it is up. Damaged shields leak; destroyed shields mean unshielded hull — and unshielded hull dies in one or two hits.

### The Six Systems (PESCLR row)
The colored row on your HUD is your ship's health: **Weapons · Engines · Shields · Computer · Scanner · Radio** — green = good, amber = damaged, red = dead.

| System | When it dies |
| --- | --- |
| **Weapons** | One tube only. Dead: no fire at all |
| **Engines** | Top speed capped. Dead: you crawl even at throttle 9 |
| **Shields** | Leaks damage straight to hull |
| **Computer** | No lead pip, no lock — gunnery is all eyeball (still playable!) |
| **Scanner** | Contacts become ghosts on the scan panel |
| **Radio** | No base warnings — bases can die without you ever hearing it |

Docking repairs everything. Choosing *when* to disengage and limp home is the real skill.

### Energy — the real clock
Everything costs energy: photons, shields, the computer, speed, hyperwarp. At **0** you drift helpless and the mission ends. Every second at speed 9 or with shields up is a decision.

---

## The Enemy — know your three opponents

| | **Dart** | **Lance** | **Anvil** |
| --- | --- | --- | --- |
| **Role** | Flanker | Duelist | Sniper |
| **Behaviour** | Fast, jinks hard, **two thirds of them hunt your six** | Comes straight at you nose-first and holds a dueling range | Slow, heavy, hangs back, never flees |
| **Weapon** | Standard bolts | Fast, accurate head-on shots | **Slow volleys that pierce shields** |
| **Tell** | Amber/violet engine flare | Violet-white flare, a needle with a ring cowl | Deep-red flare, a slab with twin pods |
| **Counter** | Flip to aft (`V`) and kill the tailgater | Head-on photon duel — dodge late, shoot early | Out-fly it; kill it last, but never ignore it |

Groups come in three sizes: **patrols** (2 Darts), **task forces** (3, with a Lance), and **fleets** (4+, with an Anvil). Only two attackers engage you at full fidelity at a time — the rest queue and fly in as their wingmates die, so the screen stays readable.

---

## Hyperwarp

From the chart, select a cell and press `H`. Then keep your nose on the **drifting gate marker** for the 2–4 second tunnel. Miss the gate and you arrive in an **adjacent cell** — sometimes a worse neighbourhood than the one you picked.

- **Novice** auto-aligns the warp for you.
- **Pilot and above** — the gate drifts; you fly it.
- Aborting mid-warp costs energy.

Arrival is loud when it should be: hostiles in the cell trigger **RED ALERT** and the music sting.

---

## Docking

1. Warp into a base cell (green on the chart).
2. Get the base in your fore view and close at **speed 3–5**.
3. **Keep the base centred** — the docking brackets fill as you hold the approach. Wobbling drains progress; it doesn't erase it.
4. When they lock: **ORBIT ESTABLISHED — FREEZE STICK**. Hold still for ~3 seconds.
5. Energy restored to 9999, every system repaired. You may leave immediately.

**Warnings:** moving during the transfer cancels the dock, **friendly fire kills bases** (and your rank hates that), and if a base dies while you're in its cell, enemies can spawn right on top of you.

---

## Score and Rank

```
score = 200 (success)
      + 6 × kills
      − energy_used / 100
      − seconds / 100
      − 18 × bases lost to the enemy
      − 3 × bases you killed
```

Ranks run from **Space Dust** through Cadet, Ensign, Pilot, Ace, Warrior, Commander, up to **Star Commander Class 1**. Your best rank per difficulty is saved locally. The recap screen shows kills, energy, time, bases, and deaths — beat it, then beat it again.

Fast, cheap, and complete scores higher than slow and thorough. Energy hoarding and kills are both the same resource.

---

## Difficulties

| | Novice | Pilot | Warrior | Commander |
| --- | --- | --- | --- | --- |
| Enemy groups | 3 | 4 | 6 | 8 |
| Fleets (with Anvils) | 0 | 1 | 2 | 3 |
| Bases | 3 | 3 | 4 | 4 |
| Enemy accuracy | 55% | 70% | 82% | 92% |
| Migration aggression | Gentle | Real | Packs | Relentless |
| Warp auto-align | Yes | No | No | No |

---

## Reading the HUD

- **Energy** — bar + number, top of the panel. Watch it always.
- **Speed** — 0–9, with the target speed alongside.
- **Shield state** — up / down / damaged / dead.
- **Target line** — range and aspect (fore/aft) of your selected target.
- **PESCLR row** — the six systems, color-coded.
- **Compass** — dots above the horizon line are ahead of you; dots below are *behind* you. When a dot sinks below the line, flip to aft.

---

## Tips From the Test Pilots

1. **Cruise at 6.** Speed 9 is for sprints and escapes, not travel — it burns energy you'll want when shields matter.
2. **Kill the tailgater first.** Darts love your six; the compass dot below the horizon is your most important instrument.
3. **The Anvil's volley is the only shot that hurts you through shields.** Sidestep the slow bolts; everything else your shield eats.
4. **Dock before you must.** Limping home on a dead engine with 400 energy is how missions die. Dock at 3000, not 500.
5. **Watch the chart between fights.** Enemies migrate — a clear neighbourhood can be surrounded two star-dates later.
6. **Never fight a fleet and its base neighbors at once if you can help it.** Pull one group away and fight it alone.
7. **Shoot bolts in emergencies only.** Intercepting a bolt costs 90 energy — cheaper than an unshielded hull hit, pricier than a dodge.
8. **Dead computer? Still flyable.** Aim with the tracer itself. The 1979 players did it with less.

---

## For the Curious: How It's Built

- Every gameplay number — drains, enemy stats, warp drift, bracket fill — lives in **`src/game/data/tuning.json`**, so balance changes never touch code.
- The automated browser test (`scripts/star-raiders-smoke.mjs`) plays a full mission — fly, fight, warp, dock, die, rank — and passes with zero errors.
- All art is procedural: three enemy silhouettes, the cockpit, asteroids, and the starfield are generated in code. No external assets, no licensing risk.
- Audio is synthesized live with the Web Audio API.
- Legal note: an original homage to the mechanics of 1979. No Atari art, names, or manual text anywhere.

*Inspired by the 8-bit space combat games of 1979.*
