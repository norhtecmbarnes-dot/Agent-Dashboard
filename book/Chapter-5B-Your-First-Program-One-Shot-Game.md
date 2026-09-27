# Chapter 5B: Your First Program — The One-Shot Game

*Read this right after Chapter 5 (What is Programming?). In Chapter 5 you wrote your first lines of code by hand. In this chapter, you'll generate your first complete program — an entire video game — with a single prompt.*

In Chapter 5, you typed `console.log('Hello, World!')` yourself. That was your first *code*.

This chapter is different. Here, you'll create your first *program* — a complete, playable video game — without typing most of it yourself. You'll describe what you want in plain English, give it to an AI, and receive a finished game in return.

This is called a **one-shot program**: one prompt, one complete program.

And there's no better first program than a game.

## What You'll Learn in This Chapter

- What a one-shot program is and why it matters
- Why a game is the perfect first program
- The exact one-shot prompt that created the Neon Invaders game on this Dashboard
- How to run your first one-shot program in 60 seconds
- The biggest lesson: **results depend on the model used**
- The fix loop: how to turn a broken game into a working one
- How to run your own "model bake-off" and compare AI assistants

## The Commissioned Painting Analogy

Remember the robot butler from Chapter 5? You had to give it 13 individual steps just to make a sandwich. That's how programming *used* to feel — and sometimes still does.

Now imagine a different kind of helper: an artist you commission to paint a picture.

**The old way (writing code by hand):**
You buy the canvas, mix every color, sketch the outline, paint each stroke, and touch it up. Step by step, for hours. You are the artist.

**The one-shot way (directing a program):**
You describe the painting in one paragraph — "a neon-lit arcade scene at night, cyan and magenta, with a lone spaceship defending a grid of glowing invaders." The artist disappears into the studio and comes back with a finished painting.

You didn't touch a brush. But it's *your* painting — you commissioned it, you described it, and you decide if it's good enough or needs changes.

A one-shot program is the same idea. You write one prompt that describes a complete program. The AI goes away and comes back with the whole thing — code included. Not a sketch, not a suggestion: a finished, runnable program.

## Why a Game Is the Perfect First Program

You could ask for any program. Here's why you should ask for a game first:

1. **It's fun.** Motivation is everything when you're learning. Finishing your first game beats finishing your first spreadsheet.
2. **It's visual.** You can *see* your program working. Hello World prints two words. A game moves, reacts, and scores.
3. **It's self-contained.** A game needs no server, no database, no API key, no internet. It's one file on your computer.
4. **It's interactive.** You press keys, the program responds. That's the whole point of software — and a game teaches it better than anything.
5. **It's safe.** If your game has a bug, nobody gets hurt. No data is lost. You just reload the page.
6. **It teaches the real workflow.** Describe → generate → run → play → find a bug → fix it. That loop is 90% of what you'll do with AI for the rest of this book.

## The One-Shot Prompt

Here is the prompt that created the Neon Invaders game you can play at `/space-invaders` on this Dashboard:

> **PROMPT YOU CAN USE:**
> "Create a Space Invaders game in a single HTML file with a neon/cyberpunk theme. Include:
> - A 10×5 formation of aliens that moves side to side and descends
> - Three alien types with different point values (30, 20, and 10 points)
> - A mystery ship that flies across the top worth 100–300 points
> - A player ship that moves left/right and shoots
> - Destructible bunkers for cover
> - Three lives, a score display, and a high score that persists
> - Sound effects, a start screen, and pause
> - Arrow keys or A/D to move, Space to shoot
> Make it look like a glowing neon arcade cabinet from the 1980s."

That's it. One paragraph. No line of code written by hand.

What came back was a complete game: the alien formation, the scoring, the bunkers, the mystery ship, the high score saved in your browser, the sounds, the start screen — everything. It runs in any browser by opening a single file.

Now let's prove it to you with your own hands.

## Try It Yourself: Your First One-Shot Program

You'll need: a computer, a browser, and access to any AI assistant (the chat box on this Dashboard works perfectly).

**Step 1 — Copy the prompt.**
Use the prompt above, or write your own. Even simpler for a first try:

> **PROMPT YOU CAN USE:**
> "Create a complete Pong game in a single HTML file. A glowing neon theme, arrow keys to move the left paddle, a computer-controlled right paddle, a score display, and first to 5 points wins. No external libraries."

**Step 2 — Paste it into your AI assistant.**
Use the chat on this Dashboard, or any assistant you have access to (the ones listed in the model dropdown, or any other AI tool you like).

**Step 3 — Save the result.**
The AI will respond with a block of code. Copy it. Open Notepad (or any text editor), paste the code, and save the file as `mygame.html`. Make sure the filename ends in `.html` — that's how the computer knows it's a web page.

**Step 4 — Open it.**
Double-click the file. It opens in your browser. If the game doesn't start automatically, click the page first so it has "focus," then press the keys it asks for.

**Step 5 — Play.**
Move, shoot, score, lose, restart. You just generated your first complete program. Congratulations!

The whole thing took about two minutes. Two minutes ago you had a blank screen. Now you have a working game — and the only "code" you wrote was the sentence describing what you wanted.

## The Big Lesson: Results Depend on the Model Used

Here's the honest part, and it's the most important lesson in this chapter.

**Not all AI models are equal.** The same prompt, pasted into two different assistants, can produce two very different games. One might be a polished, glowing arcade classic. The other might be a buggy mess that can't even start.

This isn't a coincidence, and it isn't your fault. Models differ in:

- **Size** — a small model (a few billion parameters) has less "brain" to hold the whole game in mind at once
- **Training** — a model trained heavily on code (a "coder" model) knows game patterns better than a general-purpose model of the same size
- **Reasoning ability** — some models plan ahead; others start writing and forget what they were building
- **Instruction-following** — some models carefully honor every detail of your prompt; others take shortcuts

### The Real Experiment: Same Prompt, Two Models

This chapter was written on a machine that runs many local AI models. So instead of telling you models differ, let's show you. The author ran the *exact same one-shot Pong prompt* through two different models on the same day:

| | Model A: `minicpm-v4.5:8b` | Model B: `qwen3-coder:30b` |
|---|---|---|
| Size | Small (8 billion parameters) | Large (30 billion parameters) |
| Specialty | General-purpose | Trained for code |
| What it produced | A game that **wouldn't run** | A **working game** with neon glow |
| Paddles | Drawn glued to the ball's position | Correctly positioned on each side |
| Controls | Arrow keys moved the paddle sideways instead of up/down | Arrow keys worked correctly |
| Scoring | Score reset to 0-0 every point — "first to 5" was impossible | Score tracked correctly |
| The neon theme | Plain green and red rectangles | Glowing cyan border, magenta ball with motion trail, glowing score |

Both games are saved in this book's folder so you can try them yourself:

- `book/demo/oneshot-small-model.html` — the small model's attempt. Open it and watch what happens: the ball freezes at the top-left corner and nothing works.
- `book/demo/oneshot-coder-model.html` — the coder model's attempt. Open it and you get a real neon Pong game with a glowing arena, a motion trail on the ball, and a computer opponent that actually plays.

Same prompt. Same machine. Same day. Two completely different results.

### What This Means for You (Don't Panic)

Here's the good news: **this is not a problem — it's a feature.** It's your first lesson in evaluating AI output, and it's the most valuable skill you'll learn in this book.

When your first one-shot program doesn't work, that's normal. It tells you something about the model you used, not about you. The fix is never "give up" — it's one of these:

1. **Try a different model.** The dropdown in your Dashboard lists many. The model that gives you a broken game might just not be a code model.
2. **Make the prompt more specific.** "Neon theme" became green rectangles in Model A. "Glowing neon borders with cyan and magenta colors" is harder to ignore.
3. **Fix it with the fix loop** (next section).

Remember the philosophy from Chapter 1: *the human stays in control*. The AI does the work; you judge the result. Judging is your job, and you're about to get good at it.

## The Fix Loop: From One-Shot to Done

A one-shot program is the starting point, not the finish line. Real work happens in the fix loop:

> Describe → Generate → Run → Play → Spot a bug → Paste the bug back → Fixed game

Here's the beautiful part: **you don't need to understand the bug to fix it.** You just need to describe what you see.

Try it with a broken game. If your game's ball freezes at the top-left corner, don't open the code and stare at it. Paste this back into the AI:

> **PROMPT YOU CAN USE:**
> "I ran the game you gave me and the ball is frozen in the top-left corner — nothing moves. The paddles are also in the wrong place. Please find and fix the bugs."

The same model that made the mistake can usually fix it — or a better model can. This is the "iterate to done" loop, and it's how almost all real AI-assisted programming happens. Professionals don't write one perfect prompt; they run dozens of quick fix loops.

## Try It Yourself: The Model Bake-Off

Now that you know results depend on the model, run your own experiment. This is one of the most fun exercises in the whole book:

1. Pick the same game prompt (use the Pong one above).
2. Run it through **two or three different assistants or models** — for example, two local models from your Dashboard dropdown, or one local model and one cloud assistant.
3. Open each result in your browser and play each one for two minutes.
4. Score them 1–5 on each of these: **Playable** (does it run?), **Complete** (does it have everything you asked for?), **Polished** (does it look like the theme you described?).

You'll almost certainly see a spread — one model gets a 15/20 and another gets a 5/20 for the exact same prompt. Write down what you found. That list of scores *is* the lesson: you now know which of your tools to reach for when you want code.

## How to Personalize This for YOUR Dashboard

The game you generate is yours. You can make it *your* game:

- Ask for a different theme: "80s synthwave," "biohazard green on black," "your company's brand colors"
- Ask for different gameplay: faster aliens, more lives, a boss wave, a two-player mode
- Ask for your name in the title screen: "Call it 'Marcus's Invaders'"

And here's the part that connects to the rest of this book: **the same one-shot game can become a page in your Dashboard.** That's exactly how the Neon Invaders game got here — a description of the game became a feature at `/space-invaders`, with the AI wiring it into the navigation and the app structure. Once you've played with one-shot programs, ask your assistant:

> **PROMPT YOU CAN USE:**
> "I have a single-file HTML game. Add it to my Dashboard as a new page at /mygame with a link in the navigation."

That's the pattern you'll use again and again in this book: describe the feature, let the AI build it, check the result, fix what's off. Games just happen to be the most fun way to learn it.

## Key Takeaways

- A **one-shot program** is a complete program generated from a single prompt
- A game is the perfect first program: fun, visual, self-contained, and safe to break
- One good paragraph of description can produce a complete game in a single file
- **Results depend on the model used** — the same prompt can produce a polished game or a broken one
- A broken first result is normal and expected; it's feedback about the model, not about you
- The **fix loop** (describe → generate → run → paste the bug back) turns broken games into working ones
- Your job is to evaluate and direct — the human stays in control

## Common Pitfalls & How to Avoid Them

**Pitfall #1: "The file won't open."**
Solution: Check the filename ends in `.html`. If it's `mygame.html.txt`, your computer treats it as a text file. In Windows, make sure "file name extensions" are visible in File Explorer.

**Pitfall #2: "I open the game and nothing happens."**
Solution: Click on the page first. Games need keyboard "focus" — if the page isn't clicked, the arrow keys and space bar go to the browser instead. This trips up experienced developers too.

**Pitfall #3: "The model gave me a broken game."**
Solution: That's the lesson of this chapter — it happens. Run the fix loop, or try the same prompt on a different model from the dropdown. Compare your results.

**Pitfall #4: "I want to change something but I'm afraid of breaking it."**
Solution: Keep a copy of the working file (save it as `mygame-backup.html`) before asking for changes. Then break things freely — you can always go back.

**Pitfall #5: "It gave me a wall of code I don't understand."**
Solution: You don't need to understand it all yet. Understanding comes from seeing working examples, which is exactly what you're doing. Chapter 5 taught you the basics; every chapter after this adds more. The code is a friend you'll get to know gradually — not a test you have to pass today.

## Chapter Summary

Congratulations — you've generated your first complete program.

In Chapter 5, you learned that programming is giving precise instructions. In this chapter, you learned the modern version: you describe what you want in English, an AI generates the program, you run it, you judge it, and you fix what's wrong.

You also learned the lesson that separates people who get great results from people who get frustrated: **results depend on the model used.** Two models, one prompt, two very different games — and now you know how to handle whichever one you get. Try a different model. Sharpen the prompt. Run the fix loop. Compare your tools in a bake-off.

One prompt gave you a game. The same skill — describing what you want, checking the result, iterating — will build the rest of your Dashboard.

## Next Steps

Your first program is under your belt. In the next chapters, you'll connect your Dashboard to real AI brains (Chapter 9: Getting Your First Chat Working), let it read your documents (Chapter 10), and give it your brand's voice (Chapter 11). Same skill, bigger canvas: describe → generate → run → fix.

But first — go play your game. You earned it.

*Remember: this book is open source (CC BY-SA 4.0) and the code is MIT licensed. If you improve your game, share it — that's how we all get better together.*
