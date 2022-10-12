'use strict'

const ON = true
const OFF = false
const DEFAULT_IMG_URL = `https://media.istockphoto.com/vectors/blank-vertical-book-template-vector-id466564401?k=20&m=466564401&s=612x612&w=0&h=NiRU_zs-41qKY4T-yMe1_YxB1OgXfFRe4qNm8h5k7E8=`


var gQueryString = {}

function onInit() {
    renderApp()
}



function renderApp() {
    renderDataByQueryStringParams()
    renderPaging()
    renderBooks()
}

function renderPaging() {
    
    const currPage = getPagingData().currPage
    const maxPage = getPagingData().maxPage

    const elBtns = document.querySelectorAll('.scroll-page-btns button')

    elBtns.forEach((btn, idx) => {
        if (btn.dataset.operation === 'prev') {
            btn.dataset.next = currPage - 1
            btn.disabled = isInvalidPage(currPage - 1)
        } else if (+btn.dataset.operation < 5) {
            btn.dataset.next = idx
            btn.innerText = idx
            btn.disabled = isInvalidPage(idx) 
        } else if (+btn.dataset.operation === 5) {
            btn.dataset.next = currPage + 5
            btn.disabled = isInvalidPage(currPage + 5) 
        } else if (btn.dataset.operation === 'max') {
            btn.dataset.next = maxPage 
            btn.innerText = maxPage 
        } else {
            btn.dataset.next = currPage + 1
            btn.disabled = isInvalidPage(currPage + 1) 
        }
    })

    const page = document.querySelector('.page span')
    page.innerText = currPage
}

function renderBooks() {
    const books = getBooks()
    const view = getViewPref()
    var elSectionStrHtml

    if (view === 'list') {
        var booksKeys = ['ID', 'Name', 'Price', 'Rating']
        booksKeys = booksKeys.map(key => `\n\t<td class="cursor-pointer" onclick="onSetSortType('${key.toLowerCase()}')">${key}</td>`)
        booksKeys.push(`\n\t<td>Image</td>`)
        booksKeys.push(`\n\t<td colspan="3">Options</td>`)
    
        //  Change name
        const strHTMLsTableBodyTd = books.map((book) => `
            <tr>
                <td>${book.id}</td>
                <td>${book.name}</td>
                <td>${book.price}</td>
                <td>${book.rating}</td>
                <td><img onerror="this.src = '${DEFAULT_IMG_URL}'" src="${book.imgUrl}"></img></td>
                <td><button onclick="onOpenBookModal('${book.id}')">Read</button></td>
                <td><button onclick="onUpdateBook('${book.id}')">Update</button></td>
                <td><button onclick="onRemoveBook('${book.id}')">Delete</button></td>
            </tr>
        `)
    
        const elTable = ` <table class="table-layout">
                                <thead>
                                    <tr>
                                        ${booksKeys.join('')} 
                                    </tr>
                                </thead>
                                <tbody class="table-body">
                                    ${strHTMLsTableBodyTd.join('')}
                                </tbody>
                            </table>`
        
        elSectionStrHtml = elTable
    } else {
        // books-action-container  |  btn classes: action-read action
        const articles = books.map(book => `
        <article>
            <img src="${book.imgUrl}">
            <p>${book.name}</p>
            <div class="books-option-btns-container">
                <button onclick="onOpenBookModal('${book.id}')">Read</button></td>
                <button onclick="onUpdateBook('${book.id}')">Update</button></td>
                <button onclick="onRemoveBook('${book.id}')">Delete</button></td>
            </div>
        </article>`)
        elSectionStrHtml = articles.join('')
    }


    
    const elSection = document.querySelector('.books-layout')
    elSection.innerHTML = elSectionStrHtml
}

function updateWindowPath() {
    _setQueryStringByFilter()
    _setQueryStringByModal()
    _setQueryStringByPage()

    const queryString = getQueryStringParams()

    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryString
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function getQueryStringParams() {
    return `?maxPrice=${gQueryString.maxPrice}&minRate=${gQueryString.minRate}&custom=${gQueryString.custom}&bookId=${gQueryString.bookId}&page=${gQueryString.currPage}`
}

function renderDataByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterParams = {
        maxPrice: queryStringParams.get('maxPrice') || '',
        minRate: queryStringParams.get('minRate') || 0,
        custom: queryStringParams.get('custom') || '',
    }
    const pageParams = {
        bookId: queryStringParams.get('bookId') || '',
        currPage: queryStringParams.get('page') || 0,
    }

    // if (!filterParams.maxPrice && !filterParams.minRate && !filterParams.custom && !modalParams.bookId && !modalParams.currPage) return

    
    document.querySelector('.filter-price-range').value = filterParams.maxPrice
    document.querySelector('.filter-rate-range').value = filterParams.minRate
    document.querySelector('.custom-filter').value = filterParams.custom

    _setOpenBookByQueryParam(pageParams.bookId)
    _setPageByQueryParam(+pageParams.currPage)
    setFilterBy(filterParams)
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    renderApp()
}

function onAddBook() {

    const bookName = document.querySelector(`[name="name"]`).value
    const price = +document.querySelector(`[name="price"]`).value
    const rating = +document.querySelector(`[name="rating"]`).value
    const imgUrl = document.querySelector(`[name="imgUrl"]`).value || getImgPath()

    if (!bookName || !(price > 0 && price < 1000) || !(rating >= 0 && rating <= 10)) {
        document.querySelector('.add-book-btn').classList.add('shake')
        setTimeout(() => {document.querySelector('.add-book-btn').classList.remove('shake')}, 500)
        return
    }

    addBook(bookName, price, rating, imgUrl)
    _resetFilters()
    renderApp()
    onCloseAddBookModal()
}

function onOpenBookModal(bookId) {

    const book = openBook(bookId)
    
    document.querySelector('.abstract').innerText = book.abstract
    document.querySelector('.id span').innerText = book.id
    document.querySelector('.name span').innerText = book.name
    document.querySelector('.price span').innerText = book.price
    document.querySelector('.img-url span').innerText = book.imgUrl
    document.querySelector('.rating span').innerText = book.rating
   
    // CR Implement: 
    // document.querySelector('.book-rate').innerHTML=    `
    // <p>Rating: </p>
    // <button onclick="onSetRating(-1, '${book.id}')">➖</button>
    // <span class="rating"><span></span></span>
    // <button onclick="onSetRating(+1, '${book.id}')">➕</button>
    // `
    
    _setModalDisplay(ON)
    updateWindowPath()
}

function onCloseBookModal() {
    closeBook()
    _setModalDisplay(OFF)

    updateWindowPath()
    renderApp()
}

function onUpdateBook(bookId) {
    const price = prompt('New price?')
    updateBook(bookId, price)
    renderApp()
}




function onSetRating(operation) {  
    setRating(operation)
    const book = getOpenedBook()

    document.querySelector('.rating span').innerText = book.rating
}

function onSetSortBy() {
    const prop = document.querySelector('.sort-by').value

    if (!prop) return

    const isDesc = document.querySelector('.sort-desc').checked
    const sortBy = {
        prop,
        isDesc: isDesc ? 1 : -1,
    }

    setSortBy(sortBy)
    updateWindowPath()
    renderApp()
}

function onSetSortType(type) {
    if (type === document.querySelector('.sort-by').value) {
        document.querySelector('.sort-desc').checked = !document.querySelector('.sort-desc').checked
        onSetSortBy()
        return
    }

    document.querySelector('.sort-by').value = type
    onSetSortBy()
}

function onSetFilterBy(filterObj) {
    setFilterBy(filterObj)
    onSetPage(0)

    updateWindowPath()
    renderApp()
}

function onSetPage(page) {
    setPage(page)

    updateWindowPath()
    renderPaging()
    renderBooks()
}

function onOpenAddBookModal() {
    const elModal = document.querySelector('.dark-overlay')
    elModal.classList.remove('hide-by-display')
}

function onCloseAddBookModal() {
    document.querySelector(`[name="name"]`).value = ''
    document.querySelector(`[name="price"]`).value = ''
    document.querySelector(`[name="rating"]`).value = ''
    document.querySelector(`[name="imgUrl"]`).value = ''

    const elModal = document.querySelector('.dark-overlay')
    elModal.classList.add('hide-by-display')
}



function onSwitchBooksDisplay() {
    var view = getViewPref()
    toggleBooksViewPref()
    renderApp()

    const elImg = document.querySelector('.view-switch-img')
    elImg.src = `img/${view}-icon.png`
}



function _setModalDisplay(state) {
    const elModal = document.querySelector('.book-information-modal')
    if (state) elModal.classList.add('display-by-slide')
    else elModal.classList.remove('display-by-slide')
}

function _setQueryStringByFilter() {
    const filterBy = getFilter()
    gQueryString.maxPrice = filterBy.maxPrice || ''
    gQueryString.minRate = filterBy.minRate || ''
    gQueryString.custom = filterBy.custom || ''
}

function _setQueryStringByModal() {
    const book = getOpenedBook()
    gQueryString.bookId = book ? book.id : ''
}

function _setQueryStringByPage() {
    const currPage = getPagingData().currPage
    gQueryString.currPage = currPage
}

function _setOpenBookByQueryParam(bookId) {
    if (!bookId) return
    onOpenBookModal(bookId)
}

function _setPageByQueryParam(page) {
    onSetPage(page)
}

function _resetFilters() {
    onSetFilterBy({})
}

function get() {
    var v1 = 'price'
}





