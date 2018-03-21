import Cookies from 'js-cookie';

// Persistent Storage for data cache management
const PersistentStorage = {
  set(key, data) {
    Cookies.set(key, data, 7);
  },
  get(key) {
    return Cookies.get(key);
  },
  remove(key) {
    return Cookies.remove(key);
  },
  saveUserData: ({ id, encryptedBrainkey, encryptionKey, passwordPubkey }) => {
    Cookies.set('BITSHARES_USER_ID', id, 7);
    Cookies.set('BITSHARES_USER_BRAINKEY', encryptedBrainkey, 7);
    Cookies.set('BITSHARES_ENCRYPTION_KEY', encryptionKey, 7);
    Cookies.set('BITSHARES_PASSWORD_PUBKEY', passwordPubkey, 7);
  },
  getSavedUserData: () => {
    const userId = Cookies.get('BITSHARES_USER_ID');
    const encryptedBrainkey = Cookies.get('BITSHARES_USER_BRAINKEY');
    const encryptionKey = Cookies.get('BITSHARES_ENCRYPTION_KEY');
    const backupDate = Cookies.get('BACKUP_DATE');
    const passwordPubkey = Cookies.get('BITSHARES_PASSWORD_PUBKEY');
    if (!userId || !encryptedBrainkey || !encryptionKey || !passwordPubkey) return null;
    if (typeof (userId) !== 'string') return null;
    return {
      userId,
      encryptedBrainkey,
      encryptionKey,
      backupDate,
      passwordPubkey
    };
  },
  clearSavedUserData: () => {
    Cookies.remove('BITSHARES_USER_ID');
    Cookies.remove('BITSHARES_USER_BRAINKEY');
  },
  saveNodesData: ({ data }) => {
    Cookies.set('BITSHARES_NODES', data);
  },
  getSavedNodesData: () => {
    const cachedData = Cookies.getJSON('BITSHARES_NODES');
    if (typeof (cachedData) === 'object' && cachedData !== null) {
      return cachedData;
    }
    return {};
  },
  getOpenledgerAddresses: () => {
    const cachedData = Cookies.getJSON('BITSHARES_OPENLEDGER_ADDRESSES');
    if (typeof (cachedData) === 'object' && cachedData !== null) {
      return cachedData;
    }
    return {};
  },
  setOpenledgerAddresses: (data) => {
    console.log('SET COOKIES', data);
    Cookies.set('BITSHARES_OPENLEDGER_ADDRESSES', data);
  },
  saveBackupDate: ({ date, userId }) => {
    let backupDateArray = Cookies.get('BACKUP_DATE');
    if (backupDateArray === undefined) {
      backupDateArray = [{ userId, date }];
    } else {
      try {
        const backupDateFromString = JSON.parse(backupDateArray);
        const foundObj = backupDateFromString.find((item, index) => {
          if (item.userId === userId) {
            backupDateFromString[index].date = date;
            return true;
          }
          return undefined;
        });
        if (!foundObj) {
          backupDateFromString.push({ userId, date });
        }
      } catch (ex) {
        backupDateArray = [{ userId, date }];
      }
    }
    Cookies.set('BACKUP_DATE', backupDateArray);
  },

};

export default PersistentStorage;
