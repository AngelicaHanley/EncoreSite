# Encore Site !!!

## Project Purpose:
- Encore is a concert discovery and tracking website! Its purpose is to allow users to search for upcoming concerts and then record the concerts they plan to or wish to attend, all in one place. Users are able to add concerts to their "My Concerts" and "Wishlist" pages and can remove and move concerts between each page. Local storage is used to persist the user's concert data when they refresh the page.

## API Used: 
- Ticketmaster Discovery API
- https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
- Used to retrieve the upcoming concert information for the concert cards

## ES6 Features Implemented:
- Async/await: used in fetchConcerts() to retrieve concert information from the Ticketmaster API
- Template literals: used in createConcertCard() to make HTML for the concert cards and in fetchConcerts() to make the API request
- Object or Array Destructuring: used in createConcertCard() to extract concert properties 
- Arrow functions: used in displayConcerts() to display concert results and in map(), find(), and filter()
- Let and const: used many times in index.js for declaring variables


