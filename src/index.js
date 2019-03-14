import html from './index.pug';
import style from './index.scss';
import $ from 'jquery';
import './jquery-ui(custom).min.js';
import './jquery.mask';
import WOW from './wow.min.js';

$(document).ready(function() {

    /* Animation */
    var wow = new WOW({
        boxClass:     'wow',      // default
        animateClass: 'animated', // default
        offset:       0,          // default
        mobile:       true,       // default
        live:         true        // default
    });
    wow.init();

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
    });

    /* Top menu link */
    $("#scroll-to-el").click(function(e) {
        e.preventDefault();
        var el = e.target;
        if (el.tagName == "A"){
            var to = $(el).attr('href');
            $([document.documentElement, document.body]).animate({
                scrollTop: $(to).offset().top
            }, 2000);
        }
    });

    /* init edit text */
    recalculation();
    conditions();


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

    /* Calc contribution */
    function recalculation(){
        var kgs = $("#valute-kgs").is(":checked");
        var usd = $("#valute-usd").is(":checked");
        var rate;
        var netProfitHTML = $("#net-profit");
        var totalAmountHTML = $("#total-amount");
        
        if (kgs){
            rate = 13;
        }else{
            rate = 5;
        }
        var openingAmount = Number($("#opening-amount").val().replace(/\s/g, ''));

        // Вознаграждение = (Сумма на депозите x 10% x 30 дней) / 360 дней
        var totalAmount = ( openingAmount * rate * 30 )/ period;
        $(totalAmountHTML).text(totalAmount.toFixed(2));
        $(netProfitHTML).text( (totalAmount - openingAmount).toFixed(2) );
    }

    /* condition */ 
    $("#conditions-usd").change(function(){
        conditions();
    });
    $("#conditions-kgs").change(function(){
        conditions();
    });
    function conditions(){
        var conditionsKgs = $("#conditions-kgs").is(":checked");
        var conditionsUsd = $("#conditions-usd").is(":checked");
        var conditionsMinAmount = $("#conditionsMinAmount");
        var conditionsTerm = $("#conditionsTerm");
        var conditionsMaxAmount = $("#conditionsMaxAmount");
        var conditionsRate = $("#conditionsRate");
        var dataConditions = {};
        if (conditionsKgs){
            dataConditions = {
                "minAmount": "<span style='font-size: 30px'>1 000</span> сомов",
                "maxAmount": "до <span style='font-size: 30px'>500</span> сомов",
                "term": "от <span style='font-size: 30px'>1</span> до <span style='font-size: 30px'>60</span> месяцев",
                "rate": "до <span style='font-size: 30px'>13%</span> годовых + <br>капитализация % <br>каждый месяц"
            }
        }else{
            dataConditions = {
                "minAmount": "<span style='font-size: 30px'>50</span> долларов",
                "maxAmount": "до <span style='font-size: 30px'>7 000</span> долларов",
                "term": "от <span style='font-size: 30px'>1</span> до <span style='font-size: 30px'>60</span> месяцев",
                "rate": "до <span style='font-size: 30px'>5%</span> годовых + <br>капитализация % <br>каждый месяц"
            }
        }
        conditionsMinAmount.html(dataConditions['minAmount']);
        conditionsTerm.html(dataConditions['term']);
        conditionsMaxAmount.html(dataConditions['maxAmount']);
        conditionsRate.html(dataConditions['rate']);
    }

});