// TODO: make it responsive??
// TODO: Change the randomizing method (certain patterns are created)


// The names of all the images that can be used as cards
// TODO: Fetch image names dynamically, by placing them in a
// TODO: subdirectory of images, and fetching all file names there
var images = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
];

// The number of attempts so far (Global Variable)
var tries = 0;
// The total number of cards (Global Variable)
var gameSize = 0;

// Starts the game
// ? Currently runs whenever the user clicks the "Start" button
function startGame() {
    // Gets the size of the game (total number of cards)
    // Based on radio selection by the user
    // TODO: Change size dynamically
    // TODO: (taking numerical input from the user)
    // TODO?: or simply cal the options "easy, medium, hard, etc."
    var size = document.getElementsByName("size");
    for (var i = 0; i < size.length; i++) {
        if (size[i].checked == true) {
            gameSize = size[i].value;
            break;
        }
    }
    // Clears the page
    document.getElementById("StartMenu").innerHTML = "";

    // Creates puzzle based on the user's game size choice
    switch (gameSize) {
        case "16":
            createPuzzle(4, 4);
            break;
        case "20":
            createPuzzle(4, 5);
            break;
        case "24":
            createPuzzle(4, 6);
            break;
        case "30":
            createPuzzle(5, 6);
            break;
        case "36":
            createPuzzle(6, 6);
            break;
    }
}

// Creates puzzle based on the given width & height
function createPuzzle(x, y) {
    // TODO: Refactor how the pairs' locations are assigned

    shuffle(images);
    // Saves the images used once.
    // (So they can have their pair inserted later in a different position)
    // ? This is a sub-optimal way of assigning the pairs' locations
    var imagesUsed = [];
    var innerHtml = document.getElementById("StartMenu").innerHTML;

    // Changes the contents of the main div to start the game
    // TODO: use += to simplify syntax?
    document.getElementById("StartMenu").innerHTML =
        innerHtml +
        `
        <center>
        <table><tr><td>
        <button onclick="location.reload();" class="button" style="vertical-align:middle"><span>Restart </span></button> </td> 
        <td>
        <p id="tries">Tries = ${tries}</p>
        </td></tr> 
    `;

    // TODO: the var x actually refers to the y-xis & vice versa
    for (var i = 0; i < x / 2; i++) {
        for (var j = 0; j < y; j++) {
            // TODO: change var name to avoid confusion with similar vars
            innerHtml = document.getElementById("puzzlePics").innerHTML;
            var used = images.pop();
            imagesUsed.push(used);

            // !Hard-coded image file name (extension)
            // !Bad id naming (relies on puzzle being smaller than 10*10)
            document.getElementById("puzzlePics").innerHTML =
                innerHtml +
                `<button onclick="test(id)" id="${i}${j}" class='imgButton'><img  class="card"
            src="images/${used}.png"></button>`;
        }
        innerHtml = document.getElementById("puzzlePics").innerHTML;
        document.getElementById("puzzlePics").innerHTML = innerHtml + "<br>";
    }
    shuffle(imagesUsed);
    for (var i = x / 2; i < x; i++) {
        for (var j = 0; j < y; j++) {
            var innerHtml = document.getElementById("puzzlePics").innerHTML;
            document.getElementById("puzzlePics").innerHTML =
                innerHtml +
                `<button onclick="test(id)" id="${i}${j}" class='imgButton'><img  class="card" src="images/${imagesUsed.pop()}.png" ></button>`;
        }
        innerHtml = document.getElementById("puzzlePics").innerHTML;
        document.getElementById("puzzlePics").innerHTML = innerHtml + "<br>";
    }

    innerHtml = document.getElementById("StartMenu").innerHTML;
    document.getElementById("StartMenu").innerHTML = innerHtml + `</center>`;
}

// To monitor if a first card was flipped, the ID of previous card,
// and the number of pairs correctly guessed
var imgsClicked = 0;
var prevID = 00;
var imgsRmvd = 0;

function test(x) {
    document.getElementById(x).firstChild.style.visibility = "visible";
    imgsClicked++;
    if (imgsClicked == 1) {
        prevID = x;
    }
    else if (imgsClicked == 2) {
        tries++;
        document.getElementById("tries").innerHTML = `Tries = ${tries}`;
        // Checks if the image src of last flipped card is the same as
        // the one clicked now. And if it is not the same card
        // clicked twice (by checking their ids)
        if (
            document.getElementById(x).firstChild.src ==
            document.getElementById(prevID).firstChild.src &&
            x != prevID
        ) {
            imgsRmvd++;
            setTimeout(function () {
                window.alert("Correct with" + imgsRmvd + "/" + gameSize / 2);
                var pic1 = document.getElementById(x);
                var pic2 = document.getElementById(prevID);
                pic1.style.opacity = 0;
                pic2.style.opacity = 0;
                pic1.removeChild(pic1.firstChild);
                pic2.removeChild(pic2.firstChild);
                if (imgsRmvd == gameSize / 2) {
                    document.getElementById(
                        "puzzlePics"
                    ).innerHTML = `<center><p id="finish"> Congratulations You finished after ${tries} Tries</p></center>`;
                }
            }, 100);
        } else {
            // TODO: The timeout after a wrong answer is too short
            // ! However, extending it and clicking on a new card before
            // ! it collapses causes the first card to be stuck face up
            setTimeout(function () {
                document.getElementById(x).firstChild.style.visibility = "collapse";
                document.getElementById(prevID).firstChild.style.visibility =
                    "collapse";

            }, 100);
        }
        imgsClicked = 0;
    }
}

// Shuffles the contents of an array
// Sets the position of each element to a random index
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        // Only cool people use this syntax
        // https://cdn.vox-cdn.com/thumbor/kaZncwF8bwIdI9uSIleQxP07aOk=/0x0:1409x785/920x613/filters:focal(622x252:846x476):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/55701647/Screen_Shot_2017_07_13_at_1.09.20_PM.0.png
        // Swaps the two elements of the array
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
