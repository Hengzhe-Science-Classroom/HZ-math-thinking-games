// === Chapter 4: Magic Squares ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch04',
    number: 4,
    title: 'Magic Squares',
    subtitle: 'Every row, column, and diagonal sums to the same number',
    sections: [
        // ─────────────────────────────────────────────
        // Section 1: Motivation
        // ─────────────────────────────────────────────
        {
            id: 'sec-motivation',
            title: 'The Magic of Equal Sums',
            content: `
<h2>The Magic of Equal Sums</h2>

<p>Imagine arranging the numbers 1 through 9 in a 3\\(\\times\\)3 grid so that every row, every column, and both diagonals all add up to the same total. Sounds tricky? People have been fascinated by this challenge for over four thousand years.</p>

<div class="env-block intuition">
<strong>What Makes It "Magic"?</strong><br>
A magic square is a grid of distinct numbers where every row, column, and main diagonal shares the same sum. That shared sum is called the <strong>magic constant</strong>. The constraint feels almost impossibly tight: you have to satisfy many equations simultaneously. Yet solutions exist, and they reveal beautiful structure.
</div>

<p>Magic squares appear across cultures and centuries. Ancient Chinese mathematicians discovered the 3\\(\\times\\)3 magic square (the "Lo Shu") around 2200 BCE. Indian, Arab, and European mathematicians all developed techniques for building larger ones. Albrecht Durer engraved a famous 4\\(\\times\\)4 magic square in his 1514 artwork <em>Melancholia I</em>.</p>

<p>Why do mathematicians care about magic squares? They sit at the intersection of number theory, combinatorics, and algebra. Building a magic square forces you to think about constraints, symmetry, and structure, which are core mathematical skills. And they are genuinely fun to play with.</p>

<div class="env-block definition">
<strong>Magic Square.</strong> An \\(n \\times n\\) <em>magic square</em> is an arrangement of \\(n^2\\) distinct numbers in a square grid such that the sum of every row, every column, and both main diagonals is the same value, called the <strong>magic constant</strong>.
</div>

<p>A <em>normal</em> magic square uses the consecutive integers \\(1, 2, \\ldots, n^2\\). For a normal \\(n \\times n\\) magic square, the magic constant is:</p>

\\[
M = \\frac{n(n^2 + 1)}{2}
\\]

<p>For \\(n = 3\\): \\(M = \\frac{3 \\times 10}{2} = 15\\). For \\(n = 4\\): \\(M = \\frac{4 \\times 17}{2} = 34\\). Let us explore how these squares work and how to build them.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Verify the magic constant formula. The numbers 1 through \\(n^2\\) sum to \\(\\frac{n^2(n^2+1)}{2}\\). A magic square has \\(n\\) rows, each summing to \\(M\\). Why does \\(M = \\frac{n(n^2+1)}{2}\\)?',
                    hint: 'The total sum of all entries equals the sum of all row sums. Since there are \\(n\\) rows each summing to \\(M\\), the total is \\(nM\\).',
                    solution: 'Total sum = \\(\\frac{n^2(n^2+1)}{2}\\). Since the \\(n\\) rows each sum to \\(M\\), we have \\(nM = \\frac{n^2(n^2+1)}{2}\\), so \\(M = \\frac{n(n^2+1)}{2}\\).'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 2: The 3x3 Magic Square (Lo Shu)
        // ─────────────────────────────────────────────
        {
            id: 'sec-3x3',
            title: 'The 3×3 Magic Square',
            content: `
<h2>The 3\\(\\times\\)3 Magic Square: Lo Shu</h2>

<div class="env-block remark">
<strong>Legend of the Lo Shu.</strong> According to Chinese mythology, around 2200 BCE a turtle emerged from the Lo River bearing a pattern of dots on its shell. The dots, when read as numbers, formed a 3\\(\\times\\)3 magic square. Emperor Yu took this as a divine message, and the pattern became central to Chinese numerology and cosmology.
</div>

<p>The Lo Shu square is:</p>

\\[
\\begin{pmatrix}
2 & 7 & 6 \\\\
9 & 5 & 1 \\\\
4 & 3 & 8
\\end{pmatrix}
\\]

<p>Check it: every row sums to 15 (\\(2+7+6\\), \\(9+5+1\\), \\(4+3+8\\)). Every column sums to 15 (\\(2+9+4\\), \\(7+5+3\\), \\(6+1+8\\)). Both diagonals sum to 15 (\\(2+5+8\\), \\(6+5+4\\)). The magic constant is indeed \\(M = 15\\).</p>

<h3>Uniqueness of the 3\\(\\times\\)3 Magic Square</h3>

<p>Here is a remarkable fact: <strong>there is essentially only one 3\\(\\times\\)3 normal magic square</strong>. Every other valid arrangement is a rotation or reflection of the Lo Shu. Since a square has 8 symmetries (4 rotations \\(\\times\\) 2 reflections), there are exactly 8 versions of the same fundamental square.</p>

<div class="env-block theorem">
<strong>Theorem.</strong> Up to rotation and reflection, the Lo Shu is the unique normal 3\\(\\times\\)3 magic square.
</div>

<p><strong>Proof sketch.</strong> The magic constant is 15. The center cell must be 5 (it appears in 4 lines: row, column, and two diagonals, and is the only value allowing all four lines to sum to 15). Once 5 is in the center, the even numbers must go in the corners and the odd numbers (other than 5) on the edges. The constraints then force a unique arrangement up to symmetry. \\(\\square\\)</p>

<div class="viz-placeholder" data-viz="viz-lo-shu"></div>

<p>Try building it yourself in the interactive tool below. Drag the numbers 1 through 9 into the grid and see if you can make every row, column, and diagonal sum to 15.</p>

<div class="viz-placeholder" data-viz="viz-magic-square-builder"></div>
`,
            visualizations: [
                {
                    id: 'viz-lo-shu',
                    title: 'The Lo Shu Square',
                    description: 'The ancient 3x3 magic square from Chinese legend. All rows, columns, and diagonals sum to 15. Hover over a row, column, or diagonal to see its sum highlighted.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var loShu = [[2,7,6],[9,5,1],[4,3,8]];
                        var cellSize = Math.min(w, h) * 0.2;
                        var gridX = w / 2 - cellSize * 1.5;
                        var gridY = h / 2 - cellSize * 1.5 - 10;
                        var highlight = null; // {type:'row'|'col'|'diag', idx:0-2}

                        var cellColors = [viz.colors.blue, viz.colors.teal, viz.colors.orange, viz.colors.green, viz.colors.purple, viz.colors.pink, viz.colors.yellow, viz.colors.red, viz.colors.white];

                        function getCells(type, idx) {
                            var cells = [];
                            if (type === 'row') { for (var c = 0; c < 3; c++) cells.push([idx, c]); }
                            else if (type === 'col') { for (var r = 0; r < 3; r++) cells.push([r, idx]); }
                            else if (type === 'diag' && idx === 0) { cells = [[0,0],[1,1],[2,2]]; }
                            else if (type === 'diag' && idx === 1) { cells = [[0,2],[1,1],[2,0]]; }
                            return cells;
                        }

                        function isHighlighted(r, c) {
                            if (!highlight) return false;
                            var cells = getCells(highlight.type, highlight.idx);
                            for (var i = 0; i < cells.length; i++) {
                                if (cells[i][0] === r && cells[i][1] === c) return true;
                            }
                            return false;
                        }

                        function draw() {
                            viz.clear();
                            ctx.save();

                            // Title
                            viz.screenText('Lo Shu Magic Square', w / 2, 25, viz.colors.white, 16);
                            viz.screenText('(c. 2200 BCE)', w / 2, 45, viz.colors.text, 12);

                            // Draw grid
                            for (var r = 0; r < 3; r++) {
                                for (var c = 0; c < 3; c++) {
                                    var x = gridX + c * cellSize;
                                    var y = gridY + r * cellSize;
                                    var hl = isHighlighted(r, c);

                                    // Cell background
                                    ctx.fillStyle = hl ? viz.colors.blue + '44' : '#1a1a40';
                                    ctx.fillRect(x, y, cellSize, cellSize);

                                    // Cell border
                                    ctx.strokeStyle = hl ? viz.colors.blue : viz.colors.axis;
                                    ctx.lineWidth = hl ? 2.5 : 1;
                                    ctx.strokeRect(x, y, cellSize, cellSize);

                                    // Number
                                    var num = loShu[r][c];
                                    ctx.fillStyle = hl ? viz.colors.blue : viz.colors.white;
                                    ctx.font = 'bold ' + Math.round(cellSize * 0.45) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(num, x + cellSize / 2, y + cellSize / 2);
                                }
                            }

                            // Row sums
                            for (var rr = 0; rr < 3; rr++) {
                                var sum = loShu[rr][0] + loShu[rr][1] + loShu[rr][2];
                                var hl2 = highlight && highlight.type === 'row' && highlight.idx === rr;
                                ctx.fillStyle = hl2 ? viz.colors.green : viz.colors.text;
                                ctx.font = (hl2 ? 'bold ' : '') + '14px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('= ' + sum, gridX + 3 * cellSize + 10, gridY + rr * cellSize + cellSize / 2);
                            }

                            // Col sums
                            for (var cc = 0; cc < 3; cc++) {
                                var csum = loShu[0][cc] + loShu[1][cc] + loShu[2][cc];
                                var hl3 = highlight && highlight.type === 'col' && highlight.idx === cc;
                                ctx.fillStyle = hl3 ? viz.colors.green : viz.colors.text;
                                ctx.font = (hl3 ? 'bold ' : '') + '14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('= ' + csum, gridX + cc * cellSize + cellSize / 2, gridY + 3 * cellSize + 8);
                            }

                            // Diagonal indicators
                            if (highlight && highlight.type === 'diag') {
                                ctx.strokeStyle = viz.colors.orange;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                if (highlight.idx === 0) {
                                    ctx.moveTo(gridX + cellSize * 0.2, gridY + cellSize * 0.2);
                                    ctx.lineTo(gridX + cellSize * 2.8, gridY + cellSize * 2.8);
                                } else {
                                    ctx.moveTo(gridX + cellSize * 2.8, gridY + cellSize * 0.2);
                                    ctx.lineTo(gridX + cellSize * 0.2, gridY + cellSize * 2.8);
                                }
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('diagonal = 15', w / 2, gridY + 3 * cellSize + 35);
                            }

                            // Legend
                            viz.screenText('Magic constant M = 15', w / 2, gridY + 3 * cellSize + 60, viz.colors.teal, 14);
                            viz.screenText('Hover over the grid to highlight rows, columns, diagonals', w / 2, h - 15, viz.colors.text, 11);

                            ctx.restore();
                        }

                        viz.canvas.addEventListener('mousemove', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            // Determine which row/col we're in
                            var col = Math.floor((mx - gridX) / cellSize);
                            var row = Math.floor((my - gridY) / cellSize);

                            if (col >= 0 && col < 3 && row >= 0 && row < 3) {
                                // Check if near diagonal
                                if (row === col) { highlight = {type: 'diag', idx: 0}; }
                                else if (row + col === 2) { highlight = {type: 'diag', idx: 1}; }
                                else if (mx - gridX - col * cellSize < cellSize / 2) { highlight = {type: 'col', idx: col}; }
                                else { highlight = {type: 'row', idx: row}; }
                            } else if (mx > gridX + 3 * cellSize && row >= 0 && row < 3) {
                                highlight = {type: 'row', idx: row};
                            } else if (col >= 0 && col < 3 && my > gridY + 3 * cellSize) {
                                highlight = {type: 'col', idx: col};
                            } else {
                                highlight = null;
                            }
                            draw();
                        });

                        viz.canvas.addEventListener('mouseleave', function() {
                            highlight = null;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-magic-square-builder',
                    title: 'Magic Square Builder',
                    description: 'Drag numbers 1-9 into the 3x3 grid. The display checks each row, column, and diagonal sum in real time, turning green when a line sums to 15.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var cellSize = Math.min(w, h) * 0.17;
                        var gridX = w / 2 - cellSize * 1.5;
                        var gridY = 60;
                        var grid = [0,0,0,0,0,0,0,0,0]; // 0 = empty
                        var trayY = gridY + cellSize * 3 + 30;
                        var traySpacing = cellSize * 0.85;
                        var trayX = w / 2 - traySpacing * 4.5;
                        var dragging = null; // {num, x, y}
                        var dragOffX = 0, dragOffY = 0;

                        function numPositions() {
                            // Returns {num: {type:'grid'|'tray', idx, cx, cy}} for each number 1-9
                            var pos = {};
                            for (var i = 1; i <= 9; i++) {
                                var gIdx = grid.indexOf(i);
                                if (gIdx >= 0) {
                                    var r = Math.floor(gIdx / 3), c = gIdx % 3;
                                    pos[i] = {type: 'grid', idx: gIdx, cx: gridX + c * cellSize + cellSize / 2, cy: gridY + r * cellSize + cellSize / 2};
                                } else {
                                    pos[i] = {type: 'tray', idx: i - 1, cx: trayX + (i - 1) * traySpacing + traySpacing / 2, cy: trayY + traySpacing / 2};
                                }
                            }
                            return pos;
                        }

                        function lineSum(indices) {
                            var s = 0; var filled = 0;
                            for (var i = 0; i < indices.length; i++) {
                                if (grid[indices[i]] > 0) { s += grid[indices[i]]; filled++; }
                            }
                            return {sum: s, filled: filled};
                        }

                        var lines = [
                            {cells: [0,1,2], label: 'R1'}, {cells: [3,4,5], label: 'R2'}, {cells: [6,7,8], label: 'R3'},
                            {cells: [0,3,6], label: 'C1'}, {cells: [1,4,7], label: 'C2'}, {cells: [2,5,8], label: 'C3'},
                            {cells: [0,4,8], label: 'D1'}, {cells: [2,4,6], label: 'D2'}
                        ];

                        function isMagic() {
                            for (var i = 0; i < 9; i++) { if (grid[i] === 0) return false; }
                            for (var j = 0; j < lines.length; j++) {
                                var ls = lineSum(lines[j].cells);
                                if (ls.sum !== 15) return false;
                            }
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            var magic = isMagic();

                            // Title
                            viz.screenText('Build a Magic Square', w / 2, 20, viz.colors.white, 16);
                            viz.screenText('Drag numbers into the grid. Target sum: 15', w / 2, 42, viz.colors.text, 12);

                            // Grid
                            for (var i = 0; i < 9; i++) {
                                var r = Math.floor(i / 3), c = i % 3;
                                var x = gridX + c * cellSize;
                                var y = gridY + r * cellSize;

                                ctx.fillStyle = magic ? viz.colors.green + '22' : '#1a1a40';
                                ctx.fillRect(x, y, cellSize, cellSize);
                                ctx.strokeStyle = magic ? viz.colors.green : viz.colors.axis;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(x, y, cellSize, cellSize);

                                if (grid[i] > 0 && !(dragging && dragging.num === grid[i])) {
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold ' + Math.round(cellSize * 0.4) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(grid[i], x + cellSize / 2, y + cellSize / 2);
                                }
                            }

                            // Line sums on right side
                            var sumX = gridX + 3 * cellSize + 15;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            for (var li = 0; li < lines.length; li++) {
                                var ls = lineSum(lines[li].cells);
                                var color = viz.colors.text;
                                if (ls.filled === 3) {
                                    color = ls.sum === 15 ? viz.colors.green : viz.colors.red;
                                }
                                ctx.fillStyle = color;
                                var sy = gridY + li * 18;
                                if (li >= 3) sy += 6;
                                if (li >= 6) sy += 6;
                                ctx.fillText(lines[li].label + ': ' + (ls.filled > 0 ? ls.sum : '-'), sumX, sy + 12);
                            }

                            // Tray
                            var pos = numPositions();
                            for (var n = 1; n <= 9; n++) {
                                if (dragging && dragging.num === n) continue;
                                var p = pos[n];
                                if (p.type === 'tray') {
                                    ctx.fillStyle = viz.colors.blue + '33';
                                    ctx.beginPath();
                                    ctx.arc(p.cx, p.cy, traySpacing * 0.38, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = viz.colors.blue;
                                    ctx.font = 'bold ' + Math.round(traySpacing * 0.4) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(n, p.cx, p.cy);
                                }
                            }

                            // Dragged number
                            if (dragging) {
                                ctx.fillStyle = viz.colors.orange + '66';
                                ctx.beginPath();
                                ctx.arc(dragging.x, dragging.y, cellSize * 0.35, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = 'bold ' + Math.round(cellSize * 0.4) + 'px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(dragging.num, dragging.x, dragging.y);
                            }

                            // Success message
                            if (magic) {
                                viz.screenText('Magic! Every line sums to 15!', w / 2, h - 20, viz.colors.green, 16);
                            }
                        }

                        function getGridCell(mx, my) {
                            var c = Math.floor((mx - gridX) / cellSize);
                            var r = Math.floor((my - gridY) / cellSize);
                            if (r >= 0 && r < 3 && c >= 0 && c < 3) return r * 3 + c;
                            return -1;
                        }

                        function getNumberAt(mx, my) {
                            // Check grid first
                            var cell = getGridCell(mx, my);
                            if (cell >= 0 && grid[cell] > 0) return grid[cell];
                            // Check tray
                            var pos = numPositions();
                            for (var n = 1; n <= 9; n++) {
                                var p = pos[n];
                                if (p.type === 'tray') {
                                    var dx = mx - p.cx, dy = my - p.cy;
                                    if (dx * dx + dy * dy < traySpacing * traySpacing * 0.2) return n;
                                }
                            }
                            return 0;
                        }

                        viz.canvas.addEventListener('mousedown', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var num = getNumberAt(mx, my);
                            if (num > 0) {
                                // Remove from grid if present
                                var gIdx = grid.indexOf(num);
                                if (gIdx >= 0) grid[gIdx] = 0;
                                dragging = {num: num, x: mx, y: my};
                                draw();
                            }
                        });

                        viz.canvas.addEventListener('mousemove', function(e) {
                            if (!dragging) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            dragging.x = e.clientX - rect.left;
                            dragging.y = e.clientY - rect.top;
                            draw();
                        });

                        viz.canvas.addEventListener('mouseup', function(e) {
                            if (!dragging) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var cell = getGridCell(mx, my);
                            if (cell >= 0) {
                                // If cell occupied, swap back to tray
                                if (grid[cell] > 0) {
                                    // occupied cell's number goes back to tray
                                }
                                var prev = grid[cell];
                                grid[cell] = dragging.num;
                                // prev goes back to tray (just set to 0, it'll show in tray)
                            }
                            // else number goes back to tray (already removed from grid)
                            dragging = null;
                            draw();
                        });

                        // Touch support
                        viz.canvas.addEventListener('touchstart', function(e) {
                            e.preventDefault();
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.touches[0].clientX - rect.left, my = e.touches[0].clientY - rect.top;
                            var num = getNumberAt(mx, my);
                            if (num > 0) {
                                var gIdx = grid.indexOf(num);
                                if (gIdx >= 0) grid[gIdx] = 0;
                                dragging = {num: num, x: mx, y: my};
                                draw();
                            }
                        }, {passive: false});

                        viz.canvas.addEventListener('touchmove', function(e) {
                            e.preventDefault();
                            if (!dragging) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            dragging.x = e.touches[0].clientX - rect.left;
                            dragging.y = e.touches[0].clientY - rect.top;
                            draw();
                        }, {passive: false});

                        viz.canvas.addEventListener('touchend', function(e) {
                            if (!dragging) return;
                            // Use last known position
                            var cell = getGridCell(dragging.x, dragging.y);
                            if (cell >= 0) {
                                grid[cell] = dragging.num;
                            }
                            dragging = null;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            grid = [0,0,0,0,0,0,0,0,0];
                            dragging = null;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Show Solution', function() {
                            grid = [2,7,6,9,5,1,4,3,8];
                            dragging = null;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Prove that the center cell of any normal 3\\(\\times\\)3 magic square must be 5, and that the four corners must be even.',
                    hint: 'The center cell appears in 4 lines (row, column, two diagonals). Sum those 4 equations. Then use the diagonals to constrain corners.',
                    solution: 'The center \\(c\\) appears in 4 lines summing to \\(4 \\times 15 = 60\\). This counts \\(c\\) four times and every other cell once, so \\(45 + 3c = 60\\), giving \\(c = 5\\). Each diagonal sums to 15 through 5, so opposite corners sum to 10. The pairs from \\{1,...,9\\}\\setminus\\{5\\} summing to 10 are (2,8) and (4,6), all even. So corners are even and edges are odd.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 3: Building Magic Squares
        // ─────────────────────────────────────────────
        {
            id: 'sec-construction',
            title: 'Building Magic Squares',
            content: `
<h2>Building Magic Squares: The Siamese Method</h2>

<p>For odd-order magic squares (3\\(\\times\\)3, 5\\(\\times\\)5, 7\\(\\times\\)7, ...), there is an elegant construction algorithm discovered by Simon de la Loubere, a French diplomat who learned it in Siam (now Thailand) in 1688. It is called the <strong>Siamese method</strong> or <strong>staircase method</strong>.</p>

<div class="env-block definition">
<strong>Siamese Method (Odd \\(n\\)).</strong>
<ol>
<li>Place 1 in the middle cell of the top row.</li>
<li>Move diagonally up and to the right (wrapping around if you go off the edge).</li>
<li>If the target cell is already occupied, drop down one row instead (from your current position).</li>
<li>Place the next number and repeat from step 2.</li>
</ol>
</div>

<p>For the 3\\(\\times\\)3 case, this produces:</p>
<ol>
<li>Place 1 at position (0, 1) (top row, middle column).</li>
<li>Move up-right: wraps to (2, 2). Place 2.</li>
<li>Move up-right: wraps to (1, 0). Place 3.</li>
<li>Move up-right: (0, 1) is occupied (by 1). Drop down: (2, 0). Place 4.</li>
<li>Continue... the result is the Lo Shu square (rotated).</li>
</ol>

<p>The beauty of this method is that it works for <em>any</em> odd \\(n\\). Watch the animation below to see it build a 5\\(\\times\\)5 magic square step by step.</p>

<div class="viz-placeholder" data-viz="viz-siamese-method"></div>

<h3>Why Does It Work?</h3>

<p>The Siamese method's correctness comes from a deep algebraic structure. The diagonal movement and wrapping create a pattern where each row and column is visited exactly \\(n\\) times as we place \\(n^2\\) numbers. The "drop down" rule handles collisions in a way that preserves the sum balance. A full proof uses modular arithmetic and is quite elegant, though beyond our scope here.</p>

<div class="env-block remark">
<strong>Other methods for even-order squares.</strong> The Siamese method only works for odd \\(n\\). For even orders, different techniques are needed. For doubly-even orders (\\(n\\) divisible by 4), there is a simple complementary-pair method. For singly-even orders (\\(n = 2 \\pmod{4}\\), like 6, 10, 14), construction is more complex. The 6\\(\\times\\)6 case is notoriously the hardest small order.
</div>
`,
            visualizations: [
                {
                    id: 'viz-siamese-method',
                    title: 'Siamese Method Animation',
                    description: 'Watch the Siamese (staircase) method build an odd-order magic square step by step. The current position is highlighted as each number is placed.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var n = 5;
                        var grid = [];
                        var step = 0;
                        var steps = []; // precomputed: [{r,c,num}]
                        var animTimer = null;

                        function buildSteps(size) {
                            var g = [];
                            for (var i = 0; i < size * size; i++) g.push(0);
                            var st = [];
                            var r = 0, c = Math.floor(size / 2);
                            for (var num = 1; num <= size * size; num++) {
                                st.push({r: r, c: c, num: num});
                                g[r * size + c] = num;
                                var nr = ((r - 1) + size) % size;
                                var nc = (c + 1) % size;
                                if (g[nr * size + nc] !== 0) {
                                    nr = (r + 1) % size;
                                    nc = c;
                                }
                                r = nr; c = nc;
                            }
                            return st;
                        }

                        function reset() {
                            steps = buildSteps(n);
                            grid = [];
                            for (var i = 0; i < n * n; i++) grid.push(0);
                            step = 0;
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                        }

                        function draw() {
                            viz.clear();

                            var cellSize = Math.min((w - 80) / n, (h - 120) / n);
                            var gx = w / 2 - cellSize * n / 2;
                            var gy = 55;

                            viz.screenText('Siamese Method (' + n + '×' + n + ')', w / 2, 18, viz.colors.white, 16);
                            viz.screenText('Magic constant = ' + (n * (n * n + 1) / 2), w / 2, 38, viz.colors.teal, 12);

                            // Draw grid
                            for (var i = 0; i < n; i++) {
                                for (var j = 0; j < n; j++) {
                                    var x = gx + j * cellSize;
                                    var y = gy + i * cellSize;
                                    var val = grid[i * n + j];

                                    // Highlight current step's cell
                                    var isCurrent = step > 0 && steps[step - 1].r === i && steps[step - 1].c === j;

                                    ctx.fillStyle = isCurrent ? viz.colors.orange + '44' : (val > 0 ? viz.colors.blue + '18' : '#0f0f2a');
                                    ctx.fillRect(x, y, cellSize, cellSize);
                                    ctx.strokeStyle = isCurrent ? viz.colors.orange : viz.colors.axis;
                                    ctx.lineWidth = isCurrent ? 2.5 : 0.8;
                                    ctx.strokeRect(x, y, cellSize, cellSize);

                                    if (val > 0) {
                                        ctx.fillStyle = isCurrent ? viz.colors.orange : viz.colors.white;
                                        ctx.font = 'bold ' + Math.round(cellSize * 0.35) + 'px -apple-system,sans-serif';
                                        ctx.textAlign = 'center';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText(val, x + cellSize / 2, y + cellSize / 2);
                                    }
                                }
                            }

                            // Show arrow for next move direction
                            if (step > 0 && step < n * n) {
                                var curr = steps[step - 1];
                                var next = steps[step];
                                ctx.strokeStyle = viz.colors.teal + '88';
                                ctx.lineWidth = 2;
                                ctx.setLineDash([4, 3]);
                                ctx.beginPath();
                                ctx.moveTo(gx + curr.c * cellSize + cellSize / 2, gy + curr.r * cellSize + cellSize / 2);
                                ctx.lineTo(gx + next.c * cellSize + cellSize / 2, gy + next.r * cellSize + cellSize / 2);
                                ctx.stroke();
                                ctx.setLineDash([]);
                            }

                            // Step info
                            var info = step === 0 ? 'Press Play or Step to begin' :
                                       step >= n * n ? 'Complete! All ' + (n * n) + ' numbers placed.' :
                                       'Placed ' + step + ' of ' + (n * n);
                            viz.screenText(info, w / 2, gy + n * cellSize + 20, viz.colors.text, 12);

                            // If complete, show row/col/diag sums
                            if (step >= n * n) {
                                var mc = n * (n * n + 1) / 2;
                                viz.screenText('All rows, columns, and diagonals sum to ' + mc, w / 2, gy + n * cellSize + 42, viz.colors.green, 13);
                            }
                        }

                        function doStep() {
                            if (step >= n * n) return;
                            var s = steps[step];
                            grid[s.r * n + s.c] = s.num;
                            step++;
                            draw();
                        }

                        VizEngine.createSlider(controls, 'Size (odd)', 3, 9, n, 2, function(v) {
                            n = Math.round(v);
                            if (n % 2 === 0) n++;
                            reset();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Step', function() {
                            doStep();
                        });

                        VizEngine.createButton(controls, 'Play', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; return; }
                            if (step >= n * n) { reset(); }
                            animTimer = setInterval(function() {
                                doStep();
                                if (step >= n * n) { clearInterval(animTimer); animTimer = null; }
                            }, 200);
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            reset();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Fill All', function() {
                            reset();
                            for (var i = 0; i < n * n; i++) {
                                grid[steps[i].r * n + steps[i].c] = steps[i].num;
                            }
                            step = n * n;
                            draw();
                        });

                        reset();
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Use the Siamese method to construct a 3\\(\\times\\)3 magic square. Write out each step.',
                    hint: 'Start with 1 in the top-center. Go up-right (with wrapping). If blocked, go down instead.',
                    solution: 'Start: 1 at (0,1). Up-right wraps to (2,2): place 2. Up-right wraps to (1,0): place 3. Up-right: (0,1) occupied, drop to (2,0): place 4. Up-right: (1,1): place 5. Up-right: (0,2): place 6. Up-right: (2,0) occupied, drop to (1,2): place 7. Up-right wraps to (0,0): place 8. Up-right wraps to (2,1): place 9. Result: \\(\\begin{pmatrix} 8 & 1 & 6 \\\\ 3 & 5 & 7 \\\\ 4 & 9 & 2 \\end{pmatrix}\\), which is a rotation of the Lo Shu.'
                },
                {
                    question: 'Why does the Siamese method always place the number \\(n\\) directly below where it placed 1? Verify for \\(n = 5\\).',
                    hint: 'After placing 1, the next \\(n-1\\) numbers go diagonally without collision. After \\(n-1\\) diagonal up-right moves from the top center, where do you end up?',
                    solution: 'After placing 1 at (0, \\(\\lfloor n/2 \\rfloor\\)), the diagonal moves wrap around \\(n-1\\) times in both row and column, landing back at row 0, column \\(\\lfloor n/2 \\rfloor\\). That cell is occupied by 1, so we drop down to row 1. Thus \\(n\\) always goes to (1, \\(\\lfloor n/2 \\rfloor\\)), directly below 1. For \\(n=5\\): number 5 is at (1,2). Confirmed.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 4: The 4x4 Magic Square
        // ─────────────────────────────────────────────
        {
            id: 'sec-4x4',
            title: 'The 4×4 Magic Square',
            content: `
<h2>The 4\\(\\times\\)4 Magic Square: Durer's Masterpiece</h2>

<p>Unlike the 3\\(\\times\\)3 case (which is essentially unique), there are <strong>880 distinct</strong> normal 4\\(\\times\\)4 magic squares (up to rotation and reflection). The most famous one was created by the German artist Albrecht Durer and engraved in his 1514 work <em>Melancholia I</em>:</p>

\\[
\\begin{pmatrix}
16 & 3 & 2 & 13 \\\\
5 & 10 & 11 & 8 \\\\
9 & 6 & 7 & 12 \\\\
4 & 15 & 14 & 1
\\end{pmatrix}
\\]

<p>The magic constant is \\(M = \\frac{4 \\times 17}{2} = 34\\). But Durer's square has much more than the basic magic property:</p>

<ul>
<li>Every row sums to 34.</li>
<li>Every column sums to 34.</li>
<li>Both main diagonals sum to 34.</li>
<li>Each of the four 2\\(\\times\\)2 corner quadrants sums to 34.</li>
<li>The center 2\\(\\times\\)2 block (10 + 11 + 6 + 7) sums to 34.</li>
<li>The four corners (16 + 13 + 4 + 1) sum to 34.</li>
<li>The middle two cells of the bottom row read "15, 14" (i.e. 1514, the year Durer created the engraving!).</li>
</ul>

<div class="viz-placeholder" data-viz="viz-durer-square"></div>

<div class="env-block remark">
<strong>How many 4\\(\\times\\)4 magic squares are there?</strong> Bernard Frenicle de Bessy enumerated all 880 in 1693 (before computers!). Including rotations and reflections, there are \\(880 \\times 8 = 7{,}040\\) total arrangements. This is a sharp contrast to the 3\\(\\times\\)3 case (just 1 up to symmetry) and the 5\\(\\times\\)5 case (which has 275,305,224 distinct squares).
</div>
`,
            visualizations: [
                {
                    id: 'viz-durer-square',
                    title: "Durer's 4×4 Magic Square",
                    description: "Explore Durer's famous magic square. Click the buttons to highlight different patterns, all summing to 34.",
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var durer = [[16,3,2,13],[5,10,11,8],[9,6,7,12],[4,15,14,1]];
                        var cellSize = Math.min(w, h) * 0.15;
                        var gx = w / 2 - cellSize * 2;
                        var gy = 55;
                        var highlightCells = []; // array of [r,c]
                        var highlightLabel = '';

                        var patterns = [
                            {name: 'Rows', groups: [[[0,0],[0,1],[0,2],[0,3]], [[1,0],[1,1],[1,2],[1,3]], [[2,0],[2,1],[2,2],[2,3]], [[3,0],[3,1],[3,2],[3,3]]]},
                            {name: 'Columns', groups: [[[0,0],[1,0],[2,0],[3,0]], [[0,1],[1,1],[2,1],[3,1]], [[0,2],[1,2],[2,2],[3,2]], [[0,3],[1,3],[2,3],[3,3]]]},
                            {name: 'Diagonals', groups: [[[0,0],[1,1],[2,2],[3,3]], [[0,3],[1,2],[2,1],[3,0]]]},
                            {name: 'Quadrants', groups: [[[0,0],[0,1],[1,0],[1,1]], [[0,2],[0,3],[1,2],[1,3]], [[2,0],[2,1],[3,0],[3,1]], [[2,2],[2,3],[3,2],[3,3]]]},
                            {name: 'Center 2x2', groups: [[[1,1],[1,2],[2,1],[2,2]]]},
                            {name: '4 Corners', groups: [[[0,0],[0,3],[3,0],[3,3]]]},
                            {name: '1514', groups: [[[3,1],[3,2]]]}
                        ];

                        var currentPattern = -1;
                        var groupIndex = 0;
                        var animTimer = null;

                        function draw() {
                            viz.clear();

                            viz.screenText("Durer's Magic Square (1514)", w / 2, 18, viz.colors.white, 16);
                            viz.screenText('Magic constant = 34', w / 2, 38, viz.colors.teal, 12);

                            // Build highlight set
                            var hlSet = {};
                            if (currentPattern >= 0) {
                                var pat = patterns[currentPattern];
                                var grp = pat.groups[groupIndex % pat.groups.length];
                                for (var k = 0; k < grp.length; k++) {
                                    hlSet[grp[k][0] + ',' + grp[k][1]] = true;
                                }
                            }

                            // Draw grid
                            for (var r = 0; r < 4; r++) {
                                for (var c = 0; c < 4; c++) {
                                    var x = gx + c * cellSize;
                                    var y = gy + r * cellSize;
                                    var hl = hlSet[r + ',' + c];

                                    ctx.fillStyle = hl ? viz.colors.orange + '44' : '#1a1a40';
                                    ctx.fillRect(x, y, cellSize, cellSize);
                                    ctx.strokeStyle = hl ? viz.colors.orange : viz.colors.axis;
                                    ctx.lineWidth = hl ? 2.5 : 1;
                                    ctx.strokeRect(x, y, cellSize, cellSize);

                                    ctx.fillStyle = hl ? viz.colors.orange : viz.colors.white;
                                    ctx.font = 'bold ' + Math.round(cellSize * 0.38) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(durer[r][c], x + cellSize / 2, y + cellSize / 2);
                                }
                            }

                            // Show pattern info
                            if (currentPattern >= 0) {
                                var pat2 = patterns[currentPattern];
                                var grp2 = pat2.groups[groupIndex % pat2.groups.length];
                                var sum = 0;
                                var nums = [];
                                for (var i = 0; i < grp2.length; i++) {
                                    var val = durer[grp2[i][0]][grp2[i][1]];
                                    sum += val;
                                    nums.push(val);
                                }
                                viz.screenText(pat2.name + ': ' + nums.join(' + ') + ' = ' + sum, w / 2, gy + 4 * cellSize + 25, viz.colors.orange, 14);
                                if (pat2.name === '1514') {
                                    viz.screenText('The year Durer created Melancholia I!', w / 2, gy + 4 * cellSize + 48, viz.colors.purple, 13);
                                }
                            }

                            viz.screenText('Click a pattern to highlight it', w / 2, h - 15, viz.colors.text, 11);
                        }

                        patterns.forEach(function(pat, idx) {
                            VizEngine.createButton(controls, pat.name, function() {
                                if (animTimer) { clearInterval(animTimer); animTimer = null; }
                                currentPattern = idx;
                                groupIndex = 0;
                                if (pat.groups.length > 1) {
                                    animTimer = setInterval(function() {
                                        groupIndex = (groupIndex + 1) % pat.groups.length;
                                        draw();
                                    }, 800);
                                }
                                draw();
                            });
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            currentPattern = -1;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In Durer\'s square, verify that the sum of the four corner cells equals 34.',
                    hint: 'The corners are 16, 13, 4, and 1.',
                    solution: '\\(16 + 13 + 4 + 1 = 34\\). This is an extra "bonus" property not required by the definition of a magic square, but present in Durer\'s construction.'
                },
                {
                    question: 'An \\(n \\times n\\) magic square must satisfy \\(2n + 2\\) line constraints (rows, columns, diagonals). How many constraints does a 4\\(\\times\\)4 square have? A 5\\(\\times\\)5?',
                    hint: 'Count rows + columns + 2 main diagonals.',
                    solution: 'For \\(n=4\\): \\(2(4)+2 = 10\\) constraints. For \\(n=5\\): \\(2(5)+2 = 12\\). Yet we only have \\(n^2\\) free variables (entries), so for large \\(n\\) the system becomes increasingly constrained.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 5: Magic Properties
        // ─────────────────────────────────────────────
        {
            id: 'sec-properties',
            title: 'Magic Properties',
            content: `
<h2>Properties of Magic Squares</h2>

<h3>The Magic Constant Formula</h3>

<p>For a normal \\(n \\times n\\) magic square (using numbers 1 through \\(n^2\\)), the magic constant is:</p>

\\[
M(n) = \\frac{n(n^2 + 1)}{2}
\\]

<p>The first few values:</p>
<ul>
<li>\\(n = 3\\): \\(M = 15\\)</li>
<li>\\(n = 4\\): \\(M = 34\\)</li>
<li>\\(n = 5\\): \\(M = 65\\)</li>
<li>\\(n = 6\\): \\(M = 111\\)</li>
<li>\\(n = 7\\): \\(M = 175\\)</li>
</ul>

<div class="viz-placeholder" data-viz="viz-magic-constant"></div>

<h3>Complementary Pairs</h3>

<p>In a normal \\(n \\times n\\) magic square, every number \\(k\\) has a <strong>complement</strong> \\(n^2 + 1 - k\\). For \\(n = 3\\), the complement of 2 is 8, the complement of 3 is 7, and so on. The complement of 5 is 5 itself (it is its own complement).</p>

<p>In many magic squares, complementary pairs are positioned symmetrically about the center. For example, in the Lo Shu: 2 is opposite 8, 4 is opposite 6, 1 is opposite 9, and 3 is opposite 7.</p>

<h3>Symmetries: Rotations and Reflections</h3>

<p>If you rotate or reflect a magic square, you get another valid magic square (the sums do not change because you are just rearranging the same rows, columns, and diagonals). A square has 8 symmetries: the identity, three rotations (90, 180, 270 degrees), and four reflections (horizontal, vertical, and two diagonal).</p>

<div class="viz-placeholder" data-viz="viz-rotation-reflection"></div>

<div class="viz-placeholder" data-viz="viz-magic-checker"></div>

<div class="env-block theorem">
<strong>Theorem.</strong> If \\(S\\) is a normal magic square, then every rotation and reflection of \\(S\\) is also a normal magic square with the same magic constant.
</div>

<p><strong>Proof.</strong> Rotation and reflection permute the set of rows, the set of columns, and the set of diagonals among themselves (possibly swapping diagonals). Since the sum of each row, column, and diagonal is preserved under permutation of its elements, the magic property is maintained. \\(\\square\\)</p>
`,
            visualizations: [
                {
                    id: 'viz-magic-constant',
                    title: 'Magic Constant Calculator',
                    description: 'See how the magic constant M = n(n²+1)/2 grows as n increases. The formula comes from distributing the total sum equally among n rows.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var nVal = 5;

                        function magicConst(nn) { return nn * (nn * nn + 1) / 2; }

                        function draw() {
                            viz.clear();
                            viz.screenText('Magic Constant: M = n(n² + 1) / 2', w / 2, 20, viz.colors.white, 16);

                            // Bar chart for n = 3 to 10
                            var barW = 40;
                            var gap = 15;
                            var nMin = 3, nMax = 10;
                            var count = nMax - nMin + 1;
                            var totalW = count * (barW + gap);
                            var startX = (w - totalW) / 2;
                            var chartBottom = h - 60;
                            var chartTop = 60;
                            var chartH = chartBottom - chartTop;

                            var maxM = magicConst(nMax);

                            for (var nn = nMin; nn <= nMax; nn++) {
                                var i = nn - nMin;
                                var mc = magicConst(nn);
                                var barH = (mc / maxM) * chartH;
                                var x = startX + i * (barW + gap);

                                var isSelected = nn === nVal;
                                ctx.fillStyle = isSelected ? viz.colors.orange : viz.colors.blue;
                                ctx.fillRect(x, chartBottom - barH, barW, barH);

                                // Label
                                ctx.fillStyle = isSelected ? viz.colors.orange : viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('n=' + nn, x + barW / 2, chartBottom + 5);

                                // Value on top of bar
                                ctx.fillStyle = isSelected ? viz.colors.orange : viz.colors.white;
                                ctx.font = (isSelected ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                ctx.textBaseline = 'bottom';
                                ctx.fillText(mc, x + barW / 2, chartBottom - barH - 4);
                            }

                            // Formula display
                            var mc2 = magicConst(nVal);
                            viz.screenText('n = ' + nVal + ':  M = ' + nVal + ' × (' + (nVal * nVal) + ' + 1) / 2 = ' + mc2, w / 2, h - 25, viz.colors.teal, 14);
                        }

                        VizEngine.createSlider(controls, 'n', 3, 10, nVal, 1, function(v) {
                            nVal = Math.round(v);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-rotation-reflection',
                    title: '8 Symmetries of a Magic Square',
                    description: 'See all 8 symmetries (4 rotations and 4 reflections) of the Lo Shu magic square. Each is a valid magic square with the same constant.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var base = [[2,7,6],[9,5,1],[4,3,8]];
                        var currentIdx = 0;

                        function rotate90(m) {
                            var n = m.length;
                            var r = [];
                            for (var i = 0; i < n; i++) {
                                r.push([]);
                                for (var j = 0; j < n; j++) {
                                    r[i].push(m[n - 1 - j][i]);
                                }
                            }
                            return r;
                        }

                        function reflectH(m) {
                            return m.slice().reverse();
                        }

                        function reflectV(m) {
                            return m.map(function(row) { return row.slice().reverse(); });
                        }

                        // Generate all 8 symmetries
                        var symmetries = [];
                        var names = ['Original', 'Rotate 90°', 'Rotate 180°', 'Rotate 270°',
                                     'Reflect horizontal', 'Reflect vertical', 'Reflect main diagonal', 'Reflect anti-diagonal'];
                        var s = base;
                        for (var rot = 0; rot < 4; rot++) {
                            symmetries.push(s);
                            s = rotate90(s);
                        }
                        symmetries.push(reflectH(base));
                        symmetries.push(reflectV(base));
                        // Main diagonal reflection: transpose
                        var tr = [];
                        for (var ti = 0; ti < 3; ti++) { tr.push([]); for (var tj = 0; tj < 3; tj++) tr[ti].push(base[tj][ti]); }
                        symmetries.push(tr);
                        // Anti-diagonal reflection: rotate 90 then reflect horizontal
                        symmetries.push(reflectH(rotate90(base)));

                        function drawSquare(m, ox, oy, cellSz, label) {
                            for (var r = 0; r < 3; r++) {
                                for (var c = 0; c < 3; c++) {
                                    var x = ox + c * cellSz;
                                    var y = oy + r * cellSz;
                                    ctx.fillStyle = '#1a1a40';
                                    ctx.fillRect(x, y, cellSz, cellSz);
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(x, y, cellSz, cellSz);
                                    ctx.fillStyle = viz.colors.white;
                                    ctx.font = 'bold ' + Math.round(cellSz * 0.38) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(m[r][c], x + cellSz / 2, y + cellSz / 2);
                                }
                            }
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText(label, ox + cellSz * 1.5, oy + cellSz * 3 + 4);
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('8 Symmetries of the Lo Shu', w / 2, 18, viz.colors.white, 16);

                            // Draw all 8 in a 4x2 grid
                            var cellSz = Math.min((w - 100) / 12, (h - 100) / 6) * 0.9;
                            var gridW = cellSz * 3;
                            var hgap = (w - 4 * gridW) / 5;
                            var vgap = 16;
                            var startY = 45;

                            for (var i = 0; i < 8; i++) {
                                var col = i % 4;
                                var row = Math.floor(i / 4);
                                var ox = hgap + col * (gridW + hgap);
                                var oy = startY + row * (cellSz * 3 + vgap + 18);

                                var isActive = i === currentIdx;
                                if (isActive) {
                                    ctx.fillStyle = viz.colors.blue + '22';
                                    ctx.fillRect(ox - 4, oy - 4, gridW + 8, cellSz * 3 + 24);
                                    ctx.strokeStyle = viz.colors.blue;
                                    ctx.lineWidth = 2;
                                    ctx.strokeRect(ox - 4, oy - 4, gridW + 8, cellSz * 3 + 24);
                                }

                                drawSquare(symmetries[i], ox, oy, cellSz, names[i]);
                            }

                            viz.screenText('All 8 are valid magic squares with M = 15', w / 2, h - 15, viz.colors.teal, 12);
                        }

                        VizEngine.createSlider(controls, 'Highlight', 0, 7, 0, 1, function(v) {
                            currentIdx = Math.round(v);
                            draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-magic-checker',
                    title: 'Magic Square Checker',
                    description: 'Enter any 3x3 or 4x4 arrangement and check if it is a magic square. The tool computes all row, column, and diagonal sums.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var n = 3;
                        var grid = [2,7,6,9,5,1,4,3,8]; // Start with Lo Shu

                        // Create input fields
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px;justify-content:center;';

                        var inputs = [];

                        function buildInputs() {
                            inputDiv.innerHTML = '';
                            inputs = [];
                            for (var i = 0; i < n * n; i++) {
                                var inp = document.createElement('input');
                                inp.type = 'number';
                                inp.min = 1;
                                inp.max = n * n;
                                inp.value = grid[i] || '';
                                inp.style.cssText = 'width:36px;height:36px;text-align:center;background:#1a1a40;color:#f0f6fc;border:1px solid #30363d;border-radius:4px;font-size:14px;';
                                if (i % n === 0 && i > 0) {
                                    var br = document.createElement('div');
                                    br.style.cssText = 'width:100%;height:0;';
                                    inputDiv.appendChild(br);
                                }
                                inp.addEventListener('input', function() { readAndDraw(); });
                                inputDiv.appendChild(inp);
                                inputs.push(inp);
                            }
                        }

                        container.parentElement.insertBefore(inputDiv, container);

                        function readAndDraw() {
                            grid = [];
                            for (var i = 0; i < inputs.length; i++) {
                                grid.push(parseInt(inputs[i].value) || 0);
                            }
                            draw();
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('Magic Square Checker (' + n + '×' + n + ')', w / 2, 18, viz.colors.white, 16);

                            // Compute sums
                            var rowSums = [];
                            var colSums = [];
                            var diag1 = 0, diag2 = 0;

                            for (var r = 0; r < n; r++) {
                                var rs = 0;
                                for (var c = 0; c < n; c++) rs += grid[r * n + c];
                                rowSums.push(rs);
                            }
                            for (var c2 = 0; c2 < n; c2++) {
                                var cs = 0;
                                for (var r2 = 0; r2 < n; r2++) cs += grid[r2 * n + c2];
                                colSums.push(cs);
                            }
                            for (var d = 0; d < n; d++) {
                                diag1 += grid[d * n + d];
                                diag2 += grid[d * n + (n - 1 - d)];
                            }

                            var allSums = rowSums.concat(colSums, [diag1, diag2]);
                            var target = n * (n * n + 1) / 2;
                            var allMatch = allSums.every(function(s) { return s === target; });
                            var allFilled = grid.every(function(v) { return v > 0; });

                            // Check distinct
                            var distinct = true;
                            if (allFilled) {
                                var seen = {};
                                for (var i = 0; i < grid.length; i++) {
                                    if (seen[grid[i]]) { distinct = false; break; }
                                    seen[grid[i]] = true;
                                }
                            }

                            // Display sums
                            var y0 = 45;
                            var col1 = 40, col2 = w / 2, col3 = w - 120;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';

                            viz.screenText('Row sums:', col1, y0, viz.colors.text, 13, 'left');
                            for (var ri = 0; ri < n; ri++) {
                                var c3 = rowSums[ri] === target ? viz.colors.green : viz.colors.red;
                                viz.screenText('Row ' + (ri + 1) + ': ' + rowSums[ri], col1, y0 + 20 + ri * 18, allFilled ? c3 : viz.colors.text, 12, 'left');
                            }

                            viz.screenText('Column sums:', col2, y0, viz.colors.text, 13, 'center');
                            for (var ci = 0; ci < n; ci++) {
                                var c4 = colSums[ci] === target ? viz.colors.green : viz.colors.red;
                                viz.screenText('Col ' + (ci + 1) + ': ' + colSums[ci], col2, y0 + 20 + ci * 18, allFilled ? c4 : viz.colors.text, 12, 'center');
                            }

                            viz.screenText('Diagonal sums:', col3, y0, viz.colors.text, 13, 'left');
                            var cd1 = diag1 === target ? viz.colors.green : viz.colors.red;
                            var cd2 = diag2 === target ? viz.colors.green : viz.colors.red;
                            viz.screenText('Main: ' + diag1, col3, y0 + 20, allFilled ? cd1 : viz.colors.text, 12, 'left');
                            viz.screenText('Anti: ' + diag2, col3, y0 + 38, allFilled ? cd2 : viz.colors.text, 12, 'left');

                            // Verdict
                            var verdictY = y0 + 20 + n * 18 + 15;
                            viz.screenText('Target magic constant: ' + target, w / 2, verdictY, viz.colors.teal, 13);

                            if (allFilled) {
                                if (allMatch && distinct) {
                                    viz.screenText('This IS a magic square!', w / 2, verdictY + 25, viz.colors.green, 16);
                                } else if (!distinct) {
                                    viz.screenText('Numbers must be distinct.', w / 2, verdictY + 25, viz.colors.red, 14);
                                } else {
                                    var badCount = allSums.filter(function(s) { return s !== target; }).length;
                                    viz.screenText('Not magic: ' + badCount + ' line(s) have wrong sum.', w / 2, verdictY + 25, viz.colors.red, 14);
                                }
                            } else {
                                viz.screenText('Fill in all cells to check.', w / 2, verdictY + 25, viz.colors.text, 13);
                            }
                        }

                        VizEngine.createButton(controls, '3×3', function() {
                            n = 3;
                            grid = [2,7,6,9,5,1,4,3,8];
                            buildInputs();
                            draw();
                        });

                        VizEngine.createButton(controls, '4×4', function() {
                            n = 4;
                            grid = [16,3,2,13,5,10,11,8,9,6,7,12,4,15,14,1];
                            buildInputs();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            grid = [];
                            for (var i = 0; i < n * n; i++) grid.push(0);
                            buildInputs();
                            draw();
                        });

                        buildInputs();
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'If you add the same constant \\(k\\) to every entry of a magic square, is the result still a magic square? What is the new magic constant?',
                    hint: 'Each row of \\(n\\) entries increases by \\(nk\\).',
                    solution: 'Yes, it is still a magic square. Each line of \\(n\\) entries gains \\(n \\times k\\), so the new magic constant is \\(M + nk\\). The numbers are no longer 1 through \\(n^2\\), so it is not a "normal" magic square, but it satisfies the equal-sum condition.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 6: Bridge to Next Chapter
        // ─────────────────────────────────────────────
        {
            id: 'sec-bridge',
            title: 'Beyond Magic Squares',
            content: `
<h2>Beyond Magic Squares</h2>

<p>Magic squares are one of the oldest examples of a <strong>constraint satisfaction problem</strong>: given a set of rules, find an arrangement that satisfies all of them simultaneously. This style of mathematical thinking appears everywhere.</p>

<h3>Variations and Generalizations</h3>

<ul>
<li><strong>Magic cubes.</strong> Extend the idea to three dimensions. Each row, column, pillar, and space diagonal sums to the same constant.</li>
<li><strong>Pandiagonal (panmagic) squares.</strong> Not only do the two main diagonals sum correctly, but so do all the "broken diagonals" (diagonals that wrap around the edges).</li>
<li><strong>Multimagic squares.</strong> A bimagic square remains magic even when every entry is squared. A trimagic square stays magic when entries are squared or cubed.</li>
<li><strong>Most-perfect magic squares.</strong> A 4\\(n \\times 4n\\) square where every 2\\(\\times\\)2 sub-square sums to the same value, and all pandiagonals work.</li>
</ul>

<h3>Open Problems</h3>

<p>Believe it or not, there are open questions about magic squares:</p>

<div class="env-block remark">
<strong>The 3\\(\\times\\)3 magic square of squares.</strong> Does there exist a 3\\(\\times\\)3 magic square where every entry is a perfect square and all entries are distinct? This problem, related to Euler's work, remains unsolved. Some partial solutions have been found (e.g., where all rows and columns work but one diagonal fails), but no complete solution is known.
</div>

<h3>Connection to Sudoku</h3>

<p>Magic squares are close cousins of Sudoku puzzles. A Sudoku grid is a 9\\(\\times\\)9 Latin square (each number 1-9 appears once per row and column) with the extra constraint that each 3\\(\\times\\)3 box also contains each number once. Magic squares add a different constraint (equal sums) rather than the box constraint. Both are fundamentally about arranging numbers under strict rules.</p>

<p>In the next chapter, we will explore more number tricks and surprises, building on the pattern-spotting skills we developed here.</p>

<div class="env-block intuition">
<strong>The Big Takeaway</strong><br>
Magic squares teach a critical mathematical skill: satisfying multiple constraints simultaneously. When you built a magic square, you could not just make the rows work; you had to keep all the columns and diagonals in mind too. This kind of multi-constraint thinking appears in scheduling, optimization, puzzle design, and much of higher mathematics.
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'A pandiagonal magic square has the property that broken diagonals also sum to the magic constant. The smallest pandiagonal normal magic square is 4\\(\\times\\)4. Can you find one? (Hint: it is NOT Durer\'s square.)',
                    hint: 'A broken diagonal of a 4\\(\\times\\)4 square wraps around. For example, cells (0,1), (1,2), (2,3), (3,0) form a broken diagonal. Try systematic search or look up pandiagonal squares.',
                    solution: 'One example: \\(\\begin{pmatrix} 1 & 8 & 13 & 12 \\\\ 14 & 11 & 2 & 7 \\\\ 4 & 5 & 16 & 9 \\\\ 15 & 10 & 3 & 6 \\end{pmatrix}\\). Every row, column, main diagonal, and broken diagonal sums to 34.'
                }
            ]
        }
    ]
});
})();
