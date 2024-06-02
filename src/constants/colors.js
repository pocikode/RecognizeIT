// import { Colors as Colorrs } from 'react-native-ui-lib'

// Colorrs.loadColors({
//   primary: '#42a5f5',
//   error: '#ff2442',
//   success: '#00CD8B',
//   text: '#20303C'
// })

const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};

// export const Colors = Colorrs;