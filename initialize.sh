clear

# Clone file
cp ./.env.example .env

# Installation
yarn
cd server
bun install
cd ..

# Make assets.ts file
yarn build
bun run asset-compile.ts
