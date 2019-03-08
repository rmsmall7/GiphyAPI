//Flow process for this javascrip:
//create variables that will be used:
    // animal arrays, images, image limits
//create the function that will activate the buttons based on the animal array
//Allow the user to add their own animal to the array and create a button
// Need to test to make sure there are images retured for the animal added.   /   // if there is not need to alert the user
  // and clear the warning before proceeding
  //create a call to the giphy api and get the image and rating
//create a div for the images and the ratings
//create still and automated states for the returned images



// This is the initial array.
var myAnimals = [
  "French Bulldog", "Dog", "Cat", "Horse", "Chicken", "Donkey", "Goat", "Parrot", "Fish"];

var animalImage = "";

// wanted to use this variable in the querly url but it didn't work.  This does work in 
//funtion to test if there are at least 10 itmes to display
var imageLimit = 10;

// This function will populate the buttons based on the "myAmimals" array above
function showButtons() {
  $("#buttonItems").empty();
  $("#inputAnimal").val("");
  for (var i = 0; i < myAnimals.length; i++) {
    var button = $("<button class='btn btn-primary'>");
    button.addClass("animal");
    button.attr("animal-name", myAnimals[i]);
    button.text(myAnimals[i]);
    $("#buttonItems").append(button);
    $("#buttonItems").append(" ");
  }
}


showButtons();
// once the user adds their animal and clicks "Add animal" button this will run and create a button for the animal they listed.  Then the user will be able to click on it to display the animal
$("#addAnimal").on("click", function (event) {
  $("#entry").empty();
  event.preventDefault();
  var animalInput = $("#inputAnimal").val().trim();
  var animalTerm = $(this).attr("animal-name");

  // This will test to ensure there are at least 10 images to display.  if not the user will get
  //a message

  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + animalTerm + "&limit=2&api_key=dc6zaTOxFJmzC";

  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function (response) {
    if (response.pagination.total_count >= imageLimit) {
      myAnimals.push(animalInput);
      showButtons();
    } else if (response.pagination.total_count === 0) {
      $("#entry").html(" There are no images to display.  Try again");
    } else if (response.pagination.total_count === 1) {
      $("#entry").html(" There is only 1 image to display.  Try again");
    } else {
      $("#entry").html(" Opps " + response.pagination.total_count + " results for this.  Please select another ");
    }
    $("#inputAnimal").val("");
  });
});
$(document).on("click", ".animal", display);

function display() {
  // If the user gets an error then need to clear that by running this function
  $("#entry").empty();
  var animalTerm = $(this).attr("animal-name");
  var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + animalTerm + "&limit=10&api_key=dc6zaTOxFJmzC";
  $.ajax({
    url: queryURL,
    method: "GET"
  }).done(function (response) {

    // this funciton will complete to display the giphs from the url
    for (var a = 0; a < response.data.length; a++) {

      // retrives the animated url
      var active = response.data[a].images.fixed_width.url;
      // retreives the still image
      var still = response.data[a].images.fixed_width_still.url;
      // retreives the rating for the image
      var rating = "Rating: " + (response.data[a].rating).toUpperCase();
      // Creates the new img item
      var animalImage = $("<img>");

      // Created a new div for the ratings and listed the attributes for the active and still images
      var ratingDiv = $("<div id='ratingDiv'>" + rating + "</div>");

      animalImage.attr({
        "active": active,
        "still": still,
        "src": still,
        "state": "still"
      });
      // Div for the rating and image.  Want to ensure the rating is on top of the images.
      var ratingAndImage = $("<div>");
      $(ratingAndImage).css({
        "float": "left"
      });
      $(ratingAndImage).prepend(ratingDiv, animalImage);
      // This will add the rating.
      $("#ratings").prepend(ratingAndImage);
      // starting or stopping animation depending on users click
      $(animalImage).on("click", function (event) {
        // This will clear error messages if there is one
        $("#entry").empty();

        var state = $(this).attr("state");
        if (state === "still") {
          $(this).attr("src", $(this).attr("active"));
          $(this).attr("state", "active");
        } else {
          $(this).attr("src", $(this).attr("still"));
          $(this).attr("state", "still");
        }
      });
    }
  });
}