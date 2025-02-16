const optionsApp = {
    btnSave: document.getElementById('btn_save'),

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

    event() {
        this.btnSave.addEventListener('click', this.saveOptions.bind(this));

        document.querySelectorAll('input[name="settings"]').forEach(inputEl => {
            inputEl.addEventListener('input', this.activeBtnSave.bind(this));
        });
    },

    activeBtnSave() {
        if (this.btnSave.hasAttribute('disabled')) {
            this.btnSave.removeAttribute('disabled');

            window.addEventListener('beforeunload', this.warningUnsavedSettings);
        }
    },

    disableBtnSave() {
        this.btnSave.setAttribute('disabled', true);

        window.removeEventListener('beforeunload', this.warningUnsavedSettings);
    },

    /**
     * Предупреждение о несохраненных настройках
     */
    warningUnsavedSettings(event) {
        event.preventDefault();
    },

    translate() {
        document.querySelectorAll('[data-lang]').forEach(str => {
            str.textContent = chrome.i18n.getMessage(str.dataset.lang);

            str.removeAttribute('data-lang');
        });
    },

    install() {
        const keyStorage = this.keyId.map(el => `settings_${ el }`);

        chrome.storage.sync.get(keyStorage).then((result) => {
            for (const key in result) {
                if (typeof result[key] === 'boolean' && result[key]) {
                    let elId = key.replace('settings_', '');
                    document.getElementById(elId).setAttribute('checked', true);
                }
            }
        });
    },

    saveOptions() {
        let params = {};

        this.keyId.forEach(keyEl => params[`settings_${ keyEl }`] = document.getElementById(keyEl).checked);

        chrome.storage.sync.set(params, () => {
            this.disableBtnSave();

            let flashMessage = document.querySelector('.flash-message');
            flashMessage.classList.add('in');

            setTimeout(() => flashMessage.classList.remove('in'), 1000);
        });
    },

    init() {
        this.translate();
        this.install();
        this.event();
    }
}

optionsApp.init();
