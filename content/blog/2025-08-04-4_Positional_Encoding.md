---
title: "4 Positional Encoding"
date: "2025-08-04 00:00:08"
excerpt: "Here is a concise summary of Positional Encoding techniques."
---

## Positional Encoding (Additive Sinusoidal vs Rotary / RoPE) — **Exam Cheat-Sheet**

---

### 1 Key Ideas

| Concept                              | Essence                                                                                                                              | Why it shows up on the exam                                                      |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| **Additive Sinusoidal PE**           | Pre-computes a $(n\times d)$ matrix of sine & cosine waves and **adds** it once to token embeddings.                                 | Expect “derive / compute the encoding for a given index” or “why no parameters?” |
| **Rotary Position Embedding (RoPE)** | Applies a **position-dependent rotation** to every $(x_{2i},x_{2i+1})$ pair inside Q & K at _each_ attention layer (multiplicative). | Typical “compare with sinusoidal” & “why does it extrapolate better?” questions  |
| **Why positional info?**             | Attention is permutation-invariant; we must inject order so the model distinguishes “dog bites man” vs “man bites dog”.              | Often the very first sub-question.                                               |

---

### 2 Additive Sinusoidal Encoding – Details & Formula

For position $t$ (0-based) and even dimension $2i$:

$$
W_{t,2i}^{p}= \sin\!\bigl(t/10000^{2i/d}\bigr),\quad
W_{t,2i+1}^{p}= \cos\!\bigl(t/10000^{2i/d}\bigr):contentReference[oaicite:4]{index=4}
$$

- **No learnable parameters** — the matrix is fixed once $d$ is chosen.
- **Addition only at the input layer**; deeper layers keep absolute positions implicitly.
- **Phase interpretation**: Each dimension corresponds to a sinusoid with wavelength ranging from $2\pi$ to $10000\,\pi$; dot-products of two encodings depend only on their relative distance.

---

### 3 Rotary Position Encoding (RoPE)

1. **Angular frequencies**

$$
\theta_i = 10000^{-2(i-1)/d},\qquad i=1,\dots,d/2:contentReference[oaicite:6]{index=6}
$$

2. **Rotation per token**

For position $t$ define angle $\phi_{t,i}=t\theta_i$.
For each 2-D subvector $(x_{2i},x_{2i+1})$:

$$
\bigl(x_{2i}^{\prime},x_{2i+1}^{\prime}\bigr)=
\bigl(x_{2i}\cos\phi_{t,i}-x_{2i+1}\sin\phi_{t,i},\;
      x_{2i}\sin\phi_{t,i}+x_{2i+1}\cos\phi_{t,i}\bigr)
$$

3. **Applied to Q & K in _every_ attention layer**, so relative angles accumulate naturally; allows length extrapolation and keeps dot-products dependent only on distance, not absolute index.

---

### 4 Additive vs RoPE — Fast Comparison

| Aspect                          | Additive                                         | RoPE                                           |
| ------------------------------- | ------------------------------------------------ | ---------------------------------------------- |
| **Operation**                   | $\text{embed} + W^p$ once                        | Element-wise **rotation** of Q & K every layer |
| **Params**                      | 0                                                | 0                                              |
| **Complexity**                  | $\mathcal O(nd)$ pre-compute, negligible runtime | $\mathcal O(nd)$ per layer (cheap)             |
| **Extrapolation to longer seq** | Limited (absolute encoding)                      | Better (purely relative after rotation)        |
| **Paper / adoption**            | Vaswani et al. 2017                              | Su et al., used in LLaMA/ChatGLM               |

---

### 5 Common Exam Prompts & Quick Answers

| Prompt                                                               | Checklist                                                                                                                                     |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| _“Compute PE for token 7 when $d=4$.”_                               | Plug $t=7$ into sine & cosine formula above.                                                                                                  |
| _“Why does RoPE help with long sequences?”_                          | Rotation makes attention scores depend on **relative offsets**, so model generalizes beyond trained length.                                   |
| _“State one advantage and one drawback of additive PE.”_             | Advantage – cheap and simple; Drawback – fixed length & injected only once.                                                                   |
| _“Explain how RoPE is incorporated into the attention dot-product.”_ | Rotate Q and K, then compute $Q^\prime K^{\prime\top}$; rotation cancels so score equals $Q$·$K$ weighted by $\cos(\Delta)$ & $\sin(\Delta)$. |

---

### 6 Memory Hook

_Think “**Sine-Cosine at Start, Rotary Repeats**”_ — sinusoid is added **once**; RoPE **rotates** at **each** layer.

---

## Sample Exam-Style Questions & Answers

Below is a **mini “exam-style” question set** that focuses **only on the topic _Positional Encoding (Additive Sinusoidal vs RoPE)_**.
Questions mimic the wording, depth, and formatting of the official CS 480/680 finals you showed.
An answer key follows immediately after the questions.

---

## Part I Knowledge (Conceptual) — 20 points

**1.** _(4 pts)_ Why must a Transformer inject positional information into its token representations? Give two concrete failure cases that occur when position is omitted.

**2.** _(4 pts)_ State the full mathematical expressions for the even- and odd-indexed components of the additive sinusoidal positional encoding matrix $W^p$.

**3.** _(4 pts)_ Describe two limitations of additive sinusoidal encoding that motivated the development of Rotary Position Embedding (RoPE).

**4.** _(4 pts)_ RoPE applies a learned-parameter-free rotation to every $(x_{2i},x_{2i+1})$ pair of a vector $x$.
  (a) Write the rotation equations for the transformed coordinates $(x'_{2i},x'_{2i+1})$.
  (b) Explain in one sentence why this makes the resulting attention score depend only on the relative distance between tokens.

**5.** _(4 pts)_ Give one advantage and one disadvantage of re-applying the RoPE transformation at **every** attention layer instead of adding a single positional embedding at the input.

---

## Part II Application (Numerical) — 10 points

**6.** _(6 pts)_ Let the model dimension be $d=4$. Compute the additive sinusoidal positional encoding vector $W^p_{7,*}$ for position index $t=7$. Show intermediate steps.

**7.** _(4 pts)_ Consider a RoPE-encoded query $q'$ and key $k'$ that come from absolute positions $t=5$ and $t=12$ respectively.
Using the RoPE property $q' \cdot k' = q \cdot k \, \cos(\Delta) + (\text{orthogonal terms})$, write $\Delta$ in terms of $t$ and explain why the dot-product depends solely on relative offset.

---

## **Answer Key**

### 1 (Why inject position)

A Transformer’s self-attention is permutation-invariant; without positional signals it cannot distinguish sequences that differ only by token order (e.g., “dog bites man” vs “man bites dog”) or capture long-range order-specific patterns such as programming syntax nesting.

### 2 (Sinusoidal formulas)

$$
\boxed{W^{p}_{t,2i}   = \sin\!\bigl(t/10000^{\;2i/d}\bigr)},\qquad
\boxed{W^{p}_{t,2i+1} = \cos\!\bigl(t/10000^{\;2i/d}\bigr)}
$$

where $t$ is the 0-based position, $i=0,\dots,d/2-1$, and $d$ is the model dimension.

### 3 (Limitations of additive PE)

1. Encodes **absolute** positions only; generalizes poorly when inference sequence length ≫ training length.
2. Added once at input, so deeper layers cannot dynamically modulate position; relative distance information degrades with depth.

### 4 (RoPE rotation)

(a) Let $\phi_{t,i}=t\,\theta_i$ with $\theta_i = 10000^{-2i/d}$.

$$
\begin{aligned}
x'_{2i}   &= x_{2i}\cos\phi_{t,i} - x_{2i+1}\sin\phi_{t,i},\\
x'_{2i+1} &= x_{2i}\sin\phi_{t,i} + x_{2i+1}\cos\phi_{t,i}.
\end{aligned}
$$

(b) Because both $q$ and $k$ are rotated by angles proportional to their indices, their inner product after rotation depends only on the angle **difference** $\phi_{t_q,i}-\phi_{t_k,i}$, i.e., their relative positional offset.

### 5 (Pros & cons of per-layer RoPE)

_Advantage:_ Maintains fresh relative-position information at each layer, enabling length extrapolation and better compositional reasoning.
_Disadvantage:_ Adds a small but non-zero per-layer cost; positional signal can excessively dominate if layer norms are mis-tuned.

---

### 6 (Numerical sinusoidal PE, $d=4,\;t=7$)

For $d=4$: $i=0,1$.

$$
\begin{aligned}
W^{p}_{7,0} &= \sin\!\bigl(7/10000^{0}\bigr)=\sin(7)\approx 0.6570,\\
W^{p}_{7,1} &= \cos\!\bigl(7/10000^{0}\bigr)=\cos(7)\approx 0.7539,\\
W^{p}_{7,2} &= \sin\!\bigl(7/10000^{2/4}\bigr)=\sin\!\bigl(7/100\bigr)\approx 0.0698,\\
W^{p}_{7,3} &= \cos\!\bigl(7/100\bigr)\approx 0.9976.
\end{aligned}
$$

Hence $W^p_{7,*}\approx(0.6570,\;0.7539,\;0.0698,\;0.9976)$.

### 7 (Relative offset in RoPE)

Absolute indices: $t_q=5,\;t_k=12$.
Relative offset $\Delta = t_k - t_q = 7$.
Because the rotation angles are linear in $t$, the cosine factor becomes $\cos(\Delta\,\theta_i)$; therefore the dot-product is a deterministic function of the **distance 7**, independent of the absolute positions 5 or 12.
