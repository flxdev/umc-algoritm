//new funcrtion

$('.js-mob-menu').off('click touchstart').on('click ', function(e){
    $('.mob-menu').toggleClass('active');
    $('html').toggleClass('menu-active');
})

var mob_menu = $('.mob-menu .wrap-list');
mob_menu.each(function(){
    var _t = $(this);
    _t.off('click ').on('click', function(e){
        var second = _t.find('.second-level'),
            second_item = second.find('li');
        if(_t.hasClass('visible')){
            if(second.is(e.target) || second_item.is(e.target)){
                console.log('qq')
                return false;
            } else {
                console.log('dd')
                _t.removeClass('visible');
                return false;
            }
            _t.removeClass('visible');
            return false;
        } else {
            _t.addClass('visible').siblings().removeClass('visible');
            return false;
        }
    });
});

var elem = $('.mob-menu-btn-wrap'),
    window_w = $(window).width();

if (window_w <= 940){
    fixMenu(elem);
}
$(window).resize(function(){
    window_w = $(window).width();
    if (window_w <= 940){
        elem.show();
        fixMenu(elem);
    } else {
        elem.hide();
    }
});

function fixMenu (elem){
    $(window).scroll(function() {
        if($(window).scrollTop() > 150) {
            elem.addClass('fixed'); 
        } else {
            elem.removeClass('fixed');
        }
    });
}

$('.phone-list-js').on('click', function(){
    $(this).find('.phone-list').toggleClass('phone-list-active');
});

$(document).on('click', function(e){
    var div = $(".phone-list-js"); 
    if (!div.is(e.target) && div.has(e.target).length === 0) {
        $('.phone-list').removeClass('phone-list-active');
    }
});

$('.accard-title').on('click', function(){
    $(this).toggleClass('accard-title-active')
    $(this).next().toggleClass('accard-wrap-active');
});
//end new funcrtion