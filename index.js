//API key: BHiDDr29kRGAiicdtwFIvIM20Hmg9Bzr
//https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=US&size=5&apikey=BHiDDr29kRGAiicdtwFIvIM20Hmg9Bzr

//variables
const concertGrid = document.querySelector('#discoverGrid')
const myConcertsGrid = document.querySelector('#myConcertsGrid')
const myWishlistGrid = document.querySelector('#wishlistGrid')
let concerts = []
let myConcerts = []
let myWishlist = []
//retrieving local storage data
const savedConcerts = localStorage.getItem('myConcerts')
const savedWishlist = localStorage.getItem('myWishlist')
if(savedConcerts){
    myConcerts = JSON.parse(savedConcerts)
}
if(savedWishlist){
    myWishlist = JSON.parse(savedWishlist)
}


/*Using Template Literals Here! ! !*/
function createConcertCard(concert, page="discover"){
    /*Destructing Concert Object Here! ! !*/
    const { name, date, venue, city, image, id} = concert;

    //check if concert is already saved in either list
    const existingConcert = myConcerts.find(myConcert => myConcert.id === id)
    const existingWishlistConcert = myWishlist.find(myConcert => myConcert.id === id)

    //formatting check
    let location;
    if(city){
        location = `${venue} · ${city}`
    } else{
        location = venue
    }

    let buttonsHTML = ""
    let goingButtonHTML = ""
    let wishlistButtonHTML = ""
    if(page === "discover"){
        if(existingWishlistConcert){
            wishlistButtonHTML = `<button class="wantToGoButton" data-id="${id}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heartIcon">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052a5.5 5.5 0 0 1 4.313-2.052c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg> Want to Go
            </button>`
        }else{
            wishlistButtonHTML = `<button class="wantToGoButton" data-id="${id}">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="heartIcon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                </svg> Want to Go
            </button>`
        }

        if(existingConcert){
            goingButtonHTML = `<button class="goingButton" data-id="${id}"><svg class="heartIcon" viewBox="0 -4 24 24" id="meteor-icon-kit__solid-checkmark" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M3.06066 6.4393C2.47487 5.85355 1.52513 5.85355 0.93934 6.4393C0.353553 7.0251 0.353553 7.9749 0.93934 8.5607L7.93934 15.5607C8.52513 16.1464 9.47487 16.1464 10.0607 15.5607L23.0607 2.56066C23.6464 1.97487 23.6464 1.02513 23.0607 0.43934C22.4749 -0.14645 21.5251 -0.14645 20.9393 0.43934L9 12.3787L3.06066 6.4393z" fill="currentColor"/></svg> I'm Going!</button>`
        }else{
            goingButtonHTML = `<button class="goingButton" data-id="${id}">I'm Going</button>`
        }
        buttonsHTML = goingButtonHTML + wishlistButtonHTML
    }else{
        buttonsHTML = `<button class="removeButton" data-id="${id}">Remove</button>`
    }

    const myHTMLString = 
    `<article class="concertCard">
        <img class="concertCard__image" src="${image}" alt="Concert image">

        <div class="concertCard__content">
            <h4>${name}</h4>
            <p class="cardInfo">${date}</p>
            <p class="cardInfo">${location}</p>

            <div class="concertCard__buttons">
                ${buttonsHTML}
            </div>
        </div>
    </article>`
    return myHTMLString
}

//Search button functionality
const form = document.querySelector('form')
if(form){
    form.onsubmit = function(e){
    e.preventDefault()
    const input = this.artist.value.trim()
    console.log("input: "+input)
    this.artist.value = ""
    //call search API function here
    fetchConcerts(input)
    }
}

async function fetchConcerts(artist){
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?keyword=${encodeURIComponent(artist)}&classificationName=music&size=50&apikey=BHiDDr29kRGAiicdtwFIvIM20Hmg9Bzr`
    try{
        const response = await fetch(url); 
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();

        //if there is an _embedded there we get the data
        let events
        if(data._embedded){
            events = data._embedded.events;
        } else{
            events = []
        }

        concerts = events.map(event => {
            //edge cases code
            let date
            let venue
            let image
            let city
            

            if (event.images && event.images.length > 4) {
                image = event.images[4].url;
            } else if (event.images && event.images.length > 0) {
                image = event.images[0].url;
            } else {
                image = "images/concertPlaceholder.jpeg";
            }

            if(event.dates && event.dates.start && event.dates.start.localDate){
                date = formatDate(event.dates.start.localDate)
            } else {
                date = "Date TBA"
            }


            if(event._embedded && event._embedded.venues && event._embedded.venues.length > 0){
                if(event._embedded.venues[0].name){
                    venue = event._embedded.venues[0].name
                } else{
                    venue = "Venue TBA"
                }

                if(event._embedded.venues[0].city && event._embedded.venues[0].city.name){
                    city = event._embedded.venues[0].city.name
                } else{
                    city = ""
                }
            } else{
               venue = "Venue TBA" 
               city = ""
            }

            return {
                name: event.name,
                date: date,
                venue: venue,
                city: city,
                image: image,
                id: event.id,
            };
        });
        displayConcerts(concerts);
        console.log(concerts);
    }
    catch(err){
        console.log(err)
        //clear prev concert results
        concertGrid.innerHTML = ""

        //remove any old message
        const oldMessage = document.querySelector('.noneMessage')
        if(oldMessage){
            oldMessage.remove()
        }
        //show error message to user
        const errorMessage = document.createElement('p')
        errorMessage.classList.add('noneMessage')
        errorMessage.textContent = "Sorry! Something went wrong while searching for concerts. Please try again!"
        const concertSection = document.querySelector('.concertResults')
        concertSection.appendChild(errorMessage)
    }
}

const displayConcerts = (concerts) => {
    const concertSection = document.querySelector('.concertResults')
    //clearing previous grid
    concertGrid.innerHTML = "";

    //clearing no concerts message if it was made before
    const oldMessage = document.querySelector('.noneMessage');
    if (oldMessage) {
        oldMessage.remove();
    }  

    //if there are 0 concerts, display message
    if(concerts.length===0){
        const noneMessage = document.createElement('p')
        concertSection.appendChild(noneMessage)
        noneMessage.classList.add('noneMessage');
        noneMessage.textContent = "No concerts found, please try again!"
        return
    }

    for (const concert of concerts) {
        concertGrid.insertAdjacentHTML('beforeend',createConcertCard(concert))
    }
}

function formatDate(myDate) {
    const [year, month, day] = myDate.split('-');
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

//checks if discover concert grid, so this code only runs on that page
if(concertGrid){
    //event listener for going and want to go buttons, connected to concert grid so listens to all buttons
    concertGrid.addEventListener('click',function(e){
        //e.target identifies the element that was clicked
        const goingButton = e.target.closest('.goingButton')
        const wantToGoButton = e.target.closest('.wantToGoButton')
    //storing concerts in myConcerts in local stoage
        if(goingButton){
            const selectedConcert = concerts.find(concert => concert.id === goingButton.dataset.id)
            const existingConcert = myConcerts.find(myConcert => myConcert.id === goingButton.dataset.id)

            console.log(goingButton.dataset.id)
            console.log("my concert: ", selectedConcert)
            
            if(existingConcert){
                //second click of button = remove concert
                myConcerts = myConcerts.filter(myConcert => myConcert.id !== goingButton.dataset.id)
            }else if(selectedConcert){
                //first button click = save concert
                myConcerts.push(selectedConcert)

                //remove from wishlist if previously saved there
                myWishlist = myWishlist.filter(myConcert => myConcert.id !== selectedConcert.id)
            }

            localStorage.setItem('myConcerts', JSON.stringify(myConcerts))
            localStorage.setItem('myWishlist', JSON.stringify(myWishlist))
            displayConcerts(concerts)
    }
    if(wantToGoButton){

            console.log(wantToGoButton.dataset.id)

            let selectedWishlistConcert = concerts.find(concert => concert.id === wantToGoButton.dataset.id)
            console.log("my wishlist concert: ", selectedWishlistConcert)

            //checking if concert was already added (so button clicked before, prevents duplicates)
            let existingWishlistConcert = myWishlist.find(myConcert => myConcert.id === wantToGoButton.dataset.id)
            
            if(existingWishlistConcert){
                //second click = remove concert from wishlist
                myWishlist = myWishlist.filter(myConcert => myConcert.id !== wantToGoButton.dataset.id)
            } else if(selectedWishlistConcert){
                //first click = save concert to wishlist
                myWishlist.push(selectedWishlistConcert)

                //remove from it if previously saved there
                myConcerts = myConcerts.filter(myConcert => myConcert.id !== selectedWishlistConcert.id)
            }

            localStorage.setItem('myConcerts', JSON.stringify(myConcerts))
            localStorage.setItem('myWishlist', JSON.stringify(myWishlist))
            displayConcerts(concerts)
        }
    })
}

//displaying content on myConcerts page
if(myConcertsGrid){

    //if there are 0 concerts, display message
    if(myConcerts.length===0){
        const noneSavedMessage = document.createElement('p')
        myConcertsGrid.appendChild(noneSavedMessage)
        noneSavedMessage.classList.add('noneMessage');
        noneSavedMessage.textContent = "You haven't saved any concerts yet. Head to Discover to find your next show!"
    }else{
        for (const myConcert of myConcerts) {
            myConcertsGrid.insertAdjacentHTML('beforeend',createConcertCard(myConcert, "myConcerts"))
        } 
    }
    //checking if remove button was clicked
    myConcertsGrid.addEventListener('click',function(e){
        const removeButton = e.target.closest('.removeButton')
        //removing concert from myConcerts, filter keeps every concert except the remove clicked one
        if(removeButton){
            myConcerts = myConcerts.filter(myConcert => myConcert.id !== removeButton.dataset.id)
            //update local storage for myConcerts
            localStorage.setItem('myConcerts', JSON.stringify(myConcerts))
            //removing card for concert from HTML
            removeButton.closest('.concertCard').remove()

            //also does none message if all cards were removed
            if(myConcerts.length===0){
            const noneSavedMessage = document.createElement('p')
            myConcertsGrid.appendChild(noneSavedMessage)
            noneSavedMessage.classList.add('noneMessage');
            noneSavedMessage.textContent = "You haven't saved any concerts yet. Head to Discover to find your next show!"
        }
        }
    })
}

//displaying content on myWishlist page
if(myWishlistGrid){

    //if there are 0 concerts, display message
    if(myWishlist.length===0){
        const noWishlistMessage = document.createElement('p')
        myWishlistGrid.appendChild(noWishlistMessage)
        noWishlistMessage.classList.add('noneMessage');
        noWishlistMessage.textContent = "You haven't saved any concerts to your wishlist yet. Head to Discover to find your next show!"
    }else{
        for (const myWishlistConcert of myWishlist) {
        myWishlistGrid.insertAdjacentHTML('beforeend',createConcertCard(myWishlistConcert, "wishlist"))
        } 
    }

    //checking if remove button was clicked
    myWishlistGrid.addEventListener('click',function(e){
        const removeButton = e.target.closest('.removeButton')
        //removing concert from myWishlist, filter keeps every concert except the remove clicked one
        if(removeButton){
            myWishlist = myWishlist.filter(myConcert => myConcert.id !== removeButton.dataset.id)
            //update local storage for myWishlist
            localStorage.setItem('myWishlist', JSON.stringify(myWishlist))
            //removing card for concert from HTML
            removeButton.closest('.concertCard').remove()

            //also does none message if all cards were removed
            if(myWishlist.length===0){
            const noWishlistMessage = document.createElement('p')
            myWishlistGrid.appendChild(noWishlistMessage)
            noWishlistMessage.classList.add('noneMessage');
            noWishlistMessage.textContent = "You haven't saved any concerts to your wishlist yet. Head to Discover to find your next show!"
            }
        }
    })
}

