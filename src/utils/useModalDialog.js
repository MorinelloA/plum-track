import { useEffect, useRef } from 'react';

const dialogs = [];
let pagePosition;

// Keep nested photo/video dialogs above their progression and return to the opener.
// While a dialog is open it owns a history entry with the page's own address (state
// { plumDialog: depth }), so the browser's Back button closes the top dialog and stays on the
// page instead of leaving it. Closing the dialog any other way takes the entry away again.
export function useModalDialog(open, onClose) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const opener = document.activeElement;
    const token = {};
    const depth = dialogs.length + 1;
    let closedByBack = false;
    // Before the scroll lock, so the page's own entry keeps its real scroll position.
    window.history.pushState({ plumDialog: depth }, '', window.location.href);
    if (!dialogs.length) {
      pagePosition = {
        x: window.scrollX, y: window.scrollY,
        url: window.location.href,
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
        overflow: document.body.style.overflow
      };
      Object.assign(document.body.style, { position: 'fixed', top: `-${pagePosition.y}px`, width: '100%', overflow: 'hidden' });
    }
    dialogs.push(token);
    const focusable = () => [...dialog.querySelectorAll('button, a[href], input, select, textarea, summary, video[controls], [tabindex]')]
      .filter(el => !el.disabled && el.tabIndex >= 0 && el.getClientRects().length);
    (focusable()[0] || dialog).focus({ preventScroll: true });
    const onKey = event => {
      if (dialogs[dialogs.length - 1] !== token) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        closeRef.current();
      } else if (event.key === 'Tab') {
        const items = focusable();
        const first = items[0] || dialog;
        const last = items[items.length - 1] || dialog;
        if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
          event.preventDefault(); last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
          event.preventDefault(); first.focus();
        }
      }
    };
    // Back moved below this dialog's entry: close it, and stay on the page.
    const onBack = () => {
      const at = (window.history.state && window.history.state.plumDialog) || 0;
      if (at >= depth) return;
      closedByBack = true;
      closeRef.current();
    };
    const onRoute = () => {
      pagePosition.x = 0;
      pagePosition.y = 0;
      closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onBack);
    window.addEventListener('hashchange', onRoute);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onBack);
      window.removeEventListener('hashchange', onRoute);
      dialogs.splice(dialogs.indexOf(token), 1);
      // Closed with its button, Escape or a tap outside: take its history entry away again,
      // unless a link already replaced it with a new page.
      if (!closedByBack && window.history.state && window.history.state.plumDialog === depth) window.history.back();
      if (!dialogs.length) {
        const { x, y, url, ...styles } = pagePosition;
        Object.assign(document.body.style, styles);
        window.scrollTo(...(window.location.href === url ? [x, y] : [0, 0]));
      }
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open]);
  return ref;
}
