/* Original, optional interaction helpers for Claude-style local interfaces.
 * No framework, network, auto-mounting, or iframe permission bridge.
 * Load as a classic script; explicitly attach only the helpers a project needs.
 */
(function (global) {
  'use strict';

  const scrollMounts = new WeakSet();
  const splitMounts = new WeakSet();
  let nextId = 0;

  function element(value, name) {
    if (!value || value.nodeType !== 1) throw new TypeError(name + ' must be an element.');
    return value;
  }

  function finite(value, fallback, min) {
    return Number.isFinite(value) ? Math.max(min, value) : fallback;
  }

  function rememberAttributes(node, names) {
    const saved = names.map(function (name) { return [name, node.getAttribute(name)]; });
    return function () {
      saved.forEach(function (entry) {
        if (entry[1] === null) node.removeAttribute(entry[0]);
        else node.setAttribute(entry[0], entry[1]);
      });
    };
  }

  function rememberStyle(node, names) {
    const hadStyleAttribute = node.hasAttribute('style');
    const saved = names.map(function (name) {
      return [name, node.style.getPropertyValue(name), node.style.getPropertyPriority(name)];
    });
    return function () {
      saved.forEach(function (entry) {
        if (entry[1]) node.style.setProperty(entry[0], entry[1], entry[2]);
        else node.style.removeProperty(entry[0]);
      });
      if (!hadStyleAttribute && node.style.length === 0) node.removeAttribute('style');
    };
  }

  function ignoresReadingKeys(target) {
    return target && (target.isContentEditable || target.closest('input, textarea, select, button, a, [role="textbox"]'));
  }

  /**
   * attachScrollFollow({ viewport, content, jumpButton, cooldownMs=150,
   *                      bottomThreshold=40 })
   * Returns { jumpToLatest(), refresh(), destroy() }.
   * viewport must scroll; content must grow naturally inside it. The jump button
   * resumes following explicitly after an upward reading gesture. It is hidden
   * while following. Draft typing in an editor does not pause following.
   * Initial follow is enabled only within bottomThreshold of the bottom;
   * attach before filling a fresh transcript, or call jumpToLatest explicitly.
   */
  function attachScrollFollow(options) {
    const viewport = element(options.viewport, 'viewport');
    const content = element(options.content, 'content');
    const jumpButton = element(options.jumpButton, 'jumpButton');
    if (!viewport.contains(content)) throw new TypeError('content must be inside viewport.');
    if (scrollMounts.has(viewport)) throw new Error('Scroll follow is already attached; destroy it first.');
    const doc = viewport.ownerDocument;
    const win = doc.defaultView;
    const cooldown = finite(options.cooldownMs, 150, 0);
    const threshold = finite(options.bottomThreshold, 40, 0);
    const restoreViewport = rememberAttributes(viewport, ['data-clui-follow', 'tabindex', 'id']);
    const restoreButton = rememberAttributes(jumpButton, ['hidden', 'aria-controls']);
    const restoreStyle = rememberStyle(viewport, ['scroll-behavior', 'overflow-anchor']);
    const cleanups = [];
    let destroyed = false;
    let lastTop = viewport.scrollTop;
    let lastMax = Math.max(0, viewport.scrollHeight - viewport.clientHeight);
    let following = lastMax - lastTop <= threshold;
    let lastInputAt = -Infinity;
    let touch = null;
    let frame = 0;
    let timer = 0;

    scrollMounts.add(viewport);
    if (!viewport.id) viewport.id = 'clui-follow-' + (++nextId);
    if (!viewport.hasAttribute('tabindex')) viewport.tabIndex = 0;
    jumpButton.setAttribute('aria-controls', viewport.id);
    viewport.style.setProperty('scroll-behavior', 'auto');
    viewport.style.setProperty('overflow-anchor', 'none');

    function listen(node, type, callback, config) {
      node.addEventListener(type, callback, config);
      cleanups.push(function () { node.removeEventListener(type, callback, config); });
    }

    function maxTop() { return Math.max(0, viewport.scrollHeight - viewport.clientHeight); }

    function publish() {
      viewport.setAttribute('data-clui-follow', following ? 'following' : 'paused');
      jumpButton.hidden = following;
    }

    function clearWork() {
      if (frame) win.cancelAnimationFrame(frame);
      if (timer) win.clearTimeout(timer);
      frame = 0;
      timer = 0;
    }

    function pause() {
      if (destroyed) return;
      following = false;
      clearWork();
      publish();
    }

    function align() {
      // Record actual geometry after writing, rather than swallowing the next
      // scroll event. A no-op write cannot hide a later genuine user scroll.
      viewport.scrollTop = maxTop();
      lastTop = viewport.scrollTop;
      lastMax = maxTop();
    }

    function refresh() {
      if (destroyed || !following) return;
      const remaining = cooldown - (win.performance.now() - lastInputAt);
      if (remaining > 0) {
        if (timer) win.clearTimeout(timer);
        timer = win.setTimeout(function () { timer = 0; refresh(); }, Math.ceil(remaining) + 1);
        return;
      }
      if (timer) win.clearTimeout(timer);
      timer = 0;
      if (!frame) frame = win.requestAnimationFrame(function () {
        frame = 0;
        if (!destroyed && following) {
          if (win.performance.now() - lastInputAt < cooldown) refresh();
          else align();
        }
      });
    }

    function recordInput() {
      lastInputAt = win.performance.now();
      // A timer resumes work even if the last content change happened during
      // the cooldown and no more chunks arrive afterward.
      if (following) refresh();
    }

    function jumpToLatest() {
      if (destroyed) return;
      clearWork();
      following = true;
      lastInputAt = -Infinity;
      align();
      publish();
    }

    listen(viewport, 'scroll', function () {
      const top = viewport.scrollTop;
      const currentMax = maxTop();
      const layoutClamp = currentMax < lastMax && Math.abs(top - currentMax) <= 1;
      if (top < lastTop - 1 && !layoutClamp) pause();
      // A positive scroll never cancels explicit reading mode. Returning to
      // latest uses the labelled control, avoiding accidental reattachment.
      lastTop = top;
      lastMax = currentMax;
    }, { passive: true });

    listen(viewport, 'wheel', function (event) {
      if (event.ctrlKey) return; // Browser zoom is not a reading gesture.
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      recordInput();
      if (event.deltaY < 0 && maxTop() > 1) pause();
    }, { passive: true });

    listen(viewport, 'touchstart', function (event) {
      touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : null;
    }, { passive: true });
    listen(viewport, 'touchmove', function (event) {
      if (!touch || event.touches.length !== 1) return;
      const x = event.touches[0].clientX;
      const y = event.touches[0].clientY;
      recordInput();
      if (y > touch.y + 1 && Math.abs(y - touch.y) > Math.abs(x - touch.x) && maxTop() > 1) pause();
      touch = { x: x, y: y };
    }, { passive: true });
    function endTouch() { touch = null; }
    listen(viewport, 'touchend', endTouch, { passive: true });
    listen(viewport, 'touchcancel', endTouch, { passive: true });

    listen(viewport, 'keydown', function (event) {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || ignoresReadingKeys(event.target)) return;
      const up = ['ArrowUp', 'PageUp', 'Home'].includes(event.key) || (event.key === ' ' && event.shiftKey);
      const down = ['ArrowDown', 'PageDown', 'End'].includes(event.key) || (event.key === ' ' && !event.shiftKey);
      if (!up && !down) return;
      recordInput();
      if (up && maxTop() > 1) pause();
      // Preserve the browser's native scrolling and key behavior.
    });

    listen(jumpButton, 'click', function () {
      if (doc.activeElement === jumpButton) viewport.focus({ preventScroll: true });
      jumpToLatest();
    });
    listen(content, 'load', refresh, true);
    listen(win, 'resize', refresh);
    const mutations = new win.MutationObserver(refresh);
    mutations.observe(content, { subtree: true, childList: true, characterData: true, attributes: true });
    cleanups.push(function () { mutations.disconnect(); });
    if (win.ResizeObserver) {
      const sizes = new win.ResizeObserver(refresh);
      sizes.observe(viewport);
      sizes.observe(content);
      cleanups.push(function () { sizes.disconnect(); });
    }

    publish();
    refresh();
    return Object.freeze({
      jumpToLatest: jumpToLatest,
      refresh: refresh,
      destroy: function () {
        if (destroyed) return;
        destroyed = true;
        clearWork();
        cleanups.forEach(function (cleanup) { cleanup(); });
        restoreViewport();
        restoreButton();
        restoreStyle();
        scrollMounts.delete(viewport);
      }
    });
  }

  /**
   * attachSplitPane({ root, leftPane, rightPane, separator, resetButton?,
   *                   initialRatio=.5, minLeft=280, minRight=280 })
   * Returns { reset(), refresh(), destroy() }.
   * Use .clui-split / .clui-split-pane / .clui-split-separator from the companion
   * CSS. There is no pane hiding, spring dependency, or iframe bridge. Iframe
   * crossing is not guaranteed; test the target embedded surface separately.
   */
  function attachSplitPane(options) {
    const root = element(options.root, 'root');
    const left = element(options.leftPane, 'leftPane');
    const right = element(options.rightPane, 'rightPane');
    const separator = element(options.separator, 'separator');
    const resetButton = options.resetButton ? element(options.resetButton, 'resetButton') : null;
    if (![left, right, separator].every(function (node) { return node.parentElement === root; })) {
      throw new TypeError('Both panes and separator must be direct children of root.');
    }
    if (splitMounts.has(root)) throw new Error('Split pane is already attached; destroy it first.');
    const doc = root.ownerDocument;
    const win = doc.defaultView;
    const minLeft = finite(options.minLeft, 280, 1);
    const minRight = finite(options.minRight, 280, 1);
    const initial = Number.isFinite(options.initialRatio) ? Math.max(0, Math.min(1, options.initialRatio)) : .5;
    const restoreRoot = rememberAttributes(root, ['data-clui-split', 'data-clui-dragging']);
    const restoreStyle = rememberStyle(root, ['--clui-split-left']);
    const restoreSeparator = rememberAttributes(separator, ['role', 'tabindex', 'hidden', 'aria-hidden', 'aria-orientation', 'aria-controls', 'aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext']);
    const restoreLeft = rememberAttributes(left, ['id', 'tabindex']);
    const restoreRight = rememberAttributes(right, ['id']);
    const cleanups = [];
    let destroyed = false;
    let ratio = initial;
    let available = 0;
    let gutter = separator.getBoundingClientRect().width || 44;
    let lastWidth = 0;
    let stacked = false;
    let drag = null;

    splitMounts.add(root);
    if (!left.id) left.id = 'clui-pane-' + (++nextId);
    if (!right.id) right.id = 'clui-pane-' + (++nextId);
    if (!left.hasAttribute('tabindex')) left.tabIndex = -1;
    separator.setAttribute('role', 'separator');
    separator.setAttribute('aria-orientation', 'vertical');
    separator.setAttribute('aria-controls', left.id + ' ' + right.id);
    if (!separator.hasAttribute('aria-label')) separator.setAttribute('aria-label', 'Resize panels');

    function listen(node, type, callback, config) {
      node.addEventListener(type, callback, config);
      cleanups.push(function () { node.removeEventListener(type, callback, config); });
    }

    function bound(next) {
      if (available <= 0) return .5;
      return Math.max(minLeft / available, Math.min(1 - minRight / available, next));
    }

    function renderRatio() {
      if (stacked || destroyed) return;
      ratio = bound(ratio);
      const leftWidth = available * ratio;
      root.style.setProperty('--clui-split-left', leftWidth + 'px');
      separator.setAttribute('aria-valuemin', String(Number((minLeft / available * 100).toFixed(2))));
      separator.setAttribute('aria-valuemax', String(Number(((1 - minRight / available) * 100).toFixed(2))));
      separator.setAttribute('aria-valuenow', String(Number((ratio * 100).toFixed(2))));
      separator.setAttribute('aria-valuetext', 'First pane ' + Math.round(leftWidth) + ' pixels; second pane ' + Math.round(available - leftWidth) + ' pixels');
    }

    function finishDrag(cancel) {
      if (!drag) return;
      const previous = drag;
      drag = null;
      if (cancel) ratio = previous.ratio;
      root.removeAttribute('data-clui-dragging');
      try {
        if (separator.hasPointerCapture(previous.id)) separator.releasePointerCapture(previous.id);
      } catch (_) { /* Detached hosts may already have released capture. */ }
      renderRatio();
    }

    function refresh() {
      if (destroyed) return;
      const width = root.clientWidth;
      if (drag && width !== lastWidth) finishDrag(true);
      if (!separator.hidden) gutter = separator.getBoundingClientRect().width || gutter;
      available = Math.max(0, width - gutter);
      stacked = available < minLeft + minRight;
      root.setAttribute('data-clui-split', stacked ? 'stacked' : 'side-by-side');
      if (stacked && doc.activeElement === separator) left.focus({ preventScroll: true });
      separator.hidden = stacked;
      separator.tabIndex = stacked ? -1 : 0;
      if (stacked) separator.setAttribute('aria-hidden', 'true');
      else separator.removeAttribute('aria-hidden');
      lastWidth = width;
      renderRatio();
    }

    function reset() {
      if (destroyed) return;
      finishDrag(true);
      ratio = .5;
      renderRatio();
    }

    listen(separator, 'pointerdown', function (event) {
      if (destroyed || stacked || drag || event.button !== 0 || event.isPrimary === false) return;
      event.preventDefault();
      separator.focus({ preventScroll: true });
      drag = { id: event.pointerId, x: event.clientX, ratio: ratio, moved: false, available: available };
      try { separator.setPointerCapture(event.pointerId); }
      catch (_) { finishDrag(true); }
    });
    listen(separator, 'pointermove', function (event) {
      if (!drag || event.pointerId !== drag.id) return;
      const delta = event.clientX - drag.x;
      if (!drag.moved && Math.abs(delta) < 4) return;
      drag.moved = true;
      root.setAttribute('data-clui-dragging', 'true');
      const direction = win.getComputedStyle(root).direction === 'rtl' ? -1 : 1;
      ratio = drag.ratio + direction * delta / drag.available;
      renderRatio();
    });
    listen(separator, 'pointerup', function (event) {
      if (drag && event.pointerId === drag.id) finishDrag(false);
    });
    function cancelPointer(event) {
      if (drag && event.pointerId === drag.id) finishDrag(true);
    }
    listen(separator, 'pointercancel', cancelPointer);
    listen(separator, 'lostpointercapture', cancelPointer);
    listen(separator, 'dblclick', reset);
    listen(win, 'keydown', function (event) {
      if (drag && event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        finishDrag(true);
      }
    }, true);
    listen(separator, 'keydown', function (event) {
      if (stacked || event.altKey || event.ctrlKey || event.metaKey) return;
      const direction = win.getComputedStyle(root).direction === 'rtl' ? -1 : 1;
      const step = (event.shiftKey ? 48 : 24) / available;
      if (event.key === 'ArrowLeft') ratio -= direction * step;
      else if (event.key === 'ArrowRight') ratio += direction * step;
      else if (event.key === 'Home') ratio = minLeft / available;
      else if (event.key === 'End') ratio = 1 - minRight / available;
      else if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); reset(); return; }
      else return;
      event.preventDefault();
      renderRatio();
    });
    if (resetButton) listen(resetButton, 'click', reset);
    listen(win, 'resize', refresh);
    if (win.ResizeObserver) {
      const sizes = new win.ResizeObserver(refresh);
      sizes.observe(root);
      cleanups.push(function () { sizes.disconnect(); });
    }

    refresh();
    return Object.freeze({
      reset: reset,
      refresh: refresh,
      destroy: function () {
        if (destroyed) return;
        finishDrag(true);
        destroyed = true;
        cleanups.forEach(function (cleanup) { cleanup(); });
        restoreRoot();
        restoreStyle();
        restoreSeparator();
        restoreLeft();
        restoreRight();
        splitMounts.delete(root);
      }
    });
  }

  global.ClaudeStyleUI = Object.freeze({ attachScrollFollow: attachScrollFollow, attachSplitPane: attachSplitPane });
})(window);
