const optionsApp = {
    keyId: [
        'pagespeed',
        'validHTML',
        'validCSS',
        'structuredData',
        'icons',
        'yandexIKS',
        'alexaRanks',
        'searchGoogle',
        'searchYandex',
        'robotsTxt'
    ],

    $btnSave: document.querySelector('#save'),

    event() {
        this.$btnSave.addEventListener('click', this.saveOptions.bind(this));
    },

    text() {
        document.querySelector('title').textContent = chrome.i18n.getMessage("settingsTitle");
        document.querySelector('h1').textContent = chrome.i18n.getMessage("settingsH1");
        document.querySelectorAll('.switch-label-on').forEach(item => item.textContent = chrome.i18n.getMessage("settingsLabelOn"));
        document.querySelectorAll('.switch-label-off').forEach(item => item.textContent = chrome.i18n.getMessage("settingsLabelOff"));
        this.$btnSave.textContent = chrome.i18n.getMessage("settingsBtnSave");
        document.querySelectorAll('.item__text').forEach((item, index) => item.textContent = chrome.i18n.getMessage('itemsMenu_' + this.keyId[index]));
    },

    install() {
        const keyStorage = this.keyId.map(el => 'settings_' + el);

        chrome.storage.sync.get(keyStorage, params => {
            optionsApp.keyId.forEach(el => params['settings_' + el] ? document.querySelector('#item_' + el + '_on').checked = true : document.querySelector('#item_' + el + '_off').checked = true);
        });
    },

    saveOptions() {
        let params = new Object();

        this.keyId.forEach(el => params['settings_' + el] = document.querySelector('#item_' + el + '_on').checked);

        chrome.storage.sync.set(params, () => {
            let status = document.querySelector('#status');
            status.textContent = chrome.i18n.getMessage('settingsSaveStatus');
            status.style.display = 'block';

            window.setTimeout(() => status.style.display = 'none', 750);
        });
    },

    init() {
        this.text();
        this.install();
        this.event();
    }
}

optionsApp.init();
