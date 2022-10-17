'use strict'



const booksDBKey = 'booksDB'
const selectedBookKey = 'selectedBook'
const viewPreferenceKey = 'viewPref'
const BOOKS_PER_PAGE = 4
const LIST_VIEW_BOOKS_PER_PAGE = 10


var gBooks
var gSortBy
var gViewPref
var gFilterBy = {}
var gBookToUpdate

_createBooks()
_createViewPref()


var gPaging = {
    currPage: 0,
    maxPage: Math.floor(gBooks.length / BOOKS_PER_PAGE),
    booksPerPage: BOOKS_PER_PAGE,
}


function getBooks() {
    var books = gBooks

    if (gSortBy) sortBy(books)
    
    // Filtering
    if (gFilterBy.maxPrice) books = books.filter(book => book.price <= gFilterBy.maxPrice)
    if (gFilterBy.minRate) books = books.filter(book => book.rating >= gFilterBy.minRate)
    if (gFilterBy.custom) books = books.filter(book => book.name.toLowerCase().includes(gFilterBy.custom.toLowerCase()))

    gPaging.booksPerPage = gViewPref === 'list' ? 10 : BOOKS_PER_PAGE;
    _updateMaxPage(books.length)

    var startIdx = gPaging.currPage * gPaging.booksPerPage
    books = books.slice(startIdx, startIdx + gPaging.booksPerPage)
    
    return books
}

function updateBook(newPrice) {
    const bookIdx = _getBookIdxById(gBookToUpdate)
    gBooks[bookIdx].price = newPrice
    _saveBooksToStorage()
}

function removeBook(bookId) {
    const bookIdx = _getBookIdxById(bookId)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function addBook(name, price, rating, img) {
    const book = _createBook(name, price, rating, img)
    gBooks.unshift(book)
    _saveBooksToStorage()
}



function setSortBy(sortBy) {
    gSortBy = sortBy
}

function sortBy(books) {
    if (gSortBy.prop === 'price' || gSortBy.prop === 'rating') {
        books.sort((book1, book2) =>  (book1[gSortBy.prop] - book2[gSortBy.prop]) * gSortBy.isDesc)
    } else {
        books.sort((book1, book2) =>  {return book1[gSortBy.prop].localeCompare(book2[gSortBy.prop]) * gSortBy.isDesc})
    }
}

function setFilterBy(filterObj = {}) {
    if (filterObj.maxPrice !== undefined) gFilterBy.maxPrice = +filterObj.maxPrice
    if (filterObj.minRate !== undefined) gFilterBy.minRate = +filterObj.minRate
    if (filterObj.custom !== undefined) gFilterBy.custom = filterObj.custom

    return gFilterBy
}

function setBookToUpdate(bookId) {
    gBookToUpdate = bookId
}

function getBookToUpdate() {
    return gBookToUpdate
}

function getFilter() {
    return gFilterBy
}






function setRating(diff) {
    const book = getBookToUpdate()
    
    if (!book.rating && diff === -1) return
    if (book.rating === 10 && diff === 1) return

    book.rating += diff
    _saveBooksToStorage()
}

function openBook(bookId) {
    const book = getBookById(bookId)
    if (!book) return null

    book.isOpen = true
    _saveBooksToStorage()

    return book
}

function closeBook() {
    const book = getBookToUpdate()
    book.isOpen = false
    _saveBooksToStorage()
}

function getBookToUpdate() {
    return getBookById(gBookToUpdate)
}

function getBookById(bookId) {
    return gBooks.find(book => book.id === bookId)
}




function setPage(page) {
    gPaging.currPage = page
}

function getViewPref() {
    return gViewPref
}

function setView(prefView){  
    gViewPref = prefView
    saveToStorage(viewPreferenceKey, gViewPref) 
}

function getPagingData() {
    return gPaging
}

function isValidPage(page) {
    if (page > 0 && page < gPaging.maxPage) return true
    return false
}

function getSortProp() {
    return gSortBy?.prop
}



function _getBookIdxById(bookId) {
    return gBooks.findIndex(book => book.id === bookId)
}

function _saveBooksToStorage() {
    saveToStorage(booksDBKey, gBooks)
}

function _updateMaxPage(numOfBooks) {
    const maxPage = Math.floor(numOfBooks / gPaging.booksPerPage)

    gPaging.maxPage = maxPage
}

function _createBooks() {
    var books = loadFromStorage(booksDBKey)

    if (!books || !books.length) {
        books = []
        for (var i = 0; i < 150; i++) {
            books.push(_createBook())
        }
    }

    gBooks = books
    _saveBooksToStorage()
}

function _createBook(name = getEnglishLorem(getRandomIntInclusive(2, 5)), price = getRandomIntInclusive(50, 270), rating = getRandomIntInclusive(0, 10), imgUrl = getImgPath()) {
    return {
        id: getId(),
        name,
        price,
        imgUrl, 
        isOpen: false,
        rating,
        abstract: getEnglishLorem(50),
    }
}

function _createViewPref() {
    var viewPref = loadFromStorage(viewPreferenceKey)

    if (!viewPref) {
        viewPref = 'list'
    }

    gViewPref = viewPref
    saveToStorage(viewPreferenceKey, gViewPref)
}
