/*jslint nomen:false, debug:true, evil:true, vars:false, browser:true, forin:true, undef:false, white:false */
/**
 * @file    protoplus.js
 * @title   Prototype Plus Extensions Library
 * @author  Serkan Yersen
 * @company Interlogy LLC
 * @version 1.0.1
 * @todo Perform a complete test for all CSS values for shift
 * @todo Read CSS classes and add Morping
 * @todo Write a complete documentation
 * @todo Add droppables
 * @todo Add resizables
 */
if(window.console === undefined){
    if (!window.console || !console.firebug) {
        (function (m, i) {
            window.console = {};
            var e = function () {};
            while (i--) { window.console[m[i]] = e; }
        })('log debug info warn error assert dir dirxml trace group groupEnd time timeEnd profile profileEnd count'.split(' '), 16);
    }
    window.console.error = function(e){ throw(e); };
}

if(window.Prototype === undefined){
    throw("Error:prototype.js is required by protoplus.js. Go to prototypejs.org and download lates version.");
}

Protoplus = {
    Version: "1.0.1",
    exec: function(code){
        return eval(code); // I have had this 'eval is evil' message
    },
    REFIDCOUNT: 100, // Reference ID
    references:{}, // Hold references
    /**
     * Returns the Internet explorer version
     */
    getIEVersion: function(){
      var rv = -1; // Return value assumes failure.
      if (navigator.appName == 'Microsoft Internet Explorer')
      {
        var ua = navigator.userAgent;
        var re  = new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})");
        if (re.exec(ua) !== null){
          rv = parseFloat( RegExp.$1 );            
        }
      }
      return rv;
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
        backIn:     function(b){ var a = 1.70158;return (b) * b * ((a + 1) * b - a);},
        backOut:    function(b){ var a = 1.70158;return (b = b - 1) * b * ((a + 1) * b + a) + 1;},
        backInOut:  function(b){ var a = 1.70158;if ((b /= 0.5) < 1) {return 0.5 * (b * b * (((a *= (1.525)) + 1) * b - a));}return 0.5 * ((b -= 2) * b * (((a *= (1.525)) + 1) * b + a) + 2);},
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
        swingFrom:  function(b){ var a = 1.70158;return b * b * ((a + 1) * b - a);},
        swingTo:    function(b){ var a = 1.70158;return (b -= 1) * b * ((a + 1) * b + a) + 1;},
        swingFromTo:function(b){ var a = 1.70158;return ((b /= 0.5) < 1) ? 0.5 * (b * b * (((a *= (1.525)) + 1) * b - a)) : 0.5 * ((b -= 2) * b * (((a *= (1.525)) + 1) * b + a) + 2);},
        easeFrom:   function(a){ return Math.pow(a, 4);},
        easeTo:     function(a){ return Math.pow(a, 0.25);},
        easeFromTo: function(a){ if ((a /= 0.5) < 1) {return 0.5 * Math.pow(a, 4);}return -0.5 * ((a -= 2) * Math.pow(a, 3) - 2);},
        pulse:      function(x, n){ if (!n) { n = 1; } return 0.5 - Math.cos(x * n * 2 * Math.PI) / 2; },
        wobble:     function(x, n){ if (!n) { n = 3; } return 0.5 - Math.cos((2 * n - 1) * x * x * Math.PI) / 2; },
        elastic:    function(x, e){ var a; if (!e) { a = 30; } else { e = Math.round(Math.max(1, Math.min(10, e))); a = (11 - e) * 5; } return 1 - Math.cos(x * 8 * Math.PI) / (a * x + 1) * (1 - x); },
        bounce:     function(x, n){ n = n ? Math.round(n) : 4; var c = 3 - Math.pow(2, 2 - n); var m = -1, d = 0, i = 0; while (m / c < x) { d = Math.pow(2, 1 - i++); m += d; } if (m - d > 0) { x -= ((m - d) + d / 2) / c; } return c * c * Math.pow(x, 2) + (1 - Math.pow(0.25, i - 1)); },
        bouncePast: function(a){ if (a < (1 / 2.75)) {return (7.5625 * a * a);}else {if (a < (2 / 2.75)) {return 2 - (7.5625 * (a -= (1.5 / 2.75)) * a + 0.75);}else {if (a < (2.5 / 2.75)) {return 2 - (7.5625 * (a -= (2.25 / 2.75)) * a + 0.9375);}else {return 2 - (7.5625 * (a -= (2.625 / 2.75)) * a + 0.984375);}}}}
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
        stimes:{},
        /**
         * Start the profile
         * @param {Object} title Title of the process in order to recognize later
         */
        start: function(title){
            Protoplus.Profiler.stimes[title] = (new Date()).getTime();
                        
            //console.profile(Protoplus.Profiler.title);
        },
        /**
         * Finish and print the result of the profiler
         */
        end:function(title, ret){
            var res = ( ( (new Date()).getTime() - Protoplus.Profiler.stimes[title])/1000).toFixed(3);
            if(ret){
                return res;
            }
            msg = title+' took '+res;
            
            if('console' in window){
                console.log(msg);
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
        for(var e in node){
            if(typeof node[e] == "function" && !opts.showFunctions){ continue; }
            if(opts.skipBlanks && (node[e] === "" || node[e] === undefined)){ continue; }

            var stophere = confirm(text+e+" => "+node[e]);
            if(stophere){
                return node[e];
            }
        }
    }
});

Object.extend(Object, {
    deepClone: function(obj){
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        var clone = Object.isArray(obj)? [] : {};
        for (var i in obj) {
            var node = obj[i];
            if (typeof node == 'object') {
                if (Object.isArray(node)) {
                    clone[i] = [];
                    for (var j = 0; j < node.length; j++) {
                        if (typeof node[j] != 'object') {
                            clone[i].push(node[j]);
                        } else {
                            clone[i].push(this.deepClone(node[j]));
                        }
                    }
                } else {
                    clone[i] = this.deepClone(node);
                }
            } else {
                clone[i] = node;
            }
        }
        return clone;
    },
    /**
     * Checks if the given object is boolean or not
     * @param {Object} bool
     */
    isBoolean: function(bool){
        return (bool === true || bool === false);
    },
    /**
     * Checks if the given element is regular expression or not
     */
    isRegExp: function(obj){
        return !!(obj && obj.test && obj.exec && (obj.ignoreCase || obj.ignoreCase === false));        
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
    },
    /**
     * Squezes the long texts
     * Keeps the start end end of the string to make it more readable
     * @param {Object} length
     */
    squeeze: function(length){
        length = length? length : "30";
        var join = "...";
        
        if((length - join.length) >= this.length){ return this; }
        
        var l = Math.floor((length -join.length) / 2);
        var start = this.substr(0, l+1);
        var end = this.substr(-(l), l);
        return start+join+end;
    },
    
    /**
     * A simple printf
     */
    printf: function(){
        var args = arguments;
        var word = this.toString(), 
        i = 0;
         
        return word.replace(/(\%(\w))/gim, function(word, match, tag, count){
            var s = args[i] !== undefined? args[i] : '' ;
            i++;
            switch(tag){
                case "f":
                    return parseFloat(s).toFixed(2);
                case "d":
                    return parseInt(s, 10);
                case "x":
                    return s.toString(16);
                case "X":
                    return s.toString(16).toUpperCase();
                case "s":
                    return s;
                default:
                    return match;
            }            
        });
    },
    
    /**
     * Add slashes
     */
    sanitize: function(){
        var str = this;
        return (str+'').replace(/[\\"']/g, '\\$&').replace(/\u0000/g, '\\0');
    },
    
    nl2br: function(is_xhtml){
        var str = this;
        var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
        return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'');// +'\n'); Removed trailing new line
    },
    
    /**
     * Strip slashes
     */
    stripslashes: function(){
        var str = this;
        return (str+'').replace(/\\(.?)/g, function (s, n1) {
            switch (n1) {
                case '\\':
                    return '\\';
                case '0':
                    return '\u0000';
                case '':
                    return '';
                default:
                    return n1;
            }
        });
    },
    
    /**
     * Turkish to lowercase
     */
    turkishToUpper: function(){
        var string = this;
        var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
        string = string.replace(/([iışğüçö])+/g, function(letter){ return letters[letter]; });
        return string.toUpperCase();
    },
    /**
     * Turkish to uppper case
     */
    turkishToLower: function(){
        var string = this;
        var letters = { "İ": "i", "I": "ı", "Ş": "ş", "Ğ": "ğ", "Ü": "ü", "Ö": "ö", "Ç": "ç" };
        string = string.replace(/([İIŞĞÜÇÖ])+/g, function(letter){ return letters[letter]; });
        return string.toLowerCase();
    }, 
    /**
     * Convert to camelCase
     */
    toCamelCase: function() {
        var str = this;
        newStr = str.replace(/\s+/g, '_');
        strArr = newStr.split('_');
        if (strArr.length === 0) {
            return newStr;
        }
        newStr = "";
        for (var i = 0; i < strArr.length; i++) {
            newStr += strArr[i][0].toUpperCase();
            newStr += strArr[i].substr(1);
        }
        return newStr;
    },
    /**
     * @see http://www.conlang.info/cgi/dia.cgi
     */
    fixUTF: function(){
        var lowerCase={"a":"00E1:0103:01CE:00E2:00E4:0227:1EA1:0201:00E0:1EA3:0203:0101:0105:1D8F:1E9A:00E5:1E01:2C65:00E3:0251:1D90","b":"1E03:1E05:0253:1E07:1D6C:1D80:0180:0183","c":"0107:010D:00E7:0109:0255:010B:0188:023C","d":"010F:1E11:1E13:0221:1E0B:1E0D:0257:1E0F:1D6D:1D81:0111:0256:018C","e":"00E9:0115:011B:0229:00EA:1E19:00EB:0117:1EB9:0205:00E8:1EBB:0207:0113:2C78:0119:1D92:0247:1EBD:1E1B","f":"1E1F:0192:1D6E:1D82","g":"01F5:011F:01E7:0123:011D:0121:0260:1E21:1D83:01E5","h":"1E2B:021F:1E29:0125:2C68:1E27:1E23:1E25:0266:1E96:0127","i":"0131:00ED:012D:01D0:00EE:00EF:1ECB:0209:00EC:1EC9:020B:012B:012F:1D96:0268:0129:1E2D","j":"01F0:0135:029D:0249","k":"1E31:01E9:0137:2C6A:A743:1E33:0199:1E35:1D84:A741","l":"013A:019A:026C:013E:013C:1E3D:0234:1E37:2C61:A749:1E3B:0140:026B:1D85:026D:0142:0269:1D7C","m":"1E3F:1E41:1E43:0271:1D6F:1D86","n":"0144:0148:0146:1E4B:0235:1E45:1E47:01F9:0272:1E49:019E:1D70:1D87:0273:00F1","o":"00F3:014F:01D2:00F4:00F6:022F:1ECD:0151:020D:00F2:1ECF:01A1:020F:A74B:A74D:2C7A:014D:01EB:00F8:00F5","p":"1E55:1E57:A753:01A5:1D71:1D88:A755:1D7D:A751","q":"A759:02A0:024B:A757","r":"0155:0159:0157:1E59:1E5B:0211:027E:0213:1E5F:027C:1D72:1D89:024D:027D","s":"015B:0161:015F:015D:0219:1E61:1E63:0282:1D74:1D8A:023F","t":"0165:0163:1E71:021B:0236:1E97:2C66:1E6B:1E6D:01AD:1E6F:1D75:01AB:0288:0167","u":"00FA:016D:01D4:00FB:1E77:00FC:1E73:1EE5:0171:0215:00F9:1EE7:01B0:0217:016B:0173:1D99:016F:0169:1E75:1D1C:1D7E","v":"2C74:A75F:1E7F:028B:1D8C:2C71:1E7D","w":"1E83:0175:1E85:1E87:1E89:1E81:2C73:1E98","x":"1E8D:1E8B:1D8D","y":"00FD:0177:00FF:1E8F:1EF5:1EF3:01B4:1EF7:1EFF:0233:1E99:024F:1EF9","z":"017A:017E:1E91:0291:2C6C:017C:1E93:0225:1E95:1D76:1D8E:0290:01B6:0240","ae":"00E6:01FD:01E3","dz":"01F3:01C6","3":"0292:01EF:0293:1D9A:01BA:01B7:01EE"};
        var upperCase={"A":"00C1:0102:01CD:00C2:00C4:0226:1EA0:0200:00C0:1EA2:0202:0100:0104:00C5:1E00:023A:00C3","B":"1E02:1E04:0181:1E06:0243:0182","C":"0106:010C:00C7:0108:010A:0187:023B","D":"010E:1E10:1E12:1E0A:1E0C:018A:1E0E:0110:018B","E":"00C9:0114:011A:0228:00CA:1E18:00CB:0116:1EB8:0204:00C8:1EBA:0206:0112:0118:0246:1EBC:1E1A","F":"1E1E:0191","G":"01F4:011E:01E6:0122:011C:0120:0193:1E20:01E4:0262:029B","H":"1E2A:021E:1E28:0124:2C67:1E26:1E22:1E24:0126","I":"00CD:012C:01CF:00CE:00CF:0130:1ECA:0208:00CC:1EC8:020A:012A:012E:0197:0128:1E2C:026A:1D7B","J":"0134:0248","K":"1E30:01E8:0136:2C69:A742:1E32:0198:1E34:A740","L":"0139:023D:013D:013B:1E3C:1E36:2C60:A748:1E3A:013F:2C62:0141:029F:1D0C","M":"1E3E:1E40:1E42:2C6E","N":"0143:0147:0145:1E4A:1E44:1E46:01F8:019D:1E48:0220:00D1","O":"00D3:014E:01D1:00D4:00D6:022E:1ECC:0150:020C:00D2:1ECE:01A0:020E:A74A:A74C:014C:019F:01EA:00D8:00D5","P":"1E54:1E56:A752:01A4:A754:2C63:A750","Q":"A758:A756","R":"0154:0158:0156:1E58:1E5A:0210:0212:1E5E:024C:2C64","S":"015A:0160:015E:015C:0218:1E60:1E62","T":"0164:0162:1E70:021A:023E:1E6A:1E6C:01AC:1E6E:01AE:0166","U":"00DA:016C:01D3:00DB:1E76:00DC:1E72:1EE4:0170:0214:00D9:1EE6:01AF:0216:016A:0172:016E:0168:1E74","V":"A75E:1E7E:01B2:1E7C","W":"1E82:0174:1E84:1E86:1E88:1E80:2C72","X":"1E8C:1E8A","Y":"00DD:0176:0178:1E8E:1EF4:1EF2:01B3:1EF6:1EFE:0232:024E:1EF8","Z":"0179:017D:1E90:2C6B:017B:1E92:0224:1E94:01B5","AE":"00C6:01FC:01E2","DZ":"01F1:01C4"};
        var str = this.toString();
        
        for(var lk in lowerCase){
            var lvalue = '\\u'+lowerCase[lk].split(':').join('|\\u');
            str = str.replace(new RegExp(lvalue, 'gm'), lk);
        }
        
        for(var uk in upperCase){
            var uvalue = '\\u'+upperCase[uk].split(':').join('|\\u');
            str = str.replace(new RegExp(uvalue, 'gm'), uk);
        }
        
        return str;             
    },
    /**
     * Makes the first letter of a word uppercase
     */
    ucFirst: function(){
        return this.charAt(0).toUpperCase() + this.substr(1, this.length + 1);
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
    createCSS: function (selector, declaration) {
        var id = "style-"+selector.replace(/\W/gim, '');
        if($(id)){
           $(id).remove(); 
        }
        // test for IE
        var ua = navigator.userAgent.toLowerCase();
        var isIE = (/msie/.test(ua)) && !(/opera/.test(ua)) && (/win/.test(ua));
    
        // create the style node for all browsers
        var style_node = document.createElement("style");
        style_node.id = id;
        style_node.setAttribute("type", "text/css");
        style_node.setAttribute("media", "screen"); 
    
        // append a rule for good browsers
        if (!isIE) {
            style_node.appendChild(document.createTextNode(selector + " {" + declaration + "}"));
        }
    
        // append the style node
        document.getElementsByTagName("head")[0].appendChild(style_node);
    
        // use alternative methods for IE
        if (isIE && document.styleSheets && document.styleSheets.length > 0) {
            var last_style_node = document.styleSheets[document.styleSheets.length - 1];
            if (typeof(last_style_node.addRule) == "object") {
                last_style_node.addRule(selector, declaration);
            }
        }
    },
    selectRadioOption: function (options, value){
        options.each(function(ele){
           if( ele.value === value )
           {
               ele.checked = true;
           }
        });
    },
    
    preloadImages: function(images){
        var args = arguments;
        if(Object.isArray(images)){
            args = images;
        }
        var i=0; // Stupid lint :(
        for(i=0, images=[]; (src=args[i]); i++){
            images.push(new Image());
            images.last().src = src;
        }
    },

    readRadioOption: function (options){
        for (var i=0; i<options.length; i++){
            var ele = options[i];
            if( ele.checked === true )
            {
                return ele.value;
            }
        }
        return false;
    },
    getEvent: function(ev){
        
        if(!ev){ ev = window.event; }
        
        if(!ev.keyCode && ev.keyCode !== 0){
            ev.keyCode = ev.which;
        }
        
        return ev;
    },
    
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
        document.cookie = name + "=" + escape(value) + expires + ";path="+path;
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
        var val = Object.toJSON(value).cleanJSON();
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
     * simple mesarument for window size
     */
    getClientDimensions: function(){
        var head = document.body.parentNode;
        return { height: head.scrollHeight, width: head.scrollWidth };
    },
    /**
     * Wrapper for keyboard shortcut script of OpenJS
     * @link http://www.openjs.com/scripts/events/keyboard_shortcuts/
     * @param {Object} map
     */
    keyboardMap: function(map){ document.keyMap = map; var shortcut = { 'all_shortcuts': {}, 'add': function(shortcut_combination, callback, opt){ var default_options = { 'type': 'keydown', 'propagate': false, 'disable_in_input': false, 'target': document, 'keycode': false }; if (!opt) { opt = default_options; } else { for (var dfo in default_options) { if (typeof opt[dfo] == 'undefined') { opt[dfo] = default_options[dfo]; } } } var ele = opt.target; if (typeof opt.target == 'string') { ele = document.getElementById(opt.target);  } var ths = this; shortcut_combination = shortcut_combination.toLowerCase(); var func = function(e){ e = e || window.event; if (opt.disable_in_input) { var element; if (e.target) { element = e.target;  } else if (e.srcElement) { element = e.srcElement;  } if (element.nodeType == 3) { element = element.parentNode;  } if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA' || document._onedit) { return;  } } if (e.keyCode) { code = e.keyCode;  } else if (e.which) { code = e.which;  } var character = String.fromCharCode(code).toLowerCase(); if (code == 188) { character = ",";  } if (code == 190) { character = ".";  } var keys = shortcut_combination.split("+"); var kp = 0; var shift_nums = { "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ":", "'": "\"", ",": "<", ".": ">", "/": "?", "\\": "|" }; var special_keys = { 'esc': 27, 'escape': 27, 'tab': 9, 'space': 32, 'return': 13, 'enter': 13, 'backspace': 8, 'scrolllock': 145, 'scroll_lock': 145, 'scroll': 145, 'capslock': 20, 'caps_lock': 20, 'caps': 20, 'numlock': 144, 'num_lock': 144, 'num': 144, 'pause': 19, 'break': 19, 'insert': 45, 'home': 36, 'delete': 46, 'end': 35, 'pageup': 33, 'page_up': 33, 'pu': 33, 'pagedown': 34, 'page_down': 34, 'pd': 34, 'left': 37, 'up': 38, 'right': 39, 'down': 40, 'f1': 112, 'f2': 113, 'f3': 114, 'f4': 115, 'f5': 116, 'f6': 117, 'f7': 118, 'f8': 119, 'f9': 120, 'f10': 121, 'f11': 122, 'f12': 123 }; var modifiers = { shift: { wanted: false, pressed: false }, ctrl: { wanted: false, pressed: false }, alt: { wanted: false, pressed: false }, meta: { wanted: false, pressed: false } }; if (e.ctrlKey) { modifiers.ctrl.pressed = true;  } if (e.shiftKey) { modifiers.shift.pressed = true;  } if (e.altKey) { modifiers.alt.pressed = true;  } if (e.metaKey) { modifiers.meta.pressed = true;  } for (var i = 0; i < keys.length; i++) { k = keys[i]; if (k == 'ctrl' || k == 'control') { kp++; modifiers.ctrl.wanted = true; } else if (k == 'shift') { kp++; modifiers.shift.wanted = true; } else if (k == 'alt') { kp++; modifiers.alt.wanted = true; } else if (k == 'meta') { kp++; modifiers.meta.wanted = true; } else if (k.length > 1) { if (special_keys[k] == code) { kp++;  } } else if (opt.keycode) { if (opt.keycode == code) { kp++;  } } else { if (character == k) { kp++;  } else { if (shift_nums[character] && e.shiftKey) { character = shift_nums[character]; if (character == k) { kp++;  } } } } } if (kp == keys.length && modifiers.ctrl.pressed == modifiers.ctrl.wanted && modifiers.shift.pressed == modifiers.shift.wanted && modifiers.alt.pressed == modifiers.alt.wanted && modifiers.meta.pressed == modifiers.meta.wanted) { callback(e); if (!opt.propagate) { e.cancelBubble = true; e.returnValue = false; if (e.stopPropagation) { e.stopPropagation(); e.preventDefault(); } return false; } } }; this.all_shortcuts[shortcut_combination] = { 'callback': func, 'target': ele, 'event': opt.type }; if (ele.addEventListener) { ele.addEventListener(opt.type, func, false);  } else if (ele.attachEvent) { ele.attachEvent('on' + opt.type, func);  } else { ele['on' + opt.type] = func;  } }, 'remove': function(shortcut_combination){ shortcut_combination = shortcut_combination.toLowerCase(); var binding = this.all_shortcuts[shortcut_combination]; delete (this.all_shortcuts[shortcut_combination]); if (!binding) { return; } var type = binding.event; var ele = binding.target; var callback = binding.callback; if (ele.detachEvent) { ele.detachEvent('on' + type, callback);  } else if (ele.removeEventListener) { ele.removeEventListener(type, callback, false);  } else { ele['on' + type] = false;  } } }; $H(map).each(function(pair){ var key = pair.key; var opts = pair.value; shortcut.add(key, opts.handler, { disable_in_input: opts.disableOnInputs }); }); },
    checkDocType: function (){
        if (document.doctype === null){ return false; }
        var publicId = document.doctype.publicId.toLowerCase();
        return (publicId.indexOf("html 4") > 0) || (publicId.indexOf("xhtml") > 0);
    }
});

/**
 * @link http://adomas.org/javascript-mouse-wheel/ prototype extension by "Frank Monnerjahn" themonnie @gmail.com
 * @link http://www.ogonek.net/mousewheel/demo.html
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
    },
    isInput: function(e){
        var element;
        if (e.target) {
            element = e.target;
        } else if (e.srcElement) {
            element = e.srcElement;
        }
        if (element.nodeType == 3) {
            element = element.parentNode;
        }
        
        if (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA') { return true; }
        return false;
    },
    isRightClick: function(event){
        
        var _isButton;
        if (Prototype.Browser.IE) {
          var buttonMap = { 0: 1, 1: 4, 2: 2 };
          _isButton = function(event, code) {
            return event.button === buttonMap[code];
          };
        } else if (Prototype.Browser.WebKit) {
          _isButton = function(event, code) {
            switch (code) {
              case 0: return event.which == 1 && !event.metaKey;
              case 1: return event.which == 1 && event.metaKey;
              case 2: return event.which == 3 && !event.metaKey; // Safari and chrome right click fix
              default: return false;
            }
          };
        } else {
          _isButton = function(event, code) {
            return event.which ? (event.which === code + 1) : (event.button === code);
          };
        }
        
        return _isButton(event, 2);
    }
});

Protoplus.utils = {
    
    cloneElem: function(element){
        if(Prototype.Browser.IE){
            var div = document.createElement('div');
            div.innerHTML = element.outerHTML;
            return $(div.firstChild);
        }
        return element.cloneNode(true);
    },
    
    /**
     * Simulates the link effect on any HTML element. and defeats the pop up blockers
     * @param {Object} element
     * @param {Object} link
     */
    openInNewTab: function(element, link){
        element.observe('mouseover', function(e){
            if(!element.tabLink){
                var a = new Element('a', {href:link, target:'_blank'}).insert('&nbsp;&nbsp;');
                a.setStyle('opacity:0; z-index:100000; height:5px; width:5px; position:absolute; top:'+(Event.pointerY(e)-2.5)+'px;left:'+(Event.pointerX(e)-2.5)+'px');
                a.observe('click', function(){ element.tabLinked = false; a.remove(); });
                $(document.body).insert(a);
                element.tabLink = a;
                element.observe('mousemove', function(e){
                    element.tabLink.setStyle('top:'+(Event.pointerY(e)-2.5)+'px;left:'+(Event.pointerX(e)-2.5)+'px');
                });
            }            
        });
        return element;
    },
    
    /**
     * Checks if the element has a fixed container or not
     * @param {Object} element
     */
    hasFixedContainer: function(element){
        var result = false;
        element.ancestors().each(function(el){
            if(result){ return; }
            if(el.style.position == "fixed"){
                result = true;
            }
        });
        return result;
    },
    
    getCurrentStyle: function(element, name){
        if (element.style[name]) {
            return element.style[name];
        } else if (element.currentStyle) {
            return element.currentStyle[name];
        }
        else if (document.defaultView && document.defaultView.getComputedStyle) {
            name = name.replace(/([A-Z])/g, "-$1");
            name = name.toLowerCase();
            s = document.defaultView.getComputedStyle(element, "");
            return s && s.getPropertyValue(name);
        } else {
            return null;
        }
    },
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
                
        return isOverflowing? { 
            top: topOverflowing? element.scrollHeight: false , 
            left: leftOverflowing? element.scrollWidth: false, 
            both: leftOverflowing && topOverflowing 
        } : false;
    },
    /**
     * Makes element unselectable. Disable cursor select
     * @param {Object} target
     * 
     */
    setUnselectable: function(target){
        if (typeof target.onselectstart != "undefined") {target.onselectstart = function(){return false;};}
        else if (typeof target.style.MozUserSelect != "undefined") { target.style.MozUserSelect = "none";}
        else {target.onmousedown = function(){ return false;}; }
        target.__oldCursor = target.style.cursor;
        target.style.cursor = 'default';
        return target;
    },
    /**
     * Reverts unselectable effect, enables cursor select
     * @param {Object} target
     */
    setSelectable: function(target){
        if (typeof target.onselectstart != "undefined") { target.onselectstart = document.createElement("div").onselectstart; }
        else if (typeof target.style.MozUserSelect != "undefined") { target.style.MozUserSelect = document.createElement("div").style.MozUserSelect; } 
        else { target.onmousedown = ""; }
        if(target.__oldCursor){
            target.style.cursor = target.__oldCursor;
        }else{
            target.style.cursor = '';
        }
        return target;
    },
    /**
     * Selects all text in any element
     * @param {Object} element
     */
    selectText: function(element){
        var r1 = "";
        if (document.selection) {
            r1 = document.body.createTextRange();
            r1.moveToElementText(element);
            r1.setEndPoint("EndToEnd", r1);
            r1.moveStart('character', 4);
            r1.moveEnd('character', 8);
            r1.select();
        }
        else {
            s = window.getSelection();
            r1 = document.createRange();
            r1.setStartBefore(element);
            r1.setEndAfter(element);
            s.addRange(r1);
        }
        
        return element;
    },
    
    /**
     * Mimics the mouseenter, mouseleave effect on browsers.
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
    
    mouseEnter: function(elem, over, out){
        $(elem).observe("mouseenter", function(evt){
            if(typeof over == "function"){
                over(elem, evt);
            }else if(typeof over == "string"){
                $(elem).addClassName(over);
            }
        });
        $(elem).observe("mouseleave", function(evt){
            if (typeof out == "function") {
                
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
     * Scroll window to keep element in viewport
     * @param {Object} element
     * @param {Object} options
     */
    scrollInto: function(element, options) {
        options = Object.extend({
            offset:[100, 100],
            direction:'bottom' // top, left, right
        }, options || {});
        
        element = $(element);
        var pos = Element.cumulativeOffset(element);
        var vp  = document.viewport.getDimensions();
        var ed  = Element.getDimensions(element);
        
        switch(options.direction){
            case 'bottom':
                if(pos[1]+options.offset[1] >= vp.height + window.scrollY){
                    window.scrollTo(window.scrollX, (pos[1]+options.offset[1]) - vp.height);
                }else if(window.scrollY !== 0 && (pos[1]+options.offset[1] <= Math.abs(vp.height - window.scrollY))){
                    window.scrollTo(window.scrollX, (pos[1]+options.offset[1]) - vp.height);
                }
            break;
            
            case "top":
                var height = element.getHeight();
                if(window.scrollY !== 0 && pos[1] <= window.scrollY + options.offset[1]){
                    window.scrollTo(window.scrollX, pos[1] - options.offset[1]);
                }else if(window.scrollY !== 0 && (pos[1]+options.offset[1] <= Math.abs(vp.height - window.scrollY))){
                    window.scrollTo(window.scrollX, pos[1] - options.offset[1]);
                }
            break;
        }
        
        return element;
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
     * Sets value and returns the element for chaining
     * @param {Object} element
     * @param {Object} value
     */
    putValue: function(element, value){
        if(element.clearHint){
            element.clearHint();
        }
        element.value = value;
        return element;
    },
    /**
     * Resets the value of an upload field
     * @todo find a way to clone events attached by javascript jquery is doing it
     * @param {Object} element
     */
    resetUpload: function(element){
        // Only IE needs a hack to do this
        if(Prototype.Browser.IE){
            var p = element.parentNode;
            var c = element.cloneNode(true);
            p.replaceChild(c, element);
            return c;
        }
        // All new browsers can set empty value to file input
        element.value='';
        return element;
    },
    /**
     * Fires native events oberseved by element
     * @param {Object} element
     * @param {Object} event
     */
    run: function(element, event){
        
        if(event.include(':')){
            element.fire(event);
        }else{
            var evt;
            if (document.createEventObject && !Prototype.Browser.IE9){ // dispatch for IE
                evt = document.createEventObject();
                element.fireEvent('on'+event,evt);
            }else{ // dispatch for firefox + others
                evt = document.createEvent("HTMLEvents");
                evt.initEvent(event, true, true ); // event type,bubbling,cancelable
                element.dispatchEvent(evt);
            }
        }
        
        return element;
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
     * Selects the option of an element
     * @param {Object} element
     * @param {Object} val
     */
    selectOption: function(element, val){
        if(!val){ return element; }
        
        var match_found =false;

      
        $A(element.options).each(function(option){
            // Regular expression Check
            if(Object.isRegExp(val) && (val.test(option.value) )){ option.selected = true;throw $break; }
            if(val == option.value){ option.selected = true; match_found = true; }
        });
        
        if(match_found == false){
          $A(element.options).each(function(option){
              // Regular expression Check
              if(Object.isRegExp(val) && ( val.test(option.text))){ option.selected = true; throw $break; }
              if(val == option.text){  ;option.selected = true;  }
          });  
        }
        
        element.run('change');
        return element;
    },
    /**
     * İmmediatelly stops shift animation without calling an event
     * @param {Object} element
     */
    stopAnimation: function(element){
        element.__stopAnimation = true;
        return element;
    },
    
    /**
     * Makes animation for given attribute. This function can animate every attribute with the numeric values it can also animate color values and scroll amounts.
     * @param {Object} element
     * @param {Object} options
     * Profile (51.4ms, 3576 calls)
     * Profile (43.127ms, 3604 calls)
     * Profile (42.651ms, 3568 calls)
     */
    shift: function(element, options){
        options = Object.extend({
            duration: 1,
            onEnd: Prototype.K,
            onStart: Prototype.K,
            onStep: Prototype.K,
            onCreate: Prototype.K,
            delay: 0,
            link:'cancel',
            transparentColor:'#ffffff',
            remove: false,
            easingCustom:false,
            propertyEasings:{},
            easing: Protoplus.Transitions.sineOut
        }, options || {});

        // Queuing the animation
        if(!element.queue){
            element.queue = [];
        }
        options.onCreate(element, options);
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
        if (element.delayTime){
            clearTimeout(element.delayTime);
        }

        if(typeof options.easing == 'string'){
            if(options.easing in Protoplus.Transitions){
                options.easing = Protoplus.Transitions[options.easing];
            }else{
                options.easing = Protoplus.Transitions.sineOut;
            }
        } else if(typeof options.easing == 'object'){
            options.propertyEasings = options.easing; 
            options.easing = Protoplus.Transitions.sineOut;
        }else if(typeof options.easing != 'function'){
            options.easing = Protoplus.Transitions.sineOut;
        }

        options.duration *= 1000; // convert to milliseconds
        options.delay *= 1000; // convert to milliseconds
        element.timer = false;
        
        var properties = {}, begin, end, 
        
        /*
         * initiates the duration and call on start event
         */
        init = function(){
            begin = new Date().getTime();
            end = begin + options.duration;
            options.onStart(element);
        };
        
        /*
         * Remove the default options 
         */
        for(var x in options){
            if (!["duration", "onStart", "onStep", "transparentColor", "onEnd", "onCreate", "remove", "easing", "link", "delay", "easingCustom", "propertyEasings"].include(x) && options[x] !== false) {
                properties[x] = options[x];
            }            
        }
        // Get the unit value
        var unitRex=/\d+([a-zA-Z%]+)$/;
        
        // Prepare and define values for animation.
        for(var i in properties){
            var okey = i, oval=properties[i];
            var to, from, key, unit, s = [], easing=options.easing;
            
            if (["scrollX", "scrollLeft", "scrollY", "scrollTop"].include(okey)) {
                to = parseFloat(oval);
                key = (okey == "scrollX")? "scrollLeft" : (okey == "scrollY")? "scrollTop" : okey;
                if(element.tagName == "BODY"){
                    from = (okey == "scrollX" || okey == "scrollLeft")? window.scrollX : window.scrollY; // Read the window scroll
                }else{
                    from = (okey == "scrollX" || okey == "scrollLeft")? element.scrollLeft : element.scrollTop;
                }
                unit = '';
            } else if (okey == "rotate"){
                to = parseFloat(oval);
                key = "-webkit-transform";
                from = Element.getStyle(element, '-webkit-transform')? parseInt(Element.getStyle(element, '-webkit-transform').replace(/rotate\(|\)/gim, ""), 10) : 0;
                unit = 'deg';
            } else if (["background", "color", "borderColor", "backgroundColor"].include(okey)) {
                to = Protoplus.Colors.hexToRgb(oval);
                key = okey == "background" ? "backgroundColor" : okey;
                var bgcolor = Element.getStyle(element, key);
                if(!bgcolor || bgcolor == 'transparent'){
                    bgcolor = options.transparentColor;
                }
                
                from = Protoplus.Colors.getRGBarray(bgcolor);
                unit = '';
            } else if(okey == "opacity"){
                to = (typeof oval == "string") ? parseInt(oval, 10) : oval;
                key = okey;
                from = Element.getStyle(element, okey);
                unit = '';
                from = parseFloat(from);
            
            } else {
                to = (typeof oval == "string") ? parseInt(oval, 10) : oval;
                key = okey;
                from = Element.getStyle(element, okey.replace("-webkit-", "").replace("-moz-", "")) || "0px";
                unit = okey == 'opacity' ? '' : (unitRex.test(from))? from.match(unitRex)[1] : 'px';
                from = parseFloat(from);
            }
            
            // If there is a different easing for this item
            if(okey in options.propertyEasings){
                easing = Protoplus.Transitions[options.propertyEasings[okey]];
            }
            
            if(!to && to !== 0){
                try {
                    s[key] = oval;
                    element.style[key] = oval;
                }catch(e){  }
            }else{
                properties[okey] = { key: key, to: to, from: from, unit: unit, easing: easing };
            }
        }
        
        /**
         * Calculate animation amount
         * @param {Object} ease
         * @param {Object} option
         * @param {Object} arr
         */
        var fn = function(ease, option, arr){
            var val = 0;
            if(arr !== false){ 
                return Math.round(option.from[arr] + ease * (option.to[arr] - option.from[arr]));
                
            }
            // begin + ease * change
            // console.log("%s + %s * (%s - %s) = %s", option.from, ease, option.to, option.from, (option.from + ease * (option.to - option.from)))
            return (option.from + ease * (option.to - option.from));
        };
        
        element.__stopAnimation = false;
        
        var step = function(){
            var time = new Date().getTime(), okey, oval, rgb;
            
            if(element.__stopAnimation === true){
                clearInterval(element.timer);
                element.timer = false;
                element.__stopAnimation = false;
                return;
            }
            
            if (time >= end) { // If duration is done. Complete the animation
                clearInterval(element.timer);
                element.timer = false;
                
                var valTo = (options.easing == "pulse" || options.easing == Protoplus.Transitions.pulse)? "from" : "to";
                // This will end the animation with the correct values.
                // if easing is pulse then set values to from.
                for(okey in properties){
                    oval=properties[okey];
                    
                    if(["scrollX", "scrollLeft", "scrollY", "scrollTop"].include(okey)){
                        if (element.tagName.toUpperCase() == "BODY") { // In order to scroll the document
                            if (oval.key == "scrollLeft") {
                                window.scrollTo(oval[valTo], window.scrollY);
                            }else {
                                window.scrollTo(window.scrollX, oval[valTo]);
                            }
                        }else {
                            element[oval.key] = oval[valTo] + oval.unit;
                        }
                    }else if (["background", "color", "borderColor", "backgroundColor"].include(okey)) {
                        element.style[oval.key] = 'rgb('+oval[valTo].join(', ')+")";
                    }else if(okey == "opacity"){
                        Element.setOpacity(element, oval[valTo]);
                    }else if(okey == "rotate"){
                        element.style[okey] = "rotate("+oval[valTo] + oval.unit+")";
                    }else{
                        element.style[okey] = oval[valTo] + oval.unit;
                    }
                }
                
                if(options.onEnd){ options.onEnd(element); }
                if(options.remove){
                    element.remove();
                }
                if(element.queue.length > 0){
                    var que = element.queue.splice(0, 1);
                    element.shift(que[0]);
                }

                return element;
            }
            
            if(options.onStep){ options.onStep(element); }
            
            for(okey in properties){
                oval = properties[okey];
                if(oval.key == "scrollLeft" || oval.key == "scrollTop"){
                    if (element.tagName.toUpperCase() == "BODY") { // In order to scroll the document
                        var scroll = parseInt(fn(oval.easing((time - begin) / options.duration, options.easingCustom), oval, false), 10) + oval.unit;
                        if(oval.key == "scrollLeft"){
                            window.scrollTo(scroll, window.scrollY);
                        }else{
                            window.scrollTo(window.scrollX, scroll);
                        }
                    }else{
                        element[oval.key] = parseInt(fn(oval.easing((time - begin) / options.duration, options.easingCustom), oval, false), 10) + oval.unit;
                    }
                }else if (okey == "background" || okey == "color" || okey == "borderColor" || okey == "backgroundColor") {
                    rgb = [];
                    for (var x = 0; x < 3; x++) {
                         
                         rgb[x] = fn(oval.easing((time - begin) / options.duration, options.easingCustom), oval, x);
                    }
                    
                    element.style[oval.key] = 'rgb('+rgb.join(', ')+')';
                }else if(okey == "opacity"){
                    Element.setOpacity(element, fn(oval.easing((time - begin) / options.duration, options.easingCustom), oval, false));
                }else if(okey == "rotate"){
                    element.style[oval.key] = "rotate("+fn(oval.easing((time - begin) / options.duration, options.easingCustom), oval, false) + oval.unit+")";
                } else {
                    element.style[okey] = fn(oval.easing((time - begin) / options.duration, options.easingCustom), oval, false) + oval.unit;
                }
            }
        };
        
        if(options.delay){
            element.delayTime = setTimeout(function(){
                init();
                element.timer = setInterval(step, 10);
            }, options.delay);
        }else{
            init();
            element.timer = setInterval(step, 10);
        }
        
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
    },    
    /**
     * Solution for circular reference problem. Hopefully it will solve memorry leaks
     * Sets an element with the with the given name as a reference
     * @param {Object} element
     * @param {Object} name
     * @param {Object} reference
     */
    setReference: function(element, name, reference){
        if(!element.REFID){ element.REFID = Protoplus.REFIDCOUNT++; }
        
        if(!Protoplus.references[element.REFID]){
            Protoplus.references[element.REFID] = {};
        }
        Protoplus.references[element.REFID][name] = $(reference);
        return element;
    },
    /**
     * Returns the given name
     * @param {Object} element
     * @param {Object} name
     */
    getReference: function(element, name){
        if(!element.REFID){
            return false;
        }
        return Protoplus.references[element.REFID][name];
    },
    /**
     * Safe remove function, Also removes the references 
     * @param {Object} element
     */
    remove: function(element){
        if(element.REFID){ // Clean unnecessary garbage
            delete Protoplus.references[element.REFID];
        }
        if(element.parentNode){            
            element.parentNode.removeChild(element);
        }
        return element;
    }
};
// emile.js (c) 2009 Thomas Fuchs
// Licensed under the terms of the MIT license.

(function(emile, container){
  var parseEl = document.createElement('div'),
    props = ('backgroundColor borderBottomColor borderBottomWidth borderLeftColor borderLeftWidth '+
    'borderRightColor borderRightWidth borderSpacing borderTopColor borderTopWidth bottom color fontSize '+
    'fontWeight height left letterSpacing lineHeight marginBottom marginLeft marginRight marginTop maxHeight '+
    'maxWidth minHeight minWidth opacity outlineColor outlineOffset outlineWidth paddingBottom paddingLeft '+
    'paddingRight paddingTop right textIndent top width wordSpacing zIndex').split(' ');

  function interpolate(source,target,pos){ return (source+(target-source)*pos).toFixed(3); }
  function s(str, p, c){ return str.substr(p,c||1); }
  function color(source,target,pos){
    var i = 2, j = 3, c, tmp, v = [], r = [];
    j=3; c=arguments[i-1];
    while(i--){
      if(s(c,0)=='r') { 
          c = c.match(/\d+/g);
          while(j--){ v.push(~~c[j]); }
      } else {
        if(c.length==4){ c='#'+s(c,1)+s(c,1)+s(c,2)+s(c,2)+s(c,3)+s(c,3); }
        while(j--){ v.push(parseInt(s(c,1+j*2,2), 16)); }
      }
      j=3;
      c=arguments[i-1]; 
    }
    
    while(j--) { tmp = ~~(v[j+3]+(v[j]-v[j+3])*pos); r.push(tmp<0?0:tmp>255?255:tmp); }
    return 'rgb('+r.join(',')+')';
  }
  
  function parse(prop){
    var p = parseFloat(prop), q = prop.replace(/^[\-\d\.]+/,'');
    return isNaN(p) ? { v: q, f: color, u: ''} : { v: p, f: interpolate, u: q };
  }
  
  function normalize(style){
    var css, rules = {}, i = props.length, v;
    parseEl.innerHTML = '<div style="'+style+'"></div>';
    css = parseEl.childNodes[0].style;
    while(i--){ v = css[props[i]]; if(v){ rules[props[i]] = parse(v); } }
    return rules;
  }  
  
  container[emile] = function(el, style, opts){
    el = typeof el == 'string' ? document.getElementById(el) : el;
    opts = opts || {};
    var target = normalize(style), comp = el.currentStyle ? el.currentStyle : getComputedStyle(el, null),
      prop, current = {}, start = +new Date(), dur = opts.duration||200, finish = start+dur, interval,
      easing = opts.easing || function(pos){ return (-Math.cos(pos*Math.PI)/2) + 0.5; };
      
    for(prop in target){ current[prop] = parse(comp[prop]); }
    interval = setInterval(function(){
      var time = +new Date(), pos = time>finish ? 1 : (time-start)/dur;
      for(var prop in target){
        el.style[prop] = target[prop].f(current[prop].v,target[prop].v,easing(pos)) + target[prop].u;
      }
      if(time>finish) { clearInterval(interval); if(opts.after){ opts.after(); } }
    },10);
  };
})('emile', Protoplus.utils);

/**
 * @extends DOM
 */
Element.addMethods(Protoplus.utils);

/*jslint nomen:false, debug:true, evil:true, vars:false, browser:true, forin:true, undef:false, white:false */

/**
 * UI Elements
 * document.createNewWindow => Creates a new floating window
 * Element.editable => Make the element instant editable
 * Element.tooltip => show a floating tooltip when mouse overed
 * Element.setDraggable => Make the element draggable
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
    getViewPortDimensions: function (){
        // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        var height;
        var width;
        if (typeof window.innerWidth != 'undefined')
        {
            width = window.innerWidth;
            height = window.innerHeight;
        } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth !== 0) {
            width = document.documentElement.clientWidth;
            height = document.documentElement.clientHeight;
        } else { // older IE
            width = document.getElementsByTagName('body')[0].clientWidth;
            height = document.getElementsByTagName('body')[0].clientHeight;
        }
        return {height: height, width: width};
    },
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
     * Over All defaults for all windows
     */
    windowDefaults: { // Default options
        height:false,    // Height of the window
        width:400,    // Width of the window
        title:'&nbsp;',    // Title of the window
        titleBackground:'#F5F5F5',
        buttonsBackground: '#F5F5F5',
        background:'#FFFFFF',
        top:'25%',        // Top location
        left:'25%',       // Left location
        winZindex: 10001,
        borderWidth:10,   // Width of the surrounding transparent border
        borderColor:'#000', // Color of the surrounding transparent border
        titleTextColor: '#777',
        resizable:false,
        borderOpacity:0.3, // Opacity of the surrounding transparent border
        borderRadius: "5px", // Corner radius of the surrounding transparent border
        titleClass:false, // CSS class of the title box
        contentClass:false, // CSS class of the content box
        buttonsClass:false, // CSS class of the buttons box
        closeButton:'X', // Close button content, can be replaced with an image
        openEffect:true, // Enable/Disable the effect on opening
        closeEffect:true, // Enable/Disable the effect on closing
        dim:true,  // Make it modal window, disable background
        modal:true, // Same as dim
        dimColor:'#fff', // color of the dimming surface
        dimOpacity:0.8, // opacity of the dimming surface
        dimZindex: 10000,
        dynamic: true, // Update the window dynamically while dragging
        contentPadding: '8',
        closeTo:false,
        buttons:false, // [ { text:'', name:'', icon:'', className:'', handler:function(){} } ]
        buttonsAlign: 'right',
        hideTitle:false // Hides the title and stuff
    },
    /**
     * Creates a floating window
     * <li>onClose:Prototype.K,    // Event will run when the window is closed</li>
     * <li>height:false,    // Height of the window </li>
     * <li>width:400,    // Width of the window
     * <li>title:'&nbsp;',    // Title of the window
     * <li>titleBackground:'#F5F5F5',
     * <li>buttonsBackground: '#F5F5F5',
     * <li>background:'#FFFFFF',
     * <li>top:'25%',        // Top location
     * <li>left:'25%',       // Left location
     * <li>borderWidth:10,   // Width of the surrounding transparent border
     * <li>borderColor:'#000', // Color of the surrounding transparent border
     * <li>borderOpacity:0.3, // Opacity of the surrounding transparent border
     * <li>borderRadius: "5px", // Corner radius of the surrounding transparent border
     * <li>titleClass:false, // CSS class of the title box
     * <li>contentClass:false, // CSS class of the content box
     * <li>closeButton:'X', // Close button content, can be replaced with an image
     * <li>openEffect:true, // Enable/Disable the effect on opening
     * @param {Object} options
     */
    window: function(options){
       
        options = Object.extend( Object.deepClone(document.windowDefaults), options || {});
        
        options = Object.extend({
            onClose:Prototype.K,    // Event will run when the window is closed
            onInsert:Prototype.K,   // When the window inserted to document but not yet displayed
            onDisplay:Prototype.K  // When the window displayed on the screen
        }, options, {});
        
        options.dim = (options.modal !== true)? false : options.dim;
        options.width = options.width? parseInt(options.width, 10) : '';
        options.height = (options.height)? parseInt(options.height, 10) : false;
        options.borderWidth = parseInt(options.borderWidth, 10);

        var winWidth     =    (options.width? (options.width == 'auto'? 'auto' : options.width + 'px' ): '');
        var titleStyle   =    { background: options.titleBackground, zIndex:1000, position:'relative', padding: '2px', borderBottom: '1px solid #8E8787', height:'35px', MozBorderRadius: '3px 3px 0px 0px', WebkitBorderRadius: '3px 3px 0px 0px', borderRadius:'3px 3px 0px 0px'};
        var dimmerStyle  =    { background:options.dimColor, height:'100%', width:'100%', position:'fixed', top:'0px', left:'0px', opacity:options.dimOpacity, zIndex:options.dimZindex };
        var windowStyle  =    { top:options.top,left: options.left,position: 'absolute', padding: options.borderWidth+'px',height: "auto", width: winWidth, zIndex: options.winZindex };
        var buttonsStyle =    { padding: '0px', display:'inline-block', width:'100%', borderTop: '1px solid #ffffff', background:options.buttonsBackground, zIndex:999, position:'relative', textAlign:options.buttonsAlign, MozBorderRadius:'0 0 3px 3px', WebkitBorderRadius: '0px 0px 3px 3px', borderRadius:'0px 0px 3px 3px' };
        var contentStyle =    { zIndex: 1000, height: options.height !== false? options.height+'px' : "auto", position: 'relative', display: 'inline-block', width: '100%'};
        var wrapperStyle =    { zIndex:600, MozBorderRadius:'3px', WebkitBorderRadius:'3px', borderRadius:'3px' };
        var titleTextStyle  = { fontWeight:'bold', color:options.titleTextColor, textShadow:'0 1px 1px rgba(0, 0, 0, 0.5)', paddingLeft:'10px', fontSize:'13px' };
        var backgroundStyle = { height: '100%',width: '100%',background: options.borderColor,position: 'absolute',top: '0px',left: '0px',zIndex: -1,opacity: options.borderOpacity };
        var titleCloseStyle = { fontFamily:'Arial, Helvetica, sans-serif', color:'#aaa', cursor:'default' };
        var contentWrapperStyle = {padding: options.contentPadding + 'px', background: options.background };
        var dimmer;
        if (options.dim/* && !document.dimmed*/) {// Dimm the window background
            dimmer = new Element('div', {className:'protoplus-dim'});
            dimmer.onmousedown = function(){return false;}; // Disable browser's default drag and paste functionality
            dimmer.setStyle(dimmerStyle);
            //$(document.body).setStyle({overflow:'hidden'});
        }

        // Create window structure
        var win, tbody, tr, wrapper, background, title, title_table, title_text, title_close, content, buttons, contentWrapper, block = {};
        win = new Element('div');
        win.insert(background = new Element('div'));
        win.insert(wrapper = new Element('div'));
        wrapper.insert(title = new Element('div'));
        title.insert(title_table = new Element('table', { width:'100%', height:'100%' }).insert(tbody = new Element('tbody').insert(tr = new Element('tr'))));
        tr.insert(title_text = new Element('td'));
        tr.insert(title_close = new Element('td', {width:20, align:'center'}));
        wrapper.insert(contentWrapper = new Element('div', {className:'window-content-wrapper'}).insert(content = new Element('div')).setStyle(contentWrapperStyle));
        
        
        win.setTitle = function(title){
            title_text.update(title);
            return win;
        };
        
        /**
         * Puts an overlaying div on top of window
         */
        win.blockWindow = function(){
            wrapper.insert(block = new Element('div').setStyle('position:absolute; top:0px; left:0px; height:100%; width:100%; opacity:0.5; background:#000; z-index:10000'));
            block.onclick = block.onmousedown = block.onmousemove = function(){return false;};
            return block;
        };
        
        /**
         * Removes the blocking div from window
         */
        win.unblockWindow = function(){
            block.remove();
            return win;
        };
        
        if(options.hideTitle){
            title.hide();
            title_close = new Element('div').setStyle('text-align:center;');
            wrapper.insert(title_close.setStyle('position:absolute;z-index:1111000; right:5px; top:5px;'));
            contentWrapper.setStyle({MozBorderRadius:titleStyle.MozBorderRadius, WebkitBorderRadius: titleStyle.WebkitBorderRadius, borderRadius:titleStyle.borderRadius});
        }
        
        win.buttons = {};
        var buttonsDiv;
        if(options.buttons && options.buttons.length > 0){
            wrapper.insert(buttons = new Element('div', {className: 'window-buttons-wrapper'}));
            
            if(!options.buttonsClass){
                buttons.setStyle(buttonsStyle);
            }else{
                buttons.addClassName(options.buttonsClass);
            }
            buttons.insert(buttonsDiv = new Element('div').setStyle('padding:12px;height:23px;'));
            $A(options.buttons).each(function(button, i){
                var color = button.color || 'grey';
                
                var but = new Element('button', {
                    className: 'big-button buttons buttons-' + color,
                    type: 'button',
                    name: button.name || "button-" + i,
                    id: button.id || "button-" + i
                }).observe('click', function(){
                    button.handler(win, but);
                });
                
                if(button.className){
                    but.addClassName(button.className);
                }
                
                /*if(button.link){
                    // Disable link feature for now
                    but = new Element('a', {href:'javascript:void(0)'}).observe('click', function(){
                        button.handler(win, but);
                    }).setStyle('margin:7px;font-size:11px;');
                    
                }*/
                
                var butTitle = new Element('span').insert(button.title);
                if(button.icon){
                    button.iconAlign = button.iconAlign || 'left';
                    var butIcon = new Element('img', {
                        src: button.icon,
                        align: button.iconAlign == 'right' ? 'absmiddle' : 'left'
                    }).addClassName("icon-"+button.iconAlign);
                    
                    if(button.iconAlign == 'left'){
                        but.insert(butIcon);
                    }
                    
                    but.insert(butTitle);
                    
                    if(button.iconAlign == 'right'){
                        but.insert(butIcon);
                    }
                    
                }else{
                    but.insert(butTitle);
                }
                
                if(button.align == 'left'){
                    but.setStyle('float:left');
                }
                
                but.changeTitle = function(title){
                    butTitle.update(title);
                    return but;
                };
                
                but.updateImage = function (options){
                    butIcon.src = options.icon;
                    options.iconAlign = options.iconAlign || button.iconAlign;
                    if(options.iconAlign == 'right'){
                        butIcon.removeClassName('icon-left');
                        butIcon.addClassName('icon-right');
                    }else{
                        butIcon.removeClassName('icon-right');
                        butIcon.addClassName('icon-left');
                    }
                };
                
                win.buttons[button.name] = but;
                
                if(button.hidden === true){ but.hide(); }
                if(button.disabled === true){ but.disable(); }
                
                if(button.style){
                    but.setStyle(button.style);
                }
                
                //buttons.insert('&nbsp;');
                buttonsDiv.insert(but);
                //buttons.insert('&nbsp;');
            });
        }else{
            contentWrapper.setStyle({MozBorderRadius:buttonsStyle.MozBorderRadius, WebkitBorderRadius: buttonsStyle.WebkitBorderRadius, borderRadius:buttonsStyle.borderRadius});
        }
        
        // set styles
        win.setStyle(windowStyle);
        
        background.setStyle(backgroundStyle).setCSSBorderRadius(options.borderRadius);

        if(!options.titleClass){
            title.setStyle(titleStyle);
        }else{
            title.addClassName(options.titleClass);
        }

        if(!options.contentClass){
            content.setStyle(contentStyle).addClassName('window-content');
        }else{
            content.addClassName(options.contentClass);
        }

        wrapper.setStyle(wrapperStyle);
        title_text.setStyle(titleTextStyle);
        title_close.setStyle(titleCloseStyle);

        var closebox = function(key){ // Close function
            document._onedit = false; // re activate keymap
            
            if(options.onClose(win, key) !== false){
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
                Event.stopObserving(window, 'resize', win.reCenter);
                document.openWindows = $A(document.openWindows).collect(function(w){ if(w !== win){ return w; } }).compact();
                // document.stopObserving('keyup', escClose);
            }
        };
        // var escClose = function(e){e = document.getEvent(e); if(e.keyCode == 27){ closebox('ESC'); } };
        // Insert box onto screen
        if (options.dim /*&& !document.dimmed*/) {
            $(document.body).insert(dimmer);
            document.dimmed = true;
        }
        
        // Set the content
        title_text.insert(options.title);
        title_close.insert(options.closeButton);
        title_close.onclick = function(){ closebox("CROSS"); };
        content.insert(options.content);
        
        $(document.body).insert(win);
        if(options.openEffect === true){
            win.setStyle({opacity:0});
            win.shift({opacity:1, duration:0.5});
        }

        /*
         * Seyhun:  removed this before calculations of window position because first calculating then scrolling
         *          makes window disapear.
         */
        try{
            document._onedit = true; // Stop editables and keyboard events on windows
            options.onInsert(win);
        }catch(e){
            console.error(e);
        }

        // Center the box on screen
        var vp = document.viewport.getDimensions();
        var vso = $(document.body).cumulativeScrollOffset();
        var bvp = win.getDimensions();
        var top = ((vp.height - bvp.height) / 2) + vso.top;
        var left = ((vp.width - bvp.width) / 2) + vso.left;

        win.setStyle({top:top+"px", left:left+"px"});
        if(dimmer){
            dimmer.setStyle({height:vp.height+'px', width:vp.width+'px'/*, top:vso.top+'px', left:vso.left+'px'*/  });
        }
        
        win.reCenter = function(){
            var vp = document.viewport.getDimensions();
            var vso = $(document.body).cumulativeScrollOffset();
            var bvp = win.getDimensions();
            var top = ((vp.height - bvp.height) / 2) + vso.top;
            var left = ((vp.width - bvp.width) / 2) + vso.left;
            
            win.setStyle({top:top+"px", left:left+"px"});
            if (dimmer){
                dimmer.setStyle({height:vp.height+'px', width:vp.width+'px'/*, top:vso.top+'px', left:vso.left+'px'  */});
            }
        };
        
        
        options.onDisplay(win);
        
        Event.observe(window, 'resize', win.reCenter);
        
        if(options.resizable){
            wrapper.resizable({
                constrainViewport:true,
                element:content,
                sensitivity:20,
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
        // document.observe('keyup', escClose); // Close the window when ESC is pressed
        // Make it draggable
        win.setDraggable({handler:title_text, constrainViewport:true, dynamic:options.dynamic, dragEffect:false});
        win.close = closebox;
        document.openWindows.push(win);
        return win;
    }
});

/**
 * For closing windows
 */
document.observe('keyup', function(e){
    e = document.getEvent(e);
    if(Event.isInput(e)){ return; } // Don't run this on inputs
    if(document.openWindows.length > 0){
        if (e.keyCode == 27) {
            document.openWindows.pop().close('ESC');
        }
    }
});

document.openWindows = [];
document.createNewWindow = document.window;

Protoplus.ui = {
    
    /**
     * Recursively check if the given element is visible or not
     */
    isVisible: function(element){
        element = $(element);
        if (!element.parentNode) {
            return false;
        }
        
        if (element && element.tagName == "BODY") {
            return true;
        }
        
        if (element.style.display == "none" || element.style.visibility == "hidden") {
            return false;
        }
        
        return Protoplus.ui.isVisible(element.parentNode);
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
        elem = $(elem);
        options = Object.extend({
            defaultText: " ",
            onStart:Prototype.K,
            onEnd:Prototype.K,
            processAfter: Prototype.K,
            processBefore: Prototype.K,
            onBeforeStart: Prototype.K,
            escapeHTML: false,
            doubleClick: false,
            onKeyUp: Prototype.K,
            className: false,
            options: [{text:"Please Select", value:"0"}],
            style:{background:"none", border:"none",color:"#333", fontStyle:"italic", width:"99%"},
            type: "text"
        }, options || {});

        elem.onStart = options.onStart;
        elem.onEnd = options.onEnd;
        elem.defaultText = options.defaultText;
        elem.processAfter = options.processAfter;
        elem.cleanWhitespace();
        try{
            elem.innerHTML = elem.innerHTML || elem.defaultText;
        }catch(e){}
        
        // End of initialize
        var clickareas = [elem];
        if(options.labelEl){
            clickareas.push($(options.labelEl));
        }
        
        $A(clickareas).invoke('observe', options.doubleClick? "dblclick" : "click", function(e){
            
            if(options.onBeforeStart(elem) === false){ return; }
            
            if(elem.onedit){ return; }
            elem.onedit = true;
            //if(document._onedit){ return true; }
            if(document.stopEditables){ return true; }
            document._onedit = true;
            document.stopTooltips();
            
            
            var currentValue = elem.innerHTML.replace(/^\s+|\s+$/gim, "");
            var type = options.type;
            var op = $A(options.options);
            
            var blur = function(e){
                
                if(elem.keyEventFired){
                    elem.keyEventFired = false;
                    return;
                }
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
                if(input.colorPickerEnabled){
                    return;
                }
                e = document.getEvent(e);
                if(e.keyCode == 13 || e.keyCode == 3) { 
                    elem.keyEventFired = true;
                    elem.stopObserving("keypress", keypress);
                    input.stopObserving("blur", blur);
                    finish(e, currentValue); 
                }
            };

            currentValue = currentValue.unescapeHTML();
            currentValue = (currentValue == options.defaultText)? "" : currentValue;
            //currentValue = options.escapeHTML? currentValue.escapeHTML() : currentValue;
            currentValue = options.processBefore(currentValue, elem);
            

            if(type.toLowerCase() == "textarea"){
                input = new Element("textarea");
                input.value = currentValue;
                input.observe("blur", blur);
                input.observe('keyup', options.onKeyUp);
                input.select();
            }else if(["select", "dropdown", "combo", "combobox"].include(type.toLowerCase())){
                input = new Element("select").observe("change", function(e){ elem.keyEventFired = true; finish(e, currentValue); });
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
                input.observe('keyup', options.onKeyUp);
                input.select();
            }

            if(options.className !== false){
                input.addClassName(options.className);
            }else{
                input.setStyle(options.style);
            }
            
            elem.update(input);
            elem.finishEdit = function(){ blur({target:input}); };
            document._stopEdit = function(){ elem.keyEventFired = true; finish({target: input}, currentValue); };
            elem.onStart(elem, currentValue, input);
            setTimeout(function(){
                input.select();
            }, 100);
            elem.observe("keypress", keypress);
        });

        var finish = function(e, oldValue){
            document._stopEdit = false;
            var elem = $(e.target);
            var val = "";
            if (!elem.parentNode) { return true; }
            var outer = $(elem.parentNode);
            outer.onedit = false;
            if ("select" == elem.nodeName.toLowerCase()) {
                val = elem.options[elem.selectedIndex].text;
            } else if(["checkbox", "radio"].include(elem.type && elem.type.toLowerCase())) {
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
            
            if (val === "" && outer.defaultText) {
                outer.update(outer.defaultText);
            } else {
                outer.update(outer.processAfter(val, outer, elem.getSelected() || val, oldValue));
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
        elem = $(elem);
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
        elem = $(elem);
        elem.descendants().each(function(e){
            if(e.className == "pp_shadow"){
                e.remove();
            }
        });
        return elem;
    },
    /**
     * Gets the elements context or closest parents context menu
     * @param {Object} element
     */
    getParentContext: function(element){
        element = $(element);
        try{
            if(!element.parentNode){
                return false;
            }
            
            if(element._contextMenuEnabled){
                return element;
            }
            
            if(element.tagName == 'BODY'){
                return false;
            }
            
            return $(element.parentNode).getParentContext();
            
        }catch(e){
            alert(e);
        }
    },
    /**
     * Check if the element has a context menu or not
     * @param {Object} element
     */
    hasContextMenu: function(element){
        return !!element._contextMenuEnabled;
    },
    /**
     * Set a context menu for an element
     * @param {Object} element
     * @param {Object} options
     */
    setContextMenu: function(element, options){
        
        element = $(element);
        options = Object.extend({
            others:[]
        }, options || {});
        
        element._contextMenuEnabled = true;
        element.items={};
        
        $A(options.menuItems).each(function(item, i){
            if(item == '-'){
                element.items["seperator_"+i] = item;
            }else{
                if(!item.name){
                    element.items["item_"+i] = item;
                }else{
                    element.items[item.name] = item;
                }
            }
        });
        
        element.changeButtonText = function(button, text){
            element.items[button].title = text;
            return $(element.items[button].elem).select('.context-menu-item-text')[0].update(text);
        };
        element.getButton       = function(button){ return element.items[button].elem; };
        element.showButton      = function(button){ element.items[button].hidden = false; };
        element.hideButton      = function(button){ element.items[button].hidden = true; };
        element.enableButton    = function(button){ element.items[button].disabled = false; };
        element.disableButton   = function(button){ element.items[button].disabled = true; };        
        element.options         = options;
        
        options.others.push(element);
        
        var createListItem = function(context, item){
            var liItem = new Element('li').observe('contextmenu', Event.stop);
                
            if (Object.isString(item) && item == "-") {
                liItem.insert("<hr>");
                liItem.addClassName('context-menu-separator');
                context.insert(liItem);
            }else{
                if(item.icon){
                    var img = new Element('img', {src:item.icon, className:(item.iconClassName || ''), align:'left'}).setStyle('margin:0 4px 0 0;');
                    liItem.insert(img);
                }else{
                    liItem.setStyle('padding-left:24px');
                }
                item.handler = item.handler || Prototype.K;
                if(!item.disabled){
                    liItem.addClassName('context-menu-item');
                    liItem.observe('click', function(e){
                        Event.stop(e);
                        item.handler.bind(element)();
                        $$('.context-menu-all').invoke('remove'); // When clicked destroy all windows
                    });
                }else{
                    liItem.addClassName('context-menu-item-disabled');
                }
                if(item.items){
                    liItem.insert('<img align="right" src="images/right-handle.png" style="margin-top:2px;" />');
                    createInnerList(liItem, item);
                }
                
                if(item.hidden){
                    liItem.hide();
                }
                 
                liItem.insert(new Element('span', { className:'context-menu-item-text' }).update(item.title.shorten(26)));
                context.insert(liItem);
            }
            return liItem;
        };
        
        var getContPosition = function(container){
            var w = document.viewport.getWidth();
            var l = container.getLayout();
            var p = container.up('.context-menu-all');
            var isNotFit = (l.get('width')+l.get('cumulative-left')) > (w - 200);
            
            if (!isNotFit && p && p.__pos) {
                pos = p.__pos;
            }else if(isNotFit){
                pos = "left";
            }else{
                pos = "right";
            }
            container.__pos = pos; 
            return pos;
        };
        
        var createInnerList = function(cont, itemConf){
            
            var container = new Element('div', { className: 'context-menu-all' }).setStyle('z-index:1000000');
            var backPanel = new Element('div', { className: 'context-menu-back' }).setOpacity(0.98); 
            var context   = new Element('div', { className: 'context-menu' });
            container.insert(backPanel).insert(context);
            
            var title = new Element('div', {className:'context-menu-title'}).observe('contextmenu', Event.stop);
            title.insert(itemConf.title.shorten(26));
            context.insert(title);
            var it = itemConf.items;
            if(Object.isFunction(itemConf.items)){
                it = itemConf.items();
            }
            
            $A(it).each(function(item){
                var liItem = createListItem(context, item);
                //element.items[pair.key].elem = liItem;
            });
            cont.insert(container.hide());
            container.setStyle({ position: 'absolute', top: '0px' });
            var t;
            var listopen = false;
            cont.mouseEnter(function(){
                if(itemConf.disabled){return;}
                if(listopen){return;}
                clearTimeout(t);
                //t = setTimeout(function(){
                    // Decide here if the menu will pop on the right or left
                    container.show();
                    listopen = true;
                    var pos = getContPosition(container);
                    container.style[pos] = '-'+(container.getWidth()-5)+'px';
                //}, 200);
            }, function(){
                clearTimeout(t);
                //t = setTimeout(function(){
                    container.style.left = container.style.right = "";
                    container.hide();
                    listopen = false;
                //}, 200);
            });
        };
        
        
        var openMenu = function(e, local){
            // Stop the default Event
            Event.stop(e);
            if(local || (Prototype.Browser.Opera && e.ctrlKey) || Event.isRightClick(e) || Prototype.Browser.IE){
                $$('.context-menu-all').invoke('remove');
                var element = e.target;
                element = element.getParentContext();
                if (element !== false) {
                    if(element.options.onStart){ element.options.onStart(); }
                    var menuItems = element.menuItems;
                    
                    var container = new Element('div', { className: 'context-menu-all' }).setStyle('z-index:1000000');
                    var backPanel = new Element('div', { className: 'context-menu-back' }).setOpacity(0.98); 
                    var context   = new Element('div', { className: 'context-menu' });
                    
                    container.insert(backPanel).insert(context);
                    
                    if(element.options.title){
                        var title = new Element('div', {className:'context-menu-title'}).observe('contextmenu', Event.stop);
                        title.insert(element.options.title);
                        context.insert(title);
                    }
                    
                    $H(element.items).each(function(pair){
                        var item = pair.value;
                        var liItem = createListItem(context, item);
                        element.items[pair.key].elem = liItem;
                    });
                    
                    $(document.body).insert(container.hide());
                    var x = Event.pointer(e).x;
                    var y = Event.pointer(e).y;
                    
                    var dim  = document.viewport.getDimensions();
                    var cDim = context.getDimensions();
                    var sOff = document.viewport.getScrollOffsets();
                    
                    var top  = (y - sOff.top + cDim.height) > dim.height && (y - sOff.top) > cDim.height ? (y - cDim.height) - 20 : y;
                    var left = (x + cDim.width) > dim.width ? (dim.width - cDim.width) - 20 : x;
                    
                    container.setStyle({
                        position: 'absolute',
                        top: top  + 'px',
                        left: left  + 'px'
                    });
                    
                    if(element.options.onOpen){ element.options.onOpen(context); }
                    
                    container.show();
                }
                
            } 
        };
        
        element.openMenu = openMenu;
        
        $A(options.others).invoke('observe', Prototype.Browser.Opera? 'click' : 'contextmenu', function(e){
            e.stop();
            var ev={};
            if(Prototype.Browser.IE){
                // To fix IE's Member Not Found error
                // When you pass event object as a parameter in setTimeout IE removes it from the memory
                // In order to prevent this error we should create a clone and use it instead
                for(var k in e){ ev[k] = e[k]; }
            }else{
                ev = e;
            }
            
            setTimeout(function(){ openMenu(ev);}, 0);
        });
        
        if(!document.contextMenuHandlerSet){
            document.contextMenuHandlerSet = true;
            
            $(document).observe('click', function(e){
                $$('.context-menu-all').invoke('remove');
            });
        }
        
        return element;
    },
    
    /**
     * Creates a text shadow for element
     * @param {Object} element
     * @param {Object} options
     */
    textshadow: function(element, options){
        element  = $(element);
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
            shadowdiv.setUnselectable();
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
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: "0px", left: "-"+d+"px" })).update(text).setShadowColor(color).setUnselectable());
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: "0px", left: d+"px"})).update(text).setShadowColor(color).setUnselectable());
                    break;
                case "glow":
                    shadowdiv.setStyle({top: "0px", left: "0px" });
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).setUnselectable()); // up
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: "-"+d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).setUnselectable()); // down
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: d+"px", left: "-"+d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).setUnselectable()); // upright
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: d+"px", left: d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).setUnselectable()); // upleft
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: "-"+d+"px", left: "-"+d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).setUnselectable()); // downright
                    container.appendChild(new Element("div").setStyle(Object.extend(style,{top: "-"+d+"px", left: d+"px", opacity: options.glowOpacity})).update(text).setShadowColor(color).setUnselectable()); // downleft
                    break;
                default: // upleft
                    shadowdiv.setStyle({top: d+"px", left: d+"px"});
            }
            shadowdiv.setShadowColor(color).setUnselectable();
            container.appendChild(shadowdiv);
        }
        textdiv.setStyle({position: "relative", zIndex: "120"});
        elem.appendChild(container);
        if (options.imageLike) {
           elem.setUnselectable().setStyle({cursor: "default"});
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
        element = $(element);
        // If prototip is included use it instead
        if('Prototip' in window){
            
            options = Object.extend({
                delay: 0.01
            }, options || {});
            
            var T = new Tip(element, text, options);
            return element;
        }
        
        
        // removed for whatever..
        // return element;
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
            /*
            var removeButton = new Element('div');
            removeButton.innerHTML = 'X';
            removeButton.setStyle({ cursor:'pointer', border:'1px solid #666', background:'#cecece', textAlign:'center', top:'1px', width:'15px', position:'absolute', right:'1px', zIndex:1000 });
            removeButton.setCSSBorderRadius('4px');
            tooldiv.appendChild(removeButton);
            removeButton.observe('click', function(){
                outer.parentNode.removeChild(outer);
            });
            */
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
            if(outer){
                clearTimeout(outer.delay);
                clearTimeout(outer.duration);
            }
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
     * Simulates the scroll bars
     * @param {Object} element
     * @param {Object} options
     */
    softScroll: function(element, options){
        
        options = Object.extend({
            scrollSpeed:50
        }, options || {});
        
        
        var scroll = new Element('div', { className: 'scroll-bar' });
        var scrollStyle = new Element('div', {className:'scroll-style'});
        var table = new Element('table', {cellpadding:0, cellspacing:0, height:'100%'}).insert(new Element('tbody').insert(new Element('tr').insert(new Element('td', {valign:'top'}).setStyle('height:100%;padding:5px;').insert(scrollStyle))));
        scroll.insert(table);
        element.setStyle('overflow:hidden;');
        scroll.setStyle('position:absolute; top:0px; right:1px; width:16px; opacity:0; height:50%;');
        var container = element.wrap('div');
        
        element.updateScrollSize = function(){
            
            var ch;
            try{
                ch = container.measure('margin-box-height');                
            }catch(e){
                ch = container.getHeight()+
                     (parseInt(container.getStyle('padding-top'), 10)||0)+
                     (parseInt(container.getStyle('padding-bottom'), 10)||0)+
                     (parseInt(container.getStyle('margin-top'), 10)||0)+
                     (parseInt(container.getStyle('margin-bottom'), 10)||0);
            }
            var sh = element.scrollHeight;
            if (sh <= 0 ){ return; }
            var per = ch * 100 / sh;
            // If scroll
            if(per > 100){
                scroll.hide();
            }else{
                scroll.show();
            }
            
            scroll.style.height = per+"%";
        };
        element.updateScrollSize();
        
        scroll.setDraggable({
            constraint: 'vertical',
            dragClass:'scroll-onpress',
            onDrag: function(el){
                var top = parseInt(el.style.top, 10);
                if (top < 0) {
                    el.style.top = "0px";
                    return false;
                }
                var h = container.getHeight();
                var sh = scroll.getHeight();
                if ((top + sh) > h) {
                    el.style.top = (h - (sh)) + "px";
                    return false;
                }
                scrollArea(top);
            }
        });
        
        function scrollArea(pos){
            var ch = container.getHeight();
            var sh = element.scrollHeight;
            var per = ch * 100 / sh;
            
            var posPer = pos * 100 / ch;
            var position = sh * posPer / 100;
            
            element.scrollTop = Math.round(position);
        }
        
        function updateScrollBar(pos){
            var sh = element.scrollHeight;
            var ch = container.getHeight();
            var per = pos * 100 / sh;
            var position = ch * per / 100;
            
            scroll.style.top = Math.round(position) + "px";
        }
        
        container.hover(function(){
            element.updateScrollSize(); // Re calculate scroll size on each focus
            scroll.shift({opacity: 1,duration: 0.5});
        }, function(){
            if (scroll.__dragging === true) { return; }
            scroll.shift({opacity: 0,duration: 0.5});
        });
        container.setStyle('position:relative; display:inline-block;');
        container.insert(scroll);
        
        var stime;
        element.observe(Event.mousewheel, function(e){
            e.stop();
            var w = Event.wheel(e);
            // clearTimeout(stime);
            // element.stopAnimation();
            if (w > 0) {
                element.scrollTop = element.scrollTop - options.scrollSpeed; // If scroll up then move to the right
                
                /*
                stime = setTimeout(function(){
                    element.shift({scrollTop:element.scrollTop - 100, easing:'quadOut',onStep:function(){
                        updateScrollBar(element.scrollTop);
                    }, duration:0.5})
                }, 50);
                // */
            } else if (w < 0) {
                element.scrollTop = element.scrollTop + options.scrollSpeed;
                
                /*
                stime = setTimeout(function(){
                    element.shift({scrollTop:element.scrollTop + 100, easing:'quadOut', onStep:function(){
                        updateScrollBar(element.scrollTop);
                    }, duration:0.5})
                }, 50);
                // */
            }
            
            updateScrollBar(element.scrollTop);
        });
    },
    /**
     * Makes element draggable
     * @param {Object} element
     * @param {Object} options
     */
    setDraggable:function(element, options){
        options = Object.extend({
            dragClass: "",  
            handler: false,
            dragFromOriginal: false, // Disabled drag event on child elements
            onStart: Prototype.K,
            changeClone: Prototype.K, 
            onDrag:  Prototype.K,
            onDragEnd:  Prototype.K,
            onEnd:   Prototype.K, 
            dragEffect: false,
            revert: false,
            clone:  false,
            snap:   false,
            cursor: "move",
            offset: false,
            // Constraints are somewhat buggy in internet explorer
            constraint: false,
            constrainLeft:false,
            constrainRight:false,
            constrainTop:false,
            constrainBottom:false,
            constrainOffset:false, // [top, right, bottom, left]
            constrainViewport:false,
            constrainParent: false,
            dynamic:true
        }, options || {});

        if(options.snap && (typeof options.snap == "number" || typeof options.snap == "string")){
            options.snap = [options.snap, options.snap];
        }
        var mouseUp   = "mouseup", 
            mouseDown = "mousedown", 
            mouseMove = "mousemove";
            
        /*
        if(Prototype.Browser.MobileSafari){
            // It's nice and all but There is a problem with finishing the event
            // Until it's fixed we cannot use this
            mouseUp   = "touchend";
            mouseDown = "touchstart"; 
            mouseMove = "touchmove";
        }
        */
        
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
            Event.stop(e);
            if(mouseMove == "touchmove"){
                e = e.touches[0];
            }
            
            if(options.onDrag(drag_element, handler, e) === false){
                return;
            }
            
            var top   = startY+(Number(Event.pointerY(e)-mouseY));
            var left  = startX+(Number(Event.pointerX(e)-mouseX));
            
            if(options.offset){
                top   = options.offset[1]+ Event.pointerY(e);
                left  = options.offset[0]+ Event.pointerX(e);
            }

            if(options.snap){
                top = (top/options.snap[1]).round()*options.snap[1];
                left = (left/options.snap[0]).round()*options.snap[0];
            }
            top  = (options.constrainBottom !== false && top >= options.constrainBottom)? options.constrainBottom : top; // Check for max top
            top  = (options.constrainTop !== false && top <= options.constrainTop)? options.constrainTop : top; // Check for min top
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
            Event.stop(ev);
            if(mouseUp == "touchend"){
                ev = e.touches[0];
            }
            if(options.dynamic !== true){
                document.temp.setStyle({top:element.getStyle('top'), left:element.getStyle('left')});
                element.parentNode.replaceChild(document.temp, element);
                document.temp.oldZIndex = element.oldZIndex;
                element = document.temp;
            }
            
            if(options.onEnd(drag_element, handler, ev) !== false){
                if(element.oldZIndex){
                    drag_element.setStyle({zIndex: element.oldZIndex});
                }else{
                    drag_element.setStyle({zIndex: ''});
                }
                                
                if(options.revert){
                    if(options.revert === true){
                        options.revert = {
                            easing: "sineIn",
                            duration: 0.5
                        };
                    }
                    options.revert = Object.extend({
                        left:drag_element.startX,
                        top:drag_element.startY,
                        opacity:1,
                        duration:0.5,
                        easing:'sineIn'
                    }, options.revert || {});
                    drag_element.shift(options.revert);
                    drag_element.startX = false;
                    drag_element.startY = false;
                }else{
                    if(options.dragEffect){
                        drag_element.shift({opacity: 1, duration:0.2});
                    }
                }
            }
            element.__dragging = false; 
            drag_element.removeClassName(options.dragClass);
            handler.setSelectable();
            drag_element.setSelectable();
            $(document.body).setSelectable();
            document.stopObserving(mouseMove, drag);
            document.stopObserving(mouseUp, mouseup);
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
        handler.observe(mouseDown, function(e){
            Event.stop(e);
            var evt = e;
            if(mouseDown == "touchstart"){
                e = e.touches[0];
            }
            element.__dragging = true;
            if(document.stopDrag){ return true; }
            if(options.dragFromOriginal && e.target != handler) { return false; }
            
            var vdim = false, voff = false;
            
            if(options.constrainElement) { 
                voff = (Prototype.Browser.IE)? {top:0, left:0} : $(options.constrainElement).cumulativeOffset();
                vdim = $(options.constrainElement).getDimensions(); 
            }
            
            if(options.constrainParent)  {
                if($(element.parentNode).getStyle('position') == "relative" || $(element.parentNode).getStyle('position') == "absolute"){
                    voff = {top:0, left:0};
                }else{
                    voff = (Prototype.Browser.IE)? {top:0, left:0} : $(element.parentNode).cumulativeOffset();
                }
                
                vdim = $(element.parentNode).getDimensions(); 
            }
            
            if(options.constrainViewport){ 
                voff = $(document.body).cumulativeScrollOffset(); //{top:0, left:0};
                vdim = document.viewport.getDimensions(); 
            }
            
            if(vdim){
                vdim.height+=voff.top;
                vdim.width+=voff.left;
                options.constrainTop = voff.top+1;
                options.constrainBottom = vdim.height-(element.getHeight()+3);
                options.constrainRight = vdim.width-(element.getWidth()+3);
                options.constrainLeft = voff.left+1;
            }
            var temp_div;
            if(options.dynamic !== true){
                try{
                document.temp = element;
                temp_div = new Element('div').setStyle({
                        height: element.getHeight()+"px", width:element.getWidth()+"px", border:'1px dashed black',
                        top: element.getStyle('top') || 0, 
                        left: element.getStyle('left') || 0, 
                        zIndex: element.getStyle('zIndex')||0, 
                        position:element.getStyle('position'), background:'#f5f5f5', opacity:0.3 });
                }catch(err){}
                element.parentNode.replaceChild(temp_div, element);
                element = temp_div;
            }
            if(["relative", "absolute"].include($(element.parentNode).getStyle('position'))){
                startX = element.getStyle("left")? parseInt(element.getStyle("left"), 10) : element.offsetLeft;
                startY = element.getStyle("top")? parseInt(element.getStyle("top"), 10) : element.offsetTop;
            }else{
                var eloff = element.cumulativeOffset();
                startX = eloff.left;
                startY = eloff.top;
            }
            mouseX = Number(Event.pointerX(e));
            mouseY = Number(Event.pointerY(e));
            if (options.clone) {
                drag_element = options.changeClone(element.cloneNode({deep: true}), startX, startY);
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

            drag_element.setStyle({position: "absolute", zIndex:99998});
            if(options.revert && !drag_element.startX && !drag_element.startY){
                drag_element.startX = startX;
                drag_element.startY = startY;
            }
            drag_element.setUnselectable();
            handler.setUnselectable();
            $(document.body).setUnselectable();
            document.observe(mouseMove, drag);
            document.observe(mouseUp, mouseup);
            
        });
        return element;
    },
    /**
     * Creates Star rating element. Requires stars.png
     * @param {Object} element
     * @param {Object} options
     */
    rating: function(element, options){
        
        element = $(element);
        
        options = Object.extend({
            imagePath: "stars.png",
            onRate: Prototype.K,
            resetButtonImage:false,
            resetButtonTitle: 'Cancel Your Rating',
            resetButton:true,
            inputClassName:'',
            titles: [], // Give an array of titles for corresponding stars
            disable:false, // Disable element just after user gives a rating.
            disabled: element.getAttribute("disabled")? element.getAttribute("disabled") : false,
            stars: element.getAttribute("stars")? element.getAttribute("stars") : 5,
            name: element.getAttribute("name")? element.getAttribute("name") : "rating",
            value: element.getAttribute("value")? element.getAttribute("value") : 0,
            cleanFirst: false
        }, options || {});
        
        // Don't allow element to be starred again
        if(element.converted){ return element; }

        element.converted = true;

        var image = { blank: "0px 0px", over: "-16px 0px", clicked: "-32px 0px", half: "-48px 0px" };
        var hidden = new Element("input", {type:"hidden", name:options.name, className:options.inputClassName});
        var stardivs = $A([]);
        
        // Make Element Disabled
        element.disabled = (options.disabled=="true" || options.disabled === true)? true : false;
        element.setStyle({
            display:'inline-block',
            width: ((parseInt(options.stars, 10) + ( /* add place for reset button */ options.resetButton ? 1 : 0)) * 20) + "px",
            cursor: options.disabled ? "default" : "pointer" /*, clear:"left"*/
        });
        element.setUnselectable();
        if(options.cleanFirst){
            element.update();
        }
        var setStar = function(i){
            var elval = i;
            i = i || 0;            
            var desc = $A(element.descendants());
            desc.each(function(e){ e.setStyle({ backgroundPosition:image.blank}).removeClassName("rated"); });
            desc.each(function(e, c){ if(c < i){ e.setStyle({backgroundPosition:image.clicked}).addClassName("rated"); } });
            hidden.value = i || "";
            if(options.disable){
                element.disabled = true;
                element.setStyle({cursor:"default"});
            }
            element.value = elval;
            options.onRate(element, options.name, i);
            element.run('keyup');
            hidden.run('change');
            if(options.resetButton){
                cross[ (i === 0)? "hide" : "show" ](); // Show or hide the resetButton
            }
        };
        /**
         * External method for setting the rating manually
         */
        element.setRating = setStar;
        
        $A($R(1, options.stars)).each(function(i){
            var star = new Element("div").setStyle({height:"16px", width:"16px", margin:"0.5px", cssFloat:"left", backgroundImage:"url("+options.imagePath+")"});
            star.observe("mouseover", function(){
                if(!element.disabled){
                    var desc = $A(element.descendants());
                    desc.each(function(e, c){ if(c < i){ e.setStyle({ backgroundPosition: e.hasClassName("rated")? image.clicked : image.over }); } });
                }
            }).observe("click", function(){
                if (!element.disabled) {
                    setStar(i);
                }
            });
            if(options.titles && options.titles[i-1]){
                star.title = options.titles[i-1]; 
            }
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
        
        if(options.resetButton){
            var cross = new Element("div").setStyle({height:"16px", width:"16px", margin:"0.5px", cssFloat:"left", color:'#999', fontSize:'12px', textAlign:'center'});
            if(options.resetButtonImage){
                cross.insert(new Element('img', {src:options.resetButtonImage, align:'absmiddle'}));
            }else{
                cross.insert(' x ');
            }
            cross.title = options.resetButtonTitle;
            cross.hide();
            cross.observe('click', function(){
                setStar(undefined);
            });
            stardivs.push(cross);
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
        
        element = $(element);
        
        // Was already converted
        if(element.up('.searchbox')){
            return element;
        }
        
        options = Object.extend({
            defaultText:"Search",
            onWrite:Prototype.K,
            onClear:Prototype.K,
            imagePath:"images/apple_search.png"
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
            if(element.value === ""){
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

        if(element.type !== 'text'){
            element.addClassName("searchbox");
            element.observe('search', function(){
                element.run('keyup');
            });
            return element;
        }

        element.setStyle({
            border:"none",
            background:"none",
            height:"14px",
            outline:'none',
            width: (parseInt(element.getStyle("width"), 10)-32)+"px"
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
            element.run('keyup');
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
        element = $(element);
        options = Object.extend({
            width:100,
            onUpdate:Prototype.K,
            maxValue:100,
            value:0,
            buttonBack:'url("../images/ball.png") no-repeat scroll 0px 0px transparent'
        }, options || {});
        
        if("JotForm" in window && "url" in JotForm){
            options.buttonBack = 'url("'+JotForm.url+'images/ball.png") no-repeat scroll 0px 0px transparent';
        }
        
        var valueToPixel = function(value){
            var val = (value*100/options.maxValue)*barWidth/100;
            val = val < 3? 3 : val;
            return Math.round(val);
        };
        
        var sliderOut = new Element('div', {tabindex:1});
        var sliderBar = new Element('div');
        var sliderButton = new Element('div', {id:new Date().getTime()});
        
        var sliderTable = new Element('table', {cellpadding:0, cellspacing:1, border:0, width:options.width, className:element.className});
        var tbody = new Element('tbody');
        var tr = new Element('tr');
        var tr2 = new Element('tr');
        var sliderTD = new Element('td', {colspan:3});
        var startTD = new Element('td', {align:'center', width:20}).insert('0');
        var statTD = new Element('td', {align:'center', width:options.width-40}).insert(options.value).setStyle('font-weight:bold');
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
            e = document.getEvent(e);
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
            if(!sliderOut.__hasFocus){ return true; }
            e.stop();
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
            sliderOut.value = element.value === 0? "" : element.value;
            sliderTable.value = sliderOut.value;
            options.onUpdate(element.value);
            statTD.innerHTML = element.value;
            element.run('keyup');
            return element.value;
        };
        
        // Set styles
        sliderOut.setStyle({
            //border: '1px solid #ccc',
            //background: '#f5f5f5',
            width: options.width + 'px',
            position: 'relative',
            overflow:'hidden',
            outline:'none'
        });
        
        sliderBar.setStyle({
            border: '1px solid #999',
            background: '#eee',
            margin: '8px',
            overflow:'hidden',
            height: '3px'
        }).setCSSBorderRadius('4px');
        
        sliderButton.setStyle({
            position: 'absolute',
            height: '13px',
            width: '13px',
            background: options.buttonBack,
            overflow:'hidden',
            border: '1px solid transparent',
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
        sliderButton.setDraggable({constraint:'horizontal', /*snap:10,*/ dragEffect:false, cursor:'default', constrainLeft:3, constrainRight:barWidth, onDrag:function(i){
            updateValue(i.getStyle('left')); // Calculate the amount while dragging
        }});
        
        sliderOut.observe('focus', function(){
            sliderOut.__hasFocus = true;
            sliderOut.setStyle({borderColor:'#333'});
        }).observe('blur', function(){
            sliderOut.__hasFocus = false;
            sliderOut.setStyle({borderColor:'#ccc'});
        });
        
        // Set key and mousewheel events
        sliderOut.observe('keypress', sliderKeys).observe(Event.mousewheel, sliderWheel);
        
        sliderOut.observe('click', function(e){ // Set bar click event
            if(e.target.id == sliderButton.id){ return false; }
            var l = (Event.pointerX(e)-sliderBar.cumulativeOffset().left);
            l = l < 3? 3 : l;
            l = l > barWidth? barWidth : l;
            sliderButton.shift({left:l, duration:0.5}); // move the button where it's clicked
            updateValue(l);
        });
        
        // Create an hidden field
        
        var hidden = new Element('input', {type:'hidden', name:element.name, id:element.id});
        element.parentNode.replaceChild(hidden, element); // replace the hidden with original box
        
        element = hidden;
        
        $(hidden.parentNode).insert(sliderTable.setUnselectable()); // add slider to the page
        
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
        
        element = $(element);
        
        options = Object.extend({
            width:60,
            cssFloat:false,
            allowNegative:false,
            addAmount:1,
            maxValue:false, 
            minValue:false, 
            readonly:false,
            value:false,
            size: 5,
            imgPath: 'images/',
            onChange: Prototype.K
        }, options || {});
        
        element.size = options.size; // Set a size to make it look good
        if(options.value === false){
            element.value = parseFloat(element.value) || '0';
        }else{
            element.value = options.value;
        }
        
        if(element.value < options.minValue){
            element.value = options.minValue;
        }
        element.writeAttribute('autocomplete', 'off');
        // button Styles
        var buttonStyles = { height:'10px', cursor:'default', textAlign:'center', width:'7px', fontSize:'9px', paddingLeft:'4px', paddingRight:'2px', border:'1px solid #ccc', background:'#f5f5f5'};
        var spinnerContainer = new Element('div', {tabindex:'1'});
        if(options.cssFloat){
            spinnerContainer.setStyle({cssFloat:options.cssFloat, marginRight:'5px'});
        }
        
        spinnerContainer.setStyle({width:options.width+"px"});
        
        
        var spinnerTable, tbody, tr, tr2, inputTD, upTD, downTD; // define values
        
        spinnerTable = new Element('table', {className: 'form-spinner', cellpadding:0, cellspacing:0, border:0, height:20, width:options.width});
        tbody = new Element('tbody').insert(tr = new Element('tr'));
        
        spinnerContainer.insert(spinnerTable);
        spinnerTable.insert(tbody);
        
        element.parentNode.replaceChild(spinnerContainer, element);
        // Construcy the up button
        tr.insert(inputTD = new Element('td', {className: 'form-spinner-input-td', rowspan:2}).insert(element)).insert(upTD = new Element('td', {className: 'form-spinner-up'}).insert(new Element('img', {src:options.imgPath+'bullet_arrow_up.png', align:'right'})));
        // Construct the down button
        tbody.insert(tr2 = new Element('tr').insert(downTD = new Element('td', {className: 'form-spinner-down'}).insert(new Element('img', {src:options.imgPath+'bullet_arrow_down.png', align:'right'}))));
        
        spinnerTable.setStyle({border:'1px solid #ccc', borderCollapse:'collapse', background:'#fff' /*, width:'100%'*/ });
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
            element.value = parseFloat(element.value) + (options.addAmount);
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
            element.value = parseFloat(element.value) - options.addAmount;
            options.onChange(element.value);
        };
        /**
         * Handle key events
         * @param {Object} e
         * @param {Object} mode
         */
        var spinnerKeys = function(e, mode){
            if(e.target.tagName == "INPUT" && mode == 2){ return; }
            e = document.getEvent(e);
            if(e.keyCode == 38){
                numberUP(e);
            }else if(e.keyCode == 40){
                numberDOWN(e);
            }
        };
        
        upTD.observe('click', function(e){
            numberUP(e);
            element.run('keyup');
        }).setUnselectable();
        
        downTD.observe('click', function(e){
            numberDOWN(e);
            element.run('keyup');
        }).setUnselectable();
        
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
            trigger: false,
            onPicked: Prototype.K, // Run when user clicked on a color
            onComplete: Prototype.K, // Run when user clicked OK button
            onStart: Prototype.K,
            onEnd: Prototype.K
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
        
        $(options.trigger || element).observe('click', function(){
            
            if(options.onStart() === false){ // User may want to check before open the box
                element.colorPickerEnabled = false;
                return element;
            }

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
            
            tbody.insert(tr = new Element('tr').insert(new Element('th', {className:'titleHandler', colspan:'2', height: '10'}).setText(options.title).setStyle({paddingTop:'2px', paddingBottom:'0px', color:'#333', fontSize:'14px'})))
                 .insert(colorTR = new Element('tr')).insert(selectTR = new Element('tr'));
    
            colorTR.insert(colorTD = new Element('td'));
            colorTR.insert(colorTD2 = new Element('td'));
            selectTR.insert(selectTD = new Element('td', {colspan:2}));
            var box = new Element('input', {type:'text'}).setStyle({width:'48px', margin:'1px'});
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

            var OK = new Element('input', {type:'button', value:'OK'}).observe('click', function(){
                if(element.tagName == "INPUT"){
                    element.value = box.value;
                    element.focus();
                }
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
            
            element.closeColorPicker = function(){
                OK.run('click');
            };
            
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
            });
            
            var top = element.cumulativeOffset().top+element.getHeight();
            var left = element.cumulativeOffset().left;
            table.setStyle({position:'absolute', top:top + 3 +"px", left:left + 2 +'px'});
            
            table.setDraggable({handler: table.select('.titleHandler')[0] , dragEffect:false});
            
            $(document.body).insert(table);
            
            options.onEnd(element, table);
            
            overFlowDiv.setScroll({y:'0'});
            element.colorPickerEnabled = true;
        });
        return element;
    },
    
    /**
     * New Version of color picker
     * @param {Object} element
     * @param {Object} options
     */
    colorPicker2: function(element, options){
        
        options = Object.extend({
            onStart: Prototype.K,
            onEnd: Prototype.K,
            trigger: false,
            onPicked: Prototype.K,
            onComplete: Prototype.K,
            hideOnBlur: false,
            buttonClass:'big-button buttons'
        }, options || {});
        
        $(options.trigger || element).observe('click', function(){
            var docEvent = false;
            
            if(element.colorPickerEnabled){ return element; }
            
            if (options.onStart() === false) {
                return element;
            }
            
            if(options.hideOnBlur){
                setTimeout(function(){
                    docEvent = Element.on(document, 'click', function(e){
                        var el = Event.findElement(e, '.plugin, ');
                        if(!el){ element.closeColorPicker(); }
                    });
                }, 0);
            }
            
            element.colorPickerEnabled = true;
            
            var scrollOffset = element.cumulativeScrollOffset();
            
            var stop = 1;
            var top  = element.measure('cumulative-top')+2;
            var left = element.measure('cumulative-left')+1 - scrollOffset.left ;
            var height = element.measure('border-box-height');
            
            // Create elements
            var plugin      = new Element('div',    {className:'plugin edit-box'});
            var plugCUR     = new Element('div',    {className:'plugCUR'});
            var plugHEX     = new Element('input',  {type:'text', size:'10', className:'plugHEX'});
            var SV          = new Element('div',    {className:'SV'}).setUnselectable();
            var SVslide     = new Element('div',    {className:'SVslide'});
            var H           = new Element('form',   {className:'H'}).setUnselectable();
            var Hslide      = new Element('div',    {className:'Hslide'});
            var Hmodel      = new Element('div',    {className:'Hmodel'});
            var complete    = new Element('button', {type:'button', className:''});
            
            // Insert them into positions
            plugin.insert('<br>').insert(SV).insert(H);
            plugin.insert(plugCUR).insert(plugHEX.setValue('#FFFFFF')).insert(complete.update('OK'));
            SV.insert(SVslide.update('<br>'));
            H.insert(Hslide.update('<br>')).insert(Hmodel);
            
            // Set Styles
            plugin.setStyle({position:'absolute', top:(top+height)+'px', left:left+'px', zIndex:'10000000'});
            SVslide.setStyle('top:-4px; left:-4px;');
            Hslide.setStyle('top:0px; left:-8px;');
            complete.setStyle('float:right;margin-top:8px;').addClassName(options.buttonClass);
            
            // Set Events
            plugin.observe('mousedown', function(e){ HSVslide('drag', plugin, e); });
            plugHEX.observe('mousedown', function(e){ stop=0; setTimeout(function(){ stop=1; },100); });
            SV.observe('mousedown', function(e){ HSVslide(SVslide, plugin, e);});
            H.observe('mousedown', function(e){  HSVslide(Hslide, plugin, e);});
            
            complete.observe('click', function(){
                plugin.remove();
                element.colorPickerEnabled=false;
                if(docEvent){
                    docEvent.stop();
                }
                options.onComplete(plugHEX.value);
            });
            
            element.closeColorPicker = function(){
                complete.run('click');
            };
            
            function abPos(o){
                o = (typeof(o) == 'object' ? o : $(o));
                var z = { X: 0, Y: 0};
                while (o !== null) {
                    z.X += o.offsetLeft;
                    z.Y += o.offsetTop;
                    o = o.offsetParent;
                }
                return (z);
            }
            
            function within(v, a, z){
                return ((v >= a && v <= z) ? true : false);
            }
            
            function XY(e, v){
                /* var z = Prototype.Browser.IE? 
                          [event.clientX + document.body.scrollLeft, event.clientY + document.body.scrollTop] : 
                          [e.pageX, e.pageY];*/
                
                var evt = e || window.event;
                var z = [Event.pointerX(evt), Event.pointerY(evt)];
                v = parseInt(v, 10);
                return (z[!isNaN(v) ? v : 0]);
            }
            
            /* COLOR PICKER */
            
            var maxValue = {'H': 360,'S': 100,'V': 100};
            var HSV = { H: 360, S: 100, V: 100};
            var slideHSV = { H: 360, S: 100, V: 100 };
            
            function HSVslide(d, o, e){
                
                function tXY(e){
                    tY = XY(e, 1) - ab.Y;
                    tX = XY(e) - ab.X;
                }
                function mkHSV(a, b, c){
                    return (Math.min(a, Math.max(0, Math.ceil((parseInt(c, 10) / b) * a))));
                }
                
                function ckHSV(a, b){
                    if (within(a, 0, b)) { return (a); } 
                    else if (a > b) { return (b); } 
                    else if (a < 0) { return ('-' + oo); }
                }
                
                function drag(e){
                    if (!stop) {
                        
                        if (d != 'drag') {
                            tXY(e);
                        }
                        
                        if (d == SVslide) {
                            ds.left = ckHSV(tX - oo, 162) + 'px';
                            ds.top  = ckHSV(tY - oo, 162) + 'px';
                            slideHSV.S = mkHSV(100, 162, ds.left);
                            slideHSV.V = 100 - mkHSV(100, 162, ds.top);
                            
                            HSVupdate();
                            
                        } else if (d == Hslide) {
                            var ck = ckHSV(tY - oo, 163), r = 'HSV', z = {};
                            
                            ds.top = (ck) + 'px';
                            slideHSV.H = mkHSV(360, 163, ck);
                            z.H = maxValue.H - mkHSV(maxValue.H, 163, ck);
                            z.S = HSV.S;
                            z.V = HSV.V;
                            
                            HSVupdate(z);
                            SV.style.backgroundColor = '#' + color.HSV_HEX({
                                H: HSV.H,
                                S: 100,
                                V: 100
                            });
                            
                        } else if (d == 'drag') {
                            ds.left = XY(e) + oX - eX + 'px';
                            ds.top = XY(e, 1) + oY - eY + 'px';
                        }
                    }
                }
                
                if (stop) {
                    stop = '';
                    var ds = $(d != 'drag' ? d : o).style;
                    
                    if (d == 'drag') {
                        var oX = parseInt(ds.left, 10), oY = parseInt(ds.top, 10), eX = XY(e), eY = XY(e, 1);
                    } else {
                        var ab = abPos($(o)), tX, tY, oo = (d == Hslide) ? 0 : 4;
                        ab.X += 10;
                        ab.Y += 22;
                        if (d == SVslide) {
                            slideHSV.H = HSV.H;
                        }
                    }
                    
                    document.onmousemove = drag;
                    document.onmouseup = function(){
                        stop = 1;
                        document.onmousemove = '';
                        document.onmouseup = '';
                    };
                    drag(e);
                    
                }
            }
            
            function HSVupdate(v){
                v = HSV = v ? v : slideHSV;
                v = color.HSV_HEX(v);
                plugHEX.value = '#' + v;
                plugCUR.style.background = '#' + v;
                if(element.tagName == 'BUTTON'){
                    element.__colorvalue = '#' + v;
                }else{
                    element.value = '#' + v;
                }
                options.onPicked('#' + v, element, plugin);
                return (v);
                
            }
            
            function setValue(colorcode){
                var rgb = Protoplus.Colors.getRGBarray(colorcode);
                var hsv = color.RGB_HSV(rgb[0], rgb[1], rgb[2]);
                
                SV.style.backgroundColor = '#' + color.HSV_HEX({H:hsv.H, S:100, V:100});
                Hslide.style.top = Math.abs(Math.ceil((hsv.H * 163) / 360) - 163)+"px";
                
                var t = Math.abs((Math.floor((hsv.V * 162) / 100)) -162);
                var l = Math.abs((Math.floor((hsv.S * 162) / 100)));
                if(t <= 0){ t = t-4; }
                if(l <= 0){ l = l-4; }
                
                SVslide.style.top  = t+"px";
                SVslide.style.left = l+"px";
                
                HSVupdate(hsv);
            }
            
            element.setColorPickerValue = setValue;
            
            function loadSV(){
                var z = '';
                
                for (var i = 165; i >= 0; i--) {
                    z += "<div style=\"BACKGROUND: #" + color.HSV_HEX({
                        H: Math.round((360 / 165) * i),
                        S: 100,
                        V: 100
                    }) + ";\"><br /><\/div>";
                }
                Hmodel.innerHTML = z;
            }
            
            /* COLOR LIBRARY */
            var color = {
                cords: function(W){
                    var W2 = W / 2, rad = (hsv.H / 360) * (Math.PI * 2), hyp = (hsv.S + (100 - hsv.V)) / 100 * (W2 / 2);
                    $('mCur').style.left = Math.round(Math.abs(Math.round(Math.sin(rad) * hyp) + W2 + 3)) + 'px';
                    $('mCur').style.top = Math.round(Math.abs(Math.round(Math.cos(rad) * hyp) - W2 - 21)) + 'px';
                    
                },
                HEX: function(o){
                    o = Math.round(Math.min(Math.max(0, o), 255));
                    return ("0123456789ABCDEF".charAt((o - o % 16) / 16) + "0123456789ABCDEF".charAt(o % 16));
                },
                RGB_HSV: function (r, g, b){
                    r = r/255;
                    g = g/255;
                    b = b/255;
                    var max = Math.max(r, g, b), min = Math.min(r, g, b);
                    var h, s, v = max;
                
                    var d = max - min;
                    s = max === 0 ? 0 : d / max;
                
                    if(max == min){
                        h = 0; // achromatic
                    }else{
                        switch(max){
                            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                            case g: h = (b - r) / d + 2; break;
                            case b: h = (r - g) / d + 4; break;
                        }
                        h /= 6;
                    }
                
                    return {H:h*360, S:s*100, V:v*100};
                },
                RGB_HEX: function(o){
                    var fu = color.HEX;
                    return (fu(o.R) + fu(o.G) + fu(o.B));
                },
                HSV_RGB: function(o){
                
                    var R, G, A, B, C, S = o.S / 100, V = o.V / 100, H = o.H / 360;
                    
                    if (S > 0) {
                        if (H >= 1) {
                            H = 0;
                        }
                        
                        H = 6 * H;
                        F = H - Math.floor(H);
                        A = Math.round(255 * V * (1 - S));
                        B = Math.round(255 * V * (1 - (S * F)));
                        C = Math.round(255 * V * (1 - (S * (1 - F))));
                        V = Math.round(255 * V);
                        
                        switch (Math.floor(H)) {
                            case 0: R = V; G = C; B = A; break;
                            case 1: R = B; G = V; B = A; break;
                            case 2: R = A; G = V; B = C; break;
                            case 3: R = A; G = B; B = V; break;
                            case 4: R = C; G = A; B = V;break;
                            case 5: R = V;G = A;B = B;break;
                        }
                        
                        return ({
                            'R': R ? R : 0,
                            'G': G ? G : 0,
                            'B': B ? B : 0,
                            'A': 1
                        });
                        
                    } else {
                        return ({ 'R': (V = Math.round(V * 255)), 'G': V, 'B': V, 'A': 1 }); 
                    }
                },
                HSV_HEX: function(o){
                    return (color.RGB_HEX(color.HSV_RGB(o)));
                }
            };
            
            $(document.body).insert(plugin);
            loadSV();
            setValue(element.__colorvalue || element.value || "#FFFFFF");
            options.onEnd(element, plugin);
            return element;
        });
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
            text:'',
            nobr: false
        }, options || {});
        element.wrap('span');
        span = $(element.parentNode);
        span.setStyle({whiteSpace:'nowrap', cssFloat:'left', marginRight:'5px'});
        var labelStyle = {paddingLeft:'1px', fontSize:options.size+"px", color:options.color, cursor:'default'};
        var labelClick = function(){
            element.focus();
        };
        var br = '<br>';
        
        if(options.nobr){
            br = '';
        }
        
        if(options.position == "top"){
            element.insert({before:new Element('span').setText(label+br).setStyle(labelStyle).observe('click', labelClick)}).insert({after:options.text});
        }else{
            element.insert({after:new Element('span').setText(br+label).setStyle(labelStyle).observe('click', labelClick)}).insert({after:options.text});
        }
        
        return span;
    },
    /**
     * Places hint texts into input boxes
     * @param {Object} element
     * @param {Object} value
     */
    hint: function(element, value, options){
        element = $(element);
        
        if("placeholder" in element){
            element.writeAttribute('placeholder', value);
            return element;
        }
        
        if(element.type == 'number'){ element.value="0"; return element; }
        
        if(element.removeHint){
            return element.hintClear();
        }
        
        options = Object.extend({
            hintColor:'#999'
        }, options || {});
        
        var color = element.getStyle('color') || '#000';
        
        if (element.value === '') {
            element.setStyle({color:options.hintColor});
            element.value = value;
            element.hinted = true;
        }
        var focus = function(){
            if(element.value == value){
                element.value = "";
                element.setStyle({color:color}).hinted = false;
            }
        };
        
        var blur = function(){
            if(element.value === ""){
                element.value = value;
                element.setStyle({ color:options.hintColor }).hinted = true;
            }
        };
        
        var submit = function(){
            if(element.value == value){
                element.value = "";
                element.hinted = false;
            }
        };
        
        element.observe('focus', focus);
        element.observe('blur', blur);
        
        if(element.form){
            $(element.form).observe('submit', submit);
        }
        
        element.runHint = blur;
        
        element.clearHint = function(){
            element.value = "";
            element.setStyle({color:color}).hinted = false;
        };
        
        element.hintClear = function(){
            element.value = value;
            element.setStyle({ color:options.hintColor }).hinted = true;
            return element;
        };
        
        element.removeHint = function(){
            element.setStyle({color:color});
            
            if(element.value == value){
                element.value = "";
            }
            element.hintClear = undefined;
            element.hinted = undefined;
            element.removeHint = undefined;
            
            element.stopObserving('focus', focus);
            element.stopObserving('blur', blur);
            
            if(element.form){
                $(element.form).stopObserving('submit', submit);
            }
            return element;
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
            onResizeEnd: Prototype.K,
            imagePath:'images/resize.png',
            element:false,
            maxHeight:false,
            minHeight:false,
            maxWidth:false,
            minWidth:false,
            maxArea: false,
            autoAdjustOverflow: true,
            constrainViewport:true,
            constrainParent:false,
            keepAspectRatio:false,
            displayHandlers:true
        }, options, {});
        
        var handlerElem = $(element);
        
        if(options.element){
            element = $(options.element);
        }else{
            element = $(element);
        }
        
        element.resized = true;
        
        var elementPos = handlerElem.getStyle('position');
        if(!elementPos || elementPos == 'static'){
            handlerElem.setStyle({position:'relative'});
        }
        var ratio;
        
        var firstDim = element.getDimensions();
        
        var paddings = {
            top:  (parseInt(element.getStyle('padding-top'), 10) || 0) + (parseInt(element.getStyle('padding-bottom'), 10) || 0),
            left: (parseInt(element.getStyle('padding-left'), 10) || 0) + (parseInt(element.getStyle('padding-right'), 10) || 0)
        };
        
        // Handlers
        var handler = new Element('div'), rightHandler = new Element('div'), bottomHandler = new Element('div');
        
        handler.setStyle({ height:options.sensitivity+'px',width:options.sensitivity+'px', position:'absolute',bottom:'-'+options.overflow+'px',right:'-'+options.overflow+'px',cursor:'se-resize', zIndex:10000 });
        rightHandler.setStyle({ height: '100%', width:options.sensitivity+'px',position:'absolute',top:'0px',right:'-'+options.overflow+'px',cursor:'e-resize', zIndex:10000 });
        bottomHandler.setStyle({ height:options.sensitivity+'px', width: '100%', position:'absolute',bottom:'-'+options.overflow+'px', left:'0px', cursor:'s-resize', zIndex:10000 });
        
        handler.setStyle({ background: 'url('+options.imagePath+') no-repeat bottom right' });
        //rightHandler.setStyle({ background: 'url('+options.imagePath+') no-repeat right center' });
        //bottomHandler.setStyle({ background: 'url('+options.imagePath+') no-repeat center bottom ' });
        
        // Debugging styles
        // handler.setStyle({ borderBottom: '1px dashed #333', borderRight: '1px dashed #333', background: '' });
        // rightHandler.setStyle({ borderRight: '1px dashed #333', background: '' });
        // bottomHandler.setStyle({ borderBottom: '1px dashed #333', background: '' });

        var resize = function(e, type){
            e.stop();
            document.stopDrag = true;
            handlerElem.setUnselectable();
            $(document.body).setUnselectable();
            var sDim = $H(element.getDimensions()).map(function(d){
                if(d.key == "height"){
                    return d.value - paddings.top;
                }else if(d.key == "width"){
                    return d.value - paddings.left;
                }
                return d.value;
            });
            var startDim = {
                height: sDim[1],
                width: sDim[0]
            };
            
            if(options.keepAspectRatio){
                ratio = Math.abs(startDim.height / startDim.width);
            }
            
            var offs = element.cumulativeOffset();
            var pdim = $(element.parentNode).getDimensions();
            var poff = $(element.parentNode).cumulativeOffset();
            var mouseStart = { top:Event.pointerY(e), left:Event.pointerX(e) };
            var dim = document.viewport.getDimensions();
            var overflowHeight = "";
            var overflowWidth = "";
            
            switch(type){
                case "both":
                    handler.setStyle('height:100%; width:100%');
                break;
                case "horizontal":
                    rightHandler.setStyle({width:'100%'});
                break;
                case "vertical":
                    bottomHandler.setStyle({height:'100%'});
                break;
            }
            
            
            var setElementSize = function(dims){
                var height = dims.height;
                var width = dims.width;
                var type = dims.type || 'both';
                
                if(height){
                    height = (options.maxHeight && height >= options.maxHeight)? options.maxHeight : height;
                    height = (options.minHeight && height <= options.minHeight)? options.minHeight : height;
                    if(options.maxArea){
                        if(height * element.getWidth() >= options.maxArea){ return; } 
                    }
                
                    element.setStyle({height:height+"px"});
                }
                
                if(width){
                    width = (options.maxWidth && width >= options.maxWidth)? options.maxWidth : width;
                    width = (options.minWidth && width <= options.minWidth)? options.minWidth : width;
                    if(options.maxArea){
                        if(element.getHeight()*width >= options.maxArea){ return; } 
                    }
                
                    element.setStyle({width: width + "px"});
                }
                
                
                
                options.onResize((height || startDim.height) + paddings.top, (width || startDim.width) + paddings.left, type );
            };
            
            var mousemove = function(e){
                e.stop();
                if(type != "horizontal"){
                    var height = startDim.height + (Event.pointerY(e) - mouseStart.top);
                    var hskip = false;
                    
                    if (options.constrainViewport) {
                        hskip = ((height + offs.top) >= (dim.height - 3));
                    }
                    
                    if(options.constrainParent){
                        hskip = ((height + offs.top + paddings.top) >= (pdim.height+poff.top - 3));
                        if(hskip){
                            setElementSize({height: (pdim.height + poff.top - 3 ) - (offs.top + paddings.top + 3), type: type});
                        }
                    }
                    
                    if(!hskip){
                        setElementSize({ height: height, type: type });
                        if(options.keepAspectRatio){
                            setElementSize({width: height / ratio, type: type });
                        }
                    }
                }
                
                if (type != "vertical") {
                    var width = startDim.width + (Event.pointerX(e) - mouseStart.left);
                    var wskip = false;
                    if (options.constrainViewport) {
                        wskip = ((width + offs.left) >= (dim.width - 3));
                    }
                    
                    if(options.constrainParent){
                        wskip = ((width + offs.left + paddings.left) >= (pdim.width + poff.left - 3));
                        if(wskip){
                            setElementSize({width: (pdim.width + poff.left - 3 ) - (offs.left + paddings.left + 3), type: type});
                        }
                    }
                    
                    if(!wskip){
                        setElementSize({width: width, type: type});
                        if(options.keepAspectRatio){
                            setElementSize({height: width * ratio, type: type });
                        }
                    }
                }
                
            };
            
            var mouseup = function(){
                
                handler.setStyle({height:options.sensitivity+'px',width:options.sensitivity+'px'});
                rightHandler.setStyle({width:options.sensitivity+'px'});
                bottomHandler.setStyle({height:options.sensitivity+'px'});
                
                document.stopObserving('mousemove', mousemove).stopObserving('mouseup', mouseup).stopDrag = false;
                handlerElem.setSelectable();
                options.onResizeEnd(element.getHeight(), element.getWidth());
                /* 
                if(options.autoAdjustOverflow){
                 
                    var o;
                    if(o = element.isOverflow()){
                        if(o.top){
                            element.setStyle('height:'+ (element.getHeight() + o.top) +"px");
                        }
                        if(o.left){
                            element.setStyle('width:'+(element.getWidth() + o.left)+"px");
                        }
                    }
                }
                */
                $(document.body).setSelectable();
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
    positionFixed: function(element, options){
        element = $(element);
        // Should check for IE6
        /*if(Prototype.Browser.IE){
            return element.keepInViewport(options);
        }*/
        options = Object.extend({
            offset: 10, // left, top
            onPinned: Prototype.K,
            onUnpinned: Prototype.K,
            onBeforeScroll: Prototype.K,
            onBeforeScrollFail: Prototype.K,
            onScroll: Prototype.K
        }, options || {});
        
        var off  = element.cumulativeOffset();
        var sOff = element.cumulativeScrollOffset();
        var top = off.top + sOff.top;
        var left = off.left + sOff.left;
        
        var onScroll = function(){
            if(element.pinned){ return true; }
            
            var style = {};
            var bodyOff = $(document.body).cumulativeScrollOffset();
            //if(sOff.top < options.offset){ options.offset = sOff.top; }
            
            if(top <= bodyOff.top + options.offset){
                style = {position:'fixed', top: options.offset+'px'};
            }else{
                style = {position:'absolute', top:top+'px'};
            }

            if(options.onBeforeScroll(element, parseInt(style.top, 10), bodyOff.top) !== false){
                element.setStyle(style);
                options.onScroll(element, bodyOff.top);
            }else{
                if(element.style.position == "fixed"){
                    element.setStyle({position:'absolute', top:bodyOff.top+options.offset+'px'});
                    options.onBeforeScrollFail(element, parseInt(style.top, 10), bodyOff.top);
                }
            }
        };
        
        // Pins the element where it is located
        element.pin = function(){
            var bodyOff = $(document.body).cumulativeScrollOffset();
            element.style.top = bodyOff.top + options.offset + 'px';
            element.style.position = 'absolute';
            options.onPinned(element);  
            element.pinned = true; 
        };
        
        // Check if the element is pinned
        element.isPinned = function(){ options.onPinned(element); return element.pinned; };
        
        // Sets the element free
        element.unpin = function(){
            element.pinned = false;
            // Run the scroll Event when unpinned
            onScroll();
            options.onUnpinned(element);
        };
        
        element.updateScroll = onScroll;
        
        /**
         * Updates the max and left limits. Suitable for draggable elements
         */
        element.updateTop = function(topLimit){
            top = topLimit;
            return element;
        };
        
        // Set the scroll Event
        Event.observe(window, 'scroll', onScroll);
        return element;
    },
    /**
     * Keeps the element in the position
     * @param {Object} element
     * @param {Object} options
     */
    positionFixedBottom: function(element, options){
        element = $(element);
        options = Object.extend({
            offset: 0, // left, top
            onPinned: Prototype.K,
            onUnpinned: Prototype.K,
            onBeforeScroll: Prototype.K,
            onScroll: Prototype.K
        }, options || {});
        
        var off  = element.cumulativeOffset();
        var sOff = element.cumulativeScrollOffset();
        var top = off.top + sOff.top;
        var h = element.getHeight();
        var left = off.left + sOff.left;
        
        var onScroll = function(){
            if(element.pinned){ return true; }
            
            var style = {};
            var bodyOff = $(document.body).cumulativeScrollOffset();
            //if(sOff.top < options.offset){ options.offset = sOff.top; }
            
            if(top + h >= bodyOff.top + options.offset){
                style = {position:'fixed', bottom: options.offset+'px'};
            }else{
                if(element.style.position == "fixed"){
                    element.setStyle({position:'absolute', top:bodyOff.top+options.offset+'px'});
                    options.onBeforeScrollFail(element, parseInt(style.top, 10), bodyOff.top);
                }
            }
        };
        onScroll();
        // Pins the element where it is located
        element.pin = function(){
            var bodyOff = $(document.body).cumulativeScrollOffset();
            element.style.top = bodyOff.top + options.offset + 'px';
            element.style.position = 'absolute';
            options.onPinned(element);  
            element.pinned = true; 
        };
        
        // Check if the element is pinned
        element.isPinned = function(){ options.onPinned(element); return element.pinned; };
        
        // Sets the element free
        element.unpin = function(){
            element.pinned = false;
            // Run the scroll Event when unpinned
            onScroll();
            options.onUnpinned(element);
        };
        
        element.updateScroll = onScroll;
        
        /**
         * Updates the max and left limits. Suitable for draggable elements
         */
        element.updateTop = function(topLimit){
            top = topLimit;
            return element;
        };
        
        // Set the scroll Event
        Event.observe(window, 'scroll', onScroll);
        return element;
    },
    /**
     * Keeps the element in viewport when the page is scrolled
     * @param {Object} element
     * @param {Object} options
     */
    keepInViewport: function(element, options){
        element = $(element);
        options = Object.extend({
            offset: [10, 10], // left, top
            offsetLeft: false,
            offsetTop: false,
            delay: 0.1,
            onPinned: Prototype.K,
            onUnpinned: Prototype.K,
            onBeforeScroll: Prototype.K,
            onScroll: Prototype.K,
            smooth: false,
            horzontal: false,
            vertical: true,
            animation: { duration: 0.2, easing:'sineOut' },
            topLimit: parseInt(element.getStyle('top') || 0, 10),
            leftLimit: parseInt(element.getStyle('left') || 0, 10)
        }, options || {});
        
        // Just in case, to protect the animation config
        options.animation = Object.extend({ duration: 0.4 }, options.animation || {});
        options.delay *= 1000;
        
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
            
            var doScroll = function(){
                
                var off  = /* {top: element.scrollTop || 0, left:element.scrollLeft || 0}; // */ element.cumulativeOffset();
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
            };
            
            
            if (options.smooth === false) {
                doScroll();
            }else{
                timer = setTimeout(doScroll, options.delay);
            } 
            return element;
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
        
        element.update = onScroll;
        
        /**
         * Updates the max and left limits. Suitable for draggable elements
         */
        element.updateLimits = function(top, left){
            options.topLimit = top || parseInt(element.getStyle('top') || 0, 10);
            options.leftLimit = left || parseInt(element.getStyle('left') || 0, 10);
            return element;
        };
        // Set the scroll Event
        Event.observe(window, 'scroll', onScroll);
        
        return element;
    },
    /**
     * Converts dropdowns to a stylish boxes
     * @param {Object} element
     * @param {Object} options
     */
    bigSelect: function(element, options){
        element = $(element);
        // Internet Explorer 9 fix. Check back later
        // Disabled for all versions of IE because it's just stupid
        if(!Prototype.Browser.IE9 && Prototype.Browser.IE /*&& Protoplus.getIEVersion() < 8 || Prototype.Browser.IE9*/){
            return element; // Disable this for older versions of IE until we find a solution for z-index bug
        }
        
        options = Object.extend({
            classpreFix: 'big-select',
            additionalClassName:'',
            onSelect: function(x){ return x; },
            onComplete:  function(x){ return x; }
        }, options || {});

        if (element.selectConverted) {
            element.selectConverted.remove();
        }
        
        var cont = new Element('div', {className: options.classpreFix+' '+options.additionalClassName, tabIndex:'1'}).setStyle({outline:'none', fontSize: element.getStyle('font-size')});
        var content = new Element('div', {className: options.classpreFix+'-content'});
        var list = new Element('div', {className: options.classpreFix+'-list'}).setStyle('z-index:2000000').hide();
        var arrow = new Element('div', {className: options.classpreFix+'-arrow'});
        var span = new Element('div', {className: options.classpreFix+'-content-span'});
        
        element.selectConverted = cont;
        cont.setUnselectable();
        if(options.width){
            cont.setStyle({width:options.width});
        }
        
        content.update(span);
        cont.insert(content).insert(list).insert(arrow);
        element.insert({before:cont}).hide();
        element.observe('change', function(){
            span.update(options.onSelect(element.getSelected().text));
        });
        
        var closeList = function(){
            cont.removeClassName(options.classpreFix+'-open');
            list.hide();
        };
        
        $A(element.options).each(function(opt){
            if(opt.selected){
                span.update(options.onSelect(opt.text));
            }
            var li = new Element('li', {value:opt.value}).insert(opt.text);
            li.hover(function(){
                li.setStyle('background:#ccc');
            }, function(){
                li.setStyle({background: ''});
            });
            li.observe('click', function(){
                span.update(options.onSelect(li.innerHTML, li.readAttribute('value')));
                element.selectOption(li.readAttribute('value'));
                
                closeList();
            });
            list.insert(li);
        });
        
        cont.observe('blur', function(){
            closeList();
        });
        
        list.show();
        var currentTop = list.getStyle('top');
        list.hide();
        

        var toggleList = function(){
            if(list.visible()){
                closeList();
            }else{
                list.show();
                cont.addClassName(options.classpreFix+'-open');
                list.setStyle({height: '', /*top:currentTop,*/ overflow:'', bottom:'' });
                var vh = document.viewport.getHeight();
                var lt = list.cumulativeOffset().top;
                var lh = list.getHeight();
                
                if(vh < lt + lh){
                    if(vh-lt-20 < 150){
                        var h = 'auto';
                        if(lh > lt){
                            h = (lt -10 )+'px';
                        }
                        
                        list.setStyle({bottom: content.getHeight()+'px', top:'auto', height: h, overflow:'auto' });
                    }else{
                        list.setStyle({height: (vh-lt-20)+'px', overflow:'auto' });
                    }
                }
            }
        };
        
        arrow.observe('click', toggleList);
        content.observe('click', toggleList);
        options.onComplete(cont, element);
        return element;
    },
    rotatingText: function(element, text, options) {
        element = $(element);
        options = Object.extend({
            delimiter: ' - ',
            duration: 150
        }, options || {});
        
        var orgText = element.innerHTML.strip();
        text += options.delimiter;
        
        var orgLength = orgText.length;
        var initialText = text.substr(0, orgLength);
        element.innerHTML = initialText;
        var current = 0;
        var interval = setInterval(function() {
            if (current == text.length) {
                current = 0;
                element.innerHTML = text.substr(current++, orgLength);
            }
            else if (current + orgLength > text.length) {
                var toInsert = text.substr(current, orgLength);
                // toInsert += "-" + text.substr(0, orgLength - (text.length - current - 1));
                toInsert += text.substr(0, orgLength - (text.length - current));
                element.innerHTML = toInsert;
                current++;
            }
            else { // current + orgLength
                element.innerHTML = text.substr(current++, orgLength);
            }
        }, options.duration);
        element.rotatingStop = function() {
            clearTimeout(interval);
            element.innerHTML = orgText;
        };
        return element;
    }
};
Element.addMethods(Protoplus.ui);

/**
 * Memmory leak prevention
 */
Event.observe(window, 'unload', function(){
    Protoplus = null;
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
            force:false,
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
        
        if(!sameDomain && this.options.force === false){ // If url is not external then convert it to Ajax.Request
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
            var res = this.script;
            this.script.remove();
            window.onerror = null;
            
            if(this.response){
                setTimeout(function(){
                    this.options.onComplete({responseJSON: this.response});
                    this.options.onSuccess({responseJSON: this.response});
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
        }.bind(this);
        
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

var rand = function (min, max){
    return Math.floor(Math.random()*(max-min))+min;
};

/**
 * With protoinit you can define functions before loading protoplus.
 * USAGE: 
 * var __protoinit = [];
 * __protoinit.push(function(){ alert("here"); })
 */
if("__protoinit" in window){
    document.ready(function(e){
        $A(__protoinit).each(function(f){
            f(e);
        });
    });
}

// The End... Thank you for listening
