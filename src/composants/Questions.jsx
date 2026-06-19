import React from "react";
import QuestionCard from "./QuestionCard";

const Questions = () => {
  const questions = [
    {
      id: 1,
      titre: "Comment utiliser useEffect dans React pour récupérer des données ?",
      description:
        "Je débute avec React et je souhaite récupérer des données depuis une API avec useEffect.",
      heure: "09:15",
      auteur: "Aminata Ndiaye",
    },
    {
      id: 2,
      titre: "Pourquoi mon serveur Express retourne une erreur 404 ?",
      description:
        "J'ai créé une route GET /users mais lorsque je fais une requête depuis Postman, je reçois une erreur 404.",
      heure: "10:30",
      auteur: "Mamadou Diallo",
    },
    {
      id: 3,
      titre: "Comment connecter Spring Boot à une base de données MySQL ?",
      description:
        "Mon application Spring Boot ne parvient pas à se connecter à MySQL.",
      heure: "11:45",
      auteur: "Fatou Sow",
    },
    {
      id: 4,
      titre: "Quelle est la différence entre let, const et var en JavaScript ?",
      description:
        "Je vois souvent ces trois mots-clés dans les exemples JavaScript.",
      heure: "14:20",
      auteur: "Cheikh Ba",
    },
    {
      id: 5,
      titre: "Comment créer une authentification JWT avec Node.js ?",
      description:
        "Je développe une API avec Express et je souhaite sécuriser mes routes avec JWT.",
      heure: "16:05",
      auteur: "Khadija Fall",
    },
  ];

  return (
    <div className="w-full p-10">
      <h1 className="text-3xl font-bold mb-6">Les questions</h1>

      <div className="space-y-4">
        {questions.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
          />
        ))}
      </div>
    </div>
  );
};

export default Questions;