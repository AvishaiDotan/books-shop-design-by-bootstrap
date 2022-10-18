'use strict'

const ON = true
const OFF = false
const DEFAULT_IMG_LINK = 'https://picsum.photos/id/971/200/'


var gQueryString = {}

function onInit() {
    renderAppByQueryStringParams()
    renderPaging()
    renderBooks()
    setDisplayDirection()
    updateWindowPath()
    doTrans()
}

function renderPaging() {
    const currPage = getPagingData().currPage

    const strHTML = `
        <li class="page-item"><a class="page-link l-page" data-trans="previous" href="#" ${isValidPage(currPage - 1) ? `onclick="onSetPage(${currPage - 1})"` : ''}>${_getTrans('previous')}</a></li>
        <li class="page-item"><a class="page-link" href="#" ${isValidPage(currPage) ? `onclick="onSetPage(${currPage})"` : ''}>${currPage + 1}</a></li>
        <li class="page-item"><a class="page-link" href="#" ${isValidPage(currPage + 1) ? `onclick="onSetPage(${currPage + 1})"` : ''}>${currPage + 2}</a></li>
        <li class="page-item"><a class="page-link" href="#" ${isValidPage(currPage + 2) ? `onclick="onSetPage(${currPage + 2})"` : ''}>${currPage + 3}</a></li>
        <li class="page-item"><a class="page-link r-page" data-trans="next" href="#" ${isValidPage(currPage + 1) ? `onclick="onSetPage(${currPage + 1})"` : ''}>${_getTrans('next')}</a></li>
    `

    document.querySelector('.pagination').innerHTML = strHTML
}

function renderBooks() {
    const books = getBooks()
    const view = getViewPref()

    var strHtml;

    if (view === 'list') {
        const tableHead = `
                        <th scope="col" class="col-idx">#</th>
                        <th data-trans="name" scope="col">${_getTrans('name')}</td>
                        <th data-trans="price" scope="col" class="col-price">${_getTrans('price')}</td>
                        <th data-trans="rating" scope="col" class="col-rate">${_getTrans('rating')}</td>
                        <th data-trans="image" scope="col" class="col-img">${_getTrans('image')}</td>
                        <th data-trans="actions">${_getTrans('actions')}</th>`


        var tableBody = books.map((book, idx) => `
            <tr>
                <th class="col-idx" scope="row">${idx}</th>
                <td>${book.name}</td>
                <td class="col-price" data-price="${book.price}">${getFormatNumber(currencyConversion(book.price))}</td>
                <td class="col-rate">${book.rating}</td>
                <td class="col-img""><img onerror="this.onerror=null;this.src='${DEFAULT_IMG_LINK}';" src="${book.imgUrl}"</td>
                
                <td>
                    <div class="btn-group" role="group" aria-label="Basic example">
                        <button type="button" class="btn btn-secondary" data-toggle="modal"
                        data-bs-toggle="modal" data-bs-target="#updatePriceModal" data-trans="update-action">${_getTrans('update-action')}</button>
                        <button type="button" class="btn btn-secondary" data-trans="delete-action" onclick="onRemoveBook('${book.id}')">${_getTrans('delete-action')}</button>
                        <button type="button" class="btn btn-secondary" data-trans="read-action" onclick="onSetBookToUpdate('${book.id}'); onOpenUpdateRatingModal('${book.id}')" 
                        data-bs-toggle="modal" data-bs-target="#openBookModal">${_getTrans('read-action')}</button>
                    </div>
                </td>
            </tr>`)

        strHtml = `
        
            <table class="table table-dark">
                <thead>
                    <tr>
                        ${tableHead}  
                    </tr>
                </thead>
                    <tbody>
                        ${tableBody.join('')}
                    </tbody>
            </table>
        `


    } else {
        strHtml = books.map(book => `

                            <div class="card book-card" style="width: 18rem;">
                                <img class="card-img-top" onerror="this.onerror=null;this.src='${DEFAULT_IMG_LINK}';" src="${book.imgUrl}" alt="Card image cap">
                                <div class="card-body">
                                    <h5 class="card-title">${getFormatNumber(currencyConversion(book.price))}</h5>
                                    <p class="card-text">${book.name}</p>
                                    <div class="btn-group" role="group" aria-label="Basic example">
                                        <button type="button" class="btn btn-primary" data-toggle="modal" onclick="onSetBookToUpdate('${book.id}')"
                                        data-bs-toggle="modal" data-bs-target="#updatePriceModal" data-trans="update-action">${_getTrans('update-action')}</button>
                                        <button type="button" class="btn btn-primary" data-trans="delete-action" onclick="onRemoveBook('${book.id}')">${_getTrans('delete-action')}</button>
                                        <button type="button" class="btn btn-primary" data-trans="read-action" onclick="onSetBookToUpdate('${book.id}'); onOpenUpdateRatingModal('${book.id}')" 
                                        data-bs-toggle="modal" data-bs-target="#openBookModal">${_getTrans('read-action')}</button>
                                </div>
                                </div>
                            </div>`)
        strHtml = strHtml.join('')

    }

    document.querySelector('.books-layout').innerHTML = strHtml

}

function renderAppByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterParams = {
        maxPrice: queryStringParams.get('maxPrice') || '',
        minRate: queryStringParams.get('minRate') || 0,
        custom: queryStringParams.get('custom') || '',
    }
    const pageParams = {
        bookId: queryStringParams.get('bookId') || '',
        currPage: queryStringParams.get('page') || 0,
        lang: queryStringParams.get('lang') || 'eng'
    }


    document.querySelector('.price-filter-range').value = filterParams.maxPrice
    document.querySelector('.filter-rate-range').value = filterParams.minRate
    document.querySelector('.filter-custom-range').value = filterParams.custom

    _setPageByQueryParam(+pageParams.currPage)
    _setLangByQueryParam(pageParams.lang)
    setFilterBy(filterParams)
}



function updateWindowPath() {
    _setQueryStringByFilter()
    _setQueryStringByModal()
    _setQueryStringByPage()
    _setQueryStringByLang()

    const queryString = getQueryStringParams()

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function getQueryStringParams() {
    return `?maxPrice=${gQueryString.maxPrice}&minRate=${gQueryString.minRate}&custom=${gQueryString.custom}&bookId=${gQueryString.bookId}&page=${gQueryString.currPage}&lang=${gQueryString.lang}`
}



function onRemoveBook(bookId) {
    removeBook(bookId)

    renderPaging()
    renderBooks()
}

function onAddBook() {

    const bookName = document.querySelector(`.book-name-input`).value
    const price = +document.querySelector(`.book-price-input`).value
    const rating = +document.querySelector(`.book-rating-input`).value
    const imgUrl = document.querySelector(`.book-cover-input`).value || getImgPath()

    if (!bookName || !(price > 0 && price < 1000) || !(rating > 0 && rating <= 10)) {
        document.querySelector('.add-book-button').classList.add('shake')
        setTimeout(() => { document.querySelector('.add-book-button').classList.remove('shake') }, 500)
        return
    }

    addBook(bookName, price, rating, imgUrl)
    _resetFilters()

    renderPaging()
    renderBooks()
    _hideAddBookModal()
}

function onCloseBookModal() {
    closeBook()
    _hideAddBookModal()

    updateWindowPath()
    renderBooks()
    // doTrans()
}

function onSetBookToUpdate(bookId) {
    setBookToUpdate(bookId)
}

function onOpenUpdateRatingModal(bookId) {
    
    const book = getBookById(bookId)
    document.querySelector('.update-rating-modal-img').src = book.imgUrl.replace('200', '400') //make the img larger
    document.querySelector('.book-title').innerText = book.name
    document.querySelector('.abstract').innerText = book.abstract
    document.querySelector('.book-rating').innerText = book.rating
}

function onUpdateBook() {
    const price = +document.querySelector('.new-book-price-input').value

    if (!(price > 0 && price < 1000)) {
        document.querySelector('.add-book-button').classList.add('shake')
        setTimeout(() => { document.querySelector('.add-book-button').classList.remove('shake') }, 500)
        return
    }

    _hideUpdateRatingModal()

    updateBook(price)
    renderBooks()
}




function onSetRating(diff) {
    setRating(diff)
    const book = getBookToUpdate()

    document.querySelector('.book-rating').innerText = book.rating
    renderBooks()
}

function onSetSortBy(prop) {

    if (!prop && !getSortProp()) return
    else if (!prop) prop = getSortProp()

    const isDesc = document.querySelector('.sort-order-input').checked
    const sortBy = {
        prop,
        isDesc: isDesc ? 1 : -1,
    }

    setSortBy(sortBy)
    updateWindowPath()

    renderPaging()
    renderBooks()
}

function onSetFilterBy(filterObj) {
    setFilterBy(filterObj)
    onSetPage(0)

    updateWindowPath()
    renderPaging()
    renderBooks()
}

function onSetPage(page) {
    setPage(page)

    updateWindowPath()
    renderPaging()
    renderBooks()
}

function onSetLang(lang) {
    setLang(lang)
    setDisplayDirection()
    updateWindowPath()
    renderBooks()
    doTrans()
}

function onSetView(prefView) {
    setView(prefView)
    renderBooks()
}

function resetAddBookModalVals() {
    document.querySelector(`.book-name-input`).value = ''
    document.querySelector(`.book-author-input`).value = ''
    document.querySelector(`.book-price-input`).value = ''
    document.querySelector(`.book-rating-input`).value = ''
    document.querySelector(`.book-cover-input`).value = ''
}


function _setLangByQueryParam(lang) {
    setLang(lang)
}

function _hideAddBookModal() {
    const elBookModal = document.querySelector('.add-book-modal');
    const modal = bootstrap.Modal.getInstance(elBookModal)
    modal.hide();

    resetAddBookModalVals()
}

function _hideUpdateRatingModal() {
    const elBookModal = document.querySelector('.update-book-modal');
    const modal = bootstrap.Modal.getInstance(elBookModal)
    modal.hide();

    document.querySelector('.new-book-price-input').value = ''
}

function _setQueryStringByFilter() {
    const filterBy = getFilter()
    gQueryString.maxPrice = filterBy.maxPrice || ''
    gQueryString.minRate = filterBy.minRate || ''
    gQueryString.custom = filterBy.custom || ''
}

function _setQueryStringByModal() {
    const book = getBookToUpdate()
    gQueryString.bookId = book ? book.id : ''
}

function _setQueryStringByPage() {
    const currPage = getPagingData().currPage
    gQueryString.currPage = currPage
}

function _setQueryStringByLang() {
    const lang = getLang()
    gQueryString.lang = lang
}

function _setPageByQueryParam(page) {
    setPage(page)
}

function _resetFilters() {
    onSetFilterBy({})
}





