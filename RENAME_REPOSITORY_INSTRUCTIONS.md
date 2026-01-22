# Repository Rename Instructions for Vercel Deployment

## Problem
Vercel deployment error: "The name contains invalid characters. Only letters, digits, and underscores are allowed. Furthermore, the name should not start with a digit."

## Solution
Rename the GitHub repository from `laurinos-manager-display` to `laurinos_manager_display`

---

## Step 1: Rename the GitHub Repository (Manual Action Required)

Since the GitHub API requires authentication, you'll need to manually rename the repository:

1. Go to: https://github.com/ChompskyHonk1/laurinos-manager-display/settings
2. Scroll down to the "Repository name" section
3. Change the name from `laurinos-manager-display` to `laurinos_manager_display`
4. Click "Rename"
5. GitHub will redirect you to the new URL: https://github.com/ChompskyHonk1/laurinos_manager_display

---

## Step 2: Update Local Git Remote (Run These Commands)

After renaming the repository on GitHub, update your local git remote:

```bash
# Change to your project directory
cd "/home/slimjim/Downloads/Lauinos Display"

# Update the remote URL to point to the renamed repository
git remote set-url origin git@github.com:ChompskyHonk1/laurinos_manager_display.git

# Verify the change
git remote -v
```

Expected output should show:
```
origin	git@github.com:ChompskyHonk1/laurinos_manager_display.git (fetch)
origin	git@github.com:ChompskyHonk1/laurinos_manager_display.git (push)
```

---

## Step 3: Push Changes (If Needed)

If you have any unpushed changes, push them to the renamed repository:

```bash
# Push all branches to the new remote
git push -u origin --all
git push -u origin --tags
```

---

## Step 4: Deploy to Vercel

Now you can deploy to Vercel with the valid repository name:

### Option A: Deploy via Vercel CLI
```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy to Vercel
vercel
```

### Option B: Deploy via Vercel Dashboard
1. Go to: https://vercel.com/new
2. Import your GitHub repository: `laurinos_manager_display`
3. Configure project settings (Framework Preset: "Other", Build Command: leave empty, Output Directory: "./")
4. Click "Deploy"

---

## Summary of Changes

- **Old repository name:** `laurinos-manager-display` (contains hyphens - invalid for Vercel)
- **New repository name:** `laurinos_manager_display` (uses underscores - valid for Vercel)
- **GitHub URL:** https://github.com/ChompskyHonk1/laurinos_manager_display

The repository will remain public and all commit history will be preserved.

---

## Verification

After completing these steps, verify:
1. The GitHub repository URL shows the new name with underscores
2. `git remote -v` shows the updated remote URL
3. You can successfully deploy to Vercel without the invalid characters error
