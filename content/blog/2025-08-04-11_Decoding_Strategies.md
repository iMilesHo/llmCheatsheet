---
title: "11 Decoding Strategies"
date: "2025-08-04 00:00:01"
excerpt: "Here is a concise summary of Decoding Strategies."
---

## Decoding Strategies — **Greedy vs Top-K vs Top-P (Nucleus) Sampling**

---

### 1 Quick-Look Comparison

| Strategy            | How it selects the next token                                                                                                      | Determinism / Diversity                                     | When it shines                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------- |
| **Greedy**          | $y_t=\displaystyle\arg\max_{w\in V}P(w\mid x,y_{<t})$                                                                              | Fully deterministic, often repetitive                       | Scoring tasks, beam-search warm-start, cheap generation |
| **Top-K**           | Keep the $K$ highest-probability tokens, renormalize, sample: $\tilde P(w)=\tfrac{P(w)}{\sum_{v\in V_K}P(v)}$ if $w\in V_K$ else 0 | Tunable variety; higher $K\Rightarrow$ more diversity       | Story/dialogue generation where exploration is OK       |
| **Top-P (Nucleus)** | Choose the _smallest_ set $V_p\subseteq V$ s.t. $\sum_{v\in V_p}P(v)\ge p$; renormalize and sample                                 | Adapts set size to uncertainty; balances quality & surprise | Long-form text; avoids rare‐token noise in flat tails   |

_Slides HW3 explicitly ask you to run all three (Greedy, $K=20$, $p=0.9$) for summary ROUGE-L comparison_&#x20;

---

### 2 Formal Definitions & Pseudocode Snippets

1. **Greedy Decoding**

```python
y = []
for t in range(max_len):
    probs = LM(x, y)           # P(·|x,y< t)
    y_t  = argmax(probs)       # pick best
    y.append(y_t)
```

Mathematically:

$$
y_t=\underset{w}{\operatorname{argmax}}\;P(w\mid x,y_{<t})\;.\tag{1}
$$

Greedy is simply the token-wise “$\arg\max$” step mentioned in Lecture 11 .

2. **Top-K Sampling**

```python
V_k   = probs.topk(K).indices
probs = probs[V_k] / probs[V_k].sum()
y_t   = choice(V_k, p=probs)
```

Renormalized distribution:

$$
\tilde P(w)=
  \begin{cases}
    \dfrac{P(w)}{\sum_{v\in V_K}P(v)}, & w\in V_K\\[4pt]
    0,&\text{otherwise.}
  \end{cases}\tag{2}
$$

3. **Top-P / Nucleus Sampling**

```python
sorted_probs = sort_desc(probs)
cumsum       = sorted_probs.cumsum()
V_p          = {w : cumsum[w] \le p}
probs        = probs[V_p] / probs[V_p].sum()
y_t          = choice(V_p, p=probs)
```

Key property: $|V_p|$ varies with distribution entropy—small when one option dominates, large when uncertainty is high.

---

### 3 Cheat-Sheet Nuggets for the Exam

- **Determinism vs Stochasticity** – Greedy is deterministic; Top-K/Top-P introduce randomness yet remain guided by high-probability region.
- **Parameter Sensitivity**

  - Greedy has _no_ hyper-parameter.
  - Typical $K\in[20,50]$. Larger $K$ ≈ more adventurous, but may drift off topic.
  - Common $p\in[0.8,0.95]$. Lower $p$ ≈ safer, higher $p$ ≈ freer.

- **Edge Cases**

  - If $K=1$ or $p\le\max_{w}P(w)$, both strategies collapse to greedy.
  - In low-entropy steps Top-P often selects only 1–2 tokens anyway → efficiency.

- **Pitfalls**

  - Greedy: repetition loops (e.g., “The cat is the cat is …”)
  - Top-K: truncates tail indiscriminately; rare but contextually perfect words may vanish.
  - Top-P: requires sorting the whole vocabulary each step (slower than Top-K on GPUs).

---

### 4 Typical Exam Prompts & Micro-Answers

| Prompt                                                            | Bullet-proof response                                                                                                       |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| “Compare Greedy, Top-K and Top-P.”                                | Discuss selection rule, tunable parameters ($K$/$p$), deterministic vs stochastic, trade-off between quality and diversity. |
| “Given this distribution, which tokens could each strategy pick?” | Show: Greedy → single highest; Top-K → any of top $K$; Top-P → tokens until cumulative ≥ $p$.                               |
| “Why might Top-P avoid the ‘cut-off’ problem of Top-K?”           | Because the nucleus size adapts to distribution shape instead of a fixed $K$.                                               |

---

### 5 Exam-Day Mnemonics

- **“Greedy = Grab the Greatest”** – always the max.
- **“K = Keep K”** – fixed bucket size.
- **“P = Prob-mass ≥ P”** – bucket grows until enough probability.

---

## Exam Sample Questions

Part X – Decoding Strategies (Greedy, Top-K, Top-P)

### **Q1 \[6 pts] Formal definitions**

For each strategy, write the mathematical rule that maps the predictive distribution
$P(\,w\mid x,y_{<t})$ over the vocabulary $V$ to the next token $y_t$.
Briefly state whether the rule is deterministic or stochastic.

**Answer**

| Strategy | Selection rule                                                                                                                                                                             | Deterministic?           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| Greedy   | $y_t=\displaystyle\arg\max_{w\in V}P(w\mid x,y_{<t})$                                                                                                                                      | Yes                      |
| Top-K    | Let $V_K$ be the $K$ tokens with highest probability. Sample $y_t\sim\widetilde P_K$ where $\widetilde P_K(w)=\frac{P(w)}{\sum_{v\in V_K}P(v)}$ if $w\in V_K$ else $0$.                    | No (random within $V_K$) |
| Top-P    | Sort tokens by $P$ descending; let $V_p=\{w_1,\dots,w_m\}$ be the smallest prefix s.t. $\sum_{i=1}^{m}P(w_i)\ge p$. Sample $y_t\sim\widetilde P_p$ with the same renormalization as above. | No (random within $V_p$) |

---

### **Q2 \[8 pts] Worked example**

The model produces the following probabilities for the next token
($V=\{\texttt{A},\texttt{B},\texttt{C},\texttt{D},\texttt{E}\}$):

| Token | A    | B    | C    | D    | E    |
| ----- | ---- | ---- | ---- | ---- | ---- |
| $P$   | 0.42 | 0.28 | 0.11 | 0.10 | 0.09 |

1. (a) Which token does **Greedy** return?
2. (b) Taking $K=2$, list the sampling set $V_K$ for **Top-K**.
3. (c) Taking $p=0.8$, list the sampling set $V_p$ for **Top-P**.
4. (d) Compute the renormalized probability of token **B** inside the Top-P nucleus.

**Answer**

1. (a) Greedy chooses **A** (highest probability 0.42).
2. (b) $V_{K=2}=\{\texttt{A},\texttt{B}\}$.
3. (c) Cumulative probabilities in descending order:

   - A (0.42) → 0.42
   - B (0.28) → 0.70
   - C (0.11) → 0.81 ≥ 0.80 → stop.
     So $V_{p=0.8}=\{\texttt{A},\texttt{B},\texttt{C}\}$.

4. (d) Renormalize over the nucleus: $Z = 0.42+0.28+0.11 = 0.81$.
   $\widetilde P_p(\texttt{B}) = \dfrac{0.28}{0.81}\approx 0.3469$.

---

### **Q3 \[4 pts] Proof mini-exercise**

Show that **Top-P sampling collapses to Greedy decoding** when
$p\le\max_{w\in V}P(w\mid x,y_{<t})$.

**Answer**

Let $w^{\star}=\arg\max_{w\in V}P(w)$ with probability $P^\star$.
If $p\le P^\star$, the cumulative mass already meets the threshold after including only $w^{\star}$; hence $V_p=\{w^{\star}\}$.
Renormalization yields $\widetilde P_p(w^{\star})=1$.
Sampling from a singleton set is deterministic and returns $w^{\star}$, identical to Greedy.

---

### **Q4 \[5 pts] Algorithmic complexity**

1. (a) State the time complexity (in $|V|$) of computing one decoding step for Greedy, Top-K, and Top-P when probabilities are unsorted.
2. (b) Explain why Top-P can be slower than Top-K even when $K$ is large.

**Answer**

1. (a)

   - Greedy: $\mathcal{O}(|V|)$ for a single pass to find the max.
   - Top-K: $\mathcal{O}(|V| + K\log K)$ using a max-heap or selection algorithm (linear expected).
   - Top-P: $\mathcal{O}(|V|\log|V|)$ to sort the entire vocabulary (needed to form the cumulative mass).

2. (b) Top-P requires a _full_ sort each step because the cut-off index is data-dependent, whereas Top-K only needs to maintain the top $K$ elements—no global ordering—so Top-P incurs an extra $\log|V|$ factor.

---

### **Q5 \[2 pts] Practical selection**

Give one concrete application where you would favour **Top-K** over **Top-P**, and justify in one sentence.

**Answer**

_Interactive dialogue agents (e.g., chat-bots)_ often use Top-K with $K\approx 40$: it guarantees a fixed-size candidate set that prevents “run-away” inclusion of very low-probability tokens, simplifying latency budgeting while still adding diversity.
