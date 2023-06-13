interface userDb {
    email: string,
    password: string
}
document.addEventListener("DOMContentLoaded", async () => {
    let passwordInputReg = <HTMLInputElement> document.getElementById("passwordInputReg");
    let userNameInputReg = <HTMLInputElement> document.getElementById("userNameInputReg");
    let inputForm = <HTMLElement> document.getElementById("inputForm");

    inputForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        let userInp: userDb = {
            email: <string> userNameInputReg.value,
            password: <string> passwordInputReg.value
        }
        console.log(userInp);
        await fetchRestEndpoint('http://localhost:3000/api/user/userCreate', 'PUT', userInp);
        window.location.href = `http://localhost:3000/index.html`;
    });
})

async function fetchRestEndpoint(route: string, method: 'GET' |'POST' |'PUT' |'DELETE', data?: object): Promise<any> {
    let options: any = { method };
    if (data) {
        options.headers = { 'Content-Type': 'application/json' };
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