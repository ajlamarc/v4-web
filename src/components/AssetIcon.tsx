import styled from 'styled-components';

import { Nullable } from '@/constants/abacus';

export type AssetSymbol = keyof typeof assetIcons;

const assetIcons = {
  '1INCH': '/apps/dydx-v4/currencies/1inch.png',
  AAVE: '/apps/dydx-v4/currencies/aave.png',
  ADA: '/apps/dydx-v4/currencies/ada.png',
  AEVO: '/apps/dydx-v4/currencies/aevo.png',
  AGIX: '/apps/dydx-v4/currencies/agix.png',
  ALGO: '/apps/dydx-v4/currencies/algo.png',
  APE: '/apps/dydx-v4/currencies/ape.png',
  API3: '/apps/dydx-v4/currencies/api3.png',
  APT: '/apps/dydx-v4/currencies/apt.png',
  ARB: '/apps/dydx-v4/currencies/arb.png',
  ARKM: '/apps/dydx-v4/currencies/arkm.png',
  ASTR: '/apps/dydx-v4/currencies/astr.png',
  ATOM: '/apps/dydx-v4/currencies/atom.png',
  AVAX: '/apps/dydx-v4/currencies/avax.png',
  AXL: '/apps/dydx-v4/currencies/axl.png',
  BCH: '/apps/dydx-v4/currencies/bch.png',
  BLUR: '/apps/dydx-v4/currencies/blur.png',
  BNB: '/apps/dydx-v4/currencies/bnb.png',
  BOME: '/apps/dydx-v4/currencies/bome.png',
  BONK: '/apps/dydx-v4/currencies/bonk.png',
  BTC: '/apps/dydx-v4/currencies/btc.png',
  CELO: '/apps/dydx-v4/currencies/celo.png',
  CHZ: '/apps/dydx-v4/currencies/chz.png',
  COMP: '/apps/dydx-v4/currencies/comp.png',
  CRV: '/apps/dydx-v4/currencies/crv.png',
  DAI: '/apps/dydx-v4/currencies/dai.png',
  DOGE: '/apps/dydx-v4/currencies/doge.png',
  DOT: '/apps/dydx-v4/currencies/dot.png',
  DYDX: '/apps/dydx-v4/currencies/dydx.png',
  DYM: '/apps/dydx-v4/currencies/dym.png',
  ENJ: '/apps/dydx-v4/currencies/enj.png',
  ENS: '/apps/dydx-v4/currencies/ens.png',
  EOS: '/apps/dydx-v4/currencies/eos.png',
  ETC: '/apps/dydx-v4/currencies/etc.png',
  ETH: '/apps/dydx-v4/currencies/eth.png',
  ETHFI: '/apps/dydx-v4/currencies/ethfi.png',
  FET: '/apps/dydx-v4/currencies/fet.png',
  FIL: '/apps/dydx-v4/currencies/fil.png',
  FLR: '/apps/dydx-v4/currencies/flr.png',
  FTM: '/apps/dydx-v4/currencies/ftm.png',
  GALA: '/apps/dydx-v4/currencies/gala.png',
  GMT: '/apps/dydx-v4/currencies/gmt.png',
  GRT: '/apps/dydx-v4/currencies/grt.png',
  HBAR: '/apps/dydx-v4/currencies/hbar.png',
  ICP: '/apps/dydx-v4/currencies/icp.png',
  IMX: '/apps/dydx-v4/currencies/imx.png',
  INJ: '/apps/dydx-v4/currencies/inj.png',
  JTO: '/apps/dydx-v4/currencies/jto.png',
  JUP: '/apps/dydx-v4/currencies/jup.png',
  KAVA: '/apps/dydx-v4/currencies/kava.png',
  LDO: '/apps/dydx-v4/currencies/ldo.png',
  LINK: '/apps/dydx-v4/currencies/link.png',
  LTC: '/apps/dydx-v4/currencies/ltc.png',
  MAGIC: '/apps/dydx-v4/currencies/magic.png',
  MANA: '/apps/dydx-v4/currencies/mana.png',
  MATIC: '/apps/dydx-v4/currencies/matic.png',
  MASK: '/apps/dydx-v4/currencies/mask.png',
  MEME: '/apps/dydx-v4/currencies/meme.png',
  MINA: '/apps/dydx-v4/currencies/mina.png',
  MKR: '/apps/dydx-v4/currencies/mkr.png',
  NEAR: '/apps/dydx-v4/currencies/near.png',
  OCEAN: '/apps/dydx-v4/currencies/ocean.png',
  ORDI: '/apps/dydx-v4/currencies/ordi.png',
  OP: '/apps/dydx-v4/currencies/op.png',
  PEPE: '/apps/dydx-v4/currencies/pepe.png',
  PORTAL: '/apps/dydx-v4/currencies/portal.png',
  PYTH: '/apps/dydx-v4/currencies/pyth.png',
  RNDR: '/apps/dydx-v4/currencies/rndr.png',
  RUNE: '/apps/dydx-v4/currencies/rune.png',
  SAND: '/apps/dydx-v4/currencies/sand.png',
  SEI: '/apps/dydx-v4/currencies/sei.png',
  SHIB: '/apps/dydx-v4/currencies/shib.png',
  SNX: '/apps/dydx-v4/currencies/snx.png',
  SOL: '/apps/dydx-v4/currencies/sol.png',
  STRK: '/apps/dydx-v4/currencies/strk.png',
  STX: '/apps/dydx-v4/currencies/stx.png',
  SUI: '/apps/dydx-v4/currencies/sui.png',
  SUSHI: '/apps/dydx-v4/currencies/sushi.png',
  TIA: '/apps/dydx-v4/currencies/tia.png',
  TON: '/apps/dydx-v4/currencies/ton.png',
  TRX: '/apps/dydx-v4/currencies/trx.png',
  UMA: '/apps/dydx-v4/currencies/uma.png',
  UNI: '/apps/dydx-v4/currencies/uni.png',
  USDC: '/apps/dydx-v4/currencies/usdc.png',
  USDT: '/apps/dydx-v4/currencies/usdt.png',
  W: '/apps/dydx-v4/currencies/w.png',
  WBTC: '/apps/dydx-v4/currencies/wbtc.png',
  WETH: '/apps/dydx-v4/currencies/weth.png',
  WIF: '/apps/dydx-v4/currencies/wif.png',
  WOO: '/apps/dydx-v4/currencies/woo.png',
  WLD: '/apps/dydx-v4/currencies/wld.png',
  XLM: '/apps/dydx-v4/currencies/xlm.png',
  XMR: '/apps/dydx-v4/currencies/xmr.png',
  XRP: '/apps/dydx-v4/currencies/xrp.png',
  XTZ: '/apps/dydx-v4/currencies/xtz.png',
  YFI: '/apps/dydx-v4/currencies/yfi.png',
  ZEC: '/apps/dydx-v4/currencies/zec.png',
  ZETA: '/apps/dydx-v4/currencies/zeta.png',
  ZRX: '/apps/dydx-v4/currencies/zrx.png',
} as const;

const isAssetSymbol = (symbol: Nullable<string>): symbol is AssetSymbol =>
  symbol != null && Object.hasOwn(assetIcons, symbol);

export const AssetIcon = ({
  symbol,
  className,
}: {
  symbol?: Nullable<string>;
  className?: string;
}) => (
  <$Img
    src={isAssetSymbol(symbol) ? assetIcons[symbol] : '/apps/dydx-v4/currencies/unavailable.png'}
    className={className}
    alt={symbol ?? undefined}
  />
);
const $Img = styled.img`
  width: auto;
  height: 1em;
`;
