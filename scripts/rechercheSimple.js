var mymap
var france
var museums
var currentPos
var currentRoute

$(() => {
    L.mapquest.key = 'APz6ucyv6DAiq4lYgVfa2d8DSzKdCTaJ'
    $("body").css({
        opacity: 1
    })
    mymap = L.map('map1', {
        center: [48.85, 2.35],
        layers: L.mapquest.tileLayer('map'),
        zoom: 12
    });
    $("#search").submit((e) => { e.preventDefault(); submitSearch() });
    $("#country").autocomplete({
        source: listePays(),
        minLength: 3
    });
    $("#btnSearch").button({
        icon: "ui-icon-search"
    })

    navigator.geolocation.getCurrentPosition((pos) => currentPos = { lat: pos.coords.latitude, lon: pos.coords.longitude })
})

submitSearch = () => {
    var ville = $("#city").val();
    var pays = $("#country").val();
    if (ville === "") {
        alert("Merci de renseigner une ville");
        return;
    }
    if (pays === "") {
        alert("Merci de renseigner un pays");
        return;
    }
    $.ajax({
        type: "GET",
        url: `https://nominatim.openstreetmap.org/search?format=json&limit=30&addressdetails=1&q=Musées dans+${ville}+${pays}`,
        data: "data",
        dataType: "json",
        success: (data) => {
            console.log(data);
            if (data.length === 0) {
                alert("Aucun lieu ne correspond à votre recherche !")
                return
            }
            clearAllMarkers()
            data.forEach((museum, index) => {
                L.marker([museum.lat, museum.lon], {
                    icon: L.mapquest.icons.marker({
                        primaryColor: '#22407F',
                        secondaryColor: '#3B5998',
                        shadow: true,
                        size: 'md',
                        symbol: index + 1
                    })
                })
                    .addTo(mymap)
                    .bindPopup(markerPopUpToString(museum))
                    .on('click', markerOnClick)
            });
            mymap.setView({
                lat: data[0].lat,
                lng: data[0].lon
            })
            museums = data;
        }
    });
}

cityToString = (address) => {
    if (address.hamlet)
        return address.hamlet

    if (address.village)
        return address.village

    if (address.municipality)
        return address.municipality

    return address.city
}

clearAllMarkers = () => {
    mymap.eachLayer((layer) => {
        if (layer instanceof L.Marker)
            mymap.removeLayer(layer);
    });
}

clearCurrentRoute = () => {
    if (currentRoute != null)
        mymap.removeLayer(currentRoute)
}


markerPopUpToString = (data) => `<b>${data.address.tourism}, ${cityToString(data.address)}</b>
<br>${data.address.house_number ? data.address.house_number : ""} ${data.address.road}`


markerOnClick = (selectedMarker) => {
    if (currentPos == null) {
        alert("Impossible de récupérer votre position actuelle")
        return
    }
    clearCurrentRoute()
    // TODO : options for route (see doc)
    L.mapquest.directions()
        .route({
            start: currentPos,
            end: selectedMarker.latlng,
        }, directionsCallback)
}

directionsCallback = (error, response) => {
    currentRoute = L.mapquest.directionsLayer({
        directionsResponse: response
    }).addTo(mymap);
}