---
title: "2 KV-Cache Mechanism & Autoregressive Inference"
date: "2025-08-04 00:00:10"
excerpt: "Here is a concise summary of the KV-Cache Mechanism and its role in Autoregressive Inference."
---

## KV-Cache Mechanism & Autoregressive Inference — **Exam-Ready Cheat-Sheet**

---

### 1 Big Picture

| Concept                     | What happens                                                                                 | Cost without cache                                                                               | Cost **with** cache                                                         |
| --------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **Autoregressive decoding** | Generate token $y_t$ using previously produced tokens $y_{<t}$.                              | Each step recomputes attention over the _entire_ prefix.                                         | Re-use stored keys & values; only compute attention for _new_ query.        |
| **KV-cache**                | Maintain running matrices $K_{\text{cache}},V_{\text{cache}}$. Append $(k_t,v_t)$ each step. | **Time**: $\sum_{i=1}^{T} i = \mathcal{O}(T^{2})$<br>**Memory**: $\mathcal{O}(T)$ for every step | **Time**: $\mathcal{O}(T)$ total<br>**Memory**: still $\mathcal{O}(T)$ once |

---

### 2 Step-by-Step Formulas

1. **No cache (naïve)** – at decoding step $n$:

$$
\boxed{z_n = \operatorname{softmax}\!\Bigl(\tfrac{q_n K_{1:n}^{\!\top}}{\sqrt{d_k}}\Bigr)V_{1:n}} \tag{1}
$$

The whole prefix $K_{1:n},V_{1:n}$ is recomputed every time.&#x20;

2. **With KV-cache**

_Keep_ $K_{\text{cache}}^{(n)} = K_{1:n},\; V_{\text{cache}}^{(n)} = V_{1:n}$.
Next step $n{+}1$:

$$
\begin{aligned}
K_{\text{cache}}^{(n+1)} &= \bigl[K_{\text{cache}}^{(n)} \,\|\, k_{n+1}\bigr] \\
V_{\text{cache}}^{(n+1)} &= \bigl[V_{\text{cache}}^{(n)} \,\|\, v_{n+1}\bigr] \\
z_{n+1} &= \operatorname{softmax}\!\Bigl(\tfrac{q_{n+1}\,(K_{\text{cache}}^{(n+1)})^{\!\top}}{\sqrt{d_k}}\Bigr)V_{\text{cache}}^{(n+1)}
\end{aligned} \tag{2}
$$

Only the _new_ dot-products $q_{n+1}\cdot k_i$ are evaluated; all earlier ones stay cached.&#x20;

---

### 3 Why the Cache Speeds Things Up

- **Redundant work removed**: without caching, every past dot-product $\langle q_i,k_j\rangle$ is recalculated up to $T{-}i$ times; with caching it is computed **once**.
- **Complexity drop**: from quadratic $\mathcal{O}(T^2 d_k)$ to linear $\mathcal{O}(T d_k)$ for a whole sequence.
- **Latency**: per-token latency shrinks from $\Theta(t)$ to $\Theta(1)$ (except the final matrix–vector multiply of size $t$).

---

### 4 Typical Exam Prompts & Lightning Answers

| Question                                                            | Key points to hit                                                                                                                            |
| ------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| _“Explain the purpose of the KV-cache and how it speeds decoding.”_ | Stores all past $K,V$; new step reuses them, so dot-products for earlier tokens are not recomputed → linear instead of quadratic time.       |
| _“Describe redundant computations if no cache is used.”_            | At step $t$ the model recomputes $K_{1:t},V_{1:t}$ and every dot-product $q_t\cdot k_i$ even though $(k_i,v_i)$ are unchanged from step $i$. |
| _“Give the formula for output with a cache.”_                       | Quote Eq. (2) above; mention concatenation update.                                                                                           |
| _“What is cached during beam search?”_                              | Same $K,V$ tensors per beam; cache is beam-specific but reused across candidates.                                                            |

---

### 5 Quick Mnemonics

- **“Save *K*eys & *V*alues, spend *Q*uick”** – queries are cheap, keys/values are reused.
- **Quadratic-to-Linear** – remember the cost improvement figure.

Nail these concepts and you’ll cruise through any KV-cache question!

## exam questions

Below is a **mini mock-exam section** focused _only_ on the topic **“KV-Cache Mechanism & Autoregressive Inference.”**
I mirrored the tone, precision-level, and point values of the F24 sample so you can practise in the same style.

| Q#        | Type                        | Points |
| --------- | --------------------------- | ------ |
| 1 a–c     | Knowledge (short answer)    | 12     |
| 2 a–b     | Derivation                  | 12     |
| 3         | Implementation / pseudocode | 6      |
| 4         | Quantitative design         | 10     |
| 5         | Discussion                  | 10     |
| **Total** |                             | **50** |

---

### **Question 1 — Core Concepts** _(12 pts total)_

**(a) (4 pts)** State the precise purpose of a **KV-cache** during Transformer decoding and explain, in one sentence, why it reduces _per-token_ latency from Θ(t) to Θ(1).

**(b) (4 pts)** Identify the _two_ tensors that must still be **freshly computed** at every decoding step even when a full KV-cache is used.

**(c) (4 pts)** For a causal decoder with sequence length _T_ and model dimension _d_model_, give the _total_ time complexity of generating the entire sequence **with** and **without** a KV-cache. Express both answers in big-O notation.

---

### **Question 2 — Derivation of Redundant Work** _(12 pts total)_

We decode a length-_T_ sequence **without** caching.

**(a) (6 pts)** Show that the total number of dot-product similarity operations
$\displaystyle S_{\text{naïve}} = \sum_{t=1}^{T} t = \frac{T(T+1)}{2}$.

**(b) (6 pts)** Using part (a), derive the _ratio_ of similarity operations between the naïve approach and KV-cached decoding, simplifying to an expression in _T_. State the limit of this ratio as $T\to\infty$.

---

### **Question 3 — Cache-Update Pseudocode** _(6 pts)_

Write concise pseudocode (≤ 6 lines) that updates _one_ attention head’s **K** and **V** caches at step _t_ and then computes the step output $z_t$. Assume:

- Inputs: `q_t, k_t, v_t` (shape = \[1 × d_k] or \[1 × d_v])
- Mutable lists/tensors `K_cache`, `V_cache` (initially empty)
- Function `softmax_row(x)` applies soft-max across the key dimension.

---

### **Question 4 — Memory Budgeting** _(10 pts)_

You deploy a GPT-style model with

- model dimension $d_{\text{model}}=4096$,
- $h=32$ heads, so $d_k=d_v=d_{\text{model}}/h$,
- maximum generation length $T_{\max}=2048$.

**(a) (6 pts)** Compute, in _bytes_, the memory required to hold the **KV-cache for a single layer** if keys and values are stored as FP16. Show all steps.

**(b) (4 pts)** Briefly explain two practical engineering tricks—other than lowering precision below FP16—that further reduce KV-cache memory.

---

### **Question 5 — Beam Search & Cache Management** _(10 pts total)_

During beam search with beam width _B_, each hypothesis maintains its own log-probability and KV-cache state.

**(a) (6 pts)** Describe how caches are _forked_ and _pruned_ after each step when the beam expands and then contracts back to size _B_. Use one or two sentences.

**(b) (4 pts)** Argue why a _shared_ cache cannot be used across beams without compromising correctness.

---

## **Answer Key / Rubric**

### Question 1

**(a)** The KV-cache stores _all_ past key and value tensors; when decoding token _t_, the model re-computes only the new query $q_t$ and its dot-products against cached keys, so work is constant w\.r.t. _t_ → latency Θ(1).

**(b)** The new **query vector** $q_t$ and the attention-weighted **output** $z_t$ (matrix–vector multiply with present values) are always re-computed; cached $K,V$ are reused.

**(c)**

- Naïve: $\mathcal{O}(T^2 d_k)$ (quadratic).
- Cached: $\mathcal{O}(T d_k)$ (linear).

---

### Question 2

**(a)** Each step _t_ attends to _t_ prefix tokens: $S_{\text{naïve}}=\sum_{t=1}^{T} t = T(T+1)/2$.

**(b)** Cached decoding performs exactly _T_ dot-products (one per new token): $S_{\text{cache}}=T$.
Ratio $R(T)=S_{\text{naïve}}/S_{\text{cache}} = (T+1)/2 \xrightarrow[T\to\infty]{} \tfrac{T}{2}$.
Thus, naïve decoding is Θ(T) times more expensive asymptotically.

---

### Question 3 (one possible answer)

```
# append new key / value
K_cache.append(k_t)          # shape: [t × d_k] after append
V_cache.append(v_t)          # shape: [t × d_v]

# stack for matmul
K_mat = stack_rows(K_cache)  # [t × d_k]
V_mat = stack_rows(V_cache)  # [t × d_v]

scores = (q_t @ K_mat.T) / sqrt(d_k)   # [1 × t]
w      = softmax_row(scores)           # attention weights
z_t    = w @ V_mat                     # [1 × d_v]
```

---

### Question 4

**(a)**
$d_k = d_v = 4096 / 32 = 128$.
Per token per head stores $k$+$v$: $128+128 = 256$ FP16 numbers → $256 × 2 \text{bytes} = 512 \text{B}$.
Total for one layer: $512 \text{B} × h × T_{\max} = 512 \text{B} × 32 × 2048 ≈ 33.55 MB$.

**(b)**

1. **Group-wise quantization** (e.g., 8-bit or 4-bit per 128-vector).
2. **Dynamic cache-length pruning** (drop earliest tokens once they fall outside a sliding context window).

---

### Question 5

**(a)** After scoring expansions, copy each surviving hypothesis’s KV-cache into the next-step beam; discard caches belonging to pruned hypotheses to keep the beam at size _B_.

**(b)** Each beam path diverges in token history; sharing would mix incompatible keys/values, yielding incorrect attention distributions and invalid log-probabilities.
