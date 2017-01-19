(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {};
},{}],2:[function(require,module,exports){
var documentReady = require('document-ready');
var nanohistory = require('nanohistory');
var nanorouter = require('nanorouter');
var nanomount = require('nanomount');
var nanomorph = require('nanomorph');
var nanohref = require('nanohref');
var nanoraf = require('nanoraf');
var nanobus = require('nanobus');
module.exports = Choo;
function Choo(opts) {
    opts = opts || {};
    var routerOpts = {
        default: opts.defaultRoute || '/404',
        curry: true
    };
    var timingEnabled = opts.timing === undefined ? true : opts.timing;
    var hasWindow = typeof window !== 'undefined';
    var hasPerformance = hasWindow && window.performance && window.performance.mark;
    var router = nanorouter(routerOpts);
    var bus = nanobus();
    var rerender = null;
    var tree = null;
    var state = {};
    return {
        toString: toString,
        use: register,
        mount: mount,
        router: router,
        route: route,
        start: start
    };
    function route(route, handler) {
        router.on(route, function (params) {
            return function () {
                state.params = params;
                return handler(state, emit);
            };
        });
    }
    function register(cb) {
        cb(state, bus);
    }
    function start() {
        if (opts.history !== false) {
            nanohistory(function (href) {
                bus.emit('pushState');
            });
            bus.prependListener('pushState', updateHistory.bind(null, 'push'));
            bus.prependListener('replaceState', updateHistory.bind(null, 'replace'));
            if (opts.href !== false) {
                nanohref(function (location) {
                    var href = location.href;
                    var currHref = window.location.href;
                    if (href === currHref) return;
                    bus.emit('pushState', href);
                });
            }
        }
        function updateHistory(mode, href) {
            if (href) window.history[mode + 'State']({}, null, href);
            bus.emit('render');
            setTimeout(function () {
                scrollIntoView();
            }, 0);
        }
        rerender = nanoraf(function () {
            if (hasPerformance && timingEnabled) {
                window.performance.mark('choo:renderStart');
            }
            var newTree = router(createLocation());
            tree = nanomorph(tree, newTree);
            if (hasPerformance && timingEnabled) {
                window.performance.mark('choo:renderEnd');
                window.performance.measure('choo:render', 'choo:renderStart', 'choo:renderEnd');
            }
        });
        bus.prependListener('render', rerender);
        documentReady(function () {
            bus.emit('DOMContentLoaded');
        });
        tree = router(createLocation());
        return tree;
    }
    function emit(eventName, data) {
        bus.emit(eventName, data);
    }
    function mount(selector) {
        var newTree = start();
        documentReady(function () {
            var root = document.querySelector(selector);
            nanomount(root, newTree);
            tree = root;
        });
    }
    function toString(location, _state) {
        state = _state || {};
        var html = router(location);
        return html.toString();
    }
}
function scrollIntoView() {
    var hash = window.location.hash;
    if (hash) {
        try {
            var el = document.querySelector(hash);
            if (el) el.scrollIntoView(true);
        } catch (e) {}
    }
}
function createLocation() {
    var pathname = window.location.pathname.replace(/\/$/, '');
    var hash = window.location.hash.replace(/^#/, '/');
    return pathname + hash;
}
},{"document-ready":3,"nanobus":4,"nanohistory":5,"nanohref":6,"nanomorph":7,"nanomount":10,"nanoraf":11,"nanorouter":12}],3:[function(require,module,exports){
'use strict';

module.exports = ready;
function ready(callback) {
    var state = document.readyState;
    if (state === 'complete' || state === 'interactive') {
        return setTimeout(callback, 0);
    }
    document.addEventListener('DOMContentLoaded', function onLoad() {
        callback();
    });
}
},{}],4:[function(require,module,exports){
var nanotiming = require('nanotiming');
module.exports = Nanobus;
function Nanobus(name) {
    if (!(this instanceof Nanobus)) return new Nanobus(name);
    this._name = name || 'nanobus';
    this._starListeners = [];
    this._listeners = {};
    this._timing = nanotiming(this._name);
}
Nanobus.prototype.emit = function (eventName, data) {
    this._timing.start(eventName);
    var listeners = this._listeners[eventName];
    if (listeners && listeners.length > 0) {
        this._emit(this._listeners[eventName], data);
    }
    if (this._starListeners.length > 0) {
        this._emit(this._starListeners, eventName, data);
    }
    this._timing.end(eventName);
    return this;
};
Nanobus.prototype.on = Nanobus.prototype.addListener = function (eventName, listener) {
    if (eventName === '*') {
        this._starListeners.push(listener);
    } else {
        if (!this._listeners[eventName]) this._listeners[eventName] = [];
        this._listeners[eventName].push(listener);
    }
    return this;
};
Nanobus.prototype.prependListener = function (eventName, listener) {
    if (eventName === '*') {
        this._starListeners.unshift(listener);
    } else {
        if (!this._listeners[eventName]) this._listeners[eventName] = [];
        this._listeners[eventName].unshift(listener);
    }
    return this;
};
Nanobus.prototype.once = function (eventName, listener) {
    var self = this;
    this.on(eventName, once);
    function once() {
        listener.apply(self, arguments);
        self.removeListener(eventName, once);
    }
    return this;
};
Nanobus.prototype.prependOnceListener = function (eventName, listener) {
    var self = this;
    this.prependListener(eventName, once);
    function once() {
        listener.apply(self, arguments);
        self.removeListener(eventName, once);
    }
    return this;
};
Nanobus.prototype.removeListener = function (eventName, listener) {
    if (eventName === '*') {
        this._starListeners = this._starListeners.slice();
        return remove(this._starListeners, listener);
    } else {
        if (typeof this._listeners[eventName] !== 'undefined') {
            this._listeners[eventName] = this._listeners[eventName].slice();
        }
        return remove(this._listeners[eventName], listener);
    }
    function remove(arr, listener) {
        if (!arr) return;
        var index = arr.indexOf(listener);
        if (index !== -1) {
            arr.splice(index, 1);
            return true;
        }
    }
};
Nanobus.prototype.removeAllListeners = function (eventName) {
    if (eventName) {
        if (eventName === '*') {
            this._starListeners = [];
        } else {
            this._listeners[eventName] = [];
        }
    } else {
        this._starListeners = [];
        this._listeners = {};
    }
    return this;
};
Nanobus.prototype.listeners = function (eventName) {
    var listeners = eventName !== '*' ? this._listeners[eventName] : this._starListeners;
    var ret = [];
    if (listeners) {
        var ilength = listeners.length;
        for (var i = 0; i < ilength; i++) {
            ret.push(listeners[i]);
        }
    }
    return ret;
};
Nanobus.prototype._emit = function (arr, eventName, data) {
    if (typeof arr === 'undefined') return;
    if (!data) {
        data = eventName;
        eventName = null;
    }
    var length = arr.length;
    for (var i = 0; i < length; i++) {
        var listener = arr[i];
        if (eventName) listener(eventName, data);else listener(data);
    }
};
},{"nanotiming":13}],5:[function(require,module,exports){
module.exports = history;
function history(cb) {
    window.onpopstate = function () {
        cb(document.location);
    };
}
},{}],6:[function(require,module,exports){
module.exports = href;
var noRoutingAttrName = 'data-no-routing';
function href(cb, root) {
    root = root || window.document;
    window.onclick = function (e) {
        if (e.button && e.button !== 0 || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return;
        var node = function traverse(node) {
            if (!node || node === root) return;
            if (node.localName !== 'a') return traverse(node.parentNode);
            if (node.href === undefined) return traverse(node.parentNode);
            if (window.location.host !== node.host) return traverse(node.parentNode);
            return node;
        }(e.target);
        if (!node) return;
        var isRoutingDisabled = node.hasAttribute(noRoutingAttrName);
        if (isRoutingDisabled) return;
        e.preventDefault();
        cb(node);
    };
}
},{}],7:[function(require,module,exports){
var morph = require('./lib/morph');
var rootLabelRegex = /^data-onloadid/;
var ELEMENT_NODE = 1;
module.exports = nanomorph;
function nanomorph(oldTree, newTree) {
    persistStatefulRoot(newTree, oldTree);
    var tree = walk(newTree, oldTree);
    return tree;
}
function walk(newNode, oldNode) {
    if (!oldNode) {
        return newNode;
    } else if (!newNode) {
        return null;
    } else if (newNode.isSameNode && newNode.isSameNode(oldNode)) {
        return oldNode;
    } else if (newNode.tagName !== oldNode.tagName) {
        return newNode;
    } else {
        morph(newNode, oldNode);
        updateChildren(newNode, oldNode);
        return oldNode;
    }
}
function updateChildren(newNode, oldNode) {
    if (!newNode.childNodes || !oldNode.childNodes) return;
    var newLength = newNode.childNodes.length;
    var oldLength = oldNode.childNodes.length;
    var length = Math.max(oldLength, newLength);
    var iNew = 0;
    var iOld = 0;
    for (var i = 0; i < length; i++, iNew++, iOld++) {
        var newChildNode = newNode.childNodes[iNew];
        var oldChildNode = oldNode.childNodes[iOld];
        var retChildNode = walk(newChildNode, oldChildNode);
        if (!retChildNode) {
            if (oldChildNode) {
                oldNode.removeChild(oldChildNode);
                iOld--;
            }
        } else if (!oldChildNode) {
            if (retChildNode) {
                oldNode.appendChild(retChildNode);
                iNew--;
            }
        } else if (retChildNode !== oldChildNode) {
            oldNode.replaceChild(retChildNode, oldChildNode);
            iNew--;
        }
    }
}
function persistStatefulRoot(newNode, oldNode) {
    if (!newNode || !oldNode || oldNode.nodeType !== ELEMENT_NODE || newNode.nodeType !== ELEMENT_NODE) return;
    var oldAttrs = oldNode.attributes;
    var attr, name;
    for (var i = 0, len = oldAttrs.length; i < len; i++) {
        attr = oldAttrs[i];
        name = attr.name;
        if (rootLabelRegex.test(name)) {
            newNode.setAttribute(name, attr.value);
            break;
        }
    }
}
},{"./lib/morph":9}],8:[function(require,module,exports){
module.exports = ['onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onmouseenter', 'onmouseleave', 'ondragstart', 'ondrag', 'ondragenter', 'ondragleave', 'ondragover', 'ondrop', 'ondragend', 'onkeydown', 'onkeypress', 'onkeyup', 'onunload', 'onabort', 'onerror', 'onresize', 'onscroll', 'onselect', 'onchange', 'onsubmit', 'onreset', 'onfocus', 'onblur', 'oninput', 'oncontextmenu', 'onfocusin', 'onfocusout'];
},{}],9:[function(require,module,exports){
var events = require('./events');
var eventsLength = events.length;
var ELEMENT_NODE = 1;
var TEXT_NODE = 3;
var COMMENT_NODE = 8;
module.exports = morph;
function morph(newNode, oldNode) {
    var nodeType = newNode.nodeType;
    var nodeName = newNode.nodeName;
    if (nodeType === ELEMENT_NODE) {
        copyAttrs(newNode, oldNode);
    }
    if (nodeType === TEXT_NODE || nodeType === COMMENT_NODE) {
        oldNode.nodeValue = newNode.nodeValue;
    }
    if (nodeName === 'INPUT') updateInput(newNode, oldNode);else if (nodeName === 'OPTION') updateOption(newNode, oldNode);else if (nodeName === 'TEXTAREA') updateTextarea(newNode, oldNode);else if (nodeName === 'SELECT') updateSelect(newNode, oldNode);
    copyEvents(newNode, oldNode);
}
function copyAttrs(newNode, oldNode) {
    var oldAttrs = oldNode.attributes;
    var newAttrs = newNode.attributes;
    var attrNamespaceURI = null;
    var attrValue = null;
    var fromValue = null;
    var attrName = null;
    var attr = null;
    for (var i = newAttrs.length - 1; i >= 0; --i) {
        attr = newAttrs[i];
        attrName = attr.name;
        attrNamespaceURI = attr.namespaceURI;
        attrValue = attr.value;
        if (attrNamespaceURI) {
            attrName = attr.localName || attrName;
            fromValue = oldNode.getAttributeNS(attrNamespaceURI, attrName);
            if (fromValue !== attrValue) {
                oldNode.setAttributeNS(attrNamespaceURI, attrName, attrValue);
            }
        } else {
            fromValue = oldNode.getAttribute(attrName);
            if (fromValue !== attrValue) {
                if (attrValue === 'null' || attrValue === 'undefined') {
                    oldNode.removeAttribute(attrName);
                } else {
                    oldNode.setAttribute(attrName, attrValue);
                }
            }
        }
    }
    for (var j = oldAttrs.length - 1; j >= 0; --j) {
        attr = oldAttrs[j];
        if (attr.specified !== false) {
            attrName = attr.name;
            attrNamespaceURI = attr.namespaceURI;
            if (attrNamespaceURI) {
                attrName = attr.localName || attrName;
                if (!newNode.hasAttributeNS(attrNamespaceURI, attrName)) {
                    oldNode.removeAttributeNS(attrNamespaceURI, attrName);
                }
            } else {
                if (!newNode.hasAttributeNS(null, attrName)) {
                    oldNode.removeAttribute(attrName);
                }
            }
        }
    }
}
function copyEvents(newNode, oldNode) {
    for (var i = 0; i < eventsLength; i++) {
        var ev = events[i];
        if (newNode[ev]) {
            oldNode[ev] = newNode[ev];
        } else if (oldNode[ev]) {
            oldNode[ev] = undefined;
        }
    }
}
function updateOption(newNode, oldNode) {
    updateAttribute(newNode, oldNode, 'selected');
}
function updateInput(newNode, oldNode) {
    var newValue = newNode.value;
    var oldValue = oldNode.value;
    updateAttribute(newNode, oldNode, 'checked');
    updateAttribute(newNode, oldNode, 'disabled');
    if (!newNode.hasAttributeNS(null, 'value') || newValue === 'null') {
        oldNode.value = '';
        oldNode.removeAttribute('value');
    } else if (newValue !== oldValue) {
        oldNode.setAttribute('value', newValue);
        oldNode.value = newValue;
    } else if (oldNode.type === 'range') {
        oldNode.value = newValue;
    }
}
function updateTextarea(newNode, oldNode) {
    var newValue = newNode.value;
    if (newValue !== oldNode.value) {
        oldNode.value = newValue;
    }
    if (oldNode.firstChild) {
        if (newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder) {
            return;
        }
        oldNode.firstChild.nodeValue = newValue;
    }
}
function updateSelect(newNode, oldNode) {
    if (!oldNode.hasAttributeNS(null, 'multiple')) {
        var i = 0;
        var curChild = oldNode.firstChild;
        while (curChild) {
            var nodeName = curChild.nodeName;
            if (nodeName && nodeName.toUpperCase() === 'OPTION') {
                if (curChild.hasAttributeNS(null, 'selected')) break;
                i++;
            }
            curChild = curChild.nextSibling;
        }
        newNode.selectedIndex = i;
    }
}
function updateAttribute(newNode, oldNode, name) {
    if (newNode[name] !== oldNode[name]) {
        oldNode[name] = newNode[name];
        if (newNode[name]) {
            oldNode.setAttribute(name, '');
        } else {
            oldNode.removeAttribute(name, '');
        }
    }
}
},{"./events":8}],10:[function(require,module,exports){
var nanomorph = require('nanomorph');
module.exports = nanomount;
function nanomount(target, newTree) {
    if (target.nodeName === 'BODY') {
        var children = target.childNodes;
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeName === 'SCRIPT') {
                newTree.appendChild(children[i].cloneNode(true));
            }
        }
    }
    var tree = nanomorph(target, newTree);
}
},{"nanomorph":7}],11:[function(require,module,exports){
'use strict';

module.exports = nanoraf;
function nanoraf(render, raf) {
    if (!raf) raf = window.requestAnimationFrame;
    var redrawScheduled = false;
    var args = null;
    return function frame() {
        if (args === null && !redrawScheduled) {
            redrawScheduled = true;
            raf(function redraw() {
                redrawScheduled = false;
                var length = args.length;
                var _args = new Array(length);
                for (var i = 0; i < length; i++) {
                    _args[i] = args[i];
                }render.apply(render, _args);
                args = null;
            });
        }
        args = arguments;
    };
}
},{}],12:[function(require,module,exports){
var wayfarer = require('wayfarer');
var isLocalFile = /file:\/\//.test(typeof window === 'object' && window.location && window.location.origin);
var electron = '^(file://|/)(.*.html?/?)?';
var protocol = '^(http(s)?(://))?(www.)?';
var domain = '[a-zA-Z0-9-_.]+(:[0-9]{1,5})?(/{1})?';
var qs = '[?].*$';
var stripElectron = new RegExp(electron);
var prefix = new RegExp(protocol + domain);
var normalize = new RegExp('#');
var suffix = new RegExp(qs);
module.exports = Nanorouter;
function Nanorouter(opts) {
    opts = opts || {};
    var router = wayfarer(opts.default || '/404');
    var curry = opts.curry || false;
    var prevCallback = null;
    var prevRoute = null;
    emit.router = router;
    emit.on = on;
    return emit;
    function on(routename, listener) {
        routename = routename.replace(/^[#\/]/, '');
        router.on(routename, listener);
    }
    function emit(route) {
        if (!curry) {
            return router(route);
        } else {
            route = pathname(route, isLocalFile);
            if (route === prevRoute) {
                return prevCallback();
            } else {
                prevRoute = route;
                prevCallback = router(route);
                return prevCallback();
            }
        }
    }
}
function pathname(route, isElectron) {
    if (isElectron) route = route.replace(stripElectron, '');else route = route.replace(prefix, '');
    return route.replace(suffix, '').replace(normalize, '/');
}
},{"wayfarer":14}],13:[function(require,module,exports){
module.exports = Nanotiming;
function Nanotiming(name) {
    if (!(this instanceof Nanotiming)) return new Nanotiming(name);
    this._name = name;
    this._enabled = typeof window !== 'undefined' && window.performance && window.performance.mark;
}
Nanotiming.prototype.start = function (partial) {
    if (!this._enabled) return;
    var name = partial ? this._name + ':' + partial : this._name;
    window.performance.mark(name + '-start');
};
Nanotiming.prototype.end = function (partial) {
    if (!this._enabled) return;
    var name = partial ? this._name + ':' + partial : this._name;
    window.performance.mark(name + '-end');
    window.performance.measure(name, name + '-start', name + '-end');
};
},{}],14:[function(require,module,exports){
var trie = require('./trie');
module.exports = Wayfarer;
function Wayfarer(dft) {
    if (!(this instanceof Wayfarer)) return new Wayfarer(dft);
    var _default = (dft || '').replace(/^\//, '');
    var _trie = trie();
    emit._trie = _trie;
    emit.emit = emit;
    emit.on = on;
    emit._wayfarer = true;
    return emit;
    function on(route, cb) {
        route = route || '/';
        cb.route = route;
        if (cb && cb._wayfarer && cb._trie) {
            _trie.mount(route, cb._trie.trie);
        } else {
            var node = _trie.create(route);
            node.cb = cb;
        }
        return emit;
    }
    function emit(route) {
        var args = new Array(arguments.length);
        for (var i = 1; i < args.length; i++) {
            args[i] = arguments[i];
        }
        var node = _trie.match(route);
        if (node && node.cb) {
            args[0] = node.params;
            var cb = node.cb;
            return cb.apply(cb, args);
        }
        var dft = _trie.match(_default);
        if (dft && dft.cb) {
            args[0] = dft.params;
            var dftcb = dft.cb;
            return dftcb.apply(dftcb, args);
        }
        throw new Error('route \'' + route + '\' did not match');
    }
}
},{"./trie":15}],15:[function(require,module,exports){
var mutate = require('xtend/mutable');
var xtend = require('xtend');
module.exports = Trie;
function Trie() {
    if (!(this instanceof Trie)) return new Trie();
    this.trie = { nodes: {} };
}
Trie.prototype.create = function (route) {
    var routes = route.replace(/^\//, '').split('/');
    function createNode(index, trie) {
        var thisRoute = routes.hasOwnProperty(index) && routes[index];
        if (thisRoute === false) return trie;
        var node = null;
        if (/^:|^\*/.test(thisRoute)) {
            if (!trie.nodes.hasOwnProperty('$$')) {
                node = { nodes: {} };
                trie.nodes['$$'] = node;
            } else {
                node = trie.nodes['$$'];
            }
            if (thisRoute[0] === '*') {
                trie.wildcard = true;
            }
            trie.name = thisRoute.replace(/^:|^\*/, '');
        } else if (!trie.nodes.hasOwnProperty(thisRoute)) {
            node = { nodes: {} };
            trie.nodes[thisRoute] = node;
        } else {
            node = trie.nodes[thisRoute];
        }
        return createNode(index + 1, node);
    }
    return createNode(0, this.trie);
};
Trie.prototype.match = function (route) {
    var routes = route.replace(/^\//, '').split('/');
    var params = {};
    function search(index, trie) {
        if (trie === undefined) return undefined;
        var thisRoute = routes[index];
        if (thisRoute === undefined) return trie;
        if (trie.nodes.hasOwnProperty(thisRoute)) {
            return search(index + 1, trie.nodes[thisRoute]);
        } else if (trie.wildcard) {
            try {
                params['wildcard'] = decodeURIComponent(routes.slice(index).join('/'));
            } catch (e) {
                return search(index, undefined);
            }
            return trie.nodes['$$'];
        } else if (trie.name) {
            try {
                params[trie.name] = decodeURIComponent(thisRoute);
            } catch (e) {
                return search(index, undefined);
            }
            return search(index + 1, trie.nodes['$$']);
        } else {
            return search(index + 1);
        }
    }
    var node = search(0, this.trie);
    if (!node) return undefined;
    node = xtend(node);
    node.params = params;
    return node;
};
Trie.prototype.mount = function (route, trie) {
    var split = route.replace(/^\//, '').split('/');
    var node = null;
    var key = null;
    if (split.length === 1) {
        key = split[0];
        node = this.create(key);
    } else {
        var headArr = split.splice(0, split.length - 1);
        var head = headArr.join('/');
        key = split[0];
        node = this.create(head);
    }
    mutate(node.nodes, trie.nodes);
    if (trie.name) node.name = trie.name;
    if (node.nodes['']) {
        Object.keys(node.nodes['']).forEach(function (key) {
            if (key === 'nodes') return;
            node[key] = node.nodes[''][key];
        });
        mutate(node.nodes, node.nodes[''].nodes);
        delete node.nodes[''].nodes;
    }
};
},{"xtend":16,"xtend/mutable":17}],16:[function(require,module,exports){
module.exports = extend;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function extend() {
    var target = {};
    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}
},{}],17:[function(require,module,exports){
module.exports = extend;
var hasOwnProperty = Object.prototype.hasOwnProperty;
function extend(target) {
    for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
            if (hasOwnProperty.call(source, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}
},{}],18:[function(require,module,exports){
module.exports = function yoyoifyAppendChild(el, childs) {
    for (var i = 0; i < childs.length; i++) {
        var node = childs[i];
        if (Array.isArray(node)) {
            yoyoifyAppendChild(el, node);
            continue;
        }
        if (typeof node === 'number' || typeof node === 'boolean' || node instanceof Date || node instanceof RegExp) {
            node = node.toString();
        }
        if (typeof node === 'string') {
            if (/^[\n\r\s]+$/.test(node)) continue;
            if (el.lastChild && el.lastChild.nodeName === '#text') {
                el.lastChild.nodeValue += node;
                continue;
            }
            node = document.createTextNode(node);
        }
        if (node && node.nodeType) {
            el.appendChild(node);
        }
    }
};
},{}],19:[function(require,module,exports){
var html = require('choo/html');
var Title = function (t) {
    if (t.nologo) {
        return function () {
            var ac = require('/Users/hbrls/github/hbrls.github.io/node_modules/yo-yoify/lib/appendChild.js');
            var bel0 = document.createElement('span');
            ac(bel0, [arguments[0]]);
            return bel0;
        }(t.id);
    } else {
        var logo = '/static/img/logo-' + t.id + '.png';
        return function () {
            var ac = require('/Users/hbrls/github/hbrls.github.io/node_modules/yo-yoify/lib/appendChild.js');
            var bel0 = document.createElement('img');
            bel0.setAttribute('src', arguments[0]);
            return bel0;
        }(logo);
    }
};
module.exports = function (t) {
    return function () {
        var ac = require('/Users/hbrls/github/hbrls.github.io/node_modules/yo-yoify/lib/appendChild.js');
        var bel3 = document.createElement('div');
        bel3.setAttribute('class', 'col-md-2 Tile Tile-' + arguments[2]);
        var bel2 = document.createElement('div');
        bel2.setAttribute('class', 'Tile-outer');
        var bel1 = document.createElement('div');
        bel1.setAttribute('class', 'Tile-inner');
        var bel0 = document.createElement('a');
        bel0.setAttribute('href', arguments[0]);
        bel0.setAttribute('target', '_blank');
        bel0.setAttribute('class', '');
        ac(bel0, ['\n          ', arguments[1], '\n        ']);
        ac(bel1, ['\n        ', bel0, '\n      ']);
        ac(bel2, ['\n      ', bel1, '\n    ']);
        ac(bel3, ['\n    ', bel2, '\n  ']);
        return bel3;
    }(t.url, Title(t), t.id);
};
},{"/Users/hbrls/github/hbrls.github.io/node_modules/yo-yoify/lib/appendChild.js":18,"choo/html":1}],20:[function(require,module,exports){
var choo = require('choo');
var store = require('./store.js');
var view = require('./view.js');
var app = choo({
    history: false,
    hash: true
});
app.use(store);
app.route('*', view);
app.mount('.js-app');
},{"./store.js":21,"./view.js":22,"choo":2}],21:[function(require,module,exports){
module.exports = function (state, bus) {
    state.categories = [];
    state.active = null;
    state.tiles = [];
    bus.on('CHANGE_CATEGORY', function (active) {
        state.active = active;
        state.tiles = state._data[state.active];
        bus.emit('render');
    });
    bus.on('DOMContentLoaded', function (...args) {
        fetch('/static/js/public.json').then(function (resp) {
            return resp.json();
        }).then(function (data) {
            state.categories = Object.keys(data);
            state.active = state.categories[0];
            state.tiles = data[state.active];
            state._data = data;
            bus.emit('render');
        });
    });
};
},{}],22:[function(require,module,exports){
var choo = require('choo');
var html = require('choo/html');
var Tile = require('./Tile.js');
var Category = function (props, emit) {
    return function () {
        var ac = require('/Users/hbrls/github/hbrls.github.io/node_modules/yo-yoify/lib/appendChild.js');
        var bel1 = document.createElement('li');
        bel1.setAttribute('class', arguments[2]);
        var bel0 = document.createElement('a');
        bel0['onclick'] = arguments[0];
        ac(bel0, [arguments[1]]);
        ac(bel1, ['\n    ', bel0, '\n  ']);
        return bel1;
    }(function () {
        return emit('CHANGE_CATEGORY', props.id);
    }, props.id, props.active ? 'active' : '');
};
module.exports = function (state, emit) {
    return function () {
        var ac = require('/Users/hbrls/github/hbrls.github.io/node_modules/yo-yoify/lib/appendChild.js');
        var bel7 = document.createElement('div');
        bel7.setAttribute('class', 'container js-app');
        var bel6 = document.createElement('div');
        bel6.setAttribute('class', 'row');
        var bel3 = document.createElement('div');
        bel3.setAttribute('class', 'col-md-2 Menu');
        var bel2 = document.createElement('ul');
        bel2.setAttribute('class', 'nav nav-pills nav-stacked');
        var bel1 = document.createElement('li');
        bel1.setAttribute('class', 'disabled');
        var bel0 = document.createElement('a');
        ac(bel0, ['CATEGORIES']);
        ac(bel1, [bel0]);
        ac(bel2, ['\n          ', bel1, '\n          ', arguments[0], '\n        ']);
        ac(bel3, ['\n        ', bel2, '\n      ']);
        var bel5 = document.createElement('div');
        bel5.setAttribute('class', 'col-md-10');
        var bel4 = document.createElement('div');
        bel4.setAttribute('class', 'row TileGroup');
        ac(bel4, ['\n          ', arguments[1], '\n        ']);
        ac(bel5, ['\n        ', bel4, '\n      ']);
        ac(bel6, ['\n      ', bel3, '\n      ', bel5, '\n    ']);
        ac(bel7, ['\n    ', bel6, '\n  ']);
        return bel7;
    }(state.categories.map(function (c) {
        return Category({
            id: c,
            active: state.active === c
        }, emit);
    }), state.tiles.map(function (t) {
        return Tile(t);
    }));
};
},{"./Tile.js":19,"/Users/hbrls/github/hbrls.github.io/node_modules/yo-yoify/lib/appendChild.js":18,"choo":2,"choo/html":1}]},{},[20]);
