import React, { createContext, useMemo, useEffect, useCallback, useContext } from 'react';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var jsxRuntime = {exports: {}};

var reactJsxRuntime_production = {};

/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production;

function requireReactJsxRuntime_production () {
	if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
	hasRequiredReactJsxRuntime_production = 1;
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	  REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
	  var key = null;
	  void 0 !== maybeKey && (key = "" + maybeKey);
	  void 0 !== config.key && (key = "" + config.key);
	  if ("key" in config) {
	    maybeKey = {};
	    for (var propName in config)
	      "key" !== propName && (maybeKey[propName] = config[propName]);
	  } else maybeKey = config;
	  config = maybeKey.ref;
	  return {
	    $$typeof: REACT_ELEMENT_TYPE,
	    type: type,
	    key: key,
	    ref: void 0 !== config ? config : null,
	    props: maybeKey
	  };
	}
	reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
	reactJsxRuntime_production.jsx = jsxProd;
	reactJsxRuntime_production.jsxs = jsxProd;
	return reactJsxRuntime_production;
}

var reactJsxRuntime_development = {};

/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_development;

function requireReactJsxRuntime_development () {
	if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
	hasRequiredReactJsxRuntime_development = 1;
	"production" !== process.env.NODE_ENV &&
	  (function () {
	    function getComponentNameFromType(type) {
	      if (null == type) return null;
	      if ("function" === typeof type)
	        return type.$$typeof === REACT_CLIENT_REFERENCE
	          ? null
	          : type.displayName || type.name || null;
	      if ("string" === typeof type) return type;
	      switch (type) {
	        case REACT_FRAGMENT_TYPE:
	          return "Fragment";
	        case REACT_PROFILER_TYPE:
	          return "Profiler";
	        case REACT_STRICT_MODE_TYPE:
	          return "StrictMode";
	        case REACT_SUSPENSE_TYPE:
	          return "Suspense";
	        case REACT_SUSPENSE_LIST_TYPE:
	          return "SuspenseList";
	        case REACT_ACTIVITY_TYPE:
	          return "Activity";
	      }
	      if ("object" === typeof type)
	        switch (
	          ("number" === typeof type.tag &&
	            console.error(
	              "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
	            ),
	          type.$$typeof)
	        ) {
	          case REACT_PORTAL_TYPE:
	            return "Portal";
	          case REACT_CONTEXT_TYPE:
	            return (type.displayName || "Context") + ".Provider";
	          case REACT_CONSUMER_TYPE:
	            return (type._context.displayName || "Context") + ".Consumer";
	          case REACT_FORWARD_REF_TYPE:
	            var innerType = type.render;
	            type = type.displayName;
	            type ||
	              ((type = innerType.displayName || innerType.name || ""),
	              (type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef"));
	            return type;
	          case REACT_MEMO_TYPE:
	            return (
	              (innerType = type.displayName || null),
	              null !== innerType
	                ? innerType
	                : getComponentNameFromType(type.type) || "Memo"
	            );
	          case REACT_LAZY_TYPE:
	            innerType = type._payload;
	            type = type._init;
	            try {
	              return getComponentNameFromType(type(innerType));
	            } catch (x) {}
	        }
	      return null;
	    }
	    function testStringCoercion(value) {
	      return "" + value;
	    }
	    function checkKeyStringCoercion(value) {
	      try {
	        testStringCoercion(value);
	        var JSCompiler_inline_result = !1;
	      } catch (e) {
	        JSCompiler_inline_result = true;
	      }
	      if (JSCompiler_inline_result) {
	        JSCompiler_inline_result = console;
	        var JSCompiler_temp_const = JSCompiler_inline_result.error;
	        var JSCompiler_inline_result$jscomp$0 =
	          ("function" === typeof Symbol &&
	            Symbol.toStringTag &&
	            value[Symbol.toStringTag]) ||
	          value.constructor.name ||
	          "Object";
	        JSCompiler_temp_const.call(
	          JSCompiler_inline_result,
	          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
	          JSCompiler_inline_result$jscomp$0
	        );
	        return testStringCoercion(value);
	      }
	    }
	    function getTaskName(type) {
	      if (type === REACT_FRAGMENT_TYPE) return "<>";
	      if (
	        "object" === typeof type &&
	        null !== type &&
	        type.$$typeof === REACT_LAZY_TYPE
	      )
	        return "<...>";
	      try {
	        var name = getComponentNameFromType(type);
	        return name ? "<" + name + ">" : "<...>";
	      } catch (x) {
	        return "<...>";
	      }
	    }
	    function getOwner() {
	      var dispatcher = ReactSharedInternals.A;
	      return null === dispatcher ? null : dispatcher.getOwner();
	    }
	    function UnknownOwner() {
	      return Error("react-stack-top-frame");
	    }
	    function hasValidKey(config) {
	      if (hasOwnProperty.call(config, "key")) {
	        var getter = Object.getOwnPropertyDescriptor(config, "key").get;
	        if (getter && getter.isReactWarning) return false;
	      }
	      return void 0 !== config.key;
	    }
	    function defineKeyPropWarningGetter(props, displayName) {
	      function warnAboutAccessingKey() {
	        specialPropKeyWarningShown ||
	          ((specialPropKeyWarningShown = true),
	          console.error(
	            "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
	            displayName
	          ));
	      }
	      warnAboutAccessingKey.isReactWarning = true;
	      Object.defineProperty(props, "key", {
	        get: warnAboutAccessingKey,
	        configurable: true
	      });
	    }
	    function elementRefGetterWithDeprecationWarning() {
	      var componentName = getComponentNameFromType(this.type);
	      didWarnAboutElementRef[componentName] ||
	        ((didWarnAboutElementRef[componentName] = true),
	        console.error(
	          "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
	        ));
	      componentName = this.props.ref;
	      return void 0 !== componentName ? componentName : null;
	    }
	    function ReactElement(
	      type,
	      key,
	      self,
	      source,
	      owner,
	      props,
	      debugStack,
	      debugTask
	    ) {
	      self = props.ref;
	      type = {
	        $$typeof: REACT_ELEMENT_TYPE,
	        type: type,
	        key: key,
	        props: props,
	        _owner: owner
	      };
	      null !== (void 0 !== self ? self : null)
	        ? Object.defineProperty(type, "ref", {
	            enumerable: false,
	            get: elementRefGetterWithDeprecationWarning
	          })
	        : Object.defineProperty(type, "ref", { enumerable: false, value: null });
	      type._store = {};
	      Object.defineProperty(type._store, "validated", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: 0
	      });
	      Object.defineProperty(type, "_debugInfo", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: null
	      });
	      Object.defineProperty(type, "_debugStack", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: debugStack
	      });
	      Object.defineProperty(type, "_debugTask", {
	        configurable: false,
	        enumerable: false,
	        writable: true,
	        value: debugTask
	      });
	      Object.freeze && (Object.freeze(type.props), Object.freeze(type));
	      return type;
	    }
	    function jsxDEVImpl(
	      type,
	      config,
	      maybeKey,
	      isStaticChildren,
	      source,
	      self,
	      debugStack,
	      debugTask
	    ) {
	      var children = config.children;
	      if (void 0 !== children)
	        if (isStaticChildren)
	          if (isArrayImpl(children)) {
	            for (
	              isStaticChildren = 0;
	              isStaticChildren < children.length;
	              isStaticChildren++
	            )
	              validateChildKeys(children[isStaticChildren]);
	            Object.freeze && Object.freeze(children);
	          } else
	            console.error(
	              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
	            );
	        else validateChildKeys(children);
	      if (hasOwnProperty.call(config, "key")) {
	        children = getComponentNameFromType(type);
	        var keys = Object.keys(config).filter(function (k) {
	          return "key" !== k;
	        });
	        isStaticChildren =
	          0 < keys.length
	            ? "{key: someKey, " + keys.join(": ..., ") + ": ...}"
	            : "{key: someKey}";
	        didWarnAboutKeySpread[children + isStaticChildren] ||
	          ((keys =
	            0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}"),
	          console.error(
	            'A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />',
	            isStaticChildren,
	            children,
	            keys,
	            children
	          ),
	          (didWarnAboutKeySpread[children + isStaticChildren] = true));
	      }
	      children = null;
	      void 0 !== maybeKey &&
	        (checkKeyStringCoercion(maybeKey), (children = "" + maybeKey));
	      hasValidKey(config) &&
	        (checkKeyStringCoercion(config.key), (children = "" + config.key));
	      if ("key" in config) {
	        maybeKey = {};
	        for (var propName in config)
	          "key" !== propName && (maybeKey[propName] = config[propName]);
	      } else maybeKey = config;
	      children &&
	        defineKeyPropWarningGetter(
	          maybeKey,
	          "function" === typeof type
	            ? type.displayName || type.name || "Unknown"
	            : type
	        );
	      return ReactElement(
	        type,
	        children,
	        self,
	        source,
	        getOwner(),
	        maybeKey,
	        debugStack,
	        debugTask
	      );
	    }
	    function validateChildKeys(node) {
	      "object" === typeof node &&
	        null !== node &&
	        node.$$typeof === REACT_ELEMENT_TYPE &&
	        node._store &&
	        (node._store.validated = 1);
	    }
	    var React$1 = React,
	      REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"),
	      REACT_PORTAL_TYPE = Symbol.for("react.portal"),
	      REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"),
	      REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"),
	      REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	    var REACT_CONSUMER_TYPE = Symbol.for("react.consumer"),
	      REACT_CONTEXT_TYPE = Symbol.for("react.context"),
	      REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"),
	      REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"),
	      REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"),
	      REACT_MEMO_TYPE = Symbol.for("react.memo"),
	      REACT_LAZY_TYPE = Symbol.for("react.lazy"),
	      REACT_ACTIVITY_TYPE = Symbol.for("react.activity"),
	      REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"),
	      ReactSharedInternals =
	        React$1.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE,
	      hasOwnProperty = Object.prototype.hasOwnProperty,
	      isArrayImpl = Array.isArray,
	      createTask = console.createTask
	        ? console.createTask
	        : function () {
	            return null;
	          };
	    React$1 = {
	      "react-stack-bottom-frame": function (callStackForError) {
	        return callStackForError();
	      }
	    };
	    var specialPropKeyWarningShown;
	    var didWarnAboutElementRef = {};
	    var unknownOwnerDebugStack = React$1["react-stack-bottom-frame"].bind(
	      React$1,
	      UnknownOwner
	    )();
	    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
	    var didWarnAboutKeySpread = {};
	    reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
	    reactJsxRuntime_development.jsx = function (type, config, maybeKey, source, self) {
	      var trackActualOwner =
	        1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
	      return jsxDEVImpl(
	        type,
	        config,
	        maybeKey,
	        false,
	        source,
	        self,
	        trackActualOwner
	          ? Error("react-stack-top-frame")
	          : unknownOwnerDebugStack,
	        trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
	      );
	    };
	    reactJsxRuntime_development.jsxs = function (type, config, maybeKey, source, self) {
	      var trackActualOwner =
	        1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
	      return jsxDEVImpl(
	        type,
	        config,
	        maybeKey,
	        true,
	        source,
	        self,
	        trackActualOwner
	          ? Error("react-stack-top-frame")
	          : unknownOwnerDebugStack,
	        trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask
	      );
	    };
	  })();
	return reactJsxRuntime_development;
}

var hasRequiredJsxRuntime;

function requireJsxRuntime () {
	if (hasRequiredJsxRuntime) return jsxRuntime.exports;
	hasRequiredJsxRuntime = 1;

	if (process.env.NODE_ENV === 'production') {
	  jsxRuntime.exports = requireReactJsxRuntime_production();
	} else {
	  jsxRuntime.exports = requireReactJsxRuntime_development();
	}
	return jsxRuntime.exports;
}

var jsxRuntimeExports = requireJsxRuntime();

const defaultAccountConfig = {
    username: '',
    password: '',
    domain: '',
    wssServer: '',
    webSocketPort: 7443,
    serverPath: '/ws',
};
const defaultFeaturesConfig = {
    enableVideo: true,
    enableRingtone: true,
    enableTextMessaging: true,
    enableTransfer: true,
    enableConference: true,
    enableTextExpressions: false,
    enableTextDictate: false,
    enableAlphanumericDial: true,
    enableAccountSettings: true,
    enableAppearanceSettings: true,
    enableNotificationSettings: true,
};
const defaultMediaConfig = {
    audioInputDeviceId: 'default',
    audioOutputDeviceId: 'default',
    videoInputDeviceId: 'default',
    ringerOutputDeviceId: 'default',
    maxFrameRate: 30,
    videoHeight: 720,
    videoAspectRatio: 1.777,
    autoGainControl: true,
    echoCancellation: true,
    noiseSuppression: true,
    mirrorVideo: 'auto',
    maxVideoBandwidth: 1500,
    startVideoFullScreen: false,
};
const defaultPolicyConfig = {
    autoAnswerPolicy: 'manual',
    doNotDisturbPolicy: 'off',
    callWaitingPolicy: 'on',
    callRecordingPolicy: 'manual',
    intercomPolicy: 'off',
};
const defaultRegistrationConfig = {
    transportConnectionTimeout: 5000,
    transportReconnectionAttempts: 3,
    transportReconnectionTimeout: 3000,
    registerExpires: 3600,
    registerExtraHeaders: '',
    registerExtraContactParams: '',
    registerContactParams: '',
    wssInTransport: true,
    ipInContact: false,
    bundlePolicy: 'balanced',
    iceStunServerJson: '',
    iceStunCheckTimeout: 5000,
    subscribeToYourself: false,
    voiceMailSubscribe: false,
    voicemailDid: '',
    subscribeVoicemailExpires: 3600,
    inviteExtraHeaders: '',
    noAnswerTimeout: 30,
};
const defaultStorageConfig = {
    streamBuffer: 1024,
    maxDataStoreDays: 30,
    posterJpegQuality: 80,
};
const defaultRecordingConfig = {
    videoResampleSize: '1280x720',
    recordingVideoSize: '1280x720',
    recordingVideoFps: 30,
    recordingLayout: 'grid',
};
const defaultAdvancedConfig = {
    didLength: 4,
    maxDidLength: 8,
    singleInstance: true,
    chatEngine: 'default',
};
const defaultXmppConfig = {
    server: '',
    websocketPort: '',
    websocketPath: '',
    domain: '',
    profileUser: '',
    realm: '',
    realmSeparator: '',
    chatGroupService: '',
};
const defaultPermissionsConfig = {
    enableSendFiles: true,
    enableSendImages: true,
    enableAudioRecording: true,
    enableVideoRecording: true,
    enableSms: false,
    enableFax: false,
    enableEmail: false,
};
// Unified default config
const defaultSipConfigs = {
    account: defaultAccountConfig,
    features: defaultFeaturesConfig,
    media: defaultMediaConfig,
    policy: defaultPolicyConfig,
    registration: defaultRegistrationConfig,
    storage: defaultStorageConfig,
    recording: defaultRecordingConfig,
    advanced: defaultAdvancedConfig,
    xmpp: defaultXmppConfig,
    permissions: defaultPermissionsConfig,
};

class Line {
    lineNumber; // Unique identifier for the line
    displayNumber; // DID or number associated with the call
    metaData; // Associated buddy object (if any)
    sipSession; // SIP.js Session object for the call
    localSoundMeter; // Placeholder for local audio level meter (if applicable)
    remoteSoundMeter; // Placeholder for remote audio level meter (if applicable)
    constructor(lineNumber, displayNumber, metaData) {
        this.lineNumber = lineNumber;
        this.displayNumber = displayNumber;
        this.metaData = metaData;
        this.sipSession = null;
        this.localSoundMeter = null;
        this.remoteSoundMeter = null;
    }
}

class AudioBlobs {
    static instance;
    audioBlobs;
    constructor(overwrite) {
        this.audioBlobs = {
            Alert: overwrite?.['Alert'] ?? {
                file: 'Alert.mp3',
                url: './src/assets/media/Alert.mp3',
            },
            Ringtone: overwrite?.['Ringtone'] ?? {
                file: 'Ringtone_1.mp3',
                url: './src/assets/media/Ringtone.mp3',
            },
            CallWaiting: overwrite?.['CallWaiting'] ?? {
                file: 'Tone_CallWaiting.mp3',
                url: './src/assets/media/CallWaiting.mp3',
            },
        };
    }
    static getInstance(overwrite) {
        if (!AudioBlobs.instance) {
            AudioBlobs.instance = new AudioBlobs(overwrite);
        }
        return AudioBlobs.instance;
    }
    getAudios() {
        return this.audioBlobs;
    }
}

const createStoreImpl = (createState) => {
  let state;
  const listeners = /* @__PURE__ */ new Set();
  const setState = (partial, replace) => {
    const nextState = typeof partial === "function" ? partial(state) : partial;
    if (!Object.is(nextState, state)) {
      const previousState = state;
      state = (replace != null ? replace : typeof nextState !== "object" || nextState === null) ? nextState : Object.assign({}, state, nextState);
      listeners.forEach((listener) => listener(state, previousState));
    }
  };
  const getState = () => state;
  const getInitialState = () => initialState;
  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };
  const api = { setState, getState, getInitialState, subscribe };
  const initialState = state = createState(setState, getState, api);
  return api;
};
const createStore = (createState) => createState ? createStoreImpl(createState) : createStoreImpl;

const identity = (arg) => arg;
function useStore(api, selector = identity) {
  const slice = React.useSyncExternalStore(
    api.subscribe,
    () => selector(api.getState()),
    () => selector(api.getInitialState())
  );
  React.useDebugValue(slice);
  return slice;
}
const createImpl = (createState) => {
  const api = createStore(createState);
  const useBoundStore = (selector) => useStore(api, selector);
  Object.assign(useBoundStore, api);
  return useBoundStore;
};
const create = (createState) => createState ? createImpl(createState) : createImpl;

/* -------------------------------------------------------------------------- */
// Create sip store
const useSipStore = create((set, get) => ({
    configs: defaultSipConfigs,
    userAgent: undefined,
    devicesInfo: {
        hasVideoDevice: false,
        hasAudioDevice: false,
        hasSpeakerDevice: false,
        audioInputDevices: [],
        videoInputDevices: [],
        speakerDevices: [],
    },
    lines: [],
    audioBlobs: AudioBlobs.getInstance().getAudios(),
    setSipStore: (newState) => set((state) => ({ ...state, ...newState })),
    setUserAgent: (userAgent) => set((state) => ({ ...state, userAgent })),
    addLine: (newLine) => set((state) => ({ ...state, lines: [...state.lines, newLine] })),
    updateLine: (updatedLine) => {
        const updatedLines = get().lines.map((line) => {
            if (line.lineNumber === updatedLine.lineNumber)
                return { ...updatedLine };
            return line;
        });
        set((state) => ({ ...state, lines: updatedLines }));
    },
    removeLine: (lineNumber) => {
        console.log('removeLine');
        const lines = get().lines;
        const filteredLines = lines.filter((line) => line.lineNumber !== lineNumber);
        set((state) => ({ ...state, lines: filteredLines }));
    },
    findLineByNumber: (lineNumber) => {
        return get().lines.find((line) => line.lineNumber === lineNumber) ?? null;
    },
    getNewLineNumber: () => {
        return get().lines.length + 1;
    },
    getSessions: () => {
        const { userAgent } = get();
        if (userAgent == null) {
            console.warn('userAgent is null');
            return null;
        }
        if (userAgent.isRegistered() == false) {
            console.warn('userAgent is not registered');
            return null;
        }
        const sessions = userAgent.sessions ?? null;
        return sessions;
    },
    countIdSessions: (id) => {
        let count = 0;
        if (!get().userAgent?.sessions)
            return count;
        Object.values(get().userAgent?.sessions ?? {}).forEach((session) => {
            if (id !== session.id)
                count++;
        });
        return count;
    },
}));
/* -------------------------------------------------------------------------- */
/**
 *
 * Set sip store for none functional components
 */
const setSipStore = (state) => {
    useSipStore.setState((prev) => ({ ...prev, ...state }));
};
/**
 *
 * Get sip store for none functional components
 */
const getSipStore = () => {
    return useSipStore.getState();
};
/**
 *
 * Get sip store userAgent for none functional components
 */
const getSipStoreUserAgent = () => {
    return useSipStore.getState().userAgent;
};
/**
 *
 * Get sip store configs for none functional components
 */
const getSipStoreConfigs = () => {
    return useSipStore.getState().configs;
};

var clone$1 = {exports: {}};

var hasRequiredClone;

function requireClone () {
	if (hasRequiredClone) return clone$1.exports;
	hasRequiredClone = 1;
	(function (module) {
		var clone = (function() {

		function _instanceof(obj, type) {
		  return type != null && obj instanceof type;
		}

		var nativeMap;
		try {
		  nativeMap = Map;
		} catch(_) {
		  // maybe a reference error because no `Map`. Give it a dummy value that no
		  // value will ever be an instanceof.
		  nativeMap = function() {};
		}

		var nativeSet;
		try {
		  nativeSet = Set;
		} catch(_) {
		  nativeSet = function() {};
		}

		var nativePromise;
		try {
		  nativePromise = Promise;
		} catch(_) {
		  nativePromise = function() {};
		}

		/**
		 * Clones (copies) an Object using deep copying.
		 *
		 * This function supports circular references by default, but if you are certain
		 * there are no circular references in your object, you can save some CPU time
		 * by calling clone(obj, false).
		 *
		 * Caution: if `circular` is false and `parent` contains circular references,
		 * your program may enter an infinite loop and crash.
		 *
		 * @param `parent` - the object to be cloned
		 * @param `circular` - set to true if the object to be cloned may contain
		 *    circular references. (optional - true by default)
		 * @param `depth` - set to a number if the object is only to be cloned to
		 *    a particular depth. (optional - defaults to Infinity)
		 * @param `prototype` - sets the prototype to be used when cloning an object.
		 *    (optional - defaults to parent prototype).
		 * @param `includeNonEnumerable` - set to true if the non-enumerable properties
		 *    should be cloned as well. Non-enumerable properties on the prototype
		 *    chain will be ignored. (optional - false by default)
		*/
		function clone(parent, circular, depth, prototype, includeNonEnumerable) {
		  if (typeof circular === 'object') {
		    depth = circular.depth;
		    prototype = circular.prototype;
		    includeNonEnumerable = circular.includeNonEnumerable;
		    circular = circular.circular;
		  }
		  // maintain two arrays for circular references, where corresponding parents
		  // and children have the same index
		  var allParents = [];
		  var allChildren = [];

		  var useBuffer = typeof Buffer != 'undefined';

		  if (typeof circular == 'undefined')
		    circular = true;

		  if (typeof depth == 'undefined')
		    depth = Infinity;

		  // recurse this function so we don't reset allParents and allChildren
		  function _clone(parent, depth) {
		    // cloning null always returns null
		    if (parent === null)
		      return null;

		    if (depth === 0)
		      return parent;

		    var child;
		    var proto;
		    if (typeof parent != 'object') {
		      return parent;
		    }

		    if (_instanceof(parent, nativeMap)) {
		      child = new nativeMap();
		    } else if (_instanceof(parent, nativeSet)) {
		      child = new nativeSet();
		    } else if (_instanceof(parent, nativePromise)) {
		      child = new nativePromise(function (resolve, reject) {
		        parent.then(function(value) {
		          resolve(_clone(value, depth - 1));
		        }, function(err) {
		          reject(_clone(err, depth - 1));
		        });
		      });
		    } else if (clone.__isArray(parent)) {
		      child = [];
		    } else if (clone.__isRegExp(parent)) {
		      child = new RegExp(parent.source, __getRegExpFlags(parent));
		      if (parent.lastIndex) child.lastIndex = parent.lastIndex;
		    } else if (clone.__isDate(parent)) {
		      child = new Date(parent.getTime());
		    } else if (useBuffer && Buffer.isBuffer(parent)) {
		      if (Buffer.allocUnsafe) {
		        // Node.js >= 4.5.0
		        child = Buffer.allocUnsafe(parent.length);
		      } else {
		        // Older Node.js versions
		        child = new Buffer(parent.length);
		      }
		      parent.copy(child);
		      return child;
		    } else if (_instanceof(parent, Error)) {
		      child = Object.create(parent);
		    } else {
		      if (typeof prototype == 'undefined') {
		        proto = Object.getPrototypeOf(parent);
		        child = Object.create(proto);
		      }
		      else {
		        child = Object.create(prototype);
		        proto = prototype;
		      }
		    }

		    if (circular) {
		      var index = allParents.indexOf(parent);

		      if (index != -1) {
		        return allChildren[index];
		      }
		      allParents.push(parent);
		      allChildren.push(child);
		    }

		    if (_instanceof(parent, nativeMap)) {
		      parent.forEach(function(value, key) {
		        var keyChild = _clone(key, depth - 1);
		        var valueChild = _clone(value, depth - 1);
		        child.set(keyChild, valueChild);
		      });
		    }
		    if (_instanceof(parent, nativeSet)) {
		      parent.forEach(function(value) {
		        var entryChild = _clone(value, depth - 1);
		        child.add(entryChild);
		      });
		    }

		    for (var i in parent) {
		      var attrs;
		      if (proto) {
		        attrs = Object.getOwnPropertyDescriptor(proto, i);
		      }

		      if (attrs && attrs.set == null) {
		        continue;
		      }
		      child[i] = _clone(parent[i], depth - 1);
		    }

		    if (Object.getOwnPropertySymbols) {
		      var symbols = Object.getOwnPropertySymbols(parent);
		      for (var i = 0; i < symbols.length; i++) {
		        // Don't need to worry about cloning a symbol because it is a primitive,
		        // like a number or string.
		        var symbol = symbols[i];
		        var descriptor = Object.getOwnPropertyDescriptor(parent, symbol);
		        if (descriptor && !descriptor.enumerable && !includeNonEnumerable) {
		          continue;
		        }
		        child[symbol] = _clone(parent[symbol], depth - 1);
		        if (!descriptor.enumerable) {
		          Object.defineProperty(child, symbol, {
		            enumerable: false
		          });
		        }
		      }
		    }

		    if (includeNonEnumerable) {
		      var allPropertyNames = Object.getOwnPropertyNames(parent);
		      for (var i = 0; i < allPropertyNames.length; i++) {
		        var propertyName = allPropertyNames[i];
		        var descriptor = Object.getOwnPropertyDescriptor(parent, propertyName);
		        if (descriptor && descriptor.enumerable) {
		          continue;
		        }
		        child[propertyName] = _clone(parent[propertyName], depth - 1);
		        Object.defineProperty(child, propertyName, {
		          enumerable: false
		        });
		      }
		    }

		    return child;
		  }

		  return _clone(parent, depth);
		}

		/**
		 * Simple flat clone using prototype, accepts only objects, usefull for property
		 * override on FLAT configuration object (no nested props).
		 *
		 * USE WITH CAUTION! This may not behave as you wish if you do not know how this
		 * works.
		 */
		clone.clonePrototype = function clonePrototype(parent) {
		  if (parent === null)
		    return null;

		  var c = function () {};
		  c.prototype = parent;
		  return new c();
		};

		// private utility functions

		function __objToStr(o) {
		  return Object.prototype.toString.call(o);
		}
		clone.__objToStr = __objToStr;

		function __isDate(o) {
		  return typeof o === 'object' && __objToStr(o) === '[object Date]';
		}
		clone.__isDate = __isDate;

		function __isArray(o) {
		  return typeof o === 'object' && __objToStr(o) === '[object Array]';
		}
		clone.__isArray = __isArray;

		function __isRegExp(o) {
		  return typeof o === 'object' && __objToStr(o) === '[object RegExp]';
		}
		clone.__isRegExp = __isRegExp;

		function __getRegExpFlags(re) {
		  var flags = '';
		  if (re.global) flags += 'g';
		  if (re.ignoreCase) flags += 'i';
		  if (re.multiline) flags += 'm';
		  return flags;
		}
		clone.__getRegExpFlags = __getRegExpFlags;

		return clone;
		})();

		if (module.exports) {
		  module.exports = clone;
		} 
	} (clone$1));
	return clone$1.exports;
}

var cloneExports = requireClone();
var clone = /*@__PURE__*/getDefaultExportFromCjs(cloneExports);

// Registration Events
// ===================
/**
 * Called when account is registered
 */
function onRegistered(userAgent) {
    // This code fires on re-register after session timeout
    // to ensure that events are not fired multiple times
    // a isReRegister state is kept.
    // TODO: This check appears obsolete
    const clonedUserAgent = clone(userAgent);
    clonedUserAgent.registrationCompleted = true;
    if (!clonedUserAgent.isReRegister) {
        console.log('Registered!');
        // Start Subscribe Loop
        // setTimeout(function () {
        //   SubscribeAll(clonedUserAgent);
        // }, 500); //TODO subscription disabled for now
        clonedUserAgent.registering = false;
    }
    else {
        clonedUserAgent.registering = false;
        console.log('ReRegistered!');
    }
    clonedUserAgent.isReRegister = true;
    setSipStore({ userAgent: clonedUserAgent });
}
/**
 * Called if UserAgent can connect, but not register.
 * @param {string} response Incoming request message
 * @param {string} cause Cause message. Unused
 **/
function onRegisterFailed(response, cause) {
    const clonedUserAgent = clone(getSipStoreUserAgent());
    if (clonedUserAgent)
        clonedUserAgent.registering = false;
    setSipStore({ userAgent: clonedUserAgent });
}
/**
 * Called when Unregister is requested
 */
function onUnregistered(userAgent) {
    const clonedUserAgent = clone(userAgent);
    // We set this flag here so that the re-register attempts are fully completed.
    clonedUserAgent.isReRegister = false;
    setSipStore({ userAgent: clonedUserAgent });
}

/* -------------------------------------------------------------------------- */
function register(userAgent) {
    const clonedUserAgent = userAgent ?? clone(getSipStoreUserAgent());
    if (!clonedUserAgent || clonedUserAgent?.registering || clonedUserAgent.isRegistered())
        return;
    clonedUserAgent.registering = true;
    clonedUserAgent.registerer.register({
        requestDelegate: {
            onReject(sip) {
                onRegisterFailed(sip.message.reasonPhrase, sip.message.statusCode);
            },
        },
    });
    if (!userAgent)
        setSipStore({ userAgent: clonedUserAgent });
}

/* -------------------------------------------------------------------------- */
function onTransportConnected(userAgent) {
    console.log('Connected to Web Socket!');
    const clonedUserAgent = userAgent ?? clone(getSipStoreUserAgent());
    if (!clonedUserAgent)
        return;
    // Reset the reconnectionAttempts
    clonedUserAgent.isReRegister = false;
    clonedUserAgent.transport.attemptingReconnection = false;
    clonedUserAgent.transport.reconnectionAttempts =
        getSipStoreConfigs().registration.transportReconnectionAttempts;
    // Auto start register
    if (clonedUserAgent.transport.attemptingReconnection && clonedUserAgent.registering) {
        if (clonedUserAgent.transport.reconnectionAttempts > 0)
            window.setTimeout(function () {
                register(clonedUserAgent);
            }, getSipStoreConfigs().registration.transportReconnectionTimeout);
    }
    else {
        console.warn('onTransportConnected: register() called, but attemptingReconnection is true or registering is true');
    }
    if (!userAgent)
        setSipStore({ userAgent: clonedUserAgent });
}
function onTransportConnectError(error, userAgent) {
    console.warn('WebSocket Connection Failed:', error);
    const clonedUserAgent = userAgent ?? clone(getSipStoreUserAgent());
    if (!clonedUserAgent)
        return;
    // We set this flag here so that the re-register attempts are fully completed.
    clonedUserAgent.isReRegister = false;
    // If there is an issue with the WS connection
    // We unregister, so that we register again once its up
    console.log('Unregister...');
    try {
        clonedUserAgent.registerer.unregister();
    }
    catch (e) {
        // I know!!!
    }
    reconnectTransport(clonedUserAgent);
    if (!userAgent)
        setSipStore({ userAgent: clonedUserAgent });
}
function onTransportDisconnected(userAgent) {
    console.log('Disconnected from Web Socket!');
    const clonedUserAgent = clone(userAgent);
    clonedUserAgent.isReRegister = false;
    setSipStore({ userAgent: clonedUserAgent });
}
function reconnectTransport(userAgent) {
    const transportReconnectionTimeout = getSipStore().configs?.registration?.transportReconnectionTimeout;
    const clonedUserAgent = userAgent ?? clone(getSipStoreUserAgent());
    if (!clonedUserAgent)
        return;
    clonedUserAgent.registering = false; // if the transport was down, you will not be registered
    if (clonedUserAgent.transport && clonedUserAgent.transport.isConnected()) {
        // Asked to re-connect, but ws is connected
        onTransportConnected(clonedUserAgent);
        return;
    }
    console.log('Reconnect Transport...');
    setTimeout(function () {
        console.log('ReConnecting to WebSocket...', { timeout: transportReconnectionTimeout * 1000 });
        if (clonedUserAgent.transport && clonedUserAgent.transport.isConnected()) {
            // Already Connected
            console.log('Transport Already Connected...');
            onTransportConnected(clonedUserAgent);
            return;
        }
        else {
            clonedUserAgent.transport.attemptingReconnection = true;
            clonedUserAgent.reconnect().catch(function (error) {
                clonedUserAgent.transport.attemptingReconnection = false;
                console.warn('Failed to reconnect', error);
                // Try Again
                reconnectTransport(clonedUserAgent);
            });
        }
    }, getSipStoreConfigs().registration.transportReconnectionTimeout);
    console.log('Waiting to Re-connect...', getSipStoreConfigs().registration.transportReconnectionAttempts, 'Attempt remaining', clonedUserAgent.transport.reconnectionAttempts);
    clonedUserAgent.transport.reconnectionAttempts =
        clonedUserAgent.transport.reconnectionAttempts - 1;
    if (!userAgent)
        setSipStore({ userAgent: clonedUserAgent });
}

var dayjs_min$1 = {exports: {}};

var dayjs_min = dayjs_min$1.exports;

var hasRequiredDayjs_min;

function requireDayjs_min () {
	if (hasRequiredDayjs_min) return dayjs_min$1.exports;
	hasRequiredDayjs_min = 1;
	(function (module, exports) {
		!function(t,e){module.exports=e();}(dayjs_min,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",c="month",f="quarter",h="year",d="date",l="Invalid Date",$=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(t){var e=["th","st","nd","rd"],n=t%100;return "["+t+(e[(n-20)%10]||e[n]||e[0])+"]"}},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},v={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,c),s=n-i<0,u=e.clone().add(r+(s?-1:1),c);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:c,y:h,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:f}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},g="en",D={};D[g]=M;var p="$isDayjsObject",S=function(t){return t instanceof _||!(!t||!t[p])},w=function t(e,n,r){var i;if(!e)return g;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(g=i),i||!r&&g},O=function(t,e){if(S(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},b=v;b.l=w,b.i=S,b.w=function(t,e){return O(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=w(t.locale,null,true),this.parse(t),this.$x=this.$x||t.x||{},this[p]=true;}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(b.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match($);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return b},m.isValid=function(){return !(this.$d.toString()===l)},m.isSame=function(t,e){var n=O(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return O(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<O(t)},m.$g=function(t,e,n){return b.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!b.u(e)||e,f=b.p(t),l=function(t,e){var i=b.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},$=function(t,e){return b.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,v="set"+(this.$u?"UTC":"");switch(f){case h:return r?l(1,0):l(31,11);case c:return r?l(1,M):l(0,M+1);case o:var g=this.$locale().weekStart||0,D=(y<g?y+7:y)-g;return l(r?m-D:m+(6-D),M);case a:case d:return $(v+"Hours",0);case u:return $(v+"Minutes",1);case s:return $(v+"Seconds",2);case i:return $(v+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,false)},m.$set=function(t,e){var n,o=b.p(t),f="set"+(this.$u?"UTC":""),l=(n={},n[a]=f+"Date",n[d]=f+"Date",n[c]=f+"Month",n[h]=f+"FullYear",n[u]=f+"Hours",n[s]=f+"Minutes",n[i]=f+"Seconds",n[r]=f+"Milliseconds",n)[o],$=o===a?this.$D+(e-this.$W):e;if(o===c||o===h){var y=this.clone().set(d,1);y.$d[l]($),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else l&&this.$d[l]($);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[b.p(t)]()},m.add=function(r,f){var d,l=this;r=Number(r);var $=b.p(f),y=function(t){var e=O(l);return b.w(e.date(e.date()+Math.round(t*r)),l)};if($===c)return this.set(c,this.$M+r);if($===h)return this.set(h,this.$y+r);if($===a)return y(1);if($===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[$]||1,m=this.$d.getTime()+r*M;return b.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||l;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=b.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,c=n.months,f=n.meridiem,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},d=function(t){return b.s(s%12||12,t,"0")},$=f||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r};return r.replace(y,(function(t,r){return r||function(t){switch(t){case "YY":return String(e.$y).slice(-2);case "YYYY":return b.s(e.$y,4,"0");case "M":return a+1;case "MM":return b.s(a+1,2,"0");case "MMM":return h(n.monthsShort,a,c,3);case "MMMM":return h(c,a);case "D":return e.$D;case "DD":return b.s(e.$D,2,"0");case "d":return String(e.$W);case "dd":return h(n.weekdaysMin,e.$W,o,2);case "ddd":return h(n.weekdaysShort,e.$W,o,3);case "dddd":return o[e.$W];case "H":return String(s);case "HH":return b.s(s,2,"0");case "h":return d(1);case "hh":return d(2);case "a":return $(s,u,true);case "A":return $(s,u,false);case "m":return String(u);case "mm":return b.s(u,2,"0");case "s":return String(e.$s);case "ss":return b.s(e.$s,2,"0");case "SSS":return b.s(e.$ms,3,"0");case "Z":return i}return null}(t)||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,l){var $,y=this,M=b.p(d),m=O(r),v=(m.utcOffset()-this.utcOffset())*e,g=this-m,D=function(){return b.m(y,m)};switch(M){case h:$=D()/12;break;case c:$=D();break;case f:$=D()/3;break;case o:$=(g-v)/6048e5;break;case a:$=(g-v)/864e5;break;case u:$=g/n;break;case s:$=g/e;break;case i:$=g/t;break;default:$=g;}return l?$:b.a($)},m.daysInMonth=function(){return this.endOf(c).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=w(t,e,true);return r&&(n.$L=r),n},m.clone=function(){return b.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),k=_.prototype;return O.prototype=k,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",c],["$y",h],["$D",d]].forEach((function(t){k[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),O.extend=function(t,e){return t.$i||(t(e,_,O),t.$i=true),O},O.locale=w,O.isDayjs=S,O.unix=function(t){return O(1e3*t)},O.en=D[g],O.Ls=D,O.p={},O})); 
	} (dayjs_min$1));
	return dayjs_min$1.exports;
}

var dayjs_minExports = requireDayjs_min();
var dayjs = /*@__PURE__*/getDefaultExportFromCjs(dayjs_minExports);

var duration$2 = {exports: {}};

var duration$1 = duration$2.exports;

var hasRequiredDuration;

function requireDuration () {
	if (hasRequiredDuration) return duration$2.exports;
	hasRequiredDuration = 1;
	(function (module, exports) {
		!function(t,s){module.exports=s();}(duration$1,(function(){var t,s,n=1e3,i=6e4,e=36e5,r=864e5,o=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,u=31536e6,d=2628e6,a=/^(-|\+)?P(?:([-+]?[0-9,.]*)Y)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)W)?(?:([-+]?[0-9,.]*)D)?(?:T(?:([-+]?[0-9,.]*)H)?(?:([-+]?[0-9,.]*)M)?(?:([-+]?[0-9,.]*)S)?)?$/,h={years:u,months:d,days:r,hours:e,minutes:i,seconds:n,milliseconds:1,weeks:6048e5},c=function(t){return t instanceof g},f=function(t,s,n){return new g(t,n,s.$l)},m=function(t){return s.p(t)+"s"},l=function(t){return t<0},$=function(t){return l(t)?Math.ceil(t):Math.floor(t)},y=function(t){return Math.abs(t)},v=function(t,s){return t?l(t)?{negative:true,format:""+y(t)+s}:{negative:false,format:""+t+s}:{negative:false,format:""}},g=function(){function l(t,s,n){var i=this;if(this.$d={},this.$l=n,void 0===t&&(this.$ms=0,this.parseFromMilliseconds()),s)return f(t*h[m(s)],this);if("number"==typeof t)return this.$ms=t,this.parseFromMilliseconds(),this;if("object"==typeof t)return Object.keys(t).forEach((function(s){i.$d[m(s)]=t[s];})),this.calMilliseconds(),this;if("string"==typeof t){var e=t.match(a);if(e){var r=e.slice(2).map((function(t){return null!=t?Number(t):0}));return this.$d.years=r[0],this.$d.months=r[1],this.$d.weeks=r[2],this.$d.days=r[3],this.$d.hours=r[4],this.$d.minutes=r[5],this.$d.seconds=r[6],this.calMilliseconds(),this}}return this}var y=l.prototype;return y.calMilliseconds=function(){var t=this;this.$ms=Object.keys(this.$d).reduce((function(s,n){return s+(t.$d[n]||0)*h[n]}),0);},y.parseFromMilliseconds=function(){var t=this.$ms;this.$d.years=$(t/u),t%=u,this.$d.months=$(t/d),t%=d,this.$d.days=$(t/r),t%=r,this.$d.hours=$(t/e),t%=e,this.$d.minutes=$(t/i),t%=i,this.$d.seconds=$(t/n),t%=n,this.$d.milliseconds=t;},y.toISOString=function(){var t=v(this.$d.years,"Y"),s=v(this.$d.months,"M"),n=+this.$d.days||0;this.$d.weeks&&(n+=7*this.$d.weeks);var i=v(n,"D"),e=v(this.$d.hours,"H"),r=v(this.$d.minutes,"M"),o=this.$d.seconds||0;this.$d.milliseconds&&(o+=this.$d.milliseconds/1e3,o=Math.round(1e3*o)/1e3);var u=v(o,"S"),d=t.negative||s.negative||i.negative||e.negative||r.negative||u.negative,a=e.format||r.format||u.format?"T":"",h=(d?"-":"")+"P"+t.format+s.format+i.format+a+e.format+r.format+u.format;return "P"===h||"-P"===h?"P0D":h},y.toJSON=function(){return this.toISOString()},y.format=function(t){var n=t||"YYYY-MM-DDTHH:mm:ss",i={Y:this.$d.years,YY:s.s(this.$d.years,2,"0"),YYYY:s.s(this.$d.years,4,"0"),M:this.$d.months,MM:s.s(this.$d.months,2,"0"),D:this.$d.days,DD:s.s(this.$d.days,2,"0"),H:this.$d.hours,HH:s.s(this.$d.hours,2,"0"),m:this.$d.minutes,mm:s.s(this.$d.minutes,2,"0"),s:this.$d.seconds,ss:s.s(this.$d.seconds,2,"0"),SSS:s.s(this.$d.milliseconds,3,"0")};return n.replace(o,(function(t,s){return s||String(i[t])}))},y.as=function(t){return this.$ms/h[m(t)]},y.get=function(t){var s=this.$ms,n=m(t);return "milliseconds"===n?s%=1e3:s="weeks"===n?$(s/h[n]):this.$d[n],s||0},y.add=function(t,s,n){var i;return i=s?t*h[m(s)]:c(t)?t.$ms:f(t,this).$ms,f(this.$ms+i*(n?-1:1),this)},y.subtract=function(t,s){return this.add(t,s,true)},y.locale=function(t){var s=this.clone();return s.$l=t,s},y.clone=function(){return f(this.$ms,this)},y.humanize=function(s){return t().add(this.$ms,"ms").locale(this.$l).fromNow(!s)},y.valueOf=function(){return this.asMilliseconds()},y.milliseconds=function(){return this.get("milliseconds")},y.asMilliseconds=function(){return this.as("milliseconds")},y.seconds=function(){return this.get("seconds")},y.asSeconds=function(){return this.as("seconds")},y.minutes=function(){return this.get("minutes")},y.asMinutes=function(){return this.as("minutes")},y.hours=function(){return this.get("hours")},y.asHours=function(){return this.as("hours")},y.days=function(){return this.get("days")},y.asDays=function(){return this.as("days")},y.weeks=function(){return this.get("weeks")},y.asWeeks=function(){return this.as("weeks")},y.months=function(){return this.get("months")},y.asMonths=function(){return this.as("months")},y.years=function(){return this.get("years")},y.asYears=function(){return this.as("years")},l}(),p=function(t,s,n){return t.add(s.years()*n,"y").add(s.months()*n,"M").add(s.days()*n,"d").add(s.hours()*n,"h").add(s.minutes()*n,"m").add(s.seconds()*n,"s").add(s.milliseconds()*n,"ms")};return function(n,i,e){t=e,s=e().$utils(),e.duration=function(t,s){var n=e.locale();return f(t,{$l:n},s)},e.isDuration=c;var r=i.prototype.add,o=i.prototype.subtract;i.prototype.add=function(t,s){return c(t)?p(this,t,1):r.bind(this)(t,s)},i.prototype.subtract=function(t,s){return c(t)?p(this,t,-1):o.bind(this)(t,s)};}})); 
	} (duration$2));
	return duration$2.exports;
}

var durationExports = requireDuration();
var duration = /*@__PURE__*/getDefaultExportFromCjs(durationExports);

dayjs.extend(duration);

var utc$2 = {exports: {}};

var utc$1 = utc$2.exports;

var hasRequiredUtc;

function requireUtc () {
	if (hasRequiredUtc) return utc$2.exports;
	hasRequiredUtc = 1;
	(function (module, exports) {
		!function(t,i){module.exports=i();}(utc$1,(function(){var t="minute",i=/[+-]\d\d(?::?\d\d)?/g,e=/([+-]|\d\d)/g;return function(s,f,n){var u=f.prototype;n.utc=function(t){var i={date:t,utc:true,args:arguments};return new f(i)},u.utc=function(i){var e=n(this.toDate(),{locale:this.$L,utc:true});return i?e.add(this.utcOffset(),t):e},u.local=function(){return n(this.toDate(),{locale:this.$L,utc:false})};var o=u.parse;u.parse=function(t){t.utc&&(this.$u=true),this.$utils().u(t.$offset)||(this.$offset=t.$offset),o.call(this,t);};var r=u.init;u.init=function(){if(this.$u){var t=this.$d;this.$y=t.getUTCFullYear(),this.$M=t.getUTCMonth(),this.$D=t.getUTCDate(),this.$W=t.getUTCDay(),this.$H=t.getUTCHours(),this.$m=t.getUTCMinutes(),this.$s=t.getUTCSeconds(),this.$ms=t.getUTCMilliseconds();}else r.call(this);};var a=u.utcOffset;u.utcOffset=function(s,f){var n=this.$utils().u;if(n(s))return this.$u?0:n(this.$offset)?a.call(this):this.$offset;if("string"==typeof s&&(s=function(t){ void 0===t&&(t="");var s=t.match(i);if(!s)return null;var f=(""+s[0]).match(e)||["-",0,0],n=f[0],u=60*+f[1]+ +f[2];return 0===u?0:"+"===n?u:-u}(s),null===s))return this;var u=Math.abs(s)<=16?60*s:s,o=this;if(f)return o.$offset=u,o.$u=0===s,o;if(0!==s){var r=this.$u?this.toDate().getTimezoneOffset():-1*this.utcOffset();(o=this.local().add(u+r,t)).$offset=u,o.$x.$localOffset=r;}else o=this.utc();return o};var h=u.format;u.format=function(t){var i=t||(this.$u?"YYYY-MM-DDTHH:mm:ss[Z]":"");return h.call(this,i)},u.valueOf=function(){var t=this.$utils().u(this.$offset)?0:this.$offset+(this.$x.$localOffset||this.$d.getTimezoneOffset());return this.$d.valueOf()-6e4*t},u.isUTC=function(){return !!this.$u},u.toISOString=function(){return this.toDate().toISOString()},u.toString=function(){return this.toDate().toUTCString()};var l=u.toDate;u.toDate=function(t){return "s"===t&&this.$offset?n(this.format("YYYY-MM-DD HH:mm:ss:SSS")).toDate():l.call(this)};var c=u.diff;u.diff=function(t,i,e){if(t&&this.$u===t.$u)return c.call(this,t,i,e);var s=this.local(),f=n(t).local();return c.call(s,f,i,e)};}})); 
	} (utc$2));
	return utc$2.exports;
}

var utcExports = requireUtc();
var utc = /*@__PURE__*/getDefaultExportFromCjs(utcExports);

dayjs.extend(duration);
dayjs.extend(utc);
const dayJs = dayjs;

function deepMerge(target, source) {
    const output = { ...target }; // Start with a shallow copy of the target
    if (target && typeof target === 'object' && source && typeof source === 'object') {
        for (const key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
                const sourceValue = source[key];
                const targetValue = output[key];
                if (sourceValue &&
                    typeof sourceValue === 'object' &&
                    !Array.isArray(sourceValue) &&
                    targetValue &&
                    typeof targetValue === 'object' &&
                    !Array.isArray(targetValue)) {
                    // If both values are objects (and not arrays), recursively merge them
                    output[key] = deepMerge(targetValue, sourceValue);
                }
                else if (sourceValue !== undefined) {
                    // Otherwise, if the source value is defined, assign it
                    output[key] = sourceValue;
                }
            }
        }
    }
    return output;
}

function utcDateNow() {
    return dayJs().utc().format('YYYY-MM-DD HH:mm:ss UTC');
}

const useSessionEvents = () => {
    const updateLine = useSipStore((state) => state.updateLine);
    const audioBlobs = useSipStore((state) => state.audioBlobs);
    const { maxVideoBandwidth, audioOutputDeviceId } = useSipStore((state) => state.configs.media);
    function onInviteCancel(lineObj, response, callback) {
        // Remote Party Canceled while ringing...
        // Check to see if this call has been completed elsewhere
        // https://github.com/InnovateAsterisk/Browser-Phone/issues/405
        let temp_cause = 0;
        const reason = response.headers['Reason'];
        if (reason !== undefined && reason.length > 0) {
            for (let i = 0; i < reason.length; i++) {
                const cause = reason[i].raw.toLowerCase().trim(); // Reason: Q.850 ;cause=16 ;text="Terminated"
                const items = cause.split(';');
                if (items.length >= 2 &&
                    (items[0].trim() === 'sip' || items[0].trim() === 'q.850') &&
                    items[1].includes('cause') &&
                    cause.includes('call completed elsewhere')) {
                    temp_cause = parseInt(items[1].substring(items[1].indexOf('=') + 1).trim());
                    // No sample provided for "token"
                    break;
                }
            }
        }
        const session = lineObj.sipSession;
        if (!session)
            return;
        session.data.terminateBy = 'them';
        session.data.reasonCode = temp_cause;
        if (temp_cause === 0) {
            session.data.reasonText = 'Call Cancelled';
            console.log('Call canceled by remote party before answer!');
        }
        else {
            session.data.reasonText = 'Call completed elsewhere';
            console.log('Call completed elsewhere before answer');
        }
        session.dispose().catch(function (error) {
            console.log('Failed to dispose the cancel dialog', error);
        });
        callback?.();
    }
    // // Both Incoming an outgoing INVITE
    function onInviteAccepted(lineObj, includeVideo, response) {
        // Call in progress
        console.log('onInviteAccepted');
        const session = lineObj.sipSession;
        if (!session)
            return;
        if (session.data.earlyMedia) {
            session.data.earlyMedia.pause();
            session.data.earlyMedia.removeAttribute('src');
            session.data.earlyMedia.load();
            session.data.earlyMedia = null;
        }
        const startTime = dayJs.utc();
        session.data.startTime = startTime;
        session.isOnHold = false;
        session.data.started = true;
        if (includeVideo) {
            // Preview our stream from peer connection
            const localVideoStream = new MediaStream();
            const pc = session.sessionDescriptionHandler.peerConnection;
            pc.getSenders().forEach(function (sender) {
                if (sender.track && sender.track.kind === 'video') {
                    localVideoStream.addTrack(sender.track);
                }
            });
            const localVideo = document.getElementById(`line-${lineObj.lineNumber}-localVideo`);
            console.log('onInviteAccepted', { localVideo, localVideoStream });
            if (localVideo) {
                localVideo.srcObject = localVideoStream;
                localVideo.onloadedmetadata = function (e) {
                    console.log('onInviteAccepted', 'play');
                    localVideo.play();
                };
            }
            // Apply Call Bandwidth Limits
            if (maxVideoBandwidth > -1) {
                pc.getSenders().forEach(function (sender) {
                    if (sender.track && sender.track.kind === 'video') {
                        const parameters = sender.getParameters();
                        if (!parameters.encodings)
                            parameters.encodings = [{}];
                        parameters.encodings[0].maxBitrate = maxVideoBandwidth * 1000;
                        console.log('Applying limit for Bandwidth to: ', maxVideoBandwidth + 'kb per second');
                        // Only going to try without re-negotiations
                        sender.setParameters(parameters).catch(function (e) {
                            console.warn('Cannot apply Bandwidth Limits', e);
                        });
                    }
                });
            }
        }
        // Start Call Recording
        // if (RecordAllCalls || CallRecordingPolicy == 'enabled') {
        // StartRecording(lineObj.LineNumber); TODO #SH Recording feature
        // }
        //   if (includeVideo && StartVideoFullScreen) ExpandVideoArea(lineObj.LineNumber); TODO #SH
        updateLine(lineObj);
    }
    // Outgoing INVITE
    function onInviteTrying(lineObj, response) {
        // $('#line-' + lineObj.LineNumber + '-msg').html(lang.trying);
    }
    function onInviteProgress(lineObj, response) {
        console.log('Call Progress:', response.message.statusCode);
        const session = lineObj.sipSession;
        if (!session)
            return;
        // Provisional 1xx
        // response.message.reasonPhrase
        if (response.message.statusCode === 180) {
            // $('#line-' + lineObj.LineNumber + '-msg').html(lang.ringing);
            let soundFile = audioBlobs.Ringtone;
            console.log({ soundFile });
            // Play Early Media
            console.log('Audio:', soundFile.url);
            if (session.data.earlyMedia) {
                // There is already early media playing
                // onProgress can be called multiple times
                // Don't add it again
                console.log('Early Media already playing');
            }
            else {
                const earlyMedia = new Audio(soundFile.url);
                earlyMedia.preload = 'auto';
                earlyMedia.loop = true;
                earlyMedia.oncanplaythrough = function (e) {
                    if (typeof earlyMedia.sinkId !== 'undefined' && audioOutputDeviceId !== 'default') {
                        earlyMedia
                            .setSinkId(audioOutputDeviceId)
                            .then(function () {
                            console.log('Set sinkId to:', audioOutputDeviceId);
                        })
                            .catch(function (e) {
                            console.warn('Failed not apply setSinkId.', e);
                        });
                    }
                    earlyMedia
                        .play()
                        .then(function () {
                        // Audio Is Playing
                    })
                        .catch(function (e) {
                        console.warn('Unable to play audio file.', e);
                    });
                };
                session.data.earlyMedia = earlyMedia;
            }
        }
        else if (response.message.statusCode === 183) ;
        else ;
        updateLine(lineObj);
    }
    function onInviteRejected(lineObj, response, callback) {
        console.log('INVITE Rejected:', response.message.reasonPhrase);
        const session = lineObj.sipSession;
        if (!session)
            return;
        session.data.terminateBy = 'them';
        session.data.reasonCode = response.message.statusCode;
        session.data.reasonText = response.message.reasonPhrase;
        callback?.();
    }
    function onInviteRedirected(lineObj, response) {
        console.log('onInviteRedirected', response);
        // Follow???
    }
    // // General Session delegates
    function onSessionReceivedBye(lineObj, response, callback) {
        // They Ended the call
        if (!lineObj?.sipSession)
            return;
        lineObj.sipSession.data.terminateBy = 'them';
        lineObj.sipSession.data.reasonCode = 16;
        lineObj.sipSession.data.reasonText = 'Normal Call clearing';
        response.accept(); // Send OK
        callback?.();
    }
    function onSessionReinvited(lineObj, response) {
        // This may be used to include video streams
        const sdp = response.body;
        const session = lineObj.sipSession;
        if (!session)
            return;
        // All the possible streams will get
        // Note, this will probably happen after the streams are added
        session.data.videoChannelNames = [];
        const videoSections = sdp.split('m=video');
        if (videoSections.length >= 1) {
            for (let m = 0; m < videoSections.length; m++) {
                if (videoSections[m].indexOf('a=mid:') > -1 && videoSections[m].indexOf('a=label:') > -1) {
                    // We have a label for the media
                    const lines = videoSections[m].split('\r\n');
                    let channel = '';
                    let mid = '';
                    for (let i = 0; i < lines.length; i++) {
                        if (lines[i].indexOf('a=label:') == 0) {
                            channel = lines[i].replace('a=label:', '');
                        }
                        if (lines[i].indexOf('a=mid:') == 0) {
                            mid = lines[i].replace('a=mid:', '');
                        }
                    }
                    session.data.videoChannelNames.push({ mid: mid, channel: channel });
                }
            }
            console.log('videoChannelNames:', session.data.videoChannelNames);
            // RedrawStage(lineObj.LineNumber, false); TODO #SH
        }
    }
    function onSessionReceivedMessage(lineObj, response) {
        const messageType = response.request.headers['Content-Type'].length >= 1
            ? response.request.headers['Content-Type'][0].parsed
            : 'Unknown';
        if (messageType.indexOf('application/x-asterisk-confbridge-event') > -1) {
            // Conference Events JSON
            const msgJson = JSON.parse(response.request.body);
            const session = lineObj.sipSession;
            if (!session)
                return;
            if (!session.data)
                return;
            if (!session.data.confBridgeChannels)
                session.data.confBridgeChannels = [];
            if (!session.data.confBridgeEvents)
                session.data.confBridgeEvents = [];
            if (msgJson.type == 'ConfbridgeStart') {
                console.log('ConfbridgeStart!');
            }
            else if (msgJson.type == 'ConfbridgeWelcome') {
                console.log('Welcome to the Asterisk Conference');
                console.log('Bridge ID:', msgJson.bridge.id);
                console.log('Bridge Name:', msgJson.bridge.name);
                console.log('Created at:', msgJson.bridge.creationtime);
                console.log('Video Mode:', msgJson.bridge.video_mode);
                session.data.confBridgeChannels = msgJson.channels; // Write over this
                session.data.confBridgeChannels.forEach(function (chan) {
                    // The mute and unmute status doesn't appear to be a realtime state, only what the
                    // startmuted= setting of the default profile is.
                    console.log(chan.caller.name, 'Is in the conference. Muted:', chan.muted, 'Admin:', chan.admin);
                });
            }
            else if (msgJson.type == 'ConfbridgeJoin') {
                msgJson.channels.forEach(function (chan) {
                    let found = false;
                    session.data.confBridgeChannels?.forEach(function (existingChan) {
                        if (existingChan.id == chan.id)
                            found = true;
                    });
                    if (!found) {
                        session.data.confBridgeChannels?.push(chan);
                        session.data.confBridgeEvents?.push({
                            event: chan.caller.name + ' (' + chan.caller.number + ') joined the conference',
                            eventTime: utcDateNow(),
                        });
                        console.log(chan.caller.name, 'Joined the conference. Muted: ', chan.muted);
                    }
                });
            }
            else if (msgJson.type == 'ConfbridgeLeave') {
                msgJson.channels.forEach(function (chan) {
                    session.data.confBridgeChannels?.forEach(function (existingChan, i) {
                        if (existingChan.id == chan.id) {
                            session.data.confBridgeChannels?.splice(i, 1);
                            console.log(chan.caller.name, 'Left the conference');
                            session.data.confBridgeEvents?.push({
                                event: chan.caller.name + ' (' + chan.caller.number + ') left the conference',
                                eventTime: utcDateNow(),
                            });
                        }
                    });
                });
            }
            else if (msgJson.type === 'ConfbridgeTalking') ;
            else if (msgJson.type == 'ConfbridgeMute') {
                msgJson.channels.forEach(function (chan) {
                    session.data.confBridgeChannels?.forEach(function (existingChan) {
                        if (existingChan.id == chan.id) {
                            console.log(existingChan.caller.name, 'is now muted');
                            existingChan.muted = true;
                        }
                    });
                });
                //   RedrawStage(lineObj.LineNumber, false); TODO #SH
            }
            else if (msgJson.type === 'ConfbridgeUnmute') {
                msgJson.channels.forEach(function (chan) {
                    session.data.confBridgeChannels?.forEach(function (existingChan) {
                        if (existingChan.id == chan.id) {
                            console.log(existingChan.caller.name, 'is now unmuted');
                            existingChan.muted = false;
                        }
                    });
                });
                //   RedrawStage(lineObj.LineNumber, false); TODO #SH
            }
            else if (msgJson.type == 'ConfbridgeEnd') {
                console.log('The Asterisk Conference has ended, bye!');
            }
            else {
                console.warn('Unknown Asterisk Conference Event:', msgJson.type, msgJson);
            }
            // RefreshLineActivity(lineObj.LineNumber); TODO #SH
            response.accept();
        }
        else if (messageType.indexOf('application/x-myphone-confbridge-chat') > -1) {
            console.log('x-myphone-confbridge-chat', response);
            response.accept();
        }
        else {
            console.warn('Unknown message type');
            response.reject();
        }
    }
    /* -------------------------------------------------------------------------- */
    function onSessionDescriptionHandlerCreated(lineObj, sdh, provisional, includeVideo) {
        if (sdh) {
            if (sdh.peerConnection) {
                console.log(222, 'onSessionDescriptionHandlerCreated', sdh, {
                    peerConnection: sdh.peerConnection,
                });
                sdh.peerConnection.ontrack = function (event) {
                    console.log(222, { event });
                    onTrackAddedEvent(lineObj, includeVideo);
                };
                // sdh.peerConnectionDelegate = {
                //   ontrack: function (event: any) {
                //     console.log(event);
                //     onTrackAddedEvent(lineObj, includeVideo);
                //   },
                // };
            }
            else {
                console.warn('onSessionDescriptionHandler fired without a peerConnection');
            }
        }
        else {
            console.warn('onSessionDescriptionHandler fired without a sessionDescriptionHandler');
        }
    }
    function onTrackAddedEvent(lineObj, includeVideo) {
        // Gets remote tracks
        console.log('onTrackAddedEvent');
        const session = lineObj.sipSession;
        if (!session)
            return;
        // TODO: look at detecting video, so that UI switches to audio/video automatically.
        const pc = session.sessionDescriptionHandler.peerConnection;
        // Create MediaStreams for audio and video
        const remoteAudioStream = new MediaStream();
        const remoteVideoStream = new MediaStream();
        // Add tracks to MediaStreams
        pc.getTransceivers().forEach((transceiver) => {
            const receiver = transceiver.receiver;
            if (receiver.track) {
                if (receiver.track.kind === 'audio') {
                    console.log('Adding Remote Audio Track');
                    remoteAudioStream.addTrack(receiver.track);
                }
                if (includeVideo && receiver.track.kind === 'video') {
                    if (transceiver.mid) {
                        console.log('Adding Remote Video Track', receiver.track.readyState);
                        receiver.track.mid = transceiver.mid;
                        remoteVideoStream.addTrack(receiver.track);
                    }
                }
            }
        });
        // Attach Audio Stream
        if (remoteAudioStream.getAudioTracks().length > 0) {
            const remoteAudio = document.getElementById(`line-${lineObj.lineNumber}-remoteAudio`);
            remoteAudio.setAttribute('id', `line-${lineObj.lineNumber}-remoteAudio`);
            remoteAudio.srcObject = remoteAudioStream;
            remoteAudio.onloadedmetadata = () => {
                if (typeof remoteAudio.sinkId !== 'undefined') {
                    remoteAudio
                        .setSinkId(audioOutputDeviceId)
                        .then(() => console.log('sinkId applied:', audioOutputDeviceId))
                        .catch((e) => console.warn('Error using setSinkId:', e));
                }
                remoteAudio.play();
            };
        }
        // Attach Video Stream
        if (includeVideo && remoteVideoStream.getVideoTracks().length > 0) {
            const videoContainerId = `line-${lineObj.lineNumber}-remoteVideos`;
            let videoContainer = document.getElementById(videoContainerId);
            if (!videoContainer)
                return;
            // Clear existing videos
            videoContainer.innerHTML = '';
            remoteVideoStream.getVideoTracks().forEach((remoteVideoStreamTrack, index) => {
                const thisRemoteVideoStream = new MediaStream();
                thisRemoteVideoStream.trackId = remoteVideoStreamTrack.id;
                thisRemoteVideoStream.mid = remoteVideoStreamTrack.mid;
                thisRemoteVideoStream.addTrack(remoteVideoStreamTrack);
                const videoElement = document.createElement('video');
                videoElement.id = `line-${lineObj.lineNumber}-video-${index}`;
                videoElement.srcObject = thisRemoteVideoStream;
                videoElement.autoplay = true;
                videoElement.playsInline = true;
                videoElement.muted = true; // Ensure autoplay works in browsers
                videoElement.className = 'video-element'; // Add styling class
                videoElement.onloadedmetadata = () => {
                    videoElement.play().catch((error) => {
                        console.error('Error playing video:', error);
                    });
                };
                videoContainer.appendChild(videoElement);
            });
        }
        else {
            console.warn('No Video Tracks Found');
        }
        updateLine(lineObj);
    }
    function onTransferSessionDescriptionHandlerCreated(lineObj, session, sdh, includeVideo) {
        if (sdh) {
            if (sdh.peerConnection) {
                sdh.peerConnection.ontrack = function () {
                    const pc = sdh.peerConnection;
                    // Gets Remote Audio Track (Local audio is setup via initial GUM)
                    const remoteAudioStream = new MediaStream();
                    const remoteVideoStream = new MediaStream();
                    // Add tracks to MediaStreams
                    pc.getReceivers().forEach((receiver) => {
                        if (receiver.track) {
                            if (receiver.track.kind === 'audio') {
                                console.log('Adding Remote Audio Track');
                                remoteAudioStream.addTrack(receiver.track);
                            }
                            if (includeVideo && receiver.track.kind === 'video') {
                                console.log('Adding Remote Video Track', receiver.track.readyState);
                                remoteVideoStream.addTrack(receiver.track);
                            }
                        }
                    });
                    // Attach Audio Stream
                    const remoteAudio = document.createElement('audio');
                    remoteAudio.setAttribute('id', `line-${lineObj.lineNumber}-transfer-remoteAudio`);
                    remoteAudio.srcObject = remoteAudioStream;
                    remoteAudio.onloadedmetadata = function () {
                        if (typeof remoteAudio.sinkId !== 'undefined' && session?.data?.audioOutputDevice) {
                            remoteAudio
                                .setSinkId(session.data.audioOutputDevice)
                                .then(function () {
                                console.log('sinkId applied: ' + session.data.audioOutputDevice);
                            })
                                .catch(function (e) {
                                console.warn('Error using setSinkId: ', e);
                            });
                        }
                        remoteAudio.play();
                    };
                    // Attach Video Stream
                    if (includeVideo && remoteVideoStream.getVideoTracks().length > 0) {
                        const remoteVideo = document.createElement('video');
                        remoteVideoStream.getVideoTracks().forEach((remoteVideoStreamTrack, index) => {
                            const thisRemoteVideoStream = new MediaStream();
                            thisRemoteVideoStream.trackId = remoteVideoStreamTrack.id;
                            thisRemoteVideoStream.mid = remoteVideoStreamTrack.mid;
                            thisRemoteVideoStream.addTrack(remoteVideoStreamTrack);
                            remoteVideo.id = `line-${lineObj.lineNumber}-video-${index}`;
                            remoteVideo.srcObject = thisRemoteVideoStream;
                            remoteVideo.autoplay = true;
                            remoteVideo.playsInline = true;
                            remoteVideo.muted = true; // Ensure autoplay works in browsers
                            remoteVideo.className = 'video-element'; // Add styling class
                            remoteVideo.onloadedmetadata = () => {
                                remoteVideo.play().catch((error) => {
                                    console.error('Error playing video:', error);
                                });
                            };
                        });
                    }
                    else {
                        console.warn('No Video Tracks Found');
                    }
                };
            }
            else {
                console.warn('onSessionDescriptionHandler fired without a peerConnection');
            }
        }
        else {
            console.warn('onSessionDescriptionHandler fired without a sessionDescriptionHandler');
        }
    }
    return {
        onInviteCancel,
        onInviteAccepted,
        onInviteTrying,
        onInviteProgress,
        onInviteRejected,
        onInviteRedirected,
        onSessionReceivedBye,
        onSessionReinvited,
        onSessionReceivedMessage,
        onSessionDescriptionHandlerCreated,
        onTrackAddedEvent,
        onTransferSessionDescriptionHandlerCreated,
    };
};

const useSpdOptions = () => {
    // TODO configurable
    const { audioInputDevices, videoInputDevices } = useSipStore((state) => state.devicesInfo);
    const { media: { audioInputDeviceId, videoInputDeviceId, autoGainControl, maxFrameRate, noiseSuppression, videoAspectRatio, videoHeight, echoCancellation, }, registration: { inviteExtraHeaders }, } = useSipStore((state) => state.configs);
    const getSupportedConstraints = () => navigator.mediaDevices.getSupportedConstraints();
    const audioDeviceConfirmation = (currentAudioDevice) => {
        let confirmedAudioDevice = false;
        for (let i = 0; i < audioInputDevices.length; ++i) {
            if (currentAudioDevice == audioInputDevices[i].deviceId) {
                confirmedAudioDevice = true;
                break;
            }
        }
        return confirmedAudioDevice;
    };
    const videoDeviceConfirmation = (currentVideoDevice) => {
        let confirmedVideoDevice = false;
        for (let i = 0; i < videoInputDevices.length; ++i) {
            if (currentVideoDevice == videoInputDevices[i].deviceId) {
                confirmedVideoDevice = true;
                break;
            }
        }
        return confirmedVideoDevice;
    };
    const options = {
        answerAudioSpdOptions: function ({ option: defaultOption } = {}) {
            console.log({ defaultOption });
            const option = defaultOption ?? {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: { deviceId: { exact: 'default' } },
                        video: false,
                    },
                },
            };
            const supportedConstraints = getSupportedConstraints();
            const currentAudioDevice = audioInputDeviceId;
            if (typeof option.sessionDescriptionHandlerOptions.constraints.audio !== 'object')
                return; // type checking assurance
            if (currentAudioDevice != 'default') {
                let confirmedAudioDevice = audioDeviceConfirmation(currentAudioDevice);
                if (confirmedAudioDevice) {
                    option.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
                        exact: currentAudioDevice,
                    };
                }
                else {
                    console.warn('The audio device you used before is no longer available, default settings applied.');
                    localStorage.setItem('AudioSrcId', 'default');
                }
            }
            // Add additional Constraints
            if (supportedConstraints.autoGainControl) {
                option.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl = autoGainControl;
            }
            if (supportedConstraints.echoCancellation) {
                option.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
                    echoCancellation;
            }
            if (supportedConstraints.noiseSuppression) {
                option.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
                    noiseSuppression;
            }
            return option;
        },
        makeAudioSpdOptions: function ({ extraHeaders }) {
            let option = {
                earlyMedia: true,
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: { deviceId: 'default' },
                        video: false,
                    },
                },
            };
            // Configure Audio
            if (extraHeaders) {
                option.extraHeaders = extraHeaders;
            }
            else {
                option.extraHeaders = [];
            }
            options.answerAudioSpdOptions({ option });
            // Added to the SIP Headers
            if (inviteExtraHeaders && inviteExtraHeaders !== '' && inviteExtraHeaders !== '{}') {
                try {
                    for (const [key, value] of Object.entries(JSON.parse(inviteExtraHeaders))) {
                        if (value == '') {
                            // This is a header, must be format: "Field: Value"
                        }
                        else {
                            option?.extraHeaders?.push(key + ': ' + value);
                        }
                    }
                }
                catch (e) { }
            }
            return option;
        },
        answerVideoSpdOptions: function ({ option: defaultOption } = {}) {
            const option = defaultOption ?? {
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: { deviceId: 'default' },
                        video: { deviceId: 'default' },
                    },
                },
            };
            const supportedConstraints = getSupportedConstraints();
            // Configure Audio
            options.answerAudioSpdOptions({ option });
            // Configure Video
            const currentVideoDevice = videoInputDeviceId;
            if (typeof option.sessionDescriptionHandlerOptions.constraints.video !== 'object')
                return; // type checking assurance
            if (currentVideoDevice != 'default') {
                let confirmedVideoDevice = videoDeviceConfirmation(currentVideoDevice);
                if (confirmedVideoDevice) {
                    option.sessionDescriptionHandlerOptions.constraints.video.deviceId = {
                        exact: currentVideoDevice,
                    };
                }
                else {
                    console.warn('The video device you used before is no longer available, default settings applied.');
                    localStorage.setItem('VideoSrcId', 'default'); // resets for later and subsequent calls
                }
            }
            // Add additional Constraints
            if (supportedConstraints.frameRate && !!maxFrameRate) {
                option.sessionDescriptionHandlerOptions.constraints.video.frameRate = String(maxFrameRate);
            }
            if (supportedConstraints.height && !!videoHeight) {
                option.sessionDescriptionHandlerOptions.constraints.video.height = String(videoHeight);
            }
            if (supportedConstraints.aspectRatio && !!videoAspectRatio) {
                option.sessionDescriptionHandlerOptions.constraints.video.aspectRatio =
                    String(videoAspectRatio);
            }
            return option;
        },
        makeVideoSpdOptions: function ({ extraHeaders }) {
            const option = {
                earlyMedia: true,
                sessionDescriptionHandlerOptions: {
                    constraints: {
                        audio: { deviceId: 'default' },
                        video: { deviceId: 'default' },
                    },
                },
            };
            // Configure Audio & Video
            options.answerVideoSpdOptions({ option });
            // Extra Headers
            if (extraHeaders) {
                option.extraHeaders = extraHeaders;
            }
            else {
                option.extraHeaders = [];
            }
            if (inviteExtraHeaders && inviteExtraHeaders !== '' && inviteExtraHeaders !== '{}') {
                try {
                    for (const [key, value] of Object.entries(JSON.parse(inviteExtraHeaders))) {
                        if (value == '') {
                            // This is a header, must be format: "Field: Value"
                        }
                        else {
                            option.extraHeaders.push(key + ': ' + value);
                        }
                    }
                }
                catch (e) { }
            }
            return option;
        },
    };
    return options;
};

const LIBRARY_VERSION = "0.21.1";

/**
 * An Exception is considered a condition that a reasonable application may wish to catch.
 * An Error indicates serious problems that a reasonable application should not try to catch.
 * @public
 */
class Exception extends Error {
    constructor(message) {
        super(message); // 'Error' breaks prototype chain here
        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
    }
}

/**
 * An exception indicating an unsupported content type prevented execution.
 * @public
 */
class ContentTypeUnsupportedError extends Exception {
    constructor(message) {
        super(message ? message : "Unsupported content type.");
    }
}

/**
 * An exception indicating an outstanding prior request prevented execution.
 * @public
 */
class RequestPendingError extends Exception {
    /** @internal */
    constructor(message) {
        super(message ? message : "Request pending.");
    }
}

/**
 * An exception indicating a session description handler error occured.
 * @public
 */
class SessionDescriptionHandlerError extends Exception {
    constructor(message) {
        super(message ? message : "Unspecified session description handler error.");
    }
}

/**
 * An exception indicating the session terminated before the action completed.
 * @public
 */
class SessionTerminatedError extends Exception {
    constructor() {
        super("The session has terminated.");
    }
}

/**
 * An exception indicating an invalid state transition error occured.
 * @public
 */
class StateTransitionError extends Exception {
    constructor(message) {
        super(message ? message : "An error occurred during state transition.");
    }
}

/**
 * A request to confirm a {@link Session} (incoming ACK).
 * @public
 */
class Ack {
    /** @internal */
    constructor(incomingAckRequest) {
        this.incomingAckRequest = incomingAckRequest;
    }
    /** Incoming ACK request message. */
    get request() {
        return this.incomingAckRequest.message;
    }
}

/**
 * A request to end a {@link Session} (incoming BYE).
 * @public
 */
class Bye {
    /** @internal */
    constructor(incomingByeRequest) {
        this.incomingByeRequest = incomingByeRequest;
    }
    /** Incoming BYE request message. */
    get request() {
        return this.incomingByeRequest.message;
    }
    /** Accept the request. */
    accept(options) {
        this.incomingByeRequest.accept(options);
        return Promise.resolve();
    }
    /** Reject the request. */
    reject(options) {
        this.incomingByeRequest.reject(options);
        return Promise.resolve();
    }
}

/**
 * A request to reject an {@link Invitation} (incoming CANCEL).
 * @public
 */
class Cancel {
    /** @internal */
    constructor(incomingCancelRequest) {
        this.incomingCancelRequest = incomingCancelRequest;
    }
    /** Incoming CANCEL request message. */
    get request() {
        return this.incomingCancelRequest;
    }
}

/**
 * An {@link Emitter} implementation.
 * @internal
 */
class EmitterImpl {
    constructor() {
        this.listeners = new Array();
    }
    /**
     * Sets up a function that will be called whenever the target changes.
     * @param listener - Callback function.
     * @param options - An options object that specifies characteristics about the listener.
     *                  If once true, indicates that the listener should be invoked at most once after being added.
     *                  If once true, the listener would be automatically removed when invoked.
     */
    addListener(listener, options) {
        const onceWrapper = (data) => {
            this.removeListener(onceWrapper);
            listener(data);
        };
        (options === null || options === void 0 ? void 0 : options.once) === true ? this.listeners.push(onceWrapper) : this.listeners.push(listener);
    }
    /**
     * Emit change.
     * @param data - Data to emit.
     */
    emit(data) {
        this.listeners.slice().forEach((listener) => listener(data));
    }
    /**
     * Removes all listeners previously registered with addListener.
     */
    removeAllListeners() {
        this.listeners = [];
    }
    /**
     * Removes a listener previously registered with addListener.
     * @param listener - Callback function.
     */
    removeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }
    /**
     * Registers a listener.
     * @param listener - Callback function.
     * @deprecated Use addListener.
     */
    on(listener) {
        return this.addListener(listener);
    }
    /**
     * Unregisters a listener.
     * @param listener - Callback function.
     * @deprecated Use removeListener.
     */
    off(listener) {
        return this.removeListener(listener);
    }
    /**
     * Registers a listener then unregisters the listener after one event emission.
     * @param listener - Callback function.
     * @deprecated Use addListener.
     */
    once(listener) {
        return this.addListener(listener, { once: true });
    }
}

/**
 * An exchange of information (incoming INFO).
 * @public
 */
class Info {
    /** @internal */
    constructor(incomingInfoRequest) {
        this.incomingInfoRequest = incomingInfoRequest;
    }
    /** Incoming MESSAGE request message. */
    get request() {
        return this.incomingInfoRequest.message;
    }
    /** Accept the request. */
    accept(options) {
        this.incomingInfoRequest.accept(options);
        return Promise.resolve();
    }
    /** Reject the request. */
    reject(options) {
        this.incomingInfoRequest.reject(options);
        return Promise.resolve();
    }
}

/**
 * @internal
 */
class Parameters {
    constructor(parameters) {
        this.parameters = {};
        // for in is required here as the Grammar parser is adding to the prototype chain
        for (const param in parameters) {
            // eslint-disable-next-line no-prototype-builtins
            if (parameters.hasOwnProperty(param)) {
                this.setParam(param, parameters[param]);
            }
        }
    }
    setParam(key, value) {
        if (key) {
            this.parameters[key.toLowerCase()] = (typeof value === "undefined" || value === null) ? null : value.toString();
        }
    }
    getParam(key) {
        if (key) {
            return this.parameters[key.toLowerCase()];
        }
    }
    hasParam(key) {
        return !!(key && this.parameters[key.toLowerCase()] !== undefined);
    }
    deleteParam(key) {
        key = key.toLowerCase();
        if (this.hasParam(key)) {
            const value = this.parameters[key];
            delete this.parameters[key];
            return value;
        }
    }
    clearParams() {
        this.parameters = {};
    }
}

/**
 * Name Address SIP header.
 * @public
 */
class NameAddrHeader extends Parameters {
    /**
     * Constructor
     * @param uri -
     * @param displayName -
     * @param parameters -
     */
    constructor(uri, displayName, parameters) {
        super(parameters);
        this.uri = uri;
        this._displayName = displayName;
    }
    get friendlyName() {
        return this.displayName || this.uri.aor;
    }
    get displayName() { return this._displayName; }
    set displayName(value) {
        this._displayName = value;
    }
    clone() {
        return new NameAddrHeader(this.uri.clone(), this._displayName, JSON.parse(JSON.stringify(this.parameters)));
    }
    toString() {
        let body = (this.displayName || this.displayName === "0") ? '"' + this.displayName + '" ' : "";
        body += "<" + this.uri.toString() + ">";
        for (const parameter in this.parameters) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.parameters.hasOwnProperty(parameter)) {
                body += ";" + parameter;
                if (this.parameters[parameter] !== null) {
                    body += "=" + this.parameters[parameter];
                }
            }
        }
        return body;
    }
}

/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * URI.
 * @public
 */
class URI extends Parameters {
    /**
     * Constructor
     * @param scheme -
     * @param user -
     * @param host -
     * @param port -
     * @param parameters -
     * @param headers -
     */
    constructor(scheme = "sip", user, host, port, parameters, headers) {
        super(parameters || {});
        this.headers = {};
        // Checks
        if (!host) {
            throw new TypeError('missing or invalid "host" parameter');
        }
        for (const header in headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (headers.hasOwnProperty(header)) {
                this.setHeader(header, headers[header]);
            }
        }
        // Raw URI
        this.raw = {
            scheme,
            user,
            host,
            port
        };
        // Normalized URI
        this.normal = {
            scheme: scheme.toLowerCase(),
            user,
            host: host.toLowerCase(),
            port
        };
    }
    get scheme() { return this.normal.scheme; }
    set scheme(value) {
        this.raw.scheme = value;
        this.normal.scheme = value.toLowerCase();
    }
    get user() { return this.normal.user; }
    set user(value) {
        this.normal.user = this.raw.user = value;
    }
    get host() { return this.normal.host; }
    set host(value) {
        this.raw.host = value;
        this.normal.host = value.toLowerCase();
    }
    get aor() { return this.normal.user + "@" + this.normal.host; }
    get port() { return this.normal.port; }
    set port(value) {
        this.normal.port = this.raw.port = value === 0 ? value : value;
    }
    setHeader(name, value) {
        this.headers[this.headerize(name)] = (value instanceof Array) ? value : [value];
    }
    getHeader(name) {
        if (name) {
            return this.headers[this.headerize(name)];
        }
    }
    hasHeader(name) {
        // eslint-disable-next-line no-prototype-builtins
        return !!name && !!this.headers.hasOwnProperty(this.headerize(name));
    }
    deleteHeader(header) {
        header = this.headerize(header);
        // eslint-disable-next-line no-prototype-builtins
        if (this.headers.hasOwnProperty(header)) {
            const value = this.headers[header];
            delete this.headers[header];
            return value;
        }
    }
    clearHeaders() {
        this.headers = {};
    }
    clone() {
        return new URI(this._raw.scheme, this._raw.user || "", this._raw.host, this._raw.port, JSON.parse(JSON.stringify(this.parameters)), JSON.parse(JSON.stringify(this.headers)));
    }
    toRaw() {
        return this._toString(this._raw);
    }
    toString() {
        return this._toString(this._normal);
    }
    get _normal() { return this.normal; }
    get _raw() { return this.raw; }
    _toString(uri) {
        let uriString = uri.scheme + ":";
        // add slashes if it's not a sip(s) URI
        if (!uri.scheme.toLowerCase().match("^sips?$")) {
            uriString += "//";
        }
        if (uri.user) {
            uriString += this.escapeUser(uri.user) + "@";
        }
        uriString += uri.host;
        if (uri.port || uri.port === 0) {
            uriString += ":" + uri.port;
        }
        for (const parameter in this.parameters) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.parameters.hasOwnProperty(parameter)) {
                uriString += ";" + parameter;
                if (this.parameters[parameter] !== null) {
                    uriString += "=" + this.parameters[parameter];
                }
            }
        }
        const headers = [];
        for (const header in this.headers) {
            // eslint-disable-next-line no-prototype-builtins
            if (this.headers.hasOwnProperty(header)) {
                // eslint-disable-next-line @typescript-eslint/no-for-in-array
                for (const idx in this.headers[header]) {
                    // eslint-disable-next-line no-prototype-builtins
                    if (this.headers[header].hasOwnProperty(idx)) {
                        headers.push(header + "=" + this.headers[header][idx]);
                    }
                }
            }
        }
        if (headers.length > 0) {
            uriString += "?" + headers.join("&");
        }
        return uriString;
    }
    /*
     * Hex-escape a SIP URI user.
     * @private
     * @param {String} user
     */
    escapeUser(user) {
        let decodedUser;
        // FIXME: This is called by toString above which should never throw, but
        // decodeURIComponent can throw and I've seen one case in production where
        // it did throw resulting in a cascading failure. This class should be
        // fixed so that decodeURIComponent is not called at this point (in toString).
        // The user should be decoded when the URI is constructor or some other
        // place where we can catch the error before the URI is created or somesuch.
        // eslint-disable-next-line no-useless-catch
        try {
            decodedUser = decodeURIComponent(user);
        }
        catch (error) {
            throw error;
        }
        // Don't hex-escape ':' (%3A), '+' (%2B), '?' (%3F"), '/' (%2F).
        return encodeURIComponent(decodedUser)
            .replace(/%3A/ig, ":")
            .replace(/%2B/ig, "+")
            .replace(/%3F/ig, "?")
            .replace(/%2F/ig, "/");
    }
    headerize(str) {
        const exceptions = {
            "Call-Id": "Call-ID",
            "Cseq": "CSeq",
            "Min-Se": "Min-SE",
            "Rack": "RAck",
            "Rseq": "RSeq",
            "Www-Authenticate": "WWW-Authenticate",
        };
        const name = str.toLowerCase().replace(/_/g, "-").split("-");
        const parts = name.length;
        let hname = "";
        for (let part = 0; part < parts; part++) {
            if (part !== 0) {
                hname += "-";
            }
            hname += name[part].charAt(0).toUpperCase() + name[part].substring(1);
        }
        if (exceptions[hname]) {
            hname = exceptions[hname];
        }
        return hname;
    }
}
/**
 * Returns true if URIs are equivalent per RFC 3261 Section 19.1.4.
 * @param a - URI to compare
 * @param b - URI to compare
 *
 * @remarks
 * 19.1.4 URI Comparison
 * Some operations in this specification require determining whether two
 * SIP or SIPS URIs are equivalent.
 *
 * https://tools.ietf.org/html/rfc3261#section-19.1.4
 * @internal
 */
function equivalentURI(a, b) {
    // o  A SIP and SIPS URI are never equivalent.
    if (a.scheme !== b.scheme) {
        return false;
    }
    // o  Comparison of the userinfo of SIP and SIPS URIs is case-
    //    sensitive.  This includes userinfo containing passwords or
    //    formatted as telephone-subscribers.  Comparison of all other
    //    components of the URI is case-insensitive unless explicitly
    //    defined otherwise.
    //
    // o  The ordering of parameters and header fields is not significant
    //    in comparing SIP and SIPS URIs.
    //
    // o  Characters other than those in the "reserved" set (see RFC 2396
    //    [5]) are equivalent to their ""%" HEX HEX" encoding.
    //
    // o  An IP address that is the result of a DNS lookup of a host name
    //    does not match that host name.
    //
    // o  For two URIs to be equal, the user, password, host, and port
    //    components must match.
    //
    // A URI omitting the user component will not match a URI that
    // includes one.  A URI omitting the password component will not
    // match a URI that includes one.
    //
    // A URI omitting any component with a default value will not
    // match a URI explicitly containing that component with its
    // default value.  For instance, a URI omitting the optional port
    // component will not match a URI explicitly declaring port 5060.
    // The same is true for the transport-parameter, ttl-parameter,
    // user-parameter, and method components.
    //
    // Defining sip:user@host to not be equivalent to
    // sip:user@host:5060 is a change from RFC 2543.  When deriving
    // addresses from URIs, equivalent addresses are expected from
    // equivalent URIs.  The URI sip:user@host:5060 will always
    // resolve to port 5060.  The URI sip:user@host may resolve to
    // other ports through the DNS SRV mechanisms detailed in [4].
    // FIXME: TODO:
    // - character compared to hex encoding is not handled
    // - password does not exist on URI currently
    if (a.user !== b.user || a.host !== b.host || a.port !== b.port) {
        return false;
    }
    // o  URI uri-parameter components are compared as follows:
    function compareParameters(a, b) {
        //  -  Any uri-parameter appearing in both URIs must match.
        const parameterKeysA = Object.keys(a.parameters);
        const parameterKeysB = Object.keys(b.parameters);
        const intersection = parameterKeysA.filter(x => parameterKeysB.includes(x));
        if (!intersection.every(key => a.parameters[key] === b.parameters[key])) {
            return false;
        }
        //  -  A user, ttl, or method uri-parameter appearing in only one
        //     URI never matches, even if it contains the default value.
        if (!["user", "ttl", "method", "transport"].every(key => a.hasParam(key) && b.hasParam(key) || !a.hasParam(key) && !b.hasParam(key))) {
            return false;
        }
        //  -  A URI that includes an maddr parameter will not match a URI
        //     that contains no maddr parameter.
        if (!["maddr"].every(key => a.hasParam(key) && b.hasParam(key) || !a.hasParam(key) && !b.hasParam(key))) {
            return false;
        }
        //  -  All other uri-parameters appearing in only one URI are
        //     ignored when comparing the URIs.
        return true;
    }
    if (!compareParameters(a, b)) {
        return false;
    }
    // o  URI header components are never ignored.  Any present header
    //    component MUST be present in both URIs and match for the URIs
    //    to match.  The matching rules are defined for each header field
    //    in Section 20.
    const headerKeysA = Object.keys(a.headers);
    const headerKeysB = Object.keys(b.headers);
    // No need to check if no headers
    if (headerKeysA.length !== 0 || headerKeysB.length !== 0) {
        // Must have same number of headers
        if (headerKeysA.length !== headerKeysB.length) {
            return false;
        }
        // Must have same headers
        const intersection = headerKeysA.filter(x => headerKeysB.includes(x));
        if (intersection.length !== headerKeysB.length) {
            return false;
        }
        // FIXME: Not to spec. But perhaps not worth fixing?
        // Must have same header values
        // It seems too much to consider multiple headers with same name.
        // It seems too much to compare two header params according to the rule of each header.
        // We'll assume a single header and compare them string to string...
        if (!intersection.every(key => a.headers[key].length && b.headers[key].length && a.headers[key][0] === b.headers[key][0])) {
            return false;
        }
    }
    return true;
}

function peg$padEnd(str, targetLength, padString) {
    padString = padString || ' ';
    if (str.length > targetLength) {
        return str;
    }
    targetLength -= str.length;
    padString += padString.repeat(targetLength);
    return str + padString.slice(0, targetLength);
}
class SyntaxError extends Error {
    constructor(message, expected, found, location) {
        super();
        this.message = message;
        this.expected = expected;
        this.found = found;
        this.location = location;
        this.name = "SyntaxError";
        if (typeof Object.setPrototypeOf === "function") {
            Object.setPrototypeOf(this, SyntaxError.prototype);
        }
        else {
            this.__proto__ = SyntaxError.prototype;
        }
        if (typeof Error.captureStackTrace === "function") {
            Error.captureStackTrace(this, SyntaxError);
        }
    }
    static buildMessage(expected, found) {
        function hex(ch) {
            return ch.charCodeAt(0).toString(16).toUpperCase();
        }
        function literalEscape(s) {
            return s
                .replace(/\\/g, "\\\\")
                .replace(/"/g, "\\\"")
                .replace(/\0/g, "\\0")
                .replace(/\t/g, "\\t")
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/[\x00-\x0F]/g, (ch) => "\\x0" + hex(ch))
                .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x" + hex(ch));
        }
        function classEscape(s) {
            return s
                .replace(/\\/g, "\\\\")
                .replace(/\]/g, "\\]")
                .replace(/\^/g, "\\^")
                .replace(/-/g, "\\-")
                .replace(/\0/g, "\\0")
                .replace(/\t/g, "\\t")
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r")
                .replace(/[\x00-\x0F]/g, (ch) => "\\x0" + hex(ch))
                .replace(/[\x10-\x1F\x7F-\x9F]/g, (ch) => "\\x" + hex(ch));
        }
        function describeExpectation(expectation) {
            switch (expectation.type) {
                case "literal":
                    return "\"" + literalEscape(expectation.text) + "\"";
                case "class":
                    const escapedParts = expectation.parts.map((part) => {
                        return Array.isArray(part)
                            ? classEscape(part[0]) + "-" + classEscape(part[1])
                            : classEscape(part);
                    });
                    return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
                case "any":
                    return "any character";
                case "end":
                    return "end of input";
                case "other":
                    return expectation.description;
            }
        }
        function describeExpected(expected1) {
            const descriptions = expected1.map(describeExpectation);
            let i;
            let j;
            descriptions.sort();
            if (descriptions.length > 0) {
                for (i = 1, j = 1; i < descriptions.length; i++) {
                    if (descriptions[i - 1] !== descriptions[i]) {
                        descriptions[j] = descriptions[i];
                        j++;
                    }
                }
                descriptions.length = j;
            }
            switch (descriptions.length) {
                case 1:
                    return descriptions[0];
                case 2:
                    return descriptions[0] + " or " + descriptions[1];
                default:
                    return descriptions.slice(0, -1).join(", ")
                        + ", or "
                        + descriptions[descriptions.length - 1];
            }
        }
        function describeFound(found1) {
            return found1 ? "\"" + literalEscape(found1) + "\"" : "end of input";
        }
        return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
    }
    format(sources) {
        let str = 'Error: ' + this.message;
        if (this.location) {
            let src = null;
            let k;
            for (k = 0; k < sources.length; k++) {
                if (sources[k].source === this.location.source) {
                    src = sources[k].text.split(/\r\n|\n|\r/g);
                    break;
                }
            }
            let s = this.location.start;
            let loc = this.location.source + ':' + s.line + ':' + s.column;
            if (src) {
                let e = this.location.end;
                let filler = peg$padEnd('', s.line.toString().length, ' ');
                let line = src[s.line - 1];
                let last = s.line === e.line ? e.column : line.length + 1;
                str += '\n --> ' + loc + '\n' + filler + ' |\n' + s.line + ' | ' + line + '\n' + filler + ' | ' +
                    peg$padEnd('', s.column - 1, ' ') +
                    peg$padEnd('', last - s.column, '^');
            }
            else {
                str += '\n at ' + loc;
            }
        }
        return str;
    }
}
function peg$parse(input, options) {
    options = options !== undefined ? options : {};
    const peg$FAILED = {};
    const peg$source = options.grammarSource;
    const peg$startRuleIndices = { Contact: 119, Name_Addr_Header: 156, Record_Route: 176, Request_Response: 81, SIP_URI: 45, Subscription_State: 186, Supported: 191, Require: 182, Via: 194, absoluteURI: 84, Call_ID: 118, Content_Disposition: 130, Content_Length: 135, Content_Type: 136, CSeq: 146, displayName: 122, Event: 149, From: 151, host: 52, Max_Forwards: 154, Min_SE: 213, Proxy_Authenticate: 157, quoted_string: 40, Refer_To: 178, Replaces: 179, Session_Expires: 210, stun_URI: 217, To: 192, turn_URI: 223, uuid: 226, WWW_Authenticate: 209, challenge: 158, sipfrag: 230, Referred_By: 231 };
    let peg$startRuleIndex = 119;
    const peg$consts = [
        "\r\n",
        peg$literalExpectation("\r\n", false),
        /^[0-9]/,
        peg$classExpectation([["0", "9"]], false, false),
        /^[a-zA-Z]/,
        peg$classExpectation([["a", "z"], ["A", "Z"]], false, false),
        /^[0-9a-fA-F]/,
        peg$classExpectation([["0", "9"], ["a", "f"], ["A", "F"]], false, false),
        /^[\0-\xFF]/,
        peg$classExpectation([["\0", "\xFF"]], false, false),
        /^["]/,
        peg$classExpectation(["\""], false, false),
        " ",
        peg$literalExpectation(" ", false),
        "\t",
        peg$literalExpectation("\t", false),
        /^[a-zA-Z0-9]/,
        peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"]], false, false),
        ";",
        peg$literalExpectation(";", false),
        "/",
        peg$literalExpectation("/", false),
        "?",
        peg$literalExpectation("?", false),
        ":",
        peg$literalExpectation(":", false),
        "@",
        peg$literalExpectation("@", false),
        "&",
        peg$literalExpectation("&", false),
        "=",
        peg$literalExpectation("=", false),
        "+",
        peg$literalExpectation("+", false),
        "$",
        peg$literalExpectation("$", false),
        ",",
        peg$literalExpectation(",", false),
        "-",
        peg$literalExpectation("-", false),
        "_",
        peg$literalExpectation("_", false),
        ".",
        peg$literalExpectation(".", false),
        "!",
        peg$literalExpectation("!", false),
        "~",
        peg$literalExpectation("~", false),
        "*",
        peg$literalExpectation("*", false),
        "'",
        peg$literalExpectation("'", false),
        "(",
        peg$literalExpectation("(", false),
        ")",
        peg$literalExpectation(")", false),
        "%",
        peg$literalExpectation("%", false),
        function () { return " "; },
        function () { return ':'; },
        /^[!-~]/,
        peg$classExpectation([["!", "~"]], false, false),
        /^[\x80-\uFFFF]/,
        peg$classExpectation([["\x80", "\uFFFF"]], false, false),
        /^[\x80-\xBF]/,
        peg$classExpectation([["\x80", "\xBF"]], false, false),
        /^[a-f]/,
        peg$classExpectation([["a", "f"]], false, false),
        "`",
        peg$literalExpectation("`", false),
        "<",
        peg$literalExpectation("<", false),
        ">",
        peg$literalExpectation(">", false),
        "\\",
        peg$literalExpectation("\\", false),
        "[",
        peg$literalExpectation("[", false),
        "]",
        peg$literalExpectation("]", false),
        "{",
        peg$literalExpectation("{", false),
        "}",
        peg$literalExpectation("}", false),
        function () { return "*"; },
        function () { return "/"; },
        function () { return "="; },
        function () { return "("; },
        function () { return ")"; },
        function () { return ">"; },
        function () { return "<"; },
        function () { return ","; },
        function () { return ";"; },
        function () { return ":"; },
        function () { return "\""; },
        /^[!-']/,
        peg$classExpectation([["!", "'"]], false, false),
        /^[*-[]/,
        peg$classExpectation([["*", "["]], false, false),
        /^[\]-~]/,
        peg$classExpectation([["]", "~"]], false, false),
        function (contents) {
            return contents;
        },
        /^[#-[]/,
        peg$classExpectation([["#", "["]], false, false),
        /^[\0-\t]/,
        peg$classExpectation([["\0", "\t"]], false, false),
        /^[\v-\f]/,
        peg$classExpectation([["\v", "\f"]], false, false),
        /^[\x0E-\x7F]/,
        peg$classExpectation([["\x0E", "\x7F"]], false, false),
        function () {
            options = options || { data: {} };
            options.data.uri = new URI(options.data.scheme, options.data.user, options.data.host, options.data.port);
            delete options.data.scheme;
            delete options.data.user;
            delete options.data.host;
            delete options.data.host_type;
            delete options.data.port;
        },
        function () {
            options = options || { data: {} };
            options.data.uri = new URI(options.data.scheme, options.data.user, options.data.host, options.data.port, options.data.uri_params, options.data.uri_headers);
            delete options.data.scheme;
            delete options.data.user;
            delete options.data.host;
            delete options.data.host_type;
            delete options.data.port;
            delete options.data.uri_params;
            if (options.startRule === 'SIP_URI') {
                options.data = options.data.uri;
            }
        },
        "sips",
        peg$literalExpectation("sips", true),
        "sip",
        peg$literalExpectation("sip", true),
        function (uri_scheme) {
            options = options || { data: {} };
            options.data.scheme = uri_scheme;
        },
        function () {
            options = options || { data: {} };
            options.data.user = decodeURIComponent(text().slice(0, -1));
        },
        function () {
            options = options || { data: {} };
            options.data.password = text();
        },
        function () {
            options = options || { data: {} };
            options.data.host = text();
            return options.data.host;
        },
        function () {
            options = options || { data: {} };
            options.data.host_type = 'domain';
            return text();
        },
        /^[a-zA-Z0-9_\-]/,
        peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "_", "-"], false, false),
        /^[a-zA-Z0-9\-]/,
        peg$classExpectation([["a", "z"], ["A", "Z"], ["0", "9"], "-"], false, false),
        function () {
            options = options || { data: {} };
            options.data.host_type = 'IPv6';
            return text();
        },
        "::",
        peg$literalExpectation("::", false),
        function () {
            options = options || { data: {} };
            options.data.host_type = 'IPv6';
            return text();
        },
        function () {
            options = options || { data: {} };
            options.data.host_type = 'IPv4';
            return text();
        },
        "25",
        peg$literalExpectation("25", false),
        /^[0-5]/,
        peg$classExpectation([["0", "5"]], false, false),
        "2",
        peg$literalExpectation("2", false),
        /^[0-4]/,
        peg$classExpectation([["0", "4"]], false, false),
        "1",
        peg$literalExpectation("1", false),
        /^[1-9]/,
        peg$classExpectation([["1", "9"]], false, false),
        function (port) {
            options = options || { data: {} };
            port = parseInt(port.join(''));
            options.data.port = port;
            return port;
        },
        "transport=",
        peg$literalExpectation("transport=", true),
        "udp",
        peg$literalExpectation("udp", true),
        "tcp",
        peg$literalExpectation("tcp", true),
        "sctp",
        peg$literalExpectation("sctp", true),
        "tls",
        peg$literalExpectation("tls", true),
        function (transport) {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            options.data.uri_params['transport'] = transport.toLowerCase();
        },
        "user=",
        peg$literalExpectation("user=", true),
        "phone",
        peg$literalExpectation("phone", true),
        "ip",
        peg$literalExpectation("ip", true),
        function (user) {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            options.data.uri_params['user'] = user.toLowerCase();
        },
        "method=",
        peg$literalExpectation("method=", true),
        function (method) {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            options.data.uri_params['method'] = method;
        },
        "ttl=",
        peg$literalExpectation("ttl=", true),
        function (ttl) {
            options = options || { data: {} };
            if (!options.data.params)
                options.data.params = {};
            options.data.params['ttl'] = ttl;
        },
        "maddr=",
        peg$literalExpectation("maddr=", true),
        function (maddr) {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            options.data.uri_params['maddr'] = maddr;
        },
        "lr",
        peg$literalExpectation("lr", true),
        function () {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            options.data.uri_params['lr'] = undefined;
        },
        function (param, value) {
            options = options || { data: {} };
            if (!options.data.uri_params)
                options.data.uri_params = {};
            if (value === null) {
                value = undefined;
            }
            else {
                value = value[1];
            }
            options.data.uri_params[param.toLowerCase()] = value;
        },
        function (hname, hvalue) {
            hname = hname.join('').toLowerCase();
            hvalue = hvalue.join('');
            options = options || { data: {} };
            if (!options.data.uri_headers)
                options.data.uri_headers = {};
            if (!options.data.uri_headers[hname]) {
                options.data.uri_headers[hname] = [hvalue];
            }
            else {
                options.data.uri_headers[hname].push(hvalue);
            }
        },
        function () {
            options = options || { data: {} };
            // lots of tests fail if this isn't guarded...
            if (options.startRule === 'Refer_To') {
                options.data.uri = new URI(options.data.scheme, options.data.user, options.data.host, options.data.port, options.data.uri_params, options.data.uri_headers);
                delete options.data.scheme;
                delete options.data.user;
                delete options.data.host;
                delete options.data.host_type;
                delete options.data.port;
                delete options.data.uri_params;
            }
        },
        "//",
        peg$literalExpectation("//", false),
        function () {
            options = options || { data: {} };
            options.data.scheme = text();
        },
        peg$literalExpectation("SIP", true),
        function () {
            options = options || { data: {} };
            options.data.sip_version = text();
        },
        "INVITE",
        peg$literalExpectation("INVITE", false),
        "ACK",
        peg$literalExpectation("ACK", false),
        "VXACH",
        peg$literalExpectation("VXACH", false),
        "OPTIONS",
        peg$literalExpectation("OPTIONS", false),
        "BYE",
        peg$literalExpectation("BYE", false),
        "CANCEL",
        peg$literalExpectation("CANCEL", false),
        "REGISTER",
        peg$literalExpectation("REGISTER", false),
        "SUBSCRIBE",
        peg$literalExpectation("SUBSCRIBE", false),
        "NOTIFY",
        peg$literalExpectation("NOTIFY", false),
        "REFER",
        peg$literalExpectation("REFER", false),
        "PUBLISH",
        peg$literalExpectation("PUBLISH", false),
        function () {
            options = options || { data: {} };
            options.data.method = text();
            return options.data.method;
        },
        function (status_code) {
            options = options || { data: {} };
            options.data.status_code = parseInt(status_code.join(''));
        },
        function () {
            options = options || { data: {} };
            options.data.reason_phrase = text();
        },
        function () {
            options = options || { data: {} };
            options.data = text();
        },
        function () {
            var idx, length;
            options = options || { data: {} };
            length = options.data.multi_header.length;
            for (idx = 0; idx < length; idx++) {
                if (options.data.multi_header[idx].parsed === null) {
                    options.data = null;
                    break;
                }
            }
            if (options.data !== null) {
                options.data = options.data.multi_header;
            }
            else {
                options.data = -1;
            }
        },
        function () {
            var header;
            options = options || { data: {} };
            if (!options.data.multi_header)
                options.data.multi_header = [];
            try {
                header = new NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
                delete options.data.uri;
                delete options.data.displayName;
                delete options.data.params;
            }
            catch (e) {
                header = null;
            }
            options.data.multi_header.push({ 'position': peg$currPos,
                'offset': location().start.offset,
                'parsed': header
            });
        },
        function (displayName) {
            displayName = text().trim();
            if (displayName[0] === '\"') {
                displayName = displayName.substring(1, displayName.length - 1);
            }
            options = options || { data: {} };
            options.data.displayName = displayName;
        },
        "q",
        peg$literalExpectation("q", true),
        function (q) {
            options = options || { data: {} };
            if (!options.data.params)
                options.data.params = {};
            options.data.params['q'] = q;
        },
        "expires",
        peg$literalExpectation("expires", true),
        function (expires) {
            options = options || { data: {} };
            if (!options.data.params)
                options.data.params = {};
            options.data.params['expires'] = expires;
        },
        function (delta_seconds) {
            return parseInt(delta_seconds.join(''));
        },
        "0",
        peg$literalExpectation("0", false),
        function () {
            return parseFloat(text());
        },
        function (param, value) {
            options = options || { data: {} };
            if (!options.data.params)
                options.data.params = {};
            if (value === null) {
                value = undefined;
            }
            else {
                value = value[1];
            }
            options.data.params[param.toLowerCase()] = value;
        },
        "render",
        peg$literalExpectation("render", true),
        "session",
        peg$literalExpectation("session", true),
        "icon",
        peg$literalExpectation("icon", true),
        "alert",
        peg$literalExpectation("alert", true),
        function () {
            options = options || { data: {} };
            if (options.startRule === 'Content_Disposition') {
                options.data.type = text().toLowerCase();
            }
        },
        "handling",
        peg$literalExpectation("handling", true),
        "optional",
        peg$literalExpectation("optional", true),
        "required",
        peg$literalExpectation("required", true),
        function (length) {
            options = options || { data: {} };
            options.data = parseInt(length.join(''));
        },
        function () {
            options = options || { data: {} };
            options.data = text();
        },
        "text",
        peg$literalExpectation("text", true),
        "image",
        peg$literalExpectation("image", true),
        "audio",
        peg$literalExpectation("audio", true),
        "video",
        peg$literalExpectation("video", true),
        "application",
        peg$literalExpectation("application", true),
        "message",
        peg$literalExpectation("message", true),
        "multipart",
        peg$literalExpectation("multipart", true),
        "x-",
        peg$literalExpectation("x-", true),
        function (cseq_value) {
            options = options || { data: {} };
            options.data.value = parseInt(cseq_value.join(''));
        },
        function (expires) { options = options || { data: {} }; options.data = expires; },
        function (event_type) {
            options = options || { data: {} };
            options.data.event = event_type.toLowerCase();
        },
        function () {
            options = options || { data: {} };
            var tag = options.data.tag;
            options.data = new NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
            if (tag) {
                options.data.setParam('tag', tag);
            }
        },
        "tag",
        peg$literalExpectation("tag", true),
        function (tag) { options = options || { data: {} }; options.data.tag = tag; },
        function (forwards) {
            options = options || { data: {} };
            options.data = parseInt(forwards.join(''));
        },
        function (min_expires) { options = options || { data: {} }; options.data = min_expires; },
        function () {
            options = options || { data: {} };
            options.data = new NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
        },
        "digest",
        peg$literalExpectation("Digest", true),
        "realm",
        peg$literalExpectation("realm", true),
        function (realm) { options = options || { data: {} }; options.data.realm = realm; },
        "domain",
        peg$literalExpectation("domain", true),
        "nonce",
        peg$literalExpectation("nonce", true),
        function (nonce) { options = options || { data: {} }; options.data.nonce = nonce; },
        "opaque",
        peg$literalExpectation("opaque", true),
        function (opaque) { options = options || { data: {} }; options.data.opaque = opaque; },
        "stale",
        peg$literalExpectation("stale", true),
        "true",
        peg$literalExpectation("true", true),
        function () { options = options || { data: {} }; options.data.stale = true; },
        "false",
        peg$literalExpectation("false", true),
        function () { options = options || { data: {} }; options.data.stale = false; },
        "algorithm",
        peg$literalExpectation("algorithm", true),
        "md5",
        peg$literalExpectation("MD5", true),
        "md5-sess",
        peg$literalExpectation("MD5-sess", true),
        function (algorithm) {
            options = options || { data: {} };
            options.data.algorithm = algorithm.toUpperCase();
        },
        "qop",
        peg$literalExpectation("qop", true),
        "auth-int",
        peg$literalExpectation("auth-int", true),
        "auth",
        peg$literalExpectation("auth", true),
        function (qop_value) {
            options = options || { data: {} };
            options.data.qop || (options.data.qop = []);
            options.data.qop.push(qop_value.toLowerCase());
        },
        function (rack_value) {
            options = options || { data: {} };
            options.data.value = parseInt(rack_value.join(''));
        },
        function () {
            var idx, length;
            options = options || { data: {} };
            length = options.data.multi_header.length;
            for (idx = 0; idx < length; idx++) {
                if (options.data.multi_header[idx].parsed === null) {
                    options.data = null;
                    break;
                }
            }
            if (options.data !== null) {
                options.data = options.data.multi_header;
            }
            else {
                options.data = -1;
            }
        },
        function () {
            var header;
            options = options || { data: {} };
            if (!options.data.multi_header)
                options.data.multi_header = [];
            try {
                header = new NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
                delete options.data.uri;
                delete options.data.displayName;
                delete options.data.params;
            }
            catch (e) {
                header = null;
            }
            options.data.multi_header.push({ 'position': peg$currPos,
                'offset': location().start.offset,
                'parsed': header
            });
        },
        function () {
            options = options || { data: {} };
            options.data = new NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
        },
        function () {
            options = options || { data: {} };
            if (!(options.data.replaces_from_tag && options.data.replaces_to_tag)) {
                options.data = -1;
            }
        },
        function () {
            options = options || { data: {} };
            options.data = {
                call_id: options.data
            };
        },
        "from-tag",
        peg$literalExpectation("from-tag", true),
        function (from_tag) {
            options = options || { data: {} };
            options.data.replaces_from_tag = from_tag;
        },
        "to-tag",
        peg$literalExpectation("to-tag", true),
        function (to_tag) {
            options = options || { data: {} };
            options.data.replaces_to_tag = to_tag;
        },
        "early-only",
        peg$literalExpectation("early-only", true),
        function () {
            options = options || { data: {} };
            options.data.early_only = true;
        },
        function (head, r) { return r; },
        function (head, tail) { return list(head, tail); },
        function (value) {
            options = options || { data: {} };
            if (options.startRule === 'Require') {
                options.data = value || [];
            }
        },
        function (rseq_value) {
            options = options || { data: {} };
            options.data.value = parseInt(rseq_value.join(''));
        },
        "active",
        peg$literalExpectation("active", true),
        "pending",
        peg$literalExpectation("pending", true),
        "terminated",
        peg$literalExpectation("terminated", true),
        function () {
            options = options || { data: {} };
            options.data.state = text();
        },
        "reason",
        peg$literalExpectation("reason", true),
        function (reason) {
            options = options || { data: {} };
            if (typeof reason !== 'undefined')
                options.data.reason = reason;
        },
        function (expires) {
            options = options || { data: {} };
            if (typeof expires !== 'undefined')
                options.data.expires = expires;
        },
        "retry_after",
        peg$literalExpectation("retry_after", true),
        function (retry_after) {
            options = options || { data: {} };
            if (typeof retry_after !== 'undefined')
                options.data.retry_after = retry_after;
        },
        "deactivated",
        peg$literalExpectation("deactivated", true),
        "probation",
        peg$literalExpectation("probation", true),
        "rejected",
        peg$literalExpectation("rejected", true),
        "timeout",
        peg$literalExpectation("timeout", true),
        "giveup",
        peg$literalExpectation("giveup", true),
        "noresource",
        peg$literalExpectation("noresource", true),
        "invariant",
        peg$literalExpectation("invariant", true),
        function (value) {
            options = options || { data: {} };
            if (options.startRule === 'Supported') {
                options.data = value || [];
            }
        },
        function () {
            options = options || { data: {} };
            var tag = options.data.tag;
            options.data = new NameAddrHeader(options.data.uri, options.data.displayName, options.data.params);
            if (tag) {
                options.data.setParam('tag', tag);
            }
        },
        "ttl",
        peg$literalExpectation("ttl", true),
        function (via_ttl_value) {
            options = options || { data: {} };
            options.data.ttl = via_ttl_value;
        },
        "maddr",
        peg$literalExpectation("maddr", true),
        function (via_maddr) {
            options = options || { data: {} };
            options.data.maddr = via_maddr;
        },
        "received",
        peg$literalExpectation("received", true),
        function (via_received) {
            options = options || { data: {} };
            options.data.received = via_received;
        },
        "branch",
        peg$literalExpectation("branch", true),
        function (via_branch) {
            options = options || { data: {} };
            options.data.branch = via_branch;
        },
        "rport",
        peg$literalExpectation("rport", true),
        function (response_port) {
            options = options || { data: {} };
            if (typeof response_port !== 'undefined')
                options.data.rport = response_port.join('');
        },
        function (via_protocol) {
            options = options || { data: {} };
            options.data.protocol = via_protocol;
        },
        peg$literalExpectation("UDP", true),
        peg$literalExpectation("TCP", true),
        peg$literalExpectation("TLS", true),
        peg$literalExpectation("SCTP", true),
        function (via_transport) {
            options = options || { data: {} };
            options.data.transport = via_transport;
        },
        function () {
            options = options || { data: {} };
            options.data.host = text();
        },
        function (via_sent_by_port) {
            options = options || { data: {} };
            options.data.port = parseInt(via_sent_by_port.join(''));
        },
        function (ttl) {
            return parseInt(ttl.join(''));
        },
        function (deltaSeconds) {
            options = options || { data: {} };
            if (options.startRule === 'Session_Expires') {
                options.data.deltaSeconds = deltaSeconds;
            }
        },
        "refresher",
        peg$literalExpectation("refresher", false),
        "uas",
        peg$literalExpectation("uas", false),
        "uac",
        peg$literalExpectation("uac", false),
        function (endpoint) {
            options = options || { data: {} };
            if (options.startRule === 'Session_Expires') {
                options.data.refresher = endpoint;
            }
        },
        function (deltaSeconds) {
            options = options || { data: {} };
            if (options.startRule === 'Min_SE') {
                options.data = deltaSeconds;
            }
        },
        "stuns",
        peg$literalExpectation("stuns", true),
        "stun",
        peg$literalExpectation("stun", true),
        function (scheme) {
            options = options || { data: {} };
            options.data.scheme = scheme;
        },
        function (host) {
            options = options || { data: {} };
            options.data.host = host;
        },
        "?transport=",
        peg$literalExpectation("?transport=", false),
        "turns",
        peg$literalExpectation("turns", true),
        "turn",
        peg$literalExpectation("turn", true),
        function (transport) {
            options = options || { data: {} };
            options.data.transport = transport;
        },
        function () {
            options = options || { data: {} };
            options.data = text();
        },
        "Referred-By",
        peg$literalExpectation("Referred-By", false),
        "b",
        peg$literalExpectation("b", false),
        "cid",
        peg$literalExpectation("cid", false)
    ];
    const peg$bytecode = [
        peg$decode("2 \"\"6 7!"),
        peg$decode("4\"\"\"5!7#"),
        peg$decode("4$\"\"5!7%"),
        peg$decode("4&\"\"5!7'"),
        peg$decode(";'.# &;("),
        peg$decode("4(\"\"5!7)"),
        peg$decode("4*\"\"5!7+"),
        peg$decode("2,\"\"6,7-"),
        peg$decode("2.\"\"6.7/"),
        peg$decode("40\"\"5!71"),
        peg$decode("22\"\"6273.\x89 &24\"\"6475.} &26\"\"6677.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),
        peg$decode(";).# &;,"),
        peg$decode("2F\"\"6F7G.} &2H\"\"6H7I.q &2J\"\"6J7K.e &2L\"\"6L7M.Y &2N\"\"6N7O.M &2P\"\"6P7Q.A &2R\"\"6R7S.5 &2T\"\"6T7U.) &2V\"\"6V7W"),
        peg$decode("%%2X\"\"6X7Y/5#;#/,$;#/#$+#)(#'#(\"'#&'#/\"!&,)"),
        peg$decode("%%$;$0#*;$&/,#; /#$+\")(\"'#&'#.\" &\"/=#$;$/&#0#*;$&&&#/'$8\":Z\" )(\"'#&'#"),
        peg$decode(";..\" &\""),
        peg$decode("%$;'.# &;(0)*;'.# &;(&/?#28\"\"6879/0$;//'$8#:[# )(#'#(\"'#&'#"),
        peg$decode("%%$;2/&#0#*;2&&&#/g#$%$;.0#*;.&/,#;2/#$+\")(\"'#&'#0=*%$;.0#*;.&/,#;2/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("4\\\"\"5!7].# &;3"),
        peg$decode("4^\"\"5!7_"),
        peg$decode("4`\"\"5!7a"),
        peg$decode(";!.) &4b\"\"5!7c"),
        peg$decode("%$;).\x95 &2F\"\"6F7G.\x89 &2J\"\"6J7K.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O/\x9E#0\x9B*;).\x95 &2F\"\"6F7G.\x89 &2J\"\"6J7K.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O&&&#/\"!&,)"),
        peg$decode("%$;).\x89 &2F\"\"6F7G.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O/\x92#0\x8F*;).\x89 &2F\"\"6F7G.} &2L\"\"6L7M.q &2X\"\"6X7Y.e &2P\"\"6P7Q.Y &2H\"\"6H7I.M &2@\"\"6@7A.A &2d\"\"6d7e.5 &2R\"\"6R7S.) &2N\"\"6N7O&&&#/\"!&,)"),
        peg$decode("2T\"\"6T7U.\xE3 &2V\"\"6V7W.\xD7 &2f\"\"6f7g.\xCB &2h\"\"6h7i.\xBF &2:\"\"6:7;.\xB3 &2D\"\"6D7E.\xA7 &22\"\"6273.\x9B &28\"\"6879.\x8F &2j\"\"6j7k.\x83 &;&.} &24\"\"6475.q &2l\"\"6l7m.e &2n\"\"6n7o.Y &26\"\"6677.M &2>\"\"6>7?.A &2p\"\"6p7q.5 &2r\"\"6r7s.) &;'.# &;("),
        peg$decode("%$;).\u012B &2F\"\"6F7G.\u011F &2J\"\"6J7K.\u0113 &2L\"\"6L7M.\u0107 &2X\"\"6X7Y.\xFB &2P\"\"6P7Q.\xEF &2H\"\"6H7I.\xE3 &2@\"\"6@7A.\xD7 &2d\"\"6d7e.\xCB &2R\"\"6R7S.\xBF &2N\"\"6N7O.\xB3 &2T\"\"6T7U.\xA7 &2V\"\"6V7W.\x9B &2f\"\"6f7g.\x8F &2h\"\"6h7i.\x83 &28\"\"6879.w &2j\"\"6j7k.k &;&.e &24\"\"6475.Y &2l\"\"6l7m.M &2n\"\"6n7o.A &26\"\"6677.5 &2p\"\"6p7q.) &2r\"\"6r7s/\u0134#0\u0131*;).\u012B &2F\"\"6F7G.\u011F &2J\"\"6J7K.\u0113 &2L\"\"6L7M.\u0107 &2X\"\"6X7Y.\xFB &2P\"\"6P7Q.\xEF &2H\"\"6H7I.\xE3 &2@\"\"6@7A.\xD7 &2d\"\"6d7e.\xCB &2R\"\"6R7S.\xBF &2N\"\"6N7O.\xB3 &2T\"\"6T7U.\xA7 &2V\"\"6V7W.\x9B &2f\"\"6f7g.\x8F &2h\"\"6h7i.\x83 &28\"\"6879.w &2j\"\"6j7k.k &;&.e &24\"\"6475.Y &2l\"\"6l7m.M &2n\"\"6n7o.A &26\"\"6677.5 &2p\"\"6p7q.) &2r\"\"6r7s&&&#/\"!&,)"),
        peg$decode("%;//?#2P\"\"6P7Q/0$;//'$8#:t# )(#'#(\"'#&'#"),
        peg$decode("%;//?#24\"\"6475/0$;//'$8#:u# )(#'#(\"'#&'#"),
        peg$decode("%;//?#2>\"\"6>7?/0$;//'$8#:v# )(#'#(\"'#&'#"),
        peg$decode("%;//?#2T\"\"6T7U/0$;//'$8#:w# )(#'#(\"'#&'#"),
        peg$decode("%;//?#2V\"\"6V7W/0$;//'$8#:x# )(#'#(\"'#&'#"),
        peg$decode("%2h\"\"6h7i/0#;//'$8\":y\" )(\"'#&'#"),
        peg$decode("%;//6#2f\"\"6f7g/'$8\":z\" )(\"'#&'#"),
        peg$decode("%;//?#2D\"\"6D7E/0$;//'$8#:{# )(#'#(\"'#&'#"),
        peg$decode("%;//?#22\"\"6273/0$;//'$8#:|# )(#'#(\"'#&'#"),
        peg$decode("%;//?#28\"\"6879/0$;//'$8#:}# )(#'#(\"'#&'#"),
        peg$decode("%;//0#;&/'$8\":~\" )(\"'#&'#"),
        peg$decode("%;&/0#;//'$8\":~\" )(\"'#&'#"),
        peg$decode("%;=/T#$;G.) &;K.# &;F0/*;G.) &;K.# &;F&/,$;>/#$+#)(#'#(\"'#&'#"),
        peg$decode("4\x7F\"\"5!7\x80.A &4\x81\"\"5!7\x82.5 &4\x83\"\"5!7\x84.) &;3.# &;."),
        peg$decode("%%;//Q#;&/H$$;J.# &;K0)*;J.# &;K&/,$;&/#$+$)($'#(#'#(\"'#&'#/\"!&,)"),
        peg$decode("%;//]#;&/T$%$;J.# &;K0)*;J.# &;K&/\"!&,)/1$;&/($8$:\x85$!!)($'#(#'#(\"'#&'#"),
        peg$decode(";..G &2L\"\"6L7M.; &4\x86\"\"5!7\x87./ &4\x83\"\"5!7\x84.# &;3"),
        peg$decode("%2j\"\"6j7k/J#4\x88\"\"5!7\x89.5 &4\x8A\"\"5!7\x8B.) &4\x8C\"\"5!7\x8D/#$+\")(\"'#&'#"),
        peg$decode("%;N/M#28\"\"6879/>$;O.\" &\"/0$;S/'$8$:\x8E$ )($'#(#'#(\"'#&'#"),
        peg$decode("%;N/d#28\"\"6879/U$;O.\" &\"/G$;S/>$;_/5$;l.\" &\"/'$8&:\x8F& )(&'#(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%3\x90\"\"5$7\x91.) &3\x92\"\"5#7\x93/' 8!:\x94!! )"),
        peg$decode("%;P/]#%28\"\"6879/,#;R/#$+\")(\"'#&'#.\" &\"/6$2:\"\"6:7;/'$8#:\x95# )(#'#(\"'#&'#"),
        peg$decode("$;+.) &;-.# &;Q/2#0/*;+.) &;-.# &;Q&&&#"),
        peg$decode("2<\"\"6<7=.q &2>\"\"6>7?.e &2@\"\"6@7A.Y &2B\"\"6B7C.M &2D\"\"6D7E.A &22\"\"6273.5 &26\"\"6677.) &24\"\"6475"),
        peg$decode("%$;+._ &;-.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E0e*;+._ &;-.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E&/& 8!:\x96! )"),
        peg$decode("%;T/J#%28\"\"6879/,#;^/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
        peg$decode("%;U.) &;\\.# &;X/& 8!:\x97! )"),
        peg$decode("%$%;V/2#2J\"\"6J7K/#$+\")(\"'#&'#0<*%;V/2#2J\"\"6J7K/#$+\")(\"'#&'#&/D#;W/;$2J\"\"6J7K.\" &\"/'$8#:\x98# )(#'#(\"'#&'#"),
        peg$decode("$4\x99\"\"5!7\x9A/,#0)*4\x99\"\"5!7\x9A&&&#"),
        peg$decode("%4$\"\"5!7%/?#$4\x9B\"\"5!7\x9C0)*4\x9B\"\"5!7\x9C&/#$+\")(\"'#&'#"),
        peg$decode("%2l\"\"6l7m/?#;Y/6$2n\"\"6n7o/'$8#:\x9D# )(#'#(\"'#&'#"),
        peg$decode("%%;Z/\xB3#28\"\"6879/\xA4$;Z/\x9B$28\"\"6879/\x8C$;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+-)(-'#(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0790 &%2\x9E\"\"6\x9E7\x9F/\xA4#;Z/\x9B$28\"\"6879/\x8C$;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+,)(,'#(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u06F9 &%2\x9E\"\"6\x9E7\x9F/\x8C#;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u067A &%2\x9E\"\"6\x9E7\x9F/t#;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0613 &%2\x9E\"\"6\x9E7\x9F/\\#;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+&)(&'#(%'#($'#(#'#(\"'#&'#.\u05C4 &%2\x9E\"\"6\x9E7\x9F/D#;Z/;$28\"\"6879/,$;[/#$+$)($'#(#'#(\"'#&'#.\u058D &%2\x9E\"\"6\x9E7\x9F/,#;[/#$+\")(\"'#&'#.\u056E &%2\x9E\"\"6\x9E7\x9F/,#;Z/#$+\")(\"'#&'#.\u054F &%;Z/\x9B#2\x9E\"\"6\x9E7\x9F/\x8C$;Z/\x83$28\"\"6879/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$++)(+'#(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u04C7 &%;Z/\xAA#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x83$2\x9E\"\"6\x9E7\x9F/t$;Z/k$28\"\"6879/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+*)(*'#()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0430 &%;Z/\xB9#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x92$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/k$2\x9E\"\"6\x9E7\x9F/\\$;Z/S$28\"\"6879/D$;Z/;$28\"\"6879/,$;[/#$+))()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u038A &%;Z/\xC8#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xA1$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/z$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/S$2\x9E\"\"6\x9E7\x9F/D$;Z/;$28\"\"6879/,$;[/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u02D5 &%;Z/\xD7#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xB0$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x89$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/b$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/;$2\x9E\"\"6\x9E7\x9F/,$;[/#$+')(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0211 &%;Z/\xFE#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xD7$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xB0$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x89$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/b$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/;$2\x9E\"\"6\x9E7\x9F/,$;Z/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.\u0126 &%;Z/\u011C#%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xF5$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xCE$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\xA7$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/\x80$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/Y$%28\"\"6879/,#;Z/#$+\")(\"'#&'#.\" &\"/2$2\x9E\"\"6\x9E7\x9F/#$+()(('#(''#(&'#(%'#($'#(#'#(\"'#&'#/& 8!:\xA0! )"),
        peg$decode("%;#/M#;#.\" &\"/?$;#.\" &\"/1$;#.\" &\"/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%;Z/;#28\"\"6879/,$;Z/#$+#)(#'#(\"'#&'#.# &;\\"),
        peg$decode("%;]/o#2J\"\"6J7K/`$;]/W$2J\"\"6J7K/H$;]/?$2J\"\"6J7K/0$;]/'$8':\xA1' )(''#(&'#(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%2\xA2\"\"6\xA27\xA3/2#4\xA4\"\"5!7\xA5/#$+\")(\"'#&'#.\x98 &%2\xA6\"\"6\xA67\xA7/;#4\xA8\"\"5!7\xA9/,$;!/#$+#)(#'#(\"'#&'#.j &%2\xAA\"\"6\xAA7\xAB/5#;!/,$;!/#$+#)(#'#(\"'#&'#.B &%4\xAC\"\"5!7\xAD/,#;!/#$+\")(\"'#&'#.# &;!"),
        peg$decode("%%;!.\" &\"/[#;!.\" &\"/M$;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+%)(%'#($'#(#'#(\"'#&'#/' 8!:\xAE!! )"),
        peg$decode("$%22\"\"6273/,#;`/#$+\")(\"'#&'#0<*%22\"\"6273/,#;`/#$+\")(\"'#&'#&"),
        peg$decode(";a.A &;b.; &;c.5 &;d./ &;e.) &;f.# &;g"),
        peg$decode("%3\xAF\"\"5*7\xB0/a#3\xB1\"\"5#7\xB2.G &3\xB3\"\"5#7\xB4.; &3\xB5\"\"5$7\xB6./ &3\xB7\"\"5#7\xB8.# &;6/($8\":\xB9\"! )(\"'#&'#"),
        peg$decode("%3\xBA\"\"5%7\xBB/I#3\xBC\"\"5%7\xBD./ &3\xBE\"\"5\"7\xBF.# &;6/($8\":\xC0\"! )(\"'#&'#"),
        peg$decode("%3\xC1\"\"5'7\xC2/1#;\x90/($8\":\xC3\"! )(\"'#&'#"),
        peg$decode("%3\xC4\"\"5$7\xC5/1#;\xF0/($8\":\xC6\"! )(\"'#&'#"),
        peg$decode("%3\xC7\"\"5&7\xC8/1#;T/($8\":\xC9\"! )(\"'#&'#"),
        peg$decode("%3\xCA\"\"5\"7\xCB/N#%2>\"\"6>7?/,#;6/#$+\")(\"'#&'#.\" &\"/'$8\":\xCC\" )(\"'#&'#"),
        peg$decode("%;h/P#%2>\"\"6>7?/,#;i/#$+\")(\"'#&'#.\" &\"/)$8\":\xCD\"\"! )(\"'#&'#"),
        peg$decode("%$;j/&#0#*;j&&&#/\"!&,)"),
        peg$decode("%$;j/&#0#*;j&&&#/\"!&,)"),
        peg$decode(";k.) &;+.# &;-"),
        peg$decode("2l\"\"6l7m.e &2n\"\"6n7o.Y &24\"\"6475.M &28\"\"6879.A &2<\"\"6<7=.5 &2@\"\"6@7A.) &2B\"\"6B7C"),
        peg$decode("%26\"\"6677/n#;m/e$$%2<\"\"6<7=/,#;m/#$+\")(\"'#&'#0<*%2<\"\"6<7=/,#;m/#$+\")(\"'#&'#&/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;n/A#2>\"\"6>7?/2$;o/)$8#:\xCE#\"\" )(#'#(\"'#&'#"),
        peg$decode("$;p.) &;+.# &;-/2#0/*;p.) &;+.# &;-&&&#"),
        peg$decode("$;p.) &;+.# &;-0/*;p.) &;+.# &;-&"),
        peg$decode("2l\"\"6l7m.e &2n\"\"6n7o.Y &24\"\"6475.M &26\"\"6677.A &28\"\"6879.5 &2@\"\"6@7A.) &2B\"\"6B7C"),
        peg$decode(";\x91.# &;r"),
        peg$decode("%;\x90/G#;'/>$;s/5$;'/,$;\x84/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode(";M.# &;t"),
        peg$decode("%;\x7F/E#28\"\"6879/6$;u.# &;x/'$8#:\xCF# )(#'#(\"'#&'#"),
        peg$decode("%;v.# &;w/J#%26\"\"6677/,#;\x83/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
        peg$decode("%2\xD0\"\"6\xD07\xD1/:#;\x80/1$;w.\" &\"/#$+#)(#'#(\"'#&'#"),
        peg$decode("%24\"\"6475/,#;{/#$+\")(\"'#&'#"),
        peg$decode("%;z/3#$;y0#*;y&/#$+\")(\"'#&'#"),
        peg$decode(";*.) &;+.# &;-"),
        peg$decode(";+.\x8F &;-.\x89 &22\"\"6273.} &26\"\"6677.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),
        peg$decode("%;|/e#$%24\"\"6475/,#;|/#$+\")(\"'#&'#0<*%24\"\"6475/,#;|/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%$;~0#*;~&/e#$%22\"\"6273/,#;}/#$+\")(\"'#&'#0<*%22\"\"6273/,#;}/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("$;~0#*;~&"),
        peg$decode(";+.w &;-.q &28\"\"6879.e &2:\"\"6:7;.Y &2<\"\"6<7=.M &2>\"\"6>7?.A &2@\"\"6@7A.5 &2B\"\"6B7C.) &2D\"\"6D7E"),
        peg$decode("%%;\"/\x87#$;\".G &;!.A &2@\"\"6@7A.5 &2F\"\"6F7G.) &2J\"\"6J7K0M*;\".G &;!.A &2@\"\"6@7A.5 &2F\"\"6F7G.) &2J\"\"6J7K&/#$+\")(\"'#&'#/& 8!:\xD2! )"),
        peg$decode(";\x81.# &;\x82"),
        peg$decode("%%;O/2#2:\"\"6:7;/#$+\")(\"'#&'#.\" &\"/,#;S/#$+\")(\"'#&'#.\" &\""),
        peg$decode("$;+.\x83 &;-.} &2B\"\"6B7C.q &2D\"\"6D7E.e &22\"\"6273.Y &28\"\"6879.M &2:\"\"6:7;.A &2<\"\"6<7=.5 &2>\"\"6>7?.) &2@\"\"6@7A/\x8C#0\x89*;+.\x83 &;-.} &2B\"\"6B7C.q &2D\"\"6D7E.e &22\"\"6273.Y &28\"\"6879.M &2:\"\"6:7;.A &2<\"\"6<7=.5 &2>\"\"6>7?.) &2@\"\"6@7A&&&#"),
        peg$decode("$;y0#*;y&"),
        peg$decode("%3\x92\"\"5#7\xD3/q#24\"\"6475/b$$;!/&#0#*;!&&&#/L$2J\"\"6J7K/=$$;!/&#0#*;!&&&#/'$8%:\xD4% )(%'#($'#(#'#(\"'#&'#"),
        peg$decode("2\xD5\"\"6\xD57\xD6"),
        peg$decode("2\xD7\"\"6\xD77\xD8"),
        peg$decode("2\xD9\"\"6\xD97\xDA"),
        peg$decode("2\xDB\"\"6\xDB7\xDC"),
        peg$decode("2\xDD\"\"6\xDD7\xDE"),
        peg$decode("2\xDF\"\"6\xDF7\xE0"),
        peg$decode("2\xE1\"\"6\xE17\xE2"),
        peg$decode("2\xE3\"\"6\xE37\xE4"),
        peg$decode("2\xE5\"\"6\xE57\xE6"),
        peg$decode("2\xE7\"\"6\xE77\xE8"),
        peg$decode("2\xE9\"\"6\xE97\xEA"),
        peg$decode("%;\x85.Y &;\x86.S &;\x88.M &;\x89.G &;\x8A.A &;\x8B.; &;\x8C.5 &;\x8F./ &;\x8D.) &;\x8E.# &;6/& 8!:\xEB! )"),
        peg$decode("%;\x84/G#;'/>$;\x92/5$;'/,$;\x94/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%;\x93/' 8!:\xEC!! )"),
        peg$decode("%;!/5#;!/,$;!/#$+#)(#'#(\"'#&'#"),
        peg$decode("%$;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(0G*;*.A &;+.; &;-.5 &;3./ &;4.) &;'.# &;(&/& 8!:\xED! )"),
        peg$decode("%;\xB6/Y#$%;A/,#;\xB6/#$+\")(\"'#&'#06*%;A/,#;\xB6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%;9/N#%2:\"\"6:7;/,#;9/#$+\")(\"'#&'#.\" &\"/'$8\":\xEE\" )(\"'#&'#"),
        peg$decode("%;:.c &%;\x98/Y#$%;A/,#;\x98/#$+\")(\"'#&'#06*%;A/,#;\x98/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/& 8!:\xEF! )"),
        peg$decode("%;L.# &;\x99/]#$%;B/,#;\x9B/#$+\")(\"'#&'#06*%;B/,#;\x9B/#$+\")(\"'#&'#&/'$8\":\xF0\" )(\"'#&'#"),
        peg$decode("%;\x9A.\" &\"/>#;@/5$;M/,$;?/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%%;6/Y#$%;./,#;6/#$+\")(\"'#&'#06*%;./,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#.# &;H/' 8!:\xF1!! )"),
        peg$decode(";\x9C.) &;\x9D.# &;\xA0"),
        peg$decode("%3\xF2\"\"5!7\xF3/:#;</1$;\x9F/($8#:\xF4#! )(#'#(\"'#&'#"),
        peg$decode("%3\xF5\"\"5'7\xF6/:#;</1$;\x9E/($8#:\xF7#! )(#'#(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\xF8!! )"),
        peg$decode("%2\xF9\"\"6\xF97\xFA/o#%2J\"\"6J7K/M#;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+$)($'#(#'#(\"'#&'#.\" &\"/'$8\":\xFB\" )(\"'#&'#"),
        peg$decode("%;6/J#%;</,#;\xA1/#$+\")(\"'#&'#.\" &\"/)$8\":\xFC\"\"! )(\"'#&'#"),
        peg$decode(";6.) &;T.# &;H"),
        peg$decode("%;\xA3/Y#$%;B/,#;\xA4/#$+\")(\"'#&'#06*%;B/,#;\xA4/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%3\xFD\"\"5&7\xFE.G &3\xFF\"\"5'7\u0100.; &3\u0101\"\"5$7\u0102./ &3\u0103\"\"5%7\u0104.# &;6/& 8!:\u0105! )"),
        peg$decode(";\xA5.# &;\xA0"),
        peg$decode("%3\u0106\"\"5(7\u0107/M#;</D$3\u0108\"\"5(7\u0109./ &3\u010A\"\"5(7\u010B.# &;6/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;6/Y#$%;A/,#;6/#$+\")(\"'#&'#06*%;A/,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u010C!! )"),
        peg$decode("%;\xA9/& 8!:\u010D! )"),
        peg$decode("%;\xAA/k#;;/b$;\xAF/Y$$%;B/,#;\xB0/#$+\")(\"'#&'#06*%;B/,#;\xB0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode(";\xAB.# &;\xAC"),
        peg$decode("3\u010E\"\"5$7\u010F.S &3\u0110\"\"5%7\u0111.G &3\u0112\"\"5%7\u0113.; &3\u0114\"\"5%7\u0115./ &3\u0116\"\"5+7\u0117.# &;\xAD"),
        peg$decode("3\u0118\"\"5'7\u0119./ &3\u011A\"\"5)7\u011B.# &;\xAD"),
        peg$decode(";6.# &;\xAE"),
        peg$decode("%3\u011C\"\"5\"7\u011D/,#;6/#$+\")(\"'#&'#"),
        peg$decode(";\xAD.# &;6"),
        peg$decode("%;6/5#;</,$;\xB1/#$+#)(#'#(\"'#&'#"),
        peg$decode(";6.# &;H"),
        peg$decode("%;\xB3/5#;./,$;\x90/#$+#)(#'#(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u011E!! )"),
        peg$decode("%;\x9E/' 8!:\u011F!! )"),
        peg$decode("%;\xB6/^#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/($8\":\u0120\"!!)(\"'#&'#"),
        peg$decode("%%;7/e#$%2J\"\"6J7K/,#;7/#$+\")(\"'#&'#0<*%2J\"\"6J7K/,#;7/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("%;L.# &;\x99/]#$%;B/,#;\xB8/#$+\")(\"'#&'#06*%;B/,#;\xB8/#$+\")(\"'#&'#&/'$8\":\u0121\" )(\"'#&'#"),
        peg$decode(";\xB9.# &;\xA0"),
        peg$decode("%3\u0122\"\"5#7\u0123/:#;</1$;6/($8#:\u0124#! )(#'#(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u0125!! )"),
        peg$decode("%;\x9E/' 8!:\u0126!! )"),
        peg$decode("%$;\x9A0#*;\x9A&/x#;@/o$;M/f$;?/]$$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8%:\u0127% )(%'#($'#(#'#(\"'#&'#"),
        peg$decode(";\xBE"),
        peg$decode("%3\u0128\"\"5&7\u0129/k#;./b$;\xC1/Y$$%;A/,#;\xC1/#$+\")(\"'#&'#06*%;A/,#;\xC1/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#.# &;\xBF"),
        peg$decode("%;6/k#;./b$;\xC0/Y$$%;A/,#;\xC0/#$+\")(\"'#&'#06*%;A/,#;\xC0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%;6/;#;</2$;6.# &;H/#$+#)(#'#(\"'#&'#"),
        peg$decode(";\xC2.G &;\xC4.A &;\xC6.; &;\xC8.5 &;\xC9./ &;\xCA.) &;\xCB.# &;\xC0"),
        peg$decode("%3\u012A\"\"5%7\u012B/5#;</,$;\xC3/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;I/' 8!:\u012C!! )"),
        peg$decode("%3\u012D\"\"5&7\u012E/\x97#;</\x8E$;D/\x85$;\xC5/|$$%$;'/&#0#*;'&&&#/,#;\xC5/#$+\")(\"'#&'#0C*%$;'/&#0#*;'&&&#/,#;\xC5/#$+\")(\"'#&'#&/,$;E/#$+&)(&'#(%'#($'#(#'#(\"'#&'#"),
        peg$decode(";t.# &;w"),
        peg$decode("%3\u012F\"\"5%7\u0130/5#;</,$;\xC7/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;I/' 8!:\u0131!! )"),
        peg$decode("%3\u0132\"\"5&7\u0133/:#;</1$;I/($8#:\u0134#! )(#'#(\"'#&'#"),
        peg$decode("%3\u0135\"\"5%7\u0136/]#;</T$%3\u0137\"\"5$7\u0138/& 8!:\u0139! ).4 &%3\u013A\"\"5%7\u013B/& 8!:\u013C! )/#$+#)(#'#(\"'#&'#"),
        peg$decode("%3\u013D\"\"5)7\u013E/R#;</I$3\u013F\"\"5#7\u0140./ &3\u0141\"\"5(7\u0142.# &;6/($8#:\u0143#! )(#'#(\"'#&'#"),
        peg$decode("%3\u0144\"\"5#7\u0145/\x93#;</\x8A$;D/\x81$%;\xCC/e#$%2D\"\"6D7E/,#;\xCC/#$+\")(\"'#&'#0<*%2D\"\"6D7E/,#;\xCC/#$+\")(\"'#&'#&/#$+\")(\"'#&'#/,$;E/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%3\u0146\"\"5(7\u0147./ &3\u0148\"\"5$7\u0149.# &;6/' 8!:\u014A!! )"),
        peg$decode("%;6/Y#$%;A/,#;6/#$+\")(\"'#&'#06*%;A/,#;6/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%;\xCF/G#;./>$;\xCF/5$;./,$;\x90/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u014B!! )"),
        peg$decode("%;\xD1/]#$%;A/,#;\xD1/#$+\")(\"'#&'#06*%;A/,#;\xD1/#$+\")(\"'#&'#&/'$8\":\u014C\" )(\"'#&'#"),
        peg$decode("%;\x99/]#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8\":\u014D\" )(\"'#&'#"),
        peg$decode("%;L.O &;\x99.I &%;@.\" &\"/:#;t/1$;?.\" &\"/#$+#)(#'#(\"'#&'#/]#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/'$8\":\u014E\" )(\"'#&'#"),
        peg$decode("%;\xD4/]#$%;B/,#;\xD5/#$+\")(\"'#&'#06*%;B/,#;\xD5/#$+\")(\"'#&'#&/'$8\":\u014F\" )(\"'#&'#"),
        peg$decode("%;\x96/& 8!:\u0150! )"),
        peg$decode("%3\u0151\"\"5(7\u0152/:#;</1$;6/($8#:\u0153#! )(#'#(\"'#&'#.g &%3\u0154\"\"5&7\u0155/:#;</1$;6/($8#:\u0156#! )(#'#(\"'#&'#.: &%3\u0157\"\"5*7\u0158/& 8!:\u0159! ).# &;\xA0"),
        peg$decode("%%;6/k#$%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#0<*%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#&/)$8\":\u015B\"\"! )(\"'#&'#.\" &\"/' 8!:\u015C!! )"),
        peg$decode("%;\xD8/Y#$%;A/,#;\xD8/#$+\")(\"'#&'#06*%;A/,#;\xD8/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%;\x99/Y#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%$;!/&#0#*;!&&&#/' 8!:\u015D!! )"),
        peg$decode("%;\xDB/Y#$%;B/,#;\xDC/#$+\")(\"'#&'#06*%;B/,#;\xDC/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%3\u015E\"\"5&7\u015F.; &3\u0160\"\"5'7\u0161./ &3\u0162\"\"5*7\u0163.# &;6/& 8!:\u0164! )"),
        peg$decode("%3\u0165\"\"5&7\u0166/:#;</1$;\xDD/($8#:\u0167#! )(#'#(\"'#&'#.} &%3\xF5\"\"5'7\xF6/:#;</1$;\x9E/($8#:\u0168#! )(#'#(\"'#&'#.P &%3\u0169\"\"5+7\u016A/:#;</1$;\x9E/($8#:\u016B#! )(#'#(\"'#&'#.# &;\xA0"),
        peg$decode("3\u016C\"\"5+7\u016D.k &3\u016E\"\"5)7\u016F._ &3\u0170\"\"5(7\u0171.S &3\u0172\"\"5'7\u0173.G &3\u0174\"\"5&7\u0175.; &3\u0176\"\"5*7\u0177./ &3\u0178\"\"5)7\u0179.# &;6"),
        peg$decode(";1.\" &\""),
        peg$decode("%%;6/k#$%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#0<*%;A/2#;6/)$8\":\u015A\"\"$ )(\"'#&'#&/)$8\":\u015B\"\"! )(\"'#&'#.\" &\"/' 8!:\u017A!! )"),
        peg$decode("%;L.# &;\x99/]#$%;B/,#;\xE1/#$+\")(\"'#&'#06*%;B/,#;\xE1/#$+\")(\"'#&'#&/'$8\":\u017B\" )(\"'#&'#"),
        peg$decode(";\xB9.# &;\xA0"),
        peg$decode("%;\xE3/Y#$%;A/,#;\xE3/#$+\")(\"'#&'#06*%;A/,#;\xE3/#$+\")(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%;\xEA/k#;./b$;\xED/Y$$%;B/,#;\xE4/#$+\")(\"'#&'#06*%;B/,#;\xE4/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode(";\xE5.; &;\xE6.5 &;\xE7./ &;\xE8.) &;\xE9.# &;\xA0"),
        peg$decode("%3\u017C\"\"5#7\u017D/:#;</1$;\xF0/($8#:\u017E#! )(#'#(\"'#&'#"),
        peg$decode("%3\u017F\"\"5%7\u0180/:#;</1$;T/($8#:\u0181#! )(#'#(\"'#&'#"),
        peg$decode("%3\u0182\"\"5(7\u0183/F#;</=$;\\.) &;Y.# &;X/($8#:\u0184#! )(#'#(\"'#&'#"),
        peg$decode("%3\u0185\"\"5&7\u0186/:#;</1$;6/($8#:\u0187#! )(#'#(\"'#&'#"),
        peg$decode("%3\u0188\"\"5%7\u0189/A#;</8$$;!0#*;!&/($8#:\u018A#! )(#'#(\"'#&'#"),
        peg$decode("%;\xEB/G#;;/>$;6/5$;;/,$;\xEC/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%3\x92\"\"5#7\xD3.# &;6/' 8!:\u018B!! )"),
        peg$decode("%3\xB1\"\"5#7\u018C.G &3\xB3\"\"5#7\u018D.; &3\xB7\"\"5#7\u018E./ &3\xB5\"\"5$7\u018F.# &;6/' 8!:\u0190!! )"),
        peg$decode("%;\xEE/D#%;C/,#;\xEF/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
        peg$decode("%;U.) &;\\.# &;X/& 8!:\u0191! )"),
        peg$decode("%%;!.\" &\"/[#;!.\" &\"/M$;!.\" &\"/?$;!.\" &\"/1$;!.\" &\"/#$+%)(%'#($'#(#'#(\"'#&'#/' 8!:\u0192!! )"),
        peg$decode("%%;!/?#;!.\" &\"/1$;!.\" &\"/#$+#)(#'#(\"'#&'#/' 8!:\u0193!! )"),
        peg$decode(";\xBE"),
        peg$decode("%;\x9E/^#$%;B/,#;\xF3/#$+\")(\"'#&'#06*%;B/,#;\xF3/#$+\")(\"'#&'#&/($8\":\u0194\"!!)(\"'#&'#"),
        peg$decode(";\xF4.# &;\xA0"),
        peg$decode("%2\u0195\"\"6\u01957\u0196/L#;</C$2\u0197\"\"6\u01977\u0198.) &2\u0199\"\"6\u01997\u019A/($8#:\u019B#! )(#'#(\"'#&'#"),
        peg$decode("%;\x9E/^#$%;B/,#;\xA0/#$+\")(\"'#&'#06*%;B/,#;\xA0/#$+\")(\"'#&'#&/($8\":\u019C\"!!)(\"'#&'#"),
        peg$decode("%;6/5#;0/,$;\xF7/#$+#)(#'#(\"'#&'#"),
        peg$decode("$;2.) &;4.# &;.0/*;2.) &;4.# &;.&"),
        peg$decode("$;%0#*;%&"),
        peg$decode("%;\xFA/;#28\"\"6879/,$;\xFB/#$+#)(#'#(\"'#&'#"),
        peg$decode("%3\u019D\"\"5%7\u019E.) &3\u019F\"\"5$7\u01A0/' 8!:\u01A1!! )"),
        peg$decode("%;\xFC/J#%28\"\"6879/,#;^/#$+\")(\"'#&'#.\" &\"/#$+\")(\"'#&'#"),
        peg$decode("%;\\.) &;X.# &;\x82/' 8!:\u01A2!! )"),
        peg$decode(";\".S &;!.M &2F\"\"6F7G.A &2J\"\"6J7K.5 &2H\"\"6H7I.) &2N\"\"6N7O"),
        peg$decode("2L\"\"6L7M.\x95 &2B\"\"6B7C.\x89 &2<\"\"6<7=.} &2R\"\"6R7S.q &2T\"\"6T7U.e &2V\"\"6V7W.Y &2P\"\"6P7Q.M &2@\"\"6@7A.A &2D\"\"6D7E.5 &22\"\"6273.) &2>\"\"6>7?"),
        peg$decode("%;\u0100/b#28\"\"6879/S$;\xFB/J$%2\u01A3\"\"6\u01A37\u01A4/,#;\xEC/#$+\")(\"'#&'#.\" &\"/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%3\u01A5\"\"5%7\u01A6.) &3\u01A7\"\"5$7\u01A8/' 8!:\u01A1!! )"),
        peg$decode("%3\xB1\"\"5#7\xB2.6 &3\xB3\"\"5#7\xB4.* &$;+0#*;+&/' 8!:\u01A9!! )"),
        peg$decode("%;\u0104/\x87#2F\"\"6F7G/x$;\u0103/o$2F\"\"6F7G/`$;\u0103/W$2F\"\"6F7G/H$;\u0103/?$2F\"\"6F7G/0$;\u0105/'$8):\u01AA) )()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%;#/>#;#/5$;#/,$;#/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode("%;\u0103/,#;\u0103/#$+\")(\"'#&'#"),
        peg$decode("%;\u0103/5#;\u0103/,$;\u0103/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;q/T#$;m0#*;m&/D$%; /,#;\xF8/#$+\")(\"'#&'#.\" &\"/#$+#)(#'#(\"'#&'#"),
        peg$decode("%2\u01AB\"\"6\u01AB7\u01AC.) &2\u01AD\"\"6\u01AD7\u01AE/w#;0/n$;\u0108/e$$%;B/2#;\u0109.# &;\xA0/#$+\")(\"'#&'#0<*%;B/2#;\u0109.# &;\xA0/#$+\")(\"'#&'#&/#$+$)($'#(#'#(\"'#&'#"),
        peg$decode(";\x99.# &;L"),
        peg$decode("%2\u01AF\"\"6\u01AF7\u01B0/5#;</,$;\u010A/#$+#)(#'#(\"'#&'#"),
        peg$decode("%;D/S#;,/J$2:\"\"6:7;/;$;,.# &;T/,$;E/#$+%)(%'#($'#(#'#(\"'#&'#")
    ];
    let peg$currPos = 0;
    let peg$savedPos = 0;
    const peg$posDetailsCache = [{ line: 1, column: 1 }];
    let peg$maxFailPos = 0;
    let peg$maxFailExpected = [];
    let peg$silentFails = 0;
    let peg$result;
    if (options.startRule !== undefined) {
        if (!(options.startRule in peg$startRuleIndices)) {
            throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
        }
        peg$startRuleIndex = peg$startRuleIndices[options.startRule];
    }
    function text() {
        return input.substring(peg$savedPos, peg$currPos);
    }
    function location() {
        return peg$computeLocation(peg$savedPos, peg$currPos);
    }
    function peg$literalExpectation(text1, ignoreCase) {
        return { type: "literal", text: text1, ignoreCase: ignoreCase };
    }
    function peg$classExpectation(parts, inverted, ignoreCase) {
        return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }
    function peg$endExpectation() {
        return { type: "end" };
    }
    function peg$computePosDetails(pos) {
        let details = peg$posDetailsCache[pos];
        let p;
        if (details) {
            return details;
        }
        else {
            p = pos - 1;
            while (!peg$posDetailsCache[p]) {
                p--;
            }
            details = peg$posDetailsCache[p];
            details = {
                line: details.line,
                column: details.column
            };
            while (p < pos) {
                if (input.charCodeAt(p) === 10) {
                    details.line++;
                    details.column = 1;
                }
                else {
                    details.column++;
                }
                p++;
            }
            peg$posDetailsCache[pos] = details;
            return details;
        }
    }
    function peg$computeLocation(startPos, endPos) {
        const startPosDetails = peg$computePosDetails(startPos);
        const endPosDetails = peg$computePosDetails(endPos);
        return {
            source: peg$source,
            start: {
                offset: startPos,
                line: startPosDetails.line,
                column: startPosDetails.column
            },
            end: {
                offset: endPos,
                line: endPosDetails.line,
                column: endPosDetails.column
            }
        };
    }
    function peg$fail(expected1) {
        if (peg$currPos < peg$maxFailPos) {
            return;
        }
        if (peg$currPos > peg$maxFailPos) {
            peg$maxFailPos = peg$currPos;
            peg$maxFailExpected = [];
        }
        peg$maxFailExpected.push(expected1);
    }
    function peg$buildStructuredError(expected1, found, location1) {
        return new SyntaxError(SyntaxError.buildMessage(expected1, found), expected1, found, location1);
    }
    function peg$decode(s) {
        return s.split("").map((ch) => ch.charCodeAt(0) - 32);
    }
    function peg$parseRule(index) {
        const bc = peg$bytecode[index];
        let ip = 0;
        const ips = [];
        let end = bc.length;
        const ends = [];
        const stack = [];
        let params;
        while (true) {
            while (ip < end) {
                switch (bc[ip]) {
                    case 0:
                        stack.push(peg$consts[bc[ip + 1]]);
                        ip += 2;
                        break;
                    case 1:
                        stack.push(undefined);
                        ip++;
                        break;
                    case 2:
                        stack.push(null);
                        ip++;
                        break;
                    case 3:
                        stack.push(peg$FAILED);
                        ip++;
                        break;
                    case 4:
                        stack.push([]);
                        ip++;
                        break;
                    case 5:
                        stack.push(peg$currPos);
                        ip++;
                        break;
                    case 6:
                        stack.pop();
                        ip++;
                        break;
                    case 7:
                        peg$currPos = stack.pop();
                        ip++;
                        break;
                    case 8:
                        stack.length -= bc[ip + 1];
                        ip += 2;
                        break;
                    case 9:
                        stack.splice(-2, 1);
                        ip++;
                        break;
                    case 10:
                        stack[stack.length - 2].push(stack.pop());
                        ip++;
                        break;
                    case 11:
                        stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
                        ip += 2;
                        break;
                    case 12:
                        stack.push(input.substring(stack.pop(), peg$currPos));
                        ip++;
                        break;
                    case 13:
                        ends.push(end);
                        ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
                        if (stack[stack.length - 1]) {
                            end = ip + 3 + bc[ip + 1];
                            ip += 3;
                        }
                        else {
                            end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                            ip += 3 + bc[ip + 1];
                        }
                        break;
                    case 14:
                        ends.push(end);
                        ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
                        if (stack[stack.length - 1] === peg$FAILED) {
                            end = ip + 3 + bc[ip + 1];
                            ip += 3;
                        }
                        else {
                            end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                            ip += 3 + bc[ip + 1];
                        }
                        break;
                    case 15:
                        ends.push(end);
                        ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
                        if (stack[stack.length - 1] !== peg$FAILED) {
                            end = ip + 3 + bc[ip + 1];
                            ip += 3;
                        }
                        else {
                            end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                            ip += 3 + bc[ip + 1];
                        }
                        break;
                    case 16:
                        if (stack[stack.length - 1] !== peg$FAILED) {
                            ends.push(end);
                            ips.push(ip);
                            end = ip + 2 + bc[ip + 1];
                            ip += 2;
                        }
                        else {
                            ip += 2 + bc[ip + 1];
                        }
                        break;
                    case 17:
                        ends.push(end);
                        ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);
                        if (input.length > peg$currPos) {
                            end = ip + 3 + bc[ip + 1];
                            ip += 3;
                        }
                        else {
                            end = ip + 3 + bc[ip + 1] + bc[ip + 2];
                            ip += 3 + bc[ip + 1];
                        }
                        break;
                    case 18:
                        ends.push(end);
                        ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
                        if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
                            end = ip + 4 + bc[ip + 2];
                            ip += 4;
                        }
                        else {
                            end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                            ip += 4 + bc[ip + 2];
                        }
                        break;
                    case 19:
                        ends.push(end);
                        ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
                        if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
                            end = ip + 4 + bc[ip + 2];
                            ip += 4;
                        }
                        else {
                            end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                            ip += 4 + bc[ip + 2];
                        }
                        break;
                    case 20:
                        ends.push(end);
                        ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);
                        if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
                            end = ip + 4 + bc[ip + 2];
                            ip += 4;
                        }
                        else {
                            end = ip + 4 + bc[ip + 2] + bc[ip + 3];
                            ip += 4 + bc[ip + 2];
                        }
                        break;
                    case 21:
                        stack.push(input.substr(peg$currPos, bc[ip + 1]));
                        peg$currPos += bc[ip + 1];
                        ip += 2;
                        break;
                    case 22:
                        stack.push(peg$consts[bc[ip + 1]]);
                        peg$currPos += peg$consts[bc[ip + 1]].length;
                        ip += 2;
                        break;
                    case 23:
                        stack.push(peg$FAILED);
                        if (peg$silentFails === 0) {
                            peg$fail(peg$consts[bc[ip + 1]]);
                        }
                        ip += 2;
                        break;
                    case 24:
                        peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];
                        ip += 2;
                        break;
                    case 25:
                        peg$savedPos = peg$currPos;
                        ip++;
                        break;
                    case 26:
                        params = bc.slice(ip + 4, ip + 4 + bc[ip + 3])
                            .map(function (p) { return stack[stack.length - 1 - p]; });
                        stack.splice(stack.length - bc[ip + 2], bc[ip + 2], peg$consts[bc[ip + 1]].apply(null, params));
                        ip += 4 + bc[ip + 3];
                        break;
                    case 27:
                        stack.push(peg$parseRule(bc[ip + 1]));
                        ip += 2;
                        break;
                    case 28:
                        peg$silentFails++;
                        ip++;
                        break;
                    case 29:
                        peg$silentFails--;
                        ip++;
                        break;
                    default:
                        throw new Error("Invalid opcode: " + bc[ip] + ".");
                }
            }
            if (ends.length > 0) {
                end = ends.pop();
                ip = ips.pop();
            }
            else {
                break;
            }
        }
        return stack[0];
    }
    options.data = {}; // Object to which header attributes will be assigned during parsing
    function list(head, tail) {
        return [head].concat(tail);
    }
    peg$result = peg$parseRule(peg$startRuleIndex);
    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
        return peg$result;
    }
    else {
        if (peg$result !== peg$FAILED && peg$currPos < input.length) {
            peg$fail(peg$endExpectation());
        }
        throw peg$buildStructuredError(peg$maxFailExpected, peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null, peg$maxFailPos < input.length
            ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
            : peg$computeLocation(peg$maxFailPos, peg$maxFailPos));
    }
}
const parse = peg$parse;

/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable no-inner-declarations */
/**
 * Grammar.
 * @internal
 */
var Grammar;
(function (Grammar) {
    /**
     * Parse.
     * @param input -
     * @param startRule -
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function parse$1(input, startRule) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = { startRule };
        try {
            parse(input, options);
        }
        catch (e) {
            options.data = -1;
        }
        return options.data;
    }
    Grammar.parse = parse$1;
    /**
     * Parse the given string and returns a SIP.NameAddrHeader instance or undefined if
     * it is an invalid NameAddrHeader.
     * @param name_addr_header -
     */
    function nameAddrHeaderParse(nameAddrHeader) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedNameAddrHeader = Grammar.parse(nameAddrHeader, "Name_Addr_Header");
        return parsedNameAddrHeader !== -1 ? parsedNameAddrHeader : undefined;
    }
    Grammar.nameAddrHeaderParse = nameAddrHeaderParse;
    /**
     * Parse the given string and returns a SIP.URI instance or undefined if
     * it is an invalid URI.
     * @param uri -
     */
    function URIParse(uri) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parsedUri = Grammar.parse(uri, "SIP_URI");
        return parsedUri !== -1 ? parsedUri : undefined;
    }
    Grammar.URIParse = URIParse;
})(Grammar = Grammar || (Grammar = {}));

/**
 * SIP Response Reasons
 * DOC: http://www.iana.org/assignments/sip-parameters
 * @internal
 */
const REASON_PHRASE = {
    100: "Trying",
    180: "Ringing",
    181: "Call Is Being Forwarded",
    182: "Queued",
    183: "Session Progress",
    199: "Early Dialog Terminated",
    200: "OK",
    202: "Accepted",
    204: "No Notification",
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Moved Temporarily",
    305: "Use Proxy",
    380: "Alternative Service",
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    410: "Gone",
    412: "Conditional Request Failed",
    413: "Request Entity Too Large",
    414: "Request-URI Too Long",
    415: "Unsupported Media Type",
    416: "Unsupported URI Scheme",
    417: "Unknown Resource-Priority",
    420: "Bad Extension",
    421: "Extension Required",
    422: "Session Interval Too Small",
    423: "Interval Too Brief",
    428: "Use Identity Header",
    429: "Provide Referrer Identity",
    430: "Flow Failed",
    433: "Anonymity Disallowed",
    436: "Bad Identity-Info",
    437: "Unsupported Certificate",
    438: "Invalid Identity Header",
    439: "First Hop Lacks Outbound Support",
    440: "Max-Breadth Exceeded",
    469: "Bad Info Package",
    470: "Consent Needed",
    478: "Unresolvable Destination",
    480: "Temporarily Unavailable",
    481: "Call/Transaction Does Not Exist",
    482: "Loop Detected",
    483: "Too Many Hops",
    484: "Address Incomplete",
    485: "Ambiguous",
    486: "Busy Here",
    487: "Request Terminated",
    488: "Not Acceptable Here",
    489: "Bad Event",
    491: "Request Pending",
    493: "Undecipherable",
    494: "Security Agreement Required",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Server Time-out",
    505: "Version Not Supported",
    513: "Message Too Large",
    580: "Precondition Failure",
    600: "Busy Everywhere",
    603: "Decline",
    604: "Does Not Exist Anywhere",
    606: "Not Acceptable"
};
/**
 * @param size -
 * @param base -
 * @internal
 */
function createRandomToken(size, base = 32) {
    let token = "";
    for (let i = 0; i < size; i++) {
        const r = Math.floor(Math.random() * base);
        token += r.toString(base);
    }
    return token;
}
/**
 * @internal
 */
function getReasonPhrase(code) {
    return REASON_PHRASE[code] || "";
}
/**
 * @internal
 */
function newTag() {
    return createRandomToken(10);
}
/**
 * @param str -
 * @internal
 */
function headerize(str) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exceptions = {
        "Call-Id": "Call-ID",
        Cseq: "CSeq",
        "Min-Se": "Min-SE",
        Rack: "RAck",
        Rseq: "RSeq",
        "Www-Authenticate": "WWW-Authenticate"
    };
    const name = str.toLowerCase().replace(/_/g, "-").split("-");
    const parts = name.length;
    let hname = "";
    for (let part = 0; part < parts; part++) {
        if (part !== 0) {
            hname += "-";
        }
        hname += name[part].charAt(0).toUpperCase() + name[part].substring(1);
    }
    if (exceptions[hname]) {
        hname = exceptions[hname];
    }
    return hname;
}
/**
 * @param str -
 * @internal
 */
function utf8Length(str) {
    return encodeURIComponent(str).replace(/%[A-F\d]{2}/g, "U").length;
}

/**
 * Incoming message.
 * @public
 */
class IncomingMessage {
    constructor() {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.headers = {};
    }
    /**
     * Insert a header of the given name and value into the last position of the
     * header array.
     * @param name - header name
     * @param value - header value
     */
    addHeader(name, value) {
        const header = { raw: value };
        name = headerize(name);
        if (this.headers[name]) {
            this.headers[name].push(header);
        }
        else {
            this.headers[name] = [header];
        }
    }
    /**
     * Get the value of the given header name at the given position.
     * @param name - header name
     * @returns Returns the specified header, undefined if header doesn't exist.
     */
    getHeader(name) {
        const header = this.headers[headerize(name)];
        if (header) {
            if (header[0]) {
                return header[0].raw;
            }
        }
        else {
            return;
        }
    }
    /**
     * Get the header/s of the given name.
     * @param name - header name
     * @returns Array - with all the headers of the specified name.
     */
    getHeaders(name) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const header = this.headers[headerize(name)];
        const result = [];
        if (!header) {
            return [];
        }
        for (const headerPart of header) {
            result.push(headerPart.raw);
        }
        return result;
    }
    /**
     * Verify the existence of the given header.
     * @param name - header name
     * @returns true if header with given name exists, false otherwise
     */
    hasHeader(name) {
        return !!this.headers[headerize(name)];
    }
    /**
     * Parse the given header on the given index.
     * @param name - header name
     * @param idx - header index
     * @returns Parsed header object, undefined if the
     *   header is not present or in case of a parsing error.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    parseHeader(name, idx = 0) {
        name = headerize(name);
        if (!this.headers[name]) {
            // this.logger.log("header '" + name + "' not present");
            return;
        }
        else if (idx >= this.headers[name].length) {
            // this.logger.log("not so many '" + name + "' headers present");
            return;
        }
        const header = this.headers[name][idx];
        const value = header.raw;
        if (header.parsed) {
            return header.parsed;
        }
        // substitute '-' by '_' for grammar rule matching.
        const parsed = Grammar.parse(value, name.replace(/-/g, "_"));
        if (parsed === -1) {
            this.headers[name].splice(idx, 1); // delete from headers
            // this.logger.warn('error parsing "' + name + '" header field with value "' + value + '"');
            return;
        }
        else {
            header.parsed = parsed;
            return parsed;
        }
    }
    /**
     * Message Header attribute selector. Alias of parseHeader.
     * @param name - header name
     * @param idx - header index
     * @returns Parsed header object, undefined if the
     *   header is not present or in case of a parsing error.
     *
     * @example
     * message.s('via',3).port
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    s(name, idx = 0) {
        return this.parseHeader(name, idx);
    }
    /**
     * Replace the value of the given header by the value.
     * @param name - header name
     * @param value - header value
     */
    setHeader(name, value) {
        this.headers[headerize(name)] = [{ raw: value }];
    }
    toString() {
        return this.data;
    }
}

/**
 * Incoming request message.
 * @public
 */
class IncomingRequestMessage extends IncomingMessage {
    constructor() {
        super();
    }
}

/**
 * Incoming response message.
 * @public
 */
class IncomingResponseMessage extends IncomingMessage {
    constructor() {
        super();
    }
}

/**
 * Outgoing SIP request message.
 * @public
 */
class OutgoingRequestMessage {
    constructor(method, ruri, fromURI, toURI, options, extraHeaders, body) {
        this.headers = {};
        this.extraHeaders = [];
        // Initialize default options
        this.options = OutgoingRequestMessage.getDefaultOptions();
        // Options - merge a deep copy
        if (options) {
            this.options = Object.assign(Object.assign({}, this.options), options);
            if (this.options.optionTags && this.options.optionTags.length) {
                this.options.optionTags = this.options.optionTags.slice();
            }
            if (this.options.routeSet && this.options.routeSet.length) {
                this.options.routeSet = this.options.routeSet.slice();
            }
        }
        // Extra headers - deep copy
        if (extraHeaders && extraHeaders.length) {
            this.extraHeaders = extraHeaders.slice();
        }
        // Body - deep copy
        if (body) {
            // TODO: internal representation should be Body
            // this.body = { ...body };
            this.body = {
                body: body.content,
                contentType: body.contentType
            };
        }
        // Method
        this.method = method;
        // RURI
        this.ruri = ruri.clone();
        // From
        this.fromURI = fromURI.clone();
        this.fromTag = this.options.fromTag ? this.options.fromTag : newTag();
        this.from = OutgoingRequestMessage.makeNameAddrHeader(this.fromURI, this.options.fromDisplayName, this.fromTag);
        // To
        this.toURI = toURI.clone();
        this.toTag = this.options.toTag;
        this.to = OutgoingRequestMessage.makeNameAddrHeader(this.toURI, this.options.toDisplayName, this.toTag);
        // Call-ID
        this.callId = this.options.callId ? this.options.callId : this.options.callIdPrefix + createRandomToken(15);
        // CSeq
        this.cseq = this.options.cseq;
        // The relative order of header fields with different field names is not
        // significant.  However, it is RECOMMENDED that header fields which are
        // needed for proxy processing (Via, Route, Record-Route, Proxy-Require,
        // Max-Forwards, and Proxy-Authorization, for example) appear towards
        // the top of the message to facilitate rapid parsing.
        // https://tools.ietf.org/html/rfc3261#section-7.3.1
        this.setHeader("route", this.options.routeSet);
        this.setHeader("via", "");
        this.setHeader("to", this.to.toString());
        this.setHeader("from", this.from.toString());
        this.setHeader("cseq", this.cseq + " " + this.method);
        this.setHeader("call-id", this.callId);
        this.setHeader("max-forwards", "70");
    }
    /** Get a copy of the default options. */
    static getDefaultOptions() {
        return {
            callId: "",
            callIdPrefix: "",
            cseq: 1,
            toDisplayName: "",
            toTag: "",
            fromDisplayName: "",
            fromTag: "",
            forceRport: false,
            hackViaTcp: false,
            optionTags: ["outbound"],
            routeSet: [],
            userAgentString: "sip.js",
            viaHost: ""
        };
    }
    static makeNameAddrHeader(uri, displayName, tag) {
        const parameters = {};
        if (tag) {
            parameters.tag = tag;
        }
        return new NameAddrHeader(uri, displayName, parameters);
    }
    /**
     * Get the value of the given header name at the given position.
     * @param name - header name
     * @returns Returns the specified header, undefined if header doesn't exist.
     */
    getHeader(name) {
        const header = this.headers[headerize(name)];
        if (header) {
            if (header[0]) {
                return header[0];
            }
        }
        else {
            const regexp = new RegExp("^\\s*" + name + "\\s*:", "i");
            for (const exHeader of this.extraHeaders) {
                if (regexp.test(exHeader)) {
                    return exHeader.substring(exHeader.indexOf(":") + 1).trim();
                }
            }
        }
        return;
    }
    /**
     * Get the header/s of the given name.
     * @param name - header name
     * @returns Array with all the headers of the specified name.
     */
    getHeaders(name) {
        const result = [];
        const headerArray = this.headers[headerize(name)];
        if (headerArray) {
            for (const headerPart of headerArray) {
                result.push(headerPart);
            }
        }
        else {
            const regexp = new RegExp("^\\s*" + name + "\\s*:", "i");
            for (const exHeader of this.extraHeaders) {
                if (regexp.test(exHeader)) {
                    result.push(exHeader.substring(exHeader.indexOf(":") + 1).trim());
                }
            }
        }
        return result;
    }
    /**
     * Verify the existence of the given header.
     * @param name - header name
     * @returns true if header with given name exists, false otherwise
     */
    hasHeader(name) {
        if (this.headers[headerize(name)]) {
            return true;
        }
        else {
            const regexp = new RegExp("^\\s*" + name + "\\s*:", "i");
            for (const extraHeader of this.extraHeaders) {
                if (regexp.test(extraHeader)) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Replace the the given header by the given value.
     * @param name - header name
     * @param value - header value
     */
    setHeader(name, value) {
        this.headers[headerize(name)] = value instanceof Array ? value : [value];
    }
    /**
     * The Via header field indicates the transport used for the transaction
     * and identifies the location where the response is to be sent.  A Via
     * header field value is added only after the transport that will be
     * used to reach the next hop has been selected (which may involve the
     * usage of the procedures in [4]).
     *
     * When the UAC creates a request, it MUST insert a Via into that
     * request.  The protocol name and protocol version in the header field
     * MUST be SIP and 2.0, respectively.  The Via header field value MUST
     * contain a branch parameter.  This parameter is used to identify the
     * transaction created by that request.  This parameter is used by both
     * the client and the server.
     * https://tools.ietf.org/html/rfc3261#section-8.1.1.7
     * @param branchParameter - The branch parameter.
     * @param transport - The sent protocol transport.
     */
    setViaHeader(branch, transport) {
        // FIXME: Hack
        if (this.options.hackViaTcp) {
            transport = "TCP";
        }
        let via = "SIP/2.0/" + transport;
        via += " " + this.options.viaHost + ";branch=" + branch;
        if (this.options.forceRport) {
            via += ";rport";
        }
        this.setHeader("via", via);
        this.branch = branch;
    }
    toString() {
        let msg = "";
        msg += this.method + " " + this.ruri.toRaw() + " SIP/2.0\r\n";
        for (const header in this.headers) {
            if (this.headers[header]) {
                for (const headerPart of this.headers[header]) {
                    msg += header + ": " + headerPart + "\r\n";
                }
            }
        }
        for (const header of this.extraHeaders) {
            msg += header.trim() + "\r\n";
        }
        msg += "Supported: " + this.options.optionTags.join(", ") + "\r\n";
        msg += "User-Agent: " + this.options.userAgentString + "\r\n";
        if (this.body) {
            if (typeof this.body === "string") {
                msg += "Content-Length: " + utf8Length(this.body) + "\r\n\r\n";
                msg += this.body;
            }
            else {
                if (this.body.body && this.body.contentType) {
                    msg += "Content-Type: " + this.body.contentType + "\r\n";
                    msg += "Content-Length: " + utf8Length(this.body.body) + "\r\n\r\n";
                    msg += this.body.body;
                }
                else {
                    msg += "Content-Length: " + 0 + "\r\n\r\n";
                }
            }
        }
        else {
            msg += "Content-Length: " + 0 + "\r\n\r\n";
        }
        return msg;
    }
}

// If the Content-Disposition header field is missing, bodies of
// Content-Type application/sdp imply the disposition "session", while
// other content types imply "render".
// https://tools.ietf.org/html/rfc3261#section-13.2.1
function contentTypeToContentDisposition(contentType) {
    if (contentType === "application/sdp") {
        return "session";
    }
    else {
        return "render";
    }
}
/**
 * Create a Body given a legacy body type.
 * @param bodyLegacy - Body Object
 * @internal
 */
function fromBodyLegacy(bodyLegacy) {
    const content = typeof bodyLegacy === "string" ? bodyLegacy : bodyLegacy.body;
    const contentType = typeof bodyLegacy === "string" ? "application/sdp" : bodyLegacy.contentType;
    const contentDisposition = contentTypeToContentDisposition(contentType);
    const body = { contentDisposition, contentType, content };
    return body;
}
/**
 * User-Defined Type Guard for Body.
 * @param body - Body to check.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isBody(body) {
    return body &&
        typeof body.content === "string" &&
        typeof body.contentType === "string" &&
        body.contentDisposition === undefined
        ? true
        : typeof body.contentDisposition === "string";
}
/**
 * Given a message, get a normalized body.
 * The content disposition is inferred if not set.
 * @param message - The message.
 * @internal
 */
function getBody(message) {
    let contentDisposition;
    let contentType;
    let content;
    // We're in UAS role, receiving incoming request
    if (message instanceof IncomingRequestMessage) {
        if (message.body) {
            // FIXME: Parsing needs typing
            const parse = message.parseHeader("Content-Disposition");
            contentDisposition = parse ? parse.type : undefined;
            contentType = message.parseHeader("Content-Type");
            content = message.body;
        }
    }
    // We're in UAC role, receiving incoming response
    if (message instanceof IncomingResponseMessage) {
        if (message.body) {
            // FIXME: Parsing needs typing
            const parse = message.parseHeader("Content-Disposition");
            contentDisposition = parse ? parse.type : undefined;
            contentType = message.parseHeader("Content-Type");
            content = message.body;
        }
    }
    // We're in UAC role, sending outgoing request
    if (message instanceof OutgoingRequestMessage) {
        if (message.body) {
            contentDisposition = message.getHeader("Content-Disposition");
            contentType = message.getHeader("Content-Type");
            if (typeof message.body === "string") {
                // FIXME: OutgoingRequest should not allow a "string" body without a "Content-Type" header.
                if (!contentType) {
                    throw new Error("Header content type header does not equal body content type.");
                }
                content = message.body;
            }
            else {
                // FIXME: OutgoingRequest should not allow the "Content-Type" header not to match th body content type
                if (contentType && contentType !== message.body.contentType) {
                    throw new Error("Header content type header does not equal body content type.");
                }
                contentType = message.body.contentType;
                content = message.body.body;
            }
        }
    }
    // We're in UAS role, sending outgoing response
    if (isBody(message)) {
        contentDisposition = message.contentDisposition;
        contentType = message.contentType;
        content = message.content;
    }
    // No content, no body.
    if (!content) {
        return undefined;
    }
    if (contentType && !contentDisposition) {
        contentDisposition = contentTypeToContentDisposition(contentType);
    }
    if (!contentDisposition) {
        throw new Error("Content disposition undefined.");
    }
    if (!contentType) {
        throw new Error("Content type undefined.");
    }
    return {
        contentDisposition,
        contentType,
        content
    };
}

/**
 * Session state.
 * @remarks
 * https://tools.ietf.org/html/rfc3261#section-13
 * @public
 */
var SessionState$1;
(function (SessionState) {
    SessionState["Initial"] = "Initial";
    SessionState["Early"] = "Early";
    SessionState["AckWait"] = "AckWait";
    SessionState["Confirmed"] = "Confirmed";
    SessionState["Terminated"] = "Terminated";
})(SessionState$1 = SessionState$1 || (SessionState$1 = {}));
/**
 * Offer/Answer state.
 * @remarks
 * ```txt
 *         Offer                Answer             RFC    Ini Est Early
 *  -------------------------------------------------------------------
 *  1. INVITE Req.          2xx INVITE Resp.     RFC 3261  Y   Y    N
 *  2. 2xx INVITE Resp.     ACK Req.             RFC 3261  Y   Y    N
 *  3. INVITE Req.          1xx-rel INVITE Resp. RFC 3262  Y   Y    N
 *  4. 1xx-rel INVITE Resp. PRACK Req.           RFC 3262  Y   Y    N
 *  5. PRACK Req.           200 PRACK Resp.      RFC 3262  N   Y    Y
 *  6. UPDATE Req.          2xx UPDATE Resp.     RFC 3311  N   Y    Y
 *
 *       Table 1: Summary of SIP Usage of the Offer/Answer Model
 * ```
 * https://tools.ietf.org/html/rfc6337#section-2.2
 * @public
 */
var SignalingState;
(function (SignalingState) {
    SignalingState["Initial"] = "Initial";
    SignalingState["HaveLocalOffer"] = "HaveLocalOffer";
    SignalingState["HaveRemoteOffer"] = "HaveRemoteOffer";
    SignalingState["Stable"] = "Stable";
    SignalingState["Closed"] = "Closed";
})(SignalingState = SignalingState || (SignalingState = {}));

const T1 = 500;
const T2 = 4000;
const T4 = 5000;
/**
 * Timers.
 * @public
 */
const Timers = {
    T1,
    T2,
    TIMER_B: 64 * T1,
    TIMER_D: 0 * T1,
    TIMER_F: 64 * T1,
    TIMER_H: 64 * T1,
    TIMER_I: 0 * T4,
    TIMER_J: 0 * T1,
    TIMER_K: 0 * T4,
    TIMER_L: 64 * T1,
    TIMER_M: 64 * T1,
    TIMER_N: 64 * T1,
    PROVISIONAL_RESPONSE_INTERVAL: 60000 // See RFC 3261 Section 13.3.1.1
};

/**
 * Indicates that the operation could not be completed given the current transaction state.
 * @public
 */
class TransactionStateError extends Exception {
    constructor(message) {
        super(message ? message : "Transaction state error.");
    }
}

/* eslint-disable @typescript-eslint/no-namespace */
/**
 * SIP Methods
 * @internal
 */
var C;
(function (C) {
    C.ACK = "ACK";
    C.BYE = "BYE";
    C.CANCEL = "CANCEL";
    C.INFO = "INFO";
    C.INVITE = "INVITE";
    C.MESSAGE = "MESSAGE";
    C.NOTIFY = "NOTIFY";
    C.OPTIONS = "OPTIONS";
    C.REGISTER = "REGISTER";
    C.UPDATE = "UPDATE";
    C.SUBSCRIBE = "SUBSCRIBE";
    C.PUBLISH = "PUBLISH";
    C.REFER = "REFER";
    C.PRACK = "PRACK";
})(C = C || (C = {}));

/**
 * FIXME: TODO: Should be configurable/variable.
 */
const AllowedMethods = [
    C.ACK,
    C.BYE,
    C.CANCEL,
    C.INFO,
    C.INVITE,
    C.MESSAGE,
    C.NOTIFY,
    C.OPTIONS,
    C.PRACK,
    C.REFER,
    C.REGISTER,
    C.SUBSCRIBE
];

/**
 * A received message (incoming MESSAGE).
 * @public
 */
class Message {
    /** @internal */
    constructor(incomingMessageRequest) {
        this.incomingMessageRequest = incomingMessageRequest;
    }
    /** Incoming MESSAGE request message. */
    get request() {
        return this.incomingMessageRequest.message;
    }
    /** Accept the request. */
    accept(options) {
        this.incomingMessageRequest.accept(options);
        return Promise.resolve();
    }
    /** Reject the request. */
    reject(options) {
        this.incomingMessageRequest.reject(options);
        return Promise.resolve();
    }
}

/**
 * A notification of an event (incoming NOTIFY).
 * @public
 */
class Notification {
    /** @internal */
    constructor(incomingNotifyRequest) {
        this.incomingNotifyRequest = incomingNotifyRequest;
    }
    /** Incoming NOTIFY request message. */
    get request() {
        return this.incomingNotifyRequest.message;
    }
    /** Accept the request. */
    accept(options) {
        this.incomingNotifyRequest.accept(options);
        return Promise.resolve();
    }
    /** Reject the request. */
    reject(options) {
        this.incomingNotifyRequest.reject(options);
        return Promise.resolve();
    }
}

/**
 * A request to establish a {@link Session} elsewhere (incoming REFER).
 * @public
 */
class Referral {
    /** @internal */
    constructor(incomingReferRequest, session) {
        this.incomingReferRequest = incomingReferRequest;
        this.session = session;
    }
    get referTo() {
        const referTo = this.incomingReferRequest.message.parseHeader("refer-to");
        if (!(referTo instanceof NameAddrHeader)) {
            throw new Error("Failed to parse Refer-To header.");
        }
        return referTo;
    }
    get referredBy() {
        return this.incomingReferRequest.message.getHeader("referred-by");
    }
    get replaces() {
        const value = this.referTo.uri.getHeader("replaces");
        if (value instanceof Array) {
            return value[0];
        }
        return value;
    }
    /** Incoming REFER request message. */
    get request() {
        return this.incomingReferRequest.message;
    }
    /** Accept the request. */
    accept(options = { statusCode: 202 }) {
        this.incomingReferRequest.accept(options);
        return Promise.resolve();
    }
    /** Reject the request. */
    reject(options) {
        this.incomingReferRequest.reject(options);
        return Promise.resolve();
    }
    /**
     * Creates an inviter which may be used to send an out of dialog INVITE request.
     *
     * @remarks
     * This a helper method to create an Inviter which will execute the referral
     * of the `Session` which was referred. The appropriate headers are set and
     * the referred `Session` is linked to the new `Session`. Note that only a
     * single instance of the `Inviter` will be created and returned (if called
     * more than once a reference to the same `Inviter` will be returned every time).
     *
     * @param options - Options bucket.
     * @param modifiers - Session description handler modifiers.
     */
    makeInviter(options) {
        if (this.inviter) {
            return this.inviter;
        }
        const targetURI = this.referTo.uri.clone();
        targetURI.clearHeaders();
        options = options || {};
        const extraHeaders = (options.extraHeaders || []).slice();
        const replaces = this.replaces;
        if (replaces) {
            // decodeURIComponent is a holdover from 2c086eb4. Not sure that it is actually necessary
            extraHeaders.push("Replaces: " + decodeURIComponent(replaces));
        }
        const referredBy = this.referredBy;
        if (referredBy) {
            extraHeaders.push("Referred-By: " + referredBy);
        }
        options.extraHeaders = extraHeaders;
        this.inviter = this.session.userAgent._makeInviter(targetURI, options);
        this.inviter._referred = this.session;
        this.session._referral = this.inviter;
        return this.inviter;
    }
}

/**
 * {@link Session} state.
 *
 * @remarks
 * The {@link Session} behaves in a deterministic manner according to the following
 * Finite State Machine (FSM).
 * ```txt
 *                   ___________________________________________________________
 *                  |  ____________________________________________             |
 *                  | |            ____________________________    |            |
 * Session          | |           |                            v   v            v
 * Constructed -> Initial -> Establishing -> Established -> Terminating -> Terminated
 *                                |               |___________________________^   ^
 *                                |_______________________________________________|
 * ```
 * @public
 */
var SessionState;
(function (SessionState) {
    /**
     * If `Inviter`, INVITE not sent yet.
     * If `Invitation`, received INVITE (but no final response sent yet).
     */
    SessionState["Initial"] = "Initial";
    /**
     * If `Inviter`, sent INVITE and waiting for a final response.
     * If `Invitation`, received INVITE and attempting to send 200 final response (but has not sent it yet).
     */
    SessionState["Establishing"] = "Establishing";
    /**
     * If `Inviter`, sent INVITE and received 200 final response and sent ACK.
     * If `Invitation`, received INVITE and sent 200 final response.
     */
    SessionState["Established"] = "Established";
    /**
     * If `Inviter`, sent INVITE, sent CANCEL and now waiting for 487 final response to ACK (or 200 to ACK & BYE).
     * If `Invitation`, received INVITE, sent 200 final response and now waiting on ACK and upon receipt will attempt BYE
     * (as the protocol specification requires, before sending a BYE we must receive the ACK - so we are waiting).
     */
    SessionState["Terminating"] = "Terminating";
    /**
     * If `Inviter`, sent INVITE and received non-200 final response (or sent/received BYE after receiving 200).
     * If `Invitation`, received INVITE and sent non-200 final response (or sent/received BYE after sending 200).
     */
    SessionState["Terminated"] = "Terminated";
})(SessionState = SessionState || (SessionState = {}));

/**
 * A session provides real time communication between one or more participants.
 *
 * @remarks
 * The transport behaves in a deterministic manner according to the
 * the state defined in {@link SessionState}.
 * @public
 */
class Session {
    /**
     * Constructor.
     * @param userAgent - User agent. See {@link UserAgent} for details.
     * @internal
     */
    constructor(userAgent, options = {}) {
        /** True if there is an outgoing re-INVITE request outstanding. */
        this.pendingReinvite = false;
        /** True if there is an incoming re-INVITE ACK request outstanding. */
        this.pendingReinviteAck = false;
        /** Session state. */
        this._state = SessionState.Initial;
        this.delegate = options.delegate;
        this._stateEventEmitter = new EmitterImpl();
        this._userAgent = userAgent;
    }
    /**
     * Destructor.
     */
    dispose() {
        this.logger.log(`Session ${this.id} in state ${this._state} is being disposed`);
        // Remove from the user agent's session collection
        delete this.userAgent._sessions[this.id];
        // Dispose of dialog media
        if (this._sessionDescriptionHandler) {
            this._sessionDescriptionHandler.close();
            // TODO: The SDH needs to remain defined as it will be called after it is closed in cases
            // where an answer/offer arrives while the session is being torn down. There are a variety
            // of circumstances where this can happen - sending a BYE during a re-INVITE for example.
            // The code is currently written such that it lazily makes a new SDH when it needs one
            // and one is not yet defined. Thus if we undefined it here, it will currently make a
            // new one which is out of sync and then never gets cleaned up.
            //
            // The downside of leaving it defined are that calls this closed SDH will continue to be
            // made (think setDescription) and those should/will fail. These failures are handled, but
            // it would be nice to have it all coded up in a way where having an undefined SDH where
            // one is expected throws an error.
            //
            // this._sessionDescriptionHandler = undefined;
        }
        switch (this.state) {
            case SessionState.Initial:
                break; // the Inviter/Invitation sub class dispose method handles this case
            case SessionState.Establishing:
                break; // the Inviter/Invitation sub class dispose method handles this case
            case SessionState.Established:
                return new Promise((resolve) => {
                    this._bye({
                        // wait for the response to the BYE before resolving
                        onAccept: () => resolve(),
                        onRedirect: () => resolve(),
                        onReject: () => resolve()
                    });
                });
            case SessionState.Terminating:
                break; // nothing to be done
            case SessionState.Terminated:
                break; // nothing to be done
            default:
                throw new Error("Unknown state.");
        }
        return Promise.resolve();
    }
    /**
     * The asserted identity of the remote user.
     */
    get assertedIdentity() {
        return this._assertedIdentity;
    }
    /**
     * The confirmed session dialog.
     */
    get dialog() {
        return this._dialog;
    }
    /**
     * A unique identifier for this session.
     */
    get id() {
        return this._id;
    }
    /**
     * The session being replace by this one.
     */
    get replacee() {
        return this._replacee;
    }
    /**
     * Session description handler.
     * @remarks
     * If `this` is an instance of `Invitation`,
     * `sessionDescriptionHandler` will be defined when the session state changes to "established".
     * If `this` is an instance of `Inviter` and an offer was sent in the INVITE,
     * `sessionDescriptionHandler` will be defined when the session state changes to "establishing".
     * If `this` is an instance of `Inviter` and an offer was not sent in the INVITE,
     * `sessionDescriptionHandler` will be defined when the session state changes to "established".
     * Otherwise `undefined`.
     */
    get sessionDescriptionHandler() {
        return this._sessionDescriptionHandler;
    }
    /**
     * Session description handler factory.
     */
    get sessionDescriptionHandlerFactory() {
        return this.userAgent.configuration.sessionDescriptionHandlerFactory;
    }
    /**
     * SDH modifiers for the initial INVITE transaction.
     * @remarks
     * Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
     * May be set directly at anytime.
     * May optionally be set via constructor option.
     * May optionally be set via options passed to Inviter.invite() or Invitation.accept().
     */
    get sessionDescriptionHandlerModifiers() {
        return this._sessionDescriptionHandlerModifiers || [];
    }
    set sessionDescriptionHandlerModifiers(modifiers) {
        this._sessionDescriptionHandlerModifiers = modifiers.slice();
    }
    /**
     * SDH options for the initial INVITE transaction.
     * @remarks
     * Used in all cases when handling the initial INVITE transaction as either UAC or UAS.
     * May be set directly at anytime.
     * May optionally be set via constructor option.
     * May optionally be set via options passed to Inviter.invite() or Invitation.accept().
     */
    get sessionDescriptionHandlerOptions() {
        return this._sessionDescriptionHandlerOptions || {};
    }
    set sessionDescriptionHandlerOptions(options) {
        this._sessionDescriptionHandlerOptions = Object.assign({}, options);
    }
    /**
     * SDH modifiers for re-INVITE transactions.
     * @remarks
     * Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
     * May be set directly at anytime.
     * May optionally be set via constructor option.
     * May optionally be set via options passed to Session.invite().
     */
    get sessionDescriptionHandlerModifiersReInvite() {
        return this._sessionDescriptionHandlerModifiersReInvite || [];
    }
    set sessionDescriptionHandlerModifiersReInvite(modifiers) {
        this._sessionDescriptionHandlerModifiersReInvite = modifiers.slice();
    }
    /**
     * SDH options for re-INVITE transactions.
     * @remarks
     * Used in all cases when handling a re-INVITE transaction as either UAC or UAS.
     * May be set directly at anytime.
     * May optionally be set via constructor option.
     * May optionally be set via options passed to Session.invite().
     */
    get sessionDescriptionHandlerOptionsReInvite() {
        return this._sessionDescriptionHandlerOptionsReInvite || {};
    }
    set sessionDescriptionHandlerOptionsReInvite(options) {
        this._sessionDescriptionHandlerOptionsReInvite = Object.assign({}, options);
    }
    /**
     * Session state.
     */
    get state() {
        return this._state;
    }
    /**
     * Session state change emitter.
     */
    get stateChange() {
        return this._stateEventEmitter;
    }
    /**
     * The user agent.
     */
    get userAgent() {
        return this._userAgent;
    }
    /**
     * End the {@link Session}. Sends a BYE.
     * @param options - Options bucket. See {@link SessionByeOptions} for details.
     */
    bye(options = {}) {
        let message = "Session.bye() may only be called if established session.";
        switch (this.state) {
            case SessionState.Initial:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (typeof this.cancel === "function") {
                    message += " However Inviter.invite() has not yet been called.";
                    message += " Perhaps you should have called Inviter.cancel()?";
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }
                else if (typeof this.reject === "function") {
                    message += " However Invitation.accept() has not yet been called.";
                    message += " Perhaps you should have called Invitation.reject()?";
                }
                break;
            case SessionState.Establishing:
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (typeof this.cancel === "function") {
                    message += " However a dialog does not yet exist.";
                    message += " Perhaps you should have called Inviter.cancel()?";
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }
                else if (typeof this.reject === "function") {
                    message += " However Invitation.accept() has not yet been called (or not yet resolved).";
                    message += " Perhaps you should have called Invitation.reject()?";
                }
                break;
            case SessionState.Established: {
                const requestDelegate = options.requestDelegate;
                const requestOptions = this.copyRequestOptions(options.requestOptions);
                return this._bye(requestDelegate, requestOptions);
            }
            case SessionState.Terminating:
                message += " However this session is already terminating.";
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                if (typeof this.cancel === "function") {
                    message += " Perhaps you have already called Inviter.cancel()?";
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                }
                else if (typeof this.reject === "function") {
                    message += " Perhaps you have already called Session.bye()?";
                }
                break;
            case SessionState.Terminated:
                message += " However this session is already terminated.";
                break;
            default:
                throw new Error("Unknown state");
        }
        this.logger.error(message);
        return Promise.reject(new Error(`Invalid session state ${this.state}`));
    }
    /**
     * Share {@link Info} with peer. Sends an INFO.
     * @param options - Options bucket. See {@link SessionInfoOptions} for details.
     */
    info(options = {}) {
        // guard session state
        if (this.state !== SessionState.Established) {
            const message = "Session.info() may only be called if established session.";
            this.logger.error(message);
            return Promise.reject(new Error(`Invalid session state ${this.state}`));
        }
        const requestDelegate = options.requestDelegate;
        const requestOptions = this.copyRequestOptions(options.requestOptions);
        return this._info(requestDelegate, requestOptions);
    }
    /**
     * Renegotiate the session. Sends a re-INVITE.
     * @param options - Options bucket. See {@link SessionInviteOptions} for details.
     */
    invite(options = {}) {
        this.logger.log("Session.invite");
        if (this.state !== SessionState.Established) {
            return Promise.reject(new Error(`Invalid session state ${this.state}`));
        }
        if (this.pendingReinvite) {
            return Promise.reject(new RequestPendingError("Reinvite in progress. Please wait until complete, then try again."));
        }
        this.pendingReinvite = true;
        // Modifiers and options for initial INVITE transaction
        if (options.sessionDescriptionHandlerModifiers) {
            this.sessionDescriptionHandlerModifiersReInvite = options.sessionDescriptionHandlerModifiers;
        }
        if (options.sessionDescriptionHandlerOptions) {
            this.sessionDescriptionHandlerOptionsReInvite = options.sessionDescriptionHandlerOptions;
        }
        const delegate = {
            onAccept: (response) => {
                // A re-INVITE transaction has an offer/answer [RFC3264] exchange
                // associated with it.  The UAC (User Agent Client) generating a given
                // re-INVITE can act as the offerer or as the answerer.  A UAC willing
                // to act as the offerer includes an offer in the re-INVITE.  The UAS
                // (User Agent Server) then provides an answer in a response to the
                // re-INVITE.  A UAC willing to act as answerer does not include an
                // offer in the re-INVITE.  The UAS then provides an offer in a response
                // to the re-INVITE becoming, thus, the offerer.
                // https://tools.ietf.org/html/rfc6141#section-1
                const body = getBody(response.message);
                if (!body) {
                    // No way to recover, so terminate session and mark as failed.
                    this.logger.error("Received 2xx response to re-INVITE without a session description");
                    this.ackAndBye(response, 400, "Missing session description");
                    this.stateTransition(SessionState.Terminated);
                    this.pendingReinvite = false;
                    return;
                }
                if (options.withoutSdp) {
                    // INVITE without SDP - set remote offer and send an answer in the ACK
                    const answerOptions = {
                        sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
                        sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
                    };
                    this.setOfferAndGetAnswer(body, answerOptions)
                        .then((answerBody) => {
                        response.ack({ body: answerBody });
                    })
                        .catch((error) => {
                        // No way to recover, so terminate session and mark as failed.
                        this.logger.error("Failed to handle offer in 2xx response to re-INVITE");
                        this.logger.error(error.message);
                        if (this.state === SessionState.Terminated) {
                            // A BYE should not be sent if already terminated.
                            // For example, a BYE may be sent/received while re-INVITE is outstanding.
                            response.ack();
                        }
                        else {
                            this.ackAndBye(response, 488, "Bad Media Description");
                            this.stateTransition(SessionState.Terminated);
                        }
                    })
                        .then(() => {
                        this.pendingReinvite = false;
                        if (options.requestDelegate && options.requestDelegate.onAccept) {
                            options.requestDelegate.onAccept(response);
                        }
                    });
                }
                else {
                    // INVITE with SDP - set remote answer and send an ACK
                    const answerOptions = {
                        sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
                        sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
                    };
                    this.setAnswer(body, answerOptions)
                        .then(() => {
                        response.ack();
                    })
                        .catch((error) => {
                        // No way to recover, so terminate session and mark as failed.
                        this.logger.error("Failed to handle answer in 2xx response to re-INVITE");
                        this.logger.error(error.message);
                        // A BYE should only be sent if session is not already terminated.
                        // For example, a BYE may be sent/received while re-INVITE is outstanding.
                        // The ACK needs to be sent regardless as it was not handled by the transaction.
                        if (this.state !== SessionState.Terminated) {
                            this.ackAndBye(response, 488, "Bad Media Description");
                            this.stateTransition(SessionState.Terminated);
                        }
                        else {
                            response.ack();
                        }
                    })
                        .then(() => {
                        this.pendingReinvite = false;
                        if (options.requestDelegate && options.requestDelegate.onAccept) {
                            options.requestDelegate.onAccept(response);
                        }
                    });
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onProgress: (response) => {
                return;
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onRedirect: (response) => {
                return;
            },
            onReject: (response) => {
                this.logger.warn("Received a non-2xx response to re-INVITE");
                this.pendingReinvite = false;
                if (options.withoutSdp) {
                    if (options.requestDelegate && options.requestDelegate.onReject) {
                        options.requestDelegate.onReject(response);
                    }
                }
                else {
                    this.rollbackOffer()
                        .catch((error) => {
                        // No way to recover, so terminate session and mark as failed.
                        this.logger.error("Failed to rollback offer on non-2xx response to re-INVITE");
                        this.logger.error(error.message);
                        // A BYE should only be sent if session is not already terminated.
                        // For example, a BYE may be sent/received while re-INVITE is outstanding.
                        // Note that the ACK was already sent by the transaction, so just need to send BYE.
                        if (this.state !== SessionState.Terminated) {
                            if (!this.dialog) {
                                throw new Error("Dialog undefined.");
                            }
                            const extraHeaders = [];
                            extraHeaders.push("Reason: " + this.getReasonHeaderValue(500, "Internal Server Error"));
                            this.dialog.bye(undefined, { extraHeaders });
                            this.stateTransition(SessionState.Terminated);
                        }
                    })
                        .then(() => {
                        if (options.requestDelegate && options.requestDelegate.onReject) {
                            options.requestDelegate.onReject(response);
                        }
                    });
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onTrying: (response) => {
                return;
            }
        };
        const requestOptions = options.requestOptions || {};
        requestOptions.extraHeaders = (requestOptions.extraHeaders || []).slice();
        requestOptions.extraHeaders.push("Allow: " + AllowedMethods.toString());
        requestOptions.extraHeaders.push("Contact: " + this._contact);
        // Just send an INVITE with no sdp...
        if (options.withoutSdp) {
            if (!this.dialog) {
                this.pendingReinvite = false;
                throw new Error("Dialog undefined.");
            }
            return Promise.resolve(this.dialog.invite(delegate, requestOptions));
        }
        // Get an offer and send it in an INVITE
        const offerOptions = {
            sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
            sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
        };
        return this.getOffer(offerOptions)
            .then((offerBody) => {
            if (!this.dialog) {
                this.pendingReinvite = false;
                throw new Error("Dialog undefined.");
            }
            requestOptions.body = offerBody;
            return this.dialog.invite(delegate, requestOptions);
        })
            .catch((error) => {
            this.logger.error(error.message);
            this.logger.error("Failed to send re-INVITE");
            this.pendingReinvite = false;
            throw error;
        });
    }
    /**
     * Deliver a {@link Message}. Sends a MESSAGE.
     * @param options - Options bucket. See {@link SessionMessageOptions} for details.
     */
    message(options = {}) {
        // guard session state
        if (this.state !== SessionState.Established) {
            const message = "Session.message() may only be called if established session.";
            this.logger.error(message);
            return Promise.reject(new Error(`Invalid session state ${this.state}`));
        }
        const requestDelegate = options.requestDelegate;
        const requestOptions = this.copyRequestOptions(options.requestOptions);
        return this._message(requestDelegate, requestOptions);
    }
    /**
     * Proffer a {@link Referral}. Send a REFER.
     * @param referTo - The referral target. If a `Session`, a REFER w/Replaces is sent.
     * @param options - Options bucket. See {@link SessionReferOptions} for details.
     */
    refer(referTo, options = {}) {
        // guard session state
        if (this.state !== SessionState.Established) {
            const message = "Session.refer() may only be called if established session.";
            this.logger.error(message);
            return Promise.reject(new Error(`Invalid session state ${this.state}`));
        }
        // REFER with Replaces (Attended Transfer) only supported with established sessions.
        if (referTo instanceof Session && !referTo.dialog) {
            const message = "Session.refer() may only be called with session which is established. " +
                "You are perhaps attempting to attended transfer to a target for which " +
                "there is not dialog yet established. Perhaps you are attempting a " +
                "'semi-attended' tansfer? Regardless, this is not supported. The recommended " +
                "approached is to check to see if the target Session is in the Established " +
                "state before calling refer(); if the state is not Established you may " +
                "proceed by falling back using a URI as the target (blind transfer).";
            this.logger.error(message);
            return Promise.reject(new Error(`Invalid session state ${this.state}`));
        }
        const requestDelegate = options.requestDelegate;
        const requestOptions = this.copyRequestOptions(options.requestOptions);
        requestOptions.extraHeaders = requestOptions.extraHeaders
            ? requestOptions.extraHeaders.concat(this.referExtraHeaders(this.referToString(referTo)))
            : this.referExtraHeaders(this.referToString(referTo));
        return this._refer(options.onNotify, requestDelegate, requestOptions);
    }
    /**
     * Send BYE.
     * @param delegate - Request delegate.
     * @param options - Request options bucket.
     * @internal
     */
    _bye(delegate, options) {
        // Using core session dialog
        if (!this.dialog) {
            return Promise.reject(new Error("Session dialog undefined."));
        }
        const dialog = this.dialog;
        // The caller's UA MAY send a BYE for either confirmed or early dialogs,
        // and the callee's UA MAY send a BYE on confirmed dialogs, but MUST NOT
        // send a BYE on early dialogs. However, the callee's UA MUST NOT send a
        // BYE on a confirmed dialog until it has received an ACK for its 2xx
        // response or until the server transaction times out.
        // https://tools.ietf.org/html/rfc3261#section-15
        switch (dialog.sessionState) {
            case SessionState$1.Initial:
                throw new Error(`Invalid dialog state ${dialog.sessionState}`);
            case SessionState$1.Early: // Implementation choice - not sending BYE for early dialogs.
                throw new Error(`Invalid dialog state ${dialog.sessionState}`);
            case SessionState$1.AckWait: {
                // This state only occurs if we are the callee.
                this.stateTransition(SessionState.Terminating); // We're terminating
                return new Promise((resolve) => {
                    dialog.delegate = {
                        // When ACK shows up, say BYE.
                        onAck: () => {
                            const request = dialog.bye(delegate, options);
                            this.stateTransition(SessionState.Terminated);
                            resolve(request);
                            return Promise.resolve();
                        },
                        // Or the server transaction times out before the ACK arrives.
                        onAckTimeout: () => {
                            const request = dialog.bye(delegate, options);
                            this.stateTransition(SessionState.Terminated);
                            resolve(request);
                        }
                    };
                });
            }
            case SessionState$1.Confirmed: {
                const request = dialog.bye(delegate, options);
                this.stateTransition(SessionState.Terminated);
                return Promise.resolve(request);
            }
            case SessionState$1.Terminated:
                throw new Error(`Invalid dialog state ${dialog.sessionState}`);
            default:
                throw new Error("Unrecognized state.");
        }
    }
    /**
     * Send INFO.
     * @param delegate - Request delegate.
     * @param options - Request options bucket.
     * @internal
     */
    _info(delegate, options) {
        // Using core session dialog
        if (!this.dialog) {
            return Promise.reject(new Error("Session dialog undefined."));
        }
        return Promise.resolve(this.dialog.info(delegate, options));
    }
    /**
     * Send MESSAGE.
     * @param delegate - Request delegate.
     * @param options - Request options bucket.
     * @internal
     */
    _message(delegate, options) {
        // Using core session dialog
        if (!this.dialog) {
            return Promise.reject(new Error("Session dialog undefined."));
        }
        return Promise.resolve(this.dialog.message(delegate, options));
    }
    /**
     * Send REFER.
     * @param onNotify - Notification callback.
     * @param delegate - Request delegate.
     * @param options - Request options bucket.
     * @internal
     */
    _refer(onNotify, delegate, options) {
        // Using core session dialog
        if (!this.dialog) {
            return Promise.reject(new Error("Session dialog undefined."));
        }
        // If set, deliver any in-dialog NOTIFY requests here...
        this.onNotify = onNotify;
        return Promise.resolve(this.dialog.refer(delegate, options));
    }
    /**
     * Send ACK and then BYE. There are unrecoverable errors which can occur
     * while handling dialog forming and in-dialog INVITE responses and when
     * they occur we ACK the response and send a BYE.
     * Note that the BYE is sent in the dialog associated with the response
     * which is not necessarily `this.dialog`. And, accordingly, the
     * session state is not transitioned to terminated and session is not closed.
     * @param inviteResponse - The response causing the error.
     * @param statusCode - Status code for he reason phrase.
     * @param reasonPhrase - Reason phrase for the BYE.
     * @internal
     */
    ackAndBye(response, statusCode, reasonPhrase) {
        response.ack();
        const extraHeaders = [];
        if (statusCode) {
            extraHeaders.push("Reason: " + this.getReasonHeaderValue(statusCode, reasonPhrase));
        }
        // Using the dialog session associate with the response (which might not be this.dialog)
        response.session.bye(undefined, { extraHeaders });
    }
    /**
     * Handle in dialog ACK request.
     * @internal
     */
    onAckRequest(request) {
        this.logger.log("Session.onAckRequest");
        if (this.state !== SessionState.Established && this.state !== SessionState.Terminating) {
            this.logger.error(`ACK received while in state ${this.state}, dropping request`);
            return Promise.resolve();
        }
        const dialog = this.dialog;
        if (!dialog) {
            throw new Error("Dialog undefined.");
        }
        // if received answer in ACK.
        const answerOptions = {
            sessionDescriptionHandlerOptions: this.pendingReinviteAck
                ? this.sessionDescriptionHandlerOptionsReInvite
                : this.sessionDescriptionHandlerOptions,
            sessionDescriptionHandlerModifiers: this.pendingReinviteAck
                ? this._sessionDescriptionHandlerModifiersReInvite
                : this._sessionDescriptionHandlerModifiers
        };
        if (this.delegate && this.delegate.onAck) {
            const ack = new Ack(request);
            this.delegate.onAck(ack);
        }
        // reset pending ACK flag
        this.pendingReinviteAck = false;
        switch (dialog.signalingState) {
            case SignalingState.Initial: {
                // State should never be reached as first reliable response must have answer/offer.
                // So we must have never has sent an offer.
                this.logger.error(`Invalid signaling state ${dialog.signalingState}.`);
                const extraHeaders = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
                dialog.bye(undefined, { extraHeaders });
                this.stateTransition(SessionState.Terminated);
                return Promise.resolve();
            }
            case SignalingState.Stable: {
                // State we should be in.
                // Either the ACK has the answer that got us here, or we were in this state prior to the ACK.
                const body = getBody(request.message);
                // If the ACK doesn't have an answer, nothing to be done.
                if (!body) {
                    return Promise.resolve();
                }
                if (body.contentDisposition === "render") {
                    this._renderbody = body.content;
                    this._rendertype = body.contentType;
                    return Promise.resolve();
                }
                if (body.contentDisposition !== "session") {
                    return Promise.resolve();
                }
                return this.setAnswer(body, answerOptions).catch((error) => {
                    this.logger.error(error.message);
                    const extraHeaders = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
                    dialog.bye(undefined, { extraHeaders });
                    this.stateTransition(SessionState.Terminated);
                });
            }
            case SignalingState.HaveLocalOffer: {
                // State should never be reached as local offer would be answered by this ACK.
                // So we must have received an ACK without an answer.
                this.logger.error(`Invalid signaling state ${dialog.signalingState}.`);
                const extraHeaders = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
                dialog.bye(undefined, { extraHeaders });
                this.stateTransition(SessionState.Terminated);
                return Promise.resolve();
            }
            case SignalingState.HaveRemoteOffer: {
                // State should never be reached as remote offer would be answered in first reliable response.
                // So we must have never has sent an answer.
                this.logger.error(`Invalid signaling state ${dialog.signalingState}.`);
                const extraHeaders = ["Reason: " + this.getReasonHeaderValue(488, "Bad Media Description")];
                dialog.bye(undefined, { extraHeaders });
                this.stateTransition(SessionState.Terminated);
                return Promise.resolve();
            }
            case SignalingState.Closed:
                throw new Error(`Invalid signaling state ${dialog.signalingState}.`);
            default:
                throw new Error(`Invalid signaling state ${dialog.signalingState}.`);
        }
    }
    /**
     * Handle in dialog BYE request.
     * @internal
     */
    onByeRequest(request) {
        this.logger.log("Session.onByeRequest");
        if (this.state !== SessionState.Established) {
            this.logger.error(`BYE received while in state ${this.state}, dropping request`);
            return;
        }
        if (this.delegate && this.delegate.onBye) {
            const bye = new Bye(request);
            this.delegate.onBye(bye);
        }
        else {
            request.accept();
        }
        this.stateTransition(SessionState.Terminated);
    }
    /**
     * Handle in dialog INFO request.
     * @internal
     */
    onInfoRequest(request) {
        this.logger.log("Session.onInfoRequest");
        if (this.state !== SessionState.Established) {
            this.logger.error(`INFO received while in state ${this.state}, dropping request`);
            return;
        }
        if (this.delegate && this.delegate.onInfo) {
            const info = new Info(request);
            this.delegate.onInfo(info);
        }
        else {
            // FIXME: TODO: We should reject request...
            //
            // If a UA receives an INFO request associated with an Info Package that
            // the UA has not indicated willingness to receive, the UA MUST send a
            // 469 (Bad Info Package) response (see Section 11.6), which contains a
            // Recv-Info header field with Info Packages for which the UA is willing
            // to receive INFO requests.
            // https://tools.ietf.org/html/rfc6086#section-4.2.2
            request.accept();
        }
    }
    /**
     * Handle in dialog INVITE request.
     * @internal
     */
    onInviteRequest(request) {
        this.logger.log("Session.onInviteRequest");
        if (this.state !== SessionState.Established) {
            this.logger.error(`INVITE received while in state ${this.state}, dropping request`);
            return;
        }
        // set pending ACK flag
        this.pendingReinviteAck = true;
        // TODO: would be nice to have core track and set the Contact header,
        // but currently the session which is setting it is holding onto it.
        const extraHeaders = ["Contact: " + this._contact];
        // Handle P-Asserted-Identity
        if (request.message.hasHeader("P-Asserted-Identity")) {
            const header = request.message.getHeader("P-Asserted-Identity");
            if (!header) {
                throw new Error("Header undefined.");
            }
            this._assertedIdentity = Grammar.nameAddrHeaderParse(header);
        }
        const options = {
            sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptionsReInvite,
            sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiersReInvite
        };
        this.generateResponseOfferAnswerInDialog(options)
            .then((body) => {
            const outgoingResponse = request.accept({ statusCode: 200, extraHeaders, body });
            if (this.delegate && this.delegate.onInvite) {
                this.delegate.onInvite(request.message, outgoingResponse.message, 200);
            }
        })
            .catch((error) => {
            this.logger.error(error.message);
            this.logger.error("Failed to handle to re-INVITE request");
            if (!this.dialog) {
                throw new Error("Dialog undefined.");
            }
            this.logger.error(this.dialog.signalingState);
            // If we don't have a local/remote offer...
            if (this.dialog.signalingState === SignalingState.Stable) {
                const outgoingResponse = request.reject({ statusCode: 488 }); // Not Acceptable Here
                if (this.delegate && this.delegate.onInvite) {
                    this.delegate.onInvite(request.message, outgoingResponse.message, 488);
                }
                return;
            }
            // Otherwise rollback
            this.rollbackOffer()
                .then(() => {
                const outgoingResponse = request.reject({ statusCode: 488 }); // Not Acceptable Here
                if (this.delegate && this.delegate.onInvite) {
                    this.delegate.onInvite(request.message, outgoingResponse.message, 488);
                }
            })
                .catch((errorRollback) => {
                // No way to recover, so terminate session and mark as failed.
                this.logger.error(errorRollback.message);
                this.logger.error("Failed to rollback offer on re-INVITE request");
                const outgoingResponse = request.reject({ statusCode: 488 }); // Not Acceptable Here
                // A BYE should only be sent if session is not already terminated.
                // For example, a BYE may be sent/received while re-INVITE is outstanding.
                // Note that the ACK was already sent by the transaction, so just need to send BYE.
                if (this.state !== SessionState.Terminated) {
                    if (!this.dialog) {
                        throw new Error("Dialog undefined.");
                    }
                    const extraHeadersBye = [];
                    extraHeadersBye.push("Reason: " + this.getReasonHeaderValue(500, "Internal Server Error"));
                    this.dialog.bye(undefined, { extraHeaders: extraHeadersBye });
                    this.stateTransition(SessionState.Terminated);
                }
                if (this.delegate && this.delegate.onInvite) {
                    this.delegate.onInvite(request.message, outgoingResponse.message, 488);
                }
            });
        });
    }
    /**
     * Handle in dialog MESSAGE request.
     * @internal
     */
    onMessageRequest(request) {
        this.logger.log("Session.onMessageRequest");
        if (this.state !== SessionState.Established) {
            this.logger.error(`MESSAGE received while in state ${this.state}, dropping request`);
            return;
        }
        if (this.delegate && this.delegate.onMessage) {
            const message = new Message(request);
            this.delegate.onMessage(message);
        }
        else {
            request.accept();
        }
    }
    /**
     * Handle in dialog NOTIFY request.
     * @internal
     */
    onNotifyRequest(request) {
        this.logger.log("Session.onNotifyRequest");
        if (this.state !== SessionState.Established) {
            this.logger.error(`NOTIFY received while in state ${this.state}, dropping request`);
            return;
        }
        // If this a NOTIFY associated with the progress of a REFER,
        // look to delegate handling to the associated callback.
        if (this.onNotify) {
            const notification = new Notification(request);
            this.onNotify(notification);
            return;
        }
        // Otherwise accept the NOTIFY.
        if (this.delegate && this.delegate.onNotify) {
            const notification = new Notification(request);
            this.delegate.onNotify(notification);
        }
        else {
            request.accept();
        }
    }
    /**
     * Handle in dialog PRACK request.
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onPrackRequest(request) {
        this.logger.log("Session.onPrackRequest");
        if (this.state !== SessionState.Established) {
            this.logger.error(`PRACK received while in state ${this.state}, dropping request`);
            return;
        }
        throw new Error("Unimplemented.");
    }
    /**
     * Handle in dialog REFER request.
     * @internal
     */
    onReferRequest(request) {
        this.logger.log("Session.onReferRequest");
        if (this.state !== SessionState.Established) {
            this.logger.error(`REFER received while in state ${this.state}, dropping request`);
            return;
        }
        // REFER is a SIP request and is constructed as defined in [1].  A REFER
        // request MUST contain exactly one Refer-To header field value.
        // https://tools.ietf.org/html/rfc3515#section-2.4.1
        if (!request.message.hasHeader("refer-to")) {
            this.logger.warn("Invalid REFER packet. A refer-to header is required. Rejecting.");
            request.reject();
            return;
        }
        const referral = new Referral(request, this);
        if (this.delegate && this.delegate.onRefer) {
            this.delegate.onRefer(referral);
        }
        else {
            this.logger.log("No delegate available to handle REFER, automatically accepting and following.");
            referral
                .accept()
                .then(() => referral.makeInviter(this._referralInviterOptions).invite())
                .catch((error) => {
                // FIXME: logging and eating error...
                this.logger.error(error.message);
            });
        }
    }
    /**
     * Generate an offer or answer for a response to an INVITE request.
     * If a remote offer was provided in the request, set the remote
     * description and get a local answer. If a remote offer was not
     * provided, generates a local offer.
     * @internal
     */
    generateResponseOfferAnswer(request, options) {
        if (this.dialog) {
            return this.generateResponseOfferAnswerInDialog(options);
        }
        const body = getBody(request.message);
        if (!body || body.contentDisposition !== "session") {
            return this.getOffer(options);
        }
        else {
            return this.setOfferAndGetAnswer(body, options);
        }
    }
    /**
     * Generate an offer or answer for a response to an INVITE request
     * when a dialog (early or otherwise) has already been established.
     * This method may NOT be called if a dialog has yet to be established.
     * @internal
     */
    generateResponseOfferAnswerInDialog(options) {
        if (!this.dialog) {
            throw new Error("Dialog undefined.");
        }
        switch (this.dialog.signalingState) {
            case SignalingState.Initial:
                return this.getOffer(options);
            case SignalingState.HaveLocalOffer:
                // o  Once the UAS has sent or received an answer to the initial
                // offer, it MUST NOT generate subsequent offers in any responses
                // to the initial INVITE.  This means that a UAS based on this
                // specification alone can never generate subsequent offers until
                // completion of the initial transaction.
                // https://tools.ietf.org/html/rfc3261#section-13.2.1
                return Promise.resolve(undefined);
            case SignalingState.HaveRemoteOffer:
                if (!this.dialog.offer) {
                    throw new Error(`Session offer undefined in signaling state ${this.dialog.signalingState}.`);
                }
                return this.setOfferAndGetAnswer(this.dialog.offer, options);
            case SignalingState.Stable:
                // o  Once the UAS has sent or received an answer to the initial
                // offer, it MUST NOT generate subsequent offers in any responses
                // to the initial INVITE.  This means that a UAS based on this
                // specification alone can never generate subsequent offers until
                // completion of the initial transaction.
                // https://tools.ietf.org/html/rfc3261#section-13.2.1
                if (this.state !== SessionState.Established) {
                    return Promise.resolve(undefined);
                }
                // In dialog INVITE without offer, get an offer for the response.
                return this.getOffer(options);
            case SignalingState.Closed:
                throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
            default:
                throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
        }
    }
    /**
     * Get local offer.
     * @internal
     */
    getOffer(options) {
        const sdh = this.setupSessionDescriptionHandler();
        const sdhOptions = options.sessionDescriptionHandlerOptions;
        const sdhModifiers = options.sessionDescriptionHandlerModifiers;
        // This is intentionally written very defensively. Don't trust SDH to behave.
        try {
            return sdh
                .getDescription(sdhOptions, sdhModifiers)
                .then((bodyAndContentType) => fromBodyLegacy(bodyAndContentType))
                .catch((error) => {
                // don't trust SDH to reject with Error
                this.logger.error("Session.getOffer: SDH getDescription rejected...");
                const e = error instanceof Error ? error : new Error("Session.getOffer unknown error.");
                this.logger.error(e.message);
                throw e;
            });
        }
        catch (error) {
            // don't trust SDH to throw an Error
            this.logger.error("Session.getOffer: SDH getDescription threw...");
            const e = error instanceof Error ? error : new Error(error);
            this.logger.error(e.message);
            return Promise.reject(e);
        }
    }
    /**
     * Rollback local/remote offer.
     * @internal
     */
    rollbackOffer() {
        const sdh = this.setupSessionDescriptionHandler();
        if (sdh.rollbackDescription === undefined) {
            return Promise.resolve();
        }
        // This is intentionally written very defensively. Don't trust SDH to behave.
        try {
            return sdh.rollbackDescription().catch((error) => {
                // don't trust SDH to reject with Error
                this.logger.error("Session.rollbackOffer: SDH rollbackDescription rejected...");
                const e = error instanceof Error ? error : new Error("Session.rollbackOffer unknown error.");
                this.logger.error(e.message);
                throw e;
            });
        }
        catch (error) {
            // don't trust SDH to throw an Error
            this.logger.error("Session.rollbackOffer: SDH rollbackDescription threw...");
            const e = error instanceof Error ? error : new Error(error);
            this.logger.error(e.message);
            return Promise.reject(e);
        }
    }
    /**
     * Set remote answer.
     * @internal
     */
    setAnswer(answer, options) {
        const sdh = this.setupSessionDescriptionHandler();
        const sdhOptions = options.sessionDescriptionHandlerOptions;
        const sdhModifiers = options.sessionDescriptionHandlerModifiers;
        // This is intentionally written very defensively. Don't trust SDH to behave.
        try {
            if (!sdh.hasDescription(answer.contentType)) {
                return Promise.reject(new ContentTypeUnsupportedError());
            }
        }
        catch (error) {
            this.logger.error("Session.setAnswer: SDH hasDescription threw...");
            const e = error instanceof Error ? error : new Error(error);
            this.logger.error(e.message);
            return Promise.reject(e);
        }
        try {
            return sdh.setDescription(answer.content, sdhOptions, sdhModifiers).catch((error) => {
                // don't trust SDH to reject with Error
                this.logger.error("Session.setAnswer: SDH setDescription rejected...");
                const e = error instanceof Error ? error : new Error("Session.setAnswer unknown error.");
                this.logger.error(e.message);
                throw e;
            });
        }
        catch (error) {
            // don't trust SDH to throw an Error
            this.logger.error("Session.setAnswer: SDH setDescription threw...");
            const e = error instanceof Error ? error : new Error(error);
            this.logger.error(e.message);
            return Promise.reject(e);
        }
    }
    /**
     * Set remote offer and get local answer.
     * @internal
     */
    setOfferAndGetAnswer(offer, options) {
        const sdh = this.setupSessionDescriptionHandler();
        const sdhOptions = options.sessionDescriptionHandlerOptions;
        const sdhModifiers = options.sessionDescriptionHandlerModifiers;
        // This is intentionally written very defensively. Don't trust SDH to behave.
        try {
            if (!sdh.hasDescription(offer.contentType)) {
                return Promise.reject(new ContentTypeUnsupportedError());
            }
        }
        catch (error) {
            this.logger.error("Session.setOfferAndGetAnswer: SDH hasDescription threw...");
            const e = error instanceof Error ? error : new Error(error);
            this.logger.error(e.message);
            return Promise.reject(e);
        }
        try {
            return sdh
                .setDescription(offer.content, sdhOptions, sdhModifiers)
                .then(() => sdh.getDescription(sdhOptions, sdhModifiers))
                .then((bodyAndContentType) => fromBodyLegacy(bodyAndContentType))
                .catch((error) => {
                // don't trust SDH to reject with Error
                this.logger.error("Session.setOfferAndGetAnswer: SDH setDescription or getDescription rejected...");
                const e = error instanceof Error ? error : new Error("Session.setOfferAndGetAnswer unknown error.");
                this.logger.error(e.message);
                throw e;
            });
        }
        catch (error) {
            // don't trust SDH to throw an Error
            this.logger.error("Session.setOfferAndGetAnswer: SDH setDescription or getDescription threw...");
            const e = error instanceof Error ? error : new Error(error);
            this.logger.error(e.message);
            return Promise.reject(e);
        }
    }
    /**
     * SDH for confirmed dialog.
     * @internal
     */
    setSessionDescriptionHandler(sdh) {
        if (this._sessionDescriptionHandler) {
            throw new Error("Session description handler defined.");
        }
        this._sessionDescriptionHandler = sdh;
    }
    /**
     * SDH for confirmed dialog.
     * @internal
     */
    setupSessionDescriptionHandler() {
        var _a;
        if (this._sessionDescriptionHandler) {
            return this._sessionDescriptionHandler;
        }
        this._sessionDescriptionHandler = this.sessionDescriptionHandlerFactory(this, this.userAgent.configuration.sessionDescriptionHandlerFactoryOptions);
        if ((_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onSessionDescriptionHandler) {
            this.delegate.onSessionDescriptionHandler(this._sessionDescriptionHandler, false);
        }
        return this._sessionDescriptionHandler;
    }
    /**
     * Transition session state.
     * @internal
     */
    stateTransition(newState) {
        const invalidTransition = () => {
            throw new Error(`Invalid state transition from ${this._state} to ${newState}`);
        };
        // Validate transition
        switch (this._state) {
            case SessionState.Initial:
                if (newState !== SessionState.Establishing &&
                    newState !== SessionState.Established &&
                    newState !== SessionState.Terminating &&
                    newState !== SessionState.Terminated) {
                    invalidTransition();
                }
                break;
            case SessionState.Establishing:
                if (newState !== SessionState.Established &&
                    newState !== SessionState.Terminating &&
                    newState !== SessionState.Terminated) {
                    invalidTransition();
                }
                break;
            case SessionState.Established:
                if (newState !== SessionState.Terminating && newState !== SessionState.Terminated) {
                    invalidTransition();
                }
                break;
            case SessionState.Terminating:
                if (newState !== SessionState.Terminated) {
                    invalidTransition();
                }
                break;
            case SessionState.Terminated:
                invalidTransition();
                break;
            default:
                throw new Error("Unrecognized state.");
        }
        // Transition
        this._state = newState;
        this.logger.log(`Session ${this.id} transitioned to state ${this._state}`);
        this._stateEventEmitter.emit(this._state);
        // Dispose
        if (newState === SessionState.Terminated) {
            this.dispose();
        }
    }
    copyRequestOptions(requestOptions = {}) {
        const extraHeaders = requestOptions.extraHeaders ? requestOptions.extraHeaders.slice() : undefined;
        const body = requestOptions.body
            ? {
                contentDisposition: requestOptions.body.contentDisposition || "render",
                contentType: requestOptions.body.contentType || "text/plain",
                content: requestOptions.body.content || ""
            }
            : undefined;
        return {
            extraHeaders,
            body
        };
    }
    getReasonHeaderValue(code, reason) {
        const cause = code;
        let text = getReasonPhrase(code);
        if (!text && reason) {
            text = reason;
        }
        return "SIP;cause=" + cause + ';text="' + text + '"';
    }
    referExtraHeaders(referTo) {
        const extraHeaders = [];
        extraHeaders.push("Referred-By: <" + this.userAgent.configuration.uri + ">");
        extraHeaders.push("Contact: " + this._contact);
        extraHeaders.push("Allow: " + ["ACK", "CANCEL", "INVITE", "MESSAGE", "BYE", "OPTIONS", "INFO", "NOTIFY", "REFER"].toString());
        extraHeaders.push("Refer-To: " + referTo);
        return extraHeaders;
    }
    referToString(target) {
        let referTo;
        if (target instanceof URI) {
            // REFER without Replaces (Blind Transfer)
            referTo = target.toString();
        }
        else {
            // REFER with Replaces (Attended Transfer)
            if (!target.dialog) {
                throw new Error("Dialog undefined.");
            }
            const displayName = target.remoteIdentity.friendlyName;
            const remoteTarget = target.dialog.remoteTarget.toString();
            const callId = target.dialog.callId;
            const remoteTag = target.dialog.remoteTag;
            const localTag = target.dialog.localTag;
            const replaces = encodeURIComponent(`${callId};to-tag=${remoteTag};from-tag=${localTag}`);
            referTo = `"${displayName}" <${remoteTarget}?Replaces=${replaces}>`;
        }
        return referTo;
    }
}

/**
 * SIP extension support level.
 * @public
 */
var SIPExtension;
(function (SIPExtension) {
    SIPExtension["Required"] = "Required";
    SIPExtension["Supported"] = "Supported";
    SIPExtension["Unsupported"] = "Unsupported";
})(SIPExtension = SIPExtension || (SIPExtension = {}));
/**
 * SIP Option Tags
 * @remarks
 * http://www.iana.org/assignments/sip-parameters/sip-parameters.xhtml#sip-parameters-4
 * @public
 */
const UserAgentRegisteredOptionTags = {
    "100rel": true,
    "199": true,
    answermode: true,
    "early-session": true,
    eventlist: true,
    explicitsub: true,
    "from-change": true,
    "geolocation-http": true,
    "geolocation-sip": true,
    gin: true,
    gruu: true,
    histinfo: true,
    ice: true,
    join: true,
    "multiple-refer": true,
    norefersub: true,
    nosub: true,
    outbound: true,
    path: true,
    policy: true,
    precondition: true,
    pref: true,
    privacy: true,
    "recipient-list-invite": true,
    "recipient-list-message": true,
    "recipient-list-subscribe": true,
    replaces: true,
    "resource-priority": true,
    "sdp-anat": true,
    "sec-agree": true,
    tdialog: true,
    timer: true,
    uui: true // RFC 7433
};

/**
 * An invitation is an offer to establish a {@link Session} (incoming INVITE).
 * @public
 */
class Invitation extends Session {
    /** @internal */
    constructor(userAgent, incomingInviteRequest) {
        super(userAgent);
        this.incomingInviteRequest = incomingInviteRequest;
        /** True if dispose() has been called. */
        this.disposed = false;
        /** INVITE will be rejected if not accepted within a certain period time. */
        this.expiresTimer = undefined;
        /** True if this Session has been Terminated due to a CANCEL request. */
        this.isCanceled = false;
        /** Are reliable provisional responses required or supported. */
        this.rel100 = "none";
        /** The current RSeq header value. */
        this.rseq = Math.floor(Math.random() * 10000);
        /** INVITE will be rejected if final response not sent in a certain period time. */
        this.userNoAnswerTimer = undefined;
        /** True if waiting for a PRACK before sending a 200 Ok. */
        this.waitingForPrack = false;
        this.logger = userAgent.getLogger("sip.Invitation");
        const incomingRequestMessage = this.incomingInviteRequest.message;
        // Set 100rel if necessary
        const requireHeader = incomingRequestMessage.getHeader("require");
        if (requireHeader && requireHeader.toLowerCase().includes("100rel")) {
            this.rel100 = "required";
        }
        const supportedHeader = incomingRequestMessage.getHeader("supported");
        if (supportedHeader && supportedHeader.toLowerCase().includes("100rel")) {
            this.rel100 = "supported";
        }
        // FIXME: HACK: This is a hack to port an existing behavior.
        // Set the toTag on the incoming request message to the toTag which
        // will be used in the response to the incoming request!!!
        // The behavior being ported appears to be a hack itself,
        // so this is a hack to port a hack. At least one test spec
        // relies on it (which is yet another hack).
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        incomingRequestMessage.toTag = incomingInviteRequest.toTag;
        if (typeof incomingRequestMessage.toTag !== "string") {
            throw new TypeError("toTag should have been a string.");
        }
        // The following mapping values are RECOMMENDED:
        // ...
        // 19 no answer from the user              480 Temporarily unavailable
        // https://tools.ietf.org/html/rfc3398#section-7.2.4.1
        this.userNoAnswerTimer = setTimeout(() => {
            incomingInviteRequest.reject({ statusCode: 480 });
            this.stateTransition(SessionState.Terminated);
        }, this.userAgent.configuration.noAnswerTimeout ? this.userAgent.configuration.noAnswerTimeout * 1000 : 60000);
        // 1. If the request is an INVITE that contains an Expires header
        // field, the UAS core sets a timer for the number of seconds
        // indicated in the header field value.  When the timer fires, the
        // invitation is considered to be expired.  If the invitation
        // expires before the UAS has generated a final response, a 487
        // (Request Terminated) response SHOULD be generated.
        // https://tools.ietf.org/html/rfc3261#section-13.3.1
        if (incomingRequestMessage.hasHeader("expires")) {
            const expires = Number(incomingRequestMessage.getHeader("expires") || 0) * 1000;
            this.expiresTimer = setTimeout(() => {
                if (this.state === SessionState.Initial) {
                    incomingInviteRequest.reject({ statusCode: 487 });
                    this.stateTransition(SessionState.Terminated);
                }
            }, expires);
        }
        // Session parent properties
        const assertedIdentity = this.request.getHeader("P-Asserted-Identity");
        if (assertedIdentity) {
            this._assertedIdentity = Grammar.nameAddrHeaderParse(assertedIdentity);
        }
        this._contact = this.userAgent.contact.toString();
        const contentDisposition = incomingRequestMessage.parseHeader("Content-Disposition");
        if (contentDisposition && contentDisposition.type === "render") {
            this._renderbody = incomingRequestMessage.body;
            this._rendertype = incomingRequestMessage.getHeader("Content-Type");
        }
        // Identifier
        this._id = incomingRequestMessage.callId + incomingRequestMessage.fromTag;
        // Add to the user agent's session collection.
        this.userAgent._sessions[this._id] = this;
    }
    /**
     * Destructor.
     */
    dispose() {
        // Only run through this once. It can and does get called multiple times
        // depending on the what the sessions state is when first called.
        // For example, if called when "establishing" it will be called again
        // at least once when the session transitions to "terminated".
        // Regardless, running through this more than once is pointless.
        if (this.disposed) {
            return Promise.resolve();
        }
        this.disposed = true;
        // Clear timers
        if (this.expiresTimer) {
            clearTimeout(this.expiresTimer);
            this.expiresTimer = undefined;
        }
        if (this.userNoAnswerTimer) {
            clearTimeout(this.userNoAnswerTimer);
            this.userNoAnswerTimer = undefined;
        }
        // If accept() is still waiting for a PRACK, make sure it rejects
        this.prackNeverArrived();
        // If the final response for the initial INVITE not yet been sent, reject it
        switch (this.state) {
            case SessionState.Initial:
                return this.reject().then(() => super.dispose());
            case SessionState.Establishing:
                return this.reject().then(() => super.dispose());
            case SessionState.Established:
                return super.dispose();
            case SessionState.Terminating:
                return super.dispose();
            case SessionState.Terminated:
                return super.dispose();
            default:
                throw new Error("Unknown state.");
        }
    }
    /**
     * If true, a first provisional response after the 100 Trying
     * will be sent automatically. This is false it the UAC required
     * reliable provisional responses (100rel in Require header) or
     * the user agent configuration has specified to not send an
     * initial response, otherwise it is true. The provisional is sent by
     * calling `progress()` without any options.
     */
    get autoSendAnInitialProvisionalResponse() {
        return this.rel100 !== "required" && this.userAgent.configuration.sendInitialProvisionalResponse;
    }
    /**
     * Initial incoming INVITE request message body.
     */
    get body() {
        return this.incomingInviteRequest.message.body;
    }
    /**
     * The identity of the local user.
     */
    get localIdentity() {
        return this.request.to;
    }
    /**
     * The identity of the remote user.
     */
    get remoteIdentity() {
        return this.request.from;
    }
    /**
     * Initial incoming INVITE request message.
     */
    get request() {
        return this.incomingInviteRequest.message;
    }
    /**
     * Accept the invitation.
     *
     * @remarks
     * Accept the incoming INVITE request to start a Session.
     * Replies to the INVITE request with a 200 Ok response.
     * Resolves once the response sent, otherwise rejects.
     *
     * This method may reject for a variety of reasons including
     * the receipt of a CANCEL request before `accept` is able
     * to construct a response.
     * @param options - Options bucket.
     */
    accept(options = {}) {
        this.logger.log("Invitation.accept");
        // validate state
        if (this.state !== SessionState.Initial) {
            const error = new Error(`Invalid session state ${this.state}`);
            this.logger.error(error.message);
            return Promise.reject(error);
        }
        // Modifiers and options for initial INVITE transaction
        if (options.sessionDescriptionHandlerModifiers) {
            this.sessionDescriptionHandlerModifiers = options.sessionDescriptionHandlerModifiers;
        }
        if (options.sessionDescriptionHandlerOptions) {
            this.sessionDescriptionHandlerOptions = options.sessionDescriptionHandlerOptions;
        }
        // transition state
        this.stateTransition(SessionState.Establishing);
        return (this.sendAccept(options)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .then(({ message, session }) => {
            session.delegate = {
                onAck: (ackRequest) => this.onAckRequest(ackRequest),
                onAckTimeout: () => this.onAckTimeout(),
                onBye: (byeRequest) => this.onByeRequest(byeRequest),
                onInfo: (infoRequest) => this.onInfoRequest(infoRequest),
                onInvite: (inviteRequest) => this.onInviteRequest(inviteRequest),
                onMessage: (messageRequest) => this.onMessageRequest(messageRequest),
                onNotify: (notifyRequest) => this.onNotifyRequest(notifyRequest),
                onPrack: (prackRequest) => this.onPrackRequest(prackRequest),
                onRefer: (referRequest) => this.onReferRequest(referRequest)
            };
            this._dialog = session;
            this.stateTransition(SessionState.Established);
            // TODO: Reconsider this "automagic" send of a BYE to replacee behavior.
            // This behavior has been ported forward from legacy versions.
            if (this._replacee) {
                this._replacee._bye();
            }
        })
            .catch((error) => this.handleResponseError(error)));
    }
    /**
     * Indicate progress processing the invitation.
     *
     * @remarks
     * Report progress to the the caller.
     * Replies to the INVITE request with a 1xx provisional response.
     * Resolves once the response sent, otherwise rejects.
     * @param options - Options bucket.
     */
    progress(options = {}) {
        this.logger.log("Invitation.progress");
        // validate state
        if (this.state !== SessionState.Initial) {
            const error = new Error(`Invalid session state ${this.state}`);
            this.logger.error(error.message);
            return Promise.reject(error);
        }
        // Ported
        const statusCode = options.statusCode || 180;
        if (statusCode < 100 || statusCode > 199) {
            throw new TypeError("Invalid statusCode: " + statusCode);
        }
        // Modifiers and options for initial INVITE transaction
        if (options.sessionDescriptionHandlerModifiers) {
            this.sessionDescriptionHandlerModifiers = options.sessionDescriptionHandlerModifiers;
        }
        if (options.sessionDescriptionHandlerOptions) {
            this.sessionDescriptionHandlerOptions = options.sessionDescriptionHandlerOptions;
        }
        // After the first reliable provisional response for a request has been
        // acknowledged, the UAS MAY send additional reliable provisional
        // responses.  The UAS MUST NOT send a second reliable provisional
        // response until the first is acknowledged.  After the first, it is
        // RECOMMENDED that the UAS not send an additional reliable provisional
        // response until the previous is acknowledged.  The first reliable
        // provisional response receives special treatment because it conveys
        // the initial sequence number.  If additional reliable provisional
        // responses were sent before the first was acknowledged, the UAS could
        // not be certain these were received in order.
        // https://tools.ietf.org/html/rfc3262#section-3
        if (this.waitingForPrack) {
            this.logger.warn("Unexpected call for progress while waiting for prack, ignoring");
            return Promise.resolve();
        }
        // Trying provisional response
        if (options.statusCode === 100) {
            return this.sendProgressTrying()
                .then(() => {
                return;
            })
                .catch((error) => this.handleResponseError(error));
        }
        // Standard provisional response
        if (!(this.rel100 === "required") &&
            !(this.rel100 === "supported" && options.rel100) &&
            !(this.rel100 === "supported" && this.userAgent.configuration.sipExtension100rel === SIPExtension.Required)) {
            return this.sendProgress(options)
                .then(() => {
                return;
            })
                .catch((error) => this.handleResponseError(error));
        }
        // Reliable provisional response
        return this.sendProgressReliableWaitForPrack(options)
            .then(() => {
            return;
        })
            .catch((error) => this.handleResponseError(error));
    }
    /**
     * Reject the invitation.
     *
     * @remarks
     * Replies to the INVITE request with a 4xx, 5xx, or 6xx final response.
     * Resolves once the response sent, otherwise rejects.
     *
     * The expectation is that this method is used to reject an INVITE request.
     * That is indeed the case - a call to `progress` followed by `reject` is
     * a typical way to "decline" an incoming INVITE request. However it may
     * also be called after calling `accept` (but only before it completes)
     * which will reject the call and cause `accept` to reject.
     * @param options - Options bucket.
     */
    reject(options = {}) {
        this.logger.log("Invitation.reject");
        // validate state
        if (this.state !== SessionState.Initial && this.state !== SessionState.Establishing) {
            const error = new Error(`Invalid session state ${this.state}`);
            this.logger.error(error.message);
            return Promise.reject(error);
        }
        const statusCode = options.statusCode || 480;
        const reasonPhrase = options.reasonPhrase ? options.reasonPhrase : getReasonPhrase(statusCode);
        const extraHeaders = options.extraHeaders || [];
        if (statusCode < 300 || statusCode > 699) {
            throw new TypeError("Invalid statusCode: " + statusCode);
        }
        const body = options.body ? fromBodyLegacy(options.body) : undefined;
        // FIXME: Need to redirect to someplace
        statusCode < 400
            ? this.incomingInviteRequest.redirect([], { statusCode, reasonPhrase, extraHeaders, body })
            : this.incomingInviteRequest.reject({ statusCode, reasonPhrase, extraHeaders, body });
        this.stateTransition(SessionState.Terminated);
        return Promise.resolve();
    }
    /**
     * Handle CANCEL request.
     *
     * @param message - CANCEL message.
     * @internal
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _onCancel(message) {
        this.logger.log("Invitation._onCancel");
        // validate state
        if (this.state !== SessionState.Initial && this.state !== SessionState.Establishing) {
            this.logger.error(`CANCEL received while in state ${this.state}, dropping request`);
            return;
        }
        if (this.delegate && this.delegate.onCancel) {
            const cancel = new Cancel(message);
            this.delegate.onCancel(cancel);
        }
        // flag canceled
        this.isCanceled = true;
        // reject INVITE with 487 status code
        this.incomingInviteRequest.reject({ statusCode: 487 });
        this.stateTransition(SessionState.Terminated);
    }
    /**
     * Helper function to handle offer/answer in a PRACK.
     */
    handlePrackOfferAnswer(request) {
        if (!this.dialog) {
            throw new Error("Dialog undefined.");
        }
        // If the PRACK doesn't have an offer/answer, nothing to be done.
        const body = getBody(request.message);
        if (!body || body.contentDisposition !== "session") {
            return Promise.resolve(undefined);
        }
        const options = {
            sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
            sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
        };
        // If the UAC receives a reliable provisional response with an offer
        // (this would occur if the UAC sent an INVITE without an offer, in
        // which case the first reliable provisional response will contain the
        // offer), it MUST generate an answer in the PRACK.  If the UAC receives
        // a reliable provisional response with an answer, it MAY generate an
        // additional offer in the PRACK.  If the UAS receives a PRACK with an
        // offer, it MUST place the answer in the 2xx to the PRACK.
        // https://tools.ietf.org/html/rfc3262#section-5
        switch (this.dialog.signalingState) {
            case SignalingState.Initial:
                // State should never be reached as first reliable provisional response must have answer/offer.
                throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
            case SignalingState.Stable:
                // Receved answer.
                return this.setAnswer(body, options).then(() => undefined);
            case SignalingState.HaveLocalOffer:
                // State should never be reached as local offer would be answered by this PRACK
                throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
            case SignalingState.HaveRemoteOffer:
                // Received offer, generate answer.
                return this.setOfferAndGetAnswer(body, options);
            case SignalingState.Closed:
                throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
            default:
                throw new Error(`Invalid signaling state ${this.dialog.signalingState}.`);
        }
    }
    /**
     * A handler for errors which occur while attempting to send 1xx and 2xx responses.
     * In all cases, an attempt is made to reject the request if it is still outstanding.
     * And while there are a variety of things which can go wrong and we log something here
     * for all errors, there are a handful of common exceptions we pay some extra attention to.
     * @param error - The error which occurred.
     */
    handleResponseError(error) {
        let statusCode = 480; // "Temporarily Unavailable"
        // Log Error message
        if (error instanceof Error) {
            this.logger.error(error.message);
        }
        else {
            // We don't actually know what a session description handler implementation might throw our way,
            // and more generally as a last resort catch all, just assume we are getting an "unknown" and log it.
            this.logger.error(error);
        }
        // Log Exception message
        if (error instanceof ContentTypeUnsupportedError) {
            this.logger.error("A session description handler occurred while sending response (content type unsupported");
            statusCode = 415; // "Unsupported Media Type"
        }
        else if (error instanceof SessionDescriptionHandlerError) {
            this.logger.error("A session description handler occurred while sending response");
        }
        else if (error instanceof SessionTerminatedError) {
            this.logger.error("Session ended before response could be formulated and sent (while waiting for PRACK)");
        }
        else if (error instanceof TransactionStateError) {
            this.logger.error("Session changed state before response could be formulated and sent");
        }
        // Reject if still in "initial" or "establishing" state.
        if (this.state === SessionState.Initial || this.state === SessionState.Establishing) {
            try {
                this.incomingInviteRequest.reject({ statusCode });
                this.stateTransition(SessionState.Terminated);
            }
            catch (e) {
                this.logger.error("An error occurred attempting to reject the request while handling another error");
                throw e; // This is not a good place to be...
            }
        }
        // FIXME: TODO:
        // Here we are squelching the throwing of errors due to an race condition.
        // We have an internal race between calling `accept()` and handling an incoming
        // CANCEL request. As there is no good way currently to delegate the handling of
        // these race errors to the caller of `accept()`, we are squelching the throwing
        // of ALL errors when/if they occur after receiving a CANCEL to catch the ONE we know
        // is a "normal" exceptional condition. While this is a completely reasonable approach,
        // the decision should be left up to the library user. Furthermore, as we are eating
        // ALL errors in this case, we are potentially (likely) hiding "real" errors which occur.
        //
        // Only rethrow error if the session has not been canceled.
        if (this.isCanceled) {
            this.logger.warn("An error occurred while attempting to formulate and send a response to an incoming INVITE." +
                " However a CANCEL was received and processed while doing so which can (and often does) result" +
                " in errors occurring as the session terminates in the meantime. Said error is being ignored.");
            return;
        }
        throw error;
    }
    /**
     * Callback for when ACK for a 2xx response is never received.
     * @param session - Session the ACK never arrived for.
     */
    onAckTimeout() {
        this.logger.log("Invitation.onAckTimeout");
        if (!this.dialog) {
            throw new Error("Dialog undefined.");
        }
        this.logger.log("No ACK received for an extended period of time, terminating session");
        this.dialog.bye();
        this.stateTransition(SessionState.Terminated);
    }
    /**
     * A version of `accept` which resolves a session when the 200 Ok response is sent.
     * @param options - Options bucket.
     */
    sendAccept(options = {}) {
        const responseOptions = {
            sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
            sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
        };
        const extraHeaders = options.extraHeaders || [];
        // The UAS MAY send a final response to the initial request before
        // having received PRACKs for all unacknowledged reliable provisional
        // responses, unless the final response is 2xx and any of the
        // unacknowledged reliable provisional responses contained a session
        // description.  In that case, it MUST NOT send a final response until
        // those provisional responses are acknowledged.  If the UAS does send a
        // final response when reliable responses are still unacknowledged, it
        // SHOULD NOT continue to retransmit the unacknowledged reliable
        // provisional responses, but it MUST be prepared to process PRACK
        // requests for those outstanding responses.  A UAS MUST NOT send new
        // reliable provisional responses (as opposed to retransmissions of
        // unacknowledged ones) after sending a final response to a request.
        // https://tools.ietf.org/html/rfc3262#section-3
        if (this.waitingForPrack) {
            return this.waitForArrivalOfPrack()
                .then(() => clearTimeout(this.userNoAnswerTimer)) // Ported
                .then(() => this.generateResponseOfferAnswer(this.incomingInviteRequest, responseOptions))
                .then((body) => this.incomingInviteRequest.accept({ statusCode: 200, body, extraHeaders }));
        }
        clearTimeout(this.userNoAnswerTimer); // Ported
        return this.generateResponseOfferAnswer(this.incomingInviteRequest, responseOptions).then((body) => this.incomingInviteRequest.accept({ statusCode: 200, body, extraHeaders }));
    }
    /**
     * A version of `progress` which resolves when the provisional response is sent.
     * @param options - Options bucket.
     */
    sendProgress(options = {}) {
        const statusCode = options.statusCode || 180;
        const reasonPhrase = options.reasonPhrase;
        const extraHeaders = (options.extraHeaders || []).slice();
        const body = options.body ? fromBodyLegacy(options.body) : undefined;
        // The 183 (Session Progress) response is used to convey information
        // about the progress of the call that is not otherwise classified.  The
        // Reason-Phrase, header fields, or message body MAY be used to convey
        // more details about the call progress.
        // https://tools.ietf.org/html/rfc3261#section-21.1.5
        // It is the de facto industry standard to utilize 183 with SDP to provide "early media".
        // While it is unlikely someone would want to send a 183 without SDP, so it should be an option.
        if (statusCode === 183 && !body) {
            return this.sendProgressWithSDP(options);
        }
        try {
            const progressResponse = this.incomingInviteRequest.progress({ statusCode, reasonPhrase, extraHeaders, body });
            this._dialog = progressResponse.session;
            return Promise.resolve(progressResponse);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * A version of `progress` which resolves when the provisional response with sdp is sent.
     * @param options - Options bucket.
     */
    sendProgressWithSDP(options = {}) {
        const responseOptions = {
            sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
            sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
        };
        const statusCode = options.statusCode || 183;
        const reasonPhrase = options.reasonPhrase;
        const extraHeaders = (options.extraHeaders || []).slice();
        // Get an offer/answer and send a reply.
        return this.generateResponseOfferAnswer(this.incomingInviteRequest, responseOptions)
            .then((body) => this.incomingInviteRequest.progress({ statusCode, reasonPhrase, extraHeaders, body }))
            .then((progressResponse) => {
            this._dialog = progressResponse.session;
            return progressResponse;
        });
    }
    /**
     * A version of `progress` which resolves when the reliable provisional response is sent.
     * @param options - Options bucket.
     */
    sendProgressReliable(options = {}) {
        options.extraHeaders = (options.extraHeaders || []).slice();
        options.extraHeaders.push("Require: 100rel");
        options.extraHeaders.push("RSeq: " + Math.floor(Math.random() * 10000));
        return this.sendProgressWithSDP(options);
    }
    /**
     * A version of `progress` which resolves when the reliable provisional response is acknowledged.
     * @param options - Options bucket.
     */
    sendProgressReliableWaitForPrack(options = {}) {
        const responseOptions = {
            sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions,
            sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers
        };
        const statusCode = options.statusCode || 183;
        const reasonPhrase = options.reasonPhrase;
        const extraHeaders = (options.extraHeaders || []).slice();
        extraHeaders.push("Require: 100rel");
        extraHeaders.push("RSeq: " + this.rseq++);
        let body;
        return new Promise((resolve, reject) => {
            this.waitingForPrack = true;
            this.generateResponseOfferAnswer(this.incomingInviteRequest, responseOptions)
                .then((offerAnswer) => {
                body = offerAnswer;
                return this.incomingInviteRequest.progress({ statusCode, reasonPhrase, extraHeaders, body });
            })
                .then((progressResponse) => {
                this._dialog = progressResponse.session;
                let prackRequest;
                let prackResponse;
                progressResponse.session.delegate = {
                    onPrack: (request) => {
                        prackRequest = request;
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                        clearTimeout(prackWaitTimeoutTimer);
                        // eslint-disable-next-line @typescript-eslint/no-use-before-define
                        clearTimeout(rel1xxRetransmissionTimer);
                        if (!this.waitingForPrack) {
                            return;
                        }
                        this.waitingForPrack = false;
                        this.handlePrackOfferAnswer(prackRequest)
                            .then((prackResponseBody) => {
                            try {
                                prackResponse = prackRequest.accept({ statusCode: 200, body: prackResponseBody });
                                this.prackArrived();
                                resolve({ prackRequest, prackResponse, progressResponse });
                            }
                            catch (error) {
                                reject(error);
                            }
                        })
                            .catch((error) => reject(error));
                    }
                };
                // https://tools.ietf.org/html/rfc3262#section-3
                const prackWaitTimeout = () => {
                    if (!this.waitingForPrack) {
                        return;
                    }
                    this.waitingForPrack = false;
                    this.logger.warn("No PRACK received, rejecting INVITE.");
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    clearTimeout(rel1xxRetransmissionTimer);
                    this.reject({ statusCode: 504 })
                        .then(() => reject(new SessionTerminatedError()))
                        .catch((error) => reject(error));
                };
                const prackWaitTimeoutTimer = setTimeout(prackWaitTimeout, Timers.T1 * 64);
                // https://tools.ietf.org/html/rfc3262#section-3
                const rel1xxRetransmission = () => {
                    try {
                        this.incomingInviteRequest.progress({ statusCode, reasonPhrase, extraHeaders, body });
                    }
                    catch (error) {
                        this.waitingForPrack = false;
                        reject(error);
                        return;
                    }
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    rel1xxRetransmissionTimer = setTimeout(rel1xxRetransmission, (timeout *= 2));
                };
                let timeout = Timers.T1;
                let rel1xxRetransmissionTimer = setTimeout(rel1xxRetransmission, timeout);
            })
                .catch((error) => {
                this.waitingForPrack = false;
                reject(error);
            });
        });
    }
    /**
     * A version of `progress` which resolves when a 100 Trying provisional response is sent.
     */
    sendProgressTrying() {
        try {
            const progressResponse = this.incomingInviteRequest.trying();
            return Promise.resolve(progressResponse);
        }
        catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * When attempting to accept the INVITE, an invitation waits
     * for any outstanding PRACK to arrive before sending the 200 Ok.
     * It will be waiting on this Promise to resolve which lets it know
     * the PRACK has arrived and it may proceed to send the 200 Ok.
     */
    waitForArrivalOfPrack() {
        if (this.waitingForPrackPromise) {
            throw new Error("Already waiting for PRACK");
        }
        this.waitingForPrackPromise = new Promise((resolve, reject) => {
            this.waitingForPrackResolve = resolve;
            this.waitingForPrackReject = reject;
        });
        return this.waitingForPrackPromise;
    }
    /**
     * Here we are resolving the promise which in turn will cause
     * the accept to proceed (it may still fail for other reasons, but...).
     */
    prackArrived() {
        if (this.waitingForPrackResolve) {
            this.waitingForPrackResolve();
        }
        this.waitingForPrackPromise = undefined;
        this.waitingForPrackResolve = undefined;
        this.waitingForPrackReject = undefined;
    }
    /**
     * Here we are rejecting the promise which in turn will cause
     * the accept to fail and the session to transition to "terminated".
     */
    prackNeverArrived() {
        if (this.waitingForPrackReject) {
            this.waitingForPrackReject(new SessionTerminatedError());
        }
        this.waitingForPrackPromise = undefined;
        this.waitingForPrackResolve = undefined;
        this.waitingForPrackReject = undefined;
    }
}

/**
 * An inviter offers to establish a {@link Session} (outgoing INVITE).
 * @public
 */
class Inviter extends Session {
    /**
     * Constructs a new instance of the `Inviter` class.
     * @param userAgent - User agent. See {@link UserAgent} for details.
     * @param targetURI - Request URI identifying the target of the message.
     * @param options - Options bucket. See {@link InviterOptions} for details.
     */
    constructor(userAgent, targetURI, options = {}) {
        super(userAgent, options);
        /** True if dispose() has been called. */
        this.disposed = false;
        /** True if early media use is enabled. */
        this.earlyMedia = false;
        /** The early media session description handlers. */
        this.earlyMediaSessionDescriptionHandlers = new Map();
        /** True if cancel() was called. */
        this.isCanceled = false;
        /** True if initial INVITE without SDP. */
        this.inviteWithoutSdp = false;
        this.logger = userAgent.getLogger("sip.Inviter");
        // Early media
        this.earlyMedia = options.earlyMedia !== undefined ? options.earlyMedia : this.earlyMedia;
        // From tag
        this.fromTag = newTag();
        // Invite without SDP
        this.inviteWithoutSdp = options.inviteWithoutSdp !== undefined ? options.inviteWithoutSdp : this.inviteWithoutSdp;
        // Inviter options (could do better copying these options)
        const inviterOptions = Object.assign({}, options);
        inviterOptions.params = Object.assign({}, options.params);
        // Anonymous call
        const anonymous = options.anonymous || false;
        // Contact
        const contact = userAgent.contact.toString({
            anonymous,
            // Do not add ;ob in initial forming dialog requests if the
            // registration over the current connection got a GRUU URI.
            outbound: anonymous ? !userAgent.contact.tempGruu : !userAgent.contact.pubGruu
        });
        // FIXME: TODO: We should not be parsing URIs here as if it fails we have to throw an exception
        // which is not something we want our constructor to do. URIs should be passed in as params.
        // URIs
        if (anonymous && userAgent.configuration.uri) {
            inviterOptions.params.fromDisplayName = "Anonymous";
            inviterOptions.params.fromUri = "sip:anonymous@anonymous.invalid";
        }
        let fromURI = userAgent.userAgentCore.configuration.aor;
        if (inviterOptions.params.fromUri) {
            fromURI =
                typeof inviterOptions.params.fromUri === "string"
                    ? Grammar.URIParse(inviterOptions.params.fromUri)
                    : inviterOptions.params.fromUri;
        }
        if (!fromURI) {
            throw new TypeError("Invalid from URI: " + inviterOptions.params.fromUri);
        }
        let toURI = targetURI;
        if (inviterOptions.params.toUri) {
            toURI =
                typeof inviterOptions.params.toUri === "string"
                    ? Grammar.URIParse(inviterOptions.params.toUri)
                    : inviterOptions.params.toUri;
        }
        if (!toURI) {
            throw new TypeError("Invalid to URI: " + inviterOptions.params.toUri);
        }
        // Params
        const messageOptions = Object.assign({}, inviterOptions.params);
        messageOptions.fromTag = this.fromTag;
        // Extra headers
        const extraHeaders = (inviterOptions.extraHeaders || []).slice();
        if (anonymous && userAgent.configuration.uri) {
            extraHeaders.push("P-Preferred-Identity: " + userAgent.configuration.uri.toString());
            extraHeaders.push("Privacy: id");
        }
        extraHeaders.push("Contact: " + contact);
        extraHeaders.push("Allow: " + ["ACK", "CANCEL", "INVITE", "MESSAGE", "BYE", "OPTIONS", "INFO", "NOTIFY", "REFER"].toString());
        if (userAgent.configuration.sipExtension100rel === SIPExtension.Required) {
            extraHeaders.push("Require: 100rel");
        }
        if (userAgent.configuration.sipExtensionReplaces === SIPExtension.Required) {
            extraHeaders.push("Require: replaces");
        }
        inviterOptions.extraHeaders = extraHeaders;
        // Body
        const body = undefined;
        // Make initial outgoing request message
        this.outgoingRequestMessage = userAgent.userAgentCore.makeOutgoingRequestMessage(C.INVITE, targetURI, fromURI, toURI, messageOptions, extraHeaders, body);
        // Session parent properties
        this._contact = contact;
        this._referralInviterOptions = inviterOptions;
        this._renderbody = options.renderbody;
        this._rendertype = options.rendertype;
        // Modifiers and options for initial INVITE transaction
        if (options.sessionDescriptionHandlerModifiers) {
            this.sessionDescriptionHandlerModifiers = options.sessionDescriptionHandlerModifiers;
        }
        if (options.sessionDescriptionHandlerOptions) {
            this.sessionDescriptionHandlerOptions = options.sessionDescriptionHandlerOptions;
        }
        // Modifiers and options for re-INVITE transactions
        if (options.sessionDescriptionHandlerModifiersReInvite) {
            this.sessionDescriptionHandlerModifiersReInvite = options.sessionDescriptionHandlerModifiersReInvite;
        }
        if (options.sessionDescriptionHandlerOptionsReInvite) {
            this.sessionDescriptionHandlerOptionsReInvite = options.sessionDescriptionHandlerOptionsReInvite;
        }
        // Identifier
        this._id = this.outgoingRequestMessage.callId + this.fromTag;
        // Add to the user agent's session collection.
        this.userAgent._sessions[this._id] = this;
    }
    /**
     * Destructor.
     */
    dispose() {
        // Only run through this once. It can and does get called multiple times
        // depending on the what the sessions state is when first called.
        // For example, if called when "establishing" it will be called again
        // at least once when the session transitions to "terminated".
        // Regardless, running through this more than once is pointless.
        if (this.disposed) {
            return Promise.resolve();
        }
        this.disposed = true;
        // Dispose of early dialog media
        this.disposeEarlyMedia();
        // If the final response for the initial INVITE not yet been received, cancel it
        switch (this.state) {
            case SessionState.Initial:
                return this.cancel().then(() => super.dispose());
            case SessionState.Establishing:
                return this.cancel().then(() => super.dispose());
            case SessionState.Established:
                return super.dispose();
            case SessionState.Terminating:
                return super.dispose();
            case SessionState.Terminated:
                return super.dispose();
            default:
                throw new Error("Unknown state.");
        }
    }
    /**
     * Initial outgoing INVITE request message body.
     */
    get body() {
        return this.outgoingRequestMessage.body;
    }
    /**
     * The identity of the local user.
     */
    get localIdentity() {
        return this.outgoingRequestMessage.from;
    }
    /**
     * The identity of the remote user.
     */
    get remoteIdentity() {
        return this.outgoingRequestMessage.to;
    }
    /**
     * Initial outgoing INVITE request message.
     */
    get request() {
        return this.outgoingRequestMessage;
    }
    /**
     * Cancels the INVITE request.
     *
     * @remarks
     * Sends a CANCEL request.
     * Resolves once the response sent, otherwise rejects.
     *
     * After sending a CANCEL request the expectation is that a 487 final response
     * will be received for the INVITE. However a 200 final response to the INVITE
     * may nonetheless arrive (it's a race between the CANCEL reaching the UAS before
     * the UAS sends a 200) in which case an ACK & BYE will be sent. The net effect
     * is that this method will terminate the session regardless of the race.
     * @param options - Options bucket.
     */
    cancel(options = {}) {
        this.logger.log("Inviter.cancel");
        // validate state
        if (this.state !== SessionState.Initial && this.state !== SessionState.Establishing) {
            const error = new Error(`Invalid session state ${this.state}`);
            this.logger.error(error.message);
            return Promise.reject(error);
        }
        // flag canceled
        this.isCanceled = true;
        // transition state
        this.stateTransition(SessionState.Terminating);
        // helper function
        function getCancelReason(code, reason) {
            if ((code && code < 200) || code > 699) {
                throw new TypeError("Invalid statusCode: " + code);
            }
            else if (code) {
                const cause = code;
                const text = getReasonPhrase(code) || reason;
                return "SIP;cause=" + cause + ';text="' + text + '"';
            }
        }
        if (this.outgoingInviteRequest) {
            // the CANCEL may not be respected by peer(s), so don't transition to terminated
            let cancelReason;
            if (options.statusCode && options.reasonPhrase) {
                cancelReason = getCancelReason(options.statusCode, options.reasonPhrase);
            }
            this.outgoingInviteRequest.cancel(cancelReason, options);
        }
        else {
            this.logger.warn("Canceled session before INVITE was sent");
            this.stateTransition(SessionState.Terminated);
        }
        return Promise.resolve();
    }
    /**
     * Sends the INVITE request.
     *
     * @remarks
     * TLDR...
     *  1) Only one offer/answer exchange permitted during initial INVITE.
     *  2) No "early media" if the initial offer is in an INVITE (default behavior).
     *  3) If "early media" and the initial offer is in an INVITE, no INVITE forking.
     *
     * 1) Only one offer/answer exchange permitted during initial INVITE.
     *
     * Our implementation replaces the following bullet point...
     *
     * o  After having sent or received an answer to the first offer, the
     *    UAC MAY generate subsequent offers in requests based on rules
     *    specified for that method, but only if it has received answers
     *    to any previous offers, and has not sent any offers to which it
     *    hasn't gotten an answer.
     * https://tools.ietf.org/html/rfc3261#section-13.2.1
     *
     * ...with...
     *
     * o  After having sent or received an answer to the first offer, the
     *    UAC MUST NOT generate subsequent offers in requests based on rules
     *    specified for that method.
     *
     * ...which in combination with this bullet point...
     *
     * o  Once the UAS has sent or received an answer to the initial
     *    offer, it MUST NOT generate subsequent offers in any responses
     *    to the initial INVITE.  This means that a UAS based on this
     *    specification alone can never generate subsequent offers until
     *    completion of the initial transaction.
     * https://tools.ietf.org/html/rfc3261#section-13.2.1
     *
     * ...ensures that EXACTLY ONE offer/answer exchange will occur
     * during an initial out of dialog INVITE request made by our UAC.
     *
     *
     * 2) No "early media" if the initial offer is in an INVITE (default behavior).
     *
     * While our implementation adheres to the following bullet point...
     *
     * o  If the initial offer is in an INVITE, the answer MUST be in a
     *    reliable non-failure message from UAS back to UAC which is
     *    correlated to that INVITE.  For this specification, that is
     *    only the final 2xx response to that INVITE.  That same exact
     *    answer MAY also be placed in any provisional responses sent
     *    prior to the answer.  The UAC MUST treat the first session
     *    description it receives as the answer, and MUST ignore any
     *    session descriptions in subsequent responses to the initial
     *    INVITE.
     * https://tools.ietf.org/html/rfc3261#section-13.2.1
     *
     * We have made the following implementation decision with regard to early media...
     *
     * o  If the initial offer is in the INVITE, the answer from the
     *    UAS back to the UAC will establish a media session only
     *    only after the final 2xx response to that INVITE is received.
     *
     * The reason for this decision is rooted in a restriction currently
     * inherent in WebRTC. Specifically, while a SIP INVITE request with an
     * initial offer may fork resulting in more than one provisional answer,
     * there is currently no easy/good way to to "fork" an offer generated
     * by a peer connection. In particular, a WebRTC offer currently may only
     * be matched with one answer and we have no good way to know which
     * "provisional answer" is going to be the "final answer". So we have
     * decided to punt and not create any "early media" sessions in this case.
     *
     * The upshot is that if you want "early media", you must not put the
     * initial offer in the INVITE. Instead, force the UAS to provide the
     * initial offer by sending an INVITE without an offer. In the WebRTC
     * case this allows us to create a unique peer connection with a unique
     * answer for every provisional offer with "early media" on all of them.
     *
     *
     * 3) If "early media" and the initial offer is in an INVITE, no INVITE forking.
     *
     * The default behavior may be altered and "early media" utilized if the
     * initial offer is in the an INVITE by setting the `earlyMedia` options.
     * However in that case the INVITE request MUST NOT fork. This allows for
     * "early media" in environments where the forking behavior of the SIP
     * servers being utilized is configured to disallow forking.
     */
    invite(options = {}) {
        this.logger.log("Inviter.invite");
        // validate state
        if (this.state !== SessionState.Initial) {
            // re-invite
            return super.invite(options);
        }
        // Modifiers and options for initial INVITE transaction
        if (options.sessionDescriptionHandlerModifiers) {
            this.sessionDescriptionHandlerModifiers = options.sessionDescriptionHandlerModifiers;
        }
        if (options.sessionDescriptionHandlerOptions) {
            this.sessionDescriptionHandlerOptions = options.sessionDescriptionHandlerOptions;
        }
        // just send an INVITE with no sdp...
        if (options.withoutSdp || this.inviteWithoutSdp) {
            if (this._renderbody && this._rendertype) {
                this.outgoingRequestMessage.body = { contentType: this._rendertype, body: this._renderbody };
            }
            // transition state
            this.stateTransition(SessionState.Establishing);
            return Promise.resolve(this.sendInvite(options));
        }
        // get an offer and send it in an INVITE
        const offerOptions = {
            sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
            sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
        };
        return this.getOffer(offerOptions)
            .then((body) => {
            this.outgoingRequestMessage.body = { body: body.content, contentType: body.contentType };
            // transition state
            this.stateTransition(SessionState.Establishing);
            return this.sendInvite(options);
        })
            .catch((error) => {
            this.logger.log(error.message);
            // It's possible we are already terminated,
            // so don't throw trying to transition again.
            if (this.state !== SessionState.Terminated) {
                this.stateTransition(SessionState.Terminated);
            }
            throw error;
        });
    }
    /**
     * 13.2.1 Creating the Initial INVITE
     *
     * Since the initial INVITE represents a request outside of a dialog,
     * its construction follows the procedures of Section 8.1.1.  Additional
     * processing is required for the specific case of INVITE.
     *
     * An Allow header field (Section 20.5) SHOULD be present in the INVITE.
     * It indicates what methods can be invoked within a dialog, on the UA
     * sending the INVITE, for the duration of the dialog.  For example, a
     * UA capable of receiving INFO requests within a dialog [34] SHOULD
     * include an Allow header field listing the INFO method.
     *
     * A Supported header field (Section 20.37) SHOULD be present in the
     * INVITE.  It enumerates all the extensions understood by the UAC.
     *
     * An Accept (Section 20.1) header field MAY be present in the INVITE.
     * It indicates which Content-Types are acceptable to the UA, in both
     * the response received by it, and in any subsequent requests sent to
     * it within dialogs established by the INVITE.  The Accept header field
     * is especially useful for indicating support of various session
     * description formats.
     *
     * The UAC MAY add an Expires header field (Section 20.19) to limit the
     * validity of the invitation.  If the time indicated in the Expires
     * header field is reached and no final answer for the INVITE has been
     * received, the UAC core SHOULD generate a CANCEL request for the
     * INVITE, as per Section 9.
     *
     * A UAC MAY also find it useful to add, among others, Subject (Section
     * 20.36), Organization (Section 20.25) and User-Agent (Section 20.41)
     * header fields.  They all contain information related to the INVITE.
     *
     * The UAC MAY choose to add a message body to the INVITE.  Section
     * 8.1.1.10 deals with how to construct the header fields -- Content-
     * Type among others -- needed to describe the message body.
     *
     * https://tools.ietf.org/html/rfc3261#section-13.2.1
     */
    sendInvite(options = {}) {
        //    There are special rules for message bodies that contain a session
        //    description - their corresponding Content-Disposition is "session".
        //    SIP uses an offer/answer model where one UA sends a session
        //    description, called the offer, which contains a proposed description
        //    of the session.  The offer indicates the desired communications means
        //    (audio, video, games), parameters of those means (such as codec
        //    types) and addresses for receiving media from the answerer.  The
        //    other UA responds with another session description, called the
        //    answer, which indicates which communications means are accepted, the
        //    parameters that apply to those means, and addresses for receiving
        //    media from the offerer. An offer/answer exchange is within the
        //    context of a dialog, so that if a SIP INVITE results in multiple
        //    dialogs, each is a separate offer/answer exchange.  The offer/answer
        //    model defines restrictions on when offers and answers can be made
        //    (for example, you cannot make a new offer while one is in progress).
        //    This results in restrictions on where the offers and answers can
        //    appear in SIP messages.  In this specification, offers and answers
        //    can only appear in INVITE requests and responses, and ACK.  The usage
        //    of offers and answers is further restricted.  For the initial INVITE
        //    transaction, the rules are:
        //
        //       o  The initial offer MUST be in either an INVITE or, if not there,
        //          in the first reliable non-failure message from the UAS back to
        //          the UAC.  In this specification, that is the final 2xx
        //          response.
        //
        //       o  If the initial offer is in an INVITE, the answer MUST be in a
        //          reliable non-failure message from UAS back to UAC which is
        //          correlated to that INVITE.  For this specification, that is
        //          only the final 2xx response to that INVITE.  That same exact
        //          answer MAY also be placed in any provisional responses sent
        //          prior to the answer.  The UAC MUST treat the first session
        //          description it receives as the answer, and MUST ignore any
        //          session descriptions in subsequent responses to the initial
        //          INVITE.
        //
        //       o  If the initial offer is in the first reliable non-failure
        //          message from the UAS back to UAC, the answer MUST be in the
        //          acknowledgement for that message (in this specification, ACK
        //          for a 2xx response).
        //
        //       o  After having sent or received an answer to the first offer, the
        //          UAC MAY generate subsequent offers in requests based on rules
        //          specified for that method, but only if it has received answers
        //          to any previous offers, and has not sent any offers to which it
        //          hasn't gotten an answer.
        //
        //       o  Once the UAS has sent or received an answer to the initial
        //          offer, it MUST NOT generate subsequent offers in any responses
        //          to the initial INVITE.  This means that a UAS based on this
        //          specification alone can never generate subsequent offers until
        //          completion of the initial transaction.
        //
        // https://tools.ietf.org/html/rfc3261#section-13.2.1
        // 5 The Offer/Answer Model and PRACK
        //
        //    RFC 3261 describes guidelines for the sets of messages in which
        //    offers and answers [3] can appear.  Based on those guidelines, this
        //    extension provides additional opportunities for offer/answer
        //    exchanges.
        //    If the INVITE contained an offer, the UAS MAY generate an answer in a
        //    reliable provisional response (assuming these are supported by the
        //    UAC).  That results in the establishment of the session before
        //    completion of the call.  Similarly, if a reliable provisional
        //    response is the first reliable message sent back to the UAC, and the
        //    INVITE did not contain an offer, one MUST appear in that reliable
        //    provisional response.
        //    If the UAC receives a reliable provisional response with an offer
        //    (this would occur if the UAC sent an INVITE without an offer, in
        //    which case the first reliable provisional response will contain the
        //    offer), it MUST generate an answer in the PRACK.  If the UAC receives
        //    a reliable provisional response with an answer, it MAY generate an
        //    additional offer in the PRACK.  If the UAS receives a PRACK with an
        //    offer, it MUST place the answer in the 2xx to the PRACK.
        //    Once an answer has been sent or received, the UA SHOULD establish the
        //    session based on the parameters of the offer and answer, even if the
        //    original INVITE itself has not been responded to.
        //    If the UAS had placed a session description in any reliable
        //    provisional response that is unacknowledged when the INVITE is
        //    accepted, the UAS MUST delay sending the 2xx until the provisional
        //    response is acknowledged.  Otherwise, the reliability of the 1xx
        //    cannot be guaranteed, and reliability is needed for proper operation
        //    of the offer/answer exchange.
        //    All user agents that support this extension MUST support all
        //    offer/answer exchanges that are possible based on the rules in
        //    Section 13.2 of RFC 3261, based on the existence of INVITE and PRACK
        //    as requests, and 2xx and reliable 1xx as non-failure reliable
        //    responses.
        //
        // https://tools.ietf.org/html/rfc3262#section-5
        ////
        // The Offer/Answer Model Implementation
        //
        // The offer/answer model is straight forward, but one MUST READ the specifications...
        //
        // 13.2.1 Creating the Initial INVITE (paragraph 8 in particular)
        // https://tools.ietf.org/html/rfc3261#section-13.2.1
        //
        // 5 The Offer/Answer Model and PRACK
        // https://tools.ietf.org/html/rfc3262#section-5
        //
        // Session Initiation Protocol (SIP) Usage of the Offer/Answer Model
        // https://tools.ietf.org/html/rfc6337
        ////
        ////
        // TODO: The Offer/Answer Model Implementation
        //
        // Currently if `earlyMedia` is enabled and the INVITE request forks,
        // the session is terminated if the early dialog does not match the
        // confirmed dialog. This restriction make sense in a WebRTC environment,
        // but there are other environments where this restriction does not hold.
        //
        // So while we currently cannot make the offer in INVITE+forking+webrtc
        // case work, we propose doing the following...
        //
        // OPTION 1
        // - add a `earlyMediaForking` option and
        // - require SDH.setDescription() to be callable multiple times.
        //
        // OPTION 2
        // 1) modify SDH Factory to provide an initial offer without giving us the SDH, and then...
        // 2) stick that offer in the initial INVITE, and when 183 with initial answer is received...
        // 3) ask SDH Factory if it supports "earlyRemoteAnswer"
        //   a) if true, ask SDH Factory to createSDH(localOffer).then((sdh) => sdh.setDescription(remoteAnswer)
        //   b) if false, defer getting a SDH until 2xx response is received
        //
        // Our supplied WebRTC SDH will default to behavior 3b which works in forking environment (without)
        // early media if initial offer is in the INVITE). We will, however, provide an "inviteWillNotFork"
        // option which if set to "true" will have our supplied WebRTC SDH behave in the 3a manner.
        // That will result in
        //  - early media working with initial offer in the INVITE, and...
        //  - if the INVITE forks, the session terminating with an ERROR that reads like
        //    "You set 'inviteWillNotFork' to true but the INVITE forked. You can't eat your cake, and have it too."
        //  - furthermore, we accept that users will report that error to us as "bug" regardless
        //
        // So, SDH Factory is going to end up with a new interface along the lines of...
        //
        // interface SessionDescriptionHandlerFactory {
        //   makeLocalOffer(): Promise<ContentTypeAndBody>;
        //   makeSessionDescriptionHandler(
        //     initialOffer: ContentTypeAndBody, offerType: "local" | "remote"
        //   ): Promise<SessionDescriptionHandler>;
        //   supportsEarlyRemoteAnswer: boolean;
        //   supportsContentType(contentType: string): boolean;
        //   getDescription(description: ContentTypeAndBody): Promise<ContentTypeAndBody>
        //   setDescription(description: ContentTypeAndBody): Promise<void>
        // }
        ////
        // Send the INVITE request.
        this.outgoingInviteRequest = this.userAgent.userAgentCore.invite(this.outgoingRequestMessage, {
            onAccept: (inviteResponse) => {
                // Our transaction layer is "non-standard" in that it will only
                // pass us a 2xx response once per branch, so there is no need to
                // worry about dealing with 2xx retransmissions. However, we can
                // and do still get 2xx responses for multiple branches (when an
                // INVITE is forked) which may create multiple confirmed dialogs.
                // Herein we are acking and sending a bye to any confirmed dialogs
                // which arrive beyond the first one. This is the desired behavior
                // for most applications (but certainly not all).
                // If we already received a confirmed dialog, ack & bye this additional confirmed session.
                if (this.dialog) {
                    this.logger.log("Additional confirmed dialog, sending ACK and BYE");
                    this.ackAndBye(inviteResponse);
                    // We do NOT transition state in this case (this is an "extra" dialog)
                    return;
                }
                // If the user requested cancellation, ack & bye this session.
                if (this.isCanceled) {
                    this.logger.log("Canceled session accepted, sending ACK and BYE");
                    this.ackAndBye(inviteResponse);
                    this.stateTransition(SessionState.Terminated);
                    return;
                }
                this.notifyReferer(inviteResponse);
                this.onAccept(inviteResponse)
                    .then(() => {
                    this.disposeEarlyMedia();
                })
                    .catch(() => {
                    this.disposeEarlyMedia();
                })
                    .then(() => {
                    if (options.requestDelegate && options.requestDelegate.onAccept) {
                        options.requestDelegate.onAccept(inviteResponse);
                    }
                });
            },
            onProgress: (inviteResponse) => {
                // If the user requested cancellation, ignore response.
                if (this.isCanceled) {
                    return;
                }
                this.notifyReferer(inviteResponse);
                this.onProgress(inviteResponse)
                    .catch(() => {
                    this.disposeEarlyMedia();
                })
                    .then(() => {
                    if (options.requestDelegate && options.requestDelegate.onProgress) {
                        options.requestDelegate.onProgress(inviteResponse);
                    }
                });
            },
            onRedirect: (inviteResponse) => {
                this.notifyReferer(inviteResponse);
                this.onRedirect(inviteResponse);
                if (options.requestDelegate && options.requestDelegate.onRedirect) {
                    options.requestDelegate.onRedirect(inviteResponse);
                }
            },
            onReject: (inviteResponse) => {
                this.notifyReferer(inviteResponse);
                this.onReject(inviteResponse);
                if (options.requestDelegate && options.requestDelegate.onReject) {
                    options.requestDelegate.onReject(inviteResponse);
                }
            },
            onTrying: (inviteResponse) => {
                this.notifyReferer(inviteResponse);
                this.onTrying(inviteResponse);
                if (options.requestDelegate && options.requestDelegate.onTrying) {
                    options.requestDelegate.onTrying(inviteResponse);
                }
            }
        });
        return this.outgoingInviteRequest;
    }
    disposeEarlyMedia() {
        this.earlyMediaSessionDescriptionHandlers.forEach((sessionDescriptionHandler) => {
            sessionDescriptionHandler.close();
        });
        this.earlyMediaSessionDescriptionHandlers.clear();
    }
    notifyReferer(response) {
        if (!this._referred) {
            return;
        }
        if (!(this._referred instanceof Session)) {
            throw new Error("Referred session not instance of session");
        }
        if (!this._referred.dialog) {
            return;
        }
        if (!response.message.statusCode) {
            throw new Error("Status code undefined.");
        }
        if (!response.message.reasonPhrase) {
            throw new Error("Reason phrase undefined.");
        }
        const statusCode = response.message.statusCode;
        const reasonPhrase = response.message.reasonPhrase;
        const body = `SIP/2.0 ${statusCode} ${reasonPhrase}`.trim();
        const outgoingNotifyRequest = this._referred.dialog.notify(undefined, {
            extraHeaders: ["Event: refer", "Subscription-State: terminated"],
            body: {
                contentDisposition: "render",
                contentType: "message/sipfrag",
                content: body
            }
        });
        // The implicit subscription created by a REFER is the same as a
        // subscription created with a SUBSCRIBE request.  The agent issuing the
        // REFER can terminate this subscription prematurely by unsubscribing
        // using the mechanisms described in [2].  Terminating a subscription,
        // either by explicitly unsubscribing or rejecting NOTIFY, is not an
        // indication that the referenced request should be withdrawn or
        // abandoned.
        // https://tools.ietf.org/html/rfc3515#section-2.4.4
        // FIXME: TODO: This should be done in a subscribe dialog to satisfy the above.
        // If the notify is rejected, stop sending NOTIFY requests.
        outgoingNotifyRequest.delegate = {
            onReject: () => {
                this._referred = undefined;
            }
        };
    }
    /**
     * Handle final response to initial INVITE.
     * @param inviteResponse - 2xx response.
     */
    onAccept(inviteResponse) {
        this.logger.log("Inviter.onAccept");
        // validate state
        if (this.state !== SessionState.Establishing) {
            this.logger.error(`Accept received while in state ${this.state}, dropping response`);
            return Promise.reject(new Error(`Invalid session state ${this.state}`));
        }
        const response = inviteResponse.message;
        const session = inviteResponse.session;
        // Ported behavior.
        if (response.hasHeader("P-Asserted-Identity")) {
            this._assertedIdentity = Grammar.nameAddrHeaderParse(response.getHeader("P-Asserted-Identity"));
        }
        // We have a confirmed dialog.
        session.delegate = {
            onAck: (ackRequest) => this.onAckRequest(ackRequest),
            onBye: (byeRequest) => this.onByeRequest(byeRequest),
            onInfo: (infoRequest) => this.onInfoRequest(infoRequest),
            onInvite: (inviteRequest) => this.onInviteRequest(inviteRequest),
            onMessage: (messageRequest) => this.onMessageRequest(messageRequest),
            onNotify: (notifyRequest) => this.onNotifyRequest(notifyRequest),
            onPrack: (prackRequest) => this.onPrackRequest(prackRequest),
            onRefer: (referRequest) => this.onReferRequest(referRequest)
        };
        this._dialog = session;
        switch (session.signalingState) {
            case SignalingState.Initial:
                // INVITE without offer, so MUST have offer at this point, so invalid state.
                this.logger.error("Received 2xx response to INVITE without a session description");
                this.ackAndBye(inviteResponse, 400, "Missing session description");
                this.stateTransition(SessionState.Terminated);
                return Promise.reject(new Error("Bad Media Description"));
            case SignalingState.HaveLocalOffer:
                // INVITE with offer, so MUST have answer at this point, so invalid state.
                this.logger.error("Received 2xx response to INVITE without a session description");
                this.ackAndBye(inviteResponse, 400, "Missing session description");
                this.stateTransition(SessionState.Terminated);
                return Promise.reject(new Error("Bad Media Description"));
            case SignalingState.HaveRemoteOffer: {
                // INVITE without offer, received offer in 2xx, so MUST send answer in ACK.
                if (!this._dialog.offer) {
                    throw new Error(`Session offer undefined in signaling state ${this._dialog.signalingState}.`);
                }
                const options = {
                    sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
                    sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
                };
                return this.setOfferAndGetAnswer(this._dialog.offer, options)
                    .then((body) => {
                    inviteResponse.ack({ body });
                    this.stateTransition(SessionState.Established);
                })
                    .catch((error) => {
                    this.ackAndBye(inviteResponse, 488, "Invalid session description");
                    this.stateTransition(SessionState.Terminated);
                    throw error;
                });
            }
            case SignalingState.Stable: {
                // If INVITE without offer and we have already completed the initial exchange.
                if (this.earlyMediaSessionDescriptionHandlers.size > 0) {
                    const sdh = this.earlyMediaSessionDescriptionHandlers.get(session.id);
                    if (!sdh) {
                        throw new Error("Session description handler undefined.");
                    }
                    this.setSessionDescriptionHandler(sdh);
                    this.earlyMediaSessionDescriptionHandlers.delete(session.id);
                    inviteResponse.ack();
                    this.stateTransition(SessionState.Established);
                    return Promise.resolve();
                }
                // If INVITE with offer and we used an "early" answer in a provisional response for media
                if (this.earlyMediaDialog) {
                    // If early media dialog doesn't match confirmed dialog, we must unfortunately fail.
                    // This limitation stems from how WebRTC currently implements its offer/answer model.
                    // There are details elsewhere, but in short a WebRTC offer cannot be forked.
                    if (this.earlyMediaDialog !== session) {
                        if (this.earlyMedia) {
                            const message = "You have set the 'earlyMedia' option to 'true' which requires that your INVITE requests " +
                                "do not fork and yet this INVITE request did in fact fork. Consequentially and not surprisingly " +
                                "the end point which accepted the INVITE (confirmed dialog) does not match the end point with " +
                                "which early media has been setup (early dialog) and thus this session is unable to proceed. " +
                                "In accordance with the SIP specifications, the SIP servers your end point is connected to " +
                                "determine if an INVITE forks and the forking behavior of those servers cannot be controlled " +
                                "by this library. If you wish to use early media with this library you must configure those " +
                                "servers accordingly. Alternatively you may set the 'earlyMedia' to 'false' which will allow " +
                                "this library to function with any INVITE requests which do fork.";
                            this.logger.error(message);
                        }
                        const error = new Error("Early media dialog does not equal confirmed dialog, terminating session");
                        this.logger.error(error.message);
                        this.ackAndBye(inviteResponse, 488, "Not Acceptable Here");
                        this.stateTransition(SessionState.Terminated);
                        return Promise.reject(error);
                    }
                    // Otherwise we are good to go.
                    inviteResponse.ack();
                    this.stateTransition(SessionState.Established);
                    return Promise.resolve();
                }
                // If INVITE with offer and we have been waiting till now to apply the answer.
                const answer = session.answer;
                if (!answer) {
                    throw new Error("Answer is undefined.");
                }
                const options = {
                    sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
                    sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
                };
                return this.setAnswer(answer, options)
                    .then(() => {
                    // This session has completed an initial offer/answer exchange...
                    let ackOptions;
                    if (this._renderbody && this._rendertype) {
                        ackOptions = {
                            body: { contentDisposition: "render", contentType: this._rendertype, content: this._renderbody }
                        };
                    }
                    inviteResponse.ack(ackOptions);
                    this.stateTransition(SessionState.Established);
                })
                    .catch((error) => {
                    this.logger.error(error.message);
                    this.ackAndBye(inviteResponse, 488, "Not Acceptable Here");
                    this.stateTransition(SessionState.Terminated);
                    throw error;
                });
            }
            case SignalingState.Closed:
                // Dialog has terminated.
                return Promise.reject(new Error("Terminated."));
            default:
                throw new Error("Unknown session signaling state.");
        }
    }
    /**
     * Handle provisional response to initial INVITE.
     * @param inviteResponse - 1xx response.
     */
    onProgress(inviteResponse) {
        var _a;
        this.logger.log("Inviter.onProgress");
        // validate state
        if (this.state !== SessionState.Establishing) {
            this.logger.error(`Progress received while in state ${this.state}, dropping response`);
            return Promise.reject(new Error(`Invalid session state ${this.state}`));
        }
        if (!this.outgoingInviteRequest) {
            throw new Error("Outgoing INVITE request undefined.");
        }
        const response = inviteResponse.message;
        const session = inviteResponse.session;
        // Ported - Set assertedIdentity.
        if (response.hasHeader("P-Asserted-Identity")) {
            this._assertedIdentity = Grammar.nameAddrHeaderParse(response.getHeader("P-Asserted-Identity"));
        }
        // If a provisional response is received for an initial request, and
        // that response contains a Require header field containing the option
        // tag 100rel, the response is to be sent reliably.  If the response is
        // a 100 (Trying) (as opposed to 101 to 199), this option tag MUST be
        // ignored, and the procedures below MUST NOT be used.
        // https://tools.ietf.org/html/rfc3262#section-4
        const requireHeader = response.getHeader("require");
        const rseqHeader = response.getHeader("rseq");
        const rseq = requireHeader && requireHeader.includes("100rel") && rseqHeader ? Number(rseqHeader) : undefined;
        const responseReliable = !!rseq;
        const extraHeaders = [];
        if (responseReliable) {
            extraHeaders.push("RAck: " + response.getHeader("rseq") + " " + response.getHeader("cseq"));
        }
        switch (session.signalingState) {
            case SignalingState.Initial:
                // INVITE without offer and session still has no offer (and no answer).
                if (responseReliable) {
                    // Similarly, if a reliable provisional
                    // response is the first reliable message sent back to the UAC, and the
                    // INVITE did not contain an offer, one MUST appear in that reliable
                    // provisional response.
                    // https://tools.ietf.org/html/rfc3262#section-5
                    this.logger.warn("First reliable provisional response received MUST contain an offer when INVITE does not contain an offer.");
                    // FIXME: Known popular UA's currently end up here...
                    inviteResponse.prack({ extraHeaders });
                }
                return Promise.resolve();
            case SignalingState.HaveLocalOffer:
                // INVITE with offer and session only has that initial local offer.
                if (responseReliable) {
                    inviteResponse.prack({ extraHeaders });
                }
                return Promise.resolve();
            case SignalingState.HaveRemoteOffer:
                if (!responseReliable) {
                    // The initial offer MUST be in either an INVITE or, if not there,
                    // in the first reliable non-failure message from the UAS back to
                    // the UAC.
                    // https://tools.ietf.org/html/rfc3261#section-13.2.1
                    // According to Section 13.2.1 of [RFC3261], 'The first reliable
                    // non-failure message' must have an offer if there is no offer in the
                    // INVITE request.  This means that the User Agent (UA) that receives
                    // the INVITE request without an offer must include an offer in the
                    // first reliable response with 100rel extension.  If no reliable
                    // provisional response has been sent, the User Agent Server (UAS) must
                    // include an offer when sending 2xx response.
                    // https://tools.ietf.org/html/rfc6337#section-2.2
                    this.logger.warn("Non-reliable provisional response MUST NOT contain an initial offer, discarding response.");
                    return Promise.resolve();
                }
                {
                    // If the initial offer is in the first reliable non-failure
                    // message from the UAS back to UAC, the answer MUST be in the
                    // acknowledgement for that message
                    const sdh = this.sessionDescriptionHandlerFactory(this, this.userAgent.configuration.sessionDescriptionHandlerFactoryOptions || {});
                    if ((_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onSessionDescriptionHandler) {
                        this.delegate.onSessionDescriptionHandler(sdh, true);
                    }
                    this.earlyMediaSessionDescriptionHandlers.set(session.id, sdh);
                    return sdh
                        .setDescription(response.body, this.sessionDescriptionHandlerOptions, this.sessionDescriptionHandlerModifiers)
                        .then(() => sdh.getDescription(this.sessionDescriptionHandlerOptions, this.sessionDescriptionHandlerModifiers))
                        .then((description) => {
                        const body = {
                            contentDisposition: "session",
                            contentType: description.contentType,
                            content: description.body
                        };
                        inviteResponse.prack({ extraHeaders, body });
                    })
                        .catch((error) => {
                        this.stateTransition(SessionState.Terminated);
                        throw error;
                    });
                }
            case SignalingState.Stable:
                // This session has completed an initial offer/answer exchange, so...
                // - INVITE with SDP and this provisional response MAY be reliable
                // - INVITE without SDP and this provisional response MAY be reliable
                if (responseReliable) {
                    inviteResponse.prack({ extraHeaders });
                }
                if (this.earlyMedia && !this.earlyMediaDialog) {
                    this.earlyMediaDialog = session;
                    const answer = session.answer;
                    if (!answer) {
                        throw new Error("Answer is undefined.");
                    }
                    const options = {
                        sessionDescriptionHandlerModifiers: this.sessionDescriptionHandlerModifiers,
                        sessionDescriptionHandlerOptions: this.sessionDescriptionHandlerOptions
                    };
                    return this.setAnswer(answer, options).catch((error) => {
                        this.stateTransition(SessionState.Terminated);
                        throw error;
                    });
                }
                return Promise.resolve();
            case SignalingState.Closed:
                // Dialog has terminated.
                return Promise.reject(new Error("Terminated."));
            default:
                throw new Error("Unknown session signaling state.");
        }
    }
    /**
     * Handle final response to initial INVITE.
     * @param inviteResponse - 3xx response.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onRedirect(inviteResponse) {
        this.logger.log("Inviter.onRedirect");
        // validate state
        if (this.state !== SessionState.Establishing && this.state !== SessionState.Terminating) {
            this.logger.error(`Redirect received while in state ${this.state}, dropping response`);
            return;
        }
        // transition state
        this.stateTransition(SessionState.Terminated);
    }
    /**
     * Handle final response to initial INVITE.
     * @param inviteResponse - 4xx, 5xx, or 6xx response.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onReject(inviteResponse) {
        this.logger.log("Inviter.onReject");
        // validate state
        if (this.state !== SessionState.Establishing && this.state !== SessionState.Terminating) {
            this.logger.error(`Reject received while in state ${this.state}, dropping response`);
            return;
        }
        // transition state
        this.stateTransition(SessionState.Terminated);
    }
    /**
     * Handle final response to initial INVITE.
     * @param inviteResponse - 100 response.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onTrying(inviteResponse) {
        this.logger.log("Inviter.onTrying");
        // validate state
        if (this.state !== SessionState.Establishing) {
            this.logger.error(`Trying received while in state ${this.state}, dropping response`);
            return;
        }
    }
}

/**
 * {@link Registerer} state.
 * @remarks
 * The {@link Registerer} behaves in a deterministic manner according to the following
 * Finite State Machine (FSM).
 * ```txt
 *                   __________________________________________
 *                  |  __________________________              |
 * Registerer       | |                          v             v
 * Constructed -> Initial -> Registered -> Unregistered -> Terminated
 *                              |   ^____________|             ^
 *                              |______________________________|
 * ```
 * @public
 */
var RegistererState;
(function (RegistererState) {
    RegistererState["Initial"] = "Initial";
    RegistererState["Registered"] = "Registered";
    RegistererState["Unregistered"] = "Unregistered";
    RegistererState["Terminated"] = "Terminated";
})(RegistererState = RegistererState || (RegistererState = {}));

/**
 * A registerer registers a contact for an address of record (outgoing REGISTER).
 * @public
 */
class Registerer {
    /**
     * Constructs a new instance of the `Registerer` class.
     * @param userAgent - User agent. See {@link UserAgent} for details.
     * @param options - Options bucket. See {@link RegistererOptions} for details.
     */
    constructor(userAgent, options = {}) {
        this.disposed = false;
        /** The contacts returned from the most recent accepted REGISTER request. */
        this._contacts = [];
        /** The number of seconds to wait before retrying to register. */
        this._retryAfter = undefined;
        /** The registration state. */
        this._state = RegistererState.Initial;
        /** True is waiting for final response to outstanding REGISTER request. */
        this._waiting = false;
        // state emitter
        this._stateEventEmitter = new EmitterImpl();
        // waiting emitter
        this._waitingEventEmitter = new EmitterImpl();
        // Set user agent
        this.userAgent = userAgent;
        // Default registrar is domain portion of user agent uri
        const defaultUserAgentRegistrar = userAgent.configuration.uri.clone();
        defaultUserAgentRegistrar.user = undefined;
        // Initialize configuration
        this.options = Object.assign(Object.assign(Object.assign({}, Registerer.defaultOptions()), { registrar: defaultUserAgentRegistrar }), Registerer.stripUndefinedProperties(options));
        // Make sure we are not using references to array options
        this.options.extraContactHeaderParams = (this.options.extraContactHeaderParams || []).slice();
        this.options.extraHeaders = (this.options.extraHeaders || []).slice();
        // Make sure we are not using references to registrar uri
        if (!this.options.registrar) {
            throw new Error("Registrar undefined.");
        }
        this.options.registrar = this.options.registrar.clone();
        // Set instanceId and regId conditional defaults and validate
        if (this.options.regId && !this.options.instanceId) {
            this.options.instanceId = this.userAgent.instanceId;
        }
        else if (!this.options.regId && this.options.instanceId) {
            this.options.regId = 1;
        }
        if (this.options.instanceId && Grammar.parse(this.options.instanceId, "uuid") === -1) {
            throw new Error("Invalid instanceId.");
        }
        if (this.options.regId && this.options.regId < 0) {
            throw new Error("Invalid regId.");
        }
        const registrar = this.options.registrar;
        const fromURI = (this.options.params && this.options.params.fromUri) || userAgent.userAgentCore.configuration.aor;
        const toURI = (this.options.params && this.options.params.toUri) || userAgent.configuration.uri;
        const params = this.options.params || {};
        const extraHeaders = (options.extraHeaders || []).slice();
        // Build the request
        this.request = userAgent.userAgentCore.makeOutgoingRequestMessage(C.REGISTER, registrar, fromURI, toURI, params, extraHeaders, undefined);
        // Registration expires
        this.expires = this.options.expires || Registerer.defaultExpires;
        if (this.expires < 0) {
            throw new Error("Invalid expires.");
        }
        // Interval at which re-REGISTER requests are sent
        this.refreshFrequency = this.options.refreshFrequency || Registerer.defaultRefreshFrequency;
        if (this.refreshFrequency < 50 || this.refreshFrequency > 99) {
            throw new Error("Invalid refresh frequency. The value represents a percentage of the expiration time and should be between 50 and 99.");
        }
        // initialize logger
        this.logger = userAgent.getLogger("sip.Registerer");
        if (this.options.logConfiguration) {
            this.logger.log("Configuration:");
            Object.keys(this.options).forEach((key) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const value = this.options[key];
                switch (key) {
                    case "registrar":
                        this.logger.log("· " + key + ": " + value);
                        break;
                    default:
                        this.logger.log("· " + key + ": " + JSON.stringify(value));
                }
            });
        }
        // Identifier
        this.id = this.request.callId + this.request.from.parameters.tag;
        // Add to the user agent's session collection.
        this.userAgent._registerers[this.id] = this;
    }
    /** Default registerer options. */
    static defaultOptions() {
        return {
            expires: Registerer.defaultExpires,
            extraContactHeaderParams: [],
            extraHeaders: [],
            logConfiguration: true,
            instanceId: "",
            params: {},
            regId: 0,
            registrar: new URI("sip", "anonymous", "anonymous.invalid"),
            refreshFrequency: Registerer.defaultRefreshFrequency
        };
    }
    /**
     * Strip properties with undefined values from options.
     * This is a work around while waiting for missing vs undefined to be addressed (or not)...
     * https://github.com/Microsoft/TypeScript/issues/13195
     * @param options - Options to reduce
     */
    static stripUndefinedProperties(options) {
        return Object.keys(options).reduce((object, key) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (options[key] !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                object[key] = options[key];
            }
            return object;
        }, {});
    }
    /** The registered contacts. */
    get contacts() {
        return this._contacts.slice();
    }
    /**
     * The number of seconds to wait before retrying to register.
     * @defaultValue `undefined`
     * @remarks
     * When the server rejects a registration request, if it provides a suggested
     * duration to wait before retrying, that value is available here when and if
     * the state transitions to `Unsubscribed`. It is also available during the
     * callback to `onReject` after a call to `register`. (Note that if the state
     * if already `Unsubscribed`, a rejected request created by `register` will
     * not cause the state to transition to `Unsubscribed`. One way to avoid this
     * case is to dispose of `Registerer` when unregistered and create a new
     * `Registerer` for any attempts to retry registering.)
     * @example
     * ```ts
     * // Checking for retry after on state change
     * registerer.stateChange.addListener((newState) => {
     *   switch (newState) {
     *     case RegistererState.Unregistered:
     *       const retryAfter = registerer.retryAfter;
     *       break;
     *   }
     * });
     *
     * // Checking for retry after on request rejection
     * registerer.register({
     *   requestDelegate: {
     *     onReject: () => {
     *       const retryAfter = registerer.retryAfter;
     *     }
     *   }
     * });
     * ```
     */
    get retryAfter() {
        return this._retryAfter;
    }
    /** The registration state. */
    get state() {
        return this._state;
    }
    /** Emits when the registerer state changes. */
    get stateChange() {
        return this._stateEventEmitter;
    }
    /** Destructor. */
    dispose() {
        if (this.disposed) {
            return Promise.resolve();
        }
        this.disposed = true;
        this.logger.log(`Registerer ${this.id} in state ${this.state} is being disposed`);
        // Remove from the user agent's registerer collection
        delete this.userAgent._registerers[this.id];
        // If registered, unregisters and resolves after final response received.
        return new Promise((resolve) => {
            const doClose = () => {
                // If we are registered, unregister and resolve after our state changes
                if (!this.waiting && this._state === RegistererState.Registered) {
                    this.stateChange.addListener(() => {
                        this.terminated();
                        resolve();
                    }, { once: true });
                    this.unregister();
                    return;
                }
                // Otherwise just resolve
                this.terminated();
                resolve();
            };
            // If we are waiting for an outstanding request, wait for it to finish and then try closing.
            // Otherwise just try closing.
            if (this.waiting) {
                this.waitingChange.addListener(() => {
                    doClose();
                }, { once: true });
            }
            else {
                doClose();
            }
        });
    }
    /**
     * Sends the REGISTER request.
     * @remarks
     * If successful, sends re-REGISTER requests prior to registration expiration until `unsubscribe()` is called.
     * Rejects with `RequestPendingError` if a REGISTER request is already in progress.
     */
    register(options = {}) {
        if (this.state === RegistererState.Terminated) {
            this.stateError();
            throw new Error("Registerer terminated. Unable to register.");
        }
        if (this.disposed) {
            this.stateError();
            throw new Error("Registerer disposed. Unable to register.");
        }
        // UAs MUST NOT send a new registration (that is, containing new Contact
        // header field values, as opposed to a retransmission) until they have
        // received a final response from the registrar for the previous one or
        // the previous REGISTER request has timed out.
        // https://tools.ietf.org/html/rfc3261#section-10.2
        if (this.waiting) {
            this.waitingWarning();
            const error = new RequestPendingError("REGISTER request already in progress, waiting for final response");
            return Promise.reject(error);
        }
        // Options
        if (options.requestOptions) {
            this.options = Object.assign(Object.assign({}, this.options), options.requestOptions);
        }
        // Extra headers
        const extraHeaders = (this.options.extraHeaders || []).slice();
        extraHeaders.push("Contact: " + this.generateContactHeader(this.expires));
        // this is UA.C.ALLOWED_METHODS, removed to get around circular dependency
        extraHeaders.push("Allow: " + ["ACK", "CANCEL", "INVITE", "MESSAGE", "BYE", "OPTIONS", "INFO", "NOTIFY", "REFER"].toString());
        // Call-ID: All registrations from a UAC SHOULD use the same Call-ID
        // header field value for registrations sent to a particular
        // registrar.
        //
        // CSeq: The CSeq value guarantees proper ordering of REGISTER
        // requests.  A UA MUST increment the CSeq value by one for each
        // REGISTER request with the same Call-ID.
        // https://tools.ietf.org/html/rfc3261#section-10.2
        this.request.cseq++;
        this.request.setHeader("cseq", this.request.cseq + " REGISTER");
        this.request.extraHeaders = extraHeaders;
        this.waitingToggle(true);
        const outgoingRegisterRequest = this.userAgent.userAgentCore.register(this.request, {
            onAccept: (response) => {
                let expires;
                // FIXME: This does NOT appear to be to spec and should be removed.
                // I haven't found anywhere that an Expires header may be used in a response.
                if (response.message.hasHeader("expires")) {
                    expires = Number(response.message.getHeader("expires"));
                }
                // 8. The registrar returns a 200 (OK) response.  The response MUST
                // contain Contact header field values enumerating all current
                // bindings.  Each Contact value MUST feature an "expires"
                // parameter indicating its expiration interval chosen by the
                // registrar.  The response SHOULD include a Date header field.
                // https://tools.ietf.org/html/rfc3261#section-10.3
                this._contacts = response.message.getHeaders("contact");
                let contacts = this._contacts.length;
                if (!contacts) {
                    this.logger.error("No Contact header in response to REGISTER, dropping response.");
                    this.unregistered();
                    return;
                }
                // The 200 (OK) response from the registrar contains a list of Contact
                // fields enumerating all current bindings.  The UA compares each
                // contact address to see if it created the contact address, using
                // comparison rules in Section 19.1.4.  If so, it updates the expiration
                // time interval according to the expires parameter or, if absent, the
                // Expires field value.  The UA then issues a REGISTER request for each
                // of its bindings before the expiration interval has elapsed.
                // https://tools.ietf.org/html/rfc3261#section-10.2.4
                let contact;
                while (contacts--) {
                    contact = response.message.parseHeader("contact", contacts);
                    if (!contact) {
                        throw new Error("Contact undefined");
                    }
                    if (this.userAgent.contact.pubGruu && equivalentURI(contact.uri, this.userAgent.contact.pubGruu)) {
                        expires = Number(contact.getParam("expires"));
                        break;
                    }
                    // If we are using a randomly generated user name (which is the default behavior)
                    if (this.userAgent.configuration.contactName === "") {
                        // compare the user portion of the URI under the assumption that it will be unique
                        if (contact.uri.user === this.userAgent.contact.uri.user) {
                            expires = Number(contact.getParam("expires"));
                            break;
                        }
                    }
                    else {
                        // otherwise use comparision rules in Section 19.1.4
                        if (equivalentURI(contact.uri, this.userAgent.contact.uri)) {
                            expires = Number(contact.getParam("expires"));
                            break;
                        }
                    }
                    contact = undefined;
                }
                // There must be a matching contact.
                if (contact === undefined) {
                    this.logger.error("No Contact header pointing to us, dropping response");
                    this.unregistered();
                    this.waitingToggle(false);
                    return;
                }
                // The contact must have an expires.
                if (expires === undefined) {
                    this.logger.error("Contact pointing to us is missing expires parameter, dropping response");
                    this.unregistered();
                    this.waitingToggle(false);
                    return;
                }
                // Save gruu values
                if (contact.hasParam("temp-gruu")) {
                    const gruu = contact.getParam("temp-gruu");
                    if (gruu) {
                        this.userAgent.contact.tempGruu = Grammar.URIParse(gruu.replace(/"/g, ""));
                    }
                }
                if (contact.hasParam("pub-gruu")) {
                    const gruu = contact.getParam("pub-gruu");
                    if (gruu) {
                        this.userAgent.contact.pubGruu = Grammar.URIParse(gruu.replace(/"/g, ""));
                    }
                }
                this.registered(expires);
                if (options.requestDelegate && options.requestDelegate.onAccept) {
                    options.requestDelegate.onAccept(response);
                }
                this.waitingToggle(false);
            },
            onProgress: (response) => {
                if (options.requestDelegate && options.requestDelegate.onProgress) {
                    options.requestDelegate.onProgress(response);
                }
            },
            onRedirect: (response) => {
                this.logger.error("Redirect received. Not supported.");
                this.unregistered();
                if (options.requestDelegate && options.requestDelegate.onRedirect) {
                    options.requestDelegate.onRedirect(response);
                }
                this.waitingToggle(false);
            },
            onReject: (response) => {
                if (response.message.statusCode === 423) {
                    // If a UA receives a 423 (Interval Too Brief) response, it MAY retry
                    // the registration after making the expiration interval of all contact
                    // addresses in the REGISTER request equal to or greater than the
                    // expiration interval within the Min-Expires header field of the 423
                    // (Interval Too Brief) response.
                    // https://tools.ietf.org/html/rfc3261#section-10.2.8
                    //
                    // The registrar MAY choose an expiration less than the requested
                    // expiration interval.  If and only if the requested expiration
                    // interval is greater than zero AND smaller than one hour AND
                    // less than a registrar-configured minimum, the registrar MAY
                    // reject the registration with a response of 423 (Interval Too
                    // Brief).  This response MUST contain a Min-Expires header field
                    // that states the minimum expiration interval the registrar is
                    // willing to honor.  It then skips the remaining steps.
                    // https://tools.ietf.org/html/rfc3261#section-10.3
                    if (!response.message.hasHeader("min-expires")) {
                        // This response MUST contain a Min-Expires header field
                        this.logger.error("423 response received for REGISTER without Min-Expires, dropping response");
                        this.unregistered();
                        this.waitingToggle(false);
                        return;
                    }
                    // Increase our registration interval to the suggested minimum
                    this.expires = Number(response.message.getHeader("min-expires"));
                    // Attempt the registration again immediately
                    this.waitingToggle(false);
                    this.register();
                    return;
                }
                this.logger.warn(`Failed to register, status code ${response.message.statusCode}`);
                // The Retry-After header field can be used with a 500 (Server Internal
                // Error) or 503 (Service Unavailable) response to indicate how long the
                // service is expected to be unavailable to the requesting client...
                // https://tools.ietf.org/html/rfc3261#section-20.33
                let retryAfterDuration = NaN;
                if (response.message.statusCode === 500 || response.message.statusCode === 503) {
                    const header = response.message.getHeader("retry-after");
                    if (header) {
                        retryAfterDuration = Number.parseInt(header, undefined);
                    }
                }
                // Set for the state change (if any) and the delegate callback (if any)
                this._retryAfter = isNaN(retryAfterDuration) ? undefined : retryAfterDuration;
                this.unregistered();
                if (options.requestDelegate && options.requestDelegate.onReject) {
                    options.requestDelegate.onReject(response);
                }
                this._retryAfter = undefined;
                this.waitingToggle(false);
            },
            onTrying: (response) => {
                if (options.requestDelegate && options.requestDelegate.onTrying) {
                    options.requestDelegate.onTrying(response);
                }
            }
        });
        return Promise.resolve(outgoingRegisterRequest);
    }
    /**
     * Sends the REGISTER request with expires equal to zero.
     * @remarks
     * Rejects with `RequestPendingError` if a REGISTER request is already in progress.
     */
    unregister(options = {}) {
        if (this.state === RegistererState.Terminated) {
            this.stateError();
            throw new Error("Registerer terminated. Unable to register.");
        }
        if (this.disposed) {
            if (this.state !== RegistererState.Registered) {
                // allows unregister while disposing and registered
                this.stateError();
                throw new Error("Registerer disposed. Unable to register.");
            }
        }
        // UAs MUST NOT send a new registration (that is, containing new Contact
        // header field values, as opposed to a retransmission) until they have
        // received a final response from the registrar for the previous one or
        // the previous REGISTER request has timed out.
        // https://tools.ietf.org/html/rfc3261#section-10.2
        if (this.waiting) {
            this.waitingWarning();
            const error = new RequestPendingError("REGISTER request already in progress, waiting for final response");
            return Promise.reject(error);
        }
        if (this._state !== RegistererState.Registered && !options.all) {
            this.logger.warn("Not currently registered, but sending an unregister anyway.");
        }
        // Extra headers
        const extraHeaders = ((options.requestOptions && options.requestOptions.extraHeaders) || []).slice();
        this.request.extraHeaders = extraHeaders;
        // Registrations are soft state and expire unless refreshed, but can
        // also be explicitly removed.  A client can attempt to influence the
        // expiration interval selected by the registrar as described in Section
        // 10.2.1.  A UA requests the immediate removal of a binding by
        // specifying an expiration interval of "0" for that contact address in
        // a REGISTER request.  UAs SHOULD support this mechanism so that
        // bindings can be removed before their expiration interval has passed.
        //
        // The REGISTER-specific Contact header field value of "*" applies to
        // all registrations, but it MUST NOT be used unless the Expires header
        // field is present with a value of "0".
        // https://tools.ietf.org/html/rfc3261#section-10.2.2
        if (options.all) {
            extraHeaders.push("Contact: *");
            extraHeaders.push("Expires: 0");
        }
        else {
            extraHeaders.push("Contact: " + this.generateContactHeader(0));
        }
        // Call-ID: All registrations from a UAC SHOULD use the same Call-ID
        // header field value for registrations sent to a particular
        // registrar.
        //
        // CSeq: The CSeq value guarantees proper ordering of REGISTER
        // requests.  A UA MUST increment the CSeq value by one for each
        // REGISTER request with the same Call-ID.
        // https://tools.ietf.org/html/rfc3261#section-10.2
        this.request.cseq++;
        this.request.setHeader("cseq", this.request.cseq + " REGISTER");
        // Pre-emptive clear the registration timer to avoid a race condition where
        // this timer fires while waiting for a final response to the unsubscribe.
        if (this.registrationTimer !== undefined) {
            clearTimeout(this.registrationTimer);
            this.registrationTimer = undefined;
        }
        this.waitingToggle(true);
        const outgoingRegisterRequest = this.userAgent.userAgentCore.register(this.request, {
            onAccept: (response) => {
                this._contacts = response.message.getHeaders("contact"); // Update contacts
                this.unregistered();
                if (options.requestDelegate && options.requestDelegate.onAccept) {
                    options.requestDelegate.onAccept(response);
                }
                this.waitingToggle(false);
            },
            onProgress: (response) => {
                if (options.requestDelegate && options.requestDelegate.onProgress) {
                    options.requestDelegate.onProgress(response);
                }
            },
            onRedirect: (response) => {
                this.logger.error("Unregister redirected. Not currently supported.");
                this.unregistered();
                if (options.requestDelegate && options.requestDelegate.onRedirect) {
                    options.requestDelegate.onRedirect(response);
                }
                this.waitingToggle(false);
            },
            onReject: (response) => {
                this.logger.error(`Unregister rejected with status code ${response.message.statusCode}`);
                this.unregistered();
                if (options.requestDelegate && options.requestDelegate.onReject) {
                    options.requestDelegate.onReject(response);
                }
                this.waitingToggle(false);
            },
            onTrying: (response) => {
                if (options.requestDelegate && options.requestDelegate.onTrying) {
                    options.requestDelegate.onTrying(response);
                }
            }
        });
        return Promise.resolve(outgoingRegisterRequest);
    }
    /**
     * Clear registration timers.
     */
    clearTimers() {
        if (this.registrationTimer !== undefined) {
            clearTimeout(this.registrationTimer);
            this.registrationTimer = undefined;
        }
        if (this.registrationExpiredTimer !== undefined) {
            clearTimeout(this.registrationExpiredTimer);
            this.registrationExpiredTimer = undefined;
        }
    }
    /**
     * Generate Contact Header
     */
    generateContactHeader(expires) {
        let contact = this.userAgent.contact.toString({ register: true });
        if (this.options.regId && this.options.instanceId) {
            contact += ";reg-id=" + this.options.regId;
            contact += ';+sip.instance="<urn:uuid:' + this.options.instanceId + '>"';
        }
        if (this.options.extraContactHeaderParams) {
            this.options.extraContactHeaderParams.forEach((header) => {
                contact += ";" + header;
            });
        }
        contact += ";expires=" + expires;
        return contact;
    }
    /**
     * Helper function, called when registered.
     */
    registered(expires) {
        this.clearTimers();
        // Re-Register before the expiration interval has elapsed.
        // For that, calculate the delay as a percentage of the expiration time
        this.registrationTimer = setTimeout(() => {
            this.registrationTimer = undefined;
            this.register();
        }, (this.refreshFrequency / 100) * expires * 1000);
        // We are unregistered if the registration expires.
        this.registrationExpiredTimer = setTimeout(() => {
            this.logger.warn("Registration expired");
            this.unregistered();
        }, expires * 1000);
        if (this._state !== RegistererState.Registered) {
            this.stateTransition(RegistererState.Registered);
        }
    }
    /**
     * Helper function, called when unregistered.
     */
    unregistered() {
        this.clearTimers();
        if (this._state !== RegistererState.Unregistered) {
            this.stateTransition(RegistererState.Unregistered);
        }
    }
    /**
     * Helper function, called when terminated.
     */
    terminated() {
        this.clearTimers();
        if (this._state !== RegistererState.Terminated) {
            this.stateTransition(RegistererState.Terminated);
        }
    }
    /**
     * Transition registration state.
     */
    stateTransition(newState) {
        const invalidTransition = () => {
            throw new Error(`Invalid state transition from ${this._state} to ${newState}`);
        };
        // Validate transition
        switch (this._state) {
            case RegistererState.Initial:
                if (newState !== RegistererState.Registered &&
                    newState !== RegistererState.Unregistered &&
                    newState !== RegistererState.Terminated) {
                    invalidTransition();
                }
                break;
            case RegistererState.Registered:
                if (newState !== RegistererState.Unregistered && newState !== RegistererState.Terminated) {
                    invalidTransition();
                }
                break;
            case RegistererState.Unregistered:
                if (newState !== RegistererState.Registered && newState !== RegistererState.Terminated) {
                    invalidTransition();
                }
                break;
            case RegistererState.Terminated:
                invalidTransition();
                break;
            default:
                throw new Error("Unrecognized state.");
        }
        // Transition
        this._state = newState;
        this.logger.log(`Registration transitioned to state ${this._state}`);
        this._stateEventEmitter.emit(this._state);
        // Dispose
        if (newState === RegistererState.Terminated) {
            this.dispose();
        }
    }
    /** True if the registerer is currently waiting for final response to a REGISTER request. */
    get waiting() {
        return this._waiting;
    }
    /** Emits when the registerer waiting state changes. */
    get waitingChange() {
        return this._waitingEventEmitter;
    }
    /**
     * Toggle waiting.
     */
    waitingToggle(waiting) {
        if (this._waiting === waiting) {
            throw new Error(`Invalid waiting transition from ${this._waiting} to ${waiting}`);
        }
        this._waiting = waiting;
        this.logger.log(`Waiting toggled to ${this._waiting}`);
        this._waitingEventEmitter.emit(this._waiting);
    }
    /** Hopefully helpful as the standard behavior has been found to be unexpected. */
    waitingWarning() {
        let message = "An attempt was made to send a REGISTER request while a prior one was still in progress.";
        message += " RFC 3261 requires UAs MUST NOT send a new registration until they have received a final response";
        message += " from the registrar for the previous one or the previous REGISTER request has timed out.";
        message += " Note that if the transport disconnects, you still must wait for the prior request to time out before";
        message +=
            " sending a new REGISTER request or alternatively dispose of the current Registerer and create a new Registerer.";
        this.logger.warn(message);
    }
    /** Hopefully helpful as the standard behavior has been found to be unexpected. */
    stateError() {
        const reason = this.state === RegistererState.Terminated ? "is in 'Terminated' state" : "has been disposed";
        let message = `An attempt was made to send a REGISTER request when the Registerer ${reason}.`;
        message += " The Registerer transitions to 'Terminated' when Registerer.dispose() is called.";
        message += " Perhaps you called UserAgent.stop() which dipsoses of all Registerers?";
        this.logger.error(message);
    }
}
Registerer.defaultExpires = 600;
Registerer.defaultRefreshFrequency = 99;

/**
 * Subscription state.
 * @remarks
 * https://tools.ietf.org/html/rfc6665#section-4.1.2
 * @public
 */
var SubscriptionState;
(function (SubscriptionState) {
    SubscriptionState["Initial"] = "Initial";
    SubscriptionState["NotifyWait"] = "NotifyWait";
    SubscriptionState["Pending"] = "Pending";
    SubscriptionState["Active"] = "Active";
    SubscriptionState["Terminated"] = "Terminated";
})(SubscriptionState = SubscriptionState || (SubscriptionState = {}));

/**
 * {@link Transport} state.
 *
 * @remarks
 * The {@link Transport} behaves in a deterministic manner according to the following
 * Finite State Machine (FSM).
 * ```txt
 *                    ______________________________
 *                   |    ____________              |
 * Transport         v   v            |             |
 * Constructed -> Disconnected -> Connecting -> Connected -> Disconnecting
 *                     ^            ^    |_____________________^  |  |
 *                     |            |_____________________________|  |
 *                     |_____________________________________________|
 * ```
 * @public
 */
var TransportState;
(function (TransportState) {
    /**
     * The `connect()` method was called.
     */
    TransportState["Connecting"] = "Connecting";
    /**
     * The `connect()` method resolved.
     */
    TransportState["Connected"] = "Connected";
    /**
     * The `disconnect()` method was called.
     */
    TransportState["Disconnecting"] = "Disconnecting";
    /**
     * The `connect()` method was rejected, or
     * the `disconnect()` method completed, or
     * network connectivity was lost.
     */
    TransportState["Disconnected"] = "Disconnected";
})(TransportState = TransportState || (TransportState = {}));

/**
 * {@link UserAgent} state.
 * @remarks
 * Valid state transitions:
 * ```
 * 1. "Started" --> "Stopped"
 * 2. "Stopped" --> "Started"
 * ```
 * @public
 */
var UserAgentState;
(function (UserAgentState) {
    UserAgentState["Started"] = "Started";
    UserAgentState["Stopped"] = "Stopped";
})(UserAgentState = UserAgentState || (UserAgentState = {}));

/* eslint-disable */
//
// Scoped from: https://github.com/cotag/ts-md5
//
/*

TypeScript Md5
==============

Based on work by
* Joseph Myers: http://www.myersdaily.org/joseph/javascript/md5-text.html
* André Cruz: https://github.com/satazor/SparkMD5
* Raymond Hill: https://github.com/gorhill/yamd5.js

Effectively a TypeScrypt re-write of Raymond Hill JS Library

The MIT License (MIT)

Copyright (C) 2014 Raymond Hill

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.



            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
                    Version 2, December 2004

 Copyright (C) 2015 André Cruz <amdfcruz@gmail.com>

 Everyone is permitted to copy and distribute verbatim or modified
 copies of this license document, and changing it is allowed as long
 as the name is changed.

            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
   TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

  0. You just DO WHAT THE FUCK YOU WANT TO.


*/
class Md5 {
    constructor() {
        this._dataLength = 0;
        this._bufferLength = 0;
        this._state = new Int32Array(4);
        this._buffer = new ArrayBuffer(68);
        this._buffer8 = new Uint8Array(this._buffer, 0, 68);
        this._buffer32 = new Uint32Array(this._buffer, 0, 17);
        this.start();
    }
    static hashStr(str, raw = false) {
        return this.onePassHasher
            .start()
            .appendStr(str)
            .end(raw);
    }
    static hashAsciiStr(str, raw = false) {
        return this.onePassHasher
            .start()
            .appendAsciiStr(str)
            .end(raw);
    }
    static _hex(x) {
        const hc = Md5.hexChars;
        const ho = Md5.hexOut;
        let n;
        let offset;
        let j;
        let i;
        for (i = 0; i < 4; i += 1) {
            offset = i * 8;
            n = x[i];
            for (j = 0; j < 8; j += 2) {
                ho[offset + 1 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
                ho[offset + 0 + j] = hc.charAt(n & 0x0F);
                n >>>= 4;
            }
        }
        return ho.join('');
    }
    static _md5cycle(x, k) {
        let a = x[0];
        let b = x[1];
        let c = x[2];
        let d = x[3];
        // ff()
        a += (b & c | ~b & d) + k[0] - 680876936 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[1] - 389564586 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[2] + 606105819 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[3] - 1044525330 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[4] - 176418897 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[5] + 1200080426 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[6] - 1473231341 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[7] - 45705983 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[8] + 1770035416 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[9] - 1958414417 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[10] - 42063 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[11] - 1990404162 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        a += (b & c | ~b & d) + k[12] + 1804603682 | 0;
        a = (a << 7 | a >>> 25) + b | 0;
        d += (a & b | ~a & c) + k[13] - 40341101 | 0;
        d = (d << 12 | d >>> 20) + a | 0;
        c += (d & a | ~d & b) + k[14] - 1502002290 | 0;
        c = (c << 17 | c >>> 15) + d | 0;
        b += (c & d | ~c & a) + k[15] + 1236535329 | 0;
        b = (b << 22 | b >>> 10) + c | 0;
        // gg()
        a += (b & d | c & ~d) + k[1] - 165796510 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[6] - 1069501632 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[11] + 643717713 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[0] - 373897302 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[5] - 701558691 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[10] + 38016083 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[15] - 660478335 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[4] - 405537848 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[9] + 568446438 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[14] - 1019803690 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[3] - 187363961 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[8] + 1163531501 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        a += (b & d | c & ~d) + k[13] - 1444681467 | 0;
        a = (a << 5 | a >>> 27) + b | 0;
        d += (a & c | b & ~c) + k[2] - 51403784 | 0;
        d = (d << 9 | d >>> 23) + a | 0;
        c += (d & b | a & ~b) + k[7] + 1735328473 | 0;
        c = (c << 14 | c >>> 18) + d | 0;
        b += (c & a | d & ~a) + k[12] - 1926607734 | 0;
        b = (b << 20 | b >>> 12) + c | 0;
        // hh()
        a += (b ^ c ^ d) + k[5] - 378558 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[8] - 2022574463 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[11] + 1839030562 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[14] - 35309556 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[1] - 1530992060 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[4] + 1272893353 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[7] - 155497632 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[10] - 1094730640 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[13] + 681279174 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[0] - 358537222 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[3] - 722521979 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[6] + 76029189 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        a += (b ^ c ^ d) + k[9] - 640364487 | 0;
        a = (a << 4 | a >>> 28) + b | 0;
        d += (a ^ b ^ c) + k[12] - 421815835 | 0;
        d = (d << 11 | d >>> 21) + a | 0;
        c += (d ^ a ^ b) + k[15] + 530742520 | 0;
        c = (c << 16 | c >>> 16) + d | 0;
        b += (c ^ d ^ a) + k[2] - 995338651 | 0;
        b = (b << 23 | b >>> 9) + c | 0;
        // ii()
        a += (c ^ (b | ~d)) + k[0] - 198630844 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[7] + 1126891415 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[14] - 1416354905 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[5] - 57434055 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[12] + 1700485571 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[3] - 1894986606 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[10] - 1051523 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[1] - 2054922799 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[8] + 1873313359 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[15] - 30611744 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[6] - 1560198380 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[13] + 1309151649 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        a += (c ^ (b | ~d)) + k[4] - 145523070 | 0;
        a = (a << 6 | a >>> 26) + b | 0;
        d += (b ^ (a | ~c)) + k[11] - 1120210379 | 0;
        d = (d << 10 | d >>> 22) + a | 0;
        c += (a ^ (d | ~b)) + k[2] + 718787259 | 0;
        c = (c << 15 | c >>> 17) + d | 0;
        b += (d ^ (c | ~a)) + k[9] - 343485551 | 0;
        b = (b << 21 | b >>> 11) + c | 0;
        x[0] = a + x[0] | 0;
        x[1] = b + x[1] | 0;
        x[2] = c + x[2] | 0;
        x[3] = d + x[3] | 0;
    }
    start() {
        this._dataLength = 0;
        this._bufferLength = 0;
        this._state.set(Md5.stateIdentity);
        return this;
    }
    // Char to code point to to array conversion:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt
    // #Example.3A_Fixing_charCodeAt_to_handle_non-Basic-Multilingual-Plane_characters_if_their_presence_earlier_in_the_string_is_unknown
    appendStr(str) {
        const buf8 = this._buffer8;
        const buf32 = this._buffer32;
        let bufLen = this._bufferLength;
        let code;
        let i;
        for (i = 0; i < str.length; i += 1) {
            code = str.charCodeAt(i);
            if (code < 128) {
                buf8[bufLen++] = code;
            }
            else if (code < 0x800) {
                buf8[bufLen++] = (code >>> 6) + 0xC0;
                buf8[bufLen++] = code & 0x3F | 0x80;
            }
            else if (code < 0xD800 || code > 0xDBFF) {
                buf8[bufLen++] = (code >>> 12) + 0xE0;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            else {
                code = ((code - 0xD800) * 0x400) + (str.charCodeAt(++i) - 0xDC00) + 0x10000;
                if (code > 0x10FFFF) {
                    throw new Error('Unicode standard supports code points up to U+10FFFF');
                }
                buf8[bufLen++] = (code >>> 18) + 0xF0;
                buf8[bufLen++] = (code >>> 12 & 0x3F) | 0x80;
                buf8[bufLen++] = (code >>> 6 & 0x3F) | 0x80;
                buf8[bufLen++] = (code & 0x3F) | 0x80;
            }
            if (bufLen >= 64) {
                this._dataLength += 64;
                Md5._md5cycle(this._state, buf32);
                bufLen -= 64;
                buf32[0] = buf32[16];
            }
        }
        this._bufferLength = bufLen;
        return this;
    }
    appendAsciiStr(str) {
        const buf8 = this._buffer8;
        const buf32 = this._buffer32;
        let bufLen = this._bufferLength;
        let i;
        let j = 0;
        for (;;) {
            i = Math.min(str.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = str.charCodeAt(j++);
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    }
    appendByteArray(input) {
        const buf8 = this._buffer8;
        const buf32 = this._buffer32;
        let bufLen = this._bufferLength;
        let i;
        let j = 0;
        for (;;) {
            i = Math.min(input.length - j, 64 - bufLen);
            while (i--) {
                buf8[bufLen++] = input[j++];
            }
            if (bufLen < 64) {
                break;
            }
            this._dataLength += 64;
            Md5._md5cycle(this._state, buf32);
            bufLen = 0;
        }
        this._bufferLength = bufLen;
        return this;
    }
    getState() {
        const self = this;
        const s = self._state;
        return {
            buffer: String.fromCharCode.apply(null, self._buffer8),
            buflen: self._bufferLength,
            length: self._dataLength,
            state: [s[0], s[1], s[2], s[3]]
        };
    }
    setState(state) {
        const buf = state.buffer;
        const x = state.state;
        const s = this._state;
        let i;
        this._dataLength = state.length;
        this._bufferLength = state.buflen;
        s[0] = x[0];
        s[1] = x[1];
        s[2] = x[2];
        s[3] = x[3];
        for (i = 0; i < buf.length; i += 1) {
            this._buffer8[i] = buf.charCodeAt(i);
        }
    }
    end(raw = false) {
        const bufLen = this._bufferLength;
        const buf8 = this._buffer8;
        const buf32 = this._buffer32;
        const i = (bufLen >> 2) + 1;
        let dataBitsLen;
        this._dataLength += bufLen;
        buf8[bufLen] = 0x80;
        buf8[bufLen + 1] = buf8[bufLen + 2] = buf8[bufLen + 3] = 0;
        buf32.set(Md5.buffer32Identity.subarray(i), i);
        if (bufLen > 55) {
            Md5._md5cycle(this._state, buf32);
            buf32.set(Md5.buffer32Identity);
        }
        // Do the final computation based on the tail and length
        // Beware that the final length may not fit in 32 bits so we take care of that
        dataBitsLen = this._dataLength * 8;
        if (dataBitsLen <= 0xFFFFFFFF) {
            buf32[14] = dataBitsLen;
        }
        else {
            const matches = dataBitsLen.toString(16).match(/(.*?)(.{0,8})$/);
            if (matches === null) {
                return;
            }
            const lo = parseInt(matches[2], 16);
            const hi = parseInt(matches[1], 16) || 0;
            buf32[14] = lo;
            buf32[15] = hi;
        }
        Md5._md5cycle(this._state, buf32);
        return raw ? this._state : Md5._hex(this._state);
    }
}
// Private Static Variables
Md5.stateIdentity = new Int32Array([1732584193, -271733879, -1732584194, 271733878]);
Md5.buffer32Identity = new Int32Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
Md5.hexChars = '0123456789abcdef';
Md5.hexOut = [];
// Permanent instance is to use for one-call hashing
Md5.onePassHasher = new Md5();
if (Md5.hashStr('hello') !== '5d41402abc4b2a76b9719d911017c592') {
    console.error('Md5 self test failed.');
}

function MD5(s) {
    return Md5.hashStr(s);
}
/**
 * Digest Authentication.
 * @internal
 */
class DigestAuthentication {
    /**
     * Constructor.
     * @param loggerFactory - LoggerFactory.
     * @param username - Username.
     * @param password - Password.
     */
    constructor(loggerFactory, ha1, username, password) {
        this.logger = loggerFactory.getLogger("sipjs.digestauthentication");
        this.username = username;
        this.password = password;
        this.ha1 = ha1;
        this.nc = 0;
        this.ncHex = "00000000";
    }
    /**
     * Performs Digest authentication given a SIP request and the challenge
     * received in a response to that request.
     * @param request -
     * @param challenge -
     * @returns true if credentials were successfully generated, false otherwise.
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    authenticate(request, challenge, body) {
        // Inspect and validate the challenge.
        this.algorithm = challenge.algorithm;
        this.realm = challenge.realm;
        this.nonce = challenge.nonce;
        this.opaque = challenge.opaque;
        this.stale = challenge.stale;
        if (this.algorithm) {
            if (this.algorithm !== "MD5") {
                this.logger.warn("challenge with Digest algorithm different than 'MD5', authentication aborted");
                return false;
            }
        }
        else {
            this.algorithm = "MD5";
        }
        if (!this.realm) {
            this.logger.warn("challenge without Digest realm, authentication aborted");
            return false;
        }
        if (!this.nonce) {
            this.logger.warn("challenge without Digest nonce, authentication aborted");
            return false;
        }
        // 'qop' can contain a list of values (Array). Let's choose just one.
        if (challenge.qop) {
            if (challenge.qop.indexOf("auth") > -1) {
                this.qop = "auth";
            }
            else if (challenge.qop.indexOf("auth-int") > -1) {
                this.qop = "auth-int";
            }
            else {
                // Otherwise 'qop' is present but does not contain 'auth' or 'auth-int', so abort here.
                this.logger.warn("challenge without Digest qop different than 'auth' or 'auth-int', authentication aborted");
                return false;
            }
        }
        else {
            this.qop = undefined;
        }
        // Fill other attributes.
        this.method = request.method;
        this.uri = request.ruri;
        this.cnonce = createRandomToken(12);
        this.nc += 1;
        this.updateNcHex();
        // nc-value = 8LHEX. Max value = 'FFFFFFFF'.
        if (this.nc === 4294967296) {
            this.nc = 1;
            this.ncHex = "00000001";
        }
        // Calculate the Digest "response" value.
        this.calculateResponse(body);
        return true;
    }
    /**
     * Return the Proxy-Authorization or WWW-Authorization header value.
     */
    toString() {
        const authParams = [];
        if (!this.response) {
            throw new Error("response field does not exist, cannot generate Authorization header");
        }
        authParams.push("algorithm=" + this.algorithm);
        authParams.push('username="' + this.username + '"');
        authParams.push('realm="' + this.realm + '"');
        authParams.push('nonce="' + this.nonce + '"');
        authParams.push('uri="' + this.uri + '"');
        authParams.push('response="' + this.response + '"');
        if (this.opaque) {
            authParams.push('opaque="' + this.opaque + '"');
        }
        if (this.qop) {
            authParams.push("qop=" + this.qop);
            authParams.push('cnonce="' + this.cnonce + '"');
            authParams.push("nc=" + this.ncHex);
        }
        return "Digest " + authParams.join(", ");
    }
    /**
     * Generate the 'nc' value as required by Digest in this.ncHex by reading this.nc.
     */
    updateNcHex() {
        const hex = Number(this.nc).toString(16);
        this.ncHex = "00000000".substr(0, 8 - hex.length) + hex;
    }
    /**
     * Generate Digest 'response' value.
     */
    calculateResponse(body) {
        let ha1, ha2;
        // HA1 = MD5(A1) = MD5(username:realm:password)
        ha1 = this.ha1;
        if (ha1 === "" || ha1 === undefined) {
            ha1 = MD5(this.username + ":" + this.realm + ":" + this.password);
        }
        if (this.qop === "auth") {
            // HA2 = MD5(A2) = MD5(method:digestURI)
            ha2 = MD5(this.method + ":" + this.uri);
            // response = MD5(HA1:nonce:nonceCount:credentialsNonce:qop:HA2)`
            this.response = MD5(ha1 + ":" + this.nonce + ":" + this.ncHex + ":" + this.cnonce + ":auth:" + ha2);
        }
        else if (this.qop === "auth-int") {
            // HA2 = MD5(A2) = MD5(method:digestURI:MD5(entityBody))
            ha2 = MD5(this.method + ":" + this.uri + ":" + MD5(body ? body : ""));
            // response = MD5(HA1:nonce:nonceCount:credentialsNonce:qop:HA2)
            this.response = MD5(ha1 + ":" + this.nonce + ":" + this.ncHex + ":" + this.cnonce + ":auth-int:" + ha2);
        }
        else if (this.qop === undefined) {
            // HA2 = MD5(A2) = MD5(method:digestURI)
            ha2 = MD5(this.method + ":" + this.uri);
            // response = MD5(HA1:nonce:HA2)
            this.response = MD5(ha1 + ":" + this.nonce + ":" + ha2);
        }
    }
}

/**
 * Log levels.
 * @public
 */
var Levels;
(function (Levels) {
    Levels[Levels["error"] = 0] = "error";
    Levels[Levels["warn"] = 1] = "warn";
    Levels[Levels["log"] = 2] = "log";
    Levels[Levels["debug"] = 3] = "debug";
})(Levels = Levels || (Levels = {}));

/**
 * Logger.
 * @public
 */
class Logger {
    constructor(logger, category, label) {
        this.logger = logger;
        this.category = category;
        this.label = label;
    }
    error(content) {
        this.genericLog(Levels.error, content);
    }
    warn(content) {
        this.genericLog(Levels.warn, content);
    }
    log(content) {
        this.genericLog(Levels.log, content);
    }
    debug(content) {
        this.genericLog(Levels.debug, content);
    }
    genericLog(level, content) {
        this.logger.genericLog(level, this.category, this.label, content);
    }
    get level() {
        return this.logger.level;
    }
    set level(newLevel) {
        this.logger.level = newLevel;
    }
}

/**
 * Logger.
 * @public
 */
class LoggerFactory {
    constructor() {
        this.builtinEnabled = true;
        this._level = Levels.log;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.loggers = {};
        this.logger = this.getLogger("sip:loggerfactory");
    }
    get level() {
        return this._level;
    }
    set level(newLevel) {
        if (newLevel >= 0 && newLevel <= 3) {
            this._level = newLevel;
        }
        else if (newLevel > 3) {
            this._level = 3;
            // eslint-disable-next-line no-prototype-builtins
        }
        else if (Levels.hasOwnProperty(newLevel)) {
            this._level = newLevel;
        }
        else {
            this.logger.error("invalid 'level' parameter value: " + JSON.stringify(newLevel));
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get connector() {
        return this._connector;
    }
    set connector(value) {
        if (!value) {
            this._connector = undefined;
        }
        else if (typeof value === "function") {
            this._connector = value;
        }
        else {
            this.logger.error("invalid 'connector' parameter value: " + JSON.stringify(value));
        }
    }
    getLogger(category, label) {
        if (label && this.level === 3) {
            return new Logger(this, category, label);
        }
        else if (this.loggers[category]) {
            return this.loggers[category];
        }
        else {
            const logger = new Logger(this, category);
            this.loggers[category] = logger;
            return logger;
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genericLog(levelToLog, category, label, content) {
        if (this.level >= levelToLog) {
            if (this.builtinEnabled) {
                this.print(levelToLog, category, label, content);
            }
        }
        if (this.connector) {
            this.connector(Levels[levelToLog], category, label, content);
        }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    print(levelToLog, category, label, content) {
        if (typeof content === "string") {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const prefix = [new Date(), category];
            if (label) {
                prefix.push(label);
            }
            content = prefix.concat(content).join(" | ");
        }
        switch (levelToLog) {
            case Levels.error:
                // eslint-disable-next-line no-console
                console.error(content);
                break;
            case Levels.warn:
                // eslint-disable-next-line no-console
                console.warn(content);
                break;
            case Levels.log:
                // eslint-disable-next-line no-console
                console.log(content);
                break;
            case Levels.debug:
                // eslint-disable-next-line no-console
                console.debug(content);
                break;
        }
    }
}

/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-namespace */
/**
 * Extract and parse every header of a SIP message.
 * @internal
 */
var Parser;
(function (Parser) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function getHeader(data, headerStart) {
        // 'start' position of the header.
        let start = headerStart;
        // 'end' position of the header.
        let end = 0;
        // 'partial end' position of the header.
        let partialEnd = 0;
        // End of message.
        if (data.substring(start, start + 2).match(/(^\r\n)/)) {
            return -2;
        }
        while (end === 0) {
            // Partial End of Header.
            partialEnd = data.indexOf("\r\n", start);
            // 'indexOf' returns -1 if the value to be found never occurs.
            if (partialEnd === -1) {
                return partialEnd;
            }
            if (!data.substring(partialEnd + 2, partialEnd + 4).match(/(^\r\n)/) &&
                data.charAt(partialEnd + 2).match(/(^\s+)/)) {
                // Not the end of the message. Continue from the next position.
                start = partialEnd + 2;
            }
            else {
                end = partialEnd;
            }
        }
        return end;
    }
    Parser.getHeader = getHeader;
    function parseHeader(message, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data, headerStart, headerEnd) {
        const hcolonIndex = data.indexOf(":", headerStart);
        const headerName = data.substring(headerStart, hcolonIndex).trim();
        const headerValue = data.substring(hcolonIndex + 1, headerEnd).trim();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let parsed;
        // If header-field is well-known, parse it.
        switch (headerName.toLowerCase()) {
            case "via":
            case "v":
                message.addHeader("via", headerValue);
                if (message.getHeaders("via").length === 1) {
                    parsed = message.parseHeader("Via");
                    if (parsed) {
                        message.via = parsed;
                        message.viaBranch = parsed.branch;
                    }
                }
                else {
                    parsed = 0;
                }
                break;
            case "from":
            case "f":
                message.setHeader("from", headerValue);
                parsed = message.parseHeader("from");
                if (parsed) {
                    message.from = parsed;
                    message.fromTag = parsed.getParam("tag");
                }
                break;
            case "to":
            case "t":
                message.setHeader("to", headerValue);
                parsed = message.parseHeader("to");
                if (parsed) {
                    message.to = parsed;
                    message.toTag = parsed.getParam("tag");
                }
                break;
            case "record-route":
                parsed = Grammar.parse(headerValue, "Record_Route");
                if (parsed === -1) {
                    parsed = undefined;
                    break;
                }
                if (!(parsed instanceof Array)) {
                    parsed = undefined;
                    break;
                }
                parsed.forEach((header) => {
                    message.addHeader("record-route", headerValue.substring(header.position, header.offset));
                    message.headers["Record-Route"][message.getHeaders("record-route").length - 1].parsed = header.parsed;
                });
                break;
            case "call-id":
            case "i":
                message.setHeader("call-id", headerValue);
                parsed = message.parseHeader("call-id");
                if (parsed) {
                    message.callId = headerValue;
                }
                break;
            case "contact":
            case "m":
                parsed = Grammar.parse(headerValue, "Contact");
                if (parsed === -1) {
                    parsed = undefined;
                    break;
                }
                if (!(parsed instanceof Array)) {
                    parsed = undefined;
                    break;
                }
                parsed.forEach((header) => {
                    message.addHeader("contact", headerValue.substring(header.position, header.offset));
                    message.headers.Contact[message.getHeaders("contact").length - 1].parsed = header.parsed;
                });
                break;
            case "content-length":
            case "l":
                message.setHeader("content-length", headerValue);
                parsed = message.parseHeader("content-length");
                break;
            case "content-type":
            case "c":
                message.setHeader("content-type", headerValue);
                parsed = message.parseHeader("content-type");
                break;
            case "cseq":
                message.setHeader("cseq", headerValue);
                parsed = message.parseHeader("cseq");
                if (parsed) {
                    message.cseq = parsed.value;
                }
                if (message instanceof IncomingResponseMessage) {
                    message.method = parsed.method;
                }
                break;
            case "max-forwards":
                message.setHeader("max-forwards", headerValue);
                parsed = message.parseHeader("max-forwards");
                break;
            case "www-authenticate":
                message.setHeader("www-authenticate", headerValue);
                parsed = message.parseHeader("www-authenticate");
                break;
            case "proxy-authenticate":
                message.setHeader("proxy-authenticate", headerValue);
                parsed = message.parseHeader("proxy-authenticate");
                break;
            case "refer-to":
            case "r":
                message.setHeader("refer-to", headerValue);
                parsed = message.parseHeader("refer-to");
                if (parsed) {
                    message.referTo = parsed;
                }
                break;
            default:
                // Do not parse this header.
                message.addHeader(headerName.toLowerCase(), headerValue);
                parsed = 0;
        }
        if (parsed === undefined) {
            return {
                error: "error parsing header '" + headerName + "'"
            };
        }
        else {
            return true;
        }
    }
    Parser.parseHeader = parseHeader;
    function parseMessage(data, logger) {
        let headerStart = 0;
        let headerEnd = data.indexOf("\r\n");
        if (headerEnd === -1) {
            logger.warn("no CRLF found, not a SIP message, discarded");
            return;
        }
        // Parse first line. Check if it is a Request or a Reply.
        const firstLine = data.substring(0, headerEnd);
        const parsed = Grammar.parse(firstLine, "Request_Response");
        let message;
        if (parsed === -1) {
            logger.warn('error parsing first line of SIP message: "' + firstLine + '"');
            return;
        }
        else if (!parsed.status_code) {
            message = new IncomingRequestMessage();
            message.method = parsed.method;
            message.ruri = parsed.uri;
        }
        else {
            message = new IncomingResponseMessage();
            message.statusCode = parsed.status_code;
            message.reasonPhrase = parsed.reason_phrase;
        }
        message.data = data;
        headerStart = headerEnd + 2;
        // Loop over every line in data. Detect the end of each header and parse
        // it or simply add to the headers collection.
        let bodyStart;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            headerEnd = getHeader(data, headerStart);
            // The SIP message has normally finished.
            if (headerEnd === -2) {
                bodyStart = headerStart + 2;
                break;
            }
            else if (headerEnd === -1) {
                // data.indexOf returned -1 due to a malformed message.
                logger.error("malformed message");
                return;
            }
            const parsedHeader = parseHeader(message, data, headerStart, headerEnd);
            if (parsedHeader && parsedHeader !== true) {
                logger.error(parsedHeader.error);
                return;
            }
            headerStart = headerEnd + 2;
        }
        // RFC3261 18.3.
        // If there are additional bytes in the transport packet
        // beyond the end of the body, they MUST be discarded.
        if (message.hasHeader("content-length")) {
            message.body = data.substr(bodyStart, Number(message.getHeader("content-length")));
        }
        else {
            message.body = data.substring(bodyStart);
        }
        return message;
    }
    Parser.parseMessage = parseMessage;
})(Parser = Parser || (Parser = {}));

/**
 * When a UAS wishes to construct a response to a request, it follows
 * the general procedures detailed in the following subsections.
 * Additional behaviors specific to the response code in question, which
 * are not detailed in this section, may also be required.
 * https://tools.ietf.org/html/rfc3261#section-8.2.6
 * @internal
 */
function constructOutgoingResponse(message, options) {
    const CRLF = "\r\n";
    if (options.statusCode < 100 || options.statusCode > 699) {
        throw new TypeError("Invalid statusCode: " + options.statusCode);
    }
    const reasonPhrase = options.reasonPhrase ? options.reasonPhrase : getReasonPhrase(options.statusCode);
    // SIP responses are distinguished from requests by having a Status-Line
    // as their start-line.  A Status-Line consists of the protocol version
    // followed by a numeric Status-Code and its associated textual phrase,
    // with each element separated by a single SP character.
    // https://tools.ietf.org/html/rfc3261#section-7.2
    let response = "SIP/2.0 " + options.statusCode + " " + reasonPhrase + CRLF;
    // One largely non-method-specific guideline for the generation of
    // responses is that UASs SHOULD NOT issue a provisional response for a
    // non-INVITE request.  Rather, UASs SHOULD generate a final response to
    // a non-INVITE request as soon as possible.
    // https://tools.ietf.org/html/rfc3261#section-8.2.6.1
    if (options.statusCode >= 100 && options.statusCode < 200) ;
    // When a 100 (Trying) response is generated, any Timestamp header field
    // present in the request MUST be copied into this 100 (Trying)
    // response.  If there is a delay in generating the response, the UAS
    // SHOULD add a delay value into the Timestamp value in the response.
    // This value MUST contain the difference between the time of sending of
    // the response and receipt of the request, measured in seconds.
    // https://tools.ietf.org/html/rfc3261#section-8.2.6.1
    if (options.statusCode === 100) ;
    // The From field of the response MUST equal the From header field of
    // the request.  The Call-ID header field of the response MUST equal the
    // Call-ID header field of the request.  The CSeq header field of the
    // response MUST equal the CSeq field of the request.  The Via header
    // field values in the response MUST equal the Via header field values
    // in the request and MUST maintain the same ordering.
    // https://tools.ietf.org/html/rfc3261#section-8.2.6.2
    const fromHeader = "From: " + message.getHeader("From") + CRLF;
    const callIdHeader = "Call-ID: " + message.callId + CRLF;
    const cSeqHeader = "CSeq: " + message.cseq + " " + message.method + CRLF;
    const viaHeaders = message.getHeaders("via").reduce((previous, current) => {
        return previous + "Via: " + current + CRLF;
    }, "");
    // If a request contained a To tag in the request, the To header field
    // in the response MUST equal that of the request.  However, if the To
    // header field in the request did not contain a tag, the URI in the To
    // header field in the response MUST equal the URI in the To header
    // field; additionally, the UAS MUST add a tag to the To header field in
    // the response (with the exception of the 100 (Trying) response, in
    // which a tag MAY be present).  This serves to identify the UAS that is
    // responding, possibly resulting in a component of a dialog ID.  The
    // same tag MUST be used for all responses to that request, both final
    // and provisional (again excepting the 100 (Trying)).
    // https://tools.ietf.org/html/rfc3261#section-8.2.6.2
    let toHeader = "To: " + message.getHeader("to");
    if (options.statusCode > 100 && !message.parseHeader("to").hasParam("tag")) {
        let toTag = options.toTag;
        if (!toTag) {
            // Stateless UAS Behavior...
            // o  To header tags MUST be generated for responses in a stateless
            //    manner - in a manner that will generate the same tag for the
            //    same request consistently.  For information on tag construction
            //    see Section 19.3.
            // https://tools.ietf.org/html/rfc3261#section-8.2.7
            toTag = newTag(); // FIXME: newTag() currently generates random tags
        }
        toHeader += ";tag=" + toTag;
    }
    toHeader += CRLF;
    // FIXME: TODO: needs review... moved to InviteUserAgentServer (as it is specific to that)
    // let recordRouteHeaders = "";
    // if (request.method === C.INVITE && statusCode > 100 && statusCode <= 200) {
    //   recordRouteHeaders = request.getHeaders("record-route").reduce((previous, current) => {
    //     return previous + "Record-Route: " + current + CRLF;
    //   }, "");
    // }
    // FIXME: TODO: needs review...
    let supportedHeader = "";
    if (options.supported) {
        supportedHeader = "Supported: " + options.supported.join(", ") + CRLF;
    }
    // FIXME: TODO: needs review...
    let userAgentHeader = "";
    if (options.userAgent) {
        userAgentHeader = "User-Agent: " + options.userAgent + CRLF;
    }
    let extensionHeaders = "";
    if (options.extraHeaders) {
        extensionHeaders = options.extraHeaders.reduce((previous, current) => {
            return previous + current.trim() + CRLF;
        }, "");
    }
    // The relative order of header fields with different field names is not
    // significant.  However, it is RECOMMENDED that header fields which are
    // needed for proxy processing (Via, Route, Record-Route, Proxy-Require,
    // Max-Forwards, and Proxy-Authorization, for example) appear towards
    // the top of the message to facilitate rapid parsing.
    // https://tools.ietf.org/html/rfc3261#section-7.3.1
    // response += recordRouteHeaders;
    response += viaHeaders;
    response += fromHeader;
    response += toHeader;
    response += cSeqHeader;
    response += callIdHeader;
    response += supportedHeader;
    response += userAgentHeader;
    response += extensionHeaders;
    if (options.body) {
        response += "Content-Type: " + options.body.contentType + CRLF;
        response += "Content-Length: " + utf8Length(options.body.content) + CRLF + CRLF;
        response += options.body.content;
    }
    else {
        response += "Content-Length: " + 0 + CRLF + CRLF;
    }
    return { message: response };
}

/**
 * Transport error.
 * @public
 */
class TransportError extends Exception {
    constructor(message) {
        super(message ? message : "Unspecified transport error.");
    }
}

/**
 * Transaction.
 * @remarks
 * SIP is a transactional protocol: interactions between components take
 * place in a series of independent message exchanges.  Specifically, a
 * SIP transaction consists of a single request and any responses to
 * that request, which include zero or more provisional responses and
 * one or more final responses.  In the case of a transaction where the
 * request was an INVITE (known as an INVITE transaction), the
 * transaction also includes the ACK only if the final response was not
 * a 2xx response.  If the response was a 2xx, the ACK is not considered
 * part of the transaction.
 * https://tools.ietf.org/html/rfc3261#section-17
 * @public
 */
class Transaction {
    constructor(_transport, _user, _id, _state, loggerCategory) {
        this._transport = _transport;
        this._user = _user;
        this._id = _id;
        this._state = _state;
        this.listeners = new Array();
        this.logger = _user.loggerFactory.getLogger(loggerCategory, _id);
        this.logger.debug(`Constructing ${this.typeToString()} with id ${this.id}.`);
    }
    /**
     * Destructor.
     * Once the transaction is in the "terminated" state, it is destroyed
     * immediately and there is no need to call `dispose`. However, if a
     * transaction needs to be ended prematurely, the transaction user may
     * do so by calling this method (for example, perhaps the UA is shutting down).
     * No state transition will occur upon calling this method, all outstanding
     * transmission timers will be cancelled, and use of the transaction after
     * calling `dispose` is undefined.
     */
    dispose() {
        this.logger.debug(`Destroyed ${this.typeToString()} with id ${this.id}.`);
    }
    /** Transaction id. */
    get id() {
        return this._id;
    }
    /** Transaction kind. Deprecated. */
    get kind() {
        throw new Error("Invalid kind.");
    }
    /** Transaction state. */
    get state() {
        return this._state;
    }
    /** Transaction transport. */
    get transport() {
        return this._transport;
    }
    /**
     * Sets up a function that will be called whenever the transaction state changes.
     * @param listener - Callback function.
     * @param options - An options object that specifies characteristics about the listener.
     *                  If once true, indicates that the listener should be invoked at most once after being added.
     *                  If once true, the listener would be automatically removed when invoked.
     */
    addStateChangeListener(listener, options) {
        const onceWrapper = () => {
            this.removeStateChangeListener(onceWrapper);
            listener();
        };
        (options === null || options === void 0 ? void 0 : options.once) === true ? this.listeners.push(onceWrapper) : this.listeners.push(listener);
    }
    /**
     * This is currently public so tests may spy on it.
     * @internal
     */
    notifyStateChangeListeners() {
        this.listeners.slice().forEach((listener) => listener());
    }
    /**
     * Removes a listener previously registered with addStateListener.
     * @param listener - Callback function.
     */
    removeStateChangeListener(listener) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }
    logTransportError(error, message) {
        this.logger.error(error.message);
        this.logger.error(`Transport error occurred in ${this.typeToString()} with id ${this.id}.`);
        this.logger.error(message);
    }
    /**
     * Pass message to transport for transmission. If transport fails,
     * the transaction user is notified by callback to onTransportError().
     * @returns
     * Rejects with `TransportError` if transport fails.
     */
    send(message) {
        return this.transport.send(message).catch((error) => {
            // If the transport rejects, it SHOULD reject with a TransportError.
            // But the transport may be external code, so we are careful
            // make sure we convert it to a TransportError if need be.
            if (error instanceof TransportError) {
                this.onTransportError(error);
                throw error;
            }
            let transportError;
            if (error && typeof error.message === "string") {
                transportError = new TransportError(error.message);
            }
            else {
                transportError = new TransportError();
            }
            this.onTransportError(transportError);
            throw transportError;
        });
    }
    setState(state) {
        this.logger.debug(`State change to "${state}" on ${this.typeToString()} with id ${this.id}.`);
        this._state = state;
        if (this._user.onStateChange) {
            this._user.onStateChange(state);
        }
        this.notifyStateChangeListeners();
    }
    typeToString() {
        return "UnknownType";
    }
}

/**
 * Server Transaction.
 * @remarks
 * The server transaction is responsible for the delivery of requests to
 * the TU and the reliable transmission of responses.  It accomplishes
 * this through a state machine.  Server transactions are created by the
 * core when a request is received, and transaction handling is desired
 * for that request (this is not always the case).
 * https://tools.ietf.org/html/rfc3261#section-17.2
 * @public
 */
class ServerTransaction extends Transaction {
    constructor(_request, transport, user, state, loggerCategory) {
        super(transport, user, _request.viaBranch, state, loggerCategory);
        this._request = _request;
        this.user = user;
    }
    /** The incoming request the transaction handling. */
    get request() {
        return this._request;
    }
}

/**
 * Transaction state.
 * @public
 */
var TransactionState;
(function (TransactionState) {
    TransactionState["Accepted"] = "Accepted";
    TransactionState["Calling"] = "Calling";
    TransactionState["Completed"] = "Completed";
    TransactionState["Confirmed"] = "Confirmed";
    TransactionState["Proceeding"] = "Proceeding";
    TransactionState["Terminated"] = "Terminated";
    TransactionState["Trying"] = "Trying";
})(TransactionState = TransactionState || (TransactionState = {}));

/**
 * INVITE Server Transaction.
 * @remarks
 * https://tools.ietf.org/html/rfc3261#section-17.2.1
 * @public
 */
class InviteServerTransaction extends ServerTransaction {
    /**
     * Constructor.
     * Upon construction, a "100 Trying" reply will be immediately sent.
     * After construction the transaction will be in the "proceeding" state and the transaction
     * `id` will equal the branch parameter set in the Via header of the incoming request.
     * https://tools.ietf.org/html/rfc3261#section-17.2.1
     * @param request - Incoming INVITE request from the transport.
     * @param transport - The transport.
     * @param user - The transaction user.
     */
    constructor(request, transport, user) {
        super(request, transport, user, TransactionState.Proceeding, "sip.transaction.ist");
    }
    /**
     * Destructor.
     */
    dispose() {
        this.stopProgressExtensionTimer();
        if (this.H) {
            clearTimeout(this.H);
            this.H = undefined;
        }
        if (this.I) {
            clearTimeout(this.I);
            this.I = undefined;
        }
        if (this.L) {
            clearTimeout(this.L);
            this.L = undefined;
        }
        super.dispose();
    }
    /** Transaction kind. Deprecated. */
    get kind() {
        return "ist";
    }
    /**
     * Receive requests from transport matching this transaction.
     * @param request - Request matching this transaction.
     */
    receiveRequest(request) {
        switch (this.state) {
            case TransactionState.Proceeding:
                // If a request retransmission is received while in the "Proceeding" state, the most
                // recent provisional response that was received from the TU MUST be passed to the
                // transport layer for retransmission.
                // https://tools.ietf.org/html/rfc3261#section-17.2.1
                if (request.method === C.INVITE) {
                    if (this.lastProvisionalResponse) {
                        this.send(this.lastProvisionalResponse).catch((error) => {
                            this.logTransportError(error, "Failed to send retransmission of provisional response.");
                        });
                    }
                    return;
                }
                break;
            case TransactionState.Accepted:
                // While in the "Accepted" state, any retransmissions of the INVITE
                // received will match this transaction state machine and will be
                // absorbed by the machine without changing its state. These
                // retransmissions are not passed onto the TU.
                // https://tools.ietf.org/html/rfc6026#section-7.1
                if (request.method === C.INVITE) {
                    return;
                }
                break;
            case TransactionState.Completed:
                // Furthermore, while in the "Completed" state, if a request retransmission is
                // received, the server SHOULD pass the response to the transport for retransmission.
                // https://tools.ietf.org/html/rfc3261#section-17.2.1
                if (request.method === C.INVITE) {
                    if (!this.lastFinalResponse) {
                        throw new Error("Last final response undefined.");
                    }
                    this.send(this.lastFinalResponse).catch((error) => {
                        this.logTransportError(error, "Failed to send retransmission of final response.");
                    });
                    return;
                }
                // If an ACK is received while the server transaction is in the "Completed" state,
                // the server transaction MUST transition to the "Confirmed" state.
                // https://tools.ietf.org/html/rfc3261#section-17.2.1
                if (request.method === C.ACK) {
                    this.stateTransition(TransactionState.Confirmed);
                    return;
                }
                break;
            case TransactionState.Confirmed:
                // The purpose of the "Confirmed" state is to absorb any additional ACK messages that arrive,
                // triggered from retransmissions of the final response.
                // https://tools.ietf.org/html/rfc3261#section-17.2.1
                if (request.method === C.INVITE || request.method === C.ACK) {
                    return;
                }
                break;
            case TransactionState.Terminated:
                // For good measure absorb any additional messages that arrive (should not happen).
                if (request.method === C.INVITE || request.method === C.ACK) {
                    return;
                }
                break;
            default:
                throw new Error(`Invalid state ${this.state}`);
        }
        const message = `INVITE server transaction received unexpected ${request.method} request while in state ${this.state}.`;
        this.logger.warn(message);
        return;
    }
    /**
     * Receive responses from TU for this transaction.
     * @param statusCode - Status code of response.
     * @param response - Response.
     */
    receiveResponse(statusCode, response) {
        if (statusCode < 100 || statusCode > 699) {
            throw new Error(`Invalid status code ${statusCode}`);
        }
        switch (this.state) {
            case TransactionState.Proceeding:
                // The TU passes any number of provisional responses to the server
                // transaction. So long as the server transaction is in the
                // "Proceeding" state, each of these MUST be passed to the transport
                // layer for transmission. They are not sent reliably by the
                // transaction layer (they are not retransmitted by it) and do not cause
                // a change in the state of the server transaction.
                // https://tools.ietf.org/html/rfc3261#section-17.2.1
                if (statusCode >= 100 && statusCode <= 199) {
                    this.lastProvisionalResponse = response;
                    // Start the progress extension timer only for a non-100 provisional response.
                    if (statusCode > 100) {
                        this.startProgressExtensionTimer(); // FIXME: remove
                    }
                    this.send(response).catch((error) => {
                        this.logTransportError(error, "Failed to send 1xx response.");
                    });
                    return;
                }
                // If, while in the "Proceeding" state, the TU passes a 2xx response
                // to the server transaction, the server transaction MUST pass this
                // response to the transport layer for transmission. It is not
                // retransmitted by the server transaction; retransmissions of 2xx
                // responses are handled by the TU. The server transaction MUST then
                // transition to the "Accepted" state.
                // https://tools.ietf.org/html/rfc6026#section-8.5
                if (statusCode >= 200 && statusCode <= 299) {
                    this.lastFinalResponse = response;
                    this.stateTransition(TransactionState.Accepted);
                    this.send(response).catch((error) => {
                        this.logTransportError(error, "Failed to send 2xx response.");
                    });
                    return;
                }
                // While in the "Proceeding" state, if the TU passes a response with
                // status code from 300 to 699 to the server transaction, the response
                // MUST be passed to the transport layer for transmission, and the state
                // machine MUST enter the "Completed" state.
                // https://tools.ietf.org/html/rfc3261#section-17.2.1
                if (statusCode >= 300 && statusCode <= 699) {
                    this.lastFinalResponse = response;
                    this.stateTransition(TransactionState.Completed);
                    this.send(response).catch((error) => {
                        this.logTransportError(error, "Failed to send non-2xx final response.");
                    });
                    return;
                }
                break;
            case TransactionState.Accepted:
                // While in the "Accepted" state, if the TU passes a 2xx response,
                // the server transaction MUST pass the response to the transport layer for transmission.
                // https://tools.ietf.org/html/rfc6026#section-8.7
                if (statusCode >= 200 && statusCode <= 299) {
                    this.send(response).catch((error) => {
                        this.logTransportError(error, "Failed to send 2xx response.");
                    });
                    return;
                }
                break;
            case TransactionState.Completed:
                break;
            case TransactionState.Confirmed:
                break;
            case TransactionState.Terminated:
                break;
            default:
                throw new Error(`Invalid state ${this.state}`);
        }
        const message = `INVITE server transaction received unexpected ${statusCode} response from TU while in state ${this.state}.`;
        this.logger.error(message);
        throw new Error(message);
    }
    /**
     * Retransmit the last 2xx response. This is a noop if not in the "accepted" state.
     */
    retransmitAcceptedResponse() {
        if (this.state === TransactionState.Accepted && this.lastFinalResponse) {
            this.send(this.lastFinalResponse).catch((error) => {
                this.logTransportError(error, "Failed to send 2xx response.");
            });
        }
    }
    /**
     * First, the procedures in [4] are followed, which attempt to deliver the response to a backup.
     * If those should all fail, based on the definition of failure in [4], the server transaction SHOULD
     * inform the TU that a failure has occurred, and MUST remain in the current state.
     * https://tools.ietf.org/html/rfc6026#section-8.8
     */
    onTransportError(error) {
        if (this.user.onTransportError) {
            this.user.onTransportError(error);
        }
    }
    /** For logging. */
    typeToString() {
        return "INVITE server transaction";
    }
    /**
     * Execute a state transition.
     * @param newState - New state.
     */
    stateTransition(newState) {
        // Assert valid state transitions.
        const invalidStateTransition = () => {
            throw new Error(`Invalid state transition from ${this.state} to ${newState}`);
        };
        switch (newState) {
            case TransactionState.Proceeding:
                invalidStateTransition();
                break;
            case TransactionState.Accepted:
            case TransactionState.Completed:
                if (this.state !== TransactionState.Proceeding) {
                    invalidStateTransition();
                }
                break;
            case TransactionState.Confirmed:
                if (this.state !== TransactionState.Completed) {
                    invalidStateTransition();
                }
                break;
            case TransactionState.Terminated:
                if (this.state !== TransactionState.Accepted &&
                    this.state !== TransactionState.Completed &&
                    this.state !== TransactionState.Confirmed) {
                    invalidStateTransition();
                }
                break;
            default:
                invalidStateTransition();
        }
        // On any state transition, stop resending provisional responses
        this.stopProgressExtensionTimer();
        // The purpose of the "Accepted" state is to absorb retransmissions of an accepted INVITE request.
        // Any such retransmissions are absorbed entirely within the server transaction.
        // They are not passed up to the TU since any downstream UAS cores that accepted the request have
        // taken responsibility for reliability and will already retransmit their 2xx responses if necessary.
        // https://tools.ietf.org/html/rfc6026#section-8.7
        if (newState === TransactionState.Accepted) {
            this.L = setTimeout(() => this.timerL(), Timers.TIMER_L);
        }
        // When the "Completed" state is entered, timer H MUST be set to fire in 64*T1 seconds for all transports.
        // Timer H determines when the server transaction abandons retransmitting the response.
        // If an ACK is received while the server transaction is in the "Completed" state,
        // the server transaction MUST transition to the "Confirmed" state.
        // https://tools.ietf.org/html/rfc3261#section-17.2.1
        if (newState === TransactionState.Completed) {
            // FIXME: Missing timer G for unreliable transports.
            this.H = setTimeout(() => this.timerH(), Timers.TIMER_H);
        }
        // The purpose of the "Confirmed" state is to absorb any additional ACK messages that arrive,
        // triggered from retransmissions of the final response. When this state is entered, timer I
        // is set to fire in T4 seconds for unreliable transports, and zero seconds for reliable
        // transports. Once timer I fires, the server MUST transition to the "Terminated" state.
        // https://tools.ietf.org/html/rfc3261#section-17.2.1
        if (newState === TransactionState.Confirmed) {
            // FIXME: This timer is not getting set correctly for unreliable transports.
            this.I = setTimeout(() => this.timerI(), Timers.TIMER_I);
        }
        // Once the transaction is in the "Terminated" state, it MUST be destroyed immediately.
        // https://tools.ietf.org/html/rfc6026#section-8.7
        if (newState === TransactionState.Terminated) {
            this.dispose();
        }
        // Update state.
        this.setState(newState);
    }
    /**
     * FIXME: UAS Provisional Retransmission Timer. See RFC 3261 Section 13.3.1.1
     * This is in the wrong place. This is not a transaction level thing. It's a UAS level thing.
     */
    startProgressExtensionTimer() {
        // Start the progress extension timer only for the first non-100 provisional response.
        if (this.progressExtensionTimer === undefined) {
            this.progressExtensionTimer = setInterval(() => {
                this.logger.debug(`Progress extension timer expired for INVITE server transaction ${this.id}.`);
                if (!this.lastProvisionalResponse) {
                    throw new Error("Last provisional response undefined.");
                }
                this.send(this.lastProvisionalResponse).catch((error) => {
                    this.logTransportError(error, "Failed to send retransmission of provisional response.");
                });
            }, Timers.PROVISIONAL_RESPONSE_INTERVAL);
        }
    }
    /**
     * FIXME: UAS Provisional Retransmission Timer id. See RFC 3261 Section 13.3.1.1
     * This is in the wrong place. This is not a transaction level thing. It's a UAS level thing.
     */
    stopProgressExtensionTimer() {
        if (this.progressExtensionTimer !== undefined) {
            clearInterval(this.progressExtensionTimer);
            this.progressExtensionTimer = undefined;
        }
    }
    /**
     * While in the "Proceeding" state, if the TU passes a response with status code
     * from 300 to 699 to the server transaction, the response MUST be passed to the
     * transport layer for transmission, and the state machine MUST enter the "Completed" state.
     * For unreliable transports, timer G is set to fire in T1 seconds, and is not set to fire for
     * reliable transports. If timer G fires, the response is passed to the transport layer once
     * more for retransmission, and timer G is set to fire in MIN(2*T1, T2) seconds. From then on,
     * when timer G fires, the response is passed to the transport again for transmission, and
     * timer G is reset with a value that doubles, unless that value exceeds T2, in which case
     * it is reset with the value of T2.
     * https://tools.ietf.org/html/rfc3261#section-17.2.1
     */
    timerG() {
        // TODO
    }
    /**
     * If timer H fires while in the "Completed" state, it implies that the ACK was never received.
     * In this case, the server transaction MUST transition to the "Terminated" state, and MUST
     * indicate to the TU that a transaction failure has occurred.
     * https://tools.ietf.org/html/rfc3261#section-17.2.1
     */
    timerH() {
        this.logger.debug(`Timer H expired for INVITE server transaction ${this.id}.`);
        if (this.state === TransactionState.Completed) {
            this.logger.warn("ACK to negative final response was never received, terminating transaction.");
            this.stateTransition(TransactionState.Terminated);
        }
    }
    /**
     * Once timer I fires, the server MUST transition to the "Terminated" state.
     * https://tools.ietf.org/html/rfc3261#section-17.2.1
     */
    timerI() {
        this.logger.debug(`Timer I expired for INVITE server transaction ${this.id}.`);
        this.stateTransition(TransactionState.Terminated);
    }
    /**
     * When Timer L fires and the state machine is in the "Accepted" state, the machine MUST
     * transition to the "Terminated" state. Once the transaction is in the "Terminated" state,
     * it MUST be destroyed immediately. Timer L reflects the amount of time the server
     * transaction could receive 2xx responses for retransmission from the
     * TU while it is waiting to receive an ACK.
     * https://tools.ietf.org/html/rfc6026#section-7.1
     * https://tools.ietf.org/html/rfc6026#section-8.7
     */
    timerL() {
        this.logger.debug(`Timer L expired for INVITE server transaction ${this.id}.`);
        if (this.state === TransactionState.Accepted) {
            this.stateTransition(TransactionState.Terminated);
        }
    }
}

/**
 * Client Transaction.
 * @remarks
 * The client transaction provides its functionality through the
 * maintenance of a state machine.
 *
 * The TU communicates with the client transaction through a simple
 * interface.  When the TU wishes to initiate a new transaction, it
 * creates a client transaction and passes it the SIP request to send
 * and an IP address, port, and transport to which to send it.  The
 * client transaction begins execution of its state machine.  Valid
 * responses are passed up to the TU from the client transaction.
 * https://tools.ietf.org/html/rfc3261#section-17.1
 * @public
 */
class ClientTransaction extends Transaction {
    constructor(_request, transport, user, state, loggerCategory) {
        super(transport, user, ClientTransaction.makeId(_request), state, loggerCategory);
        this._request = _request;
        this.user = user;
        // The Via header field indicates the transport used for the transaction
        // and identifies the location where the response is to be sent.  A Via
        // header field value is added only after the transport that will be
        // used to reach the next hop has been selected (which may involve the
        // usage of the procedures in [4]).
        // https://tools.ietf.org/html/rfc3261#section-8.1.1.7
        _request.setViaHeader(this.id, transport.protocol);
    }
    static makeId(request) {
        if (request.method === "CANCEL") {
            if (!request.branch) {
                throw new Error("Outgoing CANCEL request without a branch.");
            }
            return request.branch;
        }
        else {
            return "z9hG4bK" + Math.floor(Math.random() * 10000000);
        }
    }
    /** The outgoing request the transaction handling. */
    get request() {
        return this._request;
    }
    /**
     * A 408 to non-INVITE will always arrive too late to be useful ([3]),
     * The client already has full knowledge of the timeout. The only
     * information this message would convey is whether or not the server
     * believed the transaction timed out. However, with the current design
     * of the NIT, a client cannot do anything with this knowledge. Thus,
     * the 408 is simply wasting network resources and contributes to the
     * response bombardment illustrated in [3].
     * https://tools.ietf.org/html/rfc4320#section-4.1
     */
    onRequestTimeout() {
        if (this.user.onRequestTimeout) {
            this.user.onRequestTimeout();
        }
    }
}

/**
 * Non-INVITE Client Transaction.
 * @remarks
 * Non-INVITE transactions do not make use of ACK.
 * They are simple request-response interactions.
 * https://tools.ietf.org/html/rfc3261#section-17.1.2
 * @public
 */
class NonInviteClientTransaction extends ClientTransaction {
    /**
     * Constructor
     * Upon construction, the outgoing request's Via header is updated by calling `setViaHeader`.
     * Then `toString` is called on the outgoing request and the message is sent via the transport.
     * After construction the transaction will be in the "calling" state and the transaction id
     * will equal the branch parameter set in the Via header of the outgoing request.
     * https://tools.ietf.org/html/rfc3261#section-17.1.2
     * @param request - The outgoing Non-INVITE request.
     * @param transport - The transport.
     * @param user - The transaction user.
     */
    constructor(request, transport, user) {
        super(request, transport, user, TransactionState.Trying, "sip.transaction.nict");
        // FIXME: Timer E for unreliable transports not implemented.
        //
        // The "Trying" state is entered when the TU initiates a new client
        // transaction with a request.  When entering this state, the client
        // transaction SHOULD set timer F to fire in 64*T1 seconds. The request
        // MUST be passed to the transport layer for transmission.
        // https://tools.ietf.org/html/rfc3261#section-17.1.2.2
        this.F = setTimeout(() => this.timerF(), Timers.TIMER_F);
        this.send(request.toString()).catch((error) => {
            this.logTransportError(error, "Failed to send initial outgoing request.");
        });
    }
    /**
     * Destructor.
     */
    dispose() {
        if (this.F) {
            clearTimeout(this.F);
            this.F = undefined;
        }
        if (this.K) {
            clearTimeout(this.K);
            this.K = undefined;
        }
        super.dispose();
    }
    /** Transaction kind. Deprecated. */
    get kind() {
        return "nict";
    }
    /**
     * Handler for incoming responses from the transport which match this transaction.
     * @param response - The incoming response.
     */
    receiveResponse(response) {
        const statusCode = response.statusCode;
        if (!statusCode || statusCode < 100 || statusCode > 699) {
            throw new Error(`Invalid status code ${statusCode}`);
        }
        switch (this.state) {
            case TransactionState.Trying:
                // If a provisional response is received while in the "Trying" state, the
                // response MUST be passed to the TU, and then the client transaction
                // SHOULD move to the "Proceeding" state.
                // https://tools.ietf.org/html/rfc3261#section-17.1.2.2
                if (statusCode >= 100 && statusCode <= 199) {
                    this.stateTransition(TransactionState.Proceeding);
                    if (this.user.receiveResponse) {
                        this.user.receiveResponse(response);
                    }
                    return;
                }
                // If a final response (status codes 200-699) is received while in the
                // "Trying" state, the response MUST be passed to the TU, and the
                // client transaction MUST transition to the "Completed" state.
                // https://tools.ietf.org/html/rfc3261#section-17.1.2.2
                if (statusCode >= 200 && statusCode <= 699) {
                    this.stateTransition(TransactionState.Completed);
                    if (statusCode === 408) {
                        this.onRequestTimeout();
                        return;
                    }
                    if (this.user.receiveResponse) {
                        this.user.receiveResponse(response);
                    }
                    return;
                }
                break;
            case TransactionState.Proceeding:
                // If a provisional response is received while in the "Proceeding" state,
                // the response MUST be passed to the TU. (From Figure 6)
                // https://tools.ietf.org/html/rfc3261#section-17.1.2.2
                if (statusCode >= 100 && statusCode <= 199) {
                    if (this.user.receiveResponse) {
                        return this.user.receiveResponse(response);
                    }
                }
                // If a final response (status codes 200-699) is received while in the
                // "Proceeding" state, the response MUST be passed to the TU, and the
                // client transaction MUST transition to the "Completed" state.
                // https://tools.ietf.org/html/rfc3261#section-17.1.2.2
                if (statusCode >= 200 && statusCode <= 699) {
                    this.stateTransition(TransactionState.Completed);
                    if (statusCode === 408) {
                        this.onRequestTimeout();
                        return;
                    }
                    if (this.user.receiveResponse) {
                        this.user.receiveResponse(response);
                    }
                    return;
                }
                break;
            case TransactionState.Completed:
                // The "Completed" state exists to buffer any additional response
                // retransmissions that may be received (which is why the client
                // transaction remains there only for unreliable transports).
                // https://tools.ietf.org/html/rfc3261#section-17.1.2.2
                return;
            case TransactionState.Terminated:
                // For good measure just absorb additional response retransmissions.
                return;
            default:
                throw new Error(`Invalid state ${this.state}`);
        }
        const message = `Non-INVITE client transaction received unexpected ${statusCode} response while in state ${this.state}.`;
        this.logger.warn(message);
        return;
    }
    /**
     * The client transaction SHOULD inform the TU that a transport failure has occurred,
     * and the client transaction SHOULD transition directly to the "Terminated" state.
     * The TU will handle the fail over mechanisms described in [4].
     * https://tools.ietf.org/html/rfc3261#section-17.1.4
     * @param error - Transport error
     */
    onTransportError(error) {
        if (this.user.onTransportError) {
            this.user.onTransportError(error);
        }
        this.stateTransition(TransactionState.Terminated, true);
    }
    /** For logging. */
    typeToString() {
        return "non-INVITE client transaction";
    }
    /**
     * Execute a state transition.
     * @param newState - New state.
     */
    stateTransition(newState, dueToTransportError = false) {
        // Assert valid state transitions.
        const invalidStateTransition = () => {
            throw new Error(`Invalid state transition from ${this.state} to ${newState}`);
        };
        switch (newState) {
            case TransactionState.Trying:
                invalidStateTransition();
                break;
            case TransactionState.Proceeding:
                if (this.state !== TransactionState.Trying) {
                    invalidStateTransition();
                }
                break;
            case TransactionState.Completed:
                if (this.state !== TransactionState.Trying && this.state !== TransactionState.Proceeding) {
                    invalidStateTransition();
                }
                break;
            case TransactionState.Terminated:
                if (this.state !== TransactionState.Trying &&
                    this.state !== TransactionState.Proceeding &&
                    this.state !== TransactionState.Completed) {
                    if (!dueToTransportError) {
                        invalidStateTransition();
                    }
                }
                break;
            default:
                invalidStateTransition();
        }
        // Once the client transaction enters the "Completed" state, it MUST set
        // Timer K to fire in T4 seconds for unreliable transports, and zero
        // seconds for reliable transports  The "Completed" state exists to
        // buffer any additional response retransmissions that may be received
        // (which is why the client transaction remains there only for unreliable transports).
        // https://tools.ietf.org/html/rfc3261#section-17.1.2.2
        if (newState === TransactionState.Completed) {
            if (this.F) {
                clearTimeout(this.F);
                this.F = undefined;
            }
            this.K = setTimeout(() => this.timerK(), Timers.TIMER_K);
        }
        // Once the transaction is in the terminated state, it MUST be destroyed immediately.
        // https://tools.ietf.org/html/rfc3261#section-17.1.2.2
        if (newState === TransactionState.Terminated) {
            this.dispose();
        }
        // Update state.
        this.setState(newState);
    }
    /**
     * If Timer F fires while the client transaction is still in the
     * "Trying" state, the client transaction SHOULD inform the TU about the
     * timeout, and then it SHOULD enter the "Terminated" state.
     * If timer F fires while in the "Proceeding" state, the TU MUST be informed of
     * a timeout, and the client transaction MUST transition to the terminated state.
     * https://tools.ietf.org/html/rfc3261#section-17.1.2.2
     */
    timerF() {
        this.logger.debug(`Timer F expired for non-INVITE client transaction ${this.id}.`);
        if (this.state === TransactionState.Trying || this.state === TransactionState.Proceeding) {
            this.onRequestTimeout();
            this.stateTransition(TransactionState.Terminated);
        }
    }
    /**
     * If Timer K fires while in this (COMPLETED) state, the client transaction
     * MUST transition to the "Terminated" state.
     * https://tools.ietf.org/html/rfc3261#section-17.1.2.2
     */
    timerK() {
        if (this.state === TransactionState.Completed) {
            this.stateTransition(TransactionState.Terminated);
        }
    }
}

/**
 * Dialog.
 * @remarks
 * A key concept for a user agent is that of a dialog.  A dialog
 * represents a peer-to-peer SIP relationship between two user agents
 * that persists for some time.  The dialog facilitates sequencing of
 * messages between the user agents and proper routing of requests
 * between both of them.  The dialog represents a context in which to
 * interpret SIP messages.
 * https://tools.ietf.org/html/rfc3261#section-12
 * @public
 */
class Dialog {
    /**
     * Dialog constructor.
     * @param core - User agent core.
     * @param dialogState - Initial dialog state.
     */
    constructor(core, dialogState) {
        this.core = core;
        this.dialogState = dialogState;
        this.core.dialogs.set(this.id, this);
    }
    /**
     * When a UAC receives a response that establishes a dialog, it
     * constructs the state of the dialog.  This state MUST be maintained
     * for the duration of the dialog.
     * https://tools.ietf.org/html/rfc3261#section-12.1.2
     * @param outgoingRequestMessage - Outgoing request message for dialog.
     * @param incomingResponseMessage - Incoming response message creating dialog.
     */
    static initialDialogStateForUserAgentClient(outgoingRequestMessage, incomingResponseMessage) {
        // If the request was sent over TLS, and the Request-URI contained a
        // SIPS URI, the "secure" flag is set to TRUE.
        // https://tools.ietf.org/html/rfc3261#section-12.1.2
        const secure = false; // FIXME: Currently no support for TLS.
        // The route set MUST be set to the list of URIs in the Record-Route
        // header field from the response, taken in reverse order and preserving
        // all URI parameters.  If no Record-Route header field is present in
        // the response, the route set MUST be set to the empty set.  This route
        // set, even if empty, overrides any pre-existing route set for future
        // requests in this dialog.  The remote target MUST be set to the URI
        // from the Contact header field of the response.
        // https://tools.ietf.org/html/rfc3261#section-12.1.2
        const routeSet = incomingResponseMessage.getHeaders("record-route").reverse();
        // When a UAS responds to a request with a response that establishes a
        // dialog (such as a 2xx to INVITE), the UAS MUST copy all Record-Route
        // header field values from the request into the response (including the
        // URIs, URI parameters, and any Record-Route header field parameters,
        // whether they are known or unknown to the UAS) and MUST maintain the
        // order of those values.  The UAS MUST add a Contact header field to
        // the response.
        // https://tools.ietf.org/html/rfc3261#section-12.1.1
        const contact = incomingResponseMessage.parseHeader("contact");
        if (!contact) {
            // TODO: Review to make sure this will never happen
            throw new Error("Contact undefined.");
        }
        if (!(contact instanceof NameAddrHeader)) {
            throw new Error("Contact not instance of NameAddrHeader.");
        }
        const remoteTarget = contact.uri;
        // The local sequence number MUST be set to the value of the sequence
        // number in the CSeq header field of the request.  The remote sequence
        // number MUST be empty (it is established when the remote UA sends a
        // request within the dialog).  The call identifier component of the
        // dialog ID MUST be set to the value of the Call-ID in the request.
        // The local tag component of the dialog ID MUST be set to the tag in
        // the From field in the request, and the remote tag component of the
        // dialog ID MUST be set to the tag in the To field of the response.  A
        // UAC MUST be prepared to receive a response without a tag in the To
        // field, in which case the tag is considered to have a value of null.
        //
        //    This is to maintain backwards compatibility with RFC 2543, which
        //    did not mandate To tags.
        //
        // https://tools.ietf.org/html/rfc3261#section-12.1.2
        const localSequenceNumber = outgoingRequestMessage.cseq;
        const remoteSequenceNumber = undefined;
        const callId = outgoingRequestMessage.callId;
        const localTag = outgoingRequestMessage.fromTag;
        const remoteTag = incomingResponseMessage.toTag;
        if (!callId) {
            // TODO: Review to make sure this will never happen
            throw new Error("Call id undefined.");
        }
        if (!localTag) {
            // TODO: Review to make sure this will never happen
            throw new Error("From tag undefined.");
        }
        if (!remoteTag) {
            // TODO: Review to make sure this will never happen
            throw new Error("To tag undefined."); // FIXME: No backwards compatibility with RFC 2543
        }
        // The remote URI MUST be set to the URI in the To field, and the local
        // URI MUST be set to the URI in the From field.
        // https://tools.ietf.org/html/rfc3261#section-12.1.2
        if (!outgoingRequestMessage.from) {
            // TODO: Review to make sure this will never happen
            throw new Error("From undefined.");
        }
        if (!outgoingRequestMessage.to) {
            // TODO: Review to make sure this will never happen
            throw new Error("To undefined.");
        }
        const localURI = outgoingRequestMessage.from.uri;
        const remoteURI = outgoingRequestMessage.to.uri;
        // A dialog can also be in the "early" state, which occurs when it is
        // created with a provisional response, and then transition to the
        // "confirmed" state when a 2xx final response arrives.
        // https://tools.ietf.org/html/rfc3261#section-12
        if (!incomingResponseMessage.statusCode) {
            throw new Error("Incoming response status code undefined.");
        }
        const early = incomingResponseMessage.statusCode < 200 ? true : false;
        const dialogState = {
            id: callId + localTag + remoteTag,
            early,
            callId,
            localTag,
            remoteTag,
            localSequenceNumber,
            remoteSequenceNumber,
            localURI,
            remoteURI,
            remoteTarget,
            routeSet,
            secure
        };
        return dialogState;
    }
    /**
     * The UAS then constructs the state of the dialog.  This state MUST be
     * maintained for the duration of the dialog.
     * https://tools.ietf.org/html/rfc3261#section-12.1.1
     * @param incomingRequestMessage - Incoming request message creating dialog.
     * @param toTag - Tag in the To field in the response to the incoming request.
     */
    static initialDialogStateForUserAgentServer(incomingRequestMessage, toTag, early = false) {
        // If the request arrived over TLS, and the Request-URI contained a SIPS
        // URI, the "secure" flag is set to TRUE.
        // https://tools.ietf.org/html/rfc3261#section-12.1.1
        const secure = false; // FIXME: Currently no support for TLS.
        // The route set MUST be set to the list of URIs in the Record-Route
        // header field from the request, taken in order and preserving all URI
        // parameters.  If no Record-Route header field is present in the
        // request, the route set MUST be set to the empty set.  This route set,
        // even if empty, overrides any pre-existing route set for future
        // requests in this dialog.  The remote target MUST be set to the URI
        // from the Contact header field of the request.
        // https://tools.ietf.org/html/rfc3261#section-12.1.1
        const routeSet = incomingRequestMessage.getHeaders("record-route");
        const contact = incomingRequestMessage.parseHeader("contact");
        if (!contact) {
            // TODO: Review to make sure this will never happen
            throw new Error("Contact undefined.");
        }
        if (!(contact instanceof NameAddrHeader)) {
            throw new Error("Contact not instance of NameAddrHeader.");
        }
        const remoteTarget = contact.uri;
        // The remote sequence number MUST be set to the value of the sequence
        // number in the CSeq header field of the request.  The local sequence
        // number MUST be empty.  The call identifier component of the dialog ID
        // MUST be set to the value of the Call-ID in the request.  The local
        // tag component of the dialog ID MUST be set to the tag in the To field
        // in the response to the request (which always includes a tag), and the
        // remote tag component of the dialog ID MUST be set to the tag from the
        // From field in the request.  A UAS MUST be prepared to receive a
        // request without a tag in the From field, in which case the tag is
        // considered to have a value of null.
        //
        //    This is to maintain backwards compatibility with RFC 2543, which
        //    did not mandate From tags.
        //
        // https://tools.ietf.org/html/rfc3261#section-12.1.1
        const remoteSequenceNumber = incomingRequestMessage.cseq;
        const localSequenceNumber = undefined;
        const callId = incomingRequestMessage.callId;
        const localTag = toTag;
        const remoteTag = incomingRequestMessage.fromTag;
        // The remote URI MUST be set to the URI in the From field, and the
        // local URI MUST be set to the URI in the To field.
        // https://tools.ietf.org/html/rfc3261#section-12.1.1
        const remoteURI = incomingRequestMessage.from.uri;
        const localURI = incomingRequestMessage.to.uri;
        const dialogState = {
            id: callId + localTag + remoteTag,
            early,
            callId,
            localTag,
            remoteTag,
            localSequenceNumber,
            remoteSequenceNumber,
            localURI,
            remoteURI,
            remoteTarget,
            routeSet,
            secure
        };
        return dialogState;
    }
    /** Destructor. */
    dispose() {
        this.core.dialogs.delete(this.id);
    }
    /**
     * A dialog is identified at each UA with a dialog ID, which consists of
     * a Call-ID value, a local tag and a remote tag.  The dialog ID at each
     * UA involved in the dialog is not the same.  Specifically, the local
     * tag at one UA is identical to the remote tag at the peer UA.  The
     * tags are opaque tokens that facilitate the generation of unique
     * dialog IDs.
     * https://tools.ietf.org/html/rfc3261#section-12
     */
    get id() {
        return this.dialogState.id;
    }
    /**
     * A dialog can also be in the "early" state, which occurs when it is
     * created with a provisional response, and then it transition to the
     * "confirmed" state when a 2xx final response received or is sent.
     *
     * Note: RFC 3261 is concise on when a dialog is "confirmed", but it
     * can be a point of confusion if an INVITE dialog is "confirmed" after
     * a 2xx is sent or after receiving the ACK for the 2xx response.
     * With careful reading it can be inferred a dialog is always is
     * "confirmed" when the 2xx is sent (regardless of type of dialog).
     * However a INVITE dialog does have additional considerations
     * when it is confirmed but an ACK has not yet been received (in
     * particular with regard to a callee sending BYE requests).
     */
    get early() {
        return this.dialogState.early;
    }
    /** Call identifier component of the dialog id. */
    get callId() {
        return this.dialogState.callId;
    }
    /** Local tag component of the dialog id. */
    get localTag() {
        return this.dialogState.localTag;
    }
    /** Remote tag component of the dialog id. */
    get remoteTag() {
        return this.dialogState.remoteTag;
    }
    /** Local sequence number (used to order requests from the UA to its peer). */
    get localSequenceNumber() {
        return this.dialogState.localSequenceNumber;
    }
    /** Remote sequence number (used to order requests from its peer to the UA). */
    get remoteSequenceNumber() {
        return this.dialogState.remoteSequenceNumber;
    }
    /** Local URI. */
    get localURI() {
        return this.dialogState.localURI;
    }
    /** Remote URI. */
    get remoteURI() {
        return this.dialogState.remoteURI;
    }
    /** Remote target. */
    get remoteTarget() {
        return this.dialogState.remoteTarget;
    }
    /**
     * Route set, which is an ordered list of URIs. The route set is the
     * list of servers that need to be traversed to send a request to the peer.
     */
    get routeSet() {
        return this.dialogState.routeSet;
    }
    /**
     * If the request was sent over TLS, and the Request-URI contained
     * a SIPS URI, the "secure" flag is set to true. *NOT IMPLEMENTED*
     */
    get secure() {
        return this.dialogState.secure;
    }
    /** The user agent core servicing this dialog. */
    get userAgentCore() {
        return this.core;
    }
    /** Confirm the dialog. Only matters if dialog is currently early. */
    confirm() {
        this.dialogState.early = false;
    }
    /**
     * Requests sent within a dialog, as any other requests, are atomic.  If
     * a particular request is accepted by the UAS, all the state changes
     * associated with it are performed.  If the request is rejected, none
     * of the state changes are performed.
     *
     *    Note that some requests, such as INVITEs, affect several pieces of
     *    state.
     *
     * https://tools.ietf.org/html/rfc3261#section-12.2.2
     * @param message - Incoming request message within this dialog.
     */
    receiveRequest(message) {
        // ACK guard.
        // By convention, the handling of ACKs is the responsibility
        // the particular dialog implementation. For example, see SessionDialog.
        // Furthermore, ACKs have same sequence number as the associated INVITE.
        if (message.method === C.ACK) {
            return;
        }
        // If the remote sequence number was not empty, but the sequence number
        // of the request is lower than the remote sequence number, the request
        // is out of order and MUST be rejected with a 500 (Server Internal
        // Error) response.  If the remote sequence number was not empty, and
        // the sequence number of the request is greater than the remote
        // sequence number, the request is in order.  It is possible for the
        // CSeq sequence number to be higher than the remote sequence number by
        // more than one.  This is not an error condition, and a UAS SHOULD be
        // prepared to receive and process requests with CSeq values more than
        // one higher than the previous received request.  The UAS MUST then set
        // the remote sequence number to the value of the sequence number in the
        // CSeq header field value in the request.
        //
        //    If a proxy challenges a request generated by the UAC, the UAC has
        //    to resubmit the request with credentials.  The resubmitted request
        //    will have a new CSeq number.  The UAS will never see the first
        //    request, and thus, it will notice a gap in the CSeq number space.
        //    Such a gap does not represent any error condition.
        //
        // https://tools.ietf.org/html/rfc3261#section-12.2.2
        if (this.remoteSequenceNumber) {
            if (message.cseq <= this.remoteSequenceNumber) {
                throw new Error("Out of sequence in dialog request. Did you forget to call sequenceGuard()?");
            }
            this.dialogState.remoteSequenceNumber = message.cseq;
        }
        // If the remote sequence number is empty, it MUST be set to the value
        // of the sequence number in the CSeq header field value in the request.
        // https://tools.ietf.org/html/rfc3261#section-12.2.2
        if (!this.remoteSequenceNumber) {
            this.dialogState.remoteSequenceNumber = message.cseq;
        }
        // When a UAS receives a target refresh request, it MUST replace the
        // dialog's remote target URI with the URI from the Contact header field
        // in that request, if present.
        // https://tools.ietf.org/html/rfc3261#section-12.2.2
        // Note: "target refresh request" processing delegated to sub-class.
    }
    /**
     * If the dialog identifier in the 2xx response matches the dialog
     * identifier of an existing dialog, the dialog MUST be transitioned to
     * the "confirmed" state, and the route set for the dialog MUST be
     * recomputed based on the 2xx response using the procedures of Section
     * 12.2.1.2.  Otherwise, a new dialog in the "confirmed" state MUST be
     * constructed using the procedures of Section 12.1.2.
     *
     * Note that the only piece of state that is recomputed is the route
     * set.  Other pieces of state such as the highest sequence numbers
     * (remote and local) sent within the dialog are not recomputed.  The
     * route set only is recomputed for backwards compatibility.  RFC
     * 2543 did not mandate mirroring of the Record-Route header field in
     * a 1xx, only 2xx.  However, we cannot update the entire state of
     * the dialog, since mid-dialog requests may have been sent within
     * the early dialog, modifying the sequence numbers, for example.
     *
     *  https://tools.ietf.org/html/rfc3261#section-13.2.2.4
     */
    recomputeRouteSet(message) {
        this.dialogState.routeSet = message.getHeaders("record-route").reverse();
    }
    /**
     * A request within a dialog is constructed by using many of the
     * components of the state stored as part of the dialog.
     * https://tools.ietf.org/html/rfc3261#section-12.2.1.1
     * @param method - Outgoing request method.
     */
    createOutgoingRequestMessage(method, options) {
        // The URI in the To field of the request MUST be set to the remote URI
        // from the dialog state.  The tag in the To header field of the request
        // MUST be set to the remote tag of the dialog ID.  The From URI of the
        // request MUST be set to the local URI from the dialog state.  The tag
        // in the From header field of the request MUST be set to the local tag
        // of the dialog ID.  If the value of the remote or local tags is null,
        // the tag parameter MUST be omitted from the To or From header fields,
        // respectively.
        //
        //    Usage of the URI from the To and From fields in the original
        //    request within subsequent requests is done for backwards
        //    compatibility with RFC 2543, which used the URI for dialog
        //    identification.  In this specification, only the tags are used for
        //    dialog identification.  It is expected that mandatory reflection
        //    of the original To and From URI in mid-dialog requests will be
        //    deprecated in a subsequent revision of this specification.
        // https://tools.ietf.org/html/rfc3261#section-12.2.1.1
        const toUri = this.remoteURI;
        const toTag = this.remoteTag;
        const fromUri = this.localURI;
        const fromTag = this.localTag;
        // The Call-ID of the request MUST be set to the Call-ID of the dialog.
        // Requests within a dialog MUST contain strictly monotonically
        // increasing and contiguous CSeq sequence numbers (increasing-by-one)
        // in each direction (excepting ACK and CANCEL of course, whose numbers
        // equal the requests being acknowledged or cancelled).  Therefore, if
        // the local sequence number is not empty, the value of the local
        // sequence number MUST be incremented by one, and this value MUST be
        // placed into the CSeq header field.  If the local sequence number is
        // empty, an initial value MUST be chosen using the guidelines of
        // Section 8.1.1.5.  The method field in the CSeq header field value
        // MUST match the method of the request.
        // https://tools.ietf.org/html/rfc3261#section-12.2.1.1
        const callId = this.callId;
        let cseq;
        if (options && options.cseq) {
            cseq = options.cseq;
        }
        else if (!this.dialogState.localSequenceNumber) {
            cseq = this.dialogState.localSequenceNumber = 1; // https://tools.ietf.org/html/rfc3261#section-8.1.1.5
        }
        else {
            cseq = this.dialogState.localSequenceNumber += 1;
        }
        // The UAC uses the remote target and route set to build the Request-URI
        // and Route header field of the request.
        //
        // If the route set is empty, the UAC MUST place the remote target URI
        // into the Request-URI.  The UAC MUST NOT add a Route header field to
        // the request.
        //
        // If the route set is not empty, and the first URI in the route set
        // contains the lr parameter (see Section 19.1.1), the UAC MUST place
        // the remote target URI into the Request-URI and MUST include a Route
        // header field containing the route set values in order, including all
        // parameters.
        //
        // If the route set is not empty, and its first URI does not contain the
        // lr parameter, the UAC MUST place the first URI from the route set
        // into the Request-URI, stripping any parameters that are not allowed
        // in a Request-URI.  The UAC MUST add a Route header field containing
        // the remainder of the route set values in order, including all
        // parameters.  The UAC MUST then place the remote target URI into the
        // Route header field as the last value.
        // https://tools.ietf.org/html/rfc3261#section-12.2.1.1
        // The lr parameter, when present, indicates that the element
        // responsible for this resource implements the routing mechanisms
        // specified in this document.  This parameter will be used in the
        // URIs proxies place into Record-Route header field values, and
        // may appear in the URIs in a pre-existing route set.
        //
        // This parameter is used to achieve backwards compatibility with
        // systems implementing the strict-routing mechanisms of RFC 2543
        // and the rfc2543bis drafts up to bis-05.  An element preparing
        // to send a request based on a URI not containing this parameter
        // can assume the receiving element implements strict-routing and
        // reformat the message to preserve the information in the
        // Request-URI.
        // https://tools.ietf.org/html/rfc3261#section-19.1.1
        // NOTE: Not backwards compatible with RFC 2543 (no support for strict-routing).
        const ruri = this.remoteTarget;
        const routeSet = this.routeSet;
        const extraHeaders = options && options.extraHeaders;
        const body = options && options.body;
        // The relative order of header fields with different field names is not
        // significant.  However, it is RECOMMENDED that header fields which are
        // needed for proxy processing (Via, Route, Record-Route, Proxy-Require,
        // Max-Forwards, and Proxy-Authorization, for example) appear towards
        // the top of the message to facilitate rapid parsing.
        // https://tools.ietf.org/html/rfc3261#section-7.3.1
        const message = this.userAgentCore.makeOutgoingRequestMessage(method, ruri, fromUri, toUri, {
            callId,
            cseq,
            fromTag,
            toTag,
            routeSet
        }, extraHeaders, body);
        return message;
    }
    /**
     * Increment the local sequence number by one.
     * It feels like this should be protected, but the current authentication handling currently
     * needs this to keep the dialog in sync when "auto re-sends" request messages.
     * @internal
     */
    incrementLocalSequenceNumber() {
        if (!this.dialogState.localSequenceNumber) {
            throw new Error("Local sequence number undefined.");
        }
        this.dialogState.localSequenceNumber += 1;
    }
    /**
     * If the remote sequence number was not empty, but the sequence number
     * of the request is lower than the remote sequence number, the request
     * is out of order and MUST be rejected with a 500 (Server Internal
     * Error) response.
     * https://tools.ietf.org/html/rfc3261#section-12.2.2
     * @param request - Incoming request to guard.
     * @returns True if the program execution is to continue in the branch in question.
     *          Otherwise a 500 Server Internal Error was stateless sent and request processing must stop.
     */
    sequenceGuard(message) {
        // ACK guard.
        // By convention, handling of unexpected ACKs is responsibility
        // the particular dialog implementation. For example, see SessionDialog.
        // Furthermore, we cannot reply to an "out of sequence" ACK.
        if (message.method === C.ACK) {
            return true;
        }
        // Note: We are rejecting on "less than or equal to" the remote
        // sequence number (excepting ACK whose numbers equal the requests
        // being acknowledged or cancelled), which is the correct thing to
        // do in our case. The only time a request with the same sequence number
        // will show up here if is a) it is a very late retransmission of a
        // request we already handled or b) it is a different request with the
        // same sequence number which would be violation of the standard.
        // Request retransmissions are absorbed by the transaction layer,
        // so any request with a duplicate sequence number getting here
        // would have to be a retransmission after the transaction terminated
        // or a broken request (with unique via branch value).
        // Requests within a dialog MUST contain strictly monotonically
        // increasing and contiguous CSeq sequence numbers (increasing-by-one)
        // in each direction (excepting ACK and CANCEL of course, whose numbers
        // equal the requests being acknowledged or cancelled).  Therefore, if
        // the local sequence number is not empty, the value of the local
        // sequence number MUST be incremented by one, and this value MUST be
        // placed into the CSeq header field.
        // https://tools.ietf.org/html/rfc3261#section-12.2.1.1
        if (this.remoteSequenceNumber && message.cseq <= this.remoteSequenceNumber) {
            this.core.replyStateless(message, { statusCode: 500 });
            return false;
        }
        return true;
    }
}

/**
 * INVITE Client Transaction.
 * @remarks
 * The INVITE transaction consists of a three-way handshake.  The client
 * transaction sends an INVITE, the server transaction sends responses,
 * and the client transaction sends an ACK.
 * https://tools.ietf.org/html/rfc3261#section-17.1.1
 * @public
 */
class InviteClientTransaction extends ClientTransaction {
    /**
     * Constructor.
     * Upon construction, the outgoing request's Via header is updated by calling `setViaHeader`.
     * Then `toString` is called on the outgoing request and the message is sent via the transport.
     * After construction the transaction will be in the "calling" state and the transaction id
     * will equal the branch parameter set in the Via header of the outgoing request.
     * https://tools.ietf.org/html/rfc3261#section-17.1.1
     * @param request - The outgoing INVITE request.
     * @param transport - The transport.
     * @param user - The transaction user.
     */
    constructor(request, transport, user) {
        super(request, transport, user, TransactionState.Calling, "sip.transaction.ict");
        /**
         * Map of 2xx to-tag to ACK.
         * If value is not undefined, value is the ACK which was sent.
         * If key exists but value is undefined, a 2xx was received but the ACK not yet sent.
         * Otherwise, a 2xx was not (yet) received for this transaction.
         */
        this.ackRetransmissionCache = new Map();
        // FIXME: Timer A for unreliable transport not implemented
        //
        // If an unreliable transport is being used, the client transaction
        // MUST start timer A with a value of T1. If a reliable transport is being used,
        // the client transaction SHOULD NOT start timer A (Timer A controls request retransmissions).
        // For any transport, the client transaction MUST start timer B with a value
        // of 64*T1 seconds (Timer B controls transaction timeouts).
        // https://tools.ietf.org/html/rfc3261#section-17.1.1.2
        //
        // While not spelled out in the RFC, Timer B is the maximum amount of time that a sender
        // will wait for an INVITE message to be acknowledged (a SIP response message is received).
        // So Timer B should be cleared when the transaction state proceeds from "Calling".
        this.B = setTimeout(() => this.timerB(), Timers.TIMER_B);
        this.send(request.toString()).catch((error) => {
            this.logTransportError(error, "Failed to send initial outgoing request.");
        });
    }
    /**
     * Destructor.
     */
    dispose() {
        if (this.B) {
            clearTimeout(this.B);
            this.B = undefined;
        }
        if (this.D) {
            clearTimeout(this.D);
            this.D = undefined;
        }
        if (this.M) {
            clearTimeout(this.M);
            this.M = undefined;
        }
        super.dispose();
    }
    /** Transaction kind. Deprecated. */
    get kind() {
        return "ict";
    }
    /**
     * ACK a 2xx final response.
     *
     * The transaction includes the ACK only if the final response was not a 2xx response (the
     * transaction will generate and send the ACK to the transport automagically). If the
     * final response was a 2xx, the ACK is not considered part of the transaction (the
     * transaction user needs to generate and send the ACK).
     *
     * This library is not strictly RFC compliant with regard to ACK handling for 2xx final
     * responses. Specifically, retransmissions of ACKs to a 2xx final responses is handled
     * by the transaction layer (instead of the UAC core). The "standard" approach is for
     * the UAC core to receive all 2xx responses and manage sending ACK retransmissions to
     * the transport directly. Herein the transaction layer manages sending ACKs to 2xx responses
     * and any retransmissions of those ACKs as needed.
     *
     * @param ack - The outgoing ACK request.
     */
    ackResponse(ack) {
        const toTag = ack.toTag;
        if (!toTag) {
            throw new Error("To tag undefined.");
        }
        const id = "z9hG4bK" + Math.floor(Math.random() * 10000000);
        ack.setViaHeader(id, this.transport.protocol);
        this.ackRetransmissionCache.set(toTag, ack); // Add to ACK retransmission cache
        this.send(ack.toString()).catch((error) => {
            this.logTransportError(error, "Failed to send ACK to 2xx response.");
        });
    }
    /**
     * Handler for incoming responses from the transport which match this transaction.
     * @param response - The incoming response.
     */
    receiveResponse(response) {
        const statusCode = response.statusCode;
        if (!statusCode || statusCode < 100 || statusCode > 699) {
            throw new Error(`Invalid status code ${statusCode}`);
        }
        switch (this.state) {
            case TransactionState.Calling:
                // If the client transaction receives a provisional response while in
                // the "Calling" state, it transitions to the "Proceeding" state. In the
                // "Proceeding" state, the client transaction SHOULD NOT retransmit the
                // request any longer. Furthermore, the provisional response MUST be
                // passed to the TU.  Any further provisional responses MUST be passed
                // up to the TU while in the "Proceeding" state.
                // https://tools.ietf.org/html/rfc3261#section-17.1.1.2
                if (statusCode >= 100 && statusCode <= 199) {
                    this.stateTransition(TransactionState.Proceeding);
                    if (this.user.receiveResponse) {
                        this.user.receiveResponse(response);
                    }
                    return;
                }
                // When a 2xx response is received while in either the "Calling" or
                // "Proceeding" states, the client transaction MUST transition to
                // the "Accepted" state... The 2xx response MUST be passed up to the TU.
                // The client transaction MUST NOT generate an ACK to the 2xx response -- its
                // handling is delegated to the TU. A UAC core will send an ACK to
                // the 2xx response using a new transaction.
                // https://tools.ietf.org/html/rfc6026#section-8.4
                if (statusCode >= 200 && statusCode <= 299) {
                    this.ackRetransmissionCache.set(response.toTag, undefined); // Prime the ACK cache
                    this.stateTransition(TransactionState.Accepted);
                    if (this.user.receiveResponse) {
                        this.user.receiveResponse(response);
                    }
                    return;
                }
                // When in either the "Calling" or "Proceeding" states, reception of
                // a response with status code from 300-699 MUST cause the client
                // transaction to transition to "Completed". The client transaction
                // MUST pass the received response up to the TU, and the client
                // transaction MUST generate an ACK request, even if the transport is
                // reliable (guidelines for constructing the ACK from the response
                // are given in Section 17.1.1.3), and then pass the ACK to the
                // transport layer for transmission. The ACK MUST be sent to the
                // same address, port, and transport to which the original request was sent.
                // https://tools.ietf.org/html/rfc6026#section-8.4
                if (statusCode >= 300 && statusCode <= 699) {
                    this.stateTransition(TransactionState.Completed);
                    this.ack(response);
                    if (this.user.receiveResponse) {
                        this.user.receiveResponse(response);
                    }
                    return;
                }
                break;
            case TransactionState.Proceeding:
                // In the "Proceeding" state, the client transaction SHOULD NOT retransmit the
                // request any longer. Furthermore, the provisional response MUST be
                // passed to the TU.  Any further provisional responses MUST be passed
                // up to the TU while in the "Proceeding" state.
                // https://tools.ietf.org/html/rfc3261#section-17.1.1.2
                if (statusCode >= 100 && statusCode <= 199) {
                    if (this.user.receiveResponse) {
                        this.user.receiveResponse(response);
                    }
                    return;
                }
                // When a 2xx response is received while in either the "Calling" or "Proceeding" states,
                // the client transaction MUST transition to the "Accepted" state...
                // The 2xx response MUST be passed up to the TU. The client
                // transaction MUST NOT generate an ACK to the 2xx response -- its
                // handling is delegated to the TU. A UAC core will send an ACK to
                // the 2xx response using a new transaction.
                // https://tools.ietf.org/html/rfc6026#section-8.4
                if (statusCode >= 200 && statusCode <= 299) {
                    this.ackRetransmissionCache.set(response.toTag, undefined); // Prime the ACK cache
                    this.stateTransition(TransactionState.Accepted);
                    if (this.user.receiveResponse) {
                        this.user.receiveResponse(response);
                    }
                    return;
                }
                // When in either the "Calling" or "Proceeding" states, reception of
                // a response with status code from 300-699 MUST cause the client
                // transaction to transition to "Completed". The client transaction
                // MUST pass the received response up to the TU, and the client
                // transaction MUST generate an ACK request, even if the transport is
                // reliable (guidelines for constructing the ACK from the response
                // are given in Section 17.1.1.3), and then pass the ACK to the
                // transport layer for transmission. The ACK MUST be sent to the
                // same address, port, and transport to which the original request was sent.
                // https://tools.ietf.org/html/rfc6026#section-8.4
                if (statusCode >= 300 && statusCode <= 699) {
                    this.stateTransition(TransactionState.Completed);
                    this.ack(response);
                    if (this.user.receiveResponse) {
                        this.user.receiveResponse(response);
                    }
                    return;
                }
                break;
            case TransactionState.Accepted:
                // The purpose of the "Accepted" state is to allow the client
                // transaction to continue to exist to receive, and pass to the TU,
                // any retransmissions of the 2xx response and any additional 2xx
                // responses from other branches of the INVITE if it forked
                // downstream. Timer M reflects the amount of time that the
                // transaction user will wait for such messages.
                //
                // Any 2xx responses that match this client transaction and that are
                // received while in the "Accepted" state MUST be passed up to the
                // TU. The client transaction MUST NOT generate an ACK to the 2xx
                // response. The client transaction takes no further action.
                // https://tools.ietf.org/html/rfc6026#section-8.4
                if (statusCode >= 200 && statusCode <= 299) {
                    // NOTE: This implementation herein is intentionally not RFC compliant.
                    // While the first 2xx response for a given branch is passed up to the TU,
                    // retransmissions of 2xx responses are absorbed and the ACK associated
                    // with the original response is resent. This approach is taken because
                    // our current transaction users are not currently in a good position to
                    // deal with 2xx retransmission. This SHOULD NOT cause any compliance issues - ;)
                    //
                    // If we don't have a cache hit, pass the response to the TU.
                    if (!this.ackRetransmissionCache.has(response.toTag)) {
                        this.ackRetransmissionCache.set(response.toTag, undefined); // Prime the ACK cache
                        if (this.user.receiveResponse) {
                            this.user.receiveResponse(response);
                        }
                        return;
                    }
                    // If we have a cache hit, try pulling the ACK from cache and retransmitting it.
                    const ack = this.ackRetransmissionCache.get(response.toTag);
                    if (ack) {
                        this.send(ack.toString()).catch((error) => {
                            this.logTransportError(error, "Failed to send retransmission of ACK to 2xx response.");
                        });
                        return;
                    }
                    // If an ACK was not found in cache then we have received a retransmitted 2xx
                    // response before the TU responded to the original response (we don't have an ACK yet).
                    // So discard this response under the assumption that the TU will eventually
                    // get us a ACK for the original response.
                    return;
                }
                break;
            case TransactionState.Completed:
                // Any retransmissions of a response with status code 300-699 that
                // are received while in the "Completed" state MUST cause the ACK to
                // be re-passed to the transport layer for retransmission, but the
                // newly received response MUST NOT be passed up to the TU.
                // https://tools.ietf.org/html/rfc6026#section-8.4
                if (statusCode >= 300 && statusCode <= 699) {
                    this.ack(response);
                    return;
                }
                break;
            case TransactionState.Terminated:
                break;
            default:
                throw new Error(`Invalid state ${this.state}`);
        }
        // Any response received that does not match an existing client
        // transaction state machine is simply dropped. (Implementations are,
        // of course, free to log or do other implementation-specific things
        // with such responses, but the implementer should be sure to consider
        // the impact of large numbers of malicious stray responses.)
        // https://tools.ietf.org/html/rfc6026#section-7.2
        const message = `Received unexpected ${statusCode} response while in state ${this.state}.`;
        this.logger.warn(message);
        return;
    }
    /**
     * The client transaction SHOULD inform the TU that a transport failure
     * has occurred, and the client transaction SHOULD transition directly
     * to the "Terminated" state.  The TU will handle the failover
     * mechanisms described in [4].
     * https://tools.ietf.org/html/rfc3261#section-17.1.4
     * @param error - The error.
     */
    onTransportError(error) {
        if (this.user.onTransportError) {
            this.user.onTransportError(error);
        }
        this.stateTransition(TransactionState.Terminated, true);
    }
    /** For logging. */
    typeToString() {
        return "INVITE client transaction";
    }
    ack(response) {
        // The ACK request constructed by the client transaction MUST contain
        // values for the Call-ID, From, and Request-URI that are equal to the
        // values of those header fields in the request passed to the transport
        // by the client transaction (call this the "original request"). The To
        // header field in the ACK MUST equal the To header field in the
        // response being acknowledged, and therefore will usually differ from
        // the To header field in the original request by the addition of the
        // tag parameter. The ACK MUST contain a single Via header field, and
        // this MUST be equal to the top Via header field of the original
        // request. The CSeq header field in the ACK MUST contain the same
        // value for the sequence number as was present in the original request,
        // but the method parameter MUST be equal to "ACK".
        //
        // If the INVITE request whose response is being acknowledged had Route
        // header fields, those header fields MUST appear in the ACK. This is
        // to ensure that the ACK can be routed properly through any downstream
        // stateless proxies.
        // https://tools.ietf.org/html/rfc3261#section-17.1.1.3
        const ruri = this.request.ruri;
        const callId = this.request.callId;
        const cseq = this.request.cseq;
        const from = this.request.getHeader("from");
        const to = response.getHeader("to");
        const via = this.request.getHeader("via");
        const route = this.request.getHeader("route");
        if (!from) {
            throw new Error("From undefined.");
        }
        if (!to) {
            throw new Error("To undefined.");
        }
        if (!via) {
            throw new Error("Via undefined.");
        }
        let ack = `ACK ${ruri} SIP/2.0\r\n`;
        if (route) {
            ack += `Route: ${route}\r\n`;
        }
        ack += `Via: ${via}\r\n`;
        ack += `To: ${to}\r\n`;
        ack += `From: ${from}\r\n`;
        ack += `Call-ID: ${callId}\r\n`;
        ack += `CSeq: ${cseq} ACK\r\n`;
        ack += `Max-Forwards: 70\r\n`;
        ack += `Content-Length: 0\r\n\r\n`;
        // TOOO: "User-Agent" header
        this.send(ack).catch((error) => {
            this.logTransportError(error, "Failed to send ACK to non-2xx response.");
        });
        return;
    }
    /**
     * Execute a state transition.
     * @param newState - New state.
     */
    stateTransition(newState, dueToTransportError = false) {
        // Assert valid state transitions.
        const invalidStateTransition = () => {
            throw new Error(`Invalid state transition from ${this.state} to ${newState}`);
        };
        switch (newState) {
            case TransactionState.Calling:
                invalidStateTransition();
                break;
            case TransactionState.Proceeding:
                if (this.state !== TransactionState.Calling) {
                    invalidStateTransition();
                }
                break;
            case TransactionState.Accepted:
            case TransactionState.Completed:
                if (this.state !== TransactionState.Calling && this.state !== TransactionState.Proceeding) {
                    invalidStateTransition();
                }
                break;
            case TransactionState.Terminated:
                if (this.state !== TransactionState.Calling &&
                    this.state !== TransactionState.Accepted &&
                    this.state !== TransactionState.Completed) {
                    if (!dueToTransportError) {
                        invalidStateTransition();
                    }
                }
                break;
            default:
                invalidStateTransition();
        }
        // While not spelled out in the RFC, Timer B is the maximum amount of time that a sender
        // will wait for an INVITE message to be acknowledged (a SIP response message is received).
        // So Timer B should be cleared when the transaction state proceeds from "Calling".
        if (this.B) {
            clearTimeout(this.B);
            this.B = undefined;
        }
        if (newState === TransactionState.Proceeding) ;
        // The client transaction MUST start Timer D when it enters the "Completed" state
        // for any reason, with a value of at least 32 seconds for unreliable transports,
        // and a value of zero seconds for reliable transports.
        // https://tools.ietf.org/html/rfc6026#section-8.4
        if (newState === TransactionState.Completed) {
            this.D = setTimeout(() => this.timerD(), Timers.TIMER_D);
        }
        // The client transaction MUST transition to the "Accepted" state,
        // and Timer M MUST be started with a value of 64*T1.
        // https://tools.ietf.org/html/rfc6026#section-8.4
        if (newState === TransactionState.Accepted) {
            this.M = setTimeout(() => this.timerM(), Timers.TIMER_M);
        }
        // Once the transaction is in the "Terminated" state, it MUST be destroyed immediately.
        // https://tools.ietf.org/html/rfc6026#section-8.7
        if (newState === TransactionState.Terminated) {
            this.dispose();
        }
        // Update state.
        this.setState(newState);
    }
    /**
     * When timer A fires, the client transaction MUST retransmit the
     * request by passing it to the transport layer, and MUST reset the
     * timer with a value of 2*T1.
     * When timer A fires 2*T1 seconds later, the request MUST be
     * retransmitted again (assuming the client transaction is still in this
     * state). This process MUST continue so that the request is
     * retransmitted with intervals that double after each transmission.
     * These retransmissions SHOULD only be done while the client
     * transaction is in the "Calling" state.
     * https://tools.ietf.org/html/rfc3261#section-17.1.1.2
     */
    timerA() {
        // TODO
    }
    /**
     * If the client transaction is still in the "Calling" state when timer
     * B fires, the client transaction SHOULD inform the TU that a timeout
     * has occurred.  The client transaction MUST NOT generate an ACK.
     * https://tools.ietf.org/html/rfc3261#section-17.1.1.2
     */
    timerB() {
        this.logger.debug(`Timer B expired for INVITE client transaction ${this.id}.`);
        if (this.state === TransactionState.Calling) {
            this.onRequestTimeout();
            this.stateTransition(TransactionState.Terminated);
        }
    }
    /**
     * If Timer D fires while the client transaction is in the "Completed" state,
     * the client transaction MUST move to the "Terminated" state.
     * https://tools.ietf.org/html/rfc6026#section-8.4
     */
    timerD() {
        this.logger.debug(`Timer D expired for INVITE client transaction ${this.id}.`);
        if (this.state === TransactionState.Completed) {
            this.stateTransition(TransactionState.Terminated);
        }
    }
    /**
     * If Timer M fires while the client transaction is in the "Accepted"
     * state, the client transaction MUST move to the "Terminated" state.
     * https://tools.ietf.org/html/rfc6026#section-8.4
     */
    timerM() {
        this.logger.debug(`Timer M expired for INVITE client transaction ${this.id}.`);
        if (this.state === TransactionState.Accepted) {
            this.stateTransition(TransactionState.Terminated);
        }
    }
}

/**
 * User Agent Client (UAC).
 * @remarks
 * A user agent client is a logical entity
 * that creates a new request, and then uses the client
 * transaction state machinery to send it.  The role of UAC lasts
 * only for the duration of that transaction.  In other words, if
 * a piece of software initiates a request, it acts as a UAC for
 * the duration of that transaction.  If it receives a request
 * later, it assumes the role of a user agent server for the
 * processing of that transaction.
 * https://tools.ietf.org/html/rfc3261#section-6
 * @public
 */
class UserAgentClient {
    constructor(transactionConstructor, core, message, delegate) {
        this.transactionConstructor = transactionConstructor;
        this.core = core;
        this.message = message;
        this.delegate = delegate;
        this.challenged = false;
        this.stale = false;
        this.logger = this.loggerFactory.getLogger("sip.user-agent-client");
        this.init();
    }
    dispose() {
        this.transaction.dispose();
    }
    get loggerFactory() {
        return this.core.loggerFactory;
    }
    /** The transaction associated with this request. */
    get transaction() {
        if (!this._transaction) {
            throw new Error("Transaction undefined.");
        }
        return this._transaction;
    }
    /**
     * Since requests other than INVITE are responded to immediately, sending a
     * CANCEL for a non-INVITE request would always create a race condition.
     * A CANCEL request SHOULD NOT be sent to cancel a request other than INVITE.
     * https://tools.ietf.org/html/rfc3261#section-9.1
     * @param options - Cancel options bucket.
     */
    cancel(reason, options = {}) {
        if (!this.transaction) {
            throw new Error("Transaction undefined.");
        }
        if (!this.message.to) {
            throw new Error("To undefined.");
        }
        if (!this.message.from) {
            throw new Error("From undefined.");
        }
        // The following procedures are used to construct a CANCEL request.  The
        // Request-URI, Call-ID, To, the numeric part of CSeq, and From header
        // fields in the CANCEL request MUST be identical to those in the
        // request being cancelled, including tags.  A CANCEL constructed by a
        // client MUST have only a single Via header field value matching the
        // top Via value in the request being cancelled.  Using the same values
        // for these header fields allows the CANCEL to be matched with the
        // request it cancels (Section 9.2 indicates how such matching occurs).
        // However, the method part of the CSeq header field MUST have a value
        // of CANCEL.  This allows it to be identified and processed as a
        // transaction in its own right (See Section 17).
        // https://tools.ietf.org/html/rfc3261#section-9.1
        const message = this.core.makeOutgoingRequestMessage(C.CANCEL, this.message.ruri, this.message.from.uri, this.message.to.uri, {
            toTag: this.message.toTag,
            fromTag: this.message.fromTag,
            callId: this.message.callId,
            cseq: this.message.cseq
        }, options.extraHeaders);
        // TODO: Revisit this.
        // The CANCEL needs to use the same branch parameter so that
        // it matches the INVITE transaction, but this is a hacky way to do this.
        // Or at the very least not well documented. If the the branch parameter
        // is set on the outgoing request, the transaction will use it.
        // Otherwise the transaction will make a new one.
        message.branch = this.message.branch;
        if (this.message.headers.Route) {
            message.headers.Route = this.message.headers.Route;
        }
        if (reason) {
            message.setHeader("Reason", reason);
        }
        // If no provisional response has been received, the CANCEL request MUST
        // NOT be sent; rather, the client MUST wait for the arrival of a
        // provisional response before sending the request. If the original
        // request has generated a final response, the CANCEL SHOULD NOT be
        // sent, as it is an effective no-op, since CANCEL has no effect on
        // requests that have already generated a final response.
        // https://tools.ietf.org/html/rfc3261#section-9.1
        if (this.transaction.state === TransactionState.Proceeding) {
            new UserAgentClient(NonInviteClientTransaction, this.core, message);
        }
        else {
            this.transaction.addStateChangeListener(() => {
                if (this.transaction && this.transaction.state === TransactionState.Proceeding) {
                    new UserAgentClient(NonInviteClientTransaction, this.core, message);
                }
            }, { once: true });
        }
        return message;
    }
    /**
     * If a 401 (Unauthorized) or 407 (Proxy Authentication Required)
     * response is received, the UAC SHOULD follow the authorization
     * procedures of Section 22.2 and Section 22.3 to retry the request with
     * credentials.
     * https://tools.ietf.org/html/rfc3261#section-8.1.3.5
     * 22 Usage of HTTP Authentication
     * https://tools.ietf.org/html/rfc3261#section-22
     * 22.1 Framework
     * https://tools.ietf.org/html/rfc3261#section-22.1
     * 22.2 User-to-User Authentication
     * https://tools.ietf.org/html/rfc3261#section-22.2
     * 22.3 Proxy-to-User Authentication
     * https://tools.ietf.org/html/rfc3261#section-22.3
     *
     * FIXME: This "guard for and retry the request with credentials"
     * implementation is not complete and at best minimally passable.
     * @param response - The incoming response to guard.
     * @param dialog - If defined, the dialog within which the response was received.
     * @returns True if the program execution is to continue in the branch in question.
     *          Otherwise the request is retried with credentials and current request processing must stop.
     */
    authenticationGuard(message, dialog) {
        const statusCode = message.statusCode;
        if (!statusCode) {
            throw new Error("Response status code undefined.");
        }
        // If a 401 (Unauthorized) or 407 (Proxy Authentication Required)
        // response is received, the UAC SHOULD follow the authorization
        // procedures of Section 22.2 and Section 22.3 to retry the request with
        // credentials.
        // https://tools.ietf.org/html/rfc3261#section-8.1.3.5
        if (statusCode !== 401 && statusCode !== 407) {
            return true;
        }
        // Get and parse the appropriate WWW-Authenticate or Proxy-Authenticate header.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let challenge;
        let authorizationHeaderName;
        if (statusCode === 401) {
            challenge = message.parseHeader("www-authenticate");
            authorizationHeaderName = "authorization";
        }
        else {
            challenge = message.parseHeader("proxy-authenticate");
            authorizationHeaderName = "proxy-authorization";
        }
        // Verify it seems a valid challenge.
        if (!challenge) {
            this.logger.warn(statusCode + " with wrong or missing challenge, cannot authenticate");
            return true;
        }
        // Avoid infinite authentications.
        if (this.challenged && (this.stale || challenge.stale !== true)) {
            this.logger.warn(statusCode + " apparently in authentication loop, cannot authenticate");
            return true;
        }
        // Get credentials.
        if (!this.credentials) {
            this.credentials = this.core.configuration.authenticationFactory();
            if (!this.credentials) {
                this.logger.warn("Unable to obtain credentials, cannot authenticate");
                return true;
            }
        }
        // Verify that the challenge is really valid.
        if (!this.credentials.authenticate(this.message, challenge)) {
            return true;
        }
        this.challenged = true;
        if (challenge.stale) {
            this.stale = true;
        }
        // If response to out of dialog request, assume incrementing the CSeq will suffice.
        let cseq = (this.message.cseq += 1);
        // If response to in dialog request, get a valid next CSeq number.
        if (dialog && dialog.localSequenceNumber) {
            dialog.incrementLocalSequenceNumber();
            cseq = this.message.cseq = dialog.localSequenceNumber;
        }
        this.message.setHeader("cseq", cseq + " " + this.message.method);
        this.message.setHeader(authorizationHeaderName, this.credentials.toString());
        // Calling init (again) will swap out our existing client transaction with a new one.
        // FIXME: HACK: An assumption is being made here that there is nothing that needs to
        // be cleaned up beyond the client transaction which is being replaced. For example,
        // it is assumed that no early dialogs have been created.
        this.init();
        return false;
    }
    /**
     * 8.1.3.1 Transaction Layer Errors
     * In some cases, the response returned by the transaction layer will
     * not be a SIP message, but rather a transaction layer error.  When a
     * timeout error is received from the transaction layer, it MUST be
     * treated as if a 408 (Request Timeout) status code has been received.
     * If a fatal transport error is reported by the transport layer
     * (generally, due to fatal ICMP errors in UDP or connection failures in
     * TCP), the condition MUST be treated as a 503 (Service Unavailable)
     * status code.
     * https://tools.ietf.org/html/rfc3261#section-8.1.3.1
     */
    onRequestTimeout() {
        this.logger.warn("User agent client request timed out. Generating internal 408 Request Timeout.");
        const message = new IncomingResponseMessage();
        message.statusCode = 408;
        message.reasonPhrase = "Request Timeout";
        this.receiveResponse(message);
        return;
    }
    /**
     * 8.1.3.1 Transaction Layer Errors
     * In some cases, the response returned by the transaction layer will
     * not be a SIP message, but rather a transaction layer error.  When a
     * timeout error is received from the transaction layer, it MUST be
     * treated as if a 408 (Request Timeout) status code has been received.
     * If a fatal transport error is reported by the transport layer
     * (generally, due to fatal ICMP errors in UDP or connection failures in
     * TCP), the condition MUST be treated as a 503 (Service Unavailable)
     * status code.
     * https://tools.ietf.org/html/rfc3261#section-8.1.3.1
     * @param error - Transport error
     */
    onTransportError(error) {
        this.logger.error(error.message);
        this.logger.error("User agent client request transport error. Generating internal 503 Service Unavailable.");
        const message = new IncomingResponseMessage();
        message.statusCode = 503;
        message.reasonPhrase = "Service Unavailable";
        this.receiveResponse(message);
    }
    /**
     * Receive a response from the transaction layer.
     * @param message - Incoming response message.
     */
    receiveResponse(message) {
        if (!this.authenticationGuard(message)) {
            return;
        }
        const statusCode = message.statusCode ? message.statusCode.toString() : "";
        if (!statusCode) {
            throw new Error("Response status code undefined.");
        }
        switch (true) {
            case /^100$/.test(statusCode):
                if (this.delegate && this.delegate.onTrying) {
                    this.delegate.onTrying({ message });
                }
                break;
            case /^1[0-9]{2}$/.test(statusCode):
                if (this.delegate && this.delegate.onProgress) {
                    this.delegate.onProgress({ message });
                }
                break;
            case /^2[0-9]{2}$/.test(statusCode):
                if (this.delegate && this.delegate.onAccept) {
                    this.delegate.onAccept({ message });
                }
                break;
            case /^3[0-9]{2}$/.test(statusCode):
                if (this.delegate && this.delegate.onRedirect) {
                    this.delegate.onRedirect({ message });
                }
                break;
            case /^[4-6][0-9]{2}$/.test(statusCode):
                if (this.delegate && this.delegate.onReject) {
                    this.delegate.onReject({ message });
                }
                break;
            default:
                throw new Error(`Invalid status code ${statusCode}`);
        }
    }
    init() {
        // We are the transaction user.
        const user = {
            loggerFactory: this.loggerFactory,
            onRequestTimeout: () => this.onRequestTimeout(),
            onStateChange: (newState) => {
                if (newState === TransactionState.Terminated) {
                    // Remove the terminated transaction from the core.
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    this.core.userAgentClients.delete(userAgentClientId);
                    // FIXME: HACK: Our transaction may have been swapped out with a new one
                    // post authentication (see above), so make sure to only to dispose of
                    // ourselves if this terminating transaction is our current transaction.
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    if (transaction === this._transaction) {
                        this.dispose();
                    }
                }
            },
            onTransportError: (error) => this.onTransportError(error),
            receiveResponse: (message) => this.receiveResponse(message)
        };
        // Create a new transaction with us as the user.
        const transaction = new this.transactionConstructor(this.message, this.core.transport, user);
        this._transaction = transaction;
        // Add the new transaction to the core.
        const userAgentClientId = transaction.id + transaction.request.method;
        this.core.userAgentClients.set(userAgentClientId, this);
    }
}

/**
 * BYE UAC.
 * @public
 */
class ByeUserAgentClient extends UserAgentClient {
    constructor(dialog, delegate, options) {
        const message = dialog.createOutgoingRequestMessage(C.BYE, options);
        super(NonInviteClientTransaction, dialog.userAgentCore, message, delegate);
        dialog.dispose();
    }
}

/**
 * Non-INVITE Server Transaction.
 * @remarks
 * https://tools.ietf.org/html/rfc3261#section-17.2.2
 * @public
 */
class NonInviteServerTransaction extends ServerTransaction {
    /**
     * Constructor.
     * After construction the transaction will be in the "trying": state and the transaction
     * `id` will equal the branch parameter set in the Via header of the incoming request.
     * https://tools.ietf.org/html/rfc3261#section-17.2.2
     * @param request - Incoming Non-INVITE request from the transport.
     * @param transport - The transport.
     * @param user - The transaction user.
     */
    constructor(request, transport, user) {
        super(request, transport, user, TransactionState.Trying, "sip.transaction.nist");
    }
    /**
     * Destructor.
     */
    dispose() {
        if (this.J) {
            clearTimeout(this.J);
            this.J = undefined;
        }
        super.dispose();
    }
    /** Transaction kind. Deprecated. */
    get kind() {
        return "nist";
    }
    /**
     * Receive requests from transport matching this transaction.
     * @param request - Request matching this transaction.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    receiveRequest(request) {
        switch (this.state) {
            case TransactionState.Trying:
                // Once in the "Trying" state, any further request retransmissions are discarded.
                // https://tools.ietf.org/html/rfc3261#section-17.2.2
                break;
            case TransactionState.Proceeding:
                // If a retransmission of the request is received while in the "Proceeding" state,
                // the most recently sent provisional response MUST be passed to the transport layer for retransmission.
                // https://tools.ietf.org/html/rfc3261#section-17.2.2
                if (!this.lastResponse) {
                    throw new Error("Last response undefined.");
                }
                this.send(this.lastResponse).catch((error) => {
                    this.logTransportError(error, "Failed to send retransmission of provisional response.");
                });
                break;
            case TransactionState.Completed:
                // While in the "Completed" state, the server transaction MUST pass the final response to the transport
                // layer for retransmission whenever a retransmission of the request is received. Any other final responses
                // passed by the TU to the server transaction MUST be discarded while in the "Completed" state.
                // https://tools.ietf.org/html/rfc3261#section-17.2.2
                if (!this.lastResponse) {
                    throw new Error("Last response undefined.");
                }
                this.send(this.lastResponse).catch((error) => {
                    this.logTransportError(error, "Failed to send retransmission of final response.");
                });
                break;
            case TransactionState.Terminated:
                break;
            default:
                throw new Error(`Invalid state ${this.state}`);
        }
    }
    /**
     * Receive responses from TU for this transaction.
     * @param statusCode - Status code of response. 101-199 not allowed per RFC 4320.
     * @param response - Response to send.
     */
    receiveResponse(statusCode, response) {
        if (statusCode < 100 || statusCode > 699) {
            throw new Error(`Invalid status code ${statusCode}`);
        }
        // An SIP element MUST NOT send any provisional response with a
        // Status-Code other than 100 to a non-INVITE request.
        // An SIP element MUST NOT respond to a non-INVITE request with a
        // Status-Code of 100 over any unreliable transport, such as UDP,
        // before the amount of time it takes a client transaction's Timer E to be reset to T2.
        // An SIP element MAY respond to a non-INVITE request with a
        // Status-Code of 100 over a reliable transport at any time.
        // https://tools.ietf.org/html/rfc4320#section-4.1
        if (statusCode > 100 && statusCode <= 199) {
            throw new Error("Provisional response other than 100 not allowed.");
        }
        switch (this.state) {
            case TransactionState.Trying:
                // While in the "Trying" state, if the TU passes a provisional response
                // to the server transaction, the server transaction MUST enter the "Proceeding" state.
                // The response MUST be passed to the transport layer for transmission.
                // https://tools.ietf.org/html/rfc3261#section-17.2.2
                this.lastResponse = response;
                if (statusCode >= 100 && statusCode < 200) {
                    this.stateTransition(TransactionState.Proceeding);
                    this.send(response).catch((error) => {
                        this.logTransportError(error, "Failed to send provisional response.");
                    });
                    return;
                }
                if (statusCode >= 200 && statusCode <= 699) {
                    this.stateTransition(TransactionState.Completed);
                    this.send(response).catch((error) => {
                        this.logTransportError(error, "Failed to send final response.");
                    });
                    return;
                }
                break;
            case TransactionState.Proceeding:
                // Any further provisional responses that are received from the TU while
                // in the "Proceeding" state MUST be passed to the transport layer for transmission.
                // If the TU passes a final response (status codes 200-699) to the server while in
                // the "Proceeding" state, the transaction MUST enter the "Completed" state, and
                // the response MUST be passed to the transport layer for transmission.
                // https://tools.ietf.org/html/rfc3261#section-17.2.2
                this.lastResponse = response;
                if (statusCode >= 200 && statusCode <= 699) {
                    this.stateTransition(TransactionState.Completed);
                    this.send(response).catch((error) => {
                        this.logTransportError(error, "Failed to send final response.");
                    });
                    return;
                }
                break;
            case TransactionState.Completed:
                // Any other final responses passed by the TU to the server
                // transaction MUST be discarded while in the "Completed" state.
                // https://tools.ietf.org/html/rfc3261#section-17.2.2
                return;
            case TransactionState.Terminated:
                break;
            default:
                throw new Error(`Invalid state ${this.state}`);
        }
        const message = `Non-INVITE server transaction received unexpected ${statusCode} response from TU while in state ${this.state}.`;
        this.logger.error(message);
        throw new Error(message);
    }
    /**
     * First, the procedures in [4] are followed, which attempt to deliver the response to a backup.
     * If those should all fail, based on the definition of failure in [4], the server transaction SHOULD
     * inform the TU that a failure has occurred, and SHOULD transition to the terminated state.
     * https://tools.ietf.org/html/rfc3261#section-17.2.4
     */
    onTransportError(error) {
        if (this.user.onTransportError) {
            this.user.onTransportError(error);
        }
        this.stateTransition(TransactionState.Terminated, true);
    }
    /** For logging. */
    typeToString() {
        return "non-INVITE server transaction";
    }
    stateTransition(newState, dueToTransportError = false) {
        // Assert valid state transitions.
        const invalidStateTransition = () => {
            throw new Error(`Invalid state transition from ${this.state} to ${newState}`);
        };
        switch (newState) {
            case TransactionState.Trying:
                invalidStateTransition();
                break;
            case TransactionState.Proceeding:
                if (this.state !== TransactionState.Trying) {
                    invalidStateTransition();
                }
                break;
            case TransactionState.Completed:
                if (this.state !== TransactionState.Trying && this.state !== TransactionState.Proceeding) {
                    invalidStateTransition();
                }
                break;
            case TransactionState.Terminated:
                if (this.state !== TransactionState.Proceeding && this.state !== TransactionState.Completed) {
                    if (!dueToTransportError) {
                        invalidStateTransition();
                    }
                }
                break;
            default:
                invalidStateTransition();
        }
        // When the server transaction enters the "Completed" state, it MUST set Timer J to fire
        // in 64*T1 seconds for unreliable transports, and zero seconds for reliable transports.
        // https://tools.ietf.org/html/rfc3261#section-17.2.2
        if (newState === TransactionState.Completed) {
            this.J = setTimeout(() => this.timerJ(), Timers.TIMER_J);
        }
        // The server transaction MUST be destroyed the instant it enters the "Terminated" state.
        // https://tools.ietf.org/html/rfc3261#section-17.2.2
        if (newState === TransactionState.Terminated) {
            this.dispose();
        }
        this.setState(newState);
    }
    /**
     * The server transaction remains in this state until Timer J fires,
     * at which point it MUST transition to the "Terminated" state.
     * https://tools.ietf.org/html/rfc3261#section-17.2.2
     */
    timerJ() {
        this.logger.debug(`Timer J expired for NON-INVITE server transaction ${this.id}.`);
        if (this.state === TransactionState.Completed) {
            this.stateTransition(TransactionState.Terminated);
        }
    }
}

/**
 * User Agent Server (UAS).
 * @remarks
 * A user agent server is a logical entity
 * that generates a response to a SIP request.  The response
 * accepts, rejects, or redirects the request.  This role lasts
 * only for the duration of that transaction.  In other words, if
 * a piece of software responds to a request, it acts as a UAS for
 * the duration of that transaction.  If it generates a request
 * later, it assumes the role of a user agent client for the
 * processing of that transaction.
 * https://tools.ietf.org/html/rfc3261#section-6
 * @public
 */
class UserAgentServer {
    constructor(transactionConstructor, core, message, delegate) {
        this.transactionConstructor = transactionConstructor;
        this.core = core;
        this.message = message;
        this.delegate = delegate;
        this.logger = this.loggerFactory.getLogger("sip.user-agent-server");
        this.toTag = message.toTag ? message.toTag : newTag();
        this.init();
    }
    dispose() {
        this.transaction.dispose();
    }
    get loggerFactory() {
        return this.core.loggerFactory;
    }
    /** The transaction associated with this request. */
    get transaction() {
        if (!this._transaction) {
            throw new Error("Transaction undefined.");
        }
        return this._transaction;
    }
    accept(options = { statusCode: 200 }) {
        if (!this.acceptable) {
            throw new TransactionStateError(`${this.message.method} not acceptable in state ${this.transaction.state}.`);
        }
        const statusCode = options.statusCode;
        if (statusCode < 200 || statusCode > 299) {
            throw new TypeError(`Invalid statusCode: ${statusCode}`);
        }
        const response = this.reply(options);
        return response;
    }
    progress(options = { statusCode: 180 }) {
        if (!this.progressable) {
            throw new TransactionStateError(`${this.message.method} not progressable in state ${this.transaction.state}.`);
        }
        const statusCode = options.statusCode;
        if (statusCode < 101 || statusCode > 199) {
            throw new TypeError(`Invalid statusCode: ${statusCode}`);
        }
        const response = this.reply(options);
        return response;
    }
    redirect(contacts, options = { statusCode: 302 }) {
        if (!this.redirectable) {
            throw new TransactionStateError(`${this.message.method} not redirectable in state ${this.transaction.state}.`);
        }
        const statusCode = options.statusCode;
        if (statusCode < 300 || statusCode > 399) {
            throw new TypeError(`Invalid statusCode: ${statusCode}`);
        }
        const contactHeaders = new Array();
        contacts.forEach((contact) => contactHeaders.push(`Contact: ${contact.toString()}`));
        options.extraHeaders = (options.extraHeaders || []).concat(contactHeaders);
        const response = this.reply(options);
        return response;
    }
    reject(options = { statusCode: 480 }) {
        if (!this.rejectable) {
            throw new TransactionStateError(`${this.message.method} not rejectable in state ${this.transaction.state}.`);
        }
        const statusCode = options.statusCode;
        if (statusCode < 400 || statusCode > 699) {
            throw new TypeError(`Invalid statusCode: ${statusCode}`);
        }
        const response = this.reply(options);
        return response;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    trying(options) {
        if (!this.tryingable) {
            throw new TransactionStateError(`${this.message.method} not tryingable in state ${this.transaction.state}.`);
        }
        const response = this.reply({ statusCode: 100 });
        return response;
    }
    /**
     * If the UAS did not find a matching transaction for the CANCEL
     * according to the procedure above, it SHOULD respond to the CANCEL
     * with a 481 (Call Leg/Transaction Does Not Exist).  If the transaction
     * for the original request still exists, the behavior of the UAS on
     * receiving a CANCEL request depends on whether it has already sent a
     * final response for the original request.  If it has, the CANCEL
     * request has no effect on the processing of the original request, no
     * effect on any session state, and no effect on the responses generated
     * for the original request.  If the UAS has not issued a final response
     * for the original request, its behavior depends on the method of the
     * original request.  If the original request was an INVITE, the UAS
     * SHOULD immediately respond to the INVITE with a 487 (Request
     * Terminated).  A CANCEL request has no impact on the processing of
     * transactions with any other method defined in this specification.
     * https://tools.ietf.org/html/rfc3261#section-9.2
     * @param request - Incoming CANCEL request.
     */
    receiveCancel(message) {
        // Note: Currently CANCEL is being handled as a special case.
        // No UAS is created to handle the CANCEL and the response to
        // it CANCEL is being handled statelessly by the user agent core.
        // As such, there is currently no way to externally impact the
        // response to the a CANCEL request.
        if (this.delegate && this.delegate.onCancel) {
            this.delegate.onCancel(message);
        }
    }
    get acceptable() {
        if (this.transaction instanceof InviteServerTransaction) {
            return (this.transaction.state === TransactionState.Proceeding || this.transaction.state === TransactionState.Accepted);
        }
        if (this.transaction instanceof NonInviteServerTransaction) {
            return (this.transaction.state === TransactionState.Trying || this.transaction.state === TransactionState.Proceeding);
        }
        throw new Error("Unknown transaction type.");
    }
    get progressable() {
        if (this.transaction instanceof InviteServerTransaction) {
            return this.transaction.state === TransactionState.Proceeding;
        }
        if (this.transaction instanceof NonInviteServerTransaction) {
            return false; // https://tools.ietf.org/html/rfc4320#section-4.1
        }
        throw new Error("Unknown transaction type.");
    }
    get redirectable() {
        if (this.transaction instanceof InviteServerTransaction) {
            return this.transaction.state === TransactionState.Proceeding;
        }
        if (this.transaction instanceof NonInviteServerTransaction) {
            return (this.transaction.state === TransactionState.Trying || this.transaction.state === TransactionState.Proceeding);
        }
        throw new Error("Unknown transaction type.");
    }
    get rejectable() {
        if (this.transaction instanceof InviteServerTransaction) {
            return this.transaction.state === TransactionState.Proceeding;
        }
        if (this.transaction instanceof NonInviteServerTransaction) {
            return (this.transaction.state === TransactionState.Trying || this.transaction.state === TransactionState.Proceeding);
        }
        throw new Error("Unknown transaction type.");
    }
    get tryingable() {
        if (this.transaction instanceof InviteServerTransaction) {
            return this.transaction.state === TransactionState.Proceeding;
        }
        if (this.transaction instanceof NonInviteServerTransaction) {
            return this.transaction.state === TransactionState.Trying;
        }
        throw new Error("Unknown transaction type.");
    }
    /**
     * When a UAS wishes to construct a response to a request, it follows
     * the general procedures detailed in the following subsections.
     * Additional behaviors specific to the response code in question, which
     * are not detailed in this section, may also be required.
     *
     * Once all procedures associated with the creation of a response have
     * been completed, the UAS hands the response back to the server
     * transaction from which it received the request.
     * https://tools.ietf.org/html/rfc3261#section-8.2.6
     * @param statusCode - Status code to reply with.
     * @param options - Reply options bucket.
     */
    reply(options) {
        if (!options.toTag && options.statusCode !== 100) {
            options.toTag = this.toTag;
        }
        options.userAgent = options.userAgent || this.core.configuration.userAgentHeaderFieldValue;
        options.supported = options.supported || this.core.configuration.supportedOptionTagsResponse;
        const response = constructOutgoingResponse(this.message, options);
        this.transaction.receiveResponse(options.statusCode, response.message);
        return response;
    }
    init() {
        // We are the transaction user.
        const user = {
            loggerFactory: this.loggerFactory,
            onStateChange: (newState) => {
                if (newState === TransactionState.Terminated) {
                    // Remove the terminated transaction from the core.
                    // eslint-disable-next-line @typescript-eslint/no-use-before-define
                    this.core.userAgentServers.delete(userAgentServerId);
                    this.dispose();
                }
            },
            onTransportError: (error) => {
                this.logger.error(error.message);
                if (this.delegate && this.delegate.onTransportError) {
                    this.delegate.onTransportError(error);
                }
                else {
                    this.logger.error("User agent server response transport error.");
                }
            }
        };
        // Create a new transaction with us as the user.
        const transaction = new this.transactionConstructor(this.message, this.core.transport, user);
        this._transaction = transaction;
        // Add the new transaction to the core.
        const userAgentServerId = transaction.id;
        this.core.userAgentServers.set(transaction.id, this);
    }
}

/**
 * BYE UAS.
 * @public
 */
class ByeUserAgentServer extends UserAgentServer {
    constructor(dialog, message, delegate) {
        super(NonInviteServerTransaction, dialog.userAgentCore, message, delegate);
    }
}

/**
 * INFO UAC.
 * @public
 */
class InfoUserAgentClient extends UserAgentClient {
    constructor(dialog, delegate, options) {
        const message = dialog.createOutgoingRequestMessage(C.INFO, options);
        super(NonInviteClientTransaction, dialog.userAgentCore, message, delegate);
    }
}

/**
 * INFO UAS.
 * @public
 */
class InfoUserAgentServer extends UserAgentServer {
    constructor(dialog, message, delegate) {
        super(NonInviteServerTransaction, dialog.userAgentCore, message, delegate);
    }
}

/**
 * MESSAGE UAC.
 * @public
 */
class MessageUserAgentClient extends UserAgentClient {
    constructor(core, message, delegate) {
        super(NonInviteClientTransaction, core, message, delegate);
    }
}

/**
 * MESSAGE UAS.
 * @public
 */
class MessageUserAgentServer extends UserAgentServer {
    constructor(core, message, delegate) {
        super(NonInviteServerTransaction, core, message, delegate);
    }
}

/**
 * NOTIFY UAS.
 * @public
 */
class NotifyUserAgentClient extends UserAgentClient {
    constructor(dialog, delegate, options) {
        const message = dialog.createOutgoingRequestMessage(C.NOTIFY, options);
        super(NonInviteClientTransaction, dialog.userAgentCore, message, delegate);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function instanceOfDialog(object) {
    return object.userAgentCore !== undefined;
}
/**
 * NOTIFY UAS.
 * @public
 */
class NotifyUserAgentServer extends UserAgentServer {
    /**
     * NOTIFY UAS constructor.
     * @param dialogOrCore - Dialog for in dialog NOTIFY, UserAgentCore for out of dialog NOTIFY (deprecated).
     * @param message - Incoming NOTIFY request message.
     */
    constructor(dialogOrCore, message, delegate) {
        const userAgentCore = instanceOfDialog(dialogOrCore) ? dialogOrCore.userAgentCore : dialogOrCore;
        super(NonInviteServerTransaction, userAgentCore, message, delegate);
    }
}

/**
 * PRACK UAC.
 * @public
 */
class PrackUserAgentClient extends UserAgentClient {
    constructor(dialog, delegate, options) {
        const message = dialog.createOutgoingRequestMessage(C.PRACK, options);
        super(NonInviteClientTransaction, dialog.userAgentCore, message, delegate);
        dialog.signalingStateTransition(message);
    }
}

/**
 * PRACK UAS.
 * @public
 */
class PrackUserAgentServer extends UserAgentServer {
    constructor(dialog, message, delegate) {
        super(NonInviteServerTransaction, dialog.userAgentCore, message, delegate);
        // Update dialog signaling state with offer/answer in body
        dialog.signalingStateTransition(message);
        this.dialog = dialog;
    }
    /**
     * Update the dialog signaling state on a 2xx response.
     * @param options - Options bucket.
     */
    accept(options = { statusCode: 200 }) {
        if (options.body) {
            // Update dialog signaling state with offer/answer in body
            this.dialog.signalingStateTransition(options.body);
        }
        return super.accept(options);
    }
}

/**
 * Re-INVITE UAC.
 * @remarks
 * 14 Modifying an Existing Session
 * https://tools.ietf.org/html/rfc3261#section-14
 * 14.1 UAC Behavior
 * https://tools.ietf.org/html/rfc3261#section-14.1
 * @public
 */
class ReInviteUserAgentClient extends UserAgentClient {
    constructor(dialog, delegate, options) {
        const message = dialog.createOutgoingRequestMessage(C.INVITE, options);
        super(InviteClientTransaction, dialog.userAgentCore, message, delegate);
        this.delegate = delegate;
        dialog.signalingStateTransition(message);
        // FIXME: TODO: next line obviously needs to be improved...
        dialog.reinviteUserAgentClient = this; // let the dialog know re-invite request sent
        this.dialog = dialog;
    }
    receiveResponse(message) {
        if (!this.authenticationGuard(message, this.dialog)) {
            return;
        }
        const statusCode = message.statusCode ? message.statusCode.toString() : "";
        if (!statusCode) {
            throw new Error("Response status code undefined.");
        }
        switch (true) {
            case /^100$/.test(statusCode):
                if (this.delegate && this.delegate.onTrying) {
                    this.delegate.onTrying({ message });
                }
                break;
            case /^1[0-9]{2}$/.test(statusCode):
                if (this.delegate && this.delegate.onProgress) {
                    this.delegate.onProgress({
                        message,
                        session: this.dialog,
                        // eslint-disable-next-line @typescript-eslint/no-unused-vars
                        prack: (options) => {
                            throw new Error("Unimplemented.");
                        }
                    });
                }
                break;
            case /^2[0-9]{2}$/.test(statusCode):
                // Update dialog signaling state with offer/answer in body
                this.dialog.signalingStateTransition(message);
                if (this.delegate && this.delegate.onAccept) {
                    this.delegate.onAccept({
                        message,
                        session: this.dialog,
                        ack: (options) => {
                            const outgoingAckRequest = this.dialog.ack(options);
                            return outgoingAckRequest;
                        }
                    });
                }
                break;
            case /^3[0-9]{2}$/.test(statusCode):
                this.dialog.signalingStateRollback();
                this.dialog.reinviteUserAgentClient = undefined; // ACK was handled by transaction
                if (this.delegate && this.delegate.onRedirect) {
                    this.delegate.onRedirect({ message });
                }
                break;
            case /^[4-6][0-9]{2}$/.test(statusCode):
                this.dialog.signalingStateRollback();
                this.dialog.reinviteUserAgentClient = undefined; // ACK was handled by transaction
                if (this.delegate && this.delegate.onReject) {
                    this.delegate.onReject({ message });
                }
                break;
            default:
                throw new Error(`Invalid status code ${statusCode}`);
        }
    }
}

/**
 * Re-INVITE UAS.
 * @remarks
 * 14 Modifying an Existing Session
 * https://tools.ietf.org/html/rfc3261#section-14
 * 14.2 UAS Behavior
 * https://tools.ietf.org/html/rfc3261#section-14.2
 * @public
 */
class ReInviteUserAgentServer extends UserAgentServer {
    constructor(dialog, message, delegate) {
        super(InviteServerTransaction, dialog.userAgentCore, message, delegate);
        dialog.reinviteUserAgentServer = this;
        this.dialog = dialog;
    }
    /**
     * Update the dialog signaling state on a 2xx response.
     * @param options - Options bucket.
     */
    accept(options = { statusCode: 200 }) {
        // FIXME: The next two lines SHOULD go away, but I suppose it's technically harmless...
        // These are here because some versions of SIP.js prior to 0.13.8 set the route set
        // of all in dialog ACKs based on the Record-Route headers in the associated 2xx
        // response. While this worked for dialog forming 2xx responses, it was technically
        // broken for re-INVITE ACKS as it only worked if the UAS populated the Record-Route
        // headers in the re-INVITE 2xx response (which is not required and a waste of bandwidth
        // as the should be ignored if present in re-INVITE ACKS) and the UAS populated
        // the Record-Route headers with the correct values (would be weird not too, but...).
        // Anyway, for now the technically useless Record-Route headers are being added
        // to maintain "backwards compatibility" with the older broken versions of SIP.js.
        options.extraHeaders = options.extraHeaders || [];
        options.extraHeaders = options.extraHeaders.concat(this.dialog.routeSet.map((route) => `Record-Route: ${route}`));
        // Send and return the response
        const response = super.accept(options);
        const session = this.dialog;
        const result = Object.assign(Object.assign({}, response), { session });
        if (options.body) {
            // Update dialog signaling state with offer/answer in body
            this.dialog.signalingStateTransition(options.body);
        }
        // Update dialog
        this.dialog.reConfirm();
        return result;
    }
    /**
     * Update the dialog signaling state on a 1xx response.
     * @param options - Progress options bucket.
     */
    progress(options = { statusCode: 180 }) {
        // Send and return the response
        const response = super.progress(options);
        const session = this.dialog;
        const result = Object.assign(Object.assign({}, response), { session });
        // Update dialog signaling state
        if (options.body) {
            this.dialog.signalingStateTransition(options.body);
        }
        return result;
    }
    /**
     * TODO: Not Yet Supported
     * @param contacts - Contacts to redirect to.
     * @param options - Redirect options bucket.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    redirect(contacts, options = { statusCode: 302 }) {
        this.dialog.signalingStateRollback();
        this.dialog.reinviteUserAgentServer = undefined; // ACK will be handled by transaction
        throw new Error("Unimplemented.");
    }
    /**
     * 3.1 Background on Re-INVITE Handling by UASs
     * An error response to a re-INVITE has the following semantics.  As
     * specified in Section 12.2.2 of RFC 3261 [RFC3261], if a re-INVITE is
     * rejected, no state changes are performed.
     * https://tools.ietf.org/html/rfc6141#section-3.1
     * @param options - Reject options bucket.
     */
    reject(options = { statusCode: 488 }) {
        this.dialog.signalingStateRollback();
        this.dialog.reinviteUserAgentServer = undefined; // ACK will be handled by transaction
        return super.reject(options);
    }
}

/**
 * REFER UAC.
 * @public
 */
class ReferUserAgentClient extends UserAgentClient {
    constructor(dialog, delegate, options) {
        const message = dialog.createOutgoingRequestMessage(C.REFER, options);
        super(NonInviteClientTransaction, dialog.userAgentCore, message, delegate);
    }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function instanceOfSessionDialog(object) {
    return object.userAgentCore !== undefined;
}
/**
 * REFER UAS.
 * @public
 */
class ReferUserAgentServer extends UserAgentServer {
    /**
     * REFER UAS constructor.
     * @param dialogOrCore - Dialog for in dialog REFER, UserAgentCore for out of dialog REFER.
     * @param message - Incoming REFER request message.
     */
    constructor(dialogOrCore, message, delegate) {
        const userAgentCore = instanceOfSessionDialog(dialogOrCore) ? dialogOrCore.userAgentCore : dialogOrCore;
        super(NonInviteServerTransaction, userAgentCore, message, delegate);
    }
}

/**
 * Session Dialog.
 * @public
 */
class SessionDialog extends Dialog {
    constructor(initialTransaction, core, state, delegate) {
        super(core, state);
        this.initialTransaction = initialTransaction;
        /** The state of the offer/answer exchange. */
        this._signalingState = SignalingState.Initial;
        /** True if waiting for an ACK to the initial transaction 2xx (UAS only). */
        this.ackWait = false;
        /** True if processing an ACK to the initial transaction 2xx (UAS only). */
        this.ackProcessing = false;
        this.delegate = delegate;
        if (initialTransaction instanceof InviteServerTransaction) {
            // If we're created by an invite server transaction, we're
            // going to be waiting for an ACK if are to be confirmed.
            this.ackWait = true;
        }
        // If we're confirmed upon creation start the retransmitting whatever
        // the 2xx final response was that confirmed us into existence.
        if (!this.early) {
            this.start2xxRetransmissionTimer();
        }
        this.signalingStateTransition(initialTransaction.request);
        this.logger = core.loggerFactory.getLogger("sip.invite-dialog");
        this.logger.log(`INVITE dialog ${this.id} constructed`);
    }
    dispose() {
        super.dispose();
        this._signalingState = SignalingState.Closed;
        this._offer = undefined;
        this._answer = undefined;
        if (this.invite2xxTimer) {
            clearTimeout(this.invite2xxTimer);
            this.invite2xxTimer = undefined;
        }
        // The UAS MUST still respond to any pending requests received for that
        // dialog.  It is RECOMMENDED that a 487 (Request Terminated) response
        // be generated to those pending requests.
        // https://tools.ietf.org/html/rfc3261#section-15.1.2
        // TODO:
        // this.userAgentServers.forEach((uas) => uas.reply(487));
        this.logger.log(`INVITE dialog ${this.id} destroyed`);
    }
    // FIXME: Need real state machine
    get sessionState() {
        if (this.early) {
            return SessionState$1.Early;
        }
        else if (this.ackWait) {
            return SessionState$1.AckWait;
        }
        else if (this._signalingState === SignalingState.Closed) {
            return SessionState$1.Terminated;
        }
        else {
            return SessionState$1.Confirmed;
        }
    }
    /** The state of the offer/answer exchange. */
    get signalingState() {
        return this._signalingState;
    }
    /** The current offer. Undefined unless signaling state HaveLocalOffer, HaveRemoteOffer, of Stable. */
    get offer() {
        return this._offer;
    }
    /** The current answer. Undefined unless signaling state Stable. */
    get answer() {
        return this._answer;
    }
    /** Confirm the dialog. Only matters if dialog is currently early. */
    confirm() {
        // When we're confirmed start the retransmitting whatever
        // the 2xx final response that may have confirmed us.
        if (this.early) {
            this.start2xxRetransmissionTimer();
        }
        super.confirm();
    }
    /** Re-confirm the dialog. Only matters if handling re-INVITE request. */
    reConfirm() {
        // When we're confirmed start the retransmitting whatever
        // the 2xx final response that may have confirmed us.
        if (this.reinviteUserAgentServer) {
            this.startReInvite2xxRetransmissionTimer();
        }
    }
    /**
     * The UAC core MUST generate an ACK request for each 2xx received from
     * the transaction layer.  The header fields of the ACK are constructed
     * in the same way as for any request sent within a dialog (see Section
     * 12) with the exception of the CSeq and the header fields related to
     * authentication.  The sequence number of the CSeq header field MUST be
     * the same as the INVITE being acknowledged, but the CSeq method MUST
     * be ACK.  The ACK MUST contain the same credentials as the INVITE.  If
     * the 2xx contains an offer (based on the rules above), the ACK MUST
     * carry an answer in its body.  If the offer in the 2xx response is not
     * acceptable, the UAC core MUST generate a valid answer in the ACK and
     * then send a BYE immediately.
     * https://tools.ietf.org/html/rfc3261#section-13.2.2.4
     * @param options - ACK options bucket.
     */
    ack(options = {}) {
        this.logger.log(`INVITE dialog ${this.id} sending ACK request`);
        let transaction;
        if (this.reinviteUserAgentClient) {
            // We're sending ACK for a re-INVITE
            if (!(this.reinviteUserAgentClient.transaction instanceof InviteClientTransaction)) {
                throw new Error("Transaction not instance of InviteClientTransaction.");
            }
            transaction = this.reinviteUserAgentClient.transaction;
            this.reinviteUserAgentClient = undefined;
        }
        else {
            // We're sending ACK for the initial INVITE
            if (!(this.initialTransaction instanceof InviteClientTransaction)) {
                throw new Error("Initial transaction not instance of InviteClientTransaction.");
            }
            transaction = this.initialTransaction;
        }
        const message = this.createOutgoingRequestMessage(C.ACK, {
            cseq: transaction.request.cseq,
            extraHeaders: options.extraHeaders,
            body: options.body
        });
        transaction.ackResponse(message); // See InviteClientTransaction for details.
        this.signalingStateTransition(message);
        return { message };
    }
    /**
     * Terminating a Session
     *
     * This section describes the procedures for terminating a session
     * established by SIP.  The state of the session and the state of the
     * dialog are very closely related.  When a session is initiated with an
     * INVITE, each 1xx or 2xx response from a distinct UAS creates a
     * dialog, and if that response completes the offer/answer exchange, it
     * also creates a session.  As a result, each session is "associated"
     * with a single dialog - the one which resulted in its creation.  If an
     * initial INVITE generates a non-2xx final response, that terminates
     * all sessions (if any) and all dialogs (if any) that were created
     * through responses to the request.  By virtue of completing the
     * transaction, a non-2xx final response also prevents further sessions
     * from being created as a result of the INVITE.  The BYE request is
     * used to terminate a specific session or attempted session.  In this
     * case, the specific session is the one with the peer UA on the other
     * side of the dialog.  When a BYE is received on a dialog, any session
     * associated with that dialog SHOULD terminate.  A UA MUST NOT send a
     * BYE outside of a dialog.  The caller's UA MAY send a BYE for either
     * confirmed or early dialogs, and the callee's UA MAY send a BYE on
     * confirmed dialogs, but MUST NOT send a BYE on early dialogs.
     *
     * However, the callee's UA MUST NOT send a BYE on a confirmed dialog
     * until it has received an ACK for its 2xx response or until the server
     * transaction times out.  If no SIP extensions have defined other
     * application layer states associated with the dialog, the BYE also
     * terminates the dialog.
     *
     * https://tools.ietf.org/html/rfc3261#section-15
     * FIXME: Make these proper Exceptions...
     * @param options - BYE options bucket.
     * @returns
     * Throws `Error` if callee's UA attempts a BYE on an early dialog.
     * Throws `Error` if callee's UA attempts a BYE on a confirmed dialog
     *                while it's waiting on the ACK for its 2xx response.
     */
    bye(delegate, options) {
        this.logger.log(`INVITE dialog ${this.id} sending BYE request`);
        // The caller's UA MAY send a BYE for either
        // confirmed or early dialogs, and the callee's UA MAY send a BYE on
        // confirmed dialogs, but MUST NOT send a BYE on early dialogs.
        //
        // However, the callee's UA MUST NOT send a BYE on a confirmed dialog
        // until it has received an ACK for its 2xx response or until the server
        // transaction times out.
        // https://tools.ietf.org/html/rfc3261#section-15
        if (this.initialTransaction instanceof InviteServerTransaction) {
            if (this.early) {
                // FIXME: TODO: This should throw a proper exception.
                throw new Error("UAS MUST NOT send a BYE on early dialogs.");
            }
            if (this.ackWait && this.initialTransaction.state !== TransactionState.Terminated) {
                // FIXME: TODO: This should throw a proper exception.
                throw new Error("UAS MUST NOT send a BYE on a confirmed dialog " +
                    "until it has received an ACK for its 2xx response " +
                    "or until the server transaction times out.");
            }
        }
        // A BYE request is constructed as would any other request within a
        // dialog, as described in Section 12.
        //
        // Once the BYE is constructed, the UAC core creates a new non-INVITE
        // client transaction, and passes it the BYE request.  The UAC MUST
        // consider the session terminated (and therefore stop sending or
        // listening for media) as soon as the BYE request is passed to the
        // client transaction.  If the response for the BYE is a 481
        // (Call/Transaction Does Not Exist) or a 408 (Request Timeout) or no
        // response at all is received for the BYE (that is, a timeout is
        // returned by the client transaction), the UAC MUST consider the
        // session and the dialog terminated.
        // https://tools.ietf.org/html/rfc3261#section-15.1.1
        return new ByeUserAgentClient(this, delegate, options);
    }
    /**
     * An INFO request can be associated with an Info Package (see
     * Section 5), or associated with a legacy INFO usage (see Section 2).
     *
     * The construction of the INFO request is the same as any other
     * non-target refresh request within an existing invite dialog usage as
     * described in Section 12.2 of RFC 3261.
     * https://tools.ietf.org/html/rfc6086#section-4.2.1
     * @param options - Options bucket.
     */
    info(delegate, options) {
        this.logger.log(`INVITE dialog ${this.id} sending INFO request`);
        if (this.early) {
            // FIXME: TODO: This should throw a proper exception.
            throw new Error("Dialog not confirmed.");
        }
        return new InfoUserAgentClient(this, delegate, options);
    }
    /**
     * Modifying an Existing Session
     *
     * A successful INVITE request (see Section 13) establishes both a
     * dialog between two user agents and a session using the offer-answer
     * model.  Section 12 explains how to modify an existing dialog using a
     * target refresh request (for example, changing the remote target URI
     * of the dialog).  This section describes how to modify the actual
     * session.  This modification can involve changing addresses or ports,
     * adding a media stream, deleting a media stream, and so on.  This is
     * accomplished by sending a new INVITE request within the same dialog
     * that established the session.  An INVITE request sent within an
     * existing dialog is known as a re-INVITE.
     *
     *    Note that a single re-INVITE can modify the dialog and the
     *    parameters of the session at the same time.
     *
     * Either the caller or callee can modify an existing session.
     * https://tools.ietf.org/html/rfc3261#section-14
     * @param options - Options bucket
     */
    invite(delegate, options) {
        this.logger.log(`INVITE dialog ${this.id} sending INVITE request`);
        if (this.early) {
            // FIXME: TODO: This should throw a proper exception.
            throw new Error("Dialog not confirmed.");
        }
        // Note that a UAC MUST NOT initiate a new INVITE transaction within a
        // dialog while another INVITE transaction is in progress in either
        // direction.
        //
        //    1. If there is an ongoing INVITE client transaction, the TU MUST
        //       wait until the transaction reaches the completed or terminated
        //       state before initiating the new INVITE.
        //
        //    2. If there is an ongoing INVITE server transaction, the TU MUST
        //       wait until the transaction reaches the confirmed or terminated
        //       state before initiating the new INVITE.
        //
        // However, a UA MAY initiate a regular transaction while an INVITE
        // transaction is in progress.  A UA MAY also initiate an INVITE
        // transaction while a regular transaction is in progress.
        // https://tools.ietf.org/html/rfc3261#section-14.1
        if (this.reinviteUserAgentClient) {
            // FIXME: TODO: This should throw a proper exception.
            throw new Error("There is an ongoing re-INVITE client transaction.");
        }
        if (this.reinviteUserAgentServer) {
            // FIXME: TODO: This should throw a proper exception.
            throw new Error("There is an ongoing re-INVITE server transaction.");
        }
        return new ReInviteUserAgentClient(this, delegate, options);
    }
    /**
     * A UAC MAY associate a MESSAGE request with an existing dialog.  If a
     * MESSAGE request is sent within a dialog, it is "associated" with any
     * media session or sessions associated with that dialog.
     * https://tools.ietf.org/html/rfc3428#section-4
     * @param options - Options bucket.
     */
    message(delegate, options) {
        this.logger.log(`INVITE dialog ${this.id} sending MESSAGE request`);
        if (this.early) {
            // FIXME: TODO: This should throw a proper exception.
            throw new Error("Dialog not confirmed.");
        }
        const message = this.createOutgoingRequestMessage(C.MESSAGE, options);
        return new MessageUserAgentClient(this.core, message, delegate);
    }
    /**
     * The NOTIFY mechanism defined in [2] MUST be used to inform the agent
     * sending the REFER of the status of the reference.
     * https://tools.ietf.org/html/rfc3515#section-2.4.4
     * @param options - Options bucket.
     */
    notify(delegate, options) {
        this.logger.log(`INVITE dialog ${this.id} sending NOTIFY request`);
        if (this.early) {
            // FIXME: TODO: This should throw a proper exception.
            throw new Error("Dialog not confirmed.");
        }
        return new NotifyUserAgentClient(this, delegate, options);
    }
    /**
     * Assuming the response is to be transmitted reliably, the UAC MUST
     * create a new request with method PRACK.  This request is sent within
     * the dialog associated with the provisional response (indeed, the
     * provisional response may have created the dialog).  PRACK requests
     * MAY contain bodies, which are interpreted according to their type and
     * disposition.
     * https://tools.ietf.org/html/rfc3262#section-4
     * @param options - Options bucket.
     */
    prack(delegate, options) {
        this.logger.log(`INVITE dialog ${this.id} sending PRACK request`);
        return new PrackUserAgentClient(this, delegate, options);
    }
    /**
     * REFER is a SIP request and is constructed as defined in [1].  A REFER
     * request MUST contain exactly one Refer-To header field value.
     * https://tools.ietf.org/html/rfc3515#section-2.4.1
     * @param options - Options bucket.
     */
    refer(delegate, options) {
        this.logger.log(`INVITE dialog ${this.id} sending REFER request`);
        if (this.early) {
            // FIXME: TODO: This should throw a proper exception.
            throw new Error("Dialog not confirmed.");
        }
        // FIXME: TODO: Validate Refer-To header field value.
        return new ReferUserAgentClient(this, delegate, options);
    }
    /**
     * Requests sent within a dialog, as any other requests, are atomic.  If
     * a particular request is accepted by the UAS, all the state changes
     * associated with it are performed.  If the request is rejected, none
     * of the state changes are performed.
     * https://tools.ietf.org/html/rfc3261#section-12.2.2
     * @param message - Incoming request message within this dialog.
     */
    receiveRequest(message) {
        this.logger.log(`INVITE dialog ${this.id} received ${message.method} request`);
        // Response retransmissions cease when an ACK request for the
        // response is received.  This is independent of whatever transport
        // protocols are used to send the response.
        // https://tools.ietf.org/html/rfc6026#section-8.1
        if (message.method === C.ACK) {
            // If ackWait is true, then this is the ACK to the initial INVITE,
            // otherwise this is an ACK to an in dialog INVITE. In either case,
            // guard to make sure the sequence number of the ACK matches the INVITE.
            if (this.ackWait) {
                if (this.initialTransaction instanceof InviteClientTransaction) {
                    this.logger.warn(`INVITE dialog ${this.id} received unexpected ${message.method} request, dropping.`);
                    return;
                }
                if (this.initialTransaction.request.cseq !== message.cseq) {
                    this.logger.warn(`INVITE dialog ${this.id} received unexpected ${message.method} request, dropping.`);
                    return;
                }
                // Update before the delegate has a chance to handle the
                // message as delegate may callback into this dialog.
                this.ackWait = false;
            }
            else {
                if (!this.reinviteUserAgentServer) {
                    this.logger.warn(`INVITE dialog ${this.id} received unexpected ${message.method} request, dropping.`);
                    return;
                }
                if (this.reinviteUserAgentServer.transaction.request.cseq !== message.cseq) {
                    this.logger.warn(`INVITE dialog ${this.id} received unexpected ${message.method} request, dropping.`);
                    return;
                }
                this.reinviteUserAgentServer = undefined;
            }
            this.signalingStateTransition(message);
            if (this.delegate && this.delegate.onAck) {
                const promiseOrVoid = this.delegate.onAck({ message });
                if (promiseOrVoid instanceof Promise) {
                    this.ackProcessing = true; // make sure this is always reset to false
                    promiseOrVoid.then(() => (this.ackProcessing = false)).catch(() => (this.ackProcessing = false));
                }
            }
            return;
        }
        // Request within a dialog out of sequence guard.
        // https://tools.ietf.org/html/rfc3261#section-12.2.2
        if (!this.sequenceGuard(message)) {
            this.logger.log(`INVITE dialog ${this.id} rejected out of order ${message.method} request.`);
            return;
        }
        // Request within a dialog common processing.
        // https://tools.ietf.org/html/rfc3261#section-12.2.2
        super.receiveRequest(message);
        // Handle various INVITE related cross-over, glare and race conditions
        if (message.method === C.INVITE) {
            // Hopefully this message is helpful...
            const warning = () => {
                const reason = this.ackWait ? "waiting for initial ACK" : "processing initial ACK";
                this.logger.warn(`INVITE dialog ${this.id} received re-INVITE while ${reason}`);
                let msg = "RFC 5407 suggests the following to avoid this race condition... ";
                msg += " Note: Implementation issues are outside the scope of this document,";
                msg += " but the following tip is provided for avoiding race conditions of";
                msg += " this type.  The caller can delay sending re-INVITE F6 for some period";
                msg += " of time (2 seconds, perhaps), after which the caller can reasonably";
                msg += " assume that its ACK has been received.  Implementors can decouple the";
                msg += " actions of the user (e.g., pressing the hold button) from the actions";
                msg += " of the protocol (the sending of re-INVITE F6), so that the UA can";
                msg += " behave like this.  In this case, it is the implementor's choice as to";
                msg += " how long to wait.  In most cases, such an implementation may be";
                msg += " useful to prevent the type of race condition shown in this section.";
                msg += " This document expresses no preference about whether or not they";
                msg += " should wait for an ACK to be delivered.  After considering the impact";
                msg += " on user experience, implementors should decide whether or not to wait";
                msg += " for a while, because the user experience depends on the";
                msg += " implementation and has no direct bearing on protocol behavior.";
                this.logger.warn(msg);
                return; // drop re-INVITE request message
            };
            // A UAS that receives a second INVITE before it sends the final
            // response to a first INVITE with a lower CSeq sequence number on the
            // same dialog MUST return a 500 (Server Internal Error) response to the
            // second INVITE and MUST include a Retry-After header field with a
            // randomly chosen value of between 0 and 10 seconds.
            // https://tools.ietf.org/html/rfc3261#section-14.2
            const retryAfter = Math.floor(Math.random() * 10) + 1;
            const extraHeaders = [`Retry-After: ${retryAfter}`];
            // There may be ONLY ONE offer/answer negotiation in progress for a
            // single dialog at any point in time.  Section 4 explains how to ensure
            // this.
            // https://tools.ietf.org/html/rfc6337#section-2.2
            if (this.ackProcessing) {
                // UAS-IsI:  While an INVITE server transaction is incomplete or ACK
                //           transaction associated with an offer/answer is incomplete,
                //           a UA must reject another INVITE request with a 500
                //           response.
                // https://tools.ietf.org/html/rfc6337#section-4.3
                this.core.replyStateless(message, { statusCode: 500, extraHeaders });
                warning();
                return;
            }
            // 3.1.4.  Callee Receives re-INVITE (Established State)  While in the
            // Moratorium State (Case 1)
            // https://tools.ietf.org/html/rfc5407#section-3.1.4
            // 3.1.5.  Callee Receives re-INVITE (Established State) While in the
            // Moratorium State (Case 2)
            // https://tools.ietf.org/html/rfc5407#section-3.1.5
            if (this.ackWait && this.signalingState !== SignalingState.Stable) {
                // This scenario is basically the same as that of Section 3.1.4, but
                // differs in sending an offer in the 200 and an answer in the ACK.  In
                // contrast to the previous case, the offer in the 200 (F3) and the
                // offer in the re-INVITE (F6) collide with each other.
                //
                // Bob sends a 491 to the re-INVITE (F6) since he is not able to
                // properly handle a new request until he receives an answer.  (Note:
                // 500 with a Retry-After header may be returned if the 491 response is
                // understood to indicate request collision.  However, 491 is
                // recommended here because 500 applies to so many cases that it is
                // difficult to determine what the real problem was.)
                // https://tools.ietf.org/html/rfc5407#section-3.1.5
                // UAS-IsI:  While an INVITE server transaction is incomplete or ACK
                //           transaction associated with an offer/answer is incomplete,
                //           a UA must reject another INVITE request with a 500
                //           response.
                // https://tools.ietf.org/html/rfc6337#section-4.3
                this.core.replyStateless(message, { statusCode: 500, extraHeaders });
                warning();
                return;
            }
            // A UAS that receives a second INVITE before it sends the final
            // response to a first INVITE with a lower CSeq sequence number on the
            // same dialog MUST return a 500 (Server Internal Error) response to the
            // second INVITE and MUST include a Retry-After header field with a
            // randomly chosen value of between 0 and 10 seconds.
            // https://tools.ietf.org/html/rfc3261#section-14.2
            if (this.reinviteUserAgentServer) {
                this.core.replyStateless(message, { statusCode: 500, extraHeaders });
                return;
            }
            // A UAS that receives an INVITE on a dialog while an INVITE it had sent
            // on that dialog is in progress MUST return a 491 (Request Pending)
            // response to the received INVITE.
            // https://tools.ietf.org/html/rfc3261#section-14.2
            if (this.reinviteUserAgentClient) {
                this.core.replyStateless(message, { statusCode: 491 });
                return;
            }
        }
        // Requests within a dialog MAY contain Record-Route and Contact header
        // fields.  However, these requests do not cause the dialog's route set
        // to be modified, although they may modify the remote target URI.
        // Specifically, requests that are not target refresh requests do not
        // modify the dialog's remote target URI, and requests that are target
        // refresh requests do.  For dialogs that have been established with an
        // INVITE, the only target refresh request defined is re-INVITE (see
        // Section 14).  Other extensions may define different target refresh
        // requests for dialogs established in other ways.
        //
        //    Note that an ACK is NOT a target refresh request.
        //
        // Target refresh requests only update the dialog's remote target URI,
        // and not the route set formed from the Record-Route.  Updating the
        // latter would introduce severe backwards compatibility problems with
        // RFC 2543-compliant systems.
        // https://tools.ietf.org/html/rfc3261#section-15
        if (message.method === C.INVITE) {
            // FIXME: parser needs to be typed...
            const contact = message.parseHeader("contact");
            if (!contact) {
                // TODO: Review to make sure this will never happen
                throw new Error("Contact undefined.");
            }
            if (!(contact instanceof NameAddrHeader)) {
                throw new Error("Contact not instance of NameAddrHeader.");
            }
            this.dialogState.remoteTarget = contact.uri;
        }
        // Switch on method and then delegate.
        switch (message.method) {
            case C.BYE:
                // A UAS core receiving a BYE request for an existing dialog MUST follow
                // the procedures of Section 12.2.2 to process the request.  Once done,
                // the UAS SHOULD terminate the session (and therefore stop sending and
                // listening for media).  The only case where it can elect not to are
                // multicast sessions, where participation is possible even if the other
                // participant in the dialog has terminated its involvement in the
                // session.  Whether or not it ends its participation on the session,
                // the UAS core MUST generate a 2xx response to the BYE, and MUST pass
                // that to the server transaction for transmission.
                //
                // The UAS MUST still respond to any pending requests received for that
                // dialog.  It is RECOMMENDED that a 487 (Request Terminated) response
                // be generated to those pending requests.
                // https://tools.ietf.org/html/rfc3261#section-15.1.2
                {
                    const uas = new ByeUserAgentServer(this, message);
                    this.delegate && this.delegate.onBye ? this.delegate.onBye(uas) : uas.accept();
                    this.dispose();
                }
                break;
            case C.INFO:
                // If a UA receives an INFO request associated with an Info Package that
                // the UA has not indicated willingness to receive, the UA MUST send a
                // 469 (Bad Info Package) response (see Section 11.6), which contains a
                // Recv-Info header field with Info Packages for which the UA is willing
                // to receive INFO requests.
                {
                    const uas = new InfoUserAgentServer(this, message);
                    this.delegate && this.delegate.onInfo
                        ? this.delegate.onInfo(uas)
                        : uas.reject({
                            statusCode: 469,
                            extraHeaders: ["Recv-Info:"]
                        });
                }
                break;
            case C.INVITE:
                // If the new session description is not acceptable, the UAS can reject
                // it by returning a 488 (Not Acceptable Here) response for the re-
                // INVITE.  This response SHOULD include a Warning header field.
                // https://tools.ietf.org/html/rfc3261#section-14.2
                {
                    const uas = new ReInviteUserAgentServer(this, message);
                    this.signalingStateTransition(message);
                    this.delegate && this.delegate.onInvite ? this.delegate.onInvite(uas) : uas.reject({ statusCode: 488 }); // TODO: Warning header field.
                }
                break;
            case C.MESSAGE:
                {
                    const uas = new MessageUserAgentServer(this.core, message);
                    this.delegate && this.delegate.onMessage ? this.delegate.onMessage(uas) : uas.accept();
                }
                break;
            case C.NOTIFY:
                // https://tools.ietf.org/html/rfc3515#section-2.4.4
                {
                    const uas = new NotifyUserAgentServer(this, message);
                    this.delegate && this.delegate.onNotify ? this.delegate.onNotify(uas) : uas.accept();
                }
                break;
            case C.PRACK:
                // https://tools.ietf.org/html/rfc3262#section-4
                {
                    const uas = new PrackUserAgentServer(this, message);
                    this.delegate && this.delegate.onPrack ? this.delegate.onPrack(uas) : uas.accept();
                }
                break;
            case C.REFER:
                // https://tools.ietf.org/html/rfc3515#section-2.4.2
                {
                    const uas = new ReferUserAgentServer(this, message);
                    this.delegate && this.delegate.onRefer ? this.delegate.onRefer(uas) : uas.reject();
                }
                break;
            default:
                {
                    this.logger.log(`INVITE dialog ${this.id} received unimplemented ${message.method} request`);
                    this.core.replyStateless(message, { statusCode: 501 });
                }
                break;
        }
    }
    /**
     * Guard against out of order reliable provisional responses and retransmissions.
     * Returns false if the response should be discarded, otherwise true.
     * @param message - Incoming response message within this dialog.
     */
    reliableSequenceGuard(message) {
        const statusCode = message.statusCode;
        if (!statusCode) {
            throw new Error("Status code undefined");
        }
        if (statusCode > 100 && statusCode < 200) {
            // If a provisional response is received for an initial request, and
            // that response contains a Require header field containing the option
            // tag 100rel, the response is to be sent reliably.  If the response is
            // a 100 (Trying) (as opposed to 101 to 199), this option tag MUST be
            // ignored, and the procedures below MUST NOT be used.
            // https://tools.ietf.org/html/rfc3262#section-4
            const requireHeader = message.getHeader("require");
            const rseqHeader = message.getHeader("rseq");
            const rseq = requireHeader && requireHeader.includes("100rel") && rseqHeader ? Number(rseqHeader) : undefined;
            if (rseq) {
                // Handling of subsequent reliable provisional responses for the same
                // initial request follows the same rules as above, with the following
                // difference: reliable provisional responses are guaranteed to be in
                // order.  As a result, if the UAC receives another reliable provisional
                // response to the same request, and its RSeq value is not one higher
                // than the value of the sequence number, that response MUST NOT be
                // acknowledged with a PRACK, and MUST NOT be processed further by the
                // UAC.  An implementation MAY discard the response, or MAY cache the
                // response in the hopes of receiving the missing responses.
                // https://tools.ietf.org/html/rfc3262#section-4
                if (this.rseq && this.rseq + 1 !== rseq) {
                    return false;
                }
                // Once a reliable provisional response is received, retransmissions of
                // that response MUST be discarded.  A response is a retransmission when
                // its dialog ID, CSeq, and RSeq match the original response.  The UAC
                // MUST maintain a sequence number that indicates the most recently
                // received in-order reliable provisional response for the initial
                // request.  This sequence number MUST be maintained until a final
                // response is received for the initial request.  Its value MUST be
                // initialized to the RSeq header field in the first reliable
                // provisional response received for the initial request.
                // https://tools.ietf.org/html/rfc3262#section-4
                this.rseq = this.rseq ? this.rseq + 1 : rseq;
            }
        }
        return true;
    }
    /**
     * If not in a stable signaling state, rollback to prior stable signaling state.
     */
    signalingStateRollback() {
        if (this._signalingState === SignalingState.HaveLocalOffer ||
            this.signalingState === SignalingState.HaveRemoteOffer) {
            if (this._rollbackOffer && this._rollbackAnswer) {
                this._signalingState = SignalingState.Stable;
                this._offer = this._rollbackOffer;
                this._answer = this._rollbackAnswer;
            }
        }
    }
    /**
     * Update the signaling state of the dialog.
     * @param message - The message to base the update off of.
     */
    signalingStateTransition(message) {
        const body = getBody(message);
        // No body, no session. No, woman, no cry.
        if (!body || body.contentDisposition !== "session") {
            return;
        }
        // We've got an existing offer and answer which we may wish to rollback to
        if (this._signalingState === SignalingState.Stable) {
            this._rollbackOffer = this._offer;
            this._rollbackAnswer = this._answer;
        }
        // We're in UAS role, receiving incoming request with session description
        if (message instanceof IncomingRequestMessage) {
            switch (this._signalingState) {
                case SignalingState.Initial:
                case SignalingState.Stable:
                    this._signalingState = SignalingState.HaveRemoteOffer;
                    this._offer = body;
                    this._answer = undefined;
                    break;
                case SignalingState.HaveLocalOffer:
                    this._signalingState = SignalingState.Stable;
                    this._answer = body;
                    break;
                case SignalingState.HaveRemoteOffer:
                    // You cannot make a new offer while one is in progress.
                    // https://tools.ietf.org/html/rfc3261#section-13.2.1
                    // FIXME: What to do here?
                    break;
                case SignalingState.Closed:
                    break;
                default:
                    throw new Error("Unexpected signaling state.");
            }
        }
        // We're in UAC role, receiving incoming response with session description
        if (message instanceof IncomingResponseMessage) {
            switch (this._signalingState) {
                case SignalingState.Initial:
                case SignalingState.Stable:
                    this._signalingState = SignalingState.HaveRemoteOffer;
                    this._offer = body;
                    this._answer = undefined;
                    break;
                case SignalingState.HaveLocalOffer:
                    this._signalingState = SignalingState.Stable;
                    this._answer = body;
                    break;
                case SignalingState.HaveRemoteOffer:
                    // You cannot make a new offer while one is in progress.
                    // https://tools.ietf.org/html/rfc3261#section-13.2.1
                    // FIXME: What to do here?
                    break;
                case SignalingState.Closed:
                    break;
                default:
                    throw new Error("Unexpected signaling state.");
            }
        }
        // We're in UAC role, sending outgoing request with session description
        if (message instanceof OutgoingRequestMessage) {
            switch (this._signalingState) {
                case SignalingState.Initial:
                case SignalingState.Stable:
                    this._signalingState = SignalingState.HaveLocalOffer;
                    this._offer = body;
                    this._answer = undefined;
                    break;
                case SignalingState.HaveLocalOffer:
                    // You cannot make a new offer while one is in progress.
                    // https://tools.ietf.org/html/rfc3261#section-13.2.1
                    // FIXME: What to do here?
                    break;
                case SignalingState.HaveRemoteOffer:
                    this._signalingState = SignalingState.Stable;
                    this._answer = body;
                    break;
                case SignalingState.Closed:
                    break;
                default:
                    throw new Error("Unexpected signaling state.");
            }
        }
        // We're in UAS role, sending outgoing response with session description
        if (isBody(message)) {
            switch (this._signalingState) {
                case SignalingState.Initial:
                case SignalingState.Stable:
                    this._signalingState = SignalingState.HaveLocalOffer;
                    this._offer = body;
                    this._answer = undefined;
                    break;
                case SignalingState.HaveLocalOffer:
                    // You cannot make a new offer while one is in progress.
                    // https://tools.ietf.org/html/rfc3261#section-13.2.1
                    // FIXME: What to do here?
                    break;
                case SignalingState.HaveRemoteOffer:
                    this._signalingState = SignalingState.Stable;
                    this._answer = body;
                    break;
                case SignalingState.Closed:
                    break;
                default:
                    throw new Error("Unexpected signaling state.");
            }
        }
    }
    start2xxRetransmissionTimer() {
        if (this.initialTransaction instanceof InviteServerTransaction) {
            const transaction = this.initialTransaction;
            // Once the response has been constructed, it is passed to the INVITE
            // server transaction.  In order to ensure reliable end-to-end
            // transport of the response, it is necessary to periodically pass
            // the response directly to the transport until the ACK arrives.  The
            // 2xx response is passed to the transport with an interval that
            // starts at T1 seconds and doubles for each retransmission until it
            // reaches T2 seconds (T1 and T2 are defined in Section 17).
            // Response retransmissions cease when an ACK request for the
            // response is received.  This is independent of whatever transport
            // protocols are used to send the response.
            // https://tools.ietf.org/html/rfc6026#section-8.1
            let timeout = Timers.T1;
            const retransmission = () => {
                if (!this.ackWait) {
                    this.invite2xxTimer = undefined;
                    return;
                }
                this.logger.log("No ACK for 2xx response received, attempting retransmission");
                transaction.retransmitAcceptedResponse();
                timeout = Math.min(timeout * 2, Timers.T2);
                this.invite2xxTimer = setTimeout(retransmission, timeout);
            };
            this.invite2xxTimer = setTimeout(retransmission, timeout);
            // If the server retransmits the 2xx response for 64*T1 seconds without
            // receiving an ACK, the dialog is confirmed, but the session SHOULD be
            // terminated.  This is accomplished with a BYE, as described in Section 15.
            // https://tools.ietf.org/html/rfc3261#section-13.3.1.4
            const stateChanged = () => {
                if (transaction.state === TransactionState.Terminated) {
                    transaction.removeStateChangeListener(stateChanged);
                    if (this.invite2xxTimer) {
                        clearTimeout(this.invite2xxTimer);
                        this.invite2xxTimer = undefined;
                    }
                    if (this.ackWait) {
                        if (this.delegate && this.delegate.onAckTimeout) {
                            this.delegate.onAckTimeout();
                        }
                        else {
                            this.bye();
                        }
                    }
                }
            };
            transaction.addStateChangeListener(stateChanged);
        }
    }
    // FIXME: Refactor
    startReInvite2xxRetransmissionTimer() {
        if (this.reinviteUserAgentServer && this.reinviteUserAgentServer.transaction instanceof InviteServerTransaction) {
            const transaction = this.reinviteUserAgentServer.transaction;
            // Once the response has been constructed, it is passed to the INVITE
            // server transaction.  In order to ensure reliable end-to-end
            // transport of the response, it is necessary to periodically pass
            // the response directly to the transport until the ACK arrives.  The
            // 2xx response is passed to the transport with an interval that
            // starts at T1 seconds and doubles for each retransmission until it
            // reaches T2 seconds (T1 and T2 are defined in Section 17).
            // Response retransmissions cease when an ACK request for the
            // response is received.  This is independent of whatever transport
            // protocols are used to send the response.
            // https://tools.ietf.org/html/rfc6026#section-8.1
            let timeout = Timers.T1;
            const retransmission = () => {
                if (!this.reinviteUserAgentServer) {
                    this.invite2xxTimer = undefined;
                    return;
                }
                this.logger.log("No ACK for 2xx response received, attempting retransmission");
                transaction.retransmitAcceptedResponse();
                timeout = Math.min(timeout * 2, Timers.T2);
                this.invite2xxTimer = setTimeout(retransmission, timeout);
            };
            this.invite2xxTimer = setTimeout(retransmission, timeout);
            // If the server retransmits the 2xx response for 64*T1 seconds without
            // receiving an ACK, the dialog is confirmed, but the session SHOULD be
            // terminated.  This is accomplished with a BYE, as described in Section 15.
            // https://tools.ietf.org/html/rfc3261#section-13.3.1.4
            const stateChanged = () => {
                if (transaction.state === TransactionState.Terminated) {
                    transaction.removeStateChangeListener(stateChanged);
                    if (this.invite2xxTimer) {
                        clearTimeout(this.invite2xxTimer);
                        this.invite2xxTimer = undefined;
                    }
                    if (this.reinviteUserAgentServer) ;
                }
            };
            transaction.addStateChangeListener(stateChanged);
        }
    }
}

/**
 * INVITE UAC.
 * @remarks
 * 13 Initiating a Session
 * https://tools.ietf.org/html/rfc3261#section-13
 * 13.1 Overview
 * https://tools.ietf.org/html/rfc3261#section-13.1
 * 13.2 UAC Processing
 * https://tools.ietf.org/html/rfc3261#section-13.2
 * @public
 */
class InviteUserAgentClient extends UserAgentClient {
    constructor(core, message, delegate) {
        super(InviteClientTransaction, core, message, delegate);
        this.confirmedDialogAcks = new Map();
        this.confirmedDialogs = new Map();
        this.earlyDialogs = new Map();
        this.delegate = delegate;
    }
    dispose() {
        // The UAC core considers the INVITE transaction completed 64*T1 seconds
        // after the reception of the first 2xx response.  At this point all the
        // early dialogs that have not transitioned to established dialogs are
        // terminated.  Once the INVITE transaction is considered completed by
        // the UAC core, no more new 2xx responses are expected to arrive.
        //
        // If, after acknowledging any 2xx response to an INVITE, the UAC does
        // not want to continue with that dialog, then the UAC MUST terminate
        // the dialog by sending a BYE request as described in Section 15.
        // https://tools.ietf.org/html/rfc3261#section-13.2.2.4
        this.earlyDialogs.forEach((earlyDialog) => earlyDialog.dispose());
        this.earlyDialogs.clear();
        super.dispose();
    }
    /**
     * Special case for transport error while sending ACK.
     * @param error - Transport error
     */
    onTransportError(error) {
        if (this.transaction.state === TransactionState.Calling) {
            return super.onTransportError(error);
        }
        // If not in 'calling' state, the transport error occurred while sending an ACK.
        this.logger.error(error.message);
        this.logger.error("User agent client request transport error while sending ACK.");
    }
    /**
     * Once the INVITE has been passed to the INVITE client transaction, the
     * UAC waits for responses for the INVITE.
     * https://tools.ietf.org/html/rfc3261#section-13.2.2
     * @param incomingResponse - Incoming response to INVITE request.
     */
    receiveResponse(message) {
        if (!this.authenticationGuard(message)) {
            return;
        }
        const statusCode = message.statusCode ? message.statusCode.toString() : "";
        if (!statusCode) {
            throw new Error("Response status code undefined.");
        }
        switch (true) {
            case /^100$/.test(statusCode):
                if (this.delegate && this.delegate.onTrying) {
                    this.delegate.onTrying({ message });
                }
                return;
            case /^1[0-9]{2}$/.test(statusCode):
                // Zero, one or multiple provisional responses may arrive before one or
                // more final responses are received.  Provisional responses for an
                // INVITE request can create "early dialogs".  If a provisional response
                // has a tag in the To field, and if the dialog ID of the response does
                // not match an existing dialog, one is constructed using the procedures
                // defined in Section 12.1.2.
                //
                // The early dialog will only be needed if the UAC needs to send a
                // request to its peer within the dialog before the initial INVITE
                // transaction completes.  Header fields present in a provisional
                // response are applicable as long as the dialog is in the early state
                // (for example, an Allow header field in a provisional response
                // contains the methods that can be used in the dialog while this is in
                // the early state).
                // https://tools.ietf.org/html/rfc3261#section-13.2.2.1
                {
                    // Dialogs are created through the generation of non-failure responses
                    // to requests with specific methods.  Within this specification, only
                    // 2xx and 101-199 responses with a To tag, where the request was
                    // INVITE, will establish a dialog.  A dialog established by a non-final
                    // response to a request is in the "early" state and it is called an
                    // early dialog.
                    // https://tools.ietf.org/html/rfc3261#section-12.1
                    // Provisional without to tag, no dialog to create.
                    if (!message.toTag) {
                        this.logger.warn("Non-100 1xx INVITE response received without a to tag, dropping.");
                        return;
                    }
                    // When a UAS responds to a request with a response that establishes a
                    // dialog (such as a 2xx to INVITE), the UAS MUST copy all Record-Route
                    // header field values from the request into the response (including the
                    // URIs, URI parameters, and any Record-Route header field parameters,
                    // whether they are known or unknown to the UAS) and MUST maintain the
                    // order of those values.  The UAS MUST add a Contact header field to
                    // the response.
                    // https://tools.ietf.org/html/rfc3261#section-12.1.1
                    // Provisional without Contact header field, malformed response.
                    const contact = message.parseHeader("contact");
                    if (!contact) {
                        this.logger.error("Non-100 1xx INVITE response received without a Contact header field, dropping.");
                        return;
                    }
                    // Compute dialog state.
                    const dialogState = Dialog.initialDialogStateForUserAgentClient(this.message, message);
                    // Have existing early dialog or create a new one.
                    let earlyDialog = this.earlyDialogs.get(dialogState.id);
                    if (!earlyDialog) {
                        const transaction = this.transaction;
                        if (!(transaction instanceof InviteClientTransaction)) {
                            throw new Error("Transaction not instance of InviteClientTransaction.");
                        }
                        earlyDialog = new SessionDialog(transaction, this.core, dialogState);
                        this.earlyDialogs.set(earlyDialog.id, earlyDialog);
                    }
                    // Guard against out of order reliable provisional responses.
                    // Note that this is where the rseq tracking is done.
                    if (!earlyDialog.reliableSequenceGuard(message)) {
                        this.logger.warn("1xx INVITE reliable response received out of order or is a retransmission, dropping.");
                        return;
                    }
                    // If the initial offer is in an INVITE, the answer MUST be in a
                    // reliable non-failure message from UAS back to UAC which is
                    // correlated to that INVITE.  For this specification, that is
                    // only the final 2xx response to that INVITE.  That same exact
                    // answer MAY also be placed in any provisional responses sent
                    // prior to the answer.  The UAC MUST treat the first session
                    // description it receives as the answer, and MUST ignore any
                    // session descriptions in subsequent responses to the initial
                    // INVITE.
                    // https://tools.ietf.org/html/rfc3261#section-13.2.1
                    if (earlyDialog.signalingState === SignalingState.Initial ||
                        earlyDialog.signalingState === SignalingState.HaveLocalOffer) {
                        earlyDialog.signalingStateTransition(message);
                    }
                    // Pass response to delegate.
                    const session = earlyDialog;
                    if (this.delegate && this.delegate.onProgress) {
                        this.delegate.onProgress({
                            message,
                            session,
                            prack: (options) => {
                                const outgoingPrackRequest = session.prack(undefined, options);
                                return outgoingPrackRequest;
                            }
                        });
                    }
                }
                return;
            case /^2[0-9]{2}$/.test(statusCode):
                // Multiple 2xx responses may arrive at the UAC for a single INVITE
                // request due to a forking proxy.  Each response is distinguished by
                // the tag parameter in the To header field, and each represents a
                // distinct dialog, with a distinct dialog identifier.
                //
                // If the dialog identifier in the 2xx response matches the dialog
                // identifier of an existing dialog, the dialog MUST be transitioned to
                // the "confirmed" state, and the route set for the dialog MUST be
                // recomputed based on the 2xx response using the procedures of Section
                // 12.2.1.2.  Otherwise, a new dialog in the "confirmed" state MUST be
                // constructed using the procedures of Section 12.1.2.
                // https://tools.ietf.org/html/rfc3261#section-13.2.2.4
                {
                    // Dialogs are created through the generation of non-failure responses
                    // to requests with specific methods.  Within this specification, only
                    // 2xx and 101-199 responses with a To tag, where the request was
                    // INVITE, will establish a dialog.  A dialog established by a non-final
                    // response to a request is in the "early" state and it is called an
                    // early dialog.
                    // https://tools.ietf.org/html/rfc3261#section-12.1
                    // Final without to tag, malformed response.
                    if (!message.toTag) {
                        this.logger.error("2xx INVITE response received without a to tag, dropping.");
                        return;
                    }
                    // When a UAS responds to a request with a response that establishes a
                    // dialog (such as a 2xx to INVITE), the UAS MUST copy all Record-Route
                    // header field values from the request into the response (including the
                    // URIs, URI parameters, and any Record-Route header field parameters,
                    // whether they are known or unknown to the UAS) and MUST maintain the
                    // order of those values.  The UAS MUST add a Contact header field to
                    // the response.
                    // https://tools.ietf.org/html/rfc3261#section-12.1.1
                    // Final without Contact header field, malformed response.
                    const contact = message.parseHeader("contact");
                    if (!contact) {
                        this.logger.error("2xx INVITE response received without a Contact header field, dropping.");
                        return;
                    }
                    // Compute dialog state.
                    const dialogState = Dialog.initialDialogStateForUserAgentClient(this.message, message);
                    // NOTE: Currently our transaction layer is caching the 2xx ACKs and
                    // handling retransmissions of the ACK which is an approach which is
                    // not to spec. In any event, this block is intended to provide a to
                    // spec implementation of ACK retransmissions, but it should not be
                    // hit currently.
                    let dialog = this.confirmedDialogs.get(dialogState.id);
                    if (dialog) {
                        // Once the ACK has been constructed, the procedures of [4] are used to
                        // determine the destination address, port and transport.  However, the
                        // request is passed to the transport layer directly for transmission,
                        // rather than a client transaction.  This is because the UAC core
                        // handles retransmissions of the ACK, not the transaction layer.  The
                        // ACK MUST be passed to the client transport every time a
                        // retransmission of the 2xx final response that triggered the ACK
                        // arrives.
                        // https://tools.ietf.org/html/rfc3261#section-13.2.2.4
                        const outgoingAckRequest = this.confirmedDialogAcks.get(dialogState.id);
                        if (outgoingAckRequest) {
                            const transaction = this.transaction;
                            if (!(transaction instanceof InviteClientTransaction)) {
                                throw new Error("Client transaction not instance of InviteClientTransaction.");
                            }
                            transaction.ackResponse(outgoingAckRequest.message);
                        }
                        return;
                    }
                    // If the dialog identifier in the 2xx response matches the dialog
                    // identifier of an existing dialog, the dialog MUST be transitioned to
                    // the "confirmed" state, and the route set for the dialog MUST be
                    // recomputed based on the 2xx response using the procedures of Section
                    // 12.2.1.2. Otherwise, a new dialog in the "confirmed" state MUST be
                    // constructed using the procedures of Section 12.1.2.
                    // https://tools.ietf.org/html/rfc3261#section-13.2.2.4
                    dialog = this.earlyDialogs.get(dialogState.id);
                    if (dialog) {
                        dialog.confirm();
                        dialog.recomputeRouteSet(message);
                        this.earlyDialogs.delete(dialog.id);
                        this.confirmedDialogs.set(dialog.id, dialog);
                    }
                    else {
                        const transaction = this.transaction;
                        if (!(transaction instanceof InviteClientTransaction)) {
                            throw new Error("Transaction not instance of InviteClientTransaction.");
                        }
                        dialog = new SessionDialog(transaction, this.core, dialogState);
                        this.confirmedDialogs.set(dialog.id, dialog);
                    }
                    // If the initial offer is in an INVITE, the answer MUST be in a
                    // reliable non-failure message from UAS back to UAC which is
                    // correlated to that INVITE.  For this specification, that is
                    // only the final 2xx response to that INVITE.  That same exact
                    // answer MAY also be placed in any provisional responses sent
                    // prior to the answer.  The UAC MUST treat the first session
                    // description it receives as the answer, and MUST ignore any
                    // session descriptions in subsequent responses to the initial
                    // INVITE.
                    // https://tools.ietf.org/html/rfc3261#section-13.2.1
                    if (dialog.signalingState === SignalingState.Initial ||
                        dialog.signalingState === SignalingState.HaveLocalOffer) {
                        dialog.signalingStateTransition(message);
                    }
                    // Session Initiated! :)
                    const session = dialog;
                    // The UAC core MUST generate an ACK request for each 2xx received from
                    // the transaction layer.  The header fields of the ACK are constructed
                    // in the same way as for any request sent within a dialog (see Section
                    // 12) with the exception of the CSeq and the header fields related to
                    // authentication.  The sequence number of the CSeq header field MUST be
                    // the same as the INVITE being acknowledged, but the CSeq method MUST
                    // be ACK.  The ACK MUST contain the same credentials as the INVITE.  If
                    // the 2xx contains an offer (based on the rules above), the ACK MUST
                    // carry an answer in its body.  If the offer in the 2xx response is not
                    // acceptable, the UAC core MUST generate a valid answer in the ACK and
                    // then send a BYE immediately.
                    // https://tools.ietf.org/html/rfc3261#section-13.2.2.4
                    if (this.delegate && this.delegate.onAccept) {
                        this.delegate.onAccept({
                            message,
                            session,
                            ack: (options) => {
                                const outgoingAckRequest = session.ack(options);
                                this.confirmedDialogAcks.set(session.id, outgoingAckRequest);
                                return outgoingAckRequest;
                            }
                        });
                    }
                    else {
                        const outgoingAckRequest = session.ack();
                        this.confirmedDialogAcks.set(session.id, outgoingAckRequest);
                    }
                }
                return;
            case /^3[0-9]{2}$/.test(statusCode):
                // 12.3 Termination of a Dialog
                //
                // Independent of the method, if a request outside of a dialog generates
                // a non-2xx final response, any early dialogs created through
                // provisional responses to that request are terminated.  The mechanism
                // for terminating confirmed dialogs is method specific.  In this
                // specification, the BYE method terminates a session and the dialog
                // associated with it.  See Section 15 for details.
                // https://tools.ietf.org/html/rfc3261#section-12.3
                // All early dialogs are considered terminated upon reception of the
                // non-2xx final response.
                //
                // After having received the non-2xx final response the UAC core
                // considers the INVITE transaction completed.  The INVITE client
                // transaction handles the generation of ACKs for the response (see
                // Section 17).
                // https://tools.ietf.org/html/rfc3261#section-13.2.2.3
                this.earlyDialogs.forEach((earlyDialog) => earlyDialog.dispose());
                this.earlyDialogs.clear();
                // A 3xx response may contain one or more Contact header field values
                // providing new addresses where the callee might be reachable.
                // Depending on the status code of the 3xx response (see Section 21.3),
                // the UAC MAY choose to try those new addresses.
                // https://tools.ietf.org/html/rfc3261#section-13.2.2.2
                if (this.delegate && this.delegate.onRedirect) {
                    this.delegate.onRedirect({ message });
                }
                return;
            case /^[4-6][0-9]{2}$/.test(statusCode):
                // 12.3 Termination of a Dialog
                //
                // Independent of the method, if a request outside of a dialog generates
                // a non-2xx final response, any early dialogs created through
                // provisional responses to that request are terminated.  The mechanism
                // for terminating confirmed dialogs is method specific.  In this
                // specification, the BYE method terminates a session and the dialog
                // associated with it.  See Section 15 for details.
                // https://tools.ietf.org/html/rfc3261#section-12.3
                // All early dialogs are considered terminated upon reception of the
                // non-2xx final response.
                //
                // After having received the non-2xx final response the UAC core
                // considers the INVITE transaction completed.  The INVITE client
                // transaction handles the generation of ACKs for the response (see
                // Section 17).
                // https://tools.ietf.org/html/rfc3261#section-13.2.2.3
                this.earlyDialogs.forEach((earlyDialog) => earlyDialog.dispose());
                this.earlyDialogs.clear();
                // A single non-2xx final response may be received for the INVITE.  4xx,
                // 5xx and 6xx responses may contain a Contact header field value
                // indicating the location where additional information about the error
                // can be found.  Subsequent final responses (which would only arrive
                // under error conditions) MUST be ignored.
                // https://tools.ietf.org/html/rfc3261#section-13.2.2.3
                if (this.delegate && this.delegate.onReject) {
                    this.delegate.onReject({ message });
                }
                return;
            default:
                throw new Error(`Invalid status code ${statusCode}`);
        }
    }
}

/**
 * INVITE UAS.
 * @remarks
 * 13 Initiating a Session
 * https://tools.ietf.org/html/rfc3261#section-13
 * 13.1 Overview
 * https://tools.ietf.org/html/rfc3261#section-13.1
 * 13.3 UAS Processing
 * https://tools.ietf.org/html/rfc3261#section-13.3
 * @public
 */
class InviteUserAgentServer extends UserAgentServer {
    constructor(core, message, delegate) {
        super(InviteServerTransaction, core, message, delegate);
        this.core = core;
    }
    dispose() {
        if (this.earlyDialog) {
            this.earlyDialog.dispose();
        }
        super.dispose();
    }
    /**
     * 13.3.1.4 The INVITE is Accepted
     * The UAS core generates a 2xx response.  This response establishes a
     * dialog, and therefore follows the procedures of Section 12.1.1 in
     * addition to those of Section 8.2.6.
     * https://tools.ietf.org/html/rfc3261#section-13.3.1.4
     * @param options - Accept options bucket.
     */
    accept(options = { statusCode: 200 }) {
        if (!this.acceptable) {
            throw new TransactionStateError(`${this.message.method} not acceptable in state ${this.transaction.state}.`);
        }
        // This response establishes a dialog...
        // https://tools.ietf.org/html/rfc3261#section-13.3.1.4
        if (!this.confirmedDialog) {
            if (this.earlyDialog) {
                this.earlyDialog.confirm();
                this.confirmedDialog = this.earlyDialog;
                this.earlyDialog = undefined;
            }
            else {
                const transaction = this.transaction;
                if (!(transaction instanceof InviteServerTransaction)) {
                    throw new Error("Transaction not instance of InviteClientTransaction.");
                }
                const state = Dialog.initialDialogStateForUserAgentServer(this.message, this.toTag);
                this.confirmedDialog = new SessionDialog(transaction, this.core, state);
            }
        }
        // When a UAS responds to a request with a response that establishes a
        // dialog (such as a 2xx to INVITE), the UAS MUST copy all Record-Route
        // header field values from the request into the response (including the
        // URIs, URI parameters, and any Record-Route header field parameters,
        // whether they are known or unknown to the UAS) and MUST maintain the
        // order of those values.  The UAS MUST add a Contact header field to
        // the response.  The Contact header field contains an address where the
        // UAS would like to be contacted for subsequent requests in the dialog
        // (which includes the ACK for a 2xx response in the case of an INVITE).
        // Generally, the host portion of this URI is the IP address or FQDN of
        // the host.  The URI provided in the Contact header field MUST be a SIP
        // or SIPS URI.  If the request that initiated the dialog contained a
        // SIPS URI in the Request-URI or in the top Record-Route header field
        // value, if there was any, or the Contact header field if there was no
        // Record-Route header field, the Contact header field in the response
        // MUST be a SIPS URI.  The URI SHOULD have global scope (that is, the
        // same URI can be used in messages outside this dialog).  The same way,
        // the scope of the URI in the Contact header field of the INVITE is not
        // limited to this dialog either.  It can therefore be used in messages
        // to the UAC even outside this dialog.
        // https://tools.ietf.org/html/rfc3261#section-12.1.1
        const recordRouteHeader = this.message.getHeaders("record-route").map((header) => `Record-Route: ${header}`);
        const contactHeader = `Contact: ${this.core.configuration.contact.toString()}`;
        // A 2xx response to an INVITE SHOULD contain the Allow header field and
        // the Supported header field, and MAY contain the Accept header field.
        // Including these header fields allows the UAC to determine the
        // features and extensions supported by the UAS for the duration of the
        // call, without probing.
        // https://tools.ietf.org/html/rfc3261#section-13.3.1.4
        // FIXME: TODO: This should not be hard coded.
        const allowHeader = "Allow: " + AllowedMethods.toString();
        // FIXME: TODO: Supported header (see reply())
        // FIXME: TODO: Accept header
        // If the INVITE request contained an offer, and the UAS had not yet
        // sent an answer, the 2xx MUST contain an answer.  If the INVITE did
        // not contain an offer, the 2xx MUST contain an offer if the UAS had
        // not yet sent an offer.
        // https://tools.ietf.org/html/rfc3261#section-13.3.1.4
        if (!options.body) {
            if (this.confirmedDialog.signalingState === SignalingState.Stable) {
                options.body = this.confirmedDialog.answer; // resend the answer sent in provisional response
            }
            else if (this.confirmedDialog.signalingState === SignalingState.Initial ||
                this.confirmedDialog.signalingState === SignalingState.HaveRemoteOffer) {
                throw new Error("Response must have a body.");
            }
        }
        options.statusCode = options.statusCode || 200;
        options.extraHeaders = options.extraHeaders || [];
        options.extraHeaders = options.extraHeaders.concat(recordRouteHeader);
        options.extraHeaders.push(allowHeader);
        options.extraHeaders.push(contactHeader);
        const response = super.accept(options);
        const session = this.confirmedDialog;
        const result = Object.assign(Object.assign({}, response), { session });
        // Update dialog signaling state
        if (options.body) {
            // Once the UAS has sent or received an answer to the initial
            // offer, it MUST NOT generate subsequent offers in any responses
            // to the initial INVITE.  This means that a UAS based on this
            // specification alone can never generate subsequent offers until
            // completion of the initial transaction.
            // https://tools.ietf.org/html/rfc3261#section-13.2.1
            if (this.confirmedDialog.signalingState !== SignalingState.Stable) {
                this.confirmedDialog.signalingStateTransition(options.body);
            }
        }
        return result;
    }
    /**
     * 13.3.1.1 Progress
     * If the UAS is not able to answer the invitation immediately, it can
     * choose to indicate some kind of progress to the UAC (for example, an
     * indication that a phone is ringing).  This is accomplished with a
     * provisional response between 101 and 199.  These provisional
     * responses establish early dialogs and therefore follow the procedures
     * of Section 12.1.1 in addition to those of Section 8.2.6.  A UAS MAY
     * send as many provisional responses as it likes.  Each of these MUST
     * indicate the same dialog ID.  However, these will not be delivered
     * reliably.
     *
     * If the UAS desires an extended period of time to answer the INVITE,
     * it will need to ask for an "extension" in order to prevent proxies
     * from canceling the transaction.  A proxy has the option of canceling
     * a transaction when there is a gap of 3 minutes between responses in a
     * transaction.  To prevent cancellation, the UAS MUST send a non-100
     * provisional response at every minute, to handle the possibility of
     * lost provisional responses.
     * https://tools.ietf.org/html/rfc3261#section-13.3.1.1
     * @param options - Progress options bucket.
     */
    progress(options = { statusCode: 180 }) {
        if (!this.progressable) {
            throw new TransactionStateError(`${this.message.method} not progressable in state ${this.transaction.state}.`);
        }
        // This response establishes a dialog...
        // https://tools.ietf.org/html/rfc3261#section-13.3.1.4
        if (!this.earlyDialog) {
            const transaction = this.transaction;
            if (!(transaction instanceof InviteServerTransaction)) {
                throw new Error("Transaction not instance of InviteClientTransaction.");
            }
            const state = Dialog.initialDialogStateForUserAgentServer(this.message, this.toTag, true);
            this.earlyDialog = new SessionDialog(transaction, this.core, state);
        }
        // When a UAS responds to a request with a response that establishes a
        // dialog (such as a 2xx to INVITE), the UAS MUST copy all Record-Route
        // header field values from the request into the response (including the
        // URIs, URI parameters, and any Record-Route header field parameters,
        // whether they are known or unknown to the UAS) and MUST maintain the
        // order of those values.  The UAS MUST add a Contact header field to
        // the response.  The Contact header field contains an address where the
        // UAS would like to be contacted for subsequent requests in the dialog
        // (which includes the ACK for a 2xx response in the case of an INVITE).
        // Generally, the host portion of this URI is the IP address or FQDN of
        // the host.  The URI provided in the Contact header field MUST be a SIP
        // or SIPS URI.  If the request that initiated the dialog contained a
        // SIPS URI in the Request-URI or in the top Record-Route header field
        // value, if there was any, or the Contact header field if there was no
        // Record-Route header field, the Contact header field in the response
        // MUST be a SIPS URI.  The URI SHOULD have global scope (that is, the
        // same URI can be used in messages outside this dialog).  The same way,
        // the scope of the URI in the Contact header field of the INVITE is not
        // limited to this dialog either.  It can therefore be used in messages
        // to the UAC even outside this dialog.
        // https://tools.ietf.org/html/rfc3261#section-12.1.1
        const recordRouteHeader = this.message.getHeaders("record-route").map((header) => `Record-Route: ${header}`);
        const contactHeader = `Contact: ${this.core.configuration.contact}`;
        options.extraHeaders = options.extraHeaders || [];
        options.extraHeaders = options.extraHeaders.concat(recordRouteHeader);
        options.extraHeaders.push(contactHeader);
        const response = super.progress(options);
        const session = this.earlyDialog;
        const result = Object.assign(Object.assign({}, response), { session });
        // Update dialog signaling state
        if (options.body) {
            // Once the UAS has sent or received an answer to the initial
            // offer, it MUST NOT generate subsequent offers in any responses
            // to the initial INVITE.  This means that a UAS based on this
            // specification alone can never generate subsequent offers until
            // completion of the initial transaction.
            // https://tools.ietf.org/html/rfc3261#section-13.2.1
            if (this.earlyDialog.signalingState !== SignalingState.Stable) {
                this.earlyDialog.signalingStateTransition(options.body);
            }
        }
        return result;
    }
    /**
     * 13.3.1.2 The INVITE is Redirected
     * If the UAS decides to redirect the call, a 3xx response is sent.  A
     * 300 (Multiple Choices), 301 (Moved Permanently) or 302 (Moved
     * Temporarily) response SHOULD contain a Contact header field
     * containing one or more URIs of new addresses to be tried.  The
     * response is passed to the INVITE server transaction, which will deal
     * with its retransmissions.
     * https://tools.ietf.org/html/rfc3261#section-13.3.1.2
     * @param contacts - Contacts to redirect to.
     * @param options - Redirect options bucket.
     */
    redirect(contacts, options = { statusCode: 302 }) {
        return super.redirect(contacts, options);
    }
    /**
     * 13.3.1.3 The INVITE is Rejected
     * A common scenario occurs when the callee is currently not willing or
     * able to take additional calls at this end system.  A 486 (Busy Here)
     * SHOULD be returned in such a scenario.
     * https://tools.ietf.org/html/rfc3261#section-13.3.1.3
     * @param options - Reject options bucket.
     */
    reject(options = { statusCode: 486 }) {
        return super.reject(options);
    }
}

/**
 * PUBLISH UAC.
 * @public
 */
class PublishUserAgentClient extends UserAgentClient {
    constructor(core, message, delegate) {
        super(NonInviteClientTransaction, core, message, delegate);
    }
}

/**
 * REGISTER UAC.
 * @public
 */
class RegisterUserAgentClient extends UserAgentClient {
    constructor(core, message, delegate) {
        super(NonInviteClientTransaction, core, message, delegate);
    }
}

/**
 * REGISTER UAS.
 * @public
 */
class RegisterUserAgentServer extends UserAgentServer {
    constructor(core, message, delegate) {
        super(NonInviteServerTransaction, core, message, delegate);
        this.core = core;
    }
}

/**
 * Re-SUBSCRIBE UAC.
 * @public
 */
class ReSubscribeUserAgentClient extends UserAgentClient {
    constructor(dialog, delegate, options) {
        const message = dialog.createOutgoingRequestMessage(C.SUBSCRIBE, options);
        super(NonInviteClientTransaction, dialog.userAgentCore, message, delegate);
        this.dialog = dialog;
    }
    waitNotifyStop() {
        // TODO: Placeholder. Not utilized currently.
        return;
    }
    /**
     * Receive a response from the transaction layer.
     * @param message - Incoming response message.
     */
    receiveResponse(message) {
        if (message.statusCode && message.statusCode >= 200 && message.statusCode < 300) {
            //  The "Expires" header field in a 200-class response to SUBSCRIBE
            //  request indicates the actual duration for which the subscription will
            //  remain active (unless refreshed).  The received value might be
            //  smaller than the value indicated in the SUBSCRIBE request but cannot
            //  be larger; see Section 4.2.1 for details.
            // https://tools.ietf.org/html/rfc6665#section-4.1.2.1
            const expires = message.getHeader("Expires");
            if (!expires) {
                this.logger.warn("Expires header missing in a 200-class response to SUBSCRIBE");
            }
            else {
                const subscriptionExpiresReceived = Number(expires);
                if (this.dialog.subscriptionExpires > subscriptionExpiresReceived) {
                    this.dialog.subscriptionExpires = subscriptionExpiresReceived;
                }
            }
        }
        if (message.statusCode && message.statusCode >= 400 && message.statusCode < 700) {
            // If a SUBSCRIBE request to refresh a subscription receives a 404, 405,
            // 410, 416, 480-485, 489, 501, or 604 response, the subscriber MUST
            // consider the subscription terminated.  (See [RFC5057] for further
            // details and notes about the effect of error codes on dialogs and
            // usages within dialog, such as subscriptions).  If the subscriber
            // wishes to re-subscribe to the state, he does so by composing an
            // unrelated initial SUBSCRIBE request with a freshly generated Call-ID
            // and a new, unique "From" tag (see Section 4.1.2.1).
            // https://tools.ietf.org/html/rfc6665#section-4.1.2.2
            const errorCodes = [404, 405, 410, 416, 480, 481, 482, 483, 484, 485, 489, 501, 604];
            if (errorCodes.includes(message.statusCode)) {
                this.dialog.terminate();
            }
            // If a SUBSCRIBE request to refresh a subscription fails with any error
            // code other than those listed above, the original subscription is
            // still considered valid for the duration of the most recently known
            // "Expires" value as negotiated by the most recent successful SUBSCRIBE
            // transaction, or as communicated by a NOTIFY request in its
            // "Subscription-State" header field "expires" parameter.
            // https://tools.ietf.org/html/rfc6665#section-4.1.2.2
        }
        super.receiveResponse(message);
    }
}

/**
 * Subscription Dialog.
 * @remarks
 * SIP-Specific Event Notification
 *
 * Abstract
 *
 *    This document describes an extension to the Session Initiation
 *    Protocol (SIP) defined by RFC 3261.  The purpose of this extension is
 *    to provide an extensible framework by which SIP nodes can request
 *    notification from remote nodes indicating that certain events have
 *    occurred.
 *
 *    Note that the event notification mechanisms defined herein are NOT
 *    intended to be a general-purpose infrastructure for all classes of
 *    event subscription and notification.
 *
 *    This document represents a backwards-compatible improvement on the
 *    original mechanism described by RFC 3265, taking into account several
 *    years of implementation experience.  Accordingly, this document
 *    obsoletes RFC 3265.  This document also updates RFC 4660 slightly to
 *    accommodate some small changes to the mechanism that were discussed
 *    in that document.
 *
 *  https://tools.ietf.org/html/rfc6665
 * @public
 */
class SubscriptionDialog extends Dialog {
    constructor(subscriptionEvent, subscriptionExpires, subscriptionState, core, state, delegate) {
        super(core, state);
        this.delegate = delegate;
        this._autoRefresh = false;
        this._subscriptionEvent = subscriptionEvent;
        this._subscriptionExpires = subscriptionExpires;
        this._subscriptionExpiresInitial = subscriptionExpires;
        this._subscriptionExpiresLastSet = Math.floor(Date.now() / 1000);
        this._subscriptionRefresh = undefined;
        this._subscriptionRefreshLastSet = undefined;
        this._subscriptionState = subscriptionState;
        this.logger = core.loggerFactory.getLogger("sip.subscribe-dialog");
        this.logger.log(`SUBSCRIBE dialog ${this.id} constructed`);
    }
    /**
     * When a UAC receives a response that establishes a dialog, it
     * constructs the state of the dialog.  This state MUST be maintained
     * for the duration of the dialog.
     * https://tools.ietf.org/html/rfc3261#section-12.1.2
     * @param outgoingRequestMessage - Outgoing request message for dialog.
     * @param incomingResponseMessage - Incoming response message creating dialog.
     */
    static initialDialogStateForSubscription(outgoingSubscribeRequestMessage, incomingNotifyRequestMessage) {
        // If the request was sent over TLS, and the Request-URI contained a
        // SIPS URI, the "secure" flag is set to TRUE.
        // https://tools.ietf.org/html/rfc3261#section-12.1.2
        const secure = false; // FIXME: Currently no support for TLS.
        // The route set MUST be set to the list of URIs in the Record-Route
        // header field from the response, taken in reverse order and preserving
        // all URI parameters.  If no Record-Route header field is present in
        // the response, the route set MUST be set to the empty set.  This route
        // set, even if empty, overrides any pre-existing route set for future
        // requests in this dialog.  The remote target MUST be set to the URI
        // from the Contact header field of the response.
        // https://tools.ietf.org/html/rfc3261#section-12.1.2
        const routeSet = incomingNotifyRequestMessage.getHeaders("record-route");
        const contact = incomingNotifyRequestMessage.parseHeader("contact");
        if (!contact) {
            // TODO: Review to make sure this will never happen
            throw new Error("Contact undefined.");
        }
        if (!(contact instanceof NameAddrHeader)) {
            throw new Error("Contact not instance of NameAddrHeader.");
        }
        const remoteTarget = contact.uri;
        // The local sequence number MUST be set to the value of the sequence
        // number in the CSeq header field of the request.  The remote sequence
        // number MUST be empty (it is established when the remote UA sends a
        // request within the dialog).  The call identifier component of the
        // dialog ID MUST be set to the value of the Call-ID in the request.
        // The local tag component of the dialog ID MUST be set to the tag in
        // the From field in the request, and the remote tag component of the
        // dialog ID MUST be set to the tag in the To field of the response.  A
        // UAC MUST be prepared to receive a response without a tag in the To
        // field, in which case the tag is considered to have a value of null.
        //
        //    This is to maintain backwards compatibility with RFC 2543, which
        //    did not mandate To tags.
        //
        // https://tools.ietf.org/html/rfc3261#section-12.1.2
        const localSequenceNumber = outgoingSubscribeRequestMessage.cseq;
        const remoteSequenceNumber = undefined;
        const callId = outgoingSubscribeRequestMessage.callId;
        const localTag = outgoingSubscribeRequestMessage.fromTag;
        const remoteTag = incomingNotifyRequestMessage.fromTag;
        if (!callId) {
            // TODO: Review to make sure this will never happen
            throw new Error("Call id undefined.");
        }
        if (!localTag) {
            // TODO: Review to make sure this will never happen
            throw new Error("From tag undefined.");
        }
        if (!remoteTag) {
            // TODO: Review to make sure this will never happen
            throw new Error("To tag undefined."); // FIXME: No backwards compatibility with RFC 2543
        }
        // The remote URI MUST be set to the URI in the To field, and the local
        // URI MUST be set to the URI in the From field.
        // https://tools.ietf.org/html/rfc3261#section-12.1.2
        if (!outgoingSubscribeRequestMessage.from) {
            // TODO: Review to make sure this will never happen
            throw new Error("From undefined.");
        }
        if (!outgoingSubscribeRequestMessage.to) {
            // TODO: Review to make sure this will never happen
            throw new Error("To undefined.");
        }
        const localURI = outgoingSubscribeRequestMessage.from.uri;
        const remoteURI = outgoingSubscribeRequestMessage.to.uri;
        // A dialog can also be in the "early" state, which occurs when it is
        // created with a provisional response, and then transition to the
        // "confirmed" state when a 2xx final response arrives.
        // https://tools.ietf.org/html/rfc3261#section-12
        const early = false;
        const dialogState = {
            id: callId + localTag + remoteTag,
            early,
            callId,
            localTag,
            remoteTag,
            localSequenceNumber,
            remoteSequenceNumber,
            localURI,
            remoteURI,
            remoteTarget,
            routeSet,
            secure
        };
        return dialogState;
    }
    dispose() {
        super.dispose();
        if (this.N) {
            clearTimeout(this.N);
            this.N = undefined;
        }
        this.refreshTimerClear();
        this.logger.log(`SUBSCRIBE dialog ${this.id} destroyed`);
    }
    get autoRefresh() {
        return this._autoRefresh;
    }
    set autoRefresh(autoRefresh) {
        this._autoRefresh = true;
        this.refreshTimerSet();
    }
    get subscriptionEvent() {
        return this._subscriptionEvent;
    }
    /** Number of seconds until subscription expires. */
    get subscriptionExpires() {
        const secondsSinceLastSet = Math.floor(Date.now() / 1000) - this._subscriptionExpiresLastSet;
        const secondsUntilExpires = this._subscriptionExpires - secondsSinceLastSet;
        return Math.max(secondsUntilExpires, 0);
    }
    set subscriptionExpires(expires) {
        if (expires < 0) {
            throw new Error("Expires must be greater than or equal to zero.");
        }
        this._subscriptionExpires = expires;
        this._subscriptionExpiresLastSet = Math.floor(Date.now() / 1000);
        if (this.autoRefresh) {
            const refresh = this.subscriptionRefresh;
            if (refresh === undefined || refresh >= expires) {
                this.refreshTimerSet();
            }
        }
    }
    get subscriptionExpiresInitial() {
        return this._subscriptionExpiresInitial;
    }
    /** Number of seconds until subscription auto refresh. */
    get subscriptionRefresh() {
        if (this._subscriptionRefresh === undefined || this._subscriptionRefreshLastSet === undefined) {
            return undefined;
        }
        const secondsSinceLastSet = Math.floor(Date.now() / 1000) - this._subscriptionRefreshLastSet;
        const secondsUntilExpires = this._subscriptionRefresh - secondsSinceLastSet;
        return Math.max(secondsUntilExpires, 0);
    }
    get subscriptionState() {
        return this._subscriptionState;
    }
    /**
     * Receive in dialog request message from transport.
     * @param message -  The incoming request message.
     */
    receiveRequest(message) {
        this.logger.log(`SUBSCRIBE dialog ${this.id} received ${message.method} request`);
        // Request within a dialog out of sequence guard.
        // https://tools.ietf.org/html/rfc3261#section-12.2.2
        if (!this.sequenceGuard(message)) {
            this.logger.log(`SUBSCRIBE dialog ${this.id} rejected out of order ${message.method} request.`);
            return;
        }
        // Request within a dialog common processing.
        // https://tools.ietf.org/html/rfc3261#section-12.2.2
        super.receiveRequest(message);
        // Switch on method and then delegate.
        switch (message.method) {
            case C.NOTIFY:
                this.onNotify(message);
                break;
            default:
                this.logger.log(`SUBSCRIBE dialog ${this.id} received unimplemented ${message.method} request`);
                this.core.replyStateless(message, { statusCode: 501 });
                break;
        }
    }
    /**
     * 4.1.2.2.  Refreshing of Subscriptions
     * https://tools.ietf.org/html/rfc6665#section-4.1.2.2
     */
    refresh() {
        const allowHeader = "Allow: " + AllowedMethods.toString();
        const options = {};
        options.extraHeaders = (options.extraHeaders || []).slice();
        options.extraHeaders.push(allowHeader);
        options.extraHeaders.push("Event: " + this.subscriptionEvent);
        options.extraHeaders.push("Expires: " + this.subscriptionExpiresInitial);
        options.extraHeaders.push("Contact: " + this.core.configuration.contact.toString());
        return this.subscribe(undefined, options);
    }
    /**
     * 4.1.2.2.  Refreshing of Subscriptions
     * https://tools.ietf.org/html/rfc6665#section-4.1.2.2
     * @param delegate - Delegate to handle responses.
     * @param options - Options bucket.
     */
    subscribe(delegate, options = {}) {
        var _a;
        if (this.subscriptionState !== SubscriptionState.Pending && this.subscriptionState !== SubscriptionState.Active) {
            // FIXME: This needs to be a proper exception
            throw new Error(`Invalid state ${this.subscriptionState}. May only re-subscribe while in state "pending" or "active".`);
        }
        this.logger.log(`SUBSCRIBE dialog ${this.id} sending SUBSCRIBE request`);
        const uac = new ReSubscribeUserAgentClient(this, delegate, options);
        // Abort any outstanding timer (as it would otherwise become guaranteed to terminate us).
        if (this.N) {
            clearTimeout(this.N);
            this.N = undefined;
        }
        if (!((_a = options.extraHeaders) === null || _a === void 0 ? void 0 : _a.includes("Expires: 0"))) {
            // When refreshing a subscription, a subscriber starts Timer N, set to
            // 64*T1, when it sends the SUBSCRIBE request.
            // https://tools.ietf.org/html/rfc6665#section-4.1.2.2
            this.N = setTimeout(() => this.timerN(), Timers.TIMER_N);
        }
        return uac;
    }
    /**
     * 4.4.1.  Dialog Creation and Termination
     * A subscription is destroyed after a notifier sends a NOTIFY request
     * with a "Subscription-State" of "terminated", or in certain error
     * situations described elsewhere in this document.
     * https://tools.ietf.org/html/rfc6665#section-4.4.1
     */
    terminate() {
        this.stateTransition(SubscriptionState.Terminated);
        this.onTerminated();
    }
    /**
     * 4.1.2.3.  Unsubscribing
     * https://tools.ietf.org/html/rfc6665#section-4.1.2.3
     */
    unsubscribe() {
        const allowHeader = "Allow: " + AllowedMethods.toString();
        const options = {};
        options.extraHeaders = (options.extraHeaders || []).slice();
        options.extraHeaders.push(allowHeader);
        options.extraHeaders.push("Event: " + this.subscriptionEvent);
        options.extraHeaders.push("Expires: 0");
        options.extraHeaders.push("Contact: " + this.core.configuration.contact.toString());
        return this.subscribe(undefined, options);
    }
    /**
     * Handle in dialog NOTIFY requests.
     * This does not include the first NOTIFY which created the dialog.
     * @param message - The incoming NOTIFY request message.
     */
    onNotify(message) {
        // If, for some reason, the event package designated in the "Event"
        // header field of the NOTIFY request is not supported, the subscriber
        // will respond with a 489 (Bad Event) response.
        // https://tools.ietf.org/html/rfc6665#section-4.1.3
        const event = message.parseHeader("Event").event;
        if (!event || event !== this.subscriptionEvent) {
            this.core.replyStateless(message, { statusCode: 489 });
            return;
        }
        // In the state diagram, "Re-subscription times out" means that an
        // attempt to refresh or update the subscription using a new SUBSCRIBE
        // request does not result in a NOTIFY request before the corresponding
        // Timer N expires.
        // https://tools.ietf.org/html/rfc6665#section-4.1.2
        if (this.N) {
            clearTimeout(this.N);
            this.N = undefined;
        }
        // NOTIFY requests MUST contain "Subscription-State" header fields that
        // indicate the status of the subscription.
        // https://tools.ietf.org/html/rfc6665#section-4.1.3
        const subscriptionState = message.parseHeader("Subscription-State");
        if (!subscriptionState || !subscriptionState.state) {
            this.core.replyStateless(message, { statusCode: 489 });
            return;
        }
        const state = subscriptionState.state;
        const expires = subscriptionState.expires ? Math.max(subscriptionState.expires, 0) : undefined;
        // Update our state and expiration.
        switch (state) {
            case "pending":
                this.stateTransition(SubscriptionState.Pending, expires);
                break;
            case "active":
                this.stateTransition(SubscriptionState.Active, expires);
                break;
            case "terminated":
                this.stateTransition(SubscriptionState.Terminated, expires);
                break;
            default:
                this.logger.warn("Unrecognized subscription state.");
                break;
        }
        // Delegate remainder of NOTIFY handling.
        const uas = new NotifyUserAgentServer(this, message);
        if (this.delegate && this.delegate.onNotify) {
            this.delegate.onNotify(uas);
        }
        else {
            uas.accept();
        }
    }
    onRefresh(request) {
        if (this.delegate && this.delegate.onRefresh) {
            this.delegate.onRefresh(request);
        }
    }
    onTerminated() {
        if (this.delegate && this.delegate.onTerminated) {
            this.delegate.onTerminated();
        }
    }
    refreshTimerClear() {
        if (this.refreshTimer) {
            clearTimeout(this.refreshTimer);
            this.refreshTimer = undefined;
        }
    }
    refreshTimerSet() {
        this.refreshTimerClear();
        if (this.autoRefresh && this.subscriptionExpires > 0) {
            const refresh = this.subscriptionExpires * 900;
            this._subscriptionRefresh = Math.floor(refresh / 1000);
            this._subscriptionRefreshLastSet = Math.floor(Date.now() / 1000);
            this.refreshTimer = setTimeout(() => {
                this.refreshTimer = undefined;
                this._subscriptionRefresh = undefined;
                this._subscriptionRefreshLastSet = undefined;
                this.onRefresh(this.refresh());
            }, refresh);
        }
    }
    stateTransition(newState, newExpires) {
        // Assert valid state transitions.
        const invalidStateTransition = () => {
            this.logger.warn(`Invalid subscription state transition from ${this.subscriptionState} to ${newState}`);
        };
        switch (newState) {
            case SubscriptionState.Initial:
                invalidStateTransition();
                return;
            case SubscriptionState.NotifyWait:
                invalidStateTransition();
                return;
            case SubscriptionState.Pending:
                if (this.subscriptionState !== SubscriptionState.NotifyWait &&
                    this.subscriptionState !== SubscriptionState.Pending) {
                    invalidStateTransition();
                    return;
                }
                break;
            case SubscriptionState.Active:
                if (this.subscriptionState !== SubscriptionState.NotifyWait &&
                    this.subscriptionState !== SubscriptionState.Pending &&
                    this.subscriptionState !== SubscriptionState.Active) {
                    invalidStateTransition();
                    return;
                }
                break;
            case SubscriptionState.Terminated:
                if (this.subscriptionState !== SubscriptionState.NotifyWait &&
                    this.subscriptionState !== SubscriptionState.Pending &&
                    this.subscriptionState !== SubscriptionState.Active) {
                    invalidStateTransition();
                    return;
                }
                break;
            default:
                invalidStateTransition();
                return;
        }
        // If the "Subscription-State" value is "pending", the subscription has
        // been received by the notifier, but there is insufficient policy
        // information to grant or deny the subscription yet.  If the header
        // field also contains an "expires" parameter, the subscriber SHOULD
        // take it as the authoritative subscription duration and adjust
        // accordingly.  No further action is necessary on the part of the
        // subscriber.  The "retry-after" and "reason" parameters have no
        // semantics for "pending".
        // https://tools.ietf.org/html/rfc6665#section-4.1.3
        if (newState === SubscriptionState.Pending) {
            if (newExpires) {
                this.subscriptionExpires = newExpires;
            }
        }
        // If the "Subscription-State" header field value is "active", it means
        // that the subscription has been accepted and (in general) has been
        // authorized.  If the header field also contains an "expires"
        // parameter, the subscriber SHOULD take it as the authoritative
        // subscription duration and adjust accordingly.  The "retry-after" and
        // "reason" parameters have no semantics for "active".
        // https://tools.ietf.org/html/rfc6665#section-4.1.3
        if (newState === SubscriptionState.Active) {
            if (newExpires) {
                this.subscriptionExpires = newExpires;
            }
        }
        // If the "Subscription-State" value is "terminated", the subscriber
        // MUST consider the subscription terminated.  The "expires" parameter
        // has no semantics for "terminated" -- notifiers SHOULD NOT include an
        // "expires" parameter on a "Subscription-State" header field with a
        // value of "terminated", and subscribers MUST ignore any such
        // parameter, if present.
        if (newState === SubscriptionState.Terminated) {
            this.dispose();
        }
        this._subscriptionState = newState;
    }
    /**
     * When refreshing a subscription, a subscriber starts Timer N, set to
     * 64*T1, when it sends the SUBSCRIBE request.  If this Timer N expires
     * prior to the receipt of a NOTIFY request, the subscriber considers
     * the subscription terminated.  If the subscriber receives a success
     * response to the SUBSCRIBE request that indicates that no NOTIFY
     * request will be generated -- such as the 204 response defined for use
     * with the optional extension described in [RFC5839] -- then it MUST
     * cancel Timer N.
     * https://tools.ietf.org/html/rfc6665#section-4.1.2.2
     */
    timerN() {
        this.logger.warn(`Timer N expired for SUBSCRIBE dialog. Timed out waiting for NOTIFY.`);
        if (this.subscriptionState !== SubscriptionState.Terminated) {
            this.stateTransition(SubscriptionState.Terminated);
            this.onTerminated();
        }
    }
}

/**
 * SUBSCRIBE UAC.
 * @remarks
 * 4.1.  Subscriber Behavior
 * https://tools.ietf.org/html/rfc6665#section-4.1
 *
 * User agent client for installation of a single subscription per SUBSCRIBE request.
 * TODO: Support for installation of multiple subscriptions on forked SUBSCRIBE requests.
 * @public
 */
class SubscribeUserAgentClient extends UserAgentClient {
    constructor(core, message, delegate) {
        // Get event from request message.
        const event = message.getHeader("Event");
        if (!event) {
            throw new Error("Event undefined");
        }
        // Get expires from request message.
        const expires = message.getHeader("Expires");
        if (!expires) {
            throw new Error("Expires undefined");
        }
        super(NonInviteClientTransaction, core, message, delegate);
        this.delegate = delegate;
        // FIXME: Subscriber id should also be matching on event id.
        this.subscriberId = message.callId + message.fromTag + event;
        this.subscriptionExpiresRequested = this.subscriptionExpires = Number(expires);
        this.subscriptionEvent = event;
        this.subscriptionState = SubscriptionState.NotifyWait;
        // Start waiting for a NOTIFY we can use to create a subscription.
        this.waitNotifyStart();
    }
    /**
     * Destructor.
     * Note that Timer N may live on waiting for an initial NOTIFY and
     * the delegate may still receive that NOTIFY. If you don't want
     * that behavior then either clear the delegate so the delegate
     * doesn't get called (a 200 will be sent in response to the NOTIFY)
     * or call `waitNotifyStop` which will clear Timer N and remove this
     * UAC from the core (a 481 will be sent in response to the NOTIFY).
     */
    dispose() {
        super.dispose();
    }
    /**
     * Handle out of dialog NOTIFY associated with SUBSCRIBE request.
     * This is the first NOTIFY received after the SUBSCRIBE request.
     * @param uas - User agent server handling the subscription creating NOTIFY.
     */
    onNotify(uas) {
        // NOTIFY requests are matched to such SUBSCRIBE requests if they
        // contain the same "Call-ID", a "To" header field "tag" parameter that
        // matches the "From" header field "tag" parameter of the SUBSCRIBE
        // request, and the same "Event" header field.  Rules for comparisons of
        // the "Event" header fields are described in Section 8.2.1.
        // https://tools.ietf.org/html/rfc6665#section-4.4.1
        const event = uas.message.parseHeader("Event").event;
        if (!event || event !== this.subscriptionEvent) {
            this.logger.warn(`Failed to parse event.`);
            uas.reject({ statusCode: 489 });
            return;
        }
        // NOTIFY requests MUST contain "Subscription-State" header fields that
        // indicate the status of the subscription.
        // https://tools.ietf.org/html/rfc6665#section-4.1.3
        const subscriptionState = uas.message.parseHeader("Subscription-State");
        if (!subscriptionState || !subscriptionState.state) {
            this.logger.warn("Failed to parse subscription state.");
            uas.reject({ statusCode: 489 });
            return;
        }
        // Validate subscription state.
        const state = subscriptionState.state;
        switch (state) {
            case "pending":
                break;
            case "active":
                break;
            case "terminated":
                break;
            default:
                this.logger.warn(`Invalid subscription state ${state}`);
                uas.reject({ statusCode: 489 });
                return;
        }
        // Dialogs usages are created upon completion of a NOTIFY transaction
        // for a new subscription, unless the NOTIFY request contains a
        // "Subscription-State" of "terminated."
        // https://tools.ietf.org/html/rfc6665#section-4.4.1
        if (state !== "terminated") {
            // The Contact header field MUST be present and contain exactly one SIP
            // or SIPS URI in any request that can result in the establishment of a
            // dialog.
            // https://tools.ietf.org/html/rfc3261#section-8.1.1.8
            const contact = uas.message.parseHeader("contact");
            if (!contact) {
                this.logger.warn("Failed to parse contact.");
                uas.reject({ statusCode: 489 });
                return;
            }
        }
        // In accordance with the rules for proxying non-INVITE requests as
        // defined in [RFC3261], successful SUBSCRIBE requests will receive only
        // one 200-class response; however, due to forking, the subscription may
        // have been accepted by multiple nodes.  The subscriber MUST therefore
        // be prepared to receive NOTIFY requests with "From:" tags that differ
        // from the "To:" tag received in the SUBSCRIBE 200-class response.
        //
        // If multiple NOTIFY requests are received in different dialogs in
        // response to a single SUBSCRIBE request, each dialog represents a
        // different destination to which the SUBSCRIBE request was forked.
        // Subscriber handling in such situations varies by event package; see
        // Section 5.4.9 for details.
        // https://tools.ietf.org/html/rfc6665#section-4.1.4
        // Each event package MUST specify whether forked SUBSCRIBE requests are
        // allowed to install multiple subscriptions.
        //
        // If such behavior is not allowed, the first potential dialog-
        // establishing message will create a dialog.  All subsequent NOTIFY
        // requests that correspond to the SUBSCRIBE request (i.e., have
        // matching "To", "From", "Call-ID", and "Event" header fields, as well
        // as "From" header field "tag" parameter and "Event" header field "id"
        // parameter) but that do not match the dialog would be rejected with a
        // 481 response.  Note that the 200-class response to the SUBSCRIBE
        // request can arrive after a matching NOTIFY request has been received;
        // such responses might not correlate to the same dialog established by
        // the NOTIFY request.  Except as required to complete the SUBSCRIBE
        // transaction, such non-matching 200-class responses are ignored.
        //
        // If installing of multiple subscriptions by way of a single forked
        // SUBSCRIBE request is allowed, the subscriber establishes a new dialog
        // towards each notifier by returning a 200-class response to each
        // NOTIFY request.  Each dialog is then handled as its own entity and is
        // refreshed independently of the other dialogs.
        //
        // In the case that multiple subscriptions are allowed, the event
        // package MUST specify whether merging of the notifications to form a
        // single state is required, and how such merging is to be performed.
        // Note that it is possible that some event packages may be defined in
        // such a way that each dialog is tied to a mutually exclusive state
        // that is unaffected by the other dialogs; this MUST be clearly stated
        // if it is the case.
        // https://tools.ietf.org/html/rfc6665#section-5.4.9
        // *** NOTE: This implementation is only for event packages which
        // do not allow forked requests to install multiple subscriptions.
        // As such and in accordance with the specification, we stop waiting
        // and any future NOTIFY requests will be rejected with a 481.
        if (this.dialog) {
            throw new Error("Dialog already created. This implementation only supports install of single subscriptions.");
        }
        this.waitNotifyStop();
        // Update expires.
        this.subscriptionExpires = subscriptionState.expires
            ? Math.min(this.subscriptionExpires, Math.max(subscriptionState.expires, 0))
            : this.subscriptionExpires;
        // Update subscription state.
        switch (state) {
            case "pending":
                this.subscriptionState = SubscriptionState.Pending;
                break;
            case "active":
                this.subscriptionState = SubscriptionState.Active;
                break;
            case "terminated":
                this.subscriptionState = SubscriptionState.Terminated;
                break;
            default:
                throw new Error(`Unrecognized state ${state}.`);
        }
        // Dialogs usages are created upon completion of a NOTIFY transaction
        // for a new subscription, unless the NOTIFY request contains a
        // "Subscription-State" of "terminated."
        // https://tools.ietf.org/html/rfc6665#section-4.4.1
        if (this.subscriptionState !== SubscriptionState.Terminated) {
            // Because the dialog usage is established by the NOTIFY request, the
            // route set at the subscriber is taken from the NOTIFY request itself,
            // as opposed to the route set present in the 200-class response to the
            // SUBSCRIBE request.
            // https://tools.ietf.org/html/rfc6665#section-4.4.1
            const dialogState = SubscriptionDialog.initialDialogStateForSubscription(this.message, uas.message);
            // Subscription Initiated! :)
            this.dialog = new SubscriptionDialog(this.subscriptionEvent, this.subscriptionExpires, this.subscriptionState, this.core, dialogState);
        }
        // Delegate.
        if (this.delegate && this.delegate.onNotify) {
            const request = uas;
            const subscription = this.dialog;
            this.delegate.onNotify({ request, subscription });
        }
        else {
            uas.accept();
        }
    }
    waitNotifyStart() {
        if (!this.N) {
            // Add ourselves to the core's subscriber map.
            // This allows the core to route out of dialog NOTIFY messages to us.
            this.core.subscribers.set(this.subscriberId, this);
            this.N = setTimeout(() => this.timerN(), Timers.TIMER_N);
        }
    }
    waitNotifyStop() {
        if (this.N) {
            // Remove ourselves to the core's subscriber map.
            // Any future out of dialog NOTIFY messages will be rejected with a 481.
            this.core.subscribers.delete(this.subscriberId);
            clearTimeout(this.N);
            this.N = undefined;
        }
    }
    /**
     * Receive a response from the transaction layer.
     * @param message - Incoming response message.
     */
    receiveResponse(message) {
        if (!this.authenticationGuard(message)) {
            return;
        }
        if (message.statusCode && message.statusCode >= 200 && message.statusCode < 300) {
            //  The "Expires" header field in a 200-class response to SUBSCRIBE
            //  request indicates the actual duration for which the subscription will
            //  remain active (unless refreshed).  The received value might be
            //  smaller than the value indicated in the SUBSCRIBE request but cannot
            //  be larger; see Section 4.2.1 for details.
            // https://tools.ietf.org/html/rfc6665#section-4.1.2.1
            // The "Expires" values present in SUBSCRIBE 200-class responses behave
            // in the same way as they do in REGISTER responses: the server MAY
            // shorten the interval but MUST NOT lengthen it.
            //
            //    If the duration specified in a SUBSCRIBE request is unacceptably
            //    short, the notifier may be able to send a 423 response, as
            //    described earlier in this section.
            //
            // 200-class responses to SUBSCRIBE requests will not generally contain
            // any useful information beyond subscription duration; their primary
            // purpose is to serve as a reliability mechanism.  State information
            // will be communicated via a subsequent NOTIFY request from the
            // notifier.
            // https://tools.ietf.org/html/rfc6665#section-4.2.1.1
            const expires = message.getHeader("Expires");
            if (!expires) {
                this.logger.warn("Expires header missing in a 200-class response to SUBSCRIBE");
            }
            else {
                const subscriptionExpiresReceived = Number(expires);
                if (subscriptionExpiresReceived > this.subscriptionExpiresRequested) {
                    this.logger.warn("Expires header in a 200-class response to SUBSCRIBE with a higher value than the one in the request");
                }
                if (subscriptionExpiresReceived < this.subscriptionExpires) {
                    this.subscriptionExpires = subscriptionExpiresReceived;
                }
            }
            // If a NOTIFY arrived before 200-class response a dialog may have been created.
            // Updated the dialogs expiration only if this indicates earlier expiration.
            if (this.dialog) {
                if (this.dialog.subscriptionExpires > this.subscriptionExpires) {
                    this.dialog.subscriptionExpires = this.subscriptionExpires;
                }
            }
        }
        if (message.statusCode && message.statusCode >= 300 && message.statusCode < 700) {
            this.waitNotifyStop(); // No NOTIFY will be sent after a negative final response.
        }
        super.receiveResponse(message);
    }
    /**
     * To ensure that subscribers do not wait indefinitely for a
     * subscription to be established, a subscriber starts a Timer N, set to
     * 64*T1, when it sends a SUBSCRIBE request.  If this Timer N expires
     * prior to the receipt of a NOTIFY request, the subscriber considers
     * the subscription failed, and cleans up any state associated with the
     * subscription attempt.
     * https://tools.ietf.org/html/rfc6665#section-4.1.2.4
     */
    timerN() {
        this.logger.warn(`Timer N expired for SUBSCRIBE user agent client. Timed out waiting for NOTIFY.`);
        this.waitNotifyStop();
        if (this.delegate && this.delegate.onNotifyTimeout) {
            this.delegate.onNotifyTimeout();
        }
    }
}

/**
 * SUBSCRIBE UAS.
 * @public
 */
class SubscribeUserAgentServer extends UserAgentServer {
    constructor(core, message, delegate) {
        super(NonInviteServerTransaction, core, message, delegate);
        this.core = core;
    }
}

/**
 * This is ported from UA.C.ACCEPTED_BODY_TYPES.
 * FIXME: TODO: Should be configurable/variable.
 */
const acceptedBodyTypes = ["application/sdp", "application/dtmf-relay"];
/**
 * User Agent Core.
 * @remarks
 * Core designates the functions specific to a particular type
 * of SIP entity, i.e., specific to either a stateful or stateless
 * proxy, a user agent or registrar.  All cores, except those for
 * the stateless proxy, are transaction users.
 * https://tools.ietf.org/html/rfc3261#section-6
 *
 * UAC Core: The set of processing functions required of a UAC that
 * reside above the transaction and transport layers.
 * https://tools.ietf.org/html/rfc3261#section-6
 *
 * UAS Core: The set of processing functions required at a UAS that
 * resides above the transaction and transport layers.
 * https://tools.ietf.org/html/rfc3261#section-6
 * @public
 */
class UserAgentCore {
    /**
     * Constructor.
     * @param configuration - Configuration.
     * @param delegate - Delegate.
     */
    constructor(configuration, delegate = {}) {
        /** UACs. */
        this.userAgentClients = new Map();
        /** UASs. */
        this.userAgentServers = new Map();
        this.configuration = configuration;
        this.delegate = delegate;
        this.dialogs = new Map();
        this.subscribers = new Map();
        this.logger = configuration.loggerFactory.getLogger("sip.user-agent-core");
    }
    /** Destructor. */
    dispose() {
        this.reset();
    }
    /** Reset. */
    reset() {
        this.dialogs.forEach((dialog) => dialog.dispose());
        this.dialogs.clear();
        this.subscribers.forEach((subscriber) => subscriber.dispose());
        this.subscribers.clear();
        this.userAgentClients.forEach((uac) => uac.dispose());
        this.userAgentClients.clear();
        this.userAgentServers.forEach((uac) => uac.dispose());
        this.userAgentServers.clear();
    }
    /** Logger factory. */
    get loggerFactory() {
        return this.configuration.loggerFactory;
    }
    /** Transport. */
    get transport() {
        const transport = this.configuration.transportAccessor();
        if (!transport) {
            throw new Error("Transport undefined.");
        }
        return transport;
    }
    /**
     * Send INVITE.
     * @param request - Outgoing request.
     * @param delegate - Request delegate.
     */
    invite(request, delegate) {
        return new InviteUserAgentClient(this, request, delegate);
    }
    /**
     * Send MESSAGE.
     * @param request - Outgoing request.
     * @param delegate - Request delegate.
     */
    message(request, delegate) {
        return new MessageUserAgentClient(this, request, delegate);
    }
    /**
     * Send PUBLISH.
     * @param request - Outgoing request.
     * @param delegate - Request delegate.
     */
    publish(request, delegate) {
        return new PublishUserAgentClient(this, request, delegate);
    }
    /**
     * Send REGISTER.
     * @param request - Outgoing request.
     * @param delegate - Request delegate.
     */
    register(request, delegate) {
        return new RegisterUserAgentClient(this, request, delegate);
    }
    /**
     * Send SUBSCRIBE.
     * @param request - Outgoing request.
     * @param delegate - Request delegate.
     */
    subscribe(request, delegate) {
        return new SubscribeUserAgentClient(this, request, delegate);
    }
    /**
     * Send a request.
     * @param request - Outgoing request.
     * @param delegate - Request delegate.
     */
    request(request, delegate) {
        return new UserAgentClient(NonInviteClientTransaction, this, request, delegate);
    }
    /**
     * Outgoing request message factory function.
     * @param method - Method.
     * @param requestURI - Request-URI.
     * @param fromURI - From URI.
     * @param toURI - To URI.
     * @param options - Request options.
     * @param extraHeaders - Extra headers to add.
     * @param body - Message body.
     */
    makeOutgoingRequestMessage(method, requestURI, fromURI, toURI, options, extraHeaders, body) {
        // default values from user agent configuration
        const callIdPrefix = this.configuration.sipjsId;
        const fromDisplayName = this.configuration.displayName;
        const forceRport = this.configuration.viaForceRport;
        const hackViaTcp = this.configuration.hackViaTcp;
        const optionTags = this.configuration.supportedOptionTags.slice();
        if (method === C.REGISTER) {
            optionTags.push("path", "gruu");
        }
        if (method === C.INVITE && (this.configuration.contact.pubGruu || this.configuration.contact.tempGruu)) {
            optionTags.push("gruu");
        }
        const routeSet = this.configuration.routeSet;
        const userAgentString = this.configuration.userAgentHeaderFieldValue;
        const viaHost = this.configuration.viaHost;
        const defaultOptions = {
            callIdPrefix,
            forceRport,
            fromDisplayName,
            hackViaTcp,
            optionTags,
            routeSet,
            userAgentString,
            viaHost
        };
        // merge provided options with default options
        const requestOptions = Object.assign(Object.assign({}, defaultOptions), options);
        return new OutgoingRequestMessage(method, requestURI, fromURI, toURI, requestOptions, extraHeaders, body);
    }
    /**
     * Handle an incoming request message from the transport.
     * @param message - Incoming request message from transport layer.
     */
    receiveIncomingRequestFromTransport(message) {
        this.receiveRequestFromTransport(message);
    }
    /**
     * Handle an incoming response message from the transport.
     * @param message - Incoming response message from transport layer.
     */
    receiveIncomingResponseFromTransport(message) {
        this.receiveResponseFromTransport(message);
    }
    /**
     * A stateless UAS is a UAS that does not maintain transaction state.
     * It replies to requests normally, but discards any state that would
     * ordinarily be retained by a UAS after a response has been sent.  If a
     * stateless UAS receives a retransmission of a request, it regenerates
     * the response and re-sends it, just as if it were replying to the first
     * instance of the request. A UAS cannot be stateless unless the request
     * processing for that method would always result in the same response
     * if the requests are identical. This rules out stateless registrars,
     * for example.  Stateless UASs do not use a transaction layer; they
     * receive requests directly from the transport layer and send responses
     * directly to the transport layer.
     * https://tools.ietf.org/html/rfc3261#section-8.2.7
     * @param message - Incoming request message to reply to.
     * @param statusCode - Status code to reply with.
     */
    replyStateless(message, options) {
        const userAgent = this.configuration.userAgentHeaderFieldValue;
        const supported = this.configuration.supportedOptionTagsResponse;
        options = Object.assign(Object.assign({}, options), { userAgent, supported });
        const response = constructOutgoingResponse(message, options);
        this.transport.send(response.message).catch((error) => {
            // If the transport rejects, it SHOULD reject with a TransportError.
            // But the transport may be external code, so we are careful...
            if (error instanceof Error) {
                this.logger.error(error.message);
            }
            this.logger.error(`Transport error occurred sending stateless reply to ${message.method} request.`);
            // TODO: Currently there is no hook to provide notification that a transport error occurred
            // and throwing would result in an uncaught error (in promise), so we silently eat the error.
            // Furthermore, silently eating stateless reply transport errors is arguably what we want to do here.
        });
        return response;
    }
    /**
     * In Section 18.2.1, replace the last paragraph with:
     *
     * Next, the server transport attempts to match the request to a
     * server transaction.  It does so using the matching rules described
     * in Section 17.2.3.  If a matching server transaction is found, the
     * request is passed to that transaction for processing.  If no match
     * is found, the request is passed to the core, which may decide to
     * construct a new server transaction for that request.
     * https://tools.ietf.org/html/rfc6026#section-8.10
     * @param message - Incoming request message from transport layer.
     */
    receiveRequestFromTransport(message) {
        // When a request is received from the network by the server, it has to
        // be matched to an existing transaction.  This is accomplished in the
        // following manner.
        //
        // The branch parameter in the topmost Via header field of the request
        // is examined.  If it is present and begins with the magic cookie
        // "z9hG4bK", the request was generated by a client transaction
        // compliant to this specification.  Therefore, the branch parameter
        // will be unique across all transactions sent by that client.  The
        // request matches a transaction if:
        //
        //    1. the branch parameter in the request is equal to the one in the
        //       top Via header field of the request that created the
        //       transaction, and
        //
        //    2. the sent-by value in the top Via of the request is equal to the
        //       one in the request that created the transaction, and
        //
        //    3. the method of the request matches the one that created the
        //       transaction, except for ACK, where the method of the request
        //       that created the transaction is INVITE.
        //
        // This matching rule applies to both INVITE and non-INVITE transactions
        // alike.
        //
        //    The sent-by value is used as part of the matching process because
        //    there could be accidental or malicious duplication of branch
        //    parameters from different clients.
        // https://tools.ietf.org/html/rfc3261#section-17.2.3
        const transactionId = message.viaBranch; // FIXME: Currently only using rule 1...
        const uas = this.userAgentServers.get(transactionId);
        // When receiving an ACK that matches an existing INVITE server
        // transaction and that does not contain a branch parameter containing
        // the magic cookie defined in RFC 3261, the matching transaction MUST
        // be checked to see if it is in the "Accepted" state.  If it is, then
        // the ACK must be passed directly to the transaction user instead of
        // being absorbed by the transaction state machine.  This is necessary
        // as requests from RFC 2543 clients will not include a unique branch
        // parameter, and the mechanisms for calculating the transaction ID from
        // such a request will be the same for both INVITE and ACKs.
        // https://tools.ietf.org/html/rfc6026#section-6
        // Any ACKs received from the network while in the "Accepted" state MUST be
        // passed directly to the TU and not absorbed.
        // https://tools.ietf.org/html/rfc6026#section-7.1
        if (message.method === C.ACK) {
            if (uas && uas.transaction.state === TransactionState.Accepted) {
                if (uas instanceof InviteUserAgentServer) {
                    // These are ACKs matching an INVITE server transaction.
                    // These should never happen with RFC 3261 compliant user agents
                    // (would be a broken ACK to negative final response or something)
                    // but is apparently how RFC 2543 user agents do things.
                    // We are not currently supporting this case.
                    // NOTE: Not backwards compatible with RFC 2543 (no support for strict-routing).
                    this.logger.warn(`Discarding out of dialog ACK after 2xx response sent on transaction ${transactionId}.`);
                    return;
                }
            }
        }
        // The CANCEL method requests that the TU at the server side cancel a
        // pending transaction.  The TU determines the transaction to be
        // cancelled by taking the CANCEL request, and then assuming that the
        // request method is anything but CANCEL or ACK and applying the
        // transaction matching procedures of Section 17.2.3.  The matching
        // transaction is the one to be cancelled.
        // https://tools.ietf.org/html/rfc3261#section-9.2
        if (message.method === C.CANCEL) {
            if (uas) {
                // Regardless of the method of the original request, as long as the
                // CANCEL matched an existing transaction, the UAS answers the CANCEL
                // request itself with a 200 (OK) response.
                // https://tools.ietf.org/html/rfc3261#section-9.2
                this.replyStateless(message, { statusCode: 200 });
                // If the transaction for the original request still exists, the behavior
                // of the UAS on receiving a CANCEL request depends on whether it has already
                // sent a final response for the original request. If it has, the CANCEL
                // request has no effect on the processing of the original request, no
                // effect on any session state, and no effect on the responses generated
                // for the original request. If the UAS has not issued a final response
                // for the original request, its behavior depends on the method of the
                // original request. If the original request was an INVITE, the UAS
                // SHOULD immediately respond to the INVITE with a 487 (Request
                // Terminated).
                // https://tools.ietf.org/html/rfc3261#section-9.2
                if (uas.transaction instanceof InviteServerTransaction &&
                    uas.transaction.state === TransactionState.Proceeding) {
                    if (uas instanceof InviteUserAgentServer) {
                        uas.receiveCancel(message);
                    }
                    // A CANCEL request has no impact on the processing of
                    // transactions with any other method defined in this specification.
                    // https://tools.ietf.org/html/rfc3261#section-9.2
                }
            }
            else {
                // If the UAS did not find a matching transaction for the CANCEL
                // according to the procedure above, it SHOULD respond to the CANCEL
                // with a 481 (Call Leg/Transaction Does Not Exist).
                // https://tools.ietf.org/html/rfc3261#section-9.2
                this.replyStateless(message, { statusCode: 481 });
            }
            return;
        }
        // If a matching server transaction is found, the request is passed to that
        // transaction for processing.
        // https://tools.ietf.org/html/rfc6026#section-8.10
        if (uas) {
            uas.transaction.receiveRequest(message);
            return;
        }
        // If no match is found, the request is passed to the core, which may decide to
        // construct a new server transaction for that request.
        // https://tools.ietf.org/html/rfc6026#section-8.10
        this.receiveRequest(message);
        return;
    }
    /**
     * UAC and UAS procedures depend strongly on two factors.  First, based
     * on whether the request or response is inside or outside of a dialog,
     * and second, based on the method of a request.  Dialogs are discussed
     * thoroughly in Section 12; they represent a peer-to-peer relationship
     * between user agents and are established by specific SIP methods, such
     * as INVITE.
     * @param message - Incoming request message.
     */
    receiveRequest(message) {
        // 8.2 UAS Behavior
        // UASs SHOULD process the requests in the order of the steps that
        // follow in this section (that is, starting with authentication, then
        // inspecting the method, the header fields, and so on throughout the
        // remainder of this section).
        // https://tools.ietf.org/html/rfc3261#section-8.2
        // 8.2.1 Method Inspection
        // Once a request is authenticated (or authentication is skipped), the
        // UAS MUST inspect the method of the request.  If the UAS recognizes
        // but does not support the method of a request, it MUST generate a 405
        // (Method Not Allowed) response.  Procedures for generating responses
        // are described in Section 8.2.6.  The UAS MUST also add an Allow
        // header field to the 405 (Method Not Allowed) response.  The Allow
        // header field MUST list the set of methods supported by the UAS
        // generating the message.
        // https://tools.ietf.org/html/rfc3261#section-8.2.1
        if (!AllowedMethods.includes(message.method)) {
            const allowHeader = "Allow: " + AllowedMethods.toString();
            this.replyStateless(message, {
                statusCode: 405,
                extraHeaders: [allowHeader]
            });
            return;
        }
        // 8.2.2 Header Inspection
        // https://tools.ietf.org/html/rfc3261#section-8.2.2
        if (!message.ruri) {
            // FIXME: A request message should always have an ruri
            throw new Error("Request-URI undefined.");
        }
        // 8.2.2.1 To and Request-URI
        // If the Request-URI uses a scheme not supported by the UAS, it SHOULD
        // reject the request with a 416 (Unsupported URI Scheme) response.
        // https://tools.ietf.org/html/rfc3261#section-8.2.2.1
        if (message.ruri.scheme !== "sip") {
            this.replyStateless(message, { statusCode: 416 });
            return;
        }
        // 8.2.2.1 To and Request-URI
        // If the Request-URI does not identify an address that the
        // UAS is willing to accept requests for, it SHOULD reject
        // the request with a 404 (Not Found) response.
        // https://tools.ietf.org/html/rfc3261#section-8.2.2.1
        const ruri = message.ruri;
        const ruriMatches = (uri) => {
            return !!uri && uri.user === ruri.user;
        };
        if (!ruriMatches(this.configuration.aor) &&
            !(ruriMatches(this.configuration.contact.uri) ||
                ruriMatches(this.configuration.contact.pubGruu) ||
                ruriMatches(this.configuration.contact.tempGruu))) {
            this.logger.warn("Request-URI does not point to us.");
            if (message.method !== C.ACK) {
                this.replyStateless(message, { statusCode: 404 });
            }
            return;
        }
        // 8.2.2.1 To and Request-URI
        // Other potential sources of received Request-URIs include
        // the Contact header fields of requests and responses sent by the UA
        // that establish or refresh dialogs.
        // https://tools.ietf.org/html/rfc3261#section-8.2.2.1
        if (message.method === C.INVITE) {
            if (!message.hasHeader("Contact")) {
                this.replyStateless(message, {
                    statusCode: 400,
                    reasonPhrase: "Missing Contact Header"
                });
                return;
            }
        }
        // 8.2.2.2 Merged Requests
        // If the request has no tag in the To header field, the UAS core MUST
        // check the request against ongoing transactions.  If the From tag,
        // Call-ID, and CSeq exactly match those associated with an ongoing
        // transaction, but the request does not match that transaction (based
        // on the matching rules in Section 17.2.3), the UAS core SHOULD
        // generate a 482 (Loop Detected) response and pass it to the server
        // transaction.
        //
        //    The same request has arrived at the UAS more than once, following
        //    different paths, most likely due to forking.  The UAS processes
        //    the first such request received and responds with a 482 (Loop
        //    Detected) to the rest of them.
        // https://tools.ietf.org/html/rfc3261#section-8.2.2.2
        if (!message.toTag) {
            const transactionId = message.viaBranch;
            if (!this.userAgentServers.has(transactionId)) {
                const mergedRequest = Array.from(this.userAgentServers.values()).some((uas) => uas.transaction.request.fromTag === message.fromTag &&
                    uas.transaction.request.callId === message.callId &&
                    uas.transaction.request.cseq === message.cseq);
                if (mergedRequest) {
                    this.replyStateless(message, { statusCode: 482 });
                    return;
                }
            }
        }
        // 8.2.2.3 Require
        // https://tools.ietf.org/html/rfc3261#section-8.2.2.3
        // TODO
        // 8.2.3 Content Processing
        // https://tools.ietf.org/html/rfc3261#section-8.2.3
        // TODO
        // 8.2.4 Applying Extensions
        // https://tools.ietf.org/html/rfc3261#section-8.2.4
        // TODO
        // 8.2.5 Processing the Request
        // Assuming all of the checks in the previous subsections are passed,
        // the UAS processing becomes method-specific.
        // https://tools.ietf.org/html/rfc3261#section-8.2.5
        // The UAS will receive the request from the transaction layer.  If the
        // request has a tag in the To header field, the UAS core computes the
        // dialog identifier corresponding to the request and compares it with
        // existing dialogs.  If there is a match, this is a mid-dialog request.
        // In that case, the UAS first applies the same processing rules for
        // requests outside of a dialog, discussed in Section 8.2.
        // https://tools.ietf.org/html/rfc3261#section-12.2.2
        if (message.toTag) {
            this.receiveInsideDialogRequest(message);
        }
        else {
            this.receiveOutsideDialogRequest(message);
        }
        return;
    }
    /**
     * Once a dialog has been established between two UAs, either of them
     * MAY initiate new transactions as needed within the dialog.  The UA
     * sending the request will take the UAC role for the transaction.  The
     * UA receiving the request will take the UAS role.  Note that these may
     * be different roles than the UAs held during the transaction that
     * established the dialog.
     * https://tools.ietf.org/html/rfc3261#section-12.2
     * @param message - Incoming request message.
     */
    receiveInsideDialogRequest(message) {
        // NOTIFY requests are matched to such SUBSCRIBE requests if they
        // contain the same "Call-ID", a "To" header field "tag" parameter that
        // matches the "From" header field "tag" parameter of the SUBSCRIBE
        // request, and the same "Event" header field.  Rules for comparisons of
        // the "Event" header fields are described in Section 8.2.1.
        // https://tools.ietf.org/html/rfc6665#section-4.4.1
        if (message.method === C.NOTIFY) {
            const event = message.parseHeader("Event");
            if (!event || !event.event) {
                this.replyStateless(message, { statusCode: 489 });
                return;
            }
            // FIXME: Subscriber id should also matching on event id.
            const subscriberId = message.callId + message.toTag + event.event;
            const subscriber = this.subscribers.get(subscriberId);
            if (subscriber) {
                const uas = new NotifyUserAgentServer(this, message);
                subscriber.onNotify(uas);
                return;
            }
        }
        // Requests sent within a dialog, as any other requests, are atomic.  If
        // a particular request is accepted by the UAS, all the state changes
        // associated with it are performed.  If the request is rejected, none
        // of the state changes are performed.
        //
        //    Note that some requests, such as INVITEs, affect several pieces of
        //    state.
        //
        // The UAS will receive the request from the transaction layer.  If the
        // request has a tag in the To header field, the UAS core computes the
        // dialog identifier corresponding to the request and compares it with
        // existing dialogs.  If there is a match, this is a mid-dialog request.
        // https://tools.ietf.org/html/rfc3261#section-12.2.2
        const dialogId = message.callId + message.toTag + message.fromTag;
        const dialog = this.dialogs.get(dialogId);
        if (dialog) {
            // [Sip-implementors] Reg. SIP reinvite, UPDATE and OPTIONS
            // You got the question right.
            //
            // And you got the right answer too. :-)
            //
            //   Thanks,
            //   Paul
            //
            // Robert Sparks wrote:
            // > So I've lost track of the question during the musing.
            // >
            // > I _think_ the fundamental question being asked is this:
            // >
            // > Is an endpoint required to reject (with a 481) an OPTIONS request that
            // > arrives with at to-tag but does not match any existing dialog state.
            // > (Assuming some earlier requirement hasn't forced another error code). Or
            // > is it OK if it just sends
            // > a 200 OK anyhow.
            // >
            // > My take on the collection of specs is that its _not_ ok for it to send
            // > the 200 OK anyhow and that it is required to send
            // > the 481. I base this primarily on these sentences from 11.2 in 3261:
            // >
            // >    The response to an OPTIONS is constructed using the standard rules
            // >    for a SIP response as discussed in Section 8.2.6.  The response code
            // >    chosen MUST be the same that would have been chosen had the request
            // >    been an INVITE.
            // >
            // > Did I miss the point of the question?
            // >
            // > On May 15, 2008, at 12:48 PM, Paul Kyzivat wrote:
            // >
            // >> [Including Robert in hopes of getting his insight on this.]
            // https://lists.cs.columbia.edu/pipermail/sip-implementors/2008-May/019178.html
            //
            // Requests that do not change in any way the state of a dialog may be
            // received within a dialog (for example, an OPTIONS request).  They are
            // processed as if they had been received outside the dialog.
            // https://tools.ietf.org/html/rfc3261#section-12.2.2
            if (message.method === C.OPTIONS) {
                const allowHeader = "Allow: " + AllowedMethods.toString();
                const acceptHeader = "Accept: " + acceptedBodyTypes.toString();
                this.replyStateless(message, {
                    statusCode: 200,
                    extraHeaders: [allowHeader, acceptHeader]
                });
                return;
            }
            // Pass the incoming request to the dialog for further handling.
            dialog.receiveRequest(message);
            return;
        }
        // The most important behaviors of a stateless UAS are the following:
        // ...
        // o  A stateless UAS MUST ignore ACK requests.
        // ...
        // https://tools.ietf.org/html/rfc3261#section-8.2.7
        if (message.method === C.ACK) {
            // If a final response to an INVITE was sent statelessly,
            // the corresponding ACK:
            // - will not match an existing transaction
            // - may have tag in the To header field
            // - not not match any existing dialogs
            // Absorb unmatched ACKs.
            return;
        }
        // If the request has a tag in the To header field, but the dialog
        // identifier does not match any existing dialogs, the UAS may have
        // crashed and restarted, or it may have received a request for a
        // different (possibly failed) UAS (the UASs can construct the To tags
        // so that a UAS can identify that the tag was for a UAS for which it is
        // providing recovery).  Another possibility is that the incoming
        // request has been simply mis-routed.  Based on the To tag, the UAS MAY
        // either accept or reject the request.  Accepting the request for
        // acceptable To tags provides robustness, so that dialogs can persist
        // even through crashes.  UAs wishing to support this capability must
        // take into consideration some issues such as choosing monotonically
        // increasing CSeq sequence numbers even across reboots, reconstructing
        // the route set, and accepting out-of-range RTP timestamps and sequence
        // numbers.
        //
        // If the UAS wishes to reject the request because it does not wish to
        // recreate the dialog, it MUST respond to the request with a 481
        // (Call/Transaction Does Not Exist) status code and pass that to the
        // server transaction.
        // https://tools.ietf.org/html/rfc3261#section-12.2.2
        this.replyStateless(message, { statusCode: 481 });
        return;
    }
    /**
     * Assuming all of the checks in the previous subsections are passed,
     * the UAS processing becomes method-specific.
     *  https://tools.ietf.org/html/rfc3261#section-8.2.5
     * @param message - Incoming request message.
     */
    receiveOutsideDialogRequest(message) {
        switch (message.method) {
            case C.ACK:
                // Absorb stray out of dialog ACKs
                break;
            case C.BYE:
                // If the BYE does not match an existing dialog, the UAS core SHOULD
                // generate a 481 (Call/Transaction Does Not Exist) response and pass
                // that to the server transaction. This rule means that a BYE sent
                // without tags by a UAC will be rejected.
                // https://tools.ietf.org/html/rfc3261#section-15.1.2
                this.replyStateless(message, { statusCode: 481 });
                break;
            case C.CANCEL:
                throw new Error(`Unexpected out of dialog request method ${message.method}.`);
            case C.INFO:
                // Use of the INFO method does not constitute a separate dialog usage.
                // INFO messages are always part of, and share the fate of, an invite
                // dialog usage [RFC5057].  INFO messages cannot be sent as part of
                // other dialog usages, or outside an existing dialog.
                // https://tools.ietf.org/html/rfc6086#section-1
                this.replyStateless(message, { statusCode: 405 }); // Should never happen
                break;
            case C.INVITE:
                // https://tools.ietf.org/html/rfc3261#section-13.3.1
                {
                    const uas = new InviteUserAgentServer(this, message);
                    this.delegate.onInvite ? this.delegate.onInvite(uas) : uas.reject();
                }
                break;
            case C.MESSAGE:
                // MESSAGE requests are discouraged inside a dialog.  Implementations
                // are restricted from creating a usage for the purpose of carrying a
                // sequence of MESSAGE requests (though some implementations use it that
                // way, against the standard recommendation).
                // https://tools.ietf.org/html/rfc5057#section-5.3
                {
                    const uas = new MessageUserAgentServer(this, message);
                    this.delegate.onMessage ? this.delegate.onMessage(uas) : uas.accept();
                }
                break;
            case C.NOTIFY:
                // Obsoleted by: RFC 6665
                // If any non-SUBSCRIBE mechanisms are defined to create subscriptions,
                // it is the responsibility of the parties defining those mechanisms to
                // ensure that correlation of a NOTIFY message to the corresponding
                // subscription is possible.  Designers of such mechanisms are also
                // warned to make a distinction between sending a NOTIFY message to a
                // subscriber who is aware of the subscription, and sending a NOTIFY
                // message to an unsuspecting node.  The latter behavior is invalid, and
                // MUST receive a "481 Subscription does not exist" response (unless
                // some other 400- or 500-class error code is more applicable), as
                // described in section 3.2.4.  In other words, knowledge of a
                // subscription must exist in both the subscriber and the notifier to be
                // valid, even if installed via a non-SUBSCRIBE mechanism.
                // https://tools.ietf.org/html/rfc3265#section-3.2
                //
                // NOTIFY requests are sent to inform subscribers of changes in state to
                // which the subscriber has a subscription.  Subscriptions are created
                // using the SUBSCRIBE method.  In legacy implementations, it is
                // possible that other means of subscription creation have been used.
                // However, this specification does not allow the creation of
                // subscriptions except through SUBSCRIBE requests and (for backwards-
                // compatibility) REFER requests [RFC3515].
                // https://tools.ietf.org/html/rfc6665#section-3.2
                {
                    const uas = new NotifyUserAgentServer(this, message);
                    this.delegate.onNotify ? this.delegate.onNotify(uas) : uas.reject({ statusCode: 405 });
                }
                break;
            case C.OPTIONS:
                // https://tools.ietf.org/html/rfc3261#section-11.2
                {
                    const allowHeader = "Allow: " + AllowedMethods.toString();
                    const acceptHeader = "Accept: " + acceptedBodyTypes.toString();
                    this.replyStateless(message, {
                        statusCode: 200,
                        extraHeaders: [allowHeader, acceptHeader]
                    });
                }
                break;
            case C.REFER:
                // https://tools.ietf.org/html/rfc3515#section-2.4.2
                {
                    const uas = new ReferUserAgentServer(this, message);
                    this.delegate.onRefer ? this.delegate.onRefer(uas) : uas.reject({ statusCode: 405 });
                }
                break;
            case C.REGISTER:
                // https://tools.ietf.org/html/rfc3261#section-10.3
                {
                    const uas = new RegisterUserAgentServer(this, message);
                    this.delegate.onRegister ? this.delegate.onRegister(uas) : uas.reject({ statusCode: 405 });
                }
                break;
            case C.SUBSCRIBE:
                // https://tools.ietf.org/html/rfc6665#section-4.2
                {
                    const uas = new SubscribeUserAgentServer(this, message);
                    this.delegate.onSubscribe ? this.delegate.onSubscribe(uas) : uas.reject({ statusCode: 480 });
                }
                break;
            default:
                throw new Error(`Unexpected out of dialog request method ${message.method}.`);
        }
        return;
    }
    /**
     * Responses are first processed by the transport layer and then passed
     * up to the transaction layer.  The transaction layer performs its
     * processing and then passes the response up to the TU.  The majority
     * of response processing in the TU is method specific.  However, there
     * are some general behaviors independent of the method.
     * https://tools.ietf.org/html/rfc3261#section-8.1.3
     * @param message - Incoming response message from transport layer.
     */
    receiveResponseFromTransport(message) {
        // 8.1.3.1 Transaction Layer Errors
        // https://tools.ietf.org/html/rfc3261#section-8.1.3.1
        // Handled by transaction layer callbacks.
        // 8.1.3.2 Unrecognized Responses
        // https://tools.ietf.org/html/rfc3261#section-8.1.3.1
        // TODO
        // 8.1.3.3 Vias
        // https://tools.ietf.org/html/rfc3261#section-8.1.3.3
        if (message.getHeaders("via").length > 1) {
            this.logger.warn("More than one Via header field present in the response, dropping");
            return;
        }
        // 8.1.3.4 Processing 3xx Responses
        // https://tools.ietf.org/html/rfc3261#section-8.1.3.4
        // TODO
        // 8.1.3.5 Processing 4xx Responses
        // https://tools.ietf.org/html/rfc3261#section-8.1.3.5
        // TODO
        // When the transport layer in the client receives a response, it has to
        // determine which client transaction will handle the response, so that
        // the processing of Sections 17.1.1 and 17.1.2 can take place.  The
        // branch parameter in the top Via header field is used for this
        // purpose.  A response matches a client transaction under two
        // conditions:
        //
        //    1.  If the response has the same value of the branch parameter in
        //        the top Via header field as the branch parameter in the top
        //        Via header field of the request that created the transaction.
        //
        //    2.  If the method parameter in the CSeq header field matches the
        //        method of the request that created the transaction.  The
        //        method is needed since a CANCEL request constitutes a
        //        different transaction, but shares the same value of the branch
        //        parameter.
        // https://tools.ietf.org/html/rfc3261#section-17.1.3
        const userAgentClientId = message.viaBranch + message.method;
        const userAgentClient = this.userAgentClients.get(userAgentClientId);
        // The client transport uses the matching procedures of Section
        // 17.1.3 to attempt to match the response to an existing
        // transaction.  If there is a match, the response MUST be passed to
        // that transaction.  Otherwise, any element other than a stateless
        // proxy MUST silently discard the response.
        // https://tools.ietf.org/html/rfc6026#section-8.9
        if (userAgentClient) {
            userAgentClient.transaction.receiveResponse(message);
        }
        else {
            this.logger.warn(`Discarding unmatched ${message.statusCode} response to ${message.method} ${userAgentClientId}.`);
        }
    }
}

/**
 * Function which returns a MediaStreamFactory.
 * @public
 */
function defaultMediaStreamFactory() {
    return (constraints) => {
        // if no audio or video, return a media stream without tracks
        if (!constraints.audio && !constraints.video) {
            return Promise.resolve(new MediaStream());
        }
        // getUserMedia() is a powerful feature which can only be used in secure contexts; in insecure contexts,
        // navigator.mediaDevices is undefined, preventing access to getUserMedia(). A secure context is, in short,
        // a page loaded using HTTPS or the file:/// URL scheme, or a page loaded from localhost.
        // https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia#Privacy_and_security
        if (navigator.mediaDevices === undefined) {
            return Promise.reject(new Error("Media devices not available in insecure contexts."));
        }
        return navigator.mediaDevices.getUserMedia.call(navigator.mediaDevices, constraints);
    };
}

/**
 * Function which returns an RTCConfiguration.
 * @public
 */
function defaultPeerConnectionConfiguration() {
    const configuration = {
        bundlePolicy: "balanced",
        certificates: undefined,
        iceCandidatePoolSize: 0,
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        iceTransportPolicy: "all",
        rtcpMuxPolicy: "require"
    };
    return configuration;
}

/**
 * A base class implementing a WebRTC session description handler for sip.js.
 * @remarks
 * It is expected/intended to be extended by specific WebRTC based applications.
 * @privateRemarks
 * So do not put application specific implementation in here.
 * @public
 */
class SessionDescriptionHandler {
    /**
     * Constructor
     * @param logger - A logger
     * @param mediaStreamFactory - A factory to provide a MediaStream
     * @param options - Options passed from the SessionDescriptionHandleFactory
     */
    constructor(logger, mediaStreamFactory, sessionDescriptionHandlerConfiguration) {
        logger.debug("SessionDescriptionHandler.constructor");
        this.logger = logger;
        this.mediaStreamFactory = mediaStreamFactory;
        this.sessionDescriptionHandlerConfiguration = sessionDescriptionHandlerConfiguration;
        this._localMediaStream = new MediaStream();
        this._remoteMediaStream = new MediaStream();
        this._peerConnection = new RTCPeerConnection(sessionDescriptionHandlerConfiguration === null || sessionDescriptionHandlerConfiguration === void 0 ? void 0 : sessionDescriptionHandlerConfiguration.peerConnectionConfiguration);
        this.initPeerConnectionEventHandlers();
    }
    /**
     * The local media stream currently being sent.
     *
     * @remarks
     * The local media stream initially has no tracks, so the presence of tracks
     * should not be assumed. Furthermore, tracks may be added or removed if the
     * local media changes - for example, on upgrade from audio only to a video session.
     * At any given time there will be at most one audio track and one video track
     * (it's possible that this restriction may not apply to sub-classes).
     * Use `MediaStream.onaddtrack` or add a listener for the `addtrack` event
     * to detect when a new track becomes available:
     * https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack
     */
    get localMediaStream() {
        return this._localMediaStream;
    }
    /**
     * The remote media stream currently being received.
     *
     * @remarks
     * The remote media stream initially has no tracks, so the presence of tracks
     * should not be assumed. Furthermore, tracks may be added or removed if the
     * remote media changes - for example, on upgrade from audio only to a video session.
     * At any given time there will be at most one audio track and one video track
     * (it's possible that this restriction may not apply to sub-classes).
     * Use `MediaStream.onaddtrack` or add a listener for the `addtrack` event
     * to detect when a new track becomes available:
     * https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack
     */
    get remoteMediaStream() {
        return this._remoteMediaStream;
    }
    /**
     * The data channel. Undefined before it is created.
     */
    get dataChannel() {
        return this._dataChannel;
    }
    /**
     * The peer connection. Undefined if peer connection has closed.
     *
     * @remarks
     * Use the peerConnectionDelegate to get access to the events associated
     * with the RTCPeerConnection. For example...
     *
     * Do NOT do this...
     * ```ts
     * peerConnection.onicecandidate = (event) => {
     *   // do something
     * };
     * ```
     * Instead, do this...
     * ```ts
     * peerConnection.peerConnectionDelegate = {
     *   onicecandidate: (event) => {
     *     // do something
     *   }
     * };
     * ```
     * While access to the underlying `RTCPeerConnection` is provided, note that
     * using methods which modify it may break the operation of this class.
     * In particular, this class depends on exclusive access to the
     * event handler properties. If you need access to the peer connection
     * events, either register for events using `addEventListener()` on
     * the `RTCPeerConnection` or set the `peerConnectionDelegate` on
     * this `SessionDescriptionHandler`.
     */
    get peerConnection() {
        return this._peerConnection;
    }
    /**
     * A delegate which provides access to the peer connection event handlers.
     *
     * @remarks
     * Use the peerConnectionDelegate to get access to the events associated
     * with the RTCPeerConnection. For example...
     *
     * Do NOT do this...
     * ```ts
     * peerConnection.onicecandidate = (event) => {
     *   // do something
     * };
     * ```
     * Instead, do this...
     * ```
     * peerConnection.peerConnectionDelegate = {
     *   onicecandidate: (event) => {
     *     // do something
     *   }
     * };
     * ```
     * Setting the peer connection event handlers directly is not supported
     * and may break this class. As this class depends on exclusive access
     * to them. This delegate is intended to provide access to the
     * RTCPeerConnection events in a fashion which is supported.
     */
    get peerConnectionDelegate() {
        return this._peerConnectionDelegate;
    }
    set peerConnectionDelegate(delegate) {
        this._peerConnectionDelegate = delegate;
    }
    // The addtrack event does not get fired when JavaScript code explicitly adds tracks to the stream (by calling addTrack()).
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onaddtrack
    static dispatchAddTrackEvent(stream, track) {
        stream.dispatchEvent(new MediaStreamTrackEvent("addtrack", { track }));
    }
    // The removetrack event does not get fired when JavaScript code explicitly removes tracks from the stream (by calling removeTrack()).
    // https://developer.mozilla.org/en-US/docs/Web/API/MediaStream/onremovetrack
    static dispatchRemoveTrackEvent(stream, track) {
        stream.dispatchEvent(new MediaStreamTrackEvent("removetrack", { track }));
    }
    /**
     * Stop tracks and close peer connection.
     */
    close() {
        this.logger.debug("SessionDescriptionHandler.close");
        if (this._peerConnection === undefined) {
            return;
        }
        this._peerConnection.getReceivers().forEach((receiver) => {
            receiver.track && receiver.track.stop();
        });
        this._peerConnection.getSenders().forEach((sender) => {
            sender.track && sender.track.stop();
        });
        if (this._dataChannel) {
            this._dataChannel.close();
        }
        this._peerConnection.close();
        this._peerConnection = undefined;
    }
    /**
     * Helper function to enable/disable media tracks.
     * @param enable - If true enable tracks, otherwise disable tracks.
     */
    enableReceiverTracks(enable) {
        const peerConnection = this.peerConnection;
        if (!peerConnection) {
            throw new Error("Peer connection closed.");
        }
        peerConnection.getReceivers().forEach((receiver) => {
            if (receiver.track) {
                receiver.track.enabled = enable;
            }
        });
    }
    /**
     * Helper function to enable/disable media tracks.
     * @param enable - If true enable tracks, otherwise disable tracks.
     */
    enableSenderTracks(enable) {
        const peerConnection = this.peerConnection;
        if (!peerConnection) {
            throw new Error("Peer connection closed.");
        }
        peerConnection.getSenders().forEach((sender) => {
            if (sender.track) {
                sender.track.enabled = enable;
            }
        });
    }
    /**
     * Creates an offer or answer.
     * @param options - Options bucket.
     * @param modifiers - Modifiers.
     */
    getDescription(options, modifiers) {
        var _a, _b;
        this.logger.debug("SessionDescriptionHandler.getDescription");
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error("Peer connection closed."));
        }
        // Callback on data channel creation
        this.onDataChannel = options === null || options === void 0 ? void 0 : options.onDataChannel;
        // ICE will restart upon applying an offer created with the iceRestart option
        const iceRestart = (_a = options === null || options === void 0 ? void 0 : options.offerOptions) === null || _a === void 0 ? void 0 : _a.iceRestart;
        // ICE gathering timeout may be set on a per call basis, otherwise the configured default is used
        const iceTimeout = (options === null || options === void 0 ? void 0 : options.iceGatheringTimeout) === undefined
            ? (_b = this.sessionDescriptionHandlerConfiguration) === null || _b === void 0 ? void 0 : _b.iceGatheringTimeout
            : options === null || options === void 0 ? void 0 : options.iceGatheringTimeout;
        return this.getLocalMediaStream(options)
            .then(() => this.updateDirection(options))
            .then(() => this.createDataChannel(options))
            .then(() => this.createLocalOfferOrAnswer(options))
            .then((sessionDescription) => this.applyModifiers(sessionDescription, modifiers))
            .then((sessionDescription) => this.setLocalSessionDescription(sessionDescription))
            .then(() => this.waitForIceGatheringComplete(iceRestart, iceTimeout))
            .then(() => this.getLocalSessionDescription())
            .then((sessionDescription) => {
            return {
                body: sessionDescription.sdp,
                contentType: "application/sdp"
            };
        })
            .catch((error) => {
            this.logger.error("SessionDescriptionHandler.getDescription failed - " + error);
            throw error;
        });
    }
    /**
     * Returns true if the SessionDescriptionHandler can handle the Content-Type described by a SIP message.
     * @param contentType - The content type that is in the SIP Message.
     */
    hasDescription(contentType) {
        this.logger.debug("SessionDescriptionHandler.hasDescription");
        return contentType === "application/sdp";
    }
    /**
     * Called when ICE gathering completes and resolves any waiting promise.
     * @remarks
     * May be called prior to ICE gathering actually completing to allow the
     * session descirption handler proceed with whatever candidates have been
     * gathered up to this point in time. Use this to stop waiting on ICE to
     * complete if you are implementing your own ICE gathering completion strategy.
     */
    iceGatheringComplete() {
        this.logger.debug("SessionDescriptionHandler.iceGatheringComplete");
        // clear timer if need be
        if (this.iceGatheringCompleteTimeoutId !== undefined) {
            this.logger.debug("SessionDescriptionHandler.iceGatheringComplete - clearing timeout");
            clearTimeout(this.iceGatheringCompleteTimeoutId);
            this.iceGatheringCompleteTimeoutId = undefined;
        }
        // resolve and cleanup promise if need be
        if (this.iceGatheringCompletePromise !== undefined) {
            this.logger.debug("SessionDescriptionHandler.iceGatheringComplete - resolving promise");
            this.iceGatheringCompleteResolve && this.iceGatheringCompleteResolve();
            this.iceGatheringCompletePromise = undefined;
            this.iceGatheringCompleteResolve = undefined;
            this.iceGatheringCompleteReject = undefined;
        }
    }
    /**
     * Send DTMF via RTP (RFC 4733).
     * Returns true if DTMF send is successful, false otherwise.
     * @param tones - A string containing DTMF digits.
     * @param options - Options object to be used by sendDtmf.
     */
    sendDtmf(tones, options) {
        this.logger.debug("SessionDescriptionHandler.sendDtmf");
        if (this._peerConnection === undefined) {
            this.logger.error("SessionDescriptionHandler.sendDtmf failed - peer connection closed");
            return false;
        }
        const senders = this._peerConnection.getSenders();
        if (senders.length === 0) {
            this.logger.error("SessionDescriptionHandler.sendDtmf failed - no senders");
            return false;
        }
        const dtmfSender = senders[0].dtmf;
        if (!dtmfSender) {
            this.logger.error("SessionDescriptionHandler.sendDtmf failed - no DTMF sender");
            return false;
        }
        const duration = options === null || options === void 0 ? void 0 : options.duration;
        const interToneGap = options === null || options === void 0 ? void 0 : options.interToneGap;
        try {
            dtmfSender.insertDTMF(tones, duration, interToneGap);
        }
        catch (e) {
            this.logger.error(e.toString());
            return false;
        }
        this.logger.log("SessionDescriptionHandler.sendDtmf sent via RTP: " + tones.toString());
        return true;
    }
    /**
     * Sets an offer or answer.
     * @param sdp - The session description.
     * @param options - Options bucket.
     * @param modifiers - Modifiers.
     */
    setDescription(sdp, options, modifiers) {
        this.logger.debug("SessionDescriptionHandler.setDescription");
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error("Peer connection closed."));
        }
        // Callback on data channel creation
        this.onDataChannel = options === null || options === void 0 ? void 0 : options.onDataChannel;
        // SDP type
        const type = this._peerConnection.signalingState === "have-local-offer" ? "answer" : "offer";
        return this.getLocalMediaStream(options)
            .then(() => this.applyModifiers({ sdp, type }, modifiers))
            .then((sessionDescription) => this.setRemoteSessionDescription(sessionDescription))
            .catch((error) => {
            this.logger.error("SessionDescriptionHandler.setDescription failed - " + error);
            throw error;
        });
    }
    /**
     * Applies modifiers to SDP prior to setting the local or remote description.
     * @param sdp - SDP to modify.
     * @param modifiers - Modifiers to apply.
     */
    applyModifiers(sdp, modifiers) {
        this.logger.debug("SessionDescriptionHandler.applyModifiers");
        if (!modifiers || modifiers.length === 0) {
            return Promise.resolve(sdp);
        }
        return modifiers
            .reduce((cur, next) => cur.then(next), Promise.resolve(sdp))
            .then((modified) => {
            this.logger.debug("SessionDescriptionHandler.applyModifiers - modified sdp");
            if (!modified.sdp || !modified.type) {
                throw new Error("Invalid SDP.");
            }
            return { sdp: modified.sdp, type: modified.type };
        });
    }
    /**
     * Create a data channel.
     * @remarks
     * Only creates a data channel if SessionDescriptionHandlerOptions.dataChannel is true.
     * Only creates a data channel if creating a local offer.
     * Only if one does not already exist.
     * @param options - Session description handler options.
     */
    createDataChannel(options) {
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error("Peer connection closed."));
        }
        // only create a data channel if requested
        if ((options === null || options === void 0 ? void 0 : options.dataChannel) !== true) {
            return Promise.resolve();
        }
        // do not create a data channel if we already have one
        if (this._dataChannel) {
            return Promise.resolve();
        }
        switch (this._peerConnection.signalingState) {
            case "stable":
                // if we are stable, assume we are creating a local offer so create a data channel
                this.logger.debug("SessionDescriptionHandler.createDataChannel - creating data channel");
                try {
                    this._dataChannel = this._peerConnection.createDataChannel((options === null || options === void 0 ? void 0 : options.dataChannelLabel) || "", options === null || options === void 0 ? void 0 : options.dataChannelOptions);
                    if (this.onDataChannel) {
                        this.onDataChannel(this._dataChannel);
                    }
                    return Promise.resolve();
                }
                catch (error) {
                    return Promise.reject(error);
                }
            case "have-remote-offer":
                return Promise.resolve();
            case "have-local-offer":
            case "have-local-pranswer":
            case "have-remote-pranswer":
            case "closed":
            default:
                return Promise.reject(new Error("Invalid signaling state " + this._peerConnection.signalingState));
        }
    }
    /**
     * Depending on current signaling state, create a local offer or answer.
     * @param options - Session description handler options.
     */
    createLocalOfferOrAnswer(options) {
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error("Peer connection closed."));
        }
        switch (this._peerConnection.signalingState) {
            case "stable":
                // if we are stable, assume we are creating a local offer
                this.logger.debug("SessionDescriptionHandler.createLocalOfferOrAnswer - creating SDP offer");
                return this._peerConnection.createOffer(options === null || options === void 0 ? void 0 : options.offerOptions);
            case "have-remote-offer":
                // if we have a remote offer, assume we are creating a local answer
                this.logger.debug("SessionDescriptionHandler.createLocalOfferOrAnswer - creating SDP answer");
                return this._peerConnection.createAnswer(options === null || options === void 0 ? void 0 : options.answerOptions);
            case "have-local-offer":
            case "have-local-pranswer":
            case "have-remote-pranswer":
            case "closed":
            default:
                return Promise.reject(new Error("Invalid signaling state " + this._peerConnection.signalingState));
        }
    }
    /**
     * Get a media stream from the media stream factory and set the local media stream.
     * @param options - Session description handler options.
     */
    getLocalMediaStream(options) {
        this.logger.debug("SessionDescriptionHandler.getLocalMediaStream");
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error("Peer connection closed."));
        }
        let constraints = Object.assign({}, options === null || options === void 0 ? void 0 : options.constraints);
        // if we already have a local media stream...
        if (this.localMediaStreamConstraints) {
            // ignore constraint "downgrades"
            constraints.audio = constraints.audio || this.localMediaStreamConstraints.audio;
            constraints.video = constraints.video || this.localMediaStreamConstraints.video;
            // if constraints have not changed, do not get a new media stream
            if (JSON.stringify(this.localMediaStreamConstraints.audio) === JSON.stringify(constraints.audio) &&
                JSON.stringify(this.localMediaStreamConstraints.video) === JSON.stringify(constraints.video)) {
                return Promise.resolve();
            }
        }
        else {
            // if no constraints have been specified, default to audio for initial media stream
            if (constraints.audio === undefined && constraints.video === undefined) {
                constraints = { audio: true };
            }
        }
        this.localMediaStreamConstraints = constraints;
        return this.mediaStreamFactory(constraints, this, options).then((mediaStream) => this.setLocalMediaStream(mediaStream));
    }
    /**
     * Sets the peer connection's sender tracks and local media stream tracks.
     *
     * @remarks
     * Only the first audio and video tracks of the provided MediaStream are utilized.
     * Adds tracks if audio and/or video tracks are not already present, otherwise replaces tracks.
     *
     * @param stream - Media stream containing tracks to be utilized.
     */
    setLocalMediaStream(stream) {
        this.logger.debug("SessionDescriptionHandler.setLocalMediaStream");
        if (!this._peerConnection) {
            throw new Error("Peer connection undefined.");
        }
        const pc = this._peerConnection;
        const localStream = this._localMediaStream;
        const trackUpdates = [];
        const updateTrack = (newTrack) => {
            const kind = newTrack.kind;
            if (kind !== "audio" && kind !== "video") {
                throw new Error(`Unknown new track kind ${kind}.`);
            }
            const sender = pc.getSenders().find((sender) => sender.track && sender.track.kind === kind);
            if (sender) {
                trackUpdates.push(new Promise((resolve) => {
                    this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - replacing sender ${kind} track`);
                    resolve();
                }).then(() => sender
                    .replaceTrack(newTrack)
                    .then(() => {
                    const oldTrack = localStream.getTracks().find((localTrack) => localTrack.kind === kind);
                    if (oldTrack) {
                        oldTrack.stop();
                        localStream.removeTrack(oldTrack);
                        SessionDescriptionHandler.dispatchRemoveTrackEvent(localStream, oldTrack);
                    }
                    localStream.addTrack(newTrack);
                    SessionDescriptionHandler.dispatchAddTrackEvent(localStream, newTrack);
                })
                    .catch((error) => {
                    this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to replace sender ${kind} track`);
                    throw error;
                })));
            }
            else {
                trackUpdates.push(new Promise((resolve) => {
                    this.logger.debug(`SessionDescriptionHandler.setLocalMediaStream - adding sender ${kind} track`);
                    resolve();
                }).then(() => {
                    // Review: could make streamless tracks a configurable option?
                    // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addTrack#Usage_notes
                    try {
                        pc.addTrack(newTrack, localStream);
                    }
                    catch (error) {
                        this.logger.error(`SessionDescriptionHandler.setLocalMediaStream - failed to add sender ${kind} track`);
                        throw error;
                    }
                    localStream.addTrack(newTrack);
                    SessionDescriptionHandler.dispatchAddTrackEvent(localStream, newTrack);
                }));
            }
        };
        // update peer connection audio tracks
        const audioTracks = stream.getAudioTracks();
        if (audioTracks.length) {
            updateTrack(audioTracks[0]);
        }
        // update peer connection video tracks
        const videoTracks = stream.getVideoTracks();
        if (videoTracks.length) {
            updateTrack(videoTracks[0]);
        }
        return trackUpdates.reduce((p, x) => p.then(() => x), Promise.resolve());
    }
    /**
     * Gets the peer connection's local session description.
     */
    getLocalSessionDescription() {
        this.logger.debug("SessionDescriptionHandler.getLocalSessionDescription");
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error("Peer connection closed."));
        }
        const sdp = this._peerConnection.localDescription;
        if (!sdp) {
            return Promise.reject(new Error("Failed to get local session description"));
        }
        return Promise.resolve(sdp);
    }
    /**
     * Sets the peer connection's local session description.
     * @param sessionDescription - sessionDescription The session description.
     */
    setLocalSessionDescription(sessionDescription) {
        this.logger.debug("SessionDescriptionHandler.setLocalSessionDescription");
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error("Peer connection closed."));
        }
        return this._peerConnection.setLocalDescription(sessionDescription);
    }
    /**
     * Sets the peer connection's remote session description.
     * @param sessionDescription - The session description.
     */
    setRemoteSessionDescription(sessionDescription) {
        this.logger.debug("SessionDescriptionHandler.setRemoteSessionDescription");
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error("Peer connection closed."));
        }
        const sdp = sessionDescription.sdp;
        let type;
        switch (this._peerConnection.signalingState) {
            case "stable":
                // if we are stable assume this is a remote offer
                type = "offer";
                break;
            case "have-local-offer":
                // if we made an offer, assume this is a remote answer
                type = "answer";
                break;
            case "have-local-pranswer":
            case "have-remote-offer":
            case "have-remote-pranswer":
            case "closed":
            default:
                return Promise.reject(new Error("Invalid signaling state " + this._peerConnection.signalingState));
        }
        if (!sdp) {
            this.logger.error("SessionDescriptionHandler.setRemoteSessionDescription failed - cannot set null sdp");
            return Promise.reject(new Error("SDP is undefined"));
        }
        return this._peerConnection.setRemoteDescription({ sdp, type });
    }
    /**
     * Sets a remote media stream track.
     *
     * @remarks
     * Adds tracks if audio and/or video tracks are not already present, otherwise replaces tracks.
     *
     * @param track - Media stream track to be utilized.
     */
    setRemoteTrack(track) {
        this.logger.debug("SessionDescriptionHandler.setRemoteTrack");
        const remoteStream = this._remoteMediaStream;
        if (remoteStream.getTrackById(track.id)) {
            this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - have remote ${track.kind} track`);
        }
        else if (track.kind === "audio") {
            this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - adding remote ${track.kind} track`);
            remoteStream.getAudioTracks().forEach((track) => {
                track.stop();
                remoteStream.removeTrack(track);
                SessionDescriptionHandler.dispatchRemoveTrackEvent(remoteStream, track);
            });
            remoteStream.addTrack(track);
            SessionDescriptionHandler.dispatchAddTrackEvent(remoteStream, track);
        }
        else if (track.kind === "video") {
            this.logger.debug(`SessionDescriptionHandler.setRemoteTrack - adding remote ${track.kind} track`);
            remoteStream.getVideoTracks().forEach((track) => {
                track.stop();
                remoteStream.removeTrack(track);
                SessionDescriptionHandler.dispatchRemoveTrackEvent(remoteStream, track);
            });
            remoteStream.addTrack(track);
            SessionDescriptionHandler.dispatchAddTrackEvent(remoteStream, track);
        }
    }
    /**
     * Depending on the current signaling state and the session hold state, update transceiver direction.
     * @param options - Session description handler options.
     */
    updateDirection(options) {
        if (this._peerConnection === undefined) {
            return Promise.reject(new Error("Peer connection closed."));
        }
        // 4.2.3.  setDirection
        //
        //    The setDirection method sets the direction of a transceiver, which
        //    affects the direction property of the associated "m=" section on
        //    future calls to createOffer and createAnswer.  The permitted values
        //    for direction are "recvonly", "sendrecv", "sendonly", and "inactive",
        //    mirroring the identically named direction attributes defined in
        //    [RFC4566], Section 6.
        //
        //    When creating offers, the transceiver direction is directly reflected
        //    in the output, even for re-offers.  When creating answers, the
        //    transceiver direction is intersected with the offered direction, as
        //    explained in Section 5.3 below.
        //
        //    Note that while setDirection sets the direction property of the
        //    transceiver immediately (Section 4.2.4), this property does not
        //    immediately affect whether the transceiver's RtpSender will send or
        //    its RtpReceiver will receive.  The direction in effect is represented
        //    by the currentDirection property, which is only updated when an
        //    answer is applied.
        //
        // 4.2.4.  direction
        //
        //    The direction property indicates the last value passed into
        //    setDirection.  If setDirection has never been called, it is set to
        //    the direction the transceiver was initialized with.
        //
        // 4.2.5.  currentDirection
        //
        //    The currentDirection property indicates the last negotiated direction
        //    for the transceiver's associated "m=" section.  More specifically, it
        //    indicates the direction attribute [RFC3264] of the associated "m="
        //    section in the last applied answer (including provisional answers),
        //    with "send" and "recv" directions reversed if it was a remote answer.
        //    For example, if the direction attribute for the associated "m="
        //    section in a remote answer is "recvonly", currentDirection is set to
        //    "sendonly".
        //
        //    If an answer that references this transceiver has not yet been
        //    applied or if the transceiver is stopped, currentDirection is set to
        //    "null".
        //  https://tools.ietf.org/html/rfc8829#section-4.2.3
        //
        // *  A direction attribute, determined by applying the rules regarding
        //    the offered direction specified in [RFC3264], Section 6.1, and
        //    then intersecting with the direction of the associated
        //    RtpTransceiver.  For example, in the case where an "m=" section is
        //    offered as "sendonly" and the local transceiver is set to
        //    "sendrecv", the result in the answer is a "recvonly" direction.
        // https://tools.ietf.org/html/rfc8829#section-5.3.1
        //
        // If a stream is offered as sendonly, the corresponding stream MUST be
        // marked as recvonly or inactive in the answer.  If a media stream is
        // listed as recvonly in the offer, the answer MUST be marked as
        // sendonly or inactive in the answer.  If an offered media stream is
        // listed as sendrecv (or if there is no direction attribute at the
        // media or session level, in which case the stream is sendrecv by
        // default), the corresponding stream in the answer MAY be marked as
        // sendonly, recvonly, sendrecv, or inactive.  If an offered media
        // stream is listed as inactive, it MUST be marked as inactive in the
        // answer.
        // https://tools.ietf.org/html/rfc3264#section-6.1
        switch (this._peerConnection.signalingState) {
            case "stable":
                // if we are stable, assume we are creating a local offer
                this.logger.debug("SessionDescriptionHandler.updateDirection - setting offer direction");
                {
                    // determine the direction to offer given the current direction and hold state
                    const directionToOffer = (currentDirection) => {
                        switch (currentDirection) {
                            case "inactive":
                                return (options === null || options === void 0 ? void 0 : options.hold) ? "inactive" : "recvonly";
                            case "recvonly":
                                return (options === null || options === void 0 ? void 0 : options.hold) ? "inactive" : "recvonly";
                            case "sendonly":
                                return (options === null || options === void 0 ? void 0 : options.hold) ? "sendonly" : "sendrecv";
                            case "sendrecv":
                                return (options === null || options === void 0 ? void 0 : options.hold) ? "sendonly" : "sendrecv";
                            case "stopped":
                                return "stopped";
                            default:
                                throw new Error("Should never happen");
                        }
                    };
                    // set the transceiver direction to the offer direction
                    this._peerConnection.getTransceivers().forEach((transceiver) => {
                        if (transceiver.direction /* guarding, but should always be true */) {
                            const offerDirection = directionToOffer(transceiver.direction);
                            if (transceiver.direction !== offerDirection) {
                                transceiver.direction = offerDirection;
                            }
                        }
                    });
                }
                break;
            case "have-remote-offer":
                // if we have a remote offer, assume we are creating a local answer
                this.logger.debug("SessionDescriptionHandler.updateDirection - setting answer direction");
                // FIXME: This is not the correct way to determine the answer direction as it is only
                // considering first match in the offered SDP and using that to determine the answer direction.
                // While that may be fine for our current use cases, it is not a generally correct approach.
                {
                    // determine the offered direction
                    const offeredDirection = (() => {
                        const description = this._peerConnection.remoteDescription;
                        if (!description) {
                            throw new Error("Failed to read remote offer");
                        }
                        const searchResult = /a=sendrecv\r\n|a=sendonly\r\n|a=recvonly\r\n|a=inactive\r\n/.exec(description.sdp);
                        if (searchResult) {
                            switch (searchResult[0]) {
                                case "a=inactive\r\n":
                                    return "inactive";
                                case "a=recvonly\r\n":
                                    return "recvonly";
                                case "a=sendonly\r\n":
                                    return "sendonly";
                                case "a=sendrecv\r\n":
                                    return "sendrecv";
                                default:
                                    throw new Error("Should never happen");
                            }
                        }
                        return "sendrecv";
                    })();
                    // determine the answer direction based on the offered direction and our hold state
                    const answerDirection = (() => {
                        switch (offeredDirection) {
                            case "inactive":
                                return "inactive";
                            case "recvonly":
                                return "sendonly";
                            case "sendonly":
                                return (options === null || options === void 0 ? void 0 : options.hold) ? "inactive" : "recvonly";
                            case "sendrecv":
                                return (options === null || options === void 0 ? void 0 : options.hold) ? "sendonly" : "sendrecv";
                            default:
                                throw new Error("Should never happen");
                        }
                    })();
                    // set the transceiver direction to the answer direction
                    this._peerConnection.getTransceivers().forEach((transceiver) => {
                        if (transceiver.direction /* guarding, but should always be true */) {
                            if (transceiver.direction !== "stopped" && transceiver.direction !== answerDirection) {
                                transceiver.direction = answerDirection;
                            }
                        }
                    });
                }
                break;
            case "have-local-offer":
            case "have-local-pranswer":
            case "have-remote-pranswer":
            case "closed":
            default:
                return Promise.reject(new Error("Invalid signaling state " + this._peerConnection.signalingState));
        }
        return Promise.resolve();
    }
    /**
     * Wait for ICE gathering to complete.
     * @param restart - If true, waits if current state is "complete" (waits for transition to "complete").
     * @param timeout - Milliseconds after which waiting times out. No timeout if 0.
     */
    waitForIceGatheringComplete(restart = false, timeout = 0) {
        this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete");
        if (this._peerConnection === undefined) {
            return Promise.reject("Peer connection closed.");
        }
        // guard already complete
        if (!restart && this._peerConnection.iceGatheringState === "complete") {
            this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - already complete");
            return Promise.resolve();
        }
        // only one may be waiting, reject any prior
        if (this.iceGatheringCompletePromise !== undefined) {
            this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - rejecting prior waiting promise");
            this.iceGatheringCompleteReject && this.iceGatheringCompleteReject(new Error("Promise superseded."));
            this.iceGatheringCompletePromise = undefined;
            this.iceGatheringCompleteResolve = undefined;
            this.iceGatheringCompleteReject = undefined;
        }
        this.iceGatheringCompletePromise = new Promise((resolve, reject) => {
            this.iceGatheringCompleteResolve = resolve;
            this.iceGatheringCompleteReject = reject;
            if (timeout > 0) {
                this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - timeout in " + timeout);
                this.iceGatheringCompleteTimeoutId = setTimeout(() => {
                    this.logger.debug("SessionDescriptionHandler.waitForIceGatheringToComplete - timeout");
                    this.iceGatheringComplete();
                }, timeout);
            }
        });
        return this.iceGatheringCompletePromise;
    }
    /**
     * Initializes the peer connection event handlers
     */
    initPeerConnectionEventHandlers() {
        this.logger.debug("SessionDescriptionHandler.initPeerConnectionEventHandlers");
        if (!this._peerConnection)
            throw new Error("Peer connection undefined.");
        const peerConnection = this._peerConnection;
        peerConnection.onconnectionstatechange = (event) => {
            var _a;
            const newState = peerConnection.connectionState;
            this.logger.debug(`SessionDescriptionHandler.onconnectionstatechange ${newState}`);
            if ((_a = this._peerConnectionDelegate) === null || _a === void 0 ? void 0 : _a.onconnectionstatechange) {
                this._peerConnectionDelegate.onconnectionstatechange(event);
            }
        };
        peerConnection.ondatachannel = (event) => {
            var _a;
            this.logger.debug(`SessionDescriptionHandler.ondatachannel`);
            this._dataChannel = event.channel;
            if (this.onDataChannel) {
                this.onDataChannel(this._dataChannel);
            }
            if ((_a = this._peerConnectionDelegate) === null || _a === void 0 ? void 0 : _a.ondatachannel) {
                this._peerConnectionDelegate.ondatachannel(event);
            }
        };
        peerConnection.onicecandidate = (event) => {
            var _a;
            this.logger.debug(`SessionDescriptionHandler.onicecandidate`);
            if ((_a = this._peerConnectionDelegate) === null || _a === void 0 ? void 0 : _a.onicecandidate) {
                this._peerConnectionDelegate.onicecandidate(event);
            }
        };
        peerConnection.onicecandidateerror = (event) => {
            var _a;
            this.logger.debug(`SessionDescriptionHandler.onicecandidateerror`);
            if ((_a = this._peerConnectionDelegate) === null || _a === void 0 ? void 0 : _a.onicecandidateerror) {
                this._peerConnectionDelegate.onicecandidateerror(event);
            }
        };
        peerConnection.oniceconnectionstatechange = (event) => {
            var _a;
            const newState = peerConnection.iceConnectionState;
            this.logger.debug(`SessionDescriptionHandler.oniceconnectionstatechange ${newState}`);
            if ((_a = this._peerConnectionDelegate) === null || _a === void 0 ? void 0 : _a.oniceconnectionstatechange) {
                this._peerConnectionDelegate.oniceconnectionstatechange(event);
            }
        };
        peerConnection.onicegatheringstatechange = (event) => {
            var _a;
            const newState = peerConnection.iceGatheringState;
            this.logger.debug(`SessionDescriptionHandler.onicegatheringstatechange ${newState}`);
            if (newState === "complete") {
                this.iceGatheringComplete(); // complete waiting for ICE gathering to complete
            }
            if ((_a = this._peerConnectionDelegate) === null || _a === void 0 ? void 0 : _a.onicegatheringstatechange) {
                this._peerConnectionDelegate.onicegatheringstatechange(event);
            }
        };
        peerConnection.onnegotiationneeded = (event) => {
            var _a;
            this.logger.debug(`SessionDescriptionHandler.onnegotiationneeded`);
            if ((_a = this._peerConnectionDelegate) === null || _a === void 0 ? void 0 : _a.onnegotiationneeded) {
                this._peerConnectionDelegate.onnegotiationneeded(event);
            }
        };
        peerConnection.onsignalingstatechange = (event) => {
            var _a;
            const newState = peerConnection.signalingState;
            this.logger.debug(`SessionDescriptionHandler.onsignalingstatechange ${newState}`);
            if ((_a = this._peerConnectionDelegate) === null || _a === void 0 ? void 0 : _a.onsignalingstatechange) {
                this._peerConnectionDelegate.onsignalingstatechange(event);
            }
        };
        peerConnection.ontrack = (event) => {
            var _a;
            const kind = event.track.kind;
            const enabled = event.track.enabled ? "enabled" : "disabled";
            this.logger.debug(`SessionDescriptionHandler.ontrack ${kind} ${enabled}`);
            this.setRemoteTrack(event.track);
            if ((_a = this._peerConnectionDelegate) === null || _a === void 0 ? void 0 : _a.ontrack) {
                this._peerConnectionDelegate.ontrack(event);
            }
        };
    }
}

/**
 * Function which returns a SessionDescriptionHandlerFactory.
 * @remarks
 * See {@link defaultPeerConnectionConfiguration} for the default peer connection configuration.
 * The ICE gathering timeout defaults to 5000ms.
 * @param mediaStreamFactory - MediaStream factory.
 * @public
 */
function defaultSessionDescriptionHandlerFactory(mediaStreamFactory) {
    return (session, options) => {
        // provide a default media stream factory if need be
        if (mediaStreamFactory === undefined) {
            mediaStreamFactory = defaultMediaStreamFactory();
        }
        // make sure we allow `0` to be passed in so timeout can be disabled
        const iceGatheringTimeout = (options === null || options === void 0 ? void 0 : options.iceGatheringTimeout) !== undefined ? options === null || options === void 0 ? void 0 : options.iceGatheringTimeout : 5000;
        // merge passed factory options into default session description configuration
        const sessionDescriptionHandlerConfiguration = {
            iceGatheringTimeout,
            peerConnectionConfiguration: Object.assign(Object.assign({}, defaultPeerConnectionConfiguration()), options === null || options === void 0 ? void 0 : options.peerConnectionConfiguration)
        };
        const logger = session.userAgent.getLogger("sip.SessionDescriptionHandler");
        return new SessionDescriptionHandler(logger, mediaStreamFactory, sessionDescriptionHandlerConfiguration);
    };
}

/**
 * Transport for SIP over secure WebSocket (WSS).
 * @public
 */
class Transport {
    constructor(logger, options) {
        this._state = TransportState.Disconnected;
        this.transitioningState = false;
        // state emitter
        this._stateEventEmitter = new EmitterImpl();
        // logger
        this.logger = logger;
        // guard deprecated options (remove this in version 16.x)
        if (options) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const optionsDeprecated = options;
            const wsServersDeprecated = optionsDeprecated === null || optionsDeprecated === void 0 ? void 0 : optionsDeprecated.wsServers;
            const maxReconnectionAttemptsDeprecated = optionsDeprecated === null || optionsDeprecated === void 0 ? void 0 : optionsDeprecated.maxReconnectionAttempts;
            if (wsServersDeprecated !== undefined) {
                const deprecatedMessage = `The transport option "wsServers" as has apparently been specified and has been deprecated. ` +
                    "It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.";
                this.logger.warn(deprecatedMessage);
            }
            if (maxReconnectionAttemptsDeprecated !== undefined) {
                const deprecatedMessage = `The transport option "maxReconnectionAttempts" as has apparently been specified and has been deprecated. ` +
                    "It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.";
                this.logger.warn(deprecatedMessage);
            }
            // hack
            if (wsServersDeprecated && !options.server) {
                if (typeof wsServersDeprecated === "string") {
                    options.server = wsServersDeprecated;
                }
                if (wsServersDeprecated instanceof Array) {
                    options.server = wsServersDeprecated[0];
                }
            }
        }
        // initialize configuration
        this.configuration = Object.assign(Object.assign({}, Transport.defaultOptions), options);
        // validate server URL
        const url = this.configuration.server;
        const parsed = Grammar.parse(url, "absoluteURI");
        if (parsed === -1) {
            this.logger.error(`Invalid WebSocket Server URL "${url}"`);
            throw new Error("Invalid WebSocket Server URL");
        }
        if (!["wss", "ws", "udp"].includes(parsed.scheme)) {
            this.logger.error(`Invalid scheme in WebSocket Server URL "${url}"`);
            throw new Error("Invalid scheme in WebSocket Server URL");
        }
        this._protocol = parsed.scheme.toUpperCase();
    }
    dispose() {
        return this.disconnect();
    }
    /**
     * The protocol.
     *
     * @remarks
     * Formatted as defined for the Via header sent-protocol transport.
     * https://tools.ietf.org/html/rfc3261#section-20.42
     */
    get protocol() {
        return this._protocol;
    }
    /**
     * The URL of the WebSocket Server.
     */
    get server() {
        return this.configuration.server;
    }
    /**
     * Transport state.
     */
    get state() {
        return this._state;
    }
    /**
     * Transport state change emitter.
     */
    get stateChange() {
        return this._stateEventEmitter;
    }
    /**
     * The WebSocket.
     */
    get ws() {
        return this._ws;
    }
    /**
     * Connect to network.
     * Resolves once connected. Otherwise rejects with an Error.
     */
    connect() {
        return this._connect();
    }
    /**
     * Disconnect from network.
     * Resolves once disconnected. Otherwise rejects with an Error.
     */
    disconnect() {
        return this._disconnect();
    }
    /**
     * Returns true if the `state` equals "Connected".
     * @remarks
     * This is equivalent to `state === TransportState.Connected`.
     */
    isConnected() {
        return this.state === TransportState.Connected;
    }
    /**
     * Sends a message.
     * Resolves once message is sent. Otherwise rejects with an Error.
     * @param message - Message to send.
     */
    send(message) {
        // Error handling is independent of whether the message was a request or
        // response.
        //
        // If the transport user asks for a message to be sent over an
        // unreliable transport, and the result is an ICMP error, the behavior
        // depends on the type of ICMP error.  Host, network, port or protocol
        // unreachable errors, or parameter problem errors SHOULD cause the
        // transport layer to inform the transport user of a failure in sending.
        // Source quench and TTL exceeded ICMP errors SHOULD be ignored.
        //
        // If the transport user asks for a request to be sent over a reliable
        // transport, and the result is a connection failure, the transport
        // layer SHOULD inform the transport user of a failure in sending.
        // https://tools.ietf.org/html/rfc3261#section-18.4
        return this._send(message);
    }
    _connect() {
        this.logger.log(`Connecting ${this.server}`);
        switch (this.state) {
            case TransportState.Connecting:
                // If `state` is "Connecting", `state` MUST NOT transition before returning.
                if (this.transitioningState) {
                    return Promise.reject(this.transitionLoopDetectedError(TransportState.Connecting));
                }
                if (!this.connectPromise) {
                    throw new Error("Connect promise must be defined.");
                }
                return this.connectPromise; // Already connecting
            case TransportState.Connected:
                // If `state` is "Connected", `state` MUST NOT transition before returning.
                if (this.transitioningState) {
                    return Promise.reject(this.transitionLoopDetectedError(TransportState.Connecting));
                }
                if (this.connectPromise) {
                    throw new Error("Connect promise must not be defined.");
                }
                return Promise.resolve(); // Already connected
            case TransportState.Disconnecting:
                // If `state` is "Disconnecting", `state` MUST transition to "Connecting" before returning
                if (this.connectPromise) {
                    throw new Error("Connect promise must not be defined.");
                }
                try {
                    this.transitionState(TransportState.Connecting);
                }
                catch (e) {
                    if (e instanceof StateTransitionError) {
                        return Promise.reject(e); // Loop detected
                    }
                    throw e;
                }
                break;
            case TransportState.Disconnected:
                // If `state` is "Disconnected" `state` MUST transition to "Connecting" before returning
                if (this.connectPromise) {
                    throw new Error("Connect promise must not be defined.");
                }
                try {
                    this.transitionState(TransportState.Connecting);
                }
                catch (e) {
                    if (e instanceof StateTransitionError) {
                        return Promise.reject(e); // Loop detected
                    }
                    throw e;
                }
                break;
            default:
                throw new Error("Unknown state");
        }
        let ws;
        try {
            // WebSocket()
            // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/WebSocket
            ws = new WebSocket(this.server, "sip");
            ws.binaryType = "arraybuffer"; // set data type of received binary messages
            ws.addEventListener("close", (ev) => this.onWebSocketClose(ev, ws));
            ws.addEventListener("error", (ev) => this.onWebSocketError(ev, ws));
            ws.addEventListener("open", (ev) => this.onWebSocketOpen(ev, ws));
            ws.addEventListener("message", (ev) => this.onWebSocketMessage(ev, ws));
            this._ws = ws;
        }
        catch (error) {
            this._ws = undefined;
            this.logger.error("WebSocket construction failed.");
            this.logger.error(error.toString());
            return new Promise((resolve, reject) => {
                this.connectResolve = resolve;
                this.connectReject = reject;
                // The `state` MUST transition to "Disconnecting" or "Disconnected" before rejecting
                this.transitionState(TransportState.Disconnected, error);
            });
        }
        this.connectPromise = new Promise((resolve, reject) => {
            this.connectResolve = resolve;
            this.connectReject = reject;
            this.connectTimeout = setTimeout(() => {
                this.logger.warn("Connect timed out. " +
                    "Exceeded time set in configuration.connectionTimeout: " +
                    this.configuration.connectionTimeout +
                    "s.");
                ws.close(1000); // careful here to use a local reference instead of this._ws
            }, this.configuration.connectionTimeout * 1000);
        });
        return this.connectPromise;
    }
    _disconnect() {
        this.logger.log(`Disconnecting ${this.server}`);
        switch (this.state) {
            case TransportState.Connecting:
                // If `state` is "Connecting", `state` MUST transition to "Disconnecting" before returning.
                if (this.disconnectPromise) {
                    throw new Error("Disconnect promise must not be defined.");
                }
                try {
                    this.transitionState(TransportState.Disconnecting);
                }
                catch (e) {
                    if (e instanceof StateTransitionError) {
                        return Promise.reject(e); // Loop detected
                    }
                    throw e;
                }
                break;
            case TransportState.Connected:
                // If `state` is "Connected", `state` MUST transition to "Disconnecting" before returning.
                if (this.disconnectPromise) {
                    throw new Error("Disconnect promise must not be defined.");
                }
                try {
                    this.transitionState(TransportState.Disconnecting);
                }
                catch (e) {
                    if (e instanceof StateTransitionError) {
                        return Promise.reject(e); // Loop detected
                    }
                    throw e;
                }
                break;
            case TransportState.Disconnecting:
                // If `state` is "Disconnecting", `state` MUST NOT transition before returning.
                if (this.transitioningState) {
                    return Promise.reject(this.transitionLoopDetectedError(TransportState.Disconnecting));
                }
                if (!this.disconnectPromise) {
                    throw new Error("Disconnect promise must be defined.");
                }
                return this.disconnectPromise; // Already disconnecting
            case TransportState.Disconnected:
                // If `state` is "Disconnected", `state` MUST NOT transition before returning.
                if (this.transitioningState) {
                    return Promise.reject(this.transitionLoopDetectedError(TransportState.Disconnecting));
                }
                if (this.disconnectPromise) {
                    throw new Error("Disconnect promise must not be defined.");
                }
                return Promise.resolve(); // Already disconnected
            default:
                throw new Error("Unknown state");
        }
        if (!this._ws) {
            throw new Error("WebSocket must be defined.");
        }
        const ws = this._ws;
        this.disconnectPromise = new Promise((resolve, reject) => {
            this.disconnectResolve = resolve;
            this.disconnectReject = reject;
            try {
                // WebSocket.close()
                // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/close
                ws.close(1000); // careful here to use a local reference instead of this._ws
            }
            catch (error) {
                // Treating this as a coding error as it apparently can only happen
                // if you pass close() invalid parameters (so it should never happen)
                this.logger.error("WebSocket close failed.");
                this.logger.error(error.toString());
                throw error;
            }
        });
        return this.disconnectPromise;
    }
    _send(message) {
        if (this.configuration.traceSip === true) {
            this.logger.log("Sending WebSocket message:\n\n" + message + "\n");
        }
        if (this._state !== TransportState.Connected) {
            return Promise.reject(new Error("Not connected."));
        }
        if (!this._ws) {
            throw new Error("WebSocket undefined.");
        }
        try {
            // WebSocket.send()
            // https://developer.mozilla.org/en-US/docs/Web/API/WebSocket/send
            this._ws.send(message);
        }
        catch (error) {
            if (error instanceof Error) {
                return Promise.reject(error);
            }
            return Promise.reject(new Error("WebSocket send failed."));
        }
        return Promise.resolve();
    }
    /**
     * WebSocket "onclose" event handler.
     * @param ev - Event.
     */
    onWebSocketClose(ev, ws) {
        if (ws !== this._ws) {
            return;
        }
        const message = `WebSocket closed ${this.server} (code: ${ev.code})`;
        const error = !this.disconnectPromise ? new Error(message) : undefined;
        if (error) {
            this.logger.warn("WebSocket closed unexpectedly");
        }
        this.logger.log(message);
        // We are about to transition to disconnected, so clear our web socket
        this._ws = undefined;
        // The `state` MUST transition to "Disconnected" before resolving (assuming `state` is not already "Disconnected").
        this.transitionState(TransportState.Disconnected, error);
    }
    /**
     * WebSocket "onerror" event handler.
     * @param ev - Event.
     */
    onWebSocketError(ev, ws) {
        if (ws !== this._ws) {
            return;
        }
        this.logger.error("WebSocket error occurred.");
    }
    /**
     * WebSocket "onmessage" event handler.
     * @param ev - Event.
     */
    onWebSocketMessage(ev, ws) {
        if (ws !== this._ws) {
            return;
        }
        const data = ev.data;
        let finishedData;
        // CRLF Keep Alive response from server. Clear our keep alive timeout.
        if (/^(\r\n)+$/.test(data)) {
            this.clearKeepAliveTimeout();
            if (this.configuration.traceSip === true) {
                this.logger.log("Received WebSocket message with CRLF Keep Alive response");
            }
            return;
        }
        if (!data) {
            this.logger.warn("Received empty message, discarding...");
            return;
        }
        if (typeof data !== "string") {
            // WebSocket binary message.
            try {
                finishedData = new TextDecoder().decode(new Uint8Array(data));
                // TextDecoder (above) is not supported by old browsers, but it correctly decodes UTF-8.
                // The line below is an ISO 8859-1 (Latin 1) decoder, so just UTF-8 code points that are 1 byte.
                // It's old code and works in old browsers (IE), so leaving it here in a comment in case someone needs it.
                // finishedData = String.fromCharCode.apply(null, (new Uint8Array(data) as unknown as Array<number>));
            }
            catch (err) {
                this.logger.error(err.toString());
                this.logger.error("Received WebSocket binary message failed to be converted into string, message discarded");
                return;
            }
            if (this.configuration.traceSip === true) {
                this.logger.log("Received WebSocket binary message:\n\n" + finishedData + "\n");
            }
        }
        else {
            // WebSocket text message.
            finishedData = data;
            if (this.configuration.traceSip === true) {
                this.logger.log("Received WebSocket text message:\n\n" + finishedData + "\n");
            }
        }
        if (this.state !== TransportState.Connected) {
            this.logger.warn("Received message while not connected, discarding...");
            return;
        }
        if (this.onMessage) {
            try {
                this.onMessage(finishedData);
            }
            catch (e) {
                this.logger.error(e.toString());
                this.logger.error("Exception thrown by onMessage callback");
                throw e; // rethrow unhandled exception
            }
        }
    }
    /**
     * WebSocket "onopen" event handler.
     * @param ev - Event.
     */
    onWebSocketOpen(ev, ws) {
        if (ws !== this._ws) {
            return;
        }
        if (this._state === TransportState.Connecting) {
            this.logger.log(`WebSocket opened ${this.server}`);
            this.transitionState(TransportState.Connected);
        }
    }
    /**
     * Helper function to generate an Error.
     * @param state - State transitioning to.
     */
    transitionLoopDetectedError(state) {
        let message = `A state transition loop has been detected.`;
        message += ` An attempt to transition from ${this._state} to ${state} before the prior transition completed.`;
        message += ` Perhaps you are synchronously calling connect() or disconnect() from a callback or state change handler?`;
        this.logger.error(message);
        return new StateTransitionError("Loop detected.");
    }
    /**
     * Transition transport state.
     * @internal
     */
    transitionState(newState, error) {
        const invalidTransition = () => {
            throw new Error(`Invalid state transition from ${this._state} to ${newState}`);
        };
        if (this.transitioningState) {
            throw this.transitionLoopDetectedError(newState);
        }
        this.transitioningState = true;
        // Validate state transition
        switch (this._state) {
            case TransportState.Connecting:
                if (newState !== TransportState.Connected &&
                    newState !== TransportState.Disconnecting &&
                    newState !== TransportState.Disconnected) {
                    invalidTransition();
                }
                break;
            case TransportState.Connected:
                if (newState !== TransportState.Disconnecting && newState !== TransportState.Disconnected) {
                    invalidTransition();
                }
                break;
            case TransportState.Disconnecting:
                if (newState !== TransportState.Connecting && newState !== TransportState.Disconnected) {
                    invalidTransition();
                }
                break;
            case TransportState.Disconnected:
                if (newState !== TransportState.Connecting) {
                    invalidTransition();
                }
                break;
            default:
                throw new Error("Unknown state.");
        }
        // Update state
        const oldState = this._state;
        this._state = newState;
        // Local copies of connect promises (guarding against callbacks changing them indirectly)
        // const connectPromise = this.connectPromise;
        const connectResolve = this.connectResolve;
        const connectReject = this.connectReject;
        // Reset connect promises if no longer connecting
        if (oldState === TransportState.Connecting) {
            this.connectPromise = undefined;
            this.connectResolve = undefined;
            this.connectReject = undefined;
        }
        // Local copies of disconnect promises (guarding against callbacks changing them indirectly)
        // const disconnectPromise = this.disconnectPromise;
        const disconnectResolve = this.disconnectResolve;
        const disconnectReject = this.disconnectReject;
        // Reset disconnect promises if no longer disconnecting
        if (oldState === TransportState.Disconnecting) {
            this.disconnectPromise = undefined;
            this.disconnectResolve = undefined;
            this.disconnectReject = undefined;
        }
        // Clear any outstanding connect timeout
        if (this.connectTimeout) {
            clearTimeout(this.connectTimeout);
            this.connectTimeout = undefined;
        }
        this.logger.log(`Transitioned from ${oldState} to ${this._state}`);
        this._stateEventEmitter.emit(this._state);
        //  Transition to Connected
        if (newState === TransportState.Connected) {
            this.startSendingKeepAlives();
            if (this.onConnect) {
                try {
                    this.onConnect();
                }
                catch (e) {
                    this.logger.error(e.toString());
                    this.logger.error("Exception thrown by onConnect callback");
                    throw e; // rethrow unhandled exception
                }
            }
        }
        //  Transition from Connected
        if (oldState === TransportState.Connected) {
            this.stopSendingKeepAlives();
            if (this.onDisconnect) {
                try {
                    if (error) {
                        this.onDisconnect(error);
                    }
                    else {
                        this.onDisconnect();
                    }
                }
                catch (e) {
                    this.logger.error(e.toString());
                    this.logger.error("Exception thrown by onDisconnect callback");
                    throw e; // rethrow unhandled exception
                }
            }
        }
        // Complete connect promise
        if (oldState === TransportState.Connecting) {
            if (!connectResolve) {
                throw new Error("Connect resolve undefined.");
            }
            if (!connectReject) {
                throw new Error("Connect reject undefined.");
            }
            newState === TransportState.Connected ? connectResolve() : connectReject(error || new Error("Connect aborted."));
        }
        // Complete disconnect promise
        if (oldState === TransportState.Disconnecting) {
            if (!disconnectResolve) {
                throw new Error("Disconnect resolve undefined.");
            }
            if (!disconnectReject) {
                throw new Error("Disconnect reject undefined.");
            }
            newState === TransportState.Disconnected
                ? disconnectResolve()
                : disconnectReject(error || new Error("Disconnect aborted."));
        }
        this.transitioningState = false;
    }
    // TODO: Review "KeepAlive Stuff".
    // It is not clear if it works and there are no tests for it.
    // It was blindly lifted the keep alive code unchanged from earlier transport code.
    //
    // From the RFC...
    //
    // SIP WebSocket Clients and Servers may keep their WebSocket
    // connections open by sending periodic WebSocket "Ping" frames as
    // described in [RFC6455], Section 5.5.2.
    // ...
    // The indication and use of the CRLF NAT keep-alive mechanism defined
    // for SIP connection-oriented transports in [RFC5626], Section 3.5.1 or
    // [RFC6223] are, of course, usable over the transport defined in this
    // specification.
    // https://tools.ietf.org/html/rfc7118#section-6
    //
    // and...
    //
    // The Ping frame contains an opcode of 0x9.
    // https://tools.ietf.org/html/rfc6455#section-5.5.2
    //
    // ==============================
    // KeepAlive Stuff
    // ==============================
    clearKeepAliveTimeout() {
        if (this.keepAliveDebounceTimeout) {
            clearTimeout(this.keepAliveDebounceTimeout);
        }
        this.keepAliveDebounceTimeout = undefined;
    }
    /**
     * Send a keep-alive (a double-CRLF sequence).
     */
    sendKeepAlive() {
        if (this.keepAliveDebounceTimeout) {
            // We already have an outstanding keep alive, do not send another.
            return Promise.resolve();
        }
        this.keepAliveDebounceTimeout = setTimeout(() => {
            this.clearKeepAliveTimeout();
        }, this.configuration.keepAliveDebounce * 1000);
        return this.send("\r\n\r\n");
    }
    /**
     * Start sending keep-alives.
     */
    startSendingKeepAlives() {
        // Compute an amount of time in seconds to wait before sending another keep-alive.
        const computeKeepAliveTimeout = (upperBound) => {
            const lowerBound = upperBound * 0.8;
            return 1000 * (Math.random() * (upperBound - lowerBound) + lowerBound);
        };
        if (this.configuration.keepAliveInterval && !this.keepAliveInterval) {
            this.keepAliveInterval = setInterval(() => {
                this.sendKeepAlive();
                this.startSendingKeepAlives();
            }, computeKeepAliveTimeout(this.configuration.keepAliveInterval));
        }
    }
    /**
     * Stop sending keep-alives.
     */
    stopSendingKeepAlives() {
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
        }
        if (this.keepAliveDebounceTimeout) {
            clearTimeout(this.keepAliveDebounceTimeout);
        }
        this.keepAliveInterval = undefined;
        this.keepAliveDebounceTimeout = undefined;
    }
}
Transport.defaultOptions = {
    server: "",
    connectionTimeout: 5,
    keepAliveInterval: 0,
    keepAliveDebounce: 10,
    traceSip: true
};

/**
 * A user agent sends and receives requests using a `Transport`.
 *
 * @remarks
 * A user agent (UA) is associated with a user via the user's SIP address of record (AOR)
 * and acts on behalf of that user to send and receive SIP requests. The user agent can
 * register to receive incoming requests, as well as create and send outbound messages.
 * The user agent also maintains the Transport over which its signaling travels.
 *
 * @public
 */
class UserAgent {
    /**
     * Constructs a new instance of the `UserAgent` class.
     * @param options - Options bucket. See {@link UserAgentOptions} for details.
     */
    constructor(options = {}) {
        /** @internal */
        this._publishers = {};
        /** @internal */
        this._registerers = {};
        /** @internal */
        this._sessions = {};
        /** @internal */
        this._subscriptions = {};
        this._state = UserAgentState.Stopped;
        // state emitter
        this._stateEventEmitter = new EmitterImpl();
        // initialize delegate
        this.delegate = options.delegate;
        // initialize configuration
        this.options = Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, UserAgent.defaultOptions()), { sipjsId: createRandomToken(5) }), { uri: new URI("sip", "anonymous." + createRandomToken(6), "anonymous.invalid") }), { viaHost: createRandomToken(12) + ".invalid" }), UserAgent.stripUndefinedProperties(options));
        // viaHost is hack
        if (this.options.hackIpInContact) {
            if (typeof this.options.hackIpInContact === "boolean" && this.options.hackIpInContact) {
                const from = 1;
                const to = 254;
                const octet = Math.floor(Math.random() * (to - from + 1) + from);
                // random Test-Net IP (http://tools.ietf.org/html/rfc5735)
                this.options.viaHost = "192.0.2." + octet;
            }
            else if (this.options.hackIpInContact) {
                this.options.viaHost = this.options.hackIpInContact;
            }
        }
        // initialize logger & logger factory
        this.loggerFactory = new LoggerFactory();
        this.logger = this.loggerFactory.getLogger("sip.UserAgent");
        this.loggerFactory.builtinEnabled = this.options.logBuiltinEnabled;
        this.loggerFactory.connector = this.options.logConnector;
        switch (this.options.logLevel) {
            case "error":
                this.loggerFactory.level = Levels.error;
                break;
            case "warn":
                this.loggerFactory.level = Levels.warn;
                break;
            case "log":
                this.loggerFactory.level = Levels.log;
                break;
            case "debug":
                this.loggerFactory.level = Levels.debug;
                break;
        }
        if (this.options.logConfiguration) {
            this.logger.log("Configuration:");
            Object.keys(this.options).forEach((key) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const value = this.options[key];
                switch (key) {
                    case "uri":
                    case "sessionDescriptionHandlerFactory":
                        this.logger.log("· " + key + ": " + value);
                        break;
                    case "authorizationPassword":
                        this.logger.log("· " + key + ": " + "NOT SHOWN");
                        break;
                    case "transportConstructor":
                        this.logger.log("· " + key + ": " + value.name);
                        break;
                    default:
                        this.logger.log("· " + key + ": " + JSON.stringify(value));
                }
            });
        }
        // guard deprecated transport options (remove this in version 16.x)
        if (this.options.transportOptions) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const optionsDeprecated = this.options.transportOptions;
            const maxReconnectionAttemptsDeprecated = optionsDeprecated.maxReconnectionAttempts;
            const reconnectionTimeoutDeprecated = optionsDeprecated.reconnectionTimeout;
            if (maxReconnectionAttemptsDeprecated !== undefined) {
                const deprecatedMessage = `The transport option "maxReconnectionAttempts" as has apparently been specified and has been deprecated. ` +
                    "It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.";
                this.logger.warn(deprecatedMessage);
            }
            if (reconnectionTimeoutDeprecated !== undefined) {
                const deprecatedMessage = `The transport option "reconnectionTimeout" as has apparently been specified and has been deprecated. ` +
                    "It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.";
                this.logger.warn(deprecatedMessage);
            }
            // hack
            if (options.reconnectionDelay === undefined && reconnectionTimeoutDeprecated !== undefined) {
                this.options.reconnectionDelay = reconnectionTimeoutDeprecated;
            }
            if (options.reconnectionAttempts === undefined && maxReconnectionAttemptsDeprecated !== undefined) {
                this.options.reconnectionAttempts = maxReconnectionAttemptsDeprecated;
            }
        }
        // guard deprecated user agent options (remove this in version 16.x)
        if (options.reconnectionDelay !== undefined) {
            const deprecatedMessage = `The user agent option "reconnectionDelay" as has apparently been specified and has been deprecated. ` +
                "It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.";
            this.logger.warn(deprecatedMessage);
        }
        if (options.reconnectionAttempts !== undefined) {
            const deprecatedMessage = `The user agent option "reconnectionAttempts" as has apparently been specified and has been deprecated. ` +
                "It will no longer be available starting with SIP.js release 0.16.0. Please update accordingly.";
            this.logger.warn(deprecatedMessage);
        }
        // Initialize Transport
        this._transport = new this.options.transportConstructor(this.getLogger("sip.Transport"), this.options.transportOptions);
        this.initTransportCallbacks();
        // Initialize Contact
        this._contact = this.initContact();
        // Set instance id
        this._instanceId = this.options.instanceId ? this.options.instanceId : UserAgent.newUUID();
        if (Grammar.parse(this._instanceId, "uuid") === -1) {
            throw new Error("Invalid instanceId.");
        }
        // Initialize UserAgentCore
        this._userAgentCore = this.initCore();
    }
    /**
     * Create a URI instance from a string.
     * @param uri - The string to parse.
     *
     * @remarks
     * Returns undefined if the syntax of the URI is invalid.
     * The syntax must conform to a SIP URI as defined in the RFC.
     * 25 Augmented BNF for the SIP Protocol
     * https://tools.ietf.org/html/rfc3261#section-25
     *
     * @example
     * ```ts
     * const uri = UserAgent.makeURI("sip:edgar@example.com");
     * ```
     */
    static makeURI(uri) {
        return Grammar.URIParse(uri);
    }
    /** Default user agent options. */
    static defaultOptions() {
        return {
            allowLegacyNotifications: false,
            authorizationHa1: "",
            authorizationPassword: "",
            authorizationUsername: "",
            delegate: {},
            contactName: "",
            contactParams: { transport: "ws" },
            displayName: "",
            forceRport: false,
            gracefulShutdown: true,
            hackAllowUnregisteredOptionTags: false,
            hackIpInContact: false,
            hackViaTcp: false,
            instanceId: "",
            instanceIdAlwaysAdded: false,
            logBuiltinEnabled: true,
            logConfiguration: true,
            logConnector: () => {
                /* noop */
            },
            logLevel: "log",
            noAnswerTimeout: 60,
            preloadedRouteSet: [],
            reconnectionAttempts: 0,
            reconnectionDelay: 4,
            sendInitialProvisionalResponse: true,
            sessionDescriptionHandlerFactory: defaultSessionDescriptionHandlerFactory(),
            sessionDescriptionHandlerFactoryOptions: {},
            sipExtension100rel: SIPExtension.Unsupported,
            sipExtensionReplaces: SIPExtension.Unsupported,
            sipExtensionExtraSupported: [],
            sipjsId: "",
            transportConstructor: Transport,
            transportOptions: {},
            uri: new URI("sip", "anonymous", "anonymous.invalid"),
            userAgentString: "SIP.js/" + LIBRARY_VERSION,
            viaHost: ""
        };
    }
    // http://stackoverflow.com/users/109538/broofa
    static newUUID() {
        const UUID = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = Math.floor(Math.random() * 16);
            const v = c === "x" ? r : (r % 4) + 8;
            return v.toString(16);
        });
        return UUID;
    }
    /**
     * Strip properties with undefined values from options.
     * This is a work around while waiting for missing vs undefined to be addressed (or not)...
     * https://github.com/Microsoft/TypeScript/issues/13195
     * @param options - Options to reduce
     */
    static stripUndefinedProperties(options) {
        return Object.keys(options).reduce((object, key) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (options[key] !== undefined) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                object[key] = options[key];
            }
            return object;
        }, {});
    }
    /**
     * User agent configuration.
     */
    get configuration() {
        return this.options;
    }
    /**
     * User agent contact.
     */
    get contact() {
        return this._contact;
    }
    /**
     * User agent instance id.
     */
    get instanceId() {
        return this._instanceId;
    }
    /**
     * User agent state.
     */
    get state() {
        return this._state;
    }
    /**
     * User agent state change emitter.
     */
    get stateChange() {
        return this._stateEventEmitter;
    }
    /**
     * User agent transport.
     */
    get transport() {
        return this._transport;
    }
    /**
     * User agent core.
     */
    get userAgentCore() {
        return this._userAgentCore;
    }
    /**
     * The logger.
     */
    getLogger(category, label) {
        return this.loggerFactory.getLogger(category, label);
    }
    /**
     * The logger factory.
     */
    getLoggerFactory() {
        return this.loggerFactory;
    }
    /**
     * True if transport is connected.
     */
    isConnected() {
        return this.transport.isConnected();
    }
    /**
     * Reconnect the transport.
     */
    reconnect() {
        if (this.state === UserAgentState.Stopped) {
            return Promise.reject(new Error("User agent stopped."));
        }
        // Make sure we don't call synchronously
        return Promise.resolve().then(() => this.transport.connect());
    }
    /**
     * Start the user agent.
     *
     * @remarks
     * Resolves if transport connects, otherwise rejects.
     * Calling `start()` after calling `stop()` will fail if `stop()` has yet to resolve.
     *
     * @example
     * ```ts
     * userAgent.start()
     *   .then(() => {
     *     // userAgent.isConnected() === true
     *   })
     *   .catch((error: Error) => {
     *     // userAgent.isConnected() === false
     *   });
     * ```
     */
    start() {
        if (this.state === UserAgentState.Started) {
            this.logger.warn(`User agent already started`);
            return Promise.resolve();
        }
        this.logger.log(`Starting ${this.configuration.uri}`);
        // Transition state
        this.transitionState(UserAgentState.Started);
        return this.transport.connect();
    }
    /**
     * Stop the user agent.
     *
     * @remarks
     * Resolves when the user agent has completed a graceful shutdown.
     * ```txt
     * 1) Sessions terminate.
     * 2) Registerers unregister.
     * 3) Subscribers unsubscribe.
     * 4) Publishers unpublish.
     * 5) Transport disconnects.
     * 6) User Agent Core resets.
     * ```
     * The user agent state transistions to stopped once these steps have been completed.
     * Calling `start()` after calling `stop()` will fail if `stop()` has yet to resolve.
     *
     * NOTE: While this is a "graceful shutdown", it can also be very slow one if you
     * are waiting for the returned Promise to resolve. The disposal of the clients and
     * dialogs is done serially - waiting on one to finish before moving on to the next.
     * This can be slow if there are lot of subscriptions to unsubscribe for example.
     *
     * THE SLOW PACE IS INTENTIONAL!
     * While one could spin them all down in parallel, this could slam the remote server.
     * It is bad practice to denial of service attack (DoS attack) servers!!!
     * Moreover, production servers will automatically blacklist clients which send too
     * many requests in too short a period of time - dropping any additional requests.
     *
     * If a different approach to disposing is needed, one can implement whatever is
     * needed and execute that prior to calling `stop()`. Alternatively one may simply
     * not wait for the Promise returned by `stop()` to complete.
     */
    async stop() {
        if (this.state === UserAgentState.Stopped) {
            this.logger.warn(`User agent already stopped`);
            return Promise.resolve();
        }
        this.logger.log(`Stopping ${this.configuration.uri}`);
        // The default behavior is to cleanup dialogs and registrations. This is not that...
        if (!this.options.gracefulShutdown) {
            // Dispose of the transport (disconnecting)
            this.logger.log(`Dispose of transport`);
            this.transport.dispose().catch((error) => {
                this.logger.error(error.message);
                throw error;
            });
            // Dispose of the user agent core (resetting)
            this.logger.log(`Dispose of core`);
            this.userAgentCore.dispose();
            // Reset dialogs and registrations
            this._publishers = {};
            this._registerers = {};
            this._sessions = {};
            this._subscriptions = {};
            this.transitionState(UserAgentState.Stopped);
            return Promise.resolve();
        }
        // Be careful here to use a local references as start() can be called
        // again before we complete and we don't want to touch new clients
        // and we don't want to step on the new instances (or vice versa).
        const publishers = Object.assign({}, this._publishers);
        const registerers = Object.assign({}, this._registerers);
        const sessions = Object.assign({}, this._sessions);
        const subscriptions = Object.assign({}, this._subscriptions);
        const transport = this.transport;
        const userAgentCore = this.userAgentCore;
        //
        // At this point we have completed the state transition and everything
        // following will effectively run async and MUST NOT cause any issues
        // if UserAgent.start() is called while the following code continues.
        //
        // TODO: Minor optimization.
        // The disposal in all cases involves, in part, sending messages which
        // is not worth doing if the transport is not connected as we know attempting
        // to send messages will be futile. But none of these disposal methods check
        // if that's is the case and it would be easy for them to do so at this point.
        // Dispose of Registerers
        this.logger.log(`Dispose of registerers`);
        for (const id in registerers) {
            if (registerers[id]) {
                await registerers[id].dispose().catch((error) => {
                    this.logger.error(error.message);
                    delete this._registerers[id];
                    throw error;
                });
            }
        }
        // Dispose of Sessions
        this.logger.log(`Dispose of sessions`);
        for (const id in sessions) {
            if (sessions[id]) {
                await sessions[id].dispose().catch((error) => {
                    this.logger.error(error.message);
                    delete this._sessions[id];
                    throw error;
                });
            }
        }
        // Dispose of Subscriptions
        this.logger.log(`Dispose of subscriptions`);
        for (const id in subscriptions) {
            if (subscriptions[id]) {
                await subscriptions[id].dispose().catch((error) => {
                    this.logger.error(error.message);
                    delete this._subscriptions[id];
                    throw error;
                });
            }
        }
        // Dispose of Publishers
        this.logger.log(`Dispose of publishers`);
        for (const id in publishers) {
            if (publishers[id]) {
                await publishers[id].dispose().catch((error) => {
                    this.logger.error(error.message);
                    delete this._publishers[id];
                    throw error;
                });
            }
        }
        // Dispose of the transport (disconnecting)
        this.logger.log(`Dispose of transport`);
        await transport.dispose().catch((error) => {
            this.logger.error(error.message);
            throw error;
        });
        // Dispose of the user agent core (resetting)
        this.logger.log(`Dispose of core`);
        userAgentCore.dispose();
        // Transition state
        this.transitionState(UserAgentState.Stopped);
    }
    /**
     * Used to avoid circular references.
     * @internal
     */
    _makeInviter(targetURI, options) {
        return new Inviter(this, targetURI, options);
    }
    /**
     * Attempt reconnection up to `maxReconnectionAttempts` times.
     * @param reconnectionAttempt - Current attempt number.
     */
    attemptReconnection(reconnectionAttempt = 1) {
        const reconnectionAttempts = this.options.reconnectionAttempts;
        const reconnectionDelay = this.options.reconnectionDelay;
        if (reconnectionAttempt > reconnectionAttempts) {
            this.logger.log(`Maximum reconnection attempts reached`);
            return;
        }
        this.logger.log(`Reconnection attempt ${reconnectionAttempt} of ${reconnectionAttempts} - trying`);
        setTimeout(() => {
            this.reconnect()
                .then(() => {
                this.logger.log(`Reconnection attempt ${reconnectionAttempt} of ${reconnectionAttempts} - succeeded`);
            })
                .catch((error) => {
                this.logger.error(error.message);
                this.logger.log(`Reconnection attempt ${reconnectionAttempt} of ${reconnectionAttempts} - failed`);
                this.attemptReconnection(++reconnectionAttempt);
            });
        }, reconnectionAttempt === 1 ? 0 : reconnectionDelay * 1000);
    }
    /**
     * Initialize contact.
     */
    initContact() {
        const contactName = this.options.contactName !== "" ? this.options.contactName : createRandomToken(8);
        const contactParams = this.options.contactParams;
        const contact = {
            pubGruu: undefined,
            tempGruu: undefined,
            uri: new URI("sip", contactName, this.options.viaHost, undefined, contactParams),
            toString: (contactToStringOptions = {}) => {
                const anonymous = contactToStringOptions.anonymous || false;
                const outbound = contactToStringOptions.outbound || false;
                const register = contactToStringOptions.register || false;
                let contactString = "<";
                // 3.3.  Using a GRUU
                // Once a user agent obtains GRUUs from the registrar, it uses them in
                // several ways.  First, it uses them as the contents of the Contact
                // header field in non-REGISTER requests and responses that it emits
                // (for example, an INVITE request and 200 OK response).
                // https://datatracker.ietf.org/doc/html/rfc5627#section-3.3
                if (anonymous) {
                    contactString +=
                        this.contact.tempGruu ||
                            `sip:anonymous@anonymous.invalid;transport=${contactParams.transport ? contactParams.transport : "ws"}`;
                }
                else if (register) {
                    contactString += this.contact.uri;
                }
                else {
                    contactString += this.contact.pubGruu || this.contact.uri;
                }
                if (outbound) {
                    contactString += ";ob";
                }
                contactString += ">";
                if (this.options.instanceIdAlwaysAdded) {
                    contactString += ';+sip.instance="<urn:uuid:' + this._instanceId + '>"';
                }
                return contactString;
            }
        };
        return contact;
    }
    /**
     * Initialize user agent core.
     */
    initCore() {
        // supported options
        let supportedOptionTags = [];
        supportedOptionTags.push("outbound"); // TODO: is this really supported?
        if (this.options.sipExtension100rel === SIPExtension.Supported) {
            supportedOptionTags.push("100rel");
        }
        if (this.options.sipExtensionReplaces === SIPExtension.Supported) {
            supportedOptionTags.push("replaces");
        }
        if (this.options.sipExtensionExtraSupported) {
            supportedOptionTags.push(...this.options.sipExtensionExtraSupported);
        }
        if (!this.options.hackAllowUnregisteredOptionTags) {
            supportedOptionTags = supportedOptionTags.filter((optionTag) => UserAgentRegisteredOptionTags[optionTag]);
        }
        supportedOptionTags = Array.from(new Set(supportedOptionTags)); // array of unique values
        // FIXME: TODO: This was ported, but this is and was just plain broken.
        const supportedOptionTagsResponse = supportedOptionTags.slice();
        if (this.contact.pubGruu || this.contact.tempGruu) {
            supportedOptionTagsResponse.push("gruu");
        }
        // core configuration
        const userAgentCoreConfiguration = {
            aor: this.options.uri,
            contact: this.contact,
            displayName: this.options.displayName,
            loggerFactory: this.loggerFactory,
            hackViaTcp: this.options.hackViaTcp,
            routeSet: this.options.preloadedRouteSet,
            supportedOptionTags,
            supportedOptionTagsResponse,
            sipjsId: this.options.sipjsId,
            userAgentHeaderFieldValue: this.options.userAgentString,
            viaForceRport: this.options.forceRport,
            viaHost: this.options.viaHost,
            authenticationFactory: () => {
                const username = this.options.authorizationUsername
                    ? this.options.authorizationUsername
                    : this.options.uri.user; // if authorization username not provided, use uri user as username
                const password = this.options.authorizationPassword ? this.options.authorizationPassword : undefined;
                const ha1 = this.options.authorizationHa1 ? this.options.authorizationHa1 : undefined;
                return new DigestAuthentication(this.getLoggerFactory(), ha1, username, password);
            },
            transportAccessor: () => this.transport
        };
        const userAgentCoreDelegate = {
            onInvite: (incomingInviteRequest) => {
                var _a;
                const invitation = new Invitation(this, incomingInviteRequest);
                incomingInviteRequest.delegate = {
                    onCancel: (cancel) => {
                        invitation._onCancel(cancel);
                    },
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    onTransportError: (error) => {
                        // A server transaction MUST NOT discard transaction state based only on
                        // encountering a non-recoverable transport error when sending a
                        // response.  Instead, the associated INVITE server transaction state
                        // machine MUST remain in its current state.  (Timers will eventually
                        // cause it to transition to the "Terminated" state).
                        // https://tools.ietf.org/html/rfc6026#section-7.1
                        // As noted in the comment above, we are to leaving it to the transaction
                        // timers to eventually cause the transaction to sort itself out in the case
                        // of a transport failure in an invite server transaction. This delegate method
                        // is here simply here for completeness and to make it clear that it provides
                        // nothing more than informational hook into the core. That is, if you think
                        // you should be trying to deal with a transport error here, you are likely wrong.
                        this.logger.error("A transport error has occurred while handling an incoming INVITE request.");
                    }
                };
                // FIXME: Ported - 100 Trying send should be configurable.
                // Only required if TU will not respond in 200ms.
                // https://tools.ietf.org/html/rfc3261#section-17.2.1
                incomingInviteRequest.trying();
                // The Replaces header contains information used to match an existing
                // SIP dialog (call-id, to-tag, and from-tag).  Upon receiving an INVITE
                // with a Replaces header, the User Agent (UA) attempts to match this
                // information with a confirmed or early dialog.
                // https://tools.ietf.org/html/rfc3891#section-3
                if (this.options.sipExtensionReplaces !== SIPExtension.Unsupported) {
                    const message = incomingInviteRequest.message;
                    const replaces = message.parseHeader("replaces");
                    if (replaces) {
                        const callId = replaces.call_id;
                        if (typeof callId !== "string") {
                            throw new Error("Type of call id is not string");
                        }
                        const toTag = replaces.replaces_to_tag;
                        if (typeof toTag !== "string") {
                            throw new Error("Type of to tag is not string");
                        }
                        const fromTag = replaces.replaces_from_tag;
                        if (typeof fromTag !== "string") {
                            throw new Error("type of from tag is not string");
                        }
                        const targetDialogId = callId + toTag + fromTag;
                        const targetDialog = this.userAgentCore.dialogs.get(targetDialogId);
                        // If no match is found, the UAS rejects the INVITE and returns a 481
                        // Call/Transaction Does Not Exist response.  Likewise, if the Replaces
                        // header field matches a dialog which was not created with an INVITE,
                        // the UAS MUST reject the request with a 481 response.
                        // https://tools.ietf.org/html/rfc3891#section-3
                        if (!targetDialog) {
                            invitation.reject({ statusCode: 481 });
                            return;
                        }
                        // If the Replaces header field matches a confirmed dialog, it checks
                        // for the presence of the "early-only" flag in the Replaces header
                        // field.  (This flag allows the UAC to prevent a potentially
                        // undesirable race condition described in Section 7.1.) If the flag is
                        // present, the UA rejects the request with a 486 Busy response.
                        // https://tools.ietf.org/html/rfc3891#section-3
                        if (!targetDialog.early && replaces.early_only === true) {
                            invitation.reject({ statusCode: 486 });
                            return;
                        }
                        // Provide a handle on the session being replaced.
                        const targetSession = this._sessions[callId + fromTag] || this._sessions[callId + toTag] || undefined;
                        if (!targetSession) {
                            throw new Error("Session does not exist.");
                        }
                        invitation._replacee = targetSession;
                    }
                }
                // Delegate invitation handling.
                if ((_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onInvite) {
                    if (invitation.autoSendAnInitialProvisionalResponse) {
                        invitation.progress().then(() => {
                            var _a;
                            if (((_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onInvite) === undefined) {
                                throw new Error("onInvite undefined.");
                            }
                            this.delegate.onInvite(invitation);
                        });
                        return;
                    }
                    this.delegate.onInvite(invitation);
                    return;
                }
                // A common scenario occurs when the callee is currently not willing or
                // able to take additional calls at this end system.  A 486 (Busy Here)
                // SHOULD be returned in such a scenario.
                // https://tools.ietf.org/html/rfc3261#section-13.3.1.3
                invitation.reject({ statusCode: 486 });
            },
            onMessage: (incomingMessageRequest) => {
                if (this.delegate && this.delegate.onMessage) {
                    const message = new Message(incomingMessageRequest);
                    this.delegate.onMessage(message);
                }
                else {
                    // Accept the MESSAGE request, but do nothing with it.
                    incomingMessageRequest.accept();
                }
            },
            onNotify: (incomingNotifyRequest) => {
                // NOTIFY requests are sent to inform subscribers of changes in state to
                // which the subscriber has a subscription.  Subscriptions are created
                // using the SUBSCRIBE method.  In legacy implementations, it is
                // possible that other means of subscription creation have been used.
                // However, this specification does not allow the creation of
                // subscriptions except through SUBSCRIBE requests and (for backwards-
                // compatibility) REFER requests [RFC3515].
                // https://tools.ietf.org/html/rfc6665#section-3.2
                if (this.delegate && this.delegate.onNotify) {
                    const notification = new Notification(incomingNotifyRequest);
                    this.delegate.onNotify(notification);
                }
                else {
                    // Per the above which obsoletes https://tools.ietf.org/html/rfc3265,
                    // the use of out of dialog NOTIFY is obsolete, but...
                    if (this.options.allowLegacyNotifications) {
                        incomingNotifyRequest.accept(); // Accept the NOTIFY request, but do nothing with it.
                    }
                    else {
                        incomingNotifyRequest.reject({ statusCode: 481 });
                    }
                }
            },
            onRefer: (incomingReferRequest) => {
                this.logger.warn("Received an out of dialog REFER request");
                // TOOD: this.delegate.onRefer(...)
                if (this.delegate && this.delegate.onReferRequest) {
                    this.delegate.onReferRequest(incomingReferRequest);
                }
                else {
                    incomingReferRequest.reject({ statusCode: 405 });
                }
            },
            onRegister: (incomingRegisterRequest) => {
                this.logger.warn("Received an out of dialog REGISTER request");
                // TOOD: this.delegate.onRegister(...)
                if (this.delegate && this.delegate.onRegisterRequest) {
                    this.delegate.onRegisterRequest(incomingRegisterRequest);
                }
                else {
                    incomingRegisterRequest.reject({ statusCode: 405 });
                }
            },
            onSubscribe: (incomingSubscribeRequest) => {
                this.logger.warn("Received an out of dialog SUBSCRIBE request");
                // TOOD: this.delegate.onSubscribe(...)
                if (this.delegate && this.delegate.onSubscribeRequest) {
                    this.delegate.onSubscribeRequest(incomingSubscribeRequest);
                }
                else {
                    incomingSubscribeRequest.reject({ statusCode: 405 });
                }
            }
        };
        return new UserAgentCore(userAgentCoreConfiguration, userAgentCoreDelegate);
    }
    initTransportCallbacks() {
        this.transport.onConnect = () => this.onTransportConnect();
        this.transport.onDisconnect = (error) => this.onTransportDisconnect(error);
        this.transport.onMessage = (message) => this.onTransportMessage(message);
    }
    onTransportConnect() {
        if (this.state === UserAgentState.Stopped) {
            return;
        }
        if (this.delegate && this.delegate.onConnect) {
            this.delegate.onConnect();
        }
    }
    onTransportDisconnect(error) {
        if (this.state === UserAgentState.Stopped) {
            return;
        }
        if (this.delegate && this.delegate.onDisconnect) {
            this.delegate.onDisconnect(error);
        }
        // Only attempt to reconnect if network/server dropped the connection.
        if (error && this.options.reconnectionAttempts > 0) {
            this.attemptReconnection();
        }
    }
    onTransportMessage(messageString) {
        const message = Parser.parseMessage(messageString, this.getLogger("sip.Parser"));
        if (!message) {
            this.logger.warn("Failed to parse incoming message. Dropping.");
            return;
        }
        if (this.state === UserAgentState.Stopped && message instanceof IncomingRequestMessage) {
            this.logger.warn(`Received ${message.method} request while stopped. Dropping.`);
            return;
        }
        // A valid SIP request formulated by a UAC MUST, at a minimum, contain
        // the following header fields: To, From, CSeq, Call-ID, Max-Forwards,
        // and Via; all of these header fields are mandatory in all SIP
        // requests.
        // https://tools.ietf.org/html/rfc3261#section-8.1.1
        const hasMinimumHeaders = () => {
            const mandatoryHeaders = ["from", "to", "call_id", "cseq", "via"];
            for (const header of mandatoryHeaders) {
                if (!message.hasHeader(header)) {
                    this.logger.warn(`Missing mandatory header field : ${header}.`);
                    return false;
                }
            }
            return true;
        };
        // Request Checks
        if (message instanceof IncomingRequestMessage) {
            // This is port of SanityCheck.minimumHeaders().
            if (!hasMinimumHeaders()) {
                this.logger.warn(`Request missing mandatory header field. Dropping.`);
                return;
            }
            // FIXME: This is non-standard and should be a configurable behavior (desirable regardless).
            // Custom SIP.js check to reject request from ourself (this instance of SIP.js).
            // This is port of SanityCheck.rfc3261_16_3_4().
            if (!message.toTag && message.callId.substr(0, 5) === this.options.sipjsId) {
                this.userAgentCore.replyStateless(message, { statusCode: 482 });
                return;
            }
            // FIXME: This should be Transport check before we get here (Section 18).
            // Custom SIP.js check to reject requests if body length wrong.
            // This is port of SanityCheck.rfc3261_18_3_request().
            const len = utf8Length(message.body);
            const contentLength = message.getHeader("content-length");
            if (contentLength && len < Number(contentLength)) {
                this.userAgentCore.replyStateless(message, { statusCode: 400 });
                return;
            }
        }
        // Response Checks
        if (message instanceof IncomingResponseMessage) {
            // This is port of SanityCheck.minimumHeaders().
            if (!hasMinimumHeaders()) {
                this.logger.warn(`Response missing mandatory header field. Dropping.`);
                return;
            }
            // Custom SIP.js check to drop responses if multiple Via headers.
            // This is port of SanityCheck.rfc3261_8_1_3_3().
            if (message.getHeaders("via").length > 1) {
                this.logger.warn("More than one Via header field present in the response. Dropping.");
                return;
            }
            // FIXME: This should be Transport check before we get here (Section 18).
            // Custom SIP.js check to drop responses if bad Via header.
            // This is port of SanityCheck.rfc3261_18_1_2().
            if (message.via.host !== this.options.viaHost || message.via.port !== undefined) {
                this.logger.warn("Via sent-by in the response does not match UA Via host value. Dropping.");
                return;
            }
            // FIXME: This should be Transport check before we get here (Section 18).
            // Custom SIP.js check to reject requests if body length wrong.
            // This is port of SanityCheck.rfc3261_18_3_response().
            const len = utf8Length(message.body);
            const contentLength = message.getHeader("content-length");
            if (contentLength && len < Number(contentLength)) {
                this.logger.warn("Message body length is lower than the value in Content-Length header field. Dropping.");
                return;
            }
        }
        // Handle Request
        if (message instanceof IncomingRequestMessage) {
            this.userAgentCore.receiveIncomingRequestFromTransport(message);
            return;
        }
        // Handle Response
        if (message instanceof IncomingResponseMessage) {
            this.userAgentCore.receiveIncomingResponseFromTransport(message);
            return;
        }
        throw new Error("Invalid message type.");
    }
    /**
     * Transition state.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    transitionState(newState, error) {
        const invalidTransition = () => {
            throw new Error(`Invalid state transition from ${this._state} to ${newState}`);
        };
        // Validate state transition
        switch (this._state) {
            case UserAgentState.Started:
                if (newState !== UserAgentState.Stopped) {
                    invalidTransition();
                }
                break;
            case UserAgentState.Stopped:
                if (newState !== UserAgentState.Started) {
                    invalidTransition();
                }
                break;
            default:
                throw new Error("Unknown state.");
        }
        // Update state
        this.logger.log(`Transitioned from ${this._state} to ${newState}`);
        this._state = newState;
        this._stateEventEmitter.emit(this._state);
    }
}

const useSessionMethods = () => {
    const configs = useSipStore((state) => state.configs);
    const findLineByNumber = useSipStore((state) => state.findLineByNumber);
    const getNewLineNumber = useSipStore((state) => state.getNewLineNumber);
    const addLine = useSipStore((state) => state.addLine);
    const removeLine = useSipStore((state) => state.removeLine);
    const updateLine = useSipStore((state) => state.updateLine);
    const countIdSessions = useSipStore((state) => state.countIdSessions);
    const userAgent = useSipStore((state) => state.userAgent);
    const audioBlobs = useSipStore((state) => state.audioBlobs);
    const { hasAudioDevice, hasVideoDevice } = useSipStore((state) => state.devicesInfo);
    const { onInviteAccepted, onInviteCancel, onInviteProgress, onInviteRedirected, onInviteRejected, onInviteTrying, onSessionDescriptionHandlerCreated, onSessionReceivedBye, onSessionReceivedMessage, onSessionReinvited, onTransferSessionDescriptionHandlerCreated, } = useSessionEvents();
    const { answerAudioSpdOptions, makeAudioSpdOptions, answerVideoSpdOptions, makeVideoSpdOptions } = useSpdOptions();
    /* -------------------------------------------------------------------------- */
    /*                       Init-Session Call Functionality                      */
    /* -------------------------------------------------------------------------- */
    /**
     * Handle incoming calls
     * @param session
     * @returns
     */
    function receiveCall(session) {
        console.log('receiveCall', { session });
        const callerID = session.remoteIdentity.displayName || session.remoteIdentity.uri.user || '';
        let did = session.remoteIdentity.uri.user ?? '';
        console.log(`Incoming call from: ${callerID}`);
        const startTime = dayJs.utc();
        // Create or update buddy based on DID
        const lineObj = new Line(getNewLineNumber(), callerID, session.data.metaData ?? {});
        lineObj.sipSession = session;
        lineObj.sipSession.data = {};
        lineObj.sipSession.data.line = lineObj.lineNumber;
        lineObj.sipSession.data.callDirection = 'inbound';
        lineObj.sipSession.data.terminateBy = '';
        lineObj.sipSession.data.src = did;
        lineObj.sipSession.data.metaData = lineObj?.metaData;
        lineObj.sipSession.data.callstart = startTime.format('YYYY-MM-DD HH:mm:ss UTC');
        lineObj.sipSession.data.earlyReject = false;
        // Detect Video
        lineObj.sipSession.data.withVideo = false;
        if (configs.features.enableVideo && lineObj.sipSession.request.body) {
            // Asterisk 13 PJ_SIP always sends m=video if endpoint has video codec,
            // even if original invite does not specify video.
            if (lineObj.sipSession.request.body.indexOf('m=video') > -1) {
                lineObj.sipSession.data.withVideo = true;
                // The invite may have video, but the buddy may be a contact
            }
        }
        // Extract P-Asserted-Identity if available
        const sipHeaders = session.incomingInviteRequest.message.headers;
        if (sipHeaders['P-Asserted-Identity']) {
            const rawUri = sipHeaders['P-Asserted-Identity'][0].raw;
            if (rawUri.includes('<sip:')) {
                const uriParts = rawUri.split('<sip:');
                if (uriParts[1].endsWith('>'))
                    uriParts[1] = uriParts[1].slice(0, -1);
                if (uriParts[1].includes(`@${configs.account.domain}`)) {
                    did = uriParts[1].split('@')[0];
                    console.log('Using P-Asserted-Identity:', did);
                }
            }
        }
        // Session Delegates
        lineObj.sipSession.delegate = {
            onBye: function (sip) {
                onSessionReceivedBye(lineObj, sip, () => teardownSession(lineObj));
            },
            onMessage: function (sip) {
                onSessionReceivedMessage(lineObj, sip);
            },
            onInvite: function (sip) {
                onSessionReinvited(lineObj, sip);
            },
            onSessionDescriptionHandler: function (sdh, provisional) {
                onSessionDescriptionHandlerCreated(lineObj, sdh, provisional, session.data.withVideo);
            },
        };
        // incomingInviteRequestDelegate
        lineObj.sipSession.incomingInviteRequest.delegate = {
            onCancel: function (sip) {
                console.log('onInviteCancel');
                onInviteCancel(lineObj, sip, () => teardownSession(lineObj));
            },
        };
        // Auto Answer options
        // let autoAnswerRequested = false;
        // let answerTimeout = 1000;
        // if (!AutoAnswerEnabled && IntercomPolicy == 'enabled') {
        //   // Check headers only if policy is allow
        //   // https://github.com/InnovateAsterisk/Browser-Phone/issues/126
        //   // Alert-Info: info=alert-autoanswer
        //   // Alert-Info: answer-after=0
        //   // Call-info: answer-after=0; x=y
        //   // Call-Info: Answer-After=0
        //   // Alert-Info: ;info=alert-autoanswer
        //   // Alert-Info: <sip:>;info=alert-autoanswer
        //   // Alert-Info: <sip:domain>;info=alert-autoanswer
        //   // const ci = session.request.headers['Call-Info'];
        //   // if (ci !== undefined && ci.length > 0) {
        //   //   for (let i = 0; i < ci.length; i++) {
        //   //     const raw_ci = ci[i].raw.toLowerCase();
        //   //     if (raw_ci.indexOf('answer-after=') > 0) {
        //   //       const temp_seconds_autoanswer = parseInt(
        //   //         raw_ci
        //   //           .substring(raw_ci.indexOf('answer-after=') + 'answer-after='.length)
        //   //           .split(';')[0],
        //   //       );
        //   //       if (Number.isInteger(temp_seconds_autoanswer) && temp_seconds_autoanswer >= 0) {
        //   //         autoAnswerRequested = true;
        //   //         if (temp_seconds_autoanswer > 1) answerTimeout = temp_seconds_autoanswer * 1000;
        //   //         break;
        //   //       }
        //   //     }
        //   //   }
        //   // }
        //   // const ai = session.request.headers['Alert-Info'];
        //   // if (autoAnswerRequested === false && ai !== undefined && ai.length > 0) {
        //   //   for (let i = 0; i < ai.length; i++) {
        //   //     const raw_ai = ai[i].raw.toLowerCase();
        //   //     if (raw_ai.indexOf('auto answer') > 0 || raw_ai.indexOf('alert-autoanswer') > 0) {
        //   //       autoAnswerRequested = true;
        //   //       break;
        //   //     }
        //   //     if (raw_ai.indexOf('answer-after=') > 0) {
        //   //       const temp_seconds_autoanswer = parseInt(
        //   //         raw_ai
        //   //           .substring(raw_ai.indexOf('answer-after=') + 'answer-after='.length)
        //   //           .split(';')[0],
        //   //       );
        //   //       if (Number.isInteger(temp_seconds_autoanswer) && temp_seconds_autoanswer >= 0) {
        //   //         autoAnswerRequested = true;
        //   //         if (temp_seconds_autoanswer > 1) answerTimeout = temp_seconds_autoanswer * 1000;
        //   //         break;
        //   //       }
        //   //     }
        //   //   }
        //   // }
        // }
        // Check if that buddy is not already on a call?? //TODO #SH
        // const streamVisible = $('#stream-' + buddyObj?.identity).is(':visible');
        // if (streamVisible || CurrentCalls == 0) {
        //   // If you are already on the selected buddy who is now calling you, switch to his call.
        //   // NOTE: This will put other calls on hold
        //   if (CurrentCalls == 0) SelectLine(lineObj.LineNumber);
        // }
        // Show notification / Ring / Windows Etc
        // ======================================
        // Play Ring Tone if not on the phone
        // Retrieve EnableRingtone from configs or set a default value
        const currentCalls = countIdSessions(session.id);
        if (configs.features.enableRingtone) {
            if (currentCalls >= 1) {
                // Play Alert
                console.log('Audio:', audioBlobs.CallWaiting.url);
                const ringer = new Audio(audioBlobs.CallWaiting.url);
                ringer.preload = 'auto';
                ringer.loop = false;
                ringer.oncanplaythrough = function () {
                    if (typeof ringer.sinkId !== 'undefined' &&
                        configs.media.ringerOutputDeviceId != 'default') {
                        ringer
                            .setSinkId(configs.media.ringerOutputDeviceId)
                            .then(function () {
                            console.log('Set sinkId to:', configs.media.ringerOutputDeviceId);
                        })
                            .catch(function (e) {
                            console.warn('Failed not apply setSinkId.', e);
                        });
                    }
                    // If there has been no interaction with the page at all... this page will not work
                    ringer
                        .play()
                        .then(function () {
                        // Audio Is Playing
                    })
                        .catch(function (e) {
                        console.warn('Unable to play audio file.', e);
                    });
                };
                lineObj.sipSession.data.ringerObj = ringer;
            }
            else {
                // Play Ring Tone
                console.log('Audio:', audioBlobs.Ringtone.url, audioBlobs.Ringtone);
                const ringer = new Audio(audioBlobs.Ringtone.blob);
                ringer.preload = 'auto';
                ringer.loop = true;
                ringer.oncanplaythrough = function () {
                    if (typeof ringer.sinkId !== 'undefined' &&
                        configs.media.ringerOutputDeviceId != 'default') {
                        ringer
                            .setSinkId(configs.media.ringerOutputDeviceId)
                            .then(function () {
                            console.log('Set sinkId to:', configs.media.ringerOutputDeviceId);
                        })
                            .catch(function (e) {
                            console.warn('Failed not apply setSinkId.', e);
                        });
                    }
                    // If there has been no interaction with the page at all... this page will not work
                    ringer
                        .play()
                        .then(function () {
                        // Audio Is Playing
                    })
                        .catch(function (e) {
                        console.warn('Unable to play audio file.', e);
                    });
                };
                lineObj.sipSession.data.ringerObj = ringer;
            }
        }
        addLine(lineObj);
    }
    /**
     * Handle inbound calls
     * @param lineNumber
     * @returns
     */
    function answerAudioSession(lineNumber) {
        // Check vitals
        if (!hasAudioDevice) {
            alert('lang.alert_no_microphone');
            return;
        }
        const lineObj = findLineByNumber(lineNumber);
        if (lineObj === null) {
            console.warn('Failed to get line (' + lineNumber + ')');
            return;
        }
        const session = lineObj.sipSession;
        if (!session || session instanceof Inviter)
            return;
        // Stop the ringtone
        if (session.data.ringerObj) {
            session.data.ringerObj.pause();
            session.data.ringerObj.removeAttribute('src');
            session.data.ringerObj.load();
            session.data.ringerObj = null;
        }
        // Start SIP handling
        const spdOptions = answerAudioSpdOptions();
        if (!spdOptions)
            return console.error('answerAudioSession spdOptions is undefined');
        // Save Devices
        session.data.withVideo = false;
        session.data.videoSourceDevice = null;
        session.data.audioSourceDevice = configs.media.audioInputDeviceId;
        session.data.audioOutputDevice = configs.media.audioOutputDeviceId;
        // Send Answer
        session
            .accept(spdOptions)
            .then(function () {
            onInviteAccepted(lineObj, false);
        })
            .catch(function (error) {
            console.warn('Failed to answer call', error, session);
            session.data.reasonCode = 500;
            session.data.reasonText = 'Client Error';
            teardownSession(lineObj);
        });
    }
    /**
     * Handle outbound calls
     * @param lineObj
     * @param dialledNumber
     * @param extraHeaders
     * @returns
     */
    function makeAudioSession(lineObj, dialledNumber, extraHeaders) {
        console.log(222, { lineObj, dialledNumber, extraHeaders });
        if (!userAgent)
            return;
        if (!userAgent.isRegistered())
            return;
        if (lineObj === null)
            return;
        if (!hasAudioDevice) {
            console.error('lang.alert_no_microphone');
            return;
        }
        console.log('makeAudioSession');
        const spdOptions = makeAudioSpdOptions({ extraHeaders });
        if (!spdOptions)
            return;
        let startTime = dayJs.utc();
        // Invite
        console.log('INVITE (audio): ' + dialledNumber + '@' + configs.account.domain);
        const targetURI = UserAgent.makeURI('sip:' + dialledNumber.replace(/#/g, '%23') + '@' + configs.account.domain);
        lineObj.sipSession = new Inviter(userAgent, targetURI, spdOptions);
        lineObj.sipSession.data = {};
        lineObj.sipSession.data.line = lineObj.lineNumber;
        lineObj.sipSession.data.metaData = lineObj.metaData;
        lineObj.sipSession.data.callDirection = 'outbound';
        lineObj.sipSession.data.dialledNumber = dialledNumber;
        lineObj.sipSession.data.callstart = startTime.format('YYYY-MM-DD HH:mm:ss UTC');
        lineObj.sipSession.data.videoSourceDevice = null;
        lineObj.sipSession.data.audioSourceDevice = configs.media.audioInputDeviceId;
        lineObj.sipSession.data.audioOutputDevice = configs.media.audioOutputDeviceId;
        lineObj.sipSession.data.terminateBy = 'them';
        lineObj.sipSession.data.withVideo = false;
        lineObj.sipSession.data.earlyReject = false;
        lineObj.sipSession.isOnHold = false;
        lineObj.sipSession.delegate = {
            onBye: function (sip) {
                onSessionReceivedBye(lineObj, sip, () => teardownSession(lineObj));
            },
            onMessage: function (sip) {
                onSessionReceivedMessage(lineObj, sip);
            },
            onInvite: function (sip) {
                onSessionReinvited(lineObj, sip);
            },
            onSessionDescriptionHandler: function (sdh, provisional) {
                console.log('Session Description Handler created:', { sdh });
                onSessionDescriptionHandlerCreated(lineObj, sdh, provisional, false);
            },
        };
        const inviterOptions = {
            // sessionDescriptionHandlerOptions: spdOptions.sessionDescriptionHandlerOptions,
            requestDelegate: {
                // OutgoingRequestDelegate
                onTrying: function (sip) {
                    console.log('makeAudioSession 1');
                    onInviteTrying(lineObj, sip);
                },
                onProgress: function (sip) {
                    console.log('makeAudioSession 2');
                    onInviteProgress(lineObj, sip);
                },
                onRedirect: function (sip) {
                    console.log('makeAudioSession 3');
                    onInviteRedirected(lineObj, sip);
                },
                onAccept: function (sip) {
                    console.log('makeAudioSession 4');
                    onInviteAccepted(lineObj, false, sip);
                },
                onReject: function (sip) {
                    console.log('makeAudioSession 5');
                    onInviteRejected(lineObj, sip, () => teardownSession(lineObj));
                },
            },
        };
        lineObj.sipSession.invite(inviterOptions).catch(function (e) {
            console.warn('Failed to send INVITE:', e);
        });
        // updateLine(lineObj);
        // $('#line-' + lineObj.LineNumber + '-btn-settings').removeAttr('disabled'); TODO #SH ui integration
        // $('#line-' + lineObj.LineNumber + '-btn-audioCall').prop('disabled', 'disabled');
        // $('#line-' + lineObj.LineNumber + '-btn-videoCall').prop('disabled', 'disabled');
        // $('#line-' + lineObj.LineNumber + '-btn-search').removeAttr('disabled');
        // $('#line-' + lineObj.LineNumber + '-progress').show();
        // $('#line-' + lineObj.LineNumber + '-msg').show();
        // UpdateUI();
        // UpdateBuddyList();
        // updateLineScroll(lineObj.LineNumber);
        // // Custom Web hook
        // if (typeof web_hook_on_invite !== 'undefined') web_hook_on_invite(lineObj.sipSession);
    }
    /**
     * Handle inbound video calls
     * @param lineNumber
     * @returns
     */
    function answerVideoSession(lineNumber) {
        const lineObj = findLineByNumber(lineNumber);
        if (lineObj == null) {
            console.warn('Failed to get line (' + lineNumber + ')');
            return;
        }
        const session = lineObj.sipSession;
        if (!session || session instanceof Inviter)
            return;
        // Stop the ringtone
        if (session.data.ringerObj) {
            session.data.ringerObj.pause();
            session.data.ringerObj.removeAttribute('src');
            session.data.ringerObj.load();
            session.data.ringerObj = null;
        }
        // Check vitals
        if (!hasAudioDevice) {
            alert('lang.alert_no_microphone');
            return;
        }
        // Start SIP handling
        const spdOptions = answerVideoSpdOptions();
        // Save Devices
        session.data.withVideo = true;
        session.data.videoSourceDevice = configs.media.videoInputDeviceId;
        session.data.audioSourceDevice = configs.media.audioInputDeviceId;
        session.data.audioOutputDevice = configs.media.audioOutputDeviceId;
        // Send Answer
        session
            .accept(spdOptions)
            .then(function () {
            onInviteAccepted(lineObj, true);
        })
            .catch(function (error) {
            console.warn('Failed to answer call', error, session);
            session.data.reasonCode = 500;
            session.data.reasonText = 'Client Error';
            teardownSession(lineObj);
        });
        updateLine(lineObj);
    }
    /**
     * Handle outbound video calls
     * @param lineObj
     * @param dialledNumber
     * @param extraHeaders
     * @returns
     */
    function makeVideoSession(lineObj, dialledNumber, extraHeaders) {
        if (userAgent == null)
            return;
        if (!userAgent.isRegistered())
            return;
        if (lineObj == null)
            return;
        if (!hasAudioDevice) {
            alert('lang.alert_no_microphone');
            return;
        }
        if (hasVideoDevice == false) {
            console.warn('No video devices (webcam) found, switching to audio call.');
            makeAudioSession(lineObj, dialledNumber);
            return;
        }
        const spdOptions = makeVideoSpdOptions({ extraHeaders });
        if (!spdOptions)
            return;
        const startTime = dayJs.utc();
        // Invite
        console.log('INVITE (video): ' + dialledNumber + '@' + configs.account.domain);
        const targetURI = UserAgent.makeURI('sip:' + dialledNumber.replace(/#/g, '%23') + '@' + configs.account.domain);
        console.log('video', { spdOptions });
        lineObj.sipSession = new Inviter(userAgent, targetURI, spdOptions);
        lineObj.sipSession.data = {};
        lineObj.sipSession.data.line = lineObj.lineNumber;
        lineObj.sipSession.data.metaData = lineObj?.metaData;
        lineObj.sipSession.data.callDirection = 'outbound';
        lineObj.sipSession.data.dialledNumber = dialledNumber;
        lineObj.sipSession.data.callstart = startTime.format('YYYY-MM-DD HH:mm:ss UTC');
        lineObj.sipSession.data.videoSourceDevice = configs.media.videoInputDeviceId;
        lineObj.sipSession.data.audioSourceDevice = configs.media.audioInputDeviceId;
        lineObj.sipSession.data.audioOutputDevice = configs.media.audioOutputDeviceId;
        lineObj.sipSession.data.terminateBy = 'them';
        lineObj.sipSession.data.withVideo = true;
        lineObj.sipSession.data.earlyReject = false;
        lineObj.sipSession.isOnHold = false;
        lineObj.sipSession.delegate = {
            onBye: function (sip) {
                onSessionReceivedBye(lineObj, sip, () => teardownSession(lineObj));
            },
            onMessage: function (sip) {
                onSessionReceivedMessage(lineObj, sip);
            },
            onInvite: function (sip) {
                onSessionReinvited(lineObj, sip);
            },
            onSessionDescriptionHandler: function (sdh, provisional) {
                onSessionDescriptionHandlerCreated(lineObj, sdh, provisional, true);
            },
        };
        const inviterOptions = {
            requestDelegate: {
                // OutgoingRequestDelegate
                onTrying: function (sip) {
                    onInviteTrying(lineObj, sip);
                },
                onProgress: function (sip) {
                    onInviteProgress(lineObj, sip);
                },
                onRedirect: function (sip) {
                    onInviteRedirected(lineObj, sip);
                },
                onAccept: function (sip) {
                    onInviteAccepted(lineObj, true, sip);
                },
                onReject: function (sip) {
                    onInviteRejected(lineObj, sip, () => teardownSession(lineObj));
                },
            },
        };
        lineObj.sipSession.invite(inviterOptions).catch(function (e) {
            console.warn('Failed to send INVITE:', e);
        });
        // updateLine(lineObj);
        // TODO  #SH ui integration
        // $('#line-' + lineObj.LineNumber + '-btn-settings').removeAttr('disabled');
        // $('#line-' + lineObj.LineNumber + '-btn-audioCall').prop('disabled', 'disabled');
        // $('#line-' + lineObj.LineNumber + '-btn-videoCall').prop('disabled', 'disabled');
        // $('#line-' + lineObj.LineNumber + '-btn-search').removeAttr('disabled');
        // $('#line-' + lineObj.LineNumber + '-progress').show();
        // $('#line-' + lineObj.LineNumber + '-msg').show();
        // UpdateUI();
        // UpdateBuddyList();
        // updateLineScroll(lineObj.LineNumber);
    }
    /**
     * Handle reject calls
     * @param lineNumber
     * @returns
     */
    function rejectCall(lineNumber) {
        const lineObj = findLineByNumber(lineNumber);
        if (lineObj == null) {
            console.warn('Unable to find line (' + lineNumber + ')');
            return;
        }
        const session = lineObj.sipSession;
        if (!session || session instanceof Inviter)
            return;
        if (session.state == SessionState.Established) {
            session.bye().catch(function (e) {
                console.warn('Problem in rejectCall(), could not bye() call', e, session);
            });
        }
        else {
            session
                .reject({
                statusCode: 486,
                reasonPhrase: 'Busy Here',
            })
                .catch(function (e) {
                console.warn('Problem in rejectCall(), could not reject() call', e, session);
            });
        }
        session.data.terminateBy = 'us';
        session.data.reasonCode = 486;
        session.data.reasonText = 'Busy Here';
        teardownSession(lineObj);
    }
    /**
     * Handle Dial User By Line Number
     * @param type
     * @param dialNumber
     * @param metaData
     * @param extraHeaders
     * @returns
     */
    function dialByLine(type, dialNumber, metaData, extraHeaders) {
        if (userAgent == null || userAgent.isRegistered() == false) {
            // onError //TODO #SH
            alert('userAgent not registered');
            return;
        }
        // if (EnableAlphanumericDial) {
        //   numDial = numDial.replace(telAlphanumericRegEx, "").substring(0, MaxDidLength);
        // } else {
        //   numDial = numDial.replace(telNumericRegEx, "").substring(0, MaxDidLength);
        // }
        // if (numDial.length == 0) {
        //   console.warn("Enter number to dial");
        //   return;
        // }
        // Create a Buddy if one is not already existing
        // Create a Line
        const lineObj = new Line(getNewLineNumber(), dialNumber, metaData ?? {});
        // Start Call Invite
        if (type === 'audio') {
            makeAudioSession(lineObj, dialNumber, extraHeaders);
        }
        else {
            makeVideoSession(lineObj, dialNumber, extraHeaders ?? []);
        }
        addLine(lineObj);
    }
    /* -------------------------------------------------------------------------- */
    /*                        In-Session Call Functionality                       */
    /*                           HOLD/MUTE/END/TRANSFER                           */
    /* -------------------------------------------------------------------------- */
    /* ------------------------------- HOLD/UNHOLD ------------------------------ */
    /**
     * Hold Call Session
     * @param lineNumber
     * @returns
     */
    function holdSession(lineNumber) {
        const lineObj = findLineByNumber(lineNumber);
        if (lineObj == null || lineObj.sipSession == null)
            return;
        const session = lineObj.sipSession;
        if (session.isOnHold == true) {
            console.log('Call is already on hold:', lineNumber);
            return;
        }
        console.log('Putting Call on hold:', lineNumber);
        session.isOnHold = true;
        const sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
        sessionDescriptionHandlerOptions.hold = true;
        session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;
        const options = {
            requestDelegate: {
                onAccept: function () {
                    if (session &&
                        session.sessionDescriptionHandler &&
                        session.sessionDescriptionHandler.peerConnection) {
                        const pc = session.sessionDescriptionHandler.peerConnection;
                        // Stop all the inbound streams
                        pc.getReceivers().forEach(function (RTCRtpReceiver) {
                            if (RTCRtpReceiver.track)
                                RTCRtpReceiver.track.enabled = false;
                        });
                        // Stop all the outbound streams (especially useful for Conference Calls!!)
                        pc.getSenders().forEach(function (RTCRtpSender) {
                            // Mute Audio
                            const track = RTCRtpSender.track;
                            if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
                                if (track.IsMixedTrack == true) {
                                    if (session.data.audioSourceTrack &&
                                        session.data.audioSourceTrack.kind == 'audio') {
                                        console.log('Muting Mixed Audio Track : ' + session.data.audioSourceTrack.label);
                                        session.data.audioSourceTrack.enabled = false;
                                    }
                                }
                                console.log('Muting Audio Track : ' + track.label);
                                track.enabled = false;
                            }
                            // Stop Video
                            else if (track && track.kind == 'video') {
                                track.enabled = false;
                            }
                        });
                    }
                    session.isOnHold = true;
                    console.log('Call is is on hold:', lineNumber);
                    // Log Hold
                    if (!session.data.hold)
                        session.data.hold = [];
                    session.data.hold.push({ event: 'hold', eventTime: utcDateNow() });
                    session.data.isHold = true;
                    // updateLineScroll(lineNumber);
                    // Custom Web hook
                },
                onReject: function () {
                    session.isOnHold = false;
                    console.warn('Failed to put the call on hold:', lineNumber);
                },
            },
        };
        session.invite(options).catch(function (error) {
            session.isOnHold = false;
            console.warn('Error attempting to put the call on hold:', error);
        });
        updateLine(lineObj);
    }
    /**
     * Un-Hold Call Session
     * @param lineNumber
     * @returns
     */
    function unholdSession(lineNumber) {
        const lineObj = findLineByNumber(lineNumber);
        if (lineObj == null || lineObj.sipSession == null)
            return;
        const session = lineObj.sipSession;
        if (session.isOnHold == false) {
            console.log('Call is already off hold:', lineNumber);
            return;
        }
        console.log('Taking call off hold:', lineNumber);
        session.isOnHold = false;
        const sessionDescriptionHandlerOptions = session.sessionDescriptionHandlerOptionsReInvite;
        sessionDescriptionHandlerOptions.hold = false;
        session.sessionDescriptionHandlerOptionsReInvite = sessionDescriptionHandlerOptions;
        const options = {
            requestDelegate: {
                onAccept: function () {
                    if (session &&
                        session.sessionDescriptionHandler &&
                        session.sessionDescriptionHandler.peerConnection) {
                        const pc = session.sessionDescriptionHandler.peerConnection;
                        // Restore all the inbound streams
                        pc.getReceivers().forEach(function (RTCRtpReceiver) {
                            if (RTCRtpReceiver.track)
                                RTCRtpReceiver.track.enabled = true;
                        });
                        // Restore all the outbound streams
                        pc.getSenders().forEach(function (RTCRtpSender) {
                            // Unmute Audio
                            const track = RTCRtpSender.track;
                            if (track && track.kind == 'audio') {
                                if (track.IsMixedTrack == true) {
                                    if (session.data.audioSourceTrack &&
                                        session.data.audioSourceTrack.kind == 'audio') {
                                        console.log('Unmuting Mixed Audio Track : ' + session.data.audioSourceTrack.label);
                                        session.data.audioSourceTrack.enabled = true;
                                    }
                                }
                                console.log('Unmuting Audio Track : ' + track.label);
                                track.enabled = true;
                            }
                            else if (track && track.kind == 'video') {
                                track.enabled = true;
                            }
                        });
                    }
                    session.isOnHold = false;
                    console.log('Call is off hold:', lineNumber);
                    // Log Hold
                    if (!session.data.hold)
                        session.data.hold = [];
                    session.data.hold.push({ event: 'unhold', eventTime: utcDateNow() });
                    session.data.isHold = false;
                    // updateLineScroll(lineNumber);
                },
                onReject: function () {
                    session.isOnHold = true;
                    console.warn('Failed to put the call on hold', lineNumber);
                },
            },
        };
        session.invite(options).catch(function (error) {
            session.isOnHold = true;
            console.warn('Error attempting to take to call off hold', error);
        });
        updateLine(lineObj);
    }
    /* ------------------------------- MUTE/UNMUTE ------------------------------ */
    /**
     * Mute Call Session
     * @param lineNumber
     * @returns
     */
    function muteSession(lineNumber) {
        const lineObj = findLineByNumber(lineNumber);
        if (lineObj == null || lineObj.sipSession == null)
            return;
        // $('#line-' + lineNum + '-btn-Unmute').show();
        // $('#line-' + lineNum + '-btn-Mute').hide();
        const session = lineObj.sipSession;
        const pc = session.sessionDescriptionHandler.peerConnection;
        pc.getSenders().forEach(function (RTCRtpSender) {
            if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
                const track = RTCRtpSender.track;
                if (track.IsMixedTrack == true) {
                    if (session.data.audioSourceTrack && session.data.audioSourceTrack.kind == 'audio') {
                        console.log('Muting Mixed Audio Track : ' + session.data.audioSourceTrack.label);
                        session.data.audioSourceTrack.enabled = false;
                    }
                }
                console.log('Muting Audio Track : ' + track.label);
                track.enabled = false;
            }
        });
        if (!session.data.mute)
            session.data.mute = [];
        session.data.mute.push({ event: 'mute', eventTime: utcDateNow() });
        session.data.isMute = true;
        // $('#line-' + lineNum + '-msg').html(lang.call_on_mute);
        // updateLineScroll(lineNumber);
        updateLine(lineObj);
    }
    /**
     * Un-Mute Call Session
     * @param lineNumber
     * @returns
     */
    function unmuteSession(lineNumber) {
        const lineObj = findLineByNumber(lineNumber);
        if (lineObj == null || lineObj.sipSession == null)
            return;
        // $('#line-' + lineNum + '-btn-Unmute').hide();
        // $('#line-' + lineNum + '-btn-Mute').show();
        const session = lineObj.sipSession;
        const pc = session.sessionDescriptionHandler.peerConnection;
        pc.getSenders().forEach(function (RTCRtpSender) {
            if (RTCRtpSender.track && RTCRtpSender.track.kind == 'audio') {
                const track = RTCRtpSender.track;
                if (track.IsMixedTrack == true) {
                    if (session.data.audioSourceTrack && session.data.audioSourceTrack.kind == 'audio') {
                        console.log('Unmuting Mixed Audio Track : ' + session.data.audioSourceTrack.label);
                        session.data.audioSourceTrack.enabled = true;
                    }
                }
                console.log('Unmuting Audio Track : ' + track.label);
                track.enabled = true;
            }
        });
        if (!session.data.mute)
            session.data.mute = [];
        session.data.mute.push({ event: 'unmute', eventTime: utcDateNow() });
        session.data.isMute = false;
        // $('#line-' + lineNum + '-msg').html(lang.call_off_mute);
        // updateLineScroll(lineNumber);
        // Custom Web hook
        // if (typeof web_hook_on_modify !== 'undefined') web_hook_on_modify('unmute', session);
        updateLine(lineObj);
    }
    /* ------------------------------- CANCEL/END/TEARDOWN ------------------------------- */
    /**
     * Cancle And Terminate Call Session
     * @param lineNumber
     * @returns
     */
    function cancelSession(lineNumber) {
        const lineObj = findLineByNumber(lineNumber);
        if (lineObj == null || lineObj.sipSession == null)
            return;
        const session = lineObj.sipSession;
        if (!(session instanceof Inviter))
            return;
        session.data.terminateBy = 'us';
        session.data.reasonCode = 0;
        session.data.reasonText = 'Call Cancelled';
        console.log('Cancelling session : ' + lineNumber);
        if (session.state == SessionState.Initial || session.state == SessionState.Establishing) {
            session.cancel();
        }
        else {
            console.warn('Session not in correct state for cancel.', lineObj.sipSession.state);
            console.log('Attempting teardown : ' + lineNumber);
            teardownSession(lineObj);
        }
    }
    /**
     * Terminate Call Session Based on Session State
     * @param lineNumber
     * @returns
     */
    function endSession(lineNumber) {
        const lineObj = findLineByNumber(lineNumber);
        if (lineObj == null) {
            console.warn('Unable to find line (' + lineNumber + ')');
            return;
        }
        const session = lineObj.sipSession;
        if (!session)
            return;
        switch (session.state) {
            case SessionState.Initial:
            case SessionState.Establishing:
                if (session instanceof Inviter) {
                    // An unestablished outgoing session
                    session.data.terminateBy = 'us';
                    session.data.reasonCode = 0;
                    session.data.reasonText = 'Call Cancelled';
                    session.cancel();
                }
                else {
                    // An unestablished incoming session
                    session
                        .reject({
                        statusCode: 486,
                        reasonPhrase: 'Busy Here',
                    })
                        .catch(function (e) {
                        console.warn('Problem in rejectCall(), could not reject() call', e, session);
                    });
                    session.data.terminateBy = 'us';
                    session.data.reasonCode = 486;
                    session.data.reasonText = 'Busy Here';
                    teardownSession(lineObj);
                }
                break;
            case SessionState.Established:
                session.bye().catch(function (e) {
                    console.warn('Problem in rejectCall(), could not bye() call', e, session);
                });
                session.data.terminateBy = 'us';
                session.data.reasonCode = 486;
                session.data.reasonText = 'Busy Here';
                teardownSession(lineObj);
                break;
            default:
                console.warn('Session not in correct state for cancel.', session.state);
                console.log('Attempting teardown : ' + lineNumber);
                teardownSession(lineObj);
                break;
        }
    }
    /**
     * Teardown Call Session Based on Line
     * @param lineObj
     * @returns
     */
    function teardownSession(lineObj) {
        if (lineObj == null || lineObj.sipSession == null)
            return;
        const session = lineObj.sipSession;
        if (session.data.teardownComplete == true)
            return;
        session.data.teardownComplete = true; // Run this code only once
        // End any child calls
        if (session.data.childsession) {
            session.data.childsession
                .dispose()
                .then(function () {
                session.data.childsession = null;
            })
                .catch(function (error) {
                console.error('teardownSession', { error });
                session.data.childsession = null;
                // Suppress message
            });
        }
        // Mixed Tracks
        if (session.data.audioSourceTrack && session.data.audioSourceTrack.kind == 'audio') {
            session.data.audioSourceTrack.stop();
            session.data.audioSourceTrack = null;
        }
        // Stop any Early Media
        if (session.data.earlyMedia) {
            session.data.earlyMedia.pause();
            session.data.earlyMedia.removeAttribute('src');
            session.data.earlyMedia.load();
            session.data.earlyMedia = null;
        }
        // Stop any ringing calls
        if (session.data.ringerObj) {
            session.data.ringerObj.pause();
            session.data.ringerObj.removeAttribute('src');
            session.data.ringerObj.load();
            session.data.ringerObj = null;
        }
        // Stop Recording if we are TODO #SH
        //   StopRecording(lineObj.LineNumber, true);
        // Audio Meters
        if (lineObj.localSoundMeter !== null) {
            lineObj.localSoundMeter.stop();
            lineObj.localSoundMeter = null;
        }
        if (lineObj.remoteSoundMeter !== null) {
            lineObj.remoteSoundMeter.stop();
            lineObj.remoteSoundMeter = null;
        }
        // Make sure you have released the microphone
        if (session &&
            session.sessionDescriptionHandler &&
            session.sessionDescriptionHandler?.peerConnection) {
            const pc = session.sessionDescriptionHandler.peerConnection;
            pc.getSenders().forEach(function (RTCRtpSender) {
                if (RTCRtpSender?.track?.kind == 'audio') {
                    RTCRtpSender.track.stop();
                }
            });
        }
        // End timers TODO #SH
        //   window.clearInterval(session.data.videoResampleInterval);
        // Add to stream
        //   AddCallMessage(lineObj?.BuddyObj?.identity, session); TODO #SH
        // Check if this call was missed
        if (session.data.callDirection == 'inbound') {
            if (session.data.earlyReject) ;
            else if (session.data.terminateBy == 'them' && session.data.startTime == null) {
                // Call Terminated by them during ringing
                if (session.data.reasonCode == 0) ;
            }
        }
        // Close up the UI
        //   window.setTimeout(function () {
        //     RemoveLine(lineObj);
        //   }, 1000);
        //   UpdateBuddyList();
        //   if (session.data.earlyReject != true) {
        //     UpdateUI();
        //   }
        removeLine(lineObj.lineNumber);
    }
    /* -------------------------------- TRANSFER -------------------------------- */
    /**
     * Start Transfer Call Session
     * @param lineNumber
     */
    function startTransferSession(lineNumber) {
        // if ($('#line-' + lineNum + '-btn-CancelConference').is(':visible')) { //TODO #SH
        //   CancelConference(lineNumber);
        //   return;
        // }
        // $('#line-' + lineNum + '-btn-Transfer').hide();
        // $('#line-' + lineNum + '-btn-CancelTransfer').show();
        holdSession(lineNumber);
        // $('#line-' + lineNum + '-txt-FindTransferBuddy').val('');
        // $('#line-' + lineNum + '-txt-FindTransferBuddy')
        //   .parent()
        //   .show();
        // $('#line-' + lineNum + '-session-avatar').css('width', '50px');
        // $('#line-' + lineNum + '-session-avatar').css('height', '50px');
        // RestoreCallControls(lineNumber);
        // $('#line-' + lineNum + '-btn-blind-transfer').show();
        // $('#line-' + lineNum + '-btn-attended-transfer').show();
        // $('#line-' + lineNum + '-btn-complete-transfer').hide();
        // $('#line-' + lineNum + '-btn-cancel-transfer').hide();
        // $('#line-' + lineNum + '-btn-complete-attended-transfer').hide();
        // $('#line-' + lineNum + '-btn-cancel-attended-transfer').hide();
        // $('#line-' + lineNum + '-btn-terminate-attended-transfer').hide();
        // $('#line-' + lineNum + '-transfer-status').hide();
        // $('#line-' + lineNum + '-Transfer').show();
        // updateLineScroll(lineNumber); TODO #SH
    }
    /**
     * Cancel Transfer Call Session
     * @param lineNumber
     * @returns
     */
    function cancelTransferSession(lineNumber) {
        const lineObj = findLineByNumber(lineNumber);
        console.log('cancelTransferSession', { lineObj });
        if (lineObj == null || lineObj.sipSession == null) {
            console.warn('Null line or session');
            return;
        }
        const session = lineObj.sipSession;
        if (session.data.childsession) {
            console.log('Child Transfer call detected:', session.data.childsession.state);
            session.data.childsession
                .dispose()
                .then(function () {
                session.data.childsession = null;
            })
                .catch(function (error) {
                console.error('cancelTransferSession', { error });
                session.data.childsession = null;
                // Suppress message
            });
        }
        // $("#line-" + lineNum + "-session-avatar").css("width", "");
        // $("#line-" + lineNum + "-session-avatar").css("height", "");
        // $("#line-" + lineNum + "-btn-Transfer").show();
        // $("#line-" + lineNum + "-btn-CancelTransfer").hide();
        unholdSession(lineNumber);
        // $("#line-" + lineNum + "-Transfer").hide();
        // updateLineScroll(lineNumber);
        updateLine(lineObj);
    }
    /**
     * Attend Transfer Call Session
     * @param baseLine
     * @param transferLineNumber
     * @returns
     */
    function attendedTransferSession(baseLine, transferLineNumber) {
        if (userAgent == null)
            return;
        if (!userAgent.isRegistered())
            return;
        const dstNo = String(transferLineNumber);
        if (dstNo === '') {
            console.warn('Cannot transfer, no number');
            return;
        }
        let lineObj = baseLine;
        console.log('attendedTransfer lineNumber', userAgent.isRegistered(), dstNo, lineObj);
        if (!lineObj?.sipSession) {
            console.warn('Null line or session');
            return;
        }
        const session = lineObj.sipSession;
        if (!session)
            return;
        if (!session.data.transfer)
            session.data.transfer = [];
        session.data.transfer.push({
            type: 'Attended',
            to: transferLineNumber,
            transferTime: utcDateNow(),
            disposition: 'invite',
            dispositionTime: utcDateNow(),
            accept: {
                complete: null,
                eventTime: null,
                disposition: '',
            },
        });
        const transferId = session.data.transfer.length - 1;
        // SDP options
        const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
        const spdOptions = {
            earlyMedia: true,
            sessionDescriptionHandlerOptions: {
                constraints: {
                    audio: { deviceId: 'default' },
                    video: false,
                },
            },
        };
        console.log('attend1');
        if (typeof spdOptions.sessionDescriptionHandlerOptions.constraints.audio !== 'object')
            return; // type checking assurance
        if (session.data.audioSourceDevice && session.data.audioSourceDevice != 'default') {
            spdOptions.sessionDescriptionHandlerOptions.constraints.audio.deviceId = {
                exact: session.data.audioSourceDevice,
            };
        }
        // Add additional Constraints
        if (supportedConstraints.autoGainControl) {
            spdOptions.sessionDescriptionHandlerOptions.constraints.audio.autoGainControl =
                configs.media.autoGainControl;
        }
        if (supportedConstraints.echoCancellation) {
            spdOptions.sessionDescriptionHandlerOptions.constraints.audio.echoCancellation =
                configs.media.echoCancellation;
        }
        if (supportedConstraints.noiseSuppression) {
            spdOptions.sessionDescriptionHandlerOptions.constraints.audio.noiseSuppression =
                configs.media.noiseSuppression;
        }
        // Not sure if its possible to transfer a Video call???
        if (session.data.withVideo) {
            spdOptions.sessionDescriptionHandlerOptions.constraints.video = {};
            const video = spdOptions.sessionDescriptionHandlerOptions.constraints
                .video;
            if (session.data.videoSourceDevice && session.data.videoSourceDevice != 'default') {
                video.deviceId = {
                    exact: session.data.videoSourceDevice,
                };
            }
            // Add additional Constraints
            if (supportedConstraints.frameRate && configs.media.maxFrameRate !== '') {
                video.frameRate = String(configs.media.maxFrameRate);
            }
            if (supportedConstraints.height && configs.media.videoHeight != '') {
                video.height = String(configs.media.videoHeight);
            }
            if (supportedConstraints.aspectRatio && configs.media.videoAspectRatio != '') {
                video.aspectRatio = String(configs.media.videoAspectRatio);
            }
            if ((typeof spdOptions.sessionDescriptionHandlerOptions.constraints.video === 'object' &&
                Object.keys(spdOptions.sessionDescriptionHandlerOptions.constraints.video)?.length ==
                    0) ||
                typeof spdOptions.sessionDescriptionHandlerOptions.constraints.video === 'boolean')
                spdOptions.sessionDescriptionHandlerOptions.constraints.video = true;
        }
        // Create new call session
        console.log(555, 'TRANSFER INVITE: ', 'sip:' + dstNo + '@' + configs.account.domain, spdOptions);
        const targetURI = UserAgent.makeURI('sip:' + dstNo.replace(/#/g, '%23') + '@' + configs.account.domain);
        const newSession = new Inviter(userAgent, targetURI, spdOptions);
        newSession.data = {};
        newSession.delegate = {
            onBye: function () {
                console.log('New call session ended with BYE');
                if (session.data.transfer) {
                    session.data.transfer[transferId].disposition = 'bye';
                    session.data.transfer[transferId].dispositionTime = utcDateNow();
                }
            },
            onSessionDescriptionHandler: function (sdh) {
                onTransferSessionDescriptionHandlerCreated(lineObj, session, sdh, session?.data?.withVideo);
            },
        };
        session.data.childsession = newSession;
        const inviterOptions = {
            requestDelegate: {
                onTrying: function () {
                    if (!session.data.transfer)
                        return;
                    session.data.transfer[transferId].disposition = 'trying';
                    session.data.transfer[transferId].dispositionTime = utcDateNow();
                },
                onProgress: function () {
                    console.log('onProgress');
                    if (!session.data.transfer)
                        return;
                    session.data.transfer[transferId].disposition = 'progress';
                    session.data.transfer[transferId].dispositionTime = utcDateNow();
                    session.data.transfer[transferId].onCancle = () => {
                        newSession.cancel().catch(function (error) {
                            console.warn('Failed to CANCEL', error);
                        });
                        if (!session.data.transfer)
                            return;
                        session.data.transfer[transferId].accept.complete = false;
                        session.data.transfer[transferId].accept.disposition = 'cancel';
                        session.data.transfer[transferId].accept.eventTime = utcDateNow();
                    };
                    console.log('New call session canceled');
                },
                onRedirect: function (sip) {
                    console.log('Redirect received:', sip);
                },
                onAccept: function () {
                    if (!session.data.transfer)
                        return;
                    // newCallStatus.html(lang.call_in_progress);
                    // $('#line-' + lineNum + '-btn-cancel-attended-transfer').hide();
                    session.data.transfer[transferId].disposition = 'accepted';
                    session.data.transfer[transferId].dispositionTime = utcDateNow();
                    const transferOptions = {
                        requestDelegate: {
                            onAccept: function (sip) {
                                console.log('Attended transfer Accepted');
                                if (!session.data.transfer)
                                    return;
                                session.data.terminateBy = 'us';
                                session.data.reasonCode = 202;
                                session.data.reasonText = 'Attended Transfer';
                                session.data.transfer[transferId].accept.complete = true;
                                session.data.transfer[transferId].accept.disposition =
                                    sip.message.reasonPhrase ?? '';
                                session.data.transfer[transferId].accept.eventTime = utcDateNow();
                                // We must end this session manually
                                session.bye().catch(function (error) {
                                    console.warn('Could not BYE after blind transfer:', error);
                                });
                                teardownSession(lineObj);
                            },
                            onReject: function (sip) {
                                console.warn('Attended transfer rejected:', sip);
                                if (!session.data.transfer)
                                    return;
                                session.data.transfer[transferId].accept.complete = false;
                                session.data.transfer[transferId].accept.disposition =
                                    sip.message.reasonPhrase ?? '';
                                session.data.transfer[transferId].accept.eventTime = utcDateNow();
                            },
                        },
                    };
                    // Send REFER
                    session.refer(newSession, transferOptions).catch(function (error) {
                        console.warn('Failed to REFER', error);
                    });
                },
                onReject: function (sip) {
                    if (!session.data.transfer)
                        return;
                    console.log('New call session rejected: ', sip.message.reasonPhrase);
                    session.data.transfer[transferId].disposition = sip.message.reasonPhrase ?? '';
                    session.data.transfer[transferId].dispositionTime = utcDateNow();
                },
            },
        };
        newSession.invite(inviterOptions).catch(function (e) {
            console.warn('Failed to send INVITE:', e);
        });
        updateLine(lineObj);
    }
    // function BlindTransfer(lineNumber) {
    //   var dstNo = $("#line-" + lineNum + "-txt-FindTransferBuddy").val();
    //   if (EnableAlphanumericDial) {
    //     dstNo = dstNo.replace(telAlphanumericRegEx, "").substring(0, MaxDidLength);
    //   } else {
    //     dstNo = dstNo.replace(telNumericRegEx, "").substring(0, MaxDidLength);
    //   }
    //   if (dstNo == "") {
    //     console.warn("Cannot transfer, no number");
    //     return;
    //   }
    //   var lineObj = FindLineByNumber(lineNumber);
    //   if (lineObj == null || lineObj.sipSession == null) {
    //     console.warn("Null line or session");
    //     return;
    //   }
    //   var session = lineObj.sipSession;
    //   if (!session.data.transfer) session.data.transfer = [];
    //   session.data.transfer.push({
    //     type: "Blind",
    //     to: dstNo,
    //     transferTime: utcDateNow(),
    //     disposition: "refer",
    //     dispositionTime: utcDateNow(),
    //     accept: {
    //       complete: null,
    //       eventTime: null,
    //       disposition: "",
    //     },
    //   });
    //   var transferId = session.data.transfer.length - 1;
    //   var transferOptions = {
    //     requestDelegate: {
    //       onAccept: function (sip) {
    //         console.log("Blind transfer Accepted");
    //         session.data.terminateBy = "us";
    //         session.data.reasonCode = 202;
    //         session.data.reasonText = "Transfer";
    //         session.data.transfer[transferId].accept.complete = true;
    //         session.data.transfer[transferId].accept.disposition = sip.message.reasonPhrase;
    //         session.data.transfer[transferId].accept.eventTime = utcDateNow();
    //         // TODO: use lang pack
    //         $("#line-" + lineNum + "-msg").html("Call Blind Transferred (Accepted)");
    //         updateLineScroll(lineNumber);
    //         session.bye().catch(function (error) {
    //           console.warn("Could not BYE after blind transfer:", error);
    //         });
    //         teardownSession(lineObj);
    //       },
    //       onReject: function (sip) {
    //         console.warn("REFER rejected:", sip);
    //         session.data.transfer[transferId].accept.complete = false;
    //         session.data.transfer[transferId].accept.disposition = sip.message.reasonPhrase;
    //         session.data.transfer[transferId].accept.eventTime = utcDateNow();
    //         $("#line-" + lineNum + "-msg").html("Call Blind Failed!");
    //         updateLineScroll(lineNumber);
    //         // Session should still be up, so just allow them to try again
    //       },
    //     },
    //   };
    //   console.log("REFER: ", dstNo + "@" + sipDomain);
    //   var referTo = SIP.UserAgent.makeURI("sip:" + dstNo.replace(/#/g, "%23") + "@" + sipDomain);
    //   session.refer(referTo, transferOptions).catch(function (error) {
    //     console.warn("Failed to REFER", error);
    //   });
    //   $("#line-" + lineNum + "-msg").html(lang.call_blind_transfered);
    //   updateLineScroll(lineNumber);
    // }
    //
    // Cancel Attend Transfer Call Session
    /**
     * Cancel Transfered Call Session
     * @param baseLine
     * @param transferLineNumber
     * @returns
     */
    function cancelAttendedTransferSession(baseLine, transferLineNumber) {
        if (userAgent == null)
            return;
        if (!userAgent.isRegistered())
            return;
        const dstNo = String(transferLineNumber);
        if (dstNo === '') {
            console.warn('Cannot transfer, no number');
            return;
        }
        let lineObj = baseLine;
        console.log('attendedTransfer lineNumber', userAgent.isRegistered(), dstNo, lineObj);
        if (!lineObj?.sipSession) {
            console.warn('Null line or session');
            return;
        }
        const session = lineObj.sipSession;
        if (!session)
            return;
        if (!session.data.transfer)
            return;
        session.data.transfer.forEach((transfer) => {
            if (transfer.to === transferLineNumber)
                transfer.onCancle?.();
        });
        // updateLine(lineObj);
    }
    /* -------------------------------------------------------------------------- */
    return {
        receiveCall,
        answerAudioSession,
        answerVideoSession,
        makeAudioSession,
        makeVideoSession,
        rejectCall,
        dialByLine,
        endSession,
        holdSession,
        unholdSession,
        muteSession,
        unmuteSession,
        cancelSession,
        startTransferSession,
        cancelTransferSession,
        attendedTransferSession,
        cancelAttendedTransferSession,
        teardownSession,
    };
};

/* -------------------------------------------------------------------------- */
// Detect Devices
function detectDevices(callback) {
    navigator.mediaDevices
        .enumerateDevices()
        .then(function (deviceInfos) {
        // deviceInfos will not have a populated lable unless to accept the permission
        // during getUserMedia. This normally happens at startup/setup
        // so from then on these devices will be with lables.
        // deviceInfos.map((deviceInfo) => {
        //   console.log({ audiooutput: deviceInfo.kind });
        // });
        callback(deviceInfos);
    })
        .catch(function (e) {
        console.error('Error enumerating devices', e);
    });
}
/* -------------------------------------------------------------------------- */
async function getMediaPermissions(media) {
    const defaultPermissions = {
        audio: false, //  Microphone
        video: false, //  Camera
    };
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            ...defaultPermissions,
            ...(media && { [media]: true }),
        });
        console.log('Media stream obtained:', { stream });
        return stream;
    }
    catch (error) {
        if (error.name === 'NotAllowedError') {
            console.error('Permissions denied by the user.');
        }
        else if (error.name === 'NotFoundError') {
            console.error('No media devices found.');
        }
        else if (error.name === 'OverconstrainedError') {
            console.error('Constraints cannot be satisfied by available devices.');
        }
        else {
            console.error('Unknown error:', error);
        }
        throw error;
    }
}

const SipContext = createContext(undefined);
const SipProvider = ({ children, configs }) => {
    const userAgent = useSipStore((state) => state.userAgent);
    const lines = useSipStore((state) => state.lines);
    const setSipStore = useSipStore((state) => state.setSipStore);
    const hasAudioDevice = useSipStore((state) => state.devicesInfo.hasAudioDevice);
    const hasSpeakerDevice = useSipStore((state) => state.devicesInfo.hasSpeakerDevice);
    const hasVideoDevice = useSipStore((state) => state.devicesInfo.hasVideoDevice);
    const audioInputDevices = useSipStore((state) => state.devicesInfo.audioInputDevices);
    const videoInputDevices = useSipStore((state) => state.devicesInfo.videoInputDevices);
    const speakerDevices = useSipStore((state) => state.devicesInfo.speakerDevices);
    const mergedConfigs = useMemo(() => deepMerge(defaultSipConfigs, configs), [configs]);
    const methods = useSessionMethods();
    const events = useSessionEvents();
    useEffect(() => {
        setSipStore({ configs: mergedConfigs });
        (async function () {
            await initialize();
        })();
        return () => {
            userAgent?.stop();
        };
    }, [mergedConfigs]);
    const initialize = async () => {
        // Get Audio Access Permission
        await getMediaPermissions('audio');
        // User Connected Devices Detection
        initiateDetectedDevices();
        // Create user agent for SIP connection
        createUserAgent();
    };
    // Create user agent for SIP connection
    const createUserAgent = useCallback(() => {
        let ua = new UserAgent({
            uri: UserAgent.makeURI(`sip:${mergedConfigs.account.username}@${mergedConfigs.account.domain}`),
            transportOptions: {
                server: `wss://${mergedConfigs.account.wssServer}:${mergedConfigs.account.webSocketPort}${mergedConfigs.account.serverPath}`,
                traceSip: false,
                connectionTimeout: mergedConfigs.registration.transportConnectionTimeout,
            },
            authorizationUsername: mergedConfigs.account.username,
            authorizationPassword: mergedConfigs.account.password,
            delegate: {
                onInvite: methods.receiveCall,
                onMessage: () => console.log('Received message'), //TODO ReceiveOutOfDialogMessage
            },
        });
        // Setting custom properties and methods for userAgent
        ua.isRegistered = function () {
            return ua && ua.registerer && ua.registerer.state === RegistererState.Registered;
        };
        ua.sessions = ua._sessions; // Assign sessions
        ua.registrationCompleted = false;
        ua.registering = false;
        ua.transport.reconnectionAttempts =
            mergedConfigs.registration.transportReconnectionAttempts || 0;
        ua.transport.attemptingReconnection = false;
        ua.BlfSubs = [];
        ua.lastVoicemailCount = 0;
        // Handle the transport connection states
        ua.transport.onConnect = () => {
            onTransportConnected(ua);
        };
        ua.transport.onDisconnect = (error) => {
            if (error) {
                onTransportConnectError(error, ua);
            }
            else {
                onTransportDisconnected(ua);
            }
        };
        const RegistererOptions = {
            logConfiguration: false, // If true, constructor logs the registerer configuration.
            expires: mergedConfigs.registration.registerExpires, // The expiration time in seconds for the registration.
            extraHeaders: [],
            extraContactHeaderParams: [],
            refreshFrequency: 75, // Determines when a re-REGISTER request is sent. The value should be specified as a percentage of the expiration time (between 50 and 99).
        };
        ua.registerer = new Registerer(ua, RegistererOptions);
        console.log('Creating Registerer... Done');
        ua.registerer.stateChange.addListener(function (newState) {
            console.log('User Agent Registration State:', newState);
            console.log({ 'SIP-STATUS': newState });
            switch (newState) {
                case RegistererState.Initial:
                    // Nothing to do
                    break;
                case RegistererState.Registered:
                    onRegistered(ua);
                    break;
                case RegistererState.Unregistered:
                    onUnregistered(ua);
                    break;
                case RegistererState.Terminated:
                    // Nothing to do
                    break;
            }
        });
        ua.start();
        Object.defineProperty(ua, '_key', {
            enumerable: false,
            value: 1,
        });
        console.log('createUserAgent', { ua });
        updateUserAgent(ua);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mergedConfigs]);
    // Detect devices
    const initiateDetectedDevices = () => {
        //TODO useHook
        detectDevices((deviceInfos) => {
            console.log({ deviceInfos });
            if (!deviceInfos)
                return;
            let tmpHasAudioDevice = hasAudioDevice;
            let tmpAudioInputDevices = audioInputDevices;
            let tmpHasSpeakerDevice = hasSpeakerDevice;
            let tmpSpeakerDevices = speakerDevices;
            let tmpHasVideoDevice = hasVideoDevice; // Safari and Firefox don't have these
            let tmpVideoInputDevices = videoInputDevices;
            for (let i = 0; i < deviceInfos.length; ++i) {
                if (deviceInfos[i].kind === 'audioinput') {
                    tmpHasAudioDevice = true;
                    tmpAudioInputDevices.push(deviceInfos[i]);
                }
                else if (deviceInfos[i].kind === 'audiooutput') {
                    tmpHasSpeakerDevice = true;
                    tmpSpeakerDevices.push(deviceInfos[i]);
                }
                else if (deviceInfos[i].kind === 'videoinput') {
                    if (mergedConfigs.features.enableVideo) {
                        tmpHasVideoDevice = true;
                        tmpVideoInputDevices.push(deviceInfos[i]);
                    }
                }
            }
            setSipStore({
                devicesInfo: {
                    hasAudioDevice: tmpHasAudioDevice,
                    audioInputDevices: tmpAudioInputDevices,
                    hasSpeakerDevice: tmpHasSpeakerDevice,
                    speakerDevices: tmpSpeakerDevices,
                    hasVideoDevice: tmpHasVideoDevice,
                    videoInputDevices: tmpVideoInputDevices,
                },
            });
        });
    };
    // Update UserAgent
    const updateUserAgent = (ua) => {
        setSipStore({ userAgent: ua });
    };
    return (jsxRuntimeExports.jsx(SipContext.Provider, { value: {
            status: userAgent?.isConnected() ? 'connected' : 'disconnected',
            lines,
            session: {
                methods,
                events,
            },
            transport: {
                reconnectTransport,
            },
        }, children: children }));
};
const useSipProvider = () => {
    const context = useContext(SipContext);
    if (!context)
        throw new Error('useSipProvider must be used within a SipProvider');
    return context;
};

const Audio$1 = ({ lineNumber, type, ...rest }) => {
    return jsxRuntimeExports.jsx("audio", { ...rest, id: `line-${lineNumber}${type ? `-${type}` : ''}-remoteAudio` });
};

const Video = ({ lineNumber, ...rest }) => {
    return rest.type === 'local' ? (jsxRuntimeExports.jsx("video", { ...rest, id: `line-${lineNumber}-${rest.type}Video`, muted: rest.type === 'local' })) : (jsxRuntimeExports.jsx("div", { ...rest, id: `line-${lineNumber}-remoteVideos` }));
};

export { Audio$1 as AudioStream, SipProvider, Video as VideoStream, useSipProvider };
