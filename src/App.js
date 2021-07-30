import './App.css';
import { Container, Col, Row, Table } from 'react-bootstrap';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import useInterval from './hooks/useInterval';
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

function App() {
  const provider = new ethers.providers.JsonRpcProvider("https://rinkeby.infura.io/v3/6e758ef5d39a4fdeba50de7d10d08448");
  const [currentBlockNumber, setCurrentBlockNumber] = useState();
  const [blocks, setBlocks] = useState([]);

  // Poll for new block. Maybe should replace this with event.
  useInterval(async () => {
    let blockNumber = await provider.getBlockNumber();
    if (blockNumber !== currentBlockNumber) {
      setCurrentBlockNumber(blockNumber);
    }
  }, 1000);

  // When new block detected, query for new block and update `blocks`
  useEffect(() => {
    async function getNewBlock() {
      if (currentBlockNumber) {
        let newBlock = await provider.getBlockWithTransactions(currentBlockNumber);
        setBlocks(oldBlocks => [newBlock, ...oldBlocks]);
      }
    }
    getNewBlock();
    console.log(blocks);
  }, [currentBlockNumber]);

  const blockRowsJsx = blocks.map((block) => 
    <tr key={block.number}>
      <td><Link to={`/block/${block.number}`}>{block.number}</Link></td>
      <td>{new Date(block.timestamp * 1000).toISOString()}</td>
      <td>{block.transactions.length}</td>
      <td>{block.gasLimit.toString()}</td>
      <td>{block.gasUsed.toString()}</td>
    </tr>
  );

  function blockJsx(blockNumber) {
    const block = blocks.find(x => x.number === parseInt(blockNumber));
    const transactionsJsx = block.transactions.map((tx) => 
      <tr key={parseInt(tx.transactionIndex)}>
        <td>{parseInt(tx.transactionIndex)}</td>
        <td>{tx.from}</td>
        <td>{tx.to}</td>
        <td>{ethers.utils.formatEther(tx.value)}</td>
      </tr>
    );
    return (
      <Table hover>
        <thead>
          <tr>
            <th>Index</th>
            <th>From</th>
            <th>To</th>
            <th>Value (ETH)</th>
          </tr>
        </thead>
        <tbody>
          {transactionsJsx}
        </tbody>
      </Table>
    )
  }

  return (
    <Router>
      <Container>
        <Row>
          <Col>
            <h1>Rinkeby Block Explorer</h1>
            <Switch>
              <Route exact path="/">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Block #</th>
                      <th>Time</th>
                      <th>Tx Count</th>
                      <th>Gas Limit</th>
                      <th>Gas Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blockRowsJsx}
                  </tbody>
                </Table>
              </Route>
              <Route path="/block/:blockNumber" render={(props) => (
                <div>{blockJsx(props.match.params.blockNumber)}</div>
              )}>
              </Route>
            </Switch>
          </Col>
        </Row>
      </Container>
    </Router>
    
  );
}

export default App;
