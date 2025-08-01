// ========================================
// 🌐 CENTRALIZED URL CONFIGURATION
// ========================================
// Update these URLs for different environments

const config = {
  // 🏠 Development URLs
  development: {
    GRAPHQL_URI: 'http://localhost:4000/graphql',
    BACKEND_URL: 'http://localhost:4000'
  },
  
  // 🚀 Production URLs (Update these when deploying)
  production: {
    GRAPHQL_URI: 'https://graphql-todo-qu78.vercel.app/graphql',
    BACKEND_URL: 'https://graphql-todo-qu78.vercel.app/.app'
  }
};

// 🎯 Auto-detect environment
const isDevelopment = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1' ||
                     window.location.hostname.includes('192.168.');

const currentEnv = isDevelopment ? 'development' : 'production';

// 📤 Export current configuration
export const URL_CONFIG = config[currentEnv];

// 🔗 Direct exports for easy access
export const GRAPHQL_URI = URL_CONFIG.GRAPHQL_URI;
export const BACKEND_URL = URL_CONFIG.BACKEND_URL;

// 🔍 Debug logging (remove in production if needed)
console.log(`🌐 Environment detected: ${currentEnv}`);
console.log(`🔗 GraphQL URI: ${GRAPHQL_URI}`);

// 📋 Default export
export default URL_CONFIG;
