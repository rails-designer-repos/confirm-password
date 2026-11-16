class User
  include ActiveModel::Model
  include ActiveModel::Attributes

  EXAMPLE_EMAIL = "demo@example.com"
  EXAMPLE_PASSWORD = "password123"

  attribute :email_address, :string
  attribute :password, :string
  attribute :password_challenge, :string
  attribute :current_email_address, :string
  attribute :current_password, :string

  validates :email_address, presence: true
  validate :password_challenge_is_correct, if: :credentials_changed?

  private

  def credentials_changed?
    email_address != current_email_address || password.present?
  end

  def password_challenge_is_correct
    errors.add(:password_challenge, "is incorrect") unless password_challenge == current_password
  end
end
