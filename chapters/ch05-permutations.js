// === Chapter 5: Permutations — Order Matters ===
(function () {
    window.CHAPTERS = window.CHAPTERS || [];

    window.CHAPTERS.push({
        id: 'ch05',
        number: 5,
        title: 'Permutations \u2014 Order Matters',
        subtitle: 'Arranging objects in every possible order, and discovering how fast counting can explode',
        file: 'ch05-permutations',

        sections: [
            // ============================================================
            // Section 1: Arranging objects
            // ============================================================
            {
                id: 'arranging-objects',
                title: 'Arranging Objects',
                content: `
<h2>The Difference Between Choosing and Arranging</h2>

<p>In the previous chapter, we learned to count choices. Now we ask a subtler question: <em>how many ways can you arrange things in a row?</em></p>

<p>Consider three colored blocks: <span style="color:#f85149;">Red</span>, <span style="color:#3fb950;">Green</span>, <span style="color:#58a6ff;">Blue</span>. If you line them up, how many different orderings are possible?</p>

<p>Let us list them: RGB, RBG, GRB, GBR, BRG, BGR. That is 6 arrangements. Each arrangement is called a <strong>permutation</strong>.</p>

<div class="env-block definition">
<strong>Permutation.</strong> A permutation of a set of objects is an arrangement of those objects in a definite order. Two permutations are different if at least one object is in a different position.
</div>

<p>Why 6? By the Multiplication Principle from Chapter 4:</p>
<ul>
<li>First position: 3 choices (any of the 3 blocks)</li>
<li>Second position: 2 choices (whichever blocks remain)</li>
<li>Third position: 1 choice (the last remaining block)</li>
</ul>
<p>Total: \\(3 \\times 2 \\times 1 = 6\\).</p>

<p>Try it yourself in the visualization below. Drag the colored blocks into the slots and watch all possible permutations appear.</p>

<div class="viz-placeholder" data-viz="viz-block-arrange"></div>

<h3>Order matters!</h3>

<p>The word "permutation" emphasizes that <strong>order matters</strong>. The arrangement RGB is different from BRG, even though they use the same three blocks. This distinguishes permutations from <em>combinations</em> (which we will study in the next chapter), where order does not matter.</p>

<div class="env-block example">
<strong>Real-world example.</strong> The combination lock on your locker should really be called a "permutation lock." The code 1-5-3 is different from 3-5-1. Order matters; it is a permutation, not a combination.
</div>
`,
                visualizations: [
                    {
                        id: 'viz-block-arrange',
                        title: 'Permutation Generator',
                        description: 'See all permutations of colored blocks. Adjust the number of blocks to watch the count grow. Each row is one permutation.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var n = 3;
                            var blockColors = [
                                viz.colors.red, viz.colors.green, viz.colors.blue,
                                viz.colors.orange, viz.colors.purple, viz.colors.teal,
                                viz.colors.yellow
                            ];
                            var blockLabels = ['R', 'G', 'B', 'O', 'P', 'T', 'Y'];
                            var perms = [];
                            var animIdx = 0;
                            var animTimer = null;
                            var showAll = false;

                            function factorial(k) {
                                var r = 1;
                                for (var i = 2; i <= k; i++) r *= i;
                                return r;
                            }

                            function generatePerms(k) {
                                var arr = [];
                                for (var i = 0; i < k; i++) arr.push(i);
                                var result = [];
                                function permute(start) {
                                    if (start === k) { result.push(arr.slice()); return; }
                                    for (var i = start; i < k; i++) {
                                        var tmp = arr[start]; arr[start] = arr[i]; arr[i] = tmp;
                                        permute(start + 1);
                                        tmp = arr[start]; arr[start] = arr[i]; arr[i] = tmp;
                                    }
                                }
                                permute(0);
                                return result;
                            }

                            function rebuild() {
                                perms = n <= 6 ? generatePerms(n) : [];
                                animIdx = 0;
                                showAll = false;
                                if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            }

                            function draw() {
                                viz.clear();
                                var blockW = Math.min(36, (w - 60) / n);
                                var blockH = 28;

                                // Title info
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(n + ' blocks: ' + n + '! = ' + factorial(n) + ' permutations', w / 2, 22);

                                // Show source blocks
                                var srcY = 44;
                                var srcStartX = (w - n * (blockW + 4)) / 2;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Blocks:', srcStartX - 30, srcY + blockH / 2 + 3);
                                for (var bi = 0; bi < n; bi++) {
                                    var bx = srcStartX + bi * (blockW + 4);
                                    ctx.fillStyle = blockColors[bi];
                                    ctx.beginPath();
                                    ctx.roundRect(bx, srcY, blockW, blockH, 4);
                                    ctx.fill();
                                    ctx.fillStyle = '#000';
                                    ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(blockLabels[bi], bx + blockW / 2, srcY + blockH / 2);
                                }

                                // Show permutations
                                if (perms.length === 0 && n > 6) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'alphabetic';
                                    ctx.fillText(n + '! = ' + factorial(n) + ' permutations (too many to display)', w / 2, h / 2);
                                    return;
                                }

                                var listY = srcY + blockH + 20;
                                var rowH = Math.min(22, (h - listY - 30) / Math.min(perms.length, 40));
                                var maxVisible = Math.min(perms.length, Math.floor((h - listY - 30) / rowH));
                                var displayCount = showAll ? maxVisible : Math.min(animIdx + 1, maxVisible);
                                var permBlockW = Math.min(28, (w * 0.5) / n);

                                for (var pi = 0; pi < displayCount && pi < perms.length; pi++) {
                                    var py = listY + pi * rowH;
                                    var perm = perms[pi];
                                    var isCurrent = (!showAll && pi === animIdx);

                                    // Row number
                                    ctx.fillStyle = isCurrent ? viz.colors.gold : viz.colors.text;
                                    ctx.font = (isCurrent ? 'bold ' : '') + '10px monospace';
                                    ctx.textAlign = 'right';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText((pi + 1) + '.', (w - n * (permBlockW + 2)) / 2 - 8, py + rowH / 2);

                                    // Blocks
                                    var rowStartX = (w - n * (permBlockW + 2)) / 2;
                                    for (var bj = 0; bj < n; bj++) {
                                        var idx = perm[bj];
                                        var rx = rowStartX + bj * (permBlockW + 2);
                                        ctx.fillStyle = blockColors[idx] + (isCurrent ? 'ff' : '88');
                                        ctx.beginPath();
                                        ctx.roundRect(rx, py + 1, permBlockW, rowH - 2, 3);
                                        ctx.fill();
                                        if (rowH >= 16) {
                                            ctx.fillStyle = '#000';
                                            ctx.font = '9px -apple-system,sans-serif';
                                            ctx.textAlign = 'center';
                                            ctx.textBaseline = 'middle';
                                            ctx.fillText(blockLabels[idx], rx + permBlockW / 2, py + rowH / 2);
                                        }
                                    }
                                }

                                // Count shown
                                if (perms.length > maxVisible) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'alphabetic';
                                    ctx.fillText('(showing ' + maxVisible + ' of ' + perms.length + ')', w / 2, h - 8);
                                }
                            }

                            VizEngine.createSlider(controls, 'Blocks', 2, 7, 3, 1, function (val) {
                                n = Math.round(val);
                                rebuild();
                                draw();
                            });

                            VizEngine.createButton(controls, 'Animate', function () {
                                showAll = false;
                                animIdx = 0;
                                if (animTimer) clearInterval(animTimer);
                                animTimer = setInterval(function () {
                                    animIdx++;
                                    draw();
                                    if (animIdx >= perms.length - 1) {
                                        clearInterval(animTimer);
                                        animTimer = null;
                                    }
                                }, 120);
                                draw();
                            });

                            VizEngine.createButton(controls, 'Show All', function () {
                                showAll = true;
                                animIdx = perms.length - 1;
                                if (animTimer) { clearInterval(animTimer); animTimer = null; }
                                draw();
                            });

                            VizEngine.createButton(controls, 'Reset', function () {
                                rebuild();
                                draw();
                            });

                            rebuild();
                            draw();
                            return { stopAnimation: function () { if (animTimer) { clearInterval(animTimer); animTimer = null; } } };
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'How many ways can 4 students line up for a photo?',
                        hint: 'Apply the Multiplication Principle: first position has 4 choices, second has 3, ...',
                        solution: '\\(4 \\times 3 \\times 2 \\times 1 = 4! = 24\\) ways.'
                    },
                    {
                        question: 'A bookshelf has 5 different books. You want to arrange all 5 on the shelf. How many arrangements?',
                        hint: 'This is a permutation of 5 objects.',
                        solution: '\\(5! = 120\\) arrangements.'
                    }
                ]
            },

            // ============================================================
            // Section 2: Factorial — the counting explosion
            // ============================================================
            {
                id: 'factorial',
                title: 'Factorial \u2014 The Counting Explosion',
                content: `
<h2>A Number That Grows Unbelievably Fast</h2>

<p>The pattern \\(3 \\times 2 \\times 1 = 6\\) that we just saw has a name and a notation:</p>

<div class="env-block definition">
<strong>Factorial.</strong> For a positive integer \\(n\\), the factorial of \\(n\\) is:
\\[
n! = n \\times (n-1) \\times (n-2) \\times \\cdots \\times 2 \\times 1
\\]
By convention, \\(0! = 1\\) (the "empty product").
</div>

<p>The first few values:</p>

<table style="width:auto; border-collapse:collapse; margin:16px 0;">
<tr style="border-bottom:1px solid #30363d;">
<th style="padding:6px 16px; color:#8b949e;">\\(n\\)</th>
<th style="padding:6px 16px; color:#8b949e;">\\(n!\\)</th>
</tr>
<tr><td style="padding:4px 16px;">0</td><td style="padding:4px 16px;">1</td></tr>
<tr><td style="padding:4px 16px;">1</td><td style="padding:4px 16px;">1</td></tr>
<tr><td style="padding:4px 16px;">2</td><td style="padding:4px 16px;">2</td></tr>
<tr><td style="padding:4px 16px;">3</td><td style="padding:4px 16px;">6</td></tr>
<tr><td style="padding:4px 16px;">4</td><td style="padding:4px 16px;">24</td></tr>
<tr><td style="padding:4px 16px;">5</td><td style="padding:4px 16px;">120</td></tr>
<tr><td style="padding:4px 16px;">6</td><td style="padding:4px 16px;">720</td></tr>
<tr><td style="padding:4px 16px;">7</td><td style="padding:4px 16px;">5,040</td></tr>
<tr><td style="padding:4px 16px;">10</td><td style="padding:4px 16px;">3,628,800</td></tr>
<tr><td style="padding:4px 16px;">13</td><td style="padding:4px 16px;">6,227,020,800</td></tr>
<tr><td style="padding:4px 16px;">20</td><td style="padding:4px 16px;">2,432,902,008,176,640,000</td></tr>
</table>

<p>\\(20!\\) is already larger than 2 quintillion. \\(52!\\) (the number of ways to shuffle a deck of cards) has 68 digits. This explosive growth is why permutation problems can have astonishingly large answers even for modest \\(n\\).</p>

<div class="viz-placeholder" data-viz="viz-factorial-growth"></div>

<h3>Why \\(0! = 1\\)?</h3>

<p>This is a convention, but a well-motivated one. There is exactly <em>one</em> way to arrange zero objects: do nothing. It is the "empty arrangement." Defining \\(0! = 1\\) also makes the factorial formula \\(n! = n \\cdot (n-1)!\\) work for \\(n = 1\\): \\(1! = 1 \\cdot 0! = 1 \\cdot 1 = 1\\).</p>

<div class="env-block remark">
<strong>Stirling's approximation.</strong> For large \\(n\\), there is a beautiful approximation:
\\[
n! \\approx \\sqrt{2\\pi n} \\left(\\frac{n}{e}\\right)^n
\\]
This tells us that \\(\\ln(n!) \\approx n \\ln n - n\\), confirming that factorial growth is faster than exponential growth but slower than double-exponential.
</div>
`,
                visualizations: [
                    {
                        id: 'viz-factorial-growth',
                        title: 'Factorial Growth: n! vs 2\u207F vs n\u00B2',
                        description: 'Compare how fast n! grows compared to other common functions. Use the slider to adjust the range.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var maxN = 8;

                            function factorial(k) {
                                var r = 1;
                                for (var i = 2; i <= k; i++) r *= i;
                                return r;
                            }

                            function draw() {
                                viz.clear();
                                var padL = 70, padR = 30, padT = 40, padB = 50;
                                var plotW = w - padL - padR;
                                var plotH = h - padT - padB;

                                // Compute values
                                var factVals = [], expVals = [], quadVals = [];
                                var yMax = 0;
                                for (var i = 0; i <= maxN; i++) {
                                    var fv = factorial(i);
                                    var ev = Math.pow(2, i);
                                    var qv = i * i;
                                    factVals.push(fv);
                                    expVals.push(ev);
                                    quadVals.push(qv);
                                    yMax = Math.max(yMax, fv);
                                }
                                yMax = yMax * 1.1;

                                function toSx(n) { return padL + (n / maxN) * plotW; }
                                function toSy(val) { return padT + (1 - val / yMax) * plotH; }

                                // Grid
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                for (var gy = 0; gy <= 5; gy++) {
                                    var yVal = (gy / 5) * yMax;
                                    var sy = toSy(yVal);
                                    ctx.beginPath(); ctx.moveTo(padL, sy); ctx.lineTo(w - padR, sy); ctx.stroke();
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'right';
                                    ctx.textBaseline = 'middle';
                                    var label = yVal >= 1000 ? Math.round(yVal / 1000) + 'k' : Math.round(yVal).toString();
                                    ctx.fillText(label, padL - 8, sy);
                                }

                                // X axis labels
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                for (var xi = 0; xi <= maxN; xi++) {
                                    ctx.fillText(xi.toString(), toSx(xi), padT + plotH + 8);
                                }
                                ctx.fillText('n', padL + plotW / 2, padT + plotH + 26);

                                // Axes
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath(); ctx.moveTo(padL, padT); ctx.lineTo(padL, padT + plotH); ctx.lineTo(w - padR, padT + plotH); ctx.stroke();

                                // Draw curves
                                function drawCurve(vals, color, label, labelX) {
                                    ctx.strokeStyle = color;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    for (var j = 0; j <= maxN; j++) {
                                        var sx = toSx(j);
                                        var sy2 = toSy(Math.min(vals[j], yMax));
                                        if (j === 0) ctx.moveTo(sx, sy2);
                                        else ctx.lineTo(sx, sy2);
                                    }
                                    ctx.stroke();

                                    // Points
                                    for (var j2 = 0; j2 <= maxN; j2++) {
                                        if (vals[j2] > yMax * 1.05) continue;
                                        var sx2 = toSx(j2);
                                        var sy3 = toSy(vals[j2]);
                                        ctx.fillStyle = color;
                                        ctx.beginPath();
                                        ctx.arc(sx2, sy3, 3, 0, Math.PI * 2);
                                        ctx.fill();
                                    }

                                    // Label
                                    ctx.fillStyle = color;
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(label, labelX, padT + 14);
                                }

                                drawCurve(quadVals, viz.colors.teal, 'n\u00B2', padL + 8);
                                drawCurve(expVals, viz.colors.orange, '2\u207F', padL + 50);
                                drawCurve(factVals, viz.colors.red, 'n!', padL + 90);

                                // Values at maxN
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'alphabetic';
                                ctx.fillText(
                                    'At n=' + maxN + ':  n\u00B2=' + quadVals[maxN] +
                                    '  2\u207F=' + expVals[maxN] +
                                    '  n!=' + factVals[maxN].toLocaleString(),
                                    w / 2, h - 6
                                );
                            }

                            VizEngine.createSlider(controls, 'Max n', 4, 12, 8, 1, function (val) {
                                maxN = Math.round(val);
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Compute \\(7!\\) and \\(10!/8!\\).',
                        hint: 'For \\(10!/8!\\), cancel the common factors.',
                        solution: '\\(7! = 5040\\). \\(10!/8! = (10 \\times 9 \\times 8!)/8! = 10 \\times 9 = 90\\).'
                    },
                    {
                        question: 'How many ways can you shuffle a standard deck of 52 cards? Express the answer using factorial notation and estimate how large this number is.',
                        hint: 'Each shuffle is a permutation of 52 cards.',
                        solution: '\\(52!\\) ways. This is approximately \\(8.07 \\times 10^{67}\\). If every person on Earth shuffled one deck per second since the Big Bang, the total shuffles would be roughly \\(10^{27}\\), nowhere near exhausting all \\(52!\\) possibilities. Essentially every shuffle you have ever done produced an ordering that has never occurred before in the history of the universe.'
                    }
                ]
            },

            // ============================================================
            // Section 3: Permutations formula
            // ============================================================
            {
                id: 'permutations-formula',
                title: 'The Permutations Formula',
                content: `
<h2>Choosing and Arranging \\(r\\) Objects from \\(n\\)</h2>

<p>So far we have counted the ways to arrange <em>all</em> \\(n\\) objects. But what if you only want to arrange \\(r\\) of them?</p>

<div class="env-block example">
<strong>Example.</strong> A race has 8 runners. How many ways can the gold, silver, and bronze medals be awarded?<br><br>
Gold: 8 choices. Silver: 7 choices (the gold medalist is excluded). Bronze: 6 choices.<br>
Total: \\(8 \\times 7 \\times 6 = 336\\).
</div>

<p>This is an example of a <strong>\\(k\\)-permutation</strong>: choosing and arranging \\(r\\) objects from a set of \\(n\\).</p>

<div class="env-block definition">
<strong>\\(k\\)-Permutation (or \\(P(n,r)\\)).</strong> The number of ways to arrange \\(r\\) objects chosen from \\(n\\) distinct objects is:
\\[
P(n, r) = n \\times (n-1) \\times (n-2) \\times \\cdots \\times (n-r+1) = \\frac{n!}{(n-r)!}
\\]
</div>

<p>Let us verify with our example: \\(P(8, 3) = 8!/(8-3)! = 8!/5! = 8 \\times 7 \\times 6 = 336\\). Correct!</p>

<h3>Special cases</h3>

<ul>
<li>\\(P(n, n) = n!/(n-n)! = n!/0! = n!/1 = n!\\). Arranging all \\(n\\) objects: the full permutation.</li>
<li>\\(P(n, 1) = n\\). Choosing and placing just one object: you simply pick one of \\(n\\).</li>
<li>\\(P(n, 0) = n!/n! = 1\\). There is exactly one way to arrange zero objects: do nothing.</li>
</ul>

<div class="env-block example">
<strong>Example: Words from letters.</strong> How many 4-letter "words" (not necessarily meaningful) can you form from the 26 letters of the English alphabet, if no letter can be repeated?<br><br>
\\(P(26, 4) = 26 \\times 25 \\times 24 \\times 23 = 358{,}800\\).
</div>

<div class="env-block example">
<strong>Example: Seating.</strong> 10 people compete for 3 seats on a bench. How many ways can the seats be filled?<br><br>
\\(P(10, 3) = 10 \\times 9 \\times 8 = 720\\).
</div>

<div class="env-block intuition">
<strong>When to use \\(P(n,r)\\).</strong> Ask yourself: "Does the order of my selection matter?" If the answer is yes (gold vs. silver matters, the first letter vs. the second matters), use permutations. If order does not matter, you need combinations (next chapter).
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'Compute \\(P(6, 2)\\) and \\(P(6, 6)\\).',
                        hint: 'Use the formula \\(P(n,r) = n!/(n-r)!\\).',
                        solution: '\\(P(6,2) = 6!/4! = 6 \\times 5 = 30\\). \\(P(6,6) = 6!/0! = 720\\).'
                    },
                    {
                        question: 'A club of 12 members elects a president, vice-president, and secretary. How many different election outcomes are possible?',
                        hint: 'The three positions are distinct (order matters).',
                        solution: '\\(P(12, 3) = 12 \\times 11 \\times 10 = 1{,}320\\).'
                    },
                    {
                        question: 'How many 3-digit numbers can be formed from the digits \\(\\{1, 2, 3, 4, 5\\}\\) if (a) repetition is allowed, (b) repetition is not allowed?',
                        hint: '(a) Each digit position has 5 independent choices. (b) This is \\(P(5, 3)\\).',
                        solution: '(a) \\(5^3 = 125\\). (b) \\(P(5,3) = 5 \\times 4 \\times 3 = 60\\).'
                    }
                ]
            },

            // ============================================================
            // Section 4: Permutations with restrictions
            // ============================================================
            {
                id: 'permutations-restrictions',
                title: 'Permutations with Restrictions',
                content: `
<h2>When Not Everything Is Free</h2>

<p>Real problems often come with constraints: certain objects must be together, or certain objects must not be adjacent, or a specific object must be in a specific position. These restrictions make permutation counting more interesting (and trickier).</p>

<h3>Strategy 1: Objects that must stay together (bundling)</h3>

<div class="env-block example">
<strong>Example.</strong> Five people (A, B, C, D, E) sit in a row. A and B insist on sitting next to each other. How many arrangements are there?<br><br>
<strong>Trick:</strong> Treat A and B as a single "super-person" (a bundle). Now we have 4 objects to arrange: [AB], C, D, E. That is \\(4! = 24\\) arrangements. But within the bundle, A and B can swap (AB or BA), giving \\(2! = 2\\) internal arrangements.<br>
Total: \\(4! \\times 2! = 24 \\times 2 = 48\\).
</div>

<div class="env-block definition">
<strong>Bundling technique.</strong> If \\(k\\) objects must be together, treat them as one "super-object." Count the arrangements of the remaining objects plus the bundle, then multiply by the number of internal arrangements within the bundle (\\(k!\\)).
</div>

<h3>Strategy 2: Objects that must not be together (complementary counting)</h3>

<div class="env-block example">
<strong>Example.</strong> Same 5 people, but now A and B must <em>not</em> sit next to each other.<br><br>
Total arrangements without restriction: \\(5! = 120\\).<br>
Arrangements where A and B ARE next to each other: 48 (from above).<br>
Arrangements where A and B are NOT next to each other: \\(120 - 48 = 72\\).
</div>

<p>This is the <strong>complementary counting</strong> strategy: total minus unwanted = wanted. It works beautifully whenever the "forbidden" condition is easier to count than the "allowed" condition.</p>

<h3>Strategy 3: Fixed positions</h3>

<div class="env-block example">
<strong>Example.</strong> 7 people sit in a row. Person X must sit in the middle seat (seat 4). How many arrangements?<br><br>
Seat 4 is fixed (1 choice: X). The remaining 6 people fill the other 6 seats: \\(6! = 720\\).<br>
Total: \\(1 \\times 720 = 720\\).
</div>

<div class="env-block remark">
<strong>General principle.</strong> When a constraint fixes some positions, count the free positions separately. The Multiplication Principle ties everything together: (ways to fill fixed positions) \\(\\times\\) (ways to fill free positions).
</div>

<h3>Strategy 4: Forbidden positions (use complementary counting or direct)</h3>

<div class="env-block example">
<strong>Example.</strong> 4 books are placed on a shelf. How many arrangements are there if Book A must NOT be first?<br><br>
Total arrangements: \\(4! = 24\\).<br>
Arrangements with A first: fix A in position 1, arrange the other 3: \\(3! = 6\\).<br>
Answer: \\(24 - 6 = 18\\).
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: '6 students stand in a line. Students X and Y must be at the two ends (one at each end). How many arrangements?',
                        hint: 'First place X and Y at the ends (how many ways?), then arrange the remaining 4 students in the middle.',
                        solution: 'X and Y at the two ends: \\(2! = 2\\) ways (X left and Y right, or vice versa). The other 4 in the middle: \\(4! = 24\\). Total: \\(2 \\times 24 = 48\\).'
                    },
                    {
                        question: 'How many ways can 5 people sit in a row if persons A, B, C must sit consecutively (in any order among themselves)?',
                        hint: 'Bundle A, B, C into one group. You now have 3 objects: [ABC], D, E.',
                        solution: 'Bundle [ABC] as one unit. Arrange 3 units: \\(3! = 6\\). Internal arrangements of A, B, C: \\(3! = 6\\). Total: \\(6 \\times 6 = 36\\).'
                    },
                    {
                        question: 'The digits 1, 2, 3, 4, 5 are arranged to form a 5-digit number. How many such numbers are odd?',
                        hint: 'An odd number ends in an odd digit. Which digits are odd?',
                        solution: 'Odd digits: 1, 3, 5 (3 choices for the last position). The remaining 4 digits fill the first 4 positions: \\(4! = 24\\). Total: \\(3 \\times 24 = 72\\).'
                    }
                ]
            },

            // ============================================================
            // Section 5: Circular permutations
            // ============================================================
            {
                id: 'circular-permutations',
                title: 'Circular Permutations',
                content: `
<h2>The Necklace Problem</h2>

<p>So far we have arranged objects <em>in a line</em>. But what if the arrangement is in a circle? Sitting around a round table, stringing beads on a bracelet, or placing guests around a circular dinner table are all examples of <strong>circular permutations</strong>.</p>

<h3>Why circles are different</h3>

<p>In a line, the arrangement ABC is different from BCA (the objects are in different positions). But around a circle, ABC, BCA, and CAB are all the <em>same</em> arrangement, because you can rotate the circle to transform one into another. There is no "first seat" at a round table.</p>

<div class="viz-placeholder" data-viz="viz-circular-perm"></div>

<div class="env-block definition">
<strong>Circular Permutation.</strong> The number of ways to arrange \\(n\\) distinct objects in a circle is:
\\[
(n-1)!
\\]
This is because we can fix one object's position (to break the rotational symmetry) and arrange the remaining \\(n-1\\) objects in the remaining seats.
</div>

<h3>Why \\((n-1)!\\)?</h3>

<p>There are \\(n!\\) linear arrangements. Each circular arrangement corresponds to \\(n\\) different linear arrangements (obtained by rotating the circle). So the number of distinct circular arrangements is \\(n!/n = (n-1)!\\).</p>

<div class="env-block example">
<strong>Example.</strong> 5 people sit around a circular table. How many distinct seating arrangements?<br>
\\((5-1)! = 4! = 24\\).
</div>

<h3>The necklace problem: reflections</h3>

<p>If the circular arrangement can also be <em>flipped</em> (like a necklace or bracelet, where you can turn it over), then we must also account for reflections. Each arrangement and its mirror image are considered the same.</p>

<div class="env-block definition">
<strong>Necklace Permutation.</strong> The number of distinct arrangements of \\(n\\) objects on a necklace (considering both rotations and reflections as identical) is:
\\[
\\frac{(n-1)!}{2}
\\]
(for \\(n \\geq 3\\)).
</div>

<div class="env-block example">
<strong>Example.</strong> How many distinct necklaces can be made from 6 different colored beads?<br>
\\((6-1)!/2 = 120/2 = 60\\).
</div>

<div class="env-block remark">
<strong>When does the factor of 2 apply?</strong> It applies when the arrangement can be physically flipped (a necklace, a bracelet, a wreath). It does NOT apply when the two sides are distinguishable (like people sitting at a round table, where each person has a distinct left and right neighbor, and flipping would put them on different sides).
</div>

<h3>Summary of formulas</h3>

<table style="width:100%; border-collapse:collapse; margin:16px 0;">
<tr style="border-bottom:1px solid #30363d;">
<th style="text-align:left; padding:8px; color:#8b949e;">Type</th>
<th style="text-align:left; padding:8px; color:#8b949e;">Formula</th>
<th style="text-align:left; padding:8px; color:#8b949e;">Example (\\(n = 5\\))</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">Linear permutation (all \\(n\\))</td>
<td style="padding:8px;">\\(n!\\)</td>
<td style="padding:8px;">\\(120\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">\\(r\\) from \\(n\\) (linear)</td>
<td style="padding:8px;">\\(P(n,r) = n!/(n-r)!\\)</td>
<td style="padding:8px;">\\(P(5,3)=60\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">Circular permutation</td>
<td style="padding:8px;">\\((n-1)!\\)</td>
<td style="padding:8px;">\\(24\\)</td>
</tr>
<tr>
<td style="padding:8px;">Necklace (with flips)</td>
<td style="padding:8px;">\\((n-1)!/2\\)</td>
<td style="padding:8px;">\\(12\\)</td>
</tr>
</table>
`,
                visualizations: [
                    {
                        id: 'viz-circular-perm',
                        title: 'Linear vs. Circular Permutations',
                        description: 'See how multiple linear arrangements collapse into one circular arrangement. Use the slider to change the number of objects.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var n = 4;
                            var colors = [
                                viz.colors.red, viz.colors.green, viz.colors.blue,
                                viz.colors.orange, viz.colors.purple, viz.colors.teal,
                                viz.colors.yellow
                            ];
                            var labelChars = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
                            var animT = 0;
                            var running = false;

                            function factorial(k) {
                                var r = 1;
                                for (var i = 2; i <= k; i++) r *= i;
                                return r;
                            }

                            function drawFrame(t) {
                                viz.clear();
                                var circleR = Math.min(w * 0.16, h * 0.28);
                                var circCX = w * 0.7;
                                var circCY = h * 0.5;

                                // Title
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('n = ' + n + ':  Linear ' + n + '! = ' + factorial(n) + '   vs   Circular (' + n + '-1)! = ' + factorial(n - 1), w / 2, 22);

                                // Circular arrangement (fixed A at top)
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Circular: fix A, arrange rest', circCX, circCY - circleR - 24);

                                // Draw circle outline
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.arc(circCX, circCY, circleR, 0, Math.PI * 2);
                                ctx.stroke();

                                // Place nodes on circle with rotation animation
                                var rotOffset = (t || 0) * 0.001;
                                for (var i = 0; i < n; i++) {
                                    var angle = -Math.PI / 2 + (2 * Math.PI * i) / n + rotOffset;
                                    var nx = circCX + circleR * Math.cos(angle);
                                    var ny = circCY + circleR * Math.sin(angle);
                                    ctx.fillStyle = colors[i] + 'cc';
                                    ctx.beginPath();
                                    ctx.arc(nx, ny, 14, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = '#000';
                                    ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(labelChars[i], nx, ny);
                                }

                                // Linear arrangements on left
                                var linX = 16;
                                var linY = 52;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'alphabetic';
                                ctx.fillText('Same in circle (\u00D7' + n + '):', linX, linY - 4);

                                // Show n rotations of one arrangement
                                var rowH = Math.min(24, (h - linY - 20) / n);
                                var blockW = Math.min(28, (w * 0.35) / n);
                                for (var r = 0; r < n; r++) {
                                    var ry = linY + r * rowH;
                                    var isHighlight = (r === 0);

                                    // Rotated arrangement
                                    for (var c = 0; c < n; c++) {
                                        var idx = (c + r) % n;
                                        var bx = linX + c * (blockW + 2);
                                        ctx.fillStyle = colors[idx] + (isHighlight ? 'ee' : '55');
                                        ctx.beginPath();
                                        ctx.roundRect(bx, ry, blockW, rowH - 2, 3);
                                        ctx.fill();
                                        if (rowH >= 16) {
                                            ctx.fillStyle = isHighlight ? '#000' : '#666';
                                            ctx.font = '10px -apple-system,sans-serif';
                                            ctx.textAlign = 'center';
                                            ctx.textBaseline = 'middle';
                                            ctx.fillText(labelChars[idx], bx + blockW / 2, ry + (rowH - 2) / 2);
                                        }
                                    }

                                    // Arrow or brace
                                    if (r === 0) {
                                        ctx.fillStyle = viz.colors.gold;
                                        ctx.font = '10px -apple-system,sans-serif';
                                        ctx.textAlign = 'left';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText('\u2190 keep this one', linX + n * (blockW + 2) + 6, ry + (rowH - 2) / 2);
                                    }
                                }

                                // Bottom text
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'alphabetic';
                                ctx.fillText('These ' + n + ' rotations are the same circular arrangement.', w / 2, h - 30);
                                ctx.fillStyle = viz.colors.gold;
                                ctx.fillText('Circular perms = ' + n + '! / ' + n + ' = ' + factorial(n - 1), w / 2, h - 12);
                            }

                            viz.animate(function (t) {
                                animT = t;
                                drawFrame(t);
                            });

                            VizEngine.createSlider(controls, 'Objects (n)', 3, 7, 4, 1, function (val) {
                                n = Math.round(val);
                            });

                            return { stopAnimation: function () { viz.stopAnimation(); } };
                        }
                    }
                ],
                exercises: [
                    {
                        question: '8 people sit around a round table. How many distinct seating arrangements are there?',
                        hint: 'Fix one person and arrange the rest.',
                        solution: '\\((8-1)! = 7! = 5{,}040\\) distinct arrangements.'
                    },
                    {
                        question: 'A bracelet is made of 5 different gemstones. How many distinct bracelets are possible?',
                        hint: 'A bracelet can be rotated AND flipped (turned over), so use the necklace formula.',
                        solution: '\\((5-1)!/2 = 24/2 = 12\\) distinct bracelets.'
                    },
                    {
                        question: '4 couples (8 people) sit at a round table such that each couple sits together. How many arrangements?',
                        hint: 'First arrange 4 "couple blocks" in a circle: \\((4-1)!\\). Then each couple can swap internally: \\(2!\\) per couple.',
                        solution: 'Circular arrangement of 4 blocks: \\((4-1)! = 6\\). Each of the 4 couples can internally swap: \\(2^4 = 16\\). Total: \\(6 \\times 16 = 96\\).'
                    },
                    {
                        question: 'King Arthur and 11 knights sit at a round table. How many ways can they sit if two specific knights (Sir Lancelot and Sir Gawain) must NOT sit next to each other?',
                        hint: 'Use complementary counting: total circular permutations minus those where the two knights ARE adjacent.',
                        solution: 'Total circular permutations: \\((12-1)! = 11!\\). Arrangements where Lancelot and Gawain are adjacent: bundle them as one unit, giving \\((11-1)! \\times 2! = 10! \\times 2\\) arrangements. Answer: \\(11! - 2 \\times 10! = 10!(11 - 2) = 9 \\times 10! = 32{,}659{,}200\\).'
                    }
                ]
            }
        ]
    });
})();
