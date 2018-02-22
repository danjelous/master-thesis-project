getLocalStorageVar = name => {
   return window.localStorage.getItem(name);
};

setLocalStorageVar = (name, val) => {
   window.localStorage.setItem(name, val);
};