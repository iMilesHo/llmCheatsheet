---
title: "1 Scaled Dot-Product Attention & Multi-Head Attention"
date: "2025-08-04 00:00:11"
excerpt: "Here is a concise summary of Scaled Dot-Product Attention and Multi-Head Attention mechanisms."
---

## Scaled Dot-Product Attention & Multi-Head Attention — **Exam-Ready Cheat-Sheet**

---

### 1 Key Ideas at a Glance

| Concept                          | Essence                                                                                                                                   | Why it matters on the exam                                                         |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| **Scaled Dot-Product Attention** | Uses dot-product similarity between **Q** (queries) and **K** (keys), rescales by $\sqrt{d_k}$, then soft-maxes to weight **V** (values). | You must write **the full formula** and justify the scaling term.                  |
| **Multi-Head Attention (MHA)**   | Runs _h_ independent scaled-attention “heads” on linearly projected versions of $(Q,K,V)$; concatenates and projects once more.           | Be able to: (a) write head + output formulas, (b) explain why multiple heads help. |
| **Self vs Cross Attention**      | Self: $Q=K=V$ (within one sequence) • Cross: $Q$ from decoder, $K=V$ from encoder.                                                        | Typical “explain the difference” short-answer.                                     |
| **Masking & KV-cache**           | Causal mask blocks future tokens; KV-cache stores past $K,V$ for fast autoregressive decoding.                                            | Often appears as “why is generation linear, not quadratic?”                        |

---

### 2 Scaled Dot-Product Attention — Full Details

1. **Shapes**

   - $Q\in\mathbb{R}^{m\times d_k},\;K\in\mathbb{R}^{n\times d_k},\;V\in\mathbb{R}^{n\times d_v}$
     (usually $d_k=d_v=d_{\text{model}}/h$).

2. **Core Formula**

$$
\operatorname{Attention}(Q,K,V)\;=\;\operatorname{softmax}\!\Bigl(\tfrac{QK^{\!\top}}{\sqrt{d_k}}\Bigr)\,V
$$

3. **Why the $\sqrt{d_k}$ scaling?**

   - Without scaling, the dot-products’ variance grows with $d_k$; softmax enters a small-gradient regime and learning stalls. Scaling keeps logits in a “healthy” range.

4. **Softmax is row-wise** – each query produces a probability distribution over keys, so each output row is a convex combination of value rows.

5. **Complexities**

   - Time: $\mathcal{O}(mn\,d_k)$
   - Memory: $\mathcal{O}(mn)$ for attention matrix (masked in practice).

---

### 3 Multi-Head Attention (MHA)

1. **Per-head projection & computation**

$$
\text{head}_i = \operatorname{Attention}\!\bigl(QW_i^{Q},\,KW_i^{K},\,VW_i^{V}\bigr),\quad i=1,\dots,h
$$

2. **Final concatenation & output**

$$
\text{MHA}(Q,K,V)=\bigl[\text{head}_1\;\|\,\dots\|\,\text{head}_h\bigr]\,W^{O}
$$

- $W_i^{Q},W_i^{K},W_i^{V}\in\mathbb{R}^{d_{\text{model}}\times d_k}$; $W^{O}\in\mathbb{R}^{hd_v\times d_{\text{model}}}$.
- Linear layers for each head are learned.

3. **Why multiple heads?**

   - Parallel heads let the model attend to information in **different representation sub-spaces**; empirically improves performance and allows smaller $d_k$ per head, keeping computation affordable.

4. **Memory note**: concatenation restores dimensionality to $d_{\text{model}}$ before passing to the next layer / residual block.

---

### 4 Common Exam Prompts & Quick Answers

| Prompt                                          | One-line answer / checklist                                            |
| ----------------------------------------------- | ---------------------------------------------------------------------- |
| _Write the attention formula & explain scaling_ | Provide equation above + mention gradient stability.                   |
| _Derive parameter count for MHA_                | $3h d_{\text{model}}d_k + hd_v d_{\text{model}}$.                      |
| _Self vs cross attention difference_            | Same tensors vs encoder–decoder split and differing lengths $m,n$.     |
| _Why mask in decoder?_                          | Preserve causality—no peek at future tokens.                           |
| _What does each head learn?_                    | Different linguistic/positional relations (e.g., coreference, syntax). |

---

### 5 Mnemonic Cheats

- **“Q K V → Softmax → V”** — think _“Query asks which Keys, Keys unlock Values.”_
- **“Scale then Softmax”** — _scale small ⇒ gradients large_.
- **M-H-A = Many Heads Acting** — _each thinks in its own sub-space_.

### 🔑 Typical Transformer Configurations

| Model                | $d_{model}$ | Num. Heads $h$ | Dimension per head $d_k$ |
| -------------------- | ----------- | -------------- | ------------------------ |
| Original Transformer | 512         | 8              | 64                       |
| BERT-base            | 768         | 12             | 64                       |
| GPT-2 small          | 768         | 12             | 64                       |
| GPT-3                | 12288       | 96             | 128                      |

---

## Highly probable exam questions

Below is a **mini question bank** (in the style of CS 480/680 finals) focused _only_ on **Scaled Dot-Product Attention & Multi-Head Attention (MHA)**. Each item shows the exact wording you might see, followed by a model answer.

| #      | Possible Exam Question                                                                                                                               | Model Answer / Marking Points                                                                                                                                                                                                           |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1**  | **(2 pts)** Write the matrix-form definition of _scaled dot-product attention_.                                                                      | $\displaystyle\text{Attention}(Q,K,V)=\operatorname{softmax}\!\Bigl(\tfrac{QK^{\top}}{\sqrt{d_k}}\Bigr)V$                                                                                                                               |
| **2**  | **(2 pts)** Why divide by $\sqrt{d_k}$ in the formula above?                                                                                         | Without scaling, the dot products’ variance grows with $d_k$; large logits push soft-max into a flat region with tiny gradients. Dividing by $\sqrt{d_k}$ keeps logits in a numerically stable range and speeds learning.               |
| **3**  | **(2 pts)** State the time & space complexity of computing attention for $Q\!\in\!\mathbb{R}^{m\times d_k}, K,V\!\in\!\mathbb{R}^{n\times d_k/d_v}$. | Time $\mathcal{O}(mn\,d_k)$ (dominated by $QK^{\top}$); space $\mathcal{O}(mn)$ for the attention matrix.                                                                                                                               |
| **4**  | **(2 pts)** Describe _row-wise_ soft-max in attention.                                                                                               | Soft-max is applied **independently to every row** of $QK^{\top}/\sqrt{d_k}$; each row becomes a valid probability vector used to weight the corresponding output row.                                                                  |
| **5**  | **(2 pts)** Contrast _self-attention_ with _cross-attention_ in terms of the sequence lengths $m,n$.                                                 | Self-attention: $m=n$ and $Q=K=V$. Cross-attention (decoder ↔ encoder): $Q$ length $m$ (decoder), $K,V$ length $n$ (encoder).                                                                                                           |
| **6**  | **(3 pts)** Give the learnable parameter count of a **single** MHA layer (ignore bias) with $d_{\text{model}},h,d_k,d_v$.                            | Three projections per head → $3h\,d_{\text{model}}d_k$; output projection → $h\,d_v\,d_{\text{model}}$. Total $=d_{\text{model}}h(3d_k+d_v)$. (Students should show derivation; relies on per-head linear layers described in lecture). |
| **7**  | **(3 pts, numeric)** For $d_{\text{model}}=512,\;h=8,\;d_k=d_v=64$, how many weight scalars does the answer in Q6 evaluate to?                       | $3\cdot8\cdot512\cdot64 + 8\cdot64\cdot512 =  (3+1)\cdot8\cdot512\cdot64 = 4·8·512·64 = 1{,}048{,}576$.                                                                                                                                 |
| **8**  | **(2 pts)** Give **one** reason multiple heads outperform a single wide head.                                                                        | Different heads attend to **different representation sub-spaces**, letting the model capture diverse syntactic/semantic relations while keeping each dot-product low-dimensional and inexpensive.                                       |
| **9**  | **(2 pts)** Why must causal (upper-triangular) masks be applied in decoder self-attention?                                                           | They zero out attention weights to future positions so the model cannot use information it has not generated yet, preserving the auto-regressive property (no “peeking” ahead).                                                         |
| **10** | **(3 pts, proof-style)** Show that the attention output for _any_ query vector is a **convex combination** of the value rows.                        | Each soft-max row produces non-negative weights that sum to 1; multiplying by $V$ forms $\sum_i \alpha_i v_i$ with $\alpha_i\ge0,\sum_i\alpha_i=1$.                                                                                     |

---

### Worked Example – Scaled Dot-Product Attention with Actual Numbers

We will use very small matrices so every arithmetic step is clear.

| Symbol        | Matrix (row × col) | Values                                                |
| ------------- | ------------------ | ----------------------------------------------------- |
| $Q$ (queries) | $2\times2$         | $\begin{bmatrix}1&0\\[2pt]0&1\end{bmatrix}$           |
| $K$ (keys)    | $3\times2$         | $\begin{bmatrix}1&0\\[2pt]0&1\\[2pt]1&1\end{bmatrix}$ |
| $V$ (values)  | $3\times2$         | $\begin{bmatrix}1&0\\[2pt]0&2\\[2pt]3&1\end{bmatrix}$ |
| Key/Query dim | $d_k = 2$          | (so $\sqrt{d_k}= \sqrt{2}\approx1.4142$)              |

---

#### 1 Raw dot-product scores

$$
S = QK^{\!\top}=
\begin{bmatrix}
1&0\\[2pt]0&1
\end{bmatrix}
\!\!
\begin{bmatrix}
1&0&1\\[2pt]0&1&1
\end{bmatrix}
 \;=\;
\begin{bmatrix}
1&0&1\\[2pt]0&1&1
\end{bmatrix}
$$

#### 2 Scale by $\sqrt{d_k}$

$$
\tilde S = \frac{S}{\sqrt{2}} \;=\;
\begin{bmatrix}
0.7071&0&0.7071\\[2pt]0&0.7071&0.7071
\end{bmatrix}
$$

#### 3 Row-wise soft-max

Compute $\alpha_{ij} = \exp(\tilde S_{ij}) / \sum_k \exp(\tilde S_{ik})$.

_Row 0_

$$
\exp\tilde S = (2.028,\;1,\;2.028),\quad
\text{sum}=5.056\;\Longrightarrow\;
\boldsymbol\alpha_0 = (0.401,\;0.198,\;0.401)
$$

_Row 1_

$$
\exp\tilde S = (1,\;2.028,\;2.028),\quad
\text{sum}=5.056\;\Longrightarrow\;
\boldsymbol\alpha_1 = (0.198,\;0.401,\;0.401)
$$

(Each row is a valid probability distribution—non-negative and sums to 1.)

#### 4 Weighted sum of value rows

$$
\text{Output} = \alpha V
$$

_Row 0_

$$
0.401{\small\cdot}(1,0)+0.198{\small\cdot}(0,2)+0.401{\small\cdot}(3,1)
    = (1.604,\;0.797)
$$

_Row 1_

$$
0.198{\small\cdot}(1,0)+0.401{\small\cdot}(0,2)+0.401{\small\cdot}(3,1)
    = (1.401,\;1.203)
$$

---

### Final attention outputs

$$
\boxed{
\begin{bmatrix}
1.604 & 0.797\\[4pt]
1.401 & 1.203
\end{bmatrix}}
$$

You can now see **every stage** of scaled dot-product attention:

1. **Similarity** via $QK^{\top}$
2. **Scaling** by $\sqrt{d_k}$
3. **Soft-max** to obtain attention weights
4. **Mixing** the value vectors into the final representations.

### Tips for Using This Question Bank

- **Memorize Q1/Q2** – they appear almost verbatim in past exams.
- **Parameter counts (Q6–Q7)** are a favourite “quick calculation” item.
- **Conceptual contrasts (Q4, Q5, Q8, Q9)** often fill the 2-point slots in Part I.
- Practice deriving the convex-combination argument (Q10); it demonstrates deep understanding and is easy marks if asked.
