# Firebase-store serverless backend

## Instalation

### Clone repo

```bash
git clone dirName
```

### Install pakages

```bash
npm i
```

### Provide your CREDENTIALS environment variable from generated json file.

1. Go to [firebase console](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk)
2. Choose your project
3. Generate new private key

```bash
# Linux or macOS:
export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"
# Windows:
$env:GOOGLE_APPLICATION_CREDENTIALS="[PATH]"

# For example:
export GOOGLE_APPLICATION_CREDENTIALS="./GOOGLE_APPLICATION_CREDENTIALS.json"
```

### Run test mode

```bash
npm run serve
```
