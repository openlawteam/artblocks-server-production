Art Blocks Server

Create the .env file with the environment Variables
```
CONTRACT_ADDRESS=
INFURA_KEY=
PORT=3000
```

Building the Docker image
> docker build . -t thelao/flaming-ab-server:1

Running it
> docker run -p 3000:3000 --env-file=.env thelao/flaming-ab-server:1
