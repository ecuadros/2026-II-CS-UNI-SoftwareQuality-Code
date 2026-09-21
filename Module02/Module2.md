# Module 2: Advanced Git/GitHub and Collaborative Workflow

## Contents

- [The big picture](#the-big-picture)
- [1. Branching strategies](#1-branching-strategies)
- [2. Pull requests and code review](#2-pull-requests-and-code-review)
- [3. Conventional Commits](#3-conventional-commits)
- [4. Merge conflicts](#4-merge-conflicts)
- [References](#references)

---

## The big picture

Quality is not only what gets tested at the end; it's built into how every change enters the codebase: changes are **small**, so they're easy to understand and review; every change is **reviewed by a person** and **verified by a machine** before it merges; the **history is readable**, so it works as documentation and traceability; and branches are **integrated often**, so conflicts stay small and cheap.

The module has four sections, each a view of the same workflow:

| Section | Question it answers | Key takeaway |
| --- | --- | --- |
| 1. Branching strategies | When and how do we integrate our work? | A strategy is a team agreement enforced by tooling, not memory. Prefer short-lived branches. |
| 2. Pull requests and code review | How do we keep defective code out of `main`? | Human review plus automated validation. Both are required; rulesets and CODEOWNERS enforce it. |
| 3. Conventional Commits | What does the repository history say? | `type(scope): description`, one change per commit. |
| 4. Merge conflicts | What happens when two people edit the same line? | Five steps to resolve it. Merge, rebase and cherry-pick differ only in step 4. |

**One change, end to end:** you create `fix/rounding` from an up-to-date `main` (Section 1); you make two commits, `test(payments): cover rounding edge case` and `fix(payments): correct rounding` (Section 3); you open a draft pull request, CI runs and a Code Owner is requested automatically (Section 2); someone changes the same lines on `main` while you wait, your PR shows a conflict, you resolve it, re-run the tests and push (Section 4); review and CI turn green, the ruleset allows the merge, and the branch is deleted (Sections 1 and 2). The code examples throughout reuse a small `payments.py` with a `calculate_discount` function.

---

## 1. Branching strategies

### 1.1 Why we need a strategy

With one person, working directly on `main` is enough. With two or more, unanswered questions appear: when do we integrate each person's work, do we deploy anything not yet merged, what happens to long-lived features? A **branching strategy** answers them. It is a **team agreement** — which branches exist, how long they live, how work reaches `main`, how releases happen — and it must be **enforced by tooling** (rulesets, required reviews, CI), not by everyone remembering the rules. The variable that matters most is **how long a branch lives**: the longer two branches drift apart, the more they conflict (Section 4) and the harder they are to review (Section 2).

### 1.2 GitHub Flow

The flow used in this course, in five rules: `main` is always deployable (CI protects it); branches are short and descriptive (`feature/payment`, `fix/rounding`); the PR is opened early, as a draft if needed; both review and CI must be green before merging; and the branch is deleted once merged, since `main` deploys after every merge.

```bash
git switch main && git pull                 # start from an up-to-date main
git switch -c feature/payment               # short, descriptive branch
# ... work in small commits ...
git push -u origin feature/payment          # publish the branch
# open the pull request early (draft is fine), get review, wait for CI
git switch main && git pull                 # after the merge, get the result
git branch -d feature/payment               # delete the local branch
```

Branches should be short-lived, ideally under 2-3 days — long divergence is the main cause of conflicts. This flow fits small teams with continuous deployment; watch out for branches that live too long, oversized PRs, and a `main` that's "deployable" only in theory because there's no CI.

### 1.3 Trunk-Based Development

A more aggressive version of the same idea: everyone integrates into the trunk (`main`) at least once a day, and branches last hours, not days. Incomplete work isn't isolated in a long branch — it's merged hidden behind a **feature flag**, present in `main` but disabled:

```python
def checkout(cart, user):
    if flags.is_enabled("new_checkout", user):
        return new_checkout(cart)
    return legacy_checkout(cart)
```

It requires fast, reliable CI, solid automated tests, and discipline with flags (a clear owner, a removal date, cleanup after rollout). Integrating daily without tests means breaking `main` daily, and flags that are never removed become technical debt. Research reported in *Accelerate* [9] associates trunk-based development with better delivery performance; teams deploying several times a day typically use it.

### 1.4 GitFlow (classic)

Proposed by Vincent Driessen in 2010 [4]. It uses long-lived branches and is designed for versioned releases:

| Branch | Created from | Merged into | Purpose |
| --- | --- | --- | --- |
| `main` | (initial) | — | Released code, tagged (`v1.0`, `v1.0.1`). |
| `develop` | `main` | — | Integration branch for the next release. |
| `feature/*` | `develop` | `develop` | One feature each. |
| `release/*` | `develop` | `main` and `develop` | Stabilize a release, then tag it. |
| `hotfix/*` | `main` | `main` and `develop` | Urgent fix for production. |

`main` and `develop` are permanent; the rest are created and deleted as needed. It fits software that is packaged and versioned — libraries, desktop or mobile apps, firmware, or products supporting several major versions in parallel — but carries more ceremony than a continuously deployed service needs. Driessen himself later recommended simpler workflows like GitHub Flow for teams doing continuous delivery [4].

### 1.5 Choosing a strategy

The single criterion is how long a branch lives:

| | GitHub Flow | Trunk-Based | GitFlow |
| --- | --- | --- | --- |
| Branch lifetime | days | hours | weeks or months |
| Complexity | low | medium | high |
| Ideal for | small teams, continuous deployment | large teams, several deploys a day | versioned, distributed software |
| Main safety net | PR review + CI | very fast CI + feature flags | release branches + tags |
| Main risk | branches living too long | flags/tests without discipline | ceremony and merge overhead |

Questions to ask: do we deploy continuously or ship versions; do we support several major versions at once; how mature are our tests and CI (Trunk-Based needs them most); how big is the team and how often do people touch the same files. This course uses **GitHub Flow**.

### 1.6 Good hygiene, whatever the strategy

Names follow `feature/<topic>`, `fix/<topic>`, `hotfix/<topic>` — lowercase, hyphens, short and descriptive. Delete merged branches (GitHub can do it automatically; locally, `git branch -d <name>` and `git fetch --prune`). Protect `main` with a ruleset (see [2.6](#26-rulesets-making-the-rules-automatic)). Update your branch often, bringing in the latest `main` regularly (merge or rebase — Section 4).

---

## 2. Pull requests and code review

### 2.1 What a pull request is for

A **pull request (PR)** requests to merge one branch into another; it's the step between your working branch and `main` where review and checks happen. While a change sits outside `main`, a PR lets you review the code before merging, comment on specific lines, run automated checks on every push, and require conditions — approvals, checks — before the merge button unlocks. Everything is recorded: what changed, who reviewed it, which checks passed. That's what gives traceability.

### 2.2 The PR as a quality gate

A PR has two gates, and both are needed to merge: **human review**, where a teammate understands the change and its risks, and **automated validation (CI)**, where the pipeline runs the build, tests and analysis. They're complementary, not redundant — human review sees design decisions, correct code solving the wrong problem, and readability for whoever maintains it later; automated tests see real run-time behavior and regressions in what already worked, every time, without tiring. Two facts justify doing this in the PR: the cost of a defect grows with the time it goes undetected, and review loses effectiveness as the diff grows — nobody reviews two thousand lines well, which is why PRs should stay small.

### 2.3 Anatomy of a good pull request

A good PR is small, single-purpose (don't mix a bug fix with a refactor), contextualized (says what changes, why, and how it was tested), and self-reviewed before anyone else looks at it. A real example from `microsoft/playwright` (PR #42696, see [References](#references)) shows what that looks like in practice: a Conventional Commits title and descriptive branch name, a summary that explains the problem prevented rather than just "fixed a bug," a stated regression test as evidence, and `Fixes #42693` linking the issue so it closes on merge.

A simple PR template (`.github/pull_request_template.md`):

```markdown
## Summary
What does this change do, and what problem does it prevent?

## Changes
- ...

## How was it tested?
- [ ] Automated test added or updated (file: ...)
- [ ] Checked manually: ...

## Related
Fixes #123
```

Open a **draft PR** early to signal work in progress. Write the title as a Conventional Commit (`fix(payments): correct rounding`) — with squash merge it often becomes the commit message on `main`. Use `Fixes #123` / `Closes #123` to link and auto-close issues. And if you can't describe the PR in one sentence, split it — a widely cited study of code review at Cisco [8] suggests reviewing no more than about 200-400 lines at a time.

### 2.4 Reviewing well

Before approving, ask: do I understand the problem from the description; does the code do what it promises; are there tests for the new logic; does it compromise security, data or critical performance; will it be understandable in six months without asking the author? Behavior different from what was promised, unhandled edge cases, security/permissions/data issues, and broken API contracts should block a merge; formatting the linter already handles, refactoring outside the PR's scope, and unproven optimizations should not.

Write comments that are specific and explain why, not only what; mark whether a comment blocks (`nit:`, `question:`, `suggestion:`, `blocking:`); use GitHub's suggested changes for small fixes; and choose the right review state (Comment, Approve, Request changes). As the author, answer every comment, respond with new commits rather than rewriting the originals mid-review so the reviewer can track what changed, and re-request review when ready. Approving without reading turns branch protection into process theater — the ritual is followed, but nothing is protected.

### 2.5 The two gates before a merge

A PR can have a pending human review **and** a failing CI check at once, and both must turn green. If a reviewer with write access requests changes, the merge button stays disabled until that's resolved. Failing checks block the merge too, but only checks marked **required** block it — one without that label reports its result without preventing merging. Decide deliberately which checks are required: make the ones that protect quality (tests, build, security scan) required, keep informative checks non-required, and fix flaky tests, because if red doesn't mean "broken," people learn to ignore it.

### 2.6 Rulesets: making the rules automatic

A **ruleset** is a rule declared in the repository that GitHub enforces on every PR — declared once, enforced always. Without one, anyone with write access can push straight to `main`, PRs can merge with no approvals or with failing checks, and anyone can skip the process. With one, direct pushes are blocked, required approvals (optionally from Code Owners) and required checks are set, and only people on a **bypass list** can skip the rule.

Configured under Repository → Settings → Rules → Rulesets → New branch ruleset. Three decisions matter: enforcement status (Active takes effect immediately), the bypass list (empty means nobody is exempt), and target branches (all branches, or just the default branch to protect `main` only).

A sensible baseline for a course repository: enforcement active, empty bypass list, default branch targeted, pull request required before merging, 1 required approval, stale approvals dismissed on new commits, review from Code Owners required (with a CODEOWNERS file), conversation resolution required, required status checks added — ticking the box isn't enough, you must add the specific checks GitHub has already seen run at least once — and force pushes blocked. GitHub also has older *branch protection rules* with similar options; rulesets are the newer, more flexible mechanism.

### 2.7 CODEOWNERS: who should review?

In a large repository nobody knows all the code; without declared owners, anyone with write access can approve changes anywhere, even in parts of the system they don't know. The answer is owners per domain: every area has a declared owner in a version-controlled `.github/CODEOWNERS` file, and GitHub requests their review automatically when a PR touches their files. With the ruleset rule *Require review from Code Owners*, that approval becomes mandatory.

Each line is `pattern  @owner`:

```text
# .github/CODEOWNERS
*                     @my-org/maintainers
/docs/                @my-org/docs-team
/.github/workflows/   @my-org/platform
/src/payments/        @alice @my-org/payments
*.sql                 @my-org/data-team
```

`*` is the default owner for everything. **The last matching pattern wins**, so put general rules first and specific rules later. An owner can be a person or a team and must have write access; GitHub reads the file from the PR's base branch. Avoid a huge `*` owner list — it floods people with review requests and defeats the purpose. (`grafana/grafana`'s CODEOWNERS file, about 1,400 lines, is a real example — see [References](#references).)

### 2.8 Stacked PRs: a feature in layers

When a change is too large for one PR but its parts really depend on each other, **stacked PRs** split it into dependent PRs reviewed separately and merged from the bottom up — for example, a data-schema PR, then a business-logic PR based on it, then a UI PR based on that. Each layer gets its own focused diff, its own review and CI, and when a lower layer merges, the PRs above it move onto the new base. GitHub has begun supporting this natively as a public preview; check current docs for availability, since previews change. Use stacking only when the dependency is real — independent changes are simpler as separate PRs against `main`.

Doing it by hand with Git (using the rebase from Section 4):

```bash
git switch -c feature/schema main            # layer 1
# ... commits ...
git switch -c feature/logic feature/schema   # layer 2 starts from layer 1
# ... commits ...
# PR 1: base main, compare feature/schema
# PR 2: base feature/schema, compare feature/logic

# after PR 1 merges, move layer 2 onto main:
git rebase --onto main feature/schema feature/logic
git push --force-with-lease
```

---

## 3. Conventional Commits

### 3.1 Why it matters

Compare `wip`, `fixes`, `changes`, `asdf` against `feat(payments): add card validation`, `fix(inventory): prevent negative stock`, `test(payments): cover expired card`, `docs: add installation guide`. The second style reads like a changelog, and it lets tools generate changelogs and version numbers automatically.

### 3.2 The format

```text
<type>[optional scope][optional !]: <description>

[optional body]

[optional footer(s)]
```

In `feat(payments): add card validation`, `feat` is the **type** — the intent of the change; `payments` is the optional **scope** — which part of the system it touches; and `add card validation` is the **description** — what the change does, in one line.

Write the description in the imperative mood ("add", "fix", "prevent," not "added" or "adds"): think "if applied, this commit will *add card validation*." Aim for about 50 characters, avoid going past 72, and skip the final period. The body carries the reasoning, wrapped at about 72 columns. The specification only fixes the structure; imperative mood and length limits are widely used conventions on top of it [2].

### 3.3 The types

| Type | Use it for | Example | Version effect |
| --- | --- | --- | --- |
| `feat` | A new feature for the user | `feat(auth): add password reset` | minor |
| `fix` | A bug fix | `fix(inventory): prevent negative stock` | patch |
| `test` | Add or fix tests, no production code | `test(payments): cover expired card` | none |
| `refactor` | Internal change, same behavior | `refactor(cart): extract total calculation` | none |
| `docs` | Documentation only | `docs: add installation guide` | none |
| `chore` | Maintenance: dependencies, config | `chore: bump pytest to 8.x` | none |
| `ci` | Changes to the CI pipeline | `ci: add coverage job` | none |

"Version effect" refers to Semantic Versioning, MAJOR.MINOR.PATCH [10]: `feat` raises the minor number, `fix` raises the patch, and a breaking change raises the major. The spec requires only `feat` and `fix`; the rest come from the Angular convention (also used by tools like commitlint), and many teams add `build`, `perf`, `style` and `revert`.

### 3.4 The scope

The scope is a noun in parentheses telling **where** the change happened — `payments`, `inventory`, `auth`, `api`, `ui`. It's optional. Agree on a short list of scopes per project and keep it consistent; use a module or area, not a ticket number (ticket numbers belong in the footer, `Refs: #123`).

### 3.5 The "and" rule: one change per commit

If you need an "and," make it two commits. `add card validation and fix a rounding bug` is really two changes — `feat(payments): add card validation` and `fix(payments): correct rounding` — because every commit should be revertible on its own (`git revert <id>`) without dragging unrelated changes, and it keeps review and changelogs clean.

To split a mixed change:

```bash
git add -p                                   # stage only the hunks that belong together
git commit -m "feat(payments): add card validation"
git add -p                                   # stage the rest
git commit -m "fix(payments): correct rounding"
```

If everything was already committed together and not yet pushed, uncommit but keep the changes, then split:

```bash
git reset HEAD~1
git add -p && git commit -m "..."            # repeat for each logical change
```

### 3.6 Breaking changes

A change that breaks compatibility is marked with `!` after the type or scope, and/or a `BREAKING CHANGE:` footer, and corresponds to a major version bump:

```text
feat(api)!: remove the v1 endpoints

BREAKING CHANGE: clients must migrate to the v2 endpoints.
```

A complete example with body and footer:

```text
fix(payments): reject negative amounts

The discount was calculated for negative totals, which produced a
negative price in the receipt. Reject them before calculating.

Fixes #42
```

### 3.7 Enforcing it and fixing mistakes

To keep it from depending on memory: a `commit-msg` hook validated by a tool like **commitlint**, a CI check on the PR title (especially with squash merge), or interactive helpers like **commitizen** that ask for type and scope. Changelog and version tools that read the history — conventional-changelog, release-please, semantic-release, git-cliff — decide the next version and write the changelog from the commit types.

To fix a message: `git commit --amend -m "new message"` for the last commit if not pushed; `git rebase -i HEAD~3`, changing `pick` to `reword`, for an older unpushed commit; if it's already pushed and shared, don't rewrite it — leave it and write better ones going forward.

### 3.8 Common mistakes

| Mistake | Why it hurts | Better |
| --- | --- | --- |
| `fix: stuff` | Says nothing | `fix(cart): apply coupon before tax` |
| `feat: add login and fix header and update docs` | Three changes in one commit | Three commits |
| `Fixed bug` | Past tense, no type, no place | `fix(auth): reject expired tokens` |
| `wip` on `main` | Unfinished work in shared history | Squash or clean up before merging |
| A very long first line | Truncated in most tools | Short subject, details in the body |

---

## 4. Merge conflicts

### 4.1 When does a conflict happen?

Git integrates two branches with a **three-way merge**, comparing each region against the common ancestor (the *merge base*). If only one side changed a region, Git takes that change; if both sides changed the same lines differently, Git can't decide which is right and reports a **conflict** — not an error, but Git asking a human to decide.

Worth knowing (tested with Git 2.45): adjacent-line edits conflict too (line 2 on one side, line 3 on the other), while edits separated by unchanged lines merge automatically; other conflict kinds exist as well — one side modifying a file the other deleted, both sides adding a file at the same path, renames, and binary files that can't be merged line by line. A conflict can appear in `git merge`, `git rebase` or `git cherry-pick`, and is resolved the same way in all three.

### 4.2 What a conflict looks like

Git writes both versions into the file between three markers:

```text
def calculate_discount(amount):
<<<<<<< HEAD
    return amount * 0.10
=======
    return amount * 0.15
>>>>>>> feature/vip-discount
```

`<<<<<<< HEAD` starts **your** branch's version; `=======` separates it from **the other** branch's version, closed by `>>>>>>> <branch-name>`. They aren't code and must be deleted, or the file won't even run.

Including the common ancestor often makes the decision obvious:

```bash
git config merge.conflictStyle zdiff3      # or: diff3
```

```text
<<<<<<< HEAD
    return amount * 0.10
||||||| base
    return amount * 0.05
=======
    return amount * 0.15
>>>>>>> feature/vip-discount
```

### 4.3 Five steps to resolve it

Decide which version is correct — sometimes one, sometimes the other, sometimes a combination, asking the author of the other branch if needed. Delete the three markers, keeping only the final code. Run `git add <file>` to tell Git you've decided. Finish with `git commit` (or `git rebase --continue` / `git cherry-pick --continue` mid-operation). Then run the tests before pushing — syntactically resolved doesn't mean semantically correct.

Useful while resolving: `git status` (lists unmerged paths), `git diff --name-only --diff-filter=U` (only unresolved files), `git diff --check` (finds leftover markers), `git mergetool` (opens a configured merge tool). Editors like VS Code offer "Accept current / incoming / both" buttons; GitHub's **Resolve conflicts** button offers a web editor for simple cases. To take one side wholesale: `git checkout --ours <file>` or `git checkout --theirs <file>` (the sides are reversed during a rebase, see [4.6](#46-rebase-replay-your-commits-on-top-of-another-branch)). To back out entirely: `git merge --abort`, `git rebase --abort`, or `git cherry-pick --abort`.

### 4.4 Same conflict, three ways to integrate

Merge, rebase and cherry-pick are three common ways to bring changes from one branch into another. Take the same starting point for all three: `main` has moved on with a commit setting the standard discount to 10%, while a `feature/vip-discount` branch has two commits of its own — one setting a VIP discount to 15% on that same line, another adding a VIP badge to the receipt. Both branches touch the same line, so however you integrate them you hit the same conflict; only **step 4** differs:

| | `git merge` | `git rebase` | `git cherry-pick` |
| --- | --- | --- | --- |
| What it does | Joins two histories | Replays your commits on top of another branch | Copies one commit |
| Result | A merge commit with two parents | A straight line of new commits | A new commit on the current branch |
| Commit IDs | Existing commits untouched | Replayed commits get new IDs | The copy has a new ID; the original stays |
| Step 4 | `git commit` | `git rebase --continue` | `git cherry-pick --continue` |
| Escape hatch | `git merge --abort` | `git rebase --abort` (or `--skip`) | `git cherry-pick --abort` |

### 4.5 Merge: keep both histories

```bash
git switch main
git merge feature/vip-discount
```

Git stops with `CONFLICT (content): Merge conflict in src/payments.py`. You're now mid-merge (`git status`, and the prompt, show it). Edit the file to keep both rules:

```python
def calculate_discount(amount, vip=False):
    rate = 0.15 if vip else 0.10
    return amount * rate
```

Then finish:

```bash
git add src/payments.py
git commit          # Git prepares a "Merge branch 'feature/vip-discount'" message
```

The resulting merge commit has two parents — the last commit of `main` and of the feature branch — and nothing is rewritten; the history shows exactly what happened. Non-destructive and safe on shared branches, but many merge commits can make history noisy and harder to read as a straight line.

If `main` hasn't moved since you branched, `git merge` just moves the pointer forward (*fast-forward*) with no merge commit; `--no-ff` forces one anyway, `--ff-only` refuses anything else. On GitHub, **Create a merge commit** does a regular merge.

### 4.6 Rebase: replay your commits on top of another branch

```bash
git switch feature/vip-discount
git rebase main
```

Rebase takes the commits on your branch that aren't in `main` and replays them one by one on top of it; the first replay hits the same conflict and stops (the prompt shows `REBASE 1/2`, meaning commit 1 of 2). Resolve as usual, then finish with `git rebase --continue`. The result is a straight line with no merge commit — but the replayed commits get **new IDs**, and the originals are abandoned, though recoverable for a while via `git reflog`. `main` hasn't moved, so bringing the work in afterward is a fast-forward: `git merge --ff-only feature/vip-discount`.

The sides are reversed during a rebase: `HEAD`/`--ours` is the branch you're rebasing **onto** (e.g. `main`), and `--theirs` is your own commit being replayed — the opposite of a normal merge.

Never rebase commits that other people already have — rewriting shared history gives teammates duplicated commits and new conflicts. If a branch is yours alone and already pushed, update it with `git push --force-with-lease` (safer than `--force`, since it refuses to overwrite commits someone else pushed meanwhile).

Interactive rebase (`git rebase -i main`) is the tool for tidying your own local commits before opening a PR: `pick` keeps a commit, `reword` edits its message, `squash`/`fixup` folds it into the previous one, `edit` stops to amend or split it, `drop` removes it. `git rebase --abort` undoes the whole operation; `git rebase --skip` drops the commit being replayed. On GitHub, **Rebase and merge** does the same thing to a PR's commits, with new IDs.

Pros: linear, easy to read and bisect, no merge commits, great for tidying local work. Cons: rewrites history (dangerous on shared branches), the same conflict can reappear once per replayed commit, and you lose the record of when branches were integrated.

### 4.7 Cherry-pick: copy one commit

For when a fix is stuck inside an unfinished branch and you want just that commit on `main` today:

```bash
git switch main
git log --oneline main..feature/vip-discount    # find the commit's ID
git cherry-pick c1dc3e5                         # copy it onto main
```

Conflicts are resolved the same way; finish with `git cherry-pick --continue`. The copy gets a new ID, the original stays on the feature branch, and Git keeps no link between the two — they're just two commits with the same change. Any commit left out (like the receipt badge in this example) simply doesn't appear on `main`.

Useful options: `-x` appends "(cherry picked from commit ...)" for traceability between long-lived branches; `A^..B` picks a range inclusive of `A`; `-n`/`--no-commit` applies without committing; `-m 1` is needed to pick a merge commit. Use it for hotfixes, backports, or rescuing one commit from a branch that isn't ready — not as an everyday way to integrate, since it duplicates commits and can still conflict later if the original branch is merged too.

### 4.8 Which one should I use?

Merge, to integrate a finished feature into a shared branch (nothing is rewritten). Rebase, to bring your own unshared branch up to date with a clean history — never on a branch others already use. Cherry-pick, to move one specific commit (a hotfix or backport). Interactive rebase, to tidy your local commits before opening a PR. What matters most is that the team agrees on the policy (Section 1) and it's enforced by the repository settings — GitHub's merge button offers **Create a merge commit**, **Squash and merge** and **Rebase and merge**, and the repository decides which are allowed.

### 4.9 Semantic conflicts: why step 5 exists

Git only understands text, which leaves two dangerous cases: a conflict resolved with the wrong logic (both lines kept, a discount applied twice — the file is valid but the behavior is wrong), and no conflict at all but broken code (one branch renames a function, another branch calls it under the old name from a different file — the edits don't overlap, so Git merges cleanly, but the result fails at run time). This is a **semantic conflict**, and only tests — including CI running on the merged result — catch it. That's why step 5 exists: syntactically resolved doesn't mean semantically correct.

### 4.10 Preventing conflicts

Short-lived branches and frequent integration (Section 1); small PRs (Section 2); clear ownership via CODEOWNERS; keeping mass reformatting out of logic-change PRs; one shared formatter/linter so whitespace doesn't conflict; regenerating, rather than hand-editing, generated files and lock files; and `git config rerere.enabled true` so Git remembers and replays a resolution you've already made — useful when rebasing repeatedly.

### 4.11 Recovering when things go wrong

| Situation | What to do |
| --- | --- |
| Mid merge/rebase/cherry-pick, want to start over | `git merge --abort`, `git rebase --abort` or `git cherry-pick --abort` |
| Finished locally, not pushed, and regret it | Right after: `git reset --hard ORIG_HEAD`, or find the old position with `git reflog` |
| Lost commits after a rebase | `git reflog`, then `git switch -c rescue <id>` |
| A merge was already pushed and must be undone | `git revert -m 1 <merge-commit>` |

`git reset --hard` discards uncommitted changes; `ORIG_HEAD` is overwritten by the next merge/rebase/reset, so use it immediately; reverting a merge commit needs `-m` to say which parent to keep (usually `1`).

---

## References

**Sources used in the presentation**

- [1] Chacon, S., & Straub, B. (2014). *Pro Git* (2nd ed.). Apress. https://git-scm.com/book
- [2] Conventional Commits. (n.d.). *Conventional Commits 1.0.0*. https://www.conventionalcommits.org/en/v1.0.0/
- [3] Cuadros-Vargas, E. (n.d.). *Software Quality* [Course material]. https://ecuadros.github.io/SoftwareQuality
- [4] Driessen, V. (2010). *A successful Git branching model*. https://nvie.com/posts/a-successful-git-branching-model/
- [5] Git. (n.d.). *Git documentation* (git-merge, git-rebase, git-cherry-pick). https://git-scm.com/docs
- [6] GitHub. (n.d.). *GitHub Docs* (GitHub flow, pull requests, code owners). https://docs.github.com
- [7] Trunk Based Development. (n.d.). *Trunk Based Development*. https://trunkbaseddevelopment.com

**Additional sources cited in this guide**

- [8] Cohen, J. (2006). *Best kept secrets of peer code review*. SmartBear Software.
- [9] Forsgren, N., Humble, J., & Kim, G. (2018). *Accelerate: The science of lean software and DevOps*. IT Revolution Press.
- [10] Preston-Werner, T. (n.d.). *Semantic Versioning 2.0.0*. https://semver.org/

**Real examples**

- Pull request: `microsoft/playwright`, PR #42696. https://github.com/microsoft/playwright/pull/42696
- CODEOWNERS file: `grafana/grafana`, `.github/CODEOWNERS`. https://github.com/grafana/grafana/blob/main/.github/CODEOWNERS

**Further reading (official documentation)**

- Git: [git-merge](https://git-scm.com/docs/git-merge), [git-rebase](https://git-scm.com/docs/git-rebase), [git-cherry-pick](https://git-scm.com/docs/git-cherry-pick)
- Pro Git: [Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging), [Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing), [Advanced Merging](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging)
- GitHub Docs: [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), [About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests), [About rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), [Available rules for rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/available-rules-for-rulesets), [About code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners), [Resolving a merge conflict using the command line](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/addressing-merge-conflicts/resolving-a-merge-conflict-using-the-command-line)
- Trunk Based Development: [Feature flags](https://trunkbaseddevelopment.com/feature-flags/)
