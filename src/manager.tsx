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
  // Active SIP instances, keyed by username
  private instances = new Map<string, SipManagerInstance>();
  public useWatchSessionData = useWatchSessionData;
  /**
   * Update the configuration for an existing SIP instance.
   * - Updates both local instance map and global store.
   * - Does NOT restart or reconnect automatically.
   *
   * Use `initilizeMediaStreams` or `reconnect()` if runtime behavior must change.
   *
   * @param username - SIP account username
   * @param config - Updated SIP configuration
   */
  private updateConfig(username: string, config: SipManagerConfig) {
    const { instance } = this.instances.get(username) as SipManagerInstance;

    this.instances.set(username, { config, instance });
    getSipStore().setConfig(username, config as SipConfigs);
  }

  /**
   * Add a new SIP account, or update an existing one if the config has changed.
   *
   * - If identical config already exists → ignored.
   * - If username exists with a different config → re-initializes media streams.
   * - Otherwise → creates and initializes a new SIP instance.
   *
   * @param config - SIP account configuration
   */
  public async add(config: SipManagerConfig): Promise<void> {
    const username = config.account.username;

    // Prevent duplicate identical configs
    if (this.instances.has(username) && isEqual(this.instances.get(username)?.config, config)) {
      console.warn(`⚠️ SIP instance for ${username} already exists.`);
      return;
    }

    // If username exists but config has changed, re-init media streams
    if (this.instances.has(username)) {
      initilizeMediaStreams(config as SipConfigs);
      this.updateConfig(username, config);
      return;
    }

    // Merge with defaults and initialize a new SIP UA instance
    const instance = new SipInitializer(deepMerge(defaultSipConfigs, config as SipConfigs));
    await instance.init();

    // Store instance + config for future lookups
    this.instances.set(username, { config, instance });
  }

  /**
   * Get session methods (dial, answer, hold, etc.) for a live session.
   *
   * Resolves the session by `username`, `lineKey`, or `remoteNumber`.
   *
   * @param key - Identifier for session resolution
   */
  public getSessionMethodsBy(key: GetMethodsKey) {
    const store = getSipStore();

    let username: string = '';

    if ('username' in key && key.username) {
      username = key.username;
    } else if ('lineKey' in key && key.lineKey) {
      username = store.getUsernameByLineKey(key.lineKey) ?? '';
    } else if ('remoteNumber' in key && key.remoteNumber) {
      username = store.getUsernameByRemoteNumber(key.remoteNumber) ?? '';
    }

    return sessionMethods({ username });
  }

  /**
   * Get SIP account state.
   *
   * Resolves the account by `username`, `lineKey`, or `remoteNumber`.
   *
   * @param key - Identifier for account resolution
   * @returns Object containing:
   *   - `status` → UA status
   *   - `lines` → all active lines
   *   - `watch` → reactive watcher hook
   */
  public getAccountBy(key: GetAccountKey) {
    const store = getSipStore();

    let username: string = '';

    if ('username' in key && key.username) {
      username = key.username;
    } else if ('lineKey' in key && key.lineKey) {
      username = store.getUsernameByLineKey(key.lineKey) ?? '';
    } else if ('remoteNumber' in key && key.remoteNumber) {
      username = store.getUsernameByRemoteNumber(key.remoteNumber) ?? '';
    }

    return {
      status: (store.statuses?.[username] ?? 'disconnected') as SipUserAgentStatus,
      lines: Object.values(store.lines[username] ?? []),
      watch: useSipManager({ username }),
    };
  }

  /**
   * Check if an instance exists for the given username.
   */
  public has(username: string) {
    return this.instances.has(username);
  }

  /**
   * Reconnect transport for an existing SIP instance.
   */
  public reconnect(username: string): void {
    reconnectTransport(username);
  }

  /**
   * Stop and remove a SIP instance by username.
   * Also removes related data from the global store.
   */
  public async stop(username: string) {
    const instance = this.instances.get(username)?.instance;
    if (instance) {
      await instance.stop();
      this.instances.delete(username);
      getSipStore().remove(username);
    }
  }

  /**
   * Stop and clear all SIP instances.
   * Useful for logout or application shutdown.
   */
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

  /**
   * Get a Line by either `lineKey` or `remoteNumber`.
   *
   * @param key - Lookup key (mutually exclusive)
   * @returns Line if found, otherwise null
   */
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

  /**
   * Get a SIP session by either `lineKey` or `remoteNumber`.
   *
   * @param key - Lookup key (mutually exclusive)
   * @returns SIP session if found, otherwise null
   */
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

  /**
   * Get a username by either `lineKey` or `remoteNumber`.
   *
   * @param key - Lookup key (mutually exclusive)
   * @returns Username if found, otherwise null
   */
  public getUsernameBy(key: LineLookup): string | null {
    const store = getSipStore();

    if ('lineKey' in key && key?.lineKey) {
      return store.getUsernameByLineKey(key.lineKey);
    }

    if ('remoteNumber' in key && key?.remoteNumber) {
      return store.getUsernameByRemoteNumber(key.remoteNumber);
    }

    return null;
  }
}
