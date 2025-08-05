---
title: "8 In-Context Learning & Chain-of-Thought"
date: "2025-08-04 00:00:04"
excerpt: "Here is a concise summary of In-Context Learning and Chain-of-Thought prompting."
---

## In-Context Learning (ICL) & Chain-of-Thought (CoT) — **Exam-Ready Cheat-Sheet**

---

### 1 Key Ideas at a Glance

| Concept                           | Essence                                                                                                                                       | Why it matters on the exam                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **In-Context Learning**           | At inference time, the LLM **infers a new task** from a _few demo pairs inside the prompt_—**no parameter update** required.                  | Be ready to state the conditional-probability formulation and contrast it with fine-tuning. |
| **Chain-of-Thought**              | Supplying **step-by-step reasoning tokens** (“Let’s think step by step …”) nudges the model to produce better answers on multi-step problems. | Must explain _why_ it helps and cite a concrete example prompt.                             |
| **Zero / Few / Many-Shot**        | Same mechanism; just 0, k, or many demos.                                                                                                     | Definitions show up in short-answer questions.                                              |
| **Instruction vs. Demonstration** | CoT is _instructional_ (“explain your work”); ICL is _demonstrational_ (examples).                                                            | Common “compare & contrast” prompt.                                                         |

---

### 2 In-Context Learning — Formal View

1. **Notation**

   - Prompt contains $k$ demos $D=\{(x_i,y_i)\}_{i=1}^k$ + a new query $x^*$.

2. **Predictive Distribution**

$$
\hat{y} \;=\; \arg\max_{y}\; p_\theta\!\bigl(y \mid x^*, D\bigr),
\qquad
p_\theta(y \mid x^*, D) \;=\; \prod_{t=1}^{|y|}
p_\theta\!\bigl(y_t \mid y_{<t}, x^*, D\bigr)
$$

- **No** gradient update on $\theta$; learning is purely _Bayesian conditioning_ in token space.
- Empirically first observed in GPT-3 when model size ≈ 100 × GPT-2 .

3. **ICL vs. Fine-Tuning**

| Aspect          | ICL                 | Fine-tune              |
| --------------- | ------------------- | ---------------------- |
| Params updated? | **None**            | Yes                    |
| Cost per task   | ≈ 0 s (prompt only) | minutes-hours training |
| Task storage    | In prompt           | In weights             |

4. **Why it works** (hypotheses)

   - Large models learn a _latent training algorithm_ during pre-training.
   - Attention lets new examples rapidly shape token-level context priors.

---

### 3 Chain-of-Thought Prompting

1. **Definition**

   > _Add natural-language reasoning steps in the prompt; ask the model to do the same before the final answer._&#x20;

2. **Mechanism**

   - Inserts intermediate latent states **as visible text**, giving the decoder “scratch-pad” space.
   - Reduces length-generalization gap (forces model to articulate hidden reasoning).

3. **Minimal CoT Trick**

   - Even the single sentence **“Let’s think step by step.”** boosts accuracy on arithmetic, commonsense, and symbolic tasks .

4. **Example Prompt**

```
Q: What is 23 × 47?
A (step-by-step): 20×47=940, 3×47=141, 940+141=1081. Answer: 1081.
```

---

### 4 Common Exam Prompts & Quick Answers

| Prompt                           | One-liner you should write                                                                                                                                 |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| _“What is in-context learning?”_ | “Learning a new mapping from **few prompt examples only**, without updating model parameters.”                                                             |
| _“ICL vs. fine-tuning?”_         | Highlight **no-update vs. gradient-update**, latency, and storage differences.                                                                             |
| _“Why does CoT help?”_           | Provides explicit intermediate reasoning tokens → easier credit assignment, mitigates depth-bias, and makes use of the model’s language modeling strength. |
| _“Give a CoT example.”_          | Provide arithmetic or logic demo as above.                                                                                                                 |

---

### 5 Mnemonics

- **ICL = “I Copy & Learn”** — model copies patterns from the _In-prompt_ **C**ontext.
- **CoT = “Chalk-On-Table”** — write your reasoning out loud.
- Remember: **Demo→Predict (ICL)**, **Reason→Answer (CoT)**.

---

### 6 Key Slide References (good to cite in exam)

- Slide **20-21**: ICL description&#x20;
- Slide **21-22**: CoT description & Wei et al. 2022&#x20;

## Exam sample questions

### \*\*Practice Final-Exam Questions

Topic — In-Context Learning (ICL) & Chain-of-Thought (CoT)\*\*

_The format mirrors the “Part I: Knowledge / Part II: Application” style you saw in the F24 sample paper. Suggested point values are in brackets; answers follow each question in **bold**._

---

#### **Part I – Knowledge (2 pts each)**

1. **\[2] Define _In-Context Learning_.**
   **Answer:** A large language model’s ability to infer a new input-output mapping from a small set of example pairs provided _only in the prompt_, without updating its parameters.&#x20;

2. **\[2] Contrast ICL with conventional fine-tuning in two concrete aspects.**
   **Answer:**

   - **Parameter updates:** ICL performs _none_; fine-tuning updates model weights.
   - **Cost per new task:** ICL adds only prompt length at inference; fine-tuning incurs extra training time and compute.

3. **\[2] Explain why ICL first emerged only in very large models such as GPT-3.**
   **Answer:** Model scale (>100× GPT-2) appears to endow the network with a _latent training algorithm_ able to interpret new demonstration patterns inside its attention span.&#x20;

4. **\[2] Give the conditional-probability formula the model uses to predict $y^*$ from $k$ in-prompt demos $\{(x_i,y_i)\}_{i=1}^k$ and a query $x^*$.**
   **Answer:** $\displaystyle  
   \hat{y}=\arg\max_{y}\prod_{t=1}^{|y|}p_\theta\bigl(y_t \mid y_{<t},x^*,(x_1,y_1),\dots,(x_k,y_k)\bigr)$.

5. **\[2] Define zero-shot, few-shot, and many-shot learning in the ICL context.**
   **Answer:** They differ only in **how many** demonstration pairs appear in the prompt: 0, a small $k$, or a large $k$ respectively; the mechanism (prompt-based conditioning) is identical.

6. **\[2] What is _Chain-of-Thought_ prompting?**
   **Answer:** An instruction style that inserts explicit step-by-step reasoning tokens into the prompt and asks the model to produce similar intermediate reasoning before the final answer.&#x20;

7. **\[2] Write a _minimal_ CoT phrase empirically shown to boost reasoning accuracy.**
   **Answer:** `"Let's think step by step."`&#x20;

8. **\[2] Give two hypothesised reasons CoT improves complex-reasoning accuracy.**
   **Answer:**

   - Provides a “scratch-pad” so the model can allocate tokens to intermediate computations.
   - Eases credit assignment by exposing hidden reasoning paths to next-token prediction.

9. **\[2] Differentiate _demonstration-based_ (ICL) prompts from _instruction-based_ (CoT) prompts in one sentence.**
   **Answer:** ICL shows the _answer pattern_ through example pairs, whereas CoT **tells** the model _how_ to reason, often with no demonstrations.

10. **\[2] State one practical limitation of manually annotating full CoT rationales and the research direction it motivates.**
    **Answer:** Human labeling of detailed reasoning is costly, motivating work on automatic prompt engineering and self-generated CoT.&#x20;

---

#### **Part II – Application (10 pts total)**

11. **Arithmetic Reasoning with CoT (10 pts)**

**Question (a) \[4]:** Design a prompt (using ≤ 4 demonstration lines) that teaches a model to add two two-digit numbers via CoT.

**Question (b) \[6]:** Show the model’s expected step-by-step reasoning and final answer when the query is `“Q: 38 + 47 = ?”`.

**Answer:**

**(a) Prompt design**

```
Q: 23 + 45 = ?
A (step by step): 20+45=65, 3+0=3, 65+3 = 68. Answer: 68.

Q: 12 + 34 = ?
A (step by step): 10+34=44, 2+0=2, 44+2 = 46. Answer: 46.

Q: 38 + 47 = ?
```

**(b) Expected model completion**

```
A (step by step): 30+47 = 77, 8+0 = 8, 77+8 = 85. Answer: 85.
```

_Scoring rubric suggestion:_ 2 pts correct decomposition, 2 pts correct intermediate sums, 2 pts correct final answer.
