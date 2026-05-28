# Hrana Mea - cPanel Auto-Deploy Setup

## Architecture

```
💻 VS Code (local)    →    ☁️ GitHub    →    🖥️ cPanel VPS (hranamea.ro)
    git push               DeadRyan/         auto-pulls via Git Version Control
                           hranamea          then restarts Node.js
```

---

## How It Works

### 1. cPanel Git™ Version Control

cPanel has a built-in tool that clones your GitHub repo and keeps it synced.

**Setup (one-time in cPanel):**

1. Go to **cPanel → Files → Git™ Version Control**
2. Click **Create**
3. Fill in:
   - **Clone URL:** `https://github.com/DeadRyan/hranamea.git`
   - **Repository Path:** `/home/hranamea/public_html/nodeapp`
   - **Repository Name:** `hranamea`
4. Click **Create**

### 2. Auto-Deploy Webhook

After the repo is created, cPanel can automatically pull changes when you push to GitHub.

**In the same Git Version Control page:**

- Click **Manage** on your repository
- Look for **"Deploy HEAD Commit"** or webhook URL option
- Copy the webhook URL

**On GitHub (Settings → Webhooks):**

- Add webhook → paste the cPanel webhook URL
- Content type: `application/json`
- Trigger: **Just the push event**

Now every `git push` → GitHub → cPanel auto-pulls → Node.js restarts

### 3. Post-Deploy Restart

cPanel can also trigger a script after each pull. Create a `.cpanel.yml` file:

```yaml
---
deployment:
  tasks:
    - export DEPLOYPATH=/home/hranamea/public_html/nodeapp
    - /bin/cp -R * $DEPLOYPATH
    - cd $DEPLOYPATH && npm install --production
    # Restart Node app (cPanel-specific command)
    - /usr/local/cpanel/scripts/restart_node_app hranamea
```

Place this file in your GitHub repo root.

---

## Daily Workflow

```bash
# 1. Make changes locally in VS Code
# 2. Commit and push
git add .
git commit -m "description of changes"
git push origin master

# 3. cPanel auto-deploys — done!
```

---

## ⚠️ Important: .env File

The `.env` file is **gitignored** — it will NEVER sync via GitHub.

| File                  | Synced via GitHub? | How to update on VPS             |
| --------------------- | ------------------ | -------------------------------- |
| `routes/ai-routes.js` | ✅ Yes             | Auto-deploy                      |
| `public/*`            | ✅ Yes             | Auto-deploy                      |
| `server.js`           | ✅ Yes             | Auto-deploy                      |
| `.env`                | ❌ No (gitignored) | Manually via cPanel File Manager |

To update `.env` on the VPS: **File Manager → Upload** the file directly.

---

## Manual Fallback (if auto-deploy breaks)

1. **cPanel → File Manager → Upload** the changed files
2. **Setup Node.js App → Restart**
