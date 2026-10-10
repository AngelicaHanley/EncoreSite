//API key: BHiDDr29kRGAiicdtwFIvIM20Hmg9Bzr
//https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=US&size=5&apikey=BHiDDr29kRGAiicdtwFIvIM20Hmg9Bzr

/*Using Template Literals Here! ! !*/
function createConcertCard(concert){
    /*Destructing Concert Object Here! ! !*/
    const { name, date, venue, city, image, id} = concert;

    const myHTMLString = 
    `<article class="concertCard">
        <img class="concertCard__image" src="${image}" alt="Concert image">

        <div class="concertCard__content">
            <h4>${name}</h4>
            <p>${date}</p>
            <p>${venue} · ${city}</p>

            <div class="concertCard__buttons">
                <button>I'm Going</button>
                <button><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="heartIcon">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                    </svg>
                    Want to Go</button>
            </div>
        </div>
    </article>`
    return myHTMLString
}

//Search button functionality
const form = document.querySelector('form')
form.onsubmit = function(e){
    e.preventDefault()
    const input = this.artist.value.trim()
    console.log("input: "+input)
    this.artist.value = ""
    //call search API function here
    fetchConcerts(input)
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
        let events;
        if(data._embedded){
            events = data._embedded.events;
        } else{
            events = []
        }

        const concerts = events.map(event => {
            return {
                name: event.name,
                date: event.dates.start.localDate,
                venue: event._embedded.venues[0].name,
                city: event._embedded.venues[0].city.name,
                image: event.images[4].url,
                id: event.id,
            };
        });
        displayConcerts(concerts);
        console.log(concerts);
    }
    catch(err){
        console.log(err)
    }
}

const displayConcerts = (concerts) => {
    const concertSection = document.querySelector('.concertResults')
    const concertGrid = document.querySelector('.concertGrid')
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
        noneMessage.textContent = "No concerts found, try again!!"
        return
    }

    for (const concert of concerts) {
        concertGrid.insertAdjacentHTML('beforeend',createConcertCard(concert))
    }
}