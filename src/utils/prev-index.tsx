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

// export function base64toBlob(base64Data: string, contentType: any) {
//   //TODO #SH
//   if (base64Data.indexOf(',') != -1) base64Data = base64Data.split(',')[1]; // [data:image/png;base64] , [xxx...]
//   const byteCharacters = atob(base64Data);
//   const slicesCount = Math.ceil(byteCharacters.length / 1024);
//   const byteArrays = new Array(slicesCount);
//   for (let s = 0; s < slicesCount; ++s) {
//     const begin = s * 1024;
//     const end = Math.min(begin + 1024, byteCharacters.length);
//     const bytes = new Array(end - begin);
//     for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
//       bytes[i] = byteCharacters[offset].charCodeAt(0);
//     }
//     byteArrays[s] = new Uint8Array(bytes);
//   }
//   return new Blob(byteArrays, { type: contentType });
// }
// export function makeDataArray(defaultValue: any, count: number | string) {
//   const rtnArray = new Array(count);
//   for (let i = 0; i < rtnArray.length; i++) {
//     rtnArray[i] = defaultValue;
//   }
//   return rtnArray;
// }
/* -------------------------------------------------------------------------- */
