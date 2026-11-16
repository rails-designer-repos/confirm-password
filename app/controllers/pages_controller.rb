class PagesController < ApplicationController
  def show
    @user = example_user
  end

  def update
    @user = example_user(user_params)

    if @user.valid?
      session[:email_address] = @user.email_address
      session[:password] = @user.password if @user.password.present?
      redirect_to root_path, notice: "Account updated"
    else
      render :show, status: :unprocessable_entity
    end
  end

  private

  def example_user(changes = {})
    email_address = session[:email_address] || User::EXAMPLE_EMAIL
    password = session[:password] || User::EXAMPLE_PASSWORD
    User.new({ email_address: email_address, current_email_address: email_address, current_password: password }.merge(changes))
  end

  def user_params
    params.permit(user: %w[email_address password password_challenge])[:user].to_h
  end
end
