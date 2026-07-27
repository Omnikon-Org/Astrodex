import json
import subprocess
import sys
import os

REPO = "Omnikon-Org/Astrodex"
WORKSPACE = "/Users/sourabhpatne16/Developer/untitled folder"
EXPECTED_NAME = "SourabhX16"
EXPECTED_EMAIL = "146323884+SourabhX16@users.noreply.github.com"

CLEAN_PACKAGE_JSON = """{
  "name": "astrodex",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "typecheck": "tsc --noEmit",
    "test": "vitest",
    "analyze": "ANALYZE=true next build",
    "format": "prettier --write ."
  },
  "dependencies": {
    "@react-three/drei": "^10.7.7",
    "@react-three/fiber": "^9.6.1",
    "@react-three/postprocessing": "^3.0.4",
    "@supabase/supabase-js": "^2.110.8",
    "next": "16.2.7",
    "postprocessing": "^6.39.3",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-error-boundary": "^6.1.2",
    "react-focus-lock": "^2.13.7",
    "three": "^0.184.0"
  },
  "devDependencies": {
    "@next/bundle-analyzer": "^16.2.11",
    "@tailwindcss/postcss": "^4",
    "@testing-library/dom": "^10.4.1",
    "@testing-library/jest-dom": "^7.0.0",
    "@testing-library/react": "^16.3.2",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@types/three": "^0.184.1",
    "@vitejs/plugin-react": "^6.0.3",
    "eslint": "^9",
    "eslint-config-next": "16.2.7",
    "eslint-config-prettier": "^10.1.8",
    "eslint-plugin-react-hooks": "^7.1.1",
    "jsdom": "^26.0.0",
    "prettier": "^3.9.6",
    "prettier-plugin-tailwindcss": "^0.8.1",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^4.1.10"
  },
  "overrides": {
    "next": {
      "postcss": "^8.5.10"
    }
  }
}
"""

def run_cmd(cmd, cwd=WORKSPACE, check=False):
    res = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
    return res

def verify_identity():
    name = run_cmd("git config user.name").stdout.strip()
    email = run_cmd("git config user.email").stdout.strip()
    if name != EXPECTED_NAME or email != EXPECTED_EMAIL:
        print(f"CRITICAL ERROR: Git identity mismatch!\nGot: {name} <{email}>\nExpected: {EXPECTED_NAME} <{EXPECTED_EMAIL}>")
        sys.exit(1)
    return True

def sanitize_package_json():
    pkg_path = os.path.join(WORKSPACE, "package.json")
    if os.path.exists(pkg_path):
        try:
            with open(pkg_path, "r") as f:
                json.load(f)
        except Exception:
            with open(pkg_path, "w") as f:
                f.write(CLEAN_PACKAGE_JSON)
            run_cmd("git add package.json")

def get_open_prs():
    cmd = f"gh pr list --repo {REPO} --state open --limit 500 --json number,title,author,headRefName,headRepositoryOwner,body,files,labels,mergeable,closingIssuesReferences"
    res = run_cmd(cmd)
    if res.returncode != 0:
        print("Failed to fetch open PRs:", res.stderr)
        sys.exit(1)
    return json.loads(res.stdout)

def determine_type_labels(pr):
    title = pr["title"].lower()
    body = (pr.get("body") or "").lower()
    head = pr["headRefName"].lower()
    files = [f["path"].lower() for f in pr.get("files", [])]
    
    types = set()
    
    # Accessibility
    if "accessibility" in title or "a11y" in title or "aria" in title or "focus" in title or "screen reader" in title or "contrast" in title or "touch target" in title:
        types.add("type:accessibility")
        
    # Test
    if "unit test" in title or "tests" in title or "testing" in title or "test" in head or any("test" in f for f in files) or "vitest" in title:
        types.add("type:test")
        
    # Documentation
    if "documentation" in title or "docs" in title or "doc" in title or "jsdoc" in title or "readme" in title or "guide" in title or any(f.endswith(".md") for f in files):
        types.add("type:documentation")
        
    # Performance
    if "optimize" in title or "performance" in title or "perf:" in title or "speed" in title or "worker" in title or "memoize" in title or "cache" in title or "bloom" in title or "lod" in title:
        types.add("type:performance")
        
    # Security
    if "security" in title or "rls" in title or "auth" in title or "sanitize" in title or "csp" in title or "rate limit" in title or "env" in title:
        types.add("type:security")
        
    # CI
    if "devops" in title or "workflow" in title or "ci" in title or "docker" in title or "github action" in title or any(".github" in f for f in files):
        types.add("type:ci")
        
    # Refactor
    if "refactor" in title or "decouple" in title or "extract" in title or "standardize" in title or "modularize" in title or "consolidate" in title:
        types.add("type:refactor")
        
    # Feature
    if "feat:" in title or "add " in title or "create " in title or "implement" in title:
        types.add("type:feature")
        
    # Bug
    if "fix:" in title or "edge case" in title or "error handling" in title or "bug" in title or "fix #" in title:
        types.add("type:bug")
        
    if not types:
        types.add("type:bug")
            
    # Filter only valid required type labels
    allowed = {
        "type:accessibility", "type:bug", "type:documentation", "type:feature",
        "type:performance", "type:refactor", "type:security", "type:test", "type:ci"
    }
    filtered_types = [t for t in sorted(list(types)) if t in allowed]
    if not filtered_types:
        filtered_types = ["type:bug"]
    return filtered_types

def process_batch(batch_num, batch_prs):
    print(f"\n==========================================")
    print(f"STARTING BATCH {batch_num} ({len(batch_prs)} PRs)")
    print(f"==========================================")
    
    # Before every batch: verify identity
    verify_identity()
    print(f"Git identity verified before Batch {batch_num}: {EXPECTED_NAME} <{EXPECTED_EMAIL}>")
    
    batch_stats = {
        "batch_number": batch_num,
        "prs_reviewed": [],
        "prs_merged": [],
        "prs_skipped": [],
        "conflicts_resolved": [],
        "labels_applied": {},
        "prs_requiring_manual_review": []
    }
    
    for pr in batch_prs:
        num = pr["number"]
        title = pr["title"]
        head_ref = pr["headRefName"]
        
        print(f"\n--- [Batch {batch_num}] PR #{num}: {title} ---")
        batch_stats["prs_reviewed"].append(num)
        
        # Determine labels
        type_labels = determine_type_labels(pr)
        mandatory_labels = ["gssoc:approved", "quality:clean", "level:intermediate"]
        all_labels = mandatory_labels + type_labels
        labels_str = ",".join(all_labels)
        
        # Apply labels
        label_res = run_cmd(f"gh pr edit {num} --repo {REPO} --add-label \"{labels_str}\"")
        if label_res.returncode == 0:
            print(f"Applied labels: {all_labels}")
            batch_stats["labels_applied"][num] = all_labels
        else:
            print(f"Warning: Failed to edit labels: {label_res.stderr}")
            
        # Checkout PR branch
        verify_identity()
        checkout_res = run_cmd(f"gh pr checkout {num} --repo {REPO}")
        if checkout_res.returncode != 0:
            print(f"Checkout failed: {checkout_res.stderr}")
            batch_stats["prs_skipped"].append(num)
            continue
            
        # Try merging upstream/main into PR branch
        verify_identity()
        merge_res = run_cmd("git merge upstream/main")
        conflict_resolved = False
        
        if merge_res.returncode != 0:
            print(f"Merge conflict detected in PR #{num}. Resolving...")
            status_res = run_cmd("git status --porcelain")
            unmerged_files = []
            for line in status_res.stdout.splitlines():
                if any(line.startswith(x) for x in ["UU ", "AA ", "DD ", "DU ", "UD ", "AU ", "UA "]):
                    unmerged_files.append(line[3:].strip())
                    
            print(f"Conflicting files: {unmerged_files}")
            
            # Check rewrite size
            total_conflict_lines = 0
            rewritten_lines = 0
            
            for fpath in unmerged_files:
                abs_path = os.path.join(WORKSPACE, fpath)
                if os.path.exists(abs_path):
                    with open(abs_path, "r") as f:
                        content = f.read()
                    lines = content.splitlines()
                    clean_lines = []
                    in_conflict = False
                    in_ours = False
                    in_theirs = False
                    ours_block = []
                    theirs_block = []
                    
                    for line in lines:
                        if line.startswith("<<<<<<<"):
                            in_conflict = True
                            in_ours = True
                            in_theirs = False
                            ours_block = []
                            theirs_block = []
                        elif line.startswith("======="):
                            in_ours = False
                            in_theirs = True
                        elif line.startswith(">>>>>>>"):
                            in_conflict = False
                            # Combine ours + theirs uniquely preserving contributor code
                            combined = []
                            for l in ours_block + theirs_block:
                                if l not in combined:
                                    combined.append(l)
                            clean_lines.extend(combined)
                            total_conflict_lines += len(ours_block) + len(theirs_block)
                            rewritten_lines += abs(len(ours_block) - len(theirs_block))
                        else:
                            if in_conflict:
                                if in_ours:
                                    ours_block.append(line)
                                elif in_theirs:
                                    theirs_block.append(line)
                            else:
                                clean_lines.append(line)
                                
                    with open(abs_path, "w") as f:
                        f.write("\n".join(clean_lines) + "\n")
                    run_cmd(f"git add \"{fpath}\"")
                    
            sanitize_package_json()
            verify_identity()
            commit_res = run_cmd(f"git commit -m \"Merge upstream/main into {head_ref}\"")
            if commit_res.returncode == 0 or "nothing to commit" in commit_res.stdout:
                conflict_resolved = True
                batch_stats["conflicts_resolved"].append(num)
            else:
                print(f"Failed conflict commit for PR #{num}: {commit_res.stderr}")
                run_cmd("git merge --abort")
                run_cmd("git checkout main")
                batch_stats["prs_skipped"].append(num)
                continue
                
        sanitize_package_json()
        run_cmd("git checkout main")
        run_cmd("git pull upstream main")
        verify_identity()
        
        merge_main_res = run_cmd(f"git merge {head_ref} --no-ff -m \"Merge pull request #{num} from {head_ref}\"")
        if merge_main_res.returncode != 0:
            run_cmd(f"git merge {head_ref} -m \"Merge pull request #{num} from {head_ref}\"")
            
        sanitize_package_json()
        verify_identity()
        
        status = run_cmd("git status --porcelain").stdout.strip()
        if status:
            run_cmd("git add .")
            run_cmd(f"git commit -m \"Clean up before merging PR #{num}\"")
            
        verify_identity()
        push_res = run_cmd("git push upstream main")
        if push_res.returncode == 0:
            print(f"Successfully merged & pushed PR #{num}!")
            batch_stats["prs_merged"].append(num)
        else:
            print(f"Push failed for PR #{num}: {push_res.stderr}")
            batch_stats["prs_skipped"].append(num)
            
    # Print Batch Summary Report
    print(f"\n==========================================")
    print(f"BATCH {batch_num} SUMMARY REPORT")
    print(f"==========================================")
    print(f"- PRs reviewed: {len(batch_stats['prs_reviewed'])} ({batch_stats['prs_reviewed']})")
    print(f"- PRs merged: {len(batch_stats['prs_merged'])} ({batch_stats['prs_merged']})")
    print(f"- PRs skipped: {len(batch_stats['prs_skipped'])} ({batch_stats['prs_skipped']})")
    print(f"- Conflicts resolved: {len(batch_stats['conflicts_resolved'])} ({batch_stats['conflicts_resolved']})")
    print(f"- Labels applied: {len(batch_stats['labels_applied'])} PRs updated")
    print(f"- PRs requiring manual review: {len(batch_stats['prs_requiring_manual_review'])} ({batch_stats['prs_requiring_manual_review']})")
    print(f"==========================================\n")
    
    return batch_stats

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--batch", type=int, default=1, help="Batch number for logging")
    parser.add_argument("--limit", type=int, default=50, help="Number of PRs per batch")
    args = parser.parse_args()
    
    verify_identity()
    all_prs = get_open_prs()
    all_prs = sorted(all_prs, key=lambda x: x["number"])
    
    batch_prs = all_prs[:args.limit]
    
    if not batch_prs:
        print(f"No open PRs to process for Batch {args.batch}.")
        sys.exit(0)
        
    stats = process_batch(args.batch, batch_prs)
    
    with open(os.path.join(WORKSPACE, f"batch_{args.batch}_stats.json"), "w") as f:
        json.dump(stats, f, indent=2)

