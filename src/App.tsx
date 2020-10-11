import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Puzzles, { getPuzzles } from "./Puzzles";
import Puzzle from "./Puzzle";
import "./App.css";
import useSessionState from "./useSessionState";
import _ from "lodash";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup";

type Order = "found" | "alpha" | "length";
const ORDERS: Order[] = ["found", "alpha", "length"];
function App() {
  const [puzzles, setPuzzles] = React.useState<Puzzles>({});
  const [puzzle, setPuzzle] = useSessionState<Puzzle | undefined>("puzzle", undefined);
  const [board, setBoard] = useSessionState<string[]>("board", []);
  const [rack, setRack] = useSessionState<string[]>("rack", []);
  const [shuffle, setShuffle] = React.useState(0);
  const [words, setWords] = useSessionState<string[]>("words", []);
  const [order, setOrder] = useSessionState<Order>("order", "found");

  const getPuzzlesOnce = React.useRef({ done: false });

  function onKeyPress(event: KeyboardEvent) {
    const { key, code } = event;
    console.log(event);
    switch (code) {
      case "Escape":
        setRack([]);
        break;

      case "Delete":
      case "Backspace":
        const newRack = [...rack];
        newRack.pop();
        setRack(newRack);
        break;

      case "Return":
      case "Enter":
        submit();
        break;

      case "Space":
        shuffleBoard();
        break;

      default:
        play(key);
        break;
    }
  }

  React.useEffect(() => {
    const handler = { handleEvent: onKeyPress };
    window.addEventListener("keyup", handler);
    return window.removeEventListener.bind(window, "keyup", handler);
  })

  if (!getPuzzlesOnce.current.done) {
    getPuzzlesOnce.current.done = true;
    getPuzzles().then(setPuzzles);
  }

  function shuffleBoard() {
    if (!puzzle) {
      setBoard([]);
      return;
    }
    const result: string[] = [];
    const src = [...puzzle.board];
    while (src.length > 0) {
      const i = Math.floor(Math.random() * src.length);
      const ex = src.splice(i, 1)[0];
      result.push(ex);
      if (result.length === 3) {
        result.push(puzzle.island);
      }
    }
    setBoard(result);
  }

  React.useEffect(shuffleBoard, [puzzle, shuffle]);

  const skipResetOnRestore = React.useRef({ done: false });
  React.useEffect(() => {
    if (!skipResetOnRestore.current.done) {
      skipResetOnRestore.current.done = true;
      return;
    }
    setWords([]);
  }, [puzzle, setWords]);

  const orderedWords = React.useCallback(() => {
    switch (order) {
      case "found":
        return words;
      case "alpha":
        return [...words].sort();
      // case "length":
      //   const groups = Object.entries(_.groupBy([...words].sort(), "length"));
      //   return _.map(groups.sort(), "", 
    }
  }, [words, order]);

  function play(letter: string) {
    if (board.includes(letter)) {
      setRack([...rack, letter]);
      return;
    }
  }
  const submit = () => {
    const word = rack.join("");
    if (words.includes(word)) {
      alert("Already found!");
    } else if (puzzle?.words.includes(word)) {
      setWords([...words, word]);
    } else {
      alert("Not a word!");
    }
    setRack([]);
  }
  const lengthProgress: Array<{ total: number, found: number, length: number }> = [];
  puzzle?.words.forEach((word) => {
    const length = word.length;
    if (!(length in lengthProgress)) {
      lengthProgress[length] = { total: 0, found: 0, length };
    }
    lengthProgress[length].total += 1;
  });
  words.forEach((word) => {
    const length = word.length;
    lengthProgress[length].found += 1;
  });

  const mostWords = _.max(_.map(lengthProgress, "total")) ?? 0;
  const cols: number[] = [];
  for (let index = 0; index < mostWords; index++) {
    cols[index] = index;
  }
  return <Container>
    <Row>
      {Object.entries(puzzles).map(([, group], groupIndex) =>
        group.map((e) => {
          const { board, island, words } = e;
          return <Col md={2} className="m-1" key={`${groupIndex}.${island}`}>
            <Button variant="outline-primary" onClick={setPuzzle.bind(null, e)}><code>{board.join("").toUpperCase()}</code></Button>
            &nbsp;
            <small>({words.length} words)</small>
          </Col>
        }))}
    </Row>
    <Row className="mb-2">
      <Col xs={"auto"} className="flex-fill" />
      <Col xs={"auto"}>
        <Row>
          <span className="rack-letter">&nbsp;</span>
          {rack.map((letter) => <span className="rack-letter">{letter}</span>)}
          <span className="rack-letter">&nbsp;</span>
        </Row>
      </Col>
      <Col xs={"auto"} className="flex-fill" />
    </Row>
    <Row className="mb-2">
      <Col xs={"auto"} className="flex-fill" />
      <Col xs={"auto"}>
        <Row>
          <ButtonGroup>
            <Button variant="warning" disabled={rack.length === 0} onClick={setRack.bind(null, [])}>
              Reset
            </Button>
            <Button variant="secondary" onClick={setShuffle.bind(null, shuffle + 1)}>
              Shuffle
            </Button>
            <Button variant="primary" disabled={rack.length < 4 || !puzzle || !rack.includes(puzzle.island)} onClick={submit}>
              Play
            </Button>
          </ButtonGroup>
        </Row>
      </Col>
      <Col xs={"auto"} className="flex-fill" />
    </Row>
    {puzzle && <Row className="mb-2">
      <Col>
        {
          lengthProgress.sort().map(({ total, found, length }, index) =>
            <Row key={index}>
              <Col xs={1}>{length}</Col>
              {cols.map((index) => <Col key={index} className={index < found ? "marker-found" : index < total ? "marker-unfound" : "marker-blank"} />)}
            </Row>)
        }
      </Col>
      <Col>
        <Row>
          <Col xs={"auto"} className="flex-fill" />
          <Board board={board} play={play} />
          <Col xs={"auto"} className="flex-fill" />
        </Row>
      </Col>
      <Col>
        <Row>
          <Col xs={"auto"} className="flex-fill" />
          <Col xs={"auto"}>
            <ButtonGroup size="sm">
              {ORDERS.map((orderVal) => <Button key={orderVal} variant={order === orderVal ? "primary" : "outline-primary"} onClick={setOrder.bind(null, orderVal)}>{orderVal}</Button>)}
            </ButtonGroup>
          </Col>
          <Col xs={"auto"} className="flex-fill" />
        </Row>
        <Row>
          {orderedWords?.()?.map((word) => <Col xs={4} key={word}>{word}</Col>)}
        </Row>
      </Col>
    </Row>}
  </Container>;
}

function Board({ board, play }: { board: string[], play: (letter: string) => void }) {
  return <Col xs={"auto"} className="board">
    <Row>
      <Cell type="sea" letter={board[0]} play={play} />
      <Cell type="sea" letter={board[1]} play={play} />
      <Cell type="sea" letter={board[2]} play={play} />
    </Row>
    <Row>
      <Col className="sea">
      </Col>
      <Cell type="island" letter={board[3]} play={play} />
      <Col className="sea">
      </Col>
    </Row>
    <Row>
      <Cell type="sea" letter={board[4]} play={play} />
      <Cell type="sea" letter={board[5]} play={play} />
      <Cell type="sea" letter={board[6]} play={play} />
    </Row>
  </Col>;
}

function Cell({ type, play, letter }: { type: "sea" | "island", play(letter: string): void, letter: string }) {
  return <Col className={type} key={letter} onClick={play.bind(null, letter)} onKeyUp={console.log}>
    {letter}
  </Col>;

}

export default App;
