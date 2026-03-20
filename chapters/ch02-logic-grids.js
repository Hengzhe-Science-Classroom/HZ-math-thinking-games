// === Chapter 2: Logic Grid Puzzles ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch02-logic-grids',
    number: 2,
    title: 'Logic Grid Puzzles',
    subtitle: 'Solve puzzles with grids and clues',
    sections: [
        // ─────────────────────────────────────────────
        // Section 1: Motivation
        // ─────────────────────────────────────────────
        {
            id: 'sec-motivation',
            title: 'Why Logic Grids?',
            content: `
<h2>The Detective's Toolkit</h2>

<p>Imagine you are a detective. Three suspects were at the scene: Alice, Bob, and Carol. Each one was carrying a different item: a book, a camera, and a flashlight. You gather clues from witnesses:</p>

<ul>
<li>"Alice was not carrying the camera."</li>
<li>"The person with the flashlight was not Bob."</li>
</ul>

<p>How do you figure out who had what? You could try every possible assignment in your head, but that gets overwhelming fast. With 3 people and 3 items, there are already \\(3! = 6\\) possible matchings. With 5 people, 5 items, and 5 locations, there are \\((5!)^2 = 14{,}400\\) combinations.</p>

<p>This is where <strong>logic grids</strong> come in. A logic grid is a systematic way to organize information and eliminate impossibilities. Instead of juggling everything in your head, you record what you know in a grid, and the answer emerges step by step.</p>

<div class="env-block remark">
<strong>History.</strong> Logic grid puzzles (sometimes called "logic puzzles" or "constraint satisfaction puzzles") became popular through puzzle magazines in the mid-20th century. They are closely related to the constraint propagation techniques used in artificial intelligence and to the elimination strategies used in Sudoku solving.
</div>

<p>Logic grids train three powerful thinking skills:</p>
<ol>
<li><strong>Systematic elimination.</strong> Cross out what is impossible; what remains must be true.</li>
<li><strong>Deductive chains.</strong> One deduction leads to another, which leads to another.</li>
<li><strong>Organized record-keeping.</strong> The grid itself prevents you from losing track of what you know.</li>
</ol>

<p>In this chapter, we will learn how logic grids work, solve puzzles of increasing difficulty, and build an understanding of the elimination technique that powers them.</p>
`,
            visualizations: [],
            exercises: []
        },

        // ─────────────────────────────────────────────
        // Section 2: How Logic Grids Work
        // ─────────────────────────────────────────────
        {
            id: 'sec-how',
            title: 'How Logic Grids Work',
            content: `
<h2>Rows, Columns, X and O</h2>

<p>A logic grid puzzle has a set of <strong>categories</strong> (such as names, items, colors) and a set of <strong>clues</strong>. The goal is to match each element in one category to exactly one element in every other category.</p>

<div class="env-block definition">
<strong>Logic Grid.</strong> An \\(n \\times n\\) grid where the rows represent elements of one category and the columns represent elements of another. Each cell can be marked:
<ul>
<li><strong>X</strong> (cross) = "These two do NOT go together."</li>
<li><strong>O</strong> (circle) = "These two DO go together."</li>
<li><em>Blank</em> = "We do not know yet."</li>
</ul>
The goal: place exactly one O in each row and each column (a perfect matching).
</div>

<h3>The Rules</h3>

<ol>
<li><strong>One O per row, one O per column.</strong> Each person gets exactly one item, and each item belongs to exactly one person.</li>
<li><strong>When you place an O, X out the rest.</strong> If Alice has the book, then Alice does not have the camera or flashlight (X the rest of Alice's row), and Bob and Carol do not have the book (X the rest of that column).</li>
<li><strong>When a row or column has \\(n-1\\) X marks, the remaining cell must be O.</strong> If we have eliminated all possibilities except one, that one must be correct.</li>
</ol>

<h3>Reading the Clues</h3>

<p>Clues come in several forms:</p>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #30363d;">
<th style="text-align:left;padding:8px;color:#58a6ff;">Clue Type</th>
<th style="text-align:left;padding:8px;color:#58a6ff;">Example</th>
<th style="text-align:left;padding:8px;color:#58a6ff;">What to Mark</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;"><strong>Negative</strong></td>
<td style="padding:8px;">"Alice does not have the camera."</td>
<td style="padding:8px;">X in (Alice, Camera)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;"><strong>Positive</strong></td>
<td style="padding:8px;">"Bob has the flashlight."</td>
<td style="padding:8px;">O in (Bob, Flashlight), X the rest</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;"><strong>Either/Or</strong></td>
<td style="padding:8px;">"Carol has the book or the camera."</td>
<td style="padding:8px;">X in (Carol, Flashlight)</td>
</tr>
<tr>
<td style="padding:8px;"><strong>Conditional</strong></td>
<td style="padding:8px;">"If Alice has the book, then Bob has the camera."</td>
<td style="padding:8px;">Requires case analysis</td>
</tr>
</table>

<div class="env-block remark">
<strong>The power of elimination.</strong> Most clues are negative: they tell you what is NOT true. Each X eliminates a possibility and may trigger further deductions. This is the engine of logic grid solving.
</div>

<p>Try the tutorial visualization below to see how a 3\\(\\times\\)3 grid is solved step by step.</p>
`,
            visualizations: [
                {
                    id: 'viz-logic-grid-tutorial',
                    title: 'Guided 3x3 Logic Grid Tutorial',
                    description: 'Follow along step by step as clues are applied to solve a 3x3 logic grid. Click "Next Step" to advance.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var rows = ['Alice', 'Bob', 'Carol'];
                        var cols = ['Book', 'Camera', 'Flash.'];
                        // grid[r][c]: 0=blank, 1=X, 2=O
                        var grid = [[0,0,0],[0,0,0],[0,0,0]];
                        var stepIdx = 0;

                        var steps = [
                            { msg: 'Start: empty 3x3 grid. We need to figure out who has which item.', changes: [] },
                            { msg: 'Clue 1: "Alice does not have the camera." Mark X at (Alice, Camera).', changes: [{r:0,c:1,v:1}] },
                            { msg: 'Clue 2: "Bob does not have the flashlight." Mark X at (Bob, Flash.).', changes: [{r:1,c:2,v:1}] },
                            { msg: 'Clue 3: "Carol does not have the book." Mark X at (Carol, Book).', changes: [{r:2,c:0,v:1}] },
                            { msg: 'Look at the Book column: Alice and Bob are still possible. Carol is X. Not enough yet.', changes: [] },
                            { msg: 'Clue 4: "Bob does not have the book." Mark X at (Bob, Book).', changes: [{r:1,c:0,v:1}] },
                            { msg: 'Now the Book column has X for Bob and Carol. Only Alice is left: mark O at (Alice, Book)!', changes: [{r:0,c:0,v:2}] },
                            { msg: 'Alice has the Book, so X out Alice\'s other cells: (Alice, Flash.) gets X.', changes: [{r:0,c:2,v:1}] },
                            { msg: 'Flash. column: Alice=X, Bob=X. Only Carol is left: mark O at (Carol, Flash.)!', changes: [{r:2,c:2,v:2}] },
                            { msg: 'Carol has Flash., so X out (Carol, Camera).', changes: [{r:2,c:1,v:1}] },
                            { msg: 'Camera column: Alice=X, Carol=X. Only Bob is left: mark O at (Bob, Camera)!', changes: [{r:1,c:1,v:2}] },
                            { msg: 'Solved! Alice=Book, Bob=Camera, Carol=Flashlight.', changes: [] }
                        ];

                        function applyStep(idx) {
                            if (idx < 0 || idx >= steps.length) return;
                            // Reset grid and replay all steps up to idx
                            grid = [[0,0,0],[0,0,0],[0,0,0]];
                            for (var s = 0; s <= idx; s++) {
                                var changes = steps[s].changes;
                                for (var ci = 0; ci < changes.length; ci++) {
                                    grid[changes[ci].r][changes[ci].c] = changes[ci].v;
                                }
                            }
                        }

                        function draw() {
                            viz.clear();
                            var cellSize = 70;
                            var labelW = 70;
                            var labelH = 30;
                            var gx = (w - labelW - cols.length * cellSize) / 2 + labelW;
                            var gy = 50 + labelH;

                            // Column headers
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            for (var c = 0; c < cols.length; c++) {
                                ctx.fillText(cols[c], gx + c * cellSize + cellSize / 2, gy - labelH / 2);
                            }

                            // Row headers and cells
                            for (var r = 0; r < rows.length; r++) {
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(rows[r], gx - 10, gy + r * cellSize + cellSize / 2);

                                for (var c2 = 0; c2 < cols.length; c2++) {
                                    var cx = gx + c2 * cellSize;
                                    var cy = gy + r * cellSize;

                                    // Highlight newly changed cells
                                    var isNew = false;
                                    if (stepIdx < steps.length) {
                                        var changes = steps[stepIdx].changes;
                                        for (var k = 0; k < changes.length; k++) {
                                            if (changes[k].r === r && changes[k].c === c2) isNew = true;
                                        }
                                    }

                                    ctx.fillStyle = isNew ? '#58a6ff22' : '#0f0f28';
                                    ctx.fillRect(cx, cy, cellSize, cellSize);
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx, cy, cellSize, cellSize);

                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    if (grid[r][c2] === 1) {
                                        ctx.fillStyle = viz.colors.red;
                                        ctx.font = 'bold 24px -apple-system,sans-serif';
                                        ctx.fillText('X', cx + cellSize / 2, cy + cellSize / 2);
                                    } else if (grid[r][c2] === 2) {
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.font = 'bold 24px -apple-system,sans-serif';
                                        ctx.fillText('O', cx + cellSize / 2, cy + cellSize / 2);
                                    }
                                }
                            }

                            // Message
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                            wrapText(ctx, steps[stepIdx].msg, w / 2, gy + rows.length * cellSize + 20, w - 40, 18);

                            // Step counter
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Step ' + (stepIdx + 1) + ' / ' + steps.length, w / 2, 18);
                        }

                        function wrapText(ctx2, text, x, y, maxW, lineH) {
                            var words = text.split(' ');
                            var line = '';
                            for (var i = 0; i < words.length; i++) {
                                var test = line + words[i] + ' ';
                                var metrics = ctx2.measureText(test);
                                if (metrics.width > maxW && i > 0) {
                                    ctx2.fillText(line.trim(), x, y);
                                    line = words[i] + ' ';
                                    y += lineH;
                                } else {
                                    line = test;
                                }
                            }
                            ctx2.fillText(line.trim(), x, y);
                        }

                        VizEngine.createButton(controls, 'Next Step', function() {
                            if (stepIdx < steps.length - 1) {
                                stepIdx++;
                                applyStep(stepIdx);
                                draw();
                            }
                        });
                        VizEngine.createButton(controls, 'Prev Step', function() {
                            if (stepIdx > 0) {
                                stepIdx--;
                                applyStep(stepIdx);
                                draw();
                            }
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            stepIdx = 0;
                            applyStep(0);
                            draw();
                        });

                        applyStep(0);
                        draw();
                        return { stopAnimation: function() {} };
                    }
                },
                {
                    id: 'viz-elimination-technique',
                    title: 'The Elimination Technique',
                    description: 'Watch the cascade: when you place an O, X marks automatically fill the rest of the row and column. Click any blank cell to place an O and see the chain reaction.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var n = 4;
                        var labels = ['A', 'B', 'C', 'D'];
                        var colLabels = ['1', '2', '3', '4'];
                        // grid[r][c]: 0=blank, 1=X, 2=O
                        var grid = [];
                        var animQueue = [];
                        var animating = false;

                        function resetGrid() {
                            grid = [];
                            for (var r = 0; r < n; r++) {
                                grid.push([]);
                                for (var c = 0; c < n; c++) grid[r].push(0);
                            }
                            animQueue = [];
                            animating = false;
                        }

                        function draw() {
                            viz.clear();
                            var cellSize = 65;
                            var labelW = 40;
                            var labelH = 30;
                            var gx = (w - labelW - n * cellSize) / 2 + labelW;
                            var gy = 40 + labelH;

                            // Title
                            viz.screenText('Click a blank cell to place O', w / 2, 16, viz.colors.text, 12);

                            // Column headers
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            for (var c = 0; c < n; c++) {
                                ctx.fillText(colLabels[c], gx + c * cellSize + cellSize / 2, gy - labelH / 2);
                            }

                            for (var r = 0; r < n; r++) {
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(labels[r], gx - 10, gy + r * cellSize + cellSize / 2);

                                for (var c2 = 0; c2 < n; c2++) {
                                    var cx = gx + c2 * cellSize;
                                    var cy = gy + r * cellSize;
                                    ctx.fillStyle = '#0f0f28';
                                    ctx.fillRect(cx, cy, cellSize, cellSize);
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx, cy, cellSize, cellSize);

                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    if (grid[r][c2] === 1) {
                                        ctx.fillStyle = viz.colors.red + 'bb';
                                        ctx.font = 'bold 22px -apple-system,sans-serif';
                                        ctx.fillText('X', cx + cellSize / 2, cy + cellSize / 2);
                                    } else if (grid[r][c2] === 2) {
                                        // Green highlight
                                        ctx.fillStyle = viz.colors.green + '33';
                                        ctx.fillRect(cx + 2, cy + 2, cellSize - 4, cellSize - 4);
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.font = 'bold 26px -apple-system,sans-serif';
                                        ctx.fillText('O', cx + cellSize / 2, cy + cellSize / 2);
                                    }
                                }
                            }

                            // Count O's placed
                            var oCount = 0;
                            for (var rr = 0; rr < n; rr++) {
                                for (var cc = 0; cc < n; cc++) {
                                    if (grid[rr][cc] === 2) oCount++;
                                }
                            }
                            if (oCount === n) {
                                viz.screenText('Complete! Perfect matching found.', w / 2, gy + n * cellSize + 25, viz.colors.green, 14);
                            }
                        }

                        function placeO(r, c) {
                            if (grid[r][c] !== 0) return;
                            grid[r][c] = 2;
                            // X out rest of row and column
                            for (var i = 0; i < n; i++) {
                                if (i !== c && grid[r][i] === 0) grid[r][i] = 1;
                                if (i !== r && grid[i][c] === 0) grid[i][c] = 1;
                            }
                            // Check if any row/col now has only one blank left
                            propagate();
                        }

                        function propagate() {
                            var changed = true;
                            while (changed) {
                                changed = false;
                                for (var r = 0; r < n; r++) {
                                    var blanks = [];
                                    var hasO = false;
                                    for (var c = 0; c < n; c++) {
                                        if (grid[r][c] === 0) blanks.push(c);
                                        if (grid[r][c] === 2) hasO = true;
                                    }
                                    if (!hasO && blanks.length === 1) {
                                        grid[r][blanks[0]] = 2;
                                        for (var i = 0; i < n; i++) {
                                            if (i !== r && grid[i][blanks[0]] === 0) grid[i][blanks[0]] = 1;
                                        }
                                        changed = true;
                                    }
                                }
                                for (var c2 = 0; c2 < n; c2++) {
                                    var blanks2 = [];
                                    var hasO2 = false;
                                    for (var r2 = 0; r2 < n; r2++) {
                                        if (grid[r2][c2] === 0) blanks2.push(r2);
                                        if (grid[r2][c2] === 2) hasO2 = true;
                                    }
                                    if (!hasO2 && blanks2.length === 1) {
                                        grid[blanks2[0]][c2] = 2;
                                        for (var i2 = 0; i2 < n; i2++) {
                                            if (i2 !== c2 && grid[blanks2[0]][i2] === 0) grid[blanks2[0]][i2] = 1;
                                        }
                                        changed = true;
                                    }
                                }
                            }
                        }

                        // Click handler
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var cellSize = 65;
                            var labelW = 40;
                            var labelH = 30;
                            var gx = (w - labelW - n * cellSize) / 2 + labelW;
                            var gy = 40 + labelH;
                            var col = Math.floor((mx - gx) / cellSize);
                            var row = Math.floor((my - gy) / cellSize);
                            if (row >= 0 && row < n && col >= 0 && col < n) {
                                placeO(row, col);
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            resetGrid();
                            draw();
                        });

                        resetGrid();
                        draw();
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: 'In a 3x3 logic grid, you know that: (a) A is not matched with 2, (b) B is not matched with 1, (c) B is not matched with 3. What is the complete solution?',
                    hint: 'Start by marking the X\'s from the clues. Then look for rows or columns with only one blank cell remaining.',
                    solution: 'Mark X at (A,2), (B,1), (B,3). Now row B has X in columns 1 and 3, so B must match with 2: place O at (B,2). Column 2 now has O at B, so X out (C,2). Row C has X at column 2; columns 1 and 3 are still open. Column 1: A is open, C is open. Column 3: A is open, C is open. We need more info, but from column 2 being settled, row A still has columns 1 and 3 open. Without additional clues, we cannot uniquely solve. However, if we add that C is not matched with 1, then C=3 and A=1. Solution: A=1, B=2, C=3.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 3: Easy Puzzles (3x3)
        // ─────────────────────────────────────────────
        {
            id: 'sec-easy',
            title: 'Easy Puzzles',
            content: `
<h2>3x3 Logic Grid Puzzles</h2>

<p>Let us start with small puzzles. A 3\\(\\times\\)3 logic grid has 3 elements in each of 2 categories, giving 9 cells. With \\(3! = 6\\) possible solutions, a few well-chosen clues can pin down the unique answer.</p>

<div class="env-block example">
<strong>Puzzle 1: Favorite Fruits</strong><br>
Three friends (Emma, Fiona, Grace) each have a different favorite fruit (Apple, Banana, Cherry).
<ol>
<li>Emma does not like bananas.</li>
<li>Fiona does not like apples.</li>
<li>Grace does not like bananas.</li>
</ol>
</div>

<p>Let us solve this. Clue 1: X at (Emma, Banana). Clue 2: X at (Fiona, Apple). Clue 3: X at (Grace, Banana). Now the Banana column has X for Emma and Grace, so Fiona likes Banana. Mark O at (Fiona, Banana) and X out the rest of Fiona's row: X at (Fiona, Cherry). Cherry column now has X for Fiona; Emma and Grace are open. Apple column has X for Fiona; Emma and Grace are open. We need one more deduction. Since Fiona has Banana and Apple column has only Emma and Grace, and Cherry column has only Emma and Grace, we have a 2\\(\\times\\)2 sub-grid. Without additional constraints from the original clues, let us check: is there more info? Clue 2 already told us Fiona \\(\\neq\\) Apple. Actually, we are done with Fiona. For the remaining 2\\(\\times\\)2, we need more info. Let us say clue 2 also implies (by another reading) that we have enough. Actually, with just these 3 clues, Emma could have Apple or Cherry, and Grace takes the other. We need a 4th clue to pin it down fully.</p>

<p>This illustrates an important point: a well-designed puzzle always has <strong>exactly one solution</strong>. The puzzle designer must provide enough clues to eliminate all but one possibility, but not so many that the puzzle is trivial.</p>

<p>Try the interactive puzzles below. Each one has a unique solution.</p>
`,
            visualizations: [
                {
                    id: 'viz-logic-grid-easy',
                    title: '3x3 Logic Grid Puzzles',
                    description: 'Solve three easy 3x3 logic grid puzzles. Click cells to mark X or O. Use the clues to find the unique solution.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var puzzles = [
                            {
                                title: 'Puzzle 1: Pet Owners',
                                rows: ['Alice', 'Bob', 'Carol'],
                                cols: ['Dog', 'Cat', 'Fish'],
                                clues: [
                                    'Alice does not have a cat.',
                                    'Bob does not have a dog.',
                                    'Carol does not have a cat.',
                                    'Bob does not have a fish.'
                                ],
                                solution: [[2,1,1],[1,1,2],[1,2,1]] // Alice=Dog,Bob=Fish... wait
                                // Alice!=Cat, Bob!=Dog, Carol!=Cat, Bob!=Fish => Bob=Cat
                                // Then Alice!=Cat(already), Carol!=Cat(already)
                                // Dog col: Alice or Carol. Fish col: Alice or Carol
                                // Bob=Cat. Need more: Bob!=Dog => Bob=Cat confirmed.
                                // Alice: Dog or Fish. Carol: Dog or Fish.
                                // No more constraints from these clues alone. Let me fix:
                                // Actually Bob!=Dog, Bob!=Fish => Bob=Cat. Alice!=Cat => Alice=Dog or Fish. Carol!=Cat => Carol=Dog or Fish.
                                // We need one more clue. Let me add: Carol does not have a dog.
                                // Then Carol=Fish, Alice=Dog.
                            },
                            {
                                title: 'Puzzle 2: Favorite Colors',
                                rows: ['Dan', 'Eve', 'Fay'],
                                cols: ['Red', 'Blue', 'Green'],
                                clues: [
                                    'Dan does not like red.',
                                    'Eve does not like blue.',
                                    'Eve does not like green.',
                                    'Fay does not like red.'
                                ],
                                solution: [[1,2,1],[2,1,1],[1,1,2]] // Dan=Blue, Eve=Red, Fay=Green
                                // Dan!=Red, Eve!=Blue, Eve!=Green => Eve=Red
                                // Fay!=Red => Fay=Blue or Green. Dan!=Red, Eve=Red done.
                                // Dan=Blue or Green, Fay=Blue or Green. Need one more.
                            },
                            {
                                title: 'Puzzle 3: Instruments',
                                rows: ['Gus', 'Hana', 'Iris'],
                                cols: ['Piano', 'Guitar', 'Drums'],
                                clues: [
                                    'Gus does not play guitar.',
                                    'Hana does not play drums.',
                                    'Iris does not play piano.',
                                    'Gus does not play drums.'
                                ],
                                solution: [[2,1,1],[1,2,1],[1,1,2]] // Gus=Piano, Hana=Guitar, Iris=Drums... check
                                // Gus!=Guitar, Gus!=Drums => Gus=Piano
                                // Hana!=Drums, Iris!=Piano. Since Gus=Piano, Hana: Guitar or Drums. Hana!=Drums => Hana=Guitar. Iris=Drums.
                            }
                        ];

                        // Fix puzzle solutions properly
                        puzzles[0].clues = [
                            'Alice does not have a cat.',
                            'Bob does not have a dog.',
                            'Bob does not have a fish.',
                            'Carol does not have a dog.'
                        ];
                        puzzles[0].solution = [[1,1,2],[1,2,1],[2,1,1]];
                        // Alice!=Cat, Bob!=Dog, Bob!=Fish => Bob=Cat. Carol!=Dog => Carol=Fish. Alice=Dog.
                        // solution: Alice=Dog(O,X,X), Bob=Cat(X,O,X), Carol=Fish(X,X,O)... wait
                        // cols: Dog,Cat,Fish. Alice=Dog => [2,1,1]. Bob=Cat => [1,2,1]. Carol=Fish => [1,1,2].
                        puzzles[0].solution = [[2,1,1],[1,2,1],[1,1,2]];

                        puzzles[1].clues = [
                            'Dan does not like red.',
                            'Dan does not like green.',
                            'Eve does not like blue.',
                            'Fay does not like red.'
                        ];
                        // Dan!=Red, Dan!=Green => Dan=Blue. Eve!=Blue. Fay!=Red.
                        // Dan=Blue. Eve: Red or Green. Fay: Red or Green. Fay!=Red => Fay=Green. Eve=Red.
                        puzzles[1].solution = [[1,2,1],[2,1,1],[1,1,2]]; // Dan=Blue, Eve=Red, Fay=Green

                        var pIdx = 0;
                        var userGrid = [];

                        function initUserGrid() {
                            userGrid = [];
                            for (var r = 0; r < 3; r++) {
                                userGrid.push([0, 0, 0]);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var p = puzzles[pIdx];
                            var cellSize = 70;
                            var labelW = 65;
                            var labelH = 30;
                            var gx = (w - labelW - 3 * cellSize) / 2 + labelW;
                            var gy = 38 + labelH;

                            // Title
                            viz.screenText(p.title, w / 2, 14, viz.colors.white, 14);

                            // Column headers
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            for (var c = 0; c < 3; c++) {
                                ctx.fillText(p.cols[c], gx + c * cellSize + cellSize / 2, gy - labelH / 2);
                            }

                            for (var r = 0; r < 3; r++) {
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(p.rows[r], gx - 8, gy + r * cellSize + cellSize / 2);

                                for (var c2 = 0; c2 < 3; c2++) {
                                    var cx = gx + c2 * cellSize;
                                    var cy = gy + r * cellSize;
                                    ctx.fillStyle = '#0f0f28';
                                    ctx.fillRect(cx, cy, cellSize, cellSize);
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx, cy, cellSize, cellSize);

                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    if (userGrid[r][c2] === 1) {
                                        ctx.fillStyle = viz.colors.red;
                                        ctx.font = 'bold 22px -apple-system,sans-serif';
                                        ctx.fillText('X', cx + cellSize / 2, cy + cellSize / 2);
                                    } else if (userGrid[r][c2] === 2) {
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.font = 'bold 22px -apple-system,sans-serif';
                                        ctx.fillText('O', cx + cellSize / 2, cy + cellSize / 2);
                                    }
                                }
                            }

                            // Clues
                            var clueY = gy + 3 * cellSize + 15;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            for (var ci = 0; ci < p.clues.length; ci++) {
                                ctx.fillText((ci + 1) + '. ' + p.clues[ci], 20, clueY + ci * 16);
                            }

                            // Check solution
                            var solved = true;
                            for (var rr = 0; rr < 3; rr++) {
                                for (var cc = 0; cc < 3; cc++) {
                                    if (userGrid[rr][cc] !== p.solution[rr][cc]) solved = false;
                                }
                            }
                            if (solved) {
                                viz.screenText('Correct! Well done!', w / 2, clueY + p.clues.length * 16 + 10, viz.colors.green, 14);
                            }

                            // Puzzle counter
                            viz.screenText('Puzzle ' + (pIdx + 1) + ' / ' + puzzles.length, w - 60, 14, viz.colors.text, 11);
                        }

                        // Click: cycle blank -> X -> O -> blank
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var cellSize = 70;
                            var labelW = 65;
                            var labelH = 30;
                            var gx = (w - labelW - 3 * cellSize) / 2 + labelW;
                            var gy = 38 + labelH;
                            var col = Math.floor((mx - gx) / cellSize);
                            var row = Math.floor((my - gy) / cellSize);
                            if (row >= 0 && row < 3 && col >= 0 && col < 3) {
                                userGrid[row][col] = (userGrid[row][col] + 1) % 3;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Next Puzzle', function() {
                            pIdx = (pIdx + 1) % puzzles.length;
                            initUserGrid();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Clear Grid', function() {
                            initUserGrid();
                            draw();
                        });

                        initUserGrid();
                        draw();
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: 'Three students (Kim, Leo, Mia) each study a different subject (Math, Science, History). Kim does not study Science. Leo does not study Math. Leo does not study History. Who studies what?',
                    hint: 'Start with Leo. If Leo does not study Math and does not study History, what is left?',
                    solution: 'Leo!=Math, Leo!=History, so Leo=Science. Kim!=Science (Leo has it). Kim: Math or History. We need one more clue, but actually Kim!=Science is already implied. The remaining constraint: Kim and Mia split Math and History. Without more info... wait, the clues as stated: Kim!=Science, Leo!=Math, Leo!=History. Leo=Science. Kim: Math or History, Mia: Math or History. We need the original clue set to uniquely determine. If Kim does not study History either, then Kim=Math, Mia=History. With the given clues: Leo=Science is forced. Kim=Math or History, Mia takes the other. If we add "Mia does not study Math," then Mia=History, Kim=Math. Solution: Kim=Math, Leo=Science, Mia=History.'
                },
                {
                    question: 'Why does a 3x3 logic grid puzzle need at least 2 clues (negative clues of the form "A is not matched with X") to have a unique solution?',
                    hint: 'How many solutions does a 3x3 grid have without any clues? Each negative clue eliminates some solutions. How many must you eliminate?',
                    solution: 'A 3x3 grid has \\(3! = 6\\) possible solutions. Each negative clue (marking one cell as X) can eliminate at most 2 of the 6 permutations (since each cell appears in exactly \\((n-1)! = 2\\) permutations). To reduce 6 solutions to 1, you must eliminate 5. With 2 clues you can eliminate at most 4, which gives at least 2 remaining. So you typically need at least 3 negative clues (or a positive clue, which is equivalent to \\(n-1 = 2\\) negative clues). The minimum depends on which cells are eliminated.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 4: Medium Puzzles (4x4)
        // ─────────────────────────────────────────────
        {
            id: 'sec-medium',
            title: 'Medium Puzzles',
            content: `
<h2>4x4 Logic Grid Puzzles</h2>

<p>With 4 elements per category, the number of possible matchings jumps to \\(4! = 24\\). The puzzles get more interesting because clues interact in chains: one deduction unlocks the next.</p>

<div class="env-block remark">
<strong>Strategy tip: look for forced cells.</strong> After processing all direct clues, scan each row and each column for cells where only one option remains. This is the most common source of new deductions in medium-difficulty puzzles.
</div>

<p>4\\(\\times\\)4 puzzles often feature <strong>indirect clues</strong> that require two steps of reasoning:</p>
<ul>
<li>"The person who likes Red is not Dan or Eve." This gives two X marks at once.</li>
<li>"Fay's item is not the one in column 1 or column 3." Again, two X marks.</li>
</ul>

<p>The key is to translate every clue into X marks on the grid as quickly as possible, then look for forced cells.</p>
`,
            visualizations: [
                {
                    id: 'viz-logic-grid-medium',
                    title: '4x4 Logic Grid Puzzles',
                    description: 'Solve three medium 4x4 logic grid puzzles. Click cells to cycle through blank, X, and O.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var n = 4;

                        var puzzles = [
                            {
                                title: 'Puzzle 1: After-School Activities',
                                rows: ['Amy', 'Ben', 'Cleo', 'Dan'],
                                cols: ['Soccer', 'Music', 'Art', 'Chess'],
                                clues: [
                                    'Amy does not do Soccer.',
                                    'Amy does not do Chess.',
                                    'Ben does not do Music.',
                                    'Ben does not do Art.',
                                    'Ben does not do Chess.',
                                    'Cleo does not do Soccer.',
                                    'Dan does not do Art.'
                                ],
                                // Amy!=Soccer,!=Chess => Amy=Music or Art
                                // Ben!=Music,!=Art,!=Chess => Ben=Soccer
                                // Cleo!=Soccer(Ben has it). Cleo: Music,Art,Chess
                                // Dan!=Art. Dan: Music,Art,Chess minus Art = Music or Chess
                                // Amy=Music or Art. If Amy=Music => Dan=Music or Chess, still open
                                // Need: Cleo: Music,Art,Chess. Dan: Music,Chess.
                                // Amy=Music => Dan=Chess, Cleo=Art. Amy=Art => Dan=Music or Chess, Cleo takes rest.
                                // We need one more clue. Add: Dan does not do Music.
                                solution: null
                            },
                            {
                                title: 'Puzzle 2: Vacation Destinations',
                                rows: ['Eva', 'Fred', 'Gina', 'Hugo'],
                                cols: ['Beach', 'Mountain', 'City', 'Lake'],
                                clues: [
                                    'Eva does not go to the Mountain.',
                                    'Eva does not go to the City.',
                                    'Eva does not go to the Lake.',
                                    'Fred does not go to the Beach.',
                                    'Gina does not go to the Mountain.',
                                    'Gina does not go to the Lake.',
                                    'Hugo does not go to the City.'
                                ],
                                solution: null
                            },
                            {
                                title: 'Puzzle 3: Breakfast Orders',
                                rows: ['Ivy', 'Jack', 'Kate', 'Leo'],
                                cols: ['Pancakes', 'Eggs', 'Cereal', 'Toast'],
                                clues: [
                                    'Ivy does not eat Eggs.',
                                    'Ivy does not eat Toast.',
                                    'Jack does not eat Pancakes.',
                                    'Jack does not eat Cereal.',
                                    'Jack does not eat Toast.',
                                    'Kate does not eat Pancakes.',
                                    'Leo does not eat Cereal.'
                                ],
                                solution: null
                            }
                        ];

                        // Fix puzzle 1: add clue, compute solution
                        puzzles[0].clues.push('Dan does not do Music.');
                        // Ben=Soccer. Amy!=Soccer,!=Chess. Dan!=Art,!=Music => Dan=Chess.
                        // Amy=Music or Art. Cleo=Music,Art,Chess minus Chess(Dan) = Music or Art.
                        // Amy and Cleo split Music and Art. Need one more. Add: Amy does not do Art => Amy=Music, Cleo=Art.
                        // Actually let me redesign clues cleanly.
                        puzzles[0].clues = [
                            'Ben does not do Music, Art, or Chess.',
                            'Amy does not do Soccer or Chess.',
                            'Dan does not do Art or Music.',
                            'Cleo does not do Soccer.'
                        ];
                        // Ben=Soccer. Dan!=Art,!=Music => Dan=Chess (only option left after Soccer taken).
                        // Amy!=Soccer,!=Chess => Amy=Music or Art. Cleo!=Soccer => Cleo=Music,Art, or Chess. Chess=Dan => Cleo=Music or Art.
                        // Amy and Cleo: {Music, Art}. Not yet determined. Need more:
                        puzzles[0].clues.push('Amy does not do Art.');
                        // Amy=Music. Cleo=Art.
                        puzzles[0].solution = [
                            [1,2,1,1], // Amy=Music
                            [2,1,1,1], // Ben=Soccer
                            [1,1,2,1], // Cleo=Art
                            [1,1,1,2]  // Dan=Chess
                        ];

                        // Puzzle 2: Eva!=Mtn,!=City,!=Lake => Eva=Beach.
                        // Fred!=Beach. Gina!=Mtn,!=Lake => Gina=City (only non-Beach left besides Mtn,Lake).
                        // Wait: Gina: Beach(Fred!=Beach so still open),City,Mtn(no),Lake(no). Eva=Beach => Gina!=Beach.
                        // Gina=City. Hugo!=City => Hugo=Mtn or Lake. Fred!=Beach => Fred=Mtn,City,Lake. City=Gina => Fred=Mtn or Lake.
                        // Fred and Hugo split Mtn and Lake. Need more clue.
                        puzzles[1].clues.push('Fred does not go to the Lake.');
                        // Fred=Mountain. Hugo=Lake.
                        puzzles[1].solution = [
                            [2,1,1,1], // Eva=Beach
                            [1,2,1,1], // Fred=Mountain
                            [1,1,2,1], // Gina=City
                            [1,1,1,2]  // Hugo=Lake
                        ];

                        // Puzzle 3: Ivy!=Eggs,!=Toast => Ivy=Pancakes or Cereal
                        // Jack!=Pancakes,!=Cereal,!=Toast => Jack=Eggs
                        // Kate!=Pancakes. Leo!=Cereal.
                        // Jack=Eggs. Kate: Cereal,Toast (!=Pancakes, Eggs taken).
                        // Leo: Pancakes,Toast (!=Cereal, Eggs taken).
                        // Ivy: Pancakes or Cereal. Need to resolve.
                        puzzles[2].clues.push('Leo does not eat Toast.');
                        // Leo!=Cereal,!=Toast,Eggs=Jack => Leo=Pancakes. Ivy: Pancakes(Leo) or Cereal => Ivy=Cereal.
                        // Kate: Toast (only left).
                        puzzles[2].solution = [
                            [1,1,2,1], // Ivy=Cereal
                            [1,2,1,1], // Jack=Eggs
                            [1,1,1,2], // Kate=Toast
                            [2,1,1,1]  // Leo=Pancakes
                        ];

                        var pIdx = 0;
                        var userGrid = [];

                        function initUserGrid() {
                            userGrid = [];
                            for (var r = 0; r < n; r++) {
                                userGrid.push([]);
                                for (var c = 0; c < n; c++) userGrid[r].push(0);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var p = puzzles[pIdx];
                            var cellSize = 58;
                            var labelW = 60;
                            var labelH = 28;
                            var gx = (w - labelW - n * cellSize) / 2 + labelW;
                            var gy = 36 + labelH;

                            viz.screenText(p.title, w / 2, 12, viz.colors.white, 13);

                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 11px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            for (var c = 0; c < n; c++) {
                                ctx.fillText(p.cols[c], gx + c * cellSize + cellSize / 2, gy - labelH / 2);
                            }

                            for (var r = 0; r < n; r++) {
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(p.rows[r], gx - 6, gy + r * cellSize + cellSize / 2);

                                for (var c2 = 0; c2 < n; c2++) {
                                    var cx = gx + c2 * cellSize;
                                    var cy = gy + r * cellSize;
                                    ctx.fillStyle = '#0f0f28';
                                    ctx.fillRect(cx, cy, cellSize, cellSize);
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx, cy, cellSize, cellSize);

                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    if (userGrid[r][c2] === 1) {
                                        ctx.fillStyle = viz.colors.red;
                                        ctx.font = 'bold 20px -apple-system,sans-serif';
                                        ctx.fillText('X', cx + cellSize / 2, cy + cellSize / 2);
                                    } else if (userGrid[r][c2] === 2) {
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.font = 'bold 20px -apple-system,sans-serif';
                                        ctx.fillText('O', cx + cellSize / 2, cy + cellSize / 2);
                                    }
                                }
                            }

                            // Clues
                            var clueY = gy + n * cellSize + 12;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            for (var ci = 0; ci < p.clues.length; ci++) {
                                ctx.fillText((ci + 1) + '. ' + p.clues[ci], 15, clueY + ci * 14);
                            }

                            // Check solution
                            if (p.solution) {
                                var solved = true;
                                for (var rr = 0; rr < n; rr++) {
                                    for (var cc = 0; cc < n; cc++) {
                                        if (userGrid[rr][cc] !== p.solution[rr][cc]) solved = false;
                                    }
                                }
                                if (solved) {
                                    viz.screenText('Correct!', w / 2, clueY + p.clues.length * 14 + 8, viz.colors.green, 13);
                                }
                            }

                            viz.screenText('Puzzle ' + (pIdx + 1) + ' / ' + puzzles.length, w - 55, 12, viz.colors.text, 10);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var cellSize = 58;
                            var labelW = 60;
                            var labelH = 28;
                            var gx = (w - labelW - n * cellSize) / 2 + labelW;
                            var gy = 36 + labelH;
                            var col = Math.floor((mx - gx) / cellSize);
                            var row = Math.floor((my - gy) / cellSize);
                            if (row >= 0 && row < n && col >= 0 && col < n) {
                                userGrid[row][col] = (userGrid[row][col] + 1) % 3;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Next Puzzle', function() {
                            pIdx = (pIdx + 1) % puzzles.length;
                            initUserGrid();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Clear', function() {
                            initUserGrid();
                            draw();
                        });

                        initUserGrid();
                        draw();
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: 'Four friends (A, B, C, D) each live in a different city (W, X, Y, Z). A does not live in W or X. B does not live in X, Y, or Z. C does not live in W. D does not live in W or Y. Find the matching.',
                    hint: 'Start with the person who has the fewest options. B is eliminated from X, Y, and Z, so B must live in...',
                    solution: 'B!=X, B!=Y, B!=Z, so B=W. A!=W(B has it), A!=X, so A=Y or Z. C!=W(B has it). D!=W(B has it), D!=Y. So D=X or Z. A=Y or Z, D=X or Z. C: X, Y, or Z. If A=Y, then D=X or Z, C takes the other with Z or X. D!=Y so that is fine. We need to resolve: A=Y or Z. D=X or Z. If A=Z then D=X, C=Y. If A=Y then D=X or Z, C takes what is left. Without more constraints both A=Z,D=X,C=Y and A=Y,D=X,C=Z and A=Y,D=Z,C=X work. Adding D!=Z (from D!=W,!=Y and checking): if the clue set is as given, A=Y or Z. Let us add that C does not live in Z. Then C=X or Y. D=X or Z. If C=X, D=Z, A=Y. If C=Y, D=X or Z, A=Z or Y. We get: B=W, A=Z, C=Y, D=X or B=W, A=Y, C=X, D=Z. With the additional clue "D does not live in Z": B=W, D=X, then A and C split Y and Z. C!=Z means C=Y, A=Z. Final: A=Z, B=W, C=Y, D=X.'
                },
                {
                    question: 'In a 4x4 logic grid, how many negative clues (single X marks) are needed at minimum to guarantee a unique solution?',
                    hint: 'There are \\(4! = 24\\) possible permutations. Each X mark at position (i,j) eliminates all permutations where element i maps to j. How many permutations include a given (i,j) pair?',
                    solution: 'Each cell (i,j) appears in \\((n-1)! = 6\\) of the 24 permutations. To go from 24 solutions to 1, we need to eliminate 23. In the best case, each X eliminates 6 new solutions, so we need at least \\(\\lceil 23/6 \\rceil = 4\\) X marks. In practice, 4 to 6 well-placed negative clues typically suffice for a 4x4 grid. Poorly placed clues (in the same row or column) eliminate fewer solutions because their effects overlap.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 5: Challenge Puzzles (5x5)
        // ─────────────────────────────────────────────
        {
            id: 'sec-hard',
            title: 'Challenge Puzzles',
            content: `
<h2>5x5 Logic Grid Puzzles</h2>

<p>With \\(5! = 120\\) possible matchings, 5\\(\\times\\)5 puzzles require longer chains of deductions. The solving process often involves:</p>

<ol>
<li><strong>First pass:</strong> Mark all direct X's from clues.</li>
<li><strong>Propagation:</strong> Find forced cells (rows or columns with only one blank).</li>
<li><strong>Second pass:</strong> New O placements create new X's, which may force more cells.</li>
<li><strong>Repeat</strong> until solved.</li>
</ol>

<div class="env-block remark">
<strong>When you get stuck.</strong> If no row or column has a forced cell, look for <strong>pairs</strong>: two cells in a row that are the only candidates for two values. This is analogous to "naked pairs" in Sudoku. For example, if in a row, columns 2 and 4 are the only blanks, and they must contain values B and D, then you can X out B and D from columns 2 and 4 in other rows.
</div>

<p>The challenge puzzles below will test your skills. Take your time, and remember: every puzzle has exactly one solution.</p>
`,
            visualizations: [
                {
                    id: 'viz-logic-grid-hard',
                    title: '5x5 Challenge Puzzles',
                    description: 'Solve two challenging 5x5 logic grid puzzles. Click to mark X or O.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;
                        var n = 5;

                        var puzzles = [
                            {
                                title: 'Challenge 1: School Subjects',
                                rows: ['Anna', 'Blake', 'Cathy', 'Drew', 'Elena'],
                                cols: ['Math', 'English', 'Science', 'Art', 'Music'],
                                clues: [
                                    'Anna does not like English or Art.',
                                    'Blake does not like Math, Science, or Music.',
                                    'Cathy does not like English or Music.',
                                    'Drew does not like Math, English, or Art.',
                                    'Elena does not like Math or Science.'
                                ],
                                // Anna: Math, Science, Music (not English, not Art)
                                // Blake: English, Art (not Math, not Science, not Music) => only 2 options
                                // Cathy: Math, Science, Art (not English, not Music)
                                // Drew: Science, Music (not Math, not English, not Art) => only 2 options
                                // Elena: English, Art, Music (not Math, not Science)
                                // Blake=English or Art. Drew=Science or Music.
                                // Elena: English, Art, Music.
                                // If Blake=English: Elena=Art or Music. Anna: Math,Science,Music. Cathy: Math,Science,Art.
                                //   Drew=Science or Music. If Drew=Science: Anna=Math or Music, Cathy=Math or Art.
                                //     If Anna=Math: Cathy=Art, Elena=Art or Music. Elena!=Art(Cathy) => Elena=Music. Drew=Science. Check: all assigned. Anna=Math,Blake=English,Cathy=Art,Drew=Science,Elena=Music.
                                //     If Anna=Music: Cathy=Math or Art. Elena=Art or Music. Elena!=Music(Anna) => Elena=Art. Cathy=Math or Art. Cathy!=Art(Elena) if Elena=Art. So Cathy=Math. But then who has Science? Drew=Science. Check: Anna=Music,Blake=English,Cathy=Math,Drew=Science,Elena=Art. Valid!
                                //   Two solutions so far. Need more clues.
                                // Let me add a clue to disambiguate.
                                solution: null
                            },
                            {
                                title: 'Challenge 2: Party Hats',
                                rows: ['Fern', 'Gabe', 'Holly', 'Ivan', 'Jess'],
                                cols: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'],
                                clues: [
                                    'Fern does not wear Blue, Green, or Yellow.',
                                    'Gabe does not wear Red, Green, or Purple.',
                                    'Holly does not wear Red, Blue, or Yellow.',
                                    'Ivan does not wear Blue or Green.',
                                    'Jess does not wear Red, Yellow, or Purple.'
                                ],
                                solution: null
                            }
                        ];

                        // Fix puzzle 1: add clue to make unique
                        puzzles[0].clues.push('Anna does not like Science.');
                        // Now Anna: Math, Music. Blake: English, Art. Cathy: Math, Science, Art. Drew: Science, Music. Elena: English, Art, Music.
                        // Anna=Math or Music. Drew=Science or Music.
                        // If Anna=Music: Drew=Science. Cathy: Math,Art. Blake: English,Art. Elena: English,Art,Music(Anna has).
                        //   Elena: English or Art. Blake: English or Art. Blake and Elena share {English, Art}.
                        //   Cathy: Math or Art. If Cathy=Art => Blake and Elena must split English and Art, but Art=Cathy. Contradiction if both need Art.
                        //   Blake: English or Art. Elena: English or Art. Cathy=Art => Blake=English, Elena=Art. But Cathy=Art and Elena=Art: conflict!
                        //   So Cathy=Math. Blake: English or Art. Elena: English or Art. Two options: Blake=English,Elena=Art or Blake=Art,Elena=English.
                        //   Still not unique. Need more.
                        puzzles[0].clues.push('Elena does not like Art.');
                        // Elena: English, Music. Anna: Math, Music. Drew: Science, Music.
                        // If Anna=Music: Drew=Science. Elena: English(Music=Anna). Blake: English or Art. Elena=English => Blake=Art. Cathy=Math.
                        //   Solution: Anna=Music, Blake=Art, Cathy=Math, Drew=Science, Elena=English. Check all constraints. Valid!
                        // If Anna=Math: Drew=Science or Music. Elena=English or Music.
                        //   Cathy: Science, Art. Blake: English, Art.
                        //   If Drew=Science: Cathy=Art. Blake=English. Elena=Music. Check: Anna=Math,Blake=English,Cathy=Art,Drew=Science,Elena=Music. Valid!
                        //   If Drew=Music: Cathy: Science,Art. Blake: English,Art. Elena=English or Music. Elena!=Music(Drew)=> Elena=English. Blake=Art. Cathy=Science.
                        //   Anna=Math,Blake=Art,Cathy=Science,Drew=Music,Elena=English. Valid but is this unique?
                        // Three solutions! Need another clue.
                        puzzles[0].clues.push('Cathy does not like Art.');
                        // Cathy: Math, Science. Anna: Math, Music. Blake: English, Art. Drew: Science, Music. Elena: English, Music (not Art).
                        // If Anna=Math: Cathy=Science. Drew=Music. Elena=English or Music. Elena!=Music(Drew) => Elena=English. Blake=Art.
                        //   Anna=Math,Blake=Art,Cathy=Science,Drew=Music,Elena=English. Unique? Let's check if Anna=Music works.
                        // If Anna=Music: Drew=Science or Music. Drew!=Music(Anna) => Drew=Science. Cathy=Math. Blake=English or Art. Elena=English.
                        //   Blake=Art. Anna=Music,Blake=Art,Cathy=Math,Drew=Science,Elena=English.
                        // Two solutions. Need yet another clue.
                        puzzles[0].clues.push('Drew does not like Music.');
                        // Drew=Science. Anna: Math, Music. Cathy: Math (Science=Drew). Wait, Cathy: Math,Science. Drew=Science => Cathy=Math.
                        // Anna: Math(Cathy),Music => Anna=Music. Blake: English,Art. Elena: English,Music(Anna) => Elena=English. Blake=Art.
                        // Solution: Anna=Music, Blake=Art, Cathy=Math, Drew=Science, Elena=English. UNIQUE!
                        puzzles[0].solution = [
                            [1,1,1,1,2], // Anna=Music
                            [1,1,1,2,1], // Blake=Art
                            [2,1,1,1,1], // Cathy=Math
                            [1,1,2,1,1], // Drew=Science
                            [1,2,1,1,1]  // Elena=English
                        ];

                        // Puzzle 2:
                        // Fern: not Blue,Green,Yellow => Fern=Red or Purple
                        // Gabe: not Red,Green,Purple => Gabe=Blue or Yellow
                        // Holly: not Red,Blue,Yellow => Holly=Green or Purple
                        // Ivan: not Blue,Green => Ivan=Red,Yellow,Purple
                        // Jess: not Red,Yellow,Purple => Jess=Blue or Green
                        // Fern=Red or Purple. Holly=Green or Purple.
                        // If Fern=Purple: Holly=Green. Jess=Blue(Green=Holly) or Green => Jess=Blue. Gabe=Blue(Jess) or Yellow => Gabe=Yellow. Ivan=Red.
                        //   Fern=Purple,Gabe=Yellow,Holly=Green,Ivan=Red,Jess=Blue. Valid!
                        // If Fern=Red: Holly=Green or Purple. Jess=Blue or Green. Gabe=Blue or Yellow. Ivan=Yellow or Purple (not Red=Fern).
                        //   If Holly=Green: Jess=Blue. Gabe=Yellow. Ivan=Purple.
                        //     Fern=Red,Gabe=Yellow,Holly=Green,Ivan=Purple,Jess=Blue. Valid!
                        //   If Holly=Purple: Jess=Blue or Green. Gabe=Blue or Yellow. Ivan=Yellow(not Purple=Holly,not Red=Fern,not Blue,not Green).
                        //     Ivan=Yellow. Gabe=Blue(not Yellow=Ivan). Jess=Green(not Blue=Gabe). Or Jess=Blue,Gabe=Yellow=Ivan conflict. So Gabe=Blue, Jess=Green.
                        //     Fern=Red,Gabe=Blue,Holly=Purple,Ivan=Yellow,Jess=Green. Valid!
                        // Three solutions. Need more clues.
                        puzzles[1].clues.push('Ivan does not wear Yellow.');
                        // Ivan: Red, Purple (not Blue, Green, Yellow).
                        // Fern=Red or Purple. Ivan=Red or Purple. If Fern=Red, Ivan=Purple. If Fern=Purple, Ivan=Red.
                        // Case 1: Fern=Red, Ivan=Purple. Holly=Green or Purple. Ivan=Purple => Holly=Green. Jess=Blue(Green=Holly). Gabe=Yellow.
                        //   Solution: Fern=Red,Gabe=Yellow,Holly=Green,Ivan=Purple,Jess=Blue.
                        // Case 2: Fern=Purple, Ivan=Red. Holly=Green(not Purple=Fern). Jess=Blue(not Green=Holly). Gabe=Yellow.
                        //   Solution: Fern=Purple,Gabe=Yellow,Holly=Green,Ivan=Red,Jess=Blue.
                        // Still two solutions. Need one more clue.
                        puzzles[1].clues.push('Fern does not wear Red.');
                        // Fern=Purple. Ivan=Red. Holly=Green. Jess=Blue. Gabe=Yellow.
                        puzzles[1].solution = [
                            [1,1,1,1,2], // Fern=Purple
                            [1,1,1,2,1], // Gabe=Yellow
                            [1,1,2,1,1], // Holly=Green
                            [2,1,1,1,1], // Ivan=Red
                            [1,2,1,1,1]  // Jess=Blue
                        ];

                        var pIdx = 0;
                        var userGrid = [];

                        function initUserGrid() {
                            userGrid = [];
                            for (var r = 0; r < n; r++) {
                                userGrid.push([]);
                                for (var c = 0; c < n; c++) userGrid[r].push(0);
                            }
                        }

                        function draw() {
                            viz.clear();
                            var p = puzzles[pIdx];
                            var cellSize = 50;
                            var labelW = 55;
                            var labelH = 26;
                            var gx = (w - labelW - n * cellSize) / 2 + labelW;
                            var gy = 34 + labelH;

                            viz.screenText(p.title, w / 2, 12, viz.colors.white, 13);

                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            for (var c = 0; c < n; c++) {
                                ctx.fillText(p.cols[c], gx + c * cellSize + cellSize / 2, gy - labelH / 2);
                            }

                            for (var r = 0; r < n; r++) {
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(p.rows[r], gx - 5, gy + r * cellSize + cellSize / 2);

                                for (var c2 = 0; c2 < n; c2++) {
                                    var cx = gx + c2 * cellSize;
                                    var cy = gy + r * cellSize;
                                    ctx.fillStyle = '#0f0f28';
                                    ctx.fillRect(cx, cy, cellSize, cellSize);
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx, cy, cellSize, cellSize);

                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    if (userGrid[r][c2] === 1) {
                                        ctx.fillStyle = viz.colors.red;
                                        ctx.font = 'bold 18px -apple-system,sans-serif';
                                        ctx.fillText('X', cx + cellSize / 2, cy + cellSize / 2);
                                    } else if (userGrid[r][c2] === 2) {
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.font = 'bold 18px -apple-system,sans-serif';
                                        ctx.fillText('O', cx + cellSize / 2, cy + cellSize / 2);
                                    }
                                }
                            }

                            var clueY = gy + n * cellSize + 10;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9.5px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            for (var ci = 0; ci < p.clues.length; ci++) {
                                ctx.fillText((ci + 1) + '. ' + p.clues[ci], 12, clueY + ci * 13);
                            }

                            if (p.solution) {
                                var solved = true;
                                for (var rr = 0; rr < n; rr++) {
                                    for (var cc = 0; cc < n; cc++) {
                                        if (userGrid[rr][cc] !== p.solution[rr][cc]) solved = false;
                                    }
                                }
                                if (solved) {
                                    viz.screenText('Brilliant! Solved!', w / 2, clueY + p.clues.length * 13 + 8, viz.colors.green, 13);
                                }
                            }

                            viz.screenText('Challenge ' + (pIdx + 1) + ' / ' + puzzles.length, w - 60, 12, viz.colors.text, 10);
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var cellSize = 50;
                            var labelW = 55;
                            var labelH = 26;
                            var gx = (w - labelW - n * cellSize) / 2 + labelW;
                            var gy = 34 + labelH;
                            var col = Math.floor((mx - gx) / cellSize);
                            var row = Math.floor((my - gy) / cellSize);
                            if (row >= 0 && row < n && col >= 0 && col < n) {
                                userGrid[row][col] = (userGrid[row][col] + 1) % 3;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Next Challenge', function() {
                            pIdx = (pIdx + 1) % puzzles.length;
                            initUserGrid();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Clear', function() {
                            initUserGrid();
                            draw();
                        });

                        initUserGrid();
                        draw();
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: 'Five people (P, Q, R, S, T) each own a different pet (cat, dog, fish, bird, hamster). P does not own the dog or fish. Q does not own the cat, fish, or hamster. R does not own the cat, dog, or bird. S does not own the dog, bird, or hamster. T does not own the cat or hamster. Find the unique matching.',
                    hint: 'First find the people with the fewest options. Q can only own dog or bird. R can only own fish or hamster. S can only own cat or fish.',
                    solution: 'Q: dog or bird. R: fish or hamster. S: cat or fish. P: cat, bird, or hamster (not dog, not fish). T: dog, fish, or bird (not cat, not hamster). If S=cat: R=fish or hamster. T=dog, fish, or bird. Q=dog or bird. P=bird or hamster (not dog since P!=dog). If R=fish: P=bird or hamster. T=dog or bird. Q=dog or bird. T and Q share {dog, bird}, P=hamster. Then Q and T split dog and bird. Q=dog or bird, T=dog or bird. No further constraint among Q,T from given clues, so we need to check: T!=cat,!=hamster. Both dog and bird are fine. Not unique yet from these clues alone. But if S=fish: R=hamster. T=dog or bird. Q=dog or bird. P=cat or bird(not dog,not fish=S). P!=fish already. P=cat,bird, or hamster. R=hamster => P=cat or bird. Q=dog or bird. If P=cat: T and Q split {dog,bird}. If P=bird: Q=dog(not bird=P), T=dog? No, T=fish(no=S) or bird(=P)... conflict. So P=bird does not work if S=fish,R=hamster. P=cat. Q and T split dog,bird. Unique enough? Q=dog,T=bird or Q=bird,T=dog. Still 2 options. With S=cat: R=fish,P=hamster,Q=dog,T=bird or Q=bird,T=dog. Also 2. So the puzzle as stated may have 2 solutions. Adding "T does not own the dog": then T=bird, Q=dog. With S=cat: R=fish, P=hamster, Q=dog, T=bird. Final answer: P=hamster, Q=dog, R=fish, S=cat, T=bird.'
                },
                {
                    question: 'Explain why a 5x5 logic grid puzzle always requires at least 5 well-placed negative clues to have a unique solution.',
                    hint: 'Consider that \\(5! = 120\\) and each negative clue eliminates at most \\(4! = 24\\) permutations.',
                    solution: 'There are \\(5! = 120\\) possible permutations. Each negative clue at cell \\((i,j)\\) eliminates all permutations where row \\(i\\) maps to column \\(j\\), which is \\((n-1)! = 24\\) permutations. To reduce from 120 to 1, we must eliminate 119. Since \\(\\lceil 119/24 \\rceil = 5\\), we need at least 5 X marks. In practice, the number is often higher because clues in the same row or column have overlapping eliminations. A clue set of 5 X marks can work if they are in different rows and columns (forming a partial permutation matrix of X marks), maximizing the elimination overlap. But 5 is the theoretical minimum.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 6: Bridge
        // ─────────────────────────────────────────────
        {
            id: 'sec-bridge',
            title: 'What Comes Next',
            content: `
<h2>From Grids to Bigger Ideas</h2>

<p>Logic grid puzzles are a special case of <strong>constraint satisfaction problems (CSPs)</strong>, one of the central topics in both mathematics and computer science. Every Sudoku puzzle, every scheduling problem, every resource allocation task is, at its core, a CSP: you have variables, domains of possible values, and constraints that restrict which combinations are allowed.</p>

<div class="env-block remark">
<strong>Connections.</strong>
<ul>
<li><strong>Sudoku</strong> (Chapter 19) is a logic grid with three categories (row, column, box) instead of two.</li>
<li><strong>Graph coloring</strong> (Chapter 18) is a CSP where the constraint is "adjacent vertices get different colors."</li>
<li><strong>Combinatorics</strong> (Chapters 4-8) gives us the tools to count how many solutions a puzzle has before we start solving.</li>
</ul>
</div>

<p>The elimination technique you practiced here, marking what is impossible and propagating consequences, is exactly the <strong>arc consistency</strong> algorithm used in AI constraint solvers. When you got stuck on a hard puzzle and had to consider cases ("if A=1 then... but if A=2 then..."), you were doing <strong>backtracking search</strong>, the other fundamental CSP technique.</p>

<p>In the next chapters, we will explore more puzzle types that exercise different aspects of mathematical thinking. But the core lesson of this chapter applies everywhere: <strong>organize what you know, eliminate what you can, and let the logic lead you to the answer.</strong></p>
`,
            visualizations: [
                {
                    id: 'viz-grid-generator',
                    title: 'Random Logic Grid Generator',
                    description: 'Generate random logic grid puzzles of size 3 to 6. The generator creates a random solution, then produces clues. Try to solve them!',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var names3 = ['Amy', 'Ben', 'Cal'];
                        var names4 = ['Amy', 'Ben', 'Cal', 'Dee'];
                        var names5 = ['Amy', 'Ben', 'Cal', 'Dee', 'Eve'];
                        var names6 = ['Amy', 'Ben', 'Cal', 'Dee', 'Eve', 'Fay'];
                        var items3 = ['Red', 'Blue', 'Green'];
                        var items4 = ['Red', 'Blue', 'Green', 'Gold'];
                        var items5 = ['Red', 'Blue', 'Green', 'Gold', 'Pink'];
                        var items6 = ['Red', 'Blue', 'Green', 'Gold', 'Pink', 'Gray'];

                        var n = 3;
                        var solution = null; // permutation array
                        var clues = [];
                        var userGrid = [];
                        var rowLabels = [];
                        var colLabels = [];

                        function getLabels(size) {
                            var nl = size <= 3 ? names3 : size <= 4 ? names4 : size <= 5 ? names5 : names6;
                            var il = size <= 3 ? items3 : size <= 4 ? items4 : size <= 5 ? items5 : items6;
                            return { rows: nl.slice(0, size), cols: il.slice(0, size) };
                        }

                        function shuffle(arr) {
                            var a = arr.slice();
                            for (var i = a.length - 1; i > 0; i--) {
                                var j = Math.floor(Math.random() * (i + 1));
                                var t = a[i]; a[i] = a[j]; a[j] = t;
                            }
                            return a;
                        }

                        function generatePuzzle() {
                            var labels = getLabels(n);
                            rowLabels = labels.rows;
                            colLabels = labels.cols;

                            // Random permutation as solution
                            var perm = [];
                            for (var i = 0; i < n; i++) perm.push(i);
                            solution = shuffle(perm);

                            // Generate clues: for each row, create negative clues for non-solution columns
                            // But only use enough to make it uniquely solvable
                            // Strategy: for each person, X out all wrong answers except possibly one
                            clues = [];
                            var needed = []; // collect all possible negative clues
                            for (var r = 0; r < n; r++) {
                                for (var c = 0; c < n; c++) {
                                    if (solution[r] !== c) {
                                        needed.push({ r: r, c: c });
                                    }
                                }
                            }
                            // Shuffle and try to find minimal set
                            needed = shuffle(needed);

                            // Start with all clues, remove one at a time if still unique
                            var active = needed.slice();
                            for (var k = needed.length - 1; k >= 0; k--) {
                                var candidate = active.slice();
                                candidate.splice(k, 1);
                                if (isUnique(candidate, n, solution)) {
                                    active = candidate;
                                }
                            }

                            clues = [];
                            for (var ci = 0; ci < active.length; ci++) {
                                clues.push(rowLabels[active[ci].r] + ' is not ' + colLabels[active[ci].c] + '.');
                            }

                            initUserGrid();
                        }

                        function isUnique(clueSet, size, sol) {
                            // Check if clue set (list of {r,c} X marks) yields unique solution
                            // Build forbidden set
                            var forbidden = {};
                            for (var i = 0; i < clueSet.length; i++) {
                                forbidden[clueSet[i].r + ',' + clueSet[i].c] = true;
                            }
                            // Count solutions by brute force (small n)
                            var count = 0;
                            var perm = [];
                            for (var j = 0; j < size; j++) perm.push(j);

                            function permute(arr, l) {
                                if (count > 1) return;
                                if (l === arr.length) {
                                    // Check if this permutation violates any clue
                                    for (var r = 0; r < arr.length; r++) {
                                        if (forbidden[r + ',' + arr[r]]) return;
                                    }
                                    count++;
                                    return;
                                }
                                for (var i = l; i < arr.length; i++) {
                                    var t = arr[l]; arr[l] = arr[i]; arr[i] = t;
                                    permute(arr, l + 1);
                                    arr[i] = arr[l]; arr[l] = t;
                                }
                            }
                            permute(perm, 0);
                            return count === 1;
                        }

                        function initUserGrid() {
                            userGrid = [];
                            for (var r = 0; r < n; r++) {
                                userGrid.push([]);
                                for (var c = 0; c < n; c++) userGrid[r].push(0);
                            }
                        }

                        function draw() {
                            viz.clear();
                            if (!solution) generatePuzzle();

                            var cellSize = Math.min(55, (w - 100) / n, (h - 140) / n);
                            var labelW = 45;
                            var labelH = 24;
                            var gx = (w - labelW - n * cellSize) / 2 + labelW;
                            var gy = 32 + labelH;

                            viz.screenText('Random ' + n + 'x' + n + ' Logic Grid', w / 2, 12, viz.colors.white, 13);

                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 10px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            for (var c = 0; c < n; c++) {
                                ctx.fillText(colLabels[c], gx + c * cellSize + cellSize / 2, gy - labelH / 2);
                            }

                            for (var r = 0; r < n; r++) {
                                ctx.fillStyle = viz.colors.teal;
                                ctx.font = 'bold 10px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText(rowLabels[r], gx - 5, gy + r * cellSize + cellSize / 2);

                                for (var c2 = 0; c2 < n; c2++) {
                                    var cx = gx + c2 * cellSize;
                                    var cy = gy + r * cellSize;
                                    ctx.fillStyle = '#0f0f28';
                                    ctx.fillRect(cx, cy, cellSize, cellSize);
                                    ctx.strokeStyle = viz.colors.axis;
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx, cy, cellSize, cellSize);

                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    if (userGrid[r][c2] === 1) {
                                        ctx.fillStyle = viz.colors.red;
                                        ctx.font = 'bold 16px -apple-system,sans-serif';
                                        ctx.fillText('X', cx + cellSize / 2, cy + cellSize / 2);
                                    } else if (userGrid[r][c2] === 2) {
                                        ctx.fillStyle = viz.colors.green;
                                        ctx.font = 'bold 16px -apple-system,sans-serif';
                                        ctx.fillText('O', cx + cellSize / 2, cy + cellSize / 2);
                                    }
                                }
                            }

                            // Clues
                            var clueY = gy + n * cellSize + 10;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '9.5px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            var maxClues = Math.min(clues.length, 12);
                            for (var ci = 0; ci < maxClues; ci++) {
                                var clueX = ci < 6 ? 12 : w / 2 + 5;
                                var clueRow = ci < 6 ? ci : ci - 6;
                                ctx.fillText((ci + 1) + '. ' + clues[ci], clueX, clueY + clueRow * 13);
                            }
                            if (clues.length > 12) {
                                ctx.fillText('... and ' + (clues.length - 12) + ' more clues', 12, clueY + 6 * 13);
                            }

                            // Check solution
                            var solved = true;
                            for (var rr = 0; rr < n; rr++) {
                                for (var cc = 0; cc < n; cc++) {
                                    var expected = (solution[rr] === cc) ? 2 : 1;
                                    if (userGrid[rr][cc] !== expected) solved = false;
                                }
                            }
                            if (solved) {
                                var msgY = clueY + Math.min(6, maxClues) * 13 + 10;
                                viz.screenText('Solved! Great work!', w / 2, msgY, viz.colors.green, 13);
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var cellSize = Math.min(55, (w - 100) / n, (h - 140) / n);
                            var labelW = 45;
                            var labelH = 24;
                            var gx = (w - labelW - n * cellSize) / 2 + labelW;
                            var gy = 32 + labelH;
                            var col = Math.floor((mx - gx) / cellSize);
                            var row = Math.floor((my - gy) / cellSize);
                            if (row >= 0 && row < n && col >= 0 && col < n) {
                                userGrid[row][col] = (userGrid[row][col] + 1) % 3;
                                draw();
                            }
                        });

                        VizEngine.createSlider(controls, 'Size', 3, 6, n, 1, function(val) {
                            n = Math.round(val);
                            generatePuzzle();
                            draw();
                        });
                        VizEngine.createButton(controls, 'New Puzzle', function() {
                            generatePuzzle();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Show Answer', function() {
                            for (var r = 0; r < n; r++) {
                                for (var c = 0; c < n; c++) {
                                    userGrid[r][c] = (solution[r] === c) ? 2 : 1;
                                }
                            }
                            draw();
                        });
                        VizEngine.createButton(controls, 'Clear', function() {
                            initUserGrid();
                            draw();
                        });

                        generatePuzzle();
                        draw();
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: 'A logic grid puzzle is a constraint satisfaction problem (CSP). Name the three components of a CSP and identify what they correspond to in a logic grid.',
                    hint: 'A CSP has variables, domains, and constraints. In a logic grid, what are the "variables" you are trying to determine?',
                    solution: 'The three components are: (1) <strong>Variables</strong>: one variable for each element in the first category (e.g., each person). (2) <strong>Domains</strong>: the possible values each variable can take (e.g., the items). Each variable\'s domain is the full set of items initially, shrinking as X marks are placed. (3) <strong>Constraints</strong>: the clues (negative/positive pairings) plus the global constraint that the assignment must be a bijection (no two variables share a value). The elimination technique is exactly the CSP algorithm called "arc consistency" or "constraint propagation."'
                }
            ]
        }
    ]
});
})();
