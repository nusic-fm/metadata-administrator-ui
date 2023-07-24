export const musicTokensInWalletQuery = `#graphql
  query MyQuery($owner: [String!] $endCursor: String) {
      tokens(    
        where: {ownerAddresses: $owner}
        filter: {mediaType: AUDIO}
        pagination: {limit: 100, after: $endCursor}
        networks: [{network: OPTIMISM, chain: OPTIMISM_MAINNET}, {network: ETHEREUM, chain: MAINNET}]
        ){
        nodes{
            token {
                collectionName
                tokenId
                tokenUrlMimeType
                name
                content {
                mimeType
                url
                mediaEncoding {
                    ... on AudioEncodingTypes {
                    large
                    original
                    }
                    ... on ImageEncodingTypes {
                    large
                    poster
                    original
                    thumbnail
                    }
                    ... on VideoEncodingTypes {
                    large
                    poster
                    original
                    preview
                    thumbnail
                    }
                    ... on UnsupportedEncodingTypes {
                    __typename
                    original
                    }
                }
                size
                }
                collectionAddress
                # description
                image {
                mediaEncoding {
                    ... on ImageEncodingTypes {
                    large
                    poster
                    original
                    thumbnail
                    }
                    ... on VideoEncodingTypes {
                    large
                    poster
                    original
                    preview
                    thumbnail
                    }
                    ... on AudioEncodingTypes {
                    large
                    original
                    }
                    ... on UnsupportedEncodingTypes {
                    __typename
                    original
                    }
                }
                mimeType
                size
                url
                }
                # lastRefreshTime
                metadata
                tokenStandard
                tokenUrl
                # mintInfo {
                #     originatorAddress
                #     price {
                #         chainTokenPrice {
                #             raw
                #             decimal
                #             currency {
                #                 address
                #                 decimals
                #                 name
                #             }
                #         }
                #         blockNumber
                #         nativePrice {
                #             currency {
                #                 address
                #                 decimals
                #                 name
                #             }
                #             decimal
                #             raw
                #         }
                #         usdcPrice {
                #             decimal
                #             raw
                #             currency {
                #                 address
                #                 decimals
                #                 name
                #             }
                #         }
                #     }
                #     toAddress
                #     mintContext {
                #         blockNumber
                #         transactionHash
                #         blockTimestamp
                #     }
                # }
                # owner
            }
            # marketsSummary {
            #     collectionAddress
            #     marketAddress
            #     marketType
            #     status
            #     tokenId
            #     price {
            #         chainTokenPrice {
            #             raw
            #             decimal
            #             currency {
            #                 address
            #                 decimals
            #                 name
            #             }
            #         }
            #         blockNumber
            #         chainTokenPrice {
            #             raw
            #             decimal
            #             currency {
            #                 address
            #                 decimals
            #                 name
            #             }
            #         }
            #         usdcPrice {
            #             decimal
            #             raw
            #             currency {
            #                 address
            #                 decimals
            #                 name
            #             }
            #         }
            #     }
            #     transactionInfo {
            #         blockNumber
            #         blockTimestamp
            #         transactionHash
            #     }
            # }
            # sales {
            #     tokenId
            #     saleType
            #     sellerAddress
            #     saleContractAddress
            #     price {
            #     nativePrice {
            #         currency {
            #         address
            #         decimals
            #         name
            #         }
            #         decimal
            #         raw
            #     }
            #     blockNumber
            #     }
            #     collectionAddress
            #     buyerAddress
            #     transactionInfo {
            #     transactionHash
            #     blockNumber
            #     blockTimestamp
            #     }
            # }
        }
        pageInfo {
            hasNextPage
            endCursor
        }
      }
  }
    `;

export const tokensInWalletQuery = `#graphql
  query MyQuery($owner: [String!] $endCursor: String) {
      tokens(    
        where: {ownerAddresses: $owner}
        # filter: {mediaType: AUDIO}
        pagination: {limit: 100, after: $endCursor}
        networks: [{network: OPTIMISM, chain: OPTIMISM_MAINNET}, {network: ETHEREUM, chain: MAINNET}]
        ){
        nodes{
            token {
                collectionName
                tokenId
                tokenUrlMimeType
                name
                content {
                mimeType
                url
                mediaEncoding {
                    ... on AudioEncodingTypes {
                    large
                    original
                    }
                    ... on ImageEncodingTypes {
                    large
                    poster
                    original
                    thumbnail
                    }
                    ... on VideoEncodingTypes {
                    large
                    poster
                    original
                    preview
                    thumbnail
                    }
                    ... on UnsupportedEncodingTypes {
                    __typename
                    original
                    }
                }
                size
                }
                collectionAddress
                # description
                image {
                mediaEncoding {
                    ... on ImageEncodingTypes {
                    large
                    poster
                    original
                    thumbnail
                    }
                    ... on VideoEncodingTypes {
                    large
                    poster
                    original
                    preview
                    thumbnail
                    }
                    ... on AudioEncodingTypes {
                    large
                    original
                    }
                    ... on UnsupportedEncodingTypes {
                    __typename
                    original
                    }
                }
                mimeType
                size
                url
                }
                # lastRefreshTime
                metadata
                tokenStandard
                tokenUrl
                # mintInfo {
                #     originatorAddress
                #     price {
                #         chainTokenPrice {
                #             raw
                #             decimal
                #             currency {
                #                 address
                #                 decimals
                #                 name
                #             }
                #         }
                #         blockNumber
                #         nativePrice {
                #             currency {
                #                 address
                #                 decimals
                #                 name
                #             }
                #             decimal
                #             raw
                #         }
                #         usdcPrice {
                #             decimal
                #             raw
                #             currency {
                #                 address
                #                 decimals
                #                 name
                #             }
                #         }
                #     }
                #     toAddress
                #     mintContext {
                #         blockNumber
                #         transactionHash
                #         blockTimestamp
                #     }
                # }
                # owner
            }
            # marketsSummary {
            #     collectionAddress
            #     marketAddress
            #     marketType
            #     status
            #     tokenId
            #     price {
            #         chainTokenPrice {
            #             raw
            #             decimal
            #             currency {
            #                 address
            #                 decimals
            #                 name
            #             }
            #         }
            #         blockNumber
            #         chainTokenPrice {
            #             raw
            #             decimal
            #             currency {
            #                 address
            #                 decimals
            #                 name
            #             }
            #         }
            #         usdcPrice {
            #             decimal
            #             raw
            #             currency {
            #                 address
            #                 decimals
            #                 name
            #             }
            #         }
            #     }
            #     transactionInfo {
            #         blockNumber
            #         blockTimestamp
            #         transactionHash
            #     }
            # }
            # sales {
            #     tokenId
            #     saleType
            #     sellerAddress
            #     saleContractAddress
            #     price {
            #     nativePrice {
            #         currency {
            #         address
            #         decimals
            #         name
            #         }
            #         decimal
            #         raw
            #     }
            #     blockNumber
            #     }
            #     collectionAddress
            #     buyerAddress
            #     transactionInfo {
            #     transactionHash
            #     blockNumber
            #     blockTimestamp
            #     }
            # }
        }
        pageInfo {
            hasNextPage
            endCursor
        }
      }
  }
    `;

export const tokenMetadataQuery = `#graphql
  query MyQuery($address: String! $tokenId: String!) {
    token(
    token: {address: $address, tokenId: $tokenId}
    network: {network: OPTIMISM, chain: OPTIMISM_MAINNET}
  ) {
    token {
            collectionName
            tokenId
            name
            content {
                mimeType
                url
            }
            collectionAddress
            image {
                mimeType
                url
            }
            # lastRefreshTime
            metadata
            tokenUrl
        }
    }
  }
    `;

export const tokensFromCollectionAddress = `#graphql
  query MyQuery($address: [String!] $network: Network! $chain: Chain!) {
    tokens(
        where: {collectionAddresses: $address}
        networks: {network: $network, chain: $chain}
        pagination: {limit: 1}
    ) {
        nodes {
            token {
                collectionName
                tokenId
                name
                content {
                    mimeType
                    url
                }
                collectionAddress
                image {
                    mimeType
                    url
                }
                # lastRefreshTime
                metadata
                tokenUrl
            }
        }
    }
  }
    `;
