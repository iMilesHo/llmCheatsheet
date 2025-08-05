---
title: "3 Modular Transformer Layer & FFN"
date: "2025-08-04 00:00:09"
excerpt: "Here is a concise summary of the Modular Transformer Layer and FFN (with **SwiGLU**)."
---

## Modular Transformer Layer & Feed-Forward Network (with **SwiGLU**) — **Exam-Ready Cheat-Sheet**

---

### 1 Layer Skeleton

| Block                           | Mathematical form                                                    | “Why” you need to remember it                                                                                            |
| ------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Residual-Norm wrapper**       | $\text{LN}\bigl(X + \text{SubLayer}(X)\bigr)$                        | Every Transformer sublayer (MHA **and** FFN) is wrapped this way; forgetting the residual + LayerNorm loses full credit. |
| **Position-wise FFN**           | Two-layer MLP applied to **each token** independently                | Examiner loves “write the FFN formula & explain the 4× factor”.                                                          |
| **Activation upgrade (SwiGLU)** | Replaces ReLU for higher expressiveness in modern LLMs (e.g., LLaMA) | Must state its gated-Swish formula and contrast with ReLU.                                                               |

---

### 2 Standard Feed-Forward Network (FFN)

1. **Formula**

$$
\boxed{\text{FFN}(x)=W_2\,\sigma\!\bigl(W_1 x + b_1\bigr)+b_2}
$$

_Here $\sigma=\text{ReLU}$ in the vanilla Transformer._

- Shapes: $W_1\in\mathbb{R}^{d_{\text{model}}\times 4d_{\text{model}}},\; W_2\in\mathbb{R}^{4d_{\text{model}}\times d_{\text{model}}}$&#x20;

2. **Why hidden size = 4 × $d_{\text{model}}$?**
   _Expands the representation, giving the layer capacity to model diverse features; projecting back to $d_{\text{model}}$ keeps the interface size constant while adding only $\mathcal{O}(d_{\text{model}}^2)$ parameters.\_

3. **Per-token nature** — no cross-token mixing; all sequence interaction happens in the attention sublayer.

---

### 3 SwiGLU Feed-Forward Variant

1. **Activation components**

   - **Swish**: $\text{Swish}(u)=u\cdot\sigma(u)$ (smooth, non-monotonic).
   - **Gated Linear Unit (GLU)**: element-wise product of two linear projections.

2. **SwiGLU formula (from slides)**

$$
\boxed{\text{SwiGLU}(x)=\bigl[\text{Swish}(xW_1+b_1)\bigr]\;\odot\;\bigl(xV+c\bigr)}
$$

and the full MLP:

$$
\text{FFN}_{\text{SwiGLU}}(x)=W_2\,\text{SwiGLU}(x)+b_2
$$

_Parameters $W_1,V\in\mathbb{R}^{d_{\text{model}}\times 4d*{\text{model}}/2}$ (because the gate splits the hidden dim in half).*&#x20;

3. **How it differs from ReLU FFN**

| Aspect         | ReLU FFN                      | SwiGLU FFN                                                              |
| -------------- | ----------------------------- | ----------------------------------------------------------------------- |
| Non-linearity  | Piece-wise linear, zero-gated | Smooth (Swish) + learned gate                                           |
| Hidden width   | 4 × $d$                       | 4 × $d$ total but split into two 2 × $d$ tensors                        |
| Expressiveness | Good                          | Better: multiplicative gating captures interactions that addition can’t |
| Gradient flow  | Can die (ReLU zeros)          | Swish keeps small gradients alive                                       |

---

### 4 Whole Transformer Layer Recap

$$
\begin{aligned}
Z &= \text{LN}\!\bigl(X + \text{MHA}(X)\bigr) \\
Y &= \text{LN}\!\bigl(Z + \text{FFN}(Z)\bigr)
\end{aligned}
$$

Choose **FFN = ReLU-MLP** (original) _or_ **FFN = SwiGLU-MLP** (LLaMA/GPT-NeoX, etc.).

---

### 5 Fast-Answer Table for Typical Exam Prompts

| Prompt                                                              | Bulletproof answer                                                                        |
| ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| _“Write the feed-forward layer formula and explain 4× hidden dim.”_ | Give boxed ReLU-MLP above; add “4× provides extra capacity while keeping IO size fixed.”  |
| _“State the SwiGLU activation and its benefit.”_                    | Quote boxed SwiGLU; say “smooth Swish + gating ⇒ richer functions, better gradient flow.” |
| _“Describe residual + LayerNorm pattern.”_                          | “Output = LayerNorm(input + sublayer(input)); ensures stable depth-scaling.”              |

---

**Mnemonic:** _“**Re**-sidual **N**orm, **Re**-size (×4), then **Ga**te (Swi)\*\*.”_ Nail these points and the modular layer questions are free marks!

## Sample Exam-Style Questions & Answers

**Topic — Modular Transformer Layer & Position-wise Feed-Forward Network (incl. SwiGLU)**

---

#### **Q1. (4 pts)**

Write the mathematical expression for the _position-wise feed-forward network_ (FFN) used in the original Transformer, and state the shapes of the two weight matrices when the model dimension is $d_{\text{model}}$.

**Answer**

$$
\boxed{\text{FFN}(x)=W_2\,\operatorname{ReLU}\!\bigl(xW_1+b_1\bigr)+b_2}
$$

- $W_1\in\mathbb{R}^{d_{\text{model}}\times 4d_{\text{model}}}$
- $W_2\in\mathbb{R}^{4d_{\text{model}}\times d_{\text{model}}}$
- $b_1\in\mathbb{R}^{4d_{\text{model}}},\; b_2\in\mathbb{R}^{d_{\text{model}}}$&#x20;

---

#### **Q2. (4 pts)**

Explain **why** the hidden dimension in the FFN is typically set to $4\times d_{\text{model}}$. Give two reasons grounded in model capacity and parameter efficiency.

**Answer**

1. **Expressive power:** Expanding to $4d_{\text{model}}$ allows the non-linear layer to learn a much richer set of feature interactions before projecting back, which empirically improves accuracy on language tasks.
2. **Cost balance:** The extra parameters scale only with $\mathcal{O}(d_{\text{model}}^2)$, the same order as the attention projections, so the increase in memory/compute is modest relative to the gain in capacity. (Smaller expansion ratios often underfit; much larger ones dominate run-time.)

---

#### **Q3. (6 pts)**

(a) Give the formula for the **SwiGLU** activation and the full SwiGLU-based FFN used in models like LLaMA.
(b) List two advantages of SwiGLU over the standard ReLU FFN.

**Answer**

**(a) Formula**

$$
\begin{aligned}
\text{SwiGLU}(x) &\,=\,\bigl(\underbrace{xW_1+b_1}_{\text{gate}}\bigr)\;\odot\;
           \underbrace{\text{Swish}\!\bigl(xV+c\bigr)}_{\text{activation}},\\[4pt]
\text{FFN}_{\text{SwiGLU}}(x) &\,=\,W_2\,\text{SwiGLU}(x)+b_2.
\end{aligned}
$$

Swish$(u)=u\cdot\sigma(u)$; “$\odot$” is element-wise product. Learned parameters: $W_1,V\in\mathbb{R}^{d_{\text{model}}\times 2d_{\text{model}}}$ (together giving the same 4× width), $b_1,c\in\mathbb{R}^{2d_{\text{model}}}$, $W_2\in\mathbb{R}^{4d_{\text{model}}\times d_{\text{model}}}$, $b_2\in\mathbb{R}^{d_{\text{model}}}$.&#x20;

**(b) Advantages**

1. **Gated multiplicative interaction** captures feature combinations that a single ReLU cannot, improving perplexity and downstream task scores.
2. **Smooth gradients** from Swish avoid ReLU’s “dead neuron” problem, leading to better optimization, especially in very deep stacks.

---

#### **Q4. (3 pts)**

Describe the order of operations in a _Pre-LayerNorm_ Transformer block. Why is the residual connection essential?

**Answer**

For an input $x$:

1. $z = x + \text{MHA}(x)$
2. $z_{\text{norm}} = \text{LayerNorm}(z)$
3. $y = z_{\text{norm}} + \text{FFN}(z_{\text{norm}})$
4. Output $= \text{LayerNorm}(y)$

Residuals preserve gradient flow across many layers and allow each sub-module to learn a _delta_ from its input, stabilising deep training.

---

#### **Q5. (3 pts)**

Assume $d_{\text{model}} = 1024$. Compute the total number of learned parameters in:

- (i) a ReLU-based FFN,
- (ii) a SwiGLU-based FFN (gate + activation share the 4× width).

_(Ignore biases for simplicity.)_

**Answer**

_ReLU FFN_

$$
\#\text{params} = d_{\text{model}}\!\times\!4d_{\text{model}} + 4d_{\text{model}}\!\times\!d_{\text{model}}
                = 2\,(4d_{\text{model}}^2)
                = 8d_{\text{model}}^2
                = 8(1024)^2 \approx 8.39\times10^6.
$$

_SwiGLU FFN_
First linear pair $W_1$ **and** $V$ each map to $2d_{\text{model}}$ (since the 4× width is split):

$$
2\bigl(d_{\text{model}}\!\times\!2d_{\text{model}}\bigr) + 4d_{\text{model}}\!\times\!d_{\text{model}}
= 4d_{\text{model}}^2 + 4d_{\text{model}}^2
= 8d_{\text{model}}^2
= 8.39\times10^6.
$$

Thus both designs have the same parameter count given the conventional 4× expansion; SwiGLU reallocates half of the hidden units to the gating pathway.

---

**End of sample section** — mastering these questions should cover every likely angle the final exam can probe on Transformer FFN mechanics and SwiGLU.
