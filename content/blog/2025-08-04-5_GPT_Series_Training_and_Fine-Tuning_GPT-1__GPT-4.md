---
title: "5 GPT Series (GPT-1 → GPT-4) — Training & Fine-Tuning"
date: "2025-08-04 00:00:07"
excerpt: "Here is a concise summary of the GPT Series (GPT-1 → GPT-4) and their training & fine-tuning methodologies."
---

## GPT Series (GPT-1 → GPT-4) — **Training & Fine-Tuning Cheat-Sheet**

---

### 1 Evolution Snapshot

| Version            | Params                  | Training Recipe                                                       | Headline Capability                               |
| ------------------ | ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------- |
| **GPT-1** (2018)   | 110 M                   | Pure next-token MLE on BookCorpus                                     | Proof-of-concept autoregressive LM                |
| **GPT-2** (2019)   | 1.5 B (×10)             | Same objective, much bigger WebText corpus                            | Zero-shot / unsupervised multi-task ability       |
| **GPT-3** (2020)   | 175 B (×100)            | Scale-up; unchanged loss                                              | _In-Context Learning_ & _Chain-of-Thought_ emerge |
| **GPT-3.5** (2022) | ≈ 175 B                 | **Pipeline**: Supervised Fine-Tuning (SFT) → Reward-Model (RM) → RLHF | Follows human instructions; basis of ChatGPT      |
| **GPT-4** (2023)   | undisclosed, multimodal | Similar RLHF-style post-training; details kept secret                 | Text + image input; higher reliability            |

---

### 2 Core Objectives & Formulas

| Stage                                    | Loss / Objective                                                                                                                                                                                     | Where it appears                                             |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| **Unsupervised Pre-training** (all GPTs) | $\displaystyle \min_{\Theta}\; \hat{\mathbb{E}}\Bigl[-\!\!\sum_{j=1}^{m}\!\log p_\Theta(x_j\mid x_{<j})\Bigr]$                                                                                       | Classic maximum-likelihood next-token prediction             |
| **Supervised Fine-Tuning** (SFT)         | $\displaystyle \min_{\Theta}\;-\hat{\mathbb{E}}\bigl[\log p_\Theta(y\mid X)\bigr]\;-\;\lambda\,\hat{\mathbb{E}}\!\sum_{j}\log p_\Theta(x_j\mid x_{<j})$                                              | Task-label loss + a scaled MLE term to retain base knowledge |
| **Reward-Model (RM) Training**           | $\displaystyle \text{loss}(\theta)= -\hat{\mathbb{E}}_{(x,y_w,y_l)}\bigl[\log\sigma\bigl(r_\theta(x,y_w)-r_\theta(x,y_l)\bigr)\bigr]$                                                                | Pair-wise logistic loss from human preferences               |
| **RLHF / PPO (GPT-3.5, GPT-4)**          | $\displaystyle \max_{\phi}\;\hat{\mathbb{E}}_{x,y}\!\bigl[ r_\theta(x,y)-\beta\log\!\frac{\pi_\phi(y\mid x)}{\pi_{\text{SFT}}(y\mid x)}\bigr]+\gamma\,\hat{\mathbb{E}}\!\bigl[\log\pi_\phi(x)\bigr]$ | Reward maximization while staying close to SFT policy        |

_Notation_: $x$=prompt, $y$=generated text, $\pi_\phi$=current policy, $r_\theta$=learned reward model.

---

### 3 Training Pipeline Cheat-Sheet

```
Raw text  ──► GPT-n pre-train (MLE) ──►
            └► (optional) SFT on human demonstrations ──►
                Reward-Model from comparison labels ──►
                PPO / RLHF fine-tune ──► Inference
```

---

### 4 Likely Exam Prompts & Quick Answers

| Prompt                                                   | Bullet-proof answer                                                                                                                       |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **“State the pre-training objective.”**                  | Write the MLE formula above; mention cross-entropy over next-token distribution.                                                          |
| **“How does fine-tuning differ from pre-training?”**     | Adds task-label loss; may keep a regularized MLE term; data size ≪ pre-training; can be supervised (SFT) or RLHF.                         |
| **“What new capability appears when scaling to GPT-3?”** | Emergence of _in-context learning_ and _chain-of-thought_ reasoning.                                                                      |
| **“Summarize parameter growth from GPT-1→4.”**           | 110 M → 1.5 B → 175 B → undisclosed (larger & multimodal).                                                                                |
| **“Explain RLHF in one sentence.”**                      | Learn a reward model from human comparisons, then fine-tune the LM with PPO to maximize that reward while staying close to the SFT model. |

---

### 5 Mnemonic Hooks

- **“**M L E → S F T → R M → R L H F**”** — remember the four training stages.
- **“Scale Up ⇒ Skills Pop Up”** — bigger models (GPT-3) unlock emergent abilities.
- **“β-KL keeps us close”** — the KL term in PPO tethers the policy to its supervised parent.

---

## Exam sample questions

### **Mock Exam — GPT Series: Training & Fine-Tuning**

_(Each question targets material from Lectures 11–12; suggested mark values in brackets.)_

---

#### **1. Pre-training Objective (2 pts)**

Write the maximum-likelihood objective used to pre-train all GPT models and define every symbol.

**Answer**

$$
\min_{\Theta}\; \widehat{\mathbb{E}}\Bigl[-\!\!\sum_{j=1}^{m}\log p_\Theta(x_j \mid x_{<j})\Bigr]
$$

- $x_{<j}=x_1,\dots,x_{j-1}$: previous tokens (prompt + past outputs)
- $x_j$: current token to predict
- $p_\Theta$: model distribution with parameters $\Theta$
- $m$: sequence length

---

#### **2. Scaling from GPT-1 to GPT-2 (2 pts)**

State **two** architectural or data-centric changes that distinguish GPT-2 from GPT-1.

**Answer**

- Parameter count rises from 110 M to 1.5 B (≈ 10 × larger).
- Training corpus switches from BookCorpus to WebText (vastly more diverse web pages).

---

#### **3. Emergent Capabilities at GPT-3 Scale (2 pts)**

Name **one** phenomenon that emerges only when scaling to GPT-3 and briefly explain it.

**Answer**

- **In-Context Learning** – the model can infer new tasks from a few examples given only in the prompt, without weight updates.

---

#### **4. Fine-Tuning Loss (SFT) (2 pts)**

Give the combined loss used in supervised fine-tuning (SFT) of GPT models.

**Answer**

$$
\min_{\Theta}\; -\widehat{\mathbb{E}}\,[\log p_\Theta(y\!\mid\!X)]\;-\;\lambda\,\widehat{\mathbb{E}}\!\Bigl[\sum_{j}\log p_\Theta(x_j\!\mid\!x_{<j})\Bigr]:contentReference[oaicite:15]{index=15}
$$

First term fits labeled task outputs $y$; second (scaled by $\lambda$) retains pre-training knowledge.

---

#### **5. RLHF Pipeline (3 pts)**

List the **three** phases of Reinforcement Learning from Human Feedback (RLHF) used for GPT-3.5/4 and state the artifact produced at each phase.

| Phase                               | Training signal                | Resulting artifact            |
| ----------------------------------- | ------------------------------ | ----------------------------- |
| 1. **Supervised Fine-Tuning (SFT)** | Human demonstrations           | SFT policy $\pi_{\text{SFT}}$ |
| 2. **Reward-Model (RM) training**   | Human pairwise preferences     | Reward model $r_\theta$       |
| 3. **Policy Optimization (PPO)**    | RM scalar rewards + KL penalty | RLHF policy $\pi_{\text{RL}}$ |

Sources: reward-model loss and PPO objective.

---

#### **6. PPO Objective Term Roles (3 pts)**

For the PPO fine-tuning objective

$$
\mathbb{E}_{x,y}\!\bigl[r_\theta(x,y)-\beta\log\!\tfrac{\pi_\phi(y\mid x)}{\pi_{\text{SFT}}(y\mid x)}\bigr]+\gamma\,\mathbb{E}[\log\pi_\phi(x)]
$$

explain the purpose of each of the three summands in one line each.

**Answer**

1. $r_\theta(x,y)$: **maximize** reward model’s assessment of alignment.
2. $-\beta\mathrm{KL}(\pi_\phi\!\parallel\!\pi_{\text{SFT}})$: keep the new policy close to the safer SFT baseline.
3. $\gamma\,\log\pi_\phi(x)$: small “anchor” term that preserves language-model fluency by nudging toward the original pre-training distribution.

---

#### **7. Next- vs Masked-Token Prediction (2 pts)**

Why is autoregressive next-token prediction (GPT) considered **harder** than masked-token prediction (BERT), and what benefit does this confer?

**Answer**

Predicting the **future** token lacks bidirectional context, so information is strictly less than in masked prediction; mastering this harder task endows GPT models with better zero-shot generalization abilities.

---

#### **8. Parameter Growth Short Answer (2 pts)**

Provide the approximate parameter counts for GPT-1, GPT-2, GPT-3 and the public status for GPT-4.

**Answer**

- GPT-1 ≈ 110 M
- GPT-2 ≈ 1.5 B
- GPT-3 ≈ 175 B
- GPT-4 size undisclosed; only multimodal capability confirmed
