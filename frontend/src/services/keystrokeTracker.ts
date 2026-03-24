/**
 * Keystroke Tracker Service
 * Captures keystroke timing and detects paste events
 * PRIVACY FIRST: Only timing metadata is captured, never raw key content
 */

export interface KeystrokeEvent {
  timestamp: number; // milliseconds since session start
  keyCode: number;
  duration: number; // milliseconds key was held
}

export interface PasteEvent {
  timestamp: number; // milliseconds since session start
  textLength: number; // number of characters pasted
  position: number; // cursor position in editor
}

export interface SessionData {
  sessionId: string;
  content: string;
  keystrokeEvents: KeystrokeEvent[];
  pasteEvents: PasteEvent[];
  sessionStartTime: Date;
  contentLength: number;
}

class KeystrokeTracker {
  private sessionStartTime: number = 0;
  private keystrokeEvents: KeystrokeEvent[] = [];
  private pasteEvents: PasteEvent[] = [];
  private pressedKeys: Map<number, number> = new Map(); // keyCode -> pressTime
  private isTracking: boolean = false;

  /**
   * Start tracking keystrokes and paste events
   */
  public startTracking(): void {
    if (this.isTracking) return;

    this.sessionStartTime = Date.now();
    this.keystrokeEvents = [];
    this.pasteEvents = [];
    this.pressedKeys = new Map();
    this.isTracking = true;

    // Add global event listeners
    document.addEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Stop tracking
   */
  public stopTracking(): void {
    this.isTracking = false;
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
  }

  /**
   * Handle key press (keydown event)
   */
  private handleKeyDown = (event: KeyboardEvent): void => {
    if (!this.isTracking) return;

    const keyCode = event.keyCode || event.which;

    // Record key press time
    if (!this.pressedKeys.has(keyCode)) {
      this.pressedKeys.set(keyCode, Date.now());
    }
  };

  /**
   * Handle key release (keyup event)
   */
  private handleKeyUp = (event: KeyboardEvent): void => {
    if (!this.isTracking) return;

    const keyCode = event.keyCode || event.which;
    const pressTime = this.pressedKeys.get(keyCode);

    if (pressTime !== undefined) {
      const releaseTime = Date.now();
      const duration = releaseTime - pressTime;
      const timestamp = pressTime - this.sessionStartTime;

      // Record keystroke event
      this.keystrokeEvents.push({
        timestamp,
        keyCode,
        duration,
      });

      this.pressedKeys.delete(keyCode);
    }
  };

  /**
   * Handle paste event
   * Call this from the editor's onpaste handler
   */
  public recordPaste(textLength: number, position: number): void {
    if (!this.isTracking) return;

    const timestamp = Date.now() - this.sessionStartTime;

    this.pasteEvents.push({
      timestamp,
      textLength,
      position,
    });
  }

  /**
   * Get keystroke events
   */
  public getKeystrokeEvents(): KeystrokeEvent[] {
    return [...this.keystrokeEvents];
  }

  /**
   * Get paste events
   */
  public getPasteEvents(): PasteEvent[] {
    return [...this.pasteEvents];
  }

  /**
   * Get typing statistics
   */
  public getTypingStats(): {
    totalKeystrokes: number;
    totalPastes: number;
    pastePercentage: number;
    averageKeyDuration: number;
    typingPattern: 'human' | 'mixed' | 'paste_heavy';
  } {
    const totalKeystrokes = this.keystrokeEvents.length;
    const totalPastes = this.pasteEvents.length;
    const pastedCharacters = this.pasteEvents.reduce(
      (sum, event) => sum + event.textLength,
      0
    );
    const typedCharacters = totalKeystrokes; // Approximate

    const totalCharacters = pastedCharacters + typedCharacters;
    const pastePercentage =
      totalCharacters > 0 ? (pastedCharacters / totalCharacters) * 100 : 0;

    const averageKeyDuration =
      totalKeystrokes > 0
        ? this.keystrokeEvents.reduce((sum, event) => sum + event.duration, 0) /
          totalKeystrokes
        : 0;

    // Classify typing pattern
    let typingPattern: 'human' | 'mixed' | 'paste_heavy';
    if (pastePercentage < 5) {
      typingPattern = 'human';
    } else if (pastePercentage < 30) {
      typingPattern = 'mixed';
    } else {
      typingPattern = 'paste_heavy';
    }

    return {
      totalKeystrokes,
      totalPastes,
      pastePercentage,
      averageKeyDuration,
      typingPattern,
    };
  }

  /**
   * Reset tracker
   */
  public reset(): void {
    this.stopTracking();
    this.sessionStartTime = 0;
    this.keystrokeEvents = [];
    this.pasteEvents = [];
    this.pressedKeys = new Map();
  }

  /**
   * Get complete session data snapshot
   */
  public getSessionData(
    sessionId: string,
    content: string
  ): Omit<SessionData, 'sessionStartTime'> {
    return {
      sessionId,
      content,
      keystrokeEvents: this.getKeystrokeEvents(),
      pasteEvents: this.getPasteEvents(),
      contentLength: content.length,
    };
  }
}

// Export singleton instance
export const keystrokeTracker = new KeystrokeTracker();
