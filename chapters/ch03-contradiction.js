// === Chapter 3: Proof by Contradiction ===
(function () {
    window.CHAPTERS = window.CHAPTERS || [];

    window.CHAPTERS.push({
        id: 'ch03',
        number: 3,
        title: 'Proof by Contradiction',
        subtitle: 'When the best way to prove something true is to assume it is false',
        file: 'ch03-contradiction',

        sections: [
            // ============================================================
            // Section 1: What if we assume the opposite?
            // ============================================================
            {
                id: 'assume-opposite',
                title: 'What If We Assume the Opposite?',
                content: `
<h2>The Detective's Method</h2>

<p>Imagine you are a detective. A crime has been committed, and you have a suspect. One powerful strategy is to <em>assume the suspect is innocent</em> and then carefully follow the evidence. If that assumption leads you to a logical impossibility (the suspect was in two places at once, or the timeline makes no sense), then your assumption must be wrong, and the suspect must be guilty.</p>

<p>This is exactly how <strong>proof by contradiction</strong> works in mathematics. To prove a statement is true, you assume it is false, then reason carefully until you reach an absurdity. Since mathematics does not allow contradictions, the original assumption must be wrong, and the statement must be true after all.</p>

<div class="env-block definition">
<strong>Proof by Contradiction (Reductio ad Absurdum)</strong><br>
To prove that a statement \\(P\\) is true:
<ol>
<li>Assume \\(P\\) is false (i.e., assume \\(\\neg P\\)).</li>
<li>Using logic and known facts, derive a contradiction (something that is clearly impossible).</li>
<li>Conclude that the assumption \\(\\neg P\\) must be wrong, so \\(P\\) is true.</li>
</ol>
</div>

<p>Why does this work? It rests on a bedrock principle of logic: a statement is either true or false; there is no third option. If assuming "false" leads to nonsense, then "true" is the only remaining possibility.</p>

<h3>A simple warm-up</h3>

<div class="env-block example">
<strong>Claim:</strong> There is no smallest positive rational number.<br><br>
<em>Proof by contradiction.</em> Assume there <em>is</em> a smallest positive rational number; call it \\(r\\). Now consider \\(r/2\\). This is also a positive rational number (dividing a positive rational by 2 gives a positive rational). But \\(r/2 < r\\), which contradicts our assumption that \\(r\\) was the smallest. Therefore, no smallest positive rational number exists. \\(\\square\\)
</div>

<p>Notice the pattern: we assumed the opposite of what we wanted to prove, then used that assumption to build something that destroyed itself. The assumption dug its own grave.</p>

<h3>When is contradiction useful?</h3>

<p>Contradiction is especially powerful when you want to prove that something <em>does not exist</em> or that something is <em>impossible</em>. Direct proofs say "here, I built it"; contradiction proofs say "if it existed, the universe would break." Both are valid; the choice depends on which path is cleaner.</p>

<div class="viz-placeholder" data-viz="viz-contradiction-flow"></div>
`,
                visualizations: [
                    {
                        id: 'viz-contradiction-flow',
                        title: 'The Logic of Contradiction',
                        description: 'Click "Step" to walk through the structure of a proof by contradiction. Watch how assuming the opposite inevitably leads to an impossibility.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var step = 0;
                            var maxStep = 5;

                            var steps = [
                                { label: 'Goal: Prove statement P', color: 'blue', y: 0.12 },
                                { label: 'Step 1: Assume P is FALSE', color: 'orange', y: 0.28 },
                                { label: 'Step 2: Reason logically...', color: 'teal', y: 0.44 },
                                { label: 'Step 3: Reach a CONTRADICTION!', color: 'red', y: 0.60 },
                                { label: 'Step 4: Assumption was wrong', color: 'purple', y: 0.76 },
                                { label: 'Conclusion: P must be TRUE!', color: 'green', y: 0.90 }
                            ];

                            function draw() {
                                viz.clear();
                                var boxW = w * 0.7;
                                var boxH = 36;
                                var startX = (w - boxW) / 2;

                                // Title
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Proof by Contradiction', w / 2, 24);

                                for (var i = 0; i <= step && i < steps.length; i++) {
                                    var s = steps[i];
                                    var sy = s.y * h;
                                    var col = viz.colors[s.color];

                                    // Arrow from previous
                                    if (i > 0) {
                                        var prevY = steps[i - 1].y * h + boxH / 2 + 4;
                                        ctx.strokeStyle = col + '88';
                                        ctx.lineWidth = 2;
                                        ctx.beginPath();
                                        ctx.moveTo(w / 2, prevY);
                                        ctx.lineTo(w / 2, sy - boxH / 2 - 2);
                                        ctx.stroke();
                                        // arrowhead
                                        ctx.fillStyle = col + '88';
                                        ctx.beginPath();
                                        ctx.moveTo(w / 2, sy - boxH / 2 - 2);
                                        ctx.lineTo(w / 2 - 5, sy - boxH / 2 - 10);
                                        ctx.lineTo(w / 2 + 5, sy - boxH / 2 - 10);
                                        ctx.fill();
                                    }

                                    // Box
                                    var alpha = (i === step) ? 'cc' : '66';
                                    ctx.fillStyle = col + '33';
                                    ctx.strokeStyle = col + alpha;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.roundRect(startX, sy - boxH / 2, boxW, boxH, 8);
                                    ctx.fill();
                                    ctx.stroke();

                                    // Label
                                    ctx.fillStyle = (i === step) ? viz.colors.white : viz.colors.text;
                                    ctx.font = (i === step) ? 'bold 13px -apple-system,sans-serif' : '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(s.label, w / 2, sy);
                                }

                                // Contradiction symbol
                                if (step >= 3) {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 22px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('\u26A0', startX + boxW + 8, steps[3].y * h);
                                }

                                // Checkmark
                                if (step >= 5) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 22px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('\u2713', startX + boxW + 8, steps[5].y * h);
                                }
                            }

                            VizEngine.createButton(controls, 'Step', function () {
                                if (step < maxStep) step++;
                                draw();
                            });
                            VizEngine.createButton(controls, 'Reset', function () {
                                step = 0;
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Prove by contradiction: If \\(n^2\\) is even, then \\(n\\) is even.',
                        hint: 'Assume \\(n\\) is odd, so \\(n = 2k+1\\) for some integer \\(k\\). What is \\(n^2\\)?',
                        solution: 'Assume \\(n\\) is odd. Then \\(n = 2k+1\\) for some integer \\(k\\), so \\(n^2 = (2k+1)^2 = 4k^2 + 4k + 1 = 2(2k^2+2k) + 1\\), which is odd. But we were told \\(n^2\\) is even. Contradiction! Therefore \\(n\\) must be even.'
                    },
                    {
                        question: 'Prove by contradiction: There is no largest even number.',
                        hint: 'Assume there is a largest even number \\(N\\). Can you find an even number larger than \\(N\\)?',
                        solution: 'Assume \\(N\\) is the largest even number. Then \\(N + 2\\) is also even (even plus even is even) and \\(N + 2 > N\\). This contradicts our assumption that \\(N\\) was the largest. Therefore no largest even number exists.'
                    }
                ]
            },

            // ============================================================
            // Section 2: √2 is irrational (story form)
            // ============================================================
            {
                id: 'sqrt2-irrational',
                title: '\u221A2 Is Irrational',
                content: `
<h2>The Discovery That Shook Ancient Greece</h2>

<p>Around 500 BCE, the followers of Pythagoras believed that <em>all</em> quantities could be expressed as ratios of whole numbers (fractions). The universe, they thought, was built on harmony, and harmony meant ratios. Then someone (legend says it was Hippasus of Metapontum) made a shocking discovery: the diagonal of a unit square has length \\(\\sqrt{2}\\), and \\(\\sqrt{2}\\) <em>cannot</em> be written as a fraction.</p>

<p>According to one (probably apocryphal) story, the Pythagoreans were so disturbed by this discovery that they threw Hippasus off a boat. True or not, the story captures how revolutionary the idea was. Let us see why \\(\\sqrt{2}\\) is irrational, using the very technique we just learned.</p>

<div class="env-block theorem">
<strong>Theorem.</strong> \\(\\sqrt{2}\\) is irrational. That is, there are no integers \\(p\\) and \\(q\\) (with \\(q \\neq 0\\)) such that \\(\\sqrt{2} = p/q\\).
</div>

<h3>The Proof, Step by Step</h3>

<p><strong>Assume the opposite:</strong> Suppose \\(\\sqrt{2}\\) <em>is</em> rational. Then we can write \\(\\sqrt{2} = p/q\\) where \\(p\\) and \\(q\\) are positive integers with no common factors (the fraction is in lowest terms).</p>

<p><strong>Square both sides:</strong> \\(2 = p^2/q^2\\), so \\(p^2 = 2q^2\\).</p>

<p><strong>Deduce:</strong> Since \\(p^2 = 2q^2\\), \\(p^2\\) is even. From Section 1's exercise, if \\(p^2\\) is even then \\(p\\) is even. So \\(p = 2k\\) for some integer \\(k\\).</p>

<p><strong>Substitute:</strong> \\((2k)^2 = 2q^2\\), giving \\(4k^2 = 2q^2\\), so \\(q^2 = 2k^2\\). By the same reasoning, \\(q\\) is also even.</p>

<p><strong>Contradiction:</strong> Both \\(p\\) and \\(q\\) are even, so they share a common factor of 2. But we assumed \\(p/q\\) was in lowest terms (no common factors). This is a contradiction!</p>

<p><strong>Conclusion:</strong> Our assumption was wrong. \\(\\sqrt{2}\\) is irrational. \\(\\square\\)</p>

<div class="env-block intuition">
<strong>Why the proof works.</strong> The key trick is the "infinite descent" flavor. If both \\(p\\) and \\(q\\) are even, you could divide them both by 2 and get a "more reduced" fraction, then repeat. You would descend forever through smaller and smaller integers, which is impossible. The fraction can never actually be in lowest terms, so it cannot exist at all.
</div>

<div class="viz-placeholder" data-viz="viz-sqrt2-proof"></div>

<div class="env-block remark">
<strong>Historical note.</strong> This proof appears (in geometric language) in Euclid's <em>Elements</em>, Book X, Proposition 117. It is one of the earliest known proofs by contradiction, and it remains one of the most beautiful arguments in all of mathematics, over 2,400 years later.
</div>
`,
                visualizations: [
                    {
                        id: 'viz-sqrt2-proof',
                        title: 'Animated \u221A2 Irrationality Proof',
                        description: 'Step through the proof. Watch the assumption p/q = \u221A2 inevitably produce a contradiction.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var step = 0;
                            var maxStep = 6;
                            var animating = false;
                            var animT = 0;

                            var proofSteps = [
                                { text: 'Assume \u221A2 = p/q  (lowest terms, no common factors)', sym: 'p/q' },
                                { text: 'Square both sides: p\u00B2 = 2q\u00B2', sym: 'p\u00B2 = 2q\u00B2' },
                                { text: 'p\u00B2 is even  \u21D2  p is even  \u21D2  p = 2k', sym: 'p = 2k' },
                                { text: 'Substitute: 4k\u00B2 = 2q\u00B2  \u21D2  q\u00B2 = 2k\u00B2', sym: 'q\u00B2 = 2k\u00B2' },
                                { text: 'q\u00B2 is even  \u21D2  q is even', sym: 'q = 2m' },
                                { text: 'Both p and q are even \u2014 they share factor 2!', sym: '2 | p, 2 | q' },
                                { text: 'CONTRADICTION: p/q was supposed to be in lowest terms!', sym: '\u26A0 \u2716' }
                            ];

                            function draw() {
                                viz.clear();

                                // Unit square with diagonal
                                var sqSize = Math.min(w * 0.25, h * 0.35);
                                var sqX = w * 0.72 - sqSize / 2;
                                var sqY = h * 0.18;

                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(sqX, sqY, sqSize, sqSize);

                                // Labels
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('1', sqX + sqSize / 2, sqY + sqSize + 16);
                                ctx.textAlign = 'right';
                                ctx.fillText('1', sqX - 6, sqY + sqSize / 2);

                                // Diagonal
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.moveTo(sqX, sqY + sqSize);
                                ctx.lineTo(sqX + sqSize, sqY);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('\u221A2', sqX + sqSize / 2 + 6, sqY + sqSize / 2 - 4);

                                // Title
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('Proof: \u221A2 is irrational', 16, 26);

                                // Proof steps
                                var startY = 52;
                                var lineH = 34;
                                for (var i = 0; i <= step && i < proofSteps.length; i++) {
                                    var ps = proofSteps[i];
                                    var sy = startY + i * lineH;
                                    var isCurrent = (i === step);
                                    var isContradiction = (i === 6);

                                    // Step marker
                                    var markerColor = isContradiction ? viz.colors.red :
                                        (isCurrent ? viz.colors.teal : viz.colors.text);
                                    ctx.fillStyle = markerColor;
                                    ctx.font = (isCurrent ? 'bold ' : '') + '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';

                                    var prefix = isContradiction ? '\u26A0 ' : ((i + 1) + '. ');
                                    ctx.fillText(prefix + ps.text, 16, sy);

                                    // Highlight box
                                    if (isCurrent) {
                                        ctx.strokeStyle = markerColor + '44';
                                        ctx.lineWidth = 1;
                                        ctx.strokeRect(12, sy - 12, w * 0.55, 18);
                                    }
                                }

                                // Fraction visualization
                                if (step >= 0) {
                                    var fracY = h * 0.75;
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Fraction state:', w * 0.72, fracY - 24);

                                    var pLabel = 'p';
                                    var qLabel = 'q';
                                    var pColor = viz.colors.blue;
                                    var qColor = viz.colors.teal;

                                    if (step >= 2) { pLabel = '2k'; pColor = viz.colors.orange; }
                                    if (step >= 4) { qLabel = '2m'; qColor = viz.colors.orange; }

                                    // p
                                    ctx.fillStyle = pColor;
                                    ctx.font = 'bold 28px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(pLabel, w * 0.72, fracY - 4);

                                    // fraction bar
                                    ctx.strokeStyle = viz.colors.white;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(w * 0.72 - 30, fracY + 4);
                                    ctx.lineTo(w * 0.72 + 30, fracY + 4);
                                    ctx.stroke();

                                    // q
                                    ctx.fillStyle = qColor;
                                    ctx.fillText(qLabel, w * 0.72, fracY + 34);

                                    // "lowest terms" badge
                                    if (step < 5) {
                                        ctx.fillStyle = viz.colors.green + 'aa';
                                        ctx.font = '11px -apple-system,sans-serif';
                                        ctx.fillText('(lowest terms)', w * 0.72, fracY + 56);
                                    } else {
                                        ctx.fillStyle = viz.colors.red;
                                        ctx.font = 'bold 11px -apple-system,sans-serif';
                                        ctx.fillText('NOT lowest terms!', w * 0.72, fracY + 56);

                                        // X over fraction
                                        ctx.strokeStyle = viz.colors.red;
                                        ctx.lineWidth = 3;
                                        ctx.beginPath();
                                        ctx.moveTo(w * 0.72 - 28, fracY - 20);
                                        ctx.lineTo(w * 0.72 + 28, fracY + 44);
                                        ctx.stroke();
                                        ctx.beginPath();
                                        ctx.moveTo(w * 0.72 + 28, fracY - 20);
                                        ctx.lineTo(w * 0.72 - 28, fracY + 44);
                                        ctx.stroke();
                                    }
                                }

                                // Final verdict
                                if (step >= 6) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('\u2234 \u221A2 is irrational. QED', w / 2, h - 16);
                                }
                            }

                            VizEngine.createButton(controls, 'Next Step', function () {
                                if (step < maxStep) step++;
                                draw();
                            });
                            VizEngine.createButton(controls, 'Reset', function () {
                                step = 0;
                                draw();
                            });
                            VizEngine.createButton(controls, 'Show All', function () {
                                step = maxStep;
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Adapt the proof to show that \\(\\sqrt{3}\\) is irrational.',
                        hint: 'Assume \\(\\sqrt{3} = p/q\\) in lowest terms. You will need to show: if \\(p^2\\) is divisible by 3, then \\(p\\) is divisible by 3.',
                        solution: 'Assume \\(\\sqrt{3} = p/q\\) in lowest terms. Then \\(p^2 = 3q^2\\), so \\(3 \\mid p^2\\). Since 3 is prime, \\(3 \\mid p\\), so \\(p = 3k\\). Then \\(9k^2 = 3q^2\\), giving \\(q^2 = 3k^2\\), so \\(3 \\mid q\\). Both \\(p\\) and \\(q\\) are divisible by 3, contradicting "lowest terms." Therefore \\(\\sqrt{3}\\) is irrational.'
                    },
                    {
                        question: 'Does this proof technique work for \\(\\sqrt{4}\\)? Why or why not?',
                        hint: 'Try the same approach. Where does the argument break down?',
                        solution: 'If we assume \\(\\sqrt{4} = p/q\\) in lowest terms, we get \\(p^2 = 4q^2\\), so \\(p^2\\) is divisible by 4. This means \\(p\\) is even, say \\(p = 2k\\). Then \\(4k^2 = 4q^2\\), giving \\(k^2 = q^2\\), so \\(k = q\\). The fraction is \\(p/q = 2k/k = 2\\), which is rational. No contradiction arises, because \\(\\sqrt{4} = 2\\) genuinely is rational.'
                    }
                ]
            },

            // ============================================================
            // Section 3: There are infinitely many primes
            // ============================================================
            {
                id: 'infinitely-many-primes',
                title: 'There Are Infinitely Many Primes',
                content: `
<h2>Euclid's Greatest Hit</h2>

<p>Recall that a <strong>prime number</strong> is a natural number greater than 1 whose only divisors are 1 and itself: 2, 3, 5, 7, 11, 13, .... As you look at bigger and bigger numbers, primes become rarer. Could they eventually run out entirely?</p>

<p>The answer is no, and the proof (attributed to Euclid, around 300 BCE) is one of the most celebrated arguments in all of mathematics. It is also a perfect example of proof by contradiction.</p>

<div class="env-block theorem">
<strong>Euclid's Theorem.</strong> There are infinitely many prime numbers.
</div>

<h3>The Proof</h3>

<p><strong>Assume the opposite:</strong> Suppose there are only finitely many primes. List them all: \\(p_1, p_2, p_3, \\ldots, p_n\\).</p>

<p><strong>Construct a new number:</strong> Define \\(Q = p_1 \\times p_2 \\times p_3 \\times \\cdots \\times p_n + 1\\).</p>

<p><strong>Analyze \\(Q\\):</strong> Divide \\(Q\\) by any prime \\(p_i\\) on our list. Since \\(p_i\\) divides \\(p_1 p_2 \\cdots p_n\\) evenly, dividing \\(Q\\) by \\(p_i\\) leaves a remainder of 1. So \\(Q\\) is <em>not divisible</em> by any prime on our list.</p>

<p><strong>But:</strong> \\(Q\\) is greater than 1, so by the Fundamental Theorem of Arithmetic, \\(Q\\) has at least one prime factor. That prime factor is not on our list.</p>

<p><strong>Contradiction:</strong> We assumed our list contained <em>all</em> primes, but we just found (or proved the existence of) a prime not on it. The assumption fails. \\(\\square\\)</p>

<div class="env-block warning">
<strong>Common misconception.</strong> The number \\(Q = p_1 p_2 \\cdots p_n + 1\\) does <em>not</em> have to be prime itself. It just has to have a prime factor not on the list. For instance, \\(2 \\times 3 \\times 5 \\times 7 \\times 11 \\times 13 + 1 = 30031 = 59 \\times 509\\). Neither 59 nor 509 was on the original list.
</div>

<div class="viz-placeholder" data-viz="viz-euclid-primes"></div>

<div class="env-block remark">
<strong>Over 2,300 years old.</strong> Euclid's proof is found in Book IX, Proposition 20 of his <em>Elements</em>. It requires nothing beyond the definition of divisibility and the fact that every integer greater than 1 has a prime factor. No calculus, no algebra, no modern machinery. Just pure logical reasoning.
</div>
`,
                visualizations: [
                    {
                        id: 'viz-euclid-primes',
                        title: "Euclid's Construction: Product + 1",
                        description: 'Watch Euclid\'s argument in action. We take all known primes, multiply them, add 1, and factor the result to find a new prime not on our list.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;

                            var knownPrimes = [];
                            var Q = 0;
                            var factors = [];
                            var newPrimesFound = [];
                            var level = 0;

                            function isPrime(n) {
                                if (n < 2) return false;
                                if (n === 2) return true;
                                if (n % 2 === 0) return false;
                                for (var i = 3; i * i <= n; i += 2) {
                                    if (n % i === 0) return false;
                                }
                                return true;
                            }

                            function factorize(n) {
                                var fs = [];
                                var d = 2;
                                var m = n;
                                while (d * d <= m) {
                                    while (m % d === 0) { fs.push(d); m /= d; }
                                    d++;
                                }
                                if (m > 1) fs.push(m);
                                return fs;
                            }

                            function reset() {
                                knownPrimes = [2];
                                Q = 0;
                                factors = [];
                                newPrimesFound = [];
                                level = 0;
                            }

                            function doStep() {
                                if (level > 8) return;
                                // Compute Q = product + 1
                                var product = 1;
                                for (var i = 0; i < knownPrimes.length; i++) product *= knownPrimes[i];
                                Q = product + 1;
                                factors = factorize(Q);

                                // Find primes not in our list
                                newPrimesFound = [];
                                var seen = {};
                                for (var j = 0; j < factors.length; j++) {
                                    if (!seen[factors[j]]) {
                                        seen[factors[j]] = true;
                                        if (knownPrimes.indexOf(factors[j]) === -1) {
                                            newPrimesFound.push(factors[j]);
                                        }
                                    }
                                }

                                // Add new primes to our list
                                for (var k = 0; k < newPrimesFound.length; k++) {
                                    if (knownPrimes.indexOf(newPrimesFound[k]) === -1) {
                                        knownPrimes.push(newPrimesFound[k]);
                                    }
                                }
                                knownPrimes.sort(function (a, b) { return a - b; });
                                level++;
                            }

                            function draw() {
                                viz.clear();

                                // Title
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText("Euclid's construction (round " + level + ')', 16, 24);

                                // Known primes list
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('Known primes:', 16, 50);

                                var primeStr = knownPrimes.join(', ');
                                if (primeStr.length > 70) primeStr = primeStr.substring(0, 67) + '...';
                                ctx.fillStyle = viz.colors.gold;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.fillText(primeStr, 16, 70);

                                if (level > 0) {
                                    // Show Q computation
                                    var productStr = '';
                                    // Show previous primes for the product
                                    var prevPrimes = knownPrimes.slice();
                                    // Remove newly found primes
                                    for (var r = 0; r < newPrimesFound.length; r++) {
                                        var idx = prevPrimes.indexOf(newPrimesFound[r]);
                                        if (idx !== -1) prevPrimes.splice(idx, 1);
                                    }
                                    if (prevPrimes.length <= 6) {
                                        productStr = prevPrimes.join(' \u00D7 ') + ' + 1';
                                    } else {
                                        productStr = prevPrimes.slice(0, 4).join(' \u00D7 ') + ' \u00D7 ... + 1';
                                    }

                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('Q = ' + productStr + ' = ' + Q, 16, 100);

                                    // Show factorization
                                    var facStr = factors.join(' \u00D7 ');
                                    if (factors.length === 1 && factors[0] === Q) facStr = Q + ' (prime!)';
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.fillText('Q = ' + facStr, 16, 124);

                                    // Highlight new primes
                                    if (newPrimesFound.length > 0) {
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.font = 'bold 12px -apple-system,sans-serif';
                                        ctx.fillText('New prime(s) found: ' + newPrimesFound.join(', '), 16, 148);
                                        ctx.fillStyle = viz.colors.purple;
                                        ctx.font = '11px -apple-system,sans-serif';
                                        ctx.fillText('Not on our list! Contradiction if we had claimed the list was complete.', 16, 168);
                                    }

                                    // Visual: prime bubbles
                                    var bubbleY = h * 0.62;
                                    var bubbleR = Math.min(20, (w - 40) / (knownPrimes.length * 2.5));
                                    var spacing = bubbleR * 2.5;
                                    var startBX = Math.max(16, (w - knownPrimes.length * spacing) / 2);

                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Prime collection:', w / 2, bubbleY - bubbleR - 12);

                                    for (var b = 0; b < knownPrimes.length; b++) {
                                        var bx = startBX + b * spacing + bubbleR;
                                        var isNew = newPrimesFound.indexOf(knownPrimes[b]) !== -1;
                                        ctx.fillStyle = isNew ? viz.colors.green + '44' : viz.colors.gold + '33';
                                        ctx.beginPath();
                                        ctx.arc(bx, bubbleY, bubbleR, 0, Math.PI * 2);
                                        ctx.fill();
                                        ctx.strokeStyle = isNew ? viz.colors.green : viz.colors.gold;
                                        ctx.lineWidth = isNew ? 2.5 : 1;
                                        ctx.stroke();
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.font = (bubbleR > 14 ? '12' : '9') + 'px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText(knownPrimes[b].toString(), bx, bubbleY);
                                    }

                                    // Message
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'alphabetic';
                                    ctx.fillText('The list keeps growing. It can never be complete!', w / 2, h - 16);
                                } else {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Press "Next Round" to apply Euclid\'s construction', w / 2, h / 2);
                                }
                            }

                            VizEngine.createButton(controls, 'Next Round', function () {
                                doStep();
                                draw();
                            });
                            VizEngine.createButton(controls, 'Reset', function () {
                                reset();
                                draw();
                            });

                            reset();
                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Compute \\(Q = 2 \\times 3 \\times 5 + 1\\). Is \\(Q\\) prime? What new prime(s) did we discover?',
                        hint: 'Calculate \\(Q\\) and try to factor it.',
                        solution: '\\(Q = 2 \\times 3 \\times 5 + 1 = 31\\). Since 31 is not divisible by 2, 3, or 5 (and \\(\\sqrt{31} < 6\\)), 31 is prime. We discovered the prime 31, which was not on our list \\(\\{2, 3, 5\\}\\).'
                    },
                    {
                        question: 'Compute \\(Q = 2 \\times 3 \\times 5 \\times 7 \\times 11 \\times 13 + 1\\). Is \\(Q\\) prime?',
                        hint: 'You do not need to factor it by hand. Just compute \\(Q\\) and check whether it is divisible by small primes not on the list (like 17, 19, 23, ...).',
                        solution: '\\(Q = 30030 + 1 = 30031 = 59 \\times 509\\). So \\(Q\\) is <em>not</em> prime, but its factors 59 and 509 are both primes that were not on the original list. This illustrates that Euclid\'s \\(Q\\) does not have to be prime; it just has to have prime factors not already listed.'
                    },
                    {
                        question: 'Why can\'t we just keep applying Euclid\'s construction to generate all primes in order?',
                        hint: 'Does the construction always produce the "next" prime?',
                        solution: 'No. Starting with \\(\\{2\\}\\), we get \\(Q = 3\\) (prime). Starting with \\(\\{2, 3\\}\\), we get \\(Q = 7\\), skipping 5. The construction does not produce primes in order; it just guarantees the existence of primes not on the list. It is an existence proof, not a generation algorithm.'
                    }
                ]
            },

            // ============================================================
            // Section 4: More contradictions in action
            // ============================================================
            {
                id: 'more-contradictions',
                title: 'More Contradictions in Action',
                content: `
<h2>The Method in Practice</h2>

<p>Now that we have seen two landmark proofs, let us practice the method on some fresh problems. Each example follows the same recipe: assume the opposite, reason carefully, find the contradiction.</p>

<h3>Example 1: No integer is both even and odd</h3>

<div class="env-block example">
<strong>Claim:</strong> No integer can be both even and odd at the same time.<br><br>
<em>Proof.</em> Assume some integer \\(n\\) is both even and odd. Then \\(n = 2a\\) for some integer \\(a\\), and \\(n = 2b + 1\\) for some integer \\(b\\). So \\(2a = 2b + 1\\), which gives \\(2(a - b) = 1\\), so \\(a - b = 1/2\\). But \\(a\\) and \\(b\\) are integers, so \\(a - b\\) is an integer, and no integer equals \\(1/2\\). Contradiction! \\(\\square\\)
</div>

<h3>Example 2: The sum of rational and irrational is irrational</h3>

<div class="env-block example">
<strong>Claim:</strong> If \\(r\\) is rational and \\(x\\) is irrational, then \\(r + x\\) is irrational.<br><br>
<em>Proof.</em> Assume \\(r + x\\) is rational. Then \\(r + x = a/b\\) for integers \\(a, b\\). Since \\(r\\) is rational, \\(r = c/d\\) for integers \\(c, d\\). Then \\(x = (r + x) - r = a/b - c/d = (ad - bc)/(bd)\\), which is rational. But we said \\(x\\) is irrational. Contradiction! \\(\\square\\)
</div>

<h3>Example 3: A classic competition problem</h3>

<div class="env-block example">
<strong>Claim:</strong> In any group of 6 people, either at least 3 of them all know each other, or at least 3 of them are all strangers to each other.<br><br>
<em>Proof sketch (using contradiction thinking).</em> Pick any person, say Alice. She either knows at least 3 of the other 5, or does not know at least 3 of the other 5 (by the Pigeonhole Principle). Suppose Alice knows at least 3 people (say Bob, Carol, Dave). If any two of Bob, Carol, Dave know each other, then those two plus Alice form a group of 3 mutual acquaintances. If none of Bob, Carol, Dave know each other, then they form a group of 3 mutual strangers. Either way, the claim holds. (The other case is symmetric.) \\(\\square\\)
</div>

<p>This last example is a preview of the <strong>Pigeonhole Principle</strong> and <strong>Ramsey Theory</strong>, which you will meet in later chapters. For now, notice how the "what if not?" style of thinking helps us navigate through cases.</p>

<div class="env-block remark">
<strong>Proof by contradiction vs. proof by contrapositive.</strong> These are related but distinct. Proof by contrapositive proves "if \\(A\\) then \\(B\\)" by proving "if not \\(B\\) then not \\(A\\)." Proof by contradiction assumes "\\(A\\) and not \\(B\\)" and derives any absurdity. The contrapositive is logically equivalent to the original; contradiction is a more general technique that can prove statements beyond conditionals.
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'Prove by contradiction: \\(\\log_2 3\\) is irrational.',
                        hint: 'Assume \\(\\log_2 3 = p/q\\) for positive integers \\(p, q\\). Then \\(2^{p/q} = 3\\), so \\(2^p = 3^q\\). Think about even and odd.',
                        solution: 'Assume \\(\\log_2 3 = p/q\\) with \\(p, q\\) positive integers. Then \\(2^{p/q} = 3\\), so \\(2^p = 3^q\\). But \\(2^p\\) is even and \\(3^q\\) is odd. An even number cannot equal an odd number. Contradiction! So \\(\\log_2 3\\) is irrational.'
                    },
                    {
                        question: 'Prove: If \\(a^2\\) is divisible by 5, then \\(a\\) is divisible by 5. (You may use the fact that 5 is prime.)',
                        hint: 'Assume \\(a\\) is NOT divisible by 5. Then \\(a = 5k + r\\) where \\(r \\in \\{1,2,3,4\\}\\). Compute \\(a^2 \\mod 5\\).',
                        solution: 'Assume \\(a\\) is not divisible by 5. Then \\(a \\equiv 1, 2, 3,\\) or \\(4 \\pmod{5}\\). Squaring: \\(1^2=1, 2^2=4, 3^2=9\\equiv 4, 4^2=16\\equiv 1 \\pmod{5}\\). In every case \\(a^2 \\not\\equiv 0 \\pmod{5}\\), meaning \\(a^2\\) is not divisible by 5. But we were told \\(a^2\\) is divisible by 5. Contradiction!'
                    }
                ]
            },

            // ============================================================
            // Section 5: When to use contradiction
            // ============================================================
            {
                id: 'when-to-use',
                title: 'When to Use Contradiction',
                content: `
<h2>The Right Tool for the Right Job</h2>

<p>Proof by contradiction is powerful, but it is not always the best approach. Here is a guide for when to reach for it and when to try something else.</p>

<h3>Contradiction works well when:</h3>

<ul>
<li><strong>You want to prove non-existence.</strong> "There is no X such that ..." is naturally suited to contradiction. Assume such an X exists and show it leads to trouble.</li>
<li><strong>You want to prove uniqueness.</strong> Assume there are two different things satisfying a condition, then show they must actually be the same.</li>
<li><strong>Direct construction is hard.</strong> Sometimes it is much easier to assume the conclusion is false and derive nonsense than to directly build the object you want.</li>
<li><strong>The statement involves irrational numbers or infinity.</strong> It is hard to directly "show" a number is irrational. But assuming it is rational and deriving a contradiction is often clean.</li>
</ul>

<h3>Contradiction is less ideal when:</h3>

<ul>
<li><strong>A direct proof is available.</strong> If you can prove "A implies B" directly, that is usually clearer and more informative than going through contradiction.</li>
<li><strong>You want constructive information.</strong> Contradiction tells you something exists or is true, but it rarely tells you what the thing looks like. Euclid's proof tells us there are infinitely many primes but does not produce a formula for generating them.</li>
</ul>

<div class="env-block intuition">
<strong>A rule of thumb.</strong> Try direct proof first. If you get stuck, flip to contradiction: assume the opposite and see where it leads. Often the contradiction will reveal exactly what a direct proof should look like.
</div>

<h3>Famous proofs by contradiction in mathematics</h3>

<table style="width:100%; border-collapse:collapse; margin:16px 0;">
<tr style="border-bottom:1px solid #30363d;">
<th style="text-align:left; padding:8px; color:#8b949e;">Result</th>
<th style="text-align:left; padding:8px; color:#8b949e;">Who / When</th>
<th style="text-align:left; padding:8px; color:#8b949e;">Contradiction</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">\\(\\sqrt{2}\\) is irrational</td>
<td style="padding:8px;">Hippasus, ~500 BCE</td>
<td style="padding:8px;">p/q in lowest terms, but both even</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">Infinitely many primes</td>
<td style="padding:8px;">Euclid, ~300 BCE</td>
<td style="padding:8px;">Product + 1 has unlisted prime factor</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">No largest real number</td>
<td style="padding:8px;">Ancient</td>
<td style="padding:8px;">\\(N + 1 > N\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">Cantor's diagonal argument</td>
<td style="padding:8px;">Cantor, 1891</td>
<td style="padding:8px;">Constructed real not in any list</td>
</tr>
<tr>
<td style="padding:8px;">Halting problem is undecidable</td>
<td style="padding:8px;">Turing, 1936</td>
<td style="padding:8px;">Self-referential paradox</td>
</tr>
</table>

<p>Contradiction is one of the most versatile tools in the mathematician's toolkit. Once you internalize the pattern (assume the opposite, derive nonsense, conclude the original), you will find yourself using it everywhere, not just in math, but in everyday reasoning. "If this were true, then ... but that's impossible, so it can't be true." That is contradiction at work.</p>

<div class="env-block definition">
<strong>Summary: The Contradiction Recipe</strong><br>
<ol>
<li>State clearly what you want to prove.</li>
<li>Assume the <em>negation</em> of your statement.</li>
<li>Reason logically from that assumption, using definitions, axioms, and previously proven results.</li>
<li>Arrive at a statement that contradicts something known to be true.</li>
<li>Conclude that the negation is false, so the original statement is true.</li>
</ol>
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'Prove by contradiction: There is no rational number \\(r\\) such that \\(r^2 = 6\\).',
                        hint: 'Follow the same structure as the \\(\\sqrt{2}\\) proof. You will need to use the fact that if \\(p^2\\) is divisible by 2 (or by 3), then \\(p\\) is divisible by 2 (or by 3).',
                        solution: 'Assume \\(\\sqrt{6} = p/q\\) in lowest terms. Then \\(p^2 = 6q^2 = 2 \\cdot 3 \\cdot q^2\\). Since \\(2 \\mid p^2\\), we get \\(2 \\mid p\\), so \\(p = 2k\\). Then \\(4k^2 = 6q^2\\), so \\(2k^2 = 3q^2\\). Now \\(2 \\mid 3q^2\\), and since \\(\\gcd(2,3) = 1\\), we get \\(2 \\mid q^2\\), hence \\(2 \\mid q\\). Both \\(p\\) and \\(q\\) are even, contradicting lowest terms.'
                    },
                    {
                        question: 'Which proof technique would you choose for each statement? (a) "The sum of two even numbers is even." (b) "\\(\\sqrt{5}\\) is irrational." (c) "If \\(n\\) is odd, then \\(n^2\\) is odd."',
                        hint: 'For each, ask: is a direct approach easy, or is assuming the opposite more natural?',
                        solution: '(a) Direct proof: let the two even numbers be \\(2a\\) and \\(2b\\); their sum is \\(2(a+b)\\), which is even. Clean and simple. (b) Contradiction: assume \\(\\sqrt{5} = p/q\\), derive that both are divisible by 5. Direct proof would be awkward. (c) Direct proof or contrapositive: if \\(n = 2k+1\\), then \\(n^2 = 4k^2 + 4k + 1 = 2(2k^2+2k) + 1\\), which is odd. A direct approach is clearest here.'
                    }
                ]
            }
        ]
    });
})();
