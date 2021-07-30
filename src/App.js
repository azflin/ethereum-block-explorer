import './App.css';
import { Container, Col, Row, Button } from 'react-bootstrap';
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

  useEffect(() => {
    async function getNewBlock() {
      console.log("Inside getNewBlock. Block = ", currentBlockNumber);
      if (currentBlockNumber) {
        let newBlock = await provider.getBlock(currentBlockNumber);
        blocks.push(newBlock);
        setBlocks(blocks);
      }
    }
    getNewBlock();
  }, [currentBlockNumber]);

  let blocksJsx = blocks.map((block) => 
    <div key={block.number}>
      <div>Block Number: {block.number}</div>
    </div>
  );

  return (
    <Container>
      <Row>
        <Col>
          <h1>Rinkeby Block Explorer</h1>
          {blocksJsx}
        </Col>
      </Row>
    </Container>
  );
}

export default App;
