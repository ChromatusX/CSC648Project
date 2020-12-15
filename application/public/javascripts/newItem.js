$(document).ready(function(){
  $('select').formSelect();
});

function checkImage() {
  alert("TESTING");
  var fileInput = document.getElementById('newpic').file;
  if(fileInput == ""){
    alert("NOTHING");

    document.getElementById('newpic').files[0] = document.getElementById('holderpic').files[0];
  }
}

function display(input) {

  if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
          $('#itemImg')
              .attr('src', e.target.result)
              .width(400)
              .height(400);
      };

      reader.readAsDataURL(input.files[0]);
  }
}