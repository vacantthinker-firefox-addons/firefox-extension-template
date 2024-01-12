/**
 * MIT License
 *
 * Copyright (c) 2023 VacantThinker
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 * @returns {Promise<void>}
 */
async function startFn() {
  async function storageGetSetting(k) {
    try {
      let objGet = await browser.storage.local.get(k);
      let v = objGet[k]
      return v;
    } catch (e) {
      return null;
    }
  }

  async function storageSetSetting(k, v) {
    let objNew = {}
    objNew[k] = v;
    await browser.storage.local.set(objNew)
  }

  function stoKeySetting() {
    return {
      prop123: `prop123`,
    }
  }

  /**
   * @param selector
   * @return {HTMLElement}
   */
  const qs = (selector) => document.querySelector(selector);

  /**
   *
   * @returns {Promise<void>}
   */
  async function setInputValueFromLocal(...arr) {
    for (let i = 0; i < arr.length; i++) {
      let k = arr[i]

      let value = await storageGetSetting(stoKeySetting()[k])
      let sel = `#${k}`
      qs(sel).setAttribute("value", value)
    }
  }

  /**
   *
   * @param arr{string}
   */
  function addNumberTextChangeEvent(...arr) {
    for (let i = 0; i < arr.length; i++) {
      let k = arr[i]
      let sel = `#${k}`
      qs(sel).addEventListener("change", async (ev) => {
        let value = ev.target["value"];
        await storageSetSetting(stoKeySetting()[k], value)
      })
    }
  }

  // todo initial value from local storage
  for (const value of Object.values(stoKeySetting())) {
    await addNumberTextChangeEvent(value)
    await setInputValueFromLocal(value);
  }


}

startFn().then()

