# qiitel

- http://music.hacobun.co/

## 準備

Dockerを使うのでインストールします。

- Mac: https://www.docker.com/docker-mac
- Windows: https://www.docker.com/docker-windows

## 初回

ダミーデータの入ったDBを用意します。

```
./script/setup
```

次にDockerイメージを作ります

```
docker-compose build
```

## 起動

コンテナを起動するとアプリケーションを立ち上げ、ファイルの変更待ちとなります。

```
docker-compose up
```

## アクセス

- http://localhost:9292/


## 開発

Dockerで起動していると勝手にwatchしている状態になっているので、ファイルを変更してブラウザをリロードするだけでよい。
(自動的にリロードされたりはしない！)

- JS
  - [src/js/main.jsx](https://github.com/Sixeight/qiitel/tree/master/src/js)
  - Ractを使っています。HTML構造を変えたくなったらこっち。
- SCSS
  - [src/scss/main.scss](https://github.com/Sixeight/qiitel/tree/master/src/scss)
  - autoprefixerみたいなのとか何も考えてないので必要になったら考える。
