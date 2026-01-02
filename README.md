# Platypus & Fox Website

Modern, responsive website built with Astro for platypusandfox.com

## Features

- ✨ Modern, clean design with smooth animations
- 📱 Fully responsive (mobile-first)
- 🎨 Brand colors from Platypus & Fox logo (green/orange palette)
- 📝 Markdown-based content management
- 🔄 Substack RSS feed integration
- 🚀 Fast, optimized performance
- 📊 SEO-friendly with sitemap generation

## Quick Start

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone this repository:
```bash
git clone https://github.com/YOUR_USERNAME/platypusandfox.git
cd platypusandfox
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:4321`

## Project Structure

```
/
├── public/
│   └── images/          # Static images (logos, etc.)
├── src/
│   ├── components/      # Reusable Astro components
│   ├── layouts/         # Page layouts
│   │   └── BaseLayout.astro
│   ├── pages/           # Website pages (routes)
│   │   ├── index.astro  # Home page
│   │   ├── services.astro
│   │   ├── projects.astro
│   │   ├── writing.astro
│   │   └── contact.astro
│   └── styles/
│       └── global.css   # Global styles
├── astro.config.mjs     # Astro configuration
└── package.json
```

## Updating Content

### Editing Pages

All pages are located in `src/pages/`. To edit content:

1. Open the desired `.astro` file
2. Edit the content within the HTML-like sections
3. Save the file - changes will hot-reload in development

### Changing Colors

Edit the CSS variables in `src/styles/global.css`:

```css
:root {
  --primary-green: #2d7a4d;
  --primary-orange: #ff6b35;
  /* ... other colors ... */
}
```

### Updating Logos

Replace files in `public/images/`:
- `logo.jpg` - Full detailed logo
- `logo-simple.jpg` - Simplified logo (for favicon and small displays)

## Deployment Options

### Option 1: GitHub Pages (Recommended)

1. Create a new repository on GitHub named `platypusandfox`

2. Update `astro.config.mjs` if using a project repository:
```javascript
export default defineConfig({
  site: 'https://YOUR_USERNAME.github.io',
  base: '/platypusandfox', // Only needed if not using custom domain
});
```

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/platypusandfox.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

4. Set up GitHub Actions for automatic deployment:

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

5. Enable GitHub Pages:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Save

### Option 2: Netlify

1. Push your code to GitHub

2. Go to [Netlify](https://netlify.com)

3. Click "New site from Git"

4. Connect your repository

5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

6. Deploy!

### Option 3: Vercel

1. Push your code to GitHub

2. Go to [Vercel](https://vercel.com)

3. Import your repository

4. Vercel will auto-detect Astro

5. Deploy!

## Custom Domain Setup

### For GitHub Pages:

1. Add a `CNAME` file to the `public/` directory:
```
platypusandfox.com
```

2. In your domain registrar (e.g., Namecheap, GoDaddy):
   - Add A records pointing to GitHub's IPs:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Add CNAME record for `www` pointing to `YOUR_USERNAME.github.io`

3. In GitHub repository settings:
   - Go to Pages
   - Add custom domain: `platypusandfox.com`
   - Enable "Enforce HTTPS"

### For Netlify/Vercel:

1. In Netlify/Vercel dashboard:
   - Add custom domain: `platypusandfox.com`

2. Follow their DNS configuration instructions

3. SSL will be automatically provisioned

## Configuration

### Contact Form

The contact form uses Formspree. To set it up:

1. Sign up at [Formspree](https://formspree.io)
2. Create a new form
3. Copy your form endpoint
4. Update `src/pages/contact.astro`:
```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
```

### Substack Integration

Update your Substack username in `src/pages/writing.astro`:
```javascript
const SUBSTACK_USERNAME = 'your-substack-username';
```

### LinkedIn Profile

Update your LinkedIn URL in:
- `src/layouts/BaseLayout.astro` (footer)
- `src/pages/contact.astro`

## Available Commands

| Command                | Action                                       |
| :--------------------- | :------------------------------------------- |
| `npm install`          | Install dependencies                          |
| `npm run dev`          | Start dev server at `localhost:4321`          |
| `npm run build`        | Build production site to `./dist/`            |
| `npm run preview`      | Preview production build locally              |
| `npm run astro ...`    | Run Astro CLI commands                        |

## Customization Tips

### Adding New Pages

1. Create a new `.astro` file in `src/pages/`
2. Use the BaseLayout component
3. Add navigation link in `src/layouts/BaseLayout.astro`

Example:
```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="New Page">
  <section class="section">
    <div class="container">
      <h1>New Page Content</h1>
    </div>
  </section>
</BaseLayout>
```

### Creating Components

Create reusable components in `src/components/`:

```astro
---
// src/components/Card.astro
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<div class="card">
  <h3>{title}</h3>
  <p>{description}</p>
</div>
```

Use in pages:
```astro
---
import Card from '../components/Card.astro';
---

<Card title="My Card" description="Card description" />
```

## Maintenance

### Updating Content

- Edit `.astro` files in `src/pages/`
- Commit and push changes
- Site will automatically redeploy (if using CI/CD)

### Updating Dependencies

```bash
npm update
```

### Checking for Security Issues

```bash
npm audit
npm audit fix
```

## Support

For questions or issues:
- Create an issue in this repository
- Contact via the website contact form
- Connect on LinkedIn

## License

© 2026 Platypus & Fox. All rights reserved.
