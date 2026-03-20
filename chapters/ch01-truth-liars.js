// === Chapter 1: Truth-Tellers & Liars ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch01',
    number: 1,
    title: 'Truth-Tellers & Liars',
    subtitle: 'Knights always tell the truth, knaves always lie',
    sections: [
        // ================================================================
        // SECTION 0: Motivation
        // ================================================================
        {
            id: 'sec-motivation',
            title: 'Why Knights & Knaves?',
            content: `
<h2>Why Knights & Knaves?</h2>

<div class="env-block intuition">
    <div class="env-title">A Puzzle to Start</div>
    <div class="env-body">
        <p>You are on an island where every person is either a <strong>knight</strong> (always tells the truth) or a <strong>knave</strong> (always lies). You meet two people, Alice and Bob. Alice says: "We are both knaves." What are Alice and Bob?</p>
        <p>Think about it for a moment before reading on. Can Alice be a knight? Can Alice be a knave?</p>
    </div>
</div>

<p>This is a classic <strong>knights-and-knaves</strong> puzzle, a genre invented by the logician and magician <strong>Raymond Smullyan</strong> (1919--2017). The puzzles appear in his delightful books <em>What Is the Name of This Book?</em> (1978) and <em>The Lady or the Tiger?</em> (1982).</p>

<p>Why study these puzzles? Because they train a specific thinking skill that is central to mathematics: <strong>rigorous case analysis</strong>. When you solve a knights-and-knaves puzzle, you are doing exactly what a mathematician does in a proof: assume something, see what follows, check for contradictions, and build your conclusion on what survives.</p>

<h3>The Answer</h3>

<p>Suppose Alice is a knight. Then her statement "We are both knaves" is true, which means Alice is a knave. Contradiction! So Alice is not a knight.</p>

<p>Therefore Alice is a knave. Her statement "We are both knaves" is a lie. The negation of "both knaves" is "at least one is a knight." Since Alice is a knave, the knight must be Bob.</p>

<p><strong>Answer:</strong> Alice is a knave, Bob is a knight.</p>

<div class="env-block remark">
    <div class="env-title">The Logical Pattern</div>
    <div class="env-body">
        <p>Notice the method: we tried each possibility for Alice (knight or knave), checked whether the resulting statement was consistent, and eliminated the contradictory case. This is <strong>proof by contradiction</strong> in miniature. Every knights-and-knaves puzzle is a small exercise in deductive logic.</p>
    </div>
</div>

<h3>What You Will Learn</h3>

<p>In this chapter, you will:</p>
<ul>
    <li>Master the rules of knight/knave reasoning</li>
    <li>Learn the famous "one-question trick" for fork-in-the-road puzzles</li>
    <li>Tackle harder puzzles with three or more people</li>
    <li>Encounter self-referential paradoxes and see why they matter</li>
    <li>Build interactive puzzles and check your reasoning in real time</li>
</ul>
`,
            visualizations: [
                {
                    id: 'viz-knights-knaves',
                    title: 'Knight or Knave? Interactive Puzzle',
                    description: 'Click each person to toggle between Knight and Knave. The system checks whether your assignment is logically consistent with the statements.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var puzzles = [
                            {
                                people: ['Alice', 'Bob'],
                                statements: [
                                    { speaker: 0, text: '"We are both knaves."' },
                                ],
                                check: function(types) {
                                    // Alice says "We are both knaves"
                                    var claim = (types[0] === 'knave' && types[1] === 'knave');
                                    var aliceConsistent = types[0] === 'knight' ? claim : !claim;
                                    return aliceConsistent;
                                },
                                solution: [1, 0] // knave, knight
                            },
                            {
                                people: ['Alice', 'Bob'],
                                statements: [
                                    { speaker: 0, text: '"At least one of us is a knave."' },
                                ],
                                check: function(types) {
                                    var claim = (types[0] === 'knave' || types[1] === 'knave');
                                    return types[0] === 'knight' ? claim : !claim;
                                },
                                solution: [0, 1]
                            },
                            {
                                people: ['Alice', 'Bob'],
                                statements: [
                                    { speaker: 0, text: '"I am the same type as Bob."' },
                                    { speaker: 1, text: '"Alice and I are different types."' }
                                ],
                                check: function(types) {
                                    var claim1 = (types[0] === types[1]);
                                    var ok1 = types[0] === 'knight' ? claim1 : !claim1;
                                    var claim2 = (types[0] !== types[1]);
                                    var ok2 = types[1] === 'knight' ? claim2 : !claim2;
                                    return ok1 && ok2;
                                },
                                solution: [1, 0]
                            }
                        ];

                        var puzzleIdx = 0;
                        var types = ['knight', 'knight']; // user guess

                        var prevBtn = VizEngine.createButton(controls, 'Prev Puzzle', function() {
                            puzzleIdx = (puzzleIdx - 1 + puzzles.length) % puzzles.length;
                            types = puzzles[puzzleIdx].people.map(function() { return 'knight'; });
                            draw();
                        });
                        var nextBtn = VizEngine.createButton(controls, 'Next Puzzle', function() {
                            puzzleIdx = (puzzleIdx + 1) % puzzles.length;
                            types = puzzles[puzzleIdx].people.map(function() { return 'knight'; });
                            draw();
                        });

                        var knightColor = viz.colors.blue;
                        var knaveColor = viz.colors.red;

                        // Click handling
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var p = puzzles[puzzleIdx];
                            var spacing = viz.width / (p.people.length + 1);
                            for (var i = 0; i < p.people.length; i++) {
                                var cx = spacing * (i + 1);
                                var cy = 140;
                                var dx = mx - cx, dy = my - cy;
                                if (dx * dx + dy * dy < 40 * 40) {
                                    types[i] = types[i] === 'knight' ? 'knave' : 'knight';
                                    draw();
                                    return;
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var p = puzzles[puzzleIdx];

                            viz.screenText('Puzzle ' + (puzzleIdx + 1) + ' of ' + puzzles.length, viz.width / 2, 20, viz.colors.text, 12);
                            viz.screenText('Click a person to toggle Knight/Knave', viz.width / 2, 38, viz.colors.text, 11);

                            var spacing = viz.width / (p.people.length + 1);

                            // Draw people
                            for (var i = 0; i < p.people.length; i++) {
                                var cx = spacing * (i + 1);
                                var cy = 140;
                                var col = types[i] === 'knight' ? knightColor : knaveColor;

                                // Circle body
                                ctx.fillStyle = col + '44';
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.arc(cx, cy, 35, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.stroke();

                                // Name
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 14px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(p.people[i], cx, cy - 8);

                                // Type
                                ctx.fillStyle = col;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText(types[i].toUpperCase(), cx, cy + 10);

                                // Knight/Knave icon
                                if (types[i] === 'knight') {
                                    // Simple crown
                                    ctx.fillStyle = viz.colors.yellow;
                                    ctx.beginPath();
                                    ctx.moveTo(cx - 12, cy - 30);
                                    ctx.lineTo(cx - 8, cy - 40);
                                    ctx.lineTo(cx, cy - 33);
                                    ctx.lineTo(cx + 8, cy - 40);
                                    ctx.lineTo(cx + 12, cy - 30);
                                    ctx.closePath();
                                    ctx.fill();
                                } else {
                                    // Simple horns
                                    ctx.strokeStyle = viz.colors.red;
                                    ctx.lineWidth = 2;
                                    ctx.beginPath();
                                    ctx.moveTo(cx - 8, cy - 35);
                                    ctx.lineTo(cx - 14, cy - 50);
                                    ctx.stroke();
                                    ctx.beginPath();
                                    ctx.moveTo(cx + 8, cy - 35);
                                    ctx.lineTo(cx + 14, cy - 50);
                                    ctx.stroke();
                                }
                            }

                            // Draw statements
                            var stY = 210;
                            ctx.textAlign = 'center';
                            for (var s = 0; s < p.statements.length; s++) {
                                var st = p.statements[s];
                                var speakerName = p.people[st.speaker];
                                ctx.fillStyle = viz.colors.white;
                                ctx.font = '13px -apple-system,sans-serif';
                                ctx.fillText(speakerName + ' says: ' + st.text, viz.width / 2, stY + s * 28);
                            }

                            // Check consistency
                            var consistent = p.check(types);
                            var resultY = 310;
                            if (consistent) {
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.fillText('Consistent! This assignment works.', viz.width / 2, resultY);
                            } else {
                                ctx.fillStyle = viz.colors.red;
                                ctx.font = 'bold 16px -apple-system,sans-serif';
                                ctx.fillText('Contradiction! Try again.', viz.width / 2, resultY);
                            }

                            // Explanation of consistency
                            var expY = 340;
                            ctx.font = '11px -apple-system,sans-serif';
                            for (var s2 = 0; s2 < p.statements.length; s2++) {
                                var st2 = p.statements[s2];
                                var speaker = p.people[st2.speaker];
                                var isKnight = types[st2.speaker] === 'knight';
                                ctx.fillStyle = viz.colors.text;
                                ctx.fillText(
                                    speaker + ' is a ' + types[st2.speaker] +
                                    ', so their statement must be ' +
                                    (isKnight ? 'TRUE' : 'FALSE'),
                                    viz.width / 2, expY + s2 * 20
                                );
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'You meet one person on the island. They say: "I am a knave." What are they?',
                    hint: 'Can a knight say this? Can a knave say this? Check both cases.',
                    solution: 'If they are a knight, their statement "I am a knave" is true, meaning they are a knave. Contradiction. If they are a knave, their statement "I am a knave" is true, but knaves always lie, so the statement must be false. Contradiction again! Neither case works, so no one on the island can say "I am a knave." This puzzle has no solution within the standard rules, which is itself the point (see the section on self-reference).'
                },
                {
                    question: 'Alice says: "Bob is a knave." Bob says: "Alice and I are the same type." What are Alice and Bob?',
                    hint: 'Try assuming Alice is a knight and see if Bob\'s statement is consistent. Then try Alice as a knave.',
                    solution: 'If Alice is a knight, then Bob really is a knave. Bob (a knave) says "we are the same type," which is a lie. Since they are different types, his statement is indeed false. Consistent! If Alice is a knave, then Bob is actually a knight. Bob (a knight) says "we are the same type," which must be true. But they are different types. Contradiction. So Alice is a knight and Bob is a knave.'
                }
            ]
        },

        // ================================================================
        // SECTION 1: The Rules
        // ================================================================
        {
            id: 'sec-rules',
            title: 'The Rules',
            content: `
<h2>The Rules</h2>

<p>The setup is always the same. You are on an island (or in a village, or at a party) where every inhabitant is one of two types:</p>

<div class="env-block definition">
    <strong>Knight</strong><br>
    A knight always tells the truth. Every statement a knight makes is true.
</div>

<div class="env-block definition">
    <strong>Knave</strong><br>
    A knave always lies. Every statement a knave makes is false.
</div>

<p>There is no in-between. Nobody sometimes tells the truth and sometimes lies. Nobody is mistaken or confused. Knights are perfectly truthful; knaves are perfectly dishonest.</p>

<h3>The Logical Framework</h3>

<p>Let us be precise. Suppose person \\(X\\) makes a statement \\(S\\). Then:</p>

<ul>
    <li>If \\(X\\) is a <strong>knight</strong>, then \\(S\\) is <strong>true</strong>.</li>
    <li>If \\(X\\) is a <strong>knave</strong>, then \\(S\\) is <strong>false</strong>.</li>
</ul>

<p>Equivalently, we can write this as a biconditional:</p>

\\[
X \\text{ is a knight} \\;\\Longleftrightarrow\\; S \\text{ is true}.
\\]

<p>This single equivalence is the engine of every puzzle. When you know the type, you know the truth value of the statement. When you know the truth value, you know the type.</p>

<h3>The Method of Cases</h3>

<p>The basic solving strategy is:</p>
<ol>
    <li><strong>Assume</strong> someone is a knight. Deduce consequences.</li>
    <li>Check if the consequences are <strong>consistent</strong>.</li>
    <li>If yes, you have a candidate solution. If no, that person must be a knave.</li>
    <li><strong>Repeat</strong> for other unknowns until everything is determined.</li>
</ol>

<div class="env-block example">
    <div class="env-title">Example: A Simple One-Person Puzzle</div>
    <div class="env-body">
        <p>You meet person A, who says: "I am a knight."</p>
        <p><strong>Case 1:</strong> A is a knight. Then "I am a knight" is true. Consistent.</p>
        <p><strong>Case 2:</strong> A is a knave. Then "I am a knight" is false, meaning A is not a knight, i.e., A is a knave. Also consistent!</p>
        <p>Both cases work, so this single statement is not enough to determine A's type. The statement "I am a knight" carries zero information, since both types would say it.</p>
    </div>
</div>

<div class="env-block remark">
    <div class="env-title">Key Insight</div>
    <div class="env-body">
        <p>On this island, every person will claim to be a knight. A knight says "I am a knight" (truthfully). A knave says "I am a knight" (a lie). So the statement "I am a knight" tells you nothing at all.</p>
    </div>
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Two people, A and B, meet you. A says nothing. B says: "A would say that he is a knave." What is B?',
                    hint: 'We showed earlier that no one on the island can say "I am a knave." So what would A actually say?',
                    solution: 'We know that no islander can truthfully or falsely say "I am a knave." Whether A is a knight or knave, A would never say "I am a knave." So B\'s claim that "A would say he is a knave" is false. Since B made a false statement, B is a knave.'
                }
            ]
        },

        // ================================================================
        // SECTION 2: The One-Question Trick
        // ================================================================
        {
            id: 'sec-one-question',
            title: 'The One-Question Trick',
            content: `
<h2>The One-Question Trick</h2>

<p>Here is the most famous puzzle in the knights-and-knaves genre:</p>

<div class="env-block intuition">
    <div class="env-title">The Fork in the Road</div>
    <div class="env-body">
        <p>You come to a fork in the road. One path leads to safety, the other to danger. A single islander stands at the fork. You do not know if they are a knight or a knave. You may ask them <strong>one yes-or-no question</strong>. What do you ask to find the safe path?</p>
    </div>
</div>

<h3>Why Simple Questions Fail</h3>

<p>Your first instinct might be: "Which road is safe?" But if the islander is a knave, they will lie and point you to danger. You cannot trust the answer because you do not know their type.</p>

<p>You might try: "Are you a knight?" But as we saw, both knights and knaves answer "Yes" to this. Useless.</p>

<h3>The Trick: Nesting</h3>

<p>The key insight is to ask a question that <strong>cancels out</strong> the effect of lying. Ask:</p>

<div class="env-block theorem">
    <div class="env-title">The One-Question Solution</div>
    <div class="env-body">
        <p>"If I asked you whether the left road is safe, would you say yes?"</p>
    </div>
</div>

<p>Let us verify that this works in all cases. Suppose the left road IS safe.</p>

<ul>
    <li><strong>Knight:</strong> If you asked "Is the left road safe?" they would say "Yes" (truthfully). So when you ask "Would you say yes?", they truthfully answer "Yes."</li>
    <li><strong>Knave:</strong> If you asked "Is the left road safe?" they would lie and say "No." So when you ask "Would you say yes?", they must lie about their answer. Their answer would be "No," so they lie and say "Yes."</li>
</ul>

<p>Both types say "Yes" when the left road is safe! Now suppose the left road is NOT safe:</p>

<ul>
    <li><strong>Knight:</strong> Would say "No" to the direct question. Asked if they'd say "Yes," they truthfully say "No."</li>
    <li><strong>Knave:</strong> Would lie and say "Yes" to the direct question. Asked if they'd say "Yes," they lie and say "No."</li>
</ul>

<p>Both types say "No" when the left road is dangerous. The double layer of truth/lies cancels out, like multiplying a negative by a negative.</p>

<div class="viz-placeholder" data-viz="viz-one-question"></div>

<div class="env-block remark">
    <div class="env-title">The Mathematical Principle</div>
    <div class="env-body">
        <p>The trick works because lying is self-inverse: lying about a lie gives the truth. Formally, if \\(f\\) denotes the "negate" function, then \\(f(f(x)) = x\\). A knight applies \\(f\\) zero times (truth), a knave applies it twice (lie about the lie), and \\(f^0 = f^2 = \\text{identity}\\). This is the algebraic reason the trick works.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-one-question',
                    title: 'The Fork in the Road',
                    description: 'Step through the one-question trick. Toggle the islander\'s type and which road is safe to see how the nested question always gives the correct answer.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var isKnight = true;
                        var leftIsSafe = true;
                        var step = 0;

                        VizEngine.createButton(controls, 'Toggle Type', function() {
                            isKnight = !isKnight;
                            step = 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Toggle Safe Road', function() {
                            leftIsSafe = !leftIsSafe;
                            step = 0;
                            draw();
                        });
                        VizEngine.createButton(controls, 'Next Step', function() {
                            step = Math.min(step + 1, 3);
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            // Title
                            viz.screenText('The Fork in the Road', viz.width / 2, 20, viz.colors.white, 16);

                            // Draw fork
                            var forkX = viz.width / 2, forkY = 280;

                            // Roads
                            ctx.strokeStyle = viz.colors.text;
                            ctx.lineWidth = 4;
                            // Left road
                            ctx.beginPath();
                            ctx.moveTo(forkX, forkY);
                            ctx.lineTo(forkX - 120, forkY - 80);
                            ctx.stroke();
                            // Right road
                            ctx.beginPath();
                            ctx.moveTo(forkX, forkY);
                            ctx.lineTo(forkX + 120, forkY - 80);
                            ctx.stroke();
                            // Path leading in
                            ctx.beginPath();
                            ctx.moveTo(forkX, forkY);
                            ctx.lineTo(forkX, forkY + 60);
                            ctx.stroke();

                            // Labels on roads
                            var leftCol = leftIsSafe ? viz.colors.green : viz.colors.red;
                            var rightCol = leftIsSafe ? viz.colors.red : viz.colors.green;
                            ctx.font = 'bold 13px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillStyle = leftCol;
                            ctx.fillText(leftIsSafe ? 'SAFE' : 'DANGER', forkX - 120, forkY - 90);
                            ctx.fillStyle = rightCol;
                            ctx.fillText(leftIsSafe ? 'DANGER' : 'SAFE', forkX + 120, forkY - 90);

                            // Islander
                            var islanderX = forkX + 60, islanderY = 300;
                            var col = isKnight ? viz.colors.blue : viz.colors.red;
                            ctx.fillStyle = col + '44';
                            ctx.strokeStyle = col;
                            ctx.lineWidth = 3;
                            ctx.beginPath();
                            ctx.arc(islanderX, islanderY, 25, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();

                            ctx.fillStyle = viz.colors.white;
                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.fillText(isKnight ? 'KNIGHT' : 'KNAVE', islanderX, islanderY);

                            // You
                            var youX = forkX - 60, youY = 350;
                            ctx.fillStyle = viz.colors.yellow + '44';
                            ctx.strokeStyle = viz.colors.yellow;
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.arc(youX, youY, 20, 0, Math.PI * 2);
                            ctx.fill();
                            ctx.stroke();
                            ctx.fillStyle = viz.colors.white;
                            ctx.font = '12px -apple-system,sans-serif';
                            ctx.fillText('YOU', youX, youY);

                            // Step-by-step reasoning
                            var textY = 50;
                            ctx.textAlign = 'left';
                            ctx.font = '12px -apple-system,sans-serif';

                            ctx.fillStyle = viz.colors.white;
                            ctx.fillText('You ask: "If I asked you whether the LEFT road is safe, would you say yes?"', 30, textY);

                            if (step >= 1) {
                                // Inner question
                                var innerAnswer = leftIsSafe;
                                var innerSays = isKnight ? innerAnswer : !innerAnswer;
                                ctx.fillStyle = viz.colors.teal;
                                ctx.fillText(
                                    'Step 1: Inner question "Is left safe?" Truth: ' + (leftIsSafe ? 'YES' : 'NO') +
                                    '. ' + (isKnight ? 'Knight' : 'Knave') + ' would say: ' + (innerSays ? 'YES' : 'NO'),
                                    30, textY + 24
                                );
                            }

                            if (step >= 2) {
                                var innerSays2 = isKnight ? leftIsSafe : !leftIsSafe;
                                var outerAnswer = isKnight ? innerSays2 : !innerSays2;
                                ctx.fillStyle = viz.colors.orange;
                                ctx.fillText(
                                    'Step 2: "Would you say yes?" Their answer was ' + (innerSays2 ? 'YES' : 'NO') +
                                    '. ' + (isKnight ? 'Truthfully reports' : 'Lies about it') +
                                    ': says ' + (outerAnswer ? 'YES' : 'NO'),
                                    30, textY + 48
                                );
                            }

                            if (step >= 3) {
                                var finalAnswer = leftIsSafe; // always matches reality
                                ctx.fillStyle = viz.colors.green;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.fillText(
                                    'Result: They say "' + (finalAnswer ? 'YES' : 'NO') +
                                    '" — which correctly tells you the left road is ' +
                                    (leftIsSafe ? 'SAFE' : 'DANGEROUS') + '!',
                                    30, textY + 76
                                );
                                ctx.fillStyle = viz.colors.purple;
                                ctx.font = '12px -apple-system,sans-serif';
                                ctx.fillText('The double negation cancels out: lie(lie(x)) = truth(truth(x)) = x', 30, textY + 100);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Can you find a different one-question solution? What if you ask: "Would a knave say the left road is safe?" Analyze all four cases.',
                    hint: 'Consider what a knave would say about the left road. Then consider how a knight and a knave each respond to your question about that.',
                    solution: 'If left is safe: A knave would say "No" (lying). Knight honestly reports that: "No." Knave lies about that: "Yes." So the answers differ by type, which is not what we want. This question does NOT work as a universal solution. The nesting trick must use "If I asked YOU" so the same person lies (or tells truth) twice.'
                },
                {
                    question: 'Suppose there are THREE roads (left, middle, right) and exactly one is safe. You get one yes-or-no question. Can you still find the safe road?',
                    hint: 'A yes-or-no question can only distinguish 2 possibilities. You have 3 roads.',
                    solution: 'No. A single yes-or-no question can distinguish at most 2 outcomes. With 3 roads and no additional information, one question is not enough. You would need at least 2 yes-or-no questions (since \\(2^2 = 4 \\geq 3\\)). This is an information-theoretic argument: one bit cannot encode \\(\\lceil \\log_2 3 \\rceil = 2\\) bits of information.'
                }
            ]
        },

        // ================================================================
        // SECTION 3: Harder Puzzles
        // ================================================================
        {
            id: 'sec-harder',
            title: 'Harder Puzzles',
            content: `
<h2>Harder Puzzles: Three or More People</h2>

<p>When puzzles involve three or more people, the deductions form <strong>chains</strong>. One person's statement constrains another's type, which constrains a third's, and so on. The key is to find a starting point: a statement that lets you determine at least one person's type, then propagate from there.</p>

<div class="env-block example">
    <div class="env-title">Example: Three People</div>
    <div class="env-body">
        <p>You meet Alice, Bob, and Charlie.</p>
        <ul>
            <li>Alice says: "Bob is a knave."</li>
            <li>Bob says: "Charlie is a knave."</li>
            <li>Charlie says: "Alice and Bob are both knaves."</li>
        </ul>
        <p>How many knights are there?</p>
    </div>
</div>

<h3>Solution by Chain Deduction</h3>

<p><strong>Case 1: Alice is a knight.</strong></p>
<ul>
    <li>Alice tells truth, so Bob is a knave.</li>
    <li>Bob lies, so Charlie is actually a knight.</li>
    <li>Charlie tells truth, so "Alice and Bob are both knaves" is true. But we said Alice is a knight. <strong>Contradiction!</strong></li>
</ul>

<p><strong>Case 2: Alice is a knave.</strong></p>
<ul>
    <li>Alice lies, so Bob is actually a knight.</li>
    <li>Bob tells truth, so Charlie is a knave.</li>
    <li>Charlie lies, so "Alice and Bob are both knaves" is false. This means at least one of Alice and Bob is a knight. Indeed, Bob is a knight. <strong>Consistent!</strong></li>
</ul>

<p><strong>Answer:</strong> Alice = knave, Bob = knight, Charlie = knave. There is exactly 1 knight.</p>

<div class="viz-placeholder" data-viz="viz-deduction-chain"></div>

<div class="env-block remark">
    <div class="env-title">Strategy: Follow the Chain</div>
    <div class="env-body">
        <p>In chain puzzles, look for a statement that directly links two people's types. Start with one assumption and follow the chain of implications. If you hit a contradiction, go back and flip your starting assumption. This is systematic and always works.</p>
    </div>
</div>

<h3>Harder Example: Circular Statements</h3>

<div class="env-block example">
    <div class="env-title">Example: A Circle of Three</div>
    <div class="env-body">
        <p>Alice says: "Bob is a knight." Bob says: "Charlie is a knight." Charlie says: "Alice is a knave."</p>
        <p>If Alice is a knight, then Bob is a knight (Alice says so), then Charlie is a knight (Bob says so), then Alice is a knave (Charlie says so). Contradiction with our assumption.</p>
        <p>If Alice is a knave, then Bob is not a knight, so Bob is a knave. Then Charlie is not a knight, so Charlie is a knave. Then "Alice is a knave" is a lie, so Alice is a knight. Contradiction again!</p>
        <p>Wait, no puzzle should be impossible... Let us re-check. Charlie (knave) says "Alice is a knave." This is false, so Alice is a knight. But we assumed Alice is a knave. Contradiction in both cases! This puzzle has <strong>no valid assignment</strong>. It is an inconsistent puzzle.</p>
    </div>
</div>

<p>Not every set of statements admits a consistent assignment. A well-constructed puzzle guarantees exactly one solution. Detecting inconsistency is itself a valuable skill.</p>
`,
            visualizations: [
                {
                    id: 'viz-deduction-chain',
                    title: 'Deduction Chain',
                    description: 'Watch the chain deduction unfold step by step for a 3-person puzzle. Toggle the starting assumption to see how contradictions arise.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var startAsKnight = true;
                        var step = 0;

                        VizEngine.createButton(controls, 'Alice = Knight', function() {
                            startAsKnight = true; step = 0; draw();
                        });
                        VizEngine.createButton(controls, 'Alice = Knave', function() {
                            startAsKnight = false; step = 0; draw();
                        });
                        VizEngine.createButton(controls, 'Next Step', function() {
                            step = Math.min(step + 1, 4);
                            draw();
                        });
                        VizEngine.createButton(controls, 'Reset', function() {
                            step = 0; draw();
                        });

                        var names = ['Alice', 'Bob', 'Charlie'];
                        var stmts = [
                            'says: "Bob is a knave."',
                            'says: "Charlie is a knave."',
                            'says: "Alice & Bob are both knaves."'
                        ];

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Chain Deduction: 3-Person Puzzle', viz.width / 2, 20, viz.colors.white, 15);

                            // Draw three people in a row
                            var positions = [
                                { x: 120, y: 140 },
                                { x: 280, y: 140 },
                                { x: 440, y: 140 }
                            ];

                            // Compute types based on assumption and step
                            var types = [null, null, null];
                            var contradiction = false;

                            if (step >= 1) types[0] = startAsKnight ? 'knight' : 'knave';
                            if (step >= 2) {
                                // Alice says "Bob is knave"
                                if (types[0] === 'knight') types[1] = 'knave';
                                else types[1] = 'knight'; // Alice lies, Bob is actually knight
                            }
                            if (step >= 3) {
                                // Bob says "Charlie is knave"
                                if (types[1] === 'knight') types[2] = 'knave';
                                else types[2] = 'knight';
                            }
                            if (step >= 4) {
                                // Charlie says "Alice and Bob are both knaves"
                                var claim = (types[0] === 'knave' && types[1] === 'knave');
                                var charlieConsistent;
                                if (types[2] === 'knight') charlieConsistent = claim;
                                else charlieConsistent = !claim;
                                contradiction = !charlieConsistent;
                            }

                            // Draw people
                            for (var i = 0; i < 3; i++) {
                                var p = positions[i];
                                var col = viz.colors.text;
                                if (types[i] === 'knight') col = viz.colors.blue;
                                else if (types[i] === 'knave') col = viz.colors.red;

                                ctx.fillStyle = col + '44';
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.arc(p.x, p.y, 30, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.stroke();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(names[i], p.x, p.y - 5);

                                if (types[i]) {
                                    ctx.fillStyle = col;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.fillText(types[i].toUpperCase(), p.x, p.y + 12);
                                } else {
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '11px -apple-system,sans-serif';
                                    ctx.fillText('?', p.x, p.y + 12);
                                }

                                // Statement below
                                ctx.fillStyle = viz.colors.text;
                                ctx.font = '10px -apple-system,sans-serif';
                                ctx.fillText(stmts[i], p.x, p.y + 55);
                            }

                            // Arrows between deduction steps
                            if (step >= 2) {
                                ctx.strokeStyle = viz.colors.yellow;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(150, 140);
                                ctx.lineTo(248, 140);
                                ctx.stroke();
                                // arrowhead
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.beginPath();
                                ctx.moveTo(248, 140);
                                ctx.lineTo(240, 134);
                                ctx.lineTo(240, 146);
                                ctx.closePath();
                                ctx.fill();
                            }
                            if (step >= 3) {
                                ctx.strokeStyle = viz.colors.yellow;
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(310, 140);
                                ctx.lineTo(408, 140);
                                ctx.stroke();
                                ctx.fillStyle = viz.colors.yellow;
                                ctx.beginPath();
                                ctx.moveTo(408, 140);
                                ctx.lineTo(400, 134);
                                ctx.lineTo(400, 146);
                                ctx.closePath();
                                ctx.fill();
                            }

                            // Step descriptions
                            var descY = 240;
                            ctx.textAlign = 'left';
                            ctx.font = '12px -apple-system,sans-serif';

                            if (step >= 1) {
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText('Step 1: Assume Alice is a ' + (startAsKnight ? 'KNIGHT' : 'KNAVE'), 30, descY);
                            }
                            if (step >= 2) {
                                ctx.fillStyle = viz.colors.teal;
                                var aliceType = startAsKnight ? 'knight' : 'knave';
                                var bobType = startAsKnight ? 'knave' : 'knight';
                                ctx.fillText(
                                    'Step 2: Alice (' + aliceType + ') says "Bob is knave" => ' +
                                    (startAsKnight ? 'True => Bob is knave' : 'Lie => Bob is knight'),
                                    30, descY + 22
                                );
                            }
                            if (step >= 3) {
                                ctx.fillStyle = viz.colors.orange;
                                var bobType2 = startAsKnight ? 'knave' : 'knight';
                                ctx.fillText(
                                    'Step 3: Bob (' + bobType2 + ') says "Charlie is knave" => ' +
                                    (startAsKnight ? 'Lie => Charlie is knight' : 'True => Charlie is knave'),
                                    30, descY + 44
                                );
                            }
                            if (step >= 4) {
                                if (contradiction) {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.fillText('Step 4: CONTRADICTION! Charlie\'s statement is inconsistent.', 30, descY + 66);
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.fillText('This assumption fails. Try the other case.', 30, descY + 88);
                                } else {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 13px -apple-system,sans-serif';
                                    ctx.fillText('Step 4: CONSISTENT! Charlie\'s statement checks out.', 30, descY + 66);
                                    ctx.font = '12px -apple-system,sans-serif';
                                    ctx.fillText('Solution: Alice=knave, Bob=knight, Charlie=knave', 30, descY + 88);
                                }
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'You meet Alice, Bob, and Charlie. Alice says: "Exactly one of us is a knight." Bob says: "Exactly two of us are knights." Who is what?',
                    hint: 'If Alice (knight) is right that exactly one is a knight, then neither Bob nor Charlie is a knight. Check if Bob\'s statement (false for a knave) is consistent. Then try Alice as a knave.',
                    solution: 'If Alice is a knight, exactly one knight exists (Alice). So Bob and Charlie are knaves. Bob (knave) says "exactly two knights," which is false (there is one). Consistent. Charlie (knave) says nothing, no conflict. Check: is there another case? If Alice is a knave, then it is NOT the case that exactly one is a knight (0, 2, or 3 knights). If Bob is a knight, exactly 2 are knights. The third must be Charlie. So Alice=knave, Bob=knight, Charlie=knight. Bob says "exactly 2 knights" (true, Bob and Charlie). Alice says "exactly 1 knight" (false, since there are 2). Charlie says nothing. Also consistent! Two solutions exist unless Charlie makes a constraining statement.'
                },
            ]
        },

        // ================================================================
        // SECTION 4: Self-Reference Paradoxes
        // ================================================================
        {
            id: 'sec-self-reference',
            title: 'Self-Reference Paradoxes',
            content: `
<h2>Self-Reference Paradoxes</h2>

<p>Some statements in the knights-and-knaves world lead to paradoxes. These are not flaws; they are windows into deep ideas in logic and mathematics.</p>

<h3>"I Am a Liar"</h3>

<p>We have already seen that no islander can say "I am a knave." Let us think more carefully about why.</p>

<div class="env-block theorem">
    <div class="env-title">Theorem (Impossibility of Self-Denial)</div>
    <div class="env-body">
        <p>On an island of knights and knaves, no inhabitant can say "I am a knave."</p>
        <p><strong>Proof.</strong> Suppose person \\(X\\) says "I am a knave."</p>
        <ul>
            <li>If \\(X\\) is a knight: the statement is true, so \\(X\\) is a knave. Contradiction.</li>
            <li>If \\(X\\) is a knave: the statement is false, so \\(X\\) is not a knave, meaning \\(X\\) is a knight. Contradiction.</li>
        </ul>
        <p>Both cases lead to contradiction, so no inhabitant can make this statement. \\(\\square\\)</p>
    </div>
</div>

<p>This is exactly the <strong>Liar's Paradox</strong> in disguise. "I am a liar" in everyday language and "I am a knave" on the island are the same logical structure: a statement that, if true, must be false, and if false, must be true.</p>

<h3>Connection to Godel's Incompleteness Theorem</h3>

<p>In 1931, Kurt Godel proved one of the most profound results in all of mathematics: any consistent formal system strong enough to do arithmetic contains statements that are true but unprovable within the system. His proof used a brilliant trick: he constructed a mathematical statement that essentially says "I am not provable." This is a cousin of the Liar's Paradox, with "provable" replacing "true."</p>

<p>If the statement "I am not provable" is provable, then it is true, meaning it is not provable. Contradiction. So it must be unprovable. But then what it says is correct, so it is true. A true statement that cannot be proved!</p>

<div class="viz-placeholder" data-viz="viz-paradox-demo"></div>

<h3>Other Self-Referential Gems</h3>

<div class="env-block example">
    <div class="env-title">The Card Paradox</div>
    <div class="env-body">
        <p>A card has "The statement on the other side is false" written on both sides. Pick a side: if it is true, then the other side is false, which means this side is true... wait, we just went in a circle.</p>
    </div>
</div>

<div class="env-block example">
    <div class="env-title">The Unexpected Hanging</div>
    <div class="env-body">
        <p>A judge tells a prisoner: "You will be hanged one day next week, and it will be a surprise; you will not be able to deduce the day in advance." The prisoner reasons: it cannot be Friday (I'd know by Thursday night). Eliminating Friday, it cannot be Thursday (I'd know by Wednesday night). Continuing, no day works! Reassured, the prisoner is completely surprised when hanged on Wednesday.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-paradox-demo',
                    title: '"This Statement is False" — Animated',
                    description: 'Watch the paradox loop: if the statement is true, it must be false, but if false, it must be true. The animation cycles endlessly.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 340,
                            originX: 0, originY: 0, scale: 1
                        });

                        var running = true;

                        VizEngine.createButton(controls, 'Pause/Resume', function() {
                            running = !running;
                        });

                        viz.animate(function(t) {
                            if (!running) return;
                            viz.clear();
                            var ctx = viz.ctx;

                            var phase = (t / 2000) % 4; // 4-phase cycle, each 2s

                            // Central statement
                            viz.screenText('"This statement is false."', viz.width / 2, 40, viz.colors.white, 18);

                            // Circular arrow path
                            var cx = viz.width / 2, cy = 190;
                            var radius = 80;

                            // Draw circle path
                            ctx.strokeStyle = viz.colors.text + '44';
                            ctx.lineWidth = 2;
                            ctx.beginPath();
                            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                            ctx.stroke();

                            // Four positions on circle
                            var labels = [
                                { text: 'Assume TRUE', color: viz.colors.green },
                                { text: 'Then it IS false', color: viz.colors.orange },
                                { text: 'So it is FALSE', color: viz.colors.red },
                                { text: 'But then it ISN\'T false...', color: viz.colors.purple }
                            ];

                            for (var i = 0; i < 4; i++) {
                                var angle = -Math.PI / 2 + (i / 4) * Math.PI * 2;
                                var lx = cx + Math.cos(angle) * (radius + 50);
                                var ly = cy + Math.sin(angle) * (radius + 30);

                                var isActive = Math.floor(phase) === i;
                                var alpha = isActive ? 'ff' : '44';

                                ctx.fillStyle = labels[i].color + alpha;
                                ctx.font = (isActive ? 'bold ' : '') + '13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(labels[i].text, lx, ly);

                                // Node dot
                                var nx = cx + Math.cos(angle) * radius;
                                var ny = cy + Math.sin(angle) * radius;
                                ctx.fillStyle = labels[i].color + alpha;
                                ctx.beginPath();
                                ctx.arc(nx, ny, isActive ? 8 : 5, 0, Math.PI * 2);
                                ctx.fill();
                            }

                            // Moving indicator
                            var movingAngle = -Math.PI / 2 + (phase / 4) * Math.PI * 2;
                            var mx = cx + Math.cos(movingAngle) * radius;
                            var my = cy + Math.sin(movingAngle) * radius;
                            ctx.fillStyle = viz.colors.yellow;
                            ctx.beginPath();
                            ctx.arc(mx, my, 4, 0, Math.PI * 2);
                            ctx.fill();

                            // Bottom text
                            viz.screenText('The loop never terminates. This is why the Liar\'s Paradox', viz.width / 2, 310, viz.colors.text, 11);
                            viz.screenText('has no resolution within classical two-valued logic.', viz.width / 2, 326, viz.colors.text, 11);
                        });

                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Person A says: "I am a knave or 2 + 2 = 5." What is A?',
                    hint: 'The statement is a disjunction (OR). Remember: a disjunction is true if at least one part is true. Try both cases.',
                    solution: 'If A is a knight, the statement "I am a knave or 2+2=5" is true. Since 2+2=5 is false, "I am a knave" must be true. But then A is a knave, contradicting our assumption. If A is a knave, the statement is false. A disjunction is false only when BOTH parts are false. So "I am a knave" is false (meaning A is a knight) and "2+2=5" is false. But "A is a knight" contradicts our assumption that A is a knave. Both cases yield contradictions, so this statement is impossible on the island. It has the same structure as the Liar\'s Paradox.'
                },
                {
                    question: 'Person A says: "I am a knave or the sky is blue." What is A?',
                    hint: 'Similar to the previous exercise but now the second part of the OR is true.',
                    solution: 'If A is a knight, the disjunction is true. Since "the sky is blue" is true, the disjunction is true regardless of the first part. Consistent! If A is a knave, the disjunction is false. Both parts must be false. But "the sky is blue" is true, so both parts cannot be false. Contradiction. Therefore A is a knight. Key insight: when the second disjunct is true, the disjunction is always true, and only a knight makes true statements.'
                }
            ]
        },

        // ================================================================
        // SECTION 5: Puzzle Generator & Truth Table Logic
        // ================================================================
        {
            id: 'sec-bridge',
            title: 'Puzzle Workshop',
            content: `
<h2>Puzzle Workshop</h2>

<p>Now that you know the theory, it is time to practice. This section gives you two tools: a <strong>random puzzle generator</strong> that creates fresh knights-and-knaves puzzles for you to solve, and a <strong>truth table</strong> tool that shows the formal logic behind the puzzles.</p>

<h3>Generating Your Own Puzzles</h3>

<p>Below is a puzzle generator. Each time you click "New Puzzle," it creates a random assignment of knights and knaves, generates statements that are consistent with those types, and challenges you to figure out who is who.</p>

<div class="viz-placeholder" data-viz="viz-puzzle-generator"></div>

<h3>The Formal Logic</h3>

<p>Every knights-and-knaves puzzle can be translated into formal propositional logic. Let \\(K_i\\) be the proposition "Person \\(i\\) is a knight." Then:</p>

<ul>
    <li>If person \\(i\\) says statement \\(S\\), the puzzle constraint is: \\(K_i \\Leftrightarrow S\\).</li>
    <li>The puzzle is the conjunction of all such biconditionals.</li>
    <li>A solution is a truth assignment to \\(K_1, K_2, \\ldots\\) that makes the conjunction true.</li>
</ul>

<p>For example, if Alice says "Bob is a knave," the constraint is:</p>
\\[
K_A \\Leftrightarrow \\neg K_B
\\]

<p>This is equivalent to \\(K_A \\oplus K_B\\) (exclusive or): exactly one of them is a knight.</p>

<div class="viz-placeholder" data-viz="viz-truth-table-logic"></div>

<h3>Looking Ahead</h3>

<p>Knights-and-knaves puzzles are a gateway to formal logic. In the next chapter, we will explore <strong>logic grid puzzles</strong>, where the constraints are richer and the deductions more intricate. The same method of cases, the same hunt for contradictions, the same systematic reasoning, just applied to a bigger canvas.</p>

<div class="env-block remark">
    <div class="env-title">From Puzzles to Proofs</div>
    <div class="env-body">
        <p>Every time you solve a knights-and-knaves puzzle, you are writing a small proof. You state an assumption, derive consequences, check for consistency, and conclude. This is exactly the structure of mathematical proof by contradiction (reductio ad absurdum). The puzzles are fun, but the skill they build is deadly serious.</p>
    </div>
</div>
`,
            visualizations: [
                {
                    id: 'viz-puzzle-generator',
                    title: 'Random Puzzle Generator',
                    description: 'Click "New Puzzle" to generate a random knights-and-knaves puzzle. Click people to guess their type. Click "Check" to verify.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 400,
                            originX: 0, originY: 0, scale: 1
                        });

                        var allNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve'];
                        var numPeople = 3;
                        var solution = [];
                        var guesses = [];
                        var statements = [];
                        var checked = false;
                        var correct = false;

                        function generatePuzzle() {
                            checked = false;
                            correct = false;
                            solution = [];
                            guesses = [];
                            statements = [];
                            for (var i = 0; i < numPeople; i++) {
                                solution.push(Math.random() < 0.5 ? 'knight' : 'knave');
                                guesses.push('knight');
                            }
                            // Generate consistent statements
                            for (var j = 0; j < numPeople; j++) {
                                var st = generateStatement(j);
                                statements.push(st);
                            }
                        }

                        function generateStatement(speaker) {
                            var templates = [];
                            // About another person
                            for (var k = 0; k < numPeople; k++) {
                                if (k === speaker) continue;
                                templates.push({
                                    text: allNames[k] + ' is a knight.',
                                    truthValue: solution[k] === 'knight'
                                });
                                templates.push({
                                    text: allNames[k] + ' is a knave.',
                                    truthValue: solution[k] === 'knave'
                                });
                            }
                            // Count-based
                            var knightCount = solution.filter(function(s) { return s === 'knight'; }).length;
                            templates.push({
                                text: 'There are exactly ' + knightCount + ' knights among us.',
                                truthValue: true
                            });
                            if (knightCount !== numPeople - 1) {
                                templates.push({
                                    text: 'There are exactly ' + (numPeople - 1) + ' knights among us.',
                                    truthValue: (numPeople - 1) === knightCount
                                });
                            }

                            // Pick one
                            var choice = templates[Math.floor(Math.random() * templates.length)];
                            var isKnight = solution[speaker] === 'knight';
                            // Knight says truth, knave says lies
                            // If knight and truthValue is true, statement is what they say
                            // If knave, they would say the opposite: pick something with !truthValue
                            // Actually, we want to generate what the person SAYS, and it must be
                            // consistent: knight says true things, knave says false things
                            if (isKnight) {
                                // Pick a true statement
                                var trueOnes = templates.filter(function(t) { return t.truthValue; });
                                if (trueOnes.length > 0) choice = trueOnes[Math.floor(Math.random() * trueOnes.length)];
                            } else {
                                // Pick a false statement
                                var falseOnes = templates.filter(function(t) { return !t.truthValue; });
                                if (falseOnes.length > 0) choice = falseOnes[Math.floor(Math.random() * falseOnes.length)];
                            }

                            return { speaker: speaker, text: choice.text };
                        }

                        VizEngine.createButton(controls, 'New Puzzle', function() {
                            generatePuzzle();
                            draw();
                        });
                        VizEngine.createButton(controls, 'Check Answer', function() {
                            checked = true;
                            correct = true;
                            for (var i = 0; i < numPeople; i++) {
                                if (guesses[i] !== solution[i]) { correct = false; break; }
                            }
                            draw();
                        });
                        VizEngine.createButton(controls, 'Show Solution', function() {
                            guesses = solution.slice();
                            checked = true;
                            correct = true;
                            draw();
                        });

                        VizEngine.createSlider(controls, 'People', 2, 4, numPeople, 1, function(v) {
                            numPeople = Math.round(v);
                            generatePuzzle();
                            draw();
                        });

                        // Click to toggle
                        viz.canvas.addEventListener('click', function(e) {
                            if (checked) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var spacing = viz.width / (numPeople + 1);
                            for (var i = 0; i < numPeople; i++) {
                                var cx = spacing * (i + 1);
                                var cy = 100;
                                var dx = mx - cx, dy = my - cy;
                                if (dx * dx + dy * dy < 35 * 35) {
                                    guesses[i] = guesses[i] === 'knight' ? 'knave' : 'knight';
                                    draw();
                                    return;
                                }
                            }
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;

                            viz.screenText('Knights & Knaves Puzzle Generator', viz.width / 2, 20, viz.colors.white, 15);
                            viz.screenText('Click a person to toggle their type', viz.width / 2, 38, viz.colors.text, 11);

                            var spacing = viz.width / (numPeople + 1);

                            // Draw people
                            for (var i = 0; i < numPeople; i++) {
                                var cx = spacing * (i + 1);
                                var cy = 100;
                                var col = guesses[i] === 'knight' ? viz.colors.blue : viz.colors.red;

                                ctx.fillStyle = col + '44';
                                ctx.strokeStyle = col;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.arc(cx, cy, 30, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.stroke();

                                ctx.fillStyle = viz.colors.white;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.textAlign = 'center';
                                ctx.fillText(allNames[i], cx, cy - 5);

                                ctx.fillStyle = col;
                                ctx.font = '11px -apple-system,sans-serif';
                                ctx.fillText(guesses[i].toUpperCase(), cx, cy + 12);
                            }

                            // Draw statements
                            var stY = 170;
                            ctx.textAlign = 'left';
                            ctx.font = '12px -apple-system,sans-serif';
                            for (var s = 0; s < statements.length; s++) {
                                var st = statements[s];
                                ctx.fillStyle = viz.colors.white;
                                ctx.fillText(allNames[st.speaker] + ' says: "' + st.text + '"', 40, stY + s * 24);
                            }

                            // Result
                            if (checked) {
                                var resultY = 320;
                                if (correct) {
                                    ctx.fillStyle = viz.colors.green;
                                    ctx.font = 'bold 16px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Correct! Well done!', viz.width / 2, resultY);
                                } else {
                                    ctx.fillStyle = viz.colors.red;
                                    ctx.font = 'bold 16px -apple-system,sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Not quite. Try again!', viz.width / 2, resultY);

                                    // Show solution
                                    ctx.fillStyle = viz.colors.text;
                                    ctx.font = '12px -apple-system,sans-serif';
                                    var solStr = solution.map(function(s, idx) {
                                        return allNames[idx] + '=' + s;
                                    }).join(', ');
                                    ctx.fillText('Solution: ' + solStr, viz.width / 2, resultY + 24);
                                }
                            }
                        }

                        generatePuzzle();
                        draw();
                        return viz;
                    }
                },
                {
                    id: 'viz-truth-table-logic',
                    title: 'Truth Table: Knights & Knaves Logic',
                    description: 'See the formal logic behind a 2-person puzzle. The truth table shows all possible type assignments and which satisfy the puzzle constraints.',
                    setup: function(body, controls) {
                        var viz = new VizEngine(body, {
                            width: 560, height: 380,
                            originX: 0, originY: 0, scale: 1
                        });

                        var puzzleChoice = 0;
                        var puzzleDefs = [
                            {
                                label: 'Alice: "Bob is a knave"',
                                desc: 'K_A <=> not K_B',
                                check: function(ka, kb) {
                                    var claim = !kb; // "Bob is a knave"
                                    return ka ? claim : !claim;
                                }
                            },
                            {
                                label: 'Alice: "We are both knights"',
                                desc: 'K_A <=> (K_A and K_B)',
                                check: function(ka, kb) {
                                    var claim = ka && kb;
                                    return ka ? claim : !claim;
                                }
                            },
                            {
                                label: 'Alice: "At least one of us is a knave"',
                                desc: 'K_A <=> (not K_A or not K_B)',
                                check: function(ka, kb) {
                                    var claim = !ka || !kb;
                                    return ka ? claim : !claim;
                                }
                            }
                        ];

                        VizEngine.createButton(controls, 'Next Statement', function() {
                            puzzleChoice = (puzzleChoice + 1) % puzzleDefs.length;
                            draw();
                        });

                        function draw() {
                            viz.clear();
                            var ctx = viz.ctx;
                            var pd = puzzleDefs[puzzleChoice];

                            viz.screenText('Truth Table for: ' + pd.label, viz.width / 2, 22, viz.colors.white, 14);
                            viz.screenText('Constraint: ' + pd.desc, viz.width / 2, 44, viz.colors.teal, 12);

                            // Table header
                            var tableX = 60;
                            var tableY = 80;
                            var rowH = 40;
                            var colW = [120, 120, 180];
                            var headers = ['Alice (K_A)', 'Bob (K_B)', 'Consistent?'];

                            ctx.font = 'bold 12px -apple-system,sans-serif';
                            ctx.textAlign = 'center';
                            var hx = tableX;
                            for (var h = 0; h < headers.length; h++) {
                                ctx.fillStyle = viz.colors.blue;
                                ctx.fillText(headers[h], hx + colW[h] / 2, tableY);
                                hx += colW[h];
                            }

                            // Divider
                            ctx.strokeStyle = viz.colors.text + '44';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.moveTo(tableX, tableY + 12);
                            ctx.lineTo(tableX + colW[0] + colW[1] + colW[2], tableY + 12);
                            ctx.stroke();

                            // Rows
                            var combos = [[true, true], [true, false], [false, true], [false, false]];
                            ctx.font = '13px -apple-system,sans-serif';

                            for (var r = 0; r < combos.length; r++) {
                                var ka = combos[r][0], kb = combos[r][1];
                                var consistent = pd.check(ka, kb);
                                var ry = tableY + 30 + r * rowH;

                                // Highlight consistent row
                                if (consistent) {
                                    ctx.fillStyle = viz.colors.green + '22';
                                    ctx.fillRect(tableX - 10, ry - 14, colW[0] + colW[1] + colW[2] + 20, rowH - 4);
                                }

                                var rx = tableX;
                                ctx.fillStyle = ka ? viz.colors.green : viz.colors.red;
                                ctx.textAlign = 'center';
                                ctx.fillText(ka ? 'Knight' : 'Knave', rx + colW[0] / 2, ry);

                                rx += colW[0];
                                ctx.fillStyle = kb ? viz.colors.green : viz.colors.red;
                                ctx.fillText(kb ? 'Knight' : 'Knave', rx + colW[1] / 2, ry);

                                rx += colW[1];
                                ctx.fillStyle = consistent ? viz.colors.green : viz.colors.red;
                                ctx.font = 'bold 13px -apple-system,sans-serif';
                                ctx.fillText(consistent ? 'YES' : 'NO', rx + colW[2] / 2, ry);
                                ctx.font = '13px -apple-system,sans-serif';
                            }

                            // Summary
                            var solutions = combos.filter(function(c) { return pd.check(c[0], c[1]); });
                            var sumY = tableY + 30 + 4 * rowH + 20;
                            ctx.fillStyle = viz.colors.white;
                            ctx.textAlign = 'center';
                            ctx.font = '13px -apple-system,sans-serif';
                            if (solutions.length === 1) {
                                var s = solutions[0];
                                ctx.fillText(
                                    'Unique solution: Alice = ' + (s[0] ? 'Knight' : 'Knave') +
                                    ', Bob = ' + (s[1] ? 'Knight' : 'Knave'),
                                    viz.width / 2, sumY
                                );
                            } else if (solutions.length === 0) {
                                ctx.fillText('No consistent assignment exists (paradox!)', viz.width / 2, sumY);
                            } else {
                                ctx.fillText(solutions.length + ' solutions exist. The puzzle is underdetermined.', viz.width / 2, sumY);
                            }
                        }

                        draw();
                        return viz;
                    }
                }
            ],
            exercises: [
                {
                    question: 'Translate the following into a logical formula: Alice says "Bob is a knave" and Bob says "We are the same type." Find all solutions using a truth table.',
                    hint: 'Let \\(K_A\\) = Alice is a knight, \\(K_B\\) = Bob is a knight. Alice\'s constraint: \\(K_A \\Leftrightarrow \\neg K_B\\). Bob\'s constraint: \\(K_B \\Leftrightarrow (K_A \\Leftrightarrow K_B)\\). Check all four combinations.',
                    solution: 'The constraints are: (1) \\(K_A \\Leftrightarrow \\neg K_B\\) and (2) \\(K_B \\Leftrightarrow (K_A \\Leftrightarrow K_B)\\). Check each row. (T,T): (1) \\(T \\Leftrightarrow F = F\\). Fails. (T,F): (1) \\(T \\Leftrightarrow T = T\\). (2) \\(F \\Leftrightarrow (T \\Leftrightarrow F) = F \\Leftrightarrow F = T\\). Both hold! (F,T): (1) \\(F \\Leftrightarrow F = T\\). (2) \\(T \\Leftrightarrow (F \\Leftrightarrow T) = T \\Leftrightarrow F = F\\). Fails. (F,F): (1) \\(F \\Leftrightarrow T = F\\). Fails. Unique solution: Alice=knight, Bob=knave.'
                },
                {
                    question: 'How many logically distinct statements can an islander make about a group of \\(n\\) people (including themselves), if statements are boolean functions of the types?',
                    hint: 'Each person is either a knight or a knave, giving \\(2^n\\) possible "worlds." A statement partitions these worlds into true and false.',
                    solution: 'There are \\(2^n\\) possible type assignments. A statement is a function from type assignments to \\{\\text{true}, \\text{false}\\}. The number of such functions is \\(2^{2^n}\\). For \\(n=2\\), this is \\(2^4 = 16\\). For \\(n=3\\), this is \\(2^8 = 256\\). Not all produce solvable puzzles, but this is the total logical space.'
                }
            ]
        }
    ]
});
})();
