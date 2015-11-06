// helpers func for class 

function addEvent(el, event, callback) {
    var check1 = el === window || el === document;

    if (el !== undefined && el.nodeType) {
        var pro = el.nodeType;
    } else {
        pro = undefined;
    }

    var check2 = pro != 1 && el.length > 1;

    if (!check1 && check2) {
        var temp = undefined;

        Array.prototype.forEach.call(el, function(item) {
            temp = item;
            on(temp, event, callback);
        });

        return;
    }

    on(el, event, callback);
}

function on(el, event, callback) {
    if (el.addEventListener) {
        el.addEventListener(event, callback, false);
    } else if (el.attachEvent) {
        el.attachEvent(event, callback);
    }
}

// eventemitter

function EventEmitter() {
    this.on = function(event, handler) {
        if (!this._listHandlers) {
            this._listHandlers = {}
        }

        if (!this._listHandlers[event]) {
            this._listHandlers[event] = [];
        }

        this._listHandlers[event].push(handler);
    };

    this.off = function(event, handler) {
        var handlers = this._listHandlers && this._listHandlers[event];

        if (!handlers) {
            return;
        }

        for (var i = 0; i <= handlers.length; i++) {
            if (handlers[i] == handler) {
                handlers.splice(i - 1, 1);
            }
        }
    };

    this.emit = function(event) {
        if (!this._listHandlers || !this._listHandlers[event]) {
            return;
        }

        var handlers = this._listHandlers[event];

        for (var i = handlers.length - 1; i >= 0; i--) {
            handlers[i].apply(this, arguments);
        }
    };
}

var eventer = new EventEmitter();

// config map

eventer.on('loadmap', function() {
    createMap({
        selecter: '.map',
        coord: 'data-coord',
    });
});

// slider

// 0-0index

$('.card-slider').slick({
    dots: true,
    fade: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    adaptiveHeight: true
});

// 2-4avtopark-vntr, 2-5ploschadki...

$('.angel_slider').slick({
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true
});

// 3-1category

$('.feedback_slider').slick({
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    adaptiveHeight: true
});

// fancybox

$(document).ready(function() {
    $(".gallaries").fancybox({
        tpl: {
            closeBtn: '<button class="btn btn-overlay-close">Закрыть</button>',
            prev: '<button class="slick-prev slick-arrow"></button>',
            next: '<button class="slick-next slick-arrow"></button>'
        },
        autoResize: true,
        autoCenter: true,
        maxWidth: 480,
        openEffect: 'fade',
        openSpeed: 300,
        openOpacity: true
    });
});

// tabs

// jQuery(document).ready(function($){
//     var tabs = $('.tabs');

//     tabs.each(function(){
//         var tab = $(this),
//             tabItems = tab.find('ul.tabs-navigation'),
//             tabContentWrapper = tab.children('.tabs-content'),
//             tabNavigation = tab.find('.tabs-navigation');

//         tabItems.on('click', 'a', function(event){
//             event.preventDefault();
//             var selectedItem = $(this);
//             if( !selectedItem.hasClass('active_link') ) {
//                 var selectedTab = selectedItem.data('content'),
//                     selectedContent = tabContentWrapper.find('li[data-content="'+selectedTab+'"]');

//                 tabItems.find('a.active_link').removeClass('active_link');
//                 selectedItem.addClass('active_link');
//                 selectedContent.addClass('active_tab').siblings('li').removeClass('active_tab');

//                 var slectedContentHeight = selectedContent.innerHeight();
//                 tabContentWrapper.animate({
//                     'height': slectedContentHeight
//                 }, 200);
//                 eventer.emit('loadmap');
//             }
//         });

//         checkScrolling(tabNavigation);
//         tabNavigation.on('scroll', function(){ 
//             checkScrolling($(this));
//         });
//     });

//     $(window).on('resize', function(){
//         tabs.each(function(){
//             var tab = $(this);
//             checkScrolling(tab.find('.tabs-navigation'));
//             tab.find('.tabs-content').css('height', 'auto');
//         });
//     });

//     function checkScrolling(tabs){
//         var totalTabWidth = parseInt(tabs.width()),
//             tabsViewport = parseInt(tabs.width());
//         if( tabs.scrollLeft() >= totalTabWidth - tabsViewport) {
//             tabs.parent('.tabs').addClass('is-ended');
//         } else {
//             tabs.parent('.tabs').removeClass('is-ended');
//         }
//     }
// });

// scroll menu 

(function() {
    var nav = document.querySelector('.header .nav');
    srollToElem(nav);

    function srollToElem(elem) {
        var flagScrollElem = false;

        addEvent(window, 'scroll', function(e) {
            var elemSize = elem.getBoundingClientRect();
            var parentElemSize = elem.parentNode.parentNode.getBoundingClientRect();

            if (elemSize.top <= 0 && !flagScrollElem) {
                elem.classList.add('scroll-nav-active');
                flagScrollElem = true;
            } else if (elemSize.bottom <= parentElemSize.bottom) {
                flagScrollElem = false;
                elem.classList.remove('scroll-nav-active');
            }
        });
    }
})();

/**
 * Overlay is class that creates new overlay
 * @param {object} config 
 * */
function Overlay(config) {
    this.overlay = config.elem;
    this.scroll = config.scroll;
    this.statusScroll = true;
    this.callback = config.eventOpen;

    this.open = function() {
        this.overlay.classList.add('open');
        _scrollActive();

        _sizingOverlay();
        this.overlay.scrollTop = 0;

        if (this.callback) {
            this.callback();
        }
    }.bind(this);

    this.close = function() {
        this.overlay.classList.remove('open');
        _scrollActive();
    }.bind(this);

    var _closeBtn = config.closeBtn;
    var _openBtn = config.openBtn;
    var _activePlace = config.activePlace;
    var _eventEmmiter = addEvent.bind(this);

    var _sizingOverlay = function() {
        var sizes = this.overlay.querySelector('.' + _activePlace).getBoundingClientRect();

        if (sizes.height >= window.innerHeight) {
            this.overlay.classList.add('big-overlay');
        } else if (this.overlay.classList.contains('big-overlay')) {
            this.overlay.classList.remove('big-overlay');
        } else {
            return;
        }
    }.bind(this);

    var _scrollActive = function(callback) {
        if (!this.scroll) {
            return;
        }

        var overflow = document.body || document.documentElement.body,
            target = overflow.classList;

        if (this.statusScroll) {
            target.add('no-scroll');
            if (callback) {
                callback();
            }
            return this.statusScroll = false;
        } else {
            target.remove('no-scroll')
            return this.statusScroll = true;
        }
    }.bind(this);

    var _findControlElem = function(id) {
        if (!id) {
            return false;
        }

        var id = '.' + id.toString();

        if (document.querySelectorAll(id).length > 1) {
            return document.querySelectorAll(id);
        }
        var item = document.querySelector(id);

        if (!item) {
            return false;
        }

        return item;
    };

    if (!this.overlay) {
        return;
    }

    _eventEmmiter(_findControlElem(_activePlace), 'click', function(e) {
        var e = e || window.event;
        e.stopPropagation();
    });
    _eventEmmiter(_findControlElem(_closeBtn), 'click', this.close);
    _eventEmmiter(this.overlay, 'click', this.close);
    _eventEmmiter(_findControlElem(_openBtn), 'click', this.open);
}

// overlay

// var overlayDoc = new Overlay({
//     elem: document.querySelector('.overlay_doc'),
//     scroll: true,
//     closeBtn: 'btn-overlay-close',
//     openBtn: 'card-fourth',
//     activePlace: 'active-overlay-place',
//     eventOpen: function () {
//         eventer.emit('loadgalary')
//     }
// });

var overlayFeedBack = new Overlay({
    elem: document.querySelector('.overlay_feedback'),
    scroll: true,
    closeBtn: 'btn-overlay-close',
    openBtn: 'btn-feedback',
    activePlace: 'active-overlay-place'
});

var overlayWrite = new Overlay({
    elem: document.querySelector('.overlay_write'),
    scroll: true,
    closeBtn: 'btn-overlay-close',
    openBtn: 'btn-write-overlay',
    activePlace: 'active-overlay-place'
});

var overlayQuestion = new Overlay({
    elem: document.querySelector('.overlay_question'),
    scroll: true,
    closeBtn: 'btn-overlay-close',
    openBtn: 'btn-question',
    activePlace: 'active-overlay-place'
});

var overlayCall = new Overlay({
    elem: document.querySelector('.overlay_call'),
    scroll: true,
    closeBtn: 'btn-overlay_call',
    openBtn: 'btn-call',
    activePlace: 'active-overlay-place'
});

var overlayMap = new Overlay({
    elem: document.querySelector('.overlay_map'),
    scroll: true,
    closeBtn: 'btn-overlay_map',
    openBtn: 'btn-where',
    activePlace: 'active-overlay-place'
});

var overlaySuccess = new Overlay({
    elem: document.querySelector('.overlay_success'),
    scroll: true,
    closeBtn: 'btn-overlay_close',
    activePlace: 'active-overlay-place'
});

// let blocks have equal height

var equalheight = function(container) {
    var currentTallest = 0,
        currentRowStart = 0,
        rowDivs = new Array(),
        $el, topPosition = 0;
    $(container).each(function() {
        $el = $(this);
        $($el).height('auto');
        topPostion = $el.position().top;
        if (currentRowStart != topPostion) {
            for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
                if (window.CP.shouldStopExecution(1)) {
                    break;
                }
                rowDivs[currentDiv].height(currentTallest);
            }
            rowDivs.length = 0;
            currentRowStart = topPostion;
            currentTallest = $el.height();
            rowDivs.push($el);
            window.CP.exitedLoop(1);
        } else {
            rowDivs.push($el);
            currentTallest = currentTallest < $el.height() ? $el.height() : currentTallest;
        }
        for (currentDiv = 0; currentDiv < rowDivs.length; currentDiv++) {
            if (window.CP.shouldStopExecution(2)) {
                break;
            }
            rowDivs[currentDiv].height(currentTallest);
        }
        window.CP.exitedLoop(2);
    });
};

function equalBlocks(select) {
    addEvent(window, 'load', function() {
        equalheight(select);
    });

    addEvent(window, 'resize', function() {
        equalheight(select);
    });
}

// 2-2instructorys, 2-1prepodavateli

equalBlocks('.grid .card-middle');

// 2-0obuchenie

equalBlocks('.wrapper .equal-field');

// 2-1prepodavateli-vntr, 2-2instructory-vntr

equalBlocks('.right-column .column');

// 0-0index

equalBlocks('.multi-column .hot-card');

// map initialization
(function() {

    if (!document.querySelector('.map')) {
        return;
    }

    addEvent(window, 'load', function() {
        eventer.emit('loadmap');
    });
})();

// navigation 

function dropdownMenu(select) {
    var menu = document.querySelectorAll(select);

    addEvent(menu, 'click', function(e) {
        var e = e || window.e;
        var target = e.target || e.srcElement;
        var check;

        while (target != document) {
            check = target.classList.contains('wrap-list') && this.contains(target);

            if (check && target.classList.contains('active_link')) {
                break;
            }

            target = target.parentNode;
        }

        if (target == document || !target) {
            return;
        }

        e.preventDefault();

        _activeLink(target);
    });

    function _activeLink(elem) {
        elem.parentNode.classList.toggle('active_link__list');
    }
}

dropdownMenu('.nav');

// create map

function createMap(config) {
    var elemMap = document.querySelectorAll(config.selecter),
        coord;

    if (elemMap.length <= 0) {
        return;
    }

    Array.prototype.forEach.call(elemMap, function(item) {
        _coordStr = item.getAttribute(config.coord).split(',');

        _configMap(item, _coordStr);
    });

    function _configMap(elem, coord) {
        var mapOptions = {
            zoom: 11,
            scrollwheel: true,
            streetViewControl: true,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            },
            zoomControl: false,
            scaleControl: true,
            panControl: false,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            center: new google.maps.LatLng(coord[0], coord[1])
        };

        var map = new google.maps.Map(elem, mapOptions);

        var marker = new google.maps.Marker({
            position: mapOptions.center,
            map: map,
            visible: true
        });
    }
}

// show / less btn

function ToggeleFeed(config) {
    this.elemID = config.elem;
    this.btnClose = config.btnC;
    this.btnOpen = config.btnO;
    this.hiddeLayer = config.layer;
    this.showField = config.show;
    this.disableField = config.active;

    this.__cutline__ = function(elem) {
        var active = elem;
        var elem = active;

        while (active != document) {
            if (elem !== undefined && elem.classList.contains(this.elemID)) {
                break;
            }

            elem = elem.parentNode;
        }

        var showField = elem.querySelector('.' + this.showField);
        var temp = active.innerHTML.split(' ', 30);
        var endWord = temp[temp.length - 1].slice(this.length, -3).trim().concat('...');

        var dis = elem.querySelector('.' + this.disableField);
        dis.style.display = 'none';
        temp.splice(temp.length - 1, 1, endWord);
        showField.innerHTML = temp.join(' ');
    };



    this.close = function(e) {
        var data = _searcher(e);

        $(data.notactive).slideUp(300);
        setTimeout(function() {
            data.active.classList.add('hidde-toggle-field');
        }, 300);
    }.bind(this);

    this.open = function(e) {
        var data = _searcher(e);

        data.active.classList.remove('hidde-toggle-field');
        $(data.notactive).slideDown(300);
    }.bind(this);

    var _eventEmmiter = addEvent.bind(this);

    var _searcher = function(e) {
        var e = e || window.e;
        var target = e.target || e.srcElement;

        var block = (function() {
            var list = document.querySelectorAll('.' + this.disableField),
                elem = undefined;

            if (!list || list.length <= 0) {
                return;
            }

            Array.prototype.forEach.call(list, function(item) {
                var parent = item.parentNode;
                if (!parent.contains(target)) {
                    return;
                }

                elem = item;
            });

            return elem;
        })();

        var active = block.parentNode;

        return {
            active: active,
            notactive: block
        };
    }.bind(this);

    var _helper = function() {
        var active = document.querySelectorAll('.' + this.elemID + ' .' + this.hiddeLayer);

        if (!active && active.length <= 0) {
            return false;
        }

        Array.prototype.forEach.call(active, function(item) {
            this.__cutline__(item);
        });
    }.bind(this);

    var _findControlElem = function(id) {
        if (!id) {
            return false;
        }

        var id = '.' + id.toString();

        if (document.querySelectorAll(id).length > 1) {
            return document.querySelectorAll(id);
        }
        var item = document.querySelector(id);

        if (!item) {
            return false;
        }

        return item;
    };

    _eventEmmiter(_findControlElem(this.btnClose), 'click', this.close);

    _eventEmmiter(_findControlElem(this.btnOpen), 'click', this.open);

    _helper();
}

var feedback = ToggeleFeed({
    elem: 'feedback-card_full',
    btnC: 'btn-toggle',
    btnO: 'btn-toggle_disabled',
    layer: 'text-wrapper p',
    active: 'js-accord_block',
    show: 'js-active_field'
});

(function() {
    var arrElem = document.querySelectorAll('.js-accord .accord__block');
    Array.prototype.forEach.call(arrElem, function(item) {
        item.style.display = 'none';
    });

    addEvent(document, 'click', function(e) {
        var e = e || window.e,
            target = e.target || e.srcElement,
            accord = undefined,
            activeAccord = undefined;

        while (target != this) {
            if (target.classList.contains('js-accord-but')) {
                break;
            }

            target = target.parentNode;
        }

        if (target == document) {
            return;
        }

        accord = target.parentNode;

        if (!accord.classList.contains('is-active')) {

            activeAccord = $('.js-accord.is-active');

            if (activeAccord && activeAccord.length != 0) {
                activeAccord[0].classList.remove('is-active');
                $(activeAccord[0]).find('.accord__block').slideUp(300);
            }

            accord.classList.add('is-active');
            $(accord).find('.accord__block').slideDown(300);
        } else {
            accord.classList.remove('is-active');
            $(accord).find('.accord__block').slideUp(300);
        }
    });
})()

function Rating(config) {
    this.elem = config.elem;
    this.category = config.categoryAttr;
    this.valueid = config.valueAttr;
    this.star = config.star;
    this.valueRating = {};
    this.activeLine = config.activeLine;

    var helpers = {
        one: 'плохо',
        two: 'ниже среднего',
        three: 'нормально',
        four: 'хорошо',
        five: 'отлично'
    };
    var _eventEmmiter = addEvent.bind(this);
    var contain = undefined;

    var _helpe = function(count, parent, event) {
        var value = undefined;
        switch (count) {
            case 0:
                value = helpers.one
                break
            case 1:
                value = helpers.two
                break
            case 2:
                value = helpers.three
                break
            case 3:
                value = helpers.four
                break
            case 4:
                value = helpers.five
                break
        }

        if (!value) {
            return;
        }

        contain = parent.querySelector('.helpers') || document.createElement('div');

        if (event.type == 'mouseleave') {
            contain.innerHTML = '';
            return;
        }

        if (!parent.querySelector('.helpers')) {
            contain.className = 'helpers';
            parent.appendChild(contain);
        }
        contain.innerHTML = value;
    };
    var _colorStar = function(e, event) {
        if (!e) {
            return;
        }

        var sizes = e.getBoundingClientRect();

        if (!sizes) {
            return;
        }

        var por, countStar = null;

        if (event.clientY > sizes.top && event.clientY < sizes.bottom) {
            if (event.clientX > sizes.left && event.clientX < sizes.right) {
                por = (event.clientX - sizes.left) / sizes.width * 100;
                countStar = Math.floor(5 * por / 100);
            }
        }

        _helpe(countStar, e, event);

        var stars = e.querySelectorAll('.' + this.activeLine + ' span');

        Array.prototype.forEach.call(stars, function(item, i) {
            if (i <= countStar) {
                item.style.color = '#f2b100';
            } else {
                item.style.color = "#ededed";
            }
        });
    }.bind(this);

    var _mouseFulling = function(e) {
        var e = e || window.e;
        var target = e.target || e.srcElement;

        while (target != document) {
            var check = target.tagName == 'DD';
            if (check) {
                break;
            }

            target = target.parentNode;
        }

        if (!target || target == document) {
            return;
        }

        _colorStar(target, e);
    };

    var _findControlElem = function(id) {
        var id = id.toString(),
            item = undefined;

        if (!id) {
            return false;
        }

        if (document.querySelectorAll(id).length > 1) {
            return document.querySelectorAll(id);
        }

        item = document.querySelector(id);

        if (!item) {
            return false;
        }

        return item;
    }.bind(this);

    var _searcher = function(e) {
        var e = e || window.e;
        var target = e.target || e.srcElement;

        while (target != document) {
            var check = target.tagName == 'SPAN' && target.parentNode.hasAttribute(this.star);
            if (check) {
                break;
            }

            target = target.parentNode;
        }

        if (!target || target == document) {
            return;
        }

        return target;

    }.bind(this);

    _eventEmmiter(window, 'load', this.init.bind(this));
    _eventEmmiter(_findControlElem('[' + this.category + ']'), 'mousemove', function(e) {
        _mouseFulling(e);
    }.bind(this));
    _eventEmmiter(_findControlElem('[' + this.category + ']'), 'mouseleave', function(e) {
        _mouseFulling(e);
        if (contain) {
            contain.innerHTML = '';
            return;
        }
    }.bind(this));
    _eventEmmiter(_findControlElem(this.elem), 'click', function(e) {
        var target = _searcher(e);

        if (!target) {
            return;
        }

        this._numeration(target);
    }.bind(this));

}

Rating.prototype.init = function() {
    var stars = document.querySelectorAll('[' + this.valueid + ']');

    if (!stars || stars.length < 1) {
        return;
    }

    Array.prototype.forEach.call(stars, function(item) {
        var rating = item.getAttribute(this.valueid);

        item.style.width = (rating * 100) / 5 + '%';
    }.bind(this));
};
Rating.prototype._setting = function(target) {
    if (!this.valueRating || this.valueRating.length < 1) {
        return;
    }

    var active = $(target.parentNode).find('[' + this.valueid + ']'),
        category = target.parentNode.getAttribute(this.category),
        ratingCount = this.valueRating[category];

    active[0].style.width = (ratingCount * 100) / 5 + '%';
};

Rating.prototype._numeration = function(target) {
    var cont = target.parentNode,
        start = cont.children,
        length = start.length,
        i = 0;

    for (i; i < length; i++) {
        var category = cont.parentNode.getAttribute(this.category);

        if (start[i] == target && start[i].nodeType == 1) {
            this.valueRating[category] = i + 1;
        }
    }

    this._setting(cont);
};

var ratings = new Rating({
    elem: '.form-field .assessment',
    categoryAttr: 'data-category-asses',
    valueAttr: 'data-value-asses',
    star: 'data-asses',
    activeLine: 'star-ratings-bottom'
});

$.validate({
    form: '.form-field',
    onSuccess: function() {
        var forms = document.querySelectorAll('.form-field'),
            rating = ratings.valueRating;

        // place for ajax request with

        return false;
    }
});