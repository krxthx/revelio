import Image from "next/image";

import {
  CUSTOM_INDEX_FLAGS,
  CUSTOM_INDEX_VARIANTS,
  DEMO_GENERATION_FLAGS,
  DEMO_GENERATION_VARIANTS,
  OPENAI_COMPAT_FIELDS,
  RECOMMENDED_MODELS,
} from "./constants";
import DocsTable from "./docs-table";
import { Block, Code, Divider, P, Section } from "./primitives";

export default function DocsContent() {
  return (
    <div className="flex flex-col gap-10">
      <Section id="embeddings" title="1. What are embeddings?">
        <P>
          An embedding is a way of representing text as a list of numbers - a vector. The key
          property is that <em className="text-foreground">meaning is encoded geometrically</em>:
          text that means similar things produces vectors that are close together in space, while
          unrelated text produces vectors that are far apart.
        </P>
        <P>
          For example, the words <Code>king</Code> and <Code>queen</Code> will have embeddings that
          are much closer to each other than either is to <Code>bicycle</Code>.
        </P>
        <Block>{`"The cat sat on the mat."
          ↓  sentence-transformers model
[-0.032, 0.118, 0.047, -0.091, ...]   ← 768 numbers`}</Block>
        <P>
          Revelio uses <Code>BAAI/bge-base-en-v1.5</Code> across the retrieval pipeline for built-in
          corpora, browser-side query embedding, the word explorer, and custom indexing. It produces
          768-dimensional vectors and keeps every part of retrieval in the same semantic space.
        </P>
      </Section>

      <Divider />

      <Section id="semantic-search" title="2. Semantic search">
        <P>
          Traditional keyword search matches exact words. Semantic search matches{" "}
          <em className="text-foreground">meaning</em>.
        </P>
        <P>
          To find the most relevant chunks for a query, we embed both the query and every chunk, then
          rank by <em className="text-foreground">cosine similarity</em> - the angle between two
          vectors. A similarity of 1.0 means identical direction (very similar), 0 means orthogonal
          (unrelated).
        </P>
        <Block>{`similarity(query, chunk) = (query · chunk) / (|query| × |chunk|)

top_k = sorted(chunks, by=similarity, descending=True)[:k]`}</Block>
        <P>
          In Revelio this happens entirely in the browser. When you select a query, the pre-computed
          embeddings are loaded from JSON and cosine similarity is computed client-side in real time
          - no server round-trip needed for retrieval.
        </P>
      </Section>

      <Divider />

      <Section id="retrieval-modes" title="3. Retrieval modes">
        <P>
          Once embeddings are computed, there are different strategies for picking which chunks to
          return. Revelio supports two, selectable from the settings menu.
        </P>
        <div className="overflow-hidden rounded-lg border border-border">
          <Image
            src="/settings.png"
            alt="Settings pane showing LLM provider options, BYOK note, corpus selector, retrieval mode, and accent colours"
            width={716}
            height={400}
            className="w-full"
          />
        </div>
        <P className="font-medium text-foreground">Cosine similarity</P>
        <P>
          Ranks every chunk by its cosine similarity to the query and returns the top K. Fast and
          predictable. Can return redundant chunks if the corpus has repeated content - you might get
          five chunks all saying the same thing.
        </P>
        <Block>{`scores = [cosine(query, chunk) for chunk in corpus]
top_k  = sorted(scores, descending=True)[:k]`}</Block>
        <P className="font-medium text-foreground">MMR - Maximal Marginal Relevance</P>
        <P>
          MMR picks chunks that are both <em className="text-foreground">relevant to the query</em>{" "}
          and <em className="text-foreground">different from each other</em>. After selecting the
          first chunk (highest similarity), each subsequent pick is penalised if it is too similar to
          an already-selected chunk. This trades a little relevance for more coverage.
        </P>
        <Block>{`selected = []
while len(selected) < k:
    best = argmax over candidates of:
        λ · sim(query, c) − (1−λ) · max sim(c, s) for s in selected
    selected.append(best)`}</Block>
        <P>
          Revelio uses λ=0.5, giving equal weight to relevance and diversity. Try MMR when your
          cosine results all highlight the same passage - it tends to surface a broader range of
          evidence for the LLM to work with.
        </P>
        <P>
          Both modes apply a similarity threshold of <Code>0.3</Code> - chunks below this score are
          excluded regardless of K.
        </P>
      </Section>

      <Divider />

      <Section id="rag" title="4. Retrieval-Augmented Generation (RAG)">
        <P>
          RAG is a pattern for making LLMs answer questions about specific documents without
          re-training or fine-tuning them. The idea is simple:
        </P>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-foreground/80">
          <li>Embed the user&apos;s question.</li>
          <li>Retrieve the top-K most semantically similar chunks from your corpus.</li>
          <li>
            Build a prompt that pastes those chunks in as context:{" "}
            <em className="text-foreground">
              &ldquo;Given this context, answer the question.&rdquo;
            </em>
          </li>
          <li>Send the prompt to an LLM and stream the answer back.</li>
        </ol>
        <P>
          This works because LLMs are good at <em className="text-foreground">reading comprehension</em>:
          they can synthesise an answer from the provided text even if they have never seen that text
          before.
        </P>
        <P>
          Why RAG instead of just asking the LLM directly? LLMs have knowledge cutoffs, they can
          hallucinate facts, and they can&apos;t access your private documents. RAG grounds the
          answer in a specific, verifiable source.
        </P>
        <Block>{`System: You are a helpful assistant. Answer using only the provided context.

User:
Context:
[1] Alice was beginning to get very tired of sitting by her sister...
[2] There was nothing so very remarkable in that...

Question: Why was Alice bored?`}</Block>
        <P>
          The <strong className="text-foreground">Prompt Builder</strong> panel in the demo shows you
          exactly this constructed prompt, and the{" "}
          <strong className="text-foreground">Answer Panel</strong> streams the LLM response.
        </P>
      </Section>

      <Divider />

      <Section id="chunking" title="5. Chunking">
        <P>
          Embedding models have a maximum input length (typically 256–512 tokens). Long documents
          must be split into smaller pieces called <em className="text-foreground">chunks</em> before
          embedding.
        </P>
        <P>
          The chunking strategy matters: chunks that are too small lose context, chunks that are too
          large dilute the signal. Revelio uses a sliding-window approach with overlap so that
          sentences near a boundary appear in two adjacent chunks, reducing the chance of a relevant
          sentence being cut off.
        </P>
        <Block>{`raw text
   ↓  split into ~500-token windows, 50-token overlap
[chunk 0] [chunk 1] [chunk 2] ...
   ↓  embed each chunk independently
[vec 0]   [vec 1]   [vec 2]  ...`}</Block>
        <P>
          Each dot you see in the 3D viewer is one chunk. When a query is selected, the dots that
          light up are the chunks with the highest cosine similarity to that query.
        </P>
      </Section>

      <Divider />

      <Section id="umap" title="6. Dimensionality reduction & UMAP">
        <P>
          Embedding vectors are 768 dimensions - impossible to visualise directly. To display them in
          3D, we use <em className="text-foreground">Uniform Manifold Approximation and Projection (UMAP)</em>.
        </P>
        <P>
          UMAP is a non-linear dimensionality reduction algorithm that tries to preserve the local
          neighbourhood structure of the high-dimensional data. In practice this means:{" "}
          <em className="text-foreground">chunks that were close in 768D tend to stay close in 3D</em>.
          You can see natural semantic clusters - passages about the same topic clump together.
        </P>
        <Block>{`chunk embeddings: shape (N, 768)
         ↓  UMAP(n_components=3)
3D coords:      shape (N, 3)
         ↓  normalize to [-1, 1]³
scatter plot points`}</Block>
        <P>
          The 3D coordinates are only used for visualisation. All retrieval still uses the original
          high-dimensional embeddings - the projected positions are{" "}
          <em className="text-foreground">not</em> used for cosine similarity.
        </P>
      </Section>

      <Divider />

      <Section id="pipeline" title="7. How the Revelio pipeline works">
        <P>
          Revelio is split into two parts: a Python CLI that pre-computes corpus data, and a Next.js
          UI that loads and explores it.
        </P>
        <P className="font-medium text-foreground">Python CLI (<Code>cli/demo</Code>)</P>
        <Block>{`data/raw/alice.txt
      ↓  chunk_text()          # sliding window
["Alice was…", "in that…", …]
      ↓  embed()               # sentence-transformers
[[0.03, -0.09, …], …]         # shape (N, 768)
      ↓  project() + normalize() # UMAP → 3D
[[0.12, -0.44, 0.31], …]
      ↓  write JSON
ui/public/data/alice.json`}</Block>
        <P>
          Pre-built query embeddings are included in the same JSON file so the browser never needs to
          run a model.
        </P>
        <P className="font-medium text-foreground">Next.js UI</P>
        <Block>{`load /data/alice.json          # fetch on corpus select
      ↓
user selects a query
      ↓  retrieve() - cosine similarity in the browser
top-K chunks highlighted in 3D viewer
      ↓
POST /api/chat  { messages: [system, user+context] }
      ↓  LLM API (OpenRouter / any OpenAI-compatible)
streamed answer → Answer Panel`}</Block>
        <P>
          The LLM backend is configured via environment variables (<Code>LLM_BASE_URL</Code>,{" "}
          <Code>LLM_MODEL</Code>, <Code>LLM_API_KEY</Code>) and defaults to OpenRouter with a free
          Mistral model so you can run it without any setup.
        </P>
      </Section>

      <Divider />

      <Section id="custom-corpora" title="8. Custom data sources">
        <P>
          Yes. Revelio supports custom corpora in addition to the built-in datasets. The UI looks for
          a manifest at <Code>/data/custom/manifest.json</Code>, then loads each selected project
          from <Code>/data/custom/&lt;id&gt;.json</Code>.
        </P>
        <P className="font-medium text-foreground">Generate a custom corpus with the CLI</P>
        <Block>{`cd cli
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

python revelio.py index ./path/to/your/docs --name "My Project"`}</Block>
        <P className="font-medium text-foreground">Command variants</P>
        <Block>{`python revelio.py index <folder> --name "<project name>" [--output <dir>]`}</Block>
        <DocsTable
          headers={["Variant", "When to use it"]}
          rows={CUSTOM_INDEX_VARIANTS}
          monospaceColumns={[0]}
        />
        <DocsTable
          headers={["Flag", "Required", "Purpose"]}
          rows={CUSTOM_INDEX_FLAGS}
          monospaceColumns={[0]}
          nowrapColumns={[1]}
        />
        <P>
          The indexer walks the folder recursively, extracts text, chunks it, embeds each chunk with{" "}
          <Code>BAAI/bge-base-en-v1.5</Code>, projects it to 3D with UMAP, writes the corpus JSON,
          and updates the manifest automatically.
        </P>
        <P>
          Supported inputs are <Code>.txt</Code>, <Code>.md</Code>, <Code>.pdf</Code>,{" "}
          <Code>.jpg</Code>, <Code>.jpeg</Code>, <Code>.png</Code>, <Code>.gif</Code>, and{" "}
          <Code>.webp</Code>. PDF parsing needs <Code>pypdf</Code>; image OCR needs{" "}
          <Code>pytesseract</Code>, <Code>Pillow</Code>, and the system <Code>tesseract</Code>{" "}
          binary.
        </P>
        <P className="font-medium text-foreground">What gets written</P>
        <Block>{`ui/public/data/custom/
├── manifest.json
└── my-project.json`}</Block>
        <Block>{`{
  "projects": [
    {
      "id": "my-project",
      "label": "My Project",
      "file": "my-project.json"
    }
  ]
}`}</Block>
        <Block>{`{
  "corpus": "my-project",
  "label": "My Project",
  "model": "BAAI/bge-base-en-v1.5",
  "chunks": [
    {
      "id": "my-project-chunk-0000",
      "text": "Chunk text...",
      "source": "notes.pdf",
      "embedding": [0.12, -0.03, ...],
      "x": 0.41,
      "y": -0.22,
      "z": 0.67
    }
  ],
  "queries": []
}`}</Block>
        <P>
          The <Code>source</Code> field is optional in the shared corpus type, but custom corpora
          generated by the CLI include it so the UI can show which file a chunk came from.
        </P>
        <P className="font-medium text-foreground">How it shows up in the app</P>
        <P>
          After indexing, restart <Code>npm run dev</Code>. Your dataset appears in the settings menu
          under <em className="text-foreground">Your Projects</em>. Selecting it uses the same
          client-side retrieval flow as the built-in corpora.
        </P>
        <P className="font-medium text-foreground">Built-in corpus generation variants</P>
        <Block>{`python -m demo --all [--model <embedding-model>]
python -m demo --corpus <alice|fastapi|space|words> [--model <embedding-model>]`}</Block>
        <DocsTable
          headers={["Variant", "When to use it"]}
          rows={DEMO_GENERATION_VARIANTS}
          monospaceColumns={[0]}
        />
        <DocsTable
          headers={["Flag", "Required", "Purpose"]}
          rows={DEMO_GENERATION_FLAGS}
          monospaceColumns={[0]}
          nowrapColumns={[1]}
        />
      </Section>

      <Divider />

      <Section id="models" title="9. Recommended models">
        <P>
          Revelio works with any OpenAI-compatible API. Smaller instruction-following models tend to
          work better for RAG than large RLHF-trained ones - they follow the system prompt more
          faithfully and avoid over-hedging when context is provided.
        </P>
        <DocsTable
          headers={["Model", "Via", "Notes"]}
          rows={RECOMMENDED_MODELS}
          monospaceColumns={[0]}
          nowrapColumns={[1]}
        />
        <P>
          To use OpenRouter, set the base URL to <Code>https://openrouter.ai/api/v1</Code> and
          supply your API key. For Ollama, set it to <Code>http://localhost:11434/v1</Code> with no
          key required. Both can be configured at runtime from the settings menu without restarting.
        </P>
        <P className="font-medium text-foreground">Getting an OpenRouter API key</P>
        <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-foreground/80">
          <li>
            Go to <span className="font-mono text-foreground">openrouter.ai</span> and sign in.
          </li>
          <li>
            Open <em className="text-foreground">Keys</em> in the sidebar and create a new key.
            Free-tier models (marked <Code>:free</Code>) work with no credit balance.
          </li>
          <li>
            Copy the key and paste it into the <em className="text-foreground">API Key</em> field in
            Revelio&apos;s settings menu.
          </li>
          <li>
            Set the model ID - e.g. <Code>mistralai/mistral-small-3.1-24b-instruct:free</Code>. You
            can browse all available models at{" "}
            <span className="font-mono text-foreground">openrouter.ai/models</span>.
          </li>
        </ol>

        <P className="font-medium text-foreground">Using any other OpenAI-compatible provider</P>
        <P>
          Any provider that implements the OpenAI chat completions API works - OpenAI itself, Together
          AI, Groq, LM Studio, vLLM, etc. The settings menu has three fields:
        </P>
        <DocsTable
          headers={["Field", "Example"]}
          rows={OPENAI_COMPAT_FIELDS}
          monospaceColumns={[1]}
        />
        <P>
          The key is never sent to Revelio&apos;s server - it travels directly from your browser to
          the LLM provider in the <Code>Authorization</Code> header.
        </P>
      </Section>
    </div>
  );
}
