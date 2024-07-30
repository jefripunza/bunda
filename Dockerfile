# --- 🛠️ nodejs --- #
FROM node:20-alpine as fe_builder
LABEL org.opencontainers.image.authors="jefriherditriyanto@gmail.com"

RUN mkdir /fe_builder
WORKDIR /fe_builder
COPY . .

# 💯 Configuration
RUN sed -i 's#localhost#host.docker.internal#g' ./.env
RUN sed -i 's#HOSTNAME=#HOSTNAME_SKIP=#g' ./.env

#-> ⚙️ Setup...
RUN yarn install --frozen-lockfile
RUN yarn run build



# --- 🛠️ bun --- #
FROM oven/bun:1 AS be_builder

RUN mkdir /be_builder
WORKDIR /be_builder
COPY --from=fe_builder  /fe_builder/dist              /be_builder/dist
COPY --from=fe_builder  /fe_builder/asset-compile.ts  /be_builder/asset-compile.ts
COPY --from=fe_builder  /fe_builder/server            /be_builder

# 💯 Configuration
RUN sed -i 's#../assets#./assets#g' /be_builder/app.ts

#-> ⚙️ Setup...
RUN bun install --frozen-lockfile
RUN bun run asset-compile.ts
RUN bun build --compile --minify --sourcemap ./server.ts --outfile app.exe



# --- 🛠️ bun --- #
# FROM oven/bun:1 AS runner
FROM gcr.io/distroless/base AS runner

WORKDIR /runner
COPY --from=be_builder  /be_builder/app.exe  /runner/app.exe

# Start app...
CMD ["/runner/app.exe"]
