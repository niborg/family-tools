---
name: ranch-coi-review
description: Evaluates whether a production company's certificate of insurance is sufficient for a location shoot at the Piuma Rd ranch. Reports only blocking gaps, and drafts a producer email when the certificate is insufficient.
---

# Ranch COI Review

Evaluate a producer's certificate of insurance for a shoot at 25575 Piuma Rd., Calabasas, CA 91302. The COI is the only input — don't assume access to the location agreement.

You are reading the PDF pages, not extracted text. On the ACORD coverage grid, the last two columns of each policy line are **ADDL INSD** and **SUBR WVD**. They are small. An X, check, or Y in a cell is marked — do not call that box blank. Always read page 2+ — endorsements are attached there.

## Owner entity

Exact string, plain hyphen, comma before "dated":

> SUSAN E. RANDALL, Trustee of the KNIPE FAMILY TRUST - SURVIVOR'S TRUST, dated July 14, 1999.

Must appear on both the certificate holder box and the additional-insured line. Common errors: "Suze Randall Knipe", the July **17** date (wrong), missing trustee capacity.

## Blocking (these decide sufficiency)

The certificate is sufficient only if every item below holds. Anything that fails is a blocking item.

**1. Additional-insured wording must reach the premises.** The exposure that matters is a crew member injured on the ranch who blames its condition — loose flagstone, railing, cliff, horse.
- Fail: "only with respect to claims arising out of the negligence of the Named Insured"
- Pass: CG 20 11 (Managers or Lessors of Premises), or blanket wording covering injury "caused, in whole or in part, by your acts or omissions… **or in connection with your premises owned by or rented to you**."

**2. Waiver of subrogation on workers' comp.** Look at the SUBR WVD column on the workers' compensation row. If that cell is marked, the waiver is on the certificate — do not report it as missing. **WC policies cannot have additional insureds** — structurally impossible — so the waiver is the only available protection. Cal. Labor Code §3852 gives the comp carrier a statutory right to sue the landowner after paying an injured crew member. Ask for **WC 04 03 06** (California) only when that WC SUBR WVD box is actually blank. Missing workers' comp entirely also fails.

**3. Endorsement pages, not just the certificate.** The ACORD form says it itself: "A statement on this certificate does not confer rights to the certificate holder in lieu of such endorsement(s)." A checked box with no endorsement attached is an endorsement gap, not a missing checkbox. If SUBR WVD is marked, say the endorsement is missing — not that there is no waiver.

**4. Named insured** is the company booking the shoot. AI status on the wrong entity's policy is worthless.

**5. Dates** span load-in through strike, not just shoot days.

## Output

Your entire job is to say whether the certificate is sufficient. That is all.

Do not mention what is already correct. Do not mention non-blocking limitations, "worth asking" items, "understand before you sign," contract caps, "whichever is less," "not broader than required," aggregate, umbrella, TPPD, primary/non-contributory, auto, or GL waiver.

Write markdown directly. Do not wrap the whole reply in a code fence.

If sufficient, output only:

```
## Sufficient

This certificate is sufficient for the shoot.
```

If insufficient, output only:

````
## Insufficient

This certificate is not sufficient.

- One short line per blocking item: what is missing, and what that means for her.

## Email

```
Subject: line

Plain-English email to the producer (not the broker). No form numbers in the body. List form numbers at the bottom for the broker.
```
````

Keep each blocking line to one or two sentences. Prefer "she" and "the production company." Say what goes wrong in concrete terms: "if a crew member trips on the walkway and sues her, this wording doesn't cover it."
