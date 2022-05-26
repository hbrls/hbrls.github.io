(function () {
  var $button = document.querySelector('button');
  var $menu = document.querySelector('menu ul');

  $button.addEventListener('click', function () {
    $button.classList.toggle('on');
    $menu.classList.toggle('on');
  });
}());
