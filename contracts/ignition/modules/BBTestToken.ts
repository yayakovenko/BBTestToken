
import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const TokenModule = buildModule("TokenModule", (m) => {
  const name = m.getParameter("name", 'BBTestToken');
  const symbol = m.getParameter("symbol", 'BBTT');
  const initialMint = m.getParameter("initialMint", BigInt(1000 * 1e18).toString());

  const initialOwner = m.getAccount(0);
  const token = m.contract("BBTestToken", [name, symbol, initialOwner, initialMint]);

  return { token };
});

export default TokenModule;
