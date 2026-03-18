// === Chapter 4: Addition & Multiplication Principles ===
(function () {
    window.CHAPTERS = window.CHAPTERS || [];

    window.CHAPTERS.push({
        id: 'ch04',
        number: 4,
        title: 'Addition & Multiplication Principles',
        subtitle: 'The two fundamental rules that make counting possible',
        file: 'ch04-counting-principles',

        sections: [
            // ============================================================
            // Section 1: Counting paths
            // ============================================================
            {
                id: 'counting-paths',
                title: 'Counting Paths',
                content: `
<h2>How Many Ways?</h2>

<p>"How many ways can I ...?" is one of the most fundamental questions in mathematics. How many ways can you get from home to school? How many outfits can you make from your wardrobe? How many different pizzas can you order? The branch of mathematics that answers these questions is called <strong>combinatorics</strong>, and its two most basic tools are strikingly simple.</p>

<p>Before we state the rules, let us start with a concrete puzzle.</p>

<div class="env-block example">
<strong>The grid puzzle.</strong> You stand at the bottom-left corner of a 3-by-3 grid. You want to reach the top-right corner. At each step, you may move one unit right or one unit up. How many different paths are there?
</div>

<p>Try to count them by tracing routes on the grid below. Each path consists of exactly 3 moves right (R) and 3 moves up (U), in some order. For instance, RRRUUU goes all the way right then all the way up, while RURURU alternates.</p>

<div class="viz-placeholder" data-viz="viz-grid-paths"></div>

<p>The answer is 20 paths. We will learn the formula for this later (it involves combinations). For now, notice that counting even a simple problem can be surprisingly tricky. That is why we need systematic rules.</p>

<h3>The counting mindset</h3>

<p>Every counting problem boils down to one question: <em>how do I break this into simpler pieces?</em> The two principles we are about to learn tell you how to combine those pieces back together. They are the addition and multiplication of counting.</p>

<div class="env-block intuition">
<strong>Two questions, two rules.</strong> When combining smaller counts into a bigger count, ask yourself:
<ul>
<li>Am I choosing between alternatives? (Use addition.)</li>
<li>Am I making a sequence of independent choices? (Use multiplication.)</li>
</ul>
</div>
`,
                visualizations: [
                    {
                        id: 'viz-grid-paths',
                        title: 'Grid Path Counter',
                        description: 'Click on grid intersections to build a path from bottom-left to top-right. You can only move right or up. Press "Show All Paths" to see them animated.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var gridN = 3;
                            var cellSize = Math.min((w - 120) / gridN, (h - 100) / gridN);
                            var offsetX = (w - gridN * cellSize) / 2;
                            var offsetY = (h - gridN * cellSize) / 2 + 10;

                            var userPath = [{ x: 0, y: 0 }];
                            var allPaths = [];
                            var showingAll = false;
                            var animIdx = 0;
                            var animTimer = null;

                            function gridToScreen(gx, gy) {
                                return {
                                    sx: offsetX + gx * cellSize,
                                    sy: offsetY + (gridN - gy) * cellSize
                                };
                            }

                            function generatePaths(n) {
                                // Generate all paths on n x n grid
                                var paths = [];
                                function dfs(x, y, path) {
                                    if (x === n && y === n) { paths.push(path.slice()); return; }
                                    if (x < n) { path.push({ x: x + 1, y: y }); dfs(x + 1, y, path); path.pop(); }
                                    if (y < n) { path.push({ x: x, y: y + 1 }); dfs(x, y + 1, path); path.pop(); }
                                }
                                dfs(0, 0, [{ x: 0, y: 0 }]);
                                return paths;
                            }

                            allPaths = generatePaths(gridN);

                            function draw() {
                                viz.clear();

                                // Draw grid
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 1;
                                for (var i = 0; i <= gridN; i++) {
                                    var startH = gridToScreen(0, i);
                                    var endH = gridToScreen(gridN, i);
                                    ctx.beginPath(); ctx.moveTo(startH.sx, startH.sy); ctx.lineTo(endH.sx, endH.sy); ctx.stroke();
                                    var startV = gridToScreen(i, 0);
                                    var endV = gridToScreen(i, gridN);
                                    ctx.beginPath(); ctx.moveTo(startV.sx, startV.sy); ctx.lineTo(endV.sx, endV.sy); ctx.stroke();
                                }

                                // Grid points
                                for (var gx = 0; gx <= gridN; gx++) {
                                    for (var gy = 0; gy <= gridN; gy++) {
                                        var p = gridToScreen(gx, gy);
                                        ctx.fillStyle = viz.colors.text;
                                        ctx.beginPath();
                                        ctx.arc(p.sx, p.sy, 3, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }

                                // Start / end labels
                                var startP = gridToScreen(0, 0);
                                var endP = gridToScreen(gridN, gridN);
                                ctx.fillStyle = viz.colors.green;
                                ctx.beginPath(); ctx.arc(startP.sx, startP.sy, 7, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('S', startP.sx, startP.sy + 3);

                                ctx.fillStyle = viz.colors.red;
                                ctx.beginPath(); ctx.arc(endP.sx, endP.sy, 7, 0, Math.PI * 2); ctx.fill();
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('E', endP.sx, endP.sy + 3);

                                // Show all-paths animation
                                if (showingAll && animIdx < allPaths.length) {
                                    // Draw faded previous paths
                                    for (var pi = 0; pi < animIdx; pi++) {
                                        drawPath(allPaths[pi], viz.colors.blue + '18', 1);
                                    }
                                    // Current path highlighted
                                    drawPath(allPaths[animIdx], viz.colors.orange, 2.5);

                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Path ' + (animIdx + 1) + ' of ' + allPaths.length, w / 2, 22);

                                    // Show path as string
                                    var pathStr = pathToString(allPaths[animIdx]);
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = '12px monospace';
                                    ctx.fillText(pathStr, w / 2, h - 14);
                                } else if (showingAll) {
                                    // All paths done
                                    for (var pj = 0; pj < allPaths.length; pj++) {
                                        var hue = (pj / allPaths.length) * 300;
                                        drawPath(allPaths[pj], VizEngine.hsl(hue, 70, 55) + '44', 1.5);
                                    }
                                    ctx.fillStyle = viz.colors.gold;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('All ' + allPaths.length + ' paths!', w / 2, 22);
                                } else {
                                    // Draw user path
                                    if (userPath.length > 1) {
                                        drawPath(userPath, viz.colors.teal, 3);
                                    }
                                    // Highlight clickable next points
                                    var last = userPath[userPath.length - 1];
                                    if (last.x < gridN) {
                                        var nr = gridToScreen(last.x + 1, last.y);
                                        ctx.strokeStyle = viz.colors.teal + '66';
                                        ctx.lineWidth = 2;
                                        ctx.beginPath(); ctx.arc(nr.sx, nr.sy, 8, 0, Math.PI * 2); ctx.stroke();
                                    }
                                    if (last.y < gridN) {
                                        var nu = gridToScreen(last.x, last.y + 1);
                                        ctx.strokeStyle = viz.colors.teal + '66';
                                        ctx.lineWidth = 2;
                                        ctx.beginPath(); ctx.arc(nu.sx, nu.sy, 8, 0, Math.PI * 2); ctx.stroke();
                                    }

                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    if (last.x === gridN && last.y === gridN) {
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.font = 'bold 13px -apple-system,sans-serif';
                                        ctx.fillText('Path complete! ' + pathToString(userPath), w / 2, 22);
                                    } else {
                                        ctx.fillText('Click a highlighted point to extend your path (R = right, U = up)', w / 2, 22);
                                    }

                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Total paths on ' + gridN + '\u00D7' + gridN + ' grid: ' + allPaths.length, w / 2, h - 14);
                                }
                            }

                            function drawPath(path, color, lw) {
                                ctx.strokeStyle = color;
                                ctx.lineWidth = lw;
                                ctx.beginPath();
                                for (var i = 0; i < path.length; i++) {
                                    var pt = gridToScreen(path[i].x, path[i].y);
                                    if (i === 0) ctx.moveTo(pt.sx, pt.sy);
                                    else ctx.lineTo(pt.sx, pt.sy);
                                }
                                ctx.stroke();
                            }

                            function pathToString(path) {
                                var s = '';
                                for (var i = 1; i < path.length; i++) {
                                    if (path[i].x > path[i - 1].x) s += 'R';
                                    else s += 'U';
                                }
                                return s;
                            }

                            viz.canvas.addEventListener('click', function (e) {
                                if (showingAll) return;
                                var rect = viz.canvas.getBoundingClientRect();
                                var mx = e.clientX - rect.left;
                                var my = e.clientY - rect.top;
                                var last = userPath[userPath.length - 1];

                                // Check right neighbor
                                if (last.x < gridN) {
                                    var nr = gridToScreen(last.x + 1, last.y);
                                    if (Math.sqrt((mx - nr.sx) ** 2 + (my - nr.sy) ** 2) < 16) {
                                        userPath.push({ x: last.x + 1, y: last.y });
                                        draw();
                                        return;
                                    }
                                }
                                // Check up neighbor
                                if (last.y < gridN) {
                                    var nu = gridToScreen(last.x, last.y + 1);
                                    if (Math.sqrt((mx - nu.sx) ** 2 + (my - nu.sy) ** 2) < 16) {
                                        userPath.push({ x: last.x, y: last.y + 1 });
                                        draw();
                                        return;
                                    }
                                }
                            });

                            VizEngine.createButton(controls, 'Reset Path', function () {
                                showingAll = false;
                                if (animTimer) { clearInterval(animTimer); animTimer = null; }
                                userPath = [{ x: 0, y: 0 }];
                                draw();
                            });

                            VizEngine.createButton(controls, 'Show All Paths', function () {
                                showingAll = true;
                                animIdx = 0;
                                if (animTimer) clearInterval(animTimer);
                                animTimer = setInterval(function () {
                                    animIdx++;
                                    draw();
                                    if (animIdx >= allPaths.length) {
                                        clearInterval(animTimer);
                                        animTimer = null;
                                    }
                                }, 180);
                                draw();
                            });

                            VizEngine.createSlider(controls, 'Grid size', 2, 4, 3, 1, function (val) {
                                gridN = Math.round(val);
                                cellSize = Math.min((w - 120) / gridN, (h - 100) / gridN);
                                offsetX = (w - gridN * cellSize) / 2;
                                offsetY = (h - gridN * cellSize) / 2 + 10;
                                allPaths = generatePaths(gridN);
                                userPath = [{ x: 0, y: 0 }];
                                showingAll = false;
                                if (animTimer) { clearInterval(animTimer); animTimer = null; }
                                draw();
                            });

                            draw();
                            return { stopAnimation: function () { if (animTimer) { clearInterval(animTimer); animTimer = null; } } };
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'On a 2-by-2 grid (moving only right or up), how many paths are there from the bottom-left to the top-right corner?',
                        hint: 'Each path consists of 2 R moves and 2 U moves. List all orderings: RRUU, RURU, ...',
                        solution: 'The paths are: RRUU, RURU, RUUR, URRU, URUR, UURR. That is 6 paths. (This equals \\(\\binom{4}{2} = 6\\), as we will learn in the Combinations chapter.)'
                    },
                    {
                        question: 'How many paths on a 4-by-4 grid? Can you see a pattern between grid size and path count?',
                        hint: 'For an \\(n \\times n\\) grid, each path has \\(n\\) R moves and \\(n\\) U moves. The answer is \\(\\binom{2n}{n}\\).',
                        solution: '\\(\\binom{8}{4} = 70\\) paths. The pattern: 2-by-2 has \\(\\binom{4}{2} = 6\\), 3-by-3 has \\(\\binom{6}{3} = 20\\), 4-by-4 has \\(\\binom{8}{4} = 70\\). In general, \\(n \\times n\\) gives \\(\\binom{2n}{n}\\).'
                    }
                ]
            },

            // ============================================================
            // Section 2: The Addition Principle
            // ============================================================
            {
                id: 'addition-principle',
                title: 'The Addition Principle',
                content: `
<h2>OR Means Add</h2>

<p>The simplest counting principle is also the most intuitive:</p>

<div class="env-block definition">
<strong>The Addition Principle (Rule of Sum).</strong> If task A can be done in \\(m\\) ways and task B can be done in \\(n\\) ways, and the two tasks cannot be done at the same time (they are mutually exclusive), then there are \\(m + n\\) ways to do "A or B."
</div>

<p>The keyword is <strong>OR</strong>. When you choose between alternatives, you add.</p>

<div class="env-block example">
<strong>Example 1.</strong> A restaurant offers 5 pasta dishes and 8 rice dishes. If you order one main course, how many choices do you have?<br>
Answer: \\(5 + 8 = 13\\). You are choosing pasta OR rice, so you add.
</div>

<div class="env-block example">
<strong>Example 2.</strong> A class has 12 boys and 15 girls. How many ways can you choose one class representative?<br>
Answer: \\(12 + 15 = 27\\). The representative is a boy OR a girl.
</div>

<div class="env-block example">
<strong>Example 3.</strong> How many two-digit numbers are divisible by 3 or by 5?<br>
Be careful! Some numbers (like 15, 30, 45, ...) are divisible by both 3 and 5. We cannot just add the two counts; we would be double-counting. The correct count requires the <strong>Inclusion-Exclusion Principle</strong>, which we will study in Chapter 7.
</div>

<div class="env-block warning">
<strong>The critical condition: mutual exclusivity.</strong> The Addition Principle requires that the two tasks have no overlap. If some outcomes belong to both A and B, naive addition double-counts them. Always check: "Can both A and B happen at the same time?" If yes, you need Inclusion-Exclusion.
</div>

<h3>Extending to more than two tasks</h3>

<p>If tasks \\(A_1, A_2, \\ldots, A_k\\) are all mutually exclusive and have \\(n_1, n_2, \\ldots, n_k\\) outcomes respectively, then the total number of ways to do "one of the tasks" is:</p>

\\[
n_1 + n_2 + \\cdots + n_k
\\]

<p>This is just repeated application of the Addition Principle, and it works as long as no outcome belongs to two or more of the tasks.</p>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'A store sells 6 flavors of ice cream in cones and 4 flavors in cups. If you buy one item, how many choices do you have?',
                        hint: 'Are the flavors the same in cones and cups? If the problem means 6 cone options and 4 cup options with no overlap, add them.',
                        solution: 'If the options are mutually exclusive (cone or cup, not both), the answer is \\(6 + 4 = 10\\) choices.'
                    },
                    {
                        question: 'A library has 20 fiction books and 15 nonfiction books. But 3 books are classified as both fiction and nonfiction. How many books does the library have in total?',
                        hint: 'This is NOT a straightforward addition because of the overlap.',
                        solution: 'By Inclusion-Exclusion: \\(20 + 15 - 3 = 32\\) books. (We subtract the 3 that were counted in both categories.)'
                    }
                ]
            },

            // ============================================================
            // Section 3: The Multiplication Principle
            // ============================================================
            {
                id: 'multiplication-principle',
                title: 'The Multiplication Principle',
                content: `
<h2>AND Means Multiply</h2>

<p>The second principle is equally simple and even more powerful:</p>

<div class="env-block definition">
<strong>The Multiplication Principle (Rule of Product).</strong> If task A can be done in \\(m\\) ways and, for each way of doing A, task B can be done in \\(n\\) ways, then the sequence "A then B" can be done in \\(m \\times n\\) ways.
</div>

<p>The keyword is <strong>AND</strong>. When you make a sequence of independent choices, you multiply.</p>

<div class="env-block example">
<strong>Example 1: Outfits.</strong> You have 4 shirts and 3 pants. How many outfits (shirt AND pants) can you make?<br>
Answer: \\(4 \\times 3 = 12\\). For each of the 4 shirt choices, you have 3 pants choices.
</div>

<div class="env-block example">
<strong>Example 2: License plates.</strong> A license plate has 2 letters followed by 4 digits. How many different plates are possible?<br>
Answer: \\(26 \\times 26 \\times 10 \\times 10 \\times 10 \\times 10 = 26^2 \\times 10^4 = 6{,}760{,}000\\). Each position is an independent choice.
</div>

<div class="env-block example">
<strong>Example 3: Routes.</strong> There are 3 roads from City A to City B, and 4 roads from City B to City C. How many routes go from A to C through B?<br>
Answer: \\(3 \\times 4 = 12\\). You choose a road A-to-B AND a road B-to-C.
</div>

<h3>The key condition: independence</h3>

<p>The Multiplication Principle requires that the number of ways to do task B does not depend on which way you chose for task A. If it does depend, you must be more careful (though a generalized version still works by summing over cases).</p>

<div class="env-block remark">
<strong>Counting without listing.</strong> The power of the Multiplication Principle is that it lets you count enormous collections without listing them. There are 6.76 million possible license plates in the example above. Nobody could list them all, but the multiplication gives the exact count instantly.
</div>

<h3>Extending to \\(k\\) stages</h3>

<p>If you make a sequence of \\(k\\) independent choices, with \\(n_1, n_2, \\ldots, n_k\\) options at each stage, the total number of outcomes is:</p>

\\[
n_1 \\times n_2 \\times \\cdots \\times n_k
\\]
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'A pizza parlor offers 3 sizes, 2 crusts, and 8 toppings. If you choose one of each, how many different single-topping pizzas can you order?',
                        hint: 'You choose a size AND a crust AND a topping.',
                        solution: '\\(3 \\times 2 \\times 8 = 48\\) different pizzas.'
                    },
                    {
                        question: 'How many 4-digit PINs are there (each digit from 0 to 9)? How many if no digit can be repeated?',
                        hint: 'With repetition, each of the 4 positions has 10 choices. Without repetition, the choices decrease at each step.',
                        solution: 'With repetition: \\(10^4 = 10{,}000\\). Without repetition: \\(10 \\times 9 \\times 8 \\times 7 = 5{,}040\\).'
                    },
                    {
                        question: 'A coin is flipped 6 times. How many different sequences of heads and tails are possible?',
                        hint: 'Each flip has 2 outcomes, and the flips are independent.',
                        solution: '\\(2^6 = 64\\) different sequences.'
                    }
                ]
            },

            // ============================================================
            // Section 4: Tree Diagrams
            // ============================================================
            {
                id: 'tree-diagrams',
                title: 'Tree Diagrams',
                content: `
<h2>Seeing All the Choices</h2>

<p>A <strong>tree diagram</strong> is a visual tool that makes both the Addition and Multiplication Principles tangible. Each branch point represents a choice, and each path from root to leaf represents one complete outcome.</p>

<div class="env-block definition">
<strong>Tree Diagram.</strong> A branching picture where:
<ul>
<li>The root is the starting point.</li>
<li>Each internal node branches into the available options for one choice.</li>
<li>Each leaf (endpoint) represents one complete outcome.</li>
<li>The total number of leaves equals the total number of outcomes.</li>
</ul>
</div>

<p>Try building a tree in the interactive visualization below. Notice how the total count at the bottom equals the product of the branch counts at each level (that is the Multiplication Principle in action).</p>

<div class="viz-placeholder" data-viz="viz-tree-builder"></div>

<h3>Reading the tree</h3>

<ul>
<li><strong>Multiplication Principle:</strong> The total number of leaves is the product of branch counts at each level.</li>
<li><strong>Addition Principle:</strong> If the tree has two separate subtrees (representing two disjoint choices), the total leaves are the sum of leaves in each subtree.</li>
</ul>

<div class="env-block example">
<strong>Example.</strong> You roll a die and then flip a coin. The tree has 6 branches from the root (one per die face), and each branches into 2 (H or T). Total leaves: \\(6 \\times 2 = 12\\).
</div>

<p>Tree diagrams are especially useful when the number of options at a later stage <em>depends on</em> what you chose earlier. In that case, different branches may have different numbers of sub-branches, and you add up the leaf counts from each branch separately.</p>

<div class="env-block example">
<strong>Dependent choices.</strong> You pick a main course (chicken, fish, or vegetarian), and then a sauce. Chicken has 3 sauces, fish has 2 sauces, vegetarian has 4 sauces. Total: \\(3 + 2 + 4 = 9\\). The tree makes this clear: three branches from the root with 3, 2, and 4 sub-branches respectively.
</div>
`,
                visualizations: [
                    {
                        id: 'viz-tree-builder',
                        title: 'Interactive Tree Diagram',
                        description: 'Adjust the number of stages (depth) and branches per level to build a tree. Watch the total count update in real time.',
                        setup: function (body, controls) {
                            var viz = new VizEngine(body, { scale: 1, originX: 0, originY: 0 });
                            var ctx = viz.ctx;
                            var w = viz.width, h = viz.height;
                            var depth = 2;
                            var branchCounts = [3, 2, 3];
                            var labels = [
                                ['A', 'B', 'C', 'D', 'E'],
                                ['1', '2', '3', '4', '5'],
                                ['x', 'y', 'z', 'w', 'v']
                            ];

                            function totalLeaves() {
                                var t = 1;
                                for (var i = 0; i < depth; i++) t *= branchCounts[i];
                                return t;
                            }

                            function draw() {
                                viz.clear();

                                var padTop = 40;
                                var padBot = 50;
                                var padLR = 30;
                                var treeH = h - padTop - padBot;
                                var treeW = w - 2 * padLR;
                                var levelH = treeH / depth;

                                // Title and total
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                var formula = branchCounts.slice(0, depth).join(' \u00D7 ') + ' = ' + totalLeaves();
                                ctx.fillText('Total outcomes: ' + formula, w / 2, 22);

                                // Draw tree using BFS-like layout
                                var colors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.purple];

                                // Node positions: array of arrays
                                var positions = []; // positions[level] = [{x, label}]
                                positions[0] = [{ x: w / 2, label: 'Start' }];

                                for (var level = 0; level < depth; level++) {
                                    var parentNodes = positions[level];
                                    var childNodes = [];
                                    var branches = branchCounts[level];
                                    var totalChildren = parentNodes.length * branches;
                                    var childSpacing = treeW / (totalChildren + 1);

                                    for (var pi = 0; pi < parentNodes.length; pi++) {
                                        var parent = parentNodes[pi];
                                        var parentY = padTop + level * levelH;
                                        var childY = padTop + (level + 1) * levelH;

                                        // Spread children evenly under this parent
                                        var startIdx = pi * branches;
                                        for (var bi = 0; bi < branches; bi++) {
                                            var childIdx = startIdx + bi;
                                            var childX = childSpacing * (childIdx + 1) + padLR;
                                            var lbl = labels[level] ? (labels[level][bi] || (bi + 1).toString()) : (bi + 1).toString();

                                            childNodes.push({ x: childX, label: lbl });

                                            // Draw edge
                                            ctx.strokeStyle = colors[level % colors.length] + '88';
                                            ctx.lineWidth = 1.5;
                                            ctx.beginPath();
                                            ctx.moveTo(parent.x, parentY + 6);
                                            ctx.lineTo(childX, childY - 6);
                                            ctx.stroke();

                                            // Edge label (only if not too crowded)
                                            if (totalChildren <= 30) {
                                                ctx.fillStyle = colors[level % colors.length];
                                                ctx.font = '10px -apple-system,sans-serif';
                                                ctx.textAlign = 'center';
                                                ctx.fillText(lbl, (parent.x + childX) / 2 + (childX > parent.x ? 6 : -6), (parentY + childY) / 2);
                                            }
                                        }
                                    }
                                    positions[level + 1] = childNodes;
                                }

                                // Draw nodes
                                for (var lv = 0; lv <= depth; lv++) {
                                    var y = padTop + lv * levelH;
                                    for (var ni = 0; ni < positions[lv].length; ni++) {
                                        var node = positions[lv][ni];
                                        var isLeaf = (lv === depth);
                                        var isRoot = (lv === 0);
                                        var nodeColor = isRoot ? viz.colors.green : (isLeaf ? viz.colors.gold : colors[(lv - 1) % colors.length]);
                                        var nodeR = isLeaf ? 3 : 5;

                                        ctx.fillStyle = nodeColor;
                                        ctx.beginPath();
                                        ctx.arc(node.x, y, nodeR, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }

                                // Level labels
                                for (var ll = 0; ll < depth; ll++) {
                                    ctx.fillStyle = colors[ll % colors.length];
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'left';
                                    ctx.fillText('Choice ' + (ll + 1) + ': ' + branchCounts[ll] + ' options', 6, padTop + ll * levelH + levelH / 2 + 4);
                                }

                                // Leaf count
                                ctx.fillStyle = viz.colors.gold;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(totalLeaves() + ' leaves (outcomes)', w / 2, h - 14);
                            }

                            VizEngine.createSlider(controls, 'Stages', 1, 3, 2, 1, function (val) {
                                depth = Math.round(val);
                                draw();
                            });
                            VizEngine.createSlider(controls, 'Branches (1st)', 2, 5, 3, 1, function (val) {
                                branchCounts[0] = Math.round(val);
                                draw();
                            });
                            VizEngine.createSlider(controls, 'Branches (2nd)', 2, 5, 2, 1, function (val) {
                                branchCounts[1] = Math.round(val);
                                draw();
                            });
                            VizEngine.createSlider(controls, 'Branches (3rd)', 2, 5, 3, 1, function (val) {
                                branchCounts[2] = Math.round(val);
                                draw();
                            });

                            draw();
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Draw a tree diagram for choosing an ice cream: 2 cone types (waffle, sugar) and 3 flavors (vanilla, chocolate, strawberry). How many outcomes?',
                        hint: 'First branch: cone type (2 options). Second branch: flavor (3 options). Count the leaves.',
                        solution: 'The tree has 2 branches at level 1 and 3 branches at level 2, giving \\(2 \\times 3 = 6\\) leaves: (waffle, vanilla), (waffle, chocolate), (waffle, strawberry), (sugar, vanilla), (sugar, chocolate), (sugar, strawberry).'
                    },
                    {
                        question: 'A tree has 4 branches at the first level. At the second level, the first branch splits into 3, the second into 2, the third into 5, and the fourth into 1. How many leaves does the tree have? Which principle applies?',
                        hint: 'The second-level branching depends on the first-level choice. You cannot simply multiply.',
                        solution: 'Total leaves: \\(3 + 2 + 5 + 1 = 11\\). This uses the Addition Principle (not multiplication), because the number of options at the second level depends on the first choice. The tree makes this clear.'
                    }
                ]
            },

            // ============================================================
            // Section 5: Mixing Both Principles
            // ============================================================
            {
                id: 'mixing-both',
                title: 'Mixing Both Principles',
                content: `
<h2>Real Problems Need Both</h2>

<p>Most real counting problems require <em>both</em> addition and multiplication, often interleaved. The strategy is always the same: break the problem into cases (addition), and within each case, count the sequence of choices (multiplication).</p>

<div class="env-block example">
<strong>Example 1: Passwords.</strong> A password is either 3 letters (A-Z) or 2 digits followed by 1 letter. How many passwords are possible?<br><br>
Case 1 (3 letters): \\(26 \\times 26 \\times 26 = 17{,}576\\) (Multiplication Principle)<br>
Case 2 (2 digits + 1 letter): \\(10 \\times 10 \\times 26 = 2{,}600\\) (Multiplication Principle)<br>
Total: \\(17{,}576 + 2{,}600 = 20{,}176\\) (Addition Principle)
</div>

<div class="env-block example">
<strong>Example 2: Even 3-digit numbers.</strong> How many 3-digit numbers are even?<br><br>
A 3-digit number has the form \\(\\overline{abc}\\) where \\(a \\in \\{1,\\ldots,9\\}\\), \\(b \\in \\{0,\\ldots,9\\}\\), and \\(c \\in \\{0, 2, 4, 6, 8\\}\\) (to be even).<br>
By the Multiplication Principle: \\(9 \\times 10 \\times 5 = 450\\).
</div>

<div class="env-block example">
<strong>Example 3: Divisible by 5.</strong> How many 3-digit numbers are divisible by 5?<br><br>
The last digit must be 0 or 5. That is 2 choices. The first digit has 9 choices (1-9), the middle has 10 choices (0-9).<br>
Total: \\(9 \\times 10 \\times 2 = 180\\).
</div>

<h3>The general strategy</h3>

<div class="env-block definition">
<strong>The Counting Recipe</strong><br>
<ol>
<li><strong>Identify:</strong> What am I counting? Describe a generic element of the set.</li>
<li><strong>Break into cases</strong> if necessary (Addition Principle).</li>
<li><strong>Within each case,</strong> identify the sequence of independent choices and multiply (Multiplication Principle).</li>
<li><strong>Add up</strong> the totals from each case.</li>
<li><strong>Check:</strong> Did I double-count anything? Did I miss anything?</li>
</ol>
</div>

<div class="env-block example">
<strong>Example 4: Competition problem.</strong> How many 4-digit numbers have exactly one digit equal to 5?<br><br>
<strong>Step 1:</strong> Choose which position gets the 5: 4 choices (but if it is the first position, the number is fixed to start with 5).<br>
<strong>Step 2:</strong> Case A: The 5 is in the first position. The other 3 digits are chosen from \\(\\{0,1,2,3,4,6,7,8,9\\}\\) (9 choices each), so \\(9^3 = 729\\).<br>
Case B: The 5 is in position 2, 3, or 4 (3 sub-cases). The first digit has 8 choices (1-9 excluding 5), and each of the other 2 non-5 positions has 9 choices.<br>
Each sub-case: \\(8 \\times 9 \\times 9 = 648\\).<br>
Three sub-cases: \\(3 \\times 648 = 1{,}944\\).<br>
<strong>Total:</strong> \\(729 + 1{,}944 = 2{,}673\\).
</div>

<p>With practice, the add-or-multiply decision becomes second nature. The tree diagram is your friend: if branches at a node represent exclusive alternatives, you add; if they represent sequential choices, you multiply.</p>

<div class="env-block intuition">
<strong>Remember:</strong>
<ul>
<li><strong>OR = Add</strong> (choosing between disjoint alternatives)</li>
<li><strong>AND = Multiply</strong> (making a sequence of independent choices)</li>
</ul>
These two rules, together with careful case analysis, can solve a surprisingly wide range of counting problems.
</div>
`,
                visualizations: [],
                exercises: [
                    {
                        question: 'A password must be 4 characters long. Each character is either a lowercase letter (26 options) or a digit (10 options). How many possible passwords are there?',
                        hint: 'Each character independently has \\(26 + 10 = 36\\) options.',
                        solution: 'Each of the 4 positions has \\(26 + 10 = 36\\) choices (the Addition Principle determines the options per position, then the Multiplication Principle combines the positions): \\(36^4 = 1{,}679{,}616\\).'
                    },
                    {
                        question: 'How many 3-digit numbers have all digits distinct (no repeats)?',
                        hint: 'The first digit has 9 choices (1-9). The second digit has 9 choices (0-9 minus the first). The third has 8.',
                        solution: 'First digit: 9 options (1-9). Second digit: 9 options (0-9, excluding the first digit). Third digit: 8 options (excluding both used digits). Total: \\(9 \\times 9 \\times 8 = 648\\).'
                    },
                    {
                        question: 'A committee of 3 is formed from 5 men and 4 women. How many committees have at least one woman?',
                        hint: 'It is easier to compute total committees minus all-male committees. Total from 9 people: \\(\\binom{9}{3}\\). All-male: \\(\\binom{5}{3}\\).',
                        solution: 'Total ways to choose 3 from 9: \\(\\binom{9}{3} = 84\\). All-male: \\(\\binom{5}{3} = 10\\). Committees with at least one woman: \\(84 - 10 = 74\\). (This uses the complementary counting technique, a powerful trick.)'
                    }
                ]
            }
        ]
    });
})();
