import { dayJs } from '../../../../utils';

export function uID() {
  return (
    Date.now() +
    Math.floor(Math.random() * 10000)
      .toString(16)
      .toUpperCase()
  );
}
export function utcDateNow() {
  return dayJs().utc().format('YYYY-MM-DD HH:mm:ss UTC');
}
export function getDbItem(itemIndex: string, defaultValue: string | null) {
  if (localStorage.getItem(itemIndex) != null) return localStorage.getItem(itemIndex);
  return defaultValue;
}
export function getAudioSrcID() {
  const id = localStorage.getItem('AudioSrcId');
  return id != null ? id : 'default';
}
export function getAudioOutputID() {
  const id = localStorage.getItem('AudioOutputId');
  return id != null ? id : 'default';
}
export function getVideoSrcID() {
  const id = localStorage.getItem('VideoSrcId');
  return id != null ? id : 'default';
}
export function getRingerOutputID() {
  const id = localStorage.getItem('RingOutputId');
  return id != null ? id : 'default';
}
// export function formatDuration(seconds: string) {
//   const sec = Math.floor(parseFloat(seconds));
//   if (sec < 0) {
//     return sec;
//   } else if (sec >= 0 && sec < 60) {
//     return sec + ' ' + (sec > 1 ? lang.seconds_plural : lang.second_single);
//   } else if (sec >= 60 && sec < 60 * 60) {
//     // greater then a minute and less then an hour
//     const duration = dayjs.duration(sec, 'seconds');
//     return (
//       duration.minutes() +
//       ' ' +
//       (duration.minutes() > 1 ? lang.minutes_plural : lang.minute_single) +
//       ' ' +
//       duration.seconds() +
//       ' ' +
//       (duration.seconds() > 1 ? lang.seconds_plural : lang.second_single)
//     );
//   } else if (sec >= 60 * 60 && sec < 24 * 60 * 60) {
//     // greater than an hour and less then a day
//     const duration = dayjs.duration(sec, 'seconds');
//     return (
//       duration.hours() +
//       ' ' +
//       (duration.hours() > 1 ? lang.hours_plural : lang.hour_single) +
//       ' ' +
//       duration.minutes() +
//       ' ' +
//       (duration.minutes() > 1 ? lang.minutes_plural : lang.minute_single) +
//       ' ' +
//       duration.seconds() +
//       ' ' +
//       (duration.seconds() > 1 ? lang.seconds_plural : lang.second_single)
//     );
//   }
//   //  Otherwise.. this is just too long
// }
export function formatShortDuration(seconds: number) {
  const sec = Math.floor(seconds);
  if (sec < 0) {
    return sec;
  } else if (sec >= 0 && sec < 60) {
    return '00:' + (sec > 9 ? sec : '0' + sec);
  } else if (sec >= 60 && sec < 60 * 60) {
    // greater then a minute and less then an hour
    const duration = dayJs.duration(sec, 'seconds');
    return (
      (duration.minutes() > 9 ? duration.minutes() : '0' + duration.minutes()) +
      ':' +
      (duration.seconds() > 9 ? duration.seconds() : '0' + duration.seconds())
    );
  } else if (sec >= 60 * 60 && sec < 24 * 60 * 60) {
    // greater than an hour and less then a day
    const duration = dayJs.duration(sec, 'seconds');
    return (
      (duration.hours() > 9 ? duration.hours() : '0' + duration.hours()) +
      ':' +
      (duration.minutes() > 9 ? duration.minutes() : '0' + duration.minutes()) +
      ':' +
      (duration.seconds() > 9 ? duration.seconds() : '0' + duration.seconds())
    );
  }
  //  Otherwise.. this is just too long
}

// export function formatBytes(bytes:number, decimals:number) {
//   if (bytes === 0) return '0 ' + lang.bytes;
//   const k = 1024;
//   const dm = decimals && decimals >= 0 ? decimals : 2;
//   const sizes = [lang.bytes, lang.kb, lang.mb, lang.gb, lang.tb, lang.pb, lang.eb, lang.zb, lang.yb];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
// }

// export function UserLocale() {
//   const language = window.navigator.userLanguage || window.navigator.language; // "en", "en-US", "fr", "fr-FR", "es-ES", etc.
//   // langtag = language["-"script]["-" region] *("-" variant) *("-" extension) ["-" privateuse]
//   // TODO Needs work
//   langtag = language.split('-');
//   if (langtag.length == 1) {
//     return '';
//   } else if (langtag.length == 2) {
//     return langtag[1].toLowerCase(); // en-US => us
//   } else if (langtag.length >= 3) {
//     return langtag[1].toLowerCase(); // en-US => us
//   }
// }

// export function GetAlternateLanguage() {
//   const userLanguage = window.navigator.userLanguage || window.navigator.language; // "en", "en-US", "fr", "fr-FR", "es-ES", etc.
//   // langtag = language["-"script]["-" region] *("-" variant) *("-" extension) ["-" privateuse]
//   if (Language != 'auto') userLanguage = Language;
//   userLanguage = userLanguage.toLowerCase();
//   if (userLanguage == 'en' || userLanguage.indexOf('en-') == 0) return ''; // English is already loaded

//   for (l = 0; l < availableLang.length; l++) {
//     if (userLanguage.indexOf(availableLang[l].toLowerCase()) == 0) {
//       console.log('Alternate Language detected: ', userLanguage);
//       // Set up Moment with the same language settings
//       moment.locale(userLanguage);
//       return availableLang[l].toLowerCase();
//     }
//   }
//   return '';
// }

export function getFilter(filter: string, keyword: string) {
  if (filter.indexOf(',', filter.indexOf(keyword + ': ') + keyword.length + 2) != -1) {
    return filter.substring(
      filter.indexOf(keyword + ': ') + keyword.length + 2,
      filter.indexOf(',', filter.indexOf(keyword + ': ') + keyword.length + 2),
    );
  } else {
    return filter.substring(filter.indexOf(keyword + ': ') + keyword.length + 2);
  }
}
export function base64toBlob(base64Data: string, contentType: any) {
  //TODO #SH
  if (base64Data.indexOf(',') != -1) base64Data = base64Data.split(',')[1]; // [data:image/png;base64] , [xxx...]
  const byteCharacters = atob(base64Data);
  const slicesCount = Math.ceil(byteCharacters.length / 1024);
  const byteArrays = new Array(slicesCount);
  for (let s = 0; s < slicesCount; ++s) {
    const begin = s * 1024;
    const end = Math.min(begin + 1024, byteCharacters.length);
    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[s] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}
export function MakeDataArray(defaultValue: any, count: number | string) {
  const rtnArray = new Array(count);
  for (let i = 0; i < rtnArray.length; i++) {
    rtnArray[i] = defaultValue;
  }
  return rtnArray;
}
/* -------------------------------------------------------------------------- */
