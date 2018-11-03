# Links

- Site : [twitelo.en-f.eu](https://twitelo.en-f.eu)
- Github client : [github.com/iFonny/twitelo-client](https://github.com/iFonny/twitelo-client)
- Github server : [github.com/iFonny/twitelo-server](https://github.com/iFonny/twitelo-server)

# LOCAL

## PREREQUISITES :

- PM2 (`npm install pm2 -g`)
- RethinkDB ([https://rethinkdb.com/docs/install/](https://rethinkdb.com/docs/install/))
- Config file `configs/secret.json`

```bash
npm install
npm start
```

# DEPLOYMENT

## CONFIG

App Config: Rename `secret.json.example` and add secrets and API Keys

SSH server config: `pm2-config.json`

## SERVER PREREQUISITES

- PM2 (`npm install pm2 -g`)
- RethinkDB ([https://rethinkdb.com/docs/install/](https://rethinkdb.com/docs/install/))
- A config file in `/root/configs/EpitechTwiteloApp/secret.json` (path can be changed in `pm2-config.json`)

## First time :

```bash
npm run deploy-setup
```

## Update :

```bash
npm run deploy-update
```

# OTHERS

Small DOC : https://ifonny.gitbooks.io/twiteloapp/
