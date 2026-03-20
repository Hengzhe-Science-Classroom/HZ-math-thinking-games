// === Chapter 8: Strategy Games ===
(function () {
    window.CHAPTERS = window.CHAPTERS || [];

    window.CHAPTERS.push({
        id: 'ch08-strategy',
        number: 8.5,
        title: 'Strategy Games',
        subtitle: 'Games where math gives you the winning strategy',

        sections: [
            // ============================================================
            // Section 0: Motivation
            // ============================================================
            {
                id: 'sec-motivation',
                title: 'Why Strategy Games?',
                content: `
<h2>Games as Mathematical Laboratories</h2>

<p>A strategy game strips away luck, hidden information, and physical skill. What remains is pure logic: two players, complete information, alternating turns, and a definite outcome. These are called <strong>combinatorial games</strong>, and they are perfect laboratories for mathematical thinking.</p>

<div class="env-block intuition">
<strong>What makes a game mathematical?</strong><br>
A game is "solved" when we can determine, from any position, which player wins with perfect play and exactly what moves achieve it. This chapter explores several games where the winning strategy is a beautiful piece of mathematics.
</div>

<p>We will study five different games, each illustrating a different strategic principle:</p>

<ul>
<li><strong>Nim</strong>: Binary XOR determines who wins.</li>
<li><strong>The 21 Game</strong>: Modular arithmetic reveals the pattern.</li>
<li><strong>Chomp</strong>: We can <em>prove</em> the first player wins, yet nobody knows the strategy.</li>
<li><strong>Dots and Boxes</strong>: Chain counting decides the endgame.</li>
<li><strong>Invariants</strong>: Quantities that never change prove that some tasks are impossible.</li>
</ul>

<p>Along the way, you will develop a powerful toolkit: backward induction, symmetry arguments, parity, and invariants. These are not just game techniques; they appear throughout mathematics, computer science, and economics.</p>

<div class="env-block remark">
<strong>A word on "solving" games</strong><br>
Some games (like Nim) have elegant closed-form strategies. Others (like Chomp) have existence proofs but no known strategy. Still others (like chess) are theoretically solvable but computationally intractable. This range of difficulty is itself a deep mathematical phenomenon.
</div>
`,
                visualizations: [],
                exercises: []
            },

            // ============================================================
            // Section 1: The Game of Nim
            // ============================================================
            {
                id: 'sec-nim',
                title: 'The Game of Nim',
                content: `
<h2>The Game of Nim</h2>

<p>Nim is the grandfather of combinatorial game theory. Its rules are simple: several piles of stones sit on a table. Two players alternate turns. On your turn, pick one pile and remove any number of stones from it (at least one). The player who takes the last stone wins.</p>

<div class="env-block definition">
<strong>Nim-sum (XOR)</strong><br>
Write each pile size in binary. XOR (exclusive or) the pile sizes bit by bit: the result is 1 in each position where an odd number of piles have a 1. The <strong>Nim-sum</strong> of piles \\((a_1, a_2, \\ldots, a_k)\\) is \\(a_1 \\oplus a_2 \\oplus \\cdots \\oplus a_k\\).
</div>

<div class="env-block theorem">
<strong>Bouton's Theorem (1901)</strong><br>
A Nim position is a losing position (P-position) for the player to move if and only if the Nim-sum of all pile sizes is 0. Otherwise, it is a winning position (N-position), and the winning move reduces some pile so that the new Nim-sum becomes 0.
</div>

<p><strong>Example.</strong> Piles of (3, 5, 6). In binary: 011, 101, 110. XOR: 000. Nim-sum = 0, so this is a P-position. Whoever moves from here will lose against optimal play.</p>

<p><strong>Example.</strong> Piles of (3, 4, 5). In binary: 011, 100, 101. XOR: 010 = 2. This is an N-position. The winning move: XOR pile 2 (100) with the Nim-sum (010) to get 110 = 6. But wait, 6 > 4, so that does not work. Try pile 3: 101 XOR 010 = 111 = 7 > 5. Try pile 1: 011 XOR 010 = 001 = 1 < 3. So take 2 from pile 1, leaving (1, 4, 5). Check: 001 XOR 100 XOR 101 = 000. Done!</p>

<div class="viz-placeholder" data-viz="viz-nim-game"></div>

<h3>Why does XOR work?</h3>

<p>The proof has three parts:</p>
<ol>
<li>The terminal position (all piles empty) has Nim-sum 0, and it is a P-position.</li>
<li>From any position with Nim-sum 0, <em>every</em> move produces a position with Nim-sum \\(\\neq 0\\).</li>
<li>From any position with Nim-sum \\(\\neq 0\\), there <em>exists</em> a move to a position with Nim-sum 0.</li>
</ol>

<p>These three facts, combined with the definitions of P- and N-positions, give us the complete characterization.</p>
`,
                visualizations: [
                    {
                        id: 'viz-nim-game',
                        title: 'Play Nim vs Computer',
                        description: 'Play multi-pile Nim against a computer that uses the optimal XOR strategy. Click stones to select them, then click Remove.',
                        setup: function (container, controls) {
                            var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                            var w = viz.width, h = viz.height;
                            var ctx = viz.ctx;

                            var piles = [3, 5, 7];
                            var turn = 0;
                            var selectedPile = -1;
                            var selectedCount = 0;
                            var message = 'Your turn! Click stones to select, then "Remove".';
                            var gameOver = false;
                            var wins = { human: 0, computer: 0 };
                            var stoneR = 13;

                            function nimSum(arr) {
                                var x = 0;
                                for (var i = 0; i < arr.length; i++) x ^= arr[i];
                                return x;
                            }
                            function totalStones() {
                                var s = 0;
                                for (var i = 0; i < piles.length; i++) s += piles[i];
                                return s;
                            }
                            function getStonePos(pi, si) {
                                var pw = w / (piles.length + 1);
                                var cx = pw * (pi + 1);
                                var cols = Math.min(4, Math.max(1, Math.ceil(Math.sqrt(piles[pi] || 1))));
                                var col = si % cols;
                                var row = Math.floor(si / cols);
                                return {
                                    x: cx - (cols - 1) * stoneR * 1.3 + col * stoneR * 2.6,
                                    y: h - 100 - row * stoneR * 2.6
                                };
                            }

                            function resetGame() {
                                var configs = [[3, 5, 7], [2, 4, 6], [1, 3, 5, 7], [3, 4, 5], [2, 7, 8]];
                                piles = configs[Math.floor(Math.random() * configs.length)].slice();
                                turn = 0; selectedPile = -1; selectedCount = 0;
                                gameOver = false;
                                message = 'Piles: (' + piles.join(', ') + '). Your turn!';
                            }

                            VizEngine.createButton(controls, 'Remove', function () {
                                if (gameOver || turn !== 0 || selectedPile < 0 || selectedCount <= 0) return;
                                piles[selectedPile] -= selectedCount;
                                if (piles[selectedPile] < 0) piles[selectedPile] = 0;
                                selectedPile = -1; selectedCount = 0;
                                if (totalStones() === 0) {
                                    message = 'You took the last stone! You win!';
                                    gameOver = true; wins.human++; return;
                                }
                                turn = 1; message = 'Computer thinking...';
                                setTimeout(computerMove, 500);
                            });
                            VizEngine.createButton(controls, 'New Game', resetGame);

                            function computerMove() {
                                if (gameOver) return;
                                var ns = nimSum(piles);
                                var moved = false;
                                if (ns !== 0) {
                                    for (var i = 0; i < piles.length; i++) {
                                        var target = piles[i] ^ ns;
                                        if (target < piles[i]) {
                                            var took = piles[i] - target;
                                            piles[i] = target;
                                            message = 'Computer took ' + took + ' from pile ' + (i + 1) + '. Your turn!';
                                            moved = true; break;
                                        }
                                    }
                                }
                                if (!moved) {
                                    for (var i = 0; i < piles.length; i++) {
                                        if (piles[i] > 0) { piles[i]--; message = 'Computer took 1 from pile ' + (i + 1) + '. Your turn!'; break; }
                                    }
                                }
                                if (totalStones() === 0) {
                                    message = 'Computer took the last stone. Computer wins!';
                                    gameOver = true; wins.computer++;
                                } else { turn = 0; }
                            }

                            viz.canvas.addEventListener('click', function (e) {
                                if (gameOver || turn !== 0) return;
                                var rect = viz.canvas.getBoundingClientRect();
                                var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                                for (var p = 0; p < piles.length; p++) {
                                    for (var s = piles[p] - 1; s >= 0; s--) {
                                        var pos = getStonePos(p, s);
                                        if (Math.sqrt((mx - pos.x) ** 2 + (my - pos.y) ** 2) < stoneR + 5) {
                                            selectedPile = p;
                                            selectedCount = piles[p] - s;
                                            return;
                                        }
                                    }
                                }
                            });

                            var pileColors = ['#58a6ff', '#3fb9a0', '#f0883e', '#bc8cff'];
                            viz.animate(function () {
                                viz.clear();
                                ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Nim: You vs Computer', w / 2, 22);
                                ctx.fillStyle = '#8b949e'; ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('You: ' + wins.human + '  Computer: ' + wins.computer, w / 2, 40);

                                var ns = nimSum(piles);
                                ctx.fillStyle = ns === 0 ? '#3fb950' : '#f0883e';
                                ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'right';
                                ctx.fillText('Nim-sum: ' + ns + (ns === 0 ? ' (P)' : ' (N)'), w - 15, 22);

                                // Binary display
                                var binStrs = [];
                                for (var i = 0; i < piles.length; i++) {
                                    var b = piles[i].toString(2);
                                    while (b.length < 4) b = '0' + b;
                                    binStrs.push(b);
                                }
                                ctx.fillStyle = '#4a4a7a'; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.fillText('Binary: ' + binStrs.join(' \u2295 '), w - 15, 38);

                                var msgColor = gameOver ? (message.indexOf('You win') >= 0 ? '#3fb950' : '#f85149') : '#58a6ff';
                                ctx.fillStyle = msgColor; ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(message, w / 2, 62);

                                for (var p = 0; p < piles.length; p++) {
                                    var pw2 = w / (piles.length + 1);
                                    var cx = pw2 * (p + 1);
                                    ctx.fillStyle = '#8b949e'; ctx.font = '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Pile ' + (p + 1) + ': ' + piles[p], cx, h - 60);

                                    for (var s = 0; s < piles[p]; s++) {
                                        var pos = getStonePos(p, s);
                                        var isSel = (selectedPile === p && s >= piles[p] - selectedCount);
                                        ctx.fillStyle = isSel ? '#f85149' : pileColors[p % pileColors.length];
                                        ctx.beginPath(); ctx.arc(pos.x, pos.y, stoneR, 0, Math.PI * 2); ctx.fill();
                                        ctx.fillStyle = 'rgba(255,255,255,0.2)';
                                        ctx.beginPath(); ctx.arc(pos.x - 3, pos.y - 3, stoneR * 0.3, 0, Math.PI * 2); ctx.fill();
                                    }
                                }

                                if (selectedPile >= 0 && selectedCount > 0 && !gameOver) {
                                    ctx.fillStyle = '#f0883e'; ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Taking ' + selectedCount + ' from pile ' + (selectedPile + 1), w / 2, h - 20);
                                }
                            });
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Piles are (7, 11, 13). Compute the Nim-sum. Is this a P- or N-position? If N, find the winning first move.',
                        hint: 'Convert to binary: 7 = 0111, 11 = 1011, 13 = 1101. XOR them bit by bit.',
                        solution: '0111 XOR 1011 = 1100. Then 1100 XOR 1101 = 0001. Nim-sum = 1 (N-position). To win: XOR 13 (1101) with 1 (0001) = 1100 = 12. Take 1 from the pile of 13, leaving (7, 11, 12). Check: 0111 XOR 1011 XOR 1100 = 0000.'
                    },
                    {
                        question: 'In Nim with piles (1, 2, 3), who wins? What about (1, 2, 3, 4)?',
                        hint: 'Compute the XOR for each. Remember 1 XOR 2 XOR 3 = 0.',
                        solution: '(1, 2, 3): 01 XOR 10 XOR 11 = 00. Nim-sum = 0, so this is a P-position; the second player wins. (1, 2, 3, 4): 001 XOR 010 XOR 011 XOR 100 = 100 = 4. Nim-sum = 4, N-position; the first player wins by taking all 4 from the last pile, leaving (1, 2, 3).'
                    }
                ]
            },

            // ============================================================
            // Section 2: The 21 Game
            // ============================================================
            {
                id: 'sec-21',
                title: 'The 21 Game',
                content: `
<h2>The 21 Game</h2>

<p>Here is a game you can play at any dinner table. Two players count upward from 1 to 21. On your turn, you say the next one, two, or three numbers. The player who is forced to say 21 loses.</p>

<div class="env-block definition">
<strong>The 21 Game</strong><br>
Players alternate turns. On each turn, a player advances the count by 1, 2, or 3. The player who says 21 loses.
</div>

<p>Think about this from the end. If the count is at 20, the next player must say 21 and loses. So 20 is a <strong>winning position</strong>: if you can leave your opponent at 20, you win.</p>

<p>How do you get to 20? You need to reach 16 first (because from 16, your opponent says 17, 18, or 19, and you respond to reach 20). And before that, 12, then 8, then 4.</p>

<div class="env-block theorem">
<strong>The 21 Game Strategy</strong><br>
The losing positions are the multiples of 4: 0, 4, 8, 12, 16, 20. The first player wins by saying "1, 2, 3" (reaching 3 is not a multiple of 4; actually, the first player should say just "1" to reach... wait, let us reconsider).
</div>

<p>Actually, since the game starts at 0 (no number said yet), and 0 is a multiple of 4 (a losing position for the player to move), the <em>second</em> player wins! Whatever the first player says (advancing to 1, 2, or 3), the second player responds to reach 4. Then 8, 12, 16, 20. The first player is then stuck saying 21.</p>

<div class="env-block intuition">
<strong>The modular arithmetic pattern</strong><br>
The key number is \\(1 + 3 = 4\\) (the maximum advance plus one). Losing positions are multiples of 4 because whatever you add (1, 2, or 3), your opponent can complement it to 4.
</div>

<p>What if we change the rules? If you can say 1, 2, ..., or \\(k\\) numbers, and the target is \\(n\\), then the losing positions are multiples of \\(k + 1\\), and the first player wins if and only if \\(n\\) is not a multiple of \\(k + 1\\).</p>

<div class="viz-placeholder" data-viz="viz-21-game"></div>
`,
                visualizations: [
                    {
                        id: 'viz-21-game',
                        title: 'The 21 Game',
                        description: 'Play the 21 Game against a computer opponent. The player who says 21 loses. Can you discover the winning strategy?',
                        setup: function (container, controls) {
                            var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                            var w = viz.width, h = viz.height;
                            var ctx = viz.ctx;

                            var target = 21;
                            var maxStep = 3;
                            var current = 0;
                            var turn = 0; // 0 = human, 1 = computer
                            var message = 'You go first. Choose how many numbers to say.';
                            var gameOver = false;
                            var wins = { human: 0, computer: 0 };
                            var lastMove = [];
                            var humanFirst = true;

                            function resetGame() {
                                current = 0; turn = humanFirst ? 0 : 1;
                                gameOver = false; lastMove = [];
                                message = turn === 0 ? 'Your turn. Choose how many to say.' : 'Computer goes first...';
                                if (turn === 1) setTimeout(computerMove, 500);
                            }

                            function computerMove() {
                                if (gameOver) return;
                                // Optimal: reach a multiple of (maxStep+1) from target
                                var mod = (target - current) % (maxStep + 1);
                                var step = mod === 0 ? 1 : mod; // losing: take 1
                                lastMove = [];
                                for (var i = 0; i < step; i++) {
                                    current++;
                                    lastMove.push(current);
                                }
                                if (current >= target) {
                                    message = 'Computer said ' + target + '! Computer loses! You win!';
                                    gameOver = true; wins.human++;
                                } else {
                                    message = 'Computer said ' + lastMove.join(', ') + '. Your turn!';
                                    turn = 0;
                                }
                            }

                            for (var s = 1; s <= 3; s++) {
                                (function (step) {
                                    VizEngine.createButton(controls, 'Say ' + step, function () {
                                        if (gameOver || turn !== 0) return;
                                        if (current + step > target) return;
                                        lastMove = [];
                                        for (var i = 0; i < step; i++) {
                                            current++;
                                            lastMove.push(current);
                                        }
                                        if (current >= target) {
                                            message = 'You said ' + target + '! You lose!';
                                            gameOver = true; wins.computer++;
                                            return;
                                        }
                                        turn = 1; message = 'You said ' + lastMove.join(', ') + '. Computer thinking...';
                                        setTimeout(computerMove, 500);
                                    });
                                })(s);
                            }

                            VizEngine.createButton(controls, 'New Game', function () {
                                humanFirst = !humanFirst;
                                resetGame();
                            });

                            VizEngine.createSlider(controls, 'Target', 10, 30, target, 1, function (v) {
                                target = Math.round(v);
                                resetGame();
                            });

                            viz.animate(function () {
                                viz.clear();
                                ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('The ' + target + ' Game (say 21 = lose)', w / 2, 22);

                                ctx.fillStyle = '#8b949e'; ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('You: ' + wins.human + '  Computer: ' + wins.computer, w / 2, 40);

                                var msgColor = gameOver ? (message.indexOf('You win') >= 0 ? '#3fb950' : '#f85149') : '#58a6ff';
                                ctx.fillStyle = msgColor; ctx.font = '13px -apple-system,sans-serif';
                                ctx.fillText(message, w / 2, 60);

                                // Draw number line
                                var margin = 40;
                                var lineY = h / 2 + 20;
                                var lineW = w - 2 * margin;
                                ctx.strokeStyle = '#4a4a7a'; ctx.lineWidth = 2;
                                ctx.beginPath(); ctx.moveTo(margin, lineY); ctx.lineTo(margin + lineW, lineY); ctx.stroke();

                                // Draw ticks and numbers
                                for (var n = 0; n <= target; n++) {
                                    var xp = margin + (n / target) * lineW;
                                    var isMultiple = n % (maxStep + 1) === target % (maxStep + 1);
                                    var isCurrent = n === current;
                                    var isLast = lastMove.indexOf(n) >= 0;

                                    // Tick
                                    ctx.strokeStyle = isMultiple ? '#f0883e' : '#4a4a7a';
                                    ctx.lineWidth = isMultiple ? 2 : 1;
                                    ctx.beginPath(); ctx.moveTo(xp, lineY - 8); ctx.lineTo(xp, lineY + 8); ctx.stroke();

                                    // Number label
                                    ctx.fillStyle = isCurrent ? '#f0f6fc' : isLast ? '#f85149' : isMultiple ? '#f0883e' : '#8b949e';
                                    ctx.font = (isCurrent ? 'bold ' : '') + '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                    ctx.fillText(n, xp, lineY + 12);

                                    // Highlight current
                                    if (isCurrent && n > 0) {
                                        ctx.fillStyle = '#58a6ff';
                                        ctx.beginPath(); ctx.arc(xp, lineY - 20, 8, 0, Math.PI * 2); ctx.fill();
                                        ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 10px -apple-system,sans-serif';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText(n, xp, lineY - 20);
                                    }
                                }

                                // Legend
                                ctx.fillStyle = '#f0883e'; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'left'; ctx.textBaseline = 'top';
                                ctx.fillText('Orange ticks = losing positions (multiples of ' + (maxStep + 1) + ' from ' + target + ')', margin, h - 40);

                                // Strategy hint
                                if (!gameOver) {
                                    var rem = (target - current) % (maxStep + 1);
                                    ctx.fillStyle = '#4a4a7a'; ctx.font = '11px -apple-system,sans-serif';
                                    ctx.textAlign = 'right';
                                    ctx.fillText('Distance to ' + target + ': ' + (target - current) + '  (mod ' + (maxStep + 1) + ' = ' + rem + ')', w - margin, h - 40);
                                }
                            });
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'In the 21 Game (say 1, 2, or 3; saying 21 loses), who wins with optimal play?',
                        hint: 'The losing positions are where \\((21 - n)\\) is a multiple of 4, i.e., n = 1, 5, 9, 13, 17, 21. Actually, think about it from 0.',
                        solution: 'The position where it is your turn and the count is 0 is a losing position for the person to move IF 21 mod 4 = 1, which means 0 is NOT a losing position. Actually: losing positions are n where (target - n) mod (maxStep+1) = 0, i.e., n = 21, 17, 13, 9, 5, 1. Since the game starts at 0, the first player says "1" (reaching 1, a losing position for the opponent? No: reaching 1 means opponent is at count 1). Rethinking: a position n is a P-position (losing to move) if n = 21, and if every move from n leads to an N-position. n = 21: terminal, you lost. n = 20: must go to 21, so P (lose). Wait, whoever says 21 loses, so n = 20 means you say 21 and lose. n = 17,18,19: can reach 20. So 20 is a safe position to leave your opponent. The P-positions (bad to be at) are 21, 17, 13, 9, 5, 1. Since the first player starts at 0 and is not at a P-position, the first player can move to 1 (saying "1"), putting the opponent at P-position 1. The first player wins.'
                    }
                ]
            },

            // ============================================================
            // Section 3: Chomp
            // ============================================================
            {
                id: 'sec-chomp',
                title: 'Chomp',
                content: `
<h2>Chomp</h2>

<p>Imagine a rectangular chocolate bar divided into squares, arranged in an \\(m \\times n\\) grid. The bottom-left square is <em>poisoned</em>. Players alternate turns. On your turn, pick any remaining square and eat it along with all squares above and to the right of it. Whoever eats the poisoned square loses.</p>

<div class="env-block definition">
<strong>Chomp</strong><br>
An \\(m \\times n\\) chocolate bar. Players alternate picking a square and removing it along with everything above and to the right. The player forced to take the bottom-left (poisoned) square loses.
</div>

<p>Chomp has a remarkable property:</p>

<div class="env-block theorem">
<strong>First Player Wins (for any bar bigger than 1x1)</strong><br>
In any Chomp game on an \\(m \\times n\\) grid with \\(mn > 1\\), the first player has a winning strategy.
</div>

<p>The proof is a beautiful <strong>strategy-stealing argument</strong>:</p>

<ol>
<li>Suppose the second player has a winning strategy.</li>
<li>The first player eats just the top-right corner square.</li>
<li>The second player, using their "winning strategy," makes some move \\(M\\).</li>
<li>But the first player could have made move \\(M\\) as their first move instead! (Any move the second player can make from a position with the corner removed is also a valid first move.)</li>
<li>This contradicts the assumption that the second player has a winning strategy.</li>
</ol>

<p>Therefore, the first player must have a winning strategy. But here is the twist: <strong>nobody knows what the strategy is</strong> for general \\(m \\times n\\) boards! The proof tells us it exists without constructing it. This is a classic non-constructive existence proof.</p>

<div class="env-block remark">
<strong>Known results</strong><br>
For \\(n \\times 2\\) boards, the winning first move is to eat the square at position (2, 2), leaving an L-shape. For square \\(n \\times n\\) boards, the winning first move is to eat (2, 2). For general rectangles, the strategy remains open.
</div>

<div class="viz-placeholder" data-viz="viz-chomp"></div>
`,
                visualizations: [
                    {
                        id: 'viz-chomp',
                        title: 'Play Chomp',
                        description: 'Play Chomp against a computer on a grid. Click a square to eat it and everything above/right. Avoid the poisoned bottom-left square!',
                        setup: function (container, controls) {
                            var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                            var w = viz.width, h = viz.height;
                            var ctx = viz.ctx;

                            var rows = 4, cols = 6;
                            var grid = [];
                            var turn = 0;
                            var gameOver = false;
                            var message = 'Your turn! Click a square to chomp.';
                            var wins = { human: 0, computer: 0 };

                            function initGrid() {
                                grid = [];
                                for (var r = 0; r < rows; r++) {
                                    grid[r] = [];
                                    for (var c = 0; c < cols; c++) grid[r][c] = 1;
                                }
                                turn = 0; gameOver = false;
                                message = 'Your turn! Click a square to chomp.';
                            }
                            initGrid();

                            VizEngine.createButton(controls, 'New Game', initGrid);
                            VizEngine.createSlider(controls, 'Rows', 2, 7, rows, 1, function (v) {
                                rows = Math.round(v); initGrid();
                            });
                            VizEngine.createSlider(controls, 'Cols', 2, 8, cols, 1, function (v) {
                                cols = Math.round(v); initGrid();
                            });

                            var cellSize = 0;
                            var gridX0 = 0, gridY0 = 0;

                            function chomp(r, c) {
                                for (var rr = 0; rr <= r; rr++) {
                                    for (var cc = c; cc < cols; cc++) {
                                        grid[rr][cc] = 0;
                                    }
                                }
                            }

                            function isOnlyPoison() {
                                for (var r = 0; r < rows; r++)
                                    for (var c = 0; c < cols; c++)
                                        if (grid[r][c] && !(r === rows - 1 && c === 0)) return false;
                                return grid[rows - 1][0] === 1;
                            }

                            function computerMove() {
                                if (gameOver) return;
                                // Simple heuristic: try all moves, pick one that leaves opponent in bad shape
                                var bestR = -1, bestC = -1, bestScore = -Infinity;
                                for (var r = 0; r < rows; r++) {
                                    for (var c = 0; c < cols; c++) {
                                        if (!grid[r][c]) continue;
                                        if (r === rows - 1 && c === 0) continue;
                                        // Try this move
                                        var saved = [];
                                        for (var rr = 0; rr <= r; rr++)
                                            for (var cc = c; cc < cols; cc++)
                                                saved.push({ r: rr, c: cc, v: grid[rr][cc] });
                                        chomp(r, c);
                                        // Score: fewer squares left for opponent is better (greedy)
                                        var remaining = 0;
                                        for (var rr = 0; rr < rows; rr++)
                                            for (var cc = 0; cc < cols; cc++)
                                                if (grid[rr][cc]) remaining++;
                                        // Try to leave symmetric L-shapes if possible
                                        var score = -remaining;
                                        if (isOnlyPoison()) score = 1000;
                                        // Restore
                                        for (var k = 0; k < saved.length; k++)
                                            grid[saved[k].r][saved[k].c] = saved[k].v;
                                        if (score > bestScore) {
                                            bestScore = score; bestR = r; bestC = c;
                                        }
                                    }
                                }
                                if (bestR >= 0) {
                                    chomp(bestR, bestC);
                                    if (grid[rows - 1][0] === 0) {
                                        message = 'Computer ate the poison! You win!';
                                        gameOver = true; wins.human++;
                                    } else if (isOnlyPoison()) {
                                        message = 'Only poison left. You must eat it. Computer wins!';
                                        gameOver = true; wins.computer++;
                                    } else {
                                        message = 'Computer chomped (' + (rows - bestR) + ',' + (bestC + 1) + '). Your turn!';
                                        turn = 0;
                                    }
                                }
                            }

                            viz.canvas.addEventListener('click', function (e) {
                                if (gameOver || turn !== 0) return;
                                var rect = viz.canvas.getBoundingClientRect();
                                var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                                // Determine clicked cell
                                var c = Math.floor((mx - gridX0) / cellSize);
                                var r = Math.floor((my - gridY0) / cellSize);
                                // Grid is drawn top=row0, so convert: visual row r maps to grid row r
                                if (r < 0 || r >= rows || c < 0 || c >= cols) return;
                                if (!grid[r][c]) return;
                                if (r === rows - 1 && c === 0) {
                                    // Check if it is the only square
                                    var cnt = 0;
                                    for (var rr = 0; rr < rows; rr++)
                                        for (var cc = 0; cc < cols; cc++) cnt += grid[rr][cc];
                                    if (cnt === 1) {
                                        grid[rows - 1][0] = 0;
                                        message = 'You ate the poison! You lose!';
                                        gameOver = true; wins.computer++;
                                        return;
                                    }
                                    message = 'Cannot eat only the poison unless forced!';
                                    return;
                                }
                                chomp(r, c);
                                if (isOnlyPoison()) {
                                    message = 'Only poison left. Computer must eat it. You win!';
                                    gameOver = true; wins.human++;
                                    return;
                                }
                                turn = 1; message = 'Computer thinking...';
                                setTimeout(computerMove, 400);
                            });

                            viz.animate(function () {
                                viz.clear();
                                ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Chomp: ' + rows + ' x ' + cols, w / 2, 22);
                                ctx.fillStyle = '#8b949e'; ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('You: ' + wins.human + '  Computer: ' + wins.computer, w / 2, 40);

                                var msgColor = gameOver ? (message.indexOf('You win') >= 0 ? '#3fb950' : '#f85149') : '#58a6ff';
                                ctx.fillStyle = msgColor; ctx.font = '13px -apple-system,sans-serif';
                                ctx.fillText(message, w / 2, 58);

                                // Draw grid
                                cellSize = Math.min((w - 80) / cols, (h - 120) / rows, 50);
                                gridX0 = (w - cols * cellSize) / 2;
                                gridY0 = 75;

                                for (var r = 0; r < rows; r++) {
                                    for (var c = 0; c < cols; c++) {
                                        var x0 = gridX0 + c * cellSize;
                                        var y0 = gridY0 + r * cellSize;
                                        if (grid[r][c]) {
                                            var isPoison = (r === rows - 1 && c === 0);
                                            ctx.fillStyle = isPoison ? '#f85149' : '#8b6914';
                                            ctx.fillRect(x0 + 1, y0 + 1, cellSize - 2, cellSize - 2);
                                            if (isPoison) {
                                                ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold ' + Math.round(cellSize * 0.4) + 'px -apple-system,sans-serif';
                                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                                ctx.fillText('X', x0 + cellSize / 2, y0 + cellSize / 2);
                                            } else {
                                                // Chocolate texture
                                                ctx.fillStyle = 'rgba(255,255,255,0.08)';
                                                ctx.fillRect(x0 + 3, y0 + 3, cellSize / 3, cellSize / 3);
                                            }
                                        } else {
                                            ctx.fillStyle = '#1a1a40';
                                            ctx.fillRect(x0 + 1, y0 + 1, cellSize - 2, cellSize - 2);
                                        }
                                        ctx.strokeStyle = '#30363d'; ctx.lineWidth = 1;
                                        ctx.strokeRect(x0, y0, cellSize, cellSize);
                                    }
                                }

                                ctx.fillStyle = '#4a4a7a'; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'top';
                                ctx.fillText('Red X = poison. Click any brown square to chomp it + everything above-right.', w / 2, gridY0 + rows * cellSize + 10);
                            });
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Explain the strategy-stealing argument for Chomp in your own words. Why is it non-constructive?',
                        hint: 'The argument shows the second player cannot have a winning strategy, but does not tell you what the first player should actually do.',
                        solution: 'Assume for contradiction that the second player has a winning strategy S. The first player eats only the top-right corner. The second player responds with some move M using strategy S. But M is a valid first move (since eating the top-right corner only removes one square, and M removes at least one square that includes the top-right region). So the first player could have played M directly. This contradicts S being a winning response. Therefore, the second player cannot have a winning strategy, so the first player must. It is non-constructive because we never identify the actual winning first move.'
                    }
                ]
            },

            // ============================================================
            // Section 4: Dots and Boxes
            // ============================================================
            {
                id: 'sec-dots-boxes',
                title: 'Dots and Boxes',
                content: `
<h2>Dots and Boxes</h2>

<p>Dots and Boxes is a pencil-and-paper game played on a rectangular grid of dots. Players take turns drawing a horizontal or vertical line between two adjacent dots. When a player completes the fourth side of a 1x1 box, they claim that box (and get another turn). The player with the most boxes at the end wins.</p>

<div class="env-block definition">
<strong>Dots and Boxes</strong><br>
On an \\(m \\times n\\) grid of dots, players alternate drawing edges. Completing a box earns a point and an extra turn. Most boxes wins.
</div>

<p>This game looks simple, but has deep strategic structure. The key insight is the <strong>chain rule</strong>.</p>

<h3>Chains and the Double-Cross Strategy</h3>

<p>In the endgame, the board breaks into <strong>chains</strong>: sequences of boxes where completing one forces you to give the next. A chain of length \\(k\\) gives the opponent \\(k - 2\\) boxes (they sacrifice 2 to maintain control). The "double-cross" strategy means deliberately not completing the last two boxes of a chain, forcing your opponent to open the next chain.</p>

<div class="env-block theorem">
<strong>Chain Rule (informal)</strong><br>
The player who controls the parity of long chains (length 3+) in the endgame wins. Specifically, if the number of long chains is odd, the player who moves first in the endgame phase loses control; if even, they maintain it.
</div>

<p>For small boards, the game is completely solved. On a 3x3 grid (4x4 dots), the second player wins with optimal play. On a 4x4 grid (5x5 dots), the first player wins.</p>

<div class="viz-placeholder" data-viz="viz-dots-boxes"></div>
`,
                visualizations: [
                    {
                        id: 'viz-dots-boxes',
                        title: 'Dots and Boxes',
                        description: 'Play Dots and Boxes against a computer. Click between two adjacent dots to draw a line.',
                        setup: function (container, controls) {
                            var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                            var w = viz.width, h = viz.height;
                            var ctx = viz.ctx;

                            var gRows = 3, gCols = 3;
                            // Edges: horizontal[r][c] = row r, between col c and c+1
                            var hEdges, vEdges, boxes;
                            var turn = 0; // 0=human, 1=computer
                            var scores = [0, 0];
                            var gameOver = false;
                            var message = 'Your turn! Click between two dots to draw a line.';
                            var dotSpacing = 0, dotX0 = 0, dotY0 = 0;
                            var playerColors = ['#58a6ff', '#f0883e'];

                            function initGame() {
                                hEdges = [];
                                vEdges = [];
                                boxes = [];
                                for (var r = 0; r <= gRows; r++) {
                                    hEdges[r] = [];
                                    for (var c = 0; c < gCols; c++) hEdges[r][c] = -1;
                                }
                                for (var r = 0; r < gRows; r++) {
                                    vEdges[r] = [];
                                    boxes[r] = [];
                                    for (var c = 0; c <= gCols; c++) vEdges[r][c] = -1;
                                    for (var c = 0; c < gCols; c++) boxes[r][c] = -1;
                                }
                                turn = 0; scores = [0, 0]; gameOver = false;
                                message = 'Your turn! Click between dots.';
                            }
                            initGame();

                            VizEngine.createButton(controls, 'New Game', initGame);
                            VizEngine.createSlider(controls, 'Grid', 2, 5, gRows, 1, function (v) {
                                gRows = Math.round(v); gCols = gRows; initGame();
                            });

                            function countEdges(r, c) {
                                var cnt = 0;
                                if (hEdges[r] && hEdges[r][c] >= 0) cnt++;
                                if (hEdges[r + 1] && hEdges[r + 1][c] >= 0) cnt++;
                                if (vEdges[r] && vEdges[r][c] >= 0) cnt++;
                                if (vEdges[r] && vEdges[r][c + 1] >= 0) cnt++;
                                return cnt;
                            }

                            function tryComplete(player) {
                                var completed = 0;
                                for (var r = 0; r < gRows; r++) {
                                    for (var c = 0; c < gCols; c++) {
                                        if (boxes[r][c] < 0 && countEdges(r, c) === 4) {
                                            boxes[r][c] = player;
                                            scores[player]++;
                                            completed++;
                                        }
                                    }
                                }
                                return completed;
                            }

                            function allEdgesDone() {
                                for (var r = 0; r <= gRows; r++)
                                    for (var c = 0; c < gCols; c++)
                                        if (hEdges[r][c] < 0) return false;
                                for (var r = 0; r < gRows; r++)
                                    for (var c = 0; c <= gCols; c++)
                                        if (vEdges[r][c] < 0) return false;
                                return true;
                            }

                            function makeMove(type, r, c, player) {
                                if (type === 'h') hEdges[r][c] = player;
                                else vEdges[r][c] = player;
                                var completed = tryComplete(player);
                                if (allEdgesDone()) {
                                    gameOver = true;
                                    message = scores[0] > scores[1] ? 'You win! ' + scores[0] + '-' + scores[1] :
                                        scores[1] > scores[0] ? 'Computer wins! ' + scores[1] + '-' + scores[0] :
                                            'Draw! ' + scores[0] + '-' + scores[1];
                                    return;
                                }
                                if (completed > 0) return true; // Extra turn
                                return false;
                            }

                            function computerMove() {
                                if (gameOver) return;
                                // Priority: complete a box, then safe move, then forced move
                                var moves = [];
                                for (var r = 0; r <= gRows; r++)
                                    for (var c = 0; c < gCols; c++)
                                        if (hEdges[r][c] < 0) moves.push({ t: 'h', r: r, c: c });
                                for (var r = 0; r < gRows; r++)
                                    for (var c = 0; c <= gCols; c++)
                                        if (vEdges[r][c] < 0) moves.push({ t: 'v', r: r, c: c });

                                if (moves.length === 0) return;

                                // Try to complete a box
                                for (var i = 0; i < moves.length; i++) {
                                    var m = moves[i];
                                    // Check if this edge completes a box
                                    var adj = getAdjacentBoxes(m.t, m.r, m.c);
                                    for (var j = 0; j < adj.length; j++) {
                                        if (countEdges(adj[j].r, adj[j].c) === 3) {
                                            var extra = makeMove(m.t, m.r, m.c, 1);
                                            message = 'Computer drew a line. ' + (extra ? 'Bonus turn!' : 'Your turn!');
                                            if (extra && !gameOver) setTimeout(computerMove, 300);
                                            else turn = 0;
                                            return;
                                        }
                                    }
                                }

                                // Safe move: don't give opponent a box
                                var safe = [];
                                for (var i = 0; i < moves.length; i++) {
                                    var m = moves[i];
                                    var adj = getAdjacentBoxes(m.t, m.r, m.c);
                                    var dangerous = false;
                                    for (var j = 0; j < adj.length; j++) {
                                        if (countEdges(adj[j].r, adj[j].c) === 2) { dangerous = true; break; }
                                    }
                                    if (!dangerous) safe.push(m);
                                }

                                var pick = safe.length > 0 ? safe[Math.floor(Math.random() * safe.length)] : moves[Math.floor(Math.random() * moves.length)];
                                var extra = makeMove(pick.t, pick.r, pick.c, 1);
                                message = 'Computer drew a line. ' + (extra && !gameOver ? 'Bonus turn!' : 'Your turn!');
                                if (extra && !gameOver) setTimeout(computerMove, 300);
                                else turn = 0;
                            }

                            function getAdjacentBoxes(type, r, c) {
                                var result = [];
                                if (type === 'h') {
                                    if (r > 0 && r <= gRows && c < gCols) result.push({ r: r - 1, c: c });
                                    if (r < gRows && c < gCols) result.push({ r: r, c: c });
                                } else {
                                    if (c > 0 && r < gRows) result.push({ r: r, c: c - 1 });
                                    if (c < gCols && r < gRows) result.push({ r: r, c: c });
                                }
                                return result;
                            }

                            viz.canvas.addEventListener('click', function (e) {
                                if (gameOver || turn !== 0) return;
                                var rect = viz.canvas.getBoundingClientRect();
                                var mx = e.clientX - rect.left, my = e.clientY - rect.top;

                                var bestDist = 20, bestType = null, bestR = -1, bestC = -1;
                                // Check horizontal edges
                                for (var r = 0; r <= gRows; r++) {
                                    for (var c = 0; c < gCols; c++) {
                                        if (hEdges[r][c] >= 0) continue;
                                        var ex = dotX0 + (c + 0.5) * dotSpacing;
                                        var ey = dotY0 + r * dotSpacing;
                                        var d = Math.sqrt((mx - ex) ** 2 + (my - ey) ** 2);
                                        if (d < bestDist) { bestDist = d; bestType = 'h'; bestR = r; bestC = c; }
                                    }
                                }
                                // Check vertical edges
                                for (var r = 0; r < gRows; r++) {
                                    for (var c = 0; c <= gCols; c++) {
                                        if (vEdges[r][c] >= 0) continue;
                                        var ex = dotX0 + c * dotSpacing;
                                        var ey = dotY0 + (r + 0.5) * dotSpacing;
                                        var d = Math.sqrt((mx - ex) ** 2 + (my - ey) ** 2);
                                        if (d < bestDist) { bestDist = d; bestType = 'v'; bestR = r; bestC = c; }
                                    }
                                }

                                if (bestType) {
                                    var extra = makeMove(bestType, bestR, bestC, 0);
                                    if (!gameOver) {
                                        if (extra) {
                                            message = 'You completed a box! Go again!';
                                        } else {
                                            turn = 1; message = 'Computer thinking...';
                                            setTimeout(computerMove, 400);
                                        }
                                    }
                                }
                            });

                            viz.animate(function () {
                                viz.clear();
                                ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Dots and Boxes', w / 2, 22);

                                ctx.fillStyle = playerColors[0]; ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('You: ' + scores[0], 20, 22);
                                ctx.fillStyle = playerColors[1]; ctx.textAlign = 'right';
                                ctx.fillText('Computer: ' + scores[1], w - 20, 22);

                                var msgColor = gameOver ? (scores[0] > scores[1] ? '#3fb950' : '#f85149') : '#58a6ff';
                                ctx.fillStyle = msgColor; ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(message, w / 2, 42);

                                dotSpacing = Math.min((w - 80) / gCols, (h - 100) / gRows, 80);
                                dotX0 = (w - gCols * dotSpacing) / 2;
                                dotY0 = 60;

                                // Draw filled boxes
                                for (var r = 0; r < gRows; r++) {
                                    for (var c = 0; c < gCols; c++) {
                                        if (boxes[r][c] >= 0) {
                                            ctx.fillStyle = playerColors[boxes[r][c]] + '33';
                                            ctx.fillRect(dotX0 + c * dotSpacing + 2, dotY0 + r * dotSpacing + 2, dotSpacing - 4, dotSpacing - 4);
                                            ctx.fillStyle = playerColors[boxes[r][c]];
                                            ctx.font = 'bold ' + Math.round(dotSpacing * 0.3) + 'px -apple-system,sans-serif';
                                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                            ctx.fillText(boxes[r][c] === 0 ? 'Y' : 'C', dotX0 + (c + 0.5) * dotSpacing, dotY0 + (r + 0.5) * dotSpacing);
                                        }
                                    }
                                }

                                // Draw horizontal edges
                                for (var r = 0; r <= gRows; r++) {
                                    for (var c = 0; c < gCols; c++) {
                                        var x1 = dotX0 + c * dotSpacing, x2 = dotX0 + (c + 1) * dotSpacing;
                                        var y = dotY0 + r * dotSpacing;
                                        if (hEdges[r][c] >= 0) {
                                            ctx.strokeStyle = playerColors[hEdges[r][c]]; ctx.lineWidth = 3;
                                        } else {
                                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 1;
                                        }
                                        ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
                                    }
                                }

                                // Draw vertical edges
                                for (var r = 0; r < gRows; r++) {
                                    for (var c = 0; c <= gCols; c++) {
                                        var x = dotX0 + c * dotSpacing;
                                        var y1 = dotY0 + r * dotSpacing, y2 = dotY0 + (r + 1) * dotSpacing;
                                        if (vEdges[r][c] >= 0) {
                                            ctx.strokeStyle = playerColors[vEdges[r][c]]; ctx.lineWidth = 3;
                                        } else {
                                            ctx.strokeStyle = '#1a1a40'; ctx.lineWidth = 1;
                                        }
                                        ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke();
                                    }
                                }

                                // Draw dots
                                for (var r = 0; r <= gRows; r++) {
                                    for (var c = 0; c <= gCols; c++) {
                                        ctx.fillStyle = '#f0f6fc';
                                        ctx.beginPath();
                                        ctx.arc(dotX0 + c * dotSpacing, dotY0 + r * dotSpacing, 4, 0, Math.PI * 2);
                                        ctx.fill();
                                    }
                                }
                            });
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'On a 2x2 grid of boxes (3x3 dots), how many total lines can be drawn? How many boxes are there?',
                        hint: 'Count horizontal lines (3 rows of 2) and vertical lines (2 rows of 3).',
                        solution: 'Horizontal lines: 3 rows x 2 columns = 6. Vertical lines: 2 rows x 3 columns = 6. Total lines: 12. Boxes: 2 x 2 = 4.'
                    }
                ]
            },

            // ============================================================
            // Section 5: Invariants
            // ============================================================
            {
                id: 'sec-invariants',
                title: 'Invariants',
                content: `
<h2>Invariants: Quantities That Never Change</h2>

<p>An <strong>invariant</strong> is a quantity that remains unchanged no matter what moves are made. Invariants are one of the most powerful tools in mathematical reasoning, especially for proving that something is <em>impossible</em>.</p>

<div class="env-block definition">
<strong>Invariant</strong><br>
A property or quantity that is preserved by every legal move in a game or process. If the initial state has the property and the target state does not (or vice versa), then the target is unreachable.
</div>

<h3>The Chocolate Bar Problem</h3>

<p>You have an \\(m \\times n\\) chocolate bar divided into \\(mn\\) squares. You want to break it into individual squares. Each break splits one piece into two along a grid line. How many breaks do you need?</p>

<p>The invariant here is simple but powerful: each break increases the number of pieces by exactly 1. You start with 1 piece and need \\(mn\\) pieces. Therefore, you always need exactly \\(mn - 1\\) breaks, regardless of the order you break the pieces.</p>

<div class="env-block theorem">
<strong>Chocolate Bar Theorem</strong><br>
Breaking an \\(m \\times n\\) chocolate bar into individual squares requires exactly \\(mn - 1\\) breaks, no matter the strategy.
</div>

<h3>Parity Invariants</h3>

<p>Many invariant arguments use <strong>parity</strong> (odd vs. even). Consider a checkerboard with two opposite corners removed. Can you tile the remaining 62 squares with 31 dominoes (each covering exactly 2 adjacent squares)?</p>

<p>Each domino covers one black and one white square. So any tiling uses an equal number of black and white squares. But two opposite corners have the same color! The remaining board has 30 squares of one color and 32 of the other. Tiling is impossible.</p>

<div class="env-block intuition">
<strong>The power of invariants</strong><br>
Without invariants, you would need to check every possible tiling to show impossibility. With the right invariant, a single observation settles the question.
</div>

<div class="viz-placeholder" data-viz="viz-invariant-puzzle"></div>
<div class="viz-placeholder" data-viz="viz-coin-flip-game"></div>
`,
                visualizations: [
                    {
                        id: 'viz-invariant-puzzle',
                        title: 'Chocolate Bar Breaks',
                        description: 'Break a chocolate bar into individual pieces. Notice that the number of breaks is always the same, regardless of your strategy.',
                        setup: function (container, controls) {
                            var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                            var w = viz.width, h = viz.height;
                            var ctx = viz.ctx;

                            var barRows = 3, barCols = 4;
                            var pieces = [];
                            var breakCount = 0;
                            var selectedPiece = -1;
                            var message = 'Click a piece to select, then click where to break it.';

                            function initBar() {
                                pieces = [{ r: 0, c: 0, rows: barRows, cols: barCols }];
                                breakCount = 0; selectedPiece = -1;
                                message = 'Click a multi-square piece to break it. Goal: ' + (barRows * barCols) + ' pieces in ' + (barRows * barCols - 1) + ' breaks.';
                            }
                            initBar();

                            VizEngine.createButton(controls, 'Reset', initBar);
                            VizEngine.createSlider(controls, 'Rows', 2, 6, barRows, 1, function (v) { barRows = Math.round(v); initBar(); });
                            VizEngine.createSlider(controls, 'Cols', 2, 8, barCols, 1, function (v) { barCols = Math.round(v); initBar(); });

                            var cellSz = 0, gx0 = 0, gy0 = 0;

                            viz.canvas.addEventListener('click', function (e) {
                                if (pieces.length >= barRows * barCols) return;
                                var rect = viz.canvas.getBoundingClientRect();
                                var mx = e.clientX - rect.left, my = e.clientY - rect.top;

                                // Find which piece was clicked
                                for (var i = 0; i < pieces.length; i++) {
                                    var p = pieces[i];
                                    var px = gx0 + p.c * cellSz, py = gy0 + p.r * cellSz;
                                    var pw = p.cols * cellSz, ph = p.rows * cellSz;
                                    if (mx >= px && mx <= px + pw && my >= py && my <= py + ph) {
                                        if (p.rows === 1 && p.cols === 1) continue;
                                        if (selectedPiece === i) {
                                            // Break at click position
                                            var localX = (mx - px) / cellSz;
                                            var localY = (my - py) / cellSz;
                                            // Determine break direction
                                            if (p.cols > 1 && p.rows > 1) {
                                                // Break along the axis closer to center
                                                var fracX = localX / p.cols;
                                                var fracY = localY / p.rows;
                                                var distX = Math.min(fracX, 1 - fracX);
                                                var distY = Math.min(fracY, 1 - fracY);
                                                if (distX < distY && p.cols > 1) {
                                                    // Vertical break
                                                    var splitC = Math.max(1, Math.min(p.cols - 1, Math.round(localX)));
                                                    pieces.splice(i, 1,
                                                        { r: p.r, c: p.c, rows: p.rows, cols: splitC },
                                                        { r: p.r, c: p.c + splitC, rows: p.rows, cols: p.cols - splitC }
                                                    );
                                                } else {
                                                    var splitR = Math.max(1, Math.min(p.rows - 1, Math.round(localY)));
                                                    pieces.splice(i, 1,
                                                        { r: p.r, c: p.c, rows: splitR, cols: p.cols },
                                                        { r: p.r + splitR, c: p.c, rows: p.rows - splitR, cols: p.cols }
                                                    );
                                                }
                                            } else if (p.cols > 1) {
                                                var splitC = Math.max(1, Math.min(p.cols - 1, Math.round(localX)));
                                                pieces.splice(i, 1,
                                                    { r: p.r, c: p.c, rows: p.rows, cols: splitC },
                                                    { r: p.r, c: p.c + splitC, rows: p.rows, cols: p.cols - splitC }
                                                );
                                            } else {
                                                var splitR = Math.max(1, Math.min(p.rows - 1, Math.round(localY)));
                                                pieces.splice(i, 1,
                                                    { r: p.r, c: p.c, rows: splitR, cols: p.cols },
                                                    { r: p.r + splitR, c: p.c, rows: p.rows - splitR, cols: p.cols }
                                                );
                                            }
                                            breakCount++;
                                            selectedPiece = -1;
                                            if (pieces.length >= barRows * barCols) {
                                                message = 'Done! ' + breakCount + ' breaks for ' + (barRows * barCols) + ' pieces. Always ' + (barRows * barCols - 1) + '!';
                                            } else {
                                                message = 'Break #' + breakCount + '. Pieces: ' + pieces.length + '/' + (barRows * barCols);
                                            }
                                        } else {
                                            selectedPiece = i;
                                            message = 'Selected a ' + p.rows + 'x' + p.cols + ' piece. Click within it to break.';
                                        }
                                        return;
                                    }
                                }
                            });

                            viz.animate(function () {
                                viz.clear();
                                ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Chocolate Bar: ' + barRows + ' x ' + barCols, w / 2, 22);

                                ctx.fillStyle = '#8b949e'; ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('Breaks: ' + breakCount + '  |  Pieces: ' + pieces.length + '/' + (barRows * barCols) + '  |  Minimum: ' + (barRows * barCols - 1), w / 2, 40);

                                var msgColor = pieces.length >= barRows * barCols ? '#3fb950' : '#58a6ff';
                                ctx.fillStyle = msgColor; ctx.font = '13px -apple-system,sans-serif';
                                ctx.fillText(message, w / 2, 58);

                                cellSz = Math.min((w - 60) / barCols, (h - 110) / barRows, 60);
                                gx0 = (w - barCols * cellSz) / 2;
                                gy0 = 75;

                                // Draw pieces
                                for (var i = 0; i < pieces.length; i++) {
                                    var p = pieces[i];
                                    var px = gx0 + p.c * cellSz, py = gy0 + p.r * cellSz;
                                    var pw2 = p.cols * cellSz, ph2 = p.rows * cellSz;

                                    var isSel = (selectedPiece === i);
                                    var isDone = (p.rows === 1 && p.cols === 1);
                                    ctx.fillStyle = isDone ? '#3fb950' : (isSel ? '#f0883e' : '#8b6914');
                                    ctx.fillRect(px + 2, py + 2, pw2 - 4, ph2 - 4);

                                    // Grid lines within piece
                                    ctx.strokeStyle = isDone ? '#2d8a3e' : '#6b5210';
                                    ctx.lineWidth = 0.5;
                                    for (var rr = 0; rr <= p.rows; rr++) {
                                        ctx.beginPath();
                                        ctx.moveTo(px + 2, py + rr * cellSz);
                                        ctx.lineTo(px + pw2 - 2, py + rr * cellSz);
                                        ctx.stroke();
                                    }
                                    for (var cc = 0; cc <= p.cols; cc++) {
                                        ctx.beginPath();
                                        ctx.moveTo(px + cc * cellSz, py + 2);
                                        ctx.lineTo(px + cc * cellSz, py + ph2 - 2);
                                        ctx.stroke();
                                    }

                                    // Piece border
                                    ctx.strokeStyle = isSel ? '#f0883e' : '#30363d';
                                    ctx.lineWidth = isSel ? 3 : 1.5;
                                    ctx.strokeRect(px + 1, py + 1, pw2 - 2, ph2 - 2);
                                }
                            });
                            return viz;
                        }
                    },
                    {
                        id: 'viz-coin-flip-game',
                        title: 'Coin Parity Puzzle',
                        description: 'A row of coins, some heads, some tails. Each move flips exactly 2 adjacent coins. Can you make them all heads? Parity is the invariant.',
                        setup: function (container, controls) {
                            var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                            var w = viz.width, h = viz.height;
                            var ctx = viz.ctx;

                            var nCoins = 6;
                            var coins = []; // 0=heads, 1=tails
                            var moves = 0;
                            var message = 'Click between two adjacent coins to flip both. Goal: all heads (gold).';
                            var selectedCoin = -1;

                            function initCoins() {
                                coins = [];
                                // Start with random, but ensure even number of tails
                                for (var i = 0; i < nCoins; i++) coins.push(Math.random() < 0.5 ? 1 : 0);
                                var tailCount = coins.reduce(function (s, v) { return s + v; }, 0);
                                if (tailCount % 2 !== 0) coins[0] = 1 - coins[0]; // ensure even tails
                                moves = 0;
                                message = 'Click between two adjacent coins to flip both.';
                            }
                            initCoins();

                            VizEngine.createButton(controls, 'Reset', initCoins);
                            VizEngine.createButton(controls, 'Odd Tails (impossible)', function () {
                                coins = [];
                                for (var i = 0; i < nCoins; i++) coins.push(0);
                                coins[0] = 1; // 1 tail = odd
                                moves = 0;
                                message = 'Odd number of tails. Try to make all heads!';
                            });

                            var coinR = 25;

                            viz.canvas.addEventListener('click', function (e) {
                                var rect = viz.canvas.getBoundingClientRect();
                                var mx = e.clientX - rect.left, my = e.clientY - rect.top;
                                var cy = h / 2 + 10;
                                var spacing = Math.min(70, (w - 80) / nCoins);
                                var x0 = (w - (nCoins - 1) * spacing) / 2;

                                // Check clicks between coins
                                for (var i = 0; i < nCoins - 1; i++) {
                                    var midX = x0 + (i + 0.5) * spacing;
                                    if (Math.abs(mx - midX) < spacing * 0.4 && Math.abs(my - cy) < coinR + 10) {
                                        coins[i] = 1 - coins[i];
                                        coins[i + 1] = 1 - coins[i + 1];
                                        moves++;
                                        var allHeads = coins.every(function (c) { return c === 0; });
                                        if (allHeads) {
                                            message = 'All heads! Solved in ' + moves + ' moves!';
                                        } else {
                                            var tails = coins.reduce(function (s, v) { return s + v; }, 0);
                                            message = 'Move ' + moves + '. Tails: ' + tails + ' (' + (tails % 2 === 0 ? 'even' : 'odd') + ')';
                                        }
                                        return;
                                    }
                                }
                            });

                            viz.animate(function () {
                                viz.clear();
                                ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Coin Parity Puzzle', w / 2, 22);

                                var tailCount = coins.reduce(function (s, v) { return s + v; }, 0);
                                ctx.fillStyle = tailCount % 2 === 0 ? '#3fb950' : '#f85149';
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('Tails: ' + tailCount + ' (' + (tailCount % 2 === 0 ? 'even - solvable!' : 'odd - impossible!') + ')  |  Moves: ' + moves, w / 2, 42);

                                var msgColor = message.indexOf('Solved') >= 0 ? '#3fb950' : '#58a6ff';
                                ctx.fillStyle = msgColor; ctx.font = '13px -apple-system,sans-serif';
                                ctx.fillText(message, w / 2, 60);

                                var spacing = Math.min(70, (w - 80) / nCoins);
                                var x0 = (w - (nCoins - 1) * spacing) / 2;
                                var cy = h / 2 + 10;

                                for (var i = 0; i < nCoins; i++) {
                                    var cx2 = x0 + i * spacing;
                                    // Coin
                                    ctx.fillStyle = coins[i] === 0 ? '#d29922' : '#4a4a7a';
                                    ctx.beginPath(); ctx.arc(cx2, cy, coinR, 0, Math.PI * 2); ctx.fill();
                                    ctx.strokeStyle = coins[i] === 0 ? '#f0883e' : '#8b949e';
                                    ctx.lineWidth = 2;
                                    ctx.beginPath(); ctx.arc(cx2, cy, coinR, 0, Math.PI * 2); ctx.stroke();
                                    // Label
                                    ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(coins[i] === 0 ? 'H' : 'T', cx2, cy);

                                    // Flip zone indicator
                                    if (i < nCoins - 1) {
                                        var midX = x0 + (i + 0.5) * spacing;
                                        ctx.fillStyle = '#58a6ff44';
                                        ctx.fillRect(midX - 8, cy - coinR - 5, 16, 10);
                                        ctx.fillStyle = '#58a6ff'; ctx.font = '10px -apple-system,sans-serif';
                                        ctx.fillText('flip', midX, cy - coinR - 12);
                                    }
                                }

                                // Explanation
                                ctx.fillStyle = '#4a4a7a'; ctx.font = '11px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Each flip changes two coins, so the parity of tails never changes.', w / 2, h - 30);
                                ctx.fillText('If you start with odd tails, you can never reach 0 tails (even).', w / 2, h - 15);
                            });
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'Prove that breaking an \\(m \\times n\\) chocolate bar into individual squares always takes exactly \\(mn - 1\\) breaks.',
                        hint: 'What happens to the number of pieces after each break?',
                        solution: 'Each break increases the total number of pieces by exactly 1 (one piece becomes two). You start with 1 piece and need \\(mn\\) pieces. So you need exactly \\(mn - 1\\) breaks. This is invariant: no clever breaking strategy can do better or worse.'
                    },
                    {
                        question: 'A checkerboard has two diagonally opposite corners removed (both same color). Can you tile the remaining 62 squares with 31 dominoes? Prove your answer.',
                        hint: 'Count black and white squares separately. Each domino covers one of each.',
                        solution: 'Opposite corners have the same color. Removing two squares of the same color leaves 30 of one color and 32 of the other. Each domino covers exactly one black and one white square. So any tiling requires equal numbers of black and white squares. Since 30 \\(\\neq\\) 32, tiling is impossible. The invariant is: (black squares covered) = (white squares covered) for any partial tiling.'
                    }
                ]
            },

            // ============================================================
            // Section 6: Strategy Analyzer (Backward Induction)
            // ============================================================
            {
                id: 'sec-bridge',
                title: 'The Bigger Picture',
                content: `
<h2>Backward Induction and Game Trees</h2>

<p>All the games in this chapter share a common analysis method: <strong>backward induction</strong>. Start from the terminal positions, classify them as wins or losses, and work backwards through the game tree.</p>

<div class="env-block definition">
<strong>Backward Induction</strong><br>
<ol>
<li>Identify all terminal positions and classify them (win/lose for the player to move).</li>
<li>For each non-terminal position, look at all positions reachable in one move.</li>
<li>If any successor is a losing position (for the opponent), the current position is a winning position.</li>
<li>If all successors are winning positions (for the opponent), the current position is a losing position.</li>
</ol>
</div>

<p>This method works for any finite, two-player, perfect-information game with no draws. Zermelo's theorem (1913) guarantees that exactly one of the two players has a winning strategy in any such game.</p>

<h3>Computational Complexity</h3>

<p>Backward induction always works <em>in principle</em>, but the game tree may be astronomically large. Chess has roughly \\(10^{44}\\) legal positions. Go has roughly \\(10^{170}\\). Even with the world's fastest computers, we cannot solve these games by brute force. This is why elegant mathematical strategies (like XOR for Nim) are so valuable: they compress the entire game tree into a simple formula.</p>

<div class="env-block remark">
<strong>Sprague-Grundy Theory</strong><br>
The Sprague-Grundy theorem generalizes Nim's XOR strategy to <em>all</em> impartial games (games where both players have the same moves from any position). Every impartial game position is equivalent to a Nim pile of some size (its Grundy value). This is explored in Chapter 15.
</div>

<p>The visualization below lets you analyze the subtraction game (a simplified Nim variant) using backward induction. Adjust the maximum take and watch how the pattern of winning/losing positions changes.</p>

<div class="viz-placeholder" data-viz="viz-strategy-analyzer"></div>
`,
                visualizations: [
                    {
                        id: 'viz-strategy-analyzer',
                        title: 'Backward Induction Analyzer',
                        description: 'Analyze the subtraction game: starting with n stones, take 1 to k per turn, last stone wins. See which positions are wins (N) and losses (P).',
                        setup: function (container, controls) {
                            var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                            var w = viz.width, h = viz.height;
                            var ctx = viz.ctx;

                            var maxN = 30;
                            var maxTake = 3;

                            VizEngine.createSlider(controls, 'Max stones', 10, 50, maxN, 1, function (v) { maxN = Math.round(v); });
                            VizEngine.createSlider(controls, 'Max take', 1, 6, maxTake, 1, function (v) { maxTake = Math.round(v); });

                            function classify(n, mt) {
                                var result = [];
                                for (var i = 0; i <= n; i++) {
                                    if (i === 0) { result.push('P'); continue; }
                                    var isN = false;
                                    for (var t = 1; t <= Math.min(i, mt); t++) {
                                        if (result[i - t] === 'P') { isN = true; break; }
                                    }
                                    result.push(isN ? 'N' : 'P');
                                }
                                return result;
                            }

                            viz.animate(function () {
                                viz.clear();
                                ctx.fillStyle = '#f0f6fc'; ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Subtraction Game Analyzer (take 1-' + maxTake + ')', w / 2, 22);

                                var positions = classify(maxN, maxTake);
                                var cellW = Math.min(30, (w - 80) / (maxN + 1));
                                var cellH = 40;
                                var rows = Math.ceil((maxN + 1) / Math.floor((w - 40) / cellW));
                                var perRow = Math.floor((w - 40) / cellW);
                                var x0 = (w - perRow * cellW) / 2;
                                var y0 = 50;

                                for (var i = 0; i <= maxN; i++) {
                                    var row = Math.floor(i / perRow);
                                    var col = i % perRow;
                                    var cx = x0 + col * cellW + cellW / 2;
                                    var cy = y0 + row * (cellH + 5) + cellH / 2;

                                    var isP = positions[i] === 'P';
                                    ctx.fillStyle = isP ? '#3fb95044' : '#f0883e44';
                                    ctx.fillRect(cx - cellW / 2 + 1, cy - cellH / 2 + 1, cellW - 2, cellH - 2);
                                    ctx.strokeStyle = isP ? '#3fb950' : '#f0883e';
                                    ctx.lineWidth = 1;
                                    ctx.strokeRect(cx - cellW / 2 + 1, cy - cellH / 2 + 1, cellW - 2, cellH - 2);

                                    ctx.fillStyle = isP ? '#3fb950' : '#f0883e';
                                    ctx.font = 'bold 11px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(i, cx, cy - 8);
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillText(positions[i], cx, cy + 8);
                                }

                                // Legend
                                var legY = y0 + rows * (cellH + 5) + 15;
                                ctx.font = '12px -apple-system,sans-serif'; ctx.textAlign = 'center';
                                ctx.fillStyle = '#3fb950';
                                ctx.fillText('P = Previous player wins (lose if your turn)', w / 2 - 150, legY);
                                ctx.fillStyle = '#f0883e';
                                ctx.fillText('N = Next player wins (win if your turn)', w / 2 + 150, legY);

                                ctx.fillStyle = '#8b949e'; ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('Pattern: P-positions repeat every ' + (maxTake + 1) + ' (multiples of ' + (maxTake + 1) + ')', w / 2, legY + 20);

                                // Winning move guide
                                ctx.fillStyle = '#4a4a7a'; ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText('From N-position n, winning move: take (n mod ' + (maxTake + 1) + ') stones to reach nearest P-position', w / 2, legY + 40);
                            });
                            return viz;
                        }
                    }
                ],
                exercises: [
                    {
                        question: 'In a subtraction game where you can take 1, 2, 3, 4, or 5 stones, and the last stone wins, what are the P-positions?',
                        hint: 'The maximum take is 5, so the period is 5 + 1 = 6.',
                        solution: 'The P-positions are multiples of 6: 0, 6, 12, 18, 24, ... From any other position, take (n mod 6) stones to reach the nearest multiple of 6. For example, from n = 14, take 14 mod 6 = 2 stones, leaving 12.'
                    },
                    {
                        question: 'Two players take turns removing 1, 3, or 4 coins from a pile. The player who takes the last coin wins. Classify positions 0 through 12 as P or N.',
                        hint: 'Apply backward induction: 0 is P. For each n, check if any of n-1, n-3, n-4 (when valid) is P.',
                        solution: '0: P. 1: N (take 1 to 0). 2: P (can only reach 1, which is N). 3: N (take 3 to 0). 4: N (take 4 to 0 or take 3 to 1 or take 1 to 3; 0 is P). 5: N (take 1 to 4? No, 4 is N. Take 3 to 2, which is P. Yes!). 6: N (take 4 to 2, P). 7: P (reach 6 N, 4 N, 3 N, all N). 8: N (take 1 to 7, P). 9: P (reach 8 N, 6 N, 5 N). 10: N (take 1 to 9, P). 11: N (take 4 to 7, P). 12: N (take 3 to 9, P). P-positions: 0, 2, 7, 9. The pattern repeats with period 7: {0, 2} then {7, 9} then {14, 16}, etc.'
                    },
                    {
                        question: 'State Zermelo\'s theorem. What conditions does a game need to satisfy for the theorem to apply?',
                        hint: 'Think about what makes a game "nice" for mathematical analysis: finiteness, information, number of players, possibility of draws.',
                        solution: 'Zermelo\'s theorem (1913): In any finite, two-player, perfect-information game with no draws, exactly one of the two players has a winning strategy. The conditions are: (1) two players, (2) finite game (must end after finitely many moves), (3) perfect information (no hidden cards, dice, etc.), (4) no draws possible. Chess satisfies all but (4); with the draw rule, Zermelo says one player can win or both can force a draw.'
                    }
                ]
            }
        ]
    });
})();
