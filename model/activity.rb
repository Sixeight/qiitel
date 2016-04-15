
class Activity < ActiveRecord::Base
  belongs_to :track
  belongs_to :user

  default_scope do
    order 'activities.updated_at DESC'
  end
end
