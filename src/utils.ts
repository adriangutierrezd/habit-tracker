export const getHeaders = (token: string | null): Headers => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    if(token) {
        myHeaders.append('Authorization', `Bearer ${token}`)
    }
    myHeaders.append('Accept', 'application/json')
    return myHeaders
}