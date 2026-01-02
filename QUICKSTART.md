# Quick Start Guide - Deploy to GitHub Pages

Follow these steps to get your website live at platypusandfox.com:

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `platypusandfox` (or any name you prefer)
3. Make it **Public**
4. **DO NOT** initialize with README (we already have files)
5. Click "Create repository"

## Step 2: Push Your Code

In your terminal, navigate to the project folder and run:

```bash
cd platypusandfox
git init
git add .
git commit -m "Initial commit - Platypus & Fox website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/platypusandfox.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - Source: Select **GitHub Actions**
5. Wait a few minutes for the deployment to complete

Your site will be live at: `https://YOUR_USERNAME.github.io/platypusandfox/`

## Step 4: Connect Custom Domain

### A. Configure DNS (at your domain registrar)

Add these DNS records for `platypusandfox.com`:

**A Records** (for root domain):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME Record** (for www subdomain):
```
Name: www
Value: YOUR_USERNAME.github.io
```

### B. Configure GitHub Pages

1. In your repository, go to **Settings → Pages**
2. Under "Custom domain", enter: `platypusandfox.com`
3. Click **Save**
4. Check the box for **Enforce HTTPS** (after DNS propagates)

### C. Wait for DNS Propagation

DNS changes can take 24-48 hours to fully propagate. You can check status at:
https://www.whatsmydns.net/#A/platypusandfox.com

## Step 5: Customize Your Site

### Update Contact Form

1. Sign up at https://formspree.io (free)
2. Create a new form
3. Edit `src/pages/contact.astro` and replace:
   ```html
   action="https://formspree.io/f/YOUR_FORM_ID"
   ```
   with your actual form ID

### Verify Substack Integration

The Substack integration is already set to use `bycampfireandcandlelight`. 
If you need to change it, edit `src/pages/writing.astro`:
```javascript
const SUBSTACK_USERNAME = 'your-substack-username';
```

### Update LinkedIn URL

In `src/layouts/BaseLayout.astro` and `src/pages/contact.astro`, verify your LinkedIn URL is correct:
```html
https://www.linkedin.com/in/kyle-knox-md
```

## Local Development

To work on your site locally:

```bash
# Install dependencies (first time only)
npm install

# Start development server
npm run dev

# Open http://localhost:4321 in your browser
```

Any changes you make will automatically reload in the browser.

## Making Updates

When you want to update your live site:

```bash
# Make your changes to the files
# Then commit and push:
git add .
git commit -m "Updated content"
git push
```

GitHub Actions will automatically rebuild and deploy your site within a few minutes.

## Troubleshooting

### Site not updating after push
- Check Actions tab in GitHub to see if build succeeded
- Clear your browser cache
- Wait a few minutes for CDN to update

### Custom domain not working
- Verify DNS records are correct
- Wait for DNS propagation (up to 48 hours)
- Check that CNAME file exists in the repository

### Form submissions not working
- Verify you've set up Formspree and updated the form action URL
- Check Formspree dashboard for submissions

## Need Help?

- Full documentation: See README.md
- Check GitHub Actions logs for build errors
- Astro docs: https://docs.astro.build

## What's Next?

Once your site is live, you can:
- Add new blog posts by editing content
- Create new pages by adding `.astro` files
- Customize styling in `src/styles/global.css`
- Add new projects to the projects page
- Share your site!

Your website should now be live at platypusandfox.com! 🎉
