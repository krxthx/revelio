"""
Generate the 'words' corpus: individual English words embedded and projected to 3D.

Usage:
    python -m cli.demo.words_pipeline

Output: ui/public/data/words.json
"""

import json
from pathlib import Path

from .embedding import embed, load_model

DEFAULT_MODEL = "BAAI/bge-base-en-v1.5"
from .projection import project, normalize

OUTPUT_PATH = Path(__file__).parent.parent.parent / "ui" / "public" / "data" / "words.json"

# ~2000 common English words covering diverse semantic categories so clusters
# are interesting to explore. Grouped here for readability but order doesn't matter.
WORD_LIST = [
    # Animals
    "dog", "cat", "horse", "cow", "pig", "sheep", "goat", "chicken", "duck", "rabbit",
    "wolf", "fox", "bear", "lion", "tiger", "elephant", "giraffe", "zebra", "monkey",
    "gorilla", "chimpanzee", "penguin", "eagle", "hawk", "owl", "parrot", "crow", "sparrow",
    "salmon", "tuna", "shark", "whale", "dolphin", "octopus", "squid", "crab", "lobster",
    "shrimp", "ant", "bee", "wasp", "butterfly", "moth", "mosquito", "fly", "spider",
    "snake", "lizard", "crocodile", "turtle", "frog", "toad",
    # Food
    "bread", "rice", "pasta", "noodle", "soup", "salad", "steak", "chicken", "fish",
    "pizza", "burger", "sandwich", "taco", "sushi", "curry", "stew", "roast", "grill",
    "apple", "banana", "orange", "grape", "strawberry", "blueberry", "cherry", "peach",
    "mango", "pineapple", "watermelon", "lemon", "lime", "pear", "plum", "apricot",
    "carrot", "potato", "tomato", "onion", "garlic", "pepper", "broccoli", "spinach",
    "lettuce", "cucumber", "celery", "mushroom", "corn", "pea", "bean", "lentil",
    "milk", "cheese", "butter", "yogurt", "cream", "egg", "honey", "sugar", "salt",
    "coffee", "tea", "juice", "wine", "beer", "water",
    # Nature / landscape
    "mountain", "hill", "valley", "river", "lake", "ocean", "sea", "beach", "island",
    "forest", "jungle", "desert", "plain", "meadow", "swamp", "cliff", "cave", "canyon",
    "volcano", "glacier", "waterfall", "stream", "pond", "bay", "reef", "dune",
    "tree", "bush", "flower", "grass", "moss", "fern", "vine", "root", "branch",
    "leaf", "seed", "soil", "rock", "stone", "sand", "mud", "ice", "snow", "rain",
    "cloud", "fog", "wind", "storm", "thunder", "lightning", "sun", "moon", "star",
    # Body / health
    "head", "face", "eye", "ear", "nose", "mouth", "tooth", "tongue", "lip", "chin",
    "neck", "shoulder", "arm", "elbow", "wrist", "hand", "finger", "thumb", "chest",
    "back", "hip", "leg", "knee", "ankle", "foot", "toe", "heart", "lung", "brain",
    "bone", "muscle", "skin", "blood", "nerve", "stomach", "liver", "kidney",
    "doctor", "nurse", "hospital", "medicine", "pill", "surgery", "vaccine", "therapy",
    "pain", "fever", "cold", "flu", "allergy", "injury", "wound", "heal", "healthy",
    # Emotions / psychology
    "happy", "sad", "angry", "afraid", "surprised", "disgusted", "joy", "grief",
    "love", "hate", "fear", "anxiety", "stress", "calm", "peace", "excitement",
    "boredom", "curiosity", "pride", "shame", "guilt", "envy", "jealousy", "trust",
    "hope", "despair", "courage", "confidence", "doubt", "loneliness", "empathy",
    # Colors
    "red", "blue", "green", "yellow", "orange", "purple", "pink", "brown", "black",
    "white", "grey", "gray", "cyan", "magenta", "violet", "indigo", "turquoise",
    "maroon", "olive", "navy", "teal", "gold", "silver", "bronze", "beige", "ivory",
    # Numbers / math
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
    "ten", "hundred", "thousand", "million", "billion", "addition", "subtraction",
    "multiplication", "division", "fraction", "decimal", "percentage", "algebra",
    "geometry", "calculus", "statistics", "probability", "equation", "function",
    "graph", "vector", "matrix", "prime", "integer", "infinity",
    # Science
    "atom", "molecule", "electron", "proton", "neutron", "nucleus", "photon", "energy",
    "force", "gravity", "mass", "velocity", "acceleration", "pressure", "temperature",
    "electricity", "magnetism", "radiation", "wave", "frequency", "wavelength",
    "chemistry", "physics", "biology", "geology", "astronomy", "ecology",
    "evolution", "genetics", "cell", "virus", "bacteria", "protein", "DNA", "enzyme",
    "experiment", "hypothesis", "theory", "observation", "measurement", "data",
    # Technology
    "computer", "laptop", "phone", "tablet", "keyboard", "mouse", "screen", "camera",
    "internet", "network", "server", "database", "software", "hardware", "program",
    "code", "algorithm", "function", "variable", "loop", "array", "object", "class",
    "robot", "artificial", "intelligence", "machine", "learning", "neural", "model",
    "satellite", "rocket", "drone", "engine", "battery", "solar", "electric",
    # Society / politics
    "government", "democracy", "election", "vote", "president", "parliament", "law",
    "justice", "freedom", "rights", "equality", "protest", "revolution", "war", "peace",
    "economy", "market", "trade", "tax", "bank", "money", "currency", "inflation",
    "poverty", "wealth", "education", "school", "university", "research", "culture",
    "religion", "belief", "tradition", "history", "society", "community", "family",
    # Sports / games
    "football", "basketball", "baseball", "tennis", "golf", "swimming", "running",
    "cycling", "boxing", "wrestling", "volleyball", "hockey", "cricket", "rugby",
    "chess", "poker", "dice", "card", "puzzle", "game", "player", "team", "score",
    "victory", "defeat", "championship", "tournament", "athlete", "coach", "referee",
    # Arts / culture
    "music", "song", "melody", "rhythm", "beat", "instrument", "guitar", "piano",
    "violin", "drum", "trumpet", "saxophone", "voice", "singer", "band", "concert",
    "painting", "sculpture", "photography", "film", "cinema", "theater", "dance",
    "poem", "novel", "story", "book", "author", "character", "plot", "narrative",
    "art", "design", "fashion", "style", "beauty", "creativity", "imagination",
    # Transportation
    "car", "truck", "bus", "train", "subway", "bicycle", "motorcycle", "airplane",
    "helicopter", "boat", "ship", "ferry", "submarine", "taxi", "ambulance", "fire",
    "road", "highway", "bridge", "tunnel", "airport", "station", "port", "garage",
    # Home / architecture
    "house", "apartment", "room", "kitchen", "bathroom", "bedroom", "living", "garden",
    "door", "window", "wall", "floor", "ceiling", "roof", "stair", "balcony",
    "chair", "table", "sofa", "bed", "desk", "shelf", "lamp", "mirror", "carpet",
    "building", "tower", "castle", "temple", "church", "mosque", "cathedral", "palace",
    # Time
    "second", "minute", "hour", "day", "week", "month", "year", "decade", "century",
    "morning", "afternoon", "evening", "night", "dawn", "dusk", "midnight", "noon",
    "past", "present", "future", "ancient", "modern", "contemporary", "history",
    "spring", "summer", "autumn", "winter", "season", "calendar", "clock", "time",
    # Verbs (actions)
    "run", "walk", "jump", "swim", "fly", "climb", "fall", "sit", "stand", "sleep",
    "eat", "drink", "cook", "read", "write", "speak", "listen", "sing", "dance",
    "think", "learn", "teach", "create", "build", "destroy", "open", "close",
    "give", "take", "buy", "sell", "work", "play", "fight", "help", "love", "hate",
    "grow", "change", "move", "stop", "start", "finish", "win", "lose", "succeed",
    # Adjectives (qualities)
    "big", "small", "long", "short", "tall", "thin", "fat", "fast", "slow", "strong",
    "weak", "hard", "soft", "hot", "cold", "warm", "cool", "wet", "dry", "clean",
    "dirty", "new", "old", "young", "ancient", "bright", "dark", "loud", "quiet",
    "rich", "poor", "full", "empty", "open", "closed", "safe", "dangerous", "easy",
    "difficult", "simple", "complex", "beautiful", "ugly", "funny", "serious",
    # Abstract concepts
    "truth", "lie", "knowledge", "wisdom", "power", "control", "freedom", "order",
    "chaos", "time", "space", "reality", "dream", "memory", "identity", "soul",
    "mind", "thought", "idea", "concept", "meaning", "purpose", "value", "belief",
    "nature", "universe", "existence", "life", "death", "birth", "growth", "change",
]

# Deduplicate preserving order
seen: set[str] = set()
WORDS: list[str] = []
for w in WORD_LIST:
    wl = w.lower()
    if wl not in seen:
        seen.add(wl)
        WORDS.append(wl)


def generate_words_corpus(model_name: str = DEFAULT_MODEL) -> None:
    print(f"[words] {len(WORDS)} unique words")
    print(f"[words] Loading model: {model_name}")
    model = load_model(model_name)

    print("[words] Embedding…")
    embeddings = embed(WORDS, model)

    print("[words] UMAP projection…")
    coords = normalize(project(embeddings))

    chunks = [
        {
            "id": f"words-{i:04d}",
            "text": word,
            "embedding": emb.tolist(),
            "x": float(coord[0]),
            "y": float(coord[1]),
            "z": float(coord[2]),
        }
        for i, (word, emb, coord) in enumerate(zip(WORDS, embeddings, coords))
    ]

    output = {
        "corpus": "words",
        "model": model_name,
        "chunks": chunks,
        "queries": [],
    }

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(output, separators=(",", ":")), encoding="utf-8")

    size_kb = OUTPUT_PATH.stat().st_size / 1024
    print(f"[words] Wrote {OUTPUT_PATH} ({size_kb:.0f} KB, {len(chunks)} words)")


if __name__ == "__main__":
    generate_words_corpus()
