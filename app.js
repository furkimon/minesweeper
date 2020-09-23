document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    const flagsDisplay = document.querySelector('.flags')
    const minDisplay = document.querySelector('.min')
    const secDisplay = document.querySelector('.sec')
    const gameScreen = document.querySelector('.gameScreen')
    const initialScreen = document.querySelector('.initialScreen')
    var entry = document.getElementById('entry')
    const entryButton = document.querySelector('.entryButton')

    let sec = 60
    let width = 10
    let squares = []
    let bombAmount
    let flags = 0
    let isGameOver = false
    //create board

    function getNumberOfMines() {
        if (entry.value < 101 && entry.value > 0) {
            bombAmount = parseInt(entry.value)
            createBoard()
            gameScreen.style.display = "flex"
            gameScreen.style.flexDirection = "column"
            initialScreen.style.display = "none"
        } else if (entry.value > 100) alert('TOO MANY')
        else if (entry.value < 1) alert('TOO FEW')
    }

    entryButton.addEventListener('click', () => getNumberOfMines())

    function restartGame() {
        document.location.href = ''
    }


    function createBoard() {
        const bombsArray = Array(bombAmount).fill('bomb')
        const emptyArray = Array(width * width - bombAmount).fill('valid')
        const gameArray = emptyArray.concat(bombsArray)
        const shuffledArray = gameArray.sort(() => Math.random() - 0.5)

        // put squares
        for (let i = 0; i < width * width; i++) {
            const square = document.createElement('div')
            square.setAttribute('id', i)
            square.classList.add(shuffledArray[i])
            grid.appendChild(square)
            squares.push(square)

            square.addEventListener('click', ()=>  {
                click(square)
            })

            square.oncontextmenu = function (e) {
                e.preventDefault()
                addFlag(square)
            }
        }

        //add numberrs

        for (let i = 0; i < squares.length; i++) {
            let total = 0
            const isLeftEdge = (i % width === 0)
            const isRightEdge = (i % width === width - 1)

            if (squares[i].classList.contains('valid')) {
                if (i > 0 && !isLeftEdge && squares[i - 1].classList.contains('bomb')) total++    //sol
                if (i > 10 && !isLeftEdge && squares[i - 1 - width].classList.contains('bomb')) total++  //sol ust
                if (i > 9 && squares[i - width].classList.contains('bomb')) total++                 // ust
                if (i > 9 && !isRightEdge && squares[i + 1 - width].classList.contains('bomb')) total++   // sag ust
                if (i < 99 && !isRightEdge && squares[i + 1].classList.contains('bomb')) total++         // sag 
                if (i < 90 && !isLeftEdge && squares[i - 1 + width].classList.contains('bomb')) total++  // sol alt
                if (i < 90 && squares[i + width].classList.contains('bomb')) total++  // alt
                if (i < 89 && !isRightEdge && squares[i + 1 + width].classList.contains('bomb')) total++ //sag alt
                squares[i].setAttribute('data', total)
            }
        }
        timeDisplay()
        displayText()
    }



    function addFlag(square) {
        if (isGameOver) return
        if (!square.classList.contains('checked')) {
            if (!square.classList.contains('flag') && flags < bombAmount) {
                square.classList.add('flag')
                square.innerHTML = '🚩'
                flags++
                checkForWin()
            } else if (square.classList.contains('flag')) {
                square.classList.remove('flag')
                square.innerHTML = ''
                flags--
            }

            displayText()
        }
    }

    function click(square) {
        let currentId = square.id
        if (isGameOver) return
        if (square.classList.contains('checked') || square.classList.contains('flag')) return
        if (square.classList.contains('bomb')) {
            square.classList.add('gameOver')
            gameOver(square)
        } else {
            let total = square.getAttribute('data')
            if (total != 0) {
                square.classList.add('checked')
                square.innerHTML = total
                return
            }

            checkSquare(currentId)

        }
        square.classList.add('checked')
    }

    function checkSquare(currentId) {
        const isLeftEdge = (currentId % width === 0)
        const isRightEdge = (currentId % width === width - 1)

        setTimeout(() => {
            if (currentId > 0 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 10 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9) {
                const newId = squares[parseInt(currentId) - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId > 9 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 - width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 99 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90 && !isLeftEdge) {
                const newId = squares[parseInt(currentId) - 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 90) {
                const newId = squares[parseInt(currentId) + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
            if (currentId < 89 && !isRightEdge) {
                const newId = squares[parseInt(currentId) + 1 + width].id
                const newSquare = document.getElementById(newId)
                click(newSquare)
            }
        }, 10)
    }

    function gameOver(square) {
        isGameOver = true
        squares.forEach(square => {
            if (square.classList.contains('bomb')) {
                if (square.classList.contains('flag')) square.innerHTML = ''
                square.classList.add('gameOver')
            }
        })
        flagsDisplay.innerHTML = "GAME OVER"
        const restartButton = document.createElement('div')
        restartButton.classList.add('restart')
        gameScreen.appendChild(restartButton)
        restartButton.innerHTML = 'RESTART'
        restartButton.addEventListener('click', () => restartGame())
    }

    

    function checkForWin() {
        let matches = 0
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb'))
                matches++
            if (matches === bombAmount) {
                isGameOver = true
                displayText()
            }
        }
    }

    function displayText() {
        if (!isGameOver) flagsDisplay.innerHTML = bombAmount - flags
        else flagsDisplay.innerHTML = "YOU WON"
    }

    function timeDisplay() {
        let timer

        timer = setInterval(() => {
            if (!isGameOver) {
                sec--
                if (sec != 0) {
                    if (sec != 60 && sec > 9) { secDisplay.innerHTML = sec, minDisplay.innerHTML = '00' }
                    else if (sec <= 9) secDisplay.innerHTML = '0' + sec
                    else secDisplay.innerHTML = '00'
                } else {
                    secDisplay.innerHTML = '00'
                    gameOver()
                    clearInterval(timer)
                }
            } else {
                clearInterval(timer)
            }
        }, 1000)

    }
})