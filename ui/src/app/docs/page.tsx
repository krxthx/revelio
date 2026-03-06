import NavBar from "@/components/nav-bar";

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="flex flex-col gap-4">
    <h2 className="text-lg font-semibold tracking-tight text-foreground">{title}</h2>
    {children}
  </section>
);

const P = ({ children }: { children: React.ReactNode }) => (
  <p className="text-sm leading-relaxed text-muted-foreground">{children}</p>
);

const Code = ({ children }: { children: React.ReactNode }) => (
  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground">{children}</code>
);

const Block = ({ children }: { children: React.ReactNode }) => (
  <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-4 font-mono text-xs leading-relaxed text-foreground">
    {children}
  </pre>
);

const Divider = () => <hr className="border-border" />;

const Docs = () => (
  <div className="relative flex min-h-screen flex-col bg-background text-foreground">
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />
    <NavBar />

    <div className="mx-auto w-full max-w-2xl px-6 py-12">
      {/* Page header */}
      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">How Revelio Works</h1>
        <p className="text-sm text-muted-foreground">
          A guide to the concepts behind Retrieval-Augmented Generation, embeddings, and what
          Revelio is actually showing you.
        </p>
      </div>

      {/* TOC */}
      <nav className="mb-10 rounded-lg border border-border bg-card p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Contents
        </p>
        <ol className="flex flex-col gap-1.5 text-sm">
          {[
            ["#embeddings", "1. What are embeddings?"],
            ["#semantic-search", "2. Semantic search"],
            ["#rag", "3. Retrieval-Augmented Generation (RAG)"],
            ["#chunking", "4. Chunking"],
            ["#umap", "5. Dimensionality reduction & UMAP"],
            ["#pipeline", "6. How the Revelio pipeline works"],
          ].map(([href, label]) => (
            <li key={href}>
              <a href={href} className="text-muted-foreground hover:text-foreground transition-colors">
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="flex flex-col gap-10">
        {/* 1 */}
        <Section id="embeddings" title="1. What are embeddings?">
          <P>
            An embedding is a way of representing text as a list of numbers — a vector. The key
            property is that <em className="text-foreground">meaning is encoded geometrically</em>:
            text that means similar things produces vectors that are close together in space, while
            unrelated text produces vectors that are far apart.
          </P>
          <P>
            For example, the words <Code>king</Code> and <Code>queen</Code> will have embeddings
            that are much closer to each other than either is to <Code>bicycle</Code>.
          </P>
          <Block>{`"The cat sat on the mat."
          ↓  sentence-transformers model
[-0.032, 0.118, 0.047, -0.091, ...]   ← 384 numbers`}</Block>
          <P>
            Revelio uses{" "}
            <Code>all-MiniLM-L6-v2</Code> for text corpora (384-dimensional vectors) and{" "}
            <Code>BAAI/bge-base-en-v1.5</Code> for the word explorer (768-dimensional vectors).
            Both are open-source models from the{" "}
            <span className="text-foreground">sentence-transformers</span> library.
          </P>
        </Section>

        <Divider />

        {/* 2 */}
        <Section id="semantic-search" title="2. Semantic search">
          <P>
            Traditional keyword search matches exact words. Semantic search matches{" "}
            <em className="text-foreground">meaning</em>.
          </P>
          <P>
            To find the most relevant chunks for a query, we embed both the query and every chunk,
            then rank by <em className="text-foreground">cosine similarity</em> — the angle between
            two vectors. A similarity of 1.0 means identical direction (very similar), 0 means
            orthogonal (unrelated).
          </P>
          <Block>{`similarity(query, chunk) = (query · chunk) / (|query| × |chunk|)

top_k = sorted(chunks, by=similarity, descending=True)[:k]`}</Block>
          <P>
            In Revelio this happens entirely in the browser. When you select a query, the
            pre-computed embeddings are loaded from JSON and cosine similarity is computed
            client-side in real time — no server round-trip needed for retrieval.
          </P>
        </Section>

        <Divider />

        {/* 3 */}
        <Section id="rag" title="3. Retrieval-Augmented Generation (RAG)">
          <P>
            RAG is a pattern for making LLMs answer questions about specific documents without
            re-training or fine-tuning them. The idea is simple:
          </P>
          <ol className="flex list-decimal flex-col gap-2 pl-5 text-sm text-muted-foreground">
            <li>Embed the user&apos;s question.</li>
            <li>Retrieve the top-K most semantically similar chunks from your corpus.</li>
            <li>
              Build a prompt that pastes those chunks in as context:{" "}
              <em className="text-foreground">"Given this context, answer the question."</em>
            </li>
            <li>Send the prompt to an LLM and stream the answer back.</li>
          </ol>
          <P>
            This works because LLMs are good at <em className="text-foreground">reading comprehension</em>:
            they can synthesise an answer from the provided text even if they have never seen that
            text before.
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
            The <strong className="text-foreground">Prompt Builder</strong> panel in the demo shows
            you exactly this constructed prompt, and the{" "}
            <strong className="text-foreground">Answer Panel</strong> streams the LLM response.
          </P>
        </Section>

        <Divider />

        {/* 4 */}
        <Section id="chunking" title="4. Chunking">
          <P>
            Embedding models have a maximum input length (typically 256–512 tokens). Long documents
            must be split into smaller pieces called <em className="text-foreground">chunks</em>{" "}
            before embedding.
          </P>
          <P>
            The chunking strategy matters: chunks that are too small lose context, chunks that are
            too large dilute the signal. Revelio uses a sliding-window approach with overlap so that
            sentences near a boundary appear in two adjacent chunks, reducing the chance of a
            relevant sentence being cut off.
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

        {/* 5 */}
        <Section id="umap" title="5. Dimensionality reduction & UMAP">
          <P>
            Embedding vectors are 384 or 768 dimensions — impossible to visualise directly. To
            display them in 3D, we use{" "}
            <em className="text-foreground">
              Uniform Manifold Approximation and Projection (UMAP)
            </em>
            .
          </P>
          <P>
            UMAP is a non-linear dimensionality reduction algorithm that tries to preserve the
            local neighbourhood structure of the high-dimensional data. In practice this means:{" "}
            <em className="text-foreground">
              chunks that were close in 384D tend to stay close in 3D
            </em>
            . You can see natural semantic clusters — passages about the same topic clump together.
          </P>
          <Block>{`chunk embeddings: shape (N, 384)
         ↓  UMAP(n_components=3)
3D coords:      shape (N, 3)
         ↓  normalize to [-1, 1]³
scatter plot points`}</Block>
          <P>
            The 3D coordinates are only used for visualisation. All retrieval still uses the
            original high-dimensional embeddings — the projected positions are{" "}
            <em className="text-foreground">not</em> used for cosine similarity.
          </P>
        </Section>

        <Divider />

        {/* 6 */}
        <Section id="pipeline" title="6. How the Revelio pipeline works">
          <P>
            Revelio is split into two parts: a Python CLI that pre-computes corpus data, and a
            Next.js UI that loads and explores it.
          </P>
          <P className="font-medium text-foreground">Python CLI (<Code>cli/demo</Code>)</P>
          <Block>{`data/raw/alice.txt
      ↓  chunk_text()          # sliding window
["Alice was…", "in that…", …]
      ↓  embed()               # sentence-transformers
[[0.03, -0.09, …], …]         # shape (N, 384)
      ↓  project() + normalize() # UMAP → 3D
[[0.12, -0.44, 0.31], …]
      ↓  write JSON
ui/public/data/alice.json`}</Block>
          <P>
            Pre-built query embeddings are included in the same JSON file so the browser never
            needs to run a model.
          </P>
          <P className="font-medium text-foreground">Next.js UI</P>
          <Block>{`load /data/alice.json          # fetch on corpus select
      ↓
user selects a query
      ↓  retrieve() — cosine similarity in the browser
top-K chunks highlighted in 3D viewer
      ↓
POST /api/chat  { messages: [system, user+context] }
      ↓  LLM API (OpenRouter / Ollama / any OpenAI-compatible)
streamed answer → Answer Panel`}</Block>
          <P>
            The LLM backend is configured via environment variables (<Code>LLM_BASE_URL</Code>,{" "}
            <Code>LLM_MODEL</Code>, <Code>LLM_API_KEY</Code>) and defaults to OpenRouter with a
            free Mistral model so you can run it without any setup.
          </P>
        </Section>
      </div>
    </div>
  </div>
);

export default Docs;
