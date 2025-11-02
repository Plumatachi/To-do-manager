import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'customTheme',
    themes: {
      customTheme: {
        dark: false,
        colors: {
          primary: '#06e3a6',
          secondary: '#147358',
          accent: '#00c897',
          error: '#ef5350',
          info: '#2196F3',
          success: '#4caf50',
          warning: '#fb8c00',
          background: '#f5f5f5',
          surface: '#ffffff',
        }
      }
    }
  }
})
