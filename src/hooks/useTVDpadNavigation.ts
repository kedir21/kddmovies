import { useEffect } from 'react';

function isInputElement(el: Element | null): boolean {
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  return (
    tag === 'input' ||
    tag === 'textarea' ||
    tag === 'select' ||
    (el as HTMLElement).isContentEditable
  );
}

function getFocusableElements(): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    '[role="button"]:not([aria-disabled="true"])',
    '[role="tab"]:not([aria-disabled="true"])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');

  return Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
    (el) => {
      const style = window.getComputedStyle(el);
      if (style.display === 'none' || style.visibility === 'hidden') {
        return false;
      }
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0;
    }
  );
}

export function useTVDpadNavigation() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      if (
        key !== 'ArrowUp' &&
        key !== 'ArrowDown' &&
        key !== 'ArrowLeft' &&
        key !== 'ArrowRight'
      ) {
        return;
      }

      const active = document.activeElement;
      // Allow normal text caret / select navigation inside form fields
      if (isInputElement(active)) {
        if (active?.tagName.toLowerCase() === 'input' && (key === 'ArrowLeft' || key === 'ArrowRight')) {
          return;
        }
        if (active?.tagName.toLowerCase() === 'select') {
          return;
        }
      }

      const focusables = getFocusableElements();
      if (focusables.length === 0) return;

      if (!active || !(active instanceof HTMLElement) || !focusables.includes(active)) {
        e.preventDefault();
        focusables[0].focus();
        return;
      }

      const currentRect = active.getBoundingClientRect();
      const cx = currentRect.left + currentRect.width / 2;
      const cy = currentRect.top + currentRect.height / 2;

      let bestCandidate: HTMLElement | null = null;
      let bestScore = Number.POSITIVE_INFINITY;

      for (const candidate of focusables) {
        if (candidate === active) continue;
        const rect = candidate.getBoundingClientRect();
        const tx = rect.left + rect.width / 2;
        const ty = rect.top + rect.height / 2;
        const dx = tx - cx;
        const dy = ty - cy;

        let isCorrectDirection = false;
        let primaryDist = 0;
        let crossDist = 0;

        if (key === 'ArrowRight' && dx > 6) {
          isCorrectDirection = true;
          primaryDist = dx;
          crossDist = Math.abs(dy);
        } else if (key === 'ArrowLeft' && dx < -6) {
          isCorrectDirection = true;
          primaryDist = -dx;
          crossDist = Math.abs(dy);
        } else if (key === 'ArrowDown' && dy > 6) {
          isCorrectDirection = true;
          primaryDist = dy;
          crossDist = Math.abs(dx);
        } else if (key === 'ArrowUp' && dy < -6) {
          isCorrectDirection = true;
          primaryDist = -dy;
          crossDist = Math.abs(dx);
        }

        if (!isCorrectDirection) continue;

        // Weight orthogonal alignment heavily so D-pad stays in intuitive rows/columns
        const score = primaryDist + crossDist * 2.2;
        if (score < bestScore) {
          bestScore = score;
          bestCandidate = candidate;
        }
      }

      if (bestCandidate) {
        e.preventDefault();
        bestCandidate.focus({ preventScroll: false });
        bestCandidate.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest',
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
