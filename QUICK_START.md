# Quick Start Guide

## ⚠️ Important: Run from Correct Directory

You must be in the **project directory** to run the development server.

### Correct Command:

```powershell
# Navigate to project directory first
cd "C:\Code\Nat Ford Planning\nfpa-website"

# Then start the dev server
npm run dev
```

### Common Error:

If you see:
```
npm error enoent Could not read package.json
```

This means you're in the wrong directory. Always `cd` to `C:\Users\nfred\nfpa-website` first!

---

## Full Startup Sequence

```powershell
# 1. Open PowerShell/Terminal

# 2. Navigate to project
cd C:\Users\nfred\nfpa-website

# 3. Start development server
npm run dev

# 4. Open browser to:
# http://localhost:3000
```

---

## View Your Updated Pages

All these URLs are now live with your resume information:

- **Homepage**: http://localhost:3000
- **About (UPDATED)**: http://localhost:3000/about
- **Services**: http://localhost:3000/services
- **Projects**: http://localhost:3000/projects
- **Resources**: http://localhost:3000/resources
- **Process**: http://localhost:3000/process
- **FAQ**: http://localhost:3000/faq
- **Contact**: http://localhost:3000/contact

---

## What's Been Updated

### About Page - Major Updates ✨
- ✅ **Education**: MUP from SJSU, B.A. from SFSU
- ✅ **Experience**: Accurate 8+ years
- ✅ **Credentials**: FAA Part 107, APA affiliations
- ✅ **Phone**: 530.492.9775
- ✅ **Projects**: Expanded from 6 to 12 examples
- ✅ **Counties**: Expanded from 13 to 16
- ✅ **New Section**: Education & Credentials cards

### Key Changes
- Employment dates: 2021-2025 at Green DOT
- Professional roles: SVS APA Sponsorship Director, Technical Lead
- Grant expertise prominently featured
- Community engagement and rural planning focus
- All project names and counties from your actual resume

---

## Stop the Server

When you're done testing:

```powershell
# Press Ctrl+C in the terminal where npm run dev is running
```

---

## Troubleshooting

### Port 3000 Already in Use

```powershell
# Find and stop the process
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# Then restart
npm run dev
```

### Need to Reinstall Dependencies

```powershell
cd C:\Users\nfred\nfpa-website
npm install
```

---

## Next Actions

1. **Test the site**: Navigate to http://localhost:3000/about
2. **Review biography**: Check education, credentials, projects
3. **Verify contact info**: Phone number, email, LinkedIn
4. **Check mobile**: Resize browser to test responsive design

---

**Your website now accurately reflects your professional background!** 🎉

See `RESUME_UPDATES_COMPLETE.md` for full details of all changes made.

