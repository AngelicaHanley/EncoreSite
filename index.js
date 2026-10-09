//API key: BHiDDr29kRGAiicdtwFIvIM20Hmg9Bzr

//https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=US&size=5&apikey=BHiDDr29kRGAiicdtwFIvIM20Hmg9Bzr

async function testAPI(){
    try{
        const result = await fetch('https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&countryCode=US&size=5&apikey=BHiDDr29kRGAiicdtwFIvIM20Hmg9Bzr')
        const data = await result.json();


        console.log('api result:', data)
    }
    catch(err){
        console.log(err)
    }
}

testAPI();