import { useEffect, useRef } from 'react';

/**
 * Makes a modal/detail view close on the phone's back button (or browser
 * back) instead of the back button exiting the whole site.
 *
 * WHY THIS WAS NEEDED:
 * The app never pushed any history entries when a modal opened. So on
 * mobile, pressing the back button while a "See more" / "View specs"
 * modal was open didn't have an in-app screen to go "back" to — the
 * browser/PWA just fell through to whatever was before the site in the
 * device's history (or exited the installed app entirely). That's why
 * the whole site appeared to "close" instead of just closing the modal.
 *
 * HOW IT WORKS:
 * - When the modal opens, we push a dummy history entry.
 * - If the user presses back, the browser fires a `popstate` event
 *   instead of leaving the page — we catch that and close the modal.
 * - If the modal is closed normally (tapping the X, an overlay click,
 *   etc.), we clean up that dummy entry ourselves via history.back(),
 *   so the back stack doesn't grow every time someone opens a modal.
 *
 * USAGE:
 *   useModalBackClose(isOpen, onClose);
 *
 * Put this one line inside any modal component (or call it in the
 * parent next to the modal's open state) — no other changes required.
 */
export function useModalBackClose(isOpen: boolean, onClose: () => void): void {
  const pushedRef = useRef(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Push/pop a history entry as the modal opens/closes.
  useEffect(() => {
    if (isOpen && !pushedRef.current) {
      window.history.pushState({ charteModal: true }, '');
      pushedRef.current = true;
    } else if (!isOpen && pushedRef.current) {
      pushedRef.current = false;
      // Modal was closed via the UI (X button, overlay click, etc.) —
      // remove the entry we pushed so the back stack stays clean.
      window.history.back();
    }
  }, [isOpen]);

  // Listen for the hardware/browser back button.
  useEffect(() => {
    const handlePopState = () => {
      if (pushedRef.current) {
        pushedRef.current = false;
        onCloseRef.current();
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
}
