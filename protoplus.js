/**
 * @file    protoplus.js
 * @title   Prototype Plus Extensions Library
 * @author  Serkan Yersen
 * @company Interlogy LLC
 * @version 0.9.9
 * @todo Perform a complete test for all CSS values for shift
 * @todo Read CSS classes and add Morping
 * @todo Write a complete documentation
 * @todo Add droppables
 * @todo Add resizables
 */

if(window.Prototype === undefined){
    throw("Error:prototype.js is required by protoplus.js. Go to prototypejs.org and download lates version.");
}

if(!(/^1\.6.*?$/).test(Prototype.Version)){
    throw('"Protoplus needs 1.6+ version of the prototypejs library. Current version is: '+Prototype.Version+'"');
}

Protoplus = {
    Version: "0.9.9",
    exec: function(code){
        return eval(code); // I have had this 'eval is evil' message
    },
    /**
     * Easing functions for animation effects
     * @param {Object} x
     */
    Transitions: {
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
    },
    Colors: {
        /**
         * Valid CSS color names
         */
        colorNames: {"Black": "#000000", "MidnightBlue": "#191970", "Navy": "#000080", "DarkBlue": "#00008B", "MediumBlue": "#0000CD", "Blue": "#0000FF", "DodgerBlue": "#1E90FF", "RoyalBlue": "#4169E1", "SlateBlue": "#6A5ACD", "SteelBlue": "#4682B4", "CornflowerBlue": "#6495ED", "Teal": "#008080", "DarkCyan": "#008B8B", "MediumSlateBlue": "#7B68EE", "CadetBlue": "#5F9EA0", "DeepSkyBlue": "#00BFFF", "DarkTurquoise": "#00CED1", "MediumAquaMarine": "#66CDAA", "MediumTurquoise": "#48D1CC", "Turquoise": "#40E0D0", "LightSkyBlue": "#87CEFA", "SkyBlue": "#87CEEB", "Aqua": "#00FFFF", "Cyan": "#00FFFF", "Aquamarine": "#7FFFD4", "PaleTurquoise": "#AFEEEE", "PowderBlue": "#B0E0E6", "LightBlue": "#ADD8E6", "LightSteelBlue": "#B0C4DE", "Salmon": "#FA8072", "LightSalmon": "#FFA07A", "Coral": "#FF7F50", "Brown": "#A52A2A", "Sienna": "#A0522D", "Tomato": "#FF6347", "Maroon": "#800000", "DarkRed": "#8B0000", "Red": "#FF0000", "OrangeRed": "#FF4500", "Darkorange": "#FF8C00", "DarkGoldenRod": "#B8860B", "GoldenRod": "#DAA520", "Orange": "#FFA500", "Gold": "#FFD700", "Yellow": "#FFFF00", "LemonChiffon": "#FFFACD", "LightGoldenRodYellow": "#FAFAD2", "LightYellow": "#FFFFE0", "DarkOliveGreen": "#556B2F", "DarkSeaGreen": "#8FBC8F", "DarkGreen": "#006400", "MediumSeaGreen": "#3CB371", "DarkKhaki": "#BDB76B", "Green": "#008000", "Olive": "#808000", "OliveDrab": "#6B8E23", "ForestGreen": "#228B22", "LawnGreen": "#7CFC00", "Lime": "#00FF00", "YellowGreen": "#9ACD32", "LimeGreen": "#32CD32", "Chartreuse": "#7FFF00", "GreenYellow": "#ADFF2F", "LightSeaGreen": "#20B2AA", "SeaGreen": "#2E8B57", "SandyBrown": "#F4A460", "DarkSlateGray": "#2F4F4F", "DimGray": "#696969", "Gray": "#808080", "SlateGray": "#708090", "LightSlateGray": "#778899", "DarkGray": "#A9A9A9", "Silver": "#C0C0C0", "Indigo": "#4B0082", "Purple": "#800080", "DarkMagenta": "#8B008B", "BlueViolet": "#8A2BE2", "DarkOrchid": "#9932CC", "DarkViolet": "#9400D3", "DarkSlateBlue": "#483D8B", "MediumPurple": "#9370D8", "MediumOrchid": "#BA55D3", "Fuchsia": "#FF00FF", "Magenta": "#FF00FF", "Orchid": "#DA70D6", "Violet": "#EE82EE", "DeepPink": "#FF1493", "Pink": "#FFC0CB", "MistyRose": "#FFE4E1", "LightPink": "#FFB6C1", "Plum": "#DDA0DD", "HotPink": "#FF69B4", "SpringGreen": "#00FF7F", "MediumSpringGreen": "#00FA9A", "LightGreen": "#90EE90", "PaleGreen": "#98FB98", "RosyBrown": "#BC8F8F", "MediumVioletRed": "#C71585", "IndianRed": "#CD5C5C", "SaddleBrown": "#8B4513", "Peru": "#CD853F", "Chocolate": "#D2691E", "Tan": "#D2B48C", "LightGrey": "#D3D3D3", "PaleVioletRed": "#D87093", "Thistle": "#D8BFD8", "Crimson": "#DC143C", "FireBrick": "#B22222", "Gainsboro": "#DCDCDC", "BurlyWood": "#DEB887", "LightCoral": "#F08080", "DarkSalmon": "#E9967A", "Lavender": "#E6E6FA", "LavenderBlush": "#FFF0F5", "SeaShell": "#FFF5EE", "Linen": "#FAF0E6", "Khaki": "#F0E68C", "PaleGoldenRod": "#EEE8AA", "Wheat": "#F5DEB3", "NavajoWhite": "#FFDEAD", "Moccasin": "#FFE4B5", "PeachPuff": "#FFDAB9", "Bisque": "#FFE4C4", "BlanchedAlmond": "#FFEBCD", "AntiqueWhite": "#FAEBD7", "PapayaWhip": "#FFEFD5", "Beige": "#F5F5DC", "OldLace": "#FDF5E6", "Cornsilk": "#FFF8DC", "Ivory": "#FFFFF0", "FloralWhite": "#FFFAF0", "HoneyDew": "#F0FFF0", "WhiteSmoke": "#F5F5F5", "AliceBlue": "#F0F8FF", "LightCyan": "#E0FFFF", "GhostWhite": "#F8F8FF", "MintCream": "#F5FFFA", "Azure": "#F0FFFF", "Snow": "#FFFAFA", "White": "#FFFFFF"},
        /**
         * Creates a color palette
         */        
        getPalette: function(){
            Protoplus.Profiler.start();
            var generated = {};
            var cr = ['00', '44', '77', '99', 'BB', 'EE', 'FF'];
            var i = 0;
            for(var r = 0;  r < cr.length; r++){
                for(var g = 0;  g < cr.length; g++){
                    for(var b = 0;  b < cr.length; b++){
                        generated[(i++)+"_"] = '#'+cr[r]+cr[g]+cr[b];
                    }
                }
            }
            Protoplus.Profiler.end();
            return generated;
        },
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
                ret.push((arguments[i] < 16 ? "0" : "") + Math.round(arguments[i]).toString(16));
                //ret.push((arguments[i] < 16 ? "0" : "") + arguments[i].toString(16).replace(/^(\w+)\.\w+$/g, '$1'));
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
        },
        /**
         * Inverts the given hex color
         * @param {Object} hex
         */
        invert: function(hex){
            var rgb = Protoplus.Colors.hexToRgb(hex);
            return Protoplus.Colors.rgbToHex(255-rgb[0], 255-rgb[1], 255-rgb[2]);
        }
    },
    /**
     * Profiler. Calculates the time of the process
     * @param {Object} title
     */
    Profiler: {
        stime:0,
        etime:0,
        title:'',
        result:0,
        /**
         * Start the profile
         * @param {Object} title Title of the process in order to recognize later
         */
        start: function(title){
            Protoplus.Profiler.stime = new Date();
            Protoplus.Profiler.title = title || "Process";
            //console.profile(Protoplus.Profiler.title);
        },
        /**
         * Finish and print the result of the profiler
         */
        end:function(){
            Protoplus.Profiler.etime = new Date();
            Protoplus.Profiler.result = Protoplus.Profiler.etime - Protoplus.Profiler.stime;
            if(Protoplus.Profiler.result > 10){
               Protoplus.Profiler.result -= 10 // Remove 10, latency of Profiler function itself
            }
            // console.profileEnd();
            var msg = Protoplus.Profiler.title+' took <b>'+Protoplus.Profiler.result+"</b>ms";
            if($('diag')){
                $('diag').update(msg);
            }else{
                if('console' in window){
                    console.info(msg);
                }
            }
           
        }
    }
};

/**
 * @extends Hash class
 */
Object.extend(Hash.prototype, {
    /**
     * Debug: Object.debug(); Alerts each array element in a confirm box. Click ok to stop loop.
     * @param {Object} options
     * -- showFunction: if true show the appanded functions of an object.
     * -- skipBlanks: if true skips the blank values.
     */
    debug: function(opts){
        opts = opts? opts : {};
        node = this._object;
        text = opts.text? opts.text+"\n" : "";
        for(e in node){
            if(typeof node[e] == "function" && !opts.showFunctions){ continue; }
            if(opts.skipBlanks && (node[e] === "" || node[e] === undefined)){ continue; }

            var stophere = confirm(text+e+" => "+node[e]);
            if(stophere){
                return node[e];
            }
        }
    }
});

/**
 * Extend the string
 */
Object.extend(String.prototype, {
    /**
     * Remove unnecessary white spaces and compress the json string
     */
    cleanJSON: function (){
        return this.replace(/(\"?)(\:|\,)\s+(\"?)/g, '$1$2$3');
    },
    /**
     * Shortens the string
     * @param {Object} length
     * @param {Object} closure
     */
    shorten: function(length, closure){
        length = length? length : "30";
        closure = closure? closure : "...";
        var sh = this.substr(0, length);
        sh += (this.length > length)? closure : "";
        return sh;
    }
});

/**
 * php's $_GET equivalent 
 * @example "http://www.example.com?name=serkan" to document.get.name => "serkan"
 */
var __result = document.URL.toQueryParams();

/**
 * @extends document
 */
Object.extend(document, {
    parameters: __result,
    get: __result,
    /**
     * Short hand for dom:loaded.
     * @param {Object} func
     */
    ready: function(func){
        document.observe("dom:loaded", func);
    },
    /**
     * Returns the element underneath the mouse, should have the event object
     * @param {Event} e 
     */
    getUnderneathElement: function(e){
        var pointX = (Prototype.Browser.WebKit)? Event.pointerX(e) : e.clientX;
        var pointY = (Prototype.Browser.WebKit)? Event.pointerY(e) : e.clientY;
        return document.elementFromPoint(pointX, pointY);
    },
    /**
     * Creates Cookie
     * @param {Object} name
     * @param {Object} value
     * @param {Object} days
     * @param {Object} path
     */
    createCookie: function(name, value, days, path){
        path = path? path : "/";
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = ";expires=" + date.toGMTString();
        }
        document.cookie = name + "=" + value + expires + ";path="+path;
    },
    /**
     * Reads the cookie
     * @param {Object} name
     */
    readCookie: function(name){
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1, c.length);
            }
            if (c.indexOf(nameEQ) === 0) {
                return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
        }
        return null;
    },
    /**
     * Removes cookie
     * @param {String} name
     */
    eraseCookie: function(name){
        document.createCookie(name, "", -1);
    },
    /**
     * Converts value to a json string and stores in the cookie.
     * @param {String} name
     * @param {Object} value
     * @param {Number} days
     */
    storeJsonCookie:function(name, value, days){
        var val = $H(value).toJSON().cleanJSON();
        document.createCookie(name, val, days);
    },
    /**
     * Reads and parses Jsoncookie.
     * @param {String} name
     * @return {Object} Hash
     */
    readJsonCookie:function(name){
        if(document.readCookie(name)){
            return document.readCookie(name).toString().evalJSON();
        }else{
            return {};
        }
    },
    
    getClientDimensions: function(){
        var head = document.body.parentNode;
        return { height: head.scrollHeight, width: head.scrollWidth };
    }
});

/**
 * @see http://adomas.org/javascript-mouse-wheel/ prototype extension by "Frank Monnerjahn" themonnie @gmail.com
 * @see http://www.ogonek.net/mousewheel/demo.html
 * @usage $('wheel-div').observe(Event.mousewheel, function(e){ Event.wheel(e); });
 */
Object.extend(Event, {
    mousewheel: Prototype.Browser.Gecko? 'DOMMouseScroll' : 'mousewheel',
    wheel:function (event){
        var delta = 0;
        if (!event) { event = window.event; }
        if (event.wheelDelta) {
            delta = event.wheelDelta/120;
            if (window.opera) { delta = -delta; }
        } else if (event.detail) { delta = -event.detail/3; }
        return Math.round(delta); //Safari Round
    }
});

/**
 * @extends DOM
 */
Element.addMethods({
    /**
     * Determines if the passed element is overflowing its bounds,
     * either vertically or horizontally.
     * Will temporarily modify the "overflow" style to detect this
     * if necessary.
     * @param {Object} element
     */
    isOverflow: function(element){
        if(element.resized){
            element.hideHandlers();
        }
        var curOverflow = element.style.overflow;
        if (!curOverflow || curOverflow === "visible"){
            element.style.overflow = "hidden";            
        } 
        
        var leftOverflowing = element.clientWidth < element.scrollWidth;
        var topOverflowing = element.clientHeight < element.scrollHeight;
        var isOverflowing = leftOverflowing || topOverflowing;
        
        element.style.overflow = curOverflow;
        
        if(element.resized){
            element.showHandlers();
        }
                
        return isOverflowing? { top: topOverflowing, left: leftOverflowing, both: leftOverflowing && topOverflowing } : false;
    },
    /**
     * Makes element unselectable. Disable cursor select
     * @param {Object} target
     */
    unselectable: function(target){
        if (typeof target.onselectstart != "undefined") {target.onselectstart = function(){return false;};}
        else if (typeof target.style.MozUserSelect != "undefined") { target.style.MozUserSelect = "none";}
        else {target.onmousedown = function(){ return false;}; }
        return target;
    },
    /**
     * Reverts unselectable effect, enables cursor select
     * @param {Object} target
     */
    selectable: function(target){
        if (typeof target.onselectstart != "undefined") { target.onselectstart = document.createElement("div").onselectstart; }
        else if (typeof target.style.MozUserSelect != "undefined") { target.style.MozUserSelect = document.createElement("div").style.MozUserSelect; } 
        else { target.onmousedown = ""; }
        return target;
    },
    /**
     * Mimics the hover effect on browsers.
     * @param {Object} elem
     * @param {Object} over
     * @param {Object} out
     */
    hover: function(elem, over, out){
        $(elem).observe("mouseover", function(evt){
            if(typeof over == "function"){
                if(elem.innerHTML){
                    if(elem.descendants().include(evt.relatedTarget)){ return true; } // Mimic the mouseenter event
                }
                over(elem, evt);
            }else if(typeof over == "string"){
                $(elem).addClassName(over);
            }
        });
        $(elem).observe("mouseout", function(evt){
            if (typeof out == "function") {
                if(elem.innerHTML){
                    if(elem.descendants().include(evt.relatedTarget)){ return true; } // Mimic the mouseleave event
                }
                out(elem, evt);
            }else if(typeof over == "string"){
                $(elem).removeClassName(over);
            }
        });
        return elem;
    },
    /**
     * Short hand for click event
     * @param {Object} element
     * @param {Object} func
     */
    click1: function(element, func){
        return element.observe('click', func);
    },
    /**
     * Short hand for observe
     * @param {Object} element
     * @param {Object} event
     * @param {Object} func
     */
    on: function(element, event, func){
        return element.observe(event, func);
    },
    /**
     * Sets the scroll amount for an element
     * @param {Object} element
     * @param {Object} amounts
     */
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
    },
    /**
     * Sets the innerHTML of an element;
     * @param {Object} element
     * @param {Object} value
     */
    setText: function(element, value){
        element.innerHTML = value;
        return element;
    },
    /**
     * Fires native events oberseved by element
     * @param {Object} element
     * @param {Object} event
     */
    run: function(element, event){
        var evt;
        if (document.createEventObject){ // dispatch for IE
            evt = document.createEventObject();
            return element.fireEvent('on'+event,evt);
        }else{ // dispatch for firefox + others
            evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, true, true ); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
        }
    },
    /**
     * Sett CSS border radius for all supported browsers
     * @param {Object} element
     * @param {Object} value
     */
    setCSSBorderRadius: function(element, value){
        return element.setStyle({MozBorderRadius: value, borderRadius: value, '-webkit-border-radius': value});
    },
    /**
     * Returns the selected value of the element
     * @param {Object} element
     */
    getSelected: function(element){
        if(!element.options){
            if(element.innerHTML){ return element.innerHTML; }
            else{ return element.value; }
        }
        var selected =  element.selectedIndex >= 0? element.options[element.selectedIndex] : element;
        return selected;
    },
    /**
     * Safe remove function
     * @param {Object} element
     */
    remove: function(element){
        if(element.parentNode){
            element.parentNode.removeChild(element);
        }
        return element;
    },
    /**
     * Selects the option of an element
     * @param {Object} element
     * @param {Object} val
     */
    selectOption: function(element, val){
        if(!val){ return element; }
        if(typeof val == "string"){ val = val.split(/\s*,\s*/); }
        $A(element.options).each(function(option){
            if(val.include(option.value) || val.include(option.text)){ option.selected = true; }
        });
        return element;
    },
    /**
     * Makes animation for given attribute. This function can animate every attribute with the numeric values it can also animate color values and scroll amounts.
     * @param {Object} element
     * @param {Object} options
     */
    shift: function(element, options){
        options = Object.extend({
            duration: 1,
            onEnd: Prototype.K,
            onStart: Prototype.K,
            onStep: Prototype.K,
            delay: 0,
            link:'cancel',
            remove: false,
            easingCustom:false,
            easing: Protoplus.Transitions.sineOut
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
            if(options.easing in Protoplus.Transitions){
                options.easing = Protoplus.Transitions[options.easing];
            }else{
                options.easing = Protoplus.Transitions.sineOut;
            }
        }else if(typeof options.easing != 'function'){
            options.easing = Protoplus.Transitions.sineOut;
        }

        options.duration *= 1000; // convert to milliseconds
        options.delay *= 1000; // convert to milliseconds
        element.timer = false;
        var properties = {};

        // Fill properties array with necessary items, Remove other ones
        $H(options).each(function(option){
            if (!["duration", "onStart", "onStep", "onEnd", "remove", "easing", "link", "easingCustom"].include(option.key) && option.value !== false) {
                properties[option.key] = option.value;
            }
        });

        // Prepare and define values for animation.
        $H(properties).each(function(option){
            var to, from, key, unit, s = [];
            if (["scrollX", "scrollLeft", "scrollY", "scrollTop"].include(option.key)) {
                to = parseFloat(option.value);
                key = (option.key == "scrollX")? "scrollLeft" : (option.key == "scrollY")? "scrollTop" : option.key;
                if(element.tagName == "BODY"){
                    from = (["scrollX", "scrollLeft"].include(option.key))? window.scrollX : window.scrollY; // Read the window scroll
                }else{
                    from = (["scrollX", "scrollLeft"].include(option.key))? element.getScroll().x : element.getScroll().y;
                }
                unit = '';
            }else if (option.key == "rotate"){
                to = parseFloat(option.value);
                key = "-webkit-transform";
                from = element.getStyle('-webkit-transform')? parseInt(element.getStyle('-webkit-transform').replace(/rotate\(|\)/gim, ""), 10) : 0;
                unit = 'deg';
            }else if (["background", "color", "borderColor", "backgroundColor"].include(option.key)) {
                to = Protoplus.Colors.hexToRgb(option.value);
                key = option.key == "background" ? "backgroundColor" : option.key;
                from = Protoplus.Colors.getRGBarray(element.getStyle(key) || "");
                unit = '';
            } else {
                to = (typeof option.value == "string") ? parseInt(option.value, 10) : option.value;
                key = option.key;
                from = element.getStyle(option.key.replace("-webkit-", "").replace("-moz-", "")) || "0px";
                unit = option.key == 'opacity' ? '' : (/\d+[a-zA-Z%]+$/.test(from))? from.match(/\d+([a-zA-Z%]+)$/)[1] : 'px';
                from = parseFloat(from);
            }
            
            if(!to && to !== 0){
                try {
                    s[key] = option.value;
                    //element.setStyle(s);
                    element.style[key] = option.value;
                }catch(e){  }
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
                    var valTo = (options.easing == "pulse" || options.easing == Protoplus.Transitions.pulse)? "from" : "to";
                    if(["scrollX", "scrollLeft", "scrollY", "scrollTop"].include(option.key)){
                        if (element.tagName == "BODY") { // In order to scroll the document
                            if (option.value.key == "scrollLeft") {
                                window.scrollTo(option.value[valTo], window.scrollY);
                            }else {
                                window.scrollTo(window.scrollX, option.value[valTo]);
                            }
                        }else {
                            element[option.value.key] = option.value[valTo] + option.value.unit;
                        }
                    }else if (["background", "color", "borderColor", "backgroundColor"].include(option.key)) {
                        style[option.value.key] = 'rgb('+option.value[valTo].join(', ')+")";
                        element.setStyle(style);
                    }else if(option.key == "rotate"){
                        style[option.key] = "rotate("+option.value[valTo] + option.value.unit+")";
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
            options.onStep(element);
            $H(properties).each(function(option){ // Do the animation for each element	
                if(option.value.key == "scrollLeft" || option.value.key == "scrollTop"){
                    if (element.tagName == "BODY") { // In order to scroll the document
                        var scroll = parseInt(fn(options.easing((time - begin) / options.duration, options.easingCustom), option.value, false), 10) + option.value.unit;
                        if(option.value.key == "scrollLeft"){
                            window.scrollTo(scroll, window.scrollY);
                        }else{
                            window.scrollTo(window.scrollX, scroll);
                        }
                    }else{
                        element[option.value.key] = parseInt(fn(options.easing((time - begin) / options.duration, options.easingCustom), option.value, false), 10) + option.value.unit;
                    }
                }else if (option.key == "background" || option.key == "color" || option.key == "borderColor" || option.key == "backgroundColor") {
                    rgb = [];
                    for (var x = 0; x < 3; x++) {
                        rgb[x] = fn(options.easing((time - begin) / options.duration, options.easingCustom), option.value, x); 
                    }
                    style[option.value.key] = 'rgb('+rgb.join(', ')+')';
                    element.setStyle(style);
                }else if(option.key == "rotate"){
                        style[option.value.key] = "rotate("+fn(options.easing((time - begin) / options.duration, options.easingCustom), option.value, false) + option.value.unit+")";
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
    /**
     * Makes fade out effect for given element
     * @param {Object} element
     * @param {Object} options
     */
    fade: function(element, options){
        options = Object.extend({
            duration: 0.5,
            onEnd: function(e){ e.setStyle({display:"none"}); },
            onStart: Prototype.K,
            opacity: 0
        }, options || {});

        element.shift(options);
    },
    /**
     * Makes faded element appear again
     * @param {Object} element
     * @param {Object} options
     */
    appear: function(element, options){
        options = Object.extend({
            duration: 0.5,
            onEnd: Prototype.K,
            onStart: Prototype.K,
            opacity: 1
        }, options || {});
        element.setStyle({opacity:0, display:"block"});
        element.shift(options);
    },
    /**
     * Enable / Disable for all elements
     * @param {Object} element
     */
    disable: function(element) {
        element = $(element);
        element.disabled = true;
        return element;
    },
    enable: function(element) {
        element = $(element);
        element.disabled = false;
        return element;
    }
});

/**
 * JSONP implementation
 * @param {Object} transport
 */
Ajax = Object.extend(Ajax, {
    /**
     * JsonP implementation.
     * This is basically the same as Ajax.Request, If url is on same domain then switches to regular Ajax.Request
     * @param {Object} url
     * @param {Object} options
     */
    Jsonp: function(url, options){
        /**
         * Extend the options
         */
        this.options = Object.extend({
            method: 'post',
            timeout: 60, // seconds
            parameters:'',
            onComplete: Prototype.K,
            onSuccess: Prototype.K,
            onFail: Prototype.K
        }, options || {});
        
        var parameterString = url.match(/\?/)? '&' : '?';
        
        this.response = false;
        
        /**
         * Default Callback function
         * @param {Object} response
         */
        Ajax.callback = function(response){
            this.response = response;
        }.bind(this);
        
        this.callback = Ajax.callback;
        
        
        if(typeof this.options.parameters == "string"){
            parameterString += this.options.parameters;
        }else{
            $H(this.options.parameters).each(function(p){
                parameterString += p.key+'='+ encodeURIComponent(p.value) +'&';
            });
        }
        
        // Get request domain
		var matches = /^(\w+:)?\/\/([^\/?#]+)/.exec(url);	
		var sameDomain = (matches && ( matches[1] && matches[1] != location.protocol || matches[2] != location.host ));
        
        if(!sameDomain){ // If url is not external then convert it to Ajax.Request
            return new Ajax.Request(url, this.options);
        }
        
        this.url = url + parameterString + 'callbackName=Ajax.callback&nocache=' + new Date().getTime(); // In order to prevent cacheing
        this.script = new Element('script', { type:'text/javascript', src: this.url });
        
        var errored = false;
        
        /**
         * Catch script load errors
         * @param {Object} e
         * @param {Object} b
         * @param {Object} c
         */
        this.onError = function(e, b, c){
            errored = true;
            this.options.onComplete({success:false, error: e || "Not Found"});
            this.options.onFail({success:false, error: e || "Not Found", args: [e, b, c]});
            this.script.remove();
            window.onerror = null;
            this.response = false;
            
        }.bind(this);
        
        /**
         * Run when script loaded
         * @param {Object} e
         */
        this.onLoad = function(e){
            if(errored){ return; }
            clearTimeout(timer);
            this.script.onreadystatechange = null;
            this.script.onload = null;
            window.onerror = null;
            this.script.remove();
            
            if(this.response){
                setTimeout(function(){
                    this.options.onComplete(this.response);
                    this.options.onSuccess(this.response);
                }.bind(this), 20);
            }else{
                this.onError({error:'Callback error'});
            }
        }.bind(this);
        
        /**
         * Check ready state for internet explorer.
         * @param {Object} e
         */ 
        this.readyState = function(e){
            var rs = this.script.readyState;
            if (rs == 'loaded' || rs == 'complete') {
                this.onLoad();
            }
        }.bind(this);
        
        // If nothing happens then timeout
        var timer = setTimeout(this.onError, this.options.timeout * 1000);
        
        // set events
        this.script.onreadystatechange = this.readyState;
        this.script.onload = this.onLoad;
        window.onerror = function(e, b, c){
            clearTimeout(timer);
            this.onError(e, b, c);
            return true;
        }.bind(this)
        
        // Append script
        $$('head')[0].appendChild(this.script);
        return this;
    }
});

var _alert = window.alert;
/**
 * Super Alert.
 * Usage: alert("Hello %s, welcome to %s", name, location); -> Hello serkan welcome to Ankara
 */
window.alert = function(){
    var args = arguments;
    var i = 1;
    var first = args[0];
    if(typeof first == "object"){
        $H(first).debug();
        return first;
    }else if(typeof first == "string"){
        var msg = first.replace(/(\%s)/gim, function(e){
            return args[i++] || "";
        });
        _alert(msg);
        return true;
    }
    _alert(first);
};

/**
 * UI Elements
 * document.createNewWindow => Creates a new floating window
 * Element.editable => Make the element instant editable
 * Element.tooltip => show a floating tooltip when mouse overed
 * Element.draggable => Make the element draggable
 * Element.makeSearchBox => convert normal input to a apple search box
 * Element.slider => Custom input slider
 * Element.spinner => Custom input spinner
 * Element.textshadow => Mimics CSS textshadow
 * Element.rating => Prints rating stars
 * Element.colorPicker => Prints a colorPicker tool
 * Element.miniLabel => Places a mini label at the bottom or top of the input fields
 * Element.hint => Places hint texts into text boxs
 */

if(window.Protoplus === undefined){
    throw("Error: ProtoPlus is required by ProtoPlus-UI.js");
}

Object.extend(document, { 
    /**
     * Stops and destroys all tooltips
     */
    stopTooltips: function(){
        document.stopTooltip = true;
        $$(".pp_tooltip_").each(function(t){ t.remove(); });
        return true; 
    },
    /**
     * Resumes tooltips
     */
    startTooltips: function(){
        document.stopTooltip = false;
    },
    /**
     * Creates a floating window
     * <li>onClose:Prototype.K,    // Event will run when the window is closed</li>
    <li>height:false,    // Height of the window </li>
    <li>width:400,    // Width of the window
    <li>title:'&nbsp;',    // Title of the window
    <li>titleBackground:'#F5F5F5',
    <li>buttonsBackground: '#F5F5F5',
    <li>background:'#FFFFFF',
    <li>top:'25%',        // Top location
    <li>left:'25%',       // Left location
    <li>borderWidth:10,   // Width of the surrounding transparent border
    <li>borderColor:'#000', // Color of the surrounding transparent border
    <li>borderOpacity:0.3, // Opacity of the surrounding transparent border
    <li>borderRadius: "5px", // Corner radius of the surrounding transparent border
    <li>titleClass:false, // CSS class of the title box
    <li>contentClass:false, // CSS class of the content box
    <li>closeButton:'X', // Close button content, can be replaced with an image
    <li>openEffect:true, // Enable/Disable the effect on opening
     * @param {Object} options
     */
    window: function(options){
        /**
           
            closeEffect:true, // Enable/Disable the effect on closing
            dim:true,  // Make it modal window, disable background
            modal:true, // Same as dim
            dimColor:'#fff', // color of the dimming surface
            dimOpacity:0.6, // opacity of the dimming surface
            dynamic: true, // Update the window dynamically while dragging
            buttons: false, // Not completed yet.
            openFrom:false,
            closeTo:false,
            buttons:false, // [ { text:'', handler:function(){} } ]
            buttonsAlign: 'right'
         */
        options = Object.extend({ // Default options
            onClose:Prototype.K,    // Event will run when the window is closed
            onInsert:Prototype.K,   // When the window inserted to document but not yet displayed
            onDisplay:Prototype.K,  // When the window displayed on the screen
            height:false,    // Height of the window
            width:400,    // Width of the window
            title:'&nbsp;',    // Title of the window
            titleBackground:'#F5F5F5',
            buttonsBackground: '#F5F5F5',
            background:'#FFFFFF',
            top:'25%',        // Top location
            left:'25%',       // Left location
            borderWidth:10,   // Width of the surrounding transparent border
            borderColor:'#000', // Color of the surrounding transparent border
            borderOpacity:0.3, // Opacity of the surrounding transparent border
            borderRadius: "5px", // Corner radius of the surrounding transparent border
            titleClass:false, // CSS class of the title box
            contentClass:false, // CSS class of the content box
            closeButton:'X', // Close button content, can be replaced with an image
            openEffect:true, // Enable/Disable the effect on opening
            closeEffect:true, // Enable/Disable the effect on closing
            dim:true,  // Make it modal window, disable background
            modal:true, // Same as dim
            dimColor:'#fff', // color of the dimming surface
            dimOpacity:0.6, // opacity of the dimming surface
            dynamic: true, // Update the window dynamically while dragging
            buttons: false, // Not completed yet.
            openFrom:false,
            contentPadding: '8',
            closeTo:false,
            buttons:false, // [ { text:'', handler:function(){} } ]
            buttonsAlign: 'right'
        }, options || {});
        
        options.dim = (options.modal !== true)? false : options.dim;
        options.width = parseInt(options.width, 10);
        options.height = (options.height)? parseInt(options.height, 10) : false;
        options.borderWidth = parseInt(options.borderWidth, 10);

        if (options.dim && !document.dimmed) {// Dimm the window background
            var dimmer = new Element('div');
            dimmer.onmousedown = function(){return false;}; // Disable browser's default drag and paste functionality
            dimmer.setStyle({background:options.dimColor, position:'absolute', top:'0px', left:'0px', height:'100%', width:'100%', opacity:options.dimOpacity, zIndex:10000});
            $(document.body).setStyle({overflow:'hidden'});
        }

        // Create window structure
        var win, tbody, tr, wrapper, background, title, title_table, title_text, title_close, content, buttons;
        win = new Element('div');
        win.insert(background = new Element('div'));
        win.insert(wrapper = new Element('div'));
        wrapper.insert(title = new Element('div'));
        title.insert(title_table = new Element('table', { width:'100%' }).insert(tbody = new Element('tbody').insert(tr = new Element('tr'))));
        tr.insert(title_text = new Element('td'));
        tr.insert(title_close = new Element('td', {width:20, align:'center'}));
        wrapper.insert(content = new Element('div'));
        
        win.setTitle = function(title){
            title_text.update(title);
            return win;
        }
        
        win.buttons = {};
        if(options.buttons && options.buttons.length > 0){
            wrapper.insert(buttons = new Element('div'));
            buttons.setStyle({background: options.buttonsBackground, zIndex:1000, position:'relative', padding: '5px', borderTop: '1px solid #ccc', textAlign:options.buttonsAlign});
            $A(options.buttons).each(function(button){
                var but = new Element('input', {className:'window-buttons', type:'button', value:button.title}).observe('click', function(){
                    button.handler(win, but);
                });
                win.buttons[button.title] = but;
                if(button.disabled){
                    but.disable();
                }
                if(button.style){
                    but.setStyle(button.style);
                }
                buttons.insert('&nbsp;');
                buttons.insert(but);
                buttons.insert('&nbsp;');
            });
        }

        // set styles
        win.setStyle({top: options.top,left: options.left,position: 'absolute',padding: options.borderWidth+'px',height: "auto", width: options.width + 'px',zIndex: 10001});

        background.setStyle({
            height: '100%',width: '100%',background: options.borderColor,position: 'absolute',top: '0px',left: '0px',zIndex: 500,opacity: options.borderOpacity
        }).setCSSBorderRadius(options.borderRadius);

        if(!options.titleClass){
            title.setStyle({background: options.titleBackground, zIndex:1000, position:'relative', padding: '2px', borderBottom: '1px solid #ccc'});
        }else{
            title.addClassName(options.titleClass);
        }

        if(!options.contentClass){
            content.setStyle({ background: options.background, zIndex: 1000, height: options.height !== false? options.height+'px' : "auto", position: 'relative', padding: options.contentPadding + 'px' }).addClassName('window-content');
        }else{
            content.addClassName(options.contentClass);
        }

        wrapper.setStyle({zIndex:600, border:'1px solid #ddd'});
        title_text.setStyle({fontWeight:'bold', color:'#777'});                    
        title_close.setStyle({fontFamily:'Arial, Helvetica, sans-serif', color:'#aaa', cursor:'default'});

        var closebox = function(){ // Close function
            if(options.onClose(win) !== false){
                var close = function(){
                    if(dimmer){ dimmer.remove(); document.dimmed = false; }
                    win.remove();
                    $(document.body).setStyle({overflow:''}); 
                };
                if(options.closeEffect === true){
                    win.shift({opacity:0, duration:0.3, onEnd: close});
                }else{
                    close();
                }
            }
            document.stopObserving('keyup', escClose);
        };
        var escClose = function(e){ if(e.keyCode == 27){ closebox(); } };
        // Insert box onto screen
        if (options.dim && !document.dimmed) {
            $(document.body).insert(dimmer);
            document.dimmed = true;
        }
        
        // Set the content
        title_text.insert(options.title);
        title_close.insert(options.closeButton);
        title_close.onclick = closebox;
        content.insert(options.content);
        
        $(document.body).insert(win);
        options.onInsert(win);
//        options.openFrom = false;
        if(/*!options.openFrom &&*/ options.openEffect === true){
            win.setStyle({opacity:0});
            win.shift({opacity:1, duration:0.5});
        }
        
        // Center the box on screen
        var vp = document.viewport.getDimensions();
        var bvp = win.getDimensions();
        var top = (vp.height - bvp.height) / 2;
        var left = (vp.width - bvp.width) / 2;
        
        if(options.openFrom){
            var oOffsets = $(options.openFrom).cumulativeOffset();
            var winH = win.getHeight()-(options.borderWidth*2);
            win.setStyle({top:oOffsets.top+"px", left:oOffsets.left+"px", height:'0px', width:'0px', overflow:'hidden'});
        }
        
        if (options.openFrom) {
            win.shift({top:top, left:left, height:winH, width:options.width, opacity:1, duration:1, onEnd:function(){
                options.onDisplay(win);
            }});
        }else{
            win.setStyle({top:top+"px", left:left+"px"});
            options.onDisplay(win);
        }
        
        if(options.resizable){
            wrapper.resizable({
                constrainViewport:true,
                element:content,
                onResize:function(h, w, type){
                    if(type != 'vertical'){
                        win.setStyle({ width: (w + ( options.borderWidth * 2 ) - 10) +'px'});
                    }
                    
                    if(content.isOverflow()){
                        content.setStyle({overflow:'auto'});
                    }else{
                        content.setStyle({overflow:''});
                    }
                }
            });
        }
        document.observe('keyup', escClose); // Close the window when ESC is pressed
        // Make it draggable
        win.draggable({handler:title_text, constrainViewport:true, dynamic:options.dynamic, dragEffect:false});
        win.close = closebox;
        return win;
    }
});

document.createNewWindow = document.window;

Element.addMethods({
    /**
     * Convers element to a editable area.
     * @param {Object} elem
     * @param {Object} options
        defaultText: Default text of the element. appears in the edit area
        onStart: Event fires when edit area created
        onEnd: Event fires when edit area closed,
        processBefore: Event fires before content of the edit area is placed,
        processAfter: Event fires after new content of the edit area is placed,
        escapeHTML: true,
        doubleClick: false,
        className: false,
        options: ,
        style:,
        type: "text"
     */
    editable: function(elem, options){

        options = Object.extend({
            defaultText: " ",
            onStart:Prototype.K,
            onEnd:Prototype.K,
            processAfter: Prototype.K,
            processBefore: Prototype.K,
            escapeHTML: true,
            doubleClick: false,
            className: false,
            options: [{text:"Please Select", value:"0"}],
            style:{background:"none", border:"none",color:"#333", fontStyle:"italic", width:"100%", height:"100%"},
            type: "text"
        }, options || {});

        elem.onStart = options.onStart;
        elem.onEnd = options.onEnd;
        elem.defaultText = options.defaultText;
        elem.processAfter = options.processAfter;
        elem.cleanWhitespace();
        elem.innerHTML = (elem.innerHTML)? elem.innerHTML : elem.defaultText;
        // End of initialize

        elem.observe(options.doubleClick? "dblclick" : "click", function(e){
            if(document._onedit){ return true; }
            document._onedit = true;
            document.stopTooltips();
            var currentValue = elem.innerHTML.replace(/^\s+|\s+$/gim, "");
            var type = options.type;
            var op = $A(options.options);
            var blur = function(e){
                if(input.colorPickerEnabled){
                    return;
                }
                input.stopObserving("blur", blur); 
                elem.stopObserving("keypress", keypress); 
                finish(e, currentValue); 
            };
            var input ="";
            var keypress = function(e){
                if(type == "textarea"){ return true; } // Users may want to press enter in the text area
                if(e.shiftKey){ return true; }
                if(e.keyCode == 13 || e.keyCode == 3) { 
                    elem.stopObserving("keypress", keypress);
                    input.stopObserving("blur", blur);
                    finish(e, currentValue); 
                }
            };

            currentValue = (currentValue == options.defaultText)? "" : currentValue;
            currentValue = options.escapeHTML? currentValue.escapeHTML() : currentValue;
            currentValue = options.processBefore(currentValue, elem);
            

            if(type.toLowerCase() == "textarea"){
                input = new Element("textarea");
                input.value = currentValue;
                input.observe("blur", blur);
                input.select();
            }else if(["select", "dropdown", "combo", "combobox"].include(type.toLowerCase())){
                input = new Element("select").observe("change", function(e){ finish(e, currentValue); });
                if(typeof op[0] == "string"){
                    op.each(function(text){ input.insert(new Element("option").insert(text)); });
                }else{
                    op.each(function(pair, i){ 
                        input.insert(new Element("option", {value:pair.value? pair.value : i}).insert(pair.text)); 
                    });
                }
                input.selectOption(currentValue);
                input.observe("blur", blur);
            } else if(["radio", "checkbox"].include(type.toLowerCase())){
                input = new Element("div");
                if(typeof op[0] == "string"){
                    op.each(function(text, i){ input.insert(new Element("input", {type:type,name:"pp", id:"pl_"+i})).insert(new Element("label", {htmlFor:"pl_"+i, id:"lb_"+i}).insert(text)).insert("<br>"); });
                }else{
                    op.each(function(pair, i){ input.insert(new Element("input", {type:type,name:"pp", value:pair.value? pair.value : i, id:"pl_"+i})).insert(new Element("label", {htmlFor:"pl_"+i,id:"lb_"+i}).insert(pair.text)).insert("<br>"); });
                }
            } else{
                input = new Element("input", { type:type, value:currentValue });
                input.observe("blur", blur);
                input.select();
            }

            if(options.className !== false){
                input.addClassName(options.className);
            }else{
                input.setStyle(options.style);
            }
            elem.update(input);
            elem.onStart(elem, currentValue, input);
            setTimeout(function(){
                input.focus();
            }, 100);
            elem.observe("keypress", keypress);
        });

        var finish = function(e, oldValue){
            var elem = $(e.target);
            var val = "";
            if (!elem.parentNode) { return true; }
            var outer = $(elem.parentNode);
            if ("select" == elem.nodeName.toLowerCase()) {
                val = elem.options[elem.selectedIndex].text;
            } else if(["checkbox", "radio"].include(elem.type.toLowerCase())) {
                outer = $(elem.parentNode.parentNode);
                val = "";
                $(elem.parentNode).descendants().findAll(function(el){ return el.checked === true; }).each(function(ch){
                    if($(ch.id.replace("pl_", "lb_"))){
                        val += $(ch.id.replace("pl_", "lb_")).innerHTML+"<br>";
                    }
                });
            } else {
                val = elem.value;
            }

            if(!outer){ return true; }

            if (val === "") {
                outer.update(outer.defaultText);
            } else {
                outer.update(outer.processAfter(val, outer, elem.getSelected() || val));
            }

            document._onedit = false;
            document.startTooltips();
            outer.onEnd(outer, outer.innerHTML, oldValue, elem.getSelected() || val);
        };
        return elem;
    },

    /**
     * Sets the same color value for each child of the element. for use of textshadow function
     */
    setShadowColor: function(elem, color){
        $A(elem.descendants()).each(function(node){
            if (node.nodeType == Node.ELEMENT_NODE) {
                node.setStyle({color: color});
            }
        });
        return elem;
    },
    /**
     * removes the shadow from element
     * @param {Object} elem
     */ 
    cleanShadow: function(elem){
        elem.descendants().each(function(e){
            if(e.className == "pp_shadow"){
                e.remove();
            }
        });
        return elem;
    },
    /**
     * Creates a text shadow for element
     * @param {Object} element
     * @param {Object} options
     */
    textshadow: function(element, options){
        var elem  = $(element);
        options = Object.extend({
            light: "upleft",
            color: "#666",
            offset: 1,
            opacity: 1,
            padding: 0,
            glowOpacity: 0.1,
            align:undefined,
            imageLike: false
        }, options || {});

        var light = options.light;
        var color = options.color;
        var dist  = options.offset;
        var opacity = options.opacity;
        var textalign = (options.align)? options.align : $(elem).getStyle("textAlign");
        var padding = (options.padding)? options.padding+"px" : $(elem).getStyle("padding");
        var text =  /* elem.innerHTML.replace(/\s+([^\n])/gim, '&nbsp;$1'); // */ elem.innerHTML;
        var container = new Element("div");
        var textdiv = new Element("div");

        var style = {
            color: color,
            height:element.getStyle("height"),
            width:element.getStyle("width"),
            "text-align":textalign,
            padding:padding,
            position: "absolute",
            "z-index": 100,
            opacity: opacity
        };
        elem.innerValue = text;
        elem.update("");
        container.setStyle({position: "relative"});
        textdiv.update(text);
        container.appendChild(textdiv);
        for (var i = 0; i < dist; i++) {
            var shadowdiv = new Element("div",{className: "pp_shadow"});
            shadowdiv.update(text);
            shadowdiv.unselectable();
            d = dist -i;
            shadowdiv.setStyle(style);
            switch (light) {
                case "down":
                    shadowdiv.setStyle({top: "-"+d+"px"});
                    break;
                case "up":
                    shadowdiv.setStyle({top: d+"px"});
                    break;
                case "left":
                    shadowdiv.setStyle({top: "0px", left: d+"px"});
                    break;
                case "right":
                    shadowdiv.setStyle({top: "0px", left: "-"+d+"px" });
                    break;
                case "upright":
                    shadowdiv.setStyle({top: d+"px", left: "-"+d+"px" });
                    break;
                case "downleft":
                    shadowdiv.setStyle({top: "-"+d+"px", left: d+"px"});
                    break;
                case "downright":
                    shadowdiv.setStyle({top: "-"+d+"px", left: "-"+d+"px" });
                    break;
                case "wide":
                    shadowdiv.setStyle({top: "0px", left: "0px" });
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: "0px", left: "-"+d+"px" })).update(text).setShadowColor(color).unselectable());
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: "0px", left: d+"px"})).update(text).setShadowColor(color).unselectable());
                    break;					
                case "glow":
                    shadowdiv.setStyle({top: "0px", left: "0px" });
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).unselectable()); // up
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: "-"+d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).unselectable()); // down
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: d+"px", left: "-"+d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).unselectable()); // upright
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: d+"px", left: d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).unselectable()); // upleft
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: "-"+d+"px", left: "-"+d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).unselectable()); // downright
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: "-"+d+"px", left: d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).unselectable()); // downleft
                    break;
                default: // upleft
                    shadowdiv.setStyle({top: d+"px", left: d+"px"});
            }
            shadowdiv.setShadowColor(color).unselectable();
            container.appendChild(shadowdiv);
        }
        textdiv.setStyle({position: "relative", zIndex: "120"});
        elem.appendChild(container);
        if (options.imageLike) {
           elem.unselectable().setStyle({cursor: "default"});
        }
        return element;
    },
    /**
     * Creates a tooltion on an element
     * @param {Object} element
     * @param {Object} text
     * @param {Object} options
     */
    tooltip: function(element, text, options){
        if(typeof text != "string"){ return element; }
        options = Object.extend({
            className: false,
            fixed:false,
            opacity:1,
            title:false,
            width:200,
            height:100,
            offset:false,
            zIndex:100000,
            delay:false,     
            duration:false,  
            fadeIn:false,    
            fadeOut:false,   
            shadow:false     
        }, options || {});
        text = (options.title)? "<b>"+options.title+"</b><br>"+text : text;
        element.hover(function(el, evt){ 
            var vpd = document.viewport.getDimensions();
            var getBoxLocation = function(e){
                
                var offTop = options.offset.top? options.offset.top : 15;
                var offLeft = options.offset.left? options.offset.left : 15;
                var top = (Event.pointerY(e)+offTop);
                var left = (Event.pointerX(e)+offLeft);
                
                var dim = tooldiv.getDimensions();
                
                // Keep the box in viewport
                if(left + dim.width > (vpd.width - 20)) { left -= dim.width  + 20 + offLeft; }
                if(top + dim.height > (vpd.height - 20)){ top  -= dim.height + offTop; }
                return {top:top, left:left};
            };
            
            if(document.stopTooltip){ 
                $$(".pp_tooltip_").each(function(t){ t.remove(); });
                return true; 
            }

            outer = new Element("div", {className:'pp_tooltip_'}).setStyle({ opacity:options.opacity, position:"absolute", zIndex:options.zIndex});
            if(options.className){
                tooldiv = new Element("div", {className:options.className}).setStyle({position:"relative", top:"0px", left:"0px", zIndex:10}).update(text);
            }else{
                tooldiv = new Element("div").setStyle({padding:"4px", background: "#eee", width:(options.width == "auto"? "auto" : options.width+"px"), border:"1px solid #333", position:"absolute", top:"0px", left:"0px", zIndex:10}).update(text);
                tooldiv.setCSSBorderRadius('5px');
            }
            if(options.shadow){
                shadTop = options.shadow.top? parseInt(options.shadow.top, 10) : 4;
                shadLeft = options.shadow.left? parseInt(options.shadow.left, 10) : 4;
                shadBack = options.shadow.back? options.shadow.back : "#000";
                shadOp = options.shadow.opacity? options.shadow.opacity : 0.2;
                if (options.className) {
                    shadow = new Element("div", {className: options.className || ""}).setStyle({position:"absolute", borderColor:"#000", color:"#000", top:shadTop+"px", left:shadLeft+"px", zIndex:9, background:shadBack, opacity:shadOp});
                    shadow.update(text);
                }else{
                    shadow = new Element("div", {className: options.className || ""}).setStyle({padding:"4px", border:"1px solid black",  color:"#000", width:options.width+"px", position:"absolute", top:shadTop+"px", left:shadLeft+"px", zIndex:9, background:shadBack, opacity:shadOp});
                    shadow.setCSSBorderRadius('5px');
                    shadow.update(text);
                }

                outer.appendChild(shadow);
            }
            outer.appendChild(tooldiv);

            var makeItAppear = function(){
                if (options.fixed) {
                    var fixTop = options.fixed.top? parseInt(options.fixed.top, 10) : element.getHeight();
                    var fixLeft = options.fixed.left? parseInt(options.fixed.left, 10) : element.getWidth()-50;
                    outer.setStyle({ top: fixTop+"px", left: fixLeft+"px"});
                }else{
                    element.observe("mousemove", function(e){
                        if(document.stopTooltip){ 
                            $$(".pp_tooltip_").each(function(t){ t.remove(); });
                            return true; 
                        }
                        var loc = getBoxLocation(e);
                        // Keep the box in viewport
                        outer.setStyle({ top: loc.top+"px", left: loc.left+"px"});
                    });
                }
            };

            outer.delay = setTimeout(function(){
                if(options.fadeIn){
                    document.body.appendChild(outer);
                    var fl = getBoxLocation(evt);
                    outer.setStyle({opacity: 0, top:fl.top+"px", left:fl.left+"px"});
                    dur = options.fadeIn.duration? options.fadeIn.duration : 1;
                    outer.appear({duration:dur, onEnd:makeItAppear()});
                }else{
                    document.body.appendChild(outer);
                    var l = getBoxLocation(evt);
                    outer.setStyle({top:l.top+"px", left:l.left+"px"});
                    setTimeout(makeItAppear, 100);
                }
                
                if (options.duration) {
                    outer.duration = setTimeout(function(){
                        if (options.fadeOut) {
                            dur = options.fadeOut.duration ? options.fadeOut.duration : 1;
                            outer.fade({duration: dur, onEnd: function(){ if(outer.parentNode){  outer.remove(); } }});
                        }else{
                            if(outer.parentNode){ outer.remove(); }
                        }
                    }, options.duration * 1000 || 0);
                }
            }, options.delay*1000 || 0);
        },function(){
            if(document.stopTooltip){ 
                $$(".pp_tooltip_").each(function(t){ t.remove(); });
                return true; 
            }
            clearTimeout(outer.delay);
            clearTimeout(outer.duration);
            if(options.fadeOut){
                dur = options.fadeOut.duration? options.fadeOut.duration : 0.2;
                outer.fade({duration:dur, onEnd:function(){ if(outer.parentNode){  outer.remove(); } }});
            }else{
                if(outer.parentNode){ outer.remove(); }
            }
        });
        return element;
    },

    /**
     * Makes element draggable
     * @param {Object} element
     * @param {Object} options
     */
    draggable:function(element, options){
        options = Object.extend({
            dragClass: "",  
            handler: false, 
            onStart: Prototype.K, 
            onDrag:  Prototype.K,
            onDragEnd:  Prototype.K,
            onEnd:   Prototype.K, 
            dragEffect: false,
            revert: false,
            clone:   false,
            snap:    false,
            cursor: "move",
            // Constraints are somewhat buggy in internet explorer
            constraint: false,
            constrainLeft:false,
            constrainRight:false,
            constrainTop:false,
            constrainBottom:false,
            constrainOffset:false, // [top, right, bottom, left]
            constrainViewport:false,
            dynamic:true
        }, options || {});

        if(options.snap && (typeof options.snap == "number" || typeof options.snap == "string")){
            options.snap = [options.snap, options.snap];
        }
        
        if(options.constrainOffset){
            if(options.constrainOffset.length == 4){
                options.constrainTop = options.constrainTop? options.constrainTop : options.constrainOffset[0];
                options.constrainRight = options.constrainRight? options.constrainRight : options.constrainOffset[1];
                options.constrainBottom = options.constrainBottom? options.constrainBottom : options.constrainOffset[2];
                options.constrainLeft = options.constrainLeft? options.constrainLeft : options.constrainOffset[3];
            }
        }
        
        var handler;
        var stopDragTimer = false;
        
        var drag = function (e){
            //options.onDrag(drag_element, handler, e);
            var top   = startY+(Number(Event.pointerY(e)-mouseY));
            var left  = startX+(Number(Event.pointerX(e)-mouseX));
            if(options.snap){
                top = (top/options.snap[1]).round()*options.snap[1];
                left = (left/options.snap[0]).round()*options.snap[0];
            }
            top = (options.constrainBottom !== false && top >= options.constrainBottom)? options.constrainBottom : top; // Check for max top
            top = (options.constrainTop !== false && top <= options.constrainTop)? options.constrainTop : top; // Check for min top
            left = (options.constrainRight !== false && left >= options.constrainRight)? options.constrainRight : left; // Check for max left
            left = (options.constrainLeft !== false && left <= options.constrainLeft)? options.constrainLeft : left; // Check for min left
            
            if(options.constraint == "vertical"){
                drag_element.setStyle({top: top+"px"});
            }else if(options.constraint == "horizontal"){
                drag_element.setStyle({left: left+"px"});
            }else{
                drag_element.setStyle({top: top+"px", left: left+"px"});
            }
            if(stopDragTimer){
                clearTimeout(stopDragTimer);
            }
            options.onDrag(drag_element, handler, e);
            stopDragTimer = setTimeout(function(){
                options.onDragEnd(drag_element, handler, e);
            }, 50);
        };

        var mouseup = function (ev){
                           
            if(options.dynamic !== true){
                document.temp.setStyle({top:element.getStyle('top'), left:element.getStyle('left')});
                element.parentNode.replaceChild(document.temp, element);
                document.temp.oldZIndex = element.oldZIndex;
                element = document.temp;
            }
            
            options.onEnd(drag_element, handler, ev);
            drag_element.setStyle({zIndex: element.oldZIndex});
            
            drag_element.removeClassName(options.dragClass);
            $(document.body).selectable();
            handler.selectable();
            drag_element.selectable();
                            
            if(options.revert){
                if(options.revert === true){
                    options.revert = {
                        easing: "sineIn",
                        duration: 0.5
                    };
                }else{
                    options.revert.easing = options.revert.easing? options.revert.easing : 'sineIn';
                    options.revert.duration = options.revert.duration? options.revert.duration : 0.5;
                }

                drag_element.shift({left:drag_element.startX, top:drag_element.startY, opacity:1, duration:options.revert.duration, easing:options.revert.easing});
                drag_element.startX = false;
                drag_element.startY = false;
            }else{
                if(options.dragEffect){
                    drag_element.shift({opacity: 1, duration:0.2});
                }
            }


            document.stopObserving("mousemove", drag);
            document.stopObserving("mouseup", mouseup);
        };

        if (options.handler) {
            if (typeof options.handler == "string") {
                handler = (options.handler.startsWith(".")) ? element.descendants().find(function(h){
                    return h.className == options.handler.replace(/^\./, "");
                }) : $(options.handler);
            } else {
                handler = $(options.handler);
            }
        }else{
            handler = element;
        }
        
        handler.setStyle({cursor:options.cursor});
        handler.observe("mousedown", function(e){

            if(document.stopDrag){ return true; }
            
            var vdim = false, voff = false;
            
            if(options.constrainElement) { 
                voff = (Prototype.Browser.IE)? {top:0, left:0} : $(options.constrainElement).cumulativeOffset();
                vdim = $(options.constrainElement).getDimensions(); 
            }
            
            if(options.constrainParent)  { 
                voff = (Prototype.Browser.IE)? {top:0, left:0} : $(element.parentNode).cumulativeOffset();
                vdim = $(element.parentNode).getDimensions(); 
            }
            
            if(options.constrainViewport){ 
                voff = {top:0, left:0};
                vdim = document.viewport.getDimensions(); 
            }
            
            if(vdim){
                vdim.height+=voff.top;
                vdim.width+=voff.left;
                options.constrainTop = voff.top+1;
                options.constrainBottom = vdim.height-(element.getHeight()+1);
                options.constrainRight = vdim.width-(element.getWidth()+1);
                options.constrainLeft = voff.left+1;
            }
            
            if(options.dynamic !== true){
                try{
                document.temp = element;
                var temp_div = new Element('div').setStyle({
                        height: element.getHeight()+"px", width:element.getWidth()+"px", border:'1px dashed black',
                        top:element.getStyle('top')||0, left:element.getStyle('left')||0, zIndex: element.getStyle('zIndex')||0, 
                        position:element.getStyle('position'), background:'#f5f5f5', opacity:0.3 });
                }catch(e){}
                element.parentNode.replaceChild(temp_div, element);
                element = temp_div;
            }
            
            startX = element.getStyle("left")? parseInt(element.getStyle("left"), 10) : element.offsetLeft;
            startY = element.getStyle("top")? parseInt(element.getStyle("top"), 10) : element.offsetTop;
            mouseX = Number(Event.pointerX(e));
            mouseY = Number(Event.pointerY(e));
            if (options.clone) {
                drag_element = element.cloneNode({deep: true});
                $(document.body).insert(drag_element);
            }else{
                drag_element = element;
            }

            options.onStart(drag_element, handler, e);
            drag_element.addClassName(options.dragClass);

            element.oldZIndex = element.getStyle("z-index")||0;
            if(options.dragEffect){
                drag_element.shift({opacity: 0.7, duration:0.2});
            }

            drag_element.setStyle({position: "absolute", zIndex:9900000});
            if(options.revert && !drag_element.startX && !drag_element.startY){
                drag_element.startX = startX;
                drag_element.startY = startY;
            }
            drag_element.unselectable();
            handler.unselectable();
            $(document.body).unselectable();
            document.observe("mousemove", drag);
            document.observe("mouseup", mouseup);
            
        });
        return element;
    },
    /**
     * Creates Star rating element. Requires stars.png
     * @param {Object} element
     * @param {Object} options
     */
    rating: function(element, options){
        options = Object.extend({
            imagePath: "stars.png",
            onRate: Prototype.K,
            disable: false,
            disabled: element.getAttribute("disabled")? element.getAttribute("disabled") : false,
            stars: element.getAttribute("stars")? element.getAttribute("stars") : 5,
            name: element.getAttribute("name")? element.getAttribute("name") : "rating",
            value: element.getAttribute("value")? element.getAttribute("value") : 0
        }, options || {});

        if(element.converted){
           return element;
        }

        element.converted = true;

        var image = { blank: "0px 0px", over: "-16px 0px", clicked: "-32px 0px", half: "-48px 0px" };
        var hidden = new Element("input", {type:"hidden", name:options.name});
        var stardivs = $A([]);

        element.disabled = (options.disabled=="true")? true : false;
        element.setStyle({width:(options.stars*20)+"px", cursor:options.disabled? "default" : "pointer"/*, clear:"left"*/});
        element.unselectable();
        $A($R(1, options.stars)).each(function(i){
            var star = new Element("div").setStyle({height:"16px", width:"16px", margin:"0.5px", cssFloat:"left", backgroundImage:"url("+options.imagePath+")"});
            star.observe("mouseover", function(){
                if(!element.disabled){
                    var desc = $A(element.descendants());
                    desc.each(function(e, c){ if(c < i){ e.setStyle({ backgroundPosition: e.hasClassName("rated")? image.clicked : image.over }); } });
                }
            }).observe("click", function(){
                if (!element.disabled) {
                    var desc = $A(element.descendants());
                    desc.each(function(e){ e.setStyle({backgroundPosition:image.blank}).removeClassName("rated"); });
                    desc.each(function(e, c){ if(c < i){ e.setStyle({backgroundPosition:image.clicked}).addClassName("rated"); } });
                    hidden.value = i;
                    if(options.disable){
                      element.disabled = true;
                      element.setStyle({cursor:"default"});
                    }
                    options.onRate(element, options.name, i);
                }
            });

            stardivs.push(star);
        });

        if (!options.disabled) {
            element.observe("mouseout", function(){
                element.descendants().each(function(e){
                    e.setStyle({
                        backgroundPosition: e.hasClassName("rated") ? image.clicked : image.blank
                    });
                });
            });
        }
        stardivs.each(function(star){ element.insert(star); });
        element.insert(hidden);
        if(options.value > 0){
            element.descendants().each(function(e, c){
                 c++;
                 if(c <= options.value){ 
                     e.setStyle({backgroundPosition:image.clicked }).addClassName("rated"); 
                 }

                 if(options.value > c-1 && options.value < c){
                     e.setStyle({backgroundPosition:image.half }).addClassName("rated"); 
                 }
             });
            hidden.value = options.value;
        }
        return element;
    },
    /**
     * Makes an apple style search box. Requires apple_search.png
     * @param {Object} element
     * @param {Object} options
     */
    makeSearchBox: function (element, options){
        options = Object.extend({
            defaultText:"search",
            onWrite:Prototype.K,
            onClear:Prototype.K,
            imagePath:"apple_search.png"
        }, options || {});

        element.observe("keyup", function(e){
            if (cross) {
                cross.setStyle({
                    backgroundPosition: element.value !== "" ? "0 -57px" : "0 -38px"
                });
            }
            options.onWrite(element.value, e);
        }).observe("focus", function(){
            if(element.value == options.defaultText){
                element.value="";
                element.setStyle({color:"#666"});
            }
        }).observe("blur", function(){
            if(element.value===""){
                element.setStyle({color:"#999"});
                element.value = options.defaultText;
                if (cross) {
                    cross.setStyle({
                        backgroundPosition: element.value !== "" ? "0 -57px" : "0 -38px"
                    });
                }
            }
        });
        element.value = options.defaultText;
        element.setStyle({color:"#999"});

        if(Prototype.Browser.WebKit){
            element.addClassName("searchbox");
            return element;
        }

        element.setStyle({
            border:"none",
            background:"none",
            height:"14px",
            width: (parseInt(element.getStyle("width"), 10)-22)+"px"
        });
        var tbody;
        var table = new Element("table", { cellpadding: 0, cellspacing: 0, className:"searchbox"}).setStyle({
            height:"19px",
            fontFamily:"Verdana, Geneva, Arial, Helvetica, sans-serif",
            fontSize:"12px"
        }).insert(tbody = new Element("tbody"));

        var tr = new Element("tr");
        var cont = new Element("td").setStyle({
            backgroundImage:"url("+options.imagePath+")", 
            backgroundPosition:"0 -19px"
        });

        var cross = new Element("td").insert("&nbsp;").setStyle({cursor:'default'});
        tbody.insert(tr.insert(new Element("td").setStyle({
            backgroundImage:"url("+options.imagePath+")",
            backgroundPosition:"0 0",
            width:"10px"
        }).insert("&nbsp;")).insert(cont).insert(cross));

        cross.setStyle({
            backgroundImage:"url("+options.imagePath+")",
            backgroundPosition:element.value !== ""? "0 -57px" : "0 -38px",
            width:"17px"
        });

        cross.observe("click", function(){
            element.value="";
            element.focus();
            element.setStyle({color:"#333"});
            cross.setStyle({
                backgroundPosition:"0 -38px"
            });
            options.onClear(element);
        });
        element.parentNode.replaceChild(table, element);
        cont.insert(element);
        return element;
    },
    /**
     * Slider tool
     * @param {Object} element
     * @param {Object} options
     */
    slider:function(element, options){
        options = Object.extend({
            width:100,
            onUpdate:Prototype.K,
            maxValue:100,
            value:0
        }, options || {});
        
        var valueToPixel = function(value){
            var val = (value*100/options.maxValue)*barWidth/100;
            val = val < 3? 3 : val;
            return Math.round(val);
        };
        
        var sliderOut = new Element('div', {tabindex:1});
        var sliderBar = new Element('div');
        var sliderButton = new Element('div', {id:new Date().getTime()});
        
        var sliderTable = new Element('table', {cellpadding:0, cellspacing:1, border:0, width:options.width});
        var tbody = new Element('tbody');
        var tr = new Element('tr');
        var tr2 = new Element('tr');
        var sliderTD = new Element('td', {colspan:3});
        var startTD = new Element('td', {align:'center', width:20}).insert('0');
        var statTD = new Element('td', {align:'center', width:options.width-40}).insert(options.value);
        var endTD = new Element('td', {align:'center', width:20}).insert(options.maxValue);
        
        var barWidth = options.width-18;
        options.value = valueToPixel(options.value);

        /**
         * Moves the button left side by given value
         * @param {Object} amount
         */
        var moveLEFT = function(amount){
            var l = parseInt(sliderButton.getStyle('left'),10)-amount;
            l = (l <= 3)? 3 : l;
            sliderButton.setStyle({left:l+"px"});
            updateValue(l);
        };
        /**
         * Moves the button right side by given value
         * @param {Object} amount
         */
        var moveRIGTH = function(amount){
            var l = parseInt(sliderButton.getStyle('left'),10)+amount;
            l = (l >= barWidth)? barWidth : l;
            sliderButton.setStyle({left:l+"px"});
            updateValue(l);
        };
        /**
         * Handle key events
         * @param {Object} e
         */
        var sliderKeys = function(e){
            if(e.keyCode == 37){
                moveLEFT(5);
            }else if(e.keyCode == 39){
                moveRIGTH(5);
            }
        };
        /**
         * Handle wheel events
         * @param {Object} e
         */
        var sliderWheel = function(e){ 
            sliderOut.focus();
            var w = Event.wheel(e);
            if(w > 0){ moveRIGTH(5); // If scroll up then move to the right
            }else if(w < 0){ moveLEFT(5); } // else move to the left
        };
        
        /**
         * Calculate the selected value ove 100
         * @param {Object} pos
         * @param {Object} start
         * @param {Object} end
         */
        var updateValue = function(pos){
            
            var total = barWidth;

            if(parseInt(pos, 10) <= 3){
                element.value = 0;
            }else{
                element.value = parseInt(((parseInt(pos, 10) * options.maxValue) / total), 10);
            }
            
            options.onUpdate(element.value);
            statTD.innerHTML = element.value;
            return element.value;
        };
        
        // Set styles
        sliderOut.setStyle({
            border: '1px solid #ccc',
            background: '#f5f5f5',
            width: options.width + 'px',
            position: 'relative',
            overflow:'hidden',
            outline:'none'
        });
        
        sliderBar.setStyle({
            border: '1px solid #333',
            background: '#fff',
            margin: '8px',
            overflow:'hidden',
            height: '3px'
        }).setCSSBorderRadius('4px');
        
        sliderButton.setStyle({
            position: 'absolute',
            height: '13px',
            width: '13px',
            background: '#666',
            overflow:'hidden',
            border: '1px solid #222',
            top: '3px',
            left: options.value + 'px'
        }).setCSSBorderRadius('8px');
        
        startTD.setStyle({fontFamily:'Verdana', fontSize:'9px'});
        statTD.setStyle({fontFamily:'Verdana', fontSize:'9px'});
        endTD.setStyle({fontFamily:'Verdana', fontSize:'9px'});
        
        sliderOut.insert(sliderBar).insert(sliderButton);
        sliderTable.insert(tbody.insert(tr).insert(tr2));
        sliderTD.insert(sliderOut);
        tr.insert(sliderTD);
        tr2.insert(startTD).insert(statTD).insert(endTD);
        
        // Set button draggable
        sliderButton.draggable({constraint:'horizontal', /*snap:10,*/ dragEffect:false, cursor:'default', constrainLeft:3, constrainRight:barWidth, onDrag:function(i){
            updateValue(i.getStyle('left')); // Calculate the amount while dragging
        }});
        
        sliderOut.observe('focus', function(){
            sliderOut.setStyle({borderColor:'#333'});
        }).observe('blur', function(){
            sliderOut.setStyle({borderColor:'#ccc'});
        });
        
        // Set key and mousewheel events
        sliderOut.observe('keypress', sliderKeys).observe(Event.mousewheel, sliderWheel);
        
        sliderOut.observe('click', function(e){ // Set bar click event
            if(e.target.id == sliderButton.id){ /*alert(e.target.id+" == "+sliderButton.id);*/ return false; }
            var l = (Event.pointerX(e)-sliderBar.cumulativeOffset().left);
            l = l < 3? 3 : l;
            l = l>barWidth? barWidth : l;
            sliderButton.shift({left:l, duration:0.5}); // move the button where it's clicked
            updateValue(l);
        });
        
        // Create an hidden field
        var hidden = new Element('input', {type:'hidden', name:element.name, id:element.id});
        element.parentNode.replaceChild(hidden, element); // replace the hidden with original box
        
        element = hidden;
        
        $(hidden.parentNode).insert(sliderTable.unselectable()); // add slider to the page
        
        hidden.setSliderValue = function(val){
            var v =valueToPixel(val);
            sliderButton.shift({left:v, duration:0.5});
            updateValue(v);
        };
        
        return hidden;
    },
    /**
     * Spinner input box
     * @param {Object} element
     * @param {Object} options
     */
    spinner: function(element, options){
        options = Object.extend({
            width:false,
            cssFloat:false,
            allowNegative:false,
            addAmount:1,
            maxValue:false, 
            minValue:false, 
            readonly:false,
            value:false,
            onChange: Prototype.K
        }, options || {});
        
        element.size = 5; // Set a size to make it look good
        if(options.value === false){
            element.value = parseFloat(element.value) || '0';
        }else{
            element.value = options.value;
        }
        
        if(element.value < options.minValue){
            element.value = options.minValue;
        }
        
        // button Styles
        var buttonStyles = { height:'10px', cursor:'default', textAlign:'center', width:'7px', fontSize:'9px', paddingLeft:'4px', paddingRight:'2px', border:'1px solid #ccc', background:'#f5f5f5'};
        var spinnerContainer = new Element('div', {tabindex:'1'});
        if(options.cssFloat){
            spinnerContainer.setStyle({cssFloat:options.cssFloat});
        }
        if(options.width){
            spinnerContainer.setStyle({width:options.width+"px"});
        }
        
        var spinnerTable, tbody, tr, tr2, inputTD, upTD, downTD; // define values
        
        spinnerTable = new Element('table', {cellpadding:0, cellspacing:0, border:0, height:20});
        tbody = new Element('tbody').insert(tr = new Element('tr'));
        
        spinnerContainer.insert(spinnerTable);
        spinnerTable.insert(tbody);
        
        element.parentNode.replaceChild(spinnerContainer, element);
        // Construcy the up button
        tr.insert(inputTD = new Element('td', {rowspan:2}).insert(element)).insert(upTD = new Element('td').insert(new Element('img', {src:'images/bullet_arrow_up.png', align:'right'})));
        // Construct the down button
        tbody.insert(tr2 = new Element('tr').insert(downTD = new Element('td').insert(new Element('img', {src:'images/bullet_arrow_down.png', align:'right'}))));
        
        spinnerTable.setStyle({border:'1px solid #ccc', borderCollapse:'collapse' /*, width:'100%'*/ });
        upTD.setStyle(buttonStyles);
        downTD.setStyle(buttonStyles);
        inputTD.setStyle({paddingRight:'2px'});
        element.setStyle({height:'100%', width:'100%', border:'none', padding:'0px', fontSize:'14px', textAlign:'right', outline:'none'});
        
        /**
         * Up click handler
         */
        var numberUP = function(e){
            if(!parseFloat(element.value)){
                element.value = 0;
            }
            if(options.maxValue && Number(element.value) >= Number(options.maxValue)){ return; } // Don't go up to maxValue
            element.value = parseFloat(element.value)+options.addAmount;
            options.onChange(element.value);
        };
        /**
         * Down click handler
         */
        var numberDOWN = function(e){
            if(!parseFloat(element.value)){
                element.value = 0;
            }
            if(options.minValue && Number(element.value) <= Number(options.minValue)){ return; } // Don't go below to minValue
            if(!options.allowNegative && element.value == '0'){ return; } // Don't go negative
            element.value = parseFloat(element.value)-options.addAmount;
            options.onChange(element.value);
        };
        /**
         * Handle key events
         * @param {Object} e
         * @param {Object} mode
         */
        var spinnerKeys = function(e, mode){
            if(e.target.tagName == "INPUT" && mode == 2){ return; }
            
            if(e.keyCode == 38){
                numberUP(e);
            }else if(e.keyCode == 40){
                numberDOWN(e);
            }
        };
        
        upTD.observe('click', numberUP).unselectable();
        downTD.observe('click', numberDOWN).unselectable();
        element.observe(Prototype.Browser.Gecko? 'keypress' : 'keydown', function(e){ spinnerKeys(e, 1); });
        spinnerContainer.observe(Prototype.Browser.Gecko? 'keypress' : 'keydown', function(e){ spinnerKeys(e, 2); });
        if(options.readonly){
            element.writeAttribute('readonly', "readonly");
        }
        
        element.observe('change', function(){
            options.onChange(element.value);
        });
        
        return element;
    },
    /**
     * Adds color picker to an input filed
     * @param {Object} element
     * @param {Object} options
     */
    colorPicker:function(element, options){
        options = Object.extend({
            title:'Pick a Color',
            background:'#eee',
            onPicked: Prototype.K, // Run when user clicked on a color
            onComplete: Prototype.K, // Run when user clicked OK button
            onStart: Prototype.K
        }, options || {});
        
        /**
         * Sort color by their values
         * @param {Object} cols
         */
        function sortColors(cols){
            var obj = {};
            $H(cols).sortBy(function(p){
                var rgb = Protoplus.Colors.hexToRgb(p.value);
                return rgb[0] + rgb[1] + rgb[2];
            }).each(function(item){obj[item[0]] = item[1];});
            return obj;
        }
        
        element.observe('click', function(){
            if(options.onStart() === false){ // User may want to check before open the box
                return element;
            };
            var validCSSColors =  Protoplus.Colors.getPalette(); // */ sortColors(Protoplus.Colors.colorNames);
            //$R(1, 7).each(function(i){ validCSSColors['blank'+i] = false; }); // Add blank colors
            if(element.colorPickerEnabled){ return false; }
            var colorTD, colorTD2, selectTD, tr, colorTR, selectTR, tbody;
            var table = new Element('table', { cellpadding:4, cellspacing:0, border:0, width:140 }).setStyle({zIndex:100000}).insert(tbody = new Element('tbody'));
            if(options.className){
                table.addClassName(options.className);
            }else{
                table.setStyle({background:options.background,outline:'1px solid #aaa',border:'1px solid #fff'});
            }
            tbody.insert(tr = new Element('tr').insert(new Element('th', {className:'titleHandler', height: '10'}).setText(options.title).setStyle({paddingTop:'2px', paddingBottom:'0px', color:'#333', fontSize:'14px'})))
                 .insert(colorTR = new Element('tr')).insert(selectTR = new Element('tr'));
    
            colorTR.insert(colorTD = new Element('td'));
            colorTR.insert(colorTD2 = new Element('td'));
            selectTR.insert(selectTD = new Element('td', {colspan:2}));
            var box = new Element('input', {type:'text'}).setStyle({width:'100px', margin:'1px'});
            box.observe('keyup', function(){
                box.setStyle({background:box.value, color:Protoplus.Colors.invert(box.value)});
            });
            var flip = new Element('input', {type:'button', value:'Flip'});
            flip.observe('click', function(){
                var sc = overFlowDiv.getScroll();
                scr = 0;
                if(sc.y >= 0)  { scr = 140; }
                if(sc.y >= colorTable.getHeight()-140){ 
                    scr = 0; 
                }else{
                    scr = sc.y + 140;
                }
                overFlowDiv.shift({scrollTop:scr, link:'ignore', duration:0.3});
            });

            var OK = new Element('input', {type:'button', value:'Ok'}).observe('click', function(){
                element.value = box.value;
                element.focus();
                table.remove();
                setTimeout(function(){
                    element.colorPickerEnabled = false;
                    options.onComplete(box.value, element, table);
                }, 100);
            });
            
            if(options.buttonClass){
                 $(flip, OK).invoke('addClassName', options.buttonClass);
            }else{
                 $(flip, OK).invoke('setStyle', {padding:'1px', margin:'1px', background:'#f5f5f5', border:'1px solid #ccc'});
            }
            
            selectTD.insert(box).insert(flip).insert(OK);
            var colorTable = new Element('table', { cellpadding:0, cellspacing:0, border:0, width:140 });
            var colorTbody = new Element('tbody'), colCount = 0, colTR;
            
            $H(validCSSColors).each(function(color){
                if(colCount == 7){ colCount = 0; }
                if(colCount++ === 0){
                    colTR = new Element('tr');
                    colorTbody.insert(colTR);
                }
                var tdSize = 20;
                
                var pick = function(e){
                    box.value = color.value;
                    box.setStyle({background:box.value, color:Protoplus.Colors.invert(box.value)});
                    options.onPicked(box.value, element, table);
                };
                
                if(color.value === false){
                    colTR.insert(new Element('td', {width:tdSize, height:tdSize}).setStyle({background:'#fff'}).setStyle({/*borderRight:'1px solid #999', borderBottom:'1px solid #999'*/}));
                }else{
                    colTR.insert(new Element('td', {width:tdSize, height:tdSize}).setStyle({background:color.value}).observe('click', pick).tooltip(color.value, {delay:0.6, width:'auto'}));
                }
            });
            colorTable.insert(colorTbody);
            
            var overFlowDiv = new Element('div').setStyle({outline:'1px solid #fff', border:'1px solid #666', overflow:'hidden', height:'140px'});
            var preTable = new Element('table', {cellPadding:0, cellspacing:0, width:40}).setStyle({outline:'1px solid #fff', border:'1px solid #666', overflow:'hidden', height:'140px'});
            var preTbody = new Element('tbody');
            preTable.insert(preTbody);
            colorTD2.insert(preTable);
            colorTD.insert(overFlowDiv.insert(colorTable));
            var preColors = [
                ["Black:#000000", "Navy:#000080"], 
                ["Blue:#0000FF", "Magenta:#FF00FF"], 
                ["Red:#FF0000", "Brown:#A52A2A"], 
                ["Pink:#FFC0CB", "Orange:#FFA500"], 
                ["Green:#008000", "Yellow:#FFFF00"], 
                ["Gray:#808080", "Turquoise:#40E0D0"], 
                ["Cyan:#00FFFF", "White:#FFFFFF"]
            ];
            $R(0, 6).each(function(i){
                var tr = new Element('tr');
                preTbody.insert(tr);
                tr.insert(new Element('td', {height:20, width:20}).setText('&nbsp;').setStyle({background:preColors[i][0].split(':')[1]}).tooltip(preColors[i][0].split(':')[0], {delay:0.6, width:'auto'}).observe('click', function(){
                    box.value = preColors[i][0].split(':')[1];
                    box.setStyle({background:box.value, color:Protoplus.Colors.invert(box.value)});
                    options.onPicked(box.value, element, table);
                }));
                tr.insert(new Element('td', {height:20, width:20}).setText('&nbsp;').setStyle({background:preColors[i][1].split(':')[1]}).tooltip(preColors[i][1].split(':')[0], {delay:0.6, width:'auto'}).observe('click', function(){
                    box.value = preColors[i][1].split(':')[1];
                    box.setStyle({background:box.value, color:Protoplus.Colors.invert(box.value)});
                    options.onPicked(box.value, element, table);
                }));
            })
            
            
            var top = element.cumulativeOffset().top+element.getHeight();
            var left = element.cumulativeOffset().left;
            table.setStyle({position:'absolute', top:top + 3 +"px", left:left + 2 +'px'});
            
            table.draggable({handler: table.select('.titleHandler')[0] , dragEffect:false});
            $(document.body).insert(table);
            overFlowDiv.setScroll({y:'0'});
            
            element.colorPickerEnabled = true;
        });
        return element;
    },
    /**
     * Places a small label boz at the specified position on an input box
     * @param {Object} element
     * @param {Object} label
     * @param {Object} options
     */
    miniLabel:function(element, label, options){
        options = Object.extend({
            position: 'bottom',
            color: '#666',
            size: 9,
            text:''
        }, options || {});
        element.wrap('span');
        span = $(element.parentNode);
        span.setStyle({whiteSpace:'nowrap', cssFloat:'left', marginRight:'5px'});
        var labelStyle = {paddingLeft:'1px', fontSize:options.size+"px", color:options.color, cursor:'default'};
        var labelClick = function(){
            element.focus();
        };
        
        if(options.position == "top"){
            element.insert({before:new Element('span').setText(label+'<br>').setStyle(labelStyle).observe('click', labelClick)}).insert({after:options.text});
        }else{
            element.insert({after:new Element('span').setText('<br>'+label).setStyle(labelStyle).observe('click', labelClick)}).insert({after:options.text});
        }
        
        return span;
    },
    /**
     * Places hint texts into input boxes
     * @param {Object} element
     * @param {Object} value
     */
    hint: function(element, options){
        var value = "";
        if(typeof options == "string"){
            value = options;
            options = Object.extend({
                hintColor:'#999'
            }, {});
        }
        
        var color = element.getStyle('color') || '#000';
        
        element.setStyle({color:'#999'});
        element.value = value;
        element.hinted = true;
        
        element.observe('focus', function(){
            if(element.value == value){
                element.value = "";
                element.setStyle({color:color}).hinted = false;
            }
        });
        
        element.observe('blur', function(){
            if(element.value === ""){
                element.value = value;
                element.setStyle({ color:'#999' }).hinted = true;
            }
        });
        
        if(element.form){
            $(element.form).observe('submit', function(){
                if(element.value == value){
                    element.value = "";
                    element.hinted = false;
                }
            });
        }
        
        element.hintClear = function(){
            element.value = value;
            element.setStyle({ color:'#999' }).hinted = true;
        };
        
        return element;
    },
    /**
     * Makes element resizable
     * @param {Object} element
     * @param {Object} options
     */
    resizable:function(element, options){
        options = Object.extend({
            sensitivity: 10,
            overflow:0,
            onResize: Prototype.K,
            element:false,
            maxHeight:false,
            minHeight:false,
            maxWidth:false,
            minWidth:false,
            constrainViewport:true,
            constrainParent:false,
            keepAspectRatio:false,
            displayHandlers:true
        }, options, {});
        
        var handlerElem = element;
        
        if(options.element){
            element = $(options.element);
        }
        
        element.resized = true;
        
        var elementPos = handlerElem.getStyle('position');
        if(!elementPos || elementPos == 'static'){
            handlerElem.setStyle({position:'relative'});
        }
        
        var firstDim = element.getDimensions();
        
        var paddings = {
            top:  Math.max(parseInt(element.getStyle('padding-top'), 10) || 0, parseInt(element.getStyle('padding-bottom') || 0, 10)),
            left: Math.max(parseInt(element.getStyle('padding-left'), 10) || 0, parseInt(element.getStyle('padding-right') || 0, 10))
        };
        
        // Handlers
        var handler = new Element('div'), rightHandler = new Element('div'), bottomHandler = new Element('div');
        
        handler.setStyle({height:options.sensitivity+'px',width:options.sensitivity+'px',position:'absolute',bottom:'-'+options.overflow+'px',right:'-'+options.overflow+'px',cursor:'se-resize', zIndex:10000});
        rightHandler.setStyle({ height: '100%', /*element.getHeight() + paddings.top +"px", */ width:options.sensitivity+'px',position:'absolute',top:'0px',right:'-'+options.overflow+'px',cursor:'e-resize', zIndex:10000});
        bottomHandler.setStyle({height:options.sensitivity+'px', width: '100%', /* element.getWidth() + paddings.left + "px" ,*/ position:'absolute',bottom:'-'+options.overflow+'px', left:'0px', cursor:'s-resize', zIndex:10000});
        
        handler.setStyle({ background: 'url(images/resize.png) no-repeat 0px 0px' });
        rightHandler.setStyle({  });
        bottomHandler.setStyle({  });
        
        // Debugging styles
        //handler.setStyle({ borderBottom: '1px dashed #333', borderRight: '1px dashed #333', background: '' });
        //rightHandler.setStyle({ borderRight: '1px dashed #333', background: '' });
        //bottomHandler.setStyle({ borderBottom: '1px dashed #333', background: '' });

        var resize = function(e, type){
            document.stopDrag = true;
            handlerElem.unselectable();
            $(document.body).unselectable();
            var startDim = element.getDimensions();
            var offs = element.cumulativeOffset();
            var mouseStart = { top:Event.pointerY(e), left:Event.pointerX(e) };
            var dim = document.viewport.getDimensions();
            var overflowHeight = "";
            var overflowWidth = "";
            
            var setElementSize = function(dims){
                var height = dims.height;
                var width = dims.width;
                var type = dims.type || 'both';
                
                if(height){
                    height = (options.maxHeight && height >= options.maxHeight)? options.maxHeight : height;
                    height = (options.minHeight && height <= options.minHeight)? options.minHeight : height;
                    element.setStyle({height:height+"px"});
                    //rightHandler.setStyle({height:height + paddings.top +"px"});
                }
                
                if(width){
                    width = (options.maxWidth && width >= options.maxWidth)? options.maxWidth : width;
                    width = (options.minWidth && width <= options.minWidth)? options.minWidth : width;
                    element.setStyle({width: width + "px"});
                    //bottomHandler.setStyle({width:width + paddings.left+"px"});
                }
                
                options.onResize((height || startDim.height) + paddings.top, (width || startDim.width) + paddings.left, type );
            };
            
            var mousemove = function(e){
                if(type != "horizontal"){
                    var height = startDim.height + (Event.pointerY(e) - mouseStart.top);
                    var hskip = false;
                    
                    if (options.constrainViewport) {
                        hskip = (height + offs.top >= dim.height - 3);
                    }
                    
                    if(!hskip){
                        setElementSize({ height: height, type: type });
                        if(options.keepAspectRatio){
                            setElementSize({width: startDim.width + (Event.pointerY(e) - mouseStart.top), type: type });
                        }
                    }
                }
                
                if (type != "vertical") {
                    var width = startDim.width + (Event.pointerX(e) - mouseStart.left);
                    var wskip = false;
                    if (options.constrainViewport) {
                        wskip = (width + offs.left >= dim.width - 3);
                    }
                    if(!wskip){
                        setElementSize({width: width,type: type});
                        if(options.keepAspectRatio){
                            setElementSize({height:startDim.height + ( Event.pointerX(e) - mouseStart.left ), type: type });
                        }
                    }
                }
                
            };
            
            var mouseup = function(){
                document.stopObserving('mousemove', mousemove).stopObserving('mouseup', mouseup).stopDrag = false;
                handlerElem.selectable();
                $(document.body).selectable();
            };
            
            document.observe('mousemove', mousemove).observe('mouseup', mouseup);
            return false;
        };
        
        handler.observe('mousedown', function(e){ resize(e, 'both'); });
        rightHandler.observe('mousedown', function(e){ resize(e, 'horizontal'); });
        bottomHandler.observe('mousedown', function(e){ resize(e, 'vertical'); });
        
        element.hideHandlers = function(){
            handler.hide();
            rightHandler.hide();
            bottomHandler.hide();
        };
        
        element.showHandlers = function(){
            handler.show();
            rightHandler.show();
            bottomHandler.show();
        };
        
        // Insert handlers
        handlerElem.insert(bottomHandler).insert(rightHandler).insert(handler);
        
        return handlerElem;
    },
    /**
     * Keeps the element in viewport when the page is scrolled
     * @param {Object} element
     * @param {Object} options
     */
    keepInViewport: function(element, options){
        
        options = Object.extend({
            offset: [10, 10], // left, top
            offsetLeft: false,
            offsetTop: false,
            delay: 0.1,
            onPinned: Prototype.K,
            onUnpinned: Prototype.K,
            onBeforeScroll: Prototype.K,
            onScroll: Prototype.K,
            smooth: true,
            horzontal: false,
            vertical: true,
            animation: { duration: 0.4, easing:'sineOut' },
            topLimit: parseInt(element.getStyle('top') || 0, 10),
            leftLimit: parseInt(element.getStyle('left') || 0, 10)
        }, options || {});
        
        // Just in case, to protect the animation config
        options.animation = Object.extend({ duration: 0.4 }, options.animation || {});
        options.delay *= 1000;
        
        if(options.smooth === false){
            options.delay = 0;
        }
        
        if(typeof options.offset == 'number'){
            options.offsetLeft = options.offset;
            options.offsetTop = options.offset;
        }else{
            options.offsetLeft = options.offset[0];
            options.offsetTop = options.offset[1];
        }
        
        var timer = false;
        var onScroll =  function(e) { 
            
            if(element.pinned){ return true; }
            if(timer){ clearTimeout(timer); }
            
            var anim = options.animation;
            
            timer = setTimeout(function(){
                var off = /* {top: element.scrollTop || 0, left:element.scrollLeft || 0}; // */ element.cumulativeOffset();
                var sOff = /* {top:window.scrollY || 0, left:window.scrollX || 0}; // */ element.cumulativeScrollOffset();
                var toff = options.offsetTop;
                var loff = options.offsetLeft;
                if(sOff.top < toff){ toff = sOff.top; }
                if(sOff.left < loff){ loff = sOff.left; }
                
                if (options.vertical) {
                    if (sOff.top >= off.top - toff) {
                        if (sOff.top > 0) {
                            anim.top = sOff.top + toff + 'px';
                        }
                    }else {
                        if (off.top != options.topLimit) {
                            if (sOff.top + toff > options.topLimit) {
                                anim.top = sOff.top + toff + 'px';
                            }else {
                                anim.top = options.topLimit + 'px';
                            }
                        }
                    }
                }
                if(options.horizontal){
                    if(sOff.left >= off.left - loff){
                        if(sOff.left > 0){
                            anim.left = sOff.left  + loff + 'px';
                        }
                    }else{
                        if(off.left != options.leftLimit ){
                            if(sOff.left + loff > options.leftLimit){
                                anim.left = sOff.left + loff + 'px';
                            }else{
                                anim.left = options.leftLimit+'px';
                            }
                        }
                    }
                }
                if (options.onBeforeScroll(element, parseInt(anim.top, 10) || 0, parseInt(anim.left, 10) || 0) !== false) {
                    // Move the elements
                    if (options.smooth) {
                        anim.onEnd = function(){ options.onScroll(element, anim.top, anim.left); };
                        element.shift(anim);
                    }else {
                        element.style.left = anim.left;
                        element.style.top = anim.top;
                        options.onScroll(element, anim.top, anim.left);
                    }
                }
            }, options.delay);
        };
        
        // Pins the element where it is located
        element.pin = function(){ options.onPinned(element);  element.pinned = true; };
        // Check if the element is pinned
        element.isPinned = function(){ return element.pinned; };
        // Sets the element free
        element.unpin = function(){
            element.pinned = false;
            // Run the scroll Event when unpinned
            onScroll();
            options.onUnpinned(element);
        };
        
        /**
         * Updates the max and left limits. Suitable for draggable elements
         */
        element.updateLimits = function(){
            options.topLimit = parseInt(element.getStyle('top') || 0, 10);
            options.leftLimit = parseInt(element.getStyle('left') || 0, 10);
            return element;
        };
        // Set the scroll Event
        Event.observe(window, 'scroll', onScroll);
        return element;
    }
});

// The End... Thank you for listening