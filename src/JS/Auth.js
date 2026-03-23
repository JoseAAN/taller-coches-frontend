import { loaderState } from "@/loaderState";
import { reactive } from "vue";


// cree este js para centralizar la lógica de auth, así no tenemos que hacer fetch siempre y podemos acceder a la info del user

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authState = reactive({
    user: localStorage.getItem("user_token")
        ? JSON.parse(localStorage.getItem("user"))
        : null,
});

export const fetchUserData = async () => {
    const token = localStorage.getItem("user_token");
    if (!token) {
        return;
    }
    
    try {
        const response = await fetch(`${BASE_URL}/user`, {
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
            },
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("user", JSON.stringify(data));
            authState.user = data;
        }
    } catch (error) {
        console.error("Error validando usuario:", error);
        localStorage.removeItem("user_token");
        authState.user = null;
    }
};

export const logout = () => {
    fetch(`${BASE_URL}/v1/logout`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${localStorage.getItem("user_token")}`,
        },
    })
    .then((response) => {
        if (!response.ok) {
            console.error("Error al cerrar sesión en el servidor");
        }
        authState.user = null;
        localStorage.removeItem("user_token");
        localStorage.removeItem("user");
    })
    .catch((error) => {
        console.error("Error al cerrar sesión:", error);
    });
};
