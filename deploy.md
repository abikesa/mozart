# Iterations

## 1

Here's a refined version of your scripts with streamlined commands and error handling, including the necessary steps to build the Jupyter Book, copy the app, and push the repository to GitHub.

### Script to build the Jupyter Book and copy the app

```bash
#!/bin/bash

# Move to the directory containing the Jupyter Book
cd ~/documents/rhythm/jam/kitabo/ensi

# Install required packages and build the Jupyter Book
pip install -r requirements.txt
if ! jupyter-book build .; then
  echo "Failed to build the Jupyter Book."
  exit 1
fi

# Copy the app to the appropriate directory
cp -r part1/app/* _build/html/part1/app

# Move to the root directory to run the GitHub push script
cd ~/documents/rhythm/

# Execute the GitHub push script
if ! ./new/jbb_https.sh; then
  echo "Failed to execute the GitHub push script."
  exit 1
fi

echo "Jupyter Book built, app copied, and repository pushed successfully!"
```

### GitHub push script

```bash
#!/bin/bash

# Prompt for GitHub credentials and repository details
read -p "Enter your GitHub username (default: abikesa): " GITHUB_USERNAME
GITHUB_USERNAME=${GITHUB_USERNAME:-abikesa}

read -p "Enter your GitHub repository name (default: worthy): " REPO_NAME
REPO_NAME=${REPO_NAME:-worthy}

read -p "Enter your email address (default: abikesa.sh@gmail.com): " EMAIL_ADDRESS
EMAIL_ADDRESS=${EMAIL_ADDRESS:-abikesa.sh@gmail.com}

read -p "Enter your root directory (default: ~/documents/rhythm): " ROOT_DIR
ROOT_DIR=${ROOT_DIR:-~/documents/rhythm}

read -p "Enter the name of the subdirectory to be built within the root directory (default: local): " SUBDIR_NAME
SUBDIR_NAME=${SUBDIR_NAME:-local}

read -p "Enter your commit statement: " COMMIT_THIS

# Configure Git user
git config --local user.name "$GITHUB_USERNAME"
git config --local user.email "$EMAIL_ADDRESS"

# Move to the root directory
cd "$(eval echo $ROOT_DIR)" || { echo "Failed to change directory to $ROOT_DIR"; exit 1; }

# Remove any existing build directory
rm -rf $SUBDIR_NAME/_build

# Build the Jupyter Book
if ! jb build $SUBDIR_NAME; then
  echo "Failed to build the Jupyter Book."
  exit 1
fi

# Remove existing repository directory if it exists
rm -rf $REPO_NAME

# Clone the repository
if ! git clone "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"; then
  echo "Failed to clone the repository. Check your GitHub username, repository name, and permissions."
  exit 1
fi

# Copy the built content to the repository directory
cp -r $SUBDIR_NAME/* $REPO_NAME

# Move to the repository directory
cd $REPO_NAME || { echo "Failed to change directory to $REPO_NAME"; exit 1; }

# Add, commit, and push the changes
git add ./*
git commit -m "$COMMIT_THIS"

# Ensure remote URL is set correctly
git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Checkout and push to the main branch
if ! git checkout main; then
  echo "Failed to checkout the main branch. Make sure it exists in the repository."
  exit 1
fi

if ! git push -u origin main; then
  echo "Failed to push to the repository. Check your credentials and GitHub permissions."
  exit 1
fi

# Use ghp-import to push the _build/html content
if ! ghp-import -n -p -f _build/html; then
  echo "Failed to import and push the _build/html content."
  exit 1
fi

echo "Jupyter Book content updated and pushed to $GITHUB_USERNAME/$REPO_NAME repository!"
```

These scripts incorporate user prompts, error handling, and the necessary steps to build your Jupyter Book, copy the app, and push the content to GitHub. Adjust the paths and names as needed based on your specific project structure and requirements.

## 2

Let's revise the scripts to better navigate the complex directory structure you provided. Here’s a revised approach that takes into account the detailed hierarchy.

### Script to build the Jupyter Book and copy the app

```bash
#!/bin/bash

# Set variables for directories and files
ROOT_DIR=~/documents/rhythm
JBOOK_DIR=$ROOT_DIR/local/kitabo/ensi
APP_SOURCE_DIR=$JBOOK_DIR/foreword/app
APP_DEST_DIR=$JBOOK_DIR/_build/html/foreword/app

# Move to the directory containing the Jupyter Book
cd $JBOOK_DIR

# Install required packages and build the Jupyter Book
pip install -r requirements.txt
if ! jupyter-book build .; then
  echo "Failed to build the Jupyter Book."
  exit 1
fi

# Copy the app to the appropriate directory
if ! cp -r $APP_SOURCE_DIR/* $APP_DEST_DIR; then
  echo "Failed to copy app to the build directory."
  exit 1
fi

# Move to the root directory to run the GitHub push script
cd $ROOT_DIR

# Execute the GitHub push script
if ! ./new/jbb_https.sh; then
  echo "Failed to execute the GitHub push script."
  exit 1
fi

echo "Jupyter Book built, app copied, and repository pushed successfully!"
```

### GitHub push script

```bash
#!/bin/bash

# Prompt for GitHub credentials and repository details
read -p "Enter your GitHub username (default: abikesa): " GITHUB_USERNAME
GITHUB_USERNAME=${GITHUB_USERNAME:-abikesa}

read -p "Enter your GitHub repository name (default: worthy): " REPO_NAME
REPO_NAME=${REPO_NAME:-worthy}

read -p "Enter your email address (default: abikesa.sh@gmail.com): " EMAIL_ADDRESS
EMAIL_ADDRESS=${EMAIL_ADDRESS:-abikesa.sh@gmail.com}

read -p "Enter your root directory (default: ~/documents/rhythm): " ROOT_DIR
ROOT_DIR=${ROOT_DIR:-~/documents/rhythm}

read -p "Enter the name of the subdirectory to be built within the root directory (default: local): " SUBDIR_NAME
SUBDIR_NAME=${SUBDIR_NAME:-local}

read -p "Enter your commit statement: " COMMIT_THIS

# Configure Git user
git config --local user.name "$GITHUB_USERNAME"
git config --local user.email "$EMAIL_ADDRESS"

# Move to the root directory
cd "$(eval echo $ROOT_DIR)" || { echo "Failed to change directory to $ROOT_DIR"; exit 1; }

# Remove any existing build directory
rm -rf $SUBDIR_NAME/_build

# Build the Jupyter Book
if ! jb build $SUBDIR_NAME; then
  echo "Failed to build the Jupyter Book."
  exit 1
fi

# Remove existing repository directory if it exists
rm -rf $REPO_NAME

# Clone the repository
if ! git clone "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"; then
  echo "Failed to clone the repository. Check your GitHub username, repository name, and permissions."
  exit 1
fi

# Copy the built content to the repository directory
cp -r $SUBDIR_NAME/* $REPO_NAME

# Move to the repository directory
cd $REPO_NAME || { echo "Failed to change directory to $REPO_NAME"; exit 1; }

# Add, commit, and push the changes
git add ./*
git commit -m "$COMMIT_THIS"

# Ensure remote URL is set correctly
git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Checkout and push to the main branch
if ! git checkout main; then
  echo "Failed to checkout the main branch. Make sure it exists in the repository."
  exit 1
fi

if ! git push -u origin main; then
  echo "Failed to push to the repository. Check your credentials and GitHub permissions."
  exit 1
fi

# Use ghp-import to push the _build/html content
if ! ghp-import -n -p -f _build/html; then
  echo "Failed to import and push the _build/html content."
  exit 1
fi

echo "Jupyter Book content updated and pushed to $GITHUB_USERNAME/$REPO_NAME repository!"
```

### Explanation

1. **Directory Navigation**:
   - The build script navigates to the Jupyter Book directory (`$JBOOK_DIR`), installs dependencies, builds the book, and copies the app.
   - The GitHub push script navigates to the root directory and proceeds with the Git operations.

2. **File Copy**:
   - The `cp -r $APP_SOURCE_DIR/* $APP_DEST_DIR` command ensures the app is copied correctly to the `_build/html` directory.

3. **GitHub Operations**:
   - The GitHub push script clones the repository, copies the built content, and pushes it to GitHub.

These scripts should handle the complexity of your directory structure and ensure the correct files are built and pushed. Adjust paths if needed to fit your exact setup.
