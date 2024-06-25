// api.ts
import axios from 'axios';

const API_URL = 'https://666c82c349dbc5d7145e43df.mockapi.io/GeniusKids';

export const getGeniusKids = async () => {
  try {
    const response = await axios.get(API_URL);
    console.log('API Response:', response.data); // Проверка данных
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const addGeniusKid = async (newKid: Omit<GeniusKid, 'id'>) => {
  try {
    const response = await axios.post(API_URL, newKid);
    return response.data;
  } catch (error) {
    console.error('Error adding data:', error);
    throw error;
  }
};
