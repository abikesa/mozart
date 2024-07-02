#! /bin/bash

# setup tidy work directory
read -p "Enter your root directory (default: /documents/rhythm): " ROOT_DIR
ROOT_DIR=${ROOT_DIR:-/documents/rhythm}

read -p "Enter the name of the subdirectory that archives .sh scripts (default: new): " SUBDIR_NAME
SUBDIR_NAME=${SUBDIR_NAME:-new}

cd ~/$ROOT_DIR && rm -rf * && git clone https://github.com/abikesa/workflow && mv workflow $SUBDIR_NAME && $SUBDIR_NAME/setup_myenv.sh && source myenv/bin/activate

# template as starting point
read -p "Enter template GitHub repository name (default: haydn): " REPO_NAME
REPO_NAME=${REPO_NAME:-haydn}

git clone https://github.com/abikesa/$REPO_NAME
mv $REPO_NAME local
cd local/kitabo/ensi
echo "Make updates to $ROOT_DIR/local"

