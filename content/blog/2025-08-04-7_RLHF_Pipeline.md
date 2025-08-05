---
title: "7 RLHF Pipeline"
date: "2025-08-04 00:00:05"
excerpt: "Here is a concise summary of the RLHF Pipeline, including SFT, Reward Model, and PPO."
---

## RLHF Pipeline — **Cheat-Sheet for SFT → Reward Model → PPO**

---

### 1 Bird’s-Eye View

| Phase                              | What you do                                                                           | Typical objective (simplified)                                                                                                                        | Exam-worthy focus                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Supervised Fine-Tuning (SFT)**   | Fine-tune a pretrained LLM on _human demonstrations_ so it _follows instructions_.    | Minimise cross-entropy loss on paired (prompt, target) data: $\displaystyle \min_{\Theta}\; -\mathbb E\,\big[\log p_\Theta(y\mid x)\big]$             | How SFT provides a safe _reference policy_ $\pi_{\text{SFT}}$. |
| **Reward Model (RM)**              | Learn a scalar preference function $R_\theta(x,y)$ from pairwise rankings.            | Logistic (pairwise) loss: $\displaystyle \mathcal L(\theta)= -\mathbb E_{(x,y_w,y_l)}\!\big[\log\sigma\big(R_\theta(x,y_w)-R_\theta(x,y_l)\big)\big]$ | Why pairwise > absolute scores; continuous reward for RL.      |
| **Policy Optimisation (e.g. PPO)** | Fine-tune the policy $\pi_\phi$ to maximise RM reward **while staying close to SFT**. | $\displaystyle \max_\phi\;\mathbb E\big[R_\theta(x,y)\;-\;\beta\,\text{KL}\!\big(\pi_\phi\parallel\pi_{\text{SFT}}\big)\big]$                         | Role of KL term, PPO clip trick, stability.                    |

---

### 2 Step-by-Step Details

1. **SFT**

   - _Data_: few k–100 k human-written answers.
   - _Loss_: token-level NLL (teacher forcing).
   - _Outcome_: policy $\pi_{\text{SFT}}$ that is _helpful but sometimes sub-optimal_.

2. **Reward Model**

   - _Data_: for each prompt, humans rank $K$ model outputs; stored as preferred pair $(y_w,y_l)$.
   - _Why pairwise?_ Humans are bad at giving consistent absolute scores; pairwise ranking is easier and less noisy. The logistic loss turns discrete “A > B” into a smooth gradient.
   - _Output_: differentiable scalar reward $R_\theta$.

3. **PPO Fine-Tuning**

   - _Reward_: $R_\theta$ at the _sequence_ level.
   - _Objective_: maximise reward **minus** a KL penalty to avoid drifting far from $\pi_{\text{SFT}}$ (helps preserve fluency and prevents reward-hacking).
   - _PPO specifics_:

     - Use clipped surrogate advantage to keep policy updates in a “trust region”.
     - Empirically set β via reward-KL balancing.

---

### 3 Why Each Piece Exists

| Question                   | Quick rationale                                                                                                                                   |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Why a separate RM?**     | Turns sparse 0/1 preferences into dense, differentiable feedback; reduces label noise; lets RL query the reward cheaply at scale.                 |
| **Why KL penalty in PPO?** | (i) Prevents catastrophic forgetting of language fluency; (ii) stabilises training by bounding the policy update (same spirit as PPO’s clipping). |
| **Why not skip SFT?**      | Starting RL from scratch is unstable; SFT gives a performant prior and shrinks the exploration space.                                             |

---

### 4 Common Exam Prompts & One-Liners

| Prompt                       | Bullet answer                                                                                                  |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------- |
| _Outline RLHF steps_         | **1 SFT** on demos → **2 Train RM** on pairwise prefs → **3 PPO** w/ KL constraint.                            |
| _Pairwise vs scalar scores?_ | Pairwise labels are easier & more reliable; RM converts them to smooth real-valued rewards.                    |
| _Role of KL term?_           | Acts as a trust-region regulator that keeps $\pi_\phi$ near $\pi_{\text{SFT}}$ and preserves language quality. |

---

### 5 Memory Hooks

- **SFT → RM → PPO = “Demo, Judge, Refine.”**
- **KL ≅ seat-belt**—keeps policy from veering off.
- **RM logistic loss**: think _“sigmoid of the score difference.”_

Master these formulas + intuitions and you’ll ace every RLHF question!

## Exam sample questions

Question X Reinforcement Learning from Human Feedback (15 points)

Respond using full sentences, working mathematical expressions into those sentences where required.

### (a) (3 pts) Outline the three-phase RLHF pipeline and state the **goal** of each phase.

**Answer.**

1. **Supervised Fine-Tuning (SFT):** fine-tune the pretrained language model on human-written demonstrations so that it follows instructions; yields the reference policy $\pi_{\text{SFT}}$.
2. **Reward-Model Training (RM):** fit a scalar function $R_\theta(x,y)$ to human pairwise preference data, converting discrete rankings into a differentiable reward signal.
3. **Policy Optimisation (e.g.\ PPO):** further train the policy $\pi_\phi$ to maximise the learned reward while constraining its K-L divergence from $\pi_{\text{SFT}}$ to preserve language quality and prevent reward hacking.

---

### (b) (3 pts) Write the loss function used to train the reward model from pairwise preferences $(x,y_{w},y_{l})$ where $y_{w}$ is preferred to $y_{l}$.

**Answer.**

$$
\mathcal L_{\text{RM}}(\theta)\;=\;-\;
\mathbb E_{(x,y_{w},y_{l})}\Bigl[
\log \sigma\!\bigl(R_\theta(x,y_{w})-R_\theta(x,y_{l})\bigr)
\Bigr],
$$

where $\sigma(z)=\dfrac{1}{1+e^{-z}}$ is the logistic sigmoid.

---

### (c) (4 pts) Provide a complete PPO-style objective for RLHF, incorporating the reward model and a K-L penalty relative to $\pi_{\text{SFT}}$. Define every symbol you introduce.

**Answer.**

$$
\max_{\phi}\;
\mathbb E_{(x,y)\sim\pi_\phi}
\Bigl[
A_\theta(x,y)\,
\mathrm{clip}\!\bigl(r_\phi,1-\epsilon,1+\epsilon\bigr)\;
-\;\beta\,\mathrm{KL}\bigl(\pi_\phi(\cdot\!\mid\!x)\,\|\,\pi_{\text{SFT}}(\cdot\!\mid\!x)\bigr)
\Bigr],
$$

- $r_\phi = \dfrac{\pi_\phi(y\mid x)}{\pi_{\text{old}}(y\mid x)}$ is the probability ratio.
- $\epsilon$ is the PPO clipping parameter (e.g.\ 0.2).
- $A_\theta(x,y)=R_\theta(x,y)-b(x)$ is the reward-model advantage, with baseline $b(x)$.
- $\beta>0$ weights the K-L penalty that keeps the new policy close to $\pi_{\text{SFT}}$.

---

### (d) (3 pts) Give **two distinct reasons** why pairwise ranking data are preferred over absolute human scores when training $R_\theta$.

**Answer.**

1. **Lower noise & cognitive load:** Humans are more consistent at saying “A is better than B” than at assigning calibrated absolute scores, reducing label variance.
2. **Scale-free learning:** The pairwise logistic loss is invariant to affine transformations of the underlying reward scale, simplifying optimisation and preventing trivial reward-shifting exploits.

---

### (e) (2 pts) Explain **why** a K-L penalty (or, equivalently, a learning-rate–tuned KL target) is crucial during policy optimisation with PPO in RLHF.

**Answer.**

The K-L term acts as a **trust-region constraint** that (i) limits the policy’s drift away from the well-behaved $\pi_{\text{SFT}}$, thereby preserving grammaticality and factuality, and (ii) prevents the policy from over-optimising the imperfect reward model (reward hacking), which can otherwise lead to unsafe or incoherent outputs.

---

**End of Question X**
