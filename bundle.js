(function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}return e})()({1:[function(require,module,exports){
/*!
 * Cross-Browser Split 1.1.1
 * Copyright 2007-2012 Steven Levithan <stevenlevithan.com>
 * Available under the MIT License
 * ECMAScript compliant, uniform cross-browser split method
 */

/**
 * Splits a string into an array of strings using a regex or string separator. Matches of the
 * separator are not included in the result array. However, if `separator` is a regex that contains
 * capturing groups, backreferences are spliced into the result each time `separator` is matched.
 * Fixes browser bugs compared to the native `String.prototype.split` and can be used reliably
 * cross-browser.
 * @param {String} str String to split.
 * @param {RegExp|String} separator Regex or string to use for separating the string.
 * @param {Number} [limit] Maximum number of items to include in the result array.
 * @returns {Array} Array of substrings.
 * @example
 *
 * // Basic use
 * split('a b c d', ' ');
 * // -> ['a', 'b', 'c', 'd']
 *
 * // With limit
 * split('a b c d', ' ', 2);
 * // -> ['a', 'b']
 *
 * // Backreferences in result array
 * split('..word1 word2..', /([a-z]+)(\d+)/i);
 * // -> ['..', 'word', '1', ' ', 'word', '2', '..']
 */
module.exports = (function split(undef) {

  var nativeSplit = String.prototype.split,
    compliantExecNpcg = /()??/.exec("")[1] === undef,
    // NPCG: nonparticipating capturing group
    self;

  self = function(str, separator, limit) {
    // If `separator` is not a regex, use `nativeSplit`
    if (Object.prototype.toString.call(separator) !== "[object RegExp]") {
      return nativeSplit.call(str, separator, limit);
    }
    var output = [],
      flags = (separator.ignoreCase ? "i" : "") + (separator.multiline ? "m" : "") + (separator.extended ? "x" : "") + // Proposed for ES6
      (separator.sticky ? "y" : ""),
      // Firefox 3+
      lastLastIndex = 0,
      // Make `global` and avoid `lastIndex` issues by working with a copy
      separator = new RegExp(separator.source, flags + "g"),
      separator2, match, lastIndex, lastLength;
    str += ""; // Type-convert
    if (!compliantExecNpcg) {
      // Doesn't need flags gy, but they don't hurt
      separator2 = new RegExp("^" + separator.source + "$(?!\\s)", flags);
    }
    /* Values for `limit`, per the spec:
     * If undefined: 4294967295 // Math.pow(2, 32) - 1
     * If 0, Infinity, or NaN: 0
     * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
     * If negative number: 4294967296 - Math.floor(Math.abs(limit))
     * If other: Type-convert, then use the above rules
     */
    limit = limit === undef ? -1 >>> 0 : // Math.pow(2, 32) - 1
    limit >>> 0; // ToUint32(limit)
    while (match = separator.exec(str)) {
      // `separator.lastIndex` is not reliable cross-browser
      lastIndex = match.index + match[0].length;
      if (lastIndex > lastLastIndex) {
        output.push(str.slice(lastLastIndex, match.index));
        // Fix browsers whose `exec` methods don't consistently return `undefined` for
        // nonparticipating capturing groups
        if (!compliantExecNpcg && match.length > 1) {
          match[0].replace(separator2, function() {
            for (var i = 1; i < arguments.length - 2; i++) {
              if (arguments[i] === undef) {
                match[i] = undef;
              }
            }
          });
        }
        if (match.length > 1 && match.index < str.length) {
          Array.prototype.push.apply(output, match.slice(1));
        }
        lastLength = match[0].length;
        lastLastIndex = lastIndex;
        if (output.length >= limit) {
          break;
        }
      }
      if (separator.lastIndex === match.index) {
        separator.lastIndex++; // Avoid an infinite loop
      }
    }
    if (lastLastIndex === str.length) {
      if (lastLength || !separator.test("")) {
        output.push("");
      }
    } else {
      output.push(str.slice(lastLastIndex));
    }
    return output.length > limit ? output.slice(0, limit) : output;
  };

  return self;
})();

},{}],2:[function(require,module,exports){
'use strict';

var OneVersionConstraint = require('individual/one-version');

var MY_VERSION = '7';
OneVersionConstraint('ev-store', MY_VERSION);

var hashKey = '__EV_STORE_KEY@' + MY_VERSION;

module.exports = EvStore;

function EvStore(elem) {
    var hash = elem[hashKey];

    if (!hash) {
        hash = elem[hashKey] = {};
    }

    return hash;
}

},{"individual/one-version":5}],3:[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

var doccy;

if (typeof document !== 'undefined') {
    doccy = document;
} else {
    doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }
}

module.exports = doccy;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":35}],4:[function(require,module,exports){
(function (global){
'use strict';

/*global window, global*/

var root = typeof window !== 'undefined' ?
    window : typeof global !== 'undefined' ?
    global : {};

module.exports = Individual;

function Individual(key, value) {
    if (key in root) {
        return root[key];
    }

    root[key] = value;

    return value;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],5:[function(require,module,exports){
'use strict';

var Individual = require('./index.js');

module.exports = OneVersion;

function OneVersion(moduleName, version, defaultValue) {
    var key = '__INDIVIDUAL_ONE_VERSION_' + moduleName;
    var enforceKey = key + '_ENFORCE_SINGLETON';

    var versionValue = Individual(enforceKey, version);

    if (versionValue !== version) {
        throw new Error('Can only have one copy of ' +
            moduleName + '.\n' +
            'You already have version ' + versionValue +
            ' installed.\n' +
            'This means you cannot install version ' + version);
    }

    return Individual(key, defaultValue);
}

},{"./index.js":4}],6:[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],7:[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":12}],8:[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":32}],9:[function(require,module,exports){
var h = require("./virtual-hyperscript/index.js")

module.exports = h

},{"./virtual-hyperscript/index.js":19}],10:[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":15}],11:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":23,"is-object":6}],12:[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":21,"../vnode/is-vnode.js":24,"../vnode/is-vtext.js":25,"../vnode/is-widget.js":26,"./apply-properties":11,"global/document":3}],13:[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],14:[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":26,"../vnode/vpatch.js":29,"./apply-properties":11,"./update-widget":16}],15:[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":12,"./dom-index":13,"./patch-op":14,"global/document":3,"x-is-array":33}],16:[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":26}],17:[function(require,module,exports){
'use strict';

var EvStore = require('ev-store');

module.exports = EvHook;

function EvHook(value) {
    if (!(this instanceof EvHook)) {
        return new EvHook(value);
    }

    this.value = value;
}

EvHook.prototype.hook = function (node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = this.value;
};

EvHook.prototype.unhook = function(node, propertyName) {
    var es = EvStore(node);
    var propName = propertyName.substr(3);

    es[propName] = undefined;
};

},{"ev-store":2}],18:[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],19:[function(require,module,exports){
'use strict';

var isArray = require('x-is-array');

var VNode = require('../vnode/vnode.js');
var VText = require('../vnode/vtext.js');
var isVNode = require('../vnode/is-vnode');
var isVText = require('../vnode/is-vtext');
var isWidget = require('../vnode/is-widget');
var isHook = require('../vnode/is-vhook');
var isVThunk = require('../vnode/is-thunk');

var parseTag = require('./parse-tag.js');
var softSetHook = require('./hooks/soft-set-hook.js');
var evHook = require('./hooks/ev-hook.js');

module.exports = h;

function h(tagName, properties, children) {
    var childNodes = [];
    var tag, props, key, namespace;

    if (!children && isChildren(properties)) {
        children = properties;
        props = {};
    }

    props = props || properties || {};
    tag = parseTag(tagName, props);

    // support keys
    if (props.hasOwnProperty('key')) {
        key = props.key;
        props.key = undefined;
    }

    // support namespace
    if (props.hasOwnProperty('namespace')) {
        namespace = props.namespace;
        props.namespace = undefined;
    }

    // fix cursor bug
    if (tag === 'INPUT' &&
        !namespace &&
        props.hasOwnProperty('value') &&
        props.value !== undefined &&
        !isHook(props.value)
    ) {
        props.value = softSetHook(props.value);
    }

    transformProperties(props);

    if (children !== undefined && children !== null) {
        addChild(children, childNodes, tag, props);
    }


    return new VNode(tag, props, childNodes, key, namespace);
}

function addChild(c, childNodes, tag, props) {
    if (typeof c === 'string') {
        childNodes.push(new VText(c));
    } else if (typeof c === 'number') {
        childNodes.push(new VText(String(c)));
    } else if (isChild(c)) {
        childNodes.push(c);
    } else if (isArray(c)) {
        for (var i = 0; i < c.length; i++) {
            addChild(c[i], childNodes, tag, props);
        }
    } else if (c === null || c === undefined) {
        return;
    } else {
        throw UnexpectedVirtualElement({
            foreignObject: c,
            parentVnode: {
                tagName: tag,
                properties: props
            }
        });
    }
}

function transformProperties(props) {
    for (var propName in props) {
        if (props.hasOwnProperty(propName)) {
            var value = props[propName];

            if (isHook(value)) {
                continue;
            }

            if (propName.substr(0, 3) === 'ev-') {
                // add ev-foo support
                props[propName] = evHook(value);
            }
        }
    }
}

function isChild(x) {
    return isVNode(x) || isVText(x) || isWidget(x) || isVThunk(x);
}

function isChildren(x) {
    return typeof x === 'string' || isArray(x) || isChild(x);
}

function UnexpectedVirtualElement(data) {
    var err = new Error();

    err.type = 'virtual-hyperscript.unexpected.virtual-element';
    err.message = 'Unexpected virtual child passed to h().\n' +
        'Expected a VNode / Vthunk / VWidget / string but:\n' +
        'got:\n' +
        errorString(data.foreignObject) +
        '.\n' +
        'The parent vnode is:\n' +
        errorString(data.parentVnode)
        '\n' +
        'Suggested fix: change your `h(..., [ ... ])` callsite.';
    err.foreignObject = data.foreignObject;
    err.parentVnode = data.parentVnode;

    return err;
}

function errorString(obj) {
    try {
        return JSON.stringify(obj, null, '    ');
    } catch (e) {
        return String(obj);
    }
}

},{"../vnode/is-thunk":22,"../vnode/is-vhook":23,"../vnode/is-vnode":24,"../vnode/is-vtext":25,"../vnode/is-widget":26,"../vnode/vnode.js":28,"../vnode/vtext.js":30,"./hooks/ev-hook.js":17,"./hooks/soft-set-hook.js":18,"./parse-tag.js":20,"x-is-array":33}],20:[function(require,module,exports){
'use strict';

var split = require('browser-split');

var classIdSplit = /([\.#]?[a-zA-Z0-9\u007F-\uFFFF_:-]+)/;
var notClassId = /^\.|#/;

module.exports = parseTag;

function parseTag(tag, props) {
    if (!tag) {
        return 'DIV';
    }

    var noId = !(props.hasOwnProperty('id'));

    var tagParts = split(tag, classIdSplit);
    var tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'DIV';
    }

    var classes, part, type, i;

    for (i = 0; i < tagParts.length; i++) {
        part = tagParts[i];

        if (!part) {
            continue;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    }

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toUpperCase();
}

},{"browser-split":1}],21:[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":22,"./is-vnode":24,"./is-vtext":25,"./is-widget":26}],22:[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],23:[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],24:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":27}],25:[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":27}],26:[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],27:[function(require,module,exports){
module.exports = "2"

},{}],28:[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":22,"./is-vhook":23,"./is-vnode":24,"./is-widget":26,"./version":27}],29:[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":27}],30:[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":27}],31:[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":23,"is-object":6}],32:[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":21,"../vnode/is-thunk":22,"../vnode/is-vnode":24,"../vnode/is-vtext":25,"../vnode/is-widget":26,"../vnode/vpatch":29,"./diff-props":31,"x-is-array":33}],33:[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],34:[function(require,module,exports){
// Generated by purs bundle 0.11.7
var PS = {};
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Semigroupoid = function (compose) {
      this.compose = compose;
  };
  var semigroupoidFn = new Semigroupoid(function (f) {
      return function (g) {
          return function (x) {
              return f(g(x));
          };
      };
  });
  var compose = function (dict) {
      return dict.compose;
  };
  exports["compose"] = compose;
  exports["Semigroupoid"] = Semigroupoid;
  exports["semigroupoidFn"] = semigroupoidFn;
})(PS["Control.Semigroupoid"] = PS["Control.Semigroupoid"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Semigroupoid = PS["Control.Semigroupoid"];        
  var Category = function (Semigroupoid0, id) {
      this.Semigroupoid0 = Semigroupoid0;
      this.id = id;
  };
  var id = function (dict) {
      return dict.id;
  };
  var categoryFn = new Category(function () {
      return Control_Semigroupoid.semigroupoidFn;
  }, function (x) {
      return x;
  });
  exports["Category"] = Category;
  exports["id"] = id;
  exports["categoryFn"] = categoryFn;
})(PS["Control.Category"] = PS["Control.Category"] || {});
(function(exports) {
    "use strict";

  exports.arrayMap = function (f) {
    return function (arr) {
      var l = arr.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(arr[i]);
      }
      return result;
    };
  };
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Functor"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Function = PS["Data.Function"];
  var Data_Unit = PS["Data.Unit"];        
  var Functor = function (map) {
      this.map = map;
  };
  var map = function (dict) {
      return dict.map;
  };                                                                                             
  var functorArray = new Functor($foreign.arrayMap);
  exports["Functor"] = Functor;
  exports["map"] = map;
  exports["functorArray"] = functorArray;
})(PS["Data.Functor"] = PS["Data.Functor"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];        
  var Apply = function (Functor0, apply) {
      this.Functor0 = Functor0;
      this.apply = apply;
  };                      
  var apply = function (dict) {
      return dict.apply;
  };
  exports["Apply"] = Apply;
  exports["apply"] = apply;
})(PS["Control.Apply"] = PS["Control.Apply"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Apply = PS["Control.Apply"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Applicative = function (Apply0, pure) {
      this.Apply0 = Apply0;
      this.pure = pure;
  };
  var pure = function (dict) {
      return dict.pure;
  };
  var liftA1 = function (dictApplicative) {
      return function (f) {
          return function (a) {
              return Control_Apply.apply(dictApplicative.Apply0())(pure(dictApplicative)(f))(a);
          };
      };
  };
  exports["Applicative"] = Applicative;
  exports["pure"] = pure;
  exports["liftA1"] = liftA1;
})(PS["Control.Applicative"] = PS["Control.Applicative"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Bind"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Bind = function (Apply0, bind) {
      this.Apply0 = Apply0;
      this.bind = bind;
  };                     
  var bind = function (dict) {
      return dict.bind;
  };
  exports["Bind"] = Bind;
  exports["bind"] = bind;
})(PS["Control.Bind"] = PS["Control.Bind"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var Monad = function (Applicative0, Bind1) {
      this.Applicative0 = Applicative0;
      this.Bind1 = Bind1;
  };
  var ap = function (dictMonad) {
      return function (f) {
          return function (a) {
              return Control_Bind.bind(dictMonad.Bind1())(f)(function (v) {
                  return Control_Bind.bind(dictMonad.Bind1())(a)(function (v1) {
                      return Control_Applicative.pure(dictMonad.Applicative0())(v(v1));
                  });
              });
          };
      };
  };
  exports["Monad"] = Monad;
  exports["ap"] = ap;
})(PS["Control.Monad"] = PS["Control.Monad"] || {});
(function(exports) {
    "use strict";

  exports.pureE = function (a) {
    return function () {
      return a;
    };
  };

  exports.bindE = function (a) {
    return function (f) {
      return function () {
        return f(a())();
      };
    };
  };
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.Eff"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad = PS["Control.Monad"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Unit = PS["Data.Unit"];        
  var monadEff = new Control_Monad.Monad(function () {
      return applicativeEff;
  }, function () {
      return bindEff;
  });
  var bindEff = new Control_Bind.Bind(function () {
      return applyEff;
  }, $foreign.bindE);
  var applyEff = new Control_Apply.Apply(function () {
      return functorEff;
  }, Control_Monad.ap(monadEff));
  var applicativeEff = new Control_Applicative.Applicative(function () {
      return applyEff;
  }, $foreign.pureE);
  var functorEff = new Data_Functor.Functor(Control_Applicative.liftA1(applicativeEff));
  exports["functorEff"] = functorEff;
  exports["applyEff"] = applyEff;
  exports["applicativeEff"] = applicativeEff;
  exports["bindEff"] = bindEff;
  exports["monadEff"] = monadEff;
})(PS["Control.Monad.Eff"] = PS["Control.Monad.Eff"] || {});
(function(exports) {
    "use strict";

  exports.newSTRef = function (val) {
    return function () {
      return { value: val };
    };
  };

  exports.readSTRef = function (ref) {
    return function () {
      return ref.value;
    };
  };

  exports.writeSTRef = function (ref) {
    return function (a) {
      return function () {
        return ref.value = a; // eslint-disable-line no-return-assign
      };
    };
  };
})(PS["Control.Monad.ST"] = PS["Control.Monad.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Control.Monad.ST"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  exports["newSTRef"] = $foreign.newSTRef;
  exports["readSTRef"] = $foreign.readSTRef;
  exports["writeSTRef"] = $foreign.writeSTRef;
})(PS["Control.Monad.ST"] = PS["Control.Monad.ST"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Eq"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Eq = function (eq) {
      this.eq = eq;
  };
  var eq = function (dict) {
      return dict.eq;
  };
  exports["Eq"] = Eq;
  exports["eq"] = eq;
})(PS["Data.Eq"] = PS["Data.Eq"] || {});
(function(exports) {
    "use strict";

  exports.foldrArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = len - 1; i >= 0; i--) {
          acc = f(xs[i])(acc);
        }
        return acc;
      };
    };
  };

  exports.foldlArray = function (f) {
    return function (init) {
      return function (xs) {
        var acc = init;
        var len = xs.length;
        for (var i = 0; i < len; i++) {
          acc = f(acc)(xs[i]);
        }
        return acc;
      };
    };
  };
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
    "use strict";

  exports.concatString = function (s1) {
    return function (s2) {
      return s1 + s2;
    };
  };
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Data_Void = PS["Data.Void"];        
  var Semigroup = function (append) {
      this.append = append;
  }; 
  var semigroupString = new Semigroup($foreign.concatString);
  var append = function (dict) {
      return dict.append;
  };
  exports["Semigroup"] = Semigroup;
  exports["append"] = append;
  exports["semigroupString"] = semigroupString;
})(PS["Data.Semigroup"] = PS["Data.Semigroup"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Data_Boolean = PS["Data.Boolean"];
  var Data_Eq = PS["Data.Eq"];
  var Data_EuclideanRing = PS["Data.EuclideanRing"];
  var Data_Function = PS["Data.Function"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Monoid = function (Semigroup0, mempty) {
      this.Semigroup0 = Semigroup0;
      this.mempty = mempty;
  };                 
  var monoidString = new Monoid(function () {
      return Data_Semigroup.semigroupString;
  }, "");  
  var mempty = function (dict) {
      return dict.mempty;
  };
  exports["Monoid"] = Monoid;
  exports["mempty"] = mempty;
  exports["monoidString"] = monoidString;
})(PS["Data.Monoid"] = PS["Data.Monoid"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Alt = PS["Control.Alt"];
  var Control_Alternative = PS["Control.Alternative"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Extend = PS["Control.Extend"];
  var Control_Monad = PS["Control.Monad"];
  var Control_MonadZero = PS["Control.MonadZero"];
  var Control_Plus = PS["Control.Plus"];
  var Data_Bounded = PS["Data.Bounded"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Functor_Invariant = PS["Data.Functor.Invariant"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Show = PS["Data.Show"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Nothing = (function () {
      function Nothing() {

      };
      Nothing.value = new Nothing();
      return Nothing;
  })();
  var Just = (function () {
      function Just(value0) {
          this.value0 = value0;
      };
      Just.create = function (value0) {
          return new Just(value0);
      };
      return Just;
  })();
  var fromJust = function (dictPartial) {
      return function (v) {
          var $__unused = function (dictPartial1) {
              return function ($dollar34) {
                  return $dollar34;
              };
          };
          return $__unused(dictPartial)((function () {
              if (v instanceof Just) {
                  return v.value0;
              };
              throw new Error("Failed pattern match at Data.Maybe line 270, column 1 - line 270, column 46: " + [ v.constructor.name ]);
          })());
      };
  };
  exports["Nothing"] = Nothing;
  exports["Just"] = Just;
  exports["fromJust"] = fromJust;
})(PS["Data.Maybe"] = PS["Data.Maybe"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Foldable"];
  var Control_Alt = PS["Control.Alt"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Category = PS["Control.Category"];
  var Control_Plus = PS["Control.Plus"];
  var Control_Semigroupoid = PS["Control.Semigroupoid"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_HeytingAlgebra = PS["Data.HeytingAlgebra"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Endo = PS["Data.Monoid.Endo"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Newtype = PS["Data.Newtype"];
  var Data_Ord = PS["Data.Ord"];
  var Data_Ordering = PS["Data.Ordering"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Semiring = PS["Data.Semiring"];
  var Data_Unit = PS["Data.Unit"];
  var Prelude = PS["Prelude"];        
  var Foldable = function (foldMap, foldl, foldr) {
      this.foldMap = foldMap;
      this.foldl = foldl;
      this.foldr = foldr;
  };
  var foldr = function (dict) {
      return dict.foldr;
  };
  var foldl = function (dict) {
      return dict.foldl;
  };
  var intercalate = function (dictFoldable) {
      return function (dictMonoid) {
          return function (sep) {
              return function (xs) {
                  var go = function (v) {
                      return function (x) {
                          if (v.init) {
                              return {
                                  init: false,
                                  acc: x
                              };
                          };
                          return {
                              init: false,
                              acc: Data_Semigroup.append(dictMonoid.Semigroup0())(v.acc)(Data_Semigroup.append(dictMonoid.Semigroup0())(sep)(x))
                          };
                      };
                  };
                  return (foldl(dictFoldable)(go)({
                      init: true,
                      acc: Data_Monoid.mempty(dictMonoid)
                  })(xs)).acc;
              };
          };
      };
  }; 
  var foldMapDefaultR = function (dictFoldable) {
      return function (dictMonoid) {
          return function (f) {
              return foldr(dictFoldable)(function (x) {
                  return function (acc) {
                      return Data_Semigroup.append(dictMonoid.Semigroup0())(f(x))(acc);
                  };
              })(Data_Monoid.mempty(dictMonoid));
          };
      };
  };
  var foldableArray = new Foldable(function (dictMonoid) {
      return foldMapDefaultR(foldableArray)(dictMonoid);
  }, $foreign.foldlArray, $foreign.foldrArray);
  var foldMap = function (dict) {
      return dict.foldMap;
  };
  var find = function (dictFoldable) {
      return function (p) {
          var go = function (v) {
              return function (v1) {
                  if (v instanceof Data_Maybe.Nothing && p(v1)) {
                      return new Data_Maybe.Just(v1);
                  };
                  return v;
              };
          };
          return foldl(dictFoldable)(go)(Data_Maybe.Nothing.value);
      };
  };
  exports["Foldable"] = Foldable;
  exports["foldr"] = foldr;
  exports["foldl"] = foldl;
  exports["foldMap"] = foldMap;
  exports["foldMapDefaultR"] = foldMapDefaultR;
  exports["intercalate"] = intercalate;
  exports["find"] = find;
  exports["foldableArray"] = foldableArray;
})(PS["Data.Foldable"] = PS["Data.Foldable"] || {});
(function(exports) {
    "use strict";

  exports.runFn3 = function (fn) {
    return function (a) {
      return function (b) {
        return function (c) {
          return fn(a, b, c);
        };
      };
    };
  };
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Function.Uncurried"];
  var Data_Unit = PS["Data.Unit"];        
  var runFn1 = function (f) {
      return f;
  };
  exports["runFn1"] = runFn1;
  exports["runFn3"] = $foreign.runFn3;
})(PS["Data.Function.Uncurried"] = PS["Data.Function.Uncurried"] || {});
(function(exports) {
    "use strict";

  // jshint maxparams: 3

  exports.traverseArrayImpl = function () {
    function Cont(fn) {
      this.fn = fn;
    }

    var emptyList = {};

    var ConsCell = function (head, tail) {
      this.head = head;
      this.tail = tail;
    };

    function consList(x) {
      return function (xs) {
        return new ConsCell(x, xs);
      };
    }

    function listToArray(list) {
      var arr = [];
      var xs = list;
      while (xs !== emptyList) {
        arr.push(xs.head);
        xs = xs.tail;
      }
      return arr;
    }

    return function (apply) {
      return function (map) {
        return function (pure) {
          return function (f) {
            var buildFrom = function (x, ys) {
              return apply(map(consList)(f(x)))(ys);
            };

            var go = function (acc, currentLen, xs) {
              if (currentLen === 0) {
                return acc;
              } else {
                var last = xs[currentLen - 1];
                return new Cont(function () {
                  return go(buildFrom(last, acc), currentLen - 1, xs);
                });
              }
            };

            return function (array) {
              var result = go(pure(emptyList), array.length, array);
              while (result instanceof Cont) {
                result = result.fn();
              }

              return map(listToArray)(result);
            };
          };
        };
      };
    };
  }();
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Data.Traversable"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Apply = PS["Control.Apply"];
  var Control_Category = PS["Control.Category"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Maybe_First = PS["Data.Maybe.First"];
  var Data_Maybe_Last = PS["Data.Maybe.Last"];
  var Data_Monoid_Additive = PS["Data.Monoid.Additive"];
  var Data_Monoid_Conj = PS["Data.Monoid.Conj"];
  var Data_Monoid_Disj = PS["Data.Monoid.Disj"];
  var Data_Monoid_Dual = PS["Data.Monoid.Dual"];
  var Data_Monoid_Multiplicative = PS["Data.Monoid.Multiplicative"];
  var Data_Traversable_Accum = PS["Data.Traversable.Accum"];
  var Data_Traversable_Accum_Internal = PS["Data.Traversable.Accum.Internal"];
  var Prelude = PS["Prelude"];        
  var Traversable = function (Foldable1, Functor0, sequence, traverse) {
      this.Foldable1 = Foldable1;
      this.Functor0 = Functor0;
      this.sequence = sequence;
      this.traverse = traverse;
  };
  var traverse = function (dict) {
      return dict.traverse;
  }; 
  var sequenceDefault = function (dictTraversable) {
      return function (dictApplicative) {
          return traverse(dictTraversable)(dictApplicative)(Control_Category.id(Control_Category.categoryFn));
      };
  };
  var traversableArray = new Traversable(function () {
      return Data_Foldable.foldableArray;
  }, function () {
      return Data_Functor.functorArray;
  }, function (dictApplicative) {
      return sequenceDefault(traversableArray)(dictApplicative);
  }, function (dictApplicative) {
      return $foreign.traverseArrayImpl(Control_Apply.apply(dictApplicative.Apply0()))(Data_Functor.map((dictApplicative.Apply0()).Functor0()))(Control_Applicative.pure(dictApplicative));
  });
  var sequence = function (dict) {
      return dict.sequence;
  };
  exports["Traversable"] = Traversable;
  exports["traverse"] = traverse;
  exports["sequence"] = sequence;
  exports["sequenceDefault"] = sequenceDefault;
  exports["traversableArray"] = traversableArray;
})(PS["Data.Traversable"] = PS["Data.Traversable"] || {});
(function(exports) {var images = [{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20171222_104055.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20171222_104055.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20180224_123059.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20180224_123059.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20171217_120033.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20171217_120033.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20171209_161021.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20171209_161021.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20171125_143024.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20171125_143024.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170923_142431.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170923_142431.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20171014_193130.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20171014_193130.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170820_135901.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170820_135901.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170902_225554.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170902_225554.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170818_173619.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170818_173619.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170818_180735.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170818_180735.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170818_170709.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170818_170709.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170811_163023.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170811_163023.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170811_154551.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170811_154551.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170811_163244.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170811_163244.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170811_123751.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170811_123751.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170811_154145.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170811_154145.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170811_114022.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170811_114022.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170708_081338.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170708_081338.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-14_13.05.04.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-14_13.05.04.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170729_190002.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170729_190002.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-03-16_14.26.38.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-03-16_14.26.38.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/IMG_20170808_165344.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/IMG_20170808_165344.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-14_11.02.47.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-14_11.02.47.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-03-17_14.44.00.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-03-17_14.44.00.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-03-16_15.58.58.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-03-16_15.58.58.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-11_13.24.19.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-11_13.24.19.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-13_16.57.05.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-13_16.57.05.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-13_16.55.59.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-13_16.55.59.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-12_13.51.16-2.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-12_13.51.16-2.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-12_16.51.31.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-12_16.51.31.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-11_10.10.12.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-11_10.10.12.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-11_11.26.05.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-11_11.26.05.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2016-07-18_09.21.52.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2016-07-18_09.21.52.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-11_10.09.48-1.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-11_10.09.48-1.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-10_17.47.30-1.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-10_17.47.30-1.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2016-07-17_15.11.58.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2016-07-17_15.11.58.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2016-07-15_13.50.13.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2016-07-15_13.50.13.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2016-07-17_14.21.44.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2016-07-17_14.21.44.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2017-01-11_09.10.03.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2017-01-11_09.10.03.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2016-07-19_09.52.21.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2016-07-19_09.52.21.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2016-07-18_09.53.36-1.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2016-07-18_09.53.36-1.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2016-07-17_10.27.23.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2016-07-17_10.27.23.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-09-11_12.05.39.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-09-11_12.05.39.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-09-08_11.02.10_HDR-1.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-09-08_11.02.10_HDR-1.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2016-07-17_14.23.06.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2016-07-17_14.23.06.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-09-10_15.01.39.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-09-10_15.01.39.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2016-07-17_09.31.46.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2016-07-17_09.31.46.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2016-07-17_09.06.10.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2016-07-17_09.06.10.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-08-16_11.36.58.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-08-16_11.36.58.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-09-07_15.21.40_HDR.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-09-07_15.21.40_HDR.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-08-15_13.08.13.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-08-15_13.08.13.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-09-07_15.16.08.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-09-07_15.16.08.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-09-09_18.27.02.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-09-09_18.27.02.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-08-16_11.37.36.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-08-16_11.37.36.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-08_17.58.47.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-08_17.58.47.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-08_17.56.40.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-08_17.56.40.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-08-31_21.01.40-2.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-08-31_21.01.40-2.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-08_14.48.05.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-08_14.48.05.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-08_14.47.55.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-08_14.47.55.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-08_14.46.33.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-08_14.46.33.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-08_13.50.33.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-08_13.50.33.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_21.31.56.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_21.31.56.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_21.19.25.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_21.19.25.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-08_11.15.39.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-08_11.15.39.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-07_14.45.38.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-07_14.45.38.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_22.01.17_HDR-2.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_22.01.17_HDR-2.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-07_14.41.24.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-07_14.41.24.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_20.58.51.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_20.58.51.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_17.29.01.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_17.29.01.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_15.17.21.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_15.17.21.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_13.18.53_HDR-1.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_13.18.53_HDR-1.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_09.39.44.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_09.39.44.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_11.05.04_HDR.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_11.05.04_HDR.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_14.54.19-1.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_14.54.19-1.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_09.39.34.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_09.39.34.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-06_09.39.32.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-06_09.39.32.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-03_15.14.46.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-03_15.14.46.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-05_22.07.45.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-05_22.07.45.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-04_21.42.25.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-04_21.42.25.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-05_15.55.26.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-05_15.55.26.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-03_08.35.24.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-03_08.35.24.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-05-16_14.43.24.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-05-16_14.43.24.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-05-25_19.23.08.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-05-25_19.23.08.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-06-22_22.56.33.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-06-22_22.56.33.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-07-02_21.07.31-2.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-07-02_21.07.31-2.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-04-28_22.08.13.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-04-28_22.08.13.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-02-08_11.47.49.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-02-08_11.47.49.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-02-08_11.27.30.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-02-08_11.27.30.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-03-21_17.13.21-1.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-03-21_17.13.21-1.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-04-18_14.18.56.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-04-18_14.18.56.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-12-07_10.32.02.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-12-07_10.32.02.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-03-07_14.29.17.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-03-07_14.29.17.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-02-13_21.03.21.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-02-13_21.03.21.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-02-18_11.38.28.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-02-18_11.38.28.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2015-02-08_14.21.21.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2015-02-08_14.21.21.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-11-29_13.33.38.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-11-29_13.33.38.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-11-28_14.36.52.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-11-28_14.36.52.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-11-30_07.51.15.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-11-30_07.51.15.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-11-27_18.22.42.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-11-27_18.22.42.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-09-06_17.15.51.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-09-06_17.15.51.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-09-05_17.22.59.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-09-05_17.22.59.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-11-29_11.57.38_HDR.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-11-29_11.57.38_HDR.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-09-29_15.48.56.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-09-29_15.48.56.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-11-27_13.50.03.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-11-27_13.50.03.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-09-06_10.40.37.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-09-06_10.40.37.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-11-27_10.45.15.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-11-27_10.45.15.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-09-06_17.15.22_HDR.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-09-06_17.15.22_HDR.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-08-31_15.15.23.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-08-31_15.15.23.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-09-05_15.51.20_HDR.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-09-05_15.51.20_HDR.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-08-03_20.56.32.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-08-03_20.56.32.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-09-05_17.23.19_HDR.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-09-05_17.23.19_HDR.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-09-05_17.19.33.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-09-05_17.19.33.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-08-03_18.04.38_HDR.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-08-03_18.04.38_HDR.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-08-03_17.03.38.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-08-03_17.03.38.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-08-03_17.04.08.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-08-03_17.04.08.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-08-03_20.57.22.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-08-03_20.57.22.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-02-22_15.53.40.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-02-22_15.53.40.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2013-09-08_12.05.20.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2013-09-08_12.05.20.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2013-12-01_13.32.25.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2013-12-01_13.32.25.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-08-03_13.21.37.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-08-03_13.21.37.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-02-22_15.30.25.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-02-22_15.30.25.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2013-09-07_17.59.00.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2013-09-07_17.59.00.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2013-11-16_12.42.10.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2013-11-16_12.42.10.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2014-08-03_13.41.02.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2014-08-03_13.41.02.jpg"
  },{
    large_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_1000/2013-11-16_12.13.26.jpg",
    small_url: "http://res.cloudinary.com/dtyah5b0g/image/upload/w_200/2013-11-16_12.13.26.jpg"
  }];

  exports.getImages = function(ctor) {
    return images.map(ctor);
  };
})(PS["Main"] = PS["Main"] || {});
(function(exports) {exports.finalizeRootNode = function(eff) {
    return eff;
  };
})(PS["Oak"] = PS["Oak"] || {});
(function(exports) {exports.getElementByIdImpl = function(id) {
    return function() {
      var container = document.getElementById(id);
      if (container == null) {
        throw(new Error("Unable to find element with ID: " + id));
      };

      return container;
    };
  };

  exports.appendChildNodeImpl = function(container) {
    return function(rootNode) {
      return function() {
        container.appendChild(rootNode);
      };
    };
  };
})(PS["Oak.Document"] = PS["Oak.Document"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Oak.Document"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Prelude = PS["Prelude"];        
  var getElementById = Data_Function_Uncurried.runFn1($foreign.getElementByIdImpl);
  var appendChildNode = function (element) {
      return function (rootNode) {
          return $foreign.appendChildNodeImpl(element)(rootNode);
      };
  };
  exports["appendChildNode"] = appendChildNode;
  exports["getElementById"] = getElementById;
})(PS["Oak.Document"] = PS["Oak.Document"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var StyleAttribute = (function () {
      function StyleAttribute(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      StyleAttribute.create = function (value0) {
          return function (value1) {
              return new StyleAttribute(value0, value1);
          };
      };
      return StyleAttribute;
  })();
  var backgroundSize = function (val) {
      return new StyleAttribute("background-size", val);
  };
  var backgroundPosition = function (val) {
      return new StyleAttribute("background-position", val);
  };
  var backgroundImage = function (val) {
      return new StyleAttribute("background-image", val);
  };
  exports["StyleAttribute"] = StyleAttribute;
  exports["backgroundImage"] = backgroundImage;
  exports["backgroundPosition"] = backgroundPosition;
  exports["backgroundSize"] = backgroundSize;
})(PS["Oak.Css"] = PS["Oak.Css"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Oak_Css = PS["Oak.Css"];        
  var EventHandler = (function () {
      function EventHandler(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      EventHandler.create = function (value0) {
          return function (value1) {
              return new EventHandler(value0, value1);
          };
      };
      return EventHandler;
  })();
  var StringEventHandler = (function () {
      function StringEventHandler(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      StringEventHandler.create = function (value0) {
          return function (value1) {
              return new StringEventHandler(value0, value1);
          };
      };
      return StringEventHandler;
  })();
  var SimpleAttribute = (function () {
      function SimpleAttribute(value0, value1) {
          this.value0 = value0;
          this.value1 = value1;
      };
      SimpleAttribute.create = function (value0) {
          return function (value1) {
              return new SimpleAttribute(value0, value1);
          };
      };
      return SimpleAttribute;
  })();
  var Style = (function () {
      function Style(value0) {
          this.value0 = value0;
      };
      Style.create = function (value0) {
          return new Style(value0);
      };
      return Style;
  })();
  var style = function (attrs) {
      return new Style(attrs);
  };
  var class_ = function (val) {
      return new SimpleAttribute("className", val);
  };
  exports["EventHandler"] = EventHandler;
  exports["StringEventHandler"] = StringEventHandler;
  exports["SimpleAttribute"] = SimpleAttribute;
  exports["Style"] = Style;
  exports["class_"] = class_;
  exports["style"] = style;
})(PS["Oak.Html.Attribute"] = PS["Oak.Html.Attribute"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Category = PS["Control.Category"];
  var Data_Show = PS["Data.Show"];
  var Prelude = PS["Prelude"];        
  var Present = function (present) {
      this.present = present;
  };
  var presentString = new Present(Control_Category.id(Control_Category.categoryFn));
  var present = function (dict) {
      return dict.present;
  };
  exports["present"] = present;
  exports["Present"] = Present;
  exports["presentString"] = presentString;
})(PS["Oak.Html.Present"] = PS["Oak.Html.Present"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Oak_Html_Attribute = PS["Oak.Html.Attribute"];
  var Oak_Html_Present = PS["Oak.Html.Present"];        
  var Text = (function () {
      function Text(value0) {
          this.value0 = value0;
      };
      Text.create = function (value0) {
          return new Text(value0);
      };
      return Text;
  })();
  var Tag = (function () {
      function Tag(value0, value1, value2) {
          this.value0 = value0;
          this.value1 = value1;
          this.value2 = value2;
      };
      Tag.create = function (value0) {
          return function (value1) {
              return function (value2) {
                  return new Tag(value0, value1, value2);
              };
          };
      };
      return Tag;
  })();
  var text = function (dictPresent) {
      return function (val) {
          return new Text(Oak_Html_Present.present(dictPresent)(val));
      };
  };
  var div = function (attrs) {
      return function (children) {
          return new Tag("div", attrs, children);
      };
  };
  exports["Text"] = Text;
  exports["Tag"] = Tag;
  exports["text"] = text;
  exports["div"] = div;
})(PS["Oak.Html"] = PS["Oak.Html"] || {});
(function(exports) {
  var h =require("virtual-dom/h");
  var diff =require("virtual-dom/diff");
  var patch =require("virtual-dom/patch");
  var createElement =require("virtual-dom/create-element"); 

  // foreign import createRootNodeImpl :: ∀ e.
  //   Fn1 Tree (Eff ( createRootNode :: NODE | e ) Node)
  exports.createRootNodeImpl = function(tree) {
    return function() {
      var root = createElement(tree);
      return root;
    };
  };


  // foreign import textImpl :: ∀ e.
  //   Fn1 String (Eff e Tree)
  exports.textImpl = function(str) {
    return function() {
      return str;
    };
  };

  // foreign import renderImpl :: ∀ msg h e model.
  //   Fn3
  //     String
  //     NativeAttrs
  //     ( Eff ( st :: ST h | e ) (Array Tree) )
  //     ( Eff ( st :: ST h | e ) Tree )
  exports.renderImpl = function(tagName, attrs, childrenEff) {
    return function() {
      var children = childrenEff();
      return h(tagName, attrs, children);
    };
  };

  // foreign import patchImpl :: ∀ e h.
  //   Fn3 Tree Tree Node Eff ( st :: ST h | e ) Node
  exports.patchImpl = function(newTree, oldTree, rootNode) {
    return function() {
      var patches = diff(oldTree, newTree);
      var newRoot = patch(rootNode, patches);
      return newRoot;
    };
  };


  // foreign import concatHandlerFunImpl :: ∀ eff event.
  //   Fn3 String (event -> eff) NativeAttrs NativeAttrs
  exports.concatHandlerFunImpl = function(name, msgHandler, rest) {
    var result = Object.assign({}, rest);
    result[name] = msgHandler();
    return result;
  };

  // foreign import concatEventTargetValueHandlerFunImpl :: ∀ eff event.
  //   Fn3 String (event -> eff) NativeAttrs NativeAttrs
  exports.concatEventTargetValueHandlerFunImpl = function(name, msgHandler, rest) {
    var result = Object.assign({}, rest);
    result[name] = function(event) {
      msgHandler(String(event.target.value))();
    };
    return result;
  };


  // foreign import concatSimpleAttrImpl :: ∀ eff event.
  //   Fn3 String String NativeAttrs NativeAttrs
  exports.concatSimpleAttrImpl = function(name, value, rest) {
    var result = Object.assign({}, rest);
    result[name] = value;
    return result;
  };

  // foreign import emptyAttrs :: NativeAttrs
  exports.emptyAttrs = function() {
    return {};
  };
})(PS["Oak.VirtualDom.Native"] = PS["Oak.VirtualDom.Native"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Oak.VirtualDom.Native"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Function_Uncurried = PS["Data.Function.Uncurried"];
  var Oak_Document = PS["Oak.Document"];        
  var text = Data_Function_Uncurried.runFn1($foreign.textImpl);
  var render = Data_Function_Uncurried.runFn3($foreign.renderImpl);
  var patch = Data_Function_Uncurried.runFn3($foreign.patchImpl);
  var createRootNode = Data_Function_Uncurried.runFn1($foreign.createRootNodeImpl);
  var concatSimpleAttr = Data_Function_Uncurried.runFn3($foreign.concatSimpleAttrImpl);
  var concatHandlerFun = Data_Function_Uncurried.runFn3($foreign.concatHandlerFunImpl);
  var concatEventTargetValueHandlerFun = Data_Function_Uncurried.runFn3($foreign.concatEventTargetValueHandlerFunImpl);
  exports["patch"] = patch;
  exports["createRootNode"] = createRootNode;
  exports["concatSimpleAttr"] = concatSimpleAttr;
  exports["concatHandlerFun"] = concatHandlerFun;
  exports["concatEventTargetValueHandlerFun"] = concatEventTargetValueHandlerFun;
  exports["text"] = text;
  exports["render"] = render;
  exports["emptyAttrs"] = $foreign.emptyAttrs;
})(PS["Oak.VirtualDom.Native"] = PS["Oak.VirtualDom.Native"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Function = PS["Data.Function"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Monoid = PS["Data.Monoid"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Traversable = PS["Data.Traversable"];
  var Oak_Css = PS["Oak.Css"];
  var Oak_Document = PS["Oak.Document"];
  var Oak_Html = PS["Oak.Html"];
  var Oak_Html_Attribute = PS["Oak.Html.Attribute"];
  var Oak_VirtualDom_Native = PS["Oak.VirtualDom.Native"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var stringifyStyle = function (v) {
      return v.value0 + (":" + v.value1);
  };
  var stringifyStyles = function (attrs) {
      return Data_Foldable.intercalate(Data_Foldable.foldableArray)(Data_Monoid.monoidString)(";")(Data_Functor.map(Data_Functor.functorArray)(stringifyStyle)(attrs));
  };
  var patch = function (oldTree) {
      return function (newTree) {
          return function (maybeRoot) {
              var root = Data_Maybe.fromJust()(maybeRoot);
              return Oak_VirtualDom_Native.patch(oldTree)(newTree)(root);
          };
      };
  };
  var concatAttr = function (handler) {
      return function (v) {
          return function (attrs) {
              if (v instanceof Oak_Html_Attribute.EventHandler) {
                  return Oak_VirtualDom_Native.concatHandlerFun(v.value0)(function (v1) {
                      return handler(v.value1);
                  })(attrs);
              };
              if (v instanceof Oak_Html_Attribute.StringEventHandler) {
                  return Oak_VirtualDom_Native.concatEventTargetValueHandlerFun(v.value0)(function (e) {
                      return handler(v.value1(e));
                  })(attrs);
              };
              if (v instanceof Oak_Html_Attribute.SimpleAttribute) {
                  return Oak_VirtualDom_Native.concatSimpleAttr(v.value0)(v.value1)(attrs);
              };
              if (v instanceof Oak_Html_Attribute.Style) {
                  return Oak_VirtualDom_Native.concatSimpleAttr("style")(stringifyStyles(v.value0))(attrs);
              };
              throw new Error("Failed pattern match at Oak.VirtualDom line 34, column 1 - line 38, column 21: " + [ handler.constructor.name, v.constructor.name, attrs.constructor.name ]);
          };
      };
  };
  var combineAttrs = function (attrs) {
      return function (handler) {
          return Data_Foldable.foldr(Data_Foldable.foldableArray)(concatAttr(handler))(Oak_VirtualDom_Native.emptyAttrs)(attrs);
      };
  };
  var render = function (h) {
      return function (v) {
          if (v instanceof Oak_Html.Tag) {
              return Oak_VirtualDom_Native.render(v.value0)(combineAttrs(v.value1)(h))(Data_Traversable.sequence(Data_Traversable.traversableArray)(Control_Monad_Eff.applicativeEff)(Data_Functor.map(Data_Functor.functorArray)(render(h))(v.value2)));
          };
          if (v instanceof Oak_Html.Text) {
              return Oak_VirtualDom_Native.text(v.value0);
          };
          throw new Error("Failed pattern match at Oak.VirtualDom line 26, column 1 - line 29, column 37: " + [ h.constructor.name, v.constructor.name ]);
      };
  };
  exports["render"] = render;
  exports["concatAttr"] = concatAttr;
  exports["stringifyStyle"] = stringifyStyle;
  exports["stringifyStyles"] = stringifyStyles;
  exports["combineAttrs"] = combineAttrs;
  exports["patch"] = patch;
})(PS["Oak.VirtualDom"] = PS["Oak.VirtualDom"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Oak"];
  var Control_Applicative = PS["Control.Applicative"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Control_Monad_ST = PS["Control.Monad.ST"];
  var Data_Maybe = PS["Data.Maybe"];
  var Oak_Document = PS["Oak.Document"];
  var Oak_Html = PS["Oak.Html"];
  var Oak_VirtualDom = PS["Oak.VirtualDom"];
  var Oak_VirtualDom_Native = PS["Oak.VirtualDom.Native"];
  var Partial_Unsafe = PS["Partial.Unsafe"];
  var Prelude = PS["Prelude"];        
  var App = (function () {
      function App(value0) {
          this.value0 = value0;
      };
      App.create = function (value0) {
          return new App(value0);
      };
      return App;
  })();
  var handler = function (ref) {
      return function (app) {
          return function (msg) {
              return function __do() {
                  var v = Control_Monad_ST.readSTRef(ref)();
                  var oldTree = Data_Maybe.fromJust()(v.tree);
                  var root = Data_Maybe.fromJust()(v.root);
                  var newModel = app.value0.update(msg)(app.value0.model);
                  var newAttrs = (function () {
                      var $13 = {};
                      for (var $14 in app.value0) {
                          if ({}.hasOwnProperty.call(app.value0, $14)) {
                              $13[$14] = app["value0"][$14];
                          };
                      };
                      $13.model = newModel;
                      return $13;
                  })();
                  var newApp = new App(newAttrs);
                  var v1 = Oak_VirtualDom.render(handler(ref)(newApp))(app.value0.view(newModel))();
                  var v2 = Oak_VirtualDom.patch(v1)(oldTree)(v.root)();
                  var newRuntime = {
                      root: new Data_Maybe.Just(v2),
                      tree: new Data_Maybe.Just(v1)
                  };
                  return Control_Monad_ST.writeSTRef(ref)(newRuntime)();
              };
          };
      };
  };
  var runApp_ = function (v) {
      return function __do() {
          var v1 = Control_Monad_ST.newSTRef({
              tree: Data_Maybe.Nothing.value,
              root: Data_Maybe.Nothing.value
          })();
          var v2 = Oak_VirtualDom.render(handler(v1)(new App(v.value0)))(v.value0.view(v.value0.model))();
          var v3 = $foreign.finalizeRootNode(Oak_VirtualDom_Native.createRootNode(v2))();
          var v4 = Control_Monad_ST.writeSTRef(v1)({
              tree: new Data_Maybe.Just(v2),
              root: new Data_Maybe.Just(v3)
          })();
          return v3;
      };
  };
  var runApp = function (app) {
      return runApp_(app);
  };
  var createApp = function (opts) {
      return new App({
          model: opts.init,
          view: opts.view,
          update: opts.update
      });
  };
  exports["App"] = App;
  exports["createApp"] = createApp;
  exports["handler"] = handler;
  exports["runApp_"] = runApp_;
  exports["runApp"] = runApp;
})(PS["Oak"] = PS["Oak"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var Oak_Html_Attribute = PS["Oak.Html.Attribute"];
  var onClick = function (msg) {
      return new Oak_Html_Attribute.EventHandler("onclick", msg);
  };
  exports["onClick"] = onClick;
})(PS["Oak.Html.Events"] = PS["Oak.Html.Events"] || {});
(function(exports) {
  // Generated by purs version 0.11.7
  "use strict";
  var $foreign = PS["Main"];
  var Control_Bind = PS["Control.Bind"];
  var Control_Monad_Eff = PS["Control.Monad.Eff"];
  var Data_Eq = PS["Data.Eq"];
  var Data_Foldable = PS["Data.Foldable"];
  var Data_Functor = PS["Data.Functor"];
  var Data_Maybe = PS["Data.Maybe"];
  var Data_Semigroup = PS["Data.Semigroup"];
  var Data_Traversable = PS["Data.Traversable"];
  var Oak = PS["Oak"];
  var Oak_Css = PS["Oak.Css"];
  var Oak_Document = PS["Oak.Document"];
  var Oak_Html = PS["Oak.Html"];
  var Oak_Html_Attribute = PS["Oak.Html.Attribute"];
  var Oak_Html_Events = PS["Oak.Html.Events"];
  var Oak_Html_Present = PS["Oak.Html.Present"];
  var Prelude = PS["Prelude"];        
  var Image = (function () {
      function Image(value0) {
          this.value0 = value0;
      };
      Image.create = function (value0) {
          return new Image(value0);
      };
      return Image;
  })();
  var ShowImage = (function () {
      function ShowImage(value0) {
          this.value0 = value0;
      };
      ShowImage.create = function (value0) {
          return new ShowImage(value0);
      };
      return ShowImage;
  })();
  var HideImage = (function () {
      function HideImage(value0) {
          this.value0 = value0;
      };
      HideImage.create = function (value0) {
          return new HideImage(value0);
      };
      return HideImage;
  })();
  var imageStyle = function (v) {
      var urlAttr = "url(" + (v.value0.small_url + ")");
      return Oak_Html_Attribute.style([ Oak_Css.backgroundImage(urlAttr), Oak_Css.backgroundSize("cover"), Oak_Css.backgroundPosition("center") ]);
  };
  var renderImage = function (image) {
      return Oak_Html.div([ Oak_Html_Events.onClick(new ShowImage(image)), Oak_Html_Attribute.class_("image"), imageStyle(image) ])([  ]);
  };
  var eqImage = new Data_Eq.Eq(function (v) {
      return function (v1) {
          return v.value0.small_url === v1.value0.small_url;
      };
  });
  var update = function (v) {
      return function (model) {
          if (v instanceof HideImage) {
              var updateImage = function (a) {
                  return function (b) {
                      var $21 = Data_Eq.eq(eqImage)(a)(b);
                      if ($21) {
                          return new Image((function () {
                              var $23 = {};
                              for (var $24 in a.value0) {
                                  if ({}.hasOwnProperty.call(a.value0, $24)) {
                                      $23[$24] = a["value0"][$24];
                                  };
                              };
                              $23.shown = false;
                              return $23;
                          })());
                      };
                      return b;
                  };
              };
              return Data_Functor.map(Data_Functor.functorArray)(updateImage(v.value0))(model);
          };
          if (v instanceof ShowImage) {
              var updateImage = function (a) {
                  return function (b) {
                      var $28 = Data_Eq.eq(eqImage)(a)(b);
                      if ($28) {
                          return new Image((function () {
                              var $30 = {};
                              for (var $31 in a.value0) {
                                  if ({}.hasOwnProperty.call(a.value0, $31)) {
                                      $30[$31] = a["value0"][$31];
                                  };
                              };
                              $30.shown = true;
                              return $30;
                          })());
                      };
                      return b;
                  };
              };
              return Data_Functor.map(Data_Functor.functorArray)(updateImage(v.value0))(model);
          };
          throw new Error("Failed pattern match at Main line 125, column 1 - line 125, column 32: " + [ v.constructor.name, model.constructor.name ]);
      };
  };
  var bigImageStyle = function (v) {
      var urlAttr = "url(" + (v.value0.large_url + ")");
      return Oak_Html_Attribute.style([ Oak_Css.backgroundImage(urlAttr), Oak_Css.backgroundSize("cover"), Oak_Css.backgroundPosition("center") ]);
  };
  var renderBigImage = function (v) {
      return Oak_Html.div([ Oak_Html_Events.onClick(new HideImage(v)), Oak_Html_Attribute.class_("image-big"), bigImageStyle(v) ])([  ]);
  };
  var bigImage = function (images) {
      return Data_Foldable.find(Data_Foldable.foldableArray)(function (v) {
          return v.value0.shown;
      })(images);
  };
  var renderOverlay = function (images) {
      var v = bigImage(images);
      if (v instanceof Data_Maybe.Nothing) {
          return Oak_Html.text(Oak_Html_Present.presentString)("");
      };
      if (v instanceof Data_Maybe.Just) {
          return Oak_Html.div([ Oak_Html_Events.onClick(new HideImage(v.value0)), Oak_Html_Attribute.class_("overlay") ])([ renderBigImage(v.value0) ]);
      };
      throw new Error("Failed pattern match at Main line 110, column 3 - line 116, column 35: " + [ v.constructor.name ]);
  };
  var view = function (model) {
      return Oak_Html.div([  ])([ Oak_Html.div([ Oak_Html_Attribute.class_("image-container") ])(Data_Functor.map(Data_Functor.functorArray)(renderImage)(model)), renderOverlay(model) ]);
  };
  var app = Oak.createApp({
      init: $foreign.getImages(Image.create),
      view: view,
      update: update
  });
  var main = function __do() {
      var v = Oak_Document.getElementById("app")();
      var v1 = Oak.runApp(app)();
      return Oak_Document.appendChildNode(v)(v1)();
  };
  exports["main"] = main;
})(PS["Main"] = PS["Main"] || {});
PS["Main"].main();

},{"virtual-dom/create-element":7,"virtual-dom/diff":8,"virtual-dom/h":9,"virtual-dom/patch":10}],35:[function(require,module,exports){

},{}]},{},[34]);
