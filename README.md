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
- **UVA Basketball Performance Dashboard** (`dashboard.html`) — an interactive recreation of a Snowflake and Streamlit player-efficiency dashboard.
- **NBA Contract Value Predictor** (`lebron-mlr.html`) — a multiple linear regression model that predicts a player's future LEBRON value to judge whether a contract is justified.

**Baseball**
- **UVA Baseball Performance Dashboard** (`baseball-shiny.html`) — a full interactive rebuild of my R Shiny dashboard covering hitting, pitching, and catcher framing.
- **Swing and Stance Clustering** (`swing-stance.html`) — ten real swing archetypes plus predictive models for archetype, run value, and tier progression.
- **Pitch Tipping and 3D Pose Analysis** (`baseball-tipping.html`) — a computer vision pipeline that detects mechanical tells from broadcast video.
- **3D Hand Angle Biomechanics Tool** (`hand-angle.html`) — derives three wrist angles per frame, with an interactive 3D skeleton.
- **Pitching Optimization and PES** (`pitching-optimization.html`) — a Pitch Efficiency Score, matchup clustering, and decision-tree benchmarks.
- **Transfer Portal Performance Prediction** (`transfer-portal.html`) — Self-Organizing Map archetypes and a projection model for pitching transfers.

**Football**
- **Offensive Efficiency in the Modern NFL** (`nfl-rules.html`) — a decade of play-by-play data testing whether rule changes actually increased scoring.

---

## Tech stack

HTML, CSS, and vanilla JavaScript with no build step. Chart.js and Plotly.js (from a CDN) power the interactive charts and 3D visuals. Hosted with GitHub Pages.

---

## Repository structure

All files live at the repository root so GitHub Pages serves the site directly:

```
index.html                 # Home: about, skills, project index
dashboard.html             # UVA Basketball dashboard
baseball-shiny.html        # UVA Baseball dashboard
swing-stance.html          # Swing and stance clustering
baseball-tipping.html      # Pitch tipping and 3D pose
hand-angle.html            # 3D hand angle biomechanics
pitching-optimization.html
transfer-portal.html
lebron-mlr.html            # NBA contract value predictor
nfl-rules.html             # NFL offensive efficiency
style.css                  # Shared styling and color palette
dashboard.js               # Basketball dashboard logic + dummy data
baseball-shiny.js          # Baseball dashboard logic + dummy data
headshot.jpg               # Profile photo
.nojekyll                  # Serve files as-is on GitHub Pages
```

---

## Run it locally

No build tools required. Open `index.html` in a browser, or serve locally so the CDN charts load cleanly:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

An internet connection is needed for the charts and fonts, which load from a CDN.

---

## Data and privacy

All project demos use fabricated dummy data. None of the underlying proprietary data, table names, player names, or real statistics from UVA Athletics, Tread Athletics, or any other source are present in this repository. The layouts, metrics, models, and calculations mirror the real tools, but every number shown is synthetic.

---

## Contact

- **Email:** adamkchow3@gmail.com
- **LinkedIn:** https://linkedin.com/in/adamkchow
- **GitHub:** https://github.com/a-chow3

© Adam Chow
