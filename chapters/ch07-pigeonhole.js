// === Chapter 7: The Pigeonhole Principle ===
(function () {
    window.CHAPTERS = window.CHAPTERS || [];

    window.CHAPTERS.push({
        id: 'ch07',
        number: 7,
        title: 'The Pigeonhole Principle',
        subtitle: 'If you have more pigeons than holes, some hole has two pigeons',

        sections: [
            // ============================================================
            // Section 1: Motivation
            // ============================================================
            {
                id: 'sec-motivation',
                title: 'Why the Obvious Can Be Powerful',
                content: `
<h2>A Statement So Simple It Sounds Silly</h2>

<p>Here is a statement that sounds almost too obvious to bother saying:</p>

<blockquote>
If you have 6 pigeons and only 5 pigeonholes, at least one hole must contain 2 or more pigeons.
</blockquote>

<p>Go ahead, roll your eyes. Why would anyone dignify this with a name and an entire chapter?</p>

<p>The answer is that this trivial-sounding observation is one of the most powerful weapons in a mathematician's toolkit. It gives us <em>existence proofs</em>: it tells us that something <strong>must</strong> happen, even when we have no idea where or when. The principle does not find the crowded pigeonhole for us; it simply guarantees that one exists.</p>

<div class="env-block intuition">
<strong>The art of the pigeonhole</strong><br>
The principle itself is trivial. The art lies in figuring out what the "pigeons" and "holes" should be in each problem. A clever choice of pigeons and holes can crack problems that seem to have nothing to do with birds or boxes.
</div>

<p>In this chapter, we will start with the basic idea, then see it applied to puzzles about socks, birthdays, and hair counts. By the end, you will have a new way of thinking about "guaranteed" outcomes.</p>

<div class="env-block remark">
<strong>Other names</strong><br>
The pigeonhole principle is also called the <em>Dirichlet box principle</em> (Schubfachprinzip), after the German mathematician Peter Gustav Lejeune Dirichlet (1805-1859), who used it extensively in number theory.
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'A classroom has 13 students. Without knowing their birthdays, can you guarantee that at least two students were born in the same month?',
                        hint: 'There are 12 months. How many "holes" is that?',
                        solution: 'Yes. There are 12 months (holes) and 13 students (pigeons). By the pigeonhole principle, at least one month contains 2 or more students.'
                    },
                    {
                        question: 'You have 5 pairs of shoes (10 shoes total, each pair a different color). If you grab shoes in the dark, what is the minimum number you must grab to guarantee a matching pair?',
                        hint: 'In the worst case, you could grab one shoe from each of the 5 colors before getting a match.',
                        solution: 'The "holes" are the 5 colors. In the worst case, the first 5 shoes are all different colors. The 6th shoe must match one of the existing colors. So you need \\(5 + 1 = 6\\) shoes.'
                    }
                ]
            },

            // ============================================================
            // Section 2: The Principle
            // ============================================================
            {
                id: 'sec-principle',
                title: 'The Principle',
                content: `
<h2>The Simple Version</h2>

<div class="env-block theorem">
<strong>The Pigeonhole Principle (Basic Form)</strong><br>
If \\(n + 1\\) or more objects are placed into \\(n\\) containers, then at least one container holds at least 2 objects.
</div>

<p>The proof is by contradiction. Suppose every container holds at most 1 object. Then the total number of objects is at most \\(n \\times 1 = n\\). But we have at least \\(n + 1\\) objects. Contradiction.</p>

<p>Try the interactive demo below: drag pigeons into holes, and see what happens when you run out of room.</p>

<div class="viz-placeholder" data-viz="viz-pigeonhole-demo"></div>

<h2>The Generalized Version</h2>

<p>What if we have many more pigeons than holes? We can say something stronger.</p>

<div class="env-block theorem">
<strong>Generalized Pigeonhole Principle</strong><br>
If \\(N\\) objects are placed into \\(k\\) containers, then at least one container holds at least \\(\\lceil N/k \\rceil\\) objects, where \\(\\lceil \\cdot \\rceil\\) is the ceiling function (round up).
</div>

<p>Again by contradiction: if every container held at most \\(\\lceil N/k \\rceil - 1\\) objects, then the total would be at most \\(k \\cdot (\\lceil N/k \\rceil - 1) < k \\cdot (N/k) = N\\). But we have \\(N\\) objects. Contradiction.</p>

<div class="env-block example">
<strong>Birthday months, upgraded</strong><br>
Among 100 people, at least \\(\\lceil 100/12 \\rceil = 9\\) share the same birth month. Not just 2, but at least 9!
</div>

<div class="viz-placeholder" data-viz="viz-generalized"></div>
`,
                visualizations: [
                    {
                        id: 'viz-pigeonhole-demo',
                        title: 'Pigeons into Holes',
                        description: 'Click "Add Pigeon" to randomly place a pigeon into a hole. When there are more pigeons than holes, the principle kicks in and at least one hole is highlighted.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 380, scale: 1, originX: 0, originY: 0 });
                            var numHoles = 5;
                            var holes = [];
                            var totalPigeons = 0;
                            var pigeonColors = [viz.colors.blue, viz.colors.orange, viz.colors.teal,
                                                viz.colors.green, viz.colors.purple, viz.colors.pink,
                                                viz.colors.yellow, viz.colors.red];

                            function resetHoles() {
                                holes = [];
                                for (var i = 0; i < numHoles; i++) holes.push([]);
                                totalPigeons = 0;
                            }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;

                                var spacing = Math.min(100, (W - 40) / numHoles);
                                var startX = (W - (numHoles - 1) * spacing) / 2;
                                var holeY = H - 80;
                                var holeW = spacing * 0.7;
                                var holeH = 50;

                                // Title
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(totalPigeons + ' pigeons, ' + numHoles + ' holes', W / 2, 24);

                                var maxInHole = 0;
                                for (var i = 0; i < holes.length; i++) {
                                    if (holes[i].length > maxInHole) maxInHole = holes[i].length;
                                }
                                var violated = totalPigeons > numHoles;

                                // Draw holes
                                for (var i = 0; i < numHoles; i++) {
                                    var hx = startX + i * spacing;
                                    var isOver = holes[i].length >= 2;

                                    ctx.fillStyle = isOver ? viz.colors.red + '33' : '#1a1a4066';
                                    ctx.fillRect(hx - holeW / 2, holeY - holeH, holeW, holeH);
                                    ctx.strokeStyle = isOver ? viz.colors.red : viz.colors.axis;
                                    ctx.lineWidth = isOver ? 2.5 : 1;
                                    ctx.strokeRect(hx - holeW / 2, holeY - holeH, holeW, holeH);

                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText('Hole ' + (i + 1), hx, holeY + 4);

                                    var pigeonR = 10;
                                    for (var j = 0; j < holes[i].length; j++) {
                                        var py = holeY - holeH + 14 + j * 22;
                                        var pIdx = holes[i][j];
                                        ctx.fillStyle = pigeonColors[pIdx % pigeonColors.length];
                                        ctx.beginPath(); ctx.arc(hx, Math.min(py, holeY - 14), pigeonR, 0, Math.PI * 2); ctx.fill();
                                        ctx.fillStyle = '#000';
                                        ctx.font = 'bold 9px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(pIdx + 1, hx, Math.min(py, holeY - 14));
                                    }
                                }

                                if (violated) {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText('Pigeonhole principle triggered! At least one hole has 2+ pigeons.', W / 2, 50);
                                } else if (totalPigeons > 0) {
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText('Each hole has at most 1 pigeon so far. Keep adding!', W / 2, 50);
                                }

                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Max in any hole: ' + maxInHole, W / 2, 74);
                            }

                            resetHoles();

                            VizEngine.createSlider(controls, 'Holes', 2, 10, numHoles, 1, function (v) {
                                numHoles = Math.round(v);
                                resetHoles();
                                draw();
                            });

                            VizEngine.createButton(controls, 'Add Pigeon', function () {
                                if (totalPigeons >= numHoles * 4) return;
                                var target = Math.floor(Math.random() * numHoles);
                                holes[target].push(totalPigeons);
                                totalPigeons++;
                                draw();
                            });

                            VizEngine.createButton(controls, 'Fill n+1', function () {
                                resetHoles();
                                for (var p = 0; p <= numHoles; p++) {
                                    var target = Math.floor(Math.random() * numHoles);
                                    holes[target].push(p);
                                    totalPigeons++;
                                }
                                draw();
                            });

                            VizEngine.createButton(controls, 'Reset', function () {
                                resetHoles();
                                draw();
                            });

                            draw();
                        }
                    },
                    {
                        id: 'viz-generalized',
                        title: 'Generalized Pigeonhole',
                        description: 'Place N objects into k boxes. The generalized principle guarantees at least ceil(N/k) in some box. Adjust N and k to explore.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 380, scale: 1, originX: 0, originY: 0 });
                            var N = 10;
                            var k = 3;

                            function ceilDiv(a, b) { return Math.ceil(a / b); }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var guaranteed = ceilDiv(N, k);

                                // Place N objects randomly into k boxes
                                var boxes = [];
                                for (var i = 0; i < k; i++) boxes.push(0);
                                for (var i = 0; i < N; i++) {
                                    boxes[Math.floor(Math.random() * k)]++;
                                }

                                // Title
                                viz.screenText(N + ' objects into ' + k + ' boxes', W / 2, 22, viz.colors.white, 14);
                                viz.screenText('Guaranteed: at least ceil(' + N + '/' + k + ') = ' + guaranteed + ' in some box', W / 2, 44, viz.colors.teal, 12);

                                // Draw boxes as bar chart
                                var barMaxH = H - 120;
                                var barW = Math.min(60, (W - 80) / k - 8);
                                var barY0 = H - 60;
                                var maxCount = Math.max(guaranteed, Math.max.apply(null, boxes));
                                var boxColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange,
                                                 viz.colors.green, viz.colors.purple, viz.colors.pink,
                                                 viz.colors.yellow, viz.colors.red];

                                for (var i = 0; i < k; i++) {
                                    var bx = (W - k * (barW + 8)) / 2 + i * (barW + 8) + barW / 2;
                                    var bh = maxCount > 0 ? (boxes[i] / maxCount) * barMaxH : 0;
                                    var isMax = boxes[i] >= guaranteed;

                                    ctx.fillStyle = isMax ? boxColors[i % boxColors.length] : boxColors[i % boxColors.length] + '66';
                                    ctx.fillRect(bx - barW / 2, barY0 - bh, barW, bh);

                                    if (isMax) {
                                        ctx.strokeStyle = viz.colors.red;
                                        ctx.lineWidth = 2;
                                        ctx.strokeRect(bx - barW / 2, barY0 - bh, barW, bh);
                                    }

                                    // Count label
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
                                    ctx.fillText(boxes[i], bx, barY0 - bh - 4);

                                    // Box label
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText('Box ' + (i + 1), bx, barY0 + 4);
                                }

                                // Guaranteed threshold line
                                if (maxCount > 0) {
                                    var threshY = barY0 - (guaranteed / maxCount) * barMaxH;
                                    ctx.strokeStyle = viz.colors.red + '88';
                                    ctx.lineWidth = 1.5;
                                    ctx.setLineDash([6, 4]);
                                    ctx.beginPath();
                                    ctx.moveTo(30, threshY);
                                    ctx.lineTo(W - 30, threshY);
                                    ctx.stroke();
                                    ctx.setLineDash([]);
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText('threshold = ' + guaranteed, W - 120, threshY);
                                }
                            }

                            VizEngine.createSlider(controls, 'N (objects)', 1, 40, N, 1, function (v) {
                                N = Math.round(v);
                                draw();
                            });

                            VizEngine.createSlider(controls, 'k (boxes)', 1, 12, k, 1, function (v) {
                                k = Math.max(1, Math.round(v));
                                draw();
                            });

                            VizEngine.createButton(controls, 'Redistribute', function () {
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Among 100 people, at least how many must share the same birth month?',
                        hint: 'Apply the generalized pigeonhole principle with 100 people and 12 months.',
                        solution: 'By the generalized pigeonhole principle, at least \\(\\lceil 100/12 \\rceil = 9\\) people share the same birth month.'
                    },
                    {
                        question: 'A bag has red, blue, green, and yellow marbles (many of each). How many must you draw to guarantee 3 of the same color?',
                        hint: 'You want at least 3 in one "hole." What is the worst case before that happens?',
                        solution: 'In the worst case, you draw 2 of each color (8 marbles) before getting a 3rd of any color. So you need \\(2 \\times 4 + 1 = 9\\) marbles. Equivalently, \\(\\lceil N/4 \\rceil \\geq 3\\) requires \\(N \\geq 9\\).'
                    }
                ]
            },

            // ============================================================
            // Section 3: Socks in the Dark
            // ============================================================
            {
                id: 'sec-socks',
                title: 'Socks in the Dark',
                content: `
<h2>The Classic Sock Puzzle</h2>

<p>This is the most famous pigeonhole puzzle, and it captures the essence of the principle perfectly.</p>

<div class="env-block example">
<strong>The Puzzle</strong><br>
A drawer contains 10 red socks and 10 blue socks, all mixed together. The room is completely dark, so you cannot see which sock you are pulling out. What is the minimum number of socks you must pull to <em>guarantee</em> a matching pair (two socks of the same color)?
</div>

<p>Think about it before reading on. The word "guarantee" is crucial. It means we need to account for the <em>worst case</em>.</p>

<h3>The Solution</h3>

<p>The "pigeons" are the socks you pull, and the "holes" are the colors (2 colors: red and blue). By the pigeonhole principle, pulling \\(2 + 1 = 3\\) socks guarantees at least two of the same color.</p>

<p>Why 3 and not 2? Because in the worst case, your first 2 socks could be one red and one blue. But the 3rd sock <em>must</em> match one of the two you already have.</p>

<div class="viz-placeholder" data-viz="viz-socks-puzzle"></div>

<h3>Variations</h3>

<div class="env-block example">
<strong>Three colors</strong><br>
If the drawer also contains 10 green socks (3 colors total), you need \\(3 + 1 = 4\\) socks to guarantee a matching pair. The worst case is pulling one of each color before the 4th forces a match.
</div>

<div class="env-block example">
<strong>Matching triple</strong><br>
With 2 colors, how many socks guarantee 3 of the same color? Worst case: 2 red, 2 blue (4 socks). The 5th must make a triple. So: \\(2 \\times 2 + 1 = 5\\).
</div>

<div class="env-block remark">
<strong>The general pattern</strong><br>
To guarantee \\(m\\) objects of the same type when there are \\(c\\) types: you need \\((m - 1) \\times c + 1\\) objects. This is the generalized pigeonhole principle in action.
</div>
`,
                visualizations: [
                    {
                        id: 'viz-socks-puzzle',
                        title: 'Socks in the Dark',
                        description: 'Pull socks from the drawer. Watch the sock counts by color. A match is guaranteed after pulling more socks than colors.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 380, scale: 1, originX: 0, originY: 0 });
                            var numColors = 2;
                            var pulled = [];
                            var colorNames = ['Red', 'Blue', 'Green', 'Yellow', 'Purple'];
                            var colorHexes = [viz.colors.red, viz.colors.blue, viz.colors.green, viz.colors.yellow, viz.colors.purple];
                            var matchFound = false;
                            var matchColor = -1;

                            function reset() {
                                pulled = [];
                                matchFound = false;
                                matchColor = -1;
                            }

                            function pullSock() {
                                if (matchFound) return;
                                var color = Math.floor(Math.random() * numColors);
                                pulled.push(color);
                                // Check for match
                                var counts = {};
                                for (var i = 0; i < pulled.length; i++) {
                                    counts[pulled[i]] = (counts[pulled[i]] || 0) + 1;
                                    if (counts[pulled[i]] >= 2 && !matchFound) {
                                        matchFound = true;
                                        matchColor = pulled[i];
                                    }
                                }
                            }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;

                                // Title
                                viz.screenText('Socks in the Dark', W / 2, 22, viz.colors.white, 16);
                                viz.screenText(numColors + ' colors, need ' + (numColors + 1) + ' socks to guarantee a match', W / 2, 44, viz.colors.text, 11);

                                // Drawer area
                                ctx.fillStyle = '#1a1a40';
                                ctx.fillRect(30, 60, 200, 140);
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(30, 60, 200, 140);
                                viz.screenText('DRAWER', 130, 75, viz.colors.text, 11);
                                // Draw some socks in the drawer
                                for (var s = 0; s < 12; s++) {
                                    var sx = 50 + (s % 4) * 45;
                                    var sy = 100 + Math.floor(s / 4) * 30;
                                    ctx.fillStyle = colorHexes[s % numColors] + '55';
                                    ctx.beginPath();
                                    ctx.ellipse(sx, sy, 14, 8, 0, 0, Math.PI * 2);
                                    ctx.fill();
                                }

                                // Pulled socks
                                viz.screenText('Pulled: ' + pulled.length + ' socks', 430, 70, viz.colors.white, 13);

                                var sockSize = 18;
                                var cols = 6;
                                for (var i = 0; i < pulled.length; i++) {
                                    var col = i % cols;
                                    var row = Math.floor(i / cols);
                                    var px = 300 + col * 44;
                                    var py = 100 + row * 40;
                                    ctx.fillStyle = colorHexes[pulled[i]];
                                    ctx.beginPath();
                                    ctx.ellipse(px, py, sockSize, sockSize * 0.6, 0, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = '#000';
                                    ctx.font = 'bold 10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(i + 1, px, py);
                                }

                                // Count display
                                var countY = 230;
                                viz.screenText('Counts by color:', W / 2, countY, viz.colors.text, 12);
                                var counts = new Array(numColors).fill(0);
                                for (var i = 0; i < pulled.length; i++) counts[pulled[i]]++;

                                for (var c = 0; c < numColors; c++) {
                                    var cx2 = W / 2 - (numColors - 1) * 60 / 2 + c * 60;
                                    ctx.fillStyle = colorHexes[c];
                                    ctx.beginPath();
                                    ctx.arc(cx2, countY + 24, 10, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(counts[c], cx2, countY + 46);
                                }

                                // Match message
                                if (matchFound) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 15px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Match found! Two ' + colorNames[matchColor] + ' socks after ' + pulled.length + ' pulls.', W / 2, H - 50);
                                } else if (pulled.length > 0) {
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('No match yet. Keep pulling!', W / 2, H - 50);
                                }

                                // Footer
                                viz.screenText('Worst case: ' + (numColors + 1) + ' pulls', W / 2, H - 22, viz.colors.text, 11);
                            }

                            VizEngine.createSlider(controls, 'Colors', 2, 5, numColors, 1, function (v) {
                                numColors = Math.round(v);
                                reset();
                                draw();
                            });

                            VizEngine.createButton(controls, 'Pull Sock', function () {
                                pullSock();
                                draw();
                            });

                            VizEngine.createButton(controls, 'Auto-Pull', function () {
                                reset();
                                var step = function () {
                                    if (matchFound) { draw(); return; }
                                    pullSock();
                                    draw();
                                    if (!matchFound) setTimeout(step, 400);
                                };
                                step();
                            });

                            VizEngine.createButton(controls, 'Reset', function () {
                                reset();
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'A drawer has 8 red socks, 6 blue socks, and 4 green socks. How many must you pull in the dark to guarantee a matching pair?',
                        hint: 'The number of each color does not matter. What matters is the number of colors.',
                        solution: 'There are 3 colors. Worst case: you pull one of each color (3 socks) with no match. The 4th sock must match. Answer: \\(3 + 1 = 4\\).'
                    },
                    {
                        question: 'Same drawer (red, blue, green socks). How many socks must you pull to guarantee that you have at least one red sock?',
                        hint: 'The pigeonhole principle is not the right tool here. Think about worst case: what if you keep pulling non-red socks?',
                        solution: 'This is NOT a pigeonhole problem. Worst case: you pull all 6 blue and all 4 green socks (10 socks) before touching a red one. The 11th sock must be red. Answer: \\(6 + 4 + 1 = 11\\).'
                    }
                ]
            },

            // ============================================================
            // Section 4: The Birthday Paradox
            // ============================================================
            {
                id: 'sec-birthday',
                title: 'The Birthday Paradox',
                content: `
<h2>When Probability Meets Pigeonholes</h2>

<p>The pigeonhole principle tells us a <em>certainty</em>: with 367 people, two must share a birthday (since there are at most 366 possible birthdays). But probability kicks in much earlier.</p>

<div class="env-block theorem">
<strong>The Birthday Problem</strong><br>
With just 23 people in a room, the probability that at least two share a birthday exceeds 50%.
</div>

<p>This result surprises nearly everyone. Most people guess you would need about 183 people (half of 365). The number 23 feels absurdly low.</p>

<h3>The Calculation</h3>

<p>It is easier to compute the probability that all birthdays are <em>different</em>, then subtract from 1. For \\(n\\) people with 365 possible birthdays:</p>

\\[
P(\\text{all different}) = \\frac{365}{365} \\cdot \\frac{364}{365} \\cdot \\frac{363}{365} \\cdots \\frac{365 - n + 1}{365}
\\]

<p>For \\(n = 23\\): \\(P(\\text{all different}) \\approx 0.4927\\), so \\(P(\\text{match}) \\approx 0.5073 > 50\\%\\).</p>

<div class="env-block intuition">
<strong>Why so few?</strong><br>
The key insight: we are not asking if someone shares <em>your</em> birthday (that needs about 253 people for 50%). We are asking if <em>any</em> two people share a birthday. With 23 people, there are \\(\\binom{23}{2} = 253\\) pairs to check. Each pair has a small chance of matching, but 253 small chances add up fast.
</div>

<p>Watch the birthday paradox unfold in the simulator below. Add people one at a time and track the probability.</p>

<div class="viz-placeholder" data-viz="viz-birthday-simulator"></div>

<h3>Beyond birthdays</h3>

<p>The birthday paradox appears everywhere:</p>
<ul>
    <li><strong>Computer science:</strong> hash collisions. A 128-bit hash needs only about \\(2^{64}\\) inputs before a collision is likely.</li>
    <li><strong>Cryptography:</strong> "birthday attacks" exploit this to find collisions in cryptographic hash functions.</li>
    <li><strong>DNA profiling:</strong> with millions of profiles in a database, chance matches become surprisingly likely.</li>
</ul>
`,
                visualizations: [
                    {
                        id: 'viz-birthday-simulator',
                        title: 'Birthday Paradox Simulator',
                        description: 'Add random people and watch how quickly a birthday collision occurs. The probability curve shows the theoretical chance of a match.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 420, scale: 1, originX: 0, originY: 0 });
                            var people = [];
                            var collision = -1;
                            var dayCount = new Array(365);
                            var monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
                            var monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];

                            function reset() {
                                people = [];
                                collision = -1;
                                for (var i = 0; i < 365; i++) dayCount[i] = 0;
                            }

                            function addPerson() {
                                var day = Math.floor(Math.random() * 365);
                                people.push(day);
                                dayCount[day]++;
                                if (dayCount[day] >= 2 && collision < 0) collision = day;
                            }

                            function dayToLabel(d) {
                                var m = 0, cum = 0;
                                for (m = 0; m < 12; m++) {
                                    if (d < cum + monthDays[m]) break;
                                    cum += monthDays[m];
                                }
                                return monthNames[m] + ' ' + (d - cum + 1);
                            }

                            function theoreticalProb(n) {
                                if (n <= 1) return 0;
                                var p = 1;
                                for (var i = 0; i < n; i++) p *= (365 - i) / 365;
                                return 1 - p;
                            }

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var n = people.length;

                                // Title
                                viz.screenText(n + ' people in the room', W / 2, 22, viz.colors.white, 14);

                                // Collision info
                                if (collision >= 0) {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Collision! Two people born on ' + dayToLabel(collision), W / 2, 44);
                                }

                                // Monthly histogram
                                var monthCounts = new Array(12).fill(0);
                                for (var i = 0; i < n; i++) {
                                    var d = people[i], cum = 0, m = 0;
                                    for (m = 0; m < 12; m++) {
                                        if (d < cum + monthDays[m]) break;
                                        cum += monthDays[m];
                                    }
                                    monthCounts[m]++;
                                }
                                var maxMonth = Math.max(1, Math.max.apply(null, monthCounts));
                                var barW = (W - 80) / 12;
                                var barMaxH = 100;
                                var barY0 = 170;

                                for (var m = 0; m < 12; m++) {
                                    var bx = 40 + m * barW;
                                    var bh = monthCounts[m] / maxMonth * barMaxH;
                                    ctx.fillStyle = monthCounts[m] > 0 ? viz.colors.blue : '#1a1a40';
                                    ctx.fillRect(bx + 2, barY0 - bh, barW - 4, bh);
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '9px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(monthNames[m], bx + barW / 2, barY0 + 12);
                                    if (monthCounts[m] > 0) {
                                        ctx.fillStyle = viz.colors.white;
                                        ctx.fillText(monthCounts[m], bx + barW / 2, barY0 - bh - 6);
                                    }
                                }

                                // Probability info
                                var y0 = 200;
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                var tp = (theoreticalProb(n) * 100).toFixed(1);
                                ctx.fillText('P(match) with ' + n + ' people: ' + tp + '%', 30, y0);

                                // Probability curve
                                var curveY0 = y0 + 25;
                                var curveH = 110;
                                var curveW = W - 60;
                                ctx.strokeStyle = viz.colors.axis;
                                ctx.lineWidth = 1;
                                ctx.beginPath(); ctx.moveTo(30, curveY0); ctx.lineTo(30, curveY0 + curveH); ctx.lineTo(30 + curveW, curveY0 + curveH); ctx.stroke();

                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                for (var x = 0; x <= 70; x++) {
                                    var px = 30 + (x / 70) * curveW;
                                    var py = curveY0 + curveH - theoreticalProb(x) * curveH;
                                    if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
                                }
                                ctx.stroke();

                                // 50% line
                                ctx.strokeStyle = viz.colors.orange + '66';
                                ctx.lineWidth = 1;
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath();
                                ctx.moveTo(30, curveY0 + curveH * 0.5);
                                ctx.lineTo(30 + curveW, curveY0 + curveH * 0.5);
                                ctx.stroke();
                                ctx.setLineDash([]);

                                // 23 line
                                var x23 = 30 + (23 / 70) * curveW;
                                ctx.strokeStyle = viz.colors.orange + '44';
                                ctx.setLineDash([4, 4]);
                                ctx.beginPath(); ctx.moveTo(x23, curveY0); ctx.lineTo(x23, curveY0 + curveH); ctx.stroke();
                                ctx.setLineDash([]);

                                // Current marker
                                if (n > 0 && n <= 70) {
                                    var mkx = 30 + (n / 70) * curveW;
                                    var mky = curveY0 + curveH - theoreticalProb(n) * curveH;
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.beginPath(); ctx.arc(mkx, mky, 5, 0, Math.PI * 2); ctx.fill();
                                }

                                // Axis labels
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('0', 30, curveY0 + curveH + 12);
                                ctx.fillText('23', x23, curveY0 + curveH + 12);
                                ctx.fillText('50', 30 + (50 / 70) * curveW, curveY0 + curveH + 12);
                                ctx.fillText('70', 30 + curveW, curveY0 + curveH + 12);
                                ctx.fillText('People', 30 + curveW / 2, curveY0 + curveH + 24);
                                ctx.textAlign = 'right';
                                ctx.fillText('50%', 26, curveY0 + curveH * 0.5 + 3);
                                ctx.fillText('100%', 26, curveY0 + 3);
                            }

                            reset();

                            VizEngine.createButton(controls, 'Add 1', function () {
                                addPerson(); draw();
                            });
                            VizEngine.createButton(controls, 'Add 10', function () {
                                for (var i = 0; i < 10; i++) addPerson();
                                draw();
                            });
                            VizEngine.createButton(controls, 'Fill to 23', function () {
                                while (people.length < 23) addPerson();
                                draw();
                            });
                            VizEngine.createButton(controls, 'Reset', function () {
                                reset(); draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'How many people do you need in a room to guarantee with 100% certainty that two share a birthday?',
                        hint: 'This is a pigeonhole question, not a probability question. How many possible birthdays are there (including Feb 29)?',
                        solution: '367 people (since there are 366 possible birthdays including Feb 29). By the pigeonhole principle, the 367th person must share a birthday with someone.'
                    },
                    {
                        question: 'In a group of 50 people, what is the approximate probability that at least two share a birthday? (Use a calculator or the formula.)',
                        hint: 'Compute \\(P(\\text{all different}) = \\prod_{i=0}^{49} \\frac{365-i}{365}\\) and subtract from 1.',
                        solution: '\\(P(\\text{match}) = 1 - \\frac{365!/(365-50)!}{365^{50}} \\approx 0.970\\). With 50 people, there is about a 97% chance of a shared birthday.'
                    }
                ]
            },

            // ============================================================
            // Section 5: Harder Applications
            // ============================================================
            {
                id: 'sec-harder',
                title: 'Harder Applications',
                content: `
<h2>Hair Counting and Other Surprises</h2>

<p>The pigeonhole principle really shines when the "pigeons" and "holes" are cleverly chosen. Here are some striking applications.</p>

<h3>Two Londoners with the same number of hairs</h3>

<div class="env-block example">
<strong>The Hair-Counting Problem</strong><br>
The human head has at most about 150,000 hairs. London has roughly 9 million people. Therefore, at least two people in London have <em>exactly</em> the same number of hairs on their head.
</div>

<p>The pigeons are people (about 9,000,000). The holes are possible hair counts (0 to 150,000, so about 150,001 values). Since \\(9{,}000{,}000 \\gg 150{,}001\\), the pigeonhole principle guarantees many collisions. In fact, by the generalized version, at least \\(\\lceil 9{,}000{,}000 / 150{,}001 \\rceil = 60\\) people share the same hair count!</p>

<div class="viz-placeholder" data-viz="viz-hair-counting"></div>

<h3>The handshake theorem</h3>

<div class="env-block theorem">
<strong>Handshake Theorem</strong><br>
At any party of \\(n \\geq 2\\) people, at least two people have shaken the same number of hands.
</div>

<p>Each person could have shaken 0, 1, 2, ..., or \\(n-1\\) hands. That is \\(n\\) possible values. But if someone shook 0 hands (knows nobody), then nobody could have shaken \\(n-1\\) hands (knows everybody). So there are at most \\(n-1\\) actually achievable values. With \\(n\\) people and at most \\(n-1\\) values, the pigeonhole principle forces a repeat.</p>

<h3>Consecutive sums divisible by n</h3>

<div class="env-block theorem">
<strong>Divisibility Theorem</strong><br>
Given any \\(n\\) integers \\(a_1, a_2, \\ldots, a_n\\), there exists a consecutive block \\(a_{i+1} + a_{i+2} + \\cdots + a_j\\) whose sum is divisible by \\(n\\).
</div>

<p>Consider the partial sums \\(S_0 = 0, S_1 = a_1, S_2 = a_1 + a_2, \\ldots, S_n = a_1 + \\cdots + a_n\\). That is \\(n+1\\) values. Their remainders modulo \\(n\\) can be \\(0, 1, \\ldots, n-1\\) (only \\(n\\) possibilities). If any \\(S_k \\equiv 0 \\pmod{n}\\), we are done. Otherwise, \\(n+1\\) values with \\(n\\) possible remainders: two must match, say \\(S_i \\equiv S_j \\pmod{n}\\). Then \\(S_j - S_i\\) is divisible by \\(n\\).</p>

<div class="env-block remark">
<strong>The pattern</strong><br>
In each application, the key step is the same: choose your pigeons and holes cleverly, then let the principle deliver the conclusion. The creativity is in the setup.
</div>
`,
                visualizations: [
                    {
                        id: 'viz-hair-counting',
                        title: 'Hair Counting in London',
                        description: 'Compare the population of a city to the maximum number of hairs on a human head. The pigeonhole principle guarantees many people share the same hair count.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 380, scale: 1, originX: 0, originY: 0 });
                            var population = 9000000;
                            var maxHairs = 150000;

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var guaranteed = Math.ceil(population / (maxHairs + 1));

                                // Title
                                viz.screenText('The Hair-Counting Argument', W / 2, 22, viz.colors.white, 15);

                                // Population box (left)
                                var boxW = 220, boxH = 160;
                                var lx = 40, ly = 60;
                                ctx.fillStyle = viz.colors.blue + '22';
                                ctx.fillRect(lx, ly, boxW, boxH);
                                ctx.strokeStyle = viz.colors.blue;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(lx, ly, boxW, boxH);

                                viz.screenText('PIGEONS', lx + boxW / 2, ly + 20, viz.colors.blue, 12);
                                viz.screenText('People in city', lx + boxW / 2, ly + 42, viz.colors.text, 11);
                                viz.screenText(population.toLocaleString(), lx + boxW / 2, ly + 70, viz.colors.white, 22);

                                // Draw little people icons
                                for (var i = 0; i < 30; i++) {
                                    var px = lx + 20 + (i % 10) * 20;
                                    var py = ly + 95 + Math.floor(i / 10) * 20;
                                    ctx.fillStyle = viz.colors.blue + '88';
                                    ctx.beginPath(); ctx.arc(px, py - 4, 3, 0, Math.PI * 2); ctx.fill();
                                    ctx.fillRect(px - 2, py, 4, 8);
                                }

                                // Hair count box (right)
                                var rx = 360;
                                ctx.fillStyle = viz.colors.orange + '22';
                                ctx.fillRect(rx, ly, boxW, boxH);
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(rx, ly, boxW, boxH);

                                viz.screenText('HOLES', rx + boxW / 2, ly + 20, viz.colors.orange, 12);
                                viz.screenText('Possible hair counts', rx + boxW / 2, ly + 42, viz.colors.text, 11);
                                viz.screenText((maxHairs + 1).toLocaleString(), rx + boxW / 2, ly + 70, viz.colors.white, 22);
                                viz.screenText('(0 to ' + maxHairs.toLocaleString() + ')', rx + boxW / 2, ly + 95, viz.colors.text, 10);

                                // Arrow
                                var arrowY = ly + boxH / 2;
                                ctx.strokeStyle = viz.colors.teal;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.moveTo(lx + boxW + 10, arrowY);
                                ctx.lineTo(rx - 10, arrowY);
                                ctx.stroke();
                                // Arrowhead
                                ctx.fillStyle = viz.colors.teal;
                                ctx.beginPath();
                                ctx.moveTo(rx - 10, arrowY);
                                ctx.lineTo(rx - 20, arrowY - 6);
                                ctx.lineTo(rx - 20, arrowY + 6);
                                ctx.closePath();
                                ctx.fill();

                                // Ratio
                                var ratio = (population / (maxHairs + 1)).toFixed(0);
                                viz.screenText(ratio + 'x more pigeons!', W / 2, arrowY - 16, viz.colors.teal, 11);

                                // Result
                                var ry = ly + boxH + 30;
                                ctx.fillStyle = viz.colors.green + '22';
                                ctx.fillRect(40, ry, W - 80, 70);
                                ctx.strokeStyle = viz.colors.green;
                                ctx.lineWidth = 2;
                                ctx.strokeRect(40, ry, W - 80, 70);

                                viz.screenText('By the Generalized Pigeonhole Principle:', W / 2, ry + 20, viz.colors.text, 12);
                                viz.screenText('At least ' + guaranteed + ' people share the EXACT same hair count!', W / 2, ry + 46, viz.colors.green, 14);
                            }

                            VizEngine.createSlider(controls, 'Population (millions)', 0.1, 20, population / 1000000, 0.1, function (v) {
                                population = Math.round(v * 1000000);
                                draw();
                            });

                            VizEngine.createSlider(controls, 'Max hairs (thousands)', 50, 300, maxHairs / 1000, 10, function (v) {
                                maxHairs = Math.round(v * 1000);
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'A chess player plays at least 1 game per day for 77 days but no more than 132 games total. Prove there is a consecutive stretch of days where they played exactly 21 games.',
                        hint: 'Let \\(a_i\\) be total games through day \\(i\\). Consider the 154 numbers: \\(a_1, \\ldots, a_{77}\\) and \\(a_1 + 21, \\ldots, a_{77} + 21\\). They all lie in \\(\\{1, \\ldots, 153\\}\\).',
                        solution: 'The values \\(a_1, \\ldots, a_{77}\\) range from 1 to 132. The values \\(a_1 + 21, \\ldots, a_{77} + 21\\) range from 22 to 153. All 154 numbers lie in \\(\\{1, \\ldots, 153\\}\\). By pigeonhole, two are equal. Since \\(a_i\\) is strictly increasing, the equal pair must be \\(a_j = a_i + 21\\) for some \\(i < j\\), meaning days \\(i+1\\) through \\(j\\) total exactly 21 games.'
                    },
                    {
                        question: 'Five points are placed inside a \\(2 \\times 2\\) square. Prove that two of them are within distance \\(\\sqrt{2}\\) of each other.',
                        hint: 'Divide the square into four \\(1 \\times 1\\) sub-squares.',
                        solution: 'Divide the \\(2 \\times 2\\) square into four \\(1 \\times 1\\) sub-squares. By pigeonhole, at least 2 of the 5 points land in the same sub-square. The maximum distance in a \\(1 \\times 1\\) square is its diagonal: \\(\\sqrt{1^2 + 1^2} = \\sqrt{2}\\). So two points are within distance \\(\\sqrt{2}\\).'
                    }
                ]
            },

            // ============================================================
            // Section 6: Bridge to Next Chapter
            // ============================================================
            {
                id: 'sec-bridge',
                title: 'Puzzles and Connections',
                content: `
<h2>Pigeonhole Puzzle Gallery</h2>

<p>The pigeonhole principle is a bridge between simple counting and deeper mathematics. Here is a gallery of puzzles that showcase its range.</p>

<div class="viz-placeholder" data-viz="viz-puzzle-gallery"></div>

<h3>Connection to Ramsey Theory</h3>

<p>The pigeonhole principle is the simplest case of a much deeper phenomenon: <strong>complete disorder is impossible</strong>. This idea is the foundation of Ramsey theory.</p>

<div class="env-block theorem">
<strong>Ramsey's Theorem (Party Version)</strong><br>
Among any 6 people at a party, either 3 are mutual friends or 3 are mutual strangers. No matter how the friendships are arranged, one of these must hold.
</div>

<p>The proof uses pigeonhole twice:</p>
<ol>
    <li>Pick any person A. They have 5 relationships. By pigeonhole (5 relationships, 2 types), at least 3 are the same type. Say A is friends with B, C, D.</li>
    <li>If any pair among {B, C, D} are friends, they form a friends-triangle with A. If no pair are friends, then B, C, D are mutual strangers.</li>
</ol>

<p>Either way, we get a monochromatic trio. The minimum number (6) is called the Ramsey number \\(R(3,3)\\).</p>

<div class="env-block remark">
<strong>Looking ahead</strong><br>
The pigeonhole principle proves that certain things <em>must exist</em> without telling us where to find them. In the next chapters, we will explore patterns, sequences, and structures where this kind of existence reasoning becomes even more powerful.
</div>
`,
                visualizations: [
                    {
                        id: 'viz-puzzle-gallery',
                        title: 'Pigeonhole Puzzle Gallery',
                        description: 'Five classic pigeonhole puzzles. Click through them, think about the answer, then reveal the solution.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { width: 620, height: 400, scale: 1, originX: 0, originY: 0 });
                            var puzzleIdx = 0;
                            var showSolution = false;

                            var puzzles = [
                                {
                                    title: 'Puzzle 1: Integers and Divisibility',
                                    statement: 'Among any 6 integers, prove that two of them have a difference divisible by 5.',
                                    pigeons: 'The 6 integers',
                                    holes: 'Remainders mod 5: {0, 1, 2, 3, 4} (5 holes)',
                                    solution: '6 integers into 5 remainder classes: two share a remainder, so their difference is divisible by 5.'
                                },
                                {
                                    title: 'Puzzle 2: Points on a Circle',
                                    statement: 'Place 5 points on a circle. Prove that at least one semicircle contains 3 or more points.',
                                    pigeons: 'The 5 points',
                                    holes: 'Two semicircles defined by the first point',
                                    solution: 'Fix one point. It divides the circle into two semicircles. The other 4 points go into 2 halves: by pigeonhole, one half has >= 2, so that semicircle has >= 3 (including the fixed point).'
                                },
                                {
                                    title: 'Puzzle 3: Subset Sum',
                                    statement: 'Given 10 distinct integers between 1 and 100, prove that two disjoint subsets have the same sum.',
                                    pigeons: 'All 2^10 = 1024 subsets',
                                    holes: 'Possible sums (max sum = 91+92+...+100 = 955, so at most 955 values)',
                                    solution: '1024 subsets but at most 955 possible sums. Two subsets share a sum. Remove common elements to get two disjoint subsets with equal sums.'
                                },
                                {
                                    title: 'Puzzle 4: Coloring a Grid',
                                    statement: 'Color each cell of a 3x3 grid either red or blue. Prove that there exists a rectangle whose 4 corners are all the same color.',
                                    pigeons: 'The 3 rows, each a pattern of 3 colors',
                                    holes: 'Only C(3,2)=3 ways to pick which 2 of the 3 columns are the same color in a row',
                                    solution: 'Each row has 3 cells in 2 colors, so some 2 cells match. There are only C(3,2)=3 column pairs. With 3 rows, two rows match the same pair, forming a monochromatic rectangle.'
                                },
                                {
                                    title: 'Puzzle 5: Arithmetic Progressions',
                                    statement: 'Choose 5 numbers from {1,2,...,8}. Prove your selection contains a 3-term arithmetic progression.',
                                    pigeons: 'The 5 chosen numbers',
                                    holes: 'Sets that avoid 3-term APs in {1,...,8}',
                                    solution: 'The maximum size of an AP-free subset of {1,...,8} is 4 (e.g., {1,2,5,6}). Any set of 5 elements must contain a 3-term AP. (Check: no matter how you pick 5 from 8, an AP of length 3 appears.)'
                                }
                            ];

                            function draw() {
                                viz.clear();
                                var ctx = viz.ctx;
                                var W = viz.width, H = viz.height;
                                var p = puzzles[puzzleIdx];

                                // Puzzle number indicator
                                for (var i = 0; i < puzzles.length; i++) {
                                    var dx = W / 2 + (i - 2) * 30;
                                    ctx.fillStyle = i === puzzleIdx ? viz.colors.teal : viz.colors.axis;
                                    ctx.beginPath(); ctx.arc(dx, 18, 8, 0, Math.PI * 2); ctx.fill();
                                    ctx.fillStyle = i === puzzleIdx ? '#000' : viz.colors.text;
                                    ctx.font = 'bold 10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(i + 1, dx, 18);
                                }

                                // Title
                                viz.screenText(p.title, W / 2, 48, viz.colors.white, 15);

                                // Statement
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                // Word wrap statement
                                var words = p.statement.split(' ');
                                var lines = [];
                                var line = '';
                                var maxLineW = W - 80;
                                for (var w = 0; w < words.length; w++) {
                                    var testLine = line + (line ? ' ' : '') + words[w];
                                    if (ctx.measureText(testLine).width > maxLineW && line) {
                                        lines.push(line);
                                        line = words[w];
                                    } else {
                                        line = testLine;
                                    }
                                }
                                if (line) lines.push(line);

                                for (var l = 0; l < lines.length; l++) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.fillText(lines[l], W / 2, 80 + l * 18);
                                }

                                var nextY = 80 + lines.length * 18 + 20;

                                if (showSolution) {
                                    // Pigeons box
                                    ctx.fillStyle = viz.colors.blue + '22';
                                    ctx.fillRect(30, nextY, 260, 50);
                                    ctx.strokeStyle = viz.colors.blue;
                                    ctx.lineWidth = 1.5;
                                    ctx.strokeRect(30, nextY, 260, 50);
                                    viz.screenText('Pigeons:', 160, nextY + 15, viz.colors.blue, 11);
                                    // Word-wrap pigeons text
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.fillText(p.pigeons, 160, nextY + 35);

                                    // Holes box
                                    ctx.fillStyle = viz.colors.orange + '22';
                                    ctx.fillRect(310, nextY, 280, 50);
                                    ctx.strokeStyle = viz.colors.orange;
                                    ctx.lineWidth = 1.5;
                                    ctx.strokeRect(310, nextY, 280, 50);
                                    viz.screenText('Holes:', 450, nextY + 15, viz.colors.orange, 11);
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillStyle = viz.colors.text;
                                    // Truncate if too long
                                    var holeText = p.holes;
                                    if (ctx.measureText(holeText).width > 260) {
                                        while (ctx.measureText(holeText + '...').width > 260 && holeText.length > 10) {
                                            holeText = holeText.slice(0, -1);
                                        }
                                        holeText += '...';
                                    }
                                    ctx.fillText(holeText, 450, nextY + 35);

                                    // Solution
                                    var solY = nextY + 70;
                                    ctx.fillStyle = viz.colors.green + '22';
                                    ctx.fillRect(30, solY, W - 60, 60);
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 1.5;
                                    ctx.strokeRect(30, solY, W - 60, 60);
                                    viz.screenText('Solution', W / 2, solY + 14, viz.colors.green, 12);

                                    // Word wrap solution
                                    var sWords = p.solution.split(' ');
                                    var sLines = [];
                                    var sLine = '';
                                    for (var sw = 0; sw < sWords.length; sw++) {
                                        var sTestLine = sLine + (sLine ? ' ' : '') + sWords[sw];
                                        if (ctx.measureText(sTestLine).width > W - 100 && sLine) {
                                            sLines.push(sLine);
                                            sLine = sWords[sw];
                                        } else {
                                            sLine = sTestLine;
                                        }
                                    }
                                    if (sLine) sLines.push(sLine);
                                    ctx.font = '11px -apple-system,sans-serif';
                                    for (var sl = 0; sl < Math.min(sLines.length, 2); sl++) {
                                        ctx.fillStyle = viz.colors.text;
                                        ctx.fillText(sLines[sl], W / 2, solY + 32 + sl * 14);
                                    }
                                } else {
                                    viz.screenText('Click "Show Solution" to reveal the pigeonhole argument', W / 2, nextY + 40, viz.colors.text, 12);
                                }

                                // Navigation info
                                viz.screenText('Puzzle ' + (puzzleIdx + 1) + ' of ' + puzzles.length, W / 2, H - 14, viz.colors.text, 10);
                            }

                            VizEngine.createButton(controls, 'Previous', function () {
                                puzzleIdx = (puzzleIdx - 1 + puzzles.length) % puzzles.length;
                                showSolution = false;
                                draw();
                            });

                            VizEngine.createButton(controls, 'Next', function () {
                                puzzleIdx = (puzzleIdx + 1) % puzzles.length;
                                showSolution = false;
                                draw();
                            });

                            VizEngine.createButton(controls, 'Show Solution', function () {
                                showSolution = !showSolution;
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Show that with 5 people, it IS possible that there is no trio of mutual friends and no trio of mutual strangers (so \\(R(3,3) > 5\\)).',
                        hint: 'Arrange 5 people in a circle. Make each person friends with their 2 neighbors and strangers with the 2 non-neighbors.',
                        solution: 'Place A, B, C, D, E in a circle. Make friendships: A-B, B-C, C-D, D-E, E-A (neighbors). Strangers: A-C, A-D, B-D, B-E, C-E. Check: every trio has at least one friend pair and one stranger pair, so no monochromatic triangle exists. This proves \\(R(3,3) > 5\\).'
                    },
                    {
                        question: 'Among any 10 integers, prove that some non-empty subset has a sum divisible by 10.',
                        hint: 'Consider partial sums \\(S_1, S_2, \\ldots, S_{10}\\) modulo 10.',
                        solution: 'If any \\(S_k \\equiv 0 \\pmod{10}\\), the subset \\(\\{a_1, \\ldots, a_k\\}\\) works. Otherwise, 10 values in \\(\\{1, \\ldots, 9\\}\\) (9 bins), so two match: \\(S_i \\equiv S_j \\pmod{10}\\) with \\(i < j\\). Then \\(a_{i+1} + \\cdots + a_j\\) is divisible by 10.'
                    }
                ]
            }
        ]
    });
})();
