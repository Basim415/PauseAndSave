export async function getActiveTabURL() {
    letqueryOptions = { active: true, currentWindow: true};
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
}