# Knights & Bolts - Idle Tactics

A single-player fantasy RPG focusing on tactical party management and programmable character AI.

## How to Run Locally

1.  Clone the repository.
2.  Since this project uses ES Modules, you need to serve it via a local web server. Opening `index.html` directly in the browser might not work due to CORS policies.
    *   **Python 3**: `python3 -m http.server`
    *   **Node.js**: `npx serve`
    *   **VS Code**: Use the "Live Server" extension.
3.  Open the local server URL (e.g., `http://localhost:8000`) in your browser.

## Deployment to GitHub Pages

This project is ready for deployment to GitHub Pages.

### Manual Deployment
1.  Go to your repository settings on GitHub.
2.  Navigate to "Pages".
3.  Select the branch (e.g., `main`) and folder (root `/`) to deploy from.
4.  Save.

### Automated Deployment (GitHub Actions)
A workflow file is included in `.github/workflows/deploy.yml`. This will automatically deploy the `main` branch to GitHub Pages whenever you push changes.
1.  Ensure you have enabled GitHub Actions in your repository.
2.  Go to Settings > Pages.
3.  Under "Build and deployment", select "GitHub Actions" as the source.
