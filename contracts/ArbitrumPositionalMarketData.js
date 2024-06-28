const positionalMarketDataContractArb = {
  abi: [
    {
      name: "rangedMarketsAMM",
      type: "function",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "contract RangedMarketsAMM",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x07b00005",
      signature: "rangedMarketsAMM()",
      stateMutability: "view",
    },
    {
      name: "getMarketParameters",
      type: "function",
      inputs: [
        {
          name: "market",
          type: "address",
          internalType: "contract PositionalMarket",
        },
      ],
      outputs: [
        {
          name: "",
          type: "tuple",
          components: [
            {
              name: "creator",
              type: "address",
              internalType: "address",
            },
            {
              name: "options",
              type: "tuple",
              components: [
                {
                  name: "up",
                  type: "address",
                  internalType: "contract Position",
                },
                {
                  name: "down",
                  type: "address",
                  internalType: "contract Position",
                },
              ],
              internalType: "struct PositionalMarket.Options",
            },
            {
              name: "times",
              type: "tuple",
              components: [
                {
                  name: "maturity",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "expiry",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
              internalType: "struct PositionalMarket.Times",
            },
            {
              name: "oracleDetails",
              type: "tuple",
              components: [
                {
                  name: "key",
                  type: "bytes32",
                  internalType: "bytes32",
                },
                {
                  name: "strikePrice",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "finalPrice",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "customMarket",
                  type: "bool",
                  internalType: "bool",
                },
                {
                  name: "iOracleInstanceAddress",
                  type: "address",
                  internalType: "address",
                },
              ],
              internalType: "struct PositionalMarket.OracleDetails",
            },
            {
              name: "fees",
              type: "tuple",
              components: [
                {
                  name: "poolFee",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "creatorFee",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
              internalType: "struct PositionalMarketManager.Fees",
            },
          ],
          internalType: "struct PositionalMarketData.MarketParameters",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x1216fc7b",
      signature: "getMarketParameters(address)",
      stateMutability: "view",
    },
    {
      name: "setOwner",
      type: "function",
      inputs: [
        {
          name: "_owner",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      payable: null,
      constant: null,
      selector: "0x13af4035",
      signature: "setOwner(address)",
      stateMutability: "nonpayable",
    },
    {
      name: "nominateNewOwner",
      type: "function",
      inputs: [
        {
          name: "_owner",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      payable: null,
      constant: null,
      selector: "0x1627540c",
      signature: "nominateNewOwner(address)",
      stateMutability: "nonpayable",
    },
    {
      name: "setPaused",
      type: "function",
      inputs: [
        {
          name: "_state",
          type: "bool",
          internalType: "bool",
        },
      ],
      outputs: [],
      payable: null,
      constant: null,
      selector: "0x16c38b3c",
      signature: "setPaused(bool)",
      stateMutability: "nonpayable",
    },
    {
      name: "getBatchPriceImpactForAllActiveMarkets",
      type: "function",
      inputs: [
        {
          name: "start",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "end",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "tuple[]",
          components: [
            {
              name: "market",
              type: "address",
              internalType: "address",
            },
            {
              name: "upPriceImpact",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "downPriceImpact",
              type: "int256",
              internalType: "int256",
            },
          ],
          internalType:
            "struct PositionalMarketData.ActiveMarketsPriceImpact[]",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x40915aa9",
      signature: "getBatchPriceImpactForAllActiveMarkets(uint256,uint256)",
      stateMutability: "view",
    },
    {
      name: "manager",
      type: "function",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x481c6a75",
      signature: "manager()",
      stateMutability: "view",
    },
    {
      name: "getMarketsForAssetAndStrikeDate",
      type: "function",
      inputs: [
        {
          name: "asset",
          type: "bytes32",
          internalType: "bytes32",
        },
        {
          name: "strikeDateParam",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "address[]",
          internalType: "address[]",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x52fd132c",
      signature: "getMarketsForAssetAndStrikeDate(bytes32,uint256)",
      stateMutability: "view",
    },
    {
      name: "nominatedOwner",
      type: "function",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x53a47bb7",
      signature: "nominatedOwner()",
      stateMutability: "view",
    },
    {
      name: "getRangedActiveMarketsInfoPerPosition",
      type: "function",
      inputs: [
        {
          name: "markets",
          type: "address[]",
          internalType: "address[]",
        },
        {
          name: "position",
          type: "uint8",
          internalType: "enum RangedMarket.Position",
        },
      ],
      outputs: [
        {
          name: "",
          type: "tuple[]",
          components: [
            {
              name: "market",
              type: "address",
              internalType: "address",
            },
            {
              name: "price",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "liquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "priceImpact",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "leftPrice",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "rightPrice",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          internalType:
            "struct PositionalMarketData.RangedMarketsInfoPerPosition[]",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x53d2901c",
      signature: "getRangedActiveMarketsInfoPerPosition(address[],uint8)",
      stateMutability: "view",
    },
    {
      name: "thalesAMM",
      type: "function",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x572e36e6",
      signature: "thalesAMM()",
      stateMutability: "view",
    },
    {
      name: "paused",
      type: "function",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "bool",
          internalType: "bool",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x5c975abb",
      signature: "paused()",
      stateMutability: "view",
    },
    {
      name: "getMaturityDates",
      type: "function",
      inputs: [
        {
          name: "asset",
          type: "bytes32",
          internalType: "bytes32",
        },
      ],
      outputs: [
        {
          name: "",
          type: "uint256[]",
          internalType: "uint256[]",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x63c32d86",
      signature: "getMaturityDates(bytes32)",
      stateMutability: "view",
    },
    {
      name: "getAmmMarketData",
      type: "function",
      inputs: [
        {
          name: "market",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "",
          type: "tuple",
          components: [
            {
              name: "upBuyLiquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "downBuyLiquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "upSellLiquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "downSellLiquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "upBuyPrice",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "downBuyPrice",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "upSellPrice",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "downSellPrice",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "upBuyPriceImpact",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "downBuyPriceImpact",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "upSellPriceImpact",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "downSellPriceImpact",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "iv",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "isMarketInAMMTrading",
              type: "bool",
              internalType: "bool",
            },
          ],
          internalType: "struct PositionalMarketData.AmmMarketData",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x6749e048",
      signature: "getAmmMarketData(address)",
      stateMutability: "view",
    },
    {
      name: "acceptOwnership",
      type: "function",
      inputs: [],
      outputs: [],
      payable: false,
      constant: false,
      selector: "0x79ba5097",
      signature: "acceptOwnership()",
      stateMutability: "nonpayable",
    },
    {
      name: "getRangedAmmMarketData",
      type: "function",
      inputs: [
        {
          name: "market",
          type: "address",
          internalType: "contract RangedMarket",
        },
      ],
      outputs: [
        {
          name: "",
          type: "tuple",
          components: [
            {
              name: "inBuyLiquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "outBuyLiquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "inSellLiquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "outSellLiquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "inBuyPrice",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "outBuyPrice",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "inSellPrice",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "outSellPrice",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "inPriceImpact",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "outPriceImpact",
              type: "int256",
              internalType: "int256",
            },
          ],
          internalType: "struct PositionalMarketData.RangedAmmMarketData",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x7c0f4f74",
      signature: "getRangedAmmMarketData(address)",
      stateMutability: "view",
    },
    {
      name: "getAvailableAssets",
      type: "function",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "bytes32[]",
          internalType: "bytes32[]",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x89332f7f",
      signature: "getAvailableAssets()",
      stateMutability: "view",
    },
    {
      name: "owner",
      type: "function",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "address",
          internalType: "address",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x8da5cb5b",
      signature: "owner()",
      stateMutability: "view",
    },
    {
      name: "lastPauseTime",
      type: "function",
      inputs: [],
      outputs: [
        {
          name: "",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      payable: null,
      constant: null,
      selector: "0x91b4ded9",
      signature: "lastPauseTime()",
      stateMutability: "view",
    },
    {
      name: "setThalesAMM",
      type: "function",
      inputs: [
        {
          name: "_thalesAMM",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      payable: null,
      constant: null,
      selector: "0x961c88b7",
      signature: "setThalesAMM(address)",
      stateMutability: "nonpayable",
    },
    {
      name: "getMarketData",
      type: "function",
      inputs: [
        {
          name: "market",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "",
          type: "tuple",
          components: [
            {
              name: "gameId",
              type: "bytes32",
              internalType: "bytes32",
            },
            {
              name: "gameLabel",
              type: "string",
              internalType: "string",
            },
            {
              name: "firstTag",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "secondTag",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "maturity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "resolved",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "finalResult",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "cancelled",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "paused",
              type: "bool",
              internalType: "bool",
            },
            {
              name: "odds",
              type: "uint256[]",
              internalType: "uint256[]",
            },
            {
              name: "childMarkets",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "doubleChanceMarkets",
              type: "address[]",
              internalType: "address[]",
            },
            {
              name: "homeScore",
              type: "uint8",
              internalType: "uint8",
            },
            {
              name: "awayScore",
              type: "uint8",
              internalType: "uint8",
            },
            {
              name: "spread",
              type: "int16",
              internalType: "int16",
            },
            {
              name: "total",
              type: "uint24",
              internalType: "uint24",
            },
          ],
          internalType: "struct SportPositionalMarketData.MarketData",
        },
      ],
      payable: null,
      constant: null,
      selector: "0xa30c302d",
      signature: "getMarketData(address)",
      stateMutability: "view",
    },
    {
      name: "setPositionalMarketManager",
      type: "function",
      inputs: [
        {
          name: "_manager",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      payable: false,
      constant: false,
      selector: "0xbf996ae3",
      signature: "setPositionalMarketManager(address)",
      stateMutability: "nonpayable",
    },
    {
      name: "transferOwnershipAtInit",
      type: "function",
      inputs: [
        {
          name: "proxyAddress",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      payable: null,
      constant: null,
      selector: "0xc3b83f5f",
      signature: "transferOwnershipAtInit(address)",
      stateMutability: "nonpayable",
    },
    {
      name: "initialize",
      type: "function",
      inputs: [
        {
          name: "_owner",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      payable: null,
      constant: null,
      selector: "0xc4d66de8",
      signature: "initialize(address)",
      stateMutability: "nonpayable",
    },
    {
      name: "getAccountMarketData",
      type: "function",
      inputs: [
        {
          name: "market",
          type: "address",
          internalType: "contract BinaryOptionMarket",
        },
        {
          name: "account",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [
        {
          name: "",
          type: "tuple",
          components: [
            {
              name: "balances",
              type: "tuple",
              components: [
                {
                  name: "long",
                  type: "uint256",
                  internalType: "uint256",
                },
                {
                  name: "short",
                  type: "uint256",
                  internalType: "uint256",
                },
              ],
              internalType: "struct BinaryOptionMarketData.OptionValues",
            },
          ],
          internalType: "struct BinaryOptionMarketData.AccountData",
        },
      ],
      payable: false,
      constant: true,
      selector: "0xdca5f5c3",
      signature: "getAccountMarketData(address,address)",
      stateMutability: "view",
    },
    {
      name: "getBatchBasePricesForAllActiveMarkets",
      type: "function",
      inputs: [
        {
          name: "start",
          type: "uint256",
          internalType: "uint256",
        },
        {
          name: "end",
          type: "uint256",
          internalType: "uint256",
        },
      ],
      outputs: [
        {
          name: "",
          type: "tuple[]",
          components: [
            {
              name: "market",
              type: "address",
              internalType: "address",
            },
            {
              name: "upPrice",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "downPrice",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          internalType: "struct PositionalMarketData.ActiveMarketsPrices[]",
        },
      ],
      payable: null,
      constant: null,
      selector: "0xe153842b",
      signature: "getBatchBasePricesForAllActiveMarkets(uint256,uint256)",
      stateMutability: "view",
    },
    {
      name: "getActiveMarketsInfoPerPosition",
      type: "function",
      inputs: [
        {
          name: "markets",
          type: "address[]",
          internalType: "address[]",
        },
        {
          name: "position",
          type: "uint8",
          internalType: "enum IThalesAMM.Position",
        },
      ],
      outputs: [
        {
          name: "",
          type: "tuple[]",
          components: [
            {
              name: "market",
              type: "address",
              internalType: "address",
            },
            {
              name: "price",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "liquidity",
              type: "uint256",
              internalType: "uint256",
            },
            {
              name: "priceImpact",
              type: "int256",
              internalType: "int256",
            },
            {
              name: "strikePrice",
              type: "uint256",
              internalType: "uint256",
            },
          ],
          internalType:
            "struct PositionalMarketData.ActiveMarketsInfoPerPosition[]",
        },
      ],
      payable: null,
      constant: null,
      selector: "0xe19a8b8a",
      signature: "getActiveMarketsInfoPerPosition(address[],uint8)",
      stateMutability: "view",
    },
    {
      name: "setRangedMarketsAMM",
      type: "function",
      inputs: [
        {
          name: "_rangedMarketsAMM",
          type: "address",
          internalType: "address",
        },
      ],
      outputs: [],
      payable: null,
      constant: null,
      selector: "0xfe4fd3e1",
      signature: "setRangedMarketsAMM(address)",
      stateMutability: "nonpayable",
    },
  ],
  // abi: [
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "oldOwner",
  //         type: "address",
  //       },
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "newOwner",
  //         type: "address",
  //       },
  //     ],
  //     name: "OwnerChanged",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "newOwner",
  //         type: "address",
  //       },
  //     ],
  //     name: "OwnerNominated",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "bool",
  //         name: "isPaused",
  //         type: "bool",
  //       },
  //     ],
  //     name: "PauseChanged",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "_manager",
  //         type: "address",
  //       },
  //     ],
  //     name: "PositionalMarketManagerChanged",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "_rangedMarketsAMM",
  //         type: "address",
  //       },
  //     ],
  //     name: "SetRangedMarketsAMM",
  //     type: "event",
  //   },
  //   {
  //     anonymous: false,
  //     inputs: [
  //       {
  //         indexed: false,
  //         internalType: "address",
  //         name: "_thalesAMM",
  //         type: "address",
  //       },
  //     ],
  //     name: "SetThalesAMM",
  //     type: "event",
  //   },
  //   {
  //     inputs: [],
  //     name: "acceptOwnership",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "contract PositionalMarket",
  //         name: "market",
  //         type: "address",
  //       },
  //       { internalType: "address", name: "account", type: "address" },
  //     ],
  //     name: "getAccountMarketData",
  //     outputs: [
  //       {
  //         components: [
  //           {
  //             components: [
  //               { internalType: "uint256", name: "up", type: "uint256" },
  //               { internalType: "uint256", name: "down", type: "uint256" },
  //             ],
  //             internalType: "struct PositionalMarketData.OptionValues",
  //             name: "balances",
  //             type: "tuple",
  //           },
  //         ],
  //         internalType: "struct PositionalMarketData.AccountData",
  //         name: "",
  //         type: "tuple",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "getBasePricesForAllActiveMarkets",
  //     outputs: [
  //       {
  //         components: [
  //           { internalType: "address", name: "market", type: "address" },
  //           { internalType: "uint256", name: "upPrice", type: "uint256" },
  //           { internalType: "uint256", name: "downPrice", type: "uint256" },
  //         ],
  //         internalType: "struct PositionalMarketData.ActiveMarketsPrices[]",
  //         name: "",
  //         type: "tuple[]",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "getLiquidityForAllActiveMarkets",
  //     outputs: [
  //       {
  //         components: [
  //           { internalType: "address", name: "market", type: "address" },
  //           { internalType: "uint256", name: "upLiquidity", type: "uint256" },
  //           { internalType: "uint256", name: "downLiquidity", type: "uint256" },
  //         ],
  //         internalType: "struct PositionalMarketData.ActiveMarketsLiquidity[]",
  //         name: "",
  //         type: "tuple[]",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "contract PositionalMarket",
  //         name: "market",
  //         type: "address",
  //       },
  //     ],
  //     name: "getMarketData",
  //     outputs: [
  //       {
  //         components: [
  //           {
  //             components: [
  //               { internalType: "uint256", name: "price", type: "uint256" },
  //               { internalType: "uint256", name: "updatedAt", type: "uint256" },
  //             ],
  //             internalType:
  //               "struct PositionalMarketData.OraclePriceAndTimestamp",
  //             name: "oraclePriceAndTimestamp",
  //             type: "tuple",
  //           },
  //           {
  //             components: [
  //               { internalType: "uint256", name: "deposited", type: "uint256" },
  //             ],
  //             internalType: "struct PositionalMarketData.Deposits",
  //             name: "deposits",
  //             type: "tuple",
  //           },
  //           {
  //             components: [
  //               { internalType: "bool", name: "resolved", type: "bool" },
  //               { internalType: "bool", name: "canResolve", type: "bool" },
  //             ],
  //             internalType: "struct PositionalMarketData.Resolution",
  //             name: "resolution",
  //             type: "tuple",
  //           },
  //           {
  //             internalType: "enum IPositionalMarket.Phase",
  //             name: "phase",
  //             type: "uint8",
  //           },
  //           {
  //             internalType: "enum IPositionalMarket.Side",
  //             name: "result",
  //             type: "uint8",
  //           },
  //           {
  //             components: [
  //               { internalType: "uint256", name: "up", type: "uint256" },
  //               { internalType: "uint256", name: "down", type: "uint256" },
  //             ],
  //             internalType: "struct PositionalMarketData.OptionValues",
  //             name: "totalSupplies",
  //             type: "tuple",
  //           },
  //         ],
  //         internalType: "struct PositionalMarketData.MarketData",
  //         name: "",
  //         type: "tuple",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "contract PositionalMarket",
  //         name: "market",
  //         type: "address",
  //       },
  //     ],
  //     name: "getMarketParameters",
  //     outputs: [
  //       {
  //         components: [
  //           { internalType: "address", name: "creator", type: "address" },
  //           {
  //             components: [
  //               {
  //                 internalType: "contract Position",
  //                 name: "up",
  //                 type: "address",
  //               },
  //               {
  //                 internalType: "contract Position",
  //                 name: "down",
  //                 type: "address",
  //               },
  //             ],
  //             internalType: "struct PositionalMarket.Options",
  //             name: "options",
  //             type: "tuple",
  //           },
  //           {
  //             components: [
  //               { internalType: "uint256", name: "maturity", type: "uint256" },
  //               { internalType: "uint256", name: "expiry", type: "uint256" },
  //             ],
  //             internalType: "struct PositionalMarket.Times",
  //             name: "times",
  //             type: "tuple",
  //           },
  //           {
  //             components: [
  //               { internalType: "bytes32", name: "key", type: "bytes32" },
  //               {
  //                 internalType: "uint256",
  //                 name: "strikePrice",
  //                 type: "uint256",
  //               },
  //               {
  //                 internalType: "uint256",
  //                 name: "finalPrice",
  //                 type: "uint256",
  //               },
  //               { internalType: "bool", name: "customMarket", type: "bool" },
  //               {
  //                 internalType: "address",
  //                 name: "iOracleInstanceAddress",
  //                 type: "address",
  //               },
  //             ],
  //             internalType: "struct PositionalMarket.OracleDetails",
  //             name: "oracleDetails",
  //             type: "tuple",
  //           },
  //           {
  //             components: [
  //               { internalType: "uint256", name: "poolFee", type: "uint256" },
  //               {
  //                 internalType: "uint256",
  //                 name: "creatorFee",
  //                 type: "uint256",
  //               },
  //             ],
  //             internalType: "struct PositionalMarketManager.Fees",
  //             name: "fees",
  //             type: "tuple",
  //           },
  //         ],
  //         internalType: "struct PositionalMarketData.MarketParameters",
  //         name: "",
  //         type: "tuple",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "getPriceImpactForAllActiveMarkets",
  //     outputs: [
  //       {
  //         components: [
  //           { internalType: "address", name: "market", type: "address" },
  //           { internalType: "int256", name: "upPriceImpact", type: "int256" },
  //           { internalType: "int256", name: "downPriceImpact", type: "int256" },
  //         ],
  //         internalType:
  //           "struct PositionalMarketData.ActiveMarketsPriceImpact[]",
  //         name: "",
  //         type: "tuple[]",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "getPricesForAllActiveMarkets",
  //     outputs: [
  //       {
  //         components: [
  //           { internalType: "address", name: "market", type: "address" },
  //           { internalType: "uint256", name: "upPrice", type: "uint256" },
  //           { internalType: "uint256", name: "downPrice", type: "uint256" },
  //         ],
  //         internalType: "struct PositionalMarketData.ActiveMarketsPrices[]",
  //         name: "",
  //         type: "tuple[]",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       {
  //         internalType: "contract RangedMarket",
  //         name: "market",
  //         type: "address",
  //       },
  //     ],
  //     name: "getRangedMarketPricesAndLiquidity",
  //     outputs: [
  //       {
  //         components: [
  //           { internalType: "uint256", name: "inPrice", type: "uint256" },
  //           { internalType: "uint256", name: "outPrice", type: "uint256" },
  //           { internalType: "uint256", name: "inLiquidity", type: "uint256" },
  //           { internalType: "uint256", name: "outLiquidity", type: "uint256" },
  //         ],
  //         internalType:
  //           "struct PositionalMarketData.RangedMarketPricesAndLiqudity",
  //         name: "",
  //         type: "tuple",
  //       },
  //     ],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [{ internalType: "address", name: "_owner", type: "address" }],
  //     name: "initialize",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "lastPauseTime",
  //     outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "manager",
  //     outputs: [{ internalType: "address", name: "", type: "address" }],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [{ internalType: "address", name: "_owner", type: "address" }],
  //     name: "nominateNewOwner",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "nominatedOwner",
  //     outputs: [{ internalType: "address", name: "", type: "address" }],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "owner",
  //     outputs: [{ internalType: "address", name: "", type: "address" }],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "paused",
  //     outputs: [{ internalType: "bool", name: "", type: "bool" }],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "rangedMarketsAMM",
  //     outputs: [{ internalType: "address", name: "", type: "address" }],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [{ internalType: "address", name: "_owner", type: "address" }],
  //     name: "setOwner",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [{ internalType: "bool", name: "_paused", type: "bool" }],
  //     name: "setPaused",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [{ internalType: "address", name: "_manager", type: "address" }],
  //     name: "setPositionalMarketManager",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       { internalType: "address", name: "_rangedMarketsAMM", type: "address" },
  //     ],
  //     name: "setRangedMarketsAMM",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       { internalType: "address", name: "_thalesAMM", type: "address" },
  //     ],
  //     name: "setThalesAMM",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  //   {
  //     inputs: [],
  //     name: "thalesAMM",
  //     outputs: [{ internalType: "address", name: "", type: "address" }],
  //     stateMutability: "view",
  //     type: "function",
  //   },
  //   {
  //     inputs: [
  //       { internalType: "address", name: "proxyAddress", type: "address" },
  //     ],
  //     name: "transferOwnershipAtInit",
  //     outputs: [],
  //     stateMutability: "nonpayable",
  //     type: "function",
  //   },
  // ],
};

module.exports = { positionalMarketDataContractArb };
