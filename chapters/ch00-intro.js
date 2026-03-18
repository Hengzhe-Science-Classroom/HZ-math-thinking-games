// === Chapter 0: What Is Mathematical Thinking? ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch00',
    number: 0,
    title: 'What Is Mathematical Thinking?',
    subtitle: 'Welcome to the playground where math meets play',
    sections: [
        // ===== Section 0: Math isn't just calculation =====
        {
            id: 'not-just-calculation',
            title: "Math Isn't Just Calculation",
            content: `
<h2>Throw Away Your Calculator (Just for Now)</h2>

<p>Here is a question for you: what is mathematics?</p>

<p>If you answered "numbers" or "formulas" or "that thing where you carry the one," you are in good company. Most people think of math as a collection of rules for calculating things. Add these, multiply those, solve for \\(x\\), get the answer, move on.</p>

<p>But that picture is like saying music is just pressing keys on a piano. Sure, pressing keys is part of it. But music is really about <em>patterns of sound that make you feel something</em>. In the same way, mathematics is really about <strong>patterns of thought that help you understand something</strong>.</p>

<div class="env-block intuition">
<strong>The Big Secret</strong><br>
Mathematical thinking is not about getting the right answer to \\(347 \\times 28\\). It is about learning to think clearly, spot patterns, build arguments, and solve problems that nobody has given you the formula for. That is a skill you can use <em>everywhere</em>, not just in math class.
</div>

<p>Consider this: when a detective solves a mystery, they are thinking mathematically. They gather clues (data), look for patterns (analysis), rule out impossibilities (logic), and build a case (proof). When a chess player plans five moves ahead, that is mathematical thinking. When a game designer figures out how to make a level challenging but fair, that is mathematical thinking too.</p>

<h3>What This Course Is About</h3>

<p>This course is a <strong>playground for your brain</strong>. We will explore puzzles, games, riddles, and challenges that have fascinated mathematicians for centuries. You will not need any fancy formulas. You will need curiosity, patience, and a willingness to be wrong sometimes (being wrong is how you learn).</p>

<p>Along the way, you will pick up powerful thinking tools: logic, counting, strategy, and proof. These tools will help you not only in math, but in science, in debates, in games, and in everyday decision-making.</p>

<div class="env-block remark">
<strong>No prerequisites</strong><br>
You do not need to be "good at math" to enjoy this course. You need to be good at being curious. If you have ever wondered "why?" about anything, you already have the most important qualification.
</div>

<p>Let us start with a simple puzzle to see what mathematical thinking looks like in action.</p>

<div class="env-block example">
<strong>The Handshake Problem</strong><br>
There are 20 people in a room. Each person shakes hands with every other person exactly once. How many handshakes happen in total?<br><br>
<em>Do not reach for a formula. Think about it. Try small cases first. What if there are 2 people? 3 people? 4 people?</em>
</div>

<p>If there are 2 people, there is 1 handshake. With 3 people, there are 3 handshakes. With 4 people, there are 6. Do you see the pattern forming? Each new person shakes hands with everyone already in the room, so the 5th person adds 4 new handshakes, the 6th adds 5, and so on. For 20 people, the total is \\(1 + 2 + 3 + \\cdots + 19 = 190\\).</p>

<p>Notice what just happened. We did not memorize a formula. We <em>thought our way through the problem</em> by starting small, spotting a pattern, and then extending it. That is mathematical thinking.</p>

<div class="viz-placeholder" data-viz="ch00-puzzle-showcase"></div>
`,
            visualizations: [
                {
                    id: 'ch00-puzzle-showcase',
                    title: 'Animated Puzzle Showcase',
                    description: 'Watch classic mathematical puzzles cycle through. Each one changed how people think about math.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;
                        var puzzleIndex = 0;
                        var puzzleNames = ['Handshake Network', 'Tower of Hanoi', 'Magic Square', 'Bridges of Konigsberg'];
                        var label = document.createElement('div');
                        label.style.cssText = 'color:#8b949e;font-size:0.85rem;text-align:center;margin-top:4px;';
                        label.textContent = 'Puzzle: ' + puzzleNames[0];
                        container.appendChild(label);

                        VizEngine.createButton(controls, 'Next Puzzle', function() {
                            puzzleIndex = (puzzleIndex + 1) % puzzleNames.length;
                            label.textContent = 'Puzzle: ' + puzzleNames[puzzleIndex];
                        });

                        function drawHandshakes(t) {
                            var cx = w / 2, cy = h / 2;
                            var n = 8;
                            var radius = Math.min(w, h) * 0.35;
                            var points = [];
                            for (var i = 0; i < n; i++) {
                                var angle = (Math.PI * 2 / n) * i - Math.PI / 2 + Math.sin(t * 0.0005) * 0.1;
                                points.push({
                                    x: cx + radius * Math.cos(angle),
                                    y: cy + radius * Math.sin(angle)
                                });
                            }
                            // Draw edges progressively
                            var totalEdges = n * (n - 1) / 2;
                            var showEdges = Math.floor((t * 0.003) % (totalEdges + 10));
                            var edgeCount = 0;
                            for (var i2 = 0; i2 < n; i2++) {
                                for (var j = i2 + 1; j < n; j++) {
                                    if (edgeCount < showEdges) {
                                        var hue = (edgeCount * 360 / totalEdges + t * 0.02) % 360;
                                        ctx.strokeStyle = VizEngine.hsl(hue, 60, 50);
                                        ctx.lineWidth = 1.5;
                                        ctx.globalAlpha = 0.6;
                                        ctx.beginPath();
                                        ctx.moveTo(points[i2].x, points[i2].y);
                                        ctx.lineTo(points[j].x, points[j].y);
                                        ctx.stroke();
                                        ctx.globalAlpha = 1;
                                    }
                                    edgeCount++;
                                }
                            }
                            // Draw nodes
                            for (var k = 0; k < n; k++) {
                                ctx.fillStyle = VizEngine.hsl((k * 45 + t * 0.02) % 360, 70, 60);
                                ctx.beginPath();
                                ctx.arc(points[k].x, points[k].y, 10, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = '#0c0c20';
                                ctx.font = 'bold 11px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(String(k + 1), points[k].x, points[k].y);
                            }
                            // Label
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '13px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('8 people = ' + Math.min(showEdges, totalEdges) + ' / ' + totalEdges + ' handshakes', cx, h - 20);
                        }

                        function drawHanoi(t) {
                            var cx = w / 2, baseY = h - 50;
                            var pegSpacing = w / 4;
                            var pegs = [cx - pegSpacing, cx, cx + pegSpacing];
                            // Draw pegs
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 4;
                            for (var p = 0; p < 3; p++) {
                                ctx.beginPath();
                                ctx.moveTo(pegs[p], baseY);
                                ctx.lineTo(pegs[p], baseY - 160);
                                ctx.stroke();
                            }
                            // Draw base
                            ctx.strokeStyle = '#4a4a7a';
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.moveTo(pegs[0] - 70, baseY);
                            ctx.lineTo(pegs[2] + 70, baseY);
                            ctx.stroke();
                            // Animate disks moving
                            var disks = 4;
                            var phase = Math.floor(t * 0.001) % 3;
                            for (var d = 0; d < disks; d++) {
                                var diskW = 30 + (disks - d) * 25;
                                var diskH = 18;
                                var pegIdx = (d + phase) % 3;
                                var stackPos = d;
                                var dx = pegs[pegIdx] - diskW / 2;
                                var dy = baseY - (stackPos + 1) * (diskH + 2);
                                ctx.fillStyle = VizEngine.hsl((d * 70 + 200) % 360, 65, 55);
                                ctx.beginPath();
                                ctx.roundRect(dx, dy, diskW, diskH, 4);
                                ctx.fill();
                            }
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '13px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Tower of Hanoi: move all disks to the right peg', cx, 30);
                        }

                        function drawMagicSquare(t) {
                            var cx = w / 2, cy = h / 2;
                            var cellSize = 60;
                            var grid = [[2,7,6],[9,5,1],[4,3,8]];
                            var startX = cx - cellSize * 1.5;
                            var startY = cy - cellSize * 1.5;
                            // Highlight: cycle through rows, cols, diagonals
                            var highlightSet = Math.floor(t * 0.001) % 8;
                            var highlights = [
                                [[0,0],[0,1],[0,2]], [[1,0],[1,1],[1,2]], [[2,0],[2,1],[2,2]],
                                [[0,0],[1,0],[2,0]], [[0,1],[1,1],[2,1]], [[0,2],[1,2],[2,2]],
                                [[0,0],[1,1],[2,2]], [[0,2],[1,1],[2,0]]
                            ];
                            var hlSet = {};
                            for (var hi = 0; hi < highlights[highlightSet].length; hi++) {
                                hlSet[highlights[highlightSet][hi][0] + ',' + highlights[highlightSet][hi][1]] = true;
                            }
                            for (var r = 0; r < 3; r++) {
                                for (var c = 0; c < 3; c++) {
                                    var x = startX + c * cellSize;
                                    var y = startY + r * cellSize;
                                    var isHl = hlSet[r + ',' + c];
                                    ctx.fillStyle = isHl ? '#58a6ff22' : '#1a1a40';
                                    ctx.fillRect(x, y, cellSize, cellSize);
                                    ctx.strokeStyle = isHl ? '#58a6ff' : '#4a4a7a';
                                    ctx.lineWidth = isHl ? 2 : 1;
                                    ctx.strokeRect(x, y, cellSize, cellSize);
                                    ctx.fillStyle = isHl ? '#58a6ff' : '#c9d1d9';
                                    ctx.font = 'bold 24px sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.textBaseline = 'middle';
                                    ctx.fillText(String(grid[r][c]), x + cellSize / 2, y + cellSize / 2);
                                }
                            }
                            ctx.fillStyle = '#3fb9a0';
                            ctx.font = '14px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Every row, column, and diagonal sums to 15', cx, startY + cellSize * 3 + 30);
                        }

                        function drawBridges(t) {
                            var cx = w / 2, cy = h / 2;
                            // Simplified Konigsberg layout: 4 land masses, 7 bridges
                            var nodes = [
                                { x: cx - 120, y: cy, label: 'A' },
                                { x: cx, y: cy - 80, label: 'B' },
                                { x: cx, y: cy + 80, label: 'C' },
                                { x: cx + 120, y: cy, label: 'D' }
                            ];
                            var edges = [
                                [0,1],[0,1],[0,2],[0,2],[1,3],[2,3],[1,2]
                            ];
                            var showEdge = Math.floor(t * 0.002) % (edges.length + 3);
                            for (var e = 0; e < edges.length; e++) {
                                var a = nodes[edges[e][0]], b = nodes[edges[e][1]];
                                var offset = 0;
                                // Offset duplicate edges
                                if (e === 1) offset = 15;
                                if (e === 3) offset = 15;
                                ctx.strokeStyle = e < showEdge ? VizEngine.hsl((e * 50 + 180) % 360, 60, 55) : '#2a2a50';
                                ctx.lineWidth = e < showEdge ? 3 : 2;
                                ctx.beginPath();
                                ctx.moveTo(a.x, a.y + offset);
                                ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - offset * 2, b.x, b.y + offset);
                                ctx.stroke();
                            }
                            for (var ni = 0; ni < nodes.length; ni++) {
                                var nd = nodes[ni];
                                ctx.fillStyle = '#3fb950';
                                ctx.beginPath();
                                ctx.arc(nd.x, nd.y, 18, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.fillStyle = '#0c0c20';
                                ctx.font = 'bold 14px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(nd.label, nd.x, nd.y);
                            }
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '13px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Can you cross all 7 bridges exactly once?', cx, h - 20);
                        }

                        var drawFns = [drawHandshakes, drawHanoi, drawMagicSquare, drawBridges];

                        viz.animate(function(t) {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);
                            drawFns[puzzleIndex](t);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'For the handshake problem, what if there are 100 people in the room? Can you find the total number of handshakes without adding 1 + 2 + 3 + ... + 99 one by one?',
                    hint: 'Each of the 100 people shakes hands with 99 others. But that counts each handshake twice (once from each side). So the answer is...',
                    solution: 'The total number of handshakes is \\(\\frac{100 \\times 99}{2} = 4950\\). In general, with \\(n\\) people, the number of handshakes is \\(\\frac{n(n-1)}{2}\\). This is a <em>triangular number</em>, and we will see these again later in the course!'
                },
                {
                    question: 'You have a 3-liter jug and a 5-liter jug. Neither has any markings. How can you measure exactly 4 liters of water?',
                    hint: 'Try filling and pouring between the two jugs. Keep track of how much is in each jug at every step.',
                    solution: 'One solution: (1) Fill the 5-liter jug. (2) Pour from the 5-liter into the 3-liter until the 3-liter is full. Now you have 2 liters in the 5-liter jug. (3) Empty the 3-liter jug. (4) Pour the 2 liters from the 5-liter into the 3-liter. (5) Fill the 5-liter jug again. (6) Pour from the 5-liter into the 3-liter (which has 2 liters) until the 3-liter is full, which takes 1 liter. Now the 5-liter jug has exactly 4 liters!'
                },
                {
                    question: 'A snail is at the bottom of a 10-meter well. Each day it climbs 3 meters, but each night it slides back 2 meters. On which day does the snail reach the top?',
                    hint: 'Be careful with the last day! Once the snail reaches the top, it does not slide back.',
                    solution: 'The snail makes a net gain of 1 meter per day (3 up, 2 back). After 7 days, the snail is at 7 meters. On day 8, the snail climbs 3 meters to reach 10 meters and escapes! So the answer is day 8, not day 10. The common mistake is to divide 10 by 1 and say day 10.'
                }
            ]
        },

        // ===== Section 1: Puzzles that changed history =====
        {
            id: 'puzzles-that-changed-history',
            title: 'Puzzles That Changed History',
            content: `
<h2>When Puzzles Became Serious Mathematics</h2>

<p>Some of the greatest breakthroughs in mathematics started as puzzles, riddles, or games. Let us meet a few of them.</p>

<h3>The Bridges of Konigsberg (1736)</h3>

<p>The city of Konigsberg (now Kaliningrad, Russia) was built on both sides of a river, with two islands in the middle. Seven bridges connected the various land masses. The citizens had a favorite Sunday pastime: trying to find a walking route that crossed each bridge exactly once.</p>

<p>Nobody could do it. But nobody could prove it was impossible either, until a Swiss mathematician named <strong>Leonhard Euler</strong> came along. Euler realized something brilliant: the exact shapes of the land masses and the exact positions of the bridges did not matter. What mattered was only <em>which land masses were connected to which</em>, and <em>how many bridges each land mass had</em>.</p>

<div class="env-block definition">
<strong>Graph Theory</strong><br>
The study of objects (called <strong>vertices</strong> or nodes) and the connections between them (called <strong>edges</strong>). Euler's insight about the Konigsberg bridges invented this entire field of mathematics.
</div>

<p>Euler proved that a walk crossing each bridge exactly once is possible only if there are at most two land masses with an odd number of bridges. Konigsberg had <em>four</em> land masses with odd bridge counts, so the walk was impossible. Problem solved, and an entire new branch of mathematics was born!</p>

<h3>The Fibonacci Rabbit Puzzle (1202)</h3>

<p>In the year 1202, an Italian mathematician named Leonardo of Pisa (nicknamed Fibonacci) posed this puzzle in his book <em>Liber Abaci</em>: Suppose a pair of rabbits produces a new pair every month, and each new pair begins producing after one month. Starting with one pair, how many pairs are there after 12 months?</p>

<p>The answer leads to the famous sequence: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, ... Each number is the sum of the two before it. This sequence turns up everywhere: in sunflower spirals, pine cone patterns, the branching of trees, and even the proportions of the human body.</p>

<h3>The Four-Color Problem (1852)</h3>

<p>A student named Francis Guthrie noticed that he could color any map using just four colors, so that no two neighboring regions shared the same color. He asked: is this always true?</p>

<p>This seemingly simple question took <strong>124 years</strong> to answer. It was finally proved in 1976 by Kenneth Appel and Wolfgang Haken, and their proof was controversial because it was the first major theorem to rely on computer verification. It checked nearly 2000 special cases that no human could verify by hand.</p>

<div class="env-block remark">
<strong>The lesson</strong><br>
Simple questions can lead to deep mathematics. Never dismiss a puzzle as "too simple to be interesting." Some of the hardest open problems in math can be stated in a single sentence.
</div>

<h3>Fermat's Last Theorem (1637)</h3>

<p>Pierre de Fermat scribbled a note in the margin of a book: the equation \\(a^n + b^n = c^n\\) has no whole-number solutions when \\(n &gt; 2\\). He famously wrote, "I have discovered a truly marvelous proof of this, which this margin is too narrow to contain."</p>

<p>That margin note haunted mathematicians for <strong>358 years</strong>. Andrew Wiles finally proved it in 1995, in a proof that runs over 100 pages and uses mathematics that Fermat could not possibly have known. The consensus today is that Fermat was probably mistaken about having a proof.</p>

<p>But what matters is this: a single question, scratched in a book margin, drove centuries of mathematical progress and led to the development of entirely new fields.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'The Fibonacci sequence starts 1, 1, 2, 3, 5, 8, 13, 21, ... What is the 15th Fibonacci number?',
                    hint: 'Continue the pattern: each number is the sum of the two before it. After 21, the next ones are 34, 55, 89, ...',
                    solution: 'The first 15 Fibonacci numbers are: 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610. So the 15th Fibonacci number is \\(610\\).'
                },
                {
                    question: 'In Euler\'s bridge problem, he found that you need at most 2 nodes with an odd number of edges. A triangle (3 nodes, 3 edges) has every node with degree 2 (even). Can you trace a path that crosses each edge exactly once? What about a square?',
                    hint: 'A triangle has 3 edges and all nodes have degree 2 (even), so it should be possible. For a square, each node also has degree 2.',
                    solution: 'Yes to both! A triangle can be traced in one path (go around: A to B to C to A), and so can a square (go around: A to B to C to D to A). In both cases, every vertex has an even number of edges, so an <strong>Euler circuit</strong> (a path that starts and ends at the same place) exists.'
                },
                {
                    question: 'Can you draw a graph (dots and lines) with 5 nodes where it is <em>impossible</em> to trace all edges in one path? (Hint: think about Euler\'s rule about odd-degree nodes.)',
                    hint: 'You need more than 2 nodes with an odd number of edges. Try connecting node A to B, C, D, and E (so A has degree 4). Then also connect B to C, D, and E.',
                    solution: 'One example: draw 5 nodes and connect every pair (this is called \\(K_5\\), the complete graph on 5 vertices). Every node has degree 4, which is even, so actually \\(K_5\\) does have an Euler circuit! To make it impossible, try: A-B, A-C, A-D, B-C, B-D, C-D, D-E. Here A, B, C each have degree 3 (odd), and there are 3 odd-degree nodes, which is more than 2. So no Euler path exists.'
                }
            ]
        },

        // ===== Section 2: How mathematicians think =====
        {
            id: 'how-mathematicians-think',
            title: 'How Mathematicians Think',
            content: `
<h2>The Mathematician's Toolkit (It's Not What You Think)</h2>

<p>What do mathematicians actually <em>do</em> all day? They do not sit around multiplying large numbers. Instead, they do something much more exciting: they <strong>think about thinking</strong>.</p>

<p>Here are the main strategies that mathematicians use, and that you will learn in this course:</p>

<h3>Strategy 1: Try Small Cases First</h3>

<p>When a problem seems overwhelming, shrink it. If the problem asks about 100 things, start with 2 or 3. If the problem asks about all numbers, try 1, 2, 3, 4, and see what happens. This is exactly what we did with the handshake problem.</p>

<div class="env-block example">
<strong>Try it yourself</strong><br>
How many diagonals does a 10-sided polygon have?<br>
Start small: a triangle (3 sides) has 0 diagonals. A square (4 sides) has 2. A pentagon (5 sides) has 5. Can you spot the pattern?
</div>

<h3>Strategy 2: Draw a Picture</h3>

<p>A picture can reveal structure that words and numbers hide. Euler solved the bridge problem by drawing a diagram. Mathematicians constantly sketch, doodle, and diagram their way to solutions.</p>

<h3>Strategy 3: Look for Patterns</h3>

<p>Patterns are the beating heart of mathematics. When you compute several cases, <em>stare at the results</em>. Do the numbers go up? Down? Alternate? Repeat? Grow faster and faster? Every pattern is a clue.</p>

<h3>Strategy 4: Work Backwards</h3>

<p>Sometimes the best way to solve a problem is to start from the answer and figure out how you could have gotten there. If I tell you that the answer is 42, ask: what question could give 42 as an answer?</p>

<h3>Strategy 5: Consider the Extreme Cases</h3>

<p>What happens when a number is 0? Or 1? Or infinity? Extreme cases often reveal the structure of a problem. If a formula works for \\(n = 0\\) and \\(n = 1\\), and for very large \\(n\\), there is a good chance it works for everything in between.</p>

<h3>Strategy 6: Assume the Opposite</h3>

<p>This is the strategy of <strong>proof by contradiction</strong>. If you want to prove something is true, start by assuming it is false, and show that this assumption leads to nonsense. We will explore this in Chapter 3.</p>

<div class="env-block warning">
<strong>Common trap</strong><br>
Many students think that being "stuck" means they are failing. The opposite is true. Being stuck is <em>where the learning happens</em>. Professional mathematicians spend most of their time stuck. The difference is that they have learned to enjoy the struggle.
</div>

<p>The mathematician Andrew Wiles (who proved Fermat's Last Theorem) described his work like this: "You enter a dark room. You stumble around, bumping into furniture, not knowing where anything is. Gradually, you learn where each piece of furniture is. And then, one day, someone turns on the light, and suddenly you can see."</p>

<p>That moment when the light turns on is what mathematicians live for. And you will experience it too, many times in this course.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Using the "try small cases" strategy: how many diagonals does a 10-sided polygon (decagon) have?',
                    hint: 'Count diagonals for 3, 4, 5, 6, 7 sides: you get 0, 2, 5, 9, 14. The differences are 2, 3, 4, 5, ... See the pattern?',
                    solution: 'Continuing: 3 sides = 0 diagonals, 4 sides = 2, 5 sides = 5, 6 sides = 9, 7 sides = 14, 8 sides = 20, 9 sides = 27, 10 sides = 35. The formula is \\(\\frac{n(n-3)}{2}\\), so for \\(n=10\\): \\(\\frac{10 \\times 7}{2} = 35\\) diagonals.'
                },
                {
                    question: 'Using the "work backwards" strategy: I am thinking of a number. I doubled it, added 7, then multiplied by 3, and got 57. What was my number?',
                    hint: 'Undo each step in reverse order. Start from 57 and undo "multiplied by 3," then undo "added 7," then undo "doubled."',
                    solution: 'Working backwards: \\(57 \\div 3 = 19\\). Then \\(19 - 7 = 12\\). Then \\(12 \\div 2 = 6\\). The number was 6. Check: \\(6 \\times 2 = 12\\), \\(12 + 7 = 19\\), \\(19 \\times 3 = 57\\). Correct!'
                }
            ]
        },

        // ===== Section 3: Toolbox preview =====
        {
            id: 'toolbox-preview',
            title: 'Toolbox Preview',
            content: `
<h2>Your Mathematical Adventure Map</h2>

<p>This course covers four major areas of mathematical thinking. Think of them as four regions on a treasure map, each filled with its own challenges and rewards.</p>

<h3>Part A: Logic Foundations (Chapters 1-3)</h3>
<p>Logic is the language of mathematics. You will learn how to build airtight arguments, spot logical traps, and solve puzzles about truth and lies. If you have ever enjoyed detective stories or mystery games, you will love this part.</p>
<ul>
<li><strong>True or False</strong> (Ch 1): What makes a statement logical? How do AND, OR, and NOT work? Solve puzzles about knights who always tell the truth and liars who always lie.</li>
<li><strong>If...Then</strong> (Ch 2): Master the art of "if P then Q" reasoning. Learn why "if it rains then the ground is wet" does NOT mean "if the ground is wet then it rained."</li>
<li><strong>Contradiction</strong> (Ch 3): The powerful technique of proving something by assuming the opposite and watching it explode.</li>
</ul>

<h3>Part B: The Art of Counting (Chapters 4-8)</h3>
<p>How many ways can you arrange 5 books on a shelf? How many different ice cream sundaes can you make with 10 flavors and 4 toppings? Counting sounds simple, but it leads to surprisingly deep mathematics.</p>
<ul>
<li><strong>Counting Principles</strong> (Ch 4): The two fundamental rules: addition (either/or) and multiplication (and/and).</li>
<li><strong>Permutations and Combinations</strong> (Ch 5-6): When order matters and when it does not.</li>
<li><strong>Inclusion-Exclusion</strong> (Ch 7): Counting by overcounting and then correcting.</li>
<li><strong>Pigeonhole Principle</strong> (Ch 8): If you have 11 socks and 10 drawers, some drawer must have at least 2 socks. This simple idea has stunning consequences.</li>
</ul>

<h3>Part C: Patterns and Sequences (Chapters 9-12)</h3>
<p>Discover hidden patterns in numbers, learn to predict what comes next, and master the art of mathematical induction, the most powerful proof technique in all of mathematics.</p>

<h3>Part D: Strategy and Games (Chapters 13-16)</h3>
<p>Can you guarantee a win at Nim? What makes a game "fair"? When should you bluff, and when should you play it safe? Mathematical game theory has applications from board games to economics to artificial intelligence.</p>

<h3>Part E: Classic Puzzles (Chapters 17-19)</h3>
<p>River crossings, Euler paths, Sudoku, and more. These are the puzzles that have delighted mathematicians for centuries, and now they are yours to conquer.</p>

<div class="env-block intuition">
<strong>How to use this course</strong><br>
You do not have to go in order! The chapters are designed so you can jump to whatever interests you most. That said, Chapters 1-3 (logic) form a foundation that helps with everything else, so they are a good place to start if you are not sure where to begin.
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Which of the four parts (Logic, Counting, Patterns, Strategy) do you think you would enjoy most? Pick one, and write down a question you hope it will answer.',
                    hint: 'There is no wrong answer here. This is about figuring out what excites you.',
                    solution: 'This is a reflection exercise. Any thoughtful answer is a good answer. The goal is to notice which problems make you curious, because curiosity is the engine of mathematical thinking.'
                },
                {
                    question: 'Here is a preview puzzle from each area. Pick one and try to solve it:<br>(a) <strong>Logic:</strong> Alice says "I am a liar." Is Alice a knight (always truthful) or a liar (always lies)?<br>(b) <strong>Counting:</strong> How many 3-letter "words" can you make from the letters A, B, C if repetition is allowed?<br>(c) <strong>Patterns:</strong> What comes next: 1, 4, 9, 16, 25, ...?<br>(d) <strong>Strategy:</strong> There are 15 stones. Two players take turns removing 1, 2, or 3 stones. The player who takes the last stone wins. Should you go first or second?',
                    hint: '(a) If Alice is a knight, she always tells the truth, so "I am a liar" would be true... but then she IS a liar, contradiction!<br>(b) You have 3 choices for each of 3 positions.<br>(c) These are perfect squares: \\(1^2, 2^2, 3^2, \\ldots\\)<br>(d) Think about what happens if there are 4 stones left and it is your opponent\'s turn.',
                    solution: '(a) Alice cannot be a knight (contradiction) and cannot be a liar (a liar saying "I am a liar" would be telling the truth, contradiction). This statement is a <strong>paradox</strong>, and we will study it in Chapter 1.<br>(b) \\(3 \\times 3 \\times 3 = 27\\) words.<br>(c) \\(36 = 6^2\\).<br>(d) Go first and take 3 stones (leaving 12). Then, whatever your opponent takes (call it \\(k\\)), you take \\(4-k\\). This always leaves a multiple of 4 for your opponent, and eventually leaves 4, then 0. You win!'
                }
            ]
        },

        // ===== Section 4: Your first challenge =====
        {
            id: 'your-first-challenge',
            title: 'Your First Challenge',
            content: `
<h2>The Number Guessing Game</h2>

<p>Let us end this introductory chapter with a challenge that brings together several mathematical thinking skills at once.</p>

<div class="env-block example">
<strong>The Guess-My-Rule Game</strong><br>
I have a secret rule that takes a number and gives back another number. You give me inputs, I give you outputs. Your job: figure out my rule using as few guesses as possible.
</div>

<p>Try the interactive game below. Type in numbers and see what comes out. Can you figure out the rule?</p>

<div class="viz-placeholder" data-viz="ch00-guess-rule"></div>

<p>This game illustrates several key mathematical thinking principles:</p>

<ol>
<li><strong>Experiment systematically.</strong> Do not just type random numbers. Start with simple inputs like 0, 1, 2, 3 to see the basic pattern.</li>
<li><strong>Form hypotheses.</strong> After a few data points, guess what the rule might be. Then test your guess with a new input.</li>
<li><strong>Look for counterexamples.</strong> If you think the rule is "double the number," try an input that would distinguish "double" from something else (like "add the number to itself," which is the same thing; but different from "multiply by 2 and add 0" versus "multiply by 2 and subtract 0").</li>
<li><strong>Try edge cases.</strong> What happens with 0? With negative numbers? With very large numbers? These often reveal the true rule.</li>
</ol>

<div class="env-block theorem">
<strong>The Scientific Method in Miniature</strong><br>
The guess-my-rule game is exactly how science works. You observe data, form a hypothesis, test it with new experiments, and revise. Mathematicians and scientists use the same fundamental approach.
</div>

<h3>Looking Ahead</h3>

<p>You have now had a taste of mathematical thinking. You have seen that math is about patterns and reasoning, not just calculation. You have met some puzzles that changed history. You have learned the core strategies that mathematicians use. And you have tried your hand at systematic problem-solving.</p>

<p>In the next chapter, we will dive into the first and most fundamental tool: <strong>logic</strong>. You will learn about true and false statements, about AND, OR, and NOT, and you will solve puzzles about islands where some people always tell the truth and others always lie.</p>

<p>Ready? Let us go!</p>
`,
            visualizations: [
                {
                    id: 'ch00-guess-rule',
                    title: 'Guess My Rule',
                    description: 'Type a number and press Enter to see the output. Figure out the secret rule! Click "New Rule" for a new challenge.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        // Rules
                        var rules = [
                            { fn: function(x) { return 2 * x + 1; }, desc: '2x + 1' },
                            { fn: function(x) { return x * x; }, desc: 'x squared' },
                            { fn: function(x) { return 3 * x - 2; }, desc: '3x - 2' },
                            { fn: function(x) { return x * x + x; }, desc: 'x squared + x' },
                            { fn: function(x) { return Math.abs(x) + 5; }, desc: '|x| + 5' },
                            { fn: function(x) { return 10 - x; }, desc: '10 - x' },
                            { fn: function(x) { return x * x * x; }, desc: 'x cubed' },
                            { fn: function(x) { return 2 * x * x - 1; }, desc: '2x squared - 1' }
                        ];
                        var ruleIdx = Math.floor(Math.random() * rules.length);
                        var currentRule = rules[ruleIdx];
                        var guesses = [];
                        var revealed = false;

                        // Input
                        var inputRow = document.createElement('div');
                        inputRow.style.cssText = 'display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap;';
                        var inputLabel = document.createElement('span');
                        inputLabel.style.cssText = 'color:#c9d1d9;font-size:0.85rem;';
                        inputLabel.textContent = 'Input x = ';
                        var inputField = document.createElement('input');
                        inputField.type = 'number';
                        inputField.style.cssText = 'width:80px;padding:4px 8px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.85rem;';
                        inputField.placeholder = '?';
                        var goBtn = document.createElement('button');
                        goBtn.style.cssText = 'padding:4px 12px;border:1px solid #30363d;border-radius:4px;background:#1a1a40;color:#c9d1d9;font-size:0.78rem;cursor:pointer;';
                        goBtn.textContent = 'Submit';
                        inputRow.appendChild(inputLabel);
                        inputRow.appendChild(inputField);
                        inputRow.appendChild(goBtn);
                        container.appendChild(inputRow);

                        var statusDiv = document.createElement('div');
                        statusDiv.style.cssText = 'color:#8b949e;font-size:0.85rem;margin-top:4px;min-height:1.5em;';
                        container.appendChild(statusDiv);

                        function submitGuess() {
                            var val = parseFloat(inputField.value);
                            if (isNaN(val)) return;
                            var result = currentRule.fn(val);
                            guesses.push({ x: val, y: result });
                            if (guesses.length > 12) guesses.shift();
                            inputField.value = '';
                            inputField.focus();
                            draw();
                        }

                        goBtn.addEventListener('click', submitGuess);
                        inputField.addEventListener('keydown', function(e) {
                            if (e.key === 'Enter') submitGuess();
                        });

                        VizEngine.createButton(controls, 'New Rule', function() {
                            ruleIdx = (ruleIdx + 1) % rules.length;
                            currentRule = rules[ruleIdx];
                            guesses = [];
                            revealed = false;
                            statusDiv.textContent = 'New rule! Start guessing.';
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reveal Rule', function() {
                            revealed = true;
                            statusDiv.textContent = 'The rule was: f(x) = ' + currentRule.desc;
                            draw();
                        });

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            // Title
                            ctx.fillStyle = '#c9d1d9';
                            ctx.font = 'bold 16px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('f(?) = ???', w / 2, 30);

                            // Table header
                            var tableX = 40, tableY = 55;
                            var colW = Math.min(120, (w - 80) / 2);
                            ctx.fillStyle = '#58a6ff';
                            ctx.font = 'bold 13px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Input (x)', tableX + colW / 2, tableY);
                            ctx.fillText('Output f(x)', tableX + colW + colW / 2, tableY);

                            // Divider
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(tableX, tableY + 8);
                            ctx.lineTo(tableX + colW * 2, tableY + 8);
                            ctx.stroke();

                            // Table rows
                            for (var i = 0; i < guesses.length; i++) {
                                var rowY = tableY + 28 + i * 24;
                                ctx.fillStyle = '#c9d1d9';
                                ctx.font = '13px monospace';
                                ctx.textAlign = 'center';
                                ctx.fillText(String(guesses[i].x), tableX + colW / 2, rowY);
                                ctx.fillStyle = '#3fb9a0';
                                ctx.fillText(String(guesses[i].y), tableX + colW + colW / 2, rowY);
                            }

                            if (guesses.length === 0) {
                                ctx.fillStyle = '#4a4a7a';
                                ctx.font = '13px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Enter a number above to begin!', w / 2, h / 2);
                            }

                            // If revealed, show rule
                            if (revealed) {
                                ctx.fillStyle = '#f0883e';
                                ctx.font = 'bold 14px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText('Rule: f(x) = ' + currentRule.desc, w / 2, h - 20);
                            }
                        }

                        draw();
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: 'In the guess-my-rule game, what is the minimum number of inputs you need to guarantee you can identify a linear rule \\(f(x) = ax + b\\)?',
                    hint: 'A linear function is determined by its slope \\(a\\) and intercept \\(b\\). Each data point gives you one equation. How many unknowns are there?',
                    solution: 'You need exactly 2 data points. With two points \\((x_1, y_1)\\) and \\((x_2, y_2)\\) where \\(x_1 \\neq x_2\\), you can solve for \\(a = \\frac{y_2 - y_1}{x_2 - x_1}\\) and \\(b = y_1 - a \\cdot x_1\\). However, you might want a 3rd point to <em>verify</em> that the rule is actually linear and not something more complicated!'
                },
                {
                    question: 'Make up your own "guess my rule" game for a friend. Design a rule that is interesting but not impossible to guess. Write down 5 input-output pairs as clues.',
                    hint: 'Good rules use operations like squaring, adding a constant, or combining two operations. Rules that are too complex (like "if x is prime, double it; otherwise, add 7") are unfair because no finite set of clues would make them obvious.',
                    solution: 'Example: the rule \\(f(x) = x^2 - x\\). Five clues: \\(f(0) = 0\\), \\(f(1) = 0\\), \\(f(2) = 2\\), \\(f(3) = 6\\), \\(f(4) = 12\\). The pattern in the outputs (0, 0, 2, 6, 12) has differences (0, 2, 4, 6) which increase by 2 each time, a hallmark of a quadratic rule.'
                },
                {
                    question: 'Here is a harder version of the guess-my-rule game. I give you: \\(f(1) = 1\\), \\(f(2) = 3\\), \\(f(3) = 7\\), \\(f(4) = 15\\), \\(f(5) = 31\\). What is the rule?',
                    hint: 'Look at the outputs: 1, 3, 7, 15, 31. Try computing \\(f(n) + 1\\) for each: 2, 4, 8, 16, 32. Recognize those numbers?',
                    solution: 'The outputs plus 1 are \\(2, 4, 8, 16, 32 = 2^1, 2^2, 2^3, 2^4, 2^5\\). So the rule is \\(f(n) = 2^n - 1\\). Check: \\(f(1) = 2^1 - 1 = 1\\), \\(f(2) = 2^2 - 1 = 3\\), \\(f(3) = 2^3 - 1 = 7\\). Correct! These are also the <strong>Mersenne numbers</strong>, and when they happen to be prime, they are called Mersenne primes.'
                }
            ]
        }
    ]
});
})();
