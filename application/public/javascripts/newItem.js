$(document).ready(function(){
  $('select').formSelect();
});


function display(input) {

  if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
          $('#itemImg')
              .attr('src', e.target.result)
              .width(300)
              .height(300);
      };

      reader.readAsDataURL(input.files[0]);
  }
}