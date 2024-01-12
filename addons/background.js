async function initial() {
  //******************************************************************************

  // todo browser base function
  const brWindow = {
    state: {
      normal: "normal",
      minimized: "minimized",
      maximized: "maximized",
      fullscreen: "fullscreen",
      docked: "docked",
    },
    type: {
      normal: "normal",
      popup: "popup",
      panel: "panel",
      detached_panel: "detached_panel",
    }
  }

  /**
   *
   * @param url
   * @param newWindow
   * @param focused
   * @param state
   * @param active
   * @returns {Promise<{tabId: number, windowId: number}|{tabId: number}>}
   */
  async function brTabCreate(
    {
      url,
      newWindow = true,
      focused = false,
      state = brWindow.state.minimized,
      active = false,
    }) {
    if (newWindow) {
      let window = await browser.windows.create({
        url,
        focused,
        state,
        allowScriptsToClose: true,
        // left: 0, top: 0, width: 1, height: 1,
      });
      let windowId = window.id;
      let tab = window.tabs.pop();
      let tabId = tab.id;
      return {tabId, windowId};
    } else {
      let tab = await browser.tabs.create({
        url,
        active
      })
      let tabId = tab.id;
      return {tabId};
    }
  }

  /**
   *
   * @param tabIds{number| [number]}
   * @return {Promise<void>}
   */
  async function brTabRemove(tabIds) {
    try {
      if (tabIds) {
        await browser.tabs.remove(tabIds);
      }
    } catch (e) {
    }
  }

  /**
   *
   * @param tabId
   * @param url
   * @returns {Promise<void>}
   */
  async function brTabUpdateUrl(tabId, url) {
    await brTabUpdate(tabId, {url});
  }

  async function brTabUpdate(tabId, updateProperties) {
    await browser.tabs.update(tabId, updateProperties);
  }


  /**
   *
   * @param searchString
   * @returns {Promise<null|{tabId: number}>}
   */
  async function brTabQueryOne({searchString, matchType = 'end'}) {
    try {
      let tabs = await browser.tabs.query({});
      console.log('tabs', tabs)

      let map = tabs
        .map(value => {
          return {
            tabId: value.id,
            url: value.url
          }
        });
      let filter = map
        .filter(value => value.url.endsWith(searchString));

      console.log(map)
      console.log(filter)


      let tab = filter.pop();

      let tabId = tab.id;
      return tabId
    } catch (e) {
      return null
    }
  }

  /**
   *
   * @param message{ {
   *          title:String,
   *          text:String,
   *          }}
   * @returns {Promise<void>}
   */
  async function brNotification(message) {
    let {title, text} = message;
    let textDefault = '';
    text = text ? text : textDefault;

    let notificationId = 'cake-notification';
    let type = 'basic';

    let timeout = 3;
    timeout = message.hasOwnProperty('timeout')
      ? message.timeout
      : timeout;

    await browser.notifications.create(notificationId, {
      type,
      title,
      message: text,
      eventTime: timeout * 1000,
    });
  }

  async function brWaitHowLongTime(timeout) {
    await new Promise(res => setTimeout(res, timeout));
  }

  //------------------------------------------------

  async function storageGet(k) {
    try {
      let objGet = await browser.storage.local.get(k);
      let v = objGet[k]
      return v ? v : null;
    } catch (e) {
      return null;
    }
  }

  async function storageGetAll() {
    try {
      let obj = await browser.storage.local.get();
      return obj;
    } catch (e) {
      return null;
    }
  }

  async function storageRemove(k) {
    try {
      await browser.storage.local.remove(k);
    } catch (e) {
    }
  }

  async function storageSet(k, v) {
    let objNew = {}
    objNew[k] = v;
    await browser.storage.local.set(objNew)
  }

  async function storageSetNull(k) {
    let objNew = {}
    objNew[k] = null;
    await browser.storage.local.set(objNew)
  }

  //------------------------------------------------

  // services

  // ---------------------------------------------------------

  // actions

  // --------------------------------------------------------

  // initial
  function storageKey() {
    return {}
  }

  async function initialStorage() {
    function storageValueDefault() {
      return {}
    }

    for (let k in storageValueDefault()) {

      let value = await storageGet(k);
      if (value) {
      } else {
        let valueDefault = storageValueDefault()[k];
        await storageSet(k, valueDefault)
      }
    }
  }

  function initialCustomMethod() {
    Array.prototype.getFirst = function () {
      return [].concat(this).at(0) || null
    }
  }

  function initialRuntimeOnMessage() {
    browser.runtime.onMessage.addListener(async (message) => {
      let keyAct = "act";
      let act = message[keyAct];
      delete message[keyAct];

      switch (act) {

      }
    });
  }

  function initialCreateMenu() {
    browser.menus.create({
      id: 'cmItemSample',
      title: 'item sample',
      contexts: [
        'tab',
        'page'
      ],
      onclick: async (info, tab) => {
        let tabId = tab.id;

        // todo end
      },
    }, null);
  }

  //------------------------------------------------------------------------------

  // initial func()

  initialCustomMethod()
  initialRuntimeOnMessage()
  initialCreateMenu()
  // todo storage
  initialStorage().then()

}

initial().then()