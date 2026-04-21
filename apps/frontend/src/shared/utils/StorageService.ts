export class StorageService {
  static saveItem(key: string, value: unknown) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  static getItem(key: string) {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  }

  static removeItem(key: string) {
    localStorage.removeItem(key);
  }

  static clear() {
    localStorage.clear();
  }
}