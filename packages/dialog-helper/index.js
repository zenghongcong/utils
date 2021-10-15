class DialogHelper {
    constructor() {
        this.scrollTop = 0;
        this.scrollTopElem = null;
    }

    lock() {
        this.scrollTop = this.getScrollTop();
        document.body.style.top = `${-this.scrollTop}px`;
        document.body.style.position = 'fixed';
    }

    unlock() {
        document.body.style.top = 0;
        document.body.style.position = 'relative';
        this.setScrollTop(this.scrollTop);
    }

    getScrollTop() {
        if (document.documentElement.scrollTop > 0) {
            this.scrollTopElem = document.documentElement;
            return document.documentElement.scrollTop;
        } else {
            this.scrollTopElem = document.body;
            return document.body.scrollTop;
        }
    }

    setScrollTop(top) {
        return (this.scrollTopElem.scrollTop = top);
    }

    toggleLock(isLock) {
        isLock ? this.lock() : this.unlock();
    }
}