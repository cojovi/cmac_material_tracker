#!/bin/bash

# Secret scanning script - prevents committing sensitive data
# This runs before git commits to catch secrets

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Scanning for exposed secrets..."

# Files to exclude from scanning
EXCLUDE_PATTERNS="node_modules|dist|\.git|package-lock\.json|\.DS_Store"

# Patterns to detect secrets
SECRET_PATTERNS=(
  # JWT tokens (Supabase, Auth0, etc.)
  "eyJ[a-zA-Z0-9_-]{100,}"
  # API keys
  "sk-[a-zA-Z0-9]{32,}"
  "AIza[0-9A-Za-z_-]{35}"
  "AKIA[0-9A-Z]{16}"
  # GitHub tokens
  "ghp_[a-zA-Z0-9]{36,}"
  "github_pat_[a-zA-Z0-9]{22}_[a-zA-Z0-9]{59,}"
  # Slack tokens
  "xox[baprs]-[0-9]{12}-[0-9]{12}-[a-zA-Z0-9]{32}"
  # Generic long base64-like strings (potential secrets)
  "[A-Za-z0-9+/]{40,}={0,2}"
)

FOUND_SECRETS=0
FILES_TO_CHECK=$(git diff --cached --name-only --diff-filter=ACM | grep -vE "$EXCLUDE_PATTERNS")

if [ -z "$FILES_TO_CHECK" ]; then
  echo -e "${GREEN}✓ No files to check${NC}"
  exit 0
fi

for file in $FILES_TO_CHECK; do
  if [ ! -f "$file" ]; then
    continue
  fi
  
  for pattern in "${SECRET_PATTERNS[@]}"; do
    # Check for secrets but exclude common false positives
    matches=$(grep -iE "$pattern" "$file" 2>/dev/null | grep -vE "sha512|sha256|integrity|node_modules" | head -5)
    
    if [ ! -z "$matches" ]; then
      echo -e "${RED}❌ SECRET DETECTED in: $file${NC}"
      echo -e "${YELLOW}Pattern: $pattern${NC}"
      echo "$matches" | sed 's/^/  /'
      echo ""
      FOUND_SECRETS=1
    fi
  done
  
  # Check for common secret variable patterns with actual values
  if grep -qiE "(SUPABASE_SERVICE_ROLE_KEY|SUPABASE_ANON_KEY|DATABASE_URL|SLACK_BOT_TOKEN|SESSION_SECRET|API_KEY|SECRET|PASSWORD|TOKEN)\s*=\s*(eyJ|sk-|xox|ghp_|http)" "$file" 2>/dev/null; then
    echo -e "${RED}❌ POTENTIAL SECRET in: $file${NC}"
    echo -e "${YELLOW}Found environment variable with what looks like a real secret value${NC}"
    grep -iE "(SUPABASE_SERVICE_ROLE_KEY|SUPABASE_ANON_KEY|DATABASE_URL|SLACK_BOT_TOKEN|SESSION_SECRET|API_KEY|SECRET|PASSWORD|TOKEN)\s*=\s*(eyJ|sk-|xox|ghp_|http)" "$file" | head -3 | sed 's/^/  /'
    echo ""
    FOUND_SECRETS=1
  fi
done

if [ $FOUND_SECRETS -eq 1 ]; then
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  echo -e "${RED}🚨 BLOCKED: Secrets detected in staged files!${NC}"
  echo -e "${YELLOW}Please remove all secrets before committing.${NC}"
  echo -e "${YELLOW}Use placeholders like 'your-key-here' in documentation.${NC}"
  echo -e "${RED}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
  exit 1
fi

echo -e "${GREEN}✓ No secrets detected${NC}"
exit 0

