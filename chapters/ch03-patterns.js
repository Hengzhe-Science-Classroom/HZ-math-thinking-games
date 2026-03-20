// === Chapter 3: Spot the Pattern ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch03-patterns',
    number: 3,
    title: 'Spot the Pattern',
    subtitle: 'The secret language of sequences',
    sections: [
        // ================================================================
        // SECTION 1: Why Patterns Matter (Motivation)
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Patterns Matter',
            content: `
<h2>Why Patterns Matter</h2>

<div class="env-block intuition">
    <div class="env-title">A Challenge</div>
    <div class="env-body">
        <p>Look at this list of numbers: 1, 1, 2, 3, 5, 8, 13, 21, ...</p>
        <p>What comes next? Most people see it quickly: each number is the sum of the two before it. That moment of recognition, where chaos collapses into a rule, is the heart of mathematical thinking.</p>
    </div>
</div>

<p>Patterns are everywhere. The planets follow elliptical orbits. The primes thin out among the integers in a predictable way. A crystal's atoms repeat in a lattice. Music is built on repeating rhythms and harmonies. Mathematics gives us the language to describe these regularities precisely and the tools to prove they hold universally.</p>

<p>In this chapter we explore several families of patterns that arise naturally in mathematics:</p>

<ol>
    <li><strong>Arithmetic sequences</strong>, where the difference between consecutive terms is constant.</li>
    <li><strong>Geometric sequences</strong>, where the ratio between consecutive terms is constant.</li>
    <li><strong>Figurate numbers</strong>, which count dots arranged in geometric shapes.</li>
    <li><strong>Surprising patterns</strong> that defy easy classification, including the look-and-say sequence, the Collatz conjecture, and happy numbers.</li>
</ol>

<p>Before diving into specific families, try the interactive sequence guesser below. You will see the first few terms of a mystery sequence. Your job is to predict what comes next.</p>

<div class="viz-placeholder" data-viz="viz-sequence-guesser"></div>

<div class="env-block remark">
    <div class="env-title">A Word of Caution</div>
    <div class="env-body">
        <p>Given any finite list of numbers, infinitely many rules produce that list. The sequence 1, 2, 4 could continue as 8 (doubling), 7 (add 1, add 2, add 3, ...), or literally anything else. When we say "find the pattern," we mean find the <em>simplest, most natural</em> rule. In mathematics, simplicity is a powerful guide.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-sequence-guesser',
                    title: 'Sequence Guesser',
                    description: 'You are shown the first few terms of a sequence. Type your guess for the next term and press Check.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var sequences = [
                            { terms: [2, 5, 8, 11, 14], next: 17, rule: 'Arithmetic: add 3 each time' },
                            { terms: [3, 9, 27, 81, 243], next: 729, rule: 'Geometric: multiply by 3' },
                            { terms: [1, 3, 6, 10, 15], next: 21, rule: 'Triangular numbers: add 2, 3, 4, 5, 6' },
                            { terms: [1, 4, 9, 16, 25], next: 36, rule: 'Perfect squares: n\u00B2' },
                            { terms: [2, 6, 12, 20, 30], next: 42, rule: 'n(n+1): oblong numbers' },
                            { terms: [1, 1, 2, 3, 5], next: 8, rule: 'Fibonacci: each = sum of previous two' },
                            { terms: [1, 8, 27, 64, 125], next: 216, rule: 'Perfect cubes: n\u00B3' },
                            { terms: [1, 2, 4, 8, 16], next: 32, rule: 'Powers of 2' },
                            { terms: [2, 3, 5, 7, 11], next: 13, rule: 'Prime numbers' },
                            { terms: [1, 4, 10, 20, 35], next: 56, rule: 'Tetrahedral numbers: C(n+2,3)' },
                            { terms: [0, 1, 1, 2, 3], next: 5, rule: 'Fibonacci (starting from 0)' },
                            { terms: [1, 3, 7, 15, 31], next: 63, rule: '2\u207F \u2212 1' }
                        ];

                        var idx = 0;
                        var feedback = '';
                        var feedbackColor = '';
                        var showRule = false;
                        var score = 0;
                        var total = 0;

                        // Input
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'margin-top:8px;display:flex;gap:8px;align-items:center;justify-content:center;';
                        var input = document.createElement('input');
                        input.type = 'number';
                        input.placeholder = 'Your guess...';
                        input.style.cssText = 'width:120px;padding:6px 10px;border:1px solid #30363d;border-radius:4px;background:#161b22;color:#f0f6fc;font-size:1rem;text-align:center;';
                        inputDiv.appendChild(input);
                        var checkBtn = VizEngine.createButton(inputDiv, 'Check', doCheck);
                        var nextBtn = VizEngine.createButton(inputDiv, 'Next', doNext);
                        body.appendChild(inputDiv);

                        function doCheck() {
                            var guess = parseInt(input.value);
                            if (isNaN(guess)) return;
                            total++;
                            var seq = sequences[idx];
                            if (guess === seq.next) {
                                feedback = 'Correct!';
                                feedbackColor = viz.colors.green;
                                score++;
                                showRule = true;
                            } else {
                                feedback = 'Not quite. The answer is ' + seq.next;
                                feedbackColor = viz.colors.red;
                                showRule = true;
                            }
                            draw();
                        }

                        function doNext() {
                            idx = (idx + 1) % sequences.length;
                            feedback = '';
                            showRule = false;
                            input.value = '';
                            draw();
                        }

                        input.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') doCheck();
                        });

                        function draw() {
                            viz.clear();
                            var seq = sequences[idx];

                            // Title
                            viz.screenText('What comes next?', w / 2, 30, viz.colors.white, 16);

                            // Terms
                            var termStr = seq.terms.join(',  ') + ',  ?';
                            viz.screenText(termStr, w / 2, h * 0.35, viz.colors.blue, 22);

                            // Score
                            viz.screenText('Score: ' + score + ' / ' + total, w - 80, 25, viz.colors.text, 12);

                            // Feedback
                            if (feedback) {
                                viz.screenText(feedback, w / 2, h * 0.55, feedbackColor, 16);
                            }
                            if (showRule) {
                                viz.screenText('Rule: ' + seq.rule, w / 2, h * 0.68, viz.colors.orange, 13);
                            }

                            // Sequence number
                            viz.screenText('Sequence ' + (idx + 1) + ' of ' + sequences.length, w / 2, h - 20, viz.colors.text, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: []
        },

        // ================================================================
        // SECTION 2: Arithmetic Sequences
        // ================================================================
        {
            id: 'sec-arithmetic',
            title: 'Arithmetic Sequences',
            content: `
<h2>Arithmetic Sequences</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Arithmetic Sequence)</div>
    <div class="env-body">
        <p>An <strong>arithmetic sequence</strong> is a sequence where each term differs from the previous one by a fixed amount \\(d\\), called the <strong>common difference</strong>:</p>
        \\[a_n = a_1 + (n - 1)d.\\]
        <p>Equivalently, \\(a_{n+1} - a_n = d\\) for all \\(n\\).</p>
    </div>
</div>

<p>Arithmetic sequences are the simplest type of pattern: constant growth (or decline). They model situations like:</p>
<ul>
    <li>Saving a fixed amount each month: \\$100, \\$200, \\$300, ...</li>
    <li>Temperature rising 2 degrees each hour: 10, 12, 14, 16, ...</li>
    <li>Seat numbers in a row: 1, 2, 3, 4, ...</li>
</ul>

<div class="env-block theorem">
    <div class="env-title">Sum of an Arithmetic Sequence</div>
    <div class="env-body">
        <p>The sum of the first \\(n\\) terms of an arithmetic sequence with first term \\(a_1\\) and common difference \\(d\\) is</p>
        \\[S_n = \\frac{n}{2}(2a_1 + (n-1)d) = \\frac{n(a_1 + a_n)}{2}.\\]
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">Gauss's Trick</div>
    <div class="env-body">
        <p>The young Gauss reportedly computed \\(1 + 2 + 3 + \\cdots + 100\\) by pairing the first and last terms: \\(1 + 100 = 101\\), \\(2 + 99 = 101\\), ..., giving 50 pairs of 101, so the sum is \\(50 \\times 101 = 5050\\). The formula above is exactly this trick generalized.</p>
    </div>
</div>

<p>Use the visualization below to build your own arithmetic sequence. Adjust the first term \\(a_1\\) and the common difference \\(d\\), and watch the sequence grow.</p>

<div class="viz-placeholder" data-viz="viz-arithmetic-builder"></div>
`,
            visualizations: [
                {
                    id: 'viz-arithmetic-builder',
                    title: 'Arithmetic Sequence Builder',
                    description: 'Set the first term and common difference to build an arithmetic sequence. The sum formula is computed live.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 60, originY: 320, scale: 1
                        });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var a1 = 2;
                        var d = 3;
                        var nTerms = 10;

                        VizEngine.createSlider(controls, 'a\u2081', -5, 10, a1, 1, function(v) {
                            a1 = Math.round(v); draw();
                        });
                        VizEngine.createSlider(controls, 'd', -5, 5, d, 1, function(v) {
                            d = Math.round(v); draw();
                        });
                        VizEngine.createSlider(controls, 'Terms', 3, 15, nTerms, 1, function(v) {
                            nTerms = Math.round(v); draw();
                        });

                        function draw() {
                            viz.clear();
                            var terms = [];
                            for (var i = 0; i < nTerms; i++) {
                                terms.push(a1 + i * d);
                            }

                            // Find range
                            var minVal = Math.min.apply(null, terms);
                            var maxVal = Math.max.apply(null, terms);
                            var range = maxVal - minVal || 1;

                            // Chart area
                            var chartL = 60, chartR = w - 30;
                            var chartT = 50, chartB = h - 60;
                            var chartW = chartR - chartL;
                            var chartH = chartB - chartT;

                            // Title
                            viz.screenText('Arithmetic Sequence: a\u2099 = ' + a1 + ' + (n\u22121)\u00B7' + (d >= 0 ? d : '(' + d + ')'), w / 2, 22, viz.colors.white, 14);

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartB);
                            ctx.lineTo(chartR, chartB);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartB);
                            ctx.lineTo(chartL, chartT);
                            ctx.stroke();

                            // Plot points and bars
                            var barW = Math.min(30, chartW / nTerms * 0.7);
                            var zeroY = chartB;
                            if (minVal < 0 && maxVal > 0) {
                                zeroY = chartB - (-minVal / range) * chartH;
                                ctx.strokeStyle = viz.colors.text + '44';
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath();
                                ctx.moveTo(chartL, zeroY);
                                ctx.lineTo(chartR, zeroY);
                                ctx.stroke();
                                ctx.setLineDash([]);
                            } else if (maxVal <= 0) {
                                zeroY = chartT;
                            }

                            for (var i = 0; i < nTerms; i++) {
                                var x = chartL + (i + 0.5) * chartW / nTerms;
                                var valNorm = range === 0 ? 0.5 : (terms[i] - minVal) / range;
                                var y = chartB - valNorm * chartH;

                                // Bar
                                ctx.fillStyle = viz.colors.blue + '66';
                                var barTop = Math.min(y, zeroY);
                                var barH2 = Math.abs(y - zeroY);
                                ctx.fillRect(x - barW / 2, barTop, barW, barH2);

                                // Point
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath();
                                ctx.arc(x, y, 4, 0, Math.PI * 2);
                                ctx.fill();

                                // Value label
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = terms[i] >= 0 ? 'bottom' : 'top';
                                ctx.fillText(terms[i].toString(), x, terms[i] >= 0 ? y - 6 : y + 6);

                                // Index label
                                ctx.fillStyle = viz.colors.text;
                                ctx.textBaseline = 'top';
                                ctx.fillText((i + 1).toString(), x, chartB + 4);
                            }

                            // Connect with line
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var i = 0; i < nTerms; i++) {
                                var x = chartL + (i + 0.5) * chartW / nTerms;
                                var valNorm = range === 0 ? 0.5 : (terms[i] - minVal) / range;
                                var y = chartB - valNorm * chartH;
                                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                            }
                            ctx.stroke();

                            // Sum
                            var sum = nTerms * (2 * a1 + (nTerms - 1) * d) / 2;
                            viz.screenText('Sum of ' + nTerms + ' terms: S = ' + sum, w / 2, chartB + 35, viz.colors.orange, 13);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the 50th term of the arithmetic sequence 7, 11, 15, 19, ...',
                    hint: 'Identify \\(a_1 = 7\\) and \\(d = 4\\), then use \\(a_n = a_1 + (n-1)d\\).',
                    solution: '\\(a_{50} = 7 + 49 \\times 4 = 7 + 196 = 203\\).'
                },
                {
                    question: 'The sum of the first \\(n\\) terms of an arithmetic sequence is \\(S_n = 3n^2 + 2n\\). Find the common difference \\(d\\).',
                    hint: 'Compute \\(a_n = S_n - S_{n-1}\\) for \\(n \\geq 2\\) and then check \\(a_2 - a_1\\).',
                    solution: '\\(a_1 = S_1 = 5\\). For \\(n \\geq 2\\), \\(a_n = S_n - S_{n-1} = 3n^2 + 2n - 3(n-1)^2 - 2(n-1) = 6n - 1\\). So \\(a_2 = 11\\), \\(d = a_2 - a_1 = 6\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Geometric Sequences
        // ================================================================
        {
            id: 'sec-geometric',
            title: 'Geometric Sequences',
            content: `
<h2>Geometric Sequences</h2>

<div class="env-block definition">
    <div class="env-title">Definition (Geometric Sequence)</div>
    <div class="env-body">
        <p>A <strong>geometric sequence</strong> is a sequence where each term is obtained by multiplying the previous term by a fixed number \\(r\\), called the <strong>common ratio</strong>:</p>
        \\[a_n = a_1 \\cdot r^{n-1}.\\]
        <p>Equivalently, \\(a_{n+1} / a_n = r\\) for all \\(n\\) (assuming no term is zero).</p>
    </div>
</div>

<p>Geometric sequences model multiplicative growth or decay:</p>
<ul>
    <li>Compound interest: a balance growing by 5% per year, \\(r = 1.05\\).</li>
    <li>Radioactive decay: half the material remains each half-life, \\(r = 0.5\\).</li>
    <li>A bouncing ball that reaches 80% of its previous height, \\(r = 0.8\\).</li>
</ul>

<div class="env-block theorem">
    <div class="env-title">Sum of a Geometric Sequence</div>
    <div class="env-body">
        <p>If \\(r \\neq 1\\), the sum of the first \\(n\\) terms is</p>
        \\[S_n = a_1 \\cdot \\frac{1 - r^n}{1 - r}.\\]
        <p>If \\(|r| < 1\\), the infinite sum converges to \\(S_\\infty = \\frac{a_1}{1 - r}\\).</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Zeno's Paradox</div>
    <div class="env-body">
        <p>To walk across a room, you first cross half the distance, then half of what remains, then half again: \\(\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\cdots\\). This is a geometric series with \\(a_1 = 1/2\\) and \\(r = 1/2\\). The sum is \\(\\frac{1/2}{1 - 1/2} = 1\\). You do reach the other side.</p>
    </div>
</div>

<p>Build your own geometric sequence below. Notice how quickly terms grow (when \\(|r| > 1\\)) or shrink (when \\(|r| < 1\\)). Negative \\(r\\) produces alternating signs.</p>

<div class="viz-placeholder" data-viz="viz-geometric-builder"></div>
`,
            visualizations: [
                {
                    id: 'viz-geometric-builder',
                    title: 'Geometric Sequence Builder',
                    description: 'Set the first term and common ratio to build a geometric sequence. Watch exponential growth or decay.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 360,
                            originX: 60, originY: 300, scale: 1
                        });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var a1 = 2;
                        var r = 2;
                        var nTerms = 8;

                        VizEngine.createSlider(controls, 'a\u2081', 0.5, 10, a1, 0.5, function(v) {
                            a1 = parseFloat(v); draw();
                        });
                        VizEngine.createSlider(controls, 'r', -3, 3, r, 0.1, function(v) {
                            r = parseFloat(v); draw();
                        });
                        VizEngine.createSlider(controls, 'Terms', 3, 12, nTerms, 1, function(v) {
                            nTerms = Math.round(v); draw();
                        });

                        function draw() {
                            viz.clear();

                            var terms = [];
                            var val = a1;
                            for (var i = 0; i < nTerms; i++) {
                                terms.push(val);
                                val *= r;
                            }

                            // Find range for plotting
                            var absMax = 0;
                            for (var i = 0; i < nTerms; i++) {
                                absMax = Math.max(absMax, Math.abs(terms[i]));
                            }
                            if (absMax < 1) absMax = 1;

                            // Use log scale if range is huge
                            var useLog = (absMax / Math.abs(a1) > 100);

                            var chartL = 70, chartR = w - 30;
                            var chartT = 50, chartB = h - 60;
                            var chartW = chartR - chartL;
                            var chartH = chartB - chartT;
                            var midY = (chartT + chartB) / 2;

                            // Title
                            var rStr = r % 1 === 0 ? r.toString() : r.toFixed(1);
                            viz.screenText('Geometric: a\u2099 = ' + a1 + ' \u00B7 ' + rStr + '\u207F\u207B\u00B9', w / 2, 22, viz.colors.white, 14);

                            // Zero line
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartL, midY);
                            ctx.lineTo(chartR, midY);
                            ctx.stroke();

                            // Plot
                            var barW = Math.min(28, chartW / nTerms * 0.6);
                            var pts = [];
                            for (var i = 0; i < nTerms; i++) {
                                var x = chartL + (i + 0.5) * chartW / nTerms;
                                var normVal;
                                if (useLog) {
                                    normVal = terms[i] === 0 ? 0 : (Math.sign(terms[i]) * Math.log10(1 + Math.abs(terms[i])) / Math.log10(1 + absMax));
                                } else {
                                    normVal = terms[i] / absMax;
                                }
                                var y = midY - normVal * (chartH / 2 - 10);

                                pts.push([x, y]);

                                // Bar
                                ctx.fillStyle = terms[i] >= 0 ? viz.colors.purple + '55' : viz.colors.red + '55';
                                ctx.fillRect(x - barW / 2, Math.min(y, midY), barW, Math.abs(y - midY));

                                // Point
                                ctx.fillStyle = terms[i] >= 0 ? viz.colors.purple : viz.colors.red;
                                ctx.beginPath();
                                ctx.arc(x, y, 4, 0, Math.PI * 2);
                                ctx.fill();

                                // Value
                                var displayVal = Math.abs(terms[i]) >= 1000 ? terms[i].toExponential(1) : (Math.abs(terms[i]) < 0.01 && terms[i] !== 0 ? terms[i].toExponential(1) : (Number.isInteger(terms[i]) ? terms[i].toString() : terms[i].toFixed(2)));
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = terms[i] >= 0 ? 'bottom' : 'top';
                                ctx.fillText(displayVal, x, terms[i] >= 0 ? y - 6 : y + 8);

                                // Index
                                ctx.fillStyle = viz.colors.text;
                                ctx.textBaseline = 'top';
                                ctx.fillText((i + 1).toString(), x, chartB + 4);
                            }

                            // Connect
                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var i = 0; i < pts.length; i++) {
                                i === 0 ? ctx.moveTo(pts[i][0], pts[i][1]) : ctx.lineTo(pts[i][0], pts[i][1]);
                            }
                            ctx.stroke();

                            // Sum
                            var sum;
                            if (Math.abs(r - 1) < 0.001) {
                                sum = a1 * nTerms;
                            } else {
                                sum = a1 * (1 - Math.pow(r, nTerms)) / (1 - r);
                            }
                            var sumStr = Math.abs(sum) >= 10000 ? sum.toExponential(2) : (Number.isInteger(sum) ? sum.toString() : sum.toFixed(2));
                            viz.screenText('Sum of ' + nTerms + ' terms: S = ' + sumStr, w / 2, chartB + 35, viz.colors.orange, 13);
                            if (useLog) {
                                viz.screenText('(log scale)', chartL - 5, chartT - 8, viz.colors.text, 9, 'left');
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A geometric sequence has \\(a_1 = 5\\) and \\(r = 3\\). Find the 6th term.',
                    hint: 'Use \\(a_n = a_1 \\cdot r^{n-1}\\).',
                    solution: '\\(a_6 = 5 \\cdot 3^5 = 5 \\cdot 243 = 1215\\).'
                },
                {
                    question: 'Find the sum \\(1 + \\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\cdots\\) (infinitely many terms).',
                    hint: 'This is a geometric series with \\(a_1 = 1\\) and \\(r = 1/2\\). Use \\(S_\\infty = a_1 / (1 - r)\\).',
                    solution: '\\(S_\\infty = \\frac{1}{1 - 1/2} = 2\\).'
                },
                {
                    question: 'A ball is dropped from 10 meters. After each bounce it reaches 60% of its previous height. What is the total distance the ball travels before coming to rest?',
                    hint: 'The ball falls 10 m, then bounces up \\(10 \\times 0.6 = 6\\) m and falls 6 m, then bounces up \\(6 \\times 0.6 = 3.6\\) m and falls 3.6 m, etc. Sum the down distances and the up distances separately.',
                    solution: 'Down: \\(10 + 6 + 3.6 + \\cdots = \\frac{10}{1 - 0.6} = 25\\). Up: \\(6 + 3.6 + \\cdots = \\frac{6}{1 - 0.6} = 15\\). Total: \\(25 + 15 = 40\\) meters.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Figurate Numbers
        // ================================================================
        {
            id: 'sec-figurate',
            title: 'Figurate Numbers',
            content: `
<h2>Figurate Numbers</h2>

<p>Some of the oldest patterns in mathematics come from arranging dots in geometric shapes. The ancient Greeks studied these extensively, and they remain a rich source of insight.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Figurate Numbers)</div>
    <div class="env-body">
        <p><strong>Figurate numbers</strong> count the dots needed to fill a regular geometric shape of increasing size:</p>
        <ul>
            <li><strong>Triangular numbers:</strong> \\(T_n = 1 + 2 + 3 + \\cdots + n = \\frac{n(n+1)}{2}\\). Values: 1, 3, 6, 10, 15, 21, ...</li>
            <li><strong>Square numbers:</strong> \\(S_n = n^2\\). Values: 1, 4, 9, 16, 25, ...</li>
            <li><strong>Pentagonal numbers:</strong> \\(P_n = \\frac{n(3n-1)}{2}\\). Values: 1, 5, 12, 22, 35, ...</li>
        </ul>
    </div>
</div>

<div class="env-block theorem">
    <div class="env-title">A Beautiful Connection</div>
    <div class="env-body">
        <p>Every square number is the sum of two consecutive triangular numbers:</p>
        \\[n^2 = T_{n-1} + T_n = \\frac{(n-1)n}{2} + \\frac{n(n+1)}{2}.\\]
        <p>Visually, you can split a square grid along its diagonal into two triangles.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Triangular Numbers and Handshakes</div>
    <div class="env-body">
        <p>In a room with \\(n\\) people, if everyone shakes hands with everyone else, the total number of handshakes is \\(\\binom{n}{2} = T_{n-1} = \\frac{n(n-1)}{2}\\). With 10 people: \\(T_9 = 45\\) handshakes.</p>
    </div>
</div>

<p>The visualization below builds triangular, square, and pentagonal numbers using animated dots. Select a shape type and watch the pattern grow.</p>

<div class="viz-placeholder" data-viz="viz-figurate-dots"></div>
`,
            visualizations: [
                {
                    id: 'viz-figurate-dots',
                    title: 'Figurate Numbers with Dots',
                    description: 'Watch triangular, square, and pentagonal numbers form as dots are arranged into geometric shapes.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var shapeType = 'triangular';
                        var nLevel = 5;
                        var animT = 1;
                        var animating = false;

                        // Shape selector buttons
                        var btnDiv = document.createElement('div');
                        btnDiv.style.cssText = 'display:flex;gap:6px;justify-content:center;margin-bottom:4px;';
                        ['triangular', 'square', 'pentagonal'].forEach(function(s) {
                            VizEngine.createButton(btnDiv, s.charAt(0).toUpperCase() + s.slice(1), function() {
                                shapeType = s;
                                animT = 0;
                                animating = true;
                            });
                        });
                        controls.appendChild(btnDiv);

                        VizEngine.createSlider(controls, 'n', 1, 8, nLevel, 1, function(v) {
                            nLevel = Math.round(v);
                            animT = 0;
                            animating = true;
                        });

                        function triangularDots(n) {
                            var dots = [];
                            for (var row = 0; row < n; row++) {
                                for (var col = 0; col <= row; col++) {
                                    dots.push([col - row / 2, -row]);
                                }
                            }
                            return dots;
                        }

                        function squareDots(n) {
                            var dots = [];
                            for (var row = 0; row < n; row++) {
                                for (var col = 0; col < n; col++) {
                                    dots.push([col - (n - 1) / 2, -row]);
                                }
                            }
                            return dots;
                        }

                        function pentagonalDots(n) {
                            var dots = [];
                            // Build layer by layer
                            if (n >= 1) dots.push([0, 0]);
                            for (var k = 2; k <= n; k++) {
                                // Top edge
                                for (var i = 0; i < k; i++) {
                                    var x = i - (k - 1) / 2;
                                    var y = (k - 1);
                                    dots.push([x, y]);
                                }
                                // Left and right edges
                                for (var j = 1; j < k - 1; j++) {
                                    var frac = j / (k - 1);
                                    // Left side
                                    var lx = -(k - 1) / 2 - j * 0.3;
                                    var ly = (k - 1) - j;
                                    dots.push([lx, ly]);
                                    // Right side
                                    var rx = (k - 1) / 2 + j * 0.3;
                                    dots.push([rx, ly]);
                                }
                                // Bottom vertices (two bottom edges meeting at bottom)
                                for (var i = 0; i < k - 1; i++) {
                                    var frac2 = i / (k - 1);
                                    // Bottom-left edge
                                    var blx = -(k - 1) / 2 - (k - 2) * 0.3 * (1 - frac2);
                                    var bly = -frac2 * (k - 2) * 0.5;
                                    if (i > 0) dots.push([blx, bly]);
                                    // Bottom-right edge
                                    var brx = (k - 1) / 2 + (k - 2) * 0.3 * (1 - frac2);
                                    if (i > 0) dots.push([brx, bly]);
                                }
                            }
                            return dots;
                        }

                        function getFormula(type, n) {
                            if (type === 'triangular') return n * (n + 1) / 2;
                            if (type === 'square') return n * n;
                            return n * (3 * n - 1) / 2;
                        }

                        function getDots(type, n) {
                            if (type === 'triangular') return triangularDots(n);
                            if (type === 'square') return squareDots(n);
                            return pentagonalDots(n);
                        }

                        function draw() {
                            viz.clear();

                            // Title
                            var label = shapeType.charAt(0).toUpperCase() + shapeType.slice(1);
                            var count = getFormula(shapeType, nLevel);
                            viz.screenText(label + ' Number: n = ' + nLevel + ', count = ' + count, w / 2, 25, viz.colors.white, 15);

                            // Formula
                            var formulaStr = '';
                            if (shapeType === 'triangular') formulaStr = 'T(n) = n(n+1)/2';
                            else if (shapeType === 'square') formulaStr = 'S(n) = n\u00B2';
                            else formulaStr = 'P(n) = n(3n\u22121)/2';
                            viz.screenText(formulaStr, w / 2, 48, viz.colors.orange, 12);

                            // Draw dots
                            var dots = getDots(shapeType, nLevel);
                            var numVisible = Math.min(dots.length, Math.floor(dots.length * animT));

                            // Scale dots to fit
                            if (dots.length === 0) return;
                            var minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
                            for (var i = 0; i < dots.length; i++) {
                                minX = Math.min(minX, dots[i][0]);
                                maxX = Math.max(maxX, dots[i][0]);
                                minY = Math.min(minY, dots[i][1]);
                                maxY = Math.max(maxY, dots[i][1]);
                            }
                            var spanX = maxX - minX || 1;
                            var spanY = maxY - minY || 1;
                            var areaW = w - 80;
                            var areaH = h - 120;
                            var dotScale = Math.min(areaW / spanX, areaH / spanY, 50);
                            var dotR = Math.min(12, dotScale * 0.35);
                            var cx = w / 2;
                            var cy = 70 + areaH / 2;

                            var colors = [viz.colors.blue, viz.colors.teal, viz.colors.purple, viz.colors.green, viz.colors.orange, viz.colors.pink, viz.colors.red, viz.colors.yellow];

                            // Assign layers for coloring
                            var layerIdx = 0;
                            var layerCount = 0;
                            var layerSizes = [];
                            for (var k = 1; k <= nLevel; k++) {
                                layerSizes.push(getFormula(shapeType, k) - (k > 1 ? getFormula(shapeType, k - 1) : 0));
                            }

                            var dotLayerColor = [];
                            var cumDots = 0;
                            for (var k = 0; k < layerSizes.length; k++) {
                                for (var j = 0; j < layerSizes[k]; j++) {
                                    dotLayerColor.push(colors[k % colors.length]);
                                }
                            }

                            for (var i = 0; i < numVisible; i++) {
                                var sx = cx + (dots[i][0] - (minX + maxX) / 2) * dotScale;
                                var sy = cy + (dots[i][1] - (minY + maxY) / 2) * dotScale;
                                var col = dotLayerColor[i] || viz.colors.blue;

                                ctx.fillStyle = col + '33';
                                ctx.beginPath();
                                ctx.arc(sx, sy, dotR + 2, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = col;
                                ctx.beginPath();
                                ctx.arc(sx, sy, dotR, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Sequence at bottom
                            var seqStr = '';
                            for (var k = 1; k <= Math.min(nLevel + 2, 10); k++) {
                                if (k > 1) seqStr += ', ';
                                seqStr += getFormula(shapeType, k);
                            }
                            seqStr += ', ...';
                            viz.screenText(seqStr, w / 2, h - 25, viz.colors.teal, 13);
                        }

                        viz.animate(function(t) {
                            if (animating) {
                                animT = Math.min(1, animT + 0.03);
                                if (animT >= 1) animating = false;
                            }
                            draw();
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that the sum of the first \\(n\\) odd numbers equals \\(n^2\\). (Hint: the \\(k\\)-th odd number is \\(2k - 1\\).)',
                    hint: 'Compute \\(\\sum_{k=1}^n (2k-1) = 2 \\cdot \\frac{n(n+1)}{2} - n\\).',
                    solution: '\\(\\sum_{k=1}^n (2k - 1) = 2 \\cdot \\frac{n(n+1)}{2} - n = n^2 + n - n = n^2\\). Visually, each new L-shaped border of a square grid has \\(2n - 1\\) dots.'
                },
                {
                    question: 'Show that \\(T_n + T_{n-1} = n^2\\), where \\(T_n\\) is the \\(n\\)-th triangular number.',
                    hint: 'Write out the formulas and simplify.',
                    solution: '\\(T_n + T_{n-1} = \\frac{n(n+1)}{2} + \\frac{(n-1)n}{2} = \\frac{n(n+1) + n(n-1)}{2} = \\frac{n(2n)}{2} = n^2\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Surprising Patterns
        // ================================================================
        {
            id: 'sec-surprise',
            title: 'Surprising Patterns',
            content: `
<h2>Surprising Patterns</h2>

<p>Not all patterns fit neatly into formulas. Some of the most fascinating sequences in mathematics are those that seem to follow their own strange logic. We explore three here.</p>

<h3>The Look-and-Say Sequence</h3>

<p>Start with 1. Now <em>describe</em> what you see: "one 1," written as 11. Describe that: "two 1s," written as 21. Describe again: "one 2, one 1," written as 1211. Continue:</p>

<p style="text-align:center; font-size:1.1rem; color:#58a6ff;">1, 11, 21, 1211, 111221, 312211, ...</p>

<p>Each term is a verbal description of the previous term. John Conway proved that the length of the \\(n\\)-th term grows exponentially, with ratio approaching \\(\\lambda \\approx 1.303577\\) (Conway's constant). The sequence never contains a digit greater than 3.</p>

<div class="viz-placeholder" data-viz="viz-look-and-say"></div>

<h3>The Collatz Conjecture</h3>

<p>Pick any positive integer \\(n\\). If \\(n\\) is even, divide by 2. If \\(n\\) is odd, multiply by 3 and add 1. Repeat.</p>

<div class="env-block definition">
    <div class="env-title">Collatz Function</div>
    <div class="env-body">
        \\[f(n) = \\begin{cases} n/2 & \\text{if } n \\text{ is even} \\\\ 3n+1 & \\text{if } n \\text{ is odd} \\end{cases}\\]
    </div>
</div>

<p>The <strong>Collatz conjecture</strong> (1937) states that no matter what starting number you pick, the sequence will always eventually reach 1. Despite decades of work, nobody has been able to prove this. Paul Erdos said: "Mathematics is not yet ripe enough for such questions."</p>

<p>Try it yourself below. Enter any number and trace its Collatz journey.</p>

<div class="viz-placeholder" data-viz="viz-collatz"></div>

<h3>Happy Numbers</h3>

<p>Take any positive integer. Square each of its digits and sum the results. Repeat this process. If you eventually reach 1, the number is called <strong>happy</strong>. If not, you are trapped in a cycle.</p>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>Start with 23: \\(2^2 + 3^2 = 13 \\to 1^2 + 3^2 = 10 \\to 1^2 + 0^2 = 1\\). Happy!</p>
        <p>Start with 4: \\(4^2 = 16 \\to 1 + 36 = 37 \\to 9 + 49 = 58 \\to 25 + 64 = 89 \\to \\cdots \\to 4\\). Trapped in a cycle. Not happy.</p>
    </div>
</div>

<p>The unhappy numbers all eventually enter the cycle: 4, 16, 37, 58, 89, 145, 42, 20, 4, ... Try the interactive tracer below.</p>

<div class="viz-placeholder" data-viz="viz-happy-numbers"></div>
`,
            visualizations: [
                {
                    id: 'viz-look-and-say',
                    title: 'Look-and-Say Sequence',
                    description: 'Watch the look-and-say sequence generate itself, term by term. Each line describes the previous one.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var maxTerms = 10;
                        var visibleTerms = 1;
                        var terms = ['1'];

                        // Generate look-and-say sequence
                        function nextLAS(s) {
                            var result = '';
                            var i = 0;
                            while (i < s.length) {
                                var ch = s[i];
                                var count = 1;
                                while (i + count < s.length && s[i + count] === ch) count++;
                                result += count.toString() + ch;
                                i += count;
                            }
                            return result;
                        }

                        for (var i = 1; i < maxTerms; i++) {
                            terms.push(nextLAS(terms[i - 1]));
                        }

                        var stepBtn = VizEngine.createButton(controls, 'Next Term', function() {
                            if (visibleTerms < maxTerms) {
                                visibleTerms++;
                                draw();
                            }
                        });
                        var resetBtn = VizEngine.createButton(controls, 'Reset', function() {
                            visibleTerms = 1;
                            draw();
                        });

                        function draw() {
                            viz.clear();

                            viz.screenText('Look-and-Say Sequence', w / 2, 22, viz.colors.white, 15);
                            viz.screenText('Each line describes the digits of the line above it', w / 2, 42, viz.colors.text, 11);

                            var startY = 65;
                            var lineH = Math.min(30, (h - 80) / maxTerms);

                            for (var i = 0; i < visibleTerms; i++) {
                                var y = startY + i * lineH;
                                var term = terms[i];

                                // Term number
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText((i + 1) + '.', 30, y);

                                // Color-code groups (pairs of count+digit)
                                var groupColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.pink];
                                var fontSize = term.length > 40 ? 9 : (term.length > 20 ? 11 : 13);
                                ctx.font = fontSize + 'px -apple-system,monospace';
                                ctx.textAlign = 'left';

                                // Truncate if too long
                                var display = term.length > 50 ? term.substring(0, 48) + '...' : term;
                                var xPos = 40;

                                // Color-code by pairs
                                var pairIdx = 0;
                                for (var j = 0; j < display.length; j += 2) {
                                    var pair = display.substring(j, Math.min(j + 2, display.length));
                                    ctx.fillStyle = groupColors[pairIdx % groupColors.length];
                                    ctx.fillText(pair, xPos, y);
                                    xPos += ctx.measureText(pair).width + 1;
                                    pairIdx++;
                                }

                                // Length
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('(' + term.length + ')', w - 15, y);
                            }

                            // Growth info
                            if (visibleTerms > 1) {
                                var ratio = terms[visibleTerms - 1].length / terms[visibleTerms - 2].length;
                                viz.screenText('Growth ratio: ' + ratio.toFixed(3) + '  (Conway\u2019s constant \u2248 1.304)', w / 2, h - 15, viz.colors.orange, 11);
                            }
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-collatz',
                    title: 'Collatz Sequence Tracer',
                    description: 'Enter any positive integer and trace its Collatz sequence. Does it always reach 1?',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var startN = 27;
                        var sequence = [];

                        function computeCollatz(n) {
                            var seq = [n];
                            var limit = 500;
                            while (n !== 1 && seq.length < limit) {
                                n = (n % 2 === 0) ? n / 2 : 3 * n + 1;
                                seq.push(n);
                            }
                            return seq;
                        }

                        // Input
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;justify-content:center;';
                        var label = document.createElement('span');
                        label.textContent = 'Start: ';
                        label.style.color = '#8b949e';
                        label.style.fontSize = '0.85rem';
                        inputDiv.appendChild(label);
                        var input = document.createElement('input');
                        input.type = 'number';
                        input.value = startN;
                        input.min = 1;
                        input.style.cssText = 'width:80px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#161b22;color:#f0f6fc;font-size:0.9rem;text-align:center;';
                        inputDiv.appendChild(input);
                        VizEngine.createButton(inputDiv, 'Trace', function() {
                            var val = parseInt(input.value);
                            if (val >= 1 && val <= 100000) {
                                startN = val;
                                sequence = computeCollatz(startN);
                                draw();
                            }
                        });
                        controls.appendChild(inputDiv);

                        input.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') {
                                var val = parseInt(input.value);
                                if (val >= 1 && val <= 100000) {
                                    startN = val;
                                    sequence = computeCollatz(startN);
                                    draw();
                                }
                            }
                        });

                        sequence = computeCollatz(startN);

                        function draw() {
                            viz.clear();
                            var n = sequence.length;

                            viz.screenText('Collatz sequence starting at ' + startN, w / 2, 20, viz.colors.white, 14);
                            viz.screenText(n + ' steps to reach 1', w / 2, 40, viz.colors.teal, 12);

                            if (n === 0) return;

                            // Chart area
                            var chartL = 60, chartR = w - 20;
                            var chartT = 60, chartB = h - 40;
                            var chartW = chartR - chartL;
                            var chartH = chartB - chartT;

                            var maxVal = 0;
                            for (var i = 0; i < n; i++) {
                                maxVal = Math.max(maxVal, sequence[i]);
                            }

                            // Axes
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartB);
                            ctx.lineTo(chartR, chartB);
                            ctx.stroke();
                            ctx.beginPath();
                            ctx.moveTo(chartL, chartB);
                            ctx.lineTo(chartL, chartT);
                            ctx.stroke();

                            // Plot the sequence
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            for (var i = 0; i < n; i++) {
                                var x = chartL + i * chartW / (n - 1 || 1);
                                var y = chartB - (sequence[i] / maxVal) * chartH;
                                i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
                            }
                            ctx.stroke();

                            // Highlight even/odd
                            for (var i = 0; i < n; i++) {
                                var x = chartL + i * chartW / (n - 1 || 1);
                                var y = chartB - (sequence[i] / maxVal) * chartH;
                                if (n < 60) {
                                    ctx.fillStyle = sequence[i] % 2 === 0 ? viz.colors.teal : viz.colors.orange;
                                    ctx.beginPath();
                                    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                                    ctx.fill();
                                }
                            }

                            // Max value label
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'middle';
                            ctx.fillText(maxVal.toString(), chartL - 5, chartT);
                            ctx.fillText('1', chartL - 5, chartB);

                            // Step labels
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('0', chartL, chartB + 4);
                            ctx.fillText((n - 1).toString(), chartR, chartB + 4);
                            ctx.fillText('step', (chartL + chartR) / 2, chartB + 4);

                            // Legend
                            if (n < 60) {
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillRect(chartR - 120, chartT, 8, 8);
                                ctx.fillStyle = viz.colors.text;
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('even', chartR - 108, chartT + 4);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillRect(chartR - 60, chartT, 8, 8);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('odd', chartR - 48, chartT + 4);
                            }
                        }

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-happy-numbers',
                    title: 'Happy Number Tracer',
                    description: 'Enter a number to check if it is happy. Watch the digit-squaring process unfold.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var startN = 23;
                        var chain = [];
                        var isHappy = false;

                        function digitSquareSum(n) {
                            var sum = 0;
                            while (n > 0) {
                                var d = n % 10;
                                sum += d * d;
                                n = Math.floor(n / 10);
                            }
                            return sum;
                        }

                        function computeHappy(n) {
                            var seen = {};
                            var seq = [n];
                            seen[n] = true;
                            var limit = 50;
                            while (n !== 1 && seq.length < limit) {
                                n = digitSquareSum(n);
                                if (seen[n]) { seq.push(n); break; }
                                seen[n] = true;
                                seq.push(n);
                            }
                            return { chain: seq, happy: seq[seq.length - 1] === 1 };
                        }

                        // Input
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;justify-content:center;';
                        var lbl = document.createElement('span');
                        lbl.textContent = 'Number: ';
                        lbl.style.color = '#8b949e';
                        lbl.style.fontSize = '0.85rem';
                        inputDiv.appendChild(lbl);
                        var input = document.createElement('input');
                        input.type = 'number';
                        input.value = startN;
                        input.min = 1;
                        input.style.cssText = 'width:80px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#161b22;color:#f0f6fc;font-size:0.9rem;text-align:center;';
                        inputDiv.appendChild(input);
                        VizEngine.createButton(inputDiv, 'Check', function() {
                            var val = parseInt(input.value);
                            if (val >= 1 && val <= 99999) {
                                startN = val;
                                var result = computeHappy(startN);
                                chain = result.chain;
                                isHappy = result.happy;
                                draw();
                            }
                        });
                        controls.appendChild(inputDiv);

                        input.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') {
                                var val = parseInt(input.value);
                                if (val >= 1 && val <= 99999) {
                                    startN = val;
                                    var result = computeHappy(startN);
                                    chain = result.chain;
                                    isHappy = result.happy;
                                    draw();
                                }
                            }
                        });

                        var result = computeHappy(startN);
                        chain = result.chain;
                        isHappy = result.happy;

                        function draw() {
                            viz.clear();

                            // Title
                            var verdict = isHappy ? 'HAPPY!' : 'NOT HAPPY (cycle detected)';
                            var verdictColor = isHappy ? viz.colors.green : viz.colors.red;
                            viz.screenText(startN + ' is ' + verdict, w / 2, 25, verdictColor, 16);

                            // Draw chain as nodes in a path
                            var n = chain.length;
                            var nodeR = 18;
                            var maxPerRow = Math.min(8, Math.floor((w - 40) / (nodeR * 2 + 30)));
                            var rows = Math.ceil(n / maxPerRow);
                            var startY = 65;
                            var rowH = Math.min(60, (h - 100) / rows);

                            for (var i = 0; i < n; i++) {
                                var row = Math.floor(i / maxPerRow);
                                var col = i % maxPerRow;
                                // Alternate direction for each row (snake)
                                if (row % 2 === 1) col = maxPerRow - 1 - col;
                                var spacing = (w - 60) / maxPerRow;
                                var cx = 40 + (col + 0.5) * spacing;
                                var cy = startY + row * rowH + nodeR;

                                // Arrow to next
                                if (i < n - 1) {
                                    var nextRow = Math.floor((i + 1) / maxPerRow);
                                    var nextCol = (i + 1) % maxPerRow;
                                    if (nextRow % 2 === 1) nextCol = maxPerRow - 1 - nextCol;
                                    var nx = 40 + (nextCol + 0.5) * spacing;
                                    var ny = startY + nextRow * rowH + nodeR;

                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath();
                                    ctx.moveTo(cx, cy);
                                    ctx.lineTo(nx, ny);
                                    ctx.stroke();
                                }

                                // Node
                                var nodeColor;
                                if (chain[i] === 1) nodeColor = viz.colors.green;
                                else if (i === n - 1 && !isHappy) nodeColor = viz.colors.red;
                                else nodeColor = viz.colors.blue;

                                ctx.fillStyle = nodeColor + '33';
                                ctx.beginPath();
                                ctx.arc(cx, cy, nodeR + 3, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = nodeColor;
                                ctx.beginPath();
                                ctx.arc(cx, cy, nodeR, 0, Math.PI * 2);
                                ctx.fill();

                                // Number text
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold ' + (chain[i] > 999 ? 8 : (chain[i] > 99 ? 10 : 12)) + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(chain[i].toString(), cx, cy);

                                // Digit breakdown below
                                if (i < n - 1 && rows <= 4 && n <= 16) {
                                    var digits = chain[i].toString().split('');
                                    var breakdown = digits.map(function(d) { return d + '\u00B2'; }).join('+');
                                    var nextVal = chain[i + 1];
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '8px -apple-system,sans-serif';
                                    ctx.fillText(breakdown + '=' + nextVal, cx, cy + nodeR + 10);
                                }
                            }

                            // Footer
                            viz.screenText('Steps: ' + (n - 1), w / 2, h - 15, viz.colors.text, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write out the first 8 terms of the look-and-say sequence starting from 1.',
                    hint: 'Each term describes the previous: how many of each digit appear in runs.',
                    solution: '1, 11, 21, 1211, 111221, 312211, 13112221, 1113213211.'
                },
                {
                    question: 'Trace the Collatz sequence starting from 12. How many steps does it take to reach 1?',
                    hint: 'Apply the rule: if even, halve; if odd, triple and add 1.',
                    solution: '12 \\to 6 \\to 3 \\to 10 \\to 5 \\to 16 \\to 8 \\to 4 \\to 2 \\to 1. That is 9 steps.'
                },
                {
                    question: 'Check whether 19 is a happy number.',
                    hint: 'Square each digit, sum, and repeat.',
                    solution: '\\(1^2 + 9^2 = 82 \\to 8^2 + 2^2 = 68 \\to 6^2 + 8^2 = 100 \\to 1^2 + 0^2 + 0^2 = 1\\). Yes, 19 is happy!'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to the Next Chapter
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'What Comes Next?',
            content: `
<h2>What Comes Next?</h2>

<p>We have seen patterns ranging from the predictable (arithmetic and geometric sequences) to the mysterious (Collatz, look-and-say, happy numbers). But recognizing a pattern is only the first step. The real power of mathematics lies in <em>proving</em> that a pattern holds forever.</p>

<div class="env-block intuition">
    <div class="env-title">Pattern vs. Proof</div>
    <div class="env-body">
        <p>Consider the polynomial \\(p(n) = n^2 + n + 41\\). For \\(n = 0, 1, 2, \\ldots, 39\\), every value of \\(p(n)\\) is prime. A compelling pattern! But \\(p(40) = 40^2 + 40 + 41 = 40 \\times 41 + 41 = 41^2\\), which is clearly not prime. The pattern held for 40 consecutive values and then broke. This is why mathematicians insist on proof.</p>
    </div>
</div>

<p>The Collatz conjecture is a perfect example of an observed pattern (every starting number reaches 1) that we cannot yet prove. Computers have verified it for all numbers up to \\(2^{68}\\), but that is not a proof.</p>

<p>In the next chapters, we will explore the tools that let us move from "I see a pattern" to "I can prove it works." <strong>Mathematical induction</strong> is the most powerful of these tools: it lets you prove a statement for infinitely many cases by verifying just two things. Counting principles, which we will also study, give us systematic ways to enumerate the objects that patterns describe.</p>

<div class="env-block remark">
    <div class="env-title">Looking Back</div>
    <div class="env-body">
        <p>In this chapter we learned:</p>
        <ul>
            <li>How to recognize arithmetic sequences (constant difference) and geometric sequences (constant ratio).</li>
            <li>Formulas for the \\(n\\)-th term and sum of arithmetic and geometric sequences.</li>
            <li>Figurate numbers: triangular, square, and pentagonal numbers built from dots.</li>
            <li>Three surprising patterns: look-and-say, Collatz, and happy numbers.</li>
            <li>The critical distinction between observing a pattern and proving it holds universally.</li>
        </ul>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Verify that \\(n^2 + n + 41\\) is prime for \\(n = 0, 1, 2, 3, 4, 5\\). Then show it is not prime for \\(n = 40\\).',
                    hint: 'Just compute the values. For \\(n = 40\\), factor the expression.',
                    solution: '\\(n=0: 41\\) (prime). \\(n=1: 43\\) (prime). \\(n=2: 47\\) (prime). \\(n=3: 53\\) (prime). \\(n=4: 61\\) (prime). \\(n=5: 71\\) (prime). For \\(n=40\\): \\(40^2 + 40 + 41 = 1600 + 40 + 41 = 1681 = 41^2\\), which is not prime.'
                },
                {
                    question: 'The Fibonacci sequence is defined by \\(F_1 = 1, F_2 = 1, F_{n} = F_{n-1} + F_{n-2}\\). Compute the ratio \\(F_{n+1}/F_n\\) for \\(n = 1, 2, \\ldots, 10\\). What value does it approach?',
                    hint: 'Compute: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89. Then take consecutive ratios.',
                    solution: 'Ratios: 1, 2, 1.5, 1.667, 1.6, 1.625, 1.615, 1.619, 1.618, 1.618. The ratio approaches the golden ratio \\(\\phi = (1 + \\sqrt{5})/2 \\approx 1.6180\\).'
                },
                {
                    question: 'Find all happy numbers less than 20.',
                    hint: 'Check each number from 1 to 19 by repeatedly squaring digits and summing.',
                    solution: 'The happy numbers less than 20 are: 1, 7, 10, 13, 19. For example, \\(7 \\to 49 \\to 97 \\to 130 \\to 10 \\to 1\\).'
                }
            ]
        }
    ]
});
})();
