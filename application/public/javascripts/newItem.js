$(document).ready(function(){
  $('select').formSelect();
});

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