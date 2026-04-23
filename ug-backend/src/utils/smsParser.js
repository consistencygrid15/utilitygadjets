/**
 * SMS Parser Utility
 *
 * Expected SMS format: "ALERT|DEVICE123|MAIN_DOOR|10:30PM"
 * Parts: [type]|[deviceId]|[zone]|[time]
 *
 * Extended format support:
 *  - ALERT|DEVICE123|MAIN_DOOR|10:30PM        → intrusion
 *  - ARM|DEVICE123|ARMED|10:30PM              → arm confirmation
 *  - DISARM|DEVICE123|DISARMED|10:30PM        → disarm confirmation
 *  - PANIC|DEVICE123|PANIC_BTN|10:30PM        → panic
 *  - TAMPER|DEVICE123|COVER|10:30PM           → tamper
 *  - LOWBAT|DEVICE123|BATTERY|10:30PM         → low battery
 */

const TYPE_MAP = {
  ALERT: 'intrusion',
  INTRUSION: 'intrusion',
  PANIC: 'panic',
  TAMPER: 'tamper',
  LOWBAT: 'low_battery',
  ARM: 'arm',
  DISARM: 'disarm',
};

/**
 * Parse an incoming SMS string into structured data.
 * @param {string} sms - Raw SMS message body.
 * @returns {{ isValid: boolean, deviceId?: string, zone?: string, type?: string, alertTime?: string, error?: string }}
 */
const parseSms = (sms) => {
  if (!sms || typeof sms !== 'string') {
    return { isValid: false, error: 'SMS message is empty or invalid' };
  }

  const cleaned = sms.trim().toUpperCase();
  const parts = cleaned.split('|');

  if (parts.length < 3) {
    return {
      isValid: false,
      error: `Invalid SMS format. Expected at least 3 pipe-separated parts, got: ${sms}`,
    };
  }

  const [rawType, deviceId, zone, alertTime = ''] = parts;
  const type = TYPE_MAP[rawType] || 'unknown';

  if (!deviceId || !zone) {
    return { isValid: false, error: 'Missing deviceId or zone in SMS' };
  }

  return {
    isValid: true,
    deviceId: deviceId.trim(),
    zone: zone.trim(),
    type,
    alertTime: alertTime.trim(),
  };
};

module.exports = { parseSms };
