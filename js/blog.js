window.addEventListener('load', function () {
    const FOLD_LEN = 150;
    let quotes = $('blockquote');
    quotes.wrap('<div class="mfolder"></div>')
    let folders = $('div.mfolder');
    for (var i = 0; i < folders.length; i++) {
        let div = folders[i];
        if (div.children[0].clientHeight > FOLD_LEN) {
            div.classList.add('mfold');
        } else {
            div.classList.add('munfold');
        }
        let btn = document.createElement('div');
        btn.addEventListener('click', (function clickhandler(event) {
            this.classList.toggle('mfold');
            this.classList.toggle('munfold');
        }).bind(div));
        btn.classList.add('mfolderbutton');
        btn.innerText = "Click to Fold/Unfold";
        div.prepend(btn);
    }
    let btns = $('.mfolder>.mfolderbutton');
    for (var i = 0; i < btns.length; i++) {
        let btn = btns[i];
    }
});
