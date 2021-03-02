var mymap
var france

$(() => {
    L.mapquest.key = 'APz6ucyv6DAiq4lYgVfa2d8DSzKdCTaJ'
    $("body").css({
        opacity: 1
    })
    mymap = L.map('map1',{
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

    L.mapquest.directions().route({
        start: '18 rue de monttessuy, France',
        end: 'One Liberty Plaza, New York, NY 10006'
      });
})

submitSearch = () => {
    var ville = $("#city").val();
    var pays = $("#country").val();
    var rue = $("#street").val();
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
        url: `https://nominatim.openstreetmap.org/search?format=json&limit=1&addressdetails=1&city=${ville}&country=${pays}${rue === "" ? "" : "&street=" + rue}`,
        data: "data",
        dataType: "json",
        success: (data) => {
            if (data.length === 0) {
                alert("Aucun lieu ne correspond à votre recherche !")
                return
            }
            mymap.eachLayer((layer) => {
                if (layer instanceof L.Marker)
                    mymap.removeLayer(layer);
            });
            var marker = L.marker([data[0].lat, data[0].lon]).addTo(mymap);
            marker.bindPopup(`<b>${cityToString(data[0].address) + ", " + data[0].address.country}</b>
                                        <br>${rue === "" ? "" : (data[0].address.house_number ? data[0].address.house_number : "") + " " + data[0].address.road}`);
            mymap.setView(marker.getLatLng())
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