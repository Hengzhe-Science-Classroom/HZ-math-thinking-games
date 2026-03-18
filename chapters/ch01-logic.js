// === Chapter 1: True or False — Logic & Propositions ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch01',
    number: 1,
    title: 'True or False \u2014 Logic & Propositions',
    subtitle: 'The language that mathematics is written in',
    sections: [
        // ===== Section 0: Statements and truth values =====
        {
            id: 'statements-truth-values',
            title: 'Statements and Truth Values',
            content: `
<h2>What Counts as a Statement?</h2>

<p>In everyday conversation, we say all sorts of things: "Nice weather today," "Pass the salt," "I wonder if it will rain." But in mathematical logic, we are very picky about what counts as a <strong>statement</strong> (also called a <strong>proposition</strong>).</p>

<div class="env-block definition">
<strong>Proposition (Statement)</strong><br>
A proposition is a sentence that is either <strong>true</strong> or <strong>false</strong>, but not both and not neither. We call the true/false value the <strong>truth value</strong> of the proposition.
</div>

<p>This sounds simple, but it is surprisingly subtle. Let us look at some examples:</p>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #30363d;">
<th style="text-align:left;padding:8px;color:#58a6ff;">Sentence</th>
<th style="text-align:left;padding:8px;color:#58a6ff;">Proposition?</th>
<th style="text-align:left;padding:8px;color:#58a6ff;">Why?</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">"7 is a prime number."</td>
<td style="padding:8px;color:#3fb950;">Yes (True)</td>
<td style="padding:8px;">Clearly true. 7 is divisible only by 1 and itself.</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">"5 + 3 = 9."</td>
<td style="padding:8px;color:#f85149;">Yes (False)</td>
<td style="padding:8px;">Clearly false, but still a valid proposition.</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">"Close the door."</td>
<td style="padding:8px;color:#d29922;">No</td>
<td style="padding:8px;">This is a command, not a claim about truth.</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">"Is it raining?"</td>
<td style="padding:8px;color:#d29922;">No</td>
<td style="padding:8px;">This is a question, not a statement.</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">"This sentence is false."</td>
<td style="padding:8px;color:#d29922;">No</td>
<td style="padding:8px;">Paradox! It cannot be true or false without contradiction.</td>
</tr>
<tr>
<td style="padding:8px;">"\\(x + 2 = 5\\)."</td>
<td style="padding:8px;color:#d29922;">No (as stated)</td>
<td style="padding:8px;">It depends on \\(x\\). If \\(x = 3\\), it is true. Otherwise, false. Without specifying \\(x\\), it is not a proposition.</td>
</tr>
</table>

<div class="env-block remark">
<strong>Notation</strong><br>
We often use letters like \\(P\\), \\(Q\\), \\(R\\) to represent propositions. For example, we might write \\(P\\) = "7 is prime" and \\(Q\\) = "4 is even." We say \\(P\\) is true and write \\(P = T\\) (or \\(P = 1\\)). We say \\(Q\\) is true and write \\(Q = T\\).
</div>

<h3>Why Does This Matter?</h3>

<p>You might wonder: why be so fussy about what counts as a statement? Because mathematical arguments are built out of statements, the same way buildings are built out of bricks. If your bricks are squishy and vague, your building will collapse. If your statements are precise and clear, your arguments will be rock solid.</p>

<p>Every theorem in mathematics is a proposition. Every step in a proof is a proposition. The entire logical structure of mathematics depends on every statement being clearly, unambiguously true or false.</p>

<h3>The Liar's Paradox</h3>

<p>The sentence "This sentence is false" is the famous <strong>Liar's Paradox</strong>, and it has been driving philosophers and logicians crazy for over 2,000 years. If it is true, then what it says must hold, so it is false. But if it is false, then its claim ("I am false") is wrong, so it is true. It flips back and forth forever.</p>

<p>This is not just a curiosity. The Liar's Paradox is closely related to deep results in mathematical logic, including Kurt Godel's famous Incompleteness Theorems (1931), which showed that any sufficiently powerful mathematical system must contain statements that are true but unprovable. We will not go that deep in this course, but it is good to know that simple puzzles can lead to profound mathematics.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Classify each of the following as a proposition (and give its truth value) or not a proposition:<br>(a) "The Earth is flat."<br>(b) "Please sit down."<br>(c) "\\(2^{10} = 1024\\)."<br>(d) "Mathematics is beautiful."<br>(e) "There are infinitely many prime numbers."',
                    hint: 'A proposition must be a declarative sentence that is definitely true or definitely false. Opinions that reasonable people can disagree about are tricky.',
                    solution: '(a) Proposition, false. (b) Not a proposition (command). (c) Proposition, true. (d) This is debatable; in strict logic it is too vague to have a definite truth value, so not a proposition. (e) Proposition, true (proved by Euclid around 300 BC).'
                },
                {
                    question: 'Can you invent a sentence that <em>looks</em> like a proposition but is actually a paradox (like the Liar\'s Paradox)?',
                    hint: 'Try creating a sentence that refers to itself and its own truth value.',
                    solution: 'Examples: "The next sentence is true. The previous sentence is false." Or: "This sentence has exactly \\(n\\) letters" where \\(n\\) is chosen to make it self-contradictory. The key ingredient is <strong>self-reference</strong>: the sentence talks about itself.'
                }
            ]
        },

        // ===== Section 1: AND, OR, NOT =====
        {
            id: 'and-or-not',
            title: 'AND, OR, NOT',
            content: `
<h2>Building Complex Statements from Simple Ones</h2>

<p>In the real world, interesting statements are rarely simple. "It is raining AND I forgot my umbrella." "Either we go to the movies OR we stay home." "The answer is NOT 42." We combine simple propositions using <strong>logical connectives</strong> to build complex ones.</p>

<p>There are three fundamental connectives:</p>

<h3>NOT (Negation), written \\(\\neg P\\)</h3>

<p>The negation of \\(P\\) flips its truth value. If \\(P\\) is "It is raining" (true), then \\(\\neg P\\) is "It is NOT raining" (false).</p>

<div class="env-block definition">
<strong>Negation</strong><br>
\\(\\neg P\\) is true when \\(P\\) is false, and false when \\(P\\) is true.
</div>

<h3>AND (Conjunction), written \\(P \\wedge Q\\)</h3>

<p>The conjunction \\(P \\wedge Q\\) is true only when <strong>both</strong> \\(P\\) and \\(Q\\) are true. Think of it as a strict parent: both conditions must be met, no exceptions.</p>

<div class="env-block example">
<strong>Real-life AND</strong><br>
"You can have dessert if you eat your vegetables AND finish your homework." Both conditions must be satisfied. Eating vegetables alone is not enough. Finishing homework alone is not enough. You need both.
</div>

<h3>OR (Disjunction), written \\(P \\vee Q\\)</h3>

<p>The disjunction \\(P \\vee Q\\) is true when <strong>at least one</strong> of \\(P\\) or \\(Q\\) is true (or both). This is the <strong>inclusive OR</strong>, which is different from everyday English where "or" often means "one or the other but not both."</p>

<div class="env-block warning">
<strong>Inclusive vs. Exclusive OR</strong><br>
In math, "or" is inclusive: \\(P \\vee Q\\) is true even if both \\(P\\) and \\(Q\\) are true. In everyday English, "Would you like tea or coffee?" usually means "pick one." This is the <em>exclusive or</em> (XOR). Unless stated otherwise, "or" in math means inclusive or.
</div>

<h3>Putting Them Together</h3>

<p>We can combine these connectives to build complex statements. For example:</p>

<p>Let \\(P\\) = "It is sunny" and \\(Q\\) = "I have an umbrella." Then:</p>
<ul>
<li>\\(P \\wedge Q\\) = "It is sunny AND I have an umbrella."</li>
<li>\\(P \\vee Q\\) = "It is sunny OR I have an umbrella (or both)."</li>
<li>\\(\\neg P \\wedge Q\\) = "It is NOT sunny AND I have an umbrella."</li>
<li>\\(\\neg(P \\wedge Q)\\) = "It is NOT the case that both: it is sunny and I have an umbrella." (So at least one is false.)</li>
</ul>

<p>Notice the difference between \\(\\neg P \\wedge Q\\) and \\(\\neg(P \\wedge Q)\\). Parentheses matter, just like in arithmetic where \\(2 \\times (3 + 4) \\neq 2 \\times 3 + 4\\).</p>

<h3>Priority Rules</h3>

<p>Just like arithmetic has order of operations (PEMDAS), logic has priority rules:</p>
<ol>
<li>\\(\\neg\\) (NOT) has the highest priority: it applies first.</li>
<li>\\(\\wedge\\) (AND) comes next.</li>
<li>\\(\\vee\\) (OR) comes last.</li>
</ol>
<p>So \\(\\neg P \\vee Q \\wedge R\\) means \\((\\neg P) \\vee (Q \\wedge R)\\). When in doubt, use parentheses!</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Let \\(P\\) = "2 is even" (true), \\(Q\\) = "3 is even" (false), \\(R\\) = "5 is prime" (true). Find the truth value of:<br>(a) \\(P \\wedge Q\\)<br>(b) \\(P \\vee Q\\)<br>(c) \\(\\neg Q\\)<br>(d) \\(P \\wedge (Q \\vee R)\\)<br>(e) \\(\\neg P \\vee \\neg Q\\)',
                    hint: 'Evaluate step by step. For (d), first evaluate what is inside the parentheses: \\(Q \\vee R = F \\vee T = T\\). Then evaluate the AND.',
                    solution: '(a) \\(T \\wedge F = F\\). (b) \\(T \\vee F = T\\). (c) \\(\\neg F = T\\). (d) \\(T \\wedge (F \\vee T) = T \\wedge T = T\\). (e) \\(\\neg T \\vee \\neg F = F \\vee T = T\\).'
                },
                {
                    question: 'In everyday English, the sentence "You can take the bus or the train" usually means exclusive or (pick one, not both). Write a real-life sentence where "or" clearly means inclusive or (at least one, possibly both).',
                    hint: 'Think of requirements or qualifications where meeting both is fine.',
                    solution: 'Example: "To enter the contest, you must be a student or under 18." If you are a 15-year-old student, you meet BOTH conditions, and you can still enter. This is inclusive or. Another example: "Applicants with a degree in mathematics or computer science are welcome." Someone with both degrees qualifies.'
                },
                {
                    question: 'Write the negation of "I like cats AND I like dogs" using OR. Then write the negation of "I like cats OR I like dogs" using AND.',
                    hint: 'This is De Morgan\'s Law, which we will study soon. But try to reason it out intuitively first. If it is NOT the case that "I like cats AND dogs," what must be true?',
                    solution: 'Negation of "I like cats AND I like dogs" is: "I do NOT like cats OR I do NOT like dogs" (at least one fails). Negation of "I like cats OR I like dogs" is: "I do NOT like cats AND I do NOT like dogs" (both fail). These are De Morgan\'s Laws: \\(\\neg(P \\wedge Q) = \\neg P \\vee \\neg Q\\) and \\(\\neg(P \\vee Q) = \\neg P \\wedge \\neg Q\\).'
                }
            ]
        },

        // ===== Section 2: Truth Tables =====
        {
            id: 'truth-tables',
            title: 'Truth Tables',
            content: `
<h2>The Complete Reference for Logical Operations</h2>

<p>A <strong>truth table</strong> is a systematic way to list every possible combination of truth values and see what the result is. It is like a multiplication table, but for logic instead of numbers.</p>

<div class="env-block definition">
<strong>Truth Table</strong><br>
A table that shows, for every possible combination of input truth values, what the output truth value of a compound proposition is.
</div>

<p>For a single proposition \\(P\\), there are 2 possible truth values (T or F). For two propositions \\(P\\) and \\(Q\\), there are \\(2 \\times 2 = 4\\) possible combinations. For three propositions, there are \\(2^3 = 8\\) combinations. In general, \\(n\\) propositions give \\(2^n\\) rows.</p>

<h3>The Basic Truth Tables</h3>

<p>Here are the truth tables for our three connectives. Use the interactive tool below to explore them!</p>

<div class="viz-placeholder" data-viz="ch01-truth-table-gen"></div>

<h3>Reading a Truth Table</h3>

<p>Let us read the AND truth table carefully:</p>
<ul>
<li>Row 1: \\(P = T\\), \\(Q = T\\), \\(P \\wedge Q = T\\). Both true, so AND is true.</li>
<li>Row 2: \\(P = T\\), \\(Q = F\\), \\(P \\wedge Q = F\\). One is false, so AND is false.</li>
<li>Row 3: \\(P = F\\), \\(Q = T\\), \\(P \\wedge Q = F\\). One is false, so AND is false.</li>
<li>Row 4: \\(P = F\\), \\(Q = F\\), \\(P \\wedge Q = F\\). Both false, so AND is false.</li>
</ul>

<p>The key insight: AND is like a chain. A chain is strong only if EVERY link is strong. If any link breaks, the whole chain breaks. So \\(P \\wedge Q\\) is true only when every part is true.</p>

<p>OR is like a safety net. As long as at least one net holds, you are safe. \\(P \\vee Q\\) is false only when EVERY option fails.</p>

<h3>Building Complex Truth Tables</h3>

<p>For a compound expression like \\(P \\wedge (Q \\vee \\neg R)\\), build the truth table step by step:</p>
<ol>
<li>List all combinations of \\(P\\), \\(Q\\), \\(R\\) (8 rows for 3 variables).</li>
<li>Compute \\(\\neg R\\) for each row.</li>
<li>Compute \\(Q \\vee \\neg R\\) for each row.</li>
<li>Compute \\(P \\wedge (Q \\vee \\neg R)\\) for each row.</li>
</ol>

<div class="env-block remark">
<strong>Truth tables as proof</strong><br>
A truth table is an <em>exhaustive</em> proof method. By checking every possible case, you can prove that two expressions are equivalent, or that a statement is always true (a <strong>tautology</strong>) or always false (a <strong>contradiction</strong>).
</div>
`,
            visualizations: [
                {
                    id: 'ch01-truth-table-gen',
                    title: 'Interactive Truth Table Generator',
                    description: 'Click the input cells to toggle T/F and watch the outputs update. Select different operations to explore.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var operations = [
                            { name: 'AND', symbol: '\u2227', fn: function(p, q) { return p && q; } },
                            { name: 'OR', symbol: '\u2228', fn: function(p, q) { return p || q; } },
                            { name: 'NOT P', symbol: '\u00acP', fn: function(p) { return !p; }, unary: true },
                            { name: 'NAND', symbol: '\u2191', fn: function(p, q) { return !(p && q); } },
                            { name: 'XOR', symbol: '\u2295', fn: function(p, q) { return p !== q; } },
                            { name: 'IMPLIES', symbol: '\u2192', fn: function(p, q) { return !p || q; } }
                        ];
                        var opIdx = 0;
                        // Custom truth values (user can click to toggle)
                        var rows = [
                            { p: true, q: true },
                            { p: true, q: false },
                            { p: false, q: true },
                            { p: false, q: false }
                        ];

                        VizEngine.createButton(controls, 'Next Operation', function() {
                            opIdx = (opIdx + 1) % operations.length;
                            draw();
                        });

                        VizEngine.createButton(controls, 'Prev Operation', function() {
                            opIdx = (opIdx + operations.length - 1) % operations.length;
                            draw();
                        });

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            var op = operations[opIdx];
                            var cellW = Math.min(140, w / 4);
                            var cellH = 40;
                            var startX = (w - cellW * (op.unary ? 2 : 3)) / 2;
                            var startY = 50;

                            // Title
                            ctx.fillStyle = '#c9d1d9';
                            ctx.font = 'bold 18px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Truth Table: ' + op.name + ' (' + op.symbol + ')', w / 2, 30);

                            // Header
                            ctx.fillStyle = '#1a1a40';
                            var cols = op.unary ? 2 : 3;
                            ctx.fillRect(startX, startY, cellW * cols, cellH);
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.strokeRect(startX, startY, cellW * cols, cellH);
                            for (var c = 1; c < cols; c++) {
                                ctx.beginPath();
                                ctx.moveTo(startX + c * cellW, startY);
                                ctx.lineTo(startX + c * cellW, startY + cellH);
                                ctx.stroke();
                            }

                            ctx.fillStyle = '#58a6ff';
                            ctx.font = 'bold 14px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            if (op.unary) {
                                ctx.fillText('P', startX + cellW / 2, startY + cellH / 2);
                                ctx.fillText(op.symbol, startX + cellW * 1.5, startY + cellH / 2);
                            } else {
                                ctx.fillText('P', startX + cellW * 0.5, startY + cellH / 2);
                                ctx.fillText('Q', startX + cellW * 1.5, startY + cellH / 2);
                                ctx.fillText('P ' + op.symbol + ' Q', startX + cellW * 2.5, startY + cellH / 2);
                            }

                            // Rows
                            var dataRows = op.unary ? [{ p: true }, { p: false }] : rows;
                            for (var r = 0; r < dataRows.length; r++) {
                                var rowY = startY + cellH * (r + 1);
                                var rowData = dataRows[r];
                                var result = op.unary ? op.fn(rowData.p) : op.fn(rowData.p, rowData.q);

                                ctx.fillStyle = r % 2 === 0 ? '#0f0f28' : '#0c0c20';
                                ctx.fillRect(startX, rowY, cellW * cols, cellH);
                                ctx.strokeStyle = '#30363d';
                                ctx.strokeRect(startX, rowY, cellW * cols, cellH);
                                for (var c2 = 1; c2 < cols; c2++) {
                                    ctx.beginPath();
                                    ctx.moveTo(startX + c2 * cellW, rowY);
                                    ctx.lineTo(startX + c2 * cellW, rowY + cellH);
                                    ctx.stroke();
                                }

                                ctx.font = 'bold 14px monospace';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';

                                // P value
                                ctx.fillStyle = rowData.p ? '#3fb950' : '#f85149';
                                ctx.fillText(rowData.p ? 'T' : 'F', startX + cellW * 0.5, rowY + cellH / 2);

                                if (!op.unary) {
                                    // Q value
                                    ctx.fillStyle = rowData.q ? '#3fb950' : '#f85149';
                                    ctx.fillText(rowData.q ? 'T' : 'F', startX + cellW * 1.5, rowY + cellH / 2);
                                }

                                // Result
                                var resultX = op.unary ? startX + cellW * 1.5 : startX + cellW * 2.5;
                                ctx.fillStyle = result ? '#3fb950' : '#f85149';
                                // Draw result with a highlight
                                ctx.beginPath();
                                ctx.arc(resultX, rowY + cellH / 2, 16, 0, Math.PI * 2);
                                ctx.fillStyle = result ? '#3fb95022' : '#f8514922';
                                ctx.fill();
                                ctx.fillStyle = result ? '#3fb950' : '#f85149';
                                ctx.fillText(result ? 'T' : 'F', resultX, rowY + cellH / 2);
                            }

                            // Footer: count trues
                            var trueCount = 0;
                            for (var ri = 0; ri < dataRows.length; ri++) {
                                var rr = op.unary ? op.fn(dataRows[ri].p) : op.fn(dataRows[ri].p, dataRows[ri].q);
                                if (rr) trueCount++;
                            }
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '13px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('Result is True in ' + trueCount + ' out of ' + dataRows.length + ' cases', w / 2, startY + cellH * (dataRows.length + 1) + 20);

                            // Explanation
                            var expY = startY + cellH * (dataRows.length + 1) + 50;
                            ctx.fillStyle = '#8b949e';
                            ctx.font = '12px sans-serif';
                            ctx.textAlign = 'center';
                            var explanations = {
                                'AND': 'AND is true only when BOTH inputs are true.',
                                'OR': 'OR is true when AT LEAST ONE input is true.',
                                'NOT P': 'NOT flips the truth value.',
                                'NAND': 'NAND (not-and) is false only when both are true.',
                                'XOR': 'XOR (exclusive or) is true when inputs DIFFER.',
                                'IMPLIES': 'P implies Q is false only when P is true but Q is false.'
                            };
                            ctx.fillText(explanations[op.name] || '', w / 2, expY);
                        }

                        // Click handler for toggling rows
                        viz.canvas.addEventListener('click', function(e) {
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var op = operations[opIdx];
                            if (op.unary) return;
                            var cellW2 = Math.min(140, w / 4);
                            var cellH2 = 40;
                            var startX2 = (w - cellW2 * 3) / 2;
                            var startY2 = 50;
                            for (var r2 = 0; r2 < rows.length; r2++) {
                                var rowY2 = startY2 + cellH2 * (r2 + 1);
                                if (my >= rowY2 && my < rowY2 + cellH2) {
                                    if (mx >= startX2 && mx < startX2 + cellW2) {
                                        rows[r2].p = !rows[r2].p;
                                        draw();
                                    } else if (mx >= startX2 + cellW2 && mx < startX2 + cellW2 * 2) {
                                        rows[r2].q = !rows[r2].q;
                                        draw();
                                    }
                                }
                            }
                        });

                        draw();
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: 'Build the truth table for \\(\\neg(P \\wedge Q)\\) and compare it with \\(\\neg P \\vee \\neg Q\\). What do you notice?',
                    hint: 'Compute both expressions for all 4 combinations of P and Q. Do they always give the same result?',
                    solution: 'They are identical! For all 4 input combinations, \\(\\neg(P \\wedge Q)\\) and \\(\\neg P \\vee \\neg Q\\) give the same output. This is <strong>De Morgan\'s First Law</strong>. Negating an AND turns it into an OR of negations.'
                },
                {
                    question: 'How many rows does a truth table need if there are 5 different propositions (\\(P, Q, R, S, T\\))?',
                    hint: 'Each proposition can be T or F, so there are 2 choices for each. With 5 propositions...',
                    solution: '\\(2^5 = 32\\) rows. In general, \\(n\\) propositions require \\(2^n\\) rows. This grows very fast! For 10 propositions, you would need 1024 rows. This is why truth tables, while systematic, become impractical for large numbers of variables.'
                },
                {
                    question: 'A <strong>tautology</strong> is a statement that is ALWAYS true, no matter what the input values are. Show that \\(P \\vee \\neg P\\) is a tautology by building its truth table.',
                    hint: 'There are only 2 rows (\\(P = T\\) and \\(P = F\\)). Compute \\(\\neg P\\) for each, then compute the OR.',
                    solution: 'When \\(P = T\\): \\(\\neg P = F\\), so \\(P \\vee \\neg P = T \\vee F = T\\). When \\(P = F\\): \\(\\neg P = T\\), so \\(P \\vee \\neg P = F \\vee T = T\\). The result is T in every row, so \\(P \\vee \\neg P\\) is a tautology. This is called the <strong>Law of Excluded Middle</strong>: everything is either true or not true.'
                }
            ]
        },

        // ===== Section 3: Knights and Liars Puzzles =====
        {
            id: 'knights-and-liars',
            title: 'Knights and Liars Puzzles',
            content: `
<h2>The Island of Truth and Lies</h2>

<p>Welcome to the most famous puzzle island in all of logic! On this island, there are two types of people:</p>

<div class="env-block definition">
<strong>Knights and Liars</strong><br>
<strong>Knights</strong> always tell the truth. Every statement a knight makes is true.<br>
<strong>Liars</strong> always lie. Every statement a liar makes is false.
</div>

<p>These puzzles were popularized by the logician Raymond Smullyan in his delightful book <em>What Is the Name of This Book?</em> They are a perfect playground for practicing logical reasoning.</p>

<h3>Warm-up Puzzle</h3>

<div class="env-block example">
<strong>Puzzle 1</strong><br>
You meet Alice on the island. She says: "I am a knight." Can you determine what she is?
</div>

<p>Think about it. If Alice is a knight, she tells the truth, so "I am a knight" is true. That is consistent. If Alice is a liar, she lies, so "I am a knight" is false. That means she is NOT a knight, i.e., she is a liar. That is also consistent! So Alice's statement tells us <strong>nothing</strong>. Both a knight and a liar would say "I am a knight."</p>

<div class="env-block remark">
<strong>Key insight</strong><br>
The statement "I am a knight" is useless because both knights and liars would say it. However, the statement "I am a liar" is a paradox: a knight would never say it (it would be a lie), and a liar would never say it (it would be the truth). Nobody on this island can say "I am a liar."
</div>

<h3>A Real Challenge</h3>

<div class="env-block example">
<strong>Puzzle 2</strong><br>
You meet Bob and Carol. Bob says: "At least one of us is a liar." What can you deduce?
</div>

<p><strong>Case 1:</strong> Suppose Bob is a knight. Then his statement is true, so at least one of them is a liar. Since Bob is a knight, the liar must be Carol. So Bob is a knight and Carol is a liar.</p>

<p><strong>Case 2:</strong> Suppose Bob is a liar. Then his statement is false. The negation of "at least one of us is a liar" is "neither of us is a liar," meaning both are knights. But we assumed Bob is a liar, so we get a contradiction. This case is impossible.</p>

<p>Therefore, Bob is a knight and Carol is a liar.</p>

<h3>The Classic Fork Puzzle</h3>

<div class="env-block example">
<strong>Puzzle 3</strong><br>
You are at a fork in the road. One path leads to treasure, the other to a dragon. A person stands at the fork. You do not know if they are a knight or a liar. You may ask exactly one yes/no question. What question guarantees you find the treasure?
</div>

<p>The brilliant trick is to ask a <strong>double-layered question</strong>: "If I asked you whether the left path leads to treasure, would you say yes?"</p>

<p>Why does this work? A knight would truthfully answer whether the left path leads to treasure. A liar, asked about the left path, would lie. But then, asked whether they <em>would</em> say yes, they lie again about their lie, giving the truth! Two lies cancel out, just like two negatives make a positive: \\(\\neg(\\neg P) = P\\).</p>

<p>Try the interactive puzzle solver below!</p>

<div class="viz-placeholder" data-viz="ch01-knights-liars"></div>
`,
            visualizations: [
                {
                    id: 'ch01-knights-liars',
                    title: 'Knights & Liars Puzzle Solver',
                    description: 'Click each character to guess if they are a Knight (blue) or Liar (red). Read their statements and use logic to deduce who is who!',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var puzzles = [
                            {
                                desc: 'A says: "B is a liar."  B says: "A and I are the same type."',
                                characters: ['A', 'B'],
                                solution: [true, false], // A=knight, B=liar
                                statements: ['B is a liar.', 'A and I are the same type.']
                            },
                            {
                                desc: 'A says: "We are both liars."',
                                characters: ['A', 'B'],
                                solution: [false, true], // A=liar, B=knight
                                statements: ['We are both liars.', '(says nothing)']
                            },
                            {
                                desc: 'A says: "B is a knight."  B says: "A and I are different types."',
                                characters: ['A', 'B'],
                                solution: [false, true], // A=liar, B=knight
                                statements: ['B is a knight.', 'A and I are different types.']
                            },
                            {
                                desc: 'A says: "At least one of B or C is a knight."  B says: "C is a liar."  C says nothing.',
                                characters: ['A', 'B', 'C'],
                                solution: [true, true, false],
                                statements: ['At least one of B or C is a knight.', 'C is a liar.', '(says nothing)']
                            }
                        ];

                        var pIdx = 0;
                        var guesses = [];
                        var solved = false;
                        var feedback = '';

                        function resetPuzzle() {
                            guesses = [];
                            for (var i = 0; i < puzzles[pIdx].characters.length; i++) {
                                guesses.push(null); // null = unguessed, true = knight, false = liar
                            }
                            solved = false;
                            feedback = '';
                        }
                        resetPuzzle();

                        VizEngine.createButton(controls, 'Next Puzzle', function() {
                            pIdx = (pIdx + 1) % puzzles.length;
                            resetPuzzle();
                            draw();
                        });

                        VizEngine.createButton(controls, 'Check Answer', function() {
                            var puzzle = puzzles[pIdx];
                            var correct = true;
                            for (var ci = 0; ci < puzzle.solution.length; ci++) {
                                if (guesses[ci] !== puzzle.solution[ci]) { correct = false; break; }
                            }
                            if (guesses.indexOf(null) >= 0) {
                                feedback = 'Click all characters to set your guesses first!';
                            } else if (correct) {
                                feedback = 'Correct! Well reasoned!';
                                solved = true;
                            } else {
                                feedback = 'Not quite. Try again!';
                            }
                            draw();
                        });

                        VizEngine.createButton(controls, 'Reveal', function() {
                            var puzzle = puzzles[pIdx];
                            for (var ri = 0; ri < puzzle.solution.length; ri++) {
                                guesses[ri] = puzzle.solution[ri];
                            }
                            solved = true;
                            feedback = 'Solution revealed.';
                            draw();
                        });

                        viz.canvas.addEventListener('click', function(e) {
                            if (solved) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var puzzle = puzzles[pIdx];
                            var n = puzzle.characters.length;
                            var spacing = w / (n + 1);
                            var charY = 160;
                            for (var ci = 0; ci < n; ci++) {
                                var cx = spacing * (ci + 1);
                                var dist = Math.sqrt((mx - cx) * (mx - cx) + (my - charY) * (my - charY));
                                if (dist < 35) {
                                    // Cycle: null -> knight -> liar -> null
                                    if (guesses[ci] === null) guesses[ci] = true;
                                    else if (guesses[ci] === true) guesses[ci] = false;
                                    else guesses[ci] = null;
                                    feedback = '';
                                    draw();
                                    return;
                                }
                            }
                        });

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            var puzzle = puzzles[pIdx];
                            var n = puzzle.characters.length;

                            // Puzzle description
                            ctx.fillStyle = '#c9d1d9';
                            ctx.font = '14px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            // Word wrap the description
                            var words = puzzle.desc.split(' ');
                            var lines = [];
                            var currentLine = '';
                            for (var wi = 0; wi < words.length; wi++) {
                                var testLine = currentLine ? currentLine + ' ' + words[wi] : words[wi];
                                if (ctx.measureText(testLine).width > w - 60) {
                                    lines.push(currentLine);
                                    currentLine = words[wi];
                                } else {
                                    currentLine = testLine;
                                }
                            }
                            if (currentLine) lines.push(currentLine);
                            for (var li = 0; li < lines.length; li++) {
                                ctx.fillText(lines[li], w / 2, 20 + li * 20);
                            }

                            // Characters
                            var spacing2 = w / (n + 1);
                            var charY2 = 160;
                            for (var ci2 = 0; ci2 < n; ci2++) {
                                var cx2 = spacing2 * (ci2 + 1);
                                // Circle
                                var color;
                                if (guesses[ci2] === null) color = '#4a4a7a';
                                else if (guesses[ci2] === true) color = '#58a6ff';
                                else color = '#f85149';
                                ctx.fillStyle = color + '33';
                                ctx.beginPath();
                                ctx.arc(cx2, charY2, 35, 0, Math.PI * 2);
                                ctx.fill();
                                ctx.strokeStyle = color;
                                ctx.lineWidth = 3;
                                ctx.beginPath();
                                ctx.arc(cx2, charY2, 30, 0, Math.PI * 2);
                                ctx.stroke();
                                // Name
                                ctx.fillStyle = color;
                                ctx.font = 'bold 20px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(puzzle.characters[ci2], cx2, charY2);
                                // Label
                                ctx.font = '12px sans-serif';
                                ctx.fillStyle = '#8b949e';
                                ctx.textBaseline = 'top';
                                var labelText = guesses[ci2] === null ? '(click)' : (guesses[ci2] ? 'Knight' : 'Liar');
                                ctx.fillText(labelText, cx2, charY2 + 38);
                                // Statement
                                ctx.fillStyle = '#c9d1d9';
                                ctx.font = '12px sans-serif';
                                ctx.textBaseline = 'top';
                                var stmtWords = puzzle.statements[ci2].split(' ');
                                var stmtLines = [];
                                var stmtCurrent = '';
                                var maxStmtW = spacing2 - 20;
                                for (var swi = 0; swi < stmtWords.length; swi++) {
                                    var stmtTest = stmtCurrent ? stmtCurrent + ' ' + stmtWords[swi] : stmtWords[swi];
                                    if (ctx.measureText(stmtTest).width > maxStmtW) {
                                        stmtLines.push(stmtCurrent);
                                        stmtCurrent = stmtWords[swi];
                                    } else {
                                        stmtCurrent = stmtTest;
                                    }
                                }
                                if (stmtCurrent) stmtLines.push(stmtCurrent);
                                for (var sli = 0; sli < stmtLines.length; sli++) {
                                    ctx.fillText(stmtLines[sli], cx2, charY2 + 60 + sli * 16);
                                }
                            }

                            // Feedback
                            if (feedback) {
                                ctx.fillStyle = solved ? '#3fb950' : '#f0883e';
                                ctx.font = 'bold 14px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(feedback, w / 2, h - 30);
                            }

                            // Puzzle number
                            ctx.fillStyle = '#4a4a7a';
                            ctx.font = '11px sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('Puzzle ' + (pIdx + 1) + ' / ' + puzzles.length, w - 15, h - 10);
                        }

                        draw();
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: '<strong>Puzzle:</strong> You meet A, B, and C. A says: "All three of us are liars." B says: "Exactly one of us is a knight." What are A, B, and C?',
                    hint: 'First analyze A\'s statement. If A is a knight, then "all three are liars" is true, meaning A is a liar. That is a contradiction. So A must be a liar.',
                    solution: 'A is a liar (since a knight cannot say "all three of us are liars"). Since A is a liar, "all three are liars" is false, so at least one is a knight. Now consider B. If B is a knight, then "exactly one of us is a knight" is true, and that one knight is B. Then A and C are liars. Check: A (liar) says "all three are liars" (false, since B is a knight). B (knight) says "exactly one is a knight" (true, since only B is). This is consistent! So A = liar, B = knight, C = liar.'
                },
                {
                    question: '<strong>The Hardest One-Question Puzzle:</strong> You are at a fork. A guard stands there (either a knight or a liar). One path leads to freedom, the other to doom. You may ask one yes/no question. What do you ask?',
                    hint: 'You need a question where a knight and a liar give the <em>same</em> answer. Try wrapping your real question inside another layer: "If I asked you whether the left path leads to freedom, would you say yes?"',
                    solution: 'Ask: "If I asked you whether the left path leads to freedom, would you say yes?" A knight would truthfully report what they would say (which is the truth), so they say "yes" if left is correct. A liar, asked about left, would lie. But asked whether they <em>would</em> say yes, they lie about their lie: \\(\\neg(\\neg P) = P\\). They also say "yes" if left is correct. So regardless of type, "yes" means go left, "no" means go right.'
                },
                {
                    question: 'Prove that on the island, nobody can ever say the sentence "I am a liar." (Show that both a knight and a liar would produce a contradiction.)',
                    hint: 'If a knight says "I am a liar," is the statement true or false? If a liar says "I am a liar," is the statement true or false?',
                    solution: 'If a knight says "I am a liar": knights always tell the truth, so the statement must be true, meaning they really are a liar. But we assumed they are a knight. Contradiction. If a liar says "I am a liar": liars always lie, so the statement must be false, meaning they are NOT a liar, i.e., they are a knight. But we assumed they are a liar. Contradiction. Neither type can say it without contradicting their nature. This is the knight/liar version of the Liar\'s Paradox.'
                }
            ]
        },

        // ===== Section 4: Logical Equivalences =====
        {
            id: 'logical-equivalences',
            title: 'Logical Equivalences',
            content: `
<h2>When Two Statements Say the Same Thing</h2>

<p>Sometimes two logical expressions look different but always produce the same truth value. When this happens, we say they are <strong>logically equivalent</strong>.</p>

<div class="env-block definition">
<strong>Logical Equivalence</strong><br>
Two propositions \\(A\\) and \\(B\\) are logically equivalent (written \\(A \\equiv B\\)) if they have the same truth value in every possible situation. Equivalently, their truth tables are identical.
</div>

<h3>De Morgan's Laws</h3>

<p>The most important logical equivalences are <strong>De Morgan's Laws</strong>, named after the 19th-century mathematician Augustus De Morgan:</p>

<div class="env-block theorem">
<strong>De Morgan's Laws</strong><br>
\\[\\neg(P \\wedge Q) \\equiv \\neg P \\vee \\neg Q\\]
\\[\\neg(P \\vee Q) \\equiv \\neg P \\wedge \\neg Q\\]
In words: the negation of an AND becomes an OR of negations, and the negation of an OR becomes an AND of negations.
</div>

<p>These laws are incredibly useful and come up constantly. Let us see them in action with a real example.</p>

<div class="env-block example">
<strong>De Morgan in real life</strong><br>
"It is NOT the case that I like <em>both</em> cats and dogs."<br>
By De Morgan's first law, this is the same as: "I don't like cats OR I don't like dogs" (at least one is disliked).<br><br>
"It is NOT the case that I like cats <em>or</em> dogs."<br>
By De Morgan's second law, this is the same as: "I don't like cats AND I don't like dogs" (neither is liked).
</div>

<h3>Other Important Equivalences</h3>

<p>Here are more equivalences that every logical thinker should know:</p>

<table style="width:100%;border-collapse:collapse;margin:1em 0;">
<tr style="border-bottom:1px solid #30363d;">
<th style="text-align:left;padding:8px;color:#58a6ff;">Name</th>
<th style="text-align:left;padding:8px;color:#58a6ff;">Equivalence</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">Double Negation</td>
<td style="padding:8px;">\\(\\neg(\\neg P) \\equiv P\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">Commutativity</td>
<td style="padding:8px;">\\(P \\wedge Q \\equiv Q \\wedge P\\), \\(P \\vee Q \\equiv Q \\vee P\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">Associativity</td>
<td style="padding:8px;">\\((P \\wedge Q) \\wedge R \\equiv P \\wedge (Q \\wedge R)\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">Distributivity</td>
<td style="padding:8px;">\\(P \\wedge (Q \\vee R) \\equiv (P \\wedge Q) \\vee (P \\wedge R)\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">Identity</td>
<td style="padding:8px;">\\(P \\wedge T \\equiv P\\), \\(P \\vee F \\equiv P\\)</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="padding:8px;">Domination</td>
<td style="padding:8px;">\\(P \\vee T \\equiv T\\), \\(P \\wedge F \\equiv F\\)</td>
</tr>
<tr>
<td style="padding:8px;">Excluded Middle</td>
<td style="padding:8px;">\\(P \\vee \\neg P \\equiv T\\)</td>
</tr>
</table>

<p>Notice something remarkable: these look a lot like rules from arithmetic! Commutativity (\\(a + b = b + a\\)), associativity (\\((a + b) + c = a + (b + c)\\)), and distributivity (\\(a \\times (b + c) = a \\times b + a \\times c\\)) all have logical counterparts. This is not a coincidence. There is a deep mathematical structure called <strong>Boolean algebra</strong> that unifies logic and arithmetic.</p>

<div class="env-block intuition">
<strong>The Computer Connection</strong><br>
Every computer chip is built from logic gates that implement AND, OR, and NOT. De Morgan's Laws are used by chip designers to simplify circuits. When you use a computer, logic is literally doing the work.
</div>

<h3>Proving Equivalences with Truth Tables</h3>

<p>To prove that two expressions are equivalent, build truth tables for both and check that every row matches. If even one row differs, they are NOT equivalent.</p>

<p>For example, let us verify the distributive law \\(P \\wedge (Q \\vee R) \\equiv (P \\wedge Q) \\vee (P \\wedge R)\\):</p>

<p>With 3 variables, we need \\(2^3 = 8\\) rows. Computing both sides for all 8 combinations confirms they match in every case. (Try it yourself to practice!)</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'Use De Morgan\'s Laws to simplify: \\(\\neg(\\neg P \\vee Q)\\).',
                    hint: 'Apply De Morgan\'s second law: \\(\\neg(A \\vee B) = \\neg A \\wedge \\neg B\\), where \\(A = \\neg P\\) and \\(B = Q\\).',
                    solution: 'By De Morgan: \\(\\neg(\\neg P \\vee Q) = \\neg(\\neg P) \\wedge \\neg Q = P \\wedge \\neg Q\\). In words: "P is true AND Q is false."'
                },
                {
                    question: 'Verify by truth table that \\(P \\vee (P \\wedge Q) \\equiv P\\). This is called the <strong>Absorption Law</strong>.',
                    hint: 'Build a 4-row truth table. Compute \\(P \\wedge Q\\) first, then \\(P \\vee (P \\wedge Q)\\), and compare with \\(P\\).',
                    solution: 'Row 1: \\(P=T, Q=T\\): \\(P \\wedge Q = T\\), \\(P \\vee T = T\\). Same as \\(P = T\\). Row 2: \\(P=T, Q=F\\): \\(P \\wedge Q = F\\), \\(P \\vee F = T\\). Same as \\(P = T\\). Row 3: \\(P=F, Q=T\\): \\(P \\wedge Q = F\\), \\(P \\vee F = F\\). Same as \\(P = F\\). Row 4: \\(P=F, Q=F\\): \\(P \\wedge Q = F\\), \\(P \\vee F = F\\). Same as \\(P = F\\). All rows match, so \\(P \\vee (P \\wedge Q) \\equiv P\\). Intuitively: if \\(P\\) is already true, ORing it with anything keeps it true. If \\(P\\) is false, \\(P \\wedge Q\\) is also false, so the OR is false.'
                },
                {
                    question: 'A logic gate called NAND (not-and) computes \\(\\neg(P \\wedge Q)\\). It is famous because you can build AND, OR, and NOT using only NAND gates. Show how to build NOT using only NAND. (Hint: what is \\(\\neg(P \\wedge P)\\)?)',
                    hint: 'What happens when you NAND a signal with itself? \\(\\text{NAND}(P, P) = \\neg(P \\wedge P)\\). What is \\(P \\wedge P\\)?',
                    solution: '\\(P \\wedge P = P\\) (a thing AND itself is just itself). So \\(\\text{NAND}(P, P) = \\neg(P \\wedge P) = \\neg P\\). That is NOT! So a NAND gate with both inputs tied together acts as a NOT gate. This is the first step in showing NAND is "universal": you can build any logic circuit from NAND gates alone.'
                }
            ]
        }
    ]
});
})();
