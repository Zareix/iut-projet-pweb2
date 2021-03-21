var mymap
var france
var museums
var currentPos
var currentRoute

$(() => {
    $("body").css("opacity", "1")

    L.mapquest.key = 'APz6ucyv6DAiq4lYgVfa2d8DSzKdCTaJ'
    mymap = L.map('map1', {
        center: [48.85, 2.35],
        layers: L.mapquest.tileLayer('map'),
        zoom: 12
    });

    $(".search").submit((e) => { e.preventDefault(); submitSearch() });
    $("#country").autocomplete({
        source: listePays(),
        minLength: 3
    });
    $("#btnSearch").button({
        icon: "ui-icon-search"
    })
    $("#vehicule").selectmenu();

    $(".entree").css("width", "100%")

    getCurrentPos()
})

getCurrentPos = () => {
    navigator.geolocation.getCurrentPosition((pos) => currentPos = { lat: pos.coords.latitude, lon: pos.coords.longitude })
}

submitSearch = () => {
    var ville = $("#city").val();
    var pays = $("#country").val();
    if (ville === "") {
        alert("Merci de renseigner une ville ou un établissement");
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
                    .bindPopup(museumToString(museum))
                    .on('click', markerOnClick)
            });
            mymap.setView({
                lat: data[0].lat,
                lng: data[0].lon
            })
            museums = data;

            museums.forEach(museum =>
                $("#espaceMusees").append("<li class='museum'>" + museumToString(museum) + "</li>")
            )
            $("#espaceMusees").css({
                borderWidth: "2px",
                borderStyle: "solid",
                borderRadius: "20px"
            })
            $(".museum")
                .css({
                    margin: "1rem",
                })
        }
    });
}

cityToString = (address) => {
    if (address.hamlet)
        return address.hamlet

    if (address.village)
        return address.village

    if (address.town)
        return address.town

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


museumToString = (data) => `<b>${data.address.tourism}, ${cityToString(data.address)}</b>, ${data.address.house_number ? data.address.house_number : ""} ${data.address.road}`


markerOnClick = (selectedMarker) => {
    if (currentPos == null) {
        alert("Impossible de récupérer votre position actuelle")
        return
    }
    clearCurrentRoute()
    // TODO : options for route (see doc)
    console.log($("#vehicule").val())
    var routetype = $("#vehicule").val()
    L.mapquest.directions().route({
        start: currentPos,
        end: selectedMarker.latlng,
        options: {
            routeType: routetype
        }
    }, directionsCallback)
}

directionsCallback = (error, response) => {

    if (response.info.statuscode != 0)
        alert("Impossible de trouver un chemin vers ce lieu avec ce type de déplacement !")
    else {
        indicateDistance(response.route)
        currentRoute = L.mapquest.directionsLayer({
            startMarker: {
                icon: 'circle',
                iconOptions: {
                    size: 'sm',
                    primaryColor: '#000000',
                    secondaryColor: '#FFFFFF',
                    symbol: 'D'
                }
            },
            endMarker: {
                icon: 'via',
                iconOptions: {
                    size: 'sm',
                    primaryColor: '#000000',
                }
            },
            routeRibbon: {
                color: "#2aa6ce",
                opacity: 0.9,
                showTraffic: false
            },
            directionsResponse: response
        }).addTo(mymap);
    }

}

indicateDistance = (route) => {
    var distance = route.distance >= 1 ? route.distance + " km" : route.distance * 1000 + " mètres"

    $("#distance")
        .html("Vous êtes à <b>" + distance + "</b> de ce musée.<br> Vous devriez y arriver en <b>" + route.formattedTime + "</b> (en hh:mm:ss)" )
        .css({
            textAlign: "center",
            marginTop: "1.5rem"
        });
}
