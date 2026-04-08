# Suggested Commit Sequence

1. `feat(types): replace generic research scores with governance runway and unlock fields`
2. `feat(scorer): add diligence model for fee retention treasury runway and overhang`
3. `feat(data): enrich protocol metrics with fees treasury and insider assumptions`
4. `feat(registry): add governance model and token utility context per protocol`
5. `feat(agent): prompt for capital-allocation memos instead of generic protocol reviews`
6. `feat(output): print diligence scorecard with runway and overhang`
7. `test: cover runway and unlock sensitivity in scorer`
8. `docs(readme): add technical spec for diligence formulas`
9. `design(svg): add memo board preview for token buyers`
10. `chore(audit): add issue drafts and commit notes`

Operational note: keep future diligence changes separated by scoring, data, and presentation so the memo history stays readable.
