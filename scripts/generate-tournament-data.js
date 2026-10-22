const fs = require("fs");
const path = require("path");

const repositoryRoot = path.resolve(__dirname, "..");
const decklistDirectory = path.join(repositoryRoot, "src", "Data", "decklists");
const outputPath = path.join(repositoryRoot, "src", "Data", "TournamentData.generated.ts");
const files = fs.readdirSync(decklistDirectory)
    .filter((file) => file.endsWith(".json"))
    .sort();

if (files.length === 0) {
    throw new Error(`No tournament JSON files found in ${decklistDirectory}`);
}

const imports = files.map((file, index) =>
    `import tournament${index} from "./decklists/${file}";`
).join("\n");
const tournaments = files.map((_, index) => `tournament${index} as ITournamentResults`).join(", ");
const generated = [
    'import type { ITournamentResults } from "./TournamentResults";',
    imports,
    "",
    `export const TOURNAMENT_DATA: ITournamentResults[] = [${tournaments}];`,
    ""
].join("\n");

if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== generated) {
    fs.writeFileSync(outputPath, generated);
}
