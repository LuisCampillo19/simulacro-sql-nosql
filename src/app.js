import express from 'express';

const app = expres();

app.use(express.json());

app.get('/', (req,res) => {
    res.json({ message: 'Welcome to API of SaludPlus'});
});

export default app;