# Module 02: Advanced Git/GitHub and collaborative workflow

**CS395 Software Quality · UNI · 2026-II · Group G2 · Team B**

Languages / Idiomas: [Español](README.md) · **English**

| Member | Code |
| --- | --- |
| Huamán García, Brian Alberto | 20172734G |
| Limache López, Ebert Antonio | 20151380A |
| Quispe Amao, Diego Sebastián | 20202222I |

This document is the written guide for a 30-minute presentation. It covers the full topic (version control, branches, history, integration, review, automation, and releases) and adds three hands-on practice pieces: a [reproducible lab](lab/crear-laboratorio.sh), a [`commit-msg` hook](lab/hooks/commit-msg), and a demonstration with `git bisect`.

Content of this folder:

| File | Content |
| --- | --- |
| [`README.md`](README.md) | This guide, in Spanish |
| [`README.en.md`](README.en.md) | The same guide, in English |
| [`lab/crear-laboratorio.sh`](lab/crear-laboratorio.sh) | Creates the practice repository (12 commits, 1 hidden regression), in Spanish or English with `--lang en` |
| [`lab/hooks/commit-msg`](lab/hooks/commit-msg) | Hook that enforces Conventional Commits |

## Contents

- [Central idea](#central-idea)
- [Mapping against the syllabus](#mapping-against-the-syllabus)
- [Presentation plan (30 min)](#presentation-plan-30-min)
- [1. Version control: centralized vs distributed](#1-version-control-centralized-vs-distributed)
- [2. Branching strategies](#2-branching-strategies)
- [3. Readable history: Conventional Commits and SemVer](#3-readable-history-conventional-commits-and-semver)
- [4. Integrating changes and resolving conflicts](#4-integrating-changes-and-resolving-conflicts)
- [5. Advanced Git: investigate and recover](#5-advanced-git-investigate-and-recover)
- [6. Pull requests, review, and repository rules](#6-pull-requests-review-and-repository-rules)
- [7. Automation: hooks, CI, and merge queue](#7-automation-hooks-ci-and-merge-queue)
- [8. Release management](#8-release-management)
- [9. Supply chain and repository security](#9-supply-chain-and-repository-security)
- [10. Lab](#10-lab)
- [11. Checklist for a team repository](#11-checklist-for-a-team-repository)
- [References](#references)

---

## Central idea

Quality is not added at the end with tests: it is built into the way **each change enters the code**. A well-governed repository achieves four things:

1. **Small changes**, easy to understand and review.
2. **Double control** over each change: a person reviews it and a machine verifies it.
3. **Readable history**, which serves as documentation and traceability.
4. **Frequent integration**, so conflicts are small and inexpensive.

The entire module revolves around a small, custom example: the final grade formula from the syllabus, `FG = (MT + FE + CA) / 3`, implemented in `grades.py`. That function is the one that breaks and recovers in the lab.

**Why it matters to measure it.** The book *Accelerate* [4] associates short-lived branches, frequent integration, and automated delivery with better team performance, measured by four metrics: deployment frequency, lead time for changes, change failure rate, and time to recovery. A good Git flow moves all four metrics.

## Mapping against the syllabus

The topics from Unit 2 of the syllabus (Version Control and CI/CD) and the section where each is covered:

| Syllabus topic or expected outcome | Section |
| --- | --- |
| Difference between centralized and distributed configuration management | [1](#1-version-control-centralized-vs-distributed) |
| Branching strategies: development vs release branches, trunk-based | [2](#2-branching-strategies) |
| Commit conventions (Conventional Commits) and semantic versioning | [3](#3-readable-history-conventional-commits-and-semver) |
| Merge and rebase strategies | [4](#4-integrating-changes-and-resolving-conflicts) |
| Git tools and practices for a team | [5](#5-advanced-git-investigate-and-recover) |
| Mandatory PR review, code ownership (CODEOWNERS), branch protection rules | [6](#6-pull-requests-review-and-repository-rules) |
| CI as source of truth for code state | [7](#7-automation-hooks-ci-and-merge-queue) |
| Use of version control in release management | [8](#8-release-management) |
| Dependency vulnerability scanning and supply chain security | [9](#9-supply-chain-and-repository-security) |

## Presentation plan (30 min)

| Block | Sections | Time |
| --- | --- | --- |
| **A. Fundamentals and rescue** | Opening, 1 (Git model), 5 (advanced + demo with `bisect`), closing | 10 min |
| **B. Team workflow** | 2 (branches), 3 (commits and SemVer), 4 (integration and conflicts) | 8 min |
| **C. Quality and delivery** | 6 (PR and rules), 7 (automation), 8 and 9 (releases and security) | 10 min |
| Margin and Q&A | | 2 min |

---

## 1. Version control: centralized vs distributed

### 1.1 Two models

| | Centralized (Subversion, CVS, Perforce) | Distributed (Git, Mercurial) |
| --- | --- | --- |
| Where history lives | On a single server | In **every clone**, complete |
| To make a commit | Connection to server required | Done **locally**, without network |
| Branches | More costly to handle and merge | Cheap pointers |
| Single point of failure | The server | None: each clone is a backup copy |
| Publishing | Commit is already public | Separate `commit` (local) from `push` (share) |

That separation between **recording** and **sharing** is what makes local rebase, small commits, and offline work possible. It also has a cost: it requires team agreement on what gets published and when, which is the topic of the rest of the module.

### 1.2 Inside Git: four object types

Git stores snapshots of the project, identified by the hash of their content (SHA-1, 40 hexadecimal characters):

| Object | What it represents |
| --- | --- |
| **blob** | The content of a file |
| **tree** | A directory: list of names pointing to blobs or other trees |
| **commit** | A tree, its parents, author, date, and message |
| **tag** | An annotated label pointing to an object |

A **branch** is not a folder or a copy: it is a 41-byte file (`.git/refs/heads/<name>`) that contains the hash of a commit. `HEAD` is a pointer to the current branch. You can check it yourself:

```bash
cat .git/HEAD                   # ref: refs/heads/main
cat .git/refs/heads/main        # a1b2c3... (the hash of the latest commit)
git cat-file -p HEAD            # shows the commit: tree, parent, author, message
git cat-file -p HEAD^{tree}     # shows the file tree of that commit
```

Two consequences used all the time:

- **Branching is almost free**: creating a branch only writes a small file. That is why branching for each change is worthwhile.
- **A commit is immutable**: the hash depends on the content *and its parents*. Changing a commit (with `--amend` or `rebase`) produces a **new** commit with a different hash. That explains why rewriting shared history causes problems.

**In software quality:** the hash makes history auditable. If the hash matches, the content is identical, and that is the basis of traceability.

---

## 2. Branching strategies

A branching strategy is a **team agreement**: what branches exist, how long they live, how work reaches `main`, and how versions are published. The factor that weighs most is **how long a branch lives**: the longer it lives, the further it drifts from the rest, and the more painful integration and review become.

### 2.1 The three strategies

**GitHub Flow.** Only `main` exists (always deployable) and short branches that are opened, reviewed, and deleted. Six steps: create branch, make change, open PR, address review, merge, delete branch. It works for small teams with continuous deployment.

**Trunk-based development.** Everyone integrates into the trunk (`main`) at least once a day; branches live for hours. Incomplete work is merged **disabled** with a *feature flag*:

```python
def calculate_grade(student):
    if flags.active("weighted_grade_v2", student):
        return weighted_grade_v2(student)
    return final_grade(student)          # old path, still works
```

It requires fast CI, reliable tests, and discipline with flags (owner, retirement date, cleanup). Without tests, integrating daily is breaking `main` daily.

**GitFlow.** Long-lived branches designed for packaged releases:

| Branch | Branches from | Merges into | Purpose |
| --- | --- | --- | --- |
| `main` | | | Released code, tagged (`v1.2.0`) |
| `develop` | `main` | | Integration of the next version |
| `feature/*` | `develop` | `develop` | One feature |
| `release/*` | `develop` | `main` and `develop` | Stabilize and tag |
| `hotfix/*` | `main` | `main` and `develop` | Urgent production fix |

It is useful for software with multiple versions maintained in parallel (libraries, mobile apps, firmware). For a service continuously deployed it adds unnecessary ceremony; its own author clarified this in 2020 [1].

### 2.2 Development branches vs release branches

The syllabus asks to distinguish them. A **development branch** lives short and ends merged. A **release branch** (`release/1.4`) lives as long as that version is maintained, and receives only fixes (*backports*) via `cherry-pick -x`. Trunk-based and GitHub Flow rarely need release branches; GitFlow and multi-version products do.

### 2.3 How to choose

| Question | If the answer is... | Tends to... |
| --- | --- | --- |
| Do we deploy continuously or deliver versions? | Continuously | GitHub Flow / trunk-based |
| Do we maintain multiple versions at once? | Yes | Release branches |
| How good are our tests and CI? | Poor | Not trunk-based yet |
| How many people touch the same files? | Many | Shorter branches |

### 2.4 Hygiene, whatever the strategy

- Branch names `feature/<topic>`, `fix/<topic>`, `hotfix/<topic>`: lowercase and hyphens.
- Delete merged branches (GitHub can do it automatically) and clean old remote references: `git fetch --prune`.
- Bring `main` to your branch frequently.
- Protect `main` with rules ([section 6](#6-pull-requests-review-and-repository-rules)).

---

## 3. Readable history: Conventional Commits and SemVer

### 3.1 Format

```text
<type>[optional scope][!]: <description>

[optional body]

[optional footer(s)]
```

Examples with the grades project:

```text
feat(grades): add practice average
fix(grades): correct integer division in final_grade
test(grades): cover the case of exactly 10.5
docs: explain how to run the lab
feat(api)!: remove the v1 endpoint
```

Common style rules (community conventions about the specification [2]): description in imperative mood ("add", not "added"), around 50 characters and no more than 72, no period at the end; the body explains the *why*.

### 3.2 Types and effect on version

| Type | Use | SemVer effect |
| --- | --- | --- |
| `feat` | New functionality for the user | minor |
| `fix` | Error correction | patch |
| `perf`, `refactor`, `test`, `docs`, `style`, `build`, `ci`, `chore` | Changes that do not alter observable behavior | none |
| Any with `!` or footer `BREAKING CHANGE:` | Breaks compatibility | **major** |

The specification only requires `feat` and `fix`; the rest comes from Angular convention and is in common use.

### 3.3 Semantic versioning (SemVer)

`MAJOR.MINOR.PATCH` [3]: **MAJOR** is incremented when breaking compatibility, **MINOR** when adding compatible functionality, and **PATCH** when fixing compatible errors. Versions `0.y.z` are early development: nothing is stable. Prereleases are marked with a suffix (`1.0.0-rc.1`).

The connection to the above is important: **if commits follow the format, the version can be calculated** instead of decided by hand (see [section 8](#8-release-management)).

### 3.4 The "and" rule

If the message needs an "and", it is two commits. Each commit should be able to be reverted alone (`git revert`) without dragging along unrelated changes. To separate mixed changes:

```bash
git add -p                           # choose what goes into the commit
git commit -m "feat(grades): add is_passing"
git add -p
git commit -m "fix(grades): use 10.5 as minimum grade"
```

### 3.5 Common mistakes

| Wrong | Why | Better |
| --- | --- | --- |
| `various fixes` | Says nothing, cannot be automated | `fix(grades): round to two decimals` |
| `feat: login, header and docs` | Three changes in one | Three commits |
| `wip` in `main` | Incomplete work in shared history | Clean up before merging |

### 3.6 How to enforce it

Trusting memory fails. It is reinforced by layers: a local **`commit-msg` hook** ([lab/hooks/commit-msg](lab/hooks/commit-msg)), a **PR title check** in CI (important if squash is used, because the title becomes the commit), and tools like commitlint. To correct a message: `git commit --amend` if it is the last and not published; `git rebase -i` with `reword` if it is earlier and not published; if already public, do not rewrite.

---

## 4. Integrating changes and resolving conflicts

### 4.1 Three ways to integrate

With the same starting point (`main` advanced and your `feature/is_passing` branch has 2 commits):

| | `merge` | `rebase` | `squash and merge` |
| --- | --- | --- | --- |
| Result | Merge commit with two parents | Your commits replayed on top of `main` | Single new commit in `main` |
| History | Faithful to what happened, more branched | Linear | Linear, one commit per PR |
| Commit IDs | Do not change | **Change** | The PR collapses into one |
| Risk | Noisy history | Rewrites: do not use on shared branches | Lost detail of intermediate commits |

GitHub offers all three when merging a PR (*Create a merge commit*, *Squash and merge*, *Rebase and merge*), and the repository decides which to allow. If `main` did not advance, `merge` can resolve with **fast-forward**, without a merge commit; `--no-ff` forces one and `--ff-only` prohibits any other case.

### 4.2 When a conflict appears

Git compares each region against the common ancestor (*merge-base*). If only one side changed it, it takes that change; if **both** changed the same lines differently, it cannot decide and marks a **conflict**. A conflict is not an error: it is Git asking a person to decide.

```text
def is_passing(grade):
<<<<<<< HEAD
    return grade >= 10.5
=======
    return grade >= 11
>>>>>>> feature/minimum-grade
```

`<<<<<<<` opens your version, `=======` separates it from the other, and `>>>>>>>` closes. These markers **are not code** and must be removed. With `git config merge.conflictStyle zdiff3` the ancestor is also shown, which usually clarifies who changed what.

### 4.3 Five steps

1. **Decide** which version is correct (one, the other, or a combination; ask the author if needed).
2. **Edit** the file leaving only the final code.
3. `git add <file>` to declare it resolved.
4. **Finish**: `git commit` (merge), `git rebase --continue`, or `git cherry-pick --continue`.
5. **Test** before publishing.

Utilities: `git status`, `git diff --name-only --diff-filter=U` (unresolved files), `git diff --check` (forgotten markers), `git mergetool`. To abort: `git merge --abort`, `git rebase --abort`, or `git cherry-pick --abort`.

**Step 5 is not optional.** Git only understands text: there could be a conflict resolved with wrong logic, or **no conflict and broken code** (one branch renames a function and another calls it by the old name from another file). It is a *semantic conflict* and only tests catch it. We will return to this with the *merge queue* in [section 7](#7-automation-hooks-ci-and-merge-queue).

### 4.4 Prevention

Short branches, small PRs, clear code ownership (CODEOWNERS), one formatter for the whole team, regenerate (do not edit by hand) generated files, and `git config rerere.enabled true` so Git remembers and repeats a resolution it has already done.

---

## 5. Advanced Git: investigate and recover

This is the toolbox for when something goes wrong, and it is where the model from [section 1](#1-version-control-centralized-vs-distributed) becomes useful.

### 5.1 `reset`: three modes

`reset` moves the current branch to another commit. What changes is how much else is touched:

| Command | Moves the branch | Index (staging) | Working files |
| --- | --- | --- | --- |
| `git reset --soft HEAD~1` | Yes | Preserved | Preserved |
| `git reset --mixed HEAD~1` (default) | Yes | Cleaned | Preserved |
| `git reset --hard HEAD~1` | Yes | Cleaned | **Uncommitted changes lost** |

`git restore <file>` discards changes to a file and `git restore --staged <file>` removes it from the index. `git switch` and `git restore` replace old uses of `git checkout`.

### 5.2 `reflog`: the safety net

`git reflog` records every movement of `HEAD`, even ones that left commits "orphaned". After an accidental `reset --hard`:

```bash
git reflog                       # look for the previous state: HEAD@{1}
git reset --hard 'HEAD@{1}'      # go back there
```

The reflog is **local** and expires (by default, 90 days for reachable and 30 for orphaned), so it rescues recent work, not as a backup.

### 5.3 `bisect`: find the regression with binary search

When something stopped working and you do not know in which commit, `git bisect` does a binary search over history. With an automated test, the search is **automatic**:

```bash
git bisect start HEAD v0.1.0        # bad = HEAD, good = the tag v0.1.0
git bisect run python test_grades.py # Git tests, marks, and advances alone
git bisect reset                    # back to the original branch
```

The command you pass must exit with code **0** if the commit is good, **125** to skip it, and any value between 1 and 127 if it is bad. With 11 commits it takes 3 or 4 tests; with 1000 commits about 10. It is a direct example of **why automated tests are worth more than just finding bugs**: they turn a mystery of hours into a search of minutes.

Other investigation tools:

```bash
git log -S "integer division" --oneline    # commits that added or removed that text
git log --follow -p grades.py              # history of a file, following renames
git blame -L 10,20 grades.py               # who last touched those lines
```

### 5.4 Move and reorder work

| Need | Tool |
| --- | --- |
| Copy **one** commit to another branch (hotfix, backport) | `git cherry-pick -x <hash>` (`-x` notes the origin) |
| Save mid-work changes to switch tasks | `git stash push -u -m "wip: is_passing"` and later `git stash pop` |
| Work on two branches at once without re-cloning | `git worktree add ../hotfix-grade -b hotfix/grade main` |
| Reorder my commits before the PR | `git rebase -i main` (`reword`, `squash`, `fixup`, `edit`, `drop`) |
| Fix a prior commit without rewriting by hand | `git commit --fixup <hash>` and then `git rebase -i --autosquash main` |
| Undo something **already published** | `git revert <hash>` (creates an inverse commit, does not rewrite) |
| Update my already-published branch after rebase | `git push --force-with-lease` (never `--force` alone) |

**Rule that summarizes this section:** what is already shared is **fixed with new commits** (`revert`); what only you have can be **rewritten** (`amend`, `rebase`, `reset`).

To undo a merge already published, you must say which parent to keep: `git revert -m 1 <hash-of-merge>`.

---

## 6. Pull requests, review, and repository rules

### 6.1 The PR as a quality gate

A PR is the step between your branch and `main`. Two controls happen there and both are needed:

| Human review | Automatic verification (CI) |
| --- | --- |
| Understands the change and its risks | Compiles, tests, and analyzes on every push |
| Sees design decisions and correct code that solves the wrong problem | Sees regressions and real behavior, always and without tiring |

A PR is recorded with what changed, who reviewed it, and what checks passed: that is **traceability**. And since the cost of a defect grows with the time it goes undetected, catching it here, before merging, is worthwhile.

### 6.2 A good PR

Small (evidence suggests reviewing around 200 to 400 lines at a time [5]), with a single purpose, with context (what, why, how tested), and self-reviewed. Suggested template (`.github/pull_request_template.md`):

```markdown
## Summary
What changes and what problem does it prevent?

## How tested
- [ ] Automated test added or updated
- [ ] Manual verification: ...

## Related
Closes #
```

Open the PR as a draft early; use `Closes #12` to close the issue on merge; and title it as a Conventional Commit.

### 6.3 Review well

**Block a merge:** behavior different from promise, uncovered edge cases, security or data risks, and broken API contracts. **Should not** block: formatting already covered by linter, refactors unrelated to the PR, and optimizations without evidence.

Useful comments: specific, with the *why*, and marked by weight (`nit:`, `question:`, `blocking:`). Use GitHub's *suggestions* for small fixes. Approving without reading turns branch protection into empty ritual.

### 6.4 Repository rules (*rulesets*)

A rule declared in the repository that GitHub enforces on every PR: defined once and always obeyed. In *Settings → Rules → Rulesets* configure:

- **Status**: active, or disabled.
- **Target branches**: all, or only the default.
- **Bypass list** (*bypass*): who can skip the rule; empty means nobody.

Reasonable base for a course repository:

- Require PR before merging, with **1 approval** minimum.
- Dismiss old approvals when new commits arrive.
- Require **review from owners** (CODEOWNERS).
- Require all conversations resolved.
- Require **mandatory status checks** (only those already recently run in the repository can be chosen).
- Block *force push*, and if desired, require linear history and signed commits.

GitHub also has *branch protection rules*, older and with similar options; rulesets are the newer and more flexible mechanism.

### 6.5 CODEOWNERS

Who must review what. A versioned file (`.github/CODEOWNERS`) with lines `pattern  @owner`:

```text
# .github/CODEOWNERS
*                        @my-org/team
/docs/                   @my-org/documentation
/src/grades/             @user-a @my-org/quality
*.sql                    @my-org/data
```

The **last match wins**, so general rules go first and specific ones after. Owners need write permission, and GitHub reads the file from the PR's base branch. Together with the *Require review from owners* rule, that approval becomes mandatory. Avoid a global owner too large: it floods with requests and defeats the purpose.

### 6.6 Stacked PRs

When a large change has parts that depend on each other, split them into chained PRs reviewed separately and merged bottom-to-top (for example: schema, then logic, then interface). With Git at hand:

```bash
git switch -c feature/schema main
git switch -c feature/logic feature/schema     # layer 2 starts on layer 1
# after layer 1 merges, move layer 2 on top of main:
git rebase --onto main feature/schema feature/logic
git push --force-with-lease
```

Use it only when dependency is real; if changes are independent, separate PRs against `main` are simpler.

---

## 7. Automation: hooks, CI, and merge queue

Rules that depend on everyone remembering them break. They must be automated at three levels, each further from the keyboard and harder to skip:

| Level | Tool | Can be skipped |
| --- | --- | --- |
| 1. Local | Git hooks (`pre-commit`, `commit-msg`) | Yes: `git commit --no-verify` |
| 2. Remote | CI on every PR (GitHub Actions) | No, if the check is **mandatory** |
| 3. Merge | *Merge queue* and *auto-merge* | No |

### 7.1 Local hooks

They are scripts in `.git/hooks/`, which **are not versioned**. To share them with the team they are stored in a repository folder and activated with:

```bash
git config core.hooksPath Module02/lab/hooks
```

`pre-commit` runs before creating the commit (fast tests, formatting, secret scanning) and `commit-msg` validates the message. This module includes a [`commit-msg` hook](lab/hooks/commit-msg) that rejects messages outside Conventional Commits. Since hooks are skippable, they work as **immediate help**, not as guarantee: **the guarantee is CI**.

### 7.2 CI as source of truth

A minimal flow that runs tests on every PR (`.github/workflows/ci.yml`):

```yaml
name: ci
on:
  pull_request:
  merge_group:          # needed for the merge queue to run it
jobs:
  tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.12"
      - run: python test_grades.py
```

For this to be a **gate**, the `tests` check must be marked as *mandatory* in the ruleset: one that is not just informs but does not prevent merging. And fix flaky tests: if red does not mean "broken", the team learns to ignore it. The detail of pipelines and continuous deployment is deepened in module 05; here it is about the point of contact with Git.

### 7.3 Merge queue and auto-merge

The problem of semantic conflicts ([section 4.3](#43-five-steps)): two PRs can pass CI **separately** and break `main` **together**. The **merge queue** prevents it: instead of merging directly, GitHub queues the PR, builds a temporary branch with the PR **plus everything already in the queue**, runs CI on that result, and only then merges. That is why the flow needs the `merge_group` event.

**Auto-merge** makes a PR with mandatory checks merge alone when everything is green, without waiting for a button click.

> Availability: the merge queue does not exist in personal account repositories and depends on the organization plan. Check the current documentation before promising it in a demo.

---

## 8. Release management

The syllabus asks to describe how version control helps manage releases. Ingredients:

### 8.1 Tags

An **annotated** tag marks a commit as a version, with author, date, and message:

```bash
git tag -a v1.2.0 -m "Version 1.2.0"
git push origin v1.2.0               # git push alone does NOT send tags
git show v1.2.0
```

*Lightweight* tags (`git tag v1.2.0`) are just a pointer; for versions annotated ones are preferred.

### 8.2 GitHub Releases

A *release* puts notes and downloadable files on a tag:

```bash
gh release create v1.2.0 --generate-notes
```

`--generate-notes` builds notes from merged PRs since the previous version.

### 8.3 From history to version: automate

If commits follow Conventional Commits ([section 3](#3-readable-history-conventional-commits-and-semver)), a tool can read the history since the last tag and decide the version:

| Since the last tag there is... | Bump |
| --- | --- |
| A commit with `!` or `BREAKING CHANGE` | MAJOR |
| A `feat` (and nothing broken) | MINOR |
| Only `fix` | PATCH |

**release-please** (and alternatives like `semantic-release` or `git-cliff`) opens a "release" PR with the next version number and the `CHANGELOG`; merging that PR creates the tag and release. It is the same reviewed flow as always, applied to publishing.

### 8.4 Fixes on already-published versions

When `release/1.4` is maintained and an error appears in `main`: fix it first in `main`, then `git cherry-pick -x <hash>` to the release branch and tag `v1.4.1`. Fixing in `main` first prevents the error from reappearing in the next version.

---

## 9. Supply chain and repository security

A repository does not only contain your code: it also depends on others' and accidentally stores secrets. Three controls, all configurable from GitHub:

| Risk | Control | How |
| --- | --- | --- |
| Dependency with known vulnerability | **Dependabot** (alerts and update PRs) and `dependency-review` action to block PRs that introduce one | `.github/dependabot.yml` |
| Credentials uploaded by mistake | **Secret scanning** and *push protection*, which rejects push before publishing | Repository security settings |
| Commits falsified in someone else's name | **Signed commits** (GPG or SSH), with *Verified* badge and optional rule to require them | `git config commit.gpgsign true` |

Minimal Dependabot example:

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
```

A published secret is considered **compromised even if deleted**: it stays in history and in clones. The correct response is to *revoke and rotate* the credential, not just delete the commit. This topic is deepened in module 07 (quality in production and security).

---

## 10. Lab

The script [`lab/crear-laboratorio.sh`](lab/crear-laboratorio.sh) creates a practice repository with **12 commits** following Conventional Commits. One of them (`perf(grades): use integer division in final_grade`) introduces a silent regression: `final_grade(13, 14, 16)` returns `14` instead of `14.33`. There is a tag `v0.1.0` as the last known-good point.

Requires Git and Python 3. On Windows run from Git Bash.

```bash
bash Module02/lab/crear-laboratorio.sh --lang en
cd grades-lab
```

For the Spanish version (code, commits and messages in Spanish; default directory becomes `laboratorio-notas` and test `test_notas.py`):

```bash
bash Module02/lab/crear-laboratorio.sh laboratorio-notas
cd laboratorio-notas
```

**Part 1: find the regression with `bisect`.**

```bash
python test_grades.py                     # fails
git bisect start HEAD v0.1.0
git bisect run python test_grades.py      # prints: "first bad commit"
git bisect reset
```

**Part 2: an accident and its rescue with `reflog`.**

```bash
git reset --hard HEAD~5                  # "accident": 5 commits lost
git reflog                               # there they still are, with their HEAD@{n}
git reset --hard 'HEAD@{1}'              # recovered
```

**Part 3: fix without rewriting history with `revert`.**

```bash
git revert --no-edit <hash-of-bad-commit>
python test_grades.py                     # now passes
```

**Part 4 (optional): enforce commit format with the hook.**

```bash
mkdir .githooks
cp ../Module02/lab/hooks/commit-msg .githooks/          # adjust path as needed
chmod +x .githooks/commit-msg
git config core.hooksPath .githooks
git commit --allow-empty -m "various fixes"            # rejected
git commit --allow-empty -m "docs: test the hook"      # accepted
git commit --allow-empty --no-verify -m "wip"          # skips hook: that is why CI exists
```

The lab was verified end-to-end, in Spanish and English, with Git 2.46: `bisect` finds the bad commit in 3 steps, `reflog` recovers the 5 commits, and `revert` restores the test to green. The hook shows its messages in English with `LAB_LANG=en`.

---

## 11. Checklist for a team repository

- [ ] `main` protected with a ruleset: PR required, at least 1 approval, no *force push*.
- [ ] Bypass list empty.
- [ ] `CODEOWNERS` file and owner review rule enabled.
- [ ] CI checks **mandatory**, not just informative.
- [ ] PR template and agreed branch names.
- [ ] Conventional Commits, verified by local hook **and** CI.
- [ ] Branches deleted automatically after merge.
- [ ] Merge method agreed (merge, squash, or rebase).
- [ ] Releases with annotated tags and generated `CHANGELOG`.
- [ ] Dependabot, secret scanning, and push protection enabled.
- [ ] Everyone knows how to recover: `reflog`, `revert`, `bisect`.

---

## References

1. Driessen, V. (2010, updated 2020). *A successful Git branching model*. https://nvie.com/posts/a-successful-git-branching-model/
2. Conventional Commits. *Conventional Commits 1.0.0*. https://www.conventionalcommits.org/
3. Preston-Werner, T. *Semantic Versioning 2.0.0*. https://semver.org/
4. Forsgren, N., Humble, J., and Kim, G. (2018). *Accelerate: The Science of Lean Software and DevOps*. IT Revolution Press.
5. Cohen, J. (2006). *Best Kept Secrets of Peer Code Review*. SmartBear Software.
6. Kim, G. et al. (2021). *The DevOps Handbook* (2nd ed.). IT Revolution Press. (Syllabus reading, Unit 2.)
7. Chacon, S. and Straub, B. (2014). *Pro Git* (2nd ed.). Apress. https://git-scm.com/book/en/v2
8. Git. *Reference documentation*: [git-bisect](https://git-scm.com/docs/git-bisect), [git-reflog](https://git-scm.com/docs/git-reflog), [git-reset](https://git-scm.com/docs/git-reset), [git-rebase](https://git-scm.com/docs/git-rebase), [git-worktree](https://git-scm.com/docs/git-worktree), [githooks](https://git-scm.com/docs/githooks).
9. GitHub. *GitHub Docs*: [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow), [Rulesets](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-rulesets/about-rulesets), [CODEOWNERS](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features-customizing-your-repository/about-code-owners), [Merge queue](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue), [Dependabot](https://docs.github.com/en/code-security/dependabot), [Releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases).
10. Cuadros-Vargas, E. *Software Quality* (course material). https://ecuadros.github.io/SoftwareQuality/
