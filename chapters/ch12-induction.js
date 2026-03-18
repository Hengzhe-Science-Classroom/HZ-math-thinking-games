// === Chapter 12: Mathematical Induction ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch12',
    number: 12,
    title: 'Mathematical Induction',
    subtitle: 'Proving infinitely many things in two finite steps',
    sections: [
        // ===== Section 0: The Domino Effect =====
        {
            id: 'ch12-sec00',
            title: 'The Domino Effect',
            content: `
<h2>Knocking Down an Infinite Row</h2>

<p>Imagine a row of dominoes stretching out as far as you can see. You want to guarantee that every single domino falls. How many things do you actually need to check?</p>

<p>Remarkably, just <strong>two</strong>:</p>

<ol>
<li>The first domino falls.</li>
<li>Whenever any domino falls, it knocks down the next one.</li>
</ol>

<p>If both of these are true, then every domino in the row must fall, no matter how long the row is. The first one falls (by rule 1). That makes the second one fall (by rule 2). That makes the third one fall (by rule 2 again). And so on, forever.</p>

<div class="env-block intuition">
<strong>The Key Insight</strong><br>
You do not need to check each domino individually. You only need to verify the <em>mechanism</em> that connects one domino to the next. That mechanism, applied repeatedly, takes care of everything.
</div>

<p>This is exactly how <strong>mathematical induction</strong> works. It is a proof technique that lets you prove a statement is true for every natural number \\(n = 1, 2, 3, \\ldots\\) by checking just two things.</p>

<div class="viz-placeholder" data-viz="ch12-dominoes"></div>

<p>Watch the animation above. Click "Knock First Domino" to push the first one over, and see the entire chain react. This is induction in action: one push, infinitely many consequences.</p>

<div class="env-block remark">
<strong>Why do we need this?</strong><br>
Suppose you discover that \\(1 + 2 + 3 + \\cdots + n = \\frac{n(n+1)}{2}\\). You check it for \\(n = 1\\): yes, \\(1 = \\frac{1 \\cdot 2}{2}\\). You check \\(n = 2\\): yes, \\(3 = \\frac{2 \\cdot 3}{2}\\). You check \\(n = 100\\): yes, \\(5050 = \\frac{100 \\cdot 101}{2}\\). But no matter how many cases you check, you have not <em>proved</em> the formula works for all \\(n\\). There are infinitely many natural numbers, and you cannot check them one by one. Induction gives you a way to bridge that infinite gap.
</div>
`,
            visualizations: [
                {
                    id: 'ch12-dominoes',
                    title: 'The Domino Chain',
                    description: 'Push the first domino and watch the chain reaction. Each domino knocks down the next, just like induction propagates truth from P(k) to P(k+1).',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var numDominoes = 20;
                        var spacing = (w - 80) / numDominoes;
                        var dominoWidth = Math.min(12, spacing * 0.4);
                        var dominoHeight = 60;
                        var baseY = h * 0.65;

                        // Each domino has an angle (0 = standing, PI/2 = fallen)
                        var angles = [];
                        var falling = [];
                        var started = false;
                        var fallSpeed = 3.5;

                        function reset() {
                            angles = [];
                            falling = [];
                            started = false;
                            for (var i = 0; i < numDominoes; i++) {
                                angles.push(0);
                                falling.push(false);
                            }
                        }
                        reset();

                        VizEngine.createButton(controls, 'Knock First Domino', function() {
                            reset();
                            started = true;
                            falling[0] = true;
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            reset();
                        });

                        viz.animate(function(t) {
                            // Update physics
                            if (started) {
                                for (var i = 0; i < numDominoes; i++) {
                                    if (falling[i] && angles[i] < Math.PI / 2) {
                                        angles[i] += fallSpeed * 0.016;
                                        if (angles[i] > Math.PI / 2) angles[i] = Math.PI / 2;
                                        // Check if this domino hits the next
                                        var tipReach = dominoHeight * Math.sin(angles[i]);
                                        if (i < numDominoes - 1 && tipReach >= spacing * 0.7 && !falling[i + 1]) {
                                            falling[i + 1] = true;
                                        }
                                    }
                                }
                            }

                            // Draw
                            viz.clear();

                            // Floor
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(0, baseY + 5, w, h - baseY);

                            // Draw dominoes
                            for (var i = 0; i < numDominoes; i++) {
                                var x = 50 + i * spacing;
                                var angle = angles[i];
                                var isFallen = angle >= Math.PI / 2 - 0.01;

                                ctx.save();
                                ctx.translate(x, baseY);
                                ctx.rotate(angle);

                                // Domino body
                                var hue = (i * 360 / numDominoes + 200) % 360;
                                var alpha = isFallen ? 0.6 : 1.0;
                                ctx.fillStyle = VizEngine.hsl(hue, 70, 55);
                                ctx.globalAlpha = alpha;
                                ctx.fillRect(-dominoWidth / 2, -dominoHeight, dominoWidth, dominoHeight);

                                // Domino border
                                ctx.strokeStyle = '#ffffff44';
                                ctx.lineWidth = 1;
                                ctx.strokeRect(-dominoWidth / 2, -dominoHeight, dominoWidth, dominoHeight);

                                // Dot on domino
                                ctx.fillStyle = '#fff';
                                ctx.beginPath();
                                ctx.arc(0, -dominoHeight * 0.5, 3, 0, Math.PI * 2);
                                ctx.fill();

                                ctx.globalAlpha = 1.0;
                                ctx.restore();

                                // Label
                                if (i < 5 || i === numDominoes - 1) {
                                    ctx.fillStyle = '#8b949e';
                                    ctx.font = '11px -apple-system, sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    var label = i === numDominoes - 1 ? 'n=' + (i + 1) : 'n=' + (i + 1);
                                    ctx.fillText(label, x, baseY + 10);
                                }
                            }

                            // Labels
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            if (!started) {
                                ctx.fillText('Click "Knock First Domino" to start the chain!', w / 2, 20);
                            } else {
                                var fallenCount = 0;
                                for (var i = 0; i < numDominoes; i++) {
                                    if (angles[i] >= Math.PI / 2 - 0.01) fallenCount++;
                                }
                                if (fallenCount === numDominoes) {
                                    ctx.fillStyle = '#3fb950';
                                    ctx.fillText('All ' + numDominoes + ' dominoes have fallen!', w / 2, 20);
                                } else {
                                    ctx.fillText(fallenCount + ' dominoes fallen...', w / 2, 20);
                                }
                            }

                            // Annotation
                            ctx.fillStyle = '#58a6ff';
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Base case: first domino falls', 20, h - 50);
                            ctx.fillStyle = '#f0883e';
                            ctx.fillText('Inductive step: each domino knocks down the next', 20, h - 30);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Suppose you set up an infinite row of dominoes, but you forget to knock the first one over. Will any dominoes fall? What does this correspond to in induction?',
                    hint: 'Think about what happens if the base case fails.',
                    solution: 'No dominoes fall. Even though the chain reaction mechanism is perfect (each domino would knock down the next if it fell), nothing ever gets started. In induction, this corresponds to failing to prove the <strong>base case</strong>. Without verifying that the statement is true for \\(n = 1\\), you have no starting point for the chain of implications.'
                },
                {
                    question: 'Now suppose you knock the first domino over, but there is a gap somewhere in the middle of the row (say between domino 50 and domino 51). What happens?',
                    hint: 'Think about what happens if the inductive step fails for some specific value of \\(k\\).',
                    solution: 'Dominoes 1 through 50 fall, but domino 51 and all those after it stay standing. The chain reaction stops at the gap. In induction, this corresponds to the inductive step failing for some \\(k\\): if you cannot prove \\(P(k) \\Rightarrow P(k+1)\\) for all \\(k\\), the argument breaks down at the first value where the implication fails.'
                }
            ]
        },

        // ===== Section 1: Base Case and Inductive Step =====
        {
            id: 'ch12-sec01',
            title: 'Base Case and Inductive Step',
            content: `
<h2>The Two Pillars of Induction</h2>

<p>Let us translate the domino metaphor into precise mathematics. Suppose \\(P(n)\\) is some statement that depends on a natural number \\(n\\). For example, \\(P(n)\\) might be "the sum of the first \\(n\\) positive integers equals \\(\\frac{n(n+1)}{2}\\)."</p>

<div class="env-block definition">
<strong>Principle of Mathematical Induction</strong><br>
To prove that \\(P(n)\\) is true for all natural numbers \\(n \\geq 1\\), it suffices to prove two things:
<ol>
<li><strong>Base case:</strong> \\(P(1)\\) is true.</li>
<li><strong>Inductive step:</strong> For every \\(k \\geq 1\\), if \\(P(k)\\) is true, then \\(P(k+1)\\) is also true.</li>
</ol>
</div>

<p>The base case is your first domino. The inductive step is the guarantee that each domino knocks down the next.</p>

<h3>The Logical Chain</h3>

<p>Here is why it works. From the base case, we know \\(P(1)\\) is true. From the inductive step with \\(k = 1\\), since \\(P(1)\\) is true, we get \\(P(2)\\) is true. From the inductive step with \\(k = 2\\), since \\(P(2)\\) is true, we get \\(P(3)\\) is true. And so on:</p>

\\[
P(1) \\Rightarrow P(2) \\Rightarrow P(3) \\Rightarrow P(4) \\Rightarrow \\cdots
\\]

<p>For any specific natural number \\(n\\), we can follow this chain from \\(P(1)\\) all the way to \\(P(n)\\), so \\(P(n)\\) must be true.</p>

<div class="viz-placeholder" data-viz="ch12-ladder"></div>

<div class="env-block remark">
<strong>The inductive hypothesis</strong><br>
In the inductive step, we <em>assume</em> that \\(P(k)\\) is true. This assumption is called the <strong>inductive hypothesis</strong>. It is not circular reasoning! We are not assuming what we want to prove. We are proving a conditional statement: <em>if</em> \\(P(k)\\) holds, <em>then</em> \\(P(k+1)\\) must also hold. The base case is what anchors this chain to reality.
</div>

<h3>A Template for Induction Proofs</h3>

<p>Every induction proof follows the same skeleton:</p>

<ol>
<li><strong>State</strong> what \\(P(n)\\) is.</li>
<li><strong>Base case:</strong> Verify \\(P(1)\\) directly.</li>
<li><strong>Inductive step:</strong> Assume \\(P(k)\\) is true (inductive hypothesis). Use this assumption to prove \\(P(k+1)\\).</li>
<li><strong>Conclude:</strong> By the principle of mathematical induction, \\(P(n)\\) is true for all \\(n \\geq 1\\).</li>
</ol>

<div class="env-block warning">
<strong>Common beginner mistake</strong><br>
Do not just verify \\(P(k+1)\\) directly without using the assumption that \\(P(k)\\) is true. The whole point of the inductive step is to show how the truth of \\(P(k)\\) <em>implies</em> the truth of \\(P(k+1)\\). If you never use the inductive hypothesis, you are not doing induction; you are doing something else (and it probably will not work for harder problems).
</div>
`,
            visualizations: [
                {
                    id: 'ch12-ladder',
                    title: 'Climbing the Ladder of Induction',
                    description: 'Each rung represents a value of n. The base case lets you step onto rung 1; the inductive step lets you climb from any rung to the next.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var currentRung = 0; // 0 = on ground, 1 = rung 1, etc.
                        var maxRungs = 10;
                        var rungSpacing = (h - 100) / (maxRungs + 1);
                        var ladderX = w / 2;
                        var ladderWidth = 120;
                        var climberY = h - 40;
                        var targetY = h - 40;
                        var animating = false;

                        VizEngine.createButton(controls, 'Base Case (Step on rung 1)', function() {
                            if (currentRung === 0) {
                                currentRung = 1;
                                targetY = h - 60 - rungSpacing;
                            }
                        });

                        VizEngine.createButton(controls, 'Inductive Step (Climb!)', function() {
                            if (currentRung >= 1 && currentRung < maxRungs) {
                                currentRung++;
                                targetY = h - 60 - currentRung * rungSpacing;
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            currentRung = 0;
                            climberY = h - 40;
                            targetY = h - 40;
                        });

                        viz.animate(function(t) {
                            // Smooth animation
                            climberY += (targetY - climberY) * 0.08;

                            viz.clear();

                            // Draw ladder rails
                            var leftRail = ladderX - ladderWidth / 2;
                            var rightRail = ladderX + ladderWidth / 2;
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 4;
                            ctx.beginPath();
                            ctx.moveTo(leftRail, h - 40);
                            ctx.lineTo(leftRail, 30);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(rightRail, h - 40);
                            ctx.lineTo(rightRail, 30);
                            ctx.stroke();

                            // Dots at top suggesting infinity
                            ctx.fillStyle = '#4a4a7a';
                            for (var d = 0; d < 3; d++) {
                                ctx.beginPath();
                                ctx.arc(ladderX, 20 - d * 8, 2, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Draw rungs
                            for (var i = 1; i <= maxRungs; i++) {
                                var rungY = h - 60 - i * rungSpacing;
                                var reached = i <= currentRung;
                                ctx.strokeStyle = reached ? '#3fb950' : '#30363d';
                                ctx.lineWidth = reached ? 3 : 2;
                                ctx.beginPath();
                                ctx.moveTo(leftRail, rungY);
                                ctx.lineTo(rightRail, rungY);
                                ctx.stroke();

                                // Label
                                ctx.fillStyle = reached ? '#3fb950' : '#8b949e';
                                ctx.font = (reached ? 'bold ' : '') + '13px -apple-system, sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('P(' + i + ')', rightRail + 15, rungY);

                                // Check mark
                                if (reached) {
                                    ctx.fillStyle = '#3fb950';
                                    ctx.font = '16px -apple-system, sans-serif';
                                    ctx.textAlign = 'right';
                                    ctx.fillText('\u2713', leftRail - 10, rungY);
                                }
                            }

                            // Draw climber (circle)
                            ctx.fillStyle = '#58a6ff';
                            ctx.beginPath();
                            ctx.arc(ladderX, climberY - 15, 12, 0, Math.PI * 2);
                            ctx.fill();
                            // Body
                            ctx.strokeStyle = '#58a6ff';
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(ladderX, climberY - 3);
                            ctx.lineTo(ladderX, climberY + 20);
                            ctx.stroke();
                            // Arms
                            ctx.beginPath();
                            ctx.moveTo(ladderX - 15, climberY + 5);
                            ctx.lineTo(ladderX + 15, climberY + 5);
                            ctx.stroke();

                            // Instructions
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            if (currentRung === 0) {
                                ctx.fillText('Start: prove the base case to step onto rung 1', w / 2, h - 5);
                            } else if (currentRung < maxRungs) {
                                ctx.fillText('P(' + currentRung + ') is true! Use the inductive step to reach P(' + (currentRung + 1) + ')', w / 2, h - 5);
                            } else {
                                ctx.fillStyle = '#3fb950';
                                ctx.fillText('You can keep climbing forever! P(n) true for all n.', w / 2, h - 5);
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write down the statement \\(P(n)\\) for the claim "the sum of the first \\(n\\) even numbers is \\(n(n+1)\\)." Verify the base case \\(P(1)\\).',
                    hint: '\\(P(n)\\) says: \\(2 + 4 + 6 + \\cdots + 2n = n(n+1)\\). What happens when \\(n = 1\\)?',
                    solution: '\\(P(1)\\) says \\(2 = 1 \\cdot 2 = 2\\). This is true, so the base case holds.'
                },
                {
                    question: 'In the inductive step, you assume \\(P(k)\\) and try to prove \\(P(k+1)\\). For the formula above, what does \\(P(k+1)\\) look like? What is the connection between \\(P(k+1)\\) and \\(P(k)\\)?',
                    hint: '\\(P(k+1)\\) says the sum of the first \\(k+1\\) even numbers equals \\((k+1)(k+2)\\). The sum of the first \\(k+1\\) even numbers is the sum of the first \\(k\\) even numbers plus \\(2(k+1)\\).',
                    solution: '\\(P(k+1)\\): \\(2 + 4 + \\cdots + 2k + 2(k+1) = (k+1)(k+2)\\). Using the inductive hypothesis \\(P(k)\\), the left side equals \\(k(k+1) + 2(k+1) = (k+1)(k + 2)\\). This matches the right side, so \\(P(k+1)\\) is true.'
                }
            ]
        },

        // ===== Section 2: Classic Induction Proofs =====
        {
            id: 'ch12-sec02',
            title: 'Classic Induction Proofs',
            content: `
<h2>Induction in Action</h2>

<p>Let us work through several classic examples to build your confidence with induction.</p>

<h3>Example 1: Sum of the First n Natural Numbers</h3>

<div class="env-block theorem">
<strong>Theorem (Gauss's Formula)</strong><br>
For all \\(n \\geq 1\\),
\\[1 + 2 + 3 + \\cdots + n = \\frac{n(n+1)}{2}.\\]
</div>

<p><strong>Proof by induction.</strong></p>

<p><em>Base case</em> (\\(n = 1\\)): The left side is \\(1\\). The right side is \\(\\frac{1 \\cdot 2}{2} = 1\\). They agree.</p>

<p><em>Inductive step:</em> Assume \\(P(k)\\) holds, meaning \\(1 + 2 + \\cdots + k = \\frac{k(k+1)}{2}\\). We want to show \\(P(k+1)\\):</p>

\\[1 + 2 + \\cdots + k + (k+1) = \\frac{(k+1)(k+2)}{2}.\\]

<p>Starting from the left side:</p>

\\[\\underbrace{1 + 2 + \\cdots + k}_{= \\frac{k(k+1)}{2} \\text{ by } P(k)} + (k+1) = \\frac{k(k+1)}{2} + (k+1) = \\frac{k(k+1) + 2(k+1)}{2} = \\frac{(k+1)(k+2)}{2}.\\]

<p>This is exactly \\(P(k+1)\\). By induction, the formula holds for all \\(n \\geq 1\\). \\(\\square\\)</p>

<h3>Example 2: Sum of the First n Odd Numbers</h3>

<div class="env-block theorem">
<strong>Theorem</strong><br>
For all \\(n \\geq 1\\),
\\[1 + 3 + 5 + \\cdots + (2n - 1) = n^2.\\]
</div>

<p><em>Base case</em> (\\(n = 1\\)): \\(1 = 1^2\\). True.</p>

<p><em>Inductive step:</em> Assume \\(1 + 3 + \\cdots + (2k - 1) = k^2\\). Then:</p>

\\[1 + 3 + \\cdots + (2k - 1) + (2(k+1) - 1) = k^2 + (2k + 1) = (k+1)^2.\\]

<p>Done. \\(\\square\\)</p>

<div class="viz-placeholder" data-viz="ch12-odd-squares"></div>

<h3>Example 3: A Divisibility Result</h3>

<div class="env-block theorem">
<strong>Theorem</strong><br>
For all \\(n \\geq 1\\), \\(6\\) divides \\(n^3 - n\\).
</div>

<p><em>Base case</em> (\\(n = 1\\)): \\(1^3 - 1 = 0\\), and \\(6\\) divides \\(0\\). True.</p>

<p><em>Inductive step:</em> Assume \\(6 \\mid k^3 - k\\). We need to show \\(6 \\mid (k+1)^3 - (k+1)\\).</p>

\\[(k+1)^3 - (k+1) = k^3 + 3k^2 + 3k + 1 - k - 1 = (k^3 - k) + 3k^2 + 3k = (k^3 - k) + 3k(k+1).\\]

<p>The first term \\(k^3 - k\\) is divisible by 6 (by the inductive hypothesis). The second term \\(3k(k+1)\\) is divisible by 6 because \\(k(k+1)\\) is always even (one of two consecutive integers must be even), so \\(3 \\cdot (\\text{even}) = 6m\\). Therefore the sum is divisible by 6. \\(\\square\\)</p>

<div class="env-block example">
<strong>Check it!</strong><br>
\\(2^3 - 2 = 6\\), \\(3^3 - 3 = 24\\), \\(4^3 - 4 = 60\\), \\(5^3 - 5 = 120\\). Every single one divisible by 6. Not a coincidence!
</div>
`,
            visualizations: [
                {
                    id: 'ch12-odd-squares',
                    title: 'Why Odd Numbers Sum to Perfect Squares',
                    description: 'Drag the slider to see how each new odd number wraps around the previous square to form a larger square. This is a visual proof that 1 + 3 + 5 + ... + (2n-1) = n\u00B2.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;
                        var n = 4;

                        VizEngine.createSlider(controls, 'n', 1, 8, n, 1, function(v) {
                            n = Math.round(v);
                        });

                        function draw() {
                            viz.clear();

                            var maxCellSize = Math.min((w - 100) / 8, (h - 120) / 8);
                            var cellSize = Math.min(maxCellSize, 40);
                            var gridSize = n * cellSize;
                            var startX = (w - gridSize) / 2;
                            var startY = 60;

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('1 + 3 + 5 + ... + ' + (2 * n - 1) + ' = ' + (n * n), w / 2, 30);

                            // Draw the grid, coloring each L-shaped layer
                            var colors = ['#f85149', '#f0883e', '#d29922', '#3fb950', '#3fb9a0', '#58a6ff', '#bc8cff', '#f778ba'];
                            for (var layer = 0; layer < n; layer++) {
                                var color = colors[layer % colors.length];
                                ctx.fillStyle = color;

                                // Bottom row of the L (row = layer)
                                for (var col = 0; col <= layer; col++) {
                                    var x = startX + col * cellSize;
                                    var y = startY + layer * cellSize;
                                    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                }
                                // Right column of the L (col = layer), excluding the corner
                                for (var row = 0; row < layer; row++) {
                                    var x = startX + layer * cellSize;
                                    var y = startY + row * cellSize;
                                    ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                }

                                // Label for this layer
                                var oddNum = 2 * (layer + 1) - 1;
                                ctx.fillStyle = '#f0f6fc';
                                ctx.font = 'bold 12px -apple-system, sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('+' + oddNum, startX + gridSize + 15, startY + layer * cellSize + cellSize / 2);
                            }

                            // Grid lines
                            ctx.strokeStyle = '#0c0c20';
                            ctx.lineWidth = 1;
                            for (var r = 0; r <= n; r++) {
                                ctx.beginPath();
                                ctx.moveTo(startX, startY + r * cellSize);
                                ctx.lineTo(startX + gridSize, startY + r * cellSize);
                                ctx.stroke();
                            }
                            for (var c = 0; c <= n; c++) {
                                ctx.beginPath();
                                ctx.moveTo(startX + c * cellSize, startY);
                                ctx.lineTo(startX + c * cellSize, startY + gridSize);
                                ctx.stroke();
                            }

                            // Result label
                            ctx.fillStyle = '#58a6ff';
                            ctx.font = 'bold 15px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(n + ' \u00D7 ' + n + ' = ' + (n * n) + ' cells total', w / 2, startY + gridSize + 30);

                            // Sum string
                            var sumParts = [];
                            for (var i = 1; i <= n; i++) sumParts.push(2 * i - 1);
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.fillText(sumParts.join(' + ') + ' = ' + (n * n), w / 2, startY + gridSize + 55);
                        }

                        viz.animate(function() { draw(); });
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove by induction that for all \\(n \\geq 1\\), \\(1^2 + 2^2 + 3^2 + \\cdots + n^2 = \\frac{n(n+1)(2n+1)}{6}\\).',
                    hint: 'For the inductive step, add \\((k+1)^2\\) to both sides of the assumed identity, then simplify the right side into \\(\\frac{(k+1)(k+2)(2k+3)}{6}\\).',
                    solution: '<strong>Base case:</strong> \\(n = 1\\): \\(1 = \\frac{1 \\cdot 2 \\cdot 3}{6} = 1\\). True.<br><strong>Inductive step:</strong> Assume \\(1^2 + \\cdots + k^2 = \\frac{k(k+1)(2k+1)}{6}\\). Then \\(1^2 + \\cdots + k^2 + (k+1)^2 = \\frac{k(k+1)(2k+1)}{6} + (k+1)^2 = \\frac{k(k+1)(2k+1) + 6(k+1)^2}{6} = \\frac{(k+1)[k(2k+1) + 6(k+1)]}{6} = \\frac{(k+1)(2k^2 + 7k + 6)}{6} = \\frac{(k+1)(k+2)(2k+3)}{6}\\). This is exactly the formula with \\(n = k+1\\). \\(\\square\\)'
                },
                {
                    question: 'Prove by induction that \\(n! \\geq 2^{n-1}\\) for all \\(n \\geq 1\\).',
                    hint: 'In the inductive step, you need to show \\((k+1)! \\geq 2^k\\). Note that \\((k+1)! = (k+1) \\cdot k!\\) and \\(k+1 \\geq 2\\) when \\(k \\geq 1\\).',
                    solution: '<strong>Base case:</strong> \\(n = 1\\): \\(1! = 1 \\geq 2^0 = 1\\). True.<br><strong>Inductive step:</strong> Assume \\(k! \\geq 2^{k-1}\\). Then \\((k+1)! = (k+1) \\cdot k! \\geq (k+1) \\cdot 2^{k-1} \\geq 2 \\cdot 2^{k-1} = 2^k\\), where the last inequality uses \\(k+1 \\geq 2\\) (true for \\(k \\geq 1\\)). \\(\\square\\)'
                }
            ]
        },

        // ===== Section 3: Strong Induction =====
        {
            id: 'ch12-sec03',
            title: 'Strong Induction',
            content: `
<h2>When You Need More Than Just the Previous Step</h2>

<p>Sometimes, proving \\(P(k+1)\\) requires knowing not just \\(P(k)\\), but also \\(P(k-1)\\), \\(P(k-2)\\), or even earlier cases. This is where <strong>strong induction</strong> comes in.</p>

<div class="env-block definition">
<strong>Strong Induction</strong><br>
To prove \\(P(n)\\) for all \\(n \\geq 1\\), it suffices to prove:
<ol>
<li><strong>Base case:</strong> \\(P(1)\\) is true (sometimes you need a few base cases).</li>
<li><strong>Strong inductive step:</strong> For every \\(k \\geq 1\\), if \\(P(1), P(2), \\ldots, P(k)\\) are all true, then \\(P(k+1)\\) is also true.</li>
</ol>
</div>

<p>In ordinary induction, the inductive hypothesis says "assume \\(P(k)\\) is true." In strong induction, the hypothesis says "assume \\(P(j)\\) is true for <em>all</em> \\(j\\) from 1 to \\(k\\)." You get to use any or all of the previous cases.</p>

<div class="env-block intuition">
<strong>Analogy</strong><br>
Ordinary induction is like a ladder: you need the rung directly below you to step up. Strong induction is like a scaffold: you can reach down to <em>any</em> rung below you for support.
</div>

<h3>The Postage Stamp Problem</h3>

<div class="env-block theorem">
<strong>Theorem</strong><br>
Every integer amount of postage \\(\\geq 12\\) cents can be made using only 4-cent and 5-cent stamps.
</div>

<p><em>Proof by strong induction.</em></p>

<p>Let \\(P(n)\\) be the statement: "\\(n\\) cents of postage can be made with 4-cent and 5-cent stamps." We want to prove \\(P(n)\\) for all \\(n \\geq 12\\).</p>

<p><em>Base cases:</em></p>
<ul>
<li>\\(P(12)\\): \\(12 = 4 + 4 + 4\\) (three 4-cent stamps). True.</li>
<li>\\(P(13)\\): \\(13 = 4 + 4 + 5\\). True.</li>
<li>\\(P(14)\\): \\(14 = 4 + 5 + 5\\). True.</li>
<li>\\(P(15)\\): \\(15 = 5 + 5 + 5\\). True.</li>
</ul>

<p><em>Strong inductive step:</em> Let \\(k \\geq 15\\) and assume \\(P(j)\\) is true for all \\(12 \\leq j \\leq k\\). We want to show \\(P(k+1)\\).</p>

<p>Since \\(k \\geq 15\\), we know \\(k + 1 \\geq 16\\), so \\(k + 1 - 4 \\geq 12\\). Therefore \\(P(k-3)\\) is true by the inductive hypothesis. This means \\(k - 3\\) cents can be made with 4-cent and 5-cent stamps. Adding one more 4-cent stamp gives \\(k - 3 + 4 = k + 1\\) cents. So \\(P(k+1)\\) is true. \\(\\square\\)</p>

<div class="env-block remark">
<strong>Why we needed 4 base cases</strong><br>
In the inductive step, we used \\(P(k-3)\\) rather than \\(P(k)\\). This means we "reached back" 4 steps. To make sure we always have a valid case to reach back to, we needed to verify 4 consecutive base cases (12, 13, 14, 15). If we had only checked \\(P(12)\\), the argument for \\(P(13)\\) would try to use \\(P(9)\\), which we never established.
</div>

<h3>Strong Induction for Fibonacci-like Problems</h3>

<p>Strong induction is especially natural for problems involving recursion. For example, every Fibonacci number \\(F_n\\) satisfies \\(F_n = F_{n-1} + F_{n-2}\\). To prove something about \\(F_n\\), you typically need to know about both \\(F_{n-1}\\) and \\(F_{n-2}\\), so strong induction is the right tool.</p>

<div class="viz-placeholder" data-viz="ch12-proof-builder"></div>
`,
            visualizations: [
                {
                    id: 'ch12-proof-builder',
                    title: 'Interactive Induction Proof Builder',
                    description: 'Choose a statement and walk through the induction proof step by step. Verify the base case, state the inductive hypothesis, and complete the inductive step.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var statements = [
                            {
                                name: 'Sum 1+2+...+n = n(n+1)/2',
                                pn: function(n) { return n * (n + 1) / 2; },
                                sum: function(n) { var s = 0; for (var i = 1; i <= n; i++) s += i; return s; },
                                display: function(n) { return 'P(' + n + '): sum = ' + (n * (n + 1) / 2); }
                            },
                            {
                                name: 'Sum of odd = n\u00B2',
                                pn: function(n) { return n * n; },
                                sum: function(n) { var s = 0; for (var i = 0; i < n; i++) s += (2 * i + 1); return s; },
                                display: function(n) { return 'P(' + n + '): sum = ' + (n * n); }
                            },
                            {
                                name: '6 | (n\u00B3 - n)',
                                pn: function(n) { return (n * n * n - n) % 6 === 0; },
                                sum: function(n) { return n * n * n - n; },
                                display: function(n) { return 'P(' + n + '): ' + n + '\u00B3-' + n + '=' + (n*n*n-n) + (((n*n*n-n)%6===0)?' \u2713':' \u2717'); }
                            }
                        ];

                        var currentStmt = 0;
                        var step = 0; // 0 = overview, 1 = base case, 2 = hypothesis, 3 = inductive step, 4 = conclusion
                        var maxSteps = 4;

                        VizEngine.createButton(controls, 'Next Statement', function() {
                            currentStmt = (currentStmt + 1) % statements.length;
                            step = 0;
                        });

                        VizEngine.createButton(controls, 'Next Step', function() {
                            if (step < maxSteps) step++;
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0;
                        });

                        var stepLabels = ['Choose Statement', 'Base Case P(1)', 'Inductive Hypothesis', 'Inductive Step', 'Conclusion'];
                        var stepColors = ['#8b949e', '#58a6ff', '#f0883e', '#3fb950', '#bc8cff'];

                        viz.animate(function(t) {
                            viz.clear();

                            var stmt = statements[currentStmt];

                            // Header
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Induction Proof Builder', w / 2, 25);

                            ctx.fillStyle = '#58a6ff';
                            ctx.font = '14px -apple-system, sans-serif';
                            ctx.fillText('Statement: ' + stmt.name, w / 2, 50);

                            // Progress bar
                            var barW = w - 100;
                            var barH = 8;
                            var barX = 50;
                            var barY = 70;
                            ctx.fillStyle = '#1a1a40';
                            ctx.fillRect(barX, barY, barW, barH);
                            ctx.fillStyle = stepColors[step];
                            ctx.fillRect(barX, barY, barW * (step / maxSteps), barH);

                            // Step indicators
                            for (var s = 0; s <= maxSteps; s++) {
                                var sx = barX + barW * (s / maxSteps);
                                ctx.fillStyle = s <= step ? stepColors[Math.min(s, maxSteps - 1)] : '#30363d';
                                ctx.beginPath();
                                ctx.arc(sx, barY + barH / 2, 6, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Step label
                            ctx.fillStyle = stepColors[step];
                            ctx.font = 'bold 15px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Step ' + step + ': ' + stepLabels[step], w / 2, 110);

                            // Content area
                            var contentY = 140;
                            ctx.font = '14px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            var leftM = 40;

                            if (step >= 0) {
                                // Show verified values
                                ctx.fillStyle = '#8b949e';
                                ctx.fillText('Checking values:', leftM, contentY);
                                contentY += 25;
                                var maxCheck = step >= 1 ? 6 : 3;
                                for (var n = 1; n <= maxCheck; n++) {
                                    var val = stmt.sum(n);
                                    var expected = typeof stmt.pn(n) === 'boolean' ? (stmt.pn(n) ? 'true' : 'false') : stmt.pn(n);
                                    var match = typeof stmt.pn(n) === 'boolean' ? stmt.pn(n) : (val === expected);
                                    ctx.fillStyle = match ? '#3fb950' : '#f85149';
                                    ctx.fillText(stmt.display(n), leftM + 20, contentY);
                                    contentY += 20;
                                }
                            }

                            contentY = Math.max(contentY + 10, 270);

                            if (step >= 1) {
                                ctx.fillStyle = '#58a6ff';
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.fillText('\u2713 Base Case: P(1) verified', leftM, contentY);
                                contentY += 25;
                            }

                            if (step >= 2) {
                                ctx.fillStyle = '#f0883e';
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.fillText('Assume P(k) is true (inductive hypothesis)', leftM, contentY);
                                contentY += 25;
                            }

                            if (step >= 3) {
                                ctx.fillStyle = '#3fb950';
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.fillText('\u2713 Show P(k) implies P(k+1)', leftM, contentY);
                                contentY += 25;
                            }

                            if (step >= 4) {
                                ctx.fillStyle = '#bc8cff';
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.fillText('\u2713 By induction, P(n) true for all n \u2265 1', leftM, contentY);

                                // Celebration
                                var elapsed = (t % 3000) / 3000;
                                for (var i = 0; i < 8; i++) {
                                    var angle = Math.PI * 2 * i / 8 + elapsed * Math.PI * 2;
                                    var px = w / 2 + Math.cos(angle) * 60;
                                    var py = h - 40 + Math.sin(angle) * 20;
                                    ctx.fillStyle = VizEngine.hsl((i * 45 + t * 0.05) % 360, 70, 60);
                                    ctx.beginPath();
                                    ctx.arc(px, py, 4, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use strong induction to prove that every integer \\(n \\geq 2\\) is either prime or a product of primes.',
                    hint: 'For the inductive step: if \\(k+1\\) is prime, you are done. If not, then \\(k+1 = ab\\) where \\(2 \\leq a, b \\leq k\\). Apply the inductive hypothesis to \\(a\\) and \\(b\\).',
                    solution: '<strong>Base case:</strong> \\(n = 2\\) is prime, so it is a prime or product of primes.<br><strong>Strong inductive step:</strong> Assume every integer from 2 to \\(k\\) is prime or a product of primes. Consider \\(k+1\\). Either \\(k+1\\) is prime (and we are done) or \\(k+1 = ab\\) for some \\(2 \\leq a, b \\leq k\\). By the strong inductive hypothesis, both \\(a\\) and \\(b\\) are products of primes. Therefore \\(k+1 = ab\\) is also a product of primes. \\(\\square\\)'
                },
                {
                    question: 'Explain why the postage stamp theorem requires the stamps to be 4-cent and 5-cent (or any pair whose GCD is 1). Would 4-cent and 6-cent stamps work to make every sufficiently large amount?',
                    hint: 'What amounts can you never make with 4-cent and 6-cent stamps?',
                    solution: 'No. With 4-cent and 6-cent stamps, any amount you make is \\(4a + 6b = 2(2a + 3b)\\), which is always even. You can never make an odd amount like 13, 15, or 17 cents. The theorem works for 4 and 5 because \\(\\gcd(4, 5) = 1\\), so by a number theory result (the Chicken McNugget theorem), all sufficiently large integers can be represented. In general, \\(\\gcd(4, 6) = 2 \\neq 1\\), so not all large integers are reachable.'
                }
            ]
        },

        // ===== Section 4: Common Mistakes =====
        {
            id: 'ch12-sec04',
            title: 'Common Mistakes',
            content: `
<h2>Traps, Pitfalls, and Fake Proofs</h2>

<p>Induction is a powerful tool, but it is also easy to misuse. Let us look at the most common mistakes, including some famous "proofs" that look convincing but are completely wrong.</p>

<h3>Mistake 1: Forgetting the Base Case</h3>

<div class="env-block warning">
<strong>The "All Horses Are the Same Color" Fallacy</strong><br>
<em>Claim:</em> All horses are the same color.<br><br>
<em>"Proof":</em> Let \\(P(n)\\) be "in any group of \\(n\\) horses, all have the same color."<br>
<em>Base case</em> \\(P(1)\\): A group of 1 horse trivially has all horses the same color. True.<br>
<em>Inductive step:</em> Assume \\(P(k)\\). Consider a group of \\(k+1\\) horses: \\(\\{h_1, h_2, \\ldots, h_{k+1}\\}\\). By \\(P(k)\\), the first \\(k\\) horses \\(\\{h_1, \\ldots, h_k\\}\\) are all the same color. Also by \\(P(k)\\), the last \\(k\\) horses \\(\\{h_2, \\ldots, h_{k+1}\\}\\) are all the same color. These two groups overlap (they share \\(h_2, \\ldots, h_k\\)), so all \\(k+1\\) horses must be the same color.
</div>

<p>This "proof" looks airtight. Where is the error?</p>

<p>The flaw is in the step from \\(P(1)\\) to \\(P(2)\\). When \\(k = 1\\), the "first \\(k\\)" horses is \\(\\{h_1\\}\\) and the "last \\(k\\)" horses is \\(\\{h_2\\}\\). These two sets do <strong>not</strong> overlap! There is no shared horse to force them to have the same color. The inductive step genuinely works for \\(k \\geq 2\\), but it fails at the critical first step.</p>

<div class="env-block remark">
<strong>Lesson</strong><br>
The base case is not a formality. Sometimes the inductive step works for all \\(k\\) above a certain threshold, but the base case is the bridge that connects the step to reality. If the bridge is missing, the entire argument collapses.
</div>

<h3>Mistake 2: Not Actually Using the Inductive Hypothesis</h3>

<p>Some students "prove" \\(P(k+1)\\) by algebraic manipulation that never uses the assumption \\(P(k)\\). This is like saying "each domino knocks down the next" without actually having the dominoes touch each other. Even if \\(P(k+1)\\) happens to be true, you have not shown the <em>connection</em> between \\(P(k)\\) and \\(P(k+1)\\).</p>

<h3>Mistake 3: Circular Reasoning</h3>

<p>In the inductive step, you start with the left-hand side of \\(P(k+1)\\) and manipulate it until you reach the right-hand side. A common error is to start by <em>assuming</em> \\(P(k+1)\\) is true and then "showing" it leads to something true. That is circular! You must start from what you know (\\(P(k)\\) and the structure of the problem) and <em>derive</em> \\(P(k+1)\\).</p>

<h3>Mistake 4: Wrong Base Case</h3>

<p>Some formulas only hold starting from a certain value. For example, \\(2^n \\gt n^2\\) is not true for \\(n = 2\\) (since \\(4 \\not\\gt 4\\)) or \\(n = 3\\) (since \\(8 \\not\\gt 9\\)), but it is true for all \\(n \\geq 5\\). If your base case starts at the wrong value, the whole proof is invalid.</p>

<div class="env-block example">
<strong>A Correct "Wrong Start"</strong><br>
The inequality \\(2^n \\gt n^2\\) for \\(n \\geq 5\\) can be proved by induction with base case \\(n = 5\\): \\(32 \\gt 25\\). The inductive step (from \\(k\\) to \\(k+1\\), for \\(k \\geq 5\\)) uses the fact that \\(2 \\cdot k^2 \\gt (k+1)^2\\) when \\(k \\geq 5\\), which requires a bit of algebra.
</div>

<h3>A Diagnostic Checklist</h3>

<p>Before submitting an induction proof, ask yourself:</p>

<ol>
<li>Did I clearly state \\(P(n)\\)?</li>
<li>Did I verify the correct base case?</li>
<li>In the inductive step, did I clearly state the assumption \\(P(k)\\)?</li>
<li>Did I actually <em>use</em> the assumption \\(P(k)\\) somewhere in the proof of \\(P(k+1)\\)?</li>
<li>Did I go in the right direction (deriving \\(P(k+1)\\) from \\(P(k)\\), not the other way around)?</li>
</ol>

<div class="viz-placeholder" data-viz="ch12-mistake-demo"></div>
`,
            visualizations: [
                {
                    id: 'ch12-mistake-demo',
                    title: 'Spot the Error',
                    description: 'A faulty induction proof is displayed. Can you spot where it goes wrong? Click through to reveal the bug.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var scenarios = [
                            {
                                title: 'All horses are the same color',
                                lines: [
                                    'P(n): In any group of n horses, all same color.',
                                    'Base: P(1) trivially true.',
                                    'Step: Assume P(k). Take k+1 horses.',
                                    'First k share a color (by P(k)).',
                                    'Last k share a color (by P(k)).',
                                    'Overlap forces all k+1 same color.'
                                ],
                                errorLine: 5,
                                errorMsg: 'When k=1: {h1} and {h2} do NOT overlap! No shared horse exists.'
                            },
                            {
                                title: 'All numbers are equal',
                                lines: [
                                    'P(n): For all a,b with max(a,b)=n, a=b.',
                                    'Base: P(0). max(a,b)=0 means a=b=0. True.',
                                    'Step: Assume P(k). Let max(a,b)=k+1.',
                                    'Then max(a-1,b-1)=k.',
                                    'By P(k), a-1=b-1, so a=b.'
                                ],
                                errorLine: 3,
                                errorMsg: 'When k=0: if max(a,b)=1, a-1 or b-1 could be negative. P(0) does not apply.'
                            }
                        ];

                        var currentScenario = 0;
                        var revealed = false;

                        VizEngine.createButton(controls, 'Reveal Error', function() {
                            revealed = true;
                        });

                        VizEngine.createButton(controls, 'Next Example', function() {
                            currentScenario = (currentScenario + 1) % scenarios.length;
                            revealed = false;
                        });

                        viz.animate(function(t) {
                            viz.clear();
                            var sc = scenarios[currentScenario];

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Faulty Proof: "' + sc.title + '"', w / 2, 30);

                            ctx.fillStyle = '#8b949e';
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.fillText('Can you spot the error before clicking "Reveal Error"?', w / 2, 52);

                            // Lines
                            var lineY = 85;
                            var lineH = 30;
                            ctx.textAlign = 'left';
                            for (var i = 0; i < sc.lines.length; i++) {
                                var isError = (i === sc.errorLine) && revealed;
                                if (isError) {
                                    ctx.fillStyle = '#f8514933';
                                    ctx.fillRect(30, lineY - 12, w - 60, lineH);
                                    ctx.fillStyle = '#f85149';
                                } else {
                                    ctx.fillStyle = '#c9d1d9';
                                }
                                ctx.font = '14px -apple-system, sans-serif';
                                ctx.fillText(sc.lines[i], 45, lineY + 5);
                                lineY += lineH;
                            }

                            // Error explanation
                            if (revealed) {
                                lineY += 15;
                                ctx.fillStyle = '#f85149';
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('BUG FOUND:', w / 2, lineY);
                                lineY += 22;
                                ctx.fillStyle = '#f0883e';
                                ctx.font = '13px -apple-system, sans-serif';

                                // Word wrap the error message
                                var words = sc.errorMsg.split(' ');
                                var line = '';
                                for (var wi = 0; wi < words.length; wi++) {
                                    var test = line + words[wi] + ' ';
                                    if (ctx.measureText(test).width > w - 100) {
                                        ctx.fillText(line.trim(), w / 2, lineY);
                                        lineY += 20;
                                        line = words[wi] + ' ';
                                    } else {
                                        line = test;
                                    }
                                }
                                if (line.trim()) ctx.fillText(line.trim(), w / 2, lineY);
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the error in this "proof": For all \\(n \\geq 1\\), \\(n = n + 1\\). <br>Base case: Assume the statement holds for some \\(n = k\\), so \\(k = k + 1\\). Adding 1 to both sides: \\(k + 1 = k + 2\\), which is \\(P(k+1)\\). By induction, \\(n = n + 1\\) for all \\(n\\).',
                    hint: 'Where is the base case?',
                    solution: 'There is no base case! The "proof" jumps straight to the inductive step without ever verifying \\(P(1)\\): \\(1 = 2\\), which is obviously false. Without a valid base case, the chain of implications has no starting point. You can prove any implication \\(P(k) \\Rightarrow P(k+1)\\) if \\(P(k)\\) is always false (a false hypothesis makes the implication vacuously true).'
                },
                {
                    question: 'Explain why the "all horses" proof works perfectly fine when \\(k \\geq 2\\) but fails at \\(k = 1\\). What is special about groups of size 2?',
                    hint: 'When \\(k = 2\\), the "first \\(k\\)" is \\(\\{h_1, h_2\\}\\) and the "last \\(k\\)" is \\(\\{h_2, h_3\\}\\). Do they overlap?',
                    solution: 'When \\(k = 2\\), the first 2 horses \\(\\{h_1, h_2\\}\\) overlap with the last 2 horses \\(\\{h_2, h_3\\}\\) at \\(h_2\\). So the argument works: if \\(P(2)\\) were true, it would imply \\(P(3)\\). Similarly for all larger \\(k\\). The problem is specifically at \\(k = 1\\): groups of size 1 have no overlap. Since \\(P(2)\\) (any 2 horses have the same color) is false, the chain never gets started.'
                }
            ]
        }
    ]
});
})();
