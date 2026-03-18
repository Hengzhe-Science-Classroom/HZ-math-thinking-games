// === Chapter 9: Pattern Detective ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch09',
    number: 9,
    title: 'Pattern Detective',
    subtitle: 'Finding the hidden rules that sequences obey',
    sections: [
        // ============================================================
        // Section 0: Spot the Pattern
        // ============================================================
        {
            id: 'spot-the-pattern',
            title: 'Spot the Pattern',
            content: `
<h2>The Detective's Eye</h2>

<p>Mathematics, at its heart, is about finding patterns. Every great discovery, from Newton's laws of motion to the prime number theorem, began with someone staring at a collection of numbers or shapes and asking: <em>is there a rule hiding here?</em></p>

<p>Pattern recognition is not just a mathematical skill. It is a survival skill. Our ancestors spotted patterns in animal migrations, weather, and the night sky. What makes mathematics special is that it gives us precise language to <em>describe</em> patterns and rigorous methods to <em>prove</em> they hold forever.</p>

<div class="env-block definition">
<strong>What is a pattern?</strong><br>
A <strong>pattern</strong> is a predictable regularity. Given a sequence of objects (numbers, shapes, colors), a pattern is a rule that tells you how to produce the next object from the ones you have already seen.
</div>

<p>Here is a warm-up. Look at this sequence:</p>

<p style="text-align:center; font-size:1.2rem; color:#58a6ff;">2, 4, 6, 8, 10, ...</p>

<p>You probably said "the next number is 12" before you finished reading the list. Your brain detected the pattern instantly: <em>add 2 each time</em>. But now consider this one:</p>

<p style="text-align:center; font-size:1.2rem; color:#f0883e;">1, 4, 9, 16, 25, ...</p>

<p>The differences between consecutive terms are 3, 5, 7, 9, ... That is itself a pattern! But there is a simpler description: these are the <strong>perfect squares</strong>: \\(1^2, 2^2, 3^2, 4^2, 5^2, \\ldots\\)</p>

<div class="env-block intuition">
<strong>Multiple valid patterns</strong><br>
Given a finite list of numbers, there are always infinitely many rules that fit. The sequence 1, 2, 4 could continue as 8, 16, 32 (doubling), or as 7, 11, 16 (differences increase by 1 each time), or even 42 if some exotic polynomial happens to pass through those points. In practice, we look for the <em>simplest</em> rule. In competition math, the "intended" pattern is almost always the most natural one.
</div>

<h3>The detective's toolkit</h3>

<p>When you face an unknown sequence, here are your first moves:</p>

<ol>
<li><strong>Compute differences.</strong> Subtract consecutive terms: \\(d_n = a_{n+1} - a_n\\). If the differences are constant, you have an <em>arithmetic sequence</em>.</li>
<li><strong>Compute ratios.</strong> Divide consecutive terms: \\(r_n = a_{n+1} / a_n\\). If the ratios are constant, you have a <em>geometric sequence</em>.</li>
<li><strong>Compute second differences.</strong> If the first differences form a pattern, take their differences too. Constant second differences mean a quadratic rule.</li>
<li><strong>Look for known families.</strong> Squares, cubes, primes, triangular numbers, Fibonacci, powers of 2, factorials.</li>
<li><strong>Try combining.</strong> Sometimes terms are sums, products, or interleaving of simpler sequences.</li>
</ol>

<p>Try the interactive game below. You will be shown the first few terms of a sequence and must guess the next one. Think before you type!</p>

<div class="viz-placeholder" data-viz="ch09-guess-next"></div>
`,
            visualizations: [
                {
                    id: 'ch09-guess-next',
                    title: 'Guess the Next Number',
                    description: 'Study the sequence, then type your guess for the next term. Press Enter or click "Check" to verify.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        // Sequence bank
                        var sequences = [
                            { terms: [2, 4, 6, 8, 10], next: 12, rule: 'Add 2 each time (arithmetic, d=2)' },
                            { terms: [1, 4, 9, 16, 25], next: 36, rule: 'Perfect squares: n\u00B2' },
                            { terms: [3, 6, 12, 24, 48], next: 96, rule: 'Multiply by 2 (geometric, r=2)' },
                            { terms: [1, 1, 2, 3, 5], next: 8, rule: 'Fibonacci: each = sum of previous two' },
                            { terms: [1, 3, 6, 10, 15], next: 21, rule: 'Triangular numbers: add 2, 3, 4, 5, 6, ...' },
                            { terms: [2, 6, 12, 20, 30], next: 42, rule: 'n(n+1): products of consecutive integers' },
                            { terms: [1, 8, 27, 64, 125], next: 216, rule: 'Perfect cubes: n\u00B3' },
                            { terms: [1, 2, 4, 8, 16], next: 32, rule: 'Powers of 2' },
                            { terms: [0, 1, 3, 6, 10], next: 15, rule: 'Triangular numbers (starting from 0)' },
                            { terms: [1, 4, 10, 20, 35], next: 56, rule: 'Tetrahedral numbers: C(n+2,3)' },
                            { terms: [2, 3, 5, 7, 11], next: 13, rule: 'Prime numbers' },
                            { terms: [1, 3, 7, 15, 31], next: 63, rule: '2\u207F \u2212 1 (Mersenne-type)' }
                        ];

                        var currentIdx = 0;
                        var feedback = '';
                        var feedbackColor = '';
                        var showRule = false;
                        var score = 0;
                        var attempts = 0;

                        // Input field
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'margin-top:8px;display:flex;gap:8px;align-items:center;justify-content:center;';
                        var input = document.createElement('input');
                        input.type = 'number';
                        input.placeholder = 'Your guess...';
                        input.style.cssText = 'width:120px;padding:6px 10px;border:1px solid #30363d;border-radius:4px;background:#161b22;color:#f0f6fc;font-size:1rem;text-align:center;';
                        inputDiv.appendChild(input);
                        body.appendChild(inputDiv);

                        function checkAnswer() {
                            var guess = parseInt(input.value);
                            if (isNaN(guess)) return;
                            attempts++;
                            var seq = sequences[currentIdx];
                            if (guess === seq.next) {
                                feedback = 'Correct! ' + seq.rule;
                                feedbackColor = viz.colors.green;
                                showRule = true;
                                score++;
                            } else {
                                feedback = 'Not quite. The answer is ' + seq.next + '. ' + seq.rule;
                                feedbackColor = viz.colors.orange;
                                showRule = true;
                            }
                            draw();
                        }

                        input.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') checkAnswer();
                        });

                        VizEngine.createButton(controls, 'Check', checkAnswer);
                        VizEngine.createButton(controls, 'Next Sequence', function() {
                            currentIdx = (currentIdx + 1) % sequences.length;
                            feedback = '';
                            showRule = false;
                            input.value = '';
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var seq = sequences[currentIdx];

                            // Title
                            viz.screenText('Sequence ' + (currentIdx + 1) + ' of ' + sequences.length, w / 2, 24, viz.colors.text, 13);
                            viz.screenText('Score: ' + score + '/' + attempts, w - 60, 24, viz.colors.teal, 12);

                            // Draw terms as cards
                            var terms = seq.terms;
                            var totalCards = terms.length + 1;
                            var cardW = Math.min(70, (w - 80) / totalCards);
                            var startX = (w - totalCards * cardW) / 2 + cardW / 2;
                            var cardY = h * 0.38;

                            for (var i = 0; i < terms.length; i++) {
                                var cx = startX + i * cardW;
                                // Card background
                                ctx.fillStyle = '#1a1a40';
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.roundRect(cx - cardW * 0.4, cardY - 28, cardW * 0.8, 56, 6);
                                ctx.fill();
                                ctx.stroke();
                                // Number
                                viz.screenText('' + terms[i], cx, cardY, viz.colors.white, 20);
                                // Index
                                viz.screenText('a' + (i + 1), cx, cardY + 42, viz.colors.text, 11);
                            }

                            // The mystery card
                            var qx = startX + terms.length * cardW;
                            ctx.fillStyle = showRule ? '#1a3a1a' : '#2a1a1a';
                            ctx.strokeStyle = showRule ? viz.colors.green : viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.roundRect(qx - cardW * 0.4, cardY - 28, cardW * 0.8, 56, 6);
                            ctx.fill();
                            ctx.stroke();
                            if (showRule) {
                                viz.screenText('' + seq.next, qx, cardY, viz.colors.green, 20);
                            } else {
                                viz.screenText('?', qx, cardY, viz.colors.orange, 24);
                            }
                            viz.screenText('a' + (terms.length + 1), qx, cardY + 42, viz.colors.text, 11);

                            // Differences row
                            viz.screenText('Differences:', 55, h * 0.64, viz.colors.text, 11, 'left');
                            for (var j = 0; j < terms.length - 1; j++) {
                                var dx = startX + j * cardW + cardW / 2;
                                var diff = terms[j + 1] - terms[j];
                                viz.screenText('+' + diff, dx, h * 0.64, viz.colors.purple, 13);
                            }

                            // Feedback
                            if (feedback) {
                                // Word-wrap feedback
                                ctx.font = '13px -apple-system,sans-serif';
                                var maxLineW = w - 60;
                                var words = feedback.split(' ');
                                var lines = [];
                                var line = '';
                                for (var k = 0; k < words.length; k++) {
                                    var test = line ? line + ' ' + words[k] : words[k];
                                    if (ctx.measureText(test).width > maxLineW) {
                                        lines.push(line);
                                        line = words[k];
                                    } else {
                                        line = test;
                                    }
                                }
                                if (line) lines.push(line);
                                for (var l = 0; l < lines.length; l++) {
                                    viz.screenText(lines[l], w / 2, h * 0.78 + l * 18, feedbackColor, 13);
                                }
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the next three terms: 5, 10, 15, 20, 25, ...',
                    hint: 'What is the common difference between consecutive terms?',
                    solution: 'The common difference is 5. The next three terms are 30, 35, 40.'
                },
                {
                    question: 'Find the next term: 1, 2, 4, 7, 11, 16, ...',
                    hint: 'Compute the differences: 1, 2, 3, 4, 5, ... What comes next?',
                    solution: 'Differences are 1, 2, 3, 4, 5, so the next difference is 6, giving 16 + 6 = <strong>22</strong>.'
                },
                {
                    question: 'Is there always exactly one "correct" next term for a sequence? Why or why not?',
                    hint: 'Think about how many different polynomials can pass through a given set of points.',
                    solution: 'No. Given \\(n\\) terms, infinitely many rules fit them. A polynomial of degree \\(n\\) can pass through any \\(n+1\\) prescribed points, so you can always find a polynomial that matches the given terms but continues differently. The "correct" answer is the <em>simplest</em> rule, which is a convention, not a logical necessity.'
                }
            ]
        },

        // ============================================================
        // Section 1: Number Sequences
        // ============================================================
        {
            id: 'number-sequences',
            title: 'Number Sequences',
            content: `
<h2>The Famous Families</h2>

<p>Some sequences appear so often in mathematics that they have been given names and studied for centuries. Let us meet the most important ones.</p>

<h3>Arithmetic sequences</h3>

<p>An <strong>arithmetic sequence</strong> has a constant difference between consecutive terms. If the first term is \\(a_1\\) and the common difference is \\(d\\), then:</p>

\\[a_n = a_1 + (n-1)d\\]

<div class="env-block example">
<strong>Example</strong><br>
The sequence 3, 7, 11, 15, 19, ... has \\(a_1 = 3\\) and \\(d = 4\\). The 100th term is \\(a_{100} = 3 + 99 \\times 4 = 399\\).
</div>

<h3>Geometric sequences</h3>

<p>A <strong>geometric sequence</strong> has a constant ratio between consecutive terms. If the first term is \\(a_1\\) and the common ratio is \\(r\\), then:</p>

\\[a_n = a_1 \\cdot r^{n-1}\\]

<div class="env-block example">
<strong>Example</strong><br>
The sequence 2, 6, 18, 54, 162, ... has \\(a_1 = 2\\) and \\(r = 3\\). The 10th term is \\(a_{10} = 2 \\cdot 3^9 = 39366\\).
</div>

<h3>Square and triangular numbers</h3>

<p>The <strong>square numbers</strong> are \\(1, 4, 9, 16, 25, 36, \\ldots\\), given by \\(a_n = n^2\\). The name comes from arranging dots in a square grid: a \\(3 \\times 3\\) grid has 9 dots.</p>

<p>The <strong>triangular numbers</strong> are \\(1, 3, 6, 10, 15, 21, \\ldots\\), given by:</p>

\\[T_n = 1 + 2 + 3 + \\cdots + n = \\frac{n(n+1)}{2}\\]

<p>These count the dots in an equilateral triangle with \\(n\\) rows. Notice the differences between consecutive triangular numbers: 2, 3, 4, 5, 6, ... This is an arithmetic sequence! So the triangular numbers have constant <em>second differences</em> (all equal to 1), confirming they follow a quadratic formula.</p>

<h3>The Fibonacci sequence</h3>

<p>Neither arithmetic nor geometric, the <strong>Fibonacci sequence</strong> is defined by the recurrence:</p>

\\[F_1 = 1, \\quad F_2 = 1, \\quad F_n = F_{n-1} + F_{n-2} \\text{ for } n \\geq 3\\]

<p>giving 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, ... We will revisit Fibonacci in Chapter 11 when we study recursion.</p>

<div class="env-block remark">
<strong>Why these sequences matter</strong><br>
Arithmetic sequences model steady growth (adding a fixed amount each period). Geometric sequences model compound growth (multiplying by a fixed factor). Triangular numbers count handshakes, edges of complete graphs, and entries in Pascal's triangle. The Fibonacci sequence appears in biology, art, and algorithm analysis. Mastering these families gives you a vocabulary for describing patterns throughout mathematics.
</div>

<div class="viz-placeholder" data-viz="ch09-sequence-explorer"></div>
`,
            visualizations: [
                {
                    id: 'ch09-sequence-explorer',
                    title: 'Sequence Family Explorer',
                    description: 'Choose a sequence type and adjust parameters. Watch how the terms and their growth change.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var seqType = 0; // 0=arithmetic, 1=geometric, 2=square, 3=triangular, 4=fibonacci
                        var param1 = 1; // a1 or base
                        var param2 = 3; // d or r

                        var names = ['Arithmetic', 'Geometric', 'Square', 'Triangular', 'Fibonacci'];

                        VizEngine.createButton(controls, 'Arithmetic', function() { seqType = 0; draw(); });
                        VizEngine.createButton(controls, 'Geometric', function() { seqType = 1; draw(); });
                        VizEngine.createButton(controls, 'Square', function() { seqType = 2; draw(); });
                        VizEngine.createButton(controls, 'Triangular', function() { seqType = 3; draw(); });
                        VizEngine.createButton(controls, 'Fibonacci', function() { seqType = 4; draw(); });

                        function getTerms(n) {
                            var terms = [];
                            if (seqType === 0) {
                                for (var i = 0; i < n; i++) terms.push(param1 + i * param2);
                            } else if (seqType === 1) {
                                var val = param1;
                                for (var i2 = 0; i2 < n; i2++) { terms.push(val); val *= param2; }
                            } else if (seqType === 2) {
                                for (var i3 = 1; i3 <= n; i3++) terms.push(i3 * i3);
                            } else if (seqType === 3) {
                                for (var i4 = 1; i4 <= n; i4++) terms.push(i4 * (i4 + 1) / 2);
                            } else {
                                terms = [1, 1];
                                for (var i5 = 2; i5 < n; i5++) terms.push(terms[i5 - 1] + terms[i5 - 2]);
                            }
                            return terms;
                        }

                        function draw() {
                            viz.clear();
                            var numTerms = 12;
                            var terms = getTerms(numTerms);
                            var maxVal = Math.max.apply(null, terms);
                            if (maxVal <= 0) maxVal = 1;

                            // Title
                            viz.screenText(names[seqType] + ' Sequence', w / 2, 22, viz.colors.gold, 16);

                            // Formula
                            var formula = '';
                            if (seqType === 0) formula = 'a\u2099 = ' + param1 + ' + (n-1)\u00B7' + param2;
                            else if (seqType === 1) formula = 'a\u2099 = ' + param1 + ' \u00B7 ' + param2 + '\u207F\u207B\u00B9';
                            else if (seqType === 2) formula = 'a\u2099 = n\u00B2';
                            else if (seqType === 3) formula = 'T\u2099 = n(n+1)/2';
                            else formula = 'F\u2099 = F\u2099\u208B\u2081 + F\u2099\u208B\u2082';
                            viz.screenText(formula, w / 2, 44, viz.colors.teal, 13);

                            // Draw bars
                            var margin = 60;
                            var barAreaW = w - margin * 2;
                            var barW = barAreaW / numTerms * 0.7;
                            var gap = barAreaW / numTerms;
                            var barAreaH = h - 120;

                            for (var i = 0; i < numTerms; i++) {
                                var bx = margin + i * gap + gap / 2;
                                var barH = (terms[i] / maxVal) * barAreaH;
                                if (barH < 2) barH = 2;

                                var hue = 200 + i * 12;
                                ctx.fillStyle = VizEngine.hsl(hue, 70, 55);
                                ctx.fillRect(bx - barW / 2, h - 40 - barH, barW, barH);

                                // Value label
                                var val = terms[i];
                                var label = val >= 10000 ? (val / 1000).toFixed(0) + 'k' : '' + val;
                                viz.screenText(label, bx, h - 46 - barH, viz.colors.white, 11);

                                // Index label
                                viz.screenText('' + (i + 1), bx, h - 24, viz.colors.text, 10);
                            }

                            // Differences
                            viz.screenText('Differences:', margin, 68, viz.colors.text, 11, 'left');
                            for (var j = 0; j < Math.min(numTerms - 1, 11); j++) {
                                var dx = margin + j * gap + gap;
                                var diff = terms[j + 1] - terms[j];
                                var diffLabel = diff >= 10000 ? (diff / 1000).toFixed(0) + 'k' : '' + diff;
                                viz.screenText(diffLabel, dx, 68, viz.colors.purple, 11);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The 5th triangular number is 15. What is the 100th triangular number?',
                    hint: 'Use the formula \\(T_n = n(n+1)/2\\).',
                    solution: '\\(T_{100} = \\frac{100 \\times 101}{2} = 5050\\). This is exactly the sum \\(1 + 2 + 3 + \\cdots + 100\\) that Gauss famously computed as a schoolboy!'
                },
                {
                    question: 'Is the sequence 5, 15, 45, 135, 405, ... arithmetic, geometric, or neither?',
                    hint: 'Check: are the differences constant? Are the ratios constant?',
                    solution: 'The ratios are \\(15/5 = 3\\), \\(45/15 = 3\\), \\(135/45 = 3\\), \\(405/135 = 3\\). Constant ratio of 3, so it is <strong>geometric</strong> with \\(a_1 = 5, r = 3\\).'
                },
                {
                    question: 'Show that every square number is the sum of consecutive odd numbers: \\(n^2 = 1 + 3 + 5 + \\cdots + (2n-1)\\).',
                    hint: 'The \\(k\\)-th odd number is \\(2k - 1\\). Sum them from \\(k=1\\) to \\(k=n\\).',
                    solution: '\\(\\sum_{k=1}^{n}(2k-1) = 2 \\cdot \\frac{n(n+1)}{2} - n = n^2 + n - n = n^2\\). Alternatively, visualize: a \\(3 \\times 3\\) square is the \\(2 \\times 2\\) square plus an L-shaped border of 5 dots (the 3rd odd number).'
                }
            ]
        },

        // ============================================================
        // Section 2: Visual Patterns
        // ============================================================
        {
            id: 'visual-patterns',
            title: 'Visual Patterns',
            content: `
<h2>When Shapes Tell the Story</h2>

<p>Not all patterns are numerical. Some of the most beautiful (and most challenging) patterns involve shapes arranged in a geometric sequence. Competition mathematics is full of problems where you must identify the next figure in a visual sequence.</p>

<h3>Dot patterns</h3>

<p>Consider a sequence of dot arrangements:</p>
<ul>
<li>Figure 1: a single dot</li>
<li>Figure 2: a triangle of 3 dots</li>
<li>Figure 3: a triangle of 6 dots</li>
<li>Figure 4: a triangle of 10 dots</li>
</ul>

<p>These are the triangular numbers again, but seen through a geometric lens. The key insight: each new figure adds a new row at the bottom, and that row has one more dot than the previous bottom row.</p>

<h3>Growing squares</h3>

<p>Another classic: a sequence of L-shaped borders added to a growing square. Start with a 1-by-1 square. Add an L-shaped border of 3 cells to make a 2-by-2 square. Add an L-shaped border of 5 cells to make a 3-by-3 square. This is exactly the "sum of odd numbers equals a perfect square" identity in visual form:</p>

\\[n^2 = 1 + 3 + 5 + \\cdots + (2n - 1)\\]

<div class="env-block intuition">
<strong>Visual proofs are real proofs</strong><br>
A carefully drawn picture can constitute a rigorous proof. The L-shaped border argument proves the odd-number-sum identity just as convincingly as algebra does. Mathematicians call these "proofs without words." They are especially powerful for identities involving sums.
</div>

<p>In the visualization below, you can explore how dot patterns grow. Watch the triangular numbers, square numbers, and other figurate numbers build up step by step.</p>

<div class="viz-placeholder" data-viz="ch09-visual-patterns"></div>

<h3>Repeating tile patterns</h3>

<p>Some visual patterns involve a motif that repeats with a twist: rotation, reflection, or color change. For example, a sequence of arrows might rotate 90 degrees each step, or a sequence of colored tiles might cycle through three colors. The key question is always: what is the <em>period</em> of the repetition?</p>

<div class="env-block example">
<strong>Example</strong><br>
A sequence of shapes goes: circle, square, triangle, circle, square, triangle, circle, ... What is the 100th shape? Since the period is 3, we compute \\(100 \\div 3 = 33\\) remainder 1. The 100th shape matches the 1st: a <strong>circle</strong>.
</div>
`,
            visualizations: [
                {
                    id: 'ch09-visual-patterns',
                    title: 'Figurate Number Visualizer',
                    description: 'Watch dots arrange into triangular, square, and pentagonal patterns. Use the slider to grow the figure.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;
                        var figType = 0; // 0=triangular, 1=square, 2=pentagonal
                        var n = 4;
                        var typeNames = ['Triangular', 'Square', 'Pentagonal'];

                        VizEngine.createSlider(controls, 'n', 1, 8, 4, 1, function(v) { n = Math.round(v); draw(); });
                        VizEngine.createButton(controls, 'Triangular', function() { figType = 0; draw(); });
                        VizEngine.createButton(controls, 'Square', function() { figType = 1; draw(); });
                        VizEngine.createButton(controls, 'L-borders', function() { figType = 2; draw(); });

                        function draw() {
                            viz.clear();

                            var dotR = Math.max(4, Math.min(12, 80 / n));
                            var spacing = dotR * 2.8;

                            viz.screenText(typeNames[figType] + ' pattern, n = ' + n, w / 2, 22, viz.colors.gold, 15);

                            if (figType === 0) {
                                // Triangular
                                var count = n * (n + 1) / 2;
                                viz.screenText('T(' + n + ') = ' + count, w / 2, 44, viz.colors.teal, 13);
                                var baseX = w / 2;
                                var startY = 70;
                                for (var row = 1; row <= n; row++) {
                                    var rowX = baseX - (row - 1) * spacing / 2;
                                    var ry = startY + (row - 1) * spacing;
                                    for (var col = 0; col < row; col++) {
                                        var isNew = (row === n);
                                        ctx.fillStyle = isNew ? viz.colors.orange : viz.colors.blue;
                                        ctx.beginPath();
                                        ctx.arc(rowX + col * spacing, ry, dotR, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }
                                // Show addition
                                if (n > 1) {
                                    var prev = (n - 1) * n / 2;
                                    viz.screenText(prev + ' + ' + n + ' = ' + count, w / 2, h - 30, viz.colors.white, 13);
                                }
                            } else if (figType === 1) {
                                // Square
                                var count2 = n * n;
                                viz.screenText(n + '\u00B2 = ' + count2, w / 2, 44, viz.colors.teal, 13);
                                var startX = w / 2 - (n - 1) * spacing / 2;
                                var startY2 = h / 2 - (n - 1) * spacing / 2;
                                for (var r = 0; r < n; r++) {
                                    for (var c = 0; c < n; c++) {
                                        ctx.fillStyle = viz.colors.blue;
                                        ctx.beginPath();
                                        ctx.arc(startX + c * spacing, startY2 + r * spacing, dotR, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }
                            } else {
                                // L-borders (odd number sum)
                                var count3 = n * n;
                                viz.screenText('1 + 3 + 5 + ... + ' + (2 * n - 1) + ' = ' + count3, w / 2, 44, viz.colors.teal, 13);
                                var startX2 = w / 2 - (n - 1) * spacing / 2;
                                var startY3 = h / 2 - (n - 1) * spacing / 2;
                                var layerColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple, viz.colors.green, viz.colors.red, viz.colors.yellow, viz.colors.pink];
                                for (var r2 = 0; r2 < n; r2++) {
                                    for (var c2 = 0; c2 < n; c2++) {
                                        var layer = Math.max(r2, c2);
                                        ctx.fillStyle = layerColors[layer % layerColors.length];
                                        ctx.beginPath();
                                        ctx.arc(startX2 + c2 * spacing, startY3 + r2 * spacing, dotR, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }
                                // Legend
                                for (var lyr = 0; lyr < n; lyr++) {
                                    ctx.fillStyle = layerColors[lyr % layerColors.length];
                                    ctx.fillRect(20, h - 30 - (n - lyr - 1) * 18, 10, 10);
                                    viz.screenText('Layer ' + (lyr + 1) + ': ' + (2 * lyr + 1) + ' dots', 38, h - 25 - (n - lyr - 1) * 18, viz.colors.text, 10, 'left');
                                }
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a repeating pattern R, G, B, R, G, B, ..., what is the 2023rd color?',
                    hint: 'Divide 2023 by the period 3 and look at the remainder.',
                    solution: '\\(2023 \\div 3 = 674\\) remainder 1. The 1st color is R, so the 2023rd color is <strong>R (Red)</strong>.'
                },
                {
                    question: 'A pentagonal number is given by \\(P_n = \\frac{n(3n-1)}{2}\\). Compute \\(P_1\\) through \\(P_5\\) and verify the differences form an arithmetic sequence.',
                    hint: 'Compute each value, then take differences.',
                    solution: '\\(P_1 = 1, P_2 = 5, P_3 = 12, P_4 = 22, P_5 = 35\\). Differences: 4, 7, 10, 13. These form an arithmetic sequence with common difference 3.'
                }
            ]
        },

        // ============================================================
        // Section 3: Sequence Puzzles from Competitions
        // ============================================================
        {
            id: 'competition-puzzles',
            title: 'Sequence Puzzles from Competitions',
            content: `
<h2>Test Your Pattern Instincts</h2>

<p>Mathematics competitions love sequence problems because they test genuine mathematical thinking, not just formula recall. Here are some classic types you will encounter.</p>

<h3>Type 1: Nested differences</h3>

<p>When first differences are not constant, compute second differences. If those are constant, the sequence follows a quadratic rule \\(a_n = An^2 + Bn + C\\).</p>

<div class="env-block example">
<strong>Competition example</strong><br>
Find the next term: 2, 5, 10, 17, 26, ...<br><br>
First differences: 3, 5, 7, 9 (not constant).<br>
Second differences: 2, 2, 2 (constant!).<br>
So the next first difference is 11, and the next term is \\(26 + 11 = 37\\).<br>
The formula is \\(a_n = n^2 + 1\\). Check: \\(1^2+1=2\\), \\(2^2+1=5\\), \\(3^2+1=10\\). Confirmed.
</div>

<h3>Type 2: Interleaved sequences</h3>

<p>Sometimes the odd-positioned and even-positioned terms follow different rules.</p>

<div class="env-block example">
<strong>Example</strong><br>
1, 2, 3, 4, 5, 8, 7, 16, 9, 32, ...<br><br>
Odd positions: 1, 3, 5, 7, 9, ... (arithmetic, d = 2).<br>
Even positions: 2, 4, 8, 16, 32, ... (geometric, r = 2).<br>
The next two terms are 11 (odd) and 64 (even).
</div>

<h3>Type 3: Recursive definitions</h3>

<p>Each term is defined using one or more previous terms.</p>

<div class="env-block example">
<strong>Example</strong><br>
\\(a_1 = 1\\), and \\(a_{n+1} = 2a_n + 1\\). Find the first 6 terms.<br><br>
\\(a_1 = 1, a_2 = 3, a_3 = 7, a_4 = 15, a_5 = 31, a_6 = 63\\).<br>
Notice: \\(a_n = 2^n - 1\\). These are the Mersenne numbers!
</div>

<h3>Type 4: Digit manipulation</h3>

<p>Some tricky sequences use properties of the digits rather than arithmetic operations.</p>

<div class="env-block example">
<strong>Example</strong><br>
Find the pattern: 1, 11, 21, 1211, 111221, ...<br><br>
This is the "look-and-say" sequence. Each term <em>describes</em> the previous one: "one 1" becomes 11, "two 1s" becomes 21, "one 2 and one 1" becomes 1211, and so on. The next term is <strong>312211</strong> ("three 1s, two 2s, one 1").
</div>

<div class="env-block warning">
<strong>Competition tip</strong><br>
When stuck, always try these in order: (1) differences, (2) ratios, (3) second differences, (4) look at odd/even positions separately, (5) check if terms are perfect squares, cubes, primes, or factorials, (6) check digit patterns. Most competition sequences yield to one of these approaches within two minutes.
</div>

<p>Practice with the puzzle game below. These are competition-style sequences arranged by difficulty.</p>

<div class="viz-placeholder" data-viz="ch09-competition-seq"></div>
`,
            visualizations: [
                {
                    id: 'ch09-competition-seq',
                    title: 'Competition Sequence Challenge',
                    description: 'Harder sequences inspired by math competitions. Can you find the pattern?',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var puzzles = [
                            { terms: [2, 5, 10, 17, 26], next: 37, rule: 'n\u00B2 + 1 (constant 2nd differences)' },
                            { terms: [1, 3, 7, 15, 31], next: 63, rule: '2\u207F \u2212 1 (double and add 1)' },
                            { terms: [0, 1, 1, 2, 3, 5], next: 8, rule: 'Fibonacci (starting from 0)' },
                            { terms: [1, 2, 6, 24, 120], next: 720, rule: 'Factorials: n!' },
                            { terms: [1, 4, 10, 20, 35], next: 56, rule: 'Tetrahedral: C(n+2, 3)' },
                            { terms: [2, 6, 14, 30, 62], next: 126, rule: '2(2\u207F \u2212 1) (second differences double)' },
                            { terms: [1, 1, 2, 3, 5, 8], next: 13, rule: 'Fibonacci sequence' },
                            { terms: [3, 5, 9, 17, 33], next: 65, rule: '2\u207F + 1 (differences are powers of 2)' },
                            { terms: [1, 5, 14, 30, 55], next: 91, rule: 'Square pyramidal: n(n+1)(2n+1)/6' },
                            { terms: [4, 9, 25, 49, 121], next: 169, rule: 'Squares of primes: p\u2099\u00B2' }
                        ];

                        var currentIdx = 0;
                        var score = 0;
                        var attempts = 0;
                        var feedback = '';
                        var feedbackColor = '';
                        var showRule = false;

                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'margin-top:8px;display:flex;gap:8px;align-items:center;justify-content:center;';
                        var input = document.createElement('input');
                        input.type = 'number';
                        input.placeholder = 'Your answer...';
                        input.style.cssText = 'width:120px;padding:6px 10px;border:1px solid #30363d;border-radius:4px;background:#161b22;color:#f0f6fc;font-size:1rem;text-align:center;';
                        inputDiv.appendChild(input);
                        body.appendChild(inputDiv);

                        function checkAnswer() {
                            var guess = parseInt(input.value);
                            if (isNaN(guess)) return;
                            attempts++;
                            var p = puzzles[currentIdx];
                            if (guess === p.next) {
                                feedback = 'Correct! ' + p.rule;
                                feedbackColor = viz.colors.green;
                                score++;
                            } else {
                                feedback = 'Answer: ' + p.next + '. ' + p.rule;
                                feedbackColor = viz.colors.orange;
                            }
                            showRule = true;
                            draw();
                        }

                        input.addEventListener('keydown', function(e) { if (e.key === 'Enter') checkAnswer(); });
                        VizEngine.createButton(controls, 'Check', checkAnswer);
                        VizEngine.createButton(controls, 'Next', function() {
                            currentIdx = (currentIdx + 1) % puzzles.length;
                            feedback = '';
                            showRule = false;
                            input.value = '';
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var p = puzzles[currentIdx];

                            viz.screenText('Challenge ' + (currentIdx + 1) + '/' + puzzles.length, w / 2, 20, viz.colors.text, 12);
                            viz.screenText('Score: ' + score + '/' + attempts, w - 60, 20, viz.colors.teal, 12);

                            // Show terms
                            var terms = p.terms;
                            var totalCards = terms.length + 1;
                            var cardW = Math.min(72, (w - 60) / totalCards);
                            var startX = (w - totalCards * cardW) / 2 + cardW / 2;
                            var cy = h * 0.35;

                            for (var i = 0; i < terms.length; i++) {
                                var cx = startX + i * cardW;
                                ctx.fillStyle = '#1a1a40';
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.roundRect(cx - cardW * 0.42, cy - 24, cardW * 0.84, 48, 6);
                                ctx.fill();
                                ctx.stroke();
                                viz.screenText('' + terms[i], cx, cy, viz.colors.white, 18);
                            }

                            // Mystery
                            var qx = startX + terms.length * cardW;
                            ctx.fillStyle = showRule ? '#1a3a1a' : '#2a1a1a';
                            ctx.strokeStyle = showRule ? viz.colors.green : viz.colors.orange;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.roundRect(qx - cardW * 0.42, cy - 24, cardW * 0.84, 48, 6);
                            ctx.fill();
                            ctx.stroke();
                            viz.screenText(showRule ? '' + p.next : '?', qx, cy, showRule ? viz.colors.green : viz.colors.orange, 20);

                            // Differences
                            viz.screenText('Differences:', 40, h * 0.56, viz.colors.text, 11, 'left');
                            for (var j = 0; j < terms.length - 1; j++) {
                                var dx = startX + j * cardW + cardW / 2;
                                viz.screenText('' + (terms[j + 1] - terms[j]), dx, h * 0.56, viz.colors.purple, 12);
                            }

                            // Second differences
                            if (terms.length >= 3) {
                                viz.screenText('2nd diff:', 40, h * 0.65, viz.colors.text, 11, 'left');
                                for (var k = 0; k < terms.length - 2; k++) {
                                    var dx2 = startX + k * cardW + cardW;
                                    var sd = (terms[k + 2] - terms[k + 1]) - (terms[k + 1] - terms[k]);
                                    viz.screenText('' + sd, dx2, h * 0.65, viz.colors.pink, 12);
                                }
                            }

                            // Feedback
                            if (feedback) {
                                ctx.font = '13px -apple-system,sans-serif';
                                var maxW = w - 60;
                                var words = feedback.split(' ');
                                var lines = [];
                                var line = '';
                                for (var m = 0; m < words.length; m++) {
                                    var test = line ? line + ' ' + words[m] : words[m];
                                    if (ctx.measureText(test).width > maxW) {
                                        lines.push(line);
                                        line = words[m];
                                    } else {
                                        line = test;
                                    }
                                }
                                if (line) lines.push(line);
                                for (var l = 0; l < lines.length; l++) {
                                    viz.screenText(lines[l], w / 2, h * 0.80 + l * 18, feedbackColor, 13);
                                }
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Find the next term: 1, 3, 6, 10, 15, 21, 28, ...',
                    hint: 'These are the triangular numbers. What is the next difference?',
                    solution: 'The differences are 2, 3, 4, 5, 6, 7, so the next difference is 8, giving \\(28 + 8 = \\mathbf{36}\\). Alternatively, \\(T_8 = 8 \\cdot 9 / 2 = 36\\).'
                },
                {
                    question: 'Each term equals the sum of all previous terms plus 1: \\(a_1 = 1, a_n = 1 + a_1 + a_2 + \\cdots + a_{n-1}\\). Find the first 6 terms. What is the pattern?',
                    hint: 'Compute \\(a_2 = 1 + 1 = 2\\), \\(a_3 = 1 + 1 + 2 = 4\\), and continue.',
                    solution: 'The terms are 1, 2, 4, 8, 16, 32, ... These are powers of 2! Each term is double the previous, because \\(a_{n+1} = 1 + (a_1 + \\cdots + a_n) = a_n + a_n = 2a_n\\) (since \\(a_n = 1 + a_1 + \\cdots + a_{n-1}\\)).'
                },
                {
                    question: '(Competition) The sequence 1, 2, 4, 8, 16, ... is not the only sequence starting 1, 2, 4. If \\(a_n = \\frac{(n-1)(n-2)(n-3)}{6} + 2^{n-1}\\) for \\(n = 1, 2, 3, \\ldots\\), verify it gives 1, 2, 4 for the first three terms but then departs from powers of 2.',
                    hint: 'Plug in \\(n = 1, 2, 3, 4\\) and compute.',
                    solution: 'For \\(n=1\\): \\(0/6 + 1 = 1\\). For \\(n=2\\): \\(0/6 + 2 = 2\\). For \\(n=3\\): \\(0/6 + 4 = 4\\). For \\(n=4\\): \\(6/6 + 8 = 9\\) (not 8!). This shows that a finite number of terms never uniquely determines a sequence.'
                }
            ]
        },

        // ============================================================
        // Section 4: Creating Your Own Patterns
        // ============================================================
        {
            id: 'creating-patterns',
            title: 'Creating Your Own Patterns',
            content: `
<h2>From Detective to Inventor</h2>

<p>So far we have been reading patterns. Now it is time to write them. Creating your own sequences is one of the best ways to deepen your understanding, and it is genuinely fun.</p>

<h3>Method 1: Start with a rule</h3>

<p>Pick a simple formula and generate terms. For instance:</p>

<ul>
<li>\\(a_n = 2n^2 - n\\) gives 1, 6, 15, 28, 45, ...</li>
<li>\\(a_n = n! + n\\) gives 2, 4, 9, 28, 125, ...</li>
<li>\\(a_1 = 2, a_{n+1} = a_n^2 - 1\\) gives 2, 3, 8, 63, 3968, ...</li>
</ul>

<h3>Method 2: Combine known sequences</h3>

<p>Interleave, add, or multiply familiar sequences:</p>

<ul>
<li>Triangular + square: \\(T_n + n^2 = \\frac{n(n+1)}{2} + n^2 = \\frac{n(3n+1)}{2}\\) giving 2, 7, 15, 26, 40, ...</li>
<li>Interleave primes and squares: 2, 1, 3, 4, 5, 9, 7, 16, 11, 25, ...</li>
</ul>

<h3>Method 3: Define visually</h3>

<p>Draw a sequence of pictures and count something. How many regions do \\(n\\) lines divide the plane into? (Answer: \\(\\frac{n^2+n+2}{2}\\) if no two lines are parallel and no three meet at a point.) How many squares appear in an \\(n \\times n\\) grid? (Answer: \\(\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}\\).)</p>

<div class="env-block theorem">
<strong>The method of differences determines polynomials</strong><br>
If a sequence has constant \\(k\\)-th differences, then the sequence is given by a polynomial of degree \\(k\\). Specifically:
<ul>
<li>Constant 1st differences (\\(\\Delta = c\\)): linear, \\(a_n = An + B\\)</li>
<li>Constant 2nd differences: quadratic, \\(a_n = An^2 + Bn + C\\)</li>
<li>Constant 3rd differences: cubic, \\(a_n = An^3 + Bn^2 + Cn + D\\)</li>
</ul>
The converse holds too: any degree-\\(k\\) polynomial has constant \\(k\\)-th differences.
</div>

<div class="env-block example">
<strong>Recovering the formula</strong><br>
Suppose a sequence has terms 1, 5, 14, 30, 55, 91. The first differences are 4, 9, 16, 25, 36 (perfect squares!). The second differences are 5, 7, 9, 11. The third differences are 2, 2, 2. Constant third differences, so the formula is cubic: \\(a_n = \\frac{n(n+1)(2n+1)}{6}\\), the sum of the first \\(n\\) squares.
</div>

<p>The OEIS (Online Encyclopedia of Integer Sequences) catalogs over 370,000 sequences. If you invent one that is not already there, you can submit it!</p>

<h3>Challenge: create a puzzle for a friend</h3>

<p>Design a sequence with a clear but non-obvious rule. Give the first 5 terms and challenge a friend to find the 6th. Good puzzles use one of these structures: a quadratic formula, an interleaving of two simple sequences, or a recursive rule. Avoid overly arbitrary constructions; the best puzzles have an elegant "aha!" moment.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Create a sequence whose first differences are the triangular numbers. Write down the first 6 terms.',
                    hint: 'Start with \\(a_1 = 1\\). The first differences are \\(T_1 = 1, T_2 = 3, T_3 = 6, T_4 = 10, T_5 = 15\\). So \\(a_2 = a_1 + 1, a_3 = a_2 + 3, \\ldots\\)',
                    solution: '\\(a_1 = 1, a_2 = 2, a_3 = 5, a_4 = 11, a_5 = 21, a_6 = 36\\). These are the <strong>tetrahedral numbers</strong> \\(\\binom{n+1}{3} + 1\\). More precisely: \\(a_n = 1 + \\sum_{k=1}^{n-1} T_k = 1 + \\frac{(n-1)n(n+1)}{6}\\).'
                },
                {
                    question: 'The maximum number of regions formed by \\(n\\) straight lines (no two parallel, no three concurrent) in the plane is \\(R(n) = \\frac{n^2+n+2}{2}\\). Verify this for \\(n = 0, 1, 2, 3, 4\\) and explain why each new line adds exactly \\(n\\) new regions.',
                    hint: 'The \\(n\\)-th line crosses all \\(n-1\\) existing lines, so it is divided into \\(n\\) segments (plus two rays), creating \\(n\\) new regions. Wait, check more carefully.',
                    solution: '\\(R(0) = 1, R(1) = 2, R(2) = 4, R(3) = 7, R(4) = 11\\). The \\(n\\)-th line crosses the \\(n-1\\) existing lines in \\(n-1\\) points, splitting the new line into \\(n\\) segments/rays. Each segment cuts an existing region in two, adding \\(n\\) new regions. So \\(R(n) = R(n-1) + n\\), which gives \\(R(n) = 1 + \\sum_{k=1}^{n} k = 1 + \\frac{n(n+1)}{2} = \\frac{n^2+n+2}{2}\\).'
                },
                {
                    question: 'How many squares of all sizes are there in a \\(4 \\times 4\\) grid? (A \\(4 \\times 4\\) grid means 4 unit squares along each side, like a miniature chessboard.)',
                    hint: 'Count \\(1 \\times 1\\) squares, \\(2 \\times 2\\) squares, \\(3 \\times 3\\) squares, and \\(4 \\times 4\\) squares separately.',
                    solution: '\\(4^2 + 3^2 + 2^2 + 1^2 = 16 + 9 + 4 + 1 = \\mathbf{30}\\). In general, an \\(n \\times n\\) grid contains \\(\\sum_{k=1}^n k^2 = \\frac{n(n+1)(2n+1)}{6}\\) squares.'
                }
            ]
        }
    ]
});
})();
