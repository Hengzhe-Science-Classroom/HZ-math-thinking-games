// === Chapter 7: Inclusion-Exclusion ===
(function () {
    window.CHAPTERS = window.CHAPTERS || [];

    function factorial(n) {
        if (n <= 1) return 1;
        var r = 1;
        for (var i = 2; i <= n; i++) r *= i;
        return r;
    }
    function subfactorial(n) {
        // !n = n! * sum_{i=0}^{n} (-1)^i / i!
        if (n === 0) return 1;
        if (n === 1) return 0;
        var result = 0;
        var nf = factorial(n);
        for (var i = 0; i <= n; i++) {
            result += (i % 2 === 0 ? 1 : -1) / factorial(i);
        }
        return Math.round(nf * result);
    }
    function gcd(a, b) { while (b) { var t = b; b = a % b; a = t; } return a; }

    window.CHAPTERS.push({
        id: 'ch07',
        number: 7,
        title: 'Inclusion-Exclusion',
        subtitle: 'The art of counting without counting anything twice',

        sections: [
            // ============================================================
            // Section 1: Don't double count!
            // ============================================================
            {
                id: 'dont-double-count',
                title: "Don\u2019t Double Count!",
                content: `
<h2>The Danger of Naive Addition</h2>

<p>Suppose your school has 30 students who play soccer, 25 who play basketball, and 10 who play both. How many students play at least one of the two sports?</p>

<p>A tempting (but wrong) answer: \\(30 + 25 = 55\\). The problem? Those 10 students who play both have been counted <em>twice</em>, once in the soccer group and once in the basketball group. The correct answer is:</p>
\\[
30 + 25 - 10 = 45
\\]

<p>This simple correction is the seed of a powerful idea.</p>

<div class="env-block definition">
<strong>The Inclusion-Exclusion Principle (two sets)</strong><br>
For two finite sets \\(A\\) and \\(B\\):
\\[
|A \\cup B| = |A| + |B| - |A \\cap B|
\\]
Add the individual sizes, then subtract the overlap.
</div>

<p>The name says it all: you <em>include</em> each set, then <em>exclude</em> the overlap you double-counted.</p>

<div class="env-block intuition">
<strong>Why subtract?</strong><br>
When you add \\(|A|\\) and \\(|B|\\), every element in the overlap \\(A \\cap B\\) gets counted twice. Subtracting \\(|A \\cap B|\\) brings each of those elements back down to being counted exactly once.
</div>

<h3>A counting perspective</h3>

<p>Think of it element by element. If an element is in \\(A\\) only, it gets counted once (from \\(|A|\\)). If it is in \\(B\\) only, it gets counted once (from \\(|B|\\)). If it is in both, it gets counted \\(1 + 1 - 1 = 1\\) time. Every element in \\(A \\cup B\\) is counted exactly once. That is the whole point.</p>

<div class="env-block example">
<strong>How many integers from 1 to 100 are divisible by 3 or by 5?</strong><br>
Divisible by 3: \\(\\lfloor 100/3 \\rfloor = 33\\). Divisible by 5: \\(\\lfloor 100/5 \\rfloor = 20\\). Divisible by both (i.e., by 15): \\(\\lfloor 100/15 \\rfloor = 6\\). Answer: \\(33 + 20 - 6 = 47\\).
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'In a class of 40 students, 22 study French, 18 study Spanish, and 8 study both. How many study at least one language?',
                        hint: 'Use \\(|A \\cup B| = |A| + |B| - |A \\cap B|\\).',
                        solution: '\\(22 + 18 - 8 = 32\\) students study at least one language.'
                    },
                    {
                        question: 'How many students study neither French nor Spanish?',
                        hint: 'Subtract those who study at least one from the total.',
                        solution: '\\(40 - 32 = 8\\) students study neither.'
                    }
                ]
            },

            // ============================================================
            // Section 2: Two sets — the Venn diagram
            // ============================================================
            {
                id: 'two-sets',
                title: 'Two Sets \u2014 the Venn Diagram',
                content: `
<h2>Seeing It Visually</h2>

<p>A Venn diagram makes the inclusion-exclusion formula visual. Two overlapping circles represent sets \\(A\\) and \\(B\\). The overlap region is \\(A \\cap B\\). Adjust the sizes and overlap in the interactive diagram below, and watch the formula update.</p>

<div class="viz-placeholder" data-viz="venn-two"></div>

<h3>The four regions</h3>

<p>Two overlapping sets create exactly four disjoint regions:</p>
<ol>
    <li><strong>Only A</strong>: elements in \\(A\\) but not \\(B\\). Size: \\(|A| - |A \\cap B|\\).</li>
    <li><strong>Only B</strong>: elements in \\(B\\) but not \\(A\\). Size: \\(|B| - |A \\cap B|\\).</li>
    <li><strong>Both</strong>: elements in \\(A \\cap B\\). Size: \\(|A \\cap B|\\).</li>
    <li><strong>Neither</strong>: elements in the universal set but not in \\(A\\) or \\(B\\).</li>
</ol>

<p>These four regions partition the entire universal set. If you know any three of the four sizes, you can deduce the fourth.</p>

<div class="env-block example">
<strong>Survey problem</strong><br>
A survey of 100 people finds 60 drink coffee, 40 drink tea, and 20 drink both. How many drink only coffee? Only tea? Neither?<br>
Only coffee: \\(60 - 20 = 40\\). Only tea: \\(40 - 20 = 20\\). Both: 20. Neither: \\(100 - (40 + 20 + 20) = 20\\).
</div>

<div class="env-block remark">
<strong>Complement counting</strong><br>
Sometimes it is easier to count what you do <em>not</em> want, then subtract from the total. The number of elements in neither \\(A\\) nor \\(B\\) is \\(|U| - |A \\cup B|\\), where \\(U\\) is the universal set.
</div>
`,
                visualizations: [
                    {
                        id: 'venn-two',
                        title: 'Interactive Two-Set Venn Diagram',
                        description: 'Adjust |A|, |B|, and the overlap. Watch the formula and region sizes update in real time.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 380, scale: 1, originX: 0, originY: 0 });
                            var sA = 30, sB = 25, sAB = 10;

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var cx = W / 2, cy = H / 2 - 10;
                                var rA = 100, rB = 90;
                                var sep = 70; // distance between centers

                                // Circle A
                                ctx.globalAlpha = 0.2;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(cx - sep / 2, cy, rA, 0, Math.PI * 2); ctx.fill();
                                // Circle B
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath(); ctx.arc(cx + sep / 2, cy, rB, 0, Math.PI * 2); ctx.fill();
                                ctx.globalAlpha = 1.0;

                                // Outlines
                                ctx.strokeStyle = viz.colors.blue; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(cx - sep / 2, cy, rA, 0, Math.PI * 2); ctx.stroke();
                                ctx.strokeStyle = viz.colors.orange; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.arc(cx + sep / 2, cy, rB, 0, Math.PI * 2); ctx.stroke();

                                // Labels
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

                                // Only A
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText(sA - sAB, cx - sep / 2 - 40, cy);

                                // Only B
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText(sB - sAB, cx + sep / 2 + 40, cy);

                                // Intersection
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText(sAB, cx, cy);

                                // Set labels
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText('A', cx - sep / 2, cy - rA - 14);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText('B', cx + sep / 2, cy - rB - 14);

                                // Formula at bottom
                                var union = sA + sB - sAB;
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.fillText('|A \u222a B| = |A| + |B| - |A \u2229 B|', cx, H - 50);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '14px -apple-system,sans-serif';
                                ctx.fillText(union + ' = ' + sA + ' + ' + sB + ' - ' + sAB, cx, H - 28);
                            }

                            VizEngine.createSlider(controls, '|A|', 0, 50, sA, 1, function (v) {
                                sA = Math.round(v);
                                sAB = Math.min(sAB, sA, sB);
                                draw();
                            });
                            VizEngine.createSlider(controls, '|B|', 0, 50, sB, 1, function (v) {
                                sB = Math.round(v);
                                sAB = Math.min(sAB, sA, sB);
                                draw();
                            });
                            VizEngine.createSlider(controls, '|A\u2229B|', 0, 50, sAB, 1, function (v) {
                                sAB = Math.min(Math.round(v), sA, sB);
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'In a group of 50 animals, 28 can swim, 35 can run, and 17 can do both. How many can do at least one? How many can do neither?',
                        hint: 'Apply the formula, then subtract from 50.',
                        solution: 'At least one: \\(28 + 35 - 17 = 46\\). Neither: \\(50 - 46 = 4\\).'
                    },
                    {
                        question: 'If \\(|A \\cup B| = 50\\), \\(|A| = 30\\), and \\(|B| = 35\\), what is \\(|A \\cap B|\\)?',
                        hint: 'Rearrange the formula: \\(|A \\cap B| = |A| + |B| - |A \\cup B|\\).',
                        solution: '\\(|A \\cap B| = 30 + 35 - 50 = 15\\).'
                    }
                ]
            },

            // ============================================================
            // Section 3: Three sets — getting tricky
            // ============================================================
            {
                id: 'three-sets',
                title: 'Three Sets \u2014 Getting Tricky',
                content: `
<h2>When Three Circles Overlap</h2>

<p>With three sets, the pattern of include/exclude extends beautifully. The formula alternates between adding and subtracting:</p>

<div class="env-block theorem">
<strong>Inclusion-Exclusion for Three Sets</strong><br>
\\[
|A \\cup B \\cup C| = |A| + |B| + |C| - |A \\cap B| - |A \\cap C| - |B \\cap C| + |A \\cap B \\cap C|
\\]
</div>

<h3>Why the \\(+|A \\cap B \\cap C|\\)?</h3>

<p>Let us track what happens to an element that is in all three sets:</p>
<ol>
    <li>Added three times (once from \\(|A|\\), \\(|B|\\), \\(|C|\\)).</li>
    <li>Subtracted three times (once from each pairwise intersection).</li>
    <li>Net count so far: \\(3 - 3 = 0\\). It has been completely eliminated!</li>
    <li>Add it back once from \\(|A \\cap B \\cap C|\\). Final count: 1. Correct.</li>
</ol>

<p>The pattern is: add singles, subtract pairs, add triples. For \\(n\\) sets, you would continue: subtract quadruples, add quintuples, and so on.</p>

<div class="viz-placeholder" data-viz="venn-three"></div>

<div class="env-block example">
<strong>Three-language survey</strong><br>
In a school: 50 study English, 40 study French, 30 study Spanish. 15 study English and French, 12 study English and Spanish, 10 study French and Spanish, and 5 study all three.<br>
How many study at least one language?<br>
\\(50 + 40 + 30 - 15 - 12 - 10 + 5 = 88\\).
</div>

<div class="env-block definition">
<strong>General Inclusion-Exclusion</strong><br>
For sets \\(A_1, A_2, \\ldots, A_n\\):
\\[
\\left|\\bigcup_{i=1}^{n} A_i\\right| = \\sum_{i} |A_i| - \\sum_{i \\lt j} |A_i \\cap A_j| + \\sum_{i \\lt j \\lt k} |A_i \\cap A_j \\cap A_k| - \\cdots + (-1)^{n+1}|A_1 \\cap \\cdots \\cap A_n|
\\]
The signs alternate: +, -, +, -, ...
</div>

<div class="env-block remark">
<strong>Counting terms</strong><br>
For \\(n\\) sets, the formula has \\(2^n - 1\\) terms (every non-empty subset of the \\(n\\) sets contributes one term). This grows fast, but many problems have structure that makes the computation manageable.
</div>
`,
                visualizations: [
                    {
                        id: 'venn-three',
                        title: 'Three-Set Venn Diagram',
                        description: 'Adjust the sizes of three sets and their pairwise/triple overlaps. The inclusion-exclusion formula updates live.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 420, scale: 1, originX: 0, originY: 0 });
                            var sA = 50, sB = 40, sC = 30;
                            var sAB = 15, sAC = 12, sBC = 10, sABC = 5;

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var cx = W / 2, cy = H / 2 - 30;
                                var R = 80;
                                // Three circle centers in a triangle arrangement
                                var ax = cx - 45, ay = cy - 20;
                                var bx = cx + 45, by = cy - 20;
                                var ccx = cx, ccy = cy + 40;

                                // Filled circles
                                ctx.globalAlpha = 0.15;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(ax, ay, R, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.orange;
                                ctx.beginPath(); ctx.arc(bx, by, R, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath(); ctx.arc(ccx, ccy, R, 0, Math.PI * 2); ctx.fill();
                                ctx.globalAlpha = 1.0;

                                // Outlines
                                ctx.lineWidth = 2;
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.beginPath(); ctx.arc(ax, ay, R, 0, Math.PI * 2); ctx.stroke();
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.beginPath(); ctx.arc(bx, by, R, 0, Math.PI * 2); ctx.stroke();
                                ctx.strokeStyle = viz.colors.green;
                                ctx.beginPath(); ctx.arc(ccx, ccy, R, 0, Math.PI * 2); ctx.stroke();

                                // Region labels
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

                                // Only A
                                var onlyA = sA - sAB - sAC + sABC;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText(Math.max(0, onlyA), ax - 35, ay - 20);

                                // Only B
                                var onlyB = sB - sAB - sBC + sABC;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText(Math.max(0, onlyB), bx + 35, by - 20);

                                // Only C
                                var onlyC = sC - sAC - sBC + sABC;
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText(Math.max(0, onlyC), ccx, ccy + 45);

                                // A&B only
                                ctx.fillStyle = viz.colors.purple;
                                ctx.fillText(Math.max(0, sAB - sABC), cx, ay - 30);

                                // A&C only
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText(Math.max(0, sAC - sABC), ax - 10, cy + 15);

                                // B&C only
                                ctx.fillStyle = viz.colors.pink;
                                ctx.fillText(Math.max(0, sBC - sABC), bx + 10, cy + 15);

                                // A&B&C
                                ctx.fillStyle = viz.colors.gold;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.fillText(sABC, cx, cy + 2);

                                // Set labels
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText('A', ax, ay - R - 12);
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText('B', bx, by - R - 12);
                                ctx.fillStyle = viz.colors.green;
                                ctx.fillText('C', ccx, ccy + R + 16);

                                // Formula
                                var union = sA + sB + sC - sAB - sAC - sBC + sABC;
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('|A\u222aB\u222aC| = |A|+|B|+|C| - |A\u2229B| - |A\u2229C| - |B\u2229C| + |A\u2229B\u2229C|', cx, H - 36);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText(union + ' = ' + sA + '+' + sB + '+' + sC + ' - ' + sAB + ' - ' + sAC + ' - ' + sBC + ' + ' + sABC, cx, H - 16);
                            }

                            VizEngine.createSlider(controls, '|A|', 0, 80, sA, 1, function (v) { sA = Math.round(v); draw(); });
                            VizEngine.createSlider(controls, '|B|', 0, 80, sB, 1, function (v) { sB = Math.round(v); draw(); });
                            VizEngine.createSlider(controls, '|C|', 0, 80, sC, 1, function (v) { sC = Math.round(v); draw(); });
                            VizEngine.createSlider(controls, '|A\u2229B|', 0, 40, sAB, 1, function (v) { sAB = Math.round(v); draw(); });
                            VizEngine.createSlider(controls, '|A\u2229C|', 0, 40, sAC, 1, function (v) { sAC = Math.round(v); draw(); });
                            VizEngine.createSlider(controls, '|B\u2229C|', 0, 40, sBC, 1, function (v) { sBC = Math.round(v); draw(); });
                            VizEngine.createSlider(controls, '|A\u2229B\u2229C|', 0, 20, sABC, 1, function (v) { sABC = Math.round(v); draw(); });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'How many integers from 1 to 100 are divisible by 2, 3, or 5?',
                        hint: 'Let \\(A\\) = multiples of 2, \\(B\\) = multiples of 3, \\(C\\) = multiples of 5. Compute \\(|A|\\), \\(|B|\\), \\(|C|\\), \\(|A \\cap B|\\) (multiples of 6), etc.',
                        solution: '\\(|A| = 50\\), \\(|B| = 33\\), \\(|C| = 20\\), \\(|A \\cap B| = 16\\), \\(|A \\cap C| = 10\\), \\(|B \\cap C| = 6\\), \\(|A \\cap B \\cap C| = 3\\). Answer: \\(50 + 33 + 20 - 16 - 10 - 6 + 3 = 74\\).'
                    },
                    {
                        question: 'Of those 100 integers, how many are divisible by <em>none</em> of 2, 3, or 5?',
                        hint: 'Subtract the answer above from 100.',
                        solution: '\\(100 - 74 = 26\\).'
                    }
                ]
            },

            // ============================================================
            // Section 4: Derangements — nothing in its place
            // ============================================================
            {
                id: 'derangements',
                title: 'Derangements \u2014 Nothing in Its Place',
                content: `
<h2>When Everything Moves</h2>

<p>A <em>derangement</em> is a permutation where no element stays in its original position. For instance, if you have three letters A, B, C in positions 1, 2, 3, the derangements are:</p>
<ul>
    <li>B, C, A (nothing in its original spot)</li>
    <li>C, A, B (nothing in its original spot)</li>
</ul>
<p>Arrangements like A, C, B are <em>not</em> derangements because A stayed in position 1.</p>

<div class="env-block definition">
<strong>Derangement / Subfactorial</strong><br>
The number of derangements of \\(n\\) elements is written \\(!n\\) (read "subfactorial n") or \\(D_n\\).
</div>

<h3>Counting derangements with inclusion-exclusion</h3>

<p>Let \\(A_i\\) be the set of permutations that fix element \\(i\\) (keep it in place). Then \\(|A_i| = (n-1)!\\), \\(|A_i \\cap A_j| = (n-2)!\\), and so on. The number of permutations that fix <em>at least one</em> element is:</p>
\\[
\\left|\\bigcup_{i=1}^n A_i\\right| = \\binom{n}{1}(n-1)! - \\binom{n}{2}(n-2)! + \\binom{n}{3}(n-3)! - \\cdots
\\]

<p>A derangement fixes <em>no</em> elements, so \\(!n = n! - \\left|\\bigcup A_i\\right|\\):</p>

<div class="env-block theorem">
<strong>Derangement Formula</strong><br>
\\[
!n = n! \\sum_{k=0}^{n} \\frac{(-1)^k}{k!} = n! \\left(1 - 1 + \\frac{1}{2!} - \\frac{1}{3!} + \\cdots + \\frac{(-1)^n}{n!}\\right)
\\]
</div>

<p>The first few values: \\(!1 = 0\\), \\(!2 = 1\\), \\(!3 = 2\\), \\(!4 = 9\\), \\(!5 = 44\\).</p>

<div class="env-block intuition">
<strong>The probability of a derangement</strong><br>
The ratio \\(!n / n!\\) approaches \\(1/e \\approx 0.3679\\) as \\(n\\) grows. So if you randomly shuffle a deck of cards, there is about a 37% chance that no card ends up in its original position. This is true whether \\(n = 10\\) or \\(n = 1000\\); the probability stabilizes almost immediately.
</div>

<p>Try the interactive shuffle below. The simulator shuffles cards and checks whether any card stayed in place.</p>

<div class="viz-placeholder" data-viz="derangement-counter"></div>
`,
                visualizations: [
                    {
                        id: 'derangement-counter',
                        title: 'Derangement Shuffle Simulator',
                        description: 'Shuffle n cards repeatedly. Track how often a derangement (no card in its original position) occurs. Compare to the theoretical probability 1/e.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 380, scale: 1, originX: 0, originY: 0 });
                            var n = 5;
                            var trials = 0, derangements = 0;
                            var currentPerm = [];
                            var cardColors = [viz.colors.blue, viz.colors.orange, viz.colors.teal,
                                              viz.colors.green, viz.colors.purple, viz.colors.pink,
                                              viz.colors.yellow, viz.colors.red, viz.colors.gold, viz.colors.white];

                            function initPerm() {
                                currentPerm = [];
                                for (var i = 0; i < n; i++) currentPerm.push(i);
                            }

                            function shuffle() {
                                var arr = [];
                                for (var i = 0; i < n; i++) arr.push(i);
                                for (var i = arr.length - 1; i > 0; i--) {
                                    var j = Math.floor(Math.random() * (i + 1));
                                    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
                                }
                                return arr;
                            }

                            function isDerangement(arr) {
                                for (var i = 0; i < arr.length; i++) {
                                    if (arr[i] === i) return false;
                                }
                                return true;
                            }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;

                                // Draw original positions (top row)
                                var spacing = Math.min(55, (W - 60) / n);
                                var startX = (W - (n - 1) * spacing) / 2;

                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text;
                                ctx.textAlign = 'center';
                                ctx.fillText('Original positions:', W / 2, 24);

                                for (var i = 0; i < n; i++) {
                                    var x = startX + i * spacing;
                                    ctx.fillStyle = cardColors[i % cardColors.length] + '44';
                                    ctx.fillRect(x - 18, 34, 36, 36);
                                    ctx.strokeStyle = cardColors[i % cardColors.length];
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(x - 18, 34, 36, 36);
                                    ctx.fillStyle = cardColors[i % cardColors.length];
                                    ctx.font = 'bold 16px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(i + 1, x, 52);
                                }

                                // Draw shuffled (bottom row)
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.text;
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText('After shuffle:', W / 2, 88);

                                var isDer = isDerangement(currentPerm);
                                for (var i = 0; i < n; i++) {
                                    var x = startX + i * spacing;
                                    var v = currentPerm[i];
                                    var fixed = (v === i);
                                    ctx.fillStyle = fixed ? viz.colors.red + '55' : cardColors[v % cardColors.length] + '44';
                                    ctx.fillRect(x - 18, 100, 36, 36);
                                    ctx.strokeStyle = fixed ? viz.colors.red : cardColors[v % cardColors.length];
                                    ctx.lineWidth = fixed ? 2.5 : 1;
                                    ctx.strokeRect(x - 18, 100, 36, 36);
                                    ctx.fillStyle = fixed ? viz.colors.red : cardColors[v % cardColors.length];
                                    ctx.font = 'bold 16px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(v + 1, x, 118);
                                }

                                // Result label
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                if (trials > 0) {
                                    ctx.fillStyle = isDer ? viz.colors.green : viz.colors.red;
                                    ctx.fillText(isDer ? 'DERANGEMENT!' : 'Not a derangement (red = fixed)', W / 2, 148);
                                }

                                // Stats
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                var y0 = 185;
                                ctx.fillText('Trials: ' + trials, 30, y0);
                                ctx.fillText('Derangements: ' + derangements, 30, y0 + 22);
                                var pct = trials > 0 ? (derangements / trials * 100).toFixed(1) : '0.0';
                                ctx.fillText('Observed rate: ' + pct + '%', 30, y0 + 44);

                                // Theoretical
                                var theoD = subfactorial(n);
                                var theoPct = (theoD / factorial(n) * 100).toFixed(1);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText('Theory: !' + n + ' = ' + theoD + ' out of ' + n + '! = ' + factorial(n), 30, y0 + 78);
                                ctx.fillText('Theoretical rate: ' + theoPct + '%  (1/e \u2248 36.8%)', 30, y0 + 100);

                                // Bar chart comparison
                                var barY = y0 + 130;
                                var barW = 300;
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText('Observed vs Theoretical:', 30, barY);

                                var obsW = trials > 0 ? (derangements / trials) * barW : 0;
                                var theoW = (theoD / factorial(n)) * barW;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillRect(30, barY + 18, obsW, 14);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillRect(30, barY + 36, theoW, 14);

                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText('Observed', barW + 40, barY + 28);
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText('Theory', barW + 40, barY + 46);
                            }

                            initPerm();

                            VizEngine.createSlider(controls, 'n', 2, 10, n, 1, function (v) {
                                n = Math.round(v);
                                trials = 0; derangements = 0;
                                initPerm();
                                draw();
                            });

                            VizEngine.createButton(controls, 'Shuffle', function () {
                                currentPerm = shuffle();
                                trials++;
                                if (isDerangement(currentPerm)) derangements++;
                                draw();
                            });

                            VizEngine.createButton(controls, 'Shuffle x100', function () {
                                for (var t = 0; t < 100; t++) {
                                    currentPerm = shuffle();
                                    trials++;
                                    if (isDerangement(currentPerm)) derangements++;
                                }
                                draw();
                            });

                            VizEngine.createButton(controls, 'Reset', function () {
                                trials = 0; derangements = 0;
                                initPerm();
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Compute \\(!4\\) by listing all derangements of {1, 2, 3, 4}.',
                        hint: 'A derangement must have: position 1 not holding 1, position 2 not holding 2, etc. Try systematically.',
                        solution: 'The 9 derangements of {1,2,3,4} are: (2,1,4,3), (2,3,4,1), (2,4,1,3), (3,1,4,2), (3,4,1,2), (3,4,2,1), (4,1,2,3), (4,3,1,2), (4,3,2,1). Wait, let us recount carefully. Actually \\(!4 = 4!(1 - 1 + 1/2 - 1/6 + 1/24) = 24 \\cdot (12/24 - 4/24 + 1/24) = 24 \\cdot 9/24 = 9\\). So there are 9 derangements.'
                    },
                    {
                        question: 'Five friends do a "Secret Santa" gift exchange where nobody should get their own name. How many valid assignments are there?',
                        hint: 'This is exactly \\(!5\\).',
                        solution: '\\(!5 = 5!(1 - 1 + 1/2 - 1/6 + 1/24 - 1/120) = 120 \\cdot (60 - 20 + 5 - 1)/120 = 44\\).'
                    }
                ]
            },

            // ============================================================
            // Section 5: Euler's totient (bonus)
            // ============================================================
            {
                id: 'euler-totient',
                title: "Euler\u2019s Totient (Bonus)",
                content: `
<h2>Counting Numbers That Share No Factors</h2>

<p>Here is a beautiful application of inclusion-exclusion from number theory. Given a positive integer \\(n\\), how many integers from 1 to \\(n\\) are <em>relatively prime</em> to \\(n\\) (share no common factor other than 1)?</p>

<div class="env-block definition">
<strong>Euler's Totient Function \\(\\varphi(n)\\)</strong><br>
\\(\\varphi(n)\\) counts how many integers from 1 to \\(n\\) are relatively prime to \\(n\\). For instance, \\(\\varphi(12) = 4\\) because 1, 5, 7, 11 are the only numbers from 1 to 12 that share no factor with 12.
</div>

<h3>Deriving the formula with inclusion-exclusion</h3>

<p>Suppose \\(n = p_1^{a_1} p_2^{a_2} \\cdots p_m^{a_m}\\) is the prime factorization. An integer from 1 to \\(n\\) is <em>not</em> relatively prime to \\(n\\) if it shares a factor \\(p_i\\) with \\(n\\). Let \\(A_i\\) be the set of multiples of \\(p_i\\) in \\(\\{1, \\ldots, n\\}\\). Then:</p>

<ul>
    <li>\\(|A_i| = n / p_i\\)</li>
    <li>\\(|A_i \\cap A_j| = n / (p_i p_j)\\)</li>
    <li>And so on for higher intersections.</li>
</ul>

<p>By inclusion-exclusion, the count of integers sharing at least one factor is \\(|A_1 \\cup \\cdots \\cup A_m|\\). Subtracting from \\(n\\):</p>

<div class="env-block theorem">
<strong>Euler's Totient Formula</strong><br>
\\[
\\varphi(n) = n \\prod_{p | n} \\left(1 - \\frac{1}{p}\\right)
\\]
where the product runs over all distinct prime factors \\(p\\) of \\(n\\).
</div>

<div class="env-block example">
<strong>Compute \\(\\varphi(30)\\)</strong><br>
\\(30 = 2 \\times 3 \\times 5\\). So \\(\\varphi(30) = 30 \\times (1 - 1/2)(1 - 1/3)(1 - 1/5) = 30 \\times \\frac{1}{2} \\times \\frac{2}{3} \\times \\frac{4}{5} = 8\\).
</div>

<h3>Why does this matter?</h3>

<p>Euler's totient appears in cryptography (RSA encryption relies on it), group theory (it gives the order of the multiplicative group mod \\(n\\)), and many competition problems. It is a perfect example of how inclusion-exclusion turns a complicated counting problem into an elegant formula.</p>

<div class="env-block remark">
<strong>Special cases</strong><br>
If \\(p\\) is prime, then \\(\\varphi(p) = p - 1\\) (every number from 1 to \\(p-1\\) is coprime to \\(p\\)). If \\(n = p^k\\) for a prime \\(p\\), then \\(\\varphi(p^k) = p^k - p^{k-1} = p^{k-1}(p-1)\\).
</div>

<div class="env-block intuition">
<strong>The product formula, unpacked</strong><br>
Each factor \\((1 - 1/p)\\) removes the fraction \\(1/p\\) of numbers divisible by \\(p\\). Multiplying these factors together accounts for all the overlaps (numbers divisible by multiple primes) automatically, thanks to inclusion-exclusion. The product form is equivalent to the sum form, just more compact.
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'Compute \\(\\varphi(12)\\) using the formula and verify by listing.',
                        hint: '\\(12 = 2^2 \\times 3\\). The prime factors are 2 and 3.',
                        solution: '\\(\\varphi(12) = 12 \\times (1 - 1/2)(1 - 1/3) = 12 \\times 1/2 \\times 2/3 = 4\\). The four coprime numbers are 1, 5, 7, 11.'
                    },
                    {
                        question: 'What is \\(\\varphi(100)\\)?',
                        hint: '\\(100 = 2^2 \\times 5^2\\). Prime factors are 2 and 5.',
                        solution: '\\(\\varphi(100) = 100 \\times (1 - 1/2)(1 - 1/5) = 100 \\times 1/2 \\times 4/5 = 40\\).'
                    },
                    {
                        question: 'Prove that if \\(p\\) and \\(q\\) are distinct primes, then \\(\\varphi(pq) = (p-1)(q-1)\\).',
                        hint: 'Use the product formula with two prime factors.',
                        solution: '\\(\\varphi(pq) = pq(1 - 1/p)(1 - 1/q) = pq \\cdot \\frac{p-1}{p} \\cdot \\frac{q-1}{q} = (p-1)(q-1)\\). This is the key fact behind RSA encryption!'
                    }
                ]
            }
        ]
    });
})();
