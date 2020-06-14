import ObjType from '../types/obj_type';

export default () => {
  let tabBar = document.querySelectorAll('ion-tab-bar')[0];

  const toggle: ObjType = {
    '': 'none',
    'none': 'flex',
    'flex': 'none'
  }

  tabBar.style.display = toggle[tabBar.style.display]
}
