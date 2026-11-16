Rails.application.routes.draw do
  root "pages#show"
  post "account", to: "pages#update", as: :account
end
