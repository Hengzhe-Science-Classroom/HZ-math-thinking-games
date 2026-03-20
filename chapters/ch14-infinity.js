// === Chapter 14: Infinity & Paradoxes ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch14-infinity',
    number: 14,
    title: 'Infinity & Paradoxes',
    subtitle: 'When mathematics gets mind-bending',
    sections: [
        // ================================================================
        // SECTION 0: Motivation — What Is Infinity?
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'What Is Infinity?',
            content: `
<h2>What Is Infinity?</h2>

<div class="env-block intuition">
    <div class="env-title">A Question to Start</div>
    <div class="env-body">
        <p>What is the biggest number? Whatever number you name, you can always add 1 to get something bigger. So there is no biggest number. But then what <em>is</em> infinity? Is it a number? A concept? A place where numbers run off to?</p>
    </div>
</div>

<p>Infinity is one of the most fascinating and dangerous ideas in mathematics. For centuries, mathematicians avoided it, treating it as a source of confusion and contradiction. The ancient Greeks knew about it but distrusted it deeply. It was not until the late 1800s that Georg Cantor tamed infinity and turned it into a precise mathematical tool.</p>

<p>In this chapter, we will explore the surprising properties of infinity through four lenses:</p>

<ol>
    <li><strong>Hilbert's Hotel</strong>, where a fully occupied hotel with infinitely many rooms can always accommodate more guests.</li>
    <li><strong>Cantor's diagonal argument</strong>, which proves that some infinities are genuinely bigger than others.</li>
    <li><strong>Zeno's paradoxes</strong>, where infinite sums resolve seemingly impossible situations.</li>
    <li><strong>Fractals</strong>, where infinite repetition creates shapes of extraordinary beauty and complexity.</li>
</ol>

<p>Along the way, we will encounter some of the most famous paradoxes in all of logic: the barber paradox, Russell's paradox, and the liar paradox.</p>

<div class="env-block remark">
    <div class="env-title">A Warning</div>
    <div class="env-body">
        <p>Infinity does not obey the usual rules. Adding 1 to infinity gives infinity. Doubling infinity gives infinity. Even infinity minus infinity is undefined. If your intuition protests, good. That discomfort is the beginning of real mathematical understanding.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: []
        },

        // ================================================================
        // SECTION 1: Hilbert's Hotel
        // ================================================================
        {
            id: 'sec-hilbert',
            title: "Hilbert's Hotel",
            content: `
<h2>Hilbert's Hotel</h2>

<p>The German mathematician David Hilbert proposed a famous thought experiment to illustrate how infinity behaves differently from any finite number.</p>

<div class="env-block definition">
    <div class="env-title">Hilbert's Grand Hotel</div>
    <div class="env-body">
        <p>Imagine a hotel with infinitely many rooms, numbered 1, 2, 3, 4, .... Every single room is occupied. A new guest arrives. Can the hotel accommodate them?</p>
    </div>
</div>

<p>With a finite hotel, the answer is obviously no. But with infinitely many rooms, there is a clever trick:</p>

<div class="env-block example">
    <div class="env-title">One New Guest</div>
    <div class="env-body">
        <p>Ask every guest to move from room \\(n\\) to room \\(n + 1\\). The guest in room 1 moves to room 2, room 2 moves to room 3, and so on. Every existing guest still has a room, and room 1 is now free for the new arrival!</p>
    </div>
</div>

<p>But it gets wilder. What if <em>infinitely many</em> new guests arrive?</p>

<div class="env-block example">
    <div class="env-title">Infinitely Many New Guests</div>
    <div class="env-body">
        <p>Ask every current guest to move from room \\(n\\) to room \\(2n\\). Now the guest in room 1 goes to room 2, room 2 goes to room 4, room 3 goes to room 6, and so on. All the odd-numbered rooms (1, 3, 5, 7, ...) are now empty, and there are infinitely many of them, one for each new guest!</p>
    </div>
</div>

<div class="env-block intuition">
    <div class="env-title">The Key Insight</div>
    <div class="env-body">
        <p>Infinity plus one equals infinity. Infinity plus infinity equals infinity. The set of even numbers is the same "size" as the set of all natural numbers. This is deeply counterintuitive, but it is logically airtight. The trick is that we can set up a <strong>one-to-one correspondence</strong> (a bijection) between the two sets.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-hilbert-hotel"></div>
`,
            visualizations: [
                {
                    id: 'viz-hilbert-hotel',
                    title: "Hilbert's Hotel",
                    description: 'Watch the hotel accommodate new guests by shifting everyone. First one new guest, then infinitely many.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var numRooms = 12;
                        var roomW = 40, roomH = 50;
                        var gap = 4;
                        var baseY = h / 2 - roomH / 2;
                        var scrollX = 0;
                        var phase = 'full'; // 'full', 'shift-one', 'shift-inf'
                        var animT = 0;
                        var animDuration = 1500;
                        var animStart = 0;

                        // Guest colors
                        var guestColors = [];
                        for (var i = 0; i < numRooms + 2; i++) {
                            var hue = (i * 37) % 360;
                            guestColors.push('hsl(' + hue + ',60%,55%)');
                        }

                        function getRoomX(idx) {
                            return 30 + idx * (roomW + gap) - scrollX;
                        }

                        function drawRoom(x, y, idx, guestIdx, highlight) {
                            // Room
                            ctx.fillStyle = highlight ? '#2a2a5a' : '#1a1a40';
                            ctx.strokeStyle = highlight ? viz.colors.green : viz.colors.axis;
                            ctx.lineWidth = highlight ? 2 : 1;
                            ctx.fillRect(x, y, roomW, roomH);
                            ctx.strokeRect(x, y, roomW, roomH);

                            // Room number
                            ctx.fillStyle = viz.colors.text;
                            ctx.font = '10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText('#' + (idx + 1), x + roomW / 2, y + 2);

                            // Guest (circle person)
                            if (guestIdx >= 0) {
                                var cx = x + roomW / 2;
                                var cy = y + roomH / 2 + 5;
                                ctx.fillStyle = guestColors[guestIdx % guestColors.length];
                                ctx.beginPath();
                                ctx.arc(cx, cy - 6, 8, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillRect(cx - 5, cy + 2, 10, 12);
                            }
                        }

                        function drawNewGuest(x, y, label) {
                            ctx.fillStyle = viz.colors.green;
                            ctx.beginPath();
                            ctx.arc(x, y - 6, 8, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.fillRect(x - 5, y + 2, 10, 12);
                            ctx.fillStyle = viz.colors.green;
                            ctx.font = 'bold 10px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText(label, x, y - 18);
                        }

                        VizEngine.createButton(controls, 'Full Hotel', function() {
                            phase = 'full'; animStart = 0; scrollX = 0;
                        });

                        VizEngine.createButton(controls, '+1 Guest (shift)', function() {
                            phase = 'shift-one'; animStart = 0;
                        });

                        VizEngine.createButton(controls, '+Infinity Guests', function() {
                            phase = 'shift-inf'; animStart = 0;
                        });

                        viz.animate(function(t) {
                            if (animStart === 0) animStart = t;
                            animT = Math.min(1, (t - animStart) / animDuration);
                            var eased = animT < 0.5 ? 2 * animT * animT : 1 - Math.pow(-2 * animT + 2, 2) / 2;

                            viz.clear();

                            // Title
                            var title = 'Hilbert\'s Grand Hotel';
                            if (phase === 'shift-one') title += ' — Making Room for One';
                            if (phase === 'shift-inf') title += ' — Making Room for Infinitely Many';
                            viz.screenText(title, w / 2, 20, viz.colors.white, 14);

                            // Status
                            var status = '';
                            if (phase === 'full') status = 'All rooms occupied. NO VACANCY.';
                            if (phase === 'shift-one') status = 'Everyone moves: room n -> room n+1. Room 1 is now free!';
                            if (phase === 'shift-inf') status = 'Everyone moves: room n -> room 2n. All odd rooms are free!';
                            viz.screenText(status, w / 2, h - 25, viz.colors.teal, 12);

                            // Draw rooms
                            for (var i = 0; i < numRooms; i++) {
                                var rx = getRoomX(i);
                                if (rx > w + roomW || rx < -roomW) continue;

                                var guestIdx = -1;
                                var highlight = false;

                                if (phase === 'full') {
                                    guestIdx = i;
                                } else if (phase === 'shift-one') {
                                    // Guest i was in room i, moves to room i+1
                                    // So room i now contains guest (i-1) after shift
                                    if (i === 0) {
                                        highlight = true;
                                        // New guest slides in
                                    } else {
                                        guestIdx = i - 1;
                                    }
                                } else if (phase === 'shift-inf') {
                                    // room n gets guest from original room ceil(n/2) if n is even
                                    // odd rooms are free
                                    if (i % 2 === 1) {
                                        // even-indexed (0-based) = odd room numbers -> occupied by guest floor(i/2)
                                        guestIdx = Math.floor(i / 2);
                                    } else {
                                        highlight = true; // free odd room
                                    }
                                }

                                // Animate: lerp from old position to new
                                var drawX = rx;
                                if (phase === 'shift-one' && i > 0 && eased < 1) {
                                    var oldRx = getRoomX(i - 1);
                                    // guest slides from old room to new room
                                    // Room itself stays, but guest animates
                                    drawRoom(rx, baseY, i, -1, highlight);
                                    // Draw guest sliding
                                    var fromX = oldRx + roomW / 2;
                                    var toX = rx + roomW / 2;
                                    var gx = fromX + (toX - fromX) * eased;
                                    var gy = baseY + roomH / 2 + 5;
                                    ctx.fillStyle = guestColors[(i - 1) % guestColors.length];
                                    ctx.beginPath();
                                    ctx.arc(gx, gy - 6, 8, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillRect(gx - 5, gy + 2, 10, 12);
                                    continue;
                                }

                                if (phase === 'shift-inf' && guestIdx >= 0 && eased < 1) {
                                    var origRoom = guestIdx;
                                    var oldRx2 = getRoomX(origRoom);
                                    drawRoom(rx, baseY, i, -1, highlight);
                                    var fromX2 = oldRx2 + roomW / 2;
                                    var toX2 = rx + roomW / 2;
                                    var gx2 = fromX2 + (toX2 - fromX2) * eased;
                                    var gy2 = baseY + roomH / 2 + 5;
                                    ctx.fillStyle = guestColors[guestIdx % guestColors.length];
                                    ctx.beginPath();
                                    ctx.arc(gx2, gy2 - 6, 8, 0, Math.PI * 2);
                                    ctx.fill();
                                    ctx.fillRect(gx2 - 5, gy2 + 2, 10, 12);
                                    continue;
                                }

                                drawRoom(rx, baseY, i, guestIdx, highlight);
                            }

                            // Draw new guest arriving for shift-one
                            if (phase === 'shift-one') {
                                var newX = getRoomX(0) + roomW / 2;
                                var arriveY = baseY - 40;
                                var targetY = baseY + roomH / 2 + 5;
                                var ny = arriveY + (targetY - arriveY) * eased;
                                drawNewGuest(newX, ny, 'NEW');
                            }

                            // Draw new guests for shift-inf (odd rooms = even indices 0-based)
                            if (phase === 'shift-inf' && eased >= 0.7) {
                                var fadeIn = Math.min(1, (eased - 0.7) / 0.3);
                                ctx.globalAlpha = fadeIn;
                                for (var j = 0; j < numRooms; j += 2) {
                                    var nrx = getRoomX(j) + roomW / 2;
                                    drawNewGuest(nrx, baseY + roomH / 2 + 5, 'New ' + (j / 2 + 1));
                                }
                                ctx.globalAlpha = 1;
                            }

                            // Dots indicating infinity
                            viz.screenText('...', getRoomX(numRooms) + 10, baseY + roomH / 2, viz.colors.white, 20);

                            // Room number labels along bottom
                            viz.screenText('Room:', 12, baseY + roomH + 16, viz.colors.text, 10, 'left');
                            for (var k = 0; k < numRooms; k++) {
                                var lx = getRoomX(k) + roomW / 2;
                                if (lx > 0 && lx < w) {
                                    viz.screenText(String(k + 1), lx, baseY + roomH + 16, viz.colors.text, 10);
                                }
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "A countably infinite bus (with passengers numbered 1, 2, 3, ...) arrives at Hilbert's fully occupied hotel. Describe how to accommodate all of them.",
                    hint: 'Move existing guests to even-numbered rooms. Where do the bus passengers go?',
                    solution: 'Move every current guest from room \\(n\\) to room \\(2n\\). This frees all odd-numbered rooms 1, 3, 5, 7, .... Assign bus passenger \\(k\\) to room \\(2k - 1\\). Everyone has a room.'
                },
            ]
        },

        // ================================================================
        // SECTION 2: Some Infinities Are Bigger
        // ================================================================
        {
            id: 'sec-bigger',
            title: 'Some Infinities Are Bigger',
            content: `
<h2>Some Infinities Are Bigger Than Others</h2>

<div class="env-block intuition">
    <div class="env-title">The Shocking Discovery</div>
    <div class="env-body">
        <p>In 1874, Georg Cantor proved something that stunned the mathematical world: the set of real numbers between 0 and 1 is <strong>strictly larger</strong> than the set of all natural numbers. Infinity comes in different sizes.</p>
    </div>
</div>

<h3>Counting Infinite Sets</h3>

<p>How do we compare the sizes of infinite sets? We cannot just count the elements (there are infinitely many!). Instead, we use <strong>one-to-one correspondences</strong> (bijections).</p>

<div class="env-block definition">
    <div class="env-title">Definition (Same Cardinality)</div>
    <div class="env-body">
        <p>Two sets \\(A\\) and \\(B\\) have the <strong>same cardinality</strong> (same "size") if there is a bijection \\(f: A \\to B\\), that is, a function that pairs every element of \\(A\\) with exactly one element of \\(B\\) and vice versa.</p>
    </div>
</div>

<p>By this definition, the natural numbers \\(\\{1, 2, 3, \\ldots\\}\\) and the even numbers \\(\\{2, 4, 6, \\ldots\\}\\) have the same cardinality, via the bijection \\(n \\mapsto 2n\\). This confirms what Hilbert's Hotel showed us.</p>

<h3>Cantor's Diagonal Argument</h3>

<p>Now, can we list <em>all</em> real numbers between 0 and 1? Cantor proved that we cannot, using one of the most elegant arguments in all of mathematics.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Cantor, 1891)</div>
    <div class="env-body">
        <p>The set of real numbers in \\([0, 1]\\) is <strong>uncountable</strong>: there is no bijection between \\(\\mathbb{N}\\) and \\([0, 1]\\).</p>
    </div>
</div>

<div class="env-block proof">
    <div class="env-title">Proof (by contradiction)</div>
    <div class="env-body">
        <p>Suppose, for contradiction, that we <em>could</em> list all real numbers between 0 and 1:</p>
        \\[
        r_1 = 0.d_{11}d_{12}d_{13}\\ldots \\\\
        r_2 = 0.d_{21}d_{22}d_{23}\\ldots \\\\
        r_3 = 0.d_{31}d_{32}d_{33}\\ldots \\\\
        \\vdots
        \\]
        <p>Now construct a new number \\(x = 0.x_1 x_2 x_3 \\ldots\\) where each digit \\(x_i\\) differs from \\(d_{ii}\\) (the \\(i\\)-th diagonal digit). For example, if \\(d_{ii} = 5\\), set \\(x_i = 6\\); otherwise set \\(x_i = 5\\).</p>
        <p>Then \\(x\\) is a real number in \\([0,1]\\), but \\(x \\neq r_i\\) for any \\(i\\) (they differ at the \\(i\\)-th decimal place). So our list missed \\(x\\). Contradiction.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">What This Means</div>
    <div class="env-body">
        <p>The "infinity" of real numbers (denoted \\(\\mathfrak{c}\\), the cardinality of the continuum) is strictly greater than the "infinity" of natural numbers (denoted \\(\\aleph_0\\), "aleph-null"). There is a whole hierarchy of infinities: \\(\\aleph_0 < \\mathfrak{c} < \\ldots\\)</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-cantor-diagonal"></div>
`,
            visualizations: [
                {
                    id: 'viz-cantor-diagonal',
                    title: "Cantor's Diagonal Argument",
                    description: 'Try to list all decimals between 0 and 1. The diagonal argument always finds one you missed.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var gridSize = 8;
                        var cellSize = 32;
                        var startX = 100;
                        var startY = 60;

                        // Generate random decimal digits
                        var digits = [];
                        function regenerate() {
                            digits = [];
                            for (var i = 0; i < gridSize; i++) {
                                var row = [];
                                for (var j = 0; j < gridSize; j++) {
                                    row.push(Math.floor(Math.random() * 10));
                                }
                                digits.push(row);
                            }
                        }
                        regenerate();

                        var highlightRow = -1;
                        var showDiagonal = false;
                        var showNew = false;
                        var animStep = 0;
                        var animTimer = null;

                        VizEngine.createButton(controls, 'New List', function() {
                            regenerate();
                            highlightRow = -1;
                            showDiagonal = false;
                            showNew = false;
                            animStep = 0;
                            if (animTimer) clearInterval(animTimer);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Run Diagonal', function() {
                            showDiagonal = false;
                            showNew = false;
                            animStep = 0;
                            highlightRow = -1;
                            if (animTimer) clearInterval(animTimer);
                            animTimer = setInterval(function() {
                                animStep++;
                                if (animStep <= gridSize) {
                                    highlightRow = animStep - 1;
                                } else if (animStep === gridSize + 1) {
                                    showDiagonal = true;
                                } else if (animStep === gridSize + 2) {
                                    showNew = true;
                                    clearInterval(animTimer);
                                    animTimer = null;
                                }
                                draw();
                            }, 400);
                        });

                        function getNewDigit(d) {
                            return d === 5 ? 6 : 5;
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText("Cantor's Diagonal Argument", w / 2, 25, viz.colors.white, 15);
                            viz.screenText('Suppose we list ALL decimals in [0,1]...', w / 2, 45, viz.colors.text, 11);

                            // Row labels
                            for (var i = 0; i < gridSize; i++) {
                                var ry = startY + i * cellSize;
                                ctx.fillStyle = (i === highlightRow) ? viz.colors.orange : viz.colors.text;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('r' + (i + 1) + ' = 0.', startX - 8, ry + cellSize / 2);
                            }

                            // Grid of digits
                            for (var r = 0; r < gridSize; r++) {
                                for (var c = 0; c < gridSize; c++) {
                                    var cx = startX + c * cellSize;
                                    var cy = startY + r * cellSize;

                                    var isDiag = (r === c);

                                    // Background
                                    if (isDiag && (showDiagonal || (highlightRow >= r))) {
                                        ctx.fillStyle = showNew ? viz.colors.red + '44' : viz.colors.orange + '44';
                                        ctx.fillRect(cx, cy, cellSize, cellSize);
                                    }
                                    if (r === highlightRow && !showDiagonal) {
                                        ctx.fillStyle = viz.colors.orange + '22';
                                        ctx.fillRect(cx, cy, cellSize, cellSize);
                                    }

                                    // Cell border
                                    ctx.strokeStyle = viz.colors.grid;
                                    ctx.lineWidth = 0.5;
                                    ctx.strokeRect(cx, cy, cellSize, cellSize);

                                    // Digit
                                    var color = viz.colors.text;
                                    if (isDiag && showDiagonal) color = viz.colors.red;
                                    if (isDiag && highlightRow >= r && !showDiagonal) color = viz.colors.orange;

                                    ctx.fillStyle = color;
                                    ctx.font = isDiag && (showDiagonal || highlightRow >= r) ? 'bold 14px -apple-system,sans-serif' : '13px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(String(digits[r][c]), cx + cellSize / 2, cy + cellSize / 2);
                                }
                            }

                            // Show the new number
                            if (showNew) {
                                var newY = startY + gridSize * cellSize + 20;
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'right';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('x = 0.', startX - 8, newY + cellSize / 2);

                                for (var d = 0; d < gridSize; d++) {
                                    var nx = startX + d * cellSize;
                                    var newDig = getNewDigit(digits[d][d]);

                                    ctx.fillStyle = viz.colors.green + '44';
                                    ctx.fillRect(nx, newY, cellSize, cellSize);
                                    ctx.strokeStyle = viz.colors.green;
                                    ctx.lineWidth = 1.5;
                                    ctx.strokeRect(nx, newY, cellSize, cellSize);

                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 14px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(String(newDig), nx + cellSize / 2, newY + cellSize / 2);
                                }

                                viz.screenText('This number is NOT in the list!', w / 2, newY + cellSize + 20, viz.colors.green, 13);
                                viz.screenText('It differs from r_i at the i-th digit.', w / 2, newY + cellSize + 38, viz.colors.green, 11);
                            }
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Is the set of all fractions (rational numbers) countable or uncountable?',
                    hint: 'Try to arrange all positive fractions in a grid where row = numerator, column = denominator, then trace a zigzag path.',
                    solution: 'The rationals are countable. Arrange them in a grid with \\(p/q\\) at position \\((p, q)\\). Zigzag along diagonals (Cantor\'s pairing): \\(1/1, 1/2, 2/1, 3/1, 2/2, 1/3, \\ldots\\), skipping duplicates. This gives a bijection with \\(\\mathbb{N}\\).'
                },
                {
                    question: "In Cantor's diagonal argument, why do we avoid using 0 and 9 as replacement digits?",
                    hint: 'Think about different decimal representations of the same number, like 0.4999... = 0.5000...',
                    solution: 'Because \\(0.4999\\ldots = 0.5000\\ldots\\). If we used 0 or 9, our constructed number might equal a number already on the list under a different decimal representation. Using only digits like 5 and 6 avoids this issue entirely.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Zeno's Paradoxes
        // ================================================================
        {
            id: 'sec-zeno',
            title: "Zeno's Paradoxes",
            content: `
<h2>Zeno's Paradoxes</h2>

<div class="env-block intuition">
    <div class="env-title">2,500 Years of Confusion</div>
    <div class="env-body">
        <p>The ancient Greek philosopher Zeno of Elea (c. 490 BC) proposed several paradoxes about motion. His most famous is the race between Achilles and the tortoise, which seems to prove that motion is impossible.</p>
    </div>
</div>

<h3>Achilles and the Tortoise</h3>

<div class="env-block example">
    <div class="env-title">The Paradox</div>
    <div class="env-body">
        <p>Achilles (the fastest runner in Greek mythology) races a tortoise. The tortoise gets a 100-meter head start. Achilles runs at 10 m/s, the tortoise at 1 m/s.</p>
        <ol>
            <li>Achilles runs 100m to where the tortoise was. But the tortoise has moved 10m ahead.</li>
            <li>Achilles runs 10m to the new position. But the tortoise has moved 1m ahead.</li>
            <li>Achilles runs 1m. The tortoise has moved 0.1m.</li>
            <li>And so on, <em>forever</em>.</li>
        </ol>
        <p>It seems Achilles must complete <em>infinitely many</em> steps to catch the tortoise. Can he ever catch up?</p>
    </div>
</div>

<h3>The Resolution: Infinite Series</h3>

<p>The key insight is that infinitely many steps can take a <strong>finite</strong> amount of time. The total time Achilles needs is:</p>

\\[
T = 10 + 1 + 0.1 + 0.01 + \\cdots = \\sum_{k=0}^{\\infty} 10 \\cdot (0.1)^k = \\frac{10}{1 - 0.1} = \\frac{10}{0.9} = 11.\\overline{1} \\text{ seconds}
\\]

<p>This is a <strong>geometric series</strong>. The sum of infinitely many positive terms can be finite, provided the terms shrink fast enough.</p>

<div class="env-block theorem">
    <div class="env-title">Geometric Series Formula</div>
    <div class="env-body">
        <p>For \\(|r| < 1\\):</p>
        \\[
        \\sum_{k=0}^{\\infty} ar^k = \\frac{a}{1 - r}
        \\]
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Lesson</div>
    <div class="env-body">
        <p>Zeno's paradox is not really about motion. It is about the fact that we can subdivide a finite interval into infinitely many parts, and the sum of those parts is still finite. The paradox arises from the false assumption that "infinitely many steps" must take infinitely long.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-zeno-race"></div>
`,
            visualizations: [
                {
                    id: 'viz-zeno-race',
                    title: 'Achilles vs. the Tortoise',
                    description: 'Watch Achilles chase the tortoise. The infinite steps complete in finite time. See the partial sums converge.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var running = false;
                        var elapsed = 0;
                        var speed_a = 10; // Achilles speed
                        var speed_t = 1;  // Tortoise speed
                        var headStart = 100;
                        var catchTime = headStart / (speed_a - speed_t); // 100/9 ~ 11.11s
                        var totalDist = speed_a * catchTime; // ~111.1m

                        // Track Zeno steps
                        var zenoSteps = [];
                        function buildSteps() {
                            zenoSteps = [];
                            var dist = headStart;
                            var time = 0;
                            for (var i = 0; i < 20; i++) {
                                var t = dist / speed_a;
                                time += t;
                                zenoSteps.push({ time: time, dist: dist });
                                dist = dist * (speed_t / speed_a);
                            }
                        }
                        buildSteps();

                        var trackY = h * 0.4;
                        var scaleX = (w - 80) / (totalDist * 1.1);
                        var startPx = 40;

                        VizEngine.createButton(controls, 'Start Race', function() {
                            elapsed = 0;
                            running = true;
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            elapsed = 0;
                            running = false;
                        });

                        viz.animate(function(t) {
                            if (running) {
                                elapsed += 0.025;
                                if (elapsed > catchTime * 1.3) running = false;
                            }

                            viz.clear();
                            viz.screenText('Achilles vs. the Tortoise', w / 2, 18, viz.colors.white, 14);

                            // Track
                            ctx.strokeStyle = viz.colors.axis;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(startPx, trackY);
                            ctx.lineTo(w - 20, trackY);
                            ctx.stroke();

                            // Distance markers
                            for (var m = 0; m <= Math.ceil(totalDist); m += 20) {
                                var mx = startPx + m * scaleX;
                                if (mx > w - 20) break;
                                ctx.strokeStyle = viz.colors.grid;
                                ctx.lineWidth = 0.5;
                                ctx.beginPath();
                                ctx.moveTo(mx, trackY - 5);
                                ctx.lineTo(mx, trackY + 5);
                                ctx.stroke();
                                if (m % 40 === 0) {
                                    viz.screenText(m + 'm', mx, trackY + 18, viz.colors.text, 9);
                                }
                            }

                            // Positions
                            var posA = Math.min(elapsed * speed_a, totalDist * 1.2);
                            var posT = headStart + Math.min(elapsed * speed_t, totalDist);
                            var pxA = startPx + posA * scaleX;
                            var pxT = startPx + posT * scaleX;

                            // Achilles
                            ctx.fillStyle = viz.colors.blue;
                            ctx.beginPath();
                            ctx.arc(pxA, trackY - 15, 10, 0, Math.PI * 2);
                            ctx.fill();
                            viz.screenText('Achilles', pxA, trackY - 32, viz.colors.blue, 10);

                            // Tortoise
                            ctx.fillStyle = viz.colors.green;
                            ctx.beginPath();
                            ctx.arc(pxT, trackY - 15, 8, 0, Math.PI * 2);
                            ctx.fill();
                            viz.screenText('Tortoise', pxT, trackY - 32, viz.colors.green, 10);

                            // Zeno step markers
                            viz.screenText("Zeno's steps:", w / 2, trackY + 45, viz.colors.orange, 11);
                            var sumTime = 0;
                            for (var s = 0; s < Math.min(zenoSteps.length, 8); s++) {
                                var zs = zenoSteps[s];
                                var completed = elapsed >= zs.time;
                                var zx = startPx + (zs.time * speed_a) * scaleX;
                                if (zx > w - 30) break;

                                ctx.fillStyle = completed ? viz.colors.orange : viz.colors.orange + '44';
                                ctx.beginPath();
                                ctx.arc(zx, trackY + 60, 4, 0, Math.PI * 2);
                                ctx.fill();

                                if (s < 5) {
                                    viz.screenText('Step ' + (s + 1), zx, trackY + 78, completed ? viz.colors.orange : viz.colors.text, 8);
                                }
                            }

                            // Partial sum display
                            var partialSum = 0;
                            var stepsCompleted = 0;
                            for (var p = 0; p < zenoSteps.length; p++) {
                                if (elapsed >= zenoSteps[p].time) {
                                    partialSum = zenoSteps[p].time;
                                    stepsCompleted = p + 1;
                                }
                            }

                            viz.screenText('Time elapsed: ' + elapsed.toFixed(2) + 's', w / 2, h - 70, viz.colors.white, 12);
                            viz.screenText('Zeno steps completed: ' + stepsCompleted, w / 2, h - 52, viz.colors.orange, 11);
                            viz.screenText('Catch time = 100/9 = 11.11...s', w / 2, h - 34, viz.colors.teal, 11);

                            if (elapsed >= catchTime) {
                                viz.screenText('CAUGHT! Infinite steps, finite time.', w / 2, h - 14, viz.colors.green, 13);
                            }
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Compute the sum \\(\\frac{1}{2} + \\frac{1}{4} + \\frac{1}{8} + \\frac{1}{16} + \\cdots\\). What does this tell you about walking halfway to a wall, then half the remaining distance, and so on?',
                    hint: 'This is a geometric series with \\(a = 1/2\\) and \\(r = 1/2\\).',
                    solution: 'Using the geometric series formula: \\(\\sum_{k=1}^{\\infty} (1/2)^k = \\frac{1/2}{1 - 1/2} = 1\\). You reach the wall! The infinitely many half-steps sum to exactly the full distance.'
                },
            ]
        },

        // ================================================================
        // SECTION 4: Fractals
        // ================================================================
        {
            id: 'sec-fractals',
            title: 'Fractals',
            content: `
<h2>Fractals: Infinite Detail at Every Scale</h2>

<div class="env-block intuition">
    <div class="env-title">The Big Idea</div>
    <div class="env-body">
        <p>What happens when you repeat a simple process infinitely many times? Sometimes you get something ordinary. But sometimes you get a shape of infinite complexity, one that looks equally detailed no matter how much you zoom in. These shapes are called <strong>fractals</strong>.</p>
    </div>
</div>

<h3>The Koch Snowflake</h3>

<p>Start with an equilateral triangle. On each side, replace the middle third with two sides of a smaller equilateral triangle pointing outward. Repeat.</p>

<div class="env-block definition">
    <div class="env-title">Koch Snowflake Construction</div>
    <div class="env-body">
        <ol>
            <li>Start with an equilateral triangle (iteration 0).</li>
            <li>For each line segment, replace the middle third with a triangular bump.</li>
            <li>Repeat forever.</li>
        </ol>
        <p>After infinitely many steps, the boundary has <strong>infinite length</strong> but encloses a <strong>finite area</strong>. The perimeter at iteration \\(n\\) is \\(3 \\cdot (4/3)^n\\), which grows without bound.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-koch-snowflake"></div>

<h3>The Sierpinski Triangle</h3>

<p>Start with a filled triangle. Remove the middle triangle (connecting the midpoints of the three sides). Now you have three smaller triangles. Remove the middle of each. Repeat.</p>

<p>After infinitely many steps, you are left with a set that has <strong>zero area</strong> but is still uncountably infinite. Its fractal dimension is \\(\\log 3 / \\log 2 \\approx 1.585\\), strictly between a line (dimension 1) and a plane (dimension 2).</p>

<div class="viz-placeholder" data-viz="viz-sierpinski"></div>

<h3>The Mandelbrot Set</h3>

<p>The Mandelbrot set is defined by a simple rule: for each complex number \\(c\\), iterate \\(z_{n+1} = z_n^2 + c\\) starting from \\(z_0 = 0\\). If the sequence stays bounded, \\(c\\) is in the Mandelbrot set. If it escapes to infinity, it is not.</p>

<p>Despite the simplicity of this rule, the boundary of the Mandelbrot set has infinite detail. No matter how much you zoom in, you find new patterns, miniature copies of the whole set, spirals, and shapes of staggering complexity.</p>

<div class="viz-placeholder" data-viz="viz-mandelbrot-zoom"></div>
`,
            visualizations: [
                {
                    id: 'viz-koch-snowflake',
                    title: 'Koch Snowflake',
                    description: 'Build the Koch snowflake iteration by iteration. Watch the perimeter grow while the area stays bounded.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var iteration = 0;
                        var maxIter = 6;

                        VizEngine.createSlider(controls, 'Iteration', 0, maxIter, 0, 1, function(v) {
                            iteration = Math.round(v);
                            draw();
                        });

                        function kochPoints(p1, p2, depth) {
                            if (depth === 0) return [p1];
                            var dx = p2[0] - p1[0], dy = p2[1] - p1[1];
                            var a = [p1[0] + dx / 3, p1[1] + dy / 3];
                            var b = [p1[0] + dx * 2 / 3, p1[1] + dy * 2 / 3];
                            // Peak of equilateral triangle
                            var mx = (a[0] + b[0]) / 2 - (b[1] - a[1]) * Math.sqrt(3) / 2;
                            var my = (a[1] + b[1]) / 2 + (b[0] - a[0]) * Math.sqrt(3) / 2;
                            var peak = [mx, my];

                            var pts = [];
                            pts = pts.concat(kochPoints(p1, a, depth - 1));
                            pts = pts.concat(kochPoints(a, peak, depth - 1));
                            pts = pts.concat(kochPoints(peak, b, depth - 1));
                            pts = pts.concat(kochPoints(b, p2, depth - 1));
                            return pts;
                        }

                        function draw() {
                            viz.clear();

                            var cx = w / 2, cy = h / 2 + 20;
                            var size = Math.min(w, h) * 0.38;

                            // Equilateral triangle vertices
                            var v1 = [cx, cy - size];
                            var v2 = [cx - size * Math.sqrt(3) / 2, cy + size / 2];
                            var v3 = [cx + size * Math.sqrt(3) / 2, cy + size / 2];

                            var pts1 = kochPoints(v1, v2, iteration);
                            var pts2 = kochPoints(v2, v3, iteration);
                            var pts3 = kochPoints(v3, v1, iteration);
                            var allPts = pts1.concat(pts2).concat(pts3);

                            // Fill
                            ctx.fillStyle = viz.colors.blue + '22';
                            ctx.beginPath();
                            ctx.moveTo(allPts[0][0], allPts[0][1]);
                            for (var i = 1; i < allPts.length; i++) {
                                ctx.lineTo(allPts[i][0], allPts[i][1]);
                            }
                            ctx.closePath();
                            ctx.fill();

                            // Stroke
                            ctx.strokeStyle = viz.colors.blue;
                            ctx.lineWidth = 1.5;
                            ctx.beginPath();
                            ctx.moveTo(allPts[0][0], allPts[0][1]);
                            for (var j = 1; j < allPts.length; j++) {
                                ctx.lineTo(allPts[j][0], allPts[j][1]);
                            }
                            ctx.closePath();
                            ctx.stroke();

                            // Info
                            var numSides = 3 * Math.pow(4, iteration);
                            var perimRatio = Math.pow(4 / 3, iteration);
                            viz.screenText('Koch Snowflake: Iteration ' + iteration, w / 2, 20, viz.colors.white, 14);
                            viz.screenText('Segments: ' + numSides + '    Perimeter ratio: (4/3)^' + iteration + ' = ' + perimRatio.toFixed(2), w / 2, h - 20, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-sierpinski',
                    title: 'Sierpinski Triangle',
                    description: 'Build the Sierpinski triangle by removing middle triangles at each iteration.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var iteration = 0;
                        var maxIter = 7;

                        VizEngine.createSlider(controls, 'Iteration', 0, maxIter, 0, 1, function(v) {
                            iteration = Math.round(v);
                            draw();
                        });

                        function drawSierpinski(ax, ay, bx, by, cx, cy, depth) {
                            if (depth === 0) {
                                ctx.beginPath();
                                ctx.moveTo(ax, ay);
                                ctx.lineTo(bx, by);
                                ctx.lineTo(cx, cy);
                                ctx.closePath();
                                ctx.fill();
                                return;
                            }
                            var mx1 = (ax + bx) / 2, my1 = (ay + by) / 2;
                            var mx2 = (bx + cx) / 2, my2 = (by + cy) / 2;
                            var mx3 = (ax + cx) / 2, my3 = (ay + cy) / 2;
                            drawSierpinski(ax, ay, mx1, my1, mx3, my3, depth - 1);
                            drawSierpinski(mx1, my1, bx, by, mx2, my2, depth - 1);
                            drawSierpinski(mx3, my3, mx2, my2, cx, cy, depth - 1);
                        }

                        function draw() {
                            viz.clear();

                            var cx2 = w / 2;
                            var margin = 30;
                            var size = Math.min(w - 2 * margin, h - 80);
                            var topX = cx2, topY = 50;
                            var leftX = cx2 - size / 2, leftY = 50 + size * Math.sqrt(3) / 2;
                            var rightX = cx2 + size / 2, rightY = leftY;

                            ctx.fillStyle = viz.colors.purple;
                            drawSierpinski(topX, topY, leftX, leftY, rightX, rightY, iteration);

                            var numTriangles = Math.pow(3, iteration);
                            var areaRatio = Math.pow(3 / 4, iteration);
                            viz.screenText('Sierpinski Triangle: Iteration ' + iteration, w / 2, 20, viz.colors.white, 14);
                            viz.screenText('Filled triangles: ' + numTriangles + '    Area ratio: (3/4)^' + iteration + ' = ' + (areaRatio * 100).toFixed(1) + '%', w / 2, h - 15, viz.colors.teal, 11);
                        }
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-mandelbrot-zoom',
                    title: 'Mandelbrot Set',
                    description: 'Explore the Mandelbrot set. Click to zoom in and discover infinite detail at every scale.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var centerX = -0.5, centerY = 0;
                        var scale = 3.0; // width in complex plane
                        var maxIter = 80;
                        var rendering = false;

                        VizEngine.createButton(controls, 'Reset View', function() {
                            centerX = -0.5; centerY = 0; scale = 3.0;
                            render();
                        });

                        VizEngine.createButton(controls, 'Zoom: Seahorse Valley', function() {
                            centerX = -0.75; centerY = 0.1; scale = 0.3;
                            render();
                        });

                        VizEngine.createButton(controls, 'Zoom: Mini Mandelbrot', function() {
                            centerX = -1.768; centerY = 0.002; scale = 0.05;
                            maxIter = 200;
                            render();
                        });

                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            // Map to complex plane
                            var aspect = h / w;
                            centerX = centerX + (mx / w - 0.5) * scale;
                            centerY = centerY - (my / h - 0.5) * scale * aspect;
                            scale *= 0.4;
                            if (scale < 0.001) maxIter = 300;
                            else if (scale < 0.05) maxIter = 200;
                            else maxIter = 80;
                            render();
                        });

                        function mandelbrotIter(cr, ci, max) {
                            var zr = 0, zi = 0;
                            for (var i = 0; i < max; i++) {
                                var zr2 = zr * zr, zi2 = zi * zi;
                                if (zr2 + zi2 > 4) return i;
                                zi = 2 * zr * zi + ci;
                                zr = zr2 - zi2 + cr;
                            }
                            return max;
                        }

                        function colorFromIter(iter, max) {
                            if (iter === max) return [12, 12, 32];
                            var t = iter / max;
                            var hue = 0.65 + t * 3.5;
                            hue = hue - Math.floor(hue);
                            var sat = 0.8;
                            var light = 0.15 + 0.65 * Math.sqrt(t);
                            return VizEngine.hslToRgb(hue, sat, light);
                        }

                        function render() {
                            if (rendering) return;
                            rendering = true;

                            var dpr = window.devicePixelRatio || 1;
                            var pw = viz.canvas.width, ph = viz.canvas.height;
                            var aspect = ph / pw;

                            ctx.save();
                            ctx.setTransform(1, 0, 0, 1, 0, 0);
                            var imgData = ctx.createImageData(pw, ph);
                            var data = imgData.data;

                            var x0 = centerX - scale / 2;
                            var y0 = centerY + scale * aspect / 2;
                            var dx = scale / pw;
                            var dy = -scale * aspect / ph;

                            for (var py = 0; py < ph; py++) {
                                var ci = y0 + py * dy;
                                for (var px = 0; px < pw; px++) {
                                    var cr = x0 + px * dx;
                                    var iter = mandelbrotIter(cr, ci, maxIter);
                                    var rgb = colorFromIter(iter, maxIter);
                                    var idx = (py * pw + px) * 4;
                                    data[idx] = rgb[0];
                                    data[idx + 1] = rgb[1];
                                    data[idx + 2] = rgb[2];
                                    data[idx + 3] = 255;
                                }
                            }
                            ctx.putImageData(imgData, 0, 0);
                            ctx.restore();

                            // Overlay info text with background for readability
                            ctx.fillStyle = 'rgba(12,12,32,0.7)';
                            ctx.fillRect(0, 0, w, 28);
                            viz.screenText('Mandelbrot Set (click to zoom)', w / 2, 14, viz.colors.white, 12);
                            ctx.fillStyle = 'rgba(12,12,32,0.7)';
                            ctx.fillRect(0, h - 22, w, 22);
                            viz.screenText('Center: (' + centerX.toFixed(4) + ', ' + centerY.toFixed(4) + ')  Scale: ' + scale.toExponential(2), w / 2, h - 10, viz.colors.teal, 10);

                            rendering = false;
                        }

                        render();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: "What is the fractal dimension of the Koch snowflake? (Hint: each iteration replaces 1 segment with 4 segments, each 1/3 the length.)",
                    hint: 'Fractal dimension \\(d\\) satisfies \\(N = s^d\\), where \\(N\\) is the number of self-similar pieces and \\(s\\) is the scaling factor.',
                    solution: 'Each segment becomes 4 copies scaled by 1/3. So \\(4 = 3^d\\), giving \\(d = \\log 4 / \\log 3 \\approx 1.2619\\). The Koch curve has dimension between 1 (a line) and 2 (a plane).'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Fun Paradoxes
        // ================================================================
        {
            id: 'sec-paradoxes',
            title: 'Fun Paradoxes',
            content: `
<h2>Fun Paradoxes</h2>

<p>Infinity and self-reference lead to some of the most delightful (and unsettling) paradoxes in logic. These are not just puzzles; they shaped the very foundations of modern mathematics.</p>

<h3>The Barber Paradox</h3>

<div class="env-block example">
    <div class="env-title">The Barber Paradox</div>
    <div class="env-body">
        <p>In a village, the barber shaves everyone who does not shave themselves, and only those people. Question: <strong>who shaves the barber?</strong></p>
        <ul>
            <li>If the barber shaves himself, then he is someone who shaves himself, so the barber should NOT shave him. Contradiction!</li>
            <li>If the barber does NOT shave himself, then he is someone who does not shave himself, so the barber SHOULD shave him. Contradiction!</li>
        </ul>
        <p>There is no consistent answer. The barber's rule is self-contradictory.</p>
    </div>
</div>

<h3>Russell's Paradox</h3>

<p>The barber paradox is actually a simplified version of a devastating discovery in mathematical logic.</p>

<div class="env-block theorem">
    <div class="env-title">Russell's Paradox (1901)</div>
    <div class="env-body">
        <p>Consider the set \\(R = \\{x : x \\notin x\\}\\), that is, the set of all sets that do not contain themselves.</p>
        <p>Is \\(R \\in R\\)?</p>
        <ul>
            <li>If \\(R \\in R\\), then by definition \\(R \\notin R\\). Contradiction.</li>
            <li>If \\(R \\notin R\\), then by definition \\(R \\in R\\). Contradiction.</li>
        </ul>
        <p>This paradox showed that "naive" set theory (where any property defines a set) is inconsistent. It forced mathematicians to rebuild the foundations of mathematics, leading to axiomatic set theory (ZFC).</p>
    </div>
</div>

<h3>The Liar Paradox</h3>

<div class="env-block example">
    <div class="env-title">The Liar Paradox</div>
    <div class="env-body">
        <p>Consider the sentence: <strong>"This sentence is false."</strong></p>
        <ul>
            <li>If it is true, then what it says is correct, so it is false. Contradiction.</li>
            <li>If it is false, then what it says is wrong, so it is NOT false, meaning it is true. Contradiction.</li>
        </ul>
        <p>This ancient paradox (attributed to the Cretan Epimenides, 6th century BC) is not just a word game. It is deeply connected to Godel's incompleteness theorems, which proved that any sufficiently powerful mathematical system contains true statements that cannot be proved within the system.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">The Common Thread</div>
    <div class="env-body">
        <p>All three paradoxes share a common structure: <strong>self-reference</strong>. The barber's rule refers to the barber. Russell's set is defined in terms of itself. The liar sentence talks about its own truth value. Self-reference is the engine that drives these paradoxes, and understanding when self-reference is safe and when it is dangerous is one of the great themes of 20th-century logic.</p>
    </div>
</div>

<div class="viz-placeholder" data-viz="viz-barber-paradox"></div>
`,
            visualizations: [
                {
                    id: 'viz-barber-paradox',
                    title: 'The Barber Paradox',
                    description: 'Follow the logic of the barber who shaves all who do not shave themselves. Watch the circular reasoning unfold.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var step = 0;
                        var maxSteps = 6;
                        var autoPlay = false;
                        var autoTimer = null;

                        var steps = [
                            { text: 'The barber shaves everyone who does not shave themselves.', highlight: 'rule', color: viz.colors.white },
                            { text: 'Assume: The barber shaves himself.', highlight: 'yes', color: viz.colors.blue },
                            { text: 'But he only shaves those who DON\'T shave themselves!', highlight: 'contra-yes', color: viz.colors.red },
                            { text: 'So assume: The barber does NOT shave himself.', highlight: 'no', color: viz.colors.teal },
                            { text: 'But he must shave those who don\'t shave themselves!', highlight: 'contra-no', color: viz.colors.red },
                            { text: 'PARADOX: Neither answer is consistent!', highlight: 'paradox', color: viz.colors.orange }
                        ];

                        VizEngine.createButton(controls, 'Next Step', function() {
                            if (step < maxSteps) step++;
                            else step = 0;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Auto Play', function() {
                            step = 0;
                            if (autoTimer) clearInterval(autoTimer);
                            autoTimer = setInterval(function() {
                                step++;
                                if (step >= maxSteps) {
                                    clearInterval(autoTimer);
                                    autoTimer = null;
                                }
                                draw();
                            }, 1500);
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0;
                            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
                            draw();
                        });

                        function drawPerson(x, y, label, color, hasBeard) {
                            // Head
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.arc(x, y - 20, 18, 0, Math.PI * 2);
                            ctx.fill();
                            // Body
                            ctx.fillRect(x - 10, y, 20, 30);
                            // Beard
                            if (hasBeard) {
                                ctx.fillStyle = '#8B6914';
                                ctx.beginPath();
                                ctx.moveTo(x - 10, y - 10);
                                ctx.lineTo(x + 10, y - 10);
                                ctx.lineTo(x + 6, y + 5);
                                ctx.lineTo(x - 6, y + 5);
                                ctx.closePath();
                                ctx.fill();
                            }
                            // Label
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '11px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            ctx.fillText(label, x, y + 35);
                        }

                        function drawArrow(x1, y1, x2, y2, color, label) {
                            var dx = x2 - x1, dy = y2 - y1;
                            var len = Math.sqrt(dx * dx + dy * dy);
                            var ux = dx / len, uy = dy / len;
                            ctx.strokeStyle = color;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.moveTo(x1, y1);
                            ctx.lineTo(x2 - ux * 12, y2 - uy * 12);
                            ctx.stroke();
                            // Arrowhead
                            ctx.fillStyle = color;
                            ctx.beginPath();
                            ctx.moveTo(x2, y2);
                            ctx.lineTo(x2 - 10 * ux - 5 * uy, y2 - 10 * uy + 5 * ux);
                            ctx.lineTo(x2 - 10 * ux + 5 * uy, y2 - 10 * uy - 5 * ux);
                            ctx.closePath();
                            ctx.fill();
                            if (label) {
                                ctx.fillStyle = color;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(label, (x1 + x2) / 2 - uy * 12, (y1 + y2) / 2 + ux * 12);
                            }
                        }

                        function draw() {
                            viz.clear();
                            viz.screenText('The Barber Paradox', w / 2, 20, viz.colors.white, 15);

                            // Villagers
                            var villagers = [
                                { x: 80, y: 130, label: 'Alice', beard: true },
                                { x: 180, y: 130, label: 'Bob', beard: true },
                                { x: 280, y: 130, label: 'Charlie', beard: false }
                            ];
                            var barberX = w / 2, barberY = h / 2 + 20;

                            for (var i = 0; i < villagers.length; i++) {
                                var v = villagers[i];
                                drawPerson(v.x, v.y, v.label, viz.colors.text, v.beard);
                                if (v.beard) {
                                    drawArrow(barberX - 10, barberY - 30, v.x + 10, v.y + 10, viz.colors.teal, 'shaves');
                                }
                            }

                            // Barber
                            var barberBeard = false;
                            if (step >= 1 && step <= 2) barberBeard = false; // trying "shaves himself"
                            if (step >= 3 && step <= 4) barberBeard = true;  // trying "doesn't shave"

                            drawPerson(barberX, barberY, 'BARBER', viz.colors.orange, barberBeard);

                            // Self-reference arrow
                            if (step >= 1) {
                                var loopColor = (step === 2 || step === 4 || step === 5) ? viz.colors.red : viz.colors.blue;
                                ctx.strokeStyle = loopColor;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.arc(barberX + 35, barberY - 10, 25, -Math.PI / 2, Math.PI, false);
                                ctx.stroke();
                                // Arrowhead
                                ctx.fillStyle = loopColor;
                                ctx.beginPath();
                                ctx.moveTo(barberX + 35, barberY - 35);
                                ctx.lineTo(barberX + 30, barberY - 25);
                                ctx.lineTo(barberX + 40, barberY - 25);
                                ctx.closePath();
                                ctx.fill();

                                viz.screenText('?', barberX + 65, barberY - 10, loopColor, 18);
                            }

                            // Step text
                            if (step < steps.length) {
                                var s = steps[step];
                                // Background bar
                                ctx.fillStyle = 'rgba(12,12,32,0.85)';
                                ctx.fillRect(20, h - 60, w - 40, 45);
                                ctx.strokeStyle = s.color;
                                ctx.lineWidth = 1.5;
                                ctx.strokeRect(20, h - 60, w - 40, 45);
                                viz.screenText(s.text, w / 2, h - 38, s.color, 12);
                            }

                            // Paradox highlight
                            if (step === 5) {
                                ctx.strokeStyle = viz.colors.red;
                                ctx.lineWidth = 3;
                                ctx.setLineDash([8, 4]);
                                ctx.strokeRect(barberX - 50, barberY - 50, 100, 110);
                                ctx.setLineDash([]);
                                viz.screenText('CONTRADICTION', barberX, barberY + 70, viz.colors.red, 14);
                            }

                            // Step indicator
                            viz.screenText('Step ' + step + '/' + (maxSteps - 1), w - 50, 20, viz.colors.text, 10);
                        }
                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'The barber paradox shows the rule is impossible. Does this mean the barber cannot exist, or that the rule cannot exist?',
                    hint: 'Think about what causes the contradiction: the barber as a person, or the rule that defines who the barber shaves.',
                    solution: 'The rule is the problem, not the barber. No person can satisfy the rule "shaves exactly those who do not shave themselves" because the rule creates a self-referential contradiction when applied to the barber. In set theory, this means not every description defines a valid set.'
                },
            ]
        },

        // ================================================================
        // SECTION 6: Bridge to What's Next
        // ================================================================
        {
            id: 'sec-bridge',
            title: "What's Next?",
            content: `
<h2>Where Infinity Leads</h2>

<p>We have seen that infinity is not a single idea but a whole landscape of ideas. Hilbert's Hotel showed that infinite sets behave nothing like finite ones. Cantor revealed a hierarchy of infinities. Zeno taught us that infinite processes can have finite outcomes. Fractals showed that infinite repetition creates unbounded complexity. And the paradoxes warned us that self-reference, if unchecked, can destroy consistency.</p>

<div class="env-block intuition">
    <div class="env-title">The Takeaway</div>
    <div class="env-body">
        <p>Infinity is not the end of mathematics; it is the beginning. Every branch of modern mathematics, from calculus to topology to logic, is built on a careful handling of the infinite. The key is precision: we never say "infinity" without being specific about <em>which</em> infinity, <em>how</em> it arises, and <em>what rules</em> govern it.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Connections</div>
    <div class="env-body">
        <p>Many ideas from this chapter connect to other chapters in this book:</p>
        <ul>
            <li><strong>Mathematical induction</strong> (Chapter 12) is how we prove things about all natural numbers, bridging the finite to the infinite.</li>
            <li><strong>Recursion</strong> (Chapter 11) is the engine behind fractals: a rule that calls itself.</li>
            <li><strong>Counting</strong> (Chapter 4) and <strong>combinations</strong> (Chapter 6) work with finite sets, but Cantor's work extends counting to infinite sets.</li>
            <li><strong>Logic</strong> (Chapter 1) is where paradoxes live, and where mathematicians learned to tame them.</li>
        </ul>
    </div>
</div>

<p>In the next chapter, we will see how these ideas about strategy and infinity come together in the theory of combinatorial games.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'List three examples from everyday life where "infinity" appears (even if only as an approximation or metaphor). For each, explain whether it is a true mathematical infinity or just "very large."',
                    hint: 'Think about the number of points on a line, the digits of pi, the number of atoms in the universe...',
                    solution: 'Possible examples: (1) The digits of \\(\\pi\\) are truly infinite (it is irrational). (2) The number of atoms in the universe is finite (approximately \\(10^{80}\\)), just very large. (3) The points on a line segment are truly (uncountably) infinite. The key distinction: "very large but finite" is fundamentally different from infinite.'
                },
                {
                    question: "Cantor showed that the reals are uncountable. Is the set of all possible books (finite sequences of letters) countable or uncountable?",
                    hint: 'Each book is a finite string over a finite alphabet. Can you list all strings of length 1, then length 2, then length 3, ...?',
                    solution: 'Countable. List all 1-character books, then all 2-character books, then all 3-character books, etc. Each group is finite (for a 26-letter alphabet, there are \\(26^n\\) books of length \\(n\\)). A countable union of finite sets is countable. So the "Library of Babel" is countable, even though it feels infinite.'
                },
            ]
        }
    ]
});
})();
