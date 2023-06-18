const queryParams = new URLSearchParams(window.location.search);
const getSetId = <number><unknown>queryParams.get('setid');

document.addEventListener("DOMContentLoaded", async () => {
    let learnSelection = <HTMLElement>document.getElementById('learnSelection');

    learnSelection.innerHTML += `<a href="quiz.html?setid=${getSetId}" class="btn btn-secondary">Quiz</a>`;
})