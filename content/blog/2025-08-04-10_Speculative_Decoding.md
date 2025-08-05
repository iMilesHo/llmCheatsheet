---
title: "10 Speculative Decoding"
date: "2025-08-04 00:00:02"
excerpt: "Here is a concise summary of Speculative Decoding."
---

## Cheatsheet – **Speculative Decoding**

| What                | Why it matters                                                                                                                                        | Formula / API hook                                                                                                                                                                                                                                              |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Idea**            | Use a _small draft model_ to _propose_ $K$ tokens, then have the _large target model_ verify them in parallel → far fewer large-model forward passes. | `assistant_model=`<draft> and `num_assistant_tokens=K` in 🤗 `generate()`                                                                                                                                                                                       |
| **Acceptance rule** | Keeps distribution identical to the target model (unbiased).                                                                                          | For the _i-th_ proposed token $\hat y_i$: $\displaystyle \alpha_i=\min\!\Bigl(1,\frac{p_T(\hat y_i\mid x,\hat y_{<i})}{p_S(\hat y_i\mid x,\hat y_{<i})}\Bigr)$ – accept with probability $\alpha_i$; if any reject, discard the rest and let the target resume. |
| **Speed lever $K$** | Bigger $K$ → fewer verifications but higher reject risk; HW3 explores $K=\{5,10,15\}$.                                                                |                                                                                                                                                                                                                                                                 |
| **When it helps**   | Draft ≪ Target in params/latency; proposal quality reasonably close so most tokens pass.                                                              |                                                                                                                                                                                                                                                                 |
| **Pros**            | • 2-3 × speed-ups in practice • Parallel verification exploits GPU throughput • No quality drop (provably identical distribution)                     |                                                                                                                                                                                                                                                                 |
| **Cons**            | • Extra draft-model compute • Poor $K$ choice can negate gains • Implementation complexity                                                            |                                                                                                                                                                                                                                                                 |

### Algorithm (step-by-step)

1. **Draft phase**
   Draft model $S$ samples $K$ tokens $\hat y_{1:K}$ autoregressively from prefix $x$.

2. **Verify phase** (single forward pass of target $T$)

   - Compute $p_T(\hat y_i|x,\hat y_{<i})$ for all $i$.
   - For each token apply acceptance rule above.

3. **Commit / Correct**

   - If every token accepted → append all $K$ tokens to the output and start a new round.
   - On first rejection → keep accepted prefix, let $T$ generate the next token, and repeat.

4. **Stop** at `[EOS]` or length limit.

### Intuition for the speed-up

- **Naïve decoding:** one target-model call **per token**.
- **Speculative decoding:** one _draft_ call **+** one _target_ call **per $K$ tokens on average** ⇒ ≈$(1 + \text{draft/target ratio}) / K$ of the original large-model compute.

### Typical exam questions

1. _“What is speculative decoding and how does it speed up generation?”_

   > It batches $K$ candidate tokens from a small model and verifies them once with the large model, cutting large-model calls roughly by $K$ while preserving output fidelity through the acceptance rule.

2. _“Give two pros and two cons of speculative decoding.”_

   > Pros: large speed-up; identical quality. Cons: extra small-model overhead; tuning $K$ is non-trivial.

### Quick reference

```python
# HuggingFace Transformers example
response = big_model.generate(
    input_ids,
    assistant_model=draft_model,
    num_assistant_tokens=K,   # e.g., 10
    max_new_tokens=…
)
```

## Exam sample questions

### Likely Exam-Style Questions on **Speculative Decoding** (with concise answers)

| #                                             | Sample question (mirrors the style & point values of past finals)                                                  | Model answer                                                                                                                                                                                                                                                                                                                                                                 |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Definition & intuition (2 pts)**         | _“What is speculative decoding and how does it accelerate large-model text generation?”_                           | A small **draft/assistant model** first **samples $K$ candidate tokens**; the large **target model** then verifies them **in a single forward pass**. Because one target pass now covers roughly $K$ tokens, the number of expensive large-model calls drops by ≈$1/K$.                                                                                                      |
| **2. Acceptance-probability formula (4 pts)** | _“Write the acceptance rule that guarantees the output distribution matches the target model.”_                    | For the $i$-th proposed token $\hat y_i$: $\alpha_i \;=\;\min\!\Bigl(1,\; \frac{p_T(\hat y_i \mid x,\hat y_{<i})}{\,p_S(\hat y_i \mid x,\hat y_{<i})}\Bigr)$ Accept $\hat y_i$ with probability $\alpha_i$; on the first rejection discard the rest and let the target model resume generation. This Metropolis-Hastings style step preserves the exact target distribution. |
| **3. Speed-up computation (3 pts)**           | _“If the draft model is 5× faster per token than the target model and $K=10$, estimate the theoretical speed-up.”_ | Cost per **10** output tokens: one draft pass (+1 unit), one target pass (+10 units). Naïve decoding needs 10 target passes (10 × 10 = 100 units). So speculative decoding ≈ 11 units vs 100 → **≈ 9× faster**.                                                                                                                                                              |
| **4. Pros & cons (2 pts)**                    | _“State two advantages and two disadvantages of speculative decoding.”_                                            | **Pros:** (i) 2–3× wall-clock speed-up on GPUs; (ii) identical output quality (unbiased). **Cons:** (i) requires an extra draft model kept in memory; (ii) poor $K$ choice or low draft quality can waste compute via frequent rejections.                                                                                                                                   |
| **5. Practical API (1 pt)**                   | _“In HuggingFace `generate()`, which two arguments enable speculative decoding?”_                                  | `assistant_model=<draft_model>` and `num_assistant_tokens=K`                                                                                                                                                                                                                                                                                                                 |
| **6. Effect of $K$ (3 pts)**                  | _“Explain how increasing $K$ influences speed and acceptance rate.”_                                               | Larger $K$ means **fewer target calls** (better speed) but each batch of proposals is **harder to accept in full**, so rejections become more likely, offsetting gains. Optimal $K$ balances these forces; empirical sweet spots are often in the 5–15 range (explored in HW3 Q2).                                                                                           |

Use these Q\&A pairs to drill the exact formulas, API knobs, and intuition the instructor highlighted in Lecture 12 and **HW3 Q2**—they match the terse, concept-plus-calculation style of previous CS480/680 finals.
