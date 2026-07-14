# Adam Chow — Sports Data Science Portfolio

A personal portfolio site showcasing my work in data visualization, analysis, and predictive modeling across baseball, basketball, and football. Every project opens into its own page with a real, interactive deliverable, plus the purpose, audience, methods, and results behind it.

**Live site:** https://a-chow3.github.io

---

## About

I'm a Master of Science in Data Science candidate at the University of Virginia. I build data visualizations, predictive models, and the dashboards that coaches actually use, from the pitcher's mound to the hardwood. This site is a one-stop place for potential employers to explore what I have built, the skills I am comfortable leveraging, and where my strengths are.

Wherever the original data was confidential, I have rebuilt the work with fabricated dummy data so nothing proprietary is exposed. Every demo clearly labels its data as fabricated.

---

## Projects

**Basketball**
- **UVA Basketball Performance Dashboard** (`dashboard.html`) — an interactive recreation of a Snowflake and Streamlit player-efficiency dashboard: weighted action-value index, shooting analytics, and player comparisons.
- **NBA Contract Value Predictor** (`lebron-mlr.html`) — a multiple linear regression model that predicts a player's future LEBRON value to judge whether a contract is justified.

**Baseball**
- **UVA Baseball Performance Dashboard** (`baseball-shiny.html`) — a full interactive rebuild of my R Shiny dashboard covering hitting (data tables, matchup spray charts, zone analysis), pitching (arsenal, situational, locations, trends), and catcher framing.
- **Swing and Stance Clustering** (`swing-stance.html`) — ten real swing archetypes plus predictive models for archetype classification, run value, and tier progression.
- **Pitch Tipping and 3D Pose Analysis** (`baseball-tipping.html`) — an end-to-end computer vision pipeline (YOLOv8, Roboflow, MediaPipe, Random Forest) that detects mechanical tells from broadcast video.
- **3D Hand Angle Biomechanics Tool** (`hand-angle.html`) — a computer vision pipeline that derives three wrist angles per frame, with an interactive 3D skeleton.
- **Pitching Optimization and PES** (`pitching-optimization.html`) — a Pitch Efficiency Score, matchup clustering, and decision-tree execution benchmarks.
- **Transfer Portal Performance Prediction** (`transfer-portal.html`) — Self-Organizing Map archetypes and a projection model for NCAA pitching transfers.

**Football**
- **Offensive Efficiency in the Modern NFL** (`nfl-rules.html`) — a decade of play-by-play data testing whether rule changes actually increased scoring.

---

## Tech stack

- **HTML, CSS, and vanilla JavaScript** — no build step, no framework.
- **Chart.js** and **Plotly.js** (loaded from a CDN) for the interactive charts and 3D visuals.
- **Google Fonts** (Inter and Sora) for typography.
- Hosted with **GitHub Pages**.

---

## Repository structure

```
.
├── index.html              # Home: about, skills, and project index
├── dashboard.html          # UVA Basketball dashboard
├── baseball-shiny.html     # UVA Baseball dashboard
├── swing-stance.html       # Swing and stance clustering
├── baseball-tipping.html   # Pitch tipping and 3D pose
├── hand-angle.html         # 3D hand angle biomechanics
├── pitching-optimization.html
├── transfer-portal.html
├── lebron-mlr.html         # NBA contract value predictor
├── nfl-rules.html          # NFL offensive efficiency
├── css/
│   └── style.css           # Shared styling and color palette
├── js/
│   ├── dashboard.js        # Basketball dashboard logic + dummy data
│   └── baseball-shiny.js   # Baseball dashboard logic + dummy data
├── assets/
│   └── headshot.jpg        # Profile photo
└── .nojekyll               # Serve files as-is on GitHub Pages
```

---

## Run it locally

No build tools are required. Clone the repo and open `index.html` in a browser, or serve it locally so the CDN charts load cleanly:

```bash
git clone https://github.com/a-chow3/a-chow3.github.io.git
cd a-chow3.github.io
python3 -m http.server 8000
# then open http://localhost:8000
```

An internet connection is needed for the charts and fonts, which load from a CDN.

---

## Deploy and edit

The site is served by GitHub Pages from the `main` branch. Any commit to `main` redeploys the live site automatically within about a minute.

To make a small change without a local setup, open the file on GitHub, click the pencil (Edit) icon, edit the text, and commit. Page copy lives as plain sentences inside each `.html` file, colors live in `css/style.css`, and the interactive demo data lives in the `js/` files.

---

## Data and privacy

All project demos use **fabricated dummy data**. None of the underlying proprietary data, table names, player names, or real statistics from UVA Athletics, Tread Athletics, or any other source are present in this repository. The layouts, metrics, models, and calculations mirror the real tools, but every number shown is synthetic.

---

## Contact

- **Email:** adamkchow3@gmail.com
- **LinkedIn:** https://linkedin.com/in/adamkchow
- **GitHub:** https://github.com/a-chow3

© Adam Chow
