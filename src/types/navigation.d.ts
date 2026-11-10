declare global {
  interface Window {
    navigation?: Navigation;
  }

  interface Navigation extends EventTarget {
    addEventListener(type: "navigate", listener: (event: NavigateEvent) => void): void;
    removeEventListener(type: "navigate", listener: (event: NavigateEvent) => void): void;
  }

  interface NavigateEvent extends Event {
    readonly cancelable: boolean;
    readonly destination: {
      readonly url: string;
    };
    readonly hashChange: boolean;
    readonly navigationType: string;
  }
}

export {};
