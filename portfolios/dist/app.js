(function (Reveal) {
  Reveal.initialize({
    controls: true,
    progress: true,
    history: true,
    center: true,

    theme: Reveal.getQueryHash().theme,
    transition: 'concave',

    // Optional libraries used to extend on reveal.js
    dependencies: [
      { src: 'lib/js/classList.js', condition: function() { return !document.body.classList; } },
      { src: 'plugin/markdown/marked.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
      { src: 'plugin/markdown/markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
      { src: 'plugin/highlight/highlight.js', async: true, callback: function() { hljs.initHighlightingOnLoad(); } },
      { src: 'plugin/zoom-js/zoom.js', async: true, condition: function() { return !!document.body.classList; } },
      { src: 'plugin/notes/notes.js', async: true, condition: function() { return !!document.body.classList; } }
    ]
  });
}(window.Reveal));

(function (argument) {
  var App = {};
  window.App = App;
}());
(function () {
  var App = window.App;
  var $ = window.$;
  var d3 = window.d3;

  var _selector;
  function drawBySelector(selector) {
    return function (words) {
      d3.select(selector)
        .append("g")
          .attr("transform", "translate(480,230)")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", '"League Gothic", Impact, sans-serif')
          .style("fill", function(d, i) { return fills[i]; })
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
    };
  }

  var score_to_font_size = 12;
  var fills = [ "#9c9ede", "#aec7e8", "#ff7f0e", "#ffbb78", "#F7D9B5",
                "#98df8a", "#FFFAD1", "#ff9896", "#FFBF1F", "#c5b0d5",
                "#FAB99A", "#c49c94", "#FFF146", "#f7b6d2", "#7f7f7f",
                "#c7c7c7", "#bcbd22", "#dbdb8d", "#17becf", "#9edae5", ];

  function draw_cloud() {
    $('.skills-cloud').each(function () {
      var words = (new Function("return " + $(this).next().text().trim())());
      for (var i = 0; i < words.length; i++) {
        words[i].size = words[i].size * score_to_font_size;
      }

      d3.layout.cloud()
        .size([960, 400])
        .words(words)
        .padding(8)
        .rotate(function () { return 0; })
        .fontSize(function (d) { return d.size; })
        .on("end", drawBySelector(this))
        .start();
    });
  }

  draw_cloud();
}());