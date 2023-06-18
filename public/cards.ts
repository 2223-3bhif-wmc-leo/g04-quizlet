async function fetchRestEndpoint(route: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: object): Promise<any> {
    let options: any = {method};
    if (data) {
        options.headers = {'Content-Type': 'application/json'};
        options.body = JSON.stringify(data);
    }
    const res = await fetch(route, options);
    if (!res.ok) {
        const error = new Error(`${method} ${res.url} ${res.status} (${res.statusText})`);
        throw error;
    }
    if (res.status !== 204) {
        return await res.json();
    }
}

const queryParams = new URLSearchParams(window.location.search);
const getSetId = <number><unknown>queryParams.get('setid');
let curCardIndex = 0;


async function showCurrentCard(sideIndex: number): Promise<number> {
    const allElements = await fetchRestEndpoint(`http://localhost:3000/api/setElement/getSetElementsBySetId/${getSetId}`, 'GET');
    let card = <HTMLElement>document.getElementById("vocabCard");

    const currentVocabulary = allElements[curCardIndex];
    let curWord = currentVocabulary._word;
    let curDef = currentVocabulary._definition;

    card.innerHTML =
        `<div class="card">
            <div class="card-body">
            <h1>${curCardIndex + 1}</h1>
            <h1>${sideIndex === 0 ? 'Word:' : 'Definition:'}</h1>
            <h2>${sideIndex === 0 ? curWord : curDef}</h2>
            </div>
        </div>`;

    return allElements.length;
}

document.addEventListener("DOMContentLoaded", async () => {
    let curSide: number = 0
    const setLength: number = await showCurrentCard(curSide);

    const prevButton = <HTMLElement>document.getElementById('prev');
    const flipButton = <HTMLElement>document.getElementById('flip');
    const nextButton = <HTMLElement>document.getElementById('next');

    document.addEventListener('keydown', (event) => {
        switch (event.key) {
            case 'ArrowLeft':
                prevButton.click();
                break;
            case 'Enter':
                flipButton.click();
                break;
            case 'ArrowRight':
                nextButton.click();
                break;
            default:
                break;
        }
    });

    prevButton.addEventListener('click', async function () {
        if(curCardIndex !== 0){
            curCardIndex--;
            curSide = 0;
            await showCurrentCard(curSide)
        }
    });

    flipButton.addEventListener('click', async function () {
        curSide = (curSide === 0) ? 1 : 0;

        await showCurrentCard(curSide)
    });

    nextButton.addEventListener('click', async function () {
        if(curCardIndex !== setLength - 1){
            curCardIndex++;
            curSide = 0;
            await showCurrentCard(0)
        }
    });
});