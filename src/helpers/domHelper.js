import _ from 'lodash';
import juice from 'juice/client';

import { isIE11 } from './browser';

const OPTIONS = {
    applyAttributesTableElements: false
};

/**
 * Iterates through all parent nodes (including current), comparing against cb.
 * @param {DOMNode} node
 * @param {Function} cb
 * @returns {*}
 */
// eslint-disable-next-line import/prefer-default-export
export const findParent = (node, cb) => {
    let traverse = node;
    if (traverse && cb(traverse)) {
        return traverse;
    }
    while (traverse.parentNode) {
        traverse = traverse.parentNode;
        if (cb(traverse)) {
            return traverse;
        }
    }
};

/**
 * Inline css into an element.
 * @param {String} html
 * @returns {String}
 */
export const inlineCss = (html = '') => {
    try {
        return juice(html, OPTIONS);
    } catch (err) {
        console.error(err);
        return html;
    }
};

/**
 * Set an element to be hidden.
 * @param {DOMNode} el
 * @param {Boolean} value Hidden or shown
 */
export const setHidden = (el, value = false) => {
    el.style.display = value ? 'none' : '';
};

/**
 * Force redraw of an element.
 * Copied from https://stackoverflow.com/a/3485654
 * @param {HTMLElement} el
 */
export const forceRedraw = (el) => {
    el.style.display = 'none';
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight;
    el.style.display = '';
};

export const escapeSrc = (value = '') => value.replace(/ src=/g, ' data-src=');
export const unescapeSrc = (value = '') => value.replace(/ data-src=/g, ' src=');

/**
 * Toggle class on element depending on conditon
 * @param {DOMNode} element
 * @param {String} className
 * @param {Boolean} value
 */
export const toggle = (element, className, value) => {
    element.classList.contains(className) === value || element.classList.toggle(className);
};

/**
 * Returns whether the element is a node.
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType}
 * @param {DOMNode} node
 * @returns {boolean}
 */
export const isElement = (node) => node && node.nodeType === 1;

/**
 * Get children configuration for a node/fragment
 * As IE is not able to deal with the dom API we need to "emulate it"
 * @param  {Element} node Can be a fragment
 * @return {Object}      {children: <Array>, first:<Element>, last:<Element>}
 */
export const getChildrenElements = (node) => {
    if (!isIE11() || node.firstElementChild) {
        return {
            first: node.firstElementChild,
            last: node.lastElementChild,
            children: node.children
        };
    }
    const children = _.filter(node.childNodes, isElement);

    return {
        first: children[0],
        last: _.last(children),
        children
    };
};

/**
 * Test if the string contains HTML data
 * It doesn't have loading resources side effects
 * @param {String} str
 * @return {Object}
 */
export const isHTML = (str = '') => {
    const doc = new DOMParser().parseFromString(str, 'text/html');
    const firstChild = doc.body.childNodes[0];
    return {
        isHtml: Array.from(doc.body.childNodes).some(isElement),
        isWrapped: !!isElement(firstChild)
    };
};
