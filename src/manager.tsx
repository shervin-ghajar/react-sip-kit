import isEqual from 'lodash.isequal';
import { defaultRtcConfig } from './configs';
import { RtcConfig } from './configs/types';
import { HybridEngineInitializer } from './engines/hybrid/initializer';
import { JanusEngineInitializer } from './engines/janus/initializer';
import { JanusSessionType } from './engines/janus/types';
import { SipEngineInitializer } from './engines/sip/initializer';
import { SipSessionType } from './engines/sip/types';
import { useRtcManager, useWatchLineData } from './hooks';
import { useWatchConfigs } from './hooks/useWatchConfigs';
import { getRtcStore, setRtcStore, useRtcStore } from './store';
import { LineType } from './store/types';
import {
  GetAccountKey,
  GetMethodsKey,
  LineLookup,
  RtcBroadcastMessage, RtcEngineStatus, RtcManagerConfig,
  RtcManagerInstance
} from './types';
import { deepMerge, serializeLines } from './utils';
import { sessionMethods as janusSessionMethods } from './engines/janus/methods/session';
import { sessionMethods as sipSessionMethods } from './engines/sip/methods/session';
import { sessionMethods as hybridSessionMethods } from './engines/hybrid/methods/session';
import { reconnectTransport } from './engines/sip/events/transport';
import { refreshRegistration as sipReconnect } from './engines/sip/methods/registration';
import { refreshRegistration as janusReconnect } from './engines/janus/methods/registration';
import { refreshRegistration as hybridReconnect } from './engines/hybrid/methods/registration';

/* -------------------------------------------------------------------------- */
/*  RTC Manager - Central orchestrator for multiple RTC accounts               */
/* -------------------------------------------------------------------------- */

export class RtcManager {
  /**
   * Active RTC instances keyed by `configKey`.
   *
   * `configKey` defaults to `config.account.username` if not explicitly provided.
   * Ensures multiple accounts (e.g., same username on different domains) can coexist.
   */
  private instances = new Map<string, RtcManagerInstance>();

  // cross‑tab communication
  private channel = new BroadcastChannel('react-sip-kit');

  // uniquely identifies this browser tab
  private tabId = Math.random().toString(16);

  // list of all tabs currently participating
  private subscribedTabIds = new Set<string>([this.tabId]);

  // whether this tab is master
  private isMasterManager = false;

  // last heartbeat timestamp from the master
  private lastHeartbeat = Date.now();

  // feature flags
  private broadcastEnabled = false;

  constructor(options?: { enableBroadcast?: boolean }) {
    this.broadcastEnabled = options?.enableBroadcast ?? false;

    if (this.broadcastEnabled) {
      this.initBroadcast();
      this.startHeartbeatMonitor();
      setRtcStore({ broadcastEnabled: this.broadcastEnabled }); // update store broadcastEnabled flag
    } else {
      this.isMasterManager = !this.broadcastEnabled; // if broadcastEnabled is false all managers are master
    }
  }

  // ------------------------------------------------------------
  //  Broadcast Initialization
  // ------------------------------------------------------------
  private initBroadcast() {
    let masterDetected = false;

    // announce our presence
    this.channel.postMessage({
      type: 'MASTER_CHECK',
      tabId: this.tabId,
    });

    // wait a bit to see if another tab answers
    const timer = setTimeout(() => {
      if (!masterDetected) {
        this.isMasterManager = true;
        this.startHeartbeatSender();
        this.broadcastStoreSubscription();
      }
    }, 200);

    this.channel.onmessage = (event) => {
      const msg = event.data as RtcBroadcastMessage;
      console.log({ msg }, [...this.subscribedTabIds]);
      switch (msg.type) {
        // ------------------------------------------------------
        // Master Presence Announced
        // ------------------------------------------------------
        case 'MASTER_PRESENT':
          masterDetected = true;
          this.isMasterManager = false;
          this.lastHeartbeat = Date.now();
          clearTimeout(timer);
          break;

        // ------------------------------------------------------
        // Another follower joined and is asking for the master
        // ------------------------------------------------------
        case 'MASTER_CHECK':
          this.subscribedTabIds.add(msg.tabId);
          if (this.isMasterManager) {
            this.channel.postMessage({
              type: 'MASTER_PRESENT',
              tabId: this.tabId,
            });
            this.broadcastStore();
          }
          break;

        // ------------------------------------------------------
        // followers forward commands → master executes them
        // ------------------------------------------------------
        case 'SESSION_COMMAND':
          if (this.isMasterManager) this.handleSessionCommand(msg);
          break;
        case 'COMMAND':
          if (this.isMasterManager) this.handleCommand(msg);
          break;

        // ------------------------------------------------------
        // master sends full store state to followers
        // ------------------------------------------------------
        case 'SYNC':
          if (!this.isMasterManager) {
            setRtcStore(msg.payload);
            this.subscribedTabIds = new Set(msg.tabIds);
          }
          break;

        // ------------------------------------------------------
        // followers leaving
        // ------------------------------------------------------
        case 'FOLLOWER_CLOSED':
          this.subscribedTabIds.delete(msg.tabId);
          break;
        case 'MASTER_CLOSED':
          this.subscribedTabIds.delete(msg.tabId);
          this.handleMasterElection();
          break;

        // ------------------------------------------------------
        // Heartbeat from master
        // ------------------------------------------------------
        case 'MASTER_HEARTBEAT':
          if (!this.isMasterManager) {
            this.lastHeartbeat = Date.now();
          }
          break;
      }
    };

    // ----------------------------------------------------------
    // Notify others we're leaving
    // ----------------------------------------------------------
    window.addEventListener('beforeunload', () => {
      this.onTabClose();
    });
  }

  private async onTabClose() {
    this.channel.postMessage({
      type: this.isMasterManager ? 'MASTER_CLOSED' : 'FOLLOWER_CLOSED',
      tabId: this.tabId,
    });
    this.isMasterManager = false;
    // stop all userAgent instances
    await this.stopAllInstances();
  }

  // ------------------------------------------------------------
  //  Heartbeat: Master → Followers
  // ------------------------------------------------------------
  private startHeartbeatSender() {
    if (!this.broadcastEnabled) return;

    const interval = setInterval(() => {
      if (!this.isMasterManager) return clearInterval(interval);

      this.channel.postMessage({
        type: 'MASTER_HEARTBEAT',
        tabId: this.tabId,
      });
    }, 2000);
  }

  // ------------------------------------------------------------
  //  Heartbeat Monitor: Followers detect master death
  // ------------------------------------------------------------
  private startHeartbeatMonitor() {
    if (!this.broadcastEnabled) return;

    const interval = setInterval(() => {
      if (this.isMasterManager) return clearInterval(interval);

      const elapsed = Date.now() - this.lastHeartbeat;

      // master is dead
      if (elapsed > 5000) {
        this.handleMasterElection();
      }
    }, 2000);
  }

  // deterministic successor selection
  private getSuccessorTabId() {
    const ids = [...this.subscribedTabIds];

    // include current tab so ordering is stable
    if (!ids.includes(this.tabId)) ids.push(this.tabId);

    ids.sort();
    return ids[0];
  }

  // ------------------------------------------------------------
  //  Master election
  // ------------------------------------------------------------
  private async handleMasterElection() {
    const successor = this.getSuccessorTabId();
    if (successor !== this.tabId) return;

    this.isMasterManager = true;
    this.startHeartbeatSender();
    this.broadcastStoreSubscription();

    // reset lines because master must rebuild them
    getRtcStore().removeAllLines();

    // reinitialize configs so the new master can handle sessions
    Object.values(getRtcStore().configs ?? {}).forEach((config) => {
      this.add(config);
    });
  }

  // ------------------------------------------------------------
  //  Session Command Handling
  // ------------------------------------------------------------
  private handleSessionCommand(msg: Extract<RtcBroadcastMessage, { type: 'SESSION_COMMAND' }>) {
    const { method, configKey, args } = msg;
    this.instances.get(configKey)?.config.engine
    let session = null
    switch (this.instances.get(configKey)?.config.engine) {
      case "hybrid":
        session = this.getHybridSessionMethodsBy({ configKey });
        break;
      case "janus":
        session = this.getJanusSessionMethodsBy({ configKey });
        break;
      case "sip":
        session = this.getSipSessionMethodsBy({ configKey });
        break;
      default:
        session = this.getSipSessionMethodsBy({ configKey });
        break
    }

    if (session && (session as any)[method]) {
      console.log('handleSessionCommand', { method, configKey, args });
      (session as any)[method](...args);
    }
  }

  // ------------------------------------------------------------
  //  Command Handling
  // ------------------------------------------------------------
  private handleCommand(msg: Extract<RtcBroadcastMessage, { type: 'COMMAND' }>) {
    const { method, args } = msg;

    if ((this as any)[method]) {
      console.log('handleCommand', { method, args });
      (this as any)[method](...args);
    }
  }

  // ------------------------------------------------------------
  //  Sync state to followers
  // ------------------------------------------------------------

  private broadcastStoreSubscription() {
    useRtcStore.subscribe(() => {
      this.broadcastStore();
    });
  }

  private broadcastStore() {
    if (!this.isMasterManager) return;

    const store = getRtcStore();

    this.channel.postMessage({
      type: 'SYNC',
      tabIds: [...this.subscribedTabIds],
      payload: {
        configs: store.configs,
        statuses: store.statuses,
        lines: serializeLines(store.lines),
        configKeysByLineKey: store.configKeysByLineKey,
        lineKeyByRemoteNumber_ConfigKey: store.lineKeyByRemoteNumber_ConfigKey,
      },
    });
  }

  /**
   * Hook for reactively watching session data (delegates to Zustand store).
   */
  public useWatchLineData = useWatchLineData;

  /**
   * Hook for reactively watching added configs and line rendering (delegates to Zustand store).
   *
   * Recommended for rendering `Lines` with unique key(config.key)
   */
  public useWatchConfigs = useWatchConfigs;

  /**
   * Update the configuration for an existing RTC instance.
   *
   * - Replaces stored config in memory and global store.
   * - Does **not** automatically reconnect or restart the Engine.
   *
   * Use `reconnect()` if runtime behavior must change.
   *
   * @param configKey - Unique identifier of the RTC instance
   * @param config - Updated RTC configuration
   */
  private updateConfig(configKey: string, config: RtcManagerConfig) {
    const { instance } = this.instances.get(configKey) as RtcManagerInstance;

    this.instances.set(configKey, { config, instance });
    getRtcStore().setConfig(configKey, config as RtcConfig);
  }

  /**
   * Add or update a RTC account.
   *
   * - If identical config exists → ignored.
   * - If same `configKey` but config changed → updates config + re-initializes media streams.
   * - Otherwise → creates and initializes a new Engine instance.
   *
   * @param config - RTC account configuration (must contain account info, optional `key`)
   */
  public async add(config: RtcManagerConfig): Promise<void> {
    const configKey = config?.key ?? config?.account?.username;
    const mergedConfig = deepMerge(defaultRtcConfig, { ...config, key: configKey } as RtcConfig);

    if (!this.isMasterManager) {
      return;
    }
    if (
      this.instances.has(configKey) &&
      isEqual(this.instances.get(configKey)?.config, mergedConfig)
    ) {
      console.warn(`⚠️ RTC instance for ${configKey} already exists.`);
      return;
    }

    if (this.instances.has(configKey)) {
      this.updateConfig(configKey, mergedConfig);
      queueMicrotask(() => {
        this.reconnectTransport(configKey);
      });

      return;
    }

    let instance = null;
    console.log(111, { mergedConfig })
    switch (mergedConfig.engine) {
      case 'sip':
        instance = new SipEngineInitializer(mergedConfig, configKey);
        break;
      case 'janus':
        instance = new JanusEngineInitializer(mergedConfig, configKey);
        break;
      case 'hybrid':
        instance = new HybridEngineInitializer(mergedConfig, configKey);
        break;
      default:
        throw new Error('RTC-Kit engine must be defined!');
    }
    await instance.init();
    getRtcStore().setConfig(configKey, mergedConfig);
    this.instances.set(configKey, { config: mergedConfig, instance });
  }

  /**
   * Get high-level session methods (answer, dial, hold, transfer, etc.).
   *
   * Resolves the RTC instance by `configKey`, `lineKey`, or `remoteNumber`.
   */
  public getSipSessionMethodsBy(key: GetMethodsKey) {
    const store = getRtcStore();
    let configKey: string = '';

    if ('configKey' in key && key.configKey) {
      configKey = key.configKey;
    } else if ('lineKey' in key && key.lineKey) {
      configKey = store.getConfigKeyByLineKey(key.lineKey) ?? '';
    }

    const methods = sipSessionMethods({ configKey });
    if (this.isMasterManager) return methods;

    return new Proxy(methods, {
      get: (_, prop: string) => {
        return (...args: any[]) => {
          this.channel.postMessage({
            type: 'SESSION_COMMAND',
            method: prop,
            configKey,
            args,
          });
        };
      },
    });
  }
  public getJanusSessionMethodsBy(key: GetMethodsKey) {
    const store = getRtcStore();
    let configKey: string = '';

    if ('configKey' in key && key.configKey) {
      configKey = key.configKey;
    } else if ('lineKey' in key && key.lineKey) {
      configKey = store.getConfigKeyByLineKey(key.lineKey) ?? '';
    }

    const methods = janusSessionMethods({ configKey });
    if (this.isMasterManager) return methods;

    return new Proxy(methods, {
      get: (_, prop: string) => {
        return (...args: any[]) => {
          this.channel.postMessage({
            type: 'SESSION_COMMAND',
            method: prop,
            configKey,
            args,
          });
        };
      },
    });
  }
  public getHybridSessionMethodsBy(key: GetMethodsKey) {
    const store = getRtcStore();
    let configKey: string = '';

    if ('configKey' in key && key.configKey) {
      configKey = key.configKey;
    } else if ('lineKey' in key && key.lineKey) {
      configKey = store.getConfigKeyByLineKey(key.lineKey) ?? '';
    }

    const methods = hybridSessionMethods({ configKey });
    if (this.isMasterManager) return methods;

    return new Proxy(methods, {
      get: (_, prop: string) => {
        return (...args: any[]) => {
          this.channel.postMessage({
            type: 'SESSION_COMMAND',
            method: prop,
            configKey,
            args,
          });
        };
      },
    });
  }

  /**
   * Get RTC account state.
   *
   * Resolves account by `configKey`, `lineKey`, or `remoteNumber`.
   * Returns reactive account information and watcher hook.
   */
  public getAccountBy(key: GetAccountKey) {
    const store = getRtcStore();
    let configKey: string = '';

    if ('configKey' in key && key.configKey) {
      configKey = key.configKey;
    } else if ('lineKey' in key && key.lineKey) {
      configKey = store.getConfigKeyByLineKey(key.lineKey) ?? '';
    }

    return {
      status: (store.statuses?.[configKey] ?? 'disconnected') as RtcEngineStatus,
      lines: Object.values(store.lines[configKey] ?? []),
      watch: useRtcManager({ configKey }),
    };
  }

  /** Check if an instance exists for the given configKey. */
  public has(configKey: string) {
    return this.instances.has(configKey);
  }

  /** Force reconnect transport for an existing RTC instance. */
  public reconnectTransport(configKey: string): void {
    if (!this.isMasterManager)
      return this.channel.postMessage({
        type: 'COMMAND',
        method: 'reconnectTransport',
        configKey,
        args: [configKey, undefined, true],
      });
    reconnectTransport(configKey, undefined, true);
  }

  /** Force refresh registration for an existing RTC Engine. */
  public refreshRegistration(configKey: string): void {
    if (!this.isMasterManager)
      return this.channel.postMessage({
        type: 'COMMAND',
        method: 'refreshRegistration',
        args: [configKey],
      });
    switch (this.instances.get(configKey)?.config.engine) {
      case 'sip':
        sipReconnect(configKey);
        break;
      case 'janus':
        janusReconnect(configKey)
        break;
      case 'hybrid':
        hybridReconnect(configKey)
        break;
    }
  }

  /**
   * Stop and remove a RTC instance.
   * Cleans up associated data from the global store.
   */
  public async stop(configKey: string) {
    const instance = this.instances.get(configKey)?.instance;
    if (instance) {
      await instance.stop();
      this.instances.delete(configKey);
      getRtcStore().remove(configKey);
    }
  }

  /** Stop and clear all RTC instances (e.g., on logout). */
  public async stopAll() {
    await this.stopAllInstances();
    getRtcStore().removeAll();
  }

  private async stopAllInstances() {
    for (const [_, { instance }] of this.instances) {
      await instance.stop();
    }
    this.instances.clear();
  }

  /* -------------------------------------------------------------------------- */
  /* Store lookups (wrappers around global SipStore)                            */
  /* -------------------------------------------------------------------------- */

  /** Lookup a line by `lineKey` or `remoteNumber`. */
  public getLineBy(key: LineLookup): LineType | null {
    const store = getRtcStore();

    if ('lineKey' in key && key?.lineKey) {
      return store.getLineByLineKey(key.lineKey);
    }

    if ('remoteNumber' in key && key?.remoteNumber && 'configKey' in key && key?.configKey) {
      const lineKey = store.getLineKeyByRemoteNumber_ConfigKey(key);
      return lineKey ? store.getLineByLineKey(lineKey) : null;
    }

    return null;
  }

  /** Lookup a session by `lineKey` or `remoteNumber`. */
  // TODO HybridSessionType missed
  public getSessionBy<T extends SipSessionType | JanusSessionType>(key: LineLookup): T | null {
    const store = getRtcStore();

    if ('lineKey' in key && key?.lineKey) {
      return store.getSessionByLineKey(key.lineKey) as T;
    }

    if ('remoteNumber' in key && key?.remoteNumber && 'configKey' in key && key?.configKey) {
      const lineKey = store.getLineKeyByRemoteNumber_ConfigKey(key);
      return lineKey ? store.getSessionByLineKey(lineKey) as T : null;
    }

    return null;
  }

  /** Resolve the `configKey` for a given `lineKey` or `remoteNumber`. */
  public getConfigKeyBy(key: LineLookup): string | null {
    const store = getRtcStore();
    if ('lineKey' in key && key?.lineKey) {
      return store.getConfigKeyByLineKey(key.lineKey);
    }

    if ('remoteNumber' in key && key?.remoteNumber && 'configKey' in key && key?.configKey) {
      return store.getConfigKeyByRemoteNumber_ConfigKey(key);
    }

    return null;
  }

  public get isMaster() {
    return this.isMasterManager;
  }
}
