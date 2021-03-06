'use strict';

const Keyboard = {

    // STARTUP: setup keyboard shortcuts
    setupShortcuts: () => {
        document.addEventListener('keypress', (key) => {
            if (key.charCode === 13) { // enter
                Keyboard.keyEnter(key.target.id);
            } else if (key.ctrlKey && key.charCode === 10) { // ctrl+enter
                $('#button-upload').click();
            } else if (key.ctrlKey && key.charCode === 15) { // ctrl+o
                document.querySelector('#file-path-hidden').click();
            } else if (key.ctrlKey && key.charCode === 23) { // ctrl+w
                Interface.reset();
            } else if (key.ctrlKey && key.charCode === 6 && !$('#settings-popup').is(':visible')) { // ctrl+f
                $('.search-imdb').click();
            } else if (key.ctrlKey && key.charCode === 4) { // ctrl+d
                console.info('Opening devtools');
                gui.Window.get().showDevTools();
            } else if (key.ctrlKey && key.charCode === 18) { // ctrl+r
                Misc.restartApp();
            }
        });

        document.addEventListener('keyup', (key) => {
            if (key.keyCode === 27) { // escape
                Interface.leavePopup({});
            } else if (key.keyCode === 40) { // arrow down
                Keyboard.browseResultItem('down');
            } else if (key.keyCode === 38) { // arrow up
                Keyboard.browseResultItem('up');
            }
        });
    },

    // AUTO: when user presses 'enter', triggered from Keyboard.setupShortcuts()
    keyEnter: (id) => {
        // comment can have multiple lines, so ignore it
        if (id === 'subauthorcomment') {
            return;

        // login fields is user trying to log in, enter means 'login now'
        } else if (id === 'login-username' || id === 'login-password') {
            $('#button-login').click();

        // enter on search bar starts the search
        } else if (id === 'search-text') {
            $('#button-search').click();

        // enter on checkboxes toggles the state
        } else if ($('#'+id).attr('type') === 'checkbox') {
            $('#'+id).prop('checked', !$('#'+id).prop('checked'));

        // loads imdb item from search
        } else if ($('.result-item.selected').length > 0) {
            $('.result-item.selected').click();

        // without id, do nothing
        } else if (!id) {
            return;

        // enter on other inputs behaves like tab key
        } else {
            Keyboard.selectNextInput();
        }
    },

    // select next valid input
    selectNextInput: () => {
        const inputs = $(':input');
        const actualIndex = inputs.index(document.activeElement);

        const next = (index) => {
            const nextInput = inputs.get(index + 1);

            if (nextInput) {
                // if element is invisible or readonly, skip to next
                if (!$(nextInput).is(':visible') || $(nextInput).attr('readonly')) {
                    next(index + 1);
                } else {
                    nextInput.focus();
                }
            }
        };

        next(actualIndex);
    },

    // AUTO: selects a result item from arrow keys in imdb search
    browseResultItem: (dir) => {
        // if imdb search isnt opened, don't continue
        const results = $('.result-item');
        const total = results.length;
        if (total <= 0) {
            return;
        }

        console.log('go', dir);
        const index = $('.result-item.selected').index();
        const next = dir === 'down' ? index + 1 : index - 1;

        if (next > total - 1 || next < 0) {
            // don't do anything if the list is at top or bottom
            return;
        } else {
            // deselect input
            $('#search-text').blur();

            // select next or previous item
            $(results).removeClass('selected');
            $(results[next]).addClass('selected');

            // checks if item is visible
            if (!Misc.elementInViewport($('#search-result'),$('.result-item.selected'))) {
                // scroll there
                $('.result-item.selected').scrollintoview();
            }
        }
    }
};