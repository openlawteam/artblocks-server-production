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
    refresh: {
      type: 'boolean',
      alias: 'r',
    }
  },

  boolean: ['help', 'version'],
  alias: { h: 'help', v: 'version'}
})

const renderEngine2BaseUrl = "http://render-engine-mainnet-2-11808.nodechef.com"
const renderEngine1BaseUrl = "http://render-engine-mainnet-1-11808.nodechef.com"

const apiBaseUrl = "https://api.artblocks.io/"

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
    // let url = isEven(index) ? renderEngine1BaseUrl : renderEngine2BaseUrl
    let url = new URL(path.join(`image/${index}`, refresh ? 'refresh' : ''), apiBaseUrl).href
    console.log(`Running image generation for: ${url}`)

    const res = await axios.get(url)
    console.log(res.status, res.statusText, '\n')
    await sleep(1000)
  }
  
  console.log('Process completed!')
}

run(cli.flags)



