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
async function func() {
  /**
   *
   * @returns {Promise<browser.tabs.Tab>}
   */
  async function getTab() {
    const r = await browser.windows.getCurrent({});
    let windowId = r.id;

    const tabs = await browser.tabs.query({
      active: true,
      highlighted: true,
      windowId,
    })
    let tab = tabs.at(0)
    return tab;
  }

  let tab = await getTab();
  let url = tab.url;
  let tabTitle = tab.title

  const playlistObj = {
    playlist_youtube: {
      urlPrefix: `https://www.youtube.com/playlist?list=`,
      func: async function (args) {
        let {urlPrefix, url} = args
        /**
         * @param urlPrefix
         * @param url
         * @returns string
         */
        const getPlaylist = ({urlPrefix, url,}) => {
          let startIdx = url.indexOf(urlPrefix);
          let playlist = url.substring(startIdx + urlPrefix.length);
          return playlist
        }
        let playlist = getPlaylist({urlPrefix, url,});

        // todo element download event click
        let eleDownlaod = document.querySelector(`#download`);
        eleDownlaod.addEventListener("click", (ev) => {
          let eleIndexstart = document.querySelector(`#indexstart`)
          let eleIndexend = document.querySelector(`#indexend`)
          let indexstartOrigin = eleIndexstart.value;
          let indexendOrigin = eleIndexend.value;

          let indexstart = parseInt(indexstartOrigin);
          let b1 = typeof indexstart === "number";
          let indexend = parseInt(indexendOrigin);
          let b2 = typeof indexend === "number";
          if (b1 && b2) {

            function doAction() {
              const brs = async (msg) => await browser.runtime.sendMessage(msg);
              brs({
                playlist,
                indexstart, indexend,
                act: `actPlaylistDownload`,
              }).then()
            }

            doAction()

          }
        })

      },
    }
  }

  /**
   *
   * @type {{ }[]}
   */
  let filterList = Object.keys(playlistObj).map((typevideo) => {
    let obj = playlistObj[typevideo]
    let {urlPrefix} = obj;
    if (url.startsWith(urlPrefix)) {
      return {
        typevideo,
        urlPrefix,
        url,
      }
    } else {
      return null
    }
  }).filter(value => value);

  function elementPlaylistShowup() {
    let element = document.querySelector('#playlist');
    element.style.display = null
  }

  if (filterList.length === 1) {
    elementPlaylistShowup()

    let args = filterList.at(0);
    let {typevideo} = args
    let playlistValue = playlistObj[typevideo];

    await new Promise(res => setTimeout(res, 100));
    await playlistValue.func(args)

  } else {
    // todo length === 0
    // todo remove element main
//    elementMainToggle()

    // todo get data
    let titleArr = [tabTitle]
    let linkArr = [url]

    // todo send to actDispatch handle the pageUrl
    function doActionDispatch() {
      const brs = async (msg) => await browser.runtime.sendMessage(msg);
      brs({
        titleArr,
        linkArr,
        act: `actDispatch`,
      }).then()
    }

    doActionDispatch()
  }

  // todo end

}

func().then()
