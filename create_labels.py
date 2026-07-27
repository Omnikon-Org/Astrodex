import subprocess

labels = [
    ("gssoc:approved", "GSSoC '26 Approved", "00ff00"),
    ("enhancement", "New feature or request", "a2eeef"),
    ("ui", "User Interface", "1d76db"),
    ("design", "Design and styling", "bfd4f2"),
    ("good first issue", "Good for newcomers", "7057ff"),
    ("bug", "Something isn't working", "d73a4a"),
    ("accessibility", "Accessibility (a11y)", "006b75"),
    ("3d", "Three.js and R3F", "b60205"),
    ("performance", "Performance improvements", "e99695"),
    ("math", "Kepler math and orbital mechanics", "0052cc"),
    ("security", "Security considerations", "ff9f1c"),
    ("refactor", "Code refactoring", "f9d0c4"),
    ("tooling", "Developer tooling", "c5def5"),
    ("typescript", "TypeScript types and configs", "3178c6"),
    ("react", "React specifics", "61dafb"),
    ("seo", "Search Engine Optimization", "fef2c0"),
    ("documentation", "Improvements or additions to documentation", "0075ca"),
    ("testing", "Testing suite", "5319e7"),
    ("ci/cd", "Continuous Integration / Deployment", "1d76db"),
    ("devops", "DevOps and infrastructure", "000000"),
    ("audio", "Audio and sound effects", "c2e0c6"),
    ("experimental", "Experimental features", "bfdadc"),
    ("mobile", "Mobile optimization", "d4c5f9")
]

for name, desc, color in labels:
    cmd = ["gh", "label", "create", name, "--description", desc, "--color", color, "--force"]
    try:
        subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"Created label: {name}")
    except subprocess.CalledProcessError as e:
        print(f"Failed to create label {name}: {e.stderr}")
