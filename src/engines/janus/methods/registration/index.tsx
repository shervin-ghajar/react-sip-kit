import { RtcConfig } from "../../../../configs/types";
import { getEngineInstance } from "../../../../store";
import { JanusInstance } from "../../types";


export function refreshRegistration(configKey: RtcConfig['key']) {
  const janusInstance = getEngineInstance(configKey) as JanusInstance
  if (!janusInstance) return;
  if (janusInstance.isConnected()) return;
  janusInstance.reconnect({
    success() {
      console.log(`${configKey} reconnected successfully`)
    },
    error(error) {
      console.log(`${configKey} reconnect error:`, error)
    },
  })
}
