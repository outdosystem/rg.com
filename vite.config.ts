import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          about: path.resolve(__dirname, 'about.html'),
          leadership: path.resolve(__dirname, 'leadership.html'),
          sessions: path.resolve(__dirname, 'sessions.html'),
          book: path.resolve(__dirname, 'book.html'),
          gallery: path.resolve(__dirname, 'gallery.html'),
          certifications: path.resolve(__dirname, 'certifications.html'),
          testimonials: path.resolve(__dirname, 'testimonials.html'),
          contact: path.resolve(__dirname, 'contact.html'),
          privacy: path.resolve(__dirname, 'privacy-policy.html'),
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
