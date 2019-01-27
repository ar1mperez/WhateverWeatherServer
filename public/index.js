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


    /*
    let div = document.getElementById('clothes-container');
    let imgContainer = document.createElement('div');
    imgContainer.innerHTML +=
    '<div id = "formdiv" style = "" class="container">\
    <img src = "images/jacket-alt.png" class="rounded mx-auto d-block embed-responsive-16by9 clothing-image"/>\
    </div>\
    ';
    div.append(imgContainer);
    */
  });
});
