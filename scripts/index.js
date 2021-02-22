var mymap
var france

$(() => {
    mymap = L.map('map1').setView([48.8567, 2.3515], 12);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', { attribution: 'PING' }).addTo(mymap);
    $("#search").submit((e) => { e.preventDefault(); submitSearch() });
    $("#country").autocomplete({
        source: listePays(),
        minLength: 3
    });
    $("#btnSearch").button({
        icon: "ui-icon-search"
    })
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
        success: function (data) {
            if (data.length === 0) {
                alert("Aucun lieu ne correspond à votre recherche !")
                return
            }
            mymap.eachLayer(function (layer) {
                if (layer instanceof L.Marker)
                    mymap.removeLayer(layer);
            });
            var marker = L.marker([data[0].lat, data[0].lon]).addTo(mymap);
            marker.bindPopup(`<b>${cityToString(data[0].address) + ", " + data[0].address.country}</b>
                                        <br>${rue === "" ? "" : data[0].address.house_number + " " + data[0].address.road}`);
            mymap.setView(marker.getLatLng())
        }
    });
}

cityToString = (address) => {
    if (address.hamlet) {
        return address.hamlet
    } else if (address.village) {
        return address.village
    } else if (address.municipality) {
        return address.municipality
    } else return address.city
}