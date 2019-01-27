$( document ).ready(function() {
  $.ajax({
      type: "GET",
      dataType: 'json',
      url: "/api",
      success: function (data) {
          /*if (data.status != "FAILED") {
              if(data.isOK != NULL) {
              }
          } else {
          }*/
          //console.log("We did it bois");
      },
      error: function (data) {
          //alert('An error occurred.');
          //console.log(data);
      }
  })
  .done (function(data) {
    let initialText = document.getElementById('initial-text');
    console.log(data.weather);
    initialText.innerHTML += data.temp + "°C in " + data.city;


    let i = 0;

    //for (i = 0; i < 3 i ++) {

        let div = document.getElementById('clothes-container');
        let imgContainer = document.createElement('div');
        imgContainer.classList.add('weather-box');

        let newImage = document.createElement("img");
        newImage.src = "images/1.png";//+data.tops[i];
        newImage.classList.add("rounded");
        newImage.classList.add("mx-auto");
        newImage.classList.add("d-block");
        newImage.classList.add("embed-responsive-16by9");
        newImage.classList.add("clothing-image");
        imgContainer.append(newImage);
        div.append(imgContainer);
    //}
    /*
    imgContainer.innerHTML +=
    '<div class="weather-box">\
    <img src = "images/1.png" class="rounded mx-auto d-block embed-responsive-16by9 clothing-image"/></div>\
    <div class="weather-box">\
    <img src = "images/3.png" class="rounded mx-auto d-block embed-responsive-16by9 clothing-image"/></div>\
    ';
    */
    div.append(imgContainer);
    /*
    let i = 0;
    for (i = 0; i < 3; i++) {
      if (data.tops[i] != null) {
        let div = document.getElementById('clothes-container');
        let imgContainer = document.createElement('div');
        imgContainer.innerHTML +=
        '<div id = "formdiv" style = "" class="container">\
        <img src = "images/" class="rounded mx-auto d-block embed-responsive-16by9 clothing-image"/>\
        </div>\
        ';
        div.append(imgContainer);

      }

    }

    */


  });
});
