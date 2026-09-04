---
name: ranch-coi-review
description: Evaluates whether a production company's certificate of insurance is sufficient for a location shoot at the Piuma Rd ranch. Reports only blocking gaps, and drafts a producer email when the certificate is insufficient.
---

# Ranch COI Review

Evaluate a producer's certificate of insurance for a shoot at 25575 Piuma Rd., Calabasas, CA 91302. The COI is the only input — don't assume access to the location agreement.

You are reading the PDF pages, not extracted text. On the ACORD coverage grid, the last two columns of each policy line are **ADDL INSD** and **SUBR WVD**. They are small. An X, check, or Y in a cell is marked — do not call that box blank. Always read page 2+; attached endorsements can take back what a check appears to give.

## Owner entity

Exact string, plain hyphen, comma before "dated":

> SUSAN E. RANDALL, Trustee of the KNIPE FAMILY TRUST - SURVIVOR'S TRUST, dated July 14, 1999.

Must appear on both the certificate holder box and the additional-insured line. Common errors: "Suze Randall Knipe", the July **17** date (wrong), missing trustee capacity.

## Blocking (these decide sufficiency)

The certificate is sufficient only if every item below holds. Anything that fails is a blocking item.

**1. Additional-insured wording must reach the premises.** The exposure that matters is a crew member injured on the ranch who blames its condition — loose flagstone, railing, cliff, horse. A marked ADDL INSD box on general liability is enough if nothing else on the PDF limits that grant.
- Fail: attached AI endorsement (or certificate language) that covers "only with respect to claims arising out of the negligence of the Named Insured"
- Pass: a naked ADDL INSD check, CG 20 11 (Managers or Lessors of Premises), or blanket wording covering injury "caused, in whole or in part, by your acts or omissions… **or in connection with your premises owned by or rented to you**."

**2. Waiver of subrogation on workers' comp.** Look at the SUBR WVD column on the workers' compensation row. A mark there is enough. Do not demand a waiver endorsement page, and do not quote the ACORD "certificate does not confer rights" boilerplate as a gap — the check is the broker's representation. **WC policies cannot have additional insureds**, so the waiver is the only available protection. Missing workers' comp entirely also fails. Ask for a waiver (California **WC 04 03 06**) only when that WC SUBR WVD box is actually blank.

**3. Attached endorsements can contradict a check.** If no endorsement on that subject is attached, the check stands. If one is attached, it controls. Block only when that endorsement takes back what the check promised — for example a WC waiver endorsement that does not actually waive subrogation as to her, or an additional-insured endorsement limited to "claims arising out of the negligence of the Named Insured." A GL additional-insured endorsement is not a workers' comp waiver endorsement; do not treat its presence as failing the WC waiver.

**4. Named insured** is the company booking the shoot. AI status on the wrong entity's policy is worthless.

**5. Dates** span load-in through strike, not just shoot days.

## Output

Your entire job is to say whether the certificate is sufficient. That is all.

Do not mention what is already correct. Do not mention missing endorsement pages when the matching box is checked. Do not mention non-blocking limitations, "worth asking" items, "understand before you sign," contract caps, "whichever is less," "not broader than required," aggregate, umbrella, TPPD, primary/non-contributory, auto, or GL waiver.

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
