
require 'bundler'
Bundler.require

load "active_record/railties/databases.rake"

require_relative 'db/setup'

ActiveRecord::Tasks::DatabaseTasks.tap do |config|
  config.root                   = Rake.application.original_dir
  config.env                    = ENV['RACK_ENV'] || 'development'
  config.db_dir                 = 'db'
  config.migrations_paths       = ['db/migrate']
  config.database_configuration = ActiveRecord::Base.configurations
end

module Camlizable
  refine String do
    def camelize
      parts = self.split('_')
      parts.map {|part| part[0].upcase + part[1..-1].downcase }.join
    end
  end
end
using Camlizable

namespace :db do
  task :environment do
    # DO NOTHING
  end

  namespace :migrate do
    task :create do
      name    = ENV['NAME'] or abort 'require NAME'
      version = ENV['VERSION'] || Time.now.strftime('%Y%m%d%H%M%S')

      file_name = '%s_%s.rb' % [version, name]
      dir_name  = ActiveRecord::Migrator.migrations_path
      path      = File.expand_path(file_name, dir_name)

      abort 'already exists' if found if File.exist? path

      FileUtils.mkdir_p dir_name
      File.write path, <<-MIGRATION.strip_heredoc
        class #{name.camelize} < ActiveRecord::Migration
          def change
          end
        end
      MIGRATION

      puts "created: #{path}"
    end
  end
end
