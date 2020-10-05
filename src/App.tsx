import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Puzzles, { getPuzzles } from "./Puzzles";
import Puzzle from "./Puzzle";
import "./App.css";
import useSessionState from "./useSessionState";

function App() {
  const [puzzles, setPuzzles] = React.useState<Puzzles>({});
  const [puzzle, setPuzzle] = useSessionState<Puzzle | undefined>("puzzle", undefined);
  const [board, setBoard] = useSessionState<string[]>("board", []);
  const [rack, setRack] = useSessionState<string[]>("rack", []);
  const [shuffle, setShuffle] = React.useState(0);
  const [words, setWords] = useSessionState<string[]>("words", []);
  const getPuzzlesOnce = React.useRef({ done: false });

  if (!getPuzzlesOnce.current.done) {
    getPuzzlesOnce.current.done = true;
    getPuzzles().then(setPuzzles);
  }

  const shuffleBoard = () => {
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
  };

  React.useEffect(shuffleBoard, [puzzle, shuffle]);

  const skipResetOnRestore = React.useRef({ done: false });
  React.useEffect(() => {
    if (!skipResetOnRestore.current.done) {
      skipResetOnRestore.current.done = true;
      return;
    }
    setWords([]);
  }, [puzzle, setWords]);

  const play = (letter: string) => setRack([...rack, letter]);
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
    {puzzle && <Row>
      <Col><Button onClick={setShuffle.bind(null, shuffle + 1)}>Shuffle</Button></Col>
      <Board board={board} play={play}/>
      <Col>
        <Row>
          <Button disabled={rack.length === 0} onClick={setRack.bind(null, [])}>
            Reset
        </Button>
          <Button disabled={rack.length < 4 || !rack.includes(puzzle.island)} onClick={submit}>
            Play {rack.join("")}
        </Button>
        </Row>
        {words.map((word) => <Row key={word}>{word}</Row>)}
      </Col>
    </Row>}
  </Container>;
}

function Board({board, play}:{board: string[], play: (letter: string) => void}) {
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
  return <Col className={type} key={letter} onClick={play.bind(null, letter)}>
    {letter}
  </Col>;

}

export default App;
