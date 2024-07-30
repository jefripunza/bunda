clear

# Installation
yarn
cd server
bun install
cd ..

# Make assets.ts file
yarn build
bun run asset-compile.ts
