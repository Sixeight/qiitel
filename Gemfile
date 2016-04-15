source 'https://rubygems.org'
ruby '2.3.0'

gem 'rake'
gem 'sinatra', require: false
gem 'sinatra-contrib'
gem 'activerecord', require: 'active_record'
gem 'erubis'
gem 'kaminari', require: 'kaminari/sinatra'
gem 'omniauth-twitter'

group :development, :test do
  gem 'sqlite3'
end

group :production do
  gem 'pg'
end
