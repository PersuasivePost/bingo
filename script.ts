// export {};

// (() => {
//   const table = document.querySelector<HTMLTableElement>("#tablebingo");
//   const letter =
//     document.querySelectorAll<HTMLTableCellElement>(".letterbingo");
//   const msgContainer = document.querySelector<HTMLDivElement>(".msg-container");
//   const newBtn = document.querySelector<HTMLButtonElement>("#new-btn");

//   if (!table || !msgContainer || !newBtn) {
//     console.error("Essential DOM elements are missing.");
//     return;
//   }

//   let array: number[] = Array.from({ length: 25 }, (_, i) => i + 1);
//   shuffle(array);

//   function shuffle(arr: number[]): number[] {
//     let currentIndex = arr.length;
//     let randomIndex: number;

//     while (currentIndex !== 0) {
//       randomIndex = Math.floor(Math.random() * currentIndex);
//       currentIndex--;

//       [arr[currentIndex], arr[randomIndex]] = [
//         arr[randomIndex],
//         arr[currentIndex],
//       ];
//     }

//     return arr;
//   }

//   let iterator = 0;

//   for (let i = 0; i < 5; i++) {
//     const tr = document.createElement("tr");
//     table.appendChild(tr);

//     for (let j = 0; j < 5; j++) {
//       const td = document.createElement("td");
//       td.id = array[iterator].toString();
//       td.style.height = "20%";
//       td.style.width = "20%";
//       td.classList.add("main-table-cell");

//       const div = document.createElement("div");
//       div.classList.add("cellformat");
//       div.textContent = array[iterator].toString();
//       td.appendChild(div);
//       tr.appendChild(td);
//       iterator++;
//     }
//   }

//   const cell =
//     document.querySelectorAll<HTMLTableCellElement>(".main-table-cell");
//   let winIndex = 0;

//   cell.forEach((e) => {
//     e.addEventListener("click", () => {
//       e.classList.add("strikeout");

//       if (matchWin()) {
//         if (winIndex < letter.length) {
//           letter[winIndex].classList.add("showbingo");
//           winIndex++;
//         }

//         if (winIndex === 5) {
//           msgContainer.classList.remove("hide");
//         }
//       }
//     });
//   });

//   newBtn.addEventListener("click", () => {
//     location.reload();
//   });

//   const winningPositions: number[][] = [
//     [0, 1, 2, 3, 4],
//     [5, 6, 7, 8, 9],
//     [10, 11, 12, 13, 14],
//     [15, 16, 17, 18, 19],
//     [20, 21, 22, 23, 24],
//     [0, 5, 10, 15, 20],
//     [1, 6, 11, 16, 21],
//     [2, 7, 12, 17, 22],
//     [3, 8, 13, 18, 23],
//     [4, 9, 14, 19, 24],
//     [0, 6, 12, 18, 24],
//     [4, 8, 12, 16, 20],
//   ];

//   function matchWin(): boolean {
//     const cells =
//       document.querySelectorAll<HTMLTableCellElement>(".main-table-cell");

//     return winningPositions.some((combination, index) => {
//       const count = combination.reduce((acc, cellIndex) => {
//         return cells[cellIndex].classList.contains("strikeout") ? acc + 1 : acc;
//       }, 0);

//       if (count === 5) {
//         winningPositions.splice(index, 1);
//         return true;
//       }
//       return false;
//     });
//   }

//   console.log(array);
// })();
