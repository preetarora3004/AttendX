import app from "@workspace/backend/app"

const PORT = process.env.PORT || 3000;

app.listen(3000, '0.0.0.0', ()=>{
    console.log(`Server is running at the ${PORT}`);
})