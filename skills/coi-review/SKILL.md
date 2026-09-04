---
name: ranch-coi-review
description: One-shot evaluation of a production company's certificate of insurance for a location shoot at the Piuma Rd ranch. Checks additional-insured wording, subrogation waivers, entity name, and coverage limitations, then drafts the correction request.
---

# Ranch COI Review

Evaluate a producer's certificate of insurance for a shoot at 25575 Piuma Rd., Calabasas, CA 91302. The COI is the only input — don't assume access to the location agreement.

Extract with `pdftotext -layout`; the ADDL INSD / SUBR WVD checkbox columns get lost otherwise. Always read page 2+ — endorsements are attached there.

## Owner entity

Exact string, plain hyphen, comma before "dated":

> SUSAN E. RANDALL, Trustee of the KNIPE FAMILY TRUST - SURVIVOR'S TRUST, dated July 14, 1999.

Must appear on both the certificate holder box and the additional-insured line. Common errors: "Suze Randall Knipe", the July **17** date (wrong), missing trustee capacity.

## Blocking

**1. Additional-insured wording must reach the premises.** The exposure that matters is a crew member injured on the ranch who blames its condition — loose flagstone, railing, cliff, horse.
- ❌ "only with respect to claims arising out of the negligence of the Named Insured" — excludes exactly that scenario.
- ✅ CG 20 11 (Managers or Lessors of Premises), or blanket wording covering injury "caused, in whole or in part, by your acts or omissions… **or in connection with your premises owned by or rented to you**."

**2. Waiver of subrogation on workers' comp.** Check the SUBR WVD column on the WC line. **WC policies cannot have additional insureds** — structurally impossible — so the waiver is the only available protection. Cal. Labor Code §3852 gives the comp carrier a statutory right to sue the landowner after paying an injured crew member. Ask for **WC 04 03 06** (California).

**3. Endorsement pages, not just the certificate.** The ACORD form says it itself: "A statement on this certificate does not confer rights to the certificate holder in lieu of such endorsement(s)." Preprinted boilerplate — quoting it isn't an accusation. A checked box with no endorsement attached is unverified.

**4. Named insured.** Flag if it isn't obviously the company booking the shoot — AI status on the wrong entity's policy is worthless. Ask which entity signs.

## Coverage limitations to flag

- **"Whichever is less" cap.** Modern AI endorsements pay the lesser of the policy limits or the amount the location agreement requires. If present, say so plainly: recovery is capped by whatever number is in the signed agreement, regardless of the limits on the certificate.
- **"Not broader than required by contract"** — same effect on scope.
- **Aggregate "PER POLICY"** — shared with every other job that policy year, so the stated aggregate may be eroded by claim time.
- **Umbrella AI status** — usually unchecked. Verify, don't negotiate; $2M primary covers realistic claims.

## Also check

- **Dates** span load-in through strike, not just shoot days.
- **Workers' comp present** with employers' liability limits. Absent WC means an injured crew member's only target is the landowner.
- **Third Party Property Damage** (inland marine) — what actually pays for damage to the ranch; a CGL's care-custody-control exclusion bars most location damage. "Damage to Rented Premises" is a thin backstop (broadens past fire-only for rentals ≤7 days).
- **Primary and non-contributory** (CG 20 01) — without it her own carrier can be pulled in.
- **Auto** — hired/non-owned only is normal; note it if owned vehicles or picture cars are expected.
- **GL waiver** (CG 24 04) — nice to have; a properly broad AI endorsement already triggers the anti-subrogation rule for most claims.

## Output

Short verdict, then three buckets:
- **Blocking** — fix before the shoot
- **Worth asking** — free to request, don't spend leverage
- **Fine** — what's already right (say so; most producers are trying)

Then a plain-English email to the **producer**, not the broker — relaying it is their job. No form numbers in the body; list them at the bottom for the broker.

### Write in plain English

The checklist above is jargon so the analysis is precise. The answer to the user must not be. Write it the way you'd explain it to a friend who owns a house, not to a broker.

- Say what goes wrong and to whom, in concrete terms: "if a crew member trips on the walkway and sues her, this wording doesn't cover it" — not "the AI grant is scope-limited."
- Any term that has to appear — subrogation, additional insured, aggregate, endorsement — gets a short plain gloss the first time: "subrogation (the insurer's right to pay a claim, then come after whoever else was at fault — here, her)."
- Keep form numbers out of the prose and out of the producer email. Put them in a short list at the end for the broker, who does want them.
- Prefer "she" and "the production company" over "the Additional Insured" and "the Named Insured."
- Lead with whether she's protected and what to do, not with what the document says.
