// === Chapter 20: Cryptarithmetic & Codes ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch20',
    number: 20,
    title: 'Cryptarithmetic & Codes',
    subtitle: 'When letters stand for digits',
    sections: [
        // ─────────────────────────────────────────────
        // Section 1: Motivation
        // ─────────────────────────────────────────────
        {
            id: 'sec-motivation',
            title: 'The Mystery of Hidden Digits',
            content: `
<h2>The Mystery of Hidden Digits</h2>

<div class="env-block intuition">
    <div class="env-title">A Puzzle to Start</div>
    <div class="env-body">
        <p>Replace each letter with a distinct digit (0 through 9) so that the following addition is correct:</p>
        <pre style="font-size:1.3em; letter-spacing:2px; text-align:center;">
    S E N D
  + M O R E
  ---------
  M O N E Y
        </pre>
        <p>Different letters must stand for different digits, and the leading digit of any number cannot be zero. Can you find the unique solution?</p>
    </div>
</div>

<p>This is a <strong>cryptarithmetic puzzle</strong> (also called an alphametic or verbal arithmetic puzzle). Each letter represents a unique digit. The goal is to find a digit assignment that makes the arithmetic statement true.</p>

<p>The name "cryptarithmetic" combines <em>cryptography</em> (hidden writing) and <em>arithmetic</em>. These puzzles sit at the intersection of number theory, logic, and constraint satisfaction. Solving them requires the same kind of systematic reasoning that mathematicians use: testing cases, using modular arithmetic, analyzing carries, and eliminating impossibilities.</p>

<div class="env-block remark">
    <div class="env-title">Historical Note</div>
    <div class="env-body">
        <p>The first published cryptarithmetic puzzle appeared in 1864 in <em>The American Agriculturist</em> magazine. The most famous example, SEND + MORE = MONEY, was published by Henry Dudeney in the July 1924 issue of <em>Strand Magazine</em>. It remains the gold standard of the genre.</p>
    </div>
</div>

<h3>What makes a good puzzle?</h3>

<p>A well-crafted cryptarithmetic puzzle has exactly one solution. The solver should be able to find it through logical deduction rather than exhaustive trial-and-error. The best puzzles embed meaningful words or phrases into the arithmetic, adding a literary flavor to the mathematics.</p>

<h3>The rules</h3>

<ol>
    <li>Each letter represents a single digit (0 through 9).</li>
    <li>Different letters must represent different digits.</li>
    <li>Leading digits cannot be zero (the first letter of any number is nonzero).</li>
    <li>Standard arithmetic operations apply (addition, multiplication, etc.).</li>
</ol>

<p>With these rules in hand, let us solve the most famous cryptarithmetic puzzle of all time.</p>
`,
            visualizations: [],
            exercises: []
        },

        // ─────────────────────────────────────────────
        // Section 2: SEND + MORE = MONEY
        // ─────────────────────────────────────────────
        {
            id: 'sec-send',
            title: 'SEND + MORE = MONEY',
            content: `
<h2>SEND + MORE = MONEY</h2>

<p>Let us solve this step by step, using logical deduction to narrow down possibilities until only one solution remains.</p>

<h3>Step 1: The leading carry</h3>

<p>SEND is a 4-digit number, and MORE is a 4-digit number, but MONEY is a 5-digit number. The only way two 4-digit numbers can sum to a 5-digit number is if there is a carry from the thousands column. Since the maximum carry from any column is 1, we deduce:</p>

\\[M = 1\\]

<h3>Step 2: Column analysis (thousands)</h3>

<p>The thousands column gives us \\(S + M + c_3 = O + 10 \\cdot c_4\\), where \\(c_3\\) is the carry from the hundreds column and \\(c_4 = 1\\) is the carry into the ten-thousands column. Since \\(M = 1\\), we have:</p>

\\[S + 1 + c_3 = O + 10\\]

<p>So \\(S + c_3 = O + 9\\). Since \\(S \\leq 9\\) and \\(c_3 \\in \\{0, 1\\}\\), the maximum of \\(S + c_3\\) is 10. So \\(O + 9 \\leq 10\\), meaning \\(O \\leq 1\\). Since \\(M = 1\\), we need \\(O \\ne 1\\), so:</p>

\\[O = 0\\]

<p>And therefore \\(S + c_3 = 9\\).</p>

<h3>Step 3: Narrowing S</h3>

<p>If \\(c_3 = 0\\), then \\(S = 9\\). If \\(c_3 = 1\\), then \\(S = 8\\). We will determine which by analyzing the hundreds column.</p>

<h3>Step 4: Hundreds column</h3>

<p>\\(E + O + c_2 = N + 10 \\cdot c_3\\), where \\(O = 0\\), so \\(E + c_2 = N + 10 \\cdot c_3\\).</p>

<p>If \\(c_3 = 0\\): \\(E + c_2 = N\\), so \\(N = E\\) or \\(N = E + 1\\). But \\(N \\ne E\\) (different letters), so \\(c_2 = 1\\) and \\(N = E + 1\\).</p>
<p>If \\(c_3 = 1\\): \\(E + c_2 = N + 10\\). Since \\(E \\leq 9\\) and \\(c_2 \\leq 1\\), the left side is at most 10, so \\(N = 0\\). But \\(O = 0\\), so \\(N \\ne 0\\). Contradiction if \\(E + c_2 = 10\\) requires \\(N = 0\\). Wait: we need \\(N + 10 = E + c_2\\), so \\(N = E + c_2 - 10\\). For \\(N \\geq 0\\), \\(E + c_2 \\geq 10\\), meaning \\(E = 9\\) and \\(c_2 = 1\\), giving \\(N = 0 = O\\). Contradiction. So \\(c_3 = 1\\) is possible only if this contradiction is resolved, but it cannot be.</p>

<p>Actually, let us reconsider. If \\(c_3 = 1\\), then from Step 3, \\(S = 8\\). The hundreds column: \\(E + c_2 = N + 10\\). For \\(N \\geq 2\\) (since 0 and 1 are taken), we need \\(E + c_2 \\geq 12\\), impossible. So indeed \\(c_3 = 0\\) is forced, giving:</p>

\\[S = 9, \\quad c_2 = 1, \\quad N = E + 1\\]

<h3>Step 5: Tens column</h3>

<p>\\(N + R + c_1 = E + 10 \\cdot c_2\\). Since \\(c_2 = 1\\):</p>
\\[N + R + c_1 = E + 10\\]
<p>Substituting \\(N = E + 1\\):</p>
\\[(E + 1) + R + c_1 = E + 10\\]
\\[R + c_1 = 9\\]

<p>So \\(R = 9\\) (with \\(c_1 = 0\\)) or \\(R = 8\\) (with \\(c_1 = 1\\)). Since \\(S = 9\\), we need \\(R \\ne 9\\), so:</p>
\\[R = 8, \\quad c_1 = 1\\]

<h3>Step 6: Units column</h3>

<p>\\(D + E = Y + 10 \\cdot c_1\\). Since \\(c_1 = 1\\):</p>
\\[D + E = Y + 10\\]

<p>We need \\(D + E \\geq 10\\) (since \\(Y \\geq 0\\)) and \\(Y = D + E - 10\\). The digits used so far are \\(\\{0, 1, 8, 9\\}\\) (for O, M, R, S). Also \\(N = E + 1\\), and \\(E, N, D, Y\\) must be distinct and from \\(\\{2, 3, 4, 5, 6, 7\\}\\).</p>

<p>We need \\(D + E \\geq 10\\), \\(N = E + 1\\), and all of \\(E, N, D, Y\\) distinct and in \\(\\{2, 3, 4, 5, 6, 7\\}\\).</p>

<p>Testing \\(E = 5\\): \\(N = 6\\). Then \\(D + 5 \\geq 10\\), so \\(D \\geq 5\\). Available: \\(\\{2, 3, 4, 7\\}\\), so \\(D = 7\\), \\(Y = 7 + 5 - 10 = 2\\). Check: all distinct? \\(E=5, N=6, D=7, Y=2\\). Yes!</p>

<div class="env-block theorem">
    <div class="env-title">Solution</div>
    <div class="env-body">
        <pre style="font-size:1.3em; letter-spacing:2px; text-align:center;">
    9 5 6 7
  + 1 0 8 5
  ---------
  1 0 6 5 2
        </pre>
        <p>\\(S=9, E=5, N=6, D=7, M=1, O=0, R=8, Y=2\\)</p>
    </div>
</div>

<p>Let us verify: \\(9567 + 1085 = 10652\\). Correct!</p>

<div class="viz-placeholder" data-viz="viz-send-more-money"></div>
`,
            visualizations: [
                {
                    id: 'viz-send-more-money',
                    title: 'SEND + MORE = MONEY: Interactive Solver',
                    description: 'Assign digits to letters by clicking the digit buttons. The display shows the addition and highlights conflicts. Press "Show Solution" to see the answer with step-by-step animation.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 560, height: 420, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var letters = ['S','E','N','D','M','O','R','Y'];
                        var assignment = {};
                        for (var li = 0; li < letters.length; li++) assignment[letters[li]] = -1;
                        var selectedLetter = 0;
                        var solved = false;
                        var animStep = -1;
                        var solution = {S:9,E:5,N:6,D:7,M:1,O:0,R:8,Y:2};
                        var animTimer = null;

                        function digitUsed(d) {
                            for (var k in assignment) {
                                if (assignment[k] === d) return true;
                            }
                            return false;
                        }

                        function evaluate(word) {
                            var val = 0;
                            for (var i = 0; i < word.length; i++) {
                                if (assignment[word[i]] < 0) return -1;
                                val = val * 10 + assignment[word[i]];
                            }
                            return val;
                        }

                        function checkSolved() {
                            var s = evaluate('SEND');
                            var m = evaluate('MORE');
                            var mo = evaluate('MONEY');
                            if (s < 0 || m < 0 || mo < 0) return false;
                            return s + m === mo;
                        }

                        function draw() {
                            viz.clear();

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 16px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('SEND + MORE = MONEY', w / 2, 28);

                            // Draw the addition layout
                            var cx = w / 2 + 30;
                            var baseY = 80;
                            var charW = 36;
                            var rowH = 44;

                            function drawWord(word, row, indent) {
                                for (var i = 0; i < word.length; i++) {
                                    var ch = word[i];
                                    var px = cx + (i - word.length) * charW + indent;
                                    var py = baseY + row * rowH;
                                    var d = assignment[ch];

                                    // Background
                                    ctx.fillStyle = (d >= 0) ? '#1a2a40' : '#1a1a30';
                                    ctx.fillRect(px - charW/2 + 2, py - 16, charW - 4, 34);
                                    ctx.strokeStyle = (letters[selectedLetter] === ch) ? viz.colors.yellow : viz.colors.axis;
                                    ctx.lineWidth = (letters[selectedLetter] === ch) ? 2 : 1;
                                    ctx.strokeRect(px - charW/2 + 2, py - 16, charW - 4, 34);

                                    // Letter
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'top';
                                    ctx.fillText(ch, px, py - 14);

                                    // Digit
                                    if (d >= 0) {
                                        ctx.fillStyle = viz.colors.blue;
                                        ctx.font = 'bold 20px -apple-system,sans-serif';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText(d.toString(), px, py + 6);
                                    } else {
                                        ctx.fillStyle = viz.colors.axis;
                                        ctx.font = '20px -apple-system,sans-serif';
                                        ctx.textBaseline = 'middle';
                                        ctx.fillText('?', px, py + 6);
                                    }
                                }
                            }

                            // + sign
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = 'bold 22px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillText('+', cx - 5 * charW, baseY + rowH + 6);

                            drawWord('SEND', 0, 0);
                            drawWord('MORE', 1, 0);

                            // Horizontal line
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(cx - 5.5 * charW, baseY + 1.65 * rowH);
                            ctx.lineTo(cx + 0.6 * charW, baseY + 1.65 * rowH);
                            ctx.stroke();

                            drawWord('MONEY', 2, 0);

                            // Letter selector
                            var selY = baseY + 3.5 * rowH + 10;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Select letter:', w / 2 - 120, selY);

                            for (var si = 0; si < letters.length; si++) {
                                var sx = w / 2 - 80 + si * 40;
                                var isSelected = (si === selectedLetter);
                                ctx.fillStyle = isSelected ? viz.colors.yellow + '33' : '#1a1a30';
                                ctx.fillRect(sx - 14, selY + 8, 28, 28);
                                ctx.strokeStyle = isSelected ? viz.colors.yellow : viz.colors.axis;
                                ctx.lineWidth = isSelected ? 2 : 1;
                                ctx.strokeRect(sx - 14, selY + 8, 28, 28);
                                ctx.fillStyle = isSelected ? viz.colors.yellow : viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(letters[si], sx, selY + 22);
                            }

                            // Digit buttons
                            var digY = selY + 50;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Assign digit:', w / 2 - 120, digY);

                            for (var di = 0; di <= 9; di++) {
                                var dx = w / 2 - 110 + di * 32;
                                var used = digitUsed(di);
                                var isCurrent = (assignment[letters[selectedLetter]] === di);
                                ctx.fillStyle = isCurrent ? viz.colors.green + '44' : (used ? '#2a1a1a' : '#1a1a30');
                                ctx.fillRect(dx - 12, digY + 8, 24, 28);
                                ctx.strokeStyle = isCurrent ? viz.colors.green : (used ? viz.colors.red + '66' : viz.colors.axis);
                                ctx.lineWidth = 1;
                                ctx.strokeRect(dx - 12, digY + 8, 24, 28);
                                ctx.fillStyle = used ? viz.colors.red + '88' : viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(di.toString(), dx, digY + 22);
                            }

                            // Result check
                            var resY = digY + 55;
                            if (checkSolved()) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Correct! ' + evaluate('SEND') + ' + ' + evaluate('MORE') + ' = ' + evaluate('MONEY'), w / 2, resY);
                            } else {
                                var sv = evaluate('SEND');
                                var mv = evaluate('MORE');
                                var moy = evaluate('MONEY');
                                if (sv > 0 && mv > 0 && moy > 0) {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(sv + ' + ' + mv + ' = ' + (sv + mv) + ' (need ' + moy + ')', w / 2, resY);
                                }
                            }
                        }

                        // Click handling for letter selection
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var baseY = 80;
                            var rowH = 44;
                            var selY = baseY + 3.5 * rowH + 10;

                            // Check letter selector
                            for (var si = 0; si < letters.length; si++) {
                                var sx = w / 2 - 80 + si * 40;
                                if (mx >= sx - 14 && mx <= sx + 14 && my >= selY + 8 && my <= selY + 36) {
                                    selectedLetter = si;
                                    draw();
                                    return;
                                }
                            }

                            // Check digit buttons
                            var digY = selY + 50;
                            for (var di = 0; di <= 9; di++) {
                                var dx = w / 2 - 110 + di * 32;
                                if (mx >= dx - 12 && mx <= dx + 12 && my >= digY + 8 && my <= digY + 36) {
                                    var letter = letters[selectedLetter];
                                    // If clicking same digit, unassign
                                    if (assignment[letter] === di) {
                                        assignment[letter] = -1;
                                    } else {
                                        // Remove digit from any other letter
                                        for (var k in assignment) {
                                            if (assignment[k] === di) assignment[k] = -1;
                                        }
                                        assignment[letter] = di;
                                    }
                                    draw();
                                    return;
                                }
                            }
                        });

                        // Buttons
                        VizEngine.createButton(controls, 'Show Solution', function() {
                            var order = ['M','O','S','R','E','N','D','Y'];
                            var idx = 0;
                            // Reset
                            for (var k in assignment) assignment[k] = -1;
                            draw();
                            if (animTimer) clearInterval(animTimer);
                            animTimer = setInterval(function() {
                                if (idx >= order.length) { clearInterval(animTimer); animTimer = null; return; }
                                assignment[order[idx]] = solution[order[idx]];
                                idx++;
                                draw();
                            }, 500);
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            for (var k in assignment) assignment[k] = -1;
                            selectedLetter = 0;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'In SEND + MORE = MONEY, explain why M must equal 1. Could M be 2 or larger?',
                    hint: 'What is the largest possible sum of two 4-digit numbers?',
                    solution: 'The largest 4-digit number is 9999. So the largest possible sum is \\(9999 + 9999 = 19998\\). This is a 5-digit number starting with 1. For the sum to start with 2, we would need the sum to be at least 20000, but \\(9999 + 9999 = 19998 < 20000\\). So \\(M = 1\\) is the only possibility.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 3: Solving Techniques
        // ─────────────────────────────────────────────
        {
            id: 'sec-techniques',
            title: 'Solving Techniques',
            content: `
<h2>Solving Techniques</h2>

<p>The SEND + MORE = MONEY solution illustrated several powerful techniques. Let us formalize them.</p>

<h3>1. Carry Analysis</h3>

<p>In any addition puzzle, each column produces a carry of 0 or 1 (occasionally 2 for multi-addend puzzles). We write the column equations systematically:</p>

<p>For an addition \\(A_1 A_2 \\ldots A_n + B_1 B_2 \\ldots B_n = C_0 C_1 \\ldots C_n\\):</p>

\\[A_i + B_i + c_{i-1} = C_i + 10 \\cdot c_i\\]

<p>where \\(c_0 = 0\\) (no carry into the units column) and each \\(c_i \\in \\{0, 1\\}\\). The carry variables \\(c_i\\) link the columns together, creating a chain of constraints that propagate from right to left.</p>

<div class="viz-placeholder" data-viz="viz-carry-analysis"></div>

<h3>2. Parity Arguments</h3>

<p>The parity (odd/even) of digits provides quick constraints. If \\(A + B\\) must be even, then \\(A\\) and \\(B\\) have the same parity. If \\(A + B\\) must be odd, they have opposite parity.</p>

<div class="env-block example">
    <div class="env-title">Example</div>
    <div class="env-body">
        <p>In the puzzle EAT + THAT = APPLE, the units column gives \\(T + T = E + 10c_1\\), so \\(2T - E = 10c_1\\). Since \\(2T\\) is always even, \\(E\\) must be even.</p>
    </div>
</div>

<h3>3. Modular Arithmetic</h3>

<p>Taking an equation modulo small numbers (2, 3, 9, 10) can yield quick constraints. In particular, a number is congruent to its digit sum modulo 9. So if SEND + MORE = MONEY, then:</p>

\\[(S+E+N+D) + (M+O+R+E) \\equiv M+O+N+E+Y \\pmod{9}\\]
\\[S + E + R + D \\equiv Y \\pmod{9}\\]

<p>With \\(S=9, E=5, R=8, D=7\\): \\(9+5+8+7 = 29 \\equiv 2 \\pmod{9}\\), and indeed \\(Y=2\\).</p>

<h3>4. Range Constraints</h3>

<p>Each digit is between 0 and 9. Leading digits are between 1 and 9. When you have an equation like \\(S + 1 + c_3 = O + 10\\), you can immediately bound the possible values of \\(O\\): since \\(S \\leq 9\\) and \\(c_3 \\leq 1\\), \\(O \\leq 1\\).</p>

<h3>5. Elimination</h3>

<p>As you determine digits, track which are still available. If only one digit fits a position, it is forced. If no digit fits, backtrack; an earlier assumption was wrong.</p>

<div class="env-block remark">
    <div class="env-title">Strategy Summary</div>
    <div class="env-body">
        <ol>
            <li>Start from the leftmost column (leading carries are most constraining).</li>
            <li>Use carry analysis column by column.</li>
            <li>Apply parity and modular arguments to narrow options.</li>
            <li>Track used digits and eliminate impossibilities.</li>
            <li>When stuck, try case analysis on the most constrained variable.</li>
        </ol>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-carry-analysis',
                    title: 'Carry Analysis Visualizer',
                    description: 'See how carries propagate column by column in an addition problem. Enter two numbers and watch the carry chain animate from right to left.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 560, height: 380, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var num1 = [9, 5, 6, 7]; // SEND
                        var num2 = [1, 0, 8, 5]; // MORE
                        var animCol = -1;
                        var animTimer = null;

                        function draw() {
                            viz.clear();

                            var maxLen = Math.max(num1.length, num2.length);
                            var result = [];
                            var carries = [0];

                            // Compute carries and result
                            for (var i = 0; i < maxLen; i++) {
                                var a = i < num1.length ? num1[num1.length - 1 - i] : 0;
                                var b = i < num2.length ? num2[num2.length - 1 - i] : 0;
                                var sum = a + b + carries[i];
                                result.push(sum % 10);
                                carries.push(Math.floor(sum / 10));
                            }
                            if (carries[maxLen] > 0) result.push(carries[maxLen]);

                            var cellW = 50;
                            var cellH = 44;
                            var resLen = result.length;
                            var startX = (w - resLen * cellW) / 2 + cellW;
                            var startY = 60;

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Carry Analysis: Column by Column', w / 2, 28);

                            // Column labels
                            for (var ci = 0; ci < resLen; ci++) {
                                var colIdx = resLen - 1 - ci;
                                var px = startX + ci * cellW;
                                var highlighted = (animCol >= 0 && colIdx <= animCol);
                                var active = (colIdx === animCol);

                                // Column background
                                if (active) {
                                    ctx.fillStyle = viz.colors.yellow + '22';
                                    ctx.fillRect(px - cellW/2, startY - 10, cellW, cellH * 4 + 20);
                                }

                                // Carry row
                                if (colIdx < carries.length && carries[colIdx] > 0 && highlighted) {
                                    ctx.fillStyle = viz.colors.orange;
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(carries[colIdx].toString(), px, startY);
                                }

                                // First number
                                var d1 = (colIdx < num1.length) ? num1[num1.length - 1 - colIdx] : -1;
                                if (d1 >= 0) {
                                    ctx.fillStyle = highlighted ? viz.colors.blue : viz.colors.text;
                                    ctx.font = 'bold 22px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(d1.toString(), px, startY + cellH);
                                }

                                // Second number
                                var d2 = (colIdx < num2.length) ? num2[num2.length - 1 - colIdx] : -1;
                                if (d2 >= 0) {
                                    ctx.fillStyle = highlighted ? viz.colors.teal : viz.colors.text;
                                    ctx.font = 'bold 22px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(d2.toString(), px, startY + 2 * cellH);
                                }

                                // Line
                                if (ci === 0) {
                                    ctx.strokeStyle = viz.colors.white;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(startX - cellW/2 - 10, startY + 2.6 * cellH);
                                    ctx.lineTo(startX + resLen * cellW - cellW/2, startY + 2.6 * cellH);
                                    ctx.stroke();
                                }

                                // Result
                                if (highlighted && colIdx < result.length) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 22px -apple-system,sans-serif';
                                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                    ctx.fillText(result[colIdx].toString(), px, startY + 3.2 * cellH);
                                }
                            }

                            // + sign
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = 'bold 22px -apple-system,sans-serif';
                            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                            ctx.fillText('+', startX - cellW, startY + 2 * cellH);

                            // Explanation
                            if (animCol >= 0 && animCol < maxLen) {
                                var a2 = animCol < num1.length ? num1[num1.length - 1 - animCol] : 0;
                                var b2 = animCol < num2.length ? num2[num2.length - 1 - animCol] : 0;
                                var c2 = carries[animCol];
                                var s2 = a2 + b2 + c2;
                                var infoY = startY + 4.2 * cellH + 10;
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Column ' + animCol + ':  ' + a2 + ' + ' + b2 + ' + carry ' + c2 + ' = ' + s2, w / 2, infoY);
                                ctx.fillText('Write ' + (s2 % 10) + ', carry ' + Math.floor(s2 / 10), w / 2, infoY + 20);
                            }
                        }

                        VizEngine.createButton(controls, 'Animate', function() {
                            animCol = -1;
                            if (animTimer) clearInterval(animTimer);
                            animTimer = setInterval(function() {
                                animCol++;
                                if (animCol > Math.max(num1.length, num2.length)) {
                                    clearInterval(animTimer);
                                    animTimer = null;
                                }
                                draw();
                            }, 800);
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            if (animTimer) { clearInterval(animTimer); animTimer = null; }
                            animCol = -1;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Solve the cryptarithmetic puzzle: AB + BA = CBC. (Two-digit number plus its reverse equals a three-digit palindrome.)',
                    hint: 'Write out the column equations. The units column gives B + A = C + 10*c1. The tens column gives A + B + c1 = B + 10*c2. What does the tens column tell you about A and c1?',
                    solution: 'Tens column: \\(A + B + c_1 = B + 10c_2\\), so \\(A + c_1 = 10c_2\\). Since \\(A \\geq 1\\), we need \\(c_2 = 1\\), so \\(A + c_1 = 10\\). If \\(c_1 = 1\\), then \\(A = 9\\). Units: \\(B + 9 = C + 10\\), so \\(C = B - 1\\). Hundreds: \\(c_2 = C = 1\\) when \\(B = 2\\). Check: \\(92 + 29 = 121\\). If \\(c_1 = 0\\), then \\(A = 10\\), impossible. Other values of \\(B\\) give different \\(C\\) but \\(C\\) must equal \\(c_2 = 1\\), so \\(B = 2, C = 1\\). Solution: \\(A=9, B=2, C=1\\); \\(92 + 29 = 121\\).'
                },
                {
                    question: 'Use modular arithmetic (mod 9) to show that in SEND + MORE = MONEY, we must have \\(S + E + R + D \\equiv Y \\pmod{9}\\).',
                    hint: 'A number is congruent to its digit sum modulo 9. Write SEND, MORE, and MONEY as their digit sums and simplify.',
                    solution: 'Modulo 9: SEND \\(\\equiv S+E+N+D\\), MORE \\(\\equiv M+O+R+E\\), MONEY \\(\\equiv M+O+N+E+Y\\). Then SEND + MORE \\(\\equiv\\) MONEY gives \\((S+E+N+D)+(M+O+R+E) \\equiv M+O+N+E+Y\\). Cancelling \\(M, O, N, E\\) from both sides: \\(S+E+R+D \\equiv Y \\pmod{9}\\). Substituting: \\(9+5+8+7 = 29 \\equiv 2 \\pmod{9}\\), and \\(Y=2\\).'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 4: Create Your Own
        // ─────────────────────────────────────────────
        {
            id: 'sec-create',
            title: 'Create Your Own',
            content: `
<h2>Designing Cryptarithmetic Puzzles</h2>

<p>Creating your own cryptarithmetic puzzle is as rewarding as solving one. The key challenge is engineering a puzzle that (a) has a unique solution and (b) is solvable by logical deduction rather than brute force.</p>

<h3>The Design Process</h3>

<ol>
    <li><strong>Start with the arithmetic.</strong> Pick a true equation, such as \\(345 + 678 = 1023\\).</li>
    <li><strong>Assign letters.</strong> Replace each digit with a letter. Same digit, same letter; different digits, different letters. Try to form real words.</li>
    <li><strong>Check uniqueness.</strong> Verify that no other digit assignment satisfies the equation. This is the hard part.</li>
    <li><strong>Assess difficulty.</strong> Can a solver find the answer through logical deduction? Or does it require too much case analysis?</li>
</ol>

<div class="env-block example">
    <div class="env-title">Example: Building a Puzzle</div>
    <div class="env-body">
        <p>Start with \\(314 + 159 = 473\\). Assign: \\(3 \\to T, 1 \\to O, 4 \\to P, 5 \\to I, 9 \\to N\\). This gives TOP + OIN = PTN... not great for words. Try rearranging. This is where creativity meets mathematics.</p>
        <p>A better approach: start with words and work backwards. "CAT + DOG = ?" Choose digits: C=1, A=7, T=3, D=8, O=9, G=5. Then CAT = 173, DOG = 895, sum = 1068. So CAT + DOG = BAKE if B=1, A=0... but A is already 7. The digit assignment must be consistent, so we need to iterate.</p>
    </div>
</div>

<h3>Tips for Good Puzzles</h3>

<ul>
    <li><strong>Use meaningful words.</strong> CROSS + ROADS = DANGER is more memorable than ABCDE + FGHIJ = KLMNO.</li>
    <li><strong>Minimize distinct letters.</strong> Fewer letters means fewer digits to find, which usually means the puzzle is solvable by deduction. Eight distinct letters (like SEND + MORE = MONEY) is a sweet spot.</li>
    <li><strong>Maximize logical constraints.</strong> Carry propagation is the main solving tool. Longer numbers with more columns create more constraints.</li>
    <li><strong>Test from the solver's perspective.</strong> After creating your puzzle, try to solve it without looking at the answer. If you get stuck, the solver will too.</li>
</ul>

<div class="viz-placeholder" data-viz="viz-cryptarithmetic-solver"></div>
`,
            visualizations: [
                {
                    id: 'viz-cryptarithmetic-solver',
                    title: 'Cryptarithmetic Solver',
                    description: 'Enter any addition-based cryptarithmetic puzzle and step through the deduction process. The solver uses constraint propagation and backtracking.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 560, height: 420, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var word1 = 'SEND';
                        var word2 = 'MORE';
                        var wordR = 'MONEY';
                        var solutionMap = null;
                        var solving = false;
                        var stepLog = [];
                        var scrollOffset = 0;

                        function getLetters(w1, w2, wr) {
                            var s = {};
                            (w1 + w2 + wr).split('').forEach(function(c) { s[c] = true; });
                            return Object.keys(s).sort();
                        }

                        function solve(w1, w2, wr) {
                            var letters = getLetters(w1, w2, wr);
                            if (letters.length > 10) return null;
                            var leading = {};
                            if (w1.length > 0) leading[w1[0]] = true;
                            if (w2.length > 0) leading[w2[0]] = true;
                            if (wr.length > 0) leading[wr[0]] = true;

                            var log = [];
                            var result = null;

                            function wordVal(word, map) {
                                var v = 0;
                                for (var i = 0; i < word.length; i++) v = v * 10 + map[word[i]];
                                return v;
                            }

                            function tryAssign(idx, used, map) {
                                if (result) return;
                                if (idx === letters.length) {
                                    var v1 = wordVal(w1, map);
                                    var v2 = wordVal(w2, map);
                                    var vr = wordVal(wr, map);
                                    if (v1 + v2 === vr) {
                                        log.push('Found: ' + w1 + '=' + v1 + ', ' + w2 + '=' + v2 + ', ' + wr + '=' + vr);
                                        result = {};
                                        for (var k in map) result[k] = map[k];
                                    }
                                    return;
                                }
                                var letter = letters[idx];
                                var start = leading[letter] ? 1 : 0;
                                for (var d = start; d <= 9; d++) {
                                    if (used[d]) continue;
                                    map[letter] = d;
                                    used[d] = true;
                                    log.push('Try ' + letter + ' = ' + d);
                                    tryAssign(idx + 1, used, map);
                                    if (result) return;
                                    used[d] = false;
                                    delete map[letter];
                                }
                            }

                            tryAssign(0, {}, {});
                            return { solution: result, log: log };
                        }

                        function draw() {
                            viz.clear();

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Cryptarithmetic Solver', w / 2, 24);

                            // Show puzzle
                            ctx.font = 'bold 20px monospace';
                            ctx.textAlign = 'right';
                            var px = w / 2 + 60;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText(word1, px, 60);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('+  ' + word2, px, 88);
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(px - 140, 98); ctx.lineTo(px + 10, 98); ctx.stroke();
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText(wordR, px, 122);

                            // Show solution
                            if (solutionMap) {
                                var letters = getLetters(word1, word2, wordR);
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'left';
                                var sy = 150;
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('Solution:', 30, sy);
                                for (var i = 0; i < letters.length; i++) {
                                    var lx = 30 + (i % 5) * 80;
                                    var ly = sy + 20 + Math.floor(i / 5) * 20;
                                    ctx.fillStyle = viz.colors.yellow;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.fillText(letters[i] + ' = ' + solutionMap[letters[i]], lx, ly);
                                }

                                // Numeric result
                                function wordVal(word, map) {
                                    var v = 0;
                                    for (var j = 0; j < word.length; j++) v = v * 10 + map[word[j]];
                                    return v;
                                }
                                var v1 = wordVal(word1, solutionMap);
                                var v2 = wordVal(word2, solutionMap);
                                var vr = wordVal(wordR, solutionMap);
                                var numY = sy + 20 + Math.ceil(letters.length / 5) * 20 + 10;
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.fillText(v1 + ' + ' + v2 + ' = ' + vr, 30, numY);
                            } else if (solving) {
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Solving...', w / 2, 160);
                            }

                            // Step log
                            if (stepLog.length > 0) {
                                var logY = 240;
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '11px monospace';
                                ctx.textAlign = 'left';
                                var maxLines = Math.min(12, stepLog.length);
                                var start = Math.max(0, stepLog.length - maxLines - scrollOffset);
                                for (var li = 0; li < maxLines && start + li < stepLog.length; li++) {
                                    ctx.fillStyle = stepLog[start + li].indexOf('Found') === 0 ? viz.colors.green : viz.colors.text;
                                    ctx.fillText(stepLog[start + li], 30, logY + li * 14);
                                }
                            }
                        }

                        // Input fields
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;flex-wrap:wrap;';

                        function makeInput(label, val) {
                            var lbl = document.createElement('span');
                            lbl.textContent = label;
                            lbl.style.cssText = 'color:#8b949e;font-size:0.78rem;';
                            var inp = document.createElement('input');
                            inp.type = 'text';
                            inp.value = val;
                            inp.style.cssText = 'width:70px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.82rem;text-transform:uppercase;';
                            inputDiv.appendChild(lbl);
                            inputDiv.appendChild(inp);
                            return inp;
                        }

                        var inp1 = makeInput('', word1);
                        var lblPlus = document.createElement('span');
                        lblPlus.textContent = '+';
                        lblPlus.style.cssText = 'color:#f0883e;font-weight:bold;';
                        inputDiv.appendChild(lblPlus);
                        var inp2 = makeInput('', word2);
                        var lblEq = document.createElement('span');
                        lblEq.textContent = '=';
                        lblEq.style.cssText = 'color:#f0f6fc;font-weight:bold;';
                        inputDiv.appendChild(lblEq);
                        var inpR = makeInput('', wordR);
                        controls.appendChild(inputDiv);

                        VizEngine.createButton(controls, 'Solve', function() {
                            word1 = inp1.value.toUpperCase().replace(/[^A-Z]/g, '');
                            word2 = inp2.value.toUpperCase().replace(/[^A-Z]/g, '');
                            wordR = inpR.value.toUpperCase().replace(/[^A-Z]/g, '');
                            if (!word1 || !word2 || !wordR) return;
                            var letters = getLetters(word1, word2, wordR);
                            if (letters.length > 10) {
                                stepLog = ['Error: more than 10 distinct letters'];
                                solutionMap = null;
                                draw();
                                return;
                            }
                            solving = true;
                            solutionMap = null;
                            stepLog = [];
                            draw();
                            setTimeout(function() {
                                var res = solve(word1, word2, wordR);
                                solving = false;
                                if (res.solution) {
                                    solutionMap = res.solution;
                                    stepLog = res.log.slice(-50);
                                } else {
                                    stepLog = ['No solution found.'];
                                }
                                draw();
                            }, 50);
                        });

                        VizEngine.createButton(controls, 'Clear', function() {
                            solutionMap = null;
                            stepLog = [];
                            scrollOffset = 0;
                            draw();
                        });

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Design a cryptarithmetic puzzle using 3-letter words where WORD1 + WORD2 = RESULT. Verify it has a unique solution.',
                    hint: 'Start with a numerical equation like 123 + 456 = 579. Then try to assign letters that form recognizable words. Check uniqueness by verifying no other digit assignment works.',
                    solution: 'One example: FUN + SUN = FANS. Assigning F=2, U=8, N=1, S=7, A=5, giving 281 + 781 = 1062. But FANS needs 4 digits with F, A, N, S. Try: 281 + 781 = 1062 does not spell FANS correctly (F=1, A=0, N=6, S=2, but F was 2). This shows the challenge: consistency is tricky. A working example is ONE + ONE = TWO with O=2, N=3, E=8, T=5, W=7: 238 + 238 = 476... no. Constructing good puzzles requires iteration!'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 5: Simple Codes
        // ─────────────────────────────────────────────
        {
            id: 'sec-codes',
            title: 'Simple Codes',
            content: `
<h2>From Digits to Messages</h2>

<p>Cryptarithmetic replaces digits with letters. But we can also go the other way: replace letters with other symbols to create <strong>secret codes</strong>. This is the domain of <em>cryptography</em>, the art of writing in code.</p>

<p>Cryptography has been used for thousands of years, from Julius Caesar's military dispatches to modern internet encryption. We will explore three classic ciphers: the Caesar cipher, general substitution ciphers, and the pigpen cipher.</p>

<h3>The Caesar Cipher</h3>

<p>The simplest cipher is the <strong>Caesar cipher</strong>, named after Julius Caesar, who used it in his private correspondence. The idea: shift every letter in the alphabet by a fixed number of positions.</p>

<div class="env-block definition">
    <div class="env-title">Definition (Caesar Cipher)</div>
    <div class="env-body">
        <p>Given a shift \\(k\\) (an integer from 1 to 25), the Caesar cipher maps each letter to the letter \\(k\\) positions later in the alphabet, wrapping around from Z to A. Mathematically, if we encode A = 0, B = 1, ..., Z = 25:</p>
        \\[E(x) = (x + k) \\mod 26\\]
        \\[D(y) = (y - k) \\mod 26\\]
        <p>where \\(E\\) is encryption and \\(D\\) is decryption.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">Example: Caesar Cipher with shift 3</div>
    <div class="env-body">
        <p>A \\(\\to\\) D, B \\(\\to\\) E, C \\(\\to\\) F, ..., W \\(\\to\\) Z, X \\(\\to\\) A, Y \\(\\to\\) B, Z \\(\\to\\) C.</p>
        <p>"HELLO" becomes "KHOOR".</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-caesar-cipher"></div>

<h3>Substitution Ciphers</h3>

<p>A Caesar cipher is a special case of a <strong>substitution cipher</strong>, where each letter is replaced by another letter according to a fixed permutation of the alphabet. There are \\(26! \\approx 4 \\times 10^{26}\\) possible substitution ciphers, making brute-force attack impractical. But substitution ciphers are vulnerable to <em>frequency analysis</em>: in English, E is the most common letter (~13%), followed by T, A, O, I, N, S, H, R. By counting letter frequencies in the ciphertext, you can guess the mapping.</p>

<h3>The Pigpen Cipher</h3>

<p>The <strong>pigpen cipher</strong> (also called the Freemason's cipher) replaces letters not with other letters but with geometric symbols derived from a grid pattern. It was used by the Freemasons in the 18th century and remains popular as a puzzle cipher today.</p>

<p>The alphabet is arranged in two grids and two X-shapes:</p>

<pre style="text-align:center;font-family:monospace;color:#8b949e;">
 A|B|C    J.K.L
 -+-+-    .+.+.
 D|E|F    M.N.O
 -+-+-
 G|H|I

     S
    T.U
     V
     W
    X.Y
     Z
</pre>

<p>Each letter is encoded by the shape of the cell it occupies (with a dot added for the second grid and X-shapes). For instance, A is encoded as \\(\\sqcap\\) (the shape around A in the grid), B is \\(\\sqcup\\cap\\), and so on.</p>

<div class="viz-placeholder" data-viz="viz-pigpen-cipher"></div>
`,
            visualizations: [
                {
                    id: 'viz-caesar-cipher',
                    title: 'Caesar Cipher Machine',
                    description: 'Type a message and adjust the shift to encode or decode it. Watch the alphabet wheel rotate as you change the shift.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 560, height: 400, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var shift = 3;
                        var message = 'HELLO WORLD';
                        var mode = 'encode';

                        function caesarChar(ch, s) {
                            var code = ch.charCodeAt(0);
                            if (code >= 65 && code <= 90) {
                                return String.fromCharCode(((code - 65 + s + 26) % 26) + 65);
                            }
                            return ch;
                        }

                        function caesarStr(str, s) {
                            return str.toUpperCase().split('').map(function(c) { return caesarChar(c, s); }).join('');
                        }

                        function draw() {
                            viz.clear();

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Caesar Cipher (Shift ' + shift + ')', w / 2, 24);

                            // Draw alphabet wheels
                            var cx = w / 2;
                            var cy = 160;
                            var outerR = 110;
                            var innerR = 80;

                            for (var i = 0; i < 26; i++) {
                                var angle = (i / 26) * Math.PI * 2 - Math.PI / 2;
                                var letter = String.fromCharCode(65 + i);

                                // Outer ring (plaintext)
                                var ox = cx + Math.cos(angle) * outerR;
                                var oy = cy + Math.sin(angle) * outerR;
                                ctx.fillStyle = viz.colors.blue;
                                ctx.font = 'bold 12px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(letter, ox, oy);

                                // Inner ring (ciphertext, shifted)
                                var shiftedAngle = ((i - shift + 26) % 26 / 26) * Math.PI * 2 - Math.PI / 2;
                                var ix = cx + Math.cos(angle) * innerR;
                                var iy = cy + Math.sin(angle) * innerR;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.font = 'bold 11px -apple-system,sans-serif';
                                ctx.fillText(String.fromCharCode(65 + ((i + shift) % 26)), ix, iy);
                            }

                            // Ring circles
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 0.5;
                            ctx.beginPath(); ctx.arc(cx, cy, outerR + 12, 0, Math.PI * 2); ctx.stroke();
                            ctx.beginPath(); ctx.arc(cx, cy, innerR - 8, 0, Math.PI * 2); ctx.stroke();

                            // Labels
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.fillText('Plain', cx, cy - outerR - 18);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('Cipher', cx, cy);

                            // Message display
                            var msgY = 290;
                            var actualShift = mode === 'encode' ? shift : -shift;
                            var output = caesarStr(message, actualShift);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText(mode === 'encode' ? 'Plaintext:' : 'Ciphertext:', 40, msgY);
                            ctx.fillStyle = viz.colors.blue;
                            ctx.font = 'bold 16px monospace';
                            ctx.fillText(message.toUpperCase(), 40, msgY + 22);

                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText(mode === 'encode' ? 'Ciphertext:' : 'Plaintext:', 40, msgY + 52);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.font = 'bold 16px monospace';
                            ctx.fillText(output, 40, msgY + 74);
                        }

                        VizEngine.createSlider(controls, 'Shift', 1, 25, shift, 1, function(v) {
                            shift = Math.round(v);
                            draw();
                        });

                        // Text input
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:4px;';
                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.value = message;
                        inp.style.cssText = 'width:200px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.82rem;text-transform:uppercase;';
                        inp.addEventListener('input', function() {
                            message = inp.value.toUpperCase();
                            draw();
                        });
                        var lbl = document.createElement('span');
                        lbl.textContent = 'Message:';
                        lbl.style.cssText = 'color:#8b949e;font-size:0.78rem;';
                        inputDiv.appendChild(lbl);
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        VizEngine.createButton(controls, 'Encode', function() {
                            mode = 'encode';
                            draw();
                        });
                        VizEngine.createButton(controls, 'Decode', function() {
                            mode = 'decode';
                            draw();
                        });

                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-pigpen-cipher',
                    title: 'Pigpen Cipher',
                    description: 'Type a message to see it encoded in the Pigpen (Freemason\'s) cipher. Each letter becomes a geometric symbol based on its position in the grid.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 560, height: 400, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var message = 'HELLO';

                        // Pigpen encoding: each letter has shape data
                        // Grid 1: A-I (3x3 grid, no dot)
                        // Grid 2: J-R (3x3 grid, with dot) -- actually standard pigpen uses J-R in dotted grid
                        // But the classic version: grid1 = ABC/DEF/GHI, grid2 = JKL/MNO/PQR
                        // X1: S,T,U,V; X2: W,X,Y,Z
                        // We encode each letter by which walls surround it

                        // Shapes: [top, right, bottom, left, dot]
                        // For grid letters: walls based on position in 3x3
                        // For X letters: diagonal lines

                        function drawPigpenLetter(px, py, ch, size) {
                            var code = ch.charCodeAt(0) - 65;
                            if (code < 0 || code > 25) return;
                            var s = size;
                            var half = s / 2;

                            ctx.strokeStyle = viz.colors.teal;
                            ctx.lineWidth = 2;
                            ctx.fillStyle = viz.colors.teal;

                            if (code < 9) {
                                // Grid 1: A-I, no dot
                                var row = Math.floor(code / 3);
                                var col = code % 3;
                                // top wall if row > 0
                                // bottom wall if row < 2
                                // left wall if col > 0
                                // right wall if col < 2
                                ctx.beginPath();
                                if (row > 0) { ctx.moveTo(px - half, py - half); ctx.lineTo(px + half, py - half); }
                                if (row < 2) { ctx.moveTo(px - half, py + half); ctx.lineTo(px + half, py + half); }
                                if (col > 0) { ctx.moveTo(px - half, py - half); ctx.lineTo(px - half, py + half); }
                                if (col < 2) { ctx.moveTo(px + half, py - half); ctx.lineTo(px + half, py + half); }
                                ctx.stroke();
                            } else if (code < 18) {
                                // Grid 2: J-R, with dot
                                var idx = code - 9;
                                var row2 = Math.floor(idx / 3);
                                var col2 = idx % 3;
                                ctx.beginPath();
                                if (row2 > 0) { ctx.moveTo(px - half, py - half); ctx.lineTo(px + half, py - half); }
                                if (row2 < 2) { ctx.moveTo(px - half, py + half); ctx.lineTo(px + half, py + half); }
                                if (col2 > 0) { ctx.moveTo(px - half, py - half); ctx.lineTo(px - half, py + half); }
                                if (col2 < 2) { ctx.moveTo(px + half, py - half); ctx.lineTo(px + half, py + half); }
                                ctx.stroke();
                                // dot
                                ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
                            } else if (code < 22) {
                                // X1: S, T, U, V (no dot)
                                var xi = code - 18;
                                ctx.beginPath();
                                // S=top, T=right, U=bottom, V=left of X
                                if (xi === 0) { // S: top of X (two lines going up)
                                    ctx.moveTo(px - half, py); ctx.lineTo(px, py - half); ctx.lineTo(px + half, py);
                                } else if (xi === 1) { // T: right of X
                                    ctx.moveTo(px, py - half); ctx.lineTo(px + half, py); ctx.lineTo(px, py + half);
                                } else if (xi === 2) { // U: bottom of X
                                    ctx.moveTo(px - half, py); ctx.lineTo(px, py + half); ctx.lineTo(px + half, py);
                                } else { // V: left of X
                                    ctx.moveTo(px, py - half); ctx.lineTo(px - half, py); ctx.lineTo(px, py + half);
                                }
                                ctx.stroke();
                            } else {
                                // X2: W, X, Y, Z (with dot)
                                var xi2 = code - 22;
                                ctx.beginPath();
                                if (xi2 === 0) {
                                    ctx.moveTo(px - half, py); ctx.lineTo(px, py - half); ctx.lineTo(px + half, py);
                                } else if (xi2 === 1) {
                                    ctx.moveTo(px, py - half); ctx.lineTo(px + half, py); ctx.lineTo(px, py + half);
                                } else if (xi2 === 2) {
                                    ctx.moveTo(px - half, py); ctx.lineTo(px, py + half); ctx.lineTo(px + half, py);
                                } else {
                                    ctx.moveTo(px, py - half); ctx.lineTo(px - half, py); ctx.lineTo(px, py + half);
                                }
                                ctx.stroke();
                                ctx.beginPath(); ctx.arc(px, py, 3, 0, Math.PI * 2); ctx.fill();
                            }
                        }

                        function draw() {
                            viz.clear();

                            // Title
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Pigpen Cipher', w / 2, 24);

                            // Show the key
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Key:', w / 2, 48);

                            var keyStartX = 40;
                            var keyY = 70;
                            var keySize = 18;
                            var keyGap = 36;
                            for (var ki = 0; ki < 26; ki++) {
                                var kx = keyStartX + (ki % 13) * keyGap + keyGap / 2;
                                var ky = keyY + Math.floor(ki / 13) * 50;
                                drawPigpenLetter(kx, ky, String.fromCharCode(65 + ki), keySize);
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(String.fromCharCode(65 + ki), kx, ky + keySize / 2 + 12);
                            }

                            // Encoded message
                            var msgY = 190;
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '13px -apple-system,sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Plaintext: ' + message.toUpperCase(), 40, msgY);

                            var encY = msgY + 30;
                            ctx.fillText('Encoded:', 40, encY);

                            var encSize = 28;
                            var encGap = 40;
                            var letters = message.toUpperCase().replace(/[^A-Z]/g, '');
                            var charsPerRow = Math.floor((w - 80) / encGap);
                            for (var ei = 0; ei < letters.length; ei++) {
                                var ex = 60 + (ei % charsPerRow) * encGap;
                                var ey = encY + 30 + Math.floor(ei / charsPerRow) * 55;
                                drawPigpenLetter(ex, ey, letters[ei], encSize);
                                // Show letter below
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '9px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(letters[ei], ex, ey + encSize / 2 + 12);
                            }
                        }

                        // Text input
                        var inputDiv = document.createElement('div');
                        inputDiv.style.cssText = 'display:flex;gap:8px;align-items:center;';
                        var inp = document.createElement('input');
                        inp.type = 'text';
                        inp.value = message;
                        inp.style.cssText = 'width:200px;padding:3px 6px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.82rem;text-transform:uppercase;';
                        inp.addEventListener('input', function() {
                            message = inp.value.toUpperCase();
                            draw();
                        });
                        var lbl = document.createElement('span');
                        lbl.textContent = 'Message:';
                        lbl.style.cssText = 'color:#8b949e;font-size:0.78rem;';
                        inputDiv.appendChild(lbl);
                        inputDiv.appendChild(inp);
                        controls.appendChild(inputDiv);

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Decode the Caesar cipher message "KHOOR ZRUOG" with shift 3.',
                    hint: 'To decode, shift each letter backward by 3. K \\(\\to\\) H, H \\(\\to\\) E, ...',
                    solution: 'Shifting each letter back by 3: K\\(\\to\\)H, H\\(\\to\\)E, O\\(\\to\\)L, O\\(\\to\\)L, R\\(\\to\\)O, Z\\(\\to\\)W, R\\(\\to\\)O, U\\(\\to\\)R, O\\(\\to\\)L, G\\(\\to\\)D. The message is "HELLO WORLD".'
                },
                {
                    question: 'The most common letter in English is E (~13%). You intercept a Caesar-cipher message and find that the most common letter is H. What is the likely shift?',
                    hint: 'If E was shifted to become H, how many positions apart are E and H?',
                    solution: 'E is the 5th letter (index 4), H is the 8th letter (index 7). The shift is \\(7 - 4 = 3\\). So the cipher likely uses shift 3. To decode, shift each letter backward by 3.'
                }
            ]
        },

        // ─────────────────────────────────────────────
        // Section 6: Puzzle Gallery & Bridge
        // ─────────────────────────────────────────────
        {
            id: 'sec-bridge',
            title: 'Puzzle Gallery & Beyond',
            content: `
<h2>Puzzle Gallery</h2>

<p>Now it is your turn. Here are five classic cryptarithmetic puzzles of varying difficulty. Each has a unique solution. Use carry analysis, parity, modular arithmetic, and elimination to crack them.</p>

<div class="viz-placeholder" data-viz="viz-puzzle-gallery"></div>

<h2>Connections and Beyond</h2>

<p>Cryptarithmetic and codes connect to many deep ideas in mathematics and computer science:</p>

<ul>
    <li><strong>Constraint satisfaction.</strong> Cryptarithmetic puzzles are constraint satisfaction problems (CSPs). The same algorithms that solve Sudoku (Chapter 19) can solve cryptarithmetic: propagate constraints, then search.</li>
    <li><strong>Number theory.</strong> Carry analysis is really about the structure of positional notation. Modular arithmetic gives us shortcuts. The connection between digit sums and divisibility rules (mod 9, mod 3, mod 11) is a fundamental fact of number theory.</li>
    <li><strong>Cryptography.</strong> The Caesar cipher is the simplest example of a substitution cipher. Modern cryptography uses much more sophisticated mathematics (prime numbers, elliptic curves, lattices), but the core idea, transforming information so that only the intended recipient can understand it, is the same.</li>
    <li><strong>Frequency analysis.</strong> Breaking substitution ciphers by counting letter frequencies is an early example of <em>statistical inference</em>: using patterns in data to deduce hidden structure.</li>
    <li><strong>Complexity.</strong> Cryptarithmetic with an arbitrary number of letters is NP-complete. This means there is no known efficient algorithm to solve all instances, and most computer scientists believe none exists. Yet specific puzzles with good structure can be solved elegantly by hand.</li>
</ul>

<div class="env-block remark">
    <div class="env-title">Looking Ahead</div>
    <div class="env-body">
        <p>The logical deduction techniques we used here, working column by column, tracking constraints, eliminating impossibilities, are the same techniques that power <em>constraint propagation</em> in artificial intelligence. Modern SAT solvers and CSP solvers automate exactly this kind of reasoning, at a scale that would be impossible for humans.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-puzzle-gallery',
                    title: 'Classic Cryptarithmetic Puzzles',
                    description: 'Five classic puzzles to solve. Select a puzzle, assign digits to letters, and check your answer.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { width: 560, height: 420, scale: 1, originX: 0, originY: 0 });
                        var ctx = viz.ctx;
                        var w = viz.width, h = viz.height;

                        var puzzles = [
                            { w1: 'EAT', w2: 'THAT', wr: 'APPLE', sol: {A:8,P:1,L:0,E:9,T:3,H:6} },
                            { w1: 'CROSS', w2: 'ROADS', wr: 'DANGER', sol: {C:9,R:6,O:2,S:3,A:5,D:1,N:8,G:7,E:4} },
                            { w1: 'BASE', w2: 'BALL', wr: 'GAMES', sol: {B:7,A:4,S:8,E:3,L:5,G:1,M:2,_skip: true} },
                            { w1: 'TO', w2: 'GO', wr: 'OUT', sol: {T:2,O:1,G:8,U:0} },
                            { w1: 'NO', w2: 'GUN', wr: 'HUNT', sol: {N:7,O:8,G:3,U:4,H:1,T:2} }
                        ];

                        var currentPuzzle = 0;
                        var assignment = {};
                        var selectedLetter = 0;
                        var puzzleLetters = [];

                        function loadPuzzle(idx) {
                            var p = puzzles[idx];
                            assignment = {};
                            var seen = {};
                            puzzleLetters = [];
                            (p.w1 + p.w2 + p.wr).split('').forEach(function(c) {
                                if (!seen[c]) { seen[c] = true; puzzleLetters.push(c); assignment[c] = -1; }
                            });
                            selectedLetter = 0;
                        }

                        function digitUsed(d) {
                            for (var k in assignment) {
                                if (assignment[k] === d) return true;
                            }
                            return false;
                        }

                        function wordVal(word) {
                            var v = 0;
                            for (var i = 0; i < word.length; i++) {
                                if (assignment[word[i]] < 0) return -1;
                                v = v * 10 + assignment[word[i]];
                            }
                            return v;
                        }

                        function checkSolved() {
                            var p = puzzles[currentPuzzle];
                            var v1 = wordVal(p.w1);
                            var v2 = wordVal(p.w2);
                            var vr = wordVal(p.wr);
                            if (v1 < 0 || v2 < 0 || vr < 0) return false;
                            return v1 + v2 === vr;
                        }

                        function draw() {
                            viz.clear();
                            var p = puzzles[currentPuzzle];

                            // Puzzle name
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 14px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Puzzle ' + (currentPuzzle + 1) + ' of ' + puzzles.length, w / 2, 24);

                            // Show puzzle
                            ctx.font = 'bold 22px monospace';
                            ctx.textAlign = 'right';
                            var px = w / 2 + 70;
                            ctx.fillStyle = viz.colors.blue;
                            ctx.fillText(p.w1, px, 60);
                            ctx.fillStyle = viz.colors.orange;
                            ctx.fillText('+  ' + p.w2, px, 88);
                            ctx.strokeStyle = viz.colors.white;
                            ctx.lineWidth = 2;
                            ctx.beginPath(); ctx.moveTo(px - 160, 98); ctx.lineTo(px + 10, 98); ctx.stroke();
                            ctx.fillStyle = viz.colors.green;
                            ctx.fillText(p.wr, px, 122);

                            // Letter selector
                            var selY = 150;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Select letter:', 60, selY);

                            for (var si = 0; si < puzzleLetters.length; si++) {
                                var bw = 28;
                                var sx = 120 + si * (bw + 4);
                                var isSelected = (si === selectedLetter);
                                ctx.fillStyle = isSelected ? viz.colors.yellow + '33' : '#1a1a30';
                                ctx.fillRect(sx, selY - 12, bw, bw);
                                ctx.strokeStyle = isSelected ? viz.colors.yellow : viz.colors.axis;
                                ctx.lineWidth = isSelected ? 2 : 1;
                                ctx.strokeRect(sx, selY - 12, bw, bw);
                                ctx.fillStyle = isSelected ? viz.colors.yellow : viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(puzzleLetters[si], sx + bw/2, selY + 2);

                                // Show assigned digit
                                if (assignment[puzzleLetters[si]] >= 0) {
                                    ctx.fillStyle = viz.colors.teal;
                                    ctx.font = '10px -apple-system,sans-serif';
                                    ctx.fillText(assignment[puzzleLetters[si]].toString(), sx + bw/2, selY + bw - 6);
                                }
                            }

                            // Digit buttons
                            var digY = selY + 40;
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Assign digit:', 60, digY);

                            for (var di = 0; di <= 9; di++) {
                                var dx = 120 + di * 32;
                                var used = digitUsed(di);
                                var isCurrent = (puzzleLetters[selectedLetter] && assignment[puzzleLetters[selectedLetter]] === di);
                                ctx.fillStyle = isCurrent ? viz.colors.green + '44' : (used ? '#2a1a1a' : '#1a1a30');
                                ctx.fillRect(dx, digY - 12, 24, 28);
                                ctx.strokeStyle = isCurrent ? viz.colors.green : (used ? viz.colors.red + '66' : viz.colors.axis);
                                ctx.lineWidth = 1;
                                ctx.strokeRect(dx, digY - 12, 24, 28);
                                ctx.fillStyle = used ? viz.colors.red + '88' : viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                                ctx.fillText(di.toString(), dx + 12, digY + 2);
                            }

                            // Result
                            var resY = digY + 40;
                            if (checkSolved()) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Correct! ' + wordVal(p.w1) + ' + ' + wordVal(p.w2) + ' = ' + wordVal(p.wr), w / 2, resY);
                            } else {
                                var v1 = wordVal(p.w1);
                                var v2 = wordVal(p.w2);
                                var vr = wordVal(p.wr);
                                if (v1 > 0 && v2 > 0 && vr > 0) {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(v1 + ' + ' + v2 + ' = ' + (v1 + v2) + ' (need ' + vr + ')', w / 2, resY);
                                }
                            }

                            // Hint
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Remember: different letters = different digits, no leading zeros', w / 2, h - 20);
                        }

                        // Click handling
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var selY = 150;

                            // Letter selector
                            for (var si = 0; si < puzzleLetters.length; si++) {
                                var bw = 28;
                                var sx = 120 + si * (bw + 4);
                                if (mx >= sx && mx <= sx + bw && my >= selY - 12 && my <= selY + bw - 12) {
                                    selectedLetter = si;
                                    draw();
                                    return;
                                }
                            }

                            // Digit buttons
                            var digY = selY + 40;
                            for (var di = 0; di <= 9; di++) {
                                var dx = 120 + di * 32;
                                if (mx >= dx && mx <= dx + 24 && my >= digY - 12 && my <= digY + 16) {
                                    var letter = puzzleLetters[selectedLetter];
                                    if (!letter) return;
                                    if (assignment[letter] === di) {
                                        assignment[letter] = -1;
                                    } else {
                                        for (var k in assignment) {
                                            if (assignment[k] === di) assignment[k] = -1;
                                        }
                                        assignment[letter] = di;
                                    }
                                    draw();
                                    return;
                                }
                            }
                        });

                        // Puzzle navigation
                        VizEngine.createButton(controls, 'Prev Puzzle', function() {
                            currentPuzzle = (currentPuzzle - 1 + puzzles.length) % puzzles.length;
                            loadPuzzle(currentPuzzle);
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next Puzzle', function() {
                            currentPuzzle = (currentPuzzle + 1) % puzzles.length;
                            loadPuzzle(currentPuzzle);
                            draw();
                        });
                        VizEngine.createButton(controls, 'Show Solution', function() {
                            var sol = puzzles[currentPuzzle].sol;
                            for (var k in assignment) {
                                if (sol[k] !== undefined) assignment[k] = sol[k];
                            }
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            loadPuzzle(currentPuzzle);
                            draw();
                        });

                        loadPuzzle(0);
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Solve: TO + GO = OUT.',
                    hint: 'This is a small puzzle with only 4 distinct letters. The result OUT is 3 digits, so there must be a carry from the tens column. Start by noting that O + O = T + 10*carry in the tens column.',
                    solution: 'Units: O + O = T + 10c_1, so 2O = T + 10c_1. Tens: T + G + c_1 = U + 10c_2. Hundreds: c_2 = O. Since O is a leading digit, O >= 1. Also c_2 is 0 or 1, so O = 1 (if c_2=1) or there is no hundreds digit. But OUT is 3 digits, so c_2 >= 1, meaning O >= 1 and c_2 = O. If O = 1, c_2 = 1. Then 2*1 = T + 10*c_1; if c_1 = 0, T = 2. Tens: 2 + G + 0 = U + 10. So G + 2 = U + 10, meaning G = U + 8. With G <= 9, U <= 1. But O = 1, so U = 0, G = 8. Check: 21 + 81 = 102. OUT = 102. O=1, U=0, T=2, G=8. All distinct. Correct!'
                },
                {
                    question: 'In the puzzle NO + GUN = HUNT, determine the value of H immediately, without solving the rest of the puzzle.',
                    hint: 'NO is a 2-digit number and GUN is a 3-digit number. What is the maximum possible value of their sum?',
                    solution: 'NO is at most 98 (since digits must be distinct and N cannot be 0 as a leading digit, but could be 9, O could be 8). GUN is at most 987. So NO + GUN is at most about 1085, which is a 4-digit number starting with 1. The minimum 4-digit number is 1000. So HUNT starts with H = 1.'
                }
            ]
        }
    ]
});
})();
