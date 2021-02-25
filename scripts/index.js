$(() => {
    $("li").draggable({
        revert: "invalid"
    });
    $("#droppable").droppable({
        drop: function (event, ui) {
            $(this)
                .droppable('option', 'accept', ui.draggable)
                .addClass("ui-state-highlight")
                .find("p")
                .html("Choix effectué !")
            $("a")
                .show()
                .attr("href", ui.draggable.attr('id'))
        },
        out: function (event, ui) {
            $(this)
                .droppable("option", "accept", ".ui-draggable")
                .removeClass("ui-state-highlight")
                .find("p")
                .html("Placez votre choix ici !")

            $("a")
                .hide()
                .attr("disabled", "true")

        }
    });

    $("ul").droppable()
})