/**
 * @author serkanyersen
 */
var Transitions = {
    linear:     function(x){ return x; },
    sineIn:     function(x){ return 1 - Math.cos(x * Math.PI / 2); },
    sineOut:    function(x){ return Math.sin(x * Math.PI / 2); },
    sineInOut:  function(x){ return 0.5 - Math.cos(x * Math.PI) / 2; },
    cubicIn:    function(x){ return Math.pow(x, 3); },
    cubicOut:   function(x){ return 1 + Math.pow(x - 1, 3); },
    cubicInOut: function(x){ return x < 0.5 ? 4 * Math.pow(x, 3) : 1 + 4 * Math.pow(x - 1, 3); },
    quadIn:     function(x){ return Math.pow(x, 2); },
    quadOut:    function(x){ return 1 - Math.pow(x - 1, 2); },
    quadInOut:  function(x){ return x < 0.5 ? 2 * Math.pow(x, 2) : 1 - 2 * Math.pow(x - 1, 2); },
    quartIn:    function(x){ return Math.pow(x, 4); },
    quartOut:   function(x){ return 1 - Math.pow(x - 1, 4); },
    quartInOut: function(x){ return x < 0.5 ? 8 * Math.pow(x, 4) : 1 - 8 * Math.pow(x - 1, 4); },
    quintIn:    function(x){ return Math.pow(x, 5); },
    quintOut:   function(x){ return 1 + Math.pow(x - 1, 5); },
    quintInOut: function(x){ return x < 0.5 ? 16 * Math.pow(x, 5) : 1 + 16 * Math.pow(x - 1, 5); },
    circIn:     function(x){ return 1 - Math.sqrt(1 - Math.pow(x, 2)); },
    circOut:    function(x){ return Math.sqrt(1 - Math.pow(x - 1, 2)); },
    circInOut:  function(x){ return x < 0.5 ? 0.5 - Math.sqrt(1 - Math.pow(2 * x, 2)) * 0.5 : 0.5 + Math.sqrt(1 - Math.pow(2 * x - 2, 2)) * 0.5; },
    expoIn:     function(x){ return Math.pow(2, 10 * (x - 1)); },
    expoOut:    function(x){ return 1 - Math.pow(2, -10 * x); },
    expoInOut:  function(x){ x = 2 * x - 1; return x < 0 ? Math.pow(2, 10 * x) / 2 : 1 - Math.pow(2, -10 * x) / 2; },
    pulse:      function(x, n){ if (!n) { n = 1; } return 0.5 - Math.cos(x * n * 2 * Math.PI) / 2; },
    wobble:     function(x, n){ if (!n) { n = 3; } return 0.5 - Math.cos((2 * n - 1) * x * x * Math.PI) / 2; },
    elastic:    function(x, e){ var a; if (!e) { a = 30; } else { e = Math.round(Math.max(1, Math.min(10, e))); a = (11 - e) * 5; } return 1 - Math.cos(x * 8 * Math.PI) / (a * x + 1) * (1 - x); },
    bounce:     function(x, n){ n = n ? Math.round(n) : 4; var c = 3 - Math.pow(2, 2 - n); var m = -1, d = 0, i = 0; while (m / c < x) { d = Math.pow(2, 1 - i++); m += d; } if (m - d > 0) { x -= ((m - d) + d / 2) / c; } return c * c * Math.pow(x, 2) + (1 - Math.pow(0.25, i - 1)); }
};


var Colors = {
	/**
	 * Parses the color string and returns rgb codes in array
	 * @param {Object} color
	 */
    getRGBarray: function (color){
        if(typeof color == "string"){
            if(color.indexOf("rgb") > -1){
                color = color.replace(/rgb\(|\).*?$/g, "").split(/,\s*/, 3);
            }else{
                color = color.replace("#", "");
                if(color.length == 3){ // Handle 3 letter colors #CCC
                    color = color.replace(/(.)/g, function(n){ return parseInt(n+n, 16)+", "; }).replace(/,\s*$/, "").split(/,\s+/);
                }else{ 
                    color = color.replace(/(..)/g, function(n){ return parseInt(n, 16)+", "; }).replace(/,\s*$/, "").split(/,\s+/);
                }
            }
        }
        for(var x=0; x<color.length; x++){ color[x] = Number(color[x]); }
        return color;
    },
	/**
	 * gets rgb values as parameters and returns HEX color string
	 */
    rgbToHex: function (){
        var ret = [];
        var ret2 = [];
        for ( var i = 0; i < arguments.length; i++ ){ 
            //ret.push((arguments[i] < 16 ? "0" : "") + Math.round(arguments[i]).toString(16));
            ret.push((arguments[i] < 16 ? "0" : "") + arguments[i].toString(16).replace(/^(\w+)\.\w+$/g, '$1'));
        }
        return "#"+ret.join('').toUpperCase();
    },
	/**
	 * Gets HEX color string an returns rgb array
	 * @param {Object} str
	 */
    hexToRgb: function (str){
        str = str.replace("#", "");
        var ret = [];
        if(str.length == 3){
            str.replace(/(.)/g, function(str){
                ret.push(parseInt(str+str, 16));
            });
        }else{
            str.replace(/(..)/g, function(str){
                ret.push(parseInt(str, 16));
            });
        }
        return ret;
    }
};

Element.addMethods({
    shift: function(element, options){
        options = Object.extend({
            duration: 1,
            onEnd: Prototype.K,
            onStart: Prototype.K,
            link:'cancel',
            remove: false,
            easingCustom:false,
            easing: Transitions.sineOut
        }, options || {});

        // Queuing the animation
        if(!element.queue){
            element.queue = [];
        }
	
        // Linking the animations like mootools.
        if(options.link == "ignore" && element.timer){
            return element;
        }else if((options.link == "chain" || options.link == "queue") && element.timer){
            element.queue.push(options);
            return element;
        }
        
        if (element.timer){ // cancel the old animation
            clearInterval(element.timer); 
        }
		
        if(typeof options.easing == 'string'){
            if(options.easing in Transitions){
                options.easing = Transitions[options.easing];
            }else{
                options.easing = Transitions.sineOut;
            }
        }else if(typeof options.easing != 'function'){
            options.easing = Transitions.sineOut;
        }
       
        options.duration *= 1000; // convert to milliseconds
        element.timer = false;
        var properties = {};
        
        // Fill properties array with necessary items, Remove other ones
        $H(options).each(function(option){
            if (!["duration", "onStart", "onEnd", "remove", "easing", "link", "easingCustom"].include(option.key) && option.value !== false) {
                properties[option.key] = option.value;
            }
        });
        
        // Prepare and define values for animation.
        $H(properties).each(function(option){
            var to, from, key, unit, s = [];
            if (["scrollX", "scrollLeft", "scrollY", "scrollTop"].include(option.key)) {
                to = parseFloat(option.value);
                key = (option.key == "scrollX")? "scrollLeft" : (option.key == "scrollY")? "scrollTop" : option.key;
                from = (["scrollX", "scrollLeft"].include(option.key))? element.getScroll().x : from = element.getScroll().y;
                unit = '';
            }else if (["background", "color", "borderColor", "backgroundColor"].include(option.key)) {
                to = Colors.hexToRgb(option.value);
                key = option.key == "background" ? "backgroundColor" : option.key;
                from = Colors.getRGBarray(element.getStyle(key));
                unit = '';
            } else {
                to = (typeof option.value == "string") ? parseInt(option.value, 10) : option.value;
                key = option.key;
                from = element.getStyle(option.key);
                unit = option.key == 'opacity' ? '' : (/\d+[a-zA-Z%]+$/.test(from))? from.match(/\d+([a-zA-Z%]+)$/)[1] : 'px';
                from = parseFloat(from);
            }
            if(!to && to !== 0){
                s[key] = option.value;
                element.setStyle(s);
            }else{
                properties[option.key] = { key: key, to: to, from: from, unit: unit };
            }
        });
        
        /**
         * Calculate animation amount
         * @param {Object} ease
         * @param {Object} option
         * @param {Object} arr
         */
        var fn = function(ease, option, arr){
            if(arr !== false){ 
                return Math.round(option.from[arr] + ease * (option.to[arr] - option.from[arr])); 
            }
            // begin + ease * change
            // console.log("%s + %s * (%s - %s) = %s", option.from, ease, option.to, option.from, (option.from + ease * (option.to - option.from)))
            return (option.from + ease * (option.to - option.from));
        };
        
        var begin = new Date().getTime();
        var end = begin + options.duration;
        options.onStart(element);
        
        var step = function(){
            var time = new Date().getTime();
            var style={};
            
            if (time >= end) { // If duration is done. Complete the animation
                clearInterval(element.timer);
                element.timer = false;
                // This will end the animation with the correct values.
                // if easing is pulse then set values to from.
                // TODO: Find an optimized way of doing this
                
                $H(properties).each(function(option){
                    var valTo = (options.easing == "pulse" || options.easing == Transitions.pulse)? "from" : "to";
                    if(["scrollX", "scrollLeft", "scrollY", "scrollTop"].include(option.key)){
                        element[option.value.key] = option.value[valTo] + option.value.unit
                    }else if (["background", "color", "borderColor", "backgroundColor"].include(option.key)) {
                        style[option.value.key] = 'rgb('+option.value[valTo].join(', ')+")";
                        element.setStyle(style);
                    }else{
                        style[option.key] = option.value[valTo] + option.value.unit;
                        element.setStyle(style);
                    }
                });
                
                options.onEnd(element);
                
                if(element.queue.length > 0){
                    var que = element.queue.splice(0, 1);
                    element.shift(que[0]);
                }
                
                return element;
            }

            $H(properties).each(function(option){ // Do the animation for each element	
                if(option.value.key == "scrollLeft" || option.value.key == "scrollTop"){                    
                    element[option.value.key] = parseInt(fn(options.easing((time - begin) / options.duration, options.easingCustom), option.value, false), 10) + option.value.unit;
                }else if (option.key == "background" || option.key == "color" || option.key == "borderColor" || option.key == "backgroundColor") {
                    rgb = [];
                    for (var x = 0; x < 3; x++) {
                        rgb[x] = fn(options.easing((time - begin) / options.duration, options.easingCustom), option.value, x); 
                    }
                    style[option.value.key] = 'rgb('+rgb.join(', ')+')';
                    element.setStyle(style);
                } else {
                    style[option.key] = fn(options.easing((time - begin) / options.duration, options.easingCustom), option.value, false) + option.value.unit;
                    element.setStyle(style);
                }
            });
        };
        element.timer = setInterval(step, 10);
        return element;
    },
    setScroll: function(element, amounts){

        if(amounts.x !== undefined){
            element.scrollLeft = amounts.x;
        }
        if(amounts.y !== undefined){
            element.scrollTop = amounts.y;
        }
    },
    /**
     * Returns the scroll offset of an element
     * @param {Object} element
     */
    getScroll: function(element){
        return {x: parseFloat(element.scrollLeft), y:parseFloat(element.scrollTop) };
    }
})
