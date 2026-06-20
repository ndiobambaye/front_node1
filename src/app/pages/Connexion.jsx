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
                }
                alert(`Connexion réussie ` );
                navigate('/');
                
            } else {
                alert(result.message || "Identifiants incorrects");
            }

        } catch (error) {
            console.error(error);
            alert("Erreur serveur. Veuillez réessayer.");
        }


  }



  return (
      <div className="w-screen h-screen  flex items-center justify-center">

        <div className="w-full max-w-xl p-5 bg-white">

            <h1 className="text-center font-bold text-xl">Connexion</h1>

            <form  onSubmit={Laconnexion} >
                <div className="flex flex-col gap-2">
                    <label >Email</label>
                    <input
                        className="border py-1 px-3 border-black"
                        type="email" 
                        placeholder="exemple@gmail.com"
                        value = {email}
                        onChange={ (e) => setEmail(e.target.value)}
                         />
                </div>
                <div className="flex flex-col gap-2 mt-2">
                    <label >Mot de passe</label>
                    <input
                        className="border py-1 px-3 border-black"
                        type="password" 
                        placeholder="Mot de passe"
                        value = {password}
                        onChange={ (e) => setPassword(e.target.value)} />
                </div>

                <button type="submit"  className="w-full bg-black text-white mt-10 py-2 mb-2">Se connecter</button>
                <Link to="/inscription" className="text-red-600 font-bold underline">S'inscrire</Link>
            </form>

        </div>

    </div>
  )
}

export default Connexion
