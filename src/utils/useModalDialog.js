import { useEffect, useRef } from 'react';

const dialogs = [];
let pagePosition;

// Keep nested photo/video dialogs above their progression and return to the opener.
export function useModalDialog(open, onClose) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open || !ref.current) return;
    const dialog = ref.current;
    const opener = document.activeElement;
    const token = {};
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
    const onRoute = () => {
      pagePosition.x = 0;
      pagePosition.y = 0;
      closeRef.current();
    };
    document.addEventListener('keydown', onKey);
    window.addEventListener('popstate', onRoute);
    window.addEventListener('hashchange', onRoute);
    return () => {
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('popstate', onRoute);
      window.removeEventListener('hashchange', onRoute);
      dialogs.splice(dialogs.indexOf(token), 1);
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
