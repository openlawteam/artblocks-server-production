Art Blocks Server

Create the .env file with the environment Variables
```
CONTRACT_ADDRESS=
INFURA_KEY=
PORT=3000
ALLOWED_DOMAINS=http://localhost:3000
```

Building the Docker image
> docker build . -t thelao/flamingo-ab-server:1

Running it
> docker run -p 8080:3000 --env-file=.env thelao/flamingo-ab-server:1
