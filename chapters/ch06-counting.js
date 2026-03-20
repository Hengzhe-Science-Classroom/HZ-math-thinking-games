// === Chapter 6: Clever Counting ===
(function () {
    window.CHAPTERS = window.CHAPTERS || [];

    // --- helpers ---
    function factorial(n) {
        if (n <= 1) return 1;
        var r = 1;
        for (var i = 2; i <= n; i++) r *= i;
        return r;
    }
    function C(n, k) {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;
        if (k > n - k) k = n - k;
        var r = 1;
        for (var i = 0; i < k; i++) r = r * (n - i) / (i + 1);
        return Math.round(r);
    }

    window.CHAPTERS.push({
        id: 'ch06',
        number: 6,
        title: 'Clever Counting',
        subtitle: 'Counting without listing everything',
        file: 'ch06-counting',

        sections: [
            // ============================================================
            // Section 1: Motivation
            // ============================================================
            {
                id: 'sec-motivation',
                title: 'Why Count Cleverly?',
                content: `
<h2>Why Count Cleverly?</h2>

<p>Suppose you own 4 shirts, 3 pairs of pants, and 2 pairs of shoes. How many different outfits can you make? You <em>could</em> list every combination on paper, but the list would be long, and it is easy to miss one or double-count another. Instead, mathematicians have discovered simple rules that give the answer instantly, with no listing required.</p>

<p>These rules are the foundation of <strong>combinatorics</strong>, the branch of mathematics concerned with counting. They appear everywhere: passwords, license plates, tournament brackets, pizza toppings, even the number of handshakes at a party.</p>

<div class="env-block intuition">
<strong>The counting mindset.</strong> Every counting problem can be broken into smaller decisions. The key is learning when to <em>multiply</em> those decisions and when to <em>add</em> them. Get this right and you can handle surprisingly large numbers without writing a single list.
</div>

<p>In this chapter we will learn:</p>
<ul>
<li>The <strong>Multiplication Principle</strong>: when you make a sequence of independent choices</li>
<li>The <strong>Addition Principle</strong>: when you choose from separate categories</li>
<li>How to avoid <strong>overcounting</strong>: the handshake and diagonal formulas</li>
<li><strong>Pascal's Triangle</strong>: a magical number triangle hiding dozens of patterns</li>
</ul>

<p>Let us start with the outfit problem.</p>
`,
                visualizations: [],
                exercises: []
            },

            // ============================================================
            // Section 2: The Multiplication Principle
            // ============================================================
            {
                id: 'sec-multiply',
                title: 'The Multiplication Principle',
                content: `
<h2>The Multiplication Principle</h2>

<p>Here is the single most important idea in counting:</p>

<div class="env-block definition">
<strong>The Multiplication Principle.</strong> If you make a sequence of independent choices, where the first has \\(a\\) options, the second has \\(b\\) options, the third has \\(c\\) options, and so on, then the total number of combined outcomes is
\\[a \\times b \\times c \\times \\cdots\\]
</div>

<p>The word <em>independent</em> is key: the number of options at each step does not depend on what you chose earlier.</p>

<div class="env-block example">
<strong>Outfits.</strong> You have 4 shirts, 3 pants, and 2 pairs of shoes. Each outfit is a sequence of three choices (shirt, pants, shoes), and the choices do not affect one another. So the total is \\(4 \\times 3 \\times 2 = 24\\) outfits.
</div>

<p>The visualization below lets you see every outfit as a path through a <strong>tree diagram</strong>. Each path from root to leaf is one outfit. The multiplication principle simply counts the leaves.</p>

<div class="viz-placeholder" data-viz="viz-outfit-combiner"></div>

<h3>Why multiplication?</h3>

<p>Think of it this way. For <em>each</em> of the 4 shirts, there are 3 ways to choose pants. That gives \\(4 \\times 3 = 12\\) shirt-pants pairs. For <em>each</em> of those 12 pairs, there are 2 shoe choices. That gives \\(12 \\times 2 = 24\\). The phrase "for each" is the hallmark of multiplication.</p>

<div class="env-block example">
<strong>License plates.</strong> A license plate has 3 letters followed by 4 digits. How many possible plates are there?
<br><br>
Each letter has 26 choices, each digit has 10. By the multiplication principle:
\\[26 \\times 26 \\times 26 \\times 10 \\times 10 \\times 10 \\times 10 = 26^3 \\times 10^4 = 175{,}760{,}000.\\]
That is over 175 million plates!
</div>

<p>Try the license plate calculator below to see how changing the format affects the count.</p>

<div class="viz-placeholder" data-viz="viz-license-plates"></div>
`,
                visualizations: [
                    // --- viz-outfit-combiner ---
                    {
                        id: 'viz-outfit-combiner',
                        title: 'Outfit Combiner Tree',
                        description: 'Shirts \u00D7 Pants \u00D7 Shoes: see every outfit as a path through a tree diagram. Adjust the counts and watch the tree grow.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;

                            var nShirts = 3, nPants = 2, nShoes = 2;
                            var shirtColors = ['#f85149', '#58a6ff', '#3fb950', '#f0883e', '#bc8cff'];
                            var pantsLabels = ['Jeans', 'Khakis', 'Shorts', 'Sweats'];
                            var shoeLabels = ['Sneakers', 'Boots', 'Sandals'];

                            VizEngine.createSlider(controls, 'Shirts', 1, 5, nShirts, 1, function (v) { nShirts = Math.round(v); draw(); });
                            VizEngine.createSlider(controls, 'Pants', 1, 4, nPants, 1, function (v) { nPants = Math.round(v); draw(); });
                            VizEngine.createSlider(controls, 'Shoes', 1, 3, nShoes, 1, function (v) { nShoes = Math.round(v); draw(); });

                            function draw() {
                                viz.clear();
                                var total = nShirts * nPants * nShoes;

                                viz.screenText('Outfit Tree: ' + nShirts + ' \u00D7 ' + nPants + ' \u00D7 ' + nShoes + ' = ' + total + ' outfits',
                                    w / 2, 18, viz.colors.white, 14);

                                // Layout positions
                                var rootX = 40, midX = 160, mid2X = 320, leafX = 460;
                                var rootY = h / 2;

                                // Draw root
                                ctx.fillStyle = viz.colors.white;
                                ctx.beginPath(); ctx.arc(rootX, rootY, 5, 0, Math.PI * 2); ctx.fill();
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('Start', rootX, rootY - 12);

                                // Stage labels
                                viz.screenText('Shirts', midX, 34, viz.colors.blue, 11);
                                viz.screenText('Pants', mid2X, 34, viz.colors.teal, 11);
                                viz.screenText('Shoes', leafX, 34, viz.colors.orange, 11);

                                // Layout: distribute shirt nodes evenly
                                var usableH = h - 70;
                                var shirtSpacing = usableH / Math.max(nShirts, 1);
                                var shirtTop = 50 + shirtSpacing / 2;

                                // Limit detail when tree is too big
                                var showLeaves = total <= 60;

                                for (var si = 0; si < nShirts; si++) {
                                    var sy = shirtTop + si * shirtSpacing;
                                    // Root -> shirt
                                    ctx.strokeStyle = shirtColors[si % shirtColors.length] + '66';
                                    ctx.lineWidth = 1.5;
                                    ctx.beginPath(); ctx.moveTo(rootX + 5, rootY); ctx.lineTo(midX - 5, sy); ctx.stroke();

                                    ctx.fillStyle = shirtColors[si % shirtColors.length];
                                    ctx.beginPath(); ctx.arc(midX, sy, 5, 0, Math.PI * 2); ctx.fill();
                                    ctx.font = '9px -apple-system,sans-serif'; ctx.textAlign = 'left';
                                    ctx.fillText('S' + (si + 1), midX + 8, sy + 3);

                                    // Pants nodes for this shirt
                                    var pantsSpace = shirtSpacing / Math.max(nPants, 1);
                                    var pantsTop = sy - (nPants - 1) * pantsSpace / 2;

                                    for (var pi = 0; pi < nPants; pi++) {
                                        var py = pantsTop + pi * pantsSpace;
                                        ctx.strokeStyle = viz.colors.teal + '44';
                                        ctx.lineWidth = 1;
                                        ctx.beginPath(); ctx.moveTo(midX + 5, sy); ctx.lineTo(mid2X - 4, py); ctx.stroke();

                                        ctx.fillStyle = viz.colors.teal;
                                        ctx.beginPath(); ctx.arc(mid2X, py, 3, 0, Math.PI * 2); ctx.fill();

                                        if (showLeaves) {
                                            // Shoe leaves for this shirt-pants pair
                                            var shoeSpace = pantsSpace / Math.max(nShoes + 1, 2);
                                            var shoeTop = py - (nShoes - 1) * shoeSpace / 2;

                                            for (var hi = 0; hi < nShoes; hi++) {
                                                var hy = shoeTop + hi * shoeSpace;
                                                ctx.strokeStyle = viz.colors.orange + '33';
                                                ctx.lineWidth = 0.8;
                                                ctx.beginPath(); ctx.moveTo(mid2X + 3, py); ctx.lineTo(leafX - 3, hy); ctx.stroke();

                                                ctx.fillStyle = viz.colors.orange;
                                                ctx.beginPath(); ctx.arc(leafX, hy, 2.5, 0, Math.PI * 2); ctx.fill();
                                            }
                                        }
                                    }
                                }

                                if (!showLeaves) {
                                    viz.screenText('(' + total + ' leaves, showing structure only)', w / 2, h - 14, viz.colors.text, 10);
                                }
                            }
                            draw();
                            return viz;
                        }
                    },
                    // --- viz-license-plates ---
                    {
                        id: 'viz-license-plates',
                        title: 'License Plate Counter',
                        description: 'Set the number of letter slots and digit slots to see how many plates are possible. The multiplication principle makes the count huge even for modest formats.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;

                            var nLetters = 3, nDigits = 4;

                            VizEngine.createSlider(controls, 'Letters', 0, 5, nLetters, 1, function (v) { nLetters = Math.round(v); draw(); });
                            VizEngine.createSlider(controls, 'Digits', 0, 6, nDigits, 1, function (v) { nDigits = Math.round(v); draw(); });

                            function draw() {
                                viz.clear();
                                var totalSlots = nLetters + nDigits;
                                var plateTotal = Math.pow(26, nLetters) * Math.pow(10, nDigits);

                                viz.screenText('License Plate Format', w / 2, 24, viz.colors.white, 15);

                                // Draw plate
                                var plateW = Math.min(400, totalSlots * 52 + 40);
                                var plateH = 60;
                                var plateX = (w - plateW) / 2;
                                var plateY = 60;

                                ctx.fillStyle = '#ddd';
                                ctx.beginPath();
                                if (ctx.roundRect) ctx.roundRect(plateX, plateY, plateW, plateH, 8);
                                else ctx.rect(plateX, plateY, plateW, plateH);
                                ctx.fill();
                                ctx.strokeStyle = '#666'; ctx.lineWidth = 2; ctx.stroke();

                                var slotW = 40, slotH = 40, gap = 8;
                                var slotsW = totalSlots * (slotW + gap) - gap;
                                var slotStartX = (w - slotsW) / 2;
                                var slotY = plateY + (plateH - slotH) / 2;

                                for (var i = 0; i < totalSlots; i++) {
                                    var sx = slotStartX + i * (slotW + gap);
                                    var isLetter = i < nLetters;
                                    ctx.fillStyle = isLetter ? '#58a6ff33' : '#3fb95033';
                                    ctx.fillRect(sx, slotY, slotW, slotH);
                                    ctx.strokeStyle = isLetter ? viz.colors.blue : viz.colors.green;
                                    ctx.lineWidth = 1.5;
                                    ctx.strokeRect(sx, slotY, slotW, slotH);

                                    ctx.fillStyle = isLetter ? viz.colors.blue : viz.colors.green;
                                    ctx.font = 'bold 16px monospace';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(isLetter ? 'A-Z' : '0-9', sx + slotW / 2, slotY + slotH / 2);

                                    // choices below
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.textBaseline = 'top';
                                    ctx.fillText(isLetter ? '26' : '10', sx + slotW / 2, slotY + slotH + 4);
                                }

                                // Formula
                                var formulaParts = [];
                                if (nLetters > 0) formulaParts.push('26' + (nLetters > 1 ? '\u00B3'.replace('\u00B3', superscript(nLetters)) : ''));
                                if (nDigits > 0) formulaParts.push('10' + (nDigits > 1 ? superscript(nDigits) : ''));
                                var formulaStr = formulaParts.join(' \u00D7 ') || '1';

                                viz.screenText(formulaStr + ' = ' + plateTotal.toLocaleString() + ' plates',
                                    w / 2, plateY + plateH + 45, viz.colors.white, 14);

                                // Log comparison
                                var logVal = Math.log10(Math.max(plateTotal, 1));
                                var comparisons = [
                                    { val: 3, label: 'Small town' },
                                    { val: 5, label: 'City' },
                                    { val: 7, label: 'Country' },
                                    { val: 9, label: 'World' }
                                ];
                                var barY = plateY + plateH + 80;
                                var barW = w - 120;
                                var barH = 18;
                                var barX = 60;
                                var barMaxLog = 12;

                                ctx.fillStyle = viz.colors.grid;
                                ctx.fillRect(barX, barY, barW, barH);

                                var fillW = Math.min(barW, (logVal / barMaxLog) * barW);
                                ctx.fillStyle = viz.colors.teal + 'aa';
                                ctx.fillRect(barX, barY, fillW, barH);

                                for (var ci = 0; ci < comparisons.length; ci++) {
                                    var cx = barX + (comparisons[ci].val / barMaxLog) * barW;
                                    ctx.strokeStyle = viz.colors.text + '66';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath(); ctx.moveTo(cx, barY); ctx.lineTo(cx, barY + barH); ctx.stroke();
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText(comparisons[ci].label, cx, barY + barH + 4);
                                }

                                viz.screenText('Scale (log\u2081\u2080): ' + logVal.toFixed(1), w / 2, barY - 12, viz.colors.text, 10);
                            }

                            function superscript(n) {
                                var sups = ['\u2070', '\u00B9', '\u00B2', '\u00B3', '\u2074', '\u2075', '\u2076', '\u2077', '\u2078', '\u2079'];
                                return String(n).split('').map(function (d) { return sups[parseInt(d)]; }).join('');
                            }

                            draw();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'A restaurant menu offers 3 appetizers, 5 mains, and 4 desserts. A "meal" is one item from each category. How many different meals are possible?',
                        hint: 'Each choice is independent of the others.',
                        solution: 'By the multiplication principle: \\(3 \\times 5 \\times 4 = 60\\) different meals.'
                    },
                    {
                        question: 'How many 4-digit PINs are there (each digit is 0 through 9)? How many if no digit may be repeated?',
                        hint: 'With repetition, each digit has 10 choices. Without, each subsequent digit has one fewer.',
                        solution: 'With repetition: \\(10^4 = 10{,}000\\). Without: \\(10 \\times 9 \\times 8 \\times 7 = 5{,}040\\).'
                    },
                    {
                        question: 'A coin is flipped 6 times. How many different outcome sequences are possible?',
                        hint: 'Each flip has 2 outcomes (H or T), and flips are independent.',
                        solution: '\\(2^6 = 64\\) sequences.'
                    }
                ]
            },

            // ============================================================
            // Section 3: The Addition Principle
            // ============================================================
            {
                id: 'sec-add',
                title: 'The Addition Principle',
                content: `
<h2>The Addition Principle</h2>

<p>The multiplication principle applies when you make a sequence of choices (this <strong>and then</strong> that). But sometimes you choose from separate, non-overlapping groups (this <strong>or</strong> that).</p>

<div class="env-block definition">
<strong>The Addition Principle.</strong> If you can accomplish a task by choosing exactly one option from one of several <strong>mutually exclusive</strong> categories, and the categories have \\(a, b, c, \\ldots\\) options respectively, then the total number of ways is
\\[a + b + c + \\cdots\\]
</div>

<p>"Mutually exclusive" means the categories do not overlap. If you pick from category A, you are not simultaneously picking from category B.</p>

<div class="env-block example">
<strong>Choosing a treat.</strong> A bakery has 5 types of cookies, 3 types of muffins, and 4 types of cake. You buy exactly one item. How many choices do you have?
<br><br>
You are choosing from one of three categories (cookie, muffin, or cake). By the addition principle: \\(5 + 3 + 4 = 12\\) choices.
</div>

<h3>Multiply vs. Add: The Key Test</h3>

<p>Ask yourself: am I making <em>several decisions in sequence</em>, or am I <em>picking from one of several groups</em>?</p>
<ul>
<li><strong>Sequence of decisions</strong> \u2192 multiply</li>
<li><strong>One choice from separate groups</strong> \u2192 add</li>
</ul>

<div class="env-block example">
<strong>Mixed example.</strong> A club needs to select either a president from 8 seniors OR a co-president pair from 6 juniors. How many ways?
<br><br>
Option A: pick 1 president from 8 seniors \u2192 8 ways.<br>
Option B: pick 2 co-presidents from 6 juniors \u2192 \\(\\binom{6}{2} = 15\\) ways.<br>
Since we do A <em>or</em> B (not both), the total is \\(8 + 15 = 23\\).
</div>

<h3>Combining Both Principles</h3>

<p>Real problems often mix addition and multiplication. The trick is to break the problem into pieces and identify which principle applies at each step.</p>

<div class="env-block example">
<strong>Passwords.</strong> A password is either 3 lowercase letters or 2 digits followed by 1 letter. How many passwords?
<br><br>
Type A (3 letters): \\(26^3 = 17{,}576\\).<br>
Type B (2 digits + 1 letter): \\(10 \\times 10 \\times 26 = 2{,}600\\).<br>
Total (addition, since types are mutually exclusive): \\(17{,}576 + 2{,}600 = 20{,}176\\).
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'A student can take a bus (4 routes), a train (2 lines), or bike (1 path) to school. How many ways can they get to school?',
                        hint: 'The student picks exactly one mode of transport.',
                        solution: 'By the addition principle: \\(4 + 2 + 1 = 7\\) ways.'
                    },
                    {
                        question: 'A code is either 2 letters or 3 digits. How many possible codes are there?',
                        hint: 'The two types are mutually exclusive. Within each type, use the multiplication principle.',
                        solution: '2-letter codes: \\(26^2 = 676\\). 3-digit codes: \\(10^3 = 1{,}000\\). Total: \\(676 + 1{,}000 = 1{,}676\\).'
                    }
                ]
            },

            // ============================================================
            // Section 4: Avoiding Overcounting
            // ============================================================
            {
                id: 'sec-overcounting',
                title: 'Avoiding Overcounting',
                content: `
<h2>Avoiding Overcounting</h2>

<p>One of the trickiest parts of counting is making sure you do not count the same thing twice. Let us see this with two classic problems: <strong>handshakes</strong> and <strong>diagonals</strong>.</p>

<h3>The Handshake Problem</h3>

<p>At a party of \\(n\\) people, everyone shakes hands with everyone else exactly once. How many handshakes happen?</p>

<p>A naive approach: each of the \\(n\\) people shakes hands with \\(n - 1\\) others, giving \\(n(n-1)\\) handshakes. But this counts each handshake <strong>twice</strong> (once from each person's perspective: Alice shaking Bob's hand is the same event as Bob shaking Alice's). So the true count is:</p>

\\[\\frac{n(n-1)}{2}\\]

<p>Try it in the visualization below. Add people to the circle and watch the handshakes form.</p>

<div class="viz-placeholder" data-viz="viz-handshake-counter"></div>

<h3>The Diagonal Problem</h3>

<p>How many diagonals does a polygon with \\(n\\) sides have?</p>

<p>A diagonal connects two <em>non-adjacent</em> vertices. The total number of line segments connecting any two vertices is \\(\\binom{n}{2} = \\frac{n(n-1)}{2}\\). But \\(n\\) of those are the sides of the polygon, not diagonals. So:</p>

\\[\\text{diagonals} = \\frac{n(n-1)}{2} - n = \\frac{n(n-3)}{2}\\]

<p>Explore this below: draw a polygon and see its diagonals appear.</p>

<div class="viz-placeholder" data-viz="viz-diagonal-counter"></div>

<div class="env-block intuition">
<strong>The overcounting recipe.</strong>
<ol>
<li>Count generously (allowing duplicates).</li>
<li>Figure out how many times each item was counted.</li>
<li>Divide (or subtract) to fix the count.</li>
</ol>
This idea appears again and again in combinatorics. Handshakes: divide by 2. Circular arrangements: divide by \\(n\\). Combinations: divide by \\(k!\\).
</div>
`,
                visualizations: [
                    // --- viz-handshake-counter ---
                    {
                        id: 'viz-handshake-counter',
                        title: 'Handshake Counter',
                        description: 'Place N people around a circle and watch all the handshakes form. Each line is one handshake. The formula n(n-1)/2 gives the count.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var n = 5;
                            var animProgress = 0;
                            var animating = false;
                            var animId = null;

                            VizEngine.createSlider(controls, 'People (n)', 2, 12, n, 1, function (v) {
                                n = Math.round(v);
                                animProgress = 0;
                                animating = false;
                                if (animId) { cancelAnimationFrame(animId); animId = null; }
                                draw(1);
                            });

                            VizEngine.createButton(controls, 'Animate', function () {
                                if (animating) return;
                                animating = true;
                                animProgress = 0;
                                var totalHandshakes = n * (n - 1) / 2;
                                function step() {
                                    animProgress += 0.02;
                                    if (animProgress >= 1) {
                                        animProgress = 1;
                                        animating = false;
                                        draw(1);
                                        return;
                                    }
                                    draw(animProgress);
                                    animId = requestAnimationFrame(step);
                                }
                                animId = requestAnimationFrame(step);
                            });

                            function draw(progress) {
                                viz.clear();
                                var totalHS = n * (n - 1) / 2;
                                var cx = w / 2, cy = h / 2 + 5;
                                var radius = Math.min(w, h) / 2 - 55;

                                // Compute positions
                                var positions = [];
                                for (var i = 0; i < n; i++) {
                                    var angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
                                    positions.push({
                                        x: cx + radius * Math.cos(angle),
                                        y: cy + radius * Math.sin(angle)
                                    });
                                }

                                // Draw handshake lines
                                var hsIdx = 0;
                                var shown = Math.floor(progress * totalHS);
                                for (var a = 0; a < n; a++) {
                                    for (var b = a + 1; b < n; b++) {
                                        if (hsIdx < shown) {
                                            ctx.strokeStyle = viz.colors.teal + '55';
                                            ctx.lineWidth = 1.2;
                                            ctx.beginPath();
                                            ctx.moveTo(positions[a].x, positions[a].y);
                                            ctx.lineTo(positions[b].x, positions[b].y);
                                            ctx.stroke();
                                        } else if (hsIdx === shown && progress < 1) {
                                            // Current handshake animating
                                            ctx.strokeStyle = viz.colors.orange;
                                            ctx.lineWidth = 2.5;
                                            ctx.beginPath();
                                            ctx.moveTo(positions[a].x, positions[a].y);
                                            ctx.lineTo(positions[b].x, positions[b].y);
                                            ctx.stroke();
                                        } else if (progress >= 1) {
                                            ctx.strokeStyle = viz.colors.teal + '55';
                                            ctx.lineWidth = 1.2;
                                            ctx.beginPath();
                                            ctx.moveTo(positions[a].x, positions[a].y);
                                            ctx.lineTo(positions[b].x, positions[b].y);
                                            ctx.stroke();
                                        }
                                        hsIdx++;
                                    }
                                }

                                // Draw people
                                var personColors = [
                                    viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.green,
                                    viz.colors.purple, viz.colors.red, viz.colors.yellow, viz.colors.pink,
                                    viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.green
                                ];
                                for (var pi = 0; pi < n; pi++) {
                                    ctx.fillStyle = personColors[pi % personColors.length];
                                    ctx.beginPath();
                                    ctx.arc(positions[pi].x, positions[pi].y, 12, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = '#fff';
                                    ctx.font = 'bold 10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(String(pi + 1), positions[pi].x, positions[pi].y);
                                }

                                // Info text
                                viz.screenText('n = ' + n, w / 2 - 100, 22, viz.colors.text, 12);
                                viz.screenText('Handshakes = n(n\u22121)/2 = ' + n + '\u00D7' + (n - 1) + '/2 = ' + totalHS,
                                    w / 2 + 30, 22, viz.colors.white, 13);

                                if (progress < 1 && animating) {
                                    viz.screenText('Counting: ' + shown + ' / ' + totalHS, w / 2, h - 16, viz.colors.orange, 12);
                                }
                            }
                            draw(1);
                            return viz;
                        }
                    },
                    // --- viz-diagonal-counter ---
                    {
                        id: 'viz-diagonal-counter',
                        title: 'Polygon Diagonal Counter',
                        description: 'Choose the number of sides and see all diagonals drawn. Sides are shown in blue; diagonals in orange. The formula n(n-3)/2 counts the diagonals.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var n = 5;

                            VizEngine.createSlider(controls, 'Sides (n)', 3, 12, n, 1, function (v) {
                                n = Math.round(v); draw();
                            });

                            function draw() {
                                viz.clear();
                                var cx = w / 2, cy = h / 2 + 8;
                                var radius = Math.min(w, h) / 2 - 55;
                                var nDiags = n * (n - 3) / 2;

                                var positions = [];
                                for (var i = 0; i < n; i++) {
                                    var angle = -Math.PI / 2 + (2 * Math.PI * i) / n;
                                    positions.push({
                                        x: cx + radius * Math.cos(angle),
                                        y: cy + radius * Math.sin(angle)
                                    });
                                }

                                // Draw diagonals first (behind sides)
                                for (var a = 0; a < n; a++) {
                                    for (var b = a + 2; b < n; b++) {
                                        if (a === 0 && b === n - 1) continue; // side, not diagonal
                                        ctx.strokeStyle = viz.colors.orange + '66';
                                        ctx.lineWidth = 1.2;
                                        ctx.beginPath();
                                        ctx.moveTo(positions[a].x, positions[a].y);
                                        ctx.lineTo(positions[b].x, positions[b].y);
                                        ctx.stroke();
                                    }
                                }

                                // Draw sides
                                for (var si = 0; si < n; si++) {
                                    var ni = (si + 1) % n;
                                    ctx.strokeStyle = viz.colors.blue;
                                    ctx.lineWidth = 2.5;
                                    ctx.beginPath();
                                    ctx.moveTo(positions[si].x, positions[si].y);
                                    ctx.lineTo(positions[ni].x, positions[ni].y);
                                    ctx.stroke();
                                }

                                // Draw vertices
                                for (var vi = 0; vi < n; vi++) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.beginPath();
                                    ctx.arc(positions[vi].x, positions[vi].y, 5, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                // Info
                                viz.screenText(n + '-gon: ' + n + ' sides, ' + Math.max(0, nDiags) + ' diagonals',
                                    w / 2, 22, viz.colors.white, 14);
                                viz.screenText(
                                    'n(n\u22123)/2 = ' + n + '\u00D7' + (n - 3) + '/2 = ' + Math.max(0, nDiags),
                                    w / 2, h - 16, viz.colors.teal, 12);

                                // Legend
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillRect(w - 140, h - 46, 12, 12);
                                ctx.fillStyle = viz.colors.text; ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
                                ctx.fillText('Sides (' + n + ')', w - 124, h - 40);

                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillRect(w - 140, h - 30, 12, 12);
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('Diagonals (' + Math.max(0, nDiags) + ')', w - 124, h - 24);
                            }
                            draw();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'At a meeting of 8 people, everyone shakes hands with everyone else exactly once. How many handshakes occur?',
                        hint: 'Use the formula n(n-1)/2.',
                        solution: '\\(\\frac{8 \\times 7}{2} = 28\\) handshakes.'
                    },
                    {
                        question: 'How many diagonals does a decagon (10 sides) have?',
                        hint: 'Use n(n-3)/2.',
                        solution: '\\(\\frac{10 \\times 7}{2} = 35\\) diagonals.'
                    },
                    {
                        question: 'In a round-robin tournament, every team plays every other team exactly once. If there are 6 teams, how many games are played?',
                        hint: 'This is exactly the handshake problem: each "game" is a pair of teams.',
                        solution: '\\(\\frac{6 \\times 5}{2} = 15\\) games.'
                    }
                ]
            },

            // ============================================================
            // Section 5: Pascal's Triangle
            // ============================================================
            {
                id: 'sec-pascal',
                title: "Pascal\u2019s Triangle",
                content: `
<h2>Pascal\u2019s Triangle</h2>

<p>One of the most beautiful objects in all of mathematics is <strong>Pascal\u2019s triangle</strong>. It begins with a 1 at the top. Each number below is the sum of the two numbers directly above it.</p>

<pre style="text-align:center;color:#3fb9a0;font-size:1.1em;line-height:1.6;">
        1
       1 1
      1 2 1
     1 3 3 1
    1 4 6 4 1
   1 5 10 10 5 1
</pre>

<p>Build it yourself in the visualization below. Click "Add Row" and watch each entry appear as the sum of the two above it.</p>

<div class="viz-placeholder" data-viz="viz-pascal-builder"></div>

<h3>What is Pascal\u2019s triangle counting?</h3>

<p>Row \\(n\\) of Pascal\u2019s triangle contains the numbers \\(\\binom{n}{0}, \\binom{n}{1}, \\ldots, \\binom{n}{n}\\). The entry in position \\(k\\) of row \\(n\\) is \\(\\binom{n}{k}\\), the number of ways to choose \\(k\\) items from \\(n\\).</p>

<p>The "sum of two above" rule is <strong>Pascal\u2019s Rule</strong>:</p>
\\[\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}\\]

<p>This makes perfect sense: to choose \\(k\\) from \\(n\\), either you include the \\(n\\)-th item (then choose \\(k-1\\) from the remaining \\(n-1\\)) or you exclude it (choose \\(k\\) from \\(n-1\\)).</p>

<h3>Hidden Patterns</h3>

<p>Pascal\u2019s triangle hides a remarkable number of patterns. Explore them in the pattern highlighter below.</p>

<div class="viz-placeholder" data-viz="viz-pascal-patterns"></div>

<div class="env-block intuition">
<strong>Patterns in Pascal\u2019s triangle:</strong>
<ul>
<li><strong>Row sums</strong> are powers of 2: row \\(n\\) sums to \\(2^n\\).</li>
<li>The <strong>diagonals</strong> give natural numbers (1, 2, 3, ...), triangular numbers (1, 3, 6, 10, ...), and tetrahedral numbers.</li>
<li>The <strong>hockey stick identity</strong>: sliding down a diagonal and turning, the sum equals the entry at the turn.</li>
<li><strong>Fibonacci numbers</strong> appear as sums along the "shallow diagonals."</li>
<li>Color the odd entries and you get the <strong>Sierpi\u0144ski triangle</strong>, a fractal!</li>
</ul>
</div>
`,
                visualizations: [
                    // --- viz-pascal-builder ---
                    {
                        id: 'viz-pascal-builder',
                        title: "Build Pascal\u2019s Triangle",
                        description: "Add rows one at a time and watch each entry computed as the sum of two parents. Click any entry to highlight how it was formed.",
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var maxRow = 0;
                            var maxAllowed = 12;
                            var highlightR = -1, highlightK = -1;
                            var animRow = -1, animK = -1, animTimer = null;

                            VizEngine.createButton(controls, 'Add Row', function () {
                                if (maxRow < maxAllowed) {
                                    maxRow++;
                                    // Animate the new row
                                    animRow = maxRow;
                                    animK = 0;
                                    if (animTimer) clearInterval(animTimer);
                                    draw();
                                    animTimer = setInterval(function () {
                                        animK++;
                                        if (animK > animRow) {
                                            clearInterval(animTimer);
                                            animTimer = null;
                                            animRow = -1; animK = -1;
                                        }
                                        draw();
                                    }, 250);
                                }
                            });

                            VizEngine.createButton(controls, 'Reset', function () {
                                maxRow = 0; highlightR = -1; highlightK = -1;
                                if (animTimer) { clearInterval(animTimer); animTimer = null; }
                                animRow = -1; animK = -1;
                                draw();
                            });

                            viz.canvas.addEventListener('click', function (e) {
                                var rect = viz.canvas.getBoundingClientRect();
                                var mx = e.clientX - rect.left;
                                var my = e.clientY - rect.top;
                                var rowH = Math.min(32, (h - 50) / (maxRow + 1));

                                for (var r = 0; r <= maxRow; r++) {
                                    var cellW = Math.min(48, (w - 60) / (maxRow + 2));
                                    var rowWidth = (r + 1) * cellW;
                                    var xStart = (w - rowWidth) / 2;
                                    var yy = 35 + r * rowH;
                                    for (var k = 0; k <= r; k++) {
                                        var xx = xStart + k * cellW + cellW / 2;
                                        if (Math.abs(mx - xx) < cellW / 2 && Math.abs(my - yy) < rowH / 2) {
                                            if (highlightR === r && highlightK === k) {
                                                highlightR = -1; highlightK = -1;
                                            } else {
                                                highlightR = r; highlightK = k;
                                            }
                                            draw();
                                            return;
                                        }
                                    }
                                }
                            });

                            function draw() {
                                viz.clear();
                                var rowH = Math.min(32, (h - 50) / Math.max(maxRow + 1, 1));
                                var cellW = Math.min(48, (w - 60) / (maxRow + 2));

                                for (var r = 0; r <= maxRow; r++) {
                                    var rowWidth = (r + 1) * cellW;
                                    var xStart = (w - rowWidth) / 2;
                                    var yy = 35 + r * rowH;
                                    var rowSum = 0;

                                    for (var k = 0; k <= r; k++) {
                                        // During animation, skip entries not yet revealed
                                        if (r === animRow && k > animK) continue;

                                        var val = C(r, k);
                                        rowSum += val;
                                        var xx = xStart + k * cellW + cellW / 2;

                                        var isHL = (r === highlightR && k === highlightK);
                                        var isParent = (highlightR > 0 && r === highlightR - 1 &&
                                            (k === highlightK - 1 || k === highlightK) &&
                                            k >= 0 && k <= r);
                                        var isNew = (r === animRow && k === animK && animRow >= 0);

                                        if (isHL) {
                                            ctx.fillStyle = viz.colors.teal + '44';
                                            ctx.beginPath(); ctx.arc(xx, yy, 16, 0, Math.PI * 2); ctx.fill();
                                        } else if (isParent) {
                                            ctx.fillStyle = viz.colors.blue + '44';
                                            ctx.beginPath(); ctx.arc(xx, yy, 16, 0, Math.PI * 2); ctx.fill();
                                            // Draw connection line
                                            var childCellW = cellW;
                                            var childRowWidth = (highlightR + 1) * childCellW;
                                            var childXStart = (w - childRowWidth) / 2;
                                            var childXX = childXStart + highlightK * childCellW + childCellW / 2;
                                            var childYY = 35 + highlightR * rowH;
                                            ctx.strokeStyle = viz.colors.blue + '66'; ctx.lineWidth = 1.5;
                                            ctx.beginPath(); ctx.moveTo(xx, yy + 10); ctx.lineTo(childXX, childYY - 10); ctx.stroke();
                                        } else if (isNew) {
                                            ctx.fillStyle = viz.colors.orange + '55';
                                            ctx.beginPath(); ctx.arc(xx, yy, 16, 0, Math.PI * 2); ctx.fill();
                                        }

                                        var fontSize = val > 999 ? 9 : (val > 99 ? 10 : 12);
                                        ctx.font = (isHL || isNew ? 'bold ' : '') + fontSize + 'px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillStyle = isHL ? viz.colors.teal : isParent ? viz.colors.blue :
                                            isNew ? viz.colors.orange : viz.colors.white;
                                        ctx.fillText(String(val), xx, yy);
                                    }

                                    // Row sum on the right
                                    if (r !== animRow || animK >= r) {
                                        ctx.font = '9px -apple-system,sans-serif'; ctx.textAlign = 'left';
                                        ctx.fillStyle = viz.colors.text;
                                        ctx.fillText('= ' + rowSum, xStart + rowWidth + 6, yy);
                                    }
                                }

                                // Row labels
                                for (var rr = 0; rr <= maxRow; rr++) {
                                    var yyy = 35 + rr * rowH;
                                    ctx.font = '9px -apple-system,sans-serif'; ctx.textAlign = 'right';
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText('n=' + rr, 28, yyy);
                                }

                                // Info line
                                if (highlightR >= 0 && highlightK >= 0 && highlightK <= highlightR) {
                                    var info = 'C(' + highlightR + ',' + highlightK + ') = ' + C(highlightR, highlightK);
                                    if (highlightR > 0) {
                                        info += '  =  C(' + (highlightR - 1) + ',' + (highlightK - 1) + ') + C(' + (highlightR - 1) + ',' + highlightK + ')';
                                        info += '  =  ' + C(highlightR - 1, highlightK - 1) + ' + ' + C(highlightR - 1, highlightK);
                                    }
                                    viz.screenText(info, w / 2, h - 12, viz.colors.teal, 11);
                                } else if (maxRow === 0) {
                                    viz.screenText('Click "Add Row" to build the triangle', w / 2, h / 2, viz.colors.text, 13);
                                } else {
                                    viz.screenText('Click any entry to see how it was formed', w / 2, h - 12, viz.colors.text, 10);
                                }
                            }
                            draw();
                            return viz;
                        }
                    },
                    // --- viz-pascal-patterns ---
                    {
                        id: 'viz-pascal-patterns',
                        title: "Patterns in Pascal\u2019s Triangle",
                        description: "Choose a pattern to highlight: row sums (powers of 2), the hockey stick identity, Fibonacci shallow diagonals, or odd/even coloring (Sierpi\u0144ski).",
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var maxRow = 10;
                            var mode = 'powers2'; // powers2, hockey, fibonacci, sierpinski

                            VizEngine.createButton(controls, 'Powers of 2', function () { mode = 'powers2'; draw(); });
                            VizEngine.createButton(controls, 'Hockey Stick', function () { mode = 'hockey'; draw(); });
                            VizEngine.createButton(controls, 'Fibonacci', function () { mode = 'fibonacci'; draw(); });
                            VizEngine.createButton(controls, 'Sierpi\u0144ski', function () { mode = 'sierpinski'; draw(); });

                            VizEngine.createSlider(controls, 'Rows', 6, 16, maxRow, 1, function (v) {
                                maxRow = Math.round(v); draw();
                            });

                            function draw() {
                                viz.clear();
                                var rowH = Math.min(28, (h - 50) / (maxRow + 1));
                                var cellW = Math.min(40, (w - 60) / (maxRow + 2));

                                // Compute triangle
                                var tri = [];
                                for (var r = 0; r <= maxRow; r++) {
                                    tri[r] = [];
                                    for (var k = 0; k <= r; k++) {
                                        tri[r][k] = C(r, k);
                                    }
                                }

                                // Determine highlighted cells
                                var highlighted = {};
                                var highlightColor = viz.colors.teal;
                                var sumHighlightColor = viz.colors.orange;
                                var infoText = '';

                                if (mode === 'powers2') {
                                    // Highlight an entire row
                                    var hlRow = Math.min(5, maxRow);
                                    for (var kk = 0; kk <= hlRow; kk++) {
                                        highlighted[hlRow + ',' + kk] = viz.colors.teal;
                                    }
                                    infoText = 'Row ' + hlRow + ' sums to 2^' + hlRow + ' = ' + Math.pow(2, hlRow);
                                } else if (mode === 'hockey') {
                                    // Hockey stick: C(2,0)+C(3,0)+C(4,0)+C(5,0)+C(6,0)=C(7,1)
                                    // Better: diagonal starting at (2,1)
                                    var startR = 1, startK = 0;
                                    var length = Math.min(5, maxRow - 2);
                                    var sum = 0;
                                    for (var i = 0; i < length; i++) {
                                        var rr = startR + i, kk2 = startK;
                                        highlighted[rr + ',' + kk2] = viz.colors.teal;
                                        sum += C(rr, kk2);
                                    }
                                    // The "turn" cell
                                    var turnR = startR + length, turnK = startK + 1;
                                    if (turnR <= maxRow) {
                                        highlighted[turnR + ',' + turnK] = viz.colors.orange;
                                        infoText = 'Hockey stick: sum of highlighted = ' + sum + ' = C(' + turnR + ',' + turnK + ') = ' + C(turnR, turnK);
                                    }
                                } else if (mode === 'fibonacci') {
                                    // Shallow diagonals: sum of C(n-k, k) for valid k
                                    var fibs = [1, 1];
                                    for (var fi = 2; fi <= maxRow; fi++) fibs.push(fibs[fi - 1] + fibs[fi - 2]);
                                    // Highlight diagonal d (where d = r + k direction)
                                    var diagIdx = Math.min(7, maxRow);
                                    var fibSum = 0;
                                    for (var kf = 0; kf <= Math.floor(diagIdx / 2); kf++) {
                                        var rf = diagIdx - kf;
                                        if (rf >= 0 && rf <= maxRow && kf <= rf) {
                                            highlighted[rf + ',' + kf] = viz.colors.purple;
                                            fibSum += C(rf, kf);
                                        }
                                    }
                                    infoText = 'Shallow diagonal ' + diagIdx + ' sums to ' + fibSum + ' (Fibonacci!)';
                                } else if (mode === 'sierpinski') {
                                    // Color odd entries
                                    for (var rs = 0; rs <= maxRow; rs++) {
                                        for (var ks = 0; ks <= rs; ks++) {
                                            if (C(rs, ks) % 2 === 1) {
                                                highlighted[rs + ',' + ks] = viz.colors.teal;
                                            }
                                        }
                                    }
                                    infoText = 'Odd entries form a Sierpi\u0144ski triangle fractal';
                                }

                                // Draw triangle
                                for (var r2 = 0; r2 <= maxRow; r2++) {
                                    var rowWidth = (r2 + 1) * cellW;
                                    var xStart = (w - rowWidth) / 2;
                                    var yy = 30 + r2 * rowH;

                                    for (var k2 = 0; k2 <= r2; k2++) {
                                        var val = tri[r2][k2];
                                        var xx = xStart + k2 * cellW + cellW / 2;
                                        var key = r2 + ',' + k2;
                                        var hl = highlighted[key];

                                        if (hl) {
                                            ctx.fillStyle = hl + (mode === 'sierpinski' ? '88' : '44');
                                            ctx.beginPath(); ctx.arc(xx, yy, Math.min(14, cellW / 2 - 1), 0, Math.PI * 2); ctx.fill();
                                        }

                                        var fontSize = val > 999 ? 7 : (val > 99 ? 8 : (val > 9 ? 9 : 10));
                                        ctx.font = (hl ? 'bold ' : '') + fontSize + 'px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillStyle = hl ? hl : (mode === 'sierpinski' ? viz.colors.text + '44' : viz.colors.white);
                                        ctx.fillText(String(val), xx, yy);
                                    }
                                }

                                // Info line
                                viz.screenText(infoText, w / 2, h - 10, viz.colors.white, 11);
                            }
                            draw();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'What is the sum of all entries in row 7 of Pascal\u2019s triangle?',
                        hint: 'Row n sums to 2^n.',
                        solution: '\\(2^7 = 128\\).'
                    },
                    {
                        question: 'Verify the hockey stick identity: \\(\\binom{1}{1} + \\binom{2}{1} + \\binom{3}{1} + \\binom{4}{1} = \\binom{5}{2}\\).',
                        hint: 'Compute each term.',
                        solution: '\\(1 + 2 + 3 + 4 = 10\\) and \\(\\binom{5}{2} = 10\\). They match!'
                    },
                    {
                        question: 'Find the Fibonacci number hidden in the shallow diagonal starting from C(6,0). That is, compute \\(\\binom{6}{0} + \\binom{5}{1} + \\binom{4}{2} + \\binom{3}{3}\\).',
                        hint: 'Compute each term and add.',
                        solution: '\\(1 + 5 + 6 + 1 = 13\\), which is the 7th Fibonacci number.'
                    }
                ]
            },

            // ============================================================
            // Section 6: Bridge to the Next Chapter
            // ============================================================
            {
                id: 'sec-bridge',
                title: 'Counting Challenges',
                content: `
<h2>Putting It All Together</h2>

<p>You now have a powerful toolkit:</p>
<ul>
<li>The <strong>Multiplication Principle</strong> for sequences of independent choices.</li>
<li>The <strong>Addition Principle</strong> for choosing among separate categories.</li>
<li>The <strong>overcounting correction</strong> (divide or subtract to remove duplicates).</li>
<li><strong>Pascal\u2019s Triangle</strong> and the idea of "n choose k."</li>
</ul>

<p>Let us test these tools on a collection of challenge problems. Each one requires you to figure out which tool applies and how to use it.</p>

<div class="viz-placeholder" data-viz="viz-counting-challenge"></div>

<h3>Looking Ahead</h3>

<p>In the next chapter, we will meet the <strong>Pigeonhole Principle</strong>: if you put more than \\(n\\) objects into \\(n\\) boxes, at least one box must contain more than one object. It sounds trivially obvious, but its consequences are surprisingly deep and delightful.</p>

<div class="env-block intuition">
<strong>Counting is a superpower.</strong> The ability to count without listing is what separates recreational puzzling from real mathematics. Every problem in probability, every question about codes and ciphers, every analysis of algorithms relies on the counting principles you have just learned. Practice them until they become second nature.
</div>
`,
                visualizations: [
                    // --- viz-counting-challenge ---
                    {
                        id: 'viz-counting-challenge',
                        title: 'Counting Challenge',
                        description: 'Word problems to test your counting skills. Read each problem, compute the answer, and check.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;

                            var problems = [
                                {
                                    q: 'A pizza shop offers 8 toppings.\nHow many different 3-topping pizzas\ncan you make? (order does not matter)',
                                    answer: 56,
                                    explain: 'C(8,3) = 56'
                                },
                                {
                                    q: 'How many ways can 5 people\nsit in a row of 5 chairs?',
                                    answer: 120,
                                    explain: '5! = 120'
                                },
                                {
                                    q: 'A password has 2 uppercase letters\nfollowed by 3 digits.\nHow many possible passwords?',
                                    answer: 676000,
                                    explain: '26\u00B2 \u00D7 10\u00B3 = 676,000'
                                },
                                {
                                    q: 'How many diagonals does\na 9-sided polygon have?',
                                    answer: 27,
                                    explain: '9 \u00D7 6 / 2 = 27'
                                },
                                {
                                    q: 'A club has 10 members.\nHow many ways to choose\na president and a vice-president?',
                                    answer: 90,
                                    explain: '10 \u00D7 9 = 90 (order matters)'
                                },
                                {
                                    q: 'How many handshakes at a\nparty of 15 people?',
                                    answer: 105,
                                    explain: '15 \u00D7 14 / 2 = 105'
                                },
                                {
                                    q: 'Row 8 of Pascal\u2019s triangle:\nwhat is the sum of all entries?',
                                    answer: 256,
                                    explain: '2\u2078 = 256'
                                },
                                {
                                    q: 'A coin is flipped 10 times.\nIn how many ways can you get\nexactly 3 heads?',
                                    answer: 120,
                                    explain: 'C(10,3) = 120'
                                }
                            ];

                            var currentIdx = 0;
                            var userAnswer = '';
                            var feedback = '';
                            var feedbackColor = viz.colors.text;

                            VizEngine.createButton(controls, '\u2190 Prev', function () {
                                currentIdx = (currentIdx - 1 + problems.length) % problems.length;
                                userAnswer = ''; feedback = '';
                                draw();
                            });
                            VizEngine.createButton(controls, 'Next \u2192', function () {
                                currentIdx = (currentIdx + 1) % problems.length;
                                userAnswer = ''; feedback = '';
                                draw();
                            });
                            VizEngine.createButton(controls, 'Check', function () {
                                var num = parseInt(userAnswer, 10);
                                if (isNaN(num)) {
                                    feedback = 'Enter a number first.';
                                    feedbackColor = viz.colors.yellow;
                                } else if (num === problems[currentIdx].answer) {
                                    feedback = 'Correct! ' + problems[currentIdx].explain;
                                    feedbackColor = viz.colors.green;
                                } else {
                                    feedback = 'Not quite. Try again!';
                                    feedbackColor = viz.colors.red;
                                }
                                draw();
                            });
                            VizEngine.createButton(controls, 'Show Answer', function () {
                                feedback = 'Answer: ' + problems[currentIdx].answer + ' (' + problems[currentIdx].explain + ')';
                                feedbackColor = viz.colors.orange;
                                draw();
                            });

                            // Input field
                            var inputDiv = document.createElement('div');
                            inputDiv.style.cssText = 'display:inline-flex;align-items:center;gap:6px;margin-left:8px;';
                            var inputLabel = document.createElement('span');
                            inputLabel.textContent = 'Your answer:';
                            inputLabel.style.cssText = 'color:#8b949e;font-size:0.8rem;';
                            var inputEl = document.createElement('input');
                            inputEl.type = 'text';
                            inputEl.style.cssText = 'width:90px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#f0f6fc;font-size:0.85rem;';
                            inputEl.addEventListener('input', function () {
                                userAnswer = inputEl.value;
                            });
                            inputEl.addEventListener('keydown', function (e) {
                                if (e.key === 'Enter') {
                                    var num = parseInt(userAnswer, 10);
                                    if (isNaN(num)) {
                                        feedback = 'Enter a number first.';
                                        feedbackColor = viz.colors.yellow;
                                    } else if (num === problems[currentIdx].answer) {
                                        feedback = 'Correct! ' + problems[currentIdx].explain;
                                        feedbackColor = viz.colors.green;
                                    } else {
                                        feedback = 'Not quite. Try again!';
                                        feedbackColor = viz.colors.red;
                                    }
                                    draw();
                                }
                            });
                            inputDiv.appendChild(inputLabel);
                            inputDiv.appendChild(inputEl);
                            controls.appendChild(inputDiv);

                            function draw() {
                                viz.clear();
                                var prob = problems[currentIdx];

                                // Problem number
                                viz.screenText('Problem ' + (currentIdx + 1) + ' of ' + problems.length,
                                    w / 2, 20, viz.colors.text, 11);

                                // Problem text (multiline)
                                var lines = prob.q.split('\n');
                                var startY = h / 2 - lines.length * 14;
                                ctx.font = '16px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                for (var li = 0; li < lines.length; li++) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.fillText(lines[li], w / 2, startY + li * 30);
                                }

                                // Feedback
                                if (feedback) {
                                    viz.screenText(feedback, w / 2, h - 30, feedbackColor, 13);
                                }
                            }
                            draw();
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'A class of 12 students needs to choose a committee of 3. How many ways?',
                        hint: 'Order does not matter; use C(n,k).',
                        solution: '\\(\\binom{12}{3} = \\frac{12 \\times 11 \\times 10}{3 \\times 2 \\times 1} = 220\\).'
                    },
                    {
                        question: 'How many ways can you arrange the letters in the word MATH?',
                        hint: 'All 4 letters are distinct.',
                        solution: '\\(4! = 24\\) arrangements.'
                    },
                    {
                        question: 'There are 20 teams in a league. Each pair plays exactly once. How many total games?',
                        hint: 'Same as the handshake problem.',
                        solution: '\\(\\frac{20 \\times 19}{2} = 190\\) games.'
                    },
                    {
                        question: 'A bag has 5 red marbles and 4 blue marbles. You draw 3 marbles. How many ways to get exactly 2 red and 1 blue?',
                        hint: 'Choose 2 from 5 red AND 1 from 4 blue (multiply).',
                        solution: '\\(\\binom{5}{2} \\times \\binom{4}{1} = 10 \\times 4 = 40\\) ways.'
                    }
                ]
            }
        ]
    });
})();
