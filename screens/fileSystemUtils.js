import * as FileSystem from 'expo-file-system/legacy';

const MENU_FILE_PATH = FileSystem.documentDirectory + 'menu.json';
const ORDERS_FILE_PATH = FileSystem.documentDirectory + 'orders.json';

export const loadMenu = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(MENU_FILE_PATH);
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(MENU_FILE_PATH);
      return JSON.parse(fileContent);
    }
    return [];
  } catch (error) {
    console.error('Error loading menu items', error);
    return [];
  }
};

export const saveMenu = async (menu) => {
  try {
    await FileSystem.writeAsStringAsync(MENU_FILE_PATH, JSON.stringify(menu));
  } catch (error) {
    console.error('Error saving menu items', error);
  }
};

export const loadOrders = async () => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(ORDERS_FILE_PATH);
    if (fileInfo.exists) {
      const fileContent = await FileSystem.readAsStringAsync(ORDERS_FILE_PATH);
      return JSON.parse(fileContent);
    }
    return [];
  } catch (error) {
    console.error('Error loading Order information', error);
    return [];
  }
};

export const saveOrders = async (orders) => {
  try {
    await FileSystem.writeAsStringAsync(ORDERS_FILE_PATH  , JSON.stringify(orders));
  } catch (error) {
    console.error('Error saving orders information', error);
  }
};