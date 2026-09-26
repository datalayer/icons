<!--
  ~ Copyright (c) 2023-2026 Datalayer, Inc.
  ~
  ~ MIT License
-->

# Making a release

A tag releases `@datalayer/icons-react` to npm, with no stored token: npm
trusts `.github/workflows/release.yaml` through OIDC (trusted publishing,
GitHub environment `npm`, with provenance). The tag names the version in
`icons-react/package.json`. `@datalayer/icons-all` (the root package) is
published by the same run whenever its own version is not on npm yet.

## Steps

1. Bump `version` in `icons-react/package.json` (and the root `package.json`
   when icons-all should ship too), on a branch, and open a pull request.
2. Merge, then tag the merge commit and push the tag:

   ```bash
   git checkout main && git pull
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

3. The `Release` workflow checks that the tag names icons-react's version,
   builds the icons and the packages, publishes what is not on npm yet, and
   creates a GitHub release with generated notes.

## Trusted publishing

npm packages `@datalayer/icons-react` and `@datalayer/icons-all`: GitHub
Actions, organization `datalayer`, repository `icons`, workflow filename
`release.yaml`, environment `npm`. npm provenance also checks each
`package.json`'s `repository.url`, which names this repository.

The registry matches the repository, the workflow filename and the
environment exactly; renaming any of them means re-registering.
