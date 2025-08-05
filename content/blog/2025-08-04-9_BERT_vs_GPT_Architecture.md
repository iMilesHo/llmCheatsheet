---
title: "9 BERT vs GPT Architecture"
date: "2025-08-04 00:00:03"
excerpt: "Here is a concise summary of the BERT and GPT architectures."
---

## BERT vs GPT Architecture — **Exam-Ready Cheat-Sheet**

---

### 1 High-Level Comparison

| Aspect                     | **BERT**                                                             | **GPT**                                             |
| -------------------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| **Stack**                  | _Encoder-only_ (12–24 layers)                                        | _Decoder-only_                                      |
| **Directionality**         | _Bidirectional_ context                                              | _Left-to-right_ (causal)                            |
| **Pre-training Goal**      | Predict **masked** tokens (MLM) + **Next-Sentence Prediction** (NSP) | Predict **next** token (auto-regressive LM)         |
| **Generation**             | Cannot generate coherently (no causal head)                          | Natural text generation, supports KV-cache          |
| **Strengths**              | Sentence-level understanding, classification tasks                   | Open-ended generation, zero/few-shot generalisation |
| **Typical Size (classic)** | 110 M (BERT-BASE), 340 M (LARGE)                                     | 117 M (GPT-1) → 175 B + (GPT-3)                     |

---

### 2 Architectural Schematics

> **BERT:** Full transformer **encoder** stack; outputs contextual token embeddings.
> **GPT:** Removes encoder, keeps **decoder** with causal self-attention (future tokens masked). The two variants are sketched side-by-side in the slides.

---

### 3 Training Objectives — Explicit Formulas

| Loss                               | Definition                                                                                                                                      | Appears in                          |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| **Masked LM (BERT)**               | $\displaystyle\mathcal{L}_{\text{MLM}} = -\mathbb{E}_{x,M}\sum_{i\in M}\!\log p_\theta\bigl(x_i \mid x_{\setminus M}\bigr)$                     | Predict 15 % masked tokens          |
| **Next-Sentence Prediction (NSP)** | Binary cross-entropy over pair $(A,B)$:<br>$\mathcal{L}_{\text{NSP}} = -\![y\log p_\theta(\text{IsNext}) + (1-y)\log p_\theta(\text{NotNext})]$ | Determines sentence order coherence |
| **Auto-regressive LM (GPT)**       | $\displaystyle\mathcal{L}_{\text{LM}} = -\mathbb{E}_x\sum_{j=1}^m \log p_\theta(x_j \mid x_{<j})$ — exactly the objective shown in the slides   |                                     |

---

### 4 Why Each Model Excels

- **GPT for Generation:** Causal decoder predicts the future token distribution; decoding can stream autoregressively and reuse a KV-cache for linear time generation.
- **BERT for Classification:** Bidirectional attention sees full sentence context at once; fine-tuning simply adds a task head on the CLS embedding — ideal for sentiment, QA, NLI.
- **Exam angle:** emphasise _directionality_ (bi- vs uni-), _objective difficulty_ (predicting future > masking past), and _stack type_ (encoder vs decoder).

---

### 5 Flash-Answer Templates (exam short-answer)

| Question                                  | Key points to hit                                                                                                                 |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| “Two architectural/training differences?” | • Encoder vs decoder • Bidirectional vs causal • MLM+NSP vs next-token LM                                                         |
| “Why GPT better at generation?”           | Causal masking + autoregressive loss → coherent token continuation; BERT lacks causal head so can’t roll out sequence             |
| “Why BERT stronger on classification?”    | Sees both left & right context; CLS embedding tailored during fine-tuning; MLM pre-training aligns with token-level understanding |

---

### 6 Mnemonics

- **BERT = “B**idirectional **E**ncoder for **R**eading **T**asks”
- **GPT = “G**enerative **P**re-trained **T**ext-decoder”
- **Mask-then-Predict vs Next-Token-Predict** — remember “_mask the middle_” for BERT, “_guess the future_” for GPT.

---

## Exam sample questions

### Sample Exam Questions – _BERT vs GPT Architecture_

_(Each question is phrased exactly as it could appear on the CS 480/680 S 2025 final. Point values are suggestions.)_

| #             | Question                                                                                                                                                                                                                                                                                                                                                                         | Model Answer (key points that earn full credit)                                                                                                                                                                                                                                                                                                                                                                                                                  |     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --- |
| **1** (2 pts) | **State whether BERT and GPT use the Transformer encoder or decoder and describe the directionality of their self-attention.**                                                                                                                                                                                                                                                   | _BERT_ keeps only the **encoder** stack and applies **bidirectional** self-attention; _GPT_ keeps only the **decoder** stack and applies **unidirectional/causal** self-attention, masking future positions.                                                                                                                                                                                                                                                     |     |
| **2** (2 pts) | **Name the main pre-training objectives of BERT and GPT.**                                                                                                                                                                                                                                                                                                                       | _BERT_: (i) **Masked Language Modeling (MLM)**—predict randomly-masked tokens, and (ii) **Next-Sentence Prediction (NSP)**—binary classification of sentence order. _GPT_: **Autoregressive Language Modeling**—predict the next token given all previous tokens.                                                                                                                                                                                                |     |
| **3** (3 pts) | **Write the loss function minimized during BERT’s Masked Language Modeling.**                                                                                                                                                                                                                                                                                                    | see it under the table                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| **4** (3 pts) | **Write the loss function minimized during GPT’s autoregressive pre-training.**                                                                                                                                                                                                                                                                                                  | $\displaystyle \mathcal{L}_{\text{AR}} = -\; \mathbb{E}\;\sum_{j=1}^{m} \log p_\theta(x_j \mid x_{<j})$.                                                                                                                                                                                                                                                                                                                                                         |     |
| **5** (4 pts) | **Give two architectural / training-goal reasons why GPT can generate fluent text while vanilla BERT cannot.**                                                                                                                                                                                                                                                                   | _Reason 1_: GPT is trained with **causal masking**, so at inference it can sample the distribution $p(x_j\!\mid\!x_{<j})$ sequentially; BERT sees both left and right context and has no causal mask. _Reason 2_: GPT’s objective directly optimizes next-token prediction, whereas BERT optimizes MLM/NSP that do **not enforce autoregression**, so its output representations are not conditioned for generation.                                             |     |
| **6** (5 pts) | **Suppose you fine-tune BERT-base for binary sentiment classification (HW3 Q1). Describe the architecture modification and training procedure.**                                                                                                                                                                                                                                 | • Attach a small **dense “classification head”** (e.g., dropout → linear → soft-max) on top of the pooled $[CLS]$ representation. • Initialize with BERT-base weights and fine-tune the whole network using cross-entropy on the labeled data, optionally with class weighting or focal loss. • Optimize with AdamW; use task-aware input formatting and early stopping per validation loss.                                                                     |     |
| **7** (5 pts) | **Parameter-count comparison. One Transformer layer uses $d_{\text{model}}=768$ and $h=12$ heads. Compute the number of parameters in the four projection matrices $\mathbf W_Q,\mathbf W_K,\mathbf W_V,\mathbf W_O$ for (a) BERT-base (encoder) and (b) a GPT-like decoder layer of the same size. Assume each matrix is square $d_{\text{model}}\!\times\!d_{\text{model}}$.** | Each projection has $768^2\approx 589{,}824$ weights. Four such matrices give $4\times589{,}824=2.36\text{ M}$ parameters **per layer** for both models (the encoder/decoder split does not affect self-attention parameter count). BERT-base (12 layers) thus uses ≈ 28.3 M for its attention projections; a 12-layer GPT decoder uses the same. (Credit for stating formula $4d_{\text{model}}^2$ and the numeric value; minor arithmetic errors lose ≤ 1 pt.) |     |
| **8** (2 pts) | **Why is predicting masked tokens (BERT) considered “easier” than next-token prediction (GPT)?**                                                                                                                                                                                                                                                                                 | Predicting a missing token given _both_ left and right context (BERT) provides more information than predicting the future with only past context (GPT), making the MLM task statistically easier.                                                                                                                                                                                                                                                               |     |

Write the loss function minimized during BERT’s Masked Language Modeling.

- **Objective**
  Predict the original tokens at masked positions by minimizing their negative log-likelihood.

- **Setup**

  - Input tokens: $X=(x_1,\dots,x_n)$
  - Masked positions: $M\subset\{1,\dots,n\}$
  - Corrupted input: replace each $x_i$ for $i\in M$ with \[MASK] → $\tilde X$

- **Model Output**
  For each $i\in M$, BERT produces hidden state $\mathbf{h}_i$, then computes

  $$
    \hat{\mathbf{p}}_i = \mathrm{softmax}\bigl(\mathbf{h}_iW^T + \mathbf b\bigr)
  $$

  giving a distribution over the vocabulary.

- **Loss**

  $$
    L_{\rm MLM}
    = -\frac{1}{|M|}\sum_{i\in M}\log \hat p_i(x_i)
    = -\frac{1}{|M|}\sum_{i\in M}\log\bigl[\mathrm{softmax}(\mathbf{h}_iW^T+\mathbf b)\bigr]_{x_i}
  $$

- **Key points**

  - Only sum over masked positions
  - Averaged (or summed) cross-entropy loss
  - Learned parameters: BERT encoder $\theta$ and output weights $(W,\mathbf b)$
