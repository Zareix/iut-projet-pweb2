var toRedirect;

$(() => {
    $("body").css("opacity", 1);

    $("li").draggable({
        revert: "invalid"
    });

    $("ul").droppable()
    $("#droppable").droppable({
        drop: function (event, ui) {
            $(this)
                .droppable('option', 'accept', ui.draggable)
                .addClass("ui-state-highlight")
                .find("p")
                .html("Choix effectué !")
            $("a").show()
            toRedirect = "pages/" + ui.draggable.attr('id');
        },
        out: function (event, ui) {
            $(this)
                .droppable("option", "accept", ".ui-draggable")
                .removeClass("ui-state-highlight")
                .find("p")
                .html("Placez votre choix ici !")
            $("a").hide()
        }
    });

    $("#valider").click(() => redirect(toRedirect));
})

const redirect = (link) => {
    $("#valider")
        .css({
            position: "relative",
            top: -600,
            width: window.innerWidth,
            height: window.innerHeight + 100,
            backgroundColor: "white",
            borderColor: "white"
        })
        .find("div").fadeOut()

    setTimeout(() =>
        window.location.href = link
        , 1000);
}