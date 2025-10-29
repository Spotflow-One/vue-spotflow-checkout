/**
 * Accessibility utilities for Spotflow Vue.js library
 * Provides helper functions and constants for better accessibility support
 */

/**
 * WCAG 2.1 AA compliant minimum sizes and ratios
 */
export const ACCESSIBILITY_CONSTANTS = {
  /** Minimum touch target size for mobile devices (44x44px) */
  MIN_TOUCH_TARGET: 44,
  /** Minimum color contrast ratio for normal text (4.5:1) */
  MIN_CONTRAST_RATIO: 4.5,
  /** Minimum color contrast ratio for large text (3:1) */
  MIN_CONTRAST_RATIO_LARGE: 3.0,
  /** Maximum animation duration before requiring user control */
  MAX_ANIMATION_DURATION: 5000,
} as const

/**
 * Screen reader announcements for payment states
 */
export const SCREEN_READER_MESSAGES = {
  PAYMENT_STARTED: 'Payment process started, please wait',
  PAYMENT_SUCCESS: 'Payment completed successfully',
  PAYMENT_ERROR: 'Payment failed, please try again',
  LOADING: 'Processing payment, please wait',
  NETWORK_ERROR: 'Network error occurred, check your connection',
  VALIDATION_ERROR: 'Please correct the form errors before proceeding',
} as const

/**
 * ARIA roles and properties for payment components
 */
export const ARIA_ATTRIBUTES = {
  BUTTON_ROLE: 'button',
  ALERT_ROLE: 'alert',
  STATUS_ROLE: 'status',
  LIVE_POLITE: 'polite',
  LIVE_ASSERTIVE: 'assertive',
} as const

/**
 * Creates accessible error messages with proper ARIA attributes
 */
export interface AccessibleErrorOptions {
  /** The error message text */
  message: string
  /** Field that caused the error (optional) */
  field?: string
  /** Error severity level */
  severity?: 'error' | 'warning' | 'info'
  /** Whether to announce immediately to screen readers */
  announce?: boolean
}

/**
 * Generates accessible error message markup
 */
export function createAccessibleError(options: AccessibleErrorOptions): {
  message: string
  ariaAttributes: Record<string, string>
  className: string
} {
  const { message, field, severity = 'error', announce = true } = options
  
  const id = `spotflow-error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  
  return {
    message: field ? `${field}: ${message}` : message,
    ariaAttributes: {
      'id': id,
      'role': announce ? ARIA_ATTRIBUTES.ALERT_ROLE : ARIA_ATTRIBUTES.STATUS_ROLE,
      'aria-live': announce ? ARIA_ATTRIBUTES.LIVE_ASSERTIVE : ARIA_ATTRIBUTES.LIVE_POLITE,
      'aria-atomic': 'true'
    },
    className: `spotflow-error spotflow-error--${severity}`
  }
}

/**
 * Keyboard navigation helper
 */
export const KEYBOARD_KEYS = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
} as const

/**
 * Checks if a keyboard event should trigger button activation
 */
export function isActivationKey(event: KeyboardEvent): boolean {
  return event.key === KEYBOARD_KEYS.ENTER || event.key === KEYBOARD_KEYS.SPACE
}

/**
 * Manages focus for modal/popup scenarios
 */
export class FocusManager {
  private previouslyFocused: HTMLElement | null = null
  
  /**
   * Captures current focus and prepares for modal focus management
   */
  captureFocus(): void {
    this.previouslyFocused = document.activeElement as HTMLElement
  }
  
  /**
   * Sets focus to the first focusable element in container
   */
  setInitialFocus(container: HTMLElement): void {
    const focusableElements = this.getFocusableElements(container)
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    }
  }
  
  /**
   * Restores focus to previously focused element
   */
  restoreFocus(): void {
    if (this.previouslyFocused && typeof this.previouslyFocused.focus === 'function') {
      this.previouslyFocused.focus()
    }
  }
  
  /**
   * Traps focus within container (for modal dialogs)
   */
  trapFocus(container: HTMLElement, event: KeyboardEvent): void {
    if (event.key !== KEYBOARD_KEYS.TAB) return
    
    const focusableElements = this.getFocusableElements(container)
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
  }
  
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])'
    ].join(', ')
    
    return Array.from(container.querySelectorAll(selector)) as HTMLElement[]
  }
}

/**
 * Announces messages to screen readers
 */
export class ScreenReaderAnnouncer {
  private announcer: HTMLElement | null = null
  
  constructor() {
    this.createAnnouncer()
  }
  
  /**
   * Announces a message to screen readers
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.announcer) return
    
    this.announcer.setAttribute('aria-live', priority)
    this.announcer.textContent = message
    
    // Clear after announcement
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = ''
      }
    }, 1000)
  }
  
  private createAnnouncer(): void {
    this.announcer = document.createElement('div')
    this.announcer.setAttribute('aria-live', 'polite')
    this.announcer.setAttribute('aria-atomic', 'true')
    this.announcer.className = 'sr-only'
    this.announcer.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `
    document.body.appendChild(this.announcer)
  }
  
  /**
   * Cleanup announcer element
   */
  destroy(): void {
    if (this.announcer && this.announcer.parentNode) {
      this.announcer.parentNode.removeChild(this.announcer)
    }
    this.announcer = null
  }
}

/**
 * Color contrast utilities (for theme validation)
 */
export function calculateContrastRatio(color1: string, color2: string): number {
  // Simplified contrast ratio calculation
  // In a real implementation, you'd want a more robust color parsing library
  const getLuminance = (color: string): number => {
    // This is a simplified version - you'd typically use a proper color library
    const hex = color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16) / 255
    const g = parseInt(hex.substr(2, 2), 16) / 255
    const b = parseInt(hex.substr(4, 2), 16) / 255
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
  }
  
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  const brightest = Math.max(lum1, lum2)
  const darkest = Math.min(lum1, lum2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

/**
 * Checks if color combination meets WCAG contrast requirements
 */
export function meetsContrastRequirement(
  color1: string,
  color2: string,
  level: 'AA' | 'AAA' = 'AA',
  isLargeText: boolean = false
): boolean {
  const contrast = calculateContrastRatio(color1, color2)
  
  if (level === 'AAA') {
    return isLargeText ? contrast >= 4.5 : contrast >= 7.0
  }
  
  return isLargeText ? contrast >= 3.0 : contrast >= 4.5
}

/**
 * Detects user preferences for accessibility
 */
export function getUserAccessibilityPreferences(): {
  prefersReducedMotion: boolean
  prefersHighContrast: boolean
  prefersDarkMode: boolean
} {
  return {
    prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    prefersHighContrast: window.matchMedia('(prefers-contrast: high)').matches,
    prefersDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
  }
}