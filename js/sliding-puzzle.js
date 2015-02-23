(function() {
    var aspect = "4:3",
        aspectW = parseInt(aspect.split(":")[0]),
        aspectH = parseInt(aspect.split(":")[1]),
        container = $("#puzzle"),
        imgContainer = container.find("figure"),
        img = imgContainer.find("img"),
        path = img.attr("src"),
        piece = $("<div>"),
        pieceW = Math.floor(img.width() / aspectW),
        pieceH = Math.floor(img.height() / aspectH),
        idCounter = 0,
        positions = [],
        empty = {
            top: 0,
            left: 0,
            bottom: pieceH,
            right: pieceW
        },
        previous = {},
        timer,
        currentTime = {},
        timerDisplay = container.find("#time").find("span");

    for (var x = 0, y = aspectH; x < y; x++) {
        for (var a = 0, b = aspectW; a < b ; a++) {
            var top = pieceH * x,
                left = pieceW * a;

            piece.clone().attr("id", idCounter++).css({
                width: pieceW,
                height: pieceH,
                position: "absolute",
                top: top,
                left: left,
                backgroundImage: ["url(" + path + ")"].join(""),
                backgroundPosition: ["-" + left + "px ", "-" + top + "px"].join("")
            }).appendTo(imgContainer);
            positions.push({top: top, left: left});
        }
    }

    img.remove();
    var firstPiece = container.find("#0").clone();

    $("#start").on("click", function (e) {
        container.find("#0").remove();
        positions.shift();
        $("#start").remove();
        var pieces = imgContainer.children();

        function shuffle(array) {
            var i = array.length;
            if (i === 0) {
                return false;
            }
            while(--i) {
                var j = Math.floor(Math.random() * (i + 1)),
                    tempi = array[i],
                    tempj = array[j];

                    array[i] = tempj;
                    array[j] = tempi;
            }
        }
        shuffle(pieces);
        $.each(pieces, function(i) {
            pieces.eq(i).css(positions[i]);
        });
        pieces.appendTo(imgContainer);
        empty.top = 0;
        empty.left = 0;
        container.find("#ui").find("p").not("#time").remove();

        pieces.draggable({
            containment: "parent",
            grid: [pieceW, pieceH],
            start: function (e, ui) {
                var current = getPosition(ui.helper);
                if (current.left === empty.left) {
                    ui.helper.draggable("option", "axis", "y");
                } else if (current.top === empty.top) {
                    ui.helper.draggable("option", "axis", "x");
                } else {
                    ui.helper.trigger("mouseup");
                    return false;
                }

                if (current.bottom < empty.top ||
                    current.top > empty.bottom ||
                    current.left > empty.right ||
                    current.right < empty.left) {

                    ui.helper.trigger("mouseup");
                    return false;
                }
                previous.top = current.top;
                previous.left = current.left;
            },
            drag: function (e, ui) {
                var current = getPosition(ui.helper);
                ui.helper.draggable("option", "revert", false);

                if (current.top === empty.top && current.left === empty.left) {
                    ui.helper.trigger("mouseup");
                    return false;
                }

                if (current.top > empty.bottom ||
                    current.bottom < empty.top ||
                    current.left > empty.right ||
                    current.right < empty.left) {

                    ui.helper.trigger("mouseup").css({
                        top: previous.top,
                        left: previous.left
                    });
                    return false;
                }
            },
            stop: function (e, ui) {
                var current = getPosition(ui.helper),
                    correctPieces = 0;

                if (current.top === empty.top && current.left === empty.left) {
                    empty.top = previous.top;
                    empty.left = previous.left;
                    empty.bottom = previous.top + pieceH;
                    empty.right = previous.left + pieceW;
                }
            }
        });

        function getPosition(el) {
            return {
                top: parseInt(el.css("top")),
                bottom: parseInt(el.css("top")) + pieceH,
                left: parseInt(el.css("left")),
                right: parseInt(el.css("left")) + pieceW
            }
        }

    });
})();