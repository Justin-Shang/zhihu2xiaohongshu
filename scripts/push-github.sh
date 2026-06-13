#!/bin/bash
set -e

REPO_URL="https://Justin-Shang:${GITHUB_TOKEN}@github.com/Justin-Shang/zhihu2xiaohongshu.git"

# Add or update the github remote
if git remote get-url github &>/dev/null; then
  git remote set-url github "$REPO_URL"
else
  git remote add github "$REPO_URL"
fi

echo "→ 推送到 GitHub..."
git push github main

echo "✅ 推送成功！"
echo "   https://github.com/Justin-Shang/zhihu2xiaohongshu"
