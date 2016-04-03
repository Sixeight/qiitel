
require 'bundler'
Bundler.require

require 'yaml'

settings = YAML.load_file File.expand_path('../config/database.yml', __dir__)
environment = ENV['RACK_ENV'] || :development

ActiveRecord::Base.configurations = settings
ActiveRecord::Base.establish_connection(environment.to_sym)
