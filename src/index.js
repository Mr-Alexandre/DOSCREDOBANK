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


    /* Inputs mask */
    $(".phone-mask").mask("+996 (999) 999-999");
    $('.money-mask').mask('000 000 000 000 000', {reverse: true});


    /* Сalculation of the contribution */
    var _kgs = $("#valute-kgs");
    var _usd = $("#valute-usd");
    var _RangeLabels = $("#calculation-contribution-range-box").find(".gc-slider-range__lables")[0];
    var _RangeLength = Number( $("#calculation-contribution-range-box").attr('data-val-length') );
    var _prevRangeLabel;
    var _interestRateHTML = $('#interest-rate');
    var _CurentPeriod;
    var _colorRed = '#e31e24';
    var _interestRate = {
        kgs: {
            '1-2': 2,
            '3-5': 3,
            '6-8': 5,
            '9-11': 6.5,
            '12-60': 10.5
        },
        usd: {
            '1-2': 2,
            '3-5': 2.5,
            '6-8': 3,
            '9-11': 3.5,
            '12-60': 5
        },
        rub: {
            '1-2': 2,
            '3-5': 4.5,
            '6-8': 5,
            '9-11': 5.5,
            '12-60': 8
        },
        eur: {
            '1-2': 0.5,
            '3-5': 1,
            '6-8': 1.5,
            '9-11': 2,
            '12-60': 3
        }
    };
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
        max: _RangeLength - 1,
        step: 1,
        create: function( e, ui ) {
            
            _prevRangeLabel = _RangeLabels.querySelectorAll(`[data-index="3"]`);
            $(_prevRangeLabel).css({"color": _colorRed});

            _CurentPeriod = $(_prevRangeLabel).text();
            var rate = getCurrencyAndRate()["rate"];
            _interestRateHTML.text(rate+'%');
        },
        slide: function (e, ui) {
            $(_prevRangeLabel).css({"color": ''});
            _prevRangeLabel = _RangeLabels.querySelectorAll(`[data-index="${ui.value}"]`);
            $(_prevRangeLabel).css({"color": _colorRed});

            _CurentPeriod = $(_prevRangeLabel).text();
            recalculation();
            var rate = getCurrencyAndRate()["rate"];
            _interestRateHTML.text(rate+'%');
        }
    });


    $("#opening-amount").keyup(function(){
        recalculation();
    });
    $("#valute-usd").change(function(){
        recalculation();
        var rate = getCurrencyAndRate()["rate"];
        _interestRateHTML.text(rate+'%');
    });
    $("#valute-kgs").change(function(){
        recalculation();
        var rate = getCurrencyAndRate()["rate"];
         _interestRateHTML.text(rate+'%');
    });

    function recalculation(){
        
        var netProfitHTML = $("#net-profit");
        var totalAmountHTML = $("#total-amount");
        var openingAmount = Number($("#opening-amount").val().replace(/\s/g, ''));
        var rate = getCurrencyAndRate()["rate"];
        var period = Number( _CurentPeriod.charAt(0) ); 
        
        var totalAmount = calculationDeposits(1, period, rate, openingAmount);
        $(totalAmountHTML).text(totalAmount.toFixed(2));
        $(netProfitHTML).text( (totalAmount - openingAmount).toFixed(2) );
        
    }
    function calculationDeposits(i, per, _percent, _amount) {
        // Вознаграждение = ( Сумма на депозите x 10.5%/12 ) 
        var monthlyPercent = ( _amount * (_percent/100) )/12;
        var monthlyPayments = _amount + monthlyPercent; 
        if (i == per){
            return monthlyPayments;
        }
        if (i < per) {
            return calculationDeposits(i + 1, per, _percent, monthlyPayments);
        }
    }
    
    function getCurrencyAndRate(){
        var currency = '';
        if ( _kgs.is(":checked") ){
            currency = 'kgs';
        }else if ( _usd.is(":checked") ){
            currency = 'usd';
        }

        return {"currency": currency, "rate": _interestRate[currency][_CurentPeriod]};
    }

    /* init edit text */
    recalculation();
    conditions();

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


    /* Modal window */

    var modal = $('#modal');
    var modalClose = $('#modal .gc-modal-container__close');
    var btnModalClose = $('#modal #btn-modal-close');
    var btmModalSend = $('#modal-send');
    modalClose.click(function(){
        modal.hide();
    });
    btnModalClose.click(function(){
        modal.hide();
    });

    
    // btmModalSend.click(function(e){
        
    // })
    $(".trafficwave_form").submit(function (event) {
        event.preventDefault();
        var form = event.target;
        console.log($(form).serialize());
        console.log($(this).serializeArray());
        var data = {
            "uuid": "e3675e62-f4e5-4929-a941-3a7c053e1b29",
            "info": {},
            "url": window.location.href,
            "comment": ""
        };
        var fields = [ 
            {"request_key": "phone", "form_id": "#phone"}, 
            // {"request_key": "full_name", "form_id": "#full_name"}|#phone"}, 
            {"request_key": "full_name", "form_id": "#full_name"}
        ];
        for (var i=0; i < fields.length; i++) { 
            data["info"][fields[i].request_key] = $(fields[i].form_id).val(); 
        }
        // $.ajax(   
        //     // Unknown macro: {type}
        // );
        // modalThanks();
    });


    function modalThanks(){
        modal.find('.gc-modal-container_form').hide();
        modal.find('.gc-modal-container_thanks').show();
        
    }
    function showModal(type) {
        if (type == 'form'){
            modal.find('.gc-modal-container_form').show();
            modal.find('.gc-modal-container_thanks').hide();
            
        }else{
            modal.find('.gc-modal-container_form').hide();
            modal.find('.gc-modal-container_thanks').show();
        }
        modal.show();
    }


    var listBtnOpenForm = document.querySelectorAll('#open-modal-form');
    for (var i = 0; i < listBtnOpenForm.length; i++) {
        $(listBtnOpenForm[i]).click(function(){
            showModal('form');
        });
    }

});