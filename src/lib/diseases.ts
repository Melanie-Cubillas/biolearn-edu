export type DiseaseId = "huntington" | "anemia" | "fibrosis";

export interface Disease {
  id: DiseaseId;
  name: string;
  gene: string;
  shortMutation: string;
  description: string;
  symptoms: string[];
  causes: string;
  concept: string;
  reference: string;
  sample: string;
  mutationType: "expansion" | "substitution" | "deletion";
  gradient: string;
  badge: string;
  prevalence: string;
  cases: number;
  // chart data
  byLocation: { region: string; cases: number }[];
  byAge: { range: string; cases: number }[];
  byGender: { name: string; value: number }[];
}

export const diseases: Record<DiseaseId, Disease> = {
  huntington: {
    id: "huntington",
    name: "Enfermedad de Huntington",
    gene: "HTT",
    shortMutation: "Repetición CAG",
    description: "Trastorno neurodegenerativo hereditario causado por la expansión del trinucleótido CAG.",
    symptoms: ["Movimientos involuntarios (corea)", "Deterioro cognitivo progresivo", "Cambios de personalidad", "Dificultad para tragar y hablar"],
    causes: "Una expansión anormal de la repetición del trinucleótido CAG (>36 repeticiones) en el gen HTT del cromosoma 4 produce una proteína huntingtina alterada que daña las neuronas.",
    concept: "La huntingtina mutada se acumula en las neuronas del estriado, causando muerte neuronal progresiva. La cantidad de repeticiones CAG correlaciona con la edad de inicio.",
    reference: "ATGCAGCAGCAGCAGCAGTAA",
    sample:    "ATGCAGCAGCAGCAGCAGCAGCAGTAA",
    mutationType: "expansion",
    gradient: "bg-gradient-purple",
    badge: "Neurodegenerativa",
    prevalence: "5-10 por 100,000",
    cases: 7421,
    byLocation: [
      { region: "Norte América", cases: 30000 },
      { region: "Europa", cases: 45000 },
      { region: "Asia", cases: 8000 },
      { region: "Sudamérica", cases: 12000 },
      { region: "África", cases: 3000 },
      { region: "Oceanía", cases: 2000 },
    ],
    byAge: [
      { range: "0-20", cases: 200 },
      { range: "21-40", cases: 1800 },
      { range: "41-60", cases: 3200 },
      { range: "61-80", cases: 1900 },
      { range: "80+", cases: 321 },
    ],
    byGender: [
      { name: "Femenino", value: 49 },
      { name: "Masculino", value: 51 },
    ],
  },
  anemia: {
    id: "anemia",
    name: "Anemia Falciforme",
    gene: "HBB",
    shortMutation: "GAG → GTG (Glu→Val)",
    description: "Trastorno sanguíneo hereditario donde los glóbulos rojos adoptan forma de hoz por una sustitución puntual.",
    symptoms: ["Fatiga crónica", "Episodios dolorosos (crisis)", "Infecciones recurrentes", "Retraso en el crecimiento"],
    causes: "Una mutación puntual GAG→GTG en el codón 6 del gen HBB reemplaza ácido glutámico por valina, produciendo hemoglobina S que polimeriza bajo baja oxigenación.",
    concept: "La hemoglobina S deforma los eritrocitos en condiciones de hipoxia, obstruyendo capilares y reduciendo el transporte de oxígeno a los tejidos.",
    reference: "ATGGTGCATCTGACTCCTGAGGAGAAGTAA",
    sample:    "ATGGTGCATCTGACTCCTGTGGAGAAGTAA",
    mutationType: "substitution",
    gradient: "bg-gradient-blue",
    badge: "Hematológica",
    prevalence: "1 por 365 (afrodescendientes)",
    cases: 100000,
    byLocation: [
      { region: "África", cases: 240000 },
      { region: "Norte América", cases: 100000 },
      { region: "Europa", cases: 35000 },
      { region: "Sudamérica", cases: 60000 },
      { region: "Asia", cases: 45000 },
      { region: "Oceanía", cases: 5000 },
    ],
    byAge: [
      { range: "0-20", cases: 42000 },
      { range: "21-40", cases: 35000 },
      { range: "41-60", cases: 18000 },
      { range: "61-80", cases: 4500 },
      { range: "80+", cases: 500 },
    ],
    byGender: [
      { name: "Femenino", value: 52 },
      { name: "Masculino", value: 48 },
    ],
  },
  fibrosis: {
    id: "fibrosis",
    name: "Fibrosis Quística",
    gene: "CFTR",
    shortMutation: "ΔF508 (deleción)",
    description: "Enfermedad genética que afecta los canales de cloro, produciendo moco espeso en pulmones y páncreas.",
    symptoms: ["Tos persistente con moco espeso", "Infecciones pulmonares frecuentes", "Problemas digestivos", "Sudor con alto contenido de sal"],
    causes: "Mutaciones en el gen CFTR (cromosoma 7) alteran el canal regulador de conductancia transmembrana, afectando el transporte de iones cloruro a través de las membranas epiteliales.",
    concept: "Sin un canal CFTR funcional, las secreciones se vuelven viscosas y obstruyen las vías respiratorias y conductos pancreáticos. La mutación ΔF508 elimina tres nucleótidos.",
    reference: "ATGATCATCTTTGGTGTTTAA",
    sample:    "ATGATCATCGGTGTTTAA",
    mutationType: "deletion",
    gradient: "bg-gradient-green",
    badge: "Multisistémica",
    prevalence: "1 por 2,500-3,500",
    cases: 70000,
    byLocation: [
      { region: "Europa", cases: 48000 },
      { region: "Norte América", cases: 40000 },
      { region: "Sudamérica", cases: 8000 },
      { region: "Asia", cases: 3500 },
      { region: "África", cases: 1200 },
      { region: "Oceanía", cases: 3300 },
    ],
    byAge: [
      { range: "0-20", cases: 28000 },
      { range: "21-40", cases: 26000 },
      { range: "41-60", cases: 12000 },
      { range: "61-80", cases: 3500 },
      { range: "80+", cases: 500 },
    ],
    byGender: [
      { name: "Femenino", value: 48 },
      { name: "Masculino", value: 52 },
    ],
  },
};

export const diseaseList = Object.values(diseases);

// Codon table
export const codonTable: Record<string, { aa: string; full: string; letter: string }> = {
  UUU: { aa: "Phe", full: "Fenilalanina", letter: "F" },
  UUC: { aa: "Phe", full: "Fenilalanina", letter: "F" },
  UUA: { aa: "Leu", full: "Leucina", letter: "L" },
  UUG: { aa: "Leu", full: "Leucina", letter: "L" },
  CUU: { aa: "Leu", full: "Leucina", letter: "L" },
  CUC: { aa: "Leu", full: "Leucina", letter: "L" },
  CUA: { aa: "Leu", full: "Leucina", letter: "L" },
  CUG: { aa: "Leu", full: "Leucina", letter: "L" },
  AUU: { aa: "Ile", full: "Isoleucina", letter: "I" },
  AUC: { aa: "Ile", full: "Isoleucina", letter: "I" },
  AUA: { aa: "Ile", full: "Isoleucina", letter: "I" },
  AUG: { aa: "Met", full: "Metionina (Inicio)", letter: "M" },
  GUU: { aa: "Val", full: "Valina", letter: "V" },
  GUC: { aa: "Val", full: "Valina", letter: "V" },
  GUA: { aa: "Val", full: "Valina", letter: "V" },
  GUG: { aa: "Val", full: "Valina", letter: "V" },
  UCU: { aa: "Ser", full: "Serina", letter: "S" },
  UCC: { aa: "Ser", full: "Serina", letter: "S" },
  UCA: { aa: "Ser", full: "Serina", letter: "S" },
  UCG: { aa: "Ser", full: "Serina", letter: "S" },
  CCU: { aa: "Pro", full: "Prolina", letter: "P" },
  CCC: { aa: "Pro", full: "Prolina", letter: "P" },
  CCA: { aa: "Pro", full: "Prolina", letter: "P" },
  CCG: { aa: "Pro", full: "Prolina", letter: "P" },
  ACU: { aa: "Thr", full: "Treonina", letter: "T" },
  ACC: { aa: "Thr", full: "Treonina", letter: "T" },
  ACA: { aa: "Thr", full: "Treonina", letter: "T" },
  ACG: { aa: "Thr", full: "Treonina", letter: "T" },
  GCU: { aa: "Ala", full: "Alanina", letter: "A" },
  GCC: { aa: "Ala", full: "Alanina", letter: "A" },
  GCA: { aa: "Ala", full: "Alanina", letter: "A" },
  GCG: { aa: "Ala", full: "Alanina", letter: "A" },
  UAU: { aa: "Tyr", full: "Tirosina", letter: "Y" },
  UAC: { aa: "Tyr", full: "Tirosina", letter: "Y" },
  UAA: { aa: "Stop", full: "Codón de parada", letter: "*" },
  UAG: { aa: "Stop", full: "Codón de parada", letter: "*" },
  CAU: { aa: "His", full: "Histidina", letter: "H" },
  CAC: { aa: "His", full: "Histidina", letter: "H" },
  CAA: { aa: "Gln", full: "Glutamina", letter: "Q" },
  CAG: { aa: "Gln", full: "Glutamina", letter: "Q" },
  AAU: { aa: "Asn", full: "Asparagina", letter: "N" },
  AAC: { aa: "Asn", full: "Asparagina", letter: "N" },
  AAA: { aa: "Lys", full: "Lisina", letter: "K" },
  AAG: { aa: "Lys", full: "Lisina", letter: "K" },
  GAU: { aa: "Asp", full: "Aspártico", letter: "D" },
  GAC: { aa: "Asp", full: "Aspártico", letter: "D" },
  GAA: { aa: "Glu", full: "Glutámico", letter: "E" },
  GAG: { aa: "Glu", full: "Glutámico", letter: "E" },
  UGU: { aa: "Cys", full: "Cisteína", letter: "C" },
  UGC: { aa: "Cys", full: "Cisteína", letter: "C" },
  UGA: { aa: "Stop", full: "Codón de parada", letter: "*" },
  UGG: { aa: "Trp", full: "Triptófano", letter: "W" },
  CGU: { aa: "Arg", full: "Arginina", letter: "R" },
  CGC: { aa: "Arg", full: "Arginina", letter: "R" },
  CGA: { aa: "Arg", full: "Arginina", letter: "R" },
  CGG: { aa: "Arg", full: "Arginina", letter: "R" },
  AGU: { aa: "Ser", full: "Serina", letter: "S" },
  AGC: { aa: "Ser", full: "Serina", letter: "S" },
  AGA: { aa: "Arg", full: "Arginina", letter: "R" },
  AGG: { aa: "Arg", full: "Arginina", letter: "R" },
  GGU: { aa: "Gly", full: "Glicina", letter: "G" },
  GGC: { aa: "Gly", full: "Glicina", letter: "G" },
  GGA: { aa: "Gly", full: "Glicina", letter: "G" },
  GGG: { aa: "Gly", full: "Glicina", letter: "G" },
};

export function transcribe(dna: string): string {
  return dna.toUpperCase().replace(/T/g, "U");
}

export function translate(rna: string): { codons: string[]; aas: { aa: string; letter: string; full: string }[] } {
  const codons: string[] = [];
  const aas: { aa: string; letter: string; full: string }[] = [];
  for (let i = 0; i + 3 <= rna.length; i += 3) {
    const c = rna.slice(i, i + 3);
    codons.push(c);
    const entry = codonTable[c] ?? { aa: "?", full: "Desconocido", letter: "?" };
    aas.push(entry);
    if (entry.aa === "Stop") break;
  }
  return { codons, aas };
}

// Sequence analysis
export interface Mutation {
  position: number;
  type: "substitution" | "insertion" | "deletion" | "match";
  ref: string;
  sample: string;
}

export function analyzeSequences(ref: string, sample: string) {
  // Simple alignment: walk both strings; if lengths differ, mark insertions/deletions
  const mutations: Mutation[] = [];
  let i = 0, j = 0;
  while (i < ref.length || j < sample.length) {
    if (i >= ref.length) {
      mutations.push({ position: j, type: "insertion", ref: "-", sample: sample[j] });
      j++;
    } else if (j >= sample.length) {
      mutations.push({ position: i, type: "deletion", ref: ref[i], sample: "-" });
      i++;
    } else if (ref[i] === sample[j]) {
      mutations.push({ position: i, type: "match", ref: ref[i], sample: sample[j] });
      i++; j++;
    } else {
      // Try to detect insertion in sample
      if (ref[i] === sample[j + 1]) {
        mutations.push({ position: j, type: "insertion", ref: "-", sample: sample[j] });
        j++;
      } else if (ref[i + 1] === sample[j]) {
        mutations.push({ position: i, type: "deletion", ref: ref[i], sample: "-" });
        i++;
      } else {
        mutations.push({ position: i, type: "substitution", ref: ref[i], sample: sample[j] });
        i++; j++;
      }
    }
  }
  const matches = mutations.filter((m) => m.type === "match").length;
  const total = Math.max(ref.length, sample.length);
  const similarity = (matches / total) * 100;
  const subs = mutations.filter((m) => m.type === "substitution").length;
  const ins = mutations.filter((m) => m.type === "insertion").length;
  const dels = mutations.filter((m) => m.type === "deletion").length;

  // Find repeats (triplet repetitions)
  const repeats = countTripletRepeats(ref) - countTripletRepeats(sample.replace(/-/g, ""));
  return { mutations, similarity, subs, ins, dels, matches, total, repeatsDelta: Math.abs(repeats) };
}

function countTripletRepeats(s: string): number {
  // count max run of "CAG"
  let max = 0, cur = 0;
  for (let i = 0; i + 3 <= s.length; i += 3) {
    if (s.slice(i, i + 3) === "CAG") { cur++; max = Math.max(max, cur); } else cur = 0;
  }
  return max;
}

export const ncbiSamples = [
  {
    accession: "NM_002111.8",
    organism: "Homo sapiens",
    authors: "Mangiarini L, et al.",
    title: "Huntingtin (HTT) mRNA, complete cds",
    length: 13498,
    gene: "HTT",
    sequence: "ATGCAGCAGCAGCAGCAGCAGCAGCAGCAGCAGTAA",
  },
  {
    accession: "NM_000518.5",
    organism: "Homo sapiens",
    authors: "Marotta CA, et al.",
    title: "Hemoglobin subunit beta (HBB) mRNA",
    length: 626,
    gene: "HBB",
    sequence: "ATGGTGCATCTGACTCCTGTGGAGAAGTAA",
  },
  {
    accession: "NM_000492.4",
    organism: "Homo sapiens",
    authors: "Riordan JR, et al.",
    title: "CF transmembrane conductance regulator (CFTR) mRNA",
    length: 6132,
    gene: "CFTR",
    sequence: "ATGATCATCGGTGTTTAA",
  },
];
