async function PostJson(Url, Data) {
    const Response = await fetch(Url, {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(Data),
        credentials: 'omit'
    });

    const Raw = await Response.text();
    let Result;
    try {
        Result = JSON.parse(Raw);
    } catch (Err) {
        throw new Error('The server did not return a valid response.');
    }

    if (!Response.ok) {
        throw new Error(Result?.Notice || 'The server could not save your feedback.');
    }
    if (Result?.saved !== true) {
        throw new Error('The server did not confirm that your feedback was saved.');
    }
    return Result;
}
