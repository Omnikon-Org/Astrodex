import subprocess
import time
import random

verbs = [
    "Refactor", "Optimize", "Add unit tests for", 
    "Improve accessibility of", "Update styling for", 
    "Fix edge cases in", "Add error handling to", 
    "Improve performance of", "Write inline documentation for",
    "Audit memory leaks in"
]

components = [
    "EarthMesh component", "CloudLayer shader", "Atmosphere rendering",
    "Asteroid InstancedMesh", "Kepler orbit solver", "Conjunction tracker",
    "Claim Button UI", "Settings Modal", "Mobile Navbar",
    "WebGL Loading Spinner", "React Error Boundary", "Toast Notifications",
    "Supabase Auth flow", "Supabase RLS policies", "Scene Content provider",
    "AppProvider context", "Camera Lerp logic", "Vis-Viva speed calculation",
    "Procedural texture generator", "Asteroid data fetching hook"
]

reasons = [
    "to improve frame rates on lower-end devices.",
    "to ensure better maintainability for future contributors.",
    "to align with modern React best practices.",
    "to prevent potential race conditions during state updates.",
    "to reduce the overall Next.js bundle size.",
    "to provide a smoother user experience on mobile.",
    "to handle unexpected API timeouts gracefully.",
    "to improve keyboard navigation and screen reader support.",
    "to make the 3D scene feel more cinematic.",
    "to ensure strict type safety across the codebase."
]

labels_pool = [
    ["gssoc", "gssoc:approved", "enhancement", "ui"],
    ["gssoc", "gssoc:approved", "enhancement", "3d", "performance"],
    ["gssoc", "gssoc:approved", "refactor", "react"],
    ["gssoc", "gssoc:approved", "bug", "math"],
    ["gssoc", "gssoc:approved", "documentation", "good first issue"],
    ["gssoc", "gssoc:approved", "security", "devops"],
    ["gssoc", "gssoc:approved", "testing", "ci/cd"],
    ["gssoc", "gssoc:approved", "accessibility", "ui"]
]

issues = []

# Generate 100 unique issues
used_titles = set()
while len(issues) < 100:
    v = random.choice(verbs)
    c = random.choice(components)
    r = random.choice(reasons)
    title = f"{v} the {c}"
    
    if title not in used_titles:
        used_titles.add(title)
        body = f"As part of our ongoing improvements, we need to {v.lower()} the {c} {r}\n\nPlease check the corresponding files in `src/` and ensure your changes do not break existing functionality. Leave a comment below if you'd like to be assigned to this task!"
        
        # Pick relevant labels based on component
        if "shader" in c or "Mesh" in c or "Camera" in c or "texture" in c or "WebGL" in c:
            label = ["gssoc", "gssoc:approved", "enhancement", "3d"]
        elif "Supabase" in c or "Auth" in c:
            label = ["gssoc", "gssoc:approved", "enhancement", "security"]
        elif "orbit" in c or "speed" in c or "tracker" in c:
            label = ["gssoc", "gssoc:approved", "enhancement", "math"]
        else:
            label = random.choice(labels_pool)
            
        issues.append({"title": title, "body": body, "labels": label})

print(f"Prepared {len(issues)} more issues. Starting creation...")

for i, issue in enumerate(issues):
    cmd = [
        "gh", "issue", "create",
        "--title", issue["title"],
        "--body", issue["body"],
        "--label", ",".join(issue["labels"]),
    ]
    
    try:
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"[{i+1}/100] Created: {issue['title']}")
    except subprocess.CalledProcessError as e:
        print(f"Failed to create issue {i+1}: {e.stderr}")
    
    time.sleep(1.5)

print("Finished creating 100 more issues!")
