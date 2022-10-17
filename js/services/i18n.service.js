'use strict'

const ENGLISH = 'eng'
const HEBREW = 'heb'

var gLang = ENGLISH

const gTrans = {
    'title': {
        'heb': 'חנות ספרים',
        'eng': 'Book Shop',
    },
    'english': {
        'heb': 'אנגלית',
        'eng': 'English',
    },
    'hebrew': {
        'heb': 'עברית',
        'eng': 'Hebrew',
    },
    'lang': {
        'heb': 'שפה',
        'eng': 'Language',
    },
    'sort-header': {
        'heb': 'מיין',
        'eng': 'Sort',
    },
    'by-price': {
        'heb': 'על פי מחיר',
        'eng': 'By Price',
    },
    'by-rating': {
        'heb': 'על פי דירוג',
        'eng': 'By Rating',
    },
    'by-name': {
        'heb': 'על פי שם',
        'eng': 'By Name',
    },
    'by-id': {
        'heb': 'על פי מזהה',
        'eng': 'By ID',
    },
    'descending': {
        'heb': 'סדר יורד',
        'eng': 'Descending',
    },
    'filter': {
        'heb': 'סנן',
        'eng': 'Filter',
    },
    'max-price-range-header': {
        'heb': 'מחיר מקסימאלי',
        'eng': 'Max Price',
    },
    'min-rate-range-header': {
        'heb': 'דירוג מינימאלי',
        'eng': 'Min Rate',
    },
    'misc-header': {
        'heb': 'שונות',
        'eng': 'Misc',
    },
    'page': {
        'heb': 'עמוד',
        'eng': 'Page',
    },
    'book-abstract': {
        'heb': 'תקציר',
        'eng': 'Abstract',
    },
    'book-id': {
        'heb': 'מזהה ספר',
        'eng': 'Book ID',
    },
    'book-name': {
        'heb': 'שם הספר',
        'eng': 'Book Name',
    },
    'book-price': {
        'heb': 'מחיר הספר',
        'eng': 'Book Price',
    },
    'img-url': {
        'heb': 'קישור לתמונת הספר',
        'eng': 'Image Url',
    },
    'rating': {
        'heb': 'דירוג',
        'eng': 'Rating',
    },
    'close': {
        'heb': 'סגור',
        'eng': 'Close',
    },
    'add-book-modal-header': {
        'heb': 'פרטי הספר החדש',
        'eng': 'New Book Data',
    },
    'submit': {
        'heb': 'טען',
        'eng': 'Submit',
    },
    'cancel': {
        'heb': 'בטל',
        'eng': 'Cancel',
    },
    'id': {
        'heb': 'מזהה',
        'eng': 'ID',
    },
    'name': {
        'heb': 'שם',
        'eng': 'Name',
    },
    'price': {
        'heb': 'מחיר',
        'eng': 'Price',
    },
    'image': {
        'heb': 'תמונה',
        'eng': 'Image',
    },
    'actions': {
        'heb': 'פעולות',
        'eng': 'Actions',
    },
    'book-name': {
        'heb': 'שם הספר',
        'eng': 'Book Name',
    },
    'read-action': {
        'heb': 'פתח',
        'eng': 'Read',
    },
    'update-action': {
        'heb': 'עדכן',
        'eng': 'Update',
    },
    'delete-action': {
        'heb': 'מחק',
        'eng': 'Delete',
    },
    'enter-book-name-placeholder': {
        'heb': '...הכנס את שם הספר',
        'eng': 'Enter Book\'s Name...',
    },
    'enter-book-price-placeholder': {
        'heb': 'הכנס את מחיר הספר...',
        'eng': 'Enter Book Price..',
    },
    'enter-book-rating-placeholder': {
        'heb': 'הכנס את דירוג הספר...',
        'eng': 'Enter Book Rating..',
    },
    'enter-book-img-placeholder': {
        'heb': 'הכנס את תמונת הספר...',
        'eng': 'Enter Image Url..',
    },
    'add-book': {
        'heb': 'הוסף ספר',
        'eng': 'Add New Book',
    },
    'view': {
        'heb': 'תצוגה',
        'eng': 'View',
    },
    'list': {
        'heb': 'רשימה',
        'eng': 'List',
    },
    'grid': {
        'heb': 'רשת',
        'eng': 'Grid',
    },
    'search': {
        'heb': 'חפש',
        'eng': 'Search',
    },
    'filter-by-max-price': {
        'heb': 'סנן על פי מחיר מקסימאלי',
        'eng': 'Filter By Max Price',
    },
    'price-range': {
        'heb': 'טווח המחיר',
        'eng': 'Price Range',
    },
    'filter-by-min-rate': {
        'heb': 'סנן על פי דירוג מינימאלי',
        'eng': 'Filter By Min Rate',
    },
    'new-price': {
        'heb': 'מחיר חדש',
        'eng': 'New Price',
    },
    'update-price': {
        'heb': 'עדכן מחיר',
        'eng': 'Update Price',
    },
    'previous': {
        'heb': 'הקודם',
        'eng': 'Previous',
    },
    'next': {
        'heb': 'הבא',
        'eng': 'Next',
    },
    'books-name': {
        'heb': 'שם הספר',
        'eng': 'Book\'s Name',
    },
    'books-author': {
        'heb': 'שם הכותב',
        'eng': 'Book\'s Author',
    },
    'books-price': {
        'heb': 'מחיר הספר',
        'eng': 'Book\'s Price',
    },
    'books-cover': {
        'heb': 'כריכה',
        'eng': 'Book\'s Cover',
    },
    'by-rate': {
        'heb': 'על פי דירוג',
        'eng': 'By Rate',
    },
    'sort': {
        'heb': 'מיין',
        'eng': 'Sort',
    },

}


function doTrans() {
    var els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const trans = _getTrans(transKey)
        el.innerText = trans
        if (el.placeholder) el.placeholder = trans
    })

    els = document.querySelectorAll('[data-price]')

    els.forEach(el => {
        el.innerText = getFormatNumber(currencyConversion(+el.dataset.price))
    })
}

function setLang(newLang) {
    gLang = newLang
}

function getLang() {
    return gLang
}

function currencyConversion(amount) {
    return (gLang === ENGLISH) ? amount : amount / 3.6
}

function setDisplayDirection() {
    const dir = (gLang === ENGLISH) ? 'ltr' : 'rtl'
    const lang = (gLang === ENGLISH) ? 'en' : 'he'

    document.querySelector('html').dir = dir
    document.querySelector('html').lang = lang

    if (gLang !== ENGLISH) {
        document.querySelectorAll('.custom-text-align').forEach(el => el.classList.add('custom-text-align-right'))
    }
}

function getPriceRange(rangeValue) {
    return Math.round(currencyConversion(rangeValue))
}

function getFormatNumber(num) {
    const locale = (gLang === ENGLISH) ? 'en-US' : 'he-IL'
    const currency = (gLang === ENGLISH) ? 'USD' : 'ILS'

    return new Intl.NumberFormat(locale, {style: 'currency', currency,}).format(num);
}

function _getTrans(transKey) {
    const transMap = gTrans[transKey]
    if (!transMap) return 'Unknown'

    const trans = transMap[gLang]
    if (!trans) return transMap[ENGLISH]

    return trans
}

    

