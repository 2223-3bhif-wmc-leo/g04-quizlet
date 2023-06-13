interface setDb {
    setId: number,
    userEmail: string,
    title: string,
    description: string,
    isPublic: boolean
}

const queryParams = new URLSearchParams(window.location.search);
const email = <string>queryParams.get('email');
const setId = <string>queryParams.get('setid');
const title = <string>queryParams.get('title');
const description = <string>queryParams.get('description');

document.addEventListener("DOMContentLoaded", async () => {
    let inputForm = <HTMLElement>document.getElementById("inputForm");
    let titleForm = <HTMLInputElement>document.getElementById("titleInput");
    let descriptionForm = <HTMLInputElement>document.getElementById("descriptionInput");
    titleForm.setAttribute("value", title.replace("%20", " "));
    descriptionForm.setAttribute("value", description.replace("%20", " "));

    //Eventlistener for creating new Sets
    inputForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        titleForm = <HTMLInputElement>document.getElementById("titleInput");
        descriptionForm = <HTMLInputElement>document.getElementById("descriptionInput");
        let isPublic = <HTMLInputElement>document.getElementById("isPublic");
        const setUpdate: setDb = {
            setId: parseInt(setId),
            userEmail: email,
            title: titleForm.value,
            description: descriptionForm.value,
            isPublic: isPublic.checked
        }
        console.log(setUpdate);
        await fetchRestEndpoint('http://localhost:3000/api/set/updateOrInsertSet', 'PUT', setUpdate); // problem
    });
})
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

async function onDeleteBtn() {
    console.log(setId);
    window.location.href = `http://localhost:3000/overviewSets.html?email=${email}`;
    await fetchRestEndpoint(`http://localhost:3000/api/set/deleteSetById/${setId}`, 'DELETE');
}