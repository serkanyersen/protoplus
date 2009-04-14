/**
 * @file    protoplus.js
 * @title   Prototype Plus Extensions Library
 * @author  Serkan Yersen
 * @company Interlogy LLC
 * @version 0.9.6
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
    Version: "0.9.6",
    exec: function(code){
        return eval(code); // I have 'eval is evil' message
    }
};

/**
 * Easing functions for animation effects
 * @param {Object} x
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
    },
    /**
     * Defines keys of the object as variables PHP like.
     * @param {Object} options
     * -- prefix {String}: if given adds the string to variable name. 
     */
    extract: function(options){
        options = Object.extend({prefix:"$"}, options || {});
        elem = this._object;
        $H(elem).each(function(e){
            if (typeof e.value == "string") {
                Protoplus.exec(options.prefix + e.key + " = '" + e.value + "'");
            }else if(Object.isArray(e.value)){
                Protoplus.exec(options.prefix + e.key + " = " + $A(e.value).toJSON());
            }else if(typeof e.value == "object"){
                Protoplus.exec(options.prefix + e.key + " = " + $H(e.value).toJSON());
            }else{
                Protoplus.exec(options.prefix + e.key + " = " + e.value);
            }
        });
        return elem;
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
        var val = $H(value).toJSON();
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
    /**
     * Creates a window
     * @param {Object} options
     */
    createNewWindow: function(options){
        options = Object.extend({ // Default options
            onClose:Prototype.K,
            height:false,
            width:400,
            title:'&nbsp;',
            top:'25%',
            left:'25%',
            borderWidth:15,
            borderColor:'#333',
            borderOpacity:0.3,
            borderRadius: "5px",
            titleClass:false,
            contentClass:false,
            closeButton:'X',
            openEffect:true,
            closeEffect:true,
            dim:true,
            dimColor:'#fff',
            dimOpacity:0.6,
            buttons: false
        }, options || {});

        options.width = parseInt(options.width, 10);
        options.height = (options.height)? parseInt(options.height, 10) : false;
        options.borderWidth = parseInt(options.borderWidth, 10);

        if (options.dim && !document.dimmed) {// Dimm the window background
            var dimmer = new Element('div');
            dimmer.setStyle({background:options.dimColor, position:'absolute', top:'0px', left:'0px', height:'100%', width:'100%', opacity:options.dimOpacity, zIndex:10000});
            $(document.body).setStyle({overflow:'hidden'});
        }

        // Create window structure
        var win, tbody, tr, wrapper, background, title, title_table, title_text, title_close, content;
        win = new Element('div');
        win.insert(background = new Element('div'));
        win.insert(wrapper = new Element('div'));
        wrapper.insert(title = new Element('div'));
        title.insert(title_table = new Element('table', { width:'100%' }).insert(tbody = new Element('tbody').insert(tr = new Element('tr'))));
        tr.insert(title_text = new Element('td'));
        tr.insert(title_close = new Element('td', {width:20, align:'center'}));
        wrapper.insert(content = new Element('div'));

        // set styles
        win.setStyle({
            top: options.top,
            left: options.left,
            position: 'absolute',
            padding: options.borderWidth+'px',
            height: options.height !== false? options.height+'px' : "auto",
            width: options.width + 'px',
            zIndex: 10001
        });

        background.setStyle({
            height: '100%',
            width: '100%',
            background: options.borderColor,
            position: 'absolute',
            top: '0px',
            left: '0px',
            zIndex: 500,
            opacity: options.borderOpacity,
            borderRadius: options.borderRadius,
            MozBorderRadius: options.borderRadius,
            '-webkit-border-radius': options.borderRadius
        });

        if(!options.titleClass){
            title.setStyle({
                background: '#fff',
                zIndex: 1000,
                position: 'relative',
                padding: '2px',
                borderBottom: '1px solid #ccc'
            });
        }else{
            title.addClassName(options.titleClass);
        }

        if(!options.contentClass){
            content.setStyle({
                background: '#fff',
                zIndex: 1000,
                position: 'relative',
                padding: '8px'
            });
        }else{
            content.addClassName(options.contentClass);
        }

        wrapper.setStyle({border:'1px solid #ddd'});
        title_text.setStyle({fontWeight:'bold', color:'#777'});                    
        title_close.setStyle({fontFamily:'Arial, Helvetica, sans-serif', color:'#aaa', cursor:'default'});

        var closebox = function(){ // Close function
            if(options.onClose(win) !== false){
                var close = function(){
                    if(dimmer){ dimmer.remove(); document.dimmed = false; }
                    win.remove();
                    $(document.body).setStyle({overflow:'auto'}); 
                };
                if(options.closeEffect === true){
                    win.shift({opacity:0, duration:0.5, onEnd: close});
                }else{
                    close();
                }
            }
        };

        // Set the content
        title_text.insert(options.title);
        title_close.insert(options.closeButton);
        title_close.onclick = closebox;
        content.insert(options.content);

        // Insert box onto screen
        if (options.dim && !document.dimmed) {
            $(document.body).insert(dimmer);
            document.dimmed = true;
        }

        if(options.openEffect === true){
            win.setStyle({opacity:0});
            win.shift({opacity:1, duration:0.5});
        }

        $(document.body).insert(win);

        win.observe('keydown', function(){ /* I don't know */ });

        // Center the box on screen
        var vp = document.viewport.getDimensions();
        var bvp = win.getDimensions();
        var top = (vp.height - bvp.height) / 2;
        var left = (vp.width - bvp.width) / 2;
        win.setStyle({top:top+"px", left:left+"px"});

        // Make it draggable
        win.draggable({handler:title_text, dragEffect:false, onStart:function(){
            // TODO: Should hide the content to make drag faster   //content.hide();
        }, onEnd:function(){
            // TODO: Bring content back // content.show();
        }});

        win.close = closebox;

        return win;
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
     * Mimics the hover effct on browsers.
     * @param {Object} elem
     * @param {Object} over
     * @param {Object} out
     */
    hover: function(elem, over, out){

        $(elem).observe("mouseover", function(evt){
            if(typeof over == "function"){
                if(elem.innerHTML){
                    if(elem.descendants().include(evt.relatedTarget)){ return true; }
                }
                over(elem, evt);
            }else if(typeof over == "string"){
                $(elem).addClassName(over);
            }
        });

        $(elem).observe("mouseout", function(evt){
            if (typeof out == "function") {
                if(elem.innerHTML){
                    if(elem.descendants().include(evt.relatedTarget)){ return true; }
                }
                out(elem, evt);
            }else if(typeof over == "string"){
                $(elem).removeClassName(over);
            }
        });

        return elem;
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
    }
});

Element.addMethods({
    /**
     * Fires native events oberseved by element
     * @param {Object} element
     * @param {Object} event
     */
    run: function(element, event){
        var evt;
        if (document.createEventObject){
            // dispatch for IE
            evt = document.createEventObject();
            return element.fireEvent('on'+event,evt);
        }
        else{
            // dispatch for firefox + others
            evt = document.createEvent("HTMLEvents");
            evt.initEvent(event, true, true ); // event type,bubbling,cancelable
            return !element.dispatchEvent(evt);
        }
    },
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
            var currentValue = elem.innerHTML.replace(/^\s+|\s+$/gim, "");
            var type = options.type;
            var op = $A(options.options);
            var blur = function(e){ 
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
            elem.onStart(elem, currentValue);

            if(type.toLowerCase() == "textarea"){
                input = new Element("textarea");
                input.value = currentValue;
                input.observe("blur", blur);
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
                    op.each(function(text, i){ input.insert(new Element("input", {type:type,name:"pp", id:"pl_"+i})).insert(new Element("label", {id:"lb_"+i}).insert(text)).insert("<br>"); });
                }else{
                    op.each(function(pair, i){ input.insert(new Element("input", {type:type,name:"pp", value:pair.value? pair.value : i, id:"pl_"+i})).insert(new Element("label", {id:"lb_"+i}).insert(pair.text)).insert("<br>"); });
                }
            } else{
                input = new Element("input", {type:type, value:currentValue});
                input.observe("blur", blur);
            }

            if(options.className){
                input.addClassName(options.className);
            }else{
                input.setStyle(options.style);
            }

            elem.update(input);
            setTimeout(function(){
                input.focus();
                input.select();
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
                outer.update(outer.processAfter(val, outer, elem.getSelected()));
            }

            document._onedit = false;
            outer.onEnd(outer, outer.innerHTML, oldValue, elem.getSelected());
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
     * Makes animation for given attribute. this function can animate every attribute with the numeric values it can also animate color values and scroll amounts.
     * @param {Object} element
     * @param {Object} options
     */
    shift: function(element, options){
        options = Object.extend({
            duration: 1,
            onEnd: Prototype.K,
            onStart: Prototype.K,
            onStep: Prototype.K,
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
                from = (["scrollX", "scrollLeft"].include(option.key))? element.getScroll().x : from = element.getScroll().y;
                unit = '';
            }else if (["background", "color", "borderColor", "backgroundColor"].include(option.key)) {
                to = Colors.hexToRgb(option.value);
                key = option.key == "background" ? "backgroundColor" : option.key;
                from = Colors.getRGBarray(element.getStyle(key) || "");
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
                    var valTo = (options.easing == "pulse" || options.easing == Transitions.pulse)? "from" : "to";
                    if(["scrollX", "scrollLeft", "scrollY", "scrollTop"].include(option.key)){
                        element[option.value.key] = option.value[valTo] + option.value.unit;
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
            options.onStep(element);
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
            offset:false,
            delay:false,     
            duration:false,  
            fadeIn:false,    
            fadeOut:false,   
            shadow:false     
        }, options || {});

        element.hover(function(){ 
            if(document.stopTooltip){ 
                $$(".pp_tooltip_").each(function(t){ t.remove(); });
                return true; 
            }
            outer = new Element("div").setStyle({ opacity:options.opacity, position:"absolute", zIndex:100000});
            if(options.className){
                tooldiv = new Element("div", {className:options.className}).setStyle({position:"absolute", top:"0px", left:"0px", zIndex:10}).update(text);
            }else{
                tooldiv = new Element("div").setStyle({padding:"4px", background: "#eee", width:"250px", border:"1px solid #333", position:"absolute", top:"0px", left:"0px", zIndex:10}).update(text);
            }
            if(options.shadow){
                shadTop = options.shadow.top? parseInt(options.shadow.top, 10) : 4;
                shadLeft = options.shadow.left? parseInt(options.shadow.left, 10) : 4;
                shadBack = options.shadow.back? options.shadow.back : "#000";
                shadOp = options.shadow.opacity? options.shadow.opacity : 0.2;
                if (options.className) {
                    shadow = new Element("div", {className: options.className || ""}).setStyle({position:"absolute", borderColor:"#000", color:"#000", top:shadTop+"px", left:shadLeft+"px", zIndex:9, background:shadBack, opacity:shadOp}).update(text);                               
                }else{
                    shadow = new Element("div", {className: options.className || ""}).setStyle({padding:"4px", border:"1px solid black",  color:"#000", position:"absolute", top:shadTop+"px", left:shadLeft+"px", zIndex:9, background:shadBack, opacity:shadOp}).update(text);
                }

                outer.appendChild(shadow);
            }
            outer.appendChild(tooldiv);
            if (options.fixed) {
                fixTop = options.fixed.top? parseInt(options.fixed.top, 10) : element.getHeight();
                fixLeft = options.fixed.left? parseInt(options.fixed.left, 10) : element.getWidth()-50;
                outer.setStyle({ top: fixTop+"px", left: fixLeft+"px"});
            }else{
                element.observe("mousemove", function(e){
                    offTop = options.offset.top? options.offset.top : 15;
                    offLeft = options.offset.left? options.offset.left : 15;
                    outer.setStyle({ top: (Event.pointerY(e)+offTop)+"px", left: (Event.pointerX(e)+offLeft)+"px"});
                });
            }
            outer.delay = setTimeout(function(){
                if(options.fadeIn){
                    document.body.appendChild(outer).setStyle({opacity: 0});
                    dur = options.fadeIn.duration? options.fadeIn.duration : 1;
                    outer.appear({duration:dur});
                }else{
                    document.body.appendChild(outer);
                }
                if (options.duration) {
                    outer.duration = setTimeout(function(){
                        if (options.fadeOut) {
                            dur = options.fadeOut.duration ? options.fadeOut.duration : 1;
                            outer.fade({duration: dur,onFinish: function(){ if(outer.parentNode){  outer.remove(); } }});
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
            dragEffect: true,     
            revert: false,
            clone:   false,
            snap:    false,
            cursor: "move",
            constraint: false,
            maxLeft:false,
            minLeft:false,
            maxTop:false,
            minTop:false
        }, options || {});


        if(options.snap && (typeof options.snap == "number" || typeof options.snap == "string")){
            options.snap = [options.snap, options.snap];
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
            top = (options.maxTop && top >= options.maxTop)? options.maxTop : top; // Check for max top
            top = (options.minTop && top <= options.minTop)? options.minTop : top; // Check for min top
            left = (options.maxLeft && left >= options.maxLeft)? options.maxLeft : left; // Check for max left
            left = (options.minLeft && left <= options.minLeft)? options.minLeft : left; // Check for min left
            
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
            options.onEnd(drag_element, handler, ev);
            drag_element.setStyle({zIndex: element.oldZIndex});
            drag_element.removeClassName(options.dragClass);
            $(document.body).selectable();
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
            drag_element.unselectable();
            element.oldZIndex = element.getStyle("z-index")||0;
            if(options.dragEffect){
                drag_element.shift({opacity: 0.7, duration:0.2});
            }

            drag_element.setStyle({position: "absolute", zIndex:9900000});
            if(options.revert && !drag_element.startX && !drag_element.startY){
                drag_element.startX = startX;
                drag_element.startY = startY;
            }
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
        element.setStyle({width:(options.stars*20)+"px", cursor:options.disabled? "default" : "pointer", clear:"left"});
        element.unselectable();
        $A($R(1, options.stars)).each(function(i){
            var star = new Element("div").setStyle({height:"16px", width:"16px", margin:"1px", cssFloat:"left", backgroundImage:"url("+options.imagePath+")"});
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
        
        var valueToPixel=function(value){
            var val = (value*100/options.maxValue)*barWidth/100;
            val = val < 3? 3 : val;
            return Math.round(val);
        }
        
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
        var wheel = 0;
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
            var w = Event.wheel(e);
            if(w === 0){ wheel = 0; }
            if(w > wheel){ moveRIGTH(5); // If scroll up then move to the right
            }else{ moveLEFT(5); } // else move to the left
            wheel+=wheel;
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
        sliderOut.setStyle({border: '1px solid #ccc', background:'#f5f5f5', width:options.width+'px', position:'relative'});
        sliderBar.setStyle({border:'1px solid #333',background:'#fff',margin:'8px',height:'3px'});
        sliderButton.setStyle({
            position: 'absolute',
            height: '13px',
            width: '13px',
            background: '#666',
            border: '1px solid #222',
            MozBorderRadius: '7px',
            borderRadius: '7px',
            '-webkit-border-radius': '7px',
            top: '3px',
            left: options.value + 'px'
        });
        
        startTD.setStyle({fontFamily:'Verdana', fontSize:'9px'});
        statTD.setStyle({fontFamily:'Verdana', fontSize:'9px'});
        endTD.setStyle({fontFamily:'Verdana', fontSize:'9px'});
        
        sliderOut.insert(sliderBar).insert(sliderButton);
        sliderTable.insert(tbody.insert(tr).insert(tr2));
        sliderTD.insert(sliderOut);
        tr.insert(sliderTD);
        tr2.insert(startTD).insert(statTD).insert(endTD);
        
        // Set button draggable
        sliderButton.draggable({constraint:'horizontal', /*snap:10,*/ dragEffect:false, cursor:'default', minLeft:3, maxLeft:barWidth, onDrag:function(i){
            updateValue(i.getStyle('left')); // Calculate the amount while dragging
        }});
        
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
            width:100,
            allowNegative:false,
            addAmount:1,
            maxValue:false, 
            minValue:false, 
            readonly:false,
            value:0,
            onChange: Prototype.K
        }, options || {});
        
        element.size = 5; // Set a size to make it look good
        element.value = options.value; // Set default to 0
        
        if(element.value < options.minValue){
            element.value = options.minValue;
        }
        
        // button Styles
        var buttonStyles = { height:'10px', cursor:'default', textAlign:'center', width:'7px', fontSize:'9px', paddingLeft:'4px', paddingRight:'2px', border:'1px solid #ccc', background:'#f5f5f5'};
        var spinnerContainer = new Element('div', {tabindex:'1'});
        spinnerContainer.setStyle({width:options.width+"px"});
        
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
        
        spinnerTable.setStyle({border:'1px solid #ccc', borderCollapse:'collapse', width:'100%'});
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
        })
        
        return element;
    }
});

Element.addMethods({
    /**
     * Returns the selected value of the element
     * @param {Object} element
     */
    getSelected: function(element){
        if(!element.options){
            if(element.innerHTML){
                return element.innerHTML;
            }else{
                return element.value;
            }
        }
        var selected =  element.selectedIndex >= 0? element.options[element.selectedIndex] : element;
        return selected;
    },
    /**
     * Selects the option of an element
     * @param {Object} element
     * @param {Object} val
     */
    selectOption: function(element, val){

        if(!val){
            return element;
        }

        if(typeof val == "string"){
            val = val.split(/\s*,\s*/);
        }

        $A(element.options).each(function(option){
            if(val.include(option.value) || val.include(option.text)){
                option.selected = true;
            }
        });

        return element;
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
// The End... Thank you for listening