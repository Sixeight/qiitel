require 'bundler'
Bundler.require

require 'yaml'

settings = YAML.load_file File.expand_path('../config/database.yml', __dir__)
environment = ENV['RACK_ENV'] || :development

# Hack for Daemonize
# デーモン化するときに / に移動するので相対パスで指定していると誤ったファイルをみてしまう
# http://www.rubydoc.info/gems/daemons/1.1.9/Daemons
project_root = File.expand_path('..', __dir__)
absolute_database_path = File.expand_path(settings[environment]['database'], project_root)
settings[environment]['database'] = absolute_database_path

ActiveRecord::Base.default_timezone = :utc
ActiveRecord::Base.configurations = settings
ActiveRecord::Base.establish_connection(ENV['DATABASE_URL'] || environment.to_sym)
