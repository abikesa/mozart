# 1. Build

To address the issue more comprehensively, let's ensure that the paths and directory structure are properly set up for the local embedding to work. I will explicitly outline each step and verify that all components are correctly referenced.

### Verify Directory Structure

Here’s how your directory structure should look:

```
donor/
├── _build/
│   └── html/
│       ├── webApp/
│       │   ├── assets/
│       │   │   └── js/
│       │   │       └── script.js
│       │   ├── styles/
│       │   │   └── style.css
│       │   ├── index.html
│       │   └── index.md
├── assets/
│   └── js/
│       └── script.js
├── styles/
│   └── style.css
├── _config.yml
├── _toc.yml
├── chapter1.ipynb
├── chapter2.ipynb
├── intro.md
├── README.md
└── requirements.txt
```

### Ensure Correct Paths in `webApp/index.html`

Ensure that `webApp/index.html` correctly references the assets using relative paths. 

#### Example `webApp/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mortality Risk Calculator</title>
    <link rel="stylesheet" href="styles/style.css">
</head>
<body>
    <div>
        <label for="scenario-dropdown">Select Scenario:</label>
        <select id="scenario-dropdown">
            <option value="excellent">Excellent</option>
            <option value="verygood">Very Good</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
        </select>
        <button id="calculate-risk-button">Calculate Mortality Risk</button>
    </div>
    <div style="width: 80vw; margin: 0 auto;">
        <canvas id="mortality-risk-graph" width="400" height="400"></canvas>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="assets/js/script.js"></script>
</body>
</html>
```

### Ensure `webApp/index.md` Correctly Embeds `index.html`

Update `webApp/index.md` to embed the `index.html` file using an iframe with the correct path:

```markdown
# Web App

<iframe src="webApp/index.html" width="100%" height="600px" style="border:none;">
</iframe>
```

### `_toc.yml`

Make sure `_toc.yml` includes the `webApp/index` file correctly:

```yaml
# Table of contents
# Learn more at https://jupyterbook.org/customize/toc.html

format: jb-book
root: intro
chapters:
  - file: intro
  - file: chapter1
  - file: chapter2
  - file: chapter3
  - file: chapter4
  - file: chapter5
  - file: chapter6
  - file: chapter7
  - file: webApp/index
```

### Rebuild and Deploy the Jupyter Book

1. **Rebuild the Jupyter Book:**
   ```sh
   jb build donor
   ```

2. **Deploy Using `ghp-import`:**
   ```sh
   ghp-import -n -p -f _build/html
   ```

### Final Verification

After following these steps, your "Web App" chapter should appear in the Jupyter Book, correctly embedding the local `index.html` file. This ensures that all paths and references are correctly set up for the local embedding to work. If you still encounter issues, please verify the directory structure, file paths, and contents to ensure everything is referenced correctly.

# 2 Postbuild

I'm glad to hear it worked! However, needing to move the `webApp` folder to the `_build` directory manually after building is not ideal. Let's automate this step to streamline your workflow.

### Automating the Move Step

We can create a post-build script to automate the moving of the `webApp` folder to the correct location after building. This can be done using a simple shell script.

1. **Create a Post-Build Script**

Create a file named `post_build.sh` in your project root directory with the following content:

```sh
#!/bin/bash

# Define the source and destination paths
SOURCE_DIR="webApp"
DEST_DIR="_build/html/webApp"

# Remove the old destination directory if it exists
rm -rf "$DEST_DIR"

# Create the destination directory
mkdir -p "$DEST_DIR"

# Copy the webApp folder to the destination directory
cp -r "$SOURCE_DIR/"* "$DEST_DIR/"

echo "webApp folder moved to _build/html/webApp"
```

2. **Make the Script Executable**

Make the script executable by running the following command:

```sh
chmod +x post_build.sh
```

3. **Modify Your Build Process**

Modify your build process to run this script after building the Jupyter Book. You can do this by chaining the build command and the script execution:

```sh
jb build donor && ./post_build.sh
```

### Steps to Verify

1. **Ensure the `post_build.sh` Script is Created and Executable**

   Verify that the script is created and has the correct permissions:

   ```sh
   ls -l post_build.sh
   ```

2. **Run the Build Process with the Post-Build Script**

   Run the build process with the post-build script:

   ```sh
   jb build donor && ./post_build.sh
   ```

3. **Deploy Using `ghp-import`**

   Deploy the build using:

   ```sh
   ghp-import -n -p -f _build/html
   ```

By automating the move step, you ensure that your `webApp` folder is correctly placed in the `_build/html` directory after each build, streamlining your workflow and avoiding manual intervention.