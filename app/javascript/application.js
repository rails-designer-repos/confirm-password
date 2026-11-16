import "@hotwired/turbo-rails"
import "controllers"
import Attractive from "attractivejs"
import { keyboard } from "attractivejs/keyboard"

Attractive.activate({ extendWith: [keyboard] })
