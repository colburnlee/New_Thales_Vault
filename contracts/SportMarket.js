const sportMarket = {
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "balancesOf",
      outputs: [
        {
          internalType: "uint256",
          name: "home",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "away",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "draw",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      name: "burnOptions",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "burnOptionsMaximum",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "canResolve",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "cancelled",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "creator",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "deposited",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "exerciseOptions",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "getGameDetails",
      outputs: [
        {
          internalType: "bytes32",
          name: "gameId",
          type: "bytes32",
        },
        {
          internalType: "string",
          name: "gameLabel",
          type: "string",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getGameId",
      outputs: [
        {
          internalType: "bytes32",
          name: "",
          type: "bytes32",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "getMaximumBurnable",
      outputs: [
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getOptions",
      outputs: [
        {
          internalType: "contract IPosition",
          name: "home",
          type: "address",
        },
        {
          internalType: "contract IPosition",
          name: "away",
          type: "address",
        },
        {
          internalType: "contract IPosition",
          name: "draw",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "getStampedOdds",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "optionsCount",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "paused",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "phase",
      outputs: [
        {
          internalType: "enum ISportPositionalMarket.Phase",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "resolved",
      outputs: [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_homeOdds",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_awayOdds",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_drawOdds",
          type: "uint256",
        },
      ],
      name: "restoreInvalidOdds",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "result",
      outputs: [
        {
          internalType: "enum ISportPositionalMarket.Side",
          name: "",
          type: "uint8",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "bool",
          name: "_paused",
          type: "bool",
        },
      ],
      name: "setPaused",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "idx",
          type: "uint256",
        },
      ],
      name: "tags",
      outputs: [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "times",
      outputs: [
        {
          internalType: "uint256",
          name: "maturity",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "destruction",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "totalSupplies",
      outputs: [
        {
          internalType: "uint256",
          name: "home",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "away",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "draw",
          type: "uint256",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_maturity",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_expiry",
          type: "uint256",
        },
      ],
      name: "updateDates",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
  ],
};

module.exports = {
  sportMarket,
};
