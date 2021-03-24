const { request: grequest, gql } = require("graphql-request");

const artblocksSubgraphUrl =
  "https://api.thegraph.com/subgraphs/name/artblocks/art-blocks";

async function getTokenAndProject(tokenId) {
  const query = gql`
    query getTokenAndProject($id: ID!) {
      token(id: $id) {
        id
        hash
        project {
          id
          description
          name
          artistName
          website
          baseUri
          license
          dynamic
          script
          scriptJSON
          scriptCount
          useHashString
          artistAddress
          additionalPayee
          additionalPayeePercentage
          royaltyPercentage
          invocations
          maxInvocations
          paused
          currencySymbol
          currencyAddress
          tokens
        }
      }
    }
  `;

  const variables = {
    id: parseInt(tokenId, 10),
  };
  const data = await grequest(artblocksSubgraphUrl, query, variables);
  return data;
}

async function getProject(projectId) {
  const query = gql`
    query getProject($id: ID!) {
      project(id: $id) {
        id
        description
        name
        artistName
        website
        baseUri
        license
        dynamic
        script
        scriptJSON
        scriptCount
        useHashString
        artistAddress
        additionalPayee
        additionalPayeePercentage
        royaltyPercentage
        pricePerTokenInWei
        invocations
        maxInvocations
        paused
        currencySymbol
        currencyAddress
        tokens {
          id
        }
      }
    }
  `;

  const variables = {
    id: parseInt(projectId, 10),
  };
  const data = await grequest(artblocksSubgraphUrl, query, variables);
  return data;
}

async function getPlatform() {
  const query = gql`
    {
      platform(id: "ArtBlocks") {
        id
        admin
        artblocksAddress
        artblocksPercentage
        nextProjectId
      }
    }
  `;

  const data = await grequest(artblocksSubgraphUrl, query);
  return data;
}

module.exports = {
  getTokenAndProject,
  getProject,
  getPlatform,
};
