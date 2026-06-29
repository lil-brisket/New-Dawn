import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  clearAll() {
    void AsyncStorage.clear();
  },
};

export const appStorage = {
  getItem: (name: string) => AsyncStorage.getItem(name),
  setItem: (name: string, value: string) => AsyncStorage.setItem(name, value),
  removeItem: (name: string) => AsyncStorage.removeItem(name),
};
