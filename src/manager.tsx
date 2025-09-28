import { defaultSipConfigs } from './configs';
import { SipConfigs } from './configs/types';
import { reconnectTransport } from './events/transport';
import { useSipManager, useWatchSessionData } from './hooks';
import { SipInitializer } from './initializer';
import { initilizeMediaStreams } from './methods/initialization';
import { sessionMethods } from './methods/session';
import { getSipStore } from './store';
import { LineType, SipUserAgentStatus } from './store/types';
import {
  GetAccountKey,
  GetMethodsKey,
  LineLookup,
  SipManagerConfig,
  SipManagerInstance,
} from './types';
import { deepMerge } from './utils';
import isEqual from 'lodash.isequal';

/* -------------------------------------------------------------------------- */
/*  SIP Manager - Central orchestrator for multiple SIP accounts               */
/* -------------------------------------------------------------------------- */

export class SipManager {
  /**
   * Active SIP instances keyed by `configKey`.
   *
   * `configKey` defaults to `config.account.username` if not explicitly provided.
   * Ensures multiple accounts (e.g., same username on different domains) can coexist.
   */
  private instances = new Map<string, SipManagerInstance>();

  /**
   * Hook for reactively watching session data (delegates to Zustand store).
   */
  public useWatchSessionData = useWatchSessionData;

  /**
   * Update the configuration for an existing SIP instance.
   *
   * - Replaces stored config in memory and global store.
   * - Does **not** automatically reconnect or restart the UserAgent.
   *
   * Use `initilizeMediaStreams` or `reconnect()` if runtime behavior must change.
   *
   * @param configKey - Unique identifier of the SIP instance
   * @param config - Updated SIP configuration
   */
  private updateConfig(configKey: string, config: SipManagerConfig) {
    const { instance } = this.instances.get(configKey) as SipManagerInstance;

    this.instances.set(configKey, { config, instance });
    getSipStore().setConfig(configKey, config as SipConfigs);
  }

  /**
   * Add or update a SIP account.
   *
   * - If identical config exists → ignored.
   * - If same `configKey` but config changed → updates config + re-initializes media streams.
   * - Otherwise → creates and initializes a new UserAgent instance.
   *
   * @param config - SIP account configuration (must contain account info, optional `key`)
   */
  public async add(config: SipManagerConfig): Promise<void> {
    const configKey = config?.key ?? config.account.username;

    if (this.instances.has(configKey) && isEqual(this.instances.get(configKey)?.config, config)) {
      console.warn(`⚠️ SIP instance for ${configKey} already exists.`);
      return;
    }

    if (this.instances.has(configKey)) {
      initilizeMediaStreams(config as SipConfigs);
      this.updateConfig(configKey, config);
      return;
    }

    const instance = new SipInitializer(
      deepMerge(defaultSipConfigs, config as SipConfigs),
      configKey,
    );
    await instance.init();

    this.instances.set(configKey, { config, instance });
  }

  /**
   * Get high-level session methods (answer, dial, hold, transfer, etc.).
   *
   * Resolves the SIP instance by `configKey`, `lineKey`, or `remoteNumber`.
   */
  public getSessionMethodsBy(key: GetMethodsKey) {
    const store = getSipStore();
    let configKey: string = '';

    if ('configKey' in key && key.configKey) {
      configKey = key.configKey;
    } else if ('lineKey' in key && key.lineKey) {
      configKey = store.getConfigKeyByLineKey(key.lineKey) ?? '';
    } else if ('remoteNumber' in key && key.remoteNumber) {
      configKey = store.getConfigKeyByRemoteNumber(key.remoteNumber) ?? '';
    }

    return sessionMethods({ configKey });
  }

  /**
   * Get SIP account state.
   *
   * Resolves account by `configKey`, `lineKey`, or `remoteNumber`.
   * Returns reactive account information and watcher hook.
   */
  public getAccountBy(key: GetAccountKey) {
    const store = getSipStore();
    let configKey: string = '';

    if ('configKey' in key && key.configKey) {
      configKey = key.configKey;
    } else if ('lineKey' in key && key.lineKey) {
      configKey = store.getConfigKeyByLineKey(key.lineKey) ?? '';
    } else if ('remoteNumber' in key && key.remoteNumber) {
      configKey = store.getConfigKeyByRemoteNumber(key.remoteNumber) ?? '';
    }

    return {
      status: (store.statuses?.[configKey] ?? 'disconnected') as SipUserAgentStatus,
      lines: Object.values(store.lines[configKey] ?? []),
      watch: useSipManager({ configKey }),
    };
  }

  /** Check if an instance exists for the given configKey. */
  public has(configKey: string) {
    return this.instances.has(configKey);
  }

  /** Force reconnect transport for an existing SIP instance. */
  public reconnect(configKey: string): void {
    reconnectTransport(configKey);
  }

  /**
   * Stop and remove a SIP instance.
   * Cleans up associated data from the global store.
   */
  public async stop(configKey: string) {
    const instance = this.instances.get(configKey)?.instance;
    if (instance) {
      await instance.stop();
      this.instances.delete(configKey);
      getSipStore().remove(configKey);
    }
  }

  /** Stop and clear all SIP instances (e.g., on logout). */
  public async stopAll() {
    for (const [_, { instance }] of this.instances) {
      await instance.stop();
    }
    getSipStore().removeAll();
    this.instances.clear();
  }

  /* -------------------------------------------------------------------------- */
  /* Store lookups (wrappers around global SipStore)                            */
  /* -------------------------------------------------------------------------- */

  /** Lookup a line by `lineKey` or `remoteNumber`. */
  public getLineBy(key: LineLookup): LineType | null {
    const store = getSipStore();

    if ('lineKey' in key && key?.lineKey) {
      return store.findLineByLineKey(key.lineKey);
    }

    if ('remoteNumber' in key && key?.remoteNumber) {
      const lineKey = store.getLineKeyByRemoteNumber(key.remoteNumber);
      return lineKey ? store.findLineByLineKey(lineKey) : null;
    }

    return null;
  }

  /** Lookup a session by `lineKey` or `remoteNumber`. */
  public getSessionBy(key: LineLookup) {
    const store = getSipStore();

    if ('lineKey' in key && key?.lineKey) {
      return store.getSessionByLineKey(key.lineKey);
    }

    if ('remoteNumber' in key && key?.remoteNumber) {
      const lineKey = store.getLineKeyByRemoteNumber(key.remoteNumber);
      return lineKey ? store.getSessionByLineKey(lineKey) : null;
    }

    return null;
  }

  /** Resolve the `configKey` for a given `lineKey` or `remoteNumber`. */
  public getConfigKeyBy(key: LineLookup): string | null {
    const store = getSipStore();
    if ('lineKey' in key && key?.lineKey) {
      return store.getConfigKeyByLineKey(key.lineKey);
    }

    if ('remoteNumber' in key && key?.remoteNumber) {
      return store.getConfigKeyByRemoteNumber(key.remoteNumber);
    }

    return null;
  }
}
