module.exports = api => {
  return {
    plugins: [],
    presets: [
      [
        "babel-preset-env",
        {
          useBuiltIns: "entry",
          target: {
              "IE": ">= 10",
              "node": ">= 10",
            }
        }
      ]
    ]
  }
}
