---
title: "6 Generative Objective Function (Log-Likelihood Maximization)"
date: "2025-08-04 00:00:06"
excerpt: "Here is a concise summary of the Generative Objective Function and its role in training generative models."
---

## Generative Objective Function (Log-Likelihood Maximization) — **Exam-Ready Cheat-Sheet**

---

### 1 Key Ideas at a Glance

| Concept                           | Essence                                                                                           | Why it matters on the exam                                                        |                                                                               |
| --------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| **Negative Log-Likelihood (NLL)** | Minimise -log p(next token                                                                        | context) over every position. Equivalent to maximising the corpus log-likelihood. | You must **write the full loss** and relate it to cross-entropy & perplexity. |
| **Chain-Rule Factorisation**      | $p(x_{1{:}m})=\prod_{j=1}^{m}p(x_j\mid x_{1{:}j-1})$.                                             | Justifies autoregressive training & sampling.                                     |                                                                               |
| **Cross-Entropy Form**            | NLL is the cross-entropy between the one-hot target and the model’s softmax output.               | Often appears as “show NLL = CE”.                                                 |                                                                               |
| **Perplexity (PPL)**              | $\text{PPL}=e^{\frac{1}{m}\;\text{NLL}}$.                                                         | Typical short calculation question.                                               |                                                                               |
| **Teacher Forcing**               | During training, the ground-truth prefix is fed in; at inference, prefixes are model predictions. | Explain exposure bias / KV-cache questions.                                       |                                                                               |

---

### 2 Objective Function — Canonical Formulas

1. **Token-level factorisation**

$$
p(x_{1{:}m};\Theta)=\prod_{j=1}^{m}p_\Theta\!\bigl(x_j \mid x_{1{:}j-1}\bigr).
$$

2. **Negative log-likelihood loss**

$$
\mathcal{L}_{\text{NLL}}(\Theta)=
-\sum_{j=1}^{m}\log p_\Theta\!\bigl(x_j \mid x_{1{:}j-1}\bigr).\quad
\text{(minimise w.r.t. }\Theta\text{)}\;:contentReference[oaicite:2]{index=2}
$$

3. **Cross-entropy view**

Given a one-hot vector $y_j$ and predicted probabilities $\hat y_j$:

$$
\mathcal{L}_{\text{CE}}=-\langle y_j,\;\log \hat y_j\rangle,
$$

and summing over $j$ recovers $\mathcal{L}_{\text{NLL}}$.

4. **Per-token average & perplexity**

$$
\overline{\mathcal{L}}_{\text{NLL}}=\frac{1}{m}\mathcal{L}_{\text{NLL}},\qquad
\text{PPL}=e^{\;\overline{\mathcal{L}}_{\text{NLL}}}.
$$

---

### 3 Why Does Maximising Log-Likelihood Yield Fluent Text?

- **Probability mass alignment.** By pushing probability onto real-world token sequences, the model’s sampling distribution mimics the training distribution, producing grammatical and semantically plausible continuations.
- **Smooth gradients.** Log transforms turn products into sums, avoiding underflow and giving additive gradients that are easy to optimise.
- **Information-theoretic optimality.** Maximum-likelihood minimises KL-divergence between the data distribution and the model, the gold standard for making generated text statistically “indistinguishable” from data.

---

### 4 Common Exam Prompts & Quick Answers

| Prompt                                   | Checklist for full marks                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| _Write the NLL loss_                     | Provide formula in §2.2 with chain-rule context.                                                           |
| _Link NLL and cross-entropy_             | Show one-hot target → CE equals NLL (§2.3).                                                                |
| _Compute perplexity_                     | PPL = exp(NLL / #tokens).                                                                                  |
| _Why use log instead of raw likelihood?_ | Numerical stability + sum of logs gives additive gradients.                                                |
| _Explain exposure bias_                  | Training uses teacher forcing; inference doesn’t → errors accumulate. Mention scheduled sampling as a fix. |

---

### 5 Memory Nuggets

- **“Product → Sum → Mean → Exp”** — multiply probs, take logs, average, exponentiate → perplexity.
- **“CE = NLL when labels are one-hot.”**
- **Fluency mantra:** _Max log-likelihood ⇒ Min KL ⇒ Data-like sentences._

Master these formulas and rationales—you’ll breeze through any question on generative objectives!

## Exam Sample Questions

### Exam-Style Questions & Answers

**Topic — Generative Objective Function (Log-Likelihood Maximization)**

| #     | Possible Question (points)                                                                                                                                                  | Model Answer / Marking Scheme                                                                                                                                                                                                                                                                                                                                |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **1** | _(2 pts)_ _Write the negative-log-likelihood (NLL) loss used to train an autoregressive language model._                                                                    | Using the chain rule, the likelihood of a sequence $x_{1{:}m}$ is $\displaystyle p_\Theta(x_{1{:}m})=\prod_{j=1}^{m} p_\Theta\bigl(x_j\mid x_{1{:}j-1}\bigr)$. The NLL to **minimize** is $\displaystyle \mathcal{L}_{\text{NLL}}(\Theta)= -\sum_{j=1}^{m}\log p_\Theta\bigl(x_j\mid x_{1{:}j-1}\bigr).$                                                     |
| **2** | _(2 pts)_ _Show that minimizing NLL is equivalent to minimizing cross-entropy between the empirical one-hot distribution $Y$ and the model’s softmax predictions $\hat Y$._ | For each position $j$, the one-hot vector $y_j$ selects the true token. Cross-entropy: $\mathcal{L}_{\text{CE}}=-\!\sum_j \langle y_j,\log \hat y_j\rangle.$ Because only the correct class has $y_{j,k}=1$, this reduces to $-\sum_j\log p_\Theta(x_j\mid x_{1{:}j-1})=\mathcal{L}_{\text{NLL}}$. Hence the two objectives are identical.                   |
| **3** | _(2 pts)_ _Define perplexity (PPL) and relate it to average NLL._                                                                                                           | Per-token average loss: $\bar{\ell}=\frac{1}{m}\mathcal{L}_{\text{NLL}}$. Perplexity is $ \text{PPL}=e^{\bar{\ell}}$. Lower PPL ⇒ higher average probability assigned to each true token.                                                                                                                                                                    |
| **4** | _(2 pts)_ _Why does maximizing log-likelihood typically lead to fluent text generation?_                                                                                    | Maximum-likelihood training minimizes the KL-divergence $D_{\text{KL}}\bigl(p_{\text{data}}\parallel p_\Theta\bigr)$; this pushes the model distribution toward the real data distribution. When sampling, sequences with high probability under $p_\Theta$ mirror the statistical regularities (syntax, semantics) of the corpus, producing fluent outputs. |
| **5** | _(3 pts)_ _Given an average NLL of 2.1 nats on a validation set, compute the perplexity._                                                                                   | $ \text{PPL}=e^{2.1}\approx 8.17$. _(Full marks for correct numeric value; 1 pt for formula, 2 pts for calculation.)_                                                                                                                                                                                                                                        |
| **6** | _(3 pts)_ _Derive the gradient of the NLL with respect to the pre-softmax logits $z_j$._                                                                                    | Let $\hat y_j=\text{softmax}(z_j)$. For the true index $k^*$: $\displaystyle \frac{\partial \mathcal{L}_{\text{NLL}}}{\partial z_{j,k}} = \hat y_{j,k} - \mathbb{1}[k=k^*].$ Thus the gradient is the prediction minus the one-hot target—exactly as in cross-entropy.                                                                                       |

---

**How to use this table:** In past CS480/680 finals, short-answer knowledge questions are typically worth 2–3 points each (see sample F24 exam). The six items above cover every examinable facet of the generative objective—formula, links to cross-entropy & perplexity, intuition, and a small derivation—so drilling them should prepare you for any variant the instructor asks.
