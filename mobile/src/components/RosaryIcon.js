import { createIconSet } from '@expo/vector-icons';
import glyphMap from '../../assets/fonts/selection.json';

// Extract just the icon name to code mapping from the IcoMoon selection.json
const icons = {};
glyphMap.icons.forEach((icon) => {
  const name = icon.properties.name;
  const code = icon.properties.code;
  icons[name] = code;
});

const RosaryIcon = createIconSet(icons, 'rosary', 'rosary.ttf');

export default RosaryIcon;
