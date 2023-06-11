interface setDb {
    setid: number,
    userEmail: string,
    title: string,
    description: string,
    ispublic: boolean
}

interface setInsertDb {
    userEmail: string,
    title: string,
    description: string,
    isPublic: boolean
}

document.addEventListener("DOMContentLoaded", async () => {
    let inputForm = <HTMLElement>document.getElementById("inputForm");
    inputForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        let title = <HTMLInputElement>document.getElementById("titleInput");
        let userNameInputReg = <HTMLInputElement>document.getElementById("descriptionInput");
        let isPublic = <HTMLInputElement>document.getElementById("isPublic");

        const queryParams = new URLSearchParams(window.location.search);
        const email = <string>queryParams.get('email');
        const setInsert: setInsertDb = {
            userEmail: email,
            title: title.value,
            description: userNameInputReg.value,
            isPublic: isPublic.checked
        }
        await fetchRestEndpoint('http://localhost:3000/api/set/updateOrInsertSet', 'PUT', setInsert);
    })
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