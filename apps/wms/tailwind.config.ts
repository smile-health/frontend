import { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

const config: Config = {
  future: {},
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    colors: {
      ...defaultTheme.colors,
      black: '#073b4c',
    },
    extend: {
      fontSize: {
        'md-1': '15px',
      },
      colors: {
        primary: '#004990',
        info: '#1ba8df',
        success: '#00b050',
        warning: '#ECC94B',
        danger: '#ef476f',
        secondary: '#d2d2d2',
        dark: '#073b4c',
        sky: '#38BDF8',
        myorange: '#FA6400',
        notif: '#c2e1fe',
        modal: 'rgba(0,0,0,0.4)',
        'orange-rust': '#C4320A',
        'label-dark': '#787878',
        'indicator-good': '#00b050',
        'indicator-warning': '#C69502',
        'indicator-danger': '#9D0000',
        'azure-blue': '#E0F6FF',
        'gray-group-table-header': '#F1F2F3',
        'blue-table-header': '#E0F6FF',
      },
      width: {
        '1/9': '11.1111111%',
        '2/9': '22.2222222%',
        '3/9': '33.3333333%',
        '4/9': '44.4444444%',
        '5/9': '55.5555556%',
        '6/9': '66.6666667%',
        '7/9': '77.7777778%',
        '8/9': '88.8888889%',
      },
    },
  },
  variants: {},
  plugins: [],
};

export default config;
