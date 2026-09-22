const PptxGenJS = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const prs = new PptxGenJS();
prs.defineLayout({ name: "LAYOUT1", width: 10, height: 7.5 });
prs.defineLayout({ name: "LAYOUT2", width: 10, height: 7.5 });

const COLORS = {
  INK: "#161B22",
  ORANGE: "#F05133",
  BLUE: "#2F6FED",
  GREEN: "#1F9D6B",
};

prs.defineLayout({ name: "default", width: 10, height: 7.5 });

// Helper to add title-body slide
function addSlide(title, body, notes = "") {
  const slide = prs.addSlide();
  if (notes) slide.addNotes({ text: notes });

  slide.background = { color: "FFFFFF" };
  slide.addShape(prs.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 1,
    fill: { color: COLORS.INK },
    line: { type: "none" },
  });
  slide.addText(title, {
    x: 0.5,
    y: 0.2,
    w: 9,
    h: 0.6,
    fontSize: 28,
    bold: true,
    color: "FFFFFF",
    fontFace: "Calibri",
  });

  const bodyY = 1.3;
  const bodyH = 5.7;
  if (Array.isArray(body)) {
    body.forEach((item, i) => {
      const y = bodyY + i * 0.7;
      slide.addText(item, {
        x: 0.75,
        y: y,
        w: 8.5,
        h: 0.6,
        fontSize: 14,
        color: COLORS.INK,
        fontFace: "Calibri",
      });
    });
  } else {
    slide.addText(body, {
      x: 0.75,
      y: bodyY,
      w: 8.5,
      h: bodyH,
      fontSize: 14,
      color: COLORS.INK,
      fontFace: "Calibri",
    });
  }
}

// Slide 1: Title
const slide1 = prs.addSlide();
slide1.background = { color: COLORS.INK };
slide1.addNotes({
  text: "Welcome everyone. Today we cover advanced Git and GitHub collaborative workflow for CS395 Software Quality. We will discuss version control models, branching strategies, how to write maintainable commit history, integration, automation, and releases. Time: 30 minutes total.",
});
slide1.addText("Advanced Git/GitHub and Collaborative Workflow", {
  x: 0.5,
  y: 2.5,
  w: 9,
  h: 1.5,
  fontSize: 44,
  bold: true,
  color: "FFFFFF",
  fontFace: "Calibri",
  align: "center",
});
slide1.addText("CS395 Software Quality · UNI · 2026-II", {
  x: 0.5,
  y: 4.2,
  w: 9,
  h: 0.6,
  fontSize: 18,
  color: COLORS.ORANGE,
  fontFace: "Calibri",
  align: "center",
});
slide1.addText("Team B: Huamán, Limache, Quispe", {
  x: 0.5,
  y: 5,
  w: 9,
  h: 0.5,
  fontSize: 14,
  color: COLORS.BLUE,
  fontFace: "Calibri",
  align: "center",
});

// Slide 2: Agenda
const slide2 = prs.addSlide();
slide2.background = { color: "FFFFFF" };
slide2.addNotes({
  text: "Overview of the three main blocks: Fundamentals (10 min), Team Workflow (8 min), and Quality & Delivery (10 min), plus margin for Q&A.",
});
slide2.addShape(prs.ShapeType.rect, {
  x: 0,
  y: 0,
  w: "100%",
  h: 1,
  fill: { color: COLORS.INK },
  line: { type: "none" },
});
slide2.addText("Agenda", {
  x: 0.5,
  y: 0.2,
  w: 9,
  h: 0.6,
  fontSize: 28,
  bold: true,
  color: "FFFFFF",
  fontFace: "Calibri",
});
const agenda = [
  "Block A: Fundamentals and Recovery (10 min)",
  "  • Git model, advanced tools, bisect demo",
  "",
  "Block B: Team Workflow (8 min)",
  "  • Branches, commits, merge strategies",
  "",
  "Block C: Quality and Delivery (10 min)",
  "  • PR, CI/CD, releases, security",
  "",
  "Margin and Q&A (2 min)",
];
agenda.forEach((item, i) => {
  slide2.addText(item, {
    x: 0.75,
    y: 1.3 + i * 0.45,
    w: 8.5,
    h: 0.4,
    fontSize: 13,
    color: COLORS.INK,
    fontFace: "Calibri",
  });
});

// BLOCK A: FUNDAMENTALS
// Slide 3: Why it matters
addSlide(
  "Quality is built in, not tested in",
  [
    "• Small changes → easier to review",
    "• Double control: human + machine",
    "• Readable history = documentation + traceability",
    "• Frequent integration = cheap merges",
    "",
    "Metric impact: Accelerate [4] links good Git workflow to",
    "deployment frequency, lead time, failure rate, recovery time",
  ],
  "Small, frequent changes with automated verification are what separate high performers from low performers. The Accelerate book quantifies this."
);

// Slide 4: Centralized vs Distributed
addSlide(
  "Version control: two models",
  [
    "Centralized (Subversion, CVS):",
    "  One server, all commits are public immediately",
    "",
    "Distributed (Git, Mercurial):",
    "  Complete history in every clone, separate commit (local) from push (share)",
    "",
    "Git advantage: work offline, rebase locally, then publish clean",
  ],
  "The separation between recording and sharing is the foundation of branching, small commits, and the entire workflow we build on top."
);

// Slide 5: Git internals
addSlide(
  "Inside Git: blobs, trees, commits, tags",
  [
    "Snapshots identified by content hash (SHA-1):",
    "  blob → file content",
    "  tree → directory listing",
    "  commit → tree + parents + author + message",
    "  tag → labeled commit",
    "",
    "Branch = 41-byte file containing one commit hash",
    "Consequence: branching is cheap, commits are immutable",
  ],
  "This is why 'missing' commits after a reset can be recovered from reflog, and why rewriting published history is risky—it changes hashes."
);

// Slide 6-8: Block A section on bisect, reflog, revert
addSlide(
  "git bisect: binary search for the culprit",
  [
    "Automated search through history to find where a bug entered:",
    "  git bisect start HEAD v0.1.0  (bad = HEAD, good = tag)",
    "  git bisect run python test_grades.py",
    "",
    "With 1000 commits: ~10 tests. With 12 commits: 3–4 tests.",
    "",
    "Only works if tests are reliable.",
    "Example: find integer division regression in 3 steps.",
  ],
  "This is the power of automated tests: they turn a mystery of hours into a binary search of minutes. This is why we demo it in the lab."
);

addSlide(
  "git reflog: recovery after disaster",
  [
    "Records every HEAD movement, even after reset --hard:",
    "  git reset --hard HEAD~5     (oops, lost 5 commits!)",
    "  git reflog                  (there they still are)",
    "  git reset --hard HEAD@{1}   (recovered)",
    "",
    "Local only, expires in 90 days (reachable) or 30 (orphaned).",
    "Good for recent accidental losses, not as backup strategy.",
  ],
  "Reflog is your safety net. Always look here first after any scary git command."
);

addSlide(
  "git revert: undo without rewriting",
  [
    "For published commits, never rewrite. Instead, create inverse:",
    "  git revert <bad-hash>  (new commit that undoes it)",
    "",
    "For unpublished: can rewrite with reset, amend, rebase",
    "",
    "Rule: shared = new commits (revert), local = rewrite (amend, rebase)",
    "",
    "Demo in lab: revert the regression, test passes again.",
  ],
  "This is key: published history stays, unpublished can be cleaned up. It prevents forcing teams to re-coordinate."
);

// BLOCK B: TEAM WORKFLOW
// Slide 9: Branching strategies intro
addSlide(
  "Branching strategies: the agreement",
  [
    "Not about technology, it's about team discipline.",
    "What branches exist? How long? How to reach main?",
    "",
    "Three main strategies:",
    "  1. GitHub Flow: main + short branches, continuous deploy",
    "  2. Trunk-based: everyone integrates to main daily",
    "  3. GitFlow: long-lived release branches",
    "",
    "Key metric: branch lifetime. Longer = more merge pain.",
  ],
  "GitFlow is default in many tutorials but adds ceremony for continuous delivery. GitHub Flow is simpler for services."
);

addSlide(
  "GitHub Flow: simple and effective",
  [
    "1. Create branch from main",
    "2. Commit and push",
    "3. Open PR, describe what and why",
    "4. Get review + automated checks pass",
    "5. Merge (closes PR, delete branch)",
    "6. Deploy",
    "",
    "Only main + feature branches, main always deployable.",
    "Scales with small-to-medium teams.",
  ],
  "This is what most modern startups and open source projects use. It is simple and aligns with continuous delivery."
);

addSlide(
  "Conventional Commits: history you can parse",
  [
    "Format: type(scope): description",
    "  feat(grades): add practice average",
    "  fix(grades): correct integer division",
    "  docs: add lab instructions",
    "  feat(api)!: remove v1 endpoint  (breaking)",
    "",
    "Benefits:",
    "  • Automated changelog and version bump",
    "  • Searchable history (git log --grep=feat)",
    "  • Clear what changed and why",
  ],
  "If you follow this format, tools like release-please can automatically determine MAJOR/MINOR/PATCH version."
);

addSlide(
  "SemVer: MAJOR.MINOR.PATCH",
  [
    "Signals breaking changes to users and tools:",
    "  MAJOR: incompatibility (0→1, v1→v2)",
    "  MINOR: new feature, backward compatible",
    "  PATCH: bug fix",
    "",
    "Connection to Conventional Commits:",
    "  feat → MINOR, fix → PATCH, breaking (!) → MAJOR",
    "",
    "Versions 0.y.z are pre-release, nothing is stable yet.",
  ],
  "This is why parsing commits matters: the version number is not arbitrary, it is calculated from the changelog."
);

// Slide 12: The 'and' rule
addSlide(
  "The 'and' rule: one commit, one reason",
  [
    "If your message needs 'and', split into two commits:",
    "  Bad: feat(grades): add average AND pass check",
    "  Good: Two commits, each reversible alone",
    "",
    "Each commit should be revertible without side effects.",
    "",
    "Use git add -p to stage changes in pieces.",
  ],
  "Small, focused commits are easier to review, easier to bisect, and easier to revert if something goes wrong."
);

// Slide 13: Integrating changes
addSlide(
  "merge vs rebase vs squash",
  [
    "merge: keeps branch structure, adds merge commit",
    "rebase: replays your commits on top, linear history",
    "squash: one new commit, loses intermediate detail",
    "",
    "Choice:",
    "  GitHub Flow usually: squash (one PR = one feature commit)",
    "  Trunk-based: merge (preserve authorship)",
    "  For hot fixes: cherry-pick (copy one commit to release branch)",
  ],
  "All three are valid. The decision should be documented in your CONTRIBUTING.md and enforced in GitHub settings."
);

// Slide 14: Conflicts
addSlide(
  "Resolving conflicts: five steps",
  [
    "1. Decide which version is right",
    "2. Edit the file",
    "3. git add <file>",
    "4. git commit (or git rebase --continue)",
    "5. Test before pushing",
    "",
    "Types: textual (Git detects), semantic (Git misses, tests catch)",
    "Prevention: short branches, code ownership, one formatter",
  ],
  "Step 5 is crucial. Git only sees text—it cannot detect if both sides renamed a function, code compiles but wrong logic, etc."
);

// BLOCK C: QUALITY AND DELIVERY
// Slide 15: Pull requests
addSlide(
  "Pull requests: the quality gate",
  [
    "Two controls, both required:",
    "  Human review: understands problem, catches design issues",
    "  CI: compiles, tests pass, no regressions",
    "",
    "A good PR is small (200–400 lines), focused, self-reviewed",
    "",
    "Recorded: who merged, who reviewed, which checks passed → traceability",
  ],
  "If a defect slips through, the cost grows every day. Catching it here, before main, is where the ROI is highest."
);

// Slide 16: Repository rules
addSlide(
  "Branch protection: rulesets",
  [
    "GitHub rulesets enforce rules at merge time:",
    "  ✓ Require PR (dismiss old approvals on new commits)",
    "  ✓ Min 1 approval",
    "  ✓ Require CODEOWNERS review",
    "  ✓ Mandatory CI checks",
    "  ✓ No force push",
    "",
    "Defined once, enforced always. No ritual without teeth.",
  ],
  "A branch protection rule is worthless if the CI check is optional or if anyone can bypass it. Make the critical ones non-bypassable."
);

// Slide 17: CODEOWNERS
addSlide(
  "CODEOWNERS: who reviews what",
  [
    "File: .github/CODEOWNERS",
    "Example:",
    "  *              @team/everyone",
    "  /src/grades/   @alice @team/quality",
    "  *.sql          @team/database",
    "",
    "Last match wins. Combined with 'require CODEOWNERS review' rule.",
    "Avoids review bottlenecks and clarifies accountability.",
  ],
  "Small teams might have one owner (yourself). Larger teams split by domain. The rule prevents merging without that person's approval."
);

// Slide 18: Hooks
addSlide(
  "Automation layer 1: Git hooks",
  [
    "Local, before push:",
    "  pre-commit: fast tests, lint, secret scanning",
    "  commit-msg: enforce Conventional Commits format",
    "",
    "Stored in repo (not .git/hooks), activated once per clone:",
    "  git config core.hooksPath Module02/lab/hooks",
    "",
    "Skippable: git commit --no-verify",
    "Purpose: immediate feedback, not guarantee.",
  ],
  "Hooks are a convenience for developers. The real guarantee is CI, which cannot be skipped."
);

// Slide 19: CI
addSlide(
  "Automation layer 2: CI (source of truth)",
  [
    "Runs on every PR, must be mandatory to be effective:",
    "  • Compile, test, lint",
    "  • Report results before merge",
    "  • If red, do not merge (unless explicitly overridden)",
    "",
    "Config: .github/workflows/ci.yml",
    "Event: pull_request, merge_group (for merge queue)",
  ],
  "If the CI is optional or ignored, the team learns to distrust it and it becomes useless. Make the critical checks mandatory."
);

// Slide 20: Merge queue
addSlide(
  "Automation layer 3: merge queue",
  [
    "Problem: two PRs pass CI separately, fail together",
    "Solution: queue, build temp branch with PR + queue, run CI",
    "",
    "GitHub queues PR → builds PR + everything before it → CI",
    "Only then merges",
    "",
    "Prevents the 'semantic conflict' (no text conflict, code broken)",
  ],
  "This is a newer feature (2023+) but becoming standard. Not available on personal accounts, requires org plan."
);

// Slide 21: Tags
addSlide(
  "Version management: tags",
  [
    "Annotated tag marks a release:",
    "  git tag -a v1.2.0 -m 'Version 1.2.0'",
    "  git push origin v1.2.0",
    "",
    "Includes author, date, message (unlike lightweight tags)",
    "",
    "Paired with GitHub Releases for notes and downloads:",
    "  gh release create v1.2.0 --generate-notes",
  ],
  "The notes can be auto-generated from PRs, forming a changelog."
);

// Slide 22: Semantic release
addSlide(
  "From commits to version: automate",
  [
    "If Conventional Commits are followed, version is calculable:",
    "  Breaking change (!) → MAJOR",
    "  feat → MINOR",
    "  fix → PATCH",
    "",
    "Tool: release-please, semantic-release, or git-cliff",
    "Opens PR with new version + CHANGELOG, merge to create tag",
  ],
  "This closes the loop: commit format drives version bump, which drives release. No manual version decision needed."
);

// Slide 23: Security
addSlide(
  "Security: three layers",
  [
    "1. Dependabot: alert on vulnerable dependencies",
    "   .github/dependabot.yml",
    "",
    "2. Secret scanning + push protection",
    "   Blocks commits with leaked keys",
    "",
    "3. Signed commits (GPG/SSH)",
    "   Prevents impersonation",
  ],
  "A secret pushed is a compromised secret, even if deleted. Rotate keys, do not just delete the commit."
);

// Slide 24: Lab walkthrough
addSlide(
  "Lab: practice with real scenarios",
  [
    "Script: bash Module02/lab/crear-laboratorio.sh --lang en",
    "",
    "Part 1 (bisect): Find regression in 3 steps",
    "Part 2 (reflog): Recover lost commits",
    "Part 3 (revert): Fix without rewriting",
    "Part 4 (hooks): Enforce Conventional Commits",
    "",
    "All tested with Git 2.46 in English and Spanish.",
  ],
  "This is hands-on. Run these commands as we speak, watch the output. This is where understanding shifts to skill."
);

// Slide 25: Checklist
addSlide(
  "Checklist: a team repository",
  [
    "☐ main protected (PR required, 1 approval, no force push)",
    "☐ CODEOWNERS + review rule",
    "☐ Mandatory CI checks",
    "☐ Conventional Commits (hook + CI)",
    "☐ Auto-delete branches",
    "☐ Dependabot + secret scanning",
    "☐ Everyone knows bisect, reflog, revert",
  ],
  "This checklist distills governance into essentials. Start here, add rules if the team needs them."
);

// Slide 26: Closing
const slideEnd = prs.addSlide();
slideEnd.background = { color: COLORS.INK };
slideEnd.addNotes({
  text: "Wrap up: quality is not added later, it is built into how changes enter the code. The workflow we covered—branches, commits, review, CI, release—is what makes that possible. Thank you for your attention.",
});
slideEnd.addText("Quality is built in, not tested in", {
  x: 0.5,
  y: 2.5,
  w: 9,
  h: 1.5,
  fontSize: 44,
  bold: true,
  color: "FFFFFF",
  fontFace: "Calibri",
  align: "center",
});
slideEnd.addText("Follow the workflow. Trust the process. Automate the gates.", {
  x: 0.5,
  y: 4.2,
  w: 9,
  h: 1,
  fontSize: 18,
  color: COLORS.ORANGE,
  fontFace: "Calibri",
  align: "center",
});
slideEnd.addText("Thank you", {
  x: 0.5,
  y: 5.5,
  w: 9,
  h: 0.6,
  fontSize: 16,
  color: COLORS.BLUE,
  fontFace: "Calibri",
  align: "center",
});

const outputDir = path.join(__dirname, "..", "..", "presentacion");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
const outputFile = path.join(outputDir, "Modulo02-Git-GitHub-Avanzado-en.pptx");
prs.writeFile({ fileName: outputFile });
console.log(`✓ English presentation generated: ${outputFile}`);
