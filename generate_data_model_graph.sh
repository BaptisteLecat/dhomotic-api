#!/bin/bash

# Vérifie si la clé API OpenAI est définie
if [ -z "$OPENAI_API_KEY" ]; then
    echo "❌ Erreur : La clé API OpenAI n'est pas définie."
    exit 1
fi

# Vérifie si le modèle OpenAI est défini
if [ -z "$MODEL" ]; then
    echo "❌ Erreur : Le modèle OpenAI n'est pas défini."
    exit 1
fi

# Recherche récursive des fichiers .entity.ts dans tout le projet
FILES=$(find . -type f -name "*.entity.ts")

# Vérifie si des fichiers existent
if [ -z "$FILES" ]; then
    echo "❌ Aucun fichier .entity.ts trouvé dans le projet !"
    exit 1
fi

#Log la liste des fichiers trouvés
echo -e "📂 **Fichiers trouvés :**\n"
echo "$FILES"

PROMPT+="\nVoici le contenu de ces fichiers :\n\n"

# Lit et ajoute le contenu des fichiers au prompt
for file in $FILES; do
    PROMPT+="### Fichier: $file ###\n"
    CONTENT=$(cat "$file")
    PROMPT+="$CONTENT\n\n"
done

# Récupère le diagram.json actuel si il existe

if [ -f "diagram.json" ]; then
    PROMPT+="### JSON actuel ###\n"
    PROMPT+=$(cat "diagram.json")
fi

# Log du prompt
echo -e "\n🚀 **Prompt envoyé à l'API OpenAI :**\n"
echo -e "$PROMPT"

# Construction du JSON correctement échappé
JSON_PAYLOAD=$(jq -n \
  --arg model "$MODEL" \
  --arg content "$PROMPT" \
  '{
    model: $model,
    messages: [
      { role: "system", content: "Tu es un assistant qui génère du JSON pour expliciter et documenter des classes Typescript. Le format de réponse attendu est simplement du JSON rien de plus rien de moins (pas de balise de code, pas de texte autre). Ce doit être du JSON qui represente les valeurs qui pourraient exister en PROD. Tu dois imbriqué les objets si ils le sont. Attention très important, tu dois tenir compte du JSON actuel, le but est que les itérations soit stable. Il faut tenter de garder une structure similaire, sauf si la structure des classes et leurs liaison on été drastiquement modifiée. Soit vigilant et précis sur chacune des propriétes, un changement de nom, de type ou la suppression d un attribut doit faire l objet d une modification du JSON" },
      { role: "user", content: $content }
    ],
    temperature: 0.5
  }')

# Envoie la requête à l'API OpenAI
RESPONSE=$(curl -s https://api.openai.com/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENAI_API_KEY" \
    -d "$JSON_PAYLOAD")

# Vérifie si la requête a retourné une réponse
if [ -z "$RESPONSE" ]; then
    echo "❌ Erreur : L'API OpenAI n'a pas retourné de réponse."
    exit 1
fi

# Extraction du texte retourné par l'API
JSON_GRAPH=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

# Vérifie si la réponse est valide
if [ "$JSON_GRAPH" == "null" ]; then
    echo "❌ Erreur : L'API OpenAI n'a pas retourné de contenu valide."
    exit 1
fi

# Log du JSON retourné
echo -e "\n🎨 **JSON retourné par l'API OpenAI :**\n"
echo "$JSON_GRAPH"

# Sauvegarde dans un fichier
echo "$JSON_GRAPH" > diagram.json
echo "✅ JSON sauvegardé dans le fichier diagram.json"
