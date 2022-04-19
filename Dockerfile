# ベースイメージ
FROM node:14.16.1-alpine as build-develop

# 作業ディレクトリ
WORKDIR /work

# プロジェクト配下を/work配下に配置
COPY . /work/

# プログレスバーを非表示にして高速化
RUN npm install --no-progress

# eslintを実行
RUN npm run lint

# 型定義ファイルを作成
RUN npm run build

FROM node:14.16.1-alpine as build-stage

# localeを日本語に
ENV LANG C.UTF-8

ENV TZ Asia/Tokyo

WORKDIR /app

COPY ./package.json ./package-lock.json ./

# --cache /tmp/empty-cache 一時的なキャッシュを利用
RUN npm install --production --no-progress --cache /tmp/empty-cache && rm -rf /tmp/empty-cache
COPY --from=build-stage /work/dist ./dist

# https://github.com/krallin/tini
# PID 1対策
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]

USER node

# ホストマシン上にポートを露出（expose）しますが、公開はしません
EXPOSE 3000

ENV NODE_ENV prod

CMD ["node", "dist/src/main"]
