interface HeadBridge {
  initialize: (modules: string[]) => Promise<any[]>;
}

interface Head {
  bridge: HeadBridge;
}

declare global {
  interface Window {
    head: Head;
  }
}

export {}
