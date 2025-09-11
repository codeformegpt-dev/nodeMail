# הסר remote קיים (אם יש)
git remote remove origin 2>$null

# הוסף remote חדש
git remote add origin https://github.com/avrahambnm/nodeMail.git

# ודא שאתה על main
git branch -M main

# ודא ש-git מתעלם מ-node_modules
if (-not (Test-Path .gitignore)) {
    "node_modules/" | Out-File -Encoding UTF8 .gitignore
} elseif (-not (Select-String -Pattern "node_modules/" .gitignore -Quiet)) {
    Add-Content .gitignore "node_modules/"
}

# הוסף את כל הקבצים (git ידלג על node_modules לפי .gitignore)
git add .

# בצע commit עם הודעה
git commit -m "Update project for Vercel deployment with Serverless Function"

# דחוף ל-GitHub
git push -u origin main
