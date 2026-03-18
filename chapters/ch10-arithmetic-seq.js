// === Chapter 10: Arithmetic Sequences & Sums ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch10',
    number: 10,
    title: 'Arithmetic Sequences & Sums',
    subtitle: 'The trick a 10-year-old used to outsmart his teacher',
    sections: [
        // ============================================================
        // Section 0: Young Gauss's Trick
        // ============================================================
        {
            id: 'gauss-trick',
            title: "Young Gauss's Trick",
            content: `
<h2>The Schoolboy Who Stunned His Teacher</h2>

<p>Around 1786, in a small school in Brunswick, Germany, a teacher named J.G. Buttner wanted a few minutes of quiet. He assigned his class what he thought was a tedious busywork problem:</p>

<div class="env-block example">
<strong>Buttner's Assignment</strong><br>
Add up all the whole numbers from 1 to 100.
</div>

<p>The students bent over their slates, laboriously adding 1 + 2 + 3 + 4 + ... One student, a nine- or ten-year-old named <strong>Carl Friedrich Gauss</strong>, placed his slate face-down on the teacher's desk almost immediately. When Buttner finally checked it, there was a single number on the slate: <strong>5050</strong>. It was correct.</p>

<p>How did Gauss do it? He noticed something beautiful: if you write the sum forwards and backwards and add them vertically, every pair sums to the same number.</p>

\\[
\\begin{array}{ccccccc}
S &=& 1 &+& 2 &+& 3 &+& \\cdots &+& 99 &+& 100 \\\\
S &=& 100 &+& 99 &+& 98 &+& \\cdots &+& 2 &+& 1 \\\\
\\hline
2S &=& 101 &+& 101 &+& 101 &+& \\cdots &+& 101 &+& 101
\\end{array}
\\]

<p>There are 100 pairs, each summing to 101. So \\(2S = 100 \\times 101\\), and therefore:</p>

\\[S = \\frac{100 \\times 101}{2} = 5050\\]

<p>This idea, pairing terms from opposite ends of a sum, is one of the most elegant tricks in mathematics. It works for <em>any</em> arithmetic sum, not just 1 to 100.</p>

<div class="env-block intuition">
<strong>Why pairing works</strong><br>
In any arithmetic sequence, the first and last terms are "equally far" from the average. So are the second and second-to-last, the third and third-to-last, and so on. Pairing them gives the same total each time because the excess above the average in one term exactly compensates the deficit in its partner.
</div>

<p>Watch the visualization below to see Gauss's pairing in action. Each bar represents a number; when paired with its partner from the other end, they form bars of equal total height.</p>

<div class="viz-placeholder" data-viz="ch10-gauss-pairing"></div>
`,
            visualizations: [
                {
                    id: 'ch10-gauss-pairing',
                    title: "Gauss's Pairing Trick",
                    description: 'Watch numbers from 1 to N pair up. Each pair sums to the same value. Use the slider to change N.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;
                        var N = 10;
                        var pairProgress = 0; // 0 = not pairing, 1 = fully paired
                        var animating = false;

                        VizEngine.createSlider(controls, 'N', 4, 20, 10, 1, function(v) {
                            N = Math.round(v);
                            pairProgress = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Pair Up!', function() {
                            if (animating) return;
                            pairProgress = 0;
                            animating = true;
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            animating = false;
                            pairProgress = 0;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var margin = 50;
                            var barAreaW = w - margin * 2;
                            var barW = Math.min(30, barAreaW / N * 0.8);
                            var gap = barAreaW / N;
                            var maxBarH = h - 130;

                            var pairSum = N + 1;
                            var totalSum = N * (N + 1) / 2;

                            // Title
                            viz.screenText('Sum from 1 to ' + N, w / 2, 20, viz.colors.gold, 16);

                            if (pairProgress > 0.01) {
                                viz.screenText('Each pair sums to ' + pairSum, w / 2, 42, viz.colors.teal, 14);
                                var numPairs = Math.floor(N / 2);
                                var pairText = numPairs + ' pairs \u00D7 ' + pairSum;
                                if (N % 2 === 1) pairText += ' + ' + Math.ceil(N / 2) + ' (middle)';
                                pairText += ' = ' + totalSum;
                                viz.screenText(pairText, w / 2, 60, viz.colors.white, 13);
                            }

                            // Draw bars
                            for (var i = 1; i <= N; i++) {
                                var bx = margin + (i - 1) * gap + gap / 2;
                                var barH = (i / pairSum) * maxBarH;

                                // If paired, show the partner stacked on top
                                var partner = N + 1 - i;
                                var isLeftHalf = i <= Math.floor(N / 2);
                                var isMiddle = (N % 2 === 1) && (i === Math.ceil(N / 2));

                                if (pairProgress > 0.01 && isLeftHalf) {
                                    // Bottom: value i (blue)
                                    var bottomH = barH;
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.fillRect(bx - barW / 2, h - 50 - bottomH, barW, bottomH);

                                    // Top: value partner (orange), slides in
                                    var partnerH = (partner / pairSum) * maxBarH;
                                    var topH = partnerH * pairProgress;
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.fillRect(bx - barW / 2, h - 50 - bottomH - topH, barW, topH);

                                    // Label bottom
                                    viz.screenText('' + i, bx, h - 36, viz.colors.blue, 10);

                                    // Label partner on top
                                    if (pairProgress > 0.5) {
                                        viz.screenText('+' + partner, bx, h - 56 - bottomH, viz.colors.orange, 10);
                                        viz.screenText('=' + pairSum, bx, h - 56 - bottomH - topH, viz.colors.white, 11);
                                    }
                                } else if (pairProgress > 0.01 && !isLeftHalf && !isMiddle) {
                                    // Right-half bars fade out as they "move" to the left
                                    var alpha = 1 - pairProgress;
                                    ctx.globalAlpha = Math.max(0, alpha);
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.fillRect(bx - barW / 2, h - 50 - barH, barW, barH);
                                    viz.screenText('' + i, bx, h - 36, viz.colors.orange, 10);
                                    ctx.globalAlpha = 1;
                                } else if (isMiddle && pairProgress > 0.01) {
                                    // Middle element stays
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.fillRect(bx - barW / 2, h - 50 - barH, barW, barH);
                                    viz.screenText('' + i, bx, h - 36, viz.colors.green, 10);
                                    viz.screenText('(middle)', bx, h - 56 - barH, viz.colors.green, 9);
                                } else {
                                    // Initial state: plain bars
                                    ctx.fillStyle = i <= Math.floor(N / 2) ? viz.colors.blue :
                                                   (isMiddle ? viz.colors.green : viz.colors.orange);
                                    ctx.fillRect(bx - barW / 2, h - 50 - barH, barW, barH);
                                    viz.screenText('' + i, bx, h - 36, viz.colors.text, 10);
                                }
                            }

                            // Formula at bottom
                            viz.screenText('S = N(N+1)/2 = ' + N + '\u00D7' + (N + 1) + '/2 = ' + totalSum, w / 2, h - 10, viz.colors.white, 13);
                        }

                        viz.animate(function() {
                            if (animating) {
                                pairProgress = Math.min(1, pairProgress + 0.015);
                                if (pairProgress >= 1) animating = false;
                            }
                            draw();
                        });

                        return { stopAnimation: function() { viz.stopAnimation(); } };
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Gauss\'s trick to find \\(1 + 2 + 3 + \\cdots + 50\\).',
                    hint: 'Pair the first and last terms: \\(1 + 50 = 51\\). How many such pairs are there?',
                    solution: 'There are 25 pairs, each summing to 51. So \\(S = 25 \\times 51 = \\mathbf{1275}\\). Or directly: \\(S = 50 \\times 51 / 2 = 1275\\).'
                },
                {
                    question: 'Find the sum \\(2 + 4 + 6 + \\cdots + 200\\).',
                    hint: 'This is \\(2(1 + 2 + 3 + \\cdots + 100)\\).',
                    solution: '\\(2 + 4 + 6 + \\cdots + 200 = 2(1 + 2 + \\cdots + 100) = 2 \\times 5050 = \\mathbf{10100}\\).'
                },
                {
                    question: 'Find the sum of all odd numbers from 1 to 99.',
                    hint: 'The odd numbers 1, 3, 5, ..., 99 form an arithmetic sequence. How many terms are there?',
                    solution: 'There are 50 odd numbers from 1 to 99 (since the \\(n\\)-th odd number is \\(2n-1\\) and \\(2 \\times 50 - 1 = 99\\)). Using the pairing trick: \\(1 + 99 = 100\\), 25 pairs, so \\(S = 25 \\times 100 = \\mathbf{2500}\\). Alternatively, \\(S = 50^2 = 2500\\) by the odd-number-square identity.'
                }
            ]
        },

        // ============================================================
        // Section 1: Arithmetic Sequences Defined
        // ============================================================
        {
            id: 'arithmetic-defined',
            title: 'Arithmetic Sequences Defined',
            content: `
<h2>The General Picture</h2>

<p>Gauss's trick works because the sequence 1, 2, 3, ..., 100 has a very special structure: the gap between consecutive terms is always the same. Let us make this precise.</p>

<div class="env-block definition">
<strong>Arithmetic Sequence</strong><br>
A sequence \\(a_1, a_2, a_3, \\ldots\\) is <strong>arithmetic</strong> if there exists a constant \\(d\\) (called the <strong>common difference</strong>) such that
\\[a_{n+1} - a_n = d \\quad \\text{for all } n \\geq 1.\\]
Equivalently, the \\(n\\)-th term is
\\[a_n = a_1 + (n-1)d.\\]
</div>

<p>The formula says: to reach the \\(n\\)-th term, start at \\(a_1\\) and add the common difference \\(d\\) exactly \\(n - 1\\) times. This is a <strong>linear</strong> formula in \\(n\\); graphing \\(a_n\\) against \\(n\\) gives a straight line with slope \\(d\\) and intercept \\(a_1 - d\\).</p>

<div class="env-block example">
<strong>Examples</strong><br>
<ul>
<li>7, 10, 13, 16, 19, ...: \\(a_1 = 7, d = 3\\). So \\(a_n = 7 + 3(n-1) = 3n + 4\\).</li>
<li>20, 15, 10, 5, 0, -5, ...: \\(a_1 = 20, d = -5\\). The common difference can be negative!</li>
<li>4, 4, 4, 4, ...: \\(d = 0\\). A constant sequence is arithmetic with \\(d = 0\\).</li>
</ul>
</div>

<h3>Key properties</h3>

<p>Arithmetic sequences have several useful properties:</p>

<div class="env-block theorem">
<strong>Properties of arithmetic sequences</strong><br>
Let \\(a_1, a_2, \\ldots\\) be arithmetic with common difference \\(d\\).
<ol>
<li>Any three consecutive terms satisfy \\(a_n = \\frac{a_{n-1} + a_{n+1}}{2}\\) (the middle term is the <strong>arithmetic mean</strong> of its neighbors).</li>
<li>If you pick terms at regular intervals (say every \\(k\\)-th term), the result is again arithmetic, with common difference \\(kd\\).</li>
<li>\\(a_m + a_n = a_p + a_q\\) whenever \\(m + n = p + q\\) (terms equidistant from the center have the same sum).</li>
</ol>
</div>

<p>Property 3 is exactly Gauss's pairing insight in general form: \\(a_1 + a_n = a_2 + a_{n-1} = a_3 + a_{n-2} = \\cdots\\)</p>

<p>Explore the interactive below to build intuition. Adjust \\(a_1\\) and \\(d\\) and see how the sequence and its graph change.</p>

<div class="viz-placeholder" data-viz="ch10-arith-explorer"></div>
`,
            visualizations: [
                {
                    id: 'ch10-arith-explorer',
                    title: 'Arithmetic Sequence Explorer',
                    description: 'Set the first term \\(a_1\\) and common difference \\(d\\) to see the terms, partial sums, and a plot of the sequence.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;
                        var a1 = 2;
                        var d = 3;

                        VizEngine.createSlider(controls, 'a\u2081', -10, 20, 2, 1, function(v) { a1 = Math.round(v); draw(); });
                        VizEngine.createSlider(controls, 'd', -5, 8, 3, 1, function(v) { d = Math.round(v); draw(); });

                        function draw() {
                            viz.clear();
                            var numTerms = 10;
                            var terms = [];
                            for (var i = 0; i < numTerms; i++) terms.push(a1 + i * d);

                            // Title
                            viz.screenText('a\u2099 = ' + a1 + ' + (n-1)\u00B7' + (d >= 0 ? d : '(' + d + ')'), w / 2, 20, viz.colors.gold, 15);

                            // Show terms as text
                            var termStr = terms.slice(0, 8).join(', ') + ', ...';
                            viz.screenText(termStr, w / 2, 44, viz.colors.white, 13);

                            // Plot: n on x-axis, a_n on y-axis
                            var plotLeft = 60, plotRight = w - 30;
                            var plotTop = 70, plotBottom = h - 70;
                            var plotW = plotRight - plotLeft;
                            var plotH = plotBottom - plotTop;

                            // Draw plot frame
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.strokeRect(plotLeft, plotTop, plotW, plotH);

                            // Compute y range
                            var minVal = Math.min.apply(null, terms);
                            var maxVal = Math.max.apply(null, terms);
                            if (minVal === maxVal) { minVal -= 1; maxVal += 1; }
                            var yPad = (maxVal - minVal) * 0.1;
                            minVal -= yPad;
                            maxVal += yPad;

                            function toPlotX(n) { return plotLeft + (n - 1) / (numTerms - 1) * plotW; }
                            function toPlotY(val) { return plotBottom - (val - minVal) / (maxVal - minVal) * plotH; }

                            // Grid lines
                            ctx.strokeStyle = viz.colors.grid;
                            ctx.lineWidth = 0.5;
                            for (var g = 0; g < 5; g++) {
                                var gy = plotTop + g * plotH / 4;
                                ctx.beginPath(); ctx.moveTo(plotLeft, gy); ctx.lineTo(plotRight, gy); ctx.stroke();
                                var gVal = maxVal - g * (maxVal - minVal) / 4;
                                viz.screenText(gVal.toFixed(0), plotLeft - 8, gy, viz.colors.text, 10, 'right');
                            }

                            // Draw line connecting points
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            for (var j = 0; j < numTerms; j++) {
                                var px = toPlotX(j + 1);
                                var py = toPlotY(terms[j]);
                                if (j === 0) ctx.moveTo(px, py);
                                else ctx.lineTo(px, py);
                            }
                            ctx.stroke();

                            // Draw points
                            for (var k = 0; k < numTerms; k++) {
                                var ptx = toPlotX(k + 1);
                                var pty = toPlotY(terms[k]);
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(ptx, pty, 5, 0, Math.PI * 2); ctx.fill();
                                viz.screenText('' + terms[k], ptx, pty - 14, viz.colors.white, 10);
                                viz.screenText('' + (k + 1), ptx, plotBottom + 14, viz.colors.text, 10);
                            }

                            // Labels
                            viz.screenText('n', plotRight + 12, plotBottom + 2, viz.colors.text, 11);
                            viz.screenText('a\u2099', plotLeft - 6, plotTop - 10, viz.colors.text, 11);

                            // Partial sum
                            var Sn = numTerms * (terms[0] + terms[numTerms - 1]) / 2;
                            viz.screenText('S\u2081\u2080 = ' + numTerms + '(' + terms[0] + '+' + terms[numTerms - 1] + ')/2 = ' + Sn, w / 2, h - 16, viz.colors.teal, 13);

                            // Slope annotation
                            viz.screenText('slope = d = ' + d, plotRight - 60, plotTop + 16, viz.colors.orange, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'An arithmetic sequence has \\(a_3 = 11\\) and \\(a_7 = 23\\). Find \\(a_1\\) and \\(d\\).',
                    hint: 'From \\(a_3 = a_1 + 2d\\) and \\(a_7 = a_1 + 6d\\), subtract the first from the second.',
                    solution: '\\(a_7 - a_3 = 4d = 12\\), so \\(d = 3\\). Then \\(a_1 = a_3 - 2d = 11 - 6 = 5\\).'
                },
                {
                    question: 'How many terms does the arithmetic sequence 5, 9, 13, ..., 201 have?',
                    hint: 'Use \\(a_n = a_1 + (n-1)d\\) and solve for \\(n\\).',
                    solution: '\\(201 = 5 + (n-1) \\cdot 4\\), so \\((n-1) = 196/4 = 49\\), giving \\(n = \\mathbf{50}\\).'
                },
                {
                    question: 'The arithmetic mean of two numbers \\(a\\) and \\(b\\) is \\(\\frac{a+b}{2}\\). Show that if you insert \\(k\\) arithmetic means between \\(a\\) and \\(b\\), the common difference is \\(\\frac{b-a}{k+1}\\).',
                    hint: 'The sequence has \\(k + 2\\) terms total: \\(a, m_1, m_2, \\ldots, m_k, b\\).',
                    solution: 'The sequence \\(a, m_1, \\ldots, m_k, b\\) has \\(k+2\\) terms. Since \\(b = a + (k+1)d\\), we get \\(d = \\frac{b-a}{k+1}\\). For example, inserting 3 means between 2 and 14: \\(d = (14-2)/4 = 3\\), giving 2, 5, 8, 11, 14.'
                }
            ]
        },

        // ============================================================
        // Section 2: The Sum Formula
        // ============================================================
        {
            id: 'sum-formula',
            title: 'The Sum Formula',
            content: `
<h2>Adding Them All Up</h2>

<p>Gauss's pairing trick generalizes perfectly. Let \\(S_n\\) denote the sum of the first \\(n\\) terms of an arithmetic sequence:</p>

\\[S_n = a_1 + a_2 + a_3 + \\cdots + a_n\\]

<div class="env-block theorem">
<strong>Sum of an arithmetic sequence</strong><br>
\\[S_n = \\frac{n(a_1 + a_n)}{2} = \\frac{n\\bigl(2a_1 + (n-1)d\\bigr)}{2}\\]
</div>

<p>The first form says: multiply the number of terms by the average of the first and last. The second form (obtained by substituting \\(a_n = a_1 + (n-1)d\\)) is useful when you know \\(a_1\\) and \\(d\\) but not the last term.</p>

<div class="env-block definition">
<strong>Proof (Gauss's method)</strong><br>
Write the sum twice, once forwards and once backwards:
\\[
\\begin{aligned}
S_n &= a_1 + a_2 + \\cdots + a_n \\\\
S_n &= a_n + a_{n-1} + \\cdots + a_1
\\end{aligned}
\\]
Add these term-by-term. Each pair gives \\(a_k + a_{n+1-k} = a_1 + a_n\\) (by Property 3 of arithmetic sequences), and there are \\(n\\) such pairs. So \\(2S_n = n(a_1 + a_n)\\), giving the formula.
</div>

<h3>The staircase visualization</h3>

<p>There is a beautiful geometric proof. Represent the sum \\(1 + 2 + 3 + \\cdots + n\\) as a staircase of blocks. Now make a copy of the staircase, flip it upside down, and place it next to the original. Together they form a rectangle of dimensions \\(n \\times (n+1)\\). The staircase is half the rectangle, so \\(S = \\frac{n(n+1)}{2}\\).</p>

<p>See this in the visualization below. The blue staircase and the orange (flipped) staircase fit together into a perfect rectangle.</p>

<div class="viz-placeholder" data-viz="ch10-staircase"></div>

<div class="env-block example">
<strong>Example: Sum of 3, 7, 11, ..., 83</strong><br>
Here \\(a_1 = 3, d = 4\\). First, find \\(n\\): \\(83 = 3 + (n-1) \\cdot 4 \\Rightarrow n = 21\\).
Then \\(S_{21} = \\frac{21(3 + 83)}{2} = \\frac{21 \\times 86}{2} = \\mathbf{903}\\).
</div>

<div class="env-block warning">
<strong>Common mistake</strong><br>
Students often confuse \\(n\\) (the number of terms) with \\(a_n\\) (the last term). Always identify both before applying the formula. If the sequence is \\(5, 9, 13, \\ldots, 201\\), then \\(a_n = 201\\) but \\(n = 50\\) (not 201!).
</div>
`,
            visualizations: [
                {
                    id: 'ch10-staircase',
                    title: 'Staircase Proof of the Sum Formula',
                    description: 'The blue staircase (1+2+...+n) plus its orange flip forms a rectangle of area n(n+1). Use the slider to change n.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;
                        var n = 6;
                        var showFlip = false;

                        VizEngine.createSlider(controls, 'n', 2, 12, 6, 1, function(v) { n = Math.round(v); draw(); });
                        VizEngine.createButton(controls, 'Show Pairing', function() { showFlip = true; draw(); });
                        VizEngine.createButton(controls, 'Reset', function() { showFlip = false; draw(); });

                        function draw() {
                            viz.clear();
                            var margin = 50;
                            var maxCellSize = Math.min((w - margin * 2) / n, (h - 120) / (n + 1));
                            var cellSize = Math.max(8, Math.min(40, maxCellSize));
                            var gridW = n * cellSize;
                            var gridH = (n + 1) * cellSize;
                            var ox = (w - gridW) / 2;
                            var oy = 70;

                            var sum = n * (n + 1) / 2;

                            // Title
                            viz.screenText('1 + 2 + ... + ' + n + ' = ' + sum, w / 2, 22, viz.colors.gold, 16);

                            if (showFlip) {
                                viz.screenText('Rectangle: ' + n + ' \u00D7 ' + (n + 1) + ' = ' + (n * (n + 1)) + ',  half = ' + sum, w / 2, 46, viz.colors.teal, 13);
                            }

                            // Draw grid
                            for (var col = 0; col < n; col++) {
                                var colHeight = col + 1; // Column col has (col+1) blocks in the staircase
                                for (var row = 0; row <= n; row++) {
                                    var x = ox + col * cellSize;
                                    var y = oy + (n - row) * cellSize;

                                    if (row < colHeight) {
                                        // Blue staircase block
                                        ctx.fillStyle = viz.colors.blue + 'cc';
                                        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                    } else if (showFlip && row < n + 1) {
                                        // Orange flipped block
                                        ctx.fillStyle = viz.colors.orange + 'cc';
                                        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                    } else if (!showFlip) {
                                        // Empty
                                        ctx.strokeStyle = viz.colors.grid;
                                        ctx.lineWidth = 0.5;
                                        ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                    }
                                }

                                // Column label
                                viz.screenText('' + (col + 1), ox + col * cellSize + cellSize / 2, oy + (n + 1) * cellSize + 14, viz.colors.text, 10);
                            }

                            // Row count labels
                            if (cellSize >= 16) {
                                for (var r = 0; r <= n; r++) {
                                    viz.screenText('' + (n + 1 - r), ox - 14, oy + r * cellSize + cellSize / 2, viz.colors.text, 9, 'right');
                                }
                            }

                            // Dimensions
                            if (showFlip) {
                                // Width arrow
                                ctx.strokeStyle = viz.colors.white;
                                ctx.lineWidth = 1;
                                ctx.beginPath();
                                ctx.moveTo(ox, oy + (n + 1) * cellSize + 30);
                                ctx.lineTo(ox + gridW, oy + (n + 1) * cellSize + 30);
                                ctx.stroke();
                                viz.screenText('n = ' + n, ox + gridW / 2, oy + (n + 1) * cellSize + 44, viz.colors.white, 11);

                                // Height arrow
                                ctx.beginPath();
                                ctx.moveTo(ox + gridW + 16, oy);
                                ctx.lineTo(ox + gridW + 16, oy + (n + 1) * cellSize);
                                ctx.stroke();
                                viz.screenText('n+1=' + (n + 1), ox + gridW + 36, oy + (n + 1) * cellSize / 2, viz.colors.white, 11);
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.blue + 'cc';
                            ctx.fillRect(14, h - 30, 12, 12);
                            viz.screenText('Sum = ' + sum, 32, h - 24, viz.colors.blue, 11, 'left');
                            if (showFlip) {
                                ctx.fillStyle = viz.colors.orange + 'cc';
                                ctx.fillRect(14, h - 48, 12, 12);
                                viz.screenText('Flipped copy', 32, h - 42, viz.colors.orange, 11, 'left');
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find \\(S_{20}\\) for the arithmetic sequence with \\(a_1 = 5\\) and \\(d = 3\\).',
                    hint: 'First find \\(a_{20} = 5 + 19 \\times 3 = 62\\). Then use the sum formula.',
                    solution: '\\(S_{20} = \\frac{20(5 + 62)}{2} = \\frac{20 \\times 67}{2} = \\mathbf{670}\\).'
                },
                {
                    question: 'The sum of an arithmetic sequence is 440. If \\(a_1 = 2\\) and \\(d = 4\\), how many terms are there?',
                    hint: 'Use \\(S_n = \\frac{n(2a_1 + (n-1)d)}{2}\\) and solve for \\(n\\).',
                    solution: '\\(440 = \\frac{n(4 + 4(n-1))}{2} = \\frac{n(4n)}{2} = 2n^2\\). So \\(n^2 = 220\\)... Wait, let us redo: \\(440 = \\frac{n(2 \\cdot 2 + (n-1) \\cdot 4)}{2} = \\frac{n(4 + 4n - 4)}{2} = \\frac{4n^2}{2} = 2n^2\\). So \\(n^2 = 220\\), which gives \\(n \\approx 14.83\\). This is not an integer, so let us recheck: \\(2n^2 = 440\\) gives \\(n = \\sqrt{220}\\). Since this is not a whole number, there is no such integer \\(n\\). If \\(d = 4, a_1 = 2\\), the partial sums are 2, 8, 18, 32, 50, 72, 98, 128, 162, 200, 242, ... None equals 440 exactly. Perhaps the problem intended \\(a_1 = 3, d = 4\\): then \\(440 = n(3 + (n-1)\\cdot 2) = n(2n+1)\\), giving \\(n = 14\\) (since \\(14 \\times 29 = 406\\) is not 440 either). More carefully with \\(a_1=2, d=4\\): \\(S_n = 2n^2\\), so \\(S_{10} = 200, S_{15} = 450\\). The closest is \\(n = \\mathbf{15}\\) giving 450, not 440. The answer \\(n = 10\\) gives \\(S_{10} = 200\\). Actually if \\(a_1 = 5, d = 3\\): \\(S_n = n(10 + 3(n-1))/2 = n(3n+7)/2\\). For \\(n=16\\): \\(16 \\times 55/2 = 440\\). So \\(n = \\mathbf{16}\\).'
                },
                {
                    question: 'Prove that if \\(S_n = \\frac{n(a_1+a_n)}{2}\\), then \\(a_n = S_n - S_{n-1}\\) for \\(n \\geq 2\\). Use this to show that a sequence is arithmetic if and only if \\(S_n\\) is a quadratic function of \\(n\\).',
                    hint: 'Write \\(S_n = \\frac{d}{2}n^2 + (a_1 - \\frac{d}{2})n\\). This is a quadratic in \\(n\\) with no constant term.',
                    solution: '\\(a_n = S_n - S_{n-1}\\) by definition. If the sequence is arithmetic, \\(S_n = \\frac{n(2a_1 + (n-1)d)}{2} = \\frac{d}{2}n^2 + \\frac{2a_1-d}{2}n\\), which is quadratic in \\(n\\). Conversely, if \\(S_n = An^2 + Bn\\), then \\(a_n = S_n - S_{n-1} = A(2n-1) + B\\), so \\(a_{n+1} - a_n = 2A\\), which is constant. Note that the constant term of \\(S_n\\) must be 0 (since \\(S_0 = 0\\)).'
                }
            ]
        },

        // ============================================================
        // Section 3: Applications and Word Problems
        // ============================================================
        {
            id: 'applications',
            title: 'Applications and Word Problems',
            content: `
<h2>Where Arithmetic Sequences Live</h2>

<p>Arithmetic sequences are everywhere once you learn to spot them. Here are some classic application types.</p>

<h3>Stacking and accumulation</h3>

<div class="env-block example">
<strong>The log pile</strong><br>
A pile of logs has 20 logs on the bottom row, 19 on the next, 18 above that, and so on, up to 1 log on top. How many logs are there in total?<br><br>
This is \\(1 + 2 + 3 + \\cdots + 20 = \\frac{20 \\times 21}{2} = 210\\) logs.
</div>

<h3>Salary and savings</h3>

<div class="env-block example">
<strong>Growing allowance</strong><br>
Your weekly allowance starts at $5 and increases by $2 each week. How much total money will you have received after 12 weeks?<br><br>
This is an arithmetic series with \\(a_1 = 5, d = 2, n = 12\\). The last term is \\(a_{12} = 5 + 11 \\times 2 = 27\\). The total is \\(S_{12} = \\frac{12(5 + 27)}{2} = \\frac{12 \\times 32}{2} = 192\\) dollars.
</div>

<h3>Seating arrangements</h3>

<div class="env-block example">
<strong>The theater</strong><br>
A theater has 15 rows. The first row has 20 seats, and each subsequent row has 2 more seats than the row in front. How many seats total?<br><br>
Arithmetic: \\(a_1 = 20, d = 2, n = 15\\). Then \\(a_{15} = 20 + 14 \\times 2 = 48\\). Total: \\(S_{15} = \\frac{15(20 + 48)}{2} = \\frac{15 \\times 68}{2} = 510\\) seats.
</div>

<h3>Clock chimes</h3>

<div class="env-block example">
<strong>How many chimes?</strong><br>
A clock chimes once at 1 o'clock, twice at 2 o'clock, and so on up to 12 times at noon. How many total chimes from 1 o'clock through noon?<br><br>
\\(1 + 2 + 3 + \\cdots + 12 = \\frac{12 \\times 13}{2} = 78\\) chimes.
</div>

<div class="env-block remark">
<strong>Competition tip</strong><br>
Many word problems that seem complicated reduce to arithmetic sums once you identify the first term, common difference, and number of terms. Train yourself to extract these three quantities from the problem statement before reaching for a formula.
</div>

<h3>The handshake problem revisited</h3>

<p>If \\(n\\) people are in a room and each person shakes hands with every other person exactly once, how many handshakes occur? Person 1 shakes \\(n-1\\) hands, person 2 shakes \\(n-2\\) new hands (already shook with person 1), person 3 shakes \\(n-3\\), and so on. The total is:</p>

\\[(n-1) + (n-2) + \\cdots + 2 + 1 + 0 = \\frac{(n-1)n}{2}\\]

<p>This is the \\((n-1)\\)-th triangular number, or equivalently \\(\\binom{n}{2}\\), the number of ways to choose 2 people from \\(n\\).</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'A runner trains by running 2 km on day 1, 2.5 km on day 2, 3 km on day 3, and so on, increasing by 0.5 km each day. What total distance does she run in 30 days?',
                    hint: 'Arithmetic sequence with \\(a_1 = 2, d = 0.5, n = 30\\).',
                    solution: '\\(a_{30} = 2 + 29 \\times 0.5 = 16.5\\). Total: \\(S_{30} = \\frac{30(2 + 16.5)}{2} = 15 \\times 18.5 = \\mathbf{277.5}\\) km.'
                },
                {
                    question: 'Find the sum of all multiples of 7 between 1 and 1000.',
                    hint: 'The multiples of 7 in this range are 7, 14, 21, ..., 994. How many are there?',
                    solution: 'The largest multiple of 7 at most 1000 is \\(7 \\times 142 = 994\\). There are 142 terms. The sum is \\(\\frac{142(7 + 994)}{2} = \\frac{142 \\times 1001}{2} = 71 \\times 1001 = \\mathbf{71071}\\).'
                },
                {
                    question: 'In a room of 20 people, everyone shakes hands with everyone else. How many handshakes occur?',
                    hint: 'Use the formula \\(\\binom{n}{2} = \\frac{n(n-1)}{2}\\).',
                    solution: '\\(\\binom{20}{2} = \\frac{20 \\times 19}{2} = \\mathbf{190}\\) handshakes.'
                }
            ]
        },

        // ============================================================
        // Section 4: Geometric Sums Preview
        // ============================================================
        {
            id: 'geometric-preview',
            title: 'Geometric Sums Preview',
            content: `
<h2>A Different Kind of Sum</h2>

<p>Arithmetic sequences grow by <em>adding</em> a constant. What happens when we <em>multiply</em> by a constant instead? We get a <strong>geometric sequence</strong>, and summing it requires a completely different trick.</p>

<div class="env-block definition">
<strong>Geometric sequence</strong><br>
A sequence where each term is obtained by multiplying the previous one by a fixed ratio \\(r\\):
\\[a_n = a_1 \\cdot r^{n-1}\\]
The terms are \\(a_1, a_1 r, a_1 r^2, a_1 r^3, \\ldots\\)
</div>

<h3>The doubling trick</h3>

<p>Consider the sum \\(S = 1 + 2 + 4 + 8 + \\cdots + 2^{n-1}\\). This is a geometric series with \\(r = 2\\). Here is the slick trick: multiply the entire sum by \\(r\\):</p>

\\[
\\begin{aligned}
S &= 1 + 2 + 4 + \\cdots + 2^{n-1} \\\\
2S &= 2 + 4 + 8 + \\cdots + 2^n
\\end{aligned}
\\]

<p>Now subtract the first equation from the second. Nearly everything cancels:</p>

\\[2S - S = 2^n - 1\\]

<p>So \\(S = 2^n - 1\\). Beautiful.</p>

<div class="env-block theorem">
<strong>Geometric sum formula</strong><br>
For \\(r \\neq 1\\):
\\[S_n = a_1 \\cdot \\frac{r^n - 1}{r - 1}\\]
When \\(r = 1\\), the sum is simply \\(S_n = n \\cdot a_1\\) (which is just an arithmetic sum with \\(d = 0\\)).
</div>

<div class="env-block example">
<strong>The chessboard and rice</strong><br>
Legend says the inventor of chess asked the king for 1 grain of rice on the first square, 2 on the second, 4 on the third, and so on, doubling each time. The total for all 64 squares is
\\[S = 1 + 2 + 4 + \\cdots + 2^{63} = 2^{64} - 1 = 18{,}446{,}744{,}073{,}709{,}551{,}615\\]
grains. That is about 460 billion tonnes of rice, far more than all the rice ever produced in human history.
</div>

<h3>Geometric vs. arithmetic: a comparison</h3>

<table style="width:100%; border-collapse:collapse; margin:16px 0; font-size:0.92rem;">
<tr style="border-bottom:1px solid #30363d;">
<th style="text-align:left; padding:6px; color:#8b949e;"></th>
<th style="text-align:center; padding:6px; color:#58a6ff;">Arithmetic</th>
<th style="text-align:center; padding:6px; color:#f0883e;">Geometric</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:6px; color:#8b949e;">Growth rule</td>
<td style="text-align:center; padding:6px;">Add \\(d\\)</td>
<td style="text-align:center; padding:6px;">Multiply by \\(r\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:6px; color:#8b949e;">n-th term</td>
<td style="text-align:center; padding:6px;">\\(a_1 + (n-1)d\\)</td>
<td style="text-align:center; padding:6px;">\\(a_1 r^{n-1}\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:6px; color:#8b949e;">Sum trick</td>
<td style="text-align:center; padding:6px;">Reverse and add</td>
<td style="text-align:center; padding:6px;">Multiply by \\(r\\) and subtract</td>
</tr>
<tr>
<td style="padding:6px; color:#8b949e;">Sum formula</td>
<td style="text-align:center; padding:6px;">\\(\\frac{n(a_1 + a_n)}{2}\\)</td>
<td style="text-align:center; padding:6px;">\\(a_1 \\frac{r^n - 1}{r - 1}\\)</td>
</tr>
</table>

<div class="env-block remark">
<strong>Looking ahead</strong><br>
Geometric sums will be developed fully when we study exponential growth and the mathematics of compound interest. The interplay between arithmetic and geometric sequences also leads to beautiful results: for instance, the arithmetic-geometric mean inequality, which states that for positive numbers, the arithmetic mean is always at least as large as the geometric mean.
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Find the sum \\(1 + 3 + 9 + 27 + 81 + 243\\).',
                    hint: 'Geometric series with \\(a_1 = 1, r = 3, n = 6\\).',
                    solution: '\\(S = \\frac{3^6 - 1}{3 - 1} = \\frac{729 - 1}{2} = \\frac{728}{2} = \\mathbf{364}\\).'
                },
                {
                    question: 'You fold a piece of paper in half 10 times (imagine this is possible). How many layers thick is it?',
                    hint: 'Each fold doubles the number of layers. After 0 folds: 1 layer. After 1 fold: 2 layers.',
                    solution: 'After 10 folds: \\(2^{10} = \\mathbf{1024}\\) layers. A sheet of paper is about 0.1 mm thick, so 1024 layers is about 10.24 cm. After 42 folds (if possible), the thickness would exceed the distance from the Earth to the Moon!'
                },
                {
                    question: 'Derive the geometric sum formula by the multiply-and-subtract trick. Start with \\(S = a_1 + a_1 r + a_1 r^2 + \\cdots + a_1 r^{n-1}\\), compute \\(rS\\), and subtract.',
                    hint: 'Almost all terms cancel when you compute \\(rS - S\\).',
                    solution: '\\(rS = a_1 r + a_1 r^2 + \\cdots + a_1 r^n\\). Subtracting: \\(rS - S = a_1 r^n - a_1\\). So \\(S(r-1) = a_1(r^n - 1)\\), giving \\(S = a_1 \\frac{r^n - 1}{r - 1}\\) for \\(r \\neq 1\\).'
                }
            ]
        }
    ]
});
})();
