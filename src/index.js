import html from './index.pug';
import style from './index.scss';
import $ from 'jquery';
import './jquery-ui(custom).min.js';
import './jquery.mask';


$(document).ready(function() {
    /* Animation */
    $(".gc-stamp").addClass("gc-stamp_active");
    setTimeout(function(){
        $(".gc-title-cover__car").addClass("gc-title-cover__car_animate");
    }, 200);
    


    var labels = $("#calculation-contribution-range-box").find(".gc-slider-range__lables")[0];
    var prevlabel;
    var colorRed = '#e31e24';
    var period = 1;

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

            period = Number( $(prevlabel).text() );
        },
        slide: function (e, ui) {
            $(prevlabel).css({"color": ''});
            prevlabel = labels.querySelectorAll(`[data-index="${ui.value}"]`);
            $(prevlabel).css({"color": colorRed});

            period = Number( $(prevlabel).text() );
            recalculation();
        }
    })

    /* Inputs mask */
    $(".phone-mask").mask("+996 (999) 999-999");
    $('.money-mask').mask('000 000 000 000 000', {reverse: true});

    $("#opening-amount").keyup(function(){
        recalculation();
    });
    $("#valute-usd").change(function(){
        recalculation();
    });
    $("#valute-kgs").change(function(){
        recalculation();
    });

    
    function recalculation(){
        /* Calc contribution */
        var kgs = $("#valute-kgs").is(":checked");
        var usd = $("#valute-usd").is(":checked");
        var rate;
        var netProfitHTML = $("#net-profit");
        var totalAmountHTML = $("#total-amount");
        
        if (kgs){
            rate = 13;
        }else{
            rate = 2;
        }
        var openingAmount = Number($("#opening-amount").val().replace(/\s/g, ''));

        // Вознаграждение = (Сумма на депозите x 10% x 30 дней) / 360 дней
        var totalAmount = ( openingAmount * rate * 30 )/ period;
        $(totalAmountHTML).text(totalAmount.toFixed(2));
        $(netProfitHTML).text( (totalAmount - openingAmount).toFixed(2) );
    }

});