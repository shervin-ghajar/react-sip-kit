import { defaultSipConfigs } from './configs';
import { SipConfigs } from './configs/types';
import { useSipManager } from './hooks';
import { SipInitializer } from './initializer';
import { initilizeMediaStreams } from './methods/initialization';
import { sessionMethods } from './methods/session';
import { getSipStore } from './store';
import { LineType, SipUserAgentStatus } from './store/types';
import { SipManagerConfig } from './types';
import { deepMerge } from './utils';
import isEqual from 'lodash.isequal';

/* -------------------------------------------------------------------------- */
/*  SIP Manager - Central orchestrator for multiple SIP accounts               */
/* -------------------------------------------------------------------------- */

export class SipManager {
  // Holds active SIP instances, keyed by username
  private instances = new Map<
    string,
    {
      config: SipManagerConfig;
      instance: SipInitializer;
    }
  >();

  /**
   * Create and initialize a SIP session for an account.
   *
   * @param {SipManagerConfig} config - SIP account configuration (account, transport, registration, etc.)
   * @returns {Promise<void>} Resolves when initialization is complete.
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
    }

    // Merge with defaults and initialize a new SIP UA instance
    const instance = new SipInitializer(deepMerge(defaultSipConfigs, config as SipConfigs));
    await instance.init();

    // Store instance + config for future lookups
    this.instances.set(username, { config, instance });
  }

  /**
   * Get session methods (dial, answer, hold, etc.) for a given username.
   *
   * @param {string} username - The SIP account username.
   * @returns {ReturnType<typeof sessionMethods>} Object containing call/session methods.
   */
  public methods(username: string) {
    return sessionMethods({ username });
  }

  /**
   * Get SIP account state by username.
   *
   * @param {string} username - The SIP account username.
   * @returns {{
   *   status: SipUserAgentStatus;
   *   lines: LineType[];
   *   watch: ReturnType<typeof useSipManager>;
   * }} An object with account status, active lines, and a reactive watcher hook.
   */
  public get(username: string) {
    const { lines, statuses } = getSipStore();
    return {
      status: (statuses?.[username] ?? 'disconnected') as SipUserAgentStatus,
      lines: Object.values(lines[username] ?? []),
      watch: useSipManager({ username }),
    };
  }

  /**
   * Check if a SIP instance already exists for the username.
   *
   * @param {string} username - The SIP account username.
   * @returns {boolean} True if the instance exists, false otherwise.
   */
  public has(username: string) {
    return this.instances.has(username);
  }

  /**
   * Stop and remove a SIP session for a username.
   * Also cleans up from the global store.
   *
   * @param {string} username - The SIP account username.
   * @returns {Promise<void>} Resolves when the session is stopped and removed.
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
   * Stop and clear ALL SIP sessions.
   * Useful on logout or app shutdown.
   *
   * @returns {Promise<void>} Resolves when all sessions are stopped and cleared.
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
   * Find the username associated with a specific line number.
   *
   * @param {LineType['lineNumber']} lineNumber - The line number to look up.
   * @returns {string | undefined} The username if found, otherwise undefined.
   */
  public getUsernameByNumber(lineNumber: LineType['lineNumber']) {
    return getSipStore().getUsernameByNumber(lineNumber);
  }

  /**
   * Find the SIP session associated with a specific line number.
   *
   * @param {LineType['lineNumber']} lineNumber - The line number to look up.
   * @returns {any} The SIP session object if found, otherwise undefined.
   */
  public getSessionByNumber(lineNumber: LineType['lineNumber']) {
    return getSipStore().getSessionByNumber(lineNumber);
  }
}
