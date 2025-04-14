import { defineNuxtPlugin } from '#app';
import { initializeDatabase } from '~/server/database';

// Plugin to initialize the database when the Nuxt app starts
export default defineNuxtPlugin(async (nuxtApp) => {
  // Only run on server-side
  if (process.server) {
    try {
      await initializeDatabase();
      console.log('Database initialized in Nuxt plugin');
    } catch (error) {
      console.error('Failed to initialize database in Nuxt plugin:', error);
    }
  }
  
  return {
    provide: {
      databaseInitialized: true
    }
  };
});
