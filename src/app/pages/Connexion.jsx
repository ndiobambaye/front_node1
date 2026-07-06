import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';



const Connexion = () => {

  const [ email , setEmail ] = useState('');
  const [ password , setPassword ] = useState('');
  const navigate = useNavigate();

  const Laconnexion = async (e)  => {
       e.preventDefault();


        if (!email || !password) {
            alert("Veuillez remplir tous les champs");
            return;
        }

        const data = {
            email: email,
            password: password
        };
       
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/connexion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();
           console.log({
                      email,
                 password
                 });

         if (response.ok) {
             if (result.token) {
              localStorage.setItem("token", result.token);
              localStorage.setItem("user", JSON.stringify(result.user));
             }
                alert(`Connexion réussie `);
                   navigate('/accueil');
    
                } else {
                 alert(result.message || "Identifiants incorrects");
            }
        } catch (error) {
            console.error(error);
            alert("Erreur serveur. Veuillez réessayer.");
        }


  }



  return (
      <div className="w-screen h-screen bg-paper flex items-center justify-center px-4">

        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-card-hover border border-ink-100">

            <div className="flex items-center justify-center gap-1 mono-tag mb-6">
              <span className="text-primary-500 text-lg font-medium">{'>'}</span>
              <span className="text-lg font-medium text-ink-900">devask</span>
              <span className="text-lg text-primary-500 cursor-blink">_</span>
            </div>

            <h1 className="text-center font-heading font-semibold text-2xl text-ink-900 mb-6">Connexion</h1>

            <form onSubmit={Laconnexion} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-ink-700">Email</label>
                    <input
                        className="border border-ink-200 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all"
                        type="email"
                        placeholder="exemple@gmail.com"
                        value = {email}
                        onChange={ (e) => setEmail(e.target.value)}
                         />
                </div>
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-ink-700">Mot de passe</label>
                    <input
                        className="border border-ink-200 rounded-lg py-2.5 px-3 text-sm outline-none focus:border-mauve-400 focus:ring-2 focus:ring-mauve-100 transition-all"
                        type="password"
                        placeholder="Mot de passe"
                        value = {password}
                        onChange={ (e) => setPassword(e.target.value)} />
                </div>

                <button type="submit" className="w-full bg-mauve-700 hover:bg-mauve-600 text-paper font-medium rounded-lg mt-6 py-2.5 transition-colors">Se connecter</button>
                <Link to="/inscription" className="text-center text-sm text-primary-500 hover:text-primary-600 font-medium">S'inscrire</Link>
            </form>

        </div>

    </div>
  )
}

export default Connexion
