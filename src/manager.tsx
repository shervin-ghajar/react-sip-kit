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
export class SipManager {
  private instances = new Map<
    string,
    {
      config: SipManagerConfig;
      instance: SipInitializer;
    }
  >();

  /**
   * Create and initialize a SIP session for an account
   */
  public async add(config: SipManagerConfig): Promise<void> {
    const username = config.account.username;

    if (this.instances.has(username) && isEqual(this.instances.get(username)?.config, config)) {
      console.warn(`⚠️ SIP instance for ${username} already exists.`);
      return;
    }
    if (this.instances.has(username)) {
      initilizeMediaStreams(config as SipConfigs);
    }

    const instance = new SipInitializer(deepMerge(defaultSipConfigs, config as SipConfigs));
    await instance.init();

    this.instances.set(username, { config, instance });
  }

  /**
   * Get an existing SIP methods by username
   */
  public methods(username: string) {
    return sessionMethods({ username });
  }

  /**
   * Get an existing SIP by username
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
   * Check the existance of SIP instance by username
   */
  public has(username: string) {
    return this.instances.has(username);
  }

  /**
   * Stop and remove a SIP session
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
   * Stop and clear all SIP sessions
   */
  public async stopAll() {
    for (const [_, { instance }] of this.instances) {
      await instance.stop();
    }
    getSipStore().removeAll();
    this.instances.clear();
  }

  /* -------------------------------------------------------------------------- */
  /* Store lookups as Manager methods                                           */
  /* -------------------------------------------------------------------------- */

  public getUsernameByNumber(lineNumber: LineType['lineNumber']) {
    return getSipStore().getUsernameByNumber(lineNumber);
  }

  public getSessionByNumber(lineNumber: LineType['lineNumber']) {
    return getSipStore().getSessionByNumber(lineNumber);
  }
}
