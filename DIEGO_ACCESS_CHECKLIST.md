# Diego GitHub Access — Verification Checklist

> **Purpose:** Confirm Diego has full working access to the RolPlay repository for long-term maintenance.

---

## Step 1 — Grant Repository Access

**Repository owner action required:**

1. Go to: `https://github.com/RahulAIML/rolplay_optimization`
2. Navigate to: **Settings → Collaborators → Add people**
3. Search for Diego's GitHub username
4. Set permission level: **`Write`** (minimum) or **`Maintain`** (recommended)
5. Click **"Add collaborator"**
6. Diego will receive an email invitation — he must accept it

---

## Step 2 — Diego Verification Steps

Diego should run each command and confirm it succeeds:

### 2.1 — Clone repository
```bash
git clone https://github.com/RahulAIML/rolplay_optimization.git
cd rolplay_optimization/target
```
✅ Pass: Folder cloned successfully  
❌ Fail: "Permission denied" or "Repository not found" → Re-check collaborator invitation was accepted

---

### 2.2 — Pull latest code
```bash
git pull origin main
```
✅ Pass: "Already up to date" or files updated  
❌ Fail: Authentication error → Configure Git credentials (see Step 3)

---

### 2.3 — Create a test branch
```bash
git checkout -b test/diego-access-check
```
✅ Pass: Switched to new branch  
❌ Fail: Should not happen if clone worked

---

### 2.4 — Make a test commit
```bash
echo "# Access verified" >> ACCESS_TEST.md
git add ACCESS_TEST.md
git commit -m "test: verify Diego write access"
```
✅ Pass: Commit created  
❌ Fail: Check git config (name + email)

---

### 2.5 — Push branch to remote
```bash
git push origin test/diego-access-check
```
✅ Pass: Branch visible at `https://github.com/RahulAIML/rolplay_optimization/branches`  
❌ Fail: "Permission denied" → `Write` permission not granted or invitation not accepted

---

### 2.6 — Create a Pull Request
1. Go to repository on GitHub
2. Click **"Compare & pull request"** on the pushed branch
3. Fill in title and description
4. Click **"Create pull request"**

✅ Pass: PR created and visible in `https://github.com/RahulAIML/rolplay_optimization/pulls`  
❌ Fail: No "Create PR" button → check permissions

---

### 2.7 — Clean up test branch
```bash
# After PR is closed/merged, delete the test branch
git push origin --delete test/diego-access-check
git checkout main
git branch -d test/diego-access-check
```
✅ Pass: Branch deleted  

---

### 2.8 — Verify Vercel deployment visibility (Optional)
1. Diego should be added to Vercel team (if applicable)
2. Or be given read-only access to deployment logs
3. Required only if Diego will manage deployments directly

---

## Step 3 — Git Credential Configuration (Diego's machine)

```bash
# Set identity
git config --global user.name "Diego [Last Name]"
git config --global user.email "diego@rolplay.ai"

# Authenticate via GitHub CLI (recommended)
gh auth login
# Or use Personal Access Token (PAT):
# Generate at: https://github.com/settings/tokens
# Scope required: repo (full)
```

---

## Permission Levels — Recommendation

| Level | Can do | Recommended for |
|---|---|---|
| `Read` | Clone, pull, view | Auditors / stakeholders |
| `Triage` | Above + manage issues | Project managers |
| `Write` | Above + push branches, create PRs | **Minimum for developers** |
| `Maintain` | Above + manage settings, merge PRs | **Recommended for Diego** |
| `Admin` | Full control including deletion | Repository owner only |

**Recommendation:** Grant Diego `Maintain` access. This allows him to:
- Push code
- Merge pull requests
- Manage branch protection rules
- Without the risk of deleting the repository

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Diego pushes directly to `main` | Medium | High (breaks production) | Enable branch protection: require PR + 1 review |
| Credentials leaked in commit | Low | Critical | Add `.env` to `.gitignore`; use Vercel env vars |
| Diego loses access | Low | Medium | Document credentials; ensure owner backup access |
| Force-push overwrites history | Low | High | Enable "Disallow force pushes" in branch settings |

---

## Branch Protection Recommendation

Set in: `GitHub → Settings → Branches → Add rule → Branch: main`

- ✅ Require a pull request before merging
- ✅ Require at least 1 approving review
- ✅ Dismiss stale reviews when new commits are pushed
- ✅ Do not allow bypassing the above settings
- ✅ Restrict who can push to matching branches → Add Diego + owner

---

## Access Verification Sign-off

| Step | Status | Date | Notes |
|---|---|---|---|
| Invitation sent | ☐ | | |
| Invitation accepted | ☐ | | |
| Clone successful | ☐ | | |
| Push successful | ☐ | | |
| PR created | ☐ | | |
| Test branch deleted | ☐ | | |
| Vercel access (optional) | ☐ | | |

**Verified by:** _________________ **Date:** _________________
