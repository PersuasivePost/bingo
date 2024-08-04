const table = document.querySelector("#tablebingo");
const letter = document.querySelectorAll(".letterbingo");
const msgContainer = document.querySelector(".msg-container");
const newBtn = document.querySelector("#new-btn");

let array = Array.apply(null, { length: 26 }).map(Number.call, Number);

array.shift();
shuffle(array);

function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

let iterator = 0;

for (let i = 0; i < 5; i++) {
    let tr = document.createElement("tr");
    table.appendChild(tr);

    for (let j = 0; j < 5; j++) {
        let td = document.createElement("td");
        td.id = array[iterator].toString();
        td.style.height = "20%";
        td.style.width = "20%";
        td.classList.add("main-table-cell");

        let div = document.createElement("div");
        div.classList.add("cellformat");
        div.textContent = array[iterator].toString();
        td.appendChild(div);
        tr.appendChild(td);
        iterator++;
    }
}

const d = document.getElementById("headdd");
const btn = document.getElementById("btn");

const cell = document.querySelectorAll(".main-table-cell");
let winIndex = 0;
cell.forEach(e => {
    e.addEventListener("click", () => {
        e.classList.add("strikeout");

        if (matchWin()) {
            letter[winIndex].classList.add("showbingo");
            winIndex++;

            if (winIndex === 5) {
                // // d.style.display = "inline";
                // // headdd.style.width = "200px";
                // // btn = location.reload();
                // alert('B I N G O');
                // location.reload();
                msgContainer.classList.remove("hide");
            }
        }
    });
});

newBtn.addEventListener("click", () => {
    location.reload();
})

const winningPositions = [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24],
    [4, 8, 12, 16, 20]
];

function matchWin() {
    const cell = document.querySelectorAll(".main-table-cell");

    return winningPositions.some((combination, index) => {
        let count = 0;
        combination.forEach(index => {
            if (cell[index].classList.contains("strikeout")) count++;
        });

        if (count === 5) {
            winningPositions.splice(index, 1);
            return true;
        }

        return false;
    });
}

console.log(array);

