clear

rm -rf dist assets.ts app app.exe

yarn build
bun run asset-compile.ts

cd server
bun build --compile --minify --sourcemap ./server.ts --outfile app.exe
cd ..

mv ./server/app.exe ./app.exe
