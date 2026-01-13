# Firebase CLI "Command Not Found" Fix

If you get "command not found" after installing firebase-tools, here are solutions:

## Quick Fix: Use npx (Recommended)

Instead of `firebase`, use `npx firebase-tools`:

```bash
npx firebase-tools login
npx firebase-tools init hosting
npx firebase-tools deploy --only hosting
```

This works without installing globally!

## Alternative: Fix Global Installation

### Option 1: Install Globally (Fix PATH)

1. **Check npm prefix:**
```bash
npm config get prefix
```

2. **If it shows a local directory (like `.npm-global`), reset it:**
```bash
npm config set prefix /usr/local
# or for Homebrew on macOS:
npm config set prefix /opt/homebrew
```

3. **Reinstall globally:**
```bash
npm install -g firebase-tools
```

4. **Verify installation:**
```bash
which firebase
firebase --version
```

### Option 2: Add npm bin to PATH

If npm installs to a custom location, add it to your PATH:

1. **Find npm's bin directory:**
```bash
npm config get prefix
# Output example: /Users/yourname/.npm-global
```

2. **Add to PATH (add to ~/.zshrc or ~/.bash_profile):**
```bash
export PATH="$PATH:$(npm config get prefix)/bin"
```

3. **Reload shell:**
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

4. **Verify:**
```bash
firebase --version
```

### Option 3: Use Homebrew (macOS)

```bash
brew install firebase-cli
firebase --version
```

## Recommended: Use npx

**Easiest solution:** Just use `npx firebase-tools` instead of `firebase`. No PATH issues!

Examples:
- `npx firebase-tools login`
- `npx firebase-tools init hosting`
- `npx firebase-tools deploy`

