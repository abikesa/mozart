#! /bin/bash
read -p "Enter your GitHub username (default: abikesa): " GITHUB_USERNAME
GITHUB_USERNAME=${GITHUB_USERNAME:-abikesa}

read -p "Enter your GitHub repository name (default: worthy): " REPO_NAME
REPO_NAME=${REPO_NAME:-worthy}

read -p "Enter your email address (default: abikesa.sh@gmail.com): " EMAIL_ADDRESS
EMAIL_ADDRESS=${EMAIL_ADDRESS:-abikesa.sh@gmail.com}

read -p "Enter your root directory (e.g., ~/Dropbox/1f.ἡἔρις,κ/1.ontology, default: /documents/rhythm): " ROOT_DIR
ROOT_DIR=${ROOT_DIR:-/documents/rhythm}

read -p "Enter the name of the subdirectory to be built within the root directory (default: local): " SUBDIR_NAME
SUBDIR_NAME=${SUBDIR_NAME:-local}

read -p "Enter your commit statement: " COMMIT_THIS

git config --local user.name "$GITHUB_USERNAME"
git config --local user.email "$EMAIL_ADDRESS"

cd "$(eval echo $ROOT_DIR)"

rm -rf $SUBDIR_NAME/_build
jb build $SUBDIR_NAME
rm -rf $REPO_NAME

if [ -d "$REPO_NAME" ]; then
  echo "Directory $REPO_NAME already exists. Choose another directory or delete the existing one."
  exit 1
fi

git clone "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
if [ ! -d "$REPO_NAME" ]; then
  echo "Failed to clone the repository. Check your GitHub username, repository name, and permissions."
  exit 1
fi

cp -r $SUBDIR_NAME/* $REPO_NAME
cd $REPO_NAME

git add ./*
git commit -m "$COMMIT_THIS"
git remote -v

git remote set-url origin "https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
git config --local user.name "$GITHUB_USERNAME"
git config --local user.email "$EMAIL_ADDRESS"

# Checkout the main branch
git checkout main
if [ $? -ne 0 ]; then
  echo "Failed to checkout the main branch. Make sure it exists in the repository."
  exit 1
fi

git push -u origin main
if [ $? -ne 0 ]; then
  echo "Failed to push to the repository. Check your credentials and GitHub permissions."
  exit 1
fi

ghp-import -n -p -f _build/html
echo "Jupyter Book content updated and pushed to $GITHUB_USERNAME/$REPO_NAME repository!"
