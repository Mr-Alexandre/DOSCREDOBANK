import './index.scss'
import './jquery-ui(custom).min.js'
import './jquery-3.3.1.min.js'

$(document).ready(function() {
    var labels = $("#calculation-contribution-range-box").find(".gc-slider-range__lables")[0];
    var prevlabel;
    var colorRed = '#e31e24';
    $("#calculation-contribution-range").slider({
        classes: {
            "ui-slider": "gc-slider-range",
            "ui-slider-handle": "gc-slider-range__thumb",
            "ui-slider-range": "gc-slider-range__track",
            "ui-slider-range-min": "gc-slider-range__track"
        },
        range: "min",
        orientation: "horizontal",
        value: 3,
        min: 0,
        max: 4,
        step: 1,
        create: function( e, ui ) {
            prevlabel = labels.querySelectorAll(`[data-index="3"]`);
            $(prevlabel).css({"color": colorRed});
        },
        slide: function (e, ui) {
            $(prevlabel).css({"color": ''});
            prevlabel = labels.querySelectorAll(`[data-index="${ui.value}"]`);
            $(prevlabel).css({"color": colorRed});
        }
    })
});