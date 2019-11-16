# tds-gen

React 対応の d.ts を生成する

## 想定する使用方法

```
yarn add katai5plate/tds-gen
node -e "require('tds-gen')('<module_name>', '<dist>')"
```

## 現状の機能

- キャメルケースの関数を `React.ComponentType<any>` として出力し、その直下にコメントで処理内容を出力します。
- キャメルケースでないの関数を `function f(x:any, y:any): any` のように出力し、その直下にコメントで処理内容を出力します。
- オブジェクトを `{}` として出力しますが、その直下にコメントで要素の詳細を出力します。
  - 将来的にこの部分も自動で型付けを行う予定
- `number, string, boolean` を自動検知して出力します。
- 配列を `[number, string, boolean]` のように分解して出力します。

## 既知のバグ

- class があるとバグる
