chrome.tabs.onUpdated.addListener(show_ww_page_action);

function show_ww_page_action(tabId, changeInfo, tab) {
    if (tab.url.indexOf('cmx.weightwatchers.co.uk') > -1) {
        chrome.pageAction.show(tabId);
        console.log('Wooop');
    }
}
