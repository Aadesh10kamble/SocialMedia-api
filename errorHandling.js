const errorHandler = (error) => {
    const { code, keyValue,message } = error;
    console.log ("code : ",code);
    console.log ("message : ",message);
    if (code && code === 11000) return `Email "${keyValue.email}" already exists`;
    if (message) return (message.split (':').at (-1).trim ());
};


export default errorHandler;