// === Chapter 2: If...Then — Chains of Reasoning ===
(function() {
window.CHAPTERS = window.CHAPTERS || [];
window.CHAPTERS.push({
    id: 'ch02',
    number: 2,
    title: 'If...Then \u2014 Chains of Reasoning',
    subtitle: 'Master the art of logical deduction',
    sections: [
        // ===== Section 0: Conditional Statements =====
        {
            id: 'conditional-statements',
            title: 'Conditional Statements',
            content: `
<h2>The Most Important Two Words in Logic</h2>

<p>"If...then..." is the backbone of all logical reasoning. Every mathematical proof, every scientific argument, every legal case, and every detective story relies on conditional statements. Master this, and you have mastered the core of logical thinking.</p>

<div class="env-block definition">
<strong>Conditional Statement (Implication)</strong><br>
A conditional statement has the form "If \\(P\\), then \\(Q\\)," written \\(P \\to Q\\). We call \\(P\\) the <strong>hypothesis</strong> (or antecedent) and \\(Q\\) the <strong>conclusion</strong> (or consequent).
</div>

<p>Examples:</p>
<ul>
<li>"If it rains, then the ground gets wet." (\\(P\\) = "it rains", \\(Q\\) = "ground gets wet")</li>
<li>"If a number is divisible by 6, then it is divisible by 3." (\\(P\\) = "divisible by 6", \\(Q\\) = "divisible by 3")</li>
<li>"If you study hard, then you will pass the exam."</li>
</ul>

<h3>When Is a Conditional True?</h3>

<p>This is where things get surprising. The truth table for \\(P \\to Q\\) is:</p>

<table style="width:60%;border-collapse:collapse;margin:1em auto;">
<tr style="border-bottom:1px solid #30363d;">
<th style="text-align:center;padding:8px;color:#58a6ff;">\\(P\\)</th>
<th style="text-align:center;padding:8px;color:#58a6ff;">\\(Q\\)</th>
<th style="text-align:center;padding:8px;color:#58a6ff;">\\(P \\to Q\\)</th>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="text-align:center;padding:8px;color:#3fb950;">T</td>
<td style="text-align:center;padding:8px;color:#3fb950;">T</td>
<td style="text-align:center;padding:8px;color:#3fb950;">T</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="text-align:center;padding:8px;color:#3fb950;">T</td>
<td style="text-align:center;padding:8px;color:#f85149;">F</td>
<td style="text-align:center;padding:8px;color:#f85149;">F</td>
</tr>
<tr style="border-bottom:1px solid #1a1a40;">
<td style="text-align:center;padding:8px;color:#f85149;">F</td>
<td style="text-align:center;padding:8px;color:#3fb950;">T</td>
<td style="text-align:center;padding:8px;color:#3fb950;">T</td>
</tr>
<tr>
<td style="text-align:center;padding:8px;color:#f85149;">F</td>
<td style="text-align:center;padding:8px;color:#f85149;">F</td>
<td style="text-align:center;padding:8px;color:#3fb950;">T</td>
</tr>
</table>

<p>The only row where \\(P \\to Q\\) is <strong>false</strong> is when \\(P\\) is true but \\(Q\\) is false. In all other cases, the conditional is true.</p>

<div class="env-block intuition">
<strong>Why is "false implies anything" true?</strong><br>
Think of \\(P \\to Q\\) as a promise: "If it rains, I will bring an umbrella." When does the promise get broken? Only when it rains (\\(P\\) is true) and you do NOT bring an umbrella (\\(Q\\) is false). If it does not rain, the promise is not violated regardless of whether you bring an umbrella. A promise that was never tested is not a broken promise.
</div>

<p>This might feel strange at first. "If pigs can fly, then the moon is made of cheese" is technically a true statement in logic, because the hypothesis "pigs can fly" is false. The conditional is said to be <strong>vacuously true</strong>. It is not saying anything deep; it is just not broken.</p>

<h3>The Logical Equivalence</h3>

<p>There is an important equivalence that connects implication to the connectives we already know:</p>

<div class="env-block theorem">
<strong>Implication as Disjunction</strong><br>
\\[P \\to Q \\equiv \\neg P \\vee Q\\]
"If P then Q" is the same as "not P or Q."
</div>

<p>Check it yourself: the truth table for \\(\\neg P \\vee Q\\) matches the truth table for \\(P \\to Q\\) in all four rows. This equivalence is extremely useful for simplifying logical expressions and will come up again and again.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'For each conditional, identify the hypothesis (P) and conclusion (Q), and say whether the conditional is true or false:<br>(a) "If 6 is even, then 6 is divisible by 2."<br>(b) "If 7 is even, then 7 is divisible by 2."<br>(c) "If 6 is even, then 6 is prime."<br>(d) "If 7 is even, then 7 is prime."',
                    hint: 'Remember: the only case where \\(P \\to Q\\) is false is when \\(P\\) is true and \\(Q\\) is false. In (b) and (d), the hypothesis is false.',
                    solution: '(a) \\(P\\)="6 is even" (T), \\(Q\\)="6 is divisible by 2" (T). \\(T \\to T = T\\). (b) \\(P\\)="7 is even" (F), \\(Q\\)="7 is divisible by 2" (F). \\(F \\to F = T\\) (vacuously true). (c) \\(P\\)="6 is even" (T), \\(Q\\)="6 is prime" (F). \\(T \\to F = F\\). This is the only false one! (d) \\(P\\)="7 is even" (F), \\(Q\\)="7 is prime" (T). \\(F \\to T = T\\) (vacuously true).'
                },
                {
                    question: 'Verify by truth table that \\(P \\to Q \\equiv \\neg P \\vee Q\\).',
                    hint: 'Build both truth tables side by side for all 4 combinations of \\(P\\) and \\(Q\\).',
                    solution: 'Row 1: \\(P=T, Q=T\\): \\(P \\to Q = T\\), \\(\\neg P \\vee Q = F \\vee T = T\\). Match. Row 2: \\(P=T, Q=F\\): \\(P \\to Q = F\\), \\(\\neg P \\vee Q = F \\vee F = F\\). Match. Row 3: \\(P=F, Q=T\\): \\(P \\to Q = T\\), \\(\\neg P \\vee Q = T \\vee T = T\\). Match. Row 4: \\(P=F, Q=F\\): \\(P \\to Q = T\\), \\(\\neg P \\vee Q = T \\vee F = T\\). Match. All 4 rows agree, so \\(P \\to Q \\equiv \\neg P \\vee Q\\).'
                },
                {
                    question: 'A teacher says: "If you get 100% on the test, I will give you a prize." You get 85%. The teacher gives you a prize anyway. Did the teacher break their promise?',
                    hint: 'What is \\(P\\)? What is \\(Q\\)? What are their truth values?',
                    solution: 'No! \\(P\\)="you get 100%" is false (you got 85%). \\(Q\\)="teacher gives prize" is true. \\(F \\to T = T\\). The promise is not broken. The teacher only promised what would happen IF you got 100%. They never said anything about what they would do otherwise. A promise is only broken when the condition is met but the promised action does not happen.'
                }
            ]
        },

        // ===== Section 1: Converse and Contrapositive =====
        {
            id: 'converse-contrapositive',
            title: 'Converse and Contrapositive',
            content: `
<h2>Flipping, Negating, and the Trap Everyone Falls Into</h2>

<p>Given a conditional \\(P \\to Q\\), we can form three related statements:</p>

<div class="env-block definition">
<strong>Three Relatives of \\(P \\to Q\\)</strong><br>
<ul>
<li><strong>Converse:</strong> \\(Q \\to P\\) (flip the direction)</li>
<li><strong>Inverse:</strong> \\(\\neg P \\to \\neg Q\\) (negate both)</li>
<li><strong>Contrapositive:</strong> \\(\\neg Q \\to \\neg P\\) (flip AND negate)</li>
</ul>
</div>

<p>Here is the critical fact that trips up almost everyone:</p>

<div class="env-block theorem">
<strong>The Contrapositive Theorem</strong><br>
A conditional and its contrapositive are logically equivalent:
\\[P \\to Q \\equiv \\neg Q \\to \\neg P\\]
However, a conditional and its converse are <strong>NOT</strong> equivalent:
\\[P \\to Q \\not\\equiv Q \\to P\\]
</div>

<p>Let us see this with a concrete example:</p>

<div class="env-block example">
<strong>Original:</strong> "If it rains, then the ground is wet." (True)<br>
<strong>Converse:</strong> "If the ground is wet, then it rained." (FALSE! Someone could have used a sprinkler.)<br>
<strong>Inverse:</strong> "If it does not rain, then the ground is not wet." (FALSE! Same reason.)<br>
<strong>Contrapositive:</strong> "If the ground is NOT wet, then it did NOT rain." (True! If it had rained, the ground would be wet.)
</div>

<p>Notice: the original and contrapositive are both true. The converse and inverse are both false. This is not a coincidence. The converse and inverse are contrapositives of <em>each other</em>, so they always share the same truth value.</p>

<div class="env-block warning">
<strong>The Converse Error</strong><br>
Confusing a statement with its converse is one of the most common logical errors in everyday reasoning. "All dogs are animals" does NOT mean "all animals are dogs." "Every square is a rectangle" does NOT mean "every rectangle is a square." Always check: am I accidentally reasoning from the converse?
</div>

<h3>Why the Contrapositive Works</h3>

<p>The contrapositive is equivalent because of De Morgan and double negation. Using the equivalence \\(P \\to Q \\equiv \\neg P \\vee Q\\):</p>

<p>\\(\\neg Q \\to \\neg P \\equiv \\neg(\\neg Q) \\vee \\neg P \\equiv Q \\vee \\neg P \\equiv \\neg P \\vee Q \\equiv P \\to Q\\)</p>

<p>The proof goes through purely mechanically. This is the power of logical equivalences: they let you transform statements with confidence.</p>

<h3>Using the Contrapositive in Proofs</h3>

<p>Sometimes proving \\(P \\to Q\\) directly is hard, but proving \\(\\neg Q \\to \\neg P\\) is easy. Since they are equivalent, proving either one proves the other.</p>

<div class="env-block example">
<strong>Example:</strong> Prove that if \\(n^2\\) is even, then \\(n\\) is even.<br><br>
<strong>Direct proof attempt:</strong> \\(n^2\\) is even means \\(n^2 = 2k\\) for some integer \\(k\\). Now... it is not obvious how to show \\(n\\) is even from here.<br><br>
<strong>Contrapositive proof:</strong> Prove "if \\(n\\) is odd, then \\(n^2\\) is odd." If \\(n\\) is odd, then \\(n = 2m + 1\\), so \\(n^2 = (2m+1)^2 = 4m^2 + 4m + 1 = 2(2m^2 + 2m) + 1\\), which is odd. Done!
</div>
`,
            visualizations: [],
            exercises: [
                {
                    question: 'For each statement, write the converse, inverse, and contrapositive:<br>(a) "If a number is divisible by 10, then it is divisible by 5."<br>(b) "If it is a weekend, then I sleep in."',
                    hint: 'Identify \\(P\\) and \\(Q\\), then mechanically form the three relatives.',
                    solution: '(a) Converse: "If divisible by 5, then divisible by 10." (False: 15 is divisible by 5 but not by 10.) Inverse: "If not divisible by 10, then not divisible by 5." (False: same counterexample.) Contrapositive: "If not divisible by 5, then not divisible by 10." (True!)<br>(b) Converse: "If I sleep in, then it is a weekend." (Not necessarily true.) Inverse: "If it is not a weekend, then I do not sleep in." (Not necessarily true.) Contrapositive: "If I do not sleep in, then it is not a weekend." (Same truth value as the original.)'
                },
                {
                    question: 'True or false: "If \\(x^2 = 4\\), then \\(x = 2\\)." What about the converse?',
                    hint: 'Can \\(x\\) be negative?',
                    solution: 'The statement is FALSE because \\(x = -2\\) also satisfies \\(x^2 = 4\\). The converse, "If \\(x = 2\\), then \\(x^2 = 4\\)," is TRUE. This is a great example of why a statement and its converse can have different truth values.'
                },
                {
                    question: 'Use the contrapositive to prove: "If \\(n^2\\) is odd, then \\(n\\) is odd."',
                    hint: 'The contrapositive is: "If \\(n\\) is even, then \\(n^2\\) is even." Try to prove that instead.',
                    solution: 'Contrapositive: "If \\(n\\) is even, then \\(n^2\\) is even." Proof: If \\(n\\) is even, then \\(n = 2k\\) for some integer \\(k\\). So \\(n^2 = (2k)^2 = 4k^2 = 2(2k^2)\\), which is even. The contrapositive is proved, so the original statement is also proved.'
                }
            ]
        },

        // ===== Section 2: Deduction Chains =====
        {
            id: 'deduction-chains',
            title: 'Deduction Chains',
            content: `
<h2>Building Arguments Link by Link</h2>

<p>The power of conditional statements comes from chaining them together. If you know \\(P \\to Q\\) and \\(Q \\to R\\), then you can conclude \\(P \\to R\\). This is called <strong>hypothetical syllogism</strong>, and it is how all complex reasoning works.</p>

<div class="env-block definition">
<strong>Modus Ponens (The Rule of Detachment)</strong><br>
If \\(P \\to Q\\) is true, and \\(P\\) is true, then \\(Q\\) must be true.<br>
In symbols: \\(P \\to Q\\), \\(P\\), therefore \\(Q\\).
</div>

<p>This is the most fundamental rule of deduction. It says: if you have a proven implication and the hypothesis is satisfied, you can "detach" the conclusion.</p>

<div class="env-block example">
<strong>Modus Ponens in action</strong><br>
Premise 1: "If it rains, the ground gets wet." (\\(P \\to Q\\))<br>
Premise 2: "It is raining." (\\(P\\))<br>
Conclusion: "The ground is wet." (\\(Q\\))
</div>

<div class="env-block definition">
<strong>Modus Tollens (Denying the Consequent)</strong><br>
If \\(P \\to Q\\) is true, and \\(Q\\) is false, then \\(P\\) must be false.<br>
In symbols: \\(P \\to Q\\), \\(\\neg Q\\), therefore \\(\\neg P\\).
</div>

<p>Modus tollens is modus ponens applied to the contrapositive. Since \\(P \\to Q \\equiv \\neg Q \\to \\neg P\\), knowing \\(\\neg Q\\) lets you conclude \\(\\neg P\\).</p>

<div class="env-block example">
<strong>Modus Tollens in action</strong><br>
Premise 1: "If it rains, the ground gets wet." (\\(P \\to Q\\))<br>
Premise 2: "The ground is NOT wet." (\\(\\neg Q\\))<br>
Conclusion: "It did NOT rain." (\\(\\neg P\\))
</div>

<h3>Chaining Implications: Hypothetical Syllogism</h3>

<div class="env-block definition">
<strong>Hypothetical Syllogism (Chain Rule)</strong><br>
If \\(P \\to Q\\) and \\(Q \\to R\\), then \\(P \\to R\\).
</div>

<p>This lets you build long chains of reasoning. For example:</p>

<ol>
<li>If it rains, the ground gets wet. (\\(P \\to Q\\))</li>
<li>If the ground is wet, the sidewalk is slippery. (\\(Q \\to R\\))</li>
<li>If the sidewalk is slippery, someone might fall. (\\(R \\to S\\))</li>
</ol>

<p>By chaining: if it rains, someone might fall. (\\(P \\to S\\))</p>

<p>Try building your own reasoning chains in the interactive tool below!</p>

<div class="viz-placeholder" data-viz="ch02-reasoning-chain"></div>

<div class="env-block remark">
<strong>Chains in mathematics</strong><br>
Every mathematical proof is a deduction chain. You start from axioms (things assumed true) and definitions, apply modus ponens and other rules step by step, and arrive at the conclusion. The chain is only as strong as its weakest link; every step must be logically valid.
</div>
`,
            visualizations: [
                {
                    id: 'ch02-reasoning-chain',
                    title: 'Reasoning Chain Builder',
                    description: 'Watch how premises chain together to form conclusions. Click "Add Link" to extend the chain, or "New Chain" for a different example.',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var chains = [
                            {
                                title: 'Weather Chain',
                                links: [
                                    { from: 'It rains', to: 'Ground is wet' },
                                    { from: 'Ground is wet', to: 'Sidewalk is slippery' },
                                    { from: 'Sidewalk is slippery', to: 'Someone might fall' },
                                    { from: 'Someone might fall', to: 'Hospital gets a patient' }
                                ],
                                fact: 'It rains'
                            },
                            {
                                title: 'Math Chain',
                                links: [
                                    { from: 'n divisible by 12', to: 'n divisible by 6' },
                                    { from: 'n divisible by 6', to: 'n divisible by 3' },
                                    { from: 'n divisible by 3', to: 'digit sum divisible by 3' }
                                ],
                                fact: 'n divisible by 12'
                            },
                            {
                                title: 'Detective Chain',
                                links: [
                                    { from: 'Suspect was at scene', to: 'Suspect had opportunity' },
                                    { from: 'Suspect had opportunity', to: 'Suspect could have done it' },
                                    { from: 'Suspect had motive', to: 'Suspect wanted to do it' },
                                    { from: 'Could + wanted', to: 'Suspect is prime suspect' }
                                ],
                                fact: 'Suspect was at scene'
                            }
                        ];

                        var chainIdx = 0;
                        var showLinks = 1;

                        VizEngine.createButton(controls, 'Add Link', function() {
                            var chain = chains[chainIdx];
                            if (showLinks < chain.links.length) {
                                showLinks++;
                                draw();
                            }
                        });

                        VizEngine.createButton(controls, 'Reset', function() {
                            showLinks = 1;
                            draw();
                        });

                        VizEngine.createButton(controls, 'New Chain', function() {
                            chainIdx = (chainIdx + 1) % chains.length;
                            showLinks = 1;
                            draw();
                        });

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            var chain = chains[chainIdx];

                            // Title
                            ctx.fillStyle = '#c9d1d9';
                            ctx.font = 'bold 16px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText(chain.title, w / 2, 25);

                            // Starting fact
                            ctx.fillStyle = '#3fb950';
                            ctx.font = 'bold 13px sans-serif';
                            ctx.textAlign = 'left';
                            ctx.fillText('Known fact: ' + chain.fact, 20, 55);

                            // Draw chain
                            var boxH = 36;
                            var startY = 80;
                            var maxBoxW = w - 60;

                            for (var i = 0; i < showLinks && i < chain.links.length; i++) {
                                var link = chain.links[i];
                                var y = startY + i * (boxH + 30);

                                // "If...then..." label
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '11px sans-serif';
                                ctx.textAlign = 'left';
                                ctx.fillText('Premise ' + (i + 1) + ':', 20, y - 5);

                                // From box
                                var fromText = link.from;
                                var toText = link.to;
                                ctx.font = '12px sans-serif';
                                var fromW = Math.min(ctx.measureText('If: ' + fromText).width + 20, maxBoxW * 0.45);
                                var toW = Math.min(ctx.measureText('Then: ' + toText).width + 20, maxBoxW * 0.45);
                                var arrowSpace = 40;
                                var totalW = fromW + arrowSpace + toW;
                                var boxStartX = (w - totalW) / 2;

                                // From box
                                ctx.fillStyle = '#1a1a40';
                                ctx.strokeStyle = '#58a6ff';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.roundRect(boxStartX, y, fromW, boxH, 6);
                                ctx.fill();
                                ctx.stroke();
                                ctx.fillStyle = '#58a6ff';
                                ctx.font = '12px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('If: ' + fromText, boxStartX + fromW / 2, y + boxH / 2);

                                // Arrow
                                var arrowStartX = boxStartX + fromW + 5;
                                var arrowEndX = boxStartX + fromW + arrowSpace - 5;
                                var arrowY = y + boxH / 2;
                                ctx.strokeStyle = '#f0883e';
                                ctx.lineWidth = 2;
                                ctx.beginPath();
                                ctx.moveTo(arrowStartX, arrowY);
                                ctx.lineTo(arrowEndX, arrowY);
                                ctx.stroke();
                                // Arrowhead
                                ctx.fillStyle = '#f0883e';
                                ctx.beginPath();
                                ctx.moveTo(arrowEndX, arrowY);
                                ctx.lineTo(arrowEndX - 8, arrowY - 5);
                                ctx.lineTo(arrowEndX - 8, arrowY + 5);
                                ctx.closePath();
                                ctx.fill();

                                // To box
                                var toStartX = boxStartX + fromW + arrowSpace;
                                ctx.fillStyle = '#1a1a40';
                                ctx.strokeStyle = '#3fb9a0';
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.roundRect(toStartX, y, toW, boxH, 6);
                                ctx.fill();
                                ctx.stroke();
                                ctx.fillStyle = '#3fb9a0';
                                ctx.font = '12px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText('Then: ' + toText, toStartX + toW / 2, y + boxH / 2);
                            }

                            // Conclusion
                            if (showLinks > 0) {
                                var conclusionY = startY + showLinks * (boxH + 30) + 10;
                                var lastTo = chain.links[showLinks - 1].to;
                                ctx.fillStyle = '#ffd700';
                                ctx.font = 'bold 13px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'top';
                                ctx.fillText('Conclusion (by chaining): ' + chain.fact + '  \u2192  ' + lastTo, w / 2, conclusionY);

                                // Method label
                                ctx.fillStyle = '#8b949e';
                                ctx.font = '11px sans-serif';
                                ctx.fillText(showLinks === 1 ? '(Modus Ponens)' : '(Hypothetical Syllogism + Modus Ponens)', w / 2, conclusionY + 20);
                            }

                            // Progress indicator
                            ctx.fillStyle = '#4a4a7a';
                            ctx.font = '11px sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'bottom';
                            ctx.fillText('Showing ' + showLinks + ' / ' + chain.links.length + ' links', w - 15, h - 10);
                        }

                        draw();
                        return { stopAnimation: function() {} };
                    }
                }
            ],
            exercises: [
                {
                    question: 'Identify whether each argument uses Modus Ponens or Modus Tollens:<br>(a) "If it snows, the school is closed. It snowed. Therefore, the school is closed."<br>(b) "If it snows, the school is closed. The school is NOT closed. Therefore, it did not snow."<br>(c) "All mammals are warm-blooded. A lizard is not warm-blooded. Therefore, a lizard is not a mammal."',
                    hint: 'Modus Ponens: affirm the hypothesis, conclude the consequence. Modus Tollens: deny the consequence, conclude the negation of the hypothesis.',
                    solution: '(a) Modus Ponens. We have \\(P \\to Q\\) and \\(P\\), so we conclude \\(Q\\). (b) Modus Tollens. We have \\(P \\to Q\\) and \\(\\neg Q\\), so we conclude \\(\\neg P\\). (c) Modus Tollens. Rewrite as: "If X is a mammal, then X is warm-blooded." A lizard is not warm-blooded (\\(\\neg Q\\)), therefore a lizard is not a mammal (\\(\\neg P\\)).'
                },
                {
                    question: 'Build a chain of 4 implications starting from "Today is Monday" and ending with a surprising conclusion. Make each step plausible.',
                    hint: 'Think of a realistic chain of events: Monday leads to some event, which leads to another, and so on.',
                    solution: 'Example: (1) If today is Monday, then I have math class. (2) If I have math class, then I bring my calculator. (3) If I bring my calculator, then my backpack is heavy. (4) If my backpack is heavy, then my shoulders hurt. Conclusion: If today is Monday, then my shoulders hurt! Each step is plausible, but the final conclusion is somewhat surprising.'
                }
            ]
        },

        // ===== Section 3: Logical Fallacies =====
        {
            id: 'logical-fallacies',
            title: 'Logical Fallacies to Avoid',
            content: `
<h2>How Smart People Make Bad Arguments</h2>

<p>A <strong>logical fallacy</strong> is an error in reasoning that makes an argument invalid. Fallacies can be sneaky; they often <em>feel</em> right even though they are logically wrong. Learning to spot them is one of the most valuable skills you can develop.</p>

<h3>Fallacy 1: Affirming the Consequent</h3>

<div class="env-block warning">
<strong>Affirming the Consequent</strong><br>
<strong>Invalid argument:</strong> \\(P \\to Q\\), \\(Q\\), therefore \\(P\\).<br>
<strong>Example:</strong> "If it rains, the ground is wet. The ground is wet. Therefore it rained."<br>
<strong>Why it fails:</strong> This confuses the statement with its converse. The ground could be wet for other reasons (sprinkler, spilled water, morning dew).
</div>

<p>This is the <strong>converse error</strong> we discussed earlier, and it is extremely common in everyday reasoning. "All doctors wear white coats. That person is wearing a white coat. Therefore that person is a doctor." Nope, they could be a lab technician, a painter, or someone who likes white coats.</p>

<h3>Fallacy 2: Denying the Antecedent</h3>

<div class="env-block warning">
<strong>Denying the Antecedent</strong><br>
<strong>Invalid argument:</strong> \\(P \\to Q\\), \\(\\neg P\\), therefore \\(\\neg Q\\).<br>
<strong>Example:</strong> "If it rains, the ground is wet. It did not rain. Therefore the ground is not wet."<br>
<strong>Why it fails:</strong> This confuses the statement with its inverse. Not raining does not guarantee a dry ground.
</div>

<h3>Fallacy 3: Circular Reasoning (Begging the Question)</h3>

<div class="env-block warning">
<strong>Circular Reasoning</strong><br>
Using the conclusion as one of the premises. The argument "proves" what it already assumes.<br>
<strong>Example:</strong> "Mathematics is the most important subject because it is more important than all other subjects."
</div>

<p>Circular reasoning can be subtle, especially when the chain of reasoning is long enough that you do not notice it comes back to where it started.</p>

<h3>Fallacy 4: False Dichotomy</h3>

<div class="env-block warning">
<strong>False Dichotomy</strong><br>
Presenting only two options when more exist.<br>
<strong>Example:</strong> "You are either with us or against us." (What about being neutral, partially agreeing, or having a completely different perspective?)
</div>

<h3>How to Spot Fallacies</h3>

<p>When evaluating an argument, ask yourself these questions:</p>
<ol>
<li><strong>Is the reasoning going in the right direction?</strong> (Watch out for converse errors.)</li>
<li><strong>Does the conclusion follow necessarily?</strong> Or could the premises be true while the conclusion is false?</li>
<li><strong>Is anything being assumed that was not stated?</strong> Hidden assumptions are often where fallacies hide.</li>
<li><strong>Is the argument circular?</strong> Does the conclusion appear (in disguise) among the premises?</li>
</ol>

<div class="viz-placeholder" data-viz="ch02-spot-fallacy"></div>
`,
            visualizations: [
                {
                    id: 'ch02-spot-fallacy',
                    title: 'Spot the Fallacy!',
                    description: 'Read each argument and click the button matching the fallacy. Can you identify all of them correctly?',
                    setup: function(container, controls) {
                        var viz = new VizEngine(container, { scale: 1, originX: 0, originY: 0 });
                        var w = viz.width, h = viz.height;
                        var ctx = viz.ctx;

                        var problems = [
                            {
                                argument: 'If you study, you pass. You passed. So you must have studied.',
                                answer: 0, // affirming consequent
                                options: ['Affirming Consequent', 'Denying Antecedent', 'Circular Reasoning', 'Valid']
                            },
                            {
                                argument: 'If you are a fish, you can swim. You are not a fish. So you cannot swim.',
                                answer: 1,
                                options: ['Affirming Consequent', 'Denying Antecedent', 'Circular Reasoning', 'Valid']
                            },
                            {
                                argument: 'This book is good because it is well-written, and it is well-written because it is a good book.',
                                answer: 2,
                                options: ['Affirming Consequent', 'Denying Antecedent', 'Circular Reasoning', 'Valid']
                            },
                            {
                                argument: 'All cats are mammals. Fluffy is a cat. So Fluffy is a mammal.',
                                answer: 3,
                                options: ['Affirming Consequent', 'Denying Antecedent', 'Circular Reasoning', 'Valid']
                            },
                            {
                                argument: 'If n > 5, then n > 3. n is not > 5. So n is not > 3.',
                                answer: 1,
                                options: ['Affirming Consequent', 'Denying Antecedent', 'Circular Reasoning', 'Valid']
                            },
                            {
                                argument: 'If it is a square, it has 4 sides. This shape has 4 sides. So it is a square.',
                                answer: 0,
                                options: ['Affirming Consequent', 'Denying Antecedent', 'Circular Reasoning', 'Valid']
                            }
                        ];

                        var probIdx = 0;
                        var selected = -1;
                        var showResult = false;

                        VizEngine.createButton(controls, 'Next Problem', function() {
                            probIdx = (probIdx + 1) % problems.length;
                            selected = -1;
                            showResult = false;
                            draw();
                        });

                        function draw() {
                            ctx.fillStyle = '#0c0c20';
                            ctx.fillRect(0, 0, w, h);

                            var prob = problems[probIdx];

                            // Problem counter
                            ctx.fillStyle = '#4a4a7a';
                            ctx.font = '11px sans-serif';
                            ctx.textAlign = 'right';
                            ctx.textBaseline = 'top';
                            ctx.fillText('Problem ' + (probIdx + 1) + ' / ' + problems.length, w - 15, 10);

                            // Argument text with word wrap
                            ctx.fillStyle = '#c9d1d9';
                            ctx.font = '14px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'top';
                            var argWords = prob.argument.split(' ');
                            var argLines = [];
                            var currentArgLine = '';
                            for (var awi = 0; awi < argWords.length; awi++) {
                                var testArgLine = currentArgLine ? currentArgLine + ' ' + argWords[awi] : argWords[awi];
                                if (ctx.measureText(testArgLine).width > w - 80) {
                                    argLines.push(currentArgLine);
                                    currentArgLine = argWords[awi];
                                } else {
                                    currentArgLine = testArgLine;
                                }
                            }
                            if (currentArgLine) argLines.push(currentArgLine);

                            // Speech bubble background
                            var bubbleY = 30;
                            var bubbleH = argLines.length * 22 + 30;
                            ctx.fillStyle = '#1a1a40';
                            ctx.strokeStyle = '#30363d';
                            ctx.lineWidth = 1;
                            ctx.beginPath();
                            ctx.roundRect(30, bubbleY, w - 60, bubbleH, 8);
                            ctx.fill();
                            ctx.stroke();

                            ctx.fillStyle = '#c9d1d9';
                            for (var ali = 0; ali < argLines.length; ali++) {
                                ctx.fillText(argLines[ali], w / 2, bubbleY + 15 + ali * 22);
                            }

                            // Question
                            var qY = bubbleY + bubbleH + 20;
                            ctx.fillStyle = '#f0883e';
                            ctx.font = 'bold 13px sans-serif';
                            ctx.textAlign = 'center';
                            ctx.fillText('What type of reasoning is this?', w / 2, qY);

                            // Option buttons
                            var optY = qY + 30;
                            var optW = Math.min(200, (w - 40) / 2 - 10);
                            var optH = 35;
                            var cols = 2;
                            for (var oi = 0; oi < prob.options.length; oi++) {
                                var col = oi % cols;
                                var row = Math.floor(oi / cols);
                                var ox = (w - (optW * cols + 10 * (cols - 1))) / 2 + col * (optW + 10);
                                var oy = optY + row * (optH + 8);

                                var isSelected = selected === oi;
                                var isCorrect = oi === prob.answer;

                                if (showResult && isSelected && isCorrect) {
                                    ctx.fillStyle = '#3fb95033';
                                    ctx.strokeStyle = '#3fb950';
                                } else if (showResult && isSelected && !isCorrect) {
                                    ctx.fillStyle = '#f8514933';
                                    ctx.strokeStyle = '#f85149';
                                } else if (showResult && isCorrect) {
                                    ctx.fillStyle = '#3fb95022';
                                    ctx.strokeStyle = '#3fb950';
                                } else {
                                    ctx.fillStyle = '#1a1a40';
                                    ctx.strokeStyle = isSelected ? '#58a6ff' : '#30363d';
                                }
                                ctx.lineWidth = isSelected ? 2 : 1;
                                ctx.beginPath();
                                ctx.roundRect(ox, oy, optW, optH, 6);
                                ctx.fill();
                                ctx.stroke();

                                ctx.fillStyle = '#c9d1d9';
                                ctx.font = '12px sans-serif';
                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillText(prob.options[oi], ox + optW / 2, oy + optH / 2);
                            }

                            // Result feedback
                            if (showResult) {
                                var fbY = optY + Math.ceil(prob.options.length / cols) * (optH + 8) + 15;
                                if (selected === prob.answer) {
                                    ctx.fillStyle = '#3fb950';
                                    ctx.font = 'bold 14px sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Correct!', w / 2, fbY);
                                } else {
                                    ctx.fillStyle = '#f85149';
                                    ctx.font = 'bold 14px sans-serif';
                                    ctx.textAlign = 'center';
                                    ctx.fillText('Not quite. The answer is: ' + prob.options[prob.answer], w / 2, fbY);
                                }
                            }
                        }

                        viz.canvas.addEventListener('click', function(e) {
                            if (showResult) return;
                            var rect = viz.canvas.getBoundingClientRect();
                            var mx = e.clientX - rect.left;
                            var my = e.clientY - rect.top;
                            var prob = problems[probIdx];
                            var argLines2 = [];
                            ctx.font = '14px sans-serif';
                            var argWords2 = prob.argument.split(' ');
                            var cl2 = '';
                            for (var i = 0; i < argWords2.length; i++) {
                                var tl2 = cl2 ? cl2 + ' ' + argWords2[i] : argWords2[i];
                                if (ctx.measureText(tl2).width > w - 80) { argLines2.push(cl2); cl2 = argWords2[i]; }
                                else cl2 = tl2;
                            }
                            if (cl2) argLines2.push(cl2);
                            var bubbleH2 = argLines2.length * 22 + 30;
                            var qY2 = 30 + bubbleH2 + 20;
                            var optY2 = qY2 + 30;
                            var optW2 = Math.min(200, (w - 40) / 2 - 10);
                            var optH2 = 35;
                            var cols2 = 2;
                            for (var oi2 = 0; oi2 < prob.options.length; oi2++) {
                                var col2 = oi2 % cols2;
                                var row2 = Math.floor(oi2 / cols2);
                                var ox2 = (w - (optW2 * cols2 + 10 * (cols2 - 1))) / 2 + col2 * (optW2 + 10);
                                var oy2 = optY2 + row2 * (optH2 + 8);
                                if (mx >= ox2 && mx <= ox2 + optW2 && my >= oy2 && my <= oy2 + optH2) {
                                    selected = oi2;
                                    showResult = true;
                                    draw();
                                    return;
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
                    question: 'Identify the fallacy in each argument:<br>(a) "If you eat healthy food, you will be healthy. You are healthy. So you must eat healthy food."<br>(b) "If you do not do your homework, you will fail. You did your homework. So you will not fail."<br>(c) "Democracy is the best system because systems that are democratic are better than those that are not."',
                    hint: '(a) Check the direction of reasoning. (b) Is the hypothesis being affirmed or denied? (c) Does the conclusion hide in the premises?',
                    solution: '(a) <strong>Affirming the Consequent.</strong> Being healthy could have other causes (exercise, genetics). (b) <strong>Denying the Antecedent.</strong> "If NOT homework then fail" does not mean "if homework then NOT fail." You could still fail for other reasons (bad test performance). (c) <strong>Circular Reasoning.</strong> "Best because better" is just restating the conclusion as a premise.'
                },
                {
                    question: 'A politician says: "Either you support my tax plan, or you want the economy to collapse." What fallacy is this? Explain why it is wrong.',
                    hint: 'Are those really the only two options?',
                    solution: 'This is a <strong>False Dichotomy</strong>. There are many possible positions: you could oppose this specific tax plan while supporting a different one; you could agree with parts of it but not others; you could think the economy will do fine regardless; or you could have a completely different approach. Presenting only two extreme options is a rhetorical trick, not a logical argument.'
                },
                {
                    question: 'Create your own example of each fallacy: (a) Affirming the Consequent, (b) Denying the Antecedent, (c) Circular Reasoning. Then explain why each is invalid.',
                    hint: 'For (a), start with a true "if...then" statement and then incorrectly conclude the hypothesis from the conclusion. For (b), deny the hypothesis and incorrectly conclude the negation of the conclusion.',
                    solution: 'Example answers: (a) "If it is a dog, it is an animal. Fluffy is an animal. So Fluffy is a dog." (Fluffy could be a cat.) (b) "If you are in Paris, you are in France. You are not in Paris. So you are not in France." (You could be in Lyon.) (c) "This restaurant is the best because no restaurant is better." (Restating the claim.) Each is invalid because the conclusion does not follow necessarily from the premises.'
                }
            ]
        },

        // ===== Section 4: Sherlock Holmes Style Puzzles =====
        {
            id: 'sherlock-holmes-puzzles',
            title: 'Sherlock Holmes Style Puzzles',
            content: `
<h2>"When You Have Eliminated the Impossible..."</h2>

<p>Sherlock Holmes famously said: "When you have eliminated the impossible, whatever remains, however improbable, must be the truth." This is <strong>modus tollens and proof by elimination</strong> in action. Let us solve some detective-style logic puzzles using the tools from this chapter.</p>

<h3>Puzzle 1: The Three Suspects</h3>

<div class="env-block example">
<strong>The Case of the Missing Cookie</strong><br>
A cookie has disappeared from the kitchen. Three suspects: Alice, Bob, and Carol. We know:<br>
<ol>
<li>If Alice took it, she did it before noon.</li>
<li>If Bob took it, Alice was in the kitchen too.</li>
<li>Alice was NOT in the kitchen before noon.</li>
<li>Exactly one person took the cookie.</li>
</ol>
Who took the cookie?
</div>

<p><strong>Solution using logical deduction:</strong></p>
<p>From clue 3: Alice was not in the kitchen before noon.</p>
<p>From clue 1 (contrapositive): If Alice did NOT do it before noon, then Alice did NOT take it. Combined with clue 3: Alice did not take it.</p>
<p>From clue 2 (contrapositive): If Alice was NOT in the kitchen, then Bob did NOT take it. Since Alice was not in the kitchen before noon (and the cookie was taken, so Bob would need Alice there), Bob did not take it.</p>
<p>By elimination (clue 4): Carol took the cookie!</p>

<p>Notice how we used modus tollens (contrapositives) and elimination. Each step was logically airtight.</p>

<h3>Puzzle 2: The Hat Riddle</h3>

<div class="env-block example">
<strong>Three Hats</strong><br>
Three students, A, B, and C, sit in a line (A in back, C in front). A can see B and C. B can see C. C cannot see anyone. A teacher places a hat on each head from a bag of 3 red and 2 blue hats.<br><br>
The teacher asks A: "Do you know the color of your hat?" A says: "No."<br>
The teacher asks B: "Do you know the color of your hat?" B says: "No."<br>
The teacher asks C: "Do you know the color of your hat?" C says: "Yes!"<br><br>
What color is C's hat, and how does C know?
</div>

<p><strong>Solution:</strong></p>
<p><strong>Step 1 (A's reasoning):</strong> A can see B and C. The only way A could know their own hat color is if both B and C wore blue (since there are only 2 blue hats). A said "No," so B and C are NOT both blue.</p>

<p><strong>Step 2 (B's reasoning):</strong> B heard A's answer and knows that B and C are not both blue. B can see C. If C's hat were blue, then B would know they cannot also be blue (since that would make both blue, contradicting A's deduction). So B would know they must be red. But B said "No." Therefore, C's hat is NOT blue.</p>

<p><strong>Step 3 (C's reasoning):</strong> C, being clever, follows the same chain of logic and concludes: my hat must be <strong>red</strong>.</p>

<div class="env-block intuition">
<strong>The key technique</strong><br>
In these puzzles, what people <em>cannot</em> deduce is just as informative as what they can. When A says "I don't know," that <em>eliminates possibilities</em> for everyone else. This is called <strong>common knowledge reasoning</strong>, and it appears in game theory, cryptography, and distributed computing.
</div>

<h3>Puzzle 3: The Logical Labyrinth</h3>

<div class="env-block example">
<strong>Three Doors</strong><br>
You face three doors. Behind one is a prize. Each door has a sign:<br>
<ul>
<li>Door 1: "The prize is behind this door."</li>
<li>Door 2: "The prize is not behind this door."</li>
<li>Door 3: "The prize is not behind Door 1."</li>
</ul>
You are told that exactly one sign is true. Which door has the prize?
</div>

<p><strong>Solution:</strong> Try each possibility:</p>
<p><strong>Case 1:</strong> Prize behind Door 1. Then Sign 1 is true, Sign 2 is true (not behind Door 2), Sign 3 is false. Two signs are true. Contradiction (we need exactly one).</p>
<p><strong>Case 2:</strong> Prize behind Door 2. Then Sign 1 is false, Sign 2 is false (it IS behind Door 2), Sign 3 is true. Only one sign is true. This works!</p>
<p><strong>Case 3:</strong> Prize behind Door 3. Then Sign 1 is false, Sign 2 is true, Sign 3 is true. Two signs are true. Contradiction.</p>
<p>The prize is behind <strong>Door 2</strong>.</p>

<p>Every one of these puzzles used the same toolkit: conditional statements, contrapositives, modus ponens, modus tollens, and proof by elimination. These are not just abstract logical tools; they are exactly how detectives, scientists, and mathematicians reason every day.</p>
`,
            visualizations: [],
            exercises: [
                {
                    question: '<strong>The Island of Knights and Liars, Advanced:</strong> You meet three people: A, B, C. A says: "All of us are liars." B says: "Exactly one of us is a liar." Who is what?',
                    hint: 'If A is a knight, then "all are liars" is true, meaning A is a liar. Contradiction, so A must be a liar. Now since A is a liar, "all are liars" is false, so at least one person is a knight...',
                    solution: 'A is a liar (a knight saying "all are liars" is a contradiction). Since A is a liar, "all are liars" is false, so at least one of B or C is a knight. If B is a knight, "exactly one is a liar" is true, so exactly one of A, B, C is a liar. That would mean both A is a liar and exactly one person is a liar, so B and C are knights. Check: A (liar) says "all are liars" (false, since B and C are knights). B (knight) says "exactly one is a liar" (true, since only A is). Consistent! Answer: A = liar, B = knight, C = knight.'
                },
                {
                    question: '<strong>The Poisoned Wine Puzzle:</strong> You have 8 bottles of wine. One is poisoned. You have 3 test strips that change color if exposed to poison (but each can only be used once, and results take a day). How can you identify the poisoned bottle in just ONE day?',
                    hint: 'Think in binary. 3 strips can produce \\(2^3 = 8\\) different combinations of positive/negative results. Assign each bottle a unique 3-bit binary code.',
                    solution: 'Label the bottles 0-7 in binary: 000, 001, 010, 011, 100, 101, 110, 111. Put a drop from each bottle whose first bit is 1 on strip 1, each bottle whose second bit is 1 on strip 2, and each bottle whose third bit is 1 on strip 3. After one day, the pattern of positive strips gives you the binary number of the poisoned bottle. For example, if strips 1 and 3 are positive but strip 2 is not, the poisoned bottle is 101 = bottle 5. This is conditional reasoning: "If bottle X is poisoned, then strips corresponding to X\'s binary digits will be positive."'
                },
                {
                    question: '<strong>The Muddy Children Puzzle:</strong> Two children, A and B, play outside and might get mud on their foreheads. Each can see the other but not themselves. A teacher says: "At least one of you has mud on your forehead." Then she asks: "Do you know if you have mud?" Both say "No." She asks again. Now both say "Yes." How many children have mud?',
                    hint: 'If only one child had mud, the clean child would see mud on the other and know they are clean (since "at least one" must have mud). So after the first "No," what can each child deduce?',
                    solution: 'Both children have mud. Here is why: If only A had mud, B would see mud on A and know B is clean (since at least one has mud and A does). B would say "Yes" in the first round. Similarly if only B had mud. Since both said "No" in round 1, each child reasons: "If I were clean, the other would have deduced in round 1 that they have mud. Since they did not, I must also have mud." So in round 2, both say "Yes." This is the same common-knowledge reasoning as the hat puzzle.'
                }
            ]
        }
    ]
});
})();
