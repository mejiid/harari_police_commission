import json
import os

def merge_chunks(out_dir):
    merged = {"nodes": [], "edges": [], "hyperedges": []}
    for i in range(1, 5):
        chunk_path = os.path.join(out_dir, f".graphify_chunk_{i}.json")
        if os.path.exists(chunk_path):
            with open(chunk_path, "r", encoding="utf-8") as f:
                chunk = json.load(f)
                merged["nodes"].extend(chunk.get("nodes", []))
                merged["edges"].extend(chunk.get("edges", []))
                merged["hyperedges"].extend(chunk.get("hyperedges", []))
    
    # De-duplicate nodes by ID
    nodes_by_id = {node["id"]: node for node in merged["nodes"]}
    merged["nodes"] = list(nodes_by_id.values())
    
    with open(os.path.join(out_dir, "graph.json"), "w", encoding="utf-8") as f:
        json.dump(merged, f, indent=2)

if __name__ == "__main__":
    merge_chunks("c:\\Users\\MEJID\\Desktop\\harari prison website\\prison\\graphify-out")
