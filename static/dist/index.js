(function () {
  const $btn = d3.select('.container button');
  const $menu = d3.select('.container menu ul');

  $btn.on('click', function () {
    const klass = $btn.attr('class') ? '' : 'active';
    $btn.attr('class', klass);
    $menu.attr('class', klass);
  });
}());
