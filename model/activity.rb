
class Activity < ActiveRecord::Base
  belongs_to :track
  belongs_to :user

  default_scope do
    order 'activities.updated_at DESC'
  end

  def to_hash
    track            = self.track.dup
    track.user       = self.user.dup
    track.updated_at = self.updated_at
    track.to_hash
  end
end
