import {
  BaseFilter,
  Candidate,
  Item,
} from "https://deno.land/x/ddc_vim@v2.2.0/types.ts";
import { Denops } from "https://deno.land/x/ddc_vim@v2.2.0/deps.ts";

function calcScore(a: Candidate, b: Candidate): number {
  const kindA = a.kind;
  const kindB = b.kind;
  const wordA = a.word;
  const wordB = b.word;

  if (kindA == kindB) {
    return 0;
  }

  if (wordA.startsWith("__")) {
    return 1;
  } else if (wordB.startsWith("__")) {
    return -1;
  }

  if (wordA.endsWith("=")) {
    return -1;
  } else if (wordB.endsWith("=")) {
    return 1;
  }

  // _ではじまらない変数を優先
  if (kindA == "variable" && !wordA.startsWith("_")){
      return -1;
  }else if (kindB == "variable" && !wordB.startsWith("_")){
      return 1;
  }

  // Enumの要素とかを優先
  if (kindA == "reference"){
      return -1;
  }
  else if (kindB == "reference"){
      return 1;
  }

	  
  return 0;
}

export class Filter extends BaseFilter<Record<string, never>> {
  filter(args: {
    denops: Denops;
    completeStr: string;
    items: Item[];
  }): Promise<Item[]> {
    return Promise.resolve(args.items.sort((a, b) => {
      return calcScore(a, b) }));
  }
  params(): Record<string, never> {
    return {};
  }
}

