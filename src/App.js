import './App.css';
import { Container, Col, Row, Table } from 'react-bootstrap';
import { ethers } from "ethers";
import { useEffect, useState } from 'react';
import useInterval from './hooks/useInterval';

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
      console.log("Inside getNewBlock. Block = ", currentBlockNumber);
      if (currentBlockNumber) {
        let newBlock = await provider.getBlock(currentBlockNumber);
        console.log(newBlock);
        setBlocks(oldBlocks => [newBlock, ...oldBlocks]);
      }
    }
    getNewBlock();
  }, [currentBlockNumber]);

  let blocksJsx = blocks.map((block) => 
    // <div key={block.number}>
      // <div>Block Number: {block.number}</div>
    // </div>
    <tr>
      <td>{block.number}</td>
      <td>{new Date(block.timestamp * 1000).toISOString()}</td>
      <td>{block.transactions.length}</td>
      <td>{block.gasLimit.toString()}</td>
      <td>{block.gasUsed.toString()}</td>
    </tr>
  );

  return (
    <Container>
      <Row>
        <Col>
          <h1>Rinkeby Block Explorer</h1>
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
              {blocksJsx}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
