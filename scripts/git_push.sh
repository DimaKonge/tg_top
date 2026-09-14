#!/bin/bash
if [ -z "$1" ]; then
  echo "Usage: ./scripts/git_push.sh <github_token> <repo_owner/repo_name>"
  exit 1
fi
TOKEN=$1
REPO=$2
git remote add origin "https://${TOKEN}@github.com/${REPO}.git"
git push -u origin master
