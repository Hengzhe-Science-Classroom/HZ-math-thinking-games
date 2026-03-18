// === Chapter 14: Winning Strategies — Backward Reasoning ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch14',
    number: 14,
    title: 'Winning Strategies \u2014 Backward Reasoning',
    subtitle: 'Start from the end and work your way back',
    sections: [
        // ===== Section 0: Think from the End =====
        {
            id: 'ch14-sec00',
            title: 'Think from the End',
            content: `
<h2>Backward Induction</h2>

<p>Most people play games by thinking forward: "If I do this, then they might do that, then I could do..." This quickly becomes overwhelming. There are too many possibilities to track.</p>

<p>Mathematicians use a far more powerful approach: <strong>think from the end</strong>.</p>

<div class="env-block definition">
<strong>Backward Induction</strong><br>
Start from the final position of the game. Determine which positions are winning and losing for the player to move. Then work backwards, one step at a time, labeling each position as a win or a loss.
</div>

<h3>P-Positions and N-Positions</h3>

<p>We already met this terminology in the Nim chapter. Let us make it precise for any two-player game.</p>

<div class="env-block definition">
<strong>P-Positions and N-Positions</strong><br>
<ul>
<li>A <strong>P-position</strong> (Previous player wins) is a position where the player who just moved is winning. Equivalently, the player whose turn it is will <em>lose</em> with optimal play.</li>
<li>An <strong>N-position</strong> (Next player wins) is a position where the player whose turn it is can <em>win</em> with optimal play.</li>
</ul>
The classification follows three rules:
<ol>
<li>The terminal position (no moves left) is a P-position (the player who moved last wins).</li>
<li>A position is an N-position if there exists at least one move to a P-position.</li>
<li>A position is a P-position if <em>every</em> move leads to an N-position.</li>
</ol>
</div>

<p>This is backward induction. Start from the end (rule 1), and propagate backwards (rules 2 and 3).</p>

<h3>A Tiny Example: The Subtraction Game</h3>

<p>Two players alternate turns. There are \\(n\\) stones. On your turn, you may take 1, 2, or 3 stones. Whoever takes the last stone wins.</p>

<p>Let us classify positions from the end:</p>

<ul>
<li>\\(n = 0\\): No stones left, previous player won. <strong>P-position.</strong></li>
<li>\\(n = 1\\): Take 1, reach 0 (P). <strong>N-position.</strong></li>
<li>\\(n = 2\\): Take 2, reach 0 (P). <strong>N-position.</strong></li>
<li>\\(n = 3\\): Take 3, reach 0 (P). <strong>N-position.</strong></li>
<li>\\(n = 4\\): Can reach 1, 2, or 3. All are N-positions. <strong>P-position!</strong></li>
<li>\\(n = 5\\): Can reach 4 (P). <strong>N-position.</strong></li>
<li>\\(n = 6\\): Can reach 5, 4, 3. Includes 4 (P). <strong>N-position.</strong></li>
<li>\\(n = 7\\): Can reach 6, 5, 4. Includes 4 (P). <strong>N-position.</strong></li>
<li>\\(n = 8\\): Can reach 7, 6, 5. All N. <strong>P-position!</strong></li>
</ul>

<p>The pattern is clear: P-positions are the multiples of 4. If \\(4 \\mid n\\), you lose; otherwise, you win by reducing to the nearest multiple of 4.</p>

<div class="env-block intuition">
<strong>Why multiples of 4?</strong><br>
Because you can take 1, 2, or 3. Whatever your opponent takes, you take enough to total 4. This way, the pile decreases by exactly 4 on every pair of turns, and your opponent faces 0.
</div>

<div class="viz-placeholder" data-viz="ch14-subtraction"></div>
`,
            visualizations: [
                {
                    id: 'ch14-subtraction',
                    title: 'Subtraction Game Analyzer',
                    description: 'See the P/N classification of every position in the subtraction game. Green = P-position (you lose), Orange = N-position (you win).',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var maxTake = 3;
                        var maxN = 20;

                        VizEngine.createSlider(controls, 'Max take', 1, 6, maxTake, 1, function(v) {
                            maxTake = Math.round(v);
                        });

                        function classify(n, mt) {
                            // Returns array of 'P' or 'N' for positions 0..n
                            var result = [];
                            for (var i = 0; i <= n; i++) {
                                if (i === 0) {
                                    result.push('P');
                                    continue;
                                }
                                var isN = false;
                                for (var t = 1; t <= Math.min(i, mt); t++) {
                                    if (result[i - t] === 'P') {
                                        isN = true;
                                        break;
                                    }
                                }
                                result.push(isN ? 'N' : 'P');
                            }
                            return result;
                        }

                        viz.animate(function(t) {
                            viz.clear();

                            var classes = classify(maxN, maxTake);

                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Subtraction Game (take 1 to ' + maxTake + ')', w / 2, 25);

                            var cellW = Math.min(40, (w - 80) / (maxN + 1));
                            var cellH = 50;
                            var startX = (w - (maxN + 1) * cellW) / 2;
                            var startY = 60;

                            for (var i = 0; i <= maxN; i++) {
                                var x = startX + i * cellW;
                                var isP = classes[i] === 'P';

                                // Cell
                                ctx.fillStyle = isP ? '#3fb95033' : '#f0883e33';
                                ctx.fillRect(x + 1, startY, cellW - 2, cellH);

                                // Border
                                ctx.strokeStyle = isP ? '#3fb950' : '#f0883e';
                                ctx.lineWidth = isP ? 2 : 1;
                                ctx.strokeRect(x + 1, startY, cellW - 2, cellH);

                                // Number
                                ctx.fillStyle = isP ? '#3fb950' : '#f0883e';
                                ctx.font = 'bold 14px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(i.toString(), x + cellW / 2, startY + 20);

                                // P/N label
                                ctx.font = 'bold 12px -apple-system, sans-serif';
                                ctx.fillText(classes[i], x + cellW / 2, startY + 40);
                            }

                            // Legend
                            var legendY = startY + cellH + 30;
                            ctx.fillStyle = '#3fb950';
                            ctx.fillRect(w / 2 - 180, legendY - 8, 16, 16);
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('P-position (you lose)', w / 2 - 160, legendY + 4);

                            ctx.fillStyle = '#f0883e';
                            ctx.fillRect(w / 2 + 30, legendY - 8, 16, 16);
                            ctx.fillStyle = '#f0f6fc';
                            ctx.fillText('N-position (you win)', w / 2 + 50, legendY + 4);

                            // Pattern description
                            legendY += 35;
                            ctx.fillStyle = '#58a6ff';
                            ctx.font = '14px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Pattern: P-positions are multiples of ' + (maxTake + 1), w / 2, legendY);

                            // Arrows showing transitions
                            var arrowY = startY + cellH + 5;
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 1;
                            // Show a few example arrows from N to P
                            for (var i = 1; i <= Math.min(maxN, maxTake + 1); i++) {
                                if (classes[i] === 'N') {
                                    // Arrow from i back to 0
                                    var fromX = startX + i * cellW + cellW / 2;
                                    var toX = startX + cellW / 2;
                                    ctx.beginPath();
                                    ctx.moveTo(fromX, arrowY);
                                    ctx.quadraticCurveTo((fromX + toX) / 2, arrowY + 15 + i * 3, toX, arrowY);
                                    ctx.stroke();
                                }
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the subtraction game where you can take 1, 2, 3, or 4 stones, what are the P-positions?',
                    hint: 'Apply the same backward analysis. The pattern repeats every \\(1 + 2 + 3 + 4\\)... just kidding. Think about what number the "take" options sum to plus 1.',
                    solution: 'The P-positions are multiples of 5: 0, 5, 10, 15, 20, ... When you can take 1 through \\(k\\), the P-positions are multiples of \\(k + 1\\). With \\(k = 4\\), P-positions are multiples of 5. Strategy: whatever your opponent takes (call it \\(t\\)), you take \\(5 - t\\), so together you always remove exactly 5.'
                },
                {
                    question: 'What if you can take 1 or 4 stones (but NOT 2 or 3)? Classify positions 0 through 10.',
                    hint: 'This is trickier because the allowed moves are not consecutive. You must use the full backward induction algorithm.',
                    solution: '\\(n = 0\\): P. \\(n = 1\\): can reach 0(P), so N. \\(n = 2\\): can reach 1(N), so P. \\(n = 3\\): can reach 2(P), so N. \\(n = 4\\): can reach 3(N) or 0(P), so N. \\(n = 5\\): can reach 4(N) or 1(N), so P. \\(n = 6\\): can reach 5(P), so N. \\(n = 7\\): can reach 6(N) or 3(N)... wait, \\(7-4=3\\)(N) and \\(7-1=6\\)(N), so P. Pattern: P at 0, 2, 5, 7, 10, 12, ... The P-positions are numbers \\(\\equiv 0\\) or \\(2 \\pmod{5}\\).'
                }
            ]
        },

        // ===== Section 1: The Chocolate Bar Game (Chomp) =====
        {
            id: 'ch14-sec01',
            title: 'The Chocolate Bar Game',
            content: `
<h2>Chomp!</h2>

<p>Here is one of the most charming (and tricky) two-player games in combinatorial game theory.</p>

<div class="env-block definition">
<strong>Chomp (The Chocolate Bar Game)</strong><br>
You have a rectangular chocolate bar divided into a grid of squares. The bottom-left square is <strong>poisoned</strong>. Players take turns choosing a square and eating it along with everything above and to the right. Whoever is forced to eat the poisoned square loses.
</div>

<div class="viz-placeholder" data-viz="ch14-chomp"></div>

<h3>Who Wins?</h3>

<p>For any rectangle larger than \\(1 \\times 1\\), the <strong>first player always wins</strong>. This is proved by a beautiful argument called <strong>strategy stealing</strong>.</p>

<div class="env-block theorem">
<strong>Strategy-Stealing Argument</strong><br>
In Chomp on any \\(m \\times n\\) board with \\(m, n \\geq 1\\) and \\((m,n) \\neq (1,1)\\), the first player has a winning strategy.
</div>

<p><em>Proof.</em> Suppose, for contradiction, that the second player has a winning strategy. Consider the first player's move of eating just the top-right corner square. After this move, it is the second player's turn, and by our assumption, they have a winning response; call it move \\(M\\).</p>

<p>But here is the key insight: <strong>the first player could have made move \\(M\\) as their first move instead!</strong> Move \\(M\\) eats some square and everything above-right of it. Since that region includes the top-right corner (which the first player ate in our scenario), move \\(M\\) is always a legal opening move. Playing \\(M\\) first would put the first player in the same winning position we attributed to the second player.</p>

<p>This contradicts our assumption that the second player wins. Therefore, the first player must win. \\(\\square\\)</p>

<div class="env-block warning">
<strong>An existence proof, not a recipe</strong><br>
The strategy-stealing argument proves that the first player <em>can</em> win, but it does not tell you <em>how</em>. For most board sizes, finding the optimal first move requires exhaustive computation. Nobody knows a simple formula for the winning first move on a general \\(m \\times n\\) board. This is one of the great open problems in combinatorial game theory.
</div>

<div class="env-block remark">
<strong>Special cases we can solve</strong><br>
For \\(2 \\times n\\) boards, the winning first move is always to eat the square at position \\((2, 2)\\), leaving an L-shaped piece. After that, the first player can use a symmetry strategy. For \\(n \\times n\\) (square) boards, the winning first move is to eat just the top-right corner.
</div>
`,
            visualizations: [
                {
                    id: 'ch14-chomp',
                    title: 'Chomp! (Interactive)',
                    description: 'Play Chomp against a friend (or yourself). Click a square to eat it and everything above-right. The bottom-left square is poison (skull). Whoever eats it loses!',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var rows = 5, cols = 7;
                        var grid = []; // grid[r][c] = true means square exists
                        var turn = 0; // 0 = player 1, 1 = player 2
                        var gameOver = false;
                        var loser = -1;
                        var message = 'Player 1\'s turn. Click a square to chomp!';

                        function resetGrid() {
                            grid = [];
                            for (var r = 0; r < rows; r++) {
                                grid.push([]);
                                for (var c = 0; c < cols; c++) {
                                    grid[r].push(true);
                                }
                            }
                            turn = 0;
                            gameOver = false;
                            loser = -1;
                            message = 'Player 1\'s turn. Click a square to chomp!';
                        }
                        resetGrid();

                        var cellSize = Math.min(50, (w - 100) / cols, (h - 120) / rows);
                        var gridLeft = (w - cols * cellSize) / 2;
                        var gridTop = 70;

                        VizEngine.createButton(controls, 'New Game', function() {
                            resetGrid();
                        });

                        VizEngine.createSlider(controls, 'Rows', 2, 8, rows, 1, function(v) {
                            rows = Math.round(v);
                            cellSize = Math.min(50, (w - 100) / cols, (h - 120) / rows);
                            gridLeft = (w - cols * cellSize) / 2;
                            resetGrid();
                        });

                        VizEngine.createSlider(controls, 'Cols', 2, 10, cols, 1, function(v) {
                            cols = Math.round(v);
                            cellSize = Math.min(50, (w - 100) / cols, (h - 120) / rows);
                            gridLeft = (w - cols * cellSize) / 2;
                            resetGrid();
                        });

                        viz.canvas.addEventListener('click', function(e) {
                            if (gameOver) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;

                            // Find clicked cell (row 0 = bottom)
                            for (var r = 0; r < rows; r++) {
                                for (var c = 0; c < cols; c++) {
                                    if (!grid[r][c]) continue;
                                    var drawRow = rows - 1 - r; // flip: row 0 at bottom
                                    var cx = gridLeft + c * cellSize;
                                    var cy = gridTop + drawRow * cellSize;
                                    if (mx >= cx && mx <= cx + cellSize && my >= cy && my <= cy + cellSize) {
                                        // Eat this square and everything above-right
                                        // "above" means higher row index, "right" means higher col index
                                        var ate = 0;
                                        for (var rr = r; rr < rows; rr++) {
                                            for (var cc = c; cc < cols; cc++) {
                                                if (grid[rr][cc]) ate++;
                                                grid[rr][cc] = false;
                                            }
                                        }
                                        // Check if poison was eaten
                                        if (!grid[0][0]) {
                                            gameOver = true;
                                            loser = turn;
                                            message = 'Player ' + (turn + 1) + ' ate the poison! Player ' + (2 - turn) + ' wins!';
                                        } else {
                                            turn = 1 - turn;
                                            message = 'Player ' + (turn + 1) + '\'s turn. (' + ate + ' squares eaten)';
                                        }
                                        return;
                                    }
                                }
                            }
                        });

                        var playerColors = ['#58a6ff', '#f0883e'];

                        viz.animate(function(t) {
                            viz.clear();

                            // Title
                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Chomp!', w / 2, 22);

                            // Message
                            ctx.fillStyle = gameOver ? (loser === 0 ? '#f0883e' : '#58a6ff') : playerColors[turn];
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.fillText(message, w / 2, 48);

                            // Draw grid
                            for (var r = 0; r < rows; r++) {
                                for (var c = 0; c < cols; c++) {
                                    var drawRow = rows - 1 - r;
                                    var cx = gridLeft + c * cellSize;
                                    var cy = gridTop + drawRow * cellSize;

                                    if (grid[r][c]) {
                                        // Chocolate square
                                        var shade = 28 + (r + c) % 2 * 8;
                                        ctx.fillStyle = VizEngine.hsl(25, 70, shade);
                                        ctx.fillRect(cx + 1, cy + 1, cellSize - 2, cellSize - 2);

                                        // Poison marker on (0,0)
                                        if (r === 0 && c === 0) {
                                            ctx.fillStyle = '#f85149';
                                            ctx.font = 'bold ' + Math.round(cellSize * 0.5) + 'px -apple-system, sans-serif';
                                            ctx.textAlign = 'center';
                                            ctx.textBaseline = 'middle';
                                            ctx.fillText('\u2620', cx + cellSize / 2, cy + cellSize / 2);
                                        }
                                    } else {
                                        // Empty (eaten)
                                        ctx.fillStyle = '#0c0c20';
                                        ctx.fillRect(cx + 1, cy + 1, cellSize - 2, cellSize - 2);
                                    }
                                }
                            }

                            // Grid border
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            for (var r = 0; r <= rows; r++) {
                                ctx.beginPath();
                                ctx.moveTo(gridLeft, gridTop + r * cellSize);
                                ctx.lineTo(gridLeft + cols * cellSize, gridTop + r * cellSize);
                                ctx.stroke();
                            }
                            for (var c = 0; c <= cols; c++) {
                                ctx.beginPath();
                                ctx.moveTo(gridLeft + c * cellSize, gridTop);
                                ctx.lineTo(gridLeft + c * cellSize, gridTop + rows * cellSize);
                                ctx.stroke();
                            }

                            // Turn indicator
                            var indicatorY = gridTop + rows * cellSize + 25;
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '12px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('Click any remaining square to eat it + everything above & right', w / 2, indicatorY);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In Chomp on a \\(2 \\times 5\\) board, what is the first player\'s winning first move?',
                    hint: 'Try eating the square at position (row 2, column 2), leaving an L-shape.',
                    solution: 'Eat the top-right block starting from (row 2, col 2). This leaves an L-shape: the entire bottom row (5 squares) plus just the bottom-left square of the top row. Now use a mirror strategy: whatever the opponent eats from one arm of the L, you eat the corresponding amount from the other arm. The opponent is eventually forced to eat the poison square.'
                },
                {
                    question: 'The strategy-stealing argument shows the first player wins Chomp, but does not say how. Why is this argument non-constructive? Can you think of another game where strategy-stealing applies?',
                    hint: 'Think about what information the argument uses. Does it compute any specific moves?',
                    solution: 'The argument is non-constructive because it only proves existence by contradiction. It says: "if the second player had a winning strategy, the first player could steal it." But it never identifies <em>which</em> strategy gets stolen. We only learn that the second player cannot have a winning strategy; we do not learn the first player\'s actual strategy.<br><br>Strategy-stealing also applies to Hex (the board game). On any \\(n \\times n\\) Hex board, the first player has a winning strategy, proved by the same logic: having an extra stone on the board never hurts in Hex, so the first player can always steal any strategy the second player might have.'
                }
            ]
        },

        // ===== Section 2: Subtract-a-Square =====
        {
            id: 'ch14-sec02',
            title: 'Subtract-a-Square',
            content: `
<h2>A Game with Surprising Structure</h2>

<p>Here is a game with a deceptively simple rule but fascinatingly irregular behavior.</p>

<div class="env-block definition">
<strong>Subtract-a-Square</strong><br>
Start with a pile of \\(n\\) stones. On your turn, remove a <strong>perfect square</strong> number of stones (1, 4, 9, 16, 25, ...). The player who takes the last stone wins.
</div>

<div class="viz-placeholder" data-viz="ch14-subtract-square"></div>

<p>Let us classify positions using backward induction:</p>

<ul>
<li>\\(n = 0\\): P (no moves, previous player wins)</li>
<li>\\(n = 1\\): take 1, reach 0(P). <strong>N.</strong></li>
<li>\\(n = 2\\): take 1, reach 1(N). That is the only option. <strong>P!</strong></li>
<li>\\(n = 3\\): take 1, reach 2(P). <strong>N.</strong></li>
<li>\\(n = 4\\): take 4, reach 0(P). <strong>N.</strong></li>
<li>\\(n = 5\\): take 1 reach 4(N), take 4 reach 1(N). <strong>P!</strong></li>
<li>\\(n = 6\\): take 1, reach 5(P). <strong>N.</strong></li>
<li>\\(n = 7\\): take 1 reach 6(N), take 4 reach 3(N). <strong>P!</strong></li>
</ul>

<p>The P-positions so far: 0, 2, 5, 7, ... There is no simple formula! The sequence of P-positions in Subtract-a-Square is known to be quite irregular. This is typical of subtraction games with non-consecutive move sets.</p>

<div class="env-block remark">
<strong>Cold positions</strong><br>
P-positions are sometimes called "cold" positions (you do not want to be there), while N-positions are "hot" (you can make a winning move). In Subtract-a-Square, the cold positions are: 0, 2, 5, 7, 10, 12, 15, 17, 20, 22, 34, 39, ...
</div>

<h3>Computational Approach</h3>

<p>Since there is no closed-form expression, we must compute P/N labels using the backward induction algorithm. This is a great programming exercise: maintain an array, and for each position, check if any move leads to a P-position.</p>

<div class="env-block example">
<strong>Algorithm</strong><br>
<code>
For i from 0 to n:<br>
&emsp; label[i] = P<br>
&emsp; For each perfect square s \u2264 i:<br>
&emsp;&emsp; If label[i - s] == P:<br>
&emsp;&emsp;&emsp; label[i] = N<br>
&emsp;&emsp;&emsp; break
</code>
</div>
`,
            visualizations: [
                {
                    id: 'ch14-subtract-square',
                    title: 'Subtract-a-Square Game',
                    description: 'Play Subtract-a-Square against the computer. Start with n stones and remove a perfect square each turn. The computer plays optimally!',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var maxN = 50;
                        // Precompute P/N labels
                        var labels = [];
                        for (var i = 0; i <= maxN; i++) {
                            labels.push('P');
                            for (var s = 1; s * s <= i; s++) {
                                if (labels[i - s * s] === 'P') {
                                    labels[i] = 'N';
                                    break;
                                }
                            }
                        }

                        var n = 20;
                        var turn = 0;
                        var gameOver = false;
                        var message = 'Your turn! Choose a perfect square to subtract.';

                        function getSquares(val) {
                            var sq = [];
                            for (var s = 1; s * s <= val; s++) sq.push(s * s);
                            return sq;
                        }

                        function reset() {
                            n = Math.floor(Math.random() * 20) + 10;
                            turn = 0;
                            gameOver = false;
                            message = 'Stones: ' + n + '. Your turn! Choose a perfect square.';
                        }

                        VizEngine.createButton(controls, 'New Game', reset);

                        // Buttons for square choices
                        var btnContainer = document.createElement('div');
                        btnContainer.style.cssText = 'display:flex;flex-wrap:wrap;gap:4px;margin-top:4px;';
                        container.appendChild(btnContainer);

                        function updateButtons() {
                            btnContainer.innerHTML = '';
                            if (gameOver || turn !== 0) return;
                            var sq = getSquares(n);
                            for (var i = 0; i < sq.length; i++) {
                                (function(val) {
                                    var btn = document.createElement('button');
                                    btn.style.cssText = 'padding:4px 10px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;cursor:pointer;';
                                    btn.textContent = '-' + val;
                                    btn.addEventListener('click', function() {
                                        if (gameOver || turn !== 0) return;
                                        n -= val;
                                        if (n === 0) {
                                            gameOver = true;
                                            message = 'You took the last stones! You win!';
                                            updateButtons();
                                            return;
                                        }
                                        turn = 1;
                                        message = 'Computer thinking...';
                                        updateButtons();
                                        setTimeout(computerMove, 500);
                                    });
                                    btnContainer.appendChild(btn);
                                })(sq[i]);
                            }
                        }
                        updateButtons();

                        function computerMove() {
                            if (gameOver) return;
                            var sq = getSquares(n);
                            var moved = false;
                            // Optimal: move to P-position
                            for (var i = 0; i < sq.length; i++) {
                                var rem = n - sq[i];
                                if (rem >= 0 && labels[rem] === 'P') {
                                    message = 'Computer takes ' + sq[i] + '. ';
                                    n = rem;
                                    moved = true;
                                    break;
                                }
                            }
                            if (!moved && sq.length > 0) {
                                // In losing position, take 1
                                message = 'Computer takes 1. ';
                                n -= 1;
                            }
                            if (n === 0) {
                                gameOver = true;
                                message += 'Computer took the last stones. Computer wins!';
                            } else {
                                message += 'Stones: ' + n + '. Your turn!';
                                turn = 0;
                            }
                            updateButtons();
                        }

                        viz.animate(function(t) {
                            viz.clear();

                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Subtract-a-Square', w / 2, 25);

                            // Message
                            var msgColor = gameOver ? (message.indexOf('You win') >= 0 ? '#3fb950' : '#f85149') : '#58a6ff';
                            ctx.fillStyle = msgColor;
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.fillText(message, w / 2, 48);

                            // Draw stones
                            var stoneR = 8;
                            var stonesPerRow = Math.min(15, Math.ceil(Math.sqrt(n * 2)));
                            if (stonesPerRow === 0) stonesPerRow = 1;
                            var stoneGap = stoneR * 2.5;
                            var stoneStartX = w / 2 - (Math.min(n, stonesPerRow) - 1) * stoneGap / 2;
                            var stoneStartY = 90;

                            for (var i = 0; i < n; i++) {
                                var col = i % stonesPerRow;
                                var row = Math.floor(i / stonesPerRow);
                                var sx = stoneStartX + col * stoneGap;
                                var sy = stoneStartY + row * stoneGap;
                                var hue = (i * 17 + 180) % 360;
                                ctx.fillStyle = VizEngine.hsl(hue, 60, 50);
                                ctx.beginPath();
                                ctx.arc(sx, sy, stoneR, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Position classification
                            if (n <= maxN) {
                                var classY = h - 40;
                                ctx.fillStyle = labels[n] === 'P' ? '#3fb950' : '#f0883e';
                                ctx.font = '13px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Position ' + n + ' is a ' + labels[n] + '-position (' + (labels[n] === 'P' ? 'losing' : 'winning') + ' for current player)', w / 2, classY);
                            }

                            // P-positions display
                            var pPositions = [];
                            for (var i = 0; i <= 30; i++) {
                                if (labels[i] === 'P') pPositions.push(i);
                            }
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.fillText('P-positions: ' + pPositions.join(', ') + ', ...', w / 2, h - 18);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Continue the P/N classification for Subtract-a-Square up to \\(n = 15\\).',
                    hint: 'For each \\(n\\), check if there is a perfect square \\(s\\) such that \\(n - s\\) is a P-position. If yes, \\(n\\) is N; if no, \\(n\\) is P.',
                    solution: 'P at 0, N at 1, P at 2, N at 3, N at 4 (take 4 to reach 0), P at 5, N at 6, P at 7, N at 8 (take 1 to reach 7), N at 9 (take 9 or take 4 to reach 5), P at 10, N at 11 (take 1 to reach 10), P at 12, N at 13 (take 1 to reach 12), N at 14 (take 4 to reach 10 or take 9 to reach 5), P at 15. P-positions through 15: {0, 2, 5, 7, 10, 12, 15}.'
                },
                {
                    question: 'Notice the P-positions 0, 2, 5, 7, 10, 12, 15. What pattern do you see? Does it continue?',
                    hint: 'Look at the differences between consecutive P-positions.',
                    solution: 'The differences are 2, 3, 2, 3, 2, 3, ... alternating between 2 and 3. So P-positions appear to be numbers of the form \\(\\lfloor 5k/2 \\rfloor\\). However, this pattern <strong>does not continue forever</strong>! The next P-positions are 17, 20, 22, 34, ... The gap from 22 to 34 is 12, which breaks the 2-3 pattern. This is the tricky part: Subtract-a-Square has no known simple closed-form for its P-positions. The pattern is ultimately irregular.'
                }
            ]
        },

        // ===== Section 3: Symmetry Strategies =====
        {
            id: 'ch14-sec03',
            title: 'Symmetry Strategies',
            content: `
<h2>The Copycat</h2>

<p>One of the most elegant winning techniques in combinatorial games is the <strong>symmetry strategy</strong> (also called the "copycat" or "mirror" strategy). The idea is simple: arrange the game so that you can always copy your opponent's moves, guaranteeing that you make the last move.</p>

<div class="env-block example">
<strong>Example: Coins on a Round Table</strong><br>
Two players take turns placing identical coins flat on a circular table. Coins cannot overlap. The last player to successfully place a coin wins.<br><br>
<em>Strategy:</em> The first player places a coin exactly in the center of the table. After that, whenever the opponent places a coin, the first player places one at the diametrically opposite point. Since the table is symmetric, if the opponent's position is valid, so is the mirror position. The opponent always runs out of space first (because the first player's moves are always "available" by symmetry).
</div>

<div class="viz-placeholder" data-viz="ch14-symmetry"></div>

<h3>When Symmetry Works</h3>

<p>Symmetry strategies work when:</p>
<ol>
<li>The game has a natural symmetry (geometric, numerical, etc.).</li>
<li>You can establish the symmetric position on your first move or you start in one.</li>
<li>Copying the opponent's move is always legal and maintains the symmetry.</li>
</ol>

<h3>Symmetry in Number Games</h3>

<div class="env-block example">
<strong>Example: The 100 Game</strong><br>
Two players alternately say numbers from 1 to 10. Each player adds their number to a running total. Whoever reaches exactly 100 wins.<br><br>
<em>Analysis:</em> The target is 100. If you can always respond so that the pair of moves totals 11, then after each pair the running total increases by exactly 11. So the winning positions are \\(100, 89, 78, 67, 56, 45, 34, 23, 12, 1\\). The first player says 1, and then mirrors the opponent: if they say \\(k\\), you say \\(11 - k\\). This guarantees you hit every multiple of 11 plus 1, ending at 100.
</div>

<p>This is a symmetry strategy in disguise! You are maintaining the "symmetry" that each pair of moves totals a constant. It is the same idea as the two-pile Nim mirror strategy from Chapter 13.</p>

<div class="env-block remark">
<strong>Symmetry as an invariant</strong><br>
A symmetry strategy works by maintaining an <strong>invariant</strong>: a property that stays true after every pair of moves. In the table game, the invariant is "the coin configuration is rotationally symmetric." In the 100 game, the invariant is "the running total is \\(\\equiv 1 \\pmod{11}\\)." Finding the right invariant is the creative part.
</div>
`,
            visualizations: [
                {
                    id: 'ch14-symmetry',
                    title: 'Copycat Strategy on a Number Line',
                    description: 'Two players place tokens on a number line from 1 to 20. On each turn, pick a free number. Player 1 (blue) uses a symmetry strategy: always mirror around 10.5.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var maxNum = 20;
                        var slots = []; // 0 = free, 1 = player1, 2 = player2
                        var turn = 0; // 0 = player 1 (auto), 1 = player 2 (human)
                        var message = 'Player 2 (orange): click a number to claim it.';
                        var gameOver = false;
                        var p1score = 0, p2score = 0;

                        function reset() {
                            slots = [];
                            for (var i = 0; i <= maxNum; i++) slots.push(0);
                            turn = 1; // human goes first as player 2
                            gameOver = false;
                            p1score = 0;
                            p2score = 0;
                            message = 'Player 2 (you, orange): click a number to claim it.';
                        }
                        reset();

                        VizEngine.createButton(controls, 'Reset', reset);

                        function countClaimed() {
                            var c = 0;
                            for (var i = 1; i <= maxNum; i++) if (slots[i] !== 0) c++;
                            return c;
                        }

                        function computerMove() {
                            if (gameOver) return;
                            // Mirror strategy: find opponent's last move, mirror it
                            // Mirror of position i is maxNum + 1 - i
                            var moved = false;
                            for (var i = 1; i <= maxNum; i++) {
                                if (slots[i] === 2) { // player 2's position
                                    var mirror = maxNum + 1 - i;
                                    if (mirror >= 1 && mirror <= maxNum && slots[mirror] === 0) {
                                        slots[mirror] = 1;
                                        p1score += mirror;
                                        message = 'Player 1 (blue) mirrors: claims ' + mirror + '. Your turn!';
                                        moved = true;
                                        // Only mirror the most recent move
                                        break;
                                    }
                                }
                            }
                            if (!moved) {
                                // Claim first free slot
                                for (var i = 1; i <= maxNum; i++) {
                                    if (slots[i] === 0) {
                                        slots[i] = 1;
                                        p1score += i;
                                        message = 'Player 1 claims ' + i + '. Your turn!';
                                        break;
                                    }
                                }
                            }
                            if (countClaimed() >= maxNum) {
                                gameOver = true;
                                message = 'Game over! P1: ' + p1score + ', P2: ' + p2score + '. ' + (p1score > p2score ? 'P1 wins by symmetry!' : (p1score < p2score ? 'P2 wins!' : 'Tie!'));
                            }
                            turn = 1;
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (gameOver || turn !== 1) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;

                            var cellW = (w - 60) / maxNum;
                            var startX = 30;

                            for (var i = 1; i <= maxNum; i++) {
                                var cx = startX + (i - 1) * cellW + cellW / 2;
                                if (Math.abs(mx - cx) < cellW / 2 && slots[i] === 0) {
                                    slots[i] = 2;
                                    p2score += i;
                                    if (countClaimed() >= maxNum) {
                                        gameOver = true;
                                        message = 'Game over! P1: ' + p1score + ', P2: ' + p2score + '.';
                                    } else {
                                        turn = 0;
                                        setTimeout(computerMove, 400);
                                    }
                                    return;
                                }
                            }
                        });

                        viz.animate(function(t) {
                            viz.clear();

                            ctx.fillStyle = '#f0f6fc';
                            ctx.font = 'bold 16px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Symmetry Strategy Demo', w / 2, 25);

                            ctx.fillStyle = '#58a6ff';
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.fillText(message, w / 2, 50);

                            // Draw number line
                            var cellW = (w - 60) / maxNum;
                            var startX = 30;
                            var lineY = h / 2;

                            // Line
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(startX, lineY);
                            ctx.lineTo(startX + maxNum * cellW, lineY);
                            ctx.stroke();

                            // Mirror axis
                            var mirrorX = startX + (maxNum - 1) * cellW / 2 + cellW / 2;
                            ctx.strokeStyle = '#4a4a7a66';
                            ctx.setLineDash([4, 4]);
                            ctx.beginPath();
                            ctx.moveTo(mirrorX, lineY - 60);
                            ctx.lineTo(mirrorX, lineY + 60);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            ctx.fillStyle = '#4a4a7a';
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.fillText('mirror axis', mirrorX, lineY - 65);

                            // Slots
                            for (var i = 1; i <= maxNum; i++) {
                                var cx = startX + (i - 1) * cellW + cellW / 2;

                                // Number
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '11px -apple-system, sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(i.toString(), cx, lineY + 30);

                                if (slots[i] === 0) {
                                    ctx.strokeStyle = '#30363d';
                                    ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    ctx.arc(cx, lineY, 12, 0, Math.PI * 2);
                                    ctx.stroke();
                                } else {
                                    ctx.fillStyle = slots[i] === 1 ? '#58a6ff' : '#f0883e';
                                    ctx.beginPath();
                                    ctx.arc(cx, lineY, 12, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillStyle = '#0c0c20';
                                    ctx.font = 'bold 10px -apple-system, sans-serif';
                                    ctx.fillText(slots[i] === 1 ? 'P1' : 'P2', cx, lineY + 4);
                                }
                            }

                            // Scores
                            ctx.fillStyle = '#58a6ff';
                            ctx.font = '13px -apple-system, sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('P1 (blue): ' + p1score, 30, h - 30);
                            ctx.fillStyle = '#f0883e';
                            ctx.textAlign = 'right';
                            ctx.fillText('P2 (orange, you): ' + p2score, w - 30, h - 30);

                            // Mirror pairs hint
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '11px -apple-system, sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Mirror pairs: (1,20) (2,19) (3,18) ... each sums to 21', w / 2, h - 10);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the "coins on a round table" game, why is it essential that the first player places the first coin in the exact center?',
                    hint: 'What happens if the first coin is off-center? Can the opponent always find a spot that the first player cannot mirror?',
                    solution: 'If the first coin is off-center, the first player cannot use the mirror strategy because the remaining free space is not symmetric about any axis. The opponent could place a coin in a position whose "mirror" is blocked by the off-center first coin. By placing in the exact center, the first player establishes a point of symmetry, and from that point forward, every legal placement by the opponent has a corresponding legal mirror placement.'
                },
                {
                    question: 'Two players play the "100 Game" (say a number 1-10, add to running total, first to 100 wins). The first player says 1. The second player says 7, bringing the total to 8. What should the first player say?',
                    hint: 'The first player wants each pair of moves to sum to 11.',
                    solution: 'The first player says \\(11 - 7 = 4\\), bringing the total to \\(1 + 7 + 4 = 12\\). Now the total is \\(12 = 1 + 11\\), keeping the invariant that after each of the first player\'s moves, the total is \\(\\equiv 1 \\pmod{11}\\). Continuing: 12, 23, 34, 45, 56, 67, 78, 89, 100. The first player reaches 100 and wins.'
                }
            ]
        },

        // ===== Section 4: Pairing Strategies =====
        {
            id: 'ch14-sec04',
            title: 'Pairing Strategies',
            content: `
<h2>Divide and Conquer Through Pairing</h2>

<p>A <strong>pairing strategy</strong> is a generalization of the symmetry strategy. The idea: partition the game's positions (or moves) into pairs, and whenever your opponent makes one move in a pair, you respond with the other.</p>

<h3>Example: The Poisoned Chocolate Square</h3>

<p>Consider a \\(2 \\times n\\) Chomp board. The first player eats the top-right square. This creates an L-shape. Now the remaining squares can be paired: each square in the top row (except the poison) is paired with the square directly below it. Whenever the opponent eats from one member of a pair, the first player eats from the other.</p>

<h3>Example: Turning Turtles</h3>

<div class="env-block definition">
<strong>Turning Turtles</strong><br>
A row of coins, some heads-up and some tails-up. On your turn, you must flip a heads-up coin to tails. You may also (optionally) flip one other coin to the <em>left</em> of it (that coin can go either way). The player who flips the last heads-up coin to tails wins.
</div>

<p>This game is actually Nim in disguise! Each heads-up coin at position \\(k\\) corresponds to a Nim pile of size \\(k\\). The XOR of all pile sizes determines the winner. This is an example of how pairing (in this case, via the Sprague-Grundy theory) can reveal the hidden structure of a game.</p>

<h3>The General Principle</h3>

<div class="env-block theorem">
<strong>Pairing Strategy Principle</strong><br>
If you can partition the available moves (or positions) into pairs such that:
<ol>
<li>Whenever your opponent makes one move in a pair, the other move is legal for you;</li>
<li>Making the paired move does not disrupt the pairing of remaining moves;</li>
<li>The pairing ensures you make the last move;</li>
</ol>
then you have a winning strategy.
</div>

<h3>Example: Picking Numbers</h3>

<div class="env-block example">
<strong>The 1-to-2n Game</strong><br>
Numbers 1 through \\(2n\\) are written on a board. Two players alternate circling numbers. The player whose circled numbers contain any subset summing to \\(2n + 1\\) wins.<br><br>
<em>Analysis:</em> Pair the numbers: \\((1, 2n), (2, 2n-1), \\ldots, (n, n+1)\\). Each pair sums to \\(2n + 1\\). The second player's strategy: whenever the first player circles a number, circle its pair partner. The second player can never lose (they complete every pair the first player starts, so if anyone gets a pair summing to \\(2n + 1\\), it could be either player equally). In fact, with careful analysis, the second player wins because the first player must eventually be forced into an unfavorable choice.
</div>

<h3>Connection to Graph Theory</h3>

<p>Pairing strategies are closely connected to <strong>matchings</strong> in graph theory. A matching in a graph is a set of edges that share no vertices. A perfect matching pairs every vertex. When a game can be modeled as a graph where moves correspond to edges, a pairing strategy corresponds to a perfect matching.</p>

<div class="env-block intuition">
<strong>The toolbox so far</strong><br>
We now have four powerful tools for analyzing strategy games:
<ol>
<li><strong>Backward induction:</strong> classify P/N positions from the end.</li>
<li><strong>XOR / Nim theory:</strong> compute Nim-sums for impartial games.</li>
<li><strong>Symmetry strategies:</strong> maintain an invariant by copying your opponent.</li>
<li><strong>Pairing strategies:</strong> partition moves into pairs and respond to each.</li>
</ol>
In Chapter 15, we will see how the <strong>Sprague-Grundy theorem</strong> unifies all of these into a single, beautiful framework.
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Numbers 1 through 10 are on a board. Two players take turns picking one number. The player who first has two numbers that sum to 11 wins. Who has the winning strategy, and what is it?',
                    hint: 'Pair the numbers: (1,10), (2,9), (3,8), (4,7), (5,6). The game is equivalent to Tic-Tac-Toe on a 5-cell board where claiming one cell blocks your opponent from the pair.',
                    solution: 'This is equivalent to 5-pair Tic-Tac-Toe. The pairs are (1,10), (2,9), (3,8), (4,7), (5,6). Picking one number from a pair and then the other from the same pair gives you a win. The first player has a slight advantage (they get 5 picks vs. 4 for the second player), but with optimal play, neither player can be forced to lose. The game is a draw (neither player can force a pair before the opponent blocks). However, a careless opponent can lose in just 2 moves if they ignore a threatening pair.'
                },
                {
                    question: 'A \\(1 \\times n\\) chocolate bar (a single row of \\(n\\) squares, leftmost is poisoned) is played under Chomp rules. Who wins for \\(n = 1\\)? For \\(n \\geq 2\\)?',
                    hint: 'In a \\(1 \\times n\\) bar, the only possible moves are to eat from the right end.',
                    solution: 'For \\(n = 1\\), the first player must eat the only (poisoned) square, so the first player loses. For \\(n \\geq 2\\), the first player eats everything except the leftmost (poisoned) square, leaving the opponent with only the poison square. So the first player wins for all \\(n \\geq 2\\). The winning move is always to leave exactly 1 square.'
                },
                {
                    question: 'Design a pairing strategy for this game: a row of 10 pennies. Players take turns removing 1 or 2 adjacent pennies (the pennies must be next to each other, with no gaps). Last to move wins. (This is harder than it looks.)',
                    hint: 'Think about what happens if you remove the two middle pennies on your first move. What symmetry does this create?',
                    solution: 'Remove the two middle pennies (positions 5 and 6), splitting the row into two identical halves: positions 1-4 and 7-10. Now use a mirror strategy: whatever your opponent does on one side, copy it on the other side. If they remove a penny at position \\(k\\) (\\(1 \\leq k \\leq 4\\)), you remove the corresponding penny at position \\(11 - k\\). If they remove two adjacent pennies from one side, you remove the matching pair from the other side. Since the halves are identical, any legal move on one side has a legal mirror on the other. You always make the last move because you maintain the symmetry.'
                }
            ]
        }
    ]
});
})();
