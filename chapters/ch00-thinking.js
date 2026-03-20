// === Chapter 0: Thinking Like a Mathematician ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch00-thinking',
    number: 0,
    title: 'Thinking Like a Mathematician',
    subtitle: 'What does it mean to think mathematically?',
    sections: [
        // ================================================================
        // SECTION 1: Welcome to Math Thinking!
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Welcome to Math Thinking!',
            content: `
<h2>Welcome to Math Thinking!</h2>

<p>Mathematics is not about memorizing formulas. It is about learning to think clearly, spot hidden patterns, and build arguments so airtight that no one can poke a hole in them.</p>

<p>Think of a detective. A detective gathers clues, tests theories, and eliminates possibilities until only the truth remains. A mathematician does exactly the same thing, except the clues are numbers, shapes, and logical relationships.</p>

<div class="env-block intuition">
    <div class="env-title">The Core Idea</div>
    <div class="env-body">
        <p>Mathematical thinking has three steps that repeat over and over:</p>
        <ol>
            <li><strong>Explore</strong>: Try examples. Play around. Get your hands dirty.</li>
            <li><strong>Conjecture</strong>: Spot a pattern. Make a guess about what is always true.</li>
            <li><strong>Prove</strong>: Convince yourself (and a skeptic) that your guess really is always true.</li>
        </ol>
        <p>This cycle, explore-conjecture-prove, is the heartbeat of mathematics.</p>
    </div>
</div>

<p>In this chapter, we will work through each of these steps using puzzles and games. You do not need any background beyond basic arithmetic. All you need is curiosity.</p>

<h3>Why Does This Matter?</h3>

<p>Mathematical thinking is useful far beyond math class. Whenever you need to:</p>
<ul>
    <li>Figure out whether a claim is actually true (not just plausible)</li>
    <li>Solve a problem nobody has solved for you before</li>
    <li>Explain your reasoning clearly to someone who disagrees</li>
</ul>
<p>you are using mathematical thinking. Let us start by seeing it in action.</p>

<div class="viz-placeholder" data-viz="viz-handshake-puzzle"></div>
`,
            visualizations: [
                {
                    id: 'viz-handshake-puzzle',
                    title: 'The Handshake Puzzle',
                    description: 'N people are in a room. Everyone shakes hands with everyone else exactly once. How many handshakes? Try small cases and watch the pattern emerge.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nPeople = 4;
                        var animProgress = 0;
                        var animating = false;
                        var animId = null;

                        VizEngine.createSlider(controls, 'People (N)', 2, 12, nPeople, 1, function(v) {
                            nPeople = Math.round(v);
                            animProgress = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate Handshakes', function() {
                            if (animating) return;
                            animating = true;
                            animProgress = 0;
                            var totalEdges = nPeople * (nPeople - 1) / 2;
                            function step() {
                                animProgress += 0.5;
                                draw();
                                if (animProgress >= totalEdges + 2) {
                                    animating = false;
                                    animProgress = totalEdges;
                                    draw();
                                    return;
                                }
                                animId = requestAnimationFrame(step);
                            }
                            step();
                        });

                        var personColors = [
                            viz.colors.blue, viz.colors.teal, viz.colors.orange,
                            viz.colors.purple, viz.colors.green, viz.colors.red,
                            viz.colors.yellow, viz.colors.pink, viz.colors.blue,
                            viz.colors.teal, viz.colors.orange, viz.colors.purple
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var cx = w / 2, cy = h / 2 - 10;
                            var radius = Math.min(w, h) * 0.32;

                            // Title
                            viz.screenText('The Handshake Puzzle', w / 2, 18, viz.colors.white, 15);

                            // Place people in a circle
                            var points = [];
                            for (var i = 0; i < nPeople; i++) {
                                var angle = (Math.PI * 2 / nPeople) * i - Math.PI / 2;
                                points.push({
                                    x: cx + radius * Math.cos(angle),
                                    y: cy + radius * Math.sin(angle)
                                });
                            }

                            // Draw edges (handshakes)
                            var totalEdges = nPeople * (nPeople - 1) / 2;
                            var showEdges = Math.floor(animProgress > 0 ? animProgress : totalEdges);
                            var edgeCount = 0;
                            for (var a = 0; a < nPeople; a++) {
                                for (var b = a + 1; b < nPeople; b++) {
                                    if (edgeCount < showEdges) {
                                        ctx.strokeStyle = viz.colors.grid;
                                        ctx.lineWidth = 1.5;
                                        ctx.globalAlpha = 0.5;
                                        ctx.beginPath();
                                        ctx.moveTo(points[a].x, points[a].y);
                                        ctx.lineTo(points[b].x, points[b].y);
                                        ctx.stroke();
                                        ctx.globalAlpha = 1;
                                    }
                                    edgeCount++;
                                }
                            }

                            // Draw people
                            for (var p = 0; p < nPeople; p++) {
                                ctx.fillStyle = personColors[p % personColors.length];
                                ctx.beginPath();
                                ctx.arc(points[p].x, points[p].y, 12, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText((p + 1).toString(), points[p].x, points[p].y);
                            }

                            // Formula display
                            var formula = nPeople + ' people: each shakes ' + (nPeople - 1) + ' hands';
                            viz.screenText(formula, w / 2, h - 60, viz.colors.text, 12);

                            var counted = nPeople * (nPeople - 1);
                            var actual = totalEdges;
                            viz.screenText(
                                nPeople + ' x ' + (nPeople - 1) + ' = ' + counted +
                                ', but each handshake counted twice, so ' + counted + ' / 2 = ' + actual,
                                w / 2, h - 40, viz.colors.teal, 12
                            );

                            // Show small cases table
                            if (nPeople <= 6) {
                                var tableY = h - 18;
                                var cases = [];
                                for (var k = 2; k <= Math.max(nPeople, 5); k++) {
                                    cases.push('N=' + k + ': ' + (k * (k - 1) / 2));
                                }
                                viz.screenText(cases.join('   '), w / 2, tableY, viz.colors.text, 10);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'If there are 100 people in a room and each person shakes hands with every other person exactly once, how many handshakes happen in total?',
                    hint: 'Each of the 100 people shakes hands with 99 others. But each handshake involves two people, so you are counting each handshake twice.',
                    solution: 'Total handshakes = \\(\\frac{100 \\times 99}{2} = 4{,}950\\). In general, \\(N\\) people produce \\(\\frac{N(N-1)}{2}\\) handshakes.'
                },
            ]
        },

        // ================================================================
        // SECTION 2: Experiment & Explore
        // ================================================================
        {
            id: 'sec-experiment',
            title: 'Experiment & Explore',
            content: `
<h2>Experiment & Explore</h2>

<p>The first step in mathematical thinking is to <strong>play</strong>. Try things out. Get examples. Mathematicians do not start with proofs; they start with experiments.</p>

<div class="env-block intuition">
    <div class="env-title">The Power of Small Cases</div>
    <div class="env-body">
        <p>When you face a big, scary problem, shrink it. If the problem asks about 100 objects, try 2, 3, 4, and 5 first. Small cases are easy to check by hand, and the patterns they reveal often point straight to the general answer.</p>
    </div>
</div>

<h3>Gauss's Trick: Adding 1 + 2 + ... + 100</h3>

<p>Legend has it that the young Carl Friedrich Gauss was asked by his teacher to add the numbers 1 through 100. While the other students began laboriously adding, Gauss paired the numbers:</p>

<p>\\(1 + 100 = 101\\), \\(2 + 99 = 101\\), \\(3 + 98 = 101\\), ..., \\(50 + 51 = 101\\).</p>

<p>There are 50 such pairs, each summing to 101. So the total is \\(50 \\times 101 = 5{,}050\\).</p>

<div class="env-block remark">
    <div class="env-title">The Method, Not the Answer</div>
    <div class="env-body">
        <p>The answer 5,050 is nice, but the real treasure is the <em>method</em>. By pairing numbers from opposite ends, Gauss turned an addition of 100 terms into a single multiplication. That is the kind of insight that mathematical thinking produces.</p>
    </div>
</div>

<p>The general formula for the sum of the first \\(N\\) natural numbers is:</p>

\\[1 + 2 + 3 + \\cdots + N = \\frac{N(N+1)}{2}.\\]

<p>Try it: for \\(N = 100\\), we get \\(\\frac{100 \\times 101}{2} = 5{,}050\\). For \\(N = 10\\), we get \\(\\frac{10 \\times 11}{2} = 55\\). Check it by hand: \\(1+2+3+4+5+6+7+8+9+10 = 55\\). It works.</p>

<div class="viz-placeholder" data-viz="viz-gauss-trick"></div>
`,
            visualizations: [
                {
                    id: 'viz-gauss-trick',
                    title: "Gauss's Pairing Trick",
                    description: 'Watch how pairing numbers from opposite ends of 1+2+...+N produces equal sums. The animation shows the pairing step by step.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var nVal = 10;
                        var pairStep = 0;
                        var animating = false;

                        VizEngine.createSlider(controls, 'N', 4, 20, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            pairStep = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Animate Pairing', function() {
                            if (animating) return;
                            animating = true;
                            pairStep = 0;
                            var maxPairs = Math.floor(nVal / 2);
                            function step() {
                                pairStep++;
                                draw();
                                if (pairStep >= maxPairs) {
                                    animating = false;
                                    return;
                                }
                                setTimeout(step, 600);
                            }
                            step();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;

                            viz.screenText("Gauss's Pairing Trick: 1 + 2 + ... + " + nVal, w / 2, 20, viz.colors.white, 15);

                            // Draw number boxes
                            var boxW = Math.min(40, (w - 60) / nVal);
                            var boxH = 30;
                            var startX = (w - nVal * boxW) / 2;
                            var row1Y = 70;

                            // Colors for paired numbers
                            var pairColors = [
                                viz.colors.blue, viz.colors.teal, viz.colors.orange,
                                viz.colors.purple, viz.colors.green, viz.colors.red,
                                viz.colors.yellow, viz.colors.pink, viz.colors.blue, viz.colors.teal
                            ];

                            var maxPairs = Math.floor(nVal / 2);
                            var pairSum = nVal + 1;

                            for (var i = 0; i < nVal; i++) {
                                var num = i + 1;
                                var bx = startX + i * boxW;

                                // Determine if this number is in a highlighted pair
                                var paired = false;
                                var pairColor = viz.colors.text;
                                for (var p = 0; p < Math.min(pairStep, maxPairs); p++) {
                                    var lo = p + 1;
                                    var hi = nVal - p;
                                    if (num === lo || num === hi) {
                                        paired = true;
                                        pairColor = pairColors[p % pairColors.length];
                                    }
                                }

                                // Box
                                ctx.fillStyle = paired ? pairColor + '33' : viz.colors.bg;
                                ctx.strokeStyle = paired ? pairColor : viz.colors.grid;
                                ctx.lineWidth = paired ? 2 : 1;
                                ctx.fillRect(bx + 1, row1Y, boxW - 2, boxH);
                                ctx.strokeRect(bx + 1, row1Y, boxW - 2, boxH);

                                // Number
                                ctx.fillStyle = paired ? pairColor : viz.colors.text;
                                ctx.font = (boxW < 30 ? '10' : '12') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(num.toString(), bx + boxW / 2, row1Y + boxH / 2);
                            }

                            // Draw arcs connecting pairs
                            for (var p2 = 0; p2 < Math.min(pairStep, maxPairs); p2++) {
                                var lo2 = p2;
                                var hi2 = nVal - 1 - p2;
                                var x1 = startX + lo2 * boxW + boxW / 2;
                                var x2 = startX + hi2 * boxW + boxW / 2;
                                var arcY = row1Y + boxH + 15 + p2 * 18;
                                var col = pairColors[p2 % pairColors.length];

                                ctx.strokeStyle = col;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                var midArcX = (x1 + x2) / 2;
                                ctx.moveTo(x1, row1Y + boxH);
                                ctx.quadraticCurveTo(midArcX, arcY + 10, x2, row1Y + boxH);
                                ctx.stroke();

                                // Label the sum
                                ctx.fillStyle = col;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('= ' + pairSum, midArcX, arcY + 6);
                            }

                            // Result area
                            var resultY = h - 80;
                            if (pairStep > 0) {
                                var shownPairs = Math.min(pairStep, maxPairs);
                                var isOdd = nVal % 2 === 1;
                                var midNum = isOdd ? Math.ceil(nVal / 2) : null;

                                viz.screenText(
                                    shownPairs + ' pair' + (shownPairs > 1 ? 's' : '') + ', each summing to ' + pairSum,
                                    w / 2, resultY, viz.colors.teal, 13
                                );

                                if (shownPairs === maxPairs) {
                                    var total = maxPairs * pairSum + (isOdd ? midNum : 0);
                                    var explanation = maxPairs + ' x ' + pairSum;
                                    if (isOdd) explanation += ' + ' + midNum;
                                    explanation += ' = ' + total;
                                    viz.screenText(explanation, w / 2, resultY + 24, viz.colors.white, 14);

                                    viz.screenText(
                                        'Formula: N(N+1)/2 = ' + nVal + ' x ' + (nVal + 1) + ' / 2 = ' + (nVal * (nVal + 1) / 2),
                                        w / 2, resultY + 48, viz.colors.orange, 12
                                    );
                                }
                            } else {
                                viz.screenText('Click "Animate Pairing" to see the trick', w / 2, resultY, viz.colors.text, 12);
                                viz.screenText(
                                    'Sum = ' + (nVal * (nVal + 1) / 2),
                                    w / 2, resultY + 24, viz.colors.teal, 13
                                );
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use Gauss\'s trick to find the sum \\(1 + 2 + 3 + \\cdots + 50\\).',
                    hint: 'Pair the first and last, second and second-to-last, etc. How many pairs are there and what does each pair sum to?',
                    solution: 'There are 25 pairs, each summing to 51: \\((1+50), (2+49), \\ldots, (25+26)\\). Total = \\(25 \\times 51 = 1{,}275\\). Equivalently, \\(\\frac{50 \\times 51}{2} = 1{,}275\\).'
                },
                {
                    question: 'What is \\(2 + 4 + 6 + \\cdots + 200\\)? (The sum of the first 100 even numbers.)',
                    hint: 'Factor out 2: this is \\(2(1 + 2 + 3 + \\cdots + 100)\\).',
                    solution: '\\(2 + 4 + \\cdots + 200 = 2(1 + 2 + \\cdots + 100) = 2 \\times \\frac{100 \\times 101}{2} = 10{,}100\\).'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Make a Conjecture
        // ================================================================
        {
            id: 'sec-conjecture',
            title: 'Make a Conjecture',
            content: `
<h2>Make a Conjecture</h2>

<p>A <strong>conjecture</strong> is an educated guess based on evidence. It is not a random stab in the dark; it is a pattern you have noticed in your experiments that you <em>think</em> might always be true.</p>

<div class="env-block definition">
    <div class="env-title">Definition</div>
    <div class="env-body">
        <p>A <strong>conjecture</strong> is a statement that is believed to be true based on evidence, but has not yet been proven.</p>
    </div>
</div>

<h3>The Process</h3>

<ol>
    <li><strong>Gather data</strong>: Compute examples. Lots of them.</li>
    <li><strong>Look for a pattern</strong>: Is there a formula? A rule? A shape?</li>
    <li><strong>State your conjecture precisely</strong>: Write it down so clearly that someone else could check whether any given case satisfies it.</li>
    <li><strong>Test it on more cases</strong>: Try to break it. If it survives, you gain confidence (but not certainty).</li>
</ol>

<div class="env-block example">
    <div class="env-title">Example: Sum of Odd Numbers</div>
    <div class="env-body">
        <p>Compute the first few sums of consecutive odd numbers starting from 1:</p>
        <ul>
            <li>\\(1 = 1\\)</li>
            <li>\\(1 + 3 = 4\\)</li>
            <li>\\(1 + 3 + 5 = 9\\)</li>
            <li>\\(1 + 3 + 5 + 7 = 16\\)</li>
            <li>\\(1 + 3 + 5 + 7 + 9 = 25\\)</li>
        </ul>
        <p>Pattern: \\(1, 4, 9, 16, 25, \\ldots\\) These are perfect squares!</p>
        <p><strong>Conjecture:</strong> The sum of the first \\(n\\) odd numbers equals \\(n^2\\).</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Warning: Evidence Is Not Proof</div>
    <div class="env-body">
        <p>A conjecture can look true for millions of cases and still be false. The statement "\\(n^2 + n + 41\\) is prime for all positive integers \\(n\\)" passes for \\(n = 1, 2, 3, \\ldots, 39\\) (check it!) but fails at \\(n = 40\\): \\(40^2 + 40 + 41 = 1{,}681 = 41^2\\). Testing is necessary, but it is not sufficient.</p>
    </div>
</div>

<p>Use the visualization below to test conjectures about numbers. Type in a rule and see if it holds for the first many cases.</p>

<div class="viz-placeholder" data-viz="viz-conjecture-tester"></div>
`,
            visualizations: [
                {
                    id: 'viz-conjecture-tester',
                    title: 'Conjecture Tester',
                    description: 'Choose a conjecture about numbers and test it against many cases. Watch for counterexamples!',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var conjectures = [
                            {
                                name: 'Sum of first n odd numbers = n^2',
                                test: function(n) {
                                    var sum = 0;
                                    for (var i = 0; i < n; i++) sum += (2 * i + 1);
                                    return sum === n * n;
                                },
                                formula: function(n) {
                                    var sum = 0;
                                    for (var i = 0; i < n; i++) sum += (2 * i + 1);
                                    return { left: sum, right: n * n };
                                }
                            },
                            {
                                name: 'n^2 + n + 41 is always prime',
                                test: function(n) {
                                    var val = n * n + n + 41;
                                    if (val < 2) return false;
                                    for (var d = 2; d * d <= val; d++) {
                                        if (val % d === 0) return false;
                                    }
                                    return true;
                                },
                                formula: function(n) {
                                    var val = n * n + n + 41;
                                    var isPrime = true;
                                    if (val < 2) isPrime = false;
                                    for (var d = 2; d * d <= val; d++) {
                                        if (val % d === 0) { isPrime = false; break; }
                                    }
                                    return { left: val, right: isPrime ? 'PRIME' : 'NOT PRIME' };
                                }
                            },
                            {
                                name: 'Every even number > 2 is sum of two primes (Goldbach)',
                                test: function(n) {
                                    var val = 2 * n + 2;
                                    if (val <= 2) return true;
                                    function ip(x) {
                                        if (x < 2) return false;
                                        for (var d = 2; d * d <= x; d++) { if (x % d === 0) return false; }
                                        return true;
                                    }
                                    for (var p = 2; p <= val / 2; p++) {
                                        if (ip(p) && ip(val - p)) return true;
                                    }
                                    return false;
                                },
                                formula: function(n) {
                                    var val = 2 * n + 2;
                                    function ip(x) {
                                        if (x < 2) return false;
                                        for (var d = 2; d * d <= x; d++) { if (x % d === 0) return false; }
                                        return true;
                                    }
                                    for (var p = 2; p <= val / 2; p++) {
                                        if (ip(p) && ip(val - p)) return { left: val, right: p + ' + ' + (val - p) };
                                    }
                                    return { left: val, right: 'NO DECOMPOSITION' };
                                }
                            },
                            {
                                name: '2^n > n^2 for all n >= 5',
                                test: function(n) {
                                    if (n < 5) return true;
                                    return Math.pow(2, n) > n * n;
                                },
                                formula: function(n) {
                                    return { left: Math.pow(2, n), right: n * n };
                                }
                            }
                        ];

                        var selectedConj = 0;
                        var maxN = 50;

                        // Conjecture selector buttons
                        var btnContainer = document.createElement('div');
                        btnContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;margin-bottom:6px;';
                        controls.appendChild(btnContainer);

                        conjectures.forEach(function(c, idx) {
                            var btn = VizEngine.createButton(btnContainer, c.name.substring(0, 35) + (c.name.length > 35 ? '...' : ''), function() {
                                selectedConj = idx;
                                draw();
                            });
                            btn.style.fontSize = '0.7rem';
                            btn.style.padding = '3px 8px';
                        });

                        VizEngine.createSlider(controls, 'Test up to n =', 10, 100, maxN, 10, function(v) {
                            maxN = Math.round(v);
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var conj = conjectures[selectedConj];

                            viz.screenText('Conjecture: ' + conj.name, w / 2, 18, viz.colors.white, 13);

                            // Test each n
                            var results = [];
                            var firstFail = -1;
                            for (var n = 1; n <= maxN; n++) {
                                var pass = conj.test(n);
                                results.push(pass);
                                if (!pass && firstFail < 0) firstFail = n;
                            }

                            // Draw grid of results
                            var cols = Math.ceil(Math.sqrt(maxN * 1.5));
                            var rows = Math.ceil(maxN / cols);
                            var cellW = Math.min(25, (w - 40) / cols);
                            var cellH = Math.min(22, (h - 100) / rows);
                            var gridW = cols * cellW;
                            var startX = (w - gridW) / 2;
                            var startY = 45;

                            for (var i = 0; i < maxN; i++) {
                                var row = Math.floor(i / cols);
                                var col = i % cols;
                                var cx2 = startX + col * cellW + cellW / 2;
                                var cy2 = startY + row * cellH + cellH / 2;

                                // Background
                                ctx.fillStyle = results[i] ? viz.colors.green + '33' : viz.colors.red + '88';
                                ctx.fillRect(cx2 - cellW / 2 + 1, cy2 - cellH / 2 + 1, cellW - 2, cellH - 2);

                                // Number
                                ctx.fillStyle = results[i] ? viz.colors.green : viz.colors.red;
                                ctx.font = (cellW < 20 ? '8' : '10') + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText((i + 1).toString(), cx2, cy2);
                            }

                            // Summary
                            var passCount = results.filter(function(r) { return r; }).length;
                            var summaryY = h - 40;

                            if (firstFail >= 0) {
                                var info = conj.formula(firstFail);
                                viz.screenText(
                                    'COUNTEREXAMPLE at n = ' + firstFail + ': ' + info.left + ' vs ' + info.right,
                                    w / 2, summaryY, viz.colors.red, 13
                                );
                            } else {
                                viz.screenText(
                                    'All ' + passCount + ' cases pass. (But this is NOT a proof!)',
                                    w / 2, summaryY, viz.colors.green, 13
                                );
                            }

                            // Legend
                            ctx.fillStyle = viz.colors.green + '33';
                            ctx.fillRect(w / 2 - 90, summaryY + 16, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Pass', w / 2 - 74, summaryY + 24);

                            ctx.fillStyle = viz.colors.red + '88';
                            ctx.fillRect(w / 2 + 10, summaryY + 16, 12, 12);
                            ctx.fillStyle = viz.colors.text;
                            ctx.fillText('Fail', w / 2 + 26, summaryY + 24);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute \\(1^3, 1^3+2^3, 1^3+2^3+3^3, 1^3+2^3+3^3+4^3\\). What pattern do you notice? State a conjecture.',
                    hint: 'The sums are 1, 9, 36, 100. These are all perfect squares. What squares are they?',
                    solution: '\\(1^3 = 1 = 1^2\\), \\(1^3 + 2^3 = 9 = 3^2\\), \\(1^3 + 2^3 + 3^3 = 36 = 6^2\\), \\(1^3 + 2^3 + 3^3 + 4^3 = 100 = 10^2\\). The bases 1, 3, 6, 10 are triangular numbers \\(T_n = n(n+1)/2\\). Conjecture: \\(1^3 + 2^3 + \\cdots + n^3 = \\left(\\frac{n(n+1)}{2}\\right)^2\\).'
                },
                {
                    question: 'For which positive integers \\(n\\) does \\(n^2 + n + 41\\) fail to be prime? Find the smallest such \\(n\\).',
                    hint: 'Try \\(n = 40\\). What happens?',
                    solution: 'At \\(n = 40\\): \\(40^2 + 40 + 41 = 1600 + 40 + 41 = 1681 = 41^2\\). This is not prime. (In fact, \\(n = 41\\) also fails: \\(41^2 + 41 + 41 = 41 \\times 43\\).) The conjecture "always prime" is false despite 39 consecutive successes.'
                }
            ]
        },

        // ================================================================
        // SECTION 4: Convince a Skeptic
        // ================================================================
        {
            id: 'sec-prove',
            title: 'Convince a Skeptic',
            content: `
<h2>Convince a Skeptic</h2>

<p>You have spotted a pattern and made a conjecture. Now comes the hardest (and most rewarding) part: <strong>proving</strong> that it is always true.</p>

<div class="env-block intuition">
    <div class="env-title">Why Not Just Check Examples?</div>
    <div class="env-body">
        <p>Because there are infinitely many cases, and you cannot check them all. A proof is an argument that covers every case at once, leaving no room for exceptions. It is what separates "I believe this" from "I know this."</p>
    </div>
</div>

<h3>A Visual Proof: The Mutilated Chessboard</h3>

<p>Here is a classic puzzle. Take a standard 8x8 chessboard and remove two diagonally opposite corners. You are left with 62 squares. Can you tile this board perfectly with dominoes, where each domino covers exactly two squares?</p>

<p>At first, it seems like it should be possible: 62 squares, 31 dominoes, the numbers work out. But try it! You will find that it is impossible.</p>

<div class="env-block theorem">
    <div class="env-title">Why It Is Impossible</div>
    <div class="env-body">
        <p>Color the board like a normal chessboard. The two removed corners are the <em>same color</em> (both are, say, black). So the remaining board has 32 white squares and 30 black squares. But every domino, no matter how you place it, covers exactly one white square and one black square (because adjacent squares always have different colors). So 31 dominoes would need to cover 31 white and 31 black squares. But we have 32 white and 30 black. Impossible.</p>
    </div>
</div>

<p>This is a <strong>proof by coloring argument</strong> (a type of invariant argument). We did not try all possible tilings. Instead, we found a property (the color balance) that every valid tiling must satisfy, and showed that our board violates it. One clean argument, infinitely many tilings ruled out at once.</p>

<div class="viz-placeholder" data-viz="viz-chessboard-domino"></div>
`,
            visualizations: [
                {
                    id: 'viz-chessboard-domino',
                    title: 'Mutilated Chessboard Puzzle',
                    description: 'Try to tile the mutilated chessboard with dominoes! Click two adjacent squares to place a domino. Can you cover all 62 squares?',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 440,
                            originX: 0, originY: 0, scale: 1
                        });

                        var N = 8;
                        var cellSize = 42;
                        var boardX = (viz.width - N * cellSize) / 2;
                        var boardY = 40;
                        // 0 = empty, -1 = removed, positive = domino id
                        var board = [];
                        var dominoCount = 0;
                        var nextDominoId = 1;
                        var selected = null; // {r, c} of first click

                        var dominoColors = [
                            viz.colors.blue, viz.colors.teal, viz.colors.orange,
                            viz.colors.purple, viz.colors.green, viz.colors.yellow,
                            viz.colors.pink, viz.colors.red
                        ];

                        function initBoard() {
                            board = [];
                            for (var r = 0; r < N; r++) {
                                board[r] = [];
                                for (var c = 0; c < N; c++) {
                                    board[r][c] = 0;
                                }
                            }
                            // Remove opposite corners
                            board[0][0] = -1;
                            board[N - 1][N - 1] = -1;
                            dominoCount = 0;
                            nextDominoId = 1;
                            selected = null;
                        }
                        initBoard();

                        VizEngine.createButton(controls, 'Reset', function() {
                            initBoard();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Show Color Argument', function() {
                            showColorArg = !showColorArg;
                            draw();
                        });

                        var showColorArg = false;

                        // Handle clicks on the board
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            var col = Math.floor((mx - boardX) / cellSize);
                            var row = Math.floor((my - boardY) / cellSize);

                            if (row < 0 || row >= N || col < 0 || col >= N) return;
                            if (board[row][col] !== 0) {
                                // If clicking on a domino, remove it
                                if (board[row][col] > 0) {
                                    var did = board[row][col];
                                    for (var rr = 0; rr < N; rr++) {
                                        for (var cc = 0; cc < N; cc++) {
                                            if (board[rr][cc] === did) board[rr][cc] = 0;
                                        }
                                    }
                                    dominoCount--;
                                    selected = null;
                                    draw();
                                }
                                return;
                            }

                            if (selected === null) {
                                selected = { r: row, c: col };
                                draw();
                            } else {
                                // Check adjacency
                                var dr = Math.abs(row - selected.r);
                                var dc = Math.abs(col - selected.c);
                                if ((dr === 1 && dc === 0) || (dr === 0 && dc === 1)) {
                                    // Place domino
                                    board[selected.r][selected.c] = nextDominoId;
                                    board[row][col] = nextDominoId;
                                    nextDominoId++;
                                    dominoCount++;
                                }
                                selected = null;
                                draw();
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;

                            viz.screenText('Mutilated Chessboard: Place Dominoes', w / 2, 18, viz.colors.white, 14);

                            var whiteCount = 0, blackCount = 0;

                            for (var r = 0; r < N; r++) {
                                for (var c = 0; c < N; c++) {
                                    var x = boardX + c * cellSize;
                                    var y = boardY + r * cellSize;
                                    var isBlack = (r + c) % 2 === 1;

                                    if (board[r][c] === -1) {
                                        // Removed square
                                        ctx.fillStyle = '#1a1a2e';
                                        ctx.fillRect(x, y, cellSize, cellSize);
                                        ctx.strokeStyle = viz.colors.red + '66';
                                        ctx.lineWidth = 2;
                                        ctx.beginPath();
                                        ctx.moveTo(x + 4, y + 4);
                                        ctx.lineTo(x + cellSize - 4, y + cellSize - 4);
                                        ctx.moveTo(x + cellSize - 4, y + 4);
                                        ctx.lineTo(x + 4, y + cellSize - 4);
                                        ctx.stroke();
                                    } else if (board[r][c] > 0) {
                                        // Covered by domino
                                        var dColor = dominoColors[(board[r][c] - 1) % dominoColors.length];
                                        ctx.fillStyle = dColor + '88';
                                        ctx.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                        ctx.strokeStyle = dColor;
                                        ctx.lineWidth = 2;
                                        ctx.strokeRect(x + 1, y + 1, cellSize - 2, cellSize - 2);
                                    } else {
                                        // Empty square
                                        if (showColorArg) {
                                            ctx.fillStyle = isBlack ? '#2d1b4e' : '#f0f6fc22';
                                        } else {
                                            ctx.fillStyle = isBlack ? '#2a2a4a' : '#3a3a5a';
                                        }
                                        ctx.fillRect(x, y, cellSize, cellSize);
                                        ctx.strokeStyle = viz.colors.grid;
                                        ctx.lineWidth = 0.5;
                                        ctx.strokeRect(x, y, cellSize, cellSize);
                                    }

                                    // Count remaining empty squares by color
                                    if (board[r][c] === 0) {
                                        if (isBlack) blackCount++;
                                        else whiteCount++;
                                    }

                                    // Highlight selected square
                                    if (selected && selected.r === r && selected.c === c) {
                                        ctx.strokeStyle = viz.colors.yellow;
                                        ctx.lineWidth = 3;
                                        ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
                                    }
                                }
                            }

                            // Info
                            var infoY = boardY + N * cellSize + 16;
                            var emptySquares = 62 - dominoCount * 2;
                            viz.screenText(
                                'Dominoes placed: ' + dominoCount + '/31   Empty squares: ' + emptySquares,
                                w / 2, infoY, viz.colors.text, 12
                            );

                            if (showColorArg) {
                                viz.screenText(
                                    'White squares left: ' + whiteCount + '   Dark squares left: ' + blackCount,
                                    w / 2, infoY + 20, viz.colors.orange, 12
                                );
                                viz.screenText(
                                    'Each domino covers 1 white + 1 dark. But we have ' + whiteCount + ' white and ' + blackCount + ' dark!',
                                    w / 2, infoY + 38, viz.colors.red, 11
                                );
                            } else {
                                viz.screenText(
                                    'Click two adjacent empty squares to place a domino. Click a domino to remove it.',
                                    w / 2, infoY + 20, viz.colors.text, 10
                                );
                            }

                            if (emptySquares === 0) {
                                viz.screenText('Impossible! (But try, you will see why.)', w / 2, infoY + 40, viz.colors.green, 13);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Suppose you remove one white square and one black square from opposite corners of a chessboard (instead of two same-colored corners). Can the remaining 62 squares be tiled with dominoes? Why or why not?',
                    hint: 'Now the board has 31 white and 31 black squares. Does the coloring argument still block the tiling?',
                    solution: 'Now there are 31 white and 31 black squares, so the coloring argument does not apply. In fact, such a board CAN always be tiled. The proof uses a Hamiltonian path on the grid graph, but the key point is: the coloring obstruction is gone, so tiling becomes possible.'
                },
                {
                    question: 'An L-shaped "tromino" covers three squares of a chessboard. Prove that you cannot tile a 4x4 board (16 squares) perfectly with L-trominoes.',
                    hint: 'How many squares does each tromino cover? Does 3 divide 16?',
                    solution: 'Each tromino covers exactly 3 squares. But \\(16\\) is not divisible by \\(3\\) (\\(16 = 3 \\times 5 + 1\\)), so we cannot partition 16 squares into groups of 3. Tiling is impossible by a simple divisibility argument.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Problem-Solving Strategies
        // ================================================================
        {
            id: 'sec-strategies',
            title: 'Problem-Solving Strategies',
            content: `
<h2>Problem-Solving Strategies</h2>

<p>Mathematicians have a toolbox of strategies for attacking problems. Here are four of the most powerful ones. You do not need to use all of them on every problem; part of mathematical thinking is learning which tool fits the job.</p>

<h3>Strategy 1: Draw a Picture</h3>

<p>Visual representations can reveal structure that is invisible in words or symbols. Even abstract problems often become clearer when you draw them.</p>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>How many diagonals does a hexagon have? Instead of trying to count abstractly, draw a hexagon and draw all the diagonals. You can see there are 9. For a general \\(n\\)-gon, the formula is \\(\\frac{n(n-3)}{2}\\).</p>
    </div>
</div>

<h3>Strategy 2: Try Small Cases</h3>

<p>We already used this with the handshake problem. When the problem involves a large number, try the same problem with small numbers first. Build a table. Look for a pattern.</p>

<h3>Strategy 3: Work Backwards</h3>

<p>Sometimes the end state is simpler than the start state. If you know where you need to end up, try working backwards from the goal to the starting conditions.</p>

<div class="env-block example">
    <div class="env-title">Example: The River Crossing</div>
    <div class="env-body">
        <p>A farmer needs to cross a river with a wolf, a goat, and a cabbage. The boat holds the farmer plus one item. If left alone, the wolf eats the goat, and the goat eats the cabbage. How can the farmer get everything across?</p>
        <p>Working backwards from "everything on the other side," the last trip must bring one item. But what was the second-to-last configuration? This backward reasoning helps you find the solution.</p>
    </div>
</div>

<h3>Strategy 4: Find an Invariant</h3>

<p>An <strong>invariant</strong> is something that does not change no matter what moves you make. We already saw one: the coloring of the chessboard. If you can show that an invariant prevents the desired outcome, the problem is solved.</p>

<div class="env-block example">
    <div class="env-title">Example: The 15 Puzzle</div>
    <div class="env-body">
        <p>The classic 15 puzzle has tiles numbered 1 through 15 in a 4x4 grid, with one blank space. It turns out that exactly half of all starting arrangements are unsolvable. The invariant is the <em>parity</em> of the permutation: each move changes the parity, and the goal state has even parity, so odd-parity starts are impossible to solve.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-strategy-gallery"></div>
`,
            visualizations: [
                {
                    id: 'viz-strategy-gallery',
                    title: 'Strategy Gallery',
                    description: 'See the four key problem-solving strategies illustrated with interactive examples.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var currentStrategy = 0;
                        var strategies = [
                            'Draw a Picture',
                            'Try Small Cases',
                            'Work Backwards',
                            'Find an Invariant'
                        ];

                        var nGon = 6;

                        VizEngine.createButton(controls, 'Next Strategy', function() {
                            currentStrategy = (currentStrategy + 1) % 4;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'n-gon sides', 3, 12, nGon, 1, function(v) {
                            nGon = Math.round(v);
                            if (currentStrategy === 0) draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;

                            var strat = strategies[currentStrategy];
                            viz.screenText('Strategy ' + (currentStrategy + 1) + ': ' + strat, w / 2, 20, viz.colors.white, 15);

                            if (currentStrategy === 0) {
                                drawPicture(ctx, w, h);
                            } else if (currentStrategy === 1) {
                                drawSmallCases(ctx, w, h);
                            } else if (currentStrategy === 2) {
                                drawWorkBackwards(ctx, w, h);
                            } else {
                                drawInvariant(ctx, w, h);
                            }
                        }

                        function drawPicture(ctx, w, h) {
                            // Draw n-gon with diagonals
                            var cx = w / 2, cy = h / 2 + 10;
                            var radius = 130;
                            var points = [];
                            for (var i = 0; i < nGon; i++) {
                                var angle = (Math.PI * 2 / nGon) * i - Math.PI / 2;
                                points.push({
                                    x: cx + radius * Math.cos(angle),
                                    y: cy + radius * Math.sin(angle)
                                });
                            }

                            // Draw diagonals
                            var diagCount = 0;
                            for (var a = 0; a < nGon; a++) {
                                for (var b = a + 2; b < nGon; b++) {
                                    if (a === 0 && b === nGon - 1) continue; // skip edge
                                    ctx.strokeStyle = viz.colors.teal + '55';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.moveTo(points[a].x, points[a].y);
                                    ctx.lineTo(points[b].x, points[b].y);
                                    ctx.stroke();
                                    diagCount++;
                                }
                            }

                            // Draw edges
                            for (var e = 0; e < nGon; e++) {
                                var next = (e + 1) % nGon;
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2.5;
                                ctx.beginPath();
                                ctx.moveTo(points[e].x, points[e].y);
                                ctx.lineTo(points[next].x, points[next].y);
                                ctx.stroke();
                            }

                            // Draw vertices
                            for (var v2 = 0; v2 < nGon; v2++) {
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath();
                                ctx.arc(points[v2].x, points[v2].y, 6, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            viz.screenText(nGon + '-gon has ' + diagCount + ' diagonals', w / 2, h - 40, viz.colors.teal, 13);
                            viz.screenText('Formula: n(n-3)/2 = ' + nGon + '(' + (nGon - 3) + ')/2 = ' + (nGon * (nGon - 3) / 2), w / 2, h - 20, viz.colors.text, 11);
                        }

                        function drawSmallCases(ctx, w, h) {
                            // Show table: handshake counts for n = 2..8
                            viz.screenText('Handshakes for N people: build a table!', w / 2, 50, viz.colors.teal, 13);

                            var tableX = 80;
                            var tableY = 80;
                            var colW = 60;
                            var rowH = 32;

                            // Header
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('N', tableX + colW / 2, tableY + rowH / 2);
                            ctx.fillText('Handshakes', tableX + colW + colW / 2, tableY + rowH / 2);
                            ctx.fillText('Pattern', tableX + 2 * colW + colW, tableY + rowH / 2);

                            for (var n = 2; n <= 8; n++) {
                                var y = tableY + (n - 1) * rowH;
                                var handshakes = n * (n - 1) / 2;
                                var added = n - 1;

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText(n.toString(), tableX + colW / 2, y + rowH / 2);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText(handshakes.toString(), tableX + colW + colW / 2, y + rowH / 2);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.textAlign = 'left';
                                ctx.fillText(
                                    n > 2 ? '(prev) + ' + added + ' = ' + handshakes : 'Start: 1',
                                    tableX + 2 * colW + 10, y + rowH / 2
                                );
                                ctx.textAlign = 'center';

                                // Row line
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(tableX, y + rowH);
                                ctx.lineTo(tableX + 3 * colW + 60, y + rowH);
                                ctx.stroke();
                            }

                            viz.screenText('Each new person shakes hands with everyone already there!', w / 2, h - 30, viz.colors.text, 11);
                        }

                        function drawWorkBackwards(ctx, w, h) {
                            // River crossing illustration
                            var states = [
                                { left: ['F','W','G','C'], right: [], boat: 'left', label: 'Start' },
                                { left: ['W','C'], right: ['F','G'], boat: 'right', label: '1. Take Goat over' },
                                { left: ['F','W','C'], right: ['G'], boat: 'left', label: '2. Come back alone' },
                                { left: ['C'], right: ['F','W','G'], boat: 'right', label: '3. Take Wolf over' },
                                { left: ['F','G','C'], right: ['W'], boat: 'left', label: '4. Bring Goat back' },
                                { left: ['G'], right: ['F','W','C'], boat: 'right', label: '5. Take Cabbage over' },
                                { left: ['F','G'], right: ['W','C'], boat: 'left', label: '6. Come back alone' },
                                { left: [], right: ['F','W','G','C'], boat: 'right', label: '7. Take Goat over' }
                            ];

                            var stateH = 35;
                            var startY2 = 50;
                            var leftX = 60;
                            var midX = w / 2;
                            var rightX = w - 60;

                            // Column headers
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Left Bank', leftX + 40, startY2);
                            ctx.fillText('Step', midX, startY2);
                            ctx.fillText('Right Bank', rightX - 40, startY2);

                            var icons = { F: '👨‍🌾', W: '🐺', G: '🐐', C: '🥬' };

                            for (var s = 0; s < states.length; s++) {
                                var yy = startY2 + 18 + s * stateH;
                                var st = states[s];

                                // Left side
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(
                                    st.left.map(function(x) { return icons[x]; }).join(' '),
                                    leftX + 40, yy + 10
                                );

                                // Step label
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(st.label, midX, yy + 10);

                                // Right side
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.fillText(
                                    st.right.map(function(x) { return icons[x]; }).join(' '),
                                    rightX - 40, yy + 10
                                );

                                // Arrow
                                if (s < states.length - 1) {
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.beginPath();
                                    ctx.moveTo(midX - 80, yy + stateH - 5);
                                    ctx.lineTo(midX + 80, yy + stateH - 5);
                                    ctx.stroke();
                                }

                                ctx.fillStyle = viz.colors.text;
                            }

                            viz.screenText('The classic river crossing, solved step by step', w / 2, h - 15, viz.colors.text, 10);
                        }

                        function drawInvariant(ctx, w, h) {
                            // Checkerboard coloring invariant
                            var cellSz = 40;
                            var brdX = (w - 8 * cellSz) / 2;
                            var brdY = 50;

                            for (var r = 0; r < 8; r++) {
                                for (var c = 0; c < 8; c++) {
                                    var isBlk = (r + c) % 2 === 1;
                                    var x = brdX + c * cellSz;
                                    var y = brdY + r * cellSz;

                                    ctx.fillStyle = isBlk ? '#4a2080' : '#e8e0f0';
                                    ctx.fillRect(x, y, cellSz, cellSz);

                                    if ((r === 0 && c === 0) || (r === 7 && c === 7)) {
                                        ctx.fillStyle = viz.colors.red + 'aa';
                                        ctx.fillRect(x, y, cellSz, cellSz);
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.font = 'bold 16px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText('X', x + cellSz / 2, y + cellSz / 2);
                                    }
                                }
                            }

                            viz.screenText('Invariant: each domino covers 1 light + 1 dark square', w / 2, brdY + 8 * cellSz + 18, viz.colors.orange, 12);
                            viz.screenText('Removed corners are both dark: 30 dark vs 32 light. No perfect tiling!', w / 2, brdY + 8 * cellSz + 38, viz.colors.red, 11);
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'A frog is at the bottom of a 10-meter well. Each day it climbs 3 meters, but each night it slides back 2 meters. On which day does the frog escape the well?',
                    hint: 'Work backwards: on the last day, the frog reaches the top and climbs out. It does not slide back that night. So the frog only needs to start the last day at 7 meters or higher.',
                    solution: 'Each full day-night cycle gives a net gain of 1 meter. After 7 full cycles, the frog is at 7 meters. On day 8, it climbs 3 meters to reach 10 meters and escapes. Answer: day 8.'
                },
                {
                    question: 'You have a 3-liter jug and a 5-liter jug. How can you measure exactly 4 liters of water?',
                    hint: 'Try working backwards: to get 4 liters in the 5-liter jug, you need to remove exactly 1 liter from a full 5-liter jug. How can you get exactly 1 liter in the 3-liter jug?',
                    solution: 'Fill the 3L jug and pour into the 5L jug (5L has 3). Fill 3L again and pour into 5L until full (5L has 5, 3L has 1). Empty the 5L jug. Pour the 1L from the 3L jug into the 5L jug. Fill the 3L jug and pour into the 5L jug. Now the 5L jug has exactly 4 liters.'
                }
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to the Rest of the Book
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'What Comes Next',
            content: `
<h2>What Comes Next</h2>

<p>You have now seen the core cycle of mathematical thinking in action:</p>

<ol>
    <li><strong>Experiment</strong> (handshakes, Gauss's sum, small cases)</li>
    <li><strong>Conjecture</strong> (spot patterns, state them precisely)</li>
    <li><strong>Prove</strong> (convince a skeptic with an airtight argument)</li>
</ol>

<p>And you have four powerful strategies in your toolbox:</p>

<ul>
    <li>Draw a picture</li>
    <li>Try small cases</li>
    <li>Work backwards</li>
    <li>Find an invariant</li>
</ul>

<p>The rest of this book explores these ideas in depth. Here is a preview of where we are headed:</p>

<div class="env-block remark">
    <div class="env-title">Coming Attractions</div>
    <div class="env-body">
        <ul>
            <li><strong>Logic & Reasoning</strong>: How to build bulletproof arguments and spot fallacies.</li>
            <li><strong>Counting & Combinatorics</strong>: Systematic methods for counting complex arrangements.</li>
            <li><strong>Sequences & Patterns</strong>: Arithmetic, geometric, and recursive patterns.</li>
            <li><strong>Games & Strategy</strong>: Winning strategies for mathematical games (Nim, combinatorial games).</li>
            <li><strong>Graph Theory</strong>: Networks, paths, and the mathematics of connections.</li>
            <li><strong>Proof by Induction</strong>: The domino-toppling technique for proving infinitely many statements at once.</li>
        </ul>
    </div>
</div>

<p>Each chapter builds on the thinking skills you practiced here. You will encounter harder problems, but the approach is always the same: experiment, conjecture, prove. Let us begin.</p>

<div class="viz-placeholder" data-viz="viz-river-crossing"></div>
`,
            visualizations: [
                {
                    id: 'viz-river-crossing',
                    title: 'River Crossing Puzzle',
                    description: 'Solve the classic farmer-wolf-goat-cabbage puzzle interactively! Move items across the river without leaving incompatible pairs alone.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var items = ['Farmer', 'Wolf', 'Goat', 'Cabbage'];
                        var icons = ['F', 'W', 'G', 'C'];
                        var itemColors = [viz.colors.white, viz.colors.red, viz.colors.green, viz.colors.orange];
                        // true = right bank, false = left bank
                        var positions = [false, false, false, false];
                        var boatSide = false; // false = left
                        var boatPassenger = -1; // -1 = nobody, 0-3 = item index
                        var moves = 0;
                        var gameOver = false;
                        var gameWon = false;
                        var message = 'Click an item to put it in the boat, then click "Cross River"';

                        function reset() {
                            positions = [false, false, false, false];
                            boatSide = false;
                            boatPassenger = -1;
                            moves = 0;
                            gameOver = false;
                            gameWon = false;
                            message = 'Click an item to put it in the boat, then click "Cross River"';
                            draw();
                        }

                        VizEngine.createButton(controls, 'Cross River', function() {
                            if (gameOver) return;
                            // Farmer must be on the boat side
                            if (positions[0] !== boatSide) {
                                message = 'The farmer must be on the same side as the boat!';
                                draw();
                                return;
                            }
                            // Move farmer and passenger
                            positions[0] = !boatSide;
                            if (boatPassenger > 0) {
                                positions[boatPassenger] = !boatSide;
                            }
                            boatSide = !boatSide;
                            boatPassenger = -1;
                            moves++;

                            // Check for conflicts on both sides
                            if (checkConflict()) {
                                gameOver = true;
                                message = 'Oh no! Something got eaten! Game over after ' + moves + ' moves.';
                            } else if (positions.every(function(p) { return p; })) {
                                gameOver = true;
                                gameWon = true;
                                message = 'You did it in ' + moves + ' moves! (Optimal is 7)';
                            } else {
                                message = 'Move ' + moves + ' complete. Click an item to load the boat.';
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', reset);

                        function checkConflict() {
                            // Wolf eats goat if farmer absent
                            var farmerSide = positions[0];
                            // Check left bank
                            var leftItems = [];
                            var rightItems = [];
                            for (var i = 1; i < 4; i++) {
                                if (positions[i]) rightItems.push(i);
                                else leftItems.push(i);
                            }

                            function hasBadPair(arr) {
                                var has = {};
                                arr.forEach(function(x) { has[x] = true; });
                                // Wolf(1) + Goat(2) = bad, Goat(2) + Cabbage(3) = bad
                                if (has[1] && has[2]) return true;
                                if (has[2] && has[3]) return true;
                                return false;
                            }

                            // Conflict on the side where farmer is NOT
                            if (!farmerSide && hasBadPair(rightItems)) return true;
                            if (farmerSide && hasBadPair(leftItems)) return true;
                            return false;
                        }

                        // Handle clicks
                        viz.canvas.addEventListener('click', function(e) {
                            if (gameOver) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            // Check if clicking on an item
                            var bankY = 120;
                            var leftX = 60;
                            var rightX = 400;
                            var itemSpacing = 50;

                            for (var i = 0; i < 4; i++) {
                                var ix, iy;
                                if (positions[i] === boatSide) {
                                    // On the boat's side, can be loaded
                                    ix = (positions[i] ? rightX : leftX) + (i % 2) * itemSpacing;
                                    iy = bankY + Math.floor(i / 2) * itemSpacing;

                                    if (Math.abs(mx - ix) < 25 && Math.abs(my - iy) < 25) {
                                        if (i === 0) {
                                            // Farmer always goes with the boat
                                            message = 'The farmer always goes with the boat.';
                                        } else if (boatPassenger === i) {
                                            boatPassenger = -1;
                                            message = 'Unloaded ' + items[i] + ' from the boat.';
                                        } else {
                                            boatPassenger = i;
                                            message = items[i] + ' loaded onto the boat.';
                                        }
                                        draw();
                                        return;
                                    }
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;

                            viz.screenText('River Crossing Puzzle', w / 2, 18, viz.colors.white, 15);

                            // River
                            var riverX = 200;
                            var riverW = 160;
                            ctx.fillStyle = '#1a3a5a';
                            ctx.fillRect(riverX, 45, riverW, h - 90);

                            // River label
                            ctx.save();
                            ctx.translate(riverX + riverW / 2, h / 2);
                            ctx.fillStyle = '#3a6a9a';
                            ctx.font = '14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('~ ~ RIVER ~ ~', 0, 0);
                            ctx.restore();

                            // Boat
                            var boatX = boatSide ? riverX + riverW - 40 : riverX + 10;
                            var boatY = h / 2 + 30;
                            ctx.fillStyle = '#8B4513';
                            ctx.beginPath();
                            ctx.moveTo(boatX, boatY);
                            ctx.lineTo(boatX + 50, boatY);
                            ctx.lineTo(boatX + 45, boatY + 20);
                            ctx.lineTo(boatX + 5, boatY + 20);
                            ctx.closePath();
                            ctx.fill();

                            // Items on banks
                            var bankY2 = 90;
                            var leftX2 = 50;
                            var rightX2 = 410;

                            // Bank labels
                            viz.screenText('Left Bank', 100, 55, viz.colors.text, 11);
                            viz.screenText('Right Bank', 460, 55, viz.colors.text, 11);

                            for (var i = 0; i < 4; i++) {
                                var baseX = positions[i] ? rightX2 : leftX2;
                                var ix2 = baseX + (i % 2) * 60;
                                var iy2 = bankY2 + Math.floor(i / 2) * 60;

                                // Highlight if on boat
                                var onBoat = (i === boatPassenger || i === 0) && positions[i] === boatSide;

                                if (i === boatPassenger && boatPassenger > 0) {
                                    ctx.strokeStyle = viz.colors.yellow;
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(ix2 - 22, iy2 - 22, 44, 44);
                                }

                                // Draw item circle
                                ctx.fillStyle = itemColors[i] + (onBoat ? '' : '88');
                                ctx.beginPath();
                                ctx.arc(ix2, iy2, 18, 0, Math.PI * 2);
                                ctx.fill();

                                // Label
                                ctx.fillStyle = i === 0 ? '#000' : viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(icons[i], ix2, iy2);

                                // Name below
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.fillText(items[i], ix2, iy2 + 28);
                            }

                            // Rules
                            var rulesY = h - 80;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Wolf + Goat alone = Goat eaten  |  Goat + Cabbage alone = Cabbage eaten', w / 2, rulesY);

                            // Message
                            var msgColor = gameWon ? viz.colors.green : (gameOver ? viz.colors.red : viz.colors.teal);
                            viz.screenText(message, w / 2, h - 50, msgColor, 12);
                            viz.screenText('Moves: ' + moves, w / 2, h - 30, viz.colors.text, 11);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Three people want to cross a river. The boat holds at most 2 people. At least one person must row the boat back. What is the minimum number of one-way crossings needed to get all 3 across?',
                    hint: 'Two people go over, one comes back, then two go over again. But wait, does that work?',
                    solution: 'Step 1: Two people cross (1 crossing). Step 2: One person rows back (2 crossings). Step 3: Two people cross (3 crossings). But person who came back is still on the wrong side. Actually: after step 2, two people are on the starting side. Step 3: both cross. Total: 3 one-way crossings. The minimum is 3.'
                },
            ]
        }
    ]
});
})();
