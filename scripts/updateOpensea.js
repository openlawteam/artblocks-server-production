#!/usr/bin/env node
'use strict';

const axios = require('axios');
const path = require('path')

const cli = require('meow')(`
  Usage: rerenderLive [options]

  Other options:
    -h, --help          show usage information
    -v, --version       print version info and exit
    -s, --startTokenId  tokenId to start at
    -e, --endTokenId    tokenId to end at (required if amount not present)
    -a, --amount        amount of tokens to process beginning from startTokenId (required if endTokenId not present)
    -r, --refresh       force refresh
    -i, --interval      time between image generation calls (defaults to 1s)
`, {
  description: "Utility helper to re-render images live on the server",
  flags: {
    startTokenId: {
      type: 'number',
      alias: 's',
      isRequired: true
    },
    endTokenId: {
      type: 'number',
      alias: 'e',
      isRequired: (flags) => {
        if (flags.amount) {
          return false
        }
        return true
      }
    },
    amount: {
      type: 'number',
      alias: 'a',
      isRequired: (flags) => {
        if (flags.endTokenId) {
          return false
        }
        return true
      }
    },
  },

  boolean: ['help', 'version'],
  alias: { h: 'help', v: 'version'}
})


const apiBaseUrl = "https://api.opensea.io/asset/0xa7d8d9ef8d8ce8992df33d8b8cf4aebabd5bd270/"

const isEven = (value) => {
	if (value % 2 === 0) {
    return true
  }
	return false
}


const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const run = async (flags) => {
  let { startTokenId, endTokenId, refresh, amount } = flags
  
  if (!endTokenId && amount) {
    endTokenId = startTokenId + amount
  }

  if ((endTokenId - startTokenId) < 1) {
    throw new Error(`Your token ID range, ${startTokenId} - ${endTokenId}, is invalid.`)
  }

  for (let index = startTokenId; index <= endTokenId; index++) {
    let url = new URL(path.join(`${index}/?force_update=true`), apiBaseUrl).href
    console.log(`Running force update for : ${url}`)

    const res = await axios.get(url)
    console.log(res.status, res.statusText, '\n')
    await sleep(1000)
  }
  
  console.log('Process completed!')
}

run(cli.flags)



