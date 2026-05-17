# Urban Harvest Grocery Ordering Page

A simple grocery ordering web app built for the Urban Harvest Frontend Developer Intern assignment.

## Features Implemented
- Product listing with name, category, price, unit, and stock status.
- Category filter.
- Out-of-stock item styling and disabled add-to-cart behavior.
- Cart with quantity merge (same item increments quantity).
- Quantity increase/decrease and remove item controls.
- Live cart item count in navbar.
- Order summary with item-wise breakdown, subtotal, flat delivery charge (₹40), and final total.
- Place order button disabled for empty cart.
- On placing order: cart clears and confirmation message appears.

## Project Structure
- `index.html`: Page structure (navbar, product listing, cart, order summary).
- `styles.css`: Box-style UI, responsive layout, and component styling.
- `script.js`: Product data and all cart/filter/order logic.

This structure keeps HTML, styling, and behavior separated for readability and easy maintenance in a small assignment scope.

## Run Locally
1. Open the `Urban Harvest assignment` folder.
2. Double-click `index.html` to run in your browser.

No build tools or external dependencies are required.