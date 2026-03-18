// === Chapter 11: Recursion & Recurrence ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch11',
    number: 11,
    title: 'Recursion & Recurrence',
    subtitle: 'Defining the big by reducing to the small',
    sections: [
        // ============================================================
        // Section 0: Defining Things by Themselves
        // ============================================================
        {
            id: 'self-definition',
            title: 'Defining Things by Themselves',
            content: `
<h2>The Art of Self-Reference</h2>

<p>How would you explain what an ancestor is to someone who has never heard the word? You might say: "Your parents are your ancestors, and the ancestors of your parents are also your ancestors." Notice what happened: you defined "ancestor" using the word "ancestor." This is not circular, because each time you invoke the definition, you move one generation further back, and eventually you reach someone's parents (the base case).</p>

<p>This is <strong>recursion</strong>: defining something in terms of a smaller or simpler version of itself, together with one or more base cases where the definition is given directly.</p>

<div class="env-block definition">
<strong>Recursive Definition</strong><br>
A <strong>recursive definition</strong> consists of two parts:
<ol>
<li><strong>Base case(s):</strong> One or more initial values given explicitly.</li>
<li><strong>Recursive step:</strong> A rule that expresses each new value in terms of previous (smaller) values.</li>
</ol>
</div>

<p>You have already seen recursion without knowing its name. The Fibonacci sequence is recursive: \\(F_1 = 1, F_2 = 1\\) (base cases) and \\(F_n = F_{n-1} + F_{n-2}\\) (recursive step). Every arithmetic sequence is recursive too: \\(a_1\\) is given, and \\(a_{n+1} = a_n + d\\).</p>

<div class="env-block example">
<strong>Factorial</strong><br>
The factorial function is defined recursively:
\\[0! = 1 \\quad (\\text{base case})\\]
\\[n! = n \\cdot (n-1)! \\quad (\\text{recursive step, for } n \\geq 1)\\]
So \\(5! = 5 \\cdot 4! = 5 \\cdot 4 \\cdot 3! = 5 \\cdot 4 \\cdot 3 \\cdot 2 \\cdot 1 \\cdot 0! = 120\\).
</div>

<h3>Why recursion works</h3>

<p>A recursive definition is valid as long as:</p>
<ol>
<li>Every chain of recursive calls eventually reaches a base case (no infinite loops).</li>
<li>The base cases are well-defined.</li>
</ol>

<p>If you define \\(a_n = a_{n+1} - 3\\) without a base case, you can never compute any value: to find \\(a_1\\) you need \\(a_2\\), to find \\(a_2\\) you need \\(a_3\\), and so on forever. The chain never bottoms out.</p>

<div class="env-block warning">
<strong>Recursion vs. circularity</strong><br>
Recursion looks circular but is not. The key difference: in recursion, each call refers to a <em>strictly smaller</em> instance. The definition "\\(n! = n \\cdot (n-1)!\\)" always reduces \\(n\\) by 1, eventually reaching 0. A truly circular definition like "a flurb is a thing made of flurbs" never bottoms out.
</div>

<p>The visualization below shows how a recursive tree grows. Each branch spawns smaller branches, which spawn even smaller ones. The process stops at a minimum size (the base case).</p>

<div class="viz-placeholder" data-viz="ch11-recursive-tree"></div>
`,
            visualizations: [
                {
                    id: 'ch11-recursive-tree',
                    title: 'Recursive Tree',
                    description: 'Each branch spawns two smaller branches. Adjust the depth and branching angle to see how recursion builds complex structures from a simple rule.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;
                        var maxDepth = 8;
                        var angle = 25;

                        VizEngine.createSlider(controls, 'Depth', 1, 12, 8, 1, function(v) { maxDepth = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'Angle', 10, 50, 25, 1, function(v) { angle = v; draw(); });

                        function drawBranch(x, y, len, theta, depth) {
                            if (depth <= 0 || len < 2) return;
                            var x2 = x + len * Math.sin(theta);
                            var y2 = y - len * Math.cos(theta);

                            var t = depth / maxDepth;
                            var hue = VizEngine.lerp(120, 30, 1 - t); // green to brown
                            var lw = Math.max(1, depth * 0.8);
                            ctx.strokeStyle = VizEngine.hsl(hue, 60, 35 + t * 20);
                            ctx.lineWidth = lw;
                            ctx.beginPath();
                            ctx.moveTo(x, y);
                            ctx.lineTo(x2, y2);
                            ctx.stroke();

                            // Leaves at tips
                            if (depth <= 2) {
                                ctx.fillStyle = VizEngine.hsl(100 + Math.random() * 40, 70, 45);
                                ctx.beginPath();
                                ctx.arc(x2, y2, 3, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            var rad = angle * Math.PI / 180;
                            var shrink = 0.7;
                            drawBranch(x2, y2, len * shrink, theta - rad, depth - 1);
                            drawBranch(x2, y2, len * shrink, theta + rad, depth - 1);
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Recursive Tree (depth = ' + maxDepth + ')', w / 2, 18, viz.colors.gold, 14);

                            var trunkLen = Math.min(h * 0.25, 120);
                            drawBranch(w / 2, h - 20, trunkLen, 0, maxDepth);

                            var totalBranches = Math.pow(2, maxDepth) - 1;
                            viz.screenText('Branches: 2\u207F \u2212 1 = ' + totalBranches, w / 2, h - 4, viz.colors.text, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Define the sum \\(S(n) = 1 + 2 + 3 + \\cdots + n\\) recursively.',
                    hint: 'What is \\(S(1)\\)? How does \\(S(n)\\) relate to \\(S(n-1)\\)?',
                    solution: 'Base case: \\(S(1) = 1\\). Recursive step: \\(S(n) = S(n-1) + n\\). This says "the sum to \\(n\\) is the sum to \\(n-1\\) plus the new term \\(n\\)."'
                },
                {
                    question: 'The "power tower" is defined recursively: \\(T(1) = 2\\) and \\(T(n) = 2^{T(n-1)}\\). Compute \\(T(1), T(2), T(3), T(4)\\).',
                    hint: 'Each step takes the previous value as the exponent of 2.',
                    solution: '\\(T(1) = 2\\), \\(T(2) = 2^2 = 4\\), \\(T(3) = 2^4 = 16\\), \\(T(4) = 2^{16} = 65536\\). This grows absurdly fast; \\(T(5) = 2^{65536}\\), a number with about 20,000 digits.'
                }
            ]
        },

        // ============================================================
        // Section 1: Tower of Hanoi
        // ============================================================
        {
            id: 'tower-of-hanoi',
            title: 'Tower of Hanoi',
            content: `
<h2>The Monks' Puzzle</h2>

<p>In 1883, the French mathematician Edouard Lucas invented (or perhaps popularized) a puzzle with a wonderful legend. In a temple in Hanoi, monks are moving 64 golden discs between three diamond pegs, following these rules:</p>

<ol>
<li>Only one disc may be moved at a time.</li>
<li>Each move takes the top disc from one peg and places it on another peg.</li>
<li>A larger disc may never be placed on top of a smaller disc.</li>
</ol>

<p>The monks must transfer all 64 discs from the first peg to the third. When they finish, the legend says, the world will end.</p>

<p>Let \\(T(n)\\) be the minimum number of moves needed to transfer \\(n\\) discs. What is \\(T(n)\\)?</p>

<h3>Thinking recursively</h3>

<p>To move \\(n\\) discs from peg A to peg C:</p>
<ol>
<li>Move the top \\(n-1\\) discs from A to B (using C as a spare). This takes \\(T(n-1)\\) moves.</li>
<li>Move the bottom (largest) disc from A to C. This takes 1 move.</li>
<li>Move the \\(n-1\\) discs from B to C (using A as a spare). This takes \\(T(n-1)\\) moves.</li>
</ol>

<p>Total: \\(T(n) = 2T(n-1) + 1\\), with \\(T(1) = 1\\) (just move the single disc).</p>

<div class="env-block theorem">
<strong>Tower of Hanoi recurrence</strong><br>
\\[T(1) = 1, \\qquad T(n) = 2T(n-1) + 1\\]
Solving: \\(T(n) = 2^n - 1\\).
</div>

<p>Let us verify: \\(T(1) = 1 = 2^1 - 1\\). \\(T(2) = 3 = 2^2 - 1\\). \\(T(3) = 7 = 2^3 - 1\\). The pattern holds.</p>

<div class="env-block remark">
<strong>How long for 64 discs?</strong><br>
\\(T(64) = 2^{64} - 1 = 18{,}446{,}744{,}073{,}709{,}551{,}615\\) moves. If the monks move one disc per second, this takes about 585 billion years, roughly 42 times the current age of the universe. The world is safe for now.
</div>

<p>Try solving the Tower of Hanoi yourself in the interactive below. Drag discs between pegs. Can you do it in the minimum number of moves?</p>

<div class="viz-placeholder" data-viz="ch11-hanoi"></div>
`,
            visualizations: [
                {
                    id: 'ch11-hanoi',
                    title: 'Tower of Hanoi',
                    description: 'Click a peg to pick up its top disc, then click another peg to place it. Try to solve with the minimum number of moves!',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;
                        var numDiscs = 4;
                        var pegs = [[], [], []];
                        var moves = 0;
                        var selectedPeg = -1;
                        var solved = false;

                        function reset() {
                            pegs = [[], [], []];
                            for (var i = numDiscs; i >= 1; i--) pegs[0].push(i);
                            moves = 0;
                            selectedPeg = -1;
                            solved = false;
                            draw();
                        }

                        VizEngine.createSlider(controls, 'Discs', 2, 7, 4, 1, function(v) {
                            numDiscs = Math.round(v);
                            reset();
                        });

                        VizEngine.createButton(controls, 'Reset', reset);

                        var autoSolving = false;
                        var autoMoves = [];
                        var autoTimer = null;

                        VizEngine.createButton(controls, 'Auto-Solve', function() {
                            if (autoSolving) return;
                            reset();
                            autoSolving = true;
                            autoMoves = [];
                            generateMoves(numDiscs, 0, 2, 1);
                            playMoves();
                        });

                        function generateMoves(n, from, to, spare) {
                            if (n === 0) return;
                            generateMoves(n - 1, from, spare, to);
                            autoMoves.push([from, to]);
                            generateMoves(n - 1, spare, to, from);
                        }

                        function playMoves() {
                            if (autoMoves.length === 0) { autoSolving = false; return; }
                            var move = autoMoves.shift();
                            var disc = pegs[move[0]].pop();
                            pegs[move[1]].push(disc);
                            moves++;
                            if (pegs[2].length === numDiscs) solved = true;
                            draw();
                            autoTimer = setTimeout(playMoves, 400);
                        }

                        function draw() {
                            viz.clear();
                            var optimal = Math.pow(2, numDiscs) - 1;

                            // Title
                            viz.screenText('Tower of Hanoi', w / 2, 18, viz.colors.gold, 16);
                            viz.screenText('Moves: ' + moves + '  (optimal: ' + optimal + ')', w / 2, 38, moves <= optimal || !solved ? viz.colors.text : viz.colors.orange, 13);

                            if (solved) {
                                var msg = moves === optimal ? 'Perfect! Solved in minimum moves!' : 'Solved! (but ' + (moves - optimal) + ' extra moves)';
                                viz.screenText(msg, w / 2, 56, viz.colors.green, 14);
                            }

                            // Draw pegs
                            var pegSpacing = w / 4;
                            var baseY = h - 40;
                            var pegHeight = h * 0.45;
                            var maxDiscW = pegSpacing * 0.85;
                            var discH = Math.min(28, pegHeight / (numDiscs + 1));

                            for (var p = 0; p < 3; p++) {
                                var px = pegSpacing * (p + 1);

                                // Peg rod
                                ctx.fillStyle = selectedPeg === p ? viz.colors.gold : '#4a4a7a';
                                ctx.fillRect(px - 3, baseY - pegHeight, 6, pegHeight);

                                // Base
                                ctx.fillStyle = '#4a4a7a';
                                ctx.fillRect(px - maxDiscW / 2 - 10, baseY, maxDiscW + 20, 4);

                                // Peg label
                                viz.screenText(String.fromCharCode(65 + p), px, baseY + 20, viz.colors.text, 13);

                                // Draw discs
                                for (var d = 0; d < pegs[p].length; d++) {
                                    var disc = pegs[p][d];
                                    var dw = (disc / numDiscs) * maxDiscW;
                                    var dy = baseY - (d + 1) * discH;
                                    var hue = 200 + (disc - 1) * (160 / numDiscs);
                                    ctx.fillStyle = VizEngine.hsl(hue, 70, 50);
                                    ctx.beginPath();
                                    ctx.roundRect(px - dw / 2, dy, dw, discH - 2, 4);
                                    ctx.fill();

                                    // Disc number
                                    if (discH >= 16) {
                                        viz.screenText('' + disc, px, dy + discH / 2 - 1, viz.colors.white, 11);
                                    }
                                }
                            }

                            // Selected indicator
                            if (selectedPeg >= 0 && pegs[selectedPeg].length > 0) {
                                var spx = pegSpacing * (selectedPeg + 1);
                                var topDisc = pegs[selectedPeg][pegs[selectedPeg].length - 1];
                                var tdw = (topDisc / numDiscs) * maxDiscW;
                                var tdy = baseY - pegs[selectedPeg].length * discH;
                                ctx.strokeStyle = viz.colors.gold;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.roundRect(spx - tdw / 2 - 2, tdy - 2, tdw + 4, discH + 2, 4);
                                ctx.stroke();
                            }

                            if (!solved && !autoSolving) {
                                viz.screenText('Click a peg to pick up / place a disc', w / 2, h - 10, viz.colors.text, 11);
                            }
                        }

                        // Click handling
                        viz.canvas.addEventListener('click', function(e) {
                            if (autoSolving || solved) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var pegSpacing = w / 4;

                            // Determine which peg was clicked
                            var clickedPeg = -1;
                            for (var p = 0; p < 3; p++) {
                                var px = pegSpacing * (p + 1);
                                if (Math.abs(mx - px) < pegSpacing * 0.45) {
                                    clickedPeg = p;
                                    break;
                                }
                            }
                            if (clickedPeg < 0) return;

                            if (selectedPeg < 0) {
                                // Select a peg (pick up)
                                if (pegs[clickedPeg].length > 0) {
                                    selectedPeg = clickedPeg;
                                }
                            } else {
                                // Try to place
                                if (clickedPeg === selectedPeg) {
                                    selectedPeg = -1; // Deselect
                                } else {
                                    var disc = pegs[selectedPeg][pegs[selectedPeg].length - 1];
                                    var topDest = pegs[clickedPeg].length > 0 ? pegs[clickedPeg][pegs[clickedPeg].length - 1] : Infinity;
                                    if (disc < topDest) {
                                        // Valid move
                                        pegs[selectedPeg].pop();
                                        pegs[clickedPeg].push(disc);
                                        moves++;
                                        selectedPeg = -1;
                                        if (pegs[2].length === numDiscs) solved = true;
                                    }
                                    // Invalid move: just deselect
                                    else {
                                        selectedPeg = -1;
                                    }
                                }
                            }
                            draw();
                        });

                        reset();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Solve the Tower of Hanoi for \\(n = 3\\) discs by listing all 7 moves. Label the pegs A, B, C and the discs 1 (smallest), 2, 3 (largest).',
                    hint: 'First move disc 1 to C, disc 2 to B, disc 1 to B (that clears the way for disc 3).',
                    solution: '1. Disc 1: A to C. 2. Disc 2: A to B. 3. Disc 1: C to B. 4. Disc 3: A to C. 5. Disc 1: B to A. 6. Disc 2: B to C. 7. Disc 1: A to C. Done in 7 = \\(2^3 - 1\\) moves.'
                },
                {
                    question: 'Prove that \\(T(n) = 2^n - 1\\) by substituting into the recurrence \\(T(n) = 2T(n-1) + 1\\).',
                    hint: 'If \\(T(n-1) = 2^{n-1} - 1\\), compute \\(2T(n-1) + 1\\).',
                    solution: '\\(2T(n-1) + 1 = 2(2^{n-1} - 1) + 1 = 2^n - 2 + 1 = 2^n - 1 = T(n)\\). Base case: \\(T(1) = 2^1 - 1 = 1\\). By induction, the formula holds for all \\(n \\geq 1\\).'
                },
                {
                    question: '(Challenge) With 4 pegs instead of 3, the optimal number of moves for \\(n\\) discs is much smaller. For \\(n = 4\\) discs, can you find a solution with fewer than \\(2^4 - 1 = 15\\) moves?',
                    hint: 'The Frame-Stewart conjecture suggests splitting the discs: move the top \\(k\\) discs to a spare peg (using 4-peg strategy), move the remaining \\(n-k\\) with 3 pegs, then move the \\(k\\) back.',
                    solution: 'With 4 pegs and \\(n = 4\\) discs, you can do it in <strong>9 moves</strong>. Move discs 1,2 to peg B (3 moves with 4 pegs), move discs 3,4 to peg D using 3-peg strategy via C (3 moves), move discs 1,2 from B to D (3 moves). Total: 9 moves, far fewer than 15.'
                }
            ]
        },

        // ============================================================
        // Section 2: Fibonacci Revisited
        // ============================================================
        {
            id: 'fibonacci-revisited',
            title: 'Fibonacci Revisited',
            content: `
<h2>The Rabbit Recurrence</h2>

<p>We met the Fibonacci sequence in Chapter 9 as a pattern to recognize. Now we study it as a <em>recurrence relation</em>, the most famous one in mathematics.</p>

<div class="env-block definition">
<strong>Fibonacci Recurrence</strong><br>
\\[F_1 = 1, \\quad F_2 = 1, \\quad F_n = F_{n-1} + F_{n-2} \\text{ for } n \\geq 3\\]
</div>

<p>This is a <strong>second-order linear recurrence</strong>: "second-order" because each term depends on the two before it, and "linear" because we add (rather than multiply) the previous terms.</p>

<h3>Fibonacci's rabbits, in detail</h3>

<p>Recall the original problem: rabbits take one month to mature, then produce one new pair each month. If we track the population month by month:</p>

<ul>
<li>Month 1: 1 pair (newborn)</li>
<li>Month 2: 1 pair (now mature)</li>
<li>Month 3: 2 pairs (the mature pair breeds)</li>
<li>Month 4: 3 pairs (the original pair breeds again; the month-3 pair is still too young)</li>
<li>Month 5: 5 pairs</li>
</ul>

<p>Why \\(F_n = F_{n-1} + F_{n-2}\\)? At month \\(n\\), the population consists of all pairs from month \\(n-1\\) (nobody dies) plus new births. The new births come from pairs that are at least 2 months old, which is the population at month \\(n-2\\).</p>

<div class="viz-placeholder" data-viz="ch11-fibonacci-rabbits"></div>

<h3>Properties of Fibonacci numbers</h3>

<p>The Fibonacci sequence is a goldmine of surprising properties:</p>

<div class="env-block theorem">
<strong>Selected Fibonacci identities</strong><br>
<ol>
<li>\\(F_1 + F_2 + \\cdots + F_n = F_{n+2} - 1\\)</li>
<li>\\(F_1^2 + F_2^2 + \\cdots + F_n^2 = F_n \\cdot F_{n+1}\\)</li>
<li>\\(\\gcd(F_m, F_n) = F_{\\gcd(m,n)}\\)</li>
<li>\\(F_n / F_{n-1} \\to \\varphi = \\frac{1 + \\sqrt{5}}{2} \\approx 1.618\\) as \\(n \\to \\infty\\)</li>
</ol>
</div>

<p>Property 4 connects Fibonacci to the <strong>golden ratio</strong> \\(\\varphi\\). The convergence is rapid: by \\(n = 10\\), the ratio \\(F_{10}/F_9 = 55/34 \\approx 1.6176\\), already within 0.03% of \\(\\varphi\\).</p>
`,
            visualizations: [
                {
                    id: 'ch11-fibonacci-rabbits',
                    title: 'Fibonacci Rabbit Population',
                    description: 'Watch the rabbit population grow. Mature pairs (gold) breed each month; young pairs (blue) need a month to mature.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;
                        var maxMonth = 12;
                        var fib = [0, 1, 1];
                        for (var i = 3; i <= maxMonth; i++) fib.push(fib[i - 1] + fib[i - 2]);

                        var month = 1;

                        VizEngine.createSlider(controls, 'Month', 1, maxMonth, 1, 1, function(v) {
                            month = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var margin = 50;
                            var barAreaW = w - margin * 2;
                            var gap = barAreaW / maxMonth;
                            var barW = gap * 0.7;
                            var maxVal = fib[maxMonth];
                            var barAreaH = h - 140;

                            viz.screenText('Fibonacci Rabbit Population', w / 2, 18, viz.colors.gold, 15);

                            // F(n) = F(n-1) + F(n-2)
                            if (month >= 3) {
                                viz.screenText('F(' + month + ') = F(' + (month - 1) + ') + F(' + (month - 2) + ') = ' + fib[month - 1] + ' + ' + fib[month - 2] + ' = ' + fib[month], w / 2, 42, viz.colors.teal, 13);
                            } else {
                                viz.screenText('F(' + month + ') = ' + fib[month], w / 2, 42, viz.colors.teal, 13);
                            }

                            for (var m = 1; m <= maxMonth; m++) {
                                var bx = margin + (m - 1) * gap + gap / 2;
                                var val = fib[m];
                                var barH = Math.max(2, (val / maxVal) * barAreaH);

                                if (m <= month) {
                                    // Split into mature (existed at m-2) and young (born at m-1)
                                    var mature = m >= 3 ? fib[m - 2] : (m === 2 ? 1 : 0);
                                    if (m === 1) mature = 0;
                                    var young = val - mature;

                                    // Mature (gold)
                                    var matureH = Math.max(0, (mature / maxVal) * barAreaH);
                                    ctx.fillStyle = m === month ? viz.colors.gold : viz.colors.gold + '88';
                                    ctx.fillRect(bx - barW / 2, h - 50 - matureH, barW, matureH);

                                    // Young (blue)
                                    var youngH = Math.max(0, (young / maxVal) * barAreaH);
                                    ctx.fillStyle = m === month ? viz.colors.blue : viz.colors.blue + '88';
                                    ctx.fillRect(bx - barW / 2, h - 50 - matureH - youngH, barW, youngH);

                                    // Value
                                    viz.screenText('' + val, bx, h - 56 - barH, m === month ? viz.colors.white : viz.colors.text, 11);
                                } else {
                                    ctx.fillStyle = '#1a1a40';
                                    ctx.fillRect(bx - barW / 2, h - 50 - barH, barW, barH);
                                }

                                // Month label
                                viz.screenText('' + m, bx, h - 36, viz.colors.text, 10);
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.gold;
                            ctx.fillRect(14, h - 18, 10, 10);
                            viz.screenText('Mature', 30, h - 13, viz.colors.text, 10, 'left');
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillRect(80, h - 18, 10, 10);
                            viz.screenText('Young', 96, h - 13, viz.colors.text, 10, 'left');

                            // Ratio
                            if (month >= 3) {
                                var ratio = (fib[month] / fib[month - 1]).toFixed(4);
                                viz.screenText('F(' + month + ')/F(' + (month - 1) + ') = ' + ratio + '  (\u03C6 \u2248 1.6180)', w / 2, 62, viz.colors.purple, 12);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Verify the identity \\(F_1 + F_2 + \\cdots + F_n = F_{n+2} - 1\\) for \\(n = 6\\).',
                    hint: 'The first 8 Fibonacci numbers are 1, 1, 2, 3, 5, 8, 13, 21.',
                    solution: '\\(F_1 + \\cdots + F_6 = 1 + 1 + 2 + 3 + 5 + 8 = 20\\). And \\(F_8 - 1 = 21 - 1 = 20\\). Confirmed.'
                },
                {
                    question: 'Show that every third Fibonacci number is even.',
                    hint: 'Write out the parities: O, O, E, O, O, E, ... (O = odd, E = even). Why does this pattern repeat?',
                    solution: 'O + O = E, O + E = O, E + O = O. So the parity pattern is O, O, E repeating with period 3. Every third Fibonacci number (\\(F_3, F_6, F_9, \\ldots\\)) is even.'
                },
                {
                    question: 'Define a "tribonacci" sequence by \\(T_1 = T_2 = T_3 = 1\\) and \\(T_n = T_{n-1} + T_{n-2} + T_{n-3}\\). Compute \\(T_4\\) through \\(T_8\\).',
                    hint: 'Each term is the sum of the three preceding terms.',
                    solution: '\\(T_4 = 1+1+1 = 3\\), \\(T_5 = 3+1+1 = 5\\), \\(T_6 = 5+3+1 = 9\\), \\(T_7 = 9+5+3 = 17\\), \\(T_8 = 17+9+5 = 31\\). The sequence is 1, 1, 1, 3, 5, 9, 17, 31, ...'
                }
            ]
        },

        // ============================================================
        // Section 3: Solving Simple Recurrences
        // ============================================================
        {
            id: 'solving-recurrences',
            title: 'Solving Simple Recurrences',
            content: `
<h2>From Recurrence to Formula</h2>

<p>A recurrence tells you how to <em>compute</em> terms one by one. But often we want a <strong>closed-form formula</strong> that gives \\(a_n\\) directly, without computing all previous terms. How do we find one?</p>

<h3>Method 1: Guess and verify</h3>

<p>Compute several terms, spot a pattern, then prove it works (usually by induction).</p>

<div class="env-block example">
<strong>Example</strong><br>
\\(a_1 = 1\\), \\(a_n = 2a_{n-1} + 1\\).<br>
Terms: 1, 3, 7, 15, 31, 63, ...<br>
These are \\(2^n - 1\\). Verify: \\(2(2^{n-1} - 1) + 1 = 2^n - 2 + 1 = 2^n - 1\\). Confirmed.
</div>

<h3>Method 2: Telescoping</h3>

<p>For recurrences of the form \\(a_n - a_{n-1} = f(n)\\), sum both sides from 2 to \\(n\\):</p>

\\[a_n - a_1 = \\sum_{k=2}^{n} f(k)\\]

<div class="env-block example">
<strong>Example</strong><br>
\\(a_1 = 0\\), \\(a_n = a_{n-1} + n\\) (so \\(f(n) = n\\)).<br>
\\(a_n = a_1 + \\sum_{k=2}^{n} k = 0 + (2 + 3 + \\cdots + n) = \\frac{n(n+1)}{2} - 1\\).
</div>

<h3>Method 3: The substitution trick for \\(a_n = ra_{n-1} + c\\)</h3>

<p>This is a <strong>first-order linear recurrence</strong> with constant coefficients. The trick: find a value \\(a^*\\) such that \\(a^* = ra^* + c\\), i.e., \\(a^* = \\frac{c}{1-r}\\) (assuming \\(r \\neq 1\\)). Then define \\(b_n = a_n - a^*\\). We get:</p>

\\[b_n = a_n - a^* = r a_{n-1} + c - a^* = r(a_{n-1} - a^*) = r \\cdot b_{n-1}\\]

<p>So \\(b_n\\) is geometric! \\(b_n = b_1 \\cdot r^{n-1}\\), giving:</p>

\\[a_n = a^* + (a_1 - a^*) r^{n-1}\\]

<div class="env-block example">
<strong>Tower of Hanoi via the substitution trick</strong><br>
\\(T(n) = 2T(n-1) + 1\\), \\(T(1) = 1\\).<br>
Here \\(r = 2, c = 1\\). The fixed point is \\(a^* = 1/(1-2) = -1\\).<br>
So \\(T(n) = -1 + (1 - (-1)) \\cdot 2^{n-1} = -1 + 2^n = 2^n - 1\\).
</div>

<div class="env-block theorem">
<strong>Solution of \\(a_n = ra_{n-1} + c\\)</strong><br>
For \\(r \\neq 1\\):
\\[a_n = \\frac{c}{1-r} + \\left(a_1 - \\frac{c}{1-r}\\right) r^{n-1}\\]
For \\(r = 1\\): \\(a_n = a_1 + (n-1)c\\) (arithmetic sequence).
</div>

<div class="env-block remark">
<strong>What about Fibonacci?</strong><br>
The Fibonacci recurrence \\(F_n = F_{n-1} + F_{n-2}\\) is second-order, so it needs a different technique (the "characteristic equation" method). The closed-form is Binet's formula:
\\[F_n = \\frac{\\varphi^n - \\psi^n}{\\sqrt{5}}, \\quad \\varphi = \\frac{1+\\sqrt{5}}{2}, \\quad \\psi = \\frac{1-\\sqrt{5}}{2}\\]
This remarkable formula says that Fibonacci numbers, which are always integers, can be computed using irrational numbers. We will explore this in more advanced chapters.
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Solve the recurrence \\(a_1 = 5\\), \\(a_n = 3a_{n-1} - 4\\).',
                    hint: 'Use the substitution trick: find \\(a^* = c/(1-r) = -4/(1-3) = 2\\).',
                    solution: '\\(a^* = -4/(1-3) = 2\\). Then \\(a_n = 2 + (5 - 2) \\cdot 3^{n-1} = 2 + 3^n\\). Check: \\(a_1 = 2 + 3 = 5\\). \\(a_2 = 3 \\cdot 5 - 4 = 11 = 2 + 9 = 2 + 3^2\\). Confirmed.'
                },
                {
                    question: 'A bank account starts with $1000 and earns 5% interest per year, plus you deposit $200 each year. Write the recurrence and find the balance after \\(n\\) years.',
                    hint: 'The recurrence is \\(a_n = 1.05 \\cdot a_{n-1} + 200\\). Use the substitution trick with \\(r = 1.05, c = 200\\).',
                    solution: '\\(a^* = 200/(1 - 1.05) = -4000\\). So \\(a_n = -4000 + (1000 + 4000) \\cdot 1.05^{n-1} = -4000 + 5000 \\cdot 1.05^{n-1}\\). After 10 years: \\(a_{10} = -4000 + 5000 \\cdot 1.05^9 \\approx -4000 + 7757.25 = \\$3757.25\\). Wait, that is the balance at the <em>start</em> of year 10. More precisely: \\(a_1 = 1000\\), \\(a_2 = 1250\\), and after 10 years \\(a_{10} \\approx 3757.25\\).'
                },
                {
                    question: 'Solve the telescoping recurrence \\(a_1 = 0\\), \\(a_n = a_{n-1} + 2n - 1\\).',
                    hint: 'Sum: \\(a_n = a_1 + \\sum_{k=2}^{n}(2k-1)\\). What is the sum of odd numbers?',
                    solution: '\\(a_n = 0 + \\sum_{k=2}^{n}(2k-1) = \\sum_{k=1}^{n}(2k-1) - 1 = n^2 - 1\\). Check: \\(a_1 = 0 = 1^2 - 1\\), \\(a_2 = 0 + 3 = 3 = 4 - 1\\), \\(a_3 = 3 + 5 = 8 = 9 - 1\\). Confirmed.'
                }
            ]
        },

        // ============================================================
        // Section 4: Recursion in the Real World
        // ============================================================
        {
            id: 'real-world-recursion',
            title: 'Recursion in the Real World',
            content: `
<h2>Recursion Beyond Mathematics</h2>

<p>Recursion is not just a mathematical abstraction. It is one of the most powerful ideas in computer science, and it appears throughout nature and everyday life.</p>

<h3>Recursion in computer science</h3>

<p>Every programming language supports recursive functions: functions that call themselves. When a computer evaluates <code>factorial(5)</code>, it calls <code>factorial(4)</code>, which calls <code>factorial(3)</code>, and so on down to <code>factorial(0) = 1</code>. The computer keeps track of all the pending calls on a <strong>call stack</strong>.</p>

<div class="env-block example">
<strong>Pseudocode: Fibonacci</strong><br>
<pre style="color:#3fb9a0; font-size:0.95rem;">
function fib(n):
    if n &lt;= 2: return 1    // base case
    return fib(n-1) + fib(n-2)  // recursive step
</pre>
This is elegant but slow: computing <code>fib(40)</code> makes over 200 million recursive calls! The fix is <strong>memoization</strong>: store results you have already computed to avoid redundant work. With memoization, <code>fib(40)</code> takes only 39 additions.
</div>

<h3>Recursion in nature</h3>

<p>Nature is full of recursive structures:</p>

<ul>
<li><strong>Ferns:</strong> Each frond consists of smaller fronds, which consist of even smaller fronds. The shape is approximately self-similar across scales.</li>
<li><strong>Broccoli (Romanesco):</strong> Each bud is a miniature version of the whole head, arranged in a logarithmic spiral.</li>
<li><strong>Rivers:</strong> A river system is a main channel with tributaries, each of which is itself a channel with smaller tributaries.</li>
<li><strong>Lungs:</strong> The bronchial tree branches into smaller and smaller tubes, each branch resembling the whole structure at a reduced scale.</li>
</ul>

<h3>Divide and conquer</h3>

<p>Many of the fastest algorithms in computer science use a recursive strategy called <strong>divide and conquer</strong>:</p>

<ol>
<li><strong>Divide</strong> the problem into smaller sub-problems of the same type.</li>
<li><strong>Conquer</strong> each sub-problem recursively.</li>
<li><strong>Combine</strong> the results.</li>
</ol>

<div class="env-block example">
<strong>Merge sort</strong><br>
To sort a list of \\(n\\) numbers: split it into two halves, recursively sort each half, then merge the two sorted halves. The recurrence for the number of comparisons is \\(C(n) = 2C(n/2) + n\\), giving \\(C(n) = O(n \\log n)\\). This is far faster than the \\(O(n^2)\\) of naive sorting for large \\(n\\).
</div>

<h3>The limits of recursion</h3>

<p>Recursion is powerful, but not without pitfalls:</p>

<div class="env-block warning">
<strong>Watch out for</strong><br>
<ul>
<li><strong>Missing base case:</strong> Infinite loop (stack overflow in a computer).</li>
<li><strong>Exponential blowup:</strong> Naive Fibonacci computes the same values over and over. Always check for redundant computation.</li>
<li><strong>Excessive depth:</strong> Even correct recursion can overflow the call stack if the depth is too large (e.g., \\(n = 1{,}000{,}000\\)).</li>
</ul>
</div>

<p>Recursion and iteration (loops) are equally powerful in theory: anything you can do recursively, you can do with loops, and vice versa. In practice, some problems are most naturally expressed recursively (tree traversal, Tower of Hanoi, fractals), while others are more natural as loops (summing a list, scanning a file). The best mathematicians and programmers develop fluency in both styles.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'How many moves does it take to solve the Tower of Hanoi with 10 discs? With 20 discs?',
                    hint: 'Use \\(T(n) = 2^n - 1\\).',
                    solution: '\\(T(10) = 2^{10} - 1 = 1023\\). \\(T(20) = 2^{20} - 1 = 1{,}048{,}575\\). At one move per second, 10 discs takes about 17 minutes. 20 discs takes about 12 days.'
                },
                {
                    question: 'The Koch snowflake starts with a triangle and, at each step, replaces every line segment\'s middle third with two sides of a smaller equilateral triangle. If the initial triangle has 3 segments, how many segments are there after \\(n\\) steps? Write a recurrence and solve it.',
                    hint: 'Each segment is replaced by 4 smaller segments.',
                    solution: '\\(S(0) = 3\\), \\(S(n) = 4 \\cdot S(n-1)\\). This is geometric: \\(S(n) = 3 \\cdot 4^n\\). After 5 steps: \\(S(5) = 3 \\cdot 1024 = 3072\\) segments.'
                },
                {
                    question: '(Challenge) A frog can jump either 1 or 2 steps at a time. How many distinct ways can it reach step \\(n\\)? Write a recurrence and relate it to the Fibonacci numbers.',
                    hint: 'To reach step \\(n\\), the frog\'s last jump was either from step \\(n-1\\) (a 1-step jump) or from step \\(n-2\\) (a 2-step jump).',
                    solution: 'Let \\(W(n)\\) be the number of ways. \\(W(1) = 1\\) (just one 1-step jump), \\(W(2) = 2\\) (either 1+1 or 2). For \\(n \\geq 3\\): \\(W(n) = W(n-1) + W(n-2)\\). This is exactly the Fibonacci recurrence with \\(W(1) = 1, W(2) = 2\\), so \\(W(n) = F_{n+1}\\) where \\(F\\) is the standard Fibonacci sequence. For example, \\(W(5) = F_6 = 8\\): there are 8 ways to reach step 5.'
                }
            ]
        }
    ]
});
})();
