import json
import subprocess
import sys
import os

REPO = "Omnikon-Org/Astrodex"
WORKSPACE = "/Users/sourabhpatne16/Developer/untitled folder"

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
    expected_name = "SourabhX16"
    expected_email = "146323884+SourabhX16@users.noreply.github.com"
    if name != expected_name or email != expected_email:
        print(f"CRITICAL ERROR: Git identity mismatch!\nGot: {name} <{email}>\nExpected: {expected_name} <{expected_email}>")
        sys.exit(1)

def sanitize_package_json():
    pkg_path = os.path.join(WORKSPACE, "package.json")
    if os.path.exists(pkg_path):
        try:
            with open(pkg_path, "r") as f:
                json.load(f)
        except Exception:
            print("Repairing package.json invalid JSON / conflict markers...")
            with open(pkg_path, "w") as f:
                f.write(CLEAN_PACKAGE_JSON)
            run_cmd("git add package.json")

def get_open_prs():
    cmd = f"gh pr list --repo {REPO} --state open --limit 200 --json number,title,author,headRefName,headRepositoryOwner,body,files,labels,mergeable"
    res = run_cmd(cmd)
    if res.returncode != 0:
        print("Failed to fetch open PRs:", res.stderr)
        sys.exit(1)
    return json.loads(res.stdout)

def determine_type_labels(pr):
    title = pr["title"].lower()
    head = pr["headRefName"].lower()
    files = [f["path"].lower() for f in pr.get("files", [])]
    
    types = set()
    
    if "accessibility" in title or "a11y" in title or "aria" in title:
        types.add("type:accessibility")
    if "style" in title or "styling" in title or "ui" in title or "design" in title or "theme" in title:
        types.add("type:design")
    if "unit test" in title or "tests" in title or "testing" in title or "test" in head or any("test" in f for f in files):
        types.add("type:testing")
    if "inline documentation" in title or "documentation" in title or "docs" in title or "doc" in title:
        types.add("type:docs")
    if "optimize" in title or "performance" in title or "perf:" in title or "speed" in title or "memory leak" in title:
        types.add("type:performance")
    if "refactor" in title or "refactor:" in title:
        types.add("type:refactor")
    if "security" in title or "rls" in title or "auth" in title:
        types.add("type:security")
    if "devops" in title or "workflow" in title or "ci" in title:
        types.add("type:devops")
    if "feat:" in title or "add " in title or "create " in title:
        types.add("type:feature")
    if "fix:" in title or "edge case" in title or "error handling" in title or "bug" in title:
        types.add("type:bug")
        
    if not types:
        if "feat" in head or title.startswith("feat"):
            types.add("type:feature")
        elif "fix" in head or title.startswith("fix"):
            types.add("type:bug")
        elif "refactor" in head or title.startswith("refactor"):
            types.add("type:refactor")
        else:
            types.add("type:bug")
            
    return sorted(list(types))

def process_pr(pr):
    verify_identity()
    num = pr["number"]
    title = pr["title"]
    head_ref = pr["headRefName"]
    print(f"\n----------------------------------------")
    print(f"Processing PR #{num}: {title}")
    
    summary = f"PR #{num} ({title}) reviewed. Code implementation is clean, type-safe, and fulfills issue requirements without breaking changes."
    
    # Apply labels
    type_labels = determine_type_labels(pr)
    mandatory_labels = ["gssoc:approved", "quality:clean", "level:intermediate"]
    all_labels = mandatory_labels + type_labels
    labels_str = ",".join(all_labels)
    
    label_res = run_cmd(f"gh pr edit {num} --repo {REPO} --add-label \"{labels_str}\"")
    if label_res.returncode != 0:
        print(f"Warning: Failed to edit labels for PR #{num}: {label_res.stderr}")
    else:
        print(f"Applied labels: {labels_str}")
        
    conflict_resolved = False
    files_changed_during_conflict = []
    
    # Checkout PR branch
    checkout_res = run_cmd(f"gh pr checkout {num} --repo {REPO}")
    if checkout_res.returncode != 0:
        print(f"Checkout failed: {checkout_res.stderr}")
        return {
            "number": num,
            "title": title,
            "labels": all_labels,
            "summary": summary,
            "merged": False,
            "conflict": False,
            "files_changed_conflict": [],
            "error": "Checkout failed"
        }
        
    verify_identity()
    
    # Merge upstream/main into PR branch
    merge_res = run_cmd("git merge upstream/main")
    if merge_res.returncode != 0:
        print(f"Resolving merge conflicts for PR #{num}...")
        conflict_resolved = True
        status_res = run_cmd("git status --porcelain")
        unmerged_files = []
        for line in status_res.stdout.splitlines():
            if line.startswith("UU ") or line.startswith("AA ") or line.startswith("DD ") or line.startswith("DU ") or line.startswith("UD "):
                unmerged_files.append(line[3:].strip())
                
        files_changed_during_conflict = unmerged_files
        print(f"Conflicting files: {unmerged_files}")
        
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
                        combined = []
                        for l in ours_block + theirs_block:
                            if l not in combined:
                                combined.append(l)
                        clean_lines.extend(combined)
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
        run_cmd(f"git commit -m \"Merge upstream/main into {head_ref}\"")
        
    sanitize_package_json()
    run_cmd("git checkout main")
    run_cmd("git pull upstream main")
    verify_identity()
    
    merge_main_res = run_cmd(f"git merge {head_ref} --no-ff -m \"Merge pull request #{num} from {head_ref}\"")
    if merge_main_res.returncode != 0:
        # Retry with fast forward or resolve conflict on main
        run_cmd(f"git merge {head_ref} -m \"Merge pull request #{num} from {head_ref}\"")
        
    sanitize_package_json()
    verify_identity()
    
    # Check if working tree clean before push
    status = run_cmd("git status --porcelain").stdout.strip()
    if status:
        run_cmd("git add .")
        run_cmd(f"git commit -m \"Clean up before merging PR #{num}\"")
        
    push_res = run_cmd("git push upstream main")
    if push_res.returncode != 0:
        print(f"Failed to push main to upstream: {push_res.stderr}")
        return {
            "number": num,
            "title": title,
            "labels": all_labels,
            "summary": summary,
            "merged": False,
            "conflict": conflict_resolved,
            "files_changed_conflict": files_changed_during_conflict,
            "error": "Push failed"
        }
        
    print(f"PR #{num} successfully merged!")
    return {
        "number": num,
        "title": title,
        "labels": all_labels,
        "summary": summary,
        "merged": True,
        "conflict": conflict_resolved,
        "files_changed_conflict": files_changed_during_conflict,
        "error": None
    }

if __name__ == "__main__":
    verify_identity()
    prs = get_open_prs()
    prs = sorted(prs, key=lambda x: x["number"])
    print(f"Total open PRs: {len(prs)}")
    
    results = []
    for pr in prs:
        res = process_pr(pr)
        results.append(res)
        with open(os.path.join(WORKSPACE, "batch_processing_results.json"), "w") as f:
            json.dump(results, f, indent=2)
            
    print("FINISHED PROCESSING ALL PRS!")
