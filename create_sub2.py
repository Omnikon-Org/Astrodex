import subprocess
issues = [
    {
        "title": "Implement NASA NeoWs API client for real-time near-Earth asteroid data in src/lib/neows.ts",
        "labels": ["gssoc", "level:advanced", "type:feature"],
        "body": """### Problem
`src/lib/neows.ts` is currently a 66-byte stub file. AstroDex relies solely on procedurally generated orbital data without an option to fetch live near-Earth object telemetry from NASA APIs.

### Why it matters
Integrating live NASA NeoWs data provides real astronomical observation data for near-Earth asteroids.

### Expected behaviour
`neows.ts` should fetch near-Earth object data from `api.nasa.gov/neo/rest/v1/feed` and parse parameters into `AsteroidData` objects.

### Acceptance criteria
- [ ] Implement `fetchNeoWsFeed()` in `src/lib/neows.ts`.
- [ ] Parse approach date, miss distance (km), and estimated velocity parameters.
- [ ] Fall back gracefully to procedural data if API rate limit or key error occurs.

### Likely files/components affected
- `src/lib/neows.ts`
- `src/lib/store.tsx`"""
    },
    {
        "title": "Implement permanent object URL permalink generator and router in src/lib/permalinks.ts",
        "labels": ["gssoc", "level:intermediate", "type:feature"],
        "body": """### Problem
`src/lib/permalinks.ts` is a 64-byte stub file. Selecting an asteroid in the 3D scene does not update the browser URL bar or generate a shareable object link (`/object/AST-0042`).

### Why it matters
Shareable permalinks allow users and space operators to share specific asteroid telemetry views directly via URL.

### Expected behaviour
`permalinks.ts` should convert asteroid IDs to query parameters or dedicated routes and sync with Next.js router.

### Acceptance criteria
- [ ] Implement `getPermalinkForObject(id: number): string`.
- [ ] Update browser location hash/query on object selection in `store.tsx`.
- [ ] Automatically select and focus camera on object when navigating directly to a permalink URL.

### Likely files/components affected
- `src/lib/permalinks.ts`
- `src/lib/store.tsx`
- `src/app/page.tsx`"""
    }
]
for i in issues:
    cmd = ['gh', 'issue', 'create', '--title', i['title'], '--body', i['body']]
    for l in i['labels']:
        cmd.extend(['--label', l])
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(res.stdout)
