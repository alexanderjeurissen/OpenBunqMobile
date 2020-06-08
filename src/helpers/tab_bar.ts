export default () => {
  let tabBar = document.querySelectorAll('ion-tab-bar')[0];

  type objType = {[key: string]: string};
  const toggle: objType = {
    '': 'none',
    'none': 'flex',
    'flex': 'none'
  }

  tabBar.style.display = toggle[tabBar.style.display]
}
