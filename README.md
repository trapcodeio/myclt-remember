# myclt-remember commands.

Set and get data in `ssh`.

## Installation
Install `clt` if not already installed.
```bash
npm install -g myclt
# OR
yarn global add myclt
```

Link the remember command to myclt as `r` for convenience.
```bash
clt /link/git https://github.com/trapcodeio/myclt-remember / r
```

To update the files of this command, run:
```bash
clt /link/git/update https://github.com/trapcodeio/myclt-remember
```

- `/` is the path to the `myclt.map.json` file in the repo.
- `r` is the command `namespace` to be used

Run `clt /list` to see the list of commands.