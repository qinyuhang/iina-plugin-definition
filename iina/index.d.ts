declare namespace IINA {
  export interface Rect {
    x: number;
    y: number;
    width: number;
    height: number;
  }

  export interface HTTPRequestOption<DataType = Record<string, any>> {
    params: Record<string, string>;
    headers: Record<string, string>;
    data: DataType;
  }

  export interface HTTPResponse<DataType = any> {
    text: string;
    reason: string;
    data: DataType;
    statusCode: number;
  }

  export interface MenuItem {
    items: MenuItem[];
    title: string;
    selected: boolean;
    enabled: boolean;
    action: (item: MenuItem) => void;
    addSubMenuItem(item: MenuItem): this;
  }

  export interface Track {
    id: number;
    title: string | null;
    formattedTitie: string;
    lang: string | null;
    codec: string | null;
    isDefault: boolean;
    isForced: boolean;
    isSelected: boolean;
    isExternal: boolean;
    demuxW: number | null;
    demuxH: number | null;
    demuxChannelCount: number | null;
    demuxChannels: number | null;
    demuxSamplerate: number | null;
    demuxFPS: number | null;
  }

  export interface Chapter {
    title: string;
    start: number;
  }

  export interface History {
    name: string;
    url: string;
    date: string;
    progress: number | null;
    duration: number;
  }

  export interface RecentDocument {
    name: string;
    url: string;
  }

  export interface PlaylistItem {
    filename: string;
    title: string;
    isPlaying: boolean;
    isCurrent: boolean;
  }

  export namespace API {
    interface WindowAPI {
      readonly loaded: boolean;
      readonly visible: boolean;
      readonly screens: { frame: Rect; main: boolean; current: boolean }[];
      frame: Rect;
      fullscreen: boolean;
      pip: boolean;
      ontop: boolean;
      sidebar: string | null;
    }

    interface StatusAPI {
      readonly paused: boolean;
      readonly idle: boolean;
      readonly position: number | null;
      readonly duration: number | null;
      readonly speed: number;
      readonly videoWidth: number | null;
      readonly videoHeight: number | null;
      readonly isNetworkResource: boolean;
      readonly url: string;
    }

    interface TrackAPI {
      id: number | null;
      readonly tracks: Track[];
      readonly currentTrack: Track;
      loadTrack(url: string);
    }

    interface AudioAPI extends TrackAPI {
      delay: number;
      volume: number;
      muted: boolean;
    }

    interface SubtitleAPI extends TrackAPI {
      secondID: number | null;
      delay: number;
    }

    interface VideoAPI extends TrackAPI {}

    /**
     * This Object is only availible in mainEntry,
     * You cannot access it in GlobalEntry or Overlay or StandaloneWindow
     * @NotAccessibleForGlobalEntry
     */
    export interface Core {
      /**
       * open a url
       * param can be a http(s) or file:/// or absolute path
       * etc:
       * ```
       * open("http://example.com/example1.mp4")
       * open("http://example.com/example2.m3u")
       * open("/User/apple/example3.mp4")
       * open("file:///User/apple/example3.mp4")
       * ```
       * @param url string
       */
      open(url: string): void;
      osd(url: string): void;
      pause(): void;
      resume(): void;
      stop(): void;
      seek(seconds: number, exact: boolean): void;
      seekTo(seconds: number);
      setSpeed(speed: number);
      getChapters(): Chapter[];
      playChapter(index: number);
      getHistory(): History[];
      getRecentDocuments(): RecentDocument[];
      getVersion(): { iina: string; build: string; mpv: string };
      window: WindowAPI;
      status: StatusAPI;
      audio: AudioAPI;
      video: VideoAPI;
      subtitle: SubtitleAPI;
    }

    /**
     * This Object is only availible in mainEntry,
     * You cannot access it in GlobalEntry or Overlay or StandaloneWindow
     * @NotAccessibleForGlobalEntry
     */
    export interface MPV {
      getFlag(name: string): boolean;
      getNumber(name: string): number;
      getString(name: string): string;
      getNative<T>(name: string): T;
      set(name: string, value: any): void;
      command(name: string, args: string[]): void;
      addHook(
        name: string,
        priority: number,
        callback: (next: () => void) => void,
      ): void;
    }

    /**
     * @NotAccessibleForGlobalEntry
     */
    export interface Event {
      // Window
      on(event: "iina.window-loaded", callback: () => void): string;
      on(event: "iina.window-size-adjusted", callback: (frame: Rect) => void): string;
      on(event: "iina.window-moved", callback: (frame: Rect) => void): string;
      on(event: "iina.window-resized", callback: (frame: Rect) => void): string;
      on(event: "iina.window-fs.changed", callback: (status: boolean) => void): string;
      on(event: "iina.window-screen.changed", callback: () => void): string;
      on(event: "iina.window-miniaturized", callback: () => void): string;
      on(event: "iina.window-deminiaturized", callback: () => void): string;
      on(event: "iina.window-main.changed", callback: (status: boolean) => void): string;
      on(event: "iina.window-will-close", callback: () => void): string;
      on(event: "iina.window-did-close", callback: () => void): string;
      on(event: "iina.music-mode.changed", callback: (status: boolean) => void): string;
      on(event: "iina.pip.changed", callback: (status: boolean) => void): string;
      on(event: "iina.file-loaded", callback: (url: string) => void): string;
      on(event: "iina.file-started", callback: () => void): string;
      on(event: "iina.mpv-inititalized", callback: () => void): string;
      on(event: "iina.thumbnails-ready", callback: () => void): string;
      on(event: "iina.plugin-overlay-loaded", callback: () => void): string;
      on(event: string, callback: () => void): string;

      off(event: string, id: string);
    }

    export interface HTTPXMLRPC {
      call<T = any>(method: string, args: any[]): Promise<T>;
    }

    /**
     * @NotAccessibleForGlobalEntry
     */
    export interface HTTP {
      get<ReqData = Record<string, any>, ResData = any>(url: string, options: HTTPRequestOption<ReqData>): Promise<HTTPResponse<ResData>>;
      post<ReqData = Record<string, any>, ResData = any>(url: string, options: HTTPRequestOption<ReqData>): Promise<HTTPResponse<ResData>>;
      put<ReqData = Record<string, any>, ResData = any>(url: string, options: HTTPRequestOption<ReqData>): Promise<HTTPResponse<ResData>>;
      patch<ReqData = Record<string, any>, ResData = any>(url: string, options: HTTPRequestOption<ReqData>): Promise<HTTPResponse<ResData>>;
      delete<ReqData = Record<string, any>, ResData = any>(url: string, options: HTTPRequestOption<ReqData>): Promise<HTTPResponse<ResData>>;
      xmlrpc(location: string): HTTPXMLRPC;
    }

    export interface Console {
      log(...message: any[]): void;
      warn(message: any): void;
      error(message: any): void;
    }

    export interface Menu {
      item(
        title: string,
        action?: () => void | null,
        options?: Partial<{ enabled: boolean; selected: boolean; keyBinding: string }>,
      ): MenuItem;
      addItem(item: MenuItem): void;
      separator(): MenuItem;
      removeAllItems(): void;
    }

    /**
     * Overlay represent a webview that is covered above the player window
     * 
     * You can use this Object to load a html file cover the player window
     * usage:
     * ```
     * Overlay.loadFile('relative file path');
     * Overlay.show();
     * ```
     * @NotAccessibleForGlobalEntry
     */
    export interface Overlay {
      show(): void;
      hide(): void;
      setOpacity(opacity: number): void;
      loadFile(path: string): void;
      simpleMode(): void;
      setStyle(style: string);
      setContent(content: string);
      /**
       * send message to the Overlay page
       * @param name string
       * @param data any
       */
      postMessage(name: string, data: any): void;
      onMessage(name: string, callback: (data: any) => void): void;
    }

    /**
     * @NotAccessibleForGlobalEntry
     */
    export interface Playlist {
      list(): PlaylistItem[];
      count(): number;
      add(url: string, at?: number): PlaylistItem;
      remove(index: number): PlaylistItem;
      move(index: number, to: number): PlaylistItem;
      play(index: number): void;
      playNext(): void;
      playPrevious(): void;
      registerMenuBuilder(builder: (entries: PlaylistItem[]) => MenuItem[]): void;
    }

    export interface Utils {
      ERROR_BINARY_NOT_FOUND: -1;
      ERROR_RUNTIME: -2;
      exec(
        file: string,
        args: string[],
      ): Promise<{ status: number; stdout: string; stderr: string }>;
      ask(title: string): boolean;
      prompt(title: string): string | undefined;
      chooseFile(
        title: string,
        options: Partial<{ chooseDir: boolean; allowedFileTypes: string[] }>,
      ): string;
    }

    export interface Preferences {
      get(key: string): any;
      set(key: string, value: any): void;
      sync(): void;
    }

    export interface SubtitleItem<T> {
      data: T;
      desc: SubtitleItemDescriptor<T>;
    }

    export type SubtitleItemDescriptor<T> = (
      item: SubtitleItem<T>,
    ) => { name: string; left: string; right: string };

    export interface SubtitleProvider<T> {
      search(): Promise<SubtitleItem<T>[]>;
      description?(): SubtitleItemDescriptor<T>;
      download(item: SubtitleItem<T>): string[];
    }

    /**
     * @NotAccessibleForGlobalEntry
     */
    export interface Subtitle {
      item<T>(data: T, desc: SubtitleItemDescriptor<T>): SubtitleItem<T>;
      registerProvider<T>(id: string, provider: SubtitleProvider<T>): void;
    }

    export interface StandaloneWindow {
      open(): void;
      close(): void;
      loadFile(path: string): void;
      postMessage(name: string, data: any): void;
      onMessage(name: string, callback: (data: any) => void): void;
      setProperty(
        props: Partial<{
          title: string;
          resizable: boolean;
          fullSizeContentView: boolean;
        }>,
      );
    }

    /**
     * @NotAccessibleForGlobalEntry
     */
    export interface SidebarView {
      show(): void;
      hide(): void;
      loadFile(path: string): void;
      postMessage(name: string, data: any): void;
      onMessage(name: string, callback: (data: any) => void): void;
    }

    export interface FileHandle {
      offset(): number;
      seekTo(offset: number): void;
      seekToEnd(): void;
      read(length: number): Uint8Array | undefined;
      readToEnd(): Uint8Array | undefined;
      write(data: string | Uint8Array | number[]): void;
      close(): void;
    }

    export interface File {
      list(
        path: string,
        options: Partial<{ includeSubDir: boolean }>,
      ): { filename: string; path: string; isDir: boolean };
      exists(path: string): boolean;
      write(path: string, content: string): void;
      read(path: string, options: Partial<{}>): string | undefined;
      trash(path: string): void;
      delete(path: string): void;
      revealInFinder(path: string): void;
      handle(path: string, mode: string): FileHandle;
    }

    export interface Global {
      createPlayerInstance(
        options: Partial<{ disableWindowAnimation: boolean; enablePlugins: boolean }>,
      ): number;
      postMessage(target: null | number, name: string, data: any): void;
      onMessage(name: string, callback: (data: any) => void): void;
    }
  }

  interface Require {
    (file: string): any;
  }

  interface Module {
    exports: any;
  }

  export interface IINAGlobal {
    // @NotAccessibleForGlobalEntry start
    core: API.Core;
    mpv: API.MPV;
    event: API.Event;
    http: API.HTTP;
    overlay: API.Overlay;
    sidebar: API.SidebarView;
    playlist: API.Playlist;
    subtitie: API.Subtitle;
    // @NotAccessibleForGlobalEntry end

    console: API.Console;
    menu: API.Menu;
    utils: API.Utils;
    preferences: API.Preferences;
    standaloneWindow: API.StandaloneWindow;
    file: API.File;
    global: API.Global;
  }
}

declare const iina: IINA.IINAGlobal;
declare const require: IINA.Require;
declare const module: IINA.Module;
