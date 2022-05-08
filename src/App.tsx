import React from "react";
import {arraySetToggle} from "@pyrogenic/asset/lib/arraySetToggle";
import useLocalState from "@pyrogenic/perl/lib/useLocalState";
import classConcat from "@pyrogenic/perl/lib/classConcat";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Puzzles, { getPuzzles } from "./Puzzles";
import Puzzle from "./Puzzle";
import "./App.css";
import _ from "lodash";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { FiCopy, FiRefreshCw, FiShuffle, FiDelete, FiChevronsRight, FiChevronsLeft, FiPower, FiHeart } from "react-icons/fi";
import InputGroup from "react-bootstrap/InputGroup";
import "@pyrogenic/perl/src/cobbler.css";

type Order = "found" | "alpha" | "length";
const ORDERS: Order[] = ["found", "alpha", "length"];

type Progress = "overall" | "length" | "distance" | "cheat";
const PROGRESS: Progress[] = ["overall", "length", "distance" , "cheat"];

//type PuzzleId = [root: string, island: string];
type PuzzleId = string;

function App() {
  const [puzzles, setPuzzles] = React.useState<Puzzles>({});
  const [puzzle, setPuzzle] = useLocalState<Puzzle | undefined>("puzzle", undefined);
  const [visitedPuzzles, setVisitedPuzzles] = useLocalState<PuzzleId[]>("visitedPuzzleIds", []);
  const [favoritePuzzles, setFavoritePuzzles] = useLocalState<PuzzleId[]>("favoritePuzzleIds", []);
  const getPuzzlesOnce = React.useRef({ done: false });
  // const once = React.useRef({ firstRun: true });

  // if (once.current.firstRun) {
  //   once.current.firstRun = false;
  //   initPuzzle();
  //   initVisitedPuzzles();
  // }

  React.useEffect(() => {
    if (puzzle) {
      const id: PuzzleId = puzzleId(puzzle);
      if (!visitedPuzzles.includes(id)) {
        setVisitedPuzzles([...visitedPuzzles, id]);
      }
    }
  }, [puzzle, visitedPuzzles, setVisitedPuzzles]);

  if (!getPuzzlesOnce.current.done) {
    getPuzzlesOnce.current.done = true;
    getPuzzles().then(setPuzzles);
  }
  const allPuzzles = React.useCallback(() => puzzles ? _.flatten(Object.values(puzzles)) : [], [puzzles]);
  function nextPuzzle() {
    if (puzzle) {
      const puzzleIndex = visitedPuzzles.indexOf(puzzleId(puzzle));
      if (puzzleIndex > 0 && puzzleIndex < visitedPuzzles.length - 1) {
        const id = visitedPuzzles[puzzleIndex + 1];
        const found = allPuzzles().find((p) => id === puzzleId(p));
        return setPuzzle(found);
      }
    }
    setPuzzle(_.shuffle(allPuzzles()).pop());
  }
  function prevPuzzle() {
    if (puzzle) {
      const puzzleIndex = visitedPuzzles.indexOf(puzzleId(puzzle));
      if (puzzleIndex > 0) {
        const id = visitedPuzzles[puzzleIndex - 1];
        const found = puzzleById(id);
        return setPuzzle(found);
      }
    }
    setPuzzle(_.shuffle(allPuzzles()).pop());
  }

  const asc = {favoritePuzzles};
  return <div className="fixed">
    {puzzle && <PuzzleComponent puzzle={puzzle} prevPuzzle={prevPuzzle} nextPuzzle={nextPuzzle} />}
    <hr />
    <Row>
    <Col>
        <DropdownButton title="All Puzzles">
          {Object.entries(puzzles).map(([, group], groupIndex) =>
            group.map((e) => {
              const { board, island, words } = e;
              return <Dropdown.Item
                key={`${groupIndex}.${island}`}
                onSelect={setPuzzle.bind(null, e)}>
                {island.toUpperCase()}+{board.join("").toUpperCase()} ({words.length} words)
            </Dropdown.Item>;
            }))}
        </DropdownButton>
      </Col>
      <Col>
        <DropdownButton title="In-Progress">
            {_.compact(visitedPuzzles.map(puzzleById)).map((e) => {
              const { board, island, words } = e;
              return <Dropdown.Item
                key={puzzleId(e)}
                onSelect={setPuzzle.bind(null, e)}>
                {island.toUpperCase()}+{board.join("").toUpperCase()} ({words.length} words)
            </Dropdown.Item>;
            })}
        </DropdownButton>
      </Col>
      <Col>
        <InputGroup>
          {puzzle && <Button
              variant={favoritePuzzles.includes(puzzleId(puzzle)) ? "success" : "outline-dark"}
            onClick={() => {
              arraySetToggle(asc, "favoritePuzzles", puzzleId(puzzle));
              setFavoritePuzzles([...favoritePuzzles]);
            }}
          ><FiHeart /></Button>}
            <DropdownButton variant="success" title="Favorites">
          {_.compact(favoritePuzzles.map(puzzleById)).map((e) => {
            const { board, island, words } = e;
            return <Dropdown.Item
            key={puzzleId(e)}
            onSelect={setPuzzle.bind(null, e)}>
                {island.toUpperCase()}+{board.join("").toUpperCase()} ({words.length} words)
            </Dropdown.Item>;
            })}
          </DropdownButton>
          </InputGroup>
      </Col>
    </Row>
  </div>;

  function puzzleById(id: string) {
    return allPuzzles().find((p) => id === puzzleId(p));
  }
}

function PuzzleComponent({ puzzle, prevPuzzle, nextPuzzle }: { puzzle: Puzzle; prevPuzzle: () => void; nextPuzzle: () => void; }) {
  // per-puzzle
  const id = puzzleId(puzzle);
  const [board, setBoard] = useLocalState<string[]>([id, "board"], []);
  const [rack, setRack, initRack] = useLocalState<string[]>([id, "rack"], []);
  const [words, setWords, initWords] = useLocalState<string[]>([id, "words"], []);
  const [fails, setFails, initFails] = useLocalState<string[]>([id, "fails"], []);
  const [shuffle, setShuffle] = React.useState(0);
  const [reset, setReset] = React.useState(0);

  // global
  const [order, setOrder] = useLocalState<Order>(["order"], "found");
  const [progressView, setProgressView] = useLocalState<Progress>(["progress"], "overall");

  const firstRun = React.useRef(reset);
  React.useEffect(() => {
    if (firstRun.current !== reset){
      firstRun.current = reset;
      initRack();
      initWords();
      initFails();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reset]);

  React.useEffect(() => {
    if (puzzle === undefined) {
      shuffleBoard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [puzzle]);

  function onKeyPress(event: KeyboardEvent) {
    const { key, code } = event;
    switch (code) {
      case "Escape":
        setRack([]);
        break;

      case "Delete":
      case "Backspace":
        backspace();
        break;

      case "Return":
      case "Enter":
        if (rack.length) {
          submit();
        } else {
          ditto();
        }
        break;

      case "Space":
        shuffleBoard();
        break;

      case "Slash":
        ditto();
        break;

      case "ArrowLeft":
        prevPuzzle();
        break;

      case "ArrowRight":
        nextPuzzle();
        break;

      default:
        play(key);
        break;
    }
  }

  function backspace() {
    const newRack = [...rack];
    newRack.pop();
    setRack(newRack);
  }

  function ditto() {
    const lastWord = _.last(words);
    if (lastWord) {
      const newRack = [...lastWord];
      setRack(newRack);
    }
  }

  React.useEffect(() => {
    const handler = { handleEvent: onKeyPress };
    window.addEventListener("keyup", handler);
    return window.removeEventListener.bind(window, "keyup", handler);
  });

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(shuffleBoard, [puzzle, shuffle]);

  type OrderedWords = Array<[group: string | number | undefined, words: string[]]>;

  const orderedWords: OrderedWords = React.useMemo(() => {
    switch (order) {
      case "found":
        return [[undefined, words]] as Array<[undefined, string[]]>;
      case "alpha": {
        const groups: Array<[string, string[]]> = Object.entries(_.groupBy([...words].sort(), "0"));
        return groups.sort(([a], [b]) => a.localeCompare(b));
      }
      case "length":{
        const groups: Array<[number, string[]]> = Object.entries(_.groupBy([...words].sort(), "length")).map(([a, b]) => [Number(a), b]);
        return groups.sort(([a], [b]) => a-b);
      }
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
      alert(noPlayReason ?? "Not a word!");
      setFails([...fails, word]);
    }
    setRack([]);
  };

  let noPlayReason: string | undefined;
  let playTitle: string | undefined;
  if (!puzzle) {
    noPlayReason = "No Puzzle";
  } else {
    if (rack.length < 4) {
      noPlayReason = "Play";
      playTitle = "Too Short";
    } else if (!rack.includes(puzzle.island)) {
      noPlayReason = `No ${puzzle.island.toUpperCase()}`;
    } else if (words.includes(rack.join(""))) {
      noPlayReason = "Already Played";
    } else if (fails.includes(rack.join(""))) {
      noPlayReason = "Already Tried";
    }
  }

  return <div onMouseDown={(e: any) => e.preventDefault()}>
    <Row className="mb-2">
      <Col xs={"auto"} className="flex-fill"  onClick={backspace}/>
      <Col xs={"auto"}>
        <Row>
          <span className="rack-letter">&nbsp;</span>
          {rack.map((letter, i) => <span key={i} className={`rack-letter ${letter === puzzle.island ? "rack-letter-island" : ""}`} onClick={(e) => {
            rack.splice(i, 1);
            setRack([...rack]);
          }}>{letter}</span>)}
          <span className="rack-letter">&nbsp;</span>
        </Row>
      </Col>
      <Col xs={"auto"} className="flex-fill"  onClick={backspace}/>
    </Row>
    {puzzle && <Row className="mb-2">


      <Col xs={"auto"} className="board-container">
        <Row className="mb-2">
          <Col xs={"auto"} className="flex-fill" />
          <Board board={board} play={play} />
          <Col xs={"auto"} className="flex-fill" />
        </Row>
        <Row className="mb-2">
          <Col xs={"auto"} className="flex-fill" />
          <Col xs={"auto"}>
            <Row className="mb-2 justify-content-center">
              <Button variant="primary" disabled={noPlayReason !== undefined} title={playTitle} onClick={submit}>
                {noPlayReason ?? "Play"}
              </Button>
            </Row>
            <Row>
              <Col xs="auto" className="flex-fill">
                <Button size="sm" variant="light" onClick={() => window.confirm("Reset?") && setReset(reset + 1)}>
                  <FiPower title="Reset" />
                </Button>
                <Button size="sm" variant="light" onClick={setShuffle.bind(null, shuffle + 1)}>
                  <FiShuffle title="Shuffle" />
                </Button>
              </Col>
              <ButtonGroup as={Col} xs="auto">
                <Button size="lg" variant="light" disabled={rack.length === 0} onClick={setRack.bind(null, [])}>
                  <FiRefreshCw title="Reset" />
                </Button>
                <Button size="lg" variant="light" disabled={rack.length === 0} onClick={backspace}>
                  <FiDelete title="Delete" />
                </Button>
                <Button size="lg" variant="light" disabled={words.length === 0} onClick={ditto}>
                  <FiCopy title="Ditto" />
                </Button>
              </ButtonGroup>
              <Col xs="auto" className="flex-fill">
                <ButtonGroup>
                  <Button size="sm" variant="light" onClick={prevPuzzle}>
                    <FiChevronsLeft title="Previous Puzzle" />
                  </Button>
                  <Button size="sm" variant="light" onClick={nextPuzzle}>
                    <FiChevronsRight title="Next Puzzle" />
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Col>
          <Col xs={"auto"} className="flex-fill" />
        </Row>
      </Col>



      <Col xs={"auto"} className="flex-fill">
        <Row className="mb-2">
          <Col xs={"auto"} className="flex-fill" />
          <Col xs={"auto"}>
            <ButtonGroup size="sm">
              {ORDERS.map((orderVal) => <Button key={orderVal} variant={order === orderVal ? "primary" : "outline-primary"} onClick={setOrder.bind(null, orderVal)}>{orderVal}</Button>)}
            </ButtonGroup>
          </Col>
          <Col xs={"auto"} className="flex-fill" />
        </Row>

        <Row className={classConcat("word-list", order)}>
          {orderedWords.map(([group, words]) => <>
          {group !== undefined && <div className={classConcat("group", order, group.toString())}>{group}</div>}
          {words.map((word) => {
            let className = globetrotter(word) ? "globetrotter" : undefined;
            if (rack.length > 0) {
              const rackWord = rack.join("");
              if (word.startsWith(rackWord)) {
                if (word === rackWord) {
                  className = "already-played";
                } else {
                  className = "matches-prefix";
                }
              } else {
                className = "does-not-match-prefix";
              }
            }
            return <div key={word} className={className}>{word}</div>;
          })}</>)}
        </Row>
      </Col>





      <Col md={4}>
        <Row className="mb-2">
          <Col xs={"auto"} className="flex-fill" />
          <Col xs={"auto"}>
            <ButtonGroup size="sm">
              {PROGRESS.map((progressVal) => <Button key={progressVal} variant={progressView === progressVal ? "primary" : "outline-primary"} onClick={setProgressView.bind(null, progressVal)}>{progressVal}</Button>)}
            </ButtonGroup>
          </Col>
          <Col xs={"auto"} className="flex-fill" />
        </Row>
        <Row>
          <Col xs={"auto"} className="flex-fill" />
          <Col xs={"auto"}>
            {
              progressView === "length" ? <LengthProgress /> : progressView === "overall" ? <OverallProgress /> : progressView === "cheat" ? <CheatProgress /> : <GlobetrotterProgress />
            }
          </Col>
          <Col xs={"auto"} className="flex-fill" />
        </Row>
      </Col>

    </Row>}
  </div>;

  function OverallProgress() {
    if (!puzzle) {
      return null;
    }
    const ranks = [
      "Matey",
      "Swabby",
      "Ensign",
      "Coxwain",
      "First Mate",
      "Captain",
      "Commodore",
      "Admiral",
      "Enlightened",
    ];
    const highScore = score(puzzle.words);
    const playerScore = score(words);
    // const basicScore = <>{playerScore} / {highScore}</>;
    let remain = highScore;
    return <>
      {ranks.reverse().map((rank, index) => {
        const to = remain;
        const from = Math.floor(remain * (2 / 3));
        remain = from - 1;
        const playerRank = (from <= playerScore && playerScore <= to);
        const achieved = from < playerScore;
        return <Row key={index} className={playerRank ? "rank-current" : achieved ? "rank-past" : "rank-future"}>
          <Col>{from}</Col>
          <Col>{playerRank ? playerScore : ""}</Col>
          <Col>{to}</Col>
          <Col>{rank}</Col>
        </Row>;
      })}

    </>;
  }

  function GlobetrotterProgress() {
    return puzzle ? <>{words.filter(globetrotter).length} / {puzzle.words.filter(globetrotter).length}</> : null;
  }

  function LengthProgress() {
    const lengthProgress: Array<{ total: number; found: number; length: number; }> = [];
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

    return <>{lengthProgress.sort().map(({ total, found, length }, index) => <Row key={index}>
      <Col xs={1}>{length}</Col>
      {cols.map((index) => <Col key={index} className={index < found ? "marker-found" : index < total ? "marker-unfound" : "marker-blank"} />)}
    </Row>)}</>;
  }

  function CheatProgress() {
    return <>
      {puzzle?.words.map((word) => <span className="m-1">{word}</span>)}
    </>;
  }
}

function puzzleId(puzzle: Puzzle): PuzzleId {
  return [puzzle.island, ...puzzle.board].join("");
}

function Board({ board, play }: { board: string[], play: (letter: string) => void }) {
  return <Col xs={"auto"} className="board">
    <Row className="board-row-1">
      <Cell type="sea" letter={board[0]} play={play} />
      <Cell type="sea" letter={board[1]} play={play} />
      <Cell type="sea" letter={board[2]} play={play} />
    </Row>
    <Row className="board-row-2">
      <Col className="sea">
      </Col>
      <Cell type="island" letter={board[3]} play={play} />
      <Col className="sea">
      </Col>
    </Row>
    <Row className="board-row-3">
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

function score(words: string | string[]): number {
  if (Array.isArray(words)) {
    return _.sumBy(words, score);
  }
  if (words.length <= 4) {
    return 1;
  }
  return words.length - 3 + (globetrotter(words) ? 7 : 0);
}

function globetrotter(words: string) {
  const letters = _.uniq(words);
  return letters.length === 7;
}

export default App;

