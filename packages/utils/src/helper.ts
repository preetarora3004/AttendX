

export const handleSubmit = async (e: any, username: string, password: string) => {
    e.preventDefault()

    const res = await fetch("api/signin", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username,
            password
        })
    })

    const data = await res.json();
    console.log(data);
}