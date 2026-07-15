---
title: Metaphors We Hallucinate By
date: 2026-07-15
summary: There are more things in brains and networks, Horatio, than are dreamt of in your metaphors.
tags: [llm, linguistics]
---

### Metaphors We Hallucinate By

"There are more things in brains and networks, Horatio, than are dreamt of in your metaphors."

The book [_Metaphors We Live By_](https://en.wikipedia.org/wiki/Metaphors_We_Live_By) argues that metaphors aren't just linguistic sugar but ways of [concretely shaping thought](https://en.wikipedia.org/wiki/Conceptual_metaphor).

Exempli gratia:

1. LOVE IS WAR: we attack, lose, battle.
2. TIME IS MONEY: so we save it, spend it, waste it.

Nowhere is this more apparent than the brain. We don't yet understand its structure, so we use metaphors to simplify it. In fact, throughout history, our view of technology has limited our understanding of the brain — when we usually think of it the other way around, the brain creating technology.

First, trains: we saw brains as trains carrying stuff around. With ideas of channeling energy (building pressure, letting off steam) came a psychology à la Freud, of humans as [hydraulic systems with moving drives](https://en.wikipedia.org/wiki/Drive_theory).

Then, electric wires: we saw the brain as a series of telephone poles carrying information.

The most recent is the brain as a computer. Memory, processing, hardware, software, things being "hardwired." Cognitive science is built on this reductionist view of the brain as a computational machine — and this is why it's inherently limited.

(The alternative, scientific way of going is up, from the bottom. This is why I'm a fan of things like [integrated information theory](https://en.wikipedia.org/wiki/Integrated_information_theory) — things that actually try to build off of math or their own axioms instead of borrowed metaphors. This does not prevent them from being, likely, wrong.)

These metaphors have opened vistas of research, but they have also limited our understanding, because we end up relying on vague metaphors borrowed from human cognition. Let's look at a case study.

## A case study: Machine Unlearning

The idea of getting models to [unlearn something](https://arxiv.org/abs/1912.03817) rests on a vague metaphor of human cognition. The field is ill-defined and underdefined, and this limits what we can do in it. Making the term precise is itself a problem.

First off, do humans actually forget anything? We forget what we had for breakfast or the names of acquaintances, but we can be reminded of these rather completely. To forget something completely, one must die or be lobotomized. Even those Spanish lessons you took in middle school — you remember more of them than you would think.

But what about a model? The canonical target is that unlearning should leave you where you'd be if you had never trained on the forget set in the first place. Write the training algorithm as A, the data as D, the forget set as D_f. An unlearning procedure U is exact if

    distribution of  U(A(D), D_f)   ==   distribution of  A(D \ D_f)

This defines forgetting as a process done a certain way, not as a quality of a system. We can't define forgetting by a way of forgetting. And why is "never having seen it" even the right counterfactual? You might instead want "cannot be reproduced," or "no downstream test can distinguish it."

Which brings us to a more rigorous patch: [certified removal](https://arxiv.org/abs/1911.03030), which ports the epsilon-delta machinery of [differential privacy](https://en.wikipedia.org/wiki/Differential_privacy) over to models — the scrubbed model should be provably indistinguishable, up to (ε, δ), from one that never saw the data. Clean. But those proofs only hold where the math stays tame: convex losses, strongly regularized ERM. An LLM is none of those, so on real models nobody certifies anything, and the target degrades into a surrogate you can descend. Push loss (perplexity) up on D_f, hold it down on the retain set — some version of minimizing L_retain − λ·L_forget.

Not a good definition. It overfits to specific probes, and it doesn't deal with the entanglement of facts or with how shallow and brittle our unlearning methods are (even [quantization](https://arxiv.org/abs/2410.16454) + distilliation can make models relearn!).

What this field would need to advance in an organized manner is: (1) a clear, formal definition of what we mean by unlearning; and (2) more precise metrics that can measure this via model internals.

This argument can be computed for endless aspects of LLMs: [self-attention](https://arxiv.org/abs/1706.03762), [hallucination](https://en.wikipedia.org/wiki/Hallucination_%28artificial_intelligence%29), [reasoning](https://arxiv.org/abs/2201.11903). How often have these words made us anthropomorphize models?
