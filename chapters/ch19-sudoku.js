// === Chapter 19: Sudoku & Latin Squares ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch19',
    number: 19,
    title: 'Sudoku & Latin Squares',
    subtitle: 'From ancient puzzle grids to the art of constraint satisfaction',
    sections: [
        // ─────────────────────────────────────────────
        // Section 1: What is a Latin Square?
        // ─────────────────────────────────────────────
        {
            id: 'sec-latin-square',
            title: 'What Is a Latin Square?',
            content: `
<h2>An Elegant Grid</h2>

<p>Long before Sudoku appeared in Japanese puzzle magazines, mathematicians studied a beautiful structure called a <strong>Latin square</strong>. The name comes from the 18th-century mathematician Leonhard Euler (him again!), who used Latin letters to label the rows.</p>

<div class="env-block definition">
<strong>Latin Square.</strong> A <em>Latin square</em> of order \\(n\\) is an \\(n \\times n\\) grid filled with \\(n\\) different symbols, such that each symbol appears exactly once in every row and exactly once in every column.
</div>

<p>Here is a Latin square of order 3:</p>

\\[
\\begin{pmatrix}
A & B & C \\\\
B & C & A \\\\
C & A & B
\\end{pmatrix}
\\]

<p>Every row contains each of A, B, C exactly once. Every column contains each of A, B, C exactly once. That is all a Latin square requires.</p>

<h3>Counting Latin Squares</h3>

<p>How many Latin squares of order \\(n\\) are there? This turns out to be a hard problem. The known values are:</p>
<ul>
<li>Order 1: just 1</li>
<li>Order 2: just 2</li>
<li>Order 3: 12</li>
<li>Order 4: 576</li>
<li>Order 5: 161,280</li>
</ul>

<p>The numbers grow explosively. There is no simple closed-form formula.</p>

<div class="viz-placeholder" data-viz="viz-latin-square"></div>

<h3>Latin Squares in Real Life</h3>

<p>Latin squares are not just mathematical toys. They are used in:</p>
<ul>
<li><strong>Experimental design.</strong> Farmers testing 4 types of fertilizer on a 4\\(\\times\\)4 grid of plots use a Latin square design so that each fertilizer appears once in each row and each column, controlling for spatial variation.</li>
<li><strong>Tournament scheduling.</strong> If 4 teams must each play every other team exactly once on 3 different days, a Latin-square-like schedule ensures fairness.</li>
<li><strong>Error-correcting codes.</strong> Certain Latin squares generate codes that can detect and correct transmission errors.</li>
</ul>

<div class="env-block remark">
<strong>Euler's 36 officers problem (1782).</strong> Euler asked: can 36 officers, drawn from 6 regiments and holding 6 different ranks, be arranged in a 6\\(\\times\\)6 square so that each row and each column contains one officer of each rank and one from each regiment? This requires two <em>orthogonal</em> Latin squares of order 6. Euler conjectured it was impossible, and he was right; this was finally proved in 1901 by Gaston Tarry, who checked all possibilities by hand.
</div>
`,
            visualizations: [
                {
                    id: 'viz-latin-square',
                    title: 'Latin Square Generator',
                    description: 'Click "Generate" to see random Latin squares of different sizes. Each symbol (shown as a colored number) appears exactly once per row and once per column.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var n = 4;
                        var grid = null;

                        var cellColors = [
                            viz.colors.blue, viz.colors.orange, viz.colors.green,
                            viz.colors.purple, viz.colors.teal, viz.colors.pink,
                            viz.colors.gold, viz.colors.red, viz.colors.yellow
                        ];

                        function generateLatin(size) {
                            // Generate by cyclic construction then shuffle rows/cols
                            var sq = [];
                            for (var r = 0; r < size; r++) {
                                sq.push([]);
                                for (var c = 0; c < size; c++) {
                                    sq[r].push((r + c) % size);
                                }
                            }
                            // Shuffle rows
                            for (var i = size - 1; i > 0; i--) {
                                var j = Math.floor(Math.random() * (i + 1));
                                var tmp = sq[i]; sq[i] = sq[j]; sq[j] = tmp;
                            }
                            // Shuffle columns
                            for (var ci = size - 1; ci > 0; ci--) {
                                var cj = Math.floor(Math.random() * (ci + 1));
                                for (var ri = 0; ri < size; ri++) {
                                    var t = sq[ri][ci]; sq[ri][ci] = sq[ri][cj]; sq[ri][cj] = t;
                                }
                            }
                            // Shuffle symbols
                            var perm = [];
                            for (var p = 0; p < size; p++) perm.push(p);
                            for (var pi = size - 1; pi > 0; pi--) {
                                var pj = Math.floor(Math.random() * (pi + 1));
                                var pt = perm[pi]; perm[pi] = perm[pj]; perm[pj] = pt;
                            }
                            for (var rr = 0; rr < size; rr++) {
                                for (var cc = 0; cc < size; cc++) {
                                    sq[rr][cc] = perm[sq[rr][cc]];
                                }
                            }
                            return sq;
                        }

                        function draw() {
                            viz.clear();
                            if (!grid) { grid = generateLatin(n); }

                            var cellSize = Math.min((w - 60) / n, (h - 60) / n, 80);
                            var gw = cellSize * n;
                            var gh = cellSize * n;
                            var ox = (w - gw) / 2;
                            var oy = (h - gh) / 2;

                            for (var r = 0; r < n; r++) {
                                for (var c = 0; c < n; c++) {
                                    var x = ox + c * cellSize;
                                    var y = oy + r * cellSize;
                                    var val = grid[r][c];
                                    ctx.fillStyle = cellColors[val % cellColors.length] + '33';
                                    ctx.fillRect(x, y, cellSize, cellSize);
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(x, y, cellSize, cellSize);
                                    ctx.fillStyle = cellColors[val % cellColors.length];
                                    ctx.font = 'bold ' + Math.round(cellSize * 0.45) + 'px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(val + 1, x + cellSize / 2, y + cellSize / 2);
                                }
                            }

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            ctx.fillText('Latin square of order ' + n, w / 2, 8);
                        }

                        VizEngine.createButton(controls, 'Generate', function() { grid = generateLatin(n); draw(); });

                        var slider = VizEngine.createSlider(controls, 'Size n', 2, 9, n, 1, function(val) {
                            n = Math.round(val);
                            grid = generateLatin(n);
                            draw();
                        });

                        grid = generateLatin(n);
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'Write down all Latin squares of order 2. How many are there?',
                    hint: 'With symbols 1 and 2, fill a 2\\(\\times\\)2 grid so each row and column has both symbols.',
                    solution: 'There are exactly 2. They are: \\(\\begin{pmatrix} 1 & 2 \\\\ 2 & 1 \\end{pmatrix}\\) and \\(\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}\\). Once you fix the first row, the second row is forced (each column must have both symbols).'
                },
                {
                    question: 'Show that a Latin square of order \\(n\\) uses exactly \\(n^2\\) symbols total (with repetition), and each symbol appears exactly \\(n\\) times.',
                    hint: 'The grid has \\(n\\) rows, each with \\(n\\) cells. Each row contains each symbol once.',
                    solution: 'The grid has \\(n \\times n = n^2\\) cells, so it uses \\(n^2\\) symbols total. Each of the \\(n\\) rows contains each of the \\(n\\) symbols exactly once, so each symbol appears \\(n\\) times (once per row). Alternatively, each symbol appears once per column, and there are \\(n\\) columns, giving \\(n\\) appearances.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 2: From Latin Squares to Sudoku
        // ─────────────────────────────────────────────
        {
            id: 'sec-latin-to-sudoku',
            title: 'From Latin Squares to Sudoku',
            content: `
<h2>Adding Boxes</h2>

<p>A standard Sudoku grid is a 9\\(\\times\\)9 Latin square with an extra constraint: the grid is divided into nine 3\\(\\times\\)3 <strong>boxes</strong>, and each box must also contain the digits 1 through 9 exactly once.</p>

<div class="env-block definition">
<strong>Sudoku.</strong> A <em>Sudoku puzzle</em> is a partially filled 9\\(\\times\\)9 grid. The goal is to complete it so that:
<ol>
<li>Each row contains the digits 1 through 9 exactly once.</li>
<li>Each column contains the digits 1 through 9 exactly once.</li>
<li>Each of the nine 3\\(\\times\\)3 boxes contains the digits 1 through 9 exactly once.</li>
</ol>
A valid puzzle has exactly one solution.
</div>

<p>In other words, Sudoku = Latin square + box constraint. The box constraint makes Sudoku much harder than a plain Latin square, but also much more interesting.</p>

<h3>The Graph Theory Connection</h3>

<p>As we hinted at in the previous chapter, Sudoku is a graph coloring problem. Build a graph with 81 vertices (one per cell). Connect two vertices with an edge if the corresponding cells share a row, column, or box. Each vertex is adjacent to exactly 20 others. Solving the Sudoku means finding a proper 9-coloring of this graph (with some colors pre-assigned by the given clues).</p>

<h3>Mini-Sudoku: 4\\(\\times\\)4</h3>

<p>Before tackling a full 9\\(\\times\\)9 grid, let us practice with a 4\\(\\times\\)4 mini-Sudoku. The rules are the same, scaled down: fill the grid with digits 1 through 4 so that each row, column, and 2\\(\\times\\)2 box contains each digit exactly once.</p>

<div class="viz-placeholder" data-viz="viz-mini-sudoku"></div>

<div class="env-block remark">
<strong>How many valid Sudoku grids are there?</strong> The answer, computed by Bertram Felgenhauer and Frazer Jarvis in 2005, is exactly 6,670,903,752,021,072,936,960, or approximately \\(6.67 \\times 10^{21}\\). That is about 6.67 sextillion. Even after accounting for symmetries (rotations, reflections, relabeling digits), there are still 5,472,730,538 essentially different Sudoku grids.
</div>
`,
            visualizations: [
                {
                    id: 'viz-mini-sudoku',
                    title: 'Playable 4\u00d74 Mini-Sudoku',
                    description: 'Click a cell to select it, then type a number (1-4) to fill it. Red highlights show conflicts. Can you solve it?',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        // Puzzles: 0 = empty, negative = given clue
                        var puzzles = [
                            [[-1, 0, 0,-4],
                             [ 0,-3, 0, 0],
                             [ 0, 0,-2, 0],
                             [-3, 0, 0,-1]],
                            [[ 0,-2, 0, 0],
                             [-4, 0, 0,-2],
                             [-1, 0, 0,-3],
                             [ 0, 0,-1, 0]],
                            [[ 0, 0,-3, 0],
                             [-3, 0, 0,-1],
                             [-2, 0, 0,-4],
                             [ 0,-1, 0, 0]]
                        ];
                        var pIdx = 0;
                        var grid = [];
                        var given = [];
                        var selR = -1, selC = -1;

                        function loadPuzzle(idx) {
                            grid = []; given = [];
                            for (var r = 0; r < 4; r++) {
                                grid.push([]);
                                given.push([]);
                                for (var c = 0; c < 4; c++) {
                                    var v = puzzles[idx][r][c];
                                    if (v < 0) { grid[r].push(-v); given[r].push(true); }
                                    else { grid[r].push(0); given[r].push(false); }
                                }
                            }
                            selR = -1; selC = -1;
                        }

                        function conflicts(r, c) {
                            if (grid[r][c] === 0) return false;
                            var v = grid[r][c];
                            // row
                            for (var cc = 0; cc < 4; cc++) { if (cc !== c && grid[r][cc] === v) return true; }
                            // col
                            for (var rr = 0; rr < 4; rr++) { if (rr !== r && grid[rr][c] === v) return true; }
                            // box
                            var br = Math.floor(r / 2) * 2, bc = Math.floor(c / 2) * 2;
                            for (var bi = br; bi < br + 2; bi++) {
                                for (var bj = bc; bj < bc + 2; bj++) {
                                    if (bi !== r || bj !== c) {
                                        if (grid[bi][bj] === v) return true;
                                    }
                                }
                            }
                            return false;
                        }

                        function isSolved() {
                            for (var r = 0; r < 4; r++) {
                                for (var c = 0; c < 4; c++) {
                                    if (grid[r][c] === 0 || conflicts(r, c)) return false;
                                }
                            }
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            var cellSize = Math.min((w - 80) / 4, (h - 80) / 4, 90);
                            var gw = cellSize * 4;
                            var gh = cellSize * 4;
                            var ox = (w - gw) / 2;
                            var oy = (h - gh) / 2;

                            // cells
                            for (var r = 0; r < 4; r++) {
                                for (var c = 0; c < 4; c++) {
                                    var x = ox + c * cellSize;
                                    var y = oy + r * cellSize;
                                    var isConflict = grid[r][c] > 0 && conflicts(r, c);
                                    var isSelected = r === selR && c === selC;

                                    // background
                                    if (isSelected) ctx.fillStyle = viz.colors.blue + '44';
                                    else if (isConflict) ctx.fillStyle = viz.colors.red + '22';
                                    else if (given[r][c]) ctx.fillStyle = '#1a1a40';
                                    else ctx.fillStyle = '#111130';
                                    ctx.fillRect(x, y, cellSize, cellSize);

                                    // number
                                    if (grid[r][c] > 0) {
                                        ctx.fillStyle = given[r][c] ? viz.colors.white :
                                                       (isConflict ? viz.colors.red : viz.colors.teal);
                                        ctx.font = (given[r][c] ? 'bold ' : '') + Math.round(cellSize * 0.5) + 'px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(grid[r][c], x + cellSize / 2, y + cellSize / 2);
                                    }
                                }
                            }

                            // grid lines
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 1;
                            for (var i = 0; i <= 4; i++) {
                                ctx.beginPath();
                                ctx.moveTo(ox + i * cellSize, oy);
                                ctx.lineTo(ox + i * cellSize, oy + gh);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(ox, oy + i * cellSize);
                                ctx.lineTo(ox + gw, oy + i * cellSize);
                                ctx.stroke();
                            }
                            // thick box lines
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 3;
                            for (var bi = 0; bi <= 2; bi++) {
                                ctx.beginPath();
                                ctx.moveTo(ox + bi * 2 * cellSize, oy);
                                ctx.lineTo(ox + bi * 2 * cellSize, oy + gh);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(ox, oy + bi * 2 * cellSize);
                                ctx.lineTo(ox + gw, oy + bi * 2 * cellSize);
                                ctx.stroke();
                            }

                            // status
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            if (isSolved()) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.fillText('Solved! Well done!', w / 2, 8);
                            } else {
                                ctx.fillText('Click a cell, then type 1-4. Press Delete to clear.', w / 2, 8);
                            }

                            // store layout for hit detection
                            draw._ox = ox; draw._oy = oy; draw._cs = cellSize;
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var cs = draw._cs, ox2 = draw._ox, oy2 = draw._oy;
                            var c = Math.floor((mx - ox2) / cs);
                            var r = Math.floor((my - oy2) / cs);
                            if (r >= 0 && r < 4 && c >= 0 && c < 4 && !given[r][c]) {
                                selR = r; selC = c;
                            } else {
                                selR = -1; selC = -1;
                            }
                            draw();
                            viz.canvas.focus();
                        });

                        viz.canvas.setAttribute('tabindex', '0');
                        viz.canvas.addEventListener('keydown', function(e) {
                            if (selR < 0 || selC < 0) return;
                            var key = e.key;
                            if (key >= '1' && key <= '4') {
                                grid[selR][selC] = parseInt(key);
                                draw();
                            } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
                                grid[selR][selC] = 0;
                                draw();
                            } else if (key === 'ArrowUp' && selR > 0) { selR--; draw(); }
                            else if (key === 'ArrowDown' && selR < 3) { selR++; draw(); }
                            else if (key === 'ArrowLeft' && selC > 0) { selC--; draw(); }
                            else if (key === 'ArrowRight' && selC < 3) { selC++; draw(); }
                            e.preventDefault();
                        });

                        VizEngine.createButton(controls, 'New Puzzle', function() {
                            pIdx = (pIdx + 1) % puzzles.length;
                            loadPuzzle(pIdx);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            for (var r = 0; r < 4; r++) {
                                for (var c = 0; c < 4; c++) {
                                    if (!given[r][c]) grid[r][c] = 0;
                                }
                            }
                            selR = -1; selC = -1;
                            draw();
                        });

                        loadPuzzle(0);
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a 4\\(\\times\\)4 Sudoku, each cell "sees" how many other cells (same row, column, or box)?',
                    hint: 'Count: 3 in the same row (excluding itself), 3 in the same column, and how many in the box that are not already counted?',
                    solution: 'Each cell shares its row with 3 others, its column with 3 others, and its 2\\(\\times\\)2 box with 3 others. But the box overlaps with 1 cell from the row and 1 from the column, so the box adds only 1 new cell. Total: 3 + 3 + 1 = 7 cells. (In 9\\(\\times\\)9 Sudoku, the answer is 20.)'
                },
                {
                    question: 'How many completed 4\\(\\times\\)4 Sudoku grids are there? (Hint: it is much smaller than the number of 4\\(\\times\\)4 Latin squares.)',
                    hint: 'Try filling in the first row (4! ways), then see how the box constraints limit the second row, and so on.',
                    solution: 'There are exactly 288 completed 4\\(\\times\\)4 Sudoku grids. Compare this with the 576 Latin squares of order 4; the box constraint eliminates exactly half of them. This can be verified by systematic enumeration.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 3: Solving Strategies
        // ─────────────────────────────────────────────
        {
            id: 'sec-solving-strategies',
            title: 'Solving Strategies',
            content: `
<h2>Thinking Like a Sudoku Solver</h2>

<p>Good Sudoku solvers do not guess. They use logic. The two most fundamental techniques are called <strong>naked singles</strong> and <strong>hidden singles</strong>.</p>

<h3>Naked Singles</h3>

<div class="env-block definition">
<strong>Naked Single.</strong> If a cell has only one possible value (all other digits are eliminated by the row, column, and box constraints), that value must go in that cell.
</div>

<p>This is the most basic technique. Look at each empty cell, list which digits 1-9 are already used in its row, column, and box, and see what is left. If only one digit remains, fill it in.</p>

<h3>Hidden Singles</h3>

<div class="env-block definition">
<strong>Hidden Single.</strong> If a particular digit can only go in one cell within a row, column, or box (even though that cell might have other candidates), that digit must go there.
</div>

<p>For example, suppose that within Box 1, the digit 7 can only fit in one particular cell (all other cells in the box already see a 7 in their row or column). Then 7 must go in that cell, even if that cell also allows other digits.</p>

<h3>Pencil Marks</h3>

<p>Experienced solvers write small "pencil marks" in each cell, listing all digits that could potentially go there. As you fill in cells, you eliminate pencil marks from related cells. The interactive Sudoku below supports pencil marks.</p>

<div class="viz-placeholder" data-viz="viz-sudoku-9x9"></div>

<h3>More Advanced Techniques</h3>

<p>Harder Sudoku puzzles require more sophisticated logic:</p>
<ul>
<li><strong>Naked pairs/triples:</strong> If two cells in a row can only contain the same two digits, those digits are eliminated from all other cells in that row.</li>
<li><strong>Pointing pairs:</strong> If within a box, a digit can only appear in one row (or column), then that digit is eliminated from that row (or column) outside the box.</li>
<li><strong>X-wing, Swordfish:</strong> Pattern-based eliminations across multiple rows and columns.</li>
</ul>

<div class="env-block intuition">
<strong>Sudoku is constraint propagation.</strong> Every time you place a digit, it constrains all cells in the same row, column, and box. These constraints cascade: filling one cell may create a naked single elsewhere, which fills another cell, which creates another naked single, and so on. Easy puzzles can be solved entirely by this cascade. Hard puzzles require you to look deeper.
</div>
`,
            visualizations: [
                {
                    id: 'viz-sudoku-9x9',
                    title: 'Playable 9\u00d79 Sudoku',
                    description: 'Click a cell, then type 1-9 to fill it. Toggle "Pencil" mode to add/remove pencil marks. Red = conflict. Arrow keys navigate.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        // A valid puzzle
                        var puzzleStr = [
                            '530070000',
                            '600195000',
                            '098000060',
                            '800060003',
                            '400803001',
                            '700020006',
                            '060000280',
                            '000419005',
                            '000080079'
                        ];

                        var grid = [];
                        var given = [];
                        var pencil = []; // pencil[r][c] = Set of pencil marks
                        var selR = -1, selC = -1;
                        var pencilMode = false;

                        function loadPuzzle(pStr) {
                            grid = []; given = []; pencil = [];
                            for (var r = 0; r < 9; r++) {
                                grid.push([]);
                                given.push([]);
                                pencil.push([]);
                                for (var c = 0; c < 9; c++) {
                                    var v = parseInt(pStr[r][c]);
                                    grid[r].push(v);
                                    given[r].push(v > 0);
                                    pencil[r].push({});
                                }
                            }
                        }

                        function conflicts(r, c) {
                            if (grid[r][c] === 0) return false;
                            var v = grid[r][c];
                            for (var cc = 0; cc < 9; cc++) { if (cc !== c && grid[r][cc] === v) return true; }
                            for (var rr = 0; rr < 9; rr++) { if (rr !== r && grid[rr][c] === v) return true; }
                            var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
                            for (var bi = br; bi < br + 3; bi++) {
                                for (var bj = bc; bj < bc + 3; bj++) {
                                    if ((bi !== r || bj !== c) && grid[bi][bj] === v) return true;
                                }
                            }
                            return false;
                        }

                        function isSolved() {
                            for (var r = 0; r < 9; r++) {
                                for (var c = 0; c < 9; c++) {
                                    if (grid[r][c] === 0 || conflicts(r, c)) return false;
                                }
                            }
                            return true;
                        }

                        function draw() {
                            viz.clear();
                            var cellSize = Math.min((w - 40) / 9, (h - 50) / 9, 55);
                            var gw = cellSize * 9;
                            var gh = cellSize * 9;
                            var ox = (w - gw) / 2;
                            var oy = (h - gh) / 2 + 10;

                            // cells
                            for (var r = 0; r < 9; r++) {
                                for (var c = 0; c < 9; c++) {
                                    var x = ox + c * cellSize;
                                    var y = oy + r * cellSize;
                                    var isConflict = grid[r][c] > 0 && conflicts(r, c);
                                    var isSelected = r === selR && c === selC;

                                    // highlight row/col/box of selected
                                    var inSameGroup = false;
                                    if (selR >= 0 && selC >= 0) {
                                        if (r === selR || c === selC ||
                                            (Math.floor(r / 3) === Math.floor(selR / 3) &&
                                             Math.floor(c / 3) === Math.floor(selC / 3))) {
                                            inSameGroup = true;
                                        }
                                    }

                                    if (isSelected) ctx.fillStyle = viz.colors.blue + '55';
                                    else if (isConflict) ctx.fillStyle = viz.colors.red + '22';
                                    else if (inSameGroup) ctx.fillStyle = '#1a1a50';
                                    else if (given[r][c]) ctx.fillStyle = '#141435';
                                    else ctx.fillStyle = '#111130';
                                    ctx.fillRect(x, y, cellSize, cellSize);

                                    // number
                                    if (grid[r][c] > 0) {
                                        ctx.fillStyle = given[r][c] ? viz.colors.white :
                                                       (isConflict ? viz.colors.red : viz.colors.teal);
                                        ctx.font = (given[r][c] ? 'bold ' : '') + Math.round(cellSize * 0.52) + 'px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(grid[r][c], x + cellSize / 2, y + cellSize / 2);
                                    } else {
                                        // pencil marks
                                        var marks = pencil[r][c];
                                        var pSize = Math.max(7, Math.round(cellSize * 0.22));
                                        ctx.fillStyle = viz.colors.text;
                                        ctx.font = pSize + 'px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        for (var d = 1; d <= 9; d++) {
                                            if (marks[d]) {
                                                var pr = Math.floor((d - 1) / 3);
                                                var pc = (d - 1) % 3;
                                                var px = x + (pc + 0.5) * cellSize / 3;
                                                var py = y + (pr + 0.5) * cellSize / 3;
                                                ctx.fillText(d, px, py);
                                            }
                                        }
                                    }
                                }
                            }

                            // grid lines
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 0.5;
                            for (var i = 0; i <= 9; i++) {
                                ctx.beginPath();
                                ctx.moveTo(ox + i * cellSize, oy);
                                ctx.lineTo(ox + i * cellSize, oy + gh);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(ox, oy + i * cellSize);
                                ctx.lineTo(ox + gw, oy + i * cellSize);
                                ctx.stroke();
                            }
                            // thick box lines
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2.5;
                            for (var bi = 0; bi <= 3; bi++) {
                                ctx.beginPath();
                                ctx.moveTo(ox + bi * 3 * cellSize, oy);
                                ctx.lineTo(ox + bi * 3 * cellSize, oy + gh);
                                ctx.stroke();
                                ctx.beginPath();
                                ctx.moveTo(ox, oy + bi * 3 * cellSize);
                                ctx.lineTo(ox + gw, oy + bi * 3 * cellSize);
                                ctx.stroke();
                            }

                            // status
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            if (isSolved()) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.fillText('Congratulations! Puzzle solved!', w / 2, 4);
                            } else {
                                ctx.fillStyle = pencilMode ? viz.colors.purple : viz.colors.text;
                                ctx.fillText('Mode: ' + (pencilMode ? 'PENCIL' : 'FILL') +
                                             '   |   Click cell, type 1-9. Delete to clear.', w / 2, 4);
                            }

                            draw._ox = ox; draw._oy = oy; draw._cs = cellSize;
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                            var cs = draw._cs, ox2 = draw._ox, oy2 = draw._oy;
                            var c = Math.floor((mx - ox2) / cs);
                            var r = Math.floor((my - oy2) / cs);
                            if (r >= 0 && r < 9 && c >= 0 && c < 9 && !given[r][c]) {
                                selR = r; selC = c;
                            } else {
                                selR = -1; selC = -1;
                            }
                            draw();
                            viz.canvas.focus();
                        });

                        viz.canvas.setAttribute('tabindex', '0');
                        viz.canvas.addEventListener('keydown', function(e) {
                            if (selR < 0 || selC < 0) return;
                            var key = e.key;
                            if (key >= '1' && key <= '9') {
                                var digit = parseInt(key);
                                if (pencilMode) {
                                    if (grid[selR][selC] === 0) {
                                        if (pencil[selR][selC][digit]) delete pencil[selR][selC][digit];
                                        else pencil[selR][selC][digit] = true;
                                    }
                                } else {
                                    grid[selR][selC] = digit;
                                    pencil[selR][selC] = {};
                                }
                                draw();
                            } else if (key === 'Backspace' || key === 'Delete' || key === '0') {
                                grid[selR][selC] = 0;
                                draw();
                            } else if (key === 'ArrowUp' && selR > 0) { selR--; draw(); }
                            else if (key === 'ArrowDown' && selR < 8) { selR++; draw(); }
                            else if (key === 'ArrowLeft' && selC > 0) { selC--; draw(); }
                            else if (key === 'ArrowRight' && selC < 8) { selC++; draw(); }
                            e.preventDefault();
                        });

                        VizEngine.createButton(controls, 'Pencil Mode', function() {
                            pencilMode = !pencilMode;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Clear Entries', function() {
                            for (var r = 0; r < 9; r++) {
                                for (var c = 0; c < 9; c++) {
                                    if (!given[r][c]) { grid[r][c] = 0; pencil[r][c] = {}; }
                                }
                            }
                            selR = -1; selC = -1;
                            draw();
                        });

                        loadPuzzle(puzzleStr);
                        draw();
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the puzzle above, look at row 1 (top row). The given digits are 5, 3, 7. Which digits are missing? Using the naked single technique on the cells of row 1, can you place any digits?',
                    hint: 'The missing digits in row 1 are {1, 2, 4, 6, 8, 9}. For each empty cell, also check the column and box constraints to narrow down possibilities.',
                    solution: 'Row 1 has 5, 3, 7. Missing: {1, 2, 4, 6, 8, 9}. Column and box constraints further reduce candidates for each cell. For instance, column 3 contains 9, 8, and column 4 contains 0, 6, 8, 0, 4, 0, so the analysis depends on the full puzzle state. Work through each empty cell systematically.'
                },
                {
                    question: 'Explain why a Sudoku puzzle with 16 or fewer given digits cannot have a unique solution.',
                    hint: 'Think about what happens if you have very few clues. With 16 digits, at least one digit from 1-9 is missing entirely from the clues...',
                    solution: 'If at most 16 cells are filled, then by the pigeonhole principle, at most 8 of the 9 digits appear (16 clues, 9 digits, but some digits appear more than once; in fact at least one digit is completely absent). If digit \\(d\\) never appears in the clues, you can swap \\(d\\) with some other unused digit throughout the solution, getting a different valid completion. So the solution is not unique. (The actual minimum for a unique puzzle is 17 clues; this was proved by McGuire et al. in 2012.)'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 4: Backtracking — The Computer's Approach
        // ─────────────────────────────────────────────
        {
            id: 'sec-backtracking',
            title: "Backtracking — The Computer's Approach",
            content: `
<h2>Brute Force, Done Cleverly</h2>

<p>Humans solve Sudoku by logic. Computers can do that too, but they have another powerful tool: <strong>backtracking</strong>. This is a systematic way to try all possibilities without missing any.</p>

<div class="env-block definition">
<strong>Backtracking Algorithm.</strong> To solve a constraint satisfaction problem:
<ol>
<li>Find an empty cell. If none, the puzzle is solved.</li>
<li>Try each possible value (1-9 for Sudoku) in that cell.</li>
<li>For each value, check if it violates any constraint. If not, recurse: try to solve the rest of the puzzle.</li>
<li>If the recursion succeeds, we are done. If it fails (no value works), <em>backtrack</em>: undo the choice and try the next value.</li>
</ol>
</div>

<p>Backtracking is essentially a depth-first search through the tree of all possible assignments. It sounds like brute force, but the constraint checking prunes most branches early. A typical 9\\(\\times\\)9 Sudoku is solved in milliseconds by backtracking, even though there are \\(9^{81} \\approx 2 \\times 10^{77}\\) possible ways to fill the grid without constraints.</p>

<div class="viz-placeholder" data-viz="viz-backtrack"></div>

<h3>Why Backtracking Works</h3>

<div class="env-block intuition">
<strong>Pruning is the key.</strong> When the algorithm places a digit that immediately creates a conflict, it does not explore any of the branches below that choice. This pruning eliminates vast swaths of the search tree. In practice, the algorithm visits only a tiny fraction of all possible assignments.
</div>

<h3>Backtracking Beyond Sudoku</h3>

<p>Backtracking is a general-purpose algorithm. It solves:</p>
<ul>
<li><strong>The N-Queens problem:</strong> place \\(N\\) queens on an \\(N \\times N\\) chessboard so no two attack each other.</li>
<li><strong>Graph coloring:</strong> assign colors to vertices so no two adjacent vertices share a color.</li>
<li><strong>Cryptarithmetic puzzles:</strong> SEND + MORE = MONEY (find the digit each letter represents).</li>
<li><strong>Mazes:</strong> find a path from start to finish by exploring and backtracking at dead ends.</li>
</ul>

<div class="env-block remark">
<strong>Computational complexity.</strong> Solving Sudoku (given a partially filled grid, determine if a valid completion exists) is an NP-complete problem for generalized \\(n^2 \\times n^2\\) grids. This means there is no known polynomial-time algorithm, and many computer scientists believe none exists. But for the standard 9\\(\\times\\)9 size, backtracking with constraint propagation is extremely fast.
</div>
`,
            visualizations: [
                {
                    id: 'viz-backtrack',
                    title: 'Animated Backtracking Solver',
                    description: 'Watch the computer solve a Sudoku step by step. Green = successfully placed digit. Red = conflict, backtracking. Speed controls the animation rate.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var puzzleStr = [
                            '530070000',
                            '600195000',
                            '098000060',
                            '800060003',
                            '400803001',
                            '700020006',
                            '060000280',
                            '000419005',
                            '000080079'
                        ];

                        var grid = [];
                        var given = [];
                        var cellState = []; // 'given', 'placed', 'trying', 'backtrack', ''
                        var steps = [];
                        var stepIdx = 0;
                        var animTimer = null;
                        var speed = 50;
                        var solved = false;

                        function initGrid() {
                            grid = []; given = []; cellState = [];
                            for (var r = 0; r < 9; r++) {
                                grid.push([]); given.push([]); cellState.push([]);
                                for (var c = 0; c < 9; c++) {
                                    var v = parseInt(puzzleStr[r][c]);
                                    grid[r].push(v);
                                    given[r].push(v > 0);
                                    cellState[r].push(v > 0 ? 'given' : '');
                                }
                            }
                        }

                        function isValid(g, r, c, val) {
                            for (var i = 0; i < 9; i++) {
                                if (i !== c && g[r][i] === val) return false;
                                if (i !== r && g[i][c] === val) return false;
                            }
                            var br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
                            for (var bi = br; bi < br + 3; bi++) {
                                for (var bj = bc; bj < bc + 3; bj++) {
                                    if ((bi !== r || bj !== c) && g[bi][bj] === val) return false;
                                }
                            }
                            return true;
                        }

                        // Pre-compute all steps for animation
                        function computeSteps() {
                            steps = [];
                            var g = [];
                            for (var r = 0; r < 9; r++) {
                                g.push([]);
                                for (var c = 0; c < 9; c++) g[r].push(grid[r][c]);
                            }

                            var emptyCells = [];
                            for (var er = 0; er < 9; er++) {
                                for (var ec = 0; ec < 9; ec++) {
                                    if (g[er][ec] === 0) emptyCells.push([er, ec]);
                                }
                            }

                            function solve(idx) {
                                if (idx === emptyCells.length) {
                                    steps.push({ type: 'solved' });
                                    return true;
                                }
                                var cr = emptyCells[idx][0], cc = emptyCells[idx][1];
                                for (var val = 1; val <= 9; val++) {
                                    steps.push({ type: 'try', r: cr, c: cc, val: val });
                                    if (isValid(g, cr, cc, val)) {
                                        g[cr][cc] = val;
                                        steps.push({ type: 'place', r: cr, c: cc, val: val });
                                        if (solve(idx + 1)) return true;
                                        g[cr][cc] = 0;
                                        steps.push({ type: 'backtrack', r: cr, c: cc });
                                    } else {
                                        steps.push({ type: 'reject', r: cr, c: cc, val: val });
                                    }
                                }
                                return false;
                            }

                            solve(0);
                        }

                        function draw() {
                            viz.clear();
                            var cellSize = Math.min((w - 40) / 9, (h - 55) / 9, 50);
                            var gw = cellSize * 9, gh = cellSize * 9;
                            var ox = (w - gw) / 2, oy = (h - gh) / 2 + 12;

                            for (var r = 0; r < 9; r++) {
                                for (var c = 0; c < 9; c++) {
                                    var x = ox + c * cellSize, y = oy + r * cellSize;
                                    var st = cellState[r][c];

                                    if (st === 'given') ctx.fillStyle = '#1a1a40';
                                    else if (st === 'placed') ctx.fillStyle = viz.colors.green + '22';
                                    else if (st === 'trying') ctx.fillStyle = viz.colors.gold + '33';
                                    else if (st === 'backtrack') ctx.fillStyle = viz.colors.red + '33';
                                    else ctx.fillStyle = '#111130';
                                    ctx.fillRect(x, y, cellSize, cellSize);

                                    if (grid[r][c] > 0) {
                                        ctx.fillStyle = st === 'given' ? viz.colors.white :
                                                       st === 'placed' ? viz.colors.green :
                                                       st === 'trying' ? viz.colors.gold :
                                                       st === 'backtrack' ? viz.colors.red : viz.colors.teal;
                                        ctx.font = (st === 'given' ? 'bold ' : '') + Math.round(cellSize * 0.5) + 'px -apple-system,sans-serif';
                                        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                        ctx.fillText(grid[r][c], x + cellSize / 2, y + cellSize / 2);
                                    }
                                }
                            }

                            // grid lines
                            ctx.strokeStyle = viz.colors.axis; ctx.lineWidth = 0.5;
                            for (var i = 0; i <= 9; i++) {
                                ctx.beginPath(); ctx.moveTo(ox + i * cellSize, oy); ctx.lineTo(ox + i * cellSize, oy + gh); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(ox, oy + i * cellSize); ctx.lineTo(ox + gw, oy + i * cellSize); ctx.stroke();
                            }
                            ctx.strokeStyle = viz.colors.white; ctx.lineWidth = 2.5;
                            for (var bi = 0; bi <= 3; bi++) {
                                ctx.beginPath(); ctx.moveTo(ox + bi * 3 * cellSize, oy); ctx.lineTo(ox + bi * 3 * cellSize, oy + gh); ctx.stroke();
                                ctx.beginPath(); ctx.moveTo(ox, oy + bi * 3 * cellSize); ctx.lineTo(ox + gw, oy + bi * 3 * cellSize); ctx.stroke();
                            }

                            // status bar
                            ctx.fillStyle = viz.colors.white; ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            if (solved) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.fillText('Solved! Steps: ' + stepIdx + '/' + steps.length, w / 2, 4);
                            } else {
                                ctx.fillText('Step ' + stepIdx + '/' + steps.length, w / 2, 4);
                            }
                        }

                        function applyStep() {
                            if (stepIdx >= steps.length) {
                                if (animTimer) { clearInterval(animTimer); animTimer = null; }
                                return;
                            }
                            var s = steps[stepIdx];
                            if (s.type === 'try') {
                                grid[s.r][s.c] = s.val;
                                cellState[s.r][s.c] = 'trying';
                            } else if (s.type === 'place') {
                                grid[s.r][s.c] = s.val;
                                cellState[s.r][s.c] = 'placed';
                            } else if (s.type === 'reject') {
                                cellState[s.r][s.c] = 'backtrack';
                                grid[s.r][s.c] = 0;
                            } else if (s.type === 'backtrack') {
                                cellState[s.r][s.c] = 'backtrack';
                                grid[s.r][s.c] = 0;
                            } else if (s.type === 'solved') {
                                solved = true;
                                if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            }
                            stepIdx++;
                            draw();
                        }

                        function startAnimation() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            animTimer = setInterval(function() {
                                // Process multiple steps per frame at high speed
                                var batch = Math.max(1, Math.floor(speed / 10));
                                for (var b = 0; b < batch; b++) {
                                    applyStep();
                                    if (solved || stepIdx >= steps.length) break;
                                }
                            }, 30);
                        }

                        VizEngine.createButton(controls, 'Solve', function() {
                            initGrid();
                            solved = false;
                            stepIdx = 0;
                            computeSteps();
                            startAnimation();
                        });

                        VizEngine.createButton(controls, 'Pause', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                        });

                        VizEngine.createButton(controls, 'Step', function() {
                            if (steps.length === 0) { initGrid(); solved = false; stepIdx = 0; computeSteps(); }
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            applyStep();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            initGrid();
                            steps = []; stepIdx = 0; solved = false;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'Speed', 1, 200, speed, 1, function(val) {
                            speed = val;
                        });

                        initGrid();
                        computeSteps();
                        draw();

                        return { stopAnimation: function() { if (animTimer) { clearInterval(animTimer); animTimer = null; } } };
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the worst case, how many cells does the backtracking algorithm need to fill before it either solves the puzzle or determines there is no solution? What makes it faster in practice?',
                    hint: 'Think about the number of empty cells and the branching factor at each cell.',
                    solution: 'In the worst case, every empty cell could be tried with all 9 digits, leading to up to \\(9^k\\) possibilities where \\(k\\) is the number of empty cells. For a puzzle with about 55 empty cells, that is \\(9^{55} \\approx 10^{52}\\). In practice, constraint checking eliminates most branches immediately. If the first cell can only be 3 or 7 (not all 9 digits), the branching factor drops from 9 to 2, and this pruning cascades through all levels.'
                },
                {
                    question: 'Why does the backtracking algorithm always find a solution if one exists? Could it miss a valid completion?',
                    hint: 'Think about what "exhaustive search" means. Does backtracking ever skip a possibility?',
                    solution: 'Backtracking is a systematic exhaustive search. It tries every valid digit in every empty cell, in order. If a choice leads to a dead end, it undoes that choice and tries the next. It only declares "no solution" after every possibility at every level has been tried and rejected. Therefore, it cannot miss a valid solution. If a solution exists, backtracking will find it; if no solution exists, backtracking will correctly report failure.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 5: Counting and Creating Sudoku
        // ─────────────────────────────────────────────
        {
            id: 'sec-counting-creating',
            title: 'Counting and Creating Sudoku',
            content: `
<h2>The Mathematics of Puzzle Design</h2>

<p>How do you create a good Sudoku puzzle? And how many valid grids and puzzles are there? These are deep combinatorial questions.</p>

<h3>How Many Valid Sudoku Grids?</h3>

<p>Bertram Felgenhauer and Frazer Jarvis (2005) computed the exact count:</p>

\\[
\\text{Valid 9\\times 9 Sudoku grids} = 6{,}670{,}903{,}752{,}021{,}072{,}936{,}960 \\approx 6.67 \\times 10^{21}.
\\]

<p>This is a staggeringly large number, roughly 6.67 sextillion. If you could check one billion grids per second, it would take over 200 years to examine them all.</p>

<h3>Symmetry Reductions</h3>

<p>Many of these grids are "essentially the same" under symmetry operations:</p>
<ul>
<li><strong>Relabeling digits:</strong> swapping all 3s and 7s gives a grid that is structurally identical. There are \\(9! = 362{,}880\\) digit permutations.</li>
<li><strong>Permuting rows within a band:</strong> swapping two rows that share the same 3\\(\\times\\)3 band does not change the puzzle's structure.</li>
<li><strong>Permuting columns within a stack:</strong> similarly for columns.</li>
<li><strong>Permuting bands and stacks:</strong> rearranging the three horizontal bands or three vertical stacks.</li>
<li><strong>Transposition:</strong> reflecting the grid across its main diagonal.</li>
</ul>

<p>After accounting for all these symmetries, the number of essentially different Sudoku grids drops to <strong>5,472,730,538</strong>, about 5.47 billion.</p>

<h3>Creating a Puzzle</h3>

<p>A Sudoku <em>puzzle</em> is a partially filled grid with a unique solution. Creating one involves two steps:</p>
<ol>
<li><strong>Generate a complete valid grid</strong> (e.g., using backtracking with randomization).</li>
<li><strong>Remove clues one at a time</strong>, checking after each removal that the puzzle still has a unique solution. If removing a clue creates multiple solutions, put it back.</li>
</ol>

<div class="env-block theorem">
<strong>Minimum Clues Theorem (McGuire, Tugemann, Civario, 2012).</strong> The minimum number of clues in a valid 9\\(\\times\\)9 Sudoku puzzle with a unique solution is <strong>17</strong>. There is no 16-clue puzzle with a unique solution.
</div>

<p>This was proved by exhaustive computer search, checking all possible 16-clue configurations (a monumental computation). There are approximately 49,000 essentially different 17-clue Sudoku puzzles.</p>

<h3>Difficulty Rating</h3>

<p>What makes a Sudoku puzzle hard or easy? It is <em>not</em> simply the number of given clues. A puzzle with 25 clues can be harder than one with 20, depending on their arrangement. Difficulty correlates with:</p>
<ul>
<li>How many steps require advanced techniques (beyond naked and hidden singles).</li>
<li>The depth of backtracking a solver must perform (more backtracking = harder).</li>
<li>Whether the puzzle requires "bifurcation" (trying a guess and seeing if it leads to a contradiction).</li>
</ul>

<div class="env-block remark">
<strong>Sudoku as mathematics.</strong> Sudoku connects to Latin squares, graph coloring, constraint satisfaction, combinatorics, group theory (through symmetry), complexity theory (NP-completeness), and even information theory (how many clues carry enough information to determine the grid uniquely?). A humble 9\\(\\times\\)9 grid turns out to be a gateway into some of the deepest areas of mathematics and computer science.
</div>

<div class="env-block intuition">
<strong>Where to go from here.</strong> If you enjoyed Sudoku, explore its many variants: Killer Sudoku (cages with sum constraints), Thermo Sudoku (digits increase along a thermometer), Sandwich Sudoku (the sum of digits between 1 and 9 in each row/column is given), and many more. Each variant adds new constraints, turning the puzzle into a richer and more beautiful mathematical object.
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'A 4\\(\\times\\)4 mini-Sudoku has 288 valid completed grids. How many essentially different grids are there after accounting for digit relabeling (\\(4! = 24\\) permutations)?',
                    hint: 'If every grid can be relabeled in 24 ways to produce another valid grid, and no relabeling maps a grid to itself (other than the identity), then...',
                    solution: 'If every relabeling produced a distinct grid and no grid had nontrivial symmetry, the answer would be \\(288 / 24 = 12\\). In practice, some grids may be invariant under certain relabelings, but for 4\\(\\times\\)4 Sudoku, the answer is indeed 12 essentially different grids up to digit permutation. (Further reductions for row/column/band permutations reduce this even more.)'
                },
                {
                    question: 'Why is finding the minimum number of clues for a unique Sudoku so hard? Could you prove it mathematically instead of by computer search?',
                    hint: 'Think about what a proof would need to show: that no 16-clue arrangement works. How many 16-clue arrangements are there?',
                    solution: 'There are \\(\\binom{81}{16} \\approx 3.4 \\times 10^{13}\\) ways to choose which 16 cells to fill, and for each, the clue values matter too. A mathematical proof would need to show that <em>every</em> such configuration has either 0 or 2+ solutions. No structural argument is known that covers all cases. The 2012 proof used heavy computation: it cleverly reduced the search space using Hitting Set theory but still required over 7 million core-hours of computation on a supercomputer cluster.'
                },
                {
                    question: 'You have a completed Sudoku grid and want to create a hard puzzle. You remove clues one by one, checking uniqueness each time. In what order should you remove clues to minimize the total number of clues?',
                    hint: 'Think about which clues are "redundant" (determined by the remaining clues). Greedy removal is a common approach.',
                    solution: 'This is a greedy algorithm problem. A common approach: (1) Try removing each remaining clue in a random order. (2) After removal, run a solver to check if the solution is still unique. (3) If unique, keep the removal; if not, restore the clue. (4) Repeat until no more clues can be removed. However, different removal orders can lead to different final puzzles with different numbers of clues. Finding the true minimum is NP-hard; the greedy approach gives a good approximation but no guarantee of minimality.'
                }
            ]
        }
    ]
});
})();
