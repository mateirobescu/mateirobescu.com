# [mateirobescu.com](https://www.mateirobescu.com)
<p>
  <img src="https://www.mateirobescu.com/static/portfolio/images/github_logo.png" alt="Demo of mateirobescu.com" width="250">
</p>

A full-stack personal portfolio built with Django and vanilla JavaScript, showcasing my projects and skills. The site is optimized for performance, security, and scalability — hosted on AWS with a PostgreSQL database and Cloudinary CDN.
## 🎨 Frontend
Built a responsive mobile-friendly frontend with raw HTML, CSS and Javascript, using npm as a module manager.
- Raw Html with intuitive classes, correct aria atributes and good meta for SEO friendliness.
- Used SCSS for cleaner syntax and better organization of styles.- Javascript classes for each component for better readability and structure, while also future proofing for updates:
  - `themeManager.js` – Dark/light mode with localStorage
  - `navbar.js` – Mobile nav & scrollspy
  - `projects.js` – Stack-based project filtering
  - `contact.js` – AJAX form with reCAPTCHA v3 validation
## 🖥 Backend
Built the backend in Django (Python), following best practices for performance, security, and maintainability.
### 🧱Models
- `Stacks`: stores information about the technologies I commonly use- `Projects`: stores a data about each project in both romanian and english and has many-to-many relationship with ```Stacks``` in order to enable filtering by stacks.
- `ProjectStacks`: intermediary model to create the many-to-many relationship between `Projects` and `Stacks`
- `EmailLog`: model that logs all attempted email that reached the backend and passed data/bot validation.

### 🔒 Security
- Google reCaptcha v3 to minimize the risk of email forms being submitted by bots.
- Custom Natural Language Processing (NLP) spam detection using the `gibberish-detector` model, trained with English and Romanian data from the [Leipzig Corpora Collection](https://wortschatz.uni-leipzig.de/en/download/English), cleaned first with the ```data_cleaner.py``` script to maximize accuracy, in order to detect bot/spam-like content and reject those emails.

### ☁️ Cloud
- Deployed on an AWS EC2 instance running Ubuntu
- High-performance serving managed by Nginx (reverse proxy) routing to Gunicorn (WSGI server).
- Used `pull.sh` script that automatically fetches from the main branch, collects static files, downloads python and npm modules and restarts the webserver to apply changes. 
- Managed environment configuration and secrets using Django-Environ (or similar solution) to securely separate sensitive data from the version control system.
- PostgreSQL database hosted remotely on Nano in order to sustain scalability and possible server changes in the future.
- Media (project thumbnails) hosted on Cloudinary and delivered via their CDN, also for future proofing.
- Emails delivered through Brevo using a custom adress for a more professional look.
- GoDaddy as DNS service for the mateirobescu.com domain

### 🌍 Internationalization
- Implemented full internationalization (i18n) using Django’s translation framework — all UI text and project data are available in both English 🇬🇧 and Romanian 🇷🇴.