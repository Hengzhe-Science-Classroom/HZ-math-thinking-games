// === Chapter 6: Combinations — Order Doesn't ===
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
        title: "Combinations \u2014 Order Doesn\u2019t",
        subtitle: 'When the only thing that matters is who (or what) is chosen, not the order they stand in',

        sections: [
            // ============================================================
            // Section 1: Choosing without order
            // ============================================================
            {
                id: 'choosing',
                title: 'Choosing without Order',
                content: `
<h2>Committees, Teams, and Pizza Toppings</h2>

<p>In the last chapter you learned about permutations, where order matters. Arranging three books on a shelf (ABC vs BAC) gives different results. But many situations in life do not care about order at all.</p>

<ul>
    <li>Picking 3 friends from a group of 10 to form a basketball team.</li>
    <li>Choosing 2 pizza toppings from a menu of 8.</li>
    <li>Selecting a committee of 4 from a club of 15 members.</li>
</ul>

<p>In all these cases, the <em>set</em> of people (or toppings) you choose is what matters, not the sequence in which you pick them. Team {Alice, Bob, Carol} is the same team as {Carol, Alice, Bob}.</p>

<div class="env-block definition">
<strong>Combination</strong><br>
A <em>combination</em> is a selection of items where order does not matter. The number of ways to choose \\(k\\) items from \\(n\\) distinct items is written \\(\\binom{n}{k}\\) (read "n choose k") or \\(C(n, k)\\).
</div>

<h3>Permutation vs Combination: the key distinction</h3>

<p>Suppose you have 4 people: Alice (A), Bob (B), Carol (C), Dave (D). How many ways can you choose a <em>team of 2</em>?</p>

<p>If order mattered (permutations), we would count AB and BA as different. That gives \\(P(4,2) = 4 \\times 3 = 12\\) arrangements. But for a team, AB and BA are the same pair. Every pair has been counted twice (once in each order). So the number of teams is \\(12 / 2 = 6\\).</p>

<p>Let us list them: {A,B}, {A,C}, {A,D}, {B,C}, {B,D}, {C,D}. Exactly 6.</p>

<div class="env-block intuition">
<strong>The overcounting idea</strong><br>
Permutations overcount combinations because each combination of \\(k\\) items can be <em>arranged</em> in \\(k!\\) ways. To go from permutations to combinations, divide by \\(k!\\).
</div>

<p>Use the interactive visualization below to see this in action. Pick a group size \\(n\\) and a team size \\(k\\), and watch all possible teams appear.</p>

<div class="viz-placeholder" data-viz="team-selector"></div>
`,
                visualizations: [
                    {
                        id: 'team-selector',
                        title: 'Interactive Team Selector',
                        description: 'Choose n (total people) and k (team size). All possible teams are displayed, and \\(C(n,k)\\) updates in real time.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 420, scale: 1, originX: 0, originY: 0 });
                            var n = 5, k = 2;
                            var names = ['A','B','C','D','E','F','G','H','I','J'];
                            var hColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange,
                                           viz.colors.green, viz.colors.purple, viz.colors.pink,
                                           viz.colors.yellow, viz.colors.red, viz.colors.gold, viz.colors.white];

                            function getCombinations(arr, sz) {
                                var results = [];
                                function helper(start, combo) {
                                    if (combo.length === sz) { results.push(combo.slice()); return; }
                                    for (var i = start; i < arr.length; i++) {
                                        combo.push(i);
                                        helper(i + 1, combo);
                                        combo.pop();
                                    }
                                }
                                helper(0, []);
                                return results;
                            }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;

                                // Draw the people along the top
                                var spacing = Math.min(50, (W - 60) / n);
                                var startX = (W - (n - 1) * spacing) / 2;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                for (var i = 0; i < n; i++) {
                                    var px = startX + i * spacing;
                                    ctx.fillStyle = hColors[i % hColors.length] + '33';
                                    ctx.beginPath(); ctx.arc(px, 36, 16, 0, Math.PI * 2); ctx.fill();
                                    ctx.fillStyle = hColors[i % hColors.length];
                                    ctx.fillText(names[i], px, 36);
                                }

                                // Compute combinations
                                var combos = getCombinations(names.slice(0, n), k);
                                var total = combos.length;

                                // Header with C(n,k) value
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('C(' + n + ', ' + k + ') = ' + total + ' teams', W / 2, 72);

                                // Draw all combinations in a grid
                                var cols = Math.max(1, Math.floor((W - 20) / 110));
                                var rowH = 28;
                                var maxShow = Math.min(total, Math.floor((H - 100) / rowH) * cols);

                                ctx.font = '13px -apple-system,sans-serif';
                                for (var j = 0; j < maxShow; j++) {
                                    var col = j % cols;
                                    var row = Math.floor(j / cols);
                                    var cx = 20 + col * 110 + 50;
                                    var cy = 100 + row * rowH;

                                    var combo = combos[j];
                                    var label = '{' + combo.join(', ') + '}';

                                    // Colored dots for team members
                                    for (var m = 0; m < combo.length; m++) {
                                        var mi = names.indexOf(combo[m]);
                                        ctx.fillStyle = hColors[mi % hColors.length];
                                        ctx.beginPath();
                                        ctx.arc(cx - 40 + m * 12, cy, 4, 0, Math.PI * 2);
                                        ctx.fill();
                                    }

                                    ctx.fillStyle = viz.colors.text;
                                    ctx.textAlign = 'left';
                                    ctx.fillText(label, cx - 40 + combo.length * 12 + 6, cy);
                                }

                                if (total > maxShow) {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.textAlign = 'center';
                                    ctx.fillText('... and ' + (total - maxShow) + ' more', W / 2, H - 14);
                                }

                                // Formula display at bottom
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(n + '! / (' + k + '! \u00d7 ' + (n - k) + '!) = '
                                    + factorial(n) + ' / (' + factorial(k) + ' \u00d7 ' + factorial(n - k) + ') = ' + total,
                                    W / 2, H - 34);
                            }

                            VizEngine.createSlider(controls, 'n (people)', 2, 10, n, 1, function (v) {
                                n = Math.round(v);
                                if (k > n) k = n;
                                draw();
                            });
                            VizEngine.createSlider(controls, 'k (team)', 0, 10, k, 1, function (v) {
                                k = Math.min(Math.round(v), n);
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'A class has 8 students. How many ways can you pick a group of 3 to work on a project?',
                        hint: 'Use \\(C(8, 3) = \\frac{8!}{3! \\cdot 5!}\\). Simplify step by step.',
                        solution: '\\(C(8,3) = \\frac{8!}{3! \\cdot 5!} = \\frac{8 \\times 7 \\times 6}{3 \\times 2 \\times 1} = \\frac{336}{6} = 56\\).'
                    },
                    {
                        question: 'List all combinations of 2 letters from {P, Q, R, S}. How many are there?',
                        hint: 'Go systematically: start with P paired with each later letter, then Q with later letters, etc.',
                        solution: '{P,Q}, {P,R}, {P,S}, {Q,R}, {Q,S}, {R,S}. That is \\(C(4,2) = 6\\).'
                    }
                ]
            },

            // ============================================================
            // Section 2: The Combinations Formula
            // ============================================================
            {
                id: 'formula',
                title: 'The Combinations Formula',
                content: `
<h2>Deriving \\(C(n,k)\\)</h2>

<p>We saw intuitively that combinations = permutations / (overcounting from order). Let us make this precise.</p>

<p>The number of <em>permutations</em> of \\(k\\) items from \\(n\\) is:</p>
\\[
P(n, k) = n \\times (n-1) \\times (n-2) \\times \\cdots \\times (n-k+1) = \\frac{n!}{(n-k)!}
\\]

<p>Each combination of \\(k\\) items appears \\(k!\\) times in the list of permutations (once for each arrangement of those \\(k\\) items). So:</p>

<div class="env-block theorem">
<strong>The Combinations Formula</strong><br>
\\[
C(n, k) = \\binom{n}{k} = \\frac{n!}{k! \\cdot (n-k)!}
\\]
</div>

<h3>Key properties</h3>

<div class="env-block definition">
<strong>Symmetry</strong><br>
\\(\\binom{n}{k} = \\binom{n}{n-k}\\). Choosing \\(k\\) items to include is the same as choosing \\(n-k\\) items to exclude.
</div>

<p>For example, \\(\\binom{10}{3} = \\binom{10}{7} = 120\\). Choosing 3 people for a team is the same as choosing 7 people to <em>not</em> be on the team.</p>

<div class="env-block definition">
<strong>Boundary cases</strong><br>
\\(\\binom{n}{0} = 1\\) (there is exactly one way to choose nothing), and \\(\\binom{n}{n} = 1\\) (there is exactly one way to choose everything).
</div>

<h3>A computational shortcut</h3>

<p>You do not need to compute full factorials. To compute \\(\\binom{n}{k}\\), multiply \\(k\\) consecutive integers starting from \\(n\\) downward, then divide by \\(k!\\):</p>
\\[
\\binom{n}{k} = \\frac{n \\times (n-1) \\times \\cdots \\times (n-k+1)}{k!}
\\]

<div class="env-block example">
<strong>Compute \\(\\binom{12}{4}\\)</strong><br>
\\(\\frac{12 \\times 11 \\times 10 \\times 9}{4!} = \\frac{11880}{24} = 495\\).
</div>

<p>This avoids computing \\(12! = 479001600\\), which is unnecessarily large.</p>

<div class="env-block warning">
<strong>Common mistake</strong><br>
Do not confuse \\(C(n,k)\\) with \\(P(n,k)\\). If someone asks "how many handshakes happen when 10 people each shake hands with everyone else?" that is \\(C(10,2) = 45\\), not \\(P(10,2) = 90\\). Each handshake involves two people, and shaking A's hand then B's hand is the same handshake as B then A.
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'Compute \\(\\binom{7}{3}\\) using the shortcut formula.',
                        hint: 'Multiply 7, 6, 5 (three terms), then divide by \\(3! = 6\\).',
                        solution: '\\(\\binom{7}{3} = \\frac{7 \\times 6 \\times 5}{3!} = \\frac{210}{6} = 35\\).'
                    },
                    {
                        question: 'Verify that \\(\\binom{6}{2} = \\binom{6}{4}\\). Why must this be true?',
                        hint: 'Compute both. Then think about what "choosing 2" leaves behind.',
                        solution: '\\(\\binom{6}{2} = \\frac{6 \\times 5}{2} = 15\\). \\(\\binom{6}{4} = \\frac{6 \\times 5 \\times 4 \\times 3}{24} = 15\\). They are equal because choosing 2 items to include is the same as choosing 4 items to exclude. This is the symmetry property \\(\\binom{n}{k} = \\binom{n}{n-k}\\).'
                    },
                    {
                        question: 'A pizza shop offers 10 toppings. You want exactly 4. How many different pizzas can you order?',
                        hint: 'Order of toppings on a pizza does not matter.',
                        solution: '\\(\\binom{10}{4} = \\frac{10 \\times 9 \\times 8 \\times 7}{4!} = \\frac{5040}{24} = 210\\) different pizzas.'
                    }
                ]
            },

            // ============================================================
            // Section 3: Pascal's Triangle Connection
            // ============================================================
            {
                id: 'pascal',
                title: "Pascal\u2019s Triangle Connection",
                content: `
<h2>The Triangle of Combinations</h2>

<p>You may have seen Pascal's Triangle before: a triangle of numbers where each entry is the sum of the two entries directly above it. Here is the beautiful secret: <em>every entry in Pascal's Triangle is a combination.</em></p>

<p>The entry in row \\(n\\), position \\(k\\) (both starting from 0) is exactly \\(\\binom{n}{k}\\):</p>

<pre style="text-align:center; color:#58a6ff; font-size:1.05rem; line-height:1.7;">
Row 0:              1
Row 1:            1   1
Row 2:          1   2   1
Row 3:        1   3   3   1
Row 4:      1   4   6   4   1
Row 5:    1   5  10  10   5   1
</pre>

<div class="env-block theorem">
<strong>Pascal's Identity</strong><br>
\\[
\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}
\\]
Every entry equals the sum of the two entries above it.
</div>

<h3>Why does Pascal's Identity work?</h3>

<p>Suppose you have \\(n\\) people and want to choose a committee of \\(k\\). Focus on one specific person, say Zelda. Either:</p>
<ul>
    <li>Zelda is on the committee: you still need to choose \\(k-1\\) people from the remaining \\(n-1\\). That gives \\(\\binom{n-1}{k-1}\\) ways.</li>
    <li>Zelda is not on the committee: you choose all \\(k\\) people from the remaining \\(n-1\\). That gives \\(\\binom{n-1}{k}\\) ways.</li>
</ul>

<p>Since every committee either includes Zelda or does not, the total is \\(\\binom{n-1}{k-1} + \\binom{n-1}{k} = \\binom{n}{k}\\).</p>

<div class="env-block remark">
<strong>Row sums</strong><br>
The sum of all entries in row \\(n\\) is \\(2^n\\). Why? Each of the \\(n\\) items is either chosen or not, giving \\(2^n\\) total subsets. Summing \\(\\binom{n}{0} + \\binom{n}{1} + \\cdots + \\binom{n}{n} = 2^n\\).
</div>

<p>Click on entries in the interactive Pascal's Triangle below to see their \\(\\binom{n}{k}\\) values and the two parents that sum to produce them.</p>

<div class="viz-placeholder" data-viz="pascal-triangle"></div>
`,
                visualizations: [
                    {
                        id: 'pascal-triangle',
                        title: "Pascal\u2019s Triangle = Combinations",
                        description: 'Click any entry to highlight it and its two parents. The \\(\\binom{n}{k}\\) notation appears for the selected cell.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 420, scale: 1, originX: 0, originY: 0 });
                            var numRows = 9;
                            var selR = -1, selC = -1;

                            // Precompute Pascal
                            var pascal = [];
                            for (var r = 0; r < 15; r++) {
                                pascal[r] = [];
                                for (var c = 0; c <= r; c++) {
                                    if (c === 0 || c === r) pascal[r][c] = 1;
                                    else pascal[r][c] = pascal[r - 1][c - 1] + pascal[r - 1][c];
                                }
                            }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var cellW = Math.min(50, (W - 40) / (numRows + 1));
                                var cellH = Math.min(38, (H - 60) / (numRows + 1));

                                for (var r = 0; r < numRows; r++) {
                                    var rowLen = r + 1;
                                    var startX = W / 2 - (rowLen - 1) * cellW / 2;
                                    var y = 30 + r * cellH;
                                    for (var c = 0; c < rowLen; c++) {
                                        var x = startX + c * cellW;
                                        var isSel = (r === selR && c === selC);
                                        var isParent = (selR > 0 && r === selR - 1 &&
                                            (c === selC - 1 || c === selC) && c >= 0 && c < pascal[r].length);

                                        // Lines to parents
                                        if (r > 0) {
                                            var pStartX = W / 2 - (r) * cellW / 2;
                                            if (c > 0) {
                                                ctx.strokeStyle = isSel ? viz.colors.orange : '#1a1a40';
                                                ctx.lineWidth = isSel ? 2 : 0.5;
                                                ctx.beginPath();
                                                ctx.moveTo(pStartX + (c - 1) * cellW, 30 + (r - 1) * cellH + 10);
                                                ctx.lineTo(x, y - 8);
                                                ctx.stroke();
                                            }
                                            if (c < r) {
                                                ctx.strokeStyle = isSel ? viz.colors.orange : '#1a1a40';
                                                ctx.lineWidth = isSel ? 2 : 0.5;
                                                ctx.beginPath();
                                                ctx.moveTo(pStartX + c * cellW, 30 + (r - 1) * cellH + 10);
                                                ctx.lineTo(x, y - 8);
                                                ctx.stroke();
                                            }
                                        }

                                        // Cell background
                                        if (isSel || isParent) {
                                            ctx.fillStyle = (isSel ? viz.colors.orange : viz.colors.teal) + '44';
                                            ctx.beginPath(); ctx.arc(x, y, 16, 0, Math.PI * 2); ctx.fill();
                                        }

                                        ctx.fillStyle = isSel ? viz.colors.orange : (isParent ? viz.colors.teal : viz.colors.white);
                                        ctx.font = (isSel || isParent ? 'bold ' : '') + '13px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText(pascal[r][c], x, y);
                                    }
                                }

                                // Info panel
                                if (selR >= 0 && selC >= 0) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('C(' + selR + ', ' + selC + ') = ' + pascal[selR][selC], W / 2, H - 30);
                                    if (selR > 0) {
                                        var leftP = selC > 0 ? pascal[selR - 1][selC - 1] : 0;
                                        var rightP = selC < selR ? pascal[selR - 1][selC] : 0;
                                        ctx.fillStyle = viz.colors.teal;
                                        ctx.font = '12px -apple-system,sans-serif';
                                        ctx.fillText(leftP + ' + ' + rightP + ' = ' + pascal[selR][selC], W / 2, H - 12);
                                    }
                                }
                            }

                            viz.canvas.addEventListener('click', function (e) {
                                var rect = viz.canvas.getBoundingClientRect();
                                var mx = e.clientX - rect.left;
                                var my = e.clientY - rect.top;
                                var cellW = Math.min(50, (viz.width - 40) / (numRows + 1));
                                var cellH = Math.min(38, (viz.height - 60) / (numRows + 1));
                                selR = -1; selC = -1;
                                for (var r = 0; r < numRows; r++) {
                                    var rowLen = r + 1;
                                    var startX = viz.width / 2 - (rowLen - 1) * cellW / 2;
                                    var y = 30 + r * cellH;
                                    for (var c = 0; c < rowLen; c++) {
                                        var x = startX + c * cellW;
                                        if (Math.abs(mx - x) < 16 && Math.abs(my - y) < 16) {
                                            selR = r; selC = c;
                                        }
                                    }
                                }
                                draw();
                            });

                            VizEngine.createSlider(controls, 'Rows', 4, 14, numRows, 1, function (v) {
                                numRows = Math.round(v);
                                selR = -1; selC = -1;
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Use Pascal\'s Identity to compute \\(\\binom{6}{3}\\) from row 5.',
                        hint: 'You need \\(\\binom{5}{2}\\) and \\(\\binom{5}{3}\\). Row 5 is: 1, 5, 10, 10, 5, 1.',
                        solution: '\\(\\binom{6}{3} = \\binom{5}{2} + \\binom{5}{3} = 10 + 10 = 20\\).'
                    },
                    {
                        question: 'Verify that row 5 sums to \\(2^5 = 32\\).',
                        hint: 'Row 5: 1, 5, 10, 10, 5, 1.',
                        solution: '\\(1 + 5 + 10 + 10 + 5 + 1 = 32 = 2^5\\). Check!'
                    },
                    {
                        question: 'The alternating sum of row \\(n\\) is \\(\\binom{n}{0} - \\binom{n}{1} + \\binom{n}{2} - \\cdots\\). What is it for \\(n \\geq 1\\)?',
                        hint: 'Try it for rows 1 through 4. The answer is surprisingly simple.',
                        solution: 'The alternating sum is always 0 for \\(n \\geq 1\\). This comes from expanding \\((1 - 1)^n = 0\\) using the Binomial Theorem.'
                    }
                ]
            },

            // ============================================================
            // Section 4: Stars and Bars
            // ============================================================
            {
                id: 'stars-bars',
                title: 'Stars and Bars',
                content: `
<h2>Distributing Identical Objects</h2>

<p>Here is a different kind of counting problem: you have 10 identical candies and want to distribute them among 3 children. Each child can get any number (including zero). How many ways can you do this?</p>

<p>This looks nothing like "choose k from n," but there is an elegant trick that transforms it into a combination problem.</p>

<h3>The stars-and-bars representation</h3>

<p>Represent the 10 candies as 10 stars: \\(\\star\\star\\star\\star\\star\\star\\star\\star\\star\\star\\). To divide them among 3 children, you need 2 dividers (bars). For example:</p>

<pre style="color:#58a6ff; font-size:1.1rem; text-align:center;">
\u2605\u2605\u2605\u2605 | \u2605\u2605\u2605 | \u2605\u2605\u2605    (4, 3, 3)
\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605\u2605 | |          (10, 0, 0)
| \u2605\u2605\u2605\u2605\u2605 | \u2605\u2605\u2605\u2605\u2605    (0, 5, 5)
</pre>

<p>Each arrangement of 10 stars and 2 bars gives a valid distribution. The total number of symbols is \\(10 + 2 = 12\\), and you need to choose where to place the 2 bars among these 12 positions.</p>

<div class="env-block theorem">
<strong>Stars and Bars</strong><br>
The number of ways to distribute \\(n\\) identical objects into \\(r\\) distinct bins is:
\\[
\\binom{n + r - 1}{r - 1} = \\binom{n + r - 1}{n}
\\]
</div>

<p>For our candy problem: \\(\\binom{10 + 3 - 1}{3 - 1} = \\binom{12}{2} = 66\\) ways.</p>

<div class="env-block example">
<strong>How many solutions does \\(x + y + z = 7\\) have in non-negative integers?</strong><br>
This is the same as distributing 7 identical units among 3 variables. By stars and bars: \\(\\binom{7 + 3 - 1}{3 - 1} = \\binom{9}{2} = 36\\).
</div>

<div class="env-block warning">
<strong>Identical vs Distinct</strong><br>
Stars and bars works when the objects being distributed are <em>identical</em> (like candies, coins, or abstract units). If the objects are distinct (like different books), you need a different technique (often powers or permutations).
</div>

<h3>With a minimum requirement</h3>

<p>What if each child must get at least 1 candy? Give each child 1 candy first (using up 3), then distribute the remaining \\(10 - 3 = 7\\) candies freely. Answer: \\(\\binom{7 + 3 - 1}{3 - 1} = \\binom{9}{2} = 36\\).</p>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'How many ways can you put 6 identical balls into 4 distinct boxes?',
                        hint: 'Stars and bars with \\(n = 6\\) objects and \\(r = 4\\) bins.',
                        solution: '\\(\\binom{6 + 4 - 1}{4 - 1} = \\binom{9}{3} = \\frac{9 \\times 8 \\times 7}{6} = 84\\).'
                    },
                    {
                        question: 'How many solutions does \\(a + b + c + d = 10\\) have in non-negative integers?',
                        hint: 'This is 10 identical objects into 4 bins.',
                        solution: '\\(\\binom{10 + 4 - 1}{4 - 1} = \\binom{13}{3} = \\frac{13 \\times 12 \\times 11}{6} = 286\\).'
                    },
                    {
                        question: 'Same as above, but each variable must be at least 2. How many solutions?',
                        hint: 'Set \\(a\' = a - 2\\), etc. Then \\(a\' + b\' + c\' + d\' = 10 - 8 = 2\\) in non-negative integers.',
                        solution: 'After substitution, we need non-negative solutions to \\(a\' + b\' + c\' + d\' = 2\\). That is \\(\\binom{2 + 4 - 1}{4 - 1} = \\binom{5}{3} = 10\\).'
                    }
                ]
            },

            // ============================================================
            // Section 5: Real-world Applications
            // ============================================================
            {
                id: 'applications',
                title: 'Real-world Applications',
                content: `
<h2>Combinations in Daily Life</h2>

<p>Combinations appear everywhere once you start looking.</p>

<h3>The lottery</h3>

<p>In a typical lottery, you pick 6 numbers from 1 to 49. Order does not matter. How many possible tickets are there?</p>
\\[
\\binom{49}{6} = \\frac{49 \\times 48 \\times 47 \\times 46 \\times 45 \\times 44}{6!} = 13{,}983{,}816
\\]
<p>Nearly 14 million possible combinations. That is why winning the lottery is so unlikely.</p>

<h3>Handshakes</h3>

<p>If 20 people are in a room and every pair shakes hands, the total number of handshakes is \\(\\binom{20}{2} = 190\\). Each handshake is an unordered pair of people.</p>

<h3>Forming words and codes</h3>

<div class="env-block example">
<strong>Choosing a password</strong><br>
A website requires a 4-character password using exactly 2 letters and 2 digits (positions matter for the password itself, but the <em>choice</em> of which 2 positions hold letters is a combination). There are \\(\\binom{4}{2} = 6\\) ways to choose which positions get letters. Then 26 choices for each letter and 10 for each digit: \\(6 \\times 26^2 \\times 10^2 = 405{,}600\\) passwords.
</div>

<h3>The binomial theorem</h3>

<p>Combinations appear in algebra through the <strong>Binomial Theorem</strong>:</p>
\\[
(a + b)^n = \\sum_{k=0}^{n} \\binom{n}{k} a^{n-k} b^k
\\]

<p>For instance, \\((a+b)^3 = a^3 + 3a^2b + 3ab^2 + b^3\\). The coefficients 1, 3, 3, 1 are row 3 of Pascal's Triangle.</p>

<div class="env-block intuition">
<strong>Why combinations in algebra?</strong><br>
When you expand \\((a + b)^n\\), you are choosing, from each of the \\(n\\) factors, either \\(a\\) or \\(b\\). To get the term \\(a^{n-k}b^k\\), you need to choose \\(k\\) of the \\(n\\) factors to contribute a \\(b\\). The number of ways to do this is \\(\\binom{n}{k}\\).
</div>

<h3>Sports brackets and schedules</h3>

<p>In a round-robin tournament with \\(n\\) teams, the number of games played is \\(\\binom{n}{2}\\). With 16 teams, that is \\(\\binom{16}{2} = 120\\) games. This is the same counting as the handshake problem.</p>

<div class="env-block remark">
<strong>Looking ahead</strong><br>
In the next chapter, we will learn Inclusion-Exclusion, a powerful technique for counting when some choices overlap or need to be excluded. Combinations are the building blocks for that method.
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'A basketball league has 12 teams. If every pair plays twice (home and away), how many total games are there?',
                        hint: 'First count unordered pairs, then multiply by 2 for home/away.',
                        solution: 'Unordered pairs: \\(\\binom{12}{2} = 66\\). Each pair plays twice: \\(66 \\times 2 = 132\\) games.'
                    },
                    {
                        question: 'Expand \\((x + y)^4\\) using the Binomial Theorem.',
                        hint: 'The coefficients are row 4 of Pascal\'s Triangle: 1, 4, 6, 4, 1.',
                        solution: '\\((x+y)^4 = x^4 + 4x^3y + 6x^2y^2 + 4xy^3 + y^4\\).'
                    },
                    {
                        question: 'A student must answer 5 out of 8 questions on an exam. How many ways can they choose which questions to answer?',
                        hint: 'Choosing 5 questions from 8, order does not matter.',
                        solution: '\\(\\binom{8}{5} = \\binom{8}{3} = \\frac{8 \\times 7 \\times 6}{6} = 56\\) ways.'
                    }
                ]
            }
        ]
    });
})();
