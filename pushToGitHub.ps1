# בדוק אם כבר מחובר ל-remote
$remote = git remote -v
if (-not $remote) {
    git remote add origin https://github.com/codeformegpt-dev/nodeMail.git
}

# ודא שאתה על main
git branch -M main

# הוסף את כל השינויים
git add .

# בצע commit עם הודעה
git commit -m "Update project for Vercel deployment with Serverless Function"

# דחוף ל-GitHub
git push -u origin main
