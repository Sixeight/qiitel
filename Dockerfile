FROM ruby:2.4-stretch

RUN apt-get update && apt-get install -y apt-transport-https

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - \
  && echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -

RUN apt-get update && apt-get install -y \
  yarn \
  nodejs \
  && rm -rf /var/lib/apt/lists/*

RUN mkdir /app
WORKDIR /app

COPY Gemfile Gemfile.lock ./
RUN bundle install

COPY package.json yarn.lock ./
RUN yarn install
