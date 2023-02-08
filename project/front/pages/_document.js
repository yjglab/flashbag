import React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";

export default class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body className="overflow-y-scroll bg-gray-50">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
